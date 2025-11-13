// Pseudo-UED Generator for Drafts
// Generates cyber-mystical 4x4 segment identifiers
// Not real UUIDs — aesthetic, ritualistic, judeo-cyberpunk

var HEX = "0123456789abcdef";

var GLYPHS = [
  "\u2234", "\u2235", "\u2295", "\u2297", "\u2299", "\u229A", "\u229B", "\u229C",
  "\u25C8", "\u25C9", "\u25CA", "\u25CB", "\u25CC", "\u25CD", "\u25CE", "\u25CF",
  "\u25D0", "\u25D1", "\u25D2", "\u25D3", "\u25D4", "\u25D5", "\u25D6", "\u25D7",
  "\u25E2", "\u25E3", "\u25E4", "\u25E5", "\u2630", "\u2631", "\u2632", "\u2633",
  "\u2726", "\u2727", "\u2728", "\u2729", "\u272A", "\u272B", "\u272C", "\u272D"
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function block(chance) {
  var chars = [];
  for (var i = 0; i < 4; i++) {
    if (Math.random() < chance) {
      chars.push(randomChoice(GLYPHS));
    } else {
      chars.push(randomChoice(HEX));
    }
  }
  return chars.join("");
}

function generateUED(chance) {
  return block(chance) + "-" + block(chance) + "-" + block(chance) + "-" + block(chance);
}

var p = Prompt.create();
p.title = "Pseudo UED";
p.message = "Select mysticism level";

p.addButton("Pure Hex");
p.addButton("Low 15%");
p.addButton("Medium 30%");
p.addButton("High 50%");
p.addButton("Max 75%");

if (p.show()) {
  var chance = 0.0;

  if (p.buttonPressed === "Pure Hex") {
    chance = 0.0;
  } else if (p.buttonPressed === "Low 15%") {
    chance = 0.15;
  } else if (p.buttonPressed === "Medium 30%") {
    chance = 0.30;
  } else if (p.buttonPressed === "High 50%") {
    chance = 0.50;
  } else if (p.buttonPressed === "Max 75%") {
    chance = 0.75;
  }

  var ued = generateUED(chance);

  editor.setSelectedText(ued);
  app.setClipboard(ued);
  app.displaySuccessMessage("Generated: " + ued);
} else {
  context.cancel();
}
