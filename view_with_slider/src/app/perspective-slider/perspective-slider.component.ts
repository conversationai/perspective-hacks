/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
// TODO: remove form element: it shouldn't be needed.
// TODO: support resizing better.
// TODO: remove custom change detector. doesn't seem to actually be needed.
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { autobind } from 'core-decorators';
import { TweenMax } from 'gsap';

import { ThumbMoveEvent } from './slider-thumb/slider-thumb.component';

import * as toxiclibsjs from 'toxiclibsjs';
import { RGBAColor } from 'toxiclibsjs';

export type IShape = 'square' | 'circle' | 'diamond';

const FIRST_THRESHOLD = 0.3;
const SECOND_THRESHOLD = 0.8;

const GRADIENT_CANVAS = document.createElement('canvas');
const SLIDER_THUMB_SIZE = 20;
const TWEEN_ADJUSTMENT_TIME_IN_SECONDS = 0.3;

const CLASSES = {
  // Used when the diamond on the right is filled in (we are showing everything)
  ACTIVE: '_active',
  //
  FOCUSED: 'focused',
};

@Component({
  selector: 'app-perspective-slider',
  templateUrl: './perspective-slider.component.html',
  styleUrls: ['./perspective-slider.component.scss'],
})
export class PerspectiveSliderComponent implements OnInit, AfterViewInit {
  // The overall slider thumb element, which includes the slider shape, and
  // also the popup.
  @ViewChild('sliderThumbElem') sliderThumbElem: ElementRef;
  // The element that hold the CSS shape on the slider.
  @ViewChild('sliderThumbShape') sliderThumbShape: ElementRef;
  // The slider Track defines the grey background full width object.
  @ViewChild('sliderTrackElem') sliderTrackElem: ElementRef;
  // The sliderFillElem defines the fragment of 'sliderTrackElem' that looks
  // filled.
  @ViewChild('sliderFillElem') sliderFillElem: ElementRef;
  // The underlying slider input element.
  @ViewChild('sliderInput') sliderInput: ElementRef;
  // The object at the far left (representing 0 value).
  @ViewChild('sliderCircleElem') sliderCircleElem: ElementRef;
  // The object at the far right (representing 1 value).
  @ViewChild('sliderDiamondElem') sliderDiamondElem: ElementRef;
  gradientColors: RGBAColor[];
  // Whether the popup slider
  sliderFocused = false;
  attractFinished = false;

  constructor(private cdr: ChangeDetectorRef) {}

  // The fractional value for the slider (between 0 and 1).
  // Should the parent not define `fractionalValue` attribute, we set it to
  // default to 0.9
  private _sliderValue = 0.9;

  @Input()
  set fractionalValue(sliderFraction: number) {
    this.setTolerance(sliderFraction);
  }
  get fractionalValue() { return this._sliderValue; }

  ngOnInit() {}

  ngAfterViewInit() {
    // TODO: these should be setup in the HTML? and avoid needing nativeElement
    // hacking.
    this.sliderInput.nativeElement.addEventListener('touchstart', this.onSliderDragStart);
    this.sliderInput.nativeElement.addEventListener('mousedown', this.onSliderDragStart);
    this.sliderInput.nativeElement.addEventListener('touchend', this.onSliderDragEnd);
    this.sliderInput.nativeElement.addEventListener('mouseup', this.onSliderDragEnd);
    this.sliderCircleElem.nativeElement.addEventListener('click', () => {
      this.fractionalValue = 0;
      this.sliderInput.nativeElement.value = this.fractionalValue;
    });
    this.sliderDiamondElem.nativeElement.addEventListener('click', () => {
      this.fractionalValue = 1;
      this.sliderInput.nativeElement.value = this.fractionalValue;
    });
    this.onResize();
    this.cdr.detectChanges();

    window.addEventListener('resize', this.onResize);
  }

  // Set up the comment sliderl; done on every resize.
  @autobind
  onResize() {
    this.cdr.detectChanges();
    this.renderTrackGradient();
    this.renderThumbPosition(this._sliderValue);
  }

  @autobind
  handleUpdated(props: ThumbMoveEvent) {
    if (this.sliderThumbElem) {
      // Show sliderThumbShape again when hovered
      if (props.hovered) {
        TweenMax.set(this.sliderThumbShape.nativeElement, {opacity: 1});
      }

      // Set focus state, show sliderThumbShape again when not focused
      if (props.focused) {
        this.sliderThumbElem.nativeElement.classList.add(CLASSES.FOCUSED);
        this.sliderFocused = true;
        this.cdr.detectChanges();
      } else if (!props.focused) {
        this.sliderThumbElem.nativeElement.classList.remove(CLASSES.FOCUSED);
        this.sliderFocused = false;
        this.cdr.detectChanges();
        TweenMax.set(this.sliderThumbShape.nativeElement, {opacity: 1});
      }

      // TODO: fix this to allow thumb to be shown with "try me", and then be
      // dragged directly, and for those updates to be sent to this component.
      // Consider: might be better as an external component that floats over
      // this one? As opposed to having an extra fancy handle that emits diff
      // events to its parenbt (this component).
      //
      // // Calculate slider position based off position of handle
      // const sliderWidth = this.sliderTrackElem.nativeElement.clientWidth;
      // const newSliderPos = END_ATTRACT_VALUE + (props.deltaX / sliderWidth); // width of desktop slider
      // if ((newSliderPos > 0) && (newSliderPos < 1)) {
      //   this.setTolerance(newSliderPos);
      // }
      // this.setTolerance(this.sliderValue);
    }
  }

