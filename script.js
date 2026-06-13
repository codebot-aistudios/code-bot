// ============================================================
// PROJECT: CODE BOT (OFFICIAL JAVASCRIPT)
// CREDIT: Done by CodeBot
// ============================================================

const SECURE_KEY = "AQ.Ab8RN6JPmMpoSizEcH791HL6zLOTgPBwXT4S0joTdtujfbxZ-w"; 
const BOT_ENGINE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${SECURE_KEY}`;

// ===== SECTION NAVIGATION =====
function switchSection(sectionId) {
    const sections = document.querySelectorAll('.app-section');
    sections.forEach(sec => sec.style.display = 'none');
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) targetSection.style.display = 'block';
    
    const targetBtn = document.getElementById(`${sectionId}-btn`);
    if (targetBtn) targetBtn.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    switchSection('ai-gen'); 
});

// ===== GLOBAL AI FETCH FUNCTION =====
async function fetchAIResponse(customPrompt) {
    try {
        const response = await fetch(BOT_ENGINE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: customPrompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error(error);
        return "Error loading response.";
    }
}

// ===== 1. AI GEN FUNCTION =====
async function generateCode() {
    const promptInput = document.getElementById('codePrompt');
    const outputContainer = document.getElementById('generatedCodeOutput');
    
    if (!promptInput || !outputContainer) return;
    
    const userPrompt = promptInput.value.trim();
    if (!userPrompt) {
        alert("Input is empty! Please type a prompt first.");
        return;
    }
    
    outputContainer.value = "Generating code... Please wait...";
    
    const strictCodingPrompt = `Write only raw clean functional programming code or HTML/CSS/JS code for: ${userPrompt}. Do not wrap the output in markdown code blocks or backticks. Just give the raw executable code.`;
    const generatedCode = await fetchAIResponse(strictCodingPrompt);
    
    if (generatedCode) {
        outputContainer.value = generatedCode;
    }
}

// ===== 2. MIC MODE FUNCTION (Voice Record) =====
function startVoiceRecord() {
    const promptInput = document.getElementById('codePrompt'); 
    const voiceOutput = document.getElementById('voiceCodeOutput');
    const micBtn = document.querySelector('.voice-btn');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Your browser does not support Speech Recognition.");
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; 
    
    if (micBtn) {
        micBtn.style.background = '#ff4d4d';
        micBtn.innerText = "Listening...";
    }
    
    recognition.start();
    
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        if (promptInput) promptInput.value = transcript; 
        
        if (voiceOutput) voiceOutput.value = `Voice Command Received: "${transcript}"\nGenerating code...`;
        
        const voicePrompt = `Write only raw clean functional code for this voice command: ${transcript}. No markdown.`;
        const codeFromVoice = await fetchAIResponse(voicePrompt);
        
        if (voiceOutput && codeFromVoice) {
            voiceOutput.value = codeFromVoice;
        }
    };
    
    recognition.onerror = (err) => {
        console.error(err);
        if (voiceOutput) voiceOutput.value = "Error recognizing voice.";
    };
    
    recognition.onend = () => {
        if (micBtn) {
            micBtn.style.background = '';
            micBtn.innerText = "🎤 Start Recording";
        }
    };
}

// ===== 3. EXPLAINER FUNCTION =====
async function explainCode() {
    const currentCode = document.getElementById('explainInput');
    const explanationOutput = document.getElementById('explainOutput');
    
    if (!currentCode || !explanationOutput) return;
    
    const codeToExplain = currentCode.value.trim();
    if (!codeToExplain) {
        alert("No code to explain! Please paste your code first.");
        return;
    }
    
    explanationOutput.value = "Explaining code... Please wait...";
    
    const explanationPrompt = `You are CodeBot, a professional AI Assistant. Explain this code block simply and logically step by step so a student can understand it perfectly. Use clear language: \n\n${codeToExplain}`;
    const finalExplanation = await fetchAIResponse(explanationPrompt);
    
    if (finalExplanation) {
        explanationOutput.value = finalExplanation + "\n\n— Done by CodeBot";
    }
}

// ===== 4. LIVE PREVIEW FUNCTION =====
function runPreview() {
    const editorCode = document.getElementById('previewCodeEditor');
    const renderBox = document.getElementById('liveRenderOutput');
    
    if (!editorCode || !renderBox) return;
    
    const codeToRender = editorCode.value;
    
    renderBox.innerHTML = ''; 
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    renderBox.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (doc) {
        doc.open();
        doc.write(codeToRender);
        doc.close();
    }
}

// ===== COPY TEXT UTILITY BUTTONS =====
function copyText(elementId) {
    const textBox = document.getElementById(elementId);
    if (!textBox) return;
    
    textBox.select();
    textBox.setSelectionRange(0, 99999); 
    
    try {
        navigator.clipboard.writeText(textBox.value);
        alert("Copied to clipboard!");
    } catch (err) {
        alert("Unable to copy code.");
    }
}

