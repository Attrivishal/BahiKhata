import React from 'react';
import { Loader2 } from 'lucide-react';

const Table = ({ 
  columns, 
  data, 
  loading = false, 
  onRowClick,
  emptyMessage = "No data found"
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.accessor ? row[column.accessor] : column.cell?.(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
