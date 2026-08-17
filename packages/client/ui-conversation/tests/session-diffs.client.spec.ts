// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import type { ConversationNode, ToolResultNode } from '@deepseek-ai/dsh-client-runtime/client'
import { collectSessionDiffs, extractNodeDiffs } from '../src/client/session-diffs.ts'

describe('session-diffs', () => {
  it('extractNodeDiffs extracts hunks from explicit card: diff view', () => {
    const node: ToolResultNode = {
      kind: 'tool-result',
      seq: 1,
      time: 100,
      callId: 'c1',
      call: { name: 'write', argsRaw: '{}' },
      callTime: 90,
      content: [],
      isError: false,
      callView: null,
      resultView: {
        card: 'diff',
        diffs: [{ path: 'src/app.ts', oldText: null, newText: 'console.log("hello")\nconsole.log("world")' }],
      },
      subCalls: [],
    }

    const hunks = extractNodeDiffs(node)
    expect(hunks).toEqual([
      { path: 'src/app.ts', oldText: null, newText: 'console.log("hello")\nconsole.log("world")' },
    ])
  })

  it('extractNodeDiffs falls back to write/edit argsRaw when view is missing', () => {
    const node: ToolResultNode = {
      kind: 'tool-result',
      seq: 2,
      time: 200,
      callId: 'c2',
      call: { name: 'edit', argsRaw: JSON.stringify({ file_path: 'src/index.ts', old_string: 'old', new_string: 'new1\nnew2' }) },
      callTime: 190,
      content: [],
      isError: false,
      callView: null,
      resultView: null,
      subCalls: [],
    }

    const hunks = extractNodeDiffs(node)
    expect(hunks).toEqual([
      { path: 'src/index.ts', oldText: 'old', newText: 'new1\nnew2' },
    ])
  })

  it('collectSessionDiffs aggregates file diffs and total line counts across nodes', () => {
    const nodes: ConversationNode[] = [
      {
        kind: 'tool-result',
        seq: 1,
        time: 100,
        callId: 'c1',
        call: { name: 'write', argsRaw: '{}' },
        callTime: 90,
        content: [],
        isError: false,
        callView: null,
        resultView: {
          card: 'diff',
          diffs: [{ path: 'src/app.ts', oldText: null, newText: 'line1\nline2' }],
        },
        subCalls: [],
      },
      {
        kind: 'tool-result',
        seq: 2,
        time: 200,
        callId: 'c2',
        call: { name: 'edit', argsRaw: '{}' },
        callTime: 190,
        content: [],
        isError: false,
        callView: null,
        resultView: {
          card: 'diff',
          diffs: [{ path: 'src/app.ts', oldText: 'oldLine', newText: 'line3' }],
        },
        subCalls: [],
      },
      {
        kind: 'tool-result',
        seq: 3,
        time: 300,
        callId: 'c3',
        call: { name: 'edit', argsRaw: '{}' },
        callTime: 290,
        content: [],
        isError: false,
        callView: null,
        resultView: {
          card: 'diff',
          diffs: [{ path: 'src/components/Header.tsx', oldText: 'prev', newText: 'next1\nnext2\nnext3' }],
        },
        subCalls: [],
      },
    ]

    const summary = collectSessionDiffs(nodes)
    expect(summary.totalAdded).toBe(6) // 2 + 1 + 3
    expect(summary.totalRemoved).toBe(2) // 0 + 1 + 1
    expect(summary.files).toHaveLength(2)

    const appFile = summary.files.find(f => f.path === 'src/app.ts')
    expect(appFile).toBeDefined()
    expect(appFile?.added).toBe(3)
    expect(appFile?.removed).toBe(1)
    expect(appFile?.hunks).toHaveLength(2)
  })
})
