const babel = require('@babel/core')
const parser = require('@babel/parser')
const generate = require('@babel/generator').default
const frame = require('@babel/code-frame')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const { addSideEffect, addNamed } = require('@babel/helper-module-imports')
const fs = require('fs')
const plugin = require('babel-plugin-import').default

const code = fs.readFileSync('./index.js', 'utf8')

const ast = parser.parse(code, {
  sourceType: 'module'
})

const paths = []
traverse(ast, {
  // ReferencedIdentifier(path) {
  //   let importName = this.importName
  //   if (importName) {
  //     importName = t.cloneDeep(importName)
  //   } else {
  //     // require('bluebird').coroutine
  //     importName = this.importName = addNamed(path, 'coroutine', 'bluebird')
  //   }

  //   path.replaceWith(importName)
  // }
  Program(path) {
    console.log(path)
    addSideEffect(path, 'index.scss')
  },
  VariableDeclaration(path) {
    const nodes = path.getBindingIdentifiers()
    const paths = path.getBindingIdentifierPaths()
  },
  ArrayExpression(path, state) {
    const file = (path.hub && path.hub.file) || (state && state.file)
    const node = path.node.elements
    node[0] = Object.assign({}, addSideEffect(file.path, 'style/css'))
  },
  ImportDeclaration(path, state) {
    const { node } = path
    const be = t.binaryExpression('*', t.identifier('a'), t.identifier('b'))
    const dec = t.variableDeclaration('const', [
      t.variableDeclarator(t.identifier('sum'), be)
    ])

    const body = path.parent.body
    let hasDeclare = false
    body.forEach(b => {
      if (t.isVariableDeclaration(b)) {
        hasDeclare = true
      }
    })
    if (!hasDeclare) {
      path.insertBefore(dec)
    }
  },
  FunctionDeclaration(path, state) {
    const expressionStatement = t.expressionStatement(
      t.callExpression(t.identifier('require'), [t.stringLiteral('lodash')])
    )
    path.insertBefore(expressionStatement)
  },
  BlockStatement(path, state) {
    if (t.isProgram(path.parent)) {
      let variable = null
      if (t.isVariableDeclaration((variable = path.parent.body[0]))) {
      }
    }
  }
})

const result = generate(ast, {}, code)

console.log(result)
