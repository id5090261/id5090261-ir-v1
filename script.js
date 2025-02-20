document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("DarkModeToggle").addEventListener("click", () => {
        document.querySelector("body").classList.toggle("white");
        document.querySelectorAll("svg").forEach(svg => {
            svg.classList.toggle("white");
        });
    });

    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".content");
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            document.querySelector(".tab-content").style.display = "block";
            contents.forEach(content => content.style.display = "none");
            contents[index].style.display = "block";
        });
    });
});