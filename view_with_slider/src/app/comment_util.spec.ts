/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
import { getCommentTemporalPosDesc, getCommentTemporalPosAsc, ScoredComment } from './comment_util';

describe('comment_util basic functions', () => {
  let comments: ScoredComment[] = [];
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

  it('getCommentTemporalPosAsc(comments[0], comments).sameAt === 0 (=== newPos)',
  () => {
    let newComment = Object.assign({}, comments[0]);
    const { newPos, sameAt } = getCommentTemporalPosAsc(newComment, comments);
    expect(newPos).toBe(sameAt);
    expect(sameAt).toBe(0);
  });

  it('getCommentTemporalPosAsc(comments[n], comments).sameAt === n (=== newPos)',
  () => {
    let newComment = Object.assign({}, comments[1]);
    const { newPos, sameAt } = getCommentTemporalPosAsc(newComment, comments);
    expect(newPos).toBe(sameAt);
    expect(sameAt).toBe(1);
  });


  it('getCommentTemporalPosDesc(comments[0], comments).sameAt === 0 (=== newPos)',
  () => {
    let newComment = Object.assign({}, comments[0]);
    const { newPos, sameAt } = getCommentTemporalPosDesc(newComment, comments);
    expect(newPos).toBe(sameAt);
    expect(sameAt).toBe(0);
  });

  it('getCommentTemporalPosDesc(comments[n], comments).sameAt === n (=== newPos)',
  () => {
    let newComment = Object.assign({}, comments[1]);
    const { newPos, sameAt } = getCommentTemporalPosDesc(newComment, comments);
    expect(newPos).toBe(sameAt);
    expect(sameAt).toBe(1);
  });
});
