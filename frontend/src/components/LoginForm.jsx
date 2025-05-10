import React, { useState } from "react";
import api from "../utils/api"; // Ensure api.js points to the correct backend URL
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // useNavigate replaces useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    try {
      // POST request to the backend to log in
      const response = await api.post("/login", loginData);
      console.log(response.data);

      // Save the tokens in cookies (or handle them as needed)
      document.cookie = `accessToken=${response.data.accessToken}; path=/; secure; SameSite=Strict;`;
      document.cookie = `refreshToken=${response.data.refreshToken}; path=/; secure; SameSite=Strict;`;

      // Redirect to profile page after login
      navigate("/profile"); // Replace history.push() with navigate() for React Router v6
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
