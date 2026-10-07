import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
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
import { AttachmentCard, Badge } from '../../components/shared/SharedComponents.jsx';

function TeacherCalendar({ events, onAddEvent, onAssignWork }) {
  const fullCalendarRef = useRef(null);
  const [viewDate, setViewDate] = useState(new Date(2026, 6, 1));
  const [selectedDate, setSelectedDate] = useState("2026-07-08");
  const [calendarForm, setCalendarForm] = useState({
    scheduleMode: "Event",
    title: "Extra practice session",
    date: "2026-07-08",
    time: "14:00",
    className: "Class 8 - A",
    type: "Class",
    note: "Add lesson focus, room, or meeting link.",
  });
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const eventsForDate = (dateKey) =>
    events.filter((item) => item.date === dateKey);
  const selectedEvents = eventsForDate(selectedDate);
  const upcomingEvents = [...events].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
  );

  const selectCalendarDate = (dateKey) => {
    setSelectedDate(dateKey);
    setCalendarForm((current) => ({ ...current, date: dateKey }));
  };

  const submitCalendarEvent = (event) => {
    event.preventDefault();
    onAddEvent({
      title: calendarForm.title,
      date: calendarForm.date,
      time: calendarForm.time,
      className: calendarForm.className,
      type: calendarForm.type,
      note: calendarForm.note,
    });
    setSelectedDate(calendarForm.date);
    const nextDate = new Date(`${calendarForm.date}T00:00:00`);
    if (!Number.isNaN(nextDate.getTime())) {
      setViewDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
      fullCalendarRef.current?.getApi().gotoDate(nextDate);
    }
    setCalendarForm({
      ...calendarForm,
      title: "",
      note: "",
    });
  };

  return (
    <section className="calendarPage">
      <div className="panel calendarBoard">
        <div className="calendarPageFullCalendar">
          <FullCalendar
            ref={fullCalendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate={viewDate}
            firstDay={1}
            height="auto"
            fixedWeekCount={false}
            dayMaxEvents={3}
            nowIndicator
            headerToolbar={{ left: "title prev,next", center: "", right: "" }}
            eventTimeFormat={{ hour: "2-digit", minute: "2-digit", meridiem: "short" }}
            events={events.map((item, index) => ({
              id: `${item.title}-${item.date}-${item.time}-${index}`,
              title: item.title,
              start: `${item.date}T${item.time || "00:00"}`,
              classNames: [`calendarType${item.type || "Event"}`],
              extendedProps: item,
            }))}
            dayCellClassNames={({ date }) => formatDateKey(date) === selectedDate ? ["selectedCalendarDate"] : []}
            datesSet={({ view }) => setViewDate(new Date(view.currentStart))}
            dateClick={({ dateStr }) => selectCalendarDate(dateStr)}
            eventClick={({ event }) => selectCalendarDate(event.startStr.slice(0, 10))}
          />
        </div>
      </div>
      <aside className="calendarSide">
        <form
          className="panel assignForm calendarForm"
          onSubmit={submitCalendarEvent}
        >
          <div className="panelHeader">
            <h2>
              <PenLine size={22} /> Add Schedule
            </h2>
            <span>Save class events</span>
          </div>
          <label>
            Title
            <input
              required
              value={calendarForm.title}
              onChange={(event) =>
                setCalendarForm({ ...calendarForm, title: event.target.value })
              }
            />
          </label>
          <div className="formRow">
            <label>
              Date
              <input
                required
                type="date"
                value={calendarForm.date}
                onChange={(event) =>
                  setCalendarForm({ ...calendarForm, date: event.target.value })
                }
              />
            </label>
            <label>
              Time
              <input
                required
                type="time"
                value={calendarForm.time}
                onChange={(event) =>
                  setCalendarForm({ ...calendarForm, time: event.target.value })
                }
              />
            </label>
          </div>
            <div className="formRow">
              <label>
                Class
                <select
                  value={calendarForm.className}
                  onChange={(event) =>
                    setCalendarForm({
                      ...calendarForm,
                      className: event.target.value,
                    })
                  }
                >
                  <option>Class 7 - A</option>
                  <option>Class 8 - A</option>
                  <option>Class 8 - B</option>
                  <option>All Classes</option>
                </select>
              </label>
              <label>
                Type
                <select
                  value={calendarForm.type}
                  onChange={(event) =>
                    setCalendarForm({
                      ...calendarForm,
                      type: event.target.value,
                    })
                  }
                >
                  <option>Class</option>
                  <option>Quiz</option>
                  <option>Review</option>
                  <option>Meeting</option>
                  <option>Holiday</option>
                </select>
              </label>
            </div>
          <label>
            Notes
            <textarea
              value={calendarForm.note}
              onChange={(event) =>
                setCalendarForm({ ...calendarForm, note: event.target.value })
              }
            />
          </label>
          <button type="submit">
            Add to Calendar
          </button>
        </form>

        <section className="panel calendarEvents">
          <div className="panelHeader">
            <h2>
              <Clock3 size={22} /> Selected Day
            </h2>
            <span>{selectedDate}</span>
          </div>
          {(selectedEvents.length
            ? selectedEvents
            : [
                {
                  title: "No event scheduled",
                  time: "--:--",
                  className: "Choose another date",
                  type: "Empty",
                  note: "Use the form above to add a class, quiz, review, meeting, or holiday.",
                },
              ]
          ).map((item) => (
            <article
              className="calendarEventItem"
              key={`${item.title}-${item.time}-${item.date || selectedDate}`}
            >
              <Badge
                tone={
                  item.type === "Meeting" || item.type === "Review"
                    ? "orange"
                    : item.type === "Empty"
                      ? "blue"
                      : "green"
                }
              >
                {item.type}
              </Badge>
              <div>
                <strong>
                  {item.time} - {item.title}
                </strong>
                <p>{item.className}</p>
                <small>{item.note}</small>
                <AttachmentCard attachment={item.attachment} />
              </div>
            </article>
          ))}
        </section>

        <section className="panel calendarEvents">
          <div className="panelHeader">
            <h2>
              <ListChecks size={22} /> Upcoming
            </h2>
            <span>{events.length} events</span>
          </div>
          {upcomingEvents.slice(0, 5).map((item) => (
            <article
              className="calendarEventItem compact"
              key={`${item.title}-${item.date}-${item.time}`}
            >
              <Badge tone={item.type === "Quiz" ? "orange" : "blue"}>
                {item.date}
              </Badge>
              <div>
                <strong>
                  {item.time} - {item.title}
                </strong>
                <p>
                  {item.className} - {item.type}
                </p>
              </div>
            </article>
          ))}
        </section>
      </aside>
    </section>
  );
}


export { TeacherCalendar };


