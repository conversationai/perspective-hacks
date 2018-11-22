/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';

import { PerspectiveSliderComponent } from './perspective-slider.component';
import { SliderThumbComponent } from './slider-thumb/slider-thumb.component';

describe('SliderExperimentComponent', () => {
  let component: PerspectiveSliderComponent;
  let fixture: ComponentFixture<PerspectiveSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PerspectiveSliderComponent,
        SliderThumbComponent
      ],
      providers: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerspectiveSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
