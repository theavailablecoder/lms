import { Fragment, useEffect } from "react";
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileText,
  GraduationCap,
  Layers3,
  SearchCheck,
  Trophy,
} from "../../icons/index.js";
import categoryPanelSideRobot from "../../assets/category-panel-side-robot.png";
import { useStudent } from "../../context/StudentContext.jsx";
import { useStudentCourse } from "../../context/StudentCourseContext.jsx";
// icons
import courseIconEbook from "../../assets/course_icon/ebook.gif";
import courseIconVideo from "../../assets/course_icon/video.gif";
import courseIconAnswerKey from "../../assets/course_icon/Answer_key.gif";
import courseIconLessonPlan from "../../assets/course_icon/lesson.gif";
import courseIconWorksheetTeacher from "../../assets/course_icon/worksheet_teacher.gif";
import courseIconWorksheetStudent from "../../assets/course_icon/worksheet_student.gif";
import courseIconTPG from "../../assets/course_icon/test.gif";
import courseIconSoftware from "../../assets/course_icon/software.gif";
import courseIconSuppliment from "../../assets/course_icon/suppliment.gif";
import courseIconBridgeCourse from "../../assets/course_icon/bridge_course.gif";
import courseIconCapstoneProject from "../../assets/course_icon/capstone_project.gif";

const CONTENT_GIF_ICONS = {
  "E-book": courseIconEbook,
  "Topic Animation": courseIconVideo,
  "Answer Key": courseIconAnswerKey,
  "Lesson Plan": courseIconLessonPlan,
  "Practice Worksheet Teacher": courseIconWorksheetTeacher,
  "Practice Worksheet Student": courseIconWorksheetStudent,

  "Test Paper Generator": courseIconTPG,
  "Software Download Link": courseIconSoftware,
  Supplement: courseIconSuppliment,
  "Bridge Course": courseIconBridgeCourse,
  "Capstone Project": courseIconCapstoneProject,
};

const nameOf = (item, fallback = "") =>
  item?.content_name || item?.category_name || item?.name || fallback;
const cleanCourseTitle = (title) =>
  String(title || "Course resource")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
