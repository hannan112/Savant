import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/lib/db/models/Blog";

// GET all blogs
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    const query: any = {};
    
    // If not admin, only show published blogs
    if (!session || (session.user as any)?.role !== "admin") {
      query.published = true;
    } else if (published !== null) {
      // Admin can filter by published status
      query.published = published === "true";
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Blog.countDocuments(query);

    return NextResponse.json({
      blogs: blogs.map((blog: any) => ({
        id: blog._id.toString(),
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        author: blog.author,
        authorId: blog.authorId,
        published: blog.published,
        featured: blog.featured,
        tags: blog.tags,
        category: blog.category,
        metaTitle: blog.metaTitle,
        metaDescription: blog.metaDescription,
        keywords: blog.keywords,
        canonicalUrl: blog.canonicalUrl,
        ogImage: blog.ogImage,
        ogTitle: blog.ogTitle,
        ogDescription: blog.ogDescription,
        twitterCard: blog.twitterCard,
        twitterTitle: blog.twitterTitle,
        twitterDescription: blog.twitterDescription,
        twitterImage: blog.twitterImage,
        focusKeyword: blog.focusKeyword,
        readingTime: blog.readingTime,
        views: blog.views,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        publishedAt: blog.publishedAt,
      })),
      total,
      limit,
      skip,
    });
  } catch (error: any) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs", details: error.message },
      { status: 500 }
    );
  }
}

// POST create new blog
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      published = false,
      featured = false,
      tags = [],
      category,
      metaTitle,
      metaDescription,
      keywords = [],
      canonicalUrl,
      ogImage,
      ogTitle,
      ogDescription,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      focusKeyword,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if slug already exists
    const existingBlog = await Blog.findOne({
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    // Truncate metaDescription to 160 characters if needed
    let truncatedMetaDescription = metaDescription;
    if (metaDescription && metaDescription.length > 160) {
      truncatedMetaDescription = metaDescription.substring(0, 157) + "...";
    }

    const blog = await Blog.create({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content,
      excerpt,
      author: session.user?.name || session.user?.email || "Admin",
      authorId: (session.user as any)?.id || "",
      published,
      featured,
      tags: Array.isArray(tags) ? tags : [],
      category,
      metaTitle,
      metaDescription: truncatedMetaDescription,
      keywords: Array.isArray(keywords) ? keywords : [],
      canonicalUrl,
      ogImage,
      ogTitle,
      ogDescription,
      twitterCard: twitterCard || 'summary_large_image',
      twitterTitle,
      twitterDescription,
      twitterImage,
      focusKeyword,
    });

    try {
      revalidatePath("/blog");
      if (blog.published && blog.slug) {
        revalidatePath(`/blog/${blog.slug}`);
      }
    } catch {}

    return NextResponse.json({
      id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      authorId: blog.authorId,
      published: blog.published,
      featured: blog.featured,
      tags: blog.tags,
      category: blog.category,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      keywords: blog.keywords,
      canonicalUrl: blog.canonicalUrl,
      ogImage: blog.ogImage,
      ogTitle: blog.ogTitle,
      ogDescription: blog.ogDescription,
      twitterCard: blog.twitterCard,
      twitterTitle: blog.twitterTitle,
      twitterDescription: blog.twitterDescription,
      twitterImage: blog.twitterImage,
      focusKeyword: blog.focusKeyword,
      readingTime: blog.readingTime,
      views: blog.views,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      publishedAt: blog.publishedAt,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create blog:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create blog", details: error.message },
      { status: 500 }
    );
  }
}

