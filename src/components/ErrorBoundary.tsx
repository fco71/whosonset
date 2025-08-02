import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/Button';
import { AlertTriangle, RefreshCw, Home, Bug, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  showDetails: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Send error to analytics (if available)
    this.reportError(error, errorInfo);
    
    // Show toast notification
    toast.error('Something went wrong. Please try again.', {
      duration: 5000,
      id: this.state.errorId
    });
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you would send this to your error tracking service
    // For now, we'll just log it
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log('Error Report:', errorReport);
    
    // You could send this to a service like Sentry, LogRocket, etc.
    // Example: Sentry.captureException(error, { extra: errorReport });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  private copyErrorDetails = () => {
    const errorDetails = `
Error ID: ${this.state.errorId}
Message: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
    `.trim();

    navigator.clipboard.writeText(errorDetails).then(() => {
      toast.success('Error details copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy error details');
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Oops! Something went wrong</h1>
                  <p className="text-sm text-gray-600">We've encountered an unexpected error</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Don't worry, this is not your fault. Our team has been notified and we're working to fix this issue.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Error ID</span>
                    <span className="text-sm text-gray-500 font-mono">{this.state.errorId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={this.handleRetry} 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.handleGoHome} 
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go to Home
                </Button>
                
                <Button 
                  onClick={this.handleReload} 
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </Button>
              </div>

              {/* Error Details Toggle */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Bug className="w-4 h-4" />
                  {this.state.showDetails ? 'Hide' : 'Show'} Technical Details
                </button>
              </div>

              {/* Error Details */}
              {this.state.showDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Error Details</h3>
                    <button
                      onClick={this.copyErrorDetails}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-600">Message:</span>
                      <p className="text-gray-800 font-mono break-words">
                        {this.state.error?.message}
                      </p>
                    </div>
                    
                    {this.state.error?.stack && (
                      <div>
                        <span className="font-medium text-gray-600">Stack Trace:</span>
                        <pre className="text-gray-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <span className="font-medium text-gray-600">Component Stack:</span>
                        <pre className="text-gray-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 rounded-b-xl">
              <p className="text-xs text-gray-500 text-center">
                If this problem persists, please contact support with Error ID: {this.state.errorId}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for throwing errors programmatically
export const useErrorBoundary = () => {
  const throwError = (error: Error) => {
    throw error;
  };

  const throwErrorWithMessage = (message: string) => {
    throw new Error(message);
  };

  return {
    throwError,
    throwErrorWithMessage
  };
};

export default ErrorBoundary; 