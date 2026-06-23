// ==================== API CONFIG ====================
const p1 = "AQ.Ab8RN6I3-tg_lfOd85wNic8Pf5z";
const p2 = "toFOgxjRoCH8SdK3T9weTCg";

function getApiKey() {
    return p1 + p2;
}

// ==================== SECTION SWITCHER ====================
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

window.onload = function () {
    switchSection('ai-gen');
};

// ==================== GEMINI API ====================
async function callGeminiAPI(promptTxt, systemRole) {
    const apiKey = getApiKey();
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemRole + "\n\nUser Request: " + promptTxt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            return "API Error: " + (err.error ? err.error.message : response.status);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            return "No response received. Please try again.";
        }

        let text = data.candidates[0].content.parts[0].text;
        // Remove markdown code blocks
        text = text.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
        return text;

    } catch (error) {
        return "Connection Error: " + error.message + ". Please check your internet.";
    }
}

// ==================== AI GEN ====================
async function generateCode() {
    const promptInput = document.getElementById('codePrompt').value.trim();
    const outputArea = document.getElementById('generatedCodeOutput');

    if (!promptInput) {
        alert("Please type your request first!");
        return;
    }

    outputArea.value = "⏳ Code Bot is generating code... Please wait.";

    const role = "You are an expert code generator. The user may write in Urdu, Hindi, or English. Understand their request in any language and return ONLY the raw working code. If they ask for a website or UI, return complete HTML with embedded CSS and JS in one single file. Use https://picsum.photos/600/400 for any placeholder images. Do NOT include any explanation, markdown, or code block symbols. Return ONLY pure raw code.";

    const result = await callGeminiAPI(promptInput, role);
    outputArea.value = result;
}

// ==================== MIC MODE ====================
let isRecording = false;
let recognitionObj = null;

function startVoiceRecord() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Your browser does not support speech recognition. Please use Chrome.");
        return;
    }

    const outputArea = document.getElementById('voiceCodeOutput');
    const btn = document.querySelector('#mic-mode-section .voice-btn');

    if (isRecording) {
        recognitionObj.stop();
        isRecording = false;
        btn.textContent = "🎤 Start Recording";
        btn.style.background = "";
        return;
    }

    recognitionObj = new SpeechRecognition();
    recognitionObj.lang = "ur-PK";
    recognitionObj.continuous = false;
    recognitionObj.interimResults = false;

    isRecording = true;
    btn.textContent = "⏹ Stop Recording";
    btn.style.background = "#ef4444";
    outputArea.value = "🎙️ Listening... Speak in Urdu, Hindi, or English...";

    recognitionObj.start();

    recognitionObj.onresult = async function (event) {
        const spokenText = event.results[0][0].transcript;
        outputArea.value = '🗣️ You said: "' + spokenText + '"\n\n⏳ Generating code...';

        isRecording = false;
        btn.textContent = "🎤 Start Recording";
        btn.style.background = "";

        const role = "You are an expert code generator. The user has given a voice command in Urdu, Hindi, or English. Understand it fully and return ONLY the raw working code. If they ask for a website or UI, return complete HTML with embedded CSS and JS. Use https://picsum.photos/600/400 for images. No explanation, no markdown, no code blocks. Pure code only.";

        const result = await callGeminiAPI(spokenText, role);
        outputArea.value = '// Voice Command: "' + spokenText + '"\n\n' + result;
    };

    recognitionObj.onerror = function (event) {
        outputArea.value = "❌ Microphone error: " + event.error + ". Please try again.";
        isRecording = false;
        btn.textContent = "🎤 Start Recording";
        btn.style.background = "";
    };

    recognitionObj.onend = function () {
        if (isRecording) {
            isRecording = false;
            btn.textContent = "🎤 Start Recording";
            btn.style.background = "";
        }
    };
}

// ==================== EXPLAINER ====================
async function explainCode() {
    const codeTxt = document.getElementById('explainInput').value.trim();
    const outputArea = document.getElementById('explainOutput');

    if (!codeTxt) {
        alert("Please paste code into the input box!");
        return;
    }

    outputArea.value = "⏳ Analyzing code... Please wait.";

    const role = "You are an expert code explainer. Analyze the given code and explain it clearly in English using this format:\n\n📌 LANGUAGE: [detected language]\n🎯 PURPOSE: [what this code does in one sentence]\n\n📋 STEP-BY-STEP BREAKDOWN:\n[explain each part simply]\n\n💡 KEY CONCEPTS:\n[list important programming concepts used]\n\n🔍 POSSIBLE IMPROVEMENTS:\n[2-3 helpful suggestions]\n\nUse simple English. Be clear and friendly.";

    const result = await callGeminiAPI(codeTxt, role);
    outputArea.value = result;
}

// ==================== LIVE PREVIEW ====================
async function runPreview() {
    const rawCode = document.getElementById('previewCodeEditor').value.trim();
    const outputBox = document.getElementById('liveRenderOutput');

    if (!rawCode) {
        alert("Please type HTML code in the editor!");
        return;
    }

    const isHTML = /<(html|body|div|p|h1|h2|h3|h4|h5|h6|span|section|header|main|nav|button|input|img|a|ul|li|table|form)/i.test(rawCode);

    let finalHTML = rawCode;

    if (!isHTML) {
        outputBox.innerHTML = '<div style="padding:20px;color:#888;text-align:center;">🤖 AI is converting to visual preview...</div>';

        const role = "Convert the following code or description into a complete beautiful self-contained HTML page that visually shows what it does. Return ONLY complete raw HTML with embedded CSS and JS. Make it modern and visually appealing. Use https://picsum.photos/600/400 for images. No markdown, no backticks, just pure HTML.";

        finalHTML = await callGeminiAPI(rawCode, role);
        finalHTML = finalHTML.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
    }

    outputBox.innerHTML = '<iframe id="frameBox" style="width:100%;height:400px;border:none;border-radius:8px;background:white;"></iframe>';

    const iframe = document.getElementById('frameBox');
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(finalHTML);
    doc.close();
}

// ==================== COPY TEXT ====================
function copyText(elementId) {
    const el = document.getElementById(elementId);
    if (!el || !el.value) {
        alert("Nothing to copy!");
        return;
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(el.value).then(function () {
            alert("✅ Copied to clipboard!");
        }).catch(function () {
            el.select();
            document.execCommand('copy');
            alert("✅ Copied!");
        });
    } else {
        el.select();
        document.execCommand('copy');
        alert("✅ Copied!");
    }
}
