import * as Grammar from './syntax.grammar'
import { LRLanguage, LanguageSupport, foldNodeProp } from '@codemirror/language'

let props, data, parser

function foldGroup
(tree) {
  let header, end

  header = tree.firstChild
  // need this otherwise fold includes trailing nl
  end = tree.lastChild
  return header ? { from: header.to, to: end.to } : null
}

props = [ foldNodeProp.add({ 'Group': foldGroup }) ]

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
