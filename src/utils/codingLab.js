export function getCodingLabIdFromHomework(item = {}) {
  const text = `${item.title || ''} ${item.subject || ''} ${item.type || ''} ${item.brief || ''}`.toLowerCase();
  if (!/(coding|code|program|html|css|javascript|python|java|sql|scratch|website|login page)/.test(text)) return'';
  if (/(html|css|javascript|website|web page|login page)/.test(text)) return 'html';
  if (/python/.test(text)) return 'python';
  if (/java/.test(text)) return 'java';
  if (/sql|database|query/.test(text)) return 'sql';
  if (/scratch/.test(text)) return 'scratch';
  return 'html';
}