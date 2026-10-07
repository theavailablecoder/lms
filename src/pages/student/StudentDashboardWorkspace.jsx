import { useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Library,
  TrendingUp,
  Volume2,
} from '../../icons/index.js';
import {
  studentDashboardAnnouncements,
  studentDashboardCalendar,
  studentDashboardStats,
  studentProgressBreakdown,
  studentRecentAssignments,
  studentTodaySchedule,
  studentUpcomingDeadlines,
} from '../../data/mockData.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
import trofy from '../../assets/trofy.png';

const dueToneClass = {
  red: 'sdDueRed',
  orange: 'sdDueOrange',
  purple: 'sdDuePurple',
  gray: 'sdDueGray',
};

const iconToneClass = {
  blue: 'sdIconBlue',
  green: 'sdIconGreen',
  purple: 'sdIconPurple',
  orange: 'sdIconOrange',
  pink: 'sdIconPink',
};

const calendarDotTone = {
  blue: '#3b82f6',
  green: '#10b981',
  orange: '#f59e0b',
  purple: '#8b5cf6',
};

const donutColors = {
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  orange: '#f59e0b',
};

import schedule from '../../assets/schedule.png';
import studentLearningHero from '../../assets/student-learning-hero.png';

function ProgressDonut({ overall = 85, segments }) {
  const gradient = useMemo(() => {
    const slice = 360 / segments.length;
    const stops = segments.map((segment, index) => {
      const start = index * slice;
      const end = (index + 1) * slice;
      return `${donutColors[segment.tone] || '#3b82f6'} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [segments]);

  return (
    <div className="sdProgressDonutWrap">
      <div className="sdProgressDonut" style={{ background: gradient }}>
        <div className="sdProgressDonutHole">
          <strong>{overall}%</strong>
          <span>Overall</span>
        </div>
      </div>
    </div>
  );
}

function MiniCalendar({ initialMonth, initialYear, selectedDay, eventDays }) {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  const eventMap = useMemo(() => {
    const map = new Map();
    eventDays.forEach((entry) => {
      map.set(entry.day, entry.tone || 'blue');
    });
    return map;
  }, [eventDays]);

  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDay; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

    return cells;
  }, [month, year]);

  const shiftMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  };

  const isReferenceMonth = month === initialMonth && year === initialYear;

  return (
    <article className="sdCalendarWrapper">
      <div className="sdCalendarBox">
        <div className="sdCalendarTop">
          <button className="sdNavBtn" onClick={() => shiftMonth(-1)}>
            <ChevronLeft size={16} />
          </button>

          <h3>{MONTHS[month]} {year}</h3>

          <button className="sdNavBtn" onClick={() => shiftMonth(1)}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="sdCalendarGrid">
          {WEEKDAYS.map(day => (
            <span className="sdWeek" key={day}>{day}</span>
          ))}

          {calendarCells.map((day, index) => {
            const hasEvent = day && eventMap.has(day);
            const eventTone = hasEvent ? eventMap.get(day) : null;
            const isSelected = isReferenceMonth && day === selectedDay;

            return (
              <div 
                key={index}
                className={`sdDate ${hasEvent ? `sdDateEvent sdDateEvent--${eventTone}` : ''} ${isSelected ? 'sdDateSelected' : ''}`}
              >
                {day}
                {hasEvent && (
                  <span className="sdEventIndicator" style={{ backgroundColor: calendarDotTone[eventTone] }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function AnnouncementIcon({ icon }) {
  if (icon === 'library') return <Library size={18} />;
  return <Volume2 size={18} />;
}

export default function StudentDashboardWorkspace({ studentName }) {
  // const firstName = studentName.split(' ')[0];

  return (
    <section className="studentDashboardRef" id="eduStudentDashboard">
      <header className="sdWelcome">
        <div className="sdWelcomeCopy">
        <h1>Welcome back, {studentName}! 👋</h1>
        <p>Here&apos;s what&apos;s happening in your learning journey.</p>

        <div className="sdLearningHighlights" aria-label="Learning highlights">
          <span><BookOpen size={16} /> 2 lessons today</span>
          <span><TrendingUp size={16} /> 7 day study streak</span>
        </div>

        <div className="sdDailyGoal">
          <div className="sdDailyGoalLabel">
            <span>Daily learning goal</span>
            <strong>75%</strong>
          </div>
          <div className="sdDailyGoalTrack" aria-label="Daily learning goal: 75 percent complete">
            <span />
          </div>
        </div>
        </div>

        <div className="sdWelcomeVisual" aria-hidden="true">
          <span className="sdVisualBubble sdVisualBubble--one" />
          <span className="sdVisualBubble sdVisualBubble--two" />
          <img src={studentLearningHero} alt="" />
        </div>
      </header>

      <div className="sdStatsRow">
        {studentDashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className={`sdStatCard sdStatCard--${stat.tone}`} key={stat.label}>
              <div className={`sdStatIcon sdStatIcon--${stat.tone}`}>
                <Icon size={30} />
              </div>
              <div className="sdStatText">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.hint}</small>
              </div>
            </article>
          );
        })}
      </div>

      <div className="sdDashboardContent">
      <div className="sdMainGrid">
        <article className="sdCard sdAssignmentsCard">
          <div className="sdCardHeader">
            <h3>Recent Assignments</h3>
            <button type="button" className="sdViewAll">View all</button>
          </div>
          <div className="sdAssignmentList">
            {studentRecentAssignments.map((item) => (
              <button type="button" className="sdAssignmentItem" key={item.title}>
                <div className={`sdItemIcon ${iconToneClass[item.iconTone]}`}>
                  <FileText size={18} />
                </div>
                <div className="sdAssignmentBody">
                  <strong>{item.title}</strong>
                  <span>{item.subject}</span>
                </div>
                <div className="sdAssignmentAside">
                  <span className={dueToneClass[item.dueTone]}>{item.dueLabel}</span>
                  <span className="sdAssignmentTime">{item.time}</span>
                </div>
                <ChevronRight size={18} className="sdItemChevron" />
              </button>
            ))}
          </div>
        </article>

        <article className="sdCard sdScheduleCard">
          <div className="sdCardHeader">
            <h3>Today's Schedule</h3>
            <button type="button" className="sdViewAll">View all</button>
          </div>
          <div className="sdScheduleCardContent">
            <div className="sdScheduleTrack">
              {studentTodaySchedule.map((item, index) => (
                <article
                  className={`sdScheduleItem ${index === studentTodaySchedule.length - 1 ? 'sdScheduleItemLast' : ''}`}
                  key={`${item.time}-${item.subject}`}
                >
                  <span className="sdScheduleTime">{item.time}</span>
                  <div className="sdScheduleRail" aria-hidden="true">
                    <span className={`sdScheduleDot sdScheduleDot--${item.tone}`} />
                  </div>
                  <div className="sdScheduleBody">
                    <strong>{item.subject}</strong>
                    <span>{item.room}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="sdScheduleIllustration">
              <div className="sdScheduleImage">
                <img src={schedule} alt="Student reviewing today's schedule" />
              </div>
              <div className="sdScheduleQuote">
                <span className="sdQuoteIcon" aria-hidden="true">&ldquo;</span>
                <p>A new class,<br />a new lesson,<br />a new opportunity!</p>
              </div>
              <hr className="sdScheduleDivider" />
              <div className="sdScheduleDate">
                <div className="sdCalendarIcon" aria-hidden="true"><span>19</span></div>
                <div className="sdDateContent">
                  <p className="sdDay">Monday</p>
                  <p className="sdDate">19 May 2025</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="sdMainGridBottom">
        <article className="sdCard sdAnnouncementsCard">
          <div className="sdCardHeader">
            <h3>Announcements</h3>
            <button type="button" className="sdViewAll">View all</button>
          </div>
          <div className="sdAnnouncementList">
            {studentDashboardAnnouncements.map((item) => (
              <article className="sdAnnouncementItem" key={item.title}>
                <div className={`sdAnnouncementIcon sdAnnouncementIcon--${item.tone}`}>
                  <AnnouncementIcon icon={item.icon} />
                </div>
                <div className="sdAnnouncementBody">
                  <div className="sdAnnouncementTop">
                    <strong>{item.title}</strong>
                    <span>{item.date}</span>
                  </div>
                  {item.isNew && <span className="sdNewBadge">New</span>}
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </article>

        <MiniCalendar
          initialMonth={studentDashboardCalendar.month}
          initialYear={studentDashboardCalendar.year}
          selectedDay={studentDashboardCalendar.selectedDay}
          eventDays={studentDashboardCalendar.eventDays}
        />

       <article className="sdCard sdMotivationalCard">
          <div className="sdMotivationalContent">
    <h3>
      Keep Going,<br />
      Keep Growing!
    </h3>

    <p>
      Every day is a new opportunity to learn something new.
    </p>

    <div className="sdMotivationalIllustration">
      <img src={trofy} alt="trofy" />
    </div>
           </div>
        </article>
      </div>
      </div>

      
    </section>
  );
}
