/**
 * Copyright 2017 Google Inc.
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

// Enter your API key below by following the quickstart:
// https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md
const API_KEY = '';

/**
 * Uses Perspective API to analyze toxicity of a given comment.
 */
const ToxicityAnalyzer = class {
  /**
   * Gets the parsed Date from a string representation.
   * @param {string} commentDate String representing the comment date.
   * @return {Date} The parsed Date.
   * @private
   */
  getParsedDate_(commentDate) {
    if (commentDate && commentDate.indexOf('ago') >= 0) {
      commentDate = commentDate.replace('ago', '');
      // This is capturing the 'less than one minute ago' datestamp.
      if (commentDate === null) {
        commentDate = new Date();
      }
      return Date.parse('-' + commentDate);
    } else {
      return new Date(commentDate);
    }
  }

  /**
   * Analyzes the given comment.
   * @param {string} comment The comment content to parse and analyze.
   * @param {string=} opt_date The optional comment date.
   * @return {Promise} Promise containing the comment, toxicity analysis, and
   *   parsed date.
   */
  analyze(comment, opt_date) {
    const parsedDate = this.getParsedDate_(opt_date);
    const parsedComment = comment.replace(/"/g, "");
    return new Promise((resolve, reject) => {
      // Perspective API doesn't accept comments longer than 3000 characters.
      if (!comment || comment.length >= 3000) {
        reject();
        return false;
      }
      const analyzeURL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=' + API_KEY;
      const x = new XMLHttpRequest();
      const composedComment = `{comment: {text: "${parsedComment}"},
          languages: ["en"],
          requestedAttributes: {TOXICITY:{}} }`;
      // Adds the required HTTP header for form data POST requests.
      x.open('POST', analyzeURL, true);
      x.setRequestHeader('Content-Type', 'application/json');
      x.withCredentials = true;
      // The Perspective API responds with JSON, so let Chrome parse it.
      x.responseType = 'json';
      x.onreadystatechange = () => {
        if (x.readyState == 4 && x.status == 200) {
          resolve({
            comment: comment,
            response: x.response,
            date: parsedDate
          })
        } else if (x.status == 400) {
          reject();
        }
      };
      x.onerror = reject;
      x.send(composedComment);
    });
  }

  /**
   * Gets the toxicity of the given Perspective API response
   * @param {Object} response The response from the Perspective API analysis.
   * @return {?number} The toxicity score if it exists.
   */
  getToxicity(response) {
    return response.attributeScores.TOXICITY.summaryScore.value || null;
  }

  /**
   * Analyzes the given comment and returns only the toxicity.
   * @param {string} comment The comment content to parse and analyze.
   * @return {Promise} Promise containing toxicity score.
   */
  getCommentToxicity(comment) {
    return new Promise((resolve, reject) => {
      this.analyze(comment).then((response) => {
        resolve(this.getToxicity(response.response));
      });
    });
  }
};