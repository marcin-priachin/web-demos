const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const canAnimate = () => !motionQuery.matches;

const progressBar = document.querySelector(".scroll-progress");
const cursorGlow = document.querySelector(".cursor-glow");
const revealItems = document.querySelectorAll(".reveal");
const interactiveCards = document.querySelectorAll(".interactive-card");
const magneticButtons = document.querySelectorAll(".magnetic-button");
const statValues = document.querySelectorAll("[data-count]");

let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let glowX = pointerX;
let glowY = pointerY;

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
}

function animateGlow() {
  if (!canAnimate() || !cursorGlow) {
    return;
  }

  glowX += (pointerX - glowX) * 0.14;
  glowY += (pointerY - glowY) * 0.14;
  cursorGlow.style.transform = `translate3d(${glowX - cursorGlow.offsetWidth / 2}px, ${glowY - cursorGlow.offsetHeight / 2}px, 0)`;
  requestAnimationFrame(animateGlow);
}

function countTo(element) {
  const target = Number(element.dataset.count);
  const duration = 1200;
  const startedAt = performance.now();

  function frame(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    statValues.forEach(countTo);
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countTo(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach((stat) => statObserver.observe(stat));
}

function setupCards() {
  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (!canAnimate()) {
        return;
      }

      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const xPercent = x / bounds.width;
      const yPercent = y / bounds.height;
      const tiltX = (xPercent - 0.5) * 8;
      const tiltY = (0.5 - yPercent) * 8;

      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      card.style.setProperty("--tilt-x", `${tiltX}deg`);
      card.style.setProperty("--tilt-y", `${tiltY}deg`);
      card.style.setProperty("--card-glow", "1");
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--card-glow", "0");
    });
  });
}

function setupMagneticButtons() {
  magneticButtons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (!canAnimate()) {
        return;
      }

      const bounds = button.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      button.style.transform = `translate(${x * 0.18}px, ${y * 0.26}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "translate(0, 0)";
    });
  });
}

function setupPanels() {
  document.querySelectorAll(".feature-panel").forEach((panel) => {
    const button = panel.querySelector(".panel-toggle");

    button.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.textContent = isOpen ? "Collapse" : "Inspect";
    });
  });
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

window.addEventListener(
  "pointermove",
  (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (cursorGlow && canAnimate()) {
      cursorGlow.style.opacity = "1";
    }
  },
  { passive: true }
);

const handleMotionChange = () => {
  if (!canAnimate() && cursorGlow) {
    cursorGlow.style.opacity = "0";
  } else {
    animateGlow();
  }
};

if ("addEventListener" in motionQuery) {
  motionQuery.addEventListener("change", handleMotionChange);
} else {
  motionQuery.addListener(handleMotionChange);
}

setupReveal();
setupCards();
setupMagneticButtons();
setupPanels();
updateScrollProgress();
animateGlow();
