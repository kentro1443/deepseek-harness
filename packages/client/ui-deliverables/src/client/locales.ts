/** `deliverables` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'deliverables'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'produced.label': '产物',
  'produced.moreOne': '+ 1 个文件',
  'produced.more': '+ {count} 个文件',
  'produced.open': '打开 {name}',
  'produced.showInFolder': '在文件夹中显示',
  'produced.editedCount': '已编辑 {count} 个文件',
  'produced.undo': '撤销',
  'produced.review': '审查',
  'produced.changes': '变更',
}

/** English dictionary (same key set). */
export const en: Record<DeliverablesKey, string> = {
  'produced.label': 'Produced',
  'produced.moreOne': '+ 1 file',
  'produced.more': '+ {count} files',
  'produced.open': 'Open {name}',
  'produced.showInFolder': 'Show in folder',
  'produced.editedCount': 'Edited {count} file(s)',
  'produced.undo': 'Undo',
  'produced.review': 'Review',
  'produced.changes': 'Changes',
}

/** Union of this namespace's dictionary keys. */
export type DeliverablesKey = keyof typeof zh
