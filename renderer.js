const editor = document.getElementById('editor');
const overlay = document.getElementById('overlay');
const blurToggle = document.getElementById('blur-toggle');
const sessionTimeSelect = document.getElementById('session-time');
const startButton = document.getElementById('start-button');

let timeout; // Timer cho 5 giây inactivity
let redOverlayIntervals = []; // Timer cho hiệu ứng đỏ dần
let sessionTimer; // Timer cho tổng thời gian phiên (chỉ dùng cho chế độ có giờ)

let sessionEnded = true; // Mặc định là đã kết thúc (chưa bắt đầu)
let sessionDuration = 0; // Thời gian tổng của phiên (chỉ dùng cho chế độ có giờ)


function resetTimer() {
  // Luôn xóa các timer cũ trước khi đặt lại
  clearTimeout(timeout);
  redOverlayIntervals.forEach(clearTimeout);
  redOverlayIntervals = [];

  const selectedMode = sessionTimeSelect.value; // Kiểm tra mode hiện tại

  // Chỉ thực hiện logic đếm ngược 5s và hiệu ứng đỏ nếu KHÔNG ở chế độ free VÀ phiên chưa kết thúc
  if (selectedMode !== "free" && !sessionEnded) {
    overlay.style.background = 'rgba(255, 255, 255, 0.03)'; // Reset nền ngay

    // Hiệu ứng đỏ dần
    for (let i = 1; i <= 5; i++) {
      const intensity = i * 0.2;
      const timeoutId = setTimeout(() => {
        // Kiểm tra lại trạng thái trước khi đổi màu (phòng trường hợp mode/session thay đổi)
        if (sessionTimeSelect.value !== "free" && !sessionEnded) {
             overlay.style.background = `rgba(255, 0, 0, ${intensity})`;
        }
      }, i * 1000);
      redOverlayIntervals.push(timeoutId);
    }

    // Đặt lại bộ đếm 5 giây inactivity (chỉ khi không phải free mode)
    timeout = setTimeout(() => {
       // Kiểm tra lại trạng thái trước khi xóa text
       if (sessionTimeSelect.value !== "free" && !sessionEnded) {
            editor.value = '';
            alert("Bạn đã ngưng viết quá lâu!");
            // Có thể cân nhắc kết thúc phiên luôn ở đây nếu muốn
            // sessionEnded = true;
            // clearTimeout(sessionTimer);
       }
    }, 5000); // 5 giây chờ
  } else {
     // Nếu là free mode hoặc phiên đã kết thúc, đảm bảo overlay được reset
     overlay.style.background = 'rgba(255, 255, 255, 0.03)';
  }
}

// Listener khi người dùng gõ chữ
editor.addEventListener('input', () => {
  // Chỉ reset bộ đếm 5s nếu KHÔNG ở chế độ free VÀ phiên chưa kết thúc
  if (sessionTimeSelect.value !== "free" && !sessionEnded) {
    resetTimer();
  }
});

// Listener khi nhấn nút Bắt đầu
startButton.addEventListener('click', () => {
  const selectedMode = sessionTimeSelect.value; // Lấy giá trị mode được chọn
  sessionEnded = false; // Đặt lại cờ, bắt đầu phiên mới

  // Xóa tất cả các timer có thể còn sót lại từ phiên trước
  clearTimeout(sessionTimer);
  clearTimeout(timeout);
  redOverlayIntervals.forEach(clearTimeout);
  redOverlayIntervals = [];
  overlay.style.background = 'rgba(255, 255, 255, 0.03)'; // Reset overlay ngay

  // Kích hoạt ô editor và xóa nội dung cũ
  editor.disabled = false;
  editor.focus();
  editor.value = '';

  // Áp dụng hiệu ứng blur nếu được chọn
  if (blurToggle.checked) {
    editor.style.filter = 'blur(8px)';
  } else {
    editor.style.filter = 'none';
  }

  // Xử lý tùy theo mode được chọn
  if (selectedMode === "free") {
    // CHẾ ĐỘ TỰ DO: Không làm gì liên quan đến timer
    console.log("Chế độ Tự do bắt đầu.");
    // Không gọi resetTimer() ở đây vì không cần bộ đếm 5s
    // Không đặt sessionTimer

  } else {
    // CHẾ ĐỘ CÓ HẸN GIỜ
    console.log("Chế độ hẹn giờ bắt đầu.");
    sessionDuration = parseInt(selectedMode) * 1000;

    // Bắt đầu chu trình đếm 5 giây inactivity
    resetTimer();

    // Đặt bộ đếm tổng thời gian cho phiên viết
    sessionTimer = setTimeout(() => {
      sessionEnded = true; // Đánh dấu phiên đã kết thúc
      clearTimeout(timeout); // Dừng bộ đếm 5s inactivity
      redOverlayIntervals.forEach(clearTimeout); // Dừng hiệu ứng đỏ
      overlay.style.background = 'rgba(255, 255, 255, 0.03)'; // Reset màu nền

      // Chọn văn bản và thông báo
      editor.select();
      editor.setSelectionRange(0, 99999);
      alert("Phiên viết đã kết thúc. Văn bản đã được chọn sẵn. Hãy sao chép (copy) ngay!");

      // Tùy chọn: giữ focus vào editor sau khi alert tắt
      // editor.focus();

    }, sessionDuration);
  }
});

// Listener khi thay đổi checkbox blur
blurToggle.addEventListener('change', () => {
  // Luôn cho phép thay đổi blur bất kể trạng thái nào
  editor.style.filter = blurToggle.checked ? 'blur(8px)' : 'none';
});
