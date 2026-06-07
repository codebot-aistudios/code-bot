function switchSection(sectionId) {
  document.querySelectorAll('.feature-section').forEach(sec => {
    sec.style.display = 'none';
    sec.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'flex';
    targetSection.classList.add('active');
  }
  
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    if(btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(sectionId)) {
      btn.classList.add('active');
    }
  });
}

const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const aiOutput = document.getElementById('ai-output');
const micBtn = document.getElementById('micBtn');
const speechOutput = document.getElementById('speechOutput');
const voiceOutput = document.getElementById('voice-output');
const codeToExplain = document.getElementById('codeToExplain');
const explainBtn = document.getElementById('explainBtn');
const explainOutput = document.getElementById('explain-output');
const previewCodeEditor = document.getElementById('previewCodeEditor');
const runPreviewBtn = document.getElementById('runPreviewBtn');
const phoneLiveScreen = document.getElementById('phoneLiveScreen');

const smartEngine = {
  getLanguages: (text) => {
    const cleanText = text.toLowerCase();
    if (cleanText.includes('dashboard') || cleanText.includes('scalable') || cleanText.includes('full-stack')) {
      return `\n<div style="background:#090d16; color:#fff; font-family:sans-serif; padding:15px; border-radius:10px; min-height:250px;">\n  <div style="background:rgba(255,255,255,0.05); backdrop-filter:blur(10px); padding:10px; border-radius:8px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">\n    <span style="color:#00f5d4; font-weight:bold; font-size:12px;">🔒 CryptoCore Node v1.0</span>\n    <span style="background:#ff4757; padding:2px 6px; border-radius:4px; font-size:10px;">Live Grid</span>\n  </div>\n  <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">\n    <div style="background:#131a26; padding:10px; border-radius:8px; border:1px solid rgba(0,245,212,0.2);">\n      <p style="margin:0; font-size:10px; color:#aaa;">Algorithmic Hash Rate</p>\n      <h3 style="margin:5px 0; color:#00f5d4;">94.2 TH/s</h3>\n    </div>\n    <div style="background:#131a26; padding:10px; border-radius:8px; border:1px solid rgba(255,71,87,0.2);">\n      <p style="margin:0; font-size:10px; color:#aaa;">Data Layer Latency</p>\n      <h3 style="margin:5px 0; color:#ff4757;">1.24 ms</h3>\n    </div>\n  </div>\n</div>`;
    }
    if (cleanText.includes('python')) {
      return `# Python Script\nprint("Hello from Code Bot!")\nfor i in range(1, 6):\n    print("Row number:", i)`;
    }
    if (cleanText.includes('html') || cleanText.includes('button') || cleanText.includes('website')) {
      return `<div style="text-align:center; margin-top:40px; font-family:sans-serif;">\n  <h2 style="color:#ff4757;">Hello World App</h2>\n  <button style="background:#00f5d4; padding:12px 24px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="alert('Running flawlessly!')">Click Me</button>\n</div>`;
    }
    return `\n<div style="color: #00f5d4; text-align: center; font-family: sans-serif; margin-top: 30px;">\n  <h3>Result For: ${text}</h3>\n</div>`;
  }
};

if (generateBtn) {
  generateBtn.addEventListener('click', () => {
    const text = promptInput.value.trim();
    if(!text) return;
    generateBtn.innerHTML = `<span class="spinner"></span> Coding...`;
    generateBtn.disabled = true;
    setTimeout(() => {
      aiOutput.value = smartEngine.getLanguages(text);
      generateBtn.disabled = false;
      generateBtn.innerText = "Generate Code";
    }, 600);
  });
}

let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechObj = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechObj();
  recognition.continuous = false;
  recognition.lang = 'en-US'; 
  recognition.onstart = () => {
    micBtn.innerText = "🛑 Recording...";
    micBtn.classList.add('mic-active');
  };
  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    speechOutput.innerText = `You Said: "${speechResult}"`;
    voiceOutput.value = smartEngine.getLanguages(speechResult);
  };
  recognition.onend = () => {
    micBtn.innerText = "🎤 Start Recording";
    micBtn.classList.remove('mic-active');
  };
}
if (micBtn) { micBtn.addEventListener('click', () => { if(recognition) recognition.start(); }); }

if (explainBtn) {
  explainBtn.addEventListener('click', () => {
    const code = codeToExplain.value.trim();
    if(!code) return;
    explainBtn.disabled = true;
    explainOutput.value = "Analyzing structure...";
    setTimeout(() => {
      let explanation = "=== 📝 CODE TRANSLATION & ANALYSIS ===\n\n";
      if(code.includes('print') || code.includes('console.log') || code.includes('alert')) {
        explanation += "• Screen Alert/Print: Yeh code user ko screen par text ya alert notification dikhane ke liye chal raha hai.\n\n";
      }
      if(code.includes('for') || code.includes('while')) {
        explanation += "• Loop Sequence: Is block mein automatic repeat loop system laga hua hai.\n\n";
      }
      if(code.includes('<div') || code.includes('<html')) {
        explanation += "• Layout Setup: Yeh HTML structural view layout design hai.\n\n";
      }
      if(explanation === "=== 📝 CODE TRANSLATION & ANALYSIS ===\n\n") {
        explanation += "• Execution Core: Yeh general computational logic code block hai.";
      }
      explainOutput.value = explanation;
      explainBtn.disabled = false;
    }, 600);
  });
}

function autoCorrectHTML(code) {
  let corrected = code;
  const tags = ['div', 'button', 'h1', 'h2', 'h3', 'p', 'span'];
  tags.forEach(tag => {
    const openCount = (corrected.match(new RegExp(`<${tag}`, 'g')) || []).length;
    const closeCount = (corrected.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (openCount > closeCount) {
      for (let i = 0; i < (openCount - closeCount); i++) {
        corrected += `</${tag}>`;
      }
    }
  });
  return corrected;
}

// Render triggered ONLY when Red Button is clicked
if (runPreviewBtn) {
  runPreviewBtn.addEventListener('click', () => {
    let userCode = previewCodeEditor.value.trim();
    if(!userCode) {
      phoneLiveScreen.innerHTML = `<div style="font-family:sans-serif; text-align:center; padding:20px; color:#aaa;">Please paste or write some code first!</div>`;
      return;
    }
    
    // Auto-correct mistakes backend
    const safeCode = autoCorrectHTML(userCode);
    
    // Update the editor box so user sees the automatically closed tags
    previewCodeEditor.value = safeCode;
    
    // Output safely in mobile container screen
    phoneLiveScreen.innerHTML = safeCode;
  });
}

window.copyText = function(elementId) {
  const targetElement = document.getElementById(elementId);
  if (targetElement && targetElement.value) {
    targetElement.focus();
    targetElement.select();
    targetElement.setSelectionRange(0, 99999);

    let success = false;
    try { success = document.execCommand('copy'); } catch (err) { success = false; }

    if (!success) {
      try { navigator.clipboard.writeText(targetElement.value); success = true; } catch (err) { success = false; }
    }

    if (success) {
      const buttons = document.querySelectorAll('.local-copy-btn');
      buttons.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(elementId)) {
          const oldText = btn.innerText;
          btn.innerText = "Copied! ✓";
          setTimeout(() => { btn.innerText = oldText; }, 1500);
        }
      });
    } else {
      alert("Please manually copy the text.");
    }
  } else { alert("Nothing to copy!"); }
}

switchSection('ai-gen');
      
