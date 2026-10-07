import { CircleUserRound, GraduationCap, Mail, Phone } from "../../icons/index.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useStudent } from "../../context/StudentContext.jsx";


const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && String(value).trim()) ||
  "";

export default function StudentProfilePage() {
  const { user } = useAuth();
  const { studentDetails } = useStudent();
  const details = studentDetails || {};
  const account = details?.user || {};

  const profile = [
    ["Full name", firstValue(details.student_name, details.fullName, details.name, user?.name), "identity"],
    ["Mobile number", firstValue(details.student_mobile, details.phone, details.mobile_number, user?.mobile), "phone"],
    ["Email address", firstValue(account.email, details.email, user?.email), "email"],
    ["School name", firstValue(details.school_name, details.schoolName, user?.school_name), "school"],
    ["Class", firstValue(details.class?.class_name, details.class_name, details.className, user?.class?.class_name), "class"],
    ["Section", firstValue(details.section?.section_name, details.section_name, details.section), "section"],
    ["Teacher code", firstValue(details.teacher_code, details.teacherCode, user?.teacher_code), "teacher"],
    ["Address", firstValue(details.address, user?.address), "address"],
  ];
  const completedFields = profile.filter(([, value]) => value).length;
  const completionPercent = Math.round((completedFields / profile.length) * 100);
  const displayName = profile[0][1] || "Student";

  const iconFor = (type) => {
    if (type === "phone") return <Phone size={18} />;
    if (type === "email") return <Mail size={18} />;
    if (type === "class" || type === "school") return <GraduationCap size={18} />;
    return <CircleUserRound size={18} />;
  };

  return (
    <section className="studentProfilePage" aria-label="Student profile">
      <div className="studentProfileHero">
        <div className="studentProfileAvatar"><CircleUserRound size={42} /></div>
        <div>
          <span className="studentProfileKicker">MY PROFILE</span>
          <h1>{displayName}</h1>
          <p>Registration details and account information</p>
        </div>
        <div className="studentProfileStatus">
          <strong>{completionPercent}%</strong>
          <span>Profile complete</span>
        </div>
      </div>

      <div className="studentProfileProgress" aria-label={`${completionPercent}% profile complete`}>
        <span style={{ width: `${completionPercent}%` }} />
      </div>

      <div className="studentProfileSectionHeading">
        <div>
          <h2>Registration details</h2>
          <p>These details were collected during student registration.</p>
        </div>
        <span className={completionPercent === 100 ? "profileCompleteBadge" : "profileIncompleteBadge"}>
          {completionPercent === 100 ? "All details filled" : `${profile.length - completedFields} detail(s) missing`}
        </span>
      </div>

      <div className="studentProfileGrid">
        {profile.map(([label, value, type]) => (
          <article className={`studentProfileField ${type}`} key={label}>
            <span className="studentProfileFieldIcon">{iconFor(type)}</span>
            <div>
              <small>{label}</small>
              <strong>{value || "Not provided"}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
