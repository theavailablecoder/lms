import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  Code2,
  Eye,
  GraduationCap,
  PieChart,
  Settings,
  UsersRound,
} from '../../icons/index.js';
import { FiChevronRight, FiHelpCircle, FiShield, FiSun } from 'react-icons/fi';

const settingsCards = [
  { title: 'Class & Academic Settings', description: 'Class, section, subject, academic year and default class preferences.', Icon: GraduationCap, tone: 'blue' },
  { title: 'Notification Settings', description: 'Homework, submissions, messages, exams and important alerts.', Icon: Bell, tone: 'green' },
  { title: 'Grading & Assessment', description: 'Marks, grading scale, rubrics, late submission and assessment rules.', Icon: PieChart, tone: 'purple' },
  { title: 'Assignment Preferences', description: 'Submission, resubmission, due dates and late-work rules.', Icon: ClipboardCheck, tone: 'orange' },
  { title: 'Calendar Settings', description: 'Default view, reminders and calendar notifications.', Icon: CalendarDays, tone: 'pink' },
  { title: 'Coding Lab Settings', description: 'Compiler, coding environment and submission preferences.', Icon: Code2, tone: 'mint' },
  { title: 'Student Monitoring', description: 'Activity tracking, behavior settings and report preferences.', Icon: UsersRound, tone: 'purple-soft' },
  { title: 'Student Visibility', description: 'Control marks, results, leaderboard and classroom information visibility.', Icon: Eye, tone: 'green-soft' },
  { title: 'Security', description: 'Password, login sessions and account security.', Icon: FiShield, tone: 'amber' },
  { title: 'Language & Appearance', description: 'Language, theme, date & time format and display preferences.', Icon: FiSun, tone: 'rose' },
  { title: 'Help & Support', description: 'Help center, report an issue and contact support.', Icon: FiHelpCircle, tone: 'teal' },
];

export default function TeacherSettingsPage() {
  return (
    <section className="featurePage" style={{ width: '100%', maxWidth: '100%' }}>
      <div
        className="featureHero"
        style={{
          minHeight: '132px',
          padding: '20px 24px',
          borderRadius: '18px',
          background: 'linear-gradient(180deg, #eaf2fb 0%, #dfeaf6 100%)',
          boxShadow: '0 8px 18px rgba(47, 78, 120, 0.08)',
          border: '1px solid #dfeaf6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #87b8f0 0%, #5d9ae8 100%)',
              boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.28)',
              color: '#fff',
            }}
          >
            <Settings size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '2.05rem', color: '#1f3d62', letterSpacing: '-0.05em' }}>Settings</h2>
            <p style={{ margin: '8px 0 0', color: '#4b5d74', fontWeight: 600, fontSize: '1rem' }}>
              Customize your classroom experience and manage your teaching preferences.
            </p>
          </div>
        </div>

        <div aria-hidden="true" style={{ position: 'relative', width: 200, height: 74, flexShrink: 0 }}>
          <div style={{ position: 'absolute', left: 10, bottom: 10, width: 128, height: 60 }}>
            <span style={{ position: 'absolute', left: 0, bottom: 0, width: 58, height: 18, borderRadius: 6, background: 'linear-gradient(180deg, #7eaee7, #5a95d8)', transform: 'rotate(-4deg)' }} />
            <span style={{ position: 'absolute', left: 36, bottom: 0, width: 74, height: 18, borderRadius: 6, background: 'linear-gradient(180deg, #709fe0, #4b7ec6)' }} />
            <span style={{ position: 'absolute', left: 80, bottom: 0, width: 38, height: 18, borderRadius: 6, background: 'linear-gradient(180deg, #9ac7f6, #7ca6df)', transform: 'rotate(4deg)' }} />
          </div>
          <div style={{ position: 'absolute', right: 26, bottom: 16, width: 42, height: 58 }}>
            <span style={{ position: 'absolute', bottom: 0, left: 8, width: 24, height: 12, borderRadius: 6, background: 'linear-gradient(180deg, #b9dca8, #8bb580)' }} />
            <span style={{ position: 'absolute', left: 4, bottom: 12, width: 18, height: 24, borderRadius: '55% 45% 60% 30% / 50% 60% 40% 50%', background: 'linear-gradient(180deg, #71c4a2, #4eaa8d)', transform: 'rotate(-25deg)' }} />
            <span style={{ position: 'absolute', left: 15, bottom: 12, width: 18, height: 24, borderRadius: '55% 45% 60% 30% / 50% 60% 40% 50%', background: 'linear-gradient(180deg, #71c4a2, #4eaa8d)', transform: 'rotate(25deg)' }} />
            <span style={{ position: 'absolute', left: 23, bottom: 12, width: 18, height: 24, borderRadius: '55% 45% 60% 30% / 50% 60% 40% 50%', background: 'linear-gradient(180deg, #71c4a2, #4eaa8d)', transform: 'rotate(-12deg)' }} />
          </div>
          <span style={{ position: 'absolute', right: 0, bottom: 0, color: '#394d74', fontSize: '0.78rem', fontWeight: 700, textAlign: 'right', fontFamily: 'Comic Sans MS, cursive', lineHeight: 1.2 }}>
            Better<br />Teaching<br />Brighter<br />Futures
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18, paddingTop: 20 }}>
        {settingsCards.map(({ title, description, Icon, tone }) => (
          <article
            key={title}
            className="panel featureCard"
            style={{
              minHeight: 110,
              borderRadius: 16,
              border: '1px solid rgba(188, 204, 223, 0.9)',
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 7px 18px rgba(33,52,77,0.06)',
              padding: '18px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#1d3d62',
                  background:
                    tone === 'blue'
                      ? '#dfeefc'
                      : tone === 'green'
                        ? '#d9f0df'
                        : tone === 'purple'
                          ? '#ebdcf7'
                          : tone === 'orange'
                            ? '#f5dec9'
                            : tone === 'pink'
                              ? '#f8dfe5'
                              : tone === 'mint'
                                ? '#dff5ee'
                                : tone === 'purple-soft'
                                  ? '#e9dff5'
                                  : tone === 'green-soft'
                                    ? '#dff4e9'
                                    : tone === 'amber'
                                      ? '#f7e2bf'
                                      : tone === 'rose'
                                        ? '#f7d9d4'
                                        : '#d8ebef',
                }}
              >
                <Icon size={24} />
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '1.0rem', color: '#1b2e45', lineHeight: 1.3 }}>{title}</strong>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem', lineHeight: 1.5, color: '#566a7d', fontWeight: 500 }}>{description}</p>
              </div>
            </div>

            <div style={{ color: '#2d4266', display: 'grid', placeItems: 'center', width: 20, height: 20, flexShrink: 0 }}>
              <FiChevronRight size={18} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
