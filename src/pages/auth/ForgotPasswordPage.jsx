import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  function requestReset(event) {
    event.preventDefault();
    setMessage("Password reset instructions have been sent to your email.");
  }

  return (
    <AuthLayout>
      <div className="loginPrompt">
        <p>Reset your password</p>
        <span>Enter the email connected to your account.</span>
      </div>
      <form className="loginForm" onSubmit={requestReset}>
        <label>
          Email address
          <input type="email" required />
        </label>
        {message && <p className="authSuccess" role="status">{message}</p>}
        <button type="submit">Send Reset Link</button>
        <button className="forgotButton" type="button" onClick={() => navigate("/login")}>Back to login</button>
      </form>
    </AuthLayout>
  );
}
