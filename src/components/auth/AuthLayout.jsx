import orangeClassroomLogo from "../../assets/Classroom logo_01.png";
import loginBackgroundVideo from "../../assets/Login.mp4";
import CompanyBrand from '../shared/CompanyBrand.jsx';
import { BookOpen, Code2, GraduationCap, Layers3, Sparkles } from '../../icons/index.js';

// Every authentication page uses this same wrapper.
export default function AuthLayout({ children, isRegistration = false }) {
  if (!isRegistration) {
    return (
      <main className="classroomWelcome">
        <div className="learningBackdrop" aria-hidden="true">
          <span className="learningGlow glowTeal" /><span className="learningGlow glowBlue" />
          <span className="learningOrbit orbitNorth" /><span className="learningOrbit orbitSouth" />
          <span className="learningFloat floatBook"><BookOpen size={30} /></span>
          <span className="learningFloat floatCode"><Code2 size={30} /></span>
          <span className="learningFloat floatCap"><GraduationCap size={32} /></span>
          <span className="learningFloat floatLayers"><Layers3 size={28} /></span>
          <span className="learningFloat floatSpark"><Sparkles size={26} /></span>
          <span className="learningCode codeNorth">&lt;create /&gt;</span>
          <span className="learningCode codeSouth">learn. build. grow.</span>
          <span className="learningDot dotOne" /><span className="learningDot dotTwo" /><span className="learningDot dotThree" />
        </div>
        <header className="welcomeHeader">
          <a href={import.meta.env.BASE_URL} className="welcomeBrand" aria-label="AKTech home">
            <CompanyBrand />
          </a>
          <span className="welcomeHeaderNote">A little learning. Endless possibilities.</span>
        </header>
        <section className="welcomeGrid">
          <div className="welcomeStory">
            <span className="welcomeEyebrow"><i /> YOUR NEXT CHAPTER STARTS HERE</span>
            <h1>Big ideas.<br />Bright futures.<br /><em>One classroom.</em></h1>
            <p>A space to learn, teach, and create. Bring your curiosity — we’ll bring everything you need to grow.</p>
            <div className="welcomeWorkspace" aria-label="Learning, coding, and progress in one workspace">
              <div className="workspaceTop"><span><i /><i /><i /></span><small>Your learning workspace</small></div>
              <div className="workspaceBody">
                <div className="workspaceLesson"><span className="workspaceTag">KEEP EXPLORING</span><h3>Small steps.<br />Great progress.</h3><div className="workspaceBooks" aria-hidden="true"><i /><i /><i /></div><span className="workspaceLessonFoot">Learn something new every day <b>↗</b></span></div>
                <div className="workspaceWidgets"><div className="workspaceCode"><span>CREATE & CODE</span><code><b>&lt;hello&gt;</b><br />&nbsp; your next big idea<br /><b>&lt;/hello&gt;</b></code></div><div className="workspaceProgress"><span>GROW AT YOUR PACE</span><div><i /><i /><i /><i /><i /><i /><i /></div><small>Every step counts <b>↗</b></small></div></div>
              </div>
            </div>
            <div className="welcomeFeatures"><span>✦ Learn with purpose</span><span>✦ Create with confidence</span><span>✦ Grow together</span></div>
          </div>
          <div className="welcomeFormPanel">
            <div className="welcomeFormHeading"><span className="welcomeHello">✦</span><h2>Welcome back</h2><p>Your classroom is ready when you are.</p></div>
            {children}
            <p className="welcomeFormFoot">One workspace. A world of possibilities.</p>
          </div>
        </section>
        <footer className="welcomeFooter"><span>AKTech</span><span>Made for curious minds.</span></footer>
      </main>
    );
  }
  return (
    <main className="loginShell">
      <div className="loginBackdrop" aria-hidden="true">
      </div>

      <section className="loginCard">
        {!isRegistration && (
          <div className="loginIntro">
            <div>
              <h1>
                <span>Integrated Learning &amp;</span>
                <span>Coding Workspace</span>
              </h1>
              <p>
                Learning • Teaching • Coding • Assessment • AI Support <br />Assignments • Projects • Communication • Reports
              </p>
            </div>

            <div className="introBrief" aria-label="Workspace highlights">
              <div className="introBriefTrack">
                <span>Plan lessons faster</span>
                <span>Review homework easily</span>
                <span>Track student progress</span>
                <span>Keep everyone connected</span>
              </div>
            </div>

            <div className="loginAnimation" aria-hidden="true">
              <div className="hubVisual">
                <span className="orbit orbitOne" />
                <span className="orbit orbitTwo" />
                <div className="hubCore"><span>LMS</span></div>
                <span className="hubChip chipCourse">Courses</span>
                <span className="hubChip chipUsers">Users</span>
                <span className="hubChip chipReports">Reports</span>
                <span className="hubChip chipProgress">Live progress</span>
                <span className="dataBars"><i /><i /><i /></span>
              </div>
            </div>
          </div>
        )}

        <div className="loginPanel">
          {!isRegistration && (
            <video className="loginBackgroundVideo" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
              <source src={loginBackgroundVideo} type="video/mp4" />
            </video>
          )}
          <div className="loginBrand">
            <div className="loginLogoOrbit">
              <CompanyBrand />
            </div>
          </div>
          {!isRegistration && (
            <div className="loginLearningFlow" aria-hidden="true">
              <span>Learn</span>
              <i><b /></i>
              <span>Practice</span>
              <i><b /></i>
              <span>Progress</span>
            </div>
          )}
          {children}
        </div>
      </section>
    </main>
  );
}
