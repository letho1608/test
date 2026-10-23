// js/edu-career.js - Giao duc, nghe nghiep, cham soc, ky nang
const SLEEP_END = ['ihd', 'str', 'dem', 'kid'];
function die(forced, label) {
  const c = studyAway() && CBY[studyAway()] ? CBY[studyAway()] : C();
  const k = forced || pickCause(c, S.age, S.sex);
  const w = causeWeights(c, S.age, S.sex, false); let tot = 0; for (const x in w) tot += w[x];
  const share = w[k] && k !== 'suic' ? w[k] / tot : null;
  S.deathAt = { age: S.age, cause: k, label: label || causeLabel(k, S.age, S.sex) || (typeof CAUSE !== 'undefined' && CAUSE[k]) || 'Tuổi cao sức yếu', share, where: c.id };
  if (ddKept() && S.money < 0) { book(S.flags.ddHome === 'gh' ? "Hỗ trợ của nhà ở nhóm" : "Phần gia đình sống cùng gánh giúp", -S.money); S.money = 0; }
  if (S.age >= 80 && !label && SLEEP_END.includes(k) && chance(0.3)) S.deathAt.sleep = 1;
  const last = S.years[S.years.length - 1];
  if (last && last.a === S.age) last.mk = 'death';
  else S.years.push({ a: S.age, h: Math.round(S.st.h), hl: Math.round(S.st.hl), so: Math.round(S.st.so), sm: Math.round(S.st.sm), nw: Math.round(netWorth()), inc: Math.round(S.income), mk: 'death', cur: studyWhere() || S.cur });
  S.phase = 'dead'; S.queue = []; S.pending = null;
  if (insOn() && S.age >= 18 && S.age < 70 && ((S.fam.married && S.fam.partner && S.fam.partner.alive) || S.fam.kids.some(k => k.alive && S.age - k.bornAt < 25))) {
    const x = incomeAt(C(), 0.5) * 4; S.money += x; log(`Tiền bảo hiểm nhân thọ ${wonStr(x)} đã được chi trả cho gia đình còn lại.`, 'note'); }
  { const hid = S.age >= 30 && NCD_K.find(x => S.conds[x] && S.conds[x].dx === false && NCD_CAUSE[x].includes(k)); if (hid) log(`Trong người có bệnh mãn tính nhưng đến cuối cùng vẫn không được chẩn đoán.`, 'note'); }
  const dl = (S.deathAt.label || 'nguyên nhân tự nhiên').replace(/ \(.*\)$|（.*）$/, '');
  if (k === 'suic') log(`${S.age} tuổi, đã qua đời do tự vẫn.`, 'death', `Tự tử không thể giải thích bằng một lý do duy nhất và có thể phòng ngừa được (WHO) · ${SUIC_HELP()}`);
  else log(k === 'hom' && !label ? `${S.age} tuổi, đã mất đi sinh mạng do bạo lực.` : LOST.has(k) ? `${S.age} tuổi, đã mất vì ${dl}.` : S.age < 5 ? `${S.age} tuổi, đã qua đời vì ${dl}.` : S.deathAt.sleep ? `${S.age} tuổi, đã thanh thản trút hơi thở cuối cùng trong giấc ngủ vì ${dl}.` : `${S.age} tuổi, đã qua đời vì ${dl}.`, 'death');
  HOOK.death();
}
const AWAY_DECS = new Set(['duikey', 'kinback', 'adsearch', 'vocation', 'kidcare', 'kidhome', 'job', 'jobchange', 'biz', 'bizfund', 'bizscale', 'rankup', 'growup', 'ownup', 'apprent', 'selfcode', 'protry', 'mustry', 'acttry', 'arttry', 'boardtry', 'gametry', 'kidout', 'coachq', 'histgo', 'histrg', 'histdemo', 'histjunta', 'histkhm', 'idolaud', 'traineeq',
  'abroad', 'city', 'movenear', 'farmback', 'petq', 'kids', 'infert', 'buy', 'invest', 'nomad', 'hmwork', 'kidwant', 'lend', 'kidq', 'pbiz', 'pstock', 'crime', 'hobby', 'newneighbor', 'dream', 'dreamtry', 'kinask', 'heir', 'kidschool', 'bizop', 'discipline', 'erasmus', 'reunite', 'cosign', 'ptpost', 'parback', 'farsea', 'hsch']);
