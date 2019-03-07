# Jigsaw Highlighter
Jigsaw Highlighter is a tool that allows users to rate content on any site they visit. Users can submit scores to [Perspective API](http://www.perspectiveapi.com/) to help train the machine learning model. Optionally, they can choose to save the data to a Google Spreadsheet to analyze the data how they wish.

## Get API Key
Follow the [Perspective API Quickstart](https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md) to get an API Key and assign it in `app/scripts/perspective.js`

In this file, you can also add the communityID and optional clientToken and communityId. See [suggestCommentScore API guide](https://github.com/conversationai/perspectiveapi/blob/master/api_reference.md#sending-feedback-suggestcommentscore).

## Setup
 - checkout project
 - run `npm install`
 - run `gulp build`

Jigsaw Highlighter Chrome extension will now be ready for testing in the `dist` folder.

## Installing the Chrome Extension
Follow [Load The Extension](https://developer.chrome.com/extensions/getstarted#unpacked) from Chrome Developers to install and test the extension locally.

To maintain the Chrome Extension ID throughout development, generate a private key file (.pem) to package with your extension. See [Stack Overflow](https://stackoverflow.com/questions/37317779/making-a-unique-extension-id-and-key-for-chrome-extension).

## Known Issues
The current Spreadsheet functionality is not working, due to new CORS permissions in Google Apps Script. Future implementations of the Spreadsheet option should use Oauth, which will also narrow permissions scope.

## Note
This is example code to help experimentation with the Perspective API; it is not an official Google product.