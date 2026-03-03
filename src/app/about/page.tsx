'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, Award, ShieldCheck, Zap, Globe, Clock, Target, Rocket } from 'lucide-react';
import { Partners } from '@/components/ui/Partners';
import { LocationsMarquee } from '@/components/ui/LocationsMarquee';
import { LiveMap } from '@/components/ui/LiveMap';

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-navy-900">
                    <img
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000"
                        alt="Porsche 70 Showroom"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
                        Who <span className="text-gold-500">We Are</span>
                    </h1>
                    <p className="text-navy-100 text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
                        As one of the world&apos;s leading automotive retailers, with over 5,000 Associates nationwide, we serve hundreds of thousands of customers online and across our dealerships every year.
                    </p>
                </div>
            </section>

            {/* About Lithia UK Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-gold-500 font-black uppercase tracking-[0.2em] text-sm mb-4">About Lithia UK</h2>
                                <h3 className="text-4xl font-black text-navy-900 mb-6 leading-tight">Innovation is at the heart of our business.</h3>
                                <p className="text-gray-600 md:text-lg text-base leading-relaxed">
                                    Lithia has a long-standing history as one of the largest automotive retail brands in the US but has now grown even bigger by representing brands across the United Kingdom under the name Lithia UK.
                                </p>
                            </div>
                            <div className="space-y-4 text-gray-600">
                                <p>We remain committed to transforming automotive retail through digital innovation and operational excellence.</p>
                                <p>We operate over 160 sites across the UK under the brands of Evans Halshaw and Stratstone, offering new and used vehicles as well as providing expert aftercare services.</p>
                                <p>We also provide leasing through Driveway Vehicle Solutions and wholesale vehicle parts via Quickco.</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="rounded-[40px] overflow-hidden shadow-2xl aspect-[4/3]">
                                <img
                                    src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=1200"
                                    alt="Lithia UK Operations"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Business Pillars */}
            <section className="py-24 bg-navy-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 px-4">
                        <h2 className="text-gold-500 font-black uppercase tracking-[0.2em] text-sm mb-4">Our Business</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-navy-900 mb-6 font-black leading-tight">Leading change in automotive retail.</h3>
                        <p className="text-navy-600 text-lg max-w-3xl mx-auto">
                            Our business operates under three key pillars: Franchised UK Motor, Hybrid Used Cars, and Leasing.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Franchised UK Motor',
                                desc: 'Our Evans Halshaw and Stratstone brands focus on the sale and aftersales of new cars and commercial vehicles.',
                                icon: <Award className="w-8 h-8 text-gold-500" />,
                                image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'
                            },
                            {
                                title: 'Hybrid Used Cars',
                                desc: 'Transforming the car buying experience through digital innovation, enabling online purchase and home delivery.',
                                icon: <Zap className="w-8 h-8 text-gold-500" />,
                                image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
                            },
                            {
                                title: 'Leasing',
                                desc: 'Driveway Vehicle Solutions provides comprehensive fleet management and leasing solutions to businesses.',
                                icon: <Clock className="w-8 h-8 text-gold-500" />,
                                image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
                            }
                        ].map((pillar, i) => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-light-200 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="h-48 overflow-hidden">
                                    <img src={pillar.image} alt={pillar.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="p-8">
                                    <div className="mb-4">{pillar.icon}</div>
                                    <h4 className="text-xl font-black text-navy-900 mb-4">{pillar.title}</h4>
                                    <p className="text-navy-600 text-sm leading-relaxed">{pillar.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Brands Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="rounded-[40px] overflow-hidden shadow-2xl aspect-[4/3]">
                                <img
                                    src="/images/evans-halshaw-vauxhall-leeds-interior.jpg"
                                    alt="Evans Halshaw Vauxhall Leeds Showroom"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div>
                                <h2 className="text-gold-500 font-black uppercase tracking-[0.2em] text-sm mb-4">Our Brands</h2>
                                <h3 className="text-4xl font-black text-navy-900 mb-6 leading-tight">A strong geographic footprint.</h3>
                                <p className="text-gray-600 md:text-lg text-base leading-relaxed">
                                    Since our inception in 1946, our group has remained focused on acquiring and developing some of the industry&apos;s most well-known brands and retail sites.
                                </p>
                            </div>
                            <p className="text-gray-600 md:text-lg text-base">
                                This allows customers to be within easy reach of great customer service through one of our local retailers or via our digital channels. Our brands include Evans Halshaw, Stratstone, Quickco and Driveway Vehicle Solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our History / Story Timeline */}
            <section className="py-24 bg-navy-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20 px-4">
                        <h2 className="text-gold-500 font-black uppercase tracking-[0.2em] text-sm mb-4">Our History</h2>
                        <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">What&apos;s Our Story?</h3>
                        <p className="text-navy-200 text-lg max-w-3xl mx-auto opacity-80">
                            Established on 1st February 2024, Lithia UK combines over 80 years of automotive retail experience across the United Kingdom.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {[
                            { year: '1946', title: 'The Beginning', desc: 'As part of the Lithia & Driveway family, our story began with the opening of a Chrysler-Plymouth-Dodge store in Ashland, Oregon.' },
                            { year: '1996', title: 'Going Public', desc: 'Fifty years later, our store network began to grow, and Lithia & Driveway went public launching NYSE: LAD' },
                            { year: 'Today', title: 'Global Leader', desc: 'We are recognised as one of the largest global automotive retail groups, listed on the Fortune 500, with representation of over 50 brands across 400 stores.' }
                        ].map((milestone, i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-8 items-start relative pb-12 last:pb-0">
                                {i !== 2 && <div className="hidden md:block absolute left-[3.5rem] top-16 bottom-0 w-0.5 bg-gold-500/20" />}
                                <div className="bg-navy-800 border border-gold-500/20 text-white font-black md:text-2xl text-xl w-28 h-28 shrink-0 rounded-3xl flex items-center justify-center shadow-lg">
                                    {milestone.year}
                                </div>
                                <div className="pt-4">
                                    <h4 className="md:text-2xl text-xl font-black mb-3 text-white">{milestone.title}</h4>
                                    <p className="text-navy-200 md:text-lg text-base leading-relaxed opacity-80">{milestone.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Strategy */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="w-full lg:w-1/2 space-y-10">
                            <div>
                                <h2 className="text-gold-500 font-black uppercase tracking-[0.2em] text-sm mb-4">Our Strategy</h2>
                                <h3 className="text-4xl font-black text-navy-900 mb-6 leading-tight">Transforming automotive retail.</h3>
                                <p className="text-gray-600 md:text-lg text-base leading-relaxed mb-6">
                                    All of the businesses across Lithia UK are united in realising our vision to transform automotive retail through digital innovation and operational excellence.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-gold-500/10 p-3 rounded-xl h-fit">
                                        <Target className="w-6 h-6 text-gold-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy-900 mb-1">Unlock Value</h4>
                                        <p className="text-navy-600 text-sm">Accelerating digital innovation and driving operational excellence across franchised UK motor.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-gold-500/10 p-3 rounded-xl h-fit">
                                        <Rocket className="w-6 h-6 text-gold-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy-900 mb-1">Disrupt Used Sales</h4>
                                        <p className="text-navy-600 text-sm">Differentiating the customer experience and scaling the number of sites for hybrid used car sales.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
                                        <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600" alt="Strategy 1" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-gold-500 rounded-3xl p-8 flex flex-col justify-end aspect-square">
                                        <h4 className="font-black text-navy-900 text-2xl leading-tight">Growth Powered by People.</h4>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-12">
                                    <div className="bg-navy-900 rounded-3xl p-8 flex flex-col aspect-square">
                                        <h4 className="font-black text-white text-3xl mb-4">160+</h4>
                                        <p className="text-navy-200 text-sm">Expert sites nationwide.</p>
                                    </div>
                                    <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
                                        <img src="/images/strategy2.jpg" alt="Strategy 2" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Partners />

            <div className="py-20 bg-light-50">
                <LiveMap />
            </div>

            <div className="py-20">
                <LocationsMarquee />
            </div>
        </div>
    );
}
