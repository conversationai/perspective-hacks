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

const PubSubEvent = {
  INFO_PANEL_READY: 'infoPanelReady',
  COMMENT_FILTER_READY: 'commentFilterReady',
};

/**
 * Publishes and subscribes to events on the page.
 */
const PubSub = class {
  constructor() {
    /** @private {Object} The topics for subscription. */
    this.topics_ = {};
  }

  /**
   * Subscribes to a topic.
   * @param {string} topic The topic for subscription.
   * @param {Function} listener The listener subscribing.
   * @param {Object=} opt_scope The optional scope.
   * @return {Object}
   */
  subscribe(topic, listener, opt_scope) {
    // Creates the topic's object if not yet created.
    if (!this.topics_[topic]) {
      this.topics_[topic] = [];
    }

    // Constructs listener object with scope if defined.
    let listenerObject = {'listener': listener};
    if (opt_scope) {
      listenerObject.scope = opt_scope;
    }

    // Adds the listener to queue.
    const index = this.topics_[topic].push(listenerObject) - 1;

    // Provides handle back for removal of topic.
    return {
      remove: function() {
        delete this.topics_[topic][index];
      },
    };
  }

  /**
   * Publishes to a topic.
   * @param {string} topic The topic in subscription.
   * @return {undefined}
   */
  publish(topic, ...args) {
    // Exits if the topic doesn't exist, or there's no listeners in queue.
    if (!this.topics_[topic]) {
      return;
    }

    // Cycles through topics queue.
    for (let item of this.topics_[topic]) {
      if (item.scope) {
        item.listener.call(item.scope, args);
      } else {
        item.listener(args);
      }
    }
  }
};

const pubSub = new PubSub();