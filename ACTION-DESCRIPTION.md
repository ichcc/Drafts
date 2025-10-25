# Publish to Telegraph - Drafts Action

## Description

One-click publishing from Drafts to Telegraph (telegra.ph). Converts your markdown notes to beautiful web pages instantly.

## Features

- **Automatic conversion** - Transforms markdown to Telegraph's format
- **One-time setup** - Creates Telegraph account automatically on first run
- **Smart token storage** - Saves API token in draft notes for future updates
- **Instant sharing** - Copies published URL to clipboard
- **Title extraction** - Uses first heading as title, or defaults to "Untitled"
- **Draft tracking** - Appends publication URL to your draft

## Supported Markdown

- Headers: `#`, `##`, `###`
- Bold: `**text**` or `__text__`
- Italic: `*text*` or `_text_`
- Links: `[text](url)`
- Inline code: `` `code` ``
- Code blocks: ` ```code``` `

## Usage

1. Write your content in markdown
2. Run the "Publish to Telegraph" action
3. Published URL is automatically copied to clipboard
4. Share your Telegraph page!

## Installation

1. In Drafts app, create a new Action
2. Add a "Script" step
3. Paste the contents of `publish-to-telegraph.js`
4. Save and run on any markdown draft

## Example

**Input:**
```markdown
# My Blog Post

This is **bold** and this is *italic*.

Check out [my website](https://example.com).
```

**Output:** A Telegraph page with properly formatted content and a shareable URL.

---

*Perfect for quick blog posts, sharing notes, or publishing ideas without the overhead of a full CMS.*
