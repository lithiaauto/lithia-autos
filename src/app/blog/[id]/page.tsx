'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, MessageCircle, ChevronLeft, Facebook, Linkedin, Search } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { Partners } from '@/components/ui/Partners';
import { Loader2 } from 'lucide-react';

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [post, setPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAllTags, setShowAllTags] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch the single post
                const res = await fetch(`/api/blog/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                } else {
                    router.push('/404');
                    return;
                }

                // Fetch all posts for sidebar
                const allRes = await fetch('/api/blog');
                if (allRes.ok) {
                    const allData = await allRes.json();
                    setPosts(allData);
                } else {
                    setPosts([]);
                }

            } catch (e) {
                router.push('/404');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [id, router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin text-gold-500" /></div>;
    }

    if (!post) {
        return null;
    }

    // Sidebar computations
    const activePosts = posts;
    const featuredListings = activePosts
        .filter((p: any) => {
            const isFeatured = p.isFeatured === true || p.isFeatured === 'true';
            if (!isFeatured) return false;

            const pId = String(p._id || p.id);
            const currentId = String(post._id || post.id);

            return pId !== currentId;
        })
        .slice(0, 3);

    const displayFeatured = featuredListings;

    const categoryCounts = activePosts.reduce((acc, p) => {
        const cat = p.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const categories = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

    const tagSet = new Set<string>();
    activePosts.forEach(p => {
        if (Array.isArray(p.tags)) {
            p.tags.forEach((tag: string) => tagSet.add(tag));
        }
    });
    const sidebarTags = Array.from(tagSet);
    const postTags = Array.isArray(post.tags) ? post.tags : ['AutoDecar', 'BMW'];

    return (
        <div className="bg-white min-h-screen font-sans py-20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <main className="w-full lg:w-[68%]">
                        <Link href="/blog" className="inline-flex items-center text-navy-600 hover:text-navy-900 font-bold text-sm mb-6 transition-colors group">
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Blog
                        </Link>

                        <h1 className="text-3xl md:text-5xl font-black text-navy-900 leading-tight mb-6">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-6 text-[13px] text-navy-400 font-bold uppercase tracking-wider mb-8 pb-8 border-b border-light-100">
                            <div className="flex items-center gap-2">
                                {post.authorImage ? (
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-gold-200">
                                        <img src={post.authorImage} className="w-full h-full object-cover" alt={post.author} />
                                    </div>
                                ) : (
                                    <User className="w-4 h-4 text-gold-500" />
                                )}
                                {post.author || 'Lithia Autos'}
                            </div>
                            <div className="flex items-center gap-2 text-gold-600 font-black tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div> {post.category}</div>
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gold-500" /> {post.date}</div>
                        </div>

                        {/* Featured Image */}
                        <div className="relative rounded-[30px] overflow-hidden mb-12 shadow-xl border border-light-200 bg-light-50 flex items-center justify-center">
                            <img src={post.image} alt={post.title} className="w-full h-auto object-contain sm:object-cover max-h-[600px]" />
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none prose-navy">
                            {post.excerpt && (
                                <h2 className="text-2xl font-bold text-navy-900 leading-relaxed mb-8">
                                    {post.excerpt}
                                </h2>
                            )}

                            <div className="text-gray-600 space-y-6 leading-loose text-[17px] whitespace-pre-line">
                                {post.content}
                            </div>

                            {/* Dynamic Highlight Quote */}
                            {post.quoteText && (
                                <div className="my-12 bg-orange-50/50 border-l-4 border-gold-500 p-8 rounded-r-3xl">
                                    <p className="text-xl font-bold text-gold-600 italic leading-relaxed mb-4">
                                        "{post.quoteText}"
                                    </p>
                                    {post.quoteAuthor && (
                                        <p className="text-sm font-black text-gold-700 uppercase tracking-widest">
                                            {post.quoteAuthor}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Dynamic Additional Images Gallery */}
                            {post.additionalImages && post.additionalImages.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                    {post.additionalImages.map((img: string, i: number) => (
                                        <div key={i} className="rounded-3xl overflow-hidden shadow-lg border border-light-200">
                                            <img src={img} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" alt={`Gallery item ${i}`} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Dynamic Additional Content */}
                            {post.additionalContent && (
                                <div className="text-gray-600 space-y-6 leading-loose text-[17px] whitespace-pre-line mt-8">
                                    {post.additionalContent}
                                </div>
                            )}
                        </div>

                        {/* Tags & Share */}
                        <div className="mt-16 pt-8 border-t border-light-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-xs font-black text-navy-900 uppercase tracking-widest">Tags:</span>
                                {postTags.map((tag: string) => (
                                    <span key={tag} onClick={() => router.push(`/blog?tag=${encodeURIComponent(tag)}`)} className="px-5 py-2.5 bg-white border border-light-200 rounded-xl text-xs font-bold text-navy-600 hover:border-gold-500 hover:text-gold-600 transition-all cursor-pointer">{tag}</span>
                                ))}
                            </div>
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
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            router.push(`/blog?search=${encodeURIComponent(searchQuery)}`);
                                        }
                                    }}
                                />
                                <Search
                                    onClick={() => router.push(`/blog?search=${encodeURIComponent(searchQuery)}`)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-400 cursor-pointer hover:text-gold-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white rounded-3xl border border-light-200 p-8 shadow-sm">
                            <h3 className="text-xl font-black text-navy-900 mb-6">Categories</h3>
                            <ul className="space-y-4">
                                {categories.map((cat: any) => (
                                    <li key={cat.name} onClick={() => router.push(`/blog?search=${encodeURIComponent(cat.name)}`)} className="flex justify-between items-center group cursor-pointer">
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
                                {displayFeatured.map((p: any) => (
                                    <Link key={p._id || p.id} href={`/blog/${p._id || p.id}`} className="flex gap-4 group">
                                        <div className="shrink-0 w-24 h-20 rounded-xl overflow-hidden shadow-md">
                                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={p.title} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[14px] font-black text-navy-900 mb-2 leading-tight group-hover:text-gold-500 transition-colors line-clamp-2">{p.title}</h4>
                                            <div className="flex items-center gap-2 text-[10px] text-navy-400 font-bold uppercase tracking-widest">
                                                <Calendar className="w-3 h-3 text-gold-500" /> {p.date}
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
                                {(showAllTags ? sidebarTags : sidebarTags.slice(0, 10)).map((tag: string) => (
                                    <span key={tag} onClick={() => router.push(`/blog?tag=${encodeURIComponent(tag)}`)} className="px-5 py-2.5 bg-white border border-light-200 rounded-xl text-xs font-bold text-navy-600 hover:border-gold-500 hover:text-gold-600 transition-all cursor-pointer">{tag}</span>
                                ))}
                            </div>
                            {sidebarTags.length > 10 && (
                                <button
                                    onClick={() => setShowAllTags(!showAllTags)}
                                    className="mt-6 text-sm font-bold text-gold-600 hover:text-gold-700 transition-colors w-full text-center"
                                >
                                    {showAllTags ? 'Show Less' : `See More Tags (${sidebarTags.length - 10})`}
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
