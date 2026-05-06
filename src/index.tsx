import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import { initI18n } from './i18n';
import { App } from './App';

initI18n();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
