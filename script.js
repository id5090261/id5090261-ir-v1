const THEME_KEY = "preferred-theme";
const tabLabels = [
  "Professional links",
  "Social links",
  "Video links",
  "Contact links",
  "Support links",
];

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage can be unavailable in private or restricted browsing modes.
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.querySelector("#theme-toggle");
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const contents = Array.from(document.querySelectorAll(".content"));

  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches;
  const initialTheme = getStoredTheme() || (prefersLight ? "light" : "dark");

  const setTheme = (theme, shouldStore = false) => {
    const isLight = theme === "light";

    body.dataset.theme = isLight ? "light" : "dark";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode",
    );

    if (shouldStore) {
      storeTheme(body.dataset.theme);
    }
  };

  themeToggle.addEventListener("click", () => {
    const nextTheme = body.dataset.theme === "light" ? "dark" : "light";
    setTheme(nextTheme, true);
  });

  const showContent = (selectedIndex) => {
    contents.forEach((content, index) => {
      const isActive = index === selectedIndex;

      content.classList.toggle("active", isActive);
      content.hidden = !isActive;
      tabs[index]?.classList.toggle("active", isActive);
      tabs[index]?.setAttribute("aria-selected", String(isActive));
      tabs[index]?.setAttribute("tabindex", isActive ? "0" : "-1");
    });
  };

  tabs.forEach((tab, index) => {
    const content = contents[index];

    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-label", tabLabels[index] || "Links");
    tab.setAttribute("aria-selected", "false");

    if (!content) {
      tab.classList.add("disabled");
      tab.setAttribute("aria-disabled", "true");
      tab.setAttribute("tabindex", "-1");
      return;
    }

    const tabId = `link-tab-${index + 1}`;
    tab.id = tabId;
    tab.setAttribute("aria-controls", content.id);

    content.setAttribute("role", "tabpanel");
    content.setAttribute("aria-labelledby", tabId);

    tab.addEventListener("click", () => showContent(index));
    tab.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showContent(index);
        return;
      }

      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const enabledTabs = tabs.filter((item, itemIndex) => contents[itemIndex]);
      const nextIndex =
        (enabledTabs.indexOf(tab) + direction + enabledTabs.length) %
        enabledTabs.length;

      enabledTabs[nextIndex].focus();
    });
  });

  document.querySelectorAll(".disabled a").forEach((link) => {
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("tabindex", "-1");
    link.addEventListener("click", (event) => event.preventDefault());
  });

  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  setTheme(initialTheme);
  showContent(0);
});
