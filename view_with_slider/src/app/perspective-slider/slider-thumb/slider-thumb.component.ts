/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
import { ViewChild, Input, Output, EventEmitter, OnChanges, Component, ElementRef } from '@angular/core';
import { autobind } from 'core-decorators';
import { TweenMax } from 'gsap';

export interface ThumbMoveEvent {
  deltaX: number | null;
  focused: boolean;
  hovered: boolean;
}

const CLASSES = {
  FOCUSED: 'focused',
  ATTRACT: 'attract',
};

@Component({
  selector: 'app-slider-thumb',
  templateUrl: './slider-thumb.component.html',
  styleUrls: ['./slider-thumb.component.scss'],
})

export class SliderThumbComponent implements OnChanges {
  element: ElementRef;
  @Input() focused: boolean;
  @Input() attractJustFinished: boolean;
  @Output() handleUpdated = new EventEmitter<ThumbMoveEvent>();
  @ViewChild('handleElem') handleElem: ElementRef;
  @ViewChild('tryMeElem') tryMeElem: ElementRef;
  firstInteraction = true;
  previousXPos: number;
  handleProps: ThumbMoveEvent;

  constructor() {
    this.handleProps = {
      deltaX: null,
      focused: false,
      hovered: false,
    };
  }

  ngOnChanges() {
    if (this.attractJustFinished && this.firstInteraction) {
      this.handleHandlers();
    } else if (!this.firstInteraction) {
      this.removeHandleHandlers();
    }

    this.updateHandle();
  }

  updateHandle() {
    this.handleProps.focused = this.focused;
    if (this.focused) {
      this.handleElem.nativeElement.classList.add(CLASSES.FOCUSED);
      if (this.attractJustFinished && this.firstInteraction) {
        this.handleElem.nativeElement.classList.add(CLASSES.ATTRACT);
        this.growHandle();
        this.attractJustFinished = false;
      }
    } else {
      this.handleElem.nativeElement.classList.remove(CLASSES.FOCUSED);
      this.handleElem.nativeElement.classList.remove(CLASSES.ATTRACT);
      this.shrinkHandle();
    }
  }

  growHandle() {
    TweenMax.to(this.handleElem.nativeElement, 0.2, {
      scale: 1.5,
    });
  }

  shrinkHandle() {
    TweenMax.to(this.handleElem.nativeElement, 0.2, {
      scale: 1,
    });
  }

  handleHandlers() {
    // this.handleElem.nativeElement.addEventListener('mouseover', this.hoverHandle);
    this.handleElem.nativeElement.addEventListener('mousedown', this.clickHandle);
    document.addEventListener('mouseup', this.releaseHandle);
  }

  removeHandleHandlers() {
    document.removeEventListener('mousemove', this.dragHandle);
    document.removeEventListener('mouseup', this.releaseHandle);
  }

  @autobind
  clickHandle(event: MouseEvent) {
    this.handleProps.hovered = true;

    this.shrinkHandle();
    TweenMax.to(this.tryMeElem.nativeElement, 0.2, {
      onStart: () => {
        this.handleElem.nativeElement.classList.remove(CLASSES.ATTRACT);
      },
      opacity: 0,
    });
    this.handleUpdated.emit(this.handleProps);
    this.previousXPos = event.clientX;
    document.addEventListener('mousemove', this.dragHandle);
  }

  @autobind
  dragHandle(event: MouseEvent) {
    const deltaX = event.clientX - this.previousXPos;
    this.handleProps.deltaX = deltaX;
    this.handleUpdated.emit(this.handleProps);
  }

  @autobind
  releaseHandle(_event: MouseEvent) {
    this.firstInteraction = false;
    this.focused = false;
    this.handleProps.focused = this.focused;
    this.handleUpdated.emit(this.handleProps);
    this.ngOnChanges();
  }
}