const SAME_WAY = {
  applpar: k => k === 'par' || S.money >= (S.flags.ap || 0) * (k === 'all' ? 1 : 0.5),
  kidwed: k => (k === 'none' || S.money >= (S.flags.kw || 0) * (k === 'help' ? 1 : 0.25)) && !(k !== 'help' && wayTight('kidwed') && S.money >= (S.flags.kw || 0)),
  kiduni: k => (k === 'self' || S.money >= (S.flags.ku || 0) * (k === 'pay' ? 1 : 0.5)) && !(k !== 'pay' && wayTight('kiduni') && S.money >= (S.flags.ku || 0)),
  babycare: (k, p) => (k === 'gp' || k === 'pay' || k === 'carry') && !(p && p.why),
  kinask: (k, p) => { const kid = !!(p && p.who === 'kid'), amt = S.flags.kinAmt || 0;
    if (kid && k === 'no') return false;
    return (k === 'no' || S.money >= amt * (k === 'give' ? 1 : 0.3)) && !(kid && k === 'some' && wayTight('kinaskKid') && S.money >= amt); },
  remit: k => k === 'no' || S.income > 0,
  diag: k => k !== 'life' || S.flags.diet === 'good' || S.flags.diet == null,
  stepafter: () => true,
  drink: k => k === 'stop',
};
const WAY_KEY = { kinask: p => p && p.who === 'kid' ? 'kinaskKid' : 'kinask' };
const wayKey = (id, p) => WAY_KEY[id] ? WAY_KEY[id](p) : id;
const ASK_EACH = new Set(['kiduni', 'kidwed', 'kinaskKid']);
const WAY_CAN = { kiduni: () => S.money >= (S.flags.ku || 0), kidwed: () => S.money >= (S.flags.kw || 0), kinask: () => S.money >= (S.flags.kinAmt || 0) };
const wayTight = id => !!(S.flags.wayCan && S.flags.wayCan[id] === false);
const PLAIN_LO = 0.2, PLAIN_HI = 0.8;
const PLAIN = {
  job: () => { const O = S.flags.offers; if (!nkLife() || !O || !O.length) return null; const ps = O.map(x => x.pct), lo = Math.min(...ps), hi = Math.max(...ps), w = {};
    O.forEach((o, i) => { w['o' + i] = 0.6 + 1.4 * (hi > lo ? (o.pct - lo) / (hi - lo) : 1); }); return wpick(w); },
  kidschool: () => { if (S.flags.kidSchool != null) return null; const q = kidPrivP(); return q < PLAIN_LO || q > PLAIN_HI ? (chance(q) ? 'priv' : 'pub') : null; },
};
let DEC_Q = false;
const WAR_KID_A = 13;
function openDecision(id, p) {
  const d = DEC[id]; if (!d) return;
  if ((S.serveLeft > 0 || S.job === 'prison' || S.flags.hideCN) && AWAY_DECS.has(id)) return;
  if (rohCamp() && ROH_NO_DEC.has(id)) return;
  if (d.ok && !d.ok(p)) return;
  const ddw = ddWay(id); if (ddw === 'no') return;
  if (WD_NO.has(id) && wdOn()) return;
  if (id === 'reflect' && HOOK.noPause()) { if (typeof reflectQuiet === 'function') reflectQuiet(S.age); return; }
  const view = d.build(p);
  if (view) { for (const f of ['title', 'body', 'fact']) view[f] = capS(view[f]); (view.choices || []).forEach(c => { c.label = capS(c.label); c.sub = capS(c.sub); }); }
  if (!view) { if (/^(school|college|afterUni|phd)/.test(id)) S.flags.between = false; return; }
  const wk = wayKey(id, p), way = SAME_WAY[id] && !(S.flags.askEach && ASK_EACH.has(wk)) && S.flags.way && S.flags.way[wk];
  if (way && (view.choices || []).some(c => c.k === way) && SAME_WAY[id](way, p)) { S.pending = { id, p, view: Object.assign(view, { q: 1 }) }; choose(way); return; }
  const plain = PLAIN[id] && PLAIN[id](p);
  if (plain && (view.choices || []).some(c => c.k === plain)) { S.pending = { id, p, view: Object.assign(view, { q: 1 }) }; choose(plain); return; }
  if (ddw === 'fam' && (view.choices || []).length) { S.pending = { id, p, view: Object.assign(view, { q: 1 }) }; const fk = typeof autoChoice === 'function' ? autoChoice(S.pending) : null; choose(view.choices.some(c => c.k === fk) ? fk : view.choices[0].k); return; }
  if (id === 'war' && S.age < WAR_KID_A && (view.choices || []).length) {
    S.pending = { id, p, view: Object.assign(view, { q: 1 }) }; let fk = typeof autoChoice === 'function' ? autoChoice(S.pending) : null;
    if (!view.choices.some(c => c.k === fk)) fk = view.choices[0].k;
    log(fk === 'flee' ? L`분쟁이 가까워지자 ${iga(parW())} 짐을 꾸려 피난을 떠나기로 했습니다.` : L`분쟁이 가까워졌지만 ${iga(parW())} 집에 남기로 했습니다.`, 'ev');
    choose(fk); return;
  }
  S.pending = { id, p, view };
  HOOK.decision(S.pending);
}
function choose(k, extra) {
  const pd = S.pending; if (!pd) return;
  const quiet = !!pd.view.q;
  S.pending = null; if (!quiet) S.stats.decisions++;
  const d = DEC[pd.id];
  const ch = pd.view.choices.find(x => x.k === k);
  S.done[pd.id] = (S.done[pd.id] || 0) + 1; S.flags['last_' + pd.id] = S.age;
  if (SAME_WAY[pd.id]) { const wk = wayKey(pd.id, pd.p); (S.flags.way = S.flags.way || {})[wk] = k; if (!quiet && WAY_CAN[pd.id]) (S.flags.wayCan = S.flags.wayCan || {})[wk] = WAY_CAN[pd.id](); }
  if (/^(school|college|afterUni|phd)/.test(pd.id)) S.flags.between = false;
  ACT_DEC = { id: pd.id, k, p: pd.p, job: S.job }; ACT_NEXT = null; const n0 = netWorth(); fxStart(); NF_ON = NF_IDS.has(pd.id); DEC_Q = quiet; let r; try { r = d.apply(k, pd.p, extra); } catch (err) { NF_ON = false; throw err; } finally { DEC_Q = false; } bookSince(n0, pd.id === 'buy' && pd.p && pd.p.item ? (pd.p.item === 'house' ? "Hỗ trợ mua nhà" : L`${ITEMS[pd.p.item].n} 구입`) : DEC_BOOK[pd.id] || (pd.view && pd.view.title) || "Khoản khác");
  if (r !== false && ch && !quiet) { LOG_Q = pd.view.title ? String(pd.view.title).slice(0, 90) : null; log(L`결정: ${ch.label}`, 'dec'); }
  if (typeof r === 'string') log(r, 'big');
  else if (r && r.t) log(r.t, r.k || 'big', r.f);
  if (typeof r === 'string' || (r && r.t)) { const e = S.log[S.log.length - 1]; if (e) e.d = pd.id; }
  fxEnd();
  if (r && r.post) r.post();
  ssWedOpen();
  uniCity();
  NF_ON = false; ACT_DEC = null;
  homeYear(false);
  ensureFocus();
  HOOK.change({});
}
const POOL_LIGHT = new Set(['kidwant', 'kidq', 'kidteen', 'lend', 'pstock', 'discipline', 'lotto', 'duikey']);
const poolLight = id => POOL_LIGHT.has(id) || (typeof SMALL !== 'undefined' && !!SMALL[id]) || (typeof HUM !== 'undefined' && !!HUM[id]);
function scheduledDecisions() {
  studyLeft(); uniCity();
  const a = S.age, c = C(), out = [];
  S.flags.between = false;
  if (S.job === 'seeking' && (S.flags.oldLook != null ? (S.flags.seekY || 0) >= 2 || a >= 75 : a >= Math.min(65, retireAge(c) + 3))) { S.job = 'retired'; S.retired = true; S.pension = S.flags.penW != null && a >= retireAge(c) ? S.flags.penW : pensionAmount(); S.income = Math.max(S.pension, S.flags.milPen ? S.flags.milPen.v : 0); log(S.pension > 0 ? "Bạn thôi tìm việc và nghỉ hưu. Bạn sống bằng lương hưu." : "Bạn thôi tìm việc và nghỉ hưu. Bạn sống nhờ tiền tiết kiệm và dựa vào gia đình."); }
  const add = (id, p) => { if (ONE_A_YEAR.includes(id) && out.some(d => d.id === id)) return; out.push({ id, p }); };
  if (S.flags.kidUniQ && S.flags.kidUniQ.length) add('kiduni', { i: S.flags.kidUniQ.shift() });
  if (S.flags.willQ) { S.flags.willQ = 0; if (willOK()) add('will'); }
  if (S.flags.kinQ && S.flags.kinQ.length) add('kinback', S.flags.kinQ.shift());
  if (S.flags.divQ) { S.flags.divQ = 0; if (splitOK()) add('divtalk'); }
  let cBack = 0; if (S.flags.careWait != null && S.flags.careQ == null) { const i = S.flags.careWait; S.flags.careWait = null; if (kidCareNow()) { S.flags.careQ = i; cBack = 1; } else careLater(i); }
  if (S.flags.careQ != null) { const i = S.flags.careQ, again = S.flags.careAgain ? 1 : 0, why = S.flags.careWhy || (!again && S.flags.bcareAuto !== 1 && S.flags.way && S.flags.way.babycare ? careWhy() : null); S.flags.careQ = null; S.flags.careAgain = 0; S.flags.careWhy = null; const kd = S.fam.kids[i]; if (kd && kd.alive && !kidCareNow()) careLater(i); else if (kd && kd.alive && careOpts().length >= 2) add('babycare', again ? { i, again } : why ? { i, why } : cBack ? { i, back: 1 } : { i }); }
  if (S.flags.matQ) { S.flags.matQ = 0; const baby = S.fam.kids[S.fam.kids.length - 1]; if (isWorking() && !inOffice() && baby && baby.alive) add('maternity'); }
  if (!S.major && !S.done.major && (S.school === 'uni' || S.school === 'grad' || S.flags.nightUni)) add('major');
  if (!S.isComp && typeof REFLECT_AGES !== 'undefined' && REFLECT_AGES.includes(a)) add('reflect', {});
  if (mandDue()) add('mandret', {});
  else if (S.flags.rehireEnd && a >= S.flags.rehireEnd) { const same = isWorking() && S.job === S.flags.rehireJob; S.flags.rehireEnd = null; if (same) add('mandret', { end: 1 }); }
  if (S.flags.idolEndQ) { S.flags.idolEndQ = 0; if (S.job === 'idol') add('idolafter'); }
  if (S.flags.skAt != null && a >= S.flags.skAt) { S.flags.skAt = null; if (skKids().length) add('stepin'); }
  if (S.flags.stepAt != null && a >= S.flags.stepAt) { S.flags.stepAt = null; if (stepKids().length) add('stepkids'); }
  if (S.flags.custodyQ) { S.flags.custodyQ = 0; if (custodyKids().length) add('custody'); else S.flags.custOf = null; }
  if (S.flags.skAftQ) { S.flags.skAftQ = 0; if (skAftKids().length) add('stepafter'); }
  if (S.flags.mcrisisQ) { S.flags.mcrisisQ = 0; if (S.fam.married && S.fam.partner && S.fam.partner.alive) add('mcrisis'); }
  if (S.flags.defRouteQ) { S.flags.defRouteQ = 0; if (S.flags.hideCN) add('defroute'); }
  if (S.flags.brokerQ) { S.flags.brokerQ = 0; if (S.cur === 'PRK' && S.job !== 'prison' && !(S.serveLeft > 0)) add('defect', { broker: 1 }); }
  if (S.job === 'prison') { if (S.flags.paroleQ) { S.flags.paroleQ = 0; add('parole'); } return out; }
  if (S.flags.kidWedQ && S.flags.kidWedQ.length) add('kidwed', { i: S.flags.kidWedQ.shift() });
  { const k = S.fam.kids.find(k => k.alive && k.oTell != null && !k.oTold && a - k.bornAt >= k.oTell); if (k && !farFromNK()) add('kidout', { i: S.fam.kids.indexOf(k) }); }
  if (a === 2) add('temper');
  if (a === 26) add('hd_hardwork');
  if (a === 19) add('hd_school');
  if (a === 30) add('hd_migrate');
  if (a === 44) add('hd_care');
  if (a === 62) add('hd_last');
  if (a === 41) add('hd_child_fut');
  if (a === 35 && 'IBH'.indexOf(S.rel || '') >= 0) add('hd_ritual');
  if (a === 22 && S.curse) add('hd_dark');
  if (a === 6) { if (ddLv() >= 2) ddSchoolStart(C()); else startSchool(); }
  if (a === 8 && !S.school && S.edu === 0 && !S.done.noschool) add('noschool');
  if (ddLv() >= 2 && (S.flags.justGrad === 'prim' || S.flags.justGrad === 'lsec' || S.flags.justGrad === 'usec' || S.flags.justGrad === 'voc')) { ddSchoolNext(C(), S.flags.justGrad); S.flags.justGrad = null; }
  if (S.flags.justGrad === 'prim' && a >= 10) { add('school2'); }
  if (S.flags.justGrad === 'lsec') { add('school3'); }
  if (S.flags.boardPro && S.flags.boardPro.wait && !S.school && S.flags.justGrad !== 'prim' && S.flags.justGrad !== 'lsec' && S.job !== 'prison' && S.serveLeft === 0) { boardStart(); log(boardGame() === 'go' ? "Học xong, bạn bắt đầu toàn tâm thi đấu với tư cách kỳ thủ cờ vây chuyên nghiệp." : "Học xong, bạn bắt đầu toàn tâm cho các giải đấu với tư cách kỳ thủ cờ vua.", 'big'); }
  if (S.flags.gamer && S.flags.gamer.wait && !S.school && S.flags.justGrad !== 'prim' && S.flags.justGrad !== 'lsec' && S.job !== 'prison' && S.serveLeft === 0) { gamerStart(); log("Học xong, bạn bắt đầu toàn tâm thi đấu với tư cách tuyển thủ thể thao điện tử chuyên nghiệp.", 'big'); }
  if (S.flags.gameEndQ) { S.flags.gameEndQ = 0; if (S.flags.gamer && S.flags.gamer.end && !S.flags.gamer.after && S.serveLeft === 0) add('gameafter'); }
  if ((S.flags.justGrad === 'usec' || S.flags.justGrad === 'voc') && S.job !== 'idol' && S.job !== 'boardpro' && S.job !== 'progamer' && !gamerOn() && S.job !== 'prison') { add('college'); }
  if (S.flags.retakeAt != null && a >= S.flags.retakeAt && S.serveLeft === 0) { S.flags.retakeAt = null; if (!S.school && (S.job === 'student' || S.job === 'seeking') && a <= 25 && !S.fam.married) add('college', { re: S.flags.retakeN || 1 }); }
  if (S.flags.justGrad === 'uni' && S.job !== 'idol' && S.job !== 'boardpro' && S.job !== 'progamer') { out.unshift({ id: 'afterUni' }); }
  const eduDec = out.some(d => /^(school\d|college|afterUni|phd)$/.test(d.id));
  if (eduDec) S.flags.between = true;
  if (S.flags.justGrad === 'grad' && S.job !== 'idol') { const ph = phdOK() && chance(phdAsk());
    if (S.flags.studyAbroad && !S.mig) { out.unshift({ id: 'gradAbroadEnd' }); if (ph) out.unshift({ id: 'phd' }); } else if (ph) add('phd');
    add('job', { first: 1 }); }
  if (S.flags.justGrad === 'phd' && S.job !== 'idol') { if (S.flags.studyAbroad && !S.mig) out.unshift({ id: 'gradAbroadEnd' }); add('job', { first: 1 }); }
  S.flags.justGrad = null;
  const cmA = cmMinAge(), cmN = 18 - cmA;
  if (S.sex === 'F' && a >= cmA && a <= 17 && !S.fam.married && !S.done.cmarry && chance(1 - Math.pow(1 - Math.min(0.95, B().cm / 100 * clamp(2.1 - (B().cm - 30) * 0.04, 1.6, 2.1)), 1 / cmN))) add('cmarry');
  const cs = C().cs;
  if (!S.served && (S.job === 'soldier' || (S.exp && S.exp.soldier && S.exp.soldier[0] >= 1))) S.served = true;
  if (cs && papersOK() && !S.dis && !S.dd && !S.flags.acad && !(S.cur === 'ISR' && (S.rel === 'M' || S.rel === 'C')) && !S.served && (!S.done.service || (S.flags.svcDelay != null && a > S.flags.svcDelay)) && S.serveLeft === 0 && a >= (S.cur === 'PRK' ? 17 : 19) && a <= (S.job === 'idol' || S.flags.exIdol || S.job === 'progamer' || S.flags.svcDelay != null ? 28 : 24) && !(S.job === 'idol' && a < 27) && !(S.job === 'progamer' && a < 25) && !S.mig && (!S.school || svcMidUni()) && !eduDec) {
    const months = S.sex === 'M' ? cs[0] : cs[1];
    if (months > 0 && (cs[2] === 'u' || csPicked())) {
      if (S.cur === 'KOR' && S.sex === 'M' && krSvcKind() === 'ex') { S.done.service = 1; S.flags.svcDelay = null; log("Bạn đã đi khám tuyển nghĩa vụ quân sự nhưng không phải nhập ngũ. Những năm ấy, số người thuộc diện nghĩa vụ nhiều hơn hẳn số quân mà quân đội cần.", 'ev'); }
      else add('service', { months, kr: S.cur === 'KOR' && S.sex === 'M' ? krSvcKind() : null });
    }
  }
  if (ncoAskOK(a) && chance(0.15)) add('nco');
  if (S.job === 'seeking' && S.flags.reSeek != null && a - S.flags.reSeek >= 4) { S.flags.reSeek = null; S.job = 'homemaker'; log("Bạn tìm việc suốt mấy năm nhưng không có chỗ nào phù hợp. Bạn lại quay về lo việc nhà.", 'bad'); }
  const reSeekNo = S.job === 'seeking' && S.flags.reSeek != null && !chance(S.sex === 'F' ? ({ sa: 0.3, mena: 0.35 }[c.p] || 0.65) : 0.7);
  let ddH = 'yes';
  if (a >= 15 && !eduDec && !reSeekNo && stage() === 'adult' && (S.job === 'seeking' || S.job === 'childwork' || S.job === 'student') && !S.school && S.serveLeft === 0 && !(S.flags.sickOut != null && chance(0.7))
    && !(S.flags.disRestTo != null && a < S.flags.disRestTo) && !(disOn() && S.job === 'seeking' && chance(disMiss(c))) && !wdOn() && (ddH = ddHire(c)) !== 'no' && !(S.job === 'seeking' && chance(0.5 * recW()))) add('job', ddH === 'sup' ? { sup: 1 } : {});
  if (a >= 12 && a < 15 && !S.school && !eduDec && S.job === 'student') toChildwork();
  const afm = S.sex === 'M' ? afmM(c) + AFM_D : afmF(c);
  if (a >= 18 && a <= (wasMarried() || S.flags.meetAt != null ? 80 : 75) && !S.fam.married && !S.fam.dating && !(S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced) && S.serveLeft === 0 && !S.flags.celib) {
    const everP = c.p === 'hi' && !wedAll(c) ? 0.8 : c.p === 'eca' ? 0.9 : 0.95;
    const lead = loveFirst(c) ? dateLead(c) : c.p === 'ssa' ? 1.2 : 0, am = afm - lead;
    const hz = wasMarried() ? (a < 45 ? 0.14 : a < 60 ? 0.06 : a < 70 ? 0.03 : 0.015) * (S.fam.widowed && S.sex === 'F' ? 0.5 : 1) * (lead ? 1.4 : 1) : a < am - 4 ? (S.sex === 'M' && a < am - 8 ? 0.008 : 0.03) : a < am + 6 ? 0.28 * (lead ? DATE_K : 1) : a < 45 ? 0.1 * (lead ? DATE_K : 1) : a < 60 ? 0.03 : 0.012;
    const MX = S.flags.mx;
    if (MX && (a > MX.to || MX.left <= 0)) { if (MX.left > 0 && MX.next != null && !MX.dt) log(MATCH_CO.has(c.id) ? "Thời hạn hội viên ở công ty mai mối hôn nhân đã hết. Bạn không nhận được những lần giới thiệu còn lại." : "Thời gian đã nhờ người mai mối đã qua, bạn không nhận được những lần giới thiệu còn lại."); S.flags.mx = null; }
    if (S.flags.mx && MX.next == null) MX.next = a + 1;
    if (S.flags.mx && a >= MX.next) { MX.next = null; MX.left--; add('partner', { meet: 1, k: 'match', mxn: MX.n - MX.left, mxl: MX.left === 0 ? 1 : 0 }); }
    else if (S.flags.meetAt != null && a - S.flags.meetAt === 1) {
      const mk = S.flags.meetK; S.flags.meetAt = null; S.flags.meetK = null;
      const pm = mk === 'intl' ? 0.6 : mk === 'match' ? 0.85 : mk === 'wide' ? (S.sex === 'M' ? clamp(0.45 + (S.pct - 0.5) * 0.4 - (a >= 70 ? 0.15 : 0), 0.2, 0.65) : 0.35) : mk === 'ss' ? 0.6 : 0.7;
      if (chance(pm)) add('partner', mk ? { meet: 1, k: mk } : { meet: 1 });
      else if (mk === 'match') log("Bạn được giới thiệu vài lần nhưng không gặp ai hợp ý.");
      else if (mk === 'wide') log("Những cuộc gặp gỡ chênh lệch tuổi tác lớn không dễ đi đến đâu.");
      else if (mk === 'intl') log("Bạn đã gặp vài người đến từ các nước khác, nhưng không thành duyên.");
    }
    else if (chance(hz * (everP + 0.1) * (disOn() ? 0.7 : 1) * ddLoveK() * (wdOn() ? 0.1 : 1) * orientK() * soloK(c, a) * (S.flags.ptNo ? (a - S.flags.ptNoAt <= 1 ? 0.35 : 1) * Math.pow(0.8, Math.min(S.flags.ptNo, 5)) : 1))) add('partner');
  }
  if (S.flags.meetAt != null && a - S.flags.meetAt >= 1) { S.flags.meetAt = null; S.flags.meetK = null; }
  if (S.flags.mx && (S.fam.married || S.flags.celib)) S.flags.mx = null;
  if (S.flags.mx && S.fam.dating) S.flags.mx.dt = 1;
  if (S.flags.wedQ) { S.flags.wedQ = 0; if (S.fam.dating && !S.fam.married) add('wedtalk'); }
  if (S.flags.disAdjQ) { S.flags.disAdjQ = 0; if (S.dis && a >= 18) add('disadj'); }
  if (S.flags.disAidQ) { S.flags.disAidQ = 0; if (S.dis && !S.dis.aid) add('disaid'); }
  if (S.flags.mindHelpQ) { S.flags.mindHelpQ = 0; if (S.mind && S.mind.way === 'alone') add('mindhelp'); }
  if (S.flags.datePregQ) { S.flags.datePregQ = 0; if (S.fam.dating && !S.fam.married) add('datepreg'); }
  { const P = S.fam.partner;
    if (S.fam.married && P && P.alive && P.cohab && !P.divorced && a >= 18 && a - (S.fam.marriedAt || a) >= 1 && (S.flags.last_cohabwed == null || a - S.flags.last_cohabwed >= 3) && chance(0.15 * (LIVEIN_C[c.id] ? LIVEIN_C[c.id].wed : 1))) add('cohabwed'); }
  settleYear(a, add);
  if (S.flags.adoptAt != null && a >= S.flags.adoptAt) {
    S.flags.adoptAt = null;
    if (adoptOK(true) && chance(adoptP())) { S.flags.adoptKid = adoptChild(); add('adopt'); }
    else if (adoptOK(true)) log("Lần này việc nhận con nuôi chưa thành. Có rất nhiều gia đình đang chờ.", 'note');
  }
  if (S.fam.married && S.fam.partner && S.fam.partner.alive && a >= 30 && a <= 48 && S.fam.marriedAt != null && a - S.fam.marriedAt >= 5 && !S.fam.kids.some(k => k.alive) && !S.done.adoptq && S.flags.adoptAt == null && !ptAway() && chance(0.04)) add('adoptq');
  polyAsk(c, a, add);
  ssYear(c);
  heirCheck(add);
  hschAsk(c, a, add);
  kinAsk(c, a, add);
  { const k5 = S.fam.kids.findIndex(k => k.alive && S.age - k.bornAt === 5 && !k.sk); if (k5 >= 0 && (S.flags.kidSchool == null || (S.flags.kidSchool === 'priv' && !privAfford())) && privShare(c) >= 0.03 && !S.refugee && S.job !== 'prison') add('kidschool', { i: k5 }); }
  oldHomeYear();
  if (a >= 72 && S.flags.oldHome !== 'kid' && S.flags.oldHome !== 'care' && (S.done.oldhome || 0) < 3 && (S.flags.last_oldhome == null || a - S.flags.last_oldhome >= 6) && S.job !== 'prison' && !S.refugee && !S.flags.hideCN
    && !homeOthers().kids.length && (!(S.fam.married && S.fam.partner && S.fam.partner.alive) || S.st.hl < 40) && chance(S.st.hl < 45 ? 0.45 : 0.2)) add('oldhome');
  const talked = S.flags.kidTalkAt != null && a > S.flags.kidTalkAt; if (talked) S.flags.kidTalkAt = null;
  if (talked && kidTalkOK() && !S.flags.tryK && kidsApartK() > 0) add(S.fam.partner.ss ? 'sskids' : 'kids', { talk: 1 });
  const talked2 = S.flags.w2TalkAt != null && a > S.flags.w2TalkAt; if (talked2) S.flags.w2TalkAt = null;
  if (talked2 && w2TalkOK()) add('kids', { talk: 1, w2: 1 });
  if (tryingYear(a, c) === 'ask') add('infert');
  if (!talked && S.fam.married && S.fam.partner && S.fam.partner.alive && S.fam.partner.ss) {
    const P = S.fam.partner, y = a - (S.fam.marriedAt != null ? S.fam.marriedAt : a);
    if (y >= 2 && Math.min(a, P.age) < 46 && (S.done.sskids || 0) < 3 && (S.flags.last_sskids == null || a - S.flags.last_sskids >= 3) && S.flags.adoptAt == null && ssKidWays() && !ptAway() && chance(0.3)) add('sskids');
  }
  else if (!talked && S.fam.married && S.fam.partner && S.fam.partner.alive) {
    const fa = S.sex === 'F' ? a : S.fam.partner.age;
    if (fa < 45 && !mpPast() && S.flags.noKidsM !== (S.fam.marriages || 1) && !S.flags.tryK && (S.flags.last_kids == null || a - S.flags.last_kids >= 2)) {
      const nk = ownKids().length;
      const want = kidsW(c);
      const p = nk === 0 ? 0.75 : clamp(kidsA(c) * (want - nk) / Math.max(1, want), 0.06, 0.6) * eraKidsK(c);
      if (chance(p * kidsApartK())) add('kids');
    }
  }
  const pool = [];
  if (S.flags.smokeLate != null && a >= S.flags.smokeLate) { S.flags.smokeLate = null; if (!AGE12 && !S.smoker && S.job !== 'prison') { S.smoker = true; log("Lúc ấy bạn đã từ chối, nhưng một hai năm sau, giữa đám bạn hay chơi cùng, rốt cuộc bạn vẫn bắt đầu hút thuốc.", 'ev', "Ngay cả những thiếu niên nói sẽ không hút dù bạn bè mời, khoảng 13% vẫn hút thử trong vòng hai năm." + ' ' + "Khoảng 60% người đã hút thử sẽ trở thành người hút thuốc hằng ngày (Aleyan và cộng sự, BMJ Open 2018; Birge và cộng sự, Nicotine Tob Res 2018)"); } }
  if (!AGE12 && S.age >= 13 && S.age <= 24 && !S.smoker && !S.done.smoke) { const sp = (S.sex === 'F' ? c.sf : c.sm) / 100; if (chance(sp * 0.35)) pool.push(['smoke', {}]); }
  if (S.smoker && a >= 25 && (S.flags.last_quit == null || a - S.flags.last_quit >= 6) && chance(0.25)) pool.push(['quit', {}]);
  const few = !!ALC_12M[c.id];
  if (!AGE12 && a >= 18 && a <= 65 && !S.alc && (S.flags.last_drink == null || a - S.flags.last_drink >= 6) && (!few || drinker()) && chance(audMe(c) * (S.sex === 'M' ? 1.6 : 0.2) * (stressed() ? 3 : 0.7) * 0.9 / (few ? drinkP(c) : 1))) pool.push(['drink', {}]);
  if (S.alc && S.alc.y >= 2 && (S.flags.last_alcquit == null || a - S.flags.last_alcquit >= 2) && chance(0.5)) pool.push(['alcquit', {}]);
  if (lottoOK() && S.flags.lotto == null && (S.done.lotto || 0) < 2 && (S.flags.last_lotto == null || a - S.flags.last_lotto >= 10) && a <= 75 && chance(0.03 * (S.rel === 'M' ? 0.3 : 1))) pool.push(['lotto', {}]);
  if (!AGE12 && a >= 18 && a <= 65 && !S.gamb && S.flags.gambOK == null && (S.flags.last_gamble == null || a - S.flags.last_gamble >= 10) && (S.income > 0 || S.money > 0) && chance(0.015 * (0.3 + c.net / 100) * (1 - 0.8 * relShare(c, 'M')) * (S.sex === 'M' ? 1.5 : 0.6))) pool.push(['gamble', {}]);
  if (S.gamb && S.gamb.y >= 1 && (S.flags.last_gambquit == null || a - S.flags.last_gambquit >= 2)) {
    if (a - (S.flags.last_gambquit != null ? S.flags.last_gambquit : S.gamb.since) >= 3) add('gambquit'); else if (chance(0.5)) pool.push(['gambquit', {}]);
  }
  mindAsk(c, a, pool);
  if (!AGE12 && a >= 16 && a <= 45 && !S.school && (S.job === 'seeking' || S.job === 'childwork' || (isWorking() && S.pct < 0.25) || S.money < -incomeAt(c, 0.5) * 0.5) && (S.flags.last_crime == null || a - S.flags.last_crime >= 4) && chance(0.07 * (S.sex === 'M' ? 1 : 0.08) * (PRISON_RATE[c.id] ? prisonK(c) : clamp(c.hom / 6, 0.4, 2)) * (S.urban ? 1.2 : 0.8) * (S.flags.reoffK || 1) * crimeBg())) pool.push(['crime', EMB_J.includes(S.job) && !S.flags.emb && !S.flags.embDone ? { emb: 1 } : {}]);
  if (!AGE12 && a >= 25 && a <= 60 && affairOK(c) && S.fam.married && S.fam.partner && S.fam.partner.alive && !S.flags.affair && S.job !== 'prison' && !(S.serveLeft > 0) && (S.done.affair || 0) < 2 && (S.flags.last_affair == null || a - S.flags.last_affair >= 8)
    && chance(AFF_K * (S.sex === 'M' ? 1.3 : 0.65) * (AFF_R[c.p] || 1) * (bondScore(S.fam.partner, 'pt') < 4 ? 1.6 : 1) * (a > 50 ? 0.6 : 1))) pool.push(['affair', {}]);
  { const dp = duiP(a); if (dp && chance(dp)) pool.push(['duikey', {}]); }
  if (!AGE12 && S.flags.relAt != null && S.job !== 'prison' && S.flags.prK !== 'wrong' && a - S.flags.relAt <= 3 && S.flags.atoneFor !== S.flags.relAt && chance(0.5)) pool.push(['atone', {}]);
  if (S.urban === false && a >= 16 && a <= 40 && !S.mig && !studyAway() && !S.school && !inOffice() && S.job !== 'soldier' && chance((c.p === 'hi' ? 0.015 : 0.035) * eraUrbK(c) * (nkLife() ? 0.33 : 1))) pool.push(['city', {}]);
  if (a >= 18 && a <= 45 && !S.mig && !inOffice() && !S.flags.studyAbroad && freeExit(c) && papersOK() && !S.done.abroad2 && chance(migChance())) pool.push(['abroad', {}]);
  else if (a >= 20 && a <= 45 && S.mig && S.cur !== S.born && !S.refugee && S.flags.onward == null && a - (S.migY || a) >= 2 && c.ppp < 35000 && !inOffice() && freeExit(c) && papersOK() && !S.flags.hideCN && !S.flags.defSK && S.job !== 'prison'
    && c.mig.split(',').some(x => CBY[x] && x !== S.born && x !== c.id && CBY[x].ppp > c.ppp * 1.3) && chance(migChance() * 1.5)) pool.push(['abroad', { on: 1 }]);
  if (erasmusOK() && chance(0.09)) pool.push(['erasmus', {}]);
  const pp = partyP(c, a); if (pp && chance(pp)) pool.push(['party', {}]);
  if (!AGE12 && a >= 18 && a <= 60 && soloParent() && kidsSmall().length && kidcareHard() && (S.done.kidcare || 0) < 2 && (S.flags.last_kidcare == null || a - S.flags.last_kidcare >= 6) && S.job !== 'prison' && !S.flags.hideCN && S.serveLeft === 0 && chance(0.06 * (kidsSmall().length >= 3 ? 1.5 : 1))) pool.push(['kidcare', {}]);
  { const pk = S.fam.kids.find(k => k.alive && k.placed && a - k.placed.at >= 1); if (pk && !kidcareHard() && S.money > -incomeAt(c, 0.5) && S.job !== 'prison' && chance(0.35)) pool.push(['kidhome', { i: S.fam.kids.indexOf(pk) }]); }
  if (willOK() && willCommon(c) && !S.will && S.flags.willNo == null && !S.done.will && a >= 65 && a <= 85 && chance(0.05)) pool.push(['will', {}]);
  if (S.job === 'clerk' && !S.flags.ofPath && rankOf('clerk') === 0 && a >= 27 && a <= 45 && expIn('clerk').same >= 3 && chance(0.3)) pool.push(['ofpath', {}]);
  if (S.flags.dr != null && S.flags.profT == null && a <= 52 && a - S.flags.dr <= 14 && (S.done.profapp || 0) < 5 && !S.school && S.serveLeft === 0 && S.job !== 'prison' && !inOffice() && chance(0.45)) pool.push(['profapp', {}]);
  if (S.mig && !famCame() && a >= 20 && S.flags.remitLeft !== false && (S.flags.last_remit == null || a - S.flags.last_remit >= 4) && chance(0.5) && lowInc(B()) && S.q <= 3 && ((S.flags.parCame == null && ((S.fam.mom.alive && S.flags.careHome !== 'mom') || (S.fam.dad.alive && !S.fam.dad.absent && S.flags.careHome !== 'dad'))) || (sibN() > 0 && a < 70))) pool.push(['remit', {}]);
  const dpw = dispP(c); if (dpw && !S.refugee && !studyAway() && !rohG() && a >= 1 && S.job !== 'soldier' && chance(dpw)) pool.push(['war', {}]);
  eraRole(a, add, out);
  eraPool(pool);
  const dreamed = S.flags.dreamAt != null && a > S.flags.dreamAt; if (dreamed) { S.flags.dreamAt = null; if (dreamOK()) add('dreamtry'); }
  const planned = S.flags.bizPlanAt != null && a > S.flags.bizPlanAt; if (planned) S.flags.bizPlanAt = null;
  const bizPlanned = planned && bizPlanOK(); if (bizPlanned) add('biz', { plan: 1 });
  if (S.flags.runAt != null && a > S.flags.runAt) {
    const lv0 = S.flags.runLv, nom = S.flags.runNom; S.flags.runAt = null; S.flags.runNom = null;
    const lv = !runGate() || a > 75 ? null : lv0 === 'leader' ? (S.office && S.office.lvl === 2 && S.job === 'mp' ? 'leader' : null)
      : lv0 === 'national' ? (inOffice() ? null : 'national') : S.office ? null : 'local';
    if (lv) {
      if (lv === 'local' || nom || chance(RUN_NOM[lv] * clamp(S.st.so / 52, 0.5, 1.4) * (lv === 'national' ? natRaceK(c) : 1))) add(RUN_DEC[lv], { prep: 1 });
      else { eff({ h: -2 }); log(lv === 'national' ? "Bạn đã chuẩn bị ra tranh cử nhưng không được đảng đề cử làm ứng viên đại biểu quốc hội." : L`${leaderTitle(c)} 출마를 준비했지만 당의 후보 경선에서 졌습니다.`); }
    } else if (S.phase === 'life' && !(S.office && S.office.lvl >= 3)) log(lv0 === 'leader' ? L`${leaderTitle(c)} 출마를 준비했지만, 사정이 바뀌어 이번 경선에는 나서지 못했습니다.` : lv0 === 'national' ? "Bạn đã chuẩn bị ra tranh cử đại biểu quốc hội, nhưng hoàn cảnh thay đổi nên không thể tham gia cuộc bầu cử lần này." : "Bạn đã chuẩn bị ra tranh cử, nhưng hoàn cảnh thay đổi nên không thể tham gia cuộc bầu cử lần này.");
  }
  if (S.flags.raLookAt != null && a > S.flags.raLookAt) { S.flags.raLookAt = null; if (retAbroadOK(true)) add('retabroad'); }
  if (S.flags.abLookAt != null && a > S.flags.abLookAt) { S.flags.abLookAt = null; if (abroadLookOK(true)) add('abroad', { look: 1 }); }
  if (S.flags.homeLookAt != null && a > S.flags.homeLookAt) { S.flags.homeLookAt = null;
    if (homeLookOK(true)) { if (homeShut()) log("Bạn đã tìm hiểu đường về quê, nhưng hoàn cảnh lúc này vẫn chưa cho phép quay về."); else add('homecoming', { look: 1 }); } }
  const hunted = S.flags.huntAt != null && a > S.flags.huntAt; if (hunted) S.flags.huntAt = null;
  if (hunted && huntOK()) { if (chance(HUNT_P)) add('jobchange', { hunt: 1 }); else log("Bạn đã tìm cơ hội chuyển việc nhưng năm nay không có chỗ nào phù hợp."); }
  else if (S.flags.degOffer && isWorking() && !inOffice() && !S.nomad && a <= 60) { S.flags.degOffer = 0; add('jobchange', { deg: 1 }); }
  else if (S.flags.codeOffer && (isWorking() || S.job === 'seeking') && !inOffice() && a <= 50) { S.flags.codeOffer = 0; add(isWorking() ? 'jobchange' : 'job', { code: 1 }); }
  else if (isWorking() && !inOffice() && !S.nomad && a >= 22 && a <= 58 && chance(0.13 * (1 + 0.6 * (S.focusW.learn || 0) * effLeft()) * (S.flags.courseY != null && a - S.flags.courseY <= 2 ? 1 + 0.6 * effLeft() : 1) * (0.85 + S.st.sm / 333) * (S.job === 'musician' || S.job === 'artist' || S.job === 'actor' || S.job === 'dancer' || S.job === 'boardpro' ? 0.3 : S.job === 'clergy' ? 0.05 : 1) * (nkLife() ? 0.15 : 1))) pool.push(['jobchange', {}]);
  const bizAsk = !S.done.biz || (S.flags.bizFail == null && S.flags.last_biz != null && a - S.flags.last_biz >= 8 && S.done.biz < 3);
  if (!bizPlanned && !nkLife() && (isWorking() || S.job === 'seeking') && !wdOn() && !inOffice() && !S.nomad && !inCalling() && a >= 25 && a <= (S.job === 'seeking' ? 58 : 55) && S.job !== 'owner' && bizAsk && chance((S.flags.retBiz >= a ? 0.12 : S.job === 'seeking' ? 0.05 : 0.024) * (S.major === 'biz' ? 1.5 : 1) * (S.dd && S.dd.told && S.job === 'seeking' ? 1 - ddMiss() : 1))) pool.push(['biz', {}]);
  if (S.flags.bizFail != null && !S.flags.bizAgain && !nkLife() && S.job !== 'owner' && (isWorking() || S.job === 'seeking') && !inOffice() && !S.nomad && !inCalling() && a - S.flags.bizFail >= 2 && a - S.flags.bizFail <= 8 && a <= 58 && chance(0.08)) pool.push(['biz', { again: 1 }]);
  if ((a === 7 || a === 15 || a === 27 || a === 50) && !S.flags['hob' + a]) { S.flags['hob' + a] = 1; pool.push(['hobby', {}]); }
  else if (a >= 8 && a <= 11 && !S.hobbies.length && !S.done.hobby && !out.some(o => o.id === 'hobby')) add('hobby');
  if (S.flags.hobQ) { S.flags.hobQ = 0; add('hobby'); }
  if (S.flags.gkQ) { const n = S.flags.gkQ; S.flags.gkQ = null; if (gkOf(n).length) add('gkhome', { of: n }); }
  const gad = buyable(['phone', 'tv', 'pc']); if (gad && S.money > itemPrice(gad) * 3 && chance(0.3)) gadgetCame(gad);
  const buy = buyable(['car', 'moto', 'house']);
  if (buy === 'car' && S.owns.moto && S.money > itemPrice('car') * 2 && chance(0.45)) carUpgrade();
  else if (buy && !(buy === 'house' && vowedHome()) && chance(buy === 'house' ? 0.55 : 0.45)) pool.push(['buy', { item: buy }]);
  ncdYear(a, c);
  if (S.flags.dxQ && S.flags.dxQ.length) pool.push(['diag', { k: S.flags.dxQ[0] }]);
  if (a >= 18 && chance(0.05 + (a > 50 ? 0.03 : 0))) pool.push(['illness', {}]);
  if (S.flags.tbUn != null && a > S.flags.tbUn && chance(0.6)) add('tbcare');
  if (!S.invest && a >= 22 && S.income > 0 && S.money > S.income * 0.8) pool.push(['invest', {}], ['invest', {}]);
  if (gedOK() && a >= 18 && a <= 50 && (S.done.adultedu || 0) < 3 && (S.flags.last_adultedu == null || a - S.flags.last_adultedu >= 6) && chance(lowInc(c) ? 0.015 : 0.04)) pool.push(['adultedu', {}]);
  const hz = c.haz ? hazardRoll(c) : null;
  if (hz) { if (!hz.severe || (careNow() && hz.kind !== 'E')) mildDisaster(hz.kind); else if (a < 18 && !S.fam.married) childDisaster(hz.kind); else if (hz.kind === 'E') econCrisis(pool); else pool.push(['disaster', { kind: hz.kind }]); }
  if (S.hiv && S.hiv.known && !S.hiv.art && a >= 15 && artOK(c) && (S.flags.hivAsk == null || a >= S.flags.hivAsk)) add('hivtx');
  if (isWorking() && !inOffice() && !out.some(o => o.id === 'mandret') && a >= (S.job === 'clergy' ? (S.flags.voc && S.flags.voc.pope ? 200 : 75) : retireAge(c)) && !S.retired && (S.flags.last_retire == null || a - S.flags.last_retire >= ((S.done.retire || 0) >= 2 ? 5 : 3))) pool.push(['retire', {}]);
  if (S.cur === 'PRK' && S.born === 'PRK' && a >= 17 && a <= 50 && !(S.serveLeft > 0) && (S.done.defect || 0) < (S.flags.defCaught ? 2 : 1) && chance(defectP())) pool.push(['defect', {}]);
  if ((S.fam.mom.alive && S.fam.mom.age >= 75 || S.fam.dad.alive && !S.fam.dad.absent && S.fam.dad.age >= 75) && a >= 30 && !S.done.care && !farFromNK() && !rohAway() && chance(0.2)) pool.push(['care', {}]);
  if (S.rel === 'M' && S.flags.privFaith == null && a >= 35 && !S.done.hajj && netWorth() > usd2ppp(c, 7000) * 1.5 && chance(0.12)) pool.push(['hajj', {}]);
  if (loanDebt() > incomeAt(c, 0.5) * 0.5 && a >= 18 && S.flags.debtUp && (S.flags.last_loan == null || (a - S.flags.last_loan >= 3 && (-S.money > (S.flags.loanDebt || 0) * 1.3 || a - S.flags.last_loan >= 8)))) pool.push(['loan', {}]);
  if (a >= 25 && a <= 70 && !S.flags.lent && S.money > incomeAt(c, 0.5) * 0.3 && (S.flags.last_lend == null || a - S.flags.last_lend >= 12) && chance(0.04)) pool.push(['lend', {}]);
  if (S.adopt && chance(adoptSearchP())) pool.push(['adsearch', {}]);
  if (!S.fam.married && !S.fam.dating && !S.flags.celib && a >= 20 && a <= 70) {
    const xd = S.flags.exD, xp = S.flags.exP;
    if (xd && !xd.arr && a - xd.at >= 1 && a - xd.at <= 6 && xd.at - xd.since >= 1 && chance(0.05)) pool.push(['reunite', { k: 'date' }]);
    else if (xp && !xp.asked && !xp.v && a - xp.at >= 2 && a - xp.at <= 15 && chance(0.012)) pool.push(['reunite', { k: 'ex' }]);
  }
  if (a >= 28 && a <= 65 && !S.flags.cosign && (S.done.cosign || 0) < 2 && (S.flags.last_cosign == null || a - S.flags.last_cosign >= 10) && chance(0.006 * (c.id === 'KOR' && calYr() >= 2013 ? 0.3 : 1))) pool.push(['cosign', {}]);
  { const P = S.fam.partner; if (S.fam.married && P && P.alive && !P.divorced && POST_JOBS.includes(P.job) && P.age >= 28 && P.age <= 55 && c.ppp >= 20000 && calYr() >= 1995 && !S.done.ptpost && S.cur === S.born && !S.mig && chance(0.006)) pool.push(['ptpost', {}]); }
  if (S.fam.dad.absent && S.fam.dad.alive && !S.done.parback && a >= 22 && a <= 55 && chance(0.012)) pool.push(['parback', {}]);
  if (S.sex === 'M' && a >= 20 && a <= 50 && !S.flags.farSea && (S.done.farsea || 0) < 2 && (S.flags.last_farsea == null || a - S.flags.last_farsea >= 6) && FAR_SEA.includes(S.cur)
    && (S.job === 'fisher' ? chance(0.04) : S.job === 'seeking' && FAR_CREW.includes(S.cur) && chance(0.01))) pool.push(['farsea', {}]);
  const hm = typeof humanPick === 'function' ? humanPick() : null; if (hm) pool.push([hm, {}]);
  const sm = typeof smallPick === 'function' ? smallPick() : null; if (sm) pool.push([sm, {}]);
  if (S.flags.petSickQ) { S.flags.petSickQ = 0; if (S.pet) add('petsick'); }
  if (S.flags.hmQ) { const why = S.flags.hmQ; S.flags.hmQ = 0; if (S.job === 'homemaker') add('hmwork', why === 2 ? { debt: 1 } : {}); }
  const petNo = S.flags.petNo || 0;
  if (!S.pet && a >= 6 && a <= 75 && !S.refugee && !['f', 'g', 'w'].includes(c.ck) && S.job !== 'prison' && !vowedHome() && !svcAway() && petNo < 3 && (S.flags.petAsk == null || a - S.flags.petAsk >= [4, 6, 10][petNo]) && (S.flags.petGone == null || a - S.flags.petGone >= 1)) { const o = petOwn(c); if (chance(clamp(o / (1 - o) / (6 * (0.3 + 0.6 * o)), 0.01, 0.5))) pool.push(['petq', {}]); }
  const PP = S.fam.partner, wed = S.fam.married && PP && PP.alive;
  if (wed && !PP.ret && !(PP.out > 0) && PP.age >= 28 && PP.age <= 55 && !S.done.pbiz && chance(0.012)) pool.push(['pbiz', {}]);
  if (wed && S.money > incomeAt(c, 0.5) * 0.5 && ['hi', 'eap', 'eca', 'lac'].includes(c.p) && !noStock(c) && (S.flags.last_pstock == null || a - S.flags.last_pstock >= 10) && chance(0.01)) pool.push(['pstock', {}]);
  if (wed && a >= 18 && S.flags.ipv !== 'over' && !(S.fam.partner && S.fam.partner.lb) && (S.done.ipv || 0) < 3 && (S.flags.ipv === 'on' ? (S.flags.last_ipv == null || a - S.flags.last_ipv >= 3) && chance(0.5 * ipvOnK(a)) : !AGE12 && chance(ipvOnset(c)))) pool.push(['ipv', {}]);
  const kAt = (lo, hi) => S.fam.kids.filter(k => k.alive && !k.grown && !k.away && S.age - k.bornAt >= lo && S.age - k.bornAt <= hi);
  { const kw = kAt(8, 14), kq = kAt(6, 16).filter(k => !k.away && !k.kqd && kidqWhat(k));
    const wOK = kw.length && c.ppp > 6000 && !S.done.kidq && (S.flags.last_kidwant == null || a - S.flags.last_kidwant >= 3), qOK = kq.length && !S.done.kidwant && (S.done.kidq || 0) < 2 && (S.flags.last_kidq == null || a - S.flags.last_kidq >= 4);
    if ((wOK || qOK) && chance(0.08)) { if (qOK && (!wOK || chance(0.4))) pool.push(['kidq', { i: S.fam.kids.indexOf(pick(kq)) }]); else pool.push(['kidwant', { i: S.fam.kids.indexOf(pick(kw)) }]); } }
  { const ks = kAt(13, 17); if (ks.length && (S.flags.last_kidteen == null || a - S.flags.last_kidteen >= 4) && chance(0.06)) pool.push(['kidteen', { i: S.fam.kids.indexOf(pick(ks)) }]); }
  { const ks = kAt(3, 11).filter(k => !k.away); if (!AGE12 && ks.length && (S.done.discipline || 0) < 2 && (S.flags.last_discipline == null || a - S.flags.last_discipline >= 5) && chance(0.12)) pool.push(['discipline', { i: S.fam.kids.indexOf(pick(ks)) }]); }
  { const ds = kAt(13, 16).filter(k => k.sex === 'F' && !k.cmAsk && !k.away), cm = C().cm || 0; if (ds.length && cm >= 20 && chance(0.25 * Math.min(1, cm / 50))) pool.push(['kidcm', { i: S.fam.kids.indexOf(ds[0]) }]); }
  { const ks = S.fam.kids.filter(k => k.alive && !k.abroad && S.age - k.bornAt >= 20 && S.age - k.bornAt <= 30); if (ks.length && freeExit(c) && S.q >= 2 && !S.done.kidabroad && chance(0.012)) pool.push(['kidabroad', { i: S.fam.kids.indexOf(pick(ks)) }]); }
  const sickKid = kidAny(S.fam.kids.filter(k => k.alive && !k.away && S.age - k.bornAt <= 12).sort((x, y) => y.bornAt - x.bornAt));
  if (sickKid && (S.flags.last_kidsick == null || a - S.flags.last_kidsick >= 4) && chance(lowInc(c) ? 0.12 : 0.06)) pool.push(['kidsick', { i: S.fam.kids.indexOf(sickKid) }]);
  if (S.job === 'owner' && S.jobY >= 1 && !S.retired && !(BIZ_K[S.flags.bizK] && BIZ_K[S.flags.bizK].pro) && !bigCo() && (S.flags.last_bizop == null || a - S.flags.last_bizop >= 2) && chance(0.6)) pool.push(['bizop', { k: bizOpKind() }]);
  if (S.urban && isWorking() && !inOffice() && !S.nomad && a >= 22 && a <= 60 && CITIES[S.cur] && !nearWork() && !homeWork() && commuteMin() >= 90 && (S.flags.last_movenear == null || a - S.flags.last_movenear >= 6) && chance(0.08)) pool.push(['movenear', {}]);
  if (isWorking() && !inOffice() && !S.nomad && !inCalling() && a >= 35 && a <= 60 && !S.done.farmback && !JOBS[S.job].s.startsWith('agr') && S.urban && chance(homeVillage() ? 0.05 : 0.012)) pool.push(['farmback', {}]);
  const rare = out.length < 2 ? ladderDecision(a, c) || rareDecision(a, c) : null;
  if (rare) add(rare, LAD_K[rare] ? { j: S.job } : {});
  else if (pool.length && out.length < 2) { const [id, p] = pick(pool); if (out.length === 0 || !poolLight(id)) add(id, p); }
  const fw = S.flags.faithW;
  if (fw) { if (!out.length && a - fw.at <= 4 && DEC.faithq.ok(fw.why)) { S.flags.faithW = null; S.flags.faithQ = a; add('faithq', fw.why); }
    else if (a - fw.at > 4 || !DEC.faithq.ok(fw.why)) { S.flags.faithW = null; S.flags.faithQ = a; } }

  // Vô Hạn Lưu: Dynamic Decision Scheduler
  if (out.length < 2) {
    const vDecs = [
      { id: 'vhts_startup', check: () => a >= 23 && a <= 45 && !S.flags.vhts_startup_done && Math.random() < 0.25 },
      { id: 'vhts_burnout', check: () => a >= 27 && a <= 55 && isWorking() && Math.random() < 0.2 },
      { id: 'vhts_invest', check: () => a >= 25 && a <= 65 && S.money > 15000000 && Math.random() < 0.25 },
      { id: 'vhts_creator', check: () => a >= 18 && a <= 40 && !S.flags.vhts_creator_done && Math.random() < 0.2 },
      { id: 'vhts_career_pivot', check: () => a >= 30 && a <= 50 && isWorking() && !S.flags.vhts_pivot_done && Math.random() < 0.2 },
      { id: 'vhts_care_elder', check: () => a >= 40 && a <= 60 && !S.flags.vhts_elder_done && Math.random() < 0.25 },
      { id: 'vhts_whistleblower', check: () => a >= 28 && a <= 55 && isWorking() && !S.flags.vhts_wb_done && Math.random() < 0.15 },
      { id: 'vhts_debtcrisis', check: () => a >= 25 && S.money < 0 && !S.flags.vhts_debt_resolved },
      { id: 'vhts_divorce', check: () => a >= 30 && a <= 55 && S.fam.married && !S.flags.vhts_div_done && Math.random() < 0.15 },
      { id: 'vhts_fertility', check: () => a >= 25 && a <= 36 && S.fam.married && S.fam.kids.length === 0 && !S.flags.vhts_fert_done && Math.random() < 0.3 },
      { id: 'vhts_fast_money', check: () => a >= 21 && a <= 48 && !S.flags.vhts_fm_done && Math.random() < 0.18 },
      { id: 'vhts_legacy', check: () => a >= 70 && S.money > 25000000 && !S.flags.vhts_legacy_done && Math.random() < 0.3 },
      // Tiền Kiếp Tương Phùng (Feature 3: Past Life Encounters)
      { id: 'vhts_past_echo', check: () => {
        const lives = (typeof lsGet === 'function' ? lsGet(LIVES_KEY, []) : []) || [];
        return a >= 15 && a <= 50 && lives.length >= 1 && !S.flags.vhts_echo_done && Math.random() < 0.28;
      } },
      // Urban Cultivation / Secret Taoist Encounters
      { id: 'vhts_dao_encounter', check: () => a >= 18 && a <= 32 && !S.flags.vhts_cult_started && (S.flags.vhts_cult_seed || Math.random() < 0.12) },
      { id: 'vhts_dao_dilemma', check: () => S.cultivation && S.cultivation.stage >= 1 && a >= 25 && !S.flags.vhts_dao_choice && Math.random() < 0.3 },
      { id: 'vhts_tribulation', check: () => S.cultivation && S.cultivation.stage >= 2 && a >= 60 && !S.flags.vhts_trib_done && Math.random() < 0.35 }
    ];
    for (const vd of vDecs) {
      if (out.length >= 2) break;
      if (DEC[vd.id] && (!DEC[vd.id].ok || DEC[vd.id].ok()) && vd.check()) {
        add(vd.id, {});
      }
    }
  }

  return out;
}
const CL_REG = { ssa: 0.239, sa: 0.055, eap: 0.062, lac: 0.06, mena: 0.064, eca: 0.04, hi: 0.02 };
const eduSrc = (pr, i, undp) => pr.uis && pr.uis[i] ? 'UNESCO UIS' : undp ? "ước tính dựa trên số năm đi học kỳ vọng của UNDP" : "ước tính";
const usecFact = pr => L`${B().ko}에서 고등학교를 마치는 비율은 약 ${pctStr(pr.p3)}입니다 (${eduSrc(pr, 2)})`;
function usecWhy(k) {
  const c = C(), poor = S.q <= 2 || (S.q === 3 && c.ppp < 15000), sm = S.st.sm;
  if (c.war >= 1) return "Giao tranh khiến các trường trung học phổ thông gần nhà phải đóng cửa, nên bạn không thể học tiếp.";
  const w = { money: poor ? 3 : S.q === 3 ? 0.8 : 0, exam: sm < 50 ? 2.5 : sm < 68 ? 1 : sm < 80 ? 0.25 : 0, far: S.urban ? 0.15 : c.ppp < 15000 ? 1.5 : 0.4,
    elders: S.sex === 'F' && ['sa', 'mena', 'ssa'].includes(c.p) ? 1.2 : 0, seat: 0.5 };
  const r = wpick(w);
  if (r === 'money') return c.ppp < 15000 ? "Gia đình không lo nổi học phí, đồng phục và tiền sách, nên bạn đành bỏ ý định học trung học phổ thông." : "Nhà khó khăn, nên thay vì học trung học phổ thông, bạn phải đi kiếm tiền.";
  if (r === 'exam') return k === 'voc' ? "Điểm thi tốt nghiệp trung học cơ sở không đủ, nên bạn không vào được trường nghề." : "Điểm thi tốt nghiệp trung học cơ sở không đủ, nên bạn không vào được trung học phổ thông.";
  if (r === 'far') return "Gần nhà không có trường trung học phổ thông nào, nên bạn không thể học tiếp.";
  if (r === 'elders') return "Người lớn trong nhà không muốn con gái tiếp tục đi học, nên bạn không thể học tiếp.";
  return k === 'voc' ? "Bạn không giành được suất vào trường nghề, nên không thể học tiếp." : "Bạn không giành được suất vào trung học phổ thông, nên không thể học tiếp.";
}
function outWhy(k) {
  const c = C(), war = c.war >= 1, girl = S.sex === 'F';
  if (S.q <= 3) return k === 'drop' ? "Nhà ngày càng khó khăn, bạn phải nghỉ học." : "Gia đình không lo nổi học phí, nên bạn đành thôi không học lên nữa.";
  if (war) return k === 'drop' ? "Giao tranh khiến trường phải đóng cửa, bạn không thể tiếp tục đi học." : k === 'lsec' ? "Giao tranh khiến các trường phải đóng cửa, nên bạn không thể học lên cấp tiếp theo." : "Giao tranh khiến mọi trường học gần nhà đều đóng cửa, và rốt cuộc bạn chưa từng được đến trường.";
  if (girl && k !== 'lsec') return k === 'drop' ? "Người lớn trong nhà không muốn con gái tiếp tục đi học, nên bạn đã nghỉ học." : "Người lớn trong nhà rốt cuộc không cho phép, nên bạn không được đến trường.";
  return k === 'drop' ? "Trường bạn đang học chuyển đi nơi xa, nên bạn không thể tiếp tục theo học." : k === 'lsec' ? "Bạn không giành được suất vào trung học cơ sở, nên không thể học tiếp." : "Gần nhà không có trường nào để học, và rốt cuộc bạn chưa từng được đến trường.";
}
function toChildwork(chose) {
  S.job = 'childwork';
  if (S.flags.cwPaid == null || chose) { const qf = [1.5, 1.25, 1, 0.45, 0.1][S.q - 1] || 1; S.flags.cwPaid = chose || chance(clamp(CL_REG[C().p] * 4 * qf * (C().war ? 1.5 : 1), 0.03, 0.85)); }
}
const primStartP = pr => C().war < 1 && (C().p === 'hi' || C().p === 'eca') && calYr() >= 1980 ? 1 : clamp(pr.t1 + 0.12, 0, 0.998) * (C().war >= 1.5 ? 0.8 : 1);
const PRIM_LATE = 0.35;
const primIn = pr => { const p = primStartP(pr); return Math.min(0.998, p + (1 - p) * PRIM_LATE); };
function startSchool() {
  if (rohCamp()) {
    if (chance(0.72)) { S.school = 'prim'; S.schoolY = 0; S.job = 'student'; logA('school', "Bạn bắt đầu đi học ở trung tâm học tập trong trại tị nạn.", 'big', ROH_F.edu); S.yearMark = 'edu'; }
    else { toChildwork(); log(sibLittle() > 1 ? "Trung tâm học tập không còn chỗ, nên bạn ở nhà trông các em." : sibLittle() ? L`학습 센터에 자리가 없어, 집에서 ${eul(sibCall(sibsHome().find(x => x.d < 0 && x.age < 12)))} 돌보며 지냈습니다.` : "Trung tâm học tập không còn chỗ, nên bạn ở nhà phụ việc nhà.", 'bad', ROH_F.edu); }
    return;
  }
  const pr = eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1);
  let pStart = S.flags.ownPriv && !C().war ? 1 : primStartP(pr);
  const degPar = [S.fam.dad.alive && !S.fam.dad.absent && S.fam.dad.job, S.fam.mom.alive && S.fam.mom.job].some(j => j && JOBS[j] && JOBS[j].e >= 4);
  if (degPar && !C().war) pStart = Math.max(pStart, 0.998);
  if (chance(pStart)) { regSchool(); S.school = 'prim'; S.schoolY = 0; S.job = 'student'; logA('school', "Bạn vào học tiểu học.", 'big'); S.yearMark = 'edu'; }
  else { toChildwork(); log(S.q >= 4 ? (S.sex === 'F' ? "Bạn không được đến trường. Người lớn trong nhà không muốn con gái phải đi học xa." : "Bạn không được đến trường. Gần nhà không có trường nào để học.") : S.urban ? (S.flags.cwPaid ? "Bạn không được đến trường. Nhà khó khăn, bạn phải phụ giúp công việc từ khi còn nhỏ." : (sibLittle() > 1 ? "Bạn không được đến trường. Nhà khó khăn, bạn ở nhà trông các em." : sibLittle() ? L`학교에 가지 못했습니다. 집안 형편이 어려워 ${eul(sibCall(sibsHome().find(x => x.d < 0 && x.age < 12)))} 돌보며 집에 있었습니다.` : "Bạn không được đến trường. Nhà khó khăn, bạn ở nhà phụ việc nhà.")) : "Bạn không được đến trường. Nhà ở xa trường, và gia đình cần thêm người phụ việc nhà.", 'bad', "Trên thế giới, khoảng 78 triệu trẻ em trong độ tuổi tiểu học đang không được đến trường (UNESCO 2023)"); }
}
const uygShut = () => !!(S && S.eth && S.eth.g === 'cn_uyg' && S.cur === 'CHN' && S.born === 'CHN' && calYr() >= 2016 && calYr() <= 2025);
const freeExit = c => !!c.mig && c.id !== 'PRK' && !(c.id === 'CHN' && uygShut()) && !rohStateless();
const nkLife = () => S.cur === 'PRK';
const ROH_F = {
  law: "Luật Quốc tịch năm 1982 của Myanmar không công nhận người Rohingya là công dân. Người Rohingya là nhóm người không quốc tịch lớn nhất thế giới (Tổ chức Bác sĩ Không biên giới)",
  move: "Người Rohingya ở bang Rakhine muốn sang thị trấn khác phải có giấy phép đặc biệt, và chỉ được đến bệnh viện Sittwe khi nguy cấp và phải được cho phép (Amnesty International 2017)",
  uni: "Từ năm 2012, sinh viên Rohingya không được vào giảng đường Đại học Sittwe, mãi đến năm 2022 mới được nhận trở lại (DVB 2022)",
  r12: "Sau bạo lực năm 2012 ở bang Rakhine, khoảng 138.000 người Rohingya mất nhà cửa và phải sống trong các trại (IRIN 2014)",
  r78: "Năm 1978, khoảng 200.000 người Rohingya chạy sang Bangladesh lánh nạn, và gần như tất cả đã trở về trước cuối năm 1979. UNHCR thừa nhận rằng trong thời gian đó có tới 10.000 người đã chết trong các trại tị nạn (Crisp 2018, HPN)",
  r91: "Trong giai đoạn 1991–1992, khoảng 250.000 người Rohingya chạy sang Bangladesh lánh nạn, và đến giữa năm 1995 đã có 200.000 người trở về (Crisp 2018, HPN)",
  r17: "Trong nửa năm kể từ cuối tháng 8 năm 2017, khoảng 700.000 người Rohingya đã chạy sang Cox's Bazar, Bangladesh lánh nạn. Tổ chức Bác sĩ Không biên giới ước tính chỉ riêng trong tháng đầu tiên đã có ít nhất 6.700 người chết vì bạo lực (MSF 2017·2018)",
  r24: "Từ đầu năm 2024 đến tháng 8 năm 2026, có 155.296 người Rohingya từ bang Rakhine mới sang các trại tị nạn ở Bangladesh (Bangladesh Refugee Relief and Repatriation Commissioner, 2026)",
  conscr: "Từ tháng 2 năm 2024, quân đội Myanmar đã cưỡng ép hơn 1.000 nam giới và thiếu niên Rohingya ở bang Rakhine nhập ngũ (Human Rights Watch 2024)",
  camp: "1.204.492 người sống trong các trại tị nạn ở Cox's Bazar và Bhasan Char. 52% là trẻ em, và mỗi năm có khoảng 30.000 em bé chào đời ở đó (Ủy viên Cứu trợ và Hồi hương Người tị nạn Bangladesh, 2026)",
  food: "Viện trợ lương thực trong trại tị nạn được cấp bằng phiếu điện tử, trị giá 7–12 đô la Mỹ mỗi người mỗi tháng (Bangladesh Refugee Relief and Repatriation Commissioner, 2026)",
  work: "Người tị nạn Rohingya không được ra khỏi trại để làm việc. Ngay cả giáo viên Rohingya ở các trung tâm học tập cũng làm việc với tư cách “tình nguyện viên” và nhận 13.000 taka (khoảng 106 đô la Mỹ) mỗi tháng (Human Rights Watch 2025)",
  edu: "Các trung tâm học tập trong trại dạy chương trình của Myanmar đến lớp 8–9. Trẻ em tị nạn đến sau năm 2017 không được học ở trường của Bangladesh, nên không có cách nào nhận được bằng cấp được công nhận (Bangladesh Refugee Relief and Repatriation Commissioner 2026, Human Rights Watch 2025)",
  edu11: "Năm 2025, ở các trung tâm học tập trong trại tị nạn Cox's Bazar chỉ có 57 học sinh học lớp 11 (Human Rights Watch 2025)",
  close25: "Tháng 6 năm 2025, do cắt giảm kinh phí, hàng nghìn trung tâm học tập trong trại đã đóng cửa, khiến việc học của khoảng 304.000 trẻ em bị dừng lại (Human Rights Watch 2025)",
  nut: "Đầu năm 2025, hơn 15% trẻ em trong trại bị suy dinh dưỡng, và số trẻ phải điều trị suy dinh dưỡng cấp tính nặng tăng 27% so với một năm trước (UNICEF 2025)",
  slide: "Nhiều nơi trú ẩn trong trại tị nạn nằm trong vùng có nguy cơ sạt lở đất và lũ quét (Bangladesh Refugee Relief and Repatriation Commissioner, 2026)",
  chr: "Tháng 8 năm 2026, có 33.514 người Rohingya sống trên Bhasan Char, một hòn đảo ở vịnh Bengal (Bangladesh Refugee Relief and Repatriation Commissioner, 2026)",
  sea: "Năm 2025, hơn 6.500 người Rohingya đã lên đường vượt biển, và gần 900 người chết hoặc mất tích. Cứ bảy người thì có một người, tỷ lệ cao nhất trong các tuyến đường biển chính của người tị nạn trên thế giới (UNHCR 2026)",
  res: "Tính đến tháng 11 năm 2023, chỉ hơn 600 người tị nạn Rohingya ở Bangladesh được tái định cư ở nước thứ ba: 355 người ở Mỹ, 131 người ở Canada, 48 người ở Úc và một số ít ở nơi khác (Bộ Nội vụ Bangladesh, The Irrawaddy 2023)",
};
const rohG = () => S && S.eth && ETH_G[S.eth.g] && ETH_G[S.eth.g].roh ? S.eth.g : null;
const rohStateless = () => !!rohG() && S.flags.natz == null;
const rohCamp = () => !!rohG() && S.flags.rohC != null && S.cur === 'BGD';
const rohRakhine = () => !!S && !!S.eth && S.eth.g === 'mm_roh' && S.cur === 'MMR' && S.flags.rohC == null;
const rohAway = () => !!S && !!S.eth && S.eth.g === 'mm_roh' && S.born === 'MMR' && S.cur !== 'MMR';
const rohUniShut = () => rohCamp() || (rohRakhine() && calYr() >= 2012 && calYr() <= 2021);
const rohPlace = () => !rohCamp() ? '' : S.flags.rohChar != null ? "đảo Bhasan Char" : "trại tị nạn Cox's Bazar";
const ROH_CAMP_J = ['vendor', 'construct', 'cleaner', 'artisan'];
const ROH_NO_DEC = new Set(['apprent', 'selfcode', 'ownup', 'growup', 'heir', 'dreamtry', 'bizscale', 'buy', 'invest', 'abroad', 'city', 'movenear', 'farmback', 'nomad', 'kidschool', 'runlocal', 'runnational', 'runleader', 'party', 'acttry', 'mustry', 'arttry', 'protry', 'dnctry', 'idolaud', 'youthtry', 'boardtry', 'gametry', 'vocation', 'erasmus', 'studyto', 'gradabroad', 'phd', 'profapp', 'hsch']);
const ROH_NO_SHOP = new Set(['parbring', 'trip', 'abroad', 'course', 'courseauto', 'huntauto', 'jobhunt', 'bizplan', 'runprep', 'dreamjob', 'ged', 'nightgrad', 'openuni', 'nightuni', 'moveout', 'movehome', 'kidpriv', 'tutor', 'tutorauto', 'moveplan', 'remodel', 'bigger', 'smaller', 'rental', 'sellhouse', 'tripauto', 'abroadauto']);
const ROH_PCT = 0.08;
const ROH_WAVE = { 1978: ['r78', 0.2], 1991: ['r91', 0.1], 1992: ['r91', 0.1], 2017: ['r17', 0.55] };
const rohFleeP = y => y < 2024 ? 0 : 0.085 * (y > 2026 ? Math.pow(0.5, (y - 2026) / 7) : 1);
function rohBirth() {
  if (!S.eth || S.eth.g !== 'bd_roh') return;
  S.refugee = true; S.refugeeUntil = null; S.flags.rohC = 0; S.flags.refEver = 1;
  const f = S.fam; f.dad.job = pick(ROH_CAMP_J); f.mom.job = 'homemaker'; f.pHome = 'camp';
}
function rohFlee(w) {
  const c = C(), y = calYr(), kid = S.age < 18;
  S.money = Math.min(S.money, S.money * 0.3); S.house = 0; delete S.owns.house; delete S.owns.car; delete S.owns.moto; loseRentals(c.id);
  if (S.school && S.school !== 'prim' && S.school !== 'lsec') { S.school = null; S.schoolY = 0; S.job = kid ? 'childwork' : 'seeking'; }
  emigrate('BGD', false, true);
  S.refugeeUntil = null; S.flags.rohC = S.age; S.flags.rohWave = w; S.urban = false; S.city = null; S.flags.refEver = 1;
  if (w !== 'r24') S.flags.famCame = 1;
  if (w === 'r78') S.flags.rohRet = S.age + (y === 1978 ? 1 : 0) + (chance(0.5) ? 0 : 1);
  else if (w === 'r91' && chance(0.8)) S.flags.rohRet = S.age + Math.max(1, ri(1993, 1995) - y);
  eff({ h: -10, so: -6 });
  const t = { r78: "Năm 1978, để tránh cuộc tấn công của quân đội, bạn cùng gia đình vượt sông Naf sang Bangladesh lánh nạn.",
    r91: L`${y}년, 박해를 피해 가족과 함께 국경을 넘어 방글라데시로 피난했습니다.`,
    r17: "Tháng 8 năm 2017, để tránh các chiến dịch của quân đội, bạn cùng gia đình đi bộ nhiều ngày rồi vượt sông Naf. Bạn đã đến được các trại tị nạn ở Cox's Bazar.",
    r24: "Để tránh giao tranh ở bang Rakhine, bạn cùng gia đình vượt biên giới. Bạn đã đến được các trại tị nạn ở Cox's Bazar." }[w];
  log(t, 'bad', ROH_F[w]);
}
function rohSea() {
  if (chance(1 / 7)) { die('drown', "tai nạn thuyền khi vượt biển"); return; }
  const to = chance(0.85) ? 'MYS' : 'IDN';
  emigrate(to, false, true); S.refugeeUntil = null; S.flags.rohC = null; S.flags.rohSea = S.age; eff({ h: -4 });
  log(L`브로커에게 돈을 치르고 밤배에 올랐습니다. 바다 위에서 긴 날들을 버틴 끝에 ${ro(CBY[to].ko)} 닿았습니다.`, 'bad', ROH_F.sea);
}
const ROH_RES = { USA: 355, CAN: 131, AUS: 48, NLD: 8, ITA: 8, SWE: 8, GBR: 8, IRL: 8, DEU: 8, JPN: 6, ARG: 6 };
function rohResettle() {
  const w = {}; for (const k in ROH_RES) if (CBY[k]) w[k] = ROH_RES[k]; const to = wpick(w);
  emigrate(to, false, true); S.refugeeUntil = S.age + 1; S.flags.rohC = null; S.flags.rohRes = S.age; S.flags.famCame = S.age < 18 || withParents() ? 1 : 0; eff({ h: 10, so: 2 });
  logA('fly', L`재정착 심사를 통과해 가족과 함께 ${ro(CBY[to].ko)} 떠났습니다. 언젠가 국적을 가질 수 있는 나라였습니다.`, 'big', ROH_F.res);
}
function rohLine(key, t, k, f) { const s = S.flags.rohL || (S.flags.rohL = {}); if (s[key]) return false; s[key] = S.age; log(t, k, f); return true; }
function rohYear(a) {
  if (!rohG() || S.isComp || S.job === 'prison') return;
  const y = calYr(), f = S.flags;
  if (rohRakhine()) {
    if (y === 2012 && !f.r12) {
      f.r12 = 1;
      if (chance(0.11)) { f.rohIDP = a; S.urban = false; S.city = null; S.money = Math.min(S.money, S.money * 0.5); S.house = 0; delete S.owns.house; eff({ h: -8, so: -4 });
        log("Năm 2012, bạo lực bùng phát ở bang Rakhine. Gia đình bạn mất nhà và chuyển đến một trại bên ngoài Sittwe.", 'bad', ROH_F.r12); }
      else { eff({ h: -3 }); log("Năm 2012, bạo lực bùng phát ở bang Rakhine. Người dân các làng bên cạnh mất nhà và chuyển đến các trại.", 'ev', ROH_F.r12); }
    }
    const wv = ROH_WAVE[y];
    if (wv && !f['rw' + y]) {
      f['rw' + y] = 1;
      if (y === 2017 && !AGE12 && chance(0.005)) { die('pol', "các chiến dịch quân sự ở bang Rakhine năm 2017"); return; }
      if (chance(y === 2017 && f.rohIDP != null ? 0.1 : wv[1])) { rohFlee(wv[0]); return; }
      if (y === 2017) { eff({ h: -6 }); log("Tháng 8 năm 2017, phần lớn người dân các làng xung quanh đã vượt biên giới ra đi. Gia đình bạn ở lại.", 'bad', ROH_F.r17); }
    }
    if (chance(rohFleeP(y))) { rohFlee('r24'); return; }
    if (y === 2024 && a >= 10 && chance(0.5)) rohLine('con', "Quân đội cưỡng ép bắt đi những thanh niên trong làng. Trong số đó có cả một cậu bé mười lăm tuổi.", 'bad', ROH_F.conscr);
    return;
  }
  if (!rohCamp()) return;
  if (f.rohRet != null && a >= f.rohRet) {
    const w = f.rohWave; f.rohRet = null; goHome(false); S.refugee = false; S.refugeeUntil = null; f.rohC = null; f.rohChar = null;
    log(w === 'r78' ? "Theo thỏa thuận giữa hai nước, bạn cùng gia đình trở về ngôi làng ở Rakhine." : "Theo thỏa thuận hồi hương, bạn cùng gia đình trở về ngôi làng ở Rakhine.", 'ev', ROH_F[w]);
    return;
  }
  if (f.rohWave === 'r78' && y <= 1979 && !f.r78d) { f.r78d = 1; if (chance(0.05)) { die('nut', "nạn đói và bệnh tật trong các trại tị nạn ở Bangladesh năm 1978"); return; } }
  if (S.pct > ROH_PCT) S.pct = ROH_PCT; if ((S.flags.careerPct || 0) > ROH_PCT) S.flags.careerPct = ROH_PCT;
  const P = S.fam.partner; if (S.fam.married && P && P.alive && !P.ret && P.age >= 18 && P.job && P.job !== 'homemaker' && !ROH_CAMP_J.includes(P.job)) P.job = P.sex === 'F' ? 'homemaker' : pick(ROH_CAMP_J);
  if (a >= 8 && chance(0.25)) rohLine('food', "Gia đình bạn dùng phiếu lương thực để nhận gạo và dầu ăn ở điểm phân phát. Phần của mỗi người chỉ trị giá vài đô la một tháng.", 'ev', ROH_F.food);
  if (a >= 16 && !S.school && chance(0.3)) rohLine('work', "Không được ra khỏi trại để làm việc, bạn xếp hàng xin một vị trí “tình nguyện viên” ở một tổ chức cứu trợ.", 'bad', ROH_F.work);
  if (a >= 12 && a <= 20 && chance(0.2)) rohLine('cert', "Bạn biết được rằng dù có học ở trung tâm học tập, bạn cũng sẽ không nhận được bằng cấp nào được công nhận.", 'bad', ROH_F.edu);
  if (a >= 6 && chance(0.04)) rohLine('slide', "Mỗi mùa mưa, bạn thao thức suốt đêm vì sợ căn nhà tre trên sườn đồi sẽ sập.", 'bad', ROH_F.slide);
  if (a <= 4 && y >= 2024 && y <= 2025 && chance(0.15)) rohLine('nut', "Hồi nhỏ, bạn được nhận thực phẩm bổ sung dinh dưỡng ở trung tâm dinh dưỡng.", 'ev', ROH_F.nut);
  if (a >= 12 && y >= 2024 && y <= 2026 && chance(0.5)) rohLine('new', "Những người hàng xóm mới từ Rakhine sang dựng lều ở rìa trại.", 'ev', ROH_F.r24);
  if (S.school && y === 2025) rohLine('cl25', "Trung tâm học tập bạn đang theo học đã đóng cửa. Người ta nói là vì thiếu tiền.", 'bad', ROH_F.close25);
  if (a >= 3 && chance(0.05)) { const t = ethWarmLine(); if (t) { eff({ h: 3, so: 2 }); log(t, 'warm'); } }
  if (y >= 2021 && y <= 2022 && f.rohChar == null && chance(0.014)) { f.rohChar = a; log("Gia đình bạn đi thuyền chuyển ra Bhasan Char, một hòn đảo ở vịnh Bengal. Giờ đây họ hàng ở Cox's Bazar đã ở xa.", 'bad', ROH_F.chr); return; }
  if (y >= 2018 && a >= 18 && a <= 35 && !S.fam.married && chance(0.012)) { rohSea(); return; }
  if (y >= 2022 && chance(0.0003)) rohResettle();
}
function tripOutOK() {
  const yr = calYr(), a = S.age, c = S.cur;
  if (c === 'PRK' || (typeof eraClosed === 'function' && eraClosed(c, yr)) || rohStateless()) return false;
  if (S.flags.irreg != null) return false;
  if (c === 'CHN') return yr >= 1997 && !uygShut();
  if (c === 'TWN') return yr >= 1979;
  if (c === 'KOR') return yr >= 1989 || (yr >= 1988 ? a >= 30 : yr >= 1987 ? a >= 45 : yr >= 1983 ? a >= 50 : false);
  return true;
}
const FREE_ZONES = [
  { n: 'eu', y: { BEL: 1968, FRA: 1968, DEU: 1968, ITA: 1968, NLD: 1968, DNK: 1973, IRL: 1973, GBR: 1973, GRC: 1988, ESP: 1992, PRT: 1992, AUT: 1994, FIN: 1994, SWE: 1994, NOR: 1994, CHE: 2002, CZE: 2004, HUN: 2004, POL: 2004, SVK: 2004, BGR: 2007, ROU: 2007, LUX: 1968, EST: 2004, LVA: 2004, LTU: 2004, SVN: 2004, CYP: 2004, MLT: 2004, HRV: 2013 }, end: { GBR: 2021 } },
  { n: 'cta', y: { IRL: 1923, GBR: 1923 } },
  { n: 'ecowas', y: { NGA: 1980, GHA: 1980, CIV: 1980, SEN: 1980, MLI: 1980, BFA: 1980, NER: 1980, GIN: 1980, BEN: 1980, TGO: 1980, SLE: 1980, LBR: 1980, GMB: 1980, GNB: 1980 } },
  { n: 'mercosur', y: { ARG: 2009, BRA: 2009, URY: 2009, PRY: 2009, BOL: 2009, CHL: 2009, PER: 2011, COL: 2012, ECU: 2014 } },
  { n: 'tasman', y: { AUS: 1973, NZL: 1973 } },
  { n: 'npl', y: { IND: 1950, NPL: 1950 } },
  { n: 'btn', y: { IND: 1949, BTN: 1949 } },
  { n: 'csme', y: { JAM: 2006, TTO: 2006, GUY: 2006, SUR: 2006 } },
];
function freeZone(a, b, yr = calYr()) {
  if (a === b) return null;
  for (const z of FREE_ZONES) {
    const ya = z.y[a], yb = z.y[b]; if (ya == null || yb == null || yr < Math.max(ya, yb)) continue;
    const e = z.end || {}; if (yr >= Math.min(e[a] || 9999, e[b] || 9999)) continue;
    return z.n;
  }
  return null;
}
const AES = new Set(['BFA', 'MLI', 'NER']);
const freeName = (z, a, b) => z === 'eu' ? (calYr() < 1993 ? "quyền tự do đi lại trong Cộng đồng châu Âu (EC)" : "quyền tự do đi lại trong Liên minh châu Âu (EU)") : z === 'cta' ? "khu vực đi lại chung giữa Anh và Ireland"
  : z === 'ecowas' ? (calYr() < 2025 || !(AES.has(a) || AES.has(b)) ? "nghị định thư về tự do đi lại của Cộng đồng Kinh tế các quốc gia Tây Phi (ECOWAS)" : AES.has(a) && AES.has(b) ? "quyền tự do đi lại trong Liên minh các quốc gia Sahel (AES)" : "quyền tự do đi lại mà ECOWAS và Liên minh các quốc gia Sahel (AES) công nhận cho công dân của nhau")
  : z === 'mercosur' ? "hiệp định cư trú Mercosur" : z === 'tasman' ? "thỏa thuận giữa Úc và New Zealand" : "hiệp ước hữu nghị Ấn Độ – Nepal";
