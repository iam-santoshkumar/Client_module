import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useParams, useHistory } from "react-router-dom";
import "./PasswordReset.css";

const PasswordReset = () => {
  const { token, email: encodedEmail } = useParams();
  const email = decodeURIComponent(encodedEmail); // Get token and email from URL params
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();
  const history = useHistory();

  const handleReset = async (event) => {
    event.preventDefault();
    setMessage("");
    // console.log("Email:", email, "Token:", token, "New Password:", newPassword);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword, token }),
        }
      );
      // console.log("Sending data:", { email, newPassword, token });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password has been reset successfully!");
        toast({
          title: "Success!",
          description: "You can now log in with your new password.",
          status: "success",
          position: "top",
          isClosable: true,
        });
        setTimeout(() => {
          history.push("/login"); // Change to your actual login route
        }, 2000);
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
      console.error("Error during password reset:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="password-reset">
      <form onSubmit={handleReset}>
        <label>
          Enter New Password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button className="reset-button" type="submit">
          Reset Password
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default PasswordReset;
