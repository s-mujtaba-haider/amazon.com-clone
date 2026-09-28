#!/usr/bin/env node
// Agent capture hook for Claude Code.
// Wired in .claude/settings.json:
//   UserPromptSubmit -> `capture.js prompt`   (logs the prompt verbatim)
//   Stop             -> `capture.js stop`     (logs the final response of the turn)
// Writes one markdown file per session to <repo>/.agent-logs/.
// No hook input carries the model name; it only appears on assistant messages in the
// transcript. So at Stop, the model line of that turn's PROMPT entry is set to the model
// that actually answered it (covers the first prompt of a session and /model switches).
// Must never block or fail the agent: every error is swallowed and exit code is 0.

const fs = require('fs');
const path = require('path');

const AUTHOR = 's-mujtaba-haider';
const TOOL = 'claude-code';

const event = process.argv[2];

function readStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch { return ''; }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function projectDir(input) {
  return process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
}

function stateFile(root, sid) {
  const dir = path.join(root, '.claude', 'hooks', '.state');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${sid}.json`);
}

function loadState(root, sid) {
  try { return JSON.parse(fs.readFileSync(stateFile(root, sid), 'utf8')); } catch { return {}; }
}

function saveState(root, sid, st) {
  fs.writeFileSync(stateFile(root, sid), JSON.stringify(st, null, 2));
}

function readTranscript(p) {
  if (!p) return [];
  let raw;
  try { raw = fs.readFileSync(p, 'utf8'); } catch { return []; }
  const out = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    try { out.push(JSON.parse(line)); } catch { /* partial line */ }
  }
  return out;
}

function lastModel(entries) {
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i];
    const m = e.type === 'assistant' && e.message && e.message.model;
    if (m && m !== '<synthetic>' && !e.isSidechain) return m;
  }
  return null;
}

function resolveModel(entries, st, input) {
  return lastModel(entries) || st.model || process.env.ANTHROPIC_MODEL || 'unknown';
}

// A "real" user prompt: typed by the human, not a tool result / meta / compaction summary.
function promptText(e) {
  if (e.type !== 'user' || e.isMeta || e.isSidechain || e.isCompactSummary) return null;
  const c = e.message && e.message.content;
  if (typeof c === 'string') return c;
  if (!Array.isArray(c)) return null;
  if (c.some(b => b.type === 'tool_result')) return null;
  const t = c.filter(b => b.type === 'text').map(b => b.text).join('\n');
  return t || null;
}

// Final response = assistant text emitted after the last tool call of the turn.
function extractTurn(entries) {
  let pi = -1;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (promptText(entries[i]) !== null) { pi = i; break; }
  }
  if (pi < 0) return null;
  let texts = [];
  let ts = null;
  let model = null;
  let endsWithText = false;
  for (let i = pi + 1; i < entries.length; i++) {
    const e = entries[i];
    if (e.type !== 'assistant' || e.isSidechain) continue;
    const c = (e.message && e.message.content) || [];
    for (const b of Array.isArray(c) ? c : []) {
      if (b.type === 'tool_use') { texts = []; ts = null; endsWithText = false; }
      else if (b.type === 'text' && b.text) { texts.push(b.text); ts = e.timestamp; endsWithText = true; }
    }
    if (e.message && e.message.model && e.message.model !== '<synthetic>') model = e.message.model;
  }
  return {
    prompt: promptText(entries[pi]),
    promptTs: entries[pi].timestamp,
    response: texts.join('\n\n'),
    responseTs: ts,
    model,
    endsWithText,
  };
}

function pad(n) { return String(n).padStart(2, '0'); }

function logFile(root, sid, iso) {
  const dir = path.join(root, '.agent-logs');
  fs.mkdirSync(dir, { recursive: true });
  const existing = fs.readdirSync(dir).find(f => f.endsWith(`_${sid}.md`));
  if (existing) return path.join(dir, existing);
  const d = new Date(iso);
  const name = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}_` +
    `${pad(d.getUTCHours())}-${pad(d.getUTCMinutes())}-${pad(d.getUTCSeconds())}_${sid}.md`;
  return path.join(dir, name);
}

