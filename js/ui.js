// js/ui.js - Giao dien: khai sinh, thong ke, ket thuc, chia se
function lifeRoute() {
  if (typeof WORLD === 'undefined' || !S) return null;
  const live = countryCodes().filter(c => WORLD.at[c]), yrs = S.years || [];
  const at = a => { const y = yrs.find(x => x.a === a); return y && y.cur && WORLD.at[y.cur] ? y.cur : live[live.length - 1] || S.born; };
  const tr = (S.trips || []).filter(t => Array.isArray(t) && WORLD.at[t[1]]).map(([a, c]) => [at(a), c]).filter(([f, c]) => f !== c && WORLD.at[f]);
  if (live.length < 2 && !tr.length) return null;
  const order = [...new Set(live)], seen = [...new Set(tr.map(t => t[1]))].filter(c => !order.includes(c));
  return { live, order, tr, seen };
}
function lifeMapHTML() {
  const R = lifeRoute(); if (!R) return '';
  const nm = c => CBY[c].ko, path = (R.live.length > 7 ? R.order : R.live).map(c => `${R.order.indexOf(c) + 1} ${nm(c)}`).join(' → ');
  const head = [R.order.length > 1 ? L`살았던 나라 ${R.order.length}곳` : '', R.seen.length ? L`여행으로 가 본 나라 ${R.seen.length}곳` : ''].filter(Boolean).join(' · ');
  const seen = R.seen.length ? R.seen.slice(0, 8).map(nm).join(', ') + (R.seen.length > 8 ? ' ' + L`외 ${R.seen.length - 8}곳` : '') : '';
  const key = (R.order.length > 1 ? `<span class="lm-k"><i class="lm-live"></i>${"Chuyển nơi sống"}</span>` : '') + (R.tr.length ? `<span class="lm-k"><i class="lm-trip"></i>${"Những chuyến đi"}</span>` : '');
  return `<figure class="lifemap" id="lifeMapF"><canvas id="lifeMap" role="img" aria-label="${esc(L`이 삶이 지나온 나라: ${path}` + (seen ? ' · ' + seen : ''))}"></canvas>`
    + `<figcaption><b>${esc(head)}</b><span class="lm-path">${esc(path)}</span>${seen ? `<span class="lm-seen">${esc(seen)}</span>` : ''}<span class="lm-keys">${key}</span></figcaption></figure>`;
}
function drawLifeMap() {
  const cv = $('#lifeMap'), R = lifeRoute(); if (!cv || !R) return;
  const dpr = Math.min(3, window.devicePixelRatio || 1), cw = cv.clientWidth || 560, k = cw * dpr / WORLD.w, W = Math.round(WORLD.w * k), H = Math.round(WORLD.h * k);
  cv.width = W; cv.height = H;
  const x = cv.getContext('2d'), css = getComputedStyle(document.documentElement), v = (n, d) => css.getPropertyValue(n).trim() || d;
  const land = v('--ink3', '#5F6E72'), hot = v('--stamp', '#2C8C82'), trip = v('--ink2', '#3E4A4D'), card = v('--card', '#fff'), u = dpr;
  const P = c => { const [i, j] = WORLD.at[c]; return [i * k + k / 2, j * k + k / 2]; };
  const lived = R.order.map(c => WORLD.at[c]);
  for (const [i, j] of tgLand()) {
    const d = Math.min(...lived.map(([a, b]) => Math.hypot(i - a, (j - b) * 1.15)));
    x.fillStyle = d < 2.6 ? hot : land; x.globalAlpha = d < 2.6 ? 0.85 - d / 5 : 0.28; x.fillRect(i * k + k * 0.15, j * k + k * 0.15, k * 0.7, k * 0.7);
  }
  x.globalAlpha = 1;
  const arc = (a, b, bend) => { const [x1, y1] = P(a), [x2, y2] = P(b), dx = x2 - x1, dy = y2 - y1, L0 = Math.hypot(dx, dy) || 1;
    const cx = (x1 + x2) / 2 - dy / L0 * L0 * bend, cy = (y1 + y2) / 2 + dx / L0 * L0 * bend; x.beginPath(); x.moveTo(x1, y1); x.quadraticCurveTo(cx, cy, x2, y2); x.stroke(); return [cx, cy]; };
  const pairs = new Set();
  x.strokeStyle = trip; x.lineWidth = 1.3 * u; x.setLineDash([3 * u, 3 * u]); x.globalAlpha = 0.75;
  for (const [f, c] of R.tr) { if (pairs.has(f + c)) continue; pairs.add(f + c); arc(f, c, 0.18); }
  x.setLineDash([]); x.globalAlpha = 1;
  for (const c of R.seen) { const [px, py] = P(c); x.fillStyle = card; x.strokeStyle = trip; x.lineWidth = 1.5 * u; x.beginPath(); x.arc(px, py, 3.2 * u, 0, Math.PI * 2); x.fill(); x.stroke(); }
  x.strokeStyle = hot; x.lineWidth = 2.4 * u; x.lineCap = 'round';
  for (let i = 1; i < R.live.length; i++) {
    const a = R.live[i - 1], b = R.live[i]; if (a === b) continue;
    const [cx, cy] = arc(a, b, 0.22), [x2, y2] = P(b), ang = Math.atan2(y2 - cy, x2 - cx), r = 9 * u, hl = 6 * u;
    const tx = x2 - Math.cos(ang) * r, ty = y2 - Math.sin(ang) * r; x.fillStyle = hot; x.beginPath(); x.moveTo(tx, ty);
    x.lineTo(tx - Math.cos(ang - 0.45) * hl, ty - Math.sin(ang - 0.45) * hl); x.lineTo(tx - Math.cos(ang + 0.45) * hl, ty - Math.sin(ang + 0.45) * hl); x.closePath(); x.fill();
  }
  const last = R.live[R.live.length - 1];
  x.font = `700 ${10 * u}px system-ui, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
  R.order.forEach((c, n) => { const [px, py] = P(c);
    if (c === last && R.order.length > 1) { x.strokeStyle = hot; x.lineWidth = 1.5 * u; x.beginPath(); x.arc(px, py, 10.5 * u, 0, Math.PI * 2); x.stroke(); }
    x.fillStyle = hot; x.beginPath(); x.arc(px, py, 7.5 * u, 0, Math.PI * 2); x.fill(); x.fillStyle = card; x.fillText(String(n + 1), px, py + 0.5 * u); });
}
function showCert() {
  parentJobs();
  const c = BB(), lt = lifeTable(c, S.sex), u5c = 1 - cohortL(S.born, S.sex, 5);
  const pj = [S.fam.mom.job ? L`어머니 ${parentJobName(S.fam.mom)}` : '', S.fam.dad.job && !S.fam.dad.absent ? L`아버지 ${parentJobName(S.fam.dad)}` : ''].filter(Boolean).map((x, i, a) => `<span class="nw">${esc(x)}${i < a.length - 1 ? ' ·' : ''}</span>`).join(' ');
  $('#roller').hidden = true; $('#cert').hidden = false; unlivedPlace();
  $('#certNo').textContent = `No. ${S.born}-${S.by}-${String(ri(1000000, 9999999))}`;
  $('#certName').innerHTML = nameHTML(S.name);
  $('#certStory').textContent = birthStory();
  const pm = UI.prefs.pace || 60, pl = pm === 30 ? "30 phút" : pm === 90 ? "1 giờ 30 phút" : "1 giờ";
  $('#certPace').textContent = L`기대수명까지 살면 약 ${pl}이 걸려요 (1년 ≈ ${Math.round(S.yearSec)}초). 중간에 닫아도 이 브라우저에 저장돼서, 같은 브라우저로 다시 오면 이어서 살 수 있어요.`
    + (S.era === 'past' ? ' ' + L`이번 삶은 ${S.by}년에 시작해 그해부터 실제로 일어난 일을 겪고, ${NOW_Y}년부터는 전망을 따라 삽니다. 돈은 모두 오늘의 물가로 바꿔 보여 드려요.`
      : S.era === 'future' ? ' ' + "Những năm phía trước là một khả năng được vẽ nên từ dự báo dân số của Liên Hợp Quốc và xác suất của lịch sử đã qua. Tiền được hiển thị theo giá cả hôm nay." : '');
  const qd = [1, 2, 3, 4, 5].map(k => `<i class="${k <= S.q ? 'on' : ''}"></i>`).join('');
  $('#certFields').innerHTML = (S.era && S.era !== 'now' ? [["Thế giới nơi chào đời", S.era === 'past' ? L`지난 세상 · ${S.by}년` : L`다가올 세상 · ${S.by}년`]] : []).concat([
    ["Giới tính", S.sex === 'F' ? L`여성${LBL}` : L`남성${LBL}`], ["Quốc gia sinh ra", c.ko], ["Nơi sinh", S.urban ? L`${S.city} (도시)` : ruralLbl()],
    ...(S.flags.royal ? [["gia đình", esc(royalHouse())]] : []), ...(typeof ethG === 'function' && ethG() ? [["Gốc gác gia đình", esc(ethLabel())]] : []),
    ...(typeof casteG === 'function' && casteG() ? [[casteRowName(), esc(casteLabel())]] : []), ...(S.adopt ? [["Nhận nuôi", esc(adoptPlan())]] : []),
    ["Thu nhập gia đình", L`<span class="qdots" aria-label="소득 ${S.q}분위">${qd}</span> ${S.q}분위` + (S.flags.rich ? ` · ${esc(richWord())}` : '')], ["Tuổi bố mẹ", L`어머니 ${S.fam.mom.age}세${S.fam.dad.absent ? '' : L` · 아버지 ${S.fam.dad.age}세`}`], ...(pj ? [["Nghề của bố mẹ", pj]] : []), ["Nhà của bố mẹ", pHomeWord()], ["Tôn giáo", REL[S.rel]],
    ["Tuổi thọ trung bình", L`${leOf(c, S.sex).toFixed(1)}세`], ["Xác suất qua đời trước 5 tuổi", pctStr(u5c, 1)], [S.era === 'past' ? "GDP bình quân đầu người (giá hôm nay)" : "GDP bình quân đầu người (PPP)", usdStr(c.ppp)],
  ]).map(([k, v]) => `<div><span class="lbl">${k}</span><b>${v}</b></div>`).join('');
  const sh = share(c);
  $('#certOdds').innerHTML = S.era === 'past' ? (UI.prefs.mode === 'pop'
    ? L`${S.by}년에 살던 사람 중 <b>${fmtShare(sh)}</b>가 ${esc(c.ko)}에 살았습니다. 약 ${Math.round(1 / sh).toLocaleString('vi-VN')}명 중 1명꼴입니다.`
    : L`${S.by}년에 태어난 아기 중 <b>${fmtShare(sh)}</b>가 ${esc(c.ko)}에서 태어났습니다. 그해 약 ${Math.round(c.b / 1e4).toLocaleString('vi-VN')}만 명, ${Math.round(1 / sh).toLocaleString('vi-VN')}명 중 1명꼴입니다.`)
    : UI.prefs.mode === 'pop'
    ? L`지금 살아 있는 사람 중 <b>${fmtShare(sh)}</b>가 ${esc(c.ko)}에 삽니다. 약 ${Math.round(1 / sh).toLocaleString('vi-VN')}명 중 1명꼴입니다.`
    : L`지금 태어나는 아기 중 <b>${fmtShare(sh)}</b>가 ${esc(c.ko)}에서 태어납니다. 1년에 약 ${Math.round(c.b / 1e4).toLocaleString('vi-VN')}만 명, ${Math.round(1 / sh).toLocaleString('vi-VN')}명 중 1명꼴입니다.`;
  if (!(typeof rohCamp === 'function' && rohCamp())) $('#certOdds').insertAdjacentHTML('beforeend', ' ' + ruralLine());
  $('#certG').innerHTML = guilloche(720, 420);
  try { certMap(); } catch (e) { reportCaught(e); }
  const H0 = S.home && CBY[S.home] ? CBY[S.home] : null, H = H0 && S.era && S.era !== 'now' ? eraAt(H0, S.by) : H0, hc = $('#certHome');
  if (H) {
    hc.hidden = false;
    const G = !!S.homeG, rows = [["Tuổi thọ trung bình", L`${leOf(H, S.sex).toFixed(1)}세`, L`${leOf(c, S.sex).toFixed(1)}세`], ["Xác suất qua đời trước 5 tuổi", pctStr(1 - cohortL(H.id, S.sex, 5), 1), pctStr(u5c, 1)], ["Số năm đi học kỳ vọng", L`${H.eys}년`, L`${c.eys}년`], ["GDP bình quân đầu người (PPP)", usdStr(H.ppp), usdStr(c.ppp)]].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
    hc.innerHTML = (H.id === c.id ? (G ? capS(L`당신이 태어난 곳으로 짐작한 <b>${esc(H.ko)}</b>에서 태어났습니다.` + ' ' + "Cùng một đất nước, khác mái nhà, khác cuộc đời.") : L`당신이 실제로 태어난 <b>${esc(H.ko)}</b>에서 태어났습니다. 같은 나라, 다른 집, 다른 삶입니다.`)
      : G ? L`<table><thead><tr><th>같은 날 태어났다면</th><th>당신이 태어난 ${esc(H.ko)}(추정)</th><th>이 아이의 ${esc(c.ko)}</th></tr></thead><tbody>${rows}</tbody></table>`
      : L`<table><thead><tr><th>같은 날 태어났다면</th><th>당신이 태어난 ${esc(H.ko)}</th><th>이 아이의 ${esc(c.ko)}</th></tr></thead><tbody>${rows}</tbody></table>`) + (G ? homeGuessNote() : '');
  } else hc.hidden = true;
  $('#certComps').innerHTML = S.comps && S.comps.length ? L`<span class="lbl">같은 1초에 지구 어딘가에서 태어난 사람들</span><ul>${S.comps.map(cp => `<li><b>${esc(cp.name.full)}</b><span>${cp.urban && cp.city ? esc(cityIn(CBY[cp.iso].ko, cp.city)) : esc(CBY[cp.iso].ko) + " (nông thôn)"} · ${cp.sex === 'F' ? "Nữ" : "Nam"} · ${QSHORT_E[cp.q]}</span></li>`).join('')}</ul><p>이들의 삶도 같은 통계를 따라 끝까지 흘러갑니다. 당신 곁에서 함께 보여 드릴게요.</p>` : '';
  prepCard('birth');
  { const ft = $('#cert .foot'); let hb = $('#certHome2'); if (STANDALONE && ft && !hb) { ft.insertAdjacentHTML('afterbegin', `<button class="ghost" id="certHome2" aria-label="${esc("Về màn hình đầu")}">← <span class="chl">${"Về màn hình đầu"}</span></button>`); } }
  save();
}
function beginLife() {
  S.phase = 'life'; S.t = 0; S.startedAt = Date.now();
  { const ln = $('#tgLine'); if (ln) ln.hidden = true; }
  track('life_begin', { rolls: lsGet(ROLL_KEY, 1), repl: lsGet(REPL_KEY, null) }); lsSet(ROLL_KEY, 0); lsDel(REPL_KEY); askKeepStore();
  { const pre = S.log.splice(0); log(birthStory(), 'big'); S.log.push(...pre); }
  show('lifeview');
  feedReset();
  S.log.slice().reverse().forEach(e => addFeed(e, true));
  const sp = UI.prefs.speed;
  if (SPEEDS.includes(sp) && sp > 1) { S.speed = sp; if (!UI.prefs.spTold) { UI.prefs.spTold = 1; lsSet(PREF_KEY, UI.prefs); toast(L`지난번에 고른 ${sp}× 속도로 흘러가요. 위에서 언제든 바꿀 수 있어요.`, 4200); } }
  renderAll(); save();
}
const SPEEDS = [1, 2, 4, 8, 12, 16];
function setSpeed(sp) {
  if (!S || !SPEEDS.includes(sp)) return;
  S.speed = sp; S.paused = false; S.ff = false; UI.prefs.speed = sp; lsSet(PREF_KEY, UI.prefs); speedHint(false); renderTop();
}
function speedHint(show) {
  const h = $('#speedHint'), b = document.querySelector('[data-speed="4"]'); if (!h) return;
  clearTimeout(UI.speedHintT);
  if (!show) { h.hidden = true; for (const x of document.querySelectorAll('.speed .hl')) x.classList.remove('hl'); return; }
  UI.prefs.speedHint = 1; lsSet(PREF_KEY, UI.prefs);
  h.textContent = "Muốn nhanh hơn, hãy nhấn 4× hoặc 8×. Mỗi khi có quyết định quan trọng, thời gian sẽ dừng lại.";
  h.hidden = false;
  if (b) { b.classList.add('hl'); h.style.setProperty('--ax', Math.round(b.offsetLeft + b.offsetWidth / 2) + 'px'); }
  UI.speedHintT = setTimeout(() => speedHint(false), 9000);
}
const speedHintDue = () => S && S.age === 0 && S.t > 0.35 && S.speed === 1 && !S.paused && !S.ff && !S.pending && !S.replay
  && UI.prefs.speed == null && !UI.prefs.speedHint && !UI.prefs.auto && $('#modal').hidden;
function statusLine() {
  const parts = [];
  const j = JOBS[S.job];
  if (S.age < 6) parts.push(S.flags.kinder ? "Học mẫu giáo" : "Em bé");
  else if (S.serveLeft > 0) parts.push("<b>Đang đi nghĩa vụ quân sự</b>");
  else if (S.school) parts.push(S.schoolY < 0 ? "<b>Khóa học ngôn ngữ</b>" : L`<b>${EDU_NOW[S.school]} ${S.schoolY + 1}학년</b>`);
  else if (S.retired) parts.push("<b>Đã nghỉ hưu</b>");
  else if (j) { const sj = shortJob(S.job), jn = frSx(sj && sj !== j.n.replace(/ \(.*\)$|（.*）$/, '') ? sj : j.n, S.sex); parts.push(`<b>${esc(jn)}</b>${isWorking() ? L` · ${S.jobY + 1}년차 · ${['owner', 'agbiz'].includes(S.job) ? "tự kinh doanh" : S.formal ? "việc làm chính thức" : "việc làm phi chính thức"}` + ownStaffTag() : ''}`); }
  if (S.office && S.office.lvl === 1) parts.push(`<b>${esc(localWord())}</b>`);
  const sa = studyAway();
  parts.push(sa ? (awayTrainee() ? L`${esc(studyCity())} · ${esc(CBY[sa].ko)} 연습생 숙소` : L`${esc(studyCity())} · ${esc(CBY[sa].ko)} 유학 중`) : `${esc(S.urban ? (S.city || "thành phố") : ruralLbl())} · ${esc(C().ko)}`);
  if (S.fam.married) parts.push(({ m: "Đã kết hôn", cp: "Đã đăng ký chung sống", none: "Chung sống với bạn đời" })[unionOf()]); else if (S.fam.widowed) parts.push("Góa");
  const k = S.fam.kids.filter(x => x.alive).length; if (k) parts.push(L`자녀 ${k}명`);
  if (S.refugee) parts.push("<b>Đang tị nạn</b>");
  return parts.join(' · ');
}
function renderTop() {
  $('#ageNum').innerHTML = L`${S.age}<small>세</small>`;
  const yr = S.by + S.age, et = eraTag(yr);
  $('#ageYear').textContent = et ? L`${yr}년 · ${et} · ${S.name.full} · 1년 ≈ ${Math.round(S.yearSec / S.speed)}초` : L`${S.by + S.age}년 · ${S.name.full} · 1년 ≈ ${Math.round(S.yearSec / S.speed)}초`;
  setBar($('#prog'), S.t);
  for (const b of document.querySelectorAll('[data-speed]')) b.setAttribute('aria-pressed', String(!S.paused && !S.ff && +b.dataset.speed === S.speed));
  { const w = S.paused ? "Tiếp tục" : "Tạm dừng", pb = $('#pauseBtn'); pb.innerHTML = (S.paused ? '▸' : '❚❚') + `<span class="pzl"> ${w}</span>`; pb.setAttribute('aria-label', w); }
  $('#pauseBtn').setAttribute('aria-pressed', String(S.paused));
  $('#ffBtn').setAttribute('aria-pressed', String(!!S.ff));
  $('#autoBtn').setAttribute('aria-pressed', String(!!UI.prefs.auto));
  const pq = $('#pauseQ'), pOn = UI.prefs.reflect !== false; if (pq) { pq.setAttribute('aria-pressed', String(pOn)); pq.textContent = pOn ? "✎ Ghi suy nghĩ" : "✎ Ghi suy nghĩ: tắt"; }
  const mb = $('#moreBtn'); if (mb) mb.classList.toggle('on', !!UI.prefs.auto);
}
function portrait() {
  const a = S.age; const s = a < 3 ? 0.55 : a < 12 ? 0.72 : a < 18 ? 0.88 : 1;
  const hy = 34 + (1 - s) * 20, hr = 13 * (a < 3 ? 1.15 : 1) * Math.max(0.8, s);
  const sh = `M${32 - 26 * s} 96 C ${32 - 26 * s} ${hy + 30} ${32 + 26 * s} ${hy + 30} ${32 + 26 * s} 96 Z`;
  const hair = a > 70 ? 'opacity:.35' : '';
  return `<svg viewBox="0 0 64 80" aria-hidden="true"><g fill="currentColor" style="color:var(--ink3)"><circle cx="32" cy="${hy}" r="${hr}" style="${hair}"/><path d="${sh}" transform="translate(0,-16)" opacity=".7"/></g></svg>`;
}
let idPicKey = '';
function renderPortrait() {
  const el = $('#portrait'); if (!el) return;
  let m = null; try { m = sceneModel(); } catch (e) { m = null; }
  const a = S.age, band = a < 1 ? 0 : a < 3 ? 1 : a < 7 ? 2 : a < 13 ? 3 : a < 18 ? 4 : a < 65 ? 5 : 6;
  const key = JSON.stringify([band, meSex(), m && [m.region, m.urban, m.home, m.stage, m.seed, m.car, m.moto]]);
  if (key === idPicKey && el.firstChild) return;
  idPicKey = key;
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 160;
  let ok = false;
  try { ok = typeof cardPortraitPx === 'function' && cardPortraitPx(cv.getContext('2d'), 0, 0, cv.width, cv.height, a); } catch (e) { ok = false; }
  if (ok) { el.textContent = ''; el.appendChild(cv); } else el.innerHTML = portrait();
}
function mrz() {
  const latin = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  const nm = latin(S.name.base || '') + '<<' + latin(S.name.g || '');
  const l1 = ('I<' + S.born + (nm.length > 4 ? nm : '<<<<') + '<'.repeat(40)).slice(0, 36);
  const l2 = (String(S.by).slice(2) + String(S.bm).padStart(2, '0') + '01' + (meSex() === 'F' ? 'F' : 'M') + S.cur + '<' + String(S.age).padStart(3, '0') + '<'.repeat(40)).slice(0, 36);
  return esc(l1) + '<br>' + esc(l2);
}
function nameKana(n) { return ''; }
function nameHTML(n) { const k = nameKana(n); return k ? `<ruby>${esc(n.full)}<rt>${esc(k)}</rt></ruby>` : esc(n.full); }
function renderId() {
  $('#idTop').innerHTML = L`<span>신원 기록 · ${esc(S.born)}</span><span>${S.by}</span>`;
  renderPortrait();
  $('#idName').innerHTML = nameHTML(S.name);
  $('#idDl').innerHTML = idRows().map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
  $('#mrz').innerHTML = mrz();
  $('#idG').innerHTML = guilloche(320, 220);
}
const richWord = () => S.flags.rich === 2 ? "gia đình thuộc nhóm 0,1% giàu nhất" : "gia đình thuộc nhóm 1% giàu nhất";
function jobNow() {
  if (!S || (S.age < 15 && S.job !== 'childwork') || S.school || S.serveLeft > 0) return '';
  if (S.retired || S.job === 'retired') return lastWorkLabel();
  const j = JOBS[S.job]; if (!j || S.job === 'student') return '';
  const sj = shortJob(S.job); return frSx(sj && sj !== j.n.replace(/ \(.*\)$|（.*）$/, '') ? sj : j.n, S.sex);
}
function idRows() {
  const c = C(), b = B();
  const qd = [1, 2, 3, 4, 5].map(k => `<i class="${k <= S.q ? 'on' : ''}"></i>`).join('');
  return [
    ["Giới tính", meSex() === 'F' ? L`여성${LBL}` : L`남성${LBL}`], ["Sinh", L`${bornKo(typeof adoptFrom === 'function' && adoptFrom() ? CBY[adoptFrom()] : b, S.by)} · ${S.by}년 ${S.bm}월`], ["Nơi sống", studyWhere() ? (awayTrainee() ? L`${studyCity()}, ${CBY[studyWhere()].ko} (연습생)` : L`${studyCity()}, ${CBY[studyWhere()].ko} (유학)`) : `${S.urban ? (S.city || "thành phố") : "nông thôn"}, ${c.ko}${S.mig ? " (di cư)" : ''}`],
    ...(S.flags.natz && S.flags.natz !== S.born && CBY[S.flags.natz] ? [["Quốc tịch", L`${CBY[S.flags.natz].ko} (귀화)`]] : S.mig && S.flags.pr != null ? [["Quốc tịch", L`${b.ko} · ${c.ko} 영주권`]] : []),
    ...(S.flags.natName ? [["Tên khi nhập tịch", esc(S.flags.natName)]] : []),
    ...(typeof disLabel === 'function' && disLabel() ? [["Khuyết tật", esc(disLabel())]] : []),
    ...(typeof ethG === 'function' && ethG() ? [["Gốc gác gia đình", esc(ethLabel())]] : []), ...(S.flags.royal ? [["gia đình", esc(royalHouse())]] : []),
    ...(typeof casteG === 'function' && casteG() ? [[casteRowName(), esc(casteLabel())]] : []), ...(S.adopt ? [["Nhận nuôi", esc(adoptLabel())]] : []),
    ...(typeof fcLabel === 'function' && fcLabel() ? [["Nuôi dưỡng tạm thời", esc(fcLabel())]] : []),
    ["Tôn giáo", relName() + (S.flags.conv && REL[S.flags.conv.from] && S.flags.conv.from !== S.rel ? ` <small>${esc(L`(${REL[S.flags.conv.from]}에서)`)}</small>` : '')], ["Hoàn cảnh gia đình", `<span class="qdots">${qd}</span>` + (S.flags.rich ? ` <small>${esc(richWord())}</small>` : '')], ["Học vấn", S.age < 6 && !S.school ? "Chưa đi học" : eduLbl() + (S.major && (S.edu >= 4 || S.school === 'uni' || S.school === 'grad') ? ` · ${MAJORS[S.major].n}` : '') + (S.school ? L` (${EDU_NOW[S.school]} 재학)` : '')],
    ...(jobNow() ? [["Nghề nghiệp", esc(capS(jobNow()))]] : []),
    ...(TMPR_ID()[S.trait && (S.trait.k || S.trait)] ? [["Tính khí", esc(TMPR_ID()[S.trait.k || S.trait])]] : []),
    ...((S.flags.talShown || []).some(k => TAL_ID()[k]) ? [["Năng khiếu", esc(capS(listAnd(S.flags.talShown.filter(k => TAL_ID()[k]).map(k => lcVi(TAL_ID()[k])))))]] : []),
  ];
}
const TMPR_ID = () => ({ cur: "Tò mò", act: "Năng động", warm: "Ấm áp", grit: "Kiên trì" });
const TAL_ID = () => ({ st: "Học tập", bd: "vận động thể chất", ar: "vẽ", mu: "Âm nhạc", hd: "khéo tay", wd: "giao tiếp với mọi người" });
const STATS = [['hl', "Sức khỏe", '--good'], ['h', "Hạnh phúc", '--gold'], ['sm', "Kiến thức", '--stamp'], ['so', "Quan hệ", '--accent']];
const dayInc = inc => inc > 0 && inc < 2200 ? L` · 하루 약 ${'$' + (inc / 365).toFixed(1)}` : '';
const THEME_NEXT = { auto: 'dark', dark: 'light', light: 'auto' };
function applyTheme() {
  const t = UI.prefs.theme === 'dark' || UI.prefs.theme === 'light' ? UI.prefs.theme : 'auto', el = document.documentElement;
  if (t === 'auto') delete el.dataset.theme; else el.dataset.theme = t;
  if (typeof $ === 'function' && $('#lifeMap')) { try { drawLifeMap(); } catch (e) { } }
  const lab = { auto: "Sáng hay tối: theo thiết bị", dark: "Sáng hay tối: tối", light: "Sáng hay tối: sáng" }[t], ic = { auto: '◐', dark: '☾', light: '☀' }[t];
  const b = $('#themeBtn'); if (b) { b.innerHTML = `<span aria-hidden="true">${ic}</span>`; b.setAttribute('aria-label', lab); b.title = lab; }
  const b2 = $('#themeBtn2'); if (b2) { b2.innerHTML = `<span aria-hidden="true">${ic}</span><span class="tbl"> ${esc({ auto: "Màn hình: tự động", dark: "Màn hình: tối", light: "Màn hình: sáng" }[t])}</span>`; b2.setAttribute('aria-label', lab); b2.title = lab; }
}
function cycleTheme() {
  const t = UI.prefs.theme === 'dark' || UI.prefs.theme === 'light' ? UI.prefs.theme : 'auto';
  UI.prefs.theme = THEME_NEXT[t] === 'auto' ? undefined : THEME_NEXT[t]; lsSet(PREF_KEY, UI.prefs);
  applyTheme();
  try { if (typeof TG !== 'undefined') { TG.base = null; if (typeof tgSize === 'function') tgSize(); } } catch (e) { }
  try { idPicKey = ''; if (S && (UI.view === 'lifeview' || UI.view === 'death')) renderAll(); } catch (e) { }
  toast({ auto: "Màn hình giờ sẽ sáng hay tối theo cài đặt của thiết bị.", dark: "Đã chuyển sang màn hình tối.", light: "Đã chuyển sang màn hình sáng." }[THEME_NEXT[t]]);
}
function renderStats() {
  $('#statBars').innerHTML = STATS.map(([k, n, col]) => `<div class="stat"${k === 'sm' ? ` title="${esc("Kiến thức: vị trí của bạn so với những người cùng tuổi (100 là cao nhất)")}"` : ''}><span>${n}</span><span class="bar"><i style="width:${S.st[k].toFixed(0)}%;background:var(${col})"></i></span><span class="v">${Math.round(S.st[k])}</span></div>`).join('');
  const c = C(); const adult = S.age >= 15;
  const nw = netWorth(); const inc = S.income;
  const atLim = adult && S.money < 0 && typeof creditLimit === 'function' && S.money <= -creditLimit() * 0.98;
  const wq = adult && nw > 0 ? wealthTop(c, nw) : null;
  let mh = L`<div><small>순자산 (한국 체감)</small><b>${adult ? wonStr(nw) : '—'}</b><small>${adult ? (atLim ? "Không còn ai cho vay thêm. Chi tiêu bị cắt giảm thay vì nợ tăng thêm" : usdStr(nw) + ' PPP' + (wq != null ? ' · ' + L`${c.ko} 재산 ${topStr(wq)}` : '')) : "Vẫn sống cùng bố mẹ"}</small></div>`;
  const P = S.fam.partner, pInc = S.fam.married && P && P.alive && P.inc > 0 ? P.inc : 0;
  mh += L`<div><small>연 소득 (한국 체감)</small><b>${inc > 0 ? wonStr(inc) : '—'}</b><small>${inc > 0 ? usdStr(inc) + ' PPP · ' + L`월 ${wonStr(inc / 12)}` + dayInc(inc) : (S.age < 15 ? L`가정 형편 ${S.q}분위` : pInc ? "Sống bằng thu nhập của bạn đời" : "Không có thu nhập")}</small></div>`;
  if (adult && S.money < 0) { const d = -S.money, hv = S.house + rentV(), bk = S.flags.bizKeep ? S.flags.bizKeep.v || 0 : 0;
    const t = hv > 0 && bk > 0 ? L`${wonStr(d)} (집 대출 포함) · 순자산은 집값 ${wa(wonStr(hv))} 사업체 지분 ${wonStr(bk)}에서 빚을 뺀 금액이에요`
      : hv > 0 ? L`${wonStr(d)} (집 대출 포함) · 순자산은 집값 ${wonStr(hv)}에서 빚을 뺀 금액이에요` : bk > 0 ? L`${wonStr(d)} · 순자산은 사업체 지분 ${wonStr(bk)}에서 빚을 뺀 금액이에요` : wonStr(d);
    mh += `<div class="owns" style="grid-column:1/-1"><small>${"Nợ"}</small><span>${t}</span></div>`; }
  if (pInc && S.age >= 18) mh += L`<div style="grid-column:1/-1"><small>배우자 소득 (한국 체감)</small><b style="font-size:15px">${wonStr(pInc)}</b><small>${usdStr(pInc)} PPP · 월 ${wonStr(pInc / 12)}</small></div>`;
  if (inc > 0) mh += L`<div style="grid-column:1/-1"><small>소득 위치</small><b style="font-size:15px">${c.ko} ${rankStr(pctOfIncome(c, inc))} · 세계 ${rankStr(worldPct(inc))}</b></div>`;
  else if (pInc && S.age >= 18) mh += L`<div style="grid-column:1/-1"><small>배우자 소득 위치</small><b style="font-size:15px">${c.ko} ${rankStr(pctOfIncome(c, pInc))} · 세계 ${rankStr(worldPct(pInc))}</b></div>`;
  const lf = S.lastFl; if (adult && lf && lf.it.length) mh += L`<div class="flow" style="grid-column:1/-1"><small>지난 1년 순자산 ${lf.d >= 0 ? '+' : '−'}${wonStr(Math.abs(lf.d))}</small><ul>${lf.it.map(([k, v]) => `<li><span>${esc(k)}</span><b class="${v < 0 ? 'neg' : 'pos'}">${v < 0 ? '−' : '+'}${wonStr(Math.abs(v))}</b></li>`).join('')}</ul></div>`;
  if (adult) { const own = ownList(); if (own.length) mh += `<div class="owns" style="grid-column:1/-1"><small>${"Những thứ bạn có"}</small><span>${own.map(esc).join(' · ')}</span></div>`; }
  if (adult && S.phase === 'life') { const cm = S.urban && isWorking() && !S.nomad && CITIES[S.cur] && !nearWork() && !homeWork() && S.flags.comm && S.flags.comm.m != null && S.flags.comm.k === workKey() ? commuteMin() : 0;
    mh += `<div class="owns" style="grid-column:1/-1"><small>${"Phương tiện đi lại"}</small><span>${esc(capS(wayName()))}${cm ? ' · ' + esc(L`출퇴근 하루 ${minStr(cm)}`) : ''}</span></div>`; }
  if (S.age >= 15 && S.phase === 'life') mh += L`<div style="grid-column:1/-1"><button class="ghost shopbtn" id="shopBtn">돈 쓰기 · 투자${S.invest ? ` <small>(${INV_N[S.invest]})</small>` : ''}</button></div>`;
  $('#money').innerHTML = mh;
  const mhp = $('#moneyHelp');
  if (mhp) { mhp.hidden = !adult || L_WEST; if (!mhp.hidden && !mhp.dataset.f) { mhp.dataset.f = 1; mhp.innerHTML = `<summary>${"Số tiền được tính thế nào?"}</summary><p>${esc(capS("Tiền trong cuộc đời này là những gì số tiền ấy mua được ở nơi bạn sống, quy theo giá cả ở Việt Nam." + ' ' + L`작은 글씨의 달러(PPP)는 구매력으로 맞춘 달러로, 1달러가 약 ${wonStr(1)}이에요.` + ' ' + "Con số này khác tỷ giá thị trường ở ngân hàng vì cùng một số tiền mua được những thứ khác nhau ở mỗi nước."))}</p>`; } }
  const fm = $('#feedMoney');
  if (fm) {
    fm.hidden = !(adult && S.phase === 'life');
    const fj = inc > 0 && isWorking() ? jobNow() : '';
    if (!fm.hidden) fm.innerHTML = L`<span>순자산 <b>${wonStr(nw)}</b>${lf ? L` <small>(지난 1년 ${lf.d >= 0 ? '+' : '−'}${wonStr(Math.abs(lf.d))})</small>` : ''}</span><span>${inc > 0 ? (fj ? esc(capS(fj)) + ' · ' : '') + L`소득 <b>월 ${wonStr(inc / 12)}</b>` + dayInc(inc) : pInc ? "Sống bằng thu nhập của bạn đời" : "Không có thu nhập"}</span>${S.money < 0 ? `<span>${L`남은 빚 <b>${wonStr(-S.money)}</b>`}</span>` : ''}<span class="fm-bt">${S.age >= 15 ? "<button class=\"ghost sm fm-more\" id=\"fmShop\">Chi tiêu</button>" : ''}<button class="ghost sm fm-more" id="fmMore">자세히</button></span>`;
  }
  const sp = $('#spend');
  if (inc > 0) {
    const kidsN = S.fam.kids.filter(k => k.alive && S.age - k.bornAt < 18).length, x = inc / incomeAt(c, 0.5);
    const tax = taxRate(c, inc, S.retired ? false : S.formal !== false || c.p === 'hi' || c.p === 'eca') * (S.retired ? 0.5 : 1);
    const sv = clamp(S.lastSave / inc, 0, 0.9), cons = Math.max(0, 1 - tax - sv);
    const way = wayOf(), tr = way === 'car' ? 0.16 : way === 'moto' ? 0.07 : way === 'transit' ? 0.05 : 0.02;
    const food = engel(inc), house = (0.2 + (S.urban ? 0.06 : 0)) * clamp(1 - 0.08 * Math.log(x), 0.75, 1.1) * (S.house > 0 && S.money >= 0 ? 0.45 : 1), hlth = 0.04 + 0.06 * c.oop / 100, kids = Math.min(0.2, 0.06 * kidsN);
    const other = Math.max(0, 1 - food - house - tr - hlth - kids);
    const segs = [["Thuế và bảo hiểm xã hội", tax, '--ink3'], ["Ăn uống", food * cons, '--gold'], ["Nhà ở", house * cons, '--accent'], ["Đi lại", tr * cons, '--stamp'], ["Y tế", hlth * cons, '--bad'], ["Con cái và học hành", kids * cons, '--good'], ["Quần áo, giải trí, điện thoại v.v.", other * cons, '--rule'], ["Tiết kiệm", sv, '--ink']].filter(x => x[1] > 0.005);
    const tot = segs.reduce((s, x) => s + x[1], 0);
    sp.hidden = false;
    sp.innerHTML = `<div class="lbl" style="margin-bottom:6px">${"Thu nhập một năm được chi vào đâu (ước tính)"}</div><div class="sbar">${segs.map(x => `<i style="width:${(x[1] / tot * 100).toFixed(1)}%;background:var(${x[2]})"></i>`).join('')}</div><div class="keys">${segs.map(x => `<span style="--c:var(${x[2]})">${x[0]} ${Math.round(x[1] / tot * 100)}%</span>`).join('')}</div>`;
  } else sp.hidden = true;
}
function renderFamily() { $('#fam').innerHTML = famRowsHTML(famRows()); }
const famRowsHTML = rows => rows.map(([a, b]) => `<div class="row"><span>${a}</span><span>${b}</span></div>`).join('');
function deadFamHTML() {
  let rows;
  try { const skip = new Set(["Giới tính", "Sinh", "Học vấn", "Nghề nghiệp"]); rows = idRows().filter(([k]) => !skip.has(k)).concat(famRows()); } catch (e) { reportCaught(e); return ''; }
  return `<div class="panel deadfam"><h3><span>${"Gia đình và cuộc sống"}</span><span class="lbl">${"như ở năm cuối cùng"}</span></h3><div class="fam">${famRowsHTML(rows)}</div></div>`;
}
const LB_MAX = 3, GV_LB = 12, GV_SO = 85;
function lbAvg(f, a0, a1) { let t = 0, n = 0; for (const y of S.years) if (y.a >= a0 && y.a <= a1 && y.mk !== 'death' && typeof y[f] === 'number') { t += y[f]; n++; } return n ? t / n : null; }
function lookLines() {
  const d = S.deathAt; if (!d || d.age < 25) return [];
  const age = d.age, c = C(), med = incomeAt(c, 0.5), nw = netWorth(), q = nw > 0 ? wealthTop(c, nw) : null;
  const rich = q != null || nw >= 12 * med, modest = nw < 2 * med && age >= 50, top = q != null ? topStr(q) : null, cty = c.ko;
  const o = peopleOf(S, age), apart = o.pt === 'apart';
  let ho = null; try { ho = homeOthers(); } catch (e) { }
  const alone = !!ho && age >= 40 && !ho.pt && !ho.kids.length && !ho.mom && !ho.dad && S.flags.oldHome !== 'care' && S.job !== 'prison';
  const kids = S.fam.kids.filter(k => k.alive && age - k.bornAt >= 18), sc = kids.map(k => bondScore(k, 'kid'));
  const far = sc.filter(x => x < 4).length, near = sc.filter(x => x >= 26).length;
  const kidsFar = kids.length > 0 && far >= 1 && far * 2 >= kids.length, kidsNear = kids.length > 0 && near * 2 > kids.length, kidsAll = kids.length >= 2 && near === kids.length;
  const fY = S.stats.fY && S.stats.fYa != null && S.stats.fYa <= 18 ? S.stats.fY : {}, yrs = k => Math.round(fY[k] || 0);
  const workY = yrs('work'), famY = yrs('family'), hlY = yrs('health');
  const base = lbAvg('hl', 30, 40); let hdA = null;
  if (base != null) for (const y of S.years) if (y.a >= 40 && y.a <= Math.min(62, age - 1) && y.hl <= base - 20 && y.hl < 55) { hdA = y.a; break; }
  const out = [], add = (t, k) => { if (t && !out.some(o => o.t === t)) out.push({ t, k }); };
  if (rich) {
    if (kidsFar) add(top ? L`재산은 ${cty} ${top}에 들 만큼 모았지만, 자녀들과는 서먹한 사이로 남았습니다.` : "Đã tích lũy được một khối tài sản dư dả, nhưng với các con thì vẫn xa cách.", 'm');
    else if (alone && !kidsNear) add(top ? L`재산은 ${cty} ${top}에 들 만큼 모았지만, 마지막 해에는 함께 사는 사람이 없었습니다.` : "Đã tích lũy được một khối tài sản dư dả, nhưng năm cuối đời không có ai sống cùng.", 'm');
    else if (apart) add(top ? L`재산은 ${cty} ${top}에 들 만큼 모았지만, 함께하던 사람과는 헤어졌습니다.` : "Đã tích lũy được một khối tài sản dư dả, nhưng đã chia tay người từng gắn bó.", 'm');
    if (hdA != null) add(top ? L`재산은 ${cty} ${top}에 들 만큼 모았지만, 건강은 ${hdA}세 무렵부터 눈에 띄게 나빠졌습니다.` : L`넉넉한 재산을 모았지만, 건강은 ${hdA}세 무렵부터 눈에 띄게 나빠졌습니다.`, 'm');
  }
  if (workY >= 12) {
    if (hdA != null && !rich) add(L`일에 몰두한 해가 ${workY}년이었고, 건강은 ${hdA}세 무렵부터 눈에 띄게 나빠졌습니다.`, 'm');
    if (!rich && famY <= 3) { if (kidsFar) add(L`일에 몰두한 해가 ${workY}년이었고, 자녀들과는 서먹한 사이로 남았습니다.`, 'm'); else if (apart) add(L`일에 몰두한 해가 ${workY}년이었고, 함께하던 사람과는 헤어졌습니다.`, 'm'); }
  }
  if (modest && !kidsFar) { if (kidsAll) add(L`재산은 많지 않았지만, 아이 ${kids.length}명 모두와 마지막까지 가까웠습니다.`, 'k'); else if ((ho && (ho.pt || ho.kids.length)) || kidsNear) add("Tài sản không nhiều, nhưng đến cuối đời vẫn có gia đình ở bên.", 'k'); }
  const gvY = S.stats.gvY || 0, soEnd = lbAvg('so', age - 8, age); let gave = false;
  if (gvY >= GV_LB) {
    if (kidsAll) { add(L`가족과 친구를 챙긴 해가 ${gvY}년이었고, 아이 ${kids.length}명 모두와 마지막까지 가까웠습니다.`, 'k'); gave = true; }
    else if (kidsNear) { add(L`가족과 친구를 챙긴 해가 ${gvY}년이었고, 아이들과는 마지막까지 가까웠습니다.`, 'k'); gave = true; }
    else if (!kidsFar && soEnd != null && soEnd >= GV_SO) { add(L`가족과 친구를 챙긴 해가 ${gvY}년이었고, 마지막 몇 해까지 가깝게 지내는 사람이 많았습니다.`, 'k'); gave = true; }
  }
  if (!gave && famY >= 15 && kidsNear && !modest) add(L`가족·친구에 쓴 해가 ${famY}년이었고, 아이들과는 마지막까지 가까웠습니다.`, 'k');
  { const e0 = lifeTable(BB(), S.sex).e0; if (hlY >= 10 && age >= e0 + 5) add(L`건강 관리에 쓴 해가 ${hlY}년이었고, 같은 해 태어난 사람들의 기대수명보다 ${Math.round(age - e0)}년 더 살았습니다.`, 'k'); }
  const offWork = S.retired && workY >= 12;
  if (age >= 60) { const s40 = lbAvg('so', 35, 45), sEnd = lbAvg('so', age - 8, age); if (s40 != null && sEnd != null) { if (s40 - sEnd >= 20) add("Khoảng tuổi bốn mươi, xung quanh có nhiều người thân thiết; những năm cuối, số người gặp gỡ ít dần.", 'm'); else if (sEnd - s40 >= 15) add(offWork ? "Sau khi gác lại công việc, mối quan hệ với mọi người càng gần gũi hơn." : "Càng có tuổi, mối quan hệ với mọi người càng gần gũi hơn.", 'k'); } }
  if (age >= 55) { const hEnd = lbAvg('h', age - 10, age - 1), hMid = lbAvg('h', 30, age - 11); if (hEnd != null && hMid != null) { if (hEnd - hMid >= 10) add(offWork ? "Những ngày sau khi gác lại công việc bình yên hơn trước." : "Mười năm cuối bình yên hơn những năm trước đó.", 'k'); else if (hMid - hEnd >= 15) add("Mười năm cuối có nhiều ngày khó khăn hơn những năm trước đó.", 'm'); } }
  { let pk = null, hp = null; for (const y of S.years) if (y.mk !== 'death') { if (y.a >= 18 && (!pk || y.inc > pk.inc)) pk = y; if (!hp || y.h > hp.h) hp = y; }
    if (pk && hp && pk.inc > 0 && hp.a >= 18 && Math.abs(pk.a - hp.a) >= 10) add(L`가장 많이 번 해는 ${pk.a}세, 가장 행복했던 해는 ${hp.a}세였습니다.`); }
  const kept = out.filter(o => o.k === 'k'), mir = out.filter(o => o.k === 'm'), rest = out.filter(o => !o.k);
  return [...kept.slice(0, 1), ...mir, ...kept.slice(1), ...rest].slice(0, LB_MAX).map(o => o.t);
}
const EGG_NM = () => ({ pope: "Giáo hoàng", nobel: "Giải Nobel", fields: "Huy chương Fields", turing: "Giải Turing", oscar: "Giải Oscar", grammy: "Giải Grammy", comet: "Phát hiện thiên thể mới", dino: "Phát hiện loài khủng long mới",
  species: "Loài sinh vật mang tên bạn", relic: "Phát hiện cổ vật", meteor: "Thiên thạch", rescue: "Ngày bạn cứu một người", named: "Nơi mang tên bạn" });
function eggsHTML() {
  if (S.deathAt && S.deathAt.cause === 'suic') return '';
  const E = (S.log || []).filter(e => e.egg); if (!E.length) return '';
  const N = EGG_NM(), f = S.flags || {};
  const nm = id => id === 'nobel' && f.nobelF && typeof NOBEL_N === 'function' ? L`노벨 ${NOBEL_N()[f.nobelF]}` : id === 'grammy' && f.grammyL ? "Giải Grammy Latin" : N[id] || "Easter egg";
  return `<div class="panel eggpan"><h3><span>${"Những easter egg tìm thấy trong cuộc đời này"}</span></h3><ul>${E.map(e => `<li><span class="egg">${esc(nm(e.egg))}</span><span class="a">${esc(L`${Math.floor(+e.a) || 0}세`)}</span><span>${esc(e.text)}</span></li>`).join('')}</ul>`
    + `<p class="eggnote">${"Những khoảnh khắc vô cùng hiếm, chỉ xảy ra với tần suất đúng như ở thế giới thực."}</p></div>`;
}
function tdHTML() {
  const x = S && S.deathAt && S.deathAt.cause !== 'suic' && typeof tdEnd === 'function' ? tdEnd() : null; if (!x) return '';
  const li = e => `<li><b>${L`${Math.floor(+e.a) || 0}세`}</b> ${esc(e.text)}</li>`, list = x.hits && x.hits.length ? `<ul>${x.hits.map(li).join('')}</ul>` : '';
  const body = x.happy ? `<p>${L`이 삶이 가장 행복했던 해는 ${x.best}세 무렵이었습니다.`}</p>${list}`
    : x.heavy ? `<p>${esc(x.say)}</p>${list ? `<p class="td-sub">${"Những khoảnh khắc tâm sự và ở bên nhau trong cuộc đời này"}</p>${list}` : ''}`
    : list ? `<p class="td-sub">${"Những lúc cuộc đời này gặp chủ đề hôm nay"}</p>${list}` : `<p>${esc(x.far)}</p>`;
  return `<div class="panel tdpan"><h3><span>${"Chủ đề hôm nay"}</span><span class="lbl">${esc(x.title)}</span></h3>${body}${x.f ? `<p class="td-f">${esc(x.f)}</p>` : ''}${x.help ? `<p class="td-help">${esc(x.help)}</p>` : ''}${x.heavy || x.happy ? '' : '<p class="td-tally" id="tdTally" hidden></p>'}</div>`;
}
const TD = { t: null };
function tdTally(t) {
  if (t && typeof t === 'object') TD.t = t;
  const el = $('#tdTally'), x = TD.t, w = typeof tdWire === 'function' && tdWire(); if (!el || !x || !w || x.k !== w.slice(0, -2)) return;
  const n = (+x.m || 0) + (+x.f || 0), T = TD_TH[S.td.k]; if (n < 30 || !T) return;
  const p = Math.round(100 * (+x.m || 0) / n);
  el.textContent = [L`오늘 이 주제와 함께 산 삶 ${n.toLocaleString(LC.loc)}명 가운데 ${p}%는 ${T.met()}`, tdMet() ? "Cuộc đời này cũng nằm trong số đó." : "Cuộc đời này thì không."].join(' ');
  el.hidden = false;
}
function tdBand() {
  const el = $('#tdBand'); if (!el || typeof tdPick !== 'function') return;
  const td = tdPick(new Date()), T = TD_TH[td.k]; if (!T) return;
  const help = T.heavy && T.help ? T.help() : '';
  el.innerHTML = `<b>${"Chủ đề hôm nay"}</b> <span class="tdt">${esc(tdTitle(td))}</span> <span>${"Mọi cuộc đời bắt đầu hôm nay đều cùng đi qua chủ đề này."}</span>${help ? `<small>${esc(help)}</small>` : ''}`;
  el.hidden = false;
}
function lookHTML() {
  let ls; try { ls = lookLines(); } catch (e) { reportCaught(e); return ''; }
  return ls.length ? `<div class="panel lookpan"><h3><span>${"Nhìn lại"}</span></h3><ul>${ls.map(t => `<li>${esc(capS(t))}</li>`).join('')}</ul></div>` : '';
}
function kidStory(k, ka) {
  const s = [];
  if (k.cut != null) return "Sau cuộc chia tay, hai bên không còn liên lạc.";
  const n = k.kb || 0, famW = () => k.rewed ? (n === 1 ? "Ly hôn rồi tái hôn, có một con." : n ? L`이혼한 뒤 다시 결혼했고, 아이 ${n}명을 두었습니다.` : "Ly hôn rồi tái hôn.")
    : k.wed ? (n === 1 ? "Đã kết hôn, có một con." : n ? L`결혼해 아이 ${n}명을 두었습니다.` : "Đã kết hôn.")
    : k.div ? (n === 1 ? "Từng kết hôn rồi chia tay, có một con." : n ? L`결혼했다가 헤어졌고, 아이 ${n}명을 두었습니다.` : "Kết hôn rồi chia tay.")
    : k.cuT ? (n === 1 ? "Đang chung sống với một người, có một con." : n ? L`함께 사는 사람이 있고, 아이 ${n}명을 두었습니다.` : "Đang chung sống với một người.") : '';
  if (!k.alive) { const dl = k.dA != null ? (k.dC && kidCause(k) ? L`${k.dA}세에 나보다 먼저 세상을 떠났습니다. (${kidCause(k)})` : L`${k.dA}세에 나보다 먼저 세상을 떠났습니다.`) : "Qua đời trước bạn.";
    const fw = (k.dA == null || k.dA >= 18) && (k.wed || k.div || k.rewed) ? famW() : ''; return fw ? dl + (' ') + fw : dl; }
  if (ka < 6) s.push("Khi ấy vẫn còn là một đứa trẻ nhỏ.");
  else if (ka < 18) s.push("Khi ấy vẫn đang lớn.");
  else {
    const jn = k.job && JOBS[k.job] ? JOBS[k.job].n.replace(/ \(.*\)$|（.*）$/, '') : '', uni = k.path === 'uni';
    if (k.job === 'homemaker') s.push("Lo việc nội trợ trong nhà.");
    else if (jn) s.push(ka >= 65 ? (uni ? L`대학을 마치고 ${ro(jn)} 일하다 은퇴했습니다.` : L`${ro(jn)} 일하다 은퇴했습니다.`)
      : k.dj && k.job === k.dj ? L`어릴 적 꿈이던 ${ro(jn)} 일합니다.` : uni ? L`대학을 마치고 ${ro(jn)} 일합니다.` : L`${ro(jn)} 일합니다.`);
    else if ((uni || k.path === 'pending') && ka < 26 && !kidInPr(k)) s.push("Khi ấy đang học đại học.");
    else if (ka < 23) s.push("Khi ấy vừa mới bước vào tuổi trưởng thành.");
    const fw = famW(); if (fw) s.push(fw);
  }
  if (k.exOf) s.push("Sau cuộc chia tay vẫn giữ liên lạc.");
  if (k.withMe) s.push("Sống cùng nhà với bạn trong những năm cuối đời của bạn.");
  else if (k.placed) s.push(k.placed.k === 'kin' ? L`${kinWord(k.placed.who)} 댁에서 자랐습니다.` : k.placed.fos ? "Lớn lên trong một gia đình nhận nuôi tạm thời." : "Lớn lên trong cơ sở bảo trợ trẻ em.");
  else if (k.bp && (k.away || (k.bpAt - k.bornAt < 16 && !k.stay && !k.abroad && !k.near && !k.city))) s.push(k.bp === 'M' ? "Lớn lên bên bố ruột." : "Lớn lên bên mẹ ruột.");
  else if (k.lb && CBY[k.awayIn]) s.push(L`${CBY[k.awayIn].ko}에서 자랐습니다.`);
  else if (k.away) s.push(S.flags.exSs ? "Lớn lên bên người cha hoặc mẹ còn lại." : S.sex === 'F' ? "Lớn lên bên bố." : "Lớn lên bên mẹ.");
  else if (ka >= 18 && k.stay) s.push("Sống cùng nhà với bạn.");
  else if (k.abroad && CBY[k.abroad]) s.push(L`${CBY[k.abroad].ko}에 삽니다.`);
  else if (k.grown) { if (k.near) s.push("Sống ở gần."); else if (k.city) s.push(L`${k.city}에 삽니다.`); else if (k.urb === 0) s.push("Sống ở một làng khác."); }
  if (k.ddPl && k.stay && ka >= 18 && !k.away) {
    const P = S.fam.partner, pl = k.ddPl;
    if (P && P.alive && !P.divorced) s.push(L`내가 떠난 뒤에도 ${wa(callName(P.name))} 함께 지내고, 그 뒤의 일도 미리 정해 두었습니다.`);
    else if (pl.w === 'sib' && S.fam.kids.some(x => x.bornAt === pl.b && x.alive)) s.push(L`내가 떠난 뒤에는 미리 정해 둔 대로 ${pl.s}의 집에서 함께 지냅니다.`);
    else if (pl.w === 'gh') s.push("Sau khi bạn ra đi, sống ở một nhà ở nhóm như đã thu xếp từ trước.");
    else if (pl.w === 'kin') s.push("Sau khi bạn ra đi, sống bên họ hàng như đã thu xếp từ trước.");
  }
  if (ka >= 12) { const b = bondScore(k, 'kid'); s.push(b >= 26 ? "Gần gũi với bạn." : b >= 4 ? "Quan hệ với bạn khá êm ả." : "Xa cách với bạn."); }
  return s.join(' ');
}
function kidsLifeHTML() {
  const d = S.deathAt, f = S.fam; if (!d || !f) return '';
  const kids = f.kids || [], given = f.given || []; if (!kids.length && !given.length) return '';
  const rows = [];
  try {
    for (const k of kids) {
      const ka = d.age - k.bornAt, role = k.sk ? (k.exOf || k.cut != null ? "Con của bạn đời cũ" : "Con của bạn đời") : k.adopted ? (k.sex === 'F' ? "Con gái nuôi" : "Con trai nuôi") : k.sex === 'F' ? L`딸${LBL}` : L`아들${LBL}`;
      rows.push(`<li><div class="kh"><b>${esc(k.name.full)}</b><small>${esc(role)}${k.alive ? ' · ' + esc(L`${ka}세`) : ''}</small></div><p>${esc(capS(kidStory(k, ka)))}</p></li>`);
    }
    for (const g of given) rows.push(`<li><div class="kh"><b>${esc(g.name.full)}</b><small>${esc("Con đã cho làm con nuôi")}</small></div><p>${esc(g.met ? "Gặp lại nhau khi con đã trưởng thành." : "Sau khi cho làm con nuôi, bạn không còn biết tin gì về con.")}</p></li>`);
  } catch (e) { reportCaught(e); return ''; }
  return `<div class="panel kidslife"><h3><span>${"Cuộc đời các con"}</span><span class="lbl">${"Vào năm bạn ra đi"}</span></h3><ul>${rows.join('')}</ul></div>`;
}
const kidCause = k => k.dL || (k.dC && CAUSE[k.dC] ? causeLabel(k.dC, k.dA, k.sex) : '');
const kidGone = k => k.dA == null ? '' : ` <small>· ${esc(k.dC && k.dC !== 'suic' && kidCause(k) ? L`${k.dA}세에 떠남 · ${kidCause(k)}` : L`${k.dA}세에 떠남`)}</small>`;
const kidLeft = k => { const w = []; if (k.wed) w.push(L`기혼${LBL}`); if (k.kb) w.push(k.kb === 1 ? "một con" : L`아이 ${k.kb}명`); return w.length ? ` <small>· ${w.map(esc).join(' · ')}</small>` : ''; };
function famRows() {
  const f = S.fam, rows = [];
  const bw = (o, kind) => { const w = S.age >= 6 ? bondWord(o, kind) : ''; return w ? ` <small class="bond">· ${esc(w)}</small>` : ''; };
  if (f.dad && f.dad.job === undefined) parentJobs();
  const pwk = o => !o.job || !o.alive || o.absent ? '' : `<small class="pwork">${esc(o.job !== 'homemaker' && o.age >= 65 ? L`은퇴 · 전 ${parentJobName(o)}` : parentJobName(o))}</small>`;
  const p = (o, n, kind) => o.absent ? "<span class=\"gone\">Không sống cùng</span>" : o.alive ? L`${o.age}세` + (o.pr != null && o.pr > S.age ? ` <small class="pwork">${esc("đang ở tù")}</small>` : bw(o, kind) + pwk(o)) : L`<span class="gone">${n}세에 별세</span>`;
  rows.push([L`어머니${LBL}`, p(f.mom, f.mom.age, 'mom')]);
  rows.push([L`아버지${LBL}`, p(f.dad, f.dad.age, 'dad')]);
  { const bm = typeof adoptBmRow === 'function' && adoptBmRow(); if (bm) rows.push(["Mẹ ruột", esc(bm)]); }
  if (f.step) rows.push([L`새아버지${LBL}`, f.step.alive ? L`${f.step.age}세` + bw(f.step, 'step') : L`<span class="gone">${f.step.age}세에 별세</span>`]);
  const sibs = typeof sibAliveN === 'function' ? sibAliveN() : f.older + f.sibBorn, sibGone = f.older + f.sibBorn - sibs;
  { const sp = typeof sibInPr === 'function' && sibInPr();
    const out = sibs && typeof sibsLeft === 'function' ? sibsLeft() : 0;
    const al = sibs && typeof sibAliveList === 'function' ? sibAliveList() : [], who = al.length && al.length <= 5 ? al.sort((a, b) => b.age - a.age).map(x => L`${typeof sibCall === 'function' ? sibCall(x) : sibWord(x)} ${x.age}세`).join(' · ') : '';
    rows.push(["Anh chị em", (sibs ? (who ? who + (sibGone > 0 ? ' · ' + L`먼저 떠난 ${sibGone}명` : '') : sibGone > 0 ? L`${sibs}명 · 먼저 떠난 ${sibGone}명` : L`${sibs}명`) : sibGone > 0 ? "tất cả đã mất" : "Không có") + (out > 0 ? ' · ' + (out === sibs ? "tất cả đã rời nhà" : L`${out}명은 집을 떠남`) : '') + (sp && sibs ? ' · ' + esc(L`${sp.w} 교도소에 있음`) : '')]); }
  if (typeof raisedHere === 'function' && raisedHere()) { const r = S.flags.raised; rows.push(["Người nuôi bạn", esc(raisedWord(r)) + (r.k === 'gp' || r.k === 'kin' ? ' · ' + L`${r.age + S.age - r.at}세` : '')]); }
  const nsa = (o, age) => o.sex === 'F' || o.sex === 'M' ? L`${esc(o.name.full)} · ${o.sex === 'F' ? "nữ giới" : "nam giới"} · ${age}세` : L`${esc(o.name.full)} · ${age}세`;
  if (f.partner) {
    const P = f.partner, w = P.alive && !P.divorced ? partnerWork(P) : null;
    const lbC = P.lb && f.married ? CBY[P.lbIn || (S.flags.famWait && S.flags.famWait.from)] : null, lbW = lbC && lbC.id !== S.cur ? ' · ' + esc(L`${lbC.ko}에서 기다림`) : '';
    rows.push([P.divorced ? (P.sep ? "Bạn đời đang ly thân" : unionOf(P) === 'm' ? "bạn đời cũ" : "Người đã chia tay") : ({ m: "Bạn đời", cp: "Bạn đời", none: "Người chung sống" })[unionOf(P)], w ? nsa(P, P.age) + (P.nat ? ' · ' + esc(natWord(P.nat)) : '') + lbW + (f.married ? bw(P, 'pt') : '') + `<small class="pwork">${esc(capS(w.t))}${w.m ? ' · ' + w.m : ''}</small>` : `<span class="${P.divorced && P.alive ? 'exn' : 'gone'}">${esc(P.name.full)}</span>`]);
  }
  for (const x of (S.flags.exs || []).filter(x => !(f.partner && f.partner.divorced && x.n === f.partner.name.full)).slice(-3))
    rows.push([x.d ? (x.w ? "Bạn đời đã khuất" : "Người thương đã khuất") : x.s ? "Bạn đời đang ly thân" : x.w ? "bạn đời cũ" : "Người đã chia tay", `<span class="${x.d ? 'gone' : 'exn'}">${esc(x.n)}</span>` + (x.y >= 1 ? ` <small>· ${esc(L`${x.y}년을 함께`)}</small>` : '')]);
  if (f.wife2) rows.push(["Vợ thứ hai", f.wife2.alive ? L`${esc(f.wife2.name.full)} · ${f.wife2.age}세` : `<span class="gone">${esc(f.wife2.name.full)}</span>`]);
  if (f.co) rows.push(["Người vợ khác của chồng", L`${esc(f.co.name.full)} · ${f.co.age}세` + (f.co.kids ? L` · 아이 ${f.co.kids}명` : '') + (f.co.home ? '' : " · sống riêng")]);
  if (f.dating && !f.married) rows.push([f.dating.arr ? "Đang được mai mối" : "Đang hẹn hò", nsa(f.dating, f.dating.age + S.age - f.dating.since) + (f.dating.nat ? ' · ' + esc(natWord(f.dating.nat)) : '') + bw(Object.assign({ alive: true }, f.dating), 'date')]);
  const ops = new Set(f.kids.filter(k => k.op && k.op.full).map(k => k.op.full)), opW = k => ops.size > 1 && k.op && k.op.full ? ' · ' + esc(k.ops === 'M' ? L`아빠 ${callName(k.op)}` : L`엄마 ${callName(k.op)}`) : '';
  for (const k of f.kids) rows.push([k.sex === 'F' ? L`딸${LBL}` : L`아들${LBL}`, k.alive ? L`${esc(k.name.full)} · ${S.age - k.bornAt}세` + opW(k) + (k.adopted ? " · con nuôi" : '') + (k.sk ? (k.exOf ? " · con của bạn đời cũ" : " · con của bạn đời") : '') + (k.priv && S.age - k.bornAt >= 6 && S.age - k.bornAt < 18 ? " · trường tư" : '') + kidLine(k).map(x => ' · ' + esc(x)).join('') + bw(k, 'kid') : `<span class="gone">${esc(k.name.full)}</span>` + (k.cut != null ? ` <small>· ${esc("Con của bạn đời cũ")} · ${esc("không còn liên lạc")}</small>` : kidGone(k) + kidLeft(k))]);
  for (const g of f.given || []) rows.push(["Con đã cho làm con nuôi", L`${esc(g.name.full)} · ${S.age - g.bornAt}세`]);
  if (S.age >= 12) { const fl = S.flags.fN ? Math.max(0, S.flags.fN - (S.flags.fGone || 0)) : null, fw = fl === 0 ? '' : bondWord({ alive: true, name: { full: S.name.full } }, 'friend');
    rows.push(["Bạn bè", fl === 0 ? "<span class=\"gone\">Những người bạn lâu năm đều đã ra đi</span>" : (fl != null && S.flags.fGone ? L`곁에 남은 오랜 친구 ${fl}명` + ` <small class="bond">· ${esc(fw)}</small>` : esc(fw))]); }
  if (S.flags.grand) {
    const ga = (Array.isArray(f.grand) ? f.grand : []).filter(g => !g.gone).map(g => S.age - g.bornAt).filter(a => a >= 0).sort((x, y) => x - y);
    const gl = Array.isArray(f.grand) ? f.grand.filter(g => g.gone).length : 0, gn = Math.max(ga.length, S.flags.grand - gl);
    rows.push(["Cháu", (!gn ? '' : !ga.length ? L`${gn}명` : ga.length <= 6 ? L`${gn}명 · ${ga.join('·')}세` : L`${gn}명 · ${ga[0]}~${ga[ga.length - 1]}세`) + (gl ? `${gn ? ' ' : ''}<span class="gone">${esc(L`먼저 떠난 손주 ${gl}명`)}</span>` : '')]);
  }
  if (S.flags.ggrand) {
    const ga = (Array.isArray(f.grand) ? f.grand : []).flatMap(g => g.ggB || []).map(b => S.age - b).filter(a => a >= 0).sort((x, y) => x - y), gn = S.flags.ggrand;
    rows.push(["Chắt", !ga.length || ga.length !== gn ? L`${gn}명` : ga.length <= 6 ? L`${gn}명 · ${ga.join('·')}세` : L`${gn}명 · ${ga[0]}~${ga[ga.length - 1]}세`]);
  }
  { const ps = typeof petsOfLife === 'function' ? petsOfLife() : []; if (ps.length) rows.push(["Thú cưng", ps.map(p => { const t = esc(L`${p.n} (${petWord(p.k)})`); return p.now ? t : `<span class="gone">${t}</span>`; }).join(', ')]); }
  if (S.hobbies.length) rows.push(["Sở thích", S.hobbies.map(h => `${esc(hobbyName(h.id))} Lv.${Math.floor(h.lv)}`).join(', ')]);
  const owns = Object.keys(S.owns).map(k => ITEMS[k] ? ITEMS[k].n : k); if (owns.length) rows.push(["Những thứ bạn có", owns.join(', ')]);
  if (S.smoker) rows.push(["Thói quen", "Hút thuốc"]);
  const cond = Object.keys(S.conds).filter(k => S.conds[k].dx !== false).map(k => ({ htn: "tăng huyết áp", dm: "bệnh tiểu đường", heart: "đau thắt ngực" }[k] + (S.conds[k].treated ? '' : " (không điều trị)")));
  if (cond.length) rows.push(["Bệnh mạn tính", cond.join(', ')]);
  return rows;
}
function renderFocus() {
  const o = focusOptions();
  $('#status').innerHTML = statusLine();
  const box = $('#focusChips');
  { const lb = $('#focusLbl'); if (lb) lb.hidden = !o.length; }
  if (!o.length) { box.innerHTML = "<span style=\"color:var(--ink3);font-size:13.5px\">Bạn vẫn còn là em bé, đang được bố mẹ nuôi nấng. Những trải nghiệm thuở nhỏ dồn lại, khoảng năm tuổi thì tính khí dần định hình, và từ sáu tuổi bạn có thể chọn trọng tâm cho mỗi năm. Bạn cứ thoải mái tua nhanh giai đoạn này ở tốc độ 8×.</span>"; renderMini(); return; }
  box.innerHTML = focusChips(o) + auNote();
  focusHint(o);
  { let fs = $('#foShop'); if (!fs) { box.insertAdjacentHTML('afterend', `<p class="fo-shop"><button type="button" class="ghost sm" id="foShop">${"Chi tiêu · đầu tư"}</button></p>`); fs = $('#foShop'); }
    fs.parentNode.hidden = !(S.age >= 15 && S.phase === 'life'); }
  renderMini();
}
function focusHint(o) {
  const h = $('#focusHint'); if (!h) return;
  if (S.flags.focusPicked && !UI.prefs.focusHint) { UI.prefs.focusHint = 1; lsSet(PREF_KEY, UI.prefs); }
  if (!UI.prefs.focusHint && lsGet(LIVES_KEY, []).length) { UI.prefs.focusHint = 1; lsSet(PREF_KEY, UI.prefs); }
  const first = S.flags.foHintAt == null && o.length && !UI.prefs.focusHint && !S.replay && !UI.prefs.auto;
  if (first) S.flags.foHintAt = S.age;
  const on = S.flags.foHintAt != null && S.age - S.flags.foHintAt < 2 && !S.flags.focusPicked && !UI.prefs.focusHint && o.length;
  if (!on && S.flags.foHintAt != null && !UI.prefs.focusHint && S.age - S.flags.foHintAt >= 2) { UI.prefs.focusHint = 1; lsSet(PREF_KEY, UI.prefs); }
  h.hidden = !on; if (on) h.textContent = "Chạm vào một nút bên dưới để chọn năm nay dành cho điều gì. Nếu bạn không chọn, trọng tâm sẽ được chọn tự động.";
  const fo = $('#mbFo'); if (fo) fo.classList.toggle('hl', !!on);
}
const FOCUS_FULL = () => ({ study: "Giữ kiến thức · Hạnh phúc↓", learn: "Giữ kiến thức · Lời mời chuyển việc↑", mind: "Giữ kiến thức và trí nhớ" });
const focusD = k => S && k === 'learn' && !isWorking() ? (S.st.sm >= 98 ? "Giữ kiến thức" : "Kiến thức↑ Hạnh phúc↓ một chút") : S && S.st.sm >= 98 && FOCUS_FULL()[k] || FOCUS[k].d;
const focusChips = o => o.map(k => `<button class="chip" data-focus="${k}" aria-pressed="${S.focus === k}">${FOCUS[k].n}<small>${focusD(k)}</small></button>`).join('');
const MB_SHORT = { vi: { hl: 'Khỏe', h: 'Vui', sm: 'Học thức', so: 'Gắn bó' } };
function renderMini() {
  const st = $('#mbSt'); if (!st || !S) return;
  st.innerHTML = STATS.map(([k, n, col]) => { const v = Math.round(S.st[k]) || 0; return `<span class="mb-i" title="${n} ${v}"><span class="mb-n">${MB_SHORT[LANG] ? MB_SHORT[LANG][k] : n}</span><b>${v}</b><span class="mb-b" aria-hidden="true"><i style="width:${clamp(v, 0, 100)}%;background:var(${col})"></i></span></span>`; }).join('');
  const o = focusOptions(), fo = $('#mbFo');
  fo.hidden = !o.length;
  $('#mbFoN').textContent = S.focus && FOCUS[S.focus] ? FOCUS[S.focus].n : '—';
  if (!o.length) miniPick(false); else if (!$('#mbPick').hidden) $('#mbPick').innerHTML = focusChips(o) + auNote();
}
function auNote() { return S.flags.au && !S.flags.focusOwn ? `<span class="fo-au">${"Khi các quyết định đang để tự động, trọng tâm mỗi năm cũng được chọn tự động. Chạm vào một nút thì từ đó trở đi bạn tự chọn."}</span>` : ''; }
function miniPick(open) {
  const p = $('#mbPick'), b = $('#mbFo'); if (!p || !b) return;
  if (open) p.innerHTML = focusChips(focusOptions()) + auNote();
  p.hidden = !open; b.setAttribute('aria-expanded', String(!!open));
}
function topbarH() { const t = $('#lifeview .topbar'); if (t && t.offsetHeight) document.documentElement.style.setProperty('--tbh', t.offsetHeight + 'px'); }
const fxText = fx => STATS.filter(([k]) => fx[k]).map(([k, n]) => `${n} ${fx[k] > 0 ? '+' : '−'}${Math.abs(fx[k])}`).join(' · ');
const feedItem0 = e => L`<span class="a">${Math.floor(+e.a) || 0}세</span><span class="x">${(e.kind === 'dec' && e.q ? `<span class="dq">${esc(e.q)}</span>` : '') + esc(e.text) + (e.fa ? `<span class="fa">${esc(e.fa)}</span>` : '')}${e.fx ? `<span class="fxk" aria-hidden="true">±</span>` : ''}${e.fact ? `<span class="f">${esc(e.fact)}</span>` : ''}${e.fx ? `<span class="fx">${esc(fxText(e.fx))}</span>` : ''}</span>`;
const tdChip = e => e.td && S && S.td && typeof tdTitle === 'function' && !tdSkip(e) ? `<span class="tdc">${esc(tdTitle(S.td))}</span>` : '';
const feedItem = e => { const c = (e.egg ? `<span class="egg">${"Easter egg"}</span>` : '') + tdChip(e); return c ? feedItem0(e).replace('<span class="x">', `<span class="x">${c}`) : feedItem0(e); };
const STAR_MAX = 12;
const starBtn = e => `<button type="button" class="stb" aria-pressed="${e.star ? 'true' : 'false'}">${e.star ? "★ Khoảnh khắc đáng nhớ" : "☆ Khoảnh khắc đáng nhớ"}</button>`;
function starToggle(li) {
  const e = li._e; if (!e || !S) return;
  if (!e.star && S.log.filter(x => x.star).length >= STAR_MAX) { starSheet(e); return; }
  if (e.star) delete e.star; else e.star = 1;
  li.classList.toggle('starred', !!e.star);
  const b = li.querySelector('.stb'); if (b) b.outerHTML = starBtn(e);
  save();
}
function starSheet(e) {
  const list = S.log.filter(x => x.star); UI.starNew = e; UI.starList = list;
  openSheet("Những khoảnh khắc đáng nhớ", L`<p class="sts-lead">별은 ${STAR_MAX}개까지 달 수 있어요. 하나를 내려놓으면 방금 고른 순간에 별을 달아요.</p>`
    + `<ul class="stlist">${list.map((x, i) => `<li><span class="a">${L`${Math.floor(+x.a) || 0}세`}</span><span class="x">${esc(x.text)}</span><button class="stx" data-unstar="${i}">${"Bỏ sao"}</button></li>`).join('')}</ul>`);
}
function starSwap(i) {
  const x = UI.starList && UI.starList[i], e = UI.starNew; UI.starNew = UI.starList = null;
  if (!x || !e || !S) { closeSheet(); return; }
  delete x.star; e.star = 1;
  for (const li of document.querySelectorAll('#feed li')) if (li._e === x || li._e === e) { li.classList.toggle('starred', !!li._e.star); const b = li.querySelector('.stb'); if (b) b.outerHTML = starBtn(li._e); }
  save(); closeSheet(); toast("Đã chuyển ngôi sao.");
}
function setNote(id, r) {
  const i = S.log.findIndex(e => e.set === id && e.a === S.age);
  if (i < 0) { log(r, 'note'); S.log[S.log.length - 1].set = id; return; }
  const e = S.log[i]; S.log.splice(i, 1);
  const li = [...document.querySelectorAll('#feed li')].find(x => x._e === e); if (li) { li.remove(); UI.feedCount = Math.max(0, UI.feedCount - 1); }
}
function addFeed(e, bulk) {
  const li = document.createElement('li');
  li.className = (/^[a-z]{1,12}$/.test(e.kind) ? e.kind : 'ev') + (e.fx ? ' hasfx' : '') + ' tap' + (e.star ? ' starred' : '');
  li.tabIndex = 0; li.setAttribute('aria-expanded', 'false'); li._e = e;
  li.innerHTML = feedItem(e).replace(/<\/span>$/, starBtn(e) + '</span>');
  const feed = $('#feed');
  if (bulk) feed.appendChild(li); else feed.insertBefore(li, feed.firstChild);
  UI.feedCount++;
  if (UI.feedCount === 7) { const m = $('#feedMore'); if (m) m.hidden = false; }
  while (feed.children.length > 1500) feed.removeChild(feed.lastChild);
}
function toTopCheck() {
  UI.ttRaf = 0; const b = $('#toTop'); if (!b) return;
  const f = $('#feed'), v = UI.view, boxFar = v === 'lifeview' && f && f.scrollHeight > f.clientHeight + 40 && f.scrollTop > 240;
  const on = (v === 'lifeview' || v === 'dead') && (scrollY > innerHeight * 1.2 || boxFar) && $('#sheet').hidden && $('#modal').hidden;
  b.classList.toggle('on', !!on);
  const df = $('#deadFoot'), dp = $('#decPeek'), narrow = innerWidth <= 700;
  b.classList.toggle('lift', !!((v === 'dead' && narrow && df && !df.classList.contains('off')) || (dp && !dp.hidden)));
  unlivedPlace();
}
function toTop() {
  const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', f = $('#feed');
  if (f && f.scrollTop) f.scrollTo({ top: 0, behavior: smooth });
  window.scrollTo({ top: 0, behavior: smooth });
}
function feedReset() {
  const f = $('#feed'), m = $('#feedMore'); f.innerHTML = ''; f.classList.remove('all'); UI.feedCount = 0;
  if (m) { m.hidden = true; m.textContent = "Xem các ghi chép trước"; m.setAttribute('aria-expanded', 'false'); }
}
function feedMore() {
  const f = $('#feed'), m = $('#feedMore'), all = !f.classList.contains('all');
  f.classList.toggle('all', all); m.textContent = all ? "Chỉ xem ghi chép gần đây" : "Xem các ghi chép trước"; m.setAttribute('aria-expanded', String(all));
  f.scrollTop = 0;
  if (!all) f.closest('.panel').scrollIntoView({ block: 'nearest' });
}
const MOMENT_MINOR = new Set(['petq', 'hobby', 'invest', 'lend', 'pstock', 'kidwant', 'kidq', 'kidteen', 'discipline', 'bizop', 'temper', 'reflect', 'dream', 'party', 'gadget']);
function momentsOf(n) {
  const star = S.log.filter(e => e.star).slice(0, n);
  const M = S.log.filter(e => !e.star && ['big', 'loss', 'death', 'ms'].includes(e.kind) && !e.sh && !(e.d && (MOMENT_MINOR.has(e.d) || (typeof SMALL !== 'undefined' && SMALL[e.d]))));
  const k = n - star.length, out = star.slice();
  if (M.length <= k) out.push(...M);
  else if (k === 1) out.push(M[M.length - 1]);
  else for (let i = 0; i < k; i++) out.push(M[Math.round(i * (M.length - 1) / (k - 1))]);
  const at = new Map(S.log.map((e, i) => [e, i]));
  return out.sort((x, y) => at.get(x) - at.get(y));
}
function bindFullLog(root) {
  const box = root.querySelector('#fullLog'); if (!box) return;
  root.querySelectorAll('.decs button').forEach(b => b.addEventListener('click', () => {
    const d = +b.dataset.d, li = [...box.children].find(x => +x.dataset.a >= d); if (!li) return;
    box.scrollTop += li.getBoundingClientRect().top - box.getBoundingClientRect().top;
  }));
}
function hexToRgb(h) { h = h.trim(); if (h.startsWith('#')) { if (h.length === 4) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]; return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; } const m = h.match(/\d+/g); return m ? m.slice(0, 3).map(Number) : [128, 128, 128]; }
const MIXC = { key: null, a: null, b: null };
function mixCol(t) {
  const key = (document.documentElement.dataset.theme || '') + (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'd' : 'l');
  if (MIXC.key !== key) { const cs = getComputedStyle(document.documentElement); MIXC.a = hexToRgb(cs.getPropertyValue('--grid-lo')); MIXC.b = hexToRgb(cs.getPropertyValue('--grid-hi')); MIXC.key = key; }
  const a = MIXC.a, b = MIXC.b; t = clamp(t, 0, 1); return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
}
function setBar(el, f) {
  if (!el) return; const v = Math.round(clamp(f, 0, 1) * 500);
  if (el._bar === v) return; el._bar = v; el.style.transform = `scaleX(${v / 500})`;
}
const MK = { edu: "H", job: "V", love: '♥', baby: '+', grand: '+', loss: '†', move: '→', svc: "Q", buy: '₫', trip: '✈', star: '★', death: '' };
function gridHTML(full) {
  const lt = lifeTable(BB(), S.sex); const e0 = Math.floor(lt.e0);
  const maxA = Math.max(full ? S.age + 1 : 0, Math.ceil((Math.max(e0, S.age) + 6) / 10) * 10, 60);
  let h = '';
  const ys = {}; S.years.forEach(y => { ys[y.a] = y; });
  for (let a = 0; a < Math.min(125, maxA); a++) {
    const y = ys[a]; let st = '', cls = 'c', m = '';
    if (y) { st = `background:${mixCol(0.15 + y.h / 100 * 0.85)}`; if (y.mk) m = MK[y.mk] || ''; if (y.mk === 'death') cls += ' dead'; }
    if (!full && a === S.age && S.phase === 'life') cls += ' cur';
    if (a === e0) cls += ' le';
    h += `<span class="${cls}" style="${st}" data-a="${a}" tabindex="-1">${m ? `<span class="m">${m}</span>` : ''}</span>`;
  }
  return h;
}
function renderGrid() {
  $('#grid').innerHTML = gridHTML(false);
  const e0 = lifeTable(BB(), S.sex).e0;
  $('#gridKey').innerHTML = L`<span>한 칸 = 1년 · 진할수록 행복했던 해</span><span>테두리 칸 = ${B().ko} ${S.sex === 'F' ? "nữ giới" : "nam giới"} 기대수명 ${e0.toFixed(1)}세</span>` + (S.era && S.era !== 'now' ? L`<span>(${S.by}년 기준)</span>` : '');
}
function chartSVG(cur) {
  const W = 320, H = 176, x0 = 34, x1 = 310, y0 = 12, y1 = 144;
  const X = a => x0 + (x1 - x0) * a / 100, Y = p => y1 - (y1 - y0) * p;
  const ltB = { l: survL(S.born, S.sex) }, ltW = lifeTable(S.era && S.era !== 'now' ? eraWorldC(S.by) : WORLD_C, S.sex);
  const path = lt => { let d = ''; for (let a = 0; a <= 100; a++) d += (a ? 'L' : 'M') + X(a).toFixed(1) + ' ' + Y(lt.l[a]).toFixed(1); return d; };
  let g = '';
  for (const p of [0, 0.25, 0.5, 0.75, 1]) g += `<line x1="${x0}" x2="${x1}" y1="${Y(p)}" y2="${Y(p)}" stroke="var(--rule2)" stroke-width="1"/><text x="${x0 - 6}" y="${Y(p) + 4}" text-anchor="end" font-size="10" fill="var(--ink3)" font-family="IBM Plex Mono, monospace">${p * 100}%</text>`;
  for (const a of [0, 20, 40, 60, 80, 100]) g += `<text x="${X(a)}" y="${H - 14}" text-anchor="middle" font-size="10" fill="var(--ink3)" font-family="IBM Plex Mono, monospace">${a}</text>`;
  g += L`<text x="${x1}" y="${H - 2}" text-anchor="end" font-size="10" fill="var(--ink3)">나이</text>`;
  g += `<path d="${path(ltW)}" fill="none" stroke="var(--ink3)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  if (S.mig && S.cur !== S.born) g += `<path d="${path(lifeTable(C(), S.sex))}" fill="none" stroke="var(--accent)" stroke-width="1.5"/>`;
  g += `<path d="${path(ltB) + `L${X(100)} ${y1} L${X(0)} ${y1} Z`}" fill="var(--stamp)" opacity=".10"/>`;
  g += `<path d="${path(ltB)}" fill="none" stroke="var(--stamp)" stroke-width="2.2"/>`;
  const a = Math.min(100, cur);
  g += `<line x1="${X(a)}" x2="${X(a)}" y1="${y0}" y2="${y1}" stroke="var(--ink)" stroke-width="1" opacity=".5"/><circle cx="${X(a)}" cy="${Y(ltB.l[a])}" r="4.5" fill="var(--stamp)" stroke="var(--card)" stroke-width="2"/>`;
  g += L`<text x="${Math.min(X(a) + 6, x1 - 60)}" y="${Math.max(Y(ltB.l[a]) - 8, y0 + 10)}" font-size="11" fill="var(--ink)" font-weight="600">${pctStr(ltB.l[a])} 생존</text>`;
  return L`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="연령별 생존 확률 곡선">${g}</svg>`;
}
function renderChart() {
  $('#chart').innerHTML = chartSVG(S.age);
  $('#chartLegend').innerHTML = L`<span><i style="background:var(--stamp)"></i>${esc(B().ko)} ${S.sex === 'F' ? "nữ giới" : "nam giới"}</span>${S.mig && S.cur !== S.born ? `<span><i style="background:var(--accent)"></i>${esc(C().ko)}</span>` : ''}<span><i style="background:var(--ink3)"></i>세계 평균</span>`;
}
function countryRows(c) {
  return [
    ["Số trẻ sinh ra mỗi năm", koBig(c.b)], ["Dân số", koBig(c.pop * 1000)],
    ["Tuổi thọ kỳ vọng nữ / nam", L`${leOf(c, 'F').toFixed(1)} / ${leOf(c, 'M').toFixed(1)}세`], ["Tỷ lệ tử vong trẻ dưới 5 tuổi", L`1,000명당 ${c.u5}`],
    ["GDP bình quân đầu người (PPP)", usdStr(c.ppp)], ["Hệ số Gini thu nhập", c.gi.toFixed(2)], ["Sống ở đô thị", c.urb + '%'], ["Làm nông nghiệp", c.agr + '%'],
    ["Số năm đi học kỳ vọng", L`${c.eys}년`], ["Tỷ lệ nhập học thô bậc đại học", c.ter + '%'], ["Tỷ lệ sử dụng internet", c.net + '%'], ["Tổng tỷ suất sinh", L`${c.tfr}명`],
    ["Tỷ số tử vong mẹ (trên 100.000 ca sinh)", String(c.mmr)], ["Tỷ lệ nhiễm HIV (15–49 tuổi)", c.hiv + '%'], ["Tỷ lệ giết người (trên 100.000 dân)", String(c.hom)], ["Tử vong do tai nạn giao thông (trên 100.000 dân)", String(c.road)],
    ["Sử dụng thuốc lá nam / nữ", `${c.sm}% / ${c.sf}%`], ["Chi tiêu y tế tự chi trả", c.oop + '%'], ["Kết hôn trước 18 tuổi (nữ)", c.cm + '%'], ["Mức hài lòng với cuộc sống (0–10)", c.wh != null ? c.wh.toFixed(2) : "Không có dữ liệu"],
  ];
}
function renderCountry() {
  const c = UI.cview === 'born' ? B() : C();
  $('#ctyTitle').textContent = c.yr ? (c.yr >= NOW_Y ? L`${c.ko} · ${c.yr}년 전망` : L`${c.ko} · ${c.yr}년`) : c.ko;
  $('#ctySwitch').hidden = !(S.mig && S.cur !== S.born);
  $('#ctySwitch').textContent = UI.cview === 'born' ? L`${C().ko} 보기` : L`${B().ko} 보기`;
  $('#ctyDl').innerHTML = countryRows(c).map(([k, v]) => `<dt>${k}</dt><dd>${viVal(v)}</dd>`).join('');
}
function renderComps() {
  const el = $('#compList'); if (!el) return;
  if (!S.comps || !S.comps.length) { el.innerHTML = '<li><span class="cs">—</span></li>'; return; }
  el.innerHTML = S.comps.map(cp => { const gone = cp.death.age < S.age; return `<li class="${gone ? 'gone' : ''}"><span class="cn">${esc(cp.name.full)}<small>${esc(CBY[cp.iso].ko)} · ${cp.sex === 'F' ? "Nữ" : "Nam"}</small></span><span class="cs">${esc(gone ? (cp.death.cause === 'suic' ? L`† ${cp.death.age}세` : L`† ${cp.death.age}세 · ${cp.death.label}`) : compStatus(cp, S.age))}</span></li>`; }).join('');
}
function renderAll() {
  if (!S) return;
  for (const f of [renderTop, renderId, renderStats, renderFamily, renderFocus, renderComps, renderGrid, renderChart, renderCountry, renderScene, renderSceneWho]) { try { f(); } catch (e) { reportCaught(e); } }
  UI.dirty = false;
}
function sceneWho() {
  const h = homeOthers(), f = S.fam, out = [L`나 ${S.age}세`];
  const pr = (role, nm, age) => L`${role} ${nm} ${age}세`;
  if (h.pt) out.push(pr(f.partner.ss ? "Bạn đời" : f.partner.sex === 'F' ? "Vợ" : "Chồng", callName(f.partner.name), f.partner.age));
  if (h.pt2) out.push(pr("Vợ thứ hai", callName(h.pt2.name), h.pt2.age));
  for (const k of h.kids) out.push(pr(k.sk ? "Con của bạn đời" : k.sex === 'F' ? "con gái" : "con trai", callName(k.name), S.age - k.bornAt));
  { const gh = typeof gkHome === 'function' ? gkHome() : []; if (gh.length) out.push(L`손주 ${gh.map(g => Math.max(0, S.age - g.bornAt)).sort((x, y) => x - y).join('·')}세`); }
  if (h.mom) out.push(L`어머니 ${f.mom.age}세`);
  if (h.dad) out.push(L`아버지 ${f.dad.age}세`);
  if (h.step) out.push(L`새아버지 ${f.step.age}세`);
  const sb = typeof sibsHome === 'function' ? sibsHome() : [];
  if (sb.length) out.push(L`형제자매 ${sb.map(x => x.age).join('·')}세`);
  if (typeof petHere === 'function' && petHere() && S.pet && S.pet.n) { const py = S.pet.k === 'f' || S.pet.at == null ? null : Math.max(0, S.age - S.pet.at);
    out.push(py == null ? L`반려동물 ${S.pet.n}` : py ? L`반려동물 ${S.pet.n} ${py}살` : L`반려동물 ${S.pet.n} 한 살 미만`); }
  return out.map(x => capS(x));
}
function renderSceneWho() {
  const cap = $('#sceneCap'); if (!cap || !S) return;
  let w = $('#sceneWho');
  if (!w) { cap.insertAdjacentHTML('afterend', `<p class="scenewho" id="sceneWho" hidden></p>`); w = $('#sceneWho'); }
  const open = !!UI.prefs.sceneWho;
  cap.classList.add('tap'); cap.setAttribute('role', 'button'); cap.tabIndex = 0; cap.setAttribute('aria-expanded', open); cap.title = open ? "Ẩn tên" : "Xem tên và tuổi";
  w.hidden = !open; if (open) w.textContent = sceneWho().join(' · ');
}
function sceneWhoToggle() { UI.prefs.sceneWho = UI.prefs.sceneWho ? 0 : 1; lsSet(PREF_KEY, UI.prefs); renderSceneWho(); }
const decFa = v => { if (v.q || typeof famAges !== 'function') return ''; let fa = ''; try { fa = famAges(capS(v.title || '') + ' ' + (v.body || '')); } catch (e) { } return fa ? `<p class="dec-fa">${esc(fa)}</p>` : ''; };
const DEC_ARM_MS = 700;
function decChoicesHTML(v) {
  const done = new Set(); let n = 0;
  return v.choices.map(c => {
    if (!c.g) { n++; return `<button data-k="${esc(c.k)}"><span class="k">${n}</span><b>${esc(c.label)}</b><small>${esc(c.sub || '')}</small></button>`; }
    if (done.has(c.g)) return ''; done.add(c.g);
    const grp = v.choices.filter(x => x.g === c.g), a = n + 1; n += grp.length;
    return `<div class="chg" role="group" aria-label="${esc(c.gl || '')}"><span class="k">${a}–${n}</span><b>${esc(c.gl || '')}</b><small>${esc(c.gs || '')}</small>`
      + `<div class="chips">${grp.map(x => `<button data-k="${esc(x.k)}" title="${esc(x.sub || '')}"><b>${esc(x.chip || x.label)}</b></button>`).join('')}</div></div>`;
  }).join('');
}
function showDecision(pd) {
  S.ff = false;
  if (!UI.decFor || UI.decFor !== pd) { UI.decFor = pd; UI.decAt = performance.now(); }
  const v = pd.view, m = $('#modal');
  m.innerHTML = L`<div class="dec${v.q ? ' pause' : ''}" role="dialog" aria-modal="true" aria-labelledby="decT"><div class="hd"><span>${v.q ? "Một phút lắng lại" : String(pd.id || '').startsWith('sm_') ? "Một lựa chọn nhỏ" : typeof ddWithFam === 'function' && ddWithFam(pd.id) ? "Cùng gia đình quyết định" : "Quyết định lớn"}</span><span>${S.age}세 · ${S.by + S.age}년</span></div><div class="bd"><h2 id="decT">${esc(v.q ? L`${callName(S.name)}, ${S.age}세` : v.title)}</h2>${(v.body ? `<p>${esc(v.body)}</p>` : '') + decFa(v)}${v.fact ? `<div class="fact">${esc(v.fact)}</div>` : ''}${v.q ? L`<p class="q">${esc(v.q)}</p><textarea id="decNote" maxlength="200" rows="3" placeholder="떠오른 생각을 한 줄로 적어 보세요 (선택)"></textarea>` : ''}${v.name ? `<label class="dec-name"><span>${"Đặt tên"}</span><input id="decNote" maxlength="${+v.name.max || 12}" placeholder="${esc(v.name.ph || '')}" autocomplete="off" enterkeyhint="done"></label>` : ''}<div class="ch">${decChoicesHTML(v) + (Array.isArray(v.locked) ? v.locked : []).map(c => `<button type="button" class="lock" disabled><span class="k" aria-hidden="true">–</span><b>${esc(c.label)}</b><small>${esc(c.sub || '')}</small></button>`).join('')}</div></div></div>`;
  if (v.q && v.ph && m.querySelector('#decNote')) m.querySelector('#decNote').placeholder = v.ph;
  m.hidden = false; decPeek(false);
  UI.autoDec = null;
  const bd = m.querySelector('.bd');
  { const hr = m.querySelector('.hd > span:last-child'); if (hr) hr.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"decmin\" id=\"decMin\" title=\"Bạn có thể xem màn hình phía sau rồi mở lại để chọn\">Tạm gác lại ▾</button>"); }
  if (UI.prefs.auto && typeof autoChoice === 'function') {
    const k = autoChoice(pd), btn = m.querySelector(`button[data-k="${k}"]`);
    const dur = (v.q ? 9 : clamp((bd.textContent || '').replace(/\s+/g, '').length / 9, 5, 14)) * (S.speed >= 16 && !v.q ? 0.5 : 1);
    if (btn) btn.classList.add('auto');
    bd.insertAdjacentHTML('beforeend', L`<div class="autobar" aria-hidden="true"><i id="autoProg"></i></div><div class="autonote"><span>${v.q ? "Cuộc đời sẽ tiếp tục sau giây lát. Chạm vào ô để viết, cuộc đời sẽ chờ đến khi bạn viết xong" : L`잠시 후 '${esc(btn ? btn.querySelector('b').textContent : '')}'(으)로 넘어가요 · 카드를 누르면 멈춰요`}</span><button class="ghost sm" id="autoStop">자동 결정 끄기</button></div>`);
    UI.autoDec = { k, t: 0, dur };
    const note = m.querySelector('#decNote'); if (note) { note.addEventListener('input', stopAuto, { once: true }); note.addEventListener('focus', stopAuto, { once: true }); }
    m.querySelector('.dec').addEventListener('pointerdown', e => { if (UI.autoDec && !e.target.closest('button, textarea')) stopAuto(); });
  } else bd.insertAdjacentHTML('beforeend', "<button class=\"ghost sm autoon\" id=\"autoOn\">Từ giờ để tự động quyết định</button>");
  if (v.q) bd.insertAdjacentHTML('beforeend', "<button class=\"ghost sm autoon\" id=\"refOff\">Không hiện cửa sổ này nữa</button>");
  const first = (UI.autoDec ? null : decNoteFocus(m)) || m.querySelector('button'); if (first && !UI.autoDec) first.focus({ preventScroll: true });
  renderTop();
}
function setReflect(on) {
  UI.prefs.reflect = !!on; lsSet(PREF_KEY, UI.prefs);
  if (S && S.phase === 'life') renderTop();
  toast(on ? "Ở tuổi 5, 15, 30, 50 và 70, cuộc đời sẽ tạm dừng để bạn ghi lại suy nghĩ." : "Đã tắt cửa sổ ghi suy nghĩ. Câu chuyện ở những tuổi ấy sẽ được lưu thành một dòng trong Ghi chép cuộc đời. Chạm vào '✎ Ghi suy nghĩ' để bật lại.");
}
HOOK.noPause = () => UI.prefs.reflect === false;
const HUM_KEY = 'one8b.hum.v1';
HOOK.humRecent = () => { const v = lsGet(HUM_KEY, []); return Array.isArray(v) ? v.flat().filter(x => typeof x === 'string') : []; };
function humRemember() { try { if (!S || S.replay || !S.done) return; const mine = Object.keys(HUM).concat(typeof SMALL !== 'undefined' ? Object.keys(SMALL) : []).filter(id => S.done[id]); const v = lsGet(HUM_KEY, []); lsSet(HUM_KEY, [mine].concat(Array.isArray(v) ? v.filter(Array.isArray) : []).slice(0, 2)); } catch (e) { } }
function decPeek(on) {
  const p = $('#decPeek'); if (!p) return;
  if (!on) { p.hidden = true; unlivedPlace(); return; }
  if (!S || !S.pending) return;
  stopAuto(); $('#modal').hidden = true;
  const v = S.pending.view; $('#decPeekT').textContent = v.q ? L`잠시 멈춤 · ${S.age}세` : (v.title || '');
  p.hidden = false; $('#decOpen').focus({ preventScroll: true }); unlivedPlace();
}
function decBack() {
  if (!S || !S.pending) { decPeek(false); return; }
  decPeek(false); $('#modal').hidden = false; UI.decAt = performance.now();
  const f = decNoteFocus($('#modal')) || $('#modal button[data-k]'); if (f) f.focus({ preventScroll: true });
}
function decNoteFocus(m) {
  const n = m && m.querySelector('#decNote'); if (!n) return null;
  try { if (matchMedia('(pointer: coarse)').matches) return null; } catch (e) { }
  return n;
}
function stopAuto() {
  UI.autoDec = null;
  const m = $('#modal'); m.querySelectorAll('.autobar, .autonote').forEach(x => x.remove()); m.querySelectorAll('button.auto').forEach(x => x.classList.remove('auto'));
}
function bcareMine() {
  if (!S || !S.flags) return;
  if (S.pending && S.pending.id === 'babycare' && S.pending.p) S.pending.p.auto = 0;
  if (S.pending && S.pending.id === 'babycare' || !UI.prefs.auto) { S.flags.bcareAuto = 0; if (S.flags.bcare) S.flags.bcare.auto = 0; }
}
function auSync() {
  if (!S || !S.flags || typeof auOff !== 'function') return;
  const on = UI.prefs.auto ? 1 : 0;
  if (on && !S.flags.au) { S.flags.au = 1; S.flags.focusOwn = 0; }
  else if (!on && S.flags.au) auOff();
}
function setAuto(on) {
  UI.prefs.auto = !!on; lsSet(PREF_KEY, UI.prefs); track('auto_toggle', { on: UI.prefs.auto });
  const auOn = S && S.flags ? (S.flags.auSets || []).filter(f => S.flags[f]).length : 0;
  auSync(); if (on && S && S.phase === 'life' && typeof auYear === 'function') auYear();
  if (!on) bcareMine();
  if (S && S.pending && !$('#modal').hidden) showDecision(S.pending);
  if (S && S.phase === 'life') { renderTop(); try { renderFocus(); } catch (e) { } }
  toast(on ? "Các quyết định giờ sẽ được đưa ra tự động. Mỗi cửa sổ quyết định sẽ hiện lên giây lát rồi tự chuyển tiếp." + ' ' + "Trọng tâm mỗi năm và các thói quen chi tiêu như đi ăn ngoài, quà tặng, tiền biếu bố mẹ cũng sẽ được tự động lo liệu."
    : "Giờ bạn lại tự quyết định." + (auOn ? ' ' + "Các thói quen chi tiêu mà Tự động quyết định đã bật cũng được tắt luôn." : ''), on ? 6000 : undefined);
}
function pickChoice(k, auto) {
  UI.autoDec = null; decPeek(false);
  if (auto) S.stats.auto = (S.stats.auto || 0) + 1;
  else bcareMine();
  const note = $('#decNote') ? $('#decNote').value : '';
  $('#modal').hidden = true;
  const n0 = S.log.length;
  try { choose(k, note); } catch (e) { reportCaught(e); if (S) S.pending = null; }
  if (auto) for (let i = n0; i < S.log.length; i++) if (S.log[i].kind === 'dec') S.log[i].au = 1;
  if (S.phase === 'life') { renderAll(); save(); }
}
function homeGuessNote() {
  return `<small class="hguess">${esc(capS("Nơi này chỉ được đoán dựa trên cài đặt ngôn ngữ của trình duyệt." + ' ' + "Thông tin chỉ được lưu trên thiết bị này." + ' ' + "Bạn có thể đổi ở mục 'Quốc gia nơi bạn thực sự sinh ra' trên màn hình đầu tiên, hoặc tắt bằng 'Tôi không muốn chọn'."))}</small>`;
}
function homeCompareHTML() {
  const H = S.home && CBY[S.home] ? CBY[S.home] : null; if (!H) return '';
  const b = BB(), a = S.deathAt.age, Hy = S.era && S.era !== 'now' ? eraAt(H, S.by) : H, lH = { l: survL(H.id, S.sex), e0: lifeTable(Hy, S.sex).e0 }, lB = { l: survL(S.born, S.sex), e0: lifeTable(b, S.sex).e0 };
  const pH = pctStr(lH.l[Math.min(111, a + 1)]), pB = pctStr(lB.l[Math.min(111, a + 1)]);
  if (S.homeG) return `<div class="homecmp">${capS(H.id === b.id ? L`이 사람은 당신이 태어난 곳으로 짐작한 <b>${esc(H.ko)}</b>에서 태어났습니다.` + ' ' + "Ngay trong cùng một đất nước, các cuộc đời vẫn có thể rẽ theo những hướng rất khác nhau."
    : L`당신이 태어난 곳으로 짐작한 <b>${esc(H.ko)}</b>에서 같은 해에 태어난 아이는 ${pH}가 ${a}세를 넘겨 삽니다.` + ' ' + L`${esc(b.ko)}에서는 ${pB}입니다.` + ' ' + L`두 곳의 기대수명은 ${lH.e0.toFixed(1)}세와 ${lB.e0.toFixed(1)}세입니다.`)}${homeGuessNote()}</div>`;
  if (H.id === b.id) return L`<div class="homecmp">이 사람은 당신과 같은 <b>${esc(H.ko)}</b>에서 태어났습니다. 같은 나라에서도 삶은 이렇게 다르게 흘러갑니다.</div>`;
  return L`<div class="homecmp">당신이 실제로 태어난 <b>${esc(H.ko)}</b>에서 같은 해에 태어난 아이는 ${pH}가 ${a}세를 넘겨 삽니다. ${esc(b.ko)}에서는 ${pB}입니다. 두 나라의 기대수명은 ${lH.e0.toFixed(1)}세와 ${lB.e0.toFixed(1)}세입니다.</div>`;
}
function fiveLivesHTML() {
  if (!S.comps || !S.comps.length) return '';
  const me = summaryOf(S);
  const all = [{ me: 1, o: me }].concat(S.comps.map(o => ({ me: 0, o }))).sort((x, y) => x.o.death.age - y.o.death.age);
  const ages = ageList(all.map(x => x.o.death.age));
  return L`<div class="panel"><h3><span>같은 1초에 태어난 다섯 사람</span><span class="lbl">짧은 순서</span></h3><ul class="lives5">${all.map(x => L`<li class="${x.me ? 'me' : ''}"><div class="ca">${x.o.death.age}세</div><div><b>${esc(x.o.name.full)}</b> · ${esc(CBY[x.o.iso].ko)}${x.me ? " · bạn trong cuộc đời này" : ''}<p>${esc(storyOf(x.o))}</p></div></li>`).join('')}</ul><p class="lives5note">같은 1초에 태어난 다섯 사람은 각각 ${ages}까지 살았습니다. 누구도 어디서 태어날지 고르지 않았습니다.</p></div>`;
}
function worksHTML() {
  const ids = typeof worksOf === 'function' ? worksOf(S) : []; if (!ids.length) return '';
  const T = WORK_T(), F = WORK_F(), O = WORK_ORG[LANG] || WORK_ORG.en;
  const items = ids.map(id => `<li><b>${esc(T[id])}</b><p class="wk-o"><span>${"Nơi đang làm việc này"}</span> ${O[id].map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" data-wk="${id}">${esc(n)}<span aria-hidden="true"> ↗</span></a>`).join('<span class="wk-dot" aria-hidden="true">·</span>')}</p><p>${esc(F[id])}</p></li>`).join('');
  return `<div class="panel works"><h3><span>${"Những điều cuộc đời này đã trải qua, hôm nay vẫn có người đang làm việc vì chúng"}</span></h3><ul class="works-l">${items}</ul><small class="wk-note">${"Mỗi đường link dẫn đến trang giới thiệu công việc của từng tổ chức. Các tổ chức này không liên quan đến Vô Hạn Trùng Sinh."}</small></div>`;
}
function journalHTML() {
  if (!S.journal || !S.journal.length) return '';
  return L`<div class="panel"><h3><span>이 삶에서 남긴 생각</span><span class="lbl">${S.journal.length}개</span></h3><ul class="journal">${S.journal.map(j => L`<li><small>${j.a}세 · ${esc(j.q)}</small><q>${esc(j.t)}</q></li>`).join('')}</ul></div>`;
}
const CRISIS_RE = /(\bi\s*(really\s*|just\s*)?(want|wanna)\s*(to\s*)?die\b|\bkill(ing)?\s*myself|\bend(ing)?\s*my\s*(own\s*)?life|\btake\s*my\s*(own\s*)?life|\b(i'?m|i\s*am|i\s*feel|feeling)\s*suicidal|\bdon'?t\s*want\s*to\s*(live|be\s*alive|exist)|\bhurt(ing)?\s*myself|\bcut(ting)?\s*myself|죽고\s*싶|살기\s*싫|살고\s*싶지\s*않|그만\s*살고\s*싶|사라지고\s*싶|없어지고\s*싶|자살\s*하고\s*싶|死にたい|しにたい|消えたい|きえたい|自殺し(たい|よう)|生きていたくない|生きてたくない|もう生きられない|いなくなりたい|リスカ|自傷(したい|して|した)|首を吊り?たい|飛び降りたい|我想死|好想死|想死了|真想死|不想活|活不下去|想自殺|想自杀|要自殺|要自杀|想輕生|想轻生|想結束(自己的)?生命|想结束(自己的)?生命|想了結自己|想了结自己|割腕|自殘|自残|想跳樓|想跳楼|자살\s*할\s*(거|까|래)|자해\s*(를\s*)?(하고|했|해)|죽어\s*버리고|극단적\s*(인\s*)?선택\s*(을\s*)?(하고|할)|목숨을\s*끊|(tôi|mình|tao|tớ|em|con)\s+(chỉ\s+|thật sự\s+|thực sự\s+|rất\s+)?muốn\s+chết|muốn\s+chết\s+(đi\s+)?cho\s+(rồi|xong)|(muốn|định|sẽ|sắp)\s+tự\s+(tử|sát)|nghĩ\s+(đến|tới)\s+(chuyện\s+|việc\s+)?tự\s+(tử|sát)|tự\s+(tử|sát)\s+cho\s+(rồi|xong)|(không|chẳng)\s+(còn\s+)?muốn\s+sống\s+nữa|(không|chẳng)\s+(còn\s+)?thiết\s+sống|(tôi|mình|tao|tớ|em|con)\s+(chán\s+sống|muốn\s+biến\s+mất)|không\s+muốn\s+tồn\s+tại|tự\s+kết\s+liễu|(kết\s+liễu|kết\s+thúc)\s+(cuộc\s+)?đời\s+mình|tự\s+(làm\s+)?(hại|đau)\s+(bản\s+thân|mình)|rạch\s+tay|muốn\s+nhảy\s+lầu|\b(khong|chang)\s+muon\s+song\s+nua\b|\bket\s+lieu\s+(cuoc\s+)?doi\s+minh\b|\btu\s+ket\s+lieu\b|\btu\s+(lam\s+)?hai\s+ban\s+than\b|\bmuon\s+tu\s+sat\b|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:(?:je|j['’ʼ`´]?|jv|jveux|jveu|jvx|jvais|jvai|moi\s+je)\s*(?:veux|veu|veut|voudrais|voudrai|aimerais|aimerai|souhaite)|(?:je\s+n['’ʼ`´]?\s*ai|j\s*['’ʼ`´]?\s*n?['’ʼ`´]?\s*ai|jai|jnai|g)\s+(?:trop\s+|tellement\s+|vraiment\s+|juste\s+|encore\s+|souvent\s+)?(?:envie|envi|le\s+go[uû]t))\s+(?:de\s+|d['’ʼ`´]?\s*)?(?:mourr?ir|crever)(?!\s*(?:de\s|d['’ʼ`´]|l['’ʼ`´]|du\s|des\s|en\s|[àa]\s|au\s|aux\s|comme\s|dans\s|entour|chez\s|vieux|vieille|[âa]g[ée]|un\s+jour|plus\s+tard|heureu|tranquille|paisible|dignement|pour\s|avec\s|sur\s|ici|l[àa]\s|la\s|le\s|un\s|une\s|apr[èe]s|avant|quand|si\s|sans\s|loin|pr[èe]s))|^\s*(?:trop\s+|tellement\s+)?envie\s+de\s+(?:mourr?ir|crever)(?!\s*(?:de\s|d['’ʼ`´]|l['’ʼ`´]|du\s|des\s|en\s|[àa]\s|au\s|aux\s|comme\s|dans\s|entour|chez\s|vieux|vieille|[âa]g[ée]|un\s+jour|plus\s+tard|heureu|tranquille|paisible|dignement|pour\s|avec\s|sur\s|ici|l[àa]\s|la\s|le\s|un\s|une\s|apr[èe]s|avant|quand|si\s|sans\s|loin|pr[èe]s))|(?:^|[^a-z0-9à-öø-ÿœæ_])me\s+suicid|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:je\s+(?:suis|me\s+sens|deviens)|jsuis|chui|chu)\s+(?:un\s+peu\s+|tr[eè]s\s+|vraiment\s+|encore\s+)?suicidaire|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:je\s+n['’ʼ`´]?\s*ai|j\s*['’ʼ`´]?\s*n?['’ʼ`´]?\s*ai|jai|jnai|g)\s+(?:encore\s+|souvent\s+|parfois\s+)?des\s+(?:pens[ée]es|id[ée]es)\s+(?:suicidaires|noires)|(?:^|[^a-z0-9à-öø-ÿœæ_])je\s+pense\s+(?:souvent\s+|beaucoup\s+|parfois\s+|encore\s+)?au\s+suicide(?!\s*(?:de\s|d['’ʼ`´]|du\s))|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:(?:je|j['’ʼ`´]?|jv|jveux|jveu|jvx|jvais|jvai|moi\s+je)\s*(?:vais|vai|veux|voudrais|pense\s+[àa]|songe\s+[àa]|devrais)|envie\s+de|besoin\s+de|j['’ʼ`´]?\s*ai\s+pens[ée]\s+[àa])\s+me\s+(?:tuer|pendre|flinguer|buter|foutre\s+en\s+l['’ʼ`´]?\s*air|jeter\s+(?:sous|du\s+haut|d['’ʼ`´]?\s*un|du\s+pont|par\s+la\s+fen))(?!\s*(?:[àa]\s|au\s|aux\s|sur\s|pour\s+(?:rien|toi|vous|eux|lui|elle)|de\s+rire|l[àa]-dessus))|(?:^|[^a-z0-9à-öø-ÿœæ_])me\s+foutre\s+en\s+l['’ʼ`´]?\s*air|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:(?:je|j['’ʼ`´]?|jv|jveux|jveu|jvx|jvais|jvai|moi\s+je)\s*(?:vais|veux)|envie\s+de)\s+sauter\s+(?:d['’ʼ`´]?\s*un|du|par\s+la|de\s+la)\s+(?:pont|toit|immeuble|fen[eê]tre|balcon|falaise)|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:mettre|mets|met|vais\s+mettre)\s+fin\s+[àa]\s+(?:mes\s+jours|ma\s+vie)|(?:^|[^a-z0-9à-öø-ÿœæ_])mettre\s+un\s+terme\s+[àa]\s+(?:ma\s+vie|mes\s+jours)|(?:^|[^a-z0-9à-öø-ÿœæ_])en\s+finir\s+avec\s+(?:la|ma|cette)\s+vie|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:(?:je|j['’ʼ`´]?|jv|jveux|jveu|jvx|jvais|jvai|moi\s+je)\s*(?:(?:veux|veu|veut|voudrais|voudrai|aimerais|aimerai|souhaite)|vais|vai)|(?:je\s+n['’ʼ`´]?\s*ai|j\s*['’ʼ`´]?\s*n?['’ʼ`´]?\s*ai|jai|jnai|g)\s+envie\s+d['’ʼ`´]?)\s*en\s+finir(?=\s*(?:$|[.!?…,;:]|une\s+bonne\s+fois|pour\s+de\s+bon|pour\s+toujours|avec\s+(?:moi|tout(?![\s-]*(?:[çc]a|cela|ce))|la\s+vie|ma\s+vie|cette\s+vie)\b))|(?:^|[^a-z0-9à-öø-ÿœæ_])me\s+donner\s+la\s+mort|(?:^|[^a-z0-9à-öø-ÿœæ_])m['’ʼ`´]?\s*[oô]ter\s+la\s+vie|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:je\s+n['’ʼ`´]?\s*ai|j\s*['’ʼ`´]?\s*n?['’ʼ`´]?\s*ai|jai|jnai|g)\s+(?:vraiment\s+|juste\s+|m[ê]me\s+)?(?:plus|pu|pas|aucune|plus\s+du\s+tout|plus\s+trop|plus\s+aucune)\s+(?:envie|envi|le\s+go[uû]t|la\s+force|la\s+volont[ée]|de\s+raison)\s+de\s+vivre(?!\s*(?:ici|l[àa]|comme|avec|dans|chez|en\s|[àa]\s|au\s|aux\s|sans|sous|seul|loin|pr[èe]s|de\s|d['’ʼ`´]|sur\s|une\s|un\s|cette|ce\s|[çc]a\b|cela|ainsi|l[àa]-bas|chere|ch[èe]re|en\s+ville))|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:je\s+(?:ne\s+|n['’ʼ`´]\s*)?|j['’ʼ`´]?\s*)(?:veux|veu|voudrais)\s+(?:plus|pu)\s+(?:vivre|exister)(?!\s*(?:ici|l[àa]|comme|avec|dans|chez|en\s|[àa]\s|au\s|aux\s|sans|sous|seul|loin|pr[èe]s|de\s|d['’ʼ`´]|sur\s|une\s|un\s|cette|ce\s|[çc]a\b|cela|ainsi|l[àa]-bas|chere|ch[èe]re|en\s+ville))|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:(?:veux|veu|veut|voudrais|voudrai|aimerais|aimerai|souhaite)|envie\s+de)\s+ne\s+plus\s+(?:exister|vivre|[ê]tre\s+l[àa]|me\s+r[ée]veiller)(?!\s*(?:ici|l[àa]|comme|avec|dans|chez|en\s|[àa]\s|au\s|aux\s|sans|sous|seul|loin|pr[èe]s|de\s|d['’ʼ`´]|sur\s|une\s|un\s|cette|ce\s|[çc]a\b|cela|ainsi|l[àa]-bas|chere|ch[èe]re|en\s+ville))(?!\s*(?:la\s+nuit|t[ôo]t|aussi|en\s+sursaut))|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:j['’ʼ`´]?\s*en\s+ai|jen\s+ai|j\s+en\s+ai)\s+(?:vraiment\s+|trop\s+|tellement\s+)?(?:marre|ras\s+le\s+bol|assez)\s+de\s+(?:vivre|la\s+vie|ma\s+vie)(?!\s*(?:ici|l[àa]|comme|avec|dans|chez|en\s|[àa]\s|au\s|aux\s|sans|sous|seul|loin|pr[èe]s|de\s|d['’ʼ`´]|sur\s|une\s|un\s|cette|ce\s|[çc]a\b|cela|ainsi|l[àa]-bas|chere|ch[èe]re|en\s+ville))(?!\s*(?:de\s|d['’ʼ`´]|ch[èe]re|parisienne|citadine|[àa]\s|qu))|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:je\s+suis|jsuis|chui|chu|j['’ʼ`´]?\s*suis)\s+(?:tellement\s+|trop\s+|vraiment\s+)?(?:tann[ée]e?|fatigu[ée]e?|las|lasse|[ée]c(?:œ|oe)ur[ée]e?)\s+de\s+(?:vivre|la\s+vie)(?!\s*(?:ici|l[àa]|comme|avec|dans|chez|en\s|[àa]\s|au\s|aux\s|sans|sous|seul|loin|pr[èe]s|de\s|d['’ʼ`´]|sur\s|une\s|un\s|cette|ce\s|[çc]a\b|cela|ainsi|l[àa]-bas|chere|ch[èe]re|en\s+ville))|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:tout\s+le\s+monde|le\s+monde|ils|elles|vous|ma\s+famille|mes\s+parents|ils\s+tous)\s+(?:serai(?:en)?t|seront|serait)\s+(?:tous\s+|toutes\s+)?mieux\s+sans\s+moi|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:(?:je|j['’ʼ`´]?|jv|jveux|jveu|jvx|jvais|jvai|moi\s+je)\s*(?:veux|veu|veut|voudrais|voudrai|aimerais|aimerai|souhaite)|(?:je\s+n['’ʼ`´]?\s*ai|j\s*['’ʼ`´]?\s*n?['’ʼ`´]?\s*ai|jai|jnai|g)\s+(?:trop\s+|tellement\s+|vraiment\s+|juste\s+|souvent\s+)?envie\s+de)\s+dispara[iî]tre(?!\s*(?:sous|de\s|d['’ʼ`´]|du\s|des\s|quelques|un\s+(?:moment|peu|instant|temps|week|jour|mois|an)|une\s|pendant|en\s|[àa]\s|au\s|aux\s|dans|loin|ailleurs|deux|trois|le\s+temps|pour\s+(?:quelques|un|une|le\s+week)|avec|chez))|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:(?:je|j['’ʼ`´]?|jv|jveux|jveu|jvx|jvais|jvai|moi\s+je)\s*(?:vais|vai|(?:veux|veu|veut|voudrais|voudrai|aimerais|aimerai|souhaite))|envie\s+de|besoin\s+de|recommenc\w*\s+[àa]|continue\w*\s+[àa])\s+me\s+faire\s+du\s+mal(?!\s*(?:[àa]\s|en\s|pour\s+rien))|(?:^|[^a-z0-9à-öø-ÿœæ_])je\s+me\s+(?:fais|suis\s+fait|suis\s+faite)\s+du\s+mal(?!\s*(?:[àa]\s|en\s|pour\s+rien|tout\s+seul|toute\s+seule|au\s|aux\s))|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:me|m['’ʼ`´])\s*(?:scarifi|automutil|mutil)|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:je\s+me|jme)\s+(?:suis\s+)?(?:scarif|mutil)|(?:^|[^a-z0-9à-öø-ÿœæ_])me\s+(?:couper|tailler|ouvrir|taillader|entailler)\s+les\s+(?:veines|poignets|bras|cuisses)|(?:^|[^a-z0-9à-öø-ÿœæ_])m['’ʼ`´]?\s*ouvrir\s+les\s+veines|(?:^|[^a-z0-9à-öø-ÿœæ_])(?:recommenc\w*|continue\w*)\s+[àa]\s+me\s+(?:couper|scarifier|mutiler)|(?:^|[^a-z0-9à-öø-ÿœæ_])je\s+me\s+coupe(?:\s+(?:encore|souvent|volontairement|expr[eè]s))?\s*(?:$|[.!?…,;])|(?<!ไม่)(?<!ไม่ได้)อยากตาย|(?<!ไม่)(?<!ไม่ได้)อยาก(?:จะ)?ฆ่าตัวตาย|(?:คิด|กำลังคิด|ตั้งใจ)(?:จะ|ว่าจะ)?ฆ่าตัวตาย|ไม่อยาก(?:มีชีวิต)?อยู่(?:ต่อ)?(?:แล้ว|อีกต่อไป)|ไม่อยากมีชีวิตอยู่|อยาก(?:หายไป|หายไปจากโลก)|อยากจบชีวิต|จบชีวิตตัวเอง|ทำร้ายตัวเอง|กรีด(?:แขน|ข้อมือ)(?:ตัวเอง)?|ไม่อยากตื่น(?:ขึ้นมา)?อีก)/;
const CALM_KEY = 'one8b.calm.v1', CALM_MS = 30 * 864e5;
let CALM_AT = null;
function calmMark() { CALM_AT = Date.now(); try { localStorage.setItem(CALM_KEY, String(CALM_AT)); } catch (e) { } }
HOOK.calm = () => { if (CALM_AT == null) { let v = 0; try { v = +localStorage.getItem(CALM_KEY) || 0; } catch (e) { } CALM_AT = v; } return Date.now() - CALM_AT < CALM_MS; };
function crisisNote(t) {
  if (!t || !CRISIS_RE.test(String(t).normalize('NFC').toLowerCase())) return;
  calmMark();
  toast(EDU_ON ? L`지금 마음이 힘들다면 혼자 견디지 않아도 돼요. 청소년상담 1388 (휴대전화는 지역번호+1388, 문자는 #1388)이나 자살예방상담전화 109 (24시간), SNS 상담 마들랜이 이야기를 들어 줄 거예요. 다른 나라에서는 findahelpline.com에서 찾을 수 있어요.`
    : L`혹시 지금 마음이 많이 힘드시다면, 109(자살예방상담전화, 24시간)에 전화해 보세요. 누군가 이야기를 들어 줄 거예요. 연결이 어렵다면 정신건강위기상담 1577-0199(24시간)나 SNS 상담 마들랜도 있어요.`, 12000);
}
function saveFarewell() {
  const v = (($('#farewell') || {}).value || '').trim().slice(0, 60);
  S.farewell = v;
  const lives = lsGet(LIVES_KEY, []); const li = S.lifeAt ? lives.find(l => l.at === S.lifeAt) : lives[lives.length - 1];
  if (li) { li.note = v; lsSet(LIVES_KEY, lives); }
  if (S.lifeAt) { const past = lsGet(PAST_KEY, []), p = past.find(x => x.at === S.lifeAt); if (p) { p.S.farewell = v; lsSet(PAST_KEY, past); } }
  const im = $('#cardImg'); if (im) { im.hidden = true; const w = $('#cardWait'); if (w) w.hidden = false; }
  prepCard('death').then(cc => { const im2 = $('#cardImg'); if (cc && im2) { im2.src = cardImgSrc(cc); im2.hidden = false; const w = $('#cardWait'); if (w) w.hidden = true; } });
  $('#shareText').textContent = shareText();
  toast(v ? "Đã lưu lại, và cũng đã đưa vào thẻ." : "Đã xóa lời bạn để lại.");
  track('farewell', { len: v.length });
  if (CRISIS_RE.test(v.normalize('NFC').toLowerCase())) crisisNote(v);
}
function eduHold() {
  if (!EDU_ON) return null;
  const sv = lsGet(SAVE_KEY, null);
  return sv && sv.S && sv.S.eduOn && !sv.S.replay && (sv.S.phase === 'life' || sv.S.phase === 'birth') && CBY[sv.S.cur] ? sv : null;
}
const EDU_HOLD_T = () => "Trong bản cho lớp học, một cuộc đời đã sinh ra sẽ được sống đến cuối. Khi cuộc đời này kết thúc, bạn có thể sinh ra lần nữa.";
const eduCodeTyped = () => { const cc = $('#classCode'); return !!(cc && /^\d{4}$/.test(cc.value.replace(/\s/g, ''))); };
function eduHoldUi() {
  const hold = !eduCodeTyped() && !!eduHold();
  for (const id of ['startBtn', 'startBtn2']) { const b = $('#' + id); if (b) b.hidden = hold; }
  const ch = $('.ctahint'); if (ch) { if (ch.dataset.t0 == null) ch.dataset.t0 = ch.textContent; ch.textContent = hold ? EDU_HOLD_T() : ch.dataset.t0; }
}
const ISO2 = {AE:'ARE',AF:'AFG',AO:'AGO',AR:'ARG',AT:'AUT',AU:'AUS',AZ:'AZE',BD:'BGD',BE:'BEL',BF:'BFA',BG:'BGR',BI:'BDI',BJ:'BEN',BO:'BOL',BR:'BRA',BW:'BWA',BY:'BLR',CA:'CAN',CD:'COD',CF:'CAF',CG:'COG',CH:'CHE',CI:'CIV',CL:'CHL',CM:'CMR',CN:'CHN',CO:'COL',CR:'CRI',CU:'CUB',CZ:'CZE',DE:'DEU',DK:'DNK',DO:'DOM',DZ:'DZA',EC:'ECU',EG:'EGY',ER:'ERI',ES:'ESP',ET:'ETH',FI:'FIN',FR:'FRA',GA:'GAB',GB:'GBR',GE:'GEO',GH:'GHA',GM:'GMB',GN:'GIN',GQ:'GNQ',GR:'GRC',GT:'GTM',GW:'GNB',HN:'HND',HT:'HTI',HU:'HUN',ID:'IDN',IE:'IRL',IL:'ISR',IN:'IND',IQ:'IRQ',IR:'IRN',IT:'ITA',JM:'JAM',JO:'JOR',JP:'JPN',KE:'KEN',KG:'KGZ',KH:'KHM',KP:'PRK',KR:'KOR',KW:'KWT',KZ:'KAZ',LA:'LAO',LB:'LBN',LK:'LKA',LR:'LBR',LS:'LSO',LY:'LBY',MA:'MAR',MG:'MDG',ML:'MLI',MM:'MMR',MN:'MNG',MR:'MRT',MW:'MWI',MX:'MEX',MY:'MYS',MZ:'MOZ',NA:'NAM',NE:'NER',NG:'NGA',NI:'NIC',NL:'NLD',NO:'NOR',NP:'NPL',NZ:'NZL',OM:'OMN',PA:'PAN',PE:'PER',PG:'PNG',PH:'PHL',PK:'PAK',PL:'POL',PS:'PSE',PT:'PRT',PY:'PRY',QA:'QAT',RO:'ROU',RS:'SRB',RU:'RUS',RW:'RWA',SA:'SAU',SD:'SDN',SE:'SWE',SG:'SGP',SK:'SVK',SL:'SLE',SN:'SEN',SO:'SOM',SS:'SSD',SV:'SLV',SY:'SYR',TD:'TCD',TG:'TGO',TH:'THA',TJ:'TJK',TM:'TKM',TN:'TUN',TR:'TUR',TW:'TWN',TZ:'TZA',UA:'UKR',UG:'UGA',US:'USA',UY:'URY',UZ:'UZB',VE:'VEN',VN:'VNM',YE:'YEM',ZA:'ZAF',ZM:'ZMB',ZW:'ZWE',HK:'HKG',MO:'MAC',PR:'PRI',ME:'MNE',HR:'HRV',TL:'TLS',SB:'SLB',AM:'ARM',AL:'ALB',BA:'BIH',MD:'MDA',LT:'LTU',MK:'MKD',SI:'SVN',LV:'LVA',EE:'EST',CY:'CYP',BH:'BHR',MU:'MUS',TT:'TTO',GY:'GUY',SZ:'SWZ',DJ:'DJI',KM:'COM',FJ:'FJI',BT:'BTN',CV:'CPV',SR:'SUR',LU:'LUX',MT:'MLT',MV:'MDV',XK:'XKX'};
const LANG_HOME = { ko: 'KOR', ja: 'JPN', vi: 'VNM', fr: 'FRA', th: 'THA', id: 'IDN', ms: 'MYS', tl: 'PHL', fil: 'PHL', km: 'KHM', lo: 'LAO', my: 'MMR', mn: 'MNG', ne: 'NPL', bn: 'BGD', ur: 'PAK', fa: 'IRN', tr: 'TUR', uk: 'UKR', pl: 'POL', ro: 'ROU', hu: 'HUN', cs: 'CZE', sk: 'SVK', el: 'GRC', he: 'ISR', sv: 'SWE', nb: 'NOR', no: 'NOR', da: 'DNK', fi: 'FIN', nl: 'NLD', it: 'ITA', de: 'DEU', uz: 'UZB', kk: 'KAZ', am: 'ETH', sw: 'TZA', ka: 'GEO', az: 'AZE' , et: 'EST', lv: 'LVA', lt: 'LTU', sl: 'SVN', hr: 'HRV', bs: 'BIH', sq: 'ALB', hy: 'ARM', mk: 'MKD', mt: 'MLT' };
function guessHome() {
  try {
    const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).map(x => String(x));
    for (const l of langs) {
      const sub = l.toLowerCase().split(/[-_]/), lang = sub[0];
      const reg = sub.slice(1).find(x => /^[a-z]{2}$/.test(x)) || '';
      if (lang === 'en' && (!reg || reg === 'us')) continue;
      if (lang === 'ko') return 'KOR';
      if (lang === 'zh' && !reg) continue;
      if (reg && reg.length === 2 && ISO2[reg.toUpperCase()] && CBY[ISO2[reg.toUpperCase()]]) return ISO2[reg.toUpperCase()];
      if (LANG_HOME[lang] && CBY[LANG_HOME[lang]]) return LANG_HOME[lang];
    }
  } catch (e) { }
  return '';
}
function initEraSel() {
  const sel = $('#eraYr'); if (!sel || sel.options.length) return;
  let h = `<option value="r">${L`아무 해나 (${ERA_Y0}~${ERA_PAST1})`}</option>`;
  for (let y = ERA_PAST1; y >= ERA_Y0; y--) h += `<option value="${y}">${y}</option>`;
  sel.innerHTML = h; sel.value = eraRand() ? 'r' : String(eraYear() || ERA_Y_DEF);
  sel.addEventListener('change', () => { UI.prefs.eraY = sel.value === 'r' ? 'r' : +sel.value; lsSet(PREF_KEY, UI.prefs); renderIntro(); });
}
function initHomeSel() {
  initEraSel();
  const sel = $('#homeSel'); if (!sel || sel.options.length) return;
  const nm = c => c.ko;
  const list = COUNTRIES.slice().sort((a, b) => nm(a).localeCompare(nm(b), LANG));
  sel.innerHTML = "<option value=\"\">Tôi không muốn chọn</option>" + list.map(c => `<option value="${c.id}">${esc(nm(c))}</option>`).join('');
  const auto = !UI.prefs.homeHand;
  if (auto) UI.prefs.home = guessHome();
  sel.value = UI.prefs.home || '';
  const hint = sel.parentElement.querySelector('.hint');
  if (hint && auto && UI.prefs.home) hint.textContent = "Đã chọn sẵn dựa trên ngôn ngữ của trình duyệt. Nếu chưa đúng, bạn hãy đổi lại. Cuộc đời này và cuộc đời của bạn sẽ được đặt cạnh nhau để so sánh.";
  sel.addEventListener('change', () => { UI.prefs.home = sel.value; UI.prefs.homeHand = 1; lsSet(PREF_KEY, UI.prefs); });
}
function recordLife() {
  if (!S || S.replay || S.recorded || !S.deathAt) return;
  const d = S.deathAt, b = B();
  S.recorded = true;
  const lives = lsGet(LIVES_KEY, []), at = Date.now(); S.lifeAt = at;
  lives.push({ name: S.name.full, ko: b.ko, iso: S.born, sex: pubSex(), age: d.age, cause: d.cause === 'suic' ? "Đã qua đời" : d.label, job: lastWorkLabel() === '—' ? '' : lastWorkLabel(), comps: (S.comps || []).map(c => c.death.age), at,
    lived: [...new Set(S.years.map(y => y.cur))], kids: kidsCount(), y: S.era === 'past' ? S.by : undefined, grand: (S.flags.grand || 0) + (S.flags.ggrand || 0), edu: S.eduOn ? 1 : undefined,
    sk: typeof skinMe === 'function' ? skinMe() : undefined, pt: typeof shelfPetOf === 'function' ? shelfPetOf(S) : undefined });
  lsSet(LIVES_KEY, lives.slice(-LIVES_MAX));
  savePast(at); askKeepStore(); humRemember(); if (typeof bxRemember === 'function') bxRemember();
  { const b = S.stats.buys || 0; track('spend', { kind: (b === 0 ? '0' : b < 5 ? '1-4' : b < 15 ? '5-14' : '15up') + (S.stats.inv ? 'i' : '') }); }
  track('life_end', { era: !!(S.era && S.era !== 'now'), country: S.born, age: d.age, cause: d.cause, decisions: S.stats.decisions, auto: (S.stats.auto || 0) > 0, notes: (S.journal || []).length, minutes: S.startedAt ? Math.round((Date.now() - S.startedAt) / 60000) : null });
}
function deathFallback() {
  
  try { $('#ending') && $('#ending').remove(); } catch (e) { }
  let story = ''; try { story = storyOf(summaryOf(S)); } catch (e) { }
  $('#dead').innerHTML = L`<div class="panel" style="margin-top:24px"><h3><span>${esc(S.name && S.name.full || '')}</span></h3><p>${esc(story)}</p><p class="lbl" style="margin-top:12px">기록 화면을 그리는 중 문제가 생겼어요. 이 삶은 전생 기록에 남아 있어요.</p></div><div class="vhts-death-actions" style="margin: 1.5rem 0 1rem; display: flex; flex-direction: column; gap: 8px;">
    <button type="button" id="btnMigMap" style="width: 100%; padding: 10px 14px; border: 1px solid var(--rule); background: #FAF9F6; font-family: var(--serif); font-size: 13px; font-weight: bold; cursor: pointer; text-align: center;">
      🗺️ BẢN ĐỒ LỘ TRÌNH DI CƯ TOÀN CẦU CỦA KIẾP NÀY
    </button>
    <button type="button" id="btnWhatIf" style="width: 100%; padding: 10px 14px; border: 1px solid #111827; background: #111827; color: #FFFFFF; font-family: var(--serif); font-size: 13px; font-weight: bold; cursor: pointer; text-align: center;">
      ⏳ HIỆU ỨNG CÁNH BƯỚM: PHÂN NHÁNH THỰC TẠI SONG SONG
    </button>
  </div>
  <div class="endbtns"><button class="cta" id="againBtn">다시 태어나기</button><button class="ghost" id="homeBtn">처음 화면으로</button></div>`;
  show('dead');
}
function estateHTML() {
  if (!S.deathAt || S.deathAt.age < 18) return '';
  let E; try { E = estatePlan(); } catch (e) { return ''; }
  if (!E.rows.length && !E.how) return '';
  const its = estateItems();
  return `<div class="panel estate"><h3><span>${"Tài sản để lại đã được chia như thế này"}</span><span class="lbl">${"quy theo giá Việt Nam · trước thuế"}</span></h3>${its.length > 1 ? `<p class="ctx">${esc(its.map(([n, x]) => `${n} ${x < 0 ? '−' : ''}${wonStr(Math.abs(x))}`).join(' · '))}</p>` : ''}<p class="ctx">${esc(E.how)}</p>`
    + (E.rows.length ? `<ul class="moments">${E.rows.map(([n, x]) => `<li><span class="a">${wonStr(x)}</span><span>${esc(capS(n))}</span></li>`).join('')}</ul>` : '') + `</div>`;
}
const leftCellHTML = () => {
  const nw = S.age >= 15 ? leftWorth() : null, q = nw > 0 ? wealthTop(C(), nw) : null;
  return `<div><small>${"Tài sản để lại (quy theo giá Việt Nam)"}</small><b>${nw != null ? wonStr(nw) : '—'}</b>${q != null ? `<small>${esc(L`${C().ko} 재산 ${topStr(q)}`)}</small>` : ''}</div>`;
};
const sumCell =(k, b, sm) => `<div><small>${k}</small><b>${esc(b)}</b>${sm ? `<small>${esc(sm)}</small>` : ''}</div>`;
function partnerCell(age) {
  if (age < 18) return ['—', ''];
  const o = peopleOf(S, age), P = S.fam.partner, nm = P ? callName(P.name) : '', wed = o.pU === 'm';
  const role = o.pU === 'cp' ? "Bạn đời" : o.pU === 'none' ? "Người chung sống" : "Bạn đời", more = wed && o.pN >= 2 ? L`결혼 ${o.pN}번` : '';
  const sm = (...x) => x.filter(Boolean).join(' · ');
  const w2 = S.fam.wife2 && S.sex === 'M' ? S.fam.wife2 : null, w2t = w2 ? (w2.alive ? L`두 번째 아내 ${callName(w2.name)}` : L`두 번째 아내 ${callName(w2.name)} (먼저 떠남)`) : '';
  if (o.pt === 'now') return [`${role} ${nm}`, sm(o.pY >= 1 ? L`${o.pY}년을 함께` : '', more, w2t)];
  if (o.pt === 'lost') return [`${role} ${nm}`, sm(o.pY >= 1 ? L`${o.pY}년을 함께하다 먼저 떠나보냄` : "đã ra đi trước bạn", more, w2t)];
  if (o.pt === 'apart') return [nm ? (wed ? L`${wa(nm)} 결혼했다가 헤어짐` : L`${wa(nm)} 함께 살다가 헤어짐`) : wed ? "Kết hôn, sau đó chia tay" : "Sống chung, rồi chia tay", sm(o.pY >= 1 ? L`${o.pY}년을 함께` : '', more)];
  if (o.pt === 'never') return ["Chưa từng kết hôn", ''];
  return S.fam.dating ? [L`만나던 사람 ${callName(S.fam.dating.name)}`, ''] : ['—', ''];
}
function seeOffCell(age) {
  const p = attendParts(age);
  return p.length ? [listAnd(p), ''] : [age < 5 ? '—' : age >= 18 ? "Vài người hàng xóm" : "Vài người hàng xóm và bạn cũ", ''];
}
const HAPPY_WHY = { love: "năm tình yêu đến", baby: "năm một đứa con chào đời", grand: "năm một đứa cháu chào đời", edu: "năm vượt qua một chặng học hành", job: "năm bắt đầu công việc mới", move: "năm chuyển đến nơi ở mới", trip: "năm đi xa", star: "năm có điều khó quên", buy: "năm sắm nhà hoặc món đồ lớn" };
function happiestCell() {
  let best = null; for (const y of S.years) if (y.mk !== 'death' && (!best || y.h > best.h)) best = y;
  if (!best) return ['—', ''];
  return [L`${best.a}세 (${S.by + best.a}년)`, HAPPY_WHY[best.mk] || (best.a < 13 ? L`어린 시절${LBL}` : '')];
}
function timeSpentHTML() {
  const fY = S.stats && S.stats.fY; if (!fY || S.stats.fYa == null || S.stats.fYa > 18) return '';
  const all = Object.entries(fY).filter(([k]) => FOCUS[k]).sort((x, y) => y[1] - x[1]), tot = all.reduce((t, x) => t + x[1], 0);
  if (tot < 3) return '';
  const top = all.slice(0, 3).filter(x => x[1] >= 0.5), rest = Math.round(tot - top.reduce((t, x) => t + x[1], 0));
  const parts = top.map(([k, y]) => L`${FOCUS[k].n} ${Math.max(1, Math.round(y))}년`).concat(rest >= 1 ? [L`그 밖 ${rest}년`] : []);
  return `<div class="wide"><small>${"Những năm trưởng thành đã dành cho"}</small><b>${esc(parts.join(' · '))}</b></div>`;
}
function moneyEndHTML(peak) {
  return `<div class="panel"><h3><span>Tài chính & Quyết định</span></h3><div class="vhts-karma-box" style="margin: 0.5rem 0; padding: 0.75rem 1rem; border: 1px solid var(--rule); background: var(--card2); font-family: var(--f-display); font-size: 0.9rem; line-height: 1.5;">
        <div style="font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink3); font-family: var(--f-mono);">ẤN KÝ LUÂN HỒI · SAMSARA SOUL IMPRINT</div>
        <div style="margin-top: 0.25rem; font-size: 1rem; font-weight: bold; color: var(--ink);">
          ${S.generatedKarma ? `[${esc(S.generatedKarma.title)}] · +${S.generatedKarma.pts} Điểm Luân Hồi` : '[Ý chí Kiên định] · Khởi đầu Vòng lặp mới'} ${S.cultivation ? `<span style="color: #6366F1; font-weight: normal; margin-left: 8px;">(Cảnh giới: ${esc(S.cultivation.name)})</span>` : ''}
        </div>
        <div style="margin-top: 0.2rem; color: var(--ink2); font-size: 0.85rem;">
          ${S.generatedKarma ? `Kiếp sống ${S.age} tuổi kết thúc, tích lũy ấn ký ban phước cho kiếp người kế tiếp.` : 'Linh hồn sẵn sàng cho cuộc trùng sinh mới giữa 8 tỷ nhân loại.'}
        </div>
      </div>
      <div class="summary">
    <div><small>Thu nhập đỉnh cao</small><b>${peak > 0 ? usdStr(peak) + ' PPP' : '—'}</b>${peak > 0 ? `<small>Thu nhập thế giới ${rankStr(worldPct(peak))}</small>` : ''}</div>
    <div><small>Quyết định đã đưa ra</small><b>${S.stats.decisions} lần</b>${S.stats.auto ? `<small>Trong đó ${S.stats.auto} lần tự động</small>` : ''}</div></div></div>`;
}
function countryCodes() {
  const r = typeof adoptFrom === 'function' && adoptFrom() ? [adoptFrom()] : []; for (const y of S.years || []) if (y.cur && CBY[y.cur] && r[r.length - 1] !== y.cur) r.push(y.cur);
  return r;
}
function countryPath() { const r = countryCodes(); return (r.length > 7 ? [...new Set(r)] : r).map(i => CBY[i].ko); }
function deadOrder() {
  const st = $('#dead .deadstack'), fw = st && st.querySelector('.farewell'), sb = $('#dead .sharebox'), a2 = $('#a2Dead');
  if (fw && sb) { fw.after(sb); if (a2) sb.after(a2); }
  const af = $('#dead .after'), mo = af && af.querySelector('.moments'), mp = mo && mo.closest('.panel'); if (!mp) return;
  const parts = []; for (let el = mp.nextElementSibling; el; el = el.nextElementSibling) if (!el.matches('.lifelog, .flow')) parts.push(el);
  const dt = document.createElement('details'); dt.className = 'panel morelife';
  dt.innerHTML = `<summary><span class="ml-t">${"Chi tiết về cuộc đời này"}</span><small class="ml-s"></small></summary><div class="ml-in"></div>`;
  mp.after(dt); const box = dt.querySelector('.ml-in'); parts.forEach(el => box.appendChild(el));
  deadMoreSum();
}
function deadMoreSum() {
  const dt = $('#dead .morelife'); if (!dt) return;
  const has = q => !!dt.querySelector(q), n = [has('.kidslife') ? "Cuộc đời các con" : '', has('.deadfam') ? "Gia đình và cuộc sống" : '', has('.ml-in .summary') ? "Tiền và quyết định" : '', has('.estate') ? "Tài sản để lại" : ''].filter(Boolean);
  if (!n.length) { dt.remove(); return; }
  dt.querySelector('.ml-s').textContent = n.join(' · ');
}
function eduApply() {
  const e = $('#eduTag'); if (e) e.remove();
  const n = $('#eduNote'); if (n) n.remove();
}
const EDU_PREV = new Set(['neo', 'lri', 'diar', 'mal', 'tb', 'hiv', 'oinf', 'nut', 'covid', 'epid']);
const EDU_ACC = new Set(['road', 'drown']), EDU_INJ = new Set(['fall', 'fire', 'inj', 'od']);
const EDU_VIO = new Set(['war', 'geno', 'pol', 'hom']);
let EDU_U5W = null;
function eduEarlyHTML() {
  const d = S && S.deathAt; if (!d || !(EDU_ON || S.eduOn) || d.age >= 15 || d.cause === 'suic') return '';
  const nm = callName(S.name), c = CBY[d.where] || C(), dl = (d.label || '').replace(/ \(.*\)$|（.*）$/, '');
  if (EDU_U5W == null) EDU_U5W = Math.round(COUNTRIES.reduce((t, x) => t + x.u5 * x.b, 0) / TOTAL_BIRTHS);
  const hom = d.cause === 'hom' && d.label === CAUSE.hom, own = !!CAUSE[d.cause] && d.label !== CAUSE[d.cause] && !['can', 'oinf', 'ocd'].includes(d.cause);
  const p = [[hom ? (d.age < 1 ? L`${eun(nm)} 첫돌을 맞기 전에 누군가의 폭력으로 세상을 떠났어요.` : L`${eun(nm)} ${d.age}살에 누군가의 폭력으로 세상을 떠났어요.`)
    : d.age < 1 ? L`${eun(nm)} 첫돌을 맞기 전에 ${ro(dl)} 세상을 떠났어요.` : L`${eun(nm)} ${d.age}살에 ${ro(dl)} 세상을 떠났어요.`]];
  let src = '';
  if (d.age < 5) { const u = c.u5 >= 10 ? Math.round(c.u5) : Math.round(c.u5 * 10) / 10; p.push([L`${c.ko}에서는 아이 1,000명 가운데 ${u}명이 다섯 살이 되기 전에 세상을 떠나요.`, L`세계 평균은 1,000명당 ${EDU_U5W}명이에요.`]); src = 'UN IGME'; }
  if (own) { }
  else if (EDU_PREV.has(d.cause)) { p.push(["Những bệnh như thế này, nếu có nước sạch, đủ dinh dưỡng, tiêm chủng, cơ sở y tế và thuốc men ở gần, trong nhiều trường hợp có thể phòng ngừa hoặc chữa khỏi."]); src = "Hơn một nửa số ca tử vong ở trẻ em là do những bệnh có thể phòng ngừa hoặc điều trị bằng những cách đơn giản, không tốn kém (WHO)"; }
  else if (EDU_ACC.has(d.cause)) { p.push(["Tai nạn giao thông và đuối nước là những nguyên nhân lớn khiến trẻ em và thanh thiếu niên trên thế giới mất đi sinh mạng.", "Đường sá an toàn, sự trông nom của người lớn và cơ hội học bơi giúp bảo vệ rất nhiều sinh mạng."]); src = "Tai nạn giao thông là nguyên nhân tử vong hàng đầu ở lứa tuổi 5–29, và đuối nước là một trong mười nguyên nhân tử vong hàng đầu ở lứa tuổi 1–24 (WHO)"; }
  else if (EDU_INJ.has(d.cause)) p.push(["Tai nạn thương tích là một trong những nguyên nhân lớn khiến trẻ em và thanh thiếu niên trên thế giới mất đi sinh mạng.", "Nhà cửa và đường sá an toàn, cùng sự trông nom của người lớn, giúp bảo vệ rất nhiều sinh mạng."]);
  else if (EDU_VIO.has(d.cause)) p.push(["Chiến tranh và bạo lực cũng cướp đi cuộc sống của những đứa trẻ sống ở đó.", "Mọi trẻ em đều có quyền được lớn lên an toàn."]);
  else if (d.cause === 'mat') p.push(["Kết hôn và sinh con khi còn quá trẻ đều nguy hiểm cho cả người mẹ trẻ lẫn em bé."]);
  else if (d.cause === 'disa') p.push(["Thiên tai cũng cướp đi cuộc sống của những đứa trẻ sống ở đó."]);
  else if (d.cause === 'ocd') p.push(["Ở nơi có thể chữa trị gần nhà, nhiều trẻ sống sót hơn."]);
  else p.push(["Có những bệnh khó phòng ngừa dù trẻ sinh ra ở đâu.", "Dù vậy, ở nơi có thể chữa trị gần nhà, nhiều trẻ sống sót hơn."]);
  p.push(["Cuộc đời này tuy ngắn, nhưng đã thật sự có mặt trên thế gian này."]);
  return `<div class="panel edubox"><h3><span>${"Vì sao cuộc đời này kết thúc sớm như vậy?"}</span></h3>${p.map(x => `<p>${esc(x.join(' '))}</p>`).join('')}${src ? `<p class="edusrc">${esc(src)}</p>` : ''}
    <p class="eduq">${esc(L`함께 생각해 보기: 무엇이 있었다면 ${eun(nm)} 더 오래 살 수 있었을까요?`)}</p>
    <div class="endbtns"><button class="cta" id="eduAgain">${"Chào đời lần nữa"}</button></div><small>${"Khi chào đời lần nữa, một cuộc đời mới sẽ bắt đầu ở một đất nước khác, trong một gia đình khác."}</small></div>`;
}
function showDeath() {
  $('#modal').hidden = true;
  if (S.lifeAt) lsSet(OPEN_KEY, { at: S.lifeAt, t: Date.now() });
  if (!S.endD && S.deathAt) { try { S.endD = endingData(); } catch (e) { } }
  if (S.endD && S.endD.frames) { const J = new Set((S.journal || []).map(j => j.a + '|“' + j.t + '”')); S.endD.frames.forEach(f => { if (f.note) f.note = J.has(f.a + '|' + f.t); }); }
  const d = S.deathAt, b = BB(), c = CBY[d.where] || b;
  const ltB = lifeTable(b, S.sex);
  const longer = survL(S.born, S.sex)[Math.min(111, d.age + 1)];
  const e0 = ltB.e0, diff = d.age - e0;
  const sx = transLived() ? 'bạn đồng trang lứa' : S.sex === 'F' ? 'bé gái' : 'bé trai';
  const peak = S.stats.maxIncome;
  const migList = countryPath();
  const ctyBirthName = (typeof COUNTRY_T !== 'undefined' && COUNTRY_T[b.id]) || (typeof I18N_T !== 'undefined' && I18N_T[b.ko]) || b.ko;
  const ctyDeathName = (typeof COUNTRY_T !== 'undefined' && COUNTRY_T[c.id]) || (typeof I18N_T !== 'undefined' && I18N_T[c.ko]) || c.ko;
  const sexLabel = pubSex() === 'F' ? 'Nữ giới' : 'Nam giới';
  const ageSpanLabel = d.age >= 60 ? `Hưởng thọ ${d.age} tuổi` : `Hưởng dương ${d.age} tuổi`;

  const html = `
  <div class="dcert">
    <div class="band"><span>HỒ SƠ TỬ VONG · RECORD OF DEPARTURE</span><span>No. ${esc(S.born)}-${S.by}-${String(S.age).padStart(3, '0')}</span></div>
    <div class="body">
      <div>
        <div class="lbl">${esc(ctyBirthName)} · ${sexLabel}</div>
        <h1>${esc(S.name.full)}</h1>
        <div class="span">${S.by} – ${S.by + d.age} · ${ageSpanLabel} · ${esc(S.urban ? (S.city || '') : ruralLbl())} ${esc(ctyDeathName)}</div>
        <p class="story">${esc(storyOf(summaryOf(S)))}</p>
        <div class="cause">Nguyên nhân: <b>${esc(d.label)}</b></div>
        <p class="ctx">${d.share != null ? (d.share < 0.005 ? `Tại ${esc(ctyDeathName)}, trong các ca qua đời ở độ tuổi ${d.age}, tỷ lệ nguyên nhân tương tự chưa đầy 1% (ước tính WHO·GBD). ` : `Tại ${esc(ctyDeathName)}, khoảng ${Math.max(1, Math.round(d.share * 100))}% số ca qua đời ở độ tuổi ${d.age} cùng nhóm nguyên nhân này (ước tính WHO·GBD). `) : ''}Trong số những ${sx} sinh cùng năm tại ${esc(ctyBirthName)}, khoảng ${pctStr(longer)} sống thọ hơn bạn. Kỳ vọng sống của ${sexLabel.toLowerCase()} tại ${esc(ctyBirthName)} là ${e0.toFixed(1)} tuổi (bạn sống ${diff >= 0 ? 'nhiều hơn' : 'ít hơn'} ${Math.abs(diff).toFixed(1)} năm).</p>
        <p class="ctx" id="tgDead" hidden></p>
      </div>
      <div class="summary">
        <div><small>Học vấn cao nhất</small><b>${eduLbl()}${S.major && S.edu >= 4 ? ` · ${MAJORS[S.major].n}` : ''}</b></div>
        <div><small>Nghề nghiệp sau cùng</small><b>${esc(lastWorkLabel())}</b></div>
        ${sumCell('Bạn đời / Người gắn bó', ...partnerCell(d.age))}
        <div><small>Con cái / Hậu duệ</small><b>${kidsCount() ? `${kidsCount()} người` : 'Không có'}</b>${S.stats.kidsLost ? `<small>Mất ${S.stats.kidsLost} người con trước</small>` : (S.flags.grand ? `<small>${esc(S.flags.grand === 1 ? '1 người cháu' : `${S.flags.grand} người cháu`)}</small>` : '')}</div>
        ${sumCell('Người tiễn biệt sau cùng', ...seeOffCell(d.age))}
        ${sumCell('Giai đoạn viên mãn nhất', ...happiestCell())}
        <div><small>Quốc gia từng sống</small><b>${esc(migList.join(' → '))}</b></div>
        <div><small>Sở thích</small><b>${S.hobbies.length ? esc(S.hobbies.map(h => hobbyName(h.id)).join(', ')) : '—'}</b></div>
        ${leftCellHTML() + timeSpentHTML()}
      </div>
    </div>
  </div>
  <div class="deadstack">
  <div class="panel farewell"><h3><span>Lời nhắn gửi tới ${esc(callName(S.name))}</span><span class="lbl">Khắc ghi vào bia ký tiền kiếp</span></h3>
    <div class="fwrow"><textarea id="farewell" maxlength="60" rows="2" placeholder="Ví dụ: Bạn đã sống trọn vẹn một kiếp người. Hãy yên nghỉ nhé.">${esc(S.farewell || '')}</textarea><button class="cta" id="farewellBtn">Khắc ghi</button></div>
    ${homeCompareHTML()}</div>
  ${fiveLivesHTML()}
  ${journalHTML()}
  </div>
  <div class="panel sharebox"><h3><span>Chia sẻ kiếp sống này</span><span class="lbl">Thẻ chứng nhận + Tóm tắt</span></h3>
    <div class="sharegrid"><button class="cardprev" id="cardPrevBtn" aria-label="Xem thẻ cuộc đời phóng to"><img id="cardImg" alt="Thẻ ghi nhận cuộc đời của ${esc(S.name.full)}" hidden><span id="cardWait">Đang kết xuất thẻ…</span></button>
      <div><p class="sharetext" id="shareText">${esc(shareText())}</p>
        <div class="endbtns"><button class="cta" id="cardShareBtn">Chia sẻ hình ảnh</button><button class="ghost" id="cardSaveBtn">Lưu ảnh thẻ</button></div>
        <small class="sharehint">Dữ liệu kiếp sống này đã được lưu vào Ký ức Tiền kiếp trên trình duyệt.</small></div></div></div>
  <div class="a2-tip a2-top a2-end" id="a2Dead" hidden></div>
  <div class="after">
    <div class="panel"><h3><span>Bản đồ cuộc đời (100 ô)</span><span class="lbl">${d.age + 1} năm đã qua</span></h3><div class="grid10">${gridHTML(true)}</div><div class="gridkey"><span>Màu càng đậm biểu thị năm càng hạnh phúc</span><span>Ô có viền = Kỳ vọng sống TB</span></div>
      <div class="chart" style="margin-top:10px;max-width:440px">${chartSVG(d.age)}</div></div>
    <div class="panel"><h3><span>Khoảnh khắc khắc cốt ghi tâm</span></h3><ul class="moments">${momentsOf(16).map(e => `<li><span class="a">${e.a} tuổi</span><span>${esc(e.text)}</span></li>`).join('')}</ul></div>
    ${deadFamHTML()}
    ${moneyEndHTML(peak)}
    ${estateHTML()}
    ${flowHTML()}
  </div>
  <div class="endbtns"><button class="cta" id="againBtn">► TIẾP TỤC LUÂN HỒI (BẮT ĐẦU KIẾP MỚI)</button><button class="ghost" id="homeBtn">Về trang chủ</button></div>`;
  $('#dead').innerHTML = html;
  { const sh = suicDeadHTML(), cz = $('#dead .dcert .cause'); if (sh && cz) { cz.classList.add('quiet'); cz.insertAdjacentHTML('afterend', sh); } }
  { const lm = lifeMapHTML(), dc = $('#dead .dcert'); if (lm && dc) { dc.insertAdjacentHTML('beforeend', lm); requestAnimationFrame(() => { try { drawLifeMap(); } catch (e) { reportCaught(e); } }); } }
  { const tx = $('#shareText'); if (tx) tx.insertAdjacentHTML('beforebegin', shareNoteHTML('shNote2')); }
  $('#dead').insertAdjacentHTML('afterbegin', `<div class="dtop"><span style="font-family:var(--f-mono);font-size:11px;font-weight:700;letter-spacing:0.06em;">04 · BÁO CÁO KẾT THÚC KIẾP NGƯỜI · ARCHIVES</span><button class="ghost" id="homeBtnTop" style="padding:4px 10px;font-size:11.5px;">← Trang chủ</button></div>`);
  deadOrder();
  bindFlow($('#dead')); bindFullLog($('#dead'));
  const wk = worksHTML(), ds = $('#dead .deadstack'); if (wk && ds) ds.insertAdjacentHTML('beforeend', wk);
  { const lk = eggsHTML() + lookHTML() + tdHTML(); if (lk && ds) ds.insertAdjacentHTML('afterbegin', lk); tdTally(); }
  { const ed = eduEarlyHTML(); if (ed && ds) ds.insertAdjacentHTML('afterbegin', ed); }
  if (EDU_ON) { const h = $('#dead .sharebox h3'); if (h) h.innerHTML = `<span>Thẻ cuộc đời</span>`; }
  { const kl = kidsLifeHTML(), ml = $('#dead .morelife .ml-in'); if (kl && ml) { ml.insertAdjacentHTML('afterbegin', kl); deadMoreSum(); } }
  document.querySelectorAll('#dead a[data-wk]').forEach(x => x.addEventListener('click', () => track('work', { kind: x.dataset.wk })));
  if (!S.replay && $('#dead .works')) track('work', { kind: 'shown' });
  if (S.endD) { const dc = $('#dead .dcert');
    if (dc) { dc.insertAdjacentHTML('afterend', `<p class="replayend"><button type="button" class="ghost" id="endReplay">Xem lại khoảnh khắc sau cùng</button></p>`); $('#endReplay').addEventListener('click', () => playEnding(withFaith(S.endD, S)).catch(e => { reportCaught(e); closeEnding(); })); } }
  prepCard('death').then(cc => { const im = $('#cardImg'); if (cc && im) { im.src = cardImgSrc(cc); im.hidden = false; const w = $('#cardWait'); if (w) w.hidden = true; } });
  if (S.replay) { show('dead'); a2Render(); return; }
  recordLife();
  lsDel(SAVE_KEY);
  show('dead'); a2Render();
}
function suicDeadHTML() {
  if (!S || !S.deathAt || S.deathAt.cause !== 'suic') return '';
  const young = S.deathAt.age < 19;
  return `<div class="suichelp" role="note"><p>${["Tự tử không thể giải thích bằng một lý do duy nhất.", "Sức khỏe thể chất và tinh thần, những khó khăn gặp phải trong đời, cùng các điều kiện xã hội như nghèo đói, cô đơn hay phân biệt đối xử luôn đan xen với nhau (WHO 2023).", "Tự tử có thể phòng ngừa được, và nhiều người đi qua khủng hoảng đã được giúp đỡ và tiếp tục sống."].join(' ')}</p><p>${young ? L`지금 마음이 힘들다면 혼자 견디지 않아도 돼요. 청소년상담 1388 (휴대전화는 지역번호+1388, 문자는 #1388)이나 자살예방상담전화 109 (24시간), SNS 상담 마들랜이 이야기를 들어 줄 거예요. 다른 나라에서는 findahelpline.com에서 찾을 수 있어요.` : L`지금 마음이 힘드시다면 자살예방상담전화 109나 정신건강위기상담 1577-0199 (모두 24시간), SNS 상담 마들랜이 이야기를 들어 줄 거예요. 다른 나라에서는 findahelpline.com에서 찾을 수 있어요.`}</p></div>`;
}
function deadFoot() {
  const f = $('#deadFoot'); if (!f) return;
  if (UI.deadObs) UI.deadObs.disconnect();
  const marks = [...document.querySelectorAll('#dead .sharebox .endbtns, #dead > .endbtns')];
  if (!marks.length || !('IntersectionObserver' in window)) { f.classList.remove('off'); return; }
  const seen = new Set();
  UI.deadObs = new IntersectionObserver(es => { for (const e of es) e.isIntersecting ? seen.add(e.target) : seen.delete(e.target); f.classList.toggle('off', seen.size > 0); toTopCheck(); });
  marks.forEach(m => UI.deadObs.observe(m));
  f.classList.remove('off');
}
function dfShare() { shareSheet(false); }
const END = { tok: 0, next: null };
function endWait(ms, tok) { END.at = Date.now(); return new Promise(res => { const t = setTimeout(res, ms); END.next = () => { clearTimeout(t); res(); }; }).then(() => tok === END.tok); }
const endClean = t => String(t).replace(/\s*\((?:[−+-][^()]*|[+−]?\d[^()]*)\)\s*$/, '').trim();
function endNoWhy(t) {
  t = String(t).trim(); if (!/[)）]$/.test(t)) return t;
  for (let i = t.length - 1, d = 0; i >= 0; i--) { const ch = t[i]; if (ch === ')' || ch === '）') d++; else if ((ch === '(' || ch === '（') && !--d) return t.slice(0, i).trim() || t; }
  return t;
}
const ACT_W = { baby: 10, wed: 10, award: 10, fly: 9, flee: 9, trip: 9, home: 8, back: 8, grand: 7, shop: 8, grad: 7, pass: 7, citizen: 7, mil: 7, date: 7, work: 7, loss: 6, school: 6, pet: 6,
  cake: 6, bed: 6, play: 6, stars: 6, rain: 6, hosp: 5, friends: 5, fest: 5, anniv: 5, hobby: 5, car: 4, meal: 4, walk: 4, help: 4, garden: 4, study: 4, phone: 3, photos: 3, talk: 3, mem: 3 };
