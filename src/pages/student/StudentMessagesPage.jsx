import { useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  Button,
  ChatList,
  Input,
  MessageList,
  Navbar,
} from "react-chat-elements";
import {
  Paperclip,
  Send,
  Smile,
} from "../../icons/index.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useMessages } from "../../context/MessagesContext.jsx";

const avatarDataUrl = (initials, color) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="48" fill="${color}"/><text x="48" y="57" text-anchor="middle" fill="white" font-family="Arial" font-size="30" font-weight="700">${initials}</text></svg>`,
  )}`;

export default function StudentMessagesPage() {
  const { user } = useAuth();
  const {
    teacherMessages,
    sendTeacherMessage,
    updateMessage,
    deleteMessage,
    clearConversation,
  } = useMessages();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [openMessageMenuId, setOpenMessageMenuId] = useState(null);
  const messageListRef = useRef(null);
  const inputRef = useRef(null);
  const clearInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const studentName =
    user?.student_name || user?.name || user?.full_name || user?.email || "Student";
  const teacherName =
    user?.teacher_name || user?.teacher?.teacher_name || "Teacher";
  const messages = useMemo(
    () =>
      teacherMessages.filter(
        (message) =>
          message.student === studentName || message.student === "All Students",
      ),
    [studentName, teacherMessages],
  );
  const filteredMessages = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search
      ? messages.filter((message) =>
          `${message.title || ""} ${message.text || ""}`
            .toLowerCase()
            .includes(search),
        )
      : messages;
  }, [messages, query]);

  const isStudentMessage = (message) =>
    message.sender === "student" || message.title === "Student message";

  const submitMessage = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    if (editingId) {
      await updateMessage(editingId, { text });
      setEditingId(null);
    } else {
      await sendTeacherMessage({
        student: studentName,
        sender: "student",
        title: "Student message",
        text,
        sentAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
    setDraft("");
    clearInputRef.current?.();
  };

  const addEmoji = (emojiData) => {
    const currentText = inputRef.current?.value ?? draft;
    const nextDraft = `${currentText}${emojiData.emoji}`;
    setDraft(nextDraft);
    setEmojiPickerOpen(false);
    if (inputRef.current) {
      inputRef.current.value = nextDraft;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(nextDraft.length, nextDraft.length);
    }
  };

  const attachFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.includes(".")
      ? file.name.split(".").pop()
      : "";
    const size =
      file.size < 1024 * 1024
        ? `${Math.ceil(file.size / 1024)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    await sendTeacherMessage({
      student: studentName,
      sender: "student",
      title: "Student attachment",
      text: file.name,
      sentAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "file",
      data: {
        name: file.name,
        extension,
        size,
        uri: URL.createObjectURL(file),
      },
    });
    event.target.value = "";
  };

  const conversation = {
    id: "teacher",
    avatar: avatarDataUrl("T", "#257beb"),
    alt: teacherName,
    title: teacherName,
    subtitle: messages[0]?.text || "Start a conversation with your teacher",
    dateString: messages[0]?.sentAt || "Now",
    unread: 0,
    statusColor: "#22c55e",
    className: "active",
  };

 const activeMessages = filteredMessages
  .slice()
  .reverse()
  .map((message, index) => {
    const messageId = message.id || `student-message-${index}`;

    const hasAttachment =
      message.data &&
      typeof message.data === "object" &&
      typeof message.data.uri === "string" &&
      message.data.uri.length > 0;

    const isFileMessage = message.type === "file" && hasAttachment;
    const isPhotoMessage = message.type === "photo" && hasAttachment;
    const isStudent = isStudentMessage(message);

    return {
      id: messageId,
      position: isStudent ? "right" : "left",
      type: isFileMessage ? "file" : isPhotoMessage ? "photo" : "text",
      title: isStudent ? "You" : teacherName,
      text: typeof message.text === "string" ? message.text : "",
      date: new Date(),
      dateString: message.sentAt || "Today",
      status: isStudent ? "read" : undefined,
      notch: true,
      data: hasAttachment ? message.data : undefined,

      className: [
        selectedMessageIds.includes(messageId)
          ? "message-focus"
          : "",
        editingId === messageId
          ? "message-editing"
          : "",
        selectionMode && isStudent
          ? "message-selection-row"
          : "",
        isStudent
          ? "message-selection-right"
          : "message-selection-left",
      ]
        .filter(Boolean)
        .join(" "),

      renderAddCmp:
        selectionMode === true
          ? () => {
              const checked =
                selectedMessageIds.includes(messageId);

              const canEdit = isStudent;

              if (!canEdit) return null;

              return (
                <div className="messageSelectionControls">
                  <input
                    type="checkbox"
                    className="messageSelectCheckbox"
                    aria-label={`Select message ${messageId}`}
                    checked={checked}
                    onChange={() =>
                      setSelectedMessageIds((current) =>
                        current.includes(messageId)
                          ? current.filter(
                              (id) => id !== messageId
                            )
                          : [...current, messageId]
                      )
                    }
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  />

                  {checked && canEdit && (
                    <div className="messageInlineActions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(messageId);
                          setDraft(message.text || "");
                          setSelectionMode(false);
                          setSelectedMessageIds([]);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Delete this message?"
                            )
                          ) {
                            await deleteMessage(messageId);
                            setSelectionMode(false);
                            setSelectedMessageIds([]);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            }
          : undefined,
    };
  });
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [activeMessages.length, query]);
  useEffect(() => {
    if (!editingId) return;
    const timer = window.setTimeout(() => {
      inputRef.current?.focus?.();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [editingId]);

  return (
    <section className="rceTeacherChat" aria-label="Student messages">
      <aside className="rceTeacherInbox">
        <Navbar type="light" left={<strong>Messages</strong>} />
        <Input
          placeholder="Search messages"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="rceTeacherFilters">
          <Button
            text="All"
            color="#fff"
            backgroundColor="#3979aa"
            onClick={() => setQuery("")}
          />
          <Button
            text="Teacher"
            color="#2563eb"
            backgroundColor="#eef4ff"
            onClick={() => setQuery("")}
          />
        </div>
        <div className="rceTeacherConversationList">-
          <ChatList dataSource={[conversation]} />
        </div>
      </aside>

      <main className="rceTeacherThread">
        <Navbar
          type="light"
          center={
            <div>
              <strong>{teacherName}</strong>
              <small>Teacher · Active now</small>
            </div>
          }
          right={
            <div className="chatHeaderActions">
              {selectionMode && (
                <button
                  type="button"
                  className="selectionCloseButton"
                  aria-label="Close message selection"
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedMessageIds([]);
                    setOpenMessageMenuId(null);
                  }}
                >
                  ×
                </button>
              )}
              <div className="chatHeaderMenu">
                <button
                  type="button"
                  className="messageMenuTrigger"
                  aria-label="Chat options"
                  onClick={() =>
                    setOpenMessageMenuId((current) =>
                      current === "header" ? null : "header",
                    )
                  }
                >
                  ⋮
                </button>
                {openMessageMenuId === "header" && (
                  <div
                    className="messageMenuDropdown chatHeaderDropdown"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectionMode(true);
                      setSelectedMessageIds([]);
                      setOpenMessageMenuId(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectionMode(true);
                        setSelectedMessageIds([]);
                        setOpenMessageMenuId(null);
                      }
                    }}
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      Select
                    </button>
                  </div>
                )}
              </div>      
              <Button
                text="Clear chat"
                color="#2563eb"
                backgroundColor="#eef4ff"
                onClick={() => {
                  if (window.confirm("Clear this conversation?")) {
                    clearConversation(studentName);
                    setEditingId(null);
                  }
                }}
              />
            </div>
          }
        />
        <div className="rceTeacherMessages">
          {activeMessages.length ? (
            <MessageList
              referance={messageListRef}
              lockable
              toBottomHeight="100%"
              dataSource={activeMessages}
              onDownload={(message) => {
                if (
                  !message.data ||
                  typeof message.data.uri !== "string" ||
                  !message.data.uri
                ) {
                  return;
                }
                const link = document.createElement("a");
                link.href = message.data.uri;
                link.download = message.data.name || "attachment";
                link.rel = "noopener";
                link.click();
              }}
            />
          ) : (
            <div className="teacherMessageNotice">
              Start a conversation with your teacher.
            </div>
          )}
        </div>
        <form onSubmit={submitMessage}>
          {editingId && (
            <div className="messageEditBar">
              <span>
                Editing:{" "}
                {activeMessages.find((message) => message.id === editingId)?.text ||
                  "message"}
              </span>
              <Button
                type="button"
                text="Cancel"
                onClick={() => {
                  setEditingId(null);
                  setSelectedMessageId(null);
                  setDraft("");
                  clearInputRef.current?.();
                }}
              />
            </div>
          )}
          <Input
            referance={inputRef}
            clear={(clear) => {
              clearInputRef.current = clear;
            }}
            placeholder={`Message ${teacherName}`}
            multiline
            maxHeight={90}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            leftButtons={
              <>
                <Button
                  type="button"
                  title="Attach file"
                  onClick={() => fileInputRef.current?.click()}
                  icon={{ component: <Paperclip size={18} />, float: "left" }}
                />
                <span className="emojiPickerControl">
                  <Button
                    type="button"
                    title="Add emoji"
                    onClick={() => setEmojiPickerOpen((open) => !open)}
                    icon={{ component: <Smile size={18} />, float: "left" }}
                  />
                  {emojiPickerOpen && (
                    <span className="emojiPickerPopover">
                      <EmojiPicker
                        onEmojiClick={addEmoji}
                        width={320}
                        height={400}
                        searchPlaceHolder="Search emoji"
                        previewConfig={{ showPreview: false }}
                      />
                    </span>
                  )}
                </span>
              </>
            }
            rightButtons={
              <Button
                type="submit"
                className="rceSendButton"
                color="white"
                backgroundColor="#2563eb"
                icon={{ component: <Send size={18} />, float: "left" }}
                title={editingId ? "Save changes" : "Send"}
              />
            }
          />
          <input ref={fileInputRef} type="file" hidden onChange={attachFile} />
        </form>
      </main>
    </section>
  );
}