function header(sid, root, body) {
  const prompts = [...body.matchAll(/\[LOG_ENTRY type=PROMPT num=\d+ [^\]]*\]\ntimestamp: (\S+)/g)].map(m => m[1]);
  const models = [];
  for (const m of body.matchAll(/^\[LOG_ENTRY [^\]]*\]\ntimestamp: \S+\nmodel: (\S+)/gm)) {
    if (!models.includes(m[1])) models.push(m[1]);
  }
  const first = prompts[0] || '';
  const project = path.basename(root);
  return [
    '---',
    `session_id: ${sid}`,
    `date: ${first.slice(0, 10)}`,
    `author: ${AUTHOR}`,
    `model: ${models.join(', ') || 'unknown'}`,
    `tool: ${TOOL}`,
    `project: ${project}`,
    `total_exchanges: ${prompts.length}`,
    `first_prompt_time: ${first}`,
    `last_prompt_time: ${prompts[prompts.length - 1] || ''}`,
    '---',
    '',
    `# Session Log - ${first.slice(0, 10)}`,
    '',
    `Session: \`${sid.slice(0, 8)}\` | Project: \`${project}\` | Author: \`${AUTHOR}\``,
    '',
    '---',
    '',
    '',
  ].join('\n');
}

function appendEntry(root, sid, type, num, ts, model, text, promptModel) {
  const file = logFile(root, sid, ts);
  let body = '';
  try {
    const cur = fs.readFileSync(file, 'utf8');
    const i = cur.indexOf('[LOG_ENTRY');
    body = i >= 0 ? cur.slice(i) : '';
  } catch { /* new file */ }
  if (promptModel) {
    const tag = `[LOG_ENTRY type=PROMPT num=${num} `;
    const at = body.lastIndexOf(tag);
    if (at >= 0) {
      const m = body.indexOf('\nmodel: ', at);
      const eol = body.indexOf('\n', m + 1);
      if (m >= 0 && eol >= 0) body = body.slice(0, m) + `\nmodel: ${promptModel}` + body.slice(eol);
    }
  }
  body += `[LOG_ENTRY type=${type} num=${num} session=${sid.slice(0, 8)}]\n` +
    `timestamp: ${ts}\nmodel: ${model}\n\n${text}\n\n\n`;
  fs.writeFileSync(file, header(sid, root, body) + body);
}

function main() {
  const input = JSON.parse(readStdin() || '{}');
  const sid = input.session_id;
  if (!sid) return;
  const root = projectDir(input);
  const st = loadState(root, sid);

  if (event === 'prompt') {
    const entries = readTranscript(input.transcript_path);
    const model = resolveModel(entries, st, input);
    const num = (st.count || 0) + 1;
    const ts = new Date().toISOString();
    appendEntry(root, sid, 'PROMPT', num, ts, model, input.prompt ?? '');
    Object.assign(st, { count: num, pending: num, model });
    saveState(root, sid, st);
    return;
  }

  if (event === 'stop') {
    // The transcript may not be fully flushed when Stop fires; wait briefly for the final text.
    let turn = null;
    for (let i = 0; i < 20; i++) {
      turn = extractTurn(readTranscript(input.transcript_path));
      if (turn && turn.endsWithText) break;
      sleep(150);
    }
    const final = (turn && turn.endsWithText && turn.response) || input.last_assistant_message ||
      (turn && turn.response) || '';
    const model = (turn && turn.model) || resolveModel([], st, input);
    let num = st.pending;
    if (!num) {
      // Prompt was not seen by UserPromptSubmit (e.g. hook installed mid-turn): recover it.
      if (!turn || turn.prompt === null) return;
      num = (st.count || 0) + 1;
      appendEntry(root, sid, 'PROMPT', num, turn.promptTs || new Date().toISOString(), model, turn.prompt);
      st.count = num;
    }
    appendEntry(root, sid, 'RESPONSE', num, (turn && turn.responseTs) || new Date().toISOString(), model, final,
      turn && turn.model);
    Object.assign(st, { pending: null, model });
    saveState(root, sid, st);
  }
}

try { main(); } catch (e) {
  try {
    fs.appendFileSync(path.join(process.env.CLAUDE_PROJECT_DIR || process.cwd(), '.claude', 'hooks', '.state', 'errors.log'),
      `${new Date().toISOString()} ${event} ${e && e.stack}\n`);
  } catch { /* ignore */ }
}
process.exit(0);