const ERAS = { BEL: 1987, FRA: 1987, DEU: 1987, ITA: 1987, NLD: 1987, DNK: 1987, IRL: 1987, GBR: 1987, GRC: 1987, ESP: 1987, PRT: 1987, AUT: 1992, FIN: 1992,
  SWE: 1992, NOR: 1992, CHE: 1992, CZE: 1998, HUN: 1998, POL: 1998, SVK: 1998, ROU: 1998, BGR: 1999, TUR: 2004, SRB: 2019,
  LUX: 1987, CYP: 1998, EST: 1999, LVA: 1999, LTU: 1999, SVN: 1999, MLT: 2000, HRV: 2011, MKD: 2014 }, ERAS_END = { GBR: 2021, CHE: 2014 };
const ERAS_TO = { ESP: 3, DEU: 2.2, FRA: 2, ITA: 2, GBR: 1.8, PRT: 1.2, POL: 1, NLD: 1, SWE: 0.6, BEL: 0.6, AUT: 0.6, CZE: 0.6, IRL: 0.5, FIN: 0.4, DNK: 0.4, NOR: 0.3, CHE: 0.3, TUR: 0.4, HUN: 0.4, GRC: 0.4, ROU: 0.2, BGR: 0.1, SVK: 0.1 };
const erasIn = (id, yr = calYr()) => ERAS[id] != null && yr >= ERAS[id] && yr < (ERAS_END[id] || 9999);
const erasmusOK = () => S.school === 'uni' && S.schoolY >= 1 && !S.done.erasmus && !studyAway() && !S.mig && S.cur === S.born && erasIn(S.born) && !S.dis;
function erasmusTo() { const w = {}; for (const id in ERAS_TO) if (id !== S.born && CBY[id] && erasIn(id)) w[id] = ERAS_TO[id]; return Object.keys(w).length ? wpick(w) : null; }
const PARTY = { CHN: [0.086, "Đảng Cộng sản Trung Quốc", "Đảng Cộng sản Trung Quốc có khoảng 99 triệu đảng viên, cứ 11–12 người trưởng thành thì có 1 người (Ban Tổ chức Trung ương Đảng Cộng sản Trung Quốc 2023)"],
  VNM: [0.075, "Đảng Cộng sản Việt Nam", "Đảng Cộng sản Việt Nam có khoảng 5,6 triệu đảng viên, cứ 13 người trưởng thành thì có 1 người (2024)"],
  LAO: [0.07, "Đảng Nhân dân Cách mạng Lào", "Đảng Nhân dân Cách mạng Lào có khoảng 350.000 đảng viên, cứ 14 người trưởng thành thì có 1 người (2021)"],
  CUB: [0.075, "Đảng Cộng sản Cuba", "Đảng Cộng sản Cuba có khoảng 700.000 đảng viên, cứ 13 người trưởng thành thì có 1 người (2021)"],
  PRK: [0.25, "Đảng Lao động Triều Tiên", "Theo ước tính từ bên ngoài, Đảng Lao động Triều Tiên có từ 6 triệu đảng viên trở lên, cứ bốn, năm người trưởng thành thì có 1 người"] };
