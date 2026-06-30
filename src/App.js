import React, { Component } from 'react';
import Game from './Phaser/src/Game';
import ErrorBoundary from './ErrorBoundary';
import HistoryPanel from './components/HistoryPanel';
import './App.css';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <div className="App">
          <Game />
          <HistoryPanel />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
