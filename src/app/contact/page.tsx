'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { LocationsMarquee } from '@/components/ui/LocationsMarquee';
import { LiveMap } from '@/components/ui/LiveMap';

export default function ContactPage() {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showToast('Message sent successfully! We will get back to you soon.', 'success');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    subject: 'General Inquiry',
                    message: ''
                });
            } else {
                showToast('Failed to send message. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('An error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4 tracking-tight">Contact <span className="text-gold-500">Us</span></h1>
                <p className="text-lg text-gray-600">
                    Whether you're looking for your perfect car, or exploring your selling options, we're here to provide assistance at every step.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">

                {/* Contact Information */}
                <div className="w-full lg:w-1/3 space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold text-navy-800 mb-6">Get In Touch</h3>
                        <p className="text-gray-600 mb-6">Our dedicated team of professionals is ready to help you with any inquiries you may have.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-navy-50 p-4 rounded-xl flex items-center justify-center text-navy-600 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900">Showroom Location</h4>
                                <p className="text-gray-600 mt-1">8200 S Harlem Ave<br />Bridgeview, IL 60455</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-navy-50 p-4 rounded-xl flex items-center justify-center text-navy-600 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900">Phone</h4>
                                <p className="text-gray-600 mt-1"><a href="tel:7084192546" className="hover:text-gold-500 transition-colors">(708) 419-2546</a></p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-navy-50 p-4 rounded-xl flex items-center justify-center text-navy-600 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900">Email Address</h4>
                                <p className="text-gray-600 mt-1"><a href="mailto:support@lithiaautos.com" className="hover:text-gold-500 transition-colors">support@lithiaautos.com</a></p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-light-300">
                        <h4 className="font-bold text-navy-900 mb-4">Business Hours</h4>
                        <div className="space-y-2 text-sm text-navy-600">
                            <div className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 8:00 PM</span></div>
                            <div className="flex justify-between"><span>Saturday:</span> <span>9:00 AM - 6:00 PM</span></div>
                            <div className="flex justify-between"><span>Sunday:</span> <span>Closed</span></div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="w-full lg:w-2/3">
                    <Card className="shadow-none border-light-300">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-bold text-navy-800 mb-6">Send us a Message</h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-navy-800">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full bg-light-50 border border-light-300 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-navy-800">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full bg-light-50 border border-light-300 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-navy-800">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-light-50 border border-light-300 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-navy-800">Phone (Optional)</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-light-50 border border-light-300 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-navy-800">Subject</label>
                                    <div className="relative">
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full bg-light-50 border border-light-300 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option>General Inquiry</option>
                                            <option>Sales: Interested in a Vehicle</option>
                                            <option>Selling/Trading a Vehicle</option>
                                            <option>Service/Support</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-light-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full bg-light-50 border border-light-300 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all resize-none"
                                        placeholder="How can we help you today?"
                                        required
                                    ></textarea>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full md:w-auto px-10 rounded-xl"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                                        </span>
                                    ) : 'Send Message'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>

            <div className="mt-20">
                <LiveMap />
            </div>

            <div className="mt-20 -mx-4 sm:-mx-6 lg:-mx-8">
                <LocationsMarquee />
            </div>

        </div>
    );
}
