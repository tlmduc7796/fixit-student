/* FixIT Student — giỏ hàng dùng chung, hiệu ứng, điều hướng, biểu mẫu nhỏ */
(function () {
  'use strict';

  /* ---------- Lưu trữ an toàn ----------
     Ưu tiên localStorage. Khi trình duyệt chặn localStorage (chế độ riêng tư, trang xem thử nhúng
     trong khung, cài đặt chặn dữ liệu trang web), dữ liệu vẫn được giữ trong window.name: giá trị này
     đi theo cùng một tab khi chuyển từ trang này sang trang khác của web.
     Nhờ vậy giao diện Sáng/Tối, giỏ hàng và đơn hẹn không bị mất khi bấm qua trang khác. */
  var NAME_PREFIX = 'fixit:';

  function readNameStore() {
    var raw = window.name || '';
    if (raw.indexOf(NAME_PREFIX) !== 0) return {};
    try {
      return JSON.parse(raw.slice(NAME_PREFIX.length)) || {};
    } catch (e) {
      return {};
    }
  }

  function writeNameStore(obj) {
    try {
      window.name = NAME_PREFIX + JSON.stringify(obj);
    } catch (e) { /* bỏ qua */ }
  }

  function safeGet(k) {
    try {
      var v = window.localStorage.getItem(k);
      if (v !== null) return v;
    } catch (e) { /* localStorage bị chặn: dùng bản trong window.name */ }
    var store = readNameStore();
    return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
  }

  function safeSet(k, v) {
    try {
      window.localStorage.setItem(k, v);
    } catch (e) { /* bị chặn: vẫn còn bản trong window.name bên dưới */ }
    var store = readNameStore();
    store[k] = v;
    writeNameStore(store);
  }

  window.FixStore = { get: safeGet, set: safeSet };

  function announce(msg) {
    var el = document.querySelector('[data-live]');
    if (!el) return;
    el.textContent = '';
    window.setTimeout(function () { el.textContent = msg; }, 30);
  }
  window.FixAnnounce = announce;

  function vnd(n) {
    var s = String(Math.round(n));
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  }
  window.FixVnd = vnd;

  /* ---------- Giỏ hàng ---------- */
  var KEY = 'fixit_cart_v1';
  var mem = null;
  var Cart = {
    read: function () {
      if (mem) return mem;
      try { mem = JSON.parse(safeGet(KEY) || '[]'); } catch (e) { mem = []; }
      if (!Array.isArray(mem)) mem = [];
      return mem;
    },
    write: function (items) {
      mem = items;
      safeSet(KEY, JSON.stringify(items));
      Cart.updateCount();
      document.dispatchEvent(new CustomEvent('fixcart:change'));
    },
    add: function (item) {
      var items = Cart.read().slice();
      for (var i = 0; i < items.length; i++) { if (items[i].id === item.id) return false; }
      items.push({ id: item.id, title: item.title, price: Number(item.price) || 0 });
      Cart.write(items);
      document.dispatchEvent(new CustomEvent('fixcart:added', { detail: { id: item.id, title: item.title } }));
      return true;
    },
    remove: function (id) {
      Cart.write(Cart.read().filter(function (x) { return x.id !== id; }));
    },
    clear: function () { Cart.write([]); },
    total: function () {
      return Cart.read().reduce(function (s, x) { return s + (Number(x.price) || 0); }, 0);
    },
    has: function (id) {
      return Cart.read().some(function (x) { return x.id === id; });
    },
    updateCount: function () {
      var n = Cart.read().length;
      var els = document.querySelectorAll('[data-cart-count]');
      for (var i = 0; i < els.length; i++) els[i].textContent = String(n);
    }
  };
  window.FixCart = Cart;

  /* ---------- Khởi tạo sau khi DOM sẵn sàng ---------- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    Cart.updateCount();

    /* Menu di động */
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
      var setNav = function (open) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? 'Đóng' : 'Menu';
      };
      toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
      });
    }

    /* Thêm vào giỏ */
    var addBtns = document.querySelectorAll('[data-add-to-cart]');
    function syncAddBtn(btn) {
      var inCart = Cart.has(btn.getAttribute('data-id'));
      if (!btn.hasAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
      btn.textContent = inCart ? 'Đã có trong giỏ' : btn.getAttribute('data-label');
      btn.setAttribute('aria-disabled', inCart ? 'true' : 'false');
    }
    Array.prototype.forEach.call(addBtns, function (btn) {
      syncAddBtn(btn);
      btn.addEventListener('click', function () {
        if (btn.getAttribute('aria-disabled') === 'true') {
          announce('Mục này đã có trong giỏ hàng.');
          return;
        }
        Cart.add({
          id: btn.getAttribute('data-id'),
          title: btn.getAttribute('data-title'),
          price: btn.getAttribute('data-price')
        });
        syncAddBtn(btn);
        announce('Đã thêm ' + btn.getAttribute('data-title') + ' vào giỏ hàng.');
      });
    });
    document.addEventListener('fixcart:change', function () {
      Array.prototype.forEach.call(addBtns, syncAddBtn);
    });

    /* Hiệu ứng hiện khi cuộn */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
    }

    /* Video nền: tạm dừng / phát (mỗi khối hero có nút riêng) */
    Array.prototype.forEach.call(document.querySelectorAll('[data-hero-video]'), function (video) {
      var sec = video.closest('section');
      var vbtn = sec && sec.querySelector('[data-hero-toggle]');
      if (reduce) { try { video.pause(); } catch (e) { /* bỏ qua */ } }
      if (!vbtn) return;
      vbtn.addEventListener('click', function () {
        var paused = vbtn.getAttribute('aria-pressed') === 'true';
        if (paused) { if (video.play) video.play().catch(function () {}); vbtn.setAttribute('aria-pressed', 'false'); vbtn.textContent = 'Tạm dừng video'; }
        else { video.pause(); vbtn.setAttribute('aria-pressed', 'true'); vbtn.textContent = 'Phát video'; }
      });
    });

    /* Số đếm tăng dần khi cuộn tới (giữ nguyên số nếu giảm chuyển động) */
    var counters = document.querySelectorAll('[data-count]');
    if (!reduce && 'IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          cio.unobserve(en.target);
          var el = en.target, to = Number(el.getAttribute('data-count')), fmt = el.getAttribute('data-format');
          if (!isFinite(to)) return;
          var t0 = null, dur = 1000;
          var step = function (t) {
            if (t0 === null) t0 = t;
            var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
            var v = Math.round(to * e);
            el.textContent = fmt === 'vnd' ? vnd(v) : String(v);
            if (p < 1) window.requestAnimationFrame(step);
          };
          window.requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
    }

    /* ---------- Thông báo "Đã thêm vào giỏ hàng" ---------- */
    var toastHost = null, toastTimer = null;
    function hideToast(el) {
      if (!el || el.classList.contains('is-out')) return;
      el.classList.add('is-out');
      window.setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 420);
    }
    function showToast(detail) {
      if (!toastHost) {
        toastHost = document.createElement('div');
        toastHost.className = 'toast-host';
        document.body.appendChild(toastHost);
      }
      while (toastHost.firstChild) toastHost.removeChild(toastHost.firstChild);
      window.clearTimeout(toastTimer);

      var cartLink = document.querySelector('[data-cart-count]');
      cartLink = cartLink && cartLink.closest('a');
      var items = Cart.read();
      var el = document.createElement('div');
      el.className = 'toast'; el.setAttribute('role', 'status');

      var head = document.createElement('p'); head.className = 'toast-head'; head.textContent = 'Đã thêm vào giỏ hàng';
      var name = document.createElement('p'); name.className = 'toast-name'; name.textContent = detail.title;
      var meta = document.createElement('p'); meta.className = 'toast-meta';
      meta.textContent = 'Giỏ hàng có ' + items.length + ' mục, tổng ' + vnd(Cart.total());
      var actions = document.createElement('div'); actions.className = 'toast-actions';
      var view = document.createElement('a'); view.className = 'btn btn--on-dark btn--small'; view.textContent = 'Xem giỏ hàng';
      view.href = cartLink ? cartLink.getAttribute('href') : '#';
      var undo = document.createElement('button'); undo.type = 'button'; undo.className = 'btn btn--outline-dark btn--small'; undo.textContent = 'Hoàn tác';
      undo.addEventListener('click', function () { Cart.remove(detail.id); hideToast(el); announce('Đã bỏ ' + detail.title + ' khỏi giỏ hàng.'); });
      var close = document.createElement('button'); close.type = 'button'; close.className = 'toast-close'; close.textContent = 'Đóng';
      close.addEventListener('click', function () { hideToast(el); });
      actions.appendChild(view); actions.appendChild(undo);
      var bar = document.createElement('span'); bar.className = 'toast-bar'; bar.setAttribute('aria-hidden', 'true');
      el.appendChild(head); el.appendChild(name); el.appendChild(meta); el.appendChild(actions); el.appendChild(close); el.appendChild(bar);
      toastHost.appendChild(el);

      var start = function () { toastTimer = window.setTimeout(function () { hideToast(el); }, 4500); bar.style.animationPlayState = 'running'; };
      el.addEventListener('mouseenter', function () { window.clearTimeout(toastTimer); bar.style.animationPlayState = 'paused'; });
      el.addEventListener('mouseleave', start);
      start();

      /* nhịp nảy ở số trên nút Giỏ hàng */
      Array.prototype.forEach.call(document.querySelectorAll('[data-cart-count]'), function (c) {
        c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
      });
    }
    document.addEventListener('fixcart:added', function (e) { showToast(e.detail); });

    /* ---------- Giao diện Sáng / Tối ---------- */
    var themeBtns = document.querySelectorAll('[data-theme-set]');
    function currentTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
    function syncThemeBtns() {
      var cur = currentTheme();
      Array.prototype.forEach.call(themeBtns, function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-theme-set') === cur ? 'true' : 'false');
      });
    }
    Array.prototype.forEach.call(themeBtns, function (b) {
      b.addEventListener('click', function () {
        var next = b.getAttribute('data-theme-set');
        if (next === currentTheme()) return;
        var root = document.documentElement;
        if (!reduce) { root.classList.add('theme-fade'); window.setTimeout(function () { root.classList.remove('theme-fade'); }, 450); }
        root.setAttribute('data-theme', next);
        safeSet('fixit_theme', next);
        syncThemeBtns();
        announce(next === 'dark' ? 'Đã chuyển sang giao diện tối.' : 'Đã chuyển sang giao diện sáng.');
      });
    });
    syncThemeBtns();

    /* ---------- Tiêu đề tách từ ---------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-split]'), function (h) {
      if (reduce) return;
      var words = h.textContent.trim().split(/\s+/);
      h.setAttribute('aria-label', words.join(' '));
      h.textContent = '';
      words.forEach(function (w, i) {
        var outer = document.createElement('span'); outer.className = 'w'; outer.setAttribute('aria-hidden', 'true');
        var inner = document.createElement('span'); inner.textContent = w; inner.style.setProperty('--i', String(i));
        outer.appendChild(inner); h.appendChild(outer);
        if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
      });
    });

    /* ---------- Parallax nhẹ ---------- */
    if (!reduce) {
      var ticking = false;
      var onScroll = function () {
        if (ticking) return; ticking = true;
        window.requestAnimationFrame(function () {
          var y = Math.min(window.pageYOffset * 0.18, 60);
          document.documentElement.style.setProperty('--py', String(y));
          document.documentElement.style.setProperty('--by', String(Math.min(window.pageYOffset * 0.08, 140)));
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- Thanh chỉ vị trí trượt ở menu ---------- */
    var navList = document.querySelector('[data-nav-list]');
    if (navList && !reduce) {
      var ind = document.createElement('span'); ind.className = 'nav-ind'; ind.setAttribute('aria-hidden', 'true');
      navList.insertBefore(ind, navList.firstChild);
      var moveTo = function (a) {
        if (!a || window.innerWidth <= 768) { ind.style.opacity = '0'; return; }
        var li = a.parentNode;
        ind.style.opacity = '1';
        ind.style.width = li.offsetWidth + 'px';
        ind.style.transform = 'translateX(' + li.offsetLeft + 'px)';
      };
      var links = navList.querySelectorAll('.nav-link');
      Array.prototype.forEach.call(links, function (a) {
        a.addEventListener('mouseenter', function () { moveTo(a); });
        a.addEventListener('focus', function () { moveTo(a); });
      });
      navList.addEventListener('mouseleave', function () { ind.style.opacity = '0'; });
    }

    /* ---------- Chuyển trang mượt (dự phòng khi trình duyệt chưa hỗ trợ View Transitions) ---------- */
    var hasVT = window.CSS && CSS.supports && CSS.supports('view-transition-name', 'x') && 'CSSViewTransitionRule' in window;
    if (!hasVT && !reduce) {
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (a.target && a.target !== '_self') return;
        var url;
        try { url = new URL(a.href, window.location.href); } catch (err) { return; }
        if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
        if (a.hasAttribute('download') || a.getAttribute('href').charAt(0) === '#') return;
        e.preventDefault();
        var page = document.querySelector('.page');
        if (page) page.classList.add('is-leaving');
        window.setTimeout(function () { window.location.href = a.href; }, 180);
      });
      window.addEventListener('pageshow', function (ev) {
        if (ev.persisted) { var pg = document.querySelector('.page'); if (pg) pg.classList.remove('is-leaving'); }
      });
    }

    /* ---------- Lọc dịch vụ ---------- */
    var fwrap = document.querySelector('[data-svc-filters]');
    if (fwrap) {
      var grid = document.querySelector('[data-svc-grid]');
      var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-service]'));
      var chips = fwrap.querySelectorAll('[data-chip]');
      var selPrice = fwrap.querySelector('[data-f-price]');
      var selSort = fwrap.querySelector('[data-f-sort]');
      var shown = fwrap.querySelector('[data-f-shown]');
      var none = document.querySelector('[data-f-empty]');
      var group = 'all';
      var apply = function () {
        var pr = selPrice.value, n = 0;
        cards.forEach(function (c) {
          var price = Number(c.getAttribute('data-price'));
          var okG = group === 'all' || c.getAttribute('data-group') === group;
          var okP = pr === 'all' || (pr === 'low' && price < 30000) || (pr === 'mid' && price >= 30000 && price < 60000) || (pr === 'high' && price >= 60000);
          var ok = okG && okP;
          c.hidden = !ok;
          if (ok) { n++; c.classList.add('is-visible'); }
        });
        var sorted = cards.slice().sort(function (a, b) {
          if (selSort.value === 'asc') return Number(a.getAttribute('data-price')) - Number(b.getAttribute('data-price'));
          if (selSort.value === 'desc') return Number(b.getAttribute('data-price')) - Number(a.getAttribute('data-price'));
          return Number(a.getAttribute('data-weight')) - Number(b.getAttribute('data-weight'));
        });
        sorted.forEach(function (c) { grid.appendChild(c); });
        shown.textContent = String(n);
        none.hidden = n > 0;
      };
      Array.prototype.forEach.call(chips, function (ch) {
        ch.addEventListener('click', function () {
          group = ch.getAttribute('data-chip');
          Array.prototype.forEach.call(chips, function (o) {
            var on = o === ch; o.classList.toggle('is-active', on); o.setAttribute('aria-pressed', on ? 'true' : 'false');
          });
          apply();
        });
      });
      selPrice.addEventListener('change', apply);
      selSort.addEventListener('change', apply);
    }

    /* Lọc FAQ */
    var filter = document.querySelector('[data-faq-filter]');
    if (filter) {
      var norm = function (s) {
        return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
      };
      var items = document.querySelectorAll('[data-faq-item]');
      var groups = document.querySelectorAll('[data-faq-group]');
      var empty = document.querySelector('[data-faq-empty]');
      filter.addEventListener('input', function () {
        var q = norm(filter.value).trim();
        var shown = 0;
        Array.prototype.forEach.call(items, function (it) {
          var ok = !q || norm(it.textContent).indexOf(q) !== -1;
          it.hidden = !ok;
          if (ok) shown++;
        });
        Array.prototype.forEach.call(groups, function (g) {
          g.hidden = !g.querySelector('[data-faq-item]:not([hidden])');
        });
        if (empty) empty.hidden = shown > 0;
      });
    }

    /* Biểu mẫu liên hệ (demo): chỉ hiện mã yêu cầu mẫu, không gửi dữ liệu đi đâu */
    var cform = document.querySelector('[data-request-form]');
    if (cform) {
      cform.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        [[cform.elements.name, 'c-name-err', 'Vui lòng nhập họ tên hoặc biệt danh.'],
         [cform.elements.contact, 'c-contact-err', 'Vui lòng nhập Zalo hoặc số điện thoại.'],
         [cform.elements.message, 'c-msg-err', 'Vui lòng mô tả ngắn triệu chứng.']].forEach(function (r) {
          var err = document.getElementById(r[1]);
          var bad = !r[0].value.trim();
          r[0].setAttribute('aria-invalid', bad ? 'true' : 'false');
          err.hidden = !bad; err.textContent = bad ? r[2] : '';
          if (bad && ok) { r[0].focus(); ok = false; }
        });
        if (!ok) return;
        var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '', buf = new Uint32Array(4);
        window.crypto.getRandomValues(buf);
        for (var i = 0; i < 4; i++) s += chars[buf[i] % chars.length];
        var done = document.querySelector('[data-request-done]');
        document.querySelector('[data-request-code]').textContent = 'REQ-' + s;
        done.hidden = false; cform.reset(); done.focus();
        announce('Đã ghi nhận yêu cầu mẫu, mã REQ-' + s + '.');
      });
    }

    /* Thẻ chọn loại sự cố và nút chọn cơ sở: chọn sẵn mục tương ứng trong biểu mẫu rồi cuộn tới biểu mẫu */
    Array.prototype.forEach.call(document.querySelectorAll('[data-topic], [data-place]'), function (b) {
      b.addEventListener('click', function () {
        if (!cform) return;
        var isTopic = b.hasAttribute('data-topic');
        var sel = isTopic ? cform.elements.topic : cform.elements.place;
        var want = b.getAttribute(isTopic ? 'data-topic' : 'data-place');
        Array.prototype.forEach.call(sel.options, function (o) { if (o.text === want) sel.value = o.value; });
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var target = document.getElementById('request') || cform;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        window.setTimeout(function () { cform.elements.name.focus({ preventScroll: true }); }, reduce ? 0 : 500);
      });
    });
  });
})();

