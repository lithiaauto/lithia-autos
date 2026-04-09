import { Metadata } from 'next'
import connectDB from '@/lib/db'
import Car from '@/models/Car'

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    
    try {
        await connectDB()
        const car = await Car.findById(id).lean()
        
        if (!car) {
            return {
                title: 'Car Not Found',
            }
        }

        const carTitle = `${car.year} ${car.make} ${car.carModel}`
        const price = car.price ? `$${car.price.toLocaleString()}` : 'Contact for Price'
        
        const description = `${carTitle} - ${car.bodyType || 'Luxury Vehicle'} with ${car.mileage?.toLocaleString() || '0'} miles. ${car.transmission || 'Automatic'} transmission, ${car.fuelType || 'Gasoline'} engine. ${car.color ? `Finished in ${car.color}. ` : ''}Clean title, well-maintained. ${car.features?.convenience?.slice(0, 3)?.join(', ') || 'Premium features'}. Contact us for more details.`
        
        const keywords = [
            `${car.make} ${car.carModel} for sale`,
            `${car.year} ${car.make} ${car.carModel}`,
            `${car.make} ${car.carModel} price`,
            `used ${car.make} cars`,
            `luxury ${car.bodyType} for sale`,
            `${car.make} dealer`,
            `premium ${car.make} vehicles`,
            `exotic ${car.make}`,
            `${car.year} ${car.make} ${car.carModel} specs`,
            `buy ${car.make} ${car.carModel}`,
            `${car.make} financing`,
            `certified pre-owned ${car.make}`,
        ].filter(Boolean)

        const imageUrl = car.images?.[0] 
            ? car.images[0] 
            : 'https://lithiaautos.com/thumbnail.png'

        return {
            title: carTitle,
            description: description.slice(0, 160),
            keywords: keywords,
            openGraph: {
                title: `${carTitle} | Lithia Autos`,
                description: `Buy this ${carTitle} for ${price}. ${car.mileage?.toLocaleString() || '0'} miles, ${car.transmission || 'Automatic'}, ${car.fuelType || 'Gasoline'}. Clean title.`,
                url: `https://lithiaautos.com/inventory/${id}`,
                siteName: 'Lithia Autos',
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: carTitle,
                    },
                ],
                type: 'website',
                locale: 'en_US',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${carTitle} | Lithia Autos`,
                description: `Buy ${carTitle} for ${price}. ${car.mileage?.toLocaleString() || '0'} miles. Clean title.`,
                images: [imageUrl],
            },
            alternates: {
                canonical: `https://lithiaautos.com/inventory/${id}`,
            },
        }
    } catch (error) {
        console.error('Error generating car metadata:', error)
        return {
            title: 'Car Details | Lithia Autos',
        }
    }
}

export default function CarDetailsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}