// Base64 decoder (atob is not available in Drafts JS runtime)
function b64decode(str) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let i = 0;
  str = str.replace(/[^A-Za-z0-9+/]/g, "");
  while (i < str.length) {
    const a = chars.indexOf(str[i++]);
    const b = chars.indexOf(str[i++]);
    const c = chars.indexOf(str[i++]);
    const d = chars.indexOf(str[i++]);
    result += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== -1) result += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d !== -1) result += String.fromCharCode(((c & 3) << 6) | d);
  }
  // Handle UTF-8 encoded characters
  try {
    return decodeURIComponent(result.split("").map(c => {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  } catch {
    return result;
  }
}

const SERVICE_ICONS = {
  "music.apple.com": "🍎",
  "geo.music.apple.com": "🍎",
  "open.spotify.com": "🟢",
  "youtu.be": "▶️",
  "music.youtube.com": "🎵",
  "youtube.com": "▶️",
  "tidal.com": "🔴",
  "deezer.com": "🟠",
  "soundcloud.com": "☁️",
  "music.amazon.com": "📦",
};

const SERVICE_NAMES = {
  "music.apple.com": "Apple Music",
  "geo.music.apple.com": "Apple Music",
  "open.spotify.com": "Spotify",
  "youtu.be": "YouTube",
  "music.youtube.com": "YouTube Music",
  "youtube.com": "YouTube",
  "tidal.com": "TIDAL",
  "deezer.com": "Deezer",
  "soundcloud.com": "SoundCloud",
  "music.amazon.com": "Amazon Music",
};

// Domains to exclude from output
const SKIP_DOMAINS = ["tiktok.com", "vt.tiktok.com", "adnxs.com", "facebook.net"];

function getDomain(urlStr) {
  try {
    return new URL(urlStr).hostname.replace(/^www\./, "");
  } catch { return ""; }
}

// Extract URL from current draft
const text = draft.content.trim();
const urlMatch = text.match(/https?:\/\/[^\s]+/);
if (!urlMatch) { app.displayErrorMessage("No URL found"); context.fail(); }

const url = urlMatch[0];
const http = HTTP.create();
const response = http.request({ url, method: "GET" });
if (!response.success) { app.displayErrorMessage("Failed to fetch"); context.fail(); }

const html = response.responseText;

// Extract page title from og:title meta tag
const ogTitleMatch = html.match(/property="og:title"[^>]+content="([^"]+)"/i)
  || html.match(/content="([^"]+)"[^>]+property="og:title"/i);
const mainTitle = ogTitleMatch ? ogTitleMatch[1] : "";

// Parse all cd= base64 params and extract destination URLs
const cdMatches = [...html.matchAll(/cd=([A-Za-z0-9+/=_-]+)/g)];
const links = {};
const ORDER = ["apple", "spotify", "youtube", "youtubemusic", "tidal", "deezer", "soundcloud", "amazon"];

for (const match of cdMatches) {
  try {
    const json = JSON.parse(b64decode(match[1]));
    const destUrl = json?.destUrl;
    const srvc = json?.srvc;
    if (!destUrl || !srvc || destUrl.startsWith("upc:")) continue;
    const domain = getDomain(destUrl);
    if (SKIP_DOMAINS.some(d => domain.includes(d))) continue;
    // Keep only first occurrence per service
    if (!links[srvc]) links[srvc] = destUrl;
  } catch { continue; }
}

// Build markdown output
const lines = [`🎵 ${mainTitle || url}`, ""];

// Output services in preferred order first
for (const srvc of ORDER) {
  if (!links[srvc]) continue;
  const domain = getDomain(links[srvc]);
  const icon = SERVICE_ICONS[domain] || "🔗";
  const name = SERVICE_NAMES[domain] || srvc;
  lines.push(`${icon} [${name}](${links[srvc]})`);
}

// Then any remaining services not in ORDER
for (const [srvc, destUrl] of Object.entries(links)) {
  if (ORDER.includes(srvc)) continue;
  const domain = getDomain(destUrl);
  const icon = SERVICE_ICONS[domain] || "🔗";
  const name = SERVICE_NAMES[domain] || srvc;
  lines.push(`${icon} [${name}](${destUrl})`);
}

lines.push("", `🔗 ${url.replace(/^https?:\/\//, "")}`);
draft.content = lines.join("\n");
draft.update();
