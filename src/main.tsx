import React from 'react';
import ReactDOM from 'react-dom/client';
import favicon from '../src-tauri/icons/32x32.png';
import './index.css';
import './i18n';
import App from './App';

const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/png';
link.href = favicon;
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<React.StrictMode><App /></React.StrictMode>);
