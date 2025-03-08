// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Timer from './Timer';
import './Layout.css';

const Layout = (props) => {
  return (
    <div className="layout">
      <header className="sticky-header">
        <h1>Telos Mastery</h1>
        <Timer {...props} />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
