import { createContext, useContext, useState, useMemo } from "react";
import {
  getSubjects,
  getBooks,
  getTests,
  getSections,
  createAssessment,
  getAssessments,
  deleteAssessment,
  getClasses,
  submittedAssessment,
  updateSubmittedAssessment,
  updateAssessment
} from "../api/TeacherAssessmentApi.js";

const TeacherAssessmentContext = createContext(null);

export const TeacherAssessmentProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [classes, setClasses] = useState({});
  const [sections, setSections] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [assignedAssessment, setAssignedAsseessment] = useState([]);
  const [teacherBooks, setTeacherBooks] = useState([]);
  const [teacherClass, setTeacherClass] = useState([]);
  const [teacherSection, setTeacherSection] = useState([]);
  
  const [getSubmittedAssessment, setGetSubmittedAssessment] = useState([]);

  // Selected States 
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedClass, setSelectedclass] = useState(null);
  const [selectedSection, setSelectedSections] = useState(null);
  const [selectedTests, setSelectedTests] = useState(null);
  const [selectedTeacherSection, setSelectedTeacherSection] = useState(null);
  const [selectedTeacherBook, setSelectedTeacherBook] = useState(null);

  // Subjects
  const loadSubjects = async (teacher_id) => {
    setLoading(true);
    setActionStatus(null);
    try {
      const data = await getSubjects(teacher_id);
      setSubjects(data);

      // Reset Dependent data
      setSelectedSubject(null);
      setSelectedBook(null);
      setSelectedclass(null);
      setSelectedSections(null);
      setSelectedTests(null);

      setBooks([]);
      setClasses([]);
      setSections([]);
      setTests([]);

      setTeacherBooks([]);
      setTeacherClass([]);
      setTeacherSection([]);

      setSelectedTeacherBook(null);
      setSelectedTeacherSection(null);
    } catch (error) {

      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "An error occurred while fetching Subjects.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Books
  const loadBooks = async (subject_id, teacher_id) => {
    setLoading(true);
    setActionStatus(null);
    try {
      const data = await getBooks(subject_id, teacher_id);
      setBooks(data);

      // Reset Dependent data
      setSelectedBook(null);
      setSelectedclass(null);
      setSelectedSections(null);
      setSelectedTests(null);

      setSections([]);
      setTests([]);
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "An error occurred while fetching Books.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sections
  const loadSections = async (class_id) => {
    setLoading(true);
    setActionStatus(null);
    try {
      const data = await getSections(class_id);
      setSections(data);

      // Reset Dependent data
      setSelectedSections(null);
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "An error occurred while fetching Sections.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get Test By Book
  const loadTests = async (book_id) => {
    setLoading(true);
    setActionStatus(null);
    try {
      const data = await getTests(book_id);
      setTests(data);
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "An error occurred while fetching tests.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create Assessment
  const addAssessment = async (data) => {
    setActionStatus(null);
    setLoading(true);
    try {
      const resp = await createAssessment(data);
      setActionStatus({
        type: "success",
        message: resp?.message || "Assessment created successfully.",
      });
      return true;
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message || "Unable to create assessment.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get Assessment
  const fetchAssessment = async (teacher_id) => {
    setLoading(true);
    try {
      const data = await getAssessments(teacher_id);
      setAssignedAsseessment(data);
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "An error occurred while getting assessment.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Assessment
  const removeAssessment = async (assignment_id) => {
    setLoading(true);
    setActionStatus(null);

    try {
      const data = await deleteAssessment(assignment_id);
      setActionStatus({
        type: "success",
        message: data?.message || "Assessment deleted successfully.",
      });
      return true;
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message || "Unable to delete assessment.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Teacher Books
  const fetchBooks = async (subject_id, teacher_id) => {
    setLoading(true);
    try {
      const data = await getBooks(subject_id, teacher_id);
      setTeacherBooks(data);
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "An error occurred while getting Books.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Teacher Section
  const fetchSection = async (class_id) => {
    setLoading(true);
    try {
      const data = await getSections(class_id);
      setTeacherSection(data);

      setSelectedTeacherSection(null);
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "An error occurred while getting sections.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get Submitted Assessment
  const fetchSubmittedAssessment = async (teacher_id, bookId, sectionId) => {
    setLoading(true);
    try {
      const data = await submittedAssessment(teacher_id, bookId, sectionId);
      setGetSubmittedAssessment(data);
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "An error occurred while getting submitted assessment.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update Submitted Assessment
  const changeSubmittedAssessment = async (assessmentId, studentId, data) => {
    setActionStatus(null);
    setLoading(true);
    try {
      const resp = await updateSubmittedAssessment(assessmentId, studentId, {answers: data});
      // setActionStatus({
      //   type: "success",
      //   message: resp?.message || "Assessment checked successfully.",
      // });
      return true;
    } catch (error) {
      setActionStatus({
        type: "error",
        message:
          error?.response?.data?.message || "Unable to checked assessment.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update Assessment
const changeAssessment = async (assessmentId, data) => {
  setActionStatus(null);
  setLoading(true);

  try {
    const resp = await updateAssessment(assessmentId, data);

    setActionStatus({
      type: "success",
      message: resp?.message || "Assessment updated successfully.",
    });

    return true;
  } catch (error) {
    setActionStatus({
      type: "error",
      message:
        error?.response?.data?.message || "Unable to update assessment.",
    });

    return false;
  } finally {
    setLoading(false);
  }
};

  const value = useMemo(
    () => ({
      subjects,
      books,
      classes,
      sections,
      tests,
      assignedAssessment,
      getSubmittedAssessment,
      teacherBooks,
      teacherClass, 
      teacherSection,

      selectedSubject,
      selectedBook,
      selectedClass,
      selectedSection,
      selectedTests,
      selectedTeacherBook,
      selectedTeacherSection,
     

      loading,
      actionStatus,

      // Functions
      loadSubjects,
      loadBooks,
      loadSections,
      loadTests,
      addAssessment,
      fetchAssessment,
      removeAssessment,
      fetchBooks,
      fetchSection,
      changeAssessment,
      fetchSubmittedAssessment,
      changeSubmittedAssessment,

      setClasses,
      setTeacherClass,

      // Selected States
      setSelectedSubject,
      setSelectedBook,
      setSelectedclass,
      setSelectedSections,
      setSelectedTests,
      setSelectedTeacherBook,
      setSelectedTeacherSection,
    }),
    [
      subjects,
      books,
      classes,
      sections,
      tests,
      assignedAssessment,
      getSubmittedAssessment,
      teacherBooks,
      teacherClass, 
      teacherSection,
      selectedSubject,
      selectedBook,
      selectedClass,
      selectedSection,
      selectedTests,
      selectedTeacherSection,
      loading,
      actionStatus,
    ],
  );

  return (
    <TeacherAssessmentContext.Provider value={value}>
      {children}
    </TeacherAssessmentContext.Provider>
  );
};

export const useTeacherAssessment = () => useContext(TeacherAssessmentContext);
