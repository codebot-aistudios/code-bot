// === 1. TABS SYSTEM FIX (DESIGN SAFE CLICK LOGIC) ===
function switchSection(sectionId) {
    // Aapke mobile layout ke charo sections ki IDs
    const contents = ['ai-gen-section', 'mic-mode-section', 'explainer-section', 'live-preview-section'];
    
    contents.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // CSS ko kharab hone se bachane ke liye display empty "" chordna behtar hota hai
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // Jo section click hua hai, usko wapas active karna bina design kharab kiye
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        // "" karne se CSS ka apna asli style (grid/flex) wapas aa jata hai
        targetSection.style.display = ""; 
    }

    // Active button class dynamic manage karna
    const buttons = document.querySelectorAll('.tabs button, .tabs-nav button, button');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Trigger components logic
    if (sectionId === 'live-preview-section') {
        runPreview();
    }
    if (sectionId === 'explainer-section') {
        explainCode();
    }
}

// === 2. ASLI GEMINI AI ENGINE ===
async function generate() {
    const promptField = document.getElementById('codePrompt') || document.getElementById('prompt');
    const hiddenBox = document.getElementById('hiddenCode') || document.getElementById('generatedCodeOutput');
    
    if (!promptField) {
        alert("Error: Input field 'codePrompt' nahi mila!");
        return;
    }
    
    const promptInput = promptField.value.trim();
    if (!promptInput) { 
        alert("Pehle prompt likho bhai!"); 
        return; 
    }

    alert("Asli AI dimaag soch raha hai... Please wait!");

    // ============================================================
    // IMPORTANT: Apni Google AI Studio wali API Key yahan daalo
    const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
    // ============================================================
    
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const systemInstruction = "You are an expert frontend developer. Generate a complete, beautiful single-file HTML page with embedded CSS based on the user request. Output ONLY valid HTML code. Do NOT wrap the response in markdown blocks like ```html. Start directly with <!DOCTYPE html> and end with </html>.";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemInstruction}\n\nUser Prompt: ${promptInput}` }] }]
            })
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        let aiGeneratedCode = data.candidates[0].content.parts[0].text.trim();

        // Markdown block clean-up
        if (aiGeneratedCode.startsWith("```html")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```html|```/g, "").trim();
        } else if (aiGeneratedCode.startsWith("```")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```/g, "").trim();
        }

        if (hiddenBox) {
            hiddenBox.value = aiGeneratedCode;
        }
        
        alert("AI ne code ready kar diya! Live Preview check karo.");
        
    } catch (error) {
        console.error("Error:", error);
        alert("API Key check karo ya internet connectivity dekhain!");
    }
}

// === 3. PREVIEW ENGINE ===
function runPreview() {
    const hiddenBox = document.getElementById('hiddenCode') || document.getElementById('generatedCodeOutput');
    const previewFrameWindow = document.getElementById('liveRenderFrame') || document.getElementById('frame');
    
    if (previewFrameWindow && hiddenBox && hiddenBox.value) {
        const frameDocumentObj = previewFrameWindow.contentDocument || previewFrameWindow.contentWindow.document;
        frameDocumentObj.open();
        frameDocumentObj.write(hiddenBox.value); 
        frameDocumentObj.close();
    }
}

// === 4. EXPLAINER SYSTEM ===
function explainCode() {
    const hiddenBox = document.getElementById('hiddenCode') || document.getElementById('generatedCodeOutput');
    const descriptiveOutputField = document.getElementById('explainOutput') || document.getElementById('exOutput');
    
    if (!hiddenBox || !hiddenBox.value.trim()) {
        if (descriptiveOutputField) descriptiveOutputField.value = "Pehle AI Gen tab me code generate karo!";
        return;
    }
    
    const activeTargetCode = hiddenBox.value;
    const trackedContainers = (activeTargetCode.match(/<div/g) || []).length;
    const trackedButtons = (activeTargetCode.match(/<button/g) || []).length;
    const trackedImages = (activeTargetCode.match(/<img/g) || []).length;

    let engineeringLogOutput = `ASLI AI CODE ANALYZER REPORT\n`;
    engineeringLogOutput += `====================================\n\n`;
    engineeringLogOutput += `- HTML Structural Boxes (Divs): ${trackedContainers} units\n`;
    engineeringLogOutput += `- Interactive Elements (Buttons): ${trackedButtons} items\n`;
    engineeringLogOutput += `- Graphic Assets Loaded (Images): ${trackedImages} elements\n\n`;
    engineeringLogOutput += `ANALYSIS:\nThis layout structure was generated dynamically by Gemini AI. Styles are fully embedded inside the document tree smoothly.`;

    if (descriptiveOutputField) {
        descriptiveOutputField.value = engineeringLogOutput;
    }
}

// App listeners bind
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.tabs button, .tabs-nav button, button');
    
    if(buttons.length >= 4) {
        buttons[0].addEventListener('click', () => switchSection('ai-gen-section'));
        buttons[1].addEventListener('click', () => switchSection('mic-mode-section'));
        buttons[2].addEventListener('click', () => switchSection('explainer-section'));
        buttons[3].addEventListener('click', () => switchSection('live-preview-section'));
    }
});
            
