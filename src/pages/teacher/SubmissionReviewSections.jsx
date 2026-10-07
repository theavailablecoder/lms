import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  Eye,
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

function SubmittedWorkReview({ assigned, onReviewSubmission }) {
  const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);
  const submittedWork = assigned.flatMap((item, sourceIndex) => {
    const submissions = item.submissions?.length ? item.submissions : (item.submission ? [item.submission] : []);
    const uniqueSubmissions = [...submissions].reverse().filter((submission, reverseIndex, reversed) => {
      const identity = submission.studentName?.trim().toLowerCase() || submission.studentId || `legacy-${sourceIndex}`;
      return reversed.findIndex((candidate) => (candidate.studentName?.trim().toLowerCase() || candidate.studentId || `legacy-${sourceIndex}`) === identity) === reverseIndex;
    }).reverse();
    return uniqueSubmissions.map((submission, submissionIndex) => ({ ...item, sourceIndex, submissionIndex, submission, teacherReview: submission.teacherReview || null }));
  });
  
  return (
    <section className="reviewModule">
      <div className="featureHero homeworkHero">
        <div className="featureIcon">
          <FileCheck2 size={34} />
        </div>
        <div>
          <h2>Submitted Work</h2>
          <p>Check student written submissions and send review updates.</p>
        </div>
        <Badge tone={submittedWork.length ? "orange" : "green"}>
          {submittedWork.length} Submitted
        </Badge>
      </div>

      {submittedWork.length ? (
        <div className="homeworkReviewWorkspace">
          <aside className="homeworkWorkList">
            <header><div><strong>All Student Work</strong><small>Submitted and reviewed homework</small></div><Badge tone="blue">{submittedWork.length}</Badge></header>
            {submittedWork.map((item, index) => <button type="button" className={selectedWorkIndex === index ? "active" : ""} onClick={() => setSelectedWorkIndex(index)} key={`${item.title}-${item.sourceIndex}-${getSubmissionStudentName(item) || item.submissionIndex}`}><span className="homeworkWorkIcon"><FileCheck2 size={17} /></span><span><strong>{getSubmissionStudentName(item)}</strong><small>{item.title}</small><em>Submitted {item.submission.submittedAt}</em></span><Badge tone={item.teacherReview ? "green" : "orange"}>{item.teacherReview ? "Reviewed" : "New"}</Badge></button>)}
          </aside>
          <SubmittedWorkCard item={submittedWork[selectedWorkIndex] || submittedWork[0]} onReviewSubmission={onReviewSubmission} />
        </div>
      ) : (
        <div className="panel homeworkEmptyState">
          <FileCheck2 size={44} />
          <strong>No submitted work yet</strong>
          <p>
            Student submissions will appear here with their answer and
            submission time.
          </p>
        </div>
      )}
    </section>
  );
}

