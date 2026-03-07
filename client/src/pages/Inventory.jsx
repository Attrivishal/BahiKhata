// src/pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import { 
    Package, Plus, AlertTriangle, Edit, Trash2, Filter, Download, Upload, 
    Search, Barcode, TrendingUp, Clock, MoreVertical, Eye, EyeOff,
    RefreshCw, DollarSign, Box, Layers, ShoppingCart, X, CheckCircle,
    AlertCircle
} from 'lucide-react';
import api from '../services/api';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [refreshing, setRefreshing] = useState(false);
    const [showStats, setShowStats] = useState(true);
    
    const [newItem, setNewItem] = useState({ 
        itemName: '', 
        quantity: '',
        lowStockAlert: '',
        category: 'general',
        unit: 'pcs',
        price: '',
        description: '',
        sku: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get('/inventory');
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchInventory();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory', newItem);
            setShowAddModal(false);
            setNewItem({ 
                itemName: '', quantity: '', lowStockAlert: '', 
                category: 'general', unit: 'pcs', price: '', 
                description: '', sku: '' 
            });
            fetchInventory();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/inventory/${selectedItem._id}`, selectedItem);
            setShowEditModal(false);
            setSelectedItem(null);
            fetchInventory();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/inventory/${id}`);
                fetchInventory();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    // Calculate statistics
    const totalItems = inventory.length;
    const totalQuantity = inventory.reduce((acc, curr) => acc + curr.quantity, 0);
    const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockAlert);
    const outOfStockItems = inventory.filter(item => item.quantity === 0);
    const totalValue = inventory.reduce((acc, curr) => acc + (curr.quantity * (curr.price || 0)), 0);
    
    const categoryBreakdown = inventory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {});

    // Filter inventory
    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (!matchesSearch) return false;
        
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
        
        switch(stockFilter) {
            case 'low':
                return item.quantity <= item.lowStockAlert && item.quantity > 0;
            case 'out':
                return item.quantity === 0;
            case 'normal':
                return item.quantity > item.lowStockAlert;
            default:
                return true;
        }
    });

    const getStockStatus = (item) => {
        if (item.quantity === 0) return { label: 'Out of Stock', color: 'red', icon: AlertCircle };
        if (item.quantity <= item.lowStockAlert) return { label: 'Low Stock', color: 'yellow', icon: AlertTriangle };
        return { label: 'In Stock', color: 'green', icon: CheckCircle };
    };

    const getCategoryColor = (category) => {
        const colors = {
            general: 'blue',
            groceries: 'green',
            electronics: 'purple',
            clothing: 'pink',
            furniture: 'orange',
            other: 'gray'
        };
        return colors[category] || 'blue';
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-center text-secondary-600">Loading inventory...</div>
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
                        Inventory Management
                    </h1>
                    <p className="text-secondary-600 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Track and manage your stock levels efficiently
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
                        <Upload size={18} />
                        <span className="text-sm font-medium">Import</span>
                    </button>

                    <button className="px-4 py-2.5 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition flex items-center gap-2 text-secondary-600">
                        <Download size={18} />
                        <span className="text-sm font-medium">Export</span>
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 font-medium"
                    >
                        <Plus size={18} />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Total Items</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{totalItems}</h3>
                            <p className="text-xs text-secondary-500 mt-3">Unique products</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <Package size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Total Quantity</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{totalQuantity}</h3>
                            <p className="text-xs text-secondary-500 mt-3">Units in stock</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                            <Layers size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Inventory Value</p>
                            <h3 className="text-3xl font-bold text-secondary-900">{formatCurrency(totalValue)}</h3>
                            <p className="text-xs text-secondary-500 mt-3">Total worth</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                            <DollarSign size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Low Stock</p>
                            <h3 className="text-3xl font-bold text-yellow-600">{lowStockItems.length}</h3>
                            <p className="text-xs text-secondary-500 mt-3">Need reorder</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                            <AlertTriangle size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Out of Stock</p>
                            <h3 className="text-3xl font-bold text-red-600">{outOfStockItems.length}</h3>
                            <p className="text-xs text-secondary-500 mt-3">Immediate action</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                            <AlertCircle size={28} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            {showStats && Object.keys(categoryBreakdown).length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-900">Category Breakdown</h3>
                            <p className="text-sm text-secondary-500 mt-1">Items by category</p>
                        </div>
                        <button 
                            onClick={() => setShowStats(!showStats)}
                            className="p-2 hover:bg-secondary-100 rounded-lg transition"
                        >
                            <Eye size={18} className="text-secondary-500" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {Object.entries(categoryBreakdown).map(([category, count]) => {
                            const color = getCategoryColor(category);
                            const percentage = ((count / totalItems) * 100).toFixed(1);
                            
                            return (
                                <div key={category} className="flex-1 min-w-[150px]">
                                    <div className="bg-secondary-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-2 py-1 bg-${color}-100 text-${color}-600 rounded-lg text-xs font-medium capitalize`}>
                                                {category}
                                            </span>
                                            <span className="text-lg font-bold text-secondary-900">{count}</span>
                                        </div>
                                        <div className="w-full bg-secondary-200 rounded-full h-2">
                                            <div 
                                                className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-secondary-500 mt-2">{percentage}% of total</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Low Stock Alert Banner */}
            {lowStockItems.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-yellow-800 text-lg">
                                {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} running low on stock
                            </p>
                            <p className="text-sm text-yellow-600">
                                {outOfStockItems.length > 0 ? `${outOfStockItems.length} items are out of stock. ` : ''}
                                Reorder these items to maintain inventory levels.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setStockFilter('low')}
                        className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all shadow-lg shadow-yellow-600/30 whitespace-nowrap"
                    >
                        View Low Stock Items
                    </button>
                </div>
            )}

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                    {/* Stock Filter */}
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-secondary-200 shadow-sm">
                        <Filter size={18} className="text-secondary-400" />
                        <select 
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium text-secondary-600 min-w-[130px]"
                        >
                            <option value="all">All Stock</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                            <option value="normal">Normal Stock</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-secondary-200 shadow-sm">
                        <Box size={18} className="text-secondary-400" />
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium text-secondary-600 min-w-[130px]"
                        >
                            <option value="all">All Categories</option>
                            <option value="general">General</option>
                            <option value="groceries">Groceries</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="furniture">Furniture</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-white border border-secondary-200 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition ${
                                viewMode === 'grid' 
                                ? 'bg-primary-50 text-primary-600' 
                                : 'text-secondary-400 hover:text-secondary-600'
                            }`}
                        >
                            <Layers size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition ${
                                viewMode === 'list' 
                                ? 'bg-primary-50 text-primary-600' 
                                : 'text-secondary-400 hover:text-secondary-600'
                            }`}
                        >
                            <Package size={18} />
                        </button>
                    </div>

                    {/* Barcode Scanner */}
                    <button className="px-4 py-2.5 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition flex items-center gap-2 text-secondary-600">
                        <Barcode size={18} />
                        <span className="text-sm font-medium">Scan Barcode</span>
                    </button>
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
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
                    Showing <span className="font-medium text-secondary-900">{filteredInventory.length}</span> of{' '}
                    <span className="font-medium text-secondary-900">{inventory.length}</span> items
                </p>
                <p className="text-sm font-medium text-secondary-900">
                    Total Value: <span className="text-primary-600">{formatCurrency(
                        filteredInventory.reduce((acc, curr) => acc + (curr.quantity * (curr.price || 0)), 0)
                    )}</span>
                </p>
            </div>

            {/* Inventory Grid/List View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredInventory.length > 0 ? (
                        filteredInventory.map((item) => {
                            const status = getStockStatus(item);
                            const StatusIcon = status.icon;
                            const categoryColor = getCategoryColor(item.category);
                            
                            return (
                                <div key={item._id} className="group bg-white rounded-2xl border border-secondary-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 bg-${categoryColor}-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Package size={24} className={`text-${categoryColor}-600`} />
                                            </div>
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 text-secondary-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteItem(item._id)}
                                                    className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-secondary-900 mb-1">{item.itemName}</h3>
                                            {item.sku && (
                                                <p className="text-xs text-secondary-400">SKU: {item.sku}</p>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-1 bg-${categoryColor}-50 text-${categoryColor}-600 rounded-lg text-xs font-medium capitalize`}>
                                                    {item.category}
                                                </span>
                                                <span className={`px-2 py-1 bg-${status.color}-50 text-${status.color}-600 rounded-lg text-xs font-medium flex items-center gap-1`}>
                                                    <StatusIcon size={12} />
                                                    {status.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-secondary-500">Quantity</span>
                                                <span className={`text-lg font-bold ${
                                                    item.quantity <= item.lowStockAlert ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                    {item.quantity} {item.unit}
                                                </span>
                                            </div>

                                            {item.price > 0 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-secondary-500">Value</span>
                                                    <span className="font-semibold text-secondary-900">
                                                        {formatCurrency(item.quantity * item.price)}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="pt-3 border-t border-secondary-100">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-secondary-400">Alert at</span>
                                                    <span className="font-medium text-secondary-600">{item.lowStockAlert} {item.unit}</span>
                                                </div>
                                                <div className="w-full bg-secondary-100 rounded-full h-1.5 mt-2">
                                                    <div 
                                                        className={`bg-${
                                                            item.quantity <= item.lowStockAlert ? 'yellow' : 'green'
                                                        }-500 h-1.5 rounded-full transition-all duration-500`}
                                                        style={{ 
                                                            width: `${Math.min((item.quantity / (item.lowStockAlert * 2)) * 100, 100)}%` 
                                                        }}
                                                    ></div>
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
                                    <Package size={32} className="text-secondary-400" />
                                </div>
                                <p className="text-secondary-600 font-medium text-lg">No items found</p>
                                <p className="text-sm text-secondary-400 mt-1">Try adjusting your filters or add a new item</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-secondary-50 border-b border-secondary-200">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">Item</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">Category</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">SKU</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-secondary-600">Quantity</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-secondary-600">Alert At</th>
                                    <th className="text-center py-4 px-6 text-sm font-semibold text-secondary-600">Status</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-secondary-600">Value</th>
                                    <th className="text-center py-4 px-6 text-sm font-semibold text-secondary-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.length > 0 ? (
                                    filteredInventory.map((item) => {
                                        const status = getStockStatus(item);
                                        const StatusIcon = status.icon;
                                        const categoryColor = getCategoryColor(item.category);
                                        
                                        return (
                                            <tr key={item._id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="font-medium text-secondary-900">{item.itemName}</p>
                                                        {item.description && (
                                                            <p className="text-xs text-secondary-500 mt-0.5">{item.description}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 bg-${categoryColor}-50 text-${categoryColor}-600 rounded-lg text-xs font-medium capitalize`}>
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm text-secondary-500">{item.sku || '—'}</span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <span className={`font-semibold ${
                                                        item.quantity <= item.lowStockAlert ? 'text-yellow-600' : 'text-green-600'
                                                    }`}>
                                                        {item.quantity} {item.unit}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <span className="text-sm text-secondary-600">{item.lowStockAlert} {item.unit}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-center">
                                                        <span className={`px-3 py-1 bg-${status.color}-50 text-${status.color}-600 rounded-lg text-xs font-medium flex items-center gap-1`}>
                                                            <StatusIcon size={12} />
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <span className="font-medium text-secondary-900">
                                                        {item.price ? formatCurrency(item.quantity * item.price) : '—'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setShowEditModal(true);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteItem(item._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mb-3">
                                                    <Package size={24} className="text-secondary-400" />
                                                </div>
                                                <p className="text-secondary-600 font-medium">No inventory items found</p>
                                                <p className="text-sm text-secondary-400 mt-1">Click 'Add Item' to create one</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 animate-slideUp">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-secondary-900">Add New Inventory Item</h2>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-secondary-100 rounded-lg transition"
                            >
                                <X size={20} className="text-secondary-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddItem} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Item Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        placeholder="e.g., Basmati Rice"
                                        value={newItem.itemName}
                                        onChange={e => setNewItem({...newItem, itemName: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        SKU (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        placeholder="e.g., SKU-001"
                                        value={newItem.sku}
                                        onChange={e => setNewItem({...newItem, sku: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                    placeholder="Optional description"
                                    rows="2"
                                    value={newItem.description}
                                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={newItem.category}
                                        onChange={e => setNewItem({...newItem, category: e.target.value})}
                                    >
                                        <option value="general">General</option>
                                        <option value="groceries">Groceries</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Unit <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={newItem.unit}
                                        onChange={e => setNewItem({...newItem, unit: e.target.value})}
                                    >
                                        <option value="pcs">Pieces</option>
                                        <option value="kg">Kilograms</option>
                                        <option value="g">Grams</option>
                                        <option value="l">Liters</option>
                                        <option value="ml">Milliliters</option>
                                        <option value="box">Box</option>
                                        <option value="pack">Pack</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        placeholder="0"
                                        value={newItem.quantity}
                                        onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Alert At <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        placeholder="10"
                                        value={newItem.lowStockAlert}
                                        onChange={e => setNewItem({...newItem, lowStockAlert: parseInt(e.target.value) || 0})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Price/Unit ($)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                            placeholder="0.00"
                                            value={newItem.price}
                                            onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
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
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Item Modal */}
            {showEditModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 animate-slideUp">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-secondary-900">Edit Inventory Item</h2>
                            <button 
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedItem(null);
                                }}
                                className="p-2 hover:bg-secondary-100 rounded-lg transition"
                            >
                                <X size={20} className="text-secondary-400" />
                            </button>
                        </div>

                        <form onSubmit={handleEditItem} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Item Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={selectedItem.itemName}
                                        onChange={e => setSelectedItem({...selectedItem, itemName: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">SKU</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={selectedItem.sku || ''}
                                        onChange={e => setSelectedItem({...selectedItem, sku: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                    rows="2"
                                    value={selectedItem.description || ''}
                                    onChange={e => setSelectedItem({...selectedItem, description: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={selectedItem.category || 'general'}
                                        onChange={e => setSelectedItem({...selectedItem, category: e.target.value})}
                                    >
                                        <option value="general">General</option>
                                        <option value="groceries">Groceries</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Unit</label>
                                    <select
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={selectedItem.unit || 'pcs'}
                                        onChange={e => setSelectedItem({...selectedItem, unit: e.target.value})}
                                    >
                                        <option value="pcs">Pieces</option>
                                        <option value="kg">Kilograms</option>
                                        <option value="g">Grams</option>
                                        <option value="l">Liters</option>
                                        <option value="ml">Milliliters</option>
                                        <option value="box">Box</option>
                                        <option value="pack">Pack</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={selectedItem.quantity}
                                        onChange={e => setSelectedItem({...selectedItem, quantity: parseInt(e.target.value) || 0})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Alert At</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        value={selectedItem.lowStockAlert}
                                        onChange={e => setSelectedItem({...selectedItem, lowStockAlert: parseInt(e.target.value) || 0})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Price/Unit ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                            value={selectedItem.price || ''}
                                            onChange={e => setSelectedItem({...selectedItem, price: parseFloat(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedItem(null);
                                    }} 
                                    className="flex-1 px-4 py-3 border border-secondary-200 text-secondary-700 font-medium rounded-xl hover:bg-secondary-50 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                                >
                                    Update Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;