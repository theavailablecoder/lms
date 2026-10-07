import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  Code2,
  FileCheck2,
  FileText,
  Gauge,
  GraduationCap,
  Layers3,
  Library,
  ListChecks,
  LogOut,
  Mail,
  Medal,
  Menu,
  PenLine,
  PieChart,
  Play,
  SearchCheck,
  Send,
  Settings,
  Sparkles,
  Trophy,
  UsersRound,
  X,
} from "../../icons/index.js";
// import codeGptBookCover from "../../assets/CodeGPT V4 _Book_1.jpg";
import orangeClassroomLogo from "../../assets/Classroom logo_01.png";
import scheduleIllustration from "../../assets/schedule.png";
import { studentNavGroups, teacherNav } from "../../data/navConfig.js";
import {
  stats,
  assistantModes,
  assignments,
  courses,
  week,
  activities,
  studentProfile,
  timetable,
  studentAnnouncements,
  students,
  starterCalendarEvents,
  pageData,
  teacherFeatureData,
  starterExamPlans,
  codingLabs,
  phetSimulations,
  phetProjectPages,
  defaultHtmlCode,
  defaultPythonCode,
  defaultJavaCode,
  defaultSqlCode,
  studentCodingExercises,
} from "../../data/mockData.js";
import { formatDueDate, formatFileSize } from "../../utils/formatters.js";
import { getTimeGreeting } from "../../utils/greetings.js";
import { getCodingLabIdFromHomework } from "../../utils/codingLab.js";
import { buildAssistantReply } from "../../utils/assistant.js";
import { runPythonCode, runJavaCode, runSqlCode } from "../../utils/codeRunner.js";
import { Badge } from '../../components/shared/SharedComponents.jsx';

