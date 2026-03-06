'use client';

import React from 'react';
import Image from 'next/image';

const PARTNERS = [
    { name: 'RAM', logo: '/images/PartnerLogos/RAM.jpg' },
    { name: 'Rolls Royce', logo: '/images/PartnerLogos/Rolls Royce.png' },
    { name: 'Volvo', logo: '/images/PartnerLogos/Volvo.png' },
    { name: 'Volkswagen', logo: '/images/PartnerLogos/Volkswagen.png' },
    { name: 'Lexus', logo: '/images/PartnerLogos/Lexus.png' },
    { name: 'Porsche', logo: '/images/PartnerLogos/Porsche.png' },
    { name: 'Ford', logo: '/images/PartnerLogos/Ford_logo.png' },
    { name: 'Toyota', logo: '/images/PartnerLogos/Toyota.png' },
    { name: 'Land Rover', logo: '/images/PartnerLogos/Land_Rover.png' },
    { name: 'Kia', logo: '/images/PartnerLogos/KIA_logo.png' },
    { name: 'Subaru', logo: '/images/PartnerLogos/Subaru_logo.png' },
    { name: 'McLaren', logo: '/images/PartnerLogos/McLaren_logo.png' },
    { name: 'Mini', logo: '/images/PartnerLogos/MINI_logo.png' },
    { name: 'Nissan', logo: '/images/PartnerLogos/Nissan_logo.png' },
    { name: 'Mazda', logo: '/images/PartnerLogos/Mazda_logo.png' },
    { name: 'Maserati', logo: '/images/PartnerLogos/Maserati_logo.png' },
    { name: 'Lincoln', logo: '/images/PartnerLogos/Lincoln_logo.png' },
    { name: 'Jaguar', logo: '/images/PartnerLogos/Jaguar-logo.png' },
    { name: 'Infiniti', logo: '/images/PartnerLogos/Infiniti_logo.png' },
    { name: 'Lamborghini', logo: '/images/PartnerLogos/Lamborghini-Logo.png' },
    { name: 'Jeep', logo: '/images/PartnerLogos/Jeep_logo.png' },
    { name: 'Honda', logo: '/images/PartnerLogos/Honda_Logo.png' },
    { name: 'GMC', logo: '/images/PartnerLogos/GMC-Logo.png' },
    { name: 'Ferrari', logo: '/images/PartnerLogos/Ferrari_wordmark.png' },
    { name: 'FAIT', logo: '/images/PartnerLogos/Fiat_logo.png' },
    { name: 'Genesis', logo: '/images/PartnerLogos/Genesis_logo.png' },
    { name: 'Dodge', logo: '/images/PartnerLogos/Dodge_Logo.png' },
    { name: 'Chrysler', logo: '/images/PartnerLogos/Chrysler_log.png' },
    { name: 'Acura', logo: '/images/PartnerLogos/Acura_logo.png' },
];

export function Partners() {
    return (
        <section className="py-20 bg-white overflow-hidden border-y border-light-200">
            <div className="container mx-auto px-4 mb-12">
                <div className="text-center">
                    <h2 className="text-sm font-black text-gold-500 uppercase tracking-[0.3em] mb-3">Our Trusted</h2>
                    <h3 className="text-3xl font-black text-navy-900">Partners & <span className="text-gold-500">Brands</span></h3>
                </div>
            </div>

            <div className="relative flex overflow-hidden group">
                <div className="flex animate-marquee whitespace-nowrap gap-16 items-center py-4">
                    {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
                        <div key={i} className="flex items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer px-8 shrink-0">
                            <div className="relative h-12 w-32">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                    display: flex;
                    animation: marquee 60s linear infinite;
                    width: max-content;
                    will-change: transform;
                    transform: translateZ(0);
                    -webkit-transform: translateZ(0);
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
                @keyframes marquee {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
            `}</style>
        </section>
    );
}
