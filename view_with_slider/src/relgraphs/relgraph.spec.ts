/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
import { RelGraph, Edge, Node } from './relgraph';

interface Comment {
  text: string;
  date: number;
  scores: {[attr: string]: number};
}

describe('Relative Rating Graphs for CrowdSourcing', () => {
  let comments: Comment[] = [];

  beforeEach(() => {
    /* tslint:disable */
    comments = [
      { 'text': 'They have their heads up their ass.',
        'scores': { 'TOXICITY': 0.93 },
        'date': 111
      },
      { 'text': 'How can you be so stupid?',
        'scores': { 'TOXICITY': 0.91 },
        'date': 222
      },
      {
        'text': 'They are liberal idiots who are uneducated.',
        'scores': { 'TOXICITY': 0.9 },
        'date': 333
      },
      {
        'text': 'Theyre stupid, its getting warmer, we should enjoy it while it lasts.',
        'scores': { 'TOXICITY': 0.86 },
        'date': 444
      },
    ];
  });

  it('simple graph', () => {
    let g = new RelGraph<string>();
    let foo = g.addNode('foo');
    let bar = g.addNode('bar');
    let ugg = g.addNode('ugg');
    let uff = g.addNode('uff');
    let foo_bar = g.addEdge(foo, bar, '>');
    let bar_ugg = g.addEdge(ugg, bar, '<');
    let ugg_uff = g.addEdge(ugg, uff, '=');

    expect(g.relatedNodeNames('>', foo)).toBe([bar.name]);
    expect(g.relatedNodeNames('>', bar)).toBe([ugg.name, uff.name]);
    expect(g.relatedNodeNames('>', bar)).toBe([uff.name, ugg.name]);
    expect(g.relatedNodeNames('>', ugg)).toBe([]);
    expect(g.relatedNodeNames('>', uff)).toBe([]);
    expect(g.relatedNodeNames('=', ugg)).toBe([uff.name]);
    expect(g.relatedNodeNames('=', uff)).toBe([ugg.name]);
  });
});
