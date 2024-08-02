import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị giao diện dự phòng
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Bạn có thể ghi lại thông tin lỗi tại đây nếu cần
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Bạn có thể render bất kỳ giao diện dự phòng nào
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
