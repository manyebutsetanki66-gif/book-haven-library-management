import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


import Layout from './components/layout.jsx';
import ProtectedRoute from './components/protectedroute.jsx';
import Dashboard from './pages/dashboard.jsx';
import Books from './pages/books.jsx';
import Transactions from './pages/transactions.jsx';
import Users from './pages/users.jsx';

export default function App() {
  return (
    <Routes>
      
      <Route element={<Layout />}>
        
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>

        
        <Route path="/users" element={<Users />} />

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
