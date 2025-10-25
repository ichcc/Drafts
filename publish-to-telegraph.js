// Drafts.app Action: Publish to Telegraph
//
// Publishes markdown content to telegra.ph and copies the URL to clipboard.
//
// Features:
// - Converts markdown (headers, bold, italic, links, code) to Telegraph format
// - Creates Telegraph account automatically on first run
// - Stores API token in draft notes for future updates
// - Extracts title from first heading or uses "Untitled"
// - Copies published URL to clipboard
// - Appends publication URL to the draft
//
// Supported markdown:
// - Headers: #, ##, ###
// - Bold: **text** or __text__
// - Italic: *text* or _text_
// - Links: [text](url)
// - Inline code: `code`
// - Code blocks: ```code```
//
// Usage: Run action on any draft with markdown content

// Helper function to convert markdown to Telegraph Node format
function markdownToNodes(markdown) {
    const nodes = [];
    const lines = markdown.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Skip empty lines
        if (line.trim() === '') {
            i++;
            continue;
        }

        // Code blocks
        if (line.trim().startsWith('```')) {
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            if (codeLines.length > 0) {
                nodes.push({
                    tag: 'pre',
                    children: [codeLines.join('\n')]
                });
            }
            i++;
            continue;
        }

        // Headers
        const h3Match = line.match(/^### (.+)$/);
        const h2Match = line.match(/^## (.+)$/);
        const h1Match = line.match(/^# (.+)$/);

        if (h3Match) {
            nodes.push({tag: 'h4', children: parseInlineMarkdown(h3Match[1])});
            i++;
            continue;
        }
        if (h2Match) {
            nodes.push({tag: 'h3', children: parseInlineMarkdown(h2Match[1])});
            i++;
            continue;
        }
        if (h1Match) {
            nodes.push({tag: 'h3', children: parseInlineMarkdown(h1Match[1])});
            i++;
            continue;
        }

        // Collect paragraph lines
        const paraLines = [];
        while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^#{1,3} /) && !lines[i].trim().startsWith('```')) {
            paraLines.push(lines[i]);
            i++;
        }

        if (paraLines.length > 0) {
            const paraText = paraLines.join('\n');
            nodes.push({
                tag: 'p',
                children: parseInlineMarkdown(paraText)
            });
        }
    }

    return nodes;
}

// Helper function to parse inline markdown (bold, italic, links, code)
function parseInlineMarkdown(text) {
    const nodes = [];
    let i = 0;

    while (i < text.length) {
        // Try to match bold **text**
        if (text.substr(i, 2) === '**') {
            const closeIndex = text.indexOf('**', i + 2);
            if (closeIndex !== -1) {
                nodes.push({tag: 'strong', children: [text.substring(i + 2, closeIndex)]});
                i = closeIndex + 2;
                continue;
            }
        }

        // Try to match bold __text__
        if (text.substr(i, 2) === '__') {
            const closeIndex = text.indexOf('__', i + 2);
            if (closeIndex !== -1) {
                nodes.push({tag: 'strong', children: [text.substring(i + 2, closeIndex)]});
                i = closeIndex + 2;
                continue;
            }
        }

        // Try to match italic *text* (but not **)
        if (text[i] === '*' && text[i + 1] !== '*') {
            const closeIndex = text.indexOf('*', i + 1);
            if (closeIndex !== -1 && text[closeIndex + 1] !== '*') {
                nodes.push({tag: 'em', children: [text.substring(i + 1, closeIndex)]});
                i = closeIndex + 1;
                continue;
            }
        }

        // Try to match italic _text_ (but not __)
        if (text[i] === '_' && text[i + 1] !== '_') {
            const closeIndex = text.indexOf('_', i + 1);
            if (closeIndex !== -1 && text[closeIndex + 1] !== '_') {
                nodes.push({tag: 'em', children: [text.substring(i + 1, closeIndex)]});
                i = closeIndex + 1;
                continue;
            }
        }

        // Try to match inline code `text`
        if (text[i] === '`') {
            const closeIndex = text.indexOf('`', i + 1);
            if (closeIndex !== -1) {
                nodes.push({tag: 'code', children: [text.substring(i + 1, closeIndex)]});
                i = closeIndex + 1;
                continue;
            }
        }

        // Try to match links [text](url)
        if (text[i] === '[') {
            const closeBracket = text.indexOf(']', i + 1);
            if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
                const closeParen = text.indexOf(')', closeBracket + 2);
                if (closeParen !== -1) {
                    const linkText = text.substring(i + 1, closeBracket);
                    const linkUrl = text.substring(closeBracket + 2, closeParen);
                    nodes.push({
                        tag: 'a',
                        attrs: {href: linkUrl},
                        children: [linkText]
                    });
                    i = closeParen + 1;
                    continue;
                }
            }
        }

        // Try to match line breaks
        if (text[i] === '\n') {
            nodes.push({tag: 'br'});
            i++;
            continue;
        }

        // Regular text - collect until next special character
        let textStart = i;
        while (i < text.length &&
               text[i] !== '*' &&
               text[i] !== '_' &&
               text[i] !== '`' &&
               text[i] !== '[' &&
               text[i] !== '\n') {
            i++;
        }

        if (i > textStart) {
            nodes.push(text.substring(textStart, i));
        }
    }

    return nodes.length > 0 ? nodes : [''];
}

