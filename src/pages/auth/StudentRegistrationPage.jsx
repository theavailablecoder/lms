import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import StudentRegistrationForm from "../../components/auth/StudentRegistrationForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function StudentRegistrationPage() {
  const navigate = useNavigate();
  const { createStudent } = useAuth();

  async function finishRegistration(studentData) {
    await createStudent(studentData);
  }

  return (
    <AuthLayout isRegistration>
      <StudentRegistrationForm onSubmit={finishRegistration} onBack={() => navigate("/login")} />
    </AuthLayout>
  );
}
