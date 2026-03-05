import React, { useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
    DollarSign, TrendingUp, Package, AlertTriangle, Plus, 
    ShoppingCart, Calendar, ArrowUpRight, ArrowDownRight,
    Wallet, TrendingDown
} from 'lucide-react';
import api from '../services/api';
import StatsCard from '../components/common/StatsCard';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';

const Dashboard = () => {
    const [sales, setSales] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddSale, setShowAddSale] = useState(false);
    const [newSale, setNewSale] = useState({ amount: '', productName: '' });
    const [timeRange, setTimeRange] = useState('week');

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

    // Table columns
    const salesColumns = [
        { header: 'Product', accessor: 'productName' },
        { 
            header: 'Date', 
            cell: (row) => new Date(row.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })
        },
        { 
            header: 'Amount', 
            cell: (row) => (
                <span className="font-semibold text-green-600">+${row.amount.toFixed(2)}</span>
            )
        }
    ];

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back, <span className="font-semibold text-primary">{localStorage.getItem('user')}</span>! Here's what's happening today.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <select 
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                    
                    <button
                        onClick={() => setShowAddSale(true)}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 font-medium"
                    >
                        <Plus size={18} />
                        New Sale
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Sales</p>
                            <h3 className="text-2xl font-bold text-gray-800">${totalSales.toFixed(2)}</h3>
                            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                <ArrowUpRight size={14} />
                                {salesTrend}% from last month
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <DollarSign size={24} className="text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
                            <h3 className="text-2xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</h3>
                            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                <ArrowDownRight size={14} />
                                {(totalExpenses/totalSales*100).toFixed(1)}% of sales
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                            <TrendingDown size={24} className="text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Net Profit</p>
                            <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${netProfit.toFixed(2)}
                            </h3>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <TrendingUp size={14} />
                                Margin: {profitMargin}%
                            </p>
                        </div>
                        <div className={`w-12 h-12 ${netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-xl flex items-center justify-center`}>
                            <Wallet size={24} className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Stock Alerts</p>
                            <h3 className="text-2xl font-bold text-gray-800">{lowStockItems.length}</h3>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <Package size={14} />
                                {inventory.length} total items
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={24} className="text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                                +{salesTrend}% vs last month
                            </span>
                        </div>
                    </div>
                    
                    <div className="h-72">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <YAxis tickFormatter={(val) => `$${val}`} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            borderRadius: '12px', 
                                            border: 'none', 
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
                                        }}
                                        formatter={(value) => [`$${value}`, 'Revenue']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="sales" 
                                        stroke="#2563eb" 
                                        strokeWidth={2}
                                        fill="url(#colorSales)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                No sales data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h3>
                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                            {lowStockItems.length} items
                        </span>
                    </div>

                    <div className="space-y-4">
                        {lowStockItems.length > 0 ? (
                            lowStockItems.slice(0, 5).map(item => (
                                <div key={item._id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <Package size={16} className="text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{item.itemName}</p>
                                            <p className="text-xs text-gray-500">Alert: {item.lowStockAlert}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-red-600">{item.quantity}</span>
                                        <p className="text-xs text-gray-400">left</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Package size={24} className="text-green-600" />
                                </div>
                                <p className="text-gray-600 font-medium">All stock levels normal</p>
                                <p className="text-sm text-gray-400 mt-1">No low stock alerts</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Sales Table */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Sales</h3>
                    <button className="text-primary text-sm font-medium hover:underline">
                        View All →
                    </button>
                </div>

                <Table 
                    columns={salesColumns}
                    data={sales.slice(0, 5)}
                    emptyMessage="No recent sales found"
                />
            </div>

            {/* Add Sale Modal */}
            <Modal isOpen={showAddSale} onClose={() => setShowAddSale(false)} title="Record New Sale">
                <form onSubmit={handleAddSale} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="e.g., Organic Rice"
                            value={newSale.productName}
                            onChange={e => setNewSale({ ...newSale, productName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="0.00"
                            value={newSale.amount}
                            onChange={e => setNewSale({ ...newSale, amount: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowAddSale(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/30"
                        >
                            Save Sale
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;