import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserPages/UserDashboard";
import Cart from "./pages/UserPages/Cart";
import Register from "./pages/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userRole = sessionStorage.getItem("userRole");

  const PrivateRoute = ({ element: Element, requiredRole }) => {
    const isLoggedIn = sessionStorage.getItem("token") !== null;
    const userRole = sessionStorage.getItem("userRole");

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    if (userRole !== requiredRole) {
      return <Navigate to="/" replace />;
    }

    return <Element />;
  };

  return (
    <>
      <Router>
        <div className="container">
          <Header
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            userRole={userRole}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute element={Dashboard} requiredRole="admin" />
              }
            />
            <Route
              path="/userdashboard"
              element={
                <PrivateRoute element={UserDashboard} requiredRole="user" />
              }
            />
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
