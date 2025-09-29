import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#52c41a', // 主色调改为绿色
          colorSuccess: '#389e0d', // 成功色改为深绿色
          colorInfo: '#52c41a',    // 信息色改为绿色
          colorLink: '#52c41a',   // 链接色改为绿色
          colorWarning: '#faad14', // 警告色保持不变
          colorError: '#ff4d4f',   // 错误色保持不变
        },
      }}
    ></ConfigProvider>
    <App />
  </React.StrictMode>
);
