import { useLocation } from 'react-router-dom';
import { FeaturePage } from './StudentPageSections.jsx';
import { useAssignments } from '../../context/AssignmentsContext.jsx';
import { useMessages } from '../../context/MessagesContext.jsx';

export default function StudentCodingLabPage() {
  const location = useLocation();
  const { assigned, submitHomework } = useAssignments();
  const { teacherMessages } = useMessages();

  return (
    <FeaturePage
      page="Coding Lab"
      assigned={assigned}
      teacherMessages={teacherMessages}
      onSubmitHomework={submitHomework}
      codingHomework={location.state?.codingHomework || null}
    />
  );
}

