import { useMemo } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { SelectionTarget } from '../contract/views.ts'
import { collectSessionDiffs } from '../session-diffs.ts'
import { NS } from '../locales.ts'
import css from './ReviewChangesAction.module.css'

export interface ReviewChangesActionInjected {
  openDetails: (target: SelectionTarget) => void
}

export type ReviewChangesActionProps =
  & PropsRuntime<'conversation.session.header.utilities'>
  & PropsLocale<typeof NS>
  & ReviewChangesActionInjected

export function ReviewChangesAction({ useSession, openDetails, t }: ReviewChangesActionProps) {
  const nodes = useSession(s => s.nodes)
  const diffs = useMemo(() => collectSessionDiffs(nodes), [nodes])

  if (diffs.files.length === 0) return null

  return (
    <button
      type="button"
      className={css.button}
      aria-label={t('details.changes')}
      onClick={() => {
        openDetails({ turnSeq: 0, callId: 'review', toolName: 'review' })
      }}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden className={css.icon}>
        <path d="M4 3h8M4 7h8M4 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span>{t('details.changes')}</span>
      <span className={css.stats}>
        <span className={css.add}>+{diffs.totalAdded}</span>
        <span className={css.del}>-{diffs.totalRemoved}</span>
      </span>
    </button>
  )
}
