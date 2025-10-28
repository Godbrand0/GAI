import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    this.props.onError?.(error, errorInfo);

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Something went wrong
          </h2>
          
          <p className="text-muted-foreground mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while processing your request.'}
          </p>

          {this.state.retryCount < this.maxRetries && (
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again ({this.maxRetries - this.state.retryCount} attempts left)
            </button>
          )}

          {this.state.retryCount >= this.maxRetries && (
            <div className="text-sm text-muted-foreground">
              Maximum retry attempts reached. Please refresh the page or contact support if the problem persists.
            </div>
          )}

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-4 text-left text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded overflow-auto max-h-32">
                {this.state.error?.stack}
                {'\n\n'}
                Component Stack:
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;