import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'Ubuntu, sans-serif',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '24px', margin: '0 0 8px' }}>Đã xảy ra lỗi</h1>
          <p style={{ color: '#666', margin: '0 0 16px', maxWidth: '400px' }}>
            Ứng dụng gặp sự cố. Vui lòng tải lại trang.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              background: '#f9a602',
              border: 'none',
              borderRadius: '4px',
              color: '#000',
            }}
          >
            Tải lại trang
          </button>
          {this.state.error && (
            <details
              style={{ marginTop: '16px', color: '#999', fontSize: '12px' }}
            >
              <summary>Chi tiết lỗi</summary>
              <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};
