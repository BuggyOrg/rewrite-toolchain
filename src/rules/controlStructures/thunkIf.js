

/*
export rule(
  equals(Node.component, 'if'),
  (node, graph) => {
    const lca = Algorithm.lowestCommonAncestors([Node.port('a', node), 'Node.port('b', node)], graph)
    const subsetA = Algorithm.predecessorsUpTo(Node.port('a', node), lca, graph)
    const subsetB = Algorithm.predecessorsUpTo(Node.port('b', node), lca, graph)
    return Graph.flow(
      Graph.Let([
        Graph.addNode(ifThunk()),
        convertToThunk(subsetA, graph),
        convertToThunk(subsetB, graph)
      ], ([ifThunk, lambdaA, lambdaB]) => {
        Graph.addEdge({from: Node.port('fn', lambdaA), to: Node.port('a', ifThunk)}),
        Graph.addEdge({from: Node.port('fn', lambdaB), to: Node.port('b', ifThunk)}),
        Graph.addEdge({from: predecessor(Node.port('cond', node), graph), to: Node.port('cond', ifThunk)})
      }),
      Graph.removeNode(node)
    )(graph)
  }
)
*/
