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

const toggleInfoPanel =
    `if (!window.infoPanelElement) {
      window.infoPanelElement = document.getElementById('info-panel');
    }
    if (window.infoPanelElement) {
      window.infoPanelElement.classList.toggle('info-panel--hidden');
      document.body.classList.toggle('comment-filtered');
    }`;
let infoPanelInitialized = false;

// Loads script when user clicks icon.
chrome.browserAction.onClicked.addListener(function (tab) {
  if (!infoPanelInitialized) {
    chrome.tabs.executeScript(null, {
      "file": "main.js"
    }, function () {
      infoPanelInitialized = true
    });
  } else {
    chrome.tabs.executeScript(null, {
      "code": toggleInfoPanel
    }, function () {});
  }
});
