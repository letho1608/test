// js/home.js - Phong, nha tuong niem, uoc, hoi ky, xac suat
function wishBuild(recs) {
  const pool = {}; for (const R of recs) for (const m of wishMoments(R)) (pool[m.pole] = pool[m.pole] || []).push(m);
  for (const k in pool) wishShuf(pool[k]);
  const used = new Set(), seen = {}, qs = [], key = m => m.at + '|' + m.text;
  const take = (P, Q) => {
    const fresh = x => !used.has(key(x)), less = (x, y) => (seen[x.at] || 0) - (seen[y.at] || 0);
    const A = (pool[P] || []).filter(fresh).sort(less), B = (pool[Q] || []).filter(fresh).sort(less);
    for (const x of A) for (const y of B) if (x.at !== y.at && x.text !== y.text) return [x, y];
    return null;
  };
  let last = '';
  for (let r = 0; r < 3; r++) {
    const order = wishShuf(WISH_AX.slice()); if (order[0] === last) order.push(order.shift());
    for (const ax of order) {
      const o = take(ax[0], ax[1]);
      if (o) for (const m of o) { used.add(key(m)); seen[m.at] = (seen[m.at] || 0) + 1; }
      qs.push({ ax, o, g: r, flip: Math.random() < 0.5 }); last = ax;
    }
  }
  return { qs, pool };
}
const wishLife = at => WS.recs.find(R => R.at === at);
function wishOpts(q) {
  const o = q.o ? q.o.map(m => ({ pole: m.pole, m })) : WISH_ASK()[q.ax][q.g].map((t, i) => ({ pole: q.ax[i], t }));
  return q.flip ? o.reverse() : o;
}
function wishOptHTML(x, i) {
  if (!x.m) return `<button type="button" class="wsh-c plain" data-wsh="${i}"><span><span class="wsh-t">${esc(x.t)}</span></span></button>`;
  const R = wishLife(x.m.at), l = R.l, u = shelfImg(Object.assign({}, lifeFig(l), { age: x.m.a != null ? x.m.a : l.age }));
  const who = [l.name, l.ko, x.m.a != null ? L`${x.m.a}세` : ''].filter(Boolean).join(' · ');
  return `<button type="button" class="wsh-c" data-wsh="${i}"><img src="${u.url}" width="${u.w * 4}" height="${u.h * 4}" alt=""><span><span class="wsh-who">${esc(who)}</span><span class="wsh-t">${esc(x.m.text)}</span></span></button>`;
}
function wishResult() {
  const cnt = {}, near = {};
  WS.ans.forEach((a, i) => { cnt[a.pole] = (cnt[a.pole] || 0) + 1; if (a.at) { const n = near[a.pole] = near[a.pole] || {}; n[a.at] = (n[a.at] || 0) + 1 + i / 1000; } });
  const key = WISH_AX.map(ax => (cnt[ax[0]] || 0) > (cnt[ax[1]] || 0) ? ax[0] : ax[1]).join(''), life = {};
  for (const p of key) {
    let n = near[p];
    if (!n) { n = {}; for (const m of WS.pool[p] || []) n[m.at] = (n[m.at] || 0) + 1 + m.at / 1e16; }
    let b = 0, bv = 0; for (const at in n) if (n[at] > bv) { bv = n[at]; b = +at; }
    if (b && wishLife(b)) life[p] = b;
  }
  return { key, life };
}
function wishMirror(key) {
  const tot = {}; for (const R of WS.recs) for (const [k, v] of Object.entries((R.S.stats && R.S.stats.fY) || {})) if (FOCUS[k] && +v > 0) tot[k] = (tot[k] || 0) + +v;
  const all = Object.entries(tot).sort((x, y) => y[1] - x[1]), sum = all.reduce((t, x) => t + x[1], 0);
  if (sum < 5) return '';
  const top = all.slice(0, 3).filter(x => x[1] >= 0.5), rest = Math.round(sum - top.reduce((t, x) => t + x[1], 0));
  const parts = top.map(([k, y]) => L`${FOCUS[k].n} ${Math.max(1, Math.round(y))}년`).concat(rest >= 1 ? [L`그 밖 ${rest}년`] : []);
  const W = WISH_WORD(), lines = [];
  for (const ax of ['pw', 'tm']) {
    const ch = key.includes(ax[0]) ? ax[0] : ax[1], ot = ch === ax[0] ? ax[1] : ax[0];
    const yc = WISH_FOC[ch].reduce((t, k) => t + (tot[k] || 0), 0), yo = WISH_FOC[ot].reduce((t, k) => t + (tot[k] || 0), 0);
    if (yc + yo < 5) continue;
    lines.push(yc >= yo ? L`${eul(W[ch])} 골랐고, 내 삶들이 살아온 시간도 그쪽이 더 길었어요.` : L`${eul(W[ch])} 골랐는데, 내 삶들이 살아온 시간은 ${W[ot]} 쪽이 더 길었어요.`);
  }
  return `<div class="wsh-mir"><p class="wsh-mt">${"Đặt cạnh thời gian đã sống"}</p><p><small>${"Những năm trưởng thành của các cuộc đời tôi đã dành cho"}</small><b>${esc(parts.join(' · '))}</b></p>${lines.map(t => `<p>${esc(t)}</p>`).join('')}</div>`;
}
function wishBody() {
  const n = WS.recs.length;
  if (WS.step === 'intro') {
    if (n < WISH_NEED) return `<p class="cm-sub">${"Khi có từ ba cuộc đời được lưu trọn từ đầu đến cuối, bạn có thể bắt đầu."}</p><p class="pl-hint">${L`지금 이 브라우저에는 ${n}개가 있어요.`} ${"Những cuộc đời kết thúc trước 18 tuổi không được đưa vào."}</p>`;
    const few = WS.recs.slice(-8);
    return `<p class="cm-sub">${"Mỗi lần hai khoảnh khắc từ những cuộc đời bạn đã sống được đặt cạnh nhau. Hãy chọn bên khiến lòng bạn hướng về."}</p>
      <div class="pl-shelf-row wsh-row">${few.map(R => { const u = shelfImg(lifeFig(R.l)); return `<img src="${u.url}" width="${u.w * 3}" height="${u.h * 3}" alt="">`; }).join('')}</div>
      <p class="cm-sub">${"Chọn đủ mười hai lần, cuộc đời bạn mong muốn sẽ hiện ra."} ${"Không có đáp án đúng, cũng không có điểm số."}</p>
      <div class="kp-row"><button type="button" class="cta" id="wshGo">${"Bắt đầu"}</button></div>
      <p class="pl-hint">${L`이 브라우저에 남은 삶 ${n}개로 해요.`} ${"Câu trả lời của bạn không rời khỏi thiết bị này."}</p>`;
  }
  if (WS.step === 'res' && WS.res) {
    const R = WS.res, Wd = WISH_WORD(), Ln = WISH_LINE();
    const rows = R.key.split('').map(p => {
      const x = R.life[p] && wishLife(R.life[p]), u = x && shelfImg(lifeFig(x.l));
      return `<li><b>${esc(Wd[p])}</b><span>${esc(Ln[p])}</span>${x ? `<button type="button" class="wsh-near" data-wshlife="${x.at}"><img src="${u.url}" width="${u.w * 2}" height="${u.h * 2}" alt=""><span>${esc("Cuộc đời gần nhất")} · ${esc(x.l.name)} (${esc(x.l.ko)})</span></button>` : ''}</li>`;
    }).join('');
    return `<p class="wsh-k">${"Cuộc đời tôi mong muốn"}</p><p class="wsh-name">${esc(WISH_NAME()[R.key])}</p><p class="wsh-words">${esc(R.key.split('').map(p => Wd[p]).join(' · '))}</p>
      <ul class="wsh-ls">${rows}</ul>${wishMirror(R.key)}
      <p class="cm-sub">${"Không bên nào là cuộc đời tốt hơn."} ${"Không biết kiếp sau bắt đầu ở đâu, nhưng điều bạn mong muốn có thể mang theo."}</p>
      <div class="kp-row"><button type="button" class="cta" id="wshPic">${EDU_ON ? "Lưu thành ảnh" : "Chia sẻ"}</button><button type="button" class="ghost" id="wshAgain">${"Thử lại"}</button></div>`;
  }
  const i = WS.step, q = WS.qs[i]; if (!q) return '';
  return `<p class="wsh-n"><span class="wsh-bar"><i style="width:${Math.round(i / WS.qs.length * 100)}%"></i></span>${i + 1} / ${WS.qs.length}</p>
    <p class="wsh-q">${"Lòng bạn hướng về bên nào hơn?"}</p><div class="wsh-o">${wishOpts(q).map(wishOptHTML).join('')}</div>
    ${i > 0 ? `<div class="kp-row"><button type="button" class="ghost sm" id="wshBack">${"Quay lại"}</button></div>` : ''}`;
}
function wishDraw() { const w = $('#wshW'); if (w) { w.innerHTML = wishBody(); const b = w.closest('.bd'); if (b) b.scrollTop = 0; } }
function wishOpen() {
  openSheet("Cuộc đời tôi mong muốn", `<div class="wsh" id="wshW">${wishBody()}</div>`);
  UI.sheetBack = null;
}
async function wishSheet(from) {
  if (WS.busy) return;
  WS.busy = true; WS.from = from || ''; WS.step = 'intro'; WS.ans = []; WS.res = null; WS.recs = [];
  track('keep', { kind: 'wish' });
  if (!UI.prefs.wishSeen) { UI.prefs.wishSeen = 1; lsSet(PREF_KEY, UI.prefs); for (const b of document.querySelectorAll('.wsh-new')) b.remove(); }
  openSheet("Cuộc đời tôi mong muốn", `<div class="wsh" id="wshW"><p class="cm-sub">${"Đang mở hồ sơ cuộc đời…"}</p></div>`);
  UI.sheetBack = null;
  try { WS.recs = await wishRecs(); } catch (e) { WS.recs = []; reportCaught(e); }
  WS.busy = false; wishDraw();
}
function wishStart() { const b = wishBuild(WS.recs); WS.qs = b.qs; WS.pool = b.pool; WS.ans = []; WS.res = null; WS.step = 0; wishDraw(); }
function wishPick(k) {
  const i = WS.step, q = WS.qs[i]; if (typeof i !== 'number' || !q) return;
  const x = wishOpts(q)[k]; if (!x) return;
  WS.ans[i] = { pole: x.pole, at: x.m ? x.m.at : 0 }; WS.ans.length = i + 1;
  if (i + 1 < WS.qs.length) WS.step = i + 1;
  else { WS.res = wishResult(); WS.step = 'res'; track('keep', { kind: 'wishdone' }); }
  wishDraw();
}
async function wishPicture() {
  const R = WS.res; if (!R || WS.picBusy) return;
  WS.picBusy = true; track('keep', { kind: 'wishpic' });
  try {
    const W = 1080, H = 1350, pad = 76, Wd = WISH_WORD(), Ln = WISH_LINE(), name = WISH_NAME()[R.key], poles = R.key.split('');
    const title = "Cuộc đời tôi mong muốn", sub = "Từ những cuộc đời đã sống trong mô phỏng cuộc đời 'Vô Hạn Trùng Sinh'", words = poles.map(p => Wd[p]).join(' · ');
    const lives = poles.map(p => (R.life[p] && wishLife(R.life[p])) || null);
    await loadCardFonts(title + sub + name + words + poles.map(p => Ln[p]).join('') + lives.map(x => x ? x.l.name + x.l.ko : '').join(''));
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
    ctx.fillStyle = CARD.paper; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = CARD.ink2; cfont(ctx, 500, 34, CF.b); ctx.fillText(title, W / 2, 124);
    ctx.fillStyle = CARD.ink; fitText(ctx, name, 700, CF.d, 76, W - pad * 2, 40); ctx.fillText(name, W / 2, 230);
    ctx.fillStyle = CARD.stamp; fitText(ctx, words, 600, CF.b, 40, W - pad * 2, 24); ctx.fillText(words, W / 2, 300);
    ctx.textAlign = 'left';
    poles.forEach((p, i) => {
      const y0 = 372 + i * 196, x = lives[i] ? pad + 150 : pad + 8, mw = W - pad - x - 8;
      ctx.fillStyle = CARD.card; ctx.fillRect(pad - 18, y0, W - pad * 2 + 36, 178);
      if (lives[i]) {
        const r = shelfFig(lifeFig(lives[i].l)), k = Math.max(3, Math.min(7, Math.floor(Math.min(124 / r.w, 140 / r.h))));
        const fx = pad + Math.round((128 - r.w * k) / 2), fy = y0 + 160 - r.h * k;
        for (let yy = 0; yy < r.h; yy++) for (let xx = 0; xx < r.w; xx++) { const c = r.get(xx, yy); if (c) { ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; ctx.fillRect(fx + xx * k, fy + yy * k, k, k); } }
      }
      const dy = lives[i] ? 0 : 20;
      ctx.fillStyle = CARD.stamp; cfont(ctx, 700, 36, CF.d); ctx.fillText(Wd[p], x, y0 + 52 + dy);
      ctx.fillStyle = CARD.ink; cfont(ctx, 400, 28, CF.b); let ls = wrapLines(ctx, Ln[p], mw);
      if (ls.length > 1) { cfont(ctx, 400, 24, CF.b); ls = wrapLines(ctx, Ln[p], mw); }
      ls.slice(0, 2).forEach((t, j) => ctx.fillText(t, x, y0 + 94 + dy + j * 32));
      if (lives[i]) { const s = `${lives[i].l.name} · ${lives[i].l.ko}`; ctx.fillStyle = CARD.ink3; fitText(ctx, s, 400, CF.b, 24, mw, 16); ctx.fillText(s, x, y0 + 162); }
    });
    ctx.textAlign = 'center';
    ctx.fillStyle = CARD.ink2; fitText(ctx, sub, 400, CF.b, 26, W - pad * 2, 18); ctx.fillText(sub, W / 2, H - 112);
    ctx.fillStyle = CARD.ink3; cfont(ctx, 500, 28, CF.m); ctx.fillText('Vô Hạn Trùng Sinh', W / 2, H - 58);
    const blob = await new Promise(res => cv.toBlob(res, 'image/png')); if (!blob) throw new Error('blob');
    const fname = `${title}.png`.replace(/\s+/g, '-'); let file = null; try { file = new File([blob], fname, { type: 'image/png' }); } catch (e) { }
    const dataUrl = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => res(null); fr.readAsDataURL(blob); });
    if (WS.picUrl) URL.revokeObjectURL(WS.picUrl);
    WS.pic = { file, name: fname, url: (WS.picUrl = URL.createObjectURL(blob)), dataUrl };
    const url = wishUrl(R.key);
    picShareSheet({ title: "Chia sẻ cuộc đời tôi mong muốn", lead: "Chia sẻ cuộc đời bạn mong muốn, tìm thấy qua những cuộc đời đã sống nhé?", pic: WS.pic, kind: 'wish', alt: L`내가 바라는 삶: ${name}`, url,
      text: ["Cuộc đời tôi mong muốn, tìm thấy qua những cuộc đời tôi đã sống trong mô phỏng cuộc đời 'Vô Hạn Trùng Sinh'", `${name} (${words})`, "Cuộc đời bạn mong muốn trông như thế nào?", "#VoHanTrungSinh", url].join('\n') });
    UI.sheetBack = () => wishOpen();
  } catch (e) { reportCaught(e); toast("Hiện chưa thể tạo ảnh. Hãy thử lại sau ít phút."); }
  WS.picBusy = false;
}
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('button'); if (!t) return;
  if (t.dataset.wishgo != null) wishSheet(t.dataset.wishgo);
  else if (t.id === 'wshGo') wishStart();
  else if (t.dataset.wsh != null) wishPick(+t.dataset.wsh);
  else if (t.id === 'wshBack') { if (typeof WS.step === 'number' && WS.step > 0) { WS.step--; wishDraw(); } }
  else if (t.id === 'wshAgain') wishStart();
  else if (t.id === 'wshPic') wishPicture();
});
const PS = { o: null };
const wishUrl = key => location.origin + LP + '/s/w-' + key;
function picShareSheet(o) {
  PS.o = o;
  if (EDU_ON) {
    const q = o.pic || {};
    openSheet("Lưu thành ảnh", `<img class="cardimg" src="${IN_APP && q.dataUrl ? q.dataUrl : q.url}" alt="${esc(o.alt || '')}"><div class="sheetact">${IN_APP ? `<p>${"Hãy nhấn giữ ảnh để lưu hoặc chia sẻ."}</p>` : `<button class="ghost" id="psSave">${"Lưu ảnh"}</button>`}</div>`);
    track('card_share', { kind: o.kind + '_open' }); return;
  }
  const p = o.pic || {}, img = !IN_APP && p.file && navigator.canShare && navigator.canShare({ files: [p.file] });
  openSheet(o.title, `<p class="sh-lead">${esc(o.lead)}</p>
    <div class="sh-acts">
      ${img ? `<button class="cta" id="psImg">${"Chia sẻ dạng ảnh"}<small>${"Zalo, Facebook, Instagram, Threads, X…"}</small></button>` : ''}
      ${IN_APP ? `<button class="cta" id="psCopy">${"Sao chép lời và liên kết"}<small>${L`${pasteWhere()} 붙여넣기`}</small></button>` : ''}
      ${IN_APP ? '' : `<button class="ghost" id="psCopy">${"Sao chép lời và liên kết"}</button><button class="ghost" id="psSave">${"Lưu ảnh"}</button>`}
    </div>
    <details class="sh-prevd"><summary>${"Xem bài sẽ đăng"}</summary><p class="sharetext">${esc(o.text)}</p></details>
    <img class="cardimg sh-card" src="${IN_APP && p.dataUrl ? p.dataUrl : p.url}" alt="${esc(o.alt || '')}">
    <small class="sh-note">${IN_APP ? "Trong ứng dụng này, bạn có thể nhấn giữ ảnh để lưu hoặc chia sẻ." : "Trên X và Threads sẽ đăng chữ và liên kết. Nếu muốn đăng cả ảnh, hãy lưu ảnh rồi đính kèm."}</small>`);
  track('card_share', { kind: o.kind + '_open' });
}
function psSave() {
  const o = PS.o, p = o && o.pic; if (!p || !p.url) return;
  const a = document.createElement('a'); a.href = p.url; a.download = p.name; document.body.appendChild(a); a.click(); a.remove();
  toast("Đã bắt đầu lưu ảnh. Nếu không được, hãy nhấn giữ hoặc nhấp chuột phải vào thẻ để lưu.");
  track('card_share', { kind: o.kind + '_save' });
}
function psImg() {
  const o = PS.o, p = o && o.pic; if (!p || !p.file) return;
  navigator.share({ files: [p.file], text: o.text }).then(() => track('card_share', { kind: o.kind + '_img' })).catch(e => { if (!e || e.name !== 'AbortError') psSave(); });
}
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[data-ps]');
  if (a && PS.o) { track('card_share', { kind: PS.o.kind + '_' + a.dataset.ps }); return; }
  const t = e.target.closest && e.target.closest('button'); if (!t || !PS.o) return;
  if (t.id === 'psImg') psImg();
  else if (t.id === 'psSave') psSave();
  else if (t.id === 'psCopy') { copyText(PS.o.text, L`글과 링크를 복사했어요. ${pasteWhere()} 붙여넣어 주세요.`); track('card_share', { kind: PS.o.kind + '_copy' }); }
});
const KEEP_KEY = 'one8b.keep.v1';
const KP = { armed: '', busy: false, mem: {} };
function keepGet() { let v = null; try { v = JSON.parse(localStorage.getItem(KEEP_KEY) || 'null'); } catch (e) { } return v && (v.at || 0) >= (KP.mem.at || 0) ? v : Object.assign({}, KP.mem); }
const keepTok = () => keepGet().tok || null;
const WORLD_SKIP = new Set(['mind', 'mindhelp', 'kids']);
const FW = 720, FH = 1280, FILM_K = 8, FS0 = FH * 0.6 / 60, FY = Math.round(FH * 0.56);
const fa = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const bxEase = p => p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p);
const kf = (t, k) => { if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t < k[i][0]) { const [t0, v0] = k[i - 1], [t1, v1] = k[i]; return v0 + (v1 - v0) * bxEase((t - t0) / (t1 - t0)); } return k[k.length - 1][1]; };
const kfMove = (t, k) => kf(t + 40, k) - kf(t, k);
const bxIn = (t, a, b) => t >= a && t < b;
const bxBob = (t, mv, per = 110) => mv ? -(Math.floor(t / per) % 2) : 0;
function bxWalk(t, k, extra) { const mv = kfMove(t, k); return Object.assign({ x: kf(t, k), dy: bxBob(t, Math.abs(mv) > 0.01), flip: mv > 0.01 }, extra || {}); }
const G0 = 48;
const BX_EP = [
  { id: 'shoe', w: 3, cb: ['pet', 'life'], ok: (m, a) => m.pet === 'd' && a >= 18 && a <= 65 && !['school', 'toys', 'bench'].includes(m.prop),
    subs: B => ["Đến giờ ra ngoài mà một chiếc giày biến đâu mất.", B.petName ? L`범인 ${eun(B.petName)} 꼬리를 흔들고 있었습니다.` : "Thủ phạm đang ngoe nguẩy cái đuôi."],
    punch: () => "Hôm ấy đành đi hai chiếc giày lệch đôi suốt cả ngày. Cho đến lúc về nhà, chẳng ai để ý.", hits: [[4400, 'boing']],
    act: t => {
      const me = bxWalk(t, [[0, 100], [5600, 100], [7400, 64], [9000, 64], [10800, 98]], { k: 'me' }), dog = bxWalk(t, [[0, 162], [2200, 162], [3800, 122], [5600, 122], [6600, 58], [9200, 58], [10900, 114]], { k: 'dog' });
      if (bxIn(t, 500, 2300)) me.ic = '?'; else if (bxIn(t, 4400, 5600)) me.ic = '!'; else if (t > 9200) me.sw = 1;
      if (t > 11000) dog.ic = '♥';
      const out = [me, dog]; if (t < 8000) out.push({ k: 'shoe', x: dog.x + (dog.flip ? 7 : -7), y: G0 - 5 + dog.dy });
      return out;
    } },
  { id: 'cat', w: 3, cb: ['pet', 'life'], ok: (m, a) => m.pet === 'c' && a >= 16 && a <= 80, bare: 1,
    subs: B => ["Hôm ấy là ngày sắp xếp giấy tờ quan trọng.", B.petName ? L`${eun(B.petName)} 서류 위가 제일 따뜻하다고 생각했습니다.` : "Con mèo cho rằng nằm trên đống giấy tờ là ấm nhất nhà."],
    punch: B => B.petName ? L`결국 그 서류는 ${iga(B.petName)} 깰 때까지 기다려야 했습니다.` : "Rốt cuộc, đống giấy tờ ấy phải đợi đến khi con mèo thức dậy.", hits: [[7300, 'pop']],
    act: t => {
      const ck = [[0, 162], [1200, 162], [2700, 118], [3100, 108], [4900, 108], [5500, 124], [6000, 124], [6700, 116], [7100, 108]];
      const cat = bxWalk(t, ck, { k: 'cat' });
      const up = kf(t, [[0, 0], [2700, 0], [3100, 6], [4900, 6], [5500, 0], [6700, 0], [7100, 6]]);
      cat.y = G0 - up - (bxIn(t, 2700, 3100) || bxIn(t, 6700, 7100) ? 3 * Math.sin(Math.PI * ((t % 400) / 400)) : 0);
      const me = { k: 'me', x: 98, dy: bxIn(t, 4900, 5500) ? -1 : 0 };
      if (bxIn(t, 3500, 4700)) me.ic = '?'; else if (bxIn(t, 7300, 8400)) { me.ic = '!'; me.sw = 1; } else if (t > 9200) me.ic = '♥';
      if (bxIn(t, 3100, 4900) || t > 7100) cat.flip = true;
      if (t > 9600) cat.ic = 'Z';
      return [me, { k: 'desk', x: 106, y: G0 }, { k: 'paper', x: 108, y: G0 - 6 }, cat];
    } },
  { id: 'glasses', w: 3, cb: ['pt', 'life'], ok: (m, a) => a >= 62 && a <= 96,
    subs: B => ["Cặp kính lại biến mất.", B.ptN ? L`${B.ptN}까지 불러 집 안을 세 바퀴나 돌았습니다.` : "Lục khắp nhà ba vòng liền."],
    punch: () => "Cặp kính vẫn nằm trên đầu từ nãy đến giờ. Riêng năm ấy đã là lần thứ mười một.", hits: [[7700, 'ding']],
    act: (t, B) => {
      const me = bxWalk(t, [[0, 100], [1600, 86], [2300, 86], [3900, 114], [4500, 114], [6000, 98]], { k: 'me' });
      if (bxIn(t, 300, 2400) || bxIn(t, 4000, 5800)) me.ic = '?'; else if (bxIn(t, 5800, 7400)) me.sw = 1; else if (bxIn(t, 7700, 9000)) me.ic = '!'; else if (t > 9600) me.ic = '♥';
      const out = [];
      if (B.pt) { const pt = { k: 'pt', x: 126 }; if (bxIn(t, 6400, 7600)) pt.ic = '!'; out.push(pt); }
      const h = B.h.me, down = kf(t, [[0, 0], [7400, 0], [8000, 3]]);
      out.push(me, { k: 'glasses', x: me.x - (B.a >= 75 ? 1 : 0), y: G0 + 1 - h + 3 + down + me.dy });
      return out;
    } },
  { id: 'bangs', w: 3, cb: ['par'], ok: (m, a) => a >= 5 && a <= 9 && m.people.some(p => p.role === 'par'),
    subs: () => ["Hôm ấy là đêm trước ngày chụp ảnh ở trường.", "Quyết định tự tỉa tóc mái."],
    punch: () => "Bức ảnh chụp hôm sau đến giờ vẫn được dán ở trang đầu tiên của album gia đình.", hits: [[5600, 'boing']],
    act: (t, B) => {
      const me = { k: 'me', x: 104 }, h = B.h.me, top = G0 + 1 - h, par = bxWalk(t, [[0, 62], [4300, 62], [5400, 90]], { k: 'par' });
      if (bxIn(t, 5600, 7400)) par.ic = '!'; if (bxIn(t, 6000, 7800)) me.ic = '♪'; if (t > 8600) me.ic = '♥';
      const out = [par, me];
      if (t < 3600) out.push({ k: 'scissors', x: 110 + Math.sin(t / 160), y: top + 4 });
      for (const s of [1100, 1900, 2700]) {
        if (bxIn(t, s, s + 300)) out.push({ fx: 'snip', x: 106, y: top + 1 });
        if (bxIn(t, s, s + 900)) { const f = (t - s) / 900; out.push({ fx: 'bits', x: 104, y: top + 2 + f * (h - 2), n: s }); }
      }
      return out;
    } },
  { id: 'sing', w: 2, ok: (m, a, B) => a >= 10 && a <= 85, more: B => B.music ? 3 : 1,
    subs: () => ["Tưởng không có ai, liền cất giọng hát to hết cỡ.", "Có một khán giả."],
    punch: () => "Vẫn hát đến hết bài. Con chó nhà hàng xóm cũng hú theo đến hết bài.", hits: [[5400, 'boing']],
    act: t => {
      const me = { k: 'me', x: 98, dy: t < 11800 ? -(Math.floor(t / 450) % 2) : 0 };
      if (bxIn(t, 5400, 6400)) me.sw = 1; else if (t < 11800 && Math.floor(t / 900) % 3 !== 2) me.ic = '♪';
      const dog = bxWalk(t, [[0, 162], [3600, 162], [5200, 124]], { k: 'dog', ic: [6400, 8200, 10000].some(s => bxIn(t, s, s + 1200)) ? '♪' : null });
      dog.flip = false;
      return [me, dog];
    } },
  { id: 'ball', w: 2, ok: (m, a, B) => (a >= 7 && a <= 15) || (B.sport && a <= 40), more: B => B.sport ? 2 : 1,
    subs: () => ["Một buổi chiều chơi đá bóng.", "Cú sút hơi quá hay."],
    punch: () => "Hôm sau, bà cụ hàng xóm lau sạch quả bóng rồi mang trả, kèm theo một quả táo.", hits: [[3000, 'thud']],
    act: t => {
      const me = bxWalk(t, [[0, 104], [600, 98], [1500, 98], [1700, 101], [4400, 101], [6400, 82], [8600, 82], [9600, 90]], { k: 'me' });
      if (t > 4400 && t < 9600) me.dy = bxBob(t, kfMove(t, [[4400, 101], [6400, 82], [8600, 82], [9600, 90]]) !== 0, 260);
      if (bxIn(t, 3000, 4200)) me.ic = '!'; else if (t > 9600) me.sw = 1;
      const out = [me];
      if (t < 1700) out.push({ k: 'ball', x: 107, y: G0 });
      else if (t < 2800) { const f = (t - 1700) / 1100; out.push({ k: 'ball', x: 107 + 56 * f, y: G0 - 40 * f * (1.25 - f) }); }
      if (bxIn(t, 2900, 4100)) out.push({ ic: '!', x: 131, y: G0 - 20 });
      return out;
    } },
  { id: 'chicken', w: 3, ok: (m, a) => !m.urban && a >= 8 && a <= 75,
    subs: () => ["Một con gà trốn khỏi sân.", "Đuổi theo khắp xóm suốt hai tiếng."],
    punch: () => "Lúc chiều tà, con gà tự quay về, lại mổ thóc đúng chỗ cũ.", hits: [[1800, 'whoosh']],
    act: t => {
      const ck = [[0, 124], [1500, 124], [2600, 58], [4000, 58], [5600, 162], [6600, 162], [8000, 124]];
      const hen = bxWalk(t, ck, { k: 'chicken' });
      if (t < 1500 || t > 8000) hen.dy = Math.floor(t / 400) % 2;
      if (bxIn(t, 1300, 2200)) hen.ic = '!';
      const me = bxWalk(t, [[0, 98], [1700, 98], [3400, 58], [4600, 58], [6400, 162], [7400, 162], [9600, 106]], { k: 'me' });
      if (bxIn(t, 1800, 2900)) me.ic = '!'; else if (t > 9600) me.sw = 1;
      return [me, hen];
    } },
  { id: 'soup', w: 2, cb: ['pt', 'kid', 'life'], ok: (m, a) => a >= 25 && a <= 80 && m.people.length > 1, bare: 1,
    subs: () => ["Hôm ấy nấu canh cho bữa tối.", "Mặn quá thì thêm nước, nhạt quá lại thêm muối…"],
    punch: () => "Đến bữa tối, canh đã đầy ba nồi. Cả nhà ăn đúng món canh ấy suốt ba ngày.", hits: [[1400, 'pop'], [6800, 'boing']],
    act: t => {
      const me = bxWalk(t, [[0, 96], [800, 102]], { k: 'me' });
      if (bxIn(t, 1400, 2800) || bxIn(t, 6800, 7800)) { me.ic = '!'; me.sw = 1; } else if (bxIn(t, 4300, 5500)) me.ic = '?'; else if (t > 9200) me.sw = 1;
      const out = [me, { k: 'table', x: 116, y: G0 }, { k: 'pot', x: 116, y: G0 - 5 }, { fx: 'steam', x: 116, y: G0 - 9 }];
      if (bxIn(t, 2900, 3700)) out.push({ fx: 'pour', x: 114, y: G0 - 16, t: t - 2900, c: 'water' });
      if (bxIn(t, 5700, 6500)) out.push({ fx: 'pour', x: 115, y: G0 - 15, t: t - 5700, c: 'cloud' });
      if (t > 7600) out.push({ k: 'pot', x: 128, y: G0 }, { fx: 'steam', x: 128, y: G0 - 4 });
      if (t > 8400) out.push({ k: 'pot', x: 138, y: G0 }, { fx: 'steam', x: 138, y: G0 - 4 });
      return out;
    } },
  { id: 'nap', w: 3, ok: (m, a) => m.prop === 'office' && a >= 22 && a <= 62, bare: 1,
    subs: () => ["Một cuộc họp buổi chiều sau bữa trưa no nê.", "Có người hỏi ý kiến."],
    punch: () => "“Ý hay đấy!” Không ai hỏi đó là vấn đề gì, và đề xuất ấy được thông qua.", hits: [[6300, 'boing']],
    act: t => {
      const me = { k: 'me', x: 100, dy: t < 6200 ? Math.floor(t / 700) % 2 : bxIn(t, 6300, 6500) ? -2 : 0 };
      if (bxIn(t, 700, 5900)) me.ic = 'Z'; else if (bxIn(t, 6300, 7500)) me.ic = '!'; else if (bxIn(t, 8200, 10400)) me.ic = '♪';
      const col = { k: 'col', x: 128 }; if (bxIn(t, 5500, 6700)) col.ic = '?'; else if (bxIn(t, 9000, 10200)) col.ic = '!';
      return [me, { k: 'desk', x: 102, y: G0 }, { k: 'paper', x: 104, y: G0 - 6 }, col];
    } },
  { id: 'remote', w: 3, cb: ['pt', 'pet'], ok: (m, a) => a >= 25 && a <= 85 && m.people.some(p => p.role === 'pt'), bare: 1,
    subs: B => [B.ptN ? L`모처럼 ${wa(B.ptN)} 함께 쉬는 저녁이었습니다.` : "Một buổi tối hiếm hoi hai người cùng nghỉ ngơi.", "Chỉ có một cái điều khiển."],
    punch: () => "Cuối cùng cả hai ngủ thiếp đi mà vẫn chưa chọn được kênh nào.", hits: [[2300, 'pop']],
    act: (t, B) => {
      const lean = kf(t, [[0, 0], [2000, 0], [2400, 3], [3600, 3], [4200, 0]]);
      const me = { k: 'me', x: 96 + lean }, pt = { k: 'pt', x: 108 - lean };
      for (const p of [me, pt]) { if (bxIn(t, 2300, 3300)) p.ic = '!'; else if (bxIn(t, 4200, 5600)) p.ic = '?'; else if (bxIn(t, 5600, 7000)) p.sw = 1; else if (t > 8000) p.ic = 'Z'; }
      const out = [{ k: 'tv' + (Math.floor(t / 300) % 2), x: 138, y: G0 }, me, pt, { k: 'sofa', x: 102, y: G0 }];
      if (B.pet) { const pet = { k: B.pet === 'd' ? 'dog' : 'cat', x: 126, flip: true }; if (t > 3600 && t < 7000) pet.ic = '♥'; else if (t > 7600) pet.ic = 'Z'; out.push(pet); }
      if (t < 2600) out.push({ k: 'remote', x: 102, y: G0 - 6 });
      else if (t < 3600) { const f = (t - 2600) / 1000; out.push({ k: 'remote', x: 102 + 22 * f, y: G0 - 6 - 26 * f * (1 - f) + 6 * f }); }
      else if (!B.pet) out.push({ k: 'remote', x: 124, y: G0 });
      return out;
    } },
  { id: 'game', w: 4, cb: ['gk', 'life'], ok: (m, a, B) => a >= 60 && B.grand,
    subs: B => [B.gkOf ? (B.gkOfS === 'F' ? L`딸 ${B.gkOf}의 아이, 손주와 처음으로 보드게임을 했습니다.` : L`아들 ${B.gkOf}의 아이, 손주와 처음으로 보드게임을 했습니다.`) : "Lần đầu chơi cờ với cháu.", "Thua liền ba ván."],
    punch: () => "Sau đó lén luyện tập suốt một năm. Đến dịp lễ Tết năm sau, lần đầu tiên thắng được một ván.", hits: [[1400, 'ding'], [5400, 'ding']],
    act: t => {
      const me = { k: 'me', x: 96 }, kid = { k: 'gkid', x: 118 };
      if (bxIn(t, 1400, 2800) || bxIn(t, 5400, 6800)) kid.ic = '♪'; if (bxIn(t, 1800, 3400)) me.ic = '?'; else if (bxIn(t, 6000, 7600)) me.sw = 1; else if (bxIn(t, 8200, 9600)) me.ic = '!';
      return [me, kid, { k: 'table', x: 107, y: G0 }, { k: 'board' + (bxIn(t, 3600, 4400) ? (Math.floor(t / 200) % 2) : 0), x: 107, y: G0 - 5 }];
    } },
  { id: 'rain', w: 1, ok: (m, a) => a >= 14 && a <= 85, bare: 1,
    subs: () => ["Trời đẹp nên đem quần áo ra phơi.", "Ông trời lại có ý khác."],
    punch: () => "Hôm ấy quần áo được phơi ra ba lần, cất vào ba lần. Cuối cùng đành phơi trong phòng.", hits: [[3000, 'slide'], [8700, 'slide']],
    act: t => {
      const me = bxWalk(t, [[0, 104], [4600, 104], [5400, 84], [6000, 84], [6600, 104]], { k: 'me' });
      if (bxIn(t, 3000, 4000)) me.ic = '!'; else if (bxIn(t, 6800, 8200)) me.ic = '♪'; else if (t > 8700) { me.ic = t < 9800 ? '!' : null; me.sw = 1; }
      const on = [[600, 3800], [1300, 4100], [2000, 4400]].map(([a, b], i) => t >= a && t < b || t >= [6800, 7300, 7800][i]);
      const out = [{ fx: 'line', x0: 112, x1: 140, y: G0 - 15 }, me];
      on.forEach((v, i) => { if (v) out.push({ fx: 'cloth', x: 117 + i * 8, y: G0 - 14, i }); });
      if (bxIn(t, 2800, 5400) || t > 8600) out.push({ fx: 'rain' });
      return out;
    } },
  { id: 'firstword', w: 4, cb: ['kid', 'pet', 'pt'], ok: (m, a) => a >= 18 && a <= 50 && m.people.some(p => p.role === 'kid' && p.age === 1),
    subs: B => [B.kidN ? L`${iga(B.kidN)} 처음으로 말을 하려는 순간이었습니다.` : "Đó là lúc đứa bé sắp nói tiếng đầu tiên.", "Cả nhà nín thở."],
    punch: B => B.petName ? (B.pet === 'c' ? L`첫마디는 '엄마'도 '아빠'도 아니었습니다. '${B.petName}', 고양이 이름이었습니다.` : L`첫마디는 '엄마'도 '아빠'도 아니었습니다. '${B.petName}', 강아지 이름이었습니다.`)
      : B.pet === 'd' ? "Tiếng đầu tiên không phải “mẹ”, cũng chẳng phải “bố”. Mà là “gâu gâu”." : B.pet === 'c' ? "Tiếng đầu tiên không phải “mẹ”, cũng chẳng phải “bố”. Mà là “meo meo”."
      : "Tiếng đầu tiên không phải “mẹ”, cũng chẳng phải “bố”. Mà là “không”.", hits: [[4400, 'ding']],
    act: (t, B) => {
      const me = { k: 'me', x: 98 }, baby = { k: 'baby', x: 110 };
      if (bxIn(t, 800, 2800)) me.ic = '♪'; else if (bxIn(t, 5800, 7000)) me.ic = '!'; else if (bxIn(t, 7000, 8400)) me.sw = 1;
      if (bxIn(t, 4400, 5600)) baby.ic = '!';
      const out = [];
      if (B.pt) { const pt = { k: 'pt', x: 86 }; if (bxIn(t, 1200, 2800)) pt.ic = '♥'; else if (bxIn(t, 5800, 7000)) pt.ic = '!'; out.push(pt); }
      out.push(me, baby);
      if (B.pet) { const pet = { k: B.pet === 'd' ? 'dog' : 'cat', x: 126, flip: false }; if (bxIn(t, 6000, 8000)) pet.ic = '♥'; out.push(pet); }
      return out;
    } },
  { id: 'sleep', w: 4, cb: ['kid', 'pt', 'life'], pref: (m, a, H) => H.kidBorn(a) || H.kidBorn(a - 1) ? 3 : 1, ok: (m, a) => a >= 18 && a <= 55 && m.people.some(p => p.role === 'kid' && p.age <= 2),
    subs: B => [B.kidN ? L`아기 ${eul(B.kidN)} 재우려고 자장가를 불렀습니다.` : "Hát ru để dỗ em bé ngủ.", "Từ bài thứ ba trở đi thì không nhớ gì nữa."],
    punch: () => "Người ngủ trước lại là người lớn. Em bé ngắm cảnh ấy một lúc lâu rồi mới thiếp đi.", hits: [[6300, 'pop']],
    act: t => {
      const nod = t < 3600 ? Math.round(Math.sin(t / 380)) : t < 6000 ? Math.floor(t / 520) % 2 : 2;
      const me = { k: 'me', x: 100, dy: nod };
      if (t < 3600 && Math.floor(t / 700) % 3 !== 2) me.ic = '♪'; else if (bxIn(t, 3600, 5600) && Math.floor(t / 900) % 2) me.ic = '♪'; else if (t > 6000) me.ic = 'Z';
      const up = t > 6300 && t < 10200 ? 3 : 0, baby = { k: 'kid', x: 116, y: G0 - 2 - up };
      if (bxIn(t, 6300, 7300)) baby.ic = '!'; else if (bxIn(t, 7500, 9600)) baby.ic = '?'; else if (t > 10400) baby.ic = 'Z';
      return [me, baby, { k: 'crib', x: 116, y: G0 }];
    } },
  { id: 'timer', w: 3, snap: 6900, cb: ['pt', 'kid', 'life'], ok: (m, a) => a >= 20 && a <= 85 && m.people.filter(p => p.role !== 'me').length >= 2,
    pref: (m, a, H) => H.ann(a) >= 10 && H.ann(a) % 10 === 0 ? 4 : 1,
    subs: B => [B.v.ann ? L`결혼 ${B.v.ann}주년, 가족사진을 타이머로 찍기로 했습니다.` : "Cả nhà quyết định chụp ảnh gia đình bằng chế độ hẹn giờ.", "Phải về chỗ trong vòng 10 giây."],
    punch: () => "Trong ảnh, cả nhà đều đang cười, còn chính giữa là một người đang ngã nhào. Bức ảnh ấy đến giờ vẫn treo trong phòng khách.",
    hits: [[5900, 'thud'], [6500, 'shutter']],
    act: (t, B) => {
      const n = Math.min(3, B.fam.length), out = [{ k: 'tcam', x: 76, y: G0 }];
      for (let i = 0; i < n; i++) { const f = { k: 'f' + i, x: 110 + i * 9 }; if (i === 0 && bxIn(t, 4200, 5800)) f.ic = '!'; else if (t > 6900) f.ic = i % 2 ? '♪' : '♥'; out.push(f); }
      const me = bxWalk(t, [[0, 84], [2600, 84], [5700, 112]], { k: 'me' });
      if (bxIn(t, 600, 2400)) me.ic = '♪'; else if (bxIn(t, 5600, 5900)) me.dy = -2; else if (t >= 5900) { me.rot = 1; if (t > 7600) me.sw = 1; }
      out.push(me);
      if (bxIn(t, 2600, 6500)) out.push({ fx: 'blink', x: 78, y: G0 - 9, on: Math.floor(t / Math.max(90, 420 - (t - 2600) / 12)) % 2 });
      if (bxIn(t, 6500, 6820)) out.push({ fx: 'flash', a: 1 - (t - 6500) / 320 });
      return out;
    } },
  { id: 'cake', w: 2, cb: ['pt', 'life'], ok: (m, a) => a >= 20 && a <= 85 && m.people.length >= 2, bare: 1,
    pref: (m, a) => a % 10 === 0 ? 4 : 1,
    subs: B => [B.a % 10 === 0 ? L`${B.a}번째 생일, 케이크의 촛불을 끌 차례였습니다.` : "Đến lúc thổi nến trên bánh sinh nhật.", "Thổi mãi, thổi mãi, nến vẫn bùng cháy lại."],
    punch: () => "Đó là loại nến mua để đùa. Người mua về giả vờ không biết đến cùng, và chiếc bánh được cắt khi nến vẫn còn cháy.",
    hits: [[2500, 'pop'], [4300, 'pop'], [6100, 'pop']],
    act: (t, B) => {
      const blows = [1800, 3600, 5400, 7000], me = { k: 'me', x: 98 }, f = { k: B.fam.length ? 'f0' : 'pt', x: 127 };
      const out = [me, { k: 'table', x: 112, y: G0 }, { k: 'cake', x: 112, y: G0 - 5 }];
      const off = blows.some(b => bxIn(t, b + 250, b + 700));
      for (const dx of [-3, 0, 3]) out.push({ fx: 'flame', x: 112 + dx, y: G0 - 12, on: !off });
      for (const b of blows) if (bxIn(t, b, b + 500)) { out.push({ fx: 'blow', x: 104, y: G0 - 10, t: t - b }); me.dy = -1; }
      if (bxIn(t, 2500, 3300) || bxIn(t, 4300, 5100)) me.ic = '!'; else if (bxIn(t, 6100, 7000)) me.ic = '?'; else if (t > 7800) me.sw = 1;
      if (t > 2500 && Math.floor(t / 1300) % 2) f.ic = '♪';
      out.push(f);
      return out;
    } },
  { id: 'umbrella', w: 2, cb: ['life'], ok: (m, a) => m.urban && a >= 12 && a <= 80, bare: 1,
    subs: () => ["Hôm ấy gió thổi rất mạnh.", "Lần đầu bung chiếc ô mới mua."],
    punch: () => "Chỉ ba giây sau, chiếc ô đã lộn ngược. Cứ thế che chiếc ô lộn ngược đi bộ về nhà, vậy mà nó che mưa tốt hơn tưởng tượng.",
    hits: [[4600, 'whoosh']],
    act: (t, B) => {
      const me = bxWalk(t, [[0, 80], [4400, 104], [4900, 98], [7800, 98], [11000, 128]], { k: 'me' });
      const out = [{ fx: 'rain' }, me];
      if (bxIn(t, 4200, 6200)) out.push({ fx: 'wind', t });
      if (bxIn(t, 4600, 5800)) me.ic = '!'; else if (bxIn(t, 5800, 7800)) { me.sw = 1; if (Math.floor(t / 500) % 2) me.ic = '?'; } else if (t > 8200) me.ic = '♪';
      out.push({ k: t > 4600 ? 'umbx' : 'umb', x: me.x + 2, y: G0 - Math.round(B.h.me * 0.4) + me.dy });
      return out;
    } },
  { id: 'goat', w: 3, cb: ['life'], ok: (m, a) => !m.urban && ['ssa', 'sa', 'mena', 'eca', 'lac', 'eap'].includes(m.region) && a >= 8 && a <= 75, bare: 1,
    subs: () => ["Quần áo được phơi ngoài sân.", "Con dê nhà hàng xóm đang nhìn."],
    punch: () => "Con dê chỉ chịu bỏ đi sau khi ăn mất một bên tay áo sơ mi. Từ đó, chiếc áo ấy thành áo cộc tay.",
    hits: [[5400, 'boing']],
    act: t => {
      const goat = bxWalk(t, [[0, 172], [1200, 172], [3000, 143], [6000, 143], [6400, 152], [9400, 180]], { k: 'goat' });
      if (bxIn(t, 3000, 6000)) { goat.dy = Math.floor(t / 260) % 2 ? -1 : 0; goat.flip = false; }
      if (bxIn(t, 5400, 6400)) goat.ic = '!'; else if (t > 7000) goat.ic = '♥';
      const me = bxWalk(t, [[0, 96], [5600, 96], [6800, 128], [9000, 128]], { k: 'me' });
      if (bxIn(t, 5400, 6800)) me.ic = '!'; else if (t > 8600) me.sw = 1;
      const bite = t < 3200 ? 0 : t < 5600 ? (t - 3200) / 2400 : 1;
      return [{ fx: 'line', x0: 112, x1: 140, y: G0 - 15 }, { fx: 'cloth', x: 125, y: G0 - 14, i: 0 }, { fx: 'cloth', x: 135, y: G0 - 14, i: 1, cut: bite }, me, goat];
    } },
  { id: 'call', w: 3, cb: ['gk', 'kid', 'life'], ok: (m, a, B) => a >= 58 && B.by + a >= 2011 && B.by + a <= 2032, more: B => B.grand ? 1.5 : 1, bare: 1,
    subs: B => [B.gkOf ? (B.gkOfS === 'F' ? L`딸 ${B.gkOf}의 아이, 손주와 처음으로 영상통화를 했습니다.` : L`아들 ${B.gkOf}의 아이, 손주와 처음으로 영상통화를 했습니다.`)
      : B.grand ? "Lần đầu gọi video với cháu." : B.kidN && B.v.far ? L`${B.v.far}에 사는 ${wa(B.kidN)} 처음으로 영상통화를 했습니다.` : "Lần đầu gọi video với người nhà ở xa.", "Từ bên kia màn hình, tiếng cười cứ vang lên mãi."],
    punch: () => "Suốt cuộc gọi, trên màn hình chỉ thấy mỗi cái trán. Nhưng mọi người vẫn vui vì nghe rõ từng lời.",
    hits: [[4400, 'pop']],
    act: (t, B) => {
      const me = { k: 'me', x: 100, dy: t > 1200 && t < 8000 ? -(Math.floor(t / 900) % 2) : 0 };
      if (bxIn(t, 1400, 4000) && Math.floor(t / 800) % 2) me.ic = '♪'; else if (bxIn(t, 4600, 6600)) me.ic = '?'; else if (t > 8400) me.ic = '♥';
      const out = [me, { k: 'phone', x: me.x + 6, y: G0 - Math.round(B.h.me * 0.58) + me.dy }];
      if (t > 900) out.push({ fx: 'call', t: t - 900, laugh: t > 4200 });
      return out;
    } },
  { id: 'pigeon', w: 2, cb: ['life'], ok: (m, a) => m.urban && a >= 16 && a <= 85, bare: 1,
    subs: () => ["Lấy chiếc bánh mì kẹp ra trên ghế đá công viên.", "Một con bồ câu rón rén lại gần."],
    punch: () => "Chỉ trong nháy mắt. Bữa trưa hôm ấy là mẩu bánh mì còn sót lại trong tay.",
    hits: [[6200, 'whoosh']],
    act: (t, B) => {
      const seat = { k: 'me', x: 104, dy: 2 };
      const pg = bxWalk(t, [[0, 172], [1500, 172], [3800, 122], [6100, 114]], { k: 'pigeon' });
      if (t < 6200) pg.dy = Math.floor(t / 240) % 2 ? -1 : 0;
      if (t >= 6200) { const f = Math.min(1, (t - 6200) / 1800); pg.x = 114 + 70 * f; pg.y = G0 - 40 * f; pg.flip = true; pg.k = Math.floor(t / 120) % 2 ? 'pigeonf' : 'pigeon'; }
      if (bxIn(t, 4200, 6000)) pg.ic = '?';
      if (bxIn(t, 6200, 7400)) { seat.ic = '!'; seat.sw = 1; } else if (bxIn(t, 7600, 9800)) seat.ic = '…'; else if (t < 3000 && Math.floor(t / 700) % 2) seat.ic = '♪';
      const hand = { x: 109, y: G0 - Math.round(B.h.me * 0.45) + 1 }, out = [{ k: 'benchb', x: 104, y: G0 - 3 }, seat, { k: 'bench', x: 104, y: G0 }, pg];
      if (t < 6200) out.push({ k: 'sandwich', x: hand.x, y: hand.y }); else { if (t < 8000) out.push({ k: 'sandwich', x: pg.x - 3, y: pg.y + 2 }); out.push({ k: 'crust', x: hand.x, y: hand.y }); }
      return out;
    } },
  { id: 'bike', w: 3, cb: ['par'], ok: (m, a) => a >= 5 && a <= 10 && m.people.some(p => p.role === 'par'),
    subs: () => ["Hôm ấy là ngày đầu tiên tập đi xe đạp.", "“Đừng buông ra! Nhất định không được buông đấy!”"],
    punch: B => B.par ? (B.par.sex === 'F' ? "Đạp được một quãng xa mới nhận ra: phía sau chẳng có ai. Mẹ đã buông tay từ lâu rồi." : "Đạp được một quãng xa mới nhận ra: phía sau chẳng có ai. Bố đã buông tay từ lâu rồi.")
      : "Đạp được một quãng xa mới nhận ra: phía sau chẳng có ai. Bàn tay ấy đã buông từ lâu rồi.",
    hits: [[8000, 'boing']],
    act: t => {
      const me = bxWalk(t, [[0, 66], [1000, 66], [4600, 104], [8600, 166], [9400, 170]], { k: 'me' });
      const ride = t > 1000 && t < 9400; me.dy = -3 + (ride ? Math.round(Math.sin(t / 140) * 0.6) : 0);
      const par = bxWalk(t, [[0, 57], [1000, 57], [4600, 95], [5600, 97]], { k: 'par' });
      if (bxIn(t, 1200, 4400)) par.sw = 1; else if (t > 5400) par.ic = '♥';
      if (bxIn(t, 7400, 8000)) me.ic = '?'; else if (bxIn(t, 8000, 9200)) { me.ic = '!'; me.sw = 1; } else if (t > 9400) me.ic = '♪';
      return [par, me, { k: 'bike' + (ride ? Math.floor(t / 110) % 2 : 0), x: me.x, y: G0 }];
    } },
  { id: 'parcel', w: 2, cb: ['pet', 'kid', 'life'], ok: (m, a, B) => m.urban && a >= 20 && a <= 80 && B.by + a >= 2006, bare: 1,
    subs: () => ["Món hàng đặt mua trên mạng đã đến.", "Chiếc thùng to hơn tưởng tượng."],
    punch: B => B.pet === 'c' ? (B.petName ? L`상자 안에는 손가락만 한 물건 하나가 들어 있었습니다. 상자는 그날부터 ${B.petName}의 차지가 되었습니다.` : "Bên trong chỉ có một món đồ nhỏ bằng ngón tay. Từ hôm đó, chiếc thùng thuộc về con mèo.")
      : B.fam.some(p => p.role === 'kid' && p.age <= 12) ? (B.kidN && B.kidA <= 12 ? L`상자 안에는 손가락만 한 물건 하나가 들어 있었습니다. 상자는 한동안 ${B.kidN}의 집이 되었습니다.` : "Bên trong chỉ có một món đồ nhỏ bằng ngón tay. Có một thời gian, chiếc thùng thành ngôi nhà của đứa trẻ.")
      : "Bên trong chỉ có một món đồ nhỏ bằng ngón tay. Suốt ba năm sau đó, chiếc thùng nằm canh giữ ban công.",
    hits: [[700, 'ding'], [6600, 'pop']],
    act: (t, B) => {
      const me = bxWalk(t, [[0, 92], [2600, 92], [3200, 99]], { k: 'me' }), bx = kf(t, [[0, 196], [1200, 196], [2600, 117]]), open = t > 4400;
      if (bxIn(t, 2600, 3800)) me.ic = '!'; else if (bxIn(t, 4400, 6400)) me.dy = Math.floor(t / 200) % 2 ? -1 : 0; else if (bxIn(t, 6600, 8000)) me.ic = '?';
      const out = [me, { k: open ? 'boxo' : 'box', x: bx, y: G0 }];
      if (bxIn(t, 4500, 6400)) out.push({ fx: 'bits', x: 117, y: G0 - 17 - ((t - 4500) % 600) / 50, n: Math.floor(t / 600), c: 'cloud' });
      if (t >= 6600) out.push({ k: 'tiny', x: me.x + 2, y: G0 - B.h.me - 1 });
      const who = B.pet === 'c' ? 'cat' : B.fam.some(p => p.role === 'kid' && p.age <= 12) ? 'kid' : null;
      if (who && t > 8600) out.push({ k: who, x: 117, y: G0 - (who === 'cat' ? 4 : 3), ic: '♥' }, { k: 'boxf', x: 117, y: G0 });
      return out;
    } },
  { id: 'garden', w: 2, cb: ['pt', 'life'], ok: (m, a, B) => a >= 25 && a <= 85 && (B.garden || (!m.urban && m.home !== 'flat')), more: B => B.garden ? 3 : 1, bare: 1,
    pref: m => m.prop === 'bench' ? 2.5 : 1,
    subs: B => [B.v.ret ? "Mùa xuân đầu tiên sau khi gác lại công việc, thử trồng một hạt bí ngô." : "Mùa xuân năm ấy, thử trồng một hạt bí ngô.", "Có lẽ đã tưới nước hơi quá chăm chỉ."],
    punch: () => "Quả bí ngô thu hoạch mùa thu nặng đến mức một mình không nhấc nổi. Năm ấy cả xóm ăn cháo bí ngô suốt một tháng.",
    hits: [[3800, 'boing'], [5600, 'boing'], [7200, 'boing']],
    act: (t, B) => {
      const me = bxWalk(t, [[0, 96], [7400, 96], [8200, 102]], { k: 'me' }), out = [me];
      const sc = t < 3800 ? 0 : t < 5600 ? 0.6 : t < 7200 ? 1.2 : 2.1, pop = Math.max(0, ...B.hits.map(([h]) => t >= h && t < h + 260 ? 1 - (t - h) / 260 : 0));
      if (t < 3800) { out.push({ k: 'sprout', x: 113, y: G0 }); if (bxIn(t, 600, 3200)) out.push({ k: 'can', x: 106, y: G0 - 5 }, { fx: 'pour', x: 111, y: G0 - 10, t: t - 600, c: 'water' }); }
      else out.push({ k: 'pumpkin', x: 113 + sc * 4, y: G0, sc: sc * (1 + 0.18 * pop) });
      if (bxIn(t, 3800, 4600) || bxIn(t, 5600, 6400) || bxIn(t, 7200, 8000)) me.ic = '!';
      else if (t > 8200) { me.sw = 1; me.dy = Math.floor(t / 180) % 2 ? -1 : 0; }
      return out;
    } },
  { id: 'cook', w: 2, cb: ['pt'], ok: (m, a) => a >= 20 && a <= 45 && m.people.some(p => p.role === 'pt'), bare: 1,
    pref: (m, a, H) => H.ann(a) >= 0 && H.ann(a) <= 1 ? 4 : 1,
    subs: B => [B.ptN ? (B.v.nw ? L`함께 살기 시작한 첫해, ${B.ptN}에게 처음으로 저녁을 차려 주기로 한 날이었습니다.` : L`${B.ptN}에게 처음으로 저녁을 차려 주기로 한 날이었습니다.`) : "Hôm ấy là lần đầu nấu bữa tối cho người mình thương.", "Làm đúng y như trong sách, vậy mà khói vẫn bốc lên."],
    punch: () => "Khói làm cả hai cay xè nước mắt. Cuối cùng phải ra ngoài ăn tối, và chuyện hôm ấy đến giờ vẫn là câu đùa chỉ hai người hiểu.",
    hits: [[3600, 'pop'], [5600, 'boing']],
    act: t => {
      const me = { k: 'me', x: 102, dy: t < 3400 && Math.floor(t / 300) % 2 ? -1 : 0 };
      const pt = bxWalk(t, [[0, 170], [5000, 170], [6400, 126]], { k: 'pt' });
      if (t < 3200 && Math.floor(t / 900) % 2) me.ic = '♪'; else if (bxIn(t, 3600, 5000)) { me.ic = '!'; me.sw = 1; } else if (bxIn(t, 5000, 7000)) me.sw = 1; else if (t > 8600) me.ic = '♥';
      if (bxIn(t, 5600, 6800)) pt.ic = '!'; else if (t > 8600) pt.ic = '♥';
      const out = [me, { k: 'table', x: 114, y: G0 }, { k: 'pan', x: 114, y: G0 - 5 }];
      if (t > 2600) out.push({ fx: 'smoke', x: 114, y: G0 - 7, k: Math.min(1, (t - 2600) / 2400) });
      out.push(pt);
      return out;
    } },
  { id: 'hide', w: 2, cb: ['kid', 'gk', 'life'], bare: 1,
    ok: (m, a, B) => (a >= 25 && a <= 55 && bxYoung(m, 4, 9)) || (a >= 60 && a <= 85 && B.grand),
    subs: B => [bxGk(B) ? "Chơi trốn tìm với cháu." : B.kidN ? L`${wa(B.kidN)} 숨바꼭질을 했습니다.` : "Chơi trốn tìm với đứa nhỏ.", "Lần này đã trốn vào một chỗ không ai tìm ra nổi."],
    punch: B => bxGk(B) ? "Trốn kỹ đến mức ngủ quên luôn trong chiếc thùng. Đứa cháu thì đã bỏ cuộc từ lâu và đang ngồi ăn bánh." : "Trốn kỹ đến mức ngủ quên luôn trong chiếc thùng. Đứa nhỏ thì đã bỏ cuộc từ lâu và đang ngồi ăn bánh.",
    hits: [[2400, 'pop'], [7000, 'boing']],
    act: (t, B) => {
      const k = bxGk(B) ? 'gkid' : 'kid', out = [];
      const kid = bxWalk(t, [[0, 124], [3200, 124], [4600, 140], [5400, 140], [6800, 98], [7800, 98], [9600, 176]], { k });
      if (t < 2800) { kid.flip = true; if (Math.floor(t / 500) % 2) kid.ic = '…'; } else if (bxIn(t, 2800, 3200)) kid.ic = '!'; else if (bxIn(t, 4800, 5400) || bxIn(t, 7300, 7800)) kid.ic = '?'; else if (t > 8200) kid.ic = '♪';
      if (bxIn(t, 6800, 7800)) kid.flip = false;
      const box = { k: 'box', x: 84, y: G0 };
      if (bxIn(t, 2400, 3000)) box.dy = Math.floor(t / 90) % 2 ? -1 : 0; else if (bxIn(t, 7000, 7300)) box.dy = -1;
      if (t > 7600) box.ic = 'Z';
      out.push(box);
      if (t < 2400) { const me = bxWalk(t, [[0, 106], [300, 106], [1900, 88]], { k: 'me' }); if (bxIn(t, 2000, 2400)) me.dy = -2; if (bxIn(t, 300, 1900)) me.ic = '♪'; out.push(me); }
      out.push(kid);
      return out;
    } },
  { id: 'mosquito', w: 2, cb: ['life'], bare: 1, ok: (m, a) => a >= 10 && a <= 85,
    subs: () => ["Vừa tắt đèn đi ngủ thì bên tai vang lên tiếng “vo ve”.", "Bật đèn thì biến mất, tắt đèn lại xuất hiện."],
    punch: () => "Mãi đến bốn giờ sáng mới đập được. Sáng ra đếm thì có mười một vết đốt.",
    hits: [[2000, 'pop'], [5200, 'pop'], [7400, 'thud']],
    act: (t, B) => {
      const dark = bxIn(t, 0, 2000) || bxIn(t, 3600, 5200) || bxIn(t, 6400, 7400), lying = t < 2000 || bxIn(t, 3800, 5200) || bxIn(t, 6600, 7400);
      const me = { k: 'me', x: 104 }, h = B.h.me, out = [{ fx: 'dark', on: dark }, { k: 'mat', x: 104, y: G0 }];
      if (lying) { me.rot = 1; if (t < 1500) me.ic = 'Z'; else if (bxIn(t, 1500, 2000) || bxIn(t, 4600, 5200)) me.ic = '!'; else if (bxIn(t, 6800, 7400)) me.ic = '…'; }
      else { me.flip = bxIn(t, 2600, 3200) || bxIn(t, 5800, 6200); if (bxIn(t, 2200, 3600) || bxIn(t, 5400, 6400)) { me.ic = '?'; if (t > 5400) me.sw = 1; } else if (bxIn(t, 7400, 8400)) me.ic = '!'; else if (t > 8600) { me.sw = 1; if (Math.floor(t / 700) % 2) me.ic = '♪'; } }
      out.push(me);
      if (dark) {
        const cx = lying ? 112 : 108, cy = lying ? G0 - 6 : G0 - h - 1, land = bxIn(t, 7000, 7400);
        out.push({ fx: 'bug', x: land ? 101 : cx + 5 * Math.sin(t / 170), y: land ? G0 - 4 : cy + 2 * Math.sin(t / 90), dk: 1 });
      }
      if (bxIn(t, 7400, 7560)) out.push({ fx: 'flash', a: 0.5 * (1 - (t - 7400) / 160) });
      return out;
    } },
  { id: 'retire', w: 4, cb: ['pt', 'life'],
    ok: (m, a) => m.prop === 'bench' && a >= 45 && a <= 85 && (sceneAt(a - 1) || {}).prop !== 'bench',
    subs: () => ["Đó là buổi sáng sau ngày gác lại công việc đã làm cả đời.", "Không có chuông báo thức mà mắt vẫn mở ra lúc sáu giờ sáng."],
    punch: () => "Ăn mặc chỉnh tề, bước ra khỏi cửa rồi mới nhớ ra chẳng còn nơi nào phải đến. Hôm ấy ngồi thật lâu trên chiếc ghế đá đầu phố rồi mới về nhà. Hóa ra dễ chịu hơn mình nghĩ.",
    hits: [[3800, 'slide'], [9400, 'ding']],
    act: (t, B) => {
      const me = bxWalk(t, [[0, 80], [600, 80], [2600, 128], [3800, 134], [5600, 134], [7400, 155]], { k: 'me' }), out = [];
      if (bxIn(t, 300, 2400)) me.ic = '!'; else if (bxIn(t, 3800, 4800)) me.ic = '?'; else if (bxIn(t, 4800, 5600)) me.ic = '…';
      if (t >= 7400) { me.dy = 2; me.flip = false; if (bxIn(t, 7800, 9200) && Math.floor(t / 700) % 2) me.ic = '♪'; else if (t > 9400) me.ic = '♥'; }
      if (B.pt) { const pt = { k: 'pt', x: 88 }; if (bxIn(t, 900, 2600)) pt.ic = '?'; else if (t > 9800) pt.ic = '♥'; out.push(pt); }
      out.push(me);
      return out;
    } },
  { id: 'lost', w: 4, cb: ['life'], bare: 1, ok: (m, a) => a >= 16 && a <= 70 && bxNewLand(a),
    subs: B => [B.place ? L`${B.place}에 온 첫해였습니다.` : "Đó là năm đầu tiên đến một đất nước xa lạ.", "Hỏi đường thì được chỉ rất lâu, còn kèm cả ra hiệu bằng tay."],
    punch: () => "Lang thang suốt 30 phút mới vỡ lẽ: nơi cần tìm nằm ngay sau chỗ đứng hỏi đường lúc đầu.",
    hits: [[2600, 'pop'], [9700, 'boing']],
    act: t => {
      const me = bxWalk(t, [[0, 98], [6200, 98], [7400, 62], [7800, 62], [8800, 128], [9600, 102]], { k: 'me' });
      if (t < 1800) { me.flip = Math.floor(t / 600) % 2 === 1; me.ic = '?'; } else if (bxIn(t, 2600, 3600)) me.ic = '?'; else if (bxIn(t, 4200, 6200)) { me.sw = 1; if (Math.floor(t / 700) % 2) me.ic = '?'; } else if (bxIn(t, 7400, 7800)) me.ic = '…'; else if (t > 9700) { me.ic = '!'; me.sw = 1; me.flip = false; }
      if (t > 9600) me.flip = false;
      const col = bxWalk(t, [[0, 196], [1400, 196], [2600, 118], [6200, 118], [7600, 196]], { k: 'col' });
      if (bxIn(t, 3600, 6200)) { col.dy = Math.floor(t / 180) % 2 ? -1 : 0; col.ic = Math.floor(t / 900) % 2 ? '!' : '…'; col.flip = false; } else if (bxIn(t, 2600, 3600)) col.flip = false;
      return [{ k: 'sign', x: 88, y: G0 }, me, col];
    } },
];
const BX_FEET = new Set(['ball', 'chicken', 'bike', 'hide', 'umbrella']);
const bxYoung = (m, lo, hi) => { const ks = m.people.filter(p => p.role === 'kid').map(p => p.age); if (!ks.length) return false; const y = Math.min(...ks); return y >= lo && y <= hi; };
const bxGk = B => B.a >= 58 && B.grand;
function bxNewLand(a) {
  if (!S || !S.years || S.born === 'PRK' || (S.flags && (S.flags.refEver || S.flags.exile))) return false;
  const y = S.years.find(r => r.a === a), p = S.years.find(r => r.a === a - 1);
  return !!(y && p && y.cur && p.cur && y.cur !== p.cur && y.cur !== S.born);
}
function bxHist(D) {
  const f = S.fam || {}, P = f.partner, kids = (f.kids || []).filter(k => k.bornAt != null && k.name);
  return { P, f, kids, ann: a => P && f.marriedAt != null && a >= f.marriedAt && (P.endAt == null || P.endAt > a) ? a - f.marriedAt : -1,
    kidBorn: a => kids.some(k => k.bornAt === a), death: D.age };
}
function bxAfter(e, a, m, H, x) {
  for (const k of [...new Set([...(e.cb || []), 'life'])]) {
    if ((k === 'kid' || k === 'kidw') && x.kid && a - x.kid.bornAt <= 12) {
      const kd = x.kid, ka = H.death - kd.bornAt;
      if (kd.dA != null) continue;
      if (kd.job && JOBS[kd.job] && ka >= 22 && kd.job !== 'retired') return { k: 'kid', j: kd.job, s: kd.sex };
      if (kd.wed && ka >= 20) return { k: 'kidw', kb: Math.min(9, kd.kb || 0), s: kd.sex };
    } else if (k === 'pt' && x.ptOn && H.P && !H.P.divorced) {
      const n = (H.P.endAt != null ? H.P.endAt : H.death) - a; if (n >= 2) return { k: 'pt', n: Math.min(99, n), s: H.P.sex };
    } else if (k === 'par') {
      const par = (m.people || []).find(p => p.role === 'par'), pp = par && (par.sex === 'M' ? H.f.dad : H.f.mom);
      if (pp && !pp.absent) { const n = (pp.diedAt != null ? pp.diedAt : H.death) - a; if (n >= 2) return { k: 'par', n: Math.min(99, n), s: par.sex }; }
    } else if (k === 'pet' && S.pet && m.pet && S.pet.k === m.pet && S.pet.at <= a) {
      const n = Math.min(S.pet.at + (S.pet.life || 12), H.death) - a; if (n >= 2) return { k: 'pet', n: Math.min(30, n) };
    } else if (k === 'gk' && (S.flags.grand || 0) > 0) return { k: 'gk', n: Math.min(99, S.flags.grand) };
    else if (k === 'life') { const n = H.death - a; if (n >= 2) return { k: 'life', n }; }
  }
  return null;
}
const BX_NO_CAUSE = ['war', 'geno', 'disa', 'epid', 'covid', 'nut', 'suic', 'pol'];
function bonusRec(D, only, n) {
  if (!S || !S.years || !S.years.length || typeof sceneAt !== 'function' || D.age < 18) return null;
  if (S.deathAt && BX_NO_CAUSE.includes(S.deathAt.cause)) return null;
  const R = lvRand(D.name + D.iso + 'cookie' + (n ? '#' + n : '')), hob = S.hobbies || [], H = bxHist(D);
  const ctx = { music: hob.some(h => ['music', 'karaoke', 'dance'].includes(h.id)), sport: hob.some(h => h.id === 'sport' || /^sp_/.test(h.id)), garden: hob.some(h => h.id === 'garden'),
    grand: (S.flags.grand || 0) > 0, by: D.by };
  const opts = [], avoid = Array.isArray(S.bxAvoid) ? S.bxAvoid : [];
  const mv = S.dis && S.dis.k === 'move' ? (S.dis.at || 0) : null;
  for (const e of BX_EP) {
    if (only && e.id !== only) continue;
    const ages = [];
    for (let a = 1; a < D.age; a++) { if (mv != null && a >= mv && BX_FEET.has(e.id)) continue; const m = sceneAt(a); if (m && e.ok(m, a, ctx)) ages.push([a, e.pref ? e.pref(m, a, H) : 1]); }
    if (ages.length) opts.push({ e, ages, w: e.w * (e.more ? e.more(ctx) : 1) * (avoid.includes(e.id) ? BX_AVOID : 1) });
  }
  if (!opts.length) return null;
  let r = R() * opts.reduce((s, o) => s + o.w, 0), o = opts[0];
  for (const x of opts) { r -= x.w; if (r <= 0) { o = x; break; } }
  let ra = R() * o.ages.reduce((s, x) => s + x[1], 0), a = o.ages[0][0];
  for (const [ag, w] of o.ages) { ra -= w; if (ra <= 0) { a = ag; break; } }
  const m = sceneAt(a), pt = m.people.find(p => p.role === 'pt'), par = m.people.find(p => p.role === 'par');
  const pn = m.pet && (S.pet && S.pet.k === m.pet && S.pet.at <= a ? S.pet.n : (S.flags.petNames || []).length === 1 ? S.flags.petNames[0] : '');
  const yr = (S.years || []).find(y => y.a === a), per = p => p ? Object.assign({ sex: p.sex, age: p.age }, p.sk != null ? { sk: p.sk } : {}) : null;
  const ptOn = !!(pt && H.ann(a) >= 0 && H.P && H.P.sex === pt.sex), kidsHere = m.people.filter(p => p.role === 'kid' && !p.gk).sort((x, y) => x.age - y.age);
  let kid = null; for (const p of kidsHere) { kid = H.kids.find(k => a - k.bornAt === p.age && k.sex === p.sex); if (kid) break; }
  const g = (H.f.grand || []).filter(x => x.bornAt <= a && x.of).sort((x, y) => y.bornAt - x.bornAt)[0];
  const nm = { pt: ptOn ? callName(H.P.name) : '', kid: kid ? callName(kid.name) : '', gk: g ? g.of : '', gks: g ? g.ofSex : '' };
  const v = { ann: H.ann(a) >= 10 && H.ann(a) % 10 === 0 ? H.ann(a) : 0, nw: ptOn && H.ann(a) <= 1 ? 1 : 0, ret: m.prop === 'bench' ? 1 : 0, far: kid && kid.abroad && CBY[kid.abroad] ? kid.abroad : '', ka: kid ? a - kid.bornAt : -1 };
  const cb = bxAfter(o.e, a, m, H, { kid, ptOn });
  const me = m.people.find(p => p.role === 'me');
  return { id: o.e.id, a, n: n || 0, sex: pubSex(), sk: me && me.sk != null ? me.sk : skinMe(), pet: m.pet || '', pn: pn || '', pt: per(pt), par: per(par), g: ctx.grand ? 1 : 0,
    fam: m.people.filter(p => p.role !== 'me').slice(0, 6).map(p => Object.assign({ role: p.role, sex: p.sex, age: p.age }, p.sk != null ? { sk: p.sk } : {})), cur: (yr && yr.cur) || D.iso,
    m: Object.assign({}, m, { people: [], pet: '', prop: o.e.bare ? 'none' : m.prop }), nm, v, cb };
}
const BX_KEY = 'one8b.bx.v1', BX_RECENT = 4, BX_AVOID = 0.12;
function bxRecent() { const v = lsGet(BX_KEY, []); return Array.isArray(v) ? v.filter(x => typeof x === 'string' && BX_EP.some(e => e.id === x)).slice(0, BX_RECENT) : []; }
function bxRemember() {
  try { if (!S || S.replay || !S.endD) return; const x = bonusRec(S.endD); if (x) lsSet(BX_KEY, [x.id].concat(bxRecent().filter(i => i !== x.id)).slice(0, BX_RECENT)); } catch (e) { }
}
const PH_MOM = 7;
const MS_FR = ['wood', 'gold', 'black', 'white'], MS_FL = ['', 'chry', 'lily', 'rose', 'sun', 'wild', 'mari'];
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const SAVE_KEY = 'one8b.save.v3', LIVES_KEY = 'one8b.lives.v1', PREF_KEY = 'one8b.prefs.v1', PAST_KEY = 'one8b.past.v1', PAST_MAX = 10, ROLL_KEY = 'one8b.rolls.v1';
const LIVES_MAX = 500, PAST_STEP = 30;
const ageList = as => listAnd(as.map(String));
const OPEN_KEY = 'one8b.past.open', OPEN_KEEP_MS = 3 * 3600e3;
const lk = (k, lang = LANG) => lang !== 'ko' && /^one8b\.(save|lives|past|unlived)\./.test(k) ? 'one8b.' + lang + '.' + k.slice(6) : k;
const ROOT_AWAY = false;
function lsGet(k, d) { try { const v = localStorage.getItem(lk(k)); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function lsSet(k, v) { if (k === PAST_KEY && Array.isArray(v)) pdbPut(v); try { localStorage.setItem(lk(k), JSON.stringify(v)); return true; } catch (e) { return false; } }
function lsDel(k) { try { localStorage.removeItem(lk(k)); } catch (e) { } }
const PDB = { db: null, ats: new Set(), full: false };
const pdbOn = () => !(typeof EDU_ON !== 'undefined' && EDU_ON) && typeof indexedDB !== 'undefined' && typeof keepTok === 'function' && !!keepTok();
const pdbKey = (at, lang = LANG) => lk(PAST_KEY, lang) + '|' + at, pdbAt = k => +String(k).split('|').pop();
const pdbRange = (lang = LANG) => IDBKeyRange.bound(lk(PAST_KEY, lang) + '|', lk(PAST_KEY, lang) + '|~');
function pdbOpen() {
  if (!PDB.db) {
    PDB.db = new Promise((ok, no) => {
      const r = indexedDB.open('one8b-past', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('past'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); r.onblocked = () => no(new Error('pdb blocked'));
    });
    PDB.db.catch(() => { PDB.db = null; });
  }
  return PDB.db;
}
function pdbTx(mode, fn) {
  return pdbOpen().then(db => new Promise((ok, no) => {
    const tx = db.transaction('past', mode), r = fn(tx.objectStore('past'));
    tx.oncomplete = () => ok(r && r.result); tx.onerror = tx.onabort = () => no(tx.error || new Error('pdb'));
  }));
}
async function pdbPut(recs, lang = LANG) {
  try {
    if (!pdbOn() || !Array.isArray(recs)) return;
    recs = recs.filter(p => p && p.at > 0 && p.S && typeof p.S === 'object'); if (!recs.length) return;
    for (let i = 0; i < 6; i++) {
      try { await pdbTx('readwrite', st => { for (const p of recs) st.put({ at: p.at, S: p.S }, pdbKey(p.at, lang)); }); if (lang === LANG) for (const p of recs) PDB.ats.add(p.at); return; }
      catch (e) {
        if (!e || e.name !== 'QuotaExceededError') return;
        if (!PDB.full) { PDB.full = true; toast("Thiết bị này sắp hết dung lượng, nên 'Xem lại' có thể không dùng được nữa với các cuộc đời trước, bắt đầu từ cuộc đời cũ nhất.", 7000); }
        const keys = await pdbTx('readonly', st => st.getAllKeys(pdbRange(lang))), inLs = new Set((lsGetL(PAST_KEY, lang, []) || []).map(p => p.at)), want = new Set(recs.map(p => p.at));
        const old = (keys || []).find(k => !inLs.has(pdbAt(k)) && !want.has(pdbAt(k))); if (!old) return;
        await pdbTx('readwrite', st => st.delete(old)); if (lang === LANG) PDB.ats.delete(pdbAt(old));
      }
    }
  } catch (e) { }
}
function pdbDel(at) {
  if (typeof indexedDB === 'undefined') return;
  if (at === 'all') PDB.ats.clear(); else PDB.ats.delete(at);
  pdbTx('readwrite', st => st.delete(at === 'all' ? pdbRange() : pdbKey(at))).catch(() => { });
}
function pdbInit() {
  if (!pdbOn()) return;
  pdbTx('readonly', st => st.getAllKeys(pdbRange())).then(keys => {
    for (const k of keys || []) PDB.ats.add(pdbAt(k));
    pdbPut((lsGet(PAST_KEY, []) || []).filter(p => !PDB.ats.has(p.at)));
    if (keys && keys.length > PAST_MAX && UI.view === 'intro' && !UI.pastEdit) renderIntro();
  }, () => { });
}
const pdbGet = at => pdbTx('readonly', st => st.get(pdbKey(at)));
const CONFIG = {
  version: '1.0',
};
const CHANGELOG_FR = [];
const CHANGELOG_TH = [];
const CHANGELOG_VI = [];
const CHANGELOG_ZH = [];
const CHANGELOG_JA = [];
const CHANGELOG_EN = [];
const CHANGELOG = [];
(function copyNote() {
  // Disclaimers disabled permanently
})();
const REPL_KEY = 'one8b.repl.v1';
const ageBand = a => { a = +a || 0; return a < 5 ? '0' : a < 15 ? '5' : a < 40 ? '15' : a < 65 ? '40' : '65'; };
const FRIEND_PATH = (location.pathname.match(/^\/(?:[a-z]{2}\/)?s\/([a-z0-9-]{4,40})$/i) || [])[1] || '';
const STANDALONE = (() => { try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } })();
function pasteWhere() { const ua = navigator.userAgent || ''; return /KAKAOTALK/i.test(ua) ? "vào cuộc trò chuyện KakaoTalk" : /Barcelona/.test(ua) ? "vào Threads" : /Instagram/.test(ua) ? "vào Instagram" : "vào cuộc trò chuyện hoặc Threads"; }
const DEV = (() => {
  const ua = navigator.userAgent;
  if (/iPhone|iPod/.test(ua)) return 'iphone';
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ipad';
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? 'android' : 'atablet';
  if (/Windows/.test(ua)) return 'windows';
  if (/Macintosh/.test(ua)) return 'mac';
  if (/CrOS/.test(ua)) return 'chromeos';
  if (/Linux/.test(ua)) return 'linux';
  return 'other';
})();
let probErrN = 0;
const OWN_LINES = [2358, 28920];
const ownLine = (file, l) => {
  const f = String(file || ''); if (!f.startsWith(location.origin) || !(+l > 0)) return false;
  if (/\.js([?#]|$)/.test(f.slice(location.origin.length))) return true;
  return OWN_LINES[1] ? +l > OWN_LINES[0] && +l < OWN_LINES[1] : +l > 20;
};
const ownFrame = st => { for (const m of String(st || '').matchAll(/(https?:\/\/[^\s()@]+?):(\d+):\d+/g)) if (ownLine(m[1], +m[2])) return +m[2]; return 0; };
function reportErr(line, msg, kind) {
  try { console.warn('[Vô Hạn Trùng Sinh] lỗi:', kind, line, msg); } catch (e) { }
}
function reportCaught(err) {
  try { reportErr(ownFrame(err && err.stack), (err && err.message) || String(err), 'c'); } catch (e) { }
  try { console.error(err); } catch (e) { }
}
const IDLE_MS = 20 * 60e3;
function track(name, props) {
  try {
    } catch (e) { }
}
const UI = { prefs: Object.assign({ mode: 'birth', pace: 60 }, lsGet(PREF_KEY, {})), view: 'intro', dirty: true, feedCount: 0, t0: performance.now() };
delete UI.prefs.edu;
try { lsSet(PREF_KEY, UI.prefs); } catch(e){}
EDU_ON = false;
const EDU_T = false;
const TOTAL_BIRTHS = COUNTRIES.reduce((s, c) => s + c.b, 0);
const TOTAL_POP = COUNTRIES.reduce((s, c) => s + c.pop, 0);
const DEATHS_PER_YEAR = 61.7e6;
const SEC_YEAR = 365.25 * 86400;
const QTXT = ['', "một gia đình thuộc nhóm 20% nghèo nhất", "một gia đình thuộc nhóm thu nhập 20–40% từ dưới lên", "một gia đình thu nhập trung bình", "một gia đình thuộc nhóm thu nhập 20–40% từ trên xuống", "một gia đình thuộc nhóm 20% giàu nhất"];
const EDU_NOW = { prim: "tiểu học", lsec: "trung học cơ sở", usec: "trung học phổ thông", voc: "trường nghề", uni: "đại học", grad: "cao học", phd: "chương trình tiến sĩ" };
function show(view) {
  UI.view = view;
  for (const id of ['intro', 'roll', 'lifeview', 'dead']) { const el = $('#' + id); if (el) el.hidden = id !== view; }
  if (view !== 'lifeview') decPeek(false);
  window.scrollTo(0, 0); toTopCheck();
}
const share = c => { if (c.sh != null) return UI.prefs.mode === 'pop' ? c.shp : c.sh; const T = c.yr ? eraTot(c.yr) : null; return UI.prefs.mode === 'pop' ? c.pop / (T ? T.p : TOTAL_POP) : c.b / (T ? T.b : TOTAL_BIRTHS); };
let ERA_P = null;
function eraLoad() {
  if (eraLoaded()) return Promise.resolve();
  if (!ERA_P) ERA_P = new Promise((ok, no) => {
    const sc = document.createElement('script'); sc.src = LP + '/era.js?v=' + encodeURIComponent(CONFIG.version);
    sc.onload = () => eraLoaded() ? ok() : no(new Error('era')); sc.onerror = () => { ERA_P = null; no(new Error('era')); };
    document.head.appendChild(sc);
  });
  return ERA_P;
}
const ERA_SLOW_MS = 1800, ERA_STOP_MS = 15000;
let ERA_W = 0;
function eraWait(go, fresh) {
  const n = ++ERA_W, msg = "Đang tải dữ liệu của thời kỳ khác…", live = () => n === ERA_W;
  const end = () => { clearTimeout(t1); clearTimeout(t2); if (live()) ERA_W++; const t = $('#toast'); if (t && t.textContent === capS(msg)) t.hidden = true; };
  const t1 = setTimeout(() => { if (live()) toast(msg, ERA_STOP_MS); }, ERA_SLOW_MS);
  const t2 = setTimeout(() => { if (!live()) return; end();  toast(fresh ? "Dữ liệu của thời kỳ khác tải quá lâu nên đã dừng. Hãy nhấn lại, hoặc chọn 'Hôm nay'." : "Dữ liệu của thời kỳ khác tải quá lâu nên đã dừng. Vui lòng thử lại sau giây lát.", 8000); }, ERA_STOP_MS);
  eraLoad().then(() => { if (!live()) return; end(); go(); }, () => { if (!live()) return; end();  toast("Không tải được dữ liệu của thời kỳ khác. Vui lòng thử lại sau giây lát.", 6000); });
}
const ERA_Y_DEF = 1980;
const eraPick = () => !EDU_ON && !UI.prefs.eraAny && (UI.prefs.era === 'past' || UI.prefs.era === 'future') ? UI.prefs.era : 'now';
const eraYear = () => eraPick() === 'past' ? clamp(Math.round(+UI.prefs.eraY || ERA_Y_DEF), ERA_Y0, ERA_PAST1) : eraPick() === 'future' ? Math.max(NOW_Y, new Date().getFullYear()) : null;
const eraRand = () => eraPick() === 'past' && UI.prefs.eraY === 'r';
let ERA_ALL = null;
function eraAll() {
  if (ERA_ALL) return ERA_ALL;
  const b = {}, p = {}, yb = {}, yp = {}; let tb = 0, tp = 0;
  for (const c of COUNTRIES) { const E = ERA.C[c.id]; b[c.id] = p[c.id] = 0; if (!E) continue;
    for (let y = ERA_Y0; y <= ERA_PAST1; y++) { const x = eA(E.b, y) * 1000, q = e5(E.p, y); b[c.id] += x; p[c.id] += q; yb[y] = (yb[y] || 0) + x; yp[y] = (yp[y] || 0) + q; tb += x; tp += q; } }
  return (ERA_ALL = { list: COUNTRIES.map(c => ({ id: c.id, ko: c.ko, sh: b[c.id] / tb, shp: p[c.id] / tp })), b: tb, yb, yp });
}
const eraDrawYear = () => +wpick(UI.prefs.mode === 'pop' ? eraAll().yp : eraAll().yb);
const ERA_TOT = {};
function eraTot(y) { if (!ERA_TOT[y]) { let b = 0, p = 0; for (const c of COUNTRIES) { const e = eraAt(c, y); b += e.b; p += e.pop; } ERA_TOT[y] = { b, p }; } return ERA_TOT[y]; }
const eraList = () => { const y = eraYear(); return eraRand() && eraLoaded() ? eraAll().list : y && eraLoaded() ? COUNTRIES.map(c => eraAt(c, y)) : COUNTRIES; };
const ERA_HINT = { now: "Sống trọn một đời trong thế giới của hôm nay. Số liệu thống kê hiện tại được giữ nguyên đến cuối cùng.",
  past: "Chào đời vào năm bạn chọn và sống qua lịch sử đã thực sự diễn ra từ năm đó. Chiến tranh, nạn đói, khủng hoảng kinh tế và những món đồ mới xuất hiện đúng vào năm của chúng, và quốc gia được chọn theo nơi các em bé chào đời năm ấy.",
  future: "Chào đời ngay bây giờ và sống trong thế giới sắp tới. Dựa trên dự báo dân số của Liên Hợp Quốc, cộng thêm xác suất mà lịch sử đã cho thấy (suy thoái, chiến tranh, đại dịch) cùng các dự báo về AI, khí hậu và già hóa dân số. Đây không phải một tương lai định sẵn, mà chỉ là một khả năng.",
  any: "Một trong ba thế giới được chọn ngẫu nhiên: Quá khứ, Hôm nay hoặc Tương lai. Nếu là Quá khứ, năm sinh cũng được chọn ngẫu nhiên." };
const eraTag = y => !S || !S.era || S.era === 'now' ? '' : y >= NOW_Y ? (S.era === 'future' ? "Tương lai" : "dự báo") : "Quá khứ";
const fmtShare = x => { const t = x >= 0.01 ? (x * 100).toFixed(1) + '%' : (x * 100).toFixed(2) + '%'; return viVal(t); };
function koBig(n) { return n >= 1e9 ? viDec(n / 1e9, 2) + ' tỷ người' : viDec(n / 1e6, 1) + ' triệu người'; }
const leOf = (c, sex) => sex === 'F' ? c.le + c.gap * 0.49 : c.le - c.gap * 0.51;
function renderIntro() {
  const ey = eraYear(), ek = eraPick(), eraReady = !ey || eraLoaded();
  if (!eraReady) eraLoad().then(renderIntro, () => { });
  for (const b of document.querySelectorAll('[data-era]')) b.setAttribute('aria-pressed', String(UI.prefs.eraAny ? b.dataset.era === 'any' : b.dataset.era === ek));
  const rndY = eraRand();
  if ($('#eraYrRow')) { $('#eraYrRow').hidden = ek !== 'past'; $('#eraYr').value = rndY ? 'r' : String(eraYear() || ERA_Y_DEF); }
  if ($('#eraHint')) $('#eraHint').textContent = UI.prefs.eraAny ? ERA_HINT.any : ERA_HINT[ek] + (rndY ? ' ' + "Năm sinh cũng được chọn ngẫu nhiên: năm nào càng nhiều em bé chào đời thì càng dễ được chọn." : '');
  const mb = document.querySelectorAll('[data-mode]');
  if (mb.length === 2) { mb[0].textContent = ek === 'past' ? "Em bé chào đời năm ấy" : "Em bé chào đời lúc này"; mb[1].textContent = ek === 'past' ? "Người sống năm ấy" : "8 tỷ người đang sống"; }
  const list = eraList().slice().sort((a, b) => share(b) - share(a));
  const top = list.slice(0, 9); const rest = 1 - top.reduce((s, c) => s + share(c), 0);
  const max = share(top[0]);
  const pop = UI.prefs.mode === 'pop', T = ey && eraReady && !rndY ? eraTot(ey) : null;
  $('#oddsTitle').textContent = rndY ? (pop ? L`${ERA_Y0}~${ERA_PAST1}년 가운데 어느 해에 살던 사람 중 한 명이라면` : L`${ERA_Y0}~${ERA_PAST1}년 가운데 어느 해에 태어난 아기라면`) : ek === 'past' ? (pop ? L`${ey}년에 살던 사람 중 한 명이라면` : L`${ey}년에 태어난 아기라면`) : ek === 'future' ? (pop ? "Nếu bạn là một trong những người đang sống hôm nay và sống tiếp vào thế giới sắp tới" : "Nếu bạn chào đời ngay bây giờ và sống trong thế giới sắp tới")
    : pop ? "Nếu bạn là một trong 8 tỷ người đang sống hôm nay" : "Nếu bạn là một em bé chào đời ngay lúc này";
  $('#oddsSub').textContent = rndY && eraReady ? (pop ? L`UN 세계인구전망 2024 · ${ERA_Y0}~${ERA_PAST1}년 해마다의 인구 기준` : L`UN 세계인구전망 2024 · ${ERA_Y0}~${ERA_PAST1}년 출생아 ${koBig(eraAll().b)} 기준`) : T ? (pop ? L`UN 세계인구전망 2024 · ${ey}년 인구 ${koBig(T.p * 1000)} 기준` : L`UN 세계인구전망 2024 · ${ey}년 출생아 ${koBig(T.b)} 기준`)
    : pop ? L`UN 세계인구전망 2024 · 2023년 인구 ${koBig(TOTAL_POP * 1000)} 기준` : L`UN 세계인구전망 2024 · 2023년 출생아 ${koBig(TOTAL_BIRTHS)} 기준`;
  $('#oddsList').innerHTML = top.map(c => `<div class="orow"><span>${esc(cLbl(c.ko))}</span><span class="bar"><i style="width:${(share(c) / max * 100).toFixed(1)}%"></i></span><span class="v">${fmtShare(share(c))}</span></div>`).join('') +
    L`<div class="orow"><span>나머지 ${COUNTRIES.length - top.length}개국</span><span class="bar"><i style="width:${Math.min(100, rest / max * 100).toFixed(1)}%;opacity:.45"></i></span><span class="v">${fmtShare(rest)}</span></div>`;
  const om = $('.oddsmore'); if (om) { if (om.dataset.t0 == null) om.dataset.t0 = om.textContent; om.textContent = ek === 'past' || UI.prefs.eraAny ? L`${COUNTRIES.length}개국의 지금 통계 보기` : om.dataset.t0; }
  for (const b of document.querySelectorAll('[data-mode]')) b.setAttribute('aria-pressed', String(b.dataset.mode === UI.prefs.mode));
  for (const b of document.querySelectorAll('[data-pace]')) b.setAttribute('aria-pressed', String(+b.dataset.pace === UI.prefs.pace));
  const sv = lsGet(SAVE_KEY, null);
  const rb = $('#resumeBtn');
  if (sv && sv.S && (sv.S.phase === 'life' || sv.S.phase === 'birth') && CBY[sv.S.cur] && !(EDU_ON && !sv.S.eduOn)) {
    const curCty = (typeof COUNTRY_T !== 'undefined' && COUNTRY_T[sv.S.cur]) || (CBY[sv.S.cur] && CBY[sv.S.cur].ko) || sv.S.cur;
    rb.hidden = false;
    rb.textContent = `Tiếp tục · ${curCty}, ${sv.S.age} tuổi (${sv.S.name.full})`;
  } else rb.hidden = true;
  const rb2 = $('#resumeBtn2'); if (rb2) { rb2.hidden = rb.hidden; rb2.textContent = rb.hidden ? 'Tiếp tục' : rb.textContent; }
  eduHoldUi();
  const lives = lsGet(LIVES_KEY, []).filter(l => !EDU_ON || l.edu);
  const pl = $('#pastLives');
  if (lives.length) {
    pl.hidden = false;
    const snaps = new Set(lsGet(PAST_KEY, []).map(p => p.at).concat(pdbOn() ? [...PDB.ats] : []));
    $('#pastBody').innerHTML = lives.slice().reverse().map((l, i) => L`<li class="pl${snaps.has(l.at) ? ' can' : ''}"${i >= PAST_MAX && !UI.pastEdit ? ' data-more hidden' : ''}>
      <div class="pl-x"><div class="pl-h"><b>${esc(l.name)}</b><span>${esc(l.ko)} · ${l.sex === 'F' ? "Nữ" : "Nam"} · ${l.age}세</span></div>
      <div class="pl-c">${esc((l.y ? L`(${l.y}년생)` + ' ' : '') + l.cause)}${l.job ? ' · ' + esc(l.job) : ''}</div>${l.note ? `<q class="pl-q">${esc(l.note)}</q>` : ''}</div>
      ${snaps.has(l.at) && !UI.pastEdit ? L`<button class="pl-open" data-past="${l.at}" aria-label="${esc(l.name)}의 기록 다시 보기">다시 보기</button>` : ''}${UI.pastEdit ? L`<button class="pl-del" data-pdel="${l.at}" aria-label="${esc(l.name)}의 기록 지우기">지우기</button>` : ''}</li>`).join('');
    const more = lives.length - PAST_MAX, mb = $('#pastMore');
    mb.hidden = more <= 0 || !!UI.pastEdit; mb.textContent = L`지난 삶 ${Math.min(PAST_STEP, more)}개 더 보기`;
    const avg = lives.reduce((s, l) => s + l.age, 0) / lives.length;
    $('#pastSum').textContent = L`${lives.length}번의 삶 · 평균 ${avg.toFixed(1)}세`;
    { const h = $('#pastHint'); h.hidden = !snaps.size; if (h.dataset.t0 == null) h.dataset.t0 = h.textContent;
      h.textContent = !pdbOn() ? h.dataset.t0 : lives.every(l => snaps.has(l.at)) ? "Với mọi cuộc đời trước, nhấn 'Xem lại' để mở lại ghi chép cuối đời và thẻ chia sẻ."
        : ["Cuộc đời nào có nút 'Xem lại' thì có thể mở lại ghi chép cuối đời và thẻ chia sẻ.", "Cuộc đời không có 'Xem lại' chỉ còn lại phần tóm tắt nên không mở lại được.", "Mọi cuộc đời bạn sống từ nay về sau đều được lưu trong trình duyệt này."].join(' '); }
    try { $('#pastLook').innerHTML = lookBackHTML(lives, snaps); } catch (e) { $('#pastLook').innerHTML = ''; reportCaught(e); }
    try { $('#pastShelfBox').innerHTML = shelfStrip(lives); } catch (e) { $('#pastShelfBox').innerHTML = ''; reportCaught(e); }
    { const ed = !!UI.pastEdit, b = $('#pastEdit'); b.textContent = ed ? "Xong" : "Dọn dẹp ghi chép"; b.setAttribute('aria-pressed', String(ed));
      const a = $('#pastAll'); a.hidden = !ed; a.textContent = "Xóa tất cả"; delete a.dataset.sure; $('#pastEditNote').hidden = !ed;
      $('.pl-edit').hidden = false; }
  } else if (!rb.hidden || lbOffer()) {
    pl.hidden = false; $('#pastSum').textContent = ''; $('#pastHint').hidden = true; $('#pastMore').hidden = true; $('.pl-edit').hidden = true; UI.pastEdit = false;
    $('#pastBody').innerHTML = ''; $('#pastLook').innerHTML = `<p class="pl-hint">${"Những cuộc đời được sống đến cuối sẽ được lưu ở đây."}</p>`; $('#pastShelfBox').innerHTML = '';
  } else pl.hidden = true;
  { const n = $('#pastStore'); if (n && !pl.hidden) n.textContent = storeNote(); }
  lbPaint();
  a2Render();
  unlBackRender();
}
function lookBackHTML(lives, snaps) {
  if (lives.length < 2) return '';
  const nm = l => snaps.has(l.at) ? `<button class="pastopen" data-past="${l.at}">${esc(l.name)}</button>` : esc(l.name);
  const best = (f, ok) => { let b = null; for (const l of lives) { const v = f(l); if (v == null || (ok && !ok(v))) continue; if (!b || v > b.v) b = { l, v }; } return b; };
  const items = [];
  const longest = best(l => l.age), shortest = best(l => -l.age);
  if (longest) items.push(["Cuộc đời dài nhất", L`${nm(longest.l)} · ${esc(longest.l.ko)}, ${longest.l.age}세`]);
  if (shortest && shortest.l !== longest.l) items.push(["Cuộc đời ngắn nhất", L`${nm(shortest.l)} · ${esc(shortest.l.ko)}, ${shortest.l.age}세`]);
  const far = best(l => Array.isArray(l.lived) ? l.lived.length : null, v => v > 1);
  if (far) items.push(["Cuộc đời đi xa nhất", `${nm(far.l)} · ${far.l.lived.map(i => esc((CBY[i] || {}).ko || i)).join(' → ')}`]);
  const fam = best(l => Number.isFinite(+l.kids) ? +l.kids + (+l.grand || 0) : null, v => v > 0);
  if (fam) items.push(["Cuộc đời để lại nhiều người thân nhất", L`${nm(fam.l)} · 자녀 ${fam.l.kids}명${fam.l.grand ? L`, 손주·증손주 ${fam.l.grand}명` : ''}`]);
  const born = new Set(lives.map(l => l.iso)).size, women = lives.filter(l => l.sex === 'F').length;
  items.push(["Nơi sinh", L`${born}개 나라 · 여자로 ${women}번, 남자로 ${lives.length - women}번`]);
  return `<ul class="lookback">${items.map(([k, v]) => `<li><small>${k}</small><span>${v}</span></li>`).join('')}</ul>`;
}
function pastDel(at) {
  const all = at === 'all';
  lsSet(LIVES_KEY, all ? [] : lsGet(LIVES_KEY, []).filter(l => l.at !== at));
  const past = lsGet(PAST_KEY, []), keep = all ? [] : past.filter(p => p.at !== at);
  if (keep.length !== past.length) lsSet(PAST_KEY, keep);
  pdbDel(all ? 'all' : at);
  const o = lsGet(OPEN_KEY, null); if (o && (all || o.at === at)) lsDel(OPEN_KEY);
  if (all || !lsGet(LIVES_KEY, []).length) UI.pastEdit = false;
  renderIntro(); toast(all ? "Đã xóa toàn bộ ghi chép các kiếp trước." : "Đã xóa ghi chép của cuộc đời đó.", 2600);
}
function pastDelTap(b) {
  if (!b.dataset.sure) { for (const x of document.querySelectorAll('[data-pdel][data-sure], #pastAll[data-sure]')) { delete x.dataset.sure; x.textContent = x.id === 'pastAll' ? "Xóa tất cả" : "Xóa"; }
    b.dataset.sure = 1; b.textContent = "Nhấn thêm lần nữa để xóa"; return; }
  pastDel(b.id === 'pastAll' ? 'all' : +b.dataset.pdel);
}
const UNLIVED_KEY = 'one8b.unlived.v1', UNL_MAX = 120, UNL_SHOW = 60;
const UNL_N_KEY = 'one8b.unlived.n.v1', UNL_RESET_KEY = 'one8b.unlived.reset.v1', UNL_TIP = 30, UNL_CAP = 45;
const UNL_OFF_KEY = 'one8b.stones.off.v1';
const unlOff = () => !!lsGet(UNL_OFF_KEY, 0);
function unlBackRender() { const w = $('#unlBack'), b = $('#unlOn'); if (!w) return; w.hidden = !unlOff(); if (b && !w.hidden) b.textContent = "Hiện lại sỏi ở góc dưới bên trái"; }
const unlReset = () => { const r = lsGet(UNL_RESET_KEY, null); return r && typeof r === 'object' ? r : {}; };
const unlivedList = () => { const l = lsGet(UNLIVED_KEY, []); return (Array.isArray(l) ? l : []).filter(x => x && typeof x === 'object' && CBY[x.iso] && (!EDU_ON || x.edu)); };
function unlCount() {
  const c = lsGet(UNL_N_KEY, null);
  if (c && typeof c === 'object' && Number.isFinite(+c.a)) return { a: Math.max(0, Math.floor(+c.a)), e: Math.max(0, Math.floor(+c.e) || 0) };
  const l = lsGet(UNLIVED_KEY, []), list = Array.isArray(l) ? l.filter(x => x && typeof x === 'object') : [];
  return { a: list.length, e: list.filter(x => x.edu).length };
}
const unlN = () => { const c = unlCount(); return EDU_ON ? c.e : c.a; };
function unlivedAdd(St) {
  try {
    if (!St || !(St.phase === 'birth' || St.phase === 'life') || St.replay || !CBY[St.born] || !St.name || typeof St.name.full !== 'string') return false;
    if (EDU_ON && !St.eduOn) return false;
    const c = unlCount(), l = lsGet(UNLIVED_KEY, []), list = Array.isArray(l) ? l : [], life = St.phase === 'life';
    list.push(Object.assign({ t: Date.now(), k: life ? 'l' : 'b', iso: St.born, nm: St.name.full.slice(0, 80), a: life ? Math.max(0, Math.floor(+St.age) || 0) : 0 }, St.eduOn ? { edu: 1 } : {}));
    lsSet(UNLIVED_KEY, list.slice(-UNL_MAX)); lsSet(UNL_N_KEY, { a: c.a + 1, e: c.e + (St.eduOn ? 1 : 0) }); UI.unlNew = true;
    return true;
  } catch (e) { reportCaught(e); return false; }
}
function unlivedSVG(n) {
  const m = Math.min(n, UNL_CAP), W = 7.2, H = 3.8, j = i => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };
  const caps = R => { const c = []; for (let w = R, i = 0; w > 0; w -= i++ % 2 ? 2 : 1) c.push(w); return c; };
  let R = 1; while (caps(R).reduce((a, b) => a + b, 0) < m) R++;
  const rows = []; for (const c of caps(R)) { const left = m - rows.reduce((a, b) => a + b, 0); if (left <= 0) break; rows.push(Math.min(c, left)); }
  const st = []; let i = 0;
  rows.forEach((cnt, r) => { for (let c = 0; c < cnt; c++, i++) {
    const cx = 4.5 + (R - cnt) * W / 2 + c * W + (j(i) - 0.5) * 2.4, cy = 3.4 + (rows.length - 1 - r) * H + (j(i + 7) - 0.5) * 1.6;
    const rx = 2.7 + j(i + 3) * 1.3, ry = 1.9 + j(i + 5) * 0.9, rot = (j(i + 11) - 0.5) * 50;
    const e = `<ellipse class="u${Math.floor(j(i + 13) * 3)}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}" transform="rotate(${rot.toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
    st.push(i === m - 1 && UI.unlNew && n <= UNL_CAP ? `<g class="nw">${e}</g>` : e);
  } });
  const w = R * W + 3, h = rows.length * H + 3.6, s = 1 + 0.35 * Math.min(1, Math.max(0, (n - 3) / 40));
  const op = Math.min(0.78, 0.22 + 0.56 * (1 - Math.exp(-(n - 1) / 14)));
  return { w: w * s, h: h * s, html: `<svg viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" width="${(w * s).toFixed(1)}" height="${(h * s).toFixed(1)}" style="opacity:${op.toFixed(2)}" aria-hidden="true" focusable="false">${st.join('')}</svg>` };
}
function unlivedRender() {
  const b = $('#unlived'), p = $('#unlivedC'); if (!b || !p) return;
  unlBackRender();
  if (unlOff()) { b.hidden = p.hidden = true; p.classList.remove('fade'); p.innerHTML = ''; UI.unlNew = false; return; }
  const n = unlN();
  b.hidden = p.hidden = !n; p.classList.remove('fade');
  if (!n) { p.innerHTML = ''; return; }
  const added = UI.unlNew, v = unlivedSVG(n);
  p.innerHTML = v.html; b.style.width = Math.ceil(v.w + 16) + 'px'; b.style.height = Math.ceil(v.h + 16) + 'px';
  b.setAttribute('aria-label', L`이어지지 않은 삶 ${n}개`); UI.unlNew = false;
  unlivedPlace();
  if (!added) return;
  const r = unlReset();
  if (n >= UNL_TIP && !r.tip) { lsSet(UNL_RESET_KEY, Object.assign(r, { tip: Date.now() })); toast("Sỏi đã chất lên khá nhiều. Chạm vào đống sỏi ở góc dưới bên trái để đặt tất cả xuống, bất cứ lúc nào.", 8000); }
}
function unlivedPlace() {
  const b = $('#unlived'); if (!b || b.hidden) return;
  let lift = 0;
  for (const el of [$('#introFoot'), $('#cert .foot'), $('#deadFoot'), $('#decPeek')]) {
    if (!el || el.hidden || el.classList.contains('off') || !el.offsetHeight) continue;
    const cs = getComputedStyle(el); if (cs.position !== 'fixed' || cs.visibility === 'hidden') continue;
    if (el.getBoundingClientRect().left > 120) continue;
    lift = Math.max(lift, el.offsetHeight + (parseFloat(cs.bottom) || 0));
  }
  const at = lift ? `calc(${lift + 4}px + env(safe-area-inset-bottom, 0px))` : '';
  if (b.style.bottom !== at) { b.style.bottom = at; const p = $('#unlivedC'); if (p) p.style.bottom = at; }
}
function unlResetTap(b) {
  if (!unlN()) return;
  if (!b.dataset.sure) { b.dataset.sure = 1; b.textContent = "Chạm thêm lần nữa để đặt xuống"; return; }
  const l = lsGet(UNLIVED_KEY, []), list = Array.isArray(l) ? l : [], c = unlCount();
  lsSet(UNLIVED_KEY, EDU_ON ? list.filter(x => !(x && x.edu)) : []);
  lsSet(UNL_N_KEY, EDU_ON ? { a: Math.max(0, c.a - c.e), e: 0 } : { a: 0, e: 0 });
  closeSheet();
  const cv = $('#unlivedC'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cv && !cv.hidden && !still) { cv.classList.add('fade'); setTimeout(unlivedRender, 650); } else unlivedRender();
  toast("Bạn đã đặt tất cả sỏi xuống.", 4000);
}
function unlOffTap(b) {
  if (!b.dataset.sure) { b.dataset.sure = 1; b.textContent = "Chạm thêm lần nữa để ẩn"; return; }
  if (!lsSet(UNL_OFF_KEY, Date.now())) { toast("Không thể lưu vào trình duyệt này.", 4000); return; }
  closeSheet();
  const cv = $('#unlivedC'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cv && !cv.hidden && !still) { cv.classList.add('fade'); setTimeout(unlivedRender, 650); } else unlivedRender();
  toast(["Đã ẩn đống sỏi ở góc dưới bên trái.", "Bạn có thể cho chúng hiện lại bất cứ lúc nào bằng 'Hiện lại sỏi ở góc dưới bên trái' trên màn hình đầu tiên."].join(' '), 6000);
}
function unlOnTap() {
  lsDel(UNL_OFF_KEY); unlivedRender();
  toast("Đống sỏi ở góc dưới bên trái đã hiện lại.", 3000);
}
function unlivedSheet() {
  const n = unlN(), list = unlivedList().slice(-UNL_SHOW).reverse();
  const row = x => { const c = esc((CBY[x.iso] || {}).ko || x.iso);
    return `<li><b>${esc(x.nm)}</b><span>${x.k === 'l' ? L`${c} · ${x.a}세에 멈춤` : L`${c} · 출생 신고서에서 멈춤`}</span></li>`; };
  openSheet("Những cuộc đời không được tiếp tục", `<p class="unl-p">${"Đây là những cuộc đời không được tiếp tục vì bạn đã sinh ra lần nữa. Mỗi cuộc đời đều được rút thăm với cùng xác suất như một em bé đang thực sự chào đời ở đâu đó trên thế giới ngay lúc này."}</p>
    <ul class="unl-l">${list.map(row).join('')}</ul>
    <div class="unl-reset"><p>${"Bạn có thể đặt xuống tất cả những viên sỏi đã chất lên bất cứ lúc nào. Danh sách cũng sẽ mất theo."}</p><button class="ghost sm" id="unlReset">${"Đặt sỏi xuống"}</button></div>
    <p class="unl-n">${n > list.length ? L`가장 최근 ${list.length}개만 보여요.` + (' ') : ''}${"Chúng chỉ được lưu trong trình duyệt này và không được gửi đi đâu cả."}</p>
    <div class="unl-off"><p>${"Nếu nhìn những viên sỏi khiến bạn khó chịu, bạn có thể ẩn chúng trong trình duyệt này."}</p><button class="ghost sm" id="unlOff">${"Ẩn sỏi"}</button></div>`);
}
function tickCounters() {
  if (UI.view !== 'intro') return;
  const s = (performance.now() - UI.t0) / 1000;
  $('#cBirth').textContent = Math.floor(s * TOTAL_BIRTHS / SEC_YEAR * 1.005).toLocaleString(LC.loc);
  $('#cDeath').textContent = Math.floor(s * DEATHS_PER_YEAR / SEC_YEAR).toLocaleString(LC.loc);
}
function startNewLife() {
  lsDel(OPEN_KEY);
  let ey = eraYear(), era = eraPick(), rndY = eraRand();
  if (UI.prefs.eraAny && !EDU_ON) { era = pick(['past', 'now', 'future']); rndY = era === 'past'; ey = era === 'future' ? Math.max(NOW_Y, new Date().getFullYear()) : era === 'past' ? ERA_Y_DEF : null; }
  if (ey && !eraLoaded()) { eraWait(startNewLife, true); return; }
  if (rndY) ey = eraDrawYear();
  const cc = classCodeTake(); if (cc === false) return;
  if (!cc) { const h = eduHold(); if (h) { restore(h.S); toast(EDU_HOLD_T(), 5000); return; } }
  { const sv = lsGet(SAVE_KEY, null); if (sv && sv.S) { try { unlivedAdd(sv.S); } catch (e) {} } lsDel(SAVE_KEY); }
  lsSet(PREF_KEY, UI.prefs); lsSet(ROLL_KEY, lsGet(ROLL_KEY, 0) + 1);
  const d = new Date();
  if (cc) setRng(seedRng('Vô Hạn Trùng Sinh-class:' + cc + ':' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()));
  try {
    newLife(cc ? 'birth' : UI.prefs.mode, UI.prefs.pace, null, ey ? { era, by: ey } : null);
    S.home = UI.prefs.home || null; S.journal = [];
    if (S.home && !UI.prefs.homeHand) S.homeG = 1;
    try { makeCompanions(4); } catch (e) { S.comps = []; }
    if (!S.era) S.by = d.getFullYear(); S.bm = ri(1, 12);
    if (typeof tdStart === 'function') tdStart(d);
  } finally { if (cc) setRng(Math.random); }
  if (cc) toast(L`반 코드 ${cc}: 오늘 같은 코드를 넣은 친구와 같은 아기로 태어났어요.`, 6000);
  S.phase = 'birth';
  track('life_start', { country: S.born, mode: UI.prefs.mode, era: !!S.era });
  if (S.era) track('era', { kind: S.era === 'past' ? 'p' + Math.floor(S.by / 10) * 10 : 'f' });
  show('roll'); if (UI.unlNew) unlivedRender();
  $('#cert').hidden = true; $('#roller').hidden = false;
  const rollNameEl = $('#rollName');
  const rollMetaEl = $('#rollMeta');
  if (rollNameEl) rollNameEl.classList.add('rolling');
  const EL = {}; (rndY ? COUNTRIES.map(c => eraAt(c, ey)) : eraList()).forEach(c => { EL[c.id] = c; });
  const target = EL[S.born];
  const frames = 32; let i = 0;
  const w = {}; for (const id in EL) w[id] = share(EL[id]);
  const step = () => {
    i++;
    const isLast = i >= frames;
    const c = isLast ? target : EL[wpick(w)];
    const cName = (typeof COUNTRY_T !== 'undefined' && COUNTRY_T[c.id]) || c.ko || c.id;
    if (rollNameEl) {
      rollNameEl.textContent = cName;
      if (isLast) rollNameEl.classList.remove('rolling');
    }
    if (rollMetaEl) {
      const pShare = fmtShare(share(c));
      rollMetaEl.textContent = rndY ? `Năm ${ey} · Tỉ lệ xuất hiện: ${pShare}` : `Tỉ lệ xuất hiện: ${pShare}`;
    }
    if (!isLast) {
      const delay = 35 + Math.pow(i / frames, 2.8) * 360;
      setTimeout(step, delay);
    } else {
      setTimeout(showCert, 800);
    }
  };
  step();
}
function classCodeTake() {
  const el = $('#classCode'); if (!EDU_ON || !el) return null;
  const v = el.value.replace(/\s/g, ''); if (!v) return null;
  if (!/^\d{4}$/.test(v)) { toast("Mã lớp gồm bốn chữ số.", 4000); el.focus(); return false; }
  el.value = ''; return v;
}
const THEN_C = { RUS: 1991, UKR: 1991, BLR: 1991, KAZ: 1991, KGZ: 1991, TJK: 1991, TKM: 1991, UZB: 1991, AZE: 1991, GEO: 1991, ARM: 1991, MDA: 1991, EST: 1990, LVA: 1990, LTU: 1990 };
function thenName(id, y) {
  if (!y || y >= NOW_Y) return null;
  if (THEN_C[id] && y <= THEN_C[id]) return "Liên Xô";
  if ((id === 'SVN' || id === 'HRV') && y <= 1990) return "Nam Tư";
  if ((id === 'BIH' || id === 'MKD') && y <= 1991) return "Nam Tư";
  if (id === 'SRB' || id === 'MNE' || id === 'XKX') return y <= 2002 ? "Nam Tư" : y <= 2005 ? "Serbia và Montenegro" : id === 'XKX' && y <= 2007 ? CBY.SRB.ko : null;
  if ((id === 'CZE' || id === 'SVK') && y <= 1992) return "Tiệp Khắc";
  return null;
}
const bornKo = (c, y) => { const t = c && thenName(c.id, y); return t ? L`${t} (지금의 ${c.ko})` : c.ko; };
function birthStory() {
  const c = B(), f = S.fam;
  const place = typeof rohPlace === 'function' && rohPlace() ? rohPlace() : S.urban ? `${S.city}` : ruralWhere() ? L`${ruralWhere()} 농촌 마을` : "một làng quê";
  const sexW = S.sex === 'F' ? "bé gái" : "bé trai";
  const olds = f.older && typeof sibList === 'function' ? sibList().filter(x => x.d > 0).sort((a, b) => b.d - a.d) : [];
  const sib = !f.older ? "Bạn là con đầu lòng." : olds.length && olds.length <= 3 ? L`위로 ${iga(listAnd(olds.map(x => L`${x.d}세 ${sibWord(x)}`)))} 있습니다.` : L`위로 형제자매가 ${f.older}명 있습니다.`;
  const relT = S.rel === 'N' ? "Gia đình bạn không theo tôn giáo nào." : L`가족은 ${eul(relName())} 믿습니다.`;
  const dad = f.dad.absent ? " Bố bạn không ở bên cạnh." : '';
  const g = typeof ethG === 'function' && ethG(), root = !g ? '' : g.k === 'mix' && S.eth.nat && CBY[S.eth.nat] ? ' ' + (S.eth.p === 'f' ? L`아버지는 ${CBY[S.eth.nat].ko}에서 왔습니다.` : L`어머니는 ${CBY[S.eth.nat].ko}에서 왔습니다.`) : ' ' + L`가족의 뿌리는 ${ethSub() || g.n}입니다.`;
  const house = S.flags.royal ? ' ' + L`${royalHouse()}의 아이입니다.` : '';
  return L`${S.by}년 ${L_WEST ? monthEn(S.bm) : S.bm}월, ${bornKo(c, S.by)} ${place}의 ${QTXT[S.q]}에서 ${sexW}로 태어났습니다. ${sib} ${relT}${dad}` + root + house + (S.adopt && S.adopt.mv == null ? ' ' + adoptBirthLine() : '');
}
function ruralLine() {
  const pop = UI.prefs.mode === 'pop'; let t = 0, r = 0;
  for (const x0 of COUNTRIES) { const x = S && S.era && S.era !== 'now' ? eraAt(x0, S.by) : x0, w = pop ? x.pop : x.b; t += w; r += w * (100 - x.urb) / 100; }
  const sh = r / t, two = Math.round(1 / sh) === 2;
  if (S && S.era === 'past') return pop ? L`${S.by}년에는 세계 사람의 약 ${pctStr(sh)}가 농촌에 살았습니다.` : L`${S.by}년에는 세계 아기의 약 ${pctStr(sh)}가 농촌에서 태어났습니다.`;
  if (pop) return L`세계 사람의 약 ${pctStr(sh)}는 농촌에 삽니다.`;
  if (!two) return S.urban ? L`세계 아기의 약 ${pctStr(sh)}는 농촌에서 태어납니다.` : L`세계 아기의 약 ${pctStr(sh)}가 당신처럼 농촌에서 태어납니다.`;
  return S.urban ? "Cứ hai em bé trên thế giới thì có một em chào đời ở nông thôn." : "Và cứ hai em bé trên thế giới thì có một em chào đời ở nông thôn, giống như bạn.";
}
function certMap() {
  const f = $('#certMapF'), cv = $('#certMap'); if (!f || !cv || typeof WORLD === 'undefined' || !S) return;
  const at = WORLD.at[S.born]; f.hidden = !at; if (!at) return;
  $("#certMapC").textContent = L`${eun(BB().ko)} 지구 위 여기에 있어요.`;
  const k = 4, W = WORLD.w * k, H = WORLD.h * k; cv.width = W; cv.height = H;
  const x = cv.getContext('2d'), css = getComputedStyle(document.documentElement), land = css.getPropertyValue('--ink3').trim() || '#5F6E72', hot = css.getPropertyValue('--stamp').trim() || '#2C8C82';
  const [cx, cy] = at;
  for (const [i, j] of tgLand()) { const d = Math.hypot(i - cx, (j - cy) * 1.15); x.fillStyle = d < 3.2 ? hot : land; x.globalAlpha = d < 3.2 ? 1 - d / 5 : 0.32; x.fillRect(i * k + 1, j * k + 1, k - 1.5, k - 1.5); }
  x.globalAlpha = 1; x.strokeStyle = hot; x.lineWidth = 2.5; x.beginPath(); x.arc(cx * k + k / 2, cy * k + k / 2, k * 4.5, 0, Math.PI * 2); x.stroke();
}