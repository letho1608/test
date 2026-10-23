// js/pixel.js - Do hoa pixel (PX/MO/RC)
function birthShareText() {
  const b = BB(), sh = share(b), u5 = 1 - cohortL(S.born, S.sex, 5);
  if (S.era === 'past') return L`나는 ${S.by}년, ${S.bornCity ? cityIn(b.ko, S.bornCity) : L`${b.ko} 농촌 마을`}의 ${QSHORT[S.q]}에서 ${S.sex === 'F' ? "bé gái" : "bé trai"}로 태어났다.\n그해 태어난 아기 ${Math.round(1 / sh).toLocaleString('vi-VN')}명 중 1명꼴, 5살 전에 세상을 떠날 확률 ${pctStr(u5, 1)}.\n너는 어디서 태어날까? #VoHanTrungSinh`;
  return L`나는 ${S.bornCity ? cityIn(b.ko, S.bornCity) : L`${b.ko} 농촌 마을`}의 ${QSHORT[S.q]}에서 ${S.sex === 'F' ? "bé gái" : "bé trai"}로 태어났다.\n지금 태어나는 아기 ${Math.round(1 / sh).toLocaleString('vi-VN')}명 중 1명꼴, 5살 전에 세상을 떠날 확률 ${pctStr(u5, 1)}.\n너는 어디서 태어날까? #VoHanTrungSinh`;
}
const IN_APP = /Barcelona|Instagram|FBAN|FBAV|FB_IAB|KAKAOTALK|NAVER\(inapp| Line\/|Twitter|DaumApps|; wv\)/i.test(navigator.userAgent || '');
function cardImgSrc(cc) { return (IN_APP && cc.dataUrl) || cc.url; }
function inAppSave(cc) {
  openSheet("Lưu ảnh", L`<img class="cardimg" src="${cc.dataUrl || cc.url}" alt="인생 카드">
    <div class="sheetact"><p><b>위 카드를 길게 눌러</b> '이미지 저장' 또는 '공유'를 골라 주세요.</p>
    <small>스레드·인스타·카카오톡 같은 앱 안에서 열린 화면에서는 버튼으로 바로 저장하거나 공유하는 기능이 막혀 있어요. 길게 눌러도 안 되면 화면을 캡처해 주세요. 다음부터는 오른쪽 위 메뉴의 '다른 브라우저로 열기'로 시작하면 버튼이 잘 작동해요.</small></div>`);
  track('card_save', { kind: 'inapp_' + cc.kind });
}
function inAppShare(cc) {
  openSheet("Chia sẻ", L`<div class="sheetact"><button class="cta" id="copyLinkBtn" data-kind="${cc.kind}">글과 링크 복사하기</button>
    <small>${pasteWhere()} 붙여넣으면 이 삶이 미리보기와 함께 보여요.</small></div>
    <img class="cardimg" src="${cc.dataUrl || cc.url}" alt="인생 카드">
    <div class="sheetact"><p><b>카드 이미지는 길게 눌러</b> '이미지 저장'이나 '공유'를 골라 주세요.</p>
    <small>앱 안에서 열린 화면에서는 이미지 버튼이 막혀 있어요. 길게 눌러도 안 되면 화면을 캡처해 주세요.</small></div>`);
  track('card_share', { kind: 'inapp_' + cc.kind });
}
function shareCard() {
  const cc = cardCache; if (!cc.blob) { toast("Thẻ vẫn đang được tạo. Vui lòng nhấn lại sau giây lát."); return; }
  const text = cc.kind === 'death' ? shareText() : birthShareText();
  const data = cc.file ? { files: [cc.file], text } : null;
  if (data && navigator.canShare && navigator.canShare(data)) {
    navigator.share(data).then(() => track('card_share', { kind: cc.kind === 'death' ? shareKind('death') : cc.kind })).catch(e => { if (!e || e.name !== 'AbortError') saveCard(); });
    return;
  }
  if (IN_APP) { inAppShare(cc); return; }
  saveCard();
}
function saveCard() {
  const cc = cardCache; if (!cc.url) return;
  if (IN_APP) { inAppSave(cc); return; }
  const a = document.createElement('a'); a.href = cc.url; a.download = cc.name; document.body.appendChild(a); a.click(); a.remove();
  toast("Đã bắt đầu lưu ảnh. Nếu không được, hãy nhấn giữ hoặc nhấp chuột phải vào thẻ để lưu.");
  track('card_save', { kind: cc.kind });
}
async function shareSheet(auto) {
  if (!S || !S.deathAt) return;
  openSheet("Chia sẻ cuộc đời này", "<p>Đang tạo thẻ…</p>");
  const cc = await prepCard('death'); if ($('#sheet').hidden) return;
  const img = !IN_APP && cc && cc.file && navigator.canShare && navigator.canShare({ files: [cc.file] });
  const lead = auto ? "Một cuộc đời đã khép lại. Bạn có muốn để lại một dòng cảm nhận về cuộc đời vừa sống và chia sẻ nó không?" : "Hãy để lại một dòng cảm nhận về cuộc đời vừa sống, rồi chọn nơi chia sẻ.";
  $('#sheet .bd').innerHTML = `<p class="sh-lead">${lead}</p>
    ${shareNoteHTML('shNote')}
    <div class="sh-acts">
      ${img ? `<button class="cta" id="shImg">${"Chia sẻ dạng ảnh"}<small>${"Zalo, Facebook, Instagram, Threads, X…"}</small></button>` : ''}
      ${IN_APP ? `<button class="cta" id="shCopy">${"Sao chép lời và liên kết"}<small>${L`${pasteWhere()} 붙여넣기`}</small></button>` : ''}
      ${IN_APP ? '' : `<button class="ghost" id="shCopy">${"Sao chép lời và liên kết"}</button><button class="ghost" id="cardSaveBtn">${"Lưu ảnh"}</button>`}
    </div>
    <details class="sh-prevd"><summary>${"Xem bài sẽ đăng"}</summary><p class="sharetext" id="shPrev">${esc(shareText())}</p></details>
    ${cc ? `<img class="cardimg sh-card" src="${cardImgSrc(cc)}" alt="${esc(L`${S.name.full}의 인생 기록 카드`)}">` : ''}
    <small class="sh-note">${"Muốn đăng kèm ảnh thẻ, hãy lưu ảnh rồi đính kèm."}</small>`;
  track('card_open', { kind: auto ? 'auto' : 'sheet' });
}
async function openCardSheet(kind) {
  openSheet(kind === 'death' ? "Thẻ cuộc đời" : "Thẻ chào đời", "<p>Đang tạo thẻ…</p>");
  const cc = await prepCard(kind);
  if ($('#sheet').hidden) return;
  if (!cc) { $('#sheet .bd').innerHTML = "<p>Không tạo được thẻ. Vui lòng tải lại trang rồi thử lại.</p>"; return; }
  $('#sheet .bd').innerHTML = L`<img class="cardimg" src="${cardImgSrc(cc)}" alt="${esc(kind === 'death' ? L`${S.name.full}의 인생 기록 카드` : L`${S.name.full}의 출생 카드`)}">
    <div class="sheetact"><button class="cta" id="cardShareBtn">이미지 공유하기</button><button class="ghost" id="cardSaveBtn">이미지 저장</button><button class="ghost" id="${kind === 'death' ? 'shareBtn' : 'birthCopyBtn'}">글·링크 복사</button>
    <small>휴대폰에서는 '이미지 공유하기'로 스레드·인스타·카톡에 바로 올릴 수 있어요. 저장이 안 되면 카드를 길게 눌러 저장하세요.</small></div>`;
  track('card_open', { kind });
}
const TG = {
  data: null,
  at: 0,
  land: null,
  base: null,
  cell: 0,
  pulses: [],
  seen: new Set(),
  queue: [],
  raf: 0,
  on: false,
  feedI: 0,
  feedT: 0,
  // Chế độ hiển thị: '3d' (Quả địa cầu 3D tương tác) hoặc '2d' (Bản đồ phẳng)
  mode: (typeof localStorage !== 'undefined' && localStorage.getItem('tg_mode')) || '3d',
  rotY: -2.05, // Góc quay kinh độ ban đầu (hướng về châu Á / Việt Nam / Thái Bình Dương)
  rotX: 0.38,  // Góc nghiêng vĩ độ ban đầu (~22 độ tự nhiên của trục Trái Đất)
  velY: 0,
  velX: 0,
  dragging: false,
  dragMoved: false,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  hasInteracted: false,
  spherePoints: null,
  countryPoints: null,
  lastLocalPulse: 0
};

function tgLand() {
  if (TG.land) return TG.land;
  const raw = atob(WORLD.land), out = [];
  for (let i = 0; i < WORLD.w * WORLD.h; i++) if (raw.charCodeAt(i >> 3) & (128 >> (i & 7))) out.push([i % WORLD.w, Math.floor(i / WORLD.w)]);
  return (TG.land = out);
}

function tgInitSphere() {
  if (TG.spherePoints) return;
  const land = tgLand();
  const spherePts = new Float32Array(land.length * 3);
  for (let i = 0; i < land.length; i++) {
    const [x, y] = land[i];
    const lam = (x / WORLD.w) * Math.PI * 2 - Math.PI;
    const phi = (0.5 - y / WORLD.h) * Math.PI;
    const cosPhi = Math.cos(phi);
    spherePts[i * 3]     = cosPhi * Math.sin(lam); // X0
    spherePts[i * 3 + 1] = -Math.sin(phi);         // Y0
    spherePts[i * 3 + 2] = cosPhi * Math.cos(lam); // Z0
  }
  TG.spherePoints = spherePts;

  const countries = {};
  for (const [iso, pt] of Object.entries(WORLD.at)) {
    const lam = (pt[0] / WORLD.w) * Math.PI * 2 - Math.PI;
    const phi = (0.5 - pt[1] / WORLD.h) * Math.PI;
    const cosPhi = Math.cos(phi);
    countries[iso] = {
      x0: cosPhi * Math.sin(lam),
      y0: -Math.sin(phi),
      z0: cosPhi * Math.cos(lam),
      flatX: pt[0],
      flatY: pt[1]
    };
  }
  TG.countryPoints = countries;
}

const tgAgo = s => s < 60 ? "vừa xong" : s < 3600 ? L`${Math.round(s / 60)}분 전` : L`${Math.round(s / 3600)}시간 전`;
function tgEventText(k, c, a) {
  const n = CBY[c] ? (CBY[c].ko || CBY[c].name || c) : c;
  if (k === 'b') return `Một sinh mệnh vừa chào đời tại ${n}`;
  return a === 0 ? `Một em bé tại ${n} chưa kịp tròn một tuổi đã qua đời` : `Một sinh mệnh tại ${n} vừa tạ thế ở tuổi ${a}`;
}

function tgFeed(reset) {
  const el = $('#tgFeed'), r = TG.data && TG.data.recent; if (!el) return;
  if (!r || !r.length) { el.textContent = ''; return; }
  if (reset) TG.feedI = 0;
  const ev = r[r.length - 1 - (TG.feedI % r.length)], ago = ev[0] + Math.round((Date.now() - TG.at) / 1000);
  el.textContent = `${tgAgo(ago)} · ${tgEventText(ev[1], ev[2], ev[3])}`;
  TG.feedT = Date.now();
}

function tgUpdateModeUI() {
  const hint = $('#globeHint');
  if (hint) {
    if (TG.mode === '3d' && !TG.hasInteracted) {
      hint.classList.remove('hidden');
    } else {
      hint.classList.add('hidden');
    }
  }
}

function tgToggleMode() {
  TG.mode = TG.mode === '3d' ? '2d' : '3d';
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('tg_mode', TG.mode);
  }
  tgUpdateModeUI();
  TG.base = null;
  tgSize();
}

function tgSize() {
  const cv = $('#tgMap'); if (!cv) return;
  const wrap = cv.parentElement || cv;
  const wrapW = wrap.clientWidth;
  const wrapH = wrap.clientHeight;
  if (!wrapW) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  if (TG.mode === '3d') {
    const wd = wrapW;
    const ht = wrapH || Math.round(wrapW * 0.625);
    const targetW = Math.round(wd * dpr);
    const targetH = Math.round(ht * dpr);
    if (cv.width === targetW && cv.height === targetH) return;
    cv.style.width = wd + 'px';
    cv.style.height = ht + 'px';
    cv.width = targetW;
    cv.height = targetH;
    tgInitSphere();
    return;
  }

  // Chế độ 2D Phẳng
  let cell = wrapW / WORLD.w;
  let ht = Math.round(cell * WORLD.h);
  let wd = wrapW;
  if (wrapH > 60 && ht > wrapH) {
    cell = wrapH / WORLD.h;
    ht = wrapH;
    wd = Math.round(cell * WORLD.w);
  }
  if (TG.base && cv.width === Math.round(wd * dpr) && cv.height === Math.round(ht * dpr) && TG.cell === cell) return;
  cv.style.width = wd + 'px';
  cv.style.height = ht + 'px';
  cv.width = Math.round(wd * dpr);
  cv.height = Math.round(ht * dpr);
  TG.cell = cell;
  const b = document.createElement('canvas'); b.width = cv.width; b.height = cv.height;
  const x = b.getContext('2d');
  const isDark = (document.documentElement.dataset && document.documentElement.dataset.theme) ? document.documentElement.dataset.theme !== 'light' : document.documentElement.getAttribute('data-theme') !== 'light';
  const col = isDark ? '#5A6578' : '#71717A';
  x.scale(dpr, dpr); x.fillStyle = col;
  const dotR = Math.max(1.2, cell * 0.38);
  for (const [i, j] of tgLand()) { x.beginPath(); x.arc((i + 0.5) * cell, (j + 0.5) * cell, dotR, 0, 7); x.fill(); }
  TG.base = b;
}

function tgStart() {
  if (TG.on) return; TG.on = true;
  tgInitSphere();
  const cv = $('#tgMap');
  if (cv && 'IntersectionObserver' in window) {
    new IntersectionObserver(es => { TG.vis = es[0].isIntersecting; }, { threshold: 0 }).observe(cv);
  } else {
    TG.vis = true;
  }

  addEventListener('resize', () => { TG.base = null; tgSize(); });
  const wrap = cv && cv.parentElement;
  if (wrap && typeof ResizeObserver === 'function') new ResizeObserver(() => { TG.base = null; tgSize(); }).observe(wrap);
  if (window.matchMedia) {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const re = () => { TG.base = null; tgSize(); };
    if (mq.addEventListener) mq.addEventListener('change', re);
  }

  // Tương tác chuột & cảm ứng xoay 360 độ
  if (cv) {
    cv.addEventListener('pointerdown', tgPointerDown);
    window.addEventListener('pointermove', tgPointerMove);
    window.addEventListener('pointerup', tgPointerUp);
    window.addEventListener('pointercancel', tgPointerUp);
  }

  const modeBtn = $('#tgModeBtn');
  if (modeBtn) modeBtn.addEventListener('click', tgToggleMode);
  tgUpdateModeUI();

  let last = 0;
  const loop = t => {
    TG.raf = requestAnimationFrame(loop);
    if (t - last < 30 || UI.view !== 'intro' || document.visibilityState !== 'visible') return;
    if (TG.mode === '2d' && !TG.base) { tgSize(); }
    if (!TG.vis) return;
    last = t;
    tgDraw(t);
    if (Date.now() - TG.feedT > 4500) { TG.feedI++; tgFeed(); }
  };
  TG.raf = requestAnimationFrame(loop);
}

function tgPointerDown(e) {
  const cv = $('#tgMap'); if (!cv) return;
  TG.dragging = true;
  TG.dragMoved = false;
  TG.startX = e.clientX;
  TG.startY = e.clientY;
  TG.lastX = e.clientX;
  TG.lastY = e.clientY;
  TG.velY = 0;
  TG.velX = 0;
  if (!TG.hasInteracted) {
    TG.hasInteracted = true;
    const hint = $('#globeHint');
    if (hint) hint.classList.add('hidden');
  }
  cv.classList.add('dragging');
  try { cv.setPointerCapture(e.pointerId); } catch (err) { }
}

function tgPointerMove(e) {
  if (!TG.dragging) return;
  const dx = e.clientX - TG.lastX;
  const dy = e.clientY - TG.lastY;
  if (Math.hypot(e.clientX - TG.startX, e.clientY - TG.startY) > 5) {
    TG.dragMoved = true;
  }
  if (TG.mode === '3d') {
    TG.rotY += dx * 0.007;
    TG.rotX = Math.max(-1.15, Math.min(1.15, TG.rotX + dy * 0.007));
    TG.velY = dx * 0.007;
    TG.velX = dy * 0.007;
  }
  TG.lastX = e.clientX;
  TG.lastY = e.clientY;
}

function tgPointerUp(e) {
  if (!TG.dragging) return;
  TG.dragging = false;
  const cv = $('#tgMap');
  if (cv) {
    cv.classList.remove('dragging');
    try { cv.releasePointerCapture(e.pointerId); } catch (err) { }
  }
  if (!TG.dragMoved) {
    tgTap(e);
  }
}

function tgDraw(t) {
  const cv = $('#tgMap'); if (!cv) return;
  const now = Date.now();

  // Tạo xung nhịp sinh tử ngẫu nhiên liên tục phản ánh dân số thế giới thực tế
  if (!TG.lastLocalPulse || now - TG.lastLocalPulse > 420) {
    TG.lastLocalPulse = now;
    const topIsos = ['IND', 'CHN', 'NGA', 'PAK', 'IDN', 'COD', 'ETH', 'USA', 'BGD', 'VNM', 'BRA', 'PHL', 'EGY', 'JPN', 'DEU', 'GBR', 'FRA', 'ZAF', 'MEX', 'KOR', 'TUR', 'IRN', 'THA', 'ITA', 'ESP', 'CAN', 'AUS'];
    const pickIso = topIsos[Math.floor(Math.random() * topIsos.length)];
    const isBirth = Math.random() < 0.65;
    TG.pulses.push({
      c: pickIso,
      k: isBirth ? 'b' : 'd',
      t0: now
    });
  }

  while (TG.queue.length && TG.queue[0].show <= now) {
    const ev = TG.queue.shift();
    TG.pulses.push(Object.assign(ev, { t0: now }));
  }
  TG.pulses = TG.pulses.filter(pl => { const age = now - pl.t0; return age >= 0 && age < 2600; });

  if (TG.mode === '3d') {
    tgDraw3D(t, cv, now);
  } else {
    tgDraw2D(t, cv, now);
  }
}

// ==================== RENDERING 3D HOLOGRAPHIC GLOBE ====================
function tgDraw3D(t, cv, now) {
  const ctx = cv.getContext('2d');
  const w = cv.clientWidth;
  const h = cv.clientHeight;
  if (!w || !h) return;
  const dpr = cv.width / w;

  // Vật lý xoay quán tính và tự động quay khi nhàn rỗi
  if (!TG.dragging) {
    TG.rotY += TG.velY + 0.0016; // Tự động quay êm ái quanh trục Trái Đất
    TG.rotX += TG.velX;
    TG.velY *= 0.94; // Lực ma sát giảm tốc
    TG.velX *= 0.94;
    TG.rotX = Math.max(-1.15, Math.min(1.15, TG.rotX));
  }

  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.44;
  const isDark = (document.documentElement.dataset && document.documentElement.dataset.theme) ? document.documentElement.dataset.theme !== 'light' : document.documentElement.getAttribute('data-theme') !== 'light';

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // 1. Quầng hào quang khí quyển (Atmospheric Glow - tông màu ấm đồng bộ tổng thể web)
  const glow = ctx.createRadialGradient(cx, cy, R * 0.90, cx, cy, R * 1.28);
  if (isDark) {
    // Hào quang ấm hổ phách thiên hà đồng bộ với tông chủ đạo (#F59E0B) và nền đen ấm (#0B0E14)
    glow.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
    glow.addColorStop(0.35, 'rgba(217, 119, 6, 0.07)');
    glow.addColorStop(0.7, 'rgba(180, 83, 9, 0.02)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else {
    glow.addColorStop(0, 'rgba(180, 83, 9, 0.12)');
    glow.addColorStop(0.5, 'rgba(217, 119, 6, 0.04)');
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  }
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.28, 0, Math.PI * 2);
  ctx.fill();

  // 2. Thân khối cầu đại dương 3D (Tông than chì ấm đồng điệu với thẻ card và nền web)
  const sphereGrad = ctx.createRadialGradient(
    cx - R * 0.35, cy - R * 0.35, R * 0.05,
    cx, cy, R
  );
  if (isDark) {
    sphereGrad.addColorStop(0, '#1E2534'); // Điểm sáng than chì ấm (--card2)
    sphereGrad.addColorStop(0.55, '#131722'); // Thân cầu sẫm đồng bộ với card (#151921)
    sphereGrad.addColorStop(1, '#0B0E14'); // Vùng bóng rìa khớp hoàn toàn với nền trang (#0B0E14)
  } else {
    sphereGrad.addColorStop(0, '#FFFFFF');
    sphereGrad.addColorStop(0.65, '#F1F5F9');
    sphereGrad.addColorStop(1, '#CBD5E1');
  }
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = sphereGrad;
  ctx.fill();

  // Viền rìa sáng góc nghiêng (Limb Highlight)
  ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.32)' : 'rgba(180, 83, 9, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Tính ma trận xoay
  const cosY = Math.cos(TG.rotY), sinY = Math.sin(TG.rotY);
  const cosX = Math.cos(TG.rotX), sinX = Math.sin(TG.rotX);

  // 3. Hệ lưới tọa độ 3D (Graticule: Xích đạo & Kinh tuyến wireframe hổ phách thanh lịch)
  ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.13)' : 'rgba(180, 83, 9, 0.14)';
  ctx.lineWidth = 0.9;
  ctx.setLineDash([3, 4]);

  // Vòng Xích đạo (Equator)
  ctx.beginPath();
  let firstEq = true;
  for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.12) {
    const x0 = Math.sin(a), y0 = 0, z0 = Math.cos(a);
    const x1 = x0 * cosY + z0 * sinY;
    const z1 = -x0 * sinY + z0 * cosY;
    const y2 = y0 * cosX - z1 * sinX;
    const z2 = y0 * sinX + z1 * cosX;
    if (z2 > -0.05) {
      const px = cx + x1 * R, py = cy + y2 * R;
      if (firstEq) { ctx.moveTo(px, py); firstEq = false; } else { ctx.lineTo(px, py); }
    } else {
      firstEq = true;
    }
  }
  ctx.stroke();

  // Vòng Chí tuyến Bắc & Nam (+23.4° & -23.4°)
  for (const latDeg of [23.4, -23.4]) {
    const phi = (latDeg * Math.PI) / 180;
    const cosP = Math.cos(phi), sinP = -Math.sin(phi);
    ctx.beginPath();
    let firstTr = true;
    for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.16) {
      const x0 = cosP * Math.sin(a), y0 = sinP, z0 = cosP * Math.cos(a);
      const x1 = x0 * cosY + z0 * sinY;
      const z1 = -x0 * sinY + z0 * cosY;
      const y2 = y0 * cosX - z1 * sinX;
      const z2 = y0 * sinX + z1 * cosX;
      if (z2 > -0.05) {
        const px = cx + x1 * R, py = cy + y2 * R;
        if (firstTr) { ctx.moveTo(px, py); firstTr = false; } else { ctx.lineTo(px, py); }
      } else {
        firstTr = true;
      }
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // 4. Các điểm lục địa (Landmass Dots)
  if (!TG.spherePoints) tgInitSphere();
  const pts = TG.spherePoints;
  const count = pts.length / 3;
  const baseDotR = Math.max(1.15, R * 0.0165);

  // Lượt 1: Các điểm bán cầu sau (Holographic translucent back)
  if (isDark) {
    ctx.fillStyle = 'rgba(71, 85, 105, 0.15)';
    for (let i = 0; i < count; i += 2) { // Tối ưu vẽ 50% điểm bán cầu sau
      const x0 = pts[i * 3], y0 = pts[i * 3 + 1], z0 = pts[i * 3 + 2];
      const x1 = x0 * cosY + z0 * sinY;
      const z1 = -x0 * sinY + z0 * cosY;
      const y2 = y0 * cosX - z1 * sinX;
      const z2 = y0 * sinX + z1 * cosX;
      if (z2 <= 0) {
        ctx.fillRect(cx + x1 * R - 0.7, cy + y2 * R - 0.7, 1.4, 1.4);
      }
    }
  }

  // Lượt 2: Các điểm bán cầu trước (Front hemisphere với độ sâu và sáng bóng)
  for (let i = 0; i < count; i++) {
    const x0 = pts[i * 3], y0 = pts[i * 3 + 1], z0 = pts[i * 3 + 2];
    const x1 = x0 * cosY + z0 * sinY;
    const z1 = -x0 * sinY + z0 * cosY;
    const y2 = y0 * cosX - z1 * sinX;
    const z2 = y0 * sinX + z1 * cosX;
    if (z2 > 0) {
      const px = cx + x1 * R;
      const py = cy + y2 * R;
      const r = (0.72 + 0.52 * z2) * baseDotR;

      if (isDark) {
        if (z2 > 0.65) {
          ctx.fillStyle = 'rgba(248, 250, 252, 0.95)'; // Đỉnh bóng sáng ấm áp (--ink)
        } else if (z2 > 0.25) {
          ctx.fillStyle = 'rgba(203, 213, 225, 0.85)'; // Thân lục địa sáng rõ (--ink2)
        } else {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.55)'; // Rìa chân trời (--ink3)
        }
      } else {
        if (z2 > 0.65) {
          ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
        } else if (z2 > 0.25) {
          ctx.fillStyle = 'rgba(71, 85, 105, 0.85)';
        } else {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.60)';
        }
      }
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. Điểm sáng người chơi đang hoạt động (Active players hotspots - Tông hổ phách thương hiệu #F59E0B)
  for (const [c, n] of (TG.data && TG.data.now) || []) {
    const pt = TG.countryPoints && TG.countryPoints[c];
    if (!pt) continue;
    const x1 = pt.x0 * cosY + pt.z0 * sinY;
    const z1 = -pt.x0 * sinY + pt.z0 * cosY;
    const y2 = pt.y0 * cosX - z1 * sinX;
    const z2 = pt.y0 * sinX + z1 * cosX;
    if (z2 > 0.05) {
      const px = cx + x1 * R;
      const py = cy + y2 * R;
      const ph = (t / 2400 + (px * 3 + py * 7) % 10 / 10) % 1;
      const pr = (6 + 14 * ph) * (0.8 + 0.3 * z2);
      ctx.strokeStyle = '#F59E0B'; // Vàng hổ phách chủ đạo
      ctx.lineWidth = 1.3;
      ctx.globalAlpha = 0.8 * (1 - ph);
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath(); ctx.arc(px, py, Math.max(2.2, 3.5 * z2), 0, Math.PI * 2); ctx.fill();
    }
  }

  // 6. Xung nhịp sinh tử thời gian thực: Cột sáng laser + Sóng năng lượng tỏa
  for (const pl of TG.pulses) {
    const pt = TG.countryPoints && TG.countryPoints[pl.c];
    if (!pt) continue;
    const x1 = pt.x0 * cosY + pt.z0 * sinY;
    const z1 = -pt.x0 * sinY + pt.z0 * cosY;
    const y2 = pt.y0 * cosX - z1 * sinX;
    const z2 = pt.y0 * sinX + z1 * cosX;
    if (z2 > -0.15) {
      const px = cx + x1 * R;
      const py = cy + y2 * R;
      const k = (now - pl.t0) / 2600;
      const dScale = 0.65 + 0.35 * Math.max(0, z2);
      const isBirth = pl.k === 'b';
      const color = isBirth ? '#10B981' : '#EF4444'; // Ngọc Lục Bảo (Sinh) & Đỏ Hồng Ngọc (Tử)
      const glowCol = isBirth ? '#34D399' : '#F87171';

      // Sóng xung kích tỏa tròn
      const shockR = (5 + 32 * k) * dScale;
      ctx.globalAlpha = 0.9 * (1 - k);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, 2.4 * (1 - k * 0.6));
      ctx.beginPath();
      ctx.arc(px, py, shockR, 0, Math.PI * 2);
      ctx.stroke();

      // Cột laser ba chiều vươn thẳng từ bề mặt Trái Đất (Holographic Beacon Beam)
      const beamLen = (28 * (1 - k) + 6) * dScale;
      const topX = px + x1 * beamLen;
      const topY = py + y2 * beamLen;

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(topX, topY);
      ctx.lineWidth = 1.8 * (1 - k * 0.4);
      ctx.strokeStyle = glowCol;
      ctx.stroke();

      // Hạt năng lượng đỉnh cột sáng
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(topX, topY, Math.max(1.8, 3.2 * (1 - k)), 0, Math.PI * 2);
      ctx.fill();

      // Tâm điểm phát sáng
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(2, 4.2 * (1 - k)), 0, Math.PI * 2);
      ctx.fill();

      // Thẻ sự kiện mini bay lơ lửng (Floating Badge) khi xung nhịp còn mới (< 1 giây)
      if (k < 0.42 && z2 > 0.2) {
        ctx.save();
        const badgeAlpha = Math.min(1, (0.42 - k) / 0.12);
        ctx.globalAlpha = badgeAlpha;
        const tagText = `${isBirth ? '+1' : '-1'} ${pl.c}`;
        ctx.font = 'bold 9.5px monospace';
        const txtW = ctx.measureText(tagText).width;
        const bx = topX + 4;
        const by = topY - 12;

        ctx.fillStyle = isDark ? 'rgba(21, 25, 33, 0.90)' : 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(bx - 3, by - 8, txtW + 6, 13, 3) : ctx.rect(bx - 3, by - 8, txtW + 6, 13);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillText(tagText, bx, by + 2);
        ctx.restore();
      }
    }
  }

  ctx.globalAlpha = 1;
}

