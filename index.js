const express = require("express");
const cors = require("cors");

const axios = require("axios");
// const openai = require("openai");
const { Configuration, OpenAIApi } = require("openai");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

app.post("/api/gpt3", async (req, res) => {
  const { prompt } = req.body;
  console.log("processing: " + prompt);
  await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
    .then((response) => {
      res.json(response.data.choices[0].message.content);
      console.log(response.data.choices[0].message.content);
    })
    .catch((error) => {
      console.log(error.message);
      console.error("Error with OpenAI API:", error);
      res.status(500).json({ error: "Error with OpenAI API" });
    });
});
