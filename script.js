// ==================== API CONFIG ====================
const p1 = "AQ.Ab8RN6KgVtQOeUgKbIUUA4s6J";
const p2 = "nLRsIxkqI6hPMXIyP2JhBkqaQ";

function getApiKey() {
    return p1 + p2; // FIXED: was part1 + part2 before
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
            const errData = await response.json();
            throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            return "Error: No response from Gemini. Please try again.";
        }

        let rawText = data.candidates[0].content.parts[0].text;
        rawText = rawText.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();
        return rawText;

    } catch (error) {
        console.error("API Error:", error);
        return `Error: ${error.message}`;
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

    const role = `You are an expert code generator.
Rules:
- Return ONLY raw clean working code.
- NO markdown, NO explanation, NO backticks.
- If UI/website is requested, return complete HTML with embedded CSS and JS in one file.
- Use https://picsum.photos/ for placeholder images.
- Make output visually rich and fully functional.`;

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
    recognition.lang = "ur-PK";
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

        const role = `You are an expert code generator that understands Urdu, Hindi, and English voice commands.
Convert the spoken command into working code.
Rules:
- Return ONLY raw code, no explanation, no markdown.
- If UI is requested, return complete HTML with CSS and JS.
- Use https://picsum.photos/ for placeholder images.`;

        const result = await callGeminiAPI(spokenText, role);
        outputArea.value = `// 🗣️ Voice: "${spokenText}"\n\n${result}`;
        showToast("Code generated from voice!", "success");
    };

    recognition.onerror = function (event) {
        outputArea.value = `❌ Mic error: ${event.error}. Please try again.`;
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

    const role = `You are an expert code explainer.
Analyze the given code and explain in this format:

📌 LANGUAGE: [detected language]
🎯 PURPOSE: [what this code does in one line]

📋 STEP-BY-STEP BREAKDOWN:
[explain each part simply in English]

💡 KEY CONCEPTS USED:
[list important concepts]

🔍 POSSIBLE IMPROVEMENTS:
[2-3 suggestions]

Use simple English. Be friendly and clear.`;

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

    const isHTML = /<\s*(html|body|div|p|h[1-6]|span|section|header|main|nav|button|input|img|a|ul|li|table|form)/i.test(rawCode);

    let finalHTML = rawCode;

    if (!isHTML) {
        outputBox.innerHTML = `<div style="padding:20px;color:#888;text-align:center;">🤖 AI converting to visual preview...</div>`;

        const role = `Convert the following code or description into a complete beautiful self-contained HTML page.
Rules:
- Return ONLY complete HTML with embedded CSS and JS.
- Make it visually stunning with modern design.
- Use https://picsum.photos/400/300 for images.
- Add animations and hover effects.
- No markdown, no backticks, just raw HTML.`;

        finalHTML = await callGeminiAPI(rawCode, role);
        finalHTML = finalHTML.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();
    }

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

// Keyboard shortcuts
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('previewCodeEditor')?.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'Enter') runPreview();
    });
    document.getElementById('codePrompt')?.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'Enter') generateCode();
    });
});

// ==================== COPY TEXT ====================
function copyText(elementId) {
    const el = document.getElementById(elementId);
    if (!el || !el.value) return showToast("Nothing to copy!", "warning");

    navigator.clipboard.writeText(el.value).then(() => {
        showToast("✅ Copied to clipboard!", "success");
    }).catch(() => {
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

    const colors = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };

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
    
