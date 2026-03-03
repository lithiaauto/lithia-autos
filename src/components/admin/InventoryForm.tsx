'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, UploadCloud, Search, Loader2, X, Plus, Link as LinkIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { decodeVin } from '@/lib/vpic';
import { useToast } from '@/components/ui/Toast';

interface InventoryFormProps {
    initialData?: any;
    isEdit?: boolean;
    id?: string;
}

const FEATURE_CATEGORIES = {
    convenience: ['Adaptive Cruise', 'Heated Seats', 'Navigation', 'Keyless Start', 'Automatic Climate Control', 'A/C: Front', 'Cruise Control', 'Phone connectivity', 'In-car Wi-Fi'],
    entertainment: ['Premium Audio', 'Apple CarPlay', 'Android Auto', 'Bluetooth', 'Touch Screen', 'Audio system', 'Touchscreen display', 'GPS navigation'],
    safety: ['Backup Camera', 'Blind Spot Monitor', 'Lane Assist', 'Emergency Braking', 'Anti Lock Braking System', 'Passenger Airbag', 'Driver Airbag', 'Power Locks'],
    exterior: ['LED Lights', 'Panoramic Sunroof', 'Roof Rack', 'Tow Package', 'Alloy Wheels', 'Fog Lights - Front', 'Chrome-plated grill', 'Smart headlight cluster', 'Premium wheels', 'Body character lines', 'High-quality paint'],
    interior: ['Multi-function Steering Wheel', 'Power Windows Rear', 'Power Windows Front', 'Engine Start Stop Button', 'Power Steering'],
    seating: ['Spare Tire', 'Cargo Mat', 'First Aid Kit'],
    other: ['Spare Tire', 'Cargo Mat', 'First Aid Kit']
};

