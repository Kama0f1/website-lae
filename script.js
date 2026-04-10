/* ══════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════ */
const dot = document.querySelector('.cursor-dot');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
const revealEls = document.querySelectorAll(
  '.world-text, .world-img, .nowplaying-text, .vinyl-wrap, .reason-card, .letter-paper, .letter-snoopy, .question-content'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i % 4) * 0.1 + 's';
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

/* ══════════════════════════════════════════════
   NO BUTTON — RUNS AWAY
══════════════════════════════════════════════ */
const noBtn   = document.getElementById('noBtn');
const btnRow  = document.querySelector('.btn-row');
const noHint  = document.getElementById('noHint');
let   noCount = 0;

const hintMessages = [
  "it's already running lol",
  "come on now…",
  "that button is faster than you 😭",
  "okay it really doesn't want to be clicked",
  "the answer is yes, trust me",
  "hachiware is crying rn",
  "just click yes 🍓",
  "it'll keep going forever",
  "even snoopy is judging you",
  "PLEASE it's the right choice 🥺",
];

function moveNoBtn() {
  noCount++;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const qRect = btnRow.getBoundingClientRect();

  // Random position within viewport, not overlapping the yes button
  let nx, ny;
  const attempts = 20;
  for (let i = 0; i < attempts; i++) {
    nx = Math.random() * (vw - 120) + 10;
    ny = Math.random() * (vh - 60) + 10;
    // avoid stacking on yes button area (rough)
    if (Math.abs(nx - qRect.left - 80) > 160 || Math.abs(ny - qRect.top - 30) > 80) break;
  }

  noBtn.style.position = 'fixed';
  noBtn.style.left = nx + 'px';
  noBtn.style.top  = ny + 'px';
  noBtn.style.right = 'auto';
  noBtn.style.bottom = 'auto';
  noBtn.style.zIndex = '500';
  noBtn.style.transition = 'left 0.25s cubic-bezier(.22,1,.36,1), top 0.25s cubic-bezier(.22,1,.36,1)';

  noHint.textContent = hintMessages[Math.min(noCount - 1, hintMessages.length - 1)];

  // Get progressively faster and smaller as no count grows
  const scale = Math.max(0.5, 1 - noCount * 0.04);
  noBtn.style.transform = `scale(${scale})`;
  noBtn.style.opacity   = Math.max(0.3, 1 - noCount * 0.06);
}

// Desktop: hover
noBtn.addEventListener('mouseenter', moveNoBtn);

// Mobile: touchstart
noBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  moveNoBtn();
});

/* ══════════════════════════════════════════════
   YES BUTTON — CONFETTI + SCREEN
══════════════════════════════════════════════ */
function handleYes() {
  // Hide the no button
  noBtn.style.display = 'none';

  // Show yes screen
  const yesScreen = document.getElementById('yesScreen');
  yesScreen.classList.add('active');

  // Burst confetti 🎉
  const colors = ['#e8192c', '#ffffff', '#7ecfcf', '#ffd6d6', '#ffb3b3', '#ff6b6b'];

  function fireConfetti() {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.6 },
      colors: colors,
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.6 },
      colors: colors,
    });
  }

  // Fire immediately and keep firing for a bit
  fireConfetti();
  const burst = setInterval(fireConfetti, 600);
  setTimeout(() => clearInterval(burst), 5000);
}

/* ══════════════════════════════════════════════
   PLAYLIST ITEMS — subtle hover glow
══════════════════════════════════════════════ */
document.querySelectorAll('.playlist-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    dot.style.transform = 'translate(-50%, -50%) scale(2.5)';
    dot.style.background = '#e8192c';
  });
  item.addEventListener('mouseleave', () => {
    dot.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

/* ══════════════════════════════════════════════
   REASON CARDS — tilt effect
══════════════════════════════════════════════ */
document.querySelectorAll('.reason-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ══════════════════════════════════════════════
   YES SCREEN — click to get more confetti
══════════════════════════════════════════════ */
document.getElementById('yesScreen').addEventListener('click', () => {
  confetti({
    particleCount: 120,
    spread: 180,
    origin: { x: Math.random(), y: Math.random() * 0.5 },
    colors: ['#ffffff', '#ffb3b3', '#e8192c', '#7ecfcf'],
    scalar: 1.5,
  });
});
