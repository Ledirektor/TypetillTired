const editor = document.getElementById('editor');
const overlay = document.getElementById('overlay');
const blurToggle = document.getElementById('blur-toggle');
const sessionTimeSelect = document.getElementById('session-time');
const startButton = document.getElementById('start-button');

let timeout;
let redOverlayIntervals = [];
let sessionDuration = 0;
let sessionEnded = false;
let sessionTimer;

function resetTimer() {
  clearTimeout(timeout);
  redOverlayIntervals.forEach(clearTimeout);
  redOverlayIntervals = [];

  if (!sessionEnded) {
    overlay.style.background = 'rgba(255, 255, 255, 0.03)';

    // Red overlay gradient effect
    for (let i = 1; i <= 5; i++) {
      const intensity = i * 0.2;
      const timeoutId = setTimeout(() => {
        overlay.style.background = `rgba(255, 0, 0, ${intensity})`;
      }, i * 1000);
      redOverlayIntervals.push(timeoutId);
    }

    timeout = setTimeout(() => {
      editor.value = '';
      alert("Bạn đã ngưng viết quá lâu!");
    }, 5000);
  }
}

editor.addEventListener('input', () => {
  if (!sessionEnded) {
    resetTimer();
  }
});

startButton.addEventListener('click', () => {
  sessionEnded = false;
  sessionDuration = parseInt(sessionTimeSelect.value) * 1000;

  editor.disabled = false;
  editor.focus();

  editor.value = '';

  if (blurToggle.checked) {
    editor.style.filter = 'blur(8px)';
  } else {
    editor.style.filter = 'none';
  }

  resetTimer();

  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    sessionEnded = true;
    clearTimeout(timeout);
    redOverlayIntervals.forEach(clearTimeout);
    overlay.style.background = 'rgba(255, 255, 255, 0.03)';
    alert("Phiên viết đã kết thúc. Văn bản của bạn đã được bảo toàn.");
  }, sessionDuration);
});

blurToggle.addEventListener('change', () => {
  editor.style.filter = blurToggle.checked ? 'blur(8px)' : 'none';
});
