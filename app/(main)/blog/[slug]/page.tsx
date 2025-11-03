import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react"
import type { Metadata } from "next"
import type { IBlog } from "@/lib/db/models/Blog"
import connectDB from "@/lib/db/mongodb"
import Blog from "@/lib/db/models/Blog"
import { SITE_CONFIG } from "@/lib/constants"
import { formatBlogContent } from "@/lib/blog/formatContent"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  try {
    const { slug } = await params
    await connectDB()
    const blog = (await Blog.findOne({ slug, published: true })
      .lean<IBlog>()
      .exec()) as IBlog | null

    if (!blog) {
      return {
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      }
    }

    const metaTitle = blog.metaTitle || blog.title
    const metaDescription = blog.metaDescription || blog.excerpt || blog.content.substring(0, 160)
    const canonicalUrl = blog.canonicalUrl || `${SITE_CONFIG.url}/blog/${blog.slug}`
    const ogImage = blog.ogImage || `${SITE_CONFIG.url}/og-image.jpg`
    const ogTitle = blog.ogTitle || blog.title
    const ogDescription = blog.ogDescription || metaDescription
    const twitterTitle = blog.twitterTitle || blog.title
    const twitterDescription = blog.twitterDescription || metaDescription
    const twitterImage = blog.twitterImage || ogImage

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: blog.keywords && blog.keywords.length > 0 ? blog.keywords : blog.tags,
      authors: [{ name: blog.author }],
      creator: blog.author,
      metadataBase: new URL(SITE_CONFIG.url),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        locale: "en_US",
        url: `${SITE_CONFIG.url}/blog/${blog.slug}`,
        title: ogTitle,
        description: ogDescription,
        siteName: SITE_CONFIG.name,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        publishedTime: blog.publishedAt?.toString(),
        modifiedTime: blog.updatedAt?.toString(),
        authors: [blog.author],
        tags: blog.tags,
      },
      twitter: {
        card: blog.twitterCard || "summary_large_image",
        title: twitterTitle,
        description: twitterDescription,
        images: [twitterImage],
        creator: "@nextfile",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Blog Post",
      description: "Read our blog post",
    }
  }
}

async function getBlog(slug: string): Promise<IBlog | null> {
  try {
    await connectDB()
    const blog = (await Blog.findOne({ slug, published: true })
      .lean<IBlog>()
      .exec()) as IBlog | null
    return blog
  } catch (error) {
    console.error("Error fetching blog:", error)
    return null
  }
}

function generateStructuredData(blog: any) {
  const baseUrl = SITE_CONFIG.url
  const blogUrl = `${baseUrl}/blog/${blog.slug}`

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || blog.metaDescription || blog.content.substring(0, 160),
    image: blog.ogImage || `${baseUrl}/og-image.jpg`,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
    keywords: blog.keywords?.join(", ") || blog.tags?.join(", ") || "",
    articleSection: blog.category || "",
    inLanguage: "en-US",
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  const structuredData = generateStructuredData(blog)
  const readingTime = blog.readingTime || Math.ceil((blog.content?.split(/\s+/).length || 0) / 200)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <article>
            <div className="mb-6">
              {blog.category && (
                <div className="mb-2 text-sm font-medium text-primary">
                  {blog.category}
                </div>
              )}
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                {blog.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {blog.views || 0} views
                </div>
                <div>By {blog.author}</div>
              </div>
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {blog.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {blog.excerpt && (
              <div className="mb-6 text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
                {blog.excerpt}
              </div>
            )}

            <Card>
              <CardContent className="py-8 px-6">
                <div 
                  className="blog-content text-foreground leading-relaxed
                    [&_p]:mb-4 [&_p]:text-base [&_p]:leading-7
                    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-border
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-border
                    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                    [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-2
                    [&_li]:mb-2 [&_li]:leading-7
                    [&_strong]:font-semibold [&_strong]:text-foreground
                    [&_em]:italic
                    [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:pr-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:bg-muted/50
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                    [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:text-sm
                    [&_img]:rounded-lg [&_img]:my-6 [&_img]:mx-auto [&_img]:max-w-full [&_img]:h-auto
                    [&_iframe]:w-full [&_iframe]:my-6 [&_iframe]:rounded-lg [&_iframe]:aspect-video
                    [&_hr]:my-8 [&_hr]:border-t-2 [&_hr]:border-border
                    [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse
                    [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted
                    [&_td]:border [&_td]:border-border [&_td]:p-2"
                  dangerouslySetInnerHTML={{ __html: formatBlogContent(blog.content) }} 
                />
              </CardContent>
            </Card>
          </article>
        </div>
      </div>
    </>
  )
}
