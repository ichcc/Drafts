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
