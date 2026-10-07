import { demoClient } from './demoClient.js';

const storageKey = 'orange360.teacherMessages';

function readMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

let messages = readMessages();

export const messagesApi = {
  list: () => demoClient.get(messages),
  send: async (message) => {
    messages = [{ ...message, id: message.id || crypto.randomUUID() }, ...messages];
    localStorage.setItem(storageKey, JSON.stringify(messages));
    return demoClient.mutate(messages);
  },
  update: async (id, changes) => {
    messages = messages.map((message) =>
      message.id === id ? { ...message, ...changes, updatedAt: new Date().toISOString() } : message,
    );
    localStorage.setItem(storageKey, JSON.stringify(messages));
    return demoClient.mutate(messages);
  },
  remove: async (id) => {
    messages = messages.filter((message) => message.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(messages));
    return demoClient.mutate(messages);
  },
  removeMany: async (ids) => {
    const idsToRemove = new Set(ids);
    messages = messages.filter((message) => !idsToRemove.has(message.id));
    localStorage.setItem(storageKey, JSON.stringify(messages));
    return demoClient.mutate(messages);
  },
  clearConversation: async (student) => {
    messages = messages.filter((message) => message.student !== student);
    localStorage.setItem(storageKey, JSON.stringify(messages));
    return demoClient.mutate(messages);
  },
};
