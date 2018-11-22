/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */

// Minimal naming tool to create fresh names.
// TODO: instread of monotonically increasing IDs, use a dedicated safe
// namespace object. That will allow graphs to live a long time and have
// arbitray length sequences of transformation without going over integer
// size limits.
class StringNamer {
  lastNameId = 0;
  constructor(public prefix: string) {}

  fresh(): string {
    this.lastNameId++;
    return this.prefix + this.lastNameId;
  }

  remove(_name: string): void {}
}

export type RelKind = '<' | '>' | '=';

export function oppRel(e: RelKind): RelKind {
  if (e === '<') { return '>'; }
  else if (e === '>') { return '<'; }
  else { return '='; }
}

// Note: Edges are undirected; direction lives in the RelKind.
// This is implemented maintaining the invariuant: id1 < id2.
export class Edge {
  name: string;
  id1: string;
  id2: string;
  rel: RelKind;

  constructor(name: string, fromId: string, toId: string, rel: RelKind) {
    if (fromId < toId) {
      this.id1 = fromId;
      this.id2 = toId;
      this.rel = rel;
    } else {
      this.id1 = toId;
      this.id2 = fromId;
      this.rel = oppRel(rel);
    }
  }
}

export class Node<T> {
  constructor(
    public name: string,
    public data: T,
    public edges: string[]) {}
}

// Relation Graphs of some kind of data.
export class RelGraph<T> {
  edgeNamer: StringNamer;
  nodeNamer: StringNamer;

  // Note: we could use a representation where we use pointers. But this
  // approach supports simpler serialization. Maybe change in the future.
  public edges: { [edgeId: string]: Edge };
  public nodes: { [nodeId: string]: Node<T> };

  // Invariants:
  //  1. No broken references:
  //    ALL x. edges[x].firstId in nodes
  //    ALL x. edges[x].secondId in nodes
  //    ALL x. nodes[x].edges[y] in edges

  constructor() {
    this.edgeNamer = new StringNamer('e');
    this.nodeNamer = new StringNamer('n');
  }

  addNode(data: T): Node<T> {
    const node = new Node(this.nodeNamer.fresh(), data, []);
    this.nodes[node.name] = node;
    return node;
  }

  addEdge(src: Node<T>, tgt: Node<T>, rel: RelKind): Edge {
    return this.addEdgeBetweenNames(src.name, tgt.name, rel);
  }

  addEdgeBetweenNames(srcId: string, tgtId: string, rel: RelKind): Edge {
    const edge = new Edge(this.edgeNamer.fresh(), srcId, tgtId, rel);
    this.edges[edge.name] = edge;
    this.nodes[edge.id1].edges.push(edge.name);
    this.nodes[edge.id2].edges.push(edge.name);
    return edge;
  }

  nodeOf(n: Node<T> | string): Node<T> {
    if (typeof n === 'string') {
      return this.nodes[n];
    } else {
      return n;
    }
  }

  relatedNodesNames(rel: RelKind, node: Node<T>): string[] {
    return node.edges.filter(e =>
        (this.edges[e].id1 === node.name
          && this.edges[e].rel === rel) ||
        (this.edges[e].id2 === node.name
          && this.edges[e].rel === oppRel(rel)));
  }

  relatedNodes(kind: RelKind, node: Node<T>): Node<T>[] {
    const nodeNames = this.relatedNodesNames(kind, node);
    return nodeNames.map(name => this.nodes[name]);
  }



}
