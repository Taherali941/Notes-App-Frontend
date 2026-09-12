import React, { useState } from "react";
import "./Auth.css"; // Importing the separate CSS file

export default function Auth() {
  // 'login' or 'register'
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Only for register

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pick the right URL and payload based on the mode
    const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    
    // Maps the frontend 'username' state to the 'name' key expected by the Mongoose schema
    const payload = isLogin 
      ? { email, password } 
      : { name: username, email, password };

    try {
      console.log("Sending Payload:", JSON.stringify(payload));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // fetch doesn't reject on 4xx/5xx status codes, so check response.ok
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        console.log('Login successful:', data);
        // Example: Store auth token and redirect
        // localStorage.setItem('token', data.token);
      } else {
        console.log('Registration successful:', data);
        // Example: Switch to login tab or auto-login
      }
    } catch (error) {
      console.error('Error during authentication:', error.message);
      // Add logic here to display error messages to the user (e.g., setError(error.message))
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Toggle Headers */}
        <div className="auth-toggle">
          <button 
            type="button"
            className={isLogin ? "active" : ""} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            type="button"
            className={!isLogin ? "active" : ""} 
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Conditionally show Username field only during Registration */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Bottom Switch Link */}
        <p className="auth-switch-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
}
