# Perspective API Viewership Demo

This project provides an example of viewership control over discussions by
providing various sorting and aggregation tools over comments.

This project was generated with [Angular
CLI](https://github.com/angular/angular-cli) version 6.0.7.

## Todo

* Improve horrible copying of configs into `functions/src`
* Fix firebase security rules (only allow read by non-admin?)

## Setup

Global NPM dependencies:

```shell
npm install -g firebase-tools typescript
```

* [Setup a Google cloud project](https://cloud.google.com/start/) with [Perspective API enabled](https://www.perspectiveapi.com/).
* [Setup Firebase for the project](https://firebase.corp.google.com/).
* Copy and fill out `config.template.ts` into a (root level) file named `config.ts`
  * Right now, also copy the perspective part of `config.ts` into `functions/src/`.
* Have the ConvaiChecker hit a mock service backend based on a Firebase
  function so that the perspective API key does not need to be provided in the
  distributed app.

*Note* this currently depends on the `iislucas-refactor-for-observables3` branch
of
[perspectiveapi-authorship-demo](https://github.com/conversationai/perspectiveapi-authorship-demo).
You'll need to download that, and *in its directory* build and link it with:

```shell
yarn install
yarn run build:lib
```

And then, in *this* directory, run:

```shell
yarn install
rm -rf "node_modules/@conversationai/perspectiveapi-authorship-demo"
cp -r ../../perspectiveapi-authorship-demo/dist ./node_modules/\@conversationai/perspectiveapi-authorship-demo
```

Then, to build and deploy the whole app

```shell
yarn run build
firebase deploy
```

To deply only the Firebase functions:

```shell
firebase deploy --only functions
```

When deploying you should see a function output URLs, e.g. `https://us-central1-conversation-ai-experiments.cloudfunctions.net/addComment`

To start a local service (speaks to Firebase using network)

```shell
yarn run start
```

To start a local firebase hosting and functions service (unclear what the webapp does for this)

```shell
firebase serve
```

## The Angular WebApp for the Viewership Demo

### Development server for WebApp

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
