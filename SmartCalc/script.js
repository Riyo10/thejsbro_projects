const display = document.getElementById("display");
const historyContainer = document.getElementById("history");

// Append numbers/operators
function append(value) {
  display.value += value;
}

// Append functions like sqrt, sin, cos, log
function appendFunction(fn) {
  const functionsMap = {
    sqrt: "Math.sqrt",
    sin: "Math.sin",
    cos: "Math.cos",
    log: "Math.log10"
  };

  const mappedFn = functionsMap[fn] || fn;
  display.value += `${mappedFn}(`;
}

// Clear display
function clearDisplay() {
  display.value = "";
}

// Evaluate and calculate the result
function calculate() {
  try {
    const result = Function('"use strict";return (' + display.value + ')')();
    addToHistory(display.value + " = " + result);
    display.value = result;
  } catch (e) {
    display.value = "Error";
  }
}

// Add result to history
function addToHistory(entry) {
  const div = document.createElement("div");
  div.textContent = entry;
  historyContainer.prepend(div);
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle("dark");

  const isDark = html.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Load theme from localStorage
(function initTheme() {
  const savedTheme = localStorage.getItem("Theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
})();