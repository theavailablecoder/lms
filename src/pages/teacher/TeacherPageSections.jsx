// import React, { useEffect, useState } from "react";
// import {
//   Bell,
//   BookOpen,
//   CalendarDays,
//   CheckCircle2,
//   ChevronRight,
//   CircleUserRound,
//   ClipboardCheck,
//   Clock3,
//   Code2,
//   FileCheck2,
//   FileText,
//   Eye,
//   Gauge,
//   GraduationCap,
//   Layers3,
//   Library,
//   ListChecks,
//   LogOut,
//   Mail,
//   Medal,
//   Menu,
//   PenLine,
//   PieChart,
//   Play,
//   SearchCheck,
//   Send,
//   Settings,
//   Sparkles,
//   Trophy,
//   Trash2,
//   UsersRound,
//   X,
// } from "../../icons/index.js";
// // import codeGptBookCover from "../../assets/CodeGPT V4 _Book_1.jpg";
// import orangeClassroomLogo from "../../assets/Classroom logo_01.png";
// import { studentNavGroups, teacherNav } from "../../data/navConfig.js";
// import {
//   stats,
//   assistantModes,
//   assignments,
//   courses,
//   week,
//   activities,
//   studentProfile,
//   timetable,
//   studentAnnouncements,
//   students,
//   starterCalendarEvents,
//   pageData,
//   teacherFeatureData,
//   codingLabs,
//   phetSimulations,
//   phetProjectPages,
//   defaultHtmlCode,
//   defaultPythonCode,
//   defaultJavaCode,
//   defaultSqlCode,
//   studentCodingExercises,
// } from "../../data/mockData.js";
// import { formatDueDate, formatFileSize } from "../../utils/formatters.js";
// import { getTimeGreeting } from "../../utils/greetings.js";
// import { getCodingLabIdFromHomework } from "../../utils/codingLab.js";
// import { buildAssistantReply } from "../../utils/assistant.js";
// import { runPythonCode, runJavaCode, runSqlCode } from "../../utils/codeRunner.js";
// import { Badge } from '../../components/shared/SharedComponents.jsx';
// import { FeaturePage } from '../student/StudentPageSections.jsx';
// import { TeacherCourseLibrary } from './TeacherCourseLibrary.jsx';

// function TeacherFeaturePage({ page }) {
//   const pageInfo = teacherFeatureData[page] || teacherFeatureData.Messages;
//   const Icon = pageInfo.icon;

//   if (page === "Teacher Course") {
//     return <TeacherCourseLibrary />;
//   }

//   return (
//     <section className="featurePage">
//       <div className="featureHero">
//         <div className="featureIcon">
//           <Icon size={34} />
//         </div>
//         <div>
//           <h2>{page}</h2>
//           <p>{pageInfo.subtitle}</p>
//         </div>
//       </div>
//       <div className="featureGrid">
//         {pageInfo.items.map((item) => (
//           <article className="panel featureCard" key={item.title}>
//             <div>
//               <strong>{item.title}</strong>
//               <p>{item.meta}</p>
//             </div>
//             <Badge tone={item.tone}>{item.status}</Badge>
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// }

// export { TeacherFeaturePage };