function formatScheduleTime(value = "") {
  const [hoursValue, minutes = "00"] = value.split(":");
  const hours = Number(hoursValue);
  if (!Number.isFinite(hours)) return value;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${String(displayHours).padStart(2, "0")}:${minutes} ${period}`;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function TeacherDashboardWorkspace({ assigned, calendarEvents, onAddCalendarEvent, onNavigate }) {
  const [today, setToday] = useState(() => new Date());
  const todayDateKey = getLocalDateKey(today);
  const upcomingClasses = calendarEvents.filter((event) => event.date === todayDateKey).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const selectedDay = today;
  const [showMiniEventPopup, setShowMiniEventPopup] = useState(false);
  const [newMiniEvent, setNewMiniEvent] = useState({
    title: "",
    date: calendarEvents[0]?.date || "2026-07-08",
    time: "10:00",
    className: "Class 8 - A",
    type: "Class",
  });
  const [miniCalendarDate, setMiniCalendarDate] = useState(
    () => new Date(`${calendarEvents[0]?.date || "2026-07-01"}T00:00:00`),
  );
  const calendarAnchor = miniCalendarDate;
  const calendarYear = calendarAnchor.getFullYear();
  const calendarMonth = calendarAnchor.getMonth();
  const visibleMiniEvents = calendarEvents.filter((event) => {
    const date = new Date(`${event.date}T00:00:00`);
    return date.getFullYear() === calendarYear && date.getMonth() === calendarMonth;
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = new Date();
      setToday((current) => getLocalDateKey(current) === getLocalDateKey(now) ? current : now);
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="teacherDashboardWorkspace">
      <section className="panel dashboardSchedule">
        <div className="dashboardSectionHeading">
          <div className="scheduleDateBadge" aria-label={selectedDay.toLocaleDateString("en-IN", { dateStyle: "full" })}>
            <span>{selectedDay.toLocaleDateString("en-IN", { month: "short" })}</span>
            <strong>{selectedDay.getDate()}</strong>
          </div>
          <div>
            <span className="eyebrow">PLAN YOUR DAY</span>
            <h2>On your schedule</h2>
            <p>{upcomingClasses.length ? `${upcomingClasses.length} ${upcomingClasses.length === 1 ? 'activity' : 'activities'} today · All times are local` : 'A little space to plan something great.'}</p>
          </div>
          <span className="scheduleHeadingIcon" aria-hidden="true">
            <CalendarDays size={22} />
          </span>
          <button
            type="button"
            className="textAction"
            onClick={() => onNavigate("Calendar")}
          >
            View calendar <ChevronRight size={16} />
          </button>
        </div>
        <div className="schedulePlannerBody">
        <div className={`scheduleList ${upcomingClasses.length > 3 ? "hasMoreEvents" : ""}`}>
          {upcomingClasses.map((event) => (
            <article
              className="scheduleItem"
              key={`${event.title}-${event.date}`}
            >
              <span className={`scheduleMarker ${event.type === "Meeting" ? "meeting" : "class"}`} aria-hidden="true" />
              <span className={`scheduleEventIcon ${event.type === "Meeting" ? "meeting" : event.title.toLowerCase().includes("review") ? "review" : "class"}`} aria-hidden="true">
                {event.type === "Meeting" ? <UsersRound size={20} /> : event.title.toLowerCase().includes("review") ? <FileCheck2 size={20} /> : <BookOpen size={20} />}
              </span>
              <div className="scheduleTime">
                <strong>{formatScheduleTime(event.time)}</strong>
                <span>{event.type}</span>
              </div>
              <div>
                <strong>{event.title}</strong>
                <p>
                  {event.className} · {event.note}
                </p>
              </div>
              <Badge tone={event.type === "Meeting" ? "orange" : "green"}>
                {event.type === "Meeting" ? "Upcoming" : "Scheduled"}
              </Badge>
            </article>
          ))}
          {!upcomingClasses.length && <div className="scheduleTodayEmpty"><CalendarDays size={28} /><strong>Your day is open</strong><p>Plan a lesson, review, or meeting in your calendar.</p><button type="button" className="textAction" onClick={() => onNavigate('Calendar')}>Plan an activity <ChevronRight size={16} /></button></div>}
          {upcomingClasses.length > 3 && <div className="scheduleMoreHint"><ChevronDown size={14} /> Scroll to view {upcomingClasses.length - 3} more</div>}
        </div>
        <aside className="scheduleIllustrationPanel" aria-label="Daily planning illustration">
          <div><span>Stay organised</span><strong>Plan. Teach. Inspire.</strong><p>Your complete teaching day, at a glance.</p></div>
          <img src={scheduleIllustration} alt="Teacher planning a classroom schedule" />
        </aside>
        </div>
      </section>

      <aside className="panel dashboardQuickActions">
        <span className="eyebrow">TEACHING SHORTCUTS</span>
        <h2>What would you like to do?</h2>
        <p>Your everyday tools, one click away.</p>
        <button
          type="button"
          onClick={() => onNavigate("Home Work and Assignment")}
        >
          <span className="quickActionIcon"><ClipboardCheck size={20} /></span>
          <span><strong>Share an assignment</strong><small>Give students their next challenge</small></span>
          <ChevronRight size={16} />
        </button>
        <button type="button" onClick={() => onNavigate("Test & Exam")}>
          <span className="quickActionIcon"><ListChecks size={20} /></span>
          <span><strong>Build an assessment</strong><small>Prepare a test or check understanding</small></span>
          <ChevronRight size={16} />
        </button>
        <button type="button" onClick={() => onNavigate("Monitor Student")}>
          <span className="quickActionIcon"><UsersRound size={20} /></span>
          <span><strong>Check student progress</strong><small>See who could use a helping hand</small></span>
          <ChevronRight size={16} />
        </button>
        <button type="button" onClick={() => onNavigate("Calendar")}>
          <span className="quickActionIcon"><CalendarDays size={20} /></span>
          <span><strong>Plan your week</strong><small>Make time for lessons and meetings</small></span>
          <ChevronRight size={16} />
        </button>
      </aside>

      <section className="panel dashboardAssignments">
        <div className="dashboardSectionHeading">
          <div>
            <span className="eyebrow">Work overview</span>
            <h2>Latest class work</h2>
            <p>Pick up where you left off. Open an assignment to manage it.</p>
          </div>
          <span className="dashboardAssignmentCount"><strong>{assigned.length}</strong><small>Active work</small></span>
          <button
            type="button"
            className="textAction"
            onClick={() => onNavigate("Home Work and Assignment")}
          >
            Manage work <ChevronRight size={16} />
          </button>
        </div>
        {assigned.length ? (
          <div className="assignmentPreviewList">
            {assigned.slice(0, 3).map((item, index) => (
              <button type="button" className="assignmentPreviewCard" onClick={() => onNavigate("Home Work and Assignment")} key={`${item.title}-${index}`}>
                <div className="assignmentIcon">
                  <ClipboardCheck size={18} />
                </div>
                <div className="assignmentPreviewContent">
                  <span>{item.subject || "General"} · {item.homeworkType || item.type}</span>
                  <strong>{item.title}</strong>
                  <p>
                    {item.student} · Due {formatDueDate(item.due)}
                  </p>
                </div>
                <div className="assignmentPreviewSide"><Badge tone={item.priority === "High" ? "orange" : "green"}>{item.status}</Badge><small>{item.priority || "Medium"} priority</small></div>
                <ChevronRight className="assignmentPreviewArrow" size={17} />
              </button>
            ))}
          </div>
        ) : (
          <div className="dashboardEmptyState">
            <ClipboardCheck size={26} />
            <div>
              <strong>No assignments created yet</strong>
              <p>
                Create your first assignment to share work with your students.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("Home Work and Assignment")}
            >
              Create assignment
            </button>
          </div>
        )}
      </section>

      <section className="panel dashboardMiniCalendar" aria-label="Calendar preview">
        <button className="miniCalendarNewEvent" type="button" onClick={() => setShowMiniEventPopup(true)}>
          New Event <CalendarDays size={16} />
        </button>
        <div className="fullCalendarHost">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate={miniCalendarDate}
            firstDay={1}
            height="auto"
            fixedWeekCount={false}
            dayMaxEvents={2}
            displayEventTime={false}
            headerToolbar={{ left: "prev", center: "title", right: "next" }}
            events={calendarEvents.map((event, index) => ({
              id: `${event.title}-${event.date}-${index}`,
              title: event.title,
              date: event.date,
              classNames: [event.type === "Meeting" ? "meetingEvent" : "classEvent"],
              extendedProps: event,
            }))}
            datesSet={({ view }) => setMiniCalendarDate(new Date(view.currentStart))}
            dateClick={({ dateStr }) => {
              setNewMiniEvent((current) => ({ ...current, date: dateStr }));
              setShowMiniEventPopup(true);
            }}
          />
        </div>
        <aside className="miniCalendarEventPanel" aria-label="Events this month">
          <div className="miniCalendarEventHeading">
            <span>Events</span>
            <strong>{visibleMiniEvents.length}</strong>
          </div>
          <div className="miniCalendarEventList">
            {visibleMiniEvents.length ? visibleMiniEvents.slice(0, 4).map((event) => (
              <article key={`${event.title}-${event.date}-${event.time}`}>
                <span className={`miniEventAccent ${event.type === "Meeting" ? "meeting" : ""}`} />
                <span className="miniEventDetails">
                  <strong>{event.title}</strong>
                  <small>{new Date(`${event.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {event.time}</small>
                  <em>{event.className}</em>
                </span>
              </article>
            )) : (
              <p>No events scheduled this month.</p>
            )}
          </div>
        </aside>
      </section>

      {showMiniEventPopup && (
        <div className="miniEventOverlay" onMouseDown={() => setShowMiniEventPopup(false)}>
          <form
            className="miniEventPopup"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={async (event) => {
              event.preventDefault();
              await onAddCalendarEvent({ ...newMiniEvent, note: "Created from dashboard" });
              const date = new Date(`${newMiniEvent.date}T00:00:00`);
              setMiniCalendarDate(new Date(date.getFullYear(), date.getMonth(), 1));
              setShowMiniEventPopup(false);
              setNewMiniEvent((current) => ({ ...current, title: "" }));
            }}
          >
            <div className="miniEventPopupHeader">
              <span className="quickActionIcon"><CalendarDays size={20} /></span>
              <div><strong>Create new event</strong><small>Add it to your class calendar</small></div>
              <button type="button" aria-label="Close" onClick={() => setShowMiniEventPopup(false)}><X size={18} /></button>
            </div>
            <label>Event title<input required value={newMiniEvent.title} onChange={(event) => setNewMiniEvent({ ...newMiniEvent, title: event.target.value })} placeholder="e.g. Maths revision class" /></label>
            <div className="miniEventFormRow">
              <label>Date<input required type="date" value={newMiniEvent.date} onChange={(event) => setNewMiniEvent({ ...newMiniEvent, date: event.target.value })} /></label>
              <label>Time<input required type="time" value={newMiniEvent.time} onChange={(event) => setNewMiniEvent({ ...newMiniEvent, time: event.target.value })} /></label>
            </div>
            <div className="miniEventFormRow">
              <label>Class<select value={newMiniEvent.className} onChange={(event) => setNewMiniEvent({ ...newMiniEvent, className: event.target.value })}><option>Class 8 - A</option><option>Class 8 - B</option><option>Class 7 - A</option><option>All Classes</option></select></label>
              <label>Type<select value={newMiniEvent.type} onChange={(event) => setNewMiniEvent({ ...newMiniEvent, type: event.target.value })}><option>Class</option><option>Meeting</option><option>Quiz</option><option>Review</option></select></label>
            </div>
            <div className="miniEventActions">
              <button className="miniEventCancel" type="button" onClick={() => setShowMiniEventPopup(false)}>Cancel</button>
              <button className="miniEventSave" type="submit"><CalendarDays size={17} /> Add event</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}


export { TeacherDashboardWorkspace };


