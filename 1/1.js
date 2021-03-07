const btn = document.querySelector(".btn");
const btnIcons = document.querySelectorAll(".btn_icon");

function toggleIcons() {
  [].forEach.call(btnIcons, (icon) => {
    icon.classList.toggle("none");
  });
}

btn.addEventListener("click", toggleIcons);
