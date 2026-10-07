import React, { useEffect, useRef, useState } from "react";
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
  Eye,
  Layers3,
  Library,
  ListChecks,
  LogOut,
  Mail,
  MessageCircle,
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

function AssignmentBoard({ assigned }) {
  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>
          <ClipboardCheck size={22} /> Assigned to Students
        </h2>
        <span>{assigned.length} items</span>
      </div>
      {assigned.map((item, index) => (
        <article className="assignmentBoardItem" key={`${item.title}-${index}`}>
          <div className="assignmentBoardTop">
            <div>
              <strong>{item.title}</strong>
              <p>
                {item.student} - {item.type} - Due {formatDueDate(item.due)}
              </p>
            </div>
            <Badge tone={item.status === "Review" ? "orange" : "green"}>
              {item.status}
            </Badge>
          </div>
          {item.brief && <p className="assignmentBrief">{item.brief}</p>}
          <AttachmentCard attachment={item.attachment} />
          <div className="assignmentMeta">
            <span>{item.priority || "Medium"} priority</span>
            <span>{item.points || 20} points</span>
          </div>
        </article>
      ))}
    </section>
  );
}
function StudentMonitor({
  assigned = [],
  teacherMessages = [],
  onAssignSupport,
  onSendMessage,
}) {
  const studentPhotos = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/46.jpg",
    "https://randomuser.me/api/portraits/women/65.jpg",
  ];
  const [selectedAction, setSelectedAction] = useState({
    mode: "work",
    student: students[0],
  });
  const [messageDraft, setMessageDraft] = useState(
    "Please check your pending work and ask for help if needed.",
  );
  const [supportDraft, setSupportDraft] = useState({
    focus: "Maths practice support",
    due: "2026-07-20",
    points: "10",
    note: "Complete one short practice set and share doubts before the next class.",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [monitorFilter, setMonitorFilter] = useState("All Students");

  const getMonitorStatus = (student) => {
    if (student.risk === "Needs Help" || student.progress < 60) {
      return student.progress < 50 ? "Falling Behind" : "Needs Attention";
    }
    return "On Track";
  };

  const visibleStudents = students.filter((student) => {
    if (monitorFilter === "All Students") return true;
    return getMonitorStatus(student) === monitorFilter;
  });

  const openAction = (mode, student) => {
    setSelectedAction({ mode, student });
    setStatusMessage("");
  };

  const selectedStudent = selectedAction.student;
  const selectedStudentWork = assigned.filter(
    (item) =>
      item.student === selectedStudent.name || item.student === "All Students",
  );
  const selectedMessages = teacherMessages.filter(
    (item) =>
      item.student === selectedStudent.name || item.student === "All Students",
  );

  const sendStudentMessage = (event) => {
    event.preventDefault();
    const text = messageDraft.trim();
    if (!text) return;
    onSendMessage?.({
      student: selectedStudent.name,
      title: `Message for ${selectedStudent.name}`,
      text,
      sentAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
    setStatusMessage(`Message sent to ${selectedStudent.name}.`);
    setMessageDraft("");
  };

  const assignSupport = (event) => {
    event.preventDefault();
    const supportTask = {
      student: selectedStudent.name,
      className: selectedStudent.className,
      subject: supportDraft.focus.split(" ")[0] || "Support",
      type: "Support",
      title: supportDraft.focus.trim() || "Learning Support",
      due: supportDraft.due,
      priority: selectedStudent.risk === "Needs Help" ? "High" : "Medium",
      points: Number(supportDraft.points) || 0,
      status: "Assigned",
      brief: supportDraft.note.trim(),
      attachment: null,
    };
    onAssignSupport?.(supportTask);
    setStatusMessage(`Support assigned to ${selectedStudent.name}.`);
    setSupportDraft((current) => ({ ...current, focus: "", note: "" }));
  };

  return (
    <section className="studentMonitorModule" id="akProgressStudio">
      <header className="progressStudioHeading"><span>STUDENT INSIGHTS</span><h2>See progress. Make a difference.</h2><p>Review classroom work, spot learning gaps, and give students the support they need.</p></header>
      <div className="panel monitorTablePanel">
        <div className="monitorOverviewBar">
          <div>
            <h2>Your class at a glance</h2>
            <p>Filter by learning status, then open student work or send a message.</p>
          </div>
          <div className="monitorOverviewControls">
            <label className="monitorFilterControl">
              <SearchCheck size={15} aria-hidden="true" />
              <span className="srOnly">Filter students</span>
              <select value={monitorFilter} onChange={(event) => setMonitorFilter(event.target.value)}>
                <option>All Students</option>
                <option>On Track</option>
                <option>Needs Attention</option>
                <option>Falling Behind</option>
              </select>
            </label>
            <div className="monitorDateControl">
              <span>May 12 - May 18, 2024</span>
              <CalendarDays size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="monitorTableScroll">
          <table className="monitorTable">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Class Work <small>Completion</small></th>
                <th>Assignments <small>Submitted</small></th>
                <th>Average Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student, index) => {
                const status = getMonitorStatus(student);
                const actionMode = status === "On Track" ? "work" : status === "Needs Attention" ? "message" : "support";
                const actionLabel = status === "On Track" ? "View" : status === "Needs Attention" ? "Review" : "Follow Up";
                return (
                <tr key={student.name}>
                  <td>
                    <div className="monitorStudentCell">
                      <span className={`monitorAvatar avatarTone${(index % 4) + 1}`}>
                        <img src={studentPhotos[index % studentPhotos.length]} alt="" loading="lazy" />
                      </span>
                      <span className="monitorStudentIdentity">
                        <strong>{student.name}</strong>
                        <small>ST{String(1001 + index).padStart(4, "0")}</small>
                      </span>
                    </div>
                  </td>
                  <td>{student.className.replace("Class ", "")}-A</td>
                  <td>
                    <div className="monitorProgressCell">
                      <strong>{student.progress}%</strong>
                      <div className={`courseProgress ${student.progress < 50 ? "low" : student.progress < 70 ? "medium" : "high"}`}>
                        <span style={{ width: `${student.progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>{Math.max(0, 20 - student.pending)}/20</td>
                  <td>{student.quiz}%</td>
                  <td>
                    <span className={`monitorStatus ${status.toLowerCase().replaceAll(" ", "-")}`}>
                      <i />{status}
                    </span>
                  </td>
                  <td>
                    <div className="monitorRowActions">
                      <button
                        className="monitorIconAction"
                        type="button"
                        title={`${actionLabel} ${student.name}'s work`}
                        aria-label={`${actionLabel} ${student.name}'s work`}
                        onClick={() => openAction(actionMode, student)}
                      >
                        <Eye size={16} /> <span>{actionLabel}</span>
                      </button>
                      <button
                        className="monitorIconAction message"
                        type="button"
                        title={`Message ${student.name}`}
                        aria-label={`Message ${student.name}`}
                        onClick={() => openAction("message", student)}
                      >
                        <MessageCircle size={16} /> <span>Message</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      <section className="panel monitorActionPanel">
        <div className="panelHeader">
          <h2>
            <UsersRound size={22} /> {selectedStudent.name}
          </h2>
          <Badge
            tone={selectedStudent.risk === "Needs Help" ? "orange" : "green"}
          >
            {selectedStudent.risk}
          </Badge>
        </div>
        <div className="monitorTabs">
          <button
            className={selectedAction.mode === "work" ? "active" : ""}
            type="button"
            onClick={() => openAction("work", selectedStudent)}
          >
            Work
          </button>
          <button
            className={selectedAction.mode === "message" ? "active" : ""}
            type="button"
            onClick={() => openAction("message", selectedStudent)}
          >
            Message
          </button>
          <button
            className={selectedAction.mode === "support" ? "active" : ""}
            type="button"
            onClick={() => openAction("support", selectedStudent)}
          >
            Support
          </button>
        </div>

        {selectedAction.mode === "work" && (
          <div className="monitorWorkList">
            {selectedStudentWork.length ? (
              selectedStudentWork.map((item, index) => (
                <article
                  className="assignmentBoardItem"
                  key={`${item.title}-${index}`}
                >
                  <div className="assignmentBoardTop">
                    <div>
                      <strong>{item.title}</strong>
                      <p>
                        {item.type} - Due {formatDueDate(item.due)} -{" "}
                        {item.points || 0} points
                      </p>
                    </div>
                    <Badge
                      tone={
                        item.status === "Submitted" || item.status === "Checked"
                          ? "green"
                          : item.status === "Review"
                            ? "orange"
                            : "blue"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  {item.brief && (
                    <p className="assignmentBrief">{item.brief}</p>
                  )}
                </article>
              ))
            ) : (
              <div className="emptyHomework">
                <strong>No assigned work found</strong>
                <p>
                  Create homework or assign support to start tracking this
                  student.
                </p>
              </div>
            )}
          </div>
        )}

        {selectedAction.mode === "message" && (
          <form
            className="assignForm monitorMessageForm"
            onSubmit={sendStudentMessage}
          >
            <label>
              Message
              <textarea
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
              />
            </label>
            <button type="submit">Send Message</button>
            {selectedMessages.length > 0 && (
              <div className="sentMessageList">
                {selectedMessages.map((message, index) => (
                  <p key={`${message.sentAt}-${index}`}>
                    <strong>{message.sentAt}</strong>
                    {message.text}
                  </p>
                ))}
              </div>
            )}
          </form>
        )}

        {selectedAction.mode === "support" && (
          <form
            className="assignForm monitorSupportForm"
            onSubmit={assignSupport}
          >
            <div className="formRow three">
              <label>
                Focus
                <input
                  required
                  value={supportDraft.focus}
                  onChange={(event) =>
                    setSupportDraft({
                      ...supportDraft,
                      focus: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Due Date
                <input
                  required
                  type="date"
                  value={supportDraft.due}
                  onChange={(event) =>
                    setSupportDraft({
                      ...supportDraft,
                      due: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Points
                <input
                  min="1"
                  type="number"
                  value={supportDraft.points}
                  onChange={(event) =>
                    setSupportDraft({
                      ...supportDraft,
                      points: event.target.value,
                    })
                  }
                />
              </label>
            </div>
            <label>
              Support Note
              <textarea
                required
                value={supportDraft.note}
                onChange={(event) =>
                  setSupportDraft({ ...supportDraft, note: event.target.value })
                }
              />
            </label>
            <button type="submit">Assign Support</button>
          </form>
        )}

        {statusMessage && (
          <div className="homeworkSuccessPopup" role="status">
            {statusMessage}
          </div>
        )}
      </section>
    </section>
  );
}

function StudentOverview() {
  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>
          <UsersRound size={22} /> Student Overview
        </h2>
        <span>Live class</span>
      </div>
      {students.map((student) => (
        <article className="courseItem" key={student.name}>
          <div>
            <strong>{student.name}</strong>
            <p>
              {student.className} - {student.status} - {student.pending} pending
            </p>
          </div>
          <div className="courseProgress">
            <span style={{ width: `${student.progress}%` }} />
          </div>
        </article>
      ))}
    </section>
  );
}

export { AssignmentBoard, StudentMonitor, StudentOverview };


