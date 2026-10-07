import { FiActivity, FiAward, FiCalendar, FiCheckCircle, FiChevronDown, FiChevronUp, FiClipboard, FiGift, FiStar, FiTarget, FiUsers, FiZap } from 'react-icons/fi';
import { FaRocket } from 'react-icons/fa6';
import trophyImage from '../../assets/leaderboard-trophy-transparent-v4.png';
import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
// import '../../styles/Student/66-student-leaderboard.css';
// import '../../styles/Student/67-leaderboard-panel-3d.css';
// import '../../styles/Student/68-ranking-soft-3d.css';
// import '../../styles/Student/69-leaderboard-reference-hero.css';
// import '../../styles/Student/70-leaderboard-hero-icons.css';
// import '../../styles/Student/71-real-trophy.css';
// import '../../styles/Student/72-metrics-soft-3d.css';
// import '../../styles/Student/73-podium-enhanced-3d.css';
// import '../../styles/Student/74-podium-spacing-fix.css';
// import '../../styles/Student/75-podium-celebration-animation.css';
// import '../../styles/Student/76-podium-ribbon-center.css';
// import '../../styles/Student/77-champions-header-3d.css';
// import '../../styles/Student/78-achievements-rank-3d.css';
// import '../../styles/Student/79-champions-header-refresh.css';
// import '../../styles/Student/80-podium-group-center.css';
// import '../../styles/Student/81-education-podium.css';
// import '../../styles/Student/82-podium-visibility-fix.css';
// import '../../styles/Student/83-scholar-spotlight-board.css';
// import '../../styles/Student/84-classroom-superstars.css';
// import '../../styles/Student/85-superstars-layout-polish.css';
// import '../../styles/Student/86-superstars-visual-finish.css';
// import '../../styles/Student/87-superstars-progress.css';
// import '../../styles/Student/88-student-ranking-board.css';
// import '../../styles/Student/89-ranking-podium-grid.css';
// import '../../styles/Student/90-ranking-podium-3d.css';
// import '../../styles/Student/91-ranking-footer-visibility.css';
// import '../../styles/Student/92-creative-3d-stage.css';
// import '../../styles/Student/93-clean-creative-podium.css';

const avatarColors = ['#7467e8', '#4381c3', '#db8743', '#4d9a94', '#9c718e', '#4d75d8', '#4c9c98', '#d08742', '#687b91', '#5d78bd'];
const createRankingRecord = (student, index) => {
  const seed = Number.parseInt(student.id, 10) || student.email?.length || index + 1;
  return { ...student, name: student.student_name || student.name, xp: 2280 - ((seed * 137 + index * 53) % 1180), tasks: 45 - ((seed * 3 + index) % 22), movement: ((seed + index) % 5) - 2, color: avatarColors[index % avatarColors.length] };
};

const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

function Movement({ value }) {
  if (!value) return <span className="lbMovement neutral">—</span>;
  return <span className={`lbMovement ${value > 0 ? 'up' : 'down'}`}>{value > 0 ? <FiChevronUp /> : <FiChevronDown />}{Math.abs(value)}</span>;
}

function PodiumCard({ student, rank, current }) {
  return <article className={`lbPodiumCard lbPodiumRank${rank} ${current ? 'isCurrent' : ''}`}>
    <span className="lbRankRibbon">{rank === 1 ? '🏆' : `${rank}${rank === 2 ? 'nd' : 'rd'}`}</span>
    {rank === 1 && <span className="lbCrown">♛</span>}
    <span className="lbPodiumMedal"><FiAward /></span>
    <div className="lbPodiumAvatar" style={{ '--avatar': student.color }}><span>{rank === 1 ? '👧🏻' : rank === 2 ? '👦🏻' : '🧑🏻‍🎓'}</span><small>{initials(student.name)}</small></div>
    <b className="lbRankNumber">#{rank}</b><h3>{student.name}</h3>{current && <em>You</em>}
    <div className="lbPodiumScore"><strong>{student.xp.toLocaleString('en-IN')}</strong><span>Learning XP</span></div>
    <p>📖 {student.tasks} lessons completed</p><span className="lbStudyBadge">{rank === 1 ? '♛' : rank === 2 ? '🎓' : '🎖'} Weekly Scholar</span><Movement value={student.movement} />
    <div className="lbPodiumBase"><span>{rank}</span></div>
  </article>;
}

