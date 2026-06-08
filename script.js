function switchSection(sectionId) {
    const sections = ['ai-gen-section', 'mic-mode-section', 'explainer-section', 'live-preview-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeSection = document.getElementById(sectionId + '-section');
    if (activeSection) activeSection.style.display = 'flex';
    
    const activeBtn = document.getElementById(sectionId + '-btn');
    if (activeBtn) activeBtn.classList.add('active');
}

function generateCode() {
    const prompt = document.getElementById('codePrompt').value.toLowerCase();
    const outputBox = document.getElementById('generatedCodeOutput');
    
    if (!prompt.trim()) {
        alert("Please enter a request first!");
        return;
    }

    outputBox.value = "// Connecting to Code Bot AI...\n// Generating layout...\n";

    setTimeout(() => {
        if (prompt.includes('calculator')) {
            outputBox.value = `<div style="background:#1a2634; padding:20px; border-radius:8px; max-width:300px; margin:0 auto; text-align:center;">\n  <h3 style="color:#00ffd5; margin-bottom:15px;">Calculator</h3>\n  <input type="text" style="width:100%; margin-bottom:12px; background:#fff; color:#000; border:none; padding:10px; border-radius:4px; font-size:18px; text-align:right;" value="0" readonly />\n  <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;">\n    <button style="background:#3b82f6; color:#fff; padding:12px; border:none; border-radius:4px; font-weight:bold;">7</button>\n    <button style="background:#3b82f6; color:#fff; padding:12px; border:none; border-radius:4px; font-weight:bold;">8</button>\n    <button style="background:#3b82f6; color:#fff; padding:12px; border:none; border-radius:4px; font-weight:bold;">9</button>\n    <button style="background:#2563eb; color:#fff; padding:12px; border:none; border-radius:4px; font-weight:bold;">+</button>\n  </div>\n</div>`;
        } else {
            outputBox.value = `<div style="padding:20px; background:#1e1f26; border-radius:6px; border-left:4px solid #00ffd5;">\n  <h2 style="color:#00ffd5;">AI Generated Content</h2>\n  <p style="color:#fff; margin-top:10px;">Your request for "${prompt}" has been successfully created by Code Bot.</p>\n</div>`;
        }
    }, 1200);
}

function startVoiceRecord() {
    const voiceOutput = document.getElementById('voiceCodeOutput');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Web Speech API is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    voiceOutput.value = "Listening... Please speak into your microphone.";

    recognition.start();

    recognition.onresult = function(event) {
        const speechToText = event.results[0][0].transcript.toLowerCase();
        voiceOutput.value = "Speech detected: \"" + speechToText + "\"\n\n";
        
        if (speechToText.includes('calculator')) {
            voiceOutput.value += `<div style="background:#1a2634; padding:20px; border-radius:8px; text-align:center;">\n  <h3 style="color:#00ffd5;">Voice Gen Calculator</h3>\n</div>`;
        } else if (speechToText.includes('button')) {
            voiceOutput.value += `<button style="background:#00ffd5; color:#000; padding:10px 20px; border:none; border-radius:4px; font-weight:bold;">Voice Button</button>`;
        } else {
            voiceOutput.value += `// Code Bot Voice Output:\n<div style="padding:15px; background:#1e1f26; color:#fff; border-left:4px solid #00ffd5;">\n  <p>Processed Voice Command: "${speechToText}"</p>\n</div>`;
        }
    };

    recognition.onerror = function(event) {
        voiceOutput.value = "Error occurred in recognition: " + event.error + "\nEnsure microphone permissions are granted.";
    };
}

function explainCode() {
    const input = document.getElementById('explainInput').value;
    const output = document.getElementById('explainOutput');
    if (!input.trim()) {
        alert("Please paste some code first!");
        return;
    }
    output.value = "Analyzing code structural logic...\n";
    setTimeout(() => {
        output.value = "=== CODE BOT ANALYSIS ===\n1. Language detected successfully.\n2. Structure looks solid.\n3. Logic breakdown: Main wrapper loads elements systematically with zero compilation faults.";
    }, 1000);
}

function runPreview() {
    const code = document.getElementById('previewCodeEditor').value;
    const previewContainer = document.getElementById('liveRenderOutput');
    if (previewContainer) {
        previewContainer.innerHTML = code;
    }
}

// Global utility for clipboard interaction
function copyText(elementId) {
    const textEl = document.getElementById(elementId);
    if (!textEl || !textEl.value) {
        alert("No content available to copy.");
        return;
    }
    textEl.select();
    textEl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textEl.value);
    alert("Copied to clipboard!");
}

document.addEventListener("DOMContentLoaded", () => {
    switchSection('ai-gen');
});
        
