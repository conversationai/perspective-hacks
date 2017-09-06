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

 const CommentSelectors = {
  'www.ft.com': {
    'ID': 'comments',
    'COMMENTS_CONTAINER': '#comments',
    'COMMENT_WRAPPER': 'fyre-comment-wrapper',
    'COMMENT_CONTENT_WRAPPER': 'fyre-comment-body',
    'COMMENT_CONTENT': 'fyre-comment',
    'COMMENT_DATE': 'meta[itemprop=dateCreated',
    'MORE_LINK': 'fyre-stream-more-container',
    'NEW_COMMENT_MUTATION': 'fyre-comment-article',
  },
  'www.independent.co.uk': {
    'ID': 'commentsDiv',
    'COMMENTS_CONTAINER': '#commentsDiv .gig-comments-comments',
    'COMMENT_WRAPPER': 'gig-comment-content',
    'COMMENT_CONTENT_WRAPPER': 'gig-comment-content',
    'COMMENT_CONTENT': 'gig-comment-body',
    'COMMENT_DATE': '.gig-comment-time',
    'MORE_LINK': 'gig-comments-more',
    'NEW_COMMENT_MUTATION': 'gig-comment',
  },
  'www.economist.com': {
    'ID': 'comments-area',
    'COMMENTS_CONTAINER': '#comments-area',
    'COMMENT_WRAPPER': 'single-comment',
    'COMMENT_CONTENT_WRAPPER': '',
    'COMMENT_CONTENT': 'comment-body',
    'COMMENT_DATE': 'meta[itemprop=dateCreated',
    'MORE_LINK': '',
  },
  'www.telegraph.co.uk': {
    'ID': 'comments',
    'COMMENTS_CONTAINER': '#comments',
    'COMMENT_DATE': 'meta[itemprop=dateCreated',
    'COMMENT_WRAPPER': 'fyre-comment-wrapper',
    'COMMENT_CONTENT_WRAPPER': 'fyre-comment-body',
    'COMMENT_CONTENT': 'fyre-comment',
    'MORE_LINK': 'comments-block__load',
    'NEW_COMMENT_MUTATION': 'fyre-comment-article',
  },
};


/**
 * Scrapes webpage for potential comments and stores their respecitve
 * toxicity rating.
 */
const Comments = class {
  constructor() {
    /** @type {number} The count of toxic comments. */
    this.toxicCommentCount = 0;
    /** @type {Array<Element>} The array of comments. */
    this.commentStream;
  }

  /**
   * Gets a stream of comments identified by the given class.
   * @param {string} commentClass The class name of the comments to get.
   * @return {Array<Element>} The array of comment elements.
   */
  getComments(commentClass) {
    this.commentStream = document.getElementsByClassName(commentClass);
    return this.commentStream;
  }

  /**
   * Gets the comment selector names for each publisher.
   * @return {Object} The object defining selector names indexed by publisher.
   */
  getSelectors() {
    return CommentSelectors;
  }
};
