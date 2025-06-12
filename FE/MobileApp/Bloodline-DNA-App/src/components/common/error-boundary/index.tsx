import React, { Component, ReactNode } from "react";
import { Text, View } from "react-native";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "red", fontSize: 16 }}>
            Đã xảy ra lỗi. Vui lòng thử lại sau.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;