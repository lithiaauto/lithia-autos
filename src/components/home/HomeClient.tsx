'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, Cog, Banknote, ShieldCheck, ChevronLeft, ChevronRight, Star, Loader2, Car as CarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Testimonials } from '@/components/ui/Testimonials';
import { Partners } from '@/components/ui/Partners';
import { HomeAboutSection } from '@/components/ui/HomeAboutSection';
import { DeliveredByDriveway } from '@/components/ui/DeliveredByDriveway';
import benz from '../../../public/images/benz.png';
import rollsRoyce from '../../../public/images/rollsRoyce.png';

interface HomeClientProps {
  initialInventory: any[];
  initialFeatured: any[];
  initialBlogs: any[];
  initialMakes: any[];
  initialDeliveries: any[];
}

export function HomeClient({
  initialInventory,
  initialFeatured,
  initialBlogs,
  initialMakes,
  initialDeliveries
}: HomeClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentLatestPick, setCurrentLatestPick] = useState(0);
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedMake, setSelectedMake] = useState('');

  const activeFeatured = initialFeatured;
  const combinedCars = initialInventory;
  const latestBlogs = initialBlogs.slice(0, 3);
  const dbMakes = initialMakes;

  const displayLatestPicks = combinedCars.filter((c: any) => !!c.latestPicks);
  const finalLatestPicks = displayLatestPicks.length > 0 ? displayLatestPicks : [...combinedCars].reverse().slice(0, 5);

  const displayRecommended = combinedCars.filter((c: any) => !!c.recommended).slice(0, 4);
  const finalRecommended = displayRecommended.length > 0 ? displayRecommended : combinedCars.filter((c: any) => c.isFeatured || c.featured).slice(0, 4);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev: number) => (prev + 1) % activeFeatured.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev: number) => (prev - 1 + activeFeatured.length) % activeFeatured.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    if (activeFeatured.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [activeFeatured.length, isTransitioning]);

  const nextLatestPick = () => {
    setCurrentLatestPick((prev: number) => (prev + 1) % finalLatestPicks.length);
  };

  const prevLatestPick = () => {
    setCurrentLatestPick((prev: number) => (prev - 1 + finalLatestPicks.length) % finalLatestPicks.length);
  };

  useEffect(() => {
    if (finalLatestPicks.length <= 1) return;
    const timer = setInterval(() => {
      nextLatestPick();
    }, 5000);
    return () => clearInterval(timer);
  }, [finalLatestPicks.length]);

  const stockMakes = [...new Set(combinedCars.map((c: any) => c.make))].sort() as string[];

  // Dynamic Brands Logic
  const brandsWithStock = dbMakes.length > 0 ? dbMakes.map(m => ({
    name: m.name,
    count: combinedCars.filter((c: any) => c.make === m.name).length,
    img: m.logoUrl
  })) : Array.from(new Set(combinedCars.map((c: any) => c.make))).map((make: string) => {
    const count = combinedCars.filter((c: any) => c.make === make).length;
    const brandLogos: Record<string, string> = {
      'BMW': 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
      'Audi': 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi_logo_detail.svg',
      'Mercedes Benz': 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_Logo_2010.svg',
      'Land Rover': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Land_Rover_logo_2023.svg/1200px-Land_Rover_logo_2023.svg.png',
      'Mercedes-Benz': 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_Logo_2010.svg'
    };
    return { name: make, count, img: brandLogos[make] || 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg' };
  });

  const [brandOffset, setBrandOffset] = useState(0);
  const brandsPerPage = 6;
  const totalBrandPages = Math.ceil(brandsWithStock.length / brandsPerPage);

  useEffect(() => {
    if (brandsWithStock.length <= brandsPerPage) return;
    const timer = setInterval(() => {
      setBrandOffset((prev) => (prev + 1) % totalBrandPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [brandsWithStock.length, totalBrandPages]);

  const bodyFilteredCars = combinedCars.filter((car: any) => {
    if (selectedBodyType === 'All') return true;
    return (car.type === selectedBodyType || car.bodyType === selectedBodyType);
  }).slice(0, 8);

  const currentCar = activeFeatured[currentSlide % activeFeatured.length];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[750px] md:h-[800px] max-md:h-auto overflow-hidden">
        {/* Background Images */}
        {activeFeatured.map((car: any, index: number) => (
          <div
            key={car.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={car.image}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover grayscale-[20%]"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Subtle gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10"></div>
          </div>
        ))}

        {/* Content Container */}
        {currentCar && (
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:pt-32 pt-20 md:pb-20 pb-8">
            <div className="flex flex-row h-full">
              {/* Left Column: Glass Feature Cards */}
              <div className={`flex flex-col justify-center space-y-4 md:w-64 md:pr-10 pr-4 md:border-r border-white/20 transition-all duration-500 ${isTransitioning ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
                {[
                  { icon: <svg className="md:w-8 w-4 h-8 h-4 text-white mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 9V7a4 4 0 118 0v2m-8 0h8M8 9h8m-8 0a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2m-8 0H6" /></svg>, label: 'Transmission', value: currentCar.specs.transmission },
                  { icon: <svg className="md:w-8 w-4 h-8 h-4 text-white mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>, label: 'Engine', value: currentCar.specs.engine },
                  { icon: <svg className="md:w-8 w-4 h-8 h-4 text-white mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, label: 'Max Power', value: currentCar.specs.power },
                  { icon: <svg className="md:w-8 w-4 h-8 h-4 text-white mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>, label: 'Max Torque', value: currentCar.specs.torque },
                ].map((item: any, idx: number) => (
                  <div key={idx} className="bg-white/10 flex flex-row items-center gap-2 backdrop-blur-md border border-white/20 md:rounded-2xl rounded-lg md:p-4 p-2 transition-transform hover:-translate-y-1">
                    <span className="flex items-center gap-2">{item.icon}</span>
                    <span className="flex flex-col">
                      <div className="text-white/60 md:text-[11px] text-[8px] font-bold uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="text-white md:text-[11px] text-[8px] font-bold">{item.value}</div>
                    </span>
                  </div>
                ))}
              </div>

              {/* Middle Column: Make/Model Text */}
              <div className={`flex-1 flex flex-col justify-center px-0 md:px-12 mt-0 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <h1 className="text-2xl md:text-[72px] font-bold text-white leading-[1.1] tracking-tight mb-6">
                  {currentCar.make}<br />{currentCar.model}
                </h1>
                <p className="text-white/80 text-xs md:text-xl max-w-lg mb-10 leading-relaxed font-medium line-clamp-3">
                  {currentCar.description}
                </p>
                <div className="flex md:items-center items-start flex-col md:flex-row gap-6">
                  <Link href={`/inventory/${currentCar.id}`} className="bg-white hover:bg-gray-100 text-gray-900 font-bold md:rounded-xl rounded-lg md:text-[15px] text-[12px] transition-colors text-sm mobile:text-base md:px-5 px-3 py-2">
                    View Detail
                  </Link>

                  {/* Navigation Arrows */}
                  <div className="flex gap-3">
                    <button
                      onClick={prevSlide}
                      className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-navy-900 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-navy-900 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Search Bar Area */}
            <div className="mt-auto relative z-20 hidden md:block">
              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="md:hidden w-full bg-white border border-light-300 md:rounded-xl rounded-lg p-2 md:p-4 my-4 flex items-center justify-between text-navy-900 font-bold group active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Search className="md:w-5 w-4 h-5 h-4 text-gold-500" />
                  <span className="text-sm md:text-base">{isFilterVisible ? 'Close Filter' : 'Find your car'}</span>
                </div>
                <div className={`transition-transform duration-300 ${isFilterVisible ? 'rotate-180' : ''}`}>
                  <svg className="md:w-5 w-4 h-5 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>

              <div className={cn(
                "bg-white md:rounded-2xl rounded-lg p-2 md:p-4 mt-8 shadow-none border border-light-300 flex flex-col md:flex-row gap-4 items-center relative z-20 w-full max-w-5xl transition-all duration-300",
                !isFilterVisible ? "max-md:h-0 max-md:mt-0 max-md:p-0 max-md:opacity-0 max-md:border-none overflow-hidden" : "max-md:opacity-100 max-md:max-h-[500px] overflow-visible"
              )}>
                <div className="flex-1 w-full relative">
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full appearance-none bg-white border border-light-300 text-navy-900 font-medium md:py-3.5 py-2 pl-5 pr-10 md:rounded-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer md:text-[15px] text-[10px]"
                  >
                    <option value="">Any Make</option>
                    {stockMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-md md:text-lg text-navy-400">▼</div>
                </div>
                <div className="flex-1 w-full relative">
                  <select className="w-full appearance-none bg-white border border-light-300 text-navy-900 font-medium md:py-3.5 py-2 pl-5 pr-10 md:rounded-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer md:text-[15px] text-[10px]">
                    <option>Any Body</option>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Hatchback</option>
                    <option>Coupe</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-navy-400">▼</div>
                </div>
                <div className="flex-1 w-full relative">
                  <select className="w-full appearance-none bg-white border border-light-300 text-navy-900 font-medium md:py-3.5 py-2 pl-5 pr-10 md:rounded-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer md:text-[15px] text-[10px]">
                    <option>Any Price</option>
                    <option>Under $50,000</option>
                    <option>$50,000 - $100,000</option>
                    <option>Over $100,000</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-navy-400">▼</div>
                </div>

                <Link
                  href={`/inventory${selectedMake ? `?make=${encodeURIComponent(selectedMake)}` : ''}`}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold md:h-[52px] h-[40px] md:px-8 px-4 md:rounded-xl rounded-lg flex items-center justify-center transition-colors shrink-0 w-full md:w-auto text-sm mobile:text-base"
                >
                  Search <Search className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 1. Find your dream car easily and quickly */}
      <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Find your dream car easily and quickly</h2>
        <p className="text-navy-600 mb-10 text-[15px]">Browse our premium collection of new and used cars.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-light-300 rounded-xl p-8 hover:-translate-y-1 hover:border-gold-500 transition-all flex flex-col h-full bg-white">
            <div className="text-gold-500 mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a2 2 0 00-1.6-.8H9.3a2 2 0 00-1.6.8L5 11l-4.16.86a1 1 0 00-.84.99V16h3" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /><path d="M11 21l3-3m0 0l3 3m-3-3v6" /></svg>
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">Browse inventory</h3>
            <p className="text-gray-500 md:text-[15px] text-[12px] mb-6 flex-grow leading-relaxed">Find the ideal car for you and browse our premium inventory.</p>
            <Link href="/inventory" className="text-navy-900 font-bold border-2 border-gold-500 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3">
              Search inventory <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="border border-light-300 rounded-xl p-8 hover:-translate-y-1 hover:border-gold-500 transition-all flex flex-col h-full bg-white">
            <div className="text-gold-500 mb-6">
              <Banknote size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">Trade-in Value</h3>
            <p className="text-gray-500 text-[15px] mb-6 flex-grow leading-relaxed">What's your car worth? Get the best value for your vehicle towards your purchase.</p>
            <Link href="/contact" className="text-navy-900 font-bold border-2 border-gold-500 rounded-lg px-5 py-2.5 mobile:px-6 mobile:py-3 text-sm mobile:text-base flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors">
              Get an estimate <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="border border-light-300 rounded-xl p-8 hover:-translate-y-1 hover:border-gold-500 transition-all flex flex-col h-full bg-white">
            <div className="text-gold-500 mb-6">
              <ShieldCheck size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">Apply For Financing</h3>
            <p className="text-gray-500 text-[15px] mb-6 flex-grow leading-relaxed">Fill out our credit approval form for your next vehicle loan directly with us.</p>
            <Link href="/inventory" className="text-navy-900 font-bold border-2 border-gold-500 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3">
              Browse cars <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="border border-light-300 rounded-xl p-8 hover:-translate-y-1 hover:border-gold-500 transition-all flex flex-col h-full bg-white">
            <div className="text-gold-500 mb-6">
              <Cog size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">Expert Service</h3>
            <p className="text-gray-500 text-[15px] mb-6 flex-grow leading-relaxed">Our expert technicians inspect every car before we sell it to you.</p>
            <Link href="/about" className="text-navy-900 font-bold border-2 border-gold-500 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3">
              Contact support <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Recommended Cars For You */}
      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-navy-900">Recommended Cars For You</h2>
          <Link href="/inventory" className="text-sm font-semibold border border-light-300 rounded-full px-5 py-2 hover:border-navy-400 transition-colors hidden md:flex items-center text-navy-600">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {finalRecommended.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {finalRecommended.map((car: any, i: number) => (
              <div key={car._id || car.id || i} className="border border-light-300 rounded-xl overflow-hidden hover:shadow-none hover:-translate-y-1 hover:border-gold-500 transition-all duration-300 bg-white flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  {(car.isFeatured || car.featured) && (
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="bg-gold-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-navy-900 text-white text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg">{car.year}</span>
                  </div>
                  <img
                    src={car.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600&h=400'}
                    alt={car.title || `${car.year} ${car.make} ${car.carModel}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="text-gold-500 text-[13px] font-bold mb-2 tracking-wide uppercase">{car.type || car.bodyType}</div>
                  <h3 className="text-lg font-bold text-navy-900 mb-4 line-clamp-1">
                    {car.title || `${car.year} ${car.make} ${car.carModel}`}
                  </h3>
                  <div className="flex items-center justify-between text-[13px] text-navy-600 border-b border-light-200 pb-5 mb-5">
                    <span className="flex items-center"><CarIcon className="w-4 h-4 mr-1.5 text-navy-300" /> {(car.mileage || car.miles || 0).toLocaleString()} km</span>
                    <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-navy-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4v18M13 3v18M19 21V11l-6-4M9 7v6M9 17v-2" /></svg> {car.fuelType || car.fuel}</span>
                    <span className="flex items-center"><Cog className="w-4 h-4 mr-1.5 text-navy-300" /> {car.transmission || car.trans}</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-5 border-t border-light-200">
                    <div className="text-[22px] font-bold text-navy-900">${(car.price || 0).toLocaleString()}</div>
                    <Link href={`/inventory/${car._id || car.id}`} className="text-sm font-bold bg-navy-900 text-white border border-navy-900 rounded-full hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500 transition-all shadow-none active:scale-95 text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-navy-600 font-bold">No recommended vehicles available.</div>
        )}
      </section>

      {/* 3. CTA Banners */}
      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-navy-900 rounded-2xl overflow-hidden flex items-center p-8 md:p-12 min-h-[280px]">
            <div className="hidden md:block">
              <Image src={rollsRoyce} width={240} alt="Rolls Royce" className="object-cover" />
            </div>
            <div className="relative z-10 w-full lg:w-1/2 lg:ml-auto">
              <h2 className="text-[28px] font-bold text-gold-400 mb-3 leading-tight tracking-tight">Are you looking for a car?</h2>
              <p className="text-white/90 text-[15px] mb-8 leading-relaxed">Save time and effort. Browse our extensive inventory of premium vehicles today.</p>
              <Link href="/inventory" className="bg-gold-500 text-white font-bold rounded-lg inline-flex items-center hover:bg-gold-400 transition-colors text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3">
                Find cars <Search className="ml-2.5 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="bg-gold-500 rounded-2xl overflow-hidden flex items-center p-8 md:p-12 min-h-[280px]">
            <div className="hidden md:block">
              <Image src={benz} width={240} alt="Mercedes Benz" className="object-cover" />
            </div>
            <div className="relative z-10 w-full lg:w-1/2 lg:ml-auto text-navy-900">
              <h2 className="text-[28px] font-bold text-navy-900 mb-3 leading-tight tracking-tight">Need Financing?</h2>
              <p className="text-white text-[15px] mb-8 leading-relaxed font-medium">Get pre-approved quickly. We offer flexible terms for your next vehicle purchase.</p>
              <Link href="/contact" className="bg-navy-900 text-white font-bold rounded-lg inline-flex items-center hover:bg-navy-800 transition-colors text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3">
                Apply Now <ArrowRight className="ml-2.5 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What would you like to find? (Brands) */}
      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">What would you like to find?</h2>
          <Link href="/inventory" className="text-sm font-semibold border border-light-300 rounded-full px-5 py-2 hover:border-navy-400 transition-colors hidden md:flex items-center text-navy-600">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${brandOffset * 100}%)` }}
          >
            {Array.from({ length: totalBrandPages }).map((_, pageIdx) => (
              <div key={pageIdx} className="grid grid-cols-2 lg:grid-cols-6 gap-6 min-w-full">
                {brandsWithStock.slice(pageIdx * brandsPerPage, (pageIdx + 1) * brandsPerPage).map(brand => (
                  <Link
                    key={brand.name}
                    href={`/inventory?make=${encodeURIComponent(brand.name)}`}
                    className="border border-light-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-gold-500 hover:shadow-none transition-all duration-300 cursor-pointer bg-white h-48 hover:-translate-y-1 group shrink-0"
                  >
                    <img
                      src={brand.img}
                      alt={brand.name}
                      className="h-14 w-auto min-w-[50px] object-contain mb-5 grayscale group-hover:grayscale-0 transition-all rendering-auto"
                      style={{ aspectRatio: 'auto' }}
                      loading="eager"
                    />
                    <span className="font-bold text-navy-900 line-clamp-1">{brand.name}</span>
                    <span className="text-[13px] text-navy-400 mt-1 font-medium">{brand.count} {brand.count === 1 ? 'Car' : 'Cars'}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {totalBrandPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalBrandPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBrandOffset(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${brandOffset === i ? 'bg-gold-500 w-8' : 'bg-light-300'}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Cars By Body Type */}
      <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Cars By Body Type</h2>
          <Link href="/inventory" className="text-sm font-semibold border border-light-300 rounded-full px-5 py-2 hover:border-navy-400 transition-colors hidden md:flex items-center text-navy-600">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="flex space-x-8 mb-10 border-b border-light-200">
          {['All', 'SUV', 'Hatchback', 'Sedan'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedBodyType(type)}
              className={`pb-4 text-[15px] font-bold transition-all ${selectedBodyType === type ? 'text-navy-900 border-b-2 border-gold-500' : 'text-navy-600 hover:text-navy-900'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bodyFilteredCars.map((car: any, i: number) => (
            <div key={car._id || car.id || i} className="border border-light-300 rounded-xl overflow-hidden hover:shadow-none hover:-translate-y-1 hover:border-gold-500 transition-all duration-300 bg-white flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  {(car.isFeatured || car.featured) && (
                    <span className="bg-gold-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured</span>
                  )}
                  {car.images && car.images.length > 0 && (
                    <span className="bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center">
                      <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {car.images.length}
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-navy-900 text-white text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg">{car.year}</span>
                </div>
                <img src={car.images?.[0] || `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600&h=400`} alt="Car" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-gold-500 text-[13px] font-bold mb-2 tracking-wide uppercase">{car.type || car.bodyType}</div>
                <h3 className="text-lg font-bold text-navy-900 mb-4 line-clamp-1">{car.title || `${car.year} ${car.make} ${car.carModel}`}</h3>
                <div className="flex items-center justify-between text-[13px] text-navy-600 border-b border-light-200 pb-5 mb-5">
                  <span className="flex items-center"><CarIcon className="w-4 h-4 mr-1.5 text-navy-300" /> {(car.mileage || car.miles || 0).toLocaleString()} km</span>
                  <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-navy-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4v18M13 3v18M19 21V11l-6-4M9 7v6M9 17v-2" /></svg> {car.fuelType || car.fuel || 'Petrol'}</span>
                  <span className="flex items-center"><Cog className="w-4 h-4 mr-1.5 text-navy-300" /> {car.transmission || car.trans || 'Automatic'}</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-light-200">
                  <div className="text-[22px] font-bold text-navy-900">${(car.price || 0).toLocaleString()}</div>
                  <Link href={`/inventory/${car._id || car.id}`} className="text-sm font-bold bg-navy-900 text-white border border-navy-900 rounded-full hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500 transition-all shadow-none active:scale-95 text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3">
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Latest Picks (Slideshow) */}
      <section className="py-24 bg-navy-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-navy-900 mb-4 tracking-tight">Latest <span className="text-gold-500">Picks</span></h2>
              <p className="text-navy-600 text-lg">Fresh arrivals from our premium inventory.</p>
            </div>
            <div className="hidden md:flex gap-4">
              <button onClick={prevLatestPick} className="w-14 h-14 rounded-full border border-light-300 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-all bg-white shadow-sm">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextLatestPick} className="w-14 h-14 rounded-full border border-light-300 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-all bg-white shadow-sm">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {finalLatestPicks.length > 0 ? (
            <div className="relative h-[350px] md:h-[550px] rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl group">
              {finalLatestPicks.map((car: any, idx: number) => (
                <div key={car._id || car.id || idx} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentLatestPick ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}>
                  <img
                    src={car.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1800'}
                    className="w-full h-full object-cover"
                    alt={car.title || `${car.year} ${car.make} ${car.carModel}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/40 to-transparent flex items-center p-6 md:p-20">
                    <div className="max-w-xl">
                      <span className="bg-gold-500 text-white text-[10px] md:text-xs font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-[0.2em] mb-4 md:mb-6 inline-block">New Arrival</span>
                      <h3 className="text-2xl md:text-[72px] font-bold text-white leading-[1.1] tracking-tight mb-6">
                        {car.make}<br />{car.model}
                      </h3>
                      <div className="flex flex-wrap gap-4 md:gap-6 mb-6 md:mb-10 text-white/80 font-bold uppercase tracking-widest text-[10px] md:text-sm">
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div> {car.transmission || car.trans}</div>
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div> {car.fuelType || car.fuel}</div>
                        <div className="flex items-center gap-2 text-white text-lg md:text-xl font-black">${(car.price || 0).toLocaleString()}</div>
                      </div>
                      <Link href={`/inventory/${car._id || car.id}`} className="inline-flex items-center bg-gold-500 hover:bg-white text-white font-bold rounded-2xl transition-all text-sm uppercase tracking-[0.1em] group/btn text-sm mobile:text-base px-10 py-4 mobile:px-12 mobile:py-5">
                        Explore Details <ArrowRight className="ml-3 group-hover/btn:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-navy-600 font-bold">No latest picks available.</div>
          )}
        </div>
      </section>

      <Testimonials title="What our collectors say" />

      <HomeAboutSection />

      <DeliveredByDriveway deliveries={initialDeliveries} />

      {/* 7. News to help choose your car */}
      <section className="pt-12 pb-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">News to help choose your car</h2>
          <Link href="/blog" className="text-sm font-semibold border border-light-300 rounded-full px-5 py-2 hover:border-navy-400 transition-colors hidden md:flex items-center text-navy-600">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {latestBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {latestBlogs.map((post: any, i: number) => (
              <Link key={post.id || i} href={`/blog/${post.id || post._id}`} className="group flex flex-col h-full">
                <div className="relative rounded-3xl overflow-hidden h-72 mb-8 shadow-xl">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                  <div className="absolute bottom-5 left-5 bg-gold-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    {post.date}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] mb-4 uppercase tracking-[0.2em] font-black">
                  <span className="text-navy-400">{post.author}</span>
                  <span className="text-gold-500">/</span>
                  <span className="text-gold-500">{post.category}</span>
                </div>
                <h3 className="text-2xl font-black text-navy-900 mb-4 group-hover:text-gold-500 transition-colors leading-tight tracking-tight flex-grow">{post.title}</h3>
                <p className="text-navy-600 text-[15px] line-clamp-2 leading-relaxed mb-6 font-medium">{post.excerpt}</p>
                <div className="mt-auto flex items-center gap-2 text-gold-600 text-xs font-black uppercase tracking-widest">
                  Read Article <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-navy-600 font-bold">No blog posts available.</div>
        )}
      </section>

      <Partners />
    </div>
  );
}
