import { styleTags, tags as t } from '@lezer/highlight'

export const highlighting = styleTags({
  Header: t.function(t.definition(t.variableName)),
  'Entry/=': t.controlKeyword,
  Key: t.definition(t.variableName),
  Value: t.string,
  Comment: t.lineComment,
  '[ ]': t.squareBracket,
})
