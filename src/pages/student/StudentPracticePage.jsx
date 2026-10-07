import { FeaturePage } from './StudentPageSections.jsx';
import { useAssignments } from '../../context/AssignmentsContext.jsx';
import { useMessages } from '../../context/MessagesContext.jsx';

export default function StudentPracticePage() {
  const { assigned, submitHomework } = useAssignments();
  const { teacherMessages } = useMessages();
  return <FeaturePage page="Practice" assigned={assigned} teacherMessages={teacherMessages} onSubmitHomework={submitHomework} />;
}

