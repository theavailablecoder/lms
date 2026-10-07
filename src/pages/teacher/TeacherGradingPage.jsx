import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, ChevronDown, Clock3, FileCheck2, FileText, Menu, SearchCheck, Send, UsersRound, X } from '../../icons/index.js';

const sampleRows = [
  { id: 's1', student: 'Aarav Patel', roll: '01', submitted: '14 May 2025\n10:32 AM', score: 48, grade: 'A', state: 'Graded' },
  { id: 's2', student: 'Diya Sharma', roll: '02', submitted: '14 May 2025\n09:15 AM', score: 42, grade: 'B', state: 'Graded' },
  { id: 's3', student: 'Kabir Singh', roll: '03', submitted: '15 May 2025\n08:40 AM', score: '', grade: '', state: 'Late' },
  { id: 's4', student: 'Ishita Verma', roll: '04', submitted: '14 May 2025\n11:02 AM', score: 36, grade: 'C', state: 'Pending' },
  { id: 's5', student: 'Rohan Mehta', roll: '05', submitted: '', score: '', grade: '', state: 'Not Submitted' },
  { id: 's6', student: 'Ananya Singh', roll: '06', submitted: '13 May 2025\n07:50 PM', score: 54, grade: 'A+', state: 'Graded' },
  { id: 's7', student: 'Vivaan Gupta', roll: '07', submitted: '14 May 2025\n01:20 PM', score: 46, grade: 'A', state: 'Graded' },
  { id: 's8', student: 'Myra Joshi', roll: '08', submitted: '15 May 2025\n09:12 AM', score: '', grade: '', state: 'Pending' },
  { id: 's9', student: 'Arjun Nair', roll: '09', submitted: '13 May 2025\n05:45 PM', score: 40, grade: 'B', state: 'Graded' },
  { id: 's10', student: 'Saanvi Kapoor', roll: '10', submitted: '', score: '', grade: '', state: 'Not Submitted' },
  { id: 's11', student: 'Reyansh Malhotra', roll: '11', submitted: '15 May 2025\n08:56 AM', score: '', grade: '', state: 'Late' },
  { id: 's12', student: 'Kiara Iyer', roll: '12', submitted: '14 May 2025\n02:16 PM', score: 51, grade: 'A', state: 'Graded' },
  { id: 's13', student: 'Aditya Rao', roll: '13', submitted: '14 May 2025\n04:10 PM', score: '', grade: '', state: 'Pending' },
  { id: 's14', student: 'Aanya Das', roll: '14', submitted: '13 May 2025\n06:22 PM', score: 44, grade: 'B', state: 'Graded' },
  { id: 's15', student: 'Ishaan Khanna', roll: '15', submitted: '14 May 2025\n12:05 PM', score: 38, grade: 'C', state: 'Graded' },
  { id: 's16', student: 'Nisha Reddy', roll: '16', submitted: '', score: '', grade: '', state: 'Not Submitted' },
  { id: 's17', student: 'Dev Sharma', roll: '17', submitted: '15 May 2025\n09:28 AM', score: '', grade: '', state: 'Late' },
];
const tabs = ['All Students', 'Pending', 'Graded', 'Not Submitted'];
const type = (state) => state === 'Graded' ? 'graded' : state === 'Not Submitted' ? 'missing' : state === 'Late' ? 'late' : 'pending';

