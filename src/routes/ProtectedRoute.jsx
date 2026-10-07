import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRole, children }) {
  let user = null;

  try {
    const rawUser = localStorage.getItem("user");
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }

  const accessToken = localStorage.getItem("access_token");
  const userRole = String(
    user?.role || user?.user_role || user?.user?.role || user?.userDetails?.role || "",
  ).toLowerCase();
  const allowedRoleName = String(allowedRole || "").toLowerCase();

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRoleName) {
    if (userRole === "student") {
      return <Navigate to="/student" replace />;
    }

    return <Navigate to="/teacher" replace />;
  }

  return children;
}
