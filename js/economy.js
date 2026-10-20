// js/economy.js - Kinh te: tien, no, tai chinh, thu nhap
function loanDebt() { const d = Math.max(0, -S.money); return S.retired || S.age >= 70 ? d : Math.max(0, d - homeV() * 0.8); }
function debtHeavy() {
  if (S.money >= 0) return false;
  const rin = (S.rentals || []).reduce((t, h) => t + h.v * rentY(CBY[h.c] || C()) * (h.k === 's' ? 1.3 : 1), 0) * 0.7;
  const d = -S.money, base = Math.max(S.income + rin, incomeAt(C(), 0.3));
  if (d < base * 0.25) return false;
  const beyond = d - Math.min(d, homeV() * 0.8);
  return netWorth() < 0 || beyond > base * 1.5 || d > base * 6;
}
function netWorth() { return S.money + S.house + rentV() + (S.flags && S.flags.bizKeep ? S.flags.bizKeep.v : 0); }
const rentals = () => S.rentals || (S.rentals = []);
const rentV = () => (S.rentals || []).reduce((t, h) => t + h.v, 0);
const homeV = () => Math.max(0, S.house || 0) + rentV();
function bookSince(n0, k) { if (S && S.phase === 'life') book(k, netWorth() - n0); }
const EV_BOOK = { exp_roof: "Sửa nhà", exp_rent: "Tăng tiền thuê nhà", exp_appl: "Thay đồ điện gia dụng", exp_fix: "Sửa ô tô / xe máy", exp_funeral: "Tiền hiếu hỉ", wedding: "Tiền hiếu hỉ",
  parentill: "Viện phí cho bố mẹ", theft: "Mất trộm", bonus: "Tiền thưởng", harvest: "Thu hoạch", layoff: "Biến động công việc", teenjob: "Làm thêm", neighbor: "Hàng xóm giúp đỡ",
  scam: "Bị lừa đảo", kidback: "Hỗ trợ con cái", redevelop: "Tái thiết đô thị", repay: "Tiền cho vay", richgift: "Tài sản bố mẹ cho trước" };
const HAJJ_T = { M: { NGA: ['알하지', 'Alhaji'], GHA: ['알하지', 'Alhaji'], SLE: ['알하지', 'Alhaji'], GMB: ['알하지', 'Alhaji'], LBR: ['알하지', 'Alhaji'],
    SEN: ['엘하지', 'El Hadji'], MLI: ['엘하지', 'El Hadj'], GIN: ['엘하지', 'El Hadj'], BFA: ['엘하지', 'El Hadj'], CIV: ['엘하지', 'El Hadj'], NER: ['알하지', 'Alhaji'], TCD: ['엘하지', 'El Hadj'], CMR: ['알하지', 'Alhaji'],
    IDN: ['하지', 'Haji'], MYS: ['하지', 'Haji'], SGP: ['하지', 'Haji'], BRN: ['하지', 'Haji'], _: ['하지', 'Hajji'] },
  F: { NGA: ['하지야', 'Hajiya'], NER: ['하지야', 'Hajiya'], CMR: ['하지야', 'Hajiya'], GHA: ['하지아', 'Hajia'], SLE: ['하지아', 'Hajia'], GMB: ['하지아', 'Hajia'], LBR: ['하지아', 'Hajia'],
    SEN: ['아자', 'Adja'], MLI: ['하자', 'Hadja'], GIN: ['하자', 'Hadja'], BFA: ['하자', 'Hadja'], CIV: ['하자', 'Hadja'], TCD: ['하자', 'Hadja'],
    IDN: ['하자', 'Hajah'], MYS: ['하자', 'Hajah'], SGP: ['하자', 'Hajah'], BRN: ['하자', 'Hajah'], IND: ['하잔', 'Hajjan'], PAK: ['하잔', 'Hajjan'], _: ['하자', 'Hajja'] } };
const hajjTitle = () => { const t = HAJJ_T[S.sex === 'F' ? 'F' : 'M'], x = t[S.born] || t._; return x[1]; };
const propSS = () => !!S.fam.dating && S.fam.dating.sex === S.sex && ssLegal(C(), calYr()) !== 'm';
const DEC_BOOK = { duikey: "Lái xe khi say rượu", adsearch: "Tìm bố mẹ ruột", farsea: "Tàu cá viễn dương", cosign: "Tiền góp thay cho việc đứng bảo lãnh", parback: "Tiền gửi cho bố", ptpost: "Công tác nước ngoài", gkhome: "Cháu", infert: "Chi phí điều trị hiếm muộn và nhận con nuôi", divtalk: "Chi phí ly hôn và chia tài sản", atone: "Bồi hoàn để chuộc lỗi", applpar: "Đồ điện cho nhà bố mẹ", bizscale: "Cổ phần và bán công ty", lotto: "Tiền mua vé số", kidcare: "Gia đình giúp đỡ", bizop: "Điều hành cửa hàng", sskids: "Chi phí đón con về nhà", wife2: "Đám cưới thứ hai", kinask: "Tiền phụ giúp gia đình", buy: "Mua sắm", adultedu: "Chi cho việc học", illness: "Tiền chữa bệnh", babycare: "Chăm con nhỏ", sm_weekend: "Đi chơi cuối tuần", sm_holiday: "Kỳ nghỉ", sm_call: "Về thăm bố mẹ", diag: "Tiền chữa bệnh", alcquit: "Tiền chữa bệnh", mind: "Tư vấn tâm lý", disaid: "Thiết bị hỗ trợ", mindhelp: "Tư vấn tâm lý", kidsick: "Tiền chữa bệnh cho con", kiduni: "Học phí của con", kidwed: "Lo cưới cho con",
  erasmus: "Kỳ trao đổi sinh viên", loan: "Xử lý nợ", disaster: "Thiệt hại do thiên tai", biz: "Kinh doanh", bizfund: "Kinh doanh", petq: "Thú cưng", petsick: "Tiền chữa bệnh cho thú cưng", abroad: "Chi phí di cư", remit: "Gửi tiền về quê", hajj: "Hành hương", movenear: "Chi phí chuyển nhà", partner: "Chi phí đám cưới", sswed: "Chi phí đám cưới",
  college: "Du học", afterUni: "Du học", growup: "Mở rộng kinh doanh", ownup: "Khởi nghiệp", selfcode: "Chi cho việc học", gamble: "Cờ bạc", care: "Chăm sóc bố mẹ", crime: "Tiền mạo hiểm", mcrisis: "Ly hôn và tư vấn hôn nhân", lend: "Tiền cho vay",
  pbiz: "Cửa hàng của bạn đời", pstock: "Cổ phiếu (bạn đời gợi ý)", ipv: "Chia tài sản khi ly hôn", kidwant: "Chi cho con", kidabroad: "Chuẩn bị cho con ra nước ngoài",
  defect: "Tài sản bỏ lại", defroute: "Tiền hỗ trợ định cư và phí môi giới", prq: "Phí xin thường trú", natq: "Phí nhập quốc tịch", adoptq: "Chi phí nhận con nuôi" };
