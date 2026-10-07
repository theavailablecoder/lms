import { createContext, useContext, useState, useMemo } from "react";

import {
  getBoardByTeacher,
  getSubjectsByTeacher,
  getBooksByTeacher,
  getContentsByTeacher,
  getContentFiles,
  getClassByTeacher,
} from "../api/teacherCourseApi.js";

const TeacherCourseContext = createContext(null);

export const TeacherCourseProvider = ({ children }) => {
  const [board, setBoard] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [classes, setclasses] = useState([]);
  const [contents, setContents] = useState([]);
  const [contentFiles, setContentFiles] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBoard = async (teacherId) => {
    if (!teacherId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getBoardByTeacher(teacherId);
      setBoard(data[0] || null);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred while fetching Boards.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async (teacherId) => {
    if (!teacherId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getSubjectsByTeacher(teacherId);
      setSubjects(data || []);

      // Reset Dependent data
      setSelectedSubject(null);
      setSelectedBook(null);
      setSelectedContent(null);

      setBooks([]);
      setContents([]);
      setContentFiles([]);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred while fetching Subjects.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadBooks = async (subjectId, teacherId) => {
    if (!subjectId || !teacherId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getBooksByTeacher(subjectId, teacherId);
      setBooks(data || []);

      // Reset Dependent data
      setSelectedBook(null);
      setSelectedContent(null);

      setContents([]);
      setContentFiles([]);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred while fetching Books.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async (bookId, teacherId) => {
    if (!bookId || !teacherId) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getClassByTeacher(bookId, teacherId);
      setclasses(data || []);

      // Reset Dependent data
      setSelectedClass(null);
      setSelectedContent(null);

      setContents([]);
      setContentFiles([]);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred while fetching class.",
      );
    } finally {
      setLoading(false);
    }

    
  }

  const loadContents = async (bookId, teacherId) => {
    if (!bookId || !teacherId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getContentsByTeacher(bookId, teacherId);
      setContents(data || []);

      // Reset Dependent data
      setSelectedContent(null);

      setContentFiles([]);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred while fetching Contents.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadContentFiles = async (bookId, contentId) => {
    if (!bookId || !contentId) {
      return;
    }

    setSearchLoading(true);
    setError(null);
    try {
      const data = await getContentFiles(bookId, contentId);
      setContentFiles(data || []);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "An error occurred while fetching Categories.",
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      board,
      subjects,
      books,
      classes,
      contents,
      contentFiles,

      selectedSubject,
      selectedBook,
      selectedClass,
      selectedContent,

      loading,
      searchLoading,
      error,

      setSelectedSubject,
      setSelectedBook,
      setSelectedClass,
      setSelectedContent,

      loadBoard,
      loadSubjects,
      loadBooks,
      loadClasses,
      loadContents,
      loadContentFiles,
    }),
    [
      board,
      subjects,
      books,
      contents,
      contentFiles,

      selectedSubject,
      selectedBook,
      selectedContent,

      loading,
      searchLoading,
      error,
    ],
  );

  return (
    <TeacherCourseContext.Provider value={value}>
      {children}
    </TeacherCourseContext.Provider>
  );
};

export const useTeacherCourse = () => useContext(TeacherCourseContext);