const partyOf = c => { const P = PARTY[c.id]; return P && S.born === c.id && !farFromNK() && !(c.id !== 'PRK' && !oneParty(c)) ? { sh: P[0], n: P[1], f: P[2] } : null; };
const partyMem = () => S.flags.party != null && !!partyOf(C());
const PARTY_K = 0.065;
const PARTY_FIT = { CHN: { k: 0.047, u: 10, o: 0.7 } };
function partyP(c, a) {
  const P = partyOf(c); if (!P || a < 18 || a > 45 || S.flags.party != null || (S.done.party || 0) >= 2 || (S.flags.last_party != null && a - S.flags.last_party < 6) || S.job === 'prison' || recW() > 0.3 || (S.flags.polRec && calYr() < S.flags.polRec)) return 0;
  const job = S.serveLeft > 0 || ['civil', 'police', 'soldier', 'teacher', 'doctor', 'prof', 'engineer'].includes(S.job) ? 2.5 : 1, F = PARTY_FIT[c.id] || { k: PARTY_K, u: 2.5, o: 1 };
  return F.k * P.sh * (S.school === 'uni' ? F.u : S.edu >= 4 ? 2.5 : S.edu === 3 ? 1.1 : 0.45) * job * (S.sex === 'F' ? 0.6 : 1.3) * (S.st.so > 60 ? 1.2 : 1) * (a >= 36 ? F.o : 1);
}
const healthMig = () => (S.job === 'doctor' || S.job === 'nurse') && C().ppp < 20000;
function migChance() {
  const c = C(); const poor = c.ppp < 10000 ? 0.006 : c.ppp < 25000 ? 0.005 : 0.0025;
  return poor * (S.edu >= 4 ? 1.6 : 1) * (S.fam.married ? 0.6 : 1) * (c.war ? 1.6 : 1) * (healthMig() ? 3 : 1) * (S.flags.erasmus ? 1.6 : 1);
}
const NCD_DM = { AFG: 10.9, DZA: 7.1, AGO: 4.6, ARG: 5.4, AUS: 6.4, AUT: 4.6, AZE: 5.6, BGD: 14.2, BLR: 5.6, BEL: 3.6, BEN: 1.1, BOL: 5.5, BWA: 5.2, BRA: 8.8,
  BGR: 7.4, BFA: 2.1, BDI: 6.5, KHM: 7.3, CMR: 5.5, CAN: 7.7, CAF: 5.8, TCD: 5.8, CHL: 10.8, CHN: 10.6, COL: 8.3, COG: 5.5, CRI: 8.8, CIV: 2.1, CUB: 7.6,
  CZE: 7.1, COD: 5.8, DNK: 5.3, DOM: 10.5, ECU: 4.4, EGY: 20.9, SLV: 6.3, GNQ: 5.5, ERI: 6.5, ETH: 5.0, FIN: 6.1, FRA: 5.3, GAB: 5.5, GMB: 1.9, GEO: 5.7,
  DEU: 6.9, GHA: 2.6, GRC: 6.4, GTM: 13.1, GIN: 2.1, GNB: 2.1, HTI: 8.9, HND: 5.1, HUN: 7.0, IND: 9.6, IDN: 10.6, IRN: 9.1, IRQ: 10.7, IRL: 3.0, ISR: 8.5,
  ITA: 6.4, JAM: 11.1, JPN: 6.6, JOR: 15.4, KAZ: 6.6, KEN: 4.0, KWT: 24.9, KGZ: 6.6, LAO: 6.2, LBN: 8.0, LSO: 4.6, LBR: 2.1, LBY: 8.7, MDG: 4.6, MWI: 7.3,
  MYS: 19.0, MLI: 2.1, MRT: 2.1, MEX: 16.9, MNG: 6.9, MAR: 9.1, MOZ: 3.3, MMR: 7.1, NAM: 6.7, NPL: 8.7, NLD: 4.5, NZL: 6.2, NIC: 9.3, NER: 5.2, NGA: 3.6,
  PRK: 8.6, NOR: 3.6, OMN: 13.8, PAK: 30.8, PSE: 10, PAN: 8.2, PNG: 16.7, PRY: 7.5, PER: 4.8, PHL: 7.1, POL: 6.8, PRT: 9.1, QAT: 19.5, ROU: 6.5, RUS: 5.6,
  RWA: 6.5, SAU: 18.7, SEN: 3.1, SRB: 9.1, SLE: 2.1, SGP: 11.6, SVK: 5.8, SOM: 6.5, ZAF: 10.8, KOR: 6.8, SSD: 5, ESP: 10.3, LKA: 11.3, SDN: 18.9, SWE: 5.0,
  CHE: 4.6, SYR: 14.9, TWN: 10, TJK: 6.6, TZA: 12.3, THA: 9.7, TGO: 2.1, TUN: 9.6, TUR: 14.5, TKM: 6.7, UGA: 4.6, UKR: 5.6, ARE: 16.4, GBR: 6.3, USA: 10.7,
  URY: 9.0, UZB: 7.0, VEN: 9.6, VNM: 6.1, YEM: 5.4, ZMB: 11.9, ZWE: 2.1 ,
  HKG: 8.2, HRV: 10.5, BIH: 10.3, MDA: 6.3, ARM: 7.7, LTU: 7.5, ALB: 10.6, SVN: 7.0, LVA: 7.1, MKD: 7.4, XKX: 10.4, BHR: 22.1, TTO: 12.4, TLS: 3.2, EST: 6.9, CYP: 10.0, MUS: 20.1, SWZ: 7.9, DJI: 6.5, FJI: 16.6, COM: 10.8, GUY: 16.4, SLB: 12.0, BTN: 12.0, MAC: 8.1, LUX: 5.8, MNE: 10.7, SUR: 13.8, MLT: 10.0, MDV: 9.5, CPV: 6.8 };
const NCD_HTN_R = { hi: 30, eca: 42, lac: 36, eap: 30, sa: 30, mena: 33, ssa: 35 };
const NCD_HTN = { CAN: 22, PER: 24, CHE: 27, GBR: 28, USA: 35, KOR: 28, JPN: 31, AUS: 26, NZL: 27, POL: 40, HUN: 47, CZE: 40, SVK: 41, RUS: 45, UKR: 45, BLR: 44,
  ROU: 42, BGR: 44, SRB: 43, ARG: 45, PRY: 50, BRA: 37, MEX: 30, DOM: 45, JAM: 42, CHN: 27, IDN: 36, PHL: 37, MMR: 38, BGD: 26, PAK: 38, NPL: 33, ETH: 25,
  ERI: 24, NGA: 37, ZAF: 40 };
