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

    if (micBtn) {
        micBtn.addEventListener('click', () => {
            micBtn.style.background = '#ff4d4d'; 
            micBtn.innerText = "Listening...";
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (promptInput) promptInput.value = transcript;
        };

        recognition.onerror = (err) => {
            console.error(err);
        };
        
        recognition.onend = () => { 
            micBtn.style.background = ''; 
            micBtn.innerText = "Mic"; 
        };
    }
}

function updateLivePreview(code) {
    if (!previewFrame) return;
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
    }
}

if (outputContainer) {
    outputContainer.addEventListener('input', (e) => {
        updateLivePreview(e.target.value);
    });
}

if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        if (!promptInput) return;
        const userPrompt = promptInput.value.trim();
        if (!userPrompt) {
            alert("Input empty");
            return;
        }
        
        if (outputContainer) outputContainer.value = "Generating...";
        // API hata di gayi hai, yahan aapka purana direct text trigger ya custom functions chalenge.
    });
}

if (explainBtn) {
    explainBtn.addEventListener('click', () => {
        if (!outputContainer) return;
        const currentCode = outputContainer.value;
        if (!currentCode || currentCode.startsWith("Generating")) {
            alert("No code to explain");
            return;
        }
        
        if (explanationOutput) explanationOutput.innerText = "Explaining...";
    });
                }
    