function book(k, x) { if (!S.fl || !x || !isFinite(x)) return; S.fl.it[k] = (S.fl.it[k] || 0) + x; }
function closeBooks() {
  const F = S.fl;
  if (F && F.m0 != null && S.flags) S.flags.debtUp = S.money < Math.min(0, F.m0) ? 1 : 0;
  if (!F || S.age < 15) { S.fl = null; return null; }
  const d = netWorth() - F.nw0; let sum = 0; for (const k in F.it) sum += F.it[k];
  if (Math.abs(d - sum) > 1e-6) F.it["Khoản khác"] = (F.it["Khoản khác"] || 0) + (d - sum);
  const med = incomeAt(C(), 0.5);
  const items = Object.entries(F.it).filter(([, v]) => Math.abs(v) >= med * 0.005).sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]));
  const ETC = "Khoản khác", top = items.filter(([k]) => k !== ETC).slice(0, 5), rest = d - top.reduce((t, [, v]) => t + v, 0);
  const out = { d, it: top.map(([k, v]) => [k, Math.round(v)]).concat(Math.abs(rest) >= med * 0.005 ? [[ETC, Math.round(rest)]] : []) };
  S.lastFl = out; S.fl = null;
  const drop = -d, known = items.filter(([k, v]) => v < 0 && k !== "Khoản khác").reduce((t, [, v]) => t - v, 0);
  if (S.age >= 18 && !S.school && drop > Math.max(med * 0.25, Math.max(0, F.nw0) * 0.1) && known > drop * 0.4 && !S.isComp) {
    const neg = items.filter(([, v]) => v < 0).slice(0, 3).map(([k, v]) => `${k} −${wonStr(-v)}`);
    const pos = items.filter(([, v]) => v > 0).slice(0, 1).map(([k, v]) => `${k} +${wonStr(v)}`);
    log(L`올해 재산이 ${wonStr(drop)} 줄었습니다. ${neg.concat(pos).join(' · ')}`, 'ledger'); S.flags.paidAt = null;
  }
  else if (S.flags.paidAt != null && S.age - S.flags.paidAt >= 1 && S.age - S.flags.paidAt <= 2 && S.money < -med * 0.1 && !S.isComp) {
    const neg = items.filter(([k, v]) => v < 0 && k !== "Khoản khác" && k !== "Biến động giá nhà").slice(0, 3).map(([k, v]) => `${k} −${wonStr(-v)}`);
    if (neg.length) log(L`갚았던 빚이 다시 ${wonStr(-S.money)} 생겼습니다. ${neg.join(' · ')}`, 'ledger');
    S.flags.paidAt = null;
  }
  else if (S.age >= 18 && !S.school && F.m0 != null && F.m0 >= 0 && S.money < -med * 0.05 && !S.isComp && !ddKept() && !(S.flags.debtTold != null && S.age - S.flags.debtTold < 5)
    && !(homeV() > 0 && -S.money <= homeV() * 0.8) && !S.log.some(e => e.a === S.age && /빚|대출|할부|debt|loan|instal|借金|ローン|分割|借り/i.test(e.text))) {
    const neg = items.filter(([k, v]) => v < 0 && k !== "Khoản khác" && k !== "Biến động giá nhà").slice(0, 3).map(([k, v]) => `${k} −${wonStr(-v)}`);
    S.flags.debtTold = S.age; log((F.m0 >= med * 0.02 ? L`모아 둔 돈이 바닥나 ${wonStr(-S.money)}의 빚이 생겼습니다.` : L`쓸 돈이 모자라 ${wonStr(-S.money)}의 빚이 생겼습니다.`) + (neg.length ? ' ' + neg.join(' · ') : ''), 'ledger');
  }
  if (S.flags.paidAt != null && S.age - S.flags.paidAt > 2) S.flags.paidAt = null;
  return out;
}
const CM_KEEP = { sa: 0.12, ssa: 0.15, mena: 0.15, eap: 0.25, eca: 0.25, lac: 0.35 }, CM_LEAVE = 0.3;
const OPEN_UNI_N = () => ({ KOR: "Đại học Mở Quốc gia Hàn Quốc", JPN: "Đại học Mở Nhật Bản", CHN: "Đại học Mở Quốc gia Trung Quốc", GBR: "Đại học Mở (Open University) của Anh", NGA: "Đại học Mở Quốc gia Nigeria", IND: "Đại học Mở Quốc gia Indira Gandhi",
  PAK: "Đại học Mở Allama Iqbal", BGD: "Đại học Mở Bangladesh", ZAF: "Đại học Nam Phi", TUR: "hệ đào tạo mở của Đại học Anadolu", ESP: "Đại học Giáo dục Từ xa Quốc gia Tây Ban Nha", IDN: "Đại học Mở Indonesia (Universitas Terbuka)", THA: "Đại học Mở Sukhothai Thammathirat" });
