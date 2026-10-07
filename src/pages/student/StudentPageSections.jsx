import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
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
import homeworkHeaderIllustration from "../../assets/homework-header-illustration.png";
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
import { buildAssistantReply } from "../../utils/assistant.js";
import { runPythonCode, runJavaCode, runSqlCode } from "../../utils/codeRunner.js";
import { AiStudyChat, AttachmentCard, Badge } from '../../components/shared/SharedComponents.jsx';
import { TeacherCourseLibrary } from '../teacher/TeacherCourseLibrary.jsx';
import { CodingLabModule } from '../../components/coding/CodingLabComponents.jsx';

function getSignedInStudent() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { id: user?.id || null, name: user?.student_name || user?.name || "" };
  } catch {
    return { id: null, name: "" };
  }
}

function getSignedInStudentName() { return getSignedInStudent().name; }

function DashboardHome({ assigned = [], teacherMessages = [] }) {
  const studentHomework = assigned.filter(
    (item) =>
      item.student === studentProfile.name || item.student === "All Students",
  );
  const studentMessages = teacherMessages.filter(
    (item) =>
      item.student === studentProfile.name || item.student === "All Students",
  );

  return (
    <>
      <section className="statsGrid" aria-label="Student statistics">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article className="statCard" key={item.label}>
              <div className="statIcon">
                <Icon size={22} />
              </div>
              <div className="statText">
                <strong>{item.value}</strong>
                <div>
                  <p>{item.label}</p>
                  {item.hint && <small>{item.hint}</small>}
                </div>
              </div>
              <Badge tone={item.color}>{item.pill}</Badge>
            </article>
          );
        })}
      </section>

      <section className="studentSummaryGrid" aria-label="Student LMS overview">
        <article className="panel studentProfileCard">
          <div className="panelHeader">
            <h2>
              <CircleUserRound size={22} /> Student Profile
            </h2>
            <Badge tone="green">Active</Badge>
          </div>
          <div className="profileRows">
            <div>
              <span>Name</span>
              <strong>{studentProfile.name}</strong>
            </div>
            <div>
              <span>Class</span>
              <strong>{studentProfile.className}</strong>
            </div>
            <div>
              <span>Roll No.</span>
              <strong>{studentProfile.rollNo}</strong>
            </div>
            <div>
              <span>Admission No.</span>
              <strong>{studentProfile.admissionNo}</strong>
            </div>
          </div>
        </article>

        <article className="panel studentTodayCard">
          <div className="panelHeader">
            <h2>
              <Clock3 size={22} /> Today
            </h2>
            <span>{studentProfile.attendance} attendance</span>
          </div>
          <div className="todayFocus">
            <strong>{studentProfile.nextClass}</strong>
            <p>
              2 assignments pending, 1 quiz ready, and 4 lessons scheduled for
              this week.
            </p>
          </div>
        </article>
      </section>

      <div className="mainGrid">
        <AiStudyChat compact />

        <section className="panel studentHomeworkPanel">
          <div className="panelHeader">
            <h2>
              <ClipboardCheck size={22} /> Homework From Teacher
            </h2>
            <span>{studentHomework.length} assigned</span>
          </div>
          {studentHomework.length ? (
            studentHomework.map((item, index) => (
              <article
                className="studentHomeworkItem"
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
                  <Badge tone={item.priority === "High" ? "orange" : "green"}>
                    {item.priority || "Medium"}
                  </Badge>
                </div>
                {item.brief && <p className="assignmentBrief">{item.brief}</p>}
                <AttachmentCard attachment={item.attachment} />
              </article>
            ))
          ) : (
            <div className="emptyHomework">
              <strong>No homework assigned yet</strong>
              <p>
                Assignments from your teacher will appear here. Write and submit
                your answer on this page.
              </p>
            </div>
          )}
        </section>

        <section className="panel coursesPanel">
          <div className="panelHeader">
            <h2>
              <BookOpen size={22} /> My Courses
            </h2>
            <a href="#courses">View all</a>
          </div>
          <div className="courseList" id="courses">
            {courses.map((course) => (
              <article className="courseItem" key={course.title}>
                <div>
                  <strong>{course.title}</strong>
                  <p>{course.teacher}</p>
                </div>
                <div
                  className="courseProgress"
                  aria-label={`${course.progress}% complete`}
                >
                  <span style={{ width: `${course.progress}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel planPanel">
          <div className="panelHeader">
            <h2>Today's Plan</h2>
            <Badge>4 / 7</Badge>
          </div>
          <div className="planScore">
            <strong>
              <CheckCircle2 size={20} />
              72% Great Job!
            </strong>
            <a href="#assignments">Assignments - Study</a>
          </div>
          <div className="assignmentList" id="assignments">
            {assignments.map((item) => (
              <div className="assignmentItem" key={item.subject}>
                <span>{item.subject}</span>
                <Badge tone={item.tone}>{item.status}</Badge>
              </div>
            ))}
          </div>
          <p className="note">
            <ChevronRight size={14} />
            Complete tasks, earn XP & upgrade rank.
          </p>
        </section>

        <aside className="rightRail">
          <section className="panel progressPanel">
            <div className="panelHeader">
              <h2>Your Progress</h2>
              <span>This week</span>
            </div>
            <div className="weekGrid">
              {week.map((day) => (
                <div className={day.active ? "active" : ""} key={day.day}>
                  <strong>{day.value}</strong>
                  <span>{day.day}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel activityPanel">
            <div className="panelHeader">
              <h2>
                <FileCheck2 size={22} /> Recent Activity
              </h2>
            </div>
            <div>
              {activities.map((activity) => (
                <article className="activityItem" key={activity.title}>
                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.meta}</p>
                  </div>
                  <Badge tone={activity.tone}>{activity.status}</Badge>
                </article>
              ))}
            </div>
          </section>

          <section className="panel timetablePanel">
            <div className="panelHeader">
              <h2>
                <Clock3 size={22} /> Today&apos;s Timetable
              </h2>
            </div>
            {timetable.map((item) => (
              <article
                className="timetableItem"
                key={`${item.time}-${item.subject}`}
              >
                <span>{item.time}</span>
                <div>
                  <strong>{item.subject}</strong>
                  <p>
                    {item.teacher} - {item.room}
                  </p>
                </div>
              </article>
            ))}
          </section>

          <section className="panel activityPanel">
            <div className="panelHeader">
              <h2>
                <Bell size={22} /> Announcements
              </h2>
            </div>
            <div>
              {studentMessages.slice(0, 2).map((notice) => (
                <article
                  className="activityItem teacherMessageNotice"
                  key={`${notice.sentAt}-${notice.text}`}
                >
                  <div>
                    <strong>{notice.title || "Teacher Message"}</strong>
                    <p>{notice.text}</p>
                  </div>
                  <Badge tone="green">Teacher</Badge>
                </article>
              ))}
              {studentAnnouncements.map((notice) => (
                <article className="activityItem" key={notice.title}>
                  <div>
                    <strong>{notice.title}</strong>
                    <p>{notice.meta}</p>
                  </div>
                  <Badge tone={notice.tone}>{notice.status}</Badge>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
function HomeworkSubmitBox({ item, onSubmitHomework }) {
  const questions = (item.questions || []).filter((question) => question.saved !== false && question.text);
  const questionGroups = questions.reduce((groups, question, index) => {
    const category = question.type || "General";
    const existingGroup = groups.find((group) => group.category === category);
    const indexedQuestion = { ...question, originalIndex: index };
    if (existingGroup) existingGroup.questions.push(indexedQuestion);
    else groups.push({ category, questions: [indexedQuestion] });
    return groups;
  }, []);
  const [answer, setAnswer] = useState(item.submission?.answer || "");
  const [answers, setAnswers] = useState(item.submission?.answers || {});
  const [attachment, setAttachment] = useState(item.submission?.attachment || null);
  const [isEditing, setIsEditing] = useState(!item.submission);
  const [successMessage, setSuccessMessage] = useState("");
  const isReviewed = Boolean(item.teacherReview);
  const isSubmitted =
    item.status === "Submitted" ||
    Boolean(item.submission) ||
    Boolean(successMessage);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnswer(item.submission?.answer || "");
    setAnswers(item.submission?.answers || {});
    setAttachment(item.submission?.attachment || null);
    setIsEditing(!item.submission && !item.teacherReview);
  }, [item.sourceIndex, item.submission, item.teacherReview]);

  const submitHomework = async (event) => {
    event.preventDefault();
    const hasQuestions = questions.length > 0;
    const allAnswered = hasQuestions
      ? questions.every((_, index) => String(answers[index] || "").trim())
      : answer.trim();
    if (!allAnswered || isSubmitting || isReviewed) return;
    setIsSubmitting(true);
    try {
      await onSubmitHomework(item.sourceIndex, {
        studentId: getSignedInStudent().id,
        studentName: getSignedInStudentName(),
        answer: answer.trim(),
        answers,
        attachment,
        submittedAt: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      });
      setSuccessMessage("Your homework submitted successfully.");
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      className={`homeworkSubmitBox ${isSubmitted ? "submitted" : ""}`}
      onSubmit={submitHomework}
    >
      <div className="homeworkSubmitHeader">
        <strong>
          {isSubmitted ? "Submitted Homework" : "Submit Your Homework"}
        </strong>
        {isSubmitted && <Badge tone="green">Submitted</Badge>}
      </div>
      {isSubmitted && !isEditing ? (
        <div className="studentSubmittedPreview">
          <small>Your submitted answers</small>
          {questions.length ? <div className="studentSubmittedAnswers">{questions.map((question, index) => <div key={index}><span>Q{index + 1}. {question.text}</span><p>{answers[index]}</p></div>)}</div> : <p>{answer}</p>}
          {attachment && <span><FileText size={15} /> {attachment.name}</span>}
          {isReviewed ? <div className="studentReviewLocked"><CheckCircle2 size={16} /><span>Reviewed by teacher · Editing is now locked</span></div> : <button type="button" onClick={() => setIsEditing(true)}><PenLine size={15} /> Edit submitted work</button>}
        </div>
      ) : <>
      {questions.length ? <div className="studentQuestionAnswerList">
        {questionGroups.map((group, groupIndex) => (
          <section className="studentQuestionCategoryGroup" key={group.category}>
          <div className="studentAnswerCategory"><span>Section {String.fromCharCode(65 + groupIndex)}</span><strong>{group.category} Questions</strong><em>{group.questions.length} {group.questions.length === 1 ? "question" : "questions"}</em></div>
          {group.questions.map((question) => {
            const index = question.originalIndex;
            const isFillBlank = question.type === "Fill in the Blank";
            const blankParts = isFillBlank ? question.text.split(/_{2,}/) : [];
            return (
          <fieldset className="studentQuestionAnswer" key={index}>
            <div className="studentQuestionPrompt"><span>{index + 1}</span><div><small>{question.type || "Question"}</small>{isFillBlank ? <strong className="studentInlineBlankQuestion">{blankParts[0]}<input type="text" value={answers[index] || ""} aria-label={`Answer for question ${index + 1}`} placeholder="Type answer" onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))} />{blankParts.slice(1).join("_______")}</strong> : <strong>{question.text}</strong>}</div></div>
            {question.type === "MCQ" ? <div className="studentMcqAnswers">{question.options?.filter(Boolean).map((option, optionIndex) => <label key={optionIndex}><input type="radio" name={`homework-question-${item.sourceIndex}-${index}`} value={option} checked={answers[index] === option} onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))} /><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</label>)}</div> : question.type === "True / False" ? <div className="studentMcqAnswers"><label><input type="radio" name={`homework-question-${item.sourceIndex}-${index}`} value="True" checked={answers[index] === "True"} onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))} /><span>T</span>True</label><label><input type="radio" name={`homework-question-${item.sourceIndex}-${index}`} value="False" checked={answers[index] === "False"} onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))} /><span>F</span>False</label></div> : (
              !isFillBlank && <textarea value={answers[index] || ""} rows={question.type === "Long Answer" || question.type === "Case-Based Answer" ? 6 : 3} placeholder={`Write answer ${index + 1} here...`} onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))} />
            )}
          </fieldset>
            );
          })}
          </section>
        ))}
      </div> : <label>
        Your Answer / Notes
        <textarea
          value={answer}
          placeholder="Write your complete homework answer here..."
          onChange={(event) => setAnswer(event.target.value)}
        />
      </label>}
      <label className="studentAnswerUpload">
        <span className="studentUploadHeading"><FileText size={20} /><span><strong>Upload supporting file</strong><small>Optional · PDF, DOC, JPG or PNG</small></span></span>
        <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(event) => {
          const file = event.target.files?.[0];
          setAttachment(file ? { name: file.name, size: file.size, type: file.type } : null);
        }} />
        {attachment && <span className="studentUploadedFile"><CheckCircle2 size={16} /> {attachment.name}</span>}
      </label>
      {successMessage && (
        <div className="homeworkSuccessPopup" role="status">
          {successMessage}
        </div>
      )}
      {(item.submission?.submittedAt || successMessage) && (
        <p className="submittedTime">
          Submitted on {item.submission?.submittedAt || "just now"}
        </p>
      )}
      <button type="submit" disabled={isReviewed || isSubmitting || (questions.length ? !questions.every((_, index) => String(answers[index] || "").trim()) : !answer.trim())}>
        <Send size={17} /> {isSubmitting ? "Submitting..." : isSubmitted ? "Update Submission" : "Submit Homework"}
      </button>
      </>}
    </form>
  );
}

function StudentHomeworkPaper({ item, children }) {
  const savedQuestions = (item.questions || []).filter((question) => question.saved !== false && question.text);
  return (
    <section className="studentHomeworkPaper studentQuizExperience" aria-label={`${item.title} quiz`}>
      <div className="studentPaperSheet">
        <div className="studentQuizVisual" aria-hidden="true"><img src={homeworkHeaderIllustration} alt="" /></div>
        <header><small>HOMEWORK QUESTION PAPER</small><h3>{item.title || "Untitled Homework"}</h3><p>{item.className} · {item.subject}</p></header>
        <div className="studentPaperMeta">
          <span className="studentQuizMetric"><i><ListChecks size={18} /></i><small>Questions</small><strong>{savedQuestions.length} total</strong></span>
          <span className="studentQuizMetric"><i><Trophy size={18} /></i><small>Score</small><strong>{item.points || 0} points</strong></span>
          <span><small>Assigned to</small><strong>All Students</strong></span><span><small>Class</small><strong>{item.className}</strong></span>
          <span><small>Subject</small><strong>{item.subject}</strong></span><span><small>Chapter / Topic</small><strong>{item.chapter || "Not selected"}</strong></span>
          <span><small>Homework type</small><strong>{item.homeworkType || item.type || "Assignment"}</strong></span><span><small>Priority</small><strong>{item.priority}</strong></span>
          <span><small>Due date</small><strong>{formatDueDate(item.due)}</strong></span>
        </div>
        {!children && (savedQuestions.length ? <div className="studentPaperQuestions">{savedQuestions.map((question, index) => <article key={index}><small>{question.type || "Question"}</small><p><strong>{index + 1}.</strong> {question.text}</p>{question.type === "MCQ" && <ol type="A">{question.options?.filter(Boolean).map((option, optionIndex) => <li key={optionIndex}>{option}</li>)}</ol>}</article>)}</div> : <div className="studentPaperEmpty"><FileText size={30} /><span>{item.brief || "No questions added to this homework."}</span></div>)}
        {children && <div className="studentPaperAnswerArea"><div className="studentPaperAnswerHeading"><span><PenLine size={20} /></span><div><strong>Ready? Let's play!</strong><small>Choose the best answer for every question</small></div></div>{children}</div>}
      </div>
    </section>
  );
}
function FeaturePage({
  page,
  assigned = [],
  teacherMessages = [],
  codingHomework = null,
  onSubmitHomework,
  onOpenCodingHomework,
}) {
  const [selectedHomeworkIndex, setSelectedHomeworkIndex] = useState(0);
  const activeStudent = getSignedInStudent();
  const activeStudentName = activeStudent.name;
  const pageInfo = pageData[page];
  const Icon = pageInfo.icon;
  const studentAssignedWork = assigned
    .map((item, sourceIndex) => ({ ...item, sourceIndex }))
    .filter(
      (item) =>
        item.student === activeStudentName || item.student === "All Students",
    );
  const studentMessages = teacherMessages.filter(
    (item) =>
      item.student === activeStudentName || item.student === "All Students",
  );
  const homeworkItems = studentAssignedWork.map((item) => ({
    title: item.title,
    meta: `${item.type} - ${item.subject || "General"} - Due ${formatDueDate(item.due)} - ${item.points || 0} points`,
    status: (item.submissions || []).some((submission) => submission.studentId === activeStudent.id || (!submission.studentId && submission.studentName === activeStudentName) || (!submission.studentId && !submission.studentName && item.student === "All Students" && activeStudentName === studentProfile.name)) || item.submission?.studentId === activeStudent.id || (!item.submission?.studentId && item.submission?.studentName === activeStudentName) || (!item.submission?.studentId && !item.submission?.studentName && item.submission && item.student === "All Students" && activeStudentName === studentProfile.name) ? "Submitted" : "Assigned",
    tone: item.priority === "High" ? "orange" : "blue",
    brief: item.brief,
    attachment: item.attachment,
    due: item.due,
    className: item.className || studentProfile.className,
    subject: item.subject || "General",
    priority: item.priority || "Medium",
    points: item.points || 0,
    type: item.type,
    sourceIndex: item.sourceIndex,
    submission: (item.submissions || []).find((submission) => submission.studentId === activeStudent.id || (!submission.studentId && submission.studentName === activeStudentName) || (!submission.studentId && !submission.studentName && item.student === "All Students" && activeStudentName === studentProfile.name)) || (item.submission?.studentId === activeStudent.id || (!item.submission?.studentId && item.submission?.studentName === activeStudentName) || (!item.submission?.studentId && !item.submission?.studentName && item.submission && item.student === "All Students" && activeStudentName === studentProfile.name) ? item.submission : null),
    teacherReview: (item.submissions || []).find((submission) => submission.studentId === activeStudent.id || (!submission.studentId && submission.studentName === activeStudentName) || (!submission.studentId && !submission.studentName && item.student === "All Students" && activeStudentName === studentProfile.name))?.teacherReview || (item.submission?.studentId === activeStudent.id || (!item.submission?.studentId && item.submission?.studentName === activeStudentName) || (!item.submission?.studentId && !item.submission?.studentName && item.submission && item.student === "All Students" && activeStudentName === studentProfile.name) ? item.submission.teacherReview : null),
    questions: item.questions || [],
    chapter: item.chapter || "",
    homeworkType: item.homeworkType || item.type,
    student: item.student,
  }));
  const assignmentItems =
    page === "Homework"
      ? [...homeworkItems, ...pageInfo.items]
      : pageInfo.items;
  const leaderboardStudents = [
    { name: "Neha Patel", initials: "NP", xp: 2140, tasks: 42, movement: 1, color: "violet" },
    { name: "Aryan Sharma", initials: "AS", xp: 1980, tasks: 38, movement: 2, color: "blue", current: true },
    { name: "Sara Khan", initials: "SK", xp: 1845, tasks: 36, movement: -1, color: "orange" },
    { name: "Rohan Mehta", initials: "RM", xp: 1720, tasks: 33, movement: 1, color: "green" },
    { name: "Ishita Rao", initials: "IR", xp: 1590, tasks: 31, movement: 0, color: "pink" },
    { name: "Kabir Singh", initials: "KS", xp: 1460, tasks: 29, movement: -2, color: "cyan" },
    { name: "Anaya Das", initials: "AD", xp: 1325, tasks: 27, movement: 1, color: "gold" },
    { name: "Dev Joshi", initials: "DJ", xp: 1210, tasks: 25, movement: 0, color: "slate" },
  ];

  if (page === "Study Helper") {
    return (
      <section className="featurePage">
        <AiStudyChat />
      </section>
    );
  }
  if (page === "Coding Lab") {
    return (
      <CodingLabModule
        linkedHomework={codingHomework}
        onSubmitCodingHomework={onSubmitHomework}
      />
    );
  }
  if (page === "Homework") {
    const selectedHomework = homeworkItems[selectedHomeworkIndex] || homeworkItems[0];
    return (
      <section className="featurePage homeworkModule" id="eduStudentHomework">
        <div className="featureHero homeworkHero">
          <div className="featureIcon">
            <ClipboardCheck size={34} />
          </div>
          <div>
            <h2>Homework</h2>
            <p>{pageInfo.subtitle}</p>
          </div>
          <div className="homeworkHeroArtwork" aria-hidden="true">
            <span className="homeworkHeroGlow" />
            <img src={homeworkHeaderIllustration} alt="" />
          </div>
          <Badge tone={homeworkItems.length ? "orange" : "green"}>
            {homeworkItems.length} New
          </Badge>
        </div>

        {homeworkItems.length ? (
          <div className="studentHomeworkWorkspace">
            <aside className="studentHomeworkSidebar">
              <div className="studentHomeworkSidebarTitle"><div><strong>Homework from Teacher</strong><small>Select homework to open</small></div><Badge tone="blue">{homeworkItems.length}</Badge></div>
              {homeworkItems.map((item, index) => <button type="button" className={selectedHomeworkIndex === index ? "active" : ""} onClick={() => setSelectedHomeworkIndex(index)} key={`${item.title}-${index}`}><FileText size={18} /><span><strong>{item.title}</strong><small>{item.subject} · Due {formatDueDate(item.due)}</small></span><Badge tone={item.submission ? "green" : "orange"}>{item.submission ? "Submitted" : "Pending"}</Badge></button>)}
            </aside>
            {selectedHomework && <div className="studentHomeworkDetail">
              <StudentHomeworkPaper item={selectedHomework}>
                <AttachmentCard attachment={selectedHomework.attachment} />
                {selectedHomework.teacherReview && <div className="teacherFeedbackBox studentTeacherReview"><div className="studentTeacherReviewTitle"><CheckCircle2 size={18} /><strong>Teacher Review</strong><Badge tone="green">{selectedHomework.teacherReview.status}</Badge></div><p>{selectedHomework.teacherReview.feedback || "Your homework has been reviewed."}</p><div className="assignmentMeta"><span>Reviewed on</span><span>{selectedHomework.teacherReview.reviewedAt || "Reviewed by teacher"}</span></div></div>}
                <HomeworkSubmitBox
                  item={selectedHomework}
                  onSubmitHomework={onSubmitHomework}
                />
              </StudentHomeworkPaper>
            </div>}
          </div>
        ) : (
          <div className="panel homeworkEmptyState">
            <ClipboardCheck size={44} />
            <strong>No teacher homework assigned yet</strong>
            <p>
              Homework assigned by the teacher will appear here. Students cannot
              create homework from this page.
            </p>
          </div>
        )}
      </section>
    );
  }
  if (page === "Messages") {
    return (
      <section className="featurePage messagesModule">
        <div className="featureHero">
          <div className="featureIcon">
            <Mail size={34} />
          </div>
          <div>
            <h2>Messages</h2>
            <p>
              Teacher updates, support notes, and class reminders will appear
              here.
            </p>
          </div>
          <Badge tone={studentMessages.length ? "green" : "blue"}>
            {studentMessages.length} Teacher
          </Badge>
        </div>
        <div className="featureGrid">
          {studentMessages.length
            ? studentMessages.map((message, index) => (
                <article
                  className="panel featureCard teacherMessageCard"
                  key={`${message.sentAt}-${index}`}
                >
                  <div>
                    <strong>{message.title || "Teacher Message"}</strong>
                    <p>{message.text}</p>
                    <small>Sent on {message.sentAt}</small>
                  </div>
                  <Badge tone="green">Teacher</Badge>
                </article>
              ))
            : pageInfo.items.map((item, index) => (
                <article
                  className="panel featureCard"
                  key={`${item.title}-${index}`}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.meta}</p>
                  </div>
                  <Badge tone={item.tone}>{item.status}</Badge>
                </article>
              ))}
        </div>
      </section>
    );
  }
  if (page === "Leaderboard") {
    return (
      <section className="featurePage leaderboardModule">
        <div className="leaderboardHero">
          <div>
            <span className="leaderboardEyebrow">Class 8-A · Weekly ranking</span>
            <h2><Trophy size={30} /> Learning Champions</h2>
            <p>Earn XP by completing lessons, homework, quizzes, and coding challenges.</p>
          </div>
          <div className="leaderboardPeriod"><span>This week</span><strong>03 – 09 Aug</strong></div>
        </div>

        <div className="leaderboardCard">
          <div className="leaderboardTitleRow">
            <div><strong>Top learners</strong><span>Ranked by total XP earned</span></div>
            <div className="leaderboardLegend"><span>Rank</span><span>Learner</span><span>Tasks</span><span>XP</span></div>
          </div>
          <div className="leaderboardList">
            {leaderboardStudents.map((student, index) => {
              const rank = index + 1;
              return (
                <article className={`leaderboardRow rank-${rank} ${student.current ? "currentStudent" : ""}`} key={student.name}>
                  <div className={`rankBadge ${rank <= 3 ? "podium" : ""}`}>{rank <= 3 && <Medal size={14} />}<strong>{rank}</strong></div>
                  <div className={`learnerAvatar ${student.color}`}>{student.initials}</div>
                  <div className="learnerIdentity"><strong>{student.name}</strong><span>{student.current ? "You · Keep climbing!" : `Class 8-A · Level ${12 - index}`}</span></div>
                  <div className={`rankMovement ${student.movement > 0 ? "up" : student.movement < 0 ? "down" : "same"}`}>
                    {student.movement > 0 ? <ChevronUp size={15} /> : student.movement < 0 ? <ChevronDown size={15} /> : <span>—</span>}
                    {student.movement !== 0 && Math.abs(student.movement)}
                  </div>
                  <div className="leaderboardTasks"><strong>{student.tasks}</strong><span>tasks</span></div>
                  <div className="leaderboardXp"><strong>{student.xp.toLocaleString("en-IN")}</strong><span>XP</span></div>
                </article>
              );
            })}
          </div>
          <div className="leaderboardFooter"><span><Trophy size={17} /> You are in the top 10% of your class</span><strong>160 XP to reach #1</strong></div>
        </div>
      </section>
    );
  }
  if (page === "My Courses") {
    return <TeacherCourseLibrary />;
  }
  return (
    <section className="featurePage">
      <div className="featureHero">
        <div className="featureIcon">
          <Icon size={34} />
        </div>
        <div>
          <h2>{page}</h2>
          <p>{pageInfo.subtitle}</p>
        </div>
      </div>
      <div className="featureGrid">
        {assignmentItems.map((item, index) => (
          <article
            className={`panel featureCard ${item.attachment || item.brief ? "withDetails" : ""}`}
            key={`${item.title}-${index}`}
          >
            <div>
              <strong>{item.title}</strong>
              <p>{item.meta}</p>
              {item.brief && <small>{item.brief}</small>}
              <AttachmentCard attachment={item.attachment} />
            </div>
            <Badge tone={item.tone}>{item.status}</Badge>
          </article>
        ))}
      </div>
    </section>
  );
}
function StudentPanel({
  assigned,
  teacherMessages = [],
  onSubmitHomework,
  onLogout,
}) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [greeting, setGreeting] = useState(getTimeGreeting);
  const [codingHomework, setCodingHomework] = useState(null);
  useEffect(() => {
    const timer = window.setInterval(
      () => setGreeting(getTimeGreeting()),
      60000,
    );
    return () => window.clearInterval(timer);
  }, []);
  const openCodingHomework = (item) => {
    setCodingHomework(item);
    setActivePage("Coding Lab");
  };

  return (
    <main className="appShell studentShell">
      <div
        className={`dashboard ${sidebarCollapsed ? "studentSidebarCollapsed" : ""}`}
      >
        <Sidebar
          title={
            <>
              Student
              <br />
              Panel
            </>
          }
          groups={studentNavGroups}
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={onLogout}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((current) => !current)}
        />
        <section className="content">
          <header className="topbar">
            <div>
              <h1>
                {activePage === "Dashboard" ? `${greeting}, Aryan` : activePage}
              </h1>
              <p>
                {activePage === "Dashboard"
                  ? "Here's a clear view of your learning for today."
                  : "Everything you need for this section is ready here."}
              </p>
            </div>
            <div className="headerActions">
              <button aria-label="Notifications">
                <Bell size={20} />
              </button>
              <button aria-label="Profile">
                <CircleUserRound size={22} />
              </button>
            </div>
          </header>
          {activePage === "Dashboard" ? (
            <DashboardHome
              assigned={assigned}
              teacherMessages={teacherMessages}
            />
          ) : (
            <FeaturePage
              page={activePage}
              assigned={assigned}
              teacherMessages={teacherMessages}
              onSubmitHomework={onSubmitHomework}
              onOpenCodingHomework={openCodingHomework}
              codingHomework={codingHomework}
            />
          )}
        </section>
      </div>
    </main>
  );
}


export { DashboardHome, HomeworkSubmitBox, FeaturePage };


