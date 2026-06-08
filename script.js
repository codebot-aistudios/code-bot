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

// === TUMHAARA KHUD KA AI ENGINE ===
function localAIEngine(promptText) {
    const prompt = promptText.toLowerCase();

    // 1. Clothing Brand ya Markhor ke liye code
    if (prompt.includes('clothing') || prompt.includes('markhor') || prompt.includes('brand') || prompt.includes('cloth')) {
        return `<div style="padding: 30px; background: #111; color: #fff; font-family: 'Poppins', sans-serif; border-radius: 12px; text-align: center; border: 2px solid #00ffd5; box-shadow: 0 8px 20px rgba(0,255,213,0.2);">
  <h1 style="color: #00ffd5; letter-spacing: 3px; font-size: 28px; margin-bottom: 5px;">MARKHOR CLOTHING</h1>
  <p style="color: #aaa; font-size: 14px; margin-bottom: 25px;">Premium Urban Wear & Street Style</p>
  
  <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 25px;">
    <div style="background: #222; padding: 15px; border-radius: 8px; width: 100px; border: 1px solid #333;">
      <div style="font-size: 20px;">👕</div>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #fff;">Oversized Tees</p>
    </div>
    <div style="background: #222; padding: 15px; border-radius: 8px; width: 100px; border: 1px solid #333;">
      <div style="font-size: 20px;">🧥</div>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #fff;">Hoodies</p>
    </div>
  </div>

  <button style="background: #00ffd5; color: #111; border: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; font-size: 14px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,255,213,0.4);">
    EXPLORE COLLECTION
  </button>
</div>`;
    }

    // 2. Calculator ke liye code
    if (prompt.includes('calculator') || prompt.includes('calc')) {
        return `<div style="background: #1e1f26; padding: 25px; border-radius: 15px; max-width: 280px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #2d2f39;">
  <div style="background: #11141a; padding: 15px; border-radius: 8px; text-align: right; color: #00ffd5; font-size: 24px; font-family: monospace; margin-bottom: 20px; overflow: hidden; border: 1px solid #252833;">
    1,426
  </div>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">7</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">8</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">9</button>
    <button style="background: #ff9f0a; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">÷</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">4</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">5</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">6</button>
    <button style="background: #ff9f0a; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">×</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">1</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">2</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">3</button>
    <button style="background: #ff9f0a; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">-</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">0</button>
    <button style="background: #2d2f39; color: #fff; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">.</button>
    <button style="background: #00ffd5; color: #000; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; grid-column: span 2;">=</button>
  </div>
</div>`;
    }

    // 3. Login / Signup Form ke liye code
    if (prompt.includes('login') || prompt.includes('form') || prompt.includes('signup')) {
        return `<div style="background: #1e1f26; padding: 30px; border-radius: 12px; max-width: 320px; margin: 0 auto; box-shadow: 0 8px 24px rgba(0,0,0,0.3); font-family: sans-serif;">
  <h2 style="color: #fff; margin-bottom: 20px; font-size: 22px; text-align: center;">Account Login</h2>
  <div style="margin-bottom: 15px;">
    <label style="color: #ccc; display: block; margin-bottom: 5px; font-size: 12px;">Email Address</label>
    <input type="email" placeholder="name@example.com" style="width: 100%; padding: 10px; background: #11141a; border: 1px solid #333; border-radius: 6px; color: #fff; box-sizing: border-box;" />
  </div>
  <div style="margin-bottom: 20px;">
    <label style="color: #ccc; display: block; margin-bottom: 5px; font-size: 12px;">Password</label>
    <input type="password" placeholder="••••••••" style="width: 100%; padding: 10px; background: #11141a; border: 1px solid #333; border-radius: 6px; color: #fff; box-sizing: border-box;" />
  </div>
  <button style="width: 100%; background: #00ffd5; color: #111; border: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer;">Sign In</button>
</div>`;
    }

    // Default response agar kuch samajh na aaye
    return `<div style="padding: 25px; background: #1e1f26; border-radius: 8px; border: 1px dashed #333; text-align: center; font-family: sans-serif;">
  <h3 style="color: #ff4a4a; margin: 0 0 10px 0;">Custom Layout Generated</h3>
  <p style="color: #eee; margin: 0 0 15px 0;">CodeBot ne aap ke prompt "${promptText}" ke liye ek base structure ready kar diya hai.</p>
  <button style="background: #3b82f6; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Action Button</button>
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

    outputBox.value = "// 🤖 CodeBot Custom AI Engine is analyzing keywords...\n// Generating design blocks...\n";

    setTimeout(() => {
        outputBox.value = localAIEngine(prompt);
    }, 800);
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

    voiceOutput.value = "Listening... Speak now!";
    recognition.start();

    recognition.onresult = function(event) {
        const speechToText = event.results[0][0].transcript;
        voiceOutput.value = "Voice Command: \"" + speechToText + "\"\n\n🤖 Generating Code...";
        
        setTimeout(() => {
            voiceOutput.value = localAIEngine(speechToText);
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
    
    output.value = "=== CODE BOT AI ANALYSIS ===\n";
    
    if (input.includes('style') || input.includes('div')) {
        output.value += "• HTML Element Structure detected.\n• Inline CSS Styles are applied for background colors and margins.\n• Logic: Pure frontend visual rendering block.";
    } else if (input.includes('function') || input.includes('var') || input.includes('const')) {
        output.value += "• JavaScript Logic Code detected.\n• Functions manage dynamic UI components dynamically.\n• Logic: Clean script block with zero faults.";
    } else {
        output.value += "• Custom Code layout detected.\n• Block structure is correctly formatted.\n• Ready for live system simulation.";
    }
}

// 4. Live Preview Section
function runPreview() {
    const code = document.getElementById('previewCodeEditor').value;
    const previewContainer = document.getElementById('liveRenderOutput');
    if (previewContainer) {
        previewContainer.innerHTML = code;
    }
}

function copyText(elementId) {
    const textEl = document.getElementById(elementId);
    if (!textEl || !textEl.value) {
        alert("No content available to copy.");
        return;
    }
    textEl.select();
    navigator.clipboard.writeText(textEl.value);
    alert("Copied to clipboard!");
}

document.addEventListener("DOMContentLoaded", () => {
    switchSection('ai-gen');
});
        
