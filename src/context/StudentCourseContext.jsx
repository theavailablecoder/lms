import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { getBoardsByStudent, getCategoriesByStudent, getClassesByStudent, getStudentContent, getSubjectsByStudent, getTeacherByStudent } from "../api/StudentCouseApi.js";

const StudentCourseContext = createContext(null);
const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return value ? [value] : [];
};

export function StudentCourseProvider({ children }) {
  const courseRequestRef = useRef(0);
  const [teacherId, setTeacherId] = useState(null);
  const [board, setBoard] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contentFiles, setContentFiles] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null); 
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

const loadCourseFilters = useCallback(async (studentId) => {
    if (!studentId) return;

    setLoading(true);
    setError(null);

    try {
        const loadedTeacherId = await getTeacherByStudent(studentId);
        setTeacherId(loadedTeacherId);

        const boardData = await getBoardsByStudent(studentId, loadedTeacherId);
        const board = asArray(boardData)[0] || null;
        setBoard(board);

        const classData = await getClassesByStudent(studentId, loadedTeacherId);
        const assignedClasses = asArray(classData);
        setClasses(assignedClasses);

        if (board) {
            const subjectData = await getSubjectsByStudent(
                loadedTeacherId,
                board.id
            );

            setSubjects(asArray(subjectData));
        } else {
            setSubjects([]);
        }

    } catch (error) {
        setError(
            error?.response?.data?.message ||
            "Unable to load your courses."
        );
    } finally {
        setLoading(false);
    }
}, []);

  const loadCategories = useCallback(async (studentId, subject, classItem) => {
    if (!studentId || !subject?.id || !classItem?.id) return;
    const requestId = ++courseRequestRef.current;
    setCategories([]);
    setSelectedCategory(null);
    setContentFiles([]);
    setSearchLoading(true);
    setError(null);
    try {
      const loadedCategories = asArray(
        await getCategoriesByStudent(
          teacherId,
          subject.id,
          classItem.id,
        ),
      );
      if (requestId !== courseRequestRef.current) return;
      setCategories(loadedCategories);
      setSelectedCategory(null);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to load course resources.");
    } finally {
      if (requestId === courseRequestRef.current) setSearchLoading(false);
    }
  }, [teacherId]);

  const selectSubject = useCallback((subject) => {
    ++courseRequestRef.current;
    setSelectedSubject(subject);
    setCategories([]);
    setSelectedCategory(null);
    setContentFiles([]);
    setSearchLoading(false);
    setError(null);
  }, []);

  const selectClass = useCallback((classItem) => {
    ++courseRequestRef.current;
    setSelectedClass(classItem);
    setCategories([]);
    setSelectedCategory(null);
    setContentFiles([]);
    setSearchLoading(false);
    setError(null);
  }, []);

  const loadContent = useCallback(async (studentId, category) => {
    if (!studentId || !selectedSubject?.id || !category?.id) return; 
    const requestId = ++courseRequestRef.current;
    setSelectedCategory(category);
    setContentFiles([]);
    setSearchLoading(true);
    setError(null);
    try {
      const files = await getStudentContent( teacherId, selectedClass.id, selectedSubject.id, category.id);
      if (requestId !== courseRequestRef.current) return;
      setContentFiles(asArray(files));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to open this resource.");
    } finally {
      if (requestId === courseRequestRef.current) setSearchLoading(false);
    }
  }, [teacherId, selectedClass, selectedSubject, ]);

  const value = useMemo(() => ({
    board, subjects, classes, categories, contentFiles,
    selectedSubject, selectedClass, selectedCategory,
    loading, searchLoading, error,
    setSelectedSubject: selectSubject, setSelectedClass: selectClass,
    loadCourseFilters, loadCategories, loadContent,
  }), [board, subjects, classes, categories, contentFiles, selectedSubject, selectedClass,
    selectedCategory, loading, searchLoading, error, loadCourseFilters, loadCategories, loadContent,
    selectSubject, selectClass]);

  return <StudentCourseContext.Provider value={value}>{children}</StudentCourseContext.Provider>;
}

export const useStudentCourse = () => useContext(StudentCourseContext);