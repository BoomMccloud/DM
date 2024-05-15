const express = require('express');
const {PubSub} = require('@google-cloud/pubsub');
const bodyParser = require('body-parser');

const app = express();
const pubSubClient = new PubSub();

app.use(bodyParser.json());

app.post('/publish', async (req, res) => {
  const topicName = 'projects/second-height-387103/topics/messsage';
  const dataBuffer = Buffer.from(JSON.stringify(req.body));

  try {
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
    res.status(200).send(`Message published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    res.status(500).send(`Error publishing message`);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
