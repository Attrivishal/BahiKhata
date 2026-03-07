// src/components/common/Loader.jsx
import React from 'react';
import { Loader2, CircleDot, Sparkles, RotateCw, RefreshCw } from 'lucide-react';

const Loader = ({ 
    size = 'md', 
    fullScreen = false,
    variant = 'spinner', // spinner, dots, pulse, circle
    text = '',
    color = 'primary',
    overlay = false
}) => {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg'
    };

    const colorClasses = {
        primary: 'text-primary-600',
        secondary: 'text-secondary-600',
        white: 'text-white',
        blue: 'text-blue-600',
        green: 'text-green-600',
        red: 'text-red-600',
        purple: 'text-purple-600'
    };

    const bgColorClasses = {
        primary: 'bg-primary-100',
        secondary: 'bg-secondary-100',
        white: 'bg-white/20',
        blue: 'bg-blue-100',
        green: 'bg-green-100',
        red: 'bg-red-100',
        purple: 'bg-purple-100'
    };

    const getLoaderContent = () => {
        switch(variant) {
            case 'spinner':
                return (
                    <div className="relative">
                        <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
                        {text && (
                            <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap ${textSizeClasses[size]} ${color === 'white' ? 'text-white' : 'text-secondary-600'}`}>
                                {text}
                            </span>
                        )}
                    </div>
                );

            case 'dots':
                return (
                    <div className="flex items-center justify-center gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`${sizeClasses[size].replace('w-', 'w-').replace('h-', 'h-')} ${colorClasses[color]} bg-current rounded-full animate-bounce`}
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                        {text && (
                            <span className={`ml-2 ${textSizeClasses[size]} ${color === 'white' ? 'text-white' : 'text-secondary-600'}`}>
                                {text}
                            </span>
                        )}
                    </div>
                );

            case 'pulse':
                return (
                    <div className="relative">
                        <div className={`${sizeClasses[size]} ${colorClasses[color]}`}>
                            <CircleDot className="w-full h-full animate-pulse" />
                        </div>
                        {text && (
                            <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap ${textSizeClasses[size]} ${color === 'white' ? 'text-white' : 'text-secondary-600'}`}>
                                {text}
                            </span>
                        )}
                    </div>
                );

            case 'circle':
                return (
                    <div className="relative">
                        <div className={`${sizeClasses[size]} rounded-full border-4 border-${color}-200 border-t-${color}-600 animate-spin`} />
                        {text && (
                            <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap ${textSizeClasses[size]} ${color === 'white' ? 'text-white' : 'text-secondary-600'}`}>
                                {text}
                            </span>
                        )}
                    </div>
                );

            case 'gradient':
                return (
                    <div className="relative">
                        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 animate-spin`} 
                             style={{ backgroundSize: '200% 100%', animation: 'gradient-spin 1.5s linear infinite' }}>
                            <div className="w-full h-full rounded-full bg-white/20" />
                        </div>
                        {text && (
                            <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap ${textSizeClasses[size]} ${color === 'white' ? 'text-white' : 'text-secondary-600'}`}>
                                {text}
                            </span>
                        )}
                    </div>
                );

            case 'logo':
                return (
                    <div className="relative">
                        <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-primary-500/30`}>
                            <Sparkles className="w-1/2 h-1/2 text-white" />
                        </div>
                        {text && (
                            <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap ${textSizeClasses[size]} ${color === 'white' ? 'text-white' : 'text-secondary-600'}`}>
                                {text}
                            </span>
                        )}
                    </div>
                );

            case 'progress':
                return (
                    <div className="flex flex-col items-center gap-3">
                        <div className={`${sizeClasses[size] === 'w-8 h-8' ? 'w-24' : 'w-32'} h-2 bg-${color}-100 rounded-full overflow-hidden`}>
                            <div className={`h-full bg-${color}-600 rounded-full animate-progress`} 
                                 style={{ width: '60%', animation: 'progress 1.5s ease-in-out infinite' }} />
                        </div>
                        {text && (
                            <span className={`${textSizeClasses[size]} ${color === 'white' ? 'text-white' : 'text-secondary-600'}`}>
                                {text}
                            </span>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="relative">
                        <RefreshCw className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
                        {text && (
                            <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap ${textSizeClasses[size]} ${color === 'white' ? 'text-white' : 'text-secondary-600'}`}>
                                {text}
                            </span>
                        )}
                    </div>
                );
        }
    };

    const loaderContent = getLoaderContent();

    // Animation styles
    const animationStyles = `
        @keyframes gradient-spin {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }
        @keyframes progress {
            0% { width: 0%; }
            50% { width: 100%; }
            100% { width: 0%; }
        }
    `;

    if (fullScreen) {
        return (
            <div className={`fixed inset-0 z-50 flex items-center justify-center ${
                overlay ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'
            }`}>
                <style>{animationStyles}</style>
                {loaderContent}
            </div>
        );
    }

    if (overlay) {
        return (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
                <style>{animationStyles}</style>
                {loaderContent}
            </div>
        );
    }

    return (
        <>
            <style>{animationStyles}</style>
            {loaderContent}
        </>
    );
};

