import React, { useState } from "react";
import "./LoginPage.css";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin();   // <-- IMPORTANT: DO NOT PASS userId
      } else {
        alert(data.error || "Invalid username or password");
      }
    } catch (err) {
      alert("Backend not reachable");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">💬</div>
        <h1 className="login-title">ChatWithMe</h1>

        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="login-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-button" type="submit">Log In</button>
        </form>

      </div>
    </div>
  );
}
