/**
 * Add Timecode Links
 *
 * Scans the draft for a YouTube URL and timecodes in MM:SS or H:MM:SS format,
 * then converts each timecode into a Markdown link pointing to that timestamp
 * in the video.
 *
 * Example input:
 *   https://www.youtube.com/watch?v=KBPOTklFTiU
 *   Some point (0:00-0:11).
 *
 * Example output:
 *   https://www.youtube.com/watch?v=KBPOTklFTiU
 *   Some point ([0:00](https://www.youtube.com/watch?v=KBPOTklFTiU&t=0)-[0:11](...&t=11)).
 */

try {
    const content = draft.content;

    // Find YouTube video ID
    const ytMatch = content.match(
        /https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:[^#\s]*&)?v=([a-zA-Z0-9_-]{11})/
    );

    if (!ytMatch) {
        app.displayErrorMessage("No YouTube URL found in draft.");
        context.fail();
        return;
    }

    const videoId = ytMatch[1];
    const baseUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Convert a timecode string (e.g. "1:52" or "1:02:34") to total seconds
    function timecodeToSeconds(tc) {
        const parts = tc.split(":").map(Number);
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        return parts[0] * 60 + parts[1];
    }

    // Replace every bare timecode with a Markdown link
    // Matches timecodes like 0:00, 1:52, 23:18, 1:02:34
    // but skips ones already inside a Markdown link: [...](...)
    const newContent = content.replace(
        /(?<!\]\()(?<!\[)\b(\d{1,2}:\d{2}(?::\d{2})?)\b(?!\))/g,
        (match, tc) => {
            const seconds = timecodeToSeconds(tc);
            return `[${tc}](${baseUrl}&t=${seconds})`;
        }
    );

    if (newContent === content) {
        app.displayWarningMessage("No timecodes found to linkify.");
        context.succeed();
        return;
    }

    draft.content = newContent;
    draft.update();

    app.displaySuccessMessage("Timecode links added!");
    context.succeed();

} catch (error) {
    app.displayErrorMessage("Error: " + error.message);
    context.fail();
}
