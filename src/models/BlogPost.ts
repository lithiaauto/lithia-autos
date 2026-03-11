import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    image: string;
    authorImage?: string;
    date: string;
    commentsCount: number;
    tags: string[];
    quoteText?: string;
    quoteAuthor?: string;
    additionalImages?: string[];
    additionalContent?: string;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true, default: 'Lithia Autos' },
    image: { type: String, required: true },
    authorImage: { type: String },
    date: { type: String, required: true },
    commentsCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    quoteText: { type: String },
    quoteAuthor: { type: String },
    additionalImages: [{ type: String }],
    additionalContent: { type: String },
    isFeatured: { type: Boolean, default: false }
}, {
    timestamps: true
});

delete mongoose.models.BlogPost;
const BlogPost: Model<IBlogPost> = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;

