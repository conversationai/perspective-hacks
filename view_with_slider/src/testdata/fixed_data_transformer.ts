/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// import { CLIMATE } from './CLIMATE';
import { WIKIPEDIA_COMMENTS } from './WP_TOXIC_BUCKETS_200';

interface InputObj {
  comment_text: string;
  frac_neg: number;
  id: string;
}

interface OutputObj {
  text: string;
  scores: {[modelName: string]: number};
  date: string;
  id: string;
}

function transformObj(inputObj: InputObj): OutputObj {
  return {
    text: inputObj.comment_text,
    scores: {TOXICITY: inputObj.frac_neg},
    id: inputObj.id,
    date: new Date((new Date()).valueOf() + (Math.random() * 1000 * 60 * 60 * 4)).toLocaleString()
  };
}

console.log(JSON.stringify(WIKIPEDIA_COMMENTS.map(transformObj), null, 2));
