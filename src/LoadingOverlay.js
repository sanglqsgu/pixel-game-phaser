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
        background: 'linear-gradient(180deg, #070a13 0%, #101426 100%)',
        color: '#ffb238',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        zIndex: 100,
        border: '2px solid rgba(92, 200, 255, 0.55)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          border: '4px solid rgba(255, 255, 255, 0.14)',
          borderTopColor: '#5cc8ff',
          borderRightColor: '#ffb238',
          borderRadius: '50%',
          animation: 'loading-spin 0.8s linear infinite',
          marginBottom: '18px',
          boxShadow: '0 0 22px rgba(92, 200, 255, 0.32)',
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
