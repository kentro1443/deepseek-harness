// DetailsPanel: close button + the selected call's args and
// result — args as JSON, the result raw except for a terminal-card call, whose
// Output section is the command's terminal card. Also supports Review Git Diff
// mode when selected. Reads the selection from the shared chat store
// and derives material from the session snapshot.

import { Fragment, useMemo } from 'react'
import { CodeBlock, DiffBlock } from '@deepseek-ai/dsh-client-ui-primitives'
import { shallowEqual } from '@deepseek-ai/dsh-client-runtime/client'
import type { ConversationSnapshot, RunningToolCall, ToolCallBlock, ToolResultNode } from '@deepseek-ai/dsh-client-runtime/client'
import type { DetailsSlotProps } from '../contract/slots.ts'
import { findToolCall } from '../chat/tool-node-reader.ts'
import { collectSessionDiffs } from '../session-diffs.ts'
import css from './DetailsPanel.module.css'

/** Full props composed by reference from the contract (automatic shares & injected share). */
export type DetailsPanelProps = DetailsSlotProps

interface CallMaterial {
  name: string
  argsRaw: string | null
  block: ToolCallBlock
}

function settledMaterial(node: ToolResultNode, callId: string): CallMaterial {
  return { name: node.call?.name ?? callId, argsRaw: node.call?.argsRaw ?? null, block: node }
}

function runningMaterial(call: RunningToolCall): CallMaterial {
  return { name: call.name, argsRaw: call.argsRaw, block: call }
}

function materialFor(s: ConversationSnapshot, callId: string): CallMaterial | null {
  const found = findToolCall(s, callId)
  if (found === undefined) return null
  return 'kind' in found ? settledMaterial(found, callId) : runningMaterial(found)
}

function pretty(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

function rawResultText(block: ToolCallBlock): string {
  if (!('kind' in block)) return ''
  const parts = block.content.map(item => item.type === 'text' ? item.text : JSON.stringify(item, null, 2))
  if (parts.length === 0 && block.error !== undefined) parts.push(`${block.error.name}: ${block.error.code}`)
  return parts.join('\n')
}

export function DetailsPanel({ useSession, useSessions, sessionId, useStore, renderSlot, closeDetails, t }: DetailsPanelProps) {
  const selection = useStore(s => s.selection)
  const sessionCwd = useSessions(list => list.byId[sessionId]?.cwd)
  const callId = selection?.callId

  const isReviewMode = selection?.toolName === 'review' || selection?.callId === 'review'

  const material = useSession(
    s => (callId === undefined || isReviewMode ? null : materialFor(s, callId)),
    (a, b) => shallowEqual(a, b))

  const nodes = useSession(s => s.nodes)
  const sessionDiffs = useMemo(() => (isReviewMode ? collectSessionDiffs(nodes) : null), [isReviewMode, nodes])

  if (isReviewMode && sessionDiffs !== null) {
    return (
      <div className={css.root}>
        <div className={css.header}>
          <div className={css.titleCluster}>
            <div className={css.title}>{t('details.reviewTitle')}</div>
            {sessionDiffs.files.length > 0 && (
              <div className={css.diffBadge}>
                <span className={css.addStat}>+{sessionDiffs.totalAdded}</span>
                <span className={css.delStat}>-{sessionDiffs.totalRemoved}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className={css.close}
            aria-label={t('details.close')}
            onClick={() => { closeDetails() }}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className={css.body}>
          {sessionDiffs.files.length === 0 ? (
            <div className={css.empty}>{t('details.noChanges')}</div>
          ) : (
            <div className={css.diffList}>
              <div className={css.diffSubheader}>
                <span className={css.branchInfo}>{t('details.branchInfo')}</span>
                <span className={css.fileCount}>{t('details.changesCount', { count: String(sessionDiffs.files.length) })}</span>
              </div>
              {sessionDiffs.files.map(file => (
                <div key={file.path} className={css.fileDiffCard}>
                  <div className={css.fileDiffHeader}>
                    <span className={css.filePath}>{file.path}</span>
                    <span className={css.fileDiffStats}>
                      <span className={css.addStat}>+{file.added}</span>
                      <span className={css.delStat}>-{file.removed}</span>
                    </span>
                  </div>
                  <DiffBlock diffs={file.hunks} className={css.diffBlock} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={css.root}>
      <div className={css.header}>
        <div className={css.title}>
          {selection === null ? t('details.title') : material?.name ?? selection.toolName ?? t('details.title')}
        </div>
        <button
          type="button" className={css.close} aria-label={t('details.close')}
          onClick={() => { closeDetails() }}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className={css.body}>
        {selection === null || callId === undefined
          ? <div className={css.empty}>{t('details.empty')}</div>
          : material === null
            ? <div className={css.empty}>{t('details.notInWindow')}</div>
            : (
              <>
                {material.argsRaw !== null && (
                  <section className={css.section}>
                    <div className={css.sectionLabel}>{t('details.input')}</div>
                    <CodeBlock code={pretty(material.argsRaw)} lang="json" copyLabel={t('copy')} copiedLabel={t('copied')} />
                  </section>
                )}
                <section className={css.section}>
                  <div className={css.sectionLabel}>{t('details.output')}</div>
                  <Fragment key={callId}>
                    {renderSlot('conversation.details.tool', { block: material.block, cwd: sessionCwd }, {
                      fallback: 'kind' in material.block
                        ? (
                          <pre className={css.code} data-error={material.block.isError || undefined}>
                            {rawResultText(material.block)}
                          </pre>
                        )
                        : <div className={css.empty}>{t('details.running')}</div>,
                    })}
                  </Fragment>
                </section>
              </>
            )}
      </div>
    </div>
  )
}