// ==================== RENDERING 2D FLAT MAP ====================
function tgDraw2D(t, cv, now) {
  if (!TG.base) return;
  const x = cv.getContext('2d'), dpr = cv.width / cv.clientWidth, cell = TG.cell, css = getComputedStyle(document.documentElement);
  const accent = css.getPropertyValue('--accent').trim() || '#8C1D3C';
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.clearRect(0, 0, cv.width, cv.height);
  x.drawImage(TG.base, 0, 0);
  x.setTransform(dpr, 0, 0, dpr, 0, 0);

  for (const [c, n] of (TG.data && TG.data.now) || []) {
    const p = WORLD.at[c]; if (!p) continue;
    const cx = p[0] * cell, cy = p[1] * cell, r = Math.min(Math.max(7, cell * 2.6), Math.max(cell * (0.55 + 0.32 * Math.sqrt(n)), 2 + 1.4 * Math.sqrt(n))),
      ph = (t / 2600 + (cx * 7 + cy * 13) % 10 / 10) % 1;
    x.globalAlpha = 0.22 * (1 - ph); x.strokeStyle = accent; x.lineWidth = 1.2;
    x.beginPath(); x.arc(cx, cy, r + ph * cell * 2.2, 0, 7); x.stroke();
    x.globalAlpha = 0.9; x.fillStyle = accent; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  }

  for (const pl of TG.pulses) {
    const p = WORLD.at[pl.c]; if (!p) continue;
    const k = (now - pl.t0) / 2600;
    const color = pl.k === 'b' ? '#10B981' : '#EF4444';
    x.globalAlpha = 0.9 * (1 - k);
    x.strokeStyle = color;
    x.lineWidth = 2.2;
    x.beginPath();
    x.arc(p[0] * cell, p[1] * cell, cell * (0.8 + k * 5.2), 0, 7);
    x.stroke();
    x.globalAlpha = 0.8 * (1 - k);
    x.fillStyle = color;
    x.beginPath();
    x.arc(p[0] * cell, p[1] * cell, Math.max(2, cell * 1.2 * (1 - k)), 0, 7);
    x.fill();
  }
  x.globalAlpha = 1;
}

// ==================== TAP / CLICK TOOLTIP ====================
function tgTap(e) {
  const cv = $('#tgMap'), tip = $('#tgTip'); if (!cv || !tip) return;
  const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
  const box = (tip.parentElement || cv).getBoundingClientRect();

  if (TG.mode === '3d') {
    const w = cv.clientWidth, h = cv.clientHeight;
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.44;
    const distCenter = Math.hypot(mx - cx, my - cy);
    if (distCenter > R * 1.08) { tip.hidden = true; return; }

    const cosY = Math.cos(TG.rotY), sinY = Math.sin(TG.rotY);
    const cosX = Math.cos(TG.rotX), sinX = Math.sin(TG.rotX);

    let bestIso = null, bd = 1e9, bestPx = 0, bestPy = 0;
    for (const [iso, pt] of Object.entries(TG.countryPoints || {})) {
      const x1 = pt.x0 * cosY + pt.z0 * sinY;
      const z1 = -pt.x0 * sinY + pt.z0 * cosY;
      const y2 = pt.y0 * cosX - z1 * sinX;
      const z2 = pt.y0 * sinX + z1 * cosX;
      if (z2 > 0.05) {
        const px = cx + x1 * R;
        const py = cy + y2 * R;
        const d = Math.hypot(px - mx, py - my);
        if (d < bd) { bd = d; bestIso = iso; bestPx = px; bestPy = py; }
      }
    }

    if (!bestIso || bd > 26) { tip.hidden = true; return; }

    const cInfo = (typeof CBY !== 'undefined' && CBY[bestIso]) || { ko: bestIso };
    const countryName = cInfo.ko || cInfo.name || bestIso;
    const popStr = cInfo.pop ? `Dân số: ${cInfo.pop} triệu` : '';
    const leStr = cInfo.le ? `Tuổi thọ TB: ${cInfo.le} tuổi` : '';
    const extra = [popStr, leStr].filter(Boolean).join(' · ');

    tip.innerHTML = `<b>${esc(countryName)}</b> (${bestIso})<br><small style="color:var(--ink3);">${esc(extra || 'Đang cập nhật dữ liệu')}</small>`;
    const tipX = r.left - box.left + bestPx;
    const tipY = r.top - box.top + bestPy;
    tip.style.left = Math.min(box.width - 190, Math.max(8, tipX - 85)) + 'px';
    tip.style.top = Math.max(0, tipY + 14) + 'px';
    tip.hidden = false;
    return;
  }

  // Chế độ 2D
  let best = null, bd = 1e9;
  for (const g of (TG.data && TG.data.now) || []) {
    const p = WORLD.at[g[0]]; if (!p || !CBY[g[0]]) continue;
    const d = Math.hypot(p[0] * TG.cell - mx, p[1] * TG.cell - my); if (d < bd) { bd = d; best = g; }
  }
  if (!best || bd > Math.max(18, TG.cell * 4)) {
    // Thử tìm theo danh sách quốc gia phẳng
    for (const [iso, p] of Object.entries(WORLD.at)) {
      const d = Math.hypot(p[0] * TG.cell - mx, p[1] * TG.cell - my);
      if (d < bd) { bd = d; best = [iso, 0, []]; }
    }
    if (!best || bd > Math.max(18, TG.cell * 4)) { tip.hidden = true; return; }
  }

  const cInfo = (typeof CBY !== 'undefined' && CBY[best[0]]) || { ko: best[0] };
  const countryName = cInfo.ko || cInfo.name || best[0];
  tip.innerHTML = `<b>${esc(countryName)}</b> (${best[0]})<br><small style="color:var(--ink3);">${cInfo.pop ? `Dân số: ${cInfo.pop}M · ` : ''}${cInfo.le ? `Tuổi thọ: ${cInfo.le} tuổi` : ''}</small>`;
  const p = WORLD.at[best[0]];
  const px = r.left - box.left + p[0] * TG.cell, py = r.top - box.top + p[1] * TG.cell;
  tip.style.left = Math.min(box.width - 190, Math.max(8, px - 85)) + 'px';
  tip.style.top = Math.max(0, py + 14) + 'px';
  tip.hidden = false;
}
const CM = { last: 0, more: true, armed: 0 };
function lvRand(seed) {
  let h = 2166136261; for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; };
}
const SC_PROP = { shelter: 'factory', pilot: 'office', cabin: 'office', farm: 'crops', farmhand: 'crops', agbiz: 'crops', herder: 'herd', fisher: 'boat', construct: 'crane', miner: 'crane', factory: 'factory', garment: 'factory',
  artisan: 'stall', mechanic: 'stall', electric: 'pole', engineer: 'office', vendor: 'stall', domestic: 'laundry', driver: 'truck', delivery: 'moto', shop: 'stall', cook: 'stall',
  guard: 'office', hair: 'stall', care: 'clinic', clerk: 'office', callc: 'office', teacher: 'school', nurse: 'clinic', police: 'flag', soldier: 'flag', civil: 'office',
  finance: 'office', dev: 'office', doctor: 'clinic', lawyer: 'office', prof: 'school', creator: 'easel', artist: 'easel', designer: 'office', owner: 'stall', mp: 'dome', leader: 'dome', astro: 'rocket', athlete: 'flag', coach: 'flag', trainer: 'flag', musician: 'mic', idol: 'mic', actor: 'mic', dancer: 'mic',
  homemaker: 'laundry', retired: 'bench', student: 'school', service: 'flag', seeking: 'sign', prison: 'none',
  cleaner: 'laundry', warehouse: 'truck', childcare: 'school', healthtech: 'clinic', social: 'office', salesagent: 'office', welder: 'crane', clergy: 'dome', boardpro: 'school', progamer: 'office',
  ai_eng: 'office', streamer: 'easel', ecom: 'stall', cyber: 'office', trader: 'office', logistics: 'truck', green_tech: 'pole', biotech: 'clinic', gig_rider: 'moto', env_spec: 'school' };
const SKIN_W = { n: [36, 44, 15, 5, 0, 0], m: [3, 17, 42, 30, 8, 0], s: [0, 0, 14, 46, 34, 6], e: [22, 50, 28, 0, 0, 0], se: [0, 8, 44, 40, 8, 0],
  a: [0, 0, 0, 6, 36, 58], ha: [0, 0, 6, 32, 44, 18], l: [6, 22, 34, 26, 10, 2], c: [0, 0, 5, 15, 40, 40], ca: [6, 32, 44, 18, 0, 0], pa: [0, 0, 4, 24, 46, 26],
  sc: [16, 46, 28, 10, 0, 0], in: [0, 4, 30, 46, 20, 0], au: [0, 0, 5, 25, 40, 30], br: [0, 0, 10, 36, 34, 20], co: [0, 10, 36, 38, 16, 0], ro: [0, 10, 40, 40, 10, 0] };
const SKIN_C = { e: 'CHN,KOR,PRK,JPN,TWN,HKG,MNG,SGP', se: 'VNM,THA,LAO,KHM,MMR,MYS,IDN,PHL,TLS,BRN', s: 'IND,PAK,BGD,NPL,LKA,BTN,MDV,MUS', ca: 'KAZ,UZB,KGZ,TJK,TKM,AZE,GEO,ARM',
  m: 'TUR,IRN,ISR,AFG', c: 'HTI,JAM,DOM,CUB,TTO,GUY,SUR', sc: 'ARG,URY,CHL', pa: 'PNG,SLB,FJI,VUT', ha: 'ETH,ERI,SOM,DJI,SDN', n: 'BRA' };
const SKIN_CI = {};
const SKIN_G = { us_black: 'a', gb_black: 'a', co_afro: 'a', ec_afro: 'a', za_black: 'a', br_negro: 'br', us_hisp: 'l', us_asian: 'e', my_chin: 'e', cn_min: 'e', cn_hui: 'e', jp_zai: 'e',
  us_native: 'in', ca_ind: 'in', mx_ind: 'in', gt_maya: 'in', bo_ind: 'in', pe_ind: 'in', ec_ind: 'in', co_ind: 'in', cl_mapu: 'in', nz_maori: 'in', nz_pasi: 'in', au_ind: 'au',
  gb_pak: 's', gb_ind: 's', my_ind: 's', lk_tamil: 's', za_ind: 's', in_adiv: 'ha', fr_magh: 'm', il_arab: 'm', tr_kurd: 'm', de_turk: 'm', roma: 'ro',
  th_malay: 'se', th_hill: 'se', vn_min: 'se', ru_turk: 'ca', za_white: 'n', za_col: 'co' };