const NCD_HEART_R = { hi: 1, eca: 1.6, mena: 1.3, sa: 1.3, eap: 0.7, lac: 0.9, ssa: 0.5 };
const NCD_G = { htn: 0.055, dm: 0.045, heart: 0.07 }, NCD_A0 = { htn: 50, dm: 50, heart: 60 }, NCD_REF = { htn: 55, dm: 50 };
const NCD_NORM = { htn: 1.12, dm: 1, heart: 1.45 };
const NCD_K = ['htn', 'dm', 'heart'];
const ncdName = k => ({ htn: "tăng huyết áp", dm: "bệnh tiểu đường", heart: "đau thắt ngực" })[k];
const NCD_CAUSE = { htn: ['ihd', 'str', 'kid'], dm: ['dia', 'ihd', 'kid'], heart: ['ihd'] };
const SALTY = new Set(['KOR', 'JPN', 'CHN', 'TWN']);
const SCREEN_C = new Set(['KOR', 'JPN', 'TWN']);
const DESK_J = new Set(['clerk', 'dev', 'finance', 'engineer', 'lawyer', 'designer', 'callc', 'civil', 'salesagent', 'prof', 'driver']);
const MOVE_J = new Set(['farm', 'farmhand', 'herder', 'construct', 'miner', 'fisher', 'welder', 'cleaner', 'warehouse', 'delivery', 'domestic']);
function ncdEraK(k, c) {
  const b0 = CBY[c.id]; if (!b0 || c === b0 || !b0.ppp) return 1;
  const r = c.ppp / b0.ppp;
  return k === 'dm' ? clamp(Math.pow(r, 0.4), 0.25, 1.15) : clamp(Math.pow(r, 0.1), 0.8, 1.05);
}
function ncdBase(k, c) {
  if (k === 'heart') return 0.004 * (NCD_HEART_R[c.p] || 1);
  const prev = clamp((k === 'htn' ? (NCD_HTN[c.id] ?? NCD_HTN_R[c.p] ?? 32) : (NCD_DM[c.id] ?? 8)) / 100 * ncdEraK(k, c), 0.005, 0.7);
  const g = NCD_G[k], I = (Math.exp(g * (NCD_REF[k] - NCD_A0[k])) - Math.exp(g * (25 - NCD_A0[k]))) / g;
  return -Math.log(1 - prev) / I;
}
function ncdRisk(k) {
  const f = S.flags, a = S.age, c = C(), fw = S.focusW || {};
  const g = f.ncdG || (f.ncdG = { htn: pick([0.6, 0.8, 0.8, 1, 1, 1, 1.25, 1.25, 1.6]), dm: pick([0.5, 0.75, 0.75, 1, 1, 1, 1.25, 1.4, 1.8]), heart: pick([0.6, 0.8, 1, 1, 1, 1.25, 1.6]) });
  let r = g[k];
  const par = [S.fam.mom, S.fam.dad].filter(p => p && !p.absent && p.dc);
  if (par.some(p => (k === 'dm' ? ['dia'] : ['ihd', 'str']).includes(p.dc))) r *= 1.3;
  if (S.smoker) r *= { htn: 1.1, dm: 1.35, heart: 2 }[k];
  if (S.alc) r *= { htn: 1.5, dm: 1.1, heart: 1.2 }[k];
  if (a >= 18 && f.diet) r *= f.diet === 'good' ? { htn: 0.8, dm: 0.75, heart: 0.8 }[k] : { htn: 1.15, dm: 1.25, heart: 1.15 }[k];
  r *= 1 - (k === 'heart' ? 0.2 : 0.25) * (fw.health || 0);
  if (f.healthy >= a) r *= 0.85;
  if (k !== 'dm') r *= 1 + 0.15 * (fw.work || 0);
  if (DESK_J.has(S.job)) r *= k === 'dm' ? 1.1 : 1; else if (MOVE_J.has(S.job)) r *= k === 'dm' ? 0.85 : 0.95;
  if (S.st.hl < 50) r *= 1.3; else if (S.st.hl >= 75) r *= 0.85;
  if (c.ppp >= 25000) r *= S.q <= 2 ? 1.2 : S.q >= 5 ? 0.85 : 1;
  else if (c.ppp < 10000) r *= S.urban ? (S.q >= 4 ? 1.35 : 1.15) : 0.8;
  if (k === 'htn' && S.conds.dm) r *= 1.4;
  if (k === 'heart') { if (S.conds.htn) r *= 1.6; if (S.conds.dm) r *= 1.8; }
  return r;
}
const ncdHaz = (k, a, c) => a < 25 ? 0 : Math.min(0.5, ncdBase(k, c) * Math.exp(NCD_G[k] * (a - NCD_A0[k])) * ncdRisk(k) / NCD_NORM[k]);
function ncdDxP(k, a, c) {
  const f = S.flags;
  if (f.ckAt != null && a - f.ckAt <= 1) return 0.8;
  let p = c.ppp >= 30000 ? 0.05 : c.ppp >= 15000 ? 0.032 : c.ppp >= 6000 ? 0.018 : 0.007;
  if (f.hospAt != null && a - f.hospAt <= 1) p = Math.max(p, 0.25);
  if (S.urban) p *= 1.3;
  if (S.st.hl < 50) p *= 1.5;
  if (SCREEN_C.has(c.id) && (a >= 40 || employee())) p *= 1.4;
  if (k === 'heart') p *= 2.5;
  return Math.min(0.85, p);
}
function ncdYear(a, c) {
  if (a < 25 || S.flags.hideCN) return;
  for (const k of NCD_K) {
    const cd = S.conds[k];
    if (!cd) { if (chance(ncdHaz(k, a, c))) S.conds[k] = { since: a, dx: false, treated: false }; continue; }
    if (cd.dx === false && chance(ncdDxP(k, a, c))) ncdFound(k);
  }
}
function ncdFound(k) {
  const cd = S.conds[k]; if (!cd || cd.dx !== false) return false;
  cd.dx = true; cd.dxAt = S.age; const q = S.flags.dxQ || (S.flags.dxQ = []); if (!q.includes(k)) q.push(k);
  return true;
}
function ncdCheckup(sure) {
  S.flags.ckAt = S.age;
  for (const k of NCD_K) if (S.conds[k] && S.conds[k].dx === false && chance(sure ? 0.9 : 0.4) && ncdFound(k)) return ' ' + L`검사에서 ${ncdName(k)} 소견이 나왔습니다.`;
  if (S.age < 30) return '';
  const w = S.flags.ncdW || (S.flags.ncdW = {}), c = C();
  for (const k of ['htn', 'dm']) {
    if (S.conds[k] || w[k] != null) continue;
    if (ncdRisk(k) / NCD_NORM[k] >= 1.15 && ncdHaz(k, S.age, c) * 6 > (k === 'htn' ? 0.1 : 0.05)) { w[k] = S.age; return ' ' + ncdWarn(k); }
  }
  return '';
}
function ncdWarn(k) {
  if (k === 'htn') return SALTY.has(C().id) ? "Bạn được biết huyết áp của mình ở mức ranh giới, sát ngưỡng cao. Bạn được khuyên bớt ăn canh, bớt món mặn và năng vận động." : "Bạn được biết huyết áp của mình ở mức ranh giới, sát ngưỡng cao. Bạn được khuyên bớt ăn mặn và năng vận động.";
  return "Bạn được biết đường huyết của mình hơi cao. Bạn được khuyên bớt đồ uống ngọt, cơm trắng, bánh mì trắng và năng vận động.";
}
const dietFit = () => S.age < 18 || !S.flags.diet ? 0 : S.flags.diet === 'good' ? 1.5 : -1;
const ITEMS = {
  phone: { n: "điện thoại thông minh", usd: 200, age: 13, joy: 5 },
  cell: { n: "điện thoại di động", usd: 250, age: 13, joy: 3 },
  bike: { n: "xe đạp", usd: 150, age: 12, joy: 3 },
  moto: { n: "xe máy", usd: 1300, age: 18, joy: 7, only: c => ['eap', 'sa', 'ssa', 'lac'].includes(c.p) || c.id === 'TWN' },
  car: { n: "ô tô", usd: 16000, age: 20, joy: 8 },
  house: { n: "nhà riêng", usd: 0, age: 26, joy: 14 },
  tv: { n: "tivi và tủ lạnh", usd: 600, age: 18, joy: 5, only: c => c.ppp < 20000 },
  pc: { n: "máy tính hoặc máy tính xách tay", usd: 700, age: 15, joy: 4, only: c => pcOK(c) && c.net >= 30 },
};
const phoneCommon = c => c.net >= 80;
function phoneYear(c) {
  if (S.owns.phone || !phoneCommon(c) || !smartOK(c) || S.age < 10 || S.job === 'prison' || S.refugee) return;
  if (S.age < 18) { if (S.age >= 13 || chance(0.35)) { S.owns.phone = S.age; log("Bạn có chiếc điện thoại thông minh đầu tiên."); } return; }
  let price = itemPrice('phone'); const used = S.money < price * 1.1;
  if (used && (S.income <= 0 || debtHeavy())) return;
  if (used) price *= 0.4;
  S.money -= price; book(L`${ITEMS.phone.n} 구입`, -price); S.owns.phone = S.age; log(used ? "Bạn sắm một chiếc điện thoại thông minh cũ vừa với túi tiền." : "Bạn có chiếc điện thoại thông minh đầu tiên.");
}
const ILLS = {
  app: { n: "viêm ruột thừa", once: 1, w: a => a < 40 ? 0.17 : 0.05, t: "Cơn đau bụng dữ dội", b: "Cơn đau bắt đầu quanh vùng thượng vị rồi lan xuống bụng dưới bên phải, đi lại cũng khó khăn. Bạn còn bị sốt." },
  gall: { n: "sỏi mật", once: 1, w: a => a < 30 ? 0.2 : S.sex === 'F' ? 0.9 : 0.5, t: "Đau quặn vùng bụng trên", b: "Cứ những đêm ăn đồ nhiều dầu mỡ, vùng bụng trên bên phải lại đau quặn khiến bạn không ngủ được." },
  disc: { n: "thoát vị đĩa đệm", w: a => a < 25 ? 0.2 : a < 60 ? 0.6 : 0.4, t: "Cơn đau lưng dữ dội", b: "Từ lần bê vật nặng bị nhói ở lưng, cơn đau và tê lan từ thắt lưng xuống chân khiến bạn đi lại khó khăn." },
  frac: { n: "gãy xương", w: a => a > 65 ? 1.4 : 0.7, t: "Ngã và bị thương nặng", b: "Sau cú ngã, tay chân sưng vù lên, chỉ cử động một chút cũng đau." },
  pneu: { n: "viêm phổi nặng", w: a => a > 65 ? 1.6 : 0.7, t: "Ho và sốt cao kéo dài", b: "Đã mấy ngày ho và sốt cao không dứt, chỉ cử động một chút là bạn đã thở dốc." },
  mal: { n: "biến chứng sốt rét", w: () => 1, t: "Sốt cao không dứt", b: "Lúc ớn lạnh, lúc sốt cao, đầu đau như búa bổ khiến bạn không dậy nổi." },
  typh: { n: "thương hàn", w: () => 0.8, t: "Sốt mãi không hạ", b: "Đã hơn một tuần mà sốt vẫn không hạ, bụng đau và người không còn chút sức lực nào." },
  tb: { n: "triệu chứng nghi mắc lao", once: 1, w: () => 0.7, t: "Cơn ho không dứt", b: "Ho mấy tuần liền không dứt, đêm nào bạn cũng tỉnh dậy ướt đẫm mồ hôi. Bạn cũng sụt cân." },
  deng: { n: "sốt xuất huyết", w: () => 0.9, t: "Đột ngột sốt cao", b: "Đột nhiên bạn sốt cao, các khớp xương khắp người và vùng phía sau mắt nhức nhối. Trên da còn nổi những nốt đỏ." },
};
const illDx = id => id === 'tb' ? "bệnh lao" : id === 'pneu' ? "viêm phổi" : id === 'mal' ? "sốt rét" : ILLS[id].n;
const ILL_DIE = { app: [0.1, 'oinf', "biến chứng viêm ruột thừa"], gall: [0.005, 'oinf', "biến chứng sỏi mật"], disc: [0, 'inj'], frac: [a => a >= 65 ? 0.04 : 0, 'fall', "biến chứng gãy xương"],
  pneu: [a => a >= 65 ? 0.15 : 0.05, 'lri'], mal: [0.2, 'mal'], typh: [0.05, 'oinf', "thương hàn"], deng: [0.04, 'oinf', "sốt xuất huyết"] };
function tbYear() {
  if (S.flags.tbUn == null || S.age <= S.flags.tbUn) return;
  if (chance(0.15)) { die('tb'); return; }
  if (chance(0.15)) { S.flags.tbUn = null; eff({ hl: -4 }); log("Cơn ho kéo dài mấy năm cuối cùng cũng dứt. Cơ thể bạn đã yếu đi nhiều."); return; }
  eff({ hl: -6, h: -2 });
}
const ILL_REG = { ssa: ['mal', 'typh', 'pneu', 'tb', 'app'], sa: ['deng', 'typh', 'tb', 'pneu', 'gall'], other: ['app', 'pneu', 'gall', 'disc', 'frac'] };
function pickIllness(c) {
  const had = S.flags.illHad || {}, w = {};
  for (const id of ILL_REG[c.p] || ILL_REG.other) { const I = ILLS[id]; if (had[id] != null && (I.once || S.age - had[id] < 10)) continue;
    if (id === 'mal' && !(c.mal > 0)) continue;
    w[id] = I.w(S.age) * (id === 'mal' ? clamp(c.mal, 0.2, 1) : 1); }
  return Object.keys(w).length ? wpick(w) : null;
}
function gearLine(id) {
  const n = hobbyName(id);
  const stream = !nkLife() && !eraBefore(2010) && C().net >= 40;
  return ({ screen: stream ? "Bạn sắm một chiếc tivi màn hình lớn và đăng ký một dịch vụ xem phim trực tuyến." : "Bạn sắm một chiếc tivi mới. Giờ những bộ phim truyền hình yêu thích được xem trên màn hình lớn hơn.", sns: "Bạn đổi sang điện thoại thông minh mới và học chỉnh sửa ảnh, video.", games: "Bạn mua một máy chơi điện tử mới và vài trò chơi.",
    reading: "Bạn mua cả một ôm sách và tham gia câu lạc bộ đọc sách.", faith: "Bạn tham gia một nhóm học kinh sách và học đều đặn.", travel: "Bạn sắm một chiếc vali mới và lên kế hoạch cho chuyến đi tiếp theo.",
    board: L`좋은 ${n} 세트를 사고 고수에게 한 수 배웠습니다.`, karaoke: "Bạn đi học lớp hát và học cách luyện thanh.", garden: "Bạn mua dụng cụ tốt, hạt giống và học cách chăm sóc mảnh vườn nhỏ.",
    hiking: "Bạn sắm giày leo núi và ba lô mới.", cooking: "Bạn mua một con dao tốt, vài chiếc nồi và tham gia lớp học nấu ăn.", music: "Bạn mua một nhạc cụ mới và đi học nhạc.",
    dance: "Bạn đăng ký ở một trung tâm dạy nhảy và đi học.", crafts: "Bạn mua nguyên liệu, dụng cụ và tham gia lớp học ở một xưởng thủ công.", fishing: "Bạn sắm cần câu và đồ nghề mới.",
    photo: "Bạn mua máy ảnh mới và tham gia một lớp học nhiếp ảnh.", art: "Bạn mua màu vẽ, sổ phác thảo tốt và bắt đầu đến học ở một xưởng vẽ.", gym: "Bạn được một huấn luyện viên cá nhân hướng dẫn cách tập luyện.", drama: "Bạn theo học ở một trung tâm diễn xuất, học luyện giọng và diễn xuất." })[id] || L`${n} 장비를 사고 레슨을 받았습니다.`;
}
function yearRoll(id, p) { const k = 'roll_' + id; if (!S.flags[k] || S.flags[k][0] !== S.age) S.flags[k] = [S.age, chance(p)]; return S.flags[k][1]; }
const EXAM_C = new Set(['KOR', 'JPN', 'CHN', 'TWN', 'VNM', 'IRN', 'TUR', 'IND', 'EGY', 'NGA', 'GRC']);
const RETAKE_OR = c => EXAM_C.has(c.id) ? 0.55 : 0.25, FIRST_OR = 0.9, RETAKE3 = new Set(['KOR', 'JPN', 'CHN', 'TWN']);
const retakeMax = () => (RETAKE3.has(C().id) ? 2 : 1) + (S.q >= 4 && S.st.h >= 35 ? 1 : 0);
const retakeWhy = () => (S.flags.retakeN || 0) >= retakeMax() || S.age > 22 || S.fam.married || S.refugee || S.flags.irreg || S.job === 'prison' ? 'no'
  : lowInc(C()) && S.q < 3 ? 'money' : 'ok';
const EFF_B = 0.85, EFF_M = a => a <= 13 ? 1.7 : a <= 16 ? 2.05 : 2.05;
function effortOdds(k) { knowStart(); return k * EFF_M(S.age) * Math.exp(EFF_B * clamp(kzOf(), -3, 3) - EFF_B * EFF_B / 2); }
const uniTop = (pu, pr) => kzOf() >= 1.75 && pr.t4 >= 0.3 ? 1 - (1 - pu) * 0.25 : pu;
const markR = () => { if (S.flags.cr == null) S.flags.cr = rnd(); return normCdf(0.75 * clamp(kzOf(), -3, 3) + 0.45 * invNorm(clamp(S.flags.cr, 0.01, 0.99)) + 0.5 * invNorm(clamp(rnd(), 0.01, 0.99)) + 0.2 * ((S.focusW || {}).study || 0) - (S.nd && S.nd.l ? ND_L_MK : 0)); };
function gradAdmit() { const c = C(); return clamp(0.1 + c.ter / 400 + (S.st.sm - 40) / 300 + (S.q - 3) * 0.03, 0.05, 0.45); }
const REF_HOST = { NGA: 'CMR,NER,TCD', COD: 'UGA,RWA,BDI,TZA,AGO,ZMB', ETH: 'SDN,KEN', SDN: 'TCD,EGY,SSD,UGA', SYR: 'TUR,LBN,JOR,DEU', UKR: 'POL,DEU,CZE,SVK',
  SSD: 'UGA,SDN,ETH,KEN', SOM: 'KEN,ETH,YEM', MMR: 'BGD,THA,MYS', YEM: 'SAU,OMN,SOM', MLI: 'MRT,NER,BFA', BFA: 'MLI,CIV,NER', CAF: 'CMR,TCD,COD',
  PSE: 'JOR,EGY', AFG: 'IRN,PAK,DEU', CMR: 'NGA', TCD: 'CMR,CAF', COL: 'ECU,ESP,USA', HTI: 'DOM,USA', IRQ: 'TUR,JOR', LBN: 'SYR', LBY: 'TUN,EGY',
  MOZ: 'MWI,TZA', NER: 'NGA', ISR: 'USA,DEU' };
const CAMPS = new Set(['KEN', 'UGA', 'TCD', 'BGD', 'ETH', 'JOR', 'SDN', 'TZA', 'CMR', 'NER', 'RWA', 'BDI', 'MWI', 'SSD', 'MRT', 'THA', 'COD', 'ZMB', 'AGO']);
const DISP = { NGA: 0.016, COD: 0.07, ETH: 0.04, SDN: 0.25, SYR: 0.3, UKR: 0.2, SSD: 0.3, SOM: 0.2, MMR: 0.06, YEM: 0.13, MLI: 0.03, BFA: 0.09, CAF: 0.2, PSE: 0.3, AFG: 0.12, CMR: 0.05, TCD: 0.02, COL: 0.1, HTI: 0.06, IRQ: 0.03, LBN: 0.03, LBY: 0.03, MOZ: 0.03, NER: 0.02, ISR: 0.01 };
const MAT_CHOICE = ['doctor', 'lawyer', 'prof', 'engineer', 'dev', 'finance', 'teacher', 'nurse', 'civil'];
function matExit(c) {
  let p = ['sa', 'mena'].includes(c.p) ? 0.45 : ['KOR', 'JPN'].includes(c.id) ? 0.25 : c.p === 'ssa' ? 0.06 : 0.1;
  if (MAT_CHOICE.includes(S.job)) p *= 0.45;
  if (S.pct >= 0.8) p *= 0.6; else if (S.pct < 0.3 && lowInc(c)) p *= 0.75;
  return p;
}
const CARE_K = { KOR: 0.03, SWE: 0.04, NOR: 0.04, FIN: 0.04, DNK: 0.05, DEU: 0.06, JPN: 0.06, FRA: 0.1, CAN: 0.1, NLD: 0.12, AUS: 0.15, NZL: 0.2, GBR: 0.25, IRL: 0.25, USA: 0.3, CHE: 0.3 };
const CARE_R = { hi: 0.15, eca: 0.08, lac: 0.15, eap: 0.12, mena: 0.15, sa: 0.15, ssa: 0.15 };
const careCost = c => incomeAt(c, 0.5) * (CARE_K[c.id] ?? CARE_R[c.p] ?? 0.15);
const CARE_GP = { eap: 0.45, sa: 0.5, mena: 0.35, eca: 0.35, lac: 0.35, ssa: 0.35, hi: 0.2 };
const CARE_PT = { NLD: 0.5, DEU: 0.35, AUT: 0.35, CHE: 0.35, GBR: 0.3, BEL: 0.3, JPN: 0.25, AUS: 0.3, NZL: 0.3, IRL: 0.25 };
const CARRY_JOBS = ['farm', 'farmhand', 'herder', 'agbiz', 'vendor', 'fisher', 'shop', 'artisan', 'domestic'];
const partnerWorks = () => { const P = S.fam.partner; return !!(S.fam.married && P && P.alive && !P.divorced && !P.ret && !(P.out > 0) && P.inc > 0 && P.age < 60); };
const momQuitP = c => { const p = matExit(c); return MAT_CHOICE.includes(S.job) || S.pct >= 0.8 ? Math.min(0.9, p * 2.5) * 0.3 : p; };
const wifeHomeP = c => ['sa', 'mena'].includes(c.p) ? 0.45 : ['KOR', 'JPN'].includes(c.id) ? 0.25 : c.p === 'ssa' ? 0.06 : 0.1;
const youngestAge = () => { let m = 99; for (const k of S.fam.kids) if (k.alive && !k.away && !k.sk) m = Math.min(m, S.age - k.bornAt); return m; };
const CARE_RE_Y = 6, CARE_RE_INC = 0.3;
function careWhy() {
  const w = S.flags.bcareW, b = S.flags.bcare, k = (b && b.k) || (w && w.k);
  if (k === 'pay' && debtHeavy()) return 'debt';
  if (!w) return null;
  if (w.j && w.j !== S.job && w.inc > 0 && Math.abs(S.income / w.inc - 1) >= CARE_RE_INC) return 'job';
  const g = careGp() ? 1 : 0; if (w.g != null && g !== w.g) return g ? 'gpnew' : 'gpgone';
  if (S.age - w.at >= CARE_RE_Y) return 'years';
  return null;
}
function careAfterBirth(i) {
  const f = S.flags, P = S.fam.partner;
  if (f.bcare && S.age < f.bcare.until) {
    f.bcare.until = S.age + 6; const c = C();
    if (f.bcare.auto !== 1) { const w = isWorking() && !inOffice() && careWhy(); if (w) { f.careQ = i; f.careWhy = w; } return; }
    if (S.sex === 'F' && isWorking() && !inOffice() && chance(momQuitP(c))) { S.flags.lastJob = S.job; S.job = 'homemaker'; f.bcare = null; log("Nhà thêm con, bạn nghỉ việc để ở nhà chăm con.", 'note', matFact(c)); }
    else if (S.sex === 'M' && partnerWorks() && P.age < 50 && !P.ss && chance(wifeHomeP(c))) { P.out = ri(2, 6); P.hm = 1; log(L`배우자 ${iga(callName(P.name))} 아이를 돌보려고 한동안 일을 쉬기로 했습니다.`, 'ev', matFact(c)); }
    return;
  }
  if (P && P.out > 0 && P.hm) return;
  if (inOffice() || S.age < 16) return;
  if (!kidCareNow()) { if (S.job === 'seeking' || ptBetween()) f.careWait = i; return; }
  f.careQ = i;
}
const ptBetween = () => { const P = S.fam.partner; return !!(S.fam.married && P && P.alive && !P.divorced && !P.lb && !P.ret && P.out > 0 && !P.hm && !P.ill && P.age < 60); };
const kidCareNow = () => isWorking() && !inOffice() && !(S.fam.married && S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced && !partnerWorks());
function careLater(i) {
  const k = S.fam.kids[i]; S.flags.careWait = null;
  if (!k || !k.alive || k.away || S.age - k.bornAt >= 6 || inOffice() || !(S.job === 'seeking' || ptBetween())) return;
  S.flags.careWait = i; if (k.cwSaid || S.flags.bcare) return; k.cwSaid = 1;
  const n = callName(k.name), P = S.fam.partner;
  log(S.job === 'seeking' ? L`일자리를 찾는 동안 ${eul(n)} 집에서 돌보았습니다.` : L`배우자 ${iga(callName(P.name))} 일자리를 찾는 동안 ${eul(n)} 돌보았습니다.`);
}
const gpFree = (o, F) => o.alive && !o.absent && o.age < 78 && (!o.job || o.job === 'homemaker' || ['farm', 'herder', 'vendor', 'artisan'].includes(o.job) || o.age >= retireAge(B()) - (F && ['eap', 'eca'].includes(B().p) ? 5 : 0));
function careGp() {
  const f = S.fam, near = !farFromNK() && (!S.mig || famCame());
  if (near && (gpFree(f.mom, true) || gpFree(f.dad, false))) return 'mine';
  const P = f.partner; if (f.married && P && P.alive && !P.ss && (P.nat || S.born) === S.cur && hashStr((P.name.full || '') + S.born) % 2) return 'inlaw';
  return null;
}
const hashStr = s => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
function careOpts() {
  const c = C(), out = [];
  if (isWorking() && !inOffice()) out.push('me');
  if (isWorking() && c.ppp >= 15000 && !['owner', 'agbiz'].includes(S.job)) out.push('pt');
  if (partnerWorks() && !ptAway()) out.push('partner');
  if (careGp()) out.push('gp');
  if (S.urban || c.ppp >= 8000) out.push('pay');
  if (CARRY_JOBS.includes(S.job) && c.ppp < 20000) out.push('carry');
  return out;
}
function matFact(c) {
  if (c.p === 'sa') return "Ở Nam Á, tỷ lệ tham gia lực lượng lao động của phụ nữ khoảng 30%, chưa bằng một nửa so với nam giới (khoảng 75%) (ILO)";
  if (c.p === 'mena') return "Ở Trung Đông và Bắc Phi, tỷ lệ tham gia lực lượng lao động của phụ nữ khoảng 19%, thấp nhất thế giới (ILO)";
  if (c.id === 'KOR') return "Khoảng 17% phụ nữ đã kết hôn ở Hàn Quốc (15–54 tuổi) bị gián đoạn sự nghiệp vì sinh con, nuôi con và những lý do tương tự (Statistics Korea 2023)";
  return "Trên toàn thế giới, tỷ lệ tham gia lực lượng lao động của phụ nữ khoảng 47%, của nam giới khoảng 72% (ILO)";
}
const JAM = new Set(['KOR', 'JPN', 'CHN', 'TWN', 'IDN', 'PHL', 'THA', 'VNM', 'IND', 'BGD', 'PAK', 'EGY', 'NGA', 'KEN', 'MEX', 'BRA', 'COL', 'PER']);
const COMM_M = { USA: 54, CAN: 52, GBR: 58, JPN: 75, CHN: 72, MAR: 48 }, COMM_KOR = [90, 78, 90, 73, 70, 68, 90];
const COMM_EU = new Set('AUT,BEL,BGR,HRV,CYP,CZE,DNK,EST,FIN,FRA,DEU,GRC,HUN,IRL,ITA,LVA,LTU,LUX,MLT,NLD,POL,PRT,ROU,SVK,SVN,ESP,SWE,NOR,CHE'.split(','));
const vehK = c => JAM.has(c.id) ? 0.85 : 0.6;
function commMean(c) {
  const l = CITIES[c.id] ? CITIES[c.id].split(',') : [], i = l.indexOf(S.city), n = l.length;
  const m = c.id === 'KOR' && i >= 0 ? COMM_KOR[i] : (COMM_M[c.id] || (COMM_EU.has(c.id) ? 50 : 70)) * (i < 0 || n < 2 ? 1 : (i === 0 ? 1.25 : 0.9) * n / (1.25 + 0.9 * (n - 1)));
  return 1.12 * m / (1 - (c.p === 'hi' ? 0.72 : 0.6) * (1 - vehK(c)));
}
const homeWork = () => (S.job === 'owner' && S.flags.bizK === 'online') || S.job === 'creator' || S.job === 'artist';
const workKey = () => S.job + '|' + (S.city || '') + '|' + (S.job === 'owner' ? S.flags.bizK || '' : S.stats.jobs || 0);
const SELF_COMM = { M: 0.86, F: 0.8, N: 0.815 };
function commuteMin() {
  const k = workKey(), c = C();
  if (!S.flags.comm || S.flags.comm.k !== k || S.flags.comm.m == null) S.flags.comm = { k, m: clamp(commMean(c) * (SELF_JOBS.includes(S.job) ? SELF_COMM[meSex()] || SELF_COMM.N : 1) * Math.exp(0.7 * gaussR(rnd) - 0.245), 10, 240) };
  const w = wayOf(), m = S.flags.comm.m * (w === 'car' || w === 'moto' ? vehK(c) : 1);
  return Math.max(10, Math.round(m / 10) * 10);
}
function minStr(m) { const h = Math.floor(m / 60), r = m % 60; return !h ? L`${r}분` : !r ? (h === 1 ? "1 giờ" : L`${h}시간`) : L`${h}시간 ${r}분`; }
const carH0 = () => S.urban && isWorking() && CITIES[S.cur] && !nearWork() && !homeWork() && wayOf() !== 'moto' ? commuteMin() : 0;
function carBought(h0) {
  sellMotoForCar();
  if (!h0 || h0 < 60 || !S.urban || !isWorking() || nearWork() || homeWork()) return '';
  const h1 = commuteMin(); return ' ' + (h1 < h0 ? L`차로 다니니 출퇴근이 하루 ${minStr(h0)}에서 ${minStr(h1)}으로 줄었습니다.` : L`길이 막혀 차로 다녀도 출퇴근은 하루 ${minStr(h1)}이 걸립니다.`);
}
function carCommuteNote() {
  if (S.owns.car || wayOf() === 'moto' || !S.urban || !isWorking() || !CITIES[S.cur] || nearWork() || homeWork()) return '';
  const h0 = commuteMin(); if (h0 < 60) return '';
  const h1 = Math.max(10, Math.round(S.flags.comm.m * vehK(C()) / 10) * 10);
  return ' ' + (h1 < h0 ? L`지금 출퇴근에 하루 ${minStr(h0)}이 걸리는데, 차로 다니면 약 ${minStr(h1)}이 됩니다.` : L`다만 길이 막혀, 차로 다녀도 하루 ${minStr(h0)} 걸리는 출퇴근은 거의 줄지 않습니다.`);
}
const nearWork = () => !!(S.flags.near && S.flags.near.job === S.job && S.flags.near.city === S.city && (S.flags.near.w == null || S.flags.near.w === workKey()));
function wayOf() {
  if (S.owns.car && !licOff()) return 'car'; if (S.owns.moto && !licOff()) return 'moto';
  if (S.owns.bike && S.age < 75 && !(disOn() && S.dis.k !== 'hear') && (!S.urban || nearWork() || !isWorking() || homeWork() || (S.flags.comm && S.flags.comm.k === workKey() && S.flags.comm.m <= 60))) return 'bike';
  return S.urban ? 'transit' : 'walk';
}
function wayName(w = wayOf()) {
  const c = C();
  if (w === 'transit') return c.ppp >= 15000 ? "tàu điện ngầm và xe buýt" : c.p === 'ssa' ? "xe buýt nhỏ chở khách chung" : c.p === 'sa' ? "xe buýt và xe tuk-tuk" : "xe buýt";
  return { car: "ô tô", moto: "xe máy", bike: "xe đạp", walk: "đi bộ" }[w];
}
const bikeFit = () => wayOf() === 'bike' && !S.school ? 1.5 : 0;
function sellMotoForCar() {
  if (!S.owns.moto) return;
  delete S.owns.moto; S.money += usd2ppp(C(), 400);
  log("Có ô tô rồi, bạn bán chiếc xe máy đi.");
}
const HOUSE_K = { KOR: 1.54, HKG: 1.54, SGP: 1.54, TWN: 1.54, CHN: 1.3 };
const CITY_PIR = { USA: [7.4, 11.2, 4.3, 4.4, 5.4, 4.3], GBR: [9.1, 4.9, 6.4, 4.6], CAN: [8.4, 5.8, 11.8, 4.8], AUS: [13.8, 9.7, 9.3, 8.3],
  KOR: [13.0, 6.7, 6.1, 6.7, 7.1, 6.3, 7.4], JPN: [16.90, 11.63, 7.11, 7.37, 9.46] };
