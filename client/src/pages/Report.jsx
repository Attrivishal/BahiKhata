import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart } from 'lucide-react';
import api from '../services/api';
import StatsCard from '../components/common/StatsCard';
import Loader from '../components/common/Loader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const Reports = () => {
    const [sales, setSales] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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

    // Filter data based on date range
    const getFilteredData = () => {
        let filtered = { sales, expenses };
        
        if (dateRange === 'custom' && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            filtered.sales = sales.filter(s => new Date(s.date) >= start && new Date(s.date) <= end);
            filtered.expenses = expenses.filter(e => new Date(e.date) >= start && new Date(e.date) <= end);
        }
        
        return filtered;
    };

    const filtered = getFilteredData();
    const totalSales = filtered.sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = filtered.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalSales - totalExpenses;
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0;

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

    const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
                    <p className="text-slate-500 mt-1">View insights about your business performance</p>
                </div>
                
                <button className="btn-primary flex items-center gap-2">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Date Filter */}
            <div className="card flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-slate-400" />
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                {dateRange === 'custom' && (
                    <div className="flex gap-3">
                        <input
                            type="date"
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span className="text-slate-400">to</span>
                        <input
                            type="date"
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Sales"
                    value={`$${totalSales.toFixed(2)}`}
                    icon={ShoppingCart}
                    color="blue"
                />
                
                <StatsCard
                    title="Total Expenses"
                    value={`$${totalExpenses.toFixed(2)}`}
                    icon={TrendingDown}
                    color="red"
                />
                
                <StatsCard
                    title="Net Profit"
                    value={`$${netProfit.toFixed(2)}`}
                    icon={DollarSign}
                    color={netProfit >= 0 ? "green" : "red"}
                />
                
                <StatsCard
                    title="Profit Margin"
                    value={`${profitMargin}%`}
                    icon={TrendingUp}
                    color="purple"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Trend */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Sales Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                                <YAxis tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                                <Tooltip 
                                    formatter={(value) => [`$${value}`, 'Sales']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expenses by Category */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Expenses by Category</h3>
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
                                    <Tooltip formatter={(value) => `$${value}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">
                                No expense data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Inventory Value by Category */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Inventory Value by Category</h3>
                    <div className="h-80">
                        {inventoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={inventoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                                    <YAxis tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip formatter={(value) => `$${value}`} />
                                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">
                                No inventory data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Key Metrics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-600">Average Sale Value</span>
                            <span className="font-bold text-slate-800">
                                ${filtered.sales.length > 0 ? (totalSales / filtered.sales.length).toFixed(2) : 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-600">Average Expense</span>
                            <span className="font-bold text-slate-800">
                                ${filtered.expenses.length > 0 ? (totalExpenses / filtered.expenses.length).toFixed(2) : 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-600">Total Transactions</span>
                            <span className="font-bold text-slate-800">{filtered.sales.length + filtered.expenses.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-600">Inventory Items</span>
                            <span className="font-bold text-slate-800">{inventory.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-600">Low Stock Items</span>
                            <span className="font-bold text-red-600">{inventory.filter(i => i.quantity <= i.lowStockAlert).length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
                <div className="space-y-3">
                    {[...filtered.sales.slice(0, 3), ...filtered.expenses.slice(0, 3)]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 5)
                        .map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    item.productName ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                    {item.productName ? (
                                        <TrendingUp size={20} className="text-green-600" />
                                    ) : (
                                        <TrendingDown size={20} className="text-red-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800">
                                        {item.productName || item.title || item.description}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(item.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className={`font-semibold ${
                                    item.productName ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {item.productName ? '+' : '-'}${item.amount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;