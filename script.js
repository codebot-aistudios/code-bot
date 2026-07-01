/**
 * CODE BOT ASSISTANT CORE CONTROLLER
 * ENGINE STATE: CLOUDFLARE WORKER BACKEND ARCHITECTURE
 */

"use strict";

async function generateLocalCodeOffline() {
    const promptInput = document.getElementById('codePromptField');
    const generateBtn = document.getElementById('generateCodeBtn');
    
    const htmlBox = document.getElementById('htmlOutputBox');
    const cssBox = document.getElementById('cssOutputBox');
    const jsBox = document.getElementById('jsOutputBox');

    const promptText = promptInput.value.trim();

    if (!promptText) {
        alert("Please provide an entry prompt specification before compiling parameters.");
        return;
    }

    // Set UI loading and processing states
    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";
    
    htmlBox.value = "Generating HTML components...";
    cssBox.value = "Generating CSS styles...";
    jsBox.value = "Generating JavaScript logic...";

    const workerEndpoint = "https://codebot-api.muhammadhadi490101.workers.dev";

    try {
        const response = await fetch(workerEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: promptText
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || data.error || `Server returned status code: ${response.status}`);
        }

        // Inject compiled string modules into matching targets
        htmlBox.value = data.html || "";
        cssBox.value = data.css || "/* No CSS compiled for this sequence */";
        jsBox.value = data.javascript || "// No JavaScript compiled for this sequence";

    } catch (error) {
        console.error("Intercepted operational exception:", error);
        htmlBox.value = "Failed to load workflow execution loops.";
        cssBox.value = "Failed to load workflow execution loops.";
        jsBox.value = "Failed to load workflow execution loops.";
        alert(`API Execution Exception: ${error.message}`);
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate Code Source";
    }
}

function copyCodePayload(id) {
    const box = document.getElementById(id);
    if (!box.value) return;
    box.select();
    navigator.clipboard.writeText(box.value);
    alert("Copied to clipboard!");
}
    