const cityHK = c => {
  const t = CITY_PIR[c.id], l = CITIES[c.id]; if (!t || !l || !S.urban || !S.city || (typeof calYr === 'function' && calYr() < 2010)) return 1;
  const i = l.split(',').indexOf(S.city); if (i < 0 || t[i] == null || l.split(',').length !== t.length) return 1;
  return t[i] / (t.reduce((x, y) => x + y, 0) / t.length);
};
function housePrice(c) { return incomeAt(c, 0.5) * (c.p === 'hi' ? 5.5 : 5) * (S.urban ? 1.4 * cityHK(c) : 0.7) * (HOUSE_K[c.id] || 1) * (S.flags && S.flags.hMk && S.flags.hMkC === c.id ? Math.exp(S.flags.hMk) : 1); }
const CITY_PIR_NO = { KOR: [5, 6] };
function cityFact(c) {
  if (cityHK(c) === 1) return null;
  const i = CITIES[c.id].split(',').indexOf(S.city); if ((CITY_PIR_NO[c.id] || []).includes(i)) return null;
  const src = c.id === 'KOR' ? "Khảo sát Nhà ở Hàn Quốc 2023" : c.id === 'JPN' ? "Tokyo Kantei 2024, căn hộ chung cư xây được 10 năm" : 'Demographia 2025';
  return L`${S.city}의 집값은 그곳 중위 가구 소득의 약 ${CITY_PIR[c.id][i]}배입니다 (${src})`;
}
const houseSize = () => { const r = S.house / Math.max(1, housePrice(C())); return r >= 4.5 ? 'estate' : r >= 2.6 ? 'mansion' : r >= 1.5 ? 'villa' : r < 0.75 ? 'small' : 'house'; };
const paidLine = () => S.flags.hPaid > 0 && !S.flags.revM ? ' ' + L`이 집에 들인 돈은 모두 약 ${wonStr(S.flags.hPaid)}이었습니다.` : '';
const houseSet = () => { S.flags.hsz = S.house > 0 ? houseSize() : null; if (S.house > 0) S.flags.shop_sellhouse = null; };
const HSZ = ['small', 'house', 'villa', 'mansion', 'estate'];
const houseStep = d => { const now = HSZ.indexOf(S.flags.hsz || houseSize()), calc = HSZ.indexOf(houseSize()); S.flags.hsz = HSZ[clamp(d > 0 ? Math.max(calc, now + 1) : Math.min(calc, now - 1), 0, 4)]; };
const HOME_HELP = ['CHN', 'KOR', 'JPN', 'TWN', 'HKG', 'SGP', 'VNM'];
function homeHelp(price) {
  const c = C(), par = S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent);
  if (!par || S.age > 45 || S.q < 3 || farFromNK() || S.flags.hHelp != null || S.flags.hadHome) return 0;
  if (S.flags.rich && price) return price * (S.flags.rich === 2 ? 1 : 0.6);
  return incomeAt(c, 0.5) * (S.q - 2) * (HOME_HELP.includes(c.id) ? 1.5 : 0.5);
}
const LOW_DOWN = ['USA', 'GBR', 'CAN', 'AUS', 'NZL', 'IRL'];
const RENT_Q = [1.6, 1.3, 1, 0.7, 0.4];
const rentLife = () => { if (S.flags.rentL == null) S.flags.rentL = chance((1 - clamp((HOME_OWN_C[S.cur] || HOME_OWN_R[C().p] || 0.65) * 1.4, 0.3, 0.95)) * RENT_Q[clamp(S.q, 1, 5) - 1]) ? 1 : 0; return !!S.flags.rentL; };
const houseFirstK = () => S.flags.hadHome || S.owns.house ? 1 : 0.8;
function houseDeal() {
  const c = C(), price = housePrice(c) * houseFirstK(), P = S.fam.partner;
  const hh = Math.max(0, S.income) + (S.fam.married && P && P.alive ? P.inc || 0 : 0);
  if (S.age > 55) return S.money >= price ? { price, help: 0, loan: 0 } : null;
  const help = homeHelp(price), down = Math.max(0, S.money) + help, loan = Math.max(0, price - down);
  if (S.income <= 0 || down < price * (LOW_DOWN.includes(c.id) ? 0.1 : 0.2) || loan * 0.06 > hh * 0.4) return null;
  return { price, help, loan };
}
const carK = c => clamp(0.3 + 0.7 * (c.ppp - 8000) / 40000, 0.3, 1);
const phoneK = c => clamp(0.25 + 0.75 * (c.ppp - 5000) / 45000, 0.25, 1);
function itemPrice(k) { const c = C(); return k === 'house' ? housePrice(c) : usd2ppp(c, ITEMS[k].usd * (k === 'car' ? carK(c) : k === 'phone' ? phoneK(c) : 1)); }
function carValue() { const y = S.owns.car != null ? Math.max(0, S.age - S.owns.car) : 10; return Math.max(itemPrice('car') * 0.09, itemPrice('car') * Math.pow(0.85, y)); }
const fitK = a => a < 50 ? 1 : a < 65 ? 0.8 : a < 75 ? 0.6 : a < 85 ? 0.45 : 0.3;
function canFinance(k, price) { return (k === 'car' || k === 'moto') && isWorking() && S.income > 0 && !debtHeavy() && S.money < price * 1.1 && price / 4 <= shopInc() * 0.16; }
function carUpgrade() {
  const n0 = netWorth(); fxStart(); const h0 = carH0();
  delete S.owns.moto; S.money += usd2ppp(C(), 400) - itemPrice('car'); S.owns.car = S.age; eff({ h: ITEMS.car.joy });
  log("Bạn bán chiếc xe máy cũ và mua một chiếc ô tô nhỏ." + carBought(h0), 'ev');
  fxEnd(); bookSince(n0, L`${ITEMS.car.n} 구입`);
}
function gadgetCame(k) {
  const n0 = netWorth(); fxStart();
  S.money -= itemPrice(k); S.owns[k] = S.age; eff({ h: ITEMS[k].joy });
  if (k !== 'phone' && S.flags.noPow != null && !S.flags.power && !S.urban && S.cur === S.born) log("Cuối cùng điện cũng về đến làng. Ban đêm trong nhà cũng sáng trưng.", 'warm');
  if (k !== 'phone') S.flags.power = 1;
  log(k === 'phone' ? "Bạn có chiếc điện thoại thông minh đầu tiên." : k === 'pc' ? "Bạn có chiếc máy tính của riêng mình." : "Nhà bạn đã có tivi và tủ lạnh.", 'ev');
  fxEnd(); bookSince(n0, L`${ITEMS[k].n} 구입`);
}
const MOTO_TASTE = { lac: 0.6, MEX: 0.3, ZAF: 0.08 };
function motoTaste(c) { if (S.flags.motoT == null) S.flags.motoT = chance(MOTO_TASTE[c.id] != null ? MOTO_TASTE[c.id] : MOTO_TASTE[c.p] != null ? MOTO_TASTE[c.p] : 1) ? 1 : 0; return !!S.flags.motoT; }
function buyable(keys) {
  const c = C();
  for (const k of keys || ['phone', 'tv', 'moto', 'car', 'house']) {
    const it = ITEMS[k]; if (S.owns[k] || S.age < it.age || (it.only && !it.only(c))) continue;
    if (k === 'phone' && (c.net < 5 || phoneCommon(c) || !smartOK(c))) continue;
    const nNo = S.flags['skipN_' + k] || (S.flags['skip_' + k] != null ? 1 : 0);
    if (S.flags['skip_' + k] != null && (nNo >= (k === 'house' ? 4 : 3) || S.age - S.flags['skip_' + k] < (k === 'house' ? 3 : nNo >= 2 ? 10 : 6))) continue;
    if (k === 'moto' && (S.flags.noMoto || S.owns.car || S.age > 55 || (disOn() && S.dis.k !== 'hear') || !motoTaste(c))) continue;
    if (k === 'car' && disOn() && S.dis.k === 'sight') continue;
    if (k === 'car' && S.age > 60) continue;
    if ((k === 'car' || k === 'moto') && S.flags.licRet != null) continue;
    if (k === 'car' && S.flags.soldCar != null && (S.age >= 70 || S.age - S.flags.soldCar < 8)) continue;
    const price = itemPrice(k);
    if (k === 'house' ? S.age <= 60 && !!houseDeal() : S.money > price * 1.1 || canFinance(k, price)) return k;
  }
  return null;
}
const HOB_MAJ = { art: 'art', crafts: 'art', photo: 'art', music: 'mus', dance: 'dnc', karaoke: 'art', drama: 'art', reading: 'hum', faith: 'hum', games: 'cs', garden: 'agr', gym: 'pe', sport: 'pe', cooking: 'hosp', travel: 'hosp', sns: 'media' };
const TAL_MAJ = { bd: 'pe', ar: 'art', mu: 'art', hd: 'eng', wd: 'media' };
const TAL_W = () => ({ bd: "Thể thao", ar: "vẽ", mu: "Âm nhạc", hd: "khéo tay", wd: "ăn nói" });
function talMajor(ok) {
  const t = talEnsure(), k = (S.flags.talShown || []).filter(x => TAL_MAJ[x] && t[x] >= 1 && ok.includes(TAL_MAJ[x])).sort((x, y) => t[y] - t[x])[0];
  return k ? { k: TAL_MAJ[k], w: TAL_W()[k] } : null;
}
function hobbyMajor(ok) {
  let best = null;
  for (const hb of S.hobbies || []) {
    let k = HOB_MAJ[hb.id] || (hb.id.startsWith('sp_') ? 'pe' : null);
    if (k && MAJORS[k] && MAJORS[k].aud && !ok.includes(k)) k = 'art';
    if (!k || !ok.includes(k) || hb.since > 18 || hb.lv < 2) continue;
    if (!best || hb.lv > best.lv) best = { k, id: hb.id, lv: hb.lv };
  }
  return best;
}
const MAJORS = {
  med: { n: "Y khoa", d: "Bác sĩ hoặc điều dưỡng · học nhiều năm, khó vào", jobs: ['doctor', 'nurse', 'prof'] },
  nurse: { n: "Điều dưỡng", d: "Điều dưỡng · ở đâu cũng có việc làm", jobs: ['nurse', 'care', 'healthtech'], w: 1.3 },
  law: { n: "Luật", d: "Luật sư, công chức, cảnh sát", jobs: ['lawyer', 'civil', 'police'], w: 0.65 },
  eng: { n: "Kỹ thuật", d: "Kỹ sư, kỹ thuật viên", jobs: ['engineer', 'electric', 'dev', 'mechanic'], w: 2 },
  cs: { n: "Khoa học máy tính", d: "Lập trình viên phần mềm, kỹ sư", jobs: ['dev', 'engineer'], w: 0.8 },
  biz: { n: "Kinh doanh và kinh tế", d: "Nhân viên văn phòng, tài chính, khởi nghiệp", jobs: ['finance', 'clerk', 'owner', 'shop', 'salesagent'], w: 3 },
  edu: { n: "Sư phạm", d: "giáo viên", jobs: ['teacher', 'civil', 'childcare', 'social'], w: 1.3 },
  sci: { n: "Khoa học tự nhiên", d: "Nhà nghiên cứu, giáo viên, kỹ sư", jobs: ['prof', 'teacher', 'engineer', 'dev', 'healthtech'] },
  hum: { n: "Khoa học nhân văn", d: "Giáo viên, nhân viên văn phòng, nhà văn", jobs: ['teacher', 'clerk', 'creator', 'prof', 'civil', 'social'], w: 1.1 },
  art: { n: "Nghệ thuật và thiết kế", d: "Nghệ sĩ, nhà thiết kế", jobs: ['creator', 'designer', 'teacher', 'artisan'], w: 0.65 },
  agr: { n: "Nông nghiệp", d: "Quản lý trang trại, nhà nghiên cứu", jobs: ['agbiz', 'prof', 'civil'], w: 0.35 },
  pe: { n: "Thể dục thể thao", d: "Giáo viên thể dục, huấn luyện viên, huấn luyện viên thể hình", jobs: ['teacher', 'coach', 'trainer'] },
  soc: { n: "Khoa học xã hội", d: "Nhân viên công tác xã hội, công chức, nhân viên văn phòng, nhà nghiên cứu", jobs: ['social', 'civil', 'clerk', 'prof', 'salesagent'], w: 1.3 },
  media: { n: "Báo chí và truyền thông", d: "Phát thanh truyền hình, quảng cáo, quan hệ công chúng, nhà sáng tạo nội dung", jobs: ['creator', 'clerk', 'designer', 'salesagent'], w: 0.4 },
  arch: { n: "Kiến trúc", d: "Kiến trúc sư, kỹ sư · văn phòng thiết kế", jobs: ['engineer', 'designer', 'construct'], w: 0.2 },
  hosp: { n: "Du lịch, khách sạn và ẩm thực", d: "Khách sạn, công ty du lịch, đầu bếp, khởi nghiệp", jobs: ['cook', 'clerk', 'salesagent', 'shop'], w: 0.5 },
  mil: { n: "Khoa học quân sự", d: "Học viện quân sự · sĩ quan", jobs: ['soldier', 'police', 'civil'], acad: 1 },
  mus: { n: "Âm nhạc", d: "Nghệ sĩ biểu diễn, ca sĩ, nhà soạn nhạc, giáo viên âm nhạc", jobs: ['musician', 'teacher', 'creator'], aud: 1 },
  dnc: { n: "Múa", d: "Diễn viên múa, biên đạo múa, giáo viên dạy múa", jobs: ['dancer', 'teacher', 'trainer'], aud: 1 },
};
const PRO_AFTER = new Set(['USA', 'CAN']);
const majCardN = k => PRO_AFTER.has(S.cur) && k === 'med' ? "Y khoa (bậc đại học học dự bị y)" : PRO_AFTER.has(S.cur) && k === 'law' ? "Luật (bậc đại học học dự bị luật)" : MAJORS[k].n;
const majCardD = k => PRO_AFTER.has(S.cur) && k === 'med' ? "Học trường y 4 năm sau 4 năm đại học · con đường thành bác sĩ · rất khó vào" : PRO_AFTER.has(S.cur) && k === 'law' ? "Học trường luật 3 năm sau 4 năm đại học · luật sư, công chức, cảnh sát" : MAJORS[k].d;
const AUD_MAJ = { mus: { h: 'music', t: 'mu', since: 15, lv: 3 }, dnc: { h: 'dance', t: 'bd', since: 12, lv: 4.5 } };
const audHob = k => { const A = AUD_MAJ[k]; return (S.hobbies || []).find(h => h.id === A.h && h.since <= A.since && h.lv >= A.lv); };
const audSchool = h => S.flags.artsHH ? S.flags.artsHH === h.id : S.flags.artsHS === 'art';
const audOK = k => { const h = audHob(k); return !!h && (S.q >= 4 || !!S.flags.rich || tal(AUD_MAJ[k].t) >= 1.3 || audSchool(h)); };
const audP = k => { const h = audHob(k); return h ? clamp(0.25 + 0.07 * (h.lv - AUD_MAJ[k].lv) + 0.1 * tal(AUD_MAJ[k].t) + 0.05 * (S.q - 3) + (audSchool(h) ? 0.15 : 0), 0.1, 0.85) : 0.1; };
const MAJOR_CMP = { law: 2, cs: 1, eng: 1, nurse: 1, arch: 1 };
const majorCmp = k => k === 'cs' && C().ppp > 15000 ? 2 : MAJOR_CMP[k] || 0;
const majorP = k => { const sm = S.st.sm, q = (S.q - 3) * 0.04; return majorCmp(k) === 2 ? clamp(0.45 + (sm - 60) * 0.02 + q, 0.1, 0.97) : clamp(0.7 + (sm - 50) * 0.012 + q, 0.3, 0.98); };
function dreamMajor(ok) {
  const id = S.flags.kidDream; if (!id || !JOBS[id] || JOBS[id].e < 4) return null;
  const ks = ok.filter(k => MAJORS[k].jobs.includes(id));
  return ks.length ? ks.sort((x, y) => MAJORS[x].jobs.indexOf(id) - MAJORS[y].jobs.indexOf(id))[0] : null;
}
const MAJOR_ALT = ['hum', 'soc', 'biz', 'edu', 'sci', 'agr', 'media', 'hosp'];
const oddsWord = p => p >= 0.6 ? "tương đối cao" : p >= 0.35 ? "khoảng một nửa" : "tương đối thấp";
const JOB_AV = { farm: 2.5, farmhand: 1.3, herder: 0.6, fisher: 0.4, agbiz: 0.08, construct: 2.5, factory: 2.5, garment: 0.9, miner: 0.3, artisan: 1, mechanic: 0.6, electric: 0.5, engineer: 1.2,
  vendor: 3, shop: 2.2, domestic: 0.9, driver: 1.6, delivery: 0.5, cook: 1.6, guard: 0.7, hair: 0.7, care: 0.7, clerk: 0.9, callc: 0.4, teacher: 0.6, nurse: 0.8, police: 0.1, soldier: 0.1,
  civil: 0.35, finance: 0.8, dev: 0.6, doctor: 0.5, lawyer: 0.35, prof: 0.4, creator: 1, designer: 0.08, coach: 0.04, trainer: 0.025,
  cleaner: 3, warehouse: 0.5, childcare: 0.1, healthtech: 0.8, social: 0.25, salesagent: 0.15, welder: 0.2, pilot: 0.0035, cabin: 0.009 };
const SEC_K = { agr: 3.5, ind: 1.0, ser: 0.75 };
const SELF_JOBS = ['farm', 'herder', 'fisher', 'vendor', 'artisan', 'creator', 'owner', 'agbiz'];
const JOB_FAM = { farm: 'agr', farmhand: 'agr', herder: 'agr', fisher: 'agr', agbiz: 'agr', construct: 'build', miner: 'build', artisan: 'craft', hair: 'craft',
  factory: 'plant', garment: 'plant', mechanic: 'tech', electric: 'tech', engineer: 'tech', dev: 'tech', vendor: 'trade', shop: 'trade', owner: 'trade', cook: 'food',
  driver: 'move', delivery: 'move', guard: 'secu', police: 'secu', soldier: 'secu', domestic: 'care', care: 'care', nurse: 'health', doctor: 'health',
  clerk: 'office', callc: 'office', finance: 'office', civil: 'office', teacher: 'teach', prof: 'teach', lawyer: 'law', creator: 'art', musician: 'art', artist: 'art', actor: 'art', dancer: 'art', designer: 'art', athlete: 'sport', coach: 'sport', trainer: 'sport',
  cleaner: 'care', warehouse: 'move', childcare: 'teach', healthtech: 'health', social: 'care', salesagent: 'trade', welder: 'build', clergy: 'faith', pilot: 'air', cabin: 'air', boardpro: 'teach', progamer: 'sport' };
