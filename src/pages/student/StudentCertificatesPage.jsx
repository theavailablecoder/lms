import { useMemo, useState } from 'react';
import { FiArrowRight, FiAward, FiCheckCircle, FiClipboard, FiClock, FiDownload, FiFileText, FiLock, FiStar } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAssignments } from '../../context/AssignmentsContext.jsx';
import { usePlanning } from '../../context/PlanningContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
// import '../../styles/Student/61-student-certificates.css';
// import '../../styles/Student/63-certificates-2d-readable.css';
// import '../../styles/Student/64-certificates-panel-match.css';
// import '../../styles/Student/65-certificate-requirements.css';

const baseCertificates = [
  { id: 1, title: 'Algebra Foundation', course: 'Algebra Foundation', description: 'Completed advanced concepts in algebra and problem solving.', date: '20 May 2026', fixed: true },
  { id: 2, title: 'Python Basics Certificate', course: 'Python Basics', description: 'Complete the linked assignment and assessment to earn this certificate.' },
  { id: 3, title: 'Science Motion Badge', course: 'Science in Motion', description: 'Finish the required tasks to earn this certificate.' },
];
const filters = [{ id: 'all', label: 'All Certificates', icon: FiAward }, { id: 'earned', label: 'Earned', icon: FiCheckCircle }, { id: 'progress', label: 'In Progress', icon: FiClock }, { id: 'locked', label: 'Locked', icon: FiLock }];

function CertificateArtwork({ item }) {
  const message = item.state === 'locked' ? 'Complete the required tasks to unlock this certificate' : item.state === 'progress' ? 'You are making progress in' : 'You have successfully completed';
  return <div className={`certArtwork certArtwork--${item.accent}`}>
    <span className="certCardState">{item.state === 'locked' && <FiLock />} {item.label}</span><span className="certSpark certSparkOne">✦</span><span className="certSpark certSparkTwo">✦</span>
    <div className="certPaperCopy"><strong>CERTIFICATE</strong><span>OF COMPLETION</span><small>This is to certify that</small><i /><p>{message}</p><b>{item.state === 'locked' ? '' : item.course}</b>{item.state === 'progress' && <div className="certProgress"><span style={{ width: `${item.progress}%` }} /><em>{item.progress}%</em></div>}<FiAward className="certSeal" /></div>
    {item.state === 'earned' && <small className="certIssueDate">Issued on<br /><b>{item.date}</b></small>}
  </div>;
}

function CertificateCard({ item, onOpenTask }) {
  const download = () => {
    const text = `Certificate of Completion\n\nThis certifies that you have successfully completed ${item.course}.\nIssued ${item.date}.`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); const link = document.createElement('a'); link.href = url; link.download = `${item.course.replace(/\s+/g, '-')}-certificate.txt`; link.click(); URL.revokeObjectURL(url);
  };
  return <article className="certificateCard"><CertificateArtwork item={item} /><div className="certificateInfo"><h3>{item.title}</h3><p>{item.description}</p>
    <section className="certificateRequirements"><header><span>Certificate requirements</span><strong>{item.requirements.filter((task) => task.complete).length}/{item.requirements.length}</strong></header>
      {item.prerequisiteLocked && <p className="certificatePrerequisite"><FiLock /> Complete “Python Basics Certificate” first to unlock these tasks.</p>}
      {item.requirements.map((task) => { const TaskIcon = task.type === 'Assessment' ? FiFileText : FiClipboard; return <button type="button" className={item.prerequisiteLocked ? 'locked' : task.complete ? 'complete' : 'pending'} onClick={() => !item.prerequisiteLocked && !task.complete && onOpenTask(task)} disabled={item.prerequisiteLocked || task.complete} key={`${item.id}-${task.type}`}><TaskIcon /><span><b>{task.title}</b><small>{task.type} · {item.prerequisiteLocked ? 'Locked' : task.complete ? 'Completed' : 'Pending'}</small></span>{item.prerequisiteLocked ? <FiLock /> : task.complete ? <FiCheckCircle /> : <FiArrowRight />}</button>; })}
    </section><div><span className={`certDetail certDetail--${item.accent}`}>{item.detail}</span>{item.state === 'earned' ? <button type="button" onClick={download} aria-label={`Download ${item.title}`}><FiDownload /></button> : item.state === 'progress' ? <button type="button" onClick={() => onOpenTask(item.requirements.find((task) => !task.complete))}><FiArrowRight /></button> : <button type="button" disabled><FiLock /></button>}</div>
  </div></article>;
}

