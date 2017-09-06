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

const utils = new Utils();
const infoPanelTemplate = 'templates/info-panel.mst';

/**
 * Class names contained within the InfoPanel component.
 * @readonly
 * @enum {string}
 */
const InfoPanelClass = {
  CLOSE_ICON: 'info-panel__close-icon',
  DETAILS: 'info-panel__details',
  DETAILS_HIDDEN: 'info-panel__details--hidden',
  DETAILS_VISIBLE: 'info-panel__details--visible',
  HIDDEN: 'info-panel--hidden',
  INFO_PANEL: 'info-panel',
  INFO_TOGGLE: 'info-toggle',
  INNER: 'info-panel__inner',
  COMMENT_FILTERED: 'comment-filtered',
};

const InfoPanelIcon = {
  DEFAULT: {
    CLOSE: 'close.svg',
    DOWN: 'down.svg',
  },
  WHITE: {
    CLOSE: 'close-white.svg',
    DOWN: 'down-white.svg',
  }
}
/**
 * Hides the InfoPanel from the page with CSS classes.
 */
const hideInfoPanel = (element) => {
  element.classList.add(InfoPanelClass.HIDDEN);
  document.body.classList.remove(InfoPanelClass.COMMENT_FILTERED);
};

/**
 * Defines the InfoPanel overlay to be added to the page.
 */
const InfoPanel = class {
  constructor(title = '', subtitle, description, containerElement,
      closeFunction = hideInfoPanel, isDarkTheme) {
    /** @private {string} The title of the extension. */
    this.title_ = title;
    /** @private {string} The title of the extension. */
    this.subtitle_ = subtitle;
    /** @private {string} The description of the extension. */
    this.description_ = description;
    /** @private {Element} The element to contain the InfoPanel. */
    this.containerElement_ = containerElement;
    /** @private {string} The function to close the InfoPanel. */
    this.closeFunction_ = closeFunction;
    /** @private {string} The InfoPanel element to be assigned on setup. */
    this.infoPanelElement_;
    /** @private {id} The id by which to identify the InfoPanel element. */
    this.id_ = InfoPanelClass.INFO_PANEL;
    /** @private {string} The icon set to use in the InfoPanel */
    this.icon_ = (isDarkTheme ? InfoPanelIcon.WHITE : InfoPanelIcon.DEFAULT);

    this.setupInfoPanel_();
  }

  /**
   * Sets up the InfoPanel by adding it to the page with details toggle and
   * close listeners.
   * @private
   */
  setupInfoPanel_() {
    const templateUrl = chrome.runtime.getURL(infoPanelTemplate);
    const templateParams = {
      closeIcon: chrome.runtime.getURL(this.icon_.CLOSE),
      downArrow: chrome.runtime.getURL(this.icon_.DOWN),
      title: this.title_,
      subtitle: this.subtitle_,
      description: this.description_,
    };
    utils.insertTemplate(templateUrl, templateParams, this.containerElement_,
        () => {
      this.infoPanelElement_ = document.getElementById(this.id_);
      pubSub.publish(PubSubEvent.INFO_PANEL_READY);

      // Toggles additional information when user clicks the toggle icon.
      const infoToggle = document.getElementById(InfoPanelClass.INFO_TOGGLE);
      infoToggle.addEventListener('click', () => {
        this.infoPanelElement_.classList.toggle(InfoPanelClass.DETAILS_VISIBLE);
      });

      // Closes the InfoPanel when user clicks the close icon.
      const closeLink =
          document.getElementsByClassName(InfoPanelClass.CLOSE_ICON)[0];
      closeLink.addEventListener('click', () => {
        this.closeFunction_(this.infoPanelElement_);
      });
    });
  }
};
