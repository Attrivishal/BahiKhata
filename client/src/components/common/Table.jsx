// src/components/common/Table.jsx
import React, { useState, useEffect } from 'react';
import { 
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
    ChevronsLeft, ChevronsRight, Search, X, Filter,
    ArrowUpDown, Download, Eye, Edit, Trash2, MoreVertical
} from 'lucide-react';

const Table = ({ 
    columns, 
    data, 
    loading = false, 
    onRowClick,
    onSelectionChange,
    emptyMessage = "No data found",
    sortable = true,
    filterable = true,
    pagination = true,
    pageSize = 10,
    selectable = false,
    exportable = false,
    searchable = true,
    actions,
    title,
    subtitle,
    className = '',
    rowClassName,
    striped = true,
    hoverable = true,
    compact = false,
    bordered = false
}) => {
    const [tableData, setTableData] = useState(data || []);
    const [filteredData, setFilteredData] = useState(data || []);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [columnFilters, setColumnFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setTableData(data || []);
        setFilteredData(data || []);
    }, [data]);

    // Handle search
    useEffect(() => {
        if (!searchTerm) {
            setFilteredData(tableData);
            return;
        }

        const filtered = tableData.filter(row => {
            return Object.values(row).some(value => 
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, tableData]);

    // Handle sorting
    const handleSort = (key) => {
        if (!sortable) return;

        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sorted = [...filteredData].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredData(sorted);
        setSortConfig({ key, direction });
    };

    // Handle pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = pagination 
        ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : filteredData;

    // Handle row selection
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(paginatedData.map(row => row.id || row._id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        const newSelected = selectedRows.includes(id)
            ? selectedRows.filter(rowId => rowId !== id)
            : [...selectedRows, id];
        setSelectedRows(newSelected);
        onSelectionChange?.(newSelected);
    };

    // Export data
    const exportToCSV = () => {
        const headers = columns.map(col => col.header).join(',');
        const rows = filteredData.map(row => 
            columns.map(col => {
                const value = col.accessor ? row[col.accessor] : col.export?.(row);
                return `"${value}"`;
            }).join(',')
        ).join('\n');
        
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.csv';
        a.click();
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
        }
        return <ArrowUpDown size={14} className="opacity-50" />;
    };

    const sizeClasses = compact ? {
        table: 'text-sm',
        cell: 'px-4 py-2',
        header: 'px-4 py-2 text-xs'
    } : {
        table: 'text-base',
        cell: 'px-6 py-4',
        header: 'px-6 py-3 text-sm'
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-8">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-4 text-secondary-600">Loading data...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-8">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-secondary-400" />
                    </div>
                    <p className="text-secondary-600 font-medium">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl border ${bordered ? 'border-secondary-200' : 'border-secondary-100'} shadow-sm overflow-hidden ${className}`}>
            {/* Table Header */}
            {(title || searchable || exportable) && (
                <div className="p-4 border-b border-secondary-200 bg-secondary-50/50">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            {title && <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>}
                            {subtitle && <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {searchable && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-white border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64"
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
                            )}
                            
                            {filterable && (
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`p-2 rounded-lg transition ${
                                        showFilters ? 'bg-primary-50 text-primary-600' : 'hover:bg-secondary-100 text-secondary-600'
                                    }`}
                                >
                                    <Filter size={18} />
                                </button>
                            )}
                            
                            {exportable && (
                                <button
                                    onClick={exportToCSV}
                                    className="px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition text-sm font-medium flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    Export
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Column Filters */}
                    {showFilters && filterable && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                            {columns.map((col, idx) => (
                                col.filterable !== false && (
                                    <div key={idx}>
                                        <input
                                            type="text"
                                            placeholder={`Filter ${col.header}`}
                                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setColumnFilters(prev => ({
                                                    ...prev,
                                                    [col.accessor || col.header]: value
                                                }));
                                            }}
                                        />
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className={`w-full ${sizeClasses.table}`}>
                    <thead>
                        <tr className="bg-secondary-50 border-b border-secondary-200">
                            {selectable && (
                                <th className={`${sizeClasses.header} text-left font-semibold text-secondary-600`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                    />
                                </th>
                            )}
                            
                            {columns.map((column, index) => (
                                <th 
                                    key={index} 
                                    className={`${sizeClasses.header} text-left font-semibold text-secondary-600 ${
                                        sortable && column.sortable !== false ? 'cursor-pointer hover:text-secondary-900' : ''
                                    }`}
                                    onClick={() => sortable && column.sortable !== false && handleSort(column.accessor)}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.header}
                                        {sortable && column.sortable !== false && (
                                            <span className="text-secondary-400">
                                                {getSortIcon(column.accessor)}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            
                            {actions && <th className={`${sizeClasses.header} text-right`}>Actions</th>}
                        </tr>
                    </thead>
                    
                    <tbody>
                        {paginatedData.map((row, rowIndex) => (
                            <tr 
                                key={rowIndex}
                                onClick={() => onRowClick?.(row)}
                                className={`
                                    border-b border-secondary-100 last:border-0 transition-colors
                                    ${striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-secondary-50/30'}
                                    ${hoverable ? 'hover:bg-secondary-100' : ''}
                                    ${onRowClick ? 'cursor-pointer' : ''}
                                    ${rowClassName ? rowClassName(row) : ''}
                                `}
                            >
                                {selectable && (
                                    <td className={sizeClasses.cell}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row.id || row._id)}
                                            onChange={() => handleSelectRow(row.id || row._id)}
                                            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                        />
                                    </td>
                                )}
                                
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className={sizeClasses.cell}>
                                        {column.accessor ? row[column.accessor] : column.cell?.(row)}
                                    </td>
                                ))}
                                
                                {actions && (
                                    <td className={`${sizeClasses.cell} text-right`}>
                                        <div className="flex items-center justify-end gap-2">
                                            {actions.map((action, idx) => {
                                                if (action.condition && !action.condition(row)) return null;
                                                
                                                const Icon = action.icon;
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            action.onClick(row);
                                                        }}
                                                        className={`p-2 rounded-lg transition-colors ${action.className || 'text-secondary-600 hover:bg-secondary-100'}`}
                                                        title={action.label}
                                                    >
                                                        {typeof Icon === 'function' ? <Icon size={16} /> : Icon}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200 bg-secondary-50/50">
                    <div className="text-sm text-secondary-600">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronsLeft size={18} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        
                        <span className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight size={18} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronsRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Compact Table Variant
export const CompactTable = (props) => (
    <Table {...props} compact={true} bordered={true} />
);

// Simple Table Variant
export const SimpleTable = (props) => (
    <Table {...props} pagination={false} searchable={false} exportable={false} />
);

// Editable Table Cell
export const EditableCell = ({ value, onSave, type = 'text' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
        onSave(editValue);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                {type === 'number' ? (
                    <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        autoFocus
                    />
                ) : (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        autoFocus
                    />
                )}
                <button
                    onClick={handleSave}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                    ✓
                </button>
                <button
                    onClick={() => setIsEditing(false)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div 
            className="group flex items-center gap-2 cursor-pointer"
            onClick={() => setIsEditing(true)}
        >
            <span>{value}</span>
            <Edit size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-secondary-400" />
        </div>
    );
};

// Table with Expandable Rows
export const ExpandableTable = ({ columns, data, renderExpanded, ...props }) => {
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (rowId) => {
        setExpandedRows(prev =>
            prev.includes(rowId)
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId]
        );
    };

    const expandedColumns = [
        {
            header: '',
            cell: (row) => (
                <button
                    onClick={() => toggleRow(row.id || row._id)}
                    className="p-1 hover:bg-secondary-100 rounded"
                >
                    <ChevronDown 
                        size={16}
                        className={`transform transition-transform ${
                            expandedRows.includes(row.id || row._id) ? 'rotate-180' : ''
                        }`}
                    />
                </button>
            ),
            width: '40px'
        },
        ...columns
    ];

    return (
        <div className="space-y-2">
            <Table columns={expandedColumns} data={data} {...props} />
            {data.map(row => (
                expandedRows.includes(row.id || row._id) && (
                    <div key={row.id || row._id} className="ml-8 p-4 bg-secondary-50 rounded-xl border border-secondary-200">
                        {renderExpanded(row)}
                    </div>
                )
            ))}
        </div>
    );
};

export default Table;