// Skeleton Loader Component for content loading
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const getSkeletonContent = () => {
        switch(type) {
            case 'card':
                return (
                    <div className="bg-white rounded-2xl border border-secondary-100 p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary-200 rounded-xl animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-secondary-200 rounded w-3/4 animate-pulse" />
                                <div className="h-3 bg-secondary-200 rounded w-1/2 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-secondary-200 rounded animate-pulse" />
                            <div className="h-3 bg-secondary-200 rounded w-5/6 animate-pulse" />
                            <div className="h-3 bg-secondary-200 rounded w-4/6 animate-pulse" />
                        </div>
                        <div className="flex justify-between pt-4">
                            <div className="h-8 bg-secondary-200 rounded-lg w-24 animate-pulse" />
                            <div className="h-8 bg-secondary-200 rounded-lg w-24 animate-pulse" />
                        </div>
                    </div>
                );

            case 'table':
                return (
                    <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
                        <div className="bg-secondary-50 p-4 border-b border-secondary-200">
                            <div className="h-6 bg-secondary-200 rounded w-48 animate-pulse" />
                        </div>
                        {[...Array(count)].map((_, i) => (
                            <div key={i} className="p-4 border-b border-secondary-100 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-secondary-200 rounded-lg animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-secondary-200 rounded w-3/4 animate-pulse" />
                                        <div className="h-3 bg-secondary-200 rounded w-1/2 animate-pulse" />
                                    </div>
                                    <div className="w-16 h-6 bg-secondary-200 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'chart':
                return (
                    <div className="bg-white rounded-2xl border border-secondary-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-6 bg-secondary-200 rounded w-32 animate-pulse" />
                            <div className="h-6 bg-secondary-200 rounded w-20 animate-pulse" />
                        </div>
                        <div className="h-64 flex items-end gap-2">
                            {[...Array(7)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="flex-1 bg-secondary-200 rounded-t-lg animate-pulse"
                                    style={{ height: `${Math.random() * 60 + 20}%` }}
                                />
                            ))}
                        </div>
                    </div>
                );

            case 'stats':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-secondary-100 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-secondary-200 rounded w-24 animate-pulse" />
                                        <div className="h-8 bg-secondary-200 rounded w-32 animate-pulse" />
                                    </div>
                                    <div className="w-12 h-12 bg-secondary-200 rounded-xl animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return (
                    <div className="space-y-3">
                        {[...Array(count)].map((_, i) => (
                            <div key={i} className="h-12 bg-secondary-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <div key={i}>{getSkeletonContent()}</div>
            ))}
        </div>
    );
};

// Page Loader Component
export const PageLoader = ({ text = 'Loading...' }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary-50 to-white">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl animate-pulse"></div>
                </div>
            </div>
            <p className="mt-6 text-secondary-600 font-medium">{text}</p>
            <p className="mt-2 text-sm text-secondary-400">Please wait while we load your content</p>
        </div>
    );
};

// Button Loader
export const ButtonLoader = ({ size = 'sm', color = 'primary' }) => {
    return (
        <Loader2 className={`animate-spin ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-${color}-600`} />
    );
};

export default Loader;