/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
import { Component, OnInit, Input} from '@angular/core';

import { ScoredComment } from '../comment_util';

@Component({
  selector: 'app-scored-comment',
  templateUrl: './scored-comment.component.html',
  styleUrls: ['./scored-comment.component.css']
})
export class ScoredCommentComponent implements OnInit {

  @Input() threshold: number;
  @Input() model: string;
  @Input() comment: ScoredComment;
  // scoresText: string;

  constructor() { }

  ngOnInit() {
    // this.scoresText = JSON.stringify(this.comment.scores[this.model].toFixed(2), null, 2);
    // this.dateObj = new Date(this.comment.date);
  }

  iconStyle(): string {
    if (this.comment.scores[this.model] <= 0.33) {
      return `circle`;
    } else if (this.comment.scores[this.model] <= 0.66) {
      return `square`;
    } else {
      return `diamond`;
    }
  }
}
