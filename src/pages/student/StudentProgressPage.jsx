import { FeaturePage } from './StudentPageSections.jsx';
import { useAssignments } from '../../context/AssignmentsContext.jsx';
import { useMessages } from '../../context/MessagesContext.jsx';

export default function StudentProgressPage() {
  const { assigned, submitHomework } = useAssignments();
  const { teacherMessages } = useMessages();
  return <FeaturePage page="Progress" assigned={assigned} teacherMessages={teacherMessages} onSubmitHomework={submitHomework} />;
}

