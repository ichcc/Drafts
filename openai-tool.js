// 1. Get context
const selection = editor.getSelectedText();
const [st, len] = editor.getSelectedRange();

if (!selection || selection.trim().length === 0) {
    app.displayErrorMessage("Select text first, Bro.");
    context.fail();
}

// Store original draft for linking
const originalDraft = draft;

// 2. Auth (using standard Drafts credentialing)
const credential = Credential.create("OpenAI", "Enter your OpenAI API key");
credential.addPasswordField("apiKey", "API Key");
credential.authorize();
const apiKey = credential.getValue("apiKey");

if (!apiKey) {
    app.displayErrorMessage("No API key configured");
    context.fail();
}

// 3. The Menu
let f = () => {
    let p = new Prompt();
    p.title = "🤖 OpenAI Writing Tool";
    p.message = `Selected: ${selection.length} chars`;

    // Quick actions dropdown
    p.addSelect("quickAction", "Quick Action",
        [
            "Custom (use text below)",
            "Fix Grammar",
            "Make Professional",
            "Simplify",
            "Shorten",
            "Expand",
            "Translate to English",
            "Translate to Hebrew",
            "Translate to Ukrainian"
        ],
        ["Custom (use text below)"],
        false
    );

    // Custom instruction
    p.addTextView("instruction", "Custom Instruction", "", {
        "placeholder": "e.g., 'Make it funny', 'Add emojis', 'Technical tone'"
    });

    // Separator
    p.addLabel("label1", "─────────────");

    // Thinking mode toggle
    p.addSwitch("thinking", "🧠 Deep Thinking Mode", false);
    p.addLabel("thinkingLabel", "Uses o4-mini for complex analysis (slower)");

    // Output options (New Draft is default)
    p.addSelect("result", "Output",
        ["New Draft", "Replace", "Append", "Clipboard"],
        ["New Draft"],
        false
    );

    // Single process button
    p.addButton("Process");

    if (!p.show()) return false;

    // Get selected quick action
    const quickAction = String(p.fieldValues["quickAction"]);
    const customInstruction = p.fieldValues["instruction"]?.trim();
    const thinkingMode = p.fieldValues["thinking"];

    // Map quick actions to instructions
    const actionInstructions = {
        "Fix Grammar": "Fix all grammar, spelling, and punctuation errors. Maintain the original tone and style.",
        "Make Professional": "Rewrite in a professional, formal tone suitable for business communication.",
        "Simplify": "Simplify the language. Use shorter sentences and simpler words while keeping the same meaning.",
        "Shorten": "Make this more concise. Remove unnecessary words while keeping all key information.",
        "Expand": "Expand this text with more detail and explanation while maintaining clarity.",
        "Translate to English": "Translate to English. Keep the original tone and formatting.",
        "Translate to Hebrew": "Translate to Hebrew. Keep the original tone and formatting.",
        "Translate to Ukrainian": "Translate to Ukrainian. Keep the original tone and formatting.",
        "Custom (use text below)": customInstruction
    };

    // Get the final instruction
    const finalInstruction = actionInstructions[quickAction];

    if (!finalInstruction) {
        app.displayWarningMessage("No instruction provided");
        return false;
    }

    // 4. API Request
    const model = thinkingMode ? "o4-mini" : "gpt-4o-mini";
    const url = "https://api.openai.com/v1/chat/completions";

    const requestBody = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are a professional text editor. Your task is to modify text based on instructions. Rules:\n1. Return ONLY the modified text\n2. No markdown code blocks\n3. No explanations or meta-commentary\n4. No conversational filler\n5. Preserve formatting when appropriate (line breaks, paragraphs)\n6. For translations, return only the translated text"
            },
            {
                "role": "user",
                "content": `Instruction: ${finalInstruction}\n\nText to process:\n${selection}`
            }
        ],
        "max_completion_tokens": 2048
    };

    // Only set temperature for non-reasoning models (o-series don't support it)
    if (!thinkingMode) {
        requestBody.temperature = 0.3;
    }

    // Status message
    if (thinkingMode) {
        app.displayInfoMessage("🧠 Deep thinking...");
    } else {
        app.displayInfoMessage("🤖 Processing...");
    }

    let http = HTTP.create();
    const startTime = Date.now();
    let response = http.request({
        "url": url,
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        "data": requestBody
    });
    const latencyMs = Date.now() - startTime;

    if (!response.success) {
        let errorMsg = "API request failed";

        if (response.responseText) {
            try {
                const errorJson = JSON.parse(response.responseText);
                errorMsg = errorJson.error?.message || JSON.stringify(errorJson.error);
            } catch (e) {
                errorMsg = response.responseText.substring(0, 200);
            }
        }

        app.displayErrorMessage(errorMsg);
        context.fail();
        return false;
    }

    // Parse response
    let answer;
    try {
        const jsonResponse = JSON.parse(response.responseText);
        answer = jsonResponse.choices[0].message.content.trim();

        // Log token usage if in thinking mode
        if (thinkingMode && jsonResponse.usage?.completion_tokens_details?.reasoning_tokens) {
            app.displayInfoMessage(`🧠 Used ${jsonResponse.usage.completion_tokens_details.reasoning_tokens} reasoning tokens`);
        }

        // Clean up markdown code blocks if present
        answer = answer.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();

    } catch (e) {
        app.displayErrorMessage("Failed to parse response");
        context.fail();
        return false;
    }

    if (!answer) {
        app.displayErrorMessage("Empty response from OpenAI");
        context.fail();
        return false;
    }

    // 5. Output logic
    const outputAction = String(p.fieldValues["result"]);

    switch(outputAction) {
        case "Replace":
            editor.setSelectedText(answer);
            editor.setSelectedRange(st, answer.length);
            app.displayInfoMessage(`✅ Replaced (${latencyMs}ms)`);
            break;

        case "Append":
            const combined = `${selection}\n\n---\n\n${answer}`;
            editor.setSelectedText(combined);
            editor.setSelectedRange(st, combined.length);
            app.displayInfoMessage(`✅ Appended (${latencyMs}ms)`);
            break;

        case "Clipboard":
            app.setClipboard(answer);
            app.displayInfoMessage(`📋 Copied to clipboard (${latencyMs}ms)`);
            break;

        case "New Draft":
            const newDraft = Draft.create();

            // Add link to original draft at the bottom
            const originalLink = `[original draft](drafts://open?uuid=${originalDraft.uuid})`;
            newDraft.content = `${answer}\n\n---\n\n${originalLink}`;

            // Add OpenAI tag
            newDraft.addTag("🤖");

            newDraft.update();
            editor.load(newDraft);
            app.displayInfoMessage(`📝 Created new draft with link to original (${latencyMs}ms)`);
            break;
    }

    return true;
};

if (!f()) context.fail();
