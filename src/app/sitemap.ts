import { MetadataRoute } from 'next'
import connectDB from '@/lib/db'
import Car from '@/models/Car'
import BlogPost from '@/models/BlogPost'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lithiaautos.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/inventory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/help-center`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  let carPages: MetadataRoute.Sitemap = []
  let blogPages: MetadataRoute.Sitemap = []

  try {
    await connectDB()
    
    const cars = await Car.find({ isActive: true }).select('updatedAt').limit(500).lean()
    carPages = cars.map((car: any) => ({
      url: `${baseUrl}/inventory/${car._id}`,
      lastModified: new Date(car.updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching cars for sitemap:', error)
  }

  try {
    const blogs = await BlogPost.find({ isPublished: true }).select('updatedAt').limit(100).lean()
    blogPages = blogs.map((blog: any) => ({
      url: `${baseUrl}/blog/${blog._id}`,
      lastModified: new Date(blog.updatedAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  return [...staticPages, ...carPages, ...blogPages]
}