/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Observer } from 'rxjs';
// import { Observable, Observer } from 'rxjs';
import { ScoredComment, commentKey } from '../comment_util';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

// // //// ---------- Faking comment submissions.
// import { WIKIPEDIA_COMMENTS } from '../../testdata/WP_TOXIC_BUCKETS_200_v2';
// const COMMENTS: ScoredComment[] = WIKIPEDIA_COMMENTS.map(x => {
//   return {
//     text: x.text,
//     scores: x.scores,
//     date: Date.now()
//   };
// }).sort((b, a) => b.date.valueOf() - a.date.valueOf());

// const submittedComments: ScoredComment[] = [];
// function maybeAddNextComment(observer: Observer<ScoredComment[]>) {
//   if (COMMENTS.length === 0) {
//     return;
//   }
//   // const i = Math.floor(Math.random() * climateComments.length);
//   const i = 0;
//   const nextComment = COMMENTS[i];
//   COMMENTS.splice(i, 1);

//   if (nextComment) {
//     // const { newPos } = getCommentTemporalPosition(nextComment, submittedComments);
//     // submittedComments.splice(newPos, 0, nextComment);
//     submittedComments.unshift(nextComment);
//     // submittedComments.push(nextComment);
//     observer.next(submittedComments.slice());
//     // this.comments.unshift(nextComment);
//     setTimeout(() => maybeAddNextComment(observer), 1000);
//   }
// }

@Component({
  selector: 'app-slider-page',
  templateUrl: './slider-page.component.html',
  styleUrls: ['./slider-page.component.css'],
  animations: [
    trigger('thresholdState', [
      state('belowThreshold', style({
        opacity: '0.2',
        // height: '0px',
        // transform: 'scale(0.1)'
      })),
      state('aboveThreshold',   style({
        opacity: '1',
        // height: '*',
        // transform: 'scale(1)'
      })),
      transition('belowThreshold => aboveThreshold', animate('500ms ease-in-out')),
      transition('aboveThreshold => belowThreshold', animate('500ms ease-in-out')),
      transition('void => aboveThreshold', [
        style({height: '0px', width: '0px', opacity: '0'}),
        animate('500ms ease-in-out', style({height: '*', width: '*', opacity: '1'})),
      ]),
      transition('void => belowThreshold', [
        style({height: '0px', width: '0px', opacity: '0'}),
        animate('500ms ease-in-out', style({height: '*', width: '*', opacity: '.1'})),
      ]),
      transition(':leave', [
        animate('3000ms ease-in-out', style({opacity: '0'})),
      ])
    ])
  ]
})
export class SliderPageComponent {
  // comments: Observable<ScoredComment[]>;
  comments: ScoredComment[];
  commentsObservable: Observable<ScoredComment[]>;

  models = [
    { name: 'toxic', id: 'TOXICITY', },
    { name: 'severely toxic', id: 'SEVERE_TOXICITY', },
    { name: 'obscene', id: 'TOXICITY_OBSCENE', },
    { name: 'insult', id: 'TOXICITY_INSULT', },
    { name: 'identity attack', id: 'TOXICITY_IDENTITY_ATTACK', },
    { name: 'threat', id: 'TOXICITY_THREAT', },
    // { name: 'sexually explicit', id: 'SEXUALLY_EXPLICIT', },
  ];

  selectedModel = this.models[0].id;

  constructor(db: AngularFirestore) {
    this.commentsObservable = db.collection('comments',
        ref => ref.orderBy('date', 'desc').limit(100))
        .valueChanges() as Observable<ScoredComment[]>;
    // this.commentsObservable = Observable.create((observer: Observer<ScoredComment[]>) => {
    //   // Add all comments.
    //   observer.next(COMMENTS);
    //   // Add the comments one at a time.
    //   // maybeAddNextComment(observer);
    // });


    this.comments = [];

    this.commentsObservable.subscribe((newScoredComments: ScoredComment[]) => {
        console.log(newScoredComments);

        // Crazy antics to make sure that we keep old comment objects so that
        // Angular does not destory and recreate the comments.
        const keyedComments: {[key: string]: ScoredComment} = {};
        for (const c of this.comments) {
          keyedComments[commentKey(c)] = c;
        }

        for (let i = 0; i < newScoredComments.length; i++) {
          const oldMatchingComment = keyedComments[commentKey(newScoredComments[i])];
          if (oldMatchingComment) {
            newScoredComments[i] = oldMatchingComment;
          }
        }

        this.comments = newScoredComments;
      });
  }

  //
  // ensembleScore(c: ScoredComment, model: string): number {
  //   return (c.scores[model] * 0.6 + c.scores['SEVERE_TOXICITY'] * 0.4);
  // }
}
