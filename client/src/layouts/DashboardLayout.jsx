import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    DollarSign, 
    Package, 
    BarChart3, 
    LogOut, 
    Menu, 
    Bell, 
    X,
    User,
    ChevronDown,
    Settings,
    HelpCircle,
    Moon,
    Sun
} from 'lucide-react';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const shopName = localStorage.getItem('shopName') || 'ShopPulse';
    const userName = localStorage.getItem('user') || 'User';
    const userInitial = userName.charAt(0).toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('shopName');
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Sales', path: '/dashboard/sales', icon: ShoppingCart },
        { name: 'Expenses', path: '/dashboard/expenses', icon: DollarSign },
        { name: 'Inventory', path: '/dashboard/inventory', icon: Package },
        { name: 'Reports', path: '/dashboard/reports', icon: BarChart3 },
    ];

    const isActive = (path) => location.pathname === path;

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={`flex h-screen bg-slate-50 ${darkMode ? 'dark' : ''}`}>
            {/* Sidebar - Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white
                transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                            {shopName}
                        </span>
                    </Link>
                    <button 
                        onClick={() => setSidebarOpen(false)} 
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* User Info - Mobile */}
                <div className="lg:hidden p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            {userInitial}
                        </div>
                        <div>
                            <p className="font-medium">{userName}</p>
                            <p className="text-xs text-slate-400">{shopName}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                    ${active 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }
                                `}
                            >
                                <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                                <span className="font-medium">{link.name}</span>
                                
                                {/* Notification Badge for Inventory */}
                                {link.name === 'Inventory' && (
                                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                        3
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-700 space-y-2">
                    <Link
                        to="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </Link>
                    
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white dark:bg-slate-800 px-6 py-4 shadow-sm flex justify-between items-center z-10 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)} 
                            className="lg:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                        
                        {/* Breadcrumb */}
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                                {navLinks.find(link => link.path === location.pathname)?.name || 'Dashboard'}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative">
                            <button className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition relative">
                                <Bell size={20} className="text-slate-600 dark:text-slate-300" />
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                            </button>
                        </div>

                        {/* Help */}
                        <button className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                            <HelpCircle size={20} className="text-slate-600 dark:text-slate-300" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700 p-1.5 pr-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition border border-slate-200 dark:border-slate-600"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                    {userInitial}
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 capitalize hidden sm:block">
                                    {userName}
                                </span>
                                <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
                            </button>

                            {/* Dropdown Menu */}
                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                                    <Link
                                        to="/dashboard/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                        onClick={() => setProfileMenuOpen(false)}
                                    >
                                        <User size={16} />
                                        Your Profile
                                    </Link>
                                    <Link
                                        to="/dashboard/settings"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                        onClick={() => setProfileMenuOpen(false)}
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </Link>
                                    <hr className="border-slate-200 dark:border-slate-700" />
                                    <button
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;