import { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Bell,
  CircleUserRound,
  GraduationCap,
  Mail,
} from "../../icons/index.js";
import AppLayout from "../../layouts/AppLayout.jsx";
import {
  studentNavGroups,
  studentRouteMap,
  studentPathToPage,
} from "../../data/navConfig.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useStudent } from "../../context/StudentContext.jsx";

import { useMessages } from "../../context/MessagesContext.jsx";
import { useAssignments } from "../../context/AssignmentsContext.jsx";
import { usePlanning } from "../../context/PlanningContext.jsx";
import { getTimeGreeting } from "../../utils/greetings.js";
import StudentDashboardPage from "./StudentDashboardPage.jsx";
import StudentCoursesPage from "./StudentCoursesPage.jsx";
import StudentStudyHelperPage from "./StudentStudyHelperPage.jsx";
import StudentHomeworkPage from "./StudentHomeworkPage.jsx";
import StudentAssessmentPage from "./StudentAssessmentPage.jsx";
import StudentPracticePage from "./StudentPracticePage.jsx";
import StudentCodingLabPage from "./StudentCodingLabPage.jsx";
import StudentProgressPage from "./StudentProgressPage.jsx";
import StudentCertificatesPage from "./StudentCertificatesPage.jsx";
import StudentLeaderboardPage from "./StudentLeaderboardPage.jsx";
import StudentLibraryPage from "./StudentLibraryPage.jsx";
import StudentMessagesPage from "./StudentMessagesPage.jsx";
import StudentProfilePage from "./StudentProfilePage.jsx";