function skinW(iso, e) {
  if (e && SKIN_G[e.g]) return SKIN_W[SKIN_G[e.g]];
  const c = typeof CBY !== 'undefined' && CBY[iso];
  return SKIN_W[SKIN_CI[iso] || (c && { hi: 'n', eca: 'n', mena: 'm', sa: 's', eap: 'se', ssa: 'a', lac: 'l' }[c.p]) || 'n'];
}
const skinU = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; h = Math.imul(h ^ (h >>> 13), 2246822507) >>> 0; return (h >>> 0) / 4294967296; };
function skinPick(w, seed) { const t = w.reduce((a, b) => a + b, 0); let u = skinU(seed) * t; for (let i = 0; i < 6; i++) { u -= w[i]; if (u < 0) return i; } return 5; }
const skinMid = (a, b, seed) => skinU(seed) < 0.5 ? Math.floor((a + b) / 2) : Math.ceil((a + b) / 2);
const skinSeed = () => (typeof nmSeed === 'function' ? nmSeed() : (S.name && S.name.full) || '') + S.born;
const skinMix = () => S.eth && S.eth.nat && (S.eth.g === 'kr_mix' || S.eth.g === 'jp_mix');
function skinMe() {
  if (S.skn != null) return S.skn;
  if (S.adopt && S.adopt.mv != null) return (S.skn = S.adopt.sk != null ? S.adopt.sk : skinPick(skinW(S.adopt.from, S.adopt.k === 'dom' ? S.eth : null), (S.adopt.nm0 || '') + S.adopt.from));
  const sd = skinSeed();
  return (S.skn = skinMix() ? skinMid(skinPick(skinW(S.born, null), sd + 'h'), skinPick(skinW(S.eth.nat, null), sd + 'n'), sd) : skinPick(skinW(S.born, S.eth), sd));
}
function skinPar(sex) {
  if (S.adopt && S.adopt.mv != null) return skinPick(skinW(S.born, S.adopt.k === 'dom' ? S.eth : null), skinSeed() + 'ad' + sex);
  if (!skinMix()) return skinMe();
  const sd = skinSeed(); return (S.eth.p === 'f') === (sex === 'M') ? skinPick(skinW(S.eth.nat, null), sd + 'n') : skinPick(skinW(S.born, null), sd + 'h');
}
function skinOfP(P) {
  if (!P) return skinMe(); if (P.skn != null) return P.skn;
  const nm = ((P.name && P.name.full) || '') + (P.age || ''), nat = typeof P.nat === 'string' ? P.nat : typeof P.home === 'string' ? P.home : S.cur, me = skinMe(), u = skinU(nm + 'k');
  return (P.skn = nat === S.born && !skinMix() && u < 0.85 ? Math.max(0, Math.min(5, me + (u < 0.6 ? 0 : u < 0.725 ? -1 : 1))) : skinPick(skinW(nat, null), nm));
}
function skinOfKid(k) {
  if (k.skn != null) return k.skn;
  const P = S.fam.partner, me = skinMe(), nm = (k.name && k.name.full) || String(k.bornAt);
  return (k.skn = k.sk && P ? skinOfP(P) : P && (P.alive || P.endAt != null) && !(P.ss) ? skinMid(me, skinOfP(P), nm) : me);
}
const skinOfG = g => { const k = S.fam.kids.find(x => x.name && callName(x.name) === g.of && x.sex === g.ofSex); return k ? skinOfKid(k) : skinMe(); };
const skinHere = seed => skinPick(skinW(S.cur, null), seed);
const SC_PPL = 10;
function sceneModel() {
  const sa = typeof studyAway === 'function' ? studyAway() : null, c = sa ? CBY[sa] : C(), a = S.age, f = S.fam;
  let home;
  if (S.job === 'prison') home = 'prison';
  else if (S.refugee) home = 'tent';
  else if (S.flags.oldHome === 'care') home = 'flat';
  else if (S.flags.ddHome === 'gh') home = 'flat';
  else if (typeof vowedHome === 'function' && vowedHome()) home = 'flat';
  else if (S.owns.house) {
    const r = S.house / Math.max(1, housePrice(c));
    home = (S.flags && S.flags.hsz) || (r >= 4.5 ? 'estate' : r >= 2.6 ? 'mansion' : r >= 1.5 ? 'villa' : r < 0.75 ? 'small' : 'house');
  }
  else if (S.urban || sa) home = 'flat';
  else home = (lowInc(c) && S.q <= 2) ? 'hut' : 'cottage';
  const people = [], h = homeOthers();
  if (S.job !== 'prison') {
    if (h.dad) people.push({ role: 'par', age: f.dad.age, sex: 'M', sk: skinPar('M') });
    if (h.step) people.push({ role: 'par', age: f.step.age, sex: 'M', step: 1, sk: skinHere(skinSeed() + 'step') });
    if (h.mom) people.push({ role: 'par', age: f.mom.age, sex: 'F', sk: skinPar('F') });
    if (!h.dad && !h.mom && typeof raisedHere === 'function' && raisedHere() && S.flags.raised.k !== 'home') people.push({ role: 'par', age: S.flags.raised.age + a - S.flags.raised.at, sex: S.flags.raised.sex, raised: 1, sk: S.flags.raised.k === 'foster' ? skinHere(skinSeed() + 'fos') : skinMe() });
  }
  { const ad = typeof disDraw === 'function' ? disDraw() : ''; const sx = typeof pubSex === 'function' ? pubSex() : S.sex; people.push(ad ? { role: 'me', age: a, sex: sx, aid: ad, sk: skinMe() } : { role: 'me', age: a, sex: sx, sk: skinMe() }); }
  if (typeof sibsHome === 'function') for (const sb of sibsHome()) if (people.length < SC_PPL) people.push({ role: 'sib', age: sb.age, sex: sb.sex, sk: S.adopt && S.adopt.mv != null ? skinPar(sb.sex) : skinMe() });
  if (S.job !== 'prison') {
    if (h.pt) people.push({ role: 'pt', age: f.partner.age, sex: f.partner.sex, sk: skinOfP(f.partner) });
    if (h.pt2) people.push({ role: 'pt', age: h.pt2.age, sex: 'F', sk: skinOfP(h.pt2) });
    if (h.co) people.push({ role: 'pt', age: h.co.age, sex: 'F', sk: skinOfP(h.co) });
    const inPr = typeof kidInPr === 'function' ? f.kids.filter(k => kidInPr(k) && !k.away && (!k.grown || k.withMe)) : [];
    for (const k of h.kids.concat(inPr)) if (people.length < SC_PPL) {
      const ka = a - k.bornAt; if (!inPr.includes(k)) people.push({ role: 'kid', age: ka, sex: k.sex, sk: skinOfKid(k) });
      if ((k.wed || k.cuT) && (!k.grown || k.withMe) && ka >= 18 && people.length < SC_PPL) people.push({ role: 'inlaw', age: Math.max(18, ka + (k.sex === 'F' ? 2 : -2)), sex: k.pS === 1 || k.ps === 1 ? k.sex : k.sex === 'F' ? 'M' : 'F', ps: k.pS === 1 || k.ps === 1 ? 1 : 0, sk: skinHere(((k.name && k.name.full) || '') + 'il') });
      if ((k.withMe || (!k.grown && (k.wed || k.cuT))) && (k.kb || 0) > 0) {
        const cn = k.name ? callName(k.name) : '', gs = (f.grand || []).filter(g => g.of === cn && g.ofSex === k.sex && !g.gone && a - g.bornAt < 23);
        for (const g of gs.slice(0, 3)) if (people.length < SC_PPL) people.push({ role: 'kid', gk: 1, age: Math.max(0, a - g.bornAt), sex: g.sex, sk: skinOfKid(k) });
      }
    }
    for (const g of f.grand || []) if (g.home != null && !g.gone && a - g.bornAt < 19 && people.length < SC_PPL) people.push({ role: 'kid', gk: 1, age: Math.max(0, a - g.bornAt), sex: g.sex, sk: skinOfG(g) });
  }
  let prop = S.school ? 'school' : a < 6 ? 'toys' : S.job === 'childwork' ? (S.flags.cwPaid ? 'bundle' : 'laundry') : SC_PROP[S.job] || 'none';
  if (S.retired && prop !== 'dome') prop = 'bench';
  if (S.nomad) prop = 'none';
  const pet = petHere() && !sa ? S.pet.k : '';
  return { stage: a < 13 ? 'm' : a < 60 ? 'd' : 'e', mood: S.st.h < 35 ? 'low' : S.st.h > 70 ? 'high' : 'mid', urban: !!(S.urban || sa), region: c.p,
    home, people, prop, pet, car: !!S.owns.car, moto: !!S.owns.moto && !S.owns.car && prop !== 'moto', war: !!c.war, nomad: !!S.nomad, seed: skinSeed() + (S.city || '') };
}
const PX = { W: 192, H: 60, G: 48 };
const PX_PAL = {
  light: { sky: { m: ['#A9D8E8', '#F6E9D2'], d: ['#8FCFE3', '#E8F2EC'], e: ['#D7A79E', '#F4D29A'] }, sun: '#FFE39A', sunhi: '#FFF7DC', star: null,
    cloud: '#FFFFFF', cloudsh: '#D6E4EC', cloudlow: '#BCC6CA', cloudlowsh: '#9DA9AE', far1: '#BCD7E0', far2: '#A3C3CD', hill1: '#B3D3C2', hill2: '#93BEA3',
    grass: '#8CC07A', grass2: '#5E9A5E', grasshi: '#B6DB8F', soil: '#7E6858', soil2: '#5F4D42', stone: '#A2917F', pave: '#CDD0C8', pave2: '#A9ADA6',
    road: '#6E7479', roadline: '#DDD6C6', sand: '#ECD5A2', sand2: '#D3B47E', water: '#6FB7CF', water2: '#B4E2EE',
    wall: '#F3EEE3', wall2: '#D5D9D3', wall3: '#AEB6B1', roof: '#C25550', roof2: '#953D3B', thatch: '#CBA968', thatch2: '#A6864A', mud: '#BB906A', brick: '#A86B4E',
    win: '#7FA9BA', winlit: '#F2C76E', ol: '#3B4046', tree: '#6FA766', tree2: '#4E8550', treehi: '#9DCD80', trunk: '#7A5A43',
    skin: '#CF9F7C', sk0: '#F2CDB0', sk1: '#E2B48F', sk2: '#CF9F7C', sk3: '#B07C58', sk4: '#8A583A', sk5: '#5E3A25', hair: '#3F3530', hairold: '#DDDAD3', pants: '#4F5661', me: '#1F8A80', pt: '#6C8091', kid: '#E2A33A', par: '#9AA8AE', sib: '#9A86C8', inlaw: '#B07A86',
    metal: '#8E979C', crane: '#E8B33A', smoke: '#A7AEB1', accent: '#BE4A52', stamp: '#2C8C82', gold: '#E2AE45', lit: false },
  dark: { sky: { m: ['#1F2E45', '#3A3F52'], d: ['#17283A', '#2C3F49'], e: ['#2A2238', '#4B3838'] }, sun: '#E8D7A0', sunhi: '#FFF4CF', star: '#C9D3DA',
    cloud: '#4A5A64', cloudsh: '#3A4851', cloudlow: '#3A444A', cloudlowsh: '#2E363B', far1: '#2B3D48', far2: '#22323C', hill1: '#25382F', hill2: '#1E3029',
    grass: '#2F4B36', grass2: '#22382A', grasshi: '#3F6146', soil: '#2E2621', soil2: '#211B17', stone: '#40362F', pave: '#3A3F42', pave2: '#2E3336',
    road: '#262B30', roadline: '#6B6A60', sand: '#4A4030', sand2: '#3A3226', water: '#1F4554', water2: '#3A7A8E',
    wall: '#4B545A', wall2: '#3D464C', wall3: '#333B40', roof: '#7A3638', roof2: '#5A282A', thatch: '#6E5B3B', thatch2: '#574730', mud: '#5E4835', brick: '#5E3E30',
    win: '#2C3D47', winlit: '#F0C35E', ol: '#0D1114', tree: '#2F5A3E', tree2: '#224530', treehi: '#3F7350', trunk: '#4A3828',
    skin: '#A9876D', sk0: '#C6AE9B', sk1: '#B9997E', sk2: '#A9876D', sk3: '#90694D', sk4: '#714B33', sk5: '#4D3121', hair: '#1F1A17', hairold: '#A9A6A0', pants: '#2B3036', me: '#4CC0AF', pt: '#8C9DA3', kid: '#D9AF59', par: '#66777B', sib: '#9C8CC9', inlaw: '#B58A94',
    metal: '#5E676C', crane: '#B8902F', smoke: '#4A5357', accent: '#E2678A', stamp: '#4CC0AF', gold: '#D9AF59', lit: true },
};
const pxRGB = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const pxMix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
function pxPalette(force) {
  const t = document.documentElement.dataset.theme;
  const dark = force ? force === 'dark' : t === 'dark' || (t !== 'light' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  const src = PX_PAL[dark ? 'dark' : 'light'], P = { dark };
  for (const [k, v] of Object.entries(src)) P[k] = typeof v === 'string' ? pxRGB(v) : v;
  P.shade = (c, k) => pxMix(c, P.ol, k); P.light = (c, k) => pxMix(c, [255, 255, 255], k);
  return P;
}
const PX_BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
class PxR {
  constructor(w, h) { this.w = w; this.h = h; this.d = new Array(w * h).fill(null); }
  px(x, y, c) { x = Math.round(x); y = Math.round(y); if (c && x >= 0 && y >= 0 && x < this.w && y < this.h) this.d[y * this.w + x] = c; }
  get(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.d[y * this.w + x] : null; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c); }
  disc(cx, cy, r, c) { for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) if (i * i + j * j <= r * r + r * 0.8) this.px(cx + i, cy + j, c); }
  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
    for (;;) { this.px(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
  }
  dither(x, y, c, t) { if (t > PX_BAYER[(y & 3) * 4 + (x & 3)]) this.px(x, y, c); }
  blit(s, x, y, ol) {
    for (let j = -1; j <= s.h; j++) for (let i = -1; i <= s.w; i++) {
      const v = s.get(i, j);
      if (v) this.px(x + i, y + j, v);
      else if (ol && (s.get(i - 1, j) || s.get(i + 1, j) || s.get(i, j - 1) || s.get(i, j + 1))) this.px(x + i, y + j, ol);
    }
  }
}
function pxSprite(rows, map) {
  const s = new PxR(Math.max(...rows.map(r => r.length)), rows.length);
  rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] !== '.') s.px(x, y, map[r[x]]); });
  return s;
}
const PX_PEOPLE = {
  M: { adult: ['..HHHHH..', '.HHHHHHH.', 'HHHHHHHHH', 'HHSSSSHHH', 'HSSSSSSSH', 'SSESSSESS', 'ScSSSSScS', '.SSSmSSS.', '..SSSSS..', '.BBBBBBB.', 'BBBBBBBBB', 'BbBBBBBbB', 'SbBBBBBbS', '..PPPPP..', '..PP.PP..', '..PP.PP..', '..FF.FF..'],
    teen: ['..HHHHH..', '.HHHHHHH.', 'HHHHHHHHH', 'HHSSSSHHH', 'HSSSSSSSH', 'SSESSSESS', 'ScSSSSScS', '.SSSmSSS.', '..SSSSS..', '.BBBBBBB.', 'BbBBBBBbB', 'SbBBBBBbS', '..PPPPP..', '..PP.PP..', '..PP.PP..', '..FF.FF..'],
    child: ['.HHHHH.', 'HHHHHHH', 'HHSSSHH', 'SESSSES', 'ScSSScS', '.SSmSS.', '..SSS..', '.BBBBB.', 'BbBBBbB', 'SbBBBbS', '.PPPPP.', '.PP.PP.', '.FF.FF.'],
    small: ['.HHHHH.', 'HHSSSHH', 'SESSSES', 'ScSmScS', '.SSSSS.', '.BBBBB.', 'SBBBBBS', '.PPPPP.', '.PP.PP.', '.FF.FF.'],
    baby: ['.HHHH.', 'HSSSSH', 'SESSES', 'ScSScS', '.SSSS.', 'BBBBBB', 'BB..BB'] },
  F: { adult: ['..HHHHH..', '.HHHHHHH.', 'HHHHHHHHH', 'HHSSSSHHH', 'HSSSSSSSH', 'HSESSSESH', 'HcSSSSScH', 'HHSSmSSHH', 'HHHSSSHHH', 'HBBBBBBBH', 'BBBBBBBBB', 'SbBBBBBbS', '.DDDDDDD.', '.DDDDDDD.', 'ddddddddd', '..S...S..', '..F...F..'],
    teen: ['..HHHHH..', '.HHHHHHH.', 'HHHHHHHHH', 'HHSSSSHHH', 'HSSSSSSSH', 'HSESSSESH', 'HcSSSSScH', 'HHSSmSSHH', 'HHHSSSHHH', 'HBBBBBBBH', 'SbBBBBBbS', '.DDDDDDD.', 'ddddddddd', '..S...S..', '..F...F..'],
    child: ['.HHHHH.', 'HHHHHHH', 'HHSSSHH', 'HESSSEH', 'HcSSScH', 'HSSmSSH', 'H.SSS.H', '.BBBBB.', 'SbBBBbS', '.DDDDD.', 'ddddddd', '.S...S.', '.F...F.'],
    small: ['.HHHHH.', 'HHSSSHH', 'HESSSEH', 'HcSmScH', 'HSSSSSH', '.BBBBB.', 'SDDDDDS', 'ddddddd', '.S...S.', '.F...F.'],
    baby: ['.HHHH.', 'HSSSSH', 'SESSES', 'ScSScS', '.SSSS.', 'BBBBBB', 'BB..BB'] },
};
const PX_PET = {
  d: ['..BBB........', '.EBBBB......T', '.EBkBB......T', 'NBBBBB.....T.', '..cBBBBBBBBB.', '...BBBBBBBBB.', '...BBwwwwBBB.', '...B.B...B.B.', '...B.B...B.B.'],
  c: ['B.B.........', 'BBB........T', 'BkBB.......T', 'NBBB......T.', '.BBBBBBBBBT.', '..BBBBBBBB..', '..BBwwwBBB..', '..B.B..B.B..'],
};
function pxPet(k, P) {
  if (!PX_PET[k]) k = 'c';
  if (k === 'f') return pxSprite(PX_PET.f, { G: P.ol, W: P.water2 || P.win, o: P.gold || P.accent, p: P.grass2, s: P.sand });
  const B = k === 'd' ? pxMix(P.trunk, P.sun || P.accent, 0.3) : k === 'h' ? pxMix(P.gold || P.sun, P.trunk, 0.35) : k === 'b' ? pxMix(P.grass, P.sun || P.accent, 0.25) : k === 'r' ? P.light(P.hairold, 0.3) : P.hairold, sh = P.shade(B, 0.28);
  return pxSprite(PX_PET[k], { B, E: sh, T: B, k: P.ol, N: k === 'b' ? P.gold || P.accent : P.ol, w: P.light(B, 0.4), c: k === 'b' ? P.gold || P.accent : P.accent, y: P.trunk });
}
function pxPerson(p, P, ot) {
  const kind = p.age < 3 ? 'baby' : p.age < 7 ? 'small' : p.age < 13 ? 'child' : p.age < 18 ? 'teen' : 'adult';
  const B = p.role === 'me' && ot ? ot[0] : P[p.role] || P.par, low = p.role === 'me' && ot ? ot[1] : P.pants;
  const D = p.sex === 'F' && p.role !== 'me' && p.role !== 'mourn' ? pxMix(B, P.light(B, 0.4), 0.3) : p.sex === 'F' ? B : low;
  const sk = p.sk != null && P['sk' + p.sk] ? P['sk' + p.sk] : P.skin;
  const map = { H: p.age >= 65 ? P.hairold : P.hair, S: sk, E: P.ol, c: pxMix(sk, P.accent, 0.38), m: P.shade(pxMix(sk, P.accent, 0.5), 0.2),
    B, b: P.shade(B, 0.22), P: low, D, d: P.shade(D, 0.25), F: P.ol };
  const s = pxSprite(PX_PEOPLE[p.sex === 'F' ? 'F' : 'M'][kind], map);
  if (p.aid === 'w' && kind !== 'baby') {
    const rows = PX_PEOPLE[p.sex === 'F' ? 'F' : 'M'][kind], hip = rows.findIndex(r => /[PDd]/.test(r));
    const W = s.w + 4, H = hip + 6, o = new PxR(W, H), fr = P.shade(P.trunk, 0.1), leg = p.sex === 'F' && map.D ? map.D : map.P;
    for (let j = 0; j < hip; j++) for (let i = 0; i < s.w; i++) { const c = s.get(i, j); if (c) o.px(i + 2, j + 1, c); }
    o.rect(3, hip + 1, s.w - 2, 2, leg);
    o.rect(4, hip + 3, 2, 1, leg); o.rect(s.w - 2, hip + 3, 2, 1, leg);
    o.rect(4, hip + 4, 2, 1, map.F); o.rect(s.w - 2, hip + 4, 2, 1, map.F);
    o.line(3, hip + 5, s.w, hip + 5, fr);
    for (const x of [0, W - 2]) { o.rect(x, hip - 1, 2, 6, P.ol); o.px(x + (x ? 0 : 1), hip - 2, P.ol); o.px(x + (x ? 0 : 1), hip + 5, P.ol); o.px(x + (x ? 1 : 0), hip + 2, fr); }
    o.line(1, hip - 5, 1, hip - 2, fr); o.line(W - 2, hip - 5, W - 2, hip - 2, fr);
    return o;
  }
  if (p.aid === 'c' && kind !== 'baby') {
    const o = new PxR(s.w + 2, s.h); o.blit(s, 0, 0, null);
    o.line(s.w - 1, Math.floor(s.h * 0.62), s.w + 1, s.h - 2, '#EFEDE6'); o.px(s.w + 1, s.h - 1, P.accent || P.ol);
    return o;
  }
  if (p.age < 75 || kind !== 'adult') return s;
  const o = new PxR(s.w + 2, s.h); o.blit(s, 0, 0, null);
  o.line(s.w + 1, 9, s.w + 1, s.h - 1, P.trunk); o.px(s.w, 9, P.trunk);
  return o;
}
const PX_NEWBORN = ['..WWWWW..', '.WWHHHWW.', '.WHSSSHW.', '.WSESESW.', '.WcSSScW.', '.WWSSSWW.', '.WwWWWwW.', '.WWwWwWW.', '.WWWwWWW.', '..WWWWW..', '...WWW...'];
function pxNewborn(p, P) {
  const W = P.light(P[p.role] || P.par, 0.6);
  const sk = p.sk != null && P['sk' + p.sk] ? P['sk' + p.sk] : P.skin;
  return pxSprite(PX_NEWBORN, { W, w: P.shade(W, 0.14), H: P.hair, S: sk, E: P.ol, c: pxMix(sk, P.accent, 0.38) });
}
function pxSky(r, m, P, R) {
  const [top, bot] = m.mood === 'low' ? P.sky[m.stage].map(c => pxMix(pxRGB(c), P.cloudlow, 0.35)) : P.sky[m.stage].map(pxRGB);
  const bands = [0, 1, 2, 3, 4].map(k => pxMix(top, bot, k / 4));
  for (let y = 0; y < PX.G; y++) {
    const v = y / (PX.G - 6) * 4, b = Math.min(3, Math.floor(v)), f = Math.min(1, v - b), t = b < 3 ? Math.max(0, (f - 0.7) / 0.3) : 0;
    for (let x = 0; x < PX.W; x++) r.px(x, y, t > PX_BAYER[(y & 3) * 4 + (x & 3)] ? bands[b + 1] : bands[b]);
  }
  if (P.star && m.mood !== 'low') for (let i = 0; i < 14; i++) r.px(R() * PX.W, R() * 22, P.star);
  const [sx, sy, sr] = { m: [30, 14, 4], d: [98, 9, 4], e: [166, 21, 5] }[m.stage];
  const sun = m.mood === 'low' ? pxMix(P.sun, P.cloudlow, 0.55) : P.sun;
  r.disc(sx, sy, sr + 2, pxMix(sun, r.get(sx, sy - sr - 3) || sun, 0.6)); r.disc(sx, sy, sr + 1, pxMix(sun, r.get(sx, sy - sr - 3) || sun, 0.3));
  r.disc(sx, sy, sr, sun); r.disc(sx - 1, sy - 1, sr - 2, m.mood === 'low' ? sun : P.sunhi);
}
function pxCloud(r, cx, by, len, P, R, low) {
  const s = new PxR(len + 8, 14), n = 3 + Math.floor(len / 8), c = low ? P.cloudlow : P.cloud, sh = low ? P.cloudlowsh : P.cloudsh;
  for (let i = 0; i < n; i++) { const bx = 4 + (i + 0.5) * len / n, br = 2 + Math.round(R() * 2) + (i > 0 && i < n - 1 ? 1 : 0); s.disc(bx, 12 - br, br, c); }
  s.rect(4, 10, len, 3, c);
  for (let x = 0; x < s.w; x++) s.d[13 * s.w + x] = null;
  for (let x = 0; x < s.w; x++) { if (s.get(x, 12)) s.px(x, 12, sh); if (s.get(x, 11) && R() < 0.5) s.px(x, 11, sh); }
  r.blit(s, Math.round(cx - s.w / 2), by - 12, null);
}
function pxBirds(r, P, R) { for (let i = 0; i < 3; i++) { const x = 60 + R() * 70, y = 6 + R() * 12; r.px(x - 1, y - 1, P.ol); r.px(x, y, P.ol); r.px(x + 1, y - 1, P.ol); } }
function pxBuilding(r, x, w, h, base, wall, win, R, opt = {}) {
  const top = base - h;
  r.rect(x, top, w, h, wall);
  r.rect(x, top, w, 1, pxMix(wall, [255, 255, 255], 0.12));
  if (opt.step && w > 7) r.rect(x + 2, top - 3, w - 4, 3, wall);
  if (opt.antenna) { r.line(x + (w >> 1), top - (opt.step ? 3 : 0) - 5, x + (w >> 1), top - (opt.step ? 3 : 0), wall); }
  for (let y = top + 2; y < base - 2; y += 3) for (let i = x + 1; i < x + w - 1; i += 2) if (R() < 0.7) r.px(i, y, opt.lit && R() < 0.4 ? opt.lit : win);
}
function pxHills(r, P, R, f, base, amp, c, top) {
  const a = R() * 6, b = R() * 6;
  for (let x = 0; x < PX.W; x++) {
    const y = Math.round(base - amp * (0.6 + 0.4 * Math.sin(x * f + a)) - amp * 0.35 * Math.sin(x * f * 2.7 + b));
    for (let j = y; j < PX.G; j++) r.px(x, j, c);
    if (top) r.px(x, y, top);
  }
}
function pxTree(r, x, base, kind, P) {
  if (kind === 'pine') { for (let j = 0; j < 9; j++) { const w = 1 + (j >> 1); for (let i = -w; i <= w; i++) r.px(x + i, base - 12 + j, (i < 0 ? P.tree2 : P.tree)); } r.rect(x, base - 3, 1, 3, P.trunk); r.px(x, base - 12, P.treehi); return; }
  if (kind === 'palm') {
    for (let j = 0; j < 11; j++) r.px(x + Math.round(Math.sin(j / 4) * 1.5), base - 1 - j, j % 3 ? P.trunk : P.shade(P.trunk, 0.3));
    const tx = x + Math.round(Math.sin(10 / 4) * 1.5), ty = base - 12;
    for (const [dx, dy] of [[-5, 3], [-4, -1], [0, -3], [4, -1], [5, 3]]) r.line(tx, ty, tx + dx, ty + dy, P.tree);
    r.px(tx, ty, P.tree2); return;
  }
  if (kind === 'acacia') { r.line(x, base - 1, x, base - 8, P.trunk); r.line(x, base - 6, x - 3, base - 9, P.trunk); r.line(x, base - 6, x + 3, base - 9, P.trunk); r.rect(x - 7, base - 11, 15, 2, P.tree); r.rect(x - 5, base - 12, 11, 1, P.treehi); r.rect(x - 6, base - 9, 13, 1, P.tree2); return; }
  r.rect(x, base - 4, 1, 4, P.trunk);
  r.disc(x, base - 8, 4, P.tree); r.disc(x + 1, base - 7, 2, P.tree2); r.px(x - 2, base - 10, P.treehi); r.px(x - 1, base - 11, P.treehi);
}
const pxTreeKind = region => region === 'ssa' ? 'acacia' : ['mena', 'lac', 'sa', 'eap'].includes(region) ? 'palm' : region === 'hi' || region === 'eca' ? 'pine' : 'round';
function pxBackdrop(r, m, P, R) {
  const G = PX.G;
  if (m.urban) {
    let x = -4;
    while (x < PX.W) { const w = 6 + Math.round(R() * 9), h = 10 + Math.round(R() * 17); pxBuilding(r, x, w, h, G - 2, P.far1, pxMix(P.far1, P.wall, 0.35), R, { step: R() < 0.3, antenna: R() < 0.25 }); x += w + 1 + Math.round(R() * 3); }
    x = 10 + Math.round(R() * 10);
    while (x < PX.W) {
      const w = 9 + Math.round(R() * 9), h = 13 + Math.round(R() * 15);
      if (m.region === 'mena' && R() < 0.35) {
        r.rect(x, G - 10, 14, 10, P.far2); r.disc(x + 7, G - 11, 5, P.far2); r.rect(x + 16, G - 24, 3, 24, P.far2); r.rect(x + 15, G - 25, 5, 1, P.far2); r.px(x + 17, G - 27, P.far2);
        x += 22; continue;
      }
      pxBuilding(r, x, w, h, G - 1, P.far2, pxMix(P.far2, P.win, 0.5), R, { step: R() < 0.25, lit: P.lit ? P.winlit : (m.stage === 'e' ? pxMix(P.winlit, P.far2, 0.4) : 0) });
      if (R() < 0.2) { r.rect(x + 2, G - 1 - h - 6, 5, 4, P.far2); r.line(x + 3, G - 1 - h - 2, x + 3, G - 1 - h, P.far2); r.line(x + 5, G - 1 - h - 2, x + 5, G - 1 - h, P.far2); }
      x += w + 8 + Math.round(R() * 16);
    }
  } else if (m.region === 'mena') {
    pxHills(r, P, R, 0.035, G - 6, 8, pxMix(P.sand, pxRGB(P.sky[m.stage][1]), 0.35), null);
    pxHills(r, P, R, 0.05, G - 1, 5, P.sand, P.light(P.sand, 0.2));
  } else {
    pxHills(r, P, R, 0.04, G - 10, 8, P.hill1, P.light(P.hill1, 0.15));
    for (let i = 0; i < 18; i++) { const x = R() * PX.W, y = G - 6 - R() * 8; if (r.get(x, y) && r.get(x, y)[0] === P.hill1[0]) { r.px(x, y, P.tree2); r.px(x + 1, y, P.tree); r.px(x, y - 1, P.tree); } }
    pxHills(r, P, R, 0.06, G - 2, 5, P.hill2, P.light(P.hill2, 0.15));
    if (m.region === 'sa' || m.region === 'eap') for (let k = 1; k < 4; k++) for (let x = 0; x < PX.W; x += 1) { const y = G - 2 - k * 2; if (r.get(x, y) && r.get(x, y - 1) && (x + k) % 3) r.px(x, y, P.light(P.hill2, 0.25)); }
  }
  if (m.war) for (const [x0, n] of [[120, 7], [138, 5]]) for (let k = n - 1; k >= 0; k--) {
    const cx = x0 + k * 2 + Math.round(Math.sin(k) * 2), cy = G - 8 - k * 4, rad = 2 + (k >> 1);
    r.disc(cx, cy, rad, P.shade(P.smoke, 0.15)); r.disc(cx - 1, cy - 1, rad - 1, k % 2 ? P.smoke : P.light(P.smoke, 0.1));
  }
}
function pxPole(r, x, P, urban) {
  const c = urban ? P.metal : P.trunk, top = PX.G - 30;
  r.rect(x, top, 2, 30, c); r.rect(x + 1, top, 1, 30, P.shade(c, 0.25));
  r.rect(x - 5, top + 3, 12, 1, c); r.rect(x - 3, top + 7, 8, 1, c);
  for (const dx of [-5, 6]) r.px(x + dx, top + 2, P.wall2);
  const wire = pxMix(P.ol, pxRGB(P.sky.d[1]), 0.4);
  for (const [dx, dy] of [[-5, 3], [6, 3]]) for (let X = 0; X < PX.W; X++) {
    const span = X < x + dx ? [-40, x + dx] : [x + dx, PX.W + 60], t = (X - span[0]) / (span[1] - span[0]);
    r.px(X, Math.round(top + dy + 16 * t * (1 - t)), wire);
  }
}
function pxFence(r, m, P) {
  if (!m.urban && m.region === 'mena') return;
  const G = PX.G, c = m.urban ? P.metal : P.trunk, end = m.prop === 'boat' ? 126 : PX.W;
  for (let x = 0; x < end; x++) { r.px(x, G - 4, c); if (!m.urban) r.px(x, G - 2, c); if (x % 6 === 0) { r.rect(x, G - 5, 1, 5, P.shade(c, 0.2)); } }
}
function pxGround(r, m, P, R) {
  const G = PX.G, W = PX.W, H = PX.H;
  if (m.urban) {
    r.rect(0, G, W, 3, P.pave); for (let x = 0; x < W; x += 7) r.px(x, G + 1, P.pave2); r.rect(0, G + 3, W, 1, P.pave2);
    r.rect(0, G + 4, W, H - G - 4, P.road); for (let x = 3; x < W; x += 12) r.rect(x, G + 8, 6, 1, P.roadline);
    for (let x = 0; x < W; x++) if (R() < 0.08) r.px(x, G + 5 + R() * 6, P.shade(P.road, 0.25));
    return;
  }
  const sand = m.region === 'mena', top = sand ? P.sand : P.grass, top2 = sand ? P.sand2 : P.grass2, soil = sand ? P.sand2 : P.soil, soil2 = sand ? P.shade(P.sand2, 0.2) : P.soil2;
  r.rect(0, G, W, 2, top); r.rect(0, G, W, 1, sand ? P.light(P.sand, 0.2) : P.grasshi);
  r.rect(0, G + 2, W, H - G - 2, soil);
  for (let x = 0; x < W; x++) {
    if (R() < 0.5) r.px(x, G + 2, top2);
    if (R() < 0.12) r.px(x, G + 3 + R() * (H - G - 4), R() < 0.5 ? soil2 : P.stone);
    if (!sand && R() < 0.22) { r.px(x, G - 1, top2); if (R() < 0.4) r.px(x, G - 2, top); }
  }
  r.rect(0, H - 1, W, 1, soil2);
}
const pxCurtain = (P, lit) => lit ? P.shade(P.winlit, 0.3) : P.dark ? pxMix(P.win, P.accent, 0.3) : P.light(P.accent, 0.55);
function pxWindow(s, x, y, P, wall, lit, sill = true, w = 4) {
  const g = lit ? P.winlit : P.win, fr = P.light(P.trunk, P.dark ? 0.1 : 0.25), cur = pxCurtain(P, lit);
  s.rect(x - 1, y - 1, w + 2, 5, fr); s.rect(x, y, w, 3, g);
  s.px(x + 1, y, P.light(g, 0.4)); s.px(x + w - 2, y + 1, P.light(g, 0.25));
  s.px(x, y, cur); s.px(x + w - 1, y, cur); s.px(x, y + 1, cur); s.px(x + w - 1, y + 1, cur);
  if (sill) { s.rect(x - 1, y + 4, w + 2, 1, P.light(wall, 0.35)); s.rect(x - 1, y + 5, w + 2, 1, P.shade(wall, 0.2)); }
}
function pxHouse(P, ww, wh, rh, roof, wall, opt = {}) {
  const s = new PxR(ww + 4 + (opt.wing || 0), wh + rh), cx = 2 + ww / 2 - 0.5;
  for (let j = 0; j < rh; j++) {
    const half = Math.round((j + 1) * (ww / 2 + 2) / rh), i0 = Math.ceil(cx - half), i1 = Math.floor(cx + half);
    for (let i = i0; i <= i1; i++) s.px(i, j, j === rh - 1 ? P.shade(roof, 0.3) : j % 2 ? P.shade(roof, 0.12) : (i + j) % 4 ? roof : P.light(roof, 0.12));
    if (j < rh - 1) { s.px(i0, j, P.light(roof, 0.22)); s.px(i1, j, P.shade(roof, 0.2)); }
  }
  if (opt.thatch) for (let j = 0; j < rh; j++) for (let i = 0; i < s.w; i++) if (s.get(i, j) && (i + j * 2) % 3 === 0) s.px(i, j, P.thatch2);
  s.rect(2, rh, ww, wh, wall); s.rect(2 + ww - 2, rh, 2, wh, P.shade(wall, 0.1)); s.rect(2, rh, ww, 1, P.shade(wall, 0.22));
  if (opt.thatch) for (let y = rh + 3; y < rh + wh - 1; y += 3) for (let i = 3 + (y % 2) * 2; i < 2 + ww - 2; i += 5) s.px(i, y, P.shade(wall, 0.12));
  else for (let y = rh + 3; y < rh + wh - 1; y += 3) s.rect(3, y, ww - 4, 1, pxMix(wall, P.shade(wall, 0.1), 0.5));
  s.rect(2, rh + wh - 1, ww, 1, opt.thatch ? P.shade(wall, 0.25) : pxMix(P.stone, wall, 0.3));
  if (opt.chimney) { s.rect(2 + ww - 6, Math.max(0, rh - 7), 3, 4, P.brick); s.rect(2 + ww - 7, Math.max(0, rh - 8), 5, 1, P.shade(P.brick, 0.25)); }
  if (!opt.noWin) for (const wx of [4, 2 + ww - 7]) pxWindow(s, wx, rh + 3, P, wall, opt.lit);
  const door = Math.round(cx) - 1;
  if (opt.thatch) s.rect(door, rh + wh - 6, 3, 6, P.ol);
  else { s.rect(door - 1, rh + wh - 7, 5, 7, P.shade(wall, 0.3)); s.rect(door, rh + wh - 6, 3, 6, P.trunk); s.rect(door, rh + wh - 6, 1, 6, P.light(P.trunk, 0.15)); s.px(door + 2, rh + wh - 3, P.gold); if (opt.lit) s.px(door + 1, rh + wh - 5, P.shade(P.winlit, 0.2)); }
  if (opt.wing) {
    s.rect(2 + ww, rh + wh - 10, opt.wing, 10, P.wall2); s.rect(2 + ww, rh + wh - 11, opt.wing, 1, P.shade(P.wall2, 0.2)); s.rect(2 + ww, rh + wh - 1, opt.wing, 1, pxMix(P.stone, P.wall2, 0.3));
    pxWindow(s, 2 + ww + 3, rh + wh - 7, P, P.wall2, opt.lit);
  }
  return s;
}
function pxHome(m, P, R) {
  const lit = P.lit || m.stage === 'e';
  switch (m.home) {
    case 'tent': {
      const s = new PxR(26, 14);
      for (let y = 1; y < 14; y++) { const half = y; for (let i = 13 - half; i < 13 + half; i++) s.px(i, y, y === 9 || y === 10 ? P.stamp : i < 13 ? P.light(P.wall2, 0.25) : P.wall2); }
      for (let y = 7; y < 14; y++) { const half = 1 + ((y - 7) >> 1); for (let i = 13 - half; i < 13 + half; i++) s.px(i, y, P.ol); }
      s.px(12, 0, P.trunk); s.px(13, 0, P.trunk);
      return s;
    }
    case 'prison': {
      const s = new PxR(42, 24);
      s.rect(0, 4, 42, 20, P.wall3); s.rect(0, 4, 42, 1, P.light(P.wall3, 0.15));
      for (let i = 0; i < 42; i++) s.px(i, 2 + ((i >> 1) % 2), P.ol);
      for (let k = 0; k < 4; k++) { s.rect(4 + k * 10, 9, 5, 5, P.ol); for (let i = 1; i < 5; i += 2) s.rect(4 + k * 10 + i, 9, 1, 5, P.metal); }
      s.rect(17, 18, 6, 6, P.shade(P.wall3, 0.35));
      return s;
    }
    case 'hut': return pxHouse(P, 18, 9, 10, P.thatch, P.mud, { thatch: true, noWin: true });
    case 'flat': {
      const s = new PxR(30, 40);
      s.rect(0, 2, 30, 38, P.wall); s.rect(26, 2, 4, 38, P.shade(P.wall, 0.1)); s.rect(0, 2, 30, 1, P.shade(P.wall, 0.25)); s.rect(4, 0, 6, 2, P.wall2); s.rect(20, 0, 3, 2, P.metal);
      for (let f = 0; f < 5; f++) {
        const y = 5 + f * 6; s.rect(0, y + 4, 30, 1, P.shade(P.wall, 0.12));
        for (let k = 0; k < 4; k++) {
          const L = lit && R() < 0.5, g = L ? P.winlit : P.win, x = 3 + k * 7;
          s.rect(x - 1, y - 1, 6, 5, P.shade(P.wall, 0.16)); s.rect(x, y, 4, 3, g); s.px(x, y, P.light(g, 0.3)); s.px(x + 3, y, pxCurtain(P, L));
          if (R() < 0.3) { s.rect(x - 1, y + 2, 6, 1, P.metal); s.px(x - 1, y + 3, P.metal); s.px(x + 4, y + 3, P.metal); if (R() < 0.5) s.px(x + 1 + (R() * 2 | 0), y + 1, P.tree); }
        }
      }
      s.rect(11, 33, 8, 1, P.accent); s.rect(11, 34, 8, 6, P.shade(P.wall, 0.3)); s.rect(12, 34, 6, 6, P.ol); s.rect(13, 35, 4, 4, lit ? P.winlit : P.win); s.rect(15, 35, 1, 4, P.shade(P.wall, 0.3));
      return s;
    }
    case 'house': return pxHouse(P, 26, 13, 10, P.roof, P.wall, { chimney: true, lit });
    case 'villa': { const s = pxHouse(P, 32, 15, 11, P.roof, P.wall, { chimney: true, lit, wing: 12 }); for (let i = 0; i < s.w; i++) { s.px(i, s.h - 1, P.tree2); if (i % 3) s.px(i, s.h - 2, P.tree); } return s; }
    case 'small': return pxHouse(P, 17, 10, 8, P.roof, P.wall, { lit });
    case 'mansion': case 'estate': {
      const big = m.home === 'estate', ww = big ? 36 : 32, wh = big ? 28 : 21, rh = 11;
      const s = pxHouse(P, ww, wh, rh, P.roof2, P.wall, { chimney: true, lit, wing: big ? 12 : 10 });
      for (const [row, y] of (big ? [[0, rh + 10], [1, rh + 17]] : [[0, rh + 10]])) {
        s.rect(2, y - 2, ww, 1, P.shade(P.wall, 0.18));
        for (let k = 0; k < 4; k++) pxWindow(s, 4 + k * Math.round((ww - 8) / 3), y, P, P.wall, lit && (k + row) % 2, false);
      }
      if (big) {
        const cx = Math.round(2 + ww / 2) - 1; for (const dx of [-4, 4]) s.rect(cx + dx, rh + wh - 7, 1, 7, P.wall2);
        for (let i = 0; i < s.w; i++) { s.px(i, s.h - 1, P.tree2); if (i % 4) s.px(i, s.h - 2, P.tree); if (i % 6 === 1) s.px(i, s.h - 3, P.treehi); }
        for (const lx of [1, s.w - 2]) { s.rect(lx, s.h - 6, 1, 5, P.ol); s.px(lx, s.h - 7, lit ? P.winlit : P.gold); }
      } else for (let i = 0; i < s.w; i++) { s.px(i, s.h - 1, P.tree2); if (i % 3) s.px(i, s.h - 2, P.tree); }
      return s;
    }
    default: return pxHouse(P, 20, 11, 9, P.roof, P.wall, { lit });
  }
}
function pxCar(P, c) {
  return pxSprite(['....CCCCCC....', '...CwwCwwwC....', '..CCwwCwwwCC...', 'CCCCCCCCCCCCCCC', 'CCCCCCCCCCCCCCY', 'cc.OO.cccc.OO.c', '...OO......OO..'],
    { C: c, c: P.shade(c, 0.3), w: P.win, O: P.ol, Y: P.gold });
}
function pxMoto(P, box) {
  return pxSprite([box ? 'GGG.......HH..' : '..........HH..', box ? 'GGG.SSSS..H...' : '....SSSS..H...', '..MMMMMMMMMMY.', '..O...MM...O..', '.OhO......OhO.', '..O........O..'],
    { M: P.accent, G: P.gold, O: P.ol, S: P.ol, H: P.metal, h: P.metal, Y: P.gold });
}
function pxWork(r, m, P, R) {
  const G = PX.G, lit = P.lit || m.stage === 'e';
  switch (m.prop) {
    case 'office': {
      pxBuilding(r, 150, 12, 26, G, P.wall2, P.win, R, { lit: lit ? P.winlit : 0 });
      const s = new PxR(22, 42); s.rect(0, 2, 22, 40, P.wall3); s.rect(18, 2, 4, 40, P.shade(P.wall3, 0.12)); s.rect(10, 0, 1, 2, P.metal);
      for (let y = 6; y < 34; y += 4) for (let x = 2; x < 18; x += 4) { const L = lit && R() < 0.45; s.rect(x, y, 3, 2, L ? P.winlit : P.win); }
      s.rect(7, 35, 8, 7, P.ol); s.rect(8, 36, 6, 6, P.win); r.blit(s, 164, G - 42, P.ol); r.px(174, G - 45, P.accent);
      return;
    }
    case 'factory': {
      const s = new PxR(40, 20);
      for (let k = 0; k < 3; k++) for (let j = 0; j < 5; j++) { const w = Math.round((j + 1) * 12 / 5); s.rect(k * 12 + 12 - w, j, w, 1, P.wall2); s.px(k * 12 + 11, j, P.win); }
      s.rect(0, 5, 40, 15, P.wall2); s.rect(0, 9, 40, 2, P.win); s.rect(4, 13, 8, 7, P.shade(P.wall2, 0.35));
      r.blit(s, 140, G - 20, P.ol);
      r.rect(176, G - 34, 5, 34, P.brick); r.rect(176, G - 30, 5, 2, P.wall); r.rect(176, G - 34, 5, 1, P.shade(P.brick, 0.3));
      for (let k = 0; k < 4; k++) r.disc(180 + k * 3, G - 38 - k * 3, 2 + (k >> 1), k % 2 ? P.smoke : P.light(P.smoke, 0.15));
      return;
    }
    case 'school': {
      const s = pxHouse(P, 34, 16, 8, P.stamp, P.wall, { lit: false });
      s.rect(18, 4, 3, 3, P.wall); s.px(19, 5, P.ol);
      r.blit(s, 146, G - s.h, P.ol);
      r.line(164, G - s.h - 1, 164, G - s.h - 12, P.metal); r.rect(165, G - s.h - 12, 6, 4, P.stamp);
      return;
    }
    case 'clinic': {
      const s = new PxR(32, 22); s.rect(0, 2, 32, 20, P.wall); s.rect(0, 2, 32, 1, P.shade(P.wall, 0.2)); s.rect(28, 2, 4, 20, P.shade(P.wall, 0.1));
      s.rect(14, 4, 4, 10, P.accent); s.rect(11, 7, 10, 4, P.accent);
      for (const x of [3, 23]) s.rect(x, 8, 5, 4, P.win); s.rect(13, 15, 6, 7, P.ol); s.rect(14, 16, 4, 6, P.win);
      r.blit(s, 148, G - 22, P.ol);
      return;
    }
    case 'dome': {
      const s = new PxR(46, 28);
      s.disc(23, 13, 9, P.wall2); s.rect(13, 13, 21, 3, P.wall2); for (let i = 16; i < 31; i += 3) s.rect(i, 8, 1, 6, P.light(P.wall2, 0.15));
      s.rect(2, 15, 42, 2, P.wall); s.rect(4, 17, 38, 11, P.wall);
      for (let i = 6; i < 42; i += 4) s.rect(i, 18, 2, 10, P.shade(P.wall, 0.15));
      s.rect(19, 21, 8, 7, P.ol);
      r.blit(s, 142, G - 28, P.ol); r.line(165, G - 29, 165, G - 38, P.metal); r.rect(166, G - 38, 5, 3, P.accent);
      return;
    }
    case 'rocket': {
      for (let y = G - 40; y < G; y++) { r.px(176, y, P.metal); r.px(181, y, P.metal); if ((y & 3) === 0) r.line(176, y, 181, y + 3, P.metal); }
      const s = pxSprite(['..A..', '.AAA.', '.WWW.', 'WWWWW', 'WWOWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'AWWWA', 'AWWWA', 'A...A'], { A: P.accent, W: P.wall, O: P.win });
      r.blit(s, 168, G - s.h - 2, P.ol); r.rect(164, G - 2, 20, 2, P.wall3);
      return;
    }
    case 'crane': {
      const s = new PxR(24, 18); for (let y = 0; y < 18; y += 5) s.rect(0, y, 24, 1, P.wall3); for (let x = 0; x < 24; x += 6) s.rect(x, 0, 1, 18, P.wall3); s.rect(0, 10, 24, 8, P.wall2);
      r.blit(s, 138, G - 18, P.ol);
      for (let y = G - 42; y < G; y++) { r.px(168, y, P.crane); r.px(171, y, P.crane); if ((y & 3) === 0) r.line(168, y, 171, y + 3, P.crane); }
      r.rect(146, G - 43, 46, 2, P.crane); r.rect(150, G - 46, 6, 3, P.wall3); r.line(186, G - 41, 186, G - 28, P.ol); r.rect(183, G - 28, 7, 3, P.wall3);
      return;
    }
    case 'flag': {
      const s = pxHouse(P, 22, 12, 4, P.wall3, P.wall2, { lit: false }); r.blit(s, 146, G - s.h, P.ol);
      r.line(178, G - 1, 178, G - 26, P.metal); r.rect(179, G - 26, 7, 2, P.accent); r.rect(179, G - 24, 7, 2, P.wall);
      return;
    }
    case 'pole': {
      r.rect(170, G - 34, 2, 34, P.trunk); r.rect(163, G - 31, 16, 1, P.trunk); r.rect(165, G - 22, 6, 6, P.metal); r.px(167, G - 20, P.gold);
      for (let y = G - 18; y < G; y += 3) r.rect(172, y, 2, 1, P.metal);
      return;
    }
    default: return;
  }
}
function pxFore(r, m, P, R, px0) {
  const G = PX.G;
  switch (m.prop) {
    case 'crops': {
      r.rect(132, G, 60, 10, P.soil); for (let k = 0; k < 4; k++) r.rect(132, G + 2 + k * 3, 60, 1, P.soil2);
      for (let k = 0; k < 4; k++) for (let x = 134 + (k % 2) * 2; x < 190; x += 4) { const y = G + 1 + k * 3; r.px(x, y, P.tree2); r.px(x - 1, y - 1, P.tree); r.px(x + 1, y - 1, P.tree); r.px(x, y - 2, k ? P.tree : P.treehi); }
      return;
    }
    case 'herd': {
      const sheep = pxSprite(['.WWWW...', 'WWWWWWK.', 'WWWWWWKK', 'WWWWWW..', '.K..K...'], { W: P.light(P.wall, 0.4), K: P.ol });
      for (const x of [140, 156, 172]) r.blit(sheep, x, G - 5, null);
      return;
    }
    case 'boat': {
      r.rect(128, G, 64, PX.H - G, P.water); for (let x = 128; x < PX.W; x++) { r.px(x, G, P.water2); if ((x * 7) % 11 < 2) r.px(x, G + 4 + (x % 3) * 3, P.water2); }
      const boat = pxSprite(['........M.......', '.......MSS......', '.......MSSS.....', '.......MSSSS....', '.......MSSSSS...', 'HHHHHHHHHHHHHHHH', '.hhhhhhhhhhhhhh.', '..hhhhhhhhhhhh..'], { M: P.trunk, S: P.wall, H: P.brick, h: P.shade(P.brick, 0.3) });
      r.blit(boat, 150, G - 5, P.ol);
      return;
    }
    case 'stall': {
      const s = new PxR(34, 16);
      for (let x = 0; x < 34; x++) { const c = (x >> 2) % 2 ? P.wall : P.accent; s.rect(x, 0, 1, 3, c); if (x % 4 < 2) s.px(x, 3, c); }
      s.rect(1, 4, 1, 12, P.trunk); s.rect(32, 4, 1, 12, P.trunk); s.rect(2, 9, 30, 2, P.trunk); s.rect(4, 11, 26, 5, P.shade(P.trunk, 0.2));
      for (let x = 4; x < 30; x += 3) s.px(x, 8, [P.gold, P.tree, P.accent][(x / 3 | 0) % 3]);
      r.blit(s, 142, G - 16, P.ol);
      return;
    }
    case 'laundry': {
      r.line(140, G - 1, 140, G - 18, P.trunk); r.line(184, G - 1, 184, G - 18, P.trunk);
      for (let x = 140; x <= 184; x++) { const t = (x - 140) / 44; r.px(x, G - 17 + 4 * t * (1 - t) * 3, P.ol); }
      [P.stamp, P.gold, P.accent, P.light(P.wall, 0.3), P.stamp].forEach((c, k) => { const x = 145 + k * 8, t = (x - 140) / 44, y = Math.round(G - 16 + 4 * t * (1 - t) * 3); r.rect(x, y, 5, 6 + (k % 2) * 2, c); });
      return;
    }
    case 'bench': {
      r.blit(pxSprite(['BBBBBBBBBBBB', '............', 'BBBBBBBBBBBB', 'b..........b', 'b..........b'], { B: P.trunk, b: P.ol }), 150, G - 5, null);
      r.line(170, G - 1, 170, G - 20, P.metal); r.rect(168, G - 22, 5, 2, P.metal); r.px(170, G - 20, P.gold);
      return;
    }
    case 'sign': {
      r.line(160, G - 1, 160, G - 18, P.trunk);
      r.blit(pxSprite(['SSSSSSSSS.', 'SSSSSSSSSS', 'SSSSSSSSS.'], { S: P.stamp }), 161, G - 18, P.ol);
      r.blit(pxSprite(['.SSSSSSSSS', 'SSSSSSSSSS', '.SSSSSSSSS'], { S: P.stamp }), 150, G - 12, P.ol);
      return;
    }
    case 'truck': {
      r.blit(pxSprite(['WWWWWWWWWWWW......', 'WWWWWWWWWWWWCCCC..', 'WWWWWWWWWWWWCwwCC.', 'WWWWWWWWWWWWCCCCCC', 'WWWWWWWWWWWWCCCCCY', 'cc.OO.cccccc.OO.cc', '...OO........OO...'], { W: P.wall2, C: P.accent, c: P.shade(P.wall2, 0.3), w: P.win, O: P.ol, Y: P.gold }), 150, G - 7, P.ol);
      return;
    }
    case 'moto': r.blit(pxMoto(P, true), 156, G - 5, null); return;
    case 'easel': {
      r.line(152, G - 1, 158, G - 20, P.trunk); r.line(164, G - 1, 158, G - 20, P.trunk); r.line(158, G - 20, 158, G - 1, P.trunk);
      r.blit(pxSprite(['WWWWWWWWWW', 'WWWWWWWWWW', 'WWSSWWGGWW', 'WSSSWGGGWW', 'WWWWTTTTWW', 'WWWTTTTTTW', 'WWWWWWWWWW'], { W: P.light(P.wall, 0.3), S: pxRGB(P.sky.d[0]), G: P.gold, T: P.tree }), 153, G - 17, P.ol);
      return;
    }
    case 'mic': {
      r.blit(pxSprite(['AAAAAAAAAA', 'AKKKKKKKKA', 'AKKkkkkKKA', 'AKkKKKKkKA', 'AKkKKKKkKA', 'AKKkkkkKKA', 'AKKKKKKKKA', 'AAAAAAAAAA'], { A: P.wall3, K: P.ol, k: P.metal }), 146, G - 8, P.ol);
      r.line(164, G - 1, 164, G - 17, P.metal); r.line(161, G - 1, 167, G - 1, P.metal); r.rect(163, G - 20, 3, 3, P.ol);
      r.blit(pxSprite(['..H..', '..N..', '..N..', '..N..', '..N..', '..N..', '.BBB.', 'BBBBB', 'BBOBB', 'BBBBB', '.BBB.', 'BBBBB', 'BBBBB', '.BBB.'], { H: P.ol, N: P.trunk, B: P.gold, O: P.ol }), 172, G - 14, P.ol);
      return;
    }
    case 'bundle': r.blit(pxSprite(['.GG.', 'GGGG', 'GGGG', '.GG.'], { G: P.thatch }), px0 + 2, G - 4, P.ol); return;
    case 'toys': r.disc(px0 + 4, G - 2, 2, P.accent); r.px(px0 + 3, G - 3, P.light(P.accent, 0.4)); return;
    default: return;
  }
}
function pxPeopleLay(m, P, home, hx, sprites) {
  const left = hx + home.w + (m.car || m.moto ? 19 : 4), right = !m.prop || ['none', 'toys', 'bundle'].includes(m.prop) ? PX.W - 2 : 136;
  const petW = m.pet ? pxPet(m.pet, P).w + 2 : 0, w = sprites.reduce((t, x) => t + x.s.w, 0), n = Math.max(0, sprites.length - 1);
  let gap = 3; while (gap > 1 && left + w + n * gap + petW > right) gap--;
  const tot = w + n * gap;
  return { x: Math.round(Math.max(left, Math.min(Math.max(86, 108 - tot / 2), right - tot - petW))), gap, tot };
}
function pxScene(m, P) {
  if (m && m.act && typeof pxMoment === 'function') { const Ly = pxMoment(m, P); if (Ly) { const r = new PxR(PX.W, PX.H); for (const k of ['sky', 'back', 'mid', 'front']) r.blit(Ly[k], 0, 0, null); return r; } }
  const R = lvRand(m.seed), r = new PxR(PX.W, PX.H), G = PX.G;
  pxSky(r, m, P, R);
  const clouds = m.mood === 'low' ? 5 : m.mood === 'mid' ? 3 : 2;
  for (let i = 0; i < clouds; i++) pxCloud(r, 14 + (i + 0.3 + R() * 0.5) * (PX.W - 28) / clouds, 10 + Math.round(R() * 12), 16 + Math.round(R() * (m.mood === 'low' ? 22 : 16)), P, R, m.mood === 'low');
  if (m.mood === 'high' && !P.dark) pxBirds(r, P, R);
  if (m.nomad) { r.blit(pxSprite(['.......W.....', 'WWWWWWWWWWWW.', '.WWWWWWWWWWWW', '......W......'], { W: P.light(P.wall, 0.3) }), 136, 10, P.ol); for (let x = 112; x < 134; x += 3) r.px(x, 12, P.cloud); }
  pxBackdrop(r, m, P, R);
  if (!m.urban) for (const x of [58, 66]) pxTree(r, x + Math.round(R() * 4), G, pxTreeKind(m.region), P);
  else { pxTree(r, 64, G, 'round', P); r.rect(62, G - 1, 5, 1, P.wall3); }
  pxPole(r, 76, P, m.urban);
  pxGround(r, m, P, R);
  pxFence(r, m, P);
  pxWork(r, m, P, R);
  const home = pxHome(m, P, R), hx = 4;
  r.blit(home, hx, G - home.h, P.ol);
  if (m.car) r.blit(pxCar(P, P.accent), hx + home.w + 3, G - 6, P.ol);
  else if (m.moto) r.blit(pxMoto(P, false), hx + home.w + 4, G - 5, null);
  const sprites = m.people.map(p => ({ p, s: pxPerson(p, P) }));
  const lay = pxPeopleLay(m, P, home, hx, sprites);
  let x = lay.x;
  for (const { p, s } of sprites) { r.blit(s, x, G - s.h + (p.role === 'me' ? 1 : 0), P.ol); x += s.w + lay.gap; }
  if (sprites.length) x += 3 - lay.gap;
  if (m.nomad) r.blit(pxSprite(['.HH.', 'CCCC', 'CCCC', 'CCCC', 'O..O'], { H: P.ol, C: P.accent, O: P.ol }), x, G - 5, P.ol);
  if (m.pet) { const ps = pxPet(m.pet, P); r.blit(ps, x, G - ps.h, P.ol); x += ps.w + 2; }
  pxFore(r, m, P, R, x);
  return r;
}
function sceneCanvas(m, cv) {
  const P = pxPalette(), r = pxScene(m, P), ctx = cv.getContext('2d'), img = ctx.createImageData(PX.W, PX.H);
  for (let i = 0; i < r.d.length; i++) { const c = r.d[i] || [0, 0, 0]; img.data[i * 4] = c[0]; img.data[i * 4 + 1] = c[1]; img.data[i * 4 + 2] = c[2]; img.data[i * 4 + 3] = 255; }
  ctx.putImageData(img, 0, 0);
  return P.dark;
}
function sceneSnap() {
  const m = sceneModel();
  return [m.urban ? 1 : 0, m.home, m.prop, (m.car ? 1 : 0) + (m.moto ? 2 : 0), m.war ? 1 : 0, m.nomad ? 1 : 0, m.people.map(p => p.role + p.sex + Math.round(p.age - S.age) + (p.aid || '') + (p.sk != null ? 's' + p.sk : '')).join(','), m.pet || ''].join('|');
}
function sceneAt(a) {
  let y = null, sc = null;
  for (const r of S.years) { if (r.a > a) break; y = r; if (r.sc) sc = r.sc; }
  if (!sc) { const r = S.years.find(x => x.sc); sc = r && r.sc; }
  if (!sc || !y) return null;
  const [u, home, prop, cm, war, nomad, ppl, pet] = sc.split('|');
  const people = (ppl || '').split(',').map(t => { const q = t.match(/^(me|pt|par|kid|sib|inlaw)([MF])(-?\d+)([wc]?)(?:s([0-5]))?$/); if (!q) return null;
    const p = { role: q[1], sex: q[2], age: a + +q[3] }; if (q[4]) p.aid = q[4]; if (q[5] != null) p.sk = +q[5]; else if (['me', 'par', 'kid', 'sib'].includes(q[1]) && S.name) p.sk = skinMe(); return p; }).filter(p => p && p.age >= 0 && p.age < 110);
  const c = CBY[y.cur] || C();
  return { stage: a < 13 ? 'm' : a < 60 ? 'd' : 'e', mood: y.h < 35 ? 'low' : y.h > 70 ? 'high' : 'mid', urban: u === '1', region: c.p, home, people,
    prop: a < 6 ? 'toys' : prop, pet: pet || '', car: (+cm & 1) > 0, moto: (+cm & 2) > 0, war: war === '1', nomad: nomad === '1', seed: skinSeed() + (S.city || '') };
}
function sceneFor(a, act) { const m = sceneAt(a); if (m && act) m.act = act; return m; }
function pxFuneral(m, P, mourners) {
  const R = lvRand(m.seed + 'f'), r = new PxR(PX.W, PX.H), G = PX.G, ax = 96;
  pxSky(r, m, P, R);
  for (let i = 0; i < 2; i++) pxCloud(r, 30 + i * 110 + R() * 20, 12 + Math.round(R() * 8), 18 + Math.round(R() * 10), P, R, false);
  pxBackdrop(r, m, P, R);
  pxGround(r, m, P, R);
  const rel = m.rel || '', muslim = rel === 'M', lamps = rel === 'H' || rel === 'S';
  const flowersOn = !muslim && rel !== 'J', incense = !muslim && rel !== 'C' && rel !== 'J' && (rel === 'B' || m.fl === 'eas');
  const cloth = P.light(P.wall, P.dark ? 0.1 : 0.5), flower = lamps || m.fl === 'sa' ? P.gold : m.fl === 'eas' ? P.light(P.wall, 0.6) : P.light(P.wall, 0.45);
  r.rect(ax - 16, G - 7, 32, 7, P.shade(P.trunk, 0.15)); r.rect(ax - 17, G - 8, 34, 2, cloth); r.rect(ax - 16, G - 6, 32, 1, P.shade(cloth, 0.2));
  if (muslim) {
    const sh = P.light(P.wall, P.dark ? 0.55 : 0.85);
    r.rect(ax - 18, G - 9, 36, 1, P.shade(P.trunk, 0.05));
    r.rect(ax - 13, G - 12, 27, 3, sh); r.disc(ax - 13, G - 11, 2, sh); r.rect(ax - 12, G - 13, 24, 1, P.light(sh, 0.4));
    for (const x of [ax - 8, ax, ax + 8]) r.rect(x, G - 12, 1, 3, P.shade(sh, 0.18));
  } else {
    r.rect(ax - 7, G - 25, 14, 17, P.ol); r.rect(ax - 6, G - 24, 12, 15, P.light(P.wall2, 0.3));
    r.rect(ax - 3, G - 13, 6, 4, P.me); r.disc(ax, G - 17, 2, m.sk != null && P['sk' + m.sk] ? P['sk' + m.sk] : P.skin); r.rect(ax - 2, G - 20, 5, 2, m.old ? P.hairold : P.hair);
    if (lamps) { for (let k = 0; k <= 16; k++) { const y = G - 24 + k; r.px(ax - 8, y, k % 2 ? P.gold : P.accent); r.px(ax + 7, y, k % 2 ? P.accent : P.gold); } for (let k = 0; k < 7; k++) r.px(ax - 6 + k * 2, G - 8, k % 2 ? P.gold : P.accent); }
    else r.line(ax - 7, G - 22, ax - 4, G - 25, P.ol), r.line(ax + 6, G - 22, ax + 3, G - 25, P.ol);
    if (rel === 'C') { r.rect(ax, G - 31, 1, 5, P.ol); r.rect(ax - 1, G - 30, 3, 1, P.ol); }
  }
  if (flowersOn) {
    for (let k = 0; k < 6; k++) { r.disc(ax - 14 + k * 1.5, G - 9 - (k % 2), 1, flower); r.disc(ax + 7 + k * 1.5, G - 9 - (k % 2), 1, flower); }
    for (let k = 0; k < 4; k++) { r.px(ax - 13 + k * 2, G - 8, P.tree2); r.px(ax + 8 + k * 2, G - 8, P.tree2); }
  }
  if (lamps) for (const cx of [ax - 19, ax + 18]) { r.rect(cx - 1, G - 2, 3, 2, P.shade(P.trunk, 0.1)); r.px(cx, G - 3, P.gold); r.px(cx, G - 4, P.sunhi); }
  else if (!muslim) for (const cx of [ax - 19, ax + 18]) { r.rect(cx, G - 6, 1, 6, P.light(P.wall, 0.5)); r.px(cx, G - 7, P.gold); r.px(cx, G - 8, P.sunhi); }
  if (incense) {
    r.rect(ax - 2, G - 7, 5, 2, P.shade(P.metal, 0.1));
    for (const x of [ax - 1, ax, ax + 1]) { r.px(x, G - 8, P.trunk); r.px(x, G - 9, P.trunk); r.px(x, G - 10, P.accent); }
    for (const [dx, dy] of [[1, 12], [2, 14], [4, 16], [5, 18]]) r.px(ax + dx, G - dy, P.smoke);
  }
  P.mourn = m.wm ? P.light(P.wall, P.dark ? 0.45 : 0.8) : P.dark ? P.light(P.ol, 0.28) : P.light(P.ol, 0.16);
  const sprites = mourners.map(p => pxPerson(Object.assign({}, p, { role: 'mourn' }), P));
  const left = sprites.filter((_, i) => i % 2 === 0), right = sprites.filter((_, i) => i % 2 === 1);
  let x = ax - 23; for (const s of left) { x -= s.w; if (x < 2) break; r.blit(s, x, G - s.h, P.ol); x -= 3; }
  x = ax + 23; for (const s of right) { if (x + s.w > PX.W - 2) break; r.blit(s, x, G - s.h, P.ol); x += s.w + 3; }
  return r;
}
function pxDraw(r, cv) {
  const ctx = cv.getContext('2d'), img = ctx.createImageData(PX.W, PX.H);
  for (let i = 0; i < r.d.length; i++) { const c = r.d[i] || [0, 0, 0]; img.data[i * 4] = c[0]; img.data[i * 4 + 1] = c[1]; img.data[i * 4 + 2] = c[2]; img.data[i * 4 + 3] = 255; }
  ctx.putImageData(img, 0, 0);
}
const SC_HOME_KO = { tent: "lều trong trại tị nạn", prison: "nhà tù", hut: "nhà vách đất", cottage: "nhà ở quê", flat: "căn hộ", house: L`내 집${LBL}`, villa: "ngôi nhà rộng", small: "căn nhà nhỏ", mansion: "biệt thự hai tầng", estate: "biệt thự lớn có vườn" };
const ptParts = (ps, meSex) => { const pt = ps.filter(p => p.role === 'pt'); return !pt.length ? [] : pt.length > 1 && meSex === 'M' ? ["hai người vợ"] : pt.length > 1 ? [L`배우자${LBL}`, L`남편의 다른 아내${LBL}`] : [L`배우자${LBL}`]; };
function sceneCaption(m) {
  const sa = typeof studyAway === 'function' ? studyAway() : null, c = C();
  const place = sa ? (typeof awayTrainee === 'function' && awayTrainee() ? L`${studyCity()}, ${CBY[sa].ko} (연습생)` : L`${studyCity()}, ${CBY[sa].ko} (유학)`) : S.urban ? (`${S.city || "thành phố"}, ${c.ko}`) : typeof ruralWhere === 'function' && ruralWhere() ? L`${c.ko} ${ruralWhere()} 농촌 마을` : L`${c.ko} 농촌 마을`;
  const with_ = m.people.filter(p => p.role !== 'me');
  const kids = with_.filter(p => p.role === 'kid' && !p.gk), hk = S.job === 'prison' || typeof homeOthers !== 'function' ? [] : homeOthers().kids,
    nk = Math.max(kids.length, hk.length), adult = kids.some(p => p.age >= 18) || hk.some(k => S.age - k.bornAt >= 18), ngk = with_.filter(p => p.gk).length;
  const par = with_.filter(p => p.role === 'par'), ns = Math.max(with_.filter(p => p.role === 'sib').length, S.job === 'prison' || typeof sibsHome !== 'function' ? 0 : sibsHome().length), il = with_.filter(p => p.role === 'inlaw');
  const ilw = il.length === 1 ? (il[0].ps ? "bạn đời của con" : il[0].sex === 'F' ? "con dâu" : "con rể") : il.length ? L`자녀의 배우자 ${il.length}명` : null;
  const rw = par.some(p => p.raised) && S.flags.raised ? (S.flags.raised.k === 'foster' ? "bố mẹ nuôi tạm thời" : raisedWord(S.flags.raised)) : '';
  const parts = [rw ? rw : par.some(p => p.step) ? (par.length > 1 ? "mẹ và bố dượng" : "bố dượng") : par.length > 1 ? "bố mẹ" : par.length && (par[0].sex === 'F' ? "mẹ" : "bố"), ns && (ns === 1 ? "một người anh chị em" : L`형제자매 ${ns}명`), ...ptParts(with_, S.sex), nk && (adult ? L`자녀 ${nk}명` : L`아이 ${nk}명`), ilw, ngk && L`손주 ${ngk}명`, m.pet && S.pet && (m.pet === 'd' ? L`강아지 ${S.pet.n}` : m.pet === 'c' ? L`고양이 ${S.pet.n}` : typeof petWord === 'function' ? L`${petWord(m.pet)} ${S.pet.n}` : S.pet.n)].filter(Boolean);
  const fam = parts.length ? L`${wa(listAnd(parts))} 함께` : '';
  const ex = S.fam.kids.filter(k => k.alive && k.away && !k.placed && !k.grown && !k.lb).length;
  const away = S.fam.kids.filter(k => k.alive && ((k.grown && !k.withMe) || (k.away && (k.placed || k.grown)))).length;
  const exW = !ex ? '' : S.flags.exSs ? (ex === 1 ? "một đứa con sống với người bố hoặc mẹ còn lại" : L`아이 ${ex}명은 다른 부모와 삶`) : S.sex === 'F' ? (ex === 1 ? "một đứa con sống với bố" : L`아이 ${ex}명은 아빠와 삶`) : (ex === 1 ? "một đứa con sống với mẹ" : L`아이 ${ex}명은 엄마와 삶`);
  const lbW = typeof famWaitW === 'function' ? famWaitW() : '';
  return [place, m.nomad ? "làm dân du mục kỹ thuật số, đi từ nước này sang nước khác" : S.flags.oldHome === 'care' && m.home === 'flat' ? "viện dưỡng lão" : S.flags.ddHome === 'gh' && m.home === 'flat' ? "nhà ở nhóm" : typeof vowedHome === 'function' && vowedHome() && m.home === 'flat' ? vowedPlace() : S.flags.ddHome === 'sib' ? "nhà của anh chị em" : SC_HOME_KO[m.home], fam, exW, lbW, away ?(away === 1 ? "một người con sống riêng" : L`자녀 ${away}명은 따로 삶`) : ''].filter(Boolean).join(' · ');
}
let scKey = '';
const sceneKey = (m, cap) => JSON.stringify([m.stage, m.mood, m.urban, m.region, m.home, m.people.map(p => [p.role, p.sex, Math.min(80, Math.floor(p.age / 3)), p.aid || '', p.sk]), m.prop, m.pet, m.car, m.moto, m.war, m.nomad, m.seed, cap]);
function renderScene() {
  const el = document.getElementById('scene'); if (!el || !S) return;
  const m = sceneModel(), cap = sceneCaption(m);
  const theme = document.documentElement.dataset.theme || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'd' : 'l');
  const key = sceneKey(m, cap) + theme;
  if (key === scKey) return;
  scKey = key;
  let cv = el.querySelector('canvas');
  if (!cv) { el.textContent = ''; cv = document.createElement('canvas'); cv.width = PX.W; cv.height = PX.H; el.appendChild(cv); }
  sceneCanvas(m, cv);
  const capEl = document.getElementById('sceneCap');
  if (capEl) capEl.textContent = cap;
  el.setAttribute('aria-label', L`지금 삶의 모습: ${cap}`);
}
const LF = { W: 320, H: 178, x0: 10, x1: 312, y0: 16, y1: 146 };
function flowData() {
  let wk = '', iv = '';
  return (S.years || []).map(y => { if (y.w !== undefined) wk = y.w; if (y.v !== undefined) iv = y.v; return [y, wk, iv]; }).filter(([y]) => y.a >= 15).map(([y, wk, iv]) => {
    const c = CBY[y.cur] || C(), inc = y.inc > 0 ? y.inc : 0;
    return { a: y.a, cur: y.cur, inc, nw: y.nw, n: inc > 0 ? pctOfIncome(c, inc) : null, w: inc > 0 ? worldPct(inc) : null, wk, iv };
  });
}
const LF_IV = () => ({ cash: L`예금${LBL}`, bond: L`채권${LBL}`, mix: L`주식·채권 반반${LBL}`, stock: L`주식${LBL}`, world: L`해외 지수${LBL}`, property: L`부동산 투자${LBL}`, trade: L`종목 사고팔기${LBL}`, debt: L`빚${LBL}`, loan: "đang trả nợ vay mua nhà" });
function laneSVG(d, a0, a1, key, name, cls) {
  if (!d.some(p => p[key])) return '';
  const X = a => LF.x0 + (LF.x1 - LF.x0) * (a - a0) / Math.max(1, a1 - a0), half = (LF.x1 - LF.x0) / Math.max(1, a1 - a0) / 2;
  const tw = t => [...t].reduce((s, ch) => s + (/[\u1100-\u11ff\u3000-\u9fff\uac00-\ud7af]/.test(ch) ? 10 : 5.6), 8);
  const segs = []; for (const p of d) { const v = p[key] || ''; const s = segs[segs.length - 1]; if (s && s.v === v) s.b = p.a; else segs.push({ v, a: p.a, b: p.a }); }
  let g = '', alt = 0;
  for (const s of segs) {
    if (!s.v) continue;
    const x0 = Math.max(LF.x0, X(s.a) - half), x1 = Math.min(LF.x1, X(s.b) + half), w = x1 - x0, t = name(s.v);
    g += `<rect x="${x0.toFixed(1)}" y="3" width="${Math.max(1, w - 1).toFixed(1)}" height="18" rx="2" class="lf-seg ${cls(s.v, alt++)}"/>`;
    if (t && w >= tw(t)) g += `<text x="${((x0 + x1) / 2).toFixed(1)}" y="15.5" text-anchor="middle" class="lf-segt">${esc(t)}</text>`;
  }
  return `<svg viewBox="0 0 ${LF.W} 24" class="lf-lane" aria-hidden="true">${g}</svg>`;
}
function lfNice(span, n) { const raw = span / n, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
function lfPath(pts, X, Y, key) { let d = '', on = false; for (const p of pts) { if (p[key] == null) { on = false; continue; } d += (on ? 'L' : 'M') + X(p.a).toFixed(1) + ' ' + Y(p[key]).toFixed(1); on = true; } return d; }
function lfAxisX(a0, a1, X) {
  const step = a1 - a0 > 60 ? 20 : 10; let g = '';
  for (let a = Math.ceil(a0 / step) * step; a <= a1; a += step) g += `<text x="${X(a).toFixed(1)}" y="${LF.H - 16}" text-anchor="middle" class="lf-tick">${a}</text>`;
  return g + L`<text x="${LF.x1}" y="${LF.H - 3}" text-anchor="end" class="lf-tick">나이</text>`;
}
function rankSVG(d, a0, a1) {
  const X = a => LF.x0 + (LF.x1 - LF.x0) * (a - a0) / Math.max(1, a1 - a0), Y = p => LF.y1 - (LF.y1 - LF.y0) * p;
  let g = '';
  for (const [p, t] of [[1, "Cao"], [0.75, ''], [0.5, "Giữa"], [0.25, ''], [0, "Thấp"]]) g += `<line x1="${LF.x0}" x2="${LF.x1}" y1="${Y(p)}" y2="${Y(p)}" class="lf-grid"/>${t ? `<text x="${LF.x0 + 2}" y="${Y(p) - 4}" class="lf-tick">${t}</text>` : ''}`;
  g += lfAxisX(a0, a1, X);
  g += `<path d="${lfPath(d, X, Y, 'w')}" class="lf-line lf-world"/>`;
  g += `<path d="${lfPath(d, X, Y, 'n')}" class="lf-line lf-nat"/>`;
  const last = [...d].reverse().find(p => p.n != null);
  if (last) g += `<circle cx="${X(last.a)}" cy="${Y(last.n)}" r="4" class="lf-dot"/>`;
  g += `<line class="lf-cross" x1="0" x2="0" y1="${LF.y0}" y2="${LF.y1}" visibility="hidden"/>`;
  return L`<svg viewBox="0 0 ${LF.W} ${LF.H}" role="img" aria-label="나이별 소득 순위">${g}</svg>`;
}
function worthSVG(d, a0, a1) {
  const U = CUR_K, vals = d.map(p => p.nw * U), lo = Math.min(0, ...vals), hi = Math.max(0, ...vals);
  const step = lfNice(Math.max(1e7, hi - lo), 4), ylo = Math.floor(lo / step) * step, yhi = Math.ceil(hi / step) * step || step;
  const X = a => LF.x0 + (LF.x1 - LF.x0) * (a - a0) / Math.max(1, a1 - a0), Y = w => LF.y1 - (LF.y1 - LF.y0) * (w - ylo) / (yhi - ylo);
  let g = '';
  for (let w = ylo; w <= yhi + step / 2; w += step) g += `<line x1="${LF.x0}" x2="${LF.x1}" y1="${Y(w).toFixed(1)}" y2="${Y(w).toFixed(1)}" class="${Math.abs(w) < step / 2 ? 'lf-zero' : 'lf-grid'}"/><text x="${LF.x0 + 2}" y="${(Y(w) - 4).toFixed(1)}" class="lf-tick">${Math.abs(w) < step / 2 ? '0' : (wonStr(w / U).replace(" đồng", ''))}</text>`;
  g += lfAxisX(a0, a1, X);
  const pts = d.map(p => ({ a: p.a, v: p.nw * U }));
  const line = lfPath(pts, X, Y, 'v');
  g += `<path d="${line}L${X(pts[pts.length - 1].a).toFixed(1)} ${Y(0).toFixed(1)}L${X(pts[0].a).toFixed(1)} ${Y(0).toFixed(1)}Z" class="lf-area"/>`;
  g += `<path d="${line}" class="lf-line lf-nat"/>`;
  const last = pts[pts.length - 1];
  g += `<circle cx="${X(last.a)}" cy="${Y(last.v)}" r="4" class="lf-dot"/>`;
  g += `<line class="lf-cross" x1="0" x2="0" y1="${LF.y0}" y2="${LF.y1}" visibility="hidden"/>`;
  return L`<svg viewBox="0 0 ${LF.W} ${LF.H}" role="img" aria-label="나이별 순자산">${g}</svg>`;
}
let LFD = null;
function flowHTML() {
  const d = flowData(); if (d.length < 3) return '';
  const a0 = d[0].a, a1 = d[d.length - 1].a; LFD = { d, a0, a1 };
  const earned = d.some(p => p.n != null), last = [...d].reverse().find(p => p.n != null);
  const peakN = earned ? d.reduce((b, p) => p.n != null && p.n > b.n ? p : b, { n: -1 }) : null;
  const peakW = d.reduce((b, p) => p.nw > b.nw ? p : b, d[0]);
  const top = p => rankStr(p);
  const hasW = d.some(p => p.wk), hasV = d.some(p => p.iv), IVN = LF_IV();
  const rows = d.filter(p => p.a % 5 === 0 || p === d[d.length - 1]).map(p => L`<tr><td>${p.a}세</td><td>${p.n != null ? top(p.n) : '—'}</td><td>${p.w != null ? top(p.w) : '—'}</td><td>${wonStr(p.nw)}</td></tr>`.replace('</tr>', (hasW ? `<td class="lf-wk">${esc(p.wk || '—')}</td>` : '') + '</tr>')).join('');
  const wLane = laneSVG(d, a0, a1, 'wk', t => t, (v, i) => i % 2 ? 'lf-sa' : 'lf-sb');
  const vLane = laneSVG(d, a0, a1, 'iv', v => IVN[v] || '', v => 'lf-iv-' + v);
  return L`<div class="panel flow"><h3><span>소득과 재산의 흐름</span><span class="lbl">15세부터 · 한국 체감 금액</span></h3>
    <div class="flowgrid">
      <div><div class="flowt">소득 순위 <small>${earned ? L`가장 높았던 해: ${peakN.a}세, 나라 안 ${top(peakN.n)}` : "không có năm nào có thu nhập"}</small></div>
        <div class="lchart" data-ch="rank" tabindex="0" aria-label="소득 순위 그래프. 좌우 화살표로 해마다 볼 수 있어요">${rankSVG(d, a0, a1)}${wLane}<div class="ftip" hidden></div></div>
        <div class="legend"><span><i style="background:var(--stamp)"></i>살던 나라 안${last ? L` (마지막 ${top(last.n)})` : ''}</span><span><i class="dash"></i>세계${last ? L` (마지막 ${top(last.w)})` : ''}</span><span>벌이가 없던 해는 비워 둠</span>${wLane ? "<span>dải bên dưới: công việc năm đó</span>" : ''}</div></div>
      <div><div class="flowt">순자산 <small>가장 많았던 해: ${peakW.a}세, ${wonStr(peakW.nw)}</small></div>
        <div class="lchart" data-ch="worth" tabindex="0" aria-label="순자산 그래프. 좌우 화살표로 해마다 볼 수 있어요">${worthSVG(d, a0, a1)}${vLane}<div class="ftip" hidden></div></div>
        <div class="legend"><span>0 아래는 빚이 재산보다 많았던 해</span>${vLane ? "<span>dải bên dưới: nơi để tiền tiết kiệm</span>" : ''}</div></div>
    </div>
    <details class="flowtable"><summary>숫자로 보기</summary><table><tr><th>나이</th><th>나라 안 소득</th><th>세계 소득</th><th>순자산</th>${hasW ? "<th>Công việc</th>" : ''}</tr>${rows}</table></details></div>`;
}
function flowShow(el, a) {
  if (!LFD) return;
  const { d, a0, a1 } = LFD; a = Math.max(a0, Math.min(a1, a)); el.dataset.a = a;
  const p = d.find(x => x.a === a) || d.reduce((b, x) => Math.abs(x.a - a) < Math.abs(b.a - a) ? x : b, d[0]);
  const X = LF.x0 + (LF.x1 - LF.x0) * (p.a - a0) / Math.max(1, a1 - a0);
  const cross = el.querySelector('.lf-cross'); cross.setAttribute('x1', X); cross.setAttribute('x2', X); cross.setAttribute('visibility', 'visible');
  const tip = el.querySelector('.ftip'); tip.hidden = false; tip.textContent = '';
  const line = (v, k) => { const r = document.createElement('div'); const b = document.createElement('b'); b.textContent = v; r.appendChild(b); if (k) r.appendChild(document.createTextNode(' ' + k)); tip.appendChild(r); };
  line(L`${p.a}세`, (CBY[p.cur] || C()).ko);
  if (el.dataset.ch === 'rank') { if (p.n != null) { line(rankStr(p.n), "trong nước"); line(rankStr(p.w), "thế giới"); } else line("không có thu nhập", ''); if (p.wk) line(p.wk, ''); }
  else { line(wonStr(p.nw), "tài sản ròng"); if (p.n != null) line(rankStr(p.n), "thu nhập trong nước"); if (p.iv && LF_IV()[p.iv]) line(LF_IV()[p.iv], ''); }
  const left = (X / LF.W) * 100; tip.style.left = left > 60 ? '' : `calc(${left}% + 10px)`; tip.style.right = left > 60 ? `calc(${100 - left}% + 10px)` : '';
}
function flowHide(el) { const t = el.querySelector('.ftip'); if (t) t.hidden = true; const c = el.querySelector('.lf-cross'); if (c) c.setAttribute('visibility', 'hidden'); }
function bindFlow(root) {
  for (const el of root.querySelectorAll('.lchart')) {
    const at = e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * LF.W; return Math.round(LFD.a0 + (x - LF.x0) / (LF.x1 - LF.x0) * (LFD.a1 - LFD.a0)); };
    el.addEventListener('pointermove', e => flowShow(el, at(e)));
    el.addEventListener('pointerdown', e => flowShow(el, at(e)));
    el.addEventListener('pointerleave', () => flowHide(el));
    el.addEventListener('blur', () => flowHide(el));
    el.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; e.preventDefault();
      flowShow(el, (+el.dataset.a || (e.key === 'ArrowLeft' ? LFD.a1 + 1 : LFD.a0 - 1)) + (e.key === 'ArrowLeft' ? -1 : 1));
    });
  }
}
const MO = {};
function pxMoment(m, P) {
  const parts = String(m.act || '').split(':'), f = MO[parts[0]];
  if (!f) return null;
  const R = lvRand(String(m.seed || '') + m.act), L = () => new PxR(PX.W, PX.H);
  const c = { m, P, R, a: parts.slice(1), sky: L(), back: L(), mid: L(), front: L(), span: null, cast: moCast(m) };
  f(c);
  return { sky: c.sky, back: c.back, mid: c.mid, front: c.front, people: c.span || [78, 114] };
}
function moCast(m) {
  const ps = (m.people || []).filter(p => p && p.age >= 0);
  const me = ps.find(p => p.role === 'me') || { role: 'me', sex: 'F', age: 30 };
  const by = r => ps.filter(p => p.role === r);
  return { all: ps, me, pt: by('pt'), kids: by('kid').filter(p => !p.gk), gk: by('kid').filter(p => p.gk), par: by('par'), sib: by('sib'), inlaw: by('inlaw'), sk: me.sk };
}
function moGen(c, role, sex, age, k) {
  const R = c.R, sk0 = c.cast.sk;
  const sk = sk0 == null ? null : Math.max(0, Math.min(5, sk0 + (R() < 0.6 ? 0 : R() < 0.5 ? -1 : 1)));
  return { role, sex: sex || (R() < 0.5 ? 'F' : 'M'), age: Math.max(0, Math.round(age)), sk, gen: k || 1, tc: Math.floor(R() * 7) };
}
const moWhite = P => P.light(P.wall, P.dark ? 0.35 : 0.8);
const moNavy = P => pxMix(P.ol, pxRGB('#33507A'), 0.55);
const moRGB = h => pxRGB(h);
const moGenCol = (P, i) => [P.gold, P.stamp, P.light(P.accent, 0.25), P.water, P.light(P.tree, 0.05), P.light(P.wall3, 0.05), pxMix(P.sib, P.accent, 0.4)][i % 7];
function moFig(p, P, o = {}) {
  if (p.aid) { const s = pxPerson(p, P); s.hand = [s.w - 2, Math.round(s.h * 0.55)]; return s; }
  const sex = p.sex === 'F' ? 'F' : 'M', kind = p.age < 3 ? 'baby' : p.age < 7 ? 'small' : p.age < 13 ? 'child' : p.age < 18 ? 'teen' : 'adult';
  let rows = PX_PEOPLE[sex][kind].slice();
  const B = o.top || (p.gen && p.tc != null ? moGenCol(P, p.tc) : P[p.role] || P.par), low = o.bot || P.pants;
  const D = o.dress || (sex === 'F' ? (o.top || p.role === 'me' ? B : pxMix(B, P.light(B, 0.4), 0.3)) : low);
  const sk = p.sk != null && P['sk' + p.sk] ? P['sk' + p.sk] : P.skin;
  const map = { H: p.age >= 65 ? P.hairold : P.hair, S: sk, E: P.ol, c: pxMix(sk, P.accent, 0.38), m: P.shade(pxMix(sk, P.accent, 0.5), 0.2), B, b: P.shade(B, 0.22), P: low, D, d: P.shade(D, 0.25), F: P.ol };
  const pose = kind === 'baby' ? '' : o.pose || '';
  const hr = rows.reduce((h, r, i) => r[0] === 'S' && /[BbD]/.test(r) ? i : h, -1);
  const sr = rows.findIndex(r => /B/.test(r));
  const legs = rows.findIndex((r, i) => i > hr && /[PDd]/.test(r));
  if (pose === 'sit' && legs > 0) {
    const lap = rows[legs].replace(/\.([PDd])/, '$1$1').replace(/([PDd])\.(?=\.*$)/, '$1$1');
    rows = rows.slice(0, legs).concat([lap], rows.slice(-1));
  }
  if (pose === 'walk') rows = rows.map((r, i) => i < rows.length - 2 ? r : moSpread(r));
  let s = pxSprite(rows, map), ox = 0;
  if ((pose === 'up' || pose === 'wave') && hr > 0 && sr > 0) {
    const o2 = new PxR(s.w + 2, s.h); o2.blit(s, 1, 0, null); ox = 1;
    for (const side of pose === 'up' ? [0, 1] : [1]) {
      const x0 = side ? s.w : 1, ax = side ? s.w + 1 : 0;
      for (let y = sr + 1; y <= hr; y++) o2.d[y * o2.w + x0] = null;
      for (let y = Math.max(0, sr - 3); y <= sr; y++) o2.px(ax, y, y === sr ? map.b : B);
      o2.px(ax, Math.max(0, sr - 4), sk); o2.px(ax, Math.max(0, sr - 5), sk);
    }
    s = o2;
  }
  if (pose === 'hold' && hr > 0) {
    const W = o.bun || P.light(P.kid, 0.55), bw = 5, bx = Math.floor((s.w - bw) / 2), by = hr - 3;
    const bun = pxSprite(['.WWW.', 'WSSSW', 'WWWWW', '.WWW.'], { W, S: P.light(sk, 0.1) });
    s.d[hr * s.w] = null; s.d[hr * s.w + s.w - 1] = null;
    s.blit(bun, bx, by, null); s.px(bx, by + 2, sk); s.px(bx + bw - 1, by + 2, sk);
  }
  s.hand = [s.w - 1, hr > 0 ? hr : s.h - 4]; s.lhand = [0, hr > 0 ? hr : s.h - 4]; s.ox = ox; s.hw = kind === 'adult' || kind === 'teen' ? 9 : kind === 'baby' ? 6 : 7;
  if (o.hat) s = moHat(s, o.hat, P, o.cap);
  return s;
}
const moSpread = r => { const n = r.length, h = n >> 1; let out = ''; for (let i = 0; i < n; i++) { const src = i < h ? i + 1 : i > h ? i - 1 : -1; out += src >= 0 && src < n && r[src] !== '.' && (i < h ? src < h : src > h) ? r[src] : '.'; } return out; };
function moHat(s, k, P, col) {
  const up = k === 'chef' || k === 'party' ? 4 : k === 'grad' ? 2 : k === 'veil' ? 0 : 1, wide = k === 'straw' || k === 'grad' ? 2 : 0;
  const o = new PxR(s.w + wide * 2, s.h + up); o.blit(s, wide, up, null);
  const x0 = (s.ox || 0) + wide, hw = s.hw, cx = x0 + (hw >> 1), y0 = up;
  const put = (x, y, c) => o.px(x0 + x, y0 + y, c);
  if (k === 'grad') { const K = col || moNavy(P); for (let x = -2; x <= hw + 1; x++) put(x, -1, K); for (let x = 1; x < hw - 1; x++) put(x, 0, K); put(hw + 1, 0, P.gold); put(hw + 1, 1, P.gold); }
  else if (k === 'hard') { const Y = col || P.crane; for (let x = 2; x < hw - 2; x++) put(x, -1, Y); for (let x = 1; x < hw - 1; x++) put(x, 0, Y); for (let x = 0; x < hw; x++) put(x, 1, P.shade(Y, 0.1)); put(2, -1, P.light(Y, 0.4)); }
  else if (k === 'chef') { const W = moWhite(P); for (let y = -4; y <= 0; y++) for (let x = 1; x < hw - 1; x++) if (!(y === -4 && (x === 1 || x === hw - 2))) put(x, y, y === 0 ? P.shade(W, 0.08) : W); }
  else if (k === 'straw') { const T = col || P.light(P.thatch, 0.25); for (let x = 2; x < hw - 2; x++) { put(x, -1, T); put(x, 0, P.accent); } for (let x = -2; x < hw + 2; x++) put(x, 1, x < 0 || x >= hw ? P.shade(T, 0.08) : T); }
  else if (k === 'party') { const A = col || P.accent; put(cx - x0, -4, P.gold); for (let y = -3; y <= 0; y++) for (let x = -(y + 4 >> 1); x <= (y + 4 >> 1); x++) put(cx - x0 + x, y, (y & 1) ? P.gold : A); }
  else if (k === 'veil') { const W = P.light(P.wall, 0.85); for (let x = 1; x < hw - 1; x++) put(x, 0, W); put(hw >> 1, -0, P.gold); for (let y = 1; y < 13; y++) { o.dither(x0 - 1, y0 + y, W, 0.8); o.dither(x0 + hw, y0 + y, W, 0.8); } }
  else if (k === 'mil') { const G = col || pxMix(P.tree2, P.ol, 0.25); for (let x = 1; x < hw - 1; x++) put(x, -1, G); for (let x = 0; x < hw; x++) put(x, 0, G); put(2, 0, P.gold); }
  else if (k === 'cap') { const A = col || P.accent; for (let x = 1; x < hw - 1; x++) put(x, 0, A); for (let x = hw - 3; x < hw + 2; x++) put(x, 1, P.shade(A, 0.15)); }
  o.hand = [s.hand[0] + wide, s.hand[1] + up]; o.lhand = [s.lhand[0] + wide, s.lhand[1] + up]; o.ox = x0; o.hw = hw;
  return o;
}
const MO_WEAR = {
  suit: P => ({ top: pxMix(P.ol, moRGB('#2F3A52'), 0.6), bot: pxMix(P.ol, moRGB('#2F3A52'), 0.45) }),
  bride: P => { const W = P.light(P.wall, 0.9); return { top: W, dress: W, bot: W }; },
  gown: P => { const N = moNavy(P); return { top: N, bot: N, dress: N }; },
  coat: P => ({ top: moWhite(P), dress: moWhite(P) }),
  scrubs: P => ({ top: pxMix(P.stamp, P.wall, 0.35), bot: pxMix(P.stamp, P.wall, 0.25), dress: pxMix(P.stamp, P.wall, 0.3) }),
  mil: P => { const G = pxMix(P.tree2, P.ol, 0.2); return { top: G, bot: P.shade(G, 0.15), dress: P.shade(G, 0.15) }; },
  school: P => ({ top: moNavy(P), bot: P.light(P.wall3, 0.1), dress: pxMix(moNavy(P), P.wall3, 0.35) }),
  patient: P => ({ top: P.light(P.water, 0.45), dress: P.light(P.water, 0.45), bot: P.light(P.water, 0.35) }),
  chef: P => ({ top: moWhite(P), dress: moWhite(P) }),
  vest: P => ({ top: pxMix(P.crane, P.accent, 0.35) }),
  black: P => { const K = P.dark ? P.light(P.ol, 0.28) : P.light(P.ol, 0.16); return { top: K, bot: P.shade(K, 0.2), dress: K }; },
  white: P => { const W = P.light(P.wall, 0.82); return { top: W, bot: W, dress: W }; },
  red: P => ({ top: pxMix(P.accent, moRGB('#C0303A'), 0.6), dress: pxMix(P.accent, moRGB('#C0303A'), 0.6) }),
};
const moWear = (k, P) => (MO_WEAR[k] ? MO_WEAR[k](P) : {});
function moRow(c, items, cx, gy = PX.G, gap = 2) {
  const tot = items.reduce((t, it) => t + it.s.w + (it.gap != null ? it.gap : gap), -gap);
  let x = Math.round(cx - tot / 2); const xs = [];
  for (const it of items) { xs.push(x); c.front.blit(it.s, x, gy - it.s.h + (it.dy || 0), c.P.ol); x += it.s.w + (it.gap != null ? it.gap : gap); }
  moSpan(c, Math.round(cx - tot / 2), Math.round(cx + tot / 2));
  return xs;
}
const moPut = (c, s, x, y, ly) => { (ly || c.front).blit(s, Math.round(x), Math.round(y), c.P.ol); };
function moSpan(c, x0, x1) { if (!c.span) c.span = [x0, x1]; else c.span = [Math.min(c.span[0], x0), Math.max(c.span[1], x1)]; c.span = [Math.max(0, c.span[0]), Math.min(PX.W, c.span[1])]; }
function moFam(c, n, o = {}) {
  const k = c.cast, out = [];
  for (const p of [...k.pt, ...k.kids.slice().sort((a, b) => a.age - b.age), ...(o.noPar ? [] : k.par), ...k.sib, ...k.gk, ...k.inlaw]) if (out.length < n) out.push(p);
  return out;
}
function moSky(c, t = 'd', ly) {
  const r = ly || c.sky, P = c.P;
  if (t === 'night') {
    const top = moRGB(P.dark ? '#0E1526' : '#1E2A4A'), bot = moRGB(P.dark ? '#28304A' : '#4A4E78');
    for (let y = 0; y < PX.H; y++) for (let x = 0; x < PX.W; x++) r.dither(x, y, pxMix(top, bot, Math.min(1, y / PX.G)), 1);
    for (let i = 0; i < 30; i++) r.px(c.R() * PX.W, c.R() * 30, i % 5 ? P.light(moRGB('#C9D3DA'), 0.2) : moRGB('#FFF4CF'));
    return;
  }
  if (t === 'dusk') {
    const cs = ['#6A74A8', '#A88DB6', '#E79A8A', '#F4B98E', '#F8D9A0'].map(moRGB);
    for (let y = 0; y < PX.H; y++) { const v = Math.min(4, y / (PX.G - 4) * 4), b = Math.min(3, Math.floor(v)), f = Math.min(1, v - b), t = Math.max(0, (f - 0.72) / 0.28); for (let x = 0; x < PX.W; x++) r.px(x, y, t > PX_BAYER[(y & 3) * 4 + (x & 3)] ? cs[b + 1] : cs[b]); }
    r.disc(150, 34, 6, moRGB('#FFE7A8')); r.disc(150, 34, 4, moRGB('#FFF5D6'));
    return;
  }
  pxSky(r, Object.assign({}, c.m, { stage: t === 'm' ? 'm' : t === 'e' ? 'e' : 'd', mood: c.m.mood === 'low' ? 'mid' : c.m.mood }), P, c.R);
  const n = 2 + (c.R() * 2 | 0);
  for (let i = 0; i < n; i++) pxCloud(r, 20 + (i + 0.3 + c.R() * 0.4) * (PX.W - 40) / n, 10 + Math.round(c.R() * 10), 14 + Math.round(c.R() * 14), P, c.R, false);
}
function moGrass(c, ly, top = PX.G) {
  const r = ly || c.mid, P = c.P;
  r.rect(0, top, PX.W, PX.H - top, P.grass); r.rect(0, top, PX.W, 1, P.grasshi);
  for (let x = 0; x < PX.W; x++) { if (c.R() < 0.3) r.px(x, top + 1 + c.R() * (PX.H - top - 2), P.grass2); if (c.R() < 0.2) r.px(x, top - 1, P.grass2); }
}
function moPave(c, ly) { const r = ly || c.mid, P = c.P; r.rect(0, PX.G, PX.W, PX.H - PX.G, P.pave); for (let y = PX.G + 3; y < PX.H; y += 4) r.rect(0, y, PX.W, 1, P.pave2); for (let x = 0; x < PX.W; x += 9) r.rect(x + ((x / 9) & 1) * 4, PX.G, 1, PX.H - PX.G, P.pave2); }
function moFar(c, ly) {
  const r = ly || c.back, P = c.P, m = c.m;
  if (m.urban) { let x = -3; while (x < PX.W) { const w = 6 + Math.round(c.R() * 8), h = 8 + Math.round(c.R() * 14); pxBuilding(r, x, w, h, PX.G, P.far1, pxMix(P.far1, P.wall, 0.35), c.R); x += w + 1 + Math.round(c.R() * 4); } return; }
  pxHills(r, P, c.R, 0.04, PX.G - 6, 7, m.region === 'mena' ? pxMix(P.sand, P.far1, 0.4) : P.hill1, null);
  pxHills(r, P, c.R, 0.07, PX.G - 1, 4, m.region === 'mena' ? P.sand : P.hill2, null);
}
function moRoom(c, o = {}) {
  const P = c.P, r = c.mid, G = PX.G, R = c.R;
  const wall = o.wall || (c.m.home === 'hut' || c.m.home === 'tent' ? P.mud : c.m.home === 'flat' ? P.light(P.wall2, 0.25) : P.wall);
  c.sky.rect(0, 0, PX.W, PX.H, wall);
  r.rect(0, 0, PX.W, G, wall);
  for (let y = 2; y < G - 9; y += 1) for (let x = (y % 6 < 3 ? 0 : 3); x < PX.W; x += 6) if ((y % 3) === 0) r.px(x, y, P.shade(wall, 0.05));
  if (!o.plain && c.m.home !== 'hut' && c.m.home !== 'tent') { r.rect(0, G - 9, PX.W, 8, P.shade(wall, 0.08)); r.rect(0, G - 9, PX.W, 1, P.light(wall, 0.3)); }
  r.rect(0, G - 2, PX.W, 2, P.shade(P.trunk, 0.1));
  const fl = o.floor || (c.m.home === 'hut' || c.m.home === 'tent' ? 'mud' : c.m.region === 'eas' && !c.m.urban ? 'mat' : 'wood');
  const F = fl === 'tile' ? P.light(P.pave, 0.2) : fl === 'mud' ? P.soil : fl === 'mat' ? P.light(P.thatch, 0.2) : P.light(P.trunk, 0.25);
  r.rect(0, G, PX.W, PX.H - G, F);
  for (let y = G + 2; y < PX.H; y += 3) r.rect(0, y, PX.W, 1, P.shade(F, 0.12));
  if (fl === 'wood') for (let y = G; y < PX.H; y += 3) for (let x = ((y / 3) & 1) * 11; x < PX.W; x += 22) r.rect(x, y, 1, 2, P.shade(F, 0.12));
  if (fl === 'tile') for (let x = 0; x < PX.W; x += 8) r.rect(x, G, 1, PX.H - G, P.shade(F, 0.1));
  for (const [x, w] of o.win || []) moWindow(c, x, 8, w, 22, o.view || 'd');
  for (const x of o.frames || []) { r.rect(x, 12, 9, 7, P.trunk); r.rect(x + 1, 13, 7, 5, P.light(P.sky.d ? moRGB(P.sky.d[0]) : P.win, 0.2)); r.rect(x + 2, 15, 3, 3, P.tree); r.px(x + 6, 14, P.sun); }
  if (o.lamp != null) { const x = o.lamp; r.rect(x, G - 20, 1, 18, P.metal); r.rect(x - 3, G - 25, 7, 5, P.light(P.gold, 0.35)); r.rect(x - 2, G - 2, 5, 1, P.metal); for (let j = -10; j <= 10; j++) for (let i = -12; i <= 12; i++) if (i * i + j * j * 2 < 140) r.dither(x + i, G - 22 + j, P.light(P.gold, 0.6), 0.12); }
}
function moWindow(c, x, y, w, h, view) {
  const P = c.P, r = c.mid, fr = P.light(P.trunk, P.dark ? 0.1 : 0.3);
  const top = view === 'night' ? moRGB('#26335A') : view === 'dusk' ? moRGB('#E9A27F') : moRGB(P.sky.d[0]), bot = view === 'night' ? moRGB('#4A4E78') : view === 'dusk' ? moRGB('#F7D49B') : moRGB(P.sky.d[1]);
  r.rect(x - 1, y - 1, w + 2, h + 2, fr);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) r.px(x + i, y + j, pxMix(top, bot, j / h));
  if (view === 'night') { r.disc(x + w - 5, y + 4, 2, moRGB('#FFF4CF')); for (let i = 0; i < 4; i++) r.px(x + 2 + c.R() * (w - 4), y + 2 + c.R() * (h / 2), moRGB('#E8ECF2')); }
  else if (view !== 'dusk') { pxCloud(r, x + w * 0.4, y + 9, 8, P, c.R, false); }
  if (c.m.urban) { for (let i = 0; i < w; i += 5) { const bh = 4 + ((i * 7) % 6); r.rect(x + i, y + h - bh, 4, bh, view === 'night' ? moRGB('#2E3550') : P.far1); if (view === 'night') r.px(x + i + 1, y + h - bh + 2, P.winlit); } }
  else for (let i = 0; i < w; i++) { const hh = 3 + Math.round(2 * Math.sin((x + i) * 0.3)); r.rect(x + i, y + h - hh, 1, hh, view === 'night' ? moRGB('#2A3A3A') : P.hill2); }
  r.rect(x + (w >> 1), y, 1, h, fr); r.rect(x, y + (h >> 1), w, 1, fr);
  r.rect(x - 1, y + h + 1, w + 2, 1, P.light(fr, 0.2));
  const cur = view === 'night' ? P.shade(P.accent, 0.2) : P.light(P.accent, 0.5);
  r.rect(x - 3, y - 2, 3, h + 4, cur); r.rect(x + w, y - 2, 3, h + 4, cur);
  r.rect(x - 3, y - 2, 1, h + 4, P.shade(cur, 0.12)); r.rect(x + w + 2, y - 2, 1, h + 4, P.shade(cur, 0.12));
}
function moTable(c, x, w, y, o = {}) {
  const P = c.P, r = o.ly || c.front, top = o.cloth ? moWhite(P) : P.light(P.trunk, 0.15);
  r.rect(x, y, w, 2, top); r.rect(x, y + 2, w, 1, P.shade(top, 0.2));
  if (o.cloth) { r.rect(x, y + 3, w, 3, top); for (let i = 0; i < w; i += 3) r.px(x + i, y + 5, P.shade(top, 0.15)); }
  r.rect(x + 1, y + 3, 1, PX.G - y - 3, P.shade(P.trunk, 0.2)); r.rect(x + w - 2, y + 3, 1, PX.G - y - 3, P.shade(P.trunk, 0.2));
}
function moCake(c, x, y, n = 5) {
  const P = c.P, r = c.front, W = P.light(P.wall, 0.8), Pk = P.light(P.accent, 0.5);
  r.rect(x, y - 4, 9, 4, W); r.rect(x, y - 5, 9, 1, Pk); r.px(x + 2, y - 3, P.accent); r.px(x + 6, y - 2, P.accent); r.rect(x, y - 1, 9, 1, P.shade(W, 0.12));
  for (let i = 0; i < Math.min(4, n); i++) { const cx = x + 1 + i * 2; r.px(cx, y - 6, P.light(P.gold, 0.3)); r.px(cx, y - 7, P.light(P.gold, 0.3)); r.px(cx, y - 8, moRGB('#FFB43A')); r.dither(cx, y - 9, moRGB('#FFF0B0'), 0.6); }
}
function moDishes(c, x, w, y) {
  const P = c.P, r = c.front;
  for (let i = 2; i < w - 3; i += 5) { const col = [P.accent, P.gold, P.tree, P.light(P.wall, 0.8)][(i / 5 | 0) % 4]; r.rect(x + i, y - 2, 4, 2, P.light(P.wall, 0.85)); r.rect(x + i + 1, y - 3, 2, 1, col); if (i % 10 === 2) { r.px(x + i + 1, y - 5, P.light(P.smoke, 0.5)); r.px(x + i + 2, y - 6, P.light(P.smoke, 0.5)); } }
}
function moBunting(c, y, x0 = 0, x1 = PX.W, ly) {
  const r = ly || c.mid, P = c.P, cs = [P.accent, P.gold, P.stamp, P.light(P.accent, 0.4), P.water];
  for (let x = x0; x < x1; x++) { const t = (x - x0) / (x1 - x0), yy = Math.round(y + 4 * Math.sin(t * Math.PI)); r.px(x, yy, P.ol); if ((x - x0) % 6 === 2) { const col = cs[((x - x0) / 6 | 0) % cs.length]; r.rect(x - 1, yy + 1, 3, 1, col); r.px(x, yy + 2, col); } }
}
function moBalloons(c, x, y, n = 3) {
  const P = c.P, r = c.front, cs = [P.accent, P.gold, P.water, P.stamp];
  for (let i = 0; i < n; i++) { const bx = x + i * 4 - (i % 2), by = y - (i % 2) * 3; r.disc(bx, by, 2, cs[i % cs.length]); r.px(bx - 1, by - 1, P.light(cs[i % cs.length], 0.5)); r.line(bx, by + 3, x + 4, y + 12, P.light(P.ol, 0.4)); }
}
function moFlowers(c, x, y, ly, n = 3, col) {
  const r = ly || c.front, P = c.P;
  for (let i = 0; i < n; i++) { const fx = x + i * 2, fy = y - (i % 2); r.line(fx, fy, fx, y + 3, P.tree2); r.px(fx, fy - 1, col || [P.accent, P.gold, P.light(P.wall, 0.8)][i % 3]); }
}
function moBouquet(c, x, y) {
  const r = c.front, P = c.P;
  r.px(x, y + 1, P.tree2); r.px(x, y + 2, P.tree2);
  r.px(x - 1, y - 1, P.light(P.accent, 0.35)); r.px(x, y - 1, P.light(P.wall, 0.85)); r.px(x + 1, y - 1, P.gold); r.px(x, y - 2, P.light(P.accent, 0.35)); r.px(x - 1, y, P.tree); r.px(x + 1, y, P.tree); r.px(x, y, P.accent);
}
function moSuitcase(c, x, y, col) {
  const r = c.front, P = c.P, C = col || P.accent;
  r.rect(x, y - 6, 5, 6, C); r.rect(x, y - 4, 5, 1, P.shade(C, 0.2)); r.rect(x + 1, y - 8, 3, 1, P.ol); r.px(x + 1, y - 7, P.ol); r.px(x + 3, y - 7, P.ol); r.px(x, y, P.ol); r.px(x + 4, y, P.ol);
}
function moTreeBig(c, x, base, kind, ly) { pxTree(ly || c.mid, x, base, kind || pxTreeKind(c.m.region), c.P); }
function moPlane(c, x, y, ly, k = 1) {
  const r = ly || c.sky, P = c.P, W = P.light(P.wall, 0.75);
  if (k === 1) { r.rect(x, y, 9, 1, W); r.rect(x + 3, y - 1, 2, 1, W); r.rect(x + 4, y + 1, 3, 1, W); r.px(x, y - 1, W); return; }
  r.rect(x, y, 22, 3, W); r.rect(x + 1, y + 3, 20, 1, P.shade(W, 0.15)); r.rect(x + 22, y + 1, 2, 1, W);
  for (let i = 3; i < 19; i += 2) r.px(x + i, y + 1, P.win); r.rect(x - 1, y - 4, 3, 4, P.accent); r.rect(x + 8, y + 3, 8, 2, P.shade(W, 0.2)); r.rect(x + 10, y - 2, 5, 2, P.shade(W, 0.1));
}
function fxConfetti(c, n = 26, y1 = PX.G - 2) { const cs = [c.P.accent, c.P.gold, c.P.stamp, c.P.water, c.P.light(c.P.accent, 0.4)]; for (let i = 0; i < n; i++) { const x = c.R() * PX.W, y = 2 + c.R() * (y1 - 2), col = cs[i % cs.length]; c.front.px(x, y, col); if (i % 3 === 0) c.front.px(x + 1, y, col); } }
function fxPetals(c, n = 20, col) { const P = c.P, cs = col ? [col] : [P.light(P.accent, 0.55), P.light(P.wall, 0.85), P.light(P.accent, 0.7)]; for (let i = 0; i < n; i++) { const x = c.R() * PX.W, y = c.R() * (PX.G - 4); c.front.px(x, y, cs[i % cs.length]); if (i % 4 === 0) c.front.px(x + 1, y + 1, cs[i % cs.length]); } }
function fxRain(c, n = 70) { const col = c.P.light(c.P.win, 0.35); for (let i = 0; i < n; i++) { const x = c.R() * (PX.W + 10), y = c.R() * PX.H; c.front.px(x, y, col); c.front.px(x - 1, y + 1, col); c.front.px(x - 1, y + 2, pxMix(col, c.P.win, 0.5)); } }
function fxSnow(c, n = 45) { const W = c.P.light(c.P.wall, 0.9); for (let i = 0; i < n; i++) c.front.px(c.R() * PX.W, c.R() * PX.H, W); }
function fxSpark(c, x, y, n = 4) { const G = c.P.light(c.P.gold, 0.4); for (let i = 0; i < n; i++) { const sx = x + (c.R() - 0.5) * 30, sy = y + (c.R() - 0.5) * 14; c.front.px(sx, sy, G); c.front.px(sx - 1, sy, G); c.front.px(sx + 1, sy, G); c.front.px(sx, sy - 1, G); c.front.px(sx, sy + 1, G); } }
function fxHeart(c, x, y, col) { const H = col || c.P.light(c.P.accent, 0.2); const s = pxSprite(['HH.HH', 'HHHHH', '.HHH.', '..H..'], { H }); c.front.blit(s, x, y, null); c.front.px(x + 1, y, c.P.light(H, 0.5)); }
function fxNote(c, x, y) { const r = c.front, K = c.P.ol; r.rect(x + 2, y, 1, 4, K); r.px(x + 3, y, K); r.px(x + 4, y + 1, K); r.rect(x, y + 3, 2, 2, K); }
function fxLanterns(c, y, x0 = 0, x1 = PX.W, ly) {
  const r = ly || c.mid, P = c.P;
  for (let x = x0; x < x1; x++) { const t = (x - x0) / Math.max(1, x1 - x0), yy = Math.round(y + 5 * Math.sin(t * Math.PI)); r.px(x, yy, P.ol); if ((x - x0) % 9 === 4) { const col = [moRGB('#F2A23A'), moRGB('#E85A4F'), moRGB('#F6D365')][((x - x0) / 9 | 0) % 3]; r.rect(x - 1, yy + 1, 3, 4, col); r.px(x, yy + 2, P.light(col, 0.5)); for (let j = -3; j <= 6; j++) for (let i = -4; i <= 4; i++) if (i * i + j * j < 18) r.dither(x + i, yy + 2 + j, P.light(col, 0.4), 0.15); } }
}
function fxRays(c, x, y) { const r = c.sky, G = c.P.light(c.P.sun, 0.5); for (let k = 0; k < 9; k++) { const a = -Math.PI * (0.1 + k * 0.1); for (let t = 8; t < 60; t++) if ((t + k) % 3) r.dither(Math.round(x + Math.cos(a) * t), Math.round(y + Math.sin(a) * t), G, 0.35); } }
function fxStars(c, n = 40, ly) { const r = ly || c.sky; for (let i = 0; i < n; i++) { const x = c.R() * PX.W, y = c.R() * 36; r.px(x, y, moRGB(i % 6 ? '#E2E8F0' : '#FFF4CF')); if (i % 9 === 0) { r.px(x - 1, y, moRGB('#9AA6C0')); r.px(x + 1, y, moRGB('#9AA6C0')); } } }
const MO_CX = 96;
function moAround(me, others) { const L = [], Rr = []; others.forEach((p, i) => (i % 2 ? L : Rr).push(p)); return [...L.reverse(), me, ...Rr]; }
function moAtTable(c, items, cx, tt, o = {}) {
  const xs = moRow(c, items, cx, PX.G - 3, o.gap != null ? o.gap : 3);
  const w = Math.max(30, (c.span[1] - c.span[0]) + 10), x = Math.round(cx - w / 2);
  moTable(c, x, w, tt, { cloth: o.cloth !== false });
  return { xs, x, w };
}
function moBed(c, x, w, top, who, o = {}) {
  const P = c.P, r = c.front, frame = o.hosp ? P.light(P.metal, 0.35) : P.shade(P.trunk, 0.05), W = moWhite(P), bl = o.blanket || (o.hosp ? P.light(P.water, 0.55) : P.light(P.accent, 0.45));
  r.rect(x, top - 12, 2, PX.G - top + 12, frame); r.rect(x + w - 2, top - 5, 2, PX.G - top + 5, frame);
  r.rect(x + 2, top, w - 4, 3, W);
  if (o.hosp) { r.rect(x + 2, top + 3, w - 4, 1, frame); for (const lx of [x + 4, x + w - 6]) { r.rect(lx, top + 4, 1, PX.G - top - 5, frame); r.px(lx - 1, PX.G - 1, P.ol); r.px(lx + 1, PX.G - 1, P.ol); } }
  else { r.rect(x + 2, top + 3, w - 4, 3, frame); r.rect(x + 2, top + 6, 2, PX.G - top - 6, frame); r.rect(x + w - 4, top + 6, 2, PX.G - top - 6, frame); }
  r.rect(x + 2, top - 4, 8, 4, W); r.rect(x + 2, top - 1, 8, 1, P.shade(W, 0.1));
  if (who) {
    const hr = who.hand ? who.hand[1] : who.h - 5, cut = new PxR(who.w, hr + 1);
    for (let j = 0; j <= hr; j++) for (let i = 0; i < who.w; i++) cut.d[j * who.w + i] = who.get(i, j);
    moPut(c, cut, x + 4, top - 1 - hr); moSpan(c, x + 2, x + w);
  }
  r.rect(x + 3, top - 1, w - 5, 4, bl); r.rect(x + 3, top - 1, w - 5, 1, P.light(bl, 0.3)); r.rect(x + 3, top + 2, w - 5, 1, P.shade(bl, 0.15));
  if (o.hosp) { r.rect(x + w + 3, top - 22, 1, PX.G - top + 22, P.metal); r.rect(x + w + 1, top - 22, 5, 1, P.metal); r.rect(x + w + 2, top - 21, 3, 5, P.light(P.water2 || P.win, 0.4)); r.line(x + w + 3, top - 16, x + w - 6, top - 2, P.light(P.metal, 0.3)); }
}
function moVase(c, x, y, ly) { const r = ly || c.front, P = c.P; r.rect(x, y, 8, 1, P.light(P.trunk, 0.1)); r.rect(x + 1, y + 1, 1, PX.G - y - 1, P.trunk); r.rect(x + 6, y + 1, 1, PX.G - y - 1, P.trunk); r.rect(x + 3, y - 3, 2, 3, P.light(P.water, 0.4)); moFlowers(c, x + 2, y - 5, r, 3); }
const moSome = (c, role, sex, age, o) => ({ p: moGen(c, role, sex, age), s: moFig(moGen(c, role, sex, age), c.P, o || {}) });
const MO_WORK = { clerk: 'office', callc: 'office', finance: 'office', dev: 'office', lawyer: 'office', engineer: 'office', civil: 'office', social: 'office', salesagent: 'office', designer: 'studio',
  teacher: 'class', prof: 'class', childcare: 'class', boardpro: 'class', progamer: 'office', doctor: 'clinic', nurse: 'clinic', healthtech: 'clinic', care: 'clinic',
  farm: 'field', farmhand: 'field', agbiz: 'field', herder: 'herd', fisher: 'sea', vendor: 'market', shop: 'market', owner: 'market', artisan: 'market', hair: 'market', mechanic: 'market',
  construct: 'site', miner: 'site', welder: 'site', electric: 'site', factory: 'factory', garment: 'factory', warehouse: 'factory', driver: 'road', delivery: 'road', cook: 'kitchen',
  artist: 'studio', creator: 'studio', streamer: 'studio', musician: 'stage', idol: 'stage', actor: 'stage', athlete: 'sport', coach: 'sport', trainer: 'sport', clergy: 'church',
  ai_eng: 'office', cyber: 'office', trader: 'office', ecom: 'office', logistics: 'factory', green_tech: 'site', biotech: 'clinic', gig_rider: 'road', env_spec: 'field',
  soldier: 'base', police: 'base', service: 'base', guard: 'base', domestic: 'house', cleaner: 'house', homemaker: 'house', childwork: 'house', shelter: 'factory', pilot: 'sky', cabin: 'sky', astro: 'space', mp: 'hall', leader: 'hall' };
