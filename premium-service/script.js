const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealSections = document.querySelectorAll(".section-reveal");
const counters = document.querySelectorAll(".counter");
const tiltCards = document.querySelectorAll(".tilt-card");

function formatCounterValue(value, counter) {
  const prefix = counter.dataset.prefix ?? "";
  const suffix = counter.dataset.suffix ?? "";
  return `${prefix}${Math.round(value).toLocaleString()}${suffix}`;
}

function animateCounter(counter) {
  if (counter.dataset.counted === "true") {
    return;
  }

  counter.dataset.counted = "true";

  const target = Number(counter.dataset.target || 0);

  if (prefersReducedMotion || target === 0) {
    counter.textContent = formatCounterValue(target, counter);
    return;
  }

  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = formatCounterValue(target * eased, counter);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.16 }
  );

  revealSections.forEach((section) => revealObserver.observe(section));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  revealSections.forEach((section) => section.classList.add("is-visible"));
  counters.forEach(animateCounter);
}

if (!prefersReducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}
