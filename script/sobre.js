

/*menu*/
const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

function toggleMenu() {
  sideMenu.classList.toggle("active");
  overlay.classList.toggle("active");
}

hamburger.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);



/*subir seta*/
const btnTop = document.getElementById("btnTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    btnTop.style.display = "block";
  } else {
    btnTop.style.display = "none";
  }
});

btnTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
