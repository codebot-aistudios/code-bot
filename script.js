// ==================== API CONFIG ====================
const p1 = "AQ.Ab8RN6KgVtQOeUgKbIUUA4s6J";
const p2 = "nLRsIxkqI6hPMXIyP2JhBkqaQ";

function getApiKey() {
    return p1 + p2;
}

// ==================== SECTION SWITCHER ====================
function switchSection(sectionId) {
    const sections = ['ai-gen', 'mic-mode', 'explainer', 'live-preview'];
    sections.forEach(id => {
        document.getElementById(id + '-section').style.display = 'none';
        document.getElementById(id + '-btn').classList.remove('active');
    });
    document.getElementById(sectionId + '-section').style.display = 'block';
    document.getElementById(sectionId + '-btn').classList.add('active');
}

window.onload = function () {
    switchSection('ai-gen');
};

// ==================== GEMINI API CALL ====================
async function callGeminiAPI(promptTxt, systemRole) {
    const apiKey = getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemRole}\n\nUser Request: ${promptTxt}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            return "Error: No response from API. Please try again.";
        }

        let rawText = data.candidates[0].content.parts[0].text;

        // Clean markdown code blocks if present
        rawText = rawText.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();

        return rawText;

    } catch (error) {
        console.error("API Error:", error);
        return `Error: ${error.message}. Please check your API key and connection.`;
    }
}

// ==================== AI GEN ====================
async function generateCode() {
    const promptInput = document.getElementById('codePrompt').value.trim();
    const outputArea = document.getElementById('generatedCodeOutput');
    const btn = document.querySelector('#ai-gen-section .primary-btn');

    if (!promptInput) return showToast("Please type your request first!", "warning");

    btn.disabled = true;
    btn.textContent = "⏳ Generating...";
    outputArea.value = "";
    outputArea.placeholder = "Code Bot is thinking... Please wait ⚡";

    const role = `You are an expert full-stack code generator.
Rules:
- Return ONLY raw, clean, working code.
- NO markdown, NO explanation, NO backticks, NO comments unless asked.
- If the request is for a website/app, generate complete HTML with embedded CSS and JS in one file.
- If it's a Python/JS/other script, return only that script.
- Use real placeholder images from https://picsum.photos/ for any image needs.
- Make the output visually rich and functional if it's a UI request.`;

    const result = await callGeminiAPI(promptInput, role);

    outputArea.value = result;
    btn.disabled = false;
    btn.textContent = "⚡ Generate Code";
    showToast("Code generated successfully!", "success");
}

// ==================== MIC MODE ====================
let isRecording = false;
let recognition = null;

function startVoiceRecord() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return showToast("Your browser does not support speech recognition.", "error");

    const outputArea = document.getElementById('voiceCodeOutput');
    const btn = document.querySelector('#mic-mode-section .voice-btn');

    if (isRecording) {
        recognition.stop();
        isRecording = false;
        btn.textContent = "🎤 Start Recording";
        btn.classList.remove('recording');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "ur-PK"; // Primary Urdu, falls back to Hindi/English via browser
    recognition.continuous = false;
    recognition.interimResults = false;

    isRecording = true;
    btn.textContent = "⏹ Stop Recording";
    btn.classList.add('recording');
    outputArea.value = "🎙️ Listening... Speak in Urdu, Hindi, or English...";

    recognition.start();

    recognition.onresult = async function (event) {
        const spokenText = event.results[0][0].transcript;
        const confidence = Math.round(event.results[0][0].confidence * 100);
        outputArea.value = `🗣️ You said: "${spokenText}" (${confidence}% confidence)\n\n⏳ Generating code...`;

        isRecording = false;
        btn.textContent = "🎤 Start Recording";
        btn.classList.remove('recording');

        const role = `You are an expert code generator that understands voice commands in Urdu, Hindi, and English.
Convert the spoken command into working code.
Rules:
- Return ONLY the raw code, no explanation, no markdown.
- If it's a UI/website request, generate complete HTML with CSS and JS.
- Use https://picsum.photos/ for placeholder images.
- Make code functional and visually appealing.`;

        const result = await callGeminiAPI(spokenText, role);
        outputArea.value = `// 🗣️ Voice Command: "${spokenText}"\n\n${result}`;
        showToast("Code generated from voice!", "success");
    };

    recognition.onerror = function (event) {
        outputArea.value = `❌ Microphone error: ${event.error}. Please try again.`;
        isRecording = false;
        btn.textContent = "🎤 Start Recording";
        btn.classList.remove('recording');
        showToast("Mic error: " + event.error, "error");
    };

    recognition.onend = function () {
        if (isRecording) {
            isRecording = false;
            btn.textContent = "🎤 Start Recording";
            btn.classList.remove('recording');
        }
    };
}

