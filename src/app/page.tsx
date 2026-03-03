import { HomeClient } from '@/components/home/HomeClient';
import connectToDatabase from '@/lib/db';
import Car from '@/models/Car';
import BlogPost from '@/models/BlogPost';
import Make from '@/models/Make';
import Delivery from '@/models/Delivery';

async function getInventory() {
  await connectToDatabase();
  const cars = await Car.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(cars));
}

async function getFeatured() {
  await connectToDatabase();
  const data = await Car.find({ isFeatured: true }).sort({ createdAt: -1 });
  if (data && data.length > 0) {
    return data.map((c: any) => ({
      id: c._id.toString(),
      make: c.make,
      model: c.carModel,
      description: c.description || 'Experience unparalleled luxury and performance with our premium collection.',
      image: c.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000',
      specs: {
        transmission: c.transmission || 'Automatic',
        engine: c.engineSize || 'Premium',
        power: 'High',
        torque: 'Optimized'
      }
    }));
  }
  return [];
}

async function getBlogs() {
  await connectToDatabase();
  const posts = await BlogPost.find({}).sort({ date: -1 });
  return JSON.parse(JSON.stringify(posts));
}

async function getMakes() {
  await connectToDatabase();
  const makes = await Make.find({});
  return JSON.parse(JSON.stringify(makes));
}

async function getDeliveries() {
  await connectToDatabase();
  const deliveries = await Delivery.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(deliveries));
}

export default async function HomePage() {
  const [inventory, featured, blogs, makes, deliveries] = await Promise.all([
    getInventory(),
    getFeatured(),
    getBlogs(),
    getMakes(),
    getDeliveries()
  ]);

  // Fallback for featured logic if none tagged
  let activeFeatured = featured;
  if (activeFeatured.length === 0 && inventory.length > 0) {
    activeFeatured = inventory.slice(0, 3).map((c: any) => ({
      id: c._id.toString(),
      make: c.make,
      model: c.carModel,
      description: c.description || 'Experience unparalleled luxury and performance.',
      image: c.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000',
      specs: {
        transmission: c.transmission || 'Automatic',
        engine: c.engineSize || 'Premium',
        power: 'High',
        torque: 'Optimized'
      }
    }));
  }

  return (
    <HomeClient
      initialInventory={inventory}
      initialFeatured={activeFeatured}
      initialBlogs={blogs}
      initialMakes={makes}
      initialDeliveries={deliveries}
    />
  );
}