const fileTypeOf = (file) =>
  String(file?.file_type || file?.type || "")
    .trim()
    .toLowerCase()
    .replace(/^application\//, "");
const isKnownFileType = (file) =>
  ["zip", "video", "mp4", "webm", "mov", "pdf"].includes(fileTypeOf(file));
const mediaUrl = (path) => {
  if (!path) return "";
  const value = String(path).trim();
  if (/^(https?:|blob:|data:)/i.test(value)) return value;

  const apiUrl = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const origin = apiUrl.replace(/\/api(?:\/.*)?$/i, "");
  const cleanPath = value.replace(/^\/+/, "");
  return `${origin}/${cleanPath.startsWith("storage/") ? cleanPath : `storage/${cleanPath}`}`;
};
const fileUrl = (file) => mediaUrl(file?.file_url || file?.file_path);
const previewUrl = (file) =>
  mediaUrl(file?.thumbnail || file?.file_path);
const extractUrl = (file) => {
  if (!file?.extract_path) return "";
  const entry = file.entry_file ? `/${file.entry_file.replace(/^\/+/, "")}` : "";
  return `${mediaUrl(file.extract_path)}${entry}`;
};



export default function StudentCoursesPage() {
  const { studentDetails } = useStudent();
  const studentId = studentDetails?.id;
  const {
    board,
    subjects,
    classes,
    categories,
    contentFiles,
    selectedSubject,
    selectedClass,
    selectedCategory,
    loading,
    searchLoading,
    error,
    setSelectedSubject,
    setSelectedClass,
    loadCourseFilters,
    loadCategories,
    loadContent,
  } = useStudentCourse();

  useEffect(() => {
    if (studentId) loadCourseFilters(studentId);
  }, [studentId, loadCourseFilters]);

  const handleSearch = () =>
    loadCategories(studentId, selectedSubject, selectedClass);

  return (
    <section className="teacherCoursePage studentCoursePage" id="eduResourceStudio">
      <header className="resourceLibraryHeading"><span>YOUR LEARNING TOOLKIT</span><h2>Find your next learning adventure.</h2><p>Choose a subject and book, then explore e-books, videos, and practice resources.</p></header>
      <div className="courseBreadcrumb">
        <span>Orange Education</span>
        <ChevronRight size={15} />
        <span>{board?.board_name || "My Board"}</span>
        <ChevronRight size={15} />
        <strong>{selectedSubject?.subject_name || "Subject"}</strong>
        <ChevronRight size={15} />
        <strong>{selectedClass?.class_name || "Class"}</strong>
        <ChevronRight size={15} />
        <strong>{nameOf(selectedCategory, "Course Library")}</strong>
      </div>

      <div className="courseLibraryLayout">
        <aside
          className="courseCategoryPanel"
          aria-label="Course resource categories"
        >
          <img
            className="categoryPanelSideRobot"
            src={categoryPanelSideRobot}
            alt=""
            aria-hidden="true"
          />
          <div className="categoryPanelHeader">
            <span>
              <Layers3 size={18} /> Resource types
            </span>
          </div>
          <div className="categoryList">
            {categories.map((category) => {
              const categoryName = nameOf(category, "Resource");
              const categoryIcon = CONTENT_GIF_ICONS[categoryName];
              const CategoryIcon =
                typeof categoryIcon === "function" ? categoryIcon : null;
              return (
                <button
                  key={category.id}
                  type="button"
                  className={
                    selectedCategory?.id === category.id ? "active" : ""
                  }
                  onClick={() => loadContent(studentId, category)}
                >
                  <span>
                    {typeof categoryIcon === "string" && (
                      <img
                        src={categoryIcon}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                      />
                    )}
                    {CategoryIcon && (
                      <CategoryIcon size={22} aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <small>{categoryName}</small>
                  </div>
                </button>
              );
            })}
   
          </div>
        </aside>

        <section className="courseLibraryMain">
          <div className="courseFilterBar">
            <label>
              Publisher
              <select defaultValue="Orange Education">
                <option>Orange Education</option>
              </select>
            </label>
            <label>
              Board
              <select value={board?.id || ""} disabled>
                <option value={board?.id || ""}>
                  {board?.board_name || "Loading board..."}
                </option>
              </select>
            </label>
            <label>
              Subjects
              <select
                value={selectedSubject?.id || ""}
                disabled={loading}
                onChange={(event) =>
                  setSelectedSubject(
                    subjects.find(
                      (item) => item.id === Number(event.target.value),
                    ) || null,
                  )
                }
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Class
              <select
                value={selectedClass?.id || ""}
                disabled={loading}
                onChange={(event) =>
                  setSelectedClass(
                    classes.find(
                      (item) => item.id === Number(event.target.value),
                    ) || null,
                  )
                }
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.class_name || classItem.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleSearch}
              disabled={!selectedSubject || !selectedClass || searchLoading}
              aria-label="Search course resources"
            >
              <SearchCheck size={17} /> Find resources
            </button>
          </div>

          <div className="worksheetToolbar sharedResourceToolbar">
            <label>
              Per page{" "}
              <select defaultValue="8">
                <option>8</option>
                <option>12</option>
                <option>16</option>
              </select>{" "}
              resources
            </label>
          </div>
          {error && (
            <div className="searchPrompt" role="alert">
              {error}
            </div>
          )}
          {searchLoading && (
            <div className="searchLoading" role="status">
              <div className="searchLoadingCard">
                <div className="spinner" aria-hidden="true">
                  <span />
                  <span />
                  <BookOpen size={24} />
                </div>
                <strong>Loading course resources</strong>
                <span>Please wait while we prepare your content...</span>
              </div>
            </div>
          )}

          {!searchLoading && !error && (!selectedSubject || !selectedClass) && (
            <div className="searchPrompt courseEmptyState">
              <span className="courseEmptyIcon">
                <SearchCheck size={28} />
              </span>
              <div>
                <p>
                  Select a subject and class, then click Search to display
                  content.
                </p>
              </div>
            </div>
          )}

          {!searchLoading &&
            !error &&
            selectedCategory &&
            contentFiles?.length === 0 && (
              <div className="searchPrompt courseEmptyState courseEmptyStateMissing">
                <span className="courseEmptyIcon">
                  <BookOpen size={28} />
                </span>
                <div>
                  <strong>No resources found</strong>
                  <p>
                    No course resources are available for the selected subject,
                    class, and category.
                  </p>
                </div>
              </div>
            )}

          <div className="courseBookCoverGrid">
            {contentFiles?.map((file, index) => (
               <Fragment key={file.id ?? `${file.book_id}-${file.content_id}-${index}`}>
                {/* Zip */}
                {fileTypeOf(file) === "zip" && (
                  <article
                    className="courseCoverPreview coverTone"
                    key={file?.id}
                  >
                    <div className="coverPaper">
                     
                      <img
                        src={previewUrl(file)}
                        alt=""
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                        }}
                      />

                      <div className="coverIdentity">
                        <BookOpen size={28} />
                        <span>{file?.file_type?.toUpperCase()}</span>
                      </div>
                      <h4 style={{ whiteSpace: "pre-line" }}>
                        {cleanCourseTitle(file?.title)}
                      </h4>

                      <i className="coverPageLines" aria-hidden="true" />
                    </div>
                    <div className="coverCaption">
                      <strong style={{ whiteSpace: "pre-line" }}>
                        {cleanCourseTitle(file?.title)}
                      </strong>
                      {file?.file_path ? (
                        <a
                          href={mediaUrl(file.file_path)}
                          download
                          className="downloadButton"
                          aria-label={`Download ${file?.title || "file"}`}
                        >
                          <span>Download</span>
                        </a>
                      ) : (
                        <a className="downloadButton" aria-disabled={!extractUrl(file)} href={extractUrl(file)} target="_blank" rel="noreferrer">
                          <span>View</span>
                        </a>
                      )}
                    </div>
                  </article>
                )}

                {/* Topic Animation */}
                {["video", "mp4", "webm", "mov"].includes(fileTypeOf(file)) && (
                  <a
                    className="courseCoverPreview coverTone"
                    href={fileUrl(file)}
                    target="_blank"
                    rel="noreferrer"
                    key={file?.id}
                  >
                    <div className="coverPaper">
                      <img
                        src={previewUrl(file)}
                        alt=""
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                        }}
                      />

                      <div className="coverIdentity">
                        <BookOpen size={28} />
                        <span>{file?.file_type?.toUpperCase()}</span>
                      </div>
                      <h4 style={{ whiteSpace: "pre-line" }}>
                        {cleanCourseTitle(file?.title)}
                      </h4>

                      <i className="coverPageLines" aria-hidden="true" />
                    </div>
                    <div className="coverCaption">
                      <strong style={{ whiteSpace: "pre-line" }}>
                        {cleanCourseTitle(file?.title)}
                      </strong>
                    </div>
                  </a>
                )}

                {/* PDF */}
                {fileTypeOf(file) === "pdf" && (
                  <>
                    <article
                      className="courseCoverPreview coverTone"
                      
                      rel="noreferrer"
                      key={file?.id}
                    >
                      <div
                        className="coverPaper"
                      >
                        <img
                          src={previewUrl(file)}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.hidden = true;
                          }}
                        />

                        <div className="coverIdentity">
                          <BookOpen size={28} />
                          <span>{file?.file_type?.toUpperCase()}</span>
                        </div>
                        <h4 style={{ whiteSpace: "pre-line" }}>
                          {cleanCourseTitle(file?.title)}
                        </h4>
                        <i className="coverPageLines" aria-hidden="true" />
                      </div>
                      <div className="coverCaption">
                        <strong style={{ whiteSpace: "pre-line" }}>
                          {cleanCourseTitle(file?.title)}
                        </strong>
                        {file?.file_path && (
                        <a
                          href={mediaUrl(file.file_path)}
                          target="_blank"
                          className="downloadButton"
                          aria-label={`Download ${file?.title || "file"}`}
                        >
                          <span>View</span>
                        </a>
                      )}
                      </div>
                    </article>
                     
                  </>
                )}

                {!isKnownFileType(file) && (
                  <article className="courseCoverPreview coverTone">
                    <div className="coverPaper">
                      {file?.thumbnail && (
                        <img
                          src={previewUrl(file)}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.hidden = true;
                          }}
                        />
                      )}
                      <div className="coverIdentity">
                        <FileText size={28} />
                        <span>{fileTypeOf(file).toUpperCase() || "FILE"}</span>
                      </div>
                      <h4 style={{ whiteSpace: "pre-line" }}>
                        {cleanCourseTitle(file?.title)}
                      </h4>
                      <i className="coverPageLines" aria-hidden="true" />
                    </div>
                    <div className="coverCaption">
                      <strong style={{ whiteSpace: "pre-line" }}>
                        {cleanCourseTitle(file?.title)}
                      </strong>
                      {(file?.file_path || file?.file_url) && (
                        <a
                          href={fileUrl(file)}
                          target="_blank"
                          rel="noreferrer"
                          className="downloadButton"
                        >
                          <span>View</span>
                        </a>
                      )}
                    </div>
                  </article>
                )}
              </Fragment>
            ))}
          </div>
          
        </section>
      </div>
    </section>
  );
}
