import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, BarChart3, Package, PiggyBank, ArrowRight, CheckCircle2, Menu, X } from 'lucide-react';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col font-sans overflow-x-hidden pt-20">
            {/* Sticky Navbar */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                                <Store className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                                ShopPulse
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-slate-600 hover:text-primary font-medium transition">Features</a>
                            <a href="#pricing" className="text-slate-600 hover:text-primary font-medium transition">Pricing</a>
                            <a href="#testimonials" className="text-slate-600 hover:text-primary font-medium transition">Testimonials</a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/login" className="text-primary font-medium hover:text-blue-700 transition">Log In</Link>
                            <Link to="/register" className="btn-primary rounded-full px-6 shadow-lg shadow-blue-500/20">
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 hover:text-slate-900">
                                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col space-y-4">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">Features</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">Pricing</a>
                        <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2">Testimonials</a>
                        <hr className="border-slate-100" />
                        <Link to="/login" className="text-center text-primary font-medium py-2">Log In</Link>
                        <Link to="/register" className="btn-primary text-center rounded-xl py-3">Get Started for Free</Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3"></div>

                <div className="flex-1 text-center lg:text-left z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-6 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                        ShopPulse 2.0 is now live!
                    </div>
                    <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
                        Manage your local shop <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">with zero stress.</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        The all-in-one platform designed specifically for grocers, cafes, and local boutiques. Track sales, monitor inventory, and boost your profit margins effortlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link to="/register" className="btn-primary text-lg px-8 py-4 rounded-full shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group">
                            Start Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                        <button className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-semibold px-8 py-4 rounded-full transition text-lg flex justify-center items-center">
                            Book a Demo
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 mt-4 flex items-center justify-center lg:justify-start gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" /> No credit card required. 14-day free trial.
                    </p>
                </div>

                <div className="flex-1 w-full max-w-2xl relative z-10">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60 bg-white transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                        {/* Browser Header Mockup */}
                        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-4 bg-white text-slate-400 text-xs px-2 py-1 rounded w-full max-w-[200px] shadow-sm flex items-center justify-center">
                                shoppulse.app/dashboard
                            </div>
                        </div>
                        {/* Dashboard Image Mockup */}
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                            alt="ShopPulse Dashboard Preview"
                            className="w-full h-auto object-cover opacity-95"
                        />
                        {/* Overlay floaters to make it look app-like */}
                        <div className="absolute top-1/2 left-4 bg-white p-3 rounded-lg shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce shadow-emerald-500/10" style={{ animationDuration: '3s' }}>
                            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-md"><PiggyBank size={18} /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">+ Profit</p>
                                <p className="text-sm font-bold text-slate-800">$1,240.50</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Core Features</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Everything you need to run your shop.</h3>
                        <p className="text-lg text-slate-600">Gone are the days of manual ledgers and excel sheets. ShopPulse automates the boring stuff so you can focus on your customers.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="text-primary w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Daily Sales Tracking</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Log every transaction instantly. Visualize daily, weekly, and monthly trends to understand your business growth.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <PiggyBank className="text-emerald-500 w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Expense Management</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Record supplier costs, utilities, and wages. Instantly calculate your net profit margins in real-time.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Package className="text-amber-500 w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Smart Inventory Alerts</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Set low-stock thresholds for your top products. Get notified before you run out and miss a sale.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Simple, transparent pricing.</h3>
                        <p className="text-lg text-slate-600">No hidden fees or surprise charges. Choose the plan that fits your shop.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                        {/* Basic Plan */}
                        <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-lg transition bg-white">
                            <h4 className="text-xl font-semibold mb-2 text-slate-900">Starter</h4>
                            <p className="text-slate-500 text-sm mb-6">Perfect for new solopreneurs.</p>
                            <div className="text-4xl font-bold mb-6 text-slate-900">$12<span className="text-lg font-normal text-slate-500">/mo</span></div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Up to 500 sales entries</li>
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Basic reporting</li>
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Email support</li>
                            </ul>
                            <Link to="/register" className="block w-full text-center py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-blue-50 transition">Get Started</Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="border-2 border-primary rounded-3xl p-8 shadow-xl bg-white relative transform md:-translate-y-4 z-10">
                            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>
                            <h4 className="text-xl font-semibold mb-2 text-slate-900">Professional</h4>
                            <p className="text-slate-500 text-sm mb-6">For growing local businesses.</p>
                            <div className="text-4xl font-bold mb-6 text-slate-900">$29<span className="text-lg font-normal text-slate-500">/mo</span></div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Unlimited sales entries</li>
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Advanced analytics</li>
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Smart Inventory Alerts</li>
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Priority 24/7 support</li>
                            </ul>
                            <Link to="/register" className="block w-full text-center py-3 rounded-xl btn-primary shadow-lg shadow-blue-500/30">Start 14-Day Free Trial</Link>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-lg transition bg-white hidden lg:block">
                            <h4 className="text-xl font-semibold mb-2 text-slate-900">Multi-Store</h4>
                            <p className="text-slate-500 text-sm mb-6">For businesses with multiple locations.</p>
                            <div className="text-4xl font-bold mb-6 text-slate-900">$89<span className="text-lg font-normal text-slate-500">/mo</span></div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Everything in Pro</li>
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Manage up to 5 stores</li>
                                <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 size={18} className="text-primary" /> Multi-user access</li>
                            </ul>
                            <button className="block w-full text-center py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary/20 p-2 rounded-xl">
                                <Store className="text-primary w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-white">ShopPulse</span>
                        </div>
                        <p className="max-w-xs mb-6 text-sm leading-relaxed">Empowering local shop owners with modern digital tools to simplify operations and maximize profits.</p>
                    </div>
                    <div>
                        <h5 className="text-white font-semibold mb-4">Product</h5>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">Features</a></li>
                            <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition">Updates</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-semibold mb-4">Company</h5>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center md:text-left">
                    &copy; {new Date().getFullYear()} ShopPulse Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
