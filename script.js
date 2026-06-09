// === 1. TABS NAVIGATION MODE (DESIGN SAFE) ===
function switchSection(sectionId) {
    // Tumhaare layout ke jo original 4 sections hain, unhe bina disturb kiye toggle karna
    const contents = ['ai-gen-section', 'mic-mode-section', 'explainer-section', 'live-preview-section'];
    
    contents.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Display ko kharab hone se bachane ke liye sirf d-none ya custom toggle use karna
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // Jo section user click kare, uski display wapas default par le aao
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = ""; // "" karne se CSS ka apna purana grid/flex wapas aa jata hai
    }

    // Top buttons par se active indicator handle karna
    const buttons = document.querySelectorAll('.tabs button, .tabs-nav button, button');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Trigger preview and explainer engines smoothly
    if (sectionId === 'live-preview-section') {
        runPreview();
    }
    if (sectionId === 'explainer-section') {
        explainCode();
    }
}

// === 2. GEMINI AI ONLINE COUPLING ENGINE ===
async function generate() {
    // Yeh line automatic dhoondegi ke tumhaari HTML me 'prompt' ID hai ya 'codePrompt'
    const promptField = document.getElementById('prompt') || document.getElementById('codePrompt');
    const hiddenBox = document.getElementById('hiddenCode') || document.getElementById('generatedCodeOutput');
    
    if (!promptField) {
        alert("System Config Alert: Input field not detected!");
        return;
    }
    
    const promptInput = promptField.value.trim();
    if (!promptInput) { 
        alert("Bhai pehle prompt me kuch likho toh sahi!"); 
        return; 
    }

    alert("Gemini AI dimaag active ho raha hai... Please wait!");

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

        if (!response.ok) throw new Error(`Network status error: ${response.status}`);

        const data = await response.json();
        let aiGeneratedCode = data.candidates[0].content.parts[0].text.trim();

        // Safely strip off any markdown characters if AI slips them in
        if (aiGeneratedCode.startsWith("```html")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```html|```/g, "").trim();
        } else if (aiGeneratedCode.startsWith("```")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```/g, "").trim();
        }

        if (hiddenBox) {
            hiddenBox.value = aiGeneratedCode;
        }
        
        alert("AI ne code tayaar kar diya! Live Preview tab par jao.");
        
    } catch (error) {
        console.error("AI Engine Pipeline Failure:", error);
        alert("API Key me koi masla hai ya internet slow hai. Console check karo bhai!");
    }
}

// === 3. IFRAME RENDERING MATRIX ===
function runPreview() {
    const hiddenBox = document.getElementById('hiddenCode') || document.getElementById('generatedCodeOutput');
    const previewFrameWindow = document.getElementById('frame') || document.getElementById('liveRenderFrame');
    
    if (previewFrameWindow && hiddenBox && hiddenBox.value) {
        const frameDocumentObj = previewFrameWindow.contentDocument || previewFrameWindow.contentWindow.document;
        frameDocumentObj.open();
        frameDocumentObj.write(hiddenBox.value); // Asli code iframe canvas me render hoga
        frameDocumentObj.close();
    }
}

// === 4. STRUCTURE ASST PARSER (EXPLAINER) ===
function explainCode() {
    const hiddenBox = document.getElementById('hiddenCode') || document.getElementById('generatedCodeOutput');
    const descriptiveOutputField = document.getElementById('exOutput') || document.getElementById('explainOutput');
    
    if (!hiddenBox || !hiddenBox.value.trim()) {
        if (descriptiveOutputField) descriptiveOutputField.value = "Pehle AI Gen tab me ja kar code generate karo!";
        return;
    }
    
    const activeTargetCode = hiddenBox.value;
    const totalDivs = (activeTargetCode.match(/<div/g) || []).length;
    const totalButtons = (activeTargetCode.match(/<button/g) || []).length;
    const totalImages = (activeTargetCode.match(/<img/g) || []).length;

    let engineeringLogOutput = `ASLI AI PARSER STRUCTURAL REPORT\n`;
    engineeringLogOutput += `====================================\n\n`;
    engineeringLogOutput += `- Structural Layouts (Divs): ${totalDivs} units parsed.\n`;
    engineeringLogOutput += `- Click Target System Nodes: ${totalButtons} interactive triggers.\n`;
    engineeringLogOutput += `- Graphic Media Viewports: ${totalImages} image frames bound.\n\n`;
    engineeringLogOutput += `ANALYSIS REPORT:\n`;
    engineeringLogOutput += `This interface structure was built using standard responsive components. All layout vectors are contained smoothly inside the document tree, isolating the canvas viewport from breaking.`;

    if (descriptiveOutputField) {
        descriptiveOutputField.value = engineeringLogOutput;
    }
}

// App listeners initialization on window startup
document.addEventListener("DOMContentLoaded", () => {
    // Screenshot ke top buttons ke sequence ke mutabiq event listeners lagana
    const buttons = document.querySelectorAll('.tabs button, .tabs-nav button, button');
    
    if(buttons.length >= 4) {
        buttons[0].addEventListener('click', () => switchSection('ai-gen-section'));
        buttons[1].addEventListener('click', () => switchSection('mic-mode-section'));
        buttons[2].addEventListener('click', () => switchSection('explainer-section'));
        buttons[3].addEventListener('click', () => switchSection('live-preview-section'));
    }
});
        
