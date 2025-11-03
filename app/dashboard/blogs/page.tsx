"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, Save, X, ArrowLeft, Sparkles, Wand2 } from "lucide-react"
import Link from "next/link"

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import("@/components/blog/rich-text-editor").then((mod) => ({ default: mod.RichTextEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-lg min-h-[400px] flex items-center justify-center bg-muted/50">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
)

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  author: string
  published: boolean
  featured: boolean
  tags: string[]
  category?: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  twitterCard?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  focusKeyword?: string
  views?: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export default function BlogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatorForm, setGeneratorForm] = useState({
    topic: "",
    targetWords: 1000,
    style: "professional",
    tone: "informative",
    includeHeadings: true,
    focusKeyword: "",
    targetAudience: "general audience",
  })
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
    featured: false,
    tags: [],
    category: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    canonicalUrl: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    focusKeyword: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchBlogs()
    }
  }, [status, router])

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      const response = await fetch("/api/blogs")
      if (!response.ok) {
        throw new Error("Failed to fetch blogs")
      }
      const data = await response.json()
      setBlogs(data.blogs || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id)
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      published: blog.published,
      featured: blog.featured,
      tags: blog.tags || [],
      category: blog.category || "",
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
      keywords: blog.keywords || [],
      canonicalUrl: blog.canonicalUrl || "",
      ogImage: blog.ogImage || "",
      ogTitle: blog.ogTitle || "",
      ogDescription: blog.ogDescription || "",
      twitterCard: blog.twitterCard || "summary_large_image",
      twitterTitle: blog.twitterTitle || "",
      twitterDescription: blog.twitterDescription || "",
      twitterImage: blog.twitterImage || "",
      focusKeyword: blog.focusKeyword || "",
    })
    setShowForm(true)
    // Scroll to form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleNew = () => {
    setEditingId(null)
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      published: false,
      featured: false,
      tags: [],
      category: "",
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      canonicalUrl: "",
      ogImage: "",
      ogTitle: "",
      ogDescription: "",
      twitterCard: "summary_large_image",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      focusKeyword: "",
    })
    setShowForm(true)
  }

  const handleGenerate = async () => {
    try {
      setGenerating(true)
      setError("")

      const response = await fetch("/api/blogs/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatorForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate blog")
      }

      const generated = await response.json()

      // Populate form with generated content
      setFormData({
        title: generated.title,
        slug: generated.slug,
        content: generated.content,
        excerpt: generated.excerpt,
        metaDescription: generated.metaDescription,
        tags: generated.keywords || [],
        published: false,
        featured: false,
      })

      setShowGenerator(false)
      setShowForm(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      published: false,
      featured: false,
      tags: [],
      category: "",
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      canonicalUrl: "",
      ogImage: "",
      ogTitle: "",
      ogDescription: "",
      twitterCard: "summary_large_image",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      focusKeyword: "",
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError("")

      const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save blog")
      }

      await fetchBlogs()
      handleCancel()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete blog")
      }

      await fetchBlogs()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (blog: Blog) => {
    try {
      setError("")

      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !blog.published,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update blog")
      }

      await fetchBlogs()
    } catch (err: any) {
      setError(err.message)
      console.error("Toggle publish error:", err)
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Blog
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {showGenerator && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Blog Generator
            </CardTitle>
            <CardDescription>
              Generate a comprehensive 1000+ word blog post powered by AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                value={generatorForm.topic}
                onChange={(e) => setGeneratorForm({ ...generatorForm, topic: e.target.value })}
                placeholder="e.g., How to Convert PDF to Word"
              />
            </div>

            <div>
              <Label htmlFor="targetWords">Target Words *</Label>
              <Input
                id="targetWords"
                type="number"
                min="1000"
                value={generatorForm.targetWords}
                onChange={(e) => setGeneratorForm({ ...generatorForm, targetWords: parseInt(e.target.value) || 1000 })}
                placeholder="1000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 1000 words recommended for SEO
              </p>
            </div>

            <div>
              <Label htmlFor="focusKeyword">Focus Keyword (Optional)</Label>
              <Input
                id="focusKeyword"
                value={generatorForm.focusKeyword}
                onChange={(e) => setGeneratorForm({ ...generatorForm, focusKeyword: e.target.value })}
                placeholder="e.g., pdf to word converter"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to auto-generate from topic
              </p>
            </div>

            <div>
              <Label htmlFor="style">Writing Style</Label>
              <select
                id="style"
                className="w-full px-3 py-2 border rounded-md"
                value={generatorForm.style}
                onChange={(e) => setGeneratorForm({ ...generatorForm, style: e.target.value })}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="academic">Academic</option>
                <option value="conversational">Conversational</option>
              </select>
            </div>

            <div>
              <Label htmlFor="tone">Tone</Label>
              <select
                id="tone"
                className="w-full px-3 py-2 border rounded-md"
                value={generatorForm.tone}
                onChange={(e) => setGeneratorForm({ ...generatorForm, tone: e.target.value })}
              >
                <option value="informative">Informative</option>
                <option value="persuasive">Persuasive</option>
                <option value="educational">Educational</option>
                <option value="how-to">How-To</option>
              </select>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={generatorForm.targetAudience}
                onChange={(e) => setGeneratorForm({ ...generatorForm, targetAudience: e.target.value })}
                placeholder="e.g., small business owners, students"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeHeadings"
                checked={generatorForm.includeHeadings}
                onChange={(e) => setGeneratorForm({ ...generatorForm, includeHeadings: e.target.checked })}
              />
              <Label htmlFor="includeHeadings" className="cursor-pointer">
                Include HTML headings (H2, H3)
              </Label>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleGenerate} 
                disabled={generating || !generatorForm.topic.trim() || generatorForm.targetWords < 1000}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Blog
                  </>
                )}
              </Button>
              <Button onClick={() => setShowGenerator(false)} variant="outline" disabled={generating}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Blog" : "Create New Blog"}</CardTitle>
            <CardDescription>
              {editingId ? "Update blog post details" : "Fill in the details for your new blog post"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Blog post title"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="blog-post-slug"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt || ""}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Short description of the blog post (max 300 characters)"
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(formData.excerpt || "").length}/300 characters
              </p>
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                content={formData.content || ""}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Start writing your blog post... You can use the toolbar above to format text, add headings, insert images, and more."
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle || ""}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO meta title"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription || ""}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO meta description (150-160 characters recommended)"
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(formData.metaDescription || "").length}/160 characters
                {(formData.metaDescription || "").length >= 160 && (
                  <span className="text-yellow-500 ml-2">At maximum length</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published || false}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <span className={formData.published ? "font-semibold" : ""}>
                  Published {!formData.published && <span className="text-xs text-yellow-600">(Required to show on blog page)</span>}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span>Featured</span>
              </label>
            </div>
            {!formData.published && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This blog is set as draft. It will only appear on the public blog page after you check "Published" and save.
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {blogs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No blogs yet. Create your first blog post!</p>
            </CardContent>
          </Card>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{blog.title}</CardTitle>
                      {blog.published ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                      {blog.featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <CardDescription className="mb-2">
                      {blog.excerpt || "No excerpt"}
                    </CardDescription>
                    <div className="text-sm text-muted-foreground space-x-4">
                      <span>Slug: {blog.slug}</span>
                      <span>Views: {blog.views || 0}</span>
                      <span>Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(blog)}
                      title={blog.published ? "Unpublish" : "Publish"}
                    >
                      {blog.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

