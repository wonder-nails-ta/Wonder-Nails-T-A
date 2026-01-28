/*banner*/

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".banner-track");
  const slides = document.querySelectorAll(".banner-link");
  const nextBtn = document.querySelector(".banner-arrow.right");
  const prevBtn = document.querySelector(".banner-arrow.left");

  let index = 0;
  let autoPlay;

  function updateSlide() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    index++;
    if (index >= slides.length) {
      index = 0;
    }
    updateSlide();
  }

  function prevSlide() {
    index--;
    if (index < 0) {
      index = slides.length - 1;
    }
    updateSlide();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  function startAutoplay() {
    autoPlay = setInterval(nextSlide, 6000); // ⏱️ 6 segundos
  }

  function resetAutoplay() {
    clearInterval(autoPlay);
    startAutoplay();
  }

  startAutoplay();
});




/* menu sanduiche */

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