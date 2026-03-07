// src/pages/Expenses.jsx
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  TrendingDown,
  Tag,
  Edit,
  Trash2,
  Filter,
  Download,
  Calendar,
  PieChart,
  ArrowUpRight,
  MoreVertical,
  Eye,
  EyeOff,
  CreditCard,
  Wallet,
  Building,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import api from "../services/api";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [showStats, setShowStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "supplies",
    paymentMethod: "cash",
    description: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post("/expenses", newExpense);
      setShowAddModal(false);
      setNewExpense({
        title: "",
        amount: "",
        category: "supplies",
        paymentMethod: "cash",
        description: "",
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
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
      console.error("Error updating expense:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  // Calculations
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const expensesByPayment = expenses.reduce((acc, expense) => {
    acc[expense.paymentMethod] =
      (acc[expense.paymentMethod] || 0) + expense.amount;
    return acc;
  }, {});

  // Current month vs previous month
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses
    .filter((exp) => new Date(exp.date).getMonth() === currentMonth)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthExpenses = expenses
    .filter((exp) => new Date(exp.date).getMonth() === prevMonth)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const expenseTrend =
    prevMonthExpenses > 0
      ? (
          ((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) *
          100
        ).toFixed(1)
      : 0;

  // Filter expenses
  const filteredExpenses = expenses.filter((exp) => {
    // Category filter
    if (filterCategory !== "all" && exp.category !== filterCategory)
      return false;

    // Payment filter
    if (filterPayment !== "all" && exp.paymentMethod !== filterPayment)
      return false;

    // Search filter
    if (
      searchTerm &&
      !exp.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    // Date filter
    if (dateRange !== "all") {
      const expDate = new Date(exp.date);
      const now = new Date();
      const daysDiff = Math.floor((now - expDate) / (1000 * 60 * 60 * 24));

      if (dateRange === "week" && daysDiff > 7) return false;
      if (dateRange === "month" && daysDiff > 30) return false;
      if (dateRange === "quarter" && daysDiff > 90) return false;
    }

    return true;
  });

  // Sort by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // Get top categories
  const topCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const categoryColors = {
    supplies: "blue",
    rent: "purple",
    utilities: "yellow",
    salary: "green",
    marketing: "pink",
    maintenance: "orange",
    other: "gray",
  };

  const paymentIcons = {
    cash: Wallet,
    card: CreditCard,
    bank: Building,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-center text-secondary-600">
            Loading expenses...
          </div>
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
            Expense Management
          </h1>
          <p className="text-secondary-600 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Track and manage your business expenses efficiently
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition-all duration-200 group"
          >
            <RefreshCw
              size={20}
              className={`text-secondary-600 group-hover:rotate-180 transition-all duration-500 ${refreshing ? "animate-spin" : ""}`}
            />
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
            Add Expense
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-secondary-500 mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold text-secondary-900">
                {expenses.length}
              </h3>
              <p className="text-xs text-secondary-500 mt-3">
                All time transactions
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <DollarSign size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-secondary-500 mb-1">Total Amount</p>
              <h3 className="text-3xl font-bold text-red-600">
                ${totalExpenses.toFixed(2)}
              </h3>
              <p className="text-xs text-secondary-500 mt-3 flex items-center gap-1">
                <ArrowUpRight
                  size={14}
                  className={
                    expenseTrend > 0 ? "text-red-500" : "text-green-500"
                  }
                />
                <span
                  className={
                    expenseTrend > 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  {expenseTrend}%
                </span>
                <span>vs last month</span>
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
              <TrendingDown size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-secondary-500 mb-1">Categories</p>
              <h3 className="text-3xl font-bold text-secondary-900">
                {Object.keys(expensesByCategory).length}
              </h3>
              <p className="text-xs text-secondary-500 mt-3">
                Active categories
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <Tag size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-6 border border-secondary-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-secondary-500 mb-1">Average</p>
              <h3 className="text-3xl font-bold text-secondary-900">
                ${(totalExpenses / (expenses.length || 1)).toFixed(2)}
              </h3>
              <p className="text-xs text-secondary-500 mt-3">Per transaction</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <PieChart size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Expenses by Category
              </h3>
              <p className="text-sm text-secondary-500 mt-1">
                Breakdown of your spending
              </p>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition"
            >
              {showStats ? (
                <Eye size={18} className="text-secondary-500" />
              ) : (
                <EyeOff size={18} className="text-secondary-500" />
              )}
            </button>
          </div>

          {showStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topCategories.map(([category, amount]) => {
                const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                const color = categoryColors[category] || "gray";

                return (
                  <div
                    key={category}
                    className="group bg-secondary-50 hover:bg-secondary-100 rounded-xl p-4 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2 py-1 bg-${color}-100 text-${color}-600 rounded-lg text-xs font-medium capitalize`}
                      >
                        {category}
                      </span>
                      <span className="text-sm font-bold text-secondary-900">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-secondary-500">Percentage</span>
                        <span className="font-medium text-secondary-700">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className={`bg-${color}-500 h-2 rounded-full transition-all duration-500 group-hover:scale-105`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-secondary-200 shadow-sm">
            <Filter size={18} className="text-secondary-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium text-secondary-600 min-w-[130px]"
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

          {/* Payment Filter */}
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-secondary-200 shadow-sm">
            <CreditCard size={18} className="text-secondary-400" />
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium text-secondary-600 min-w-[120px]"
            >
              <option value="all">All Payments</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-secondary-200 shadow-sm">
            <Calendar size={18} className="text-secondary-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium text-secondary-600 min-w-[100px]"
            >
              <option value="all">All Time</option>{" "}
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
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
          Showing{" "}
          <span className="font-medium text-secondary-900">
            {sortedExpenses.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-secondary-900">
            {expenses.length}
          </span>{" "}
          expenses
        </p>
        <p className="text-sm font-medium text-secondary-900">
          Total:{" "}
          <span className="text-red-600">
            $
            {filteredExpenses
              .reduce((acc, curr) => acc + curr.amount, 0)
              .toFixed(2)}
          </span>
        </p>
      </div>

      {/* Expenses List/Table */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50 border-b border-secondary-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">
                  Expense
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">
                  Payment
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-secondary-600">
                  Date
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-secondary-600">
                  Amount
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-secondary-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map((expense) => {
                  const PaymentIcon =
                    paymentIcons[expense.paymentMethod] || Wallet;

                  return (
                    <tr
                      key={expense._id}
                      className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-secondary-900">
                            {expense.title}
                          </p>
                          {expense.description && (
                            <p className="text-xs text-secondary-500 mt-0.5">
                              {expense.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 bg-${categoryColors[expense.category] || "gray"}-50 text-${categoryColors[expense.category] || "gray"}-600 rounded-lg text-xs font-medium capitalize`}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <PaymentIcon
                            size={14}
                            className="text-secondary-400"
                          />
                          <span className="text-sm text-secondary-600 capitalize">
                            {expense.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-secondary-400" />
                          <span className="text-sm text-secondary-600">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-bold text-red-600">
                          -${expense.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedExpense(expense);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mb-3">
                        <DollarSign size={24} className="text-secondary-400" />
                      </div>
                      <p className="text-secondary-600 font-medium">
                        No expenses found
                      </p>
                      <p className="text-sm text-secondary-400 mt-1">
                        Click 'Add Expense' to create one
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">
                Add New Expense
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition"
              >
                <X size={20} className="text-secondary-400" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  placeholder="e.g., Office supplies, Rent"
                  value={newExpense.title}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  placeholder="Optional description"
                  rows="2"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Amount ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
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

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    value={newExpense.paymentMethod}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        paymentMethod: e.target.value,
                      })
                    }
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
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
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">
                Edit Expense
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedExpense(null);
                }}
                className="p-2 hover:bg-secondary-100 rounded-lg transition"
              >
                <X size={20} className="text-secondary-400" />
              </button>
            </div>

            <form onSubmit={handleEditExpense} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  value={selectedExpense.title}
                  onChange={(e) =>
                    setSelectedExpense({
                      ...selectedExpense,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  rows="2"
                  value={selectedExpense.description || ""}
                  onChange={(e) =>
                    setSelectedExpense({
                      ...selectedExpense,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    value={selectedExpense.amount}
                    onChange={(e) =>
                      setSelectedExpense({
                        ...selectedExpense,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    value={selectedExpense.category}
                    onChange={(e) =>
                      setSelectedExpense({
                        ...selectedExpense,
                        category: e.target.value,
                      })
                    }
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

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    value={selectedExpense.paymentMethod}
                    onChange={(e) =>
                      setSelectedExpense({
                        ...selectedExpense,
                        paymentMethod: e.target.value,
                      })
                    }
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedExpense(null);
                  }}
                  className="flex-1 px-4 py-3 border border-secondary-200 text-secondary-700 font-medium rounded-xl hover:bg-secondary-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                >
                  Update Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
