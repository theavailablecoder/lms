import { createContext, useContext, useEffect, useState } from 'react';
import { messagesApi } from '../api/messagesApi.js';

const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
  const [teacherMessages, setTeacherMessages] = useState([]);
  useEffect(() => {
    messagesApi.list().then(setTeacherMessages);
  }, []);
  const sendTeacherMessage = async (message) => {
    const next = await messagesApi.send(message);
    setTeacherMessages(next);
  };
  const updateMessage = async (id, changes) => {
    const next = await messagesApi.update(id, changes);
    setTeacherMessages(next);
  };
  const deleteMessage = async (id) => {
    const next = await messagesApi.remove(id);
    setTeacherMessages(next);
  };
  const deleteMessages = async (ids) => {
    const next = await messagesApi.removeMany(ids);
    setTeacherMessages(next);
  };
  const clearConversation = async (student) => {
    const next = await messagesApi.clearConversation(student);
    setTeacherMessages(next);
  };

  return (
    <MessagesContext.Provider
      value={{
        teacherMessages,
        sendTeacherMessage,
        updateMessage,
        deleteMessage,
        deleteMessages,
        clearConversation,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const value = useContext(MessagesContext);
  if (!value) throw new Error('useMessages must be used within MessagesProvider');
  return value;
}
