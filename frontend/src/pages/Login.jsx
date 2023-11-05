import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const URL = import.meta.env.VITE_REACT_API_URL;

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { username, password } = form;

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const { token } = data;

      //store token to session storage
      sessionStorage.setItem("token", token);

      setIsLoggedIn(true);
      alert("Login Successful");
      navigate("/dashboard");

      //clear errors if user succesfully logged in
      setErrors({});
    }

    //login validation
    else {
      if (data.message === "Username do not exist") {
        setErrors({
          username: "Username do not exist",
        });
      }
      if (data.message === "Password is incorrect") {
        setErrors({
          password: "Incorrect Password",
        });
      }
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      {" "}
      <section className="heading">
        <h1>Login</h1>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Enter username"
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.username && (
              <label className="error-label">{errors.username}</label>
            )}
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.password && (
              <label className="error-label">{errors.password}</label>
            )}
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
