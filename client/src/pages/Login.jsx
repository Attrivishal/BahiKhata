// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Store, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff,
    Shield, CheckCircle2, TrendingUp, Users, Zap
} from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        // Check for saved email
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', formData);
            
            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', data.user.name);
            localStorage.setItem('shopName', data.user.shopName);
            localStorage.setItem('userId', data.user.id);
            
            // Handle remember me
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: TrendingUp, text: 'Real-time sales tracking' },
        { icon: Users, text: 'Multi-user access' },
        { icon: Zap, text: 'Instant insights' },
        { icon: Shield, text: 'Bank-level security' }
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-secondary-50 to-white">
            {/* Left section - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 xl:px-24 py-12">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                        <div className="bg-gradient-to-br from-primary-600 to-primary-500 p-2.5 rounded-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                            <Store className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                ShopPulse
                            </span>
                            <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 text-xs font-medium rounded-full">
                                Business
                            </span>
                        </div>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-2">
                            Welcome Back! 👋
                        </h1>
                        <p className="text-secondary-600">
                            Access your dashboard to manage your shop's operations seamlessly.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Lock size={16} className="text-red-600" />
                            </div>
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Mail size={18} className="text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="you@example.com"
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-secondary-700">
                                    Password
                                </label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Lock size={18} className="text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    className="w-full pl-10 pr-12 py-3 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="••••••••"
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-secondary-600">Remember me</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-secondary-600">
                            Don't have an account?{' '}
                            <Link 
                                to="/register" 
                                className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors"
                            >
                                Get started for free
                            </Link>
                        </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 pt-8 border-t border-secondary-200">
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <div className="flex items-center gap-2 text-sm text-secondary-500">
                                <CheckCircle2 size={16} className="text-green-500" />
                                <span>SSL Secure</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-secondary-500">
                                <CheckCircle2 size={16} className="text-green-500" />
                                <span>GDPR Compliant</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-secondary-500">
                                <CheckCircle2 size={16} className="text-green-500" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right section - Hero/Features */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-600 p-12 text-white justify-center items-center relative overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    {/* Main Card */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl mb-8">
                        <h2 className="text-3xl font-bold mb-4 leading-tight">
                            Manage your store smarter, not harder.
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            Join thousands of small business owners using ShopPulse to track sales, monitor inventory, and grow their profits.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Icon size={16} className="text-white" />
                                        </div>
                                        <span className="text-white/90">{feature.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* User Stats */}
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div 
                                    key={i} 
                                    className="w-10 h-10 rounded-full border-2 border-white/50 bg-gradient-to-br from-primary-300 to-primary-400 flex items-center justify-center text-xs font-bold text-white shadow-lg"
                                    style={{ 
                                        backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                                        backgroundSize: 'cover' 
                                    }}
                                ></div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white">
                                +2k
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">2,000+</p>
                            <p className="text-sm text-white/70">active businesses</p>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                        <p className="text-white/90 text-sm italic">
                            "ShopPulse has transformed how I run my grocery store. The insights are invaluable and the interface is a joy to use."
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-bold">
                                SJ
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Riya Verma</p>
                                <p className="text-xs text-white/60">Green Grocers, Owner</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;