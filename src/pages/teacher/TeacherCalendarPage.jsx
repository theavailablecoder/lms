import { TeacherCalendar } from './TeacherCalendarView.jsx';
import { useAssignments } from '../../context/AssignmentsContext.jsx';
import { usePlanning } from '../../context/PlanningContext.jsx';

export default function TeacherCalendarPage() {
  const { createAssignment } = useAssignments();
  const { calendarEvents, addCalendarEvent } = usePlanning();

  return (
    <TeacherCalendar
      events={calendarEvents}
      onAddEvent={addCalendarEvent}
      onAssignWork={createAssignment}
    />
  );
}

