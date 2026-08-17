/**
 * Pure session diff extraction helper. Aggregates file diffs and line stats
 * (+A -B) from ConversationNode tool results across a session snapshot.
 */
import type { ConversationNode, RunningToolCall, ToolResultNode } from '@deepseek-ai/dsh-client-runtime/client'

/** Single file diff hunk payload with path and old/new text. */
export interface FileDiffHunk {
  path: string
  oldText: string | null
  newText: string
}

/** Aggregated diff summary for one file path including total line stats. */
export interface FileDiffSummary {
  path: string
  hunks: FileDiffHunk[]
  added: number
  removed: number
}

/** Aggregated session diffs summary across all files and total line counts. */
export interface SessionDiffsSummary {
  files: FileDiffSummary[]
  totalAdded: number
  totalRemoved: number
}

function countLines(str: string | null): number {
  if (str === null || str.length === 0) return 0
  return str.split(/\r?\n/).length
}

/**
 * Extract diff hunks from a settled tool result or running call node.
 * Reads explicit `card: 'diff'` views first, then falls back to write/edit args.
 * @param node - the tool result or running tool call node to inspect.
 * @returns Array of extracted file diff hunks.
 */
export function extractNodeDiffs(node: ToolResultNode | RunningToolCall): FileDiffHunk[] {
  const view = 'kind' in node ? (node.resultView ?? node.callView) : node.callView
  if (view !== null && view.card === 'diff' && Array.isArray(view.diffs)) {
    const hunks: FileDiffHunk[] = []
    for (const d of view.diffs) {
      if (typeof d === 'object' && d !== null && typeof (d as unknown as Record<string, unknown>).path === 'string') {
        const item = d as unknown as Record<string, unknown>
        hunks.push({
          path: String(item.path),
          oldText: typeof item.oldText === 'string' ? item.oldText : null,
          newText: typeof item.newText === 'string' ? item.newText : '',
        })
      }
    }
    if (hunks.length > 0) return hunks
  }

  if ('call' in node && node.call !== null) {
    const name = node.call.name
    if ((name === 'write' || name === 'edit') && typeof node.call.argsRaw === 'string') {
      try {
        const parsed = JSON.parse(node.call.argsRaw) as Record<string, unknown>
        const path = typeof parsed.file_path === 'string' ? parsed.file_path : (typeof parsed.path === 'string' ? parsed.path : null)
        if (path !== null) {
          const oldText = typeof parsed.old_string === 'string' ? parsed.old_string : null
          const newText = typeof parsed.content === 'string'
            ? parsed.content
            : (typeof parsed.new_string === 'string' ? parsed.new_string : '')
          return [{ path, oldText, newText }]
        }
      } catch {
        // Not JSON
      }
    }
  }

  return []
}

/**
 * Aggregate all file diffs across a session's conversation nodes.
 * @param nodes - list of conversation nodes in the session window.
 * @returns Aggregated session diffs summary with per-file and total stats.
 */
export function collectSessionDiffs(nodes: readonly ConversationNode[]): SessionDiffsSummary {
  const fileMap = new Map<string, FileDiffSummary>()
  let totalAdded = 0
  let totalRemoved = 0

  function processNode(node: ConversationNode | ToolResultNode | RunningToolCall): void {
    if ('kind' in node && node.kind === 'tool-result') {
      const hunks = extractNodeDiffs(node)
      for (const hunk of hunks) {
        const added = countLines(hunk.newText)
        const removed = countLines(hunk.oldText)
        let entry = fileMap.get(hunk.path)
        if (!entry) {
          entry = { path: hunk.path, hunks: [], added: 0, removed: 0 }
          fileMap.set(hunk.path, entry)
        }
        entry.hunks.push(hunk)
        entry.added += added
        entry.removed += removed
        totalAdded += added
        totalRemoved += removed
      }
      if (node.subCalls) {
        for (const sub of node.subCalls) {
          processNode(sub)
        }
      }
    }
  }

  for (const node of nodes) {
    processNode(node)
  }

  return {
    files: Array.from(fileMap.values()),
    totalAdded,
    totalRemoved,
  }
}
