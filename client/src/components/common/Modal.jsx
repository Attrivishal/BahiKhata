// src/components/common/Modal.jsx
import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'md',
    variant = 'default', // default, success, error, warning, info
    showClose = true,
    closeOnClickOutside = true,
    closeOnEsc = true,
    footer,
    actions,
    loading = false,
    className = ''
}) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (closeOnEsc && e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, closeOnEsc]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    const handleOverlayClick = (e) => {
        if (closeOnClickOutside && e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen && !isClosing) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[90vw] w-full'
    };

    const variantIcons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
        default: null
    };

    const variantColors = {
        success: {
            icon: 'text-green-600',
            bg: 'bg-green-100',
            header: 'text-green-800',
            button: 'bg-green-600 hover:bg-green-700'
        },
        error: {
            icon: 'text-red-600',
            bg: 'bg-red-100',
            header: 'text-red-800',
            button: 'bg-red-600 hover:bg-red-700'
        },
        warning: {
            icon: 'text-yellow-600',
            bg: 'bg-yellow-100',
            header: 'text-yellow-800',
            button: 'bg-yellow-600 hover:bg-yellow-700'
        },
        info: {
            icon: 'text-blue-600',
            bg: 'bg-blue-100',
            header: 'text-blue-800',
            button: 'bg-blue-600 hover:bg-blue-700'
        },
        default: {
            icon: 'text-primary-600',
            bg: 'bg-primary-100',
            header: 'text-secondary-900',
            button: 'bg-primary-600 hover:bg-primary-700'
        }
    };

    const Icon = variantIcons[variant];

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
                isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={handleOverlayClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

            {/* Modal */}
            <div 
                className={`
                    relative bg-white rounded-2xl shadow-2xl w-full 
                    ${sizeClasses[size]} ${className}
                    transform transition-all duration-200
                    ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                            <p className="text-secondary-600 font-medium">Loading...</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                {(title || showClose) && (
                    <div className={`flex items-center justify-between p-6 border-b border-secondary-200 ${
                        variant !== 'default' ? variantColors[variant].bg : ''
                    } rounded-t-2xl`}>
                        <div className="flex items-center gap-3">
                            {Icon && (
                                <div className={`p-2 rounded-lg ${variantColors[variant].bg}`}>
                                    <Icon className={`w-5 h-5 ${variantColors[variant].icon}`} />
                                </div>
                            )}
                            <h2 className={`text-xl font-semibold ${variantColors[variant].header}`}>
                                {title}
                            </h2>
                        </div>
                        {showClose && (
                            <button 
                                onClick={handleClose}
                                className="p-2 hover:bg-black/5 rounded-lg transition-colors group"
                                aria-label="Close modal"
                            >
                                <X size={20} className="text-secondary-400 group-hover:text-secondary-600 transition-colors" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>

                {/* Footer */}
                {(footer || actions) && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50 rounded-b-2xl">
                        {footer}
                        {actions && (
                            <div className="flex gap-3">
                                {actions.cancel && (
                                    <button
                                        type="button"
                                        onClick={actions.cancel.onClick || handleClose}
                                        className="px-4 py-2.5 border border-secondary-300 text-secondary-700 font-medium rounded-xl hover:bg-secondary-100 transition-all duration-200"
                                    >
                                        {actions.cancel.text || 'Cancel'}
                                    </button>
                                )}
                                {actions.confirm && (
                                    <button
                                        type="button"
                                        onClick={actions.confirm.onClick}
                                        disabled={actions.confirm.disabled}
                                        className={`px-4 py-2.5 ${variantColors[variant].button} text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {actions.confirm.text || 'Confirm'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Confirmation Modal Component
export const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirm Action', 
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
    loading = false
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant={variant}
            size="sm"
            showClose={false}
            actions={{
                cancel: { text: cancelText, onClick: onClose },
                confirm: { 
                    text: confirmText, 
                    onClick: onConfirm,
                    disabled: loading
                }
            }}
        >
            <div className="py-4">
                <p className="text-secondary-600">{message}</p>
            </div>
        </Modal>
    );
};

// Form Modal Component
export const FormModal = ({
    isOpen,
    onClose,
    title,
    onSubmit,
    children,
    size = 'md',
    loading = false,
    submitText = 'Submit',
    cancelText = 'Cancel'
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size={size}
            loading={loading}
            actions={{
                cancel: { text: cancelText, onClick: onClose },
                confirm: { 
                    text: submitText, 
                    onClick: onSubmit,
                    disabled: loading
                }
            }}
        >
            {children}
        </Modal>
    );
};

// Success Modal Component
export const SuccessModal = ({
    isOpen,
    onClose,
    title = 'Success!',
    message = 'Operation completed successfully.',
    buttonText = 'Continue'
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant="success"
            size="sm"
            showClose={false}
            actions={{
                confirm: { text: buttonText, onClick: onClose }
            }}
        >
            <div className="py-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-secondary-600">{message}</p>
            </div>
        </Modal>
    );
};

// Error Modal Component
export const ErrorModal = ({
    isOpen,
    onClose,
    title = 'Error!',
    message = 'Something went wrong. Please try again.',
    buttonText = 'Close'
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant="error"
            size="sm"
            showClose={false}
            actions={{
                confirm: { text: buttonText, onClick: onClose }
            }}
        >
            <div className="py-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <p className="text-secondary-600">{message}</p>
            </div>
        </Modal>
    );
};

// Image Preview Modal
export const ImageModal = ({
    isOpen,
    onClose,
    src,
    alt = 'Image preview'
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="full"
            showClose={true}
            className="bg-transparent shadow-none"
        >
            <div className="flex items-center justify-center min-h-[60vh]">
                <img 
                    src={src} 
                    alt={alt} 
                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                />
            </div>
        </Modal>
    );
};

// Drawer Modal (slides from side)
export const DrawerModal = ({
    isOpen,
    onClose,
    title,
    children,
    position = 'right', // left, right, top, bottom
    size = 'md'
}) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    if (!isOpen && !isClosing) return null;

    const positionClasses = {
        left: {
            container: 'justify-start',
            modal: `h-full ${size === 'sm' ? 'w-80' : size === 'md' ? 'w-96' : 'w-[480px]'} transform ${
                isClosing ? '-translate-x-full' : 'translate-x-0'
            }`,
            overlay: ''
        },
        right: {
            container: 'justify-end',
            modal: `h-full ${size === 'sm' ? 'w-80' : size === 'md' ? 'w-96' : 'w-[480px]'} transform ${
                isClosing ? 'translate-x-full' : 'translate-x-0'
            }`,
            overlay: ''
        },
        top: {
            container: 'items-start',
            modal: `w-full max-h-[90vh] transform ${
                isClosing ? '-translate-y-full' : 'translate-y-0'
            }`,
            overlay: ''
        },
        bottom: {
            container: 'items-end',
            modal: `w-full max-h-[90vh] transform ${
                isClosing ? 'translate-y-full' : 'translate-y-0'
            }`,
            overlay: ''
        }
    };

    return (
        <div 
            className={`fixed inset-0 z-50 flex ${positionClasses[position].container} ${
                isClosing ? 'items-' + position : 'items-' + position
            }`}
            onClick={handleClose}
        >
            {/* Backdrop */}
            <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${
                isClosing ? 'opacity-0' : 'opacity-100'
            }`} />

            {/* Drawer */}
            <div 
                className={`
                    relative bg-white shadow-2xl transition-all duration-300
                    ${positionClasses[position].modal}
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                        <h2 className="text-xl font-semibold text-secondary-900">{title}</h2>
                        <button 
                            onClick={handleClose}
                            className="p-2 hover:bg-secondary-100 rounded-lg transition"
                        >
                            <X size={20} className="text-secondary-500" />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;