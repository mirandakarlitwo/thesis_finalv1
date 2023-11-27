import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Cart from "../pages/UserPages/Cart";

function Header({ isLoggedIn, setIsLoggedIn, userRole }) {
  useEffect(() => {
    // Check if the user is logged in
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const URL = import.meta.env.VITE_REACT_API_URL;

  function handleLogout() {
    //remove token upon logout
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userRole");

    //set login to false and redirect to homepage
    setIsLoggedIn(false);
  }

  return (
    <header className="header">
      <div className="logo">
        {isLoggedIn ? (
          userRole === "admin" ? (
            <Link to="/dashboard">Dashboard</Link>
          ) : (
            <Link to="/userdashboard">Joven's Minimart</Link>
          )
        ) : (
          <Link to="/">Joven's Minimart</Link>
        )}
      </div>
      <ul>
        {isLoggedIn ? (
          <>
            {userRole === "admin" ? (
              <li>
                <Link to="/" onClick={handleLogout}>
                  <FaSignOutAlt />
                  Logout
                </Link>
              </li>
            ) : (
              <>
                <ul className="userNav">
                  <li>
                    <Link to="/" onClick={handleLogout}>
                      <FaSignOutAlt />
                      Logout
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
