import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
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
  Eye,
  Layers3,
  Library,
  ListChecks,
  LogOut,
  Mail,
  Medal,
  Menu,
  Paperclip,
  PenLine,
  PieChart,
  Play,
  Plus,
  SearchCheck,
  Send,
  Settings,
  Sparkles,
  Trophy,
  Trash2,
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
import { AttachmentCard, Badge } from '../shared/SharedComponents.jsx';

function HomeworkTextEditor({ label, value, onChange, placeholder, maxLength, required = false }) {
  return (
    <label className="homeworkEditor">
      <span>{label} {required && <b>*</b>}</span>
      <span className="homeworkEditorBox">
        <textarea required={required} maxLength={maxLength} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
        <small>{value.length}/{maxLength}</small>
      </span>
    </label>
  );
}

function HomeworkQuestionList({ questions, onChange }) {
  const updateQuestion = (index, changes) => onChange(questions.map((question, questionIndex) => questionIndex === index ? { ...question, ...changes } : question));
  const removeQuestion = (index) => onChange(questions.filter((_, questionIndex) => questionIndex !== index));
  const newQuestion = () => ({ type: "Short Answer", text: "", marks: "1", options: ["", "", "", ""], correctAnswer: "0", saved: false, customCategory: false });
  const savedQuestions = questions.filter((question) => question.saved);
  const hasOpenEditor = questions.some((question) => !question.saved);

  return (
    <section className="homeworkQuestionList">
      <div className="homeworkQuestionHeading">
        <span>Questions <b>*</b></span>
        <button type="button" disabled={hasOpenEditor} onClick={() => onChange([...questions, newQuestion()])}><Plus size={15} /> Add Question</button>
      </div>
      <div className="homeworkQuestionWorkspace">
        <div className="homeworkQuestionEditors">
      {questions.map((question, index) => !question.saved && (
        <div className="homeworkQuestionItem" key={index}>
          <span className="homeworkQuestionNumber">{savedQuestions.length + 1}</span>
          <div className="homeworkQuestionContent">
            <div className="homeworkQuestionTopRow">
              <label className="homeworkQuestionType">Question Type<select value={question.customCategory ? "__custom" : question.type} onChange={(event) => event.target.value === "__custom" ? updateQuestion(index, { type: "", customCategory: true }) : updateQuestion(index, { type: event.target.value, customCategory: false })}><option>MCQ</option><option>True / False</option><option>Fill in the Blank</option><option>Short Answer</option><option>Long Answer</option><option>Case-Based Answer</option><option value="__custom">+ Create New Category</option></select></label>
            </div>
            {question.customCategory && <label className="homeworkCustomCategory">Custom Category Name<input required maxLength={40} value={question.type} onChange={(event) => updateQuestion(index, { type: event.target.value })} placeholder="e.g. Diagram-Based Questions" /></label>}
            <label>Question<textarea required maxLength={1000} value={question.text} onChange={(event) => updateQuestion(index, { text: event.target.value })} placeholder={`Enter question ${index + 1}...`} /></label>
            {question.type === "MCQ" && (
              <div className="homeworkMcqOptions">
                {question.options.map((option, optionIndex) => <label key={optionIndex}><span>{String.fromCharCode(65 + optionIndex)}</span><input required value={option} onChange={(event) => updateQuestion(index, { options: question.options.map((item, itemIndex) => itemIndex === optionIndex ? event.target.value : item) })} placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`} /></label>)}
              </div>
            )}
            <button className="homeworkSaveQuestion" type="button" disabled={!question.type.trim() || !question.text.trim()} onClick={() => updateQuestion(index, { saved: true })}><CheckCircle2 size={16} /> Save Question</button>
          </div>
          <small>{question.text.length}/1000</small>
          {questions.length > 1 && <button type="button" onClick={() => removeQuestion(index)} aria-label={`Remove question ${index + 1}`}><Trash2 size={15} /></button>}
        </div>
      ))}
        {!hasOpenEditor && <div className="homeworkQuestionEmptyEditor"><CheckCircle2 size={22} /><span>Question saved</span><small>Click Add Question to create another.</small></div>}
        </div>
        <aside className="homeworkQuestionPaper">
          <div className="homeworkQuestionPaperHeader"><FileText size={18} /><div><strong>Question Paper</strong><small>{savedQuestions.length} saved {savedQuestions.length === 1 ? "question" : "questions"}</small></div></div>
          <div className="homeworkQuestionPaperBody">
            {savedQuestions.length ? savedQuestions.map((question) => {
              const index = questions.indexOf(question);
              return <article key={index}><div><span>Q{index + 1}</span><em>{question.type}</em></div><p>{question.text}</p>{question.type === "MCQ" && <ol type="A">{question.options.map((option, optionIndex) => <li key={optionIndex}>{option || `Option ${String.fromCharCode(65 + optionIndex)}`}</li>)}</ol>}<button type="button" onClick={() => updateQuestion(index, { saved: false })}><PenLine size={14} /> Edit</button></article>;
            }) : <div className="homeworkQuestionPaperEmpty"><FileText size={28} /><span>Saved questions will appear here</span></div>}
          </div>
        </aside>
      </div>
    </section>
  );
}

function HomeworkQuestionsByCategory({ questions = [], fallbackBrief = "" }) {
  const normalized = (questions.length ? questions : [{ type: "Short Answer", text: fallbackBrief || "No question provided." }]).map((question) => typeof question === "string" ? { type: "Short Answer", text: question } : question);
  const standardTypes = ["MCQ", "True / False", "Fill in the Blank", "Short Answer", "Long Answer", "Case-Based Answer"];
  const customTypes = [...new Set(normalized.map((question) => question.type).filter((type) => type && !standardTypes.includes(type)))];
  const groups = [...standardTypes, ...customTypes].map((type) => ({ type, questions: normalized.filter((question) => question.type === type) })).filter((group) => group.questions.length);
  let questionNumber = 0;

  return (
    <div className="homeworkViewQuestion homeworkCategorizedQuestions">
      <small>Questions</small>
      {groups.map((group, groupIndex) => (
        <section className="homeworkViewCategory" key={group.type}>
          <h4><span>Section {String.fromCharCode(65 + groupIndex)}</span>{group.type} Questions</h4>
          {group.questions.map((item, index) => {
            questionNumber += 1;
            return <div className="homeworkViewQuestionItem" key={`${group.type}-${index}`}><p><strong>{questionNumber}.</strong> {item.text}</p>{item.type === "MCQ" && <ol type="A">{item.options?.map((option, optionIndex) => <li key={optionIndex}>{option}</li>)}</ol>}</div>;
          })}
        </section>
      ))}
    </div>
  );
}

function CreateHomeworkModule({ assigned = [], onCreateHomework, onUpdateHomework, onDeleteHomework }) {
  const [successMessage, setSuccessMessage] = useState("");
  const [attachmentError, setAttachmentError] = useState("");
  const [creationMode, setCreationMode] = useState("manual");
  const [editingId, setEditingId] = useState(null);
  const [viewingHomework, setViewingHomework] = useState(null);
  const [form, setForm] = useState({
    student: "All Students",
    className: "Class 1",
    subject: "Code Pilot",
    title: "",
    due: "2026-07-08",
    priority: "Medium",
    points: "25",
    brief: "",
    questions: [{ type: "Short Answer", text: "", marks: "1", options: ["", "", "", ""], correctAnswer: "0", saved: false }],
    chapter: "",
    homeworkType: "Assignment",
    attachment: null,
  });

  const publishHomework = async (event) => {
    event.preventDefault();
    const homework = {
      student: form.student,
      className: form.className,
      subject: form.subject,
      type: "Homework",
      title: form.title,
      due: form.due,
      priority: form.priority,
      points: Number(form.points) || 0,
      status: "Assigned",
      brief: form.questions.filter((question) => question.text.trim()).map((question) => question.text.trim()).join("\n\n"),
      questions: form.questions.filter((question) => question.text.trim()),
      chapter: form.chapter,
      homeworkType: form.homeworkType,
      attachment: form.attachment,
    };
    if (editingId) {
      await onUpdateHomework(editingId, homework);
      setSuccessMessage("Homework updated successfully.");
    } else {
      await onCreateHomework(homework);
      setSuccessMessage("Homework created and assigned successfully.");
    }
    setEditingId(null);
    setForm({ ...form, title: "", brief: "", questions: [{ type: "Short Answer", text: "", marks: "1", options: ["", "", "", ""], correctAnswer: "0", saved: false }], chapter: "", points: "25", attachment: null });
    setAttachmentError("");
  };
  return (
    <section className="createHomeworkModule">
      <div className="featureHero homeworkHero">
        <div className="featureIcon">
          <ClipboardCheck size={34} />
        </div>
        <div>
          <h2>Create Homework</h2>
          <p>Auto-fill homework details and assign it to students.</p>
        </div>
      </div>
      <section className="teacherGrid">
        <form
          id="homeworkCreatorForm"
          className="panel assignForm createHomeworkForm"
          onSubmit={publishHomework}
        >
          <div className="panelHeader">
            <h2>
              <ClipboardCheck size={22} /> Create Homework
            </h2>
            <span>Ready to assign</span>
          </div>
          <div
            className="homeworkCreationModes"
            role="tablist"
            aria-label="Homework creation method"
          >
            <button
              className={creationMode === "manual" ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={creationMode === "manual"}
              onClick={() => setCreationMode("manual")}
            >
              <PenLine size={17} /> Create Manually
            </button>
            <button
              className={creationMode === "ai" ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={creationMode === "ai"}
              onClick={() => setCreationMode("ai")}
            >
              <Sparkles size={17} /> Create with AI
            </button>
          </div>
          {creationMode === "ai" && (
            <AutomaticHomeworkCreator
              form={form}
              onPdfSelect={(file) => {
                if (form.attachment?.url?.startsWith("blob:")) URL.revokeObjectURL(form.attachment.url);
                if (!file) {
                  setForm((current) => ({ ...current, attachment: null }));
                  return;
                }
                const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
                setForm((current) => ({ ...current, attachment: { name: file.name, size: file.size, type: file.type || "application/octet-stream", kind: extension, url: URL.createObjectURL(file) } }));
              }}
              onGenerate={(item) => setForm((current) => ({
                ...current,
                ...item,
                questions: item.questions?.length ? item.questions.map((question) => typeof question === "string" ? { type: "Short Answer", text: question, marks: "1", options: ["", "", "", ""], correctAnswer: "0", saved: true } : { ...question, marks: question.marks || "1", saved: true }) : item.brief ? [{ type: "Short Answer", text: item.brief, marks: "1", options: ["", "", "", ""], correctAnswer: "0", saved: true }] : current.questions,
              }))}
            />
          )}
          <div className="formRow homeworkIconRow">
            <label>
              Student
              <span className="homeworkControl"><UsersRound size={17} /><select value={form.student} onChange={(event) => setForm({ ...form, student: event.target.value })}>
                  <option>All Students</option>{students.map((student) => <option key={student.name}>{student.name}</option>)}
                </select></span>
            </label>
            <label>
              <span className="homeworkFieldLabel">Title <b>*</b></span>
              <span className="homeworkControl"><FileText size={17} /><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Enter homework title" /></span>
            </label>
          </div>
          <div className="formRow homeworkIconRow">
            <label>
              <span className="homeworkFieldLabel">Class <b>*</b></span>
              <span className="homeworkControl"><GraduationCap size={17} /><select value={form.className} onChange={(event) => setForm({ ...form, className: event.target.value })}>
                  {[1,2,3,4,5,6,7,8].map((item) => <option key={item}>Class {item}</option>)}
                </select></span>
            </label>
            <label>
              <span className="homeworkFieldLabel">Subject <b>*</b></span>
              <span className="homeworkControl"><BookOpen size={17} /><select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}>
                  <option>Code Pilot</option><option>Digicode</option><option>Codegpt Plus 2.2</option>
                </select></span>
            </label>
          </div>
          <div className="formRow homeworkIconRow">
            <label>
              Chapter / Topic
              <span className="homeworkControl"><Library size={17} /><select value={form.chapter} onChange={(event) => setForm({ ...form, chapter: event.target.value })}>
                <option value="">Select chapter or topic</option><option>Chapter 1</option><option>Chapter 2</option><option>Chapter 3</option><option>Revision Topic</option>
              </select></span>
            </label>
            <label>
              Homework Type
              <span className="homeworkControl"><Layers3 size={17} /><select value={form.homeworkType} onChange={(event) => setForm({ ...form, homeworkType: event.target.value })}>
                <option>Assignment</option><option>Practice</option><option>Worksheet</option><option>Project</option><option>Reading</option><option>Revision</option>
              </select></span>
            </label>
          </div>
          <div className="homeworkScheduleGrid homeworkScheduleSimple">
            <label>
              <span className="homeworkFieldLabel">Due Date <b>*</b></span><span className="homeworkControl"><CalendarDays size={16} /><input required type="date" value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} /></span>
            </label>
            <label>Priority<span className="homeworkControl"><Sparkles size={16} /><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></span></label>
          </div>
          {(creationMode === "manual" || form.questions.some((question) => !question.saved && (question.text || "").trim())) && (
            <HomeworkQuestionList questions={form.questions} onChange={(questions) => setForm({ ...form, questions })} />
          )}
          {creationMode === "ai" && <div className="homeworkPdfField">
            <div>
              <strong><Paperclip size={17} /> Attach homework PDF</strong>
              <small>Upload a question sheet, worksheet, or reference material (PDF, maximum 10 MB).</small>
            </div>
            <label className="homeworkPdfButton">
              {form.attachment ? "Replace PDF" : "Choose PDF"}
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
                    setAttachmentError("Please select a PDF file.");
                    event.target.value = "";
                    return;
                  }
                  if (file.size > 10 * 1024 * 1024) {
                    setAttachmentError("PDF must be smaller than 10 MB.");
                    event.target.value = "";
                    return;
                  }
                  if (form.attachment?.url?.startsWith("blob:")) URL.revokeObjectURL(form.attachment.url);
                  setAttachmentError("");
                  setForm({
                    ...form,
                    attachment: {
                      name: file.name,
                      size: file.size,
                      type: file.type || "application/pdf",
                      kind: "PDF",
                      url: URL.createObjectURL(file),
                    },
                  });
                }}
              />
            </label>
            {form.attachment && <span className="homeworkPdfName">{form.attachment.name}</span>}
            {attachmentError && <span className="homeworkPdfError" role="alert">{attachmentError}</span>}
          </div>}
          {successMessage && (
            <div className="homeworkSuccessPopup" role="status">
              {successMessage}
            </div>
          )}
          <button className="homeworkCreateSubmit" type="submit">
            <Send size={17} />
            {editingId
              ? "Update Homework"
              : creationMode === "manual"
                ? "Assign Homework Manually"
                : "Create & Assign with AI"}
          </button>
          <button className="homeworkCreateCancel" type="button" onClick={() => { setEditingId(null); setForm((current) => ({ ...current, title: "", brief: "", questions: [{ type: "Short Answer", text: "", marks: "1", options: ["", "", "", ""], correctAnswer: "0", saved: false }], chapter: "", attachment: null })); }}>Cancel</button>
        </form>
        <aside className="creatorSide">
          <section className="homeworkQuestionPaper homeworkQuestionPaperSidebar">
            <div className="homeworkQuestionPaperHeader"><FileText size={18} /><div><strong>PDF Question Paper</strong><small>{form.questions.filter((question) => question.saved).length} saved questions</small></div><span>PDF</span></div>
            <div className="homeworkQuestionPaperBody">
              <div className="homeworkPdfDocumentHeader">
                <span>HOMEWORK QUESTION PAPER</span>
                <h3>{form.title || "Untitled Homework"}</h3>
                <p>{form.className} · {form.subject}{form.chapter ? ` · ${form.chapter}` : ""}</p>
                <div className="homeworkPdfMetaGrid">
                  <span><small>Assigned To</small><strong>{form.student}</strong></span>
                  <span><small>Class</small><strong>{form.className}</strong></span>
                  <span><small>Subject</small><strong>{form.subject}</strong></span>
                  <span><small>Chapter / Topic</small><strong>{form.chapter || "Not selected"}</strong></span>
                  <span><small>Homework Type</small><strong>{form.homeworkType}</strong></span>
                  <span><small>Priority</small><strong>{form.priority}</strong></span>
                  <span><small>Due Date</small><strong>{formatDueDate(form.due)}</strong></span>
                </div>
              </div>
              {form.questions.some((question) => question.saved) ? (() => {
                const savedQuestions = form.questions.filter((question) => question.saved);
                const standardTypes = ["MCQ", "True / False", "Fill in the Blank", "Short Answer", "Long Answer", "Case-Based Answer"];
                const customTypes = [...new Set(savedQuestions.map((question) => question.type).filter((type) => type && !standardTypes.includes(type)))];
                const typeOrder = [...standardTypes, ...customTypes];
                const groups = typeOrder.map((type) => ({ type, questions: savedQuestions.filter((question) => question.type === type) })).filter((group) => group.questions.length);
                return groups.map((group, groupIndex) => (
                  <section className="homeworkPdfQuestionSection" key={group.type}>
                    <h4><span>Section {String.fromCharCode(65 + groupIndex)}</span>{group.type} Questions</h4>
                    {group.questions.map((question, questionIndex) => {
                      const index = form.questions.indexOf(question);
                      const questionNumber = groups.slice(0, groupIndex).reduce((sum, previousGroup) => sum + previousGroup.questions.length, 0) + questionIndex + 1;
                      return <article key={index}><div><span>Q{questionNumber}</span></div><p>{question.text}</p>{question.type === "MCQ" && <ol type="A">{question.options.map((option, optionIndex) => <li key={optionIndex}>{option || `Option ${String.fromCharCode(65 + optionIndex)}`}</li>)}</ol>}<button type="button" onClick={() => setForm((current) => ({ ...current, questions: current.questions.map((item, itemIndex) => itemIndex === index ? { ...item, saved: false } : item) }))}><PenLine size={14} /> Edit</button></article>;
                    })}
                  </section>
                ));
              })() : <div className="homeworkQuestionPaperEmpty"><FileText size={28} /><span>Save a question to preview it here</span></div>}
            </div>
          </section>
          <section className="panel creatorPreview">
            <div className="panelHeader">
              <h2>
                <FileText size={22} /> Homework Preview
              </h2>
              <Badge>{form.priority}</Badge>
            </div>
            <div className="homeworkTop">
              <div>
                <span>Homework</span>
                <strong>{form.title || "No active homework draft"}</strong>
              </div>
            </div>
            <p>
              {form.questions.filter((question) => question.text).map((question) => question.text).join(" · ") ||
                "Create homework from the form. After assignment, this preview clears automatically."}
            </p>
            <div className="homeworkMeta">
              <div>
                <span>Student</span>
                <strong>{form.student}</strong>
              </div>
              <div>
                <span>Class</span>
                <strong>{form.className}</strong>
              </div>
              <div>
                <span>Subject</span>
                <strong>{form.subject}</strong>
              </div>
              <div>
                <span>Due Date</span>
                <strong>{formatDueDate(form.due)}</strong>
              </div>
              <div>
                <span>Total Marks</span>
                <strong>{form.points}</strong>
              </div>
              <div>
                <span>Type</span>
                <strong>{form.homeworkType}</strong>
              </div>
            </div>
            {form.chapter && <p className="homeworkPreviewChapter"><strong>Topic:</strong> {form.chapter}</p>}
            <AttachmentCard attachment={form.attachment} />
          </section>

          <section className="panel assignedHomeworkList">
            <div className="panelHeader">
              <h2>
                <ClipboardCheck size={22} /> Assigned Homework
              </h2>
              <span>{assigned.length} total</span>
            </div>
            {assigned.length ? (
              assigned.map((item, index) => (
                <article
                  className="assignedHomeworkItem"
                  key={`${item.title}-${index}`}
                >
                  <div>
                    <strong>{item.title || "Untitled Homework"}</strong>
                    <p>
                      {item.student} - {item.className || "Class"} -{" "}
                      {item.subject || "Subject"}
                    </p>
                    <small>
                      Due {formatDueDate(item.due)} - {item.points || 0} points
                    </small>
                  </div>
                  <div className="assignedHomeworkSide">
                  <Badge
                    tone={
                      item.status === "Submitted"
                        ? "green"
                        : item.priority === "High"
                          ? "orange"
                          : "blue"
                    }
                  >
                    {item.status || "Assigned"}
                  </Badge>
                  <div className="assignedHomeworkActions">
                    <button type="button" onClick={() => setViewingHomework(item)}><Eye size={15} /> View</button>
                    <button type="button" onClick={() => {
                      setEditingId(item.id);
                      setForm((current) => ({
                        ...current,
                        student: item.student || "All Students",
                        className: item.className || "Class 1",
                        subject: item.subject || "Code Pilot",
                        title: item.title || "",
                        due: item.due || current.due,
                        priority: item.priority || "Medium",
                        points: String(item.points || 25),
                        brief: item.brief || "",
                        questions: item.questions?.length ? item.questions.map((question) => typeof question === "string" ? { type: "Short Answer", text: question, marks: "1", options: ["", "", "", ""], correctAnswer: "0", saved: true } : { ...question, marks: question.marks || "1", saved: true }) : [{ type: "Short Answer", text: item.brief || "", marks: "1", options: ["", "", "", ""], correctAnswer: "0", saved: true }],
                        chapter: item.chapter || "",
                        homeworkType: item.homeworkType || "Assignment",
                        attachment: item.attachment || null,
                      }));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}><PenLine size={15} /> Edit</button>
                    <button className="delete" type="button" onClick={() => {
                      if (window.confirm(`Delete “${item.title || "this homework"}”?`)) onDeleteHomework(item.id);
                    }}><Trash2 size={15} /> Delete</button>
                  </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="emptyHomework">
                <strong>No homework assigned yet</strong>
                <p>Create homework from the form and it will appear here.</p>
              </div>
            )}
          </section>
        </aside>
      </section>
      {viewingHomework && (
        <div className="homeworkViewOverlay" onMouseDown={() => setViewingHomework(null)}>
          <section className="homeworkViewModal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Homework details">
            <div className="homeworkViewHeader"><div><span>Assigned homework</span><h3>{viewingHomework.title || "Untitled Homework"}</h3></div><button type="button" onClick={() => setViewingHomework(null)} aria-label="Close"><X size={18} /></button></div>
            <div className="homeworkViewMeta"><span><small>Student</small><strong>{viewingHomework.student}</strong></span><span><small>Class</small><strong>{viewingHomework.className}</strong></span><span><small>Subject</small><strong>{viewingHomework.subject}</strong></span><span><small>Due date</small><strong>{formatDueDate(viewingHomework.due)}</strong></span><span><small>Priority</small><strong>{viewingHomework.priority}</strong></span><span><small>Points</small><strong>{viewingHomework.points}</strong></span></div>
            {viewingHomework.chapter && <div className="homeworkViewQuestion"><small>Chapter / Topic</small><p>{viewingHomework.chapter}</p></div>}
            <HomeworkQuestionsByCategory questions={viewingHomework.questions} fallbackBrief={viewingHomework.brief} />
            <AttachmentCard attachment={viewingHomework.attachment} />
          </section>
        </div>
      )}
    </section>
  );
}

function EmbeddedAssistant({ form = {}, onApply, sourceDefaultPrompt = "" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask me to generate homework title, brief, priority, or points.",
    },
  ]);
  const [input, setInput] = useState(sourceDefaultPrompt || form.title || "");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const send = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const proxyResp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages.concat({ role: "user", text }).map((m) => ({
            role: m.role === "assistant" ? "assistant" : m.role,
            content: m.text,
          })),
        }),
      });
      if (proxyResp.ok) {
        const data = await proxyResp.json();
        const textResp =
          data?.choices?.[0]?.message?.content || JSON.stringify(data);
        setMessages((m) => [...m, { role: "assistant", text: textResp }]);
        setLoading(false);
        return;
      }
      const reply = buildAssistantReply("Writing", text);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err) {
      const reply = buildAssistantReply("Writing", text);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = () => {
    setIsSuggesting(true);
    const base = (
      form.title ||
      (form.attachment && form.attachment.name) ||
      input ||
      "Homework"
    ).replace(/\.[^/.]+$/, "");
    const cleaned = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    const byType = "Written Answer";
    const suggested = [
      {
        title: `${cleaned} - Assignment`,
        brief: `${byType}: Read the question, write your answer in the homework box, and submit it here.`,
        priority: "Medium",
        points: "25",
      },
      {
        title: `Quick Practice: ${cleaned}`,
        brief: `Quick practice: attempt the short questions and write answers in the homework box.`,
        priority: "Low",
        points: "15",
      },
      {
        title: `Project: ${cleaned}`,
        brief: `Project work: write a short summary, steps, or notes in the homework box.`,
        priority: "High",
        points: "40",
      },
    ];
    setTimeout(() => {
      setSuggestions(suggested);
      setIsSuggesting(false);
    }, 300);
  };

  const apply = (item) => {
    if (typeof onApply === "function") onApply(item);
    setSuggestions([]);
  };

  return (
    <div>
      <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
        <div style={{ display: "grid", gap: 8 }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                padding: 10,
                borderRadius: 8,
                background:
                  m.role === "user" ? "var(--primary)" : "var(--surface)",
                color: m.role === "user" ? "#fff" : "var(--ink)",
              }}
            >
              <strong style={{ fontSize: 12 }}>
                {m.role === "user" ? "You" : "Assistant"}
              </strong>
              <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={send}
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type prompt (e.g. generate title & brief)"
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading} style={{ minHeight: 40 }}>
          {loading ? "..." : "Ask"}
        </button>
      </form>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <button
          type="button"
          onClick={generateSuggestions}
          style={{ minHeight: 38, padding: "8px 12px" }}
        >
          {isSuggesting ? "Generating..." : "Generate Suggestions"}
        </button>
        <small style={{ color: "var(--muted)" }}>
          Auto-generate title/instructions from topic or title
        </small>
      </div>
      {suggestions.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          {suggestions.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <strong>{item.title}</strong>
                <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
                  {item.brief}
                </p>
                <small
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    color: "var(--muted)",
                  }}
                >
                  {item.priority} · {item.points} points
                </small>
              </div>
              <div style={{ alignSelf: "center" }}>
                <button
                  type="button"
                  onClick={() => apply(item)}
                  style={{ minHeight: 36, padding: "8px 12px" }}
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AutomaticHomeworkCreator({ form, onGenerate, onPdfSelect }) {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const pdfInputRef = useRef(null);
  const wordInputRef = useRef(null);

  const attachFile = (file) => {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(extension)) {
      setError("Please select a PDF or Word file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10 MB.");
      return;
    }
    setError("");
    setShowAttachmentMenu(false);
    onPdfSelect(file);
  };

  const generateHomework = async () => {
    setError("");
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          fileName: form.attachment?.name || "",
          fileType: form.attachment?.kind || "",
          currentTitle: form.title || "",
        }),
      });
      const responseText = await response.text();
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            response.ok
              ? "The homework generator returned an invalid response."
              : "The homework API is unavailable. Start the app with npm run dev and try again.",
          );
        }
      }
      if (!response.ok) {
        throw new Error(
          data.error ||
            "The homework API is unavailable. Start the app with npm run dev and try again.",
        );
      }
      if (!responseText)
        throw new Error("The homework generator returned an empty response.");
      onGenerate(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to reach the AI generator. Start the API server and try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section
      className="automaticCreator"
      aria-label="Automatic homework generator"
    >
      <div>
        <strong>
          <Sparkles size={17} /> Generate assignment details
        </strong>
      
      </div>
      <div className="automaticCreatorActions automaticCreatorComposer">
        {form.attachment && (
          <div className="automaticCreatorAttachments">
            <div className="automaticCreatorAttachmentCard">
              <span className={`automaticCreatorAttachmentPreview automaticCreatorAttachmentPreview--${form.attachment.kind?.toLowerCase() || "file"}`}>
                <FileText size={20} /><small>{form.attachment.kind || "FILE"}</small>
              </span>
              <span title={form.attachment.name}>{form.attachment.name}</span>
              <button type="button" className="automaticCreatorAttachmentRemove" aria-label={`Remove ${form.attachment.name}`} onClick={() => onPdfSelect(null)}>
                <X size={11} />
              </button>
            </div>
          </div>
        )}
        <textarea
          rows="2"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Describe the homework topic, class level, and what students should practice..."
        />
        <div className="automaticCreatorComposerBar">
        <div className="automaticCreatorAttachmentPicker">
          <button
            type="button"
            className="automaticCreatorPdfButton"
            title={form.attachment ? "Replace attached file" : "Attach a file"}
            aria-label={form.attachment ? "Replace attached file" : "Attach a file"}
            aria-expanded={showAttachmentMenu}
            onClick={() => setShowAttachmentMenu((visible) => !visible)}
          >
            <Paperclip size={17} />
          </button>
          {showAttachmentMenu && (
            <div className="automaticCreatorAttachmentMenu" role="menu">
              <button type="button" role="menuitem" onClick={() => pdfInputRef.current?.click()}><FileText size={16} /> PDF file</button>
              <button type="button" role="menuitem" onClick={() => wordInputRef.current?.click()}><FileText size={16} /> Word file</button>
            </div>
          )}
          <input ref={pdfInputRef} className="automaticCreatorFileInput" type="file" accept="application/pdf,.pdf" onChange={(event) => attachFile(event.target.files?.[0])} />
          <input ref={wordInputRef} className="automaticCreatorFileInput" type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => attachFile(event.target.files?.[0])} />
        </div>
        <button
          type="button"
          className="automaticCreatorSendButton"
          onClick={generateHomework}
          disabled={isGenerating}
          aria-label={isGenerating ? "Generating homework" : "Generate homework"}
          title={isGenerating ? "Generating homework" : "Generate homework"}
        >
          <ChevronUp size={21} />{" "}
          {isGenerating ? "Generating…" : "Generate with AI"}
        </button>
        </div>
      </div>
      {error && (
        <p className="automaticCreatorError" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}


export { CreateHomeworkModule, EmbeddedAssistant, AutomaticHomeworkCreator };
