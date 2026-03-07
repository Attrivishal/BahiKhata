// src/components/common/StatsCard.jsx
import React from 'react';
import { 
    TrendingUp, TrendingDown, Minus, MoreVertical, 
    Eye, EyeOff, RefreshCw, ArrowUpRight, ArrowDownRight,
    Info
} from 'lucide-react';

const StatsCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendLabel = 'vs last month',
    color = 'primary',
    variant = 'default', // default, gradient, bordered, minimal
    size = 'md', // sm, md, lg
    loading = false,
    subtitle,
    footer,
    actions,
    onClick,
    className = '',
    tooltip,
    chart,
    progress,
    comparison,
    precision = 2,
    formatValue = (val) => val
}) => {
    const colorClasses = {
        primary: {
            bg: 'bg-primary-50',
            text: 'text-primary-600',
            icon: 'text-primary-600',
            gradient: 'from-primary-500 to-primary-600',
            light: 'bg-primary-100',
            border: 'border-primary-200',
            hover: 'hover:border-primary-300'
        },
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            icon: 'text-blue-600',
            gradient: 'from-blue-500 to-blue-600',
            light: 'bg-blue-100',
            border: 'border-blue-200',
            hover: 'hover:border-blue-300'
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            icon: 'text-green-600',
            gradient: 'from-green-500 to-green-600',
            light: 'bg-green-100',
            border: 'border-green-200',
            hover: 'hover:border-green-300'
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            icon: 'text-red-600',
            gradient: 'from-red-500 to-red-600',
            light: 'bg-red-100',
            border: 'border-red-200',
            hover: 'hover:border-red-300'
        },
        yellow: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
            icon: 'text-yellow-600',
            gradient: 'from-yellow-500 to-yellow-600',
            light: 'bg-yellow-100',
            border: 'border-yellow-200',
            hover: 'hover:border-yellow-300'
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            icon: 'text-purple-600',
            gradient: 'from-purple-500 to-purple-600',
            light: 'bg-purple-100',
            border: 'border-purple-200',
            hover: 'hover:border-purple-300'
        },
        indigo: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            icon: 'text-indigo-600',
            gradient: 'from-indigo-500 to-indigo-600',
            light: 'bg-indigo-100',
            border: 'border-indigo-200',
            hover: 'hover:border-indigo-300'
        },
        gray: {
            bg: 'bg-gray-50',
            text: 'text-gray-600',
            icon: 'text-gray-600',
            gradient: 'from-gray-500 to-gray-600',
            light: 'bg-gray-100',
            border: 'border-gray-200',
            hover: 'hover:border-gray-300'
        }
    };

    const sizeClasses = {
        sm: {
            card: 'p-4',
            icon: 'w-10 h-10',
            iconSize: 18,
            title: 'text-xs',
            value: 'text-lg',
            subtitle: 'text-xs'
        },
        md: {
            card: 'p-6',
            icon: 'w-12 h-12',
            iconSize: 24,
            title: 'text-sm',
            value: 'text-2xl',
            subtitle: 'text-xs'
        },
        lg: {
            card: 'p-8',
            icon: 'w-14 h-14',
            iconSize: 28,
            title: 'text-base',
            value: 'text-3xl',
            subtitle: 'text-sm'
        }
    };

    const variantClasses = {
        default: `bg-white border border-secondary-100 shadow-sm hover:shadow-md`,
        gradient: `bg-gradient-to-br ${colorClasses[color].gradient} text-white border-0 shadow-lg`,
        bordered: `bg-white border-2 ${colorClasses[color].border} shadow-sm hover:shadow-md`,
        minimal: `bg-secondary-50 border-0 shadow-none hover:bg-secondary-100`
    };

    const selectedColor = colorClasses[color];
    const selectedSize = sizeClasses[size];

    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend > 0) return variant === 'gradient' ? ArrowUpRight : TrendingUp;
        if (trend < 0) return variant === 'gradient' ? ArrowDownRight : TrendingDown;
        return Minus;
    };

    const TrendIcon = getTrendIcon();
    const isPositiveTrend = trend > 0;
    const isNegativeTrend = trend < 0;

    const getTrendColor = () => {
        if (variant === 'gradient') {
            return isPositiveTrend ? 'text-green-300' : isNegativeTrend ? 'text-red-300' : 'text-white/70';
        }
        return isPositiveTrend ? 'text-green-600' : isNegativeTrend ? 'text-red-600' : 'text-gray-500';
    };

    const formattedValue = formatValue(value);

    if (loading) {
        return (
            <div className={`${variantClasses.default} rounded-2xl ${selectedSize.card} animate-pulse ${className}`}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-secondary-200 rounded w-24 mb-3"></div>
                        <div className="h-8 bg-secondary-200 rounded w-32"></div>
                    </div>
                    <div className="w-12 h-12 bg-secondary-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`
                rounded-2xl transition-all duration-300 ${variantClasses[variant]} 
                ${selectedSize.card} ${onClick ? 'cursor-pointer hover:scale-105' : ''} 
                group ${className}
            `}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className={`font-medium ${selectedSize.title} ${
                            variant === 'gradient' ? 'text-white/80' : 'text-secondary-500'
                        }`}>
                            {title}
                        </p>
                        {tooltip && (
                            <div className="relative group/tooltip">
                                <Info size={14} className={variant === 'gradient' ? 'text-white/60' : 'text-secondary-400'} />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-secondary-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {tooltip}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-secondary-900"></div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <h3 className={`font-bold ${selectedSize.value} mt-1 ${
                        variant === 'gradient' ? 'text-white' : 'text-secondary-900'
                    }`}>
                        {formattedValue}
                    </h3>

                    {subtitle && (
                        <p className={`${selectedSize.subtitle} mt-1 ${
                            variant === 'gradient' ? 'text-white/60' : 'text-secondary-400'
                        }`}>
                            {subtitle}
                        </p>
                    )}

                    {/* Trend Indicator */}
                    {trend !== undefined && TrendIcon && (
                        <div className="flex items-center gap-1 mt-2">
                            <TrendIcon 
                                size={selectedSize === sizeClasses.sm ? 14 : 16} 
                                className={getTrendColor()} 
                            />
                            <span className={`text-xs font-medium ${getTrendColor()}`}>
                                {Math.abs(trend).toFixed(precision)}% {trendLabel}
                            </span>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {progress !== undefined && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className={variant === 'gradient' ? 'text-white/60' : 'text-secondary-500'}>
                                    Progress
                                </span>
                                <span className={variant === 'gradient' ? 'text-white' : 'text-secondary-700'}>
                                    {progress}%
                                </span>
                            </div>
                            <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                                variant === 'gradient' ? 'bg-white/20' : 'bg-secondary-100'
                            }`}>
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        variant === 'gradient' ? 'bg-white' : selectedColor.bg
                                    }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Comparison */}
                    {comparison && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs ${variant === 'gradient' ? 'text-white/60' : 'text-secondary-400'}`}>
                                vs {comparison.label}
                            </span>
                            <span className={`text-xs font-medium ${
                                comparison.value > 0 ? 'text-green-600' : 
                                comparison.value < 0 ? 'text-red-600' : 
                                variant === 'gradient' ? 'text-white' : 'text-secondary-600'
                            }`}>
                                {comparison.value > 0 ? '+' : ''}{comparison.value}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Icon */}
                {Icon && (
                    <div className={`
                        ${selectedSize.icon} rounded-xl flex items-center justify-center 
                        transition-transform duration-300 group-hover:scale-110
                        ${variant === 'gradient' ? 'bg-white/20' : selectedColor.bg}
                    `}>
                        <Icon 
                            size={selectedSize.iconSize} 
                            className={variant === 'gradient' ? 'text-white' : selectedColor.icon} 
                        />
                    </div>
                )}
            </div>

            {/* Chart Sparkline */}
            {chart && (
                <div className="mt-4 h-12">
                    {chart}
                </div>
            )}

            {/* Footer */}
            {footer && (
                <div className={`mt-4 pt-4 border-t ${
                    variant === 'gradient' ? 'border-white/20' : 'border-secondary-100'
                }`}>
                    <div className={variant === 'gradient' ? 'text-white/80' : 'text-secondary-600'}>
                        {footer}
                    </div>
                </div>
            )}

            {/* Actions */}
            {actions && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={`p-1.5 rounded-lg transition ${
                                    variant === 'gradient' 
                                        ? 'hover:bg-white/20 text-white' 
                                        : 'hover:bg-secondary-100 text-secondary-500'
                                }`}
                                title={action.label}
                            >
                                {action.icon}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Compact Stats Card Variant
export const CompactStatsCard = ({ title, value, icon: Icon, color = 'primary' }) => {
    return (
        <StatsCard
            title={title}
            value={value}
            icon={Icon}
            color={color}
            size="sm"
            variant="minimal"
        />
    );
};

// Interactive Stats Card with Click Handler
export const ClickableStatsCard = ({ title, value, icon: Icon, onClick, color = 'primary' }) => {
    return (
        <StatsCard
            title={title}
            value={value}
            icon={Icon}
            color={color}
            onClick={onClick}
            className="cursor-pointer hover:shadow-lg"
            actions={[
                {
                    icon: <Eye size={14} />,
                    label: 'View details',
                    onClick: onClick
                }
            ]}
        />
    );
};

// Stats Card with Progress
export const ProgressStatsCard = ({ title, value, icon: Icon, progress, total, color = 'primary' }) => {
    const percentage = ((value / total) * 100).toFixed(1);
    
    return (
        <StatsCard
            title={title}
            value={value}
            icon={Icon}
            color={color}
            progress={percentage}
            subtitle={`of ${total} total`}
            comparison={{
                label: 'target',
                value: percentage
            }}
        />
    );
};

// Stats Card with Chart
export const ChartStatsCard = ({ title, value, icon: Icon, chart, color = 'primary' }) => {
    return (
        <StatsCard
            title={title}
            value={value}
            icon={Icon}
            color={color}
            chart={chart}
        />
    );
};

// Metric Group Component
export const StatsGroup = ({ title, stats, columns = 4 }) => {
    return (
        <div className="space-y-4">
            {title && <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>
        </div>
    );
};

export default StatsCard;