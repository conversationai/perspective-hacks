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

const fs = require('fs-extra');
const concat = require('concat');
const copy = require('copy');
const rcopy = require('recursive-copy');
const emptyDir = require('empty-dir');
const downloadFile = require('download-file');

const projectFolders = [
  'hot_topics', 'toxicity_timeline', 'comment_filter'
];

const outputFolder = './dist';

fs.emptyDir(outputFolder).then(concatJs).then(copyExtensions);

function concatJs() {
  return concat([
    'common/utils.js',
    'common/pubsub.js',
    'common/comments.js',
    'common/toxicity-analyzer.js',
    'common/comment-watcher.js',
    'common/info-panel.js',
  ]);
};

function copyExtensions(concatJs) {
  projectFolders.forEach((projectFolder) => {
    rcopy(`./${projectFolder}`, `./dist/${projectFolder}/`).then(() => {
      // Copies common JS.
      fs.writeFileSync(
          __dirname + `/dist/${projectFolder}/common.js`, concatJs);

      // Copies common CSS.
      fs.writeFileSync(
          __dirname + `/dist/${projectFolder}/common.css`,
          fs.readFileSync(__dirname + '/common/info-panel.css'));

      // Copies common images.
      copy(
          ['common/*.svg', 'common/*.png'], `./dist/${projectFolder}/`,
          () => {});

      // Copies common Mustache templates.
      copy(
          'common/templates/*.mst', `./dist/${projectFolder}/templates`,
          () => {});

      // Copies templating library.
      copy(
          'node_modules/mustache/mustache.min.js',
          `./dist/${projectFolder}/third_party`, {flatten: true}, () => {});

      // Copies common fonts.
      copy(
        'common/fonts/*', `./dist/${projectFolder}/fonts`,
        () => {});

      // Toxic Graphs specific libraries.
      if (projectFolder === 'toxicity_timeline') {
        copy(
          'node_modules/chart.js/dist/Chart.bundle.min.js',
          `./dist/${projectFolder}/third_party`, {flatten: true}, () => {});

        downloadFile('https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/datejs/date.js', {
          directory: `./dist/${projectFolder}/third_party`
        });
      }
    });
  })
}
