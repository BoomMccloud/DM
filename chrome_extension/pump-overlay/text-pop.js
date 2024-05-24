// Confetti! https://www.kirilv.com/canvas-confetti/
import confetti from "https://cdn.skypack.dev/canvas-confetti";

const counter = document.querySelector(".counter");
const restartTrigger = document.querySelector(".btn-restart");
const tl = gsap.timeline();
const colors = [
  getComputedStyle(document.body).getPropertyValue("--c1"),
  getComputedStyle(document.body).getPropertyValue("--c2")
];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches;

animateCount(counter);

restartTrigger.addEventListener("click", () => {
  tl.restart();
  setCelebrateClass(false);
});

function animateCount(el) {
  const start = removeCommas(el.dataset.countStart);
  const end = removeCommas(el.textContent);

  tl.set(el, { opacity: 1 })
    .fromTo(
      el,
      {
        innerText: start,
        "--font-variation-weight": 300,
        scale: reducedMotion ? 0.95 : 0.8
      },
      {
        innerText: end,
        snap: { innerText: 1 },
        duration: reducedMotion ? 0 : 3,
        ease: "linear",
        onUpdate: () => {
          el.innerHTML = formatNumber(el.innerText);
        },
        onComplete: celebrate
      }
    )
    .to(el, {
      scale: 1,
      "--font-variation-weight": 600,
      ease: "elastic.out(1, 0.2)",
      duration: 1.2
    });
}

function celebrate() {
  setCelebrateClass(true);
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    disableForReducedMotion: true
  });
}

function setCelebrateClass(enabled) {
  counter.classList.toggle("celebrate", enabled);
}

function removeCommas(num) {
  return num.replace(/,/g, "");
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
