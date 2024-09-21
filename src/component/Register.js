import React, { useState } from "react";
import axios from "axios";
import base_url from "../api/bootapi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(`${base_url}/api/register`, {
        name,
        email,
        password,
      });
      setMessage(response.data); // Set the response message
    } catch (error) {
      setMessage("Error during registration");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="bg-white p-4 rounded-lg shadow w-100"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>
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
          </div>
          <button type="submit" className="btn btn-primary w-100">
            SIGN UP
          </button>
        </form>
        {message && <p className="text-center mt-3 text-success">{message}</p>}
        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-primary text-decoration-none">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
