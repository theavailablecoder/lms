import { CircleUserRound, GraduationCap, Mail, Phone } from "../../icons/index.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTeacher } from "../../context/TeacherContext.jsx";
// import "../../styles/Teacher/10-teacher-profile.css";

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const { teacherDetails, loadingLogin, error } = useTeacher();
  const apiUser = teacherDetails?.user;
  const apiTeacher = teacherDetails?.teacher;

  const fields = [
    ["Full name", teacherDetails?.teacher_name, "identity"],
    ["Mobile number", teacherDetails?.teacher_mobile, "phone"],
    [
      "Email address",
      teacherDetails?.teacher_email ||
        teacherDetails?.email ||
        teacherDetails?.email_address ||
        apiUser?.teacher_email ||
        apiUser?.email ||
        apiTeacher?.teacher_email ||
        apiTeacher?.email ||
        user?.teacher_email ||
        user?.email,
      "email",
    ],
    ["Teacher code", teacherDetails?.teacher_code, "code"],
    ["School name", teacherDetails?.school_name || teacherDetails?.school?.school_name || teacherDetails?.school?.name, "school"],
    ["School address", teacherDetails?.school_address || teacherDetails?.school?.address, "schoolAddress"],
    ["Personal address", teacherDetails?.personal_address || teacherDetails?.address, "address"],
  ];

  const iconFor = (type) => {
    if (type === "phone") return <Phone size={18} />;
    if (type === "email") return <Mail size={18} />;
    if (type === "school" || type === "schoolAddress") return <GraduationCap size={18} />;
    return <CircleUserRound size={18} />;
  };

  if (loadingLogin) {
    return <section className="teacherProfileNotice">Loading profile details...</section>;
  }

  if (error) {
    return <section className="teacherProfileNotice teacherProfileError">{error}</section>;
  }

  return (
    <section className="teacherProfilePage" aria-label="Teacher profile">
      <div className="teacherProfileHero">
        <div className="teacherProfileAvatar"><CircleUserRound size={42} /></div>
        <div>
          <span>MY PROFILE</span>
          <h1>{teacherDetails?.teacher_name || "Teacher"}</h1>
          <p>-</p>
        </div>
      </div>

      <header className="teacherProfileHeading">
        <div>
          <h2>Registration details</h2>
          <p>Details submitted during teacher registration.</p>
        </div>
      </header>

      <div className="teacherProfileGrid">
        {fields.map(([label, value, type]) => (
          <article className={`teacherProfileField ${type}`} key={label}>
            <span>{iconFor(type)}</span>
            <div>
              <small>{label}</small>
              <strong>{value || "Not available from server"}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


 