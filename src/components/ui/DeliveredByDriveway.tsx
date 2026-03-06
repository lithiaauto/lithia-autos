'use client';

import React from 'react';

interface Delivery {
    _id: string;
    clientName: string;
    location: string;
    image: string;
}

interface DeliveredByDrivewayProps {
    deliveries: Delivery[];
}

export function DeliveredByDriveway({ deliveries }: DeliveredByDrivewayProps) {
    if (!deliveries || deliveries.length === 0) return null;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-4 tracking-tight">
                            Delivered by <span className="text-gold-500">Driveway</span>
                        </h2>
                        <p className="text-navy-600 text-lg max-w-2xl">
                            Real stories from our clients who had their dream cars delivered straight to their doorstep.
                        </p>
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    <div className="flex gap-8 animate-marquee hover:pause w-max whitespace-nowrap py-4">
                        {[...deliveries, ...deliveries, ...deliveries].map((delivery, idx) => (
                            <div
                                key={`${delivery._id}-${idx}`}
                                className="relative flex-shrink-0 w-[300px] md:w-[450px] h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                            >
                                <img
                                    src={delivery.image}
                                    alt={delivery.clientName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                {/* Text Content */}
                                <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                                    <h3 className="text-xl md:text-3xl font-black text-white mb-1 tracking-tight">
                                        {delivery.clientName}
                                    </h3>
                                    <p className="text-gold-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                                        {delivery.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <style jsx>{`
                    .animate-marquee {
                        display: flex;
                        width: max-content;
                        animation: marquee 120s linear infinite;
                        will-change: transform;
                    }
                    .hover\\:pause:hover {
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
            </div>
        </section>
    );
}
