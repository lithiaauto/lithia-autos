'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    image: string;
    text: string;
    rating: number;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        id: '1',
        name: 'Arlene McCoy',
        role: 'CEO, Themeist',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
        text: '"My experience with Lithia Autos has exceeded expectations. They efficiently manage vehicles with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively."',
        rating: 5
    },
    {
        id: '2',
        name: 'Wade Warren',
        role: 'Designer',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
        text: '"The level of service and the quality of the cars is unmatched. I found exactly what I was looking for, and the financing process was incredibly smooth. Highly recommended for anyone seeking a premium car buying experience."',
        rating: 5
    },
    {
        id: '3',
        name: 'Jane Cooper',
        role: 'Marketing Lead',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
        text: '"Lithia Autos redefined what car shopping looks like for me. The transparency and the detail provided for each vehicle made me feel confident in my purchase. A truly five-star experience from start to finish."',
        rating: 5
    }
];

interface TestimonialsProps {
    testimonials?: Testimonial[];
    title?: string;
    subtitle?: string;
    bgVariant?: 'white' | 'navy' | 'light';
}

export function Testimonials({
    title = "We love our clients",
    subtitle = "What our premium customers have to say about their experience.",
    bgVariant = 'light'
}: TestimonialsProps) {
    const [list, setList] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch('/api/testimonials');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setList(data.map((t: any) => ({
                            id: t._id,
                            name: t.author,
                            role: t.location || 'Verified Buyer',
                            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.author)}&background=021333&color=fff`,
                            text: t.content,
                            rating: t.rating
                        })));
                    } else {
                        setList(DEFAULT_TESTIMONIALS);
                    }
                }
            } catch (e) {
                setList(DEFAULT_TESTIMONIALS);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const activeTestimonials = list.length > 0 ? list : DEFAULT_TESTIMONIALS;
    // Triple the list for a truly seamless transition if the list is small
    const displayList = [...activeTestimonials, ...activeTestimonials, ...activeTestimonials];

    const bgClasses = {
        white: 'bg-white',
        navy: 'bg-navy-900 text-white',
        light: 'bg-navy-50'
    };

    return (
        <section className={`py-24 overflow-hidden ${bgClasses[bgVariant]}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl md:text-5xl font-black mb-4 ${bgVariant === 'navy' ? 'text-white' : 'text-navy-900'}`}>
                        {title.split(' ').map((word: string, i: number) => (
                            word.toLowerCase() === 'clients' ? <span key={i} className="text-gold-500">{word}</span> : word + ' '
                        ))}
                    </h2>
                    {subtitle && <p className={`${bgVariant === 'navy' ? 'text-navy-200' : 'text-navy-600'} text-lg max-w-2xl mx-auto`}>{subtitle}</p>}
                </div>

                <div className="relative group">
                    <div className="flex animate-marquee hover:pause whitespace-nowrap gap-8 py-4">
                        {displayList.map((t, idx) => (
                            <div
                                key={`${t.id}-${idx}`}
                                className={`inline-block w-[350px] md:w-[450px] whitespace-normal p-8 rounded-3xl shadow-sm border flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 shrink-0 ${bgVariant === 'navy'
                                    ? 'bg-navy-800 border-navy-700'
                                    : 'bg-white border-light-100'
                                    }`}
                            >
                                <div>
                                    <div className={`flex ${bgVariant === 'navy' ? 'text-white' : 'text-navy-900'} gap-1 mb-6`}>
                                        {[...Array(t.rating || 5)].map((_: any, i: number) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <p className={`italic leading-relaxed mb-8 ${bgVariant === 'navy' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {t.text}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-4 pt-6 border-t ${bgVariant === 'navy' ? 'border-navy-700' : 'border-light-100'}`}>
                                    <div className="relative w-8 h-8 md:w-12 md:h-12 shrink-0">
                                        <Image
                                            src={t.image}
                                            alt={t.name}
                                            fill
                                            unoptimized
                                            className="rounded-full object-cover ring-2 ring-gold-500/20"
                                        />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${bgVariant === 'navy' ? 'text-white' : 'text-navy-900'}`}>{t.name}</p>
                                        <p className={`text-xs ${bgVariant === 'navy' ? 'text-navy-400' : 'text-navy-400'}`}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 60s linear infinite;
                    will-change: transform;
                    transform: translateZ(0);
                    -webkit-transform: translateZ(0);
                }
                .hover\:pause:hover {
                    animation-play-state: paused;
                }
                @keyframes marquee {
                    0% {
                        transform: translate3d(0, 0, 0);
                    }
                    100% {
                        transform: translate3d(calc(-100% / 3), 0, 0);
                    }
                }
            `}</style>
        </section>
    );
}


