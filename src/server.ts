// server.js
import express from 'express';
import AWS from 'aws-sdk'
import dotenv from 'dotenv';
//const express = require('express');
//const AWS = require('aws-sdk');
dotenv.config();
const app = express();

app.use(express.json());
AWS.config.update({ 
  region: process.env.AWS_REGION  
});

// const sqs = new AWS.SQS({ 
//   region: `${process.env.AWS_REGION}`, 
//   credentials: { 
//     accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
//     secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
//   } 
// });
const sqs = new AWS.SQS()
console.log(`${process.env.AWS_REGION}`)
console.log(process.env.AWS_REGION)
const queueUrl = process.env.SQS_URL

app.get('/params', async(req, res) => {
  console.log(`${process.env.AWS_QUEUE_URL}`)
  console.log(process.env.AWS_SQS_URL)
  res.json({ region1: `${process.env.AWS_REGION}`, region2: process.env.AWS_REGION })
})//'YOUR_QUEUE_URL';

app.post('/transactions', async (req, res) => {
  const { idempotencyId, amount, type } = req.body;

  // Validar payload
  if (!idempotencyId || !amount || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Enviar transação para a SQS
  const params = {
    MessageBody: JSON.stringify({ idempotencyId, amount, type }),
    QueueUrl: queueUrl,
  };

  try {
    await sqs.sendMessage({
      MessageBody: JSON.stringify({ idempotencyId, amount, type }),
      QueueUrl: `${process.env.AWS_SQS_URL}`,
      
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
