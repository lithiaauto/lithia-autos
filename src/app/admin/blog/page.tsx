'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Search, Edit2, Trash2, ExternalLink, Calendar, User as UserIcon, BookOpen, Loader2, X, Plus, Image as ImageIcon, UploadCloud, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

export default function AdminBlogPage() {
    const { showToast } = useToast();
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const featuredInputRef = useRef<HTMLInputElement>(null);
    const authorInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const [featuredFile, setFeaturedFile] = useState<File | null>(null);
    const [authorFile, setAuthorFile] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<any[]>([]); // { url, file, status }

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Industry News',
        author: 'Lithia Autos',
        image: '',
        authorImage: '',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        tags: '',
        quoteText: '',
        quoteAuthor: '',
        additionalImages: '',
        additionalContent: '',
        isFeatured: false
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/blog');
            const data = await res.json();
            if (Array.isArray(data)) setPosts(data);
        } catch (e) {
            showToast('Failed to load blog posts', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (p?: any) => {
        setFeaturedFile(null);
        setAuthorFile(null);
        if (p) {
            setEditingPost(p);
            setForm({
                title: p.title || '',
                excerpt: p.excerpt || '',
                content: p.content || '',
                category: p.category || 'Industry News',
                author: p.author || 'Lithia Autos',
                image: p.image || '',
                authorImage: p.authorImage || '',
                date: p.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
                quoteText: p.quoteText || '',
                quoteAuthor: p.quoteAuthor || '',
                additionalImages: Array.isArray(p.additionalImages) ? p.additionalImages.join(', ') : '',
                additionalContent: p.additionalContent || '',
                isFeatured: p.isFeatured || false
            });
            if (p.additionalImages) {
                setGalleryImages(p.additionalImages.map((url: string) => ({ url, status: 'existing' })));
            } else {
                setGalleryImages([]);
            }
        } else {
            setEditingPost(null);
            setForm({
                title: '',
                excerpt: '',
                content: '',
                category: 'Industry News',
                author: 'Lithia Autos',
                image: '',
                authorImage: '',
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                tags: '',
                quoteText: '',
                quoteAuthor: '',
                additionalImages: '',
                additionalContent: '',
                isFeatured: false
            });
            setGalleryImages([]);
        }
        setShowModal(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'featured' | 'author' | 'gallery') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (type === 'featured') {
            const file = files[0];
            setFeaturedFile(file);
            setForm(prev => ({ ...prev, image: URL.createObjectURL(file) }));
        } else if (type === 'author') {
            const file = files[0];
            setAuthorFile(file);
            setForm(prev => ({ ...prev, authorImage: URL.createObjectURL(file) }));
        } else if (type === 'gallery') {
            const newImages = Array.from(files).map((file: File) => ({
                url: URL.createObjectURL(file),
                file,
                status: 'new'
            }));
            setGalleryImages(prev => [...prev, ...newImages]);
        }
        e.target.value = '';
    };

    const removeImage = (type: 'featured' | 'author' | 'gallery', index?: number) => {
        if (type === 'featured') {
            setFeaturedFile(null);
            setForm(prev => ({ ...prev, image: '' }));
        } else if (type === 'author') {
            setAuthorFile(null);
            setForm(prev => ({ ...prev, authorImage: '' }));
        } else if (type === 'gallery' && typeof index === 'number') {
            const img = galleryImages[index];
            if (img.status === 'new' && img.file) {
                URL.revokeObjectURL(img.url);
            }
            setGalleryImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const uploadToCloudinary = async (fileOrUrl: File | string, folder: string) => {
        const signRes = await fetch('/api/admin/cloudinary-sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folder })
        });
        const { timestamp, signature, cloudName, apiKey } = await signRes.json();

        const fd = new FormData();
        fd.append('file', fileOrUrl);
        fd.append('api_key', apiKey);
        fd.append('timestamp', timestamp);
        fd.append('signature', signature);
        fd.append('folder', folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: fd,
        });

        if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(errorData.error?.message || 'Image upload failed');
        }

        const uploadData = await uploadRes.json();
        return uploadData.secure_url;
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this article?')) return;
        try {
            const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Article deleted', 'success');
                setPosts(prev => prev.filter(p => p._id !== id));
            }
        } catch (e) {
            showToast('Delete failed', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let finalImage = form.image;
            let finalAuthorImage = form.authorImage;
            const finalGallery = [...galleryImages];

            // 1. Upload Featured Image
            if (featuredFile || (form.image && !form.image.includes('cloudinary.com') && form.image.startsWith('http'))) {
                finalImage = await uploadToCloudinary(featuredFile || form.image, 'lithia-auto-blog');
            }

            // 2. Upload Author Image
            if (authorFile || (form.authorImage && !form.authorImage.includes('cloudinary.com') && form.authorImage.startsWith('http'))) {
                finalAuthorImage = await uploadToCloudinary(authorFile || form.authorImage, 'lithia-auto-blog');
            }

            // 3. Upload Gallery
            for (let i = 0; i < finalGallery.length; i++) {
                const img = finalGallery[i];
                if (img.status === 'new') {
                    const isExternal = !img.file && img.url && !img.url.includes('cloudinary.com') && img.url.startsWith('http');
                    if (img.file || isExternal) {
                        const uploadedUrl = await uploadToCloudinary(img.file || img.url, 'lithia-auto-blog');
                        finalGallery[i] = { url: uploadedUrl, status: 'existing' };
                    }
                }
            }

            const payload = {
                ...form,
                image: finalImage,
                authorImage: finalAuthorImage,
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                additionalImages: finalGallery.map(img => img.url)
            };
            const url = editingPost ? `/api/admin/blog/${editingPost._id}` : '/api/admin/blog';
            const method = editingPost ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showToast(editingPost ? 'Article updated' : 'Article published', 'success');
                setShowModal(false);
                fetchPosts();
            } else {
                const err = await res.json();
                showToast(err.error || 'Save failed', 'error');
            }
        } catch (e: any) {
            console.error('Submit error:', e);
            showToast(e.message || 'Save failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Blog Management</h1>
                    <p className="text-navy-600 text-sm mt-1">Create, edit, and manage your website articles.</p>
                </div>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    New Article
                </Button>
            </div>

            <Card className="shadow-none border-light-300">
                <div className="p-4 border-b border-light-200 bg-light-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-light-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-light-300 rounded-xl focus:outline-none focus:border-gold-500 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-navy-400" /></div>
                ) : (
                    <div className="divide-y divide-light-200">
                        {filtered.map((post: any) => (
                            <div key={post._id} className="p-6 hover:bg-light-50 transition-colors flex flex-col md:flex-row gap-6">
                                <div className="h-24 w-40 rounded-xl overflow-hidden shrink-0 border border-light-200">
                                    <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="text-gold-600 text-[10px] font-black uppercase tracking-widest">{post.category}</div>
                                        {post.isFeatured && <span className="px-2 py-0.5 bg-navy-900 text-gold-500 text-[10px] font-bold rounded-full">Featured</span>}
                                    </div>
                                    <h3 className="font-bold text-navy-900 text-lg mb-2 truncate">{post.title}</h3>
                                    <div className="flex items-center gap-4 text-navy-400 text-xs">
                                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /> {post.author}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(post)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(post._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-light-200 flex justify-between items-center shrink-0">
                            <h2 className="text-lg font-bold text-navy-900">{editingPost ? 'Edit' : 'Create'} Article</h2>
                            <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-navy-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Title</label>
                                <input type="text" className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg focus:border-gold-500 outline-none" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-navy-600 uppercase">Category</label>
                                        <select className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                            <option>First Drives</option>
                                            <option>Industry News</option>
                                            <option>Maintenance</option>
                                            <option>Buying Guides</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-navy-600 uppercase">Featured Image</label>
                                        <div className="flex gap-2">
                                            <input type="text" className="flex-1 bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                                            <input type="file" accept="image/*" className="hidden" ref={featuredInputRef} onChange={e => handleFileSelect(e, 'featured')} />
                                            <Button type="button" variant="outline" size="sm" onClick={() => featuredInputRef.current?.click()}>
                                                <UploadCloud className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center bg-light-50 rounded-xl border border-light-300 p-2 h-32 relative group">
                                    {form.image ? (
                                        <>
                                            <img src={form.image} className="h-full w-full object-cover rounded-lg" alt="Preview" />
                                            <button type="button" onClick={() => removeImage('featured')} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                                        </>
                                    ) : (
                                        <div className="text-center text-navy-300">
                                            <ImageIcon className="h-8 w-8 mx-auto mb-1 opacity-20" />
                                            <span className="text-[10px] font-bold uppercase">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy-600 uppercase">Author Name</label>
                                    <input type="text" className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg focus:border-gold-500 outline-none" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Lithia Autos" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy-600 uppercase text-gold-600">Author Image</label>
                                    <div className="flex gap-2">
                                        <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-light-300 bg-light-100 flex items-center justify-center">
                                            {form.authorImage ? <img src={form.authorImage} className="w-full h-full object-cover" /> : <UserIcon className="h-5 w-5 text-navy-200" />}
                                        </div>
                                        <input type="text" className="flex-1 bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" value={form.authorImage} onChange={e => setForm({ ...form, authorImage: e.target.value })} placeholder="https://..." />
                                        <input type="file" accept="image/*" className="hidden" ref={authorInputRef} onChange={e => handleFileSelect(e, 'author')} />
                                        <Button type="button" variant="outline" size="sm" onClick={() => authorInputRef.current?.click()}>
                                            <UploadCloud className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy-600 uppercase">Tags (comma separated)</label>
                                    <input type="text" className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="AutoDecar, BMW, Design" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy-600 uppercase">Date Posted</label>
                                    <input type="date" className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Excerpt</label>
                                <textarea className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Section 1 Content (Markdown supported)</label>
                                <textarea className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-light-200 pt-4 mt-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy-600 uppercase text-gold-600">Highlight Quote Text</label>
                                    <textarea className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" rows={3} value={form.quoteText} onChange={e => setForm({ ...form, quoteText: e.target.value })} placeholder="Lorem ipsum dolor..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy-600 uppercase text-gold-600">Highlight Quote Author</label>
                                    <input type="text" className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" value={form.quoteAuthor} onChange={e => setForm({ ...form, quoteAuthor: e.target.value })} placeholder="said Mike Fratantoni..." />
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-light-200 pt-6 mt-6">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-navy-600 uppercase">Additional Content Gallery</label>
                                    <div className="flex gap-2">
                                        <input type="file" multiple accept="image/*" className="hidden" ref={galleryInputRef} onChange={e => handleFileSelect(e, 'gallery')} />
                                        <Button type="button" variant="outline" size="sm" onClick={() => galleryInputRef.current?.click()}>
                                            <UploadCloud className="h-4 w-4 mr-2" />
                                            Upload Images
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {galleryImages.map((img: any, idx: number) => (
                                        <div key={idx} className="relative aspect-video rounded-xl border border-light-200 overflow-hidden group">
                                            <img src={img.url} className="w-full h-full object-cover" alt="Gallery" />
                                            <button type="button" onClick={() => removeImage('gallery', idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3.5 w-3.5" /></button>
                                            {img.status === 'new' && <div className="absolute bottom-1 left-1 bg-gold-400 text-navy-900 text-[8px] px-1.5 rounded font-black uppercase">Unsaved</div>}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => {
                                        const url = prompt('Enter Image URL:');
                                        if (url) setGalleryImages(prev => [...prev, { url, status: 'new' }]);
                                    }} className="aspect-video rounded-xl border-2 border-dashed border-light-200 flex flex-col items-center justify-center text-navy-300 hover:border-gold-500 hover:text-gold-500 transition-colors">
                                        <Plus className="h-6 w-6 mb-1" />
                                        <span className="text-[10px] font-bold uppercase">Add URL</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Section 2 Content (Below Gallery)</label>
                                <textarea className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg outline-none" rows={6} value={form.additionalContent} onChange={e => setForm({ ...form, additionalContent: e.target.value })} />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    checked={form.isFeatured}
                                    onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                                    className="w-4 h-4 accent-gold-500"
                                />
                                <label htmlFor="isFeatured" className="text-sm font-bold text-navy-900 cursor-pointer">Featured Article (Show in sidebar)</label>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : editingPost ? 'Update Article' : 'Publish Article'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