export default function TeacherGradingPage() {
  const [tab, setTab] = useState('All Students');
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [sectionFilter, setSectionFilter] = useState('All Sections');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(null);
  const [marks, setMarks] = useState('36');
  const [feedback, setFeedback] = useState('Good effort! Your understanding of the concept is clear.\nWork on improving presentation and adding more diagrams.');
  const [rubric, setRubric] = useState([12, 14, 6, 4]);
  const [latestReviewedId, setLatestReviewedId] = useState(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [fileActionMessage, setFileActionMessage] = useState('');
  const [rows, setRows] = useState(() => [].map((student, index) => {
    const gradingData = sampleRows[index % sampleRows.length];
    return {
      ...gradingData,
      state: gradingData.state === 'Late' ? 'Pending' : gradingData.state,
      id: student.email || `teacher-student-${index + 1}`,
      student: student.name,
      roll: student.rollNo || String(index + 1).padStart(2, '0'),
      className: `${student.className} - ${student.section || 'A'}`,
      section: student.section || 'A',
      email: student.email || '',
      ...(gradingData.state === 'Graded' ? { feedback: 'Reviewed and graded. Good work—keep improving your presentation.' } : {}),
    };
  }));
  const active = selected === null ? null : rows[selected];
  const submissionFile = active?.submission?.attachment;
  const downloadSubmissionFile = () => {
    if (!submissionFile?.url) {
      setFileActionMessage('No student file has been attached yet.');
      return;
    }
    const link = document.createElement('a');
    link.href = submissionFile.url;
    link.download = submissionFile.name || 'submission';
    link.click();
  };
  const classRows = rows.filter((row) =>
    (classFilter === 'All Classes' || row.className.startsWith(`${classFilter} `) || row.className === classFilter)
    && (sectionFilter === 'All Sections' || row.section === sectionFilter));
  const filteredRows = classRows.filter((row) => (tab === 'All Students' || row.state === tab || (tab === 'Pending' && ['Pending', 'Late'].includes(row.state))) && row.student.toLowerCase().includes(query.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginationGroupStart = Math.floor((activePage - 1) / 4) * 4 + 1;
  const paginationPages = Array.from({ length: Math.min(4, totalPages - paginationGroupStart + 1) }, (_, index) => paginationGroupStart + index);
  const visible = filteredRows.slice((activePage - 1) * pageSize, activePage * pageSize);
  useEffect(() => {
    const handleGraderVisibility = (event) => {
      const grader = document.querySelector('.exactGrader');
      const workspace = document.querySelector('.gradingExactBody');
      if (!grader) return;
      if (event.target.closest('.exactGrader .close')) {
        grader.style.display = 'none';
        if (workspace) workspace.style.gridTemplateColumns = 'minmax(0, 1fr)';
      }
      if (event.target.closest('.exactTable .review, .exactTable .grade')) {
        grader.style.display = '';
        if (workspace) workspace.style.gridTemplateColumns = '';
      }
    };
    document.addEventListener('click', handleGraderVisibility);
    return () => document.removeEventListener('click', handleGraderVisibility);
  }, []);
  useEffect(() => {
    if (!active) return;
    setMarks(active.score === '' ? '' : String(active.score));
    setFeedback(active.feedback || '');
  }, [active?.id]);
  const count = (name) => name === 'All Students' ? classRows.length : name === 'Pending' ? classRows.filter((row) => ['Pending', 'Late'].includes(row.state)).length : classRows.filter((row) => row.state === name).length;
  const save = async () => { const review = { status: 'Graded', score: Number(marks), grade: gradeForTotal(Number(marks), active?.points || 60), feedback: feedback.trim(), reviewedAt: new Date().toLocaleString('en-IN') }; setRows((current) => current.map((row, index) => index === selected ? { ...row, state: 'Graded', ...review } : row)); setLatestReviewedId(active?.id || null); };
  const openReview = (index) => {
    setSelected(index);
    const grader = document.querySelector('.exactGrader');
    const workspace = document.querySelector('.gradingExactBody');
    if (grader) grader.style.display = '';
    if (workspace) workspace.style.gridTemplateColumns = '';
    requestAnimationFrame(() => document.querySelector('.gradeForm textarea')?.focus());
  };
  return <main className="gradingExact">
    <header className="akGradingWelcome"><div><span>ASSESSMENT WORKSPACE</span><h2>A little feedback. A big difference.</h2><p>Find student submissions, review their work, and make every next step clearer.</p></div><span className="akGradingWelcomeIcon"><FileCheck2 size={32} /></span></header>
    <section className="akGradingSummary" aria-label="Submission overview">
      <article><UsersRound size={20} /><div><strong>{classRows.length}</strong><span>Students in view</span></div></article>
      <article><Clock3 size={20} /><div><strong>{count('Pending')}</strong><span>Ready for review</span></div></article>
      <article><CheckCircle2 size={20} /><div><strong>{count('Graded')}</strong><span>Grading complete</span></div></article>
      <article><FileText size={20} /><div><strong>{count('Not Submitted')}</strong><span>Awaiting submission</span></div></article>
    </section>
    <div className="gradingExactBody"><section className="gradingExactMain">
      <LatestFeedback row={rows.find((row) => row.id === latestReviewedId)} />
      <div className="gradingClassFilterBar">
        <span className="gradingFilterIcon"><UsersRound size={23} /></span>
        <div className="gradingFilterCopy"><strong>Find your class</strong><small>Choose a class and section to focus your review.</small></div>
        <label htmlFor="grading-class-filter">Class</label>
        <select id="grading-class-filter" value={classFilter} onChange={(event) => { setClassFilter(event.target.value); setSectionFilter('All Sections'); setCurrentPage(1); }}>
          <option>All Classes</option>
          {Array.from({ length: 8 }, (_, index) => <option key={index + 1}>{`Class ${index + 1}`}</option>)}
        </select>
        <label htmlFor="grading-section-filter">Section</label>
        <select id="grading-section-filter" value={sectionFilter} onChange={(event) => { setSectionFilter(event.target.value); setCurrentPage(1); }}>
          <option>All Sections</option>
          {['A', 'B', 'C', 'D'].map((section) => <option key={section}>{section}</option>)}
        </select>
      </div>
      <section className="exactTableCard">
        <div className="exactTableTools">
          <div>{tabs.map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item === 'All Students' ? <UsersRound size={15} /> : item === 'Pending' || item === 'Late' ? <Clock3 size={15} /> : item === 'Graded' ? <CheckCircle2 size={15} /> : <X size={15} />}<span>{item}</span><em>{count(item)}</em></button>)}</div>
          <label><SearchCheck size={16} /><input aria-label="Search students by name" value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder="Search student name…" /></label>
        </div>
        <table className="exactTable">
          <thead><tr><th>Roll No.</th><th>Student</th><th>Status</th><th>Submitted On</th><th>Score</th><th>Percentage</th><th>Grade</th><th>Action</th></tr></thead>
          <tbody>{visible.map((row) => <tr key={row.id}><td><strong>{row.roll}</strong></td><td><span className="avatar">{initials(row.student)}</span><b>{row.student}</b></td><td><span className={`state ${type(row.state)}`}>{row.state === 'Not Submitted' ? 'Not Submitted' : 'Submitted'}</span></td><td>{row.submitted ? row.submitted.split('\n').map((item) => <span key={item}>{item}<br /></span>) : '—'}</td><td>{row.score === '' ? '—' : `${row.score} / 60`}</td><td>{row.score === '' ? '—' : `${Math.round(row.score / 60 * 100)}%`}</td><td>{row.grade || '—'}</td><td><button className={row.state === 'Graded' ? 'review' : 'grade'} onClick={() => setSelected(rows.indexOf(row))}>{row.state === 'Graded' ? 'Review' : row.state === 'Not Submitted' ? 'Reminder' : 'Grade'}</button></td></tr>)}</tbody>
        </table>
        {!visible.length && <div className="akGradingEmpty" role="status"><span><FileCheck2 size={34} /></span><h3>{rows.length ? 'No students match these filters' : 'Your review queue is clear'}</h3><p>{rows.length ? 'Try another name, class, or submission status.' : 'There are no student submissions available in this workspace yet.'}</p>{(query || tab !== 'All Students' || classFilter !== 'All Classes' || sectionFilter !== 'All Sections') && <button type="button" onClick={() => { setQuery(''); setTab('All Students'); setClassFilter('All Classes'); setSectionFilter('All Sections'); setCurrentPage(1); }}>Clear filters</button>}</div>}
        <footer className="exactPagination">
          <span>Showing <strong>{filteredRows.length ? (activePage - 1) * pageSize + 1 : 0}–{Math.min(activePage * pageSize, filteredRows.length)}</strong> of <strong>{filteredRows.length}</strong> students</span>
          <div className="gradingPaginationControls">
            <button type="button" className="pageArrow" aria-label="Previous page" disabled={activePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>‹</button>
            {paginationPages.map((page) => <button type="button" key={page} className={activePage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>{page}</button>)}
            <button type="button" className="pageArrow" aria-label="Next page" disabled={activePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>›</button>
          </div>
          <label className="gradingPageSize"><span>Rows</span><select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></label>
        </footer>
      </section>
    </section>
    {selected !== null && <aside className="exactGrader">
      <header><button className="back">← &nbsp; Grading Student</button><button className="close" type="button" onClick={() => setSelected(null)}><X size={15} /></button></header>
      <section className="studentDetail"><span className="avatar big">{initials(active?.student || 'Student')}</span><div><b>{active?.student || 'Student'}</b><small>Roll No. {active?.roll || '—'} · {active?.className || 'Class'}</small><small>Homework submission</small></div></section>
      <section className="graderAssignment"><small>Test / Exam</small><b>{active?.title || 'Assessment'}</b><em>{active?.subject || 'General'}</em><small>Submitted On</small><b>{active?.submitted || '—'}</b></section>
      {submissionFile && <section className="submissionFile"><b>Submission File</b><div><FileText size={18} /><span>{submissionFile.name}<small>{`${(submissionFile.size / 1024 / 1024).toFixed(1)} MB`}</small></span><button type="button" className="showFileButton" onClick={() => { setIsFilePreviewOpen(true); setFileActionMessage(''); }}>Show File</button><button type="button" className="downloadFileButton" onClick={downloadSubmissionFile}>Download</button></div>{fileActionMessage && <p className="fileActionMessage">{fileActionMessage}</p>}{isFilePreviewOpen && <div className="submissionPreview">{submissionFile.url ? <iframe title={`Preview of ${submissionFile.name}`} src={submissionFile.url} /> : <p>File metadata is available, but no preview URL was stored.</p>}<button type="button" onClick={() => setIsFilePreviewOpen(false)}>Hide File</button></div>}</section>}
      <section className="gradeForm simplifiedGradeForm">
        <h4>Give Marks</h4>
        <p className="gradingMarksHint">Enter marks according to this assessment or assignment's total marks.</p>
        <label className="directMarksField"><span>Marks Obtained</span><div><input type="number" min="0" max={active?.points || 60} value={marks} onChange={(event) => setMarks(event.target.value)} placeholder="0" /><strong>/ {active?.points || 60}</strong></div></label>
        <label>Teacher Feedback <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Add feedback for the student (optional)" /></label>
        <div className="quick"><small>Quick Feedback</small>{['Good Effort', 'Well Done', 'Needs Improvement', 'Keep It Up'].map((item) => <button type="button" key={item} onClick={() => setFeedback(item)}>{item}</button>)}</div>
      </section>
      <footer><span>◉ Review ready</span><button>Save Draft</button><button className="submit" onClick={save}>Submit Grade</button></footer>
    </aside>}
    </div>
  </main>;
}
function Stat({ icon, label, value, note, tone = 'blue' }) { return <article className={`exactStat ${tone}`}><span>{typeof icon === 'string' ? icon : icon}</span><div><small>{label}</small><b>{value}</b><em>{note}</em></div></article>; }
function Meta({ title, value }) { return <div className="assignmentMeta"><small>{title}</small><b>{value.split('\n').map((item) => <span key={item}>{item}<br /></span>)}</b></div>; }
function LatestFeedback({ row }) { if (!row?.feedback) return null; return <section className="latestFeedback"><div className="latestFeedbackTitle"><div><small>Latest Teacher Feedback</small><b>{row.student}</b><span>Roll No. {row.roll} · {row.score} / 60</span></div><span className="avatar">{initials(row.student)}</span></div><p>{row.feedback}</p></section>; }
function FeedbackOverview({ rows, onEdit }) { const reviewed = rows.filter((row) => row.feedback); return <section className="feedbackOverview"><header><div><h3>Teacher Feedback</h3><p>Feedback shared after reviewing student work.</p></div><span>{reviewed.length} Reviewed</span></header>{reviewed.length ? <div className="feedbackOverviewList">{reviewed.map((row) => <article key={row.id}><span className="avatar">{initials(row.student)}</span><div><b>{row.student}</b><small>Roll No. {row.roll} · {row.submitted ? `Submitted ${row.submitted.replace('\n', ' ')}` : 'Not submitted'}</small><p>{row.feedback}</p></div><aside><strong>{row.score} / 60</strong><button type="button" onClick={() => onEdit(rows.indexOf(row))}>View & Edit</button></aside></article>)}</div> : <p className="feedbackEmpty">No teacher feedback has been submitted yet.</p>}</section>; }
function SubmissionAnswers({ row }) {
  const answers = row?.submission?.answers;
  if (!answers || !row?.questions?.length) return row?.submission?.answer ? <section className="gradingWrittenAnswers"><h4>Student Answer</h4><p>{row.submission.answer}</p></section> : null;
  const categoryOrder = ['MCQ', 'Fill in the Blank', 'True / False', 'Short Answer', 'Long Answer', 'Case-Based Answer'];
  const questionTypes = [...new Set(row.questions.map((question) => question.type || 'Question'))];
  const categories = [...categoryOrder, ...questionTypes.filter((type) => !categoryOrder.includes(type))]
    .map((type) => ({ type, questions: row.questions.map((question, originalIndex) => ({ question, originalIndex })).filter(({ question }) => (question.type || 'Question') === type) }))
    .filter((category) => category.questions.length);
  return <section className="gradingWrittenAnswers"><h4>Student Answers</h4>{categories.map((category, categoryIndex) => <div className="gradingAnswerCategory" key={category.type}><header><span>Section {String.fromCharCode(65 + categoryIndex)}</span><b>{category.type} Questions</b><small>{category.questions.length} Answers</small></header>{category.questions.map(({ question, originalIndex }, questionIndex) => <article key={originalIndex}><small>Q{questionIndex + 1}</small><b>{question.text}</b><p>{answers[originalIndex] || 'Not answered'}</p></article>)}</div>)}</section>;
}
function Rubric({ rubric, setRubric }) { const names = ['Content Quality', 'Understanding', 'Presentation', 'Accuracy']; const max = [20, 20, 10, 10]; return <section className="rubric"><h4>Rubric / Criteria</h4><div className="rubricHead"><span>Criteria</span><span>Max Marks</span><span>Marks Awarded</span></div>{names.map((item, index) => <div key={item}><span>{item}</span><b>{max[index]}</b><input type="number" value={rubric[index]} onChange={(event) => setRubric(rubric.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} /></div>)}<footer><b>Total</b><b>60</b><strong>{rubric.reduce((sum, value) => sum + Number(value), 0)} / 60</strong></footer></section>; }
function initials(name) { return name.split(' ').map((item) => item[0]).join('').slice(0, 2); }
function grade(score) { return score >= 54 ? 'A+' : score >= 48 ? 'A' : score >= 42 ? 'B' : score >= 36 ? 'C' : 'D'; }
function gradeForTotal(score, total) { const percentage = total ? score / total * 100 : 0; return percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'D'; }