const END_SKIP_D = new Set(['nbrkid', 'discipline', 'kidcare', 'kidhome', 'ipv', 'affair', 'crime', 'gamble', 'smoke', 'cmarry', 'lotto', 'suic', 'histkhm', 'histrg', 'drug', 'sv', 'trans', 'ad', 'today']);
function endScore(e) {
  if (!e.act) return { big: 3, loss: 4, warm: 2, note: 2 }[e.kind] || 1;
  const [k, x, y] = e.act.split(':');
  let w = (ACT_W[k] || 3) + (e.kind === 'big' ? 0.1 : 0);
  if (k === 'loss') w += x === 'par' || x === 'pt' || x === 'kid' ? 2 : x === 'gp' ? -2 : 0;
  if (k === 'work' && (y === 'rank' || y === 'ret')) w += 2;
  if (k === 'grad' && +x >= 4) w += 1;
  return w;
}
function endFrames(age) {
  const pool = S.log.filter(e => ['big', 'loss', 'warm', 'note'].includes(e.kind) && e.a > 0 && e.a <= age && !END_SKIP_D.has(e.d) && !e.set && !e.nf);
  const n = age < 5 ? 2 : Math.min(8, 3 + Math.floor(age / 10)), pick = [];
  const J = new Set((S.journal || []).map(j => j.a + '|“' + j.t + '”')), mine = e => e.kind === 'note' && J.has(e.a + '|' + e.text);
  const take = e => { if (e && !pick.some(x => x.a === e.a)) pick.push(e); };
  S.log.filter(e => e.star && e.a > 0 && e.a <= age && !e.nf && !END_SKIP_D.has(e.d)).slice(-(n + 2)).forEach(take);
  pool.filter(mine).slice(-2).forEach(take);
  const kOf = e => (e.act || e.kind).split(':')[0], used = {};
  for (const e of pick) used[kOf(e)] = (used[kOf(e)] || 0) + 1;
  const occ = new Map(), seen = {}; for (const e of pool) { const k2 = (e.act || e.kind).split(':').slice(0, 2).join(':'), sn = seen[k2] || (seen[k2] = new Set()); occ.set(e, [...sn].filter(a => a < e.a).length); sn.add(e.a); }
  const once = { wed: 0.3, born: 0, fly: 0.2, award: 0.2 };
  const best = (a0, a1) => {
    let b = null, bs = -1e9;
    for (const e of pool) {
      if (e.a < a0 || e.a > a1 || pick.some(x => x.a === e.a)) continue;
      const sc = endScore(e) - 3 * (used[kOf(e)] || 0) - Math.min(3, occ.get(e) || 0) + (once[kOf(e)] || 0) - Math.abs(e.a - (a0 + a1) / 2) * 0.02;
      if (sc > bs) { bs = sc; b = e; }
    }
    return b;
  };
  for (let i = 0; i < n && pick.length < n + 2; i++) {
    const e = best(1 + Math.floor(i * age / n), Math.max(1, Math.floor((i + 1) * age / n)));
    if (e) { pick.push(e); used[kOf(e)] = (used[kOf(e)] || 0) + 1; }
  }
  while (pick.length < Math.min(n, pool.length)) { const e = best(1, age); if (!e) break; pick.push(e); used[kOf(e)] = (used[kOf(e)] || 0) + 1; }
  return pick.slice(0, n + 2).sort((x, y) => x.a - y.a).map(e => ({ a: e.a, t: endClean(e.text), note: mine(e), act: e.act || '' }));
}
function endMourners(age) {
  const f = S.fam, out = [];
  if (age < 18) { if (f.mom.alive) out.push({ age: f.mom.age, sex: 'F', sk: skinPar('F') }); if (f.dad.alive && !f.dad.absent) out.push({ age: f.dad.age, sex: 'M', sk: skinPar('M') }); }
  if (f.married && f.partner && f.partner.alive) out.push({ age: f.partner.age, sex: f.partner.sex, sk: skinOfP(f.partner) });
  for (const k of f.kids.filter(k => k.alive).slice(0, 4)) out.push({ age: age - k.bornAt, sex: k.sex, sk: skinOfKid(k) });
  for (const g of (f.grand || []).slice(-4)) out.push({ age: age - g.bornAt, sex: g.sex, sk: skinOfG(g) });
  if (S.flags.ggrand) out.push({ age: 4, sex: 'F', sk: skinMe() });
  for (let i = 0; i < Math.min(2, endFriends(age)) && out.length < 9; i++) out.push({ age: Math.max(20, age + (i ? 3 : -2)), sex: i % 2 ? (pubSex() === 'F' ? 'M' : 'F') : pubSex(), sk: skinHere(skinSeed() + 'fr' + i) });
  if (!out.length) for (let i = 0; i < 3; i++) out.push({ age: Math.max(25, Math.min(80, age - 6 + i * 5)), sex: i % 2 ? 'M' : 'F', sk: skinHere(skinSeed() + 'nb' + i) });
  return out.slice(0, 10);
}
function attendParts(age) {
  const f = S.fam, parts = [];
  { const m = f.mom.alive, d = f.dad.alive && !f.dad.absent; if (m || d) parts.push(m && d ? "bố mẹ" : m ? "mẹ" : "bố"); }
  if (f.married && f.partner && f.partner.alive) parts.push(L`배우자 ${callName(f.partner.name)}`);
  const k = f.kids.filter(x => x.alive).length, g = S.flags.grand || 0, gg = S.flags.ggrand || 0;
  if (k) parts.push(k === 1 ? "một người con" : L`자녀 ${k}명`);
  if (g) parts.push(g === 1 ? "một người cháu" : L`손주 ${g}명`);
  if (gg) parts.push(gg === 1 ? "một người chắt" : L`증손주 ${gg}명`);
  if (age >= 18 && age < 85 && typeof sibN === 'function' && sibN() > 0) parts.push("các anh chị em");
  const fl = endFriends(age); if (fl) parts.push(fl === 1 ? "một người bạn lâu năm" : "những người bạn lâu năm");
  return parts;
}
function endFriends(age) { if (age < 18) return 0; const f = S.flags; return f.fN != null ? Math.max(0, f.fN - (f.fGone || 0)) : age < 70 ? 3 : 0; }
function endAttend(age) {
  const parts = attendParts(age);
  if (!parts.length) return age < 5 ? '' : age >= 18 ? "Hàng xóm đã tiễn bạn đoạn đường cuối." : "Hàng xóm và bạn bè đã tiễn bạn đoạn đường cuối.";
  return L`${iga(listAnd(parts))} 마지막 길을 배웅했습니다.`;
}
function endSaid(age) { const o = endSaidBits(age); return o ? capS(L`${iga(o.who)} “${o.what}”이라고 말했습니다.`) : ''; }
function endSaidBits(age) {
  if (age < 18) return null;
  const f = S.fam, P = f.married && f.partner && f.partner.alive ? f.partner : null;
  const kids = f.kids.filter(k => k.alive && S.age - k.bornAt >= 12).sort((x, y) => bondScore(y, 'kid') - bondScore(x, 'kid')), kid = kids[0];
  const who = kid ? (kid.sex === 'F' ? L`딸 ${callName(kid.name)}` : L`아들 ${callName(kid.name)}`) : P ? (P.ss ? L`함께 살아온 ${callName(P.name)}` : P.sex === 'F' ? L`아내 ${callName(P.name)}` : L`남편 ${callName(P.name)}`)
    : (typeof sibN === 'function' ? sibN() > 0 : f.older || f.younger) && age < 85 ? "Anh chị em" : "Một người bạn lâu năm";
  const W = S.stats.fY || {}, hb = (S.hobbies || []).filter(h => h.lv >= 3).sort((x, y) => y.lv - x.lv)[0], out = [];
  if (S.flags.cared) out.push("Người đã ở bên bố mẹ đến phút cuối");
  if (S.mig && !famCame() && kid) out.push("Người đã che chở chúng tôi nơi đất khách");
  if ((W.family || 0) >= 12 && kid) out.push("Người luôn đứng về phía chúng tôi");
  if ((W.work || 0) >= 12) out.push("Người cả đời làm việc chăm chỉ");
  if (hb && typeof hobbyName === 'function' && !HOB_TALK_NO.has(hb.id)) out.push(L`${eul(hobbyName(hb.id))} 이야기할 때면 눈이 반짝이던 사람`);
  if (S.trait && (S.trait.k || S.trait) === 'warm') out.push("Người luôn mỉm cười với mọi người trước");
  if (S.st.so >= 75) out.push("Người thật lòng yêu quý mọi người");
  if (!out.length) out.push("Người luôn lặng lẽ ở bên chúng tôi");
  return { who, what: out[hashStr((S.name && S.name.full || '') + S.born + age) % out.length], rel: kid ? 'kid' : P ? 'pt' : '' };
}
const END_SUDDEN = ['road', 'hom', 'war', 'drown', 'fall', 'fire', 'inj', 'od', 'geno', 'disa', 'suic', 'pol'];
function endLast(age) {
  const d = S.deathAt; if (age < 18 || !d || END_SUDDEN.includes(d.cause)) return '';
  const f = S.fam, P = f.married && f.partner && f.partner.alive, k = f.kids.some(x => x.alive && S.age - x.bornAt >= 10);
  const q = S.mig && !famCame() && chance(0.4) ? "“Giá mà được nhìn bầu trời quê nhà thêm một lần nữa.”" : P && k ? "“Cảm ơn mọi người. Hãy sống hòa thuận với nhau nhé.”" : k ? "“Nhờ có các con, đây đã là một cuộc đời tốt đẹp.”"
    : P ? "“Xin lỗi vì phải đi trước. Cảm ơn mình nhiều.”" : "“Dù sao, đó cũng là một cuộc đời không tệ.”";
  return d.sleep ? L`잠들기 전 마지막으로 한 말은 ${q}였습니다.` : L`마지막으로 남긴 말은 ${q}였습니다.`;
}
function endLegacy() {
  const k = S.fam.kids.filter(x => x.alive).length, g = S.flags.grand || 0, gg = S.flags.ggrand || 0, parts = [];
  if (k) parts.push(k === 1 ? "một người con" : L`자녀 ${k}명`);
  if (g) parts.push(g === 1 ? "một người cháu" : L`손주 ${g}명`);
  if (gg) parts.push(gg === 1 ? "một người chắt" : L`증손주 ${gg}명`);
  return parts.length ? L`${eul(listAnd(parts))} 남겼습니다.` : '';
}
const WHITE_MOURN_B = ['LKA', 'KHM', 'LAO', 'MMR', 'NPL', 'BTN', 'VNM'];
function funeralFaith(rel, w) {
  if (w === 'PRK') rel = '';
  const sa = (CBY[w] || {}).p === 'sa';
  return { rel: rel || '', wm: rel === 'H' || rel === 'S' || (rel === 'M' && sa) || (rel === 'B' && WHITE_MOURN_B.includes(w)) };
}
const withFaith = (D, life) => !D || !D.fm || D.fm.rel != null || !life ? D : Object.assign({}, D, { fm: Object.assign({}, D.fm, funeralFaith(life.rel, D.where)) });
function endLastLoss(age) {
  const e = S.log.filter(x => x.a === age && x.kind === 'loss' && x.ev !== 'friendgone' && x.d !== 'suic' && !/^같은 1초/.test(x.text)).pop();
  return e ? endClean(e.text) : '';
}
function endingData() {
  const d = S.deathAt; if (!d) return null;
  const age = d.age, w = d.where || S.cur, born = B().ko, country = (CBY[w] || C()).ko;
  const frames = [{ a: 0, t: L`${S.by}년, ${B().ko}에서 태어났습니다.`, act: 'born' }].concat(endFrames(age)).map(f => { const x = Object.assign(f, { m: sceneFor(f.a, f.act) }); delete x.act; return x; });
  const yrs = {}; S.years.forEach(y => { yrs[y.a] = y.h; });
  const lived = new Set(S.years.map(y => y.cur)).size, days = Math.round((age + 0.5) * 365.25).toLocaleString(LC.loc);
  const j = (S.journal || []).slice(-1)[0], rd = age >= 18 ? lifeRoad() : null;
  return { v: 1, lang: LANG, name: S.name.full, sex: pubSex(), by: S.by, age, iso: S.born, where: w, urban: !!S.urban, cause: d.cause === 'suic' ? '' : d.label,
    road: rd ? rd.t : '', roadS: rd ? rd.s : '', li: age >= 18 ? lifeItemsS() : [],
    head: L`마지막 해, ${age}세`, died: d.sleep ? L`${country}에서 잠든 채 조용히 숨을 거두었습니다.` : L`${country}에서 숨을 거두었습니다.`, lastLoss: endLastLoss(age), frames, strip: Array.from({ length: age + 1 }, (_, a) => yrs[a] == null ? 50 : yrs[a]),
    fm: { stage: 'e', mood: 'mid', urban: !!S.urban, region: (CBY[w] || C()).p, seed: (S.name && S.name.full || '') + S.born,
      fl: ['KOR', 'JPN', 'CHN', 'TWN', 'HKG', 'PRK', 'VNM', 'SGP', 'MNG'].includes(w) ? 'eas' : (CBY[w] || C()).p === 'sa' ? 'sa' : '', old: age >= 65, sk: skinMe(), ...funeralFaith(funRel(), w) },
    mourners: endMourners(age), funeral: selfFuneralLine(age), attend: endAttend(age), said: endSaid(age), last: endLast(age),
    epi: [born === country ? L`${born}에서 태어나 그곳에서 잠들었습니다.` : L`${born}에서 태어나 ${country}에서 잠들었습니다.`,
      age >= 1 ? L`${age}년, 날로 치면 약 ${days}일을 살았습니다.` : "Những ngày bạn có mặt trên thế gian chưa tròn một năm.",
      endLegacy(), lived > 1 ? L`${lived}개 나라에서 살았습니다.` : '', age < 5 ? "Tuy ngắn ngủi, nhưng đó là một cuộc đời đã thật sự có mặt trên thế gian này." : ''].filter(Boolean),
    quote: j ? { t: j.t, a: j.a } : null, farewell: S.farewell || '' };
}
const endStrip = D => D.strip.map((h, a) => `<span data-a="${a}" style="--c:${mixCol(0.15 + h / 100 * 0.85)}"></span>`).join('');
function endMusic(v) { try { if (MUSIC.on && MUSIC.master) MUSIC.master.gain.setTargetAtTime(v * musicVol(), MUSIC.ctx.currentTime, 1.5); } catch (e) { } }
function closeEnding() {
  END.tok++; END.next = null;
  document.documentElement.classList.remove('endin');
  const el = $('#ending'); if (!el) return;
  el.classList.remove('on'); el.classList.add('off'); endMusic(MUSIC_LV);
  setTimeout(() => el.remove(), 600);
  document.removeEventListener('keydown', endKey, true);
  if (END.after) { const f = END.after; END.after = null; f(); return; }
  window.scrollTo(0, 0); const h = $('#dead h1, #dead h2, #dead button'); if (h) h.focus({ preventScroll: true });
}
function endKey(e) { if (e.key === 'Escape') { e.preventDefault(); closeEnding(); } }
async function playEnding(D, opt = {}) {
  if (!D) return;
  const tok = ++END.tok, P = pxPalette('light'), PN = pxPalette();
  END.after = opt.after || null;
  { const old = $('#ending'); if (old) old.remove(); }
  const el = document.createElement('div'); el.id = 'ending'; el.className = 'ending';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', "Những giây phút cuối");
  el.innerHTML = `<button type="button" class="end-skip" id="endSkip">${"Bỏ qua"}</button><div class="end-stage" id="endStage" aria-live="polite"></div><p class="end-hint">${"Chạm vào màn hình để tiếp tục"}</p>`;
  document.body.appendChild(el);
  { const root = document.documentElement; root.classList.add('endin'); setTimeout(() => { if (END.tok === tok) root.classList.remove('endin'); }, 1300); }
  END.doneAt = 0;
  el.addEventListener('click', e => {
    const sk = e.target.closest('#endSkip');
    if (sk) {
      if (sk.dataset.armed) { closeEnding(); return; }
      sk.dataset.armed = 1; sk.textContent = "Chạm thêm lần nữa để đóng";
      setTimeout(() => { if (sk.isConnected) { delete sk.dataset.armed; sk.textContent = "Bỏ qua"; } }, 3000);
      return;
    }
    if (e.target.closest('#endDone')) { if (END.doneAt && Date.now() - END.doneAt > 900) closeEnding(); return; }
    if (END.next && Date.now() - (END.at || 0) > 900) END.next();
  });
  document.addEventListener('keydown', endKey, true);
  el.tabIndex = -1; el.focus({ preventScroll: true });
  requestAnimationFrame(() => el.classList.add('on'));
  endMusic(MUSIC_LV * 0.45);
  const st = $('#endStage'), show = html => { st.innerHTML = html; }, fadeIn = x => { if (x) requestAnimationFrame(() => requestAnimationFrame(() => x.classList.add('in'))); };
  show(`<p class="end-big fade" id="endL1">${esc(D.head)}</p>${D.lastLoss ? '<p class="end-sub fade" id="endL0"></p>' : ''}<p class="end-sub fade${D.cause ? ' end-d2' : ''}" id="endL2"></p>${D.last ? '<p class="end-sub fade" id="endLw"></p>' : ''}<p class="end-sub fade" id="endL3"></p>`);
  fadeIn($('#endL1'));
  if (!(await endWait(1800, tok))) return;
  if (D.lastLoss) { $('#endL0').textContent = capS(endNoWhy(D.lastLoss)); fadeIn($('#endL0')); if (!(await endWait(2600, tok))) return; }
  $('#endL2').innerHTML = esc(capS(D.died)) + (D.cause ? `<small class="end-cause">${esc("Nguyên nhân qua đời")} · ${esc(D.cause)}</small>` : ''); fadeIn($('#endL2'));
  if (!(await endWait(2200, tok))) return;
  if (D.last) { $('#endLw').textContent = capS(D.last); fadeIn($('#endLw')); if (!(await endWait(2600, tok))) return; }
  $('#endL3').textContent = capS("Khi đôi mắt khép lại, những ngày đã qua lần lượt lướt qua."); fadeIn($('#endL3'));
  if (!(await endWait(2600, tok))) return;
  show(`<div class="end-pic"><canvas class="pa" width="${PX.W}" height="${PX.H}"></canvas><canvas class="pb" width="${PX.W}" height="${PX.H}"></canvas></div><p class="end-age fade in" id="endAge"></p><p class="end-text fade in" id="endText"></p><div class="end-strip" aria-hidden="true">${endStrip(D)}</div>`);
  const cvs = [st.querySelector('.pa'), st.querySelector('.pb')]; let cur = 0;
  if (!D.frames.some(f => f.m)) st.querySelector('.end-pic').hidden = true;
  for (const fr of D.frames) {
    const cv = cvs[cur ^ 1];
    if (fr.m) pxDraw(pxScene(fr.m, P), cv); else cv.getContext('2d').clearRect(0, 0, PX.W, PX.H);
    cvs[cur].classList.remove('show'); cv.classList.add('show'); cur ^= 1;
    const ag = $('#endAge'), tx = $('#endText'); ag.classList.add('quick'); tx.classList.add('quick'); ag.classList.remove('in'); tx.classList.remove('in');
    if (!(await endWait(420, tok))) return;
    ag.textContent = L`${fr.a}세${LBL}`; tx.textContent = capS(fr.t); tx.classList.toggle('note', !!fr.note);
    ag.classList.remove('quick'); tx.classList.remove('quick'); fadeIn(ag); fadeIn(tx);
    st.querySelectorAll('.end-strip span').forEach(x => { if (+x.dataset.a <= fr.a) x.classList.add('lit'); });
    if (!(await endWait(2100 + Math.min(1500, fr.t.length * 20), tok))) return;
  }
  st.querySelectorAll('.end-strip span').forEach(x => x.classList.add('lit'));
  if (!(await endWait(900, tok))) return;
  show(`<div class="end-pic"><canvas class="pa show" width="${PX.W}" height="${PX.H}"></canvas></div><p class="end-text fade" id="endF1"></p><p class="end-sub fade" id="endF2"></p>${D.said ? '<p class="end-sub fade" id="endF3"></p>' : ''}`);
  pxDraw(pxFuneral(D.fm, PN, D.mourners), st.querySelector('.pa'));
  $('#endF1').textContent = capS(D.funeral); fadeIn($('#endF1'));
  if (!(await endWait(3200, tok))) return;
  $('#endF2').textContent = capS(D.attend); fadeIn($('#endF2'));
  if (!(await endWait(3800, tok))) return;
  if (D.said) { $('#endF3').textContent = capS(D.said); fadeIn($('#endF3')); if (!(await endWait(3400, tok))) return; }
  show(`<div class="end-epi"><p class="end-name fade">${esc(D.name)}</p><p class="end-years fade">${D.by} – ${D.by + D.age}</p>${D.epi.map(t => `<p class="end-line fade">${esc(capS(t))}</p>`).join('')}`
    + (D.quote ? `<blockquote class="end-quote fade">“${esc(D.quote.t)}”<small>${L`${D.quote.a}세의 당신이 남긴 생각`}</small></blockquote>` : '')
    + `<p class="end-close fade">${"Giữa 8 tỷ người, một cuộc đời chỉ có một lần."}</p><button type="button" class="cta end-done fade" id="endDone">${esc(opt.done || "Xem ghi chép")}</button></div>`);
  const fs = [...st.querySelectorAll('.fade')];
  for (const x of fs) { fadeIn(x); if (!(await endWait(x.classList.contains('end-line') ? 1100 : 700, tok))) { fs.forEach(y => y.classList.add('in')); break; } }
  const db = $('#endDone'); if (db) db.focus({ preventScroll: true });
  END.doneAt = Date.now();
  const hint = el.querySelector('.end-hint'); if (hint) hint.hidden = true;
}
function guilloche(w, h) {
  let p = '';
  for (let i = 0; i < 14; i++) {
    let d = ''; const ph = i * 0.45, amp = h * (0.16 + 0.012 * i), lam = w / (2.2 + i * 0.07);
    for (let x = 0; x <= w; x += 6) { const y = h / 2 + amp * Math.sin(2 * Math.PI * x / lam + ph) * Math.cos(Math.PI * x / w * 1.3 + i * 0.2); d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1); }
    p += `<path d="${d}" fill="none" stroke="currentColor" stroke-width=".7"/>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" width="100%" height="100%">${p}</svg>`;
}
function savePast(at) {
  try {
    const snap = Object.assign({}, S, { queue: [], pending: null, recent: [] });
    pdbPut([{ at, S: snap }]); pastPush({ at, S: snap });
  } catch (e) { }
}
function pastPush(rec) {
  let past = lsGet(PAST_KEY, []).filter(p => p.at !== rec.at); past.push(rec); past = past.slice(-PAST_MAX);
  while (past.length) { try { localStorage.setItem(lk(PAST_KEY), JSON.stringify(past)); break; } catch (e) { past.shift(); } }
}
function resumeDead() {
  const o = lsGet(OPEN_KEY, null); lsDel(OPEN_KEY);
  if (!o || !o.at || !(Date.now() - (o.t || 0) < OPEN_KEEP_MS) || !lsGet(PAST_KEY, []).some(x => x.at === o.at)) return;
  openPast(o.at); if (UI.view === 'dead') toast("Đã quay lại ghi chép của cuộc đời bạn đang xem. Các cuộc đời trước cũng có thể được mở lại trong mục Các kiếp trước ở màn hình đầu.", 6000);
}
function openPast(at, rec) {
  const p = rec || lsGet(PAST_KEY, []).find(x => x.at === at);
  if (!p && PDB.ats.has(at) && pdbOn()) {
    const no = () => toast("Hiện chưa mở được ghi chép này. Vui lòng thử lại sau giây lát.", 6000);
    pdbGet(at).then(q => { if (!(q && q.S && q.at === at)) return no(); pastPush(q); openPast(at, lsGet(PAST_KEY, []).find(x => x.at === at) || q); }, no);
    return;
  }
  if (!p || (EDU_ON && !(p.S && p.S.eduOn))) return;
  if (p.S && p.S.era && p.S.era !== 'now' && !eraLoaded()) { eraWait(() => openPast(at, rec), false); return; }
  try { S = p.S; S.replay = true; S.lifeAt = at; S.ff = false; healStats(S); ageSync(); showDeath(); window.scrollTo(0, 0); }
  catch (e) { toast("Ghi chép này được tạo ở phiên bản cũ nên không thể mở lại."); show('intro'); renderIntro(); }
}
function save() {
  if (!S || !(S.phase === 'life' || S.phase === 'birth')) return;
  const v = { S, at: Date.now() };
  if (lsSet(SAVE_KEY, v)) return;
  const past = lsGet(PAST_KEY, []);
  while (past.length) { past.shift(); try { localStorage.setItem(lk(PAST_KEY), JSON.stringify(past)); } catch (e) { } if (lsSet(SAVE_KEY, v)) return; }
  if (!UI.saveWarned) { UI.saveWarned = true;  toast("Trình duyệt này không lưu được ghi chép. Nếu đóng cửa sổ, bạn sẽ không thể tiếp tục cuộc đời này.", 9000); }
}
function restore(st) {
  if (EDU_ON && st && !st.eduOn) { show('intro'); renderIntro(); return; }
  if (st && st.era && st.era !== 'now' && !eraLoaded()) { eraWait(() => restore(st), false); return; }
  try { restore0(st); }
  catch (e) { reportCaught(e);  toast("Không thể mở lại cuộc đời này để tiếp tục. Ghi chép vẫn được giữ nguyên, không bị xóa.", 9000); S = null; show('intro'); renderIntro(); }
}
function restore0(st) {
  S = st; S.ff = false; healStats(S); ageSync();
  if (S.phase === 'birth') { show('roll'); $('#roller').hidden = true; showCert(); return; }
  if (S.phase === 'dead') { showDeath(); return; }
  show('lifeview'); feedReset(); S.log.slice().reverse().forEach(e => addFeed(e, true));
  renderAll();
  if (S.pending && S.pending.view) showDecision(S.pending);
}
function askKeepStore() {
  if (UI.storeAsked) return; UI.storeAsked = true;
  try { const st = navigator.storage; if (!st || !st.persist || /Firefox\//.test(navigator.userAgent || '')) return; st.persisted().then(p => p || st.persist()).catch(() => { }); } catch (e) { }
}
function inAppName() { const ua = navigator.userAgent || ''; return /KAKAOTALK/i.test(ua) ? "KakaoTalk" : /Barcelona/.test(ua) ? "Threads" : /Instagram/.test(ua) ? "Instagram" : IN_APP ? "ứng dụng này" : ''; }
function storeNote() {
  if (lbAvail() && (lbSt() ? lbSt().on : !!(LB.mem && LB.mem.on))) return "Ghi chép được lưu trong trình duyệt này và, nhờ thẻ Lưu giữ, cả trên máy chủ.";
  const ua = navigator.userAgent || '', app = inAppName();
  const ios = DEV === 'iphone' || DEV === 'ipad', macSafari = DEV === 'mac' && /Safari\//.test(ua) && !/Chrome|Chromium|Edg|Firefox|OPR/.test(ua);
  if (STANDALONE) return "Ghi chép được lưu trong ứng dụng ở màn hình chính này." + (ios ? ' ' + "Ghi chép ở đây tách biệt với Safari. Những cuộc đời đã sống trên Safari có thể được chuyển sang bằng ‘Chuyển các cuộc đời’." : '');
  return (app ? L`기록은 이 브라우저에만 남아요. ${app} 안에서 연 화면은 사파리·크롬과 기록이 따로예요.` : "Ghi chép chỉ được lưu trong trình duyệt này. Nếu đổi điện thoại hoặc mở bằng ứng dụng khác, bạn sẽ không thấy chúng.")
    + (ios ? ' ' + "Trên iPhone và iPad, trình duyệt có thể xóa ghi chép nếu bạn không ghé trang này quá 7 ngày." : macSafari ? ' ' + "Safari có thể xóa ghi chép nếu bạn không ghé trang này quá 7 ngày." : '');
}
const A2 = { evt: null, seen: false, watch: null, endAt: null };
addEventListener('beforeinstallprompt', e => { e.preventDefault(); A2.evt = e; a2Render(); });
addEventListener('appinstalled', () => { A2.evt = null; UI.prefs.a2hs = 'done'; lsSet(PREF_KEY, UI.prefs); track('a2hs', { kind: 'installed' }); a2Render(); });
function a2Way() {
  if (STANDALONE) return '';
  if (A2.evt) return 'prompt';
  if (IN_APP) return 'inapp';
  if (DEV === 'iphone' || DEV === 'ipad') return 'ios';
  if (DEV === 'android' || DEV === 'atablet') return 'android';
  return 'desk';
}
const a2Today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
function a2Days() {
  const P = UI.prefs, day = a2Today();
  if (P.vDays == null) { const n = (lsGet(LIVES_KEY, []) || []).length; P.vDays = n >= 5 ? 2 : n >= 2 ? 1 : 0; }
  if (P.vLast !== day) { P.vLast = day; P.vDays = (P.vDays || 0) + 1; lsSet(PREF_KEY, UI.prefs); }
  return P.vDays;
}
function a2Render() {
  if (EDU_ON) { for (const id of ['#a2Btn', '#a2Tip', '#a2Dead']) { const el = $(id); if (el) el.hidden = true; } return; }
  const btn = $('#a2Btn'); if (btn) btn.hidden = STANDALONE;
  const top = $('#a2Tip'), end = $('#a2Dead'), tip = UI.view === 'dead' ? (S && S.deathAt && S.deathAt.cause === 'suic' ? null : end) : UI.view === 'intro' ? top : null;
  for (const el of [top, end]) if (el && el !== tip) { el.hidden = true; el.innerHTML = ''; }
  if (!tip) return;
  const way = a2Way(), n = UI.prefs.a2hsR || 0, day = a2Today(), lives = (lsGet(LIVES_KEY, []) || []).length, days = UI.prefs.vDays || 0;
  const back = days >= 3 || (days >= 2 && lives >= 3);
  const today = UI.prefs.a2hsD === day, fits = tip === end ? (today ? A2.endAt === S.lifeAt : n < 3) : n < 3 || today;
  const show = ['prompt', 'ios', 'android', 'inapp'].includes(way) && !UI.prefs.a2hs && lives >= 1 && back && fits;
  tip.hidden = !show;
  if (!show) { tip.innerHTML = ''; return; }
  a2Seen(tip, way);
  const app = way === 'inapp' ? inAppName() : '';
  tip.innerHTML = (app
    ? L`<p><b>자주 찾아 주셨네요.</b> ${app} 안에서 연 화면은 기록이 그 앱에만 남아요. 사파리나 크롬에서 홈 화면에 두면 앱처럼 바로 열리고 기록도 오래 남아요.</p><div class="a2-act"><button class="ghost sm a2-go" id="a2Go">방법 보기</button><button class="ghost sm" id="a2No">괜찮아요</button></div>`
    : "<p><b>Cảm ơn bạn đã thường xuyên ghé thăm.</b> Khi thêm vào màn hình chính, trang sẽ mở ngay bằng một biểu tượng như ứng dụng, và bạn cũng bớt lo ghi chép bị xóa.</p><div class=\"a2-act\"><button class=\"ghost sm a2-go\" id=\"a2Go\">Thêm vào màn hình chính</button><button class=\"ghost sm\" id=\"a2No\">Không, cảm ơn</button></div>");
}
function a2Seen(tip, way) {
  if (A2.seen || A2.watch === tip) return;
  const mark = () => {
    if (A2.seen || tip.hidden || !tip.isConnected) return;
    A2.seen = true; const day = a2Today(); if (tip.id === 'a2Dead') A2.endAt = S && S.lifeAt;
    if (UI.prefs.a2hsD !== day) { UI.prefs.a2hsD = day; UI.prefs.a2hsR = (UI.prefs.a2hsR || 0) + 1; lsSet(PREF_KEY, UI.prefs); }
    track('a2hs', { kind: (way === 'inapp' ? 'rshown-app' : 'rshown') + (tip.id === 'a2Dead' ? '-end' : '') });
  };
  if (!('IntersectionObserver' in window)) { mark(); return; }
  A2.watch = tip;
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); A2.watch = null; mark(); } }, { threshold: 0.6 });
  io.observe(tip);
}
function a2No() { UI.prefs.a2hs = 'no'; lsSet(PREF_KEY, UI.prefs); track('a2hs', { kind: 'no' }); a2Render(); }
async function a2Prompt() {
  const e = A2.evt; if (!e) { a2Sheet(); return; }
  closeSheet(); A2.evt = null;
  try { e.prompt(); const r = await e.userChoice; track('a2hs', { kind: r && r.outcome === 'accepted' ? 'accept' : 'dismiss' }); } catch (x) { }
  a2Render();
}
function a2Sheet() {
  const way = a2Way(), steps = a => `<ol class="a2-steps">${a.map(s => `<li>${s}</li>`).join('')}</ol>`;
  track('a2hs', { kind: 'open' });
  const lead = "<p>Không cần tải ứng dụng: khi được thêm vào màn hình chính, trang mở ngay khi bạn chạm vào biểu tượng, dùng trọn màn hình không có thanh địa chỉ, và bạn cũng bớt lo ghi chép bị xóa.</p>";
  let body;
  if (!way) body = "<p>Bạn đang mở trang từ màn hình chính rồi.</p>";
  else if (way === 'prompt') body = "<p>Khi bạn nhấn nút, trình duyệt sẽ hỏi bạn có muốn thêm hay không.</p><div class=\"sheetact\"><button class=\"cta\" id=\"a2Prompt\">Thêm vào màn hình chính</button></div>";
  else if (way === 'ios') body = steps(["Nhấn nút Chia sẻ ở cuối màn hình (trên iPad thì ở phía trên).", "Kéo danh sách xuống một chút và chọn ‘Thêm vào MH chính’.", "Nhấn ‘Thêm’ ở góc trên bên phải."])
    + "<p class=\"a2-note\">App màn hình chính trên iPhone lưu Safari và bản ghi riêng biệt.</p>";
  else if (way === 'android') body = steps(["Nhấn vào menu ⋮ ở góc trên bên phải.", "Chọn ‘Thêm vào màn hình chính’ hoặc ‘Cài đặt ứng dụng’.", "Nhấn ‘Thêm’ hoặc ‘Cài đặt’."])
    + "<p class=\"a2-note\">Với Samsung Internet, mở menu ≡ ở phía dưới, chọn ‘Thêm trang vào’ rồi chọn ‘Màn hình chính’.</p>";
  else if (way === 'inapp') body = L`<p>${inAppName()} 안에서는 홈 화면에 추가할 수 없어요. 먼저 사파리나 크롬으로 열어 주세요.</p>`
    + steps(["Trong menu ⋯ ở góc trên hoặc dưới bên phải, chọn ‘Mở trong trình duyệt’ hoặc ‘Mở bằng Safari’.", "Trong trình duyệt vừa mở, nhấn lại ‘Thêm vào màn hình chính’ ở cuối trang để xem cách làm."])
    + "<p class=\"a2-note\">Trình duyệt này hiện chưa có bản ghi nào.</p>";
  else body = "<p>Với Chrome và Edge, dùng biểu tượng cài đặt ở bên phải thanh địa chỉ hoặc ‘Cài đặt ứng dụng’ trong menu. Với Safari trên Mac, chọn ‘Thêm vào Dock’ trong menu ‘Tệp’.</p>";
  openSheet("Thêm vào màn hình chính", lead + body);
}
function a2Init() {
  if (!STANDALONE) a2Days();
  a2Render();
  if (STANDALONE && (DEV === 'iphone' || DEV === 'ipad') && !UI.prefs.a2Hello && !(lsGet(LIVES_KEY, []) || []).length) {
    UI.prefs.a2Hello = 1; lsSet(PREF_KEY, UI.prefs);
    setTimeout(() => toast("Ứng dụng ở màn hình chính lưu ghi chép tách biệt với Safari. Những cuộc đời đã sống trên Safari có thể được chuyển sang bằng ‘Chuyển các cuộc đời’.", 8000), 1500);
  }
}
const lsGetL = (k, lang, d) => { try { const v = localStorage.getItem(lk(k, lang)); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const lsSetL = (k, lang, v) => { try { localStorage.setItem(lk(k, lang), JSON.stringify(v)); return true; } catch (e) { return false; } };
function moveLivePick(k) {
  const m = UI.moveLive; UI.moveLive = null; if (!m) { closeSheet(); return; }
  if (k === 'in') lsSetL(SAVE_KEY, m.lang, m.lv);
  closeSheet(); renderIntro();
  toast(k === 'in' ? "Cuộc đời được chuyển đến sẽ tiếp tục. Hãy nhấn 'Tiếp tục'." : "Cuộc đời trong trình duyệt này sẽ tiếp tục như cũ.");
}
const LB_AT = 8e15, LB_KEY = 'one8b.lb.v1', LB_BYTES = 1400000, LB_GAP_MS = 180e3, LB_LIVE_MS = 10 * 60e3;
const LB = { st: null, stH: '', at: 0, busy: false, saving: false, arm: 0, msg: '', mem: null, later: 0, listing: null };
const LB_TEST = typeof location !== 'undefined' && /[?&]lbtest(=|&|$)/.test(location.search);
const lbOpen = () => !EDU_ON && (Date.now() >= LB_AT || LB_TEST);
const lbAvail = () => lbOpen() && typeof keepTok === 'function' && !!keepTok();
function lbMe() {
  const h = (keepTok() || '').slice(0, 32);
  let s = LB.mem && LB.mem.h === h ? LB.mem : null;
  if (!s) { try { s = JSON.parse(localStorage.getItem(LB_KEY) || 'null'); } catch (e) { } }
  if (!s || typeof s !== 'object') s = {};
  const dv = /^[0-9a-f]{16}$/.test(s.dv || '') ? s.dv : [...crypto.getRandomValues(new Uint8Array(8))].map(b => b.toString(16).padStart(2, '0')).join('');
  if (s.h !== h || s.dv !== dv) { s = { dv, h }; try { localStorage.setItem(LB_KEY, JSON.stringify(s)); } catch (e) { } }
  return (LB.mem = s);
}
const lbSt = () => LB.st && LB.stH === lbMe().h ? LB.st : null;
const lbOthers = () => { const st = lbSt(), got = lbMe().got || {}; return st ? st.list.filter(x => !x.me && x.c > 0 && got[x.k] !== x.at) : []; };
const lbOffer = () => lbAvail() && lbOthers().length > 0;
const lbJ = (...a) => a.join(' ');
const lbWhen = t => new Date(t).toLocaleString(LC.loc, { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
function lbHTML() {
  if (!lbAvail()) return '';
  const st = lbSt(), on = st ? st.on : !!lbMe().on, mine = st && st.list.find(x => x.me), top = lbOthers().sort((a, b) => b.c - a.c)[0];
  return `<button type="button" class="lb-sw" data-lbsw role="switch" aria-checked="${on}"${LB.busy ? ' disabled' : ''}><span class="lb-k" aria-hidden="true"></span><span>${"Lưu các kiếp trước cả trên máy chủ"}</span></button>
    <p>${lbJ("Trong thời gian bạn có thẻ, các kiếp trước của trình duyệt này, những cuộc đời có thể xem lại và cuộc đời đang sống cũng được lưu trên máy chủ.", "Dù dữ liệu trình duyệt bị xóa, chỉ cần mở lại thẻ là lấy lại được.", "Khi bạn tắt hoặc khi thẻ được hoàn tiền, ghi chép trên máy chủ sẽ bị xóa ngay.")}</p>
    ${on && mine ? `<p class="lb-st">${L`이 브라우저의 기록을 보관했어요 · ${lbWhen(mine.at)}`}</p>` : ''}
    ${top ? `<p class="lb-st">${L`서버에 보관해 둔 기록이 있어요 · 지난 삶 ${top.c}개 · ${lbWhen(top.at)}`}</p><p>${"Ghi chép trong trình duyệt này vẫn giữ nguyên, chỉ thêm những cuộc đời còn thiếu."}</p><button type="button" class="ghost" data-lbget${LB.busy ? ' disabled' : ''}>${"Lấy lại ghi chép đã lưu trên máy chủ"}</button>` : ''}
    <p class="lb-msg" role="status">${esc(LB.msg)}</p>`;
}
function lbPaint() { const h = lbHTML(); for (const el of document.querySelectorAll('[data-lb]')) { el.innerHTML = h; el.hidden = !h; } }
let last = performance.now();
function frame(now) {
  try { frame0(now); }
  catch (e) { try { loopError(e); } catch (e2) { } }
  finally { requestAnimationFrame(frame); }
}
function loopError(e) {
  reportCaught(e);
  if (!S || S.phase !== 'life') return;
  const key = lifeId() + ':' + S.age;
  UI.errN = UI.errKey === key ? UI.errN + 1 : 1; UI.errKey = key;
  if (UI.yearSnap && UI.snapId === lifeId()) { try { restore0(JSON.parse(UI.yearSnap)); } catch (e2) { reportCaught(e2); } }
  if (UI.errN >= 3 && S) {
    S.paused = true; S.ff = false; try { renderTop(); } catch (e3) { }
    toast(L`문제가 생겨 삶을 잠시 멈췄어요. 새로고침하면 ${S.age}세부터 이어져요. 불편을 드려 죄송해요.`, 12000);
  }
}
const lifeId = () => S ? S.born + S.by + (S.name && S.name.full) : '';
function frame0(now) {
  const dt = Math.min(0.25, (now - last) / 1000); last = now;
  if (UI.view === 'intro') tickCounters();
  if (now - (UI.unlT || 0) > 600) { UI.unlT = now; unlivedPlace(); }
  if (UI.autoDec && S && S.pending && !$('#modal').hidden && $('#sheet').hidden) {
    const A = UI.autoDec; A.t += dt; setBar($('#autoProg'), A.t / A.dur);
    if (A.t >= A.dur) pickChoice(A.k, true);
  }
  if (S && S.phase === 'life' && UI.view === 'lifeview' && $('#sheet').hidden) {
    const age0 = S.age;
    if (UI.snapS !== S || UI.snapAge !== S.age) { UI.snapS = S; UI.snapAge = S.age; UI.snapId = lifeId(); UI.yearSnap = JSON.stringify(S); }
    const kl0 = S.stats.kidsLost || 0, job0 = S.job, dx0 = S.stats.dxBig || 0;
    auSync(); ageSync(); tick(dt * (S.ff ? 24 : 1));
    if (S.ff && (S.stats.kidsLost || 0) > kl0) { S.ff = false; renderTop(); toast("Đây là năm bạn phải tiễn biệt một người con. 'Tới quyết định tiếp theo' đã được tạm dừng.", 5000); }
    else if (S.phase === 'life' && S.job === 'seeking' && job0 !== 'seeking' && JOBS[job0] && !NONWORK.includes(job0)) {
      const ff = !!S.ff; if (ff) { S.ff = false; renderTop(); }
      toast((job0 === 'owner' ? "Đây là năm bạn đóng cửa việc kinh doanh." : "Đây là năm công việc của bạn dừng lại.") + ' ' + "Trong lúc tìm việc mới, thu nhập sẽ giảm." + (ff ? ' ' + "'Tới quyết định tiếp theo' đã được tạm dừng." : ''), 5000);
    }
    else if (S.ff && (S.stats.dxBig || 0) > dx0) { S.ff = false; renderTop(); toast("Đây là năm bạn được chẩn đoán mắc bệnh nặng. 'Tới quyết định tiếp theo' đã được tạm dừng.", 5000); }
    if (S.phase === 'life') {
      if (speedHintDue()) speedHint(true);
      setBar($('#prog'), S.t);
      if (S.age !== age0 || UI.dirty) renderAll();
    }
  }
}
const FAM_WIDE = typeof matchMedia === 'function' ? matchMedia('(min-width: 1181px)') : null;
function famPlace() {
  const p = document.querySelector('.life .p-fam'), c3 = document.querySelector('.life .col3'), c1 = document.querySelector('.life .col'); if (!p || !c3 || !c1) return;
  if (FAM_WIDE && FAM_WIDE.matches) { if (p.parentNode !== c3) c3.insertBefore(p, c3.firstChild); } else if (p.parentNode !== c1) c1.appendChild(p);
}
const FOLD_P = ['p-stats', 'p-fam', 'p-comps', 'p-grid', 'p-chart', 'p-cty'];
function foldInit() {
  for (const k of FOLD_P) {
    const p = document.querySelector('.life .' + k), h = p && p.querySelector('h3'); if (!h || h.querySelector('.foldbtn')) continue;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'foldbtn'; b.dataset.fold = k; h.appendChild(b);
    foldSet(k, !!(UI.prefs.fold && UI.prefs.fold[k]));
  }
}
function foldSet(k, on) {
  const p = document.querySelector('.life .' + k), b = p && p.querySelector('.foldbtn'); if (!p) return;
  p.classList.toggle('folded', on); if (b) { b.setAttribute('aria-expanded', String(!on)); b.setAttribute('aria-label', on ? "Mở rộng" : "Thu gọn"); }
}
function foldToggle(k) { const f = UI.prefs.fold || (UI.prefs.fold = {}); f[k] = !f[k]; lsSet(PREF_KEY, UI.prefs); foldSet(k, f[k]); }
function moreMenu(open) {
  const m = $('#moreMenu'), b = $('#moreBtn'); if (!m || !b) return;
  m.classList.toggle('open', !!open); b.setAttribute('aria-expanded', String(!!open));
}
function bind() {
  document.addEventListener('pointerdown', e => { const m = $('#moreMenu'); if (m && m.classList.contains('open') && !e.target.closest('#moreMenu, #moreBtn')) moreMenu(false); }, true);
  document.addEventListener('keydown', e => { const m = $('#moreMenu'); if (e.key === 'Escape' && m && m.classList.contains('open')) { moreMenu(false); $('#moreBtn').focus(); } });
  document.addEventListener('scroll', () => { if (!UI.ttRaf) UI.ttRaf = requestAnimationFrame(toTopCheck); }, { capture: true, passive: true });
  document.addEventListener('pointerdown', e => { const p = $('#mbPick'); if (p && !p.hidden && !e.target.closest('#mbPick, #mbFo')) miniPick(false); }, true);
  document.addEventListener('keydown', e => { const p = $('#mbPick'); if (e.key === 'Escape' && p && !p.hidden) { miniPick(false); $('#mbFo').focus(); } });
  topbarH(); addEventListener('resize', () => { topbarH(); unlivedPlace(); });
  famPlace(); if (FAM_WIDE && FAM_WIDE.addEventListener) FAM_WIDE.addEventListener('change', famPlace);
  foldInit();
  { const t = $('#lifeview .topbar'); if (t && typeof ResizeObserver === 'function') new ResizeObserver(topbarH).observe(t); }
  document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.id === 'sceneCap') { e.preventDefault(); sceneWhoToggle(); } });
  document.addEventListener('click', e => {
    if (e.target.closest('#scene, #sceneCap, #sceneWho')) { sceneWhoToggle(); return; }
    const t = e.target.closest('button'); if (!t) return;
    if (t.id === 'moreBtn') { moreMenu(!$('#moreMenu').classList.contains('open')); return; }
    if (t.id === 'themeBtn' || t.id === 'themeBtn2') { cycleTheme(); return; }
    if (t.id === 'feedMore') { feedMore(); return; }
    if (t.id === 'toTop') { toTop(); return; }
    if (t.id === 'unlived') { unlivedSheet(); return; }
    if (t.id === 'unlReset') { unlResetTap(t); return; }
    if (t.id === 'unlOff') { unlOffTap(t); return; }
    if (t.id === 'unlOn') { unlOnTap(); return; }
    if (t.closest('#moreMenu') && !t.dataset.music) setTimeout(() => moreMenu(false), 0);
    if (t.dataset.mode) { UI.prefs.mode = t.dataset.mode; renderIntro(); lsSet(PREF_KEY, UI.prefs); }
    else if (t.dataset.era) { if (t.dataset.era === 'any') UI.prefs.eraAny = 1; else { UI.prefs.eraAny = 0; UI.prefs.era = t.dataset.era; } renderIntro(); lsSet(PREF_KEY, UI.prefs); }
    else if (t.dataset.pace) { UI.prefs.pace = +t.dataset.pace; renderIntro(); lsSet(PREF_KEY, UI.prefs); }
    else if (t.id === 'startBtn' || t.id === 'startBtn2') { const g = $('#guard'); if (g) g.hidden = true; startNewLife(); }
    else if (t.id === 'againBtn' || t.id === 'dfAgain' || t.id === 'eduAgain') startNewLife();
    else if (t.id === 'resumeBtn' || t.id === 'resumeBtn2') { const sv = lsGet(SAVE_KEY, null); if (sv && sv.S && !(EDU_ON && !sv.S.eduOn)) restore(sv.S); }
    else if (t.id === 'beginBtn') beginLife();
    else if (t.id === 'homeBtn' || t.id === 'homeBtnTop') { lsDel(OPEN_KEY); show('intro'); renderIntro(); }
    else if (t.id === 'certHome2') { show('intro'); renderIntro(); }
    else if (t.dataset.past) openPast(+t.dataset.past);
    else if (t.id === 'pastShelf') { const el = $('#pastLives'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else if (t.id === 'a2Btn') a2Sheet();
    else if (t.id === 'a2Go') { if (A2.evt) a2Prompt(); else a2Sheet(); }
    else if (t.id === 'a2No') a2No();
    else if (t.id === 'a2Prompt') a2Prompt();
    else if (t.id === 'mvResume') { closeSheet(); const sv = lsGet(SAVE_KEY, null); if (sv && sv.S) restore(sv.S); }
    else if (t.dataset.mvlive) moveLivePick(t.dataset.mvlive);
    else if (t.id === 'pastEdit') { UI.pastEdit = !UI.pastEdit; renderIntro(); }
    else if (t.dataset.pdel || t.id === 'pastAll') pastDelTap(t);
    else if (t.id === 'pastMore') { const h = [...document.querySelectorAll('#pastBody [data-more][hidden]')]; for (const li of h.slice(0, PAST_STEP)) li.hidden = false; const left = h.length - PAST_STEP; t.hidden = left <= 0; if (left > 0) t.textContent = L`지난 삶 ${Math.min(PAST_STEP, left)}개 더 보기`; }
    else if (t.id === 'goFam') { const f = $('.p-fam'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else if (t.id === 'goShop') { if (S && S.phase === 'life') openShop(); }
    else if (t.id === 'quitBtn') { if (S && S.phase === 'life') track('life_quit', { age: S.age, country: S.born, era: !!(S.era && S.era !== 'now') }); save(); show('intro'); renderIntro(); }
    else if (t.id === 'openCtyStats' || t.classList.contains('oddsmore')) openCountriesSheet();
    else if (t.id === 'openWorldCodex') openWorldCodex();
    else if (t.id === 'btnMigMap') openMigrationMap();
    else if (t.id === 'btnWhatIf') openWhatIfDrawer();
    else if (t.id === 'openSamsaraTree') openSamsaraTree();
    else if (t.id === 'clBtn') openChangelog();
    else if (t.dataset.unstar != null) starSwap(+t.dataset.unstar);
    else if (t.id === 'sheetClose' || t.id === 'shopClose') sheetX();
    else if (t.id === 'cardShareBtn') { if (S && S.deathAt) shareNoteSave(); shareCard(); }
    else if (t.id === 'dfShare') dfShare();
    else if (t.id === 'shImg') { shareNoteSave(); shareCard(); }
    else if (t.id === 'shCopy') { shareNoteSave(); copyText(shareText(), L`글과 링크를 복사했어요. ${pasteWhere()} 붙여넣어 주세요.`); track('share', { kind: shareKind('sheet') }); }
    else if (t.id === 'shopBtn') openShop();
    else if (t.id === 'fmShop') openShop();
    else if (t.id === 'fmMore') { const el = $('.p-stats'), tb = $('#lifeview .topbar'); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (tb ? tb.offsetHeight : 0) - 8, behavior: 'smooth' }); }
    else if (t.id === 'farewellBtn') saveFarewell();
    else if (t.id === 'guardNew') { const sv = lsGet(SAVE_KEY, null); if (sv && sv.S) { lsSet(REPL_KEY, ageBand(sv.S.age)); unlivedAdd(sv.S); } lsDel(SAVE_KEY); $('#guard').hidden = true; startNewLife(); }
    else if (t.id === 'guardBack') { const sv = lsGet(SAVE_KEY, null); $('#guard').hidden = true; if (sv && sv.S && !(EDU_ON && !sv.S.eduOn)) restore(sv.S); }
    else if (t.dataset.buy && shopAsk(t)) return;
    else if (t.dataset.buy) { const r = buyShop(t.dataset.buy); if (r) { log(r, 'big'); S.log[S.log.length - 1].sh = 1; } fxEnd(); if (r) { toast(r); S.stats.buys = (S.stats.buys || 0) + 1; renderAll(); save(); } openShop(); }
    else if (t.dataset.gift) { S.flags.gift = t.dataset.gift === 'full' ? null : t.dataset.gift; openShop(); save(); }
    else if (t.dataset.diet) { const was = S.flags.diet || 'usual', to = t.dataset.diet; S.flags.diet = to === 'usual' ? null : to;
      if (was !== to) { const m = { usual: "Bạn quay lại ăn uống như những người xung quanh.", good: "Bạn quyết định ăn nhạt hơn, chú ý ăn thêm rau và ngũ cốc nguyên hạt.", out: "Vì nhiều ngày bận rộn, bạn ngày càng hay ăn ngoài và gọi đồ ăn giao tận nơi." }[to]; log(m, 'note'); toast(m); }
      openShop(); save(); }
    else if (t.dataset.set) { const r = buyShop(t.dataset.set); fxEnd(); if (r) { setNote(t.dataset.set, r); toast(r); save(); } openShop(); }
    else if (t.dataset.ins) { S.flags.ins = t.dataset.ins === 'more' ? 'more' : null; save(); openShop(); }
    else if (t.dataset.sur) { if (surSet(t.dataset.sur)) save(); openShop(); }
    else if (t.dataset.inv) { const to = t.dataset.inv; if (to === (S.invest || 'cash') || !invOK(to)) return; S.stats.inv = (S.stats.inv || 0) + 1; const m = invSwitch(to); if (m) { log(m, 'note'); toast(m); } save(); openShop(); renderStats(); }
    else if (t.id === 'cardSaveBtn') saveCard();
    else if (t.id === 'cardPrevBtn') openCardSheet('death');
    else if (t.id === 'certCardBtn') openCardSheet('birth');
    else if (t.id === 'copyLinkBtn') { const k = t.dataset.kind; copyText(k === 'death' ? shareText() : birthShareText(), L`글과 링크를 복사했어요. ${pasteWhere()} 붙여넣어 주세요.`); track('share', { kind: 'inapp_' + k }); }
    else if (t.id === 'birthCopyBtn') { copyText(birthShareText(), L`글과 링크를 복사했어요. ${pasteWhere()} 붙여넣어 주세요.`); track('birth_copy'); }
    else if (t.dataset.speed) setSpeed(+t.dataset.speed);
    else if (t.id === 'pauseBtn') { S.paused = !S.paused; S.ff = false; renderTop(); save(); }
    else if (t.dataset.music) setMusic(!MUSIC.on, true);
    else if (t.id === 'autoBtn') setAuto(!UI.prefs.auto);
    else if (t.id === 'autoOn') setAuto(true);
    else if (t.id === 'decMin') decPeek(true);
    else if (t.id === 'decOpen') decBack();
    else if (t.id === 'autoStop') setAuto(false);
    else if (t.id === 'pauseQ') setReflect(UI.prefs.reflect === false);
    else if (t.id === 'refOff') { if (performance.now() - (UI.decAt || 0) > DEC_ARM_MS) { const n = $('#decNote'); setReflect(false); pickChoice(n && n.value.trim() ? 'write' : 'skip'); } }
    else if (t.id === 'ffBtn') { S.ff = !S.ff; S.paused = false; renderTop(); }
    else if (t.dataset.focus) { const pick = !!t.closest('#mbPick'); S.focus = t.dataset.focus; S.flags.focusPicked = S.focus; S.flags.auFo = null; if (S.flags.au) S.flags.focusOwn = 1; if (!UI.prefs.foUsed) { UI.prefs.foUsed = 1; lsSet(PREF_KEY, UI.prefs); } S.flags.focusBack = S.flags.focusAuto = null; if (pick) miniPick(false); renderFocus(); if (pick) $('#mbFo').focus(); }
    else if (t.id === 'mbFo') miniPick($('#mbPick').hidden);
    else if (t.id === 'mbShop' || t.id === 'foShop') { miniPick(false); openShop(); }
    else if (t.dataset.fold) foldToggle(t.dataset.fold);
    else if (t.dataset.k && t.closest('#modal')) { if (performance.now() - (UI.decAt || 0) > DEC_ARM_MS) pickChoice(t.dataset.k); }
    else if (t.id === 'ctySwitch') { UI.cview = UI.cview === 'born' ? 'cur' : 'born'; renderCountry(); }
  });
  document.addEventListener('input', e => { if (e.target.classList && e.target.classList.contains('vol')) setVol(+e.target.value / 100); });
  const fxToggle = li => { const on = !li.classList.contains('open'); li.classList.toggle('open', on); li.setAttribute('aria-expanded', String(on)); };
  document.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.shnote && S) shareNoteInput(e.target); });
  document.addEventListener('change', e => { if (e.target.dataset && e.target.dataset.shnote && S) shareNoteSave(); });
  document.addEventListener('click', e => { const st = e.target.closest && e.target.closest('#feed .stb'); if (st) { starToggle(st.closest('li')); return; }
    const li = e.target.closest && e.target.closest('.feed li.hasfx, #feed li.tap'); if (li && !e.target.closest('a, button')) fxToggle(li); });
  document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.feed li.hasfx, #feed li.tap')) { e.preventDefault(); fxToggle(e.target); } });
  $('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') sheetX(); });
  { const t = $('#toast'); if (t) t.addEventListener('click', toastHide); }
  document.addEventListener('keydown', e => {
    if (!$('#sheet').hidden) { if (e.key === 'Escape') sheetX(); return; }
    if (e.target && e.target.id === 'decNote' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); pickChoice('write'); return; }
    if (e.target && e.target.matches && e.target.matches('textarea, input, select')) return;
    if (!$('#modal').hidden) { const n = +e.key; const bs = $('#modal').querySelectorAll('button[data-k]'); if (n >= 1 && n <= bs.length) { e.preventDefault(); pickChoice(bs[n - 1].dataset.k); } return; }
    if (UI.view === 'lifeview' && e.key === ' ' && !(e.target.closest && e.target.closest('button'))) { e.preventDefault(); S.paused = !S.paused; renderTop(); }
    else if (UI.view === 'lifeview' && S && S.phase === 'life' && /^[1-6]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); setSpeed(SPEEDS[+e.key - 1]); }
  });
  const tip = $('#tip');
  const tipFor = el => {
    const a = +el.dataset.a; const y = S.years.find(v => v.a === a);
    const evs = S.log.filter(e => e.a === a && ['big', 'loss', 'death', 'bad'].includes(e.kind)).map(e => e.text);
    if (!y) return L`${a}세 (${S.by + a}년)${a === Math.floor(lifeTable(BB(), S.sex).e0) ? " · tuổi thọ kỳ vọng" : ''}`;
    return L`<b>${a}세 · ${S.by + a}년</b><br>행복 ${y.h} · 건강 ${y.hl}${a >= 15 ? L` · 순자산 ${wonStr(y.nw)}` : ''}${y.fl && y.fl.it.length ? '<br>' + y.fl.it.slice(0, 3).map(([k, v]) => esc(k) + ' ' + (v < 0 ? '−' : '+') + wonStr(Math.abs(v))).join(' · ') : ''}${evs.length ? '<br>' + esc(evs[0]).slice(0, 90) : ''}`;
  };
  document.addEventListener('mouseover', e => { const c = e.target.closest && e.target.closest('.grid10 .c'); if (!c || !S) { tip.hidden = true; return; } tip.innerHTML = tipFor(c); tip.hidden = false; const r = c.getBoundingClientRect(); tip.style.left = Math.min(window.innerWidth - 250, r.left) + 'px'; tip.style.top = (r.bottom + 6) + 'px'; });
  document.addEventListener('scroll', () => { tip.hidden = true; }, { passive: true });
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener && matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S && UI.view === 'lifeview') renderGrid(); });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { save(); if (MUSIC.ctx && MUSIC.on) MUSIC.ctx.suspend(); } else if (MUSIC.ctx && MUSIC.on) MUSIC.ctx.resume(); });
  const firstGesture = () => { document.removeEventListener('pointerdown', firstGesture, true); document.removeEventListener('keydown', firstGesture, true); if (UI.prefs.musicHand === true && !MUSIC.on) setMusic(true); };
  document.addEventListener('pointerdown', firstGesture, true); document.addEventListener('keydown', firstGesture, true);
  document.querySelectorAll('[data-music]').forEach(b => {
    const isAct = UI.prefs.musicHand === true;
    b.setAttribute('aria-pressed', String(isAct));
    if (b.classList.contains('musicbtn')) {
      b.textContent = isAct ? '🔊 Âm thanh: Bật' : '🔇 Âm thanh: Tắt';
    }
  });
}
const INV_N = { cash: "Tiền gửi ngân hàng", bond: "Trái phiếu", mix: "Nửa cổ phiếu, nửa trái phiếu", stock: "Cổ phiếu", world: "Quỹ chỉ số thế giới", property: "Bất động sản", trade: "Tự chọn và mua bán cổ phiếu" };
function ownList() {
  const o = [];
  if (S.owns.house && S.house > 0) o.push(L`내 집 (시세 ${wonStr(S.house)})`);
  for (const k of ['car', 'moto', 'bike', 'tv', 'phone']) if (S.owns[k] || (k === 'tv' && S.owns.tv == null && C().ppp >= 20000)) o.push(ITEMS[k].n);
  if (S.owns.cell && !S.owns.phone) o.push(ITEMS.cell.n);
  if (rentals().length) o.push(L`세 놓은 집 ${rentals().length}채 (시세 ${wonStr(rentV())})`);
  if (S.money > 0) o.push(L`모은 돈 ${wonStr(S.money)} (${S.invest === 'property' ? "Đầu tư bất động sản" : INV_N[S.invest || 'cash']})`);
  return o.map(capS);
}
const SHOP_ASK = new Set(['split']);
function shopAsk(t) {
  if (!SHOP_ASK.has(String(t.dataset.buy).split('@')[0]) || t.dataset.armed) return false;
  const s = t.querySelector('.sn small'), d0 = s ? s.textContent : '';
  t.dataset.armed = 1; t.classList.add('armed'); if (s) s.textContent = "Nhấn thêm lần nữa để thật sự nói ra";
  setTimeout(() => { if (t.isConnected && t.dataset.armed) { delete t.dataset.armed; t.classList.remove('armed'); if (s) s.textContent = d0; } }, 4000);
  return true;
}
function openShop() {
  if (!S || S.phase !== 'life') return;
  S.ff = false;
  const items = shopItems();
  const inc = S.income > 0 ? L` · 연 소득 ${wonStr(S.income)}` : '';
  const inv = INV_KS.filter(invOK).map(k => `<button data-inv="${k}" aria-pressed="${(S.invest || 'cash') === k}">${{ cash: "Tiền gửi ngân hàng · 1–1,5% mỗi năm sau khi trừ lạm phát", bond: "Trái phiếu · trung bình khoảng 2%, ít biến động", mix: "Quỹ nửa cổ phiếu, nửa trái phiếu · trung bình 3,5%, biến động vừa", stock: "Cổ phiếu (theo chỉ số) · trung bình 5%, biến động lớn", world: "Chỉ số nước ngoài (cổ phiếu toàn cầu) · trung bình 5%, còn biến động theo cả tỷ giá" + (worldFee(C()) ? ' · ' + L`수수료가 해마다 ${(worldFee(C()) * 100).toFixed(1)}%쯤 더 들어요` : ''), property: "Quỹ bất động sản · trung bình 3,5%", trade: "Tự chọn và mua bán cổ phiếu · phần lớn lãi ít hơn chỉ số" }[k]}</button>`).join('')
    + `<small class="invnote">${S.invest && S.invest !== 'cash' ? L`지금은 모은 돈을 ${INV_NM()[S.invest]}에 넣어 두었어요. 다른 칸을 누르면 팔아서 옮겨요. 팔 때는 수수료와, 나라에 따라 번 돈에 대한 세금이 나가요.` + ' ' : ''}${"Đây là nơi bạn chọn gửi tiền tiết kiệm vào đâu. Nếu không chọn, tiền sẽ được gửi ngân hàng. Mọi mức lợi nhuận đều đã trừ lạm phát. Quỹ bất động sản tách biệt với nhà của bạn; nhà để ở được mua ở mục 'Mua nhà riêng', nhà cho thuê ở mục 'Nhà cho thuê'."}${S.invest === 'trade' || invOK('trade') ? ' ' + "Nếu tự chọn cổ phiếu và mua bán thường xuyên, phần lớn mọi người lãi ít hơn chỉ số vì phí, thuế và những quyết định chậm trễ. Cũng có số ít người lãi lớn (Barber & Odean 2000)." : ''}</small>`;
  const li = it => it.opts ? `<li class="shopgrp${it.opts.some(o => o.avail) ? '' : ' off'}"><span class="sn">${esc(capS(it.n))}<small>${esc(it.d)}${it.avail ? '' : ' · ' + esc(it.why)}</small></span><div class="fbtypes">${it.opts.map(o => `<button data-buy="${o.id}" ${o.avail ? '' : 'disabled'}>${esc(capS(o.n))} <small>${o.gain != null ? '+' + wonStr(o.gain) : wonStr(o.price)}${o.credit ? ' · ' + "Bằng tiền vay" : ''}</small></button>`).join('')}</div></li>` : `<li><button class="shopitem" data-buy="${it.id}" ${it.avail ? '' : 'disabled'}><span class="sn">${esc(capS(it.n))}<small>${esc(it.d)}${it.avail || !it.why ? '' : ' · ' + esc(it.why)}</small></span><span class="sp">${it.gain != null ? '+' + wonStr(it.gain) : it.price > 0 ? wonStr(it.price) : "Miễn phí"}<small>${it.avail ? (it.credit ? "Bằng tiền vay" : it.price > 0 || it.gain != null ? "quy theo giá Việt Nam" : '') : it.why ? '' : "Không đủ tiền"}</small></span></button></li>`;
  const top = shopTop(items), rest = items.filter(it => !top.includes(it));
  const nowL = top.length ? `<div class="lbl" style="margin:0 0 6px">${"Nên làm lúc này"}</div><ul class="shop">${top.map(li).join('')}</ul>` : '';
  const moreL = !rest.length ? '' : !top.length ? `<ul class="shop">${rest.map(li).join('')}</ul>`
    : `<details class="shopmore"${UI.shopMore ? ' open' : ''}><summary>${L`다른 것 더 보기 (${rest.length})`}</summary><ul class="shop">${rest.map(li).join('')}</ul></details>`;
  const gk = S.flags.gift || 'full';
  const gift = S.age >= 18 ? `<div class="lbl" style="margin:10px 0 6px">${"Tiền hiếu hỉ"}</div><div class="fbtypes" role="group" aria-label="${"Tiền hiếu hỉ"}">`
    + ['full', 'some', 'none'].map(k => `<button data-gift="${k}" aria-pressed="${gk === k}">${{ full: "Gửi chu đáo", some: "Một nửa, tùy khả năng", none: "Chỉ đến chung vui, chia buồn" }[k]}</button>`).join('')
    + `<small class="invnote">${"Đây là tiền mừng đám cưới bạn bè và tiền phúng viếng đám tang họ hàng. Gửi ít hơn thì tiết kiệm được tiền, nhưng tình cảm có thể bớt gần gũi đôi chút."}</small></div>` : '';
  const sk = S.flags.surM && S.flags.surM === S.fam.marriages ? 'm' : 'f', sfix = surOK() && surFixed();
  const sur = surOK() ? `<div class="lbl" style="margin:10px 0 6px">${"Họ của con"}</div><div class="fbtypes" role="group" aria-label="${"Họ của con"}">`
    + ['f', 'm'].map(k => `<button data-sur="${k}" aria-pressed="${sk === k}"${sfix ? ' disabled' : ''}>${k === 'f' ? "Theo họ bố" : "Theo họ mẹ"}</button>`).join('')
    + `<small class="invnote">${sfix ? "Các con sau cũng theo họ đã chọn cho con đầu lòng." : C().id === 'KOR' ? "Nếu hai vợ chồng thỏa thuận khi đăng ký kết hôn, con có thể theo họ mẹ. Sau khi con đầu lòng chào đời thì không thể thay đổi." : "Đây là nơi bạn chọn những đứa con sắp chào đời sẽ theo họ ai. Nếu không chọn, con sẽ theo họ bố."}</small></div>` : '';
  const ins = S.age >= 18 ? `<div class="lbl" style="margin:10px 0 6px">${"Bảo hiểm"}</div><div class="fbtypes" role="group" aria-label="${"Bảo hiểm"}">`
    + ['base', 'more'].map(k => `<button data-ins="${k}" aria-pressed="${(insOn() ? 'more' : 'base') === k}">${k === 'base' ? "Chỉ bảo hiểm cơ bản" : "Mua bảo hiểm đầy đủ hơn"}</button>`).join('')
    + `<small class="invnote">${"Bảo hiểm đầy đủ hơn tốn phí mỗi năm, nhưng giảm nhiều phần viện phí bạn phải tự trả, và gia đình sẽ nhận tiền bảo hiểm nếu bạn qua đời trước 70 tuổi. Thường thì tổng phí đã đóng nhiều hơn số tiền nhận lại."}</small></div>` : '';
  const dk = S.flags.diet || 'usual';
  const diet = S.age >= 18 ? `<div class="lbl" style="margin:10px 0 6px">${"Ăn uống"}</div><div class="fbtypes" role="group" aria-label="${"Ăn uống"}">`
    + ['usual', 'good', 'out'].map(k => `<button data-diet="${k}" aria-pressed="${dk === k}">${{ usual: "Ăn như những người xung quanh", good: "Ăn nhạt, thêm rau và ngũ cốc nguyên hạt", out: "Hay ăn ngoài, gọi đồ ăn" }[k]}</button>`).join('')
    + `<small class="invnote">${"Ăn uống chú ý thì tiền đi chợ tốn hơn một chút, nhưng ít mắc các bệnh như cao huyết áp, tiểu đường hơn. Ăn ngoài và gọi đồ ăn thì tiện nhưng tốn tiền hơn và dễ mắc bệnh hơn một chút."}</small></div>` : '';
  const iv = S.invest || 'cash', ivW = INV_N[iv], gW = { full: "chu đáo", some: "một nửa", none: "chỉ đến dự" }[gk], dW = { usual: "như mọi người", good: "ăn uống chú ý", out: "Ăn ngoài và gọi đồ ăn" }[dk];
  const sets = shopSets(), onW = sets.filter(x => x.on).map(x => x.n);
  const ddM = typeof ddLv === 'function' && S.age >= 16 && ddLv() >= 2 ? ddLv() : 0;
  const yearly = sets.length ? `<div class="lbl" style="margin:10px 0 6px">${"Tự động"}</div><div class="fbtypes" role="group" aria-label="${"Tự động"}">`
    + sets.map(x => `<button data-set="${x.id}" aria-pressed="${x.on}">${esc(x.n)}${x.ev ? ` <small>· ${esc(x.ev)}</small>` : ''}</button>`).join('')
    + `<small class="invnote">${"Khi bật, mỗi việc sẽ tự diễn ra khi đến lúc. Việc tốn tiền chỉ diễn ra khi tiền tiết kiệm nhiều hơn gấp ba chi phí. Nhấn lần nữa để tắt."}${sets.some(x => ['parentsauto', 'meetauto', 'dinnerauto', 'tripauto', 'abroadauto', 'donateauto', 'gearauto'].includes(x.id)) ? ' ' + "Tiền biếu bố mẹ, hẹn hò, đi ăn ngoài, du lịch, học năng khiếu và quyên góp chỉ diễn ra khi chi xong vẫn còn lại ít nhất bằng thu nhập một năm của một người bình thường, và càng bật nhiều thì tiền tích lũy được càng ít." : ''}${sets.some(x => x.id === 'tripauto' || x.id === 'abroadauto') ? ' ' + "Du lịch sẽ đi cùng người bạn tự chọn gần đây nhất." : ''}${sets.some(x => x.id === 'gearauto') ? ' ' + "Các buổi học sẽ dành cho sở thích bạn tự chọn gần đây nhất." : ''}${sets.some(x => x.id === 'askeach') ? ' ' + "Khi bật 'Quyết định riêng cho từng con', học phí đại học và chi phí đám cưới của con sẽ không theo quyết định ban đầu mà được hỏi lại cho từng con." : ''}</small></div>` : '';
  const setL = `<details class="shopset"${UI.shopSet ? ' open' : ''}><summary>${"Lối sống"} <small>${S.age >= 18 ? L`돈 맡기기: ${ivW} · 경조사비: ${gW} · 식습관: ${dW}` : L`돈 맡기기: ${ivW}`}${insOn() ? ' · ' + "Bảo hiểm: đầy đủ" : ''}${onW.length > 2 ? ' · ' + L`알아서: ${onW.length}가지` : onW.length ? ' · ' + L`알아서: ${onW.join(', ')}` : ''}</small></summary>`
    + (ddM ? '' : `<div class="lbl" style="margin:8px 0 6px">${"Đầu tư tiền nhàn rỗi"}</div><div class="fbtypes" role="group" aria-label="${"Cách đầu tư"}">${inv}</div>`) + `${ddM >= 3 ? '' : gift + sur + ins}${diet}${yearly}</details>`;
  const html = L`<h2>${S.money < 0 ? L`빚 ${wonStr(-S.money)}` : L`모은 돈 ${wonStr(S.money)}`}</h2><p>한국 물가로 환산한 금액이에요${inc}. 쓰는 만큼 행복·관계·건강·미래가 바뀝니다. 고르는 동안 시간은 멈춰 있어요.</p>` + (S.house > 0 || rentV() > 0 ? `<p class="invnote">${rentV() > 0 ? L`집을 뺀, 쓰거나 맡길 수 있는 돈이에요. 순자산 ${wonStr(netWorth())}에는 집값 ${wonStr(S.house + rentV())}도 들어 있어요. (세 놓은 집 ${wonStr(rentV())} 포함)` : L`집을 뺀, 쓰거나 맡길 수 있는 돈이에요. 순자산 ${wonStr(netWorth())}에는 집값 ${wonStr(S.house)}도 들어 있어요.`}</p>` : '') + nowL + moreL + setL + `<div class="shopend"><button class="ghost" id="shopClose">${"Đóng"}</button></div>`;
  if ($('#sheet').hidden) openSheet("Chi tiêu · đầu tư", html); else { const bd = $('#sheet .bd'); const st = bd.scrollTop; bd.innerHTML = html; bd.scrollTop = st; }
  const md = $('#sheet .shopmore'), sd = $('#sheet .shopset');
  if (md) md.addEventListener('toggle', () => { UI.shopMore = md.open; });
  if (sd) sd.addEventListener('toggle', () => { UI.shopSet = sd.open; });
}
const MUSIC = { ctx: null, on: false, timer: null, step: 0 };
const CHORDS = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67], [57, 60, 64, 67], [50, 53, 57, 62], [52, 55, 59, 64], [53, 57, 60, 64]];
const PENTA = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81];
const mhz = n => 440 * Math.pow(2, (n - 69) / 12);
function musicInit() {
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
  const ctx = new AC(), master = ctx.createGain(), lp = ctx.createBiquadFilter(), conv = ctx.createConvolver(), wet = ctx.createGain(), dry = ctx.createGain();
  master.gain.value = 0; lp.type = 'lowpass'; lp.frequency.value = 1600; wet.gain.value = 0.5; dry.gain.value = 0.55;
  const len = ctx.sampleRate * 3.5, buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = 0.02; comp.release.value = 0.5;
  conv.buffer = buf; lp.connect(dry); lp.connect(conv); conv.connect(wet); dry.connect(master); wet.connect(master); master.connect(comp); comp.connect(ctx.destination);
  const bus = ctx.createGain(); bus.connect(lp);
  Object.assign(MUSIC, { ctx, master, lp, bus }); return true;
}
function musicNote(n, t, dur, vol, type, attack, h) {
  const ctx = MUSIC.ctx, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = mhz(n); o.detune.value = (Math.random() - 0.5) * 8;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(MUSIC.bus); o.start(t); o.stop(t + dur + 0.1);
  if (h) { const o2 = ctx.createOscillator(), g2 = ctx.createGain(); o2.type = 'sine'; o2.frequency.value = mhz(n + (n < 52 ? 24 : 12)); o2.detune.value = o.detune.value; g2.gain.value = h; o2.connect(g2); g2.connect(g); o2.start(t); o2.stop(t + dur + 0.1); }
}
const musicStage = () => { if (UI.view !== 'life' || !S || S.phase !== 'life') return 'a'; const a = S.age; return a < 13 ? 'c' : a < 30 ? 'y' : a < 60 ? 'a' : 'o'; };
function musicStep() {
  if (!MUSIC.on || !MUSIC.ctx) return;
  const t = MUSIC.ctx.currentTime + 0.05, st = MUSIC.step++;
  if (MUSIC.style && typeof bgmStep === 'function' && bgmStep(MUSIC.style, t, st)) return;
  const sg = musicStage(), r = Math.random;
  if (st % 2 === 0) { const ch = CHORDS[(st / 2) % CHORDS.length]; ch.forEach((n, i) => musicNote(n - 12 + (i === 0 ? 0 : 12) + (sg === 'c' && i === 3 ? 12 : 0), t + i * (sg === 'o' ? 0.14 : 0.08), sg === 'o' ? 11 : 9.5, i === 0 ? 0.05 : 0.03, 'sine', 2.2, i === 0 ? 0.6 : 0.45)); }
  const k = sg === 'c' ? (r() < 0.15 ? 1 : r() < 0.55 ? 2 : 3) : sg === 'y' ? (r() < 0.25 ? 0 : r() < 0.6 ? 1 : 2) : sg === 'o' ? (r() < 0.55 ? 0 : 1) : (r() < 0.35 ? 0 : r() < 0.6 ? 1 : 2);
  for (let i = 0; i < k; i++) musicNote(sg === 'c' ? pick(PENTA.slice(0, 7)) + 12 : sg === 'o' ? pick(PENTA.slice(0, 6)) - 12 : pick(PENTA), t + 0.4 + r() * 3.2, sg === 'c' ? 1.6 : sg === 'o' ? 4.5 : 3.2, sg === 'c' ? 0.035 : 0.045, sg === 'o' ? 'sine' : 'triangle', 0.015);
}
const musicVol = () => { const v = UI.prefs.vol; return typeof v === 'number' && v >= 0 && v <= 1 ? v : 1; };
const MUSIC_LV = 2.4;
function volShow() { for (const r of document.querySelectorAll('.vol')) { r.hidden = !MUSIC.on; r.value = Math.round(musicVol() * 100); } }
function setVol(v) {
  UI.prefs.vol = clamp(v, 0, 1); lsSet(PREF_KEY, UI.prefs);
  if (MUSIC.on && MUSIC.master) MUSIC.master.gain.setTargetAtTime(MUSIC_LV * musicVol(), MUSIC.ctx.currentTime, 0.15);
  for (const r of document.querySelectorAll('.vol')) r.value = Math.round(musicVol() * 100);
}
const IOS_SND = /iPhone|iPad|iPod/.test(navigator.userAgent || '') || (/Macintosh/.test(navigator.userAgent || '') && navigator.maxTouchPoints > 1);
function soundAsk() {
  try { const s = navigator.audioSession; if (s) { if (s.type !== 'playback') s.type = 'playback'; return; } } catch (e) { return; }
  if (IOS_SND && !UI.silentTold) { UI.silentTold = true; setTimeout(() => toast("Nếu không nghe thấy âm thanh, hãy tắt chế độ im lặng trên điện thoại."), 600); }
}
function setMusic(on, byHand) {
  if (on && byHand) { soundAsk(); if (UI.prefs.vol === 0) UI.prefs.vol = 0.5; }
  if (on && !MUSIC.ctx && !musicInit()) { toast("Không thể phát nhạc trên trình duyệt này."); return; }
  MUSIC.on = !!on; UI.prefs.music = MUSIC.on; if (byHand) UI.prefs.musicHand = MUSIC.on; lsSet(PREF_KEY, UI.prefs);
  if (MUSIC.on) { MUSIC.ctx.resume(); MUSIC.master.gain.cancelScheduledValues(MUSIC.ctx.currentTime); MUSIC.master.gain.setTargetAtTime(MUSIC_LV * musicVol(), MUSIC.ctx.currentTime, 1.2); if (!MUSIC.timer) { musicStep(); MUSIC.timer = setInterval(musicStep, 4000); } }
  else if (MUSIC.ctx) { MUSIC.master.gain.setTargetAtTime(0, MUSIC.ctx.currentTime, 0.4); clearInterval(MUSIC.timer); MUSIC.timer = null; setTimeout(() => { if (!MUSIC.on && MUSIC.ctx) MUSIC.ctx.suspend(); }, 1500); }
  document.querySelectorAll('[data-music]').forEach(b => {
    b.setAttribute('aria-pressed', String(MUSIC.on));
    if (b.classList.contains('musicbtn')) {
      b.textContent = MUSIC.on ? '🔊 Âm thanh: Bật' : '🔇 Âm thanh: Tắt';
    }
  });
  volShow();
  if (byHand) track('music_toggle', { on: MUSIC.on });
}
function openMigrationMap() {
  if (!S) return;
  const codes = countryCodes();
  const ctySeq = codes.length > 0 ? codes : [S.born];
  const uniqueSeq = [];
  for (const c of ctySeq) {
    if (!uniqueSeq.length || uniqueSeq[uniqueSeq.length - 1] !== c) uniqueSeq.push(c);
  }

  const cvW = 600, cvH = 300;
  let canvasHtml = `<div style="max-height: 75vh; overflow-y: auto; font-family: var(--serif);">
    <div style="border: 1px solid var(--rule); background: #FAF9F6; padding: 12px 14px; margin-bottom: 12px;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--fg-sub);">LỘ TRÌNH BÔN BA QUA CÁC ĐẠI DƯƠNG</span>
      <div style="font-size: 15px; font-weight: bold; margin-top: 4px; color: var(--fg);">
        ${uniqueSeq.map(c => (CBY[c] && CBY[c].ko) || c).join(' ➔ ')}
      </div>
      <div style="font-size: 12px; color: var(--fg-sub); margin-top: 4px;">
        Đã sinh sống và in dấu chân qua <b>${uniqueSeq.length}</b> quốc gia trên hành trình ${S.age} năm cuộc đời.
      </div>
    </div>

    <div style="position: relative; width: 100%; border: 1px solid var(--rule); background: #FFFFFF; overflow: hidden; margin-bottom: 14px;">
      <canvas id="migCanvas" width="${cvW}" height="${cvH}" style="width: 100%; height: auto; display: block;"></canvas>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${uniqueSeq.map((c, i) => {
        const cty = CBY[c];
        const isBorn = i === 0;
        const isEnd = i === uniqueSeq.length - 1;
        const tag = isBorn ? 'NƠI CẤT TIẾNG KHÓC CHÀO ĐỜI' : isEnd ? 'NƠI TRÚT HƠI THỞ CUỐI CÙNG' : `CHẶNG DỪNG CHÂN THỨ ${i + 1}`;
        return `<div style="display: flex; gap: 12px; border-left: 3px solid ${isBorn ? '#15803D' : isEnd ? '#991B1B' : '#6366F1'}; padding: 6px 12px; background: #FAF9F6;">
          <div style="flex-grow: 1;">
            <div style="font-size: 10px; font-family: var(--sans); font-weight: bold; letter-spacing: 0.06em; color: var(--fg-sub);">${tag}</div>
            <b style="font-size: 14px; color: var(--fg);">${(cty && cty.ko) || c} (${c})</b>
            <div style="font-size: 11px; color: var(--fg-sub); font-family: var(--sans);">
              Kỳ vọng sống: ${cty ? cty.le : '—'} tuổi · GDP (PPP): ${cty ? (cty.ppp || 0).toLocaleString() : '—'}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;

  openSheet('Bản Đồ Lộ Trình Di Cư Toàn Cầu', canvasHtml);

  // Render curved migration flight path on canvas
  setTimeout(() => {
    const cv = document.getElementById('migCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const scaleX = cvW / 156;
    const scaleY = cvH / 66;

    // Draw world land dots background
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, cvW, cvH);

    // Draw country points
    const pts = [];
    uniqueSeq.forEach(c => {
      const coord = WORLD.at[c];
      if (coord) {
        pts.push({ c, x: coord[0] * scaleX, y: coord[1] * scaleY });
      }
    });

    // Draw flight trajectory lines
    if (pts.length > 1) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1], curr = pts[i];
        const midX = (prev.x + curr.x) / 2;
        const midY = Math.min(prev.y, curr.y) - 25; // Arc curve upwards
        ctx.quadraticCurveTo(midX, midY, curr.x, curr.y);
      }
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw waypoints
    pts.forEach((p, idx) => {
      const isStart = idx === 0;
      const isEnd = idx === pts.length - 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isStart || isEnd ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = isStart ? '#15803D' : isEnd ? '#991B1B' : '#4F46E5';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#111827';
      ctx.fillText(p.c, p.x + 9, p.y + 4);
    });
  }, 120);
}
function openWhatIfDrawer() {
  const snaps = S && S.vhtsSnaps ? S.vhtsSnaps : [];
  if (!snaps.length) {
    // Generate fallback checkpoints from S.years if snaps not yet populated
    if (S && S.years && S.years.length >= 2) {
      const fallbackAges = [18, 25, 35, 50].filter(a => a < S.age);
      fallbackAges.forEach(fa => {
        snaps.push({
          age: fa,
          desc: `Mốc tuổi ${fa} · Tái tạo nhánh thực tại mới`,
          snap: null
        });
      });
    }
  }

  if (!snaps.length) {
    openSheet('Hiệu Ứng Cánh Bướm: Phân Nhánh Thực Tại', '<p style="font-family:var(--serif); padding:20px; text-align:center; color:var(--fg-sub);">Chưa có mốc ký ức phân nhánh nào được lưu lại cho kiếp này (cần sống ít nhất qua tuổi thiếu niên).</p>');
    return;
  }

  const items = snaps.map((sn, idx) => {
    return `<div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--rule); padding: 12px 14px; background: #FAF9F6; margin-bottom: 10px; font-family: var(--serif);">
      <div>
        <div style="font-size: 11px; font-family: var(--sans); color: var(--fg); font-weight: 700; text-transform: uppercase;">MỐC PHÂN KỲ THỜI GIAN</div>
        <b style="font-size: 14px; color: var(--fg);">Tuổi ${sn.age}</b>
        <div style="font-size: 12px; color: var(--fg); font-weight: 500; margin-top: 2px;">${esc(sn.desc || 'Tái tạo dòng thời gian')}</div>
      </div>
      <button type="button" class="btn-rewind" data-snap-idx="${idx}" style="padding: 6px 12px; border: 1px solid #111827; background: #111827; color: #FFFFFF; font-size: 12px; font-weight: bold; cursor: pointer; border-radius: 4px;">
        QUAY LẠI ⏳
      </button>
    </div>`;
  }).join('');

  const content = `<div style="max-height: 72vh; overflow-y: auto; font-family: var(--serif);">
    <div style="border: 1px solid var(--rule); background: #FAF9F6; padding: 12px 14px; margin-bottom: 14px;">
      <b style="font-size: 14px; color: var(--fg);">Vũ Trụ Song Song (Multiverse What-If)</b>
      <p style="font-size: 12.5px; color: var(--fg); margin: 4px 0 0; line-height: 1.5; font-weight: 500;">
        Chọn một mốc tuổi trong quá khứ để quay ngược thời gian, đưa ra các quyết định khác và chứng kiến số phận rẽ sang một hướng hoàn toàn mới! Kiếp sống hiện tại vẫn được bảo tồn trọn vẹn trong lịch sử.
      </p>
    </div>
    ${items}
  </div>`;

  openSheet('Hiệu Ứng Cánh Bướm: Phân Nhánh Thực Tại', content);

  setTimeout(() => {
    document.querySelectorAll('.btn-rewind').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = +this.getAttribute('data-snap-idx');
        const chosen = snaps[idx];
        if (!chosen) return;

        sheetX(); // Close drawer
        try {
          if (chosen.snap) {
            S = JSON.parse(JSON.stringify(chosen.snap));
          } else {
            // Rewind age and reset death
            S.age = chosen.age;
            S.phase = 'life';
            S.deathAt = null;
            S.queue = [];
            S.pending = null;
            S.years = S.years.filter(y => y.a <= chosen.age);
            S.log = S.log.filter(l => l.a <= chosen.age);
          }
          S.replay = false;
          S.flags.rewound = chosen.age;
          log(`[Hiệu Ứng Cánh Bướm]: Bạn quay ngược thời gian về mốc tuổi ${chosen.age}. Một nhánh thực tại song song bắt đầu mở ra!`, 'good');
          show('lifeview');
          feedReset();
          S.log.slice().reverse().forEach(e => addFeed(e, true));
          renderAll();
          planYear();
          toast(`Đã kích hoạt nhánh thời gian song song tại tuổi ${chosen.age}!`, 4000);
        } catch (err) {
          console.error('Rewind error:', err);
          toast('Không thể phân nhánh thực tại tại mốc này.', 4000);
        }
      });
    });
  }, 100);
}
function openWorldCodex() {
  const lives = (typeof lsGet === 'function' ? lsGet(LIVES_KEY, []) : []) || [];
  const livedIsos = new Set(lives.map(l => l.iso));
  const totCountries = COUNTRIES.length;
  const unlockedCount = livedIsos.size;
  const pctUnlocked = ((unlockedCount / totCountries) * 100).toFixed(1);

  const cards = COUNTRIES.map(c => {
    const unlocked = livedIsos.has(c.id);
    const name = (typeof COUNTRY_T !== 'undefined' && COUNTRY_T[c.id]) || c.ko || c.id;
    const pastL = lives.filter(l => l.iso === c.id);
    const badge = unlocked
      ? `<span style="display:inline-block; font-size:10px; font-weight:700; color:#15803D; background:#DCFCE7; border:1px solid #86EFAC; padding:2px 6px; border-radius:3px;">ĐÃ SỐNG (${pastL.length} kiếp)</span>`
      : `<span style="display:inline-block; font-size:10px; font-weight:700; color:#1F2937; background:#F3F4F6; border:1px solid #9CA3AF; padding:2px 6px; border-radius:3px;">CHƯA KHAI MỞ</span>`;

    return `<div class="codex-item" data-name="${name.toLowerCase()}" data-id="${c.id.toLowerCase()}" style="border: 1px solid ${unlocked ? '#15803D' : '#D1D5DB'}; padding: 10px 12px; background: ${unlocked ? '#F0FDF4' : '#FFFFFF'};">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
        <b style="font-size:13.5px; color:#111827; font-family:var(--f-display);">${name} <span style="font-size:11px; color:#1F2937; font-family:var(--f-mono); font-weight:600;">(${c.id})</span></b>
        ${badge}
      </div>
      <div style="font-size:11.5px; color:#111827; font-family:var(--f-mono); line-height:1.5;">
        Kỳ vọng sống: <b style="color:#111827;">${c.le} tuổi</b> · Sinh suất: <b style="color:#111827;">${c.tfr} con</b><br>
        GDP bình quân: <b style="color:#111827;">${(c.ppp || 0).toLocaleString()}</b>
      </div>
      ${unlocked ? `<div style="margin-top:6px; font-size:11px; color:#15803D; font-weight:700; border-top:1px dashed #86EFAC; padding-top:4px;">Kiếp gần nhất: ${esc(pastL[pastL.length - 1].name)} (${pastL[pastL.length - 1].age} tuổi)</div>` : ''}
    </div>`;
  }).join('');

  const content = `<div style="max-height: 72vh; overflow-y: auto; font-family: var(--serif); color: #111827;">
    <div style="padding: 12px 14px; border: 1px solid #111827; background: #F9FAFB; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #111827; font-family: var(--f-mono);">TIẾN ĐỘ THÁM HIỂM ĐỊA CẦU</span>
          <div style="font-size: 20px; font-weight: 800; color: #111827; margin-top: 2px;">${unlockedCount} / ${totCountries} Quốc Gia (${pctUnlocked}%)</div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #111827; font-family: var(--f-mono);">
          Tổng số kiếp: <b style="color:#111827; font-size:14px;">${lives.length} kiếp</b>
        </div>
      </div>
      <div style="width: 100%; height: 7px; background: #E5E7EB; margin-top: 10px; border-radius: 3px; overflow: hidden; border: 1px solid #D1D5DB;">
        <div style="width: ${pctUnlocked}%; height: 100%; background: #111827;"></div>
      </div>
    </div>

    <input type="text" id="codexSearch" placeholder="🔍 Tìm kiếm quốc gia theo tên hoặc mã ISO (VD: Việt Nam, VNM, Mỹ...)" style="width: 100%; box-sizing: border-box; padding: 9px 12px; margin-bottom: 12px; font-size: 13.5px; border: 1px solid #111827; color: #111827; background: #FFFFFF; font-weight: 500;">

    <div id="codexGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 8px;">
      ${cards}
    </div>
  </div>`;

  openSheet('Sổ Tay Khai Mở Địa Lý Toàn Cầu (172 Quốc Gia)', content);

  setTimeout(() => {
    const inp = document.getElementById('codexSearch');
    if (inp) {
      inp.focus();
      inp.addEventListener('input', function() {
        const q = this.value.trim().toLowerCase();
        const items = document.querySelectorAll('.codex-item');
        items.forEach(it => {
          const nm = it.getAttribute('data-name') || '';
          const id = it.getAttribute('data-id') || '';
          it.style.display = (!q || nm.includes(q) || id.includes(q)) ? '' : 'none';
        });
      });
    }
  }, 100);
}
function openSamsaraTree() {
  const lives = (typeof lsGet === 'function' ? lsGet(LIVES_KEY, []) : []) || [];
  if (!lives.length) {
    openSheet('Cây Phả Hệ Luân Hồi', '<p style="font-family:var(--serif); padding:28px 20px; text-align:center; color:var(--ink) !important; font-size:14.5px; font-weight: 500; line-height: 1.6;">Chưa có kiếp người nào được hoàn thành trên trình duyệt này.<br><span style="color:var(--ink2); font-size:13px; font-family:var(--f-mono);">Hãy bắt đầu kiếp đầu tiên để gieo hạt giống luân hồi!</span></p>');
    return;
  }

  const totYears = lives.reduce((s, l) => s + (l.age || 0), 0);
  const avgAge = (totYears / lives.length).toFixed(1);

  const rawKarma = localStorage.getItem('vhts_soul_karma');
  const karma = rawKarma ? JSON.parse(rawKarma) : null;

  const treeNodes = lives.slice().map((l, i) => {
    const isLast = i === lives.length - 1;
    return `<div style="display: flex; gap: 14px; position: relative; margin-bottom: 14px;">
      <div style="display: flex; flex-direction: column; align-items: center; width: 32px;">
        <div style="width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--ink); background: ${isLast ? 'var(--ink)' : 'var(--card)'}; color: ${isLast ? 'var(--card)' : 'var(--ink)'}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; font-family: var(--f-mono);">
          ${i + 1}
        </div>
        ${!isLast ? '<div style="width: 2px; flex-grow: 1; background: var(--rule); margin: 4px 0;"></div>' : ''}
      </div>
      <div style="flex-grow: 1; border: 1px solid var(--rule); padding: 12px 14px; background: var(--card); font-family: var(--serif);">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <b style="font-size: 15px; color: var(--ink);">${esc(l.name)}</b>
          <span style="font-size: 12px; font-family: var(--f-mono); color: var(--ink); font-weight: 700;">${esc(l.ko)} · ${l.age} tuổi</span>
        </div>
        <div style="font-size: 12px; color: var(--ink2); margin-top: 3px; font-family: var(--f-mono);">
          Nghề nghiệp: <b style="color:var(--ink);">${esc(l.job || 'Tự do / Khác')}</b> · Con cái: <b style="color:var(--ink);">${l.kids || 0} người</b>
        </div>
        <div style="font-size: 12.5px; color: var(--ink); margin-top: 4px; border-top: 1px dashed var(--rule); padding-top: 4px;">
          Tạ thế vì: <em style="color:var(--ink); font-weight:700;">${esc(l.cause)}</em>
        </div>
      </div>
    </div>`;
  }).reverse().join('');

  const content = `<div style="max-height: 72vh; overflow-y: auto; font-family: var(--serif); color:var(--ink);">
    <!-- Summary Header -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 14px; border: 1px solid var(--ink); background: var(--card2); margin-bottom: 16px; text-align: center;">
      <div>
        <div style="font-size: 10.5px; color: var(--ink); font-weight: 700; text-transform: uppercase; font-family: var(--f-mono);">TỔNG SỐ KIẾP</div>
        <div style="font-size: 20px; font-weight: 800; color: var(--ink); margin-top: 2px;">${lives.length} Kiếp</div>
      </div>
      <div>
        <div style="font-size: 10.5px; color: var(--ink); font-weight: 700; text-transform: uppercase; font-family: var(--f-mono);">TỔNG THỌ MỆNH</div>
        <div style="font-size: 20px; font-weight: 800; color: var(--ink); margin-top: 2px;">${totYears} Năm</div>
      </div>
      <div>
        <div style="font-size: 10.5px; color: var(--ink); font-weight: 700; text-transform: uppercase; font-family: var(--f-mono);">TUỔI THỌ BÌNH QUÂN</div>
        <div style="font-size: 20px; font-weight: 800; color: var(--ink); margin-top: 2px;">${avgAge} Tuổi</div>
      </div>
    </div>

    ${karma ? `<div style="padding: 10px 14px; border: 1px solid var(--accent); background: var(--accent-soft); margin-bottom: 16px; font-size: 12.5px; color: var(--ink); font-weight: 600;">
      <b>ẤN KÝ LUÂN HỒI HIỆN TẠI:</b> [${esc(karma.title)}] · +${karma.pts} Điểm Thiện Nghiệp sẵn sàng ban phước cho kiếp kế tiếp.
    </div>` : ''}

    <div style="margin-top: 6px;">
      ${treeNodes}
    </div>
  </div>`;

  openSheet('Cây Phả Hệ Luân Hồi Qua Các Kiếp Người', content);
}
function openCountriesSheet() {
  const totBirths = COUNTRIES.reduce((s, c) => s + c.b, 0);
  const sorted = COUNTRIES.slice().sort((a, b) => b.b - a.b);
  
  const rows = sorted.map((c, i) => {
    const rate = ((c.b / totBirths) * 100).toFixed(2);
    const pop = (c.pop / 1000).toFixed(1);
    const name = (typeof COUNTRY_T !== 'undefined' && COUNTRY_T[c.id]) || c.ko || c.id;
    return `<tr class="cty-row" data-name="${name.toLowerCase()}" data-id="${c.id.toLowerCase()}" style="border-bottom: 1px solid var(--rule2); transition: background .15s ease;">
      <td style="padding: 10px 8px; font-weight: 700; color: var(--ink) !important;">${i + 1}. ${name} <span style="font-size: 11.5px; opacity: 0.75; font-weight: 500;">(${c.id})</span></td>
      <td style="padding: 10px 8px; text-align: right; font-family: var(--f-mono); font-weight: 700; color: var(--ink) !important;">${rate}%</td>
      <td style="padding: 10px 8px; text-align: right; font-family: var(--f-mono); color: var(--ink) !important; font-weight: 600;">${pop} tr</td>
      <td style="padding: 10px 8px; text-align: right; font-family: var(--f-mono); color: var(--ink) !important; font-weight: 600;">${c.le} tuổi</td>
      <td style="padding: 10px 8px; text-align: right; font-family: var(--f-mono); color: var(--ink) !important; font-weight: 600;">${(c.ppp || 0).toLocaleString()}</td>
    </tr>`;
  }).join('');

  const content = `<div style="max-height: 70vh; overflow-y: auto; color: var(--ink);">
    <p style="font-size: 13.5px; color: var(--ink) !important; font-weight: 500; margin-top: 0; line-height: 1.5; opacity: 0.9;">Dữ liệu thống kê thực tế từ 172 quốc gia (UN World Population Prospects, WHO, World Bank). Bấm vào từng quốc gia để xem tỷ lệ sinh và mức sống.</p>
    <input type="text" id="ctySearchInput" placeholder="🔍 Tìm kiếm quốc gia (VD: Việt Nam, Mỹ, Nhật, Đức...)" style="width: 100% !important; max-width: 100% !important; box-sizing: border-box; padding: 10px 14px; margin-bottom: 12px; font-size: 14px; border: 1px solid var(--rule); border-radius: 6px; background: var(--paper) !important; color: var(--ink) !important; font-weight: 500; outline: none;">
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: var(--ink) !important;">
        <thead>
          <tr style="border-bottom: 2px solid var(--rule); font-size: 12.5px; color: var(--ink) !important; font-weight: 700; text-align: left; background: var(--card2);">
            <th style="padding: 8px;">Quốc gia</th>
            <th style="padding: 8px; text-align: right;">Tỷ lệ sinh</th>
            <th style="padding: 8px; text-align: right;">Dân số</th>
            <th style="padding: 8px; text-align: right;">Tuổi thọ</th>
            <th style="padding: 8px; text-align: right;">GDP (PPP)</th>
          </tr>
        </thead>
        <tbody id="ctyTableBody">
          ${rows}
        </tbody>
      </table>
    </div>
  </div>`;

  openSheet('Thống kê 172 Quốc gia trên Thế giới', content);

  // Hook instant search filter
  setTimeout(() => {
    const inp = document.getElementById('ctySearchInput');
    if (inp) {
      inp.focus();
      inp.addEventListener('input', function() {
        const q = this.value.trim().toLowerCase();
        const trs = document.querySelectorAll('.cty-row');
        trs.forEach(tr => {
          const nm = tr.getAttribute('data-name') || '';
          const id = tr.getAttribute('data-id') || '';
          tr.style.display = (!q || nm.includes(q) || id.includes(q)) ? '' : 'none';
        });
      });
    }
  }, 100);
}
function openSheet(title, inner) {
  const sh = $('#sheet');
  sh.innerHTML = `<div class="dec" role="dialog" aria-modal="true" aria-labelledby="sheetT"><div class="hd"><span id="sheetT">${title}</span><button class="sheet-x" id="sheetClose">Đóng</button></div><div class="bd">${inner}</div></div>`;
  sh.hidden = false;
}
function closeSheet() { UI.sheetBack = null; $('#sheet').hidden = true; $('#sheet').innerHTML = ''; }
function sheetX() { const f = UI.sheetBack; closeSheet(); if (f) f(); }
const verStr = () => '1.0';
function openChangelog() {
  const list = ({ en: CHANGELOG_EN, ja: CHANGELOG_JA, zh: CHANGELOG_ZH, vi: CHANGELOG_VI, fr: CHANGELOG_FR, th: CHANGELOG_TH }[LANG] || CHANGELOG);
  const draw = l => `<ul class="cl">${l.map(c => `<li><b>v${esc(c.v)}</b><span>${esc(c.d)}</span><ul>${c.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></li>`).join('')}</ul>`;
  track('changelog_open');
  if (list.length) { openSheet("Ghi chú cập nhật", draw(list)); return; }
  openSheet("Ghi chú cập nhật", `<p class="cl-wait" id="clWait">${"Đang tải…"}</p>`);
  const fill = h => { const w = $('#clWait'); if (w && !$('#sheet').hidden) w.outerHTML = h; };
  fill(`<p class="cl-wait">${"Chưa có ghi chú cập nhật."}</p>`);
}
let toastT = null;
const READ_CPS = { ko: 9, en: 15, ja: 7, zh: 5, vi: 14, fr: 14, th: 12 };
const readMs = s => Math.min(12000, 1500 + [...String(s || '')].length / (READ_CPS[LANG] || 12) * 1000);
function toastHide() { clearTimeout(toastT); const t = $('#toast'); if (t) t.hidden = true; }
function toast(msg, ms = 3200) { const t = $('#toast'); t.textContent = capS(msg); t.hidden = false; clearTimeout(toastT); toastT = setTimeout(toastHide, Math.max(ms, readMs(t.textContent))); }
function copyText(text, msg) {
  const fallback = () => {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) { } ta.remove();
    toast(ok ? msg : "Không sao chép được ở đây. Hãy nhấn giữ đoạn văn để tự sao chép.");
  };
  try { navigator.clipboard.writeText(text).then(() => toast(msg), fallback); } catch (e) { fallback(); }
}
const QSHORT = ['', "một gia đình thuộc nhóm nghèo nhất", "một gia đình không mấy dư dả", "một gia đình bình thường", "một gia đình khá giả", "một gia đình thuộc nhóm giàu nhất"];
const SHARE_ASK = () => ["Giữa 8 tỷ người, bạn sẽ chào đời là ai?", "Nếu là bạn, bạn sẽ chào đời ở đâu, và là ai?", "Bạn nghĩ mình sẽ chào đời ở đâu?", "Cuộc đời duy nhất của bạn sẽ bắt đầu ở đâu?"];
const shareSeed = k => hashStr((S.name && S.name.full || '') + S.born + (S.deathAt ? S.deathAt.age : '') + k);
function xLen(t) { let n = 0; for (const ch of String(t)) { const c = ch.codePointAt(0); n += c <= 0x10FF || (c >= 0x2000 && c <= 0x200D) || (c >= 0x2010 && c <= 0x201F) || (c >= 0x2032 && c <= 0x2037) ? 1 : 2; } return n; }
const SHARE_LEAD = new Set(['star', 'odds', 'dream', 'road', 'said', 'pt', 'lands']);
const SHARE_NOTE_MAX = () => 120;
function shareNoteOut() { const t = String((S && S.shareNote) || '').replace(/\s+/g, ' ').trim().slice(0, SHARE_NOTE_MAX()); return t && !CRISIS_RE.test(t.normalize('NFC').toLowerCase()) ? t : ''; }
function shareJob() { const id = S.retired || !JOBS[S.job] ? S.flags.lastJob : S.job; return S.age >= 18 && JOBS[id] && !['student', 'seeking', 'childwork', 'service', 'homemaker', 'prison', 'retired'].includes(id) ? frSx(shortJob(id), S.sex) : ''; }
function shareHooks() {
  if (UI.shHk && UI.shHk.s === S && UI.shHk.e === S.endD) return UI.shHk.v;
  const v = shareHooks0(); UI.shHk = { s: S, e: S.endD, v }; return v;
}
function shareHooks0() {
  const d = S.deathAt, age = d.age, suic = d.cause === 'suic', out = [];
  const add = (id, t, s, o, g) => { if (t) out.push({ id, t, s, o, g: g || id, v: s + (shareSeed(id) % 1000) / 400 }); };
  const st = S.log.filter(e => e.star && e.a > 0 && ['big', 'warm', 'loss', 'ev', 'hist'].includes(e.kind) && !e.nf && !e.egg && !e.set && e.d !== 'suic' && !END_SKIP_D.has(e.d)).pop();
  if (st) { const t = endClean(st.text).replace(L_CJK ? /。$/ : /^$/, ''); if (t && t.length <= (150)) add('star', L`기억하고 싶은 순간, ${st.a}세: “${t}”`, 30, 30 + st.a / 1000); }
  const jobN = shareJob(), kd = S.flags.kidDream, D = kd && OWN_DREAM()[kd];
  if (D && age >= 22) {
    if (S.job === kd || S.flags.lastJob === kd) add('dream', L`어릴 적 꿈은 ${D}. 그 꿈을 이뤘다.`, 9, 20, 'work');
    else if (S.flags.dreamGot === kd) add('dream', L`어릴 적 꿈은 ${D}. 한때 그 일을 하기도 했다.`, 7, 20, 'work');
    else if (jobN) add('dream', L`어릴 적 꿈은 ${D}, 마지막 일은 ${jobN}.`, 4.5, 20, 'work');
  }
  const rd = age >= 18 ? lifeRoad() : null;
  if (rd && rd.k !== 'lands') add('road', L`${rd.t}이었다.`, rd.k === 'work' ? 4 : rd.k === 'kids' ? 1.5 : 10, 24, rd.k === 'work' ? 'work' : rd.k === 'kids' ? 'kin' : 'road');
  const path = countryPath();
  if (path.length >= (S.adopt && S.adopt.mv != null ? 3 : 2)) add('lands', L`${path.join(' → ')}에서 살았다.`, 4 + Math.min(4, path.length), 22);
  const tl = (S.flags.talShown || [])[0], TL = { st: "Từ nhỏ đã có năng khiếu học tập.", bd: "Từ nhỏ đã có năng khiếu thể thao, vận động.", ar: "Từ nhỏ đã có năng khiếu vẽ.", mu: "Từ nhỏ đã có năng khiếu âm nhạc.", hd: "Từ nhỏ đã khéo tay hơn người.", wd: "Từ nhỏ đã khéo léo trong cách đối xử với mọi người." };
  if (tl && TL[tl] && age >= 15) add('tal', TL[tl], 2.5, 18);
  const hb = (S.hobbies || []).filter(h => h.lv >= 4 && h.since != null && h.since <= 25 && !HOB_TALK_NO.has(h.id)).sort((x, y) => y.lv - x.lv)[0];
  if (hb && age >= 35) add('hob', L`평생 ${eul(hobbyName(hb.id))} 놓지 않았다.`, 3, 26);
  if (age >= 18) {
    const o = peopleOf(S, age), P = S.fam.partner, y = o.pY;
    if (P && y >= 30 && (o.pt === 'now' || o.pt === 'lost')) {
      const w = o.pU === 'm' ? (P.sex === 'F' ? 'w' : 'h') : 'p';
      const T = o.pt === 'now' ? { w: L`아내와 ${y}년을 함께 살았다.`, h: L`남편과 ${y}년을 함께 살았다.`, p: L`사랑하는 사람과 ${y}년을 함께 살았다.` }
        : { w: L`아내와 ${y}년을 함께하다 먼저 떠나보냈다.`, h: L`남편과 ${y}년을 함께하다 먼저 떠나보냈다.`, p: L`사랑하는 사람과 ${y}년을 함께하다 먼저 떠나보냈다.` };
      add('pt', T[w], 2 + Math.min(5, (y - 30) / 5), 30);
    }
  }
  const g = S.flags.grand || 0, gg = S.flags.ggrand || 0, k = kidsCount();
  if (g >= 3) add('kin', gg === 1 ? L`손주 ${g}명, 증손주 한 명을 보았다.` : gg ? L`손주 ${g}명, 증손주 ${gg}명을 보았다.` : L`손주 ${g}명을 보았다.`, 3 + Math.min(4, g / 3) + (gg ? 2 : 0), 40);
  else if (k >= 3) add('kin', L`아이 ${k}명을 키웠다.`, 3, 40);
  { let b = null; for (const y of S.years) if (y.mk !== 'death' && (!b || y.h > b.h)) b = y;
    if (b && b.a >= 13 && HAPPY_WHY[b.mk]) add('happy', L`가장 행복했던 해는 ${b.a}세, ${HAPPY_WHY[b.mk]}였다.`, 4, 34); }
  if (!suic && age >= 18) {
    const o = endSaidBits(age);
    if (o && o.rel) {
      const m = S.endD && S.endD.said && String(S.endD.said).match(/[“「]([^”」]+)[”」]|«[\s\u00a0]?([^»]+?)[\s\u00a0]?»/);
      let w = (m ? m[1] || m[2] : o.what).replace(/[.。]$/, ''); 
      add('said', L`장례식에서 ${eun(o.who)} 나를 “${w}”이라고 기억했다.`, 3.5, 50, 'end');
    }
    const lw = S.endD && S.endD.last && String(S.endD.last).match(/[“「][^”」]+[”」]|«[^»]+»/);
    if (lw) add('last', L`마지막으로 ${lw[0]}라고 말했다.`, 2.5, 52, 'end');
  }
  const longer = survL(S.born, S.sex)[Math.min(111, age + 1)];
  add('odds', L`같은 해 태어난 아이 중 ${pctStr(longer)}가 나보다 오래 산다.`, longer < 0.12 || longer > 0.75 ? 5 : 2.5, 60);
  if (S.comps && S.comps.length) add('comps', L`같은 1초에 태어난 ${S.comps.length}명은 각각 ${ageList(S.comps.map(c => c.death.age))}까지 살았다.`, 3, 65);
  out.sort((x, y) => y.v - x.v);
  const seen = new Set(); return out.filter(h => !seen.has(h.g) && seen.add(h.g));
}
function shareText(mode) {
  const d = S.deathAt, b = BB(); if (!d) return '';
  const bu = S.bornUrban != null ? S.bornUrban : S.urban, bc = S.bornCity || (S.cur === S.born ? S.city : null);
  const ad = typeof adoptFrom === 'function' && adoptFrom(), A = S.adopt;
  const place = ad ? (A.urb0 && A.city0 ? cityIn(CBY[ad].ko, A.city0) : L`${CBY[ad].ko} 농촌 마을`) : bu && bc ? cityIn(b.ko, bc) : L`${b.ko} 농촌 마을`;
  const kid = S.sex === 'F' ? "bé gái" : "bé trai", age = d.age, cause = d.label.replace(/ \(.*\)$|（.*）$/, ''), suic = d.cause === 'suic';
  const parts = [], P = (t, p, o) => { if (t) parts.push({ t, p, o }); };
  const hooks = shareHooks().slice(0, 3), has = id => hooks.some(h => h.id === id);
  P(shareNoteOut(), 0, 0);
  P((S.era === 'past' ? L`(${S.by}년생)` + ' ' : '') + (transLived() && !ad ? L`${place}의 ${QSHORT[S.q]}에서 태어났다.` : L`${place}의 ${QSHORT[ad && A.q0 ? A.q0 : S.q]}에서 ${ro(kid)} 태어났다.`), 1, 10);
  if (ad) P(L`${CBY[S.born].ko}의 가정에 입양되었다.`, 2, 11);
  if (S.cur !== S.born && !has('lands')) P(L`${ro(CBY[S.cur].ko)} 이주했다.`, 6, 12);
  hooks.forEach((h, i) => P(h.t, [2.5, 4, 5][i], i || shareNoteOut() || !SHARE_LEAD.has(h.id) ? h.o : 5));
  const jobN = has('dream') || has('road') ? '' : shareJob(), jw = lcVi(jobN);
  P(age === 0 ? (suic ? "Qua đời trước sinh nhật đầu tiên." : L`첫 생일을 맞기 전에 ${ro(cause)} 세상을 떠났다.`)
    : S.retired && age >= 50 ? (suic ? L`은퇴한 뒤 ${age}세에 세상을 떠났다.` : L`은퇴한 뒤 ${age}세에 ${ro(cause)} 세상을 떠났다.`)
    : jobN ? (suic ? L`${jw} 일하다가 ${age}세에 세상을 떠났다.` : L`${jw} 일하다가 ${age}세에 ${ro(cause)} 세상을 떠났다.`)
    : suic ? L`${age}세에 세상을 떠났다.` : L`${age}세에 ${ro(cause)} 세상을 떠났다.`, 1, 45);
  if (S.farewell) P(`“${S.farewell}”`, 2, 70);
  if (S.memId) P("Mình đã đưa cuộc đời này vào Nhà tưởng niệm. Ghé xem căn phòng và album ảnh nhé.", 6, 75);
  const ask = SHARE_ASK(); P(ask[shareSeed('ask') % ask.length], 3, 90);
  const x = mode === 'x', len = x ? xLen : t => [...t].length, tag = "#VoHanTrungSinh", url = '';
  const lim = x ? 256 : 480; let used = len(tag) + 1 + (url ? len(url) + 1 : 0);
  const keep = [];
  for (const q of parts.slice().sort((u, v) => u.p - v.p)) { const n = len(q.t) + 1; if (q.p <= 1 || used + n <= lim) { keep.push(q); used += n; } }
  const lines = keep.sort((u, v) => u.o - v.o).map(q => q.t);
  if (keep.length && keep[keep.length - 1].o === 90) lines[lines.length - 1] += ' ' + tag; else lines.push(tag);
  return lines.join('\n') + (url ? '\n' + url : '');
}
function shareNotePh() {
  const d = S.deathAt, age = d.age, o = age >= 18 ? peopleOf(S, age) : {}, kd = S.flags.kidDream, W = (S.stats && S.stats.fY) || {}, sp = [];
  if (d.cause === 'suic') return "VD: Muốn nhớ thật lâu câu chuyện của người này";
  if (age < 18) return age < 6 ? "VD: Cuộc đời ngắn ngủi quá, thật đau lòng" : "VD: Ra đi sớm quá, thật đau lòng";
  if (o.pY >= 30 && (o.pt === 'now' || o.pt === 'lost')) sp.push(L`예) ${o.pY}년을 함께한 사람이 곁에 있어서 다행이었다`);
  if ((S.flags.grand || 0) >= 3) sp.push("VD: May mà đã kịp nhìn mặt hết các cháu");
  if (kd && age >= 22) sp.push(S.job === kd || S.flags.lastJob === kd ? "VD: Ước mơ thuở nhỏ thành hiện thực, tự nhiên thấy rưng rưng" : "VD: Không giống ước mơ, nhưng đã sống hết mình");
  if (S.cur !== S.born || countryPath().length >= 2) sp.push("VD: Một cuộc đời đã trụ vững đến cùng nơi đất khách");
  if (age >= 90) sp.push(L`예) ${age}년, 정말 긴 여행이었다`);
  if ((W.work || 0) >= 15) sp.push("VD: Cứ như cả đời chỉ biết làm việc, thấy day dứt");
  if ((W.family || 0) >= 15) sp.push("VD: Vui vì cuộc đời này được ở gần gia đình thật lâu");
  if (S.q <= 1) sp.push("VD: Khởi đầu từ một trong những gia đình nghèo nhất mà đi được đến đây");
  const all = sp.length ? sp : ["VD: Ai ngờ những ngày bình thường lại quý giá đến thế", "VD: Chỉ vì nơi sinh ra mà cuộc đời khác nhau đến vậy", "VD: Lần sau phải liên lạc với những người mình thương thường xuyên hơn"];
  return all[shareSeed('ph') % all.length];
}
function shareNoteHTML(id) {
  return `<label class="sh-note-in" for="${id}"><span class="sh-note-l">${"Một dòng cảm nghĩ sau khi sống cuộc đời này (không bắt buộc)"}</span>
    <textarea id="${id}" data-shnote="1" maxlength="${SHARE_NOTE_MAX()}" rows="2" placeholder="${esc(shareNotePh())}">${esc((S && S.shareNote) || '')}</textarea>
    <small>${"Nếu bạn viết, dòng này sẽ đứng đầu bài chia sẻ."}</small></label>`;
}
function shareNoteInput(el) {
  S.shareNote = el.value.slice(0, SHARE_NOTE_MAX());
  for (const o of document.querySelectorAll('[data-shnote]')) if (o !== el) o.value = S.shareNote;
  const t = $('#shareText'); if (t) t.textContent = shareText();
  const pv = $('#shPrev'); if (pv) pv.textContent = shareText();
  clearTimeout(UI.shNoteT); UI.shNoteT = setTimeout(shareNoteSave, 1500);
}
function shareNoteSave() {
  if (!S || !S.deathAt) return;
  const v = String(S.shareNote || '').trim(); S.shareNote = v;
  if (S.lifeAt) { const past = lsGet(PAST_KEY, []), p = past.find(x => x.at === S.lifeAt); if (p && (p.S.shareNote || '') !== v) { p.S.shareNote = v; lsSet(PAST_KEY, past); } }
  if (v && CRISIS_RE.test(v.normalize('NFC').toLowerCase())) crisisNote(v);
}
const shareKind = k => k + (shareNoteOut() ? '-n' : '');
function friendLine() {
  { const w = FRIEND_PATH.match(/^w-([pw][rf][cv][tm])$/), n = w && typeof WISH_NAME === 'function' && WISH_NAME()[w[1]];
    if (n) return L`누군가 살아 본 삶들로 찾은 '내가 바라는 삶'을 건넸어요: ${n}.` + ' ' + "Bạn sẽ sinh ra ở đâu, là ai?"; }
  const m = FRIEND_PATH.match(/^([db])-([A-Z]{3})-(.+)$/); if (!m || !CBY[m[2]]) return '';
  const c = CBY[m[2]], p = m[3].split('-'), sexOf = x => x === 'F' ? "bé gái" : "bé trai", placeOf = x => x === 'u' ? L`${c.ko} 도시` : L`${c.ko} 농촌 마을`;
  if (m[1] === 'd' && p.length >= 3 && /^\d{1,3}$/.test(p[0])) {
    const age = +p[0];
    return L`누군가 한 사람의 삶을 건넸어요. ${placeOf(p[2])}에서 ${ro(sexOf(p[1]))} 태어나 ${age === 0 ? "đã ra đi khi chưa kịp đón sinh nhật đầu tiên" : L`${age}세까지 살았대요`}. 당신은 어디서, 누구로 태어날까요?`;
  }
  if (m[1] === 'b' && p.length >= 4 && /^\d{1,6}$/.test(p[2]) && /^(1[89]\d\d|20\d\d)$/.test(p[3]))
    return L`누군가 ${+p[3]}년, ${placeOf(p[1])}에서 ${ro(sexOf(p[0]))} 태어났어요. 그해 태어난 아기 ${(+p[2]).toLocaleString('vi-VN')}명 중 1명꼴이에요. 당신은 어디서 태어날까요?`;
  if (m[1] === 'b' && p.length >= 3 && /^\d{1,6}$/.test(p[2])) return L`누군가 방금 ${placeOf(p[1])}에서 ${ro(sexOf(p[0]))} 태어났어요. 지금 태어나는 아기 ${(+p[2]).toLocaleString('vi-VN')}명 중 1명꼴이에요. 당신은 어디서 태어날까요?`;
  return '';
}
HOOK.log = e => { if (UI.view === 'lifeview') { addFeed(e); if (e.egg && S && !S.isComp) toast("Bạn đã tìm thấy một bất ngờ được giấu kín (easter egg)! Ngoài đời thật, đây cũng là khoảnh khắc rất hiếm có.", 4600); } };
HOOK.change = () => { UI.dirty = true; };
HOOK.decision = pd => { try { showDecision(pd); } catch (e) { reportCaught(e); if (S) S.pending = null; $('#modal').hidden = true; } };
HOOK.err = e => reportCaught(e);
HOOK.death = () => {
  try { if (!S.replay && S.bxAvoid == null && typeof bxRecent === 'function') S.bxAvoid = bxRecent(); } catch (e) { }
  try { if (!S.endD) S.endD = endingData(); } catch (e) { reportCaught(e); }
  try { recordLife(); lsDel(SAVE_KEY); } catch (e) { reportCaught(e); }
  // Vô Hạn Lưu: Calculate and Save Soul Karma for Next Life (Pillar 6)
  try {
    let karmaPts = 1;
    let karmaType = 'resilience';
    let karmaTitle = 'Ý chí Kiên định';
    if (S.age >= 60) karmaPts += 2;
    if (S.age >= 80) karmaPts += 3;
    if (S.money > 50000000) { karmaPts += 2; karmaType = 'wealth'; karmaTitle = 'Khứu giác Kim tiền'; }
    if (S.edu >= 4 || S.st.sm >= 75) { karmaPts += 2; karmaType = 'scholar'; karmaTitle = 'Tuệ căn Sáng suốt'; }
    if (S.st.so >= 75 || (S.fam.kids && S.fam.kids.length >= 2)) { karmaPts += 2; karmaType = 'social'; karmaTitle = 'Duyên lành Gia tộc'; }
    if (S.flags.vhts_startup_done || S.flags.vhts_legacy_done) karmaPts += 2;
    if (S.job === 'doctor' || S.job === 'nurse' || S.flags.vhts_care_elder) { karmaType = 'healer'; karmaTitle = 'Bàn tay Chữa lành'; }
    if (S.cultivation) {
      karmaPts += (S.cultivation.stage * 3);
      karmaType = 'dao';
      karmaTitle = S.cultivation.stage >= 3 ? 'Kim Đan Tiên Tông' : S.cultivation.stage >= 2 ? 'Trúc Cơ Tiên Giả' : 'Khai Khiếu Đạo Giả';
    }

    const soulData = {
      pts: karmaPts,
      type: karmaType,
      title: karmaTitle,
      lastAge: S.age,
      lastCountry: S.cur,
      lastName: S.name ? S.name.full : 'Vô Danh',
      time: Date.now()
    };
    localStorage.setItem('vhts_soul_karma', JSON.stringify(soulData));
    S.generatedKarma = soulData;
  } catch (e) { console.error('Soul Karma calculation error:', e); }
  setTimeout(() => {
    try { showDeath(); } catch (e) { reportCaught(e); deathFallback(); return; }
    const after = () => { window.scrollTo(0, 0); const h0 = $('#dead h1, #dead h2, #dead button'); if (h0) h0.focus({ preventScroll: true }); if (S && !S.replay && !EDU_ON && !S.flags.sharePop && !(S.deathAt && S.deathAt.cause === 'suic')) { S.flags.sharePop = 1; setTimeout(() => { if (UI.view === 'dead' && $('#sheet').hidden) shareSheet(true); }, 500); } };
    if (S.endD) playEnding(S.endD, { after }).catch(e => { reportCaught(e); closeEnding(); });
  }, 900);
};
HOOK.year = () => { UI.dirty = true;
  if (S && S.age === 6 && S.phase === 'life' && !S.flags.p6 && !S.replay && !UI.prefs.auto && UI.prefs.foUsed && (S.speed >= 8 || S.ff) && focusOptions().length) {
    S.flags.p6 = 1; S.paused = true; S.ff = false; try { renderTop(); } catch (e) { } toast("Bạn đã sáu tuổi. Hãy chọn năm nay dành cho điều gì rồi tiếp tục.", 5000); }
  save(); if (S && [5, 15, 40, 65].includes(S.age)) track('life_progress', { age: S.age, auto: !!UI.prefs.auto }); };