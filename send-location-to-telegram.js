try {
    // Get current time
    const now = new Date();
    const timeStr = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    // Get GPS coordinates from Drafts device location
    const lat = draft.processTemplate("[[latitude]]");
    const lon = draft.processTemplate("[[longitude]]");

    if (!lat || !lon || lat === "0" || lon === "0") {
        app.displayErrorMessage("Could not get location. Check location permissions in Settings.");
        context.fail();
    } else {
        // Reverse geocode via OpenStreetMap Nominatim
        const http = HTTP.create();
        const geoResponse = http.request({
            url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            method: "GET",
            headers: { "Accept-Language": "en" }
        });

        let place = `${lat}, ${lon}`;
        if (geoResponse.success) {
            const geo = JSON.parse(geoResponse.responseText);
            const addr = geo.address || {};
            place = [addr.road, addr.city || addr.town || addr.village, addr.country].filter(Boolean).join(", ");
        }

        // Build message
        const mapsLink = `https://maps.apple.com/?q=${lat},${lon}`;
        const message = `\u23F0 ${timeStr}\n\uD83D\uDCCD ${place}\n${mapsLink}`;

        // Open Telegram with pre-filled message
        const encodedMessage = encodeURIComponent(message);
        const telegramURL = `tg://msg?text=${encodedMessage}&to=@kisalu`;

        app.openURL(telegramURL);
        context.succeed();
    }

} catch (error) {
    app.displayErrorMessage("Error: " + error.message);
    context.fail();
}
