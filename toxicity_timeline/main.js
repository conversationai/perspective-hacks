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

let commentScores = [];
const comments = new Comments();
const graphPanel = new GraphPanel();
const toxicityAnalyzer = new ToxicityAnalyzer();
const hostname = window.location.hostname;
let infoPanelSetup = false;
const title = 'Toxicity Timeline';
const subtitle = `See exactly when negative conversations happen and discover
    the patterns behind them.`;
const description = `Online debate isn’t always completely constructive.
    Perspective Hacks is a set of tools that makes it easier to find useful
    opinions, be part of healthier discussions, and get sharper insight into
    when, where, and why tricky conversations happen.`;

// TODO Convert to ES6 class.

function setup() {
  if (document.getElementById(CommentSelectors[hostname].ID)) {
    window.location.href = '#' + CommentSelectors[hostname].ID;
  }

  // Tracks new comments added to page.
  const analyzeAllComments = () => analyzeComments(comments.commentStream);
  new CommentWatcher(analyzeAllComments);

  // Processes comments on page.
  comments.getComments(CommentSelectors[hostname].COMMENT_WRAPPER).length;
  analyzeComments(comments.commentStream);
  this.infoPanelSetup = false;
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    setup();
  }
};

let totalComments = 0;

function reflect(promise){
    return promise.then(function(r){ return {response:r, error: false }},
                        function(error){ return {response:error, error: true }});
}

function analyzeComments(commentStream) {
  let requests = [];
  let stats = [];

  for (let comment of commentStream) {
    const commentBody = comment.getElementsByClassName(CommentSelectors[hostname].COMMENT_CONTENT)[0];
    const commentDate = comment.querySelectorAll(CommentSelectors[hostname].COMMENT_DATE)[0];

    if (commentBody && commentDate) {
      const parsedDate = (commentDate.getAttribute('content')) ?
          commentDate.getAttribute('content') : commentDate.innerText;
      requests.push(toxicityAnalyzer.analyze(commentBody.textContent, parsedDate));
    }
  }

  Promise.all(requests.map(reflect))
    .then((results) => {
      for (result of results) {
        if (!result.error) {
          stats.push({
            comment: result.response.comment,
            score: toxicityAnalyzer.getToxicity(result.response.response),
            date: result.response.date
          });
        }
      }
      graphPanel.setupGraphPanel(stats);
      if (!infoPanelSetup) {
        const graphPanelElement = document.getElementById('graph-panel');
        const closePanel = () => {
          graphPanelElement.style.display = 'none';
        };
        new InfoPanel(title, subtitle, description,
            graphPanel.getHeaderElement(), closePanel);
        infoPanelSetup = true;
      }
    }).catch((e) => {
      console.log('error with messages', e);
    }
  );
}

function classifyToxic(comment, toxicityScore) {
  comment.classList.add('toxic')
  comment.classList.add('toxic-hidden');

  if (comment.getElementsByClassName('toxic-message').length < 1) {
    const toxicRevealElement = document.createElement('button');
    toxicRevealElement.classList.add('toxic-message');
    const toxicRevealNode = document.createTextNode('Reveal toxic comment - rating: ' + toxicityScore.toFixed(3));
    toxicRevealElement.appendChild(toxicRevealNode);

    const toxicHideElement = document.createElement('button');
    toxicHideElement.classList.add('toxic-hide');
    const toxicHideNode = document.createTextNode('Hide toxic comment');
    toxicHideElement.appendChild(toxicHideNode);

    toxicRevealElement.addEventListener('click', function(){
        comment.classList.toggle('toxic-hidden');
        toxicRevealElement.classList.toggle('toxic-hidden');
      });

    toxicHideElement.addEventListener('click', function(){
        comment.classList.toggle('toxic-hidden');
        //toxicRevealElement.classList.toggle('toxic-hidden');
      });
    comment.insertBefore(toxicRevealElement, comment.childNodes[0]);
  }
}

function classifyNonToxic(comment) {
  comment.classList.remove('toxic');
  comment.classList.remove('toxic-hidden');
  const toxicMessage = comment.getElementsByClassName('toxic-message')[0];
  if (toxicMessage) {
    toxicMessage.remove();
  }
}

function updateCommentMessage() {
  const commentCountMessage =
      `${comments.toxicCommentCount} of ${comments.commentStream.length} comments
      identified as toxic`;
  const commentCountElement = document.getElementById('comment-count');
  commentCountElement.textContent = commentCountMessage;
}

setup();