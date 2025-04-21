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

    // Timeout để xóa text nếu dừng quá 5 giây
    timeout = setTimeout(() => {
      editor.value = '';
      alert("Bạn đã ngưng viết quá lâu!");
      // Có thể thêm logic để kết thúc phiên tại đây nếu muốn
      // sessionEnded = true; // Ví dụ
      // clearTimeout(sessionTimer); // Ví dụ
    }, 5000); // 5 giây chờ
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

  // Xóa nội dung cũ khi bắt đầu phiên mới
  editor.value = '';

  // Áp dụng hiệu ứng blur nếu được chọn
  if (blurToggle.checked) {
    editor.style.filter = 'blur(8px)';
  } else {
    editor.style.filter = 'none';
  }

  // Bắt đầu bộ đếm thời gian chờ 5s
  resetTimer();

  // Bắt đầu bộ đếm thời gian của phiên viết
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    sessionEnded = true; // Đánh dấu phiên đã kết thúc
    clearTimeout(timeout); // Dừng bộ đếm 5s inactivity
    redOverlayIntervals.forEach(clearTimeout); // Dừng hiệu ứng đỏ
    overlay.style.background = 'rgba(255, 255, 255, 0.03)'; // Reset màu nền

    // === PHẦN ĐƯỢC THÊM/SỬA ===
    // Chọn (bôi đen) toàn bộ văn bản trong editor
    editor.select();
    editor.setSelectionRange(0, 99999); // Đảm bảo hoạt động tốt trên nhiều trình duyệt/mobile

    // Hiển thị thông báo cho người dùng biết văn bản đã được chọn
    alert("Phiên viết đã kết thúc. Văn bản đã được chọn sẵn. Hãy sao chép (copy) ngay!");
    // === KẾT THÚC PHẦN THÊM/SỬA ===

    // Tùy chọn: giữ focus vào editor sau khi alert tắt
    // editor.focus();

  }, sessionDuration); // Thời gian của phiên viết (vd: 5 phút)
});

blurToggle.addEventListener('change', () => {
  // Chỉ thay đổi filter nếu phiên chưa kết thúc HOẶC editor đang không bị disable
  // (Để tránh việc đang blur mà disable thì không bỏ blur được)
  if (!sessionEnded || !editor.disabled) {
      editor.style.filter = blurToggle.checked ? 'blur(8px)' : 'none';
  }
});

