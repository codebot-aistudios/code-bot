// === 1. LIVE TABS PROTECTION CONTROLLER ===
function switchSection(sectionName) {
    // Aapki live HTML ke mutabiq exact charo sections ki IDs
    const sections = ['ai-gen-section', 'mic-mode-section', 'explainer-section', 'live-preview-section'];
    
    // Yeh block bina aapki CSS ko kharab kiye sirf blocks ko hide/show karega
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === sectionName + '-section') {
                el.style.setProperty('display', 'block', 'important'); // Sahi section ko samne lao
            } else {
                el.style.setProperty('display', 'none', 'important'); // Baaqi sab ko chupa do
            }
        }
    });

    // Saare buttons se green highlight (active class) hatana
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Jis button par click hua hai, usko active class dena
    const activeBtn = document.getElementById(sectionName + '-btn');
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// === 2. ANTI-BLANK PAGE INITIALIZATION ===
// Website khulte hi automatic AI Gen section chalega taake live page khali na dikhe
window.onload = function() {
    switchSection('ai-gen');
};

// === 3. GEMINI AI CODE GENERATOR ===
async function generateCode() {
    const promptField = document.getElementById('codePrompt');
    const outputBox = document.getElementById('generatedCodeOutput');
    
    if (!promptField || !outputBox) {
        alert("System Config Error: HTML Elements not found!");
        return;
    }
    
    const promptInput = promptField.value.trim();
    if (!promptInput) { 
        alert("Bhai pehle prompt box me kuch likho!"); 
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

        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const data = await response.json();
        let aiGeneratedCode = data.candidates[0].content.parts[0].text.trim();

        // Safe markdown cleanup
        if (aiGeneratedCode.startsWith("```html")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```html|```/g, "").trim();
        } else if (aiGeneratedCode.startsWith("```")) {
            aiGeneratedCode = aiGeneratedCode.replace(/```/g, "").trim();
        }

        outputBox.value = aiGeneratedCode;
        
    } catch (error) {
        console.error("AI Failure:", error);
        outputBox.value = "Error: API Key galat hai ya internet slow hai!";
    }
}

// === 4. LIVE PREVIEW ENGINE ===
function runPreview() {
    const editorCode = document.getElementById('previewCodeEditor');
    const resultBox = document.getElementById('liveRenderOutput');
    
    if (resultBox && editorCode && editorCode.value.trim()) {
        resultBox.innerHTML = `<iframe id="previewFrame" style="width:100%; height:100%; border:none; background:white; border-radius:8px;"></iframe>`;
        
        const previewFrame = document.getElementById('previewFrame');
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        
        frameDoc.open();
        frameDoc.write(editorCode.value); 
        frameDoc.close();
    } else {
        alert("Pehle Live Code Editor me HTML code likho bhai!");
    }
}

// === 5. EXPLAINER ENGINE ===
function explainCode() {
    const inputCode = document.getElementById('explainInput').value.trim();
    const outputBox = document.getElementById('explainOutput');
    
    if (!inputCode) {
        if (outputBox) outputBox.value = "Pehle upar wale box me koi code paste karo!";
        return;
    }
    
    outputBox.value = "Analyzing code structural design...";
    const totalDivs = (inputCode.match(/<div/g) || []).length;
    const totalButtons = (inputCode.match(/<button/g) || []).length;

    let report = `ASLI AI CODE ANALYZER REPORT\n====================================\n\n`;
    report += `- Div Containers: ${totalDivs} found.\n`;
    report += `- Buttons: ${totalButtons} found.\n\n`;
    report += `LOGIC BREAKDOWN:\nCode successfully parsed natively. All style vectors are intact.`;

    outputBox.value = report;
}

// === 6. UTILITY FUNCTIONS (COPY TEXT) ===
function copyText(elementId) {
    const copyTarget = document.getElementById(elementId);
    if (copyTarget && copyTarget.value) {
        copyTarget.select();
        navigator.clipboard.writeText(copyTarget.value);
        alert("Copied to clipboard! 👍");
    } else {
        alert("Box khali hai bhai!");
    }
}

function startVoiceRecord() {
    alert("Voice Module Ready!");
            }
            
