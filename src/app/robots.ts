import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/checkout/success/', '/order-receipt/'],
            },
            {
                userAgent: 'GPTBot',
                disallow: '/',
            },
            {
                userAgent: 'ChatGPT-User',
                disallow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'BingBot',
                allow: '/',
            },
        ],
        sitemap: 'https://lithiaautos.com/sitemap.xml',
        host: 'https://lithiaautos.com',
    }
}
