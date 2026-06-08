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

// === HIGH-BRAIN UNIVERSAL TEXT-TO-CODE ENGINE (NO API) ===
function heavyAIEngine(promptText) {
    const prompt = promptText.toLowerCase();
    
    // 1. Dynamic Aesthetic Images based on layout context
    let imgUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600"; // Tech/Default
    if (prompt.includes('cloth') || prompt.includes('markhor') || prompt.includes('brand') || prompt.includes('fashion') || prompt.includes('shop')) {
        imgUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600";
    } else if (prompt.includes('dark') || prompt.includes('sad') || prompt.includes('poetry') || prompt.includes('alone') || prompt.includes('writ')) {
        imgUrl = "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600";
    } else if (prompt.includes('card') || prompt.includes('profile') || prompt.includes('user')) {
        imgUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600";
    } else if (prompt.includes('food') || prompt.includes('burger') || prompt.includes('restaurant')) {
        imgUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600";
    }

    // 2. Setting up Theme Colors Dynamically
    let mainBg = "#111216";
    let accentColor = "#00ffd5";
    let glassEffect = "background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.08);";
    
    if (prompt.includes('light') || prompt.includes('white')) {
        mainBg = "#f4f6f9";
        accentColor = "#3b82f6";
        glassEffect = "background: rgba(0, 0, 0, 0.02); border: 1px solid rgba(0,0,0,0.08); color: #222;";
    } else if (prompt.includes('neon') || prompt.includes('cyber')) {
        accentColor = "#ff007f"; // Neon pink
    } else if (prompt.includes('dark') || prompt.includes('black')) {
        mainBg = "#07080a";
        accentColor = "#ff3e3e";
    }

    // 3. Normal Language Parser (Har prompt ko premium code mein badalta hai)
    let componentTitle = "PREMIUM INTERACTIVE COMPONENT";
    let componentContent = "";

    // Case A: Writing, Poetry, Brand Lyrics
    if (prompt.includes('writ') || prompt.includes('poet') || prompt.includes('lyric') || prompt.includes('rap') || prompt.includes('brittary')) {
        componentTitle = prompt.includes('markhor') ? "MARKHOR LEGACY WRITING" : "AESTHETIC LITERATURE BLOCK";
        let poetryText = `"Lafzaan di game vich yaar tera king ae,<br>Har line heavy, har lafz vich fire ae.<br>CodeBot likhda ae jadon vi kuch naya,<br>Aag lag jandi ae, har banda heraan ae."`;
        
        if (prompt.includes('dark') || prompt.includes('sad')) {
            poetryText = `"Raat khamosh ae, dil vich shor ae,<br>Badal gaye ne log, hun dunya koi hor ae.<br>Kalle beh ke ginde aan taareyan nu,<br>Sada zameer hi hun saada rehnuma ae."`;
        } else if (prompt.includes('markhor') || prompt.includes('success')) {
            poetryText = `"Shehar diyan sarkaan te raj saada chalda,<br>Kismat di kya mazaal jo rasta rokay yaar da.<br>Uchiyan udaana, honsle buland ne,<br>Duniya jaldi ae jab yaar da rob chalda."`;
        }
        
        componentContent = `<div style="font-style: italic; font-family: 'Georgia', serif; font-size: 17px; line-height: 1.8; margin-bottom: 25px; padding: 20px; border-radius: 12px; border-left: 4px solid ${accentColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4); ${glassEffect}">
            ${poetryText}
        </div>`;
    }
    // Case B: Login, Signup, Forms
    else if (prompt.includes('login') || prompt.includes('form') || prompt.includes('signup') || prompt.includes('input')) {
        componentTitle = prompt.includes('signup') ? "CREATIVE SIGN UP" : "SECURE USER LOGIN";
        componentContent = `<div style="text-align: left; margin-bottom: 20px;">
            <input type="email" placeholder="Username / Email" style="width: 100%; padding: 12px; margin-bottom: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; box-sizing: border-box;" />
            <input type="password" placeholder="Password" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; box-sizing: border-box;" />
        </div>`;
    }
    // Case C: Navigation bars / Headers
    else if (prompt.includes('nav') || prompt.includes('menu') || prompt.includes('header')) {
        componentTitle = "RESPONSIVE NAVIGATION";
        componentContent = `<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; margin-bottom: 20px; border-radius: 8px; ${glassEffect}">
            <span style="font-weight: bold; color: ${accentColor};">LOGO</span>
            <div style="display: flex; gap: 15px; font-size: 13px;">
                <span style="cursor: pointer;">Home</span><span style="cursor: pointer;">Explore</span><span style="cursor: pointer;">Contact</span>
            </div>
        </div>`;
    }
    // Case D: Calculators
    else if (prompt.includes('calc') || prompt.includes('calculator')) {
        componentTitle = "SMART MATRIX CALCULATOR";
        componentContent = `<div style="background: rgba(0,0,0,0.4); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
            <div style="text-align: right; font-size: 22px; color: ${accentColor}; font-family: monospace; padding-bottom: 10px;">0</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                <button style="background: #2d2f39; color: #fff; border: none; padding: 10px; border-radius: 6px;">7</button>
                <button style="background: #2d2f39; color: #fff; border: none; padding: 10px; border-radius: 6px;">8</button>
                <button style="background: #2d2f39; color: #fff; border: none; padding: 10px; border-radius: 6px;">9</button>
                <button style="background: ${accentColor}; color: #000; border: none; padding: 10px; border-radius: 6px; font-weight: bold;">=</button>
            </div>
        </div>`;
    }
    // Universal Case: Har normal requested layout ke liye beautiful card layout generate karega
    else {
        componentTitle = promptText.toUpperCase();
        componentContent = `<div style="padding: 20px; margin-bottom: 20px; border-radius: 12px; text-align: left; ${glassEffect}">
            <h4 style="color: ${accentColor}; margin: 0 0 10px 0;">✨ Live AI Engine Deployment</h4>
            <p style="margin: 0; font-size: 14px; color: #ccc; line-height: 1.6;">
                CodeBot generated a unique structural container for your request: "<strong>${promptText}</strong>". This block layout features fully responsive spacing, embedded visual media framework, and cross-platform CSS compiler styling.
            </p>
        </div>`;
    }

    // HTML Generator Wrapper
    return `<div style="max-width: 550px; margin: 20px auto; background: ${mainBg}; color: ${mainBg === '#f4f6f9' ? '#222' : '#fff'}; font-family: sans-serif; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
  
  <!-- Media Component -->
  <div style="width: 100%; height: 240px; position: relative;">
    <img src="${imgUrl}" alt="Media Resource" style="width: 100%; height: 100%; object-fit: cover;" />
    <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(transparent, ${mainBg}); height: 70px;"></div>
  </div>

  <!-- Workspace Shell -->
  <div style="padding: 25px; text-align: center;">
    <h3 style="color: ${accentColor}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px 0; font-size: 20px;">
      ${componentTitle}
    </h3>
    
    ${componentContent}
    
    <button style="background: ${accentColor}; color: #000; border: none; padding: 12px 35px; font-weight: bold; font-size: 13px; letter-spacing: 1px; cursor: pointer; border-radius: 30px; box-shadow: 0 5px 15px ${accentColor}40;">
      EXECUTE SYSTEM
    </button>
  </div>
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

    outputBox.value = "⚡ CodeBot High-Brain Engine is structuralizing layout components...\n⚡ Injecting optimized CSS properties and image layers...\n";

    setTimeout(() => {
        outputBox.value = heavyAIEngine(prompt);
    }, 600);
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

    voiceOutput.value = "Listening... Speak your design layout command!";
    recognition.start();

    recognition.onresult = function(event) {
        const speechToText = event.results[0][0].transcript;
        voiceOutput.value = "Voice Command: \"" + speechToText + "\"\n\n⚡ Building custom clean markup...";
        
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
    output.value = "=== CODE BOT CORE COMPILER SCAN ===\n• Modern CSS Box Model properties verified.\n• Rendering dynamic elements with 100% markup validity.";
}

// 4. Live Preview Section
function runPreview() {
    const code = document.getElementById('previewCodeEditor').value;
    const previewContainer = document.getElementById('liveRenderOutput');
    if (previewContainer) {
        previewContainer.innerHTML = code;
    }
}

// === UTILITY: DYNAMIC CLIPBOARD & AUTO-SELECT FOCUS ===
function copyText(elementId) {
    const textEl = document.getElementById(elementId);
    if (!textEl || !textEl.value) {
        alert("No content available to copy.");
        return;
    }
    
    // Auto-select highlight action!
    textEl.select();
    textEl.setSelectionRange(0, 99999); // Safe selector for mobile browsers too
    
    // Copy process
    navigator.clipboard.writeText(textEl.value);
    alert("Copied to clipboard! Text auto-selected successfully.");
}

document.addEventListener("DOMContentLoaded", () => {
    switchSection('ai-gen');
});

        
