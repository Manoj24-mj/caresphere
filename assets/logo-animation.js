// The welcome screen is shown after the brand animation, or immediately on request.
const experience = document.getElementById("experience");
const animation = document.getElementById("animation");
const welcome = document.getElementById("welcome");
const continueButton = document.getElementById("continue");
let readyTimer;

// Bail out silently when this script runs on a page without the welcome screen.
if (!experience || !animation || !welcome || !continueButton) {
  readyTimer = null;
} else {

function showWelcome(focusContinue = false) {
  window.clearTimeout(readyTimer);
  experience.classList.add("ready");
  animation.setAttribute("aria-hidden", "true");
  welcome.setAttribute("aria-hidden", "false");

  // Move focus into the newly revealed screen when the user skipped the animation.
  if (focusContinue) continueButton.focus({ preventScroll: true });
}

function continueToOnboarding() {
  // Profile setup and role selection live on their existing page and routes.
  window.location.href = "onboarding.html";
}

document.getElementById("skip").addEventListener("click", () => showWelcome(true));
continueButton.addEventListener("click", continueToOnboarding);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !experience.classList.contains("ready")) {
    showWelcome(true);
  }
});

// Do not make users wait for animation when their device requests reduced motion.
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  showWelcome();
} else {
  readyTimer = window.setTimeout(showWelcome, 3600);
}

}
