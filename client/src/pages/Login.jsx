import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', data.user.name);
            localStorage.setItem('shopName', data.user.shopName);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-slate-800 bg-slate-50">
            {/* Left section - Form */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
                <Link to="/" className="flex items-center gap-2 mb-12">
                    <div className="bg-primary p-2 rounded-xl">
                        <Store className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                        ShopPulse
                    </span>
                </Link>

                <div className="max-w-md w-full">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
                    <p className="text-slate-500 mb-8">Access your dashboard to manage your shop's operations seamlessly.</p>

                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            <label className="block text-sm font-medium mb-1.5 flex justify-between">
                                Password
                                <Link to="#" className="text-primary text-xs hover:underline">Forgot password?</Link>
                            </label>
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
                            className="w-full btn-primary py-3 rounded-xl mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    Sign In to Dashboard <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-600">
                        Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Get started for free</Link>
                    </p>
                </div>
            </div>

            {/* Right section - Image/Hero block */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white justify-center items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full filter blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 max-w-lg">
                    <div className="glass-panel bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl">
                        <h2 className="text-3xl font-bold mb-4 leading-tight">Manage your store smarter, not harder.</h2>
                        <p className="text-blue-100 text-lg mb-8">Join thousands of small business owners using ShopPulse to track sales, monitor inventory, and grow their profits.</p>

                        <div className="flex -space-x-4 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-12 h-12 rounded-full border-2 border-indigo-800 bg-slate-300 flex items-center justify-center font-bold text-slate-700`} style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`, backgroundSize: 'cover' }}></div>
                            ))}
                            <div className="w-12 h-12 rounded-full border-2 border-indigo-800 bg-white/20 flex items-center justify-center font-bold text-sm">+2k</div>
                        </div>
                        <p className="text-sm font-medium text-blue-200">Trusted by 2,000+ local shops nationwide</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
