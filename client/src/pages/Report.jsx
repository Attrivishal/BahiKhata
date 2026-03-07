// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';
import { 
    BarChart3, Download, Calendar, Filter, TrendingUp, TrendingDown, 
    DollarSign, Package, ShoppingCart, FileText, PieChart, LineChart,
    RefreshCw, ChevronDown, Eye, EyeOff, ArrowUpRight, ArrowDownRight,
    Printer, Mail, Share2, MoreVertical
} from 'lucide-react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLine, Line, AreaChart, Area
} from 'recharts';

const Reports = () => {
    const [sales, setSales] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chartType, setChartType] = useState('line');
    const [showFilters, setShowFilters] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedMetrics, setSelectedMetrics] = useState(['sales', 'expenses', 'profit']);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
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
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setTimeout(() => setRefreshing(false), 1000);
    };

    // Filter data based on date range
    const getFilteredData = () => {
        let filtered = { sales, expenses };
        
        if (dateRange === 'custom' && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            filtered.sales = sales.filter(s => new Date(s.date) >= start && new Date(s.date) <= end);
            filtered.expenses = expenses.filter(e => new Date(e.date) >= start && new Date(e.date) <= end);
        } else {
            const now = new Date();
            let start = new Date();
            
            switch(dateRange) {
                case 'today':
                    start.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    start.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    start.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    start.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    start.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    return filtered;
            }
            
            filtered.sales = sales.filter(s => new Date(s.date) >= start);
            filtered.expenses = expenses.filter(e => new Date(e.date) >= start);
        }
        
        return filtered;
    };

    const filtered = getFilteredData();
    const totalSales = filtered.sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = filtered.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalSales - totalExpenses;
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0;

    // Sales by date
    const salesByDate = {};
    filtered.sales.forEach(sale => {
        const date = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        salesByDate[date] = (salesByDate[date] || 0) + sale.amount;
    });

    const trendData = Object.entries(salesByDate).map(([date, amount]) => ({
        date,
        sales: amount,
        expenses: filtered.expenses
            .filter(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === date)
            .reduce((acc, curr) => acc + curr.amount, 0)
    }));

    // Sales by month
    const salesByMonth = {};
    filtered.sales.forEach(sale => {
        const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
        salesByMonth[month] = (salesByMonth[month] || 0) + sale.amount;
    });

    const monthlyData = Object.entries(salesByMonth).map(([month, amount]) => ({
        month,
        sales: amount
    }));

    // Expenses by category
    const expensesByCategory = {};
    filtered.expenses.forEach(expense => {
        expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    const categoryData = Object.entries(expensesByCategory).map(([category, amount]) => ({
        name: category,
        value: amount
    }));

    // Inventory value by category
    const inventoryByCategory = {};
    inventory.forEach(item => {
        const category = item.category || 'general';
        const value = (item.quantity * (item.price || 0));
        inventoryByCategory[category] = (inventoryByCategory[category] || 0) + value;
    });

    const inventoryData = Object.entries(inventoryByCategory).map(([category, value]) => ({
        name: category,
        value
    }));

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    const formatPercentage = (value) => {
        return `${value}%`;
    };

    const getTrend = (current, previous) => {
        if (previous === 0) return { value: 100, positive: true };
        const change = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(change).toFixed(1),
            positive: change >= 0
        };
    };

    // Calculate previous period for comparison
    const previousPeriodSales = sales.length > filtered.sales.length ? 
        sales.slice(0, filtered.sales.length).reduce((acc, curr) => acc + curr.amount, 0) : 0;
    const salesTrend = getTrend(totalSales, previousPeriodSales);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-center text-secondary-600">Loading reports...</div>
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
                        Reports & Analytics
                    </h1>
                    <p className="text-secondary-600 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        View insights about your business performance
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
                        <Printer size={18} />
                        <span className="text-sm font-medium">Print</span>
                    </button>

                    <button className="px-4 py-2.5 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition flex items-center gap-2 text-secondary-600">
                        <Mail size={18} />
                        <span className="text-sm font-medium">Email</span>
                    </button>

                    <button className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200">
                        <Download size={18} />
                        <span className="text-sm font-medium">Export</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Date Range Selector */}
                    <div className="flex items-center gap-2 bg-secondary-50 px-4 py-2.5 rounded-xl">
                        <Calendar size={18} className="text-secondary-400" />
                        <select 
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium text-secondary-600"
                        >
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="quarter">Last 90 Days</option>
                            <option value="year">Last 12 Months</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    {/* Custom Date Range */}
                    {dateRange === 'custom' && (
                        <div className="flex items-center gap-3">
                            <input
                                type="date"
                                className="px-4 py-2.5 bg-secondary-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <span className="text-secondary-400">to</span>
                            <input
                                type="date"
                                className="px-4 py-2.5 bg-secondary-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Chart Type Toggle */}
                    <div className="flex items-center gap-1 bg-secondary-50 rounded-xl p-1">
                        <button
                            onClick={() => setChartType('line')}
                            className={`p-2 rounded-lg transition ${
                                chartType === 'line' 
                                ? 'bg-white text-primary-600 shadow-sm' 
                                : 'text-secondary-400 hover:text-secondary-600'
                            }`}
                        >
                            <LineChart size={18} />
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`p-2 rounded-lg transition ${
                                chartType === 'bar' 
                                ? 'bg-white text-primary-600 shadow-sm' 
                                : 'text-secondary-400 hover:text-secondary-600'
                            }`}
                        >
                            <BarChart3 size={18} />
                        </button>
                        <button
                            onClick={() => setChartType('area')}
                            className={`p-2 rounded-lg transition ${
                                chartType === 'area' 
                                ? 'bg-white text-primary-600 shadow-sm' 
                                : 'text-secondary-400 hover:text-secondary-600'
                            }`}
                        >
                            <AreaChart size={18} />
                        </button>
                    </div>

                    {/* More Filters Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-secondary-50 rounded-xl text-secondary-600 hover:bg-secondary-100 transition"
                    >
                        <Filter size={18} />
                        <span className="text-sm font-medium">More Filters</span>
                        <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-secondary-200">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="sales"
                                    checked={selectedMetrics.includes('sales')}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedMetrics([...selectedMetrics, 'sales']);
                                        } else {
                                            setSelectedMetrics(selectedMetrics.filter(m => m !== 'sales'));
                                        }
                                    }}
                                    className="rounded border-secondary-300 text-primary-600"
                                />
                                <label htmlFor="sales" className="text-sm text-secondary-600">Show Sales</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="expenses"
                                    checked={selectedMetrics.includes('expenses')}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedMetrics([...selectedMetrics, 'expenses']);
                                        } else {
                                            setSelectedMetrics(selectedMetrics.filter(m => m !== 'expenses'));
                                        }
                                    }}
                                    className="rounded border-secondary-300 text-primary-600"
                                />
                                <label htmlFor="expenses" className="text-sm text-secondary-600">Show Expenses</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="profit"
                                    checked={selectedMetrics.includes('profit')}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedMetrics([...selectedMetrics, 'profit']);
                                        } else {
                                            setSelectedMetrics(selectedMetrics.filter(m => m !== 'profit'));
                                        }
                                    }}
                                    className="rounded border-secondary-300 text-primary-600"
                                />
                                <label htmlFor="profit" className="text-sm text-secondary-600">Show Profit</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Total Sales</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{formatCurrency(totalSales)}</h3>
                            <div className="flex items-center gap-1 mt-2">
                                <span className={`text-xs font-medium flex items-center gap-1 ${
                                    salesTrend.positive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {salesTrend.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {salesTrend.value}%
                                </span>
                                <span className="text-xs text-secondary-500">vs previous period</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <ShoppingCart size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Total Expenses</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{formatCurrency(totalExpenses)}</h3>
                            <p className="text-xs text-secondary-500 mt-2">
                                {((totalExpenses/totalSales)*100).toFixed(1)}% of revenue
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                            <TrendingDown size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Net Profit</p>
                            <h3 className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(netProfit)}
                            </h3>
                            <p className="text-xs text-secondary-500 mt-2">
                                {filtered.sales.length + filtered.expenses.length} transactions
                            </p>
                        </div>
                        <div className={`w-14 h-14 bg-gradient-to-br ${netProfit >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-2xl flex items-center justify-center shadow-lg ${netProfit >= 0 ? 'shadow-green-500/30' : 'shadow-red-500/30'} group-hover:scale-110 transition-transform`}>
                            <DollarSign size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Profit Margin</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{profitMargin}%</h3>
                            <p className="text-xs text-secondary-500 mt-2">
                                {netProfit >= 0 ? 'Positive' : 'Negative'} cash flow
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                            <TrendingUp size={28} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Trend Chart */}
                <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Revenue Trend</h3>
                            <p className="text-sm text-secondary-500 mt-1">Daily sales performance</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-secondary-100 rounded-lg transition">
                                <Eye size={18} className="text-secondary-500" />
                            </button>
                            <button className="p-2 hover:bg-secondary-100 rounded-lg transition">
                                <MoreVertical size={18} className="text-secondary-500" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="h-80">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'line' && (
                                    <RechartsLine data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="date" tick={{ fill: '#64748b' }} />
                                        <YAxis tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                                        <Tooltip 
                                            formatter={(value) => [`$${value}`, 'Amount']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend />
                                        {selectedMetrics.includes('sales') && (
                                            <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5' }} />
                                        )}
                                        {selectedMetrics.includes('expenses') && (
                                            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444' }} />
                                        )}
                                    </RechartsLine>
                                )}
                                {chartType === 'bar' && (
                                    <BarChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="date" tick={{ fill: '#64748b' }} />
                                        <YAxis tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                                        <Tooltip 
                                            formatter={(value) => [`$${value}`, 'Amount']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend />
                                        {selectedMetrics.includes('sales') && (
                                            <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                        )}
                                        {selectedMetrics.includes('expenses') && (
                                            <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                        )}
                                    </BarChart>
                                )}
                                {chartType === 'area' && (
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="date" tick={{ fill: '#64748b' }} />
                                        <YAxis tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                                        <Tooltip 
                                            formatter={(value) => [`$${value}`, 'Amount']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend />
                                        {selectedMetrics.includes('sales') && (
                                            <Area type="monotone" dataKey="sales" stroke="#4f46e5" fill="url(#colorSales)" />
                                        )}
                                        {selectedMetrics.includes('expenses') && (
                                            <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#colorExpenses)" />
                                        )}
                                    </AreaChart>
                                )}
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-secondary-400">
                                <BarChart3 size={48} className="mb-3 opacity-50" />
                                <p>No data available for selected period</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Expenses by Category Pie Chart */}
                <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Expenses by Category</h3>
                            <p className="text-sm text-secondary-500 mt-1">Breakdown of spending</p>
                        </div>
                    </div>
                    
                    <div className="h-80">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-secondary-400">
                                <PieChart size={48} className="mb-3 opacity-50" />
                                <p>No expense data available</p>
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {categoryData.slice(0, 6).map((item, index) => (
                            <div key={item.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-secondary-600 capitalize">{item.name}</span>
                                <span className="ml-auto font-medium text-secondary-900">
                                    {((item.value / totalExpenses) * 100).toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Value Bar Chart */}
                <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Inventory Value by Category</h3>
                            <p className="text-sm text-secondary-500 mt-1">Stock worth distribution</p>
                        </div>
                    </div>
                    
                    <div className="h-80">
                        {inventoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={inventoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                                    <YAxis tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                                        {inventoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-secondary-400">
                                <Package size={48} className="mb-3 opacity-50" />
                                <p>No inventory data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Key Metrics</h3>
                            <p className="text-sm text-secondary-500 mt-1">Performance indicators</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-secondary-50 to-white rounded-xl hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ShoppingCart size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500">Average Sale Value</p>
                                    <p className="text-lg font-semibold text-secondary-900">
                                        {formatCurrency(filtered.sales.length > 0 ? totalSales / filtered.sales.length : 0)}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-secondary-400">
                                {filtered.sales.length} transactions
                            </span>
                        </div>

                        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-secondary-50 to-white rounded-xl hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <TrendingDown size={20} className="text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500">Average Expense</p>
                                    <p className="text-lg font-semibold text-secondary-900">
                                        {formatCurrency(filtered.expenses.length > 0 ? totalExpenses / filtered.expenses.length : 0)}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-secondary-400">
                                {filtered.expenses.length} transactions
                            </span>
                        </div>

                        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-secondary-50 to-white rounded-xl hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Package size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500">Total Inventory Items</p>
                                    <p className="text-lg font-semibold text-secondary-900">{inventory.length}</p>
                                </div>
                            </div>
                            <span className="text-xs text-secondary-400">
                                {inventory.filter(i => i.quantity <= i.lowStockAlert).length} low stock
                            </span>
                        </div>

                        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-secondary-50 to-white rounded-xl hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500">Profit per Transaction</p>
                                    <p className="text-lg font-semibold text-secondary-900">
                                        {formatCurrency(filtered.sales.length > 0 ? netProfit / filtered.sales.length : 0)}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-secondary-400">
                                Net margin
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
                        <p className="text-sm text-secondary-500 mt-1">Latest transactions</p>
                    </div>
                    <button className="text-primary-600 text-sm font-medium hover:underline">
                        View All
                    </button>
                </div>

                <div className="space-y-3">
                    {[...filtered.sales.slice(0, 3), ...filtered.expenses.slice(0, 3)]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 5)
                        .map((item, index) => {
                            const isSale = item.productName;
                            return (
                                <div key={index} className="flex items-center gap-4 p-3 hover:bg-secondary-50 rounded-xl transition-all group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                        isSale ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                        {isSale ? (
                                            <TrendingUp size={20} className="text-green-600" />
                                        ) : (
                                            <TrendingDown size={20} className="text-red-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-secondary-900">
                                                {item.productName || item.title || item.description}
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                isSale ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {isSale ? 'Sale' : 'Expense'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-secondary-500 mt-1">
                                            {new Date(item.date).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className={`font-bold text-lg ${
                                        isSale ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {isSale ? '+' : '-'}{formatCurrency(item.amount)}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default Reports;