function expMap() {
  if (!S.exp) { S.exp = {}; if (JOBS[S.job] && !NONWORK.includes(S.job) && S.jobY) S.exp[S.job] = [S.jobY, S.pct]; }
  return S.exp;
}
const workYrs = () => Object.values(expMap()).reduce((a, e) => a + ((e && e[0]) || 0), 0);
const MIG_STAY = ['farm', 'herder', 'fisher', 'vendor', 'artisan', 'owner', 'agbiz', 'civil', 'police', 'soldier', 'lawyer'];
function expIn(id) {
  const X = expMap(), f = JOB_FAM[id], mx = S.mig && S.flags.migX ? S.flags.migX : null, yrs = k => Math.max(0, X[k][0] - (mx && mx[k] || 0)); let fam = 0;
  if (f) for (const k in X) if (k !== id && JOB_FAM[k] === f) fam += yrs(k);
  const same = X[id] ? yrs(id) : 0;
  return { same, was: X[id] && same > 0 ? X[id][1] : null, fam };
}
const medLine = sm => MED_K * Math.pow(clamp((sm - 92) / 8, 0, 1), 2);
const MED_K = 0.45;
const MAJOR_REQ = { doctor: ['med'], nurse: ['med', 'nurse'], lawyer: ['law'], engineer: ['eng', 'cs', 'sci', 'arch'], healthtech: ['med', 'nurse', 'sci'] };
const MAJOR_MOST = { dev: [['cs', 'eng', 'sci'], 0.12], designer: [['art', 'cs', 'eng', 'arch', 'media'], 0.15], finance: [['biz', 'law', 'sci', 'eng', 'cs'], 0.2, { hum: 0.5, soc: 0.6, edu: 0.35, agr: 0.35, media: 0.35, pe: 0.1 }] };
const PRO_JOB = { med: 'doctor', nurse: 'nurse' };
const GRAD_RARE = new Set(['cleaner', 'domestic', 'farmhand', 'garment', 'miner', 'construct']);
const GRAD_MAN = new Set(['factory', 'warehouse', 'driver', 'delivery', 'guard']);
const GRAD_LAND = new Set(['farm', 'herder', 'fisher']);
const MINW = { KOR: 0.62, JPN: 0.46, USA: 0.4, GBR: 0.61, FRA: 0.62, DEU: 0.52, AUS: 0.53, CAN: 0.51, NZL: 0.67, ESP: 0.5, NLD: 0.47, BEL: 0.44, IRL: 0.51, PRT: 0.66, GRC: 0.5, POL: 0.55, CZE: 0.43, SVK: 0.51, HUN: 0.49, ISR: 0.55, TUR: 0.7, CHL: 0.72, MEX: 0.47, COL: 0.92, CRI: 0.7 };
const MINW_FT = 1.15;
function minPct(c, id, formal) {
  const r = MINW[c.id]; if (!r || !formal || !JOBS[id] || calYr() < 2015) return 0;
  if (SELF_JOBS.includes(id) || JOBS[id].special) return 0;
  return pctOfIncome(c, incomeAt(c, 0.5) * r * MINW_FT);
}
const PAY_GAP = { KOR: [29.3, 2023, 'o'], ISR: [25.4, 2022, 'o'], JPN: [21.3, 2024, 'o'], CAN: [17.1, 2022, 'o'], USA: [16.9, 2024, 'o'], MEX: [16.7, 2022, 'o'],
  FIN: [15.3, 2021, 'o'], GBR: [14.3, 2024, 'o'], DEU: [14.2, 2024, 'o'], NLD: [13.2, 2021, 'o'], AUT: [11.1, 2024, 'o'], BRA: [11.1, 2022, 'o'], AUS: [10.7, 2024, 'o'],
  FRA: [9.6, 2024, 'o'], NZL: [9.2, 2022, 'o'], ARG: [9.1, 2024, 'o'], SWE: [7.5, 2024, 'o'], PRT: [6.1, 2022, 'o'], DNK: [5.8, 2022, 'o'], NOR: [4.7, 2024, 'o'],
  ITA: [4.0, 2024, 'o'], IRL: [2.0, 2022, 'o'], COL: [1.9, 2022, 'o'], CRI: [1.4, 2022, 'o'], BEL: [1.1, 2024, 'o'],
  IND: [34, 2018, 'i'], PAK: [25, 2025, 'i'], LKA: [22, 2025, 'i'], NPL: [18, 2025, 'i'], BGD: [0, 2025, 'e'], PHL: [0, 2018, 'e'] };
const PAY_GAP_OE = new Set(['ESP', 'POL', 'CHL', 'CZE', 'HUN', 'CHE', 'GRC', 'SVK', 'TUR']), PAY_GAP_OECD = 11.3, PAY_GAP_W = 18;
const PAY_OECD = new Set(['USA', 'MEX', 'TUR', 'JPN', 'DEU', 'COL', 'GBR', 'FRA', 'ITA', 'CAN', 'ESP', 'POL', 'AUS', 'KOR', 'CHL', 'ISR', 'NLD', 'BEL', 'SWE', 'CZE', 'PRT', 'HUN', 'CHE', 'AUT', 'GRC', 'NZL', 'DNK', 'IRL', 'SVK', 'CRI', 'NOR', 'FIN']);
const PAY_GAP_PAST = { USA: [[1960, 39.3], [1970, 40.6], [1975, 41.2], [1979, 37.7], [1990, 28.1], [2000, 23.1], [2010, 18.8]],
  KOR: [[1993, 47.3], [2005, 39.6], [2010, 39.6], [2015, 37.2], [2018, 34.1], [2022, 31.2]],
  JPN: [[1990, 40.6], [1995, 37.1], [2000, 33.9], [2005, 32.8], [2010, 28.7], [2015, 25.7], [2021, 22.1]],
  GBR: [[1990, 31.2], [1995, 26.6], [2005, 22.1], [2010, 19.2], [2015, 17.1], [2022, 14.5]] };
const PAY_OCC = { ssa: 0.14 }, PAY_WF = { KOR: 0.41, sa: 0.33, mena: 0.38, ssa: 0.45, eap: 0.5, lac: 0.44 };
function payGapOf(c, y = calYr()) {
  const d = PAY_GAP[c.id], g0 = d ? d[0] : PAY_GAP_OE.has(c.id) ? PAY_GAP_OECD : PAY_GAP_W, y0 = d ? d[1] : 2023;
  if (y >= y0) return g0;
  const s = PAY_GAP_PAST[c.id];
  if (s) { const p = s.concat([[y0, g0]]); if (y <= p[0][0]) return p[0][1]; for (let i = 1; i < p.length; i++) if (y <= p[i][0]) return p[i - 1][1] + (p[i][1] - p[i - 1][1]) * (y - p[i - 1][0]) / (p[i][0] - p[i - 1][0]); }
  if (PAY_OECD.has(c.id)) return Math.min(50, g0 + 0.35 * (y0 - Math.max(y, 1975)));
  return g0;
}
function payGapSexK(c, sex) {
  const g = payGapOf(c); if (!(g > 0)) return 1;
  const R = clamp((1 - g / 100) / (1 - (PAY_OCC[c.p] || 0)), 0.4, 1), w = PAY_WF[c.id] || PAY_WF[c.p] || 0.47;
  return Math.pow(R, sex === 'F' ? 1 - w : -w);
}
const payGapK = id => { if (!S || !JOBS[id] || JOBS[id].special || RARE_JOBS.includes(id) || id === 'shelter') return 1; const k = payGapSexK(C(), meSex()); return SELF_JOBS.includes(id) ? Math.sqrt(k) : k; };
const payGapPct = (p, id) => { const k = payGapK(id); return k === 1 ? p : pctOfIncome(C(), incomeAt(C(), p) * k); };
const PAY_GAP_T = 0.00035;
const payGapLineOK = () => S.flags.payGapT == null && meSex() === 'F' && isWorking() && S.jobY >= 2 && !SELF_JOBS.includes(S.job) && payGapK(S.job) !== 1 && payGapOf(C()) >= 5;
function payGapFact() {
  const c = C(), d = PAY_GAP[c.id], y = calYr(), s = PAY_GAP_PAST[c.id];
  if (s && y < (d ? d[1] : 2023) - 2 && y >= s[0][0]) return L`${y}년 무렵 ${c.ko}에서 전일제로 일하는 여성의 중위 임금은 남성보다 약 ${Math.round(payGapOf(c, y))}% 낮았습니다 (${c.id === 'USA' ? "Cục Thống kê Lao động và Cục Điều tra Dân số Mỹ" : 'OECD'})`;
  if (d && d[2] === 'o') return L`OECD: ${c.ko}에서 전일제로 일하는 여성의 중위 임금은 남성보다 약 ${d[0]}% 낮습니다 (${d[1]}년)`;
  if (d && d[2] === 'i') return L`ILO: ${c.ko}에서 여성의 시간당 임금은 남성보다 약 ${d[0]}% 낮습니다 (${d[1]}년)`;
  if (PAY_GAP_OE.has(c.id)) return "Tính trung bình ở các nước thành viên OECD, mức lương trung vị của phụ nữ làm việc toàn thời gian thấp hơn nam giới khoảng 11% (năm 2023)";
  return "ILO: trên toàn thế giới, phụ nữ được trả lương ít hơn nam giới khoảng 18% (ước tính năm 2026)";
}
const payPct = (pct, id, formal) => rohCamp() ? clamp(Math.min(pct - (S.migPen || 0), ROH_PCT), 0.004, ROH_PCT) : clamp(Math.max(payGapPct(pct - (S.migPen || 0), id), minPct(C(), id, formal)), 0.004, 0.996);
const GUEST_W = new Set(['KOR', 'JPN', 'TWN', 'SGP', 'MYS', 'SAU', 'ARE', 'QAT', 'KWT', 'OMN', 'BHR']);
const GUEST_OK = new Set(['care', 'domestic', 'cleaner', 'cook', 'warehouse', 'delivery', 'driver', 'guard', 'shop']);
const guestWorker = () => S.mig && S.cur !== S.born && GUEST_W.has(S.cur) && S.flags.natz !== S.cur && S.flags.pr == null && S.edu < 4 && !S.refugee
  && !(S.fam.married && S.fam.partner && S.fam.partner.alive && (S.fam.partner.nat || S.cur) === S.cur);
const ARTS_JOB_H = { musician: 'music', dancer: 'dance', artist: 'art', actor: 'drama' };
const ARTS_MAJ_J = { musician: 'mus', dancer: 'dnc', artist: 'art' }, ARTS_OFF_K = 0.5;
const artsOffer = id => !!ARTS_MAJ_J[id] && S.edu >= 4 && S.major === ARTS_MAJ_J[id] && !(id === 'dancer' && S.age > 35);
function jobOffers(n = 3, change = false, deg = false, force = null) {
  const c = C(), out = [], e = S.edu, late = lateCareer(), guestW = guestWorker();
  const inf = informal(c);
  const shares = { agr: c.agr / 100, ind: { eap: 0.27, eca: 0.27, mena: 0.25, hi: 0.2, lac: 0.2, sa: 0.24, ssa: 0.11 }[c.p] };
  shares.ser = Math.max(0.1, 1 - shares.agr - shares.ind);
  const w = {}, sec = {}, sumAV = { agr: 0, ind: 0, ser: 0 }, pw = parentWork();
  const gradJobs = clamp(clamp(0.08 + 0.3 * c.ppp / 60000, 0.08, 0.38) / Math.max(0.05, eduProbs(c, 'M', 3, false).p4), 0.25, 1);
  for (const id in JOBS) {
    const j = JOBS[id]; if (j.special && !(id === 'coach' && (S.major === 'pe' || sportBack())) && !artsOffer(id)) continue;
    if (rohG() && S.refugee && !ROH_CAMP_J.includes(id)) continue;
    if (rohStateless() && (id === 'civil' || id === 'police' || id === 'soldier')) continue;
    if (ddJobNo(id)) continue;
    if (DRIVE_J.includes(id) && licOff()) continue;
    if (!TALIBAN_F_JOBS.has(id) && talibanF()) continue;
    if (guestW && !GUEST_OK.has(id) && JOBS[id].s !== 'agr' && JOBS[id].s !== 'ind') continue;
    const mj = e >= 4 ? S.major : null;
    if (mj && MAJOR_REQ[id] && !MAJOR_REQ[id].includes(mj)) continue;
    const mm = MAJOR_MOST[id], most = mj && mm && !mm[0].includes(mj) && !(id === 'dev' && S.flags.codeOK) ? (mm[2] && mm[2][mj] != null ? mm[2][mj] : mm[1]) : 1;
    const need = (id === 'doctor' && mj === 'med') || (id === 'lawyer' && mj === 'law') ? 4 : j.e;
    if (need > e && S.flags.skill !== id && !(id === 'dev' && S.flags.codeOK && S.flags.codeAt <= S.age) && !((trainOn(id) || hsOn(id)) && need - e <= 1)) continue;
    if (j.only && !j.only.split(',').some(x => x === c.p || x === c.id)) continue;
    if (j.net && !eraNetOK(j, c)) continue;
    if (j.rich && c.ppp < 25000) continue;
    if (!disJobOK(id)) continue;
    if ((id === 'pilot' || id === 'cabin') && !expIn(id).same && !(id === 'pilot' && S.flags.offc != null && expIn('soldier').same >= 5) && (change || S.age > (id === 'pilot' ? 30 : 35))) continue;
    if (S.flags.mandAt != null && (id === 'soldier' || id === 'police' || id === 'civil')) continue;
    if (S.flags.oldLook != null && id === S.flags.oldJob) continue;
    if (id === 'agbiz' && S.q < 4 && S.money < incomeAt(c, 0.5) * 3) continue;
    const av = JOB_AV[id] || 1, ek = eraJobK(id, c); if (!ek || ethNoJob(id)) continue;
    sec[id] = j.s; sumAV[j.s] += av;
    let wt = av * ek * most * (id === 'prof' && S.flags.dr != null ? 2.5 : 1) * casteLand(id);
    if (j.u === 1) wt *= S.urban ? 1.6 : (lowInc(c) ? 0.25 : 0.7);
    if (j.u === -1) wt *= S.urban ? 0.08 : 2.2;
    if (j.fem && S.sex === 'F') wt *= j.fem; if (j.fem && S.sex === 'M') wt /= j.fem * 1.5;
    if (j.male && S.sex === 'M') wt *= j.male; if (j.male && S.sex === 'F') wt /= j.male * 2;
    const gap = e - need; wt *= gap === 0 ? 2.2 : gap === 1 ? 1.4 : gap === 2 ? 0.7 : 0.35;
    if (e >= 4 && GRAD_RARE.has(id)) wt *= e >= 5 ? 0.15 : 0.35;
    if (e >= 4 && GRAD_LAND.has(id) && !expMap()[id]) wt *= (pw.has(id) ? 0.35 : 0.15) * (e >= 5 ? 0.4 : 1);
    if (j.e >= 4) wt *= gradJobs * Math.exp(SK_DEG * clamp(kzOf(), -2, 2.5));
    if (j.rare) wt *= j.rare;
    if (id === 'pilot' || id === 'cabin') wt *= clamp(Math.pow(c.ppp / 70000, 1.5), 0.03, 1);
    if (trainOn(id) || hsOn(id)) wt *= 4;
    if (S.mig && j.e >= 4 && !S.flags.skilledMig) wt *= 0.3;
    if (id === 'trainer') wt *= clamp(c.ppp / 30000, 0.15, 1) * (S.hobbies.some(h => h.id === 'gym') ? 2.5 : 1);
    if ((id === 'coach' || id === 'trainer') && sportBack()) wt *= 3;
    if (artsOffer(id)) wt *= ARTS_OFF_K * artsK('art');
    if (S.mig && S.flags.natz !== S.cur && ['civil', 'police', 'soldier'].includes(id)) continue;
    if (!papersOK() && STATE_JOBS.includes(id)) continue;
    if (S.flags.studyStay != null && S.age - S.flags.studyStay <= 3) wt *= j.e >= 4 ? 3 : j.e <= 1 ? 0.25 : 1;
    if (change && id === S.job && (SELF_JOBS.includes(id) || id === 'soldier')) continue;
    const X = expIn(id);
    if (pw.has(id) && !(S.mig && MIG_STAY.includes(id))) wt *= HEIR_JOBS.includes(id) ? (S.urban && j.u === -1 ? 1.2 : 2.5) : 2;
    if (mj && MAJORS[mj]) { const fit = MAJORS[mj].jobs.includes(id), cold = fit && j.e >= 4 && !X.same && X.fam < 2 && S.age - (S.flags.degAt != null ? S.flags.degAt : 23) >= 12; wt *= fit ? (cold ? 0.5 : 3.5) : j.e >= 4 ? 0.6 : 1; }
    if (id === 'designer' && (mj === 'art' || mj === 'media') && !(S.age - (S.flags.degAt != null ? S.flags.degAt : 23) >= 12 && !X.same)) wt *= 4;
    if (id === 'engineer' && mj === 'arch' && !(S.age - (S.flags.degAt != null ? S.flags.degAt : 23) >= 12 && !X.same)) wt *= 2;
    if (deg) wt *= j.e >= 4 ? 4 : 0.15;
    else if (X.same >= 1) wt *= change ? 2 + Math.min(X.same, 10) * 0.4 : 4 + Math.min(X.same, 10) * 1.1;
    else if (X.fam >= 2) wt *= change ? 2.5 : 3;
    else { const lj = JOBS[isWorking() ? S.job : S.flags.lastJob]; if (lj && lj.s === j.s) wt *= change ? 2.2 : 1.5; }
    if (!change && !S.urban && j.s === 'agr' && S.stats.jobs && S.flags.lastJob && JOBS[S.flags.lastJob] && JOBS[S.flags.lastJob].s !== 'agr') wt *= 2;
    if (['soldier', 'police'].includes(id) && S.age > 30) wt *= 0.1;
    if (id === 'soldier' && S.served && S.age <= 26 && !S.flags.offc && !S.flags.ncoOut && !svcSup()) wt *= 2.5;
    if (['civil', 'police', 'soldier', 'teacher', 'nurse', 'doctor', 'lawyer', 'finance', 'prof'].includes(id)) wt *= 1 - 0.85 * recLic();
    if (S.flags.polRec && calYr() < S.flags.polRec && ['civil', 'police', 'soldier', 'teacher', 'finance', 'prof'].includes(id)) wt *= 0.3;
    if (['civil', 'police', 'soldier'].includes(id) && partyOf(c)) wt *= partyMem() ? 1.8 : 0.8;
    if (['civil', 'soldier'].includes(id) && S.flags.royal === 'r' && ROYAL_GULF.has(S.born) && S.cur === S.born) wt *= 2.5;
    wt *= resJobK(id);
    if (id === 'civil' && S.age > 40) wt *= 0.3;
    if (late) { if (['civil', 'police', 'soldier'].includes(id)) continue; wt *= LATE_W[id] || (j.e >= 3 ? (X.same >= 5 ? 0.3 : 0.06) : 1); }
    w[id] = wt;
  }
  const gradAg = e >= 4 && S.major !== 'agr' ? 0.06 : 1;
  for (const id in w) w[id] *= shares[sec[id]] * SEC_K[sec[id]] * 10 / sumAV[sec[id]] * (sec[id] === 'agr' ? gradAg : 1);
  const first = [], last0 = isWorking() ? S.job : S.flags.lastJob, last = last0 === 'owner' && S.flags.ownFrom && JOBS[S.flags.ownFrom] && S.flags.ownFrom !== 'owner' ? S.flags.ownFrom : last0;
  const pj = e >= 4 && PRO_JOB[S.major];
  if (!force && pj && w[pj] != null && !expIn(pj).same && S.age < 50 && !(S.mig && !S.flags.skilledMig)) force = pj;
  if (force && w[force] != null) first.push(force);
  else if (!deg && last && w[last] != null && !(late && JOBS[last].e >= 3)) { const xs = expIn(last).same; if (xs >= 1 && chance(clamp((change ? 0.2 : 0.4) + (change ? 0.03 : 0.05) * xs, 0.2, change ? 0.45 : 0.85))) first.push(last); }
  for (let i = 0; i < n && Object.keys(w).length; i++) {
    const id = first.length ? first.shift() : wpick(w); delete w[id];
    const j = JOBS[id];
    const formalP = clamp(1 - inf * ({ civil: 0.1, teacher: 0.3, nurse: 0.3, doctor: 0.3, police: 0.1, soldier: 0.1, clerk: 0.4, engineer: 0.4, finance: 0.3, dev: 0.4, factory: 0.7, callc: 0.4, electric: 0.8, prof: 0.2, lawyer: 0.5, childcare: 0.4, healthtech: 0.3, social: 0.2, warehouse: 0.5, salesagent: 0.8, welder: 0.9 }[id] || 1.15), 0.02, 0.98);
    const [lo, hi] = jobRange(id, c);
    let pctStart = clamp(lo + (hi - lo) * (0.04 + 0.4 * rnd() + 0.14) - 0.06 * recW() - (disOn() ? 0.03 : 0) + famEdge(c), 0.004, 0.99);
    pctStart = skillPct(c, pctStart);
    const X = expIn(id);
    const rmX = X.was != null ? clamp((hi + 0.04 - X.was) / Math.max(0.05, hi - lo) * 1.2, 0, 1) : 1;
    if (X.same >= 1 && X.was != null) pctStart = clamp(Math.max(pctStart, X.was + (change ? (0.01 + 0.03 * rnd()) * rmX : -0.02 - 0.04 * rnd())), 0.004, Math.min(0.99, Math.max(hi, X.was)));
    else if (X.same >= 1 || X.fam >= 2) pctStart = clamp(pctStart + Math.min(X.same * 0.012 + X.fam * 0.006, 0.12), 0.004, Math.min(0.99, hi));
    if (change) pctStart = clamp(pctStart + (S.focusW.learn || 0) * 0.01 * effLeft() * rmX, 0.004, 0.99);
    else if (S.flags.prep) pctStart = clamp(pctStart + 0.02 * S.flags.prep, 0.004, Math.min(0.99, hi));
    if (late) pctStart = clamp(pctOfIncome(c, incomeAt(c, pctStart) * 0.7), 0.004, 0.99);
    pctStart = Math.min(pctStart, Math.min(0.995, hi + 0.04));
    const fm = (STATE_J.has(id) || chance(formalP)) && S.flags.irreg == null && papersOK();
    out.push({ id, formal: fm, pct: Math.max(pctStart, minPct(c, id, fm)), xp: X.same >= 1 ? X.same : 0, xf: X.same < 1 && X.fam >= 2, late });
  }
  return out;
}
const SK_HIRE = 0.13, SK_DEG = 0.6;
const skillPct = (c, p) => { const z = clamp(kzOf(), -2, 2.5); return z ? clamp(pctOfIncome(c, incomeAt(c, p) * Math.exp(SK_HIRE * z)), 0.004, 0.99) : p; };
const famEdge = c => (S.q - 3) * (c.ppp < 15000 ? 0.032 : 0.025) * (S.mig ? 0.4 : 1) + ethHire();
const payTop = () => Math.min(0.995, jobRange(S.job, C())[1] + 0.04);
const OFF_PAY = [0.68, 0.9];
const offScale = () => !!(S && S.flags && (S.flags.offc != null || (S.job !== 'soldier' && S.edu >= 4)));
function jobRange(id, c, rk) {
  const j = JOBS[id]; let lo = j.lo, hi = j.hi;
  if (id === 'soldier' && (rk ? rk === 'o' : offScale())) { lo = OFF_PAY[0]; hi = OFF_PAY[1]; }
  if (j.s === 'agr' && id !== 'agbiz') hi = Math.max(hi, c.agr / 100 * 0.9 + 0.08);
  else if (j.e <= 1 && c.ppp < 15000) hi = Math.min(0.85, hi + 0.25 * (1 - c.ppp / 15000));
  const g = (typeof PCAL !== 'undefined' && PCAL[c.id] || 1) * (c.yr ? eraPcalK(c) : 1);
  if (g !== 1) { lo = Math.pow(lo, g); hi = Math.pow(hi, g); }
  if (id === 'owner' && S && S.flags && BIZ_K[S.flags.bizK] && BIZ_K[S.flags.bizK].hi) { const g2 = (typeof PCAL !== 'undefined' && PCAL[c.id] || 1) * (c.yr ? eraPcalK(c) : 1); hi = Math.max(hi, Math.pow(BIZ_K[S.flags.bizK].hi, g2)); }
  if (S && S.exp) hi = rankHi(id, hi, rankOf(id));
  if (id === 'coach' && S && S.exp && rankOf('coach') >= 2) hi = Math.max(hi, rankOf('coach') >= 3 || (S.ath && (S.ath.star || S.ath.maj)) ? 0.996 : 0.99);
  if (id === 'athlete' && S && S.ath && S.ath.star) hi = 0.997;
  else if (id === 'athlete' && S && S.ath && S.ath.maj) hi = Math.max(hi, 0.995);
  if (S && S.flags && ((id === 'musician' && (S.flags.musStar || S.flags.grammyL != null)) || (id === 'idol' && S.flags.grammyL != null))) hi = Math.max(hi, 0.99);
  if (S && S.flags && id === 'actor' && (S.flags.actStar || S.flags.oscarW)) hi = Math.max(hi, S.flags.oscarW ? 0.995 : 0.98);
  return [lo, hi];
}
const ownFromNow = () => { const j = JOBS[S.job] && !NONWORK.includes(S.job) && S.job !== 'owner' ? S.job : S.flags.lastJob; return j && j !== 'owner' && JOBS[j] ? j : null; };
function takeJob(o) {
  if (o.id === 'owner' && S.job !== 'owner') S.flags.ownFrom = ownFromNow();
  proArtMark(o.id);
  if (JOBS[S.job] && !NONWORK.includes(S.job)) S.flags.lastJob = S.job;
  { const v = S.flags.voc; if (v && v.left == null && o.id !== 'clergy' && !S.retired) { v.left = S.age; S.flags.celib = 0; if (S.flags.lastJob === 'clergy') log("Bạn rời bỏ con đường tu hành và trở về với đời thường."); } }
  S.flags.reSeek = null;
  if (lateCareer()) { S.flags.careerInc = Math.max(S.flags.careerInc || 0, S.lastInc || 0); if (S.flags.careerPct == null && S.stats.jobs) S.flags.careerPct = S.pct; }
  if (lateCareer() && S.flags.mandAt == null) { const m = mandAge(C()); if (m != null && S.age >= m - 1) S.flags.mandAt = S.age; }
  S.flags.rehireJob = null; S.flags.bizInh = 0;
  if (S.flags.apprUntil > S.age && o.id !== S.flags.skill) S.flags.apprUntil = null;
  S.stats.jobs = (S.stats.jobs || 0) + 1;
  S.job = o.id; S.jobY = 0; S.formal = o.formal; S.pct = o.pct;
  if (S.flags.dreamSeen && S.flags.dreamSeen.includes(o.id) && S.flags.dreamGot !== o.id && dreamWhy(o.id)) { S.flags.dreamGot = o.id; S.flags.dreamG = 0; }
  if (o.id === 'soldier' && S.edu >= 4 && S.flags.offc == null) S.flags.offc = S.age;
  const inc = offerInc(o);
  S.income = inc; S.lastInc = inc; uiMark();
  if (S.money === 0 && S.age < 30) S.money = incomeAt(C(), S.q / 5 - 0.1) * 0.15 * (S.q - 1);
}
const offerInc = o => incomeAt(C(), payPct(o.pct, o.id, o.formal)) * (S.focusW && S.focusW.work ? 1 + 0.1 * S.focusW.work : 1) * (S.flags.ptTo > S.age ? 0.6 : 1) * (S.flags.lessAt != null ? 0.55 : 1) * (S.flags.apprUntil > S.age && o.id === S.flags.skill ? 0.5 : 1) * (S.sex === 'F' && ddAutKid() ? DD_MOM : 1) * oldWorkK(S.age) * eraIncK();
const payNow = () => S.lastInc || S.income;
function offerText(o) {
  const inc = offerInc(o);
  return L`연 ${usdStr(inc) + ' PPP'} · 한국 체감 월 ${wonStr(inc / 12)} · ${o.formal ? (o.late ? "hợp đồng có thời hạn" : "việc làm chính thức (lương hưu, bảo hiểm)") : "việc làm phi chính thức"}` + (o.xp ? L` · 경력 ${o.xp}년 인정` : o.xf ? " · được tính kinh nghiệm làm việc tương tự" : '');
}
const MOM_WORK = { sa: 0.25, mena: 0.2, ssa: 0.6, eap: 0.6, lac: 0.5, eca: 0.6, hi: 0.65 };
const SOLO_MOM_WORK = { sa: 0.5, mena: 0.4, ssa: 0.75, eap: 0.75, lac: 0.75, eca: 0.72, hi: 0.72 };
function parJobPick(sex, age, b) {
  const c = B(), own = c.id === 'PRK' ? 'vendor' : 'owner';
  if (S.flags.rich && sex === 'M' && chance(0.65)) return own;
  const e = eduProbs(c, sex, S.q, S.urban), d = chance(e.t1 * e.t2 * e.t3 * e.t4);
  if (b >= 0.45 && chance((S.urban ? 0.1 : 0.04) + (!d && b > 0.8 ? 0.3 : 0))) return own;
  return partnerJobFor({ base: Math.min(b, d ? 1 : 0.76) - P_AGE(age), age, sex, dev: 0, mp: 0, deg: d, top: S.q >= 5, fam: 1 }, c);
}
const PAR_NOPAY = new Set(['homemaker', 'seeking', 'retired']);
const TOP_NO = new Set(['driver', 'delivery', 'guard', 'cook', 'vendor', 'factory', 'warehouse', 'shop', 'farm', 'care']);
const HEIR_JOBS = ['farm', 'herder', 'fisher', 'agbiz', 'vendor', 'artisan', 'owner'];
function parentJobs() {
  const f = S.fam; if (!f || !f.dad || f.dad.job !== undefined) return;
  const c = B(), base = clamp((S.q - 0.5) / 5 + (rnd() - 0.5) * 0.12, 0.02, 0.97);
  f.dad.job = parJobPick('M', f.dad.age, base);
  f.mom.job = chance(clamp((f.dad.absent ? SOLO_MOM_WORK : MOM_WORK)[c.p] * (S.q >= 4 ? 1.1 : 1), 0.1, 0.9)) ? parJobPick('F', f.mom.age, base - 0.05) : 'homemaker';
  f.pPct = base;
  parentHome();
  famBizDraw();
}
const FBIZ_W = { r2: [0.07, 0.25, 0.55, 0.13], r1: [0.45, 0.5, 0.05, 0], 5: [0.967, 0.03, 0.003, 0], 4: [0.98, 0.02, 0, 0], 3: [0.99, 0.01, 0, 0] };
function famBizDraw() {
  const f = S.fam; delete f.biz;
  const p = f.dad.job === 'owner' && !f.dad.absent ? 'dad' : f.mom.job === 'owner' ? 'mom' : null; if (!p) return;
  const w = FBIZ_W[S.flags.rich === 2 ? 'r2' : S.flags.rich ? 'r1' : S.q] || FBIZ_W[3];
  let r = rnd(), s = 0; while (s < 3 && r >= w[s]) { r -= w[s]; s++; }
  if (!s) return;
  const n = s === 1 ? 10 + Math.round(Math.pow(rnd(), 1.6) * 39) : s === 2 ? 50 + Math.round(Math.pow(rnd(), 1.8) * 199) : 250 + Math.round(Math.pow(rnd(), 2.2) * 4750);
  f.biz = { s, n, p };
}
const famBizOf = k => { const b = S && S.fam && S.fam.biz; return b && b.p === k && S.fam[k] && S.fam[k].job === 'owner' ? b.s : 0; };
function famBizName(b) {
  const st = b.s === 1 ? 5 : b.s === 2 ? 10 : 100, n = clamp(Math.round(b.n / st) * st, [10, 50, 300][b.s - 1], [45, 240, 1e6][b.s - 1]).toLocaleString('vi-VN');
  return b.s === 1 ? L`작은 회사 사장 (직원 약 ${n}명)` : b.s === 2 ? L`중소기업 대표 (직원 약 ${n}명)` : L`큰 회사 대주주 (직원 약 ${n}명)`;
}
const famBizFact = s => s === 2 ? "Ở Mỹ, công ty do nhóm 0,1% giàu nhất sở hữu thường là một doanh nghiệp địa phương có khoảng 100 nhân viên và doanh thu khoảng 20 triệu đô la mỗi năm (Smith và cộng sự 2019)"
  : B().id === 'KOR' ? "99,9% doanh nghiệp ở Hàn Quốc là doanh nghiệp vừa và nhỏ (Ministry of SMEs and Startups 2024)" : "99% doanh nghiệp ở EU có dưới 50 người làm việc, và 0,2% có từ 250 người trở lên (Eurostat 2022)";
