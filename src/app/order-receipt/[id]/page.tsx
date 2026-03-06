'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { Partners } from '@/components/ui/Partners';
import { useToast } from '@/components/ui/Toast';

export default function OrderReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // To fetch an order safely, you might create an API route like /api/order/track/[orderId] or pass via localStorage/state. 
                // We'll hit track endpoint:
                const res = await fetch(`/api/order/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                } else {
                    showToast('Failed to load order receipt', 'error');
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id, showToast]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-100">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-100 px-4">
                <div className="bg-white p-12 text-center rounded-3xl shadow-xl max-w-lg">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-3xl font-black">!</div>
                    <h1 className="text-3xl font-black text-navy-900 mb-4 tracking-tight">Order Not Found</h1>
                    <p className="text-navy-600 mb-8 font-medium">We couldn't locate an order with that ID. Please check your tracking number or contact support.</p>
                    <Link href="/" className="bg-navy-900 text-white font-bold py-4 px-8 rounded-full hover:bg-gold-500 transition-colors inline-block">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light-100 min-h-screen py-20 font-sans">
            <div className="container mx-auto px-4 max-w-3xl">

                {/* Status Hero */}
                <div className="bg-white rounded-t-3xl p-10 md:p-16 text-center border-b-[8px] border-gold-500 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-400 to-gold-600"></div>
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg relative z-10">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-navy-900 mb-4 tracking-tight">Order Confirmed</h1>
                    <p className="text-lg text-navy-600 font-medium max-w-lg mx-auto leading-relaxed">
                        Thank you for your purchase, {order.firstName}. Your order has been successfully placed and is currently being processed by our team.
                    </p>
                </div>

                {/* Receipt Details */}
                <div className="bg-white rounded-b-3xl shadow-lg border border-light-200 border-t-0 p-10 md:p-16 space-y-12">

                    {/* Identifier Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-navy-50 rounded-2xl p-6 border border-navy-100">
                            <span className="text-xs font-black text-navy-400 uppercase tracking-widest block mb-2">Order Identification</span>
                            <span className="text-xl font-bold text-navy-900 font-mono tracking-wider">{order.orderId}</span>
                        </div>
                        <div className="bg-navy-50 rounded-2xl p-6 border border-navy-100">
                            <span className="text-xs font-black text-navy-400 uppercase tracking-widest block mb-2">Transaction Date</span>
                            <span className="text-xl font-bold text-navy-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gold-500" />
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="border-t border-light-200 pt-12">
                        <h3 className="text-xl font-black text-navy-900 mb-8 flex items-center">
                            <Package className="w-6 h-6 mr-3 text-gold-500" /> What happens next?
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-500 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                <div>
                                    <h4 className="font-bold text-navy-900">Email Confirmation</h4>
                                    <p className="text-sm text-navy-600 mt-1">A detailed receipt has been sent to <span className="text-gold-600 font-medium">{order.email}</span>.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-light-200 text-navy-400 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                <div>
                                    <h4 className="font-bold text-navy-900">Processing & Assignment</h4>
                                    <p className="text-sm text-navy-600 mt-1">Our concierges are reviewing your requested vehicles and preparing the documentation.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-light-200 text-navy-400 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                                <div>
                                    <h4 className="font-bold text-navy-900">White-Glove Delivery</h4>
                                    <p className="text-sm text-navy-600 mt-1">Once processed, you will receive tracking alerts as your vehicle is dispatched to your location.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-light-200 pt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`/track-order?id=${order.orderId}`} className="flex-1 bg-navy-900 text-white text-center font-bold py-4 px-8 rounded-xl hover:bg-gold-500 transition-colors flex items-center justify-center group">
                            <Truck className="w-5 h-5 mr-2" /> Track Status
                        </Link>
                        <Link href="/inventory" className="flex-1 bg-white border-2 border-light-200 text-center text-navy-900 font-bold py-4 px-8 rounded-xl hover:border-navy-900 transition-colors flex items-center justify-center group">
                            Continue Browsing <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                </div>
            </div>

            <div className="mt-20">
                <Partners />
            </div>
        </div>
    );
}
