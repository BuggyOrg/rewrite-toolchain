/* global describe, it */

import * as Graph from '@buggyorg/graphtools'
import thunkIf from '../../src/rules/controlStructures/thunkIf'
import * as Rewrite from '@buggyorg/rewrite'
import chai from 'chai'

const expect = chai.expect

const ifNode = (data) =>
  Object.assign({
    componentId: 'if',
    ports: [
      {port: 'cond', kind: 'input', type: 'Bool'},
      {port: 'a', kind: 'input', type: 'generic'},
      {port: 'b', kind: 'input', type: 'generic'},
      {port: 'out', kind: 'output', type: 'generic'}
    ],
    atomic: true
  }, data)

describe('» Control Structures', () => {
  describe('» If to ThunkIf', () => {
    it('can create and compare graphs', () => {
      const graph = Graph.flow(
        Graph.addNode(ifNode({name: 'if'})),
        Graph.addNode({name: 'a', ports: [{port: 'out', kind: 'output', type: 'Number'}]}),
        Graph.addNode({name: 'b', ports: [{port: 'out', kind: 'output', type: 'Number'}]}),
        Graph.addEdge({from: 'a@out', to: 'if@a'}),
        Graph.addEdge({from: 'b@out', to: 'if@b'}),
        Graph.addEdge({from: '@cond', to: 'if@cond'}),
        Graph.addEdge({from: 'if@out', to: '@out'})
      )(Graph.compound({ports: [{port: 'cond', kind: 'input', type: 'Bool'}, {port: 'out', kind: 'output', type: 'generic'}]}))

      const rewGraph = Rewrite.apply(thunkIf, graph)
      expect(Graph.hasNode('/ifThunk', rewGraph)).to.be.true
      expect(Graph.hasNode('/if', rewGraph)).to.not.be.true
      expect(Graph.nodesBy('/functional/lambda', rewGraph)).to.have.length(2)
    })
  })
})
