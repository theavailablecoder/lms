import { createContext, useContext, useState, useMemo } from "react";
import {
  login,
  logout as logoutApi,
  teacher,
  student,
  getBoards,
  getClasses,
  getSubjects,
  getBooks,
  getSections,
} from "../api/authApi.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState(null);

  // TEACHER REGISTRATION DATA
  const [boards, setBoards] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [booksBySubject, setBooksBySubject] = useState({});

  const [studentClasses, setStudentClasses] = useState([]);
  const [studentSections, setStudentSections] = useState([]);

  const [loadingRegistrationData, setLoadingRegistrationData] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState({});

  const navigate = useNavigate();

  const createLogin = async (credentials) => {
    setLoadingLogin(true);
    setError(null);
    try {
      const data = await login(credentials);
      if (data?.access_token) {
        if (!data.user_details?.id) {
          throw new Error(
            "The API did not return account details for this user.",
          );
        }

        const apiAccount = { ...data.user, ...(data.user_details || {}) };
        localStorage.setItem("access_token", data?.access_token);
        localStorage.setItem("user", JSON.stringify(apiAccount));
        localStorage.setItem("user_id", String(data.user_details.id));
        setUser(apiAccount);
        if (data?.user?.role === "student") {
          navigate("/student/dashboard");
        } else if (data?.user?.role === "teacher") {
          navigate("/teacher/dashboard");
        }
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred during login.",
      );
    } finally {
      setLoadingLogin(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  const createTeacher = async (teacherData) => {
    setLoadingLogin(true);
    setError(null);

    try {
      const data = await teacher(teacherData);
      return data;
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred during teacher registration.",
      );
      throw error;
    } finally {
      setLoadingLogin(false);
    }
  };

  const createStudent = async (studentData) => {
    setLoadingLogin(true);
    setError(null);

    try {
      return await student(studentData);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred during student registration.",
      );
      throw error;
    } finally {
      setLoadingLogin(false);
    }
  };

  const loadStudentClasses = async () => {
    try {
      setLoadingRegistrationData(true);
      setError(null);

      const data = await getClasses();
      setStudentClasses(data || []);
      return data || [];
    } catch (error) {
      setError(
        error?.response?.data?.message || "Unable to load student classes.",
      );
      throw error;
    } finally {
      setLoadingRegistrationData(false);
    }
  };

  const loadStudentSections = async (classId) => {
    try {
      setLoadingRegistrationData(true);
      setError(null);

      const data = await getSections(classId);
      setStudentSections(data || []);
      return data || [];
    } catch (error) {
      setError(
        error?.response?.data?.message || "Unable to load student sections.",
      );
      throw error;
    } finally {
      setLoadingRegistrationData(false);
    }
  };

  // LOAD BOARDS + CLASSES
  const loadTeacherRegistrationData = async () => {
    try {
      setLoadingRegistrationData(true);
      setError(null);

      const [boardData, classData] = await Promise.all([
        getBoards(),
        getClasses(),
      ]);

      setBoards(boardData || []);
      setClasses(classData || []);

      return {
        boards: boardData || [],
        classes: classData || [],
      };
    } catch (error) {
      setError(
        error?.response?.data?.message || "Unable to load boards and classes.",
      );

      throw error;
    } finally {
      setLoadingRegistrationData(false);
    }
  };

  // LOAD SUBJECTS
  const loadSubjects = async (boardId) => {
    if (!boardId) {
      setSubjects([]);
      setBooksBySubject({});
      return;
    }
    try {
      setLoadingSubjects(true);
      setError(null);

      const data = await getSubjects(boardId);

      setSubjects(data || []);

      return data || [];
    } catch (error) {
      setError(error?.response?.data?.message || "Unable to load subjects.");

      throw error;
    } finally {
      setLoadingSubjects(false);
    }
  };

  // LOAD BOOKS FOR SUBJECT
  const loadBooks = async (subjectId) => {
    if (!subjectId) {
      return [];
    }

    const id = String(subjectId);

    // Don't call API again if books are already loaded
    if (booksBySubject[id]) {
      return booksBySubject[id];
    }

    try {
      setLoadingBooks((current) => ({
        ...current,
        [id]: true,
      }));

      setError(null);

      const data = await getBooks(subjectId);

      setBooksBySubject((current) => ({
        ...current,
        [id]: data || [],
      }));
      return data || [];
    } catch (error) {
      setError(error?.response?.data?.message || "Unable to load books.");

      throw error;
    } finally {
      setLoadingBooks((current) => ({
        ...current,
        [id]: false,
      }));
    }
  };

  const value = useMemo(
    () => ({
      user,
      createLogin,
      createTeacher,
      createStudent,
      logout,
      loadingLogin,
      error,

      // Teacher registration data
      boards,
      classes,
      subjects,
      booksBySubject,

      // Student registration data
      studentClasses,
      studentSections,

      loadingRegistrationData,
      loadingSubjects,
      loadingBooks,

      loadStudentClasses,
      loadStudentSections,

      loadTeacherRegistrationData,
      loadSubjects,
      loadBooks,
    }),
    [
      user,
      loadingLogin,
      error,

      boards,
      classes,
      subjects,
      booksBySubject,

      loadingRegistrationData,
      loadingSubjects,
      loadingBooks,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
