import { FeaturePage } from './StudentPageSections.jsx';
import { useAssignments } from '../../context/AssignmentsContext.jsx';
import { useMessages } from '../../context/MessagesContext.jsx';

export default function StudentLibraryPage() {
  const { assigned, submitHomework } = useAssignments();
  const { teacherMessages } = useMessages();
  return <FeaturePage page="Library" assigned={assigned} teacherMessages={teacherMessages} onSubmitHomework={submitHomework} />;
}

