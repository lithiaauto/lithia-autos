"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, ShieldCheck, CreditCard,
    Truck, MapPin, User, Mail, Phone,
    Lock, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
    const { cart, total, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        paymentMethod: ''
    });

    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

    React.useEffect(() => {
        if (cart.length === 0 && !isSuccess) {
            router.push('/cart');
        } else if (cart.length > 0) {
            fetch('/api/payment-methods')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        setPaymentMethods(data);
                        setFormData(prev => ({ ...prev, paymentMethod: data[0]._id }));
                    }
                })
                .catch(console.error);
        }
    }, [cart, router]);

    if (cart.length === 0 && !isSuccess) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    paymentMethodLabel: paymentMethods.find(m => m._id === formData.paymentMethod)?.label || formData.paymentMethod,
                    cart,
                    total,
                    orderId
                }),
            });

            if (response.ok) {
                // In a real app, we'd save to DB here
                setIsSuccess(true);
                clearCart();
                setIsProcessing(false);
                router.push(`/order-receipt/${orderId}`);
            } else {
                console.error('Failed to process order email');
                // We still proceed to success page in this demo if the API fails but simulate a DB success
                // Actually, let's show an error if it fails
                setIsProcessing(false);
                alert('There was an error processing your order. Please try again.');
            }
        } catch (error) {
            console.error('Error in checkout:', error);
            setIsProcessing(false);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-light-100 min-h-screen py-12 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-10">
                    <Link href="/cart" className="inline-flex items-center text-navy-600 hover:text-navy-900 font-bold text-sm mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Cart
                    </Link>
                    <h1 className="text-4xl font-bold text-navy-900 tracking-tight">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Checkout Form */}
                    <div className="w-full lg:w-[65%] space-y-8">

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Contact Information */}
                            <div className="bg-white rounded-lg md:rounded-3xl p-4 md:p-8 border border-light-300 shadow-sm">
                                <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center">
                                    <User className="w-5 h-5 mr-3 text-gold-500" /> Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-navy-700 ml-1">First Name</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="John"
                                                className="w-full bg-light-50 border border-light-300 rounded-2xl py-3.5 px-4 pl-11 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-light-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-navy-700 ml-1">Last Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Doe"
                                            className="w-full bg-light-50 border border-light-300 rounded-2xl py-3.5 px-4 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-navy-700 ml-1">Email Address</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                                className="w-full bg-light-50 border border-light-300 rounded-2xl py-3.5 px-4 pl-11 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                            />
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-light-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-navy-700 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full bg-light-50 border border-light-300 rounded-2xl py-3.5 px-4 pl-11 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                            />
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-light-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery/Billing Address */}
                            <div className="bg-white rounded-lg md:rounded-3xl p-4 md:p-8 border border-light-300 shadow-sm">
                                <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center">
                                    <MapPin className="w-5 h-5 mr-3 text-gold-500" /> Delivery Address
                                </h2>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-navy-700 ml-1">Street Address</label>
                                        <input
                                            required
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="123 Luxury Lane"
                                            className="w-full bg-light-50 border border-light-300 rounded-2xl py-3.5 px-4 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-navy-700 ml-1">City</label>
                                            <input
                                                required
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="Beverly Hills"
                                                className="w-full bg-light-50 border border-light-300 rounded-2xl py-3.5 px-4 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-navy-700 ml-1">State / Province</label>
                                            <input
                                                required
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="California"
                                                className="w-full bg-light-50 border border-light-300 rounded-2xl py-3.5 px-4 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 mt-6">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-navy-700 ml-1">Zip / Postal Code</label>
                                            <input
                                                required
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="90210"
                                                className="w-full bg-light-50 border border-light-300 rounded-2xl py-3.5 px-4 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-navy-700 ml-1">Country</label>
                                            <select
                                                required
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className="w-full bg-light-50 border border-light-300 rounded-2xl py-3.5 px-4 text-navy-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-500"
                                            >
                                                <option value="United States">United States</option>
                                                <option value="Canada">Canada</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Australia">Australia</option>
                                                <option value="United Arab Emirates">United Arab Emirates</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg md:rounded-3xl p-4 md:p-8 border border-light-300 shadow-sm">
                                <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-3 text-gold-500" /> Payment Method
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paymentMethods.length > 0 ? paymentMethods.map((method: any) => (
                                        <label
                                            key={method._id}
                                            className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === method._id
                                                ? 'border-gold-500 bg-gold-50/10'
                                                : 'border-light-200 hover:border-gold-300 bg-white'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method._id}
                                                checked={formData.paymentMethod === method._id}
                                                onChange={handleInputChange}
                                                className="hidden"
                                            />
                                            <div className="flex-1">
                                                <div className="font-bold text-navy-900">{method.label}</div>
                                                <div className="text-[12px] text-navy-600">{method.description}</div>
                                            </div>
                                            {formData.paymentMethod === method._id && (
                                                <CheckCircle2 className="w-5 h-5 text-gold-600" />
                                            )}
                                        </label>
                                    )) : (
                                        <div className="text-sm text-navy-600 py-4 col-span-2 text-center border overflow-hidden border-dashed border-light-300 rounded-lg">
                                            Loading available payment options...
                                        </div>
                                    )}
                                </div>

                                {/* Instructions Box for selected method */}
                                <div className="mt-6 bg-light-50 border border-light-200 rounded-2xl p-6 text-[15px] text-navy-600 leading-relaxed font-medium">
                                    {paymentMethods.find(m => m._id === formData.paymentMethod)?.instructions || "Select a payment method above to proceed."}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-navy-900 text-gold-400 hover:bg-gold-500 hover:text-navy-900 py-6 rounded-2xl font-bold text-[18px] transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing Order...
                                    </span>
                                ) : (
                                    <>Place Secure Order <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-navy-400 text-sm font-medium">
                                <Lock className="w-4 h-4" /> 256-bit Secure Encrypted Connection
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <aside className="w-full lg:w-[35%]">
                        <div className="bg-white rounded-3xl border border-light-300 p-8 shadow-sm sticky top-28">
                            <h2 className="text-xl font-bold text-navy-900 mb-6 tracking-tight">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cart.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-light-50">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-navy-900 text-[14px] truncate uppercase">{item.title}</div>
                                            <div className="text-[12px] text-navy-600 uppercase">{item.year} • {item.type}</div>
                                        </div>
                                        <div className="font-bold text-navy-900 text-[14px]">{item.price}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-light-200 space-y-3 mb-6">
                                <div className="flex justify-between text-navy-600 font-medium text-sm">
                                    <span>Subtotal</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-navy-600 font-medium text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold uppercase text-[11px]">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-navy-900 font-bold">Total</span>
                                <span className="text-2xl font-bold text-navy-900 tracking-tight">${total.toLocaleString()}</span>
                            </div>

                            <div className="bg-gold-50 p-4 rounded-2xl flex items-start gap-4 mb-6">
                                <ShieldCheck className="w-6 h-6 text-gold-600 shrink-0" />
                                <div className="text-[12px] text-navy-700 leading-relaxed font-medium">
                                    <span className="font-bold block mb-0.5">Buyer Protection In Effect</span>
                                    All personal car sales are backed by our premium 30-day inspection guarantee.
                                </div>
                            </div>

                            <div className="pt-6 border-t border-light-200">
                                <p className="text-[11px] text-center text-navy-400 font-bold uppercase tracking-widest mb-4">Guaranteed Safe Checkout</p>
                                <div className="flex items-center justify-center gap-6 opacity-60 grayscale">
                                    <img src="/images/SecurePaymentProviders/Adyen_Corporate_Logo.png" alt="Adyen" className="h-5 object-contain" />
                                    <img src="/images/SecurePaymentProviders/Worldpay_logo.png" alt="Worldpay" className="h-4 object-contain" />
                                    <img src="/images/SecurePaymentProviders/Cloudflare-logo.png" alt="Cloudflare" className="h-5 object-contain" />
                                </div>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
