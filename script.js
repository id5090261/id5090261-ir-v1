document.getElementById("DarkModeToggle").addEventListener("click", () => {
    document.querySelector("body").classList.toggle("white");
    document.querySelectorAll("svg").forEach(svg => {
        svg.classList.toggle("white");
    });
});