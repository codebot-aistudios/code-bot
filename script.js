// === 1. TABS SYSTEM FIX (DESIGN PROTECTION MODE) ===
function switchSection(sectionId) {
    // 1. Pehle saare sections ko hide karenge unki class target kar ke
    // Aapke original HTML ke mutabiq aapki sections par class 'feature-section' ya 'tab-section' hogi
    const sections = document.querySelectorAll('.feature-section, section, [id$="-section"], #ai-gen, #mic-mode, #explainer, #live-preview');
    
    sections.forEach(sec => {
        if (sec) {
            sec.style.setProperty('display', 'none', 'important');
        }
    });

    // 2. Jo section click hua hai uski display wapas un-hide karo
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        // "" karne se aapki CSS ka asli default layout (block/flex) wapas aa jata hai aur design nahi toot ta
        targetSection.style.display = ""; 
    }

    // 3. Saare tab buttons se active state hatana
    const tabs = document.querySelectorAll('.feature-tabs button, .tab-btn, .tabs button');
    tabs.forEach(tab => {
        tab.classList.remove('active', 'tab-active');
    });

    // 4. Jis button par user ne click kiya hai, usko neon-green active class dena
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }

    // Dynamic functions trigger logic
    if (sectionId === 'live-preview') runPreview();
    if (sectionId === 'explainer') explainCode();
}

// === 2. INITIALIZATION ON LOAD (BLANK PAGE FIX!) ===
// Jab website pehli baar khulegi, toh yeh sirf AI Gen ko dikhayegi, baaqi sab hide karegi. 
// Isse aapka live page kabhi blank nahi hoga!
document.addEventListener("DOMContentLoaded", () => {
    // Pehle page load par default tab active karna
    switchSection('ai-gen'); 
});

// === 3. ASLI GEMINI AI COUPLING ENGINE ===
async function generateCode() {
    const promptField = document.getElementById('prompt');
    const outputBox = document.getElementById('generatedCodeOutput');
    
    if (!promptField || !outputBox) {
        alert("System Config Mismatch: HTML me ids 'prompt' aur 'generatedCodeOutput' check karein!");
        return;
    }
    
    const promptInput = promptField.value.trim();
    if (!promptInput) { 
        alert("Bhai pehle prompt me kuch likho toh sahi!"); 
        return; 
    }

    outputBox.value = "Asli AI dimaag soch raha hai... Please wait...";

    // ============================================================
    // IMPORTANT: Apni Google AI Studio wali free API Key yahan paste karo
    const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
    // ============================================================
    
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const systemInstruction = "You are an expert frontend developer. Generate a complete, beautiful single-file HTML page with embedded CSS based on the user request. Output ONLY valid HTML code. Do NOT wrap the response in markdown blocks like ```html. Start directly with <!DOCTYPE html> and end with </html>.";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemInstruction}\n\nUser Request: ${promptInput}` }] }]
            })
        });

        if (!response.ok) throw new Error(`Status error: ${response.status}`);

        const data = await response.json();
        let aiGeneratedCode = data.candidates[0].content.parts[0].text.trim();

        // Markdown block clean-up tool
        if (aiGeneratedCode.startsWith("```html")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```html|```/g, "").trim();
        } else if (aiGeneratedCode.startsWith("```")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```/g, "").trim();
        }

        outputBox.value = aiGeneratedCode;
        
    } catch (error) {
        console.error("AI Pipeline Failure:", error);
        outputBox.value = "Error: API Key galat hai ya internet slow hai!";
    }
}

// === 4. IFRAME RENDERING ENGINE ===
function runPreview() {
    const outputBox = document.getElementById('generatedCodeOutput');
    const previewFrameWindow = document.getElementById('frame');
    
    if (previewFrameWindow && outputBox && outputBox.value) {
        const frameDocumentObj = previewFrameWindow.contentDocument || previewFrameWindow.contentWindow.document;
        frameDocumentObj.open();
        frameDocumentObj.write(outputBox.value); 
        frameDocumentObj.close();
    }
}

// === 5. EXPLAINER ENGINE ===
function explainCode() {
    const outputBox = document.getElementById('generatedCodeOutput');
    const descriptiveOutputField = document.getElementById('exOutput');
    
    if (!outputBox || !outputBox.value.trim() || outputBox.value.startsWith("Asli AI dimaag")) {
        if (descriptiveOutputField) descriptiveOutputField.value = "Pehle code generate karo bhai!";
        return;
    }
    
    const activeTargetCode = outputBox.value;
    const totalDivs = (activeTargetCode.match(/<div/g) || []).length;
    const totalButtons = (activeTargetCode.match(/<button/g) || []).length;
    const totalImages = (activeTargetCode.match(/<img/g) || []).length;

    let engineeringLogOutput = `ASLI AI PARSER STRUCTURAL REPORT\n`;
    engineeringLogOutput += `====================================\n\n`;
    engineeringLogOutput += `- Layout Containers (Divs): ${totalDivs} units found.\n`;
    engineeringLogOutput += `- Interactive Triggers (Buttons): ${totalButtons} elements.\n`;
    engineeringLogOutput += `- Graphics Mapped (Images): ${totalImages} viewports.\n\n`;
    engineeringLogOutput += `ANALYSIS:\nLayout compiled inline. Protected from breaking frame layouts.`;

    if (descriptiveOutputField) {
        descriptiveOutputField.value = engineeringLogOutput;
    }
            }
        
