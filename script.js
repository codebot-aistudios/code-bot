const part1 = "AQ.Ab8RN6LHdxvmFqq_lSjrs_";
const part2 = "B24xANbqiUywJnj7ium5DNQVFrqA";

function getApiKey() {
    return part1 + part2;
}

async function getAIResponse(userMessage, systemPrompt = "") {
    const apiKey = getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser Request: ${userMessage}` : userMessage;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }]
            })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        }
        return "No response from AI.";
    } catch (error) {
        console.error("API Error:", error);
        return "Error connecting to Code Bot.";
    }
}

async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    
    if (!inputField || !chatBox) return;
    
    const message = inputField.value.trim();
    if (message === "") return;

    chatBox.innerHTML += `<div class="message user-message">${message}</div>`;
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    const loadingId = "loading-" + Date.now();
    chatBox.innerHTML += `<div class="message bot-message" id="${loadingId}">Code Bot is generating code...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const systemPrompt = "You are an expert Code Generator. Respond ONLY with clean, functional code wrapped inside markdown code blocks like ```html. Do not include explanations.";
    const aiReply = await getAIResponse(message, systemPrompt);

    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();

    chatBox.innerHTML += `<div class="message bot-message"><pre><code>${aiReply}</code></pre></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    updatePreview(aiReply);
}

function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Microphone not supported in this browser.");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const inputField = document.getElementById("userInput");
        if (inputField) inputField.value = transcript;
    };
}

async function explainCode() {
    const chatBox = document.getElementById("chatBox");
    if (!chatBox) return;

    const lastBotMessage = chatBox.querySelector(".bot-message:last-of-type code");
    if (!lastBotMessage) {
        alert("No code found to explain!");
        return;
    }

    const codeToExplain = lastBotMessage.innerText;
    const loadingId = "loading-" + Date.now();
    chatBox.innerHTML += `<div class="message bot-message" id="${loadingId}">Explaining code line by line...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const systemPrompt = "You are a professional Code Explainer. Break down the provided code line by line clearly and concisely.";
    const explanation = await getAIResponse(codeToExplain, systemPrompt);

    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();

    chatBox.innerHTML += `<div class="message bot-message explanation-box">${explanation}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function updatePreview(rawCode) {
    const previewFrame = document.getElementById("livePreview");
    if (!previewFrame) return;

    const cleanCode = rawCode.replace(/```html|```css|```javascript|```/gi, "").trim();
    const mimeType = cleanCode.includes("<html>") || cleanCode.includes("<div>") || cleanCode.includes("<button>") ? "text/html" : "text/plain";
    
    if (mimeType === "text/html") {
        previewFrame.srcdoc = cleanCode;
    } else {
        previewFrame.srcdoc = `<html><body><pre>${cleanCode}</pre></body></html>`;
    }
        }
        
