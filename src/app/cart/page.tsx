"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, ArrowRight, ChevronLeft, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { cart, removeFromCart, total } = useCart();

    if (cart.length === 0) {
        return (
            <div className="bg-light-100 min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-light-300 text-center max-w-md w-full">
                    <div className="bg-gold-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-gold-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-navy-900 mb-4">Your cart is empty</h2>
                    <p className="text-navy-600 mb-8 leading-relaxed">It looks like you haven't added any dream vehicles to your cart yet.</p>
                    <Link href="/inventory" className="inline-flex items-center justify-center bg-navy-900 text-gold-400 font-bold py-4 px-8 rounded-xl hover:bg-gold-500 hover:text-navy-900 transition-all w-full">
                        Browse Inventory <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light-100 min-h-screen py-12 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                    <div>
                        <Link href="/inventory" className="inline-flex items-center text-navy-600 hover:text-navy-900 font-bold text-sm mb-2 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" /> Continue Shopping
                        </Link>
                        <h1 className="text-4xl font-bold text-navy-900 tracking-tight">Shopping Cart</h1>
                    </div>
                    <div className="bg-white border border-light-300 px-6 py-3 rounded-2xl flex items-center shadow-sm">
                        <span className="text-navy-600 font-medium mr-3">Total Items:</span>
                        <span className="text-navy-900 font-bold text-xl">{cart.length}</span>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8">

                    {/* Items List */}
                    <div className="w-full xl:w-[65%] space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl p-6 border border-light-300 shadow-sm flex flex-col md:flex-row gap-6 hover:border-gold-400 transition-all group">
                                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                                    <Link href={`/inventory/${item.id}`}>
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </Link>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-gold-500 text-[11px] font-bold tracking-widest uppercase mb-1">{item.type} • {item.year}</div>
                                            <Link href={`/inventory/${item.id}`}>
                                                <h3 className="text-xl font-bold text-navy-900 hover:text-gold-500 transition-colors uppercase">{item.title}</h3>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-navy-300 hover:text-red-500 transition-colors p-2"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-end justify-between mt-4">
                                        <div className="space-y-1">
                                            <span className="text-[13px] text-navy-400 block">Single Unit Price</span>
                                            <span className="text-2xl font-bold text-navy-900">{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="w-full xl:w-[35%]">
                        <div className="bg-white rounded-3xl border border-navy-900 p-8 shadow-xl sticky top-28">
                            <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
                                <CreditCard className="w-6 h-6 mr-3 text-gold-500" /> Order Summary
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-navy-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-navy-600 font-medium">
                                    <span>Tax (Included)</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-navy-600 font-medium pb-4 border-b border-light-200">
                                    <span>Shipping / Handling</span>
                                    <span className="text-green-600 font-bold uppercase text-[12px] flex items-center">Free</span>
                                </div>
                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-navy-900 font-bold">Total Amount</span>
                                    <span className="text-3xl font-bold text-navy-900 tracking-tight">${total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block">
                                <button className="w-full bg-navy-900 text-gold-400 hover:bg-gold-500 hover:text-navy-900 py-5 rounded-2xl font-bold text-[16px] transition-all flex items-center justify-center group">
                                    Checkout Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <div className="mt-6 flex items-center justify-center gap-6 opacity-40 grayscale">
                                <img src="/images/SecurePaymentProviders/Adyen_Corporate_Logo.png" alt="Adyen" className="h-5 object-contain" />
                                <img src="/images/SecurePaymentProviders/Worldpay_logo.png" alt="Worldpay" className="h-4 object-contain" />
                                <img src="/images/SecurePaymentProviders/Cloudflare-logo.png" alt="Cloudflare" className="h-5 object-contain" />
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
