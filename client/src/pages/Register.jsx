// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Store, Mail, Lock, User, Building, ArrowRight, Loader2, 
    Eye, EyeOff, CheckCircle2, Shield, TrendingUp, Package,
    CreditCard, Zap, Sparkles
} from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        shopName: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        return strength;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setFormData({ ...formData, password: newPassword });
        setPasswordStrength(calculatePasswordStrength(newPassword));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (passwordStrength < 2) {
            setError('Please use a stronger password');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                shopName: formData.shopName
            });
            
            // Show success message and redirect to login
            navigate('/login', { 
                state: { message: 'Registration successful! Please log in.' } 
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: TrendingUp, text: 'Real-time sales tracking' },
        { icon: Package, text: 'Smart inventory alerts' },
        { icon: CreditCard, text: 'Expense management' },
        { icon: Shield, text: 'Bank-level security' }
    ];

    const benefits = [
        '14-day free trial',
        'No credit card required',
        'Cancel anytime',
        '24/7 support'
    ];

    const getStrengthColor = () => {
        switch(passwordStrength) {
            case 0: return 'bg-gray-200';
            case 1: return 'bg-red-500';
            case 2: return 'bg-yellow-500';
            case 3: return 'bg-green-500';
            case 4: return 'bg-emerald-500';
            default: return 'bg-gray-200';
        }
    };

    const getStrengthText = () => {
        switch(passwordStrength) {
            case 0: return 'Enter password';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    };

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
                                Free Trial
                            </span>
                        </div>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-2 flex items-center gap-2">
                            Create your account
                            <Sparkles size={28} className="text-primary-500" />
                        </h1>
                        <p className="text-secondary-600">
                            Start your 14-day free trial. No credit card required.
                        </p>
                    </div>

                    {/* Benefits Strip */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-1.5 text-xs bg-secondary-100 text-secondary-600 px-3 py-1.5 rounded-full">
                                <CheckCircle2 size={12} className="text-green-500" />
                                <span>{benefit}</span>
                            </div>
                        ))}
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

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <User size={18} className="text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="John Doe"
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Shop Name */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Shop Name
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Building size={18} className="text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.shopName}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="John's Groceries"
                                    onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
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

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Password
                            </label>
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
                                    onChange={handlePasswordChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-secondary-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                                style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-secondary-600">
                                            {getStrengthText()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-secondary-500 mt-1">
                                        Use at least 8 characters with uppercase, numbers & symbols
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Lock size={18} className="text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    className="w-full pl-10 pr-12 py-3 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="••••••••"
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            
                            {/* Password Match Indicator */}
                            {formData.confirmPassword && (
                                <div className="mt-1 flex items-center gap-1">
                                    {formData.password === formData.confirmPassword ? (
                                        <>
                                            <CheckCircle2 size={12} className="text-green-500" />
                                            <span className="text-xs text-green-600">Passwords match</span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-red-600">Passwords do not match</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-6"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {/* Terms */}
                        <p className="text-xs text-secondary-500 text-center mt-4">
                            By creating an account, you agree to our{' '}
                            <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                        </p>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-secondary-600">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors"
                            >
                                Log in
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

            {/* Right section - Features */}
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
                        <h2 className="text-3xl font-bold mb-4">
                            Everything you need to grow.
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            Join a community of modern shop owners who are transforming their business operations.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white text-lg">{feature.text}</h3>
                                            <p className="text-sm text-white/70 mt-1">
                                                {index === 0 && 'Monitor your revenue with actionable insights'}
                                                {index === 1 && 'Never run out of stock with automated alerts'}
                                                {index === 2 && 'Keep costs in check and maximize profits'}
                                                {index === 3 && 'Your data is safe with enterprise-grade security'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Success Stories */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold text-white">10k+</p>
                            <p className="text-sm text-white/70">Active Users</p>
                        </div>
                        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold text-white">95%</p>
                            <p className="text-sm text-white/70">Satisfaction</p>
                        </div>
                        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold text-white">24/7</p>
                            <p className="text-sm text-white/70">Support</p>
                        </div>
                        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold text-white">14d</p>
                            <p className="text-sm text-white/70">Free Trial</p>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                        <p className="text-white/90 text-sm italic">
                            "ShopPulse helped me increase my profits by 40% in just 3 months. The inventory alerts alone saved me from countless stockouts!"
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-bold">
                                MC
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Mike Chen</p>
                                <p className="text-xs text-white/60">Chen's Cafe, Owner</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;