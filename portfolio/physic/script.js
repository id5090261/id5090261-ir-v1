document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.querySelector("#ThemeToggle");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxTitle = document.querySelector("#lightboxTitle");
  const lightboxDescription = document.querySelector("#lightboxDescription");
  const lightboxOriginal = document.querySelector("#lightboxOriginal");
  const lightboxClose = document.querySelector("#lightboxClose");
  const shotCards = Array.from(document.querySelectorAll(".shot-card"));
  const storageKey = "physic-case-theme";
  let lastTrigger = null;

  const updateThemeToggle = () => {
    const isLight = body.dataset.theme === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "تغییر به تم تیره" : "تغییر به تم روشن",
    );
  };

  const applyStoredTheme = () => {
    try {
      const storedTheme = localStorage.getItem(storageKey);

      if (storedTheme === "light") {
        body.dataset.theme = "light";
      }
    } catch {
      // Ignore storage access issues and keep the default theme.
    }

    updateThemeToggle();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    body.style.overflow = "";

    if (lastTrigger) {
      lastTrigger.focus();
    }
  };

  const openLightbox = (card) => {
    const full = card.dataset.full;
    const title = card.dataset.title;
    const description = card.dataset.description;
    const alt = card.dataset.alt;

    if (!full) {
      return;
    }

    lastTrigger = card;
    lightboxImage.src = full;
    lightboxImage.alt = alt || title || "";
    lightboxTitle.textContent = title || "تصویر پروژه";
    lightboxDescription.textContent = description || "";
    lightboxOriginal.href = full;
    lightbox.hidden = false;
    body.style.overflow = "hidden";
    lightboxClose.focus();
  };

  themeToggle.addEventListener("click", () => {
    const isLight = body.dataset.theme === "light";

    if (isLight) {
      body.removeAttribute("data-theme");
    } else {
      body.dataset.theme = "light";
    }

    try {
      localStorage.setItem(storageKey, body.dataset.theme || "dark");
    } catch {
      // Ignore storage access issues if the browser blocks it.
    }

    updateThemeToggle();
  });

  shotCards.forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.close) {
      closeLightbox();
    }
  });

  lightboxClose.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });

  applyStoredTheme();
});
