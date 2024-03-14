import express from 'express';
import AWS from 'aws-sdk'
import dotenv from 'dotenv';
import crypto from "crypto"
dotenv.config();
const app = express();

app.use(express.json());

const REGION = `${process.env.AWS_REGION}`
const SQS_URL = `${process.env.AWS_SQS_URL}`

AWS.config.update({ 
  region: 'us-east-1',//`${process.env.AWS_REGION}`  
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
  }
});
console.log(REGION)
const sqs = new AWS.SQS()

app.post('/transactions', async (req, res) => {
  const { amount, type } = req.body;  
  
  if (!amount || !type) {
    return res.status(400).json({ error: 'Missing required fields: amount | type' });
  }

  if (type !== 'credit' && type !== 'debit') {
    return res.status(400).json({ error: 'Invalid type. Should be or credit or debit' });
  }

  const idempotencyId = crypto.randomUUID();
  
  try {
    console.log(SQS_URL)
    await sqs.sendMessage({
      MessageBody: JSON.stringify({ idempotencyId, amount, type }),
      QueueUrl: SQS_URL,
      
    }).promise();
    res.status(200).json({ message: 'Transaction queued successfully' });
  } catch (err) {
    console.error('Error queuing transaction:', err);
    res.status(500).json({ error: 'Failed to queue transaction' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
