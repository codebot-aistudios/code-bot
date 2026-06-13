// ============================================================
// PROJECT: CODE BOT (SUPER-SAFE ARCHITECTURE)
// CREDIT: Done by CodeBot
// ============================================================

const SECURE_KEY = "AQ.Ab8RN6JPmMpoSizEcH791HL6zLOTgPBwXT4S0joTdtujfbxZ-w"; 
const BOT_ENGINE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${SECURE_KEY}`;

// ===== SELECTION WITH FALLBACKS (Taake design kabhi kharab na ho) =====
const promptInput = document.getElementById('promptInput') || document.querySelector('textarea') || document.querySelector('input[type="text"]');
const generateBtn = document.getElementById('generateBtn') || document.querySelector('button');
const outputContainer = document.getElementById('outputContainer') || document.getElementById('codeOutput') || document.querySelectorAll('textarea')[1]; 
const explainBtn = document.getElementById('explainBtn') || document.querySelector('.explain-btn') || document.getElementsByTagName('button')[1];
const explanationOutput = document.getElementById('explanationOutput') || document.querySelector('.explanation-div') || document.querySelector('.output'); 
const micBtn = document.getElementById('micBtn') || document.querySelector('.mic-btn') || document.querySelector('#mic');
const previewFrame = document.getElementById('previewFrame') || document.querySelector('iframe'); 
const brandingFooter = document.getElementById('brandingFooter') || document.querySelector('footer') || document.querySelector('.branding'); 

// ===== SPEAK ENGINE (Agar browser support kare toh hi chale) =====
function speakText(text) {
    if ('speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.log("Voice error bypassed");
        }
    }
}

// ===== BRANDING SETUP =====
document.addEventListener("DOMContentLoaded", () => {
    if (brandingFooter) {
        brandingFooter.innerText = "Done by CodeBot";
        brandingFooter.style.fontWeight = "bold";
    }
});

// ===== 1. MIC / SPEECH RECOGNITION =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; 

    if (micBtn) {
        micBtn.addEventListener('click', () => {
            try {
                micBtn.style.background = '#ff4d4d'; 
                micBtn.innerText = "Listening...";
                speakText("Listening");
                recognition.start();
            } catch (e) { console.error(e); }
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (promptInput) promptInput.value = transcript;
        };

        recognition.onerror = (err) => { console.error(err); };
        
        recognition.onend = () => { 
            micBtn.style.background = ''; 
            micBtn.innerText = "Mic"; 
        };
    }
}

// ===== 2. REAL-TIME LIVE PREVIEW =====
function updateLivePreview(code) {
    if (!previewFrame) return;
    try {
        const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        if (doc) {
            doc.open();
            doc.write(code);
            doc.close();
        }
    } catch (e) { console.error("Preview error bypassed"); }
}

if (outputContainer) {
    outputContainer.addEventListener('input', (e) => {
        updateLivePreview(e.target.value);
    });
}

// ===== CORE AI FETCH FUNCTION =====
async function fetchAIResponse(customPrompt) {
    try {
        const response = await fetch(BOT_ENGINE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: customPrompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error(error);
        return "Error";
    }
}

// ===== 3. CODE GENERATOR TRIGGER =====
if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
        if (!promptInput) return;
        const userPrompt = promptInput.value.trim();
        if (!userPrompt) {
            alert("Input empty");
            speakText("Input empty");
            return;
        }
        
        if (outputContainer) outputContainer.value = "Generating...";
        speakText("Generating code");
        
        const strictCodingPrompt = `Write only raw clean functional HTML/CSS/JS code for: ${userPrompt}. Do not wrap the output in markdown code blocks or backticks. Just give the raw executable code.`;
        const generatedCode = await fetchAIResponse(strictCodingPrompt);
        
        if (generatedCode && outputContainer) {
            outputContainer.value = generatedCode;
            updateLivePreview(generatedCode); 
            speakText("Code generated successfully");
        }
    });
}

// ===== 4. CODE EXPLAINER TRIGGER =====
if (explainBtn) {
    explainBtn.addEventListener('click', async () => {
        if (!outputContainer) return;
        const currentCode = outputContainer.value;
        if (!currentCode || currentCode.startsWith("Generating")) {
            alert("No code to explain");
            speakText("No code to explain");
            return;
        }
        
        if (explanationOutput) explanationOutput.innerText = "Explaining...";
        speakText("Explaining code");
        
        const explanationPrompt = `You are CodeBot, a professional AI Assistant. Explain this code block simply and logically step by step so a student can understand it perfectly: \n\n${currentCode}`;
        const finalExplanation = await fetchAIResponse(explanationPrompt);
        
        if (finalExplanation && explanationOutput) {
            explanationOutput.innerText = finalExplanation + "\n\n— Done by CodeBot";
            speakText(finalExplanation);
        }
    });
        }
    
