import { lr } from "../dist/index.js"
import { fileTests } from "@lezer/generator/dist/test"
import * as LZGen from "@lezer/generator"
import { pretty } from "@cookshack/codemirror-lang-lezer-tree"

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from 'url'
import assert from 'node:assert/strict'

let caseDir = path.dirname(fileURLToPath(import.meta.url))

function test1(file) {
  let name = /^[^\.]*/.exec(file)[0]
  describe(name, () => {
    let content
    content = fs.readFileSync(path.join(caseDir, file), "utf8")
    //console.log(content)
    for (let {name, run} of fileTests(content, file))
      it(name, () => run(lr.parser))
  })
}

function testAll() {
  for (let file of fs.readdirSync(caseDir)) {
    if (!/\.txt$/.test(file)) continue
    test1(file)
  }
}

function canon
(str) {
  return str.replace(/\s+/g, '')
}

function testFiles
(testName, parser, ext) {
  function isInput
  (file) {
    return file.endsWith('.' + ext) && ((file.match(/\./g) || []).length == 1)
  }

  globalThis.describe(testName, () => {
    for (let file of fs.readdirSync(caseDir))
      if (isInput(file)) {
        let content, name

        content = fs.readFileSync(path.join(caseDir, file), 'utf8')
        name = /^[^\.]*/.exec(file)[0]
        globalThis.it(name, () => {
          let tree, expected

          expected = fs.readFileSync(path.join(caseDir, name + '.' + ext + '.leztree'), 'utf8')?.trim()
          tree = parser.parse(content)
          //console.log(pretty(tree.topNode))
          assert.equal(canon(pretty(tree.topNode)), canon(expected))
        })
      }
  })
}

//console.log(process.argv)
//console.log('single: ' + process.env.npm_config_singletest)

if (process.env.npm_config_singletest)
  test1(process.env.npm_config_singletest + '.txt')
else {
  testAll()
  testFiles('INI', lr.parser, 'ini')
}
