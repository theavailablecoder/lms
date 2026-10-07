import { useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  Button,
  ChatList,
  Input,
  MessageList,
  Navbar,
} from "react-chat-elements";
import { Paperclip, Send, Smile } from "../../icons/index.js";
import { useMessages } from "../../context/MessagesContext.jsx";

const avatarDataUrl = (initials, color) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="48" fill="${color}"/><text x="48" y="57" text-anchor="middle" fill="white" font-family="Arial" font-size="30" font-weight="700">${initials}</text></svg>`,
  )}`;

const timeOf = (message) => message.sentAt || message.time || "Today";

export default function TeacherMessagesPage() {
  const {
    teacherMessages = [],
    sendTeacherMessage,
    updateMessage,
    deleteMessage,
    clearConversation,
  } = useMessages();
  const [selectedId, setSelectedId] = useState("");
  const [activeTab, setActiveTab] = useState("all");
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

  const conversations = useMemo(() => {
    const latestByStudent = new Map();
    teacherMessages
      .filter((message) => message.student && message.student !== "All Students")
      .forEach((message) => {
        if (!latestByStudent.has(message.student)) {
          latestByStudent.set(message.student, message);
        }
      });

    return [...latestByStudent.entries()].map(([name, message]) => ({
      id: `student-${name}`,
      name,
      initials: name
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
      role: "Student",
      preview: message.text || "Message attachment",
      time: timeOf(message),
      color: "#257beb",
    }));
  }, [teacherMessages]);

  useEffect(() => {
    if (!selectedId && conversations[0]) setSelectedId(conversations[0].id);
    if (selectedId && !conversations.some((item) => item.id === selectedId)) {
      setSelectedId(conversations[0]?.id || "");
    }
  }, [conversations, selectedId]);

  const selected = conversations.find((item) => item.id === selectedId);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return conversations.filter((item) => {
      const matchesQuery = `${item.name} ${item.preview}`
        .toLowerCase()
        .includes(search);
      return matchesQuery && (activeTab === "all" || activeTab === "students");
    });
  }, [activeTab, conversations, query]);

  const chatListData = filtered.map((item) => ({
    id: item.id,
    avatar: avatarDataUrl(item.initials, item.color),
    alt: item.name,
    title: item.name,
    subtitle: item.preview,
    dateString: item.time,
    statusColor: "#22c55e",
    className: item.id === selectedId ? "active" : "",
  }));

  const activeMessages = selected
    ? teacherMessages
        .filter((message) => message.student === selected.name)
        .slice()
        .reverse()
        .map((message, index) => {
          const messageId = message.id || `${selected.name}-${index}`;
          const hasAttachment =
            message.data &&
            typeof message.data === "object" &&
            typeof message.data.uri === "string" &&
            message.data.uri.length > 0;
          const isFileMessage = message.type === "file" && hasAttachment;
          const isPhotoMessage = message.type === "photo" && hasAttachment;

          return {
            id: messageId,
            position: message.sender === "teacher" ? "right" : "left",
            type: isFileMessage ? "file" : isPhotoMessage ? "photo" : "text",
            title: message.sender === "teacher" ? "You" : selected.name,
            text: typeof message.text === "string" ? message.text : "",
            date: new Date(),
            dateString: timeOf(message),
            status: message.sender === "teacher" ? "read" : undefined,
            notch: true,
            data: hasAttachment ? message.data : undefined,
            className: [
              selectedMessageIds.includes(messageId) ? "message-focus" : "",
              editingId === messageId ? "message-editing" : "",
              selectionMode && message.sender === "teacher"
                ? "message-selection-row"
                : "",
              message.sender === "teacher"
                ? "message-selection-right"
                : "message-selection-left",
            ]
              .filter(Boolean)
              .join(" "),
            renderAddCmp: selectionMode === true ? () => {
              const checked = selectedMessageIds.includes(messageId);
              const canEdit = message.sender === "teacher";
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
                          ? current.filter((id) => id !== messageId)
                          : [...current, messageId],
                      )
                    }
                    onClick={(event) => event.stopPropagation()}
                  />
                  {checked && canEdit && (
                    <div className="messageInlineActions">
                      <button
                        type="button"
                        onClick={() => {
                          if (!canEdit) return;
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
                            canEdit &&
                            window.confirm("Delete this message?")
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
            } : undefined,
          };
        })
    : [];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [activeMessages.length, selectedId]);

  useEffect(() => {
    setSelectionMode(false);
    setSelectedMessageIds([]);
    setOpenMessageMenuId(null);
  }, [selectedId]);

  useEffect(() => {
    if (!editingId) return;
    const timer = window.setTimeout(() => {
      inputRef.current?.focus?.();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [editingId]);

  const sendMessage = async (message) => {
    await sendTeacherMessage({
      student: selected.name,
      sender: "teacher",
      ...message,
    });
  };

  const submitMessage = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selected) return;
    if (editingId) {
      await updateMessage(editingId, { text });
      setEditingId(null);
    } else {
      await sendMessage({
        title: "Teacher message",
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
    if (!file || !selected) return;
    await sendMessage({
      title: "Teacher attachment",
      text: file.name,
      sentAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "file",
      data: {
        name: file.name,
        extension: file.name.includes(".") ? file.name.split(".").pop() : "",
        size: `${Math.ceil(file.size / 1024)} KB`,
        uri: URL.createObjectURL(file),
      },
    });
    event.target.value = "";
  };

  return (
    <section className="rceTeacherChat" aria-label="Teacher messages">
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
            color={activeTab === "all" ? "#fff" : "#2563eb"}
            backgroundColor={activeTab === "all" ? "#3979aa" : "#eef4ff"}
            onClick={() => setActiveTab("all")}
          />
          <Button
            text="Students"
            color={activeTab === "students" ? "#fff" : "#2563eb"}
            backgroundColor={activeTab === "students" ? "#3979aa" : "#eef4ff"}
            onClick={() => setActiveTab("students")}
          />
        </div>
        <div className="rceTeacherConversationList">
          {chatListData.length ? (
            <ChatList dataSource={chatListData} onClick={(item) => setSelectedId(item.id)} />
          ) : (
            <p className="teacherMessageNotice">No student messages yet.</p>
          )}
        </div>
      </aside>

      <main className="rceTeacherThread">
        <Navbar
          type="light"
          center={
            <div>
              <strong>{selected?.name || "Select a student"}</strong>
              <small>{selected ? "Student · Active now" : "No conversation selected"}</small>
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
                disabled={!selected}
                onClick={() => {
                  if (selected && window.confirm("Clear this conversation?")) {
                    clearConversation(selected.name);
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
              {selected ? "No messages in this conversation yet." : "Student messages will appear here."}
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
            placeholder={selected ? `Message ${selected.name}` : "Select a student first"}
            multiline
            maxHeight={90}
            value={draft}
            disabled={!selected}
            onChange={(event) => setDraft(event.target.value)}
            leftButtons={
              <>
                <Button
                  type="button"
                  title="Attach file"
                  disabled={!selected}
                  onClick={() => fileInputRef.current?.click()}
                  icon={{ component: <Paperclip size={18} />, float: "left" }}
                />
                <span className="emojiPickerControl">
                  <Button
                    type="button"
                    title="Add emoji"
                    disabled={!selected}
                    onClick={() => setEmojiPickerOpen((open) => !open)}
                    icon={{ component: <Smile size={18} />, float: "left" }}
                  />
                  {emojiPickerOpen && (
                    <span className="emojiPickerPopover">
                      <EmojiPicker onEmojiClick={addEmoji} width={320} height={400} previewConfig={{ showPreview: false }} />
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
                disabled={!selected}
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
