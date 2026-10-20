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
const TG = { data: null, at: 0, land: null, base: null, cell: 0, pulses: [], seen: new Set(), queue: [], raf: 0, on: false, feedI: 0, feedT: 0 };
function tgLand() {
  if (TG.land) return TG.land;
  const raw = atob(WORLD.land), out = [];
  for (let i = 0; i < WORLD.w * WORLD.h; i++) if (raw.charCodeAt(i >> 3) & (128 >> (i & 7))) out.push([i % WORLD.w, Math.floor(i / WORLD.w)]);
  return (TG.land = out);
}
const tgAgo = s => s < 60 ? "vừa xong" : s < 3600 ? L`${Math.round(s / 60)}분 전` : L`${Math.round(s / 3600)}시간 전`;
function tgEventText(k, c, a) {
  const n = CBY[c] ? CBY[c].ko : c;
  if (k === 'b') return L`누군가 ${n}에서 태어났어요`;
  return a === 0 ? L`누군가 ${n}에서 첫 생일을 맞지 못하고 떠났어요` : L`누군가 ${n}에서 ${a}세에 삶을 마쳤어요`;
}
function tgFeed(reset) {
  const el = $('#tgFeed'), r = TG.data && TG.data.recent; if (!el) return;
  if (!r || !r.length) { el.textContent = ''; return; }
  if (reset) TG.feedI = 0;
  const ev = r[r.length - 1 - (TG.feedI % r.length)], ago = ev[0] + Math.round((Date.now() - TG.at) / 1000);
  el.textContent = `${tgAgo(ago)} · ${tgEventText(ev[1], ev[2], ev[3])}`;
  TG.feedT = Date.now();
}
function tgSize() {
  const cv = $('#tgMap'); if (!cv) return;
  const wrap = cv.parentElement || cv;
  const wrapW = wrap.clientWidth;
  const wrapH = wrap.clientHeight;
  if (!wrapW) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
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
  const css = getComputedStyle(document.documentElement), x = b.getContext('2d');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const col = isDark ? '#5A6578' : '#71717A';
  x.scale(dpr, dpr); x.fillStyle = col;
  const dotR = Math.max(1.2, cell * 0.38);
  for (const [i, j] of tgLand()) { x.beginPath(); x.arc((i + 0.5) * cell, (j + 0.5) * cell, dotR, 0, 7); x.fill(); }
  TG.base = b;
}
function tgStart() {
  if (TG.on) return; TG.on = true;
  const cv = $('#tgMap');
  if (cv && 'IntersectionObserver' in window) new IntersectionObserver(es => { TG.vis = es[0].isIntersecting; }, { threshold: 0 }).observe(cv); else TG.vis = true;
  addEventListener('resize', () => { TG.base = null; tgSize(); });
  const wrap = cv && cv.parentElement;
  if (wrap && typeof ResizeObserver === 'function') new ResizeObserver(() => { TG.base = null; tgSize(); }).observe(wrap);
  if (window.matchMedia) { const mq = matchMedia('(prefers-color-scheme: dark)'); const re = () => { TG.base = null; tgSize(); }; if (mq.addEventListener) mq.addEventListener('change', re); }
  if (cv) cv.addEventListener('click', tgTap);
  let last = 0;
  const loop = t => {
    TG.raf = requestAnimationFrame(loop);
    if (t - last < 33 || UI.view !== 'intro' || document.visibilityState !== 'visible') return;
    if (!TG.base) { tgSize(); TG.vis = TG.vis || !!TG.base; }
    if (!TG.vis) return;
    last = t; tgDraw(t);
    if (Date.now() - TG.feedT > 4500) { TG.feedI++; tgFeed(); }
  };
  TG.raf = requestAnimationFrame(loop);
}
function tgDraw(t) {
  const cv = $('#tgMap'); if (!cv || !TG.base) return;
  const x = cv.getContext('2d'), dpr = cv.width / cv.clientWidth, cell = TG.cell, css = getComputedStyle(document.documentElement);
  const accent = css.getPropertyValue('--accent').trim() || '#8C1D3C', stamp = css.getPropertyValue('--stamp').trim() || '#0F6E68', ink3 = css.getPropertyValue('--ink3').trim() || '#7A898D';
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); x.drawImage(TG.base, 0, 0);
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const now = Date.now();
  for (const [c, n] of (TG.data && TG.data.now) || []) {
    const p = WORLD.at[c]; if (!p) continue;
    const cx = p[0] * cell, cy = p[1] * cell, r = Math.min(Math.max(7, cell * 2.6), Math.max(cell * (0.55 + 0.32 * Math.sqrt(n)), 2 + 1.4 * Math.sqrt(n))),
      ph = (t / 2600 + (cx * 7 + cy * 13) % 10 / 10) % 1;
    x.globalAlpha = 0.22 * (1 - ph); x.strokeStyle = accent; x.lineWidth = 1.2;
    x.beginPath(); x.arc(cx, cy, r + ph * cell * 2.2, 0, 7); x.stroke();
    x.globalAlpha = 0.9; x.fillStyle = accent; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  }
  // Autonomous Real-Time Live Population Pulses (Generates vibrant pulses even offline)
  if (!TG.lastLocalPulse || now - TG.lastLocalPulse > 500) {
    TG.lastLocalPulse = now;
    // Weighted selection of country by birth population
    const topIsos = ['IND', 'CHN', 'NGA', 'PAK', 'IDN', 'COD', 'ETH', 'USA', 'BGD', 'VNM', 'BRA', 'PHL', 'EGY', 'JPN', 'DEU', 'GBR', 'FRA', 'ZAF'];
    const pickIso = topIsos[Math.floor(Math.random() * topIsos.length)];
    const isBirth = Math.random() < 0.65;
    TG.pulses.push({
      c: pickIso,
      k: isBirth ? 'b' : 'd',
      t0: now
    });
  }

  while (TG.queue.length && TG.queue[0].show <= now) { const ev = TG.queue.shift(); TG.pulses.push(Object.assign(ev, { t0: now })); }
  TG.pulses = TG.pulses.filter(pl => { const age = now - pl.t0; return age >= 0 && age < 2600; });
  for (const pl of TG.pulses) {
    const p = WORLD.at[pl.c]; if (!p) continue;
    const k = (now - pl.t0) / 2600;
    const color = pl.k === 'b' ? '#16A34A' : '#DC2626'; // Vibrant Emerald for Birth, Crimson Ruby for Death
    x.globalAlpha = 0.9 * (1 - k);
    x.strokeStyle = color;
    x.lineWidth = 2.2;
    x.beginPath();
    x.arc(p[0] * cell, p[1] * cell, cell * (0.8 + k * 5.2), 0, 7);
    x.stroke();
    // Inner bright core
    x.globalAlpha = 0.8 * (1 - k);
    x.fillStyle = color;
    x.beginPath();
    x.arc(p[0] * cell, p[1] * cell, Math.max(2, cell * 1.2 * (1 - k)), 0, 7);
    x.fill();
  }
  x.globalAlpha = 1;
}
function tgTap(e) {
  const cv = $('#tgMap'), tip = $('#tgTip'); if (!cv || !tip || !TG.data) return;
  const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
  let best = null, bd = 1e9;
  for (const g of TG.data.now || []) {
    const p = WORLD.at[g[0]]; if (!p || !CBY[g[0]]) continue;
    const d = Math.hypot(p[0] * TG.cell - mx, p[1] * TG.cell - my); if (d < bd) { bd = d; best = g; }
  }
  if (!best || bd > Math.max(18, TG.cell * 4)) { tip.hidden = true; return; }
  const ages = best[2].map(a => a < 0 ? "đang chào đời" : L`${a}세`);
  tip.innerHTML = L`<b>${esc(CBY[best[0]].ko)}</b> ${best[1]}명이 살고 있어요<br><small>${esc(ages.join(', '))}${best[1] > ages.length ? ' …' : ''}</small>`;
  const p = WORLD.at[best[0]], box = (tip.parentElement || cv).getBoundingClientRect();
  const px = r.left - box.left + p[0] * TG.cell, py = r.top - box.top + p[1] * TG.cell;
  tip.style.left = Math.min(box.width - 178, Math.max(8, px - 80)) + 'px'; tip.style.top = Math.max(0, py + 14) + 'px';
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
  cleaner: 'laundry', warehouse: 'truck', childcare: 'school', healthtech: 'clinic', social: 'office', salesagent: 'office', welder: 'crane', clergy: 'dome', boardpro: 'school', progamer: 'office' };
const SKIN_W = { n: [36, 44, 15, 5, 0, 0], m: [3, 17, 42, 30, 8, 0], s: [0, 0, 14, 46, 34, 6], e: [22, 50, 28, 0, 0, 0], se: [0, 8, 44, 40, 8, 0],
  a: [0, 0, 0, 6, 36, 58], ha: [0, 0, 6, 32, 44, 18], l: [6, 22, 34, 26, 10, 2], c: [0, 0, 5, 15, 40, 40], ca: [6, 32, 44, 18, 0, 0], pa: [0, 0, 4, 24, 46, 26],
  sc: [16, 46, 28, 10, 0, 0], in: [0, 4, 30, 46, 20, 0], au: [0, 0, 5, 25, 40, 30], br: [0, 0, 10, 36, 34, 20], co: [0, 10, 36, 38, 16, 0], ro: [0, 10, 40, 40, 10, 0] };
const SKIN_C = { e: 'CHN,KOR,PRK,JPN,TWN,HKG,MNG,SGP', se: 'VNM,THA,LAO,KHM,MMR,MYS,IDN,PHL,TLS,BRN', s: 'IND,PAK,BGD,NPL,LKA,BTN,MDV,MUS', ca: 'KAZ,UZB,KGZ,TJK,TKM,AZE,GEO,ARM',
  m: 'TUR,IRN,ISR,AFG', c: 'HTI,JAM,DOM,CUB,TTO,GUY,SUR', sc: 'ARG,URY,CHL', pa: 'PNG,SLB,FJI,VUT', ha: 'ETH,ERI,SOM,DJI,SDN', n: 'BRA' };