// Helper function to create Telegraph account
function createTelegraphAccount() {
    const http = HTTP.create();

    const response = http.request({
        "url": "https://api.telegra.ph/createAccount",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": {
            "short_name": "Drafts",
            "author_name": "Drafts User"
        }
    });

    if (response.success) {
        const result = JSON.parse(response.responseText);
        if (result.ok) {
            return result.result.access_token;
        }
    }

    return null;
}

// Helper function to publish to Telegraph
function publishToTelegraph(token, title, content) {
    const http = HTTP.create();

    const response = http.request({
        "url": "https://api.telegra.ph/createPage",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": {
            "access_token": token,
            "title": title || "Untitled",
            "content": content,
            "return_content": false
        }
    });

    if (response.success) {
        const result = JSON.parse(response.responseText);
        if (result.ok) {
            return "https://telegra.ph/" + result.result.path;
        } else {
            // Log error from Telegraph API
            app.displayErrorMessage("Telegraph API error: " + (result.error || "Unknown error"));
        }
    } else {
        app.displayErrorMessage("HTTP request failed: " + response.statusCode);
    }

    return null;
}

// Main execution function
function main() {
    // Get draft content
    const content = draft.content;

    if (!content || content.trim().length === 0) {
        app.displayErrorMessage("Draft is empty");
        return false;
    }

    // Extract title from first line or use default
    const lines = content.split('\n');
    let title = "Untitled";
    let bodyContent = content;

    // Check if first line is a header
    if (lines[0].match(/^#+ /)) {
        title = lines[0].replace(/^#+ /, '').trim();
        bodyContent = lines.slice(1).join('\n').trim();
    }

    // Check if we already have a token in draft notes
    let token = null;
    const notes = draft.getTemplateTag("custom_notes") || "";
    const tokenMatch = notes.match(/telegraph_token:\s*([a-f0-9]+)/);

    if (tokenMatch) {
        token = tokenMatch[1];
    }

    // Create new token if we don't have one
    if (!token) {
        app.displayInfoMessage("Creating new Telegraph account...");
        token = createTelegraphAccount();

        if (!token) {
            app.displayErrorMessage("Failed to create Telegraph account");
            return false;
        }

        // Store token in draft notes
        const newNotes = notes + (notes ? "\n" : "") + "telegraph_token: " + token;
        draft.setTemplateTag("custom_notes", newNotes);
        draft.update();
    }

    // Convert markdown to Telegraph Node format
    const nodeContent = markdownToNodes(bodyContent);

    // Debug: Show converted content (uncomment to debug)
    // app.displayInfoMessage("DEBUG:\n" + JSON.stringify(nodeContent, null, 2));
    // return false;

    // Publish to Telegraph
    app.displayInfoMessage("Publishing to Telegraph...");
    const url = publishToTelegraph(token, title, nodeContent);

    if (!url) {
        app.displayErrorMessage("Failed to publish to Telegraph");
        return false;
    }

    // Success! Copy link to clipboard and show message
    app.setClipboard(url);
    app.displaySuccessMessage("Published! Link copied to clipboard:\n" + url);

    // Optionally append link to draft
    draft.content = draft.content + "\n\nPublished: " + url;
    draft.update();

    return true;
}

// Run main function
try {
    main();
} catch (error) {
    app.displayErrorMessage("Error: " + error.message);
}
