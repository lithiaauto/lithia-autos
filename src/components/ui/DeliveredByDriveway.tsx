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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {deliveries.map((delivery) => (
                        <div
                            key={delivery._id}
                            className="relative h-[400px] rounded-3xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                        >
                            <img
                                src={delivery.image}
                                alt={delivery.clientName}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            {/* Text Content */}
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <h3 className="text-2xl font-black text-white mb-1 tracking-tight">
                                    {delivery.clientName}
                                </h3>
                                <p className="text-gold-400 font-bold uppercase tracking-widest text-xs">
                                    {delivery.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
