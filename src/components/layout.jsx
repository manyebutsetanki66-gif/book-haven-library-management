import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar.jsx';

export default function Layout() {
  return (
    <>
      
      <Navbar />
      
      
      <div id="aleartuser" style={{ display: 'none' }}></div>

      
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
