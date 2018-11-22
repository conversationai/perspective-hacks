/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */

import { Component, Input, ElementRef } from '@angular/core';
import { TweenMax } from 'gsap';

export type IShape = 'square' | 'circle' | 'diamond';

export interface IComment {
  score: number;
  text: string;
  shape?: IShape;
  color?: string;
}

@Component({
  selector: 'app-perspective-comment',
  templateUrl: './perspective-comment.component.html',
  styleUrls: ['./perspective-comment.component.scss'],
})
export class PerspectiveCommentComponent {
  @Input() comment: IComment;
  @Input() column: string;
  element: ElementRef;
  isVisible = true;

  constructor(element: ElementRef) {
    this.element = element;
  }

  getHeight(): number {
    const commentNode = this.element.nativeElement.querySelector('.comment');
    const { height } = commentNode.getBoundingClientRect();
    return height;
  }

  show(yPosition: number, duration: number): Promise<void> {
    const commentNode = this.element.nativeElement.querySelector('.comment');
    commentNode.setAttribute('aria-hidden', false);
    return new Promise<void>((resolve) => {

      if (duration === 0) {
        // set to visible if already pre-loaded
        TweenMax['set'](commentNode, {
          y: yPosition,
          opacity: 1,
        });

        resolve();

      } else {

        if (this.isVisible) {
          // tween to visible
          TweenMax['to'](commentNode, duration, {
            y: yPosition,
            onComplete: () => resolve(),
          });
        } else {
          TweenMax['set'](commentNode, {
            y: yPosition,
          });

          TweenMax['to'](commentNode, duration, {
            opacity: 1,
            onComplete: () => resolve(),
          });
        }
      }
      this.isVisible = true;
    });
  }

  hide(duration: number): Promise<void> {
    const commentNode = this.element.nativeElement.querySelector('.comment');
    commentNode.setAttribute('aria-hidden', true);

    return new Promise<void>((resolve) => {
      if (!this.isVisible) {
        resolve();
        return;
      }
      if (duration === 0) {
        // set to invisible if not pre-loaded
        TweenMax['set'](commentNode, {
          opacity: 0,
        });

        resolve();

      } else {
        // tween to invisible
        TweenMax['to'](commentNode, duration / 2, {
          opacity: 0,
          onComplete: () => resolve(),
        });
      }
      this.isVisible = false;
    });
  }
}
