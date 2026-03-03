'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';

export function HomeAboutSection() {
    return (
        <section className="py-24 bg-navy-900 text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative">
                        <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 aspect-[4/5] md:aspect-square">
                            <img
                                src="/images/evans-halshaw-vauxhall-leeds-interior.jpg"
                                alt="Who We Are - Lithia Autos"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-navy-500/20 rounded-full blur-3xl" />
                    </div>

                    {/* Content Side */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-gold-500 font-black uppercase tracking-[0.2em] text-sm mb-4">Who We Are</h2>
                            <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
                                Delivering Excellence <br />
                                Since 1946
                            </h3>
                            <p className="text-navy-100 text-lg leading-relaxed opacity-90">
                                As one of the world&apos;s leading automotive retailers, Lithia Autos serves hundreds of thousands of customers across our global network. We are committed to transforming automotive retail through digital innovation and operational excellence.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <Globe className="w-8 h-8 text-gold-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Global Reach</h4>
                                    <p className="text-sm text-navy-200">Over 400 stores across North America and the UK.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <Zap className="w-8 h-8 text-gold-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Innovation</h4>
                                    <p className="text-sm text-navy-200">Leading the digital shift in automotive retail.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-black px-8 py-4 rounded-2xl transition-all group"
                            >
                                Learn Our Full Story
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
