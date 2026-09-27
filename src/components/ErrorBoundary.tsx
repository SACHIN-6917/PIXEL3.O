import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle, WifiOff } from 'lucide-react';
import { WHATSAPP_COMMUNITY_LINK } from '../lib/googleSheet';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const isNetworkError =
        !navigator.onLine ||
        this.state.error?.message?.toLowerCase().includes('network') ||
        this.state.error?.message?.toLowerCase().includes('fetch') ||
        this.state.error?.message?.toLowerCase().includes('failed to fetch');

      return (
        <div className="min-h-screen bg-background-warm flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-3xl border border-border shadow-xl p-6 sm:p-8 text-center space-y-6">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                isNetworkError ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
              }`}
            >
              {isNetworkError ? <WifiOff className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                {isNetworkError ? 'Connection Interrupted' : 'Something went wrong'}
              </h2>
              <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                {isNetworkError
                  ? 'Unable to connect to the network. Please check your internet connection and try reloading.'
                  : 'An unexpected application error occurred. You can reload the page or return to the homepage.'}
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-foreground/5 rounded-xl border border-border text-left overflow-x-auto text-[11px] font-mono text-foreground-muted">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 phoenix-gradient-btn py-3.5 rounded-full text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-phoenix-subtle"
              >
                <RefreshCw className="w-4 h-4" /> Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-3.5 rounded-full border border-border hover:bg-background-warm text-foreground-secondary hover:text-foreground text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" /> Return Home
              </button>
            </div>

            <div className="pt-3 border-t border-border">
              <a
                href={WHATSAPP_COMMUNITY_LINK}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#128C7E] hover:underline font-semibold flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" /> Need Help? Contact Coordinators on WhatsApp
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
