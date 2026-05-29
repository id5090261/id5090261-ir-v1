const tabLabels = [
  "Professional links",
  "Social links",
  "Video links",
  "Contact links",
  "Support links",
];

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.querySelector("#DarkModeToggle");
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const contents = Array.from(document.querySelectorAll(".content"));

  const updateThemeToggle = () => {
    const isLight = body.classList.contains("white");
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode",
    );
  };

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("white");
    updateThemeToggle();
  });

  const showContent = (selectedIndex) => {
    const selectedContent = contents[selectedIndex];

    if (!selectedContent) {
      return;
    }

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

  updateThemeToggle();
});
