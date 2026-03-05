import React, { useState, useEffect } from 'react';
import { 
    ShoppingCart, Plus, TrendingUp, Calendar, Edit, Trash2, 
    Filter, Download, Printer, CreditCard, Wallet, Search
} from 'lucide-react';
import api from '../services/api';
import StatsCard from '../components/common/StatsCard';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [newSale, setNewSale] = useState({ 
        productName: '', 
        amount: '',
        customerName: '',
        paymentMethod: 'cash',
        quantity: 1
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

    const handleAddSale = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sales', newSale);
            setShowAddModal(false);
            setNewSale({ productName: '', amount: '', customerName: '', paymentMethod: 'cash', quantity: 1 });
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

    const totalRevenue = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalTransactions = sales.length;
    const averageSale = totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : 0;
    
    const today = new Date().toDateString();
    const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === today)
        .reduce((acc, curr) => acc + curr.amount, 0);

    const paymentMethods = sales.reduce((acc, sale) => {
        const method = sale.paymentMethod || 'cash';
        acc[method] = (acc[method] || 0) + sale.amount;
        return acc;
    }, {});

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

    const columns = [
        { 
            header: 'Product', 
            cell: (row) => (
                <div>
                    <p className="font-medium text-gray-800">{row.productName}</p>
                    {row.quantity > 1 && (
                        <p className="text-xs text-gray-400">Qty: {row.quantity}</p>
                    )}
                </div>
            )
        },
        { 
            header: 'Customer', 
            cell: (row) => row.customerName || '—'
        },
        { 
            header: 'Amount', 
            cell: (row) => (
                <span className="font-semibold text-green-600">+${row.amount.toFixed(2)}</span>
            )
        },
        { 
            header: 'Payment', 
            cell: (row) => {
                const method = row.paymentMethod || 'cash';
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1
                        ${method === 'cash' ? 'bg-green-50 text-green-700' : 
                          method === 'card' ? 'bg-blue-50 text-blue-700' : 
                          'bg-purple-50 text-purple-700'}`}>
                        {method === 'cash' && <Wallet size={12} />}
                        {method === 'card' && <CreditCard size={12} />}
                        {method}
                    </span>
                );
            }
        },
        { 
            header: 'Date', 
            cell: (row) => new Date(row.date).toLocaleDateString()
        },
        {
            header: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button 
                        onClick={() => {
                            setSelectedSale(row);
                            setShowEditModal(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={() => handleDeleteSale(row._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <Printer size={16} />
                    </button>
                </div>
            )
        }
    ];

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
                    <p className="text-gray-500 mt-1">Track and manage all your sales transactions</p>
                </div>
                
                <div className="flex gap-3">
                    <button className="px-4 py-2.5 border border-gray-300 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition">
                        <Download size={18} />
                        Export
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition shadow-lg shadow-primary/30"
                    >
                        <Plus size={18} />
                        New Sale
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Today's Sales</p>
                    <p className="text-2xl font-bold text-gray-800">${todaySales.toFixed(2)}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Transactions</p>
                    <p className="text-2xl font-bold text-gray-800">{totalTransactions}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Average Sale</p>
                    <p className="text-2xl font-bold text-gray-800">${averageSale}</p>
                </div>
            </div>

            {/* Payment Methods */}
            {Object.keys(paymentMethods).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(paymentMethods).map(([method, amount]) => (
                        <div key={method} className="bg-white rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {method === 'cash' && <Wallet className="text-green-600" size={20} />}
                                    {method === 'card' && <CreditCard className="text-blue-600" size={20} />}
                                    <span className="font-medium capitalize text-gray-700">{method}</span>
                                </div>
                                <span className="font-bold text-gray-800">${amount.toFixed(2)}</span>
                            </div>
                            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${
                                        method === 'cash' ? 'bg-green-500' : 
                                        method === 'card' ? 'bg-blue-500' : 'bg-purple-500'
                                    }`}
                                    style={{ width: `${(amount / totalRevenue) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{((amount / totalRevenue) * 100).toFixed(1)}% of total</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center">
                    <select 
                        value={filterPeriod}
                        onChange={(e) => setFilterPeriod(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                    
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <span className="text-sm text-gray-500">
                    Showing {filteredSales.length} of {sales.length} sales
                </span>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table 
                    columns={columns}
                    data={filteredSales}
                    emptyMessage="No sales found"
                />
            </div>

            {/* Add Sale Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Sale">
                <form onSubmit={handleAddSale} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={newSale.productName}
                        onChange={e => setNewSale({...newSale, productName: e.target.value})}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        step="0.01"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={newSale.amount}
                        onChange={e => setNewSale({...newSale, amount: parseFloat(e.target.value)})}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Customer Name (Optional)"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={newSale.customerName}
                        onChange={e => setNewSale({...newSale, customerName: e.target.value})}
                    />
                    <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={newSale.paymentMethod}
                        onChange={e => setNewSale({...newSale, paymentMethod: e.target.value})}
                    >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                    </select>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90">
                            Add Sale
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Sale">
                {selectedSale && (
                    <form onSubmit={handleEditSale} className="space-y-4">
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            value={selectedSale.productName}
                            onChange={e => setSelectedSale({...selectedSale, productName: e.target.value})}
                            required
                        />
                        <input
                            type="number"
                            step="0.01"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            value={selectedSale.amount}
                            onChange={e => setSelectedSale({...selectedSale, amount: parseFloat(e.target.value)})}
                            required
                        />
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg">
                                Update
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Sales;