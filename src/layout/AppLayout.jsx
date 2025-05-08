import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AppLayout.css';

const AppLayout = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?q=${searchQuery}`);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">
            NETFLIX
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              홈
            </Link>
            <Link to="/movies" className="nav-link">
              영화
            </Link>
          </div>
        </div>
        <div className="navbar-right">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="영화 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
