const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const t = require('@babel/types')

const fun = `
async function square(n) {
  const rtn = await $$asyncCall()
  const x = await 3
  function two() {
    console.log(rtn)
  }
  return rtn
}
`
const ast = parser.parse(fun)

const MyVisitor = {
  Program(path, state) {},
  FunctionDeclaration(path) {
    console.log(t.isProgram(path.scope.path.parent))
    console.log(path.scope)
  },
  VariableDeclaration(path, state) {
    // console.log('===========', state)
  },
  AwaitExpression(path, state) {
    if (!t.isCallExpression(path.node.argument)) {
      return
    }
    const callee = path.node.argument.callee
    if (callee.name.startsWith('$$')) {
      callee.name = callee.name.substring(2)
      const variableDeclaration = path.findParent(path =>
        path.isVariableDeclaration()
      )
      const old = t.clone(variableDeclaration)
      variableDeclaration.replaceWith(
        t.tryStatement(
          t.blockStatement([old]),
          t.catchClause(
            t.identifier('error'),
            t.blockStatement([
              t.returnStatement(
                t.binaryExpression(
                  '+',
                  t.identifier('a'),
                  t.binaryExpression('*', t.identifier('x'), t.identifier('y'))
                )
              ),
            ])
          )
        )
      )
    }
  },
}

traverse(ast, MyVisitor)

const result = generate(ast)
console.log(result.code)

/**
 * defineType("ClassMethod", {
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method"],
  builder: ["kind", "key", "params", "body", "computed", "static"],
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  fields: {
    kind: {
      validate: chain(assertValueType("string"), assertOneOf("get", "set", "method", "constructor")),
      default: "method"
    },
    computed: {
      default: false,
      validate: assertValueType("boolean")
    },
    static: {
      default: false,
      validate: assertValueType("boolean")
    },
    key: {
      validate(node, key, val) {
        let expectedTypes = node.computed ? ["Expression"] : ["Identifier", "StringLiteral", "NumericLiteral"];
        assertNodeType(...expectedTypes)(node, key, val);
      }
    },
    params: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("LVal")))
    },
    body: {
      validate: assertNodeType("BlockStatement")
    },
    generator: {
      default: false,
      validate: assertValueType("boolean")
    },
    async: {
      default: false,
      validate: assertValueType("boolean")
    }
  }
});g
 */
