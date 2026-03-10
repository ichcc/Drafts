# Drafts Actions

A collection of custom actions for [Drafts](https://getdrafts.com/), the powerful text editor for iOS and macOS.

## About

[Drafts](https://getdrafts.com/) is where text starts on iOS and macOS. This repository contains JavaScript actions that extend Drafts' functionality, enabling automation, publishing, and integration with external services.

## Available Actions

### 📝 Publish to Telegraph

One-click publishing from Drafts to [Telegraph](https://telegra.ph). Converts markdown notes to beautiful web pages instantly.

**Features:**
- Automatic markdown to Telegraph format conversion
- One-time Telegraph account setup
- API token storage in draft notes
- Instant URL copying to clipboard
- Title extraction from first heading

**Supported Markdown:**
- Headers: `#`, `##`, `###`
- Bold: `**text**` or `__text__`
- Italic: `*text*` or `_text_`
- Links: `[text](url)`
- Inline code: `` `code` ``
- Code blocks: ` ```code``` `

[Full Documentation](ACTION-DESCRIPTION.md) | [View Script](publish-to-telegraph.js)

### 🗺️ Get Map Links

Generate map links for any address in Apple Maps, Google Maps, and Waze. Perfect for sharing locations or quickly opening addresses in your preferred navigation app.

**Features:**
- Generates links for all three major map services
- Copies formatted links to clipboard automatically
- Interactive prompt to open any map directly
- Works with any address format

**Usage:**
1. Create a draft with an address (single or multi-line)
2. Run the "Get Map Links" action
3. Links are copied to clipboard
4. Choose to open in Apple Maps, Google Maps, or Waze

[View Script](get-map-links.js)

### 📍 Send Location to Telegram

Instantly share your current location to Telegram with timestamp, place name, and map link. Perfect for quick check-ins or sharing where you are.

**Features:**
- Automatic GPS location capture from device
- Reverse geocoding to human-readable address
- Timestamp with formatted date/time
- Apple Maps link included
- Opens Telegram with pre-filled message

**Usage:**
1. Run the "Send Location to Telegram" action
2. Grant location permissions if prompted
3. Telegram opens with message ready to send
4. Send to your configured recipient

[View Script](send-location-to-telegram.js)

### 🧬 Claude Writing Tool

AI-powered text editing using Anthropic's Claude models. Transform selected text with quick actions or custom instructions, with optional deep thinking mode for complex tasks.

**Features:**
- Multiple quick actions (Fix Grammar, Make Professional, Simplify, Shorten, Expand)
- Translation support (English, Hebrew, Ukrainian)
- Custom instruction mode for any task
- Deep Thinking Mode using Claude Opus with extended thinking
- Four output options: New Draft, Replace, Append, or Clipboard
- API key stored securely in Drafts credentials

**Quick Actions:**
- Fix Grammar
- Make Professional
- Simplify / Shorten / Expand
- Translate to English/Hebrew/Ukrainian
- Custom instructions

**Usage:**
1. Select text in your draft
2. Run the "Claude Writing Tool" action
3. Choose a quick action or enter custom instruction
4. Optional: Enable Deep Thinking Mode for complex analysis
5. Select output destination
6. API key required (enter once, stored securely)

[View Script](claude-tool.js)

### 🤖 OpenAI Writing Tool

AI-powered text editing using OpenAI's GPT models. Same powerful features as Claude tool, with GPT-4o-mini for fast processing and o4-mini for deep reasoning.

**Features:**
- Multiple quick actions (Fix Grammar, Make Professional, Simplify, Shorten, Expand)
- Translation support (English, Hebrew, Ukrainian)
- Custom instruction mode for any task
- Deep Thinking Mode using o4-mini reasoning model
- Four output options: New Draft, Replace, Append, or Clipboard
- API key stored securely in Drafts credentials

**Usage:**
1. Select text in your draft
2. Run the "OpenAI Writing Tool" action
3. Choose a quick action or enter custom instruction
4. Optional: Enable Deep Thinking Mode for complex tasks
5. Select output destination
6. API key required (enter once, stored securely)

[View Script](openai-tool.js)

### ♊️ Gemini Writing Tool

AI-powered text editing using Google's Gemini models. Fast, efficient text processing with Gemini 3 Flash, with optional deep thinking mode for complex analysis.

**Features:**
- Multiple quick actions (Fix Grammar, Make Professional, Simplify, Shorten, Expand)
- Translation support (English, Hebrew, Ukrainian)
- Custom instruction mode for any task
- Deep Thinking Mode with configurable thinking budget
- Four output options: New Draft, Replace, Append, or Clipboard
- API key stored securely in Drafts credentials

**Usage:**
1. Select text in your draft
2. Run the "Gemini Writing Tool" action
3. Choose a quick action or enter custom instruction
4. Optional: Enable Deep Thinking Mode for complex analysis
5. Select output destination
6. API key required (enter once, stored securely)

[View Script](gemini-tool.js)

## Installation

### Method 1: Manual Installation

1. Open Drafts app on your device
2. Create a new Action (tap `+` in Actions list)
3. Add a "Script" step
4. Copy the contents of the desired `.js` file from this repository
5. Paste into the Script step
6. Name your action and save

### Method 2: Action Directory (Coming Soon)

Actions may be published to the [Drafts Action Directory](https://directory.getdrafts.com/) for one-tap installation.

## Usage

Each action includes inline documentation explaining:
- What it does
- Required setup (if any)
- Supported features
- Example usage

Simply run the action on any draft to see it in action!

## Development

### Prerequisites

- [Drafts](https://getdrafts.com/) (Pro subscription required for custom actions)
- Basic JavaScript knowledge
- Familiarity with [Drafts Scripting Reference](https://scripting.getdrafts.com/)

### Project Structure

```
.
├── README.md                      # This file
├── CLAUDE.md                      # Development guidelines
├── ACTION-DESCRIPTION.md          # Detailed action documentation
├── publish-to-telegraph.js        # Telegraph publishing action
├── get-map-links.js               # Map links generator action
├── send-location-to-telegram.js   # Telegram location sharing action
├── claude-tool.js                 # Claude AI writing tool
├── openai-tool.js                 # OpenAI writing tool
├── gemini-tool.js                 # Google Gemini writing tool
├── test-markdown.md               # Test content for actions
└── .gitignore                     # Git ignore rules
```

### Testing Actions

Actions must be tested within the Drafts app:

1. Create a test draft with sample content
2. Install the action (see Installation above)
3. Run the action on your test draft
4. Verify expected behavior

There is no local testing environment - actions execute in Drafts' sandboxed JavaScript runtime.

### Contributing

Contributions are welcome! If you've created a useful Drafts action:

1. Fork this repository
2. Add your action script with inline documentation
3. Update this README with your action details
4. Submit a pull request

**Guidelines:**
- Include clear comments explaining what the action does
- Follow the existing code style
- Test thoroughly before submitting
- Add usage examples in comments

## Resources

- [Drafts Website](https://getdrafts.com/)
- [Drafts Documentation](https://docs.getdrafts.com/)
- [Drafts Scripting Reference](https://scripting.getdrafts.com/)
- [Drafts Action Directory](https://directory.getdrafts.com/)
- [Drafts Community Forum](https://forums.getdrafts.com/)

## License

These actions are provided as-is for use with Drafts. Feel free to modify and adapt them for your needs.

## Author

Created by [@ichcc](https://github.com/ichcc)

---

**Note:** Drafts is required to use these actions. Some actions may require a Drafts Pro subscription or external API accounts.
