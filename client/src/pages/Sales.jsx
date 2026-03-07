// src/pages/Sales.jsx
import React, { useState, useEffect } from 'react';
import { 
    ShoppingCart, Plus, TrendingUp, Calendar, Edit, Trash2, 
    Filter, Download, Printer, CreditCard, Wallet, Search,
    ArrowUpRight, ArrowDownRight, Eye, EyeOff, RefreshCw,
    MoreVertical, X, CheckCircle2, Clock, Users, DollarSign,
    BarChart3, PieChart, Receipt
} from 'lucide-react';
import api from '../services/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart as RePie, Pie, Cell
} from 'recharts';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState('table'); // table or grid
    const [showStats, setShowStats] = useState(true);
    
    const [newSale, setNewSale] = useState({ 
        productName: '', 
        amount: '',
        customerName: '',
        paymentMethod: 'cash',
        quantity: 1,
        description: ''
    });

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await api.get('/sales');
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchSales();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleAddSale = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sales', newSale);
            setShowAddModal(false);
            setNewSale({ 
                productName: '', amount: '', customerName: '', 
                paymentMethod: 'cash', quantity: 1, description: '' 
            });
            fetchSales();
        } catch (error) {
            console.error('Error adding sale:', error);
        }
    };

    const handleEditSale = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/sales/${selectedSale._id}`, selectedSale);
            setShowEditModal(false);
            setSelectedSale(null);
            fetchSales();
        } catch (error) {
            console.error('Error updating sale:', error);
        }
    };

    const handleDeleteSale = async (id) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            try {
                await api.delete(`/sales/${id}`);
                fetchSales();
            } catch (error) {
                console.error('Error deleting sale:', error);
            }
        }
    };

    // Calculations
    const totalRevenue = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalTransactions = sales.length;
    const averageSale = totalTransactions > 0 ? (totalRevenue / totalTransactions) : 0;
    
    const today = new Date().toDateString();
    const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === today)
        .reduce((acc, curr) => acc + curr.amount, 0);
    const todayCount = sales.filter(sale => new Date(sale.date).toDateString() === today).length;

    // Current month vs previous month
    const currentMonth = new Date().getMonth();
    const currentMonthSales = sales.filter(sale => new Date(sale.date).getMonth() === currentMonth)
        .reduce((acc, curr) => acc + curr.amount, 0);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthSales = sales.filter(sale => new Date(sale.date).getMonth() === prevMonth)
        .reduce((acc, curr) => acc + curr.amount, 0);
    const salesTrend = prevMonthSales > 0 
        ? (((currentMonthSales - prevMonthSales) / prevMonthSales) * 100).toFixed(1)
        : 0;

    const paymentMethods = sales.reduce((acc, sale) => {
        const method = sale.paymentMethod || 'cash';
        acc[method] = (acc[method] || 0) + sale.amount;
        return acc;
    }, {});

    // Chart data for sales trend
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    const trendData = last7Days.map(day => {
        const daySales = sales.filter(sale => 
            new Date(sale.date).toLocaleDateString('en-US', { weekday: 'short' }) === day
        ).reduce((acc, curr) => acc + curr.amount, 0);
        return { day, sales: daySales };
    });

    // Pie chart data for payment methods
    const pieData = Object.entries(paymentMethods).map(([name, value]) => ({
        name,
        value
    }));

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

    const filteredSales = sales.filter(sale => {
        const matchesSearch = searchTerm === '' || 
            sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sale.customerName && sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (!matchesSearch) return false;
        
        const saleDate = new Date(sale.date);
        const now = new Date();
        
        switch(filterPeriod) {
            case 'today':
                return saleDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now.setDate(now.getDate() - 7));
                return saleDate >= weekAgo;
            case 'month':
                return saleDate.getMonth() === now.getMonth() && 
                       saleDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-center text-secondary-600">Loading sales...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                        Sales Management
                    </h1>
                    <p className="text-secondary-600 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Track and manage all your sales transactions in real-time
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleRefresh}
                        className="p-2.5 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition-all duration-200 group"
                    >
                        <RefreshCw size={20} className={`text-secondary-600 group-hover:rotate-180 transition-all duration-500 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>

                    <button className="px-4 py-2.5 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition flex items-center gap-2 text-secondary-600">
                        <Download size={18} />
                        <span className="text-sm font-medium">Export</span>
                    </button>

                    <button className="px-4 py-2.5 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition flex items-center gap-2 text-secondary-600">
                        <Printer size={18} />
                        <span className="text-sm font-medium">Print</span>
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 font-medium"
                    >
                        <Plus size={18} />
                        New Sale
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{formatCurrency(totalRevenue)}</h3>
                            <div className="flex items-center gap-1 mt-2">
                                <span className={`text-xs font-medium flex items-center gap-1 ${
                                    salesTrend >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {salesTrend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {Math.abs(salesTrend)}%
                                </span>
                                <span className="text-xs text-secondary-500">vs last month</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                            <DollarSign size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Today's Sales</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{formatCurrency(todaySales)}</h3>
                            <p className="text-xs text-secondary-500 mt-2">{todayCount} transactions today</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <ShoppingCart size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Transactions</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{totalTransactions}</h3>
                            <p className="text-xs text-secondary-500 mt-2">Total sales count</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                            <Receipt size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Average Sale</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{formatCurrency(averageSale)}</h3>
                            <p className="text-xs text-secondary-500 mt-2">Per transaction</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                            <TrendingUp size={28} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Sales Trend</h3>
                            <p className="text-sm text-secondary-500 mt-1">Last 7 days performance</p>
                        </div>
                        <button className="p-2 hover:bg-secondary-100 rounded-lg transition">
                            <MoreVertical size={18} className="text-secondary-500" />
                        </button>
                    </div>
                    
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="day" tick={{ fill: '#64748b' }} />
                                <YAxis tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                                <Tooltip 
                                    formatter={(value) => [formatCurrency(value), 'Sales']}
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' 
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="sales" 
                                    stroke="#4f46e5" 
                                    strokeWidth={3}
                                    dot={{ fill: '#4f46e5', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Payment Methods Pie Chart */}
                <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Payment Methods</h3>
                            <p className="text-sm text-secondary-500 mt-1">Breakdown by type</p>
                        </div>
                        <button 
                            onClick={() => setShowStats(!showStats)}
                            className="p-2 hover:bg-secondary-100 rounded-lg transition"
                        >
                            {showStats ? <Eye size={18} className="text-secondary-500" /> : <EyeOff size={18} className="text-secondary-500" />}
                        </button>
                    </div>

                    {showStats && (
                        <>
                            <div className="h-48">
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePie>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => formatCurrency(value)}
                                                contentStyle={{ borderRadius: '12px', border: 'none' }}
                                            />
                                        </RePie>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-secondary-400">
                                        No payment data
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 space-y-2">
                                {pieData.slice(0, 4).map((item, index) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-secondary-600 capitalize">{item.name}</span>
                                        </div>
                                        <span className="font-medium text-secondary-900">{formatCurrency(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                    {/* Period Filter */}
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-secondary-200 shadow-sm">
                        <Calendar size={18} className="text-secondary-400" />
                        <select 
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium text-secondary-600 min-w-[120px]"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-white border border-secondary-200 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition ${
                                viewMode === 'table' 
                                ? 'bg-primary-50 text-primary-600' 
                                : 'text-secondary-400 hover:text-secondary-600'
                            }`}
                        >
                            <Receipt size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition ${
                                viewMode === 'grid' 
                                ? 'bg-primary-50 text-primary-600' 
                                : 'text-secondary-400 hover:text-secondary-600'
                            }`}
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by product or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-secondary-600">
                    Showing <span className="font-medium text-secondary-900">{filteredSales.length}</span> of{' '}
                    <span className="font-medium text-secondary-900">{sales.length}</span> sales
                </p>
                <p className="text-sm font-medium text-secondary-900">
                    Total: <span className="text-green-600">{formatCurrency(
                        filteredSales.reduce((acc, curr) => acc + curr.amount, 0)
                    )}</span>
                </p>
            </div>

            {/* Sales Grid/Table View */}
            {viewMode === 'table' ? (
                <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-secondary-50 border-b border-secondary-200">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">Product</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">Customer</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">Payment</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">Date</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-secondary-600">Amount</th>
                                    <th className="text-center py-4 px-6 text-sm font-semibold text-secondary-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales.length > 0 ? (
                                    filteredSales.map((sale) => {
                                        const method = sale.paymentMethod || 'cash';
                                        return (
                                            <tr key={sale._id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="font-medium text-secondary-900">{sale.productName}</p>
                                                        {sale.quantity > 1 && (
                                                            <p className="text-xs text-secondary-500 mt-0.5">Qty: {sale.quantity}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm text-secondary-600">
                                                        {sale.customerName || '—'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                                        ${method === 'cash' ? 'bg-green-50 text-green-700' : 
                                                          method === 'card' ? 'bg-blue-50 text-blue-700' : 
                                                          'bg-purple-50 text-purple-700'}`}>
                                                        {method === 'cash' && <Wallet size={12} />}
                                                        {method === 'card' && <CreditCard size={12} />}
                                                        <span className="capitalize">{method}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-secondary-400" />
                                                        <span className="text-sm text-secondary-600">{formatDate(sale.date)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <span className="font-bold text-green-600">+{formatCurrency(sale.amount)}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedSale(sale);
                                                                setShowEditModal(true);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteSale(sale._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <button className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition">
                                                            <Printer size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mb-3">
                                                    <ShoppingCart size={24} className="text-secondary-400" />
                                                </div>
                                                <p className="text-secondary-600 font-medium">No sales found</p>
                                                <p className="text-sm text-secondary-400 mt-1">Click 'New Sale' to add your first transaction</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSales.length > 0 ? (
                        filteredSales.map((sale) => {
                            const method = sale.paymentMethod || 'cash';
                            return (
                                <div key={sale._id} className="group bg-white rounded-2xl border border-secondary-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center">
                                                    <ShoppingCart size={24} className="text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-secondary-900">{sale.productName}</h3>
                                                    <p className="text-xs text-secondary-500">{sale.customerName || 'Walk-in Customer'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedSale(sale);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteSale(sale._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-secondary-500">Amount</span>
                                                <span className="text-xl font-bold text-green-600">+{formatCurrency(sale.amount)}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-secondary-500">Payment</span>
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium
                                                    ${method === 'cash' ? 'bg-green-50 text-green-700' : 
                                                      method === 'card' ? 'bg-blue-50 text-blue-700' : 
                                                      'bg-purple-50 text-purple-700'}`}>
                                                    {method === 'cash' && <Wallet size={12} />}
                                                    {method === 'card' && <CreditCard size={12} />}
                                                    <span className="capitalize">{method}</span>
                                                </div>
                                            </div>

                                            {sale.quantity > 1 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-secondary-500">Quantity</span>
                                                    <span className="font-medium text-secondary-900">{sale.quantity} units</span>
                                                </div>
                                            )}

                                            <div className="pt-3 border-t border-secondary-100">
                                                <div className="flex items-center gap-2 text-xs text-secondary-500">
                                                    <Clock size={12} />
                                                    {formatDate(sale.date)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-12 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-secondary-100 rounded-2xl flex items-center justify-center mb-4">
                                    <ShoppingCart size={32} className="text-secondary-400" />
                                </div>
                                <p className="text-secondary-600 font-medium text-lg">No sales found</p>
                                <p className="text-sm text-secondary-400 mt-1">Try adjusting your filters or add a new sale</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Add Sale Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-slideUp">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-secondary-900">Record New Sale</h2>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-secondary-100 rounded-lg transition"
                            >
                                <X size={20} className="text-secondary-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSale} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                    placeholder="e.g., Organic Rice"
                                    value={newSale.productName}
                                    onChange={e => setNewSale({...newSale, productName: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        placeholder="0.00"
                                        value={newSale.amount}
                                        onChange={e => setNewSale({...newSale, amount: parseFloat(e.target.value) || 0})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        placeholder="1"
                                        value={newSale.quantity}
                                        onChange={e => setNewSale({...newSale, quantity: parseInt(e.target.value) || 1})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={newSale.paymentMethod}
                                        onChange={e => setNewSale({...newSale, paymentMethod: e.target.value})}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                        <option value="upi">UPI</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Customer Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                    placeholder="e.g., John Doe"
                                    value={newSale.customerName}
                                    onChange={e => setNewSale({...newSale, customerName: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                    placeholder="Additional notes..."
                                    rows="2"
                                    value={newSale.description}
                                    onChange={e => setNewSale({...newSale, description: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddModal(false)} 
                                    className="flex-1 px-4 py-3 border border-secondary-200 text-secondary-700 font-medium rounded-xl hover:bg-secondary-50 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                                >
                                    Add Sale
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Sale Modal */}
            {showEditModal && selectedSale && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-slideUp">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-secondary-900">Edit Sale</h2>
                            <button 
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedSale(null);
                                }}
                                className="p-2 hover:bg-secondary-100 rounded-lg transition"
                            >
                                <X size={20} className="text-secondary-400" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSale} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                    value={selectedSale.productName}
                                    onChange={e => setSelectedSale({...selectedSale, productName: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={selectedSale.amount}
                                        onChange={e => setSelectedSale({...selectedSale, amount: parseFloat(e.target.value) || 0})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedSale(null);
                                    }} 
                                    className="flex-1 px-4 py-3 border border-secondary-200 text-secondary-700 font-medium rounded-xl hover:bg-secondary-50 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                                >
                                    Update Sale
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sales;