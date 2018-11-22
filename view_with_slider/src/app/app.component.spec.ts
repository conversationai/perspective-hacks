/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PerspectiveSliderComponent } from './perspective-slider/perspective-slider.component';
import { SliderThumbComponent } from './perspective-slider/slider-thumb/slider-thumb.component';
import { SliderPageComponent } from './slider-page/slider-page.component';
import { AngularFirestoreModule } from 'angularfire2/firestore';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PerspectiveSliderComponent,
        SliderThumbComponent,
        SliderPageComponent,
      ],
      imports: [
        RouterModule.forRoot([
              { path: '', component: SliderPageComponent },
            ], { useHash: true }),
        AngularFirestoreModule,
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // it(`should have as title 'app'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to perspectiveapi-viewership-demo!');
  // }));
});
