import { Fragment, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileCheck2,
  FileText,
  GraduationCap,
  Layers3,
  PenLine,
  Play,
  SearchCheck,
  Trophy,
} from "../../icons/index.js";
import { Badge } from "../../components/shared/SharedComponents.jsx";
// import { BookOpen, Download } from "lucide-react";

import categoryPanelSideRobot from "../../assets/category-panel-side-robot.png";

import { useTeacherCourse } from "../../context/TeacherCourseContext.jsx";
import { useTeacher } from "../../context/TeacherContext.jsx";

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
const cleanCourseTitle = (title) =>
  String(title || "Course resource")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();

export default function TeacherCoursePage() {
  const {
    // Data
    board,
    subjects,
    books,
    classes,
    contents,
    contentFiles,

    // Selected Data
    selectedSubject,
    selectedBook,
    selectedClass,
    selectedContent,

    // Loading
    loading,
    searchLoading,
    error,

    // Selected Functions
    setSelectedSubject,
    setSelectedBook,
    setSelectedClass,
    setSelectedContent,

    // Data Functions
    loadBoard,
    loadSubjects,
    loadBooks,
    loadClasses,
    loadContents,
    loadContentFiles,
  } = useTeacherCourse();

  const { teacherDetails } = useTeacher();
  const [pageSize, setPageSize] = useState(8);
  const [resourcePage, setResourcePage] = useState(1);
  const resources = contentFiles || [];
  const pageCount = Math.max(1, Math.ceil(resources.length / pageSize));
  const currentPage = Math.min(resourcePage, pageCount);
  const firstResource = (currentPage - 1) * pageSize;
  const visibleResources = resources.slice(firstResource, firstResource + pageSize);
  useEffect(() => setResourcePage(1), [contentFiles, pageSize]);

  // Load Starting Data
  useEffect(() => {
    if (teacherDetails?.id) {
      loadBoard(teacherDetails?.id);
      loadSubjects(teacherDetails?.id);
    }
  }, [teacherDetails]);

  // Handle Functions
  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);

    loadBooks(subject?.id, teacherDetails?.id);
  };

  const handleBookChange = (book) => {
    setSelectedBook(book);
  };

  const handleSearch = () => {
    loadContents(selectedBook?.id, teacherDetails?.id);
  };

  const handleContentChange = (content) => {
    setSelectedContent(content);

    if (selectedBook?.id) {
      loadContentFiles(selectedBook?.id, content?.id);
    }
  };

  return (
    <section className="teacherCoursePage" id="eduResourceStudio">
      <header className="resourceLibraryHeading"><span>YOUR TEACHING TOOLKIT</span><h2>Everything you need for your next lesson.</h2><p>Choose a subject and book, then explore e-books, lesson plans, videos, and more.</p></header>
      <div className="courseBreadcrumb">
        <span>Orange Education</span>
        <ChevronRight size={15} />
        <span>CBSE</span>
        <ChevronRight size={15} />
        <strong>{selectedSubject?.subject_name || "Subject"}</strong>
        <ChevronRight size={15} />
        <strong>{selectedBook?.book_name || "Book"}</strong>
        <ChevronRight size={15} />
        <strong>{selectedContent?.content_name || "Content"}</strong>
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
            {contents?.map((content) => (
              <button
                key={content?.id}
                type="button"
                aria-pressed={selectedContent?.id === content?.id}
                className={selectedContent?.id === content?.id ? "active" : ""}
                onClick={() => handleContentChange(content)}
              >
                <span>
                  {CONTENT_GIF_ICONS[content?.content_name] && (
                    <img
                      src={CONTENT_GIF_ICONS[content.content_name]}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                    />
                  )}
                </span>
                <div>
                  <small>{content?.content_name}</small>
                </div>
              </button>
            ))}
          </div>
          {!contents?.length && <p className="resourceCategoryHint">Find a book to see its available resource types.</p>}
        </aside>

        <section className="courseLibraryMain">
          <div className="courseFilterBar">
            <label>
              Publisher
              <select defaultValue="Orange Education">
                <option>Orange Education</option>
                {/* <option>360 Orange Learning</option> */}
              </select>
            </label>
            <label>
              Board
              <select>
                <option key={board?.id} value={board?.id}>
                  {board?.board_name}
                </option>
              </select>
            </label>
            <label>
              Subjects
              <select
                value={selectedSubject?.id || ""}
                onChange={(e) => {
                  const value = subjects?.find(
                    (subject) => subject?.id === Number(e.target.value),
                  );

                  if (value) {
                    handleSubjectChange(value);
                  }
                }}
              >
                <option value="">Select Subject</option>
                {subjects?.map((subject) => (
                  <option key={subject?.id} value={subject?.id}>
                    {subject?.subject_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Books
              <select
                value={selectedBook?.id || ""}
                disabled={!selectedSubject || loading}
                onChange={(e) => {
                  const value = books?.find(
                    (book) => book?.id === Number(e.target.value),
                  );

                  if (value) {
                    handleBookChange(value);
                  }
                }}
              >
                <option value="">
                  {loading ? "Loading books..." : "Select Book"}
                </option>

                {books?.map((book) => (
                  <option key={book?.id} value={book?.id}>
                    {book?.book_name}
                  </option>
                ))}
              </select>
            </label>

            <button type="button" onClick={handleSearch} disabled={!selectedBook?.id || searchLoading}>
              <SearchCheck size={17} /> {searchLoading ? 'Finding…' : 'Find resources'}
            </button>
          </div>

          <div className="worksheetToolbar sharedResourceToolbar">
            <label>
              Per page{" "}
              <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
                <option>8</option>
                <option>12</option>
                <option>16</option>
              </select>{" "}
              resources
            </label>
          </div>
          {error && <p className="resourceLoadError" role="alert">{typeof error === 'string' ? error : 'We couldn’t load these resources. Please try again.'}</p>}

          {searchLoading && (
            <div className="searchLoading" role="status" aria-live="polite">
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

          {!searchLoading && !error && !selectedSubject && (
            <div className="searchPrompt courseEmptyState">
              <span className="courseEmptyIcon">
                <SearchCheck size={28} />
              </span>
              <div>
                <p>
                  Select a subject and book, then choose Find resources to explore your teaching materials.
                </p>
              </div>
            </div>
          )}

          {!searchLoading && selectedContent && contentFiles?.length === 0 && (
            <div className="searchPrompt courseEmptyState courseEmptyStateMissing">
              <span className="courseEmptyIcon">
                <BookOpen size={28} />
              </span>
              <div>
                <strong>No resources found</strong>
                <p>
                  No course resources are available for the selected subject,
                  book, and resource type. Try another resource type or book.
                </p>
              </div>
            </div>
          )}
          <div className="courseBookCoverGrid">
            {visibleResources.map((file, index) => (
              <Fragment key={file?.id || `${file?.title}-${firstResource + index}`}>
                {/* Zip */}
                {file?.file_type === "zip" && (
                  <article
                    className={`courseCoverPreview ${"coverTone" || "teal"}`}
                    // href={file?.extract_url}
                    key={file?.id}
                  >
                    <div className={`coverPaper ${"" ? "hasCoverImage" : ""}`}>
                      <img
                        src={file?.thumbnail}
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
                          href={file?.file_path}
                          download
                          className="downloadButton"
                          aria-label={`Download ${file?.title || "file"}`}
                        >
                          <span>Download</span>
                        </a>
                      ) : (
                        <a
                          className="downloadButton"
                          aria-disabled={!file?.extract_url}
                          href={file?.extract_url}
                          target="_blank"
                        >
                          <span>View</span>
                        </a>
                      )}
                    </div>
                  </article>
                )}

                {/* Topic Animation */}
                {file?.file_type === "video" && (
                  <a
                    className={`courseCoverPreview ${"coverTone" || "teal"}`}
                    href={file?.file_path}
                    target="_blank"
                    rel="noreferrer"
                    key={file?.id}
                  >
                    <div className={`coverPaper ${"" ? "hasCoverImage" : ""}`}>
                      <img
                        src={file?.thumbnail}
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
                {file?.file_type === "pdf" && (
                  <>
                    <article
                      className={`courseCoverPreview ${"coverTone" || "teal"}`}
                      key={file?.id}
                    >
                      <div
                        className={`coverPaper ${"" ? "hasCoverImage" : ""}`}
                      >
                        <img
                          src={file?.thumbnail}
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
                            href={file?.file_path}
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
              </Fragment>
            ))}
          </div>

          <div className="courseTableFooter">
            <span>{resources.length ? `${firstResource + 1}–${Math.min(firstResource + pageSize, resources.length)} of ${resources.length} resources` : 'No resources to display'}</span>
            <div>
              <button type="button" disabled={currentPage === 1} onClick={() => setResourcePage(currentPage - 1)}>Previous</button>
              <strong aria-live="polite">{currentPage} / {pageCount}</strong>
              <button type="button" disabled={currentPage === pageCount} onClick={() => setResourcePage(currentPage + 1)}>Next</button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
