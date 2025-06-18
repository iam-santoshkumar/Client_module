import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginForm.css";
import { useToast } from "@chakra-ui/react";

const LoginForm = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();
  const { handleLogin } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);

      const data = await response.json();
      console.log("Login response:", data); // Debugging log

      if (response.ok) {
        // Set session storage values
        const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hour expiration
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", data.user);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("expirationTime", expirationTime);

        // Pass all necessary data to handleLogin
        handleLogin(data.role, data.token, expirationTime);

        // Redirect based on role
        setTimeout(() => {
          toast({
            title: "Login Successful!",
            status: "success",
            position: "top",
            isClosable: true,
          });

          if (data.role === "Admin") {
            history.replace("/admin-dashboard"); // Redirect to admin dashboard if admin
          } else {
            history.replace("/"); // Redirect to home for other roles
          }
        });
      } else {
        setMessage(`Error: ${data.message}`);
        toast({
          title: "Invalid Username or Password",
          status: "error",
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="login-button" type="submit">
          Login
        </button>

        {message && <p className="message">{message}</p>}

        <span
          className="forgot-password"
          onClick={() => history.replace("/password-request")}
        >
          Forgot your password?
        </span>
      </form>
    </div>
  );
};

export default LoginForm;
