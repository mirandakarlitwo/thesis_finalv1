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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const PrivateRoute = ({ element: Element }) => {
    return isLoggedIn ? <Element /> : <Navigate to="/login" replace />;
  };

  return (
    <>
      <Router>
        <div className="container">
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={Dashboard} />}
            />{" "}
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
