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

'use strict';

class Popup {
  constructor() {
    this.scoreElement = document.getElementById('score');
    this.selectionElement =
        this.scoreElement.getElementsByClassName('highlighter-selection')[0];
    this.highlighterFaces =
        this.scoreElement.getElementsByClassName('highlighter-faces')[0];
    this.highlighterPanel =
        this.scoreElement.getElementsByClassName('highlighter-panel')[0];
    this.selectionHeader =this.scoreElement.getElementsByTagName('h1')[0];
    this.errorHeader = document.getElementsByClassName('highlighter-title')[0];
    this.errorMessage = document.getElementsByClassName('highlighter-error-message')[0];

    this.icons = new Icons();
    this.faceSvg = {
      happy: this.icons.getHappyFace(),
      neutral: this.icons.getNeutralFace(),
      sad: this.icons.getSadFace()
    };
    this.animations = new Animations();
    this.perspective = new Perspective();
    this.selectedText;
    this.shouldSubmitToPerspective;
    this.shouldSubmitToSpreadsheet;

    this.spreadsheetUrl;
    chrome.storage.local.get(null, (response) => {
      if (!response || !response.submitToPerspective) {
        chrome.storage.local.set({
          'submitToPerspective': true
        });
      }
      this.shouldSubmitToPerspective = response.submitToPerspective || true;
      this.shouldSubmitToSpreadsheet = response.submitToSpreadsheet;
      this.spreadsheetUrl = response.spreadsheet;
    });

    this.setupListeners();
    this.getSelectedText();
  }

  setupListeners() {
    this.highlighterFaces.addEventListener('click', (evt) => {
      if (evt.target.dataset['score']) {
        this.submitPhrase(evt.target.dataset['score']);
      }
    });
  }

  show() {
    if (this.selectedText) {
      this.selectionElement.textContent = '\"' + this.selectedText + '\"';
      this.animations.playAnimation('Fade In');
    } else {
      this.error();
    }
  }

  hide() {
    this.animations.playAnimation('Fade Out', () => {
      // Resets the success animation for the next view (since DOM is reused).
      this.animations.playAnimation('Success', null, true);
      this.highlighterPanel.removeChild(this.highlighterFaces);
      this.animations.reset();
    }, true);
  }

  submitPhrase(score) {
    this.animations.playAnimation('Loading', null, false, true);

    if(this.shouldSubmitToPerspective) {
      this.submitToPerspective(score);
    }

    if(this.shouldSubmitToSpreadsheet) {
      this.submitToSpreadsheet(score);
    }
  }

  submitToPerspective(score) {
    const successTimeline = this.animations.getTimeline('Success');
    // Show loader.
    successTimeline.tweenFromTo(0, .738);

    this.perspective.suggestScore(this.selectedText, score, (suceeded, response) => {
      if (suceeded) {
        successTimeline.tweenFromTo(1.06, 2.25);
        this.highlighterPanel.removeChild(this.highlighterFaces);
      } else {
        this.errorHeader.innerText = response.error.status;
        this.errorMessage.innerText = response.error.message.substring(0, 70);
        successTimeline.tweenFromTo(2.281, 3);
      }
      console.log('response: ', response);
    });
  }

  submitToSpreadsheet(score) {
    // TODO: Add Apps Script function
    const date = new Date().toUTCString().replace(/\s+/g,'%20');
    const selection = this.selectedText.replace(/\s+/g,'%20');
    let rowData = `date=${date}&selection=${selection}&score=${score}`;

    if (this.spreadsheetUrl) {
      rowData += '&spreadsheet=' + this.spreadsheetUrl;
    }
    this.postToSheet(rowData);
  }

  postToSheet(rowData) {
    const successTimeline = this.animations.getTimeline('Success');
    // Show loader.
    if (!this.shouldSubmitToPerspective) {
      successTimeline.tweenFromTo(0, .738);
    }

    const appsScriptUrl =
        `https://script.google.com/macros/s/AKfycbwi3QqAJtMsfcElq2_mglCLqLjmOhT_a8MAt3pm7vpm-ebyLwym/exec`;
    const x = new XMLHttpRequest();

    x.open('POST', appsScriptUrl, true);
    // Add the required HTTP header for form data POST requests
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    x.send(rowData);
    x.onreadystatechange = () => {
      if (x.readyState == 4 && x.status == 200) {
        let ssUrl = '';
        if (x.response.startsWith('https://docs.google.com/')) {
          ssUrl = x.response;
        }
        if (!this.shouldSubmitToPerspective) {
          successTimeline.tweenFromTo(1.06, 2.25);
        }
        if (!this.spreadsheetUrl && ssUrl) {
          chrome.storage.local.set({
            'spreadsheet': ssUrl
          }, () => {
            this.spreadsheetUrl = ssUrl;
          });
        }
      } else if (x.readyState == 4) {
        if (!this.shouldSubmitToPerspective) {
          successTimeline.tweenFromTo(2.281, 3);
        }
      }
    };
  }

  getSelectedText() {
    const scope = this;

    chrome.tabs.executeScript({
      code: `window.getSelection().toString()`
    }, (selection) => {
      if(selection !== undefined && selection.length > 0) {
        scope.selectedText = selection[0].replace(/\"/g, '“');
        scope.show();
      } else {
        scope.error();
      }
    });
  }

  error() {
    this.selectionHeader.textContent = 'No selected text';
    this.selectionElement.textContent = 'Highglight text on the page to submit to Perspective';
    this.scoreElement.removeChild(this.highlighterPanel);
  }
}
new Popup();