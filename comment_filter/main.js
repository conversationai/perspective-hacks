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

// TODO Convert to ES6 class.

const title = 'Comment Filter';
const subtitle = `Easily find and hide comments based
    on their level of toxicity.`;
const description = `Online debate isn’t always completely constructive.
    Perspective Hacks is a set of tools that makes it easier to find useful
    opinions, be part of healthier discussions, and get sharper insight into
    when, where, and why tricky conversations happen.`;
const toxicMessageTemplateUrl = 'templates/toxic-message.mst';
const hostname = window.location.hostname;

const comments = new Comments();
const commentFilter = new CommentFilter();
const toxicityAnalyzer = new ToxicityAnalyzer();

let commentScores = [];
let commentsHiddenElement;
let commentsTotalElement;

/**
 * Class names used to modify toxic comments on the page.
 * @readOnly
 * @enum {string}
 */
const ToxicClass = {
  TOXIC: 'toxic',
  TOXIC_HIDDEN: 'toxic-hidden',
  TOXIC_HIDE: 'toxic-hide',
  TOXIC_MESSAGE: 'toxic-message',
  TOXIC_REVEAL: 'toxic-reveal',
  COMMENT_FILTER: 'comment-filter'
};

/**
 * Initializes the Toxicity Tracker features.
 */
const initToxicityTracker = () => {
  commentFilter.appendToInfoPanel();
  document.getElementById(InfoPanelClass.INFO_PANEL).classList.add(ToxicClass.COMMENT_FILTER);
  pubSub.subscribe(PubSubEvent.COMMENT_FILTER_READY, () => {
    addToxicityRangeListener();
    commentsHiddenElement =
      document.getElementById(CommentFilterClass.COMMENTS_HIDDEN);
    commentsTotalElement =
      document.getElementById(CommentFilterClass.COMMENTS_TOTAL);

    // Navigates to the comments section and expands more comments.
    window.location.href = `#${CommentSelectors[hostname].ID}`;
    const moreCommentsLink = document.getElementsByClassName(
        CommentSelectors[hostname].MORE_LINK)[0];
    if (moreCommentsLink) {
      moreCommentsLink.click();
    }

    // Analyzes the page comments
    const pageComments =
        comments.getComments(CommentSelectors[hostname].COMMENT_WRAPPER);
    analyzeComments(pageComments);
    updateCommentMessage();

    // Sets up CommentWatcher if new comment nodes are added as mutations.
    if (CommentSelectors[hostname].NEW_COMMENT_MUTATION) {
      //const commentWatcherConfig = getCommentWatcherConfig();
      new CommentWatcher(analyzeComments);
    }
  });
}

/**
 * Listens for changes in the toxicity range slider to update the toxic comment
 * status and re-analyze comments.
 */
const addToxicityRangeListener = () => {
  commentFilter.toxicityRangeElement.addEventListener('change', () => {
    commentFilter.updateToxicityRange();
    analyzeComments(comments.commentStream);
  });
}

/**
 * Analyzes the given commentStream to evaluate toxicity scores.
 * @param {Array} commentStream The stream of comments to analyze.
 */
const analyzeComments = (commentStream) => {
  for (let comment of commentStream) {
    const commentBody = comment.getElementsByClassName(
        CommentSelectors[hostname].COMMENT_CONTENT)[0];
    if (commentBody) {
      toxicityAnalyzer.getCommentToxicity(commentBody.textContent).then(
          (toxicity) => {
        compareToxicity(comment, toxicity);
        updateCommentMessage();
      });
    }
  }
}

/**
 * Compares the current toxicity with the threshold to classify the comment as
 * toxic or not.
 * @param {element} comment The comment to classify as toxic.
 * @param {number} toxicity The toxicity score of the comment.
 */
const compareToxicity = (comment, toxicity) => {
  const hasToxicClass = comment.classList.contains(ToxicClass.TOXIC);
  if (toxicity > commentFilter.toxicityThreshold) {
    if(!hasToxicClass) {
      classifyToxic(comment, toxicity);
    }
  } else {
    if(hasToxicClass) {
      classifyNonToxic(comment);
    }
  }
}

/**
 * Classifies a given topic as toxic.
 * @param {element} comment The comment to classify as toxic.
 * @param {number} toxicity The toxicity score of the comment.
 */
const classifyToxic = (comment, toxicity) => {
  comment.classList.add(ToxicClass.TOXIC, ToxicClass.TOXIC_HIDDEN);
  comments.toxicCommentCount++;
  insertToxicityMessage(comment, toxicity);
}

/**
 * Adds the toxicity message with show/hide toggle if it doesn't exist yet.
 * @param {element} comment The comment for which to add the message.
 * @param {number} toxicity The toxicity score of the comment.
 */
const insertToxicityMessage = (comment, toxicity) => {
  if (!comment.getElementsByClassName(ToxicClass.TOXIC_MESSAGE)[0]) {
    const templateUrl = chrome.runtime.getURL(toxicMessageTemplateUrl);
    const templateParams = {
      toxicityPercent: (toxicity * 100).toFixed(2)
    };
    const commentElement = comment.getElementsByClassName(
        CommentSelectors[hostname].COMMENT_CONTENT)[0];
    utils.insertTemplate(templateUrl, templateParams, commentElement,
        () => {
      const toxicMessageElement =
          comment.getElementsByClassName(ToxicClass.TOXIC_MESSAGE)[0];
      toxicMessageElement.addEventListener('click', () => {
        comment.classList.toggle(ToxicClass.TOXIC_HIDDEN);
      });
    }, false);
  }
}

/**
 * Classifies a given topic as non-toxic.
 * @param {element} comment The comment to classify as nonToxic.
 */
const classifyNonToxic = (comment) => {
  comment.classList.remove(ToxicClass.TOXIC, ToxicClass.TOXIC_HIDDEN);
  comments.toxicCommentCount--;
  removeToxicityMessage(comment);
}

/**
 * Removes the toxicity message if it exists in the comment element.
 * @param {element} comment The comment from which to remove the message.
 */
const removeToxicityMessage = (comment) => {
  const toxicityMessage =
      comment.getElementsByClassName(ToxicClass.TOXIC_MESSAGE)[0];
  if (toxicityMessage) {
    toxicityMessage.remove();
  }
}

/**
 * Updates the comment status message with updated toxicity counts.
 */
const updateCommentMessage = () => {
  commentsHiddenElement.textContent = comments.toxicCommentCount;
  commentsTotalElement.textContent = comments.commentStream.length;
}

/**
 * Initializes the infoPanel only if the page has a qualified comments section.
 */
if (document.getElementById(CommentSelectors[hostname].ID)) {
  new InfoPanel(title, null, null, document.body, undefined, true);
  pubSub.subscribe(PubSubEvent.INFO_PANEL_READY, initToxicityTracker);
}
