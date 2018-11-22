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
/*
Usage: Convert answers with multiple parts into separate rows.

  node build/server/setup/answers_jsonlines_transformer.js \
    --infile="./tmp/Answers.json" \
    --infile="./tmp/Answers2.json"
*/

// import * as fs from 'fs';
// import * as readline from 'readline';
// // import * as stream from 'stream';
// import * as yargs from 'yargs';

// // Command line arguments.
// interface Params {
//   infile: string;
//   outfile: string;
// }

// interface InputObj {
//   text: string;
//   score: number;
// }

// interface OutputObj {
//   text: string;
//   scores: {[modelName: string]: number};
//   date: string;
// }

// function transformObj(inputObj: InputObj): OutputObj {
//   return {
//     text: inputObj.text,
//     scores: {TOXICITY: inputObj.score},
//     date: '',
//   };
// }

// async function main(params: Params) {
//   const instream = fs.createReadStream(params.infile);
//   const outstream =
//       fs.createWriteStream(params.outfile, {flags: 'w', encoding: 'utf-8'});
//   const rl = readline.createInterface(instream, outstream);

//   let lineCount = 0;

//   rl.on('line', async function(line) {
//     outstream.write(`${JSON.stringify(transformObj(JSON.parse(line)))}\n`);
//     lineCount++;
//   });

//   rl.on('close', function() {
//     outstream.end();
//     console.log(`lineCount: ${lineCount}`);
//   });
// }

// const args =
//     yargs
//         .option('infile', {
//           describe: 'Input path to JSON-lines file'
//         })
//         .option('outfile', {
//           describe: 'Creted path to JSON-lines file'
//         })
//         .demandOption(
//             ['infile', 'outfile'],
//             'Please provide at least --infile and --outfile.')
//         .help()
//         .argv;

// main(args as any as Params)
//     .then(() => {
//       console.log('Success!');
//     })
//     .catch(e => {
//       console.error('Failed: ', e);
//       process.exit(1);
//     });
