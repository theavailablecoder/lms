import { createContext, useContext, useState, useMemo } from "react";
import { teacher } from "../api/TeacherApi.js";
import { useNavigate } from "react-router-dom";

const TeacherContext = createContext(null);

export const TeacherProvider = ({ children }) => {
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getTeacher = async (userId) => {
    setLoadingLogin(true);
    setError(null);
    try {
      const data = await teacher(userId);
      setTeacherDetails(data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred while fetching teacher details.",
      );
    } finally {
      setLoadingLogin(false);
    }
  };

  const value = useMemo(
    () => ({
      teacherDetails,
      loadingLogin,
      error,
      getTeacher,
    }),
    [teacherDetails, loadingLogin, error],
  );

  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
};

export const  useTeacher = () => useContext(TeacherContext);
