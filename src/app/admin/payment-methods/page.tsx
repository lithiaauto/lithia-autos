'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function AdminPaymentMethodsPage() {
    const { showToast } = useToast();
    const [methods, setMethods] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingMethod, setEditingMethod] = useState<any>(null);

    const [form, setForm] = useState({
        label: '',
        description: '',
        instructions: '',
        isActive: true
    });

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        try {
            const res = await fetch('/api/admin/payment-methods');
            const data = await res.json();
            if (Array.isArray(data)) setMethods(data);
        } catch (e) {
            showToast('Failed to load payment methods', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (m?: any) => {
        if (m) {
            setEditingMethod(m);
            setForm({
                label: m.label,
                description: m.description,
                instructions: m.instructions || '',
                isActive: m.isActive
            });
        } else {
            setEditingMethod(null);
            setForm({
                label: '',
                description: '',
                instructions: '',
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this payment method?')) return;
        try {
            const res = await fetch(`/api/admin/payment-methods/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Payment method deleted', 'success');
                setMethods(prev => prev.filter(m => m._id !== id));
            }
        } catch (e) {
            showToast('Delete failed', 'error');
        }
    };

    const handleToggleActive = async (m: any) => {
        try {
            const res = await fetch(`/api/admin/payment-methods/${m._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !m.isActive })
            });
            if (res.ok) {
                showToast(`Method ${!m.isActive ? 'activated' : 'deactivated'}`, 'success');
                fetchMethods();
            }
        } catch (e) {
            showToast('Update failed', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingMethod ? `/api/admin/payment-methods/${editingMethod._id}` : '/api/admin/payment-methods';
            const method = editingMethod ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                showToast(editingMethod ? 'Payment method updated' : 'Payment method created', 'success');
                setShowModal(false);
                fetchMethods();
            } else {
                const err = await res.json();
                showToast(err.error || 'Failed to save configuration', 'error');
            }
        } catch (e) {
            showToast('Save failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Payment Methods</h1>
                    <p className="text-navy-600 mt-1">Configure available payment options for checkout.</p>
                </div>
                <Button onClick={() => handleOpenModal()} variant="primary" className="flex mt-4 md:mt-0 items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Method
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-light-50 border-b border-light-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider">Method Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-light-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-navy-400">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gold-500" />
                                            Loading methods...
                                        </td>
                                    </tr>
                                ) : methods.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-navy-400">
                                            No payment methods configured. Click "Add Method" to begin.
                                        </td>
                                    </tr>
                                ) : (
                                    methods.map((method) => (
                                        <tr key={method._id} className="hover:bg-light-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-navy-900">{method.label}</div>
                                                <div className="text-sm text-navy-600">{method.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleActive(method)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${method.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                                >
                                                    {method.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    {method.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleOpenModal(method)} className="p-2 text-navy-400 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition-colors">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(method._id)} className="p-2 text-navy-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Editor Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-light-200 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-navy-900">{editingMethod ? 'Edit' : 'Add'} Payment Method</h2>
                            <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-navy-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Label (Public)</label>
                                <input type="text" className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg focus:border-gold-500 outline-none" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Bank Transfer" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Short Description (Checkout Tagline)</label>
                                <input type="text" className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg focus:border-gold-500 outline-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Secure Wire Transfer" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-navy-600 uppercase">Detailed Instructions (After Selection)</label>
                                <textarea className="w-full bg-light-50 border border-light-300 p-2.5 text-sm rounded-lg focus:border-gold-500 outline-none" rows={3} value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} placeholder="e.g. Details for wire transfer will be provided in your confirmation email." />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer pt-2">
                                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-gold-500 focus:ring-gold-500 border-light-300 rounded" />
                                <span className="text-sm font-bold text-navy-700">Method is Active</span>
                            </label>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mx-auto" /> : 'Save Method'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
