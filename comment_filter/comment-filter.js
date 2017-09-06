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

/**
 * Class names contained within the InfoPanel component.
 * @readonly
 * @enum {string}
 */
const commentFilterTemplate = {
  PUBLISHER_INFO: 'templates/publisher-info.mst',
  COMMENT_FILTER: 'templates/comment-filter.mst',
};

/**
 * Class names identifying toxicity controllers on the page.
 * @readonly
 * @enum {string}
 */
const ToxicityClass = {
  FILTERED: 'comment-filtered',
  RANGE: 'toxicity-range',
  THRESHOLD: 'toxicity-threshold',
};

/**
 * Class names contained within the CommentFilter component.
 * @readonly
 * @enum {string}
 */
const CommentFilterClass = {
  COMMENTS_HIDDEN: 'comment-filter__comments-hidden',
  COMMENTS_TOTAL: 'comment-filter__comments-total',
  CONTROL: 'comment-filter__control',
  PUBLISHERS: 'comment-filter__publishers',
};

/**
 * Filters comments based on a defined toxicity threshold.
 */
const CommentFilter = class {
  constructor() {
    /** @type {number} The maximum toxicity to tolerate. */
    this.toxicityThreshold = .1;
    /** @type {Element} The toxicity range slider, to be defined on setup. */
    this.toxicityRangeElement;
    /**
     * @private {Element} The toxicity threshold element, to be defined on
     *   setup.
     */
    this.toxicityThresholdElement_;
  }

  /**
   * Appends the CommentFilter to the InfoPanel.
   */
  appendToInfoPanel() {
    // Sets up publisher info to add to InfoPanel details.
    const infoPanelUrl =
        chrome.runtime.getURL(commentFilterTemplate.PUBLISHER_INFO);
    const publishers = [
      { 'title': 'ft.com', 'url': 'https://www.ft.com' },
      { 'title': 'independent.co.uk', 'url': 'https://www.independent.co.uk' },
      { 'title': 'economist.com', 'url': 'https://www.economist.com' },
      { 'title': 'telegraph.co.uk', 'url': 'https://www.telegraph.co.uk' },
    ];
    const infoPanelParams = { publishers: publishers };
    let infoPanelDetails =
        document.getElementsByClassName(InfoPanelClass.DETAILS)[0];
    utils.insertTemplate(infoPanelUrl, infoPanelParams, infoPanelDetails);

    // Sets up commentFilter template to add to InfoPanel.
    const commentFilterUrl =
        chrome.runtime.getURL(commentFilterTemplate.COMMENT_FILTER);
    const commentFilterParams = {
      toxicityThreshold: this.toxicityThreshold,
      toxicityThresholdPercent: (this.toxicityThreshold * 100).toFixed(2),
    };
    let infoPanel = document.getElementById(InfoPanelClass.INFO_PANEL);
    utils.insertTemplate(commentFilterUrl, commentFilterParams, infoPanel,
        () => {
      document.body.classList.add(ToxicityClass.FILTERED);
      this.toxicityRangeElement = document.getElementById(ToxicityClass.RANGE);
      this.toxicityThresholdElement_ =
          document.getElementById(ToxicityClass.THRESHOLD);
      pubSub.publish(PubSubEvent.COMMENT_FILTER_READY);
    });
  }

  /**
   * Sets a new toxicity threshold.
   * @param {number} value The new threshold value to set.
   * @private
   */
  setToxicityThreshold_(value) {
    this.toxicityThreshold = value;
  }

  /**
   * Updates the toxicity range elements with current threshold value.
   */
  updateToxicityRange() {
    this.setToxicityThreshold_(this.toxicityRangeElement.value);
    this.toxicityThresholdElement_.textContent =
        `${(this.toxicityThreshold * 100).toFixed(2)}%`;
  }
};
