const SECURE_KEY = "AQ.Ab8RN6JPmMpoSizEcH791HL6zLOTgPBwXT4S0joTdtujfbxZ-w"; 
const BOT_ENGINE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${SECURE_KEY}`;

const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const outputContainer = document.getElementById('outputContainer'); 
const explainBtn = document.getElementById('explainBtn');
const explanationOutput = document.getElementById('explanationOutput'); 
const micBtn = document.getElementById('micBtn');
const previewFrame = document.getElementById('previewFrame'); 
const brandingFooter = document.getElementById('brandingFooter'); 

document.addEventListener("DOMContentLoaded", () => {
    if (brandingFooter) {
        brandingFooter.innerText = "Done by CodeBot";
        brandingFooter.style.fontWeight = "bold";
    }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; 

    micBtn.addEventListener('click', () => {
        micBtn.style.background = '#ff4d4d'; 
        micBtn.innerText = "Listening...";
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        promptInput.value = transcript;
    };

    recognition.onerror = (err) => {
        console.error(err);
    };
    
    recognition.onend = () => { 
        micBtn.style.background = ''; 
        micBtn.innerText = "Mic"; 
    };
} else {
    micBtn.style.opacity = '0.5';
}

function updateLivePreview(code) {
    if (!previewFrame) return;
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
}

if (outputContainer) {
    outputContainer.addEventListener('input', (e) => {
        updateLivePreview(e.target.value);
    });
}

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

if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
        const userPrompt = promptInput.value.trim();
        if (!userPrompt) {
            alert("Input empty");
            return;
        }
        
        outputContainer.value = "Generating...";
        
        const strictCodingPrompt = `Write only raw clean functional HTML/CSS/JS code for: ${userPrompt}. Do not wrap the output in markdown code blocks or backticks. Just give the raw executable code.`;
        const generatedCode = await fetchAIResponse(strictCodingPrompt);
        
        if (generatedCode) {
            outputContainer.value = generatedCode;
            updateLivePreview(generatedCode); 
        }
    });
}

if (explainBtn) {
    explainBtn.addEventListener('click', async () => {
        const currentCode = outputContainer.value;
        if (!currentCode || currentCode.startsWith("Generating")) {
            alert("No code to explain");
            return;
        }
        
        explanationOutput.innerText = "Explaining...";
        
        const explanationPrompt = `You are CodeBot, a professional AI Assistant. Explain this code block simply and logically step by step so a student can understand it perfectly: \n\n${currentCode}`;
        const finalExplanation = await fetchAIResponse(explanationPrompt);
        
        if (finalExplanation) {
            explanationOutput.innerText = finalExplanation + "\n\n— Done by CodeBot";
        }
    });
                          }
                           
