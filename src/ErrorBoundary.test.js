import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundary from './ErrorBoundary';

function Bomb() {
  throw new Error('Test error');
}

function Safe() {
  return <div>Safe content</div>;
}

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

it('renders children when there is no error', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ErrorBoundary>
      <Safe />
    </ErrorBoundary>,
    div
  );
  expect(div.textContent).toContain('Safe content');
  ReactDOM.unmountComponentAtNode(div);
});

it('renders error UI when child throws', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
    div
  );
  expect(div.textContent).toContain('Đã xảy ra lỗi');
  expect(div.textContent).toContain('Tải lại trang');
  ReactDOM.unmountComponentAtNode(div);
});
