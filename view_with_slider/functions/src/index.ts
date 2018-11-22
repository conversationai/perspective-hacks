import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as perspective_api from "@conversationai/perspectiveapi-js-client";
import * as config from "./config";

const client = new perspective_api.Client(config.perspective_config.apiKey);

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

async function addCommentFn(data : {text:string}) {

  if (!(typeof data.text === 'string') || data.text.length === 0) {
    throw new functions.https.HttpsError('invalid-argument',
        'The function must be called with ' +
        'one arguments "text" containing the message text to add.');
  }

  const results = await client.getScores(data.text, {
    attributes: ['TOXICITY', 'SEVERE_TOXICITY', 'INSULT', 'IDENTITY_ATTACK', 'THREAT', 'OBSCENE' ],
    doNotStore: true,
    languages: ['en'],
  });

  const docRef = db.collection('comments').doc();

  const commentData = {
    text: data.text,
    scores: results,
    date: Date.now()
  };

  await docRef.set(commentData);

  return commentData;
}

export const addComment = functions.https.onCall((data, _context) => {
  return addCommentFn(data);
});

/*
 curl -H 'Content-Type: application/json' \
  -d '{"text": "hello there"}' \
  https://us-central1-conversation-ai-experiments.cloudfunctions.net/addCommentReq
*/
export const addCommentReq = functions.https.onRequest(
  async (request, response) => {
  const result = addCommentFn(request.body);
  response.send(JSON.stringify(result, null, 2));
});
