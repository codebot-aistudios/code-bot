    // =========================
// SMART EXPLAINER ENGINE
// =========================

function explainCode() {
    const codeSource =
        document.getElementById("explainInput")?.value?.trim();

    const outputField =
        document.getElementById("explainOutput");

    if (!codeSource || !outputField) return;

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(codeSource, "text/html");

        const report = [];

        const title =
            doc.querySelector("title")?.textContent ||
            "Generated Web Interface";

        report.push(`PROJECT OVERVIEW`);
        report.push(`==============================`);
        report.push(
            `This generated interface is titled "${title}".`
        );
        report.push("");

        const headings = doc.querySelectorAll(
            "h1,h2,h3,h4,h5,h6"
        );

        if (headings.length > 0) {
            report.push(`MAIN CONTENT`);
            report.push(`------------------------------`);

            headings.forEach((heading) => {
                const text = heading.textContent.trim();

                if (text) {
                    report.push(
                        `• The page presents a section named "${text}".`
                    );
                }
            });

            report.push("");
        }

        const buttons = doc.querySelectorAll("button");

        if (buttons.length > 0) {
            report.push(`INTERACTIVE CONTROLS`);
            report.push(`------------------------------`);

            buttons.forEach((btn) => {
                const text = btn.textContent.trim();

                if (text) {
                    report.push(
                        `• A button is available for "${text}" actions.`
                    );
                }
            });

            report.push("");
        }

        const inputs = doc.querySelectorAll("input");

        if (inputs.length > 0) {
            report.push(`DATA ENTRY SYSTEM`);
            report.push(`------------------------------`);

            inputs.forEach((input) => {
                const placeholder =
                    input.getAttribute("placeholder");

                const type =
                    input.getAttribute("type") || "text";

                if (placeholder) {
                    report.push(
                        `• Users can enter ${type} information through the "${placeholder}" field.`
                    );
                } else {
                    report.push(
                        `• A ${type} input field is provided for user interaction.`
                    );
                }
            });

            report.push("");
        }

        const images = doc.querySelectorAll("img");

        if (images.length > 0) {
            report.push(`VISUAL CONTENT`);
            report.push(`------------------------------`);

            report.push(
                `• The design contains ${images.length} image element(s) used for visual presentation.`
            );

            report.push("");
        }

        if (
            codeSource.includes("display: grid") ||
            codeSource.includes("grid-template")
        ) {
            report.push(
                `• The layout uses a responsive grid system that automatically adapts to different screen sizes.`
            );
        }

        if (
            codeSource.includes("display:flex") ||
            codeSource.includes("display: flex")
        ) {
            report.push(
                `• Flexible alignment techniques are used for balanced content positioning.`
            );
        }

        const cards =
            (codeSource.match(/Item\s+\d+/gi) || []).length;

        if (cards > 0) {
            report.push(
                `• The page displays ${cards} generated content card(s).`
            );
        }

        report.push("");
        report.push(`USER EXPERIENCE SUMMARY`);
        report.push(`------------------------------`);
        report.push(
            `This interface is automatically analyzed from the generated design structure. The explanation is based on detected visual components, layouts, controls, images and content sections without exposing raw source code.`
        );

        outputField.value = report.join("\n");
    } catch (err) {
        outputField.value =
            "Unable to analyze the generated interface.";
    }
}

// =========================
// REAL BROWSER PREVIEW
// =========================

function runPreview() {
    const editor =
        document.getElementById("previewCodeEditor");

    const iframe =
        document.getElementById("liveRenderFrame");

    if (!editor || !iframe) return;

    let html = editor.value.trim();

    if (!html) return;

    html = html.replace(
        /https:\/\/images\.unsplash\.com\/featured\/\?/gi,
        "https://source.unsplash.com/800x600/?"
    );

    iframe.removeAttribute("src");

    iframe.srcdoc = html;

    setTimeout(() => {
        try {
            const doc =
                iframe.contentDocument ||
                iframe.contentWindow.document;

            doc.open();
            doc.write(html);
            doc.close();
        } catch (e) {}
    }, 50);
}

// =========================
// AUTO UPDATE PREVIEW
// =========================

document.addEventListener("DOMContentLoaded", () => {
    const editor =
        document.getElementById("previewCodeEditor");

    if (editor) {
        editor.addEventListener("input", runPreview);
    }
});