function ScholarSpotlightCard({ student, rank, current }) {
  const avatar = rank === 1 ? '👩🏻‍💻' : rank === 2 ? '👨🏻‍🔬' : '👨🏻‍🎓';
  return <article className={`eduScholarCard eduScholarRank${rank} ${current ? 'isCurrent' : ''}`}>
    <div className="eduScholarTop"><span className="eduScholarPlace">#{rank}</span>{current && <em>You</em>}<span className="eduScholarAvatar">{avatar}<small>{initials(student.name)}</small></span></div>
    <div className="eduScholarInfo"><h3>{student.name}</h3><p><strong>{student.xp.toLocaleString('en-IN')}</strong><span>Learning XP</span></p><small>📖 {student.tasks} lessons completed</small></div>
    <div className="eduLearningProgress"><span><b>Weekly goal</b><em>{Math.min(100, 58 + student.tasks)}%</em></span><i><b style={{ width: `${Math.min(100, 58 + student.tasks)}%` }} /></i><small><span>Math</span><span>Science</span><span>Reading</span></small></div>
    <div className="eduScholarFooter"><span>{rank === 1 ? '🏆 Gold Scholar' : rank === 2 ? '🎓 Rising Scholar' : '🌱 Growth Scholar'}</span><Movement value={student.movement} /></div>
  </article>;
}

function ScholarRankingRow({ student, rank, current }) {
  const avatar = rank === 1 ? '👩🏻‍💻' : rank === 2 ? '👨🏻‍🔬' : '👨🏻‍🎓';
  const progress = Math.min(100, 58 + student.tasks);
  return <article className={`studentRankRow studentRank${rank} ${current ? 'isCurrent' : ''}`}>
    <span className="studentRankMedal"><b>{rank}</b><small>{rank === 1 ? 'GOLD' : rank === 2 ? 'SILVER' : 'BRONZE'}</small></span>
    <span className="studentRankAvatar">{avatar}<small>{initials(student.name)}</small></span>
    <div className="studentRankIdentity"><span>{current ? 'YOU · ' : ''}CLASSROOM SCHOLAR</span><h3>{student.name}</h3><small>📚 {student.tasks} lessons completed</small></div>
    <div className="studentRankProgress"><span><b>Weekly learning goal</b><em>{progress}%</em></span><i><b style={{ width: `${progress}%` }} /></i><small>Math · Science · Reading</small></div>
    <div className="studentRankXp"><strong>{student.xp.toLocaleString('en-IN')}</strong><span>Learning XP</span><Movement value={student.movement} /></div>
  </article>;
}

