import { Metadata } from 'next'
import connectDB from '@/lib/db'
import Car from '@/models/Car'
import CarDetailsClient from './CarDetailsClient'

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
        
        const description = `${carTitle} - ${car.bodyType || 'Luxury Vehicle'} with ${car.mileage?.toLocaleString() || '0'} miles. ${car.transmission || 'Automatic'} transmission, ${car.fuelType || 'Gasoline'} engine. ${car.color ? `Finished in ${car.color}. ` : ''}Clean title, well-maintained. Contact us for details.`
        
        const keywords = [
            `${car.make} ${car.carModel} for sale`,
            `${car.year} ${car.make} ${car.carModel}`,
            `${car.make} ${car.carModel} price`,
            `used ${car.make} cars`,
            `luxury ${car.bodyType} for sale`,
            `${car.make} dealer`,
            `premium ${car.make} vehicles`,
            `exotic ${car.make}`,
            `buy ${car.make} ${car.carModel}`,
            `${car.make} financing`,
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
        console.error('Error fetching car:', error)
        return {
            title: 'Car Details | Lithia Autos',
            robots: {
                index: false,
                follow: false,
            },
        }
    }
}

export default async function CarDetailsPage({ params }: Props) {
    const { id } = await params
    
    try {
        await connectDB()
        const car = await Car.findById(id).lean()
        
        if (!car) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-navy-900 mb-4">Car Not Found</h1>
                        <p className="text-navy-600 mb-8">The car you're looking for doesn't exist or has been removed.</p>
                        <a href="/inventory" className="text-gold-500 hover:text-gold-600 font-bold">
                            Browse Inventory →
                        </a>
                    </div>
                </div>
            )
        }

        // Pass car data to client component
        return <CarDetailsClient car={car} carId={id} />
    } catch (error) {
        console.error('Error fetching car:', error)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-navy-900 mb-4">Error Loading Car</h1>
                    <p className="text-navy-600 mb-8">Something went wrong. Please try again later.</p>
                    <a href="/inventory" className="text-gold-500 hover:text-gold-600 font-bold">
                        Browse Inventory →
                    </a>
                </div>
            </div>
        )
    }
}