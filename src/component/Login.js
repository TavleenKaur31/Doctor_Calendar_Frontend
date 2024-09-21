import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import base_url from "../api/bootapi";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(`${base_url}/api/login`, {
        email,
        password,
      });
      if (response.data === "Login successful!") {
        onLogin(); // Call the parent onLogin function
        navigate("/overview"); // Redirect to /overview
      } else {
        setMessage("Invalid email or password!");
      }
    } catch (error) {
      setMessage("Error during login");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="bg-white p-4 rounded-lg shadow w-100"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="form-check-input"
              />
              <label htmlFor="showPassword" className="form-check-label">
                Show Password
              </label>
            </div>
            <a href="#" className="text-primary text-decoration-none">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            LOGIN
          </button>
        </form>
        {message && <p className="text-center mt-3 text-danger">{message}</p>}
        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary text-decoration-none">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