function moWorker(c, o, x, y) {
  const sub = c.a[1] || '', ret = sub === 'ret', s = moFig(c.cast.me, c.P, Object.assign({}, o, sub === 'rank' ? { pose: 'up' } : {}));
  const X = x != null ? x : MO_CX - (s.w >> 1), Y = y != null ? y : PX.G - s.h + 1;
  moPut(c, s, X, Y); moSpan(c, X - 2, X + s.w + 2);
  if (ret) moBouquet(c, X + s.w, Y + s.hand[1] - 1);
  return { s, x: X, y: Y };
}
const MO_W = {};
function moTripWho(c, who) {
  const k = c.cast, me = k.me;
  if (who === 'pt' && k.pt.length) return [k.pt[0]];
  if (who === 'fam') return [...k.pt, ...k.kids.filter(p => p.age < 18).slice(0, 3)];
  if (who === 'fr') return [moGen(c, 'sib', null, me.age + 1), moGen(c, 'inlaw', null, me.age - 1)];
  if (who === 'par') return k.par.length ? k.par.slice(0, 2) : [moGen(c, 'par', 'F', me.age + 28), moGen(c, 'par', 'M', me.age + 30)];
  return [];
}
const MO_T = {};
const HOME = { lineMax: 40 };
const ROOM_SLOTS = {
  A: { x: 4, w: 56, sz: ['big', 'small', 'tall'] },
  B: { x: 64, w: 30, sz: ['small'] },
  C: { x: 132, w: 28, sz: ['small'] },
  D: { x: 162, w: 28, sz: ['small', 'tall'] },
  R: { x: 86, w: 72, sz: ['rug'] },
  W1: { x: 70, w: 30, sz: ['wall'] }, W2: { x: 112, w: 30, sz: ['wall'] }, W3: { x: 156, w: 30, sz: ['wall'] },
};
const SLOT_IDS = Object.keys(ROOM_SLOTS);
const HOME_ITEMS = {
  wp_cream: ['wp', ''], wp_sky: ['wp', ''], wp_stripe: ['wp', ''], wp_dots: ['wp', ''], wp_check: ['wp', ''], wp_tile: ['wp', ''],
  wp_flower: ['wp', ''], wp_wood: ['wp', ''], wp_brick: ['wp', ''], wp_hanji: ['wp', ''], wp_star: ['wp', ''],
  fl_wood: ['fl', ''], fl_jangpan: ['fl', ''], fl_tatami: ['fl', ''], fl_tile: ['fl', ''], fl_carpet: ['fl', ''], fl_marble: ['fl', ''],
  wv_home: ['wv', ''], wv_city: ['wv', ''], wv_hills: ['wv', ''], wv_rain: ['wv', ''], wv_night: ['wv', ''], wv_sea: ['wv', ''],
  wv_snow: ['wv', ''], wv_bloom: ['wv', ''], wv_stars: ['wv', ''],
  wv_summer: ['wv', ''], wv_maple: ['wv', ''], wv_dusk: ['wv', ''], wv_moon: ['wv', ''], wv_firefly: ['wv', ''], wv_snownight: ['wv', ''],
  ot_me: ['ot', ''], ot_navy: ['ot', ''], ot_red: ['ot', ''], ot_yellow: ['ot', ''], ot_white: ['ot', ''], ot_pink: ['ot', ''], ot_green: ['ot', ''], ot_black: ['ot', ''],
  bgm_base: ['bgm', ''], bgm_box: ['bgm', ''], bgm_waltz: ['bgm', ''], bgm_rain: ['bgm', ''], bgm_night: ['bgm', ''], bgm_spring: ['bgm', ''],
  table: ['it', 'big'], chair: ['it', 'small'], plant: ['it', 'small'], clock: ['it', 'wall'],
  bed: ['it', 'big'], sofa: ['it', 'big'], desk: ['it', 'big'], piano: ['it', 'big'], tv: ['it', 'big'], bike: ['it', 'big'],
  shelf: ['it', 'tall'], wardrobe: ['it', 'tall'], gclock: ['it', 'tall'], lamp: ['it', 'tall'], xmas: ['it', 'tall'],
  radio: ['it', 'small'], tank: ['it', 'small'], bear: ['it', 'small'], globe: ['it', 'small'], record: ['it', 'small'], cake: ['it', 'small'], bigplant: ['it', 'small'],
  wshelf: ['it', 'wall'], poster: ['it', 'wall'], mirror: ['it', 'wall'], paint: ['it', 'wall'], lights: ['it', 'wall'], calendar: ['it', 'wall'],
  rug_round: ['it', 'rug'], rug_stripe: ['it', 'rug'], rug_persian: ['it', 'rug'],
  photos: ['it', 'wall'],
  e_lamp: ['it', 'small'], e_gramo: ['it', 'small'], e_sew: ['it', 'small'], e_type: ['it', 'small'], e_dial: ['it', 'small'], e_najeon: ['it', 'tall'],
  e_yeontan: ['it', 'small'], e_fan: ['it', 'small'], e_cassette: ['it', 'small'], e_crt: ['it', 'small'], e_pc: ['it', 'big'], e_aircon: ['it', 'tall'],
  e_flatv: ['it', 'wall'], e_purifier: ['it', 'small'],
  l_dog: ['it', 'small', 1], l_cat: ['it', 'small', 1], l_guitar: ['it', 'small', 1], l_easel: ['it', 'tall', 1], l_medal: ['it', 'wall', 1],
  l_diploma: ['it', 'wall', 1], l_wed: ['it', 'wall', 1], l_fam: ['it', 'wall', 1], l_map: ['it', 'wall', 1], l_rocket: ['it', 'small', 1],
  l_flag: ['it', 'small', 1], l_books: ['it', 'small', 1], l_basket: ['it', 'small', 1], l_rod: ['it', 'tall', 1], l_tools: ['it', 'small', 1],
  l_kit: ['it', 'small', 1], l_pot: ['it', 'small', 1], l_laptop: ['it', 'small', 1], l_camera: ['it', 'small', 1], l_ball: ['it', 'small', 1], l_yarn: ['it', 'small', 1],
};
const itemOf = id => Object.prototype.hasOwnProperty.call(HOME_ITEMS, id) ? HOME_ITEMS[id] : null;
const isLifeItem = id => { const t = itemOf(id); return !!(t && t[2] === 1); };
function haveItem(id, li, own) {
  const t = itemOf(id); if (!t) return false;
  return t[2] === 1 ? (li || []).includes(id) : t[2] === 2 ? !!(own && own.has(id)) : true;
}
const LIFE_ORDER = ['l_dog', 'l_cat', 'l_medal', 'l_rocket', 'l_guitar', 'l_easel', 'l_flag', 'l_wed', 'l_fam', 'l_diploma', 'l_map', 'l_books', 'l_basket', 'l_rod', 'l_tools', 'l_kit', 'l_pot', 'l_laptop', 'l_camera', 'l_ball', 'l_yarn'];
const PROP_LI = { mic: 'l_guitar', easel: 'l_easel', rocket: 'l_rocket', dome: 'l_flag', crops: 'l_basket', boat: 'l_rod', crane: 'l_tools', clinic: 'l_kit', office: 'l_laptop' };
function liOf(d) {
  if (!d || typeof d !== 'object') return [];
  if (Array.isArray(d.li)) return [...new Set(d.li.filter(isLifeItem))];
  const out = new Set();
  for (const f of Array.isArray(d.frames) ? d.frames : []) {
    const m = f && f.m; if (!m) continue;
    if (Array.isArray(m.people)) { if (m.people.some(p => p && p.role === 'pt')) out.add('l_wed'); if (m.people.some(p => p && p.role === 'kid')) out.add('l_fam'); }
    if (m.pet === 'd') out.add('l_dog'); else if (m.pet === 'c') out.add('l_cat');
    if (f.a >= 18 && PROP_LI[m.prop]) out.add(PROP_LI[m.prop]);
    if (f.a >= 25 && m.prop === 'school') out.add('l_books');
  }
  return [...out];
}
function roomDefault(li) {
  const it = { A: 'table', B: 'chair', C: '', D: 'plant', R: '', W1: '', W2: 'clock', W3: '' };
  const fill = { small: ['C', 'D', 'B'], tall: ['D'], wall: ['W1', 'W3', 'W2'] };
  const ls = LIFE_ORDER.filter(id => (li || []).includes(id));
  for (const pass of [0, 1]) for (const id of ls) {
    if (Object.values(it).includes(id)) continue;
    const s = (fill[HOME_ITEMS[id][1]] || []).find(k => pass ? it[k] && !isLifeItem(it[k]) : !it[k]);
    if (s) it[s] = id;
  }
  return { wp: 'wp_cream', fl: 'fl_wood', wv: 'wv_home', ot: 'ot_me', bgm: 'bgm_base', who: 'me', it };
}
function cleanRoom(o, li, own) {
  o = o && typeof o === 'object' ? o : {};
  const have = id => haveItem(id, li, own);
  const pick = (k, v, d) => { const t = itemOf(v); return t && t[0] === k && have(v) ? v : d; };
  const r = { wp: pick('wp', o.wp, 'wp_cream'), fl: pick('fl', o.fl, 'fl_wood'), wv: pick('wv', o.wv, 'wv_home'), ot: pick('ot', o.ot, 'ot_me'),
    bgm: pick('bgm', o.bgm, 'bgm_base'), who: o.who === 'fam' ? 'fam' : 'me', it: {} };
  const src = o.it && typeof o.it === 'object' ? o.it : {}, used = new Set();
  for (const s of SLOT_IDS) {
    const v = String(src[s] || ''), t = itemOf(v);
    r.it[s] = t && t[0] === 'it' && ROOM_SLOTS[s].sz.includes(t[1]) && have(v) && !used.has(v) ? v : '';
    if (r.it[s]) used.add(r.it[s]);
  }
  return r;
}
function photoMoms(d, hide) {
  const out = new Set(hide || []), fr = (d && Array.isArray(d.frames) ? d.frames : []).filter((f, i) => f && f.m && typeof f.m === 'object' && !out.has(i));
  if (fr.length <= 3) return fr.map(f => f.m);
  const h = f => d.strip && d.strip[f.a] != null ? d.strip[f.a] : 50, n = fr.length;
  return [0, 1, 2].map(k => fr.slice(Math.round(k * n / 3), Math.round((k + 1) * n / 3)).reduce((b, f) => h(f) > h(b) ? f : b).m);
}
const roomOf = (s, li) => { try { const o = typeof s === 'string' ? (s ? JSON.parse(s) : null) : s; return o && typeof o === 'object' && o.it ? o : roomDefault(li); } catch (e) { return roomDefault(li); } };
const RPAL = {
  ol: '#3B4046', wood: '#C29466', wood2: '#A27650', wood3: '#7C5A3D', woodhi: '#D9B488', white: '#F5F2EA', white2: '#DCD7CB', grey: '#A9B0B4', grey2: '#7F888D',
  red: '#C8555B', red2: '#9E3E45', blue: '#6A8FB8', blue2: '#4E7099', green: '#6FA766', green2: '#4E8550', greenhi: '#9DCD80', yellow: '#E9C25B', yellow2: '#C99B34',
  pink: '#EBA6B9', pink2: '#C97C93', cream: '#F1E4C8', cream2: '#D9C7A4', gold: '#E2AE45', gold2: '#B88628', glass: '#A9DCE8', glass2: '#7FB9CB', dark: '#4A5056',
  black: '#2E3236', brown: '#8A6142', teal: '#2C8C82', teal2: '#1F6D65', navy: '#3E4E72', navy2: '#2C3953', orange: '#E28B45', orange2: '#BD6A2C', purple: '#9C83C4',
  paper: '#FBF8EF', paper2: '#E6E0D0', skin: '#E2B48E', skin2: '#C8946E', blush: '#EE9E9A', hair: '#3F3530', hair2: '#2C2522', hairold: '#DDDAD3', hairold2: '#B9B5AD',
};
const RC = {};
const rdark = (c, k) => pxMix(c, RC.ol, k);
const OUTFITS = { ot_me: ['#2E9C90', '#3F4A57'], ot_navy: ['#3E4E72', '#2C3442'], ot_red: ['#C8555B', '#4A4F5C'], ot_yellow: ['#E9C25B', '#56606B'],
  ot_white: ['#F3F0E8', '#5B6470'], ot_pink: ['#EBA6B9', '#5A5F6E'], ot_green: ['#6FA766', '#4C5560'], ot_black: ['#3A3E44', '#2A2D31'] };
