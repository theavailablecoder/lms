import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Bell } from "../../icons/index.js";
import AppLayout from "../../layouts/AppLayout.jsx";
import {
  teacherNavGroups,
  teacherRouteMap,
  teacherPathToPage,
} from "../../data/navConfig.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { getTimeGreeting } from "../../utils/greetings.js";
import { TeacherProfileMenu } from "../../components/index.js";
import TeacherDashboardPage from "./TeacherDashboardPage.jsx";
import TeacherAiStudyPage from "./TeacherAiStudyPage.jsx";
import TeacherCalendarPage from "./TeacherCalendarPage.jsx";
import TeacherCodingLabPage from "./TeacherCodingLabPage.jsx";
import TeacherCoursePage from "./TeacherCoursePage.jsx";
import TeacherGradingPage from "./TeacherGradingPage.jsx";
import TeacherHomeworkPage from "./TeacherHomeworkPage.jsx";
import TeacherMonitorPage from "./TeacherMonitorPage.jsx";
import TeacherMessagesPage from "./TeacherMessagesPage.jsx";
import TeacherSettingsPage from "./TeacherSettingsPage.jsx";
import TeacherProfilePage from "./TeacherProfilePage.jsx";
import TeacherAssessmentsPage from "./TeacherAssessmentsPage.jsx";
import PageLoader from "../../components/shared/PageLoader.jsx";
import { useTeacher } from "../../context/TeacherContext.jsx";

export default function TeacherLayout() {
  const { logout } = useAuth();
  const { getTeacher, teacherDetails } = useTeacher();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("teacher-theme") === "dark",
  );
  const [greeting, setGreeting] = useState(getTimeGreeting);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const pathSegment =
    location.pathname.split("/").filter(Boolean).pop() || "dashboard";
  const activePage = teacherPathToPage[pathSegment] || "Teacher Dashboard";

  const userId = localStorage.getItem("user_id") || null;

  let teacherName = "Teacher";
  let teacherCode = "Not available";

  if (teacherDetails) {
    if (teacherDetails?.teacher_name) {
      teacherName = teacherDetails?.teacher_name;
    }

    if (teacherDetails?.teacher_code) {
      teacherCode = teacherDetails?.teacher_code;
    }
  }

  useEffect(() => {
    if (userId) {
      getTeacher(userId);
    }
  }, [userId]);

  const firstName = teacherName.split(" ")[0];

  useEffect(() => {
    const timer = window.setInterval(
      () => setGreeting(getTimeGreeting()),
      60000,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("teacher-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const navigateToPage = (page) => {
    const route = teacherRouteMap[page] || "dashboard";
    const destination = `/teacher/${route}`;
    if (location.pathname === destination) return;
    setIsPageLoading(true);
    navigate(`/teacher/${route}`);
    window.setTimeout(() => setIsPageLoading(false), 700);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <AppLayout
        shellClass={`teacherShell teacherRefresh ${isDarkMode ? "themeDark" : "themeLight"}`}
        dashboardClass={sidebarCollapsed ? "teacherSidebarCollapsed" : ""}
        sidebarProps={{
          title: (
            <>
              Teacher
              <br />
              Panel
            </>
          ),
          groups: teacherNavGroups.map((group) => ({ ...group, label: group.label === 'Dashboard' ? 'Workspace' : group.label === 'Other' ? 'Account' : group.label, items: group.items.map((item) => ({ ...item, page: item.page || item.label, label: ({ 'Teacher Dashboard': 'Overview', 'Teacher Course': 'My courses', 'AI Study Box': 'AI teaching assistant', 'Assessment': 'Tests & assessments', 'Assignment': 'Assignments', 'Monitor Student': 'Student progress', 'Grading System': 'Review & grade' })[item.label] || item.label })) })),
          activePage,
          onNavigate: navigateToPage,
          onLogout: handleLogout,
          collapsed: sidebarCollapsed,
          onToggle: () => setSidebarCollapsed((current) => !current),
        }}
        headerProps={{
          title:
            activePage === "Teacher Dashboard"
              ? `${greeting}, ${firstName}`
              : ({ 'Teacher Course': 'My course library', 'AI Study Box': 'AI teaching assistant', 'Monitor Student': 'Student progress', 'Grading System': 'Review & grade', 'Home Work and Assignment': 'Assignments', 'Test & Exam': 'Tests & assessments' })[activePage] || activePage,
          subtitle:
            activePage === "Teacher Dashboard"
              ? "Welcome to your teaching workspace. Let’s plan a productive day."
              : ({ 'Teacher Course': 'Find the right resource for your next lesson.', 'AI Study Box': 'Turn your teaching ideas into helpful classroom materials.', 'Calendar': 'Organise lessons, meetings, and everything in between.', 'Monitor Student': 'Understand progress and find opportunities to help.', 'Grading System': 'Review student work and share useful feedback.', 'Messages': 'Stay connected with your students.', 'Profile': 'Manage your teaching profile and account details.', 'Settings': 'Make your workspace work for you.' })[activePage] || "Plan class work, review submissions, and support your students.",
          actions: (
            <>
              {/* <button
                type="button"
                className="themeToggleButton"
                onClick={() => setIsDarkMode((current) => !current)}
                aria-label={isDarkMode ? "Use light mode" : "Use dark mode"}
                title={isDarkMode ? "Light mode" : "Dark mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button> */}
              <button type="button" aria-label="Notifications">
                <Bell size={20} />
              </button>
              <TeacherProfileMenu
                teacherName={teacherName}
                teacherCode={teacherCode}
              />
            </>
          ),
        }}
      >
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboardPage />} />
          <Route path="course" element={<TeacherCoursePage />} />
          <Route path="ai-study-box" element={<TeacherAiStudyPage />} />
          <Route path="test-exam" element={<TeacherAssessmentsPage />} />
          <Route path="calendar" element={<TeacherCalendarPage />} />
          <Route path="homework" element={<TeacherHomeworkPage />} />
          <Route path="coding-lab" element={<TeacherCodingLabPage />} />
          <Route path="monitor" element={<TeacherMonitorPage />} />
          <Route path="grading" element={<TeacherGradingPage />} />
          <Route path="messages" element={<TeacherMessagesPage />} />
          <Route path="settings" element={<TeacherSettingsPage />} />
          <Route path="profile" element={<TeacherProfilePage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </AppLayout>
      {isPageLoading && (
        <PageLoader
          title={`Opening ${activePage}`}
          message="Loading module content..."
        />
      )}
    </>
  );
}
