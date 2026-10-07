import { createContext, useContext, useState, useMemo } from "react";
import {
    getTeacherAssessment,
    getTestQuestions,
    studentAttempt,
    studentAttemptAnswer
} from "../api/StudentAssessmentApi.js";

const StudentAssessmentContext = createContext(null);

export const StudentAssessmentProvider = ({ children }) => {
    const [assessment, setAssessment] = useState([]);
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [actionStatus, setActionStatus] = useState(null);
    const [attemptAnswer, setAttemptAnswer] = useState([]);

    // Get Assessment
    const fetchAssessment = async (teacher_id, book_id, section_id) => {
        setLoading(true);
        try {
            const data = await getTeacherAssessment(teacher_id, book_id, section_id);
            setAssessment(data);
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

    // Questions
    const fetchTestQuestions = async (assessmentId) => {
        setQuestionsLoading(true);
        setQuestions([]);
        setActionStatus(null);
        try {
            const data = await getTestQuestions(assessmentId);
            const questionList = Array.isArray(data) ? data : data?.data;
            setQuestions(Array.isArray(questionList) ? questionList : []);
        } catch (error) {
            setActionStatus({
                type: "error",
                message:
                    error?.response?.data?.message ||
                    "An error occurred while getting questions.",
            });
        } finally {
            setQuestionsLoading(false);
        }
    };

    // Student Attempt 
    const createStudentAttempt = async (assessmentId, studentId, data) => {
        setActionStatus(null);
        try {
            const resp = await studentAttempt(assessmentId, studentId, data);
            setActionStatus({
                type: "success",
                message: resp?.message || "Your answers are submitted successfully.",
            });
            return true;
        } catch (error) {
            setActionStatus({
                type: "error",
                message: error?.response?.data?.message || "An error occurred while creating student attempt.",
            });
        } finally {
            setQuestionsLoading(false);
        }
    }

    // Student attempt Answer 
    const fetchAttemptAnswer = async (attemptId) => {
        try {
            const resp = await studentAttemptAnswer(attemptId);
            setAttemptAnswer(resp);
            return true;
        } catch (error) {
            setActionStatus({
                type: "error",
                message: error?.response?.data?.message || "An error occurred while fetching student attempt Answer.",
            });
        } finally {
            
        }
    }

    const value = useMemo(
        () => ({
            assessment,
            questions,
            questionsLoading,
            actionStatus,
            loading,
            attemptAnswer,
            
            // Functions
            fetchAssessment,
            fetchTestQuestions,
            createStudentAttempt,
            fetchAttemptAnswer,
        }),
        [
            assessment,
            questions,
            questionsLoading,
            actionStatus,
            loading,
            attemptAnswer,
        ],
    );

    return (
        <StudentAssessmentContext.Provider value={value}>
            {children}
        </StudentAssessmentContext.Provider>
    );
};

export const useStudentAssessment = () => useContext(StudentAssessmentContext);