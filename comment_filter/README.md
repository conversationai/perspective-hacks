Code by [raisaveuc](https://github.com/raisaveuc), [gurmukhp](https://github.com/gurmukhp), [bradleyg](https://github.com/bradleyg)

## Comment Blur Filter
Easily find and hide comments based on your tolerance for toxicity.

<img src="http://services.google.com/fh/files/misc/ph_comment_filter_1.gif" width="600">

### Background
Comments are scraped from the comment-enabled article in view and then scored using Perspective API's AnalyzeComment request. This data is then shown as a graph of toxicity over time. The idea is that it may be possible to identify trends in the toxicity of comments.

### Usage
Visit any article that contains comments from the below publishers. Once loaded, click the app icon in the extensions panel to see comments filtered by the default threshold. By sliding the control, the comments in the story will be hidden or shown dependent on the desired toxicity score.

- [Independent](https://www.independent.co.uk)
- [Financial Times](https://www.ft.com)
- [Economist](https://www.economist.com)
- [Telegraph](https://www.telegraph.co.uk)

<img src="http://services.google.com/fh/files/misc/ph_comment_filter_2.gif" width="600">

## Note
This is example code to help experimentation with the Perspective API; it is not an official Google product.
