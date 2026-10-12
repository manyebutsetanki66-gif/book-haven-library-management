import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  let currentUser = null;
  let users = [];
  try {
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    users = JSON.parse(localStorage.getItem('libraryUsers') || '[]');
  } catch {
    currentUser = null;
    users = [];
  }
  const isAuthenticated = localStorage.getItem('libraryLoggedIn') === 'true'
    && Boolean(currentUser?.id)
    && users.some(user => user.id === currentUser.id);
  return isAuthenticated ? <Outlet /> : <Navigate to="/users" replace />;
}
