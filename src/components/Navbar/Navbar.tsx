import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const isActive = (path: string) => location.pathname === path;

  // Triple click/tap handler
  const handleLogoClickOrTap = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 3) {
      window.location.pathname = "/admin";
      setClickCount(0);
      clickTimeout.current = null;
    } else {
      clickTimeout.current = setTimeout(() => {
        setClickCount(0);
        clickTimeout.current = null;
      }, 2000);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span
          className="navbar-logo"
          style={{ cursor: "pointer" }}
          onClick={handleLogoClickOrTap}
          onTouchStart={handleLogoClickOrTap}
        >
          Bike Versa
        </span>
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-icon"></span>
        </button>
        <div className={`navbar-menu${menuOpen ? " open" : ""}`}>
          <Link
            to="/"
            className={`navbar-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/blog"
            className={`navbar-link ${isActive("/blog") ? "active" : ""}`}
          >
            Blog
          </Link>
          <Link
            to="/brands"
            className={`navbar-link ${isActive("/brands") ? "active" : ""}`}
          >
            Brands
          </Link>
          <Link
            to="/contact"
            className={`navbar-link ${isActive("/contact") ? "active" : ""}`}
          >
            Contact
          </Link>
          {user && (
            <>
              <Link
                to="/admin"
                className={`navbar-link ${isActive("/admin") ? "active" : ""}`}
              >
                Admin
              </Link>
              <button onClick={logout} className="navbar-link navbar-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
