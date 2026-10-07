import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Gauge,
  GraduationCap,
  ListChecks,
  PenLine,
  SearchCheck,
  X,
} from "../../icons/index.js";
import assessmentHeaderIllustration from "../../assets/homework-header-illustration.png";
import assessmentTotalArtwork from "../../assets/assessment-total-3d.png";
import assessmentDraftArtwork from "../../assets/assessment-draft-3d.png";
import assessmentReadyArtwork from "../../assets/assessment-ready-3d.png";
import assessmentSubmissionsArtwork from "../../assets/assessment-submissions-3d.png";

import { useTeacherAssessment } from "../../context/TeacherAssessmentContext.jsx";
import { useTeacher } from "../../context/TeacherContext.jsx";
import { formatDueDate } from "../../utils/formatters.js";

export default function TeacherAssessmentsPage() {
  const [assessmentView, setAssessmentView] = useState("create");
  const [creationMode, setCreationMode] = useState("manual");
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedSubmittedAttemptKey, setSelectedSubmittedAttemptKey] = useState(null);
  const [questionMarks, setQuestionMarks] = useState({});

  const { teacherDetails } = useTeacher();

  const teacherId = teacherDetails?.id;

  const {
    subjects,
    books,
    classes,
    sections,
    tests,
    assignedAssessment,
    getSubmittedAssessment,
    teacherBooks,
    teacherClass,
    teacherSection,

    selectedSubject,
    selectedBook,
    selectedClass,
    selectedSection,
    selectedTests,
    setSelectedTests,
    selectedTeacherBook,
    selectedTeacherSection,

    loading,
    actionStatus,

    loadSubjects,
    loadBooks,
    loadSections,
    loadTests,
    addAssessment,
    fetchAssessment,
    removeAssessment,
    fetchBooks,
    fetchSection,
    fetchSubmittedAssessment,
    changeSubmittedAssessment,

    setClasses,
    setTeacherClass,

    setSelectedSubject,
    setSelectedBook,
    setSelectedclass,
    setSelectedSections,
    setSelectedTeacherBook,
    setSelectedTeacherSection,
  } = useTeacherAssessment();

  const submittedAssessmentPayload = getSubmittedAssessment?.data ?? getSubmittedAssessment;
  const submittedAssessments = Array.isArray(submittedAssessmentPayload)
    ? submittedAssessmentPayload
    : submittedAssessmentPayload
      ? [submittedAssessmentPayload]
      : [];

  const submittedAttempts = submittedAssessments.flatMap((assessment) =>
    (assessment.studentAssessmentAttempts || assessment.student_assessment_attempts || [])
      .filter((attempt) => attempt.is_submitted === "submitted")
      .map((attempt) => ({ assessment, attempt })),
  );

  const selectedSubmittedRecord = submittedAttempts.find(
    ({ assessment, attempt }) =>
      `${assessment.id}-${attempt.id}` === selectedSubmittedAttemptKey,
  ) || submittedAttempts[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teacher_id: teacherId || "",
      test_template_id: "",
      class_id: "",
      section_id: "",
      book_id: "",

      start_date: "",
      end_date: "",
      status: "active",
    },
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  useEffect(() => {
    if (teacherId) {
      setValue("teacher_id", teacherId);
      loadSubjects(teacherId);
      fetchAssessment(teacherId);
    }
  }, [teacherId]);

  // Update Submitted Assessment
  const handleUpdateSubmittedMarks = async (event) => {
    event.preventDefault();
    if (!selectedSubmittedRecord) return;

    const { assessment, attempt } = selectedSubmittedRecord;
    const gradedAnswers = (attempt.answers || []).map((answer) => ({
      question_id: answer.question_id,
      marks_obtained: Number(
        questionMarks[`${attempt.id}-${answer.question_id}`] ?? answer.marks_obtained ?? 0,
      ),
    }));

    const success = await changeSubmittedAssessment(assessment.id, attempt.student_id, gradedAnswers);

    if (success && teacherId && selectedBook?.id && selectedTeacherSection?.id) {
      fetchSubmittedAssessment(teacherId, selectedBook?.id, selectedTeacherSection?.id);
    }
  };

  const handleSubjectChange = (event) => {
    const subjectId = event.target.value;

    const subject = subjects?.find(
      (subject) => subject?.id === Number(event.target.value),
    );

    setSelectedSubject(subject);

    setValue("book_id", "");
    setValue("class_id", "");
    setValue("section_id", "");
    setValue("test_template_id", "");

    // API Calling
    if (subjectId) {
      loadBooks(subjectId, teacherId);
    }
  };

  const handleBookChange = (event) => {
    const bookId = event.target.value;

    const book = books?.find((book) => book?.id === Number(event.target.value));

    setSelectedBook(book);

    setValue("book_id", bookId, {
      shouldValidate: true,
    });

    setValue("class_id", "");
    setValue("section_id", "");
    setValue("test_template_id", "");

    if (bookId) {
      const book = books?.find((item) => String(item.id) === String(bookId));

      if (book?.class) {
        setClasses(book?.class);

        setSelectedclass(book?.class);

        setValue("class_id", book?.class?.id, {
          shouldValidate: true,
        });

        loadSections(book?.class?.id);
      }

      loadTests(bookId);
    }
  };

  const handleSectionChange = (event) => {
    const sectionId = event.target.value;

    const section = sections?.find(
      (section) => section?.id === Number(event.target.value),
    );

    setSelectedSections(section);

    setValue("section_id", sectionId, {
      shouldValidate: true,
    });
  };

  const handleTestChange = (event) => {
    const testId = event.target.value;

    const test = tests?.find((test) => test?.id === Number(event.target.value));

    setSelectedTests(test);

    setValue("test_template_id", testId, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data) => {
    const success = await addAssessment(data);

    if (success && teacherId) {
      await fetchAssessment(teacherId);
    }
  };

  const handleDelete = async (id) => {
    const success = await removeAssessment(id);

    if (success && teacherId) {
      await fetchAssessment(teacherId);
    }
  };

  const handleTeacherSubjectChange = (event) => {
    const subjectId = event.target.value;
    if (subjectId) {
      fetchBooks(subjectId, teacherId);
    }
  }

  const handleTeacherBookChange = (event) => {
    const bookId = event.target.value;

    if (bookId) {
      const book = teacherBooks?.find((item) => String(item.id) === String(bookId));
      setSelectedTeacherBook(book);

      if (book?.class) {
        setTeacherClass(book?.class);

        fetchSection(book?.class?.id);
      }
    }
  }

  const handleTeacherSectionChange = (event) => {
    const sectionId = event.target.value;

    const section = teacherSection?.find(
      (item) => item?.id === Number(event.target.value),
    );

    if (sectionId) {
      setSelectedTeacherSection(section);
    }
  };

  const handleSubmittedAssessmentSearch = () => {
    if (teacherId && selectedTeacherBook?.id && selectedTeacherSection?.id) {
      fetchSubmittedAssessment(teacherId, selectedTeacherBook?.id, selectedTeacherSection?.id);
    }
  }

const handleStatusChange = async (assessment) => {
  const newStatus =
    assessment?.status === "active" ? "inactive" : "active";

  const success = await changeAssessment(assessment.id, {
    status: newStatus,
  });

  if (success && teacherId) {
    await fetchAssessment(teacherId);
  }
};



  const totalAssessments = assignedAssessment?.length || 0;

const draftAssessments =
  assignedAssessment?.filter(
    (assessment) => assessment?.status === "pending"
  ).length || 0;

const readyAssessments =
  assignedAssessment?.filter(
    (assessment) => assessment?.status === "active"
  ).length || 0;

const submittedCount = submittedAttempts.length;



  return (
    <section className="testExamModule" id="akAssessmentStudio">
      {/* Cards */}
      <section
        className="assessmentSummaryGrid"
        aria-label="Assessment overview"
      >
        <article className="assessmentSummaryCard violet">
          <span className="assessmentSummaryIcon">
            <ClipboardCheck size={19} />
          </span>
          <img
            className="assessmentSummaryArtwork"
            src={assessmentTotalArtwork}
            alt=""
            aria-hidden="true"
          />
          <strong>{totalAssessments}</strong>
          <h3>Total assessments</h3>
          <p>Created tests</p>
        </article>
        <article className="assessmentSummaryCard amber">
          <span className="assessmentSummaryIcon">
            <Clock3 size={19} />
          </span>
          <img
            className="assessmentSummaryArtwork"
            src={assessmentDraftArtwork}
            alt=""
            aria-hidden="true"
          />
          <strong>{draftAssessments}</strong>
          <h3>Pending</h3>
          <p>Still in progress</p>
        </article>
        <article className="assessmentSummaryCard green">
          <span className="assessmentSummaryIcon">
            <CheckCircle2 size={19} />
          </span>
          <img
            className="assessmentSummaryArtwork"
            src={assessmentReadyArtwork}
            alt=""
            aria-hidden="true"
          />
          <strong>{readyAssessments}</strong>
          <h3>Active</h3>
          <p>Ready for students</p>
        </article>
        <article className="assessmentSummaryCard pink">
          <span className="assessmentSummaryIcon">
            <FileCheck2 size={19} />
          </span>
          <img
            className="assessmentSummaryArtwork"
            src={assessmentSubmissionsArtwork}
            alt=""
            aria-hidden="true"
          />
          <strong>{submittedCount}</strong>
          <h3>Submissions</h3>
          <p>Student responses</p>
        </article>
      </section>

      <section className="assessmentSwipeWorkspace">
        <header className="assessmentSwipeHeader">
          <div>
            <span>ASSESSMENT WORKSPACE</span>
            <h2>Tests &amp; Exams</h2>
            <p>Create assessments and manage saved tests from one place.</p>
          </div>
        </header>

        {/* Tabs */}
        <div
          className="assessmentSwipeTabs"
          role="tablist"
          aria-label="Assessment workspace"
        >
          <button
            type="button"
            role="tab"
            aria-selected={assessmentView === "create"}
            className={assessmentView === "create" ? "active" : ""}
            onClick={() => setAssessmentView("create")}
          >
            <span>
              <ClipboardCheck size={20} />
            </span>
            <div>
              <strong>Create Assessment</strong>
              <small>Build a new test or exam</small>
            </div>
            <em>New</em>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={assessmentView === "submitted"}
            className={assessmentView === "submitted" ? "active" : ""}
            onClick={() => setAssessmentView("submitted")}
          >
            <span>
              <FileCheck2 size={20} />
            </span>
            <div>
              <strong>Submitted Assessments</strong>
              <small>Review student submissions</small>
            </div>
            {/* <em>08</em> */}
          </button>
        </div>

        <div className={`assessmentSwipeViewport showing-${assessmentView}`}>
          <div className="assessmentSwipeTrack singleAssessmentPane">
            {assessmentView === "create" ? (
              // Create Assessment
              <div
                className="assessmentSwipePane"
                role="tabpanel"
                aria-hidden="false"
              >
                <section className="teacherGrid examBuilderGrid">
                  <div className="panel assignForm examForm examFormManual">
                    <div className="panelHeader">
                      <h2>
                        <ClipboardCheck size={22} /> Create Assessment
                      </h2>
                      <span>Ready to save</span>
                      <img
                        className="examHeaderIllustration"
                        src={assessmentHeaderIllustration}
                        alt="Assessment creation illustration"
                      />
                    </div>
                    <div
                      className="examCreationModes"
                      role="tablist"
                      aria-label="Test creation method"
                    >
                      <button
                        className={creationMode === "manual" ? "active" : ""}
                        type="button"
                        onClick={() => setCreationMode("manual")}
                      >
                        <PenLine size={17} /> Create Manually
                      </button>
                      <button
                        className={creationMode === "ai" ? "active" : ""}
                        type="button"
                        onClick={() => setCreationMode("ai")}
                      >
                        Create with AI
                      </button>
                    </div>
                    {/* Success & Error Message */}
                    {actionStatus && (
                      <div className={`alert ${actionStatus?.type}`}>
                        {actionStatus?.message}
                      </div>
                    )}
                    {creationMode === "ai" ? (
                      // Create with AI
                      <div className="examAiCreator">
                        <div className="examAiIntro">
                          <div className="examAiCore" aria-hidden="true">
                            <span>AI</span>
                          </div>
                          <div>
                            <span className="examAiBadge">
                              <i /> AI Powered
                            </span>
                            <strong>Smart Test Generator</strong>
                            <p>
                              Turn any topic into a polished, editable test in
                              seconds.
                            </p>
                          </div>
                        </div>
                        <div className="examAiActions">
                          <input placeholder="Enter a topic" />
                          <button type="button">Generate draft</button>
                        </div>
                        <div
                          className="examAiToolGrid"
                          aria-label="AI test tools"
                        >
                          <label>
                            Difficulty
                            <select>
                              <option>Select Difficulty</option>
                              <option>Foundation</option>
                              <option>Balanced</option>
                              <option>Advanced</option>
                            </select>
                          </label>
                          <label>
                            Question style
                            <select>
                              <option>Select Question Style</option>
                              <option>Mixed</option>
                              <option>Multiple choice</option>
                              <option>Written</option>
                            </select>
                          </label>
                          <label>
                            Questions
                            <select>
                              <option>Select Questions</option>
                              <option>5</option>
                              <option>10</option>
                              <option>15</option>
                              <option>20</option>
                            </select>
                          </label>
                          <label>
                            Focus
                            <select>
                              <option>Select Focus</option>
                              <option>Concept mastery</option>
                              <option>Exam practice</option>
                              <option>Critical thinking</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    ) : (
                      // Create Manually
                      <>
                      <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="formRow " >
                            {/* Subject */}
                            <label className="examFieldWrap">
                              <span className="homeworkFieldLabel">
                                Subject <b>*</b>
                              </span>
                              <span className="homeworkControl">
                                <BookOpen className="examFieldIcon" size={17} />
                                <select
                                  value={selectedSubject?.id || ""}
                                  onChange={handleSubjectChange}
                                  required
                                >
                                  <option value="">Select Subject</option>

                                  {subjects?.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                      {subject.subject_name}
                                    </option>
                                  ))}
                                </select>
                              </span>
                            </label>
                            {/* Book */}
                            <label className="examFieldWrap">
                              <span className="homeworkFieldLabel">
                                Book <b>*</b>
                              </span>
                              <span className="homeworkControl">
                                <GraduationCap className="examFieldIcon" size={17} />
                                <select
                                  required
                                  value={selectedBook?.id || ""}
                                  onChange={handleBookChange}
                                >
                                  <option value="">Select Book</option>

                                  {books?.map((book) => (
                                    <option key={book?.id} value={book?.id}>
                                      {book?.book_name}
                                    </option>
                                  ))}
                                </select>
                              </span>

                              {errors.book_id && (
                                <small className="fieldError">
                                  {errors.book_id.message}
                                </small>
                              )}
                            </label>
                          </div>
                          <div className="formRow">
                            {/* Class */}
                            <label className="examFieldWrap">
                              <span className="homeworkFieldLabel">
                                Class <b>*</b>
                              </span>
                              <span className="homeworkControl">
                                <GraduationCap className="examFieldIcon" size={17} />
                                <select
                                  required
                                  value={selectedClass?.id || ""}
                                >
                                  <option value="">Select Class</option>

                                  {classes && (
                                    <option value={classes.id}>
                                      {classes.class_name}
                                    </option>
                                  )}
                                </select>
                              </span>

                              {errors.class_id && (
                                <small className="fieldError">
                                  {errors.class_id.message}
                                </small>
                              )}
                            </label>
                            {/* Section */}
                            <label className="examFieldWrap">
                              <span className="homeworkFieldLabel">
                                Section <b>*</b>
                              </span>
                              <span className="homeworkControl">
                                <GraduationCap className="examFieldIcon" size={17} />
                                <select
                                  required
                                  value={selectedSection?.id || ""}
                                  onChange={handleSectionChange}
                                >
                                  <option value="">Select Section</option>
                                  {sections?.map((section) => (
                                    <option key={section?.id} value={section?.id}>
                                      {section?.section_name}
                                    </option>
                                  ))}
                                </select>
                              </span>
                              {errors.section_id && (
                                <small className="fieldError">
                                  {errors.section_id.message}
                                </small>
                              )}
                            </label>
                          </div>
                          <div className="formRow">
                            {/* Test */}
                            <label className="examFieldWrap">
                              <span className="homeworkFieldLabel">
                                Test <b>*</b>
                              </span>
                              <span className="homeworkControl">
                                <ListChecks className="examFieldIcon" size={16} />
                                <select
                                  required
                                  value={selectedTests?.id || ""}
                                  onChange={handleTestChange}
                                >
                                  <option value="">Select Test</option>

                                  {tests?.map((test) => (
                                    <option key={test?.id} value={test?.id}>
                                      {test?.test_name}
                                    </option>
                                  ))}
                                </select>
                              </span>

                              {errors.test_template_id && (
                                <small className="fieldError">
                                  {errors.test_template_id.message}
                                </small>
                              )}
                            </label>
                          </div>
                          <div className="formRow examScheduleFields" data-section="Schedule" >     
                          {/* Start Date */}
                          <label className="examFieldWrap">
                            <span className="homeworkFieldLabel">
                              Start Date <b>*</b>
                            </span>
                            <span className="homeworkControl">
                              <CalendarDays
                                className="examFieldIcon"
                                size={16}
                              />
                              <input
                                type="date"
                                {...register("start_date", {
                                  required: "Start date is required",
                                })}
                              />
                            </span>
                            {errors.start_date && (
                              <small className="fieldError">
                                {errors.start_date.message}
                              </small>
                            )}
                          </label>
                        {/* End Date */}
                          <label className="examFieldWrap">
                            <span className="homeworkFieldLabel">
                              End Date <b>*</b>
                            </span>

                            <span className="homeworkControl">
                              <CalendarDays
                                className="examFieldIcon"
                                size={16}
                              />

                              <input
                                type="date"
                                {...register("end_date", {
                                  required: "End date is required",
                                  validate: (value) => {
                                    const startDate = watch("start_date");

                                    if (!startDate || !value) {
                                      return true;
                                    }

                                    return (
                                      value >= startDate ||
                                      "End date must be after or equal to start date"
                                    );
                                  },
                                })}
                              />
                            </span>

                            {errors.end_date && (
                              <small className="fieldError">
                                {errors.end_date.message}
                              </small>
                            )}
                          </label>
                          </div>
                          <div className="examSubmitBar">
                            <div className="examSubmitHint">
                              <CheckCircle2 size={18} />
                          <span>
                            <strong>Ready to create</strong>
                            <small>
                              Review the test details before saving the test.
                            </small>
                          </span>
                        </div>
                        <button
                          className="createExamButton"
                          type="submit"
                          disabled={loading}
                        >
                          <span>Create Test & Exam</span>
                          <ChevronRight size={18} />
                        </button>


                          </div>
                      </form>

                      </>
                    )}
                  </div>
                  {/* Preview */}
                  <section className="panel examPreview">
                    <div className="panelHeader">
                      <h2>
                        <FileText size={22} /> Exam Preview
                      </h2>
                    </div>
                    <div className="examPreviewCard">
                      <span className="examPreviewTitleIcon">
                        <FileText size={22} />
                      </span>
                      <div className="examPreviewEyebrow">
                        <span>{selectedTests?.type || "Assessment"}</span>
                      </div>
                      <strong>
                        {selectedTests?.test_name || "Select a test"}
                      </strong>
                      <p>
                        {selectedBook?.book_name || "Select a book"} ·{" "}
                        {selectedClass?.class_name || "Select a class"}
                      </p>
                    </div>
                    <section className="examCardQuestionList examPreviewQuestionList">
                      <header>
                        <strong>
                          {selectedTests?.type || "Test"} Questions
                        </strong>
                        <small>
                          {selectedTests?.questions?.length || 0} questions
                        </small>
                      </header>
                      {selectedTests?.questions?.length ? (
                        selectedTests.questions.map((question, index) => {
                          const options = ["a", "b", "c", "d"]
                            .filter((option) => question[option])
                            .map(
                              (option) =>
                                `${option.toUpperCase()}) ${question[option]}`,
                            );

                          return (
                            <article key={question.id || index}>
                              <b>{index + 1}</b>
                              <div>
                                <small>
                                  {question.marks}{" "}
                                  {Number(question.marks) === 1
                                    ? "mark"
                                    : "marks"}
                                </small>
                                <strong>{question.question}</strong>
                                {options.length > 0 && (
                                  <p>{options.join(" · ")}</p>
                                )}
                              </div>
                            </article>
                          );
                        })
                      ) : (
                        <p>
                          {selectedTests
                            ? "No questions are available for this test."
                            : "Select a test to preview its questions."}
                        </p>
                      )}
                    </section>
                    <div className="homeworkMeta">
                      <div>
                        <CalendarDays size={17} />
                        <span>Start date</span>
                        <strong>
                          {startDate ? formatDueDate(startDate) : "Not set"}
                        </strong>
                      </div>
                      <div>
                        <CalendarDays size={17} />
                        <span>End date</span>
                        <strong>
                          {endDate ? formatDueDate(endDate) : "Not set"}
                        </strong>
                      </div>
                      <div>
                        <Gauge size={17} />
                        <span>Question source</span>
                        <strong>Manual</strong>
                      </div>
                    </div>
                    <div className="examPreviewSummary">
                      <div>
                        <CheckCircle2 size={19} />
                        <span>
                          <strong>Test configuration ready</strong>
                          <small>Review details before saving the test.</small>
                        </span>
                      </div>
                    </div>
                  </section>
                </section>
                {/* Assigned Assessment */}
                <section className="examListGrid">
                  {assignedAssessment?.map((test) => {
                    return (
                      <article
                        className="panel featureCard examCard"
                        key={test.id}
                      >
                        <div className="examCardTop">
                          <div className="examCardIcon">
                            <FileText size={20} />
                          </div>
                          <div className="examCardTitle">
                            <span>
                              {test?.book?.book_name} ·
                              {test?.test_template?.type}
                            </span>
                            <strong>{test?.test_template?.test_name}</strong>
                          </div>
                        </div>
                        <div className="examCardSchedule">
                          <CalendarDays size={16} />
                          <span>Start: {formatDueDate(test?.start_date)}</span>
                          <i />
                          <CalendarDays size={16} />
                          <span>End: {formatDueDate(test?.end_date)}</span>
                        </div>
                        <div className="examCardActions">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAssessment(test);
                            }}
                          >
                            View Questions
                          </button>
                          <button
                          type="button"
                          className="examPrimaryAction"
                          onClick={() => handleStatusChange(test)}
                        >
                          {test?.status === "active" ? "active" : "inactive"}
                        </button>
                          <button
                            className="examDeleteAction"
                            type="button"
                            onClick={() => {
                              handleDelete(test?.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </section>
              </div>
            ) : (
              // Submitted Assessments
              <div
                className="assessmentSwipePane"
                role="tabpanel"
                aria-hidden="false"
              >
                <section className="studentShell">
                  <div className="studentAssessmentWorkspace">
                    <div
                      className="submissionSearchPanel assessmentSubmissionSearch"
                      aria-label="Filter submitted assessments"
                    >
                      <label>
                        Subject
                        <select onChange={handleTeacherSubjectChange} >
                          <option value="">Select Subject</option>
                          {subjects?.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.subject_name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Book
                        <select value={selectedTeacherBook?.id || ""} onChange={handleTeacherBookChange}>
                          <option value="">Select Book</option>
                          {teacherBooks?.map((book) => (
                            <option key={book.id} value={book.id}>
                              {book.book_name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Class
                        <select>
                          <option value="">Select Class</option>
                          <option key={teacherClass.id} value={teacherClass.id}>
                            {teacherClass.class_name}
                          </option>
                        </select>
                      </label>
                      <label>
                        Section
                        <select
                          value={selectedTeacherSection?.id || ""}
                          onChange={handleTeacherSectionChange}
                        >
                          <option value="">Select Section</option>
                          {teacherSection?.map((section) => (
                            <option key={section.id} value={section.id}>
                              {section.section_name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button type="submit" aria-label="Search submitted assessments" onClick={handleSubmittedAssessmentSearch}>
                        <SearchCheck size={19} /> Find submissions
                      </button>
                    </div>
                    <aside className="studentAssessmentList" aria-label="Submitted assessments">
                      <header>
                        <span><ListChecks size={18} /></span>
                        <div>
                          <strong>Student submissions</strong>
                          <small>Choose a submission to review</small>
                        </div>
                        <em>{submittedAttempts.length}</em>
                      </header>
                      {submittedAttempts.map(({ assessment, attempt }, index) => {
                        const itemKey = `${assessment.id}-${attempt.id}`;
                        const template = assessment.test_template || {};
                        const assessmentType = template.type || (attempt.answers?.some((answer) => answer.question?.a != null) ? "Objective" : "Subjective");
                        const active = itemKey === (selectedSubmittedAttemptKey || `${submittedAttempts[0]?.assessment.id}-${submittedAttempts[0]?.attempt.id}`);

                        return (
                          <button
                            type="button"
                            className={active ? "active" : ""}
                            aria-pressed={active}
                            key={itemKey}
                            onClick={() => setSelectedSubmittedAttemptKey(itemKey)}
                          >
                            <span><FileText size={18} /><i>{index + 1}</i></span>
                            <div>
                              <strong>{attempt?.student?.student_name}</strong>
                              <strong>{template.test_name || `${assessmentType} ${assessment.id}`}</strong>
                              <small>{assessmentType} · {template.book?.book_name || "Book not specified"}</small>
                              <p><CalendarDays size={12} /> {formatDueDate(assessment.start_date)} – {formatDueDate(assessment.end_date)} · Student {attempt.student_id}</p>
                            </div>
                            <em className="submitted">{attempt.is_teacher_checked === "checked" ? "Checked" : "Submitted"}</em>
                          </button>
                        );
                      })}
                    </aside>

                    {loading && !submittedAttempts.length ? (
                      <article className="submittedSelectionEmpty" role="status">
                        <span><Clock3 size={27} /></span>
                        <h3>Loading submissions</h3>
                      </article>
                    ) : actionStatus?.type === "error" && !submittedAttempts.length ? (
                      <article className="submittedSelectionEmpty" role="alert">
                        <span><X size={27} /></span>
                        <h3>Unable to load submissions</h3>
                        <p>{actionStatus.message}</p>
                      </article>
                    ) : selectedSubmittedRecord ? (
                      <article className="studentAssessmentCard submittedAssessmentDetail">

                        {(() => {
                          const { assessment, attempt } = selectedSubmittedRecord;
                          const template = assessment.test_template || {};
                          const assessmentType = template.type || (attempt.answers?.some((answer) => answer.question?.a != null) ? "Objective" : "Subjective");
                          const assessmentTitle = template.test_name || `${assessmentType} ${assessment.id}`;
                          const answers = attempt.answers || [];

                          return (
                            <>
                              <header>
                                <div>
                                  <small>{assessmentType} · {template.book?.book_name || "Book not specified"}</small>
                                  <h2>{assessmentTitle}</h2>
                                </div>
                                <span>
                                  {attempt.is_teacher_checked === "checked" ? "Checked" : "Submitted"}
                                </span>
                              </header>

                              <div className="studentAssessmentMetrics">
                                <div><FileText size={17} /><span>Type<strong>{assessmentType.toLowerCase()}</strong></span></div>
                                <div><CalendarDays size={17} /><span>Start Date<strong>{formatDueDate(assessment.start_date)}</strong></span></div>
                                <div><CalendarDays size={17} /><span>End Date<strong>{formatDueDate(assessment.end_date)}</strong></span></div>
                              </div>

                              <div className="studentAssessmentSubmitted">
                                <CheckCircle2 size={18} />
                                <span>
                                  <strong>Assessment submitted</strong>
                                  <small>Score: {attempt.obtained_marks ?? 0} / {attempt.total_marks ?? 0}</small>
                                </span>
                              </div>

                              <form onSubmit={handleUpdateSubmittedMarks}>
                                <section className="studentAssessmentQuestions" aria-label="Submitted assessment questions">
                                  {answers.map((answer, index) => {
                                    const question = answer.question || {};
                                    const questionKey = `${attempt.id}-${answer.question_id}`;
                                    const selectedOption = answer.answer?.toUpperCase();
                                    const correctOption = question.answer?.toUpperCase();
                                    const options = ["a", "b", "c", "d"]
                                      .filter((letter) => question[letter] != null && question[letter] !== "");

                                    return (
                                      <fieldset key={answer.id || questionKey}>
                                        <legend>
                                          <b>{index + 1}</b>
                                          <span>
                                            <small>{assessmentType}</small>
                                            {question.question || `Question ${index + 1}`}
                                            <small>{question.marks} {question.marks === 1 ? "mark" : "marks"}</small>
                                          </span>
                                        </legend>
                                        {options.length ? (
                                          <div className="studentAssessmentOptions">
                                            {options.map((letter) => {
                                              const option = letter.toUpperCase();
                                              const isSelected = selectedOption === option;
                                              const isCorrect = correctOption === option;

                                              return (
                                                <label
                                                  className={isCorrect ? "assessment-correct" : isSelected ? "assessment-wrong" : ""}
                                                  key={letter}
                                                >
                                                  <input type="radio" checked={isSelected} readOnly name={`answer-${attempt.id}-${answer.question_id}`} />
                                                  <span>
                                                    {option}. {question[letter]}
                                                    {isCorrect ? " · Correct answer" : isSelected ? " · Student answer" : ""}
                                                  </span>
                                                </label>
                                              );
                                            })}
                                          </div>
                                        ) : (
                                          <textarea
                                            value={answer.answer || "No answer provided."}
                                            readOnly
                                            aria-label={`Student answer to question ${index + 1}`}
                                          />
                                        )}
                                        <label className="submittedQuestionMarks">
                                          Awarded marks
                                          <span>
                                            <input
                                              type="number"
                                              min="0"
                                              max={Number(question.marks) || 0}
                                              // step="0.5"
                                              required
                                              value={questionMarks[questionKey] ?? answer.marks_obtained ?? 0}
                                              onChange={(event) => setQuestionMarks((current) => ({ ...current, [questionKey]: event.target.value }))}
                                              aria-label={`Marks awarded for question ${index + 1}`}
                                            />
                                            <b>/ {question.marks ?? 0}</b>
                                          </span>
                                        </label>
                                      </fieldset>
                                    );
                                  })}
                                </section>
                                <footer className="submittedMarksActions">
                                  <button type="submit" disabled={loading}>
                                    <CheckCircle2 size={17} /> {loading ? "Updating..." : "Update marks"}
                                  </button>
                                </footer>
                              </form>
                            </>
                          );
                        })()}
                      </article>
                    ) : (
                      <article className="submittedSelectionEmpty" role="status">

                        <span><ListChecks size={27} /></span>
                        <h3>No submitted assessments</h3>
                        <p>Student submissions will appear here when they are received.</p>
                      </article>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </section>
      {selectedAssessment &&
        createPortal(
          <div
            className="examQuestionsModalBackdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget)
                setSelectedAssessment(null);
            }}
          >
            <section
              className="examQuestionsModal"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedAssessment.test_template?.test_name || "Assessment"} questions`}
            >
              <header>
                <span className="examQuestionsModalIcon">
                  <ListChecks size={23} />
                </span>
                <div>
                  <small>
                    {selectedAssessment.book?.book_name} ·{" "}
                    {selectedAssessment.test_template?.type}
                  </small>
                  <h2>Assigned Questions</h2>
                  <p>{selectedAssessment.test_template?.test_name}</p>
                </div>
                <em>
                  {selectedAssessment.test_template?.questions?.length || 0}{" "}
                  Questions
                </em>
                <button
                  type="button"
                  aria-label="Close questions"
                  onClick={() => setSelectedAssessment(null)}
                >
                  <X size={19} />
                </button>
              </header>
              <section className="examCardQuestionList">
                <header>
                  <div>
                    <strong>Question Paper</strong>
                    <small>
                      Starts {formatDueDate(selectedAssessment.start_date)} ·
                      Ends {formatDueDate(selectedAssessment.end_date)}
                    </small>
                  </div>
                </header>
                {selectedAssessment.test_template?.questions?.length ? (
                  selectedAssessment.test_template.questions.map(
                    (question, index) => {
                      const options = ["a", "b", "c", "d"]
                        .filter((option) => question[option])
                        .map(
                          (option) =>
                            `${option.toUpperCase()}) ${question[option]}`,
                        );
                      const correctAnswer = question.answer?.toLowerCase();

                      return (
                        <article key={question.id || index}>
                          <b>{index + 1}</b>
                          <div>
                            <small>
                              {selectedAssessment.test_template?.type ||
                                "Question"}{" "}
                              · {question.marks}{" "}
                              {Number(question.marks) === 1 ? "mark" : "marks"}
                            </small>
                            <strong>{question.question}</strong>
                            {options.length > 0 && (
                              <p className="examQuestionOptions">
                                {options.join(" · ")}
                              </p>
                            )}
                            {correctAnswer && question[correctAnswer] && (
                              <p className="examQuestionAnswer">
                                Correct answer: {correctAnswer.toUpperCase()}){" "}
                                {question[correctAnswer]}
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    },
                  )
                ) : (
                  <p>No questions are attached to this assessment.</p>
                )}
              </section>
              <footer>
                <span>
                  <CheckCircle2 size={17} /> Assessment questions ready
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedAssessment(null)}
                >
                  Close
                </button>
              </footer>
            </section>
          </div>,
          document.querySelector(".teacherShell") || document.body,
        )}
    </section>
  );
}