const HOME_OWN_C = { KOR: 0.57, JPN: 0.61, USA: 0.65, GBR: 0.64, DEU: 0.47, FRA: 0.63, ITA: 0.74, ESP: 0.76, NLD: 0.7, SWE: 0.64, NOR: 0.8, DNK: 0.6, FIN: 0.69,
  CHE: 0.42, AUT: 0.51, BEL: 0.71, POL: 0.87, ROU: 0.95, HUN: 0.91, CZE: 0.76, GRC: 0.7, PRT: 0.78, IRL: 0.69, CAN: 0.66, AUS: 0.66, NZL: 0.64, ISR: 0.66,
  TUR: 0.57, RUS: 0.89, CHN: 0.89, TWN: 0.84, HKG: 0.51, SGP: 0.89, MYS: 0.77, THA: 0.8, VNM: 0.9, IDN: 0.84, IND: 0.87, BRA: 0.7, MEX: 0.68, ARG: 0.66,
  CHL: 0.64, COL: 0.45, PER: 0.72, ZAF: 0.69, HRV: 0.91, LTU: 0.89, LVA: 0.82, EST: 0.82, SVN: 0.75, MLT: 0.78, CYP: 0.7, LUX: 0.69, PRI: 0.68 };
const HOME_OWN_R = { hi: 0.65, eca: 0.85, eap: 0.8, sa: 0.85, mena: 0.7, lac: 0.68, ssa: 0.65 };
function parentHome() {
  const f = S.fam, c = B(); if (!f || f.pHome) return f && f.pHome;
  let p = HOME_OWN_C[c.id] != null ? HOME_OWN_C[c.id] : HOME_OWN_R[c.p] || 0.7;
  if (c.ppp < 25000) p = S.urban ? p - (c.p === 'ssa' ? 0.25 : 0.1) : Math.min(0.95, p + 0.2); else p = S.urban ? p - 0.05 : p + 0.1;
  p = clamp(p, 0.05, 0.97); const lg = Math.log(p / (1 - p)) + 0.55 * (S.q - 3);
  f.pHome = S.flags.rich || chance(1 / (1 + Math.exp(-lg))) ? 'own' : 'rent';
  return f.pHome;
}
const pHomeWord = () => { const h = parentHome(); return h === 'camp' ? "Chỗ trú trong trại tị nạn" : h === 'own' ? "Nhà riêng" : B().id === 'KOR' ? "Nhà thuê (jeonse hoặc thuê theo tháng)" : "Nhà thuê"; };
const parentWork = () => { const f = S.fam, o = new Set(); if (f.dad && f.dad.job && !f.dad.absent) o.add(f.dad.job); if (f.mom && f.mom.job && f.mom.job !== 'homemaker') o.add(f.mom.job); return o; };
const LAND_STATE = new Set(['CHN', 'VNM', 'LAO', 'PRK', 'ETH', 'MOZ', 'MMR']);
const landState = () => !!S && LAND_STATE.has(S.cur);
const HEIR_WHAT = id => (id === 'farm' && landState() ? "việc đồng áng" : null) || ({ farm: "ruộng đồng", herder: "đàn gia súc", fisher: "chiếc thuyền đánh cá", agbiz: "trang trại", vendor: "sạp hàng", artisan: "xưởng thủ công", owner: "cửa hàng" })[id] || "việc làm ăn của gia đình";
const jobName = (id, sex) => !JOBS[id] ? '' : lcVi(JOBS[id].n.replace(/ \(.*\)$|（.*）$/, ''));
const parentJobName = p => !p || !p.job ? '' : p.job === 'homemaker' ? "nội trợ" : p.job === 'owner' && S.fam.biz && S.fam[S.fam.biz.p] === p ? famBizName(S.fam.biz) : jobName(p.job, p === S.fam.mom ? 'F' : p === S.fam.dad ? 'M' : p.sex);
function heirCheck(add) {
  const f = S.fam, a = S.age;
  if (S.flags.heirDone || a < 20 || a > 55 || S.cur !== S.born || S.mig || S.refugee || S.job === 'prison' || S.serveLeft > 0 || S.school || inOffice() || RARE_JOBS.includes(S.job) || inCalling()) return;
  for (const key of ['dad', 'mom']) {
    const p = f[key]; if (!p || p.absent || !HEIR_JOBS.includes(p.job) || S.job === p.job) continue;
    const due = p.alive ? p.age >= 63 : p.diedAt === a || p.diedAt === a - 1;
    if (!due) continue;
    S.flags.heirDone = 1;
    if (chance(0.7 / (1 + 0.5 * sibN()))) add('heir', { k: key });
    return;
  }
}
const PRIV = { IND: 45, PAK: 34, BGD: 24, NPL: 17, LKA: 3, AFG: 7, IDN: 23, THA: 22, PHL: 12, CHN: 9, MYS: 9, LAO: 7, MNG: 6, KHM: 6, MMR: 5, VNM: 1, KOR: 2, JPN: 3, PRK: 0, TWN: 4, SGP: 4,
  ARE: 76, LBN: 71, QAT: 64, KWT: 41, JOR: 35, ISR: 10, OMN: 18, SAU: 16, IRN: 12, YEM: 5, TUR: 5, SYR: 4, IRQ: 3, EGY: 9, MAR: 18, TUN: 8, DZA: 1, LBY: 5, PSE: 10,
  GNQ: 59, LBR: 48, GAB: 44, COG: 43, MLI: 40, GIN: 35, TGO: 33, GMB: 32, GHA: 30, GNB: 28, BEN: 25, CMR: 24, BFA: 23, MDG: 21, NGA: 20, UGA: 20, SEN: 17, CIV: 17,
  CAF: 17, KEN: 16, MRT: 16, TCD: 15, COD: 15, AGO: 14, ZWE: 13, ERI: 11, LSO: 9, SDN: 8, BWA: 7, NAM: 6, SLE: 5, ZAF: 5, RWA: 4, TZA: 4, ETH: 4, NER: 4, ZMB: 3, BDI: 2, MWI: 2, MOZ: 2, SOM: 30, SSD: 10,
  CHL: 40, ARG: 26, PER: 24, ECU: 22, PRY: 21, COL: 20, VEN: 19, BRA: 19, URY: 17, BOL: 10, MEX: 9, GTM: 12, HND: 12, SLV: 12, NIC: 15, CRI: 9, PAN: 11, DOM: 20, HTI: 80, JAM: 10, CUB: 0,
  USA: 9, CAN: 7, GBR: 6, AUS: 30, NZL: 4, FRA: 15, DEU: 4, ITA: 7, ESP: 25, PRT: 13, GRC: 6, NLD: 1, BEL: 2, AUT: 8, CHE: 5, SWE: 0, NOR: 3, DNK: 15, FIN: 2, IRL: 3, CZE: 3, SVK: 7, POL: 3 };
const kidPrivOf = k => (typeof k.ps === 'string' ? k.ps : S.flags.kidSchool) === 'priv';
const kidSS = k => k.pS === 1 || k.ps === 1;
const kidsPrivNow = () => S.fam.kids.filter(k => k.alive && k.priv && S.age - k.bornAt >= 6 && S.age - k.bornAt < 18).length;
function kidsToPublic() { S.flags.kidSchool = 'pub'; for (const k of S.fam.kids) if (k.alive && S.age - k.bornAt < 18) { k.priv = 0; if (typeof k.ps === 'string') k.ps = null; } }
const privAfford = () => { const n = S.fam.kids.filter(k => k.alive && S.age - k.bornAt >= 5 && S.age - k.bornAt < 18 && kidPrivOf(k)).length + 1;
  return schoolFee(C()) * n <= shopInc() * 0.3 && S.money > -incomeAt(C(), 0.5) * 0.3; };
const COMM_Y = { RUS: 1991, UKR: 1991, BLR: 1991, KAZ: 1991, KGZ: 1991, TJK: 1991, TKM: 1991, UZB: 1991, AZE: 1991, GEO: 1991, ARM: 1991,
  MDA: 1991, LTU: 1990, LVA: 1990, EST: 1990, POL: 1989, CZE: 1990, SVK: 1990, HUN: 1990, ROU: 1990, BGR: 1990, ALB: 1991,
  SRB: 1990, HRV: 1990, SVN: 1990, BIH: 1990, MKD: 1990, MNE: 1990, MNG: 1990, CHN: 1993, VNM: 1989, LAO: 1990, KHM: 1989, CUB: 9999, PRK: 9999 };
const commEra = iso => { const y = COMM_Y[iso]; return y != null && (iso !== 'KHM' ? calYr() < y : calYr() >= 1979 && calYr() < 1989); };
const kidPrivP = () => { const c = C(), hp = hhPct(), wk = (0.35 + 1.6 * hp) * (S.money < 0 ? 0.7 : 1.15) * (c.ppp < 15000 ? 1.3 : 1); return clamp(privShare(c) * wk, 0, 0.95); };
const privShare = c => commEra(c.id) ? 0 : (PRIV[c.id] != null ? PRIV[c.id] : { hi: 6, eca: 1, lac: 12, eap: 8, mena: 10, sa: 20, ssa: 15 }[c.p] || 5) / 100;
const schoolFee = c => incomeAt(c, 0.5) * (c.ppp < 15000 ? 0.05 : c.ppp < 35000 ? 0.12 : 0.25);
const hhPct = () => { const c = C(), P = S.fam.partner; return pctOfIncome(c, Math.max(1, Math.max(0, S.income) + (S.fam.married && P && P.alive ? P.inc || 0 : 0)) * 0.75); };
const KIN_P = { ssa: 0.2, sa: 0.12, mena: 0.08, lac: 0.07, eap: 0.04, eca: 0.04, hi: 0.025 };
function kinAsk(c, a, add) {
  if (a < 30 || a > 80 || S.job === 'prison' || S.flags.hideCN || (S.flags.last_kinask != null && a - S.flags.last_kinask < 5)) return;
  const med = incomeAt(c, 0.5), well = (isWorking() && S.pct >= 0.55) || S.money > med * 1.5;
  if (!well || S.money < med * 0.1) return;
  if (!chance(KIN_P[c.p] * clamp((S.pct - 0.4) * 2.5 + (S.money > med * 2 ? 0.5 : 0), 0.3, 1.8))) return;
  const kids = S.fam.kids.map((k, i) => [k, i]).filter(([k]) => k.alive && S.age - k.bornAt >= 20 && S.age - k.bornAt <= 50 && !kidNotOurs(k));
  const w = { rel: ['ssa', 'sa'].includes(c.p) ? 1.6 : 0.8 };
  if (kids.length) w.kid = c.p === 'hi' || c.p === 'eap' ? 2 : 1.2;
  const sibs = a < 75 ? sibAliveList().filter(s => s.age >= 20) : [];
  if (sibs.length) w.sib = 1;
  const who = wpick(w), p = { who, r: ri(0, 2) };
  if (who === 'kid') p.i = pick(kids)[1];
  if (who === 'sib') { if (p.r === 0 && !sibs.some(s => s.age >= 28)) p.r = ri(1, 2); const s = pick(p.r === 0 ? sibs.filter(x => x.age >= 28) : sibs); p.s = s.i; }
  const toNephew = () => { const ps = sibList().map((s, i) => Object.assign({ i }, s)).filter(s => a + s.d >= 38 && a + s.d <= 65 && sibDA(s.i, s) >= 25); if (!ps.length) return false; p.s = pick(ps).i; p.ns = chance(0.512) ? 'M' : 'F'; return true; };
  if (who === 'rel' && p.r === 2 && !toNephew()) p.r = ri(0, 1);
  if (who !== 'kid' && p.r === 1 && HOSP_FREE.has((farKin() ? B() : c).id)) p.r = who === 'sib' ? pick([0, 2]) : chance(0.5) && toNephew() ? 2 : 0;
  add('kinask', p);
}
const dreamOK = () => !nkLife() && (isWorking() || S.job === 'seeking' || S.job === 'homemaker') && !S.retired && !S.school && S.age >= 18 && S.age <= 55 && !inOffice() && !S.nomad && S.job !== 'prison' && !(S.serveLeft > 0) && !S.flags.hideCN && !RARE_JOBS.includes(S.job) && Object.keys(dreamW()).length > 0;
const DREAM_H = { drama: ['actor'], music: ['musician'], dance: ['dancer', 'trainer'], art: ['artist', 'designer'], crafts: ['artist', 'artisan'], photo: ['artist', 'designer'], sport: ['trainer', 'coach'], gym: ['trainer'], cooking: ['cook'],
  garden: ['agbiz'], games: ['dev'], sns: ['creator'], reading: ['teacher', 'prof'], karaoke: ['musician'], fishing: ['fisher'], board: ['teacher'] };
const DREAM_J = ['teacher', 'nurse', 'doctor', 'lawyer', 'prof', 'dev', 'engineer', 'designer', 'artist', 'musician', 'actor', 'dancer', 'creator', 'trainer', 'coach', 'police', 'soldier', 'civil', 'pilot', 'cabin', 'social', 'childcare', 'healthtech'];
const dreamH = h => DREAM_H[isSportH(h) ? 'sport' : h.id] || [];
function dreamW() {
  const c = C(), e = S.edu, mj = e >= 4 ? S.major : null, pw = parentWork(), w = {}, own = new Set();
  for (const id in JOBS) {
    const j = JOBS[id]; if (id === S.job || NONWORK.includes(id) || ['mp', 'leader', 'astro', 'athlete', 'idol', 'owner'].includes(id)) continue;
    const hob = S.hobbies.some(h => dreamH(h).includes(id) && h.lv >= 2), maj = !!(mj && MAJORS[mj] && MAJORS[mj].jobs.includes(id) && j.e >= 4), kd = S.flags.kidDream === id;
    if (!DREAM_J.includes(id) && !hob && !maj && !kd) continue;
    if (j.only && !j.only.split(',').some(x => x === c.p || x === c.id)) continue;
    if (j.net && !eraNetOK(j, c)) continue; if (j.rich && c.ppp < 25000) continue; if (!eraJobK(id, c)) continue;
    if (MAJOR_REQ[id] && !(mj && MAJOR_REQ[id].includes(mj))) continue;
    if (j.e > e && S.flags.skill !== id && id !== 'musician' && id !== 'artist' && id !== 'actor' && id !== 'dancer') continue;
    if (S.mig && S.flags.natz !== S.cur && ['civil', 'police', 'soldier'].includes(id)) continue;
    if (id === 'musician' && !musicHobby() && S.major !== 'mus') continue; if (id === 'artist' && !artHobby() && S.major !== 'art') continue; if (id === 'actor' && !actHobby()) continue; if (id === 'dancer' && !danceHobby() && S.major !== 'dnc') continue; if (id === 'coach' && !sportBack()) continue;
    let x = (JOB_AV[id] || 0.3) * 0.3 + 0.2;
    if (maj) x *= 6;
    if (hob) x *= 6;
    if (pw.has(id)) x *= 5;
    if (kd) x *= 6;
    const [jlo, jhi] = jobRange(id, c), mid = (jlo + jhi) / 2, below = !kd && mid < S.pct - 0.1;
    x *= 1 + 2 * Math.max(0, mid - S.pct);
    if (below) x *= Math.max(0.15, 1 - 3 * (S.pct - 0.1 - mid));
    w[id] = x; if ((maj || hob || pw.has(id) || kd) && !below) own.add(id);
  }
  if (own.size) for (const id in w) if (!own.has(id)) w[id] *= 0.12;
  return w;
}
const DREAM_HARD = { civil: 0.6, police: 0.8, prof: 0.5, lawyer: 0.6, doctor: 0.5, designer: 0.7 };
function dreamWhy(id) {
  if (S.flags.kidDream === id) return "Ước mơ thuở nhỏ";
  if (S.hobbies.some(h => dreamH(h).includes(id) && h.lv >= 2)) return "Gắn với sở thích lâu năm";
  const mj = S.edu >= 4 && S.major; if (mj && MAJORS[mj] && MAJORS[mj].jobs.includes(id)) return "Đúng chuyên ngành đã học";
  if (parentWork().has(id)) return "Nghề bố mẹ từng làm";
  return '';
}
function dreamPool() { const w = dreamW(), out = []; for (let i = 0; i < 3 && Object.keys(w).length; i++) { const id = wpick(w); delete w[id]; out.push(id); } return out; }
function dreamP(id) {
  const j = JOBS[id], X = expIn(id), pw = parentWork(), mj = S.edu >= 4 && S.major, again = Math.pow(0.5, (S.flags.dreamF || {})[id] || 0);
  if (id === 'musician') { const h = musicHobby(); return h || S.major === 'mus' ? clamp((MUS_WIN + (h ? (hLv(h) - 4) * 0.03 : 0) + (S.major === 'mus' ? 0.08 : 0)) * 0.35 * (S.age > 40 ? 0.5 : 1) * again, 0.01, 0.3) : 0.01; }
  if (id === 'dancer') { const h = danceHobby(); return h || S.major === 'dnc' ? clamp((DNC_WIN + (h ? (hLv(h) - 4) * 0.03 : 0) + (S.major === 'dnc' ? 0.08 : 0)) * 0.3 * (S.age > 35 ? 0.3 : 1) * again, 0.01, 0.25) : 0.01; }
  if (id === 'actor') { const h = actHobby(); return h ? clamp((ACT_WIN + (hLv(h) - 4) * 0.03) * 0.3 * (S.age > 40 ? 0.5 : 1) * again, 0.01, 0.25) : 0.01; }
  if (id === 'artist') { const h = artHobby(); return clamp((ART_WIN + (h ? (hLv(h) - 4) * 0.03 : 0) + (S.major === 'art' ? 0.08 : 0)) * 0.35 * (S.age > 40 ? 0.5 : 1) * again, 0.01, 0.3); }
  let p = 0.12 + (X.same >= 1 ? 0.25 : X.fam >= 2 ? 0.1 : 0);
  if (mj && MAJORS[mj] && MAJORS[mj].jobs.includes(id)) p += 0.12;
  if (S.hobbies.some(h => dreamH(h).includes(id) && h.lv >= 4)) p += 0.08;
  if (pw.has(id)) p += 0.1;
  p *= (S.age > 45 ? 0.5 : S.age > 35 ? 0.75 : 1) * (0.95 + S.st.sm / 300) * (j.e >= 4 ? 0.8 : 1) * (1 - 0.6 * recW()) * (j.rare || 1) * (DREAM_HARD[id] || 1) * again;
  return clamp(p, 0.01, 0.45);
}
const dreamWord = p => p >= 0.25 ? "đáng thử" : p >= 0.12 ? "tương đối thấp" : p >= 0.05 ? "khá thấp" : "rất thấp";
function dreamOffer(id) {
  const c = C(), [lo, hi] = jobRange(id, c), X = expIn(id);
  const formal = !['musician', 'artist', 'actor', 'dancer', 'boardpro', 'progamer', 'creator', 'vendor', 'farm', 'herder', 'fisher', 'artisan'].includes(id) && (STATE_J.has(id) || chance(1 - informal(c) * 0.6)) && papersOK();
  let pct = X.same >= 1 && X.was != null ? X.was : lo + (hi - lo) * (0.05 + 0.15 * rnd());
  if (!(X.same >= 1 && X.was != null) && (X.same >= 1 || X.fam >= 2)) pct += Math.min(X.same * 0.012 + X.fam * 0.006, 0.12);
  pct = Math.max(clamp(pct, lo, hi), minPct(c, id, formal));
  return { id, formal, pct, xp: X.same >= 1 ? X.same : 0, xf: X.same < 1 && X.fam >= 2 };
}
const homeVillage = () => S.bornUrban === false && S.cur === S.born && !S.refugee;
const propOK = () => C().ppp >= 25000 || S.invest === 'property' || S.money >= housePrice(C()) * 0.4;
const VISA_APP_USD = 200;
const visaApp = m => Math.min(m.fee, usd2ppp(C(), VISA_APP_USD));