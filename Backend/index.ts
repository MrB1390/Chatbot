import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import AWS from "aws-sdk";
import OpenAI from "openai";
import dotenv from "dotenv";

import {v4 as uuidv4} from 'uuid';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';


// used to synthesize the text to speech
const polly = new AWS.Polly({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// used for storing the audio file and access it 
const s3 = new AWS.S3({
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   region: process.env.AWS_REGION,
 });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req: Request, res: Response) => {
  const message = req.body.message; 

  try {
    const stream = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-4o-mini",
      stream: true, 
    });

    // stream used to collect responses concuncurrently instead of waiting for full response
    let responseText = "";
    for await (const chunk of stream) {
      responseText += chunk.choices[0]?.delta?.content || "";
    }
    

    const params: AWS.Polly.SynthesizeSpeechInput = {
      OutputFormat: 'mp3',
      Text: responseText,
      VoiceId: 'Joanna',
    };

    polly.synthesizeSpeech(params, async (err, data) => {
      if (err) {
        console.error("Error with Polly: ", err);
        return res.status(500).json({ error: "Error with Polly" });
      }

      const audioStream = data.AudioStream as Buffer;

      // Generate a unique filename for the audio file
      const fileName = `audio/${uuidv4()}.mp3`;

      // Upload the audio stream to S3
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME as string, 
        Key: fileName,
        Body: audioStream,
        ContentType: 'audio/mpeg',
        ACL: 'public-read', 
      };
      const uploadResult = await s3.upload(uploadParams).promise();
      const audioUrl = uploadResult.Location; 
      res.status(200).json({
        response: responseText,
        audioStream: audioUrl,
      });
   });
  } catch (error: any) {
    console.error("Error:", error);
    if (error) {
      // Check the error status from the response
      switch (error.status) {
        case 401:
          res.status(401).json({ responsemessage: "Unauthorized" });
          break;
        case 404:
          res.status(404).json({ responsemessage: "Resource not found" });
          break;
        case 429:
          res.status(429).json({ responsemessage: "Too many requests" });
          break;
      }
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Working buddy");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app running on ${port}`);
});
