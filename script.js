const p1 = "AQ.Ab8RN6KgVtQOeUgKbIUUA4s6J";
const p2 = "nLRsIxkqI6hPMXIyP2JhBkqaQ";

function getApiKey() {
    return part1 + part2;
}

function switchSection(sectionId) {
    document.getElementById('ai-gen-section').style.display = 'none';
    document.getElementById('mic-mode-section').style.display = 'none';
    document.getElementById('explainer-section').style.display = 'none';
    document.getElementById('live-preview-section').style.display = 'none';

    document.getElementById('ai-gen-btn').classList.remove('active');
    document.getElementById('mic-mode-btn').classList.remove('active');
    document.getElementById('explainer-btn').classList.remove('active');
    document.getElementById('live-preview-btn').classList.remove('active');

    document.getElementById(sectionId + '-section').style.display = 'block';
    document.getElementById(sectionId + '-btn').classList.add('active');
}

window.onload = function() {
    switchSection('ai-gen');
};

async function callGeminiAPI(promptTxt, systemRole) {
    const apiKey = getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemRole}\n\nUser Request: ${promptTxt}` }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("API Error:", error);
        return "Error: Please check your connection or API configuration.";
    }
}

async function generateCode() {
    const promptInput = document.getElementById('codePrompt').value.trim();
    const outputArea = document.getElementById('generatedCodeOutput');

    if (!promptInput) return alert("Please type your request first!");

    outputArea.value = "Code Bot is generating code... Please wait.";

    const role = "You are a simple code generator. Return ONLY the raw code for the requested prompt. Do not write explanation, introduction, or markdown blocks.";
    const result = await callGeminiAPI(promptInput, role);
    
    outputArea.value = result;
}

function startVoiceRecord() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser does not support speech recognition.");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; 
    recognition.start();

    const outputArea = document.getElementById('voiceCodeOutput');
    outputArea.value = "Listening... Speak now...";

    recognition.onresult = async function(event) {
        const textSpoken = event.results[0][0].transcript;
        outputArea.value = `Spoken command: "${textSpoken}"\n\nGenerating code from voice...`;

        const role = "Convert this spoken command into pure coding. Return ONLY the code, no text explanation.";
        const result = await callGeminiAPI(textSpoken, role);
        outputArea.value = result;
    };

    recognition.onerror = function() {
        outputArea.value = "Microphone error. Please try again.";
    };
}

async function explainCode() {
    const codeTxt = document.getElementById('explainInput').value.trim();
    const outputArea = document.getElementById('explainOutput');

    if (!codeTxt) return alert("Please paste code into the input box!");

    outputArea.value = "Analyzing code... Breaking down into simple English.";

    const role = "You are a simple code explainer. Convert this code into an easy-to-understand English explanation or prompt breakdown step by step.";
    const result = await callGeminiAPI(codeTxt, role);
    
    outputArea.value = result;
}

function runPreview() {
    const htmlContent = document.getElementById('previewCodeEditor').value;
    const outputBox = document.getElementById('liveRenderOutput');

    if (!htmlContent.trim()) return alert("Please type HTML code in the editor!");

    outputBox.innerHTML = `<iframe id="frameBox" style="width:100%; height:250px; border:none; background:white;"></iframe>`;
    
    const iframe = document.getElementById('frameBox');
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();
}

function copyText(elementId) {
    const copyArea = document.getElementById(elementId);
    if (!copyArea.value) return alert("Nothing to copy!");
    
    copyArea.select();
    document.execCommand('copy');
    alert("Copied to clipboard!");
}
