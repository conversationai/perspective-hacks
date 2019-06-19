/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireAuthModule } from '@angular/fire/auth';


import { ConvaiCheckerModule } from '@conversationai/perspectiveapi-authorship-demo';
import { MatInputModule, MatButtonModule, MatButtonToggleModule,
         MatSelectModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PerspectiveCommentComponent } from './perspective-comment/perspective-comment.component';

import { PerspectiveSliderComponent } from './perspective-slider/perspective-slider.component';
import { SliderThumbComponent } from './perspective-slider/slider-thumb/slider-thumb.component';
import { SliderPageComponent } from './slider-page/slider-page.component';


import { environment } from '../environments/environment';
import { CommentInputerComponent } from './comment-inputer/comment-inputer.component';
import { ScoredCommentComponent } from './scored-comment/scored-comment.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CommentPairRaterComponent } from './comment-pair-rater/comment-pair-rater.component';
import { SortedViewPageComponent } from './sorted-view-page/sorted-view-page.component';

const appRoutes: Routes = [
  { path: 'comment', component: CommentInputerComponent },
  { path: 'view', component: SliderPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'ratepair', component: CommentPairRaterComponent },
  { path: '', component: LoginPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    CommentInputerComponent,
    PerspectiveCommentComponent,
    PerspectiveSliderComponent,
    ScoredCommentComponent,
    SliderPageComponent,
    SliderThumbComponent,
    LoginPageComponent,
    CommentPairRaterComponent,
    SortedViewPageComponent,
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    BrowserAnimationsModule,
    BrowserModule,
    ConvaiCheckerModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
