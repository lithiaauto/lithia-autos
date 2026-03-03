'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Truck, Trash2, Edit, Loader2, X, Plus, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import Image from 'next/image';

export default function AdminDeliveries() {
    const { showToast } = useToast();
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingDelivery, setEditingDelivery] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [form, setForm] = useState({
        clientName: '',
        location: '',
        image: ''
    });

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const res = await fetch('/api/admin/deliveries');
            const data = await res.json();
            if (Array.isArray(data)) setDeliveries(data);
        } catch (e) {
            showToast('Failed to load deliveries', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Get Cloudinary signature
            const signRes = await fetch('/api/admin/cloudinary-sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: 'lithia-auto-deliveries' })
            });
            const { timestamp, signature, cloudName, apiKey } = await signRes.json();

            // 2. Upload to Cloudinary
            const fd = new FormData();
            fd.append('file', file);
            fd.append('api_key', apiKey);
            fd.append('timestamp', timestamp);
            fd.append('signature', signature);
            fd.append('folder', 'lithia-auto-deliveries');

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: fd,
            });

            if (!uploadRes.ok) throw new Error('Upload failed');
            const uploadData = await uploadRes.json();

            setForm(prev => ({ ...prev, image: uploadData.secure_url }));
            showToast('Image uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('Error uploading image', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleOpenModal = (d?: any) => {
        if (d) {
            setEditingDelivery(d);
            setForm({
                clientName: d.clientName || '',
                location: d.location || '',
                image: d.image || ''
            });
        } else {
            setEditingDelivery(null);
            setForm({
                clientName: '',
                location: '',
                image: ''
            });
        }
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this delivery entry?')) return;
        try {
            const res = await fetch(`/api/admin/deliveries/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Deleted', 'success');
                setDeliveries(prev => prev.filter(d => d._id !== id));
            } else {
                const errorData = await res.json();
                showToast(errorData.error || 'Delete failed', 'error');
            }
        } catch (e) {
            showToast('Delete failed', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.image) {
            showToast('Please provide an image URL or upload an image', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const url = editingDelivery ? `/api/admin/deliveries/${editingDelivery._id}` : '/api/admin/deliveries';
            const method = editingDelivery ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                showToast(editingDelivery ? 'Updated' : 'Added', 'success');
                setShowModal(false);
                fetchDeliveries();
            } else {
                const errorData = await res.json();
                showToast(errorData.error || 'Operation failed', 'error');
            }
        } catch (e) {
            showToast('Operation failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filtered = deliveries.filter(d =>
        (d.clientName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (d.location?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Deliveries Management</h1>
                    <p className="text-sm text-navy-600 mt-1">Manage showcased client deliveries for the &quot;Delivered by Driveway&quot; section.</p>
                </div>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Delivery
                </Button>
            </div>

            <Card className="shadow-none border-light-300">
                <div className="p-4 border-b border-light-200 bg-light-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search by Client or Location..."
                            className="w-full bg-light-100 border border-light-300 py-2.5 pl-10 pr-4 focus:outline-none focus:border-navy-500 text-sm rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3 h-4 w-4 text-navy-400" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-navy-600">
                        <span>Total: {filtered.length}</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-navy-400" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {filtered.map((d: any) => (
                            <Card key={d._id} className="overflow-hidden border-light-200 hover:border-navy-200 transition-all flex flex-col">
                                <div className="relative h-48 w-full bg-light-200">
                                    {d.image ? (
                                        <img src={d.image} alt={d.clientName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Truck className="h-12 w-12 text-light-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex-1">
                                    <h3 className="font-bold text-navy-900">{d.clientName}</h3>
                                    <p className="text-sm text-navy-600">{d.location}</p>
                                </div>
                                <div className="p-3 bg-light-50 border-t border-light-200 grid grid-cols-2 gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(d)} className="h-9 px-2 text-navy-600 hover:text-navy-900">
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(d._id)} className="h-9 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>

            {/* Form Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-light-200 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-navy-900">{editingDelivery ? 'Edit' : 'Add'} Delivery Showcase</h2>
                            <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-navy-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Client Name</label>
                                <input type="text" className="w-full bg-light-50 border border-light-300 p-2 text-sm rounded focus:border-gold-500 outline-none" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Location</label>
                                <input type="text" className="w-full bg-light-50 border border-light-300 p-2 text-sm rounded focus:border-gold-500 outline-none" placeholder="e.g. London, UK" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Image URL</label>
                                <div className="space-y-3">
                                    {form.image && (
                                        <div className="relative h-40 w-full rounded-lg overflow-hidden border border-light-200 bg-light-50">
                                            <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, image: '' })}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded focus:border-gold-500 outline-none pr-10"
                                                placeholder="Paste image URL..."
                                                value={form.image}
                                                onChange={e => setForm({ ...form, image: e.target.value })}
                                            />
                                            <ImageIcon className="absolute right-3 top-3 h-4 w-4 text-navy-400" />
                                        </div>
                                        <input
                                            type="file"
                                            id="delivery-image-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-[42px] px-4 gap-2 border-light-300 hover:border-gold-500 hover:text-gold-500"
                                            onClick={() => document.getElementById('delivery-image-upload')?.click()}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                                            Upload
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-navy-400 italic">Recommended: 1200x800px or larger. High quality images work best.</p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : editingDelivery ? 'Update' : 'Add Delivery'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
