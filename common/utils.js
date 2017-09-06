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
 * Common utility functions.
 */
const Utils = class {
  /**
   * Loads template from a URL.
   * @param {string} url The url of the template.
   * @return {Promise} Promise containing the text within the template file.
   */
  loadTemplate(url) {
    return new Promise((resolve, reject) => {
      const x = new XMLHttpRequest();
      x.open('GET', url, true);
      x.onreadystatechange = () => {
        if (x.readyState == 4 && x.status == 200) {
          resolve(x.responseText);
        } else if (x.status == 400) {
          reject();
        }
      };
      x.onerror = reject;
      x.send(null);
    });
  }

  /**
   * Renders Mustache template and inserts the element relative to a reference
   * element.
   * @param {string} templateUrl The filepath of the Mustache template.
   * @param {Object} templateParams The parameters to pass into the template.
   * @param {Element} referenceElement The element of reference to insert the
   *     object into or before.
   * @param {Function=} opt_onFulfilled The optional function to execute after
   *     inserting the template.
   * @param {boolean} [append=true] Whether or not to append the element.
   */
  insertTemplate(templateUrl, templateParams, referenceElement, opt_onFulfilled,
      append = true) {
    this.loadTemplate(templateUrl).then((template) => {
      const renderedTemplate = Mustache.render(template, templateParams);
      const renderedElement =
          document.createRange().createContextualFragment(renderedTemplate);
      if (append) {
        referenceElement.appendChild(renderedElement);
      } else {
        referenceElement.parentNode.insertBefore(renderedElement,
          referenceElement);
      }
    }).then(() => {
      if (opt_onFulfilled) {
        opt_onFulfilled();
      }
    });
  }

  /**
   * Creates a DOM element.
   * @param {string} tagName
   * @param {string} className
   * @param {string} text
   * @returns {Element}
   */
  createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    element.innerText = text;
    return element;
  }
};
