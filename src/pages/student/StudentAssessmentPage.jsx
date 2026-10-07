import {
  CalendarDays,
  CheckCircle2,
  FileText,
  ListChecks,
} from '../../icons/index.js';

import { useStudentAssessment } from "../../context/StudentAssessmentContext.jsx";
import { useStudent } from "../../context/StudentContext.jsx";
import { useEffect, useState } from 'react';
import { formatDueDate } from '../../utils/formatters.js';

export default function StudentAssessmentPage() {
  const { studentDetails } = useStudent();
  const { assessment = [], questions = [], questionsLoading, actionStatus, loading, attemptAnswer, fetchAssessment, fetchTestQuestions, createStudentAttempt, fetchAttemptAnswer } = useStudentAssessment();
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const teacherId = studentDetails?.teacher?.id;
  const classId = studentDetails?.class?.id;
  const sectionId = studentDetails?.section?.id;

  // Getting Date
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Fetching Assessment
  useEffect(() => {
    if (teacherId && classId && sectionId) {
      fetchAssessment(teacherId, classId, sectionId);
    }
  }, [teacherId, classId, sectionId]);

  // Selected Assessment
  const selectedAssessment = assessment?.find(
    (item) => item.id === selectedAssessmentId,
  );   

  // Selected Attempt
  const studentId = studentDetails?.id;
  const selectedAttempt = selectedAssessment?.student_assessment_attempts?.find(
    (attempt) => Number(attempt.student_id) === Number(studentId),
  );

  useEffect(() => {
    if (selectedAttempt?.is_submitted === 'submitted' && selectedAttempt.id) {
      fetchAttemptAnswer(selectedAttempt.id);
    }
  }, [selectedAttempt?.id, selectedAttempt?.is_submitted]);

  const submittedAnswers = Array.isArray(attemptAnswer)
    ? attemptAnswer.filter((item) => Number(item.attempt_id) === Number(selectedAttempt?.id))
    : [];

  // Assessment Status
  const isSubmitted = selectedAttempt?.is_submitted === 'submitted';
  const isWithinDateRange = (item) => today >= item.start_date && today <= item.end_date;

  const getStatus = (item) => {
    const attempt = item.student_assessment_attempts?.find(
      (entry) => Number(entry.student_id) === Number(studentId),
    );
    if (attempt?.is_submitted === 'submitted') {
      return attempt?.is_teacher_checked === 'checked' ? 'Checked' : 'Submitted';
    }
    if (today < item.start_date) return 'Upcoming';
    if (today > item.end_date) return 'Expired';
    if (attempt?.is_submitted === 'pending') return 'Pending';
    return item.status === 'active' ? 'Active' : 'Inactive';
  };

  const canSubmit = selectedAssessment?.status === 'active'

    && isWithinDateRange(selectedAssessment)
    && !isSubmitted;

  const submitAssessment = async () => {
    if (!canSubmit || !studentId || !selectedAssessment) return;
    setSubmitting(true);
    const payload = {
      answers: questions.map((question) => {
        const questionId = question.id ?? question.question_id;
        return {
          question_id: questionId,
          answer: selectedAssessment.test_template?.type?.toLowerCase() === 'objective'
            ? (answers[questionId] || '').toUpperCase()
            : answers[questionId] || '',
        };
      }),
    };

    const submitted = await createStudentAttempt(selectedAssessment.id, studentId, payload);
    if (submitted){
      fetchAssessment(teacherId, classId, sectionId);
    } 
    setSubmitting(false);
  };
 
  // Select Assessment and fetching their questions
  const selectAssessment = (item) => {
    const hasSubmitted = item.student_assessment_attempts?.some(
      (attempt) => Number(attempt.student_id) === Number(studentId) && attempt.is_submitted === 'submitted',
    );
    if (!isWithinDateRange(item) && !hasSubmitted) return;
    setSelectedAssessmentId(item.id);
    setAnswers({});
    fetchTestQuestions(item.id);
  }; 

  return (
    <section className="studentAssessmentPage">
      <header className="studentAssessmentHero">
        <span className="studentAssessmentHeroIcon"><ListChecks size={30} /></span>
        <div className="studentAssessmentHeroCopy">
          <small>MY ASSESSMENTS</small>
          <h2>Assigned Tests &amp; Exams</h2>
          <p>Review your assigned assessments and their deadlines.</p>
          <div>
            <span><CheckCircle2 size={13} /> Track progress</span>
            <span><CalendarDays size={13} /> View deadlines</span>
          </div>
        </div>
        <div className="studentAssessmentHeroArtwork" aria-hidden="true">
          <span><FileText size={26} /></span>
          <i><CalendarDays size={19} /></i>
          <b><CheckCircle2 size={18} /></b>
        </div>
        <em>{assessment.length}<small>Available</small></em>
      </header>

      <div className="studentAssessmentWorkspace">
        <aside className="studentAssessmentList">
          <header>
            <span><ListChecks size={18} /></span>
            <div><strong>Your Assessments</strong><small>Select a test to view its details</small></div>
            <em>{assessment.length}</em>
          </header>
          {assessment.map((item, index) => {
            const test = item.test_template || {};
            const status = getStatus(item);
            const active = item.id === selectedAssessment?.id;
            const canSelect = isWithinDateRange(item) || item.student_assessment_attempts?.some(
              (attempt) => Number(attempt.student_id) === Number(studentId) && attempt.is_submitted === 'submitted',
            );

            return (
              <button
                type="button"
                className={active ? 'active' : ''}
                aria-pressed={active}
                disabled={!canSelect}
                key={item.id}
                onClick={() => selectAssessment(item)}
              >
                <span><FileText size={18} /><i>{index + 1}</i></span>
                <div>
                  <strong>{test.test_name || 'Untitled assessment'}</strong>
                  <small>{test.type || 'Assessment'} · {item.book?.book_name || 'Book not specified'}</small>
                  <p><CalendarDays size={12} /> {formatDueDate(item.start_date)} – {formatDueDate(item.end_date)}</p>
                </div>
                <em className={['submitted', 'checked'].includes(status.toLowerCase()) ? 'submitted' : ''}>{status}</em>
              </button>
            );
          })}
        </aside>

        {loading && !assessment.length ? (
          <article className="studentAssessmentCard" role="status">Loading assessments...</article>
        ) : actionStatus?.type === 'error' && !assessment.length ? (
          <article className="studentAssessmentCard" role="alert">{actionStatus.message}</article>
        ) : selectedAssessment ? (
          <article className="studentAssessmentCard">
            <header>
              <div>
                <small>{selectedAssessment.test_template?.type || 'Assessment'} · {selectedAssessment.book?.book_name || 'Book not specified'}</small>
                <h2>{selectedAssessment.test_template?.test_name || 'Untitled assessment'}</h2>
              </div>
              <span className={isSubmitted ? 'submitted' : ''}>{getStatus(selectedAssessment)}</span>
            </header>

            <div className="studentAssessmentMetrics">
              <div><FileText size={17} /><span>Type<strong>{selectedAssessment.test_template?.type || 'Assessment'}</strong></span></div>
              <div><CalendarDays size={17} /><span>Start Date<strong>{formatDueDate(selectedAssessment.start_date)}</strong></span></div>
              <div><CalendarDays size={17} /><span>End Date<strong>{formatDueDate(selectedAssessment.end_date)}</strong></span></div>
            </div>
            {isSubmitted && selectedAttempt && (
              <div className="studentAssessmentSubmitted">
                <CheckCircle2 size={18} />
                <span>
                  <strong>Assessment submitted</strong>
                  <small>{selectedAssessment?.test_template?.type?.toLowerCase() === 'subjective'
                    ? (selectedAttempt?.is_teacher_checked === 'checked' ? (`Score: ${selectedAttempt.obtained_marks} / ${selectedAttempt.total_marks}`) : (`Waiting for teacher evaluation`) )
                    : `Score: ${selectedAttempt.obtained_marks} / ${selectedAttempt.total_marks}`}</small>
                </span>
              </div>
            )}

            <section className="studentAssessmentQuestions" aria-label="Assessment questions">
              {questionsLoading ? (
                <p role="status">Loading questions...</p>
              ) : actionStatus?.type === 'error' ? (
                <p role="alert">{actionStatus.message}</p>
              ) : questions.length ? (
                questions.map((question, index) => {
                  const options = ['a', 'b', 'c', 'd']
                    .map((letter) => ({ letter, value: question[letter] }))
                    .filter((option) => option.value != null && option.value !== '');
                  const isObjective = selectedAssessment.test_template?.type?.toLowerCase() === 'objective';
                  const questionId = question.id ?? question.question_id ?? index;
                  const canAnswer = selectedAssessment.status === 'active' && isWithinDateRange(selectedAssessment) && !isSubmitted;
                  const questionAttempt = submittedAnswers.find((item) => Number(item.question_id) === Number(questionId));
                  const submittedAnswer = questionAttempt?.answer?.toUpperCase();
                  const correctAnswer = question.answer?.toUpperCase();

                  return (
                    <fieldset key={questionId}>
                      <legend>
                        <b>{index + 1}</b>
                        <span><small>{question.category || (isObjective ? 'Objective' : 'Subjective')}</small>{question.question}<small>{question.marks ?? 0} marks</small></span>
                      </legend>
                      {isObjective && options.length ? (
                        <div className="studentAssessmentOptions">
                          {options.map(({ letter, value }) => {
                            const option = letter.toUpperCase();
                            const selected = isSubmitted
                              ? submittedAnswer === option
                              : answers[questionId]?.toUpperCase() === option;
                            const isCorrectOption = isSubmitted && correctAnswer === option;
                            const isWrongSelection = isSubmitted && selected && Number(questionAttempt?.is_correct) !== 1;
                            return (
                              <label
                                className={isCorrectOption ? 'assessment-correct' : isWrongSelection ? 'assessment-wrong' : ''}
                                key={`${questionId}-${letter}`}
                              >
                                <input
                                  type="radio"
                                  name={`assessment-${selectedAssessment.id}-question-${questionId}`}
                                  value={option}
                                  checked={selected}
                                  onChange={() => setAnswers((current) => ({ ...current, [questionId]: letter }))}
                                  disabled={!canAnswer || isSubmitted}
                                />
                                <span>{option}. {value}{isSubmitted && isCorrectOption ? ' · Correct answer' : isWrongSelection ? ' · Your answer' : ''}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <textarea
                          value={isSubmitted ? questionAttempt?.answer ?? answers[questionId] ?? '' : answers[questionId] || ''}
                          onChange={(event) => setAnswers((current) => ({ ...current, [questionId]: event.target.value }))}
                          disabled={!canAnswer}
                          placeholder="Write your answer..."
                        />
                      )}
                    </fieldset>
                  );
                })
              ) : (
                <p>No questions are available for this assessment.</p>
              )}
            </section>
            {canSubmit && questions.length > 0 && (
              <div className="studentAssessmentSubmitBar">
                <div>
                  <CheckCircle2 size={18} />
                  <span><strong>Ready to submit?</strong><small>Your answers will be sent for this assessment.</small></span>
                </div>
                <button type="button" onClick={submitAssessment} disabled={submitting || questionsLoading}>
                  {submitting ? 'Submitting...' : 'Submit assessment'}
                </button>
              </div>
            )}
          </article>
        ) : (
          <article className="studentAssessmentCard studentAssessmentNoSelection" role="status">
            <ListChecks size={32} />
            <h2>{assessment.length ? 'Select an assessment' : 'No assessments assigned'}</h2>
            <p>{assessment.length ? 'Choose an assessment to load its questions.' : 'Your assigned assessments will appear here.'}</p>
          </article>
        )}
      </div>
    </section>
  );
}