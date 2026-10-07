import { useState } from "react";
import { ChevronRight, CircleUserRound, GraduationCap } from "../../icons/index.js";

const ROLE_LABELS = { student: "Student", teacher: "Teacher" };

export default function LoginForm({ onLogin, onForgotPassword, onRegister }) {

  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function changeRole(nextRole) {
    setRole(nextRole);
    setError("");
  }

  async function submitLogin(event) {
    event.preventDefault();
    setError("");

    try {
      await onLogin(role, { email: email.trim(), password });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed. Please check your credentials.");
    }
  }
  
  return (
    <>
      <div className="loginPrompt">
        <p>Log in to your school workspace</p>
        <span>Choose your account type, then enter your details.</span>
      </div>

      <div className="registrationChoices" aria-label="Create a new account">
        <p className="registrationTitle">New here?</p>
        <div className="registrationButtons">
          <button className="registrationCard student" type="button" onClick={() => onRegister("student")}>
            <span className="registrationIcon"><CircleUserRound size={20} /></span>
            <span><strong>Student</strong><small>Create learner account</small></span>
            <ChevronRight size={18} />
          </button>
          <button className="registrationCard teacher" type="button" onClick={() => onRegister("teacher")}>
            <span className="registrationIcon"><GraduationCap size={20} /></span>
            <span><strong>Teacher</strong><small>Create educator account</small></span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="roleSwitch" aria-label="Choose account type">
        <button type="button" className={role === "student" ? "active" : ""} onClick={() => changeRole("student")}>
          <CircleUserRound size={16} /> Student Login
        </button>
        <button type="button" className={role === "teacher" ? "active" : ""} onClick={() => changeRole("teacher")}>
          <GraduationCap size={16} /> Teacher Login
        </button>
      </div>

      <form className="loginForm" onSubmit={submitLogin}>
        <label>
          {ROLE_LABELS[role]} email
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="forgotButton" type="button" onClick={onForgotPassword}>Forgot password?</button>
        {error && <p className="authError" role="alert">{error}</p>}
        <button type="submit">Log in as {ROLE_LABELS[role]}</button>
      </form>

    </>
  );
}
