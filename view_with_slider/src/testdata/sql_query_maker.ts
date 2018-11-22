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
  A little tools to construct compound queries to get examples from bigquery
  defined by various score ranges.

  ts-node sql_query_maker.ts
*/

interface ThresholdSpec {
  // The bottom and top end of the score range of comments to get.
  // null indicates end of the range.
  from: number|null;
  to: number|null;
  // The max number of comments to get.
  limit: number|null;
}

function thersholdsBucketSubquery(
    attributesToSelect: string[],
    attribute: string,
    thresholds: ThresholdSpec): string {
  const conditions = [];
  if (thresholds.from) {
    conditions.push(`${attribute} >= ${thresholds.from}`);
  }
  if (thresholds.to) {
    conditions.push( `${attribute} < ${thresholds.to}`);
  }
  return `
     (SELECT id, ${attributesToSelect.join(', ')}, content
      FROM  \`wikidetox-viz.scored_conversations.wikiconvs\`
      WHERE ${conditions.join(' AND ')}
      LIMIT ${thresholds.limit})
      `;
}


function buildQuery(allAttributes: string[],
  thresholdAttributes: string[],
  bucketThresholds: ThresholdSpec[]) {
  const subqueries = [];
  for (const attribute of thresholdAttributes) {
    for (const thresholds of bucketThresholds) {
      subqueries.push(thersholdsBucketSubquery(
        allAttributes, attribute, thresholds));
    }
  }
  return subqueries;
}

function main() {
  const allAttributes = [
    // 'TOXICITY',
    'SEVERE_TOXICITY',
    // 'TOXICITY_OBSCENE',
    // 'TOXICITY_THREAT',
    'TOXICITY_INSULT',
    // 'TOXICITY_IDENTITY_HATE',
    // 'SEXUALLY_EXPLICIT',
  ];
  const bucketThresholds: ThresholdSpec[] = [
    { from: null, to: 0.1, limit: 5000 },
    { from: 0.1, to: 0.8, limit: 200 },
    { from: 0.8, to: null, limit: 50 }];

  const q1s = buildQuery(allAttributes, ['TOXICITY_INSULT'], bucketThresholds);
  const q2s = buildQuery(allAttributes, ['SEVERE_TOXICITY'], [{ from: 0.9, to: null, limit: 20 }]);

  const allQs = q1s.concat(q2s);

  console.log(`SELECT id, ${allAttributes.join(', ')}, content
    FROM (
      ${allQs.join('\n UNION ALL \n')})
    AS t
    GROUP BY id, ${allAttributes.join(', ')}, content`);
}

main();

// (`SELECT id, ${attributesToSelect.join(', ')}, content FROM  `wikidetox-viz.scored_conversations.wikiconvs`
//  WHERE TOXICITY_OBSCENE >= 0.0 AND TOXICITY_OBSCENE < 0.2 LIMIT 30)`

// function transformObj(inputObj: InputObj): OutputObj {
//   return {
//     text: inputObj.text,
//     scores: {TOXICITY: inputObj.score},
//     date: new Date((new Date()).valueOf() + (Math.random() * 1000 * 60 * 60 * 4)).toLocaleString()
//   };
// }

// console.log(JSON.stringify(CLIMATE.map(transformObj), null, 2));