let RPX = null;
const roomPal = () => RPX || (RPX = pxPalette('light'));
const chibi = (p, ot) => pxPerson(p, roomPal(), p.role === 'me' ? (OUTFITS[ot] || OUTFITS.ot_me).map(pxRGB) : null);
const BGM_MEL = { bgm_box: [[76, 79, 84, 79, 77, 81, 84, 81], [76, 79, 83, 79, 74, 77, 81, 77], [72, 76, 79, 76, 71, 74, 79, 74], [72, 76, 79, 84, 79, 76, 72, 0]] };
const BGM_CH = { major: [[48, 52, 55, 60], [45, 48, 52, 57], [41, 45, 48, 53], [43, 47, 50, 55]], minor: [[45, 48, 52, 57], [41, 45, 48, 53], [48, 52, 55, 60], [43, 47, 50, 55]],
  night: [[50, 53, 57, 60], [46, 50, 53, 57], [43, 46, 50, 53], [45, 48, 52, 55]], spring: [[50, 54, 57, 62], [55, 59, 62, 66], [52, 55, 59, 62], [57, 61, 64, 67]] };
function bgmStep(style, t, st) {
  if (typeof musicNote !== 'function') return false;
  const pick1 = a => a[Math.floor(Math.random() * a.length)];
  switch (style) {
    case 'bgm_box': {
      BGM_MEL.bgm_box[st % 4].forEach((n, i) => { if (n) musicNote(n + 12, t + i * 0.5, 1.4, 0.045, 'triangle', 0.005); });
      if (st % 2 === 0) musicNote([48, 45, 41, 43][(st / 2 | 0) % 4], t, 3.6, 0.04, 'sine', 0.05, 0.5);
      return true;
    }
    case 'bgm_waltz': {
      for (let bar = 0; bar < 2; bar++) {
        const ch = BGM_CH.major[(st * 2 + bar) % 4], t0 = t + bar * 2;
        musicNote(ch[0] - 12, t0, 1.8, 0.06, 'sine', 0.02, 0.5);
        for (const b of [1, 2]) ch.slice(1).forEach(n => musicNote(n, t0 + b * 0.667, 0.5, 0.022, 'triangle', 0.01));
        musicNote(pick1(ch) + 12, t0, 1.9, 0.03, 'sine', 0.04);
      }
      return true;
    }
    case 'bgm_rain': {
      if (st % 2 === 0) BGM_CH.minor[(st / 2 | 0) % 4].forEach((n, i) => musicNote(n - 12 + (i ? 12 : 0), t + i * 0.12, 8.5, i ? 0.026 : 0.045, 'sine', 1.6, i ? 0.45 : 0.6));
      const k = 4 + Math.floor(Math.random() * 4); for (let i = 0; i < k; i++) musicNote(pick1([81, 84, 86, 88, 91, 93]), t + Math.random() * 3.8, 0.28, 0.018, 'sine', 0.003);
      if (Math.random() < 0.5) musicNote(pick1([69, 72, 74, 76]), t + 1 + Math.random() * 2, 2.6, 0.035, 'triangle', 0.02);
      return true;
    }
    case 'bgm_night': {
      if (st % 2 === 0) BGM_CH.night[(st / 2 | 0) % 4].forEach((n, i) => musicNote(n - 12, t + i * 0.3, 10, i ? 0.024 : 0.04, 'sine', 3, i ? 0.45 : 0.6));
      if (Math.random() < 0.45) musicNote(pick1([74, 77, 79, 81, 84]), t + Math.random() * 3, 4, 0.03, 'sine', 0.4);
      return true;
    }
    case 'bgm_spring': {
      if (st % 2 === 0) BGM_CH.spring[(st / 2 | 0) % 4].forEach((n, i) => musicNote(n - 12 + (i ? 12 : 0), t + i * 0.06, 7.5, i ? 0.028 : 0.045, 'sine', 1, i ? 0.45 : 0.6));
      const base = pick1([74, 76, 78, 81]); [0, 2, 4].forEach((d, i) => { if (Math.random() < 0.8) musicNote(base + d, t + 0.5 + i * 0.6 + Math.random() * 0.2, 1.8, 0.035, 'triangle', 0.01); });
      return true;
    }
  }
  return false;
}
function pxURL(r, x0, y0, w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d'), img = ctx.createImageData(w, h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const v = r.get(x0 + i, y0 + j), o = (j * w + i) * 4; if (v) { img.data[o] = v[0]; img.data[o + 1] = v[1]; img.data[o + 2] = v[2]; img.data[o + 3] = 255; } }
  ctx.putImageData(img, 0, 0); return { url: c.toDataURL(), w, h };
}
const SHELF_OT = ['ot_red', 'ot_yellow', 'ot_pink', 'ot_green', 'ot_navy', 'ot_me', 'ot_white'];
const SH = { mem: {}, at: 0, pick: null, img: {}, busy: false };
function shelfPetOf(St) {
  const n = {}; for (const y of (St && St.years) || []) { const k = y && typeof y.sc === 'string' ? y.sc.split('|')[7] : ''; if (k && PX_PET[k]) n[k] = (n[k] || 0) + 1; }
  let b = '', m = 0; for (const k in n) if (n[k] > m) { m = n[k]; b = k; }
  return b || undefined;
}
const shelfLives = () => (lsGet(LIVES_KEY, []) || []).filter(l => l && l.at && (!EDU_ON || l.edu));
const shelfHard = l => l.age < 18 || l.cause === "Đã qua đời";
const shelfSnaps = () => new Set((lsGet(PAST_KEY, []) || []).map(p => p.at).concat(pdbOn() ? [...PDB.ats] : []));
function shelfFig(f) {
  const P = roomPal(), sk = Number.isInteger(f.sk) && f.sk >= 0 && f.sk <= 5 ? f.sk : skinPick(skinW(f.iso, null), f.seed);
  const ot = f.ot && OUTFITS[f.ot] ? f.ot : SHELF_OT[Math.floor(skinU(f.seed + 'ot') * SHELF_OT.length)];
  const me = chibi({ role: 'me', sex: f.sex === 'F' ? 'F' : 'M', age: Math.max(0, Math.min(125, +f.age || 0)), sk }, ot);
  const pet = f.pet && PX_PET[f.pet] ? pxPet(f.pet, P) : null;
  const r = new PxR(me.w + (pet ? pet.w + 2 : 0) + 2, Math.max(me.h, pet ? pet.h : 0) + 2);
  r.blit(me, 1, r.h - 1 - me.h, P.ol);
  if (pet) r.blit(pet, me.w + 3, r.h - 1 - pet.h, P.ol);
  return r;
}
function lifeFig(l) {
  const m = SH.mem[String(l.at)];
  return { sex: l.sex, age: l.age, sk: l.sk, iso: l.iso, seed: (l.name || '') + l.iso, ot: m && m.ot, pet: l.pt || (m && m.pet) };
}
function shelfImg(f) {
  const k = JSON.stringify(f); if (SH.img[k]) return SH.img[k];
  const r = shelfFig(f); return (SH.img[k] = pxURL(r, 0, 0, r.w, r.h));
}
function shelfStrip(lives) {
  if (!lives.length || UI.pastEdit) return '';
  const few = lives.slice(-8);
  return `<button type="button" class="pl-shelf" id="pastShelf"><span class="pl-shelf-row">${few.map(l => { const u = shelfImg(lifeFig(l)); return `<img src="${u.url}" width="${u.w * 3}" height="${u.h * 3}" alt="">`; }).join('')}</span><span class="pl-shelf-go">${"Xem kệ những kiếp trước của tôi"}</span></button>` + wishEntry('intro');
}
const WISH_NEED = 3, WISH_MAX = 60, WISH_AX = ['pw', 'rf', 'cv', 'tm'];
const WS = { recs: [], qs: [], pool: {}, ans: [], step: 'intro', from: '', busy: false, res: null, pic: null, picBusy: false };
const WISH_WORD = () => ({ p: "Bên nhau", w: "Công việc", r: "Cội rễ", f: "Gió", c: "Lặng yên", v: "Sóng", t: "Hôm nay", m: "Ngày mai" });
const WISH_LINE = () => ({ p: "Lòng bạn hướng về thời gian ở bên mọi người.", w: "Lòng bạn hướng về công việc tự tay làm nên.", r: "Lòng bạn hướng về một cuộc đời bén rễ ở một nơi.",
  f: "Lòng bạn hướng về một cuộc đời đi đến những nơi xa.", c: "Lòng bạn hướng về những ngày bình lặng kéo dài.", v: "Lòng bạn hướng về những ngày thường đổi thay và bắt đầu lại.",
  t: "Lòng bạn hướng về thời gian tận hưởng hiện tại.", m: "Lòng bạn hướng về thời gian vun đắp cho tương lai." });
