import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import Blog, { IBlog } from "@/lib/db/models/Blog";

// GET single blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = (await Blog.findById(id)
      .lean<IBlog & { _id: any }>()
      .exec()) as (IBlog & { _id: any }) | null;

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const session = await auth();
    
    // Only show unpublished blogs to admins
    if (!blog.published && (!session || (session.user as any)?.role !== "admin")) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Increment views
    await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });

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
      views: (blog.views || 0) + 1,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      publishedAt: blog.publishedAt,
    });
  } catch (error: any) {
    console.error("Failed to fetch blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog", details: error.message },
      { status: 500 }
    );
  }
}

// PUT update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      published,
      featured,
      tags,
      category,
      metaTitle,
      metaDescription,
      keywords,
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

    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== blog.slug) {
      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog && existingBlog._id.toString() !== id) {
        return NextResponse.json(
          { error: "A blog with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update fields
    if (title !== undefined) blog.title = title;
    if (slug !== undefined) blog.slug = slug;
    if (content !== undefined) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (published !== undefined) blog.published = published;
    if (featured !== undefined) blog.featured = featured;
    if (tags !== undefined) blog.tags = Array.isArray(tags) ? tags : [];
    if (category !== undefined) blog.category = category;
    if (metaTitle !== undefined) blog.metaTitle = metaTitle;
    if (metaDescription !== undefined) {
      // Truncate metaDescription to 160 characters if needed
      if (metaDescription.length > 160) {
        blog.metaDescription = metaDescription.substring(0, 157) + "...";
      } else {
        blog.metaDescription = metaDescription;
      }
    }
    if (keywords !== undefined) blog.keywords = Array.isArray(keywords) ? keywords : [];
    if (canonicalUrl !== undefined) blog.canonicalUrl = canonicalUrl;
    if (ogImage !== undefined) blog.ogImage = ogImage;
    if (ogTitle !== undefined) blog.ogTitle = ogTitle;
    if (ogDescription !== undefined) blog.ogDescription = ogDescription;
    if (twitterCard !== undefined) blog.twitterCard = twitterCard;
    if (twitterTitle !== undefined) blog.twitterTitle = twitterTitle;
    if (twitterDescription !== undefined) blog.twitterDescription = twitterDescription;
    if (twitterImage !== undefined) blog.twitterImage = twitterImage;
    if (focusKeyword !== undefined) blog.focusKeyword = focusKeyword;

    await blog.save();

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
    });
  } catch (error: any) {
    console.error("Failed to update blog:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update blog", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog", details: error.message },
      { status: 500 }
    );
  }
}

