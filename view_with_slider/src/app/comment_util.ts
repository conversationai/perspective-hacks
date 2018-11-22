/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
export interface CommentToScore {
  text: string;
}

export interface ScoredComment {
  text: string;
  scores: { [attribute: string]: number };
  // Timestamp number; as in returned by Date.now()
  // TODO: rename this timestamp,
  date: number;
  seen?: boolean;
}

export function commentKey(c: ScoredComment) {
  return `${c.date}:${c.text}`;
}

// Get a new comment's intended position w.r.t. date.
export function getCommentTemporalPosDesc(newComment: ScoredComment,
  comments: ScoredComment[]): {newPos: number, sameAt: number|null} {
  let maybePos = 0;
  let sameAt: number|null = null;

  while (maybePos < comments.length) {
    if (newComment.date.valueOf() === comments[maybePos].date.valueOf()
        && newComment.text === comments[maybePos].text) {
      sameAt = maybePos;
    }

    if (newComment.date.valueOf() < comments[maybePos].date.valueOf()) {
      break;
    }
    maybePos++;
  }
  return { newPos: maybePos, sameAt: sameAt };
}

// Get a new comment's intended position w.r.t. date.
export function getCommentTemporalPosAsc(newComment: ScoredComment,
    comments: ScoredComment[]): {newPos: number, sameAt: number|null} {
  let maybePos = comments.length - 1;
  let sameAt: number|null = null;

  while (maybePos > 0) {
    if (newComment.date.valueOf() === comments[maybePos].date.valueOf()
        && newComment.text === comments[maybePos].text) {
      sameAt = maybePos;
    }

    if (newComment.date.valueOf() > comments[maybePos].date.valueOf()) {
      break;
    }
    maybePos--;
  }
  return { newPos: maybePos + 1, sameAt: sameAt };
}