// ==================== EXPLAINER ====================
async function explainCode() {
    const codeTxt = document.getElementById('explainInput').value.trim();
    const outputArea = document.getElementById('explainOutput');
    const btn = document.querySelector('#explainer-section .primary-btn');

    if (!codeTxt) return showToast("Please paste code into the input box!", "warning");

    btn.disabled = true;
    btn.textContent = "⏳ Analyzing...";
    outputArea.value = "";
    outputArea.placeholder = "Analyzing your code... 🔍";

    const role = `You are an expert code explainer who teaches beginners.
Analyze the given code and explain it clearly in this format:

📌 LANGUAGE: [detected language]
🎯 PURPOSE: [what this code does in one line]

📋 STEP-BY-STEP BREAKDOWN:
[explain each important part simply]

💡 KEY CONCEPTS USED:
[list important programming concepts]

🔍 POTENTIAL IMPROVEMENTS:
[suggest 2-3 improvements if any]

Use simple English. Avoid jargon. Be friendly and encouraging.`;

    const result = await callGeminiAPI(codeTxt, role);
    outputArea.value = result;
    btn.disabled = false;
    btn.textContent = "🔍 Explain Code";
    showToast("Code explained!", "success");
}

// ==================== LIVE PREVIEW ====================
async function runPreview() {
    const rawCode = document.getElementById('previewCodeEditor').value.trim();
    const outputBox = document.getElementById('liveRenderOutput');
    const btn = document.querySelector('#live-preview-section .render-btn');

    if (!rawCode) return showToast("Please type or paste HTML code in the editor!", "warning");

    btn.disabled = true;
    btn.textContent = "⏳ Processing...";

    // Detect if it's HTML or needs AI to convert to HTML
    const isHTML = /<\s*(html|body|div|p|h[1-6]|span|section|header|main|nav|button|input|img|a|ul|li|table|form)/i.test(rawCode);

    let finalHTML = rawCode;

    if (!isHTML) {
        // Ask AI to convert code description or other code into HTML preview
        outputBox.innerHTML = `<div style="padding:20px;color:#888;text-align:center;">🤖 AI is converting your code into a visual preview...</div>`;

        const role = `Convert the following code or description into a complete, beautiful, self-contained HTML page that visually demonstrates what the code does.
Rules:
- Return ONLY complete HTML with embedded CSS and JS.
- Make it visually stunning with modern design.
- Use real placeholder images from https://picsum.photos/400/300 where needed.
- Add smooth animations and hover effects.
- No markdown, no backticks, just raw HTML.`;

        finalHTML = await callGeminiAPI(rawCode, role);
        finalHTML = finalHTML.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();
    }

    // Render in iframe
    outputBox.innerHTML = `<iframe id="frameBox" style="width:100%;height:400px;border:none;border-radius:8px;background:white;"></iframe>`;

    const iframe = document.getElementById('frameBox');
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(finalHTML);
    doc.close();

    btn.disabled = false;
    btn.textContent = "⚡ Auto-Correct & Render Preview";
    showToast("Preview rendered!", "success");
}

// Auto-render on Ctrl+Enter in preview editor
document.addEventListener('DOMContentLoaded', () => {
    const previewEditor = document.getElementById('previewCodeEditor');
    if (previewEditor) {
        previewEditor.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                runPreview();
            }
        });
    }

    const codePrompt = document.getElementById('codePrompt');
    if (codePrompt) {
        codePrompt.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                generateCode();
            }
        });
    }
});

// ==================== COPY TEXT ====================
function copyText(elementId) {
    const el = document.getElementById(elementId);
    if (!el || !el.value) return showToast("Nothing to copy!", "warning");

    navigator.clipboard.writeText(el.value).then(() => {
        showToast("✅ Copied to clipboard!", "success");
    }).catch(() => {
        // Fallback for older browsers
        el.select();
        document.execCommand('copy');
        showToast("✅ Copied!", "success");
    });
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = "info") {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';

    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideInToast 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = message;

    // Add animation style
    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            @keyframes slideInToast {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .voice-btn.recording {
                background: #ef4444 !important;
                animation: pulse 1s infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
                    }
        
