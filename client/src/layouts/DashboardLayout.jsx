// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
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
    Sun,
    Search,
    TrendingUp,
    CreditCard,
    AlertCircle
} from 'lucide-react';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    const shopName = localStorage.getItem('shopName') || 'ShopPulse';
    const userName = localStorage.getItem('user') || 'User';
    const userInitial = userName.charAt(0).toUpperCase();

    // Check for saved dark mode preference
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedMode);
        if (savedMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('shopName');
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
        { name: 'Sales', path: '/dashboard/sales', icon: TrendingUp, badge: null },
        { name: 'Expenses', path: '/dashboard/expenses', icon: CreditCard, badge: null },
        { name: 'Inventory', path: '/dashboard/inventory', icon: Package, badge: 3 },
        { name: 'Reports', path: '/dashboard/reports', icon: BarChart3, badge: null },
    ];

    const notifications = [
        { id: 1, title: 'Low Stock Alert', message: '5 items running low', time: '5 min ago', type: 'warning' },
        { id: 2, title: 'New Sale', message: '$234.50 from Store A', time: '15 min ago', type: 'success' },
        { id: 3, title: 'Expense Due', message: 'Rent payment tomorrow', time: '1 hour ago', type: 'info' },
    ];

    const isActive = (path) => location.pathname === path;

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={`flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ${darkMode ? 'dark' : ''}`}>
            {/* Sidebar - Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 
                transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0
                shadow-2xl lg:shadow-none border-r border-slate-200 dark:border-slate-800
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 dark:border-slate-800">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary-500/30">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                {shopName}
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Business Dashboard</p>
                        </div>
                    </Link>
                    <button 
                        onClick={() => setSidebarOpen(false)} 
                        className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* User Info - Enhanced */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {userInitial}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white capitalize text-lg">{userName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Free Plan</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Today's Sales</p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white">$1,234</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Orders</p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white">45</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative
                                    ${active 
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white'} />
                                <span className="font-medium">{link.name}</span>
                                
                                {link.badge && (
                                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    {/* Upgrade Banner */}
                    <div className="mt-8 p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white">
                        <p className="text-sm font-semibold">Upgrade to Pro</p>
                        <p className="text-xs mt-1 opacity-90">Get advanced analytics & more</p>
                        <button className="mt-3 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors">
                            View Plans →
                        </button>
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <Link
                        to="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </Link>
                    
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors mt-2"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
                {/* Top Header */}
                <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-8 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setSidebarOpen(true)} 
                            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                            <Menu size={24} />
                        </button>
                        
                        {/* Search Bar */}
                        <div className="hidden md:flex relative max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search transactions, products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/50 transition"
                            />
                        </div>

                        {/* Breadcrumb */}
                        <div className="hidden lg:block">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {navLinks.find(link => link.path === location.pathname)?.name || 'Dashboard'}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition relative"
                            >
                                <Bell size={20} className="text-slate-600 dark:text-slate-300" />
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                            </button>

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                                                <div className="flex gap-3">
                                                    <div className={`w-2 h-2 mt-2 rounded-full ${
                                                        notif.type === 'warning' ? 'bg-yellow-500' :
                                                        notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                                    }`} />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{notif.title}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Help */}
                        <button className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                            <HelpCircle size={20} className="text-slate-600 dark:text-slate-300" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 pr-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                                    {userInitial}
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 capitalize hidden sm:block">
                                    {userName}
                                </span>
                                <ChevronDown size={16} className="text-slate-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{userName}</p>
                                        <p className="text-xs text-slate-500">Free Plan</p>
                                    </div>
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
                                    <hr className="border-slate-200 dark:border-slate-700 my-1" />
                                    <button
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
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
                <div className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;