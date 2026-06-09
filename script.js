// === 1. TABS SYSTEM FIX (AAPKE ASLI DESIGN KE MUTABIQ) ===
function switchSection(sectionId) {
    // Aapke original design ke mutabiq saare sections ko hide karna
    // Note: Apni HTML me in charo divs par id="ai-gen", id="mic-mode", etc. lazmi check kar lena
    const sections = ['ai-gen', 'mic-mode', 'explainer', 'live-preview'];
    sections.forEach(id => {
        const sec = document.getElementById(id);
        if (sec) {
            sec.style.setProperty('display', 'none', 'important');
        }
    });

    // Jo section user ne click kiya, usse hide hatana taake aapki CSS ka asli display wapas aaye
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = ""; // "" karne se aapki CSS ka original design kharab nahi hota
    }

    // Saare tabs se active status hatana
    const tabs = document.querySelectorAll('.feature-tabs button, .tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Jis tab button par click hua hai, usko green glow (active class) dena
    // Yeh line automatic dhoondegi ke click kis button par hua hai
    const clickedBtn = window.event ? window.event.target : null;
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }

    // Trigger preview and explainer engines smoothly
    if (sectionId === 'live-preview') {
        runPreview();
    }
    if (sectionId === 'explainer') {
        explainCode();
    }
}

// === 2. ASLI GEMINI AI ENGINE (ONLINE COUPLING) ===
async function generateCode() {
    // Aapke CodePen ke mutabiq prompt textarea aur output box ko pakadna
    // HTML me input box par id="prompt" aur output box par id="generatedCodeOutput" laga hona chahiye
    const promptField = document.getElementById('prompt');
    const outputBox = document.getElementById('generatedCodeOutput');
    
    if (!promptField || !outputBox) {
        alert("System Config Alert: Apni HTML me textarea par id='prompt' aur niche wale box par id='generatedCodeOutput' check karein!");
        return;
    }
    
    const promptInput = promptField.value.trim();
    if (!promptInput) { 
        alert("Bhai pehle box me kuch likho toh sahi!"); 
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

        if (!response.ok) throw new Error(`Network status error: ${response.status}`);

        const data = await response.json();
        let aiGeneratedCode = data.candidates[0].content.parts[0].text.trim();

        // Agar AI galti se markdown tags de de, toh unhe saaf karne ka safe tool
        if (aiGeneratedCode.startsWith("```html")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```html|```/g, "").trim();
        } else if (aiGeneratedCode.startsWith("```")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```/g, "").trim();
        }

        // Output box me real code display karna
        outputBox.value = aiGeneratedCode;
        
    } catch (error) {
        console.error("AI Engine Pipeline Failure:", error);
        outputBox.value = "Error: Ya toh API Key galat hai ya internet slow hai. Check console!";
    }
}

// === 3. IFRAME RENDERING MATRIX ===
function runPreview() {
    const outputBox = document.getElementById('generatedCodeOutput');
    // HTML me jahan live preview dikhana hai wahan <iframe id="frame"></iframe> laga hona chahiye
    const previewFrameWindow = document.getElementById('frame');
    
    if (previewFrameWindow && outputBox && outputBox.value) {
        const frameDocumentObj = previewFrameWindow.contentDocument || previewFrameWindow.contentWindow.document;
        frameDocumentObj.open();
        frameDocumentObj.write(outputBox.value); // Asli HTML/CSS page render hoga text nahi
        frameDocumentObj.close();
    }
}

// === 4. STRUCTURE TAG PARSER (EXPLAINER) ===
function explainCode() {
    const outputBox = document.getElementById('generatedCodeOutput');
    // HTML me explainer tab ke andar <textarea id="exOutput" readonly></textarea> hona chahiye
    const descriptiveOutputField = document.getElementById('exOutput');
    
    if (!outputBox || !outputBox.value.trim() || outputBox.value.startsWith("Asli AI dimaag")) {
        if (descriptiveOutputField) descriptiveOutputField.value = "Pehle AI Gen tab me ja kar code generate karo bhai!";
        return;
    }
    
    const activeTargetCode = outputBox.value;
    const totalDivs = (activeTargetCode.match(/<div/g) || []).length;
    const totalButtons = (activeTargetCode.match(/<button/g) || []).length;
    const totalImages = (activeTargetCode.match(/<img/g) || []).length;

    let engineeringLogOutput = `ASLI AI PARSER STRUCTURAL REPORT\n`;
    engineeringLogOutput += `====================================\n\n`;
    engineeringLogOutput += `- Structural Layouts (Divs): ${totalDivs} units parsed.\n`;
    engineeringLogOutput += `- Click Target System Nodes: ${totalButtons} interactive triggers.\n`;
    engineeringLogOutput += `- Graphic Media Viewports: ${totalImages} image frames bound.\n\n`;
    engineeringLogOutput += `ANALYSIS REPORT:\n`;
    engineeringLogOutput += `This structure uses dynamic blocks. All layers are contained inside the document tree, isolating the canvas view from breaking.`;

    if (descriptiveOutputField) {
        descriptiveOutputField.value = engineeringLogOutput;
    }
}
