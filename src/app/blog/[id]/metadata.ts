import { Metadata } from 'next'
import connectDB from '@/lib/db'
import BlogPost from '@/models/BlogPost'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    
    try {
        await connectDB()
        const post = await BlogPost.findById(id).lean()
        
        if (!post) {
            return {
                title: 'Blog Post Not Found',
            }
        }

        const title = post.title || 'Blog Post'
        const description = post.excerpt || post.content?.slice(0, 160) || 'Read more on Lithia Autos Blog'
        
        return {
            title: title,
            description: description.slice(0, 160),
            keywords: post.tags || ['automotive', 'luxury cars', 'Lithia Autos'],
            openGraph: {
                title: `${title} | Lithia Autos Blog`,
                description: description.slice(0, 160),
                url: `https://lithiaautos.com/blog/${id}`,
                siteName: 'Lithia Autos',
                images: post.image ? [{
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: title,
                }] : [{
                    url: 'https://lithiaautos.com/thumbnail.png',
                    width: 1200,
                    height: 630,
                    alt: title,
                }],
                type: 'article',
                publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
                authors: [post.author || 'Lithia Autos'],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${title} | Lithia Autos`,
                description: description.slice(0, 160),
                images: post.image ? [post.image] : ['https://lithiaautos.com/thumbnail.png'],
            },
            alternates: {
                canonical: `https://lithiaautos.com/blog/${id}`,
            },
        }
    } catch (error) {
        console.error('Error generating blog metadata:', error)
        return {
            title: 'Blog | Lithia Autos',
        }
    }
}

export default function BlogPostLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}