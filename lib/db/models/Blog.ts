import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  authorId: string;
  published: boolean;
  featured?: boolean;
  tags?: string[];
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  focusKeyword?: string;
  readingTime?: number;
  views?: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    keywords: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      trim: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
      trim: true,
    },
    ogTitle: {
      type: String,
      trim: true,
    },
    ogDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image'],
      default: 'summary_large_image',
    },
    twitterTitle: {
      type: String,
      trim: true,
    },
    twitterDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    twitterImage: {
      type: String,
      trim: true,
    },
    focusKeyword: {
      type: String,
      trim: true,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ published: 1, createdAt: -1 });
BlogSchema.index({ published: 1, publishedAt: -1 });
BlogSchema.index({ featured: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ keywords: 1 });

// Combined pre-save hooks
BlogSchema.pre('save', function (next) {
  // Generate slug from title if not provided
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Set publishedAt when published
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Calculate reading time
  if (this.isModified('content') && this.content) {
    const wordsPerMinute = 200;
    const words = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(words / wordsPerMinute);
  }
  
  // Truncate metaDescription to 160 characters if needed
  if (this.isModified('metaDescription') && this.metaDescription && this.metaDescription.length > 160) {
    this.metaDescription = this.metaDescription.substring(0, 157) + "...";
  }
  
  // Truncate excerpt to 300 characters if needed
  if (this.isModified('excerpt') && this.excerpt && this.excerpt.length > 300) {
    this.excerpt = this.excerpt.substring(0, 297) + "...";
  }
  
  next();
});

const Blog = mongoose.models?.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
export default Blog;

