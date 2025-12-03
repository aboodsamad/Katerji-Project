import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        // Send logout log to backend
        await fetch("https://travel-mate-backend-jbxi.onrender.com/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
      }

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="header">
      <div className="logo">🇱🇧 TravelMate</div>

      <nav className="nav-links">
        {!token ? (
          <>
            <Link to="/login"><button className="btn btn-success">Log In</button></Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/data-table">Places</Link>
            <Link to="/profile">Profile</Link> 

            {/* Logout Button */}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}