const openUniName = c => OPEN_UNI_N()[c.id] || "một trường đại học đào tạo từ xa";
const talibanF = () => S.sex === 'F' && S.cur === 'AFG' && typeof eraEdu === 'function' && !!eraEdu(C(), 'F', {}).ban;
const TALIBAN_F_JOBS = new Set(['doctor', 'nurse', 'healthtech', 'teacher', 'farm', 'farmhand', 'herder', 'artisan', 'garment', 'domestic']);
const openUniOK = () => !talibanF() && S.edu === 3 && !S.flags.openUni && !S.flags.nightUni && !S.school && S.cur !== 'PRK' && S.job !== 'prison' && !S.flags.hideCN;
const workField = () => { for (const k in MAJORS) if (!MAJORS[k].acad && MAJORS[k].jobs[0] === S.job) return k; return null; };
function openUniStart() {
  S.flags.openUni = { at: S.age, end: S.age + 5 }; if (!S.major) S.major = (k => k && !MAJORS[k].aud ? k : null)(workField()) || wpick({ hum: 3, soc: 2, biz: 2, edu: 1, agr: S.urban ? 0 : 1 }); eff({ sm: 3, h: 3 });
  const f = MAJORS[S.major].n;
  return S.age >= 50 ? L`${openUniName(C())} ${f} 과정에 등록했습니다. 늦게 시작하는 대학 공부입니다.` : L`${openUniName(C())} ${f} 과정에 등록했습니다. 일하면서 틈틈이 강의를 듣습니다.`;
}
const gedNew = () => S.flags.gedPassAt != null && S.age - S.flags.gedPassAt <= 3 && S.edu === 3;
const GRAD_LEAVE = [0.17, 0.072];
const gradLeave = y => chance(GRAD_LEAVE[clamp(y, 1, 2) - 1] * (S.st.hl < 40 ? 1.8 : 1) * gritK());
const GRAD_LEAVE_F = () => "Trong số sinh viên vào chương trình thạc sĩ khối khoa học - kỹ thuật ở Mỹ, 17% bỏ học trong vòng một năm và 23% trong vòng hai năm (Council of Graduate Schools 2013)";
function schoolYear() {
  if (S.flags.gedAt != null && S.age + 1 >= S.flags.gedAt) {
    const lv = S.flags.gedLv || Math.min(3, S.edu + 1), nm = [L`초등학교${LBL}`, L`초등학교${LBL}`, L`중학교${LBL}`, L`고등학교${LBL}`][lv];
    const p = clamp(0.72 + (S.st.sm - 40) / 150 + 0.15 * ((S.focusW.learn || 0) + (S.focusW.study || 0)), 0.25, 0.92);
    S.flags.gedAt = null;
    if (chance(p)) { S.edu = Math.max(S.edu, lv); S.yearMark = 'edu'; eff({ h: 6, sm: 2 }); if (lv === 3) S.flags.gedPassAt = S.age;
      logA('grad:' + lv, (S.retired ? L`${nm} 졸업 학력 검정고시에 합격했습니다! 오래 미뤄 둔 졸업장을 마침내 손에 쥐었습니다.` : L`${nm} 졸업 학력 검정고시에 합격했습니다! 이제 그 학력으로 일자리를 찾을 수 있습니다.`) + (lv === 3 && S.age <= 75 && S.cur !== 'PRK' ? ' ' + (S.age >= 50 ? L`마음만 먹으면 ${openUniName(C())}에서 대학 공부도 이어 갈 수 있습니다.` : "Nếu muốn, bạn cũng có thể vừa đi làm vừa học tiếp đại học.") : ''), 'big'); }
    else { eff({ h: -3 }); log(L`${nm} 과정 검정고시에 떨어졌습니다. 내년에 다시 볼 수 있습니다.`, 'bad'); }
  }
  const ngY = S.flags.nightGrad ? clamp(S.age + 3 - S.flags.nightGrad, 1, 2) : 0;
  if (ngY && S.edu === 4 && gradLeave(ngY)) {
    S.flags.nightGrad = 0; S.flags.shop_nightgrad = S.age + 2 - 99; eff({ h: -2 });
    log(S.retired ? L`늦깎이로 다니던 대학원을 ${ngY}년 만에 그만두었습니다. 그래도 배운 것은 남았습니다.` : L`일하며 다니던 대학원을 ${ngY}년 만에 그만두었습니다. 일과 공부를 함께 하기가 벅찼습니다.`, 'ev', GRAD_LEAVE_F());
  }
  if (S.flags.nightGrad && S.age + 1 >= S.flags.nightGrad && S.edu === 4) { S.edu = 5; S.flags.nightGrad = 0; if (S.flags.gMaj && MAJORS[S.flags.gMaj]) S.major = S.flags.gMaj; S.flags.degAt = S.age; if (isWorking()) S.pct = clamp(S.pct + 0.04, 0, 0.99); if (!S.retired) S.flags.degOffer = 1; eff({ h: 5, sm: 3 }); logA('grad:5', S.retired ? "Bắt đầu học cao học muộn, nay bạn đã học xong và nhận bằng thạc sĩ." : "Vừa đi làm vừa học cao học, nay bạn đã học xong và nhận bằng thạc sĩ.", 'big'); S.yearMark = 'edu'; }
  if (S.flags.openUni && S.edu < 4) {
    const o = S.flags.openUni, nm = openUniName(C());
    if (S.age + 1 >= o.end) { S.flags.openUni = null; S.edu = 4; S.flags.degAt = S.age; if (isWorking() && S.age < 60) S.pct = clamp(S.pct + 0.03, 0, 0.99); if (S.age < 55) S.flags.degOffer = 1; S.yearMark = 'edu'; eff({ h: 8, sm: 3, so: 2 }); logA('grad:4', L`${eul(nm)} 졸업했습니다. ${S.age + 1}세에 받은 학사 학위입니다.`, 'big'); }
    else if (S.age > o.at && chance(0.14 * (S.st.hl < 40 ? 1.8 : 1) * gritK())) { const y = S.age - o.at; S.flags.openUni = null; S.flags.openUniLeft = 1; for (const id of ['openuni', 'nightuni']) if (S.flags['shop_' + id] != null) S.flags['shop_' + id] = S.age + 2 - 99; eff({ h: -2 });   log(L`${nm} 공부를 ${y}년 만에 내려놓았습니다. 그래도 배운 것은 남았습니다.`, 'ev'); }
  }
  if (S.flags.nightUni && S.age + 1 >= S.flags.nightUni && S.edu < 4) { S.edu = 4; S.flags.nightUni = 0; S.pct = clamp(S.pct + 0.06, 0, 0.99); S.flags.degOffer = 1; logA('grad:4', "Bạn đã tốt nghiệp trường đại học buổi tối mà bạn theo học trong lúc đi làm. Bạn nhận bằng cử nhân.", 'big'); S.yearMark = 'edu'; }
  if (!S.school) return;
  if (S.flags.cmSch && S.fam.married && (S.fam.kids.length || chance(CM_LEAVE))) { S.school = null; S.flags.cmSch = 0; S.flags.wedLeft = 1; S.job = 'homemaker'; eff({ h: -3 }); log("Vừa lo việc nhà vừa đi học thật không dễ. Cuối cùng bạn đã nghỉ học.", 'bad'); return; }
  S.schoolY++;
  const len = { prim: 6, lsec: 3, usec: 3, uni: 4, grad: 2, voc: 2, phd: 5 }[S.school];
  if (S.school === 'phd' && S.schoolY < len && chance(0.14 * clamp(70 / Math.max(30, S.st.sm), 0.7, 1.5) * gritK())) {
    const y = S.schoolY; S.school = null; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 });
    log(L`박사 과정을 ${y}년 만에 그만두었습니다. 연구는 생각보다 길고 외로웠습니다.`, 'bad'); return;
  }
  if (S.school === 'grad' && S.schoolY >= 1 && gradLeave(S.schoolY)) {
    const y = S.schoolY; S.school = null; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 });
    log(L`대학원을 ${y}년 만에 그만두었습니다. 학사 학위로 일자리를 찾기로 했습니다.`, 'bad', GRAD_LEAVE_F()); return;
  }
  const pr = eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1);
  if (S.school === 'prim' && S.schoolY < len) {
    const pDrop = 1 - Math.pow(clamp(pr.t1 / primIn(pr), 0.01, 1), 1 / (len - 1)) + (S.st.sm < 8 && pr.t1 < 0.97 ? 0.02 : 0);
    if (chance(clamp(pDrop * gritK(), 0, 0.4)) && ddLv() < 2) { S.school = null; if (S.age < 15) toChildwork(); else S.job = 'seeking'; log(outWhy('drop'), 'bad', L`${B().ko}의 초등교육 이수 비율: 약 ${pctStr(pr.p1)} (${eduSrc(pr, 0, true)})`); return; }
  }
  if (S.school === 'lsec' && S.flags.lsKeep != null) {
    if (S.schoolY < len && ddLv() < 2 && chance(gritK() * (1 - Math.pow(clamp(S.flags.lsKeep, 0.01, 1), 1 / (len - 1))))) {
      S.school = null; S.flags.lsKeep = null; if (S.age < 15) toChildwork(); else S.job = 'seeking'; eff({ h: -4 });
      log(outWhy('drop'), 'bad', L`${B().ko}에서 중학교를 마치는 비율은 약 ${pctStr(pr.p2)}입니다 (${eduSrc(pr, 1)})`); return;
    }
    if (S.schoolY >= len) S.flags.lsKeep = null;
  }
  if (S.school === 'uni' && S.flags.acad && S.schoolY < len && chance(0.045 * gritK())) {
    S.school = null; S.flags.acad = 0; S.major = null; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 });
    log(S.flags.acadB === 'jp' ? "Bạn không trụ được đến cùng ở Học viện Phòng vệ Quốc gia và đã rời đi. Bạn quyết định tìm một con đường khác." : "Bạn không trụ được đến cùng ở trường sĩ quan và đã rời đi. Bạn quyết định tìm một con đường khác.", 'bad'); return;
  }
  if (S.school === 'uni' && S.flags.uniKeep != null) {
    if (S.schoolY < len && chance(gritK() * (1 - Math.pow(clamp(S.flags.uniKeep, 0.01, 1), 1 / (len - 1))))) {
      const y = S.schoolY; S.school = null; S.flags.uniKeep = null; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 });
      log(L`대학을 ${y}년 다니다 그만두었습니다. 일과 공부를 함께 해내기 어려웠습니다.`, 'bad', OPEN_UNI[B().id] ? OPEN_UNI[B().id].fact() : null);
      return;
    }
    if (S.schoolY >= len) S.flags.uniKeep = null;
  }
  if (S.schoolY >= len) S.flags.gradDue = 1;
}
function graduate() {
  const len = { prim: 6, lsec: 3, usec: 3, uni: 4, grad: 2, voc: 2, phd: 5 }[S.school];
  if (!S.school || !(S.schoolY >= len)) return;
  if (S.schoolY >= len && S.school === 'phd') {
    S.flags.dr = S.age; S.school = null; S.schoolY = 0; S.flags.justGrad = 'phd'; S.yearMark = 'edu'; eff({ h: 8, sm: 4 });
    logA('grad:5', "Bạn đã nhận bằng tiến sĩ! Lật trang cuối của luận án, bạn nhớ lại những đêm thức khuya trong mấy năm qua.", 'big'); return;
  }
  {
    const lvl = { prim: 1, lsec: 2, usec: 3, uni: 4, grad: 5, voc: 3 }[S.school];
    S.edu = Math.max(S.edu, lvl);
    const names = rohCamp() ? { prim: "Bạn đã học xong lớp tiểu học ở trung tâm học tập. Không có bằng nào được công nhận.", lsec: "Bạn đã học xong lớp trung học cơ sở ở trung tâm học tập. Không có bằng nào được công nhận." } : 0;
    if (names && names[S.school]) { S.edu = Math.max(S.edu, lvl); log(names[S.school], 'ev', ROH_F.edu); S.yearMark = 'edu'; const was0 = S.school; S.school = null; S.schoolY = 0; S.flags.justGrad = was0; return; }
    const names0 = { prim: "Bạn đã tốt nghiệp tiểu học.", lsec: "Bạn đã tốt nghiệp trung học cơ sở.", usec: "Bạn đã tốt nghiệp trung học phổ thông.", uni: "Bạn đã tốt nghiệp đại học! Bạn nhận bằng cử nhân.", grad: "Bạn đã học xong cao học và nhận bằng thạc sĩ.", voc: "Bạn đã hoàn thành một khóa đào tạo nghề." };
    logA('grad:' + lvl, S.school === 'uni' && S.flags.acad ? (S.flags.acadB === 'jp' ? "Bạn đã tốt nghiệp Học viện Phòng vệ Quốc gia. Sau trường đào tạo sĩ quan dự bị, bạn nhận quân hàm Tam úy (tương đương thiếu úy)." : "Bạn đã tốt nghiệp trường sĩ quan, nhận bằng cử nhân cùng quân hàm thiếu úy.") : S.school === 'voc' && VOC_N()[S.flags.vocF] ? L`직업학교 ${eul(VOC_N()[S.flags.vocF])} 졸업했습니다.` : names0[S.school], 'big'); S.yearMark = 'edu';
    if (S.school === 'voc' || (S.school === 'usec' && S.flags.artsHS)) S.flags.hsAt = S.age;
    if (lvl >= 4) S.flags.degAt = S.age;
    if (lvl >= 4 && tmprK() === 'grit' && !S.isComp && chance(0.5)) log("Đã có lúc bạn muốn bỏ cuộc, nhưng sự bền bỉ từ thuở nhỏ đã giúp bạn trụ vững đến cùng.", 'warm');
    const kept = fcKept(), payer = kept ? (raisedAlive() && S.flags.raised.k !== 'home' ? (S.flags.raised.k === 'foster' ? "bố mẹ nuôi tạm thời" : raisedWord(S.flags.raised)) : null) : parW();
    if (lvl >= 4 && S.money < 0 && S.q >= 4 && (kept ? !!payer : famCanHelp()) && chance(S.q === 5 ? 0.5 : 0.25)) {
      const x = Math.min(-S.money, med() * (S.q === 5 ? 1.5 : 0.6)); S.money += x; book(kept ? "Khoản nợ gia đình trả giúp" : "Khoản nợ bố mẹ trả giúp", x); eff({ so: 2 });
      log(L`${payer}께서 학창 시절의 빚 ${wonStr(x)}을 갚아 주셨습니다.`);
    }
    const was = S.school; S.school = null; S.schoolY = 0;
    S.flags.justGrad = was;
    if (was === 'uni' && S.flags.acad) { S.flags.acad = 0; S.flags.justGrad = null; S.flags.offc = S.age; takeJob({ id: 'soldier', formal: true, pct: jobRange('soldier', C())[0] + 0.03 }); }
  }
}
const WANT_HL = 10.5;
const BIZ_SINK = 0.5, BIZ_DIP = 0.08;
const bizEcoK = () => { const e = eraEcon(), k = e ? e.lay : ecoDrawn() ? ecoOd().lay0 : 1; return 1 + (k - 1) * 0.5; };
function bizCloseYear(a) {
  const F = S.flags, bk = F.bizK, pro = BIZ_K[bk] && BIZ_K[bk].pro, r = rankOf('owner'), young = S.jobY <= 5 && !F.bizInh && !r && !F.bizBig;
  const e = eraEcon(), slump = !!(e && e.lay >= 1.5), shut = q => { if (!chance(q)) return false; F.bizWarnE = slump ? 1 : 0; return true; };
  const p = (S.jobY <= 5 && !F.bizInh ? (BIZ_K[bk] || { close: 0.08 }).close : 0.03) * [1, 0.6, 0.35][r] * (F.bizCut != null && a - F.bizCut <= 2 ? 0.5 : 1) * bizEcoK();
  if (F.bizRisk != null && a - F.bizRisk <= 1) return shut(p * 2.5);
  if (F.bizWarn != null && F.bizWarn === a - 1) {
    if (chance(BIZ_SINK)) return true;
    F.bizWarn = F.bizWarnE = null; log("Bạn đã vượt qua giai đoạn khó khăn nhất." + ' ' + "Công việc dần dần trở lại như cũ."); return false;
  }
  if (young) return shut(p);
  if (!chance(Math.min(0.9, p / Math.max(0.05, BIZ_SINK - p)))) return false;
  F.bizWarn = a; F.bizWarnE = slump ? 1 : 0;
  log((slump ? (pro ? "Vì kinh tế suy thoái, công việc giảm hẳn." : "Vì kinh tế suy thoái, khách giảm hẳn.") : pro ? "Công việc giảm hẳn." : "Khách giảm hẳn.") + ' ' + "Cứ thế này, có lẽ bạn sẽ phải đóng cửa.", 'bad');
  return false;
}
const EFF_CAP = 0.10;
const effLeft = () => Math.max(0, 1 - ((S.flags && S.flags.effG) || 0) / EFF_CAP);
function finances() {
  const c = C(), a = S.age;
  if (S.flags.want) S.flags.want = 0;
  const kidsUnder = S.fam.kids.filter(k => k.alive && (!k.away || k.lb) && S.age - k.bornAt < 18).length;
  if (S.job === 'owner' && S.jobY >= 1 && bizCloseYear(a)) {
    const bk = S.flags.bizK, pro = BIZ_K[bk] && BIZ_K[bk].pro, slump = !!S.flags.bizWarnE;
    S.flags.lastJob = 'owner'; S.job = 'seeking'; eff({ h: -8 }); setRank('owner', 0); S.flags.bizFail = a; S.flags.bizK = null; S.flags.bizBig = 0; S.flags.bizL = 0; S.flags.bizScale = 0; S.flags.bizPt = 0; S.flags.bizStaff = 0; S.flags.bizWarn = S.flags.bizWarnE = null;
    log(slump ? (pro ? L`불황을 버티지 못하고 결국 ${eul(bizName(bk))} 접었습니다.` : "Bạn không trụ nổi qua thời kỳ suy thoái, cuối cùng đã dẹp việc kinh doanh.") : pro ? L`일감이 줄어 결국 ${eul(bizName(bk))} 접었습니다.` : pick(["Buôn bán khó khăn, bạn đã đóng cửa tiệm.", "Khách ngày càng thưa, cuối cùng bạn đã dẹp việc kinh doanh."]), 'bad', "Trong số các doanh nghiệp mới mở, chỉ khoảng một nửa còn hoạt động sau 5 năm (OECD, thống kê nhân khẩu học doanh nghiệp)");
  }
  if (S.job === 'owner' && S.flags.bizPt && chance(0.04)) {
    const x = (S.flags.bizBase || incomeAt(c, 0.5) * 1.5) * (BIZ_K[S.flags.bizK] || { cost: 1 }).cost * 0.3; S.flags.bizPt = 0; S.money -= x; book("Mua lại phần hùn", -x); eff({ h: -4, so: -3 });
    log(L`동업자와 생각이 갈려 따로 가기로 했습니다. 동업자의 몫을 사 들였습니다. (−${wonStr(x)})`, 'bad');
  }
  milPenYear();
  if (S.serveLeft > 0) { S.income = mobOn() ? incomeAt(c, MOB[S.cur] ? MOB[S.cur].pay : 0.5) : incomeAt(c, 0.12) * 0.4; }
  else if (isWorking()) {
    const j = JOBS[S.job]; const [jlo, jhi] = jobRange(S.job, c);
    S.jobY++; if (S.formal) S.formalY++;
    const xp = expMap(), xe = xp[S.job] || (xp[S.job] = [0, S.pct]); xe[0]++;
    { const bk = S.job === 'owner' && BIZ_K[S.flags.bizK];
      if (bk && bk.fit && bk.fit[0]) { let fj = bk.pro ? bk.fit[0] : S.flags.bizK === 'service' ? bizSvcJob() : null;
        if (!fj) { let y = 0; for (const f of bk.fit) if (xp[f] && xp[f][0] > y) { fj = f; y = xp[f][0]; } }
        if (fj && fj !== 'owner') { const xf = xp[fj] || (xp[fj] = [0, S.pct]); xf[0]++; } } }
    const steep = 0.55 + 0.65 * clamp(c.ppp / 50000, 0, 1), yrs = xe[0];
    const room = clamp((jhi + 0.04 - S.pct) / Math.max(0.05, jhi - jlo) * 1.2, 0, 1);
    const effP = ((S.focusW.work || 0) * 0.012 + (S.focusW.learn || 0) * 0.006) * effLeft(), eff = effP * room;
    if (effP > 0) S.flags.effG = (S.flags.effG || 0) + effP;
    const own = S.job === 'owner', fy = S.jobY;
    let drift = own ? (S.flags.bizInh ? 0.002 : fy <= 5 ? 0.012 * steep : fy <= 12 ? 0.005 * steep : 0.001) * room + eff - (S.focusW.family || 0) * 0.003 + (0.003 + (S.st.sm - 50) / 50 * 0.003) * room
      : (a > 55 ? -0.004 : (yrs <= 10 ? 0.015 * steep : yrs <= 20 ? 0.007 * steep : 0.001) * room) + eff - (S.focusW.family || 0) * 0.003 + (0.003 + (S.st.sm - 50) / 50 * 0.003) * room;
    let dp = drift + (rnd() - 0.5) * 0.02; if (!own && (S.jobY === 1 || S.flags.raiseAt === a)) dp = Math.max(0, dp);
    if (own) { const sh = (rnd() - 0.5) * 0.1 - (S.flags.bizWarn === a ? BIZ_DIP : 0); dp = drift + (rnd() - 0.5) * 0.04 + sh - (fy > 1 ? S.flags.bizSh || 0 : 0); S.flags.bizSh = sh; }
    else if (S.flags.bizSh) S.flags.bizSh = 0;
    S.pct = clamp(S.pct + dp, Math.max(0.005, jlo - 0.06), Math.min(0.995, jhi + 0.04));
    S.pct = Math.max(S.pct, minPct(c, S.job, S.formal));
    xe[1] = S.pct;
    if (S.mig && S.migPen > 0) S.migPen = Math.max(0, S.migPen - 0.015);
    S.income = incomeAt(c, payPct(S.pct, S.job, S.formal)) * (S.focusW.work ? 1 + 0.1 * S.focusW.work : 1) * (S.job === 'owner' && S.flags.bizPt ? 0.8 : 1) * (S.flags.apprUntil > a ? 0.5 : 1) * (S.flags.rehireJob === S.job ? 0.65 : 1) * (S.flags.ptTo > a ? 0.6 : 1) * (S.flags.lessAt != null ? 0.55 : 1) * (S.job === 'clergy' && S.flags.voc && S.flags.voc.ord == null ? 0.5 : 1) * ownAgeK(a) * eraIncK();
    if (S.job === 'shelter') S.income = incomeAt(c, 0.5) * ddShelterK(c);
    if (S.sex === 'F' && ddAutKid()) S.income *= DD_MOM;
    S.lastInc = S.income; uiMark();
    if (S.job === 'soldier') { S.flags.milInc = S.income; S.flags.milC = S.cur; }
    if (S.job === 'owner') S.flags.bizE = bizEarnNow(); else if (S.flags.bizE) S.flags.bizE = 0;
    if (a >= retireAge(c) && (c.p === 'hi' || c.p === 'eca' || S.formalY >= 10)) { if (S.flags.penW == null) S.flags.penW = pensionAmount(); S.income += S.flags.penW || 0; }
    else if (S.flags.milPen && S.job !== 'soldier') S.income += S.flags.milPen.v;
  } else if (S.job === 'childwork') S.income = S.flags.cwPaid ? incomeAt(c, 0.05) * 0.15 : 0;
  else if (S.job === 'seeking' && !S.retired && a >= retireAge(c) && (c.p === 'hi' || c.p === 'eca' || S.formalY >= 10)) { if (S.flags.penW == null) S.flags.penW = pensionAmount(); S.income = Math.max(S.flags.penW || 0, S.flags.milPen ? S.flags.milPen.v : 0); }
  else if (S.retired || a >= 65) S.income = Math.max(S.pension || 0, S.flags.milPen ? S.flags.milPen.v : 0);
  else S.income = S.flags.milPen && S.job !== 'prison' ? S.flags.milPen.v : 0;
  if (S.office && S.office.lvl === 1) S.income += incomeAt(c, 0.5) * localPay(c);
  if (S.age >= 15) {
    S.stats.maxIncome = Math.max(S.stats.maxIncome, S.income);
    if (S.income > 0) S.stats.maxPct = Math.max(S.stats.maxPct, pctOfIncome(c, S.income));
  }
  if (isWorking() && a >= 30 && a < 65 && !['owner', 'farm', 'agbiz', 'herder', 'fisher'].includes(S.job) && !RARE_JOBS.includes(S.job)
    && chance(S.st.hl < 25 ? 0.14 : S.st.hl < 35 ? 0.06 : S.st.hl < 45 ? 0.012 : 0.002)) {
    S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; S.flags.sickOut = a; eff({ h: -6 });
    log("Sức khỏe của bạn đã hao mòn quá nhiều, không thể tiếp tục làm việc. Bạn quyết định nghỉ cho đến khi hồi phục.", 'bad', "Khoảng 4% người trong độ tuổi lao động không thể làm việc vì bệnh tật hoặc khuyết tật (OECD)");
  }
  if (S.flags.sickOut != null && (S.job !== 'seeking' || S.st.hl >= 50 || a - S.flags.sickOut >= 6)) S.flags.sickOut = null;
  const selfW = SELF_JOBS.includes(S.job) || ['owner', 'agbiz', 'creator'].includes(S.job);
  const clg = S.job === 'clergy', a0 = clg ? 75 : 66;
  const hpOld = (S.st.hl < 35 ? 0.3 : S.st.hl < 50 ? 0.08 : 0.01) * (a >= 80 ? 2.5 : 1), agOld = a > a0 ? 0.009 * (a - a0) * (selfW ? 0.6 : 1) * (S.flags.lessAt != null ? 0.8 : 1) : 0;
  if (isWorking() && a >= 65 && !inOffice() && !RARE_JOBS.includes(S.job) && !(S.flags.voc && S.flags.voc.pope) && chance(hpOld + agOld)) {
    const body = rnd() * (hpOld + agOld) < hpOld || selfW, P = S.fam.partner, ptIll = S.fam.married && P && P.alive && P.age >= 70 && chance(0.25);
    const bx = S.job === 'owner' ? bizExit() : workHandDown(); S.pension = pensionAmount(); S.retired = true; S.flags.lastJob = S.job; S.job = 'retired';
    log(clg && clergyOld() ? clergyRetLine() : (body ? "Cơ thể không còn được như trước, bạn đã nghỉ làm." : ptIll ? L`몸이 약해진 ${callName(P.name)} 곁을 지키려고 일을 내려놓았습니다.` : "Nơi làm việc không gia hạn hợp đồng nữa. Bạn đã khép lại công việc gắn bó bao năm.") + (bx ? ' ' + bx : ''), 'ev');
  }
  S.flags.seekY = S.job === 'seeking' && a >= 16 ? (S.flags.seekY || 0) + 1 : 0;
  if (a < 16 && !isWorking()) return;
  const med = incomeAt(c, 0.5);
  const subsist = med * 0.3;
  let save = 0, dep = false, lump = 0;
  const add = (k, x) => { if (!x) return; save += x; book(k, x); };
  let paySv = 0; const addP = (k, x) => { paySv += x || 0; add(k, x); };
  if (S.flags.ptNw) { const x = S.flags.ptNw, P = S.fam.partner; S.flags.ptNw = 0; book(x > 0 ? "Tiền bạn đời mang theo" : "Nợ bạn đời mang theo", x); S.money += x;
    if (P && P.alive && !P.divorced) log(x > 0 ? L`${iga(callName(P.name))} 그동안 모은 돈 ${wonStr(x)}을 살림에 보탰습니다.` : L`${iga(callName(P.name))} 갚고 있던 빚 ${wonStr(-x)}도 함께 짊어지게 되었습니다.`, 'ev'); }
  if (S.income > 0) {
    const sRate = saveRate(c, S.income, med);
    if (S.serveLeft > 0) addP("Phụ cấp dành dụm khi tại ngũ", S.income * 0.25);
    else {
      const rk = S.retired ? retKeep(S.income / med) : 0;
      addP(S.retired || (!isWorking() && S.flags.milPen) ? "Để dành từ lương hưu" : "Để dành từ thu nhập", S.income * (S.retired ? Math.min(sRate, 0.03) + oldKeep() + rk : sRate));
      add("Chi phí nuôi con", -kidsUnder * S.income * 0.035);
      { const P = S.fam.partner; if (S.fam.married && P && P.alive && P.inc > 0 && !P.ret && S.job !== 'prison') { const pI = P.inc * (S.fam.co ? 0.6 : 1); add("Để dành từ thu nhập của bạn đời", pI * saveRate(c, pI, med, true) * PT_KEEP); } }
      if (S.income < subsist && !ddKept()) { add("Thiếu hụt chi phí sinh hoạt", -(subsist - S.income) * 0.5); if (rohCamp()) add("Lương thực phân phối và cứu trợ", (subsist - S.income) * 0.5); }
    }
    if (S.job === 'clerk' && S.flags.ofPath === 'sales' && S.jobY >= 1) { const u = rnd(), r = u < 0.45 ? rnd() * 0.04 : u < 0.85 ? 0.04 + rnd() * 0.14 : 0.18 + rnd() * 0.3; if (r > 0.01) add("Thưởng doanh số", S.income * r); }
  } else {
    let support = 0;
    const adultKids = S.fam.kids.filter(k => k.alive && S.age - k.bornAt >= 22).length;
    const P = S.fam.partner, pWork = S.fam.married && P && P.alive && P.inc > 0;
    const pInc = pWork ? P.inc * (S.fam.co ? 0.6 : 1) : 0;
    if (pInc > 0 && !S.flags.pSupNoted && a >= 18 && a < 65 && S.job !== 'prison') { S.flags.pSupNoted = 1; log(P.ret ? L`배우자 ${callName(P.name)}의 연금으로 살림을 꾸립니다.` : L`${S.job === 'homemaker' || S.retired ? '' : " trong thời gian này"}배우자 ${callName(P.name)}의 벌이로 살림을 꾸립니다.`); }
    if (a >= 60 && adultKids) add("Tiền con cái gửi", Math.min(2, adultKids) * med * 0.12 * (S.st.so > 40 ? 1 : 0.5));
    if (S.job === 'seeking') {
      const hiP = c.p === 'hi' || c.p === 'eca', sy = S.flags.seekY || 1;
      const ins = uiOK(), months = !ins ? 0 : c.id === 'USA' ? 6 : hiP ? 12 : S.formal ? 6 : 0, yrs = hiP && c.id !== 'USA' ? 2 : 1;
      if (months && sy <= yrs) add("Trợ cấp thất nghiệp", Math.min(Math.max(med * 0.4, (S.lastInc || 0) * 0.5), med * 0.8) * (sy === 1 ? months / 12 : 1));
      else if (hiP && S.flags.irreg == null && !(S.mig && !ins && S.age - (S.migY || S.age) < 1)) add("Trợ cấp sinh hoạt", med * 0.15);
      if (sy === yrs + 1 && months) log("Trợ cấp thất nghiệp đã hết. Giờ bạn phải sống bằng tiền dành dụm.", 'bad');
    }
    if (pInc > 0) {
      const r = saveRate(c, pInc, med, true);
      add("Để dành từ thu nhập của bạn đời", pInc * r * 0.7);
      add("Chi phí nuôi con", -kidsUnder * pInc * 0.035);
      add("Chi phí sinh hoạt (từ tiền dành dụm)", -drawOf(0.02, c));
    } else if (S.job === 'prison') {
      add("Tiền lưu ký khi ở tù", -subsist * 0.05);
    } else {
      const atHome = ddKept() || (a < (S.flags.backHome != null ? 40 : 30) && !S.fam.married && !S.mig && withParents() && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)));
      const live = subsist * (S.fam.married ? 0.6 : atHome ? 0.3 : 1);
      add(S.school ? "Sinh hoạt phí khi đi học" : "Chi phí sinh hoạt (không có thu nhập)", -live);
      if (rohCamp()) add("Lương thực phân phối và cứu trợ", live);
      if (S.school === 'phd') add("Trợ cấp nghiên cứu sinh tiến sĩ", live * (c.ppp >= 25000 ? 0.9 : 0.6));
      else if (S.school === 'uni' && S.flags.acad) add("Hỗ trợ học viên sĩ quan", live);
      else if ((S.school === 'uni' || S.school === 'grad' || S.school === 'voc') && commEra(studyAway() || S.cur)) add("Học bổng nhà nước và ký túc xá", live);
      else if ((S.school || (atHome && a < 25)) && !S.fam.married && famCanHelp() && !rohCamp()) add("Tiền sinh hoạt bố mẹ gửi", live * (a < 18 ? 1 : FAM_PAY[S.q]));
      else if (S.job === 'seeking' && a < 35 && S.q >= 4 && !S.fam.married && famCanHelp() && !rohCamp()) add("Tiền sinh hoạt bố mẹ gửi", live * FAM_PAY[S.q] * (S.flags.rich ? 1 : 0.6));
      dep = !S.fam.married && a < 25 && !!(S.school || atHome);
      add("Chi phí sinh hoạt (từ tiền dành dụm)", -drawOf(S.retired ? retDraw(a) : 0.04, c) * (S.retired ? oldShare() * oneHH() : oldShare()));
    }
  }
  { const kin = S.fam.kids.filter(k => k.alive && k.placed && k.placed.k === 'kin').length; if (kin) add("Sinh hoạt phí cho con gửi ở nhà họ hàng", -kin * med * 0.04); }
  if (S.flags.soloAid != null && S.age <= S.flags.soloAid && kidsSmall().length) add("Hỗ trợ cha mẹ đơn thân", med * 0.08);
  { const gh = gkHome().length; if (gh) add("Chi phí nuôi cháu", -gh * gkCost(c)); if (S.flags.gkPay) add("Tiền cấp dưỡng cho cháu", -S.flags.gkPay.n * gkCost(c) * 0.35); }
  { const P = S.fam.partner; if (S.fam.married && P && P.alive && P.inc > 0 && (P.postEnd > a || S.flags.post)) add("Phụ cấp công tác nước ngoài", P.inc * 0.2); }
  if (S.income > 0 && S.money + save < 0) { const P = S.fam.partner; if (S.fam.married && P && P.alive && P.inc > 0 && P.ret && S.job !== 'prison') {
    const x = Math.min(-(S.money + save), P.inc * (S.fam.co ? 0.6 : 1) * saveRate(c, P.inc, med, true) * 0.7); if (x > 0) add("Nợ cùng trả bằng thu nhập của bạn đời", x); } }
  if (S.flags.farSea && S.job === 'fisher' && S.income > 0) add("Phụ cấp đi tàu cá viễn dương", S.income * 0.8);
  if (S.flags.custody) {
    const minor = k => k.alive && k.cust && S.age - k.bornAt < 18, aw = S.fam.kids.filter(k => minor(k) && k.away), away = aw.length;
    const home = S.flags.custody === 'me' ? S.fam.kids.filter(k => minor(k) && !k.away).length : 0;
    if (away && S.income > 0) add("Tiền cấp dưỡng con đã trả", -S.income * custPay(away) * aw.reduce((t, k) => t + custPaid(kidLand(k)), 0) / away);
    if (home && S.flags.exInc > 0) add("Tiền cấp dưỡng con nhận được", S.flags.exInc * custPay(home) * custPaid(c));
    if (!S.fam.kids.some(minor)) S.flags.custody = null;
  }
  if (partyMem() && S.income > 0) add("Đảng phí", -S.income * 0.01);
  const kh = kidHelp(c); if (kh > 0) add("Tiền sinh hoạt con cái gửi", kh);
  if (a < 60 && !S.retired) { let nb = 0;
    for (const k of S.fam.kids) {
      const ka = a - k.bornAt; if (!k.alive || k.away || k.abroad || k.placed || !(!k.grown || k.withMe || k.stay) || ka < 20 || !k.job || !JOBS[k.job] || (k.path === 'uni' && ka < 23) || kidWd(k, ka)) continue;
      if (k.brd == null) { k.brd = chance(c.p === 'hi' ? 0.5 : 0.7) ? 1 : 0; if (k.brd) log(L`${iga(callName(k.name))} 월급에서 다달이 생활비를 보태기 시작했습니다. 고맙고도 미안했습니다.`, 'warm'); }
      if (k.brd && nb < 2) { nb++; add("Tiền sinh hoạt con sống cùng góp", med * (c.p === 'hi' ? 0.015 : 0.025)); }
    } }
  if (S.income > 0) S.flags.pSupNoted = 0;
  {
    const pk = S.fam.kids.filter(k => k.alive && S.age - k.bornAt >= 6 && S.age - k.bornAt < 18 && kidPrivOf(k)), np = pk.length;
    if (np && (S.flags.tightY || 0) >= 3 && chance(0.5)) { kidsToPublic(); log("Học phí quá sức gánh vác, bạn đã chuyển các con sang trường công.", 'bad'); }
    else if (np) add("Học phí trường tư của con", -pk.reduce((x, k) => x + schoolFee(k.lb && CBY[k.awayIn] ? CBY[k.awayIn] : c), 0));
  }
  if (S.flags.bcare) { const y = youngestAge(); if (y >= 6 || a >= S.flags.bcare.until) S.flags.bcare = null; else if (S.flags.bcare.k === 'pay') add("Phí giữ trẻ", -careCost(c) * (y < 3 ? 1 : 0.5)); }
  if (S.flags.ptTo != null && a + 1 >= S.flags.ptTo) { S.flags.ptTo = null; if (isWorking()) log("Con đã lớn, bạn trở lại làm việc toàn thời gian."); }
  if (S.fam.wife2 && S.fam.wife2.alive && S.fam.married) add("Chi tiêu nhà người vợ thứ hai", -Math.max(S.income, subsist) * 0.12);
  if (S.flags.careCost) { const p = S.fam[S.flags.careKey]; if (p && p.alive) add("Chăm sóc bố mẹ", -S.flags.careCost); else S.flags.careCost = 0; }
  if (S.flags.oldHome === 'care') { const aid = netWorth() < 0; add("Phí viện dưỡng lão", -careHomeCost(c) * (aid ? 0.2 : 1));
    if (aid && S.flags.careAid == null) { S.flags.careAid = a; log("Tiền dành dụm đã cạn, phần lớn phí viện dưỡng lão giờ do trợ cấp của nhà nước chi trả.", 'note'); } }
  if (S.job === 'soldier' && !(S.house > 0) && isWorking() && !withParents()) add("Tiền nhà tiết kiệm nhờ ở nhà công vụ quân đội", med * 0.03);
  if (nearWork()) { if (!(S.house > 0) && S.job !== 'soldier') add("Tiền nhà gần chỗ làm", -med * 0.04); S.st.hl = clamp(S.st.hl + 0.4, 0, 100); }
  let rp = 0; const rpCap = () => S.income * (S.pct > 0.6 ? 0.25 : 0.12);
  { const owe = -S.money;
    if (S.money < 0 && S.income > 0) { if (owe > 0 && S.retired) { rp = Math.min(owe, rpCap()); addP("Nợ trả bớt nhờ chi tiêu dè sẻn", rp); } S.flags.inDebt = Math.max(S.flags.inDebt || 0, -S.money); } }
  if (S.retired && S.income > 0) { const s0 = save - lump - rp, capd = Math.min(s0, S.income * (0.03 + oldKeep() + retKeep(S.income / med))); if (capd < s0) addP("Chi phí sinh hoạt khi nghỉ hưu", capd - s0); add("Chi phí sinh hoạt (từ tiền dành dụm)", -drawOf(retDraw(a), c) * oldShare() * oneHH()); }
  const noCredit = S.money < 0 && S.money <= -creditLimit(c) * 0.98;
  if (S.job !== 'prison' && !noCredit) for (const hb of S.hobbies) add("Chi phí cho sở thích", -(hobDef(hb.id).cost || 0) * 0.6 * Math.max(S.income, subsist));
  if (S.smoker && a >= 18 && S.job !== 'prison') add("Tiền thuốc lá", -Math.min(med * (c.ppp >= 25000 ? 0.02 : 0.03), Math.max(S.income, subsist) * 0.06));
  if (S.flags.diet && a >= 18 && S.job !== 'prison') add(S.flags.diet === 'good' ? "Đi chợ chọn nhiều rau và ngũ cốc nguyên hạt" : "Ăn ngoài và gọi đồ ăn", -med * (S.flags.diet === 'good' ? 0.015 : 0.035));
  if (S.house > 0 && ownHomeHere() && !S.retired) add("Tiền thuê nhà tiết kiệm nhờ ở nhà mình", S.house * (OWN_RENT[c.id] || 0.025) * (S.money < 0 ? 1 : OWN_KEEP));
  defRentYear(add, c);
  defAidYear(add, c);
  if (S.focusW.health) add("Chăm sóc sức khỏe", -0.02 * S.focusW.health * S.income);
  if (S.focusW.learn) add("Chi cho việc học", -0.02 * S.focusW.learn * S.income);
  if (S.focusW.parttime) add("Làm thêm", S.focusW.parttime * incomeAt(studyAway() ? CBY[studyAway()] : C(), 0.25) * 0.3);
  if (S.flags.craftSell != null && a < 85 && S.job !== 'prison' && S.hobbies.some(h => h.id === 'crafts')) add("Bán đồ tự làm theo sở thích", incomeAt(c, 0.5) * 0.03);
  revMortYear(add);
  rentalYear(add);
  bizKeepYear(add);
  hschPay(add, save);
  if (insOn() && a >= 18) add("Phí bảo hiểm", -med * (0.012 + (S.fam.married ? 0.006 : 0) + 0.004 * homeOthers().kids.length + (a < 70 ? 0.006 : 0)));
  if (!S.retired && S.income > 0 && !ddKept()) { const owe = -(S.money + Math.min(0, save)) - homeV() * 0.8;
    if (owe > 0) { const x = Math.min(owe, rpCap()); rp += x; addP("Nợ trả bớt nhờ chi tiêu dè sẻn", x); } }
  S.money += save; if (S.money < 0 && S.money > -1e-6) S.money = 0;
  if (ddKept() && S.money < 0) { const x = -S.money; S.money = 0; S.flags.inDebt = 0; book(S.flags.ddHome === 'gh' ? "Hỗ trợ của nhà ở nhóm" : "Phần gia đình sống cùng gánh giúp", x); }
  if (dep && a < 18 && S.money < 0) { const x = -S.money; S.money = 0; S.flags.inDebt = 0; book(famCanHelp() ? "Khoản nợ bố mẹ trả giúp" : "Phần gia đình sống cùng gánh giúp", x); }
  if ((dep || (S.job === 'seeking' && a < 30 && !S.fam.married)) && S.q >= 4 && S.money < 0 && famCanHelp() && !rohCamp()) { const x = S.flags.rich ? -S.money : Math.min(-S.money, med * (S.q === 5 ? 0.5 : 0.15)); S.money += x; book("Khoản nợ bố mẹ trả giúp", x); }
  if (S.flags.inDebt && S.money >= 0) { if (a >= 18 && S.flags.inDebt > med * 0.5) { logA('pass', "Bạn đã trả hết mọi khoản nợ!", 'big'); S.flags.paidAt = a; } S.flags.inDebt = 0; }
  if (S.money > 0) investYear();
  else { S.flags.invG = 0; S.flags.invM = 0; }
  if (S.money < 0) {
    const mort = Math.min(-S.money, homeV() * 0.8), lo = lowInc(c), g = -mort * (lo ? 0.06 : mortR(c)) + (S.money + mort) * (lo ? 0.1 : 0.05);
    const dx = eraDebt() * S.money;
    S.money += g + dx; book("Lãi nợ", g + dx);
    if (dx < 0 && -dx >= med * 0.02 && a >= 18) log(L`대출 금리가 치솟아 빚 이자로 ${wonStr(-dx)}을 더 냈습니다.`, 'bad'); }
  let lim = creditLimit(c);
  if (S.money < -lim && rentals().length) { rentalFire(); lim = creditLimit(c); }
  if (S.money < -lim) {
    const cut = Math.min(-lim - S.money, Math.max(0, S.income) * 0.3 + med * 0.15), k = clamp(cut / med, 0, 1);
    S.money += cut; book("Chi tiêu cắt giảm (không vay thêm được)", cut);
    S.st.hl = clamp(S.st.hl - 3 * k, 0, 100); S.st.h = clamp(S.st.h - 5 * k, 0, 100); S.flags.broke = (S.flags.broke || 0) + 1;
    const P = S.fam.partner, hhInc = Math.max(0, S.income) + (S.fam.married && P && P.alive && P.inc > 0 ? P.inc * (S.fam.co ? 0.6 : 1) : 0);
    const w = S.job === 'prison' || careNow() ? 0 : clamp(cut / Math.max(hhInc, subsist) / 0.4, 0, 1);
    S.flags.want = w; S.flags.wantY = w >= 0.75 ? (S.flags.wantY || 0) + 1 : 0;
    if (S.flags.wantY >= 2 && a >= 18 && (S.flags.lastWant == null || a - S.flags.lastWant >= 10)) { S.flags.lastWant = S.flags.lastTight = a;
      log("Nhiều năm liền phải nhịn bữa nhiều ngày, cơ thể bạn yếu đi thấy rõ.", 'bad', "Năm 2023, khoảng 733 triệu người trên thế giới phải chịu cảnh đói (FAO SOFI 2024)"); }
    else if (k > 0.04 && a >= 18 && S.job !== 'prison' && !careNow() && (S.flags.lastTight == null || a - S.flags.lastTight >= 7)) { S.flags.lastTight = a;
      log("Không còn nơi nào để vay, bạn bớt bữa và thắt chặt mọi khoản chi để cầm cự.", 'bad', lowInc(c) ? "Ở các nước thu nhập thấp, phần lớn người đi vay chỉ vay những khoản nhỏ từ gia đình và bạn bè (Ngân hàng Thế giới, Findex)" : null); }
  } else if (S.flags.wantY) S.flags.wantY = 0;
  S.flags.tightY = S.money < -lim * 0.85 && -S.money > med * 0.3 ? (S.flags.tightY || 0) + 1 : 0;
  if (S.flags.tightY >= 4 && (S.flags.lastCap == null || a - S.flags.lastCap >= 6)) {
    const hiP = c.p === 'hi' || c.p === 'eca', x = -S.money * (hiP ? 0.6 : 0.4); S.flags.lastCap = a; S.flags.tightY = 0; S.money += x;
    book(hiP ? "Nợ được xóa" : "Nợ họ hàng gánh giúp", x);
    log(hiP ? L`오래 갚지 못한 빚 가운데 ${wonStr(x)}을 채무 조정으로 탕감받았습니다. 남은 빚은 ${wonStr(-S.money)}입니다.` : L`오래 갚지 못한 빚 가운데 ${wonStr(x)}을 친척들과 빌려준 사람들이 덜어 주었습니다. 남은 빚은 ${wonStr(-S.money)}입니다.`, 'bad');
  }
  if (!S.house && S.flags.hsz) S.flags.hsz = null;
  if (!(S.house > 0) && S.owns.house) delete S.owns.house;
  const hz = invNorm(clamp(rnd(), 0.001, 0.999)); let hmv;
  if (ecoDrawn()) { if (S.flags.hMkC !== S.cur) { S.flags.hMkC = S.cur; S.flags.hMk = 0; } const o = S.flags.hMk || 0, n = clamp(0.85 * o + 0.05 * ecoZ(hz), -0.6, 0.6); S.flags.hMk = n; hmv = n - o; }
  else { S.flags.hMk = 0; hmv = 0.05 * ecoZ(hz) + eraHse(); }
  const hr = S.house || rentV() ? 0.002 + hmv + eraHseG() : 0;
  rentalPrices(hr);
  if (S.house) {
    if (S.flags.hsz == null) houseSet();
    const r = clamp(hr, -0.3, 0.25), d = S.house * r;
    book("Biến động giá nhà", d); S.house += d;
    if (a >= 18 && Math.abs(r) >= 0.1 && (S.flags.lastHp == null || a - S.flags.lastHp >= 5)) { S.flags.lastHp = a;
      log(r < 0 ? L`집값이 한 해 사이 ${Math.round(-r * 100)}% 떨어졌습니다. (−${wonStr(-d)})` : L`동네 집값이 크게 올라 집값이 ${Math.round(r * 100)}% 뛰었습니다. (+${wonStr(d)})`, r < 0 ? 'bad' : 'big'); }
    else if (a >= 18 && (S.flags.hMk || 0) < -0.12 && (S.flags.lastHp == null || a - S.flags.lastHp >= 8)) { S.flags.lastHp = a;
      log("Mấy năm nay giá nhà ở khu vực này cứ đi xuống. Nhà của bạn mất giá, và giá mua một căn nhà mới cũng giảm theo.", 'note'); }
  }
  S.lastSave = paySv;
}