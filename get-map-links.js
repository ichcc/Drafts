/**
 * Get Map Links
 *
 * Takes an address from the draft content and generates links for:
 * - Apple Maps
 * - Google Maps
 * - Waze
 *
 * The links are displayed in a prompt and copied to the clipboard.
 */

try {
    // Get address from draft content (trim whitespace)
    const address = draft.content.trim();

    // Validate that we have an address
    if (!address) {
        app.displayWarningMessage("Draft is empty. Please enter an address.");
        context.fail();
    } else {
        // URL encode the address for use in map URLs
        const encodedAddress = encodeURIComponent(address);

        // Generate map links
        const appleMapLink = `https://maps.apple.com/?q=${encodedAddress}`;
        const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        const wazeLink = `https://waze.com/ul?q=${encodedAddress}`;

        // Format output for clipboard
        const clipboardContent = `Address: ${address}

Apple Maps:
${appleMapLink}

Google Maps:
${googleMapLink}

Waze:
${wazeLink}`;

        // Copy to clipboard
        app.setClipboard(clipboardContent);

        // Create prompt to display links
        const prompt = Prompt.create();
        prompt.title = "Map Links Generated";
        prompt.message = `Links for: ${address}\n\n(Copied to clipboard)`;

        // Add buttons for each map service
        prompt.addButton("Open Apple Maps");
        prompt.addButton("Open Google Maps");
        prompt.addButton("Open Waze");
        prompt.addButton("Done");

        const result = prompt.show();

        if (result) {
            // Open selected map based on button pressed
            const buttonPressed = prompt.buttonPressed;

            if (buttonPressed === "Open Apple Maps") {
                app.openURL(appleMapLink);
            } else if (buttonPressed === "Open Google Maps") {
                app.openURL(googleMapLink);
            } else if (buttonPressed === "Open Waze") {
                app.openURL(wazeLink);
            }
        }

        app.displaySuccessMessage("Map links copied to clipboard!");
        context.succeed();
    }

} catch (error) {
    app.displayErrorMessage("Error: " + error.message);
    context.fail();
}
