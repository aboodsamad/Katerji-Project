import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Header.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { path: "/", label: "Home", auth: false },
    { path: "/dashboard", label: "Dashboard", auth: true },
    { path: "/data-table", label: "places", auth: true },
    { path: "/profile", label: "Profile", auth: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* LOGO */}
          <Link to="/" className="logo">
            <span className="logo-icon">🇱🇧</span>
            <span className="logo-text">TravelMate</span>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="desktop-nav">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated ? (
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            ) : (
              <Link to="/login" className="login-btn">
                Login
              </Link>
            )}
          </nav>

          {/* MOBILE HAMBURGER */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => {
            if (link.auth && !isAuthenticated) return null;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-nav-link ${isActive(link.path) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <button onClick={handleLogout} className="mobile-logout-btn">
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-login-btn"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </>
  );
}