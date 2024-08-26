import React from 'react';
import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';

import App from './App.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
