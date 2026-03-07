// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Store, BarChart3, Package, PiggyBank, ArrowRight, CheckCircle2, 
    Menu, X, Star, TrendingUp, Shield, Zap, Users, CreditCard,
    Phone, Mail, MapPin, ChevronRight, Play, Sparkles
} from 'lucide-react';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: BarChart3,
            title: 'Daily Sales Tracking',
            description: 'Log every transaction instantly. Visualize daily, weekly, and monthly trends to understand your business growth.',
            color: 'blue',
            stats: '40% faster tracking'
        },
        {
            icon: PiggyBank,
            title: 'Expense Management',
            description: 'Record supplier costs, utilities, and wages. Instantly calculate your net profit margins in real-time.',
            color: 'emerald',
            stats: 'Save 15% on costs'
        },
        {
            icon: Package,
            title: 'Smart Inventory Alerts',
            description: 'Set low-stock thresholds for your top products. Get notified before you run out and miss a sale.',
            color: 'amber',
            stats: 'Reduce stockouts by 90%'
        },
        {
            icon: TrendingUp,
            title: 'Profit Analytics',
            description: 'Deep insights into your most profitable products and peak sales hours.',
            color: 'purple',
            stats: 'Increase profit by 25%'
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Bank-level security for your business data. Automatic backups and 99.9% uptime guarantee.',
            color: 'green',
            stats: '99.9% uptime'
        },
        {
            icon: Users,
            title: 'Multi-User Access',
            description: 'Add your staff with role-based permissions. Track who did what, when.',
            color: 'pink',
            stats: 'Unlimited users'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Owner, Green Grocers',
            content: 'ShopPulse transformed how I run my store. I used to spend hours on inventory, now it takes minutes. Best decision for my business!',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1494790108777-296fd5c9a0b9?w=150&h=150&fit=crop'
        },
        {
            name: 'Mike Chen',
            role: 'Founder, Chen\'s Cafe',
            content: 'The profit tracking feature alone saved me thousands. I finally understand where my money is going and how to optimize.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
        },
        {
            name: 'Priya Patel',
            role: 'Manager, Spice Bazaar',
            content: 'The low stock alerts are a lifesaver. We never run out of bestsellers anymore. Our customers are happier than ever!',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop'
        }
    ];

    const stats = [
        { value: '10K+', label: 'Active Users' },
        { value: '95%', label: 'Customer Satisfaction' },
        { value: '$2M+', label: 'Sales Tracked' },
        { value: '24/7', label: 'Support Available' }
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
            {/* Sticky Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-secondary-200' 
                : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-primary-600 to-primary-500 p-2.5 rounded-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                                <Store className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                    ShopPulse
                                </span>
                                <span className="hidden lg:inline-block ml-2 px-2 py-0.5 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 text-xs font-medium rounded-full">
                                    v2.0
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {['Features', 'Pricing', 'Testimonials', 'About'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-secondary-600 hover:text-primary-600 font-medium transition-colors relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-400 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link 
                                to="/login" 
                                className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                Log In
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 flex items-center gap-2 group"
                            >
                                Get Started
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                            className="md:hidden p-2 rounded-lg hover:bg-secondary-100 transition"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-secondary-200 shadow-xl py-4 px-6 flex flex-col space-y-4 animate-slideDown">
                        {['Features', 'Pricing', 'Testimonials', 'About'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-secondary-600 hover:text-primary-600 font-medium py-2 px-4 hover:bg-secondary-50 rounded-lg transition"
                            >
                                {item}
                            </a>
                        ))}
                        <hr className="border-secondary-200" />
                        <Link 
                            to="/login" 
                            className="text-center text-primary-600 font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Log In
                        </Link>
                        <Link 
                            to="/register" 
                            className="bg-gradient-to-r from-primary-600 to-primary-500 text-white text-center rounded-xl py-3 font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Get Started for Free
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-50 to-blue-50 rounded-full blur-[120px] opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-full blur-[100px] opacity-50"></div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 text-primary-700 font-medium text-sm mb-8 shadow-sm">
                                <Sparkles size={16} className="text-primary-500" />
                                <span>ShopPulse 2.0 is now live with AI-powered insights!</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-secondary-900 leading-tight mb-6">
                                Manage your local shop{' '}
                                <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500 bg-clip-text text-transparent">
                                    with zero stress.
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                The all-in-one platform designed specifically for grocers, cafes, and local boutiques. 
                                Track sales, monitor inventory, and boost your profit margins effortlessly.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                                <Link 
                                    to="/register" 
                                    className="group bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    Start Free Trial
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className="bg-white text-secondary-700 border border-secondary-200 hover:border-primary-200 hover:bg-primary-50/30 font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                                    <Play size={18} className="fill-secondary-700" />
                                    Watch Demo
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                                <p className="text-sm text-secondary-500 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    No credit card required
                                </p>
                                <p className="text-sm text-secondary-500 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    14-day free trial
                                </p>
                                <p className="text-sm text-secondary-500 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Cancel anytime
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t border-secondary-200">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                                        <p className="text-xs text-secondary-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-secondary-200/60 bg-white transform lg:rotate-2 hover:rotate-0 transition-all duration-500">
                                {/* Browser Header */}
                                <div className="bg-gradient-to-r from-secondary-50 to-white border-b border-secondary-200 px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="ml-4 bg-white text-secondary-400 text-xs px-3 py-1.5 rounded-lg border border-secondary-200 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        shoppulse.app/dashboard
                                    </div>
                                </div>
                                
                                {/* Dashboard Preview */}
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                                    alt="ShopPulse Dashboard Preview"
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            {/* Floating Stats Cards */}
                            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl border border-secondary-200 p-4 animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary-500">Today's Sales</p>
                                        <p className="text-lg font-bold text-secondary-900">$1,284</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-secondary-200 p-4 animate-float-delayed">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <Package size={20} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary-500">Low Stock Alerts</p>
                                        <p className="text-lg font-bold text-secondary-900">3 items</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gradient-to-b from-white to-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3 block">
                            Core Features
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                            Everything you need to run your shop
                        </h2>
                        <p className="text-lg text-secondary-600">
                            Gone are the days of manual ledgers and excel sheets. ShopPulse automates the boring stuff 
                            so you can focus on your customers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div 
                                    key={index}
                                    className="group bg-white p-8 rounded-2xl border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-20 h-20 bg-${feature.color}-50 rounded-bl-[40px] -z-10 group-hover:scale-[3] transition-transform duration-500 opacity-50`}></div>
                                    
                                    <div className={`w-14 h-14 rounded-xl bg-${feature.color}-50 border border-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`text-${feature.color}-600 w-7 h-7`} />
                                    </div>
                                    
                                    <h4 className="text-xl font-bold text-secondary-900 mb-3">{feature.title}</h4>
                                    <p className="text-secondary-600 leading-relaxed mb-4">{feature.description}</p>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-medium text-${feature.color}-600 bg-${feature.color}-50 px-3 py-1.5 rounded-full`}>
                                            {feature.stats}
                                        </span>
                                        <ChevronRight size={18} className="text-secondary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3 block">
                            Testimonials
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                            Loved by shop owners everywhere
                        </h2>
                        <p className="text-lg text-secondary-600">
                            Join thousands of satisfied business owners who have transformed their operations with ShopPulse.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div 
                                key={index}
                                className="bg-gradient-to-br from-white to-secondary-50 p-8 rounded-2xl border border-secondary-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <img 
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                                    />
                                    <div>
                                        <h4 className="font-bold text-secondary-900">{testimonial.name}</h4>
                                        <p className="text-sm text-secondary-500">{testimonial.role}</p>
                                        <div className="flex gap-0.5 mt-1">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-secondary-600 italic">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-gradient-to-b from-secondary-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3 block">
                            Pricing
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-lg text-secondary-600">
                            No hidden fees or surprise charges. Choose the plan that fits your shop.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Starter Plan */}
                        <div className="bg-white rounded-3xl p-8 border border-secondary-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                            <h4 className="text-xl font-semibold mb-2 text-secondary-900">Starter</h4>
                            <p className="text-secondary-500 text-sm mb-6">Perfect for new solopreneurs</p>
                            <div className="text-4xl font-bold mb-6 text-secondary-900">
                                $12<span className="text-lg font-normal text-secondary-400">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Up to 500 sales entries
                                </li>
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Basic reporting
                                </li>
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Email support
                                </li>
                            </ul>
                            <Link 
                                to="/register" 
                                className="block w-full text-center py-3 rounded-xl border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition"
                            >
                                Get Started
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-gradient-to-br from-white to-primary-50 rounded-3xl p-8 border-2 border-primary-600 shadow-xl relative transform md:-translate-y-4">
                            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                Most Popular
                            </div>
                            <h4 className="text-xl font-semibold mb-2 text-secondary-900">Professional</h4>
                            <p className="text-secondary-500 text-sm mb-6">For growing local businesses</p>
                            <div className="text-4xl font-bold mb-6 text-secondary-900">
                                $29<span className="text-lg font-normal text-secondary-400">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Unlimited sales entries
                                </li>
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Advanced analytics
                                </li>
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Smart Inventory Alerts
                                </li>
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Priority 24/7 support
                                </li>
                            </ul>
                            <Link 
                                to="/register" 
                                className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition"
                            >
                                Start 14-Day Free Trial
                            </Link>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-white rounded-3xl p-8 border border-secondary-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                            <h4 className="text-xl font-semibold mb-2 text-secondary-900">Enterprise</h4>
                            <p className="text-secondary-500 text-sm mb-6">For multi-store businesses</p>
                            <div className="text-4xl font-bold mb-6 text-secondary-900">
                                $89<span className="text-lg font-normal text-secondary-400">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Everything in Pro
                                </li>
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Manage up to 5 stores
                                </li>
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Multi-user access
                                </li>
                                <li className="flex items-center gap-3 text-secondary-600">
                                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0" />
                                    Custom integrations
                                </li>
                            </ul>
                            <button className="block w-full text-center py-3 rounded-xl border-2 border-secondary-300 text-secondary-700 font-semibold hover:bg-secondary-50 transition">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-500 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to transform your shop?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of shop owners who are already saving time and increasing profits with ShopPulse.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                            Start Your Free Trial
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                            Talk to Sales
                        </button>
                    </div>
                    <p className="text-sm text-white/80 mt-6">
                        No credit card required. 14-day free trial. Cancel anytime.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-secondary-900 text-secondary-400 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-primary-600/20 p-2 rounded-xl">
                                    <Store className="text-primary-400 w-6 h-6" />
                                </div>
                                <span className="text-xl font-bold text-white">ShopPulse</span>
                            </div>
                            <p className="max-w-xs mb-6 text-sm leading-relaxed">
                                Empowering local shop owners with modern digital tools to simplify operations and maximize profits.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-secondary-500 hover:text-primary-400 transition">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                                <a href="#" className="text-secondary-500 hover:text-primary-400 transition">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.825-12.92c.985-.71 1.84-1.6 2.514-2.614z"/></svg>
                                </a>
                                <a href="#" className="text-secondary-500 hover:text-primary-400 transition">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <h5 className="text-white font-semibold mb-4">Product</h5>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#features" className="hover:text-primary-400 transition">Features</a></li>
                                <li><a href="#pricing" className="hover:text-primary-400 transition">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition">Updates</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition">API</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h5 className="text-white font-semibold mb-4">Company</h5>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-primary-400 transition">About Us</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition">Blog</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition">Careers</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-secondary-800">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                            <p>&copy; {new Date().getFullYear()} ShopPulse Inc. All rights reserved.</p>
                            <div className="flex gap-6">
                                <a href="#" className="hover:text-primary-400 transition">Privacy Policy</a>
                                <a href="#" className="hover:text-primary-400 transition">Terms of Service</a>
                                <a href="#" className="hover:text-primary-400 transition">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float 3s ease-in-out 1.5s infinite;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;