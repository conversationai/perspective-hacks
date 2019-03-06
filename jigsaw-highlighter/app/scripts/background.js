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

class App {
  constructor() {
    this.active = true;
    this.blacklisted = false;
    this.blacklist;
    this.popupUrl;

    chrome.browserAction.setPopup({ popup: 'popup.html' });
  }

  updateBlacklist() {
    chrome.storage.local.get('blacklist', (response) => {
      this.blacklist = new Set(response.blacklist.split('\n'));
    });

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.blacklist) {
        this.blacklist = new Set(changes.blacklist.newValue.split('\n'));
      }
    });
  }

  updateState() {
    chrome.storage.local.get('active', (response) => {
      this.active = response.active;
      this.updateIcon();
    });
  }

  updateIcon() {
    let icon;
    if (this.blacklisted) {
      icon = 'inactive.png';
    } else if (this.active) {
      icon = 'on.png';
    } else {
      icon = 'off.png';
    }
    chrome.browserAction.setIcon({
      path: `images/${icon}`
    });
  }
}
new App();