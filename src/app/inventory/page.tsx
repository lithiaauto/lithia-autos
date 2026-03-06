'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { ChevronDown, X, Grid, List as ListIcon, Check, Cog, Filter, Search } from 'lucide-react';
import { Car as CarIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useToast } from '@/components/ui/Toast';
const Partners = dynamic(() => import('@/components/ui/Partners').then((mod) => mod.Partners), { ssr: false });
import { Loader2 } from 'lucide-react';

function InventoryContent() {
    const [viewType, setViewType] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState('Default');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        make: '',
        model: '',
        body: '',
        priceRange: [0, 150000],
        yearRange: [1990, new Date().getFullYear() + 1],
        kmRange: [0, 200000],
        features: [] as string[]
    });
    const [allCars, setAllCars] = useState<any[]>([]);
    const [makes, setMakes] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const { showToast } = useToast();
    const searchParams = useSearchParams();

    // Handle initial make and body from URL
    React.useEffect(() => {
        const makeFromUrl = searchParams.get('make');
        const bodyFromUrl = searchParams.get('body');
        if (makeFromUrl || bodyFromUrl) {
            setFilters(prev => ({
                ...prev,
                make: makeFromUrl || prev.make,
                body: bodyFromUrl || prev.body
            }));
        }
    }, [searchParams]);

    // 1. Fetch all cars from DB
    React.useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await fetch('/api/inventory');
                if (res.ok) {
                    const data = await res.json();
                    setAllCars(data);
                }
            } catch (e) {
                console.error('Failed to load DB inventory');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInventory();
    }, []);

    // 2. Derive Makes from Inventory
    React.useEffect(() => {
        const stockMakes = [...new Set(allCars.map((c: any) => c.make))].filter(Boolean).sort();
        setMakes(stockMakes);

        // Sync filters.make with canonical case from stockMakes
        if (filters.make && stockMakes.length > 0) {
            const canonical = stockMakes.find(m => m.toLowerCase() === filters.make.toLowerCase());
            if (canonical && canonical !== filters.make) {
                setFilters(prev => ({ ...prev, make: canonical }));
            }
        }
    }, [allCars, filters.make]);

    // 3. Derive Models from Inventory (filtered by make)
    React.useEffect(() => {
        if (!filters.make) {
            setModels([]);
            return;
        }
        const stockModels = [...new Set(
            allCars
                .filter((c: any) => c.make === filters.make)
                .map((c: any) => c.carModel)
        )].sort();
        setModels(stockModels);
    }, [filters.make, allCars]);

    const filteredCars = useMemo(() => {
        let result = allCars.filter(car => {
            if (filters.make && (car.make || '').toString().toLowerCase() !== filters.make.toLowerCase()) return false;
            if (filters.model && (car.carModel || '').toLowerCase() !== filters.model.toLowerCase()) {
                if (car.title && !car.title.toLowerCase().includes(filters.model.toLowerCase())) return false;
                if (!car.title && car.carModel !== filters.model) return false;
            }
            if (filters.body && (car.type === filters.body || car.bodyType === filters.body)) {
                // matches
            } else if (filters.body) {
                return false;
            }

            const carPrice = car.price || 0;
            if (carPrice < filters.priceRange[0] || carPrice > filters.priceRange[1]) return false;

            const carYear = car.year || 0;
            if (carYear < filters.yearRange[0] || carYear > filters.yearRange[1]) return false;

            const carMiles = car.mileage || car.miles || 0;
            if (carMiles < filters.kmRange[0] || carMiles > filters.kmRange[1]) return false;

            // Feature Filtering
            if (filters.features.length > 0) {
                // Special check for 'Featured'
                if (filters.features.includes('Featured') && !car.isFeatured) return false;

                const carFeatures = car.features ? [
                    ...(car.features.convenience || []),
                    ...(car.features.entertainment || []),
                    ...(car.features.exterior || []),
                    ...(car.features.safety || []),
                    ...(car.features.interior || []),
                    ...(car.features.seating || []),
                    ...(car.features.other || [])
                ] : [];

                // Must have all other selected features
                const otherRequestedFeatures = filters.features.filter((f: string) => f !== 'Featured');
                const hasAllOtherFeatures = otherRequestedFeatures.every((f: string) => carFeatures.includes(f));
                if (!hasAllOtherFeatures) return false;
            }

            return true;
        });

        // Sorting
        if (sortBy === 'Lowest Price') {
            result.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === 'Highest Price') {
            result.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else {
            // Default: by date (id or createdAt)
            result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        }

        return result;
    }, [filters, allCars, sortBy]);

    const clearFilters = () => {
        setFilters({
            make: '',
            model: '',
            body: '',
            priceRange: [0, 150000],
            yearRange: [1990, new Date().getFullYear() + 1],
            kmRange: [0, 200000],
            features: []
        });
        setSortBy('Default');
    };

    if (isLoading) {
        return (
            <div className="bg-light-100 min-h-screen py-20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-gold-500" />
            </div>
        );
    }

    return (
        <div className="bg-light-100 min-h-screen py-10 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className={cn(
                    "w-full xl:w-[320px] flex-shrink-0 bg-white rounded-xl border border-light-200 p-6 h-fit transition-all duration-300",
                    "max-xl:fixed max-xl:inset-0 max-xl:z-50 max-xl:rounded-none max-xl:h-[100dvh] max-xl:overflow-y-auto",
                    isMobileFilterOpen ? "max-xl:translate-x-0" : "max-xl:-translate-x-full"
                )}>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-navy-900">Filters and Sort</h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={clearFilters}
                                className="text-sm font-semibold text-navy-600 hover:text-navy-900 flex items-center transition-colors"
                            >
                                <X className="h-4 w-4 mr-1" /> Clear
                            </button>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="xl:hidden p-2 rounded-lg bg-light-100 text-navy-900"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Dropdowns */}
                        <div className="relative">
                            <select
                                value={filters.make}
                                onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value, model: '' }))}
                                className="w-full appearance-none bg-white border border-light-300 text-navy-900 font-medium py-3.5 px-4 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <option value="">{isLoading ? 'Loading Makes...' : 'Any Make'}</option>
                                {makes.map(make => (
                                    <option key={make} value={make}>{make}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-light-500 pointer-events-none" />
                        </div>

                        {/* Dynamic Model Dropdown */}
                        <div className="relative">
                            <select
                                value={filters.model}
                                onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                                className="w-full appearance-none bg-white border border-light-300 text-navy-900 font-medium py-3.5 px-4 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer disabled:opacity-50"
                                disabled={!filters.make || isLoading}
                            >
                                <option value="">{isLoading ? 'Loading Models...' : filters.make ? 'Any Model' : 'Select Make First'}</option>
                                {models.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-light-500 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={filters.body}
                                onChange={(e) => setFilters(prev => ({ ...prev, body: e.target.value }))}
                                className="w-full appearance-none bg-white border border-light-300 text-navy-900 font-medium py-3.5 px-4 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
                            >
                                <option value="">Any Body</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Pickup Truck">Pickup Truck</option>
                                <option value="Minivan">Minivan</option>
                                <option value="Crossover">Crossover</option>
                                <option value="MVP">MVP</option>
                                <option value="Coupe">Coupe</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-light-500 pointer-events-none" />
                        </div>

                        {/* Price Slider */}
                        <div className="py-2">
                            <div className="flex justify-between text-[13px] font-bold text-navy-900 mb-3">
                                <span>Price:</span>
                                <span>${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="150000"
                                value={filters.priceRange[1]}
                                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                                className="w-full h-1.5 bg-light-300 rounded-full appearance-none cursor-pointer accent-gold-500 mb-6"
                            />
                        </div>

                        {/* Year Range */}
                        <div className="py-2">
                            <div className="flex justify-between text-[13px] font-bold text-navy-900 mb-3">
                                <span>Year:</span>
                                <span>{filters.yearRange[0]} - {filters.yearRange[1]}</span>
                            </div>
                            <input
                                type="range"
                                min="1990"
                                max={new Date().getFullYear() + 1}
                                value={filters.yearRange[1]}
                                onChange={(e) => setFilters(prev => ({ ...prev, yearRange: [prev.yearRange[0], parseInt(e.target.value)] }))}
                                className="w-full h-1.5 bg-light-300 rounded-full appearance-none cursor-pointer accent-gold-500 mb-4"
                            />
                        </div>

                        {/* KM Range */}
                        <div className="py-2">
                            <div className="flex justify-between text-[13px] font-bold text-navy-900 mb-3">
                                <span>KM:</span>
                                <span>{filters.kmRange[0]} - {filters.kmRange[1]}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="200000"
                                value={filters.kmRange[1]}
                                onChange={(e) => setFilters(prev => ({ ...prev, kmRange: [prev.kmRange[0], parseInt(e.target.value)] }))}
                                className="w-full h-1.5 bg-light-300 rounded-full appearance-none cursor-pointer accent-gold-500 mb-6"
                            />
                        </div>

                        {/* Featured Checkboxes */}
                        <div className="pt-4 border-t border-light-200">
                            <h3 className="font-bold text-navy-900 mb-4">Featured</h3>
                            <div className="space-y-3">
                                {[
                                    'Featured', 'A/C: Front', 'Backup Camera', 'Cruise Control', 'Navigation',
                                    'Power Locks', 'Audio system', 'Touchscreen display', 'GPS navigation',
                                    'Phone connectivity', 'In-car Wi-Fi', 'Chrome-plated grill',
                                    'Smart headlight cluster', 'Premium wheels', 'Body character lines',
                                    'High-quality paint'
                                ].map((feature: string, idx: number) => {
                                    const isSelected = filters.features.includes(feature);
                                    return (
                                        <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                                            <div
                                                onClick={() => {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        features: isSelected
                                                            ? prev.features.filter(f => f !== feature)
                                                            : [...prev.features, feature]
                                                    }));
                                                }}
                                                className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${isSelected ? 'bg-gold-500 border-gold-500 text-navy-900' : 'border-light-300 group-hover:border-gold-500'}`}
                                            >
                                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                            </div>
                                            <span className={`text-[15px] transition-colors ${isSelected ? 'text-navy-900 font-bold' : 'text-navy-600 group-hover:text-navy-900'}`}>{feature}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Apply Button for Mobile */}
                        <div className="xl:hidden pt-6">
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-full bg-gold-500 text-navy-900 font-bold py-3.5 rounded-xl hover:bg-gold-400 transition-all text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3"
                            >
                                Apply Filters
                            </button>
                        </div>

                    </div>
                </aside>

                <main className="w-full flex-1">

                    {/* Top Bar */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
                        <div className="flex gap-2 w-full justify-between items-center">
                            <button className="bg-navy-900 text-gold-400 font-bold py-2.5 px-6 rounded-xl text-[14px] text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3">All Cars ({filteredCars.length})</button>
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="xl:hidden flex items-center gap-2 bg-white border border-light-300 text-navy-900 font-bold py-2.5 px-6 rounded-xl text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3"
                            >
                                <Filter className="w-4 h-4 text-gold-500" />
                                Filter
                            </button>
                        </div>

                        <div className="flex items-center gap-4 w-full xl:w-auto">
                            <div className="flex gap-2 border-r border-light-200 pr-4">
                                <button
                                    onClick={() => setViewType('grid')}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${viewType === 'grid' ? 'bg-navy-900 text-gold-400 shadow-lg' : 'bg-white border border-light-300 text-light-500 hover:text-navy-900'}`}
                                >
                                    <Grid className="w-5 h-5 fill-current" />
                                </button>
                                <button
                                    onClick={() => setViewType('list')}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${viewType === 'list' ? 'bg-navy-900 text-gold-400 shadow-lg' : 'bg-white border border-light-300 text-light-500 hover:text-navy-900'}`}
                                >
                                    <ListIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border border-light-300 text-navy-700 font-medium py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer text-[14px]"
                                >
                                    <option value="Default">Sort by (Default)</option>
                                    <option value="Lowest Price">Lowest Price</option>
                                    <option value="Highest Price">Highest Price</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-light-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Cars Content */}
                    <div className={viewType === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
                        {filteredCars.map((car: any) => (
                            <div key={car._id || car.id} className={`border border-light-300 rounded-2xl overflow-hidden hover:border-gold-500 transition-all duration-300 bg-white flex ${viewType === 'list' ? 'flex-col md:flex-row md:h-64' : 'flex-col'}`}>
                                <div className={`relative overflow-hidden ${viewType === 'list' ? 'w-full md:w-1/3 h-52 md:h-full' : 'h-56'}`}>
                                    {car.isFeatured && (
                                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                                            <span className="bg-gold-500 text-navy-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">Featured</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="bg-navy-900/80 backdrop-blur-md text-white text-[11px] font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-lg">{car.year}</span>
                                    </div>
                                    <Image
                                        src={car.images?.[0] || (car.img ? `https://images.unsplash.com/photo-${car.img}?auto=format&fit=crop&q=80&w=600&h=400` : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600&h=400')}
                                        alt={car.title || `${car.year} ${car.make} ${car.carModel}`}
                                        fill
                                        className="object-cover hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className={`p-6 flex-grow flex flex-col ${viewType === 'list' ? 'justify-between' : ''}`}>
                                    <div>
                                        <div className="text-gold-500 text-[12px] font-bold mb-1.5 tracking-wide uppercase">{car.type || car.bodyType}</div>
                                        <h3 className={`font-bold text-navy-900 mb-4 ${viewType === 'list' ? 'text-xl md:text-2xl' : 'text-[17px] line-clamp-1'}`}>
                                            {car.title || `${car.year} ${car.make} ${car.carModel}`}
                                        </h3>

                                        <div className={`flex items-center gap-4 text-[13px] text-navy-600 mb-4 ${viewType === 'list' ? 'flex-wrap' : ''}`}>
                                            <span className="flex items-center bg-light-100 px-3 py-1.5 rounded-lg"><CarIcon className="w-3.5 h-3.5 mr-2 text-navy-300" /> {(car.mileage || car.miles || 0).toLocaleString()} km</span>
                                            <span className="flex items-center bg-light-100 px-3 py-1.5 rounded-lg"><svg className="w-3.5 h-3.5 mr-2 text-navy-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4v18M13 3v18M19 21V11l-6-4M9 7v6M9 17v-2" /></svg> {car.fuelType || car.fuel}</span>
                                            <span className="flex items-center bg-light-100 px-3 py-1.5 rounded-lg"><Cog className="w-3.5 h-3.5 mr-2 text-navy-300" /> {car.transmission || car.trans}</span>
                                        </div>
                                    </div>

                                    <div className={`flex items-center justify-between border-t border-light-200 pt-4 ${viewType === 'list' ? 'mt-0' : 'mt-4'}`}>
                                        <div className="text-[22px] font-bold text-navy-900">${car.price.toLocaleString()}</div>
                                        <Link href={`/inventory/${car._id || car.id}`} className="text-[13px] font-bold bg-navy-900 text-white border border-navy-900 rounded-full px-6 py-2.5 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500 transition-all shadow-sm active:scale-95 text-sm mobile:text-base px-5 py-2.5 mobile:px-6 mobile:py-3">
                                            View car
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

            </div>
            <div className="mt-20">
                <Partners />
            </div>
        </div>
    );
}

export default function InventoryPage() {
    return (
        <Suspense fallback={
            <div className="bg-light-100 min-h-screen py-20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-gold-500" />
            </div>
        }>
            <InventoryContent />
        </Suspense>
    );
}
