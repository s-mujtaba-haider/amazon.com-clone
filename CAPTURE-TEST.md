# Capture Test

## Tool and model

- **Tool:** Claude Code CLI 2.1.283 (Windows 11, run from PowerShell / Git Bash)
- **Model:** `claude-opus-5-5` (Opus 5.5) for both planning and executing. No separate
  planner/executor split and no model switching configured. Any subagent calls run
  inside a turn and are not captured (only prompt and final response are).
- **Automatic mechanism available:** yes. Claude Code has lifecycle hooks configured
  in `settings.json`. This setup uses `UserPromptSubmit` (fires when a prompt is
  submitted, with the prompt text on stdin) and `Stop` (fires when the turn ends, with
  `transcript_path` and `last_assistant_message` on stdin).

## Mechanism

- **Config file changed:** `.claude/settings.json` (project-level, committed, so it
  applies to every session opened in this repo, not only the session that created it)
- **Script:** `.claude/hooks/capture.js` (Node, no dependencies)
  - `UserPromptSubmit` → appends a `PROMPT` entry with the verbatim `prompt` field and
    a UTC timestamp.
  - `Stop` → reads the session transcript JSONL and takes the assistant text written
    after the last tool call of the turn, i.e. the final response. It falls back to
    `last_assistant_message` and appends a `RESPONSE` entry.
  - Thinking, tool calls, and intermediate messages are deliberately skipped.
  - One file per session: `.agent-logs/YYYY-MM-DD_HH-MM-SS_<session-id>.md`. The
    frontmatter (`total_exchanges`, `last_prompt_time`, models used) is regenerated on
    every write, and entries are only ever appended.
  - If `Stop` fires for a turn whose prompt was never logged (e.g. the hooks were
    installed mid-turn), it recovers the prompt from the transcript.
  - Hook bookkeeping (turn counter) lives in `.claude/hooks/.state/`, which is
    gitignored. `.agent-logs/` is **not** gitignored.

## Log files

<!-- filled in after the interactive canaries -->

## Canary entries (raw)

<!-- filled in after the interactive canaries -->

## What I tried first that did not work

1. **Dry-run with Git-Bash paths.** I first piped test input into the script with
   `/c/Users/...` paths. Windows Node reads that as `C:\c\Users\...`, so nothing landed
   where expected. Real hook inputs use Windows paths, so this was a test-harness bug,
   not a hook bug. I moved the dry run into a small Node driver.
2. **Model on the first prompt was `unknown`.** I assumed `SessionStart` would give me
   the model name. I captured the raw hook payloads in a throwaway scratch project,
   and none of `SessionStart`, `UserPromptSubmit`, or `Stop` includes the model. It only
   appears on assistant messages in the transcript. Fix: at `Stop`, the hook sets the
   model line of *that turn's* PROMPT entry to the model that actually answered it.
   This also keeps a `/model` switch accurate for the turn it happens on. I dropped
   the `SessionStart` hook.
3. **First version of that fix did nothing.** I built the regex with `new RegExp` inside
   a template literal, and the `\[` / `\S` escapes were lost. I replaced it with plain
   string search. Headless check #2 (`88e83c92`) still shows `model: unknown` for that
   reason. It was left as-is in `.agent-logs/`, as was check #1 (`5d4d24be`).
