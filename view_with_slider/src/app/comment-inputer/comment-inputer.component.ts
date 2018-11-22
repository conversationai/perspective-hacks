/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
// TODO: Support specifying of models being checked.
import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from 'angularfire2/firestore';
import {
  DemoSettings,
  LoadingIconStyle,
  ConfigurationInput,
  ScoreThreshold
} from '@conversationai/perspectiveapi-authorship-demo';
import { environment } from '../../environments/environment';
import { AngularFireFunctions } from 'angularfire2/functions';
import { Observable } from 'rxjs';

import { CommentToScore, ScoredComment } from '../comment_util';

export const DEFAULT_COLORS = ['#25C1F9', '#7C4DFF', '#D400F9'];

type IFeedbackText = [string, string, string];
export const DEFAULT_FEEDBACK_TEST_SET: IFeedbackText = [
  'Unlikely to violate community guidelines.',
  'Could violate community guidelines.',
  'Likely to violate community guidelines.'
];

// serverUrl="https://www.perspectiveapi.com"

@Component({
  selector: 'app-comment-inputer',
  templateUrl: './comment-inputer.component.html',
  styleUrls: ['./comment-inputer.component.css']
})
export class CommentInputerComponent implements OnInit {
    checkerSettings: DemoSettings = {
      configuration: ConfigurationInput.DEMO_SITE,
      gradientColors: DEFAULT_COLORS,
      useGapi: true, // Always talk to the server.
      apiKey: environment.perspective.apiKey,
      showPercentage: true,
      showMoreInfoLink: false,
      feedbackText: DEFAULT_FEEDBACK_TEST_SET,
      scoreThresholds: [
        ScoreThreshold.OKAY,
        ScoreThreshold.BORDERLINE,
        ScoreThreshold.UNCIVIL
      ],
      alwaysHideLoadingIcon: false,
      hideLoadingIconAfterLoad: false, // Not configurable with current setting options.
      hideLoadingIconForScoresBelowMinThreshold: false,
      userFeedbackPromptText: 'Seem wrong?',
      loadingIconStyle: LoadingIconStyle.CIRCLE_SQUARE_DIAMOND,
      usePluginEndpoint: false,
    };

  textValue = '';
  submittedText = false;
  addCommentFn: (data: CommentToScore) => Observable<ScoredComment>;

  constructor(private functions: AngularFireFunctions) {
    this.addCommentFn = this.functions.httpsCallable<CommentToScore, ScoredComment>('addComment');
  }

  ngOnInit() {
  }

  addComment() {
    console.log('Submitting comment: ' + this.textValue);
    // this.db.collection('comments').add({text: this.textValue});
    this.addCommentFn({text: this.textValue}).subscribe(function(result) {
      console.log(result);
    });
    // .catch(function(error: Error) {
    //   console.error(error);
    //     // Getting the Error details.
    //     // var code = error.code;
    //     // var message = error.message;
    //     // var details = error.details;
    // });
    this.submittedText = true;
  }

  sayMore() {
    this.submittedText = false;
    this.textValue = '';
  }

}
