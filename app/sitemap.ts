import { MetadataRoute } from "next"
import { SITE_CONFIG, CONVERTERS } from "@/lib/constants"
import connectDB from "@/lib/db/mongodb"
import Blog from "@/lib/db/models/Blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url

  const routes = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/blog",
    "/tools/paraphraser",
    ...CONVERTERS.map((c) => c.href),
  ]

  // Fetch published blogs from database
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    await connectDB()
    const blogs = await Blog.find({ published: true })
      .select("slug updatedAt publishedAt")
      .lean()
    
    blogPosts = blogs.map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: blog.featured ? 0.8 : 0.7,
    }))
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error)
    // Fallback to static blog posts if database fails
    blogPosts = [
      {
        url: `${baseUrl}/blog/how-to-convert-pdf-to-word-online-for-free`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
    ]
  }

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...blogPosts,
  ]
}

