import { AuthProvider } from "./AuthContext.jsx";
import { AssignmentsProvider } from "./AssignmentsContext.jsx";
import { MessagesProvider } from "./MessagesContext.jsx";
import { PlanningProvider } from "./PlanningContext.jsx";
import { TeacherProvider } from "./TeacherContext.jsx";
import { StudentProvider } from "./StudentContext.jsx";
import { TeacherCourseProvider } from "./TeacherCourseContext.jsx";
import { StudentCourseProvider } from "./StudentCourseContext.jsx";
import { TeacherAssessmentProvider } from "./TeacherAssessmentContext.jsx";
import { StudentAssessmentProvider } from "./StudentAssessmentContext.jsx";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <TeacherProvider>
        <TeacherCourseProvider>
          <TeacherAssessmentProvider>
            <StudentAssessmentProvider>
              <StudentProvider>
                <StudentCourseProvider>
                  <AssignmentsProvider>
                    <MessagesProvider>
                      <PlanningProvider>{children}</PlanningProvider>
                    </MessagesProvider>
                  </AssignmentsProvider>
                </StudentCourseProvider>
              </StudentProvider>
            </StudentAssessmentProvider>
          </TeacherAssessmentProvider>
        </TeacherCourseProvider>
      </TeacherProvider>
    </AuthProvider>
  );
}