export default function InventoryForm({ initialData, isEdit, id }: InventoryFormProps) {
    const { showToast } = useToast();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDecoding, setIsDecoding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');

    // images state will store objects: { url: string, file?: File, status: 'existing' | 'new' }
    const [images, setImages] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        vin: '',
        stockNumber: '',
        make: '',
        carModel: '',
        bodyType: 'Sedan',
        year: new Date().getFullYear().toString(),
        price: '',
        mileage: '',
        dealRating: 'None',
        fuelType: 'Gasoline',
        drivetrain: 'FWD',
        transmission: 'Automatic',
        condition: 'Clean title, No accidents reported',
        cylinders: '',
        doors: '4',
        color: '',
        seats: '5',
        cityMPG: '',
        highwayMPG: '',
        engineSize: '',
        description: '',
        comfortDescription: '',
        isFeatured: false,
        homepageHero: false,
        recommended: false,
        latestPicks: false
    });

    const [reviews, setReviews] = useState<any[]>([]);

    const [features, setFeatures] = useState({
        convenience: [] as string[],
        entertainment: [] as string[],
        safety: [] as string[],
        exterior: [] as string[],
        interior: [] as string[],
        seating: [] as string[],
        other: [] as string[]
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                vin: initialData.vin || '',
                stockNumber: initialData.stockNumber || '',
                make: initialData.make || '',
                carModel: initialData.carModel || '',
                bodyType: initialData.bodyType || 'Sedan',
                year: (initialData.year || new Date().getFullYear()).toString(),
                price: (initialData.price || '').toString(),
                mileage: (initialData.mileage || '').toString(),
                dealRating: initialData.dealRating || 'None',
                fuelType: initialData.fuelType || 'Gasoline',
                drivetrain: initialData.drivetrain || 'FWD',
                transmission: initialData.transmission || 'Automatic',
                condition: initialData.condition || 'Clean title, No accidents reported',
                cylinders: initialData.cylinders || '',
                doors: (initialData.doors || 4).toString(),
                color: initialData.color || '',
                seats: (initialData.seats || 5).toString(),
                cityMPG: (initialData.cityMPG || '').toString(),
                highwayMPG: (initialData.highwayMPG || '').toString(),
                engineSize: initialData.engineSize || '',
                description: initialData.description || '',
                comfortDescription: initialData.comfortDescription || '',
                isFeatured: !!initialData.isFeatured,
                homepageHero: !!initialData.homepageHero,
                recommended: !!initialData.recommended,
                latestPicks: !!initialData.latestPicks
            });

            if (initialData.features) {
                setFeatures({
                    convenience: initialData.features.convenience || [],
                    entertainment: initialData.features.entertainment || [],
                    safety: initialData.features.safety || [],
                    exterior: initialData.features.exterior || [],
                    interior: initialData.features.interior || [],
                    seating: initialData.features.seating || [],
                    other: initialData.features.other || []
                });
            }

            if (initialData.images) {
                setImages(initialData.images.map((url: string) => ({ url, status: 'existing' })));
            }

            if (initialData.reviews) {
                setReviews(initialData.reviews.map((r: any) => ({
                    ...r,
                    date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                })));
            }
        }
    }, [initialData]);

    const handleVinDecode = async () => {
        if (!formData.vin || formData.vin.length < 11) {
            showToast('Please enter a valid VIN', 'error');
            return;
        }
        setIsDecoding(true);
        try {
            const data = await decodeVin(formData.vin);
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    make: data.Make || prev.make,
                    carModel: data.Model || prev.carModel,
                    year: data.ModelYear ? data.ModelYear.toString() : prev.year,
                    fuelType: data.FuelTypePrimary || prev.fuelType,
                    drivetrain: data.DriveType?.includes('All') ? 'AWD' : data.DriveType?.includes('4') ? '4WD' : prev.drivetrain
                }));
                showToast('VIN decoded successfully', 'success');
            }
        } catch (e) {
            showToast('Failed to decode VIN', 'error');
        } finally {
            setIsDecoding(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as any).checked : value
        }));
    };

    const handleFeatureChange = (category: keyof typeof features, feature: string) => {
        setFeatures(prev => {
            const current = [...prev[category]];
            if (current.includes(feature)) {
                return { ...prev, [category]: current.filter(f => f !== feature) };
            } else {
                return { ...prev, [category]: [...current, feature] };
            }
        });
    };

    const handleSelectAll = (category: keyof typeof features) => {
        const allFeatures = FEATURE_CATEGORIES[category];
        setFeatures(prev => {
            const current = prev[category];
            if (current.length === allFeatures.length) {
                // If all are selected, deselect all
                return { ...prev, [category]: [] };
            } else {
                // Otherwise select all
                return { ...prev, [category]: [...allFeatures] };
            }
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages = Array.from(files).map((file: File) => ({
            url: URL.createObjectURL(file),
            file,
            status: 'new'
        }));

        setImages(prev => [...prev, ...newImages]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const addImageUrl = () => {
        if (!imageUrlInput) return;
        setImages(prev => [...prev, { url: imageUrlInput, status: 'new' }]);
        setImageUrlInput('');
    };

    const removeImage = (index: number) => {
        const img = images[index];
        if (img.status === 'new' && img.file) {
            URL.revokeObjectURL(img.url);
        }
        setImages(prev => prev.filter((_: any, i: number) => i !== index));
    };

    const addReview = () => {
        setReviews(prev => [...prev, {
            author: '',
            avatar: '',
            rating: 5,
            title: '',
            body: '',
            date: new Date().toISOString().split('T')[0]
        }]);
    };

    const removeReview = (index: number) => {
        setReviews(prev => prev.filter((_, i) => i !== index));
    };

    const updateReview = (index: number, field: string, value: any) => {
        setReviews(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Upload new files or external URLs to Cloudinary
            const processedImages = [...images];
            const needsUpload = processedImages.filter((img: any) =>
                img.status === 'new' && (img.file || (img.url && !img.url.includes('cloudinary.com') && img.url.startsWith('http')))
            );

            if (needsUpload.length > 0) {
                const signRes = await fetch('/api/admin/cloudinary-sign', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ folder: 'lithia-auto-inventory' })
                });
                const { timestamp, signature, cloudName, apiKey } = await signRes.json();

                for (let i = 0; i < processedImages.length; i++) {
                    const img = processedImages[i];
                    const isNewFile = img.status === 'new' && img.file;
                    const isExternalUrl = img.status === 'new' && !img.file && img.url && !img.url.includes('cloudinary.com') && img.url.startsWith('http');

                    if (isNewFile || isExternalUrl) {
                        const fd = new FormData();
                        fd.append('file', img.file || img.url);
                        fd.append('api_key', apiKey);
                        fd.append('timestamp', timestamp);
                        fd.append('signature', signature);
                        fd.append('folder', 'lithia-auto-inventory');

                        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                            method: 'POST',
                            body: fd,
                        });

                        if (!uploadRes.ok) {
                            const errorData = await uploadRes.json();
                            throw new Error(errorData.error?.message || 'Image upload failed');
                        }

                        const uploadData = await uploadRes.json();
                        processedImages[i] = { url: uploadData.secure_url, status: 'existing' };
                    }
                }
            }

            // 2. Final Submit
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                mileage: parseInt(formData.mileage),
                year: parseInt(formData.year),
                images: processedImages.map((img: any) => img.url),
                features,
                reviews: reviews.map(r => ({
                    ...r,
                    rating: parseInt(r.rating) || 5,
                    date: r.date ? new Date(r.date) : new Date()
                })),
                doors: parseInt(formData.doors),
                seats: parseInt(formData.seats),
                cityMPG: parseFloat(formData.cityMPG) || undefined,
                highwayMPG: parseFloat(formData.highwayMPG) || undefined,
                sellerInfo: {
                    name: 'Lithia Autos Advantage',
                    phone: '(708) 419-2546',
                    location: 'Bridgeview, IL'
                }
            };

            const url = isEdit ? `/api/admin/inventory/${id}` : '/api/admin/inventory';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(isEdit ? 'Vehicle updated' : 'Vehicle added', 'success');
                router.push('/admin/inventory');
            } else {
                const err = await res.json();
                showToast(err.error || 'Failed to save', 'error');
            }
        } catch (error) {
            showToast('Save failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="ghost" size="sm" onClick={() => router.back()} className="shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl md:text-2xl font-bold text-navy-900 truncate">{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-none">Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1 sm:flex-none">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        <span className="truncate">{isEdit ? 'Save Changes' : 'Publish'}</span>
                    </Button>
                </div>
            </div>

            <Card className="shadow-none border-light-300">
                <div className="px-4 md:px-6 py-4 border-b border-light-200 flex flex-col sm:flex-row sm:items-center gap-4">
                    <h2 className="text-lg font-semibold text-navy-800">Basic Information</h2>
                    <div className="flex flex-wrap gap-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-gold-50 px-2.5 py-1.5 rounded-lg border border-gold-200">
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="rounded border-gold-300 text-gold-500 shadow-none" />
                            <span className="text-[10px] font-bold text-navy-900 uppercase">Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-navy-50 px-2.5 py-1.5 rounded-lg border border-navy-200">
                            <input type="checkbox" name="homepageHero" checked={formData.homepageHero} onChange={handleChange} className="rounded border-navy-300 text-navy-900 shadow-none" />
                            <span className="text-[10px] font-bold text-navy-900 uppercase">Hero</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-200">
                            <input type="checkbox" name="recommended" checked={formData.recommended} onChange={handleChange} className="rounded border-green-300 text-green-600 shadow-none" />
                            <span className="text-[10px] font-bold text-navy-900 uppercase">Recs</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-200">
                            <input type="checkbox" name="latestPicks" checked={formData.latestPicks} onChange={handleChange} className="rounded border-purple-300 text-purple-600 shadow-none" />
                            <span className="text-[10px] font-bold text-navy-900 uppercase">Latest</span>
                        </label>
                    </div>
                </div>
                <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">VIN</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input type="text" name="vin" value={formData.vin} onChange={handleChange} className="flex-1 bg-light-50 border border-light-300 p-2 text-sm uppercase" />
                            <Button type="button" variant="outline" size="sm" onClick={handleVinDecode} disabled={isDecoding}>
                                {isDecoding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
                                Decode
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Stock Number</label>
                        <input type="text" name="stockNumber" value={formData.stockNumber} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Make *</label>
                        <input type="text" name="make" value={formData.make} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Model *</label>
                        <input type="text" name="carModel" value={formData.carModel} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Body Type *</label>
                        <select name="bodyType" value={formData.bodyType} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" required>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Pickup Truck">Pickup Truck</option>
                            <option value="Minivan">Minivan</option>
                            <option value="Crossover">Crossover</option>
                            <option value="MVP">MVP</option>
                            <option value="Coupe">Coupe</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Year *</label>
                        <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Price ($) *</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Mileage (KM) *</label>
                        <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Deal Rating</label>
                        <select name="dealRating" value={formData.dealRating} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm">
                            <option value="None">None</option>
                            <option value="Great Deal">Great Deal</option>
                            <option value="Good Deal">Good Deal</option>
                            <option value="Fair Deal">Fair Deal</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Fuel Type *</label>
                        <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" required>
                            <option value="Gasoline">Gasoline</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Drivetrain *</label>
                        <select name="drivetrain" value={formData.drivetrain} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" required>
                            <option value="FWD">FWD (Front-Wheel Drive)</option>
                            <option value="RWD">RWD (Rear-Wheel Drive)</option>
                            <option value="AWD">AWD (All-Wheel Drive)</option>
                            <option value="4WD">4WD (Four-Wheel Drive)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Transmission *</label>
                        <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" required>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                        </select>
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-semibold text-navy-800">Vehicle Condition</label>
                        <input type="text" name="condition" value={formData.condition} onChange={handleChange} placeholder="e.g. Clean title, No accidents reported" className="w-full bg-light-50 border border-light-300 p-2 text-sm" />
                    </div>

                    {/* New Fields Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Cylinders</label>
                        <input type="text" name="cylinders" value={formData.cylinders} onChange={handleChange} placeholder="e.g. V6, 4" className="w-full bg-light-50 border border-light-300 p-2 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Doors</label>
                        <input type="number" name="doors" value={formData.doors} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Interior/Exterior Color</label>
                        <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Blue, Gray" className="w-full bg-light-50 border border-light-300 p-2 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Seats</label>
                        <input type="number" name="seats" value={formData.seats} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">City MPG</label>
                        <input type="number" name="cityMPG" value={formData.cityMPG} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Highway MPG</label>
                        <input type="number" name="highwayMPG" value={formData.highwayMPG} onChange={handleChange} className="w-full bg-light-50 border border-light-300 p-2 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Engine Size</label>
                        <input type="text" name="engineSize" value={formData.engineSize} onChange={handleChange} placeholder="e.g. 2.9, 5.0L" className="w-full bg-light-50 border border-light-300 p-2 text-sm" />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-none border-light-300">
                <div className="px-4 md:px-6 py-4 border-b border-light-200">
                    <h2 className="text-lg font-semibold text-navy-800">Media & Images</h2>
                </div>
                <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-light-50 border-2 border-dashed border-light-300 rounded-xl p-6 text-center">
                            <UploadCloud className="h-8 w-8 text-navy-400 mx-auto mb-2" />
                            <h3 className="font-bold text-sm text-navy-900">Upload Files</h3>
                            <p className="text-[10px] text-navy-600 mb-3">Images will be saved only after form submission.</p>
                            <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                Select Images
                            </Button>
                        </div>
                        <div className="bg-light-50 border-2 border-dashed border-light-300 rounded-xl p-6 text-center">
                            <LinkIcon className="h-8 w-8 text-navy-400 mx-auto mb-2" />
                            <h3 className="font-bold text-sm text-navy-900">Image URL</h3>
                            <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="https://..." className="flex-1 text-xs border border-light-300 p-2 rounded" />
                                <Button type="button" variant="navy" size="sm" onClick={addImageUrl}>Add</Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {images.map((img: any, idx: number) => (
                            <div key={idx} className="relative aspect-square rounded-lg border border-light-200 overflow-hidden group">
                                <img src={img.url} className="w-full h-full object-cover" alt="prev" />
                                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="h-3 w-3" />
                                </button>
                                {img.status === 'new' && (
                                    <div className="absolute bottom-1 left-1 bg-gold-400 text-navy-900 text-[8px] px-1 rounded font-bold uppercase">Unsaved</div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-none border-light-300">
                <div className="px-4 md:px-6 py-4 border-b border-light-200">
                    <h2 className="text-lg font-semibold text-navy-800">Features & Description</h2>
                </div>
                <CardContent className="p-4 md:p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Seller Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-light-50 border border-light-300 p-3 text-sm" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy-800">Comfort & Convenience Description</label>
                        <textarea name="comfortDescription" value={formData.comfortDescription} onChange={handleChange} rows={3} placeholder="Proin sed tellus porttitor..." className="w-full bg-light-50 border border-light-300 p-3 text-sm" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {(Object.keys(FEATURE_CATEGORIES) as Array<keyof typeof features>).map((cat) => (
                            <div key={cat}>
                                <div className="flex items-center justify-between mb-3 border-b border-light-200 pb-1">
                                    <h4 className="font-bold text-[10px] uppercase text-navy-400">{cat}</h4>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectAll(cat)}
                                        className="text-[9px] font-bold text-gold-600 hover:text-gold-700 uppercase tracking-wider"
                                    >
                                        {features[cat].length === FEATURE_CATEGORIES[cat].length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {FEATURE_CATEGORIES[cat].map((f: string) => (
                                        <label key={f} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={features[cat].includes(f)}
                                                onChange={() => handleFeatureChange(cat, f)}
                                                className="rounded text-gold-500"
                                            />
                                            <span className="text-xs text-navy-700 group-hover:text-gold-600">{f}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-none border-light-300">
                <div className="px-4 md:px-6 py-4 border-b border-light-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-navy-800">Customer Reviews</h2>
                    <Button type="button" variant="outline" size="sm" onClick={addReview}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Review
                    </Button>
                </div>
                <CardContent className="p-4 md:p-6 space-y-6">
                    {reviews.length === 0 ? (
                        <div className="text-center py-8 bg-light-50 rounded-xl border border-dashed border-light-300">
                            <p className="text-sm text-navy-600">No reviews added yet. Click "Add Review" to represent customer feedback.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review, idx) => (
                                <div key={idx} className="p-4 bg-light-50 border border-light-200 rounded-xl space-y-4 relative group">
                                    <button type="button" onClick={() => removeReview(idx)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-navy-400">Author Name</label>
                                            <input type="text" value={review.author} onChange={(e) => updateReview(idx, 'author', e.target.value)} placeholder="e.g. John Doe" className="w-full bg-white border border-light-300 p-2 text-sm rounded" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase text-navy-400">Avatar URL</label>
                                            <div className="flex gap-2">
                                                <input type="text" value={review.avatar} onChange={(e) => updateReview(idx, 'avatar', e.target.value)} placeholder="https://..." className="flex-1 bg-white border border-light-300 p-2 text-sm rounded" />
                                                {review.avatar && <img src={review.avatar} className="w-9 h-9 rounded-full object-cover border border-gold-200" alt="Avatar preview" />}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-navy-400">Rating (1-5)</label>
                                            <input type="number" min="1" max="5" value={review.rating} onChange={(e) => updateReview(idx, 'rating', e.target.value)} className="w-full bg-white border border-light-300 p-2 text-sm rounded" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-navy-400">Title</label>
                                            <input type="text" value={review.title} onChange={(e) => updateReview(idx, 'title', e.target.value)} placeholder="e.g. Amazing Car" className="w-full bg-white border border-light-300 p-2 text-sm rounded" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-navy-400">Date</label>
                                            <input type="date" value={review.date} onChange={(e) => updateReview(idx, 'date', e.target.value)} className="w-full bg-white border border-light-300 p-2 text-sm rounded" />
                                        </div>
                                        <div className="space-y-2 md:col-span-3">
                                            <label className="text-[10px] font-bold uppercase text-navy-400">Review Body</label>
                                            <textarea value={review.body} onChange={(e) => updateReview(idx, 'body', e.target.value)} rows={3} placeholder="Write the review content here..." className="w-full bg-white border border-light-300 p-3 text-sm rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </form>
    );
}
