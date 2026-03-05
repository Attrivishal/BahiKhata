import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, User, Building, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', shopName: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-slate-800 bg-slate-50">
            {/* Left section - Form */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
                <Link to="/" className="flex items-center gap-2 mb-10 w-max">
                    <div className="bg-primary p-2 rounded-xl">
                        <Store className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                        ShopPulse
                    </span>
                </Link>

                <div className="max-w-md w-full">
                    <h1 className="text-3xl font-bold mb-2">Create your account 🚀</h1>
                    <p className="text-slate-500 mb-8">Start your 14-day free trial. No credit card required.</p>

                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-3 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    placeholder="John Doe"
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Shop Name</label>
                            <div className="relative">
                                <Building className="absolute left-3.5 top-3 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    placeholder="John's Groceries"
                                    onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    placeholder="you@example.com"
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    placeholder="••••••••"
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 rounded-xl mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    Create Account <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                        <p className="text-xs text-slate-500 text-center mt-3">
                            By creating an account, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </form>

                    <p className="mt-8 text-center text-slate-600">
                        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
                    </p>
                </div>
            </div>

            {/* Right section - Features block */}
            <div className="hidden lg:flex flex-1 bg-slate-900 p-12 text-white justify-center items-center relative overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-lg space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Everything you need to grow.</h2>
                        <p className="text-slate-400">Join a community of modern shop owners.</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { title: "Real-time Sales Tracking", desc: "Monitor your revenue streams with actionable insights." },
                            { title: "Smart Inventory Alerts", desc: "Never run out of stock with our automated alert system." },
                            { title: "Expense Management", desc: "Keep your costs in check and calculate true net profit." }
                        ].map((f, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-primary">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg">{f.title}</h3>
                                    <p className="text-slate-400 text-sm mt-1">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
