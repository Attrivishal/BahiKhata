import React, { useState, useEffect } from 'react';
import { Package, Plus, AlertTriangle, Edit, Trash2, Filter, Download, Upload, Search, Barcode, TrendingUp, Clock } from 'lucide-react';
import api from '../services/api';
import StatsCard from '../components/common/StatsCard';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('all'); // all, low, normal
    const [newItem, setNewItem] = useState({ 
        itemName: '', 
        quantity: '',
        lowStockAlert: '',
        category: 'general',
        unit: 'pcs',
        price: ''
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

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory', newItem);
            setShowAddModal(false);
            setNewItem({ itemName: '', quantity: '', lowStockAlert: '', category: 'general', unit: 'pcs', price: '' });
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
    const totalValue = inventory.reduce((acc, curr) => acc + (curr.quantity * (curr.price || 0)), 0);

    // Filter inventory
    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;
        
        switch(stockFilter) {
            case 'low':
                return item.quantity <= item.lowStockAlert;
            case 'normal':
                return item.quantity > item.lowStockAlert;
            default:
                return true;
        }
    });

    // Table columns
    const columns = [
        { 
            header: 'Item Name', 
            cell: (row) => (
                <div>
                    <p className="font-medium text-slate-800">{row.itemName}</p>
                    <p className="text-xs text-slate-400">{row.category} • {row.unit}</p>
                </div>
            )
        },
        { 
            header: 'Quantity', 
            cell: (row) => (
                <div>
                    <p className={`font-semibold ${row.quantity <= row.lowStockAlert ? 'text-red-600' : 'text-green-600'}`}>
                        {row.quantity} {row.unit}
                    </p>
                    {row.price && (
                        <p className="text-xs text-slate-400">Value: ${(row.quantity * row.price).toFixed(2)}</p>
                    )}
                </div>
            )
        },
        { 
            header: 'Alert At', 
            cell: (row) => (
                <span className="text-sm">{row.lowStockAlert} {row.unit}</span>
            )
        },
        { 
            header: 'Status', 
            cell: (row) => {
                const isLow = row.quantity <= row.lowStockAlert;
                return (
                    <span className={`badge ${isLow ? 'badge-danger' : 'badge-success'}`}>
                        {isLow ? 'Low Stock' : 'In Stock'}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button 
                        onClick={() => {
                            setSelectedItem(row);
                            setShowEditModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={() => handleDeleteItem(row._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                    >
                        <Trash2 size={16} />
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
                    <h1 className="text-3xl font-bold text-slate-800">Inventory Management</h1>
                    <p className="text-slate-500 mt-1">Track and manage your stock levels</p>
                </div>
                
                <div className="flex gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <Upload size={18} />
                        Import
                    </button>
                    <button className="btn-secondary flex items-center gap-2">
                        <Download size={18} />
                        Export
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Items"
                    value={totalItems}
                    icon={Package}
                    color="blue"
                />
                
                <StatsCard
                    title="Total Quantity"
                    value={totalQuantity}
                    icon={TrendingUp}
                    color="green"
                />
                
                <StatsCard
                    title="Low Stock Items"
                    value={lowStockItems.length}
                    icon={AlertTriangle}
                    color="red"
                />
                
                <StatsCard
                    title="Inventory Value"
                    value={`$${totalValue.toFixed(2)}`}
                    icon={Package}
                    color="purple"
                />
            </div>

            {/* Low Stock Alert Banner */}
            {lowStockItems.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-red-800">
                                {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} running low on stock
                            </p>
                            <p className="text-sm text-red-600">
                                Reorder these items to maintain inventory levels.
                            </p>
                        </div>
                    </div>
                    <button className="btn-primary bg-red-600 hover:bg-red-700">
                        View Items
                    </button>
                </div>
            )}

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                        <Filter size={18} className="text-slate-400" />
                        <select 
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="bg-transparent outline-none text-sm"
                        >
                            <option value="all">All Items</option>
                            <option value="low">Low Stock Only</option>
                            <option value="normal">Normal Stock</option>
                        </select>
                    </div>
                    
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center">
                        <Search size={18} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="bg-transparent outline-none text-sm w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className="btn-secondary flex items-center gap-2">
                        <Barcode size={18} />
                        Scan Barcode
                    </button>
                </div>
                
                <span className="text-sm text-slate-500">
                    Showing {filteredInventory.length} of {inventory.length} items
                </span>
            </div>

            {/* Inventory Table */}
            <Table 
                columns={columns}
                data={filteredInventory}
                emptyMessage="No inventory items found. Click 'Add Item' to create one."
            />

            {/* Add Item Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Inventory Item">
                <form onSubmit={handleAddItem} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Item Name</label>
                            <input
                                type="text"
                                required
                                className="form-input"
                                placeholder="e.g., Basmati Rice"
                                value={newItem.itemName}
                                onChange={e => setNewItem({...newItem, itemName: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                className="form-input"
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
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                min="0"
                                required
                                className="form-input"
                                placeholder="0"
                                value={newItem.quantity}
                                onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Unit</label>
                            <select
                                className="form-input"
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

                        <div className="form-group">
                            <label className="form-label">Alert At</label>
                            <input
                                type="number"
                                min="1"
                                required
                                className="form-input"
                                placeholder="10"
                                value={newItem.lowStockAlert}
                                onChange={e => setNewItem({...newItem, lowStockAlert: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Price per unit ($) (Optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-input"
                            placeholder="0.00"
                            value={newItem.price}
                            onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 btn-primary">
                            Add Item
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Item Modal */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Inventory Item">
                {selectedItem && (
                    <form onSubmit={handleEditItem} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    value={selectedItem.itemName}
                                    onChange={e => setSelectedItem({...selectedItem, itemName: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input"
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
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="form-group">
                                <label className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    className="form-input"
                                    value={selectedItem.quantity}
                                    onChange={e => setSelectedItem({...selectedItem, quantity: parseInt(e.target.value) || 0})}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Unit</label>
                                <select
                                    className="form-input"
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

                            <div className="form-group">
                                <label className="form-label">Alert At</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    className="form-input"
                                    value={selectedItem.lowStockAlert}
                                    onChange={e => setSelectedItem({...selectedItem, lowStockAlert: parseInt(e.target.value) || 0})}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Price per unit ($) (Optional)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="form-input"
                                value={selectedItem.price || ''}
                                onChange={e => setSelectedItem({...selectedItem, price: parseFloat(e.target.value) || 0})}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 btn-primary">
                                Update Item
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Inventory;