'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, User, MessageCircle, ChevronRight, Facebook, Linkedin, Instagram } from 'lucide-react';
import { BlogPost } from '@/data/blogs';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const Partners = dynamic(() => import('@/components/ui/Partners').then((mod) => mod.Partners), { ssr: false });

export default function BlogListingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllTags, setShowAllTags] = useState(false);

    React.useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/blog');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setPosts(data.map((p: any) => ({
                            id: p._id,
                            title: p.title,
                            author: p.author || 'Lithia Autos',
                            category: p.category,
                            commentsCount: p.commentsCount || 0,
                            date: p.date,
                            image: p.image,
                            excerpt: p.excerpt,
                            tags: p.tags || ['AutoDecar', 'BMW', 'Design'],
                            isFeatured: p.isFeatured
                        })));
                    } else {
                        setPosts([]);
                    }
                }
            } catch (e) {
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const activePosts = posts;

    const filteredPosts = activePosts.filter((post: any) => {
        const titleMatch = (post.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        const excerptMatch = (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatch = (post.category || '').toLowerCase().includes(searchQuery.toLowerCase());

        const tagsMatch = selectedTags.length === 0 ||
            selectedTags.some(tag => post.tags?.includes(tag));

        return (titleMatch || excerptMatch || categoryMatch) && tagsMatch;
    });

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const featuredListings = activePosts.filter((p: any) => p.isFeatured === true || p.isFeatured === 'true').slice(0, 3);
    const displayFeatured = featuredListings;
    const categoryCounts = activePosts.reduce((acc, post) => {
        const cat = post.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

    const tagSet = new Set<string>();
    activePosts.forEach(post => {
        if (Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => tagSet.add(tag));
        }
    });
    const tags = Array.from(tagSet);

    return (
        <div className="bg-white min-h-screen font-sans py-20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Main Content */}
                    <main className="w-full lg:w-[68%]">
                        <div className="space-y-16">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                    <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-navy-400 font-bold animate-pulse">Loading amazing stories...</p>
                                </div>
                            ) : filteredPosts.length > 0 ? filteredPosts.map((post) => (
                                <article key={post.id} className="group">
                                    <div className="mb-6">
                                        <h2 className="text-3xl md:text-4xl font-black text-navy-900 mb-4 group-hover:text-gold-500 transition-colors pointer-events-auto">
                                            <Link href={`/blog/${post.id}`}>{post.title}</Link>
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-6 text-[13px] text-navy-400 font-bold uppercase tracking-wider">
                                            <div className="flex items-center gap-2"><User className="w-4 h-4 text-gold-500" /> {post.author}</div>
                                            <div className="flex items-center gap-2 text-gold-600 font-black tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div> {post.category}</div>
                                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gold-500" /> {post.date}</div>
                                        </div>
                                    </div>

                                    <Link href={`/blog/${post.id}`} className="block relative h-64 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
                                        <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </Link>

                                    <p className="text-gray-600 text-lg leading-relaxed mb-10 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-light-100">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-xs font-bold text-navy-900 uppercase tracking-widest">Tags:</span>
                                            {post.tags.slice(0, 5).map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    onClick={() => toggleTag(tag)}
                                                    className={`px-3 py-1 border rounded-lg text-[10px] font-black transition-all cursor-pointer ${selectedTags.includes(tag)
                                                        ? 'bg-gold-500 border-gold-500 text-navy-900 shadow-md'
                                                        : 'bg-light-50 border-light-200 text-navy-600 hover:border-gold-500 hover:text-gold-600'
                                                        }`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {post.tags.length > 5 && (
                                                <span className="text-[10px] font-bold text-navy-400">+{post.tags.length - 5} more</span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            )) : (
                                <div className="text-center py-20 text-navy-600 font-bold">
                                    No posts found matching your search.
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-[32%] space-y-12">
                        {/* Search */}
                        <div className="bg-white rounded-3xl border border-light-200 p-8 shadow-sm">
                            <h3 className="text-xl font-black text-navy-900 mb-6">Search blog</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-light-50 border border-light-300 rounded-2xl py-4 px-12 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-400" />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white rounded-3xl border border-light-200 p-8 shadow-sm">
                            <h3 className="text-xl font-black text-navy-900 mb-6">Categories</h3>
                            <ul className="space-y-4">
                                {categories.map((cat: any) => (
                                    <li key={cat.name} onClick={() => setSearchQuery(cat.name)} className="flex justify-between items-center group cursor-pointer">
                                        <span className="text-navy-700 font-bold group-hover:text-gold-600 transition-colors">{cat.name}</span>
                                        <span className="text-navy-400 font-bold">({cat.count})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Featured Listings */}
                        <div className="bg-white rounded-3xl border border-light-200 p-8 shadow-sm">
                            <h3 className="text-xl font-black text-navy-900 mb-6">Featured listings</h3>
                            <div className="space-y-6">
                                {displayFeatured.map((post: any) => (
                                    <Link key={post.id} href={`/blog/${post.id}`} className="flex gap-4 group">
                                        <div className="shrink-0 w-24 h-20 rounded-xl overflow-hidden shadow-md relative">
                                            <Image src={post.image} fill className="object-cover group-hover:scale-110 transition-transform" alt={post.title} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[14px] font-black text-navy-900 mb-2 leading-tight group-hover:text-gold-500 transition-colors line-clamp-2">{post.title}</h4>
                                            <div className="flex items-center gap-2 text-[10px] text-navy-400 font-bold uppercase tracking-widest">
                                                <Calendar className="w-3 h-3 text-gold-500" /> {post.date}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Popular Tags */}
                        <div className="bg-white rounded-3xl border border-light-200 p-8 shadow-sm">
                            <h3 className="text-xl font-black text-navy-900 mb-6">Popular tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {(showAllTags ? tags : tags.slice(0, 10)).map((tag: string) => (
                                    <span
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-5 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedTags.includes(tag)
                                            ? 'bg-gold-500 border-gold-500 text-navy-900 shadow-md scale-105'
                                            : 'bg-white border-light-200 text-navy-600 hover:border-gold-500 hover:text-gold-600'
                                            }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {tags.length > 10 && (
                                <button
                                    onClick={() => setShowAllTags(!showAllTags)}
                                    className="mt-6 text-sm font-bold text-gold-600 hover:text-gold-700 transition-colors w-full text-center"
                                >
                                    {showAllTags ? 'Show Less' : `See More Tags (${tags.length - 10})`}
                                </button>
                            )}
                        </div>
                    </aside>

                </div>
            </div>
            <div className="mt-20">
                <Partners />
            </div>
        </div>
    );
}