const WISH_NAME = () => ({ prct: "Người hàng xóm bên hiên nhà", prcm: "Cây cổ thụ rễ sâu", prvt: "Người mở tiệc", prvm: "Người vun đắp làng quê",
  pfct: "Người dọn mâm cơm ở bất cứ đâu", pfcm: "Người đi xa vì gia đình", pfvt: "Người bạn trên đường", pfvm: "Người bắc cầu",
  wrct: "Người thợ một nghề", wrcm: "Người gieo hạt", wrvt: "Người khởi đầu việc mới", wrvm: "Người dựng lại quê hương",
  wfct: "Người làm tròn phần mình ở bất cứ đâu", wfcm: "Người gây dựng cơ nghiệp nơi xa", wfvt: "Người cưỡi gió", wfvm: "Người mở đường mới" });
const WISH_ASK = () => ({
  pw: [["Buổi tối quây quần bên mâm cơm gia đình", "Công việc say mê làm xong đến khuya"], ["Một ngày ở bên người bạn đang khó khăn", "Một ngày làm xong việc đã chuẩn bị từ lâu"], ["Cuối tuần bên con", "Ngày công việc được ghi nhận"]],
  rf: [["Cuộc đời sống lâu ở nơi mình sinh ra", "Cuộc đời thử sống cả ở một đất nước xa"], ["Cuộc đời luôn có bạn thời thơ ấu ở gần", "Cuộc đời kết bạn mới ở những nơi xa lạ"], ["Cuộc đời già đi trong một ngôi nhà", "Cuộc đời chuyển qua nhiều thành phố"]],
  cv: [["Những ngày bình yên trôi qua gần như giống nhau", "Những ngày mỗi năm lại bắt đầu điều gì mới"], ["Cuộc đời làm một công việc thật lâu", "Cuộc đời thử nhiều công việc"], ["Đi dạo trên con đường quen", "Con đường lần đầu đi"]],
  tm: [["Một ngày làm điều mình muốn ngay bây giờ", "Một ngày chuẩn bị cho tương lai"], ["Buổi tối say mê sở thích yêu thích", "Buổi tối học điều mới"], ["Ngày nghỉ không làm gì cả", "Ngày nghỉ tích góp từng chút"]] });
