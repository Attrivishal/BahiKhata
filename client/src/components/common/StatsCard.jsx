import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'blue', bgColor = 'blue' }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'text-green-600'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      icon: 'text-red-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      icon: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: 'text-purple-600'
    }
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="card hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend > 0 ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}% from last month
              </span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-xl ${selectedColor.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className={selectedColor.icon} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
