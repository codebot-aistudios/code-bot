// KEY YAHAN LAGAO - DO HISSON MEIN
const p1 = "AQ.Ab8RN6IPtel_CY0dHGRgzVTQIk";
const p2 = "Dkt4woS59TmT9Ou1_EDAQ4pA";

function getApiKey() { return p1 + p2; }

// SECTION SWITCHER
function switchSection(sectionId) {
    ['ai-gen','mic-mode','explainer','live-preview'].forEach(id => {
        document.getElementById(id+'-section').style.display = 'none';
        document.getElementById(id+'-btn').classList.remove('active');
    });
    document.getElementById(sectionId+'-section').style.display = 'block';
    document.getElementById(sectionId+'-btn').classList.add('active');
}

window.onload = function() { switchSection('ai-gen'); };

// GEMINI API - gemini-2.0-flash (LATEST WORKING MODEL)
async function callGeminiAPI(promptTxt, systemRole) {
    const apiKey = getApiKey();
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemRole + "\n\nUser Request: " + promptTxt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
            })
        });

        if (!res.ok) {
            const err = await res.json();
            return "API Error: " + (err.error ? err.error.message : "Status " + res.status);
        }

        const data = await res.json();
        if (!data.candidates || !data.candidates.length) return "Koi response nahi aaya. Dobara try karo.";

        let text = data.candidates[0].content.parts[0].text;
        return text.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();

    } catch (err) {
        return "Connection Error: " + err.message;
    }
}

// AI GEN
async function generateCode() {
    const prompt = document.getElementById('codePrompt').value.trim();
    const output = document.getElementById('generatedCodeOutput');
    const btn = document.querySelector('#ai-gen-section .primary-btn');
    if (!prompt) { alert("Pehle request likho!"); return; }
    btn.disabled = true; btn.textContent = "⏳ Generating...";
    output.value = "Code Ban Raha Hai... ⚡";
    const role = "You are an expert code generator. User may write in Urdu, Hindi, or English. Understand and return ONLY raw working code. For website/UI requests return complete HTML with embedded CSS+JS. Use https://picsum.photos/600/400 for images. No explanation, no markdown, no backticks. Pure code only.";
    output.value = await callGeminiAPI(prompt, role);
    btn.disabled = false; btn.textContent = "Generate Code";
}

// MIC MODE
let isRecording = false, recObj = null;

function startVoiceRecord() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Chrome use karo mic ke liye!"); return; }
    const output = document.getElementById('voiceCodeOutput');
    const btn = document.querySelector('#mic-mode-section .voice-btn');

    if (isRecording) {
        recObj.stop(); isRecording = false;
        btn.textContent = "🎤 Start Recording"; btn.style.background = ""; return;
    }

    recObj = new SR();
    recObj.lang = "ur-PK";
    recObj.continuous = false;
    recObj.interimResults = false;
    isRecording = true;
    btn.textContent = "⏹ Stop Recording"; btn.style.background = "#ef4444";
    output.value = "🎙️ Sun Raha Hun... Bolo!";
    recObj.start();

    recObj.onresult = async function(e) {
        const spoken = e.results[0][0].transcript;
        output.value = '🗣️ Tumne Kaha: "' + spoken + '"\n\n⏳ Code Ban Raha Hai...';
        isRecording = false; btn.textContent = "🎤 Start Recording"; btn.style.background = "";
        const role = "You are an expert code generator. User gave voice command in Urdu/Hindi/English. Return ONLY raw code. For UI return complete HTML+CSS+JS. Use https://picsum.photos/600/400 for images. No markdown.";
        output.value = '// 🗣️ Voice: "' + spoken + '"\n\n' + await callGeminiAPI(spoken, role);
    };

    recObj.onerror = function(e) {
        output.value = "❌ Mic Error: " + e.error;
        isRecording = false; btn.textContent = "🎤 Start Recording"; btn.style.background = "";
    };

    recObj.onend = function() {
        if (isRecording) { isRecording = false; btn.textContent = "🎤 Start Recording"; btn.style.background = ""; }
    };
}

// EXPLAINER
async function explainCode() {
    const code = document.getElementById('explainInput').value.trim();
    const output = document.getElementById('explainOutput');
    const btn = document.querySelector('#explainer-section .primary-btn');
    if (!code) { alert("Code paste karo pehle!"); return; }
    btn.disabled = true; btn.textContent = "⏳ Analyzing...";
    output.value = "Code Analyze Ho Raha Hai... 🔍";
    const role = "You are an expert code explainer. Explain in simple English:\n\n📌 LANGUAGE: [detected]\n🎯 PURPOSE: [one sentence]\n\n📋 STEP-BY-STEP:\n[simple steps]\n\n💡 KEY CONCEPTS:\n[list]\n\n🔍 IMPROVEMENTS:\n[2-3 tips]\n\nFriendly simple English.";
    output.value = await callGeminiAPI(code, role);
    btn.disabled = false; btn.textContent = "Explain Code";
}

// LIVE PREVIEW
async function runPreview() {
    const raw = document.getElementById('previewCodeEditor').value.trim();
    const box = document.getElementById('liveRenderOutput');
    const btn = document.querySelector('#live-preview-section .render-btn');
    if (!raw) { alert("HTML code paste karo!"); return; }
    btn.disabled = true; btn.textContent = "⏳ Processing...";

    const isHTML = /<(html|body|div|p|h[1-6]|span|section|header|main|nav|button|input|img|a|ul|li|table|form)/i.test(raw);
    let finalHTML = raw;

    if (!isHTML) {
        box.innerHTML = '<div style="padding:30px;color:#888;text-align:center;">🤖 AI Preview Bana Raha Hai...</div>';
        const role = "Convert this into complete beautiful self-contained HTML page. ONLY raw HTML with embedded CSS+JS. Modern design. Use https://picsum.photos/600/400 for images. No markdown, pure HTML.";
        finalHTML = (await callGeminiAPI(raw, role)).replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
    }

    box.innerHTML = '<iframe id="frameBox" style="width:100%;height:420px;border:none;border-radius:8px;background:white;"></iframe>';
    const doc = document.getElementById('frameBox').contentDocument;
    doc.open(); doc.write(finalHTML); doc.close();
    btn.disabled = false; btn.textContent = "⚡ Auto-Correct & Render Preview";
}

// COPY
function copyText(elementId) {
    const el = document.getElementById(elementId);
    if (!el || !el.value) { alert("Nothing to copy!"); return; }
    navigator.clipboard.writeText(el.value)
        .then(() => alert("✅ Copied!"))
        .catch(() => { el.select(); document.execCommand('copy'); alert("✅ Copied!"); });
}
    
