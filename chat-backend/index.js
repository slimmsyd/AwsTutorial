const {OpenAI } = require("openai");

const APIKEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: APIKEY });



exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2)); // Log the event object

  let response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: "",
  };

  // Determine the HTTP method
  const httpMethod = event.httpMethod;  // It's right at the root level


  console.log("HTTP Method:", httpMethod); // Add this log to debug

  if (httpMethod === "POST") {
    try {
      const { message } = JSON.parse(event.body);

      // console.log("Logging the conversation histroy", conversationHistory)

      const messages = [
        {
          role: "system",
          content: `Hello ChatGPT, You are a bot that loves to say wagwan before every message response`,
        },

        { role: "user", content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        max_tokens: 500,
        messages: messages,
        temperature: 1,
      });

      const responseContent = completion.choices[0].message.content;

      // console.log("Loggin the REsponse", response);
      response.body = JSON.stringify({
        message: responseContent,
      });

      console.log("loggnig the resonse bdoy", response.body);
    } catch (error) {
      console.error("Error occurred while processing the request:", error);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "Error occurred while processing the request",
        error,
      });
    }
  } else {
    response.statusCode = 405;
    response.body = `Method ${httpMethod} Not Allowed Method is not being allowed`;
  }

  return response;
};
