# Fork implementations

English | [中文](README.zh.md)

This README lists only the implementations Nguyen Ba Huan shipped in this checkout. After each new commit by that author, add or refresh the matching section so a reader can see what the commit changed.

## Review Changes tab and git diff panel

`6c9f6d483f` — `feat(ui): add review changes tab and git diff panel`

The conversation header shows a Changes action with session-wide `+additions` / `-deletions` whenever the session has file diffs. Clicking it, or Review on a turn's edited-files card, opens the details panel on a review target that aggregates every session diff into file-by-file `DiffBlock` cards, with branch and change-count summary. Decision record: [chat review changes](.agents/notes/implemented/feature/2026-08-23-chat-review-changes-diff-panel.md).

## Composer provider-group disclosure

`592569ea15` — `feat(ui-model-selection): collapse composer model list by provider`

Each provider group in the composer model menu is a disclosure: the caption is a `menuitem` with `aria-expanded`, a chevron, and the group's model count. The provider that owns the current selection opens by default; explicit toggles last until the menu closes; collapsed models are not rendered, so arrow-key focus walks only visible rows. Decision record: [composer provider disclosure](.agents/notes/implemented/feature/2026-08-17-composer-provider-group-disclosure.md).

## OpenAI-compatible tool-call deltas

`5a600719a6` — `Add OpenAI compatible capability`

`translate()` in `@deepseek-ai/dsh-llm-deepseek` assigns a streamed tool-call `id` or `function.name` only when the delta value is non-empty. OpenAI-compatible providers that send empty strings on continuation chunks therefore keep the identity from the first delta instead of overwriting it.
