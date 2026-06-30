import React from 'react';
import PropTypes from 'prop-types';

export default function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div
      role="status"
      aria-label="Đang tải game"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#f9a602',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #333',
          borderTopColor: '#f9a602',
          borderRadius: '50%',
          animation: 'loading-spin 0.8s linear infinite',
          marginBottom: '16px',
        }}
      />
      <span>Đang tải...</span>
      <style>{`
        @keyframes loading-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

LoadingOverlay.propTypes = {
  visible: PropTypes.bool,
};
