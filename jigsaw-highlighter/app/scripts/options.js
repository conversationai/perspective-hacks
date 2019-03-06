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

class Options {
  constructor() {
    this.setupSubmissionOptions();
    this.setupSpreadsheetUrl();
  }

  setupSubmissionOptions() {
    const submissionOptionElements = document.querySelectorAll('.submission-option input');
    chrome.storage.local.get(
      ['submitToPerspective', 'submitToSpreadsheet'], (response) => {
        if (!response || !response.submitToPerspective) {
          chrome.storage.local.set({
            'submitToPerspective': true
          });
        }
        submissionOptionElements[0].checked = response.submitToPerspective || true;
        submissionOptionElements[1].checked = response.submitToSpreadsheet || false;
    });

    submissionOptionElements.forEach((element) => {
      element.addEventListener('change', () => {
        const target = element.dataset.target;
        let targetObject = {};
        targetObject[target] = element.checked;

        if (target === 'submitToSpreadsheet' && element.checked) {
          chrome.permissions.request({
            origins: ['https://script.google.com/']
          }, (granted) => {
            // Callback argument will be true if the user granted permissions.
            if (granted) {
              this.getAuthorization(targetObject, element);
            }
          });
        } else {
          this.storeObject(targetObject);
        }
      });
    });
  }

  getAuthorization(targetObject, element) {
    const appsScriptUrl =
    `https://script.google.com/macros/s/AKfycbwi3QqAJtMsfcElq2_mglCLqLjmOhT_a8MAt3pm7vpm-ebyLwym/exec`;
    const x = new XMLHttpRequest();

    x.open('GET', appsScriptUrl, true);

    x.onreadystatechange = () => {
      if (x.readyState == 4 && x.status == 200) {
        if (!x.response.indexOf('data-success') !== -1) {
          window.open(appsScriptUrl, '_blank');
        }
        this.storeObject(targetObject);
      } else if (x.readyState == 4) {
        element.checked = false;
      }
    };
    x.onerror = () => {
      element.checked = false;
    };
    x.send();
  }

  storeObject(targetObject) {
    chrome.storage.local.set(targetObject, () => {
      console.log('SAVED! ', targetObject);
    });
  }

  setupSpreadsheetUrl() {
    const spreadsheetUrlElement = document.getElementById('highlighter-spreadsheet-url');
    const optionsError = document.getElementsByClassName('options-error')[0];
    chrome.storage.local.get('spreadsheet', (response) => {
      spreadsheetUrlElement.value = response.spreadsheet || '';
    });

    spreadsheetUrlElement.addEventListener('change', () => {
      if (spreadsheetUrlElement.value.length == 0 || spreadsheetUrlElement.value.startsWith('https://docs.google.com/')) {
        chrome.storage.local.set({
          'spreadsheet': spreadsheetUrlElement.value
        }, () => {
          optionsError.classList.remove('show');
        });
      } else {
        optionsError.classList.add('show');
      }
    });
  }
}

new Options();