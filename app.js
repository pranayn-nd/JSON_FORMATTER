const input = document.getElementById("input");
const output = document.getElementById("output");
const statusDiv = document.getElementById("status");
const inputHighlight = document.getElementById("input-highlight");
// Live formatting while typing
input.addEventListener("input", () => {
  updateInputHighlight();
  tryFormat();
});

function tryFormat() {
  const value = input.value.trim();

  if (!value) {
    output.innerHTML = "";
    statusDiv.textContent = "";
    return;
  }

  try {
    const parsed = JSON.parse(value);
    const formatted = JSON.stringify(parsed, null, 2);
    output.innerHTML = syntaxHighlight(formatted);

    statusDiv.textContent = "Valid JSON ✓";
    statusDiv.style.color = "#22c55e";
  } catch (error) {
    output.innerHTML = "";
    statusDiv.textContent = extractErrorLine(error.message);
    statusDiv.style.color = "#ef4444";
  }
}

function formatJSON() {
  tryFormat();
}

function minifyJSON() {
  try {
    const parsed = JSON.parse(input.value);
    const minified = JSON.stringify(parsed);
    output.innerHTML = syntaxHighlight(minified);

    statusDiv.textContent = "Minified ✓";
    statusDiv.style.color = "#22c55e";
  } catch (error) {
    statusDiv.textContent = extractErrorLine(error.message);
    statusDiv.style.color = "#ef4444";
  }
}

function clearAll() {
  input.value = "";
  inputHighlight.innerHTML = "";
  output.innerHTML = "";
  statusDiv.textContent = "";
}

function copyOutput() {
  if (!output.innerText) return;

  navigator.clipboard.writeText(output.innerText);
  statusDiv.textContent = "Copied to clipboard ✓";
  statusDiv.style.color = "#3b82f6";
}

function extractErrorLine(message) {
  const match = message.match(/position (\d+)/);

  if (!match) return message;

  const position = parseInt(match[1]);
  const textUntilError = input.value.slice(0, position);
  const line = textUntilError.split("\n").length;

  return `Invalid JSON at line ${line}`;
}
// Theme toggle logic
function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Load saved theme on page load
(function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
})();

function syntaxHighlight(json) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(true|false|null)\b|-?\d+(\.\d*)?([eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "json-number";

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "json-key";
        } else {
          cls = "json-string";
        }
      } else if (/true|false/.test(match)) {
        cls = "json-boolean";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }

      return `<span class="${cls}">${match}</span>`;
    }
  );
}
function updateInputHighlight() {
  const value = input.value;

  if (!value) {
    inputHighlight.innerHTML = "";
    return;
  }

  inputHighlight.innerHTML = syntaxHighlight(value);
}