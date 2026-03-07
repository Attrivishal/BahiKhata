// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { 
    DollarSign, TrendingUp, Package, AlertTriangle, Plus, 
    ShoppingCart, Calendar, ArrowUpRight, ArrowDownRight,
    Wallet, TrendingDown, MoreVertical, Download, Filter,
    RefreshCw, Eye, EyeOff
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const [sales, setSales] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddSale, setShowAddSale] = useState(false);
    const [newSale, setNewSale] = useState({ amount: '', productName: '' });
    const [timeRange, setTimeRange] = useState('week');
    const [showChart, setShowChart] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [salesRes, expRes, invRes] = await Promise.all([
                api.get('/sales'),
                api.get('/expenses'),
                api.get('/inventory')
            ]);
            setSales(salesRes.data);
            setExpenses(expRes.data);
            setInventory(invRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleAddSale = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sales', newSale);
            setShowAddSale(false);
            setNewSale({ amount: '', productName: '' });
            fetchDashboardData();
        } catch (error) {
            console.error("Error adding sale:", error);
        }
    };

    // Calculations
    const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalSales - totalExpenses;
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0;
    const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockAlert);

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

    // Chart data
    const chartDataMap = {};
    sales.forEach(sale => {
        const date = new Date(sale.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (!chartDataMap[date]) chartDataMap[date] = 0;
        chartDataMap[date] += sale.amount;
    });
    
    const chartData = Object.keys(chartDataMap)
        .map(date => ({ name: date, sales: chartDataMap[date] }))
        .reverse()
        .slice(0, 7);

    // Pie chart data for expense breakdown
    const expenseCategories = expenses.reduce((acc, expense) => {
        const category = expense.category || 'Other';
        if (!acc[category]) acc[category] = 0;
        acc[category] += expense.amount;
        return acc;
    }, {});

    const pieData = Object.keys(expenseCategories).map(category => ({
        name: category,
        value: expenseCategories[category]
    }));

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    // Recent activity combined
    const recentActivity = [
        ...sales.slice(0, 3).map(s => ({ ...s, type: 'sale' })),
        ...expenses.slice(0, 3).map(e => ({ ...e, type: 'expense' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-center text-secondary-600">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-secondary-600 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Welcome back, <span className="font-semibold text-primary-600">{localStorage.getItem('user')}</span>! Here's your business overview.
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleRefresh}
                        className="p-2.5 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition-all duration-200 group"
                    >
                        <RefreshCw size={20} className={`text-secondary-600 group-hover:rotate-180 transition-all duration-500 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>

                    <select 
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                    
                    <button
                        onClick={() => setShowAddSale(true)}
                        className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 font-medium"
                    >
                        <Plus size={18} />
                        New Sale
                    </button>

                    <button className="p-2.5 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition">
                        <Download size={20} className="text-secondary-600" />
                    </button>
                </div>
            </div>

            {/* Stats Grid - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Sales Card */}
                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1 flex items-center gap-2">
                                <span>Total Sales</span>
                                <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs">
                                    +{salesTrend}%
                                </span>
                            </p>
                            <h3 className="text-3xl font-bold text-secondary-900">${totalSales.toFixed(2)}</h3>
                            <p className="text-xs text-secondary-500 mt-3 flex items-center gap-1">
                                <ArrowUpRight size={14} className="text-green-500" />
                                <span className="text-green-600 font-medium">{salesTrend}%</span>
                                <span>vs last month</span>
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <DollarSign size={28} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-secondary-100">
                        <div className="flex items-center gap-2 text-sm">
                            <ShoppingCart size={16} className="text-secondary-400" />
                            <span className="text-secondary-600">{sales.length} transactions</span>
                        </div>
                    </div>
                </div>

                {/* Total Expenses Card */}
                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Total Expenses</p>
                            <h3 className="text-3xl font-bold text-secondary-900">${totalExpenses.toFixed(2)}</h3>
                            <p className="text-xs text-secondary-500 mt-3 flex items-center gap-1">
                                <ArrowDownRight size={14} className="text-red-500" />
                                <span className="text-red-600 font-medium">{((totalExpenses/totalSales)*100).toFixed(1)}%</span>
                                <span>of revenue</span>
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                            <TrendingDown size={28} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-secondary-100">
                        <div className="flex items-center gap-2 text-sm">
                            <Wallet size={16} className="text-secondary-400" />
                            <span className="text-secondary-600">{expenses.length} expenses</span>
                        </div>
                    </div>
                </div>

                {/* Net Profit Card */}
                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-green-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Net Profit</p>
                            <h3 className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${netProfit.toFixed(2)}
                            </h3>
                            <p className="text-xs text-secondary-500 mt-3 flex items-center gap-1">
                                <TrendingUp size={14} className="text-green-500" />
                                <span className="text-green-600 font-medium">{profitMargin}%</span>
                                <span>margin</span>
                            </p>
                        </div>
                        <div className={`w-14 h-14 bg-gradient-to-br ${netProfit >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-2xl flex items-center justify-center shadow-lg ${netProfit >= 0 ? 'shadow-green-500/30' : 'shadow-red-500/30'} group-hover:scale-110 transition-transform`}>
                            <Wallet size={28} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-secondary-100">
                        <div className="flex items-center gap-2 text-sm">
                            <TrendingUp size={16} className="text-secondary-400" />
                            <span className="text-secondary-600">Profit ratio: {profitMargin}%</span>
                        </div>
                    </div>
                </div>

                {/* Stock Alerts Card */}
                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-yellow-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Stock Alerts</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{lowStockItems.length}</h3>
                            <p className="text-xs text-secondary-500 mt-3 flex items-center gap-1">
                                <Package size={14} className="text-yellow-500" />
                                <span className="text-yellow-600 font-medium">{((lowStockItems.length/inventory.length)*100).toFixed(1)}%</span>
                                <span>of inventory</span>
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                            <AlertTriangle size={28} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-secondary-100">
                        <div className="flex items-center gap-2 text-sm">
                            <Package size={16} className="text-secondary-400" />
                            <span className="text-secondary-600">{inventory.length} total items</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Revenue Overview</h3>
                            <p className="text-sm text-secondary-500 mt-1">Daily sales performance</p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowChart(!showChart)}
                                className="p-2 hover:bg-secondary-100 rounded-lg transition"
                            >
                                {showChart ? <Eye size={18} className="text-secondary-500" /> : <EyeOff size={18} className="text-secondary-500" />}
                            </button>
                            <button className="p-2 hover:bg-secondary-100 rounded-lg transition">
                                <Filter size={18} className="text-secondary-500" />
                            </button>
                            <button className="p-2 hover:bg-secondary-100 rounded-lg transition">
                                <MoreVertical size={18} className="text-secondary-500" />
                            </button>
                        </div>
                    </div>
                    
                    {showChart && (
                        <div className="h-80">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={(val) => `$${val}`} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '12px', 
                                                border: 'none', 
                                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                                padding: '8px 12px'
                                            }}
                                            formatter={(value) => [`$${value}`, 'Revenue']}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="sales" 
                                            stroke="#4f46e5" 
                                            strokeWidth={3}
                                            fill="url(#colorSales)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-secondary-400">
                                    <ShoppingCart size={48} className="mb-3 opacity-50" />
                                    <p>No sales data available</p>
                                    <button className="mt-3 text-primary-600 text-sm hover:underline">
                                        Add your first sale →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Expense Breakdown</h3>
                            <p className="text-sm text-secondary-500 mt-1">By category</p>
                        </div>
                    </div>

                    <div className="h-64">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => [`$${value}`, 'Amount']}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-secondary-400">
                                No expense data
                            </div>
                        )}
                    </div>

                    <div className="mt-4 space-y-2">
                        {pieData.slice(0, 4).map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-secondary-600">{item.name}</span>
                                </div>
                                <span className="font-medium text-secondary-900">${item.value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Low Stock Alerts & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Low Stock Alerts</h3>
                            <p className="text-sm text-secondary-500 mt-1">Items needing attention</p>
                        </div>
                        <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                            {lowStockItems.length} urgent
                        </span>
                    </div>

                    <div className="space-y-4">
                        {lowStockItems.length > 0 ? (
                            lowStockItems.slice(0, 5).map(item => (
                                <div key={item._id} className="group flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 rounded-xl border border-red-100 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Package size={20} className="text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-secondary-900">{item.itemName}</p>
                                            <p className="text-xs text-secondary-500">Alert at {item.lowStockAlert} units</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-red-600">{item.quantity}</span>
                                        <p className="text-xs text-secondary-400">remaining</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Package size={32} className="text-green-500" />
                                </div>
                                <p className="text-secondary-900 font-medium">All stock levels normal</p>
                                <p className="text-sm text-secondary-500 mt-1">No low stock alerts at the moment</p>
                            </div>
                        )}
                    </div>

                    {lowStockItems.length > 0 && (
                        <button className="w-full mt-4 py-3 text-primary-600 text-sm font-medium hover:bg-primary-50 rounded-xl transition">
                            View all alerts →
                        </button>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
                            <p className="text-sm text-secondary-500 mt-1">Latest transactions</p>
                        </div>
                        <button className="text-primary-600 text-sm font-medium hover:underline">
                            View all
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 hover:bg-secondary-50 rounded-xl transition">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            activity.type === 'sale' ? 'bg-green-50' : 'bg-red-50'
                                        }`}>
                                            {activity.type === 'sale' ? (
                                                <ShoppingCart size={18} className="text-green-600" />
                                            ) : (
                                                <Wallet size={18} className="text-red-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-secondary-900">
                                                {activity.type === 'sale' ? activity.productName : activity.category || 'Expense'}
                                            </p>
                                            <p className="text-xs text-secondary-500">
                                                {new Date(activity.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${
                                        activity.type === 'sale' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {activity.type === 'sale' ? '+' : '-'}${activity.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-secondary-400">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Sale Modal - Enhanced */}
            {showAddSale && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slideUp">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-secondary-900">Record New Sale</h2>
                            <button 
                                onClick={() => setShowAddSale(false)}
                                className="p-2 hover:bg-secondary-100 rounded-lg transition"
                            >
                                <MoreVertical size={20} className="text-secondary-400 rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSale} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                    placeholder="e.g., Organic Rice"
                                    value={newSale.productName}
                                    onChange={e => setNewSale({ ...newSale, productName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Amount ($)
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
                                        onChange={e => setNewSale({ ...newSale, amount: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddSale(false)}
                                    className="flex-1 px-4 py-3 border border-secondary-200 text-secondary-700 font-medium rounded-xl hover:bg-secondary-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                                >
                                    Save Sale
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;