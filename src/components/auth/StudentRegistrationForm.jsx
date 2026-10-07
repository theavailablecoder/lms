import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function StudentRegistrationForm({ onSubmit, onBack }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    studentClasses,
    studentSections,
    loadStudentClasses,
    loadStudentSections,
  } = useAuth();

  // Load student classes and sections when the component mounts
  useEffect(() => {
    loadStudentClasses();
  }, []);

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    loadStudentSections(selectedClassId);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const form = event.target;
    const studentData = {
      student_name: form.fullName.value.trim(),
      student_mobile: form.mobile.value.trim(),
      student_email: form.email.value.trim(),
      student_password: password,
      student_password_confirmation: confirmPassword,
      school_name: form.schoolName.value.trim(),
      status: "active",
      class_id: Number(form.studentClass.value),
      section_id: Number(form.section.value),
      teacher_code: form.teacherCode.value.trim(),
      address: form.address.value.trim(),
    };
    setError("");
    setSubmitting(true);

    try {
      await onSubmit(studentData);
      setSuccessMessage("Student registration successful.");
    } catch (requestError) {
      console.error("Student registration failed:", requestError);
      setError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="loginForm registerForm studentRegisterForm"
      onSubmit={handleSubmit}
    >
      <div className="registerTitle">New Student Registration</div>
      <div className="registerGrid">
        <label className="spanThree">
          Full name *
          <input name="fullName" type="text" minLength="3" required />
        </label>
        <label className="spanThree">
          Mobile *
          <input
            name="mobile"
            type="tel"
            pattern="[0-9]{10}"
            title="Enter a 10-digit mobile number"
            required
          />
        </label>
        <label className="spanThree">
          Email *<input name="email" type="email" required />
        </label>
        <label className="spanThree">
          Create password *
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength="6"
            required
          />
        </label>
        <label className="spanThree">
          Confirm password *
          <input
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength="6"
            required
          />
        </label>
        <label className="spanThree">
          School name *<input name="schoolName" type="text" required />
        </label>
        <label className="spanThree">
          Class *
          <select
            name="studentClass"
            defaultValue=""
            onChange={handleClassChange}
            required
          >
            <option value="" disabled>
              Select class
            </option>
            {studentClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_name}
              </option>
            ))}
          </select>
        </label>
        <label className="spanThree">
          Section *
          <select name="section" defaultValue="" required>
            <option value="" disabled>
              Select section
            </option>
            {studentSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.section_name}
              </option>
            ))}
          </select>
        </label>
        <label className="spanThree">
          Teacher code *
          <input name="teacherCode" type="text" minLength="4" required />
        </label>
        <label className="registerWide">
          Address
          <textarea name="address" />
        </label>
      </div>
      {error && (
        <p className="authError" role="alert">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="authSuccess" role="status">
          {successMessage}
        </p>
      )}
      <div className="registrationActions">
        <button
          className="registerSubmit"
          type="submit"
          disabled={submitting || Boolean(successMessage)}
        >
          {submitting
            ? "Registering..."
            : successMessage
              ? "Registration complete"
              : "Register Student"}
        </button>
        <button
          className="registrationBackButton"
          type="button"
          onClick={onBack}
        >
          Back to login
        </button>
      </div>
    </form>
  );
}
