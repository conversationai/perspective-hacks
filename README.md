# Perspective Hacks
This repository contains a collection of experiments to analyze toxicity levels in comments from a selection of news publishers. Each experiment is a Chrome Extension that uses the [Perspective API](http://www.perspectiveapi.com/) to determine the toxicity levels of comments within the page.

## Get API Key
Follow the [Perspective API Quickstart](https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md) to get an API Key and assign it in `common/toxicity-analyzer.js`

## Setup
 - checkout project
 - run `npm install`
 - run `npm run build`

4 Chrome extensions will now be ready for testing in the `dist` folder.

## Installing Chrome Extensions
Follow [Load The Extension](https://developer.chrome.com/extensions/getstarted#unpacked) from Chrome Developers to install and test each extension locally.

## The Hacks

 * [Toxicity Timeline](toxicity_timeline/README.md): See exactly when negative conversations happen and discover the patterns behind them.
 * [Hot Topics](hot_topics/README.md): Compare unpublished articles with others that have created debate - before you push them live.
 * [Comment Blur Filter](comment_filter/README.md): Easily find and hide comments based on your tolerance for toxicity.

## Note
This is example code to help experimentation with the Perspective API; it is not an official Google product.