export default function StudentLeaderboardPage() {
  const { user } = useAuth();
  const displayName = user?.student_name || user?.name || user?.full_name || 'Student';
  const studentClass = user?.class?.class_name || user?.class_name || 'My Class';
  const classRoster = useMemo(() => {
    const apiStudent = { ...user, name: displayName, student_name: displayName, className: studentClass };
    return [apiStudent].map(createRankingRecord);
  }, [displayName, studentClass, user]);
  const ranked = classRoster;
  const currentIndex = ranked.findIndex((student) => student.name.toLowerCase() === displayName.toLowerCase());
  const current = ranked[currentIndex];
  const topThree = ranked.slice(0, 3);
  const remaining = ranked.slice(3);
  const next = ranked[Math.max(0, currentIndex - 1)];
  const xpNeeded = currentIndex > 0 ? next.xp - current.xp + 1 : 0;
  return <main className="studentLeaderboardPage">
    <header className="lbHero"><div className="lbHeroCopy"><span className="lbLiveBadge"><i /> {studentClass} · Live Leaderboard</span><h1>Learning <em>Champions</em></h1><p>Learn More. Earn XP. Rise to the Top!</p><div className="lbHeroMiniStats"><span><FiCheckCircle /> Complete Tasks</span><span><FiAward /> Score Higher</span><span><FiGift /> Win Rewards</span><span><FiStar /> Be the Champion</span></div></div><div className="lbHeroTrophy lbRealTrophy" aria-hidden="true"><span className="trophySpark s1">✦</span><span className="trophySpark s2">✦</span><span className="trophySpark s3">✦</span><img src={trophyImage} alt="" /></div><div className="lbHeroMetrics"><div className="lbWeek"><span><FiCalendar /> This week</span><strong>03 – 09 Aug</strong><small>Ends in 3 days</small></div><article><FiUsers /><strong>{ranked.length}</strong><small>Total Learners</small></article><article><FiClipboard /><strong>{ranked.reduce((sum, item) => sum + item.tasks, 0)}</strong><small>Tasks Completed</small></article><article><FiActivity /><strong>98%</strong><small>Active This Week</small></article><article><FaRocket /><strong>+12%</strong><small>Class Growth</small></article></div><span className="lbHeroShape one" /><span className="lbHeroShape two" /></header>
    <section className="lbDashboard">
      <div className="lbPodiumPanel"><header><span><i>🎓</i><b>Achievement Arena<small>Celebrate Progress, Curiosity and Consistency</small></b><i>📖</i></span><em>Every lesson is one more step forward!</em></header>
        <div className="studentRankingBoard"><div className="studentRankingHeading"><div><span>● CURRENT WEEK · LIVE RANKING</span><h2>Learning Champions</h2><p>Ranked by XP earned, lessons completed and weekly progress</p></div><strong>RANKING</strong></div><div className="studentRankingList">{topThree.map((student, index) => <ScholarRankingRow key={student.id || student.name} student={student} rank={index + 1} current={index === currentIndex} />)}</div><footer><span>📚 Keep learning</span><i /><span>🔥 Build your streak</span><i /><span>⭐ Reach the top</span></footer></div>
      </div>
      <aside className="lbRoster"><header><div><h2>👑 Class Ranking</h2><p>All Learners · Weekly</p></div><span>Top {ranked.length}</span></header><div className="lbRosterColumns"><span>Rank</span><span>Student</span><span>Tasks</span><span>Trend</span><span>XP</span></div><div className="lbRosterList">
        {ranked.map((student, index) => { const rank = index + 1; const isCurrent = index === currentIndex; return <article className={`${isCurrent ? 'isCurrent' : ''} rosterRank${rank}`} key={student.name}><b>{rank}{rank === 1 && <i>♛</i>}</b><span className="lbSmallAvatar" style={{ '--avatar': student.color }}>{initials(student.name)}</span><div><strong>{student.name}</strong><small>{isCurrent ? 'You · Keep climbing!' : `${student.tasks} tasks completed`}</small></div><span className="lbTaskCount">{student.tasks}</span><Movement value={student.movement} /><em>{student.xp.toLocaleString('en-IN')}<small>XP</small></em></article>; })}
      </div></aside>
    </section>
    <section className="lbAchievements"><header>🏆 Unlock Your Achievements</header><div><article><span>✓</span><p><strong>Finish Assignments</strong><small>Earn more XP</small></p></article><article><span>📖</span><p><strong>Participate in Classes</strong><small>Boost your rank</small></p></article><article><span>⭐</span><p><strong>Score Higher</strong><small>Be in the Top 3</small></p></article><article><span>🎯</span><p><strong>Stay Consistent</strong><small>Become a Champion</small></p></article></div></section>
    <section className="lbYourRank"><div className="lbYouBadge"><FiTarget /></div><div><small>Your current position</small><h2>Rank #{currentIndex + 1} <span>of {ranked.length} learners</span></h2><p>{currentIndex === 0 ? 'You are leading the class. Amazing work!' : `${xpNeeded} XP more to overtake ${next.name}`}</p></div><div className="lbYouProgress"><span><i style={{ width: `${Math.max(12, 100 - (xpNeeded / Math.max(next.xp, 1)) * 100)}%` }} /></span><small><FiZap /> {current.xp.toLocaleString('en-IN')} XP</small></div><strong className="lbPercentile">Top {Math.max(1, Math.round(((currentIndex + 1) / ranked.length) * 100))}%</strong></section>
  </main>;
}
