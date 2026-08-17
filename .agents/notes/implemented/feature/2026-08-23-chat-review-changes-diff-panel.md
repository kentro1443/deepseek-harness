# Agent Note: Chat review changes tab and git diff panel

Status: implemented

English | [中文](2026-08-23-chat-review-changes-diff-panel.zh.md)

## Problem

When chatting with the assistant and performing file modifications, users had no dedicated entry point to inspect session-wide file changes or view aggregated Git diffs directly in the right-hand panel. Previous tool output rows only showed diff cards on a per-call basis, making it difficult to review all changes in a unified view.

## Decision

**Added a Review Changes feature with a dedicated side panel diff viewer and header action.**

1. **Header Action & Selection Target**:
   - Registered `ReviewChangesAction` into the `conversation.session.header.utilities` slot.
   - Displays a "Changes" button with total additions and deletions (`+A -B`) whenever file changes exist in the current session.
   - Clicking the button dispatches an `openDetails` call with a review selection target (`toolName: 'review'`), opening the right-hand details column.

2. **Git Diff Viewer in Details Panel**:
   - Enhanced `DetailsPanel` to handle review selection targets.
   - Aggregates file diffs and line stats across all session nodes via `collectSessionDiffs`.
   - Renders a Review header showing branch information, change counts, and file-by-file diff cards using `DiffBlock`.

3. **Turn Tail Produced Files Integration**:
   - Updated `ProducedFiles` in `@deepseek-ai/dsh-client-ui-deliverables` to render an edited files card header with "Edited N file(s)", "Undo", and "Review" action buttons.
   - Clicking "Review" triggers the same details panel review mode.

## Alternatives considered

**Relying solely on per-tool-call diff cards.** Rejected because users modifying multiple files across turns need a single consolidated panel to review all changes before committing or taking next steps.

**Opening a full-page modal diff view.** Rejected because side panel layout preserves conversational context while inspecting file diffs.

## Consequences

Users can now easily review session-wide file changes from both the conversation turn deliverable card and the header utilities action, bringing a unified Git diff panel experience inspired by modern AI coding assistants.
