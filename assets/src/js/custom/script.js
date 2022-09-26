const navbarCollapse = document.querySelector(".site-navbar__collapse");
const bodyShadowed = document.querySelector("#body-shadowed");
const breakpointlg = getComputedStyle(
  document.documentElement
).getPropertyValue("--hd-breakpoint-lg");

navbarCollapse.addEventListener("shown.bs.collapse", (event) => {
  const isMobileNav = window.matchMedia(`(max-width: ${breakpointlg})`).matches;
  if (isMobileNav) bodyShadowed.style.display = "block";
});

navbarCollapse.addEventListener("hidden.bs.collapse", (event) => {
  bodyShadowed.style.display = "none";
});
