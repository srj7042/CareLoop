import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CareLoop Global Error Boundary caught:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleResetSession = () => {
    try {
      // Clear session artifacts if corrupted
      sessionStorage.clear();
    } catch (e) {
      console.warn("Could not clear sessionStorage:", e);
    }
    window.location.href = "/login";
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#F7F8F5] text-[#1E2522] flex items-center justify-center p-4 font-sans selection:bg-[#609983]/20 selection:text-[#609983]">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-[#E8ECE9] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FDE8E8] border border-[#F8B4B4] flex items-center justify-center text-[#E02424] shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1E2522]">Session Runtime Exception</h1>
                <p className="text-xs text-[#5B6660]">CareLoop Safety Guard Intercepted an Unexpected Error</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8ECE9] text-xs text-[#5B6660] space-y-2">
              <p className="font-semibold text-[#1E2522]">Data Integrity Safeguarded:</p>
              <p className="leading-relaxed">
                Your current clinical workspace encountered an unexpected rendering error. Your patient records and audit logs are safely stored on the server.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReload}
                  className="flex-1 bg-[#1E2522] hover:bg-[#609983] text-white font-bold text-xs h-11 rounded-xl shadow-md gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Workspace
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-[#E8ECE9] text-[#1E2522] hover:bg-[#F7F8F5] text-xs h-11 px-5 rounded-xl font-semibold gap-2"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Button>
              </div>

              <button
                onClick={this.handleResetSession}
                type="button"
                className="w-full text-center text-xs text-[#609983] hover:text-[#52826f] font-semibold py-1 hover:underline cursor-pointer"
              >
                Reset Session Cache & Re-authenticate
              </button>
            </div>

            {/* Collapsible Error Details */}
            <div className="border-t border-[#E8ECE9] pt-4">
              <button
                onClick={this.toggleDetails}
                type="button"
                className="flex items-center justify-between w-full text-xs font-semibold text-[#5B6660] hover:text-[#1E2522]"
              >
                <span>Technical Diagnostics</span>
                {this.state.showDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3 rounded-lg bg-[#271E19] text-[#F3EBE1] text-[11px] font-mono overflow-x-auto max-h-48 space-y-1">
                  <p className="text-red-400 font-bold">{this.state.error?.toString()}</p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-stone-400 text-[10px] whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
