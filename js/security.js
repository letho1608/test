/**
 * ============================================================================
 * VÔ HẠN TRÙNG SINH (1 IN 8 BILLION) - SECURITY SHIELD & ANTI-CHEAT ENGINE
 * Bản quyền thuộc về tác giả ThoLe. Bảo vệ chống dịch ngược, can thiệp & đánh cắp.
 * ============================================================================
 */
(function (global) {
  'use strict';

  // Khóa bí mật nội bộ dùng để ký số dữ liệu lưu trữ (Tamper-evident HMAC signature)
  const _K0 = 'VHTS_SEC_' + [0x54, 0x68, 0x6f, 0x4c, 0x65, 0x5f, 0x38, 0x42].map(c => String.fromCharCode(c)).join('');

  // 1. CHỐNG NHÚNG IFRAME (Anti-Frame / Clickjacking Protection)
  function preventFraming() {
    try {
      if (window.top !== window.self) {
        window.top.location = window.self.location.href;
      }
    } catch (e) {
      // Bị chặn bơi CSP của trang cha -> tự hủy trang để chống bị nhúng trộm
      try {
        document.documentElement.innerHTML = '<h3 style="color:#fff;text-align:center;padding:50px;font-family:sans-serif">Nghiêm cấm nhúng trò chơi vào website khác.</h3>';
      } catch (err) {}
    }
  }
  preventFraming();

  // 2. CHỐNG CHUỘT PHẢI & CÁC PHÍM TẮT XEM MÃ NGUỒN (Anti-Inspection & Keylocks)
  function lockShortcuts() {
    // Chặn menu chuột phải
    document.addEventListener('contextmenu', function (e) {
      // Cho phép nếu đang ở trong thẻ input hoặc textarea để dán/chép
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      return false;
    }, { capture: true });

    // Chặn kéo thả hình ảnh / nội dung để chống lưu trộm asset
    document.addEventListener('dragstart', function (e) {
      if (e.target && e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    }, { capture: true });

    // Chặn phím tắt mở DevTools, View-source, Save-page
    window.addEventListener('keydown', function (e) {
      const k = e.key || '';
      const code = e.keyCode || 0;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // F12
      if (k === 'F12' || code === 123) {
        e.preventDefault();
        e.stopPropagation();
        triggerTamperAlert('F12');
        return false;
      }

      // Ctrl + Shift + I (Inspect)
      // Ctrl + Shift + J (Console)
      // Ctrl + Shift + C (Element picker)
      // Ctrl + Shift + K (Firefox console)
      // Ctrl + Shift + E (Firefox network)
      if (ctrl && shift && ['I', 'i', 'J', 'j', 'C', 'c', 'K', 'k', 'E', 'e'].includes(k)) {
        e.preventDefault();
        e.stopPropagation();
        triggerTamperAlert('DevTools Key');
        return false;
      }

      // Ctrl + U (View Source)
      if (ctrl && (k === 'u' || k === 'U' || code === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + S (Save Page)
      if (ctrl && (k === 's' || k === 'S' || code === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + P (Print)
      if (ctrl && (k === 'p' || k === 'P' || code === 80)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, { capture: true });
  }

  // 3. VÔ HIỆU HÓA CONSOLE VÀ RÒ RỈ DỮ LIỆU (Console Neutralization)
  function neutraliseConsole() {
    const noop = function () {};
    const methods = ['log', 'debug', 'info', 'dir', 'dirxml', 'table', 'trace', 'group', 'groupCollapsed', 'groupEnd'];
    
    // Ghi đè để không in thông tin nội bộ ra màn hình
    if (window.console) {
      for (let i = 0; i < methods.length; i++) {
        try {
          window.console[methods[i]] = noop;
        } catch (e) {}
      }
    }
  }

  // 4. BẪY PHÁT HIỆN DEVTOOLS VÀ BẢO VỆ CHỐNG DEBUGGER (Anti-Debugging Trap)
  let devtoolsDetected = false;

  function triggerTamperAlert(reason) {
    if (devtoolsDetected) return;
    devtoolsDetected = true;

    // Hiển thị màn hình cảnh báo bảo mật
    const overlay = document.createElement('div');
    overlay.id = 'sec_alert_overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#05070a;color:#fff;z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,sans-serif;text-align:center;padding:24px;box-sizing:border-box';
    overlay.innerHTML = `
      <div style="max-width:540px;background:#0d1117;border:1px solid rgba(220,38,38,0.5);border-radius:12px;padding:32px;box-shadow:0 10px 40px rgba(0,0,0,0.8)">
        <div style="font-size:48px;margin-bottom:16px">🛡️</div>
        <h2 style="margin:0 0 12px;color:#ef4444;font-size:20px;font-weight:700">CẢNH BÁO BẢO MẬT & BẢN QUYỀN</h2>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#94a3b8">
          Phát hiện thao tác kiểm tra mã nguồn hoặc mở DevTools. Vì lý do bảo vệ bản quyền và chống gian lận, phiên chơi đã tạm dừng.
        </p>
        <p style="margin:0 0 24px;font-size:13px;color:#64748b">
          Vui lòng đóng công cụ lập trình viên (F12) và tải lại trang để tiếp tục trải nghiệm bình thường.
        </p>
        <button onclick="location.reload()" style="background:#dc2626;color:#fff;border:none;padding:10px 24px;border-radius:6px;font-weight:600;font-size:14px;cursor:pointer">
          Tải lại trò chơi
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Kích hoạt bẫy debugger đóng băng DevTools
    setInterval(function () {
      (function () {
        return false;
      }['constructor']('debugger')());
    }, 50);
  }

  function startDevToolsWatcher() {
    // Kỹ thuật 1: Kiểm tra chênh lệch thời gian thực thi debugger
    setInterval(function () {
      const t0 = performance.now();
      // Đo độ trễ
      (function () {
        return false;
      }['constructor']('debugger')());
      const t1 = performance.now();
      if (t1 - t0 > 100) {
        triggerTamperAlert('Debugger Delay');
      }
    }, 2000);

    // Kỹ thuật 2: Kiểm tra chênh lệch kích thước window khi DevTools tách rời hoặc docking
    const checkThreshold = 160;
    window.addEventListener('resize', function () {
      const wDiff = window.outerWidth - window.innerWidth;
      const hDiff = window.outerHeight - window.innerHeight;
      if (wDiff > checkThreshold || hDiff > checkThreshold) {
        // Có khả năng DevTools vừa được mở dock sang bên phải hoặc bên dưới
        // Kết hợp kiểm tra debugger để tránh false-positive
        const t0 = performance.now();
        (function () {
          return false;
        }['constructor']('debugger')());
        if (performance.now() - t0 > 50) {
          triggerTamperAlert('Window Delta');
        }
      }
    });
  }

  // 5. CHỐNG HACK LOCALSTORAGE & CAN THIỆP FILE LƯU TRỮ (Tamper-evident Data Integrity)
  // Tạo hàm băm mã số kiểm tra (Hash Checksum)
  function computeHash(dataStr) {
    let hash = 0x811c9dc5;
    const full = _K0 + '::' + dataStr;
    for (let i = 0; i < full.length; i++) {
      hash ^= full.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16);
  }

  // Wrapper bảo vệ LocalStorage
  const SecureStorage = {
    setItem: function (key, value) {
      try {
        const valStr = typeof value === 'string' ? value : JSON.stringify(value);
        const sig = computeHash(valStr);
        localStorage.setItem(key, valStr);
        localStorage.setItem('__sig_' + key, sig);
        return true;
      } catch (e) {
        return false;
      }
    },
    getItem: function (key, defaultVal) {
      try {
        const valStr = localStorage.getItem(key);
        if (valStr === null) return defaultVal;
        const storedSig = localStorage.getItem('__sig_' + key);
        
        // Nếu đã có chữ ký, kiểm tra tính toàn vẹn
        if (storedSig) {
          const expectedSig = computeHash(valStr);
          if (storedSig !== expectedSig) {
            // Dữ liệu bị ai đó can thiệp sửa đổi trái phép trong LocalStorage!
            console.warn && console.warn('[Security] Phát hiện can thiệp dữ liệu: ' + key);
            return defaultVal;
          }
        }
        return valStr;
      } catch (e) {
        return defaultVal;
      }
    },
    getJSON: function (key, defaultVal) {
      const valStr = this.getItem(key, null);
      if (valStr === null) return defaultVal;
      try {
        return JSON.parse(valStr);
      } catch (e) {
        return defaultVal;
      }
    },
    removeItem: function (key) {
      try {
        localStorage.removeItem(key);
        localStorage.removeItem('__sig_' + key);
      } catch (e) {}
    }
  };

  // 6. ĐÓNG BĂNG PROTOTYPE TOÀN CỤC CHỐNG MONKEY-PATCHING
  function hardenPrototypes() {
    try {
      if (Object.freeze) {
        // Khóa các phương thức cốt lõi không cho phép inject script ghi đè
        Object.freeze(Math);
      }
    } catch (e) {}
  }

  // Khởi chạy khi DOM sẵn sàng
  lockShortcuts();
  neutraliseConsole();
  hardenPrototypes();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDevToolsWatcher);
  } else {
    startDevToolsWatcher();
  }

  // Xuất SecureStorage vào phạm vi nội bộ (hoặc global bảo mật)
  global.__SECURE_STORAGE__ = SecureStorage;

})(typeof window !== 'undefined' ? window : this);
