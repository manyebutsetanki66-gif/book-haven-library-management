import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("libraryLoggedIn");
    localStorage.removeItem("currentUser");

    navigate("/users"); 
  };

  let currentUser = null;
  try { currentUser = JSON.parse(localStorage.getItem("currentUser") || "null"); } catch { currentUser = null; }
  const isManagerLoggedIn = localStorage.getItem("libraryLoggedIn") === "true" && Boolean(currentUser?.id);

  return (
    <nav className="navbar">
      
      <div className="navbar-brand">
        <i className="fa-solid fa-book-open-reader"></i> Book Haven
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-solid fa-chart-line"></i> Dashboard
        </NavLink>
        <NavLink to="/books" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-solid fa-book"></i> Books
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-solid fa-right-left"></i> Transactions
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-solid fa-users"></i> Users
        </NavLink>

        {isManagerLoggedIn && (
          <a href="#logout" onClick={handleLogout} id="logout-link">
            <i className="fa-solid fa-right-from-bracket"></i> Logout ({currentUser?.name || currentUser?.username})
          </a>
        )}
      </div>

      <form className="search-form" id="searchform" onSubmit={(e) => {
        e.preventDefault();
        navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
      }}>
        <input
          type="search"
          aria-label="Search books"
          placeholder="Search books by title, author, genre or ISBN..."
          id="searchinput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i> Search
        </button>
      </form>
    </nav>
  );
}
