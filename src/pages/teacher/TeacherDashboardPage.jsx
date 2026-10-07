import { ChevronRight, Mail, PieChart, Send, UsersRound } from '../../icons/index.js';
import { TeacherDashboardWorkspace } from './TeacherDashboardWorkspace.jsx';
import { useAssignments } from '../../context/AssignmentsContext.jsx';
import { usePlanning } from '../../context/PlanningContext.jsx';
import { teacherRouteMap } from '../../data/navConfig.js';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboardPage() {
  const { assignments = [] } = useAssignments();
  const { calendarEvents, addCalendarEvent } = usePlanning();
  const navigate = useNavigate();
  const onNavigate = (page) => navigate('/teacher/' + (teacherRouteMap[page] || 'dashboard'));
  const cards = [
    { label: 'Students', value: 48, detail: 'Sample overview · 4 classes', icon: UsersRound, page: 'Monitor Student' },
    { label: 'Assignments', value: assignments.length, detail: assignments.length ? 'View and manage class work' : 'Ready for your first assignment', icon: Send, page: 'Home Work and Assignment' },
    { label: 'Learning progress', value: '76%', detail: 'Sample weekly average', icon: PieChart, page: 'Monitor Student' },
    { label: 'Messages', value: 9, detail: 'Sample message count', icon: Mail, page: 'Messages' },
  ];

  return (
    <section className="teacherOverview">
      <div className="overviewWelcome">
        <div><span className="eyebrow">YOUR CLASSROOM, AT A GLANCE</span><h2>Make room for great teaching.</h2><p>Plan your day, share class work, and help every student move forward.</p></div>
        <button type="button" onClick={() => onNavigate('Home Work and Assignment')}><Send size={17} /> Create assignment</button>
      </div>
      <section className="statsGrid teacherStats">
        {cards.map(({ label, value, detail, icon: Icon, page, action }) => {
          const open = action || (() => onNavigate(page));
          return (
            <button
              type="button"
              className="statCard dashboardLink"
              key={label}
              aria-label={`Open ${label.toLowerCase()}`}
              onClick={open}
            >
              <div className="statIcon"><Icon size={22} /></div>
              <div className="statText"><strong>{value}</strong><p>{label}</p><small>{detail}</small></div>
              <span className="cardOpen"><ChevronRight size={17} /></span>
            </button>
          );
        })}
      </section>
      <TeacherDashboardWorkspace
        assigned={assignments}
        calendarEvents={calendarEvents}
        onAddCalendarEvent={addCalendarEvent}
        onNavigate={onNavigate}
      />
    </section>
  );
}