const WISH_FOC = { p: ['family', 'faith', 'play', 'help'], w: ['work', 'career', 'parttime'], t: ['hobby', 'rest', 'sport'], m: ['learn', 'study', 'mind'] };
const WISH_WORK_NO = new Set(['bizop', 'bizscale', 'heir', 'mandret', 'vocation']);
const WISH_MONEY = /\$|\s?\d|\d\s*(?:tỷ đồng|triệu đồng|đồng)/;
const wishShuf = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wishOK = (St, l) => !!(St && l && St.deathAt && St.deathAt.age >= 18 && St.deathAt.cause !== 'suic' && !shelfHard(l) && Array.isArray(St.log) && Array.isArray(St.years) && (!EDU_ON || St.eduOn));
const wishCount = () => { const sn = shelfSnaps(); return shelfLives().filter(l => sn.has(l.at) && !shelfHard(l)).length; };
const WISH_SWAP = '<svg class="wsh-sw" viewBox="0 0 16 12" aria-hidden="true"><path d="M1 4h12M10 1l3 3-3 3M15 8H3M6 5 3 8l3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function wishEntry(from) {
  if (from !== 'shelf' && wishCount() < WISH_NEED) return '';
  const sn = shelfSnaps(), two = shelfLives().filter(l => sn.has(l.at) && !shelfHard(l)).slice(-2);
  const fig = l => { const u = shelfImg(Object.assign({}, lifeFig(l), { pet: undefined })); return `<img src="${u.url}" width="${u.w * 3}" height="${u.h * 3}" alt="">`; };
  const figs = two.length === 2 ? `<span class="wsh-in-fig" aria-hidden="true">${fig(two[0])}${WISH_SWAP}${fig(two[1])}</span>` : '';
  return `<button type="button" class="wsh-in" data-wishgo="${from}">${figs}<span class="wsh-in-tx">${UI.prefs.wishSeen ? '' : `<span class="wsh-new">${"Mới"}</span>`}<b>${"Cuộc đời tôi mong muốn"}</b><span class="wsh-in-d">${"Đặt các khoảnh khắc của những cuộc đời đã sống cạnh nhau và tìm cuộc đời bạn mong muốn."}</span></span><span class="wsh-in-go" aria-hidden="true">›</span></button>`;
}
async function wishRecs() {
  const rows = new Map(shelfLives().map(l => [l.at, l])), got = new Map();
  for (const p of lsGet(PAST_KEY, []) || []) if (p && rows.has(p.at) && wishOK(p.S, rows.get(p.at))) got.set(p.at, p.S);
  if (pdbOn()) {
    const want = [...PDB.ats].filter(at => rows.has(at) && !got.has(at)).sort((a, b) => b - a).slice(0, WISH_MAX);
    const rs = await Promise.all(want.map(at => pdbGet(at).catch(() => null)));
    for (const q of rs) if (q && q.S && rows.has(q.at) && wishOK(q.S, rows.get(q.at))) got.set(q.at, q.S);
  }
  return [...got.keys()].sort((a, b) => a - b).slice(-WISH_MAX).map(at => ({ at, S: got.get(at), l: rows.get(at) }));
}
function wishMoments(R) {
  const St = R.S, by = {}, F = St.flags || {};
  const forced = !!(F.refEver || St.refugee || (St.adopt && St.adopt.k === 'intl') || St.log.some(e => e && e.act === 'flee'));
  const add = (pole, a, text) => { if ((pole === 'f' && forced) || !text || text.length > 110 || WISH_MONEY.test(text)) return; (by[pole] = by[pole] || []).push({ at: R.at, pole, a, text }); };
  const debt = "Bạn đã trả hết mọi khoản nợ!", noRetake = "Bạn quyết định không thi lại mà đi tìm việc.";
  let jobs = 0;
  for (const e of St.log) {
    if (!e || !e.act || !(e.a >= 18) || (e.kind !== 'big' && e.kind !== 'warm') || typeof e.text !== 'string') continue;
    const k = e.act, big = e.kind === 'big';
    if (/^work:[^:]+$/.test(k)) {
      if (!big || WISH_WORK_NO.has(e.d)) continue;
      add('w', e.a, e.text);
      if (e.d === 'jobchange' || e.d === 'farmback' || (e.d === 'job' && jobs)) add('v', e.a, e.text);
      if (e.d === 'job' || e.d === 'jobchange') jobs++;
      continue;
    }
    if (k === 'shop') { if (big) add('w', e.a, e.text); continue; }
    if (/^fly(:|$)/.test(k)) { if (big) add('f', e.a, (e.text.match(/[^.!?。！？]+[.!?。！？]*/g) || []).slice(0, 2).join('').trim()); continue; }
    if (k === 'study' && e.text === noRetake) continue;
    const pole = /^(baby|bed|cake|anniv|walk:pt)$/.test(k) || /^grand(:|$)/.test(k) || (k === 'friends' && !big) ? 'p'
      : /^work:[^:]+:rank$/.test(k) && big ? 'w'
      : k === 'fest' ? 'r'
      : k === 'citizen' || /^trip(:|$)/.test(k) ? 'f'
      : k === 'photos' ? (big ? 't' : 'c')
      : k === 'garden' || /^work:[^:]+:ret$/.test(k) ? 'c'
      : /^hobby(:|$)/.test(k) || (k === 'walk' && !big) ? 't'
      : (k === 'pass' && e.text !== debt) || /^grad(:|$)/.test(k) || (k === 'study' && big) ? 'm' : '';
    if (pole) add(pole, e.a, e.text);
  }
  const fY = (St.stats && St.stats.fY) || {}, yrs = ks => Math.round(ks.reduce((t, k) => t + (+fY[k] || 0), 0));
  const n = { p: yrs(WISH_FOC.p), w: yrs(WISH_FOC.w), t: yrs(WISH_FOC.t), m: yrs(WISH_FOC.m) };
  if (n.p >= 10) add('p', null, L`어른이 되어 ${n.p}년을 가족과 친구에게 썼습니다.`);
  if (n.w >= 10) add('w', null, L`어른이 되어 ${n.w}년을 일에 몰두했습니다.`);
  if (n.t >= 10) add('t', null, L`어른이 되어 ${n.t}년을 취미와 쉼에 썼습니다.`);
  if (n.m >= 10) add('m', null, L`어른이 되어 ${n.m}년을 배우고 익히는 데 썼습니다.`);
  const cs = []; for (const y of St.years) if (y && y.cur && CBY[y.cur] && cs[cs.length - 1] !== y.cur) cs.push(y.cur);
  if (cs.length === 1 && St.deathAt.age >= 40) add('r', null, L`${R.l.ko}에서 나고 자라 평생을 그곳에서 살았습니다.`);
  if (cs.length >= 2) add('f', null, L`${[...new Set(cs)].slice(0, 4).map(i => CBY[i].ko).join(' → ')}에서 살았습니다.`);
  const notJob = new Set(["sinh viên đại học", "học viên cao học", "đang đi học", "nghỉ hưu", "đang tìm việc"]);
  let cur = '', run = 0, best = 0;
  for (const y of St.years) { if (!y) continue; if (y.w != null) { cur = notJob.has(y.w) ? '' : y.w; run = 0; } if (cur && y.a >= 15 && ++run > best) best = run; }
  if (best >= 20) add('c', null, L`한 가지 일을 ${best}년 동안 했습니다.`);
  const jn = (St.stats && St.stats.jobs) || 0; if (jn >= 4) add('v', null, L`일을 ${jn - 1}번 바꾸며 살았습니다.`);
  const out = []; for (const p in by) out.push(...wishShuf(by[p]).slice(0, 6));
  return out;
}