/**
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class Perspective {
  constructor() {
    // TODO: Allow user to enter custom communityId
    this.communityId = '';
    this.clientToken = '';
  }

  suggestScore(comment, score, callback) {
    // TODO: Store API key in separate file
    const API_KEY = '';
    const analyzeURL =
        'https://commentanalyzer.googleapis.com/v1alpha1/comments:suggestscore?key=' + API_KEY;
    const x = new XMLHttpRequest();
    const composedComment = `{
        comment: {
          text: "${comment}"
        },
        attributeScores: {
          TOXICITY: {
            summaryScore: {
              value: ${score}
            }
          }
        },
        communityId: "${this.communityId}",
        clientToken: "${this.clientToken}"
      }`;
    console.log(composedComment);
    x.open('POST', analyzeURL, true);
    // Add the required HTTP header for form data POST requests
    x.setRequestHeader('Content-Type', 'application/json');
    x.withCredentials = true;
    // The Perspective API responds with JSON, so let Chrome parse it.
    x.responseType = 'json';
    x.onreadystatechange = () => {
      if (x.readyState == 4 && x.status == 200) {
        callback(true, x.response);
      } else if (x.readyState == 4) {
        callback(false, x.response);
        console.log('response: ', x);
      }
    };
    x.onerror = () => {
      callback(false, null);
    };
    x.send(composedComment);
  }
}