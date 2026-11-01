import DiceBox from "https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js";

document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.type-btn.active').classList.remove('active');
    btn.classList.add('active');
  });
});

let Box = new DiceBox({
  assetPath: "assets/",
  origin: "https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/",
  container: "#dice-box",
  theme: "diceOfRolling",
  themeColor: "#feea03",
  externalThemes: {
    diceOfRolling: "https://www.unpkg.com/@3d-dice/theme-dice-of-rolling@0.2.1",
    
  },
  offscreen: true,
  scale: 6,
  // physics settings that must be set - defaults are buggy
  throwForce: 5,
  gravity: 1,
  mass: 1,
  spinForce: 6,
});

Box.init();

function roll(){
  Box.roll([document.querySelector('.type-btn.active').dataset.type], {});
}

Box.onRollComplete = (rollResult) => {
  console.log('roll results', rollResult);
  const diceBox = document.getElementById('dice-box');
  const total = rollResult.total ?? rollResult.rolls?.reduce((sum, r) => sum + r.value, 0) ?? 0;
  diceBox.setAttribute('aria-label', `Dice roll result: ${total}`);
};

// Touch/swipe gesture to roll dice
const canvasContainer = document.getElementById("dice-box");

// Simple Case: Click to roll dice
canvasContainer.addEventListener("click", roll);

// More sophisticated: User swipes across screen
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let touchStartTime = 0;
let touchEndTime = 0;
const minSwipeDistance = 30;

canvasContainer.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
  touchStartTime = Date.now();
}, { passive: false });

canvasContainer.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  touchEndTime = Date.now();
  handleSwipe();
}, { passive: false });

function handleSwipe() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const duration = touchEndTime - touchStartTime || 1;
  const velocity = distance / duration;

  if (distance < minSwipeDistance) return;

  // Use swipe velocity to modulate throw force (faster swipe = stronger throw)
  const baseThrowForce = 5;
  const maxThrowForce = 15;
  const throwForce = Math.min(baseThrowForce + velocity * 0.5, maxThrowForce);

  Box.updateConfig({ throwForce });

  // newStartPoint: false = dice start from consistent position, 
  // true = random point along edge (more natural for swipes)
  roll();
}
