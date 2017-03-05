
import * as Rewrite from '@buggyorg/rewrite'
import * as Graph from '@buggyorg/graphtools'

const Algorithm = Graph.Algorithm
const Node = Graph.Node
const GraphRew = Graph.Rewrite

const ifThunk = () =>
  ({
    componentId: 'ifThunk',
    ports: [
      {port: 'cond', kind: 'input', type: 'Bool'},
      {port: 'a', kind: 'input', type: 'generic'},
      {port: 'b', kind: 'input', type: 'generic'},
      {port: 'out', kind: 'output', type: 'generic'}
    ],
    atomic: true
  })

export default Rewrite.applyNode(
  (node) => Node.component(node) === 'if',
  (node, graph) => {
    const lca = Algorithm.lowestCommonAncestors([Node.port('a', node), Node.port('b', node)], graph)
    const subsetA = Algorithm.predecessorsUpTo(Node.port('a', node), lca, graph)
    const subsetB = Algorithm.predecessorsUpTo(Node.port('b', node), lca, graph)
    return Graph.flow(
      Graph.Let([
        Graph.addNode(ifThunk()),
        GraphRew.replaceByThunk(subsetA),
        GraphRew.replaceByThunk(subsetB)
      ], ([ifThunk, lambdaA, lambdaB], graph) => {
        return Graph.flow(
          Graph.addEdge({from: Node.port('fn', lambdaA[1]), to: Node.port('a', ifThunk)}),
          Graph.addEdge({from: Node.port('fn', lambdaB[1]), to: Node.port('b', ifThunk)}),
          Graph.addEdge({from: Graph.predecessor(Node.port('cond', node), graph), to: Node.port('cond', ifThunk)})
        )(graph)
      }),
      Graph.removeNode(node)
    )(graph)
  },
  {
    name: 'convert if to ifThunk',
    constraints: {
      requires: ['resolve'],
      before: ['typify']
    }
  }
)
