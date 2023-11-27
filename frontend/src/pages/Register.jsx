import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const URL = import.meta.env.VITE_REACT_API_URL;

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { username, password, confirmPassword } = form;

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  //handle registration submit
  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      // set errors to empty
      setErrors({});

      // check if name is empty or spaces only
      if (!username || username.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          name: "Name is required",
        }));
        return;
      }

      // password validation -> password must be more than 8 characters
      if (password.length < 8 || password.includes(" ")) {
        setErrors((prev) => ({
          ...prev,
          password:
            "Password must be at least 8 characters and should not include spaces",
        }));
        return;
      }

      // check if passwords match
      if (password !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
        return;
      }

      const response = await fetch(`${URL}/api/users`, {
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
        setForm({
          username: "",
          password: "",
          confirmPassword: "",
        });

        alert("Registration Successful");
        navigate("/login");
      } else {
        if (data.message === "Username already exist") {
          setErrors((prev) => ({
            ...prev,
            email: "Username already exist",
          }));
        } else {
          alert("Registration Failed");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="heading">
        <h1>Register</h1>
        <p>Create your account</p>
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
            <input
              className="form-control"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm password"
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <label className="error-label">{errors.confirmPassword}</label>
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

export default Register;
