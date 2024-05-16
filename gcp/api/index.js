const express = require('express');
const {PubSub} = require('@google-cloud/pubsub');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const pubSubClient = new PubSub();

app.use(bodyParser.json());
app.use(cors());  // This will allow all domains. For production, configure allowed origins.


app.post('/pub', async (req, res) => {
  const topicName = 'projects/second-height-387103/topics/message';
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

app.get('/ping', async (req, res) => {
  res.send("pong");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
