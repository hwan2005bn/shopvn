'use client';
import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return <div className="p-8 text-center">Có lỗi xảy ra. <button onClick={() => location.reload()}>Tải lại</button></div>;
        }
        return this.props.children;
    }
}
