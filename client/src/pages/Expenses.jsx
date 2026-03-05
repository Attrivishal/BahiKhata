import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, TrendingDown, Tag, Edit, Trash2, Filter, Download } from 'lucide-react';
import api from '../services/api';
import StatsCard from '../components/common/StatsCard';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [newExpense, setNewExpense] = useState({ 
        title: '',
        amount: '',
        category: 'supplies',
        paymentMethod: 'cash'
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', newExpense);
            setShowAddModal(false);
            setNewExpense({ title: '', amount: '', category: 'supplies', paymentMethod: 'cash' });
            fetchExpenses();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleEditExpense = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/expenses/${selectedExpense._id}`, selectedExpense);
            setShowEditModal(false);
            setSelectedExpense(null);
            fetchExpenses();
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleDeleteExpense = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await api.delete(`/expenses/${id}`);
                fetchExpenses();
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    const expensesByCategory = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    // Filter expenses
    const filteredExpenses = filterCategory === 'all' 
        ? expenses 
        : expenses.filter(exp => exp.category === filterCategory);

    // Table columns
    const columns = [
        { header: 'Title', accessor: 'title' },
        { 
            header: 'Category', 
            cell: (row) => (
                <span className="badge badge-info capitalize">{row.category}</span>
            )
        },
        { 
            header: 'Amount', 
            cell: (row) => (
                <span className="font-semibold text-red-600">${row.amount.toFixed(2)}</span>
            )
        },
        { 
            header: 'Payment', 
            cell: (row) => (
                <span className="badge badge-success capitalize">{row.paymentMethod}</span>
            )
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
                            setSelectedExpense(row);
                            setShowEditModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={() => handleDeleteExpense(row._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
                    <h1 className="text-3xl font-bold text-slate-800">Expense Management</h1>
                    <p className="text-slate-500 mt-1">Track and manage your business expenses</p>
                </div>
                
                <div className="flex gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <Download size={18} />
                        Export
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Expense
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Expenses"
                    value={expenses.length}
                    icon={DollarSign}
                    color="blue"
                />
                
                <StatsCard
                    title="Total Amount"
                    value={`$${totalExpenses.toFixed(2)}`}
                    icon={TrendingDown}
                    color="red"
                />
                
                <StatsCard
                    title="Categories"
                    value={Object.keys(expensesByCategory).length}
                    icon={Tag}
                    color="purple"
                />
            </div>

            {/* Category Breakdown */}
            {Object.keys(expensesByCategory).length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Expenses by Category</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(expensesByCategory).map(([category, amount]) => (
                            <div key={category} className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-sm text-slate-500 capitalize mb-1">{category}</p>
                                <p className="text-xl font-bold text-slate-800">${amount.toFixed(2)}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {((amount / totalExpenses) * 100).toFixed(1)}% of total
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                    <Filter size={18} className="text-slate-400" />
                    <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-transparent outline-none text-sm"
                    >
                        <option value="all">All Categories</option>
                        <option value="supplies">Supplies</option>
                        <option value="rent">Rent</option>
                        <option value="utilities">Utilities</option>
                        <option value="salary">Salary</option>
                        <option value="marketing">Marketing</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <span className="text-sm text-slate-500">
                    Showing {filteredExpenses.length} of {expenses.length} expenses
                </span>
            </div>

            {/* Expenses Table */}
            <Table 
                columns={columns}
                data={filteredExpenses}
                emptyMessage="No expenses found. Click 'Add Expense' to create one."
            />

            {/* Add Expense Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Expense">
                <form onSubmit={handleAddExpense} className="space-y-4">
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="e.g., Office supplies, Rent"
                            value={newExpense.title}
                            onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="form-input"
                            placeholder="0.00"
                            value={newExpense.amount}
                            onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                className="form-input"
                                value={newExpense.category}
                                onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                            >
                                <option value="supplies">Supplies</option>
                                <option value="rent">Rent</option>
                                <option value="utilities">Utilities</option>
                                <option value="salary">Salary</option>
                                <option value="marketing">Marketing</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Payment Method</label>
                            <select
                                className="form-input"
                                value={newExpense.paymentMethod}
                                onChange={e => setNewExpense({...newExpense, paymentMethod: e.target.value})}
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 btn-primary">
                            Add Expense
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Expense Modal */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Expense">
                {selectedExpense && (
                    <form onSubmit={handleEditExpense} className="space-y-4">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                required
                                className="form-input"
                                value={selectedExpense.title}
                                onChange={e => setSelectedExpense({...selectedExpense, title: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="form-input"
                                value={selectedExpense.amount}
                                onChange={e => setSelectedExpense({...selectedExpense, amount: parseFloat(e.target.value) || 0})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input"
                                    value={selectedExpense.category}
                                    onChange={e => setSelectedExpense({...selectedExpense, category: e.target.value})}
                                >
                                    <option value="supplies">Supplies</option>
                                    <option value="rent">Rent</option>
                                    <option value="utilities">Utilities</option>
                                    <option value="salary">Salary</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Payment Method</label>
                                <select
                                    className="form-input"
                                    value={selectedExpense.paymentMethod}
                                    onChange={e => setSelectedExpense({...selectedExpense, paymentMethod: e.target.value})}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 btn-primary">
                                Update Expense
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Expenses;