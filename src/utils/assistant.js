export function buildAssistantReply(mode, prompt) {
  const cleanPrompt = prompt.trim();

  if (mode === 'Quiz') {
    return `Quiz ready for: ${cleanPrompt}\n1. What is the main idea?\n2. Explain one example.\n3. Write a short answer in your own words.`;
  }

  if (mode === 'Mind map') {
    return `Mind map for: ${cleanPrompt}\nCenter topic -> Key points -> Examples -> Revision notes -> Practice question.`;
  }

  if (mode === 'Translator') {
    return `Translator mode: send any sentence and choose the language. For now, I can help rewrite "${cleanPrompt}" in simple English.`;
  }

  if (mode === 'Code') {
    return `Code helper: first understand the problem, then write small steps, then test with sample input. For "${cleanPrompt}", start by listing inputs, output, and one example.`;
  }

  if (mode === 'Writing') {
    return `Writing helper: here is a cleaner version idea for "${cleanPrompt}". Use a clear opening, 2-3 supporting points, and a short conclusion.`;
  }

  if (mode === 'Summary') {
    return `Summary: ${cleanPrompt}\nMain point: keep the core idea.\nRemember: convert long notes into 3 short bullets and one revision question.`;
  }

  return `Doubt solved step by step: ${cleanPrompt}\n1. Identify what is being asked.\n2. Break it into smaller parts.\n3. Practice one similar example to confirm you understood it.`;
}