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
import {
  runPythonCode,
  runJavaCode,
  runSqlCode,
} from "../../utils/codeRunner.js";

function TeacherProfileMenu({ teacherName, teacherCode, teacherEmail }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyTeacherCode = async () => {
    try {
      await navigator.clipboard.writeText(teacherCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="profileMenu">
      <button
        type="button"
        aria-label="Open profile"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <CircleUserRound size={22} />
      </button>
      {open && (
        <section className="profilePopover" aria-label="Teacher profile">
          <span className="profilePopoverEyebrow">MY DETAILS</span>
          <div className="profilePopoverTitle">
            <CircleUserRound size={28} />
            <div>
              <strong>{teacherName}</strong>
              <span>Teacher</span>
            </div>
          </div>
          <div className="teacherProfileEmail">
            <Mail size={16} />
            <div>
              <span>Email Address</span>
              <strong>{teacherEmail}</strong>
            </div>
          </div>
          <div className="teacherCodeRow">
            <div>
              <span>Teacher Code</span>
              <strong>{teacherCode}</strong>
            </div>
            <button type="button" onClick={copyTeacherCode}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function TeacherMessagesPopup({ onClose, onSendMessage }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [recipient, setRecipient] = useState(students[0].name);
  const [messageDraft, setMessageDraft] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const inboxMessages = teacherFeatureData.Messages.items.map(
    (item, index) => ({
      ...item,
      student:
        index === 0
          ? "Aryan Sharma"
          : index === 1
            ? "All Students"
            : "Parent of Aryan Sharma",
      text: item.meta,
      sentAt: ["Today, 10:15 AM", "Today, 09:40 AM", "Yesterday, 04:30 PM"][
        index
      ],
    }),
  );

  const openComposer = (message = null) => {
    setSelectedMessage(
      message || {
        title: "New Message",
        text: "",
        student: students[0].name,
        status: "Send",
      },
    );
    setRecipient(
      message?.student === "All Students"
        ? "All Students"
        : message?.student || students[0].name,
    );
    setMessageDraft("");
    setSentMessage("");
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const text = messageDraft.trim();
    if (!text) return;
    onSendMessage?.({
      student:
        recipient === "All Students"
          ? "All Students"
          : recipient.replace("Parent of ", ""),
      title: selectedMessage?.title || "Teacher Message",
      text,
      sentAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
    setSentMessage(`Message sent to ${recipient}.`);
    setMessageDraft("");
  };

  return (
    <div
      className="messagesPopupOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="All messages"
      onMouseDown={onClose}
    >
      <section
        className="messagesPopup"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="messagesPopupHeader">
          <div>
            <Mail size={22} />
            <div>
              <h2>All Messages</h2>
              <p>{inboxMessages.length} messages need your attention</p>
            </div>
          </div>
          <div className="messagesPopupActions">
            <button type="button" onClick={() => openComposer()}>
              Send Message
            </button>
            <button type="button" aria-label="Close messages" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="messagesPopupList">
          {inboxMessages.map((message, index) => (
            <article
              className="messagePopupItem"
              key={`${message.title}-${index}`}
            >
              <div>
                <strong>{message.title}</strong>
                <p>{message.text || message.meta}</p>
                <small>{message.sentAt || "Today"}</small>
              </div>
              <button type="button" onClick={() => openComposer(message)}>
                {message.status === "Reply" ? "Reply" : "View"}
              </button>
            </article>
          ))}
        </div>
        {selectedMessage && (
          <form className="messageComposer" onSubmit={sendMessage}>
            <div className="messageComposerHeader">
              <strong>
                {selectedMessage.status === "Reply"
                  ? `Reply to ${selectedMessage.title}`
                  : selectedMessage.title}
              </strong>
              <button type="button" onClick={() => setSelectedMessage(null)}>
                <X size={16} />
              </button>
            </div>
            {selectedMessage.text && (
              <p className="messageOriginal">
                <strong>Message:</strong> {selectedMessage.text}
              </p>
            )}
            <label>
              Send to
              <select
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
              >
                <option value="All Students">All Students</option>
                {students.map((student) => (
                  <option value={student.name} key={student.name}>
                    {student.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Your message
              <textarea
                required
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                placeholder="Write your message here..."
              />
            </label>
            <div>
              <button type="submit">Send Message</button>
              {sentMessage && <span>{sentMessage}</span>}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

export { TeacherProfileMenu, TeacherMessagesPopup };