/* Khi video dịch vụ đang phát: tạm dừng nền động và nền parallax để video phát mượt trên máy yếu */
(function () {
  var root = document.documentElement;
  function bind() {
    Array.prototype.forEach.call(document.querySelectorAll('.media--video video'), function (v) {
      v.addEventListener('play', function () { root.classList.add('video-playing'); });
      v.addEventListener('pause', function () { root.classList.remove('video-playing'); });
      v.addEventListener('ended', function () { root.classList.remove('video-playing'); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* Nút Thích ở phần phản hồi: chỉ đổi số tại chỗ, không lưu và không gửi đi đâu */
(function () {
  function bind() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-like]'), function (b) {
      var base = parseInt(b.getAttribute('data-base'), 10) || 0, n = b.querySelector('[data-like-count]');
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        n.textContent = String(base + (on ? 1 : 0));
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* Trong khung xem trước (iframe), bấm liên kết email sẽ làm trang bị thoát ra màn hình lỗi.
   Ở đó, thay vì mở thư, chỉ sao chép địa chỉ email. Ngoài khung xem trước, liên kết mailto hoạt động bình thường. */
(function () {
  var framed = false;
  try { framed = window.self !== window.top; } catch (e) { framed = true; }
  if (!framed) return;
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="mailto:"]') : null;
    if (!a) return;
    e.preventDefault();
    var addr = a.getAttribute('href').replace(/^mailto:/, '');
    try { navigator.clipboard.writeText(addr); } catch (err) { /* bỏ qua */ }
    var old = a.getAttribute('data-old') || a.textContent;
    a.setAttribute('data-old', old);
    a.textContent = 'Đã sao chép địa chỉ email';
    window.setTimeout(function () { a.textContent = old; }, 1800);
  });
})();

/* Terminal ở trang chủ: gõ từng ký tự của lệnh, rồi hiện kết quả từng dòng.
   Khi bật "giảm chuyển động" hoặc không có JS, toàn bộ nội dung hiện sẵn (CSS không ẩn gì cả). */
(function () {
  function init() {
    var body = document.querySelector('[data-term]');
    if (!body) return;
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var lines = Array.prototype.slice.call(body.querySelectorAll('.tl'));
    if (reduce) { lines.forEach(function (l) { l.classList.add('is-on'); }); return; }

    var cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    var index = 0;

    // Lưu sẵn nội dung các lệnh để gõ lại từng ký tự
    lines.forEach(function (l) {
      var c = l.querySelector('.tc');
      if (c) c.setAttribute('data-full', c.textContent);
    });

    function type(el, text, done) {
      var n = 0;
      (function tick() {
        n += 1;
        el.textContent = text.slice(0, n);
        if (n >= text.length) { done(); return; }
        window.setTimeout(tick, 35 + Math.floor(Math.random() * 45));
      })();
    }

    function step() {
      if (index >= lines.length) return;
      var line = lines[index];
      index += 1;
      var delay = Number(line.getAttribute('data-delay')) || 120;
      window.setTimeout(function () {
        var cmd = line.querySelector('.tc');
        if (cmd) cmd.textContent = '';
        line.classList.add('is-on');
        line.appendChild(cursor);
        if (cmd) type(cmd, cmd.getAttribute('data-full') || '', step);
        else step();
      }, delay);
    }

    // Chỉ bắt đầu khi khối terminal đã vào khung nhìn (trên điện thoại nó nằm dưới phần chữ)
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        step();
      }, { threshold: 0.4 });
      io.observe(body);
    } else {
      step();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Thẻ dịch vụ nghiêng nhẹ và có vệt sáng theo con trỏ.
   Chỉ chạy trên máy có chuột, và tắt khi người dùng bật "giảm chuyển động". */
(function () {
  if (!window.matchMedia) return;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;
  var MAX = 4; // độ nghiêng tối đa, tính bằng độ

  function bind(card) {
    var frame = 0;
    card.addEventListener('pointerenter', function () { card.classList.add('is-tilting'); });
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(function () {
        card.style.setProperty('--ry', ((x - 0.5) * 2 * MAX).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * 2 * MAX).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
    });
    card.addEventListener('pointerleave', function () {
      if (frame) window.cancelAnimationFrame(frame);
      card.classList.remove('is-tilting');
      ['--rx', '--ry', '--mx', '--my'].forEach(function (p) { card.style.removeProperty(p); });
    });
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll('.card--link'), bind); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Hình động ở đầu các trang con: đổi lần lượt các cảnh (.hv-scene), hoặc phát lại khi chỉ có một cảnh.
   Chỉ chạy khi khung đang nằm trong khung nhìn và tab đang mở. Khi bật "giảm chuyển động" thì không đổi cảnh. */
(function () {
  function init() {
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduce) return;

    Array.prototype.forEach.call(document.querySelectorAll('[data-hv-cycle]'), function (box) {
      var scenes = box.querySelectorAll('.hv-scene');
      if (!scenes.length) return;
      var counter = box.querySelector('[data-hv-index]');
      var interval = Number(box.getAttribute('data-hv-interval')) || 6000;
      var current = 0;
      var visible = true;

      function show(next) {
        scenes[current].classList.remove('is-on');
        void scenes[next].offsetWidth; // ép trình duyệt vẽ lại để các hiệu ứng chạy lại từ đầu
        scenes[next].classList.add('is-on');
        current = next;
        if (counter) counter.textContent = String(next + 1);
      }

      window.setInterval(function () {
        if (!visible || document.hidden) return;
        show((current + 1) % scenes.length);
      }, interval);

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        }).observe(box);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* ==========================================================================
   Nền "bảng mạch" cho mọi khối .aurora (hero, đầu trang, các dải màu, khung tím)
   - Lớp tĩnh: lưới chấm, đường mạch đi theo lưới và vát góc 45 độ, chân hàn, chip có nhãn.
     Vẽ một lần lên canvas, chỉ vẽ lại khi khối đổi kích thước.
   - Lớp động: các xung sáng chạy dọc đường mạch, tới cuối đường thì lóe sáng ở chân hàn.
     Chỉ chạy khi khối đang nằm trong khung nhìn và tab đang mở, tối đa 30 khung hình mỗi giây.
   - Bật "giảm chuyển động": chỉ có lớp tĩnh.
   - Hình mạch sinh từ một hạt giống cố định theo thứ tự khối, nên lần nào tải trang cũng giống nhau.
   ========================================================================== */
(function () {
  var probe = document.createElement('canvas');
  if (!probe.getContext || !probe.getContext('2d')) return;

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var GRID = 24;      // khoảng cách lưới (px)
  var CHAMFER = 8;    // độ vát ở chỗ rẽ (px)
  var BUS_GAP = 7;    // khoảng cách giữa các đường trong một bó song song (px)
  var FRAME_MS = 33;  // khoảng 30 khung hình mỗi giây
  var LABELS = ['U1', 'MCU', 'CPU', 'RAM', 'I/O', '0x3F', 'GPU', 'SoC', 'U7', 'NET'];

  var C = {
    dot: 'rgba(255, 255, 255, 0.07)',
    trace: 'rgba(176, 132, 255, 0.22)',
    traceBlue: 'rgba(120, 126, 255, 0.20)',
    pad: 'rgba(210, 186, 255, 0.36)',
    chipLine: 'rgba(210, 186, 255, 0.2)',
    chipFill: 'rgba(255, 255, 255, 0.03)',
    label: 'rgba(255, 255, 255, 0.2)',
    pulse: '232, 214, 255',
    glow: '168, 92, 255'
  };

  /* Bộ sinh số ngẫu nhiên có hạt giống (mulberry32): cùng hạt giống thì ra cùng dãy số */
  function makeRandom(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Các hướng đi: phải, xuống, trái, lên */
  var DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

  /* Đi một đường mạch theo lưới, mỗi đoạn rẽ trái hoặc phải 90 độ */
  function walk(rand, x, y, dir, w, h) {
    var pts = [[x, y]];
    var segments = 2 + Math.floor(rand() * 4);
    for (var i = 0; i < segments; i++) {
      var cells = 2 + Math.floor(rand() * 6);
      var nx = x + DIRS[dir][0] * cells * GRID;
      var ny = y + DIRS[dir][1] * cells * GRID;
      // dừng lại nếu ra khỏi khung
      if (nx < GRID || nx > w - GRID || ny < GRID || ny > h - GRID) break;
      pts.push([nx, ny]);
      x = nx;
      y = ny;
      dir = (dir + (rand() < 0.5 ? 1 : 3)) % 4;
    }
    return pts;
  }

  /* Dời một đường mạch sang bên một khoảng d để tạo bó đường song song (góc rẽ luôn 90 độ) */
  function offsetPath(pts, d) {
    var out = [];
    for (var i = 0; i < pts.length; i++) {
      var nx = 0;
      var ny = 0;
      if (i > 0) {
        var ax = pts[i][0] - pts[i - 1][0];
        var ay = pts[i][1] - pts[i - 1][1];
        var al = Math.hypot(ax, ay) || 1;
        nx += -ay / al;
        ny += ax / al;
      }
      if (i < pts.length - 1) {
        var bx = pts[i + 1][0] - pts[i][0];
        var by = pts[i + 1][1] - pts[i][1];
        var bl = Math.hypot(bx, by) || 1;
        nx += -by / bl;
        ny += bx / bl;
      }
      out.push([pts[i][0] + nx * d, pts[i][1] + ny * d]);
    }
    return out;
  }

  /* Vát các góc rẽ thành 45 độ, rồi tính sẵn độ dài cộng dồn để xung sáng chạy theo */
  function chamfer(pts) {
    var out = [pts[0]];
    for (var i = 1; i < pts.length - 1; i++) {
      var p = pts[i - 1];
      var v = pts[i];
      var n = pts[i + 1];
      var inLen = Math.hypot(v[0] - p[0], v[1] - p[1]);
      var outLen = Math.hypot(n[0] - v[0], n[1] - v[1]);
      var c = Math.min(CHAMFER, inLen / 2, outLen / 2);
      out.push([v[0] - (v[0] - p[0]) / inLen * c, v[1] - (v[1] - p[1]) / inLen * c]);
      out.push([v[0] + (n[0] - v[0]) / outLen * c, v[1] + (n[1] - v[1]) / outLen * c]);
    }
    out.push(pts[pts.length - 1]);
    var acc = [0];
    for (var j = 1; j < out.length; j++) {
      acc.push(acc[j - 1] + Math.hypot(out[j][0] - out[j - 1][0], out[j][1] - out[j - 1][1]));
    }
    return { pts: out, acc: acc, len: acc[acc.length - 1] };
  }

  /* Vị trí trên đường mạch ở khoảng cách s tính từ đầu đường */
  function pointAt(tr, s) {
    var i = 1;
    while (i < tr.acc.length - 1 && tr.acc[i] < s) i++;
    var seg = tr.acc[i] - tr.acc[i - 1] || 1;
    var k = Math.max(0, Math.min(1, (s - tr.acc[i - 1]) / seg));
    var a = tr.pts[i - 1];
    var b = tr.pts[i];
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  }

  /* Sinh toàn bộ hình mạch cho một khối có kích thước w x h */
  function design(w, h, seed, keep) {
    var rand = makeRandom(seed);
    var area = w * h;
    var chips = [];
    var traces = [];

    // 1. Chip: ưu tiên nửa bên phải để không nằm sau chữ tiêu đề
    var chipCount = Math.max(1, Math.round(area / 420000));
    var minX = w > 900 ? w * 0.48 : GRID;
    for (var c = 0; c < chipCount * 12 && chips.length < chipCount; c++) {
      var cw = (3 + Math.floor(rand() * 3)) * GRID;
      var ch = (2 + Math.floor(rand() * 2)) * GRID;
      if (cw > w - 4 * GRID || ch > h - 4 * GRID) continue;
      var cx = Math.round((minX + rand() * Math.max(0, w - minX - cw - 2 * GRID)) / GRID) * GRID;
      var cy = Math.round((2 * GRID + rand() * Math.max(0, h - ch - 4 * GRID)) / GRID) * GRID;
      var clash = chips.some(function (o) {
        return cx < o.x + o.w + 2 * GRID && cx + cw + 2 * GRID > o.x && cy < o.y + o.h + 2 * GRID && cy + ch + 2 * GRID > o.y;
      });
      // không đặt chip sau chữ, nút hay khung nội dung (chừa thêm nửa ô lưới)
      var underText = keep.some(function (r) {
        var pad = GRID / 2;
        return cx < r.x + r.w + pad && cx + cw + pad > r.x && cy < r.y + r.h + pad && cy + ch + pad > r.y;
      });
      if (clash || underText) continue;
      chips.push({ x: cx, y: cy, w: cw, h: ch, label: LABELS[Math.floor(rand() * LABELS.length)] });
    }

    // 2. Đường mạch: một phần đi ra từ chân chip, phần còn lại bắt đầu ngẫu nhiên; khoảng 1/3 đi thành bó
    var traceCount = Math.max(4, Math.round(area / 30000));
    for (var t = 0; t < traceCount; t++) {
      var x;
      var y;
      var dir;
      if (chips.length && rand() < 0.45) {
        var chip = chips[Math.floor(rand() * chips.length)];
        var side = Math.floor(rand() * 4);
        if (side === 0) { x = chip.x + chip.w; y = chip.y + GRID * (1 + Math.floor(rand() * (chip.h / GRID - 1))); dir = 0; }
        else if (side === 1) { x = chip.x + GRID * (1 + Math.floor(rand() * (chip.w / GRID - 1))); y = chip.y + chip.h; dir = 1; }
        else if (side === 2) { x = chip.x; y = chip.y + GRID * (1 + Math.floor(rand() * (chip.h / GRID - 1))); dir = 2; }
        else { x = chip.x + GRID * (1 + Math.floor(rand() * (chip.w / GRID - 1))); y = chip.y; dir = 3; }
      } else {
        x = GRID * (1 + Math.floor(rand() * Math.max(1, w / GRID - 2)));
        y = GRID * (1 + Math.floor(rand() * Math.max(1, h / GRID - 2)));
        dir = Math.floor(rand() * 4);
      }
      var base = walk(rand, x, y, dir, w, h);
      if (base.length < 2) continue;
      var color = rand() < 0.3 ? C.traceBlue : C.trace;
      var lanes = rand() < 0.35 ? 2 + Math.floor(rand() * 3) : 1;
      for (var l = 0; l < lanes; l++) {
        var path = l === 0 ? base : offsetPath(base, l * BUS_GAP);
        var tr = chamfer(path);
        tr.color = color;
        tr.via = rand() < 0.4;
        traces.push(tr);
      }
    }
    return { chips: chips, traces: traces };
  }

  /* Vẽ lớp tĩnh */
  function drawStatic(ctx, w, h, plan) {
    ctx.clearRect(0, 0, w, h);

    // lưới chấm
    ctx.fillStyle = C.dot;
    for (var gx = GRID / 2; gx < w; gx += GRID) {
      for (var gy = GRID / 2; gy < h; gy += GRID) ctx.fillRect(gx, gy, 1, 1);
    }

    // đường mạch
    ctx.lineWidth = 1.2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    plan.traces.forEach(function (tr) {
      ctx.strokeStyle = tr.color;
      ctx.beginPath();
      ctx.moveTo(tr.pts[0][0], tr.pts[0][1]);
      for (var i = 1; i < tr.pts.length; i++) ctx.lineTo(tr.pts[i][0], tr.pts[i][1]);
      ctx.stroke();
    });

    // chân hàn ở cuối mỗi đường (một số là lỗ xuyên mạch)
    ctx.lineWidth = 1;
    plan.traces.forEach(function (tr) {
      var end = tr.pts[tr.pts.length - 1];
      ctx.strokeStyle = C.pad;
      ctx.beginPath();
      ctx.arc(end[0], end[1], tr.via ? 3.4 : 2.4, 0, Math.PI * 2);
      ctx.stroke();
      if (tr.via) {
        ctx.fillStyle = C.pad;
        ctx.beginPath();
        ctx.arc(end[0], end[1], 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // chip: thân, chân hai cạnh dài, nhãn
    plan.chips.forEach(function (chip) {
      ctx.fillStyle = C.chipFill;
      ctx.fillRect(chip.x, chip.y, chip.w, chip.h);
      ctx.strokeStyle = C.chipLine;
      ctx.lineWidth = 1;
      ctx.strokeRect(chip.x + 0.5, chip.y + 0.5, chip.w - 1, chip.h - 1);
      ctx.beginPath();
      for (var px = chip.x + 8; px < chip.x + chip.w - 4; px += 8) {
        ctx.moveTo(px, chip.y - 5);
        ctx.lineTo(px, chip.y);
        ctx.moveTo(px, chip.y + chip.h);
        ctx.lineTo(px, chip.y + chip.h + 5);
      }
      ctx.stroke();
      ctx.fillStyle = C.label;
      ctx.font = '10px ui-monospace, Menlo, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(chip.label, chip.x + chip.w / 2, chip.y + chip.h / 2);
    });

    // làm nhạt dần về bên trái (nơi thường có chữ tiêu đề) để nền không tranh với chữ
    if (fadeLeft(w)) {
      var fade = ctx.createLinearGradient(0, 0, w * 0.55, 0);
      fade.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
      fade.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w * 0.55, h);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  /* Chỉ làm nhạt bên trái với các khối rộng (hero, đầu trang, dải màu), không làm với khung nhỏ */
  function fadeLeft(w) { return w > 700; }

  /* Độ sáng của xung theo vị trí ngang: bên trái nhạt bằng một nửa, giống lớp tĩnh */
  function sideAlpha(x, w) {
    if (!fadeLeft(w)) return 1;
    return 0.5 + 0.5 * Math.min(1, x / (w * 0.55));
  }

  /* Một khối .aurora có nền bảng mạch */
  function Board(el, seed) {
    this.el = el;
    this.seed = seed;
    this.visible = false;
    this.pulses = [];
    this.flashes = [];
    this.wrap = document.createElement('div');
    this.wrap.className = 'circuit';
    this.wrap.setAttribute('aria-hidden', 'true');
    this.base = document.createElement('canvas');
    this.fx = document.createElement('canvas');
    this.wrap.appendChild(this.base);
    this.wrap.appendChild(this.fx);
    el.appendChild(this.wrap);
    this.resize();
  }

  Board.prototype.resize = function () {
    var w = this.el.clientWidth;
    var h = this.el.clientHeight;
    if (!w || !h || (w === this.w && h === this.h)) return;
    this.w = w;
    this.h = h;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var fdpr = 1;
    this.base.width = Math.round(w * dpr);
    this.base.height = Math.round(h * dpr);
    this.fx.width = Math.round(w * fdpr);
    this.fx.height = Math.round(h * fdpr);
    this.fdpr = fdpr;
    this.plan = design(w, h, this.seed, this.keepOut());
    var ctx = this.base.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawStatic(ctx, w, h, this.plan);
    this.rand = makeRandom(this.seed + 99);
    this.pulses = [];
    this.flashes = [];
    var usable = this.plan.traces.filter(function (tr) { return tr.len > 120; });
    this.usable = usable.length ? usable : this.plan.traces;
    var count = Math.max(2, Math.round(this.plan.traces.length * 0.25));
    for (var i = 0; i < count; i++) this.pulses.push(this.spawn(true));
  };

  /* Vị trí các phần nội dung (chữ, nút, khung) bên trong khối, tính theo tọa độ của khối */
  Board.prototype.keepOut = function () {
    var box = this.el.getBoundingClientRect();
    var sel = 'h1, h2, h3, p, .btn, .hv-panel, .term, .badges, .ab-crew, .ab-toc, .pack-strip, .svc-facts, dl, form';
    var rects = [];
    Array.prototype.forEach.call(this.el.querySelectorAll(sel), function (n) {
      var r = n.getBoundingClientRect();
      if (!r.width || !r.height) return;
      rects.push({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height });
    });
    return rects;
  };

  /* Tạo một xung sáng mới trên một đường mạch ngẫu nhiên (có chờ một chút trước khi chạy) */
  Board.prototype.spawn = function (first) {
    var tr = this.usable[Math.floor(this.rand() * this.usable.length)];
    return {
      tr: tr,
      s: -this.rand() * (first ? tr.len : 260),
      speed: 70 + this.rand() * 90,
      tail: 46 + this.rand() * 50
    };
  };

  Board.prototype.frame = function (dt) {
    var ctx = this.fx.getContext('2d');
    var self = this;
    ctx.setTransform(this.fdpr, 0, 0, this.fdpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    this.pulses.forEach(function (p, idx) {
      p.s += p.speed * dt;
      if (p.s - p.tail > p.tr.len) {
        var end = p.tr.pts[p.tr.pts.length - 1];
        self.flashes.push({ x: end[0], y: end[1], age: 0 });
        self.pulses[idx] = self.spawn(false);
        return;
      }
      if (p.s <= 0) return;
      var head = Math.min(p.s, p.tr.len);
      var tailStart = Math.max(0, p.s - p.tail);
      // đuôi: 8 đoạn nhỏ, càng gần đầu càng sáng
      var STEPS = 8;
      ctx.lineWidth = 1.8;
      for (var k = 0; k < STEPS; k++) {
        var s0 = tailStart + (head - tailStart) * (k / STEPS);
        var s1 = tailStart + (head - tailStart) * ((k + 1) / STEPS);
        var a = pointAt(p.tr, s0);
        var b = pointAt(p.tr, s1);
        var fadeK = sideAlpha(b[0], self.w);
        ctx.strokeStyle = 'rgba(' + C.pulse + ',' + ((0.08 + 0.7 * (k + 1) / STEPS) * fadeK).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
      // đầu xung
      if (p.s <= p.tr.len) {
        var hp = pointAt(p.tr, head);
        var ha = sideAlpha(hp[0], self.w);
        ctx.fillStyle = 'rgba(' + C.glow + ',' + (0.22 * ha).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(hp[0], hp[1], 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(' + C.pulse + ',' + ha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(hp[0], hp[1], 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // lóe sáng ở chân hàn khi xung chạy tới cuối đường
    this.flashes = this.flashes.filter(function (f) {
      f.age += dt;
      if (f.age > 0.6) return false;
      var k = f.age / 0.6;
      ctx.strokeStyle = 'rgba(' + C.pulse + ',' + (0.85 * (1 - k)).toFixed(3) + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 3 + k * 12, 0, Math.PI * 2);
      ctx.stroke();
      return true;
    });
    ctx.globalCompositeOperation = 'source-over';
  };

  function init() {
    var els = document.querySelectorAll('.aurora');
    if (!els.length) return;
    var boards = [];
    Array.prototype.forEach.call(els, function (el, i) {
      boards.push(new Board(el, 1000 + i * 7919));
    });

    // vẽ lại khi khối đổi kích thước
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function (entries) {
        entries.forEach(function (en) {
          boards.forEach(function (b) { if (b.el === en.target) b.resize(); });
        });
      });
      boards.forEach(function (b) { ro.observe(b.el); });
    } else {
      var timer = 0;
      window.addEventListener('resize', function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { boards.forEach(function (b) { b.resize(); }); }, 200);
      });
    }

    if (reduce) return; // chỉ giữ lớp tĩnh

    // vòng lặp chung: chỉ vẽ các khối đang thấy, tạm dừng khi không còn khối nào trong khung nhìn
    var running = false;
    var last = 0;
    function loop(now) {
      var active = boards.filter(function (b) { return b.visible; });
      if (!active.length || document.hidden) { running = false; return; }
      if (!last) last = now;
      var dt = now - last;
      if (dt >= FRAME_MS) {
        last = now;
        var sec = Math.min(dt, 100) / 1000; // sau khi tab bị ẩn lâu, không cho xung nhảy cóc
        active.forEach(function (b) { b.frame(sec); });
      }
      window.requestAnimationFrame(loop);
    }
    function start() {
      if (running) return;
      running = true;
      last = 0;
      window.requestAnimationFrame(loop);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          boards.forEach(function (b) {
            if (b.el !== en.target) return;
            b.visible = en.isIntersecting;
            if (!b.visible) b.fx.getContext('2d').clearRect(0, 0, b.fx.width, b.fx.height);
          });
        });
        start();
      });
      boards.forEach(function (b) { io.observe(b.el); });
    } else {
      boards.forEach(function (b) { b.visible = true; });
      start();
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