const SKIN_CI = {};
for (const k in SKIN_C) for (const i of SKIN_C[k].split(',')) SKIN_CI[i] = k;
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
PX_PET.h = ['.B..B..', 'BBBBBB.', 'BkBBBBB', 'NBBBBBB', '.wwwww.'];
PX_PET.r = ['.B.....', '.BB....', '.BB....', 'BBBB...', 'kBBBBB.', 'NBBBBBw', '.BBBBBw', '..w..w.'];
PX_PET.b = ['..BB...', '.BkBB..', 'cBBBBB.', '.BBBww.', '..BBT..', 'yyyyyyy', '...y...', '...y...', '...y...', '..yyy..'];
PX_PET.f = ['GGGGGGGGGG', 'WWWWWWWWWW', 'WWWoWWWWWW', 'WWooWWWpWW', 'WWWoWWWpWW', 'WWWWWWpWWW', 'ssssssssss', 'GGGGGGGGGG', '.G......G.', '.G......G.'];
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
MO.born = c => {
  const P = c.P, k = c.cast, hosp = c.m.urban && !['hut', 'tent'].includes(c.m.home);
  const mom = k.par.find(p => p.sex === 'F') || (k.par.length ? null : moGen(c, 'par', 'F', 28)), dad = k.par.find(p => p.sex === 'M');
  moRoom(c, hosp ? { wall: pxMix(P.wall, P.light(P.water, 0.6), 0.3), floor: 'tile', win: [[22, 26], [150, 22]], plain: true } : { win: [[24, 22]], frames: [150, 164] });
  const bun = P.light(P.me, 0.55);
  if (mom) {
    const s = moFig(mom, P, { pose: 'hold', bun, top: hosp ? moWear('patient', P).top : undefined });
    moBed(c, 72, 44, PX.G - (hosp ? 12 : 8), s, { hosp });
    fxHeart(c, 79, PX.G - (hosp ? 12 : 8) - s.hand[1] - 8);
  } else { const s = pxNewborn(k.me, P); moBed(c, 76, 34, PX.G - 9, null, {}); moPut(c, s, 84, PX.G - 20); moSpan(c, 76, 110); }
  if (dad) { const s = moFig(dad, P, {}); moPut(c, s, 120, PX.G - s.h); moSpan(c, 70, 130); }
  for (const sb of k.sib.slice(0, 2)) { const s = moFig(sb, P, { pose: 'wave' }); moPut(c, s, dad ? 132 + k.sib.indexOf(sb) * 10 : 120 + k.sib.indexOf(sb) * 10, PX.G - s.h); }
  moVase(c, 56, PX.G - 12);
  c.span = [70, 114];
};
MO.baby = c => {
  const P = c.P, k = c.cast, babies = k.kids.filter(p => p.age <= 1).sort((a, b) => a.age - b.age), baby = babies[0];
  moRoom(c, { win: [[28, 22]], frames: [136, 150], lamp: 170 });
  const others = [...k.pt, ...k.kids.filter(p => p !== baby && p.age >= 2).slice(0, 3), ...k.par.slice(0, 1)];
  const me = { p: k.me, s: moFig(k.me, P, { pose: 'hold', bun: P.light(P.kid, 0.55) }), dy: 1 };
  const hold2 = babies.length > 1 ? others.find(p => p.role === 'pt' || p.role === 'par') : null;
  const row = moAround(me, others.map(p => ({ p, s: moFig(p, P, p === hold2 ? { pose: 'hold', bun: P.light(P.kid, 0.45) } : p.role === 'kid' ? { pose: 'wave' } : {}), dy: 0 })));
  const xs = moRow(c, row, MO_CX - 10);
  const x = c.span[1] + 4, r = c.front; r.rect(x, PX.G - 11, 18, 1, P.trunk); for (let i = 0; i < 18; i += 3) r.rect(x + i, PX.G - 11, 1, 11, P.trunk); r.rect(x, PX.G - 4, 18, 1, P.trunk);
  r.line(x + 9, 8, x + 9, 16, P.ol); r.rect(x + 4, 16, 11, 1, P.ol); [P.gold, P.accent, P.water].forEach((col, i) => { r.px(x + 4 + i * 5, 17, P.ol); r.rect(x + 3 + i * 5, 18, 3, 2, col); });
  fxHeart(c, MO_CX - 14, 18); fxHeart(c, MO_CX - 2, 14, P.light(P.gold, 0.2)); moSpan(c, c.span[0], x + 18);
};
MO.school = c => {
  const P = c.P, k = c.cast; moSky(c, 'm'); moFar(c); moGrass(c);
  const b = pxHouse(P, 58, 18, 7, P.stamp, P.wall, {}); c.mid.blit(b, 66, PX.G - b.h - 2, P.ol);
  c.mid.rect(93, PX.G - b.h - 1, 5, 4, P.wall); c.mid.px(95, PX.G - b.h, P.ol);
  for (const x of [56, 132]) { c.mid.rect(x, PX.G - 16, 4, 16, P.wall2); c.mid.rect(x - 1, PX.G - 17, 6, 2, P.shade(P.wall2, 0.2)); }
  c.mid.rect(60, PX.G - 1, 72, 1, P.pave2);
  for (const x of [30, 160]) moTreeBig(c, x, PX.G, c.m.region === 'hi' || c.m.region === 'eap' ? 'round' : null);
  const grown = k.me.age >= 18, child = grown ? (k.kids.filter(p => p.age >= 4 && p.age <= 13).sort((a, b) => a.age - b.age)[0] || k.gk[0] || moGen(c, 'kid', null, 6)) : k.me;
  const me = moFig(child, P, { pose: 'wave' });
  const par = (grown ? [k.me, ...k.pt.slice(0, 1)] : k.par.slice(0, 1)).map(p => ({ p, s: moFig(p, P, { pose: 'wave' }) }));
  const kids = [moSome(c, 'kid', null, child.age), moSome(c, 'sib', null, child.age)];
  const xs = moRow(c, [kids[0], { s: me, dy: 1 }, ...par, kids[1]], MO_CX, PX.G, 3);
  { const sy = PX.G - me.h + 1 + me.hand[1] - 4, A = P.accent; c.mid.rect(xs[1] - 1, sy, me.w + 2, 5, A); c.mid.rect(xs[1] - 1, sy, me.w + 2, 1, P.light(A, 0.3)); c.mid.rect(xs[1] - 1, sy + 4, me.w + 2, 1, P.shade(A, 0.25)); }
  if (c.m.region === 'hi' || c.m.region === 'eap') fxPetals(c, 16);
};
MO.grad = c => {
  const P = c.P, k = c.cast, lv = +c.a[0] || 3, uni = lv >= 4;
  moSky(c, 'd'); moFar(c); moGrass(c);
  if (uni) {
    const r = c.mid, x0 = 58, w = 76, W = P.light(P.wall, 0.3);
    for (let j = 0; j < 7; j++) r.rect(x0 + 2 + (6 - j) * 5, PX.G - 34 + j, w - 4 - (6 - j) * 10, 1, j === 6 ? P.shade(W, 0.15) : W);
    r.rect(x0 + 2, PX.G - 27, w - 4, 3, W); r.rect(x0 + 2, PX.G - 24, w - 4, 1, P.shade(W, 0.2));
    for (let i = 0; i < 7; i++) { r.rect(x0 + 6 + i * 11, PX.G - 23, 3, 18, W); r.rect(x0 + 8 + i * 11, PX.G - 23, 1, 18, P.shade(W, 0.12)); }
    r.rect(x0, PX.G - 5, w, 2, P.shade(W, 0.08)); r.rect(x0 - 3, PX.G - 3, w + 6, 3, P.shade(W, 0.14));
    { const cap = pxSprite(['.KKK.', 'KKKKK', '.KKKY', '..K.Y'], { K: moNavy(P), Y: P.gold }); for (let i = 0; i < 6; i++) c.front.blit(cap, 66 + i * 11 + (c.R() * 4 | 0), 3 + (c.R() * 12 | 0), null); }
  } else {
    const b = pxHouse(P, 70, 16, 6, P.stamp, P.wall, {}); c.mid.blit(b, 60, PX.G - b.h - 1, P.ol);
    moBunting(c, PX.G - 26, 56, 138);
  }
  const gown = uni ? moWear('gown', P) : moWear('school', P);
  const me = moFig(k.me, P, Object.assign({ pose: 'up', hat: uni ? 'grad' : undefined }, gown));
  const mates = [moSome(c, 'sib', null, k.me.age, Object.assign({ pose: 'wave', hat: uni ? 'grad' : undefined }, gown)), moSome(c, 'pt', null, k.me.age, Object.assign({ hat: uni ? 'grad' : undefined }, gown))];
  const par = (k.par.length ? k.par : uni ? [moGen(c, 'par', 'F', k.me.age + 28), moGen(c, 'par', 'M', k.me.age + 30)] : []).slice(0, 2);
  const row = [mates[0], { s: me, dy: 1 }, ...par.map(p => ({ s: moFig(p, P, { pose: 'wave' }) })), mates[1]];
  const xs = moRow(c, row, MO_CX, PX.G, 3);
  const r = c.front, hx = xs[1] + me.w + 1, hy = PX.G - me.h + 6; r.rect(hx, hy, 5, 2, moWhite(P)); r.px(hx + 2, hy, P.accent); r.px(hx + 2, hy + 1, P.accent);
  if (!uni && (c.m.region === 'hi' || c.m.region === 'eap')) moBouquet(c, xs[1] - 2, PX.G - me.h + 9);
  fxConfetti(c, uni ? 30 : 16, 34);
};
MO.pass = c => {
  const P = c.P, k = c.cast; moRoom(c, { win: [[30, 22]], frames: [140], lamp: 168 });
  const me = moFig(k.me, P, { pose: 'up' });
  const row = moAround({ s: me, dy: -2 }, moFam(c, 4).map(p => ({ s: moFig(p, P, { pose: p.role === 'par' ? 'wave' : 'up' }) })));
  const xs = moRow(c, row, MO_CX); const i = row.findIndex(x => x.s === me);
  c.front.rect(xs[i] - 2, PX.G - me.h - 6, 4, 3, moWhite(P)); c.front.px(xs[i] - 1, PX.G - me.h - 5, P.accent);
  fxConfetti(c, 22, 40); fxSpark(c, MO_CX, 16, 3);
};
MO.study = c => {
  const P = c.P, k = c.cast; moRoom(c, { win: [[58, 24]], view: 'night', frames: [140] });
  const me = moFig(k.me, P, { pose: 'sit' }); const x = MO_CX - 4; moPut(c, me, x, PX.G - me.h - 7); moSpan(c, x - 18, x + 26);
  const r = c.front; r.rect(x - 16, PX.G - 12, 40, 2, P.light(P.trunk, 0.1)); r.rect(x - 15, PX.G - 10, 1, 10, P.trunk); r.rect(x + 22, PX.G - 10, 1, 10, P.trunk); r.rect(x + 12, PX.G - 10, 10, 10, P.shade(P.trunk, 0.1));
  [P.accent, P.stamp, P.gold].forEach((col, i) => r.rect(x - 14, PX.G - 14 - i * 2, 8, 2, col)); r.rect(x + 1, PX.G - 13, 7, 1, moWhite(P));
  r.line(x + 18, PX.G - 12, x + 15, PX.G - 20, P.ol); r.rect(x + 13, PX.G - 22, 6, 2, P.gold);
  for (let j = -6; j <= 10; j++) for (let i = -14; i <= 14; i++) if (i * i + j * j * 2 < 170) c.front.dither(x + 14 + i, PX.G - 18 + j, P.light(P.gold, 0.6), 0.1);
};
MO.wed = c => {
  const P = c.P, k = c.cast, kidS = c.a[0] === 's', kidW = c.a[0] === 'k' || kidS, gst = c.a[0] === 'g', sa = c.m.region === 'sa', hall = c.m.urban && !sa;
  let A, B;
  if (gst) { A = moGen(c, 'inlaw', 'F', Math.max(24, k.me.age < 30 ? k.me.age + 2 : 28)); B = moGen(c, 'inlaw', 'M', A.age + 2); }
  else if (kidW) { A = { role: 'kid', sex: c.a[1] === 'M' ? 'M' : 'F', age: Math.max(18, +c.a[2] || 28), sk: k.sk }; B = kidS ? moGen(c, 'inlaw', A.sex, A.age + 1) : moGen(c, 'inlaw', A.sex === 'F' ? 'M' : 'F', A.age + (A.sex === 'F' ? 2 : -2)); }
  else { A = k.me; B = k.pt[0] || moGen(c, 'pt', k.me.sex === 'F' ? 'M' : 'F', k.me.age + (k.me.sex === 'F' ? 2 : -2)); }
  if (hall) moRoom(c, { wall: P.light(P.wall, 0.4), floor: 'tile', plain: true });
  else { moSky(c, 'd'); moFar(c); moGrass(c); for (const x of [26, 168]) moTreeBig(c, x, PX.G); }
  if (hall) { const r = c.mid; for (const x of [40, 152]) { r.rect(x, 2, 1, 6, P.gold); r.disc(x, 10, 3, P.light(P.gold, 0.5)); r.px(x - 2, 12, moRGB('#FFF4CF')); r.px(x + 2, 12, moRGB('#FFF4CF')); } for (let x = 60; x < 132; x++) c.mid.px(x, PX.G + 4 + (x % 2), P.light(P.accent, 0.5)); c.mid.rect(60, PX.G + 3, 72, 6, P.light(P.accent, 0.62)); }
  const r = c.mid, ax = MO_CX, half = 16, fl = sa ? [moRGB('#F2A23A'), moRGB('#E85A4F'), P.gold] : [P.light(P.accent, 0.55), P.light(P.wall, 0.85), P.light(P.accent, 0.35)];
  if (sa) { for (const x of [ax - half, ax + half - 1]) r.rect(x, PX.G - 26, 2, 26, P.gold); r.rect(ax - half - 2, PX.G - 28, half * 2 + 4, 3, moRGB('#C0303A')); for (let x = ax - half - 2; x < ax + half + 2; x += 2) { r.px(x, PX.G - 25, fl[(x >> 1) % 3]); r.px(x + 1, PX.G - 24, fl[(x >> 1) % 3]); } }
  else {
    for (const x of [ax - half, ax + half - 1]) r.rect(x, PX.G - 20, 2, 20, P.light(P.wall, 0.6));
    for (let t = 0; t <= 40; t++) { const a = Math.PI * t / 40, x = Math.round(ax - Math.cos(a) * half), y = Math.round(PX.G - 20 - Math.sin(a) * 9); r.px(x, y, P.tree); r.px(x, y - 1, fl[t % 3]); if (t % 2) r.px(x + 1, y, fl[(t + 1) % 3]); }
    for (let y = PX.G - 20; y < PX.G - 2; y += 3) { r.px(ax - half - 1, y, fl[y % 3]); r.px(ax + half + 1, y, fl[(y + 1) % 3]); r.px(ax - half - 1, y + 1, P.tree); r.px(ax + half + 1, y + 1, P.tree); }
  }
  const dressFor = p => sa ? (p.sex === 'F' ? Object.assign(moWear('red', P), { hat: undefined }) : { top: P.light(P.sand, 0.45), bot: P.light(P.sand, 0.3) })
    : p.sex === 'F' ? Object.assign(moWear('bride', P), { hat: 'veil' }) : moWear('suit', P);
  const sA = moFig(A, P, dressFor(A)), sB = moFig(B, P, dressFor(B));
  const guests = kidW || gst ? [Object.assign({}, k.me), ...k.pt, ...(gst ? k.kids.slice(0, 2) : [])] : [...k.par, ...k.sib.slice(0, 2)];
  while (guests.length < 4) guests.push(moGen(c, 'sib', null, (kidW ? A.age : k.me.age) + (c.R() < 0.5 ? 0 : 25)));
  const GC = [P.gold, P.stamp, P.light(P.accent, 0.25), P.water, P.light(P.tree, 0.1), P.light(P.wall3, 0.1)];
  const gs = guests.slice(0, 6).map((p, i) => ({ s: moFig(p, P, Object.assign({ pose: i % 2 ? 'wave' : 'up' }, p.gen ? { top: GC[(i + (c.R() * 6 | 0)) % 6] } : {})), dy: 0 }));
  const L = gs.filter((_, i) => i % 2 === 0), Rr = gs.filter((_, i) => i % 2);
  moRow(c, [...L, { s: sA, dy: 1, gap: 1 }, { s: sB, dy: 1, gap: 3 }, ...Rr].map((x, i, a) => x), MO_CX, PX.G, 2);
  if (!sa) { const brideL = A.sex === 'F' ? 0 : B.sex === 'F' ? 1 : -1; if (brideL >= 0) { const w = sA.w + 1 + sB.w; const x0 = Math.round(MO_CX - (gs.length ? 0 : 0)); } }
  fxPetals(c, 26, sa ? moRGB('#F2A23A') : null);
};
MO.date = c => {
  const P = c.P, k = c.cast, B = k.pt[0] || moGen(c, 'pt', k.me.sex === 'F' ? 'M' : 'F', k.me.age + (c.R() * 4 - 2));
  moSky(c, 'dusk'); moFar(c); moGrass(c);
  for (const x of [44, 150]) moTreeBig(c, x, PX.G, 'round');
  const r = c.mid; r.rect(130, PX.G - 26, 1, 26, P.ol); r.rect(128, PX.G - 28, 5, 2, P.ol); r.disc(130, PX.G - 25, 2, moRGB('#FFE7A8'));
  const s1 = moFig(k.me, P, { pose: 'sit' }), s2 = moFig(B, P, { pose: 'sit' });
  const by = PX.G - 6; moRow(c, [{ s: s1 }, { s: s2 }], MO_CX, by + 3, 0);
  const bx = c.span[0] - 4, bw = c.span[1] - c.span[0] + 8; c.front.rect(bx, by, bw, 2, P.trunk); c.front.rect(bx, by + 2, bw, 1, P.shade(P.trunk, 0.25)); c.front.rect(bx + 1, by + 3, 1, PX.G - by - 3, P.ol); c.front.rect(bx + bw - 2, by + 3, 1, PX.G - by - 3, P.ol);
  c.mid.rect(bx, by - 8, bw, 2, P.trunk); c.mid.rect(bx + 1, by - 6, 1, 6, P.trunk); c.mid.rect(bx + bw - 2, by - 6, 1, 6, P.trunk);
  fxHeart(c, MO_CX - 3, by - 24); fxHeart(c, MO_CX + 6, by - 30, P.light(P.accent, 0.45));
};
MO.anniv = c => {
  const P = c.P, k = c.cast, B = k.pt[0] || moGen(c, 'pt', k.me.sex === 'F' ? 'M' : 'F', k.me.age);
  moRoom(c, { win: [[40, 30]], view: 'night', frames: [140, 154] });
  moAtTable(c, [{ s: moFig(k.me, P, {}) }, { s: moFig(B, P, {}), gap: 6 }], MO_CX, PX.G - 8, { gap: 10 });
  const r = c.front, cx = MO_CX; r.rect(cx, PX.G - 12, 1, 4, moWhite(P)); r.px(cx, PX.G - 13, moRGB('#FFB43A')); r.px(cx, PX.G - 14, moRGB('#FFF0B0'));
  for (const gx of [cx - 6, cx + 5]) { r.rect(gx, PX.G - 12, 2, 2, P.light(P.accent, 0.2)); r.px(gx, PX.G - 10, P.light(P.wall, 0.6)); r.px(gx + 1, PX.G - 10, P.light(P.wall, 0.6)); r.rect(gx, PX.G - 9, 2, 1, P.light(P.wall, 0.6)); }
  for (let j = -8; j <= 4; j++) for (let i = -18; i <= 18; i++) if (i * i + j * j * 4 < 300) c.mid.dither(cx + i, PX.G - 13 + j, P.light(P.gold, 0.55), 0.18);
  fxHeart(c, cx - 2, 8, P.light(P.accent, 0.3));
};
MO.cake = c => {
  const P = c.P, k = c.cast, whose = c.a[0] || 'me';
  moRoom(c, { win: [[30, 22]], view: 'dusk', frames: [150] }); moBunting(c, 3, 50, 142);
  let star = k.me; if (whose === 'kid') star = k.kids.slice().sort((a, b) => a.age - b.age)[0] || k.me; else if (whose === 'gk') star = k.gk[0] || moGen(c, 'kid', null, 6);
  const others = [k.me, ...moFam(c, 6)].filter(p => p !== star).slice(0, 5);
  while (others.length < 2) others.push(moGen(c, 'sib', null, k.me.age + (c.R() * 10 - 5)));
  const row = moAround({ s: moFig(star, P, { hat: 'party', pose: 'up' }), dy: star.role === 'me' ? 1 : 0 }, others.map((p, i) => ({ s: moFig(p, P, { hat: i < 3 ? 'party' : undefined, cap: [P.gold, P.water, P.stamp][i % 3] }) })));
  moAtTable(c, row, MO_CX, PX.G - 8);
  moCake(c, MO_CX - 4, PX.G - 8, 5); moBalloons(c, c.span[0] - 10, 16); moBalloons(c, c.span[1] + 4, 14, 2);
};
MO.meal = c => {
  const P = c.P, k = c.cast;
  moRoom(c, { win: [[28, 22]], view: c.R() < 0.5 ? 'dusk' : 'd', frames: [146, 160] });
  const ps = moFam(c, 6); while (ps.length < 2) ps.push(moGen(c, 'sib', null, k.me.age));
  const row = moAround({ s: moFig(k.me, P, {}), dy: 1 }, ps.map(p => ({ s: moFig(p, P, {}) })));
  moAtTable(c, row, MO_CX, PX.G - 8);
  moDishes(c, c.span[0] - 4, c.span[1] - c.span[0] + 8, PX.G - 8);
  const r = c.mid; r.rect(MO_CX, 0, 1, 8, P.ol); r.rect(MO_CX - 4, 8, 9, 3, P.light(P.gold, 0.3)); for (let j = 0; j <= 30; j++) for (let i = -30; i <= 30; i++) if (i * i / 4 + j * j < 600) r.dither(MO_CX + i, 11 + j, P.light(P.gold, 0.6), 0.1);
};
MO.bed = c => {
  const P = c.P, k = c.cast;
  moRoom(c, { win: [[44, 22]], view: 'night', frames: [148], plain: true });
  let child, adult;
  if (k.me.age < 13) { child = k.me; adult = k.par.find(p => p.sex === 'F') || k.par[0] || k.sib[0] || moGen(c, 'par', 'F', k.me.age + 28); }
  else { child = k.kids.filter(p => p.age < 13).sort((a, b) => a.age - b.age)[0] || k.gk[0] || moGen(c, 'kid', null, 6); adult = k.me; }
  const sc = moFig(child, P, { top: P.light(child.role === 'me' ? P.me : P.kid, 0.3) });
  moBed(c, MO_CX - 4, 34, PX.G - 9, sc, { blanket: P.light(P.water, 0.35) });
  const sa = moFig(adult, P, { pose: 'sit' }); moPut(c, sa, MO_CX - 18, PX.G - sa.h); moSpan(c, MO_CX - 20, MO_CX + 30);
  const r = c.front; r.rect(MO_CX - 21, PX.G - 6, 9, 1, P.trunk); r.rect(MO_CX - 20, PX.G - 5, 1, 5, P.trunk); r.rect(MO_CX - 14, PX.G - 5, 1, 5, P.trunk);
  r.rect(MO_CX - 18 + sa.w - 3, PX.G - sa.h + sa.hand[1] - 3, 4, 3, P.accent); r.rect(MO_CX - 18 + sa.w - 2, PX.G - sa.h + sa.hand[1] - 3, 1, 3, moWhite(P));
  r.rect(MO_CX + 34, PX.G - 8, 5, 8, P.shade(P.trunk, 0.05)); r.rect(MO_CX + 35, PX.G - 12, 3, 4, P.light(P.gold, 0.4));
  for (let j = -10; j <= 8; j++) for (let i = -14; i <= 14; i++) if (i * i + j * j * 2 < 170) r.dither(MO_CX + 36 + i, PX.G - 11 + j, P.light(P.gold, 0.6), 0.14);
  fxStars(c, 0); for (const [x, y] of [[MO_CX + 6, 12], [MO_CX + 14, 8], [MO_CX + 22, 13]]) { r.px(x, y, P.light(P.gold, 0.5)); r.px(x - 1, y, P.light(P.gold, 0.5)); r.px(x + 1, y, P.light(P.gold, 0.5)); r.px(x, y - 1, P.light(P.gold, 0.5)); r.px(x, y + 1, P.light(P.gold, 0.5)); }
};
MO.play = c => {
  const P = c.P, k = c.cast; moSky(c, 'd'); moFar(c); moGrass(c);
  for (const x of [30, 62, 160]) moTreeBig(c, x, PX.G, 'round');
  let child, adult;
  if (k.me.age < 13) { child = k.me; adult = k.par.find(p => p.sex === 'M') || k.par[0] || moGen(c, 'par', 'M', k.me.age + 30); }
  else { child = k.kids.filter(p => p.age >= 2 && p.age < 13).sort((a, b) => a.age - b.age)[0] || k.gk[0] || moGen(c, 'kid', null, 5); adult = k.me; }
  const v = c.a[0] || ['sh', 'bike', 'kite'][Math.floor(c.R() * 3)], sa = moFig(adult, P, { pose: v === 'sh' ? 'up' : v === 'kite' ? 'wave' : '' }), sc = moFig(child, P, { pose: v === 'bike' ? '' : 'up' });
  const r = c.front, x = MO_CX - 4;
  if (v === 'sh') { const ya = PX.G - sa.h + 1; moPut(c, sc, x + Math.round((sa.w - sc.w) / 2), ya - sc.h + 4); moPut(c, sa, x, ya); moSpan(c, x - 6, x + sa.w + 6); }
  else if (v === 'bike') {
    const bx = x + 4, wy = PX.G - 3, sk = moFig(child, P, { pose: 'sit' });
    for (const wx of [bx, bx + 12]) { for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; r.px(Math.round(wx + Math.cos(t) * 3), Math.round(wy + Math.sin(t) * 3), P.ol); } r.px(wx, wy, P.metal); }
    moPut(c, sk, bx + 2, wy - 4 - sk.h + 3);
    r.line(bx, wy, bx + 6, wy - 1, P.accent); r.line(bx + 6, wy - 1, bx + 12, wy, P.accent); r.line(bx + 4, wy - 4, bx + 6, wy - 1, P.accent); r.line(bx + 10, wy - 6, bx + 12, wy, P.accent); r.rect(bx + 9, wy - 7, 3, 1, P.ol); r.rect(bx + 3, wy - 5, 3, 1, P.ol);
    moPut(c, sa, bx - 10, PX.G - sa.h + 1); moSpan(c, bx - 12, bx + 16);
  } else {
    moPut(c, sa, x - 6, PX.G - sa.h + 1); moPut(c, sc, x + sa.w - 3, PX.G - sc.h); moSpan(c, x - 8, x + 20);
    const kx = x + 26, ky = 10; c.sky.px(kx, ky - 3, P.accent); for (let j = -2; j <= 2; j++) for (let i = -(2 - Math.abs(j)); i <= 2 - Math.abs(j); i++) c.sky.px(kx + i, ky + j, j < 0 ? P.accent : P.gold);
    for (let t = 0; t < 1; t += 0.02) c.sky.px(Math.round(kx + (x + sa.w + 4 - kx) * t), Math.round(ky + 3 + (PX.G - 12 - ky) * t * t), P.light(P.ol, 0.3));
  }
};
MO.hosp = c => {
  const P = c.P, k = c.cast, who = c.a[0] || 'me';
  moRoom(c, { wall: pxMix(P.wall, P.light(P.water, 0.6), 0.3), floor: 'tile', win: [[22, 26]], plain: true });
  const pick = who === 'kid' ? k.kids.slice().sort((a, b) => a.age - b.age)[0] : who === 'pt' ? k.pt[0] : who === 'par' ? k.par[0] || moGen(c, 'par', null, k.me.age + 28) : k.me;
  const pat = pick || k.me, s = moFig(pat, P, moWear('patient', P));
  moBed(c, MO_CX - 22, 42, PX.G - 12, s, { hosp: true });
  const vis = (pat === k.me ? moFam(c, 3) : [k.me, ...moFam(c, 2).filter(p => p !== pat)]).slice(0, 3);
  let x = MO_CX + 28; for (const p of vis) { const sv = moFig(p, P, {}); moPut(c, sv, x, PX.G - sv.h + (p.role === 'me' ? 1 : 0)); x += sv.w + 2; }
  moSpan(c, MO_CX - 24, Math.min(PX.W, x));
  moVase(c, MO_CX - 36, PX.G - 12);
  const r = c.mid; r.rect(MO_CX + 2, 10, 14, 9, P.ol); r.rect(MO_CX + 3, 11, 12, 7, moRGB('#18302A')); for (let i = 0; i < 12; i++) r.px(MO_CX + 3 + i, 14 + (i === 5 ? -2 : i === 6 ? 2 : 0), moRGB('#6FE0A0'));
};
MO.loss = c => {
  const P = c.P, k = c.cast, pet = c.a[0] === 'pet';
  const sk = Object.assign({}, c.m, { mood: 'low' }); pxSky(c.sky, Object.assign(sk, { stage: 'e' }), P, c.R);
  for (let i = 0; i < 5; i++) pxCloud(c.sky, Math.round(10 + i * 42 + c.R() * 10), Math.round(12 + c.R() * 8), Math.round(24 + c.R() * 10), P, c.R, true);
  moFar(c); moGrass(c);
  for (const x of [24, 170]) moTreeBig(c, x, PX.G, 'pine');
  const r = c.mid, gx = MO_CX + 16, St = P.light(P.stone, 0.3);
  if (pet) { r.rect(gx - 6, PX.G - 2, 13, 2, P.soil); r.disc(gx, PX.G - 1, 3, P.soil); r.rect(gx, PX.G - 9, 1, 7, P.trunk); r.rect(gx - 2, PX.G - 8, 5, 1, P.trunk); }
  else {
    for (const ox of [-38, 36]) { r.rect(gx + ox - 3, PX.G - 8, 7, 8, P.shade(St, 0.1)); r.rect(gx + ox - 2, PX.G - 9, 5, 1, P.shade(St, 0.1)); }
    r.rect(gx - 5, PX.G - 13, 11, 13, St); r.rect(gx - 4, PX.G - 14, 9, 1, St); r.rect(gx - 3, PX.G - 15, 7, 1, St); r.rect(gx + 4, PX.G - 13, 2, 13, P.shade(St, 0.15));
    r.rect(gx - 2, PX.G - 10, 5, 1, P.shade(St, 0.25)); r.rect(gx - 2, PX.G - 8, 5, 1, P.shade(St, 0.25));
  }
  moFlowers(c, gx - 4, PX.G - 3, c.front, 4, P.light(P.wall, 0.9)); moFlowers(c, gx + 3, PX.G - 3, c.front, 3, P.light(P.wall, 0.9));
  const ps = [k.me, ...moFam(c, 3)].slice(0, 4), blk = moWear('black', P), umb = [P.ol, P.shade(P.accent, 0.35), P.shade(P.stamp, 0.35), P.shade(P.wall3, 0.3)];
  let x = MO_CX - 12 - ps.length * 6;
  ps.forEach((p, i) => {
    const s = moFig(p, P, pet ? {} : blk), ux = x + (s.w >> 1), uy = PX.G - s.h - 3 + (p.role === 'me' ? 1 : 0);
    moPut(c, s, x, PX.G - s.h + (p.role === 'me' ? 1 : 0));
    if (p.age >= 7) { const U = umb[i % 4]; [2, 4, 6, 6].forEach((hw, j) => { for (let ii = -hw; ii <= hw; ii++) c.front.px(ux + ii, uy - 7 + j, j === 3 && (ii + 6) % 4 === 0 ? P.light(U, 0.25) : U); }); c.front.px(ux, uy - 8, P.ol); c.front.line(ux, uy - 3, ux, uy + 3, P.ol); }
    x += s.w + 4;
  });
  moSpan(c, MO_CX - 12 - ps.length * 6 - 4, gx + 8);
  fxRain(c, 80);
};
MO.mem = c => {
  const P = c.P, k = c.cast; moSky(c, 'e'); moFar(c); moGrass(c);
  for (const x of [30, 164]) moTreeBig(c, x, PX.G, 'round');
  const r = c.mid, gx = MO_CX + 12, St = P.light(P.stone, 0.35);
  r.rect(gx - 5, PX.G - 13, 11, 13, St); r.rect(gx - 4, PX.G - 14, 9, 1, St); r.rect(gx - 3, PX.G - 15, 7, 1, St); r.rect(gx + 4, PX.G - 13, 2, 13, P.shade(St, 0.15));
  moFlowers(c, gx - 4, PX.G - 3, c.front, 4); moFlowers(c, gx + 3, PX.G - 3, c.front, 3);
  const s = moFig(k.me, P, {}); moPut(c, s, MO_CX - 14, PX.G - s.h + 1); moBouquet(c, MO_CX - 14 + s.w, PX.G - s.h + 1 + s.hand[1] - 1);
  moSpan(c, MO_CX - 20, gx + 10);
  for (let i = 0; i < 3; i++) { const bx = 60 + i * 9, by = 10 + (i % 2) * 3; c.sky.px(bx - 1, by - 1, P.ol); c.sky.px(bx, by, P.ol); c.sky.px(bx + 1, by - 1, P.ol); }
};
MO.friends = c => {
  const P = c.P, k = c.cast, fire = c.R() < 0.4 && !c.m.urban;
  moSky(c, 'night'); if (fire) { moFar(c); moGrass(c); } else { moFar(c); moPave(c); }
  const fr = [moGen(c, 'sib', null, k.me.age + 1), moGen(c, 'pt', null, k.me.age - 1), moGen(c, 'inlaw', null, k.me.age + 2)];
  if (fire) {
    const row = moAround({ s: moFig(k.me, P, { pose: 'sit' }) }, fr.map((p, i) => ({ s: moFig(p, P, { pose: i === 0 ? 'up' : 'sit' }) })));
    moRow(c, row, MO_CX, PX.G - 1, 10);
    const r = c.front, fx = MO_CX + 1; r.rect(fx - 4, PX.G - 1, 9, 2, P.trunk); for (let j = 0; j < 7; j++) for (let i = -3 + (j >> 1); i <= 3 - (j >> 1); i++) r.px(fx + i, PX.G - 2 - j, j < 3 ? moRGB('#F2A23A') : moRGB('#FFD86A'));
    for (let j = -14; j <= 4; j++) for (let i = -30; i <= 30; i++) if (i * i + j * j * 4 < 900) c.mid.dither(fx + i, PX.G - 4 + j, moRGB('#F2A23A'), 0.12);
    fxStars(c, 30);
  } else {
    fxLanterns(c, 2, 30, 162);
    const row = moAround({ s: moFig(k.me, P, { pose: 'up' }), dy: 1 }, fr.map((p, i) => ({ s: moFig(p, P, { pose: i === 1 ? 'wave' : '' }) })));
    moAtTable(c, row, MO_CX, PX.G - 8, { cloth: false });
    for (let i = 0; i < 4; i++) { const gx = c.span[0] + 4 + i * 9; c.front.rect(gx, PX.G - 11, 2, 3, P.light(P.gold, 0.4)); c.front.px(gx, PX.G - 11, moWhite(P)); }
  }
};
MO.walk = c => {
  const P = c.P, k = c.cast, two = (c.a[0] === 'pt' || (!c.a[0] && k.pt.length)) && k.pt.length;
  moSky(c, 'm'); fxRays(c, 30, 14); moFar(c); moGrass(c);
  const r = c.mid; for (let y = PX.G; y < PX.H; y++) { const w = 8 + (y - PX.G) * 3; r.rect(MO_CX - (w >> 1) - (y - PX.G), y, w, 1, P.light(P.sand, 0.2)); }
  for (const x of [36, 150, 172]) moTreeBig(c, x, PX.G - 1);
  const ps = two ? [k.me, k.pt[0]] : [k.me];
  moRow(c, ps.map(p => ({ s: moFig(p, P, { pose: 'walk' }), dy: p.role === 'me' ? 1 : 0 })), MO_CX, PX.G + 2, 0);
  if (two) c.front.px(MO_CX, PX.G - 6, P.skin);
  for (let i = 0; i < 3; i++) { const bx = 120 + i * 8, by = 12 + (i % 2) * 2; c.sky.px(bx - 1, by - 1, P.ol); c.sky.px(bx, by, P.ol); c.sky.px(bx + 1, by - 1, P.ol); }
};
const MO_WORK = { clerk: 'office', callc: 'office', finance: 'office', dev: 'office', lawyer: 'office', engineer: 'office', civil: 'office', social: 'office', salesagent: 'office', designer: 'studio',
  teacher: 'class', prof: 'class', childcare: 'class', boardpro: 'class', progamer: 'office', doctor: 'clinic', nurse: 'clinic', healthtech: 'clinic', care: 'clinic',
  farm: 'field', farmhand: 'field', agbiz: 'field', herder: 'herd', fisher: 'sea', vendor: 'market', shop: 'market', owner: 'market', artisan: 'market', hair: 'market', mechanic: 'market',
  construct: 'site', miner: 'site', welder: 'site', electric: 'site', factory: 'factory', garment: 'factory', warehouse: 'factory', driver: 'road', delivery: 'road', cook: 'kitchen',
  artist: 'studio', creator: 'studio', musician: 'stage', idol: 'stage', actor: 'stage', athlete: 'sport', coach: 'sport', trainer: 'sport', clergy: 'church',
  soldier: 'base', police: 'base', service: 'base', guard: 'base', domestic: 'house', cleaner: 'house', homemaker: 'house', childwork: 'house', shelter: 'factory', pilot: 'sky', cabin: 'sky', astro: 'space', mp: 'hall', leader: 'hall' };
