
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");

  if (!toggle) return;

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("studentVoiceTheme");
  } catch (error) {
    console.warn("Theme preference storage is unavailable.");
  }

  const initialTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : "light";

  function applyTheme(theme) {
    root.dataset.theme = theme;

    const isDark = theme === "dark";

    if (icon) {
      icon.textContent = isDark ? "☀" : "☾";
    }

    if (label) {
      label.textContent = isDark ? "Light mode" : "Dark mode";
    }

    toggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    toggle.setAttribute("aria-pressed", String(isDark));

    try {
      localStorage.setItem("studentVoiceTheme", theme);
    } catch (error) {
      // Theme still works for the current page.
    }
  }

  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const nextTheme =
      root.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
  });
})();
