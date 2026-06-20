const works = [
  {
    src: "assets/ivan_aivazovsky007.jpg",
    title: "Blue Hour Drift",
    year: "2026",
    alt: "Moonlit water with vessels near a distant horizon",
  },
  {
    src: "assets/Ivan Aivazovsky840L14112_7FZPD.jpg",
    title: "Weather Line",
    year: "2025",
    alt: "Storm-lit sea with dramatic clouds and a small vessel",
  },
  {
    src: "assets/ivan_aivazovskii_a_moonlit_view_of_the_bosphorus_1884_oil_on_canvas.jpg",
    title: "Night Crossing",
    year: "2025",
    alt: "Moonlit Bosphorus view with reflected light on dark water",
  },
  {
    src: "assets/Ivan Aivazovsky839L14112_7FZPG.jpg.webrend.1280.1280.jpg",
    title: "Harbor Study",
    year: "2024",
    alt: "Ships gathered near a harbor under a pale atmospheric sky",
  },
  {
    src: "assets/Ivan Aivazovsky18adac7f18f4a0ef9038fb1308044371.jpg",
    title: "Late Passage",
    year: "2024",
    alt: "Sailing vessels crossing textured water in warm light",
  },
  {
    src: "assets/Ivan Aivazovsky006.jpg",
    title: "After the Squall",
    year: "2023",
    alt: "Restless sea and dramatic sky after a passing storm",
  },
];

const allImages = [
  ...works,
  {
    src: "assets/Ivan-Aivazovsky_-_View_of_Constantinople_and_the_Bosphorus.jpg",
    title: "Constantinople View",
    year: "Archive",
    alt: "Expansive coastal scene with ships and luminous sky",
  },
  {
    src: "assets/Ivan Aivazovsky20161117_214102.webp",
    title: "Studio Reference",
    year: "Archive",
    alt: "Coastal artwork detail used as a studio reference",
  },
];

const grid = document.querySelector("#works-grid");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-nav.prev");
const nextButton = document.querySelector(".lightbox-nav.next");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeIndex = 0;

function renderWorks() {
  const fragment = document.createDocumentFragment();

  works.forEach((work, index) => {
    const button = document.createElement("button");
    button.className = "work-card";
    button.type = "button";
    button.dataset.lightbox = String(index);
    button.innerHTML = `
      <figure>
        <img src="${work.src}" alt="${work.alt}" loading="lazy">
      </figure>
      <span class="work-title">
        <span>${work.title}</span>
        <span class="work-meta">${work.year}</span>
      </span>
    `;
    fragment.append(button);
  });

  grid.append(fragment);
}

function setVisible(element, index = 0) {
  element.style.setProperty("--delay", `${Math.min(index * 90, 420)}ms`);
  element.classList.add("is-visible");
}

function initReveals() {
  const revealItems = document.querySelectorAll(".reveal, .stagger-group > *");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => setVisible(item));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const siblings = [...entry.target.parentElement.children];
        const index = siblings.indexOf(entry.target);
        setVisible(entry.target, index);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function openLightbox(index) {
  activeIndex = Number(index);
  const image = allImages[activeIndex];

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = `${image.title}, ${image.year}`;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
}

function moveLightbox(step) {
  activeIndex = (activeIndex + step + allImages.length) % allImages.length;
  openLightbox(activeIndex);
}

function initLightbox() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox]");

    if (trigger) {
      openLightbox(trigger.dataset.lightbox);
      return;
    }

    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => moveLightbox(-1));
  nextButton.addEventListener("click", () => moveLightbox(1));

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      moveLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      moveLightbox(1);
    }
  });
}

renderWorks();
initReveals();
initLightbox();
