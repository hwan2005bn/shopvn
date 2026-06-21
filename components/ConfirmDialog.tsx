'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Huỷ',
    type = 'danger',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    // Đóng khi nhấn Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const colors = {
        danger: 'bg-red-600 hover:bg-red-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        info: 'bg-blue-600 hover:bg-blue-700',
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-4 mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${type === 'danger' ? 'bg-red-100' : type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                        <AlertTriangle className={`w-6 h-6 ${type === 'danger' ? 'text-red-600' : type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                            }`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{message}</p>
                    </div>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded ${colors[type]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Hook tiện lợi để dùng
export function useConfirm() {
    const [state, setState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type?: 'danger' | 'warning' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const confirm = (
        title: string,
        message: string,
        onConfirm: () => void,
        type: 'danger' | 'warning' | 'info' = 'danger'
    ) => {
        setState({ isOpen: true, title, message, onConfirm, type });
    };

    const close = () => setState((s) => ({ ...s, isOpen: false }));

    const Dialog = () => (
        <ConfirmDialog
            isOpen={state.isOpen}
            title={state.title}
            message={state.message}
            type={state.type}
            onConfirm={() => {
                state.onConfirm();
                close();
            }}
            onCancel={close}
        />
    );

    return { confirm, Dialog };
}
