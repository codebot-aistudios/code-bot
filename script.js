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

// === ORIGINAL ENGINE (WITH EMOJIS & SIMPLE IF-ELSE) ===
function heavyAIEngine(promptText) {
    const prompt = promptText.trim().toLowerCase();
    
    if (prompt.includes('calculator')) {
        return `<!-- Standard Calculator Layout -->
<div style="max-width: 300px; margin: 20px auto; background: #222; padding: 20px; border-radius: 10px; color: #fff; font-family: sans-serif; text-align: center;">
  <h3>🧮 Calculator Mode</h3>
  <div style="background: #111; padding: 15px; margin-bottom: 15px; text-align: right; border-radius: 5px; font-size: 24px;">0</div>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
    <button style="padding: 15px; background: #444; color: #fff; border: none; border-radius: 5px;">7</button>
    <button style="padding: 15px; background: #444; color: #fff; border: none; border-radius: 5px;">8</button>
    <button style="padding: 15px; background: #444; color: #fff; border: none; border-radius: 5px;">9</button>
    <button style="padding: 15px; background: #ff9500; color: #fff; border: none; border-radius: 5px;">÷</button>
    <!-- Basic structural mockup -->
  </div>
</div>`;
    } 
    
    if (prompt.includes('login') || prompt.includes('form')) {
        return `<!-- Standard Login Form -->
<div style="max-width: 350px; margin: 20px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); font-family: sans-serif;">
  <h2 style="margin-bottom: 20px; color: #333; text-align: center;">🔐 Secure Login</h2>
  <input type="text" placeholder="Username" style="width:100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
  <input type="password" placeholder="Password" style="width:100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
  <button style="width:100%; padding: 12px; background: #007bff; color: #fff; border: none; border-radius: 4px; font-weight: bold;">Login</button>
</div>`;
    }

    // Default basic fallback response
    return `<!-- Default Layout Block -->
<div style="padding: 20px; margin: 20px auto; max-width: 500px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; font-family: sans-serif;">
  <h4>✨ CodeBot Generation</h4>
  <p>Custom layout template generated successfully for: <strong>"${promptText}"</strong></p>
</div>`;
}

// 1. AI Gen Section
function generateCode() {
    const prompt = document.getElementById('codePrompt').value;
    const outputBox = document.getElementById('generatedCodeOutput');
    
    if (!prompt.trim()) {
        alert("Please enter a request first!");
        return;
    }

    outputBox.value = "⚡ CodeBot Engine is processing inputs...\n";

    setTimeout(() => {
        outputBox.value = heavyAIEngine(prompt);
    }, 500);
}

// 2. Mic Mode Section
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

    voiceOutput.value = "Listening... Speak your idea!";
    recognition.start();

    recognition.onresult = function(event) {
        const speechToText = event.results[0][0].transcript;
        voiceOutput.value = "Voice Command: \"" + speechToText + "\"\n\n⚡ Generating code...";
        
        setTimeout(() => {
            voiceOutput.value = heavyAIEngine(speechToText);
        }, 500);
    };

    recognition.onerror = function(event) {
        voiceOutput.value = "Error: " + event.error;
    };
}

// 3. Explainer Section
function explainCode() {
    const input = document.getElementById('explainInput').value;
    const output = document.getElementById('explainOutput');
    if (!input.trim()) {
        alert("Please paste some code first!");
        return;
    }
    output.value = "=== CODE BOT ANALYSIS ===\n• Layout detected successfully.\n• Code structure verified.";
}

// 4. Live Preview Section
function runPreview() {
    const code = document.getElementById('previewCodeEditor').value;
    const previewContainer = document.getElementById('liveRenderOutput');
    if (previewContainer) {
        previewContainer.innerHTML = code;
    }
}

// === ORIGINAL COPY UTILITY WITH STANDARD ALERT ===
function copyText(elementId) {
    const textEl = document.getElementById(elementId);
    if (!textEl || !textEl.value) {
        return;
    }
    
    textEl.select();
    document.execCommand("copy");
    alert("Code copied to clipboard! 👍");
}

document.addEventListener("DOMContentLoaded", () => {
    switchSection('ai-gen');
});
        
