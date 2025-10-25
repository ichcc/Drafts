# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains custom Drafts actions and automation scripts for the Drafts app (https://getdrafts.com/). Drafts is a text editor for iOS and macOS that allows users to create custom actions using JavaScript.

**Main Documentation**: https://docs.getdrafts.com/
**Script Reference**: https://scripting.getdrafts.com/

## Drafts Action Development

### File Structure
- Action scripts are JavaScript files (`.js`) that execute within the Drafts app environment
- Each file represents a complete action that can be installed in Drafts
- Actions are not traditional Node.js scripts - they run in Drafts' sandboxed JavaScript environment

### Drafts Scripting Environment

Actions have access to special global objects provided by Drafts:

**Core Objects**:
- `draft` - The current draft document (content, metadata)
- `app` - Application-level functionality (display messages, clipboard)
- `editor` - Text editing operations
- `context` - Script execution context (`.succeed()`, `.fail()`)
- `action` - Currently executing action

**Common Utilities**:
- `HTTP.create()` - Make HTTP requests
- `alert()` - Display user prompts
- `FileManager` - File system operations

### Action Script Pattern

All action scripts follow this general pattern:

```javascript
try {
    // 1. Get draft content
    const content = draft.content;

    // 2. Process content or call external APIs
    // Use HTTP.create() for API calls

    // 3. Display feedback to user
    app.displaySuccessMessage("Done!");
    // or app.displayErrorMessage("Failed!")

    // 4. Signal completion
    context.succeed();
    // or context.fail();

} catch (error) {
    app.displayErrorMessage("Error: " + error.message);
    context.fail();
}
```

### Draft Template Tags

Drafts provides template tags for accessing draft metadata:
- `draft.getTemplateTag("custom_notes")` - Get custom notes
- `draft.setTemplateTag("custom_notes", value)` - Set custom notes
- Call `draft.update()` after modifying draft properties

### Testing Actions

**Testing in Drafts**:
1. Create a `.js` file with your action script
2. In Drafts app, create a new action (requires Drafts Pro)
3. Add a "Script" step and paste the JavaScript code
4. Run the action on a test draft

**Note**: There is no local testing environment - actions must be tested within the Drafts app itself.

## Development Notes

- **No npm/package.json**: Actions don't use npm dependencies; they rely on Drafts' built-in APIs
- **No build process**: Scripts are plain JavaScript, executed directly by Drafts
- **API integrations**: Use `HTTP.create()` for external API calls
- **Error handling**: Always wrap in try/catch and use `app.displayErrorMessage()` for user feedback
- **State persistence**: Use draft template tags or custom notes to persist state between runs
