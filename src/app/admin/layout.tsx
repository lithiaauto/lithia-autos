'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, LayoutDashboard, List, MessageSquare, LogOut, FileText, Tag, ShoppingCart, CreditCard, Menu, X, Users, Truck } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-light-200">

            {/* Mobile Nav Overlay */}
            {isMobileNavOpen && (
                <div className="fixed inset-0 bg-navy-900/50 z-40 md:hidden" onClick={() => setIsMobileNavOpen(false)} />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 text-light-100 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-navy-800">
                    <Link href="/admin" className="flex items-center gap-2">
                        <Car className="h-6 w-6 text-gold-500" />
                        <span className="font-bold text-lg tracking-tight text-light-50">
                            LITHIA <span className="text-gold-500">ADMIN</span>
                        </span>
                    </Link>
                    <button className="md:hidden text-white" onClick={() => setIsMobileNavOpen(false)}>
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link
                        href="/admin"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-navy-200 hover:text-light-50 hover:bg-navy-800 transition-colors"
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/inventory"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-navy-200 hover:text-light-50 hover:bg-navy-800 transition-colors"
                    >
                        <List className="h-5 w-5" />
                        Inventory & Specs
                    </Link>
                    <Link
                        href="/admin/testimonials"
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${pathname === '/admin/testimonials' ? 'text-gold-400 bg-navy-800' : 'text-navy-200 hover:text-light-50 hover:bg-navy-800'}`}
                    >
                        <MessageSquare className="h-5 w-5" />
                        Testimonials
                    </Link>

                    <Link
                        href="/admin/blog"
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${pathname === '/admin/blog' ? 'text-gold-400 bg-navy-800' : 'text-navy-200 hover:text-light-50 hover:bg-navy-800'}`}
                    >
                        <FileText className="h-5 w-5" />
                        Blog Posts
                    </Link>
                    <Link
                        href="/admin/orders"
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${pathname?.startsWith('/admin/orders') ? 'text-gold-400 bg-navy-800' : 'text-navy-200 hover:text-light-50 hover:bg-navy-800'}`}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        Orders
                    </Link>
                    <Link
                        href="/admin/payment-methods"
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${pathname === '/admin/payment-methods' ? 'text-gold-400 bg-navy-800' : 'text-navy-200 hover:text-light-50 hover:bg-navy-800'}`}
                    >
                        <CreditCard className="h-5 w-5" />
                        Payment Methods
                    </Link>
                    <Link
                        href="/admin/agents"
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${pathname?.startsWith('/admin/agents') ? 'text-gold-400 bg-navy-800' : 'text-navy-200 hover:text-light-50 hover:bg-navy-800'}`}
                    >
                        <Users className="h-5 w-5" />
                        Manage Agents
                    </Link>
                    <Link
                        href="/admin/deliveries"
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${pathname === '/admin/deliveries' ? 'text-gold-400 bg-navy-800' : 'text-navy-200 hover:text-light-50 hover:bg-navy-800'}`}
                    >
                        <Truck className="h-5 w-5" />
                        Deliveries Manager
                    </Link>
                    <Link
                        href="/admin/makes"
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${pathname === '/admin/makes' ? 'text-gold-400 bg-navy-800' : 'text-navy-200 hover:text-light-50 hover:bg-navy-800'}`}
                    >
                        <Tag className="h-5 w-5" />
                        Brand Manager
                    </Link>
                </nav>

                <div className="p-4 border-t border-navy-800">
                    <Link
                        href="/"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-navy-300 hover:text-gold-500 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
                <header className="h-16 shrink-0 bg-light-50 border-b border-light-300 flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden" onClick={() => setIsMobileNavOpen(true)}>
                            <Menu className="h-6 w-6 text-navy-800" />
                        </button>
                        <h2 className="text-lg font-semibold text-navy-800 hidden sm:block">Admin Portal</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-navy-600 font-medium">Logged in as Administrator</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-light-100">
                    {children}
                </div>
            </main>

        </div>
    );
}
