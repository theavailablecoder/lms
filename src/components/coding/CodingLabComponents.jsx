import { useEffect, useRef, useState } from "react";
import { Code2, FileCheck2, Play, Plus, X } from "../../icons/index.js";
import {
  codingLabs,
  phetSimulations,
  phetProjectPages,
  defaultHtmlCode,
  defaultPythonCode,
  defaultJavaCode,
  defaultSqlCode,
} from "../../data/mockData.js";
import { runPythonCode, runJavaCode, runSqlCode } from "../../utils/codeRunner.js";
import { Badge } from "../shared/SharedComponents.jsx";

const languageKeywords = {
  html: [],
  python: ["and", "as", "break", "class", "continue", "def", "elif", "else", "False", "for", "from", "if", "import", "in", "is", "lambda", "None", "not", "or", "pass", "return", "True", "try", "while", "with", "yield", "print"],
  java: ["abstract", "boolean", "break", "case", "catch", "class", "continue", "default", "do", "double", "else", "extends", "false", "final", "float", "for", "if", "implements", "import", "int", "interface", "long", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "this", "throw", "true", "try", "void", "while", "String", "System"],
  sql: ["SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP", "ALTER", "JOIN", "ON", "AS", "AND", "OR", "NOT", "NULL", "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "DISTINCT"],
};

function highlightCode(code, language) {
  const keywords = languageKeywords[language] || [];
  const keywordPattern = keywords.length ? `\\b(?:${keywords.join("|")})\\b` : "(?!)";
  const pattern = new RegExp(`(<!--[\\s\\S]*?-->|<\\/?[A-Za-z][^>]*>|\\/\\/[^\\n]*|#[^\\n]*|--[^\\n]*|\\"(?:\\\\.|[^\\"\\\\])*\\"|'(?:\\\\.|[^'\\\\])*'|${keywordPattern}|\\b\\d+(?:\\.\\d+)?\\b)`, language === "sql" ? "gi" : "g");
  return code.split(pattern).filter((token) => token !== "").map((token, index) => {
    let type = "plain";
    if (/^<!--/.test(token) || /^(\/\/|#|--)/.test(token)) type = "comment";
    else if (/^<\/?[A-Za-z]/.test(token)) type = "tag";
    else if (/^["']/.test(token)) type = "string";
    else if (/^\d/.test(token)) type = "number";
    else if (keywords.some((keyword) => language === "sql" ? keyword.toLowerCase() === token.toLowerCase() : keyword === token)) type = "keyword";
    return <span className={`syntax-${type}`} key={`${index}-${token.length}`}>{token}</span>;
  });
}

function SyntaxCodeEditor({ value, onChange, language, label }) {
  const highlightRef = useRef(null);
  const syncScroll = (event) => {
    if (!highlightRef.current) return;
    highlightRef.current.scrollTop = event.currentTarget.scrollTop;
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };
  const handleKeyDown = (event) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const { selectionStart, selectionEnd } = event.currentTarget;
    onChange(`${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`);
    requestAnimationFrame(() => {
      event.target.selectionStart = event.target.selectionEnd = selectionStart + 2;
    });
  };
  return (
    <div className="syntaxEditor">
      <pre ref={highlightRef} aria-hidden="true"><code>{highlightCode(value, language)}{"\n"}</code></pre>
      <textarea className="codeEditor syntaxCodeInput" value={value} spellCheck="false" autoCapitalize="off" autoCorrect="off" wrap="off" onChange={(event) => onChange(event.target.value)} onScroll={syncScroll} onKeyDown={handleKeyDown} aria-label={label} />
    </div>
  );
}

function CodingLabModule({ linkedHomework = null, onSubmitCodingHomework }) {
  const [selectedLab, setSelectedLab] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: "My Coding Project",
    labId: "html",
    notes: "Practice project for Coding Lab.",
  });
  
  const [labProjects, setLabProjects] = useState([]);
  const [projectStatus, setProjectStatus] = useState("");
  const [htmlCode, setHtmlCode] = useState(defaultHtmlCode);
  const [previewCode, setPreviewCode] = useState(defaultHtmlCode);
  const [pythonCode, setPythonCode] = useState(defaultPythonCode);
  const [pythonOutput, setPythonOutput] = useState(
    "Click Run Code to see Python output.",
  );
  const [javaCode, setJavaCode] = useState(defaultJavaCode);
  const [javaOutput, setJavaOutput] = useState(
    "Click Run Code to see Java output.",
  );
  const [sqlCode, setSqlCode] = useState(defaultSqlCode);
  const [sqlResult, setSqlResult] = useState(
    "Click Run Code to query the sample students table.",
  );
  const [phetTab, setPhetTab] = useState("Circuit Construction Kit AC");
  const [scratchTab, setScratchTab] = useState("ml");
  const [scratchFrameUrl, setScratchFrameUrl] = useState(
    "https://machinelearningforkids.co.uk/scratch/",
  );

  const selectLabById = (labId) => {
    const lab = codingLabs.find((item) => item.id === labId) || codingLabs[0];
    setSelectedLab(lab);
    return lab;
  };

  const getCurrentLabCode = (labId = selectedLab?.id) => {
    if (labId === "html") return htmlCode;
    if (labId === "python") return pythonCode;
    if (labId === "java") return javaCode;
    if (labId === "sql") return sqlCode;
    if (labId === "scratch")
      return `Scratch mode: ${scratchTab}\nURL: ${scratchFrameUrl}`;
    if (labId === "phet") return `PhET simulation: ${phetTab}`;
    return "";
  };

  const applyProjectCode = (project) => {
    if (project.labId === "html") {
      setHtmlCode(project.code || defaultHtmlCode);
      setPreviewCode(project.code || defaultHtmlCode);
    } else if (project.labId === "python") {
      setPythonCode(project.code || defaultPythonCode);
      setPythonOutput("Click Run Code to see Python output.");
    } else if (project.labId === "java") {
      setJavaCode(project.code || defaultJavaCode);
      setJavaOutput("Click Run Code to see Java output.");
    } else if (project.labId === "sql") {
      setSqlCode(project.code || defaultSqlCode);
      setSqlResult("Click Run Code to query the sample students table.");
    }
  };

  const createNewProject = (event) => {
    event.preventDefault();
    const lab = selectLabById(projectForm.labId);
    const project = {
      id: Date.now(),
      name: projectForm.name.trim() || `${lab.name} Project`,
      labId: lab.id,
      labName: lab.name,
      notes: projectForm.notes.trim(),
      code: getCurrentLabCode(lab.id),
      status: "Created",
      submittedAt: "",
      createdAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };
    setLabProjects((current) => [project, ...current]);
    setProjectStatus(`${project.name} created.`);
    setShowProjectForm(false);
  };

  const submitCurrentProject = () => {
    if (!selectedLab) return;
    const existingProject = labProjects.find(
      (project) => project.labId === selectedLab.id,
    );
    const submittedProject = {
      id: existingProject?.id || Date.now(),
      name: existingProject?.name || `${selectedLab.name} Submission`,
      labId: selectedLab.id,
      labName: selectedLab.name,
      notes: existingProject?.notes || "Submitted from Coding Lab.",
      code: getCurrentLabCode(selectedLab.id),
      status: "Submitted",
      submittedAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      createdAt:
        existingProject?.createdAt ||
        new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    };
    setLabProjects((current) => [
      submittedProject,
      ...current.filter((project) => project.id !== submittedProject.id),
    ]);
    setProjectStatus(`${submittedProject.name} submitted.`);
  };

  const openProject = (project) => {
    selectLabById(project.labId);
    applyProjectCode(project);
    setProjectStatus(`${project.name} opened.`);
  };

  useEffect(() => {
    if (!linkedHomework) return;
    setSelectedLab(null);
    setProjectStatus(
      `${linkedHomework.title} is ready for Coding Lab submission.`,
    );
  }, [linkedHomework?.sourceIndex]);

  useEffect(() => {
    if (!projectStatus) return undefined;

    const timer = window.setTimeout(() => {
      setProjectStatus("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [projectStatus]);

  const submitLinkedHomeworkCode = () => {
    if (
      !linkedHomework ||
      !selectedLab ||
      typeof onSubmitCodingHomework !== "function"
    )
      return;
    onSubmitCodingHomework(linkedHomework.sourceIndex, {
      answer: getCurrentLabCode(selectedLab.id),
      attachment: null,
      submittedAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      labName: selectedLab.name,
    });
    setProjectStatus(
      `${linkedHomework.title} submitted from ${selectedLab.name}.`,
    );
  };

  const renderProjectToolbar = () => (
    <>
      <div className="compilerTopActions">
        <button type="button" onClick={() => setShowProjectForm(true)}>
          Create New Project
        </button>
        <button type="button" onClick={submitCurrentProject}>
          Submit Project
        </button>
        {linkedHomework && (
          <button type="button" onClick={submitLinkedHomeworkCode}>
            Submit Homework Code
          </button>
        )}
        <button type="button" onClick={() => setSelectedLab(null)}>
          Back to Labs
        </button>
      </div>
      {projectStatus && (
        <div className="homeworkSuccessPopup labProjectStatus" role="status">
          {projectStatus}
        </div>
      )}
    </>
  );

  const renderProjectForm = () =>
    showProjectForm && (
      <form className="panel labProjectForm" onSubmit={createNewProject}>
        <div className="panelHeader">
          <h2>
            <Code2 size={22} /> Create New Project
          </h2>
          <button
            className="projectFormClose"
            type="button"
            aria-label="Close project form"
            title="Close"
            onClick={() => setShowProjectForm(false)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="formRow three">
          <label>
            Project Name
            <input
              required
              value={projectForm.name}
              onChange={(event) =>
                setProjectForm({ ...projectForm, name: event.target.value })
              }
            />
          </label>
          <label>
            Lab
            <select
              value={projectForm.labId}
              onChange={(event) =>
                setProjectForm({ ...projectForm, labId: event.target.value })
              }
            >
              {codingLabs.map((lab) => (
                <option value={lab.id} key={lab.id}>
                  {lab.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <input readOnly value="Created" />
          </label>
        </div>
        <label>
          Notes
          <textarea
            value={projectForm.notes}
            onChange={(event) =>
              setProjectForm({ ...projectForm, notes: event.target.value })
            }
          />
        </label>
        <button className="projectFormSubmit" type="submit">
          <Plus size={17} aria-hidden="true" />
          Create Project
        </button>
      </form>
    );

  const renderProjectList = () =>
    labProjects.length > 0 && (
      <section className="panel labProjectList">
        <div className="panelHeader">
          <h2>
            <FileCheck2 size={22} /> Projects
          </h2>
          <span>{labProjects.length} saved</span>
        </div>
        <div className="labProjectGrid">
          {labProjects.map((project) => (
            <article className="labProjectItem" key={project.id}>
              <div>
                <strong>{project.name}</strong>
                <p>
                  {project.labName} - {project.notes || "No notes"}
                </p>
                <small>
                  {project.status === "Submitted"
                    ? `Submitted ${project.submittedAt}`
                    : `Created ${project.createdAt}`}
                </small>
              </div>
              <div className="examCardActions">
                <Badge tone={project.status === "Submitted" ? "green" : "blue"}>
                  {project.status}
                </Badge>
                <button type="button" onClick={() => openProject(project)}>
                  Open
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    );

  // Change the Scratch view. These public URLs work without an API call.
  const changeScratchView = (mode) => {
    setScratchTab(mode);
    if (mode === "player") {
      setScratchFrameUrl("https://scratch.mit.edu/projects/10128407/embed");
    } else {
      setScratchFrameUrl("https://machinelearningforkids.co.uk/scratch/");
    }
  };

  if (selectedLab?.id === "html") {
    return (
      <section className="codingCompiler">
        <div className="codingCompilerTop">
          <div>
            <span>Compiler</span>
            <h2>HTML Lab</h2>
          </div>
          {renderProjectToolbar()}
        </div>
        {renderProjectForm()}

        <div className="compilerGrid">
          <section className="compilerPanel">
            <div className="compilerPanelHeader">
              <h3>Code Editor</h3>
              <button
                type="button"
                onClick={() => {
                  setHtmlCode(defaultHtmlCode);
                  setPreviewCode(defaultHtmlCode);
                }}
              >
                Reset
              </button>
            </div>
            <SyntaxCodeEditor
              value={htmlCode}
              onChange={setHtmlCode}
              language="html"
              label="HTML code editor"
            />
            <button
              className="runCodeButton"
              type="button"
              onClick={() => setPreviewCode(htmlCode)}
            >
              Run Code
            </button>
          </section>

          <section className="compilerPanel">
            <div className="compilerPanelHeader">
              <h3>Live Preview</h3>
            </div>
            <iframe
              className="livePreview"
              title="HTML live preview"
              srcDoc={previewCode}
              sandbox="allow-scripts"
            />
          </section>
        </div>
        {renderProjectList()}
      </section>
    );
  }

  if (selectedLab?.id === "python" || selectedLab?.id === "java") {
    const isPython = selectedLab.id === "python";
    const code = isPython ? pythonCode : javaCode;
    const output = isPython ? pythonOutput : javaOutput;
    const setCode = isPython ? setPythonCode : setJavaCode;
    const resetCode = isPython ? defaultPythonCode : defaultJavaCode;
    const title = isPython ? "Python Lab" : "Java Lab";

    const runCode = () => {
      if (isPython) {
        setPythonOutput(runPythonCode(pythonCode));
      } else {
        setJavaOutput(runJavaCode(javaCode));
      }
    };

    const reset = () => {
      setCode(resetCode);
      if (isPython) {
        setPythonOutput("Click Run Code to see Python output.");
      } else {
        setJavaOutput("Click Run Code to see Java output.");
      }
    };

    return (
      <section className="codingCompiler">
        <div className="codingCompilerTop">
          <div>
            <span>Compiler</span>
            <h2>{title}</h2>
          </div>
          {renderProjectToolbar()}
        </div>
        {renderProjectForm()}

        <div className="compilerGrid">
          <section className="compilerPanel">
            <div className="compilerPanelHeader">
              <h3>Code Editor</h3>
              <button type="button" onClick={reset}>
                Reset
              </button>
            </div>
            <SyntaxCodeEditor
              value={code}
              onChange={setCode}
              language={isPython ? "python" : "java"}
              label={`${title} code editor`}
            />
            <button className="runCodeButton" type="button" onClick={runCode}>
              Run Code
            </button>
          </section>

          <section className="compilerPanel">
            <div className="compilerPanelHeader">
              <h3>Output</h3>
            </div>
            <pre className="compilerOutput">{output}</pre>
          </section>
        </div>
        {renderProjectList()}
      </section>
    );
  }

  if (selectedLab?.id === "sql") {
    return (
      <section className="codingCompiler">
        <div className="codingCompilerTop">
          <div>
            <span>Compiler</span>
            <h2>SQL Lab</h2>
          </div>
          {renderProjectToolbar()}
        </div>
        {renderProjectForm()}
        <div className="compilerGrid">
          <section className="compilerPanel">
            <div className="compilerPanelHeader">
              <h3>SQL Editor</h3>
              <button
                type="button"
                onClick={() => {
                  setSqlCode(defaultSqlCode);
                  setSqlResult(
                    "Click Run Code to query the sample students table.",
                  );
                }}
              >
                Reset
              </button>
            </div>
            <SyntaxCodeEditor
              value={sqlCode}
              onChange={setSqlCode}
              language="sql"
              label="SQL code editor"
            />
            <button
              className="runCodeButton"
              type="button"
              onClick={() => setSqlResult(runSqlCode(sqlCode))}
            >
              Run Query
            </button>
          </section>
          <section className="compilerPanel">
            <div className="compilerPanelHeader">
              <h3>Output</h3>
            </div>
            <pre className="sqlOutputPanel">{sqlResult}</pre>
          </section>
        </div>
        {renderProjectList()}
      </section>
    );
  }

  if (selectedLab?.id === "scratch") {
    return (
      <section className="scratchLabPage">
        <div className="codingCompilerTop">
          <div>
            <span>Game Lab</span>
            <h2>Scratch Lab</h2>
          </div>
          {renderProjectToolbar()}
        </div>
        {renderProjectForm()}
        <div className="scratchWorkspaceGrid">
          <section className="scratchMainPanel">
            <div className="scratchPanelHeader">
              <h3>Machine Learning for Kids Scratch</h3>
              <button
                type="button"
                onClick={() =>
                  window.open(scratchFrameUrl, "_blank", "noreferrer")
                }
              >
                Open Full Page
              </button>
            </div>
            <div className="scratchTabs">
              <button
                className={scratchTab === "ml" ? "active" : ""}
                type="button"
                onClick={() => changeScratchView("ml")}
              >
                ML Scratch
              </button>
              <button
                className={scratchTab === "player" ? "active" : ""}
                type="button"
                onClick={() => changeScratchView("player")}
              >
                Project Player
              </button>
            </div>
            <div className="scratchEmbedShell">
              <iframe
                className="scratchEmbedFrame"
                title="Real Scratch Lab"
                src={scratchFrameUrl}
                allow="fullscreen; clipboard-read; clipboard-write; microphone; camera"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
              />
            </div>
          </section>
          <aside className="scratchInfoCard">
            <h3>Scratch Lab</h3>
            <div className="scratchLogoBig">S</div>
            <strong>Scratch</strong>
            <p>
              Machine Learning for Kids Scratch opens inside this lab. Use the
              project player tab when you want to embed a shared Scratch
              project.
            </p>
            <button
              type="button"
              onClick={() =>
                window.open(scratchFrameUrl, "_blank", "noreferrer")
              }
            >
              Open ML Scratch
            </button>
          </aside>
        </div>
        {renderProjectList()}  
      </section>
    );
  }

  if (selectedLab?.id === "phet") {
    const phetTabs = Object.keys(phetSimulations);
    const activePhetUrl =
      phetSimulations[phetTab] ||
      phetSimulations["Circuit Construction Kit AC"];
    const activePhetPageUrl = phetProjectPages[phetTab] || activePhetUrl;
    return (
      <section className="simulationLabPage">
        <div className="codingCompilerTop">
          <div>
            <span>Simulation Lab</span>
            <h2>Simulation Lab</h2>
          </div>
          {renderProjectToolbar()}
        </div>
        {renderProjectForm()}
        <section className="phetPlayerPanel">
          <div className="scratchPanelHeader">
            <h3>PhET Simulations</h3>
            <button
              type="button"
              onClick={() =>
                window.open(activePhetPageUrl, "_blank", "noreferrer")
              }
            >
              Open Full Page
            </button>
          </div>
          <div className="phetTabs">
            {phetTabs.map((tab) => (
              <button
                className={phetTab === tab ? "active" : ""}
                type="button"
                key={tab}
                onClick={() => setPhetTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="phetFrame">
            <iframe
              className="phetEmbedFrame"
              title={`PhET ${phetTab}`}
              src={activePhetUrl}
              allow="fullscreen; autoplay"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            />
          </div>
        </section>
        {renderProjectList()}
      </section>
    );
  }

  if (selectedLab) {
    return (
      <section className="codingCompiler">
        <div className="codingCompilerTop">
          <div>
            <span>Lab</span>
            <h2>{selectedLab.name}</h2>
            <p>{selectedLab.subtitle}</p>
          </div>
          {renderProjectToolbar()}
        </div>
        {renderProjectForm()}
        <div className="compilerPanel comingSoonLab">
          <div className={`labLogo ${selectedLab.tone}`}>
            {selectedLab.mark}
          </div>
          <strong>{selectedLab.name} workspace</strong>
          <p>
            This lab card is ready. Connect the compiler or embedded player URL
            when your backend/player is available.
          </p>
        </div>
        {renderProjectList()}
      </section>
    );
  }

  return (
    <section className="codingLabPage">
      {linkedHomework && (
        <div className="codingHomeworkBanner">
          <div>
            <strong>{linkedHomework.title}</strong>
            <p>
              {linkedHomework.brief ||
                "Choose a coding lab, complete the work, then submit your code."}
            </p>
          </div>
          <Badge tone="orange">Homework</Badge>
        </div>
      )}
      {renderProjectForm()}
      <div className="codingLabGrid">
        {codingLabs.map((lab) => (
          <article
            className={`codingLabCard ${lab.tone}`}
            key={lab.id}
            role="button"
            tabIndex="0"
            onClick={() => setSelectedLab(lab)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") setSelectedLab(lab);
            }}
          >
            <div className="codingLabCardTop">
              <div className={`labLogo ${lab.tone}`}>
                <img
                  src={lab.logo}
                  alt={`${lab.name} logo`}
                  onError={(event) => { event.currentTarget.style.display = "none"; }}
                />
                <span>{lab.mark}</span>
              </div>
            </div>
            <small className="codingLabMeta">&lt;/&gt; CODING WORKSPACE</small>
            <strong>{lab.name}</strong>
            <p>{lab.subtitle}</p>
            <div className="codingLabTags"><span>{lab.action}</span><span>{lab.badge}</span></div>
            <div className="codingLabCardFooter">
              <span>Ready to code</span>
              <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedLab(lab); }}><Play size={12} /> Open Lab</button>
            </div>
          </article>
        ))}
      </div>
      {renderProjectList()}
    </section>
  );
}

export { CodingLabModule };
