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

/**
 * Content for generic info panel wrapper.
 */
const title = 'Hot Topics';
const subtitle = `How does this work?`;
const description =
    `Hot Topics analyses historical data from topics.`;

/**
 * Messaging for panels dependant on toxicity score.
 */
const status = {
  'low': {
    'class': 'low',
    'status': 'Low',
    'suggestion':
        [`Based on comparisons with historic data this has a low`, `likelyhood of sparking heated discussions.`]
  },
  'moderate': {
    'class': 'moderate',
    'status': 'Moderate',
    'suggestion':
        [`Based on comparisons with historic data this has a medium`, `likelyhood of sparking heated discussions.`]
  },
  'high': {
    'class': 'high',
    'status': 'High',
    'suggestion':
        [`Based on comparisons with historic data this has a high`, `likelyhood of sparking heated discussions.`]
  },
  'extreme': {
    'class': 'extreme',
    'status': 'High',
    'suggestion':
        [`Based on comparisons with historic data this has a high`, `likelyhood of sparking heated discussions.`]
  }
};

/**
 * Downloads a file from the given URL.
 * @param {string} url
 * @returns
 */
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        resolve(JSON.parse(this.responseText));
      }
    };
    if (chrome.extension) {
      xhttp.open('GET', chrome.extension.getURL(url), true);
    } else {
      xhttp.open('GET', url, true);
    }
    xhttp.send();
  });
}

/**
 * Returns status from a given scrore.
 * @param {number} score
 * @returns {string}
 */
function getStatus(score) {
  if (score < 11) {
    return status.low;
  } else if (score < 23) {
    return status.moderate;
  } else if (score < 34) {
    return status.high;
  } else {
    return status.extreme;
  }
}

/**
 * Returns articles topic.
 * @returns {string}
 */
function getTopicName() {
  return document.body.dataset.topic;
}


/**
 * Given a score and status, returns an element containing meta data about
 * the article.
 * @param {number} score
 * @param {string} status
 * @returns
 */
function getToxicMetaData(score, status) {
  const scoreElement = utils.createElement('div', 'toxic-score', score);
  const statusElement = utils.createElement('div', 'toxic-status', 'chance to be a hot topic');
  const suggestionElement = utils.createElement('div', 'toxic-suggestion', '');
  const line1 = utils.createElement('span', 'toxic-suggestion-line', status.suggestion[0]);
  const line2 = utils.createElement('span', 'toxic-suggestion-line', status.suggestion[1]);
  suggestionElement.appendChild(line1);
  suggestionElement.appendChild(line2);
  const toxicMetaData = utils.createElement('div', 'toxic-metadata', '');

  toxicMetaData.appendChild(scoreElement);
  toxicMetaData.appendChild(statusElement);
  toxicMetaData.appendChild(suggestionElement);

  return toxicMetaData;
}

/**
 * Build the panel housing all the article meta data.
 * @param {Object} data Parsed data from Big Query.
 */
function buildPanel(data) {
  const popup = document.createElement('div');

  const logoElement = utils.createElement('img', 'toxic-logo', '');
  logoElement.src = chrome.extension.getURL('/perspective.png');

  const headerElement = document.createElement('header');
  popup.appendChild(headerElement);

  const score = parseFloat(data[getTopicName()].toxicity * 100).toFixed(0);
  const status = getStatus(score);

  popup.appendChild(getToxicMetaData(score, status));

  popup.classList.add('toxic-popup');
  popup.classList.add(status.class);

  const containerElement = document.createElement('div');
  containerElement.classList.add('toxic-popup-container');
  containerElement.appendChild(popup);

  document.body.appendChild(containerElement);

  new InfoPanel(title, subtitle, description, headerElement, () => {
    containerElement.style.display = 'none';
  });
}

(function() {
downloadFile('parsed-data.json').then(buildPanel);
})();
