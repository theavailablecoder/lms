import { createContext, useContext, useState, useMemo } from "react";
import { student } from "../api/StudentApi.js";

const StudentContext = createContext(null);


export const StudentProvider = ({ children }) => {
  const [studentDetails, setStudentDetails] = useState(() => {
    try {
      const account = JSON.parse(localStorage.getItem("user") || "null");
      return account?.role === "student" ? account : null;
    } catch {
      return null; 
    } 
  });
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState(null);

  const getStudent = async (userId) => {
    setLoadingLogin(true);
    setError(null);
    try {
      const data = await student(userId);
      setStudentDetails(data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred while fetching student details.",
      );
    } finally {
      setLoadingLogin(false);
    }
  };

  const value = useMemo(
    () => ({
      studentDetails,
      loadingLogin,
      error,
      getStudent,
    }),
    [studentDetails, loadingLogin, error],
  );

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
