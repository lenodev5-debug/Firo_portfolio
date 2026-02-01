import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Component Error:', error);
        console.error('Error Info:', errorInfo);
        this.setState({ errorInfo });
        
        // You can log errors to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleRefresh = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided, otherwise use default
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <i className="fas fa-exclamation-triangle fa-3x"></i>
                        <h3>Something went wrong</h3>
                        <p>We apologize for the inconvenience. The component has encountered an error.</p>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="error-details">
                                <details>
                                    <summary>Error Details (Development Only)</summary>
                                    <pre className="error-stack">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            </div>
                        )}
                        
                        <div className="error-actions">
                            <button 
                                className="btn-primary"
                                onClick={this.handleReset}
                            >
                                <i className="fas fa-redo"></i> Try Again
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={this.handleRefresh}
                            >
                                <i className="fas fa-sync-alt"></i> Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;