  @autobind
  onSliderDragStart() {
    this.sliderThumbElem.nativeElement.classList.add(CLASSES.FOCUSED);
    this.sliderFocused = true;
    this.cdr.detectChanges();
  }

  @autobind
  onSliderDragEnd() {
    this.sliderThumbElem.nativeElement.classList.remove(CLASSES.FOCUSED);
      this.sliderFocused = false;
      this.cdr.detectChanges();
  }

  /**
   * Renders the track gradient to a background-image on the track element.
   */
  private renderTrackGradient(): void {

    // Canvas is based on the track element size, we can't render without it.
    if (!this.sliderTrackElem) { return; }

    // Get the size of the track.
    const trackRect = this.sliderTrackElem.nativeElement.getBoundingClientRect();
    const width = trackRect.width;
    const height = 1;

    if (width === 0) { return; }

    // Create the gradient using toxiclibs.js
    const sliderGradient = new toxiclibsjs.color.ColorGradient();
    sliderGradient.addColorAt(width * 0.0, toxiclibsjs.color.TColor.newHex('#25C1F9'));
    sliderGradient.addColorAt(width * 0.5, toxiclibsjs.color.TColor.newHex('#7C4DFF'));
    sliderGradient.addColorAt(width * 1.0, toxiclibsjs.color.TColor.newHex('#D400F9'));

    // Convert the gradient to an array of RGBA arrays.
    this.gradientColors = (sliderGradient.calcGradient(width * 0.0, width * 1.0).colors)
        .map((tColor) => tColor.toRGBADecimalArray());

    // Match the width of the canvas to the width of the track.
    GRADIENT_CANVAS.width = width;

    // Always render 1px high, we'll tile in CSS.
    GRADIENT_CANVAS.height = height;

    // Build a canvas ImageData object using our gradient data.
    const ctx = GRADIENT_CANVAS.getContext('2d');
    if (!ctx) {
      console.error('2d context construction failed.');
      throw new Error('2d context failed.');
    }
    const imageData = ctx.createImageData(width, height);
    this.gradientColors
        .reduce((acc: number[], color) => acc.concat(color), [])
        .forEach((num: number, i: number) => imageData.data[i] = num);

    // Draw to canvas.
    ctx.putImageData(imageData, 0, 0);

    // Put drawn image into CSS background for the track.
    this.sliderTrackElem.nativeElement.style.backgroundImage =
        `url(${GRADIENT_CANVAS.toDataURL()})`;
  }

  /**
   * Get the color at a percentage along the track gradient.
   */
  private getTrackGradientColorAtPercentage(percentage: number): RGBAColor {
    // Get the percentage along the length of colors.
    // If < 0, use 0 because we don't have negative indexes.
    const index = Math.max(0, Math.floor(this.gradientColors.length * percentage) - 1);

    // Return the color.
    return this.gradientColors[index];
  }

  /**
   * Change thumb position and shape; animate comments based on thumb position
   */
  private renderThumbPosition(percentage: number): void {
    const trackRect = this.sliderTrackElem.nativeElement.getBoundingClientRect();

    const sliderTrackSize = trackRect.width;
    const sliderThumbLocation = percentage * sliderTrackSize;

    this.sliderThumbElem.nativeElement.style.left =
         (sliderThumbLocation - SLIDER_THUMB_SIZE / 2) + 'px';
    this.sliderFillElem.nativeElement.style.height = trackRect.height + 'px';
    this.sliderFillElem.nativeElement.style.left = sliderThumbLocation + 'px';

    // Change shape
    if (percentage <= FIRST_THRESHOLD) {
      this.sliderThumbElem.nativeElement.classList.remove('square', 'diamond');
      this.sliderThumbElem.nativeElement.classList.add('circle');
    } else if (percentage <= SECOND_THRESHOLD) {
      this.sliderThumbElem.nativeElement.classList.remove('circle', 'diamond');
      this.sliderThumbElem.nativeElement.classList.add('square');
    } else {
      this.sliderThumbElem.nativeElement.classList.remove('square', 'circle');
      this.sliderThumbElem.nativeElement.classList.add('diamond');
    }

    // Change color
    const colorAtPercentage = this.getTrackGradientColorAtPercentage(percentage);
    const rgbColor = `rgb(${Math.floor(colorAtPercentage[0])}, ${Math.floor(colorAtPercentage[1])}, ${Math.floor(colorAtPercentage[2])})`;
    this.sliderThumbShape.nativeElement.style.backgroundColor = rgbColor;
  }

  // This must be public because it is bound to in the html.
  @autobind
  public setTolerance(sliderPercentage: number | string): void {
    if ('string' === typeof sliderPercentage) {
      sliderPercentage = parseFloat(sliderPercentage);
    }

    // Fill the right hand diamond symbol sumbol when at max score.
    if (sliderPercentage >= 1) {
      this.sliderDiamondElem.nativeElement.classList.add(CLASSES.ACTIVE);
    } else {
      this.sliderDiamondElem.nativeElement.classList.remove(CLASSES.ACTIVE);
    }

    const tweenCurrentObj = {
      sliderValue: this._sliderValue,
    };
    this._sliderValue = sliderPercentage;

    TweenMax.to(tweenCurrentObj, TWEEN_ADJUSTMENT_TIME_IN_SECONDS, {
      // Final Target slider value.
      sliderValue: sliderPercentage,
      onUpdate: () => {
        this.renderThumbPosition(tweenCurrentObj.sliderValue);
      },
    });
  }

  // getScoreColor(score: number): string {
  //   const rgb = this.getTrackGradientColorAtPercentage(score);
  //   return `rgb(${Math.floor(rgb[0])}, ${Math.floor(rgb[1])}, ${Math.floor(rgb[2])})`;
  // }
}
