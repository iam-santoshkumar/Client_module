// PasswordResetRequest.js
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import "./PasswordReset.css";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();

  const handleRequest = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/request-password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset email sent!");
        toast({
          title: "Email Sent!",
          description: "Check your email for the password reset link.",
          status: "success",
          position: "top",
          isClosable: true,
        });
      } else {
        setMessage(`Error: ${data.message}`);
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="password-reset">
      <form onSubmit={handleRequest}>
        <label>
          Enter your email to reset your password
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button  className="reset-button" type="submit">Request Password Reset</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default PasswordResetRequest;
