const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const heroBg = document.querySelector("[data-parallax]");
const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setNavState = () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 20);
};

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px" },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

let ticking = false;

const updateParallax = () => {
  if (!heroBg || reduceMotion.matches) {
    ticking = false;
    return;
  }

  const offset = Math.min(window.scrollY * 0.18, 80);
  heroBg.style.setProperty("--parallax-y", `${offset}px`);
  ticking = false;
};

const requestParallax = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
};

window.addEventListener("scroll", requestParallax, { passive: true });
updateParallax();

reduceMotion.addEventListener("change", () => {
  if (reduceMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    heroBg?.style.removeProperty("--parallax-y");
  }
});
