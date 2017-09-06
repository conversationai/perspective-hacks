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
 * The JSON configuration of the mutation observer.
 * @readonly
 * @enum {boolean}
 */
const COMMENTWATCHER_CONFIG = {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true,
};

/**
 * Watches for mutations to the comments container and analyzes when new
 *   comments are available.
 */
const CommentWatcher = class {
  constructor(analyzeComments) {
    /** @private {Function} The function to analyze comments. */
    this.analyzeComments_ = analyzeComments;
    /** @private {number} The total number of comments. */
    this.totalComments_ = 0;
    /** @private {Function} The function to get comments from the page. */
    this.getComments_ = () =>
        comments.getComments(CommentSelectors[hostname].COMMENT_WRAPPER);

    this.setupMutationCache_();
    this.initMutationObserver_();
  }


  /**
   * Intializes the mutation observer and observes the target.
   * @private
   */
  initMutationObserver_() {
    // The element of the comments selector.
    const target = document.querySelectorAll(
      CommentSelectors[hostname].COMMENTS_CONTAINER)[0];

    /** @private {MutationObserver} The mutation observer. */
    this.observer_ = new MutationObserver((mutations) => {
      // Runs the cached functions once all comments have been loaded in.
      for (let mutation of mutations) {
        if (this.isCommentNode_(mutation)) {
          this.startMutationCache_();
        }
      }
    });

    // Passes in the target node and the observer options.
    this.observer_.observe(target, COMMENTWATCHER_CONFIG);
  }

  /**
   * Determines whether the mutation is performed on a comment node.
   * @return {boolean} Whether the mutated node is a comment.
   */
  isCommentNode_(mutation) {
    const containsCommentArticle = (elements) => {
      for (let element of elements) {
        if (element.classList && (element.classList.contains(
            CommentSelectors[hostname].NEW_COMMENT_MUTATION))) {
          return true;
        }
      }
      return false;
    };

    return (mutation.target.id == CommentSelectors[hostname].ID) ||
        containsCommentArticle(mutation.addedNodes);
  }

  /**
   * Sets up function to analyze new comments to be cached for later execution.
   * @private
   */
  setupMutationCache_() {
    this.mutationCache_ = () => {
      let newComments = this.getComments_().length;
      if (newComments > this.totalComments_) {
        this.analyzeComments_(this.getComments_());
      }
      this.totalComments_ = newComments;
    };
  }

  /**
   * Executes cached functions every 1000 ms.
   * @private
   */
  startMutationCache_() {
    setInterval(this.mutationCache_, 1000);
  }
};