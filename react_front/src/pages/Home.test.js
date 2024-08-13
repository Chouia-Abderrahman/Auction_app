import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { WebSocketProvider } from '../contexts/WebSocketContext';
import Home from './Home';

jest.mock('axios');

test('renders home page with title', () => {
  render(
    <Router>
      <WebSocketProvider>
        <Home />
      </WebSocketProvider>
    </Router>
  );
  const titleElement