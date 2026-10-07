import { sampleSqlStudents } from '../data/mockData.js';

function splitCodeArgs(value) {
  const args = [];
  let current = '';
  let quote = '';
  let depth = 0;

  for (const char of value) {
    if ((char === '"' || char === "'") && !quote) {
      quote = char;
    } else if (char === quote) {
      quote = '';
    } else if (!quote && char === '(') {
      depth += 1;
    } else if (!quote && char === ')') {
      depth = Math.max(0, depth - 1);
    }

    if (!quote && depth === 0 && char === ',') {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) args.push(current.trim());
  return args;
}

function splitCodePlus(value) {
  const parts = [];
  let current = '';
  let quote = '';
  let depth = 0;

  for (const char of value) {
    if ((char === '"' || char === "'") && !quote) {
      quote = char;
    } else if (char === quote) {
      quote = '';
    } else if (!quote && char === '(') {
      depth += 1;
    } else if (!quote && char === ')') {
      depth = Math.max(0, depth - 1);
    }

    if (!quote && depth === 0 && char === '+') {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function readCodeValue(expression) {
  const clean = expression.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    return clean.slice(1, -1);
  }

  if (/^[\d\s+\-*/().]+$/.test(clean)) {
    try {
      return Function(`"use strict"; return (${clean});`)();
    } catch (error) {
      return clean;
    }
  }

  return clean.replace(/[()]/g, '').trim();
}

export function runPythonCode(code) {
  const lines = [];
  const printRegex = /print\((.*?)\)/gms;
  let match = printRegex.exec(code);

  while (match) {
    lines.push(splitCodeArgs(match[1]).map(readCodeValue).join(' '));
    match = printRegex.exec(code);
  }

  return lines.length ? lines.join('\n') : 'No output. Use print("message") to show output.';
}

export function runJavaCode(code) {
  const lines = [];
  const printRegex = /System\.out\.println?\((.*?)\);/gms;
  let match = printRegex.exec(code);

  while (match) {
    const parts = splitCodePlus(match[1]).map(readCodeValue);
    lines.push(parts.join('').replace(/\s+/g, ' ').trim());
    match = printRegex.exec(code);
  }

  return lines.length ? lines.join('\n') : 'No output. Use System.out.println("message"); to show output.';
}

export function runSqlCode(code) {
  const rawFields = code.match(/select\s+(.+?)\s+from/is)?.[1]?.trim() || '*';
  const selectedFields = rawFields === '*'
    ? ['name', 'className', 'progress', 'quiz']
    : rawFields.split(',').map((field) => field.trim()).filter(Boolean);
  const progressLimit = Number(code.match(/progress\s*>=\s*(\d+)/i)?.[1] || 0);
  const classFilter = code.match(/className\s*=\s*['"]([^'"]+)['"]/i)?.[1];
  const rows = sampleSqlStudents.filter((student) => (
    student.progress >= progressLimit && (!classFilter || student.className === classFilter)
  ));

  const header = selectedFields.join(' | ');
  const divider = selectedFields.map(() => '---').join(' | ');
  const body = rows.map((row) => selectedFields.map((field) => row[field] ?? '-').join(' | '));
  return [`${rows.length} row${rows.length === 1 ? '' : 's'} returned`, '', header, divider, ...body].join('\n');
}