export default function StudentLayout() {
  const { logout, user } = useAuth();
  const { getStudent, studentDetails } = useStudent();
  const { teacherMessages } = useMessages();
  const { assignments } = useAssignments();
  const { calendarEvents } = usePlanning();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [greeting, setGreeting] = useState(getTimeGreeting);
  const [openHeaderMenu, setOpenHeaderMenu] = useState(null);
  const headerMenuRef = useRef(null);

  // Getting user id from local storage
  const storedStudentId = localStorage.getItem("user_id");
  const userId = /^\d+$/.test(storedStudentId || "")
    ? Number(storedStudentId)
    : null;

  const pathSegment =
    location.pathname.split("/").filter(Boolean).pop() || "dashboard";
  const activePage = studentPathToPage[pathSegment] || "Dashboard";

  useEffect(() => {
    const timer = window.setInterval(
      () => setGreeting(getTimeGreeting()),
      60000,
    );
    return () => window.clearInterval(timer); 
  }, []);

  useEffect(() => {
    const closeMenus = (event) => {
      if (!headerMenuRef.current?.contains(event.target))
        setOpenHeaderMenu(null);
    };
    document.addEventListener("pointerdown", closeMenus);
    return () => document.removeEventListener("pointerdown", closeMenus);
  }, []);

  const navigateToPage = (page) => {
    const route = studentRouteMap[page] || "dashboard";
    const destination = `/student/${route}`;
    if (location.pathname === destination) return;
    navigate(`/student/${route}`);
  }; 

  // Fetching student data with user_id
  useEffect(() => {
    if (userId) {
      getStudent(userId);
    } else if (localStorage.getItem("access_token")) {
      logout();
    }
  }, [userId]);

  const handleLogout = () => {
    logout();
  };

  const displayName = studentDetails?.student_name || user?.name || user?.email || "Student";
  const profileClass = studentDetails?.class?.class_name || user?.class?.class_name || "Not assigned";
  const profileSection = studentDetails?.section?.section_name || user?.section?.section_name || "";
  const profileRollNo = studentDetails?.roll_no || user?.roll_no || "Not available";
  const profileEmail = studentDetails?.user?.email || user?.email || "Not available";
  const teacherCode = studentDetails?.teacher_code || user?.teacher_code || "Not assigned";
 
  const visibleMessages = teacherMessages.filter(
    (message) =>
      message.student === displayName ||
      message.student === "All Students",
  );
  const notifications = [
    ...visibleMessages.slice(0, 5).map((message) => ({
      id: `message-${message.id || message.sentAt}`,
      title: "New teacher message",
      detail: message.text || "Your teacher sent you a message.",
      action: "Messages",
    })),
    ...(assignments || [])
      .filter((assignment) => assignment.student === displayName || assignment.student === "All Students")
      .slice(0, 5)
      .map((assignment) => ({
        id: `assignment-${assignment.id || assignment.title}`,
        title: "New assignment",
        detail: assignment.title || `${assignment.subject || "Class"} assignment`,
        action: "Homework",
      })),
    ...(calendarEvents || []).slice(0, 5).map((event) => ({
      id: `schedule-${event.id || event.title}`,
      title: "Scheduled activity",
      detail: `${event.title}${event.time ? ` at ${event.time}` : ""}`,
      action: "Dashboard",
    })),
  ];

  return (
    <>
      <AppLayout
        shellClass="studentShell"
        dashboardClass={sidebarCollapsed ? "studentSidebarCollapsed" : ""}
        sidebarProps={{
          title: (
            <>
              Student
              <br />
              Panel
            </>
          ),
          groups: studentNavGroups,
          activePage,
          onNavigate: navigateToPage,
          onLogout: handleLogout,
          collapsed: sidebarCollapsed,
          onToggle: () => setSidebarCollapsed((current) => !current),
        }}
        headerProps={{
          title:
            activePage === "Dashboard"
              ? `${greeting}, ${displayName.split(" ")[0]}`
              : activePage,
          subtitle:
            activePage === "Dashboard"
              ? "Here's a clear view of your learning for today."
              : "Everything you need for this section is ready here.",
          actions: (
            <div className="studentHeaderMenus" ref={headerMenuRef}>
              <div className="profileMenu">
                <button
                  type="button"
                  aria-label="Notifications"
                  aria-expanded={openHeaderMenu === "notifications"}
                  onClick={() =>
                    setOpenHeaderMenu((current) =>
                      current === "notifications" ? null : "notifications",
                    )
                  }
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="notificationDot" />
                  )}
                </button>
                {openHeaderMenu === "notifications" && (
                  <section
                    className="profilePopover studentHeaderPopover"
                    aria-label="Student notifications"
                  >
                    <div className="profilePopoverTitle">
                      <Bell size={25} />
                      <div>
                        <strong>Notifications</strong>
                        <span>{notifications.length} platform updates</span>
                      </div>
                    </div>
                    {notifications.length ? (
                      <div className="studentNotificationList">
                        {notifications.map((notification) => (
                          <button
                            type="button"
                            className="studentNotificationItem"
                            key={notification.id}
                            onClick={() => {
                              setOpenHeaderMenu(null);
                              navigateToPage(notification.action);
                            }}
                          >
                            <strong>{notification.title}</strong>
                            <span>{notification.detail}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p>You are all caught up.</p>
                    )}
                  </section>
                )}
              </div>
              <div className="profileMenu">
                <button
                  type="button"
                  aria-label="Profile"
                  aria-expanded={openHeaderMenu === "profile"}
                  onClick={() =>
                    setOpenHeaderMenu((current) =>
                      current === "profile" ? null : "profile",
                    )
                  }
                >
                  <CircleUserRound size={22} />
                </button>
                {openHeaderMenu === "profile" && (
                  <section
                    className="profilePopover studentHeaderPopover studentProfilePopover"
                    aria-label="Student profile"
                  >
                    <span className="studentProfileEyebrow">MY PROFILE</span>
                    <div className="profilePopoverTitle studentProfileIdentity">
                      <CircleUserRound size={30} />
                      <div>
                        <strong>{displayName}</strong>
                        <span>Student Account</span>
                      </div>
                    </div>
                    <div className="studentProfileDetails">
                      <div>
                        <span className="studentDetailIcon blue">
                          <GraduationCap size={17} />
                        </span>
                        <p>
                          <small>Class &amp; Section</small>
                          <strong>
                            {profileClass}
                            {profileSection ? ` - ${profileSection}` : ""}
                          </strong>
                        </p>
                      </div>
                      <div>
                        <span className="studentDetailIcon violet">#</span>
                        <p>
                          <small>Roll Number</small>
                          <strong>{profileRollNo}</strong>
                        </p>
                      </div>
                      <div>
                        <span className="studentDetailIcon green">
                          <Mail size={16} />
                        </span>
                        <p>
                          <small>Email Address</small>
                          <strong>{profileEmail}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="studentTeacherCode">
                      <span>
                        <small>TEACHER CODE</small>
                        <strong>{teacherCode}</strong>
                      </span>
                      <em>Connected</em>
                    </div>
                  </section>
                )}
              </div>
            </div>
          ),
        }}
      >
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="courses" element={<StudentCoursesPage />} />
          <Route path="study-helper" element={<StudentStudyHelperPage />} />
          <Route path="homework" element={<StudentHomeworkPage />} />
          <Route path="assessment" element={<StudentAssessmentPage />} />
          <Route path="practice" element={<StudentPracticePage />} />
          <Route path="coding-lab" element={<StudentCodingLabPage />} />
          <Route path="progress" element={<StudentProgressPage />} />
          <Route path="certificates" element={<StudentCertificatesPage />} />
          <Route path="leaderboard" element={<StudentLeaderboardPage />} />
          <Route path="library" element={<StudentLibraryPage />} />
          <Route path="messages" element={<StudentMessagesPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </AppLayout>
    </>
  );
}