function SubmittedWorkCard({ item, onReviewSubmission }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(
    item.teacherReview?.status || "Checked",
  );
  const [feedback, setFeedback] = useState(
    item.teacherReview?.feedback || "Good work. Keep improving the details.",
  );

  useEffect(() => {
    setReviewStatus(item.teacherReview?.status || "Checked");
    setFeedback(item.teacherReview?.feedback || "Good work. Keep improving the details.");
  }, [item.sourceIndex, item.teacherReview]);

  const saveReview = (event) => {
    event.preventDefault();
    onReviewSubmission(item.sourceIndex, {
      studentId: item.submission.studentId,
      studentName: getSubmissionStudentName(item),
      status: reviewStatus,
      feedback: feedback.trim(),
      reviewedAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
  };

  return (
    <article className="panel reviewCard">
      <div className="reviewTop">
        <span className="reviewStudentAvatar"><CircleUserRound size={23} /></span>
        <div>
          <span>{getSubmissionStudentName(item)}</span>
          <strong>{item.title}</strong>
          <div className="reviewMetaLine">
            <span><FileText size={13} /> {item.type}</span>
            <span><CalendarDays size={13} /> Due {formatDueDate(item.due)}</span>
            <span><Clock3 size={13} /> {item.submission.submittedAt}</span>
          </div>
        </div>
        <Badge tone={item.teacherReview ? "green" : "orange"}>
          {item.teacherReview ? item.teacherReview.status : "New"}
        </Badge>
      </div>

      <div className="submissionBlock">
        <div className="submissionBlockTitle"><span><FileCheck2 size={18} /></span><div><strong>Student Answer</strong><small>Open the submitted response for detailed review</small></div></div>
        <p>{item.submission.answers ? `${Object.keys(item.submission.answers).length} question answers submitted.` : item.submission.answer || "No written note added."}</p>
        {item.submission.answers && <button type="button" className="viewStudentAnswersButton" onClick={() => setShowAnswers(true)}><Eye size={16} /> View Student Answers <ChevronRight size={16} /></button>}
        <AttachmentCard attachment={item.submission.attachment} />
      </div>
      <form className="reviewForm" onSubmit={saveReview}>
        <div className="formRow">
          <label>
            <span className="reviewFieldLabel"><CheckCircle2 size={15} /> Status</span>
            <select
              value={reviewStatus}
              onChange={(event) => setReviewStatus(event.target.value)}
            >
              <option>Checked</option>
              <option>Needs Revision</option>
              <option>Excellent</option>
              <option>Redo</option>
            </select>
          </label>
        </div>
        <label>
          <span className="reviewFieldLabel"><PenLine size={15} /> Teacher Feedback</span>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
          />
        </label>
        {item.teacherReview?.reviewedAt && (
          <p className="submittedTime">
            Last reviewed on {item.teacherReview.reviewedAt}
          </p>
        )}
        <button type="submit"><Send size={16} /> {item.teacherReview ? "Update Review" : "Save Review"}</button>
      </form>
      {showAnswers && createPortal(<div className="studentAnswersModalBackdrop homeworkAnswersPopup" role="presentation" onMouseDown={() => setShowAnswers(false)}><section className="studentAnswersModal" role="dialog" aria-modal="true" aria-label="Student homework answers" onMouseDown={(event) => event.stopPropagation()}><header><div><small>Homework Submission</small><h2>{getSubmissionStudentName(item)} Answers</h2><p>{item.title} · {item.subject}</p></div><button type="button" aria-label="Close answers" onClick={() => setShowAnswers(false)}><X size={18} /></button></header><HomeworkSubmissionAnswers item={item} /><footer><span>Submitted {item.submission.submittedAt}</span><button type="button" onClick={() => setShowAnswers(false)}>Close</button></footer></section></div>, document.body)}
    </article>
  );
}

function HomeworkSubmissionAnswers({ item }) {
  const categoryOrder = ["MCQ", "Fill in the Blank", "True / False", "Short Answer", "Long Answer", "Case-Based Answer"];
  const indexedQuestions = (item.questions || []).map((question, originalIndex) => ({ question, originalIndex }));
  const questionTypes = [...new Set(indexedQuestions.map(({ question }) => question.type || "Question"))];
  const categories = [...categoryOrder, ...questionTypes.filter((type) => !categoryOrder.includes(type))].map((type) => ({ type, questions: indexedQuestions.filter(({ question }) => (question.type || "Question") === type) })).filter((category) => category.questions.length);
  return <section className="gradingWrittenAnswers"><h4>Student Answers</h4>{categories.map((category, categoryIndex) => <div className="gradingAnswerCategory" key={category.type}><header><span>Section {String.fromCharCode(65 + categoryIndex)}</span><b>{category.type} Questions</b><small>{category.questions.length} Answers</small></header>{category.questions.map(({ question, originalIndex }, questionIndex) => <article key={originalIndex}><small>Q{questionIndex + 1}</small><b>{question.text}</b><p>{item.submission.answers?.[originalIndex] || "Not answered"}</p></article>)}</div>)}</section>;
}

function getSubmissionStudentName(item) {
  return item.submission?.studentName || (item.student === "All Students" ? studentProfile.name : item.student) || "Student";
}


export { SubmittedWorkReview, SubmittedWorkCard };


