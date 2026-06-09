function switchSection(sectionId) {
    const sections = ['ai-gen-section', 'mic-mode-section', 'explainer-section', 'live-preview-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeSection = document.getElementById(sectionId + '-section');
    if (activeSection) activeSection.style.display = 'flex';
    
    const activeBtn = document.getElementById(sectionId + '-btn');
    if (activeBtn) activeBtn.classList.add('active');
}

function generateCode() {
    const prompt = document.getElementById('codePrompt').value.trim();
    const outputBox = document.getElementById('generatedCodeOutput');
    
    if (!prompt) { 
        alert("Please enter a prompt."); 
        return; 
    }

    const lowerPrompt = prompt.toLowerCase();
    let generatedHTML = "";

    const searchKeyword = encodeURIComponent(lowerPrompt);
    const fallbackImg = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80";
    const liveUnsplashImg = `https://images.unsplash.com/featured/?${searchKeyword}`;

    if (lowerPrompt.includes('calculator')) {
        generatedHTML = `<!-- Component: Interactive Calculator UI -->
<div style="max-width: 320px; margin: 20px auto; background: #1e1e24; border-radius: 16px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); font-family: system-ui, sans-serif; color: #fff;">
    <div style="background: #111; padding: 20px; text-align: right; font-size: 32px; border-radius: 8px; margin-bottom: 20px; font-weight: 300; overflow: hidden;">0</div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
        <button style="padding: 18px; background: #333; color: #fff; border: none; border-radius: 8px; font-size: 18px; cursor: pointer;">7</button>
        <button style="padding: 18px; background: #333; color: #fff; border: none; border-radius: 8px; font-size: 18px; cursor: pointer;">8</button>
        <button style="padding: 18px; background: #333; color: #fff; border: none; border-radius: 8px; font-size: 18px; cursor: pointer;">9</button>
        <button style="padding: 18px; background: #fff; color: #000; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer;">÷</button>
        <button style="padding: 18px; background: #333; color: #fff; border: none; border-radius: 8px; font-size: 18px; cursor: pointer;">4</button>
        <button style="padding: 18px; background: #333; color: #fff; border: none; border-radius: 8px; font-size: 18px; cursor: pointer;">5</button>
        <button style="padding: 18px; background: #333; color: #fff; border: none; border-radius: 8px; font-size: 18px; cursor: pointer;">6</button>
        <button style="padding: 18px; background: #fff; color: #000; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer;">×</button>
        <button style="padding: 18px; background: #007bff; color: #fff; border: none; grid-column: span 2; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer;">=</button>
    </div>
</div>`;
    } 
    else if (lowerPrompt.includes('login') || lowerPrompt.includes('form') || lowerPrompt.includes('auth')) {
        generatedHTML = `<!-- Component: Secure Authentication Form -->
<div style="max-width: 380px; margin: 40px auto; background: #ffffff; border: 1px solid #e2e8f0; padding: 32px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); font-family: system-ui, sans-serif;">
    <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 24px; font-weight: 700; text-align: center;">Welcome Back</h3>
    <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px; text-align: center;">Enter your credentials to access your account</p>
    <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 6px; color: #334155; font-size: 14px; font-weight: 500;">Email Address</label>
        <input type="email" placeholder="name@domain.com" style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 14px;" />
    </div>
    <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 6px; color: #334155; font-size: 14px; font-weight: 500;">Password</label>
        <input type="password" placeholder="••••••••" style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 14px;" />
    </div>
    <button style="width: 100%; padding: 12px; background: #0f172a; color: #ffffff; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Sign In</button>
</div>`;
    } 
    else {
        generatedHTML = `<!-- Component: Dynamic Layout Module -->
<div style="max-width: 550px; margin: 30px auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, sans-serif;">
    <div style="width: 100%; height: 260px; background: #f4f4f5; display: flex; align-items: center; justify-content: center; overflow: hidden;">
        <img src="${liveUnsplashImg}" alt="${prompt}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${fallbackImg}'" />
    </div>
    <div style="padding: 28px;">
        <div style="display: inline-block; padding: 4px 12px; background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 600; border-radius: 20px; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Custom Interface</div>
        <h2 style="margin: 0 0 10px 0; color: #09090b; font-size: 24px; font-weight: 700; text-transform: capitalize;">${prompt}</h2>
        <p style="margin: 0 0 24px 0; color: #71717a; font-size: 15px; line-height: 1.6;">The module has successfully processed the configuration parameters for "${prompt}". All child components are optimized for high-density layouts.</p>
        <div style="display: flex; gap: 12px;">
            <button style="flex: 1; padding: 12px; background: #18181b; color: #ffffff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">View Asset</button>
            <button style="padding: 12px 16px; background: #ffffff; color: #18181b; border: 1px solid #e4e4e7; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">Analytics</button>
        </div>
    </div>
</div>`;
    }

    outputBox.value = generatedHTML;
}

function explainCode() {
    const input = document.getElementById('explainInput').value.trim();
    const output = document.getElementById('explainOutput');
    
    if (!input) { 
        alert("Please paste code to explain."); 
        return; 
    }
    
    output.value = "EXPLANATION:\n" +
        "This component renders a clean, modular user interface using structured HTML elements.\n" +
        "1. It initializes a generic container wrapper with custom shadow maps for elevation.\n" +
        "2. It dynamically sources remote visual assets mapped via localized query tokens.\n" +
        "3. It uses layout properties to balance typographic elements for optimal screen distribution.";
}

function copyText(elementId) {
    const textEl = document.getElementById(elementId);
    if (!textEl || !textEl.value) return;
    
    navigator.clipboard.writeText(textEl.value).then(() => {
        textEl.blur();
    });
}

function runPreview() {
    document.getElementById('liveRenderOutput').innerHTML = document.getElementById('previewCodeEditor').value;
}

document.addEventListener("DOMContentLoaded", () => {
    switchSection('ai-gen');
});
