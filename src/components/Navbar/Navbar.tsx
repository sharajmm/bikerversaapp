import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

interface NavbarProps {
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogoClick }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = typeof useLocation === "function" ? useLocation() : null;
  const [clickCount, setClickCount] = React.useState(0);
  const [clickTimeout, setClickTimeout] = React.useState<NodeJS.Timeout | null>(
    null
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogoClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 3) {
      window.location.pathname = "/admin";
      setClickCount(0);
      setClickTimeout(null);
    } else {
      const timeout = setTimeout(() => {
        setClickCount(0);
        setClickTimeout(null);
      }, 2000);
      setClickTimeout(timeout);
    }
  };

  React.useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span
          className="navbar-logo"
          style={{ cursor: "pointer" }}
          onClick={handleLogoClick}
        >
          Bike Versa
        </span>
        <div className="navbar-menu">
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
