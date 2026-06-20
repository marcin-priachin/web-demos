const demos = [
  { href: "../", label: "Home" },
  { href: "../premium-service/", label: "Premium Service" },
  { href: "../gallery-portfolio/", label: "Gallery Portfolio" },
  { href: "../local-business/", label: "Local Business" },
  { href: "../experimental-motion/", label: "Experimental Motion" },
];

if (!document.querySelector(".site-nav")) {
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Demo navigation");

  for (const demo of demos) {
    const link = document.createElement("a");
    link.href = demo.href;
    link.textContent = demo.label;
    nav.append(link);
  }

  document.body.prepend(nav);
}
