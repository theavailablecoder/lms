import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  ChevronRight,
  CircleUserRound,
  Eye,
  EyeOff,
  GraduationCap,
  X,
} from "../../icons/index.js";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function LoginPage() {
  const { createLogin, loadingLogin, error } = useAuth();
  const [activeLoginType, setActiveLoginType] = useState("teacher");
  const [showAccountChoices, setShowAccountChoices] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    createLogin({ ...data, role: activeLoginType });
  };

  return (
    <AuthLayout>
      <div className="roleSwitch" aria-label="Choose account type">
        <button
          type="button"
          onClick={() => setActiveLoginType("student")}
          className={activeLoginType === "student" ? "active" : ""}
          aria-pressed={activeLoginType === "student"}
        >
          <CircleUserRound size={16} /> Student Login
        </button>

        <button
          type="button"
          onClick={() => setActiveLoginType("teacher")}
          className={activeLoginType === "teacher" ? "active" : ""}
          aria-pressed={activeLoginType === "teacher"}
        >
          <GraduationCap size={16} /> Teacher Login
        </button>
      </div>

      <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <p className="authError" role="alert">
            {error}
          </p>
        )}

        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            placeholder="Enter your email address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Please enter a valid email",
              },
            })}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </label>

        <label>
          Password
          <span className="passwordInputWrap">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              className="passwordVisibilityToggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </label>

        <button type="submit" disabled={loadingLogin}>
          {loadingLogin ? "Logging in..." : "Log In →"}
        </button>

        <button
          className="createAccountTrigger"
          type="button"
          onClick={() => setShowAccountChoices(true)}
        >
          <span>Not a member?</span> <strong>Create a new account</strong>
        </button>
      </form>

      {showAccountChoices && (
        <div
          className="accountChoiceOverlay"
          role="presentation"
          onMouseDown={() => setShowAccountChoices(false)}
        >
          <section
            className="accountChoicePopup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-choice-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="accountChoiceClose"
              type="button"
              aria-label="Close"
              onClick={() => setShowAccountChoices(false)}
            >
              <X size={18} />
            </button>
            <div className="accountChoiceHeading">
              <span>Create account</span>
              <h3 id="account-choice-title">Choose your account type</h3>
              <p>Select how you’ll use your classroom workspace.</p>
            </div>
            <div className="accountChoiceCards">
              <Link
                to="/register/student"
                className="accountChoiceCard student"
              >
                <span className="accountChoiceIcon">
                  <CircleUserRound size={24} />
                </span>
                <span>
                  <strong>Student</strong>
                  <small>Create learner account</small>
                </span>
                <ChevronRight size={19} />
              </Link>
              <Link
                to="/register/teacher"
                className="accountChoiceCard teacher"
              >
                <span className="accountChoiceIcon">
                  <GraduationCap size={24} />
                </span>
                <span>
                  <strong>Teacher</strong>
                  <small>Create educator account</small>
                </span>
                <ChevronRight size={19} />
              </Link>
            </div>
          </section>
        </div>
      )}
    </AuthLayout>
  );
}
