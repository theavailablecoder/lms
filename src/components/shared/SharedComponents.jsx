import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  Code2,
  FileCheck2,
  FileText,
  Gauge,
  GraduationCap,
  Layers3,
  Library,
  ListChecks,
  LogOut,
  Mail,
  Medal,
  Menu,
  Paperclip,
  PenLine,
  PieChart,
  Play,
  SearchCheck,
  Send,
  Settings,
  Sparkles,
  Trophy,
  UsersRound,
  X,
} from "../../icons/index.js";
// import codeGptBookCover from "../../assets/CodeGPT V4 _Book_1.jpg";
import orangeClassroomLogo from "../../assets/Classroom logo_01.png";
import studyHelperRobot from "../../assets/ai-study-helper.png";
import { studentNavGroups, teacherNav } from "../../data/navConfig.js";
import {
  stats,
  assistantModes,
  assignments,
  courses,
  week,
  activities,
  studentProfile,
  timetable,
  studentAnnouncements,
  students,
  starterCalendarEvents,
  pageData,
  teacherFeatureData,
  starterExamPlans,
  codingLabs,
  phetSimulations,
  phetProjectPages,
  defaultHtmlCode,
  defaultPythonCode,
  defaultJavaCode,
  defaultSqlCode,
  studentCodingExercises,
} from "../../data/mockData.js";
import { formatDueDate, formatFileSize } from "../../utils/formatters.js";
import { getTimeGreeting } from "../../utils/greetings.js";
import { getCodingLabIdFromHomework } from "../../utils/codingLab.js";
import { buildAssistantReply } from "../../utils/assistant.js";
import { runPythonCode, runJavaCode, runSqlCode } from "../../utils/codeRunner.js";

