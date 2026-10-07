import { useState } from "react";
import { Code2 } from "../../icons/index.js";
import { studentCodingExercises } from "../../data/mockData.js";
import { runPythonCode, runJavaCode, runSqlCode } from "../../utils/codeRunner.js";
import { Badge } from "../shared/SharedComponents.jsx";

export default function StudentCodingLab() {

  const [selectedExercise, setSelectedExercise] = useState(
    studentCodingExercises[0],
  );


  const [code, setCode] = useState(studentCodingExercises[0].starterCode);
  const [output, setOutput] = useState("Click Run Code to see output.");
  const [completed, setCompleted] = useState([]);
  const isHtml = selectedExercise.language === "html";
  const isPreviewLab = selectedExercise.language === "html";

  const openExercise = (exercise) => {
    setSelectedExercise(exercise);
    setCode(exercise.starterCode);
    setOutput("Click Run Code to see output.");
  };

  const runStudentCode = () => {
    if (isHtml) {
      setOutput("HTML preview updated.");
      return;
    }

    if (selectedExercise.language === "python") {
      setOutput(runPythonCode(code));
      return;
    }


    if (selectedExercise.language === "java") {
      setOutput(runJavaCode(code));
      return;
    }
    if (selectedExercise.language === "sql") {
      setOutput(runSqlCode(code));
      return;
    }

    setOutput(`Scratch block plan ready:\n\n${code}`);
  };


  
  const submitExercise = () => {
    setCompleted((current) =>
      current.includes(selectedExercise.id)
        ? current
        : [...current, selectedExercise.id],
    );
    setOutput(`${selectedExercise.title} submitted successfully.`);
  };

  return (
    <section className="studentCodingLab">
      <div className="featureHero">
        <div className="featureIcon">
          <Code2 size={34} />
        </div>
        <div>
          <h2>Coding Lab</h2>
          <p>Practice programming problems and review solutions.</p>
        </div>
        <Badge tone="green">{completed.length} Completed</Badge>
      </div>

      <div className="studentLabGrid">
        <aside className="panel studentLabList">
          <div className="panelHeader">
            <h2>
              <Code2 size={22} /> Exercises
            </h2>
            <span>{studentCodingExercises.length} labs</span>
          </div>
          {studentCodingExercises.map((exercise) => (
            <button
              className={`studentLabItem ${selectedExercise.id === exercise.id ? "active" : ""}`}
              type="button"
              key={exercise.id}
              onClick={() => openExercise(exercise)}
            >
              <div>
                <strong>{exercise.title}</strong>
                <p>{exercise.subtitle}</p>
              </div>
              <Badge
                tone={
                  completed.includes(exercise.id)
                    ? "green"
                    : exercise.badge === "Pending"
                      ? "orange"
                      : "blue"
                }
              >
                {completed.includes(exercise.id) ? "Done" : exercise.badge}
              </Badge>
            </button>
          ))}
        </aside>

        <section className="codingCompiler studentCompiler">
          <div className="codingCompilerTop">
            <div>
              <span>{selectedExercise.language.toUpperCase()} Practice</span>
              <h2>{selectedExercise.title}</h2>
              <p>{selectedExercise.task}</p>
            </div>
            <div className="compilerTopActions">
              <button
                type="button"
                onClick={() => openExercise(selectedExercise)}
              >
                Reset
              </button>
              <button type="button" onClick={submitExercise}>
                Submit
              </button>
            </div>
          </div>
          <div className="compilerGrid">
            <section className="compilerPanel">
              <div className="compilerPanelHeader">
                <h3>Code Editor</h3>
                <Badge
                  tone={
                    selectedExercise.language === "scratch"
                      ? "orange"
                      : isHtml
                        ? "orange"
                        : "blue"
                  }
                >
                  {selectedExercise.language}
                </Badge>
              </div>
              <textarea
                className="codeEditor"
                value={code}
                spellCheck="false"
                onChange={(event) => setCode(event.target.value)}
                aria-label={`${selectedExercise.title} code editor`}
              />
              <button
                className="runCodeButton"
                type="button"
                onClick={runStudentCode}
              >
                Run Code
              </button>
            </section>

            <section className="compilerPanel">
              <div className="compilerPanelHeader">
                <h3>{isPreviewLab ? "Live Preview" : "Output"}</h3>
              </div>
              {isPreviewLab ? (
                <iframe
                  className="livePreview"
                  title="Student HTML preview"
                  srcDoc={code}
                  sandbox="allow-scripts"
                />
              ) : (
                <pre className="compilerOutput">{output}</pre>
              )}
            </section>
          </div>
        </section>
      </div>
    </section>
  );
}