export default function StudentCertificatesPage() {
  const [filter, setFilter] = useState('all'); const [sort, setSort] = useState('recent'); const navigate = useNavigate();
  const { assignments = [] } = useAssignments(); const { exams = [] } = usePlanning(); const { user } = useAuth();
  const studentId = user?.id || user?.email || 'student-demo'; const studentName = user?.student_name || user?.name || user?.full_name || user?.email || '';
  const isMine = (entry) => Boolean(entry) && (entry.studentId === studentId || (!entry.studentId && entry.studentName === studentName));
  const assignmentComplete = assignments.some((item) => (item.submissions || (item.submission ? [item.submission] : [])).some(isMine));
  const assessmentComplete = exams.some((exam) => (exam.submissions || []).some(isMine));
  const scienceAssignmentComplete = assignments.some((item) => /science|force|motion/i.test(`${item.title} ${item.subject} ${item.chapter}`) && (item.submissions || (item.submission ? [item.submission] : [])).some(isMine));
  const scienceAssessmentComplete = exams.some((exam) => /science|force|motion/i.test(exam.title || '') && (exam.submissions || []).some(isMine));
  const certificates = useMemo(() => {
    const pythonEarned = assignmentComplete && assessmentComplete;
    return baseCertificates.map((item) => {
      const prerequisiteLocked = item.id === 3 && !pythonEarned;
      const requirements = item.fixed ? [{ title: 'Algebra Assignment', type: 'Assignment', complete: true }, { title: 'Algebra Assessment', type: 'Assessment', complete: true }] : item.id === 2 ? [{ title: 'Python Practice Assignment', type: 'Assignment', complete: assignmentComplete, route: '/student/homework' }, { title: 'Python Basics Assessment', type: 'Assessment', complete: assessmentComplete, route: '/student/assessment' }] : [{ title: 'Force & Motion Assignment', type: 'Assignment', complete: scienceAssignmentComplete, route: '/student/homework' }, { title: 'Motion Concepts Assessment', type: 'Assessment', complete: scienceAssessmentComplete, route: '/student/assessment' }];
      const done = requirements.filter((task) => task.complete).length; const progress = prerequisiteLocked ? 0 : Math.round(done / requirements.length * 100); const state = prerequisiteLocked ? 'locked' : done === requirements.length ? 'earned' : 'progress';
      return { ...item, prerequisiteLocked, requirements, progress, state, label: state === 'earned' ? 'Completed' : state === 'progress' ? 'In Progress' : 'Locked', detail: prerequisiteLocked ? 'Complete Previous Certificate' : state === 'earned' ? 'Ready to Download' : `${progress}% Completed`, accent: state === 'earned' ? 'green' : state === 'progress' ? 'blue' : 'gold', date: item.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) };
    });
  }, [assignmentComplete, assessmentComplete, scienceAssignmentComplete, scienceAssessmentComplete]);
  const visible = useMemo(() => { const list = filter === 'all' ? certificates : certificates.filter((item) => item.state === filter); return sort === 'title' ? [...list].sort((a, b) => a.title.localeCompare(b.title)) : list; }, [filter, sort, certificates]);
  const earned = certificates.filter((item) => item.state === 'earned').length; const progressing = certificates.filter((item) => item.state === 'progress').length; const locked = certificates.filter((item) => item.state === 'locked').length;
  return <main className="certificatesPage"><section className="certHero"><div className="certDoodle certDoodleOne">✦</div><div className="certHeroIcon"><FiAward /><span /></div><div className="certHeroCopy"><h1>Certificates</h1><p>Complete assignments and assessments to unlock your achievements.</p></div><div className="certHeroArt"><div className="heroCertificate"><b>CERTIFICATE</b><FiAward /></div><div className="heroBooks"><i /><i /><i /></div><div className="heroMedal"><FiStar /></div><FaGraduationCap className="heroCap" /></div></section>
    <section className="certStats"><article className="statPurple"><span className="purple"><FiAward /></span><div><small>Certificates Earned</small><strong>{earned}</strong><p>Keep up the great work!</p></div></article><article className="statBlue"><span className="blue"><FiClock /></span><div><small>In Progress</small><strong>{progressing}</strong><p>Almost there!</p></div></article><article className="statGold"><span className="gold"><FiLock /></span><div><small>Locked</small><strong>{locked}</strong><p>Complete pending tasks</p></div></article><article className="statGreen"><span className="green"><FiStar /></span><div><small>Completion Rate</small><strong>{Math.round(earned / certificates.length * 100)}%</strong><p>You’re doing awesome!</p></div></article></section>
    <div className="certToolbar"><div className="certFilters">{filters.map(({ id, label, icon: Icon }) => <button type="button" className={filter === id ? 'active' : ''} onClick={() => setFilter(id)} key={id}><Icon />{label}</button>)}</div><label className="certSort">Sort by:<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recent">Recent</option><option value="title">Title</option></select></label></div>
    <section className="certificateGrid">{visible.map((item) => <CertificateCard item={item} onOpenTask={(task) => task?.route && navigate(task.route)} key={item.id} />)}{!visible.length && <p className="certEmpty">No certificates in this category yet.</p>}</section>
    <section className="certCta"><div className="certCtaArt"><FaGraduationCap /><span>📚</span></div><div><h2>Complete Tasks. Unlock Certificates. 🚀</h2><p>Finish your pending assignments and assessments to earn new achievements.</p></div><button type="button" onClick={() => navigate('/student/homework')}>View Pending Tasks <FiArrowRight /></button></section></main>;
}
