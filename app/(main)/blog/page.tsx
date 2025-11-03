import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/constants"
import { ArrowRight, Calendar, Clock, Eye } from "lucide-react"
import connectDB from "@/lib/db/mongodb"
import Blog from "@/lib/db/models/Blog"

export const metadata: Metadata = {
  title: `Blog - ${SITE_CONFIG.name}`,
  description: "Read our latest articles about file conversion, text paraphrasing, productivity tips, and more.",
}

async function getBlogs() {
  try {
    await connectDB()
    
    // Only fetch published blogs for public blog page
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
    
    return blogs.map((blog: any) => ({
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt || blog.metaDescription || blog.content.substring(0, 160) + "...",
      author: blog.author,
      date: blog.publishedAt || blog.createdAt,
      readTime: blog.readingTime ? `${blog.readingTime} min read` : "5 min read",
      category: blog.category || "General",
      views: blog.views || 0,
      featured: blog.featured || false,
    }))
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return []
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogs()
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Tips, guides, and insights about file conversion and text
            paraphrasing
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card 
                key={post.slug} 
                className={`hover:shadow-lg transition-shadow ${post.featured ? 'border-2 border-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xs font-medium text-primary">
                      {post.category}
                    </div>
                    {post.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views} views
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

