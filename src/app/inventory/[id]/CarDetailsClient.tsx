'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, Share, Heart, CheckCircle2, Star,
    ArrowLeft, ArrowRight, Loader2, Plus, Minus, X
} from 'lucide-react';
import { Car as CarIcon } from 'lucide-react';
import Link from 'next/link';

export default function CarDetailsClient({ car, carId }: { car: any; carId: string }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [openFeatureIndex, setOpenFeatureIndex] = useState<string | null>('convenience');
    const [recommendedCars, setRecommendedCars] = useState<any[]>([]);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    
    const { addToCart } = useCart();
    const router = useRouter();

    React.useEffect(() => {
        if (!car?.images || car.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % car.images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [car?.images]);

    React.useEffect(() => {
        // Fetch recommended cars
        const fetchRecommended = async () => {
            try {
                const recParams = new URLSearchParams({
                    limit: '4',
                    exclude: car._id || carId
                });
                if (car.make) recParams.append('make', car.make);
                if (car.bodyType) recParams.append('bodyType', car.bodyType);

                const recRes = await fetch(`/api/inventory?${recParams.toString()}`);
                if (recRes.ok) {
                    const recs = await recRes.json();
                    setRecommendedCars(recs);
                }
            } catch (e) {
                // Ignore
            }
        };
        fetchRecommended();
    }, [car, carId]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowLeft') setActiveLightboxIndex(prev => (prev - 1 + (car?.images?.length || 1)) % (car?.images?.length || 1));
            if (e.key === 'ArrowRight') setActiveLightboxIndex(prev => (prev + 1) % (car?.images?.length || 1));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, car?.images]);

    const carData = {
        id: car._id || carId,
        title: car.title || `${car.year} ${car.make} ${car.carModel}`,
        price: `$${(car.price || 0).toLocaleString()}`,
        image: car.images?.[0] || 'https://images.unsplash.com/photo-1628155930515-8d0ab7a66cd5?auto=format&fit=crop&w=1600&q=80',
        year: car.year.toString(),
        type: car.type || 'Vehicle'
    };

    const handleAddToCart = () => {
        addToCart(carData);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    const handleBuyNow = () => {
        addToCart(carData);
        router.push('/checkout');
    };

    const reviews = car.reviews || [];
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc: number, rev: any) => acc + (rev.rating || 5), 0) / reviews.length).toFixed(1)
        : 0;

    const openLightbox = (index: number) => {
        setActiveLightboxIndex(index);
        setIsLightboxOpen(true);
    };

    return (
        <div className="bg-[#f9fafb] min-h-screen pb-20 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* Main Hero Image Slider */}
                <div className="relative w-full h-[300px] md:h-[600px] rounded-2xl overflow-hidden mb-8 group">
                    <div className="flex w-full h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                        {(car.images && car.images.length > 0 ? car.images : [carData.image]).map((img: string, idx: number) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${carData.title} view ${idx + 1}`}
                                className="w-full h-full object-cover shrink-0 cursor-zoom-in"
                                onClick={() => openLightbox(idx)}
                            />
                        ))}
                    </div>

                    {car.images && car.images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentImageIndex(prev => (prev - 1 + car.images.length) % car.images.length)}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-colors z-10"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setCurrentImageIndex(prev => (prev + 1) % car.images.length)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-colors z-10"
                            >
                                <ArrowRight className="w-6 h-6" />
                            </button>

                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {car.images.map((_: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-gold-500 w-8' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Nav Pills */}
                <div className="flex flex-wrap gap-4 mb-10 sticky top-[84px] z-40 bg-[#f9fafb]/80 backdrop-blur-md py-4">
                    <a href="#overview" className="px-6 py-2.5 rounded-full border border-light-300 bg-white text-navy-900 font-bold text-sm tracking-wide hover:bg-gold-500 transition-colors">Overview</a>
                    <a href="#specs" className="px-6 py-2.5 rounded-full border border-light-300 bg-white text-navy-600 hover:text-navy-900 font-bold text-sm tracking-wide transition-colors hover:bg-gold-500">Specs & features</a>
                    {recommendedCars.length > 0 && (
                        <a href="#recommended" className="px-6 py-2.5 rounded-full border border-light-300 bg-white text-navy-600 hover:text-navy-900 font-bold text-sm tracking-wide transition-colors hover:bg-gold-500">Recommended cars</a>
                    )}
                    {reviews.length > 0 && (
                        <a href="#reviews" className="px-6 py-2.5 rounded-full border border-light-300 bg-white text-navy-600 hover:text-navy-900 font-bold text-sm tracking-wide transition-colors hover:bg-gold-500">Reviews</a>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column */}
                    <div className="w-full lg:w-[65%] xl:w-[70%] space-y-12">

                        {/* Description */}
                        <section id="overview">
                            <h2 className="text-2xl font-bold text-navy-900 mb-6 tracking-tight">Description</h2>
                            <div className="text-gray-600 text-[15px] leading-relaxed space-y-4">
                                {car.description ? (
                                    <p>{car.description}</p>
                                ) : (
                                    <>
                                        <p>This {car.year} {car.make} {car.carModel} represents the pinnacle of automotive engineering and design. Meticulously maintained and presented in excellent condition, it offers a perfect blend of performance, comfort, and reliability.</p>
                                        <p>Whether you're navigating city streets or embarking on a long-distance journey, this vehicle is equipped to provide an exceptional driving experience. Visit our showroom in Bridgeview, IL for a test drive.</p>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Car Overview */}
                        <section id="specs">
                            <h2 className="text-2xl font-bold text-navy-900 mb-6 tracking-tight">Car overview</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                                {[
                                    { icon: <CarIcon className="w-5 h-5" />, label: 'Condition:', value: car.condition || 'Clean title' },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>, label: 'Cylinders:', value: car.cylinders || '6' },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>, label: 'Stock Number:', value: car.stockNumber || 'Available' },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4v18M13 3v18M19 21V11l-6-4M9 7v6M9 17v-2" /></svg>, label: 'Fuel Type:', value: car.fuelType || car.fuel },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, label: 'VIN Number:', value: car.vin || 'Available' },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>, label: 'Doors:', value: car.doors || '4' },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, label: 'Year:', value: (car.year || 2024).toString() },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /></svg>, label: 'Color:', value: car.color || 'Contact Us' },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 2a2 2 0 00-2 2v1h14V4a2 2 0 00-2-2H7zM5 19v2h14v-2H5zM5 7h14v10H5V7z" /></svg>, label: 'Seats:', value: car.seats || '5' },
                                    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: 'Transmission:', value: car.transmission || car.trans },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>, label: 'City MPG:', value: car.cityMPG || '--' },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, label: 'Engine Size:', value: car.engineSize || '--' },
                                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>, label: 'Highway MPG:', value: car.highwayMPG || '--' },
                                    { icon: <Repeat className="w-5 h-5" />, label: 'Drive Type:', value: car.drivetrain || car.driveType || 'AWD' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between border-b border-light-200 pb-4">
                                        <div className="flex items-center text-navy-600 text-[15px]">
                                            <span className="text-light-500 mr-3 shrink-0">{item.icon}</span>
                                            {item.label}
                                        </div>
                                        <div className="font-bold text-navy-900 text-right ml-4">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Features */}
                        <section id="features" className="space-y-6">
                            <h2 className="text-2xl font-bold text-navy-900 tracking-tight mb-8">Features & Equipment</h2>
                            <div className="space-y-4">
                                {car.features && Object.entries(car.features).map(([key, list]: [string, any]) => {
                                    if (!list || list.length === 0) return null;

                                    const labels: Record<string, string> = {
                                        convenience: 'Comfort & Convenience',
                                        interior: 'Interior Details',
                                        exterior: 'Exterior Options',
                                        safety: 'Safety & Security',
                                        entertainment: 'Entertainment & Communication',
                                        other: 'Additional Features'
                                    };

                                    const isOpen = openFeatureIndex === key;

                                    return (
                                        <div key={key} className={`border rounded-xl transition-all duration-300 overflow-hidden ${isOpen ? 'bg-gold-50/30 border-gold-200' : 'bg-white border-light-200 hover:border-navy-200'}`}>
                                            <button
                                                onClick={() => setOpenFeatureIndex(isOpen ? null : key)}
                                                className="w-full text-left px-6 py-5 flex justify-between items-center group"
                                            >
                                                <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-navy-900' : 'text-navy-700 group-hover:text-navy-900'}`}>
                                                    {labels[key] || key}
                                                </span>
                                                <div className={`shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                    {isOpen ? <Minus className="w-5 h-5 text-gold-600" /> : <Plus className="w-5 h-5 text-navy-400" />}
                                                </div>
                                            </button>
                                            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <div className="px-6 pb-6 border-t border-gold-100/50 pt-4">
                                                    {key === 'convenience' && car.comfortDescription && (
                                                        <p className="text-navy-600 text-[14px] leading-relaxed mb-6 italic bg-white/50 p-4 rounded-lg border border-gold-100">{car.comfortDescription}</p>
                                                    )}
                                                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                                                        {list.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-center text-navy-600 text-[14px]">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 mr-3 shrink-0" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <section id="reviews">
                                <div className="flex items-center flex-col md:flex-row gap-4 mb-8">
                                    <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Car User Reviews & Rating</h2>
                                    <div className="flex items-center bg-gold-50 px-4 py-1.5 rounded-full border border-gold-200">
                                        <Star className="w-4 h-4 text-gold-500 fill-current mr-2" />
                                        <span className="font-bold text-navy-900">{averageRating}</span>
                                        <span className="text-navy-600 text-sm ml-1">({reviews.length} reviews)</span>
                                    </div>
                                </div>
                                <div className="space-y-8 divide-y divide-light-200 border-b border-light-200 pb-8">
                                    {reviews.map((review: any, idx: number) => (
                                        <div key={idx} className="pt-8 first:pt-0">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={review.avatar || `https://i.pravatar.cc/150?u=${review.author}`} className="w-[52px] h-[52px] rounded-full object-cover" alt="Reviewer" />
                                                    <div>
                                                        <h4 className="font-bold text-navy-900 text-[15px] mb-1">{review.author}</h4>
                                                        <div className="flex text-gold-500">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : ''}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-bold text-light-500">{review.date ? new Date(review.date).toLocaleDateString() : 'Recent'}</span>
                                            </div>
                                            <p className="text-navy-600 text-[14px] leading-relaxed max-w-4xl">{review.body || review.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Right Column */}
                    <aside className="w-full lg:w-[35%] xl:w-[30%] space-y-8">
                        <div className="bg-white border border-light-300 rounded-xl p-6 sticky top-[150px]">
                            <h1 className="text-2xl font-bold text-navy-900 mb-4 tracking-tight">{carData.title}</h1>
                            <div className="flex flex-wrap text-[12px] text-navy-600 gap-y-3 mb-6">
                                <span className="flex items-center w-1/2"><CarIcon className="w-4 h-4 mr-2" /> {(car.mileage || car.miles || 0).toLocaleString()} kms</span>
                                <span className="flex items-center w-1/2"><svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V7l8-4v18M13 3v18M19 21V11l-6-4M9 7v6M9 17v-2" /></svg> {car.fuelType || car.fuel}</span>
                                <span className="flex items-center w-1/2 mt-2"><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {car.transmission || car.trans}</span>
                            </div>
                            <div className="text-[32px] font-black text-navy-900 mb-4">{carData.price}</div>
                            <button onClick={handleBuyNow} className="w-full bg-gold-500 hover:bg-gold-400 text-white font-bold py-3.5 rounded-xl transition-colors mb-3">Buy Now</button>
                            <button onClick={handleAddToCart} className="w-full bg-navy-900 hover:bg-navy-800 text-gold-400 font-bold py-3.5 rounded-xl transition-colors">
                                {addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* You May Also Like */}
            {recommendedCars && recommendedCars.length > 0 && (
                <div id="recommended" className="bg-white border-t border-light-200 py-16 mt-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">Curated for you</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">You May Also Like</h2>
                            </div>
                            <Link href="/inventory" className="text-navy-900 font-bold hover:text-gold-600 transition-colors flex items-center gap-2 group">
                                View Full Inventory
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 -mx-4 px-4 sm:mx-0 sm:px-0">
                            {recommendedCars.map((item, i) => (
                                <Link key={i} href={`/inventory/${item._id || item.id}`} className="flex-none w-[280px] sm:w-full snap-center flex flex-col group bg-[#f9fafb] rounded-2xl overflow-hidden border border-light-200 hover:border-gold-300 transition-all hover:scale-[1.02]">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={item.images?.[0] || item.image || `https://images.unsplash.com/photo-${item.img || '1628155930515-8d0ab7a66cd5'}?w=600&q=80`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt="Rec car"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-navy-900 uppercase">
                                            {item.bodyType || 'Premium'}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-bold text-navy-900 text-lg leading-tight mb-2 group-hover:text-gold-600 transition-colors">
                                            {item.year} {item.make} {item.carModel || item.title}
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <span className="font-black text-navy-900 text-xl">${(item.price || 0).toLocaleString()}</span>
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-light-200 group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-white transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-navy-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 p-3 rounded-full bg-white hover:bg-gold-500 text-navy-950 transition-all z-[110] shadow-xl"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full max-w-7xl h-[60vh] md:h-[75vh] flex items-center justify-center mb-8">
                        <img
                            src={(car?.images && car.images.length > 0 ? car.images : [carData.image])[activeLightboxIndex]}
                            alt={`${carData.title} view ${activeLightboxIndex + 1}`}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full max-w-7xl">
                        {(car?.images?.length || 0) > 1 && (
                            <div className="flex items-center gap-8 relative px-20">
                                <button
                                    onClick={() => setActiveLightboxIndex(prev => (prev - 1 + car.images.length) % car.images.length)}
                                    className="p-5 rounded-full bg-white hover:bg-gold-500 text-navy-950 transition-all transform hover:scale-110 shadow-2xl hover:shadow-gold-500/20 active:scale-95 group"
                                >
                                    <ArrowLeft className="w-8 h-8 transition-transform group-active:-translate-x-1" />
                                </button>

                                <div className="flex flex-col items-center min-w-[200px]">
                                    <div className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mb-1">
                                        Frame {activeLightboxIndex + 1} / {(car?.images?.length || 1)}
                                    </div>
                                    <h3 className="text-white text-xl font-black tracking-tight">{carData.title}</h3>
                                </div>

                                <button
                                    onClick={() => setActiveLightboxIndex(prev => (prev + 1) % car.images.length)}
                                    className="p-5 rounded-full bg-white hover:bg-gold-500 text-navy-950 transition-all transform hover:scale-110 shadow-2xl hover:shadow-gold-500/20 active:scale-95 group"
                                >
                                    <ArrowRight className="w-8 h-8 transition-transform group-active:translate-x-1" />
                                </button>
                            </div>
                        )}
                    </div>

                    {(car?.images?.length || 0) > 1 && (
                        <div className="mt-8 flex gap-3 overflow-x-auto max-w-full pb-2 px-4 no-scrollbar">
                            {car.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveLightboxIndex(idx)}
                                    className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${activeLightboxIndex === idx ? 'border-gold-500 scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Repeat({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    );
}