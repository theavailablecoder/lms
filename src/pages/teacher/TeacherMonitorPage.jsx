import { StudentMonitor } from './StudentMonitoringSections.jsx';
import { useAssignments } from '../../context/AssignmentsContext.jsx';
import { useMessages } from '../../context/MessagesContext.jsx';

export default function TeacherMonitorPage() {
  const { assigned, createAssignment } = useAssignments();
  const { teacherMessages, sendTeacherMessage } = useMessages();

  return (
    <StudentMonitor
      assigned={assigned}
      teacherMessages={teacherMessages}
      onAssignSupport={createAssignment}
      onSendMessage={sendTeacherMessage}
    />
  );
}

