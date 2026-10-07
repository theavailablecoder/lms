import { useNavigate } from 'react-router-dom';
import { FeaturePage } from './StudentPageSections.jsx';
import { useAssignments } from '../../context/AssignmentsContext.jsx';
import { useMessages } from '../../context/MessagesContext.jsx';

export default function StudentHomeworkPage() {
  const navigate = useNavigate();
  const { assigned, submitHomework } = useAssignments();
  const { teacherMessages } = useMessages();

  const openCodingHomework = (homework) => {
    navigate('/student/coding-lab', { state: { codingHomework: homework } });
  };

  return (
    <FeaturePage
      page="Homework"
      assigned={assigned}
      teacherMessages={teacherMessages}
      onSubmitHomework={submitHomework}
      onOpenCodingHomework={openCodingHomework}
    />
  );
}

