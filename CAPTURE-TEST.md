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

| Session | Kind | File |
|---|---|---|
| `3b330c5a` | interactive (the session that installed the hooks) | `.agent-logs/2026-09-28_16-02-11_3b330c5a-9266-4ef6-bd99-78bb62004842.md` |
| `5d4d24be` | headless `claude -p`, separate session, check #1 | `.agent-logs/2026-09-28_16-04-44_5d4d24be-6089-4a4d-9bb3-c2ac01050a75.md` |
| `88e83c92` | headless, separate session, check #2 | `.agent-logs/2026-09-28_16-05-47_88e83c92-cdf3-4e04-9568-ae758aa16010.md` |
| `20b065f7` | headless, separate session, check #3 + resumed 2nd turn | `.agent-logs/2026-09-28_16-06-07_20b065f7-29a6-42da-8a56-011b2ecbbc69.md` |

The hooks were installed partway through session `3b330c5a`. They were picked up
without a restart: at the end of that first turn, the `Stop` hook recovered prompt #1
from the transcript and logged response #1. Prompt #2 was then captured live by
`UserPromptSubmit`. I did not send the literal `CAPTURE TEST` canary in the
interactive session. The user went straight to the build prompt, which proves the same
thing (captured by hook, no manual step).

## Canary entries (raw)

Separate session (`20b065f7`, check #3, headless), pasted raw from the log:

    [LOG_ENTRY type=PROMPT num=1 session=20b065f7]
    timestamp: 2026-09-28T16:06:07.162Z
    model: claude-opus-5-5

    CAPTURE TEST — 8x assignment, Mujtaba (headless session check #3, regex fix). Reply with one short sentence.


    [LOG_ENTRY type=RESPONSE num=1 session=20b065f7]
    timestamp: 2026-09-28T16:06:09.227Z
    model: claude-opus-5-5

    Capture test #3 got through: the headless session is running and replying for Mujtaba's 8x assignment regex fix check.

Interactive session (`3b330c5a`), second prompt, captured live by `UserPromptSubmit`
(header lines; the full prompt is in the log file):

    [LOG_ENTRY type=PROMPT num=2 session=3b330c5a]
    timestamp: 2026-09-28T16:09:33.517Z
    model: claude-opus-5-5

    ok, sow I want to create complete clone of amazon.com, ...

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
4. **Latent bug found after the canaries.** The first prompt in `3b330c5a` contains the
   example `[LOG_ENTRY ...]` lines from the assignment brief. The model fix-up searched
   for `[LOG_ENTRY type=PROMPT num=N` with `lastIndexOf`, so it could have matched the
   quoted example instead of the real entry. It happened to be a no-op, because the
   example's lines are indented. I anchored the search to the full header line,
   including this session's id and a preceding newline.
