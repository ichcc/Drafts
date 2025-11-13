// Pseudo-UED Generator for Drafts
// Generates cyber-mystical 4x4 segment identifiers
// Not real UUIDs — aesthetic, ritualistic, judeo-cyberpunk

const HEX = '0123456789abcdef';

// Cyber-mystical Unicode glyphs
const GLYPHS = [
  '∴', '∵', '⊕', '⊗', '⊙', '⊚', '⊛', '⊜', '⊝', '⊞', '⊟', '⊠', '⊡',
  '◈', '◉', '◊', '○', '◌', '◍', '◎', '●', '◐', '◑', '◒', '◓', '◔', '◕',
  '◖', '◗', '◘', '◙', '◚', '◛', '◜', '◝', '◞', '◟', '◠', '◡', '◢', '◣',
  '◤', '◥', '◦', '◧', '◨', '◩', '◪', '◫', '◬', '◭', '◮', '◯', '☰', '☱',
  '☲', '☳', '☴', '☵', '☶', '☷', '✦', '✧', '✨', '✩', '✪', '✫', '✬', '✭'
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function block(unicodeChance = 0.15) {
  let chars = [];
  for (let i = 0; i < 4; i++) {
    if (Math.random() < unicodeChance) {
      chars.push(randomChoice(GLYPHS));
    } else {
      chars.push(randomChoice(HEX));
    }
  }
  return chars.join('');
}

function generateUED(unicodeChance = 0.15) {
  return `${block(unicodeChance)}-${block(unicodeChance)}-${block(unicodeChance)}-${block(unicodeChance)}`;
}

// Prompt user for mysticism level
const prompt = Prompt.create();
prompt.title = "Pseudo-UED Generator";
prompt.message = "Select mysticism level:";

prompt.addButton("Pure Hex (0%)");
prompt.addButton("Low (15%)");
prompt.addButton("Medium (30%)");
prompt.addButton("High (50%)");
prompt.addButton("Maximum (75%)");

if (prompt.show()) {
  let unicodeChance = 0.0;

  switch (prompt.buttonPressed) {
    case "Pure Hex (0%)":
      unicodeChance = 0.0;
      break;
    case "Low (15%)":
      unicodeChance = 0.15;
      break;
    case "Medium (30%)":
      unicodeChance = 0.30;
      break;
    case "High (50%)":
      unicodeChance = 0.50;
      break;
    case "Maximum (75%)":
      unicodeChance = 0.75;
      break;
  }

  // Generate the UED
  const ued = generateUED(unicodeChance);

  // Insert at cursor or append to draft
  const selection = editor.getSelectedRange();
  editor.setSelectedText(ued);

  // Optional: Also copy to clipboard
  app.setClipboard(ued);

  // Success message
  app.displaySuccessMessage(`Generated: ${ued}`);
} else {
  context.cancel();
}
