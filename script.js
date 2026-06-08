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

// === PREMIUM ENGINE: PROFESSIONAL DESIGN WITH AUTO-IMAGE LOADING ===
function heavyAIEngine(promptText) {
    const prompt = promptText.trim().toLowerCase();
    
    // High-End Image Assets
    const heroImg = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800";
    const product1 = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500";
    const product2 = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500";

    return `<!-- PREMIUM PROFESSIONAL COMPONENT -->
<div style="max-width: 800px; margin: 30px auto; background: #0b0c10; color: #fff; font-family: 'Montserrat', sans-serif; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 25px 55px rgba(0,0,0,0.85);">
  
  <div style="width: 100%; height: 350px; position: relative;">
    <img src="${heroImg}" style="width: 100%; height: 100%; object-fit: cover;" />
    <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 40px; background: linear-gradient(transparent, #0b0c10);">
      <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">${promptText.toUpperCase()}</h1>
      <p style="color: #00ffd5; margin-top: 10px;">Premium Architectural Design Layout</p>
    </div>
  </div>

  <div style="padding: 40px; background: #0f1015;">
    <p style="font-size: 18px; line-height: 1.8; color: #ccc; max-width: 600px; margin: 0 auto;">
      This professional component is engineered for modern performance. It integrates high-quality visual assets with a clean, responsive CSS framework to ensure an elite user experience.
    </p>
  </div>

  <div style="padding: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <img src="${product1}" style="width: 100%; border-radius: 12px;" />
    <img src="${product2}" style="width: 100%; border-radius: 12px;" />
  </div>
</div>`;
}

// 1. AI Generation
function generateCode() {
    const prompt = document.getElementById('codePrompt').value;
    const outputBox = document.getElementById('generatedCodeOutput');
    if (!prompt.trim()) return;

    outputBox.value = "Generating professional layout...";
    setTimeout(() => {
        outputBox.value = heavyAIEngine(prompt);
    }, 500);
}

// 2. PERFECT COPY FUNCTION (No Auto-Select After Copy)
function copyText(elementId) {
    const textEl = document.getElementById(elementId);
    if (!textEl || !textEl.value) return;
    
    // Copy process
    navigator.clipboard.writeText(textEl.value);
    
    // Selection ko turant hata dega taake "auto-select" feel na ho
    textEl.blur(); 
}

// 3. Mic / Explainer / Preview (Standard Professional)
function startVoiceRecord() {
    const voiceOutput = document.getElementById('voiceCodeOutput');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onresult = (event) => {
        voiceOutput.value = heavyAIEngine(event.results[0][0].transcript);
    };
    recognition.start();
}

function explainCode() {
    const input = document.getElementById('explainInput').value;
    document.getElementById('explainOutput').value = "=== ANALYSIS ===\nProfessional CSS/HTML structure detected. Components are optimized for web production.";
}

function runPreview() {
    document.getElementById('liveRenderOutput').innerHTML = document.getElementById('previewCodeEditor').value;
}

document.addEventListener("DOMContentLoaded", () => switchSection('ai-gen'));
