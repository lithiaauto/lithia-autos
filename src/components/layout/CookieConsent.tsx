'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already given consent
        const consent = localStorage.getItem('lithia_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('lithia_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const rejectCookies = () => {
        localStorage.setItem('lithia_cookie_consent', 'rejected');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 sm:bottom-6 sm:left-6 sm:w-[400px] sm:p-0">
            <div className="bg-white border border-light-300 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-5 fade-in duration-500">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-navy-900">We respect your privacy</h3>
                </div>

                <p className="text-sm text-navy-600 mb-6 leading-relaxed">
                    We use cookies to operate this website, improve usability, personalize your experience, and improve our marketing. Your privacy is important to us, and we will never sell your data.{' '}
                    <Link href="/privacy" className="text-gold-500 font-bold hover:underline">
                        Privacy Policy
                    </Link>
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={acceptCookies}
                        className="w-full bg-navy-900 hover:bg-gold-500 text-white hover:text-navy-900 font-bold py-3 px-4 rounded-xl transition-colors"
                    >
                        Accept Cookies
                    </button>
                    <button
                        onClick={rejectCookies}
                        className="w-full bg-white border-2 border-light-200 hover:border-navy-900 text-navy-600 hover:text-navy-900 font-bold py-3 px-4 rounded-xl transition-colors"
                    >
                        Reject All
                    </button>
                </div>
            </div>
        </div>
    );
}
