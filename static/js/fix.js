// Find your fix: rule-based, đọc cây câu hỏi từ fix-tree.json
(function () {
  var box = document.getElementById('fix-box');
  if (!box) return;
  var base = (window.FIXIT && FIXIT.base) || '/';
  var tree, services = {}, path = [];

  function fmt(n) { return Number(n).toLocaleString('vi-VN') + 'đ'; }
  function setStep(n) {
    var stepEl = document.getElementById('fix-step');
    var barEl = document.getElementById('fix-bar');
    if (stepEl) {
      stepEl.textContent = 'BƯỚC ' + n + '/3: ' + (n === 1 ? 'CHỌN NHÓM VẤN ĐỀ' : n === 2 ? 'CHI TIẾT TRIỆU CHỨNG' : 'KẾT QUẢ ĐỀ XUẤT');
    }
    if (barEl) {
      barEl.style.width = (n / 3 * 100) + '%';
    }
  }

  async function init() {
    try {
      var r = await Promise.all([
        fetch(base + 'data/fix-tree.json').then(function (x) { return x.json(); }),
        fetch(base + 'services.json').then(function (x) { return x.json(); })
      ]);
      tree = r[0];
      r[1].forEach(function (s) { services[s.id] = s; });
      show('start');
    } catch (e) {
      box.innerHTML = '<div class="fix-error-box"><p>Không tải được dữ liệu cây quyết định. Hãy thử tải lại trang nhé.</p></div>';
    }
  }

  function show(key) {
    var node = tree[key];
    if (!node) return;
    var step = key === 'start' ? 1 : 2;
    setStep(step);
    var html = '<h2 class="fix-question">' + node.question + '</h2>' +
      '<div class="opts fix-opts">' +
      node.options.map(function (o, i) {
        return '<button class="opt fix-opt-btn" type="button" data-i="' + i + '">' +
          '<span class="opt-label">' + o.label + '</span>' +
          '<span class="opt-arrow">→</span>' +
        '</button>';
      }).join('') +
      '</div>' +
      (key !== 'start' ? '<div class="fix-back-row"><button class="btn btn-ghost" id="back" type="button">← Quay lại bước trước</button></div>' : '');

    box.innerHTML = html;
    box.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var o = node.options[b.dataset.i];
        path.push(key);
        if (o.next) show(o.next); else result(o);
      });
    });
    var back = document.getElementById('back');
    if (back) back.addEventListener('click', function () { show(path.pop() || 'start'); });
  }

  function result(o) {
    setStep(3);
    var items = o.result.map(function (id) { return services[id]; }).filter(Boolean);
    var sum = items.reduce(function (s, x) { return s + x.price; }, 0);
    var html = '<div class="fix-result-header">' +
      '<span class="result-check-badge">✓ GỢI Ý DỊCH VỤ PHÙ HỢP</span>' +
      '<h2 class="fix-result-title">Tụi mình gợi ý cho bạn</h2>' +
      '<p class="muted">Dựa trên hiện tượng bạn chọn: <b>' + o.label + '</b></p>' +
      '</div>' +
      '<div class="result-list">' +
      items.map(function (s) {
        return '<div class="fix-result-card">' +
          '<div class="fix-card-info">' +
            '<div class="fix-card-title-row">' +
              '<span class="service-icon">' + s.icon + '</span>' +
              '<h4><a href="' + s.url + '">' + s.name + '</a></h4>' +
            '</div>' +
            '<p class="muted">' + s.short + '</p>' +
            '<p class="price">' + fmt(s.price) + '</p>' +
          '</div>' +
          '<div class="fix-card-actions">' +
            '<a class="btn btn-ghost btn-sm" href="' + s.url + '">Xem chi tiết</a>' +
            '<button class="btn add-to-cart btn-sm" type="button" data-id="' + s.id + '" data-name="' + s.name + '" data-price="' + s.price + '">Thêm vào hẹn</button>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>';

    if (items.length > 1) {
      html += '<div class="fix-total-box">' +
        '<span>Tổng mức phí dự kiến: <b class="price">' + fmt(sum) + '</b></span>' +
        '<button class="btn-glow-pill btn-sm" id="add-all" type="button"><span>Thêm tất cả vào danh sách hẹn (' + fmt(sum) + ')</span></button>' +
      '</div>';
    }
    if (sum > 100000 && services['student-pack']) {
      html += '<div class="fix-pack-tip">' +
        '💡 <b>Gợi ý tiết kiệm:</b> Bạn đang chọn nhiều dịch vụ, gói <a href="' + services['student-pack'].url + '">Student Pack 149.000đ</a> bao gồm 6 dịch vụ thường dùng có thể giúp bạn tiết kiệm 55.000đ.' +
      '</div>';
    }
    html += '<div class="fix-restart-row"><button class="btn btn-ghost" id="restart" type="button">↺ Bắt đầu tìm kiếm lại</button></div>';

    box.innerHTML = html;
    var all = document.getElementById('add-all');
    if (all) all.addEventListener('click', function () {
      items.forEach(function (s) { FixitCart.add({ id: s.id, name: s.name, price: s.price }); });
      FixitCart.toast('Đã thêm ' + items.length + ' dịch vụ vào danh sách hẹn');
    });
    document.getElementById('restart').addEventListener('click', function () { path = []; show('start'); });
  }

  // Tự chẩn đoán 5 câu hỏi laptop
  var QUIZ = [
    { title: 'Thời gian khởi động lâu', desc: 'Bấm nút nguồn mở máy mất hơn 1 - 2 phút mới vào được màn hình chính' },
    { title: 'Quạt gió hú to / Máy nóng ran', desc: 'Chỉ lướt web hoặc mở vài tab nhẹ nhưng máy đã tỏa nhiệt nóng và quạt kêu ồn' },
    { title: 'Bộ nhớ ổ đĩa bị đầy (Báo đỏ)', desc: 'Ổ đĩa C chứa hệ điều hành còn trống dưới 15%, thường xuyên báo Low Disk Space' },
    { title: 'Pin tụt nhanh bất thường', desc: 'Rút sạc chỉ dùng được khoảng 1 tiếng, máy tự sập nguồn dù còn pin' },
    { title: 'Thường xuyên đơ, giật lag', desc: 'Mở VS Code, trình duyệt hoặc phần mềm học tập hay bị Not Responding' }
  ];

  function quiz() {
    var el = document.getElementById('quiz');
    if (!el) return;
    el.innerHTML = '<div class="quiz-items-grid">' +
      QUIZ.map(function (q, i) {
        return '<label class="quiz-item-card" for="q-check-' + i + '">' +
          '<input type="checkbox" id="q-check-' + i + '" class="quiz-checkbox" data-q="' + i + '">' +
          '<div class="quiz-item-content">' +
            '<span class="quiz-item-title">' + q.title + '</span>' +
            '<span class="quiz-item-desc">' + q.desc + '</span>' +
          '</div>' +
        '</label>';
      }).join('') +
      '</div>' +
      '<div class="quiz-action-bar">' +
        '<button class="btn-glow-pill" id="quiz-go" type="button"><span>Xem gợi ý đánh giá</span></button>' +
      '</div>' +
      '<div id="quiz-out" class="quiz-result-area" aria-live="polite"></div>';

    document.getElementById('quiz-go').addEventListener('click', function () {
      var n = el.querySelectorAll('input:checked').length;
      var out = document.getElementById('quiz-out');
      var s = services['laptop-health'];

      var statusClass = n <= 1 ? 'status-safe' : n <= 3 ? 'status-warn' : 'status-danger';
      var title = n <= 1 ? 'Laptop của bạn hiện ở mức khá ổn định (' + n + '/5 hiện tượng)'
                : n <= 3 ? 'Laptop có ' + n + '/5 hiện tượng cần lưu ý dọn dẹp'
                : 'Laptop có ' + n + '/5 hiện tượng quá tải rõ rệt';
      var advice = n <= 1 ? 'Chưa cần can thiệp sâu. Bạn chỉ cần định kỳ dọn file rác tạm thời và cập nhật phần mềm học tập.'
                 : n <= 3 ? 'Máy bắt đầu bị nghẽn ổ đĩa hoặc quá nhiều tác vụ chạy ngầm. Bạn có thể hẹn tụi mình tại sảnh trường để kiểm tra và dọn dẹp lại hệ thống.'
                 : 'Nhiều khả năng máy đang bị đầy dung lượng, nhiệt độ cao hoặc ổ đĩa có vấn đề. Khuyến nghị bạn sao lưu bài tập lên cloud trước, sau đó mang máy để tụi mình kiểm tra chi tiết.';

      out.innerHTML = '<div class="quiz-result-card ' + statusClass + '">' +
        '<div class="quiz-res-header">' +
          '<span class="score-badge">' + n + '/5 HIỆN TƯỢNG' + '</span>' +
          '<h4>' + title + '</h4>' +
        '</div>' +
        '<p class="quiz-res-advice">' + advice + '</p>' +
        (n >= 2 && s ? '<div class="quiz-res-cta"><a class="btn-glow-pill" href="' + s.url + '"><span>Xem dịch vụ ' + s.name + ' (' + fmt(s.price) + ')</span></a></div>' : '') +
      '</div>';
    });
  }

  document.addEventListener('DOMContentLoaded', function () { init(); quiz(); });
})();
