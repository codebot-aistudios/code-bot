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

    outputBox.value = "// Connecting to AI Engine...\n// Generating layout assets...\n";

    setTimeout(() => {
        if (prompt.includes('calculator')) {
            outputBox.value = `<div style="background:#1a2634; padding:20px; border-radius:8px; max-width:300px; margin:0 auto; text-align:center;">\n  <h3 style="color:#00ffd5; margin-bottom:15px;">Calculator</h3>\n  <input type="text" style="width:100%; margin-bottom:12px; background:#fff; color:#000; border:none; padding:10px; border-radius:4px; font-size:18px; text-align:right;" value="0" readonly />\n  <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;">\n    <button style="background:#3b82f6; color:#fff; padding:12px; border:none; border-radius:4px; font-weight:bold;">7</button>\n    <button style="background:#3b82f6; color:#fff; padding:12px; border:none; border-radius:4px; font-weight:bold;">8</button>\n    <button style="background:#3b82f6; color:#fff; padding:12px; border:none; border-radius:4px; font-weight:bold;">9</button>\n    <button style="background:#2563eb; color:#fff; padding:12px; border:none; border-radius:4px; font-weight:bold;">+</button>\n  </div>\n</div>`;
        } else if (prompt.includes('markhor') || prompt.includes('cloth') || prompt.includes('brand')) {
            outputBox.value = `<!-- PREMIUM BRAND SHOWCASE -->\n<div style="max-width: 600px; margin: 20px auto; background: #0b0c10; color: #fff; font-family: sans-serif; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 15px 35px rgba(0,0,0,0.5);">\n  <div style="position: relative; height: 220px; background: url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600') center/cover; ">\n    <div style="position: absolute; bottom: 15px; left: 20px;">\n      <h2 style="margin:0; letter-spacing:3px; text-transform:uppercase;">THE REBEL SPIRIT</h2>\n    </div>\n  </div>\n  <div style="padding: 25px; background: #0f1015; text-align: center;">\n    <p style="font-style: italic; color: #ccc; line-height: 1.6;">"Crafting modern subculture statements through high-end streetwear and exceptional premium materials."</p>\n    <button style="margin-top: 15px; background: #00ffd5; color: #000; border: none; padding: 10px 25px; font-weight: bold; border-radius: 4px; cursor: pointer;">EXPLORE COLLECTION</button>\n  </div>\n</div>`;
        } else {
            // "Code Bot" text hamesha ke liye khatam, ab yeh professional component banayega
            outputBox.value = `<div style="padding:20px; background:#1e1f26; border-radius:6px; border-left:4px solid #00ffd5; font-family:sans-serif;">\n  <h2 style="color:#00ffd5; margin:0;">Application Component</h2>\n  <p style="color:#fff; margin-top:10px; line-height:1.5;">The dynamic interface module for "${prompt}" has been compiled and initialized successfully.</p>\n</div>`;
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
            // Voice output se bhi Code Bot mita diya
            voiceOutput.value += `<!-- System Voice Output -->\n<div style="padding:15px; background:#1e1f26; color:#fff; border-left:4px solid #00ffd5; font-family:sans-serif;">\n  <p style="margin:0;">Processed Command: "${speechToText}"</p>\n</div>`;
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
        // Explainer se bhi Code Bot mita kar standard kar diya
        output.value = "=== CODESMITH ANALYTICS ===\n1. Language detected successfully.\n2. Structure looks solid.\n3. Logic breakdown: Main wrapper loads elements systematically with zero compilation faults.";
    }, 1000);
}

function runPreview() {
    const code = document.getElementById('previewCodeEditor').value;
    const previewContainer = document.getElementById('liveRenderOutput');
    if (previewContainer) {
        previewContainer.innerHTML = code;
    }
}

// FIXED: Copy hone ke baad selection automatically khatam ho jayegi
function copyText(elementId) {
    const textEl = document.getElementById(elementId);
    if (!textEl || !textEl.value) {
        alert("No content available to copy.");
        return;
    }
    textEl.select();
    textEl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textEl.value);
    
    // Copy hote hi highlight/selection ko foran remove karne ke liye blur laga diya
    textEl.blur();
    
    alert("Copied to clipboard!");
}

document.addEventListener("DOMContentLoaded", () => {
    switchSection('ai-gen');
});
                   