MO.work = c => {
  const job = c.a[0] || 'clerk', kind = MO_WORK[job] || 'office', sub = c.a[1] || '';
  (MO_W[kind] || MO_W.office)(c, job, sub);
  const P = c.P;
  if (sub === 'rank' || sub === 'ret') {
    const mates = [moGen(c, 'pt', null, c.cast.me.age - 6), moGen(c, 'sib', null, c.cast.me.age + 4)];
    const xs = [c.span ? c.span[0] - 12 : MO_CX - 30, c.span ? c.span[1] + 3 : MO_CX + 22];
    mates.forEach((p, i) => { const s = moFig(p, P, { pose: i ? 'wave' : 'up' }); moPut(c, s, xs[i], PX.G - s.h); moSpan(c, xs[i] - 1, xs[i] + s.w + 1); });
    if (sub === 'rank') fxSpark(c, MO_CX, 14, 4); else { moBunting(c, 3, MO_CX - 50, MO_CX + 50, c.front); fxPetals(c, 10); }
  }
};
function moWorker(c, o, x, y) {
  const sub = c.a[1] || '', ret = sub === 'ret', s = moFig(c.cast.me, c.P, Object.assign({}, o, sub === 'rank' ? { pose: 'up' } : {}));
  const X = x != null ? x : MO_CX - (s.w >> 1), Y = y != null ? y : PX.G - s.h + 1;
  moPut(c, s, X, Y); moSpan(c, X - 2, X + s.w + 2);
  if (ret) moBouquet(c, X + s.w, Y + s.hand[1] - 1);
  return { s, x: X, y: Y };
}
const MO_W = {};
MO_W.office = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.wall2, 0.35), floor: 'tile', plain: true });
  const r = c.mid; r.rect(20, 6, 152, 26, P.light(P.metal, 0.2)); for (let x = 21; x < 171; x += 15) { r.rect(x, 7, 14, 24, moRGB(P.sky.d[0])); for (let i = 0; i < 14; i += 4) { const h = 6 + ((x + i) * 13 % 9); r.rect(x + i, 31 - h, 3, h, P.far1); } }
  r.rect(160, 34, 6, 6, P.shade(P.trunk, 0.1)); r.disc(163, 32, 4, P.tree); r.px(162, 30, P.treehi);
  r.disc(30, 38, 3, moWhite(P)); r.px(30, 37, P.ol); r.px(31, 38, P.ol);
  const desk = (x, who, me) => {
    const s = moFig(who, P, me && (c.a[1] === 'rank' || c.a[1] === 'ret') ? (c.a[1] === 'rank' ? { pose: 'up' } : {}) : { pose: 'sit' });
    moPut(c, s, x + 8, PX.G - s.h - 6 + (me ? 1 : 0)); if (me) { moSpan(c, x - 2, x + 28); if (c.a[1] === 'ret') moBouquet(c, x + 8 + s.w, PX.G - s.h - 6 + 1 + s.hand[1] - 1); }
    const f = c.front; f.rect(x, PX.G - 10, 26, 2, P.light(P.trunk, 0.2)); f.rect(x + 1, PX.G - 8, 1, 8, P.shade(P.trunk, 0.1)); f.rect(x + 24, PX.G - 8, 1, 8, P.shade(P.trunk, 0.1));
    f.rect(x + 15, PX.G - 19, 10, 7, P.ol); f.rect(x + 16, PX.G - 18, 8, 5, P.light(P.water, 0.35)); f.rect(x + 19, PX.G - 12, 2, 2, P.ol);
    f.rect(x + 3, PX.G - 11, 6, 1, moWhite(P));
  };
  desk(MO_CX - 13, c.cast.me, true); desk(MO_CX - 46, moGen(c, 'pt', null, c.cast.me.age + 3), false); desk(MO_CX + 20, moGen(c, 'sib', null, c.cast.me.age - 4), false);
};
MO_W.class = (c, job) => {
  const P = c.P, kid = job === 'childcare' ? 4 : job === 'prof' ? 20 : 9;
  moRoom(c, { win: [[16, 20]], frames: [170], plain: true });
  const r = c.mid; r.rect(56, 8, 84, 24, P.trunk); r.rect(58, 10, 80, 20, job === 'childcare' ? P.light(P.gold, 0.3) : moRGB('#2F5D4A'));
  const ch = job === 'childcare' ? P.accent : P.light(P.wall, 0.8);
  for (let i = 0; i < 3; i++) { r.rect(62, 13 + i * 5, 14 + i * 6, 1, ch); r.rect(80 + i * 7, 13 + i * 5, 4, 1, ch); } r.disc(118, 18, 4, ch); r.rect(112, 24, 18, 1, ch);
  if (job === 'childcare') { for (const [x, col] of [[64, P.water], [72, P.tree], [80, P.accent]]) r.rect(x, 26, 6, 3, col); }
  moWorker(c, { pose: 'wave' }, 128, null);
  for (let i = 0; i < 4; i++) { const st = moFig(moGen(c, 'kid', null, kid), P, {}), x = 66 + i * 16; moPut(c, st, x, PX.G - st.h + 6); c.front.rect(x - 2, PX.G - 1, st.w + 4, 2, P.light(P.trunk, 0.15)); c.front.rect(x - 2, PX.G + 1, 1, PX.H - PX.G - 1, P.trunk); c.front.rect(x + st.w + 1, PX.G + 1, 1, PX.H - PX.G - 1, P.trunk); }
  moSpan(c, 64, 138);
};
MO_W.clinic = (c, job) => {
  const P = c.P; moRoom(c, { wall: pxMix(P.wall, P.light(P.water, 0.6), 0.3), floor: 'tile', win: [[18, 22]], plain: true });
  const r = c.mid; r.rect(150, 14, 9, 9, moWhite(P)); r.rect(153, 15, 3, 7, P.accent); r.rect(151, 17, 7, 3, P.accent);
  const pat = moFig(moGen(c, 'par', null, 70), P, moWear('patient', P)); moBed(c, MO_CX - 34, 40, PX.G - 12, pat, { hosp: true });
  const w = moWorker(c, job === 'doctor' ? moWear('coat', P) : moWear('scrubs', P), MO_CX + 14, null);
  c.front.rect(w.x + w.s.w - 1, w.y + w.s.hand[1] - 4, 4, 5, P.light(P.trunk, 0.3)); c.front.rect(w.x + w.s.w, w.y + w.s.hand[1] - 3, 2, 3, moWhite(P));
  if (job === 'doctor') { c.front.px(w.x + 3, w.y + w.s.hand[1] - 2, P.ol); c.front.px(w.x + 4, w.y + w.s.hand[1] - 1, P.ol); }
  moSpan(c, MO_CX - 34, w.x + w.s.w + 4);
};
MO_W.field = (c, job) => {
  const P = c.P, wet = c.m.region === 'sa' || c.m.region === 'eap'; moSky(c, 'd'); moFar(c); moGrass(c);
  const r = c.mid; r.rect(0, PX.G - 3, PX.W, PX.H - PX.G + 3, wet ? pxMix(P.water, P.grass, 0.35) : P.soil);
  for (let k = 0; k < 5; k++) { const y = PX.G - 2 + k * 3; if (!wet) r.rect(0, y + 1, PX.W, 1, P.soil2); for (let x = (k % 2) * 3; x < PX.W; x += 6) { r.px(x, y, P.tree2); r.px(x - 1, y - 1, P.tree); r.px(x + 1, y - 1, P.tree); r.px(x, y - 2 - (k === 0 ? 1 : 0), P.treehi); } }
  if (wet) for (let x = 0; x < PX.W; x += 4) r.px(x, PX.G + 6 + (x % 3) * 3, P.light(P.water2 || P.win, 0.4));
  moTreeBig(c, 30, PX.G - 3); moTreeBig(c, 172, PX.G - 3);
  const w = moWorker(c, { hat: 'straw' }, MO_CX - 4, PX.G - 17 + 1 - 2);
  const hx = w.x + w.s.w, hy = w.y + w.s.hand[1]; c.front.line(hx, hy - 4, hx + 4, PX.G + 2, P.trunk); c.front.rect(hx + 3, PX.G + 2, 4, 1, P.metal);
  const bk = pxSprite(['.TTTTT.', 'TGgGgGT', 'TTTTTTT', '.TTTTT.'], { T: P.thatch, G: P.accent, g: P.tree }); moPut(c, bk, w.x - 12, PX.G - 3);
  moSpan(c, w.x - 14, hx + 8);
};
MO_W.herd = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); moGrass(c); moTreeBig(c, 40, PX.G); moTreeBig(c, 168, PX.G);
  const w = moWorker(c, { hat: 'straw' }, MO_CX - 22, null); c.front.line(w.x + w.s.w, w.y + 3, w.x + w.s.w + 1, PX.G, P.trunk);
  const sheep = pxSprite(['.WWWW...', 'WWWWWWK.', 'WWWWWWKK', 'WWWWWW..', '.K..K...'], { W: P.light(P.wall, 0.45), K: P.ol }), goat = pxSprite(['K......', 'KBBBBB.', '.BBBBBK', '.BBBBBB', '.B..B..'], { B: P.trunk, K: P.ol });
  [[MO_CX - 4, sheep], [MO_CX + 8, goat], [MO_CX + 18, sheep], [MO_CX + 6, sheep]].forEach(([x, sp], i) => moPut(c, sp, x, PX.G - sp.h + (i === 3 ? 4 : 0)));
  moSpan(c, w.x - 2, MO_CX + 28);
};
MO_W.sea = (c, job) => {
  const P = c.P; moSky(c, 'm');
  const r = c.mid; r.rect(0, 32, PX.W, PX.H - 32, P.water); for (let x = 0; x < PX.W; x++) { if ((x * 7) % 13 < 3) r.px(x, 34 + (x % 5) * 4, P.water2); } r.rect(0, 32, PX.W, 1, P.light(P.water2, 0.3));
  for (let i = 0; i < 3; i++) { const bx = 40 + i * 50, by = 10 + (i % 2) * 4; c.sky.px(bx - 1, by - 1, P.ol); c.sky.px(bx, by, P.ol); c.sky.px(bx + 1, by - 1, P.ol); }
  const w = moWorker(c, { hat: 'cap', cap: P.gold }, MO_CX - 6, 34 - 17 + 9);
  const boat = new PxR(46, 9); for (let j = 0; j < 9; j++) boat.rect(Math.max(0, j - 3), j, 46 - Math.max(0, j - 3) * 2, 1, j < 2 ? P.light(P.brick, 0.2) : P.brick); boat.rect(4, 3, 38, 1, P.shade(P.brick, 0.2));
  c.front.blit(boat, MO_CX - 23, PX.G - 8, P.ol);
  for (let t = 0; t < 12; t++) for (let u = 0; u < 6; u++) if ((t + u) % 2 === 0) c.front.px(w.x + w.s.w + 2 + t, w.y + w.s.hand[1] - 2 + u, P.light(P.wall3, 0.2));
  c.front.rect(w.x + w.s.w + 6, w.y + w.s.hand[1] + 2, 4, 1, P.light(P.metal, 0.5)); c.front.rect(w.x + w.s.w + 9, w.y + w.s.hand[1] + 4, 3, 1, P.light(P.metal, 0.5));
  moSpan(c, MO_CX - 24, MO_CX + 24);
};
MO_W.market = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); moPave(c);
  const r = c.mid, x0 = MO_CX - 26, w = 52;
  for (let x = x0; x < x0 + w; x++) { const col = ((x - x0) >> 2) % 2 ? P.wall : P.accent; r.rect(x, 12, 1, 4, col); if ((x - x0) % 4 < 2) r.px(x, 16, col); }
  r.rect(x0 + 1, 17, 1, PX.G - 17, P.trunk); r.rect(x0 + w - 2, 17, 1, PX.G - 17, P.trunk);
  for (const nx of [x0 - 34, x0 + w + 8]) { for (let x = nx; x < nx + 26; x++) { const col = ((x - nx) >> 2) % 2 ? P.wall : P.stamp; r.rect(x, 18, 1, 3, col); } r.rect(nx + 1, 21, 1, PX.G - 21, P.trunk); r.rect(nx + 24, 21, 1, PX.G - 21, P.trunk); r.rect(nx, PX.G - 10, 26, 2, P.trunk); }
  const me = moFig(c.cast.me, P, { top: c.a[1] === 'rank' ? undefined : undefined }); moPut(c, me, MO_CX - 4, PX.G - me.h - 4 + 1); moSpan(c, x0, x0 + w);
  const f = c.front; f.rect(x0 + 2, PX.G - 12, w - 4, 2, P.trunk); f.rect(x0 + 3, PX.G - 10, w - 6, 10, P.shade(P.trunk, 0.15));
  for (let i = 0; i < 12; i++) { const col = [P.accent, P.gold, P.tree, moRGB('#E07A3A')][i % 4]; f.disc(x0 + 6 + i * 3.6, PX.G - 14, 1, col); }
  const cu = moFig(moGen(c, 'pt', null, 40), P, {}); moPut(c, cu, x0 - 4, PX.G - cu.h); moSpan(c, x0 - 6, x0 + w);
  if (c.a[1] === 'ret') moBouquet(c, MO_CX + 6, PX.G - 16);
};
MO_W.site = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c);
  const r = c.mid; r.rect(0, PX.G, PX.W, PX.H - PX.G, P.light(P.soil, 0.15)); for (let x = 0; x < PX.W; x++) if (c.R() < 0.2) r.px(x, PX.G + 1 + c.R() * 10, P.stone);
  for (let y = PX.G - 40; y < PX.G; y += 8) r.rect(110, y, 50, 1, P.metal); for (let x = 110; x <= 160; x += 10) r.rect(x, PX.G - 40, 1, 40, P.metal); r.rect(112, PX.G - 24, 46, 8, P.light(P.brick, 0.15));
  for (let y = PX.G - 50; y < PX.G; y++) { r.px(40, y, P.crane); r.px(43, y, P.crane); if ((y & 3) === 0) r.line(40, y, 43, y + 3, P.crane); } r.rect(26, PX.G - 51, 60, 2, P.crane); r.line(80, PX.G - 49, 80, PX.G - 34, P.ol); r.rect(76, PX.G - 34, 9, 3, P.wall3);
  const w = moWorker(c, Object.assign({ hat: 'hard' }, moWear('vest', P)), MO_CX - 6, null);
  c.front.line(w.x + w.s.w, w.y + w.s.hand[1] - 3, w.x + w.s.w + 3, PX.G - 1, P.trunk); c.front.rect(w.x + w.s.w + 2, PX.G - 2, 3, 2, P.metal);
  const m2 = moFig(moGen(c, 'sib', 'M', c.cast.me.age + 5), P, Object.assign({ hat: 'hard', cap: P.light(P.crane, 0.25) }, { top: P.light(P.accent, 0.2) })); moPut(c, m2, MO_CX + 16, PX.G - m2.h);
  moSpan(c, w.x - 6, MO_CX + 28);
};
MO_W.factory = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.wall3, 0.3), floor: 'tile', plain: true });
  const r = c.mid; for (let x = 12; x < 180; x += 28) { r.rect(x, 6, 20, 14, P.light(P.win, 0.25)); r.rect(x + 10, 6, 1, 14, P.metal); }
  r.rect(26, PX.G - 22, 22, 20, P.metal); r.rect(29, PX.G - 19, 6, 4, P.light(P.water, 0.4)); r.px(42, PX.G - 18, P.accent); r.px(44, PX.G - 18, P.tree); r.rect(150, PX.G - 26, 24, 24, P.metal); r.rect(154, PX.G - 22, 16, 8, P.shade(P.metal, 0.3));
  const w = moWorker(c, Object.assign({ hat: 'cap', cap: P.stamp }, moWear('vest', P)), MO_CX - 4, PX.G - 17 - 2);
  const f = c.front, by = PX.G - 6; f.rect(MO_CX - 40, by, 80, 3, P.wall3); f.rect(MO_CX - 40, by + 3, 80, 1, P.shade(P.wall3, 0.3)); for (let x = MO_CX - 40; x < MO_CX + 40; x += 6) f.disc(x + 3, by + 1, 1, P.metal);
  for (const bx of [MO_CX - 34, MO_CX - 18, MO_CX + 12, MO_CX + 28]) { f.rect(bx, by - 5, 7, 5, P.light(P.trunk, 0.35)); f.rect(bx, by - 3, 7, 1, P.shade(P.trunk, 0.1)); }
  for (let x = MO_CX - 38; x < MO_CX + 40; x += 18) f.rect(x, by + 4, 2, PX.G - by + 2, P.shade(P.metal, 0.2));
  moSpan(c, MO_CX - 40, MO_CX + 40);
};
MO_W.road = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); const r = c.mid;
  r.rect(0, PX.G - 2, PX.W, 3, P.pave); r.rect(0, PX.G + 1, PX.W, PX.H - PX.G - 1, P.road); for (let x = 3; x < PX.W; x += 12) r.rect(x, PX.G + 6, 6, 1, P.roadline);
  if (job === 'delivery') {
    const bx = MO_CX - 10, wy = PX.G + 3; c.front.blit(pxMoto(P, true), bx, wy - 6, null);
    const s = moFig(c.cast.me, P, { pose: 'sit', hat: 'cap', cap: P.accent }); moPut(c, s, bx + 4, wy - 4 - s.h + 2); moSpan(c, bx - 2, bx + 18);
    return;
  }
  const T = new PxR(44, 22); T.rect(0, 2, 30, 16, P.wall2); T.rect(30, 6, 13, 12, P.accent); T.rect(32, 8, 7, 5, P.win); T.rect(0, 17, 44, 2, P.shade(P.wall2, 0.3)); T.rect(43, 14, 1, 2, P.gold);
  c.front.blit(T, MO_CX - 22, PX.G - 19, P.ol); for (const wx of [MO_CX - 14, MO_CX + 14]) { c.front.disc(wx, PX.G + 1, 3, P.ol); c.front.px(wx, PX.G + 1, P.metal); }
  const s = moFig(c.cast.me, P, { pose: 'wave' }), cut = new PxR(s.w, 7); for (let j = 0; j < 7; j++) for (let i = 0; i < s.w; i++) cut.d[j * s.w + i] = s.get(i, j);
  c.front.blit(cut, MO_CX + 10 - (s.ox || 0), PX.G - 19 + 7, null); c.front.rect(MO_CX + 10, PX.G - 19 + 14, 7, 1, P.accent);
  moSpan(c, MO_CX - 22, MO_CX + 22);
};
MO_W.kitchen = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.wall, 0.5), floor: 'tile', plain: true });
  const r = c.mid; for (let y = 4; y < PX.G - 12; y += 4) for (let x = (y % 8 ? 0 : 4); x < PX.W; x += 8) r.rect(x, y, 7, 3, P.light(P.water, 0.62));
  for (let i = 0; i < 4; i++) { const x = 40 + i * 8; r.rect(x, 6, 1, 6, P.metal); r.disc(x, 13, 2, P.shade(P.metal, 0.2)); }
  const w = moWorker(c, Object.assign({ hat: 'chef' }, moWear('chef', P)), MO_CX - 4, PX.G - 17 - 2);
  const f = c.front; f.rect(MO_CX - 30, PX.G - 7, 60, 7, P.metal); f.rect(MO_CX - 30, PX.G - 7, 60, 1, P.light(P.metal, 0.4));
  for (const px of [MO_CX - 24, MO_CX + 14]) { f.rect(px, PX.G - 12, 10, 5, P.shade(P.metal, 0.25)); f.rect(px - 1, PX.G - 12, 12, 1, P.ol); for (let k = 0; k < 3; k++) { f.px(px + 2 + k * 3, PX.G - 15 - (k % 2), P.light(P.smoke, 0.5)); f.px(px + 3 + k * 3, PX.G - 17, P.light(P.smoke, 0.6)); } f.rect(px + 2, PX.G - 6, 6, 1, moRGB('#F2A23A')); }
  moSpan(c, MO_CX - 30, MO_CX + 30);
};
MO_W.studio = (c, job) => {
  const P = c.P; moRoom(c, { win: [[22, 26]], frames: [150, 164], plain: true });
  const r = c.front, ex = MO_CX + 8;
  if (job === 'creator') { r.line(ex + 4, PX.G - 1, ex + 4, PX.G - 18, P.ol); r.line(ex, PX.G - 1, ex + 4, PX.G - 8, P.ol); r.line(ex + 8, PX.G - 1, ex + 4, PX.G - 8, P.ol); r.rect(ex + 1, PX.G - 22, 7, 5, P.ol); r.px(ex + 4, PX.G - 20, P.water); r.disc(ex + 16, PX.G - 24, 5, P.light(P.wall, 0.8)); r.disc(ex + 16, PX.G - 24, 3, P.light(P.wall, 0.4)); r.line(ex + 16, PX.G - 19, ex + 16, PX.G - 1, P.metal); }
  else { r.line(ex, PX.G - 1, ex + 6, PX.G - 24, P.trunk); r.line(ex + 12, PX.G - 1, ex + 6, PX.G - 24, P.trunk); r.blit(pxSprite(['WWWWWWWWWWWW', 'WSSSSSSSSWWW', 'WSSGSSSSSSWW', 'WSGGGSSTTSSW', 'WTTTTTTTTTTW', 'WTTTTGGTTTTW', 'WWWWWWWWWWWW'], { W: P.light(P.wall, 0.4), S: moRGB(P.sky.d[0]), G: P.gold, T: P.tree }), ex, PX.G - 22, P.ol); }
  const w = moWorker(c, {}, MO_CX - 14, null); if (job !== 'creator') r.line(w.x + w.s.w, w.y + w.s.hand[1], w.x + w.s.w + 3, w.y + w.s.hand[1] - 4, P.trunk);
  for (let i = 0; i < 3; i++) { const cx = 40 + i * 10; r.rect(cx, PX.G - 12, 8, 12, P.light(P.wall, 0.4)); r.rect(cx + 1, PX.G - 11, 6, 10, [P.water, P.accent, P.gold][i]); }
  moSpan(c, w.x - 2, ex + (job === 'creator' ? 22 : 14));
};
MO_W.stage = (c, job) => {
  const P = c.P; moSky(c, 'night'); const r = c.mid;
  for (let k = 0; k < 4; k++) { const x0 = 30 + k * 44; for (let y = 0; y < PX.G; y++) { const w = 2 + y / 5; for (let i = -w; i <= w; i++) r.dither(Math.round(x0 + (MO_CX - x0) * y / PX.G + i), y, moRGB(k % 2 ? '#F6E7B0' : '#BFD8F0'), 0.18); } }
  r.rect(0, PX.G - 2, PX.W, PX.H - PX.G + 2, P.shade(P.trunk, 0.35)); r.rect(0, PX.G - 2, PX.W, 1, P.light(P.trunk, 0.1));
  const w = moWorker(c, { pose: c.a[1] === 'rank' ? 'up' : 'wave', top: job === 'idol' ? P.light(P.accent, 0.15) : undefined }, MO_CX - 4, PX.G - 2 - 17 + 1);
  c.front.line(MO_CX - 7, PX.G - 2, MO_CX - 7, PX.G - 14, P.metal); c.front.rect(MO_CX - 8, PX.G - 16, 3, 2, P.ol);
  if (job === 'musician') { const g = moFig(moGen(c, 'sib', null, c.cast.me.age), P, {}); moPut(c, g, MO_CX + 16, PX.G - 2 - g.h); c.front.rect(MO_CX + 15, PX.G - 9, 6, 3, P.gold); c.front.line(MO_CX + 21, PX.G - 8, MO_CX + 26, PX.G - 13, P.trunk); }
  for (let x = 4; x < PX.W; x += 6) { const h = 3 + (x * 7 % 3); c.front.disc(x, PX.H - h + 2, 2, P.ol); if ((x / 6 | 0) % 3 === 0) { c.front.px(x + 1, PX.H - h - 3, moRGB(['#FFD86A', '#7FE0F0', '#F28AB0'][(x / 18 | 0) % 3])); c.front.px(x + 1, PX.H - h - 2, P.ol); } }
  moSpan(c, MO_CX - 14, MO_CX + 28);
};
MO_W.sport = (c, job) => {
  const P = c.P; moSky(c, 'd'); const r = c.back; r.rect(0, 22, PX.W, PX.G - 22, P.light(P.wall3, 0.2)); for (let y = 24; y < PX.G - 2; y += 3) for (let x = (y % 6) ? 0 : 2; x < PX.W; x += 4) r.px(x, y, [P.accent, P.water, P.gold, P.light(P.wall, 0.6)][(x + y) % 4]);
  moGrass(c); const g = c.mid; g.rect(0, PX.G + 4, PX.W, 1, P.light(P.wall, 0.7)); g.disc(MO_CX, PX.G + 9, 6, P.grasshi); g.disc(MO_CX, PX.G + 9, 5, P.grass);
  const w = moWorker(c, { pose: c.a[1] === 'rank' ? 'up' : 'up', top: job === 'coach' ? P.stamp : P.accent }, MO_CX - 4, null);
  c.front.disc(w.x + w.s.w + 5, PX.G - 2, 2, P.light(P.wall, 0.85)); c.front.px(w.x + w.s.w + 5, PX.G - 2, P.ol);
  if (job === 'coach' || job === 'trainer') for (let i = 0; i < 3; i++) { const k = moFig(moGen(c, 'kid', null, 12), P, { top: P.accent }); moPut(c, k, MO_CX + 16 + i * 10, PX.G - k.h); }
  moSpan(c, w.x - 4, MO_CX + (job === 'coach' ? 46 : 16));
};
MO_W.church = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.stone, 0.45), floor: 'tile', plain: true });
  const r = c.mid; for (const x of [40, MO_CX - 7, 140]) { r.rect(x, 8, 14, 24, P.shade(P.stone, 0.1)); r.disc(x + 7, 9, 7, P.shade(P.stone, 0.1)); for (let j = 0; j < 22; j++) for (let i = 1; i < 13; i++) r.px(x + i, 9 + j, [moRGB('#5F8FD0'), moRGB('#E85A4F'), moRGB('#F6D365'), moRGB('#6FBF73')][((i >> 2) + (j >> 2)) % 4]); r.disc(x + 7, 9, 5, moRGB('#F6D365')); }
  const w = moWorker(c, { top: P.light(P.ol, 0.12), dress: P.light(P.ol, 0.12), bot: P.light(P.ol, 0.12) }, MO_CX - 4, PX.G - 17 - 4);
  c.front.rect(w.x + 3, w.y + 9, 3, 1, moWhite(P));
  const f = c.front; f.rect(MO_CX - 18, PX.G - 9, 36, 9, moWhite(P)); f.rect(MO_CX - 18, PX.G - 9, 36, 1, P.gold); f.rect(MO_CX - 1, PX.G - 6, 2, 4, P.gold);
  for (const cx of [MO_CX - 14, MO_CX + 13]) { f.rect(cx, PX.G - 14, 1, 5, moWhite(P)); f.px(cx, PX.G - 15, moRGB('#FFB43A')); }
  for (let x = 20; x < PX.W - 10; x += 11) if (Math.abs(x - MO_CX) > 24) { f.disc(x, PX.H - 2, 2, P.light(P.hair, 0.15)); f.rect(x - 3, PX.H - 1, 7, 1, P.light(P.hair, 0.1)); }
  moSpan(c, MO_CX - 20, MO_CX + 20);
};
MO_W.base = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); moPave(c);
  const b = pxHouse(P, 40, 12, 4, P.wall3, P.light(P.tree2, 0.3), {}); c.mid.blit(b, 120, PX.G - b.h, P.ol);
  c.mid.line(60, PX.G - 1, 60, PX.G - 34, P.metal); c.mid.rect(61, PX.G - 34, 10, 6, P.accent); c.mid.rect(61, PX.G - 31, 10, 1, P.light(P.wall, 0.7));
  const uni = job === 'police' ? { top: moNavy(P), bot: moNavy(P), hat: 'mil', cap: moNavy(P) } : job === 'guard' ? { top: moNavy(P), hat: 'cap', cap: moNavy(P) } : Object.assign({ hat: 'mil' }, moWear('mil', P));
  const w = moWorker(c, Object.assign({ pose: 'wave' }, uni), MO_CX - 4, null);
  for (const dx of [-16, 14]) { const s = moFig(moGen(c, 'sib', job === 'soldier' || job === 'service' ? 'M' : null, c.cast.me.age + 1), P, uni); moPut(c, s, MO_CX + dx, PX.G - s.h); }
  if (job === 'police') { const car = pxCar(P, P.light(P.wall, 0.8)); c.mid.blit(car, MO_CX + 30, PX.G - 7, P.ol); c.mid.rect(MO_CX + 35, PX.G - 8, 2, 1, P.accent); c.mid.rect(MO_CX + 37, PX.G - 8, 2, 1, P.water); }
  moSpan(c, MO_CX - 18, MO_CX + 24);
};
MO_W.house = (c, job) => {
  const P = c.P; moRoom(c, { win: [[30, 22]], frames: [140], plain: false });
  const r = c.mid; r.line(110, 8, 180, 10, P.ol); [P.accent, P.water, P.gold, P.light(P.wall, 0.7)].forEach((col, i) => { const x = 116 + i * 15; r.rect(x, 10, 9, 8 + (i % 2) * 3, col); r.px(x + 2, 9, P.ol); r.px(x + 6, 9, P.ol); });
  const w = moWorker(c, {}, MO_CX - 4, null); c.front.line(w.x + w.s.w + 1, w.y + 6, w.x + w.s.w + 5, PX.G, P.trunk); c.front.rect(w.x + w.s.w + 2, PX.G - 1, 7, 1, P.light(P.thatch, 0.1));
  const bk = pxSprite(['.WWWWW.', 'WwWWWwW', 'WWWWWWW', '.WWWWW.'], { W: P.light(P.wall3, 0.3), w: P.light(P.wall, 0.8) }); moPut(c, bk, w.x - 14, PX.G - 4);
  moSpan(c, w.x - 16, w.x + w.s.w + 10);
};
MO_W.sky = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); moPave(c);
  moPlane(c, 104, PX.G - 20, c.mid, 2); for (const x of [112, 120]) { c.mid.rect(x, PX.G - 14, 1, 14, P.metal); }
  c.mid.rect(100, PX.G - 14, 50, 1, P.shade(P.wall, 0.2));
  const uni = { top: moNavy(P), bot: moNavy(P), dress: moNavy(P), hat: job === 'pilot' ? 'mil' : undefined, cap: moNavy(P) };
  moWorker(c, Object.assign({ pose: 'wave' }, uni), MO_CX - 20, null); moSuitcase(c, MO_CX - 28, PX.G, P.ol);
  const m2 = moFig(moGen(c, 'sib', null, c.cast.me.age + 2), P, uni); moPut(c, m2, MO_CX - 6, PX.G - m2.h);
  moSpan(c, MO_CX - 30, MO_CX + 6);
};
MO_W.space = (c, job) => {
  const P = c.P, r = c.sky; r.rect(0, 0, PX.W, PX.H, moRGB('#0B1020')); fxStars(c, 60);
  for (let x = 0; x < PX.W; x++) { const y = Math.round(PX.G + 2 + ((x - 96) * (x - 96)) / 900); for (let j = y; j < PX.H; j++) r.px(x, j, (x + j) % 9 < 5 ? moRGB('#3E7CC0') : moRGB('#5AA36A')); r.px(x, y, moRGB('#A8D8F0')); }
  const s = moFig(c.cast.me, P, { pose: 'wave', top: moWhite(P), bot: moWhite(P), dress: moWhite(P) }); const x = MO_CX - 4, y = 14; moPut(c, s, x, y);
  c.front.disc(x + ((s.hw || 9) >> 1) + (s.ox || 0), y + 4, 6, null); for (let a = 0; a < 40; a++) { const t = a / 40 * Math.PI * 2; c.front.px(Math.round(x + 4 + (s.ox || 0) + Math.cos(t) * 6), Math.round(y + 4 + Math.sin(t) * 6), P.light(P.wall, 0.7)); }
  c.front.rect(MO_CX + 20, 18, 30, 4, P.metal); c.front.rect(MO_CX + 28, 10, 2, 20, P.metal); for (let i = 0; i < 4; i++) c.front.rect(MO_CX + 52 + i * 6, 14, 5, 12, moRGB('#2C4A8A'));
  moSpan(c, MO_CX - 10, MO_CX + 30);
};
MO_W.hall = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.trunk, 0.55), floor: 'wood', plain: true });
  const r = c.mid; for (let x = 6; x < PX.W; x += 22) { r.rect(x, 4, 4, PX.G - 6, P.light(P.trunk, 0.35)); } r.rect(MO_CX - 4, 6, 9, 6, P.gold); r.disc(MO_CX, 9, 2, P.light(P.gold, 0.4));
  for (let k = 0; k < 2; k++) for (let x = 10 + k * 5; x < PX.W - 8; x += 11) if (Math.abs(x - MO_CX) > 18) { c.front.disc(x, PX.H - 2 - k * 5, 2, [P.light(P.hair, 0.15), P.hairold][(x + k) % 2]); c.front.rect(x - 3, PX.H - 1 - k * 5, 7, 1, P.light(P.hair, 0.1)); }
  const w = moWorker(c, Object.assign({ pose: 'wave' }, moWear('suit', P)), MO_CX - 4, PX.G - 17 - 4);
  const f = c.front; f.rect(MO_CX - 9, PX.G - 9, 18, 9, P.light(P.trunk, 0.15)); f.rect(MO_CX - 9, PX.G - 9, 18, 1, P.gold); f.rect(MO_CX - 2, PX.G - 6, 4, 3, P.gold);
  f.line(MO_CX + 6, PX.G - 9, MO_CX + 3, PX.G - 14, P.metal); f.rect(MO_CX + 2, PX.G - 15, 2, 2, P.ol);
  moSpan(c, MO_CX - 14, MO_CX + 14);
};
function moTripWho(c, who) {
  const k = c.cast, me = k.me;
  if (who === 'pt' && k.pt.length) return [k.pt[0]];
  if (who === 'fam') return [...k.pt, ...k.kids.filter(p => p.age < 18).slice(0, 3)];
  if (who === 'fr') return [moGen(c, 'sib', null, me.age + 1), moGen(c, 'inlaw', null, me.age - 1)];
  if (who === 'par') return k.par.length ? k.par.slice(0, 2) : [moGen(c, 'par', 'F', me.age + 28), moGen(c, 'par', 'M', me.age + 30)];
  return [];
}
MO.trip = c => {
  const P = c.P, k = c.cast, place = c.a[0] || 'beach', reg = c.a[1] || c.m.region, who = c.a[2] || 'solo';
  const cm = Object.assign({}, c.m, { region: reg, urban: false }), c2 = Object.assign({}, c, { m: cm });
  (MO_T[place] || MO_T.beach)(c2, reg);
  c.span = c2.span;
  const others = moTripWho(c, who), solo = !others.length;
  const ppl = moAround({ s: moFig(k.me, P, { pose: place === 'mount' ? 'up' : solo ? 'wave' : 'up', hat: place === 'beach' && k.me.age >= 13 ? 'cap' : undefined, cap: P.gold }), dy: 1 },
    others.map((p, i) => ({ s: moFig(p, P, { pose: i % 2 ? 'wave' : '' }) })));
  const gy = c2.gy || PX.G; moRow(c, ppl, c2.gx || MO_CX, gy, 2);
  if (solo) { const r = c.front, x = c.span[1] + 1, y = gy - 10; r.rect(x, y, 3, 2, P.ol); r.px(x + 1, y - 1, P.ol); }
  if (place !== 'mount') moSuitcase(c, c.span[0] - 7, gy, P.accent);
};
const MO_T = {};
MO_T.beach = (c, reg) => {
  const P = c.P; moSky(c, 'd'); const r = c.mid, hz = 30;
  c.back.rect(0, hz, PX.W, PX.G - hz, P.water); for (let x = 0; x < PX.W; x++) { if ((x * 11) % 17 < 3) c.back.px(x, hz + 3 + (x % 4) * 3, P.water2); } c.back.rect(0, hz, PX.W, 1, P.light(P.water2, 0.4));
  c.back.disc(150, hz, 4, P.hill2); c.back.rect(146, hz, 9, 1, P.hill2);
  r.rect(0, PX.G - 6, PX.W, PX.H - PX.G + 6, P.sand); for (let x = 0; x < PX.W; x++) { r.px(x, PX.G - 6, P.light(P.water2, 0.5)); if (c.R() < 0.15) r.px(x, PX.G - 4 + c.R() * 12, P.sand2); }
  for (let x = 0; x < PX.W; x += 3) r.px(x, PX.G - 7, P.light(P.wall, 0.8));
  if (reg !== 'hi' && reg !== 'eca') { pxTree(r, 24, PX.G - 2, 'palm', P); pxTree(r, 36, PX.G, 'palm', P); }
  const ux = MO_CX - 34; for (let j = 0; j < 4; j++) for (let i = -8 + j * 2; i <= 8 - j * 2; i++) c.front.px(ux + i, PX.G - 22 + (3 - j), ((i + 8) >> 2) % 2 ? P.light(P.wall, 0.85) : P.accent);
  c.front.line(ux, PX.G - 22, ux, PX.G - 1, P.ol); c.front.rect(ux - 6, PX.G - 1, 12, 2, P.light(P.water, 0.3));
  const cs = c.front, sx = MO_CX + 30; cs.rect(sx, PX.G - 4, 8, 4, P.sand2); cs.rect(sx + 1, PX.G - 6, 2, 2, P.sand2); cs.rect(sx + 5, PX.G - 6, 2, 2, P.sand2); cs.px(sx + 2, PX.G - 8, P.accent);
  for (let i = 0; i < 3; i++) { const bx = 60 + i * 14, by = 8 + (i % 2) * 3; c.sky.px(bx - 1, by - 1, P.ol); c.sky.px(bx, by, P.ol); c.sky.px(bx + 1, by - 1, P.ol); }
  c.gy = PX.G + 2;
};
MO_T.mount = (c, reg) => {
  const P = c.P; moSky(c, 'm'); const r = c.back, snow = P.light(P.wall, 0.85);
  for (const [px, ph, pw] of [[40, 34, 40], [100, 42, 52], [160, 30, 40]]) for (let y = 0; y < ph; y++) { const w = Math.round(pw * y / ph); for (let i = -w; i <= w; i++) r.px(px + i, PX.G - 8 - ph + y, y < ph * 0.28 ? snow : i < 0 ? P.far2 : P.far1); }
  pxHills(c.mid, P, c.R, 0.05, PX.G - 2, 5, P.hill2, P.light(P.hill2, 0.15));
  const g = c.mid; g.rect(0, PX.G, PX.W, PX.H - PX.G, P.stone); for (let x = 0; x < PX.W; x++) if (c.R() < 0.3) g.px(x, PX.G + c.R() * 12, P.shade(P.stone, 0.2));
  for (const x of [20, 30, 168, 178]) pxTree(g, x, PX.G, 'pine', P);
  const fx = MO_CX + 22; c.front.rect(fx, PX.G - 22, 1, 22, P.ol); c.front.rect(fx + 1, PX.G - 22, 7, 4, P.accent); for (let i = 0; i < 4; i++) c.front.rect(fx - 3 + i, PX.G - 3 - i * 2, 7 - i * 2, 2, P.shade(P.stone, 0.1 + i * 0.05));
};
MO_T.city = (c, reg) => {
  const P = c.P; moSky(c, 'd'); const r = c.back, m = c.mid, G = PX.G;
  if (reg === 'eap') {
    const pg = P.shade(P.accent, 0.15); for (let t = 0; t < 4; t++) { const y = G - 10 - t * 8, w = 18 - t * 3; m.rect(132 - w, y - 1, w * 2, 2, P.ol); m.rect(132 - w + 2, y + 1, w * 2 - 4, 7, P.light(P.wall, 0.4)); } m.rect(131, G - 46, 2, 6, P.gold);
    const gx = 40; m.rect(gx, G - 26, 2, 26, pg); m.rect(gx + 20, G - 26, 2, 26, pg); m.rect(gx - 4, G - 28, 30, 2, pg); m.rect(gx - 2, G - 23, 26, 1, pg);
    for (const x of [22, 72, 168]) { m.rect(x, G - 6, 1, 6, P.trunk); for (let i = 0; i < 18; i++) m.disc(x + (c.R() - 0.5) * 10, G - 10 + (c.R() - 0.5) * 6, 1, P.light(P.accent, 0.55)); }
  } else if (reg === 'mena') {
    for (const [x, w] of [[30, 24], [120, 34]]) { r.rect(x, G - 16, w, 16, P.light(P.sand, 0.4)); r.disc(x + w / 2, G - 17, w / 3, P.light(P.sand, 0.4)); r.disc(x + w / 2, G - 17 - w / 3, 1, P.gold); }
    for (const x of [24, 58, 114, 160]) { r.rect(x, G - 34, 3, 34, P.light(P.sand, 0.3)); r.rect(x - 1, G - 30, 5, 1, P.light(P.sand, 0.15)); r.px(x + 1, G - 36, P.gold); }
    for (const x of [70, 176]) pxTree(m, x, G, 'palm', P);
  } else if (reg === 'sa') {
    const W = P.light(P.wall, 0.7); r.rect(66, G - 22, 60, 16, W); r.disc(96, G - 26, 11, W); r.disc(96, G - 38, 1, P.gold); for (const x of [72, 120]) r.disc(x, G - 24, 4, W); for (const x of [56, 136]) { r.rect(x, G - 34, 3, 28, W); r.px(x + 1, G - 36, P.gold); }
    for (let i = 0; i < 5; i++) r.rect(76 + i * 9, G - 15, 4, 7, P.shade(W, 0.12));
    m.rect(60, G + 2, 72, 3, P.water); for (const x of [46, 146, 30, 162]) { m.rect(x, G - 9, 3, 9, P.tree2); m.rect(x + 1, G - 11, 1, 2, P.tree2); }
  } else if (reg === 'lac') {
    const St = P.light(P.stone, 0.15); for (let t = 0; t < 6; t++) r.rect(96 - 30 + t * 5, G - 6 - t * 5, 60 - t * 10, 5, t % 2 ? St : P.shade(St, 0.08)); r.rect(93, G - 40, 6, 6, P.shade(St, 0.15)); r.rect(94, G - 39, 4, 5, P.ol);
    for (let i = 0; i < 6; i++) r.rect(94, G - 6 - i * 5, 4, 5, P.light(St, 0.1));
    for (const x of [20, 40, 152, 172]) pxTree(m, x, G, 'palm', P);
  } else if (reg === 'ssa') {
    pxHills(r, P, c.R, 0.03, G - 4, 4, P.light(P.sand, 0.1), null); for (const x of [30, 150]) pxTree(m, x, G, 'acacia', P);
    const Y = P.gold, B = P.shade(P.trunk, 0.05), gi = new PxR(10, 22); gi.rect(6, 0, 3, 2, Y); gi.rect(6, 2, 2, 10, Y); gi.rect(0, 11, 8, 5, Y); for (const lx of [0, 2, 5, 7]) gi.rect(lx, 16, 1, 6, Y); for (let i = 0; i < 6; i++) gi.px(1 + (i * 3) % 7, 12 + (i % 3), B); m.blit(gi, 140, G - 22, P.ol);
    const E = P.light(P.wall3, 0.15), el = new PxR(16, 11); el.rect(2, 0, 12, 7, E); el.rect(0, 1, 4, 6, P.shade(E, 0.1)); el.rect(0, 6, 1, 4, E); for (const lx of [3, 6, 10, 13]) el.rect(lx, 7, 2, 4, E); m.blit(el, 44, G - 11, P.ol);
  } else {
    for (let i = 0; i < 9; i++) { const x = 4 + i * 21, h = 18 + (i * 7) % 9, col = [P.light(P.gold, 0.4), P.light(P.accent, 0.5), P.light(P.water, 0.4), P.light(P.wall, 0.3)][i % 4]; if (Math.abs(x + 9 - 96) < 14) continue; r.rect(x, G - h, 18, h, col); for (let j = 0; j < 6; j++) r.rect(x + j, G - h - 1 - j, 18 - j * 2, 1, P.roof); for (let y = G - h + 3; y < G - 3; y += 5) for (let xx = x + 3; xx < x + 16; xx += 5) r.rect(xx, y, 2, 3, P.win); }
    const tx = 96; for (let y = 0; y < 44; y++) { const w = Math.round(1 + (y / 44) ** 2 * 12); r.px(tx - w, G - 44 + y, P.metal); r.px(tx + w, G - 44 + y, P.metal); if (y % 6 === 0) r.rect(tx - w, G - 44 + y, w * 2 + 1, 1, P.metal); } r.px(tx, G - 46, P.metal);
  }
  moPave(c);
};
MO_T.nature = (c, reg) => {
  const P = c.P; moSky(c, 'd'); const r = c.back, G = PX.G;
  for (const [px, ph, pw] of [[50, 26, 40], [140, 32, 46]]) for (let y = 0; y < ph; y++) { const w = Math.round(pw * y / ph); for (let i = -w; i <= w; i++) r.px(px + i, G - 14 - ph + y, i < 0 ? P.far2 : P.far1); }
  c.mid.rect(0, G - 14, PX.W, 10, P.water); for (let x = 0; x < PX.W; x++) if ((x * 7) % 11 < 2) c.mid.px(x, G - 12 + (x % 3) * 3, P.water2);
  moGrass(c, c.mid, G - 4); for (const x of [16, 26, 38, 158, 170, 182]) pxTree(c.mid, x, G - 3, reg === 'hi' || reg === 'eca' ? 'pine' : pxTreeKind(reg), P);
};
MO.fly = c => {
  const P = c.P, k = c.cast; moRoom(c, { wall: P.light(P.wall2, 0.3), floor: 'tile', plain: true });
  const r = c.mid; r.rect(10, 4, 172, 32, P.light(P.metal, 0.2)); for (let x = 11; x < 181; x += 17) { for (let y = 5; y < 35; y++) r.rect(x, y, 16, 1, pxMix(moRGB(P.sky.d[0]), moRGB(P.sky.d[1]), (y - 5) / 30)); }
  r.rect(11, 30, 170, 5, P.pave2); for (let x = 14; x < 180; x += 10) r.rect(x, 32, 5, 1, P.light(P.wall, 0.7));
  moPlane(c, 120, 14, r, 2); r.line(116, 20, 104, 26, P.light(P.wall, 0.5));
  r.rect(22, 38, 30, 7, P.ol); for (let i = 0; i < 3; i++) for (let x = 24; x < 50; x += 3) r.px(x, 39 + i * 2, x % 9 ? P.gold : P.tree);
  const goers = [k.me, ...k.pt, ...k.kids.filter(p => p.age < 18)].slice(0, 4), stay = k.me.age < 30 ? k.par.slice(0, 2) : [];
  const xs = moRow(c, goers.map(p => ({ s: moFig(p, P, { pose: p === k.me ? 'wave' : '' }), dy: p === k.me ? 1 : 0 })), MO_CX + 10);
  moSuitcase(c, c.span[1] + 2, PX.G, P.accent); moSuitcase(c, c.span[0] - 7, PX.G, P.stamp);
  let x = c.span[0] - 12; for (const p of stay) { const s = moFig(p, P, { pose: 'wave' }); x -= s.w + 2; moPut(c, s, x, PX.G - s.h); moSpan(c, x, c.span[1]); }
};
MO.back = c => {
  const P = c.P, k = c.cast; moSky(c, 'e'); moFar(c); moGrass(c);
  const h = pxHome(Object.assign({}, c.m, { home: c.m.home === 'flat' ? 'house' : c.m.home }), P, c.R); c.mid.blit(h, 20, PX.G - h.h, P.ol);
  moBunting(c, 10, 60, 150);
  const fam = [...k.par, ...k.sib, ...k.pt, ...k.kids].slice(0, 4); while (fam.length < 2) fam.push(moGen(c, 'sib', null, k.me.age + 25));
  moRow(c, [...fam.map(p => ({ s: moFig(p, P, { pose: 'up' }) })), { s: moFig(k.me, P, { pose: 'up' }), dy: 1, gap: 3 }], MO_CX + 6);
  moSuitcase(c, c.span[1] + 2, PX.G, P.accent); fxSpark(c, MO_CX + 6, 16, 3);
};
MO.home = c => {
  const P = c.P, k = c.cast; moSky(c, 'd'); moFar(c); moGrass(c);
  const hm = Object.assign({}, c.m, { stage: 'd' }), h = pxHome(hm, P, c.R); c.mid.blit(h, MO_CX - (h.w >> 1) + 30, PX.G - h.h, P.ol);
  moTreeBig(c, 26, PX.G); moTreeBig(c, 170, PX.G);
  const me = moFig(k.me, P, { pose: 'wave' }), row = moAround({ s: me, dy: 1 }, moFam(c, 4, { noPar: true }).map(p => ({ s: moFig(p, P, { pose: p.age < 13 ? 'up' : '' }) })));
  const xs = moRow(c, row, MO_CX - 14); const i = row.findIndex(x => x.s === me);
  c.front.rect(xs[i] + me.w - 1, PX.G - me.h + 1 - 1, 2, 3, P.gold); c.front.px(xs[i] + me.w, PX.G - me.h + 3, P.gold);
  const bx = c.span[0] - 18; for (const [dx, dy, w] of [[0, 0, 10], [10, 0, 8], [3, -6, 8]]) { c.front.rect(bx + dx, PX.G - 6 + dy, w, 6, P.light(P.trunk, 0.35)); c.front.rect(bx + dx + (w >> 1), PX.G - 6 + dy, 1, 6, P.light(P.sand, 0.5)); }
  moSpan(c, bx, c.span[1]); fxConfetti(c, 10, 30);
};
MO.car = c => {
  const P = c.P, k = c.cast, moto = c.a[0] === 'moto'; moSky(c, 'd'); moFar(c); moPave(c);
  const r = c.front, x = MO_CX + 2;
  if (moto) { const mt = pxMoto(P, false); r.blit(mt, x, PX.G - mt.h, null); }
  else { const C = P.accent, car = new PxR(32, 13); car.rect(8, 0, 14, 5, C); car.rect(10, 1, 4, 3, P.win); car.rect(15, 1, 5, 3, P.win); car.rect(0, 5, 32, 5, C); car.rect(0, 9, 32, 1, P.shade(C, 0.3)); car.rect(30, 6, 2, 2, P.gold); car.rect(0, 6, 1, 2, P.light(P.accent, 0.5)); r.blit(car, x, PX.G - 14, P.ol); for (const wx of [x + 7, x + 25]) { r.disc(wx, PX.G - 2, 2, P.ol); r.px(wx, PX.G - 2, P.metal); } const R2 = moRGB('#E04848'); r.rect(x + 14, PX.G - 14, 2, 10, R2); r.disc(x + 15, PX.G - 15, 2, R2); r.px(x + 15, PX.G - 15, P.light(R2, 0.4)); }
  const me = moFig(k.me, P, { pose: 'wave' }); moPut(c, me, x - me.w - 4, PX.G - me.h + 1); moSpan(c, x - me.w - 6, x + (moto ? 16 : 34));
  const o = moFam(c, 2, { noPar: true }); let xx = x - me.w - 6; for (const p of o) { const s = moFig(p, P, { pose: 'up' }); xx -= s.w + 2; moPut(c, s, xx, PX.G - s.h); moSpan(c, xx, c.span[1]); }
  fxSpark(c, x + 14, 18, 3);
};
MO.pet = c => {
  const P = c.P, k = c.cast, kind = c.a[0] || c.m.pet || 'd'; moSky(c, 'd'); moFar(c); moGrass(c);
  const h = pxHome(c.m, P, c.R); c.mid.blit(h, 18, PX.G - h.h, P.ol); moTreeBig(c, 170, PX.G);
  const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 8; moPut(c, me, x, PX.G - me.h);
  const pet = pxPet(kind, P); moPut(c, pet, x + me.w - 2, PX.G - pet.h);
  const o = moFam(c, 2); let xx = x - 2; for (const p of o) { const s = moFig(p, P, { pose: 'up' }); xx -= s.w + 2; moPut(c, s, xx, PX.G - s.h); }
  c.front.disc(x + me.w + pet.w + 6, PX.G - 2, 2, P.accent); c.front.px(x + me.w + pet.w + 5, PX.G - 3, P.light(P.accent, 0.5));
  fxHeart(c, x + me.w - 2, PX.G - me.h - 8); moSpan(c, xx, x + me.w + pet.w + 10);
};
MO.grand = c => {
  const P = c.P, k = c.cast, born = c.a[0] === 'new'; moRoom(c, { win: [[30, 22]], frames: [146, 160], lamp: 176 });
  const r = c.front, x0 = MO_CX - 26, w = 52; r.rect(x0, PX.G - 12, w, 3, P.light(P.accent, 0.35)); r.rect(x0, PX.G - 9, w, 6, P.light(P.accent, 0.25)); r.rect(x0 - 3, PX.G - 14, 4, 11, P.light(P.accent, 0.3)); r.rect(x0 + w - 1, PX.G - 14, 4, 11, P.light(P.accent, 0.3)); r.rect(x0 + 2, PX.G - 3, 2, 3, P.trunk); r.rect(x0 + w - 4, PX.G - 3, 2, 3, P.trunk);
  c.mid.rect(x0, PX.G - 22, w, 10, P.light(P.accent, 0.4));
  const gks = k.gk.length ? k.gk.slice(0, 3) : [moGen(c, 'kid', null, 6), moGen(c, 'kid', null, 3)];
  const me = moFig(k.me, P, born ? { pose: 'hold', bun: P.light(P.kid, 0.55) } : { pose: 'sit' });
  const items = [{ s: me, dy: -3 }, ...k.pt.slice(0, 1).map(p => ({ s: moFig(p, P, { pose: 'sit' }), dy: -3 })), ...gks.map(p => ({ s: moFig(p, P, { pose: p.age < 7 ? 'up' : 'sit' }), dy: p.age < 7 ? 0 : -3 }))];
  moRow(c, items, MO_CX, PX.G - 3 + 0, 1);
  r.rect(x0, PX.G - 9, w, 1, P.shade(P.light(P.accent, 0.25), 0.1));
  fxHeart(c, MO_CX - 2, 10);
};
MO.phone = c => {
  const P = c.P, k = c.cast, gift = c.a[0] === 'gift'; moRoom(c, { win: [[MO_CX - 2, 26]], frames: [40, 150] });
  const me = moFig(k.me, P, {}), x = MO_CX - 16; moPut(c, me, x, PX.G - me.h + 1);
  c.front.rect(x + me.w - 2, PX.G - me.h + 1 + 4, 2, 3, P.ol);
  c.front.blit(pxSprite(['.WWWWW.', 'WWWWWWW', 'WWWHWWW', 'WWWWWWW', '.WWWWW.', '....WW.', '.....W.'], { W: moWhite(P), H: P.light(P.accent, 0.1) }), x + me.w + 2, PX.G - me.h - 8, P.ol);
  if (gift) { const bx = x + me.w + 14; c.front.rect(bx, PX.G - 7, 9, 7, P.light(P.trunk, 0.35)); c.front.rect(bx + 4, PX.G - 7, 1, 7, P.accent); c.front.rect(bx, PX.G - 5, 9, 1, P.accent); c.front.px(bx + 3, PX.G - 8, P.accent); c.front.px(bx + 5, PX.G - 8, P.accent); }
  moSpan(c, x - 4, x + me.w + 24);
};
MO.photos = c => {
  const P = c.P, k = c.cast; moRoom(c, { lamp: MO_CX - 26 });
  const r = c.mid; for (let i = 0; i < 9; i++) { const x = 62 + (i % 5) * 14 + (i >= 5 ? 7 : 0), y = 8 + (i >= 5 ? 12 : 0); r.rect(x, y, 10, 8, P.trunk); r.rect(x + 1, y + 1, 8, 6, P.light(P.wall, 0.65)); r.rect(x + 3, y + 3, 4, 4, [P.me, P.kid, P.pt, P.accent][i % 4]); r.disc(x + 5, y + 3, 1, P.skin); }
  const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 6; const f = c.front;
  f.rect(x - 4, PX.G - 18, me.w + 8, 14, P.light(P.accent, 0.3)); moPut(c, me, x, PX.G - me.h - 2); f.rect(x - 5, PX.G - 9, 4, 9, P.light(P.accent, 0.2)); f.rect(x + me.w + 1, PX.G - 9, 4, 9, P.light(P.accent, 0.2)); f.rect(x - 3, PX.G - 4, me.w + 6, 4, P.light(P.accent, 0.25));
  f.rect(x + 1, PX.G - 10, 7, 3, moWhite(P)); f.rect(x + 4, PX.G - 10, 1, 3, P.shade(P.trunk, 0.2));
  if (k.pt.length) { const s = moFig(k.pt[0], P, {}); moPut(c, s, x + me.w + 8, PX.G - s.h); }
  moSpan(c, x - 8, x + me.w + 18);
};
MO.garden = c => {
  const P = c.P, k = c.cast; moSky(c, 'e'); moFar(c); moGrass(c);
  const r = c.mid; r.rect(50, PX.G - 2, 92, 8, P.soil); for (let i = 0; i < 4; i++) { r.rect(50, PX.G + i * 2, 92, 1, P.soil2); for (let x = 54 + (i % 2) * 3; x < 140; x += 7) { r.disc(x, PX.G - 3 + i * 2, 2, i % 2 ? P.tree : P.light(P.tree, 0.2)); if (i === 1) r.px(x + 1, PX.G - 4, P.accent); } }
  for (let x = 0; x < PX.W; x += 5) { r.rect(x, PX.G - 9, 1, 9, P.light(P.trunk, 0.3)); } r.rect(0, PX.G - 7, PX.W, 1, P.light(P.trunk, 0.3));
  const me = moFig(k.me, P, { hat: 'straw' }), x = MO_CX - 10; moPut(c, me, x, PX.G - me.h + 1);
  const bk = pxSprite(['.RGRYR.', 'TGRYGRT', 'TTTTTTT', '.TTTTT.'], { T: P.thatch, G: P.tree, R: P.accent, Y: P.gold }); moPut(c, bk, x + me.w, PX.G - me.h + 1 + me.hand[1] - 1);
  const nb = moFig(k.pt[0] || moGen(c, 'par', null, k.me.age + 2), P, { pose: 'wave' }); moPut(c, nb, x + me.w + 12, PX.G - nb.h);
  moSpan(c, x - 2, x + me.w + 12 + nb.w + 2);
};
MO.help = c => {
  const P = c.P, k = c.cast; moSky(c, 'd'); moFar(c); moPave(c);
  const h = pxHome(Object.assign({}, c.m, { home: c.m.urban ? 'flat' : c.m.home }), P, c.R); c.mid.blit(h, 14, PX.G - h.h, P.ol);
  const T = new PxR(40, 18); T.rect(0, 0, 28, 14, P.light(P.wall, 0.5)); T.rect(28, 4, 11, 10, P.stamp); T.rect(30, 6, 6, 4, P.win); T.rect(0, 13, 40, 2, P.shade(P.wall3, 0.2)); c.mid.blit(T, 128, PX.G - 17, P.ol); for (const wx of [136, 162]) { c.mid.disc(wx, PX.G - 1, 2, P.ol); }
  const me = moFig(k.me, P, {}), nb = moFig(moGen(c, 'par', null, k.me.age + 6), P, {}), x = MO_CX - 12;
  moPut(c, me, x, PX.G - me.h + 1); moPut(c, nb, x + me.w + 8, PX.G - nb.h);
  const by = PX.G - me.h + 1 + me.hand[1] - 4; c.front.rect(x + me.w - 2, by, 12, 6, P.light(P.trunk, 0.35)); c.front.rect(x + me.w + 3, by, 1, 6, P.light(P.sand, 0.5));
  const kid = moFig(moGen(c, 'kid', null, 6), P, { pose: 'wave' }); moPut(c, kid, x + me.w + nb.w + 12, PX.G - kid.h);
  moSpan(c, x - 2, x + me.w + nb.w + 20);
};
MO.fest = c => {
  const P = c.P, k = c.cast, sa = c.m.region === 'sa'; moSky(c, 'night'); moFar(c); moGrass(c);
  fxLanterns(c, 4, 10, 182); fxLanterns(c, 12, 30, 160, c.back);
  const ps = [k.me, ...moFam(c, 3)]; while (ps.length < 5) ps.push(moGen(c, 'sib', null, 10 + c.R() * 50));
  moRow(c, ps.map((p, i) => ({ s: moFig(p, P, { pose: i % 2 ? 'wave' : 'up' }), dy: (i % 2) - (p.role === 'me' ? 0 : 0) })), MO_CX, PX.G, 4);
  if (sa) for (let x = 20; x < PX.W; x += 14) { c.front.rect(x, PX.G - 2, 3, 2, P.shade(P.trunk, 0.1)); c.front.px(x + 1, PX.G - 3, moRGB('#FFD86A')); }
  else { const fx = c.span[1] + 10; c.front.rect(fx - 4, PX.G - 1, 9, 2, P.trunk); for (let j = 0; j < 8; j++) for (let i = -3 + (j >> 1); i <= 3 - (j >> 1); i++) c.front.px(fx + i, PX.G - 2 - j, j < 3 ? moRGB('#F2A23A') : moRGB('#FFD86A')); moSpan(c, c.span[0], fx + 6); }
  fxNote(c, MO_CX - 20, 18); fxNote(c, MO_CX + 18, 14);
};
MO.stars = c => {
  const P = c.P, k = c.cast; moSky(c, 'night'); fxStars(c, 90);
  for (let i = 0; i < 140; i++) { const t = c.R(), x = t * PX.W, y = 4 + t * 30 + (c.R() - 0.5) * 10; c.sky.dither(Math.round(x), Math.round(y), moRGB('#6B6E9A'), 0.6); }
  c.sky.line(150, 8, 162, 12, moRGB('#FFF4CF'));
  pxHills(c.mid, P, c.R, 0.04, PX.G - 3, 5, moRGB('#2A3A44'), null); c.mid.rect(0, PX.G, PX.W, PX.H - PX.G, moRGB('#24343A')); for (let x = 0; x < PX.W; x++) if (c.R() < 0.25) c.mid.px(x, PX.G - 1, moRGB('#2E4248'));
  const old = k.me.age < 13 ? (k.par[0] || moGen(c, 'par', 'M', 66)) : null, two = old ? [old, k.me] : [k.me, ...(k.gk[0] ? [k.gk[0]] : k.kids[0] ? [k.kids[0]] : k.pt.slice(0, 1))];
  moRow(c, two.map(p => ({ s: moFig(p, P, { pose: 'sit' }) })), MO_CX, PX.G - 1, 2);
  c.front.rect(c.span[0] - 3, PX.G - 2, c.span[1] - c.span[0] + 6, 2, P.light(P.accent, 0.2));
};
MO.rain = c => {
  const P = c.P, k = c.cast, snow = c.a[0] === 'snow';
  if (snow) { for (let y = 0; y < PX.H; y++) c.sky.rect(0, y, PX.W, 1, pxMix(P.light(P.wall3, 0.35), P.light(P.wall, 0.6), y / PX.G)); moFar(c); c.mid.rect(0, PX.G - 1, PX.W, PX.H - PX.G + 1, P.light(P.wall, 0.85)); for (let x = 0; x < PX.W; x += 4) c.mid.px(x, PX.G + 2 + (x % 7), P.light(P.wall3, 0.5)); }
  else { const sk = Object.assign({}, c.m, { mood: 'low', stage: 'd' }); pxSky(c.sky, sk, P, c.R); for (let i = 0; i < 5; i++) pxCloud(c.sky, Math.round(15 + i * 40), Math.round(14 + c.R() * 6), 26, P, c.R, true); moFar(c); moGrass(c); for (const x of [40, 70, 130, 160]) c.mid.rect(x, PX.G + 4, 10, 1, P.light(P.water, 0.4)); }
  const h = pxHome(c.m, P, c.R); c.mid.blit(h, 16, PX.G - h.h, P.ol);
  const ps = [k.me, ...moFam(c, 3)]; while (ps.length < 3) ps.push(moGen(c, 'kid', null, 8));
  moRow(c, ps.map(p => ({ s: moFig(p, P, { pose: 'up' }), dy: p.role === 'me' ? 1 : 0 })), MO_CX + 8, PX.G, 4);
  if (snow) { const x = c.span[1] + 8, W = P.light(P.wall, 0.9); c.front.disc(x, PX.G - 3, 3, W); c.front.disc(x, PX.G - 8, 2, W); c.front.px(x, PX.G - 8, P.gold); c.front.px(x - 1, PX.G - 9, P.ol); c.front.px(x + 1, PX.G - 9, P.ol); moSpan(c, c.span[0], x + 4); fxSnow(c, 60); }
  else fxRain(c, 90);
};
MO.talk = c => {
  const P = c.P, k = c.cast, w = c.a[0] || 'fr';
  const o = w === 'par' ? k.par[0] || moGen(c, 'par', 'F', k.me.age + 28) : w === 'pt' ? k.pt[0] || moGen(c, 'pt', null, k.me.age) : w === 'kid' ? k.kids[0] || moGen(c, 'kid', null, 16) : moGen(c, 'sib', null, k.me.age);
  moSky(c, 'dusk'); moFar(c); moGrass(c); moTreeBig(c, 40, PX.G, 'round'); moTreeBig(c, 156, PX.G, 'round');
  const by = PX.G - 6; moRow(c, [{ s: moFig(k.me, P, { pose: 'sit' }) }, { s: moFig(o, P, { pose: 'sit' }) }], MO_CX, by + 3, 2);
  const bx = c.span[0] - 4, bw = c.span[1] - c.span[0] + 8; c.front.rect(bx, by, bw, 2, P.trunk); c.front.rect(bx + 1, by + 2, 1, PX.G - by - 2, P.ol); c.front.rect(bx + bw - 2, by + 2, 1, PX.G - by - 2, P.ol);
  c.mid.rect(bx, by - 8, bw, 2, P.trunk);
  for (const cx of [MO_CX - 9, MO_CX + 7]) { c.front.rect(cx, by - 9, 2, 2, moWhite(P)); c.front.px(cx, by - 11, P.light(P.smoke, 0.5)); }
};
MO.mil = c => {
  const P = c.P, k = c.cast, out = c.a[0] === 'out'; moSky(c, 'd'); moFar(c); moPave(c);
  for (const x of [60, 132]) { c.mid.rect(x, PX.G - 20, 4, 20, P.wall3); c.mid.rect(x - 1, PX.G - 21, 6, 2, P.shade(P.wall3, 0.2)); }
  c.mid.rect(64, PX.G - 18, 68, 3, P.wall3); c.mid.line(150, PX.G - 1, 150, PX.G - 32, P.metal); c.mid.rect(151, PX.G - 32, 10, 6, P.accent); c.mid.rect(151, PX.G - 29, 10, 1, P.light(P.wall, 0.7));
  const me = moFig(k.me, P, Object.assign({ pose: 'wave', hat: 'mil' }, moWear('mil', P)));
  const fam = [...k.par, ...k.pt, ...k.sib].slice(0, 3);
  const xs = moRow(c, moAround({ s: me, dy: 1 }, fam.map(p => ({ s: moFig(p, P, { pose: out ? 'up' : 'wave' }) }))), MO_CX);
  if (out) { const i = Math.floor(fam.length / 2); moBouquet(c, xs[Math.max(0, i - 1)] + 9, PX.G - 9); fxConfetti(c, 12, 30); }
};
MO.award = c => {
  const P = c.P, k = c.cast, kind = c.a[0] || 'prize';
  if (kind === 'medal') {
    moSky(c, 'd'); const r = c.back; r.rect(0, 20, PX.W, PX.G - 20, P.light(P.wall3, 0.2)); for (let y = 22; y < PX.G - 2; y += 3) for (let x = (y % 6) ? 0 : 2; x < PX.W; x += 4) r.px(x, y, [P.accent, P.water, P.gold, P.light(P.wall, 0.6)][(x + y) % 4]);
    moPave(c); const f = c.front, W = moWhite(P);
    for (const [dx, h, n] of [[-22, 6, 2], [-7, 11, 1], [8, 4, 3]]) { f.rect(MO_CX + dx, PX.G - h, 15, h, W); f.rect(MO_CX + dx, PX.G - h, 15, 1, P.light(P.gold, 0.3)); f.rect(MO_CX + dx + 7, PX.G - h + 2, 1, 2, P.ol); }
    const me = moFig(k.me, P, { pose: 'up', top: P.accent }); moPut(c, me, MO_CX - 7 + ((15 - me.w) >> 1), PX.G - 11 - me.h);
    f.disc(MO_CX + ((15 - me.w) >> 1) + (me.w >> 1) - 7, PX.G - 11 - me.h + me.hand[1] - 2, 1, P.gold);
    for (const [dx, h] of [[-22, 6], [8, 4]]) { const s = moFig(moGen(c, 'sib', k.me.sex, k.me.age), P, { pose: 'wave', top: dx < 0 ? P.water : P.stamp }); moPut(c, s, MO_CX + dx + ((15 - s.w) >> 1), PX.G - h - s.h); }
    for (let i = 0; i < 3; i++) { c.mid.line(70 + i * 26, PX.G - 1, 70 + i * 26, 6, P.metal); c.mid.rect(71 + i * 26, 6, 10, 6, [P.accent, P.water, P.gold][i]); }
    moSpan(c, MO_CX - 24, MO_CX + 24); fxConfetti(c, 24, 30); return;
  }
  if (kind === 'elect') {
    moSky(c, 'night'); moFar(c); moPave(c); const r = c.mid; r.rect(MO_CX - 40, 10, 80, 10, P.accent); for (let x = MO_CX - 36; x < MO_CX + 36; x += 4) r.rect(x, 14, 2, 2, P.light(P.wall, 0.8));
    r.rect(MO_CX - 50, PX.G - 6, 100, 6, P.shade(P.trunk, 0.2));
    const me = moFig(k.me, P, Object.assign({ pose: 'up' }, moWear('suit', P))); moPut(c, me, MO_CX - (me.w >> 1), PX.G - 6 - me.h + 1);
    k.pt.slice(0, 1).forEach(p => { const s = moFig(p, P, { pose: 'wave' }); moPut(c, s, MO_CX + 10, PX.G - 6 - s.h); });
    for (let x = 4; x < PX.W; x += 7) { c.front.disc(x, PX.H - 2, 3, P.shade(P.hair, 0.05)); if ((x / 7 | 0) % 2) { c.front.rect(x - 2, PX.H - 12, 5, 4, [P.light(P.wall, 0.85), P.light(P.accent, 0.3)][(x / 14 | 0) % 2]); c.front.px(x, PX.H - 8, P.trunk); } }
    moSpan(c, MO_CX - 16, MO_CX + 20); fxConfetti(c, 30, 40); return;
  }
  if (kind === 'stage') { MO_W.stage(c, 'idol'); const s = c.front, x = MO_CX + 4; s.rect(x, PX.G - 12, 3, 3, P.gold); s.rect(x + 1, PX.G - 9, 1, 2, P.gold); s.rect(x - 1, PX.G - 7, 5, 1, P.gold); fxConfetti(c, 22, 36); return; }
  moRoom(c, { wall: P.shade(P.accent, 0.35), floor: 'wood', plain: true });
  const r = c.mid; for (let x = 0; x < PX.W; x += 4) r.rect(x, 0, 2, PX.G - 2, P.shade(P.accent, 0.45)); for (let y = 0; y < PX.G; y++) for (let i = -12; i <= 12; i++) r.dither(MO_CX + i + Math.round((y - 20) / 4), y, P.light(P.gold, 0.5), 0.12);
  const me = moFig(k.me, P, Object.assign({ pose: 'wave' }, moWear('suit', P))); moPut(c, me, MO_CX - (me.w >> 1), PX.G - me.h + 1);
  const f = c.front, x = MO_CX + (me.w >> 1) + 1, y = PX.G - me.h + 1 + me.hand[1] - 6; f.rect(x, y, 4, 3, P.gold); f.rect(x + 1, y + 3, 2, 2, P.gold); f.rect(x, y + 5, 4, 1, P.gold);
  for (let xx = 10; xx < PX.W - 8; xx += 11) if (Math.abs(xx - MO_CX) > 18) { f.disc(xx, PX.H - 2, 2, P.light(P.hair, 0.15)); f.rect(xx - 3, PX.H - 1, 7, 1, P.light(P.hair, 0.1)); }
  moSpan(c, MO_CX - 12, MO_CX + 12); fxSpark(c, MO_CX, 14, 4);
};
MO.shop = c => {
  const P = c.P, k = c.cast; moSky(c, 'd'); moFar(c); moPave(c);
  const r = c.mid, x0 = MO_CX - 30, w = 60; r.rect(x0, PX.G - 30, w, 30, P.light(P.wall, 0.3)); r.rect(x0 + 4, PX.G - 22, 24, 14, P.win); r.rect(x0 + 36, PX.G - 22, 18, 22, P.shade(P.trunk, 0.1)); r.rect(x0 + 38, PX.G - 20, 14, 18, P.light(P.win, 0.2));
  for (let x = x0 - 2; x < x0 + w + 2; x++) { const col = ((x - x0) >> 2) % 2 ? P.wall : P.stamp; r.rect(x, PX.G - 34, 1, 4, col); if ((x - x0) % 4 < 2) r.px(x, PX.G - 30, col); }
  r.rect(x0 + 10, PX.G - 40, 40, 5, P.ol); r.rect(x0 + 12, PX.G - 39, 36, 3, P.gold);
  for (const fx of [x0 - 12, x0 + w + 4]) { r.line(fx + 4, PX.G - 1, fx + 4, PX.G - 14, P.trunk); r.disc(fx + 4, PX.G - 18, 5, P.light(P.accent, 0.4)); r.disc(fx + 4, PX.G - 18, 3, P.light(P.wall, 0.8)); }
  const ppl = [k.me, ...moFam(c, 3)]; const xs = moRow(c, ppl.map((p, i) => ({ s: moFig(p, P, { pose: p === k.me ? '' : 'up' }), dy: p === k.me ? 1 : 0 })), MO_CX, PX.G, 3);
  const R2 = moRGB('#E04848'); c.front.line(c.span[0] - 6, PX.G - 9, c.span[1] + 6, PX.G - 9, R2); c.front.disc(MO_CX, PX.G - 9, 1, R2);
  fxConfetti(c, 14, 30);
};
MO.flee = c => {
  const P = c.P, k = c.cast; pxSky(c.sky, Object.assign({}, c.m, { stage: 'e', mood: 'low' }), P, c.R);
  moFar(c); for (const [x0, n] of [[30, 7], [56, 5]]) for (let kk = n - 1; kk >= 0; kk--) { const cx = x0 + kk * 2, cy = PX.G - 10 - kk * 4, rad = 2 + (kk >> 1); c.back.disc(cx, cy, rad, P.shade(P.smoke, 0.15)); c.back.disc(cx - 1, cy - 1, rad - 1, P.smoke); }
  const r = c.mid; r.rect(0, PX.G, PX.W, PX.H - PX.G, P.light(P.soil, 0.2)); for (let y = PX.G; y < PX.H; y++) r.rect(60 - (y - PX.G) * 2, y, 70 + (y - PX.G) * 4, 1, P.light(P.sand, 0.15));
  const ps = [k.me, ...k.pt, ...k.kids, ...k.par, ...k.sib].slice(0, 5);
  const xs = moRow(c, ps.map(p => ({ s: moFig(p, P, { pose: 'walk' }), dy: p.role === 'me' ? 1 : 0 })), MO_CX + 10, PX.G + 1, 3);
  ps.forEach((p, i) => { if (p.age >= 12) { const s = moFig(p, P, {}); c.front.rect(xs[i] + 1, PX.G - s.h - 3, 7, 4, [P.light(P.accent, 0.3), P.light(P.water, 0.3), P.thatch][i % 3]); c.front.rect(xs[i] + 2, PX.G - s.h - 4, 5, 1, P.ol); } });
  for (let x = 140; x < 190; x += 14) { for (let y = 0; y < 8; y++) { const half = y; c.back.rect(x - half, PX.G - 9 + y, half * 2, 1, P.light(P.wall2, 0.2)); } }
};
MO.citizen = c => {
  const P = c.P, k = c.cast; moRoom(c, { wall: P.light(P.wall2, 0.3), floor: 'wood', plain: true });
  const r = c.mid; r.line(130, PX.G - 1, 130, 8, P.gold); r.rect(131, 8, 16, 12, P.stamp); r.disc(139, 14, 3, P.gold); r.disc(139, 14, 1, P.stamp);
  const me = moFig(k.me, P, { pose: 'wave' }); const xs = moRow(c, moAround({ s: me, dy: 1 }, moFam(c, 3).map(p => ({ s: moFig(p, P, { pose: 'up' }) }))), MO_CX - 6);
  const i = Math.floor(moFam(c, 3).length / 2) + (moFam(c, 3).length % 2 ? 0 : 0);
  c.front.rect(MO_CX - 6 - 2, PX.G - me.h - 4, 6, 4, moWhite(P)); c.front.px(MO_CX - 4, PX.G - me.h - 2, P.gold);
  fxConfetti(c, 12, 30);
};
MO.hobby = c => {
  const P = c.P, k = c.cast, id = c.a[0] || 'reading', sp = id.startsWith('sp_');
  const out = { sport: 1, hiking: 1, fishing: 1, photo: 1, garden: 1, art: 1, travel: 1 };
  if (id === 'travel') { c.a = ['mount', '', 'solo']; return MO.trip(c); }
  if (id === 'garden') return MO.garden(c);
  if (id === 'hiking') { c.a = ['mount', '', k.pt.length ? 'pt' : 'solo']; return MO.trip(c); }
  if (id === 'faith') return MO.fest(c);
  if (sp || id === 'sport') {
    moSky(c, 'd'); moFar(c); moGrass(c); c.mid.rect(0, PX.G + 4, PX.W, 1, P.light(P.wall, 0.7)); for (const x of [30, 166]) { c.mid.rect(x, PX.G - 14, 1, 14, moWhite(P)); c.mid.rect(x, PX.G - 14, 10, 1, moWhite(P)); c.mid.rect(x + 9, PX.G - 14, 1, 14, moWhite(P)); }
    const ball = { sp_basketball: P.light(P.accent, 0.1), sp_cricket: P.accent, sp_baseball: moWhite(P), sp_tennis: P.light(P.gold, 0.2) }[id] || moWhite(P);
    const me = moFig(k.me, P, { pose: 'up', top: P.accent }); moPut(c, me, MO_CX - 6, PX.G - me.h + 1);
    for (const [dx, col] of [[-26, P.water], [16, P.accent], [28, P.water]]) { const s = moFig(moGen(c, 'sib', k.me.sex, k.me.age), P, { pose: dx > 20 ? 'wave' : '', top: col }); moPut(c, s, MO_CX + dx, PX.G - s.h); }
    c.front.disc(MO_CX + 8, PX.G - 22, 1, ball); c.front.px(MO_CX + 8, PX.G - 22, P.ol); moSpan(c, MO_CX - 28, MO_CX + 40); return;
  }
  if (id === 'fishing') {
    moSky(c, 'm'); moFar(c); const r = c.mid; r.rect(0, PX.G - 6, PX.W, PX.H - PX.G + 6, P.water); for (let x = 0; x < PX.W; x++) if ((x * 7) % 11 < 2) r.px(x, PX.G - 3 + (x % 3) * 3, P.water2);
    r.rect(40, PX.G - 8, 70, 3, P.trunk); for (const x of [44, 76, 106]) r.rect(x, PX.G - 5, 2, 10, P.shade(P.trunk, 0.2));
    const me = moFig(k.me, P, { pose: 'sit', hat: 'cap', cap: P.stamp }); moPut(c, me, MO_CX - 10, PX.G - 8 - me.h + 2);
    const hx = MO_CX - 10 + me.w, hy = PX.G - 8 - me.h + 2 + me.hand[1]; c.front.line(hx, hy, hx + 16, hy - 14, P.trunk); c.front.line(hx + 16, hy - 14, hx + 18, PX.G - 2, P.light(P.ol, 0.4));
    c.front.rect(MO_CX - 22, PX.G - 13, 6, 5, P.metal); moSpan(c, MO_CX - 24, MO_CX + 26); return;
  }
  if (id === 'photo') { c.a = ['nature', '', 'solo']; return MO.trip(c); }
  if (id === 'art') { MO_W.studio(c, 'artist'); return; }
  if (id === 'drama' || id === 'dance' || id === 'karaoke') {
    moRoom(c, { wall: P.shade(P.accent, 0.4), floor: 'wood', plain: true }); const r = c.mid;
    for (let x = 0; x < PX.W; x += 4) r.rect(x, 0, 2, PX.G - 2, P.shade(P.accent, 0.5)); for (let y = 0; y < PX.G; y++) for (let i = -14; i <= 14; i++) r.dither(MO_CX + i, y, P.light(P.gold, 0.5), 0.12);
    const ps = [k.me, ...(id === 'karaoke' ? [moGen(c, 'sib', null, k.me.age), moGen(c, 'pt', null, k.me.age)] : [moGen(c, 'sib', null, k.me.age)])];
    moRow(c, ps.map((p, i) => ({ s: moFig(p, P, { pose: i ? 'wave' : 'up' }) })), MO_CX, PX.G, 6);
    if (id === 'karaoke') { r.rect(MO_CX - 16, 6, 32, 18, P.ol); r.rect(MO_CX - 15, 7, 30, 16, P.light(P.water, 0.2)); for (let i = 0; i < 3; i++) r.rect(MO_CX - 12, 17 + i * 2, 24 - i * 6, 1, P.light(P.wall, 0.8)); }
    fxNote(c, MO_CX - 22, 12); fxNote(c, MO_CX + 20, 16); return;
  }
  if (id === 'gym') {
    moRoom(c, { wall: P.light(P.wall3, 0.35), floor: 'tile', plain: true }); const r = c.mid; r.rect(20, 8, 152, 20, P.light(P.win, 0.35)); r.rect(140, PX.G - 12, 26, 10, P.ol); r.rect(142, PX.G - 14, 22, 2, P.metal);
    const me = moFig(k.me, P, { pose: 'up', top: P.stamp }); moPut(c, me, MO_CX - 4, PX.G - me.h + 1); c.front.rect(MO_CX - 8, PX.G - me.h - 2, me.w + 8, 1, P.metal); c.front.rect(MO_CX - 10, PX.G - me.h - 4, 3, 5, P.ol); c.front.rect(MO_CX + me.w - 1, PX.G - me.h - 4, 3, 5, P.ol);
    moSpan(c, MO_CX - 12, MO_CX + 16); return;
  }
  if (id === 'board') {
    moRoom(c, { win: [[30, 22]], frames: [150] }); const ps = [k.me, k.pt[0] || moGen(c, 'sib', null, k.me.age + 3)];
    moAtTable(c, ps.map(p => ({ s: moFig(p, P, {}) })), MO_CX, PX.G - 8, { gap: 14, cloth: false });
    const f = c.front; for (let i = 0; i < 8; i++) f.rect(MO_CX - 6 + i * 2 - 2, PX.G - 9, 2, 1, i % 2 ? P.ol : P.light(P.wall, 0.8)); f.px(MO_CX - 3, PX.G - 10, P.ol); f.px(MO_CX + 3, PX.G - 10, moWhite(P)); return;
  }
  if (id === 'cooking') { moRoom(c, { wall: P.light(P.wall, 0.5), floor: 'tile' }); const w = moFig(k.me, P, {}); moPut(c, w, MO_CX - 4, PX.G - w.h - 2); const f = c.front; f.rect(MO_CX - 22, PX.G - 7, 44, 7, P.light(P.trunk, 0.2)); f.rect(MO_CX + 6, PX.G - 12, 10, 5, P.shade(P.metal, 0.2)); for (let i = 0; i < 3; i++) f.px(MO_CX + 8 + i * 3, PX.G - 15 - (i % 2), P.light(P.smoke, 0.5)); const o = moFam(c, 2); let x = MO_CX - 24; for (const p of o) { const s = moFig(p, P, { pose: 'up' }); x -= s.w + 2; moPut(c, s, x, PX.G - s.h); } moSpan(c, x, MO_CX + 22); return; }
  if (id === 'crafts') { moRoom(c, { lamp: MO_CX + 24, frames: [50] }); const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 6; const f = c.front; f.rect(x - 4, PX.G - 18, me.w + 8, 14, P.light(P.stamp, 0.35)); moPut(c, me, x, PX.G - me.h - 2); f.rect(x - 3, PX.G - 4, me.w + 6, 4, P.light(P.stamp, 0.25)); f.disc(x + me.w + 6, PX.G - 2, 2, P.accent); f.line(x + me.w + 6, PX.G - 2, x + me.w - 1, PX.G - 9, P.accent); f.rect(x + 1, PX.G - 10, 6, 2, P.light(P.accent, 0.3)); moSpan(c, x - 6, x + me.w + 10); return; }
  if (id === 'music') { moSky(c, 'e'); moFar(c); moGrass(c); moTreeBig(c, 60, PX.G, 'round'); const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 6; moPut(c, me, x, PX.G - me.h); const f = c.front; f.rect(x - 1, PX.G - me.h + me.hand[1] - 2, 7, 4, P.gold); f.disc(x + 1, PX.G - me.h + me.hand[1], 1, P.ol); f.line(x + 6, PX.G - me.h + me.hand[1] - 1, x + 13, PX.G - me.h + me.hand[1] - 5, P.trunk); fxNote(c, x + 14, PX.G - me.h - 6); fxNote(c, x - 10, PX.G - me.h - 10); moSpan(c, x - 12, x + 20); return; }
  if (id === 'games' || id === 'screen' || id === 'sns') { moRoom(c, { view: 'night', win: [[24, 20]] }); const f = c.front, r = c.mid; r.rect(MO_CX + 14, 18, 26, 16, P.ol); r.rect(MO_CX + 15, 19, 24, 14, P.light(P.water, 0.25)); for (let j = -10; j <= 14; j++) for (let i = -30; i <= 6; i++) if (i * i + j * j < 600) r.dither(MO_CX + 20 + i, 26 + j, P.light(P.water, 0.5), 0.12); f.rect(MO_CX - 30, PX.G - 12, 40, 4, P.light(P.accent, 0.3)); const ps = [k.me, ...moFam(c, 1)]; moRow(c, ps.map(p => ({ s: moFig(p, P, { pose: 'sit' }) })), MO_CX - 10, PX.G - 2, 2); f.rect(MO_CX - 30, PX.G - 8, 40, 5, P.light(P.accent, 0.22)); if (id === 'games') f.rect(MO_CX - 12, PX.G - 9, 4, 2, P.ol); return; }
  moSky(c, 'e'); moFar(c); moGrass(c); const r = c.mid; r.rect(MO_CX - 22, PX.G - 20, 3, 20, P.trunk); r.disc(MO_CX - 20, PX.G - 26, 12, P.tree); r.disc(MO_CX - 16, PX.G - 24, 7, P.tree2);
  const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 14; moPut(c, me, x, PX.G - me.h); c.front.rect(x + 1, PX.G - me.h + me.hand[1] - 2, 7, 3, P.accent); c.front.rect(x + 4, PX.G - me.h + me.hand[1] - 2, 1, 3, moWhite(P));
  moSpan(c, MO_CX - 34, MO_CX + 4);
};
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
for (const [k, v] of Object.entries(RPAL)) RC[k] = pxRGB(v);
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