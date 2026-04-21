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




/*CARROSSEL NOSSOS QUERIDINHOS */

const track = document.querySelector('.queridinhos-track');
const items = document.querySelectorAll('.queridinho-item');
const dotsContainer = document.getElementById('queridinhosDots');
const carrossel = document.querySelector('.queridinhos-carrossel');

let index = 0;
let itemWidth;
let itemsPerView;
let maxIndex;

// calcular tudo corretamente
function calcular() {
  itemWidth = items[0].offsetWidth + 20;
  itemsPerView = Math.floor(carrossel.offsetWidth / itemWidth);
  maxIndex = items.length - itemsPerView;

  if (maxIndex < 0) maxIndex = 0;
}

// criar bolinhas por “tela”
function criarDots() {
  dotsContainer.innerHTML = "";

  for (let i = 0; i <= maxIndex; i++) {
    let dot = document.createElement("span");
    dot.addEventListener("click", () => {
      index = i;
      atualizar();
    });
    dotsContainer.appendChild(dot);
  }
}

function atualizar() {
  track.style.transform = `translateX(-${index * itemWidth}px)`;

  const dots = document.querySelectorAll('.queridinhos-dots span');
  dots.forEach(dot => dot.classList.remove('ativo'));
  if (dots[index]) dots[index].classList.add('ativo');
}

// 👉 setas corrigidas
document.querySelector('.queridinhos-direita').onclick = () => {
  index++;
  if (index > maxIndex) index = 0;
  atualizar();
};

document.querySelector('.queridinhos-esquerda').onclick = () => {
  index--;
  if (index < 0) index = maxIndex;
  atualizar();
};

// 👉 auto sem cortar último produto
setInterval(() => {
  index++;
  if (index > maxIndex) index = 0;
  atualizar();
}, 4000);

// 👉 swipe corrigido
let startX = 0;

track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

track.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;

  if (startX > endX) index++;
  else index--;

  if (index > maxIndex) index = 0;
  if (index < 0) index = maxIndex;

  atualizar();
});

// iniciar
window.addEventListener("load", () => {
  calcular();
  criarDots();
  atualizar();
});

window.addEventListener("resize", () => {
  calcular();
  criarDots();
  atualizar();
});
