import * as Grammar from './syntax.grammar'
import { LRLanguage, LanguageSupport, foldNodeProp, foldInside } from '@codemirror/language'

let props, data, parser

function foldDef
(tree) {
  let ident, arrow

  ident = tree.firstChild
  arrow = ident?.nextSibling
  return arrow ? { from: arrow.to, to: tree.to } : null
}

function foldAction
(tree) {
  if ((tree.to - tree.from) > 1)
    return { from: tree.from + 1, to: tree.to - 1 }
  return null
}

props = [ foldNodeProp.add({ 'Group': foldInside,
                             Def: foldDef,
                             Action: foldAction }) ]

data = { commentTokens: { line: '#' },
         closeBrackets: { brackets: '[' } }

parser = Grammar.parser.configure({ props: props })

/// A language provider, including highlighting and indentation
/// information.
export
const lr = LRLanguage.define({ name: 'ini',
                               parser: parser,
                               languageData: data })

/// Language support.
export
function language
() {
  return new LanguageSupport(lr)
}
