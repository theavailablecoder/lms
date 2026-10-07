import { useStudent } from '../../context/StudentContext.jsx';
import StudentDashboardWorkspace from './StudentDashboardWorkspace.jsx';

export default function StudentDashboardPage() {
  const { studentDetails } = useStudent();
  const displayName = studentDetails?.student_name;

  return <StudentDashboardWorkspace studentName={displayName} />;
}