function ChatModal() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi - ask me anything. If the proxy is unavailable, I will answer locally.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const proxyResp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages.concat(userMsg).map((m) => ({
            role: m.role === "assistant" ? "assistant" : m.role,
            content: m.text,
          })),
        }),
      });
      if (proxyResp.ok) {
        const data = await proxyResp.json();
        const textResp =
          data?.choices?.[0]?.message?.content || JSON.stringify(data);
        setMessages((m) => [...m, { role: "assistant", text: textResp }]);
        setLoading(false);
        return;
      }

      const reply = buildAssistantReply("Doubt solver", text);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err) {
      const reply = buildAssistantReply("Doubt solver", text);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="chatToggle"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
      >
        Chat
      </button>
      {open && (
        <div className="chatModal" role="dialog" aria-modal="true">
          <div className="chatHeader">
            <strong>Assistant (ChatGPT-style)</strong>
            <div>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>
          <div className="chatBody">
            {messages.map((m, i) => (
              <div key={`msg-${i}`} className={`chatLine ${m.role}`}>
                <span className="roleLabel">
                  {m.role === "user" ? "You" : "Assistant"}
                </span>
                <div className="chatText">{m.text}</div>
              </div>
            ))}
          </div>
          <form className="chatComposer" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={loading ? "Sending..." : "Type your message..."}
            />
            <button type="submit" disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Badge({ children, tone = "blue" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function AttachmentCard({ attachment }) {
  if (!attachment) return null;
  const isImage = attachment.type?.startsWith("image/");

  return (
    <div className="attachmentCard">
      {isImage ? (
        <img src={attachment.url} alt={attachment.name} />
      ) : (
        <FileText size={34} />
      )}
      <div>
        <strong>{attachment.name}</strong>
        <p>
          {attachment.kind} - {formatFileSize(attachment.size)}
        </p>
        <a href={attachment.url} target="_blank" rel="noreferrer">
          Open attachment
        </a>
      </div>
    </div>
  );
}

function AiStudyChat({ compact = false, audience = "student", layout = "student" }) {
  const showWorkInProgress = false;
  const [mode, setMode] = useState("Doubt solver");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [orangeGptUrl, setOrangeGptUrl] = useState(
    "https://chatgpt.com/g/g-3Aizg6rZE-orangegpt",
  );
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        audience === "teacher"
          ? "Hi teacher, ask me to create study material, quizzes, explanations, coding help, summaries, translations, or mind maps for your class."
          : "Welcome! Ask me to explain a topic, help with code, summarize notes, or build a practice quiz.",
    },
  ]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages = [...messages, { role: "student", text: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an LMS AI Study Box for ${audience === "teacher" ? "a teacher" : "a student"}. Current mode: ${mode}. Give clear, age-appropriate, practical help. Keep answers concise unless the user asks for detail.`,
            },
            ...nextMessages.map((message) => ({
              role: message.role === "assistant" ? "assistant" : "user",
              content: message.text,
            })),
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "OpenAI request failed.");
      const answer = data?.choices?.[0]?.message?.content?.trim();
      if (!answer) throw new Error("OpenAI returned no answer.");
      setMessages((current) => [
        ...current,
        { role: "assistant", text: answer },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: buildAssistantReply(mode, question) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const useSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  useEffect(() => {
    fetch("/api/ai-study-box")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.url) setOrangeGptUrl(data.url);
      })
      .catch(() => {});
  }, []);

  if (layout === "teacher" && !compact) {
    return (
      <section className="teacherAiStudyBox">
        {messages.length > 1 ? (
          <div className="teacherAiConversation" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`teacherAiMessage ${message.role}`}
                key={`${message.role}-${index}`}
              >
                <span>{message.role === "student" ? "You" : "Study Helper"}</span>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="teacherAiWelcome">
            <div className="teacherAiRobot" aria-hidden="true">
              <img src={studyHelperRobot} alt="" />
              <span className="teacherAiSpark teacherAiSparkOne">✦</span>
              <span className="teacherAiSpark teacherAiSparkTwo">✦</span>
              <span className="teacherAiSpark teacherAiSparkThree">✦</span>
            </div>
            <h2>Hello! I&apos;m your Study Helper</h2>
            <p>
              {audience === "teacher"
                ? "Ask me anything to plan lessons, create content, or get ideas"
                : "Ask me anything to understand lessons, solve doubts, or practice"}
              <br />
              {audience === "teacher" ? "for your class." : "for your learning."}
            </p>
            <span className="teacherAiDots" aria-hidden="true">
              <i className="active" />
              <i />
              <i />
            </span>
          </div>
        )}

        <form className="teacherAiComposer" onSubmit={sendMessage}>
          <button
            className="teacherAiAttach"
            type="button"
            aria-label="Attach a file"
            title="Attach a file"
          >
            <Paperclip size={22} />
          </button>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={loading ? "Thinking with OpenAI..." : "Ask your question here..."}
            disabled={loading}
            aria-label="Ask your question"
          />
          <button
            className="teacherAiSend"
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send question"
            title="Send question"
          >
            <Send size={20} />
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className={`panel aiChatPanel akChat ${compact ? "compact" : ""}`}>
      <div className="panelHeader">
        <h2>
          <Sparkles size={22} /> AktechGpt
        </h2>
        <div className="studyHelperActions">
          <button type="button" className="akNewChat" disabled={loading} onClick={() => { setMessages((current) => current.slice(0, 1)); setInput(''); }}>New chat</button>
          <a
            className="orangeGptLink"
            href="https://chatgpt.com/g/g-69dcb284eea481919765e9dd1e039514-ak-tech-solutions-gpt"
            target="_blank"
            rel="noreferrer"
          >
            <Sparkles size={16} /> Open AktechGpt
          </a>
        </div>
      </div>

      {showWorkInProgress ? (
        <div className="studyHelperWip" role="status">
          <div className="wipAnimation" aria-hidden="true">
            <span />
            <span />
            <span />
            <Sparkles size={27} />
          </div>
          <h3>Study Helper is being prepared</h3>
          <p>We&apos;re building a better learning workspace for your class.</p>
          <span className="wipDots">
            <i /> <i /> <i />
          </span>
        </div>
      ) : (
        <>
          <div className="modeTabs" aria-label="Study helper modes">
            {assistantModes.map((item) => (
              <button
                className={mode === item ? "active" : ""}
                key={item}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="chatWindow" aria-live="polite">
            {messages.length === 1 ? <div className="akChatWelcome"><img className="akWelcomeRobot" src={studyHelperRobot} alt="AKTech robot learning companion" /><span className="akChatEyebrow">YOUR EVERYDAY LEARNING COMPANION</span><h3>What would you like to explore?</h3><p>Big questions or small doubts — let’s work through them together.</p></div> : messages.map((message, index) => (
              <div
                className={`chatMessage ${message.role}`}
                key={`${message.role}-${index}`}
              >
                <span>{message.role === "student" ? "You" : "AktechGpt"}</span>
                <p>{message.text}</p>
              </div>
            ))}
            {loading && <p className="akThinking" role="status">AktechGpt is thinking…</p>}
          </div>
          <div className="promptChips">
            <button
              onClick={() =>
                useSuggestion("Explain algebra basics in simple words")
              }
            >
              Explain a topic
            </button>
            <button
              onClick={() =>
                useSuggestion("Make a 5 question quiz on force and motion")
              }
            >
              Make quiz
            </button>
            <button
              onClick={() => useSuggestion("Summarize today science notes")}
            >
              Summarize notes
            </button>
          </div>
          <form className="chatComposer" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                loading ? "Preparing your answer…" : "Message AktechGpt…"
              }
              disabled={loading}
              aria-label="Message AktechGpt"
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <Send size={18} /> {loading ? "Thinking..." : "Send"}
            </button>
          </form>
          <div className="akChatBottom"><p>AI can make mistakes. Check important information.</p></div>
        </>
      )}
    </section>
  );
}


export { ChatModal, Badge, AttachmentCard, AiStudyChat };
