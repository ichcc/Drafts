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
const credential = Credential.create(
  "Anthropic",
  "Enter your Anthropic API key",
);
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
  p.title = "🧬 Claude Writing Tool";
  p.message = `Selected: ${selection.length} chars`;

  // Quick actions dropdown
  p.addSelect(
    "quickAction",
    "Quick Action",
    [
      "Custom (use text below)",
      "Fix Grammar",
      "Make Professional",
      "Simplify",
      "Shorten",
      "Expand",
      "Translate to English",
      "Translate to Hebrew",
      "Translate to Ukrainian",
    ],
    ["Custom (use text below)"],
    false,
  );

  // Custom instruction
  p.addTextView("instruction", "Custom Instruction", "", {
    placeholder: "e.g., 'Make it funny', 'Add emojis', 'Technical tone'",
  });

  // Separator
  p.addLabel("label1", "─────────────");

  // Thinking mode toggle
  p.addSwitch("thinking", "🧠 Deep Thinking Mode", false);
  p.addLabel(
    "thinkingLabel",
    "Uses Claude Opus with extended thinking (slower, smarter)",
  );

  // Output options (New Draft is default)
  p.addSelect(
    "result",
    "Output",
    ["New Draft", "Replace", "Append", "Clipboard"],
    ["New Draft"],
    false,
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
    "Fix Grammar":
      "Fix all grammar, spelling, and punctuation errors. Maintain the original tone and style.",
    "Make Professional":
      "Rewrite in a professional, formal tone suitable for business communication.",
    Simplify:
      "Simplify the language. Use shorter sentences and simpler words while keeping the same meaning.",
    Shorten:
      "Make this more concise. Remove unnecessary words while keeping all key information.",
    Expand:
      "Expand this text with more detail and explanation while maintaining clarity.",
    "Translate to English":
      "Translate to English. Keep the original tone and formatting.",
    "Translate to Hebrew":
      "Translate to Hebrew. Keep the original tone and formatting.",
    "Translate to Ukrainian":
      "Translate to Ukrainian. Keep the original tone and formatting.",
    "Custom (use text below)": customInstruction,
  };

  // Get the final instruction
  const finalInstruction = actionInstructions[quickAction];

  if (!finalInstruction) {
    app.displayWarningMessage("No instruction provided");
    return false;
  }

  // 4. API Request
  const model = thinkingMode
    ? "claude-opus-4-5-20251101"
    : "claude-sonnet-4-20250514";
  const url = "https://api.anthropic.com/v1/messages";
  const maxTokens = thinkingMode ? 16000 : 4096;

  const systemPrompt =
    "You are a professional text editor. Your task is to modify text based on instructions. Rules:\n1. Return ONLY the modified text\n2. No markdown code blocks\n3. No explanations or meta-commentary\n4. No conversational filler\n5. Preserve formatting when appropriate (line breaks, paragraphs)\n6. For translations, return only the translated text";

  const requestBody = {
    model: model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Instruction: ${finalInstruction}\n\nText to process:\n${selection}`,
      },
    ],
  };

  // Enable extended thinking for Opus
  if (thinkingMode) {
    requestBody.thinking = {
      type: "enabled",
      budget_tokens: 10000,
    };
  }

  // Status message
  if (thinkingMode) {
    app.displayInfoMessage("🧠 Opus is thinking deeply...");
  } else {
    app.displayInfoMessage("🧬 Sonnet processing...");
  }

  let http = HTTP.create();
  const startTime = Date.now();
  let response = http.request({
    url: url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    data: requestBody,
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

    // Claude returns content as an array of blocks
    // With thinking enabled, there will be thinking blocks and text blocks
    const textBlocks = jsonResponse.content.filter((b) => b.type === "text");
    answer = textBlocks
      .map((b) => b.text)
      .join("")
      .trim();

    // Log thinking usage if in thinking mode
    if (thinkingMode) {
      const thinkingBlocks = jsonResponse.content.filter(
        (b) => b.type === "thinking",
      );
      const thinkingChars = thinkingBlocks.reduce(
        (sum, b) => sum + (b.thinking?.length || 0),
        0,
      );
      if (thinkingChars > 0) {
        app.displayInfoMessage(`🧠 Opus thought ${thinkingChars} chars`);
      }
    }

    // Clean up markdown code blocks if present
    answer = answer
      .replace(/^```[\w]*\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
  } catch (e) {
    app.displayErrorMessage("Failed to parse response: " + e.message);
    context.fail();
    return false;
  }

  if (!answer) {
    app.displayErrorMessage("Empty response from Claude");
    context.fail();
    return false;
  }

  // 5. Output logic
  const outputAction = String(p.fieldValues["result"]);

  switch (outputAction) {
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

      // Add tags
      newDraft.addTag("🧬");
      newDraft.addTag(thinkingMode ? "opus" : "sonnet");

      newDraft.update();
      editor.load(newDraft);
      app.displayInfoMessage(`📝 New draft created (${latencyMs}ms)`);
      break;
  }

  return true;
};

if (!f()) context.fail();
