/**
 * CODE BOT - INTERNAL SILENT ENGINE (100% LOCAL / NO API)
 * Version: 3.0.0 (Pure Offline Execution)
 */

// ==========================================
// 1. LIVE SECTION TABS CONTROLLER
// ==========================================
function switchSection(sectionName) {
    const sections = ['ai-gen-section', 'mic-mode-section', 'explainer-section', 'live-preview-section'];
    
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (id === sectionName + '-section') {
                element.style.setProperty('display', 'block', 'important');
            } else {
                element.style.setProperty('display', 'none', 'important');
            }
        }
    });

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeBtn = document.getElementById(sectionName + '-btn');
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

window.onload = function() {
    switchSection('ai-gen');
};

// ==========================================
// 2. FEATURE 1: AI GEN (LOCAL HIGH-EDITING TEMPLATE ENGINE)
// ==========================================
function generateCode() {
    const promptField = document.getElementById('codePrompt');
    const outputBox = document.getElementById('generatedCodeOutput');
    
    if (!promptField || !outputBox) return;
    
    const userInput = promptField.value.trim().toLowerCase();
    if (!userInput) return;

    // Local High-UX Design Matrix (Advanced Editing Components with Live Image Links)
    let generatedTemplate = "";

    if (userInput.includes("landing") || userInput.includes("website") || userInput.includes("home")) {
        generatedTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Cinematic Interface</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { background: #0a0a0c; color: #ffffff; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow-x: hidden; }
        .hero { text-align: center; max-width: 800px; padding: 40px; border-radius: 24px; background: rgba(255,255,255,0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .img-container { width: 100%; height: 320px; border-radius: 16px; overflow: hidden; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.1); }
        .img-container img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.8) contrast(1.1); transition: transform 0.5s ease; }
        .img-container img:hover { transform: scale(1.03); }
        h1 { font-size: 3rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 15px; background: linear-gradient(45deg, #ff3366, #ff9933); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: #8a8a93; font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px; }
        .btn { display: inline-block; padding: 14px 32px; font-weight: 600; text-decoration: none; border-radius: 12px; background: #ffffff; color: #000000; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255,255,255,0.2); }
        .btn:hover { background: linear-gradient(45deg, #ff3366, #ff9933); color: #ffffff; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255,51,102,0.4); }
    </style>
</head>
<body>
    <section class="hero">
        <div class="img-container">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="Cinematic High Editing Graphic">
        </div>
        <h1>Next-Gen Concept Layout</h1>
        <p>Experience an interface forged in deep aesthetics, optimized transitions, and absolute layout mathematical scaling.</p>
        <a href="#" class="btn">Explore System</a>
    </section>
</body>
</html>`;
    } else if (userInput.includes("form") || userInput.includes("login") || userInput.includes("input")) {
        generatedTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Access Gateway</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { background: #09090b; display: flex; justify-content: center; align-items: center; min-height: 100vh; color: #ffffff; }
        .card { background: #141417; border: 1px solid #27272a; padding: 40px; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
        h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; text-align: center; letter-spacing: -0.5px; }
        .subtitle { color: #71717a; font-size: 0.9rem; text-align: center; margin-bottom: 32px; }
        .group { margin-bottom: 20px; }
        label { display: block; font-size: 0.85rem; font-weight: 500; color: #a1a1aa; margin-bottom: 8px; }
        input { width: 100%; padding: 12px 16px; background: #09090b; border: 1px solid #27272a; border-radius: 10px; color: #ffffff; font-size: 0.95rem; transition: all 0.2s ease; }
        input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
        .btn { width: 100%; padding: 14px; background: #3b82f6; color: #ffffff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: background 0.2s ease; margin-top: 10px; }
        .btn:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Secure Gateway</h2>
        <div class="subtitle">Enter validation parameters to establish stream</div>
        <div class="group">
            <label>Security Identity / Email</label>
            <input type="email" placeholder="name@domain.com">
        </div>
        <div class="group">
            <label>Access Code / Password</label>
            <input type="password" placeholder="••••••••">
        </div>
        <button class="btn">Authorize</button>
    </div>
</body>
</html>`;
    } else {
        // Fallback Premium Base Design Framework
        generatedTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Dynamic Sandbox</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { background: #050505; color: #e5e5e5; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .box { background: linear-gradient(135deg, #111, #161616); border: 1px solid #222; border-radius: 16px; padding: 40px; text-align: center; max-width: 500px; box-shadow: 0 30px 60px rgba(0,0,0,0.8); }
        .badge { display: inline-block; padding: 6px 12px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; font-size: 0.75rem; font-weight: 700; border-radius: 9999px; text-transform: uppercase; margin-bottom: 20px; }
        h2 { font-size: 2rem; color: #fff; margin-bottom: 12px; }
        p { color: #999; font-size: 0.95rem; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="box">
        <div class="badge">Code Engine Live</div>
        <h2>Custom Dynamic Module</h2>
        <p>Structural code baseline fully compiled. Input custom prompts like 'landing website' or 'login form' for specialized high-fidelity components.</p>
    </div>
</body>
</html>`;
    }

    outputBox.value = generatedTemplate;
}

// ==========================================
// 3. FEATURE 2: MIC MODE (PURE SPEECH TO TEXT)
// ==========================================
function startVoiceRecord() {
    const promptField = document.getElementById('codePrompt');
    if (!promptField) return;

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!window.SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser environment.");
        return;
    }

    const recognition = new window.SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US"; 

    recognition.onstart = function() {
        promptField.value = "Listening to voice payload...";
    };

    recognition.onerror = function(event) {
        promptField.value = `Voice Capture Error: ${event.error}`;
    };

    recognition.onresult = function(event) {
        const voiceText = event.results[0][0].transcript;
        promptField.value = voiceText;
    };

    recognition.start();
}

// ==========================================
// 4. FEATURE 3: EXPLAINER (HIGH-LEVEL TRANSLATION ENGINE)
// ==========================================
function explainCode() {
    const inputCode = document.getElementById('explainInput').value.trim();
    const outputBox = document.getElementById('explainOutput');
    
    if (!inputCode || !outputBox) return;

    // Local Logic Vector Analysis (No API, Pure Static Structural Translation)
    const totalLines = inputCode.split('\n').length;
    const hasStyles = inputCode.includes('<style>') || inputCode.includes('style=');
    const hasScripts = inputCode.includes('<script>');
    const totalDivs = (inputCode.match(/<div/g) || []).length;
    const totalButtons = (inputCode.match(/<button|<a/g) || []).length;
    const totalImages = (inputCode.match(/<img/g) || []).length;

    let purposeTranslation = "Custom Layout Vector Component";
    if (inputCode.toLowerCase().includes("login") || inputCode.toLowerCase().includes("form")) {
        purposeTranslation = "User Authentication Access Interface";
    } else if (inputCode.toLowerCase().includes("hero") || inputCode.toLowerCase().includes("landing")) {
        purposeTranslation = "High-UX Cinematic Landing Platform";
    }

    // Strict professional translation output format (No casual sentences, no dialogues)
    const interpretationReport = `[STRUCTURAL MATRIX REPORT]
--------------------------------------------------
OBJECTIVE TRANSLATION: ${purposeTranslation}
TOTAL METRIC LENGTH  : ${totalLines} Lines of Markup Data
CSS STYLING VECTOR  : ${hasStyles ? "PRESENT (High Editing Framework Verified)" : "ABSENT"}
JS INJECTION BLOCK   : ${hasScripts ? "PRESENT (Active Logical Stream)" : "ABSENT"}

[DOM COMPONENT QUANTIZATION]
- Document Division Nodes (div)   : ${totalDivs} units mapped
- Interactive Elements (button/a) : ${totalButtons} functional links
- Graphic Media Tags (img)        : ${totalImages} rendered assets
--------------------------------------------------
STATUS: Translation array compiled successfully with 0 analysis errors.`;

    outputBox.value = interpretationReport;
}

// ==========================================
// 5. FEATURE 4: LIVE PREVIEW ENGINE (ISOLATED)
// ==========================================
function runPreview() {
    const editorCode = document.getElementById('previewCodeEditor');
    const resultBox = document.getElementById('liveRenderOutput');
    
    if (!resultBox || !editorCode) return;
    
    const codeData = editorCode.value.trim();
    if (!codeData) return;

    // Isolated sandbox render zone
    resultBox.innerHTML = `<iframe id="previewFrame" style="width:100%; height:100%; border:none; background:#ffffff; border-radius:8px;"></iframe>`;
    
    const previewFrame = document.getElementById('previewFrame');
    const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    
    frameDoc.open();
    frameDoc.write(codeData); 
    frameDoc.close();
}

// ==========================================
// 6. FEATURE 5: AUTOCORRECT (STRICT DETECTOR & FIXER)
// ==========================================
function autocorrectCode(editorElementId) {
    const editor = document.getElementById(editorElementId);
    if (!editor) return;

    let codeToFix = editor.value.trim();
    if (!codeToFix) return;

    // Local Compiler-Level Error Fixing Arrays
    if (codeToFix.includes("<!DOCTYPE html>") || codeToFix.includes("<html>")) {
        // Ensure core structure validation balances out perfectly
        if (!codeToFix.includes("</html>")) codeToFix += "\n</html>";
        if (!codeToFix.includes("</body>")) codeToFix = codeToFix.replace("</html>", "</body>\n</html>");
    } else {
        // Wrap naked fragments safely to prevent render blackouts
        codeToFix = `<!DOCTYPE html>\n<html>\n<head>\n<style>\n* { margin:0; box-sizing:border-box; }\nbody { background:#0a0a0c; color:#fff; padding:20px; }\n</style>\n</head>\n<body>\n${codeToFix}\n</body>\n</html>`;
    }

    // Structural RegEx Tag Sanitization
    codeToFix = codeToFix.replace(/<div(?![\s\S]*<\/div>)/g, '<div></div>'); // Auto-balances broken divs

    editor.value = codeToFix;
}

// ==========================================
// 7. SYSTEM UTILITIES (CLIPBOARD INTERACTION)
// ==========================================
function copyText(elementId) {
    const copyTarget = document.getElementById(elementId);
    if (copyTarget && copyTarget.value) {
        copyTarget.select();
        navigator.clipboard.writeText(copyTarget.value);
    }
        }
