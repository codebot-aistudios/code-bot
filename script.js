    
  // 1. Tab Switching Logic (Srf active section dikhane ke liye)
function switchSection(sectionId) {
    // Saare sections ko pehle chhupa do
    const sections = ['ai-gen-section', 'mic-mode-section', 'explainer-section', 'live-preview-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Saare tab buttons se active class hatao
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Jo click hua us section ko dikhao aur button ko active karo
    const activeSection = document.getElementById(sectionId + '-section');
    if (activeSection) activeSection.style.display = 'flex';
    
    // Active button highlight karne ke liye check
    const activeBtn = document.getElementById(sectionId + '-btn');
    if (activeBtn) activeBtn.classList.add('active');
}

// 2. Mock AI Code Generation Logic
function generateCode() {
    const prompt = document.getElementById('codePrompt').value.toLowerCase();
    const outputBox = document.getElementById('generatedCodeOutput');
    
    if (!prompt.trim()) {
        alert("Please enter a request first!");
        return;
    }

    outputBox.value = "// Generating your code dynamically...\n";

    setTimeout(() => {
        if (prompt.includes('calculator')) {
            outputBox.value = `<div style="background:#1e1f26; padding:20px; border-radius:8px; text-align:center;">\n  <h3 style="color:#47cf73;">Calculator</h3>\n  <input type="text" style="width:100%; margin-bottom:10px; background:#131417; color:#fff; border:1px solid #343746; padding:8px;" value="0" readonly />\n  <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:5px;">\n    <button style="background:#3b82f6; color:#fff; padding:10px; border:none; border-radius:4px;">7</button>\n    <button style="background:#3b82f6; color:#fff; padding:10px; border:none; border-radius:4px;">8</button>\n    <button style="background:#3b82f6; color:#fff; padding:10px; border:none; border-radius:4px;">9</button>\n    <button style="background:#2563eb; color:#fff; padding:10px; border:none; border-radius:4px;">+</button>\n  </div>\n</div>`;
        } else if (prompt.includes('button') || prompt.includes('style')) {
            outputBox.value = `<button style="background:#47cf73; color:#000; padding:12px 24px; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Custom AI Button</button>`;
        } else {
            outputBox.value = `<div style="padding:15px; background:#1e1f26; border-radius:6px;">\n  <p style="color:#5A99E9;">AI Output for: "${prompt}"</p>\n  <p>Hello World! Your request has been successfully parsed.</p>\n</div>`;
        }
    }, 1000);
}

// 3. Copy Code Functionality
function copyText(elementId) {
    const textEl = document.getElementById(elementId);
    if (!textEl || !textEl.value) {
        alert("Nothing to copy!");
        return;
    }
    textEl.select();
    textEl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textEl.value);
    alert("Code copied to clipboard!");
}

// 4. Live Preview Render Function
function runPreview() {
    const code = document.getElementById('previewCodeEditor').value;
    const previewContainer = document.getElementById('liveRenderOutput');
    if (previewContainer) {
        previewContainer.innerHTML = code;
    }
}

// Default page load par AI Gen open rakho
document.addEventListener("DOMContentLoaded", () => {
    switchSection('ai-gen');
});
