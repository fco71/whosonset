import React from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected error',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[AppErrorBoundary] Unhandled render error:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="mx-auto mt-20 w-full max-w-xl rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-700">
              The page failed to render. Try a hard refresh. If it persists, disable browser extensions
              on this site and reload.
            </p>
            {this.state.errorMessage && (
              <p className="mt-3 rounded-md bg-red-50 p-3 text-xs text-red-700">
                {this.state.errorMessage}
              </p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Reload page
              </button>
              <a
                href="/"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
