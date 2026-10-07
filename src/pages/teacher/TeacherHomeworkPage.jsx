import { useState } from 'react';
import { Clock3, Gauge, FileCheck2, CheckCircle2, ClipboardCheck, PenLine, Sparkles, FileText, Paperclip, BookOpen, CalendarDays, GraduationCap, Layers3, Plus, Send } from '../../icons/index.js';

export default function TeacherHomeworkPage() {
  const [creationMode, setCreationMode] = useState('manual');
  const [questionType, setQuestionType] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState('create');

  async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const data = {
    creationMode: formData.get("creationMode"),
    title: formData.get("title"),
    subject: formData.get("subject"),
    className: formData.get("className"),
    section: formData.get("section"),
    homeworkType: formData.get("homeworkType"),
    dueDate: formData.get("dueDate"),
    questionType: formData.get("questionType") === "__custom"
      ? formData.get("customCategory").trim()
      : formData.get("questionType"),
    question: formData.get("question"),
    options: formData.getAll("option"),
    homeworkPdf: formData.get("homeworkPdf"),
  };

  console.log(data);
}


  return (
    <div className="teacherHomeworkWorkspace" id="akAssignmentStudio">

      {/* Cards  */}
      <section className="assignmentSummaryGrid" aria-label="Assignment overview">
        <article className="assignmentSummaryCard violet">
          <span className="assignmentSummaryIcon"><ClipboardCheck size={18} /></span>
          <strong>0</strong><h3>New homework</h3><p>Recently assigned</p>
        </article>
        <article className="assignmentSummaryCard amber">
          <span className="assignmentSummaryIcon"><Clock3 size={18} /></span>
          <strong>0</strong><h3>Pending</h3><p>To be completed</p>
        </article>
        <article className="assignmentSummaryCard green">
          <span className="assignmentSummaryIcon"><CheckCircle2 size={18} /></span>
          <strong>0</strong><h3>Submitted</h3><p>Student responses</p>
        </article>
        <article className="assignmentSummaryCard pink">
          <span className="assignmentSummaryIcon"><Gauge size={18} /></span>
          <strong>00</strong><h3>Overdue</h3><p>Need attention</p>
        </article>
      </section>

      <section className="homeworkSwipeWorkspace">
           {/* Upper side container  */}
        <header className="homeworkSwipeHeader">
          <div>
            <span>HOMEWORK WORKSPACE</span>
            <h2>Manage classroom work</h2>
            <p>Create homework and review student responses.</p>
          </div>
        </header>
          {/* Create and Submited Work  button */}
        <div className="homeworkSwipeTabs" role="group" >
          <button
            type="button"
            className={`homeworkbothTab ${activeWorkspace === 'create' ? 'active' : ''}`}
            onClick={() => setActiveWorkspace('create')}
          >
            <div className="homeworkCreateTab">
              <div className="homeworkCreateTabIcon"><span><ClipboardCheck size={25} /></span></div>
              <div className="homeworkCreateTabNote">
                <span>Create Homework</span><span>Create and manage assignments</span>
              </div>
            </div>
          </button>
          <button
            type="button"
            className={`homeworkbothTab ${activeWorkspace === 'submitted' ? 'active' : ''}`}
            onClick={() => setActiveWorkspace('submitted')}
          >
            <div className="homeworkCreateTab">
              <div className="homeworkCreateTabIcon"><span><FileCheck2 size={25} /></span></div>
              <div className="homeworkCreateTabNote">
                <span>Submitted Work</span><span>Review student responses</span>
              </div>
            </div>
          </button>
        </div>


      {/* Creation  container */}
        <div id="create-homework-workspace" hidden={activeWorkspace !== 'create'}>
        <section className="createHomeworkModule">
          <div className="teacherGrid">
            <div className="panel assignForm createHomeworkForm">
                {/* card header  */}
              <div className="panelHeader">
                <h2><ClipboardCheck size={22} /> Create Homework</h2>
                <span>{creationMode === 'manual' ? 'Ready to assign' : 'Ready to generate'}</span>
              </div>
              {/* Create Manually and Ai Button  */}
              <div className="homeworkCreationModes" role="group" >
                <button
                  type="button"
                  className={creationMode === 'manual' ? 'active' : ''}
                  onClick={() => setCreationMode('manual')}
                >
                  <PenLine size={17} /> Create Manually
                </button>
                <button
                  type="button"
                  className={creationMode === 'ai' ? 'active' : ''}
                  onClick={() => setCreationMode('ai')}
                >
                  <Sparkles size={17} /> Create with AI
                </button>
              </div>

              {/* Shared homework details for manual and AI creation */}
              <form
                id="homeworkForm"
                className="assignForm"
                aria-label="Create homework"
                onSubmit={handleSubmit}
                onReset={() => setQuestionType('')}>
              <input type="hidden" name="creationMode" value={creationMode} />
              <section className="homeworkCreationStep" >
                <div className="formRow homeworkIconRow">
                  <label>
                    <span className="homeworkFieldLabel">Title <b>*</b></span>
                    <span className="homeworkControl">
                      <FileText size={17} /><input type="text" name="title" required placeholder="Enter homework title" />
                    </span>
                  </label>
                   <label>
                    <span className="homeworkFieldLabel">Subject <b>*</b></span>
                    <span className="homeworkControl">
                      <BookOpen size={17} />
                      <select name="subject" required defaultValue="">
                        <option value="" disabled>Select Subject</option>
                      </select>
                    </span>
                  </label>
                </div>
                <div className="formRow homeworkIconRow">
                  <label>
                    <span className="homeworkFieldLabel">Class <b>*</b></span>
                    <span className="homeworkControl">
                      <GraduationCap size={17} />
                      <select name="className" required defaultValue="">
                      <option value="" disabled>Select Class</option>
                      </select>
                    </span>
                  </label>
                   <label>
                    Section
                    <span className="homeworkControl">
                      <Layers3 size={17} />
                      <select name="section" defaultValue=""><option value="">Select Section</option></select>
                    </span>
                  </label>
                </div>
                <div className="formRow homeworkIconRow">
                 <label>
                    Homework Type
                    <span className="homeworkControl">
                      <Layers3 size={17} />
                      <select name="homeworkType" defaultValue="Reading">
                        <option>Reading</option>
                        <option>Written</option>
                        <option>Revision</option>
                      </select>
                    </span>
                  </label>
                   <label>
                    <span className="homeworkFieldLabel">Due Date <b>*</b></span>
                    <span className="homeworkControl"><CalendarDays size={16} /><input type="date" name="dueDate" required /></span>
                  </label>
                </div>
              </section>

              {/* Only the mode-specific content slides. */}
              <div className={`homeworkSwipeViewport showing-${creationMode}`}>
                <div className="homeworkSwipeTrack">
                  {/* Question Section  and Pdf attachment */}
                  <div id="manual-homework-panel" className="homeworkSwipePane"  >
                      <div className="homeworkCreationStep" >
                        {/* Question Section  */}
                        <div className="homeworkQuestionList">
                          <div className="homeworkQuestionHeading">
                            <span>Questions <b>*</b></span>
                            <button type="button"><Plus size={16} /> Add Question</button>
                          </div>
                          <div className="homeworkQuestionWorkspace">
                            <div className="homeworkQuestionEditors">
                              <div className="homeworkQuestionItem">
                                <span className="homeworkQuestionNumber">1</span>
                                <div className="homeworkQuestionContent">
                                  <div className="homeworkQuestionTopRow">
                                    <label className="homeworkQuestionType">
                                      Question Type
                                      <select name="questionType" value={questionType} onChange={(event) => setQuestionType(event.target.value)} disabled={creationMode !== 'manual'}>
                                        <option value="" disabled>Select the Type</option>
                                        <option>MCQ</option>
                                        <option>True / False</option>
                                        <option>Fill in the Blank</option>
                                        <option>Short Answer</option>
                                        <option>Long Answer</option>
                                        <option>Case-Based Answer</option>
                                        <option value="__custom">+ Create New Category</option>
                                      </select>
                                    </label>
                                    
                                  </div>
                                  {questionType === '__custom' && (
                                    <label className="homeworkCustomCategory">
                                      Custom Category Name
                                      <input
                                        type="text"
                                        name="customCategory"
                                        placeholder="e.g. Diagram-Based Questions"
                                        maxLength={40}
                                        title="Enter a category name containing at least one non-space character."
                                        required
                                        disabled={creationMode !== 'manual'}
                                      />
                                    </label>
                                  )}
                                  <label>Question<textarea name="question" required={creationMode === 'manual'} disabled={creationMode !== 'manual'} maxLength={1000} placeholder="Enter question 1..." /></label>
                                  {questionType === 'MCQ' && (
                                    <div className="homeworkMcqOptions">
                                      <label><span>A</span><input type="text" name="option" placeholder="Enter option A" required disabled={creationMode !== 'manual'} /></label>
                                      <label><span>B</span><input type="text" name="option" placeholder="Enter option B" required disabled={creationMode !== 'manual'} /></label>
                                      <label><span>C</span><input type="text" name="option" placeholder="Enter option C" required disabled={creationMode !== 'manual'} /></label>
                                      <label><span>D</span><input type="text" name="option" placeholder="Enter option D" required disabled={creationMode !== 'manual'} /></label>
                                    </div>
                                  )}
                                  {questionType === 'True / False' && ( 
                                    <div className="homeworkMcqOptions"> 
                                    <label><span>A</span><input type="text" name="option" value="True" readOnly disabled={creationMode !== 'manual'} />
                                    </label> 
                                    <label><span>B</span><input type="text" name="option" value="False" readOnly disabled={creationMode !== 'manual'} /></label> </div> 
                                  )}
                                  <button className="homeworkSaveQuestion" type="button">
                                    <CheckCircle2 size={16} /> Save Question
                                  </button>
                                </div>
                                <small>0/1000</small>
                              </div>
                            </div>
                            <aside className="homeworkQuestionPaper">
                              <div className="homeworkQuestionPaperHeader">
                                <FileText size={18} />
                                <div><strong>Question Paper</strong><small>0 saved questions</small></div>
                              </div>
                              <div className="homeworkQuestionPaperBody">
                                <div className="homeworkQuestionPaperEmpty">
                                  <FileText size={28} /><span>Saved questions will appear here</span>
                                </div>
                              </div>
                            </aside>
                          </div>
                        </div>
                         {/* Pdf attachment  */}
                        <div className="homeworkPdfField">
                          <div>
                            <strong><Paperclip size={17} /> Attach homework PDF</strong>
                            <small>Upload a question sheet, worksheet, or reference material (PDF, maximum 10 MB).</small>
                          </div>
                          <label className="homeworkPdfButton">
                            Choose PDF<input type="file" name="homeworkPdf" accept="application/pdf,.pdf" disabled={creationMode !== 'manual'} />
                          </label>
                        </div>
                      </div>
                  </div>
                  {/* Ai generated  */}

                  <div id="ai-homework-panel" className="homeworkSwipePane"  >
                    <div id="aiHomeworkCreatorForm" className="assignForm">

                      {/* AI prompt and reference attachment */}
                      <section className="automaticCreator" aria-label="AI homework generator">
                        <strong><Sparkles size={17} /> Generate assignment details</strong>
                        <div className="automaticCreatorActions automaticCreatorComposer">
                          <label>
                            Homework Topic
                            <textarea
                              name="topic"
                              disabled={creationMode !== 'ai'}
                              rows="4"
                              placeholder="Describe the topic, class level, and what students should practice..."
                            />
                          </label>
                          <div className="homeworkPdfField">
                            <div>
                              <strong><Paperclip size={17} /> Attach reference material</strong>
                              <small>Choose a PDF or Word document to use for generation.</small>
                            </div>
                            <label className="homeworkPdfButton">
                              Choose File
                              <input type="file" name="referenceFile" accept=".pdf,.doc,.docx" disabled={creationMode !== 'ai'} />
                            </label>
                          </div>
                          <div className="automaticCreatorComposerBar">
                            <button type="button" className="automaticCreatorSendButton">
                              <Sparkles size={17} /> Generate with AI
                            </button>
                          </div>
                        </div>
                      </section>

                    </div>
                  </div>

                </div>
              </div>
  
              <button className="homeworkCreateSubmit" type="submit">
                <Send size={17} />
                {creationMode === 'manual' ? 'Assign Homework Manually' : 'Assign AI Homework'}
              </button>
              <button className="homeworkCreateCancel" type="reset">Cancel</button>
               </form>
            </div>
             {/* pdf preview  */}
            <aside className="creatorSide">
              <section className="homeworkQuestionPaper homeworkQuestionPaperSidebar">
                <div className="homeworkQuestionPaperHeader">
                  <FileText size={18} />
                  <div><strong>Question Paper</strong><small>{creationMode === 'manual' ? '0 saved questions' : '0 generated questions'}</small></div>
                </div>
                <div className="homeworkQuestionPaperBody">
                  <div className="homeworkQuestionPaperEmpty">
                    <FileText size={28} /><span>{creationMode === 'manual' ? 'Save a question to preview it here' : 'Generated questions will appear here'}</span>
                  </div>
                </div>
              </section>
              <section className="panel creatorPreview">
                <div className="panelHeader">
                  <h2><FileText size={22} /> Homework Preview</h2>
                </div>
                <div className="homeworkTop">
                  <div><span>Homework</span>
                <strong>No active homework draft</strong>
                  </div>
                </div>
                <p>No questions added yet.</p>
                <div className="homeworkMeta">
                  <div><span>Class</span><strong>—</strong></div>
                  <div><span>Subject</span><strong>—</strong></div>
                  <div><span>Due Date</span><strong>—</strong></div>
                  <div><span>Total Marks</span><strong>0</strong></div>
                  <div><span>Type</span><strong>Assignment</strong></div>
                </div>
              </section>

            </aside>
          </div>
        </section>

        </div>

        {/* Submitted work */}
        <div id="submitted-homework-workspace" hidden={activeWorkspace !== 'submitted'}>
          <section className="reviewModule" >
            <div className="featureHero homeworkHero">
              <div className="featureIcon"><FileCheck2 size={34} /></div>
              <div>
                <h2>Submitted Work</h2>
                <p>Review student answers, attachments, and submission details.</p>
              </div>
              <span>0 Submitted</span>
            </div>

            <div className="homeworkReviewWorkspace">
              <aside className="homeworkWorkList">
                <header>
                  <div>
                    <strong>All Student Work</strong>
                    <small>Submitted and reviewed homework</small>
                  </div>
                  <span>0</span>
                </header>
                <div className="emptyHomework">
                  <strong>No submitted work yet</strong>
                  <p>Student submissions will appear here.</p>
                </div>
              </aside>

              <section className="panel homeworkEmptyState">
                <FileCheck2 size={44} />
                <strong>Submission Preview</strong>
                <p>Select a submission to view the student's answers and attached work.</p>
              </section>
            </div>


          </section>
        </div>
      


      </section>
    </div>
  );
}
