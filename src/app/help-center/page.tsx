'use client';

import React from 'react';
import { Search, MessageCircle, Phone, Mail, FileText, ChevronRight, HelpCircle } from 'lucide-react';

export default function HelpCenterPage() {
    const categories = [
        { title: 'Buying Guide', desc: 'Understanding the purchase process, documents, and registration.', icon: <FileText className="w-6 h-6" /> },
        { title: 'Payment Options', desc: 'Details on bank transfers, financing, and crypto payments.', icon: <Search className="w-6 h-6" /> },
        { title: 'Logistics & Delivery', desc: 'Tracking your vehicle and international shipping procedures.', icon: <HelpCircle className="w-6 h-6" /> },
        { title: 'Account Support', desc: 'Managing your profile, order history, and security settings.', icon: <MessageCircle className="w-6 h-6" /> }
    ];

    return (
        <div className="bg-white min-h-screen font-sans pb-24">
            {/* Hero Search */}
            <section className="bg-navy-900 py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gold-500/5 blur-[120px] rounded-full -translate-y-1/2"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">How can we <span className="text-gold-500">help you?</span></h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <input
                            type="text"
                            placeholder="Search for articles, guides, or assistance..."
                            className="w-full h-18 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-14 py-4 text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-lg"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-navy-400 group-focus-within:text-gold-500 transition-colors" />
                    </div>
                </div>
            </section>

            {/* Support Categories */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((cat, i) => (
                            <div key={i} className="p-8 rounded-3xl border border-light-200 hover:border-gold-500/50 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                                <div className="w-14 h-14 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-black text-navy-900 mb-3">{cat.title}</h3>
                                <p className="text-navy-600 text-sm leading-relaxed mb-6">{cat.desc}</p>
                                <div className="flex items-center gap-2 text-gold-600 font-bold text-xs uppercase tracking-widest">
                                    Browse topics <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Direct Contact */}
            <section className="py-24 bg-light-50">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-[40px] p-12 shadow-2xl border border-light-200 flex flex-col lg:flex-row justify-between items-center gap-12">
                        <div className="max-w-xl text-center lg:text-left">
                            <h2 className="text-4xl font-black text-navy-900 mb-6">Can't find what you're <span className="text-gold-500">looking for?</span></h2>
                            <p className="text-navy-600 text-lg leading-relaxed">
                                Our elite concierge team is available 24/7 to assist you with any inquiries regarding our inventory or services.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 w-full lg:w-auto">
                            <a href="mailto:support@lithiaautos.com" className="flex items-center gap-6 p-6 bg-navy-900 rounded-3xl group">
                                <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center text-navy-900"><Mail className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-navy-300 text-xs font-bold uppercase tracking-widest mb-1">Email us</p>
                                    <p className="text-white font-bold">support@lithiaautos.com</p>
                                </div>
                            </a>
                            <a href="https://wa.me/14642159186" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 bg-white border border-light-200 rounded-3xl hover:border-gold-500 transition-all">
                                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center text-navy-900"><Phone className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-navy-400 text-xs font-bold uppercase tracking-widest mb-1">WhatsApp us</p>
                                    <p className="text-navy-900 font-bold">+1 (464) 215-9186</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
