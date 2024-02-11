// require("dotenv").config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import md from "markdown-it";
// const { GoogleGenerativeAI } = require("@google/generative-ai");

//Initialize models

const genAI = new GoogleGenerativeAI("AIzaSyD03Gu18kqabAyjOW0qZR1EYGNyKwcb0M4");

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let history = [];

async function getResponse(prompt) {
  const chat = await model.startChat({ history: history });
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();

  console.log(text);
  return text;
}

// User chat Div
export const userDiv = (data) => {
  return `
  <div class="flex gap-2 items-center justify-end">
            
            <p class="bg-black text-white p-2 rounded-full shadow-md">
              ${data}
            </p>
            <img src="https://i.ibb.co/hMWq7Ms/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow-520826-1931.jpg" alt="user icon" class="w-10 h-10 rounded-full" />
          </div>
          `;
};

// AI chat Div
export const aiDiv = (data) => {
  const outputSize = data.length;
  const fontSize = outputSize < 50 ? "text-lg" : "text-base";

  return `
  <div class="items-center flex gap-2 justify-start relative ai-message">

    
    <div class="mx-12">
      <img
      src="https://i.ibb.co/bzbFwz9/bot.webp"
      alt="user icon"
      class="w-10 h-10 rounded-full ai-icon"
      />
    </div>
    <div class="ai-content">
      <pre class=" text-white px-2 rounded-md whitespace-pre-wrap break-words ${fontSize}" style="margin-left:30px; width:60%;">
      ${data}
      </pre>
    </div>
            
  </div>`;
};

async function handleSubmit(event) {
  event.preventDefault();

  let userMessage = document.getElementById("prompt");

  const chatArea = document.getElementById("chat-container");

  var prompt = userMessage.value.trim();
  if (prompt === "") {
    return;
  }

  console.log("user message", prompt);

  chatArea.innerHTML += userDiv(prompt);
  userMessage.value = "";

  const aiResponse = await getResponse(prompt);
  let md_text = md().render(aiResponse);
  chatArea.innerHTML += aiDiv(md_text);

  let newUserRole = {
    role: "user",
    parts: prompt,
  };

  let newAIRole = {
    role: "model",
    parts: aiResponse,
  };

  history.push(newUserRole);
  history.push(newAIRole);

  console.log(history);
  chatArea.scrollTop = chatArea.scrollHeight;
}

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", handleSubmit);

chatForm.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) handleSubmit(event);
});

document.addEventListener("keydown", function (event) {
  // Check if the "/" key is pressed
  if (event.key === "/") {
    // Select the input text field
    document.getElementById("prompt").focus();
  }
});
