import React from 'react';
import ReactDOM from 'react-dom';
import LoadingOverlay from './LoadingOverlay';

it('renders nothing when visible is false', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LoadingOverlay visible={false} />, div);
  expect(div.innerHTML).toBe('');
  ReactDOM.unmountComponentAtNode(div);
});

it('renders loading UI when visible is true', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LoadingOverlay visible={true} />, div);
  expect(div.textContent).toContain('Đang tải...');
  expect(div.querySelector('[role="status"]')).not.toBeNull();
  ReactDOM.unmountComponentAtNode(div);
});
