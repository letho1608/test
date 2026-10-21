// js/society.js - Xa hoi: ton giao, thu cung, kinh doanh, hon nhan, du hoc
const revMortOK = () => S.house > 0 && !!S.owns.house && !S.flags.revM && S.age >= 60 && (S.retired || S.age >= 65) && C().ppp >= 30000;
const revRate = () => clamp(0.015 + (S.age - 55) * 0.0012, 0.02, 0.065);
function revMortYear(add) {
  const R = S.flags.revM; if (!R) return;
  if (!S.owns.house) { S.flags.revM = null; return; }
  const x = R.y, h0 = S.house; add("Lương hưu từ nhà ở", x); S.house = Math.max(0, S.house - x * 1.04);
  book("Phần giá trị nhà đã rút qua lương hưu từ nhà ở", S.house - h0);
}
const loanVehicles = () => [S.owns.car ? "ô tô" : null, S.owns.moto ? "xe máy" : null].filter(Boolean);
function loanSells() {
  const vs = loanVehicles(), out = [];
  if (rentals().length) out.push({ k: 'sellr', label: "Bán một căn nhà đang cho thuê", sub: "Tiền thuê hằng tháng sẽ dừng, nhưng nhà mình ở vẫn còn" });
  if (vs.length) out.push({ k: 'sellv', label: L`${eul(listAnd(vs))} 판다`, sub: "Tài sản↓" });
  if (S.house > 0) out.push({ k: 'sellh', label: "Bán nhà", sub: "Một khoản tiền lớn · mất chỗ ở" });
  return out;
}
const famHelpWho = () => !farFromNK() && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent) || sibN() > 0);
const farFromNK = () => !!S.flags.defector && S.cur !== 'PRK';
const oldFrHere = () => !(S.mig && (S.flags.defector || S.refugee || S.flags.refEver || S.flags.exile) && S.age - (S.migY != null ? S.migY : S.age) < 12) && !aloneAbroad();
function familyHelp(debt) {
  const par = S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent), n = S.flags.famHelpN || 0; S.flags.famHelpN = n + 1;
  const means = famHelpWho() ? incomeAt(B(), clamp((S.q - 0.5) / 5, 0.05, 0.95)) * [0, 0.12, 0.15, 0.25, 0.4, 0.5][S.q] * (par ? 1 : 0.5) : incomeAt(C(), 0.5) * 0.05;
  return Math.min(debt * (0.3 + 0.1 * S.q), means / (1 + n)) * (0.7 + 0.5 * rnd());
}
const RURAL = () => ({
  KOR: [["tỉnh Gyeonggi", 22], ["tỉnh Gyeongsang Bắc", 13], ["tỉnh Gyeongsang Nam", 13], ["tỉnh Chungcheong Nam", 12], ["tỉnh Jeolla Nam", 10], ["tỉnh Chungcheong Bắc", 8], ["tỉnh Jeolla Bắc", 7], ["tỉnh Gangwon", 6], ["đảo Jeju", 2]],
  JPN: [["Hokkaido", 5], ["vùng Tohoku", 12], ["vùng Kanto", 15], ["vùng Chubu", 22], ["vùng Kinki", 12], ["vùng Chugoku", 9], ["Shikoku", 6], ["Kyushu", 19]],
  CHN: [["tỉnh Hà Nam", 9], ["tỉnh Tứ Xuyên", 7], ["tỉnh Sơn Đông", 7], ["tỉnh Hà Bắc", 6], ["tỉnh Hồ Nam", 6], ["tỉnh An Huy", 5.5], ["Quảng Tây", 5], ["tỉnh Vân Nam", 5], ["tỉnh Quảng Đông", 5], ["tỉnh Quý Châu", 4], ["tỉnh Giang Tây", 4], ["tỉnh Hồ Bắc", 4], ["tỉnh Giang Tô", 4], ["tỉnh Cam Túc", 3], ["tỉnh Thiểm Tây", 3], ["tỉnh Hắc Long Giang", 2]],
  IND: [["Uttar Pradesh", 155], ["Bihar", 117], ["Tây Bengal", 62], ["Maharashtra", 61], ["Madhya Pradesh", 71], ["Rajasthan", 51], ["Andhra Pradesh", 56], ["Odisha", 35], ["Karnataka", 37], ["Gujarat", 34], ["Tamil Nadu", 37], ["Assam", 27], ["Kerala", 17], ["Punjab", 17], ["Haryana", 16]],
  USA: [["Texas", 41], ["Bắc Carolina", 32], ["Pennsylvania", 30], ["Ohio", 26], ["Michigan", 25], ["Georgia", 25], ["Tennessee", 22], ["bang New York", 21], ["Alabama", 18], ["Kentucky", 18], ["Missouri", 18], ["Indiana", 18], ["Wisconsin", 17], ["Virginia", 17], ["Mississippi", 15], ["Iowa", 11], ["Kansas", 8], ["Montana", 5]],
  IDN: [["Đông Java", 17], ["Trung Java", 16], ["Tây Java", 12], ["Bắc Sumatra", 7], ["Nam Sulawesi", 5], ["Đông Nusa Tenggara", 4.5], ["Lampung", 5], ["Nam Sumatra", 5], ["Tây Kalimantan", 3.5], ["Aceh", 3.5], ["Tây Nusa Tenggara", 3], ["Bali", 1.5], ["Papua", 2.5]],
  NGA: [["bang Kano", 9], ["bang Katsina", 7], ["bang Kaduna", 5], ["bang Bauchi", 6], ["bang Jigawa", 5], ["bang Sokoto", 4], ["bang Niger", 5], ["bang Borno", 4], ["bang Zamfara", 4], ["bang Kebbi", 4], ["bang Benue", 4], ["bang Oyo", 3], ["bang Akwa Ibom", 3], ["bang Enugu", 2.5], ["bang Imo", 3]],
  PAK: [["Punjab", 70], ["Sindh", 23], ["Khyber Pakhtunkhwa", 30], ["Balochistan", 9]],
  BGD: [["phân khu Dhaka", 18], ["phân khu Chattogram", 17], ["phân khu Rajshahi", 14], ["phân khu Khulna", 12], ["phân khu Rangpur", 14], ["phân khu Mymensingh", 10], ["phân khu Sylhet", 9], ["phân khu Barishal", 7]],
  BRA: [["bang Bahia", 18], ["bang Minas Gerais", 15], ["bang Maranhão", 12], ["bang Pará", 12], ["bang Pernambuco", 8], ["bang Ceará", 8], ["bang Piauí", 6], ["bang Paraná", 6], ["bang Rio Grande do Sul", 6], ["bang São Paulo", 9]],
  ETH: [["Oromia", 40], ["Amhara", 25], ["vùng phía Nam", 20], ["Tigray", 5], ["vùng Somali", 6], ["Afar", 2]],
  MEX: [["Chiapas", 12], ["Veracruz", 12], ["Oaxaca", 10], ["Puebla", 9], ["Guerrero", 7], ["Michoacán", 7], ["bang México", 9], ["Hidalgo", 6], ["Guanajuato", 7], ["Jalisco", 5]],
  PHL: [["đảo Luzon", 50], ["quần đảo Visayas", 23], ["đảo Mindanao", 27]],
  VNM: [["đồng bằng sông Cửu Long", 26], ["đồng bằng sông Hồng", 22], ["miền núi phía Bắc", 18], ["duyên hải miền Trung", 24], ["Tây Nguyên", 10]],
  EGY: [["Thượng Ai Cập", 50], ["châu thổ sông Nile", 50]],
});
const RUR_DIR = () => ["miền Bắc", "miền Nam", "miền Đông", "miền Tây", "miền Trung"];
function ruralWhere() {
  if (S.urban || S.cur !== S.born || S.refugee) return '';
  const eg = S.eth && ETH_G[S.eth.g], R = eg && eg.rur ? eg.rur : RURAL()[S.born], h = hashStr(nmSeed() + S.born + (S.by || ''));
  if (!R) return RUR_DIR()[h % 5];
  const tot = R.reduce((t, r) => t + r[1], 0); let u = (h % 10000) / 10000 * tot;
  for (const [n, w] of R) { u -= w; if (u < 0) return n; } return R[0][0];
}
const ruralLbl = () => { const rp = rohPlace(); if (rp) return rp; const w = ruralWhere(); return w ? L`${w} 농촌` : "nông thôn"; };
function cityOfPeek() { const c = C(); const x = cityOf(c); S.flags.cityPeek = x; return x; }
const kidsSmall = () => S.fam.kids.filter(k => k.alive && !k.away && !k.sk && !k.grown && S.age - k.bornAt < 15);
const soloParent = () => { const f = S.fam, P = f.partner; return !(f.married && P && P.alive && !P.divorced); };
const kidcareHard = () => (S.income <= 0 && S.money < med() * 0.3) || hhPct() < 0.12 || debtHeavy() || S.st.hl < 35;
function kinWho() {
  const f = S.fam, away = (S.mig && !famCame() && S.flags.parCame == null) || farFromNK();
  if (away) return null;
  if ((f.mom.alive && f.mom.age < 78) || (f.dad.alive && !f.dad.absent && f.dad.age < 78)) return 'gp';
  return sibN() > 0 ? 'sib' : null;
}
const kinWord = w => w === 'gp' ? parW() : "Anh chị em";
const fosterLand = c => ['hi', 'eca'].includes(c.p) && !['KOR', 'JPN', 'TWN', 'HKG'].includes(c.id);
const kidcareFact = c => c.id === 'KOR' ? "Năm 2021, Hàn Quốc có thêm 3.657 trẻ em cần được nhà nước bảo vệ. Sau ngược đãi, các lý do phổ biến nhất là bố mẹ ly hôn (11%), bố mẹ không kết hôn (10%) và bố hoặc mẹ qua đời (8%) (Bộ Y tế và Phúc lợi Hàn Quốc)"
  : "Trên thế giới có 2,7-5,4 triệu trẻ em lớn lên trong các cơ sở bảo trợ, và phần lớn các em vẫn còn bố hoặc mẹ (UNICEF 2017, Lumos)";
const KIDCARE_HELP = () => S.cur === 'KOR' ? "Khi một mình nuôi con trở nên quá khó, đường dây tư vấn phúc lợi 129 hoặc trung tâm cộng đồng địa phương có thể hướng dẫn bạn về hỗ trợ cho cha mẹ đơn thân và trợ cấp khẩn cấp" : "Nhiều nước có chương trình hỗ trợ cha mẹ đơn thân và nơi tiếp nhận trợ cấp khẩn cấp, thường thông qua cơ quan xã hội địa phương";
const placedK = () => S.fam.kids.filter(k => k.alive && k.placed).length * 1.5 + (S.flags.givenAt != null && S.age - S.flags.givenAt < 12 ? 2 : 0);
const placedEdu = k => k.pc === 'care' ? 0.35 : k.pc === 'kin' ? 0.7 : 1;
const KID_DEG_K = 2;
function kidUniP(k) {
  const c = kidLand(k), q = clamp(kidHomeQ(C()), 1, 5), e = eduProbs(c, k.sex, q, !!S.urban);
  let P = e.t1 * e.t2 * e.t3 * e.t4;
  if (S.edu >= 4) P = odds(P, KID_DEG_K);
  P = Math.min(0.95, P * (1 + 0.25 * (k.tutor || 0)) * (k.priv ? 1.15 : 1) * placedEdu(k) * kqEduK(k) * ddKidUni(k));
  return clamp(1 - Math.sqrt(1 - P), 0.01, 0.97);
}
function dropKid(i) {
  const f = S.fam, k = f.kids.splice(i, 1)[0];
  const fix = j => j == null || j < 0 ? j : j === i ? null : j > i ? j - 1 : j;
  for (const q of S.queue || []) if (q.p && q.p.i != null) q.p.i = fix(q.p.i);
  S.queue = (S.queue || []).filter(q => !(q.p && q.p.i === null));
  for (const key of ['kidUniQ', 'kidWedQ']) if (S.flags[key]) S.flags[key] = S.flags[key].map(fix).filter(x => x != null);
  if (S.flags.careQ != null) S.flags.careQ = fix(S.flags.careQ);
  if (S.flags.careWait != null) S.flags.careWait = fix(S.flags.careWait);
  if (S.flags.oldKidI != null && S.flags.oldKidI >= 0) { const j = fix(S.flags.oldKidI); S.flags.oldKidI = j == null ? -1 : j; }
  return k;
}
const SHARIA_INH = new Set(['SAU', 'ARE', 'QAT', 'KWT', 'OMN', 'BHR', 'YEM', 'IRN', 'IRQ', 'JOR', 'SYR', 'EGY', 'LBY', 'DZA', 'MAR', 'TUN', 'SDN', 'PAK', 'AFG', 'BGD', 'MYS', 'IDN', 'MRT', 'SEN', 'NER', 'MLI', 'NGA', 'PSE', 'LBN', 'MDV', 'COM', 'DJI']);
const FREE_WILL = new Set(['USA', 'GBR', 'CAN', 'AUS', 'NZL', 'IRL', 'IND', 'ZAF', 'SGP', 'HKG', 'ISR', 'JAM', 'KEN', 'GHA', 'UGA', 'NGA', 'ZMB', 'ZWE', 'MWI']);
function inhLaw(c) {
  if (S.rel === 'M' && SHARIA_INH.has(c.id)) return 'isl';
  if (c.id === 'KOR') return 'kor'; if (c.id === 'JPN') return 'jpn'; if (c.id === 'USA') return 'usa';
  if (c.id === 'IND' && ['H', 'S', 'B', 'J'].includes(S.rel)) return 'hin';
  return 'gen';
}
const stepHeirs = () => S.fam.kids.filter(k => k.sk && k.alive);
function heirsOf() {
  const f = S.fam, P = f.partner, sp = f.married && P && P.alive && !P.divorced && unionOf(P) !== 'none' ? P : null;
  const units = f.kids.filter(k => !k.sk && (k.alive || (k.kb || 0) > 0)).map(k => ({ k, n: k.alive ? k.name.full : L`${callName(k.name)}의 자녀들`, sex: k.sex }));
  const par = [f.mom.alive ? "mẹ" : null, f.dad.alive && !f.dad.absent ? "bố" : null].filter(Boolean);
  return { sp, units, par, sib: sibN() };
}
function lawShares(c) {
  const out = lawShares0(c), w2 = S.sex === 'M' && S.fam.wife2 && S.fam.wife2.alive ? S.fam.wife2.name.full : null, h = heirsOf();
  if (!w2 || !h.sp) return out;
  const i = out.findIndex(x => x[0] === h.sp.name.full); if (i < 0) return out;
  const half = out[i][1] / 2; out[i][1] = half; out.splice(i + 1, 0, [w2, half]); return out;
}
function lawShares0(c) {
  const h = heirsOf(), law = inhLaw(c), spN = h.sp ? h.sp.name.full : null, U = h.units, out = [];
  const even = (list, tot) => list.forEach(x => out.push([x, tot / list.length]));
  if (law === 'isl') {
    let rest = 1;
    if (spN) { const s = U.length ? (S.sex === 'M' ? 1 / 8 : 1 / 4) : (S.sex === 'M' ? 1 / 4 : 1 / 2); out.push([spN, s]); rest -= s; }
    if (U.length) { if (h.par.length) { h.par.forEach(p => out.push([p, 1 / 6])); rest -= h.par.length / 6; }
      const w = U.map(u => u.sex === 'M' ? 2 : 1), tw = w.reduce((a, b) => a + b, 0); U.forEach((u, i) => out.push([u.n, rest * w[i] / tw])); return out; }
    if (h.par.length) { even(h.par, rest); return out; }
    if (h.sib) { out.push([L`형제자매 ${h.sib}명`, rest]); return out; }
    if (spN) { out[0][1] = 1; return out; }
    return [];
  }
  if (U.length) {
    if (!spN) { even(U.map(u => u.n), 1); return out; }
    if (law === 'kor') { const t = 1.5 + U.length; out.push([spN, 1.5 / t]); U.forEach(u => out.push([u.n, 1 / t])); return out; }
    if (law === 'hin') { const n = 1 + U.length + (S.fam.mom.alive ? 1 : 0); out.push([spN, 1 / n]); U.forEach(u => out.push([u.n, 1 / n])); if (S.fam.mom.alive) out.push(["mẹ", 1 / n]); return out; }
    if (law === 'usa' && !U.some(u => u.k.m2 || (u.k.step && u.k.step !== S.fam.marriages))) { out.push([spN, 1]); return out; }
    out.push([spN, 0.5]); U.forEach(u => out.push([u.n, 0.5 / U.length])); return out;
  }
  if (spN) {
    if (law === 'kor' && h.par.length) { const t = 1.5 + h.par.length; out.push([spN, 1.5 / t]); h.par.forEach(p => out.push([p, 1 / t])); return out; }
    if (law === 'jpn' && h.par.length) { out.push([spN, 2 / 3]); even(h.par, 1 / 3); return out; }
    if (law === 'jpn' && h.sib) { out.push([spN, 0.75], [L`형제자매 ${h.sib}명`, 0.25]); return out; }
    out.push([spN, 1]); return out;
  }
  if (h.par.length) { even(h.par, 1); return out; }
  if (h.sib) { out.push([L`형제자매 ${h.sib}명`, 1]); return out; }
  return [];
}
function giveTo() {
  if (S.flags.hsch && S.flags.hsch.end == null) return 'edu';
  if (S.dis) return 'dis';
  if (S.refugee || S.refugeeUntil != null || S.flags.defSK != null) return 'ref';
  const X = S.exp || {}, had = id => S.job === id || (X[id] && X[id][0] >= 3);
  if (['doctor', 'nurse', 'healthtech', 'care'].some(had)) return 'med';
  if (['teacher', 'prof'].some(had) || S.flags.dr != null) return 'edu';
  if (S.rel !== 'N' && S.hobbies.some(h => h.id === 'faith')) return 'faith';
  if (S.stats.kidsLost) return 'child';
  return S.edu >= 4 ? 'edu' : 'child';
}
const GIVE_N = () => ({ dis: "một tổ chức hỗ trợ người khuyết tật", ref: "một tổ chức hỗ trợ người tị nạn và người di cư", med: "một quỹ giúp hàng xóm đau ốm trả viện phí", edu: S.flags.hsch && S.flags.hsch.end == null ? "quỹ học bổng bạn lập ở quê nhà" : "quỹ học bổng cho học sinh, sinh viên có hoàn cảnh khó khăn", faith: "cộng đồng tôn giáo bạn từng sinh hoạt", child: "một tổ chức hỗ trợ trẻ em" });
const stepMax = c => inhLaw(c) === 'isl' && lawShares(c).length ? 1 / 3 : giveMax(c);
const giveMax = c => { const h = heirsOf(), law = inhLaw(c); if (!h.sp && !h.units.length) return 1; return law === 'isl' ? 1 / 3 : FREE_WILL.has(c.id) ? 1 : 0.5; };
const leftWorth = () => netWorth() + (S.deathAt && S.job === 'owner' ? bizVal(true) : 0);
function estateItems() {
  const o = [];
  if (S.house > 0) o.push(["Ngôi nhà bạn từng sống", S.house]);
  if (rentV() > 0) o.push([L`세 놓은 집 ${rentals().length}채`, rentV()]);
  const bv = S.flags.bizKeep ? S.flags.bizKeep.v : S.deathAt && S.job === 'owner' ? bizVal(true) : 0;
  if (bv > 0) o.push([S.flags.bizKeep ? L`${S.flags.bizKeep.w} 지분` : L`운영하던 ${bizWhat()}`, bv]);
  if (S.money) o.push([S.money > 0 ? "Tiền tiết kiệm" : "Nợ", S.money]);
  return o;
}
function estatePlan() {
  const c = CBY[(S.deathAt && S.deathAt.where) || S.cur] || C(), tot = leftWorth(), W = S.will, law = inhLaw(c);
  if (tot <= 0) return { total: tot, rows: [], how: tot < 0 ? (['KOR', 'JPN'].includes(c.id) && heirsOf().units.length ? "Các khoản nợ lớn hơn tài sản để lại nên các con đã từ chối nhận thừa kế. Khoản nợ không chuyển sang các con." : "Các khoản nợ lớn hơn tài sản để lại nên tất cả đều được dùng để trả nợ.") : '' };
  let give = 0, base = lawShares(c), how;
  const lawHow = !base.length ? "Vì không có người thừa kế, tài sản để lại thuộc về nhà nước." : law === 'kor' ? "Vì không có di chúc, tài sản được chia theo Bộ luật Dân sự: bạn đời nhận gấp rưỡi phần của mỗi người con (Bộ luật Dân sự, Điều 1009)."
    : law === 'jpn' ? "Vì không có di chúc, tài sản được chia theo Bộ luật Dân sự Nhật Bản: nếu có con, bạn đời nhận một nửa, các con chia đều nửa còn lại."
    : law === 'isl' ? "Theo luật thừa kế Hồi giáo, phần của bạn đời và bố mẹ được chia trước, phần còn lại con trai nhận gấp đôi con gái (Kinh Qur'an, chương 4)."
    : law === 'hin' ? "Theo Luật Thừa kế Hindu của Ấn Độ, bạn đời, các con và mẹ chia đều cho nhau. Từ năm 2005, con gái được nhận phần bằng con trai."
    : law === 'usa' ? "Vì không có di chúc, tài sản được chia theo luật của bang. Ở nhiều bang của Mỹ, nếu tất cả các con đều là con chung của hai vợ chồng thì bạn đời nhận toàn bộ."
    : "Vì không có di chúc, tài sản được chia theo luật. Phần của bạn đời và các con mỗi nước một khác đôi chút.";
  how = lawHow;
  if (W && W.k !== 'law') {
    const h = heirsOf(), spN = h.sp ? h.sp.name.full : (S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced ? S.fam.partner.name.full : null);
    if (W.k === 'give') give = 0.2; else if (W.k === 'giveall') give = giveMax(c);
    if (W.k === 'spouse' && spN) { const keep = FREE_WILL.has(c.id) ? 0 : 0.5, kids = lawShares(c).filter(([n]) => n !== spN && h.units.some(u => u.n === n));
      base = [[spN, 1 - kids.reduce((a, x) => a + keep * x[1], 0)]].concat(kids.map(([n, s]) => [n, keep * s])); }
    else if (W.k === 'fam') { const ppl = (spN ? [spN] : []).concat(h.units.map(u => u.n), stepHeirs().map(k => k.name.full)); if (ppl.length) base = ppl.map(n => [n, 1 / ppl.length]); }
    else if (W.k === 'own' && h.units.length) { const ls = lawShares(c), spS = spN && !FREE_WILL.has(c.id) ? 0.5 * ((ls.find(([n]) => n === spN) || [0, 0])[1]) : 0;
      base = (spS ? [[spN, spS]] : []).concat(h.units.map(u => [u.n, (1 - spS) / h.units.length])); }
    else if (W.k === 'step' && stepHeirs().length) { const sk = stepHeirs().map(k => k.name.full), g = stepMax(c), rest = lawShares(c);
      base = sk.map(n => [n, (rest.length ? g : 1) / sk.length]).concat(rest.map(([n, s]) => [n, s * (1 - g)])); }
    else if (W.k === 'home' && S.house > 0 && W.kid && h.units.some(u => u.n === W.kid)) {
      const hs = Math.min(1, S.house / tot), rest = lawShares(c); base = rest.map(([n, s]) => [n, s * (1 - hs) + (n === W.kid ? hs : 0)]);
    }
    how = L`${W.at}세에 쓴 유언장대로 나뉘었습니다.` + (give > 0 ? ' ' + L`${GIVE_N()[W.to] || GIVE_N().child}에 ${give >= 1 ? "toàn bộ tài sản" : L`${Math.round(give * 100)}%를`} 남겼습니다.` : '');
  }
  const rows = [];
  if (give > 0) rows.push([GIVE_N()[W.to] || GIVE_N().child, tot * give]);
  const sum = base.reduce((a, x) => a + x[1], 0) || 1;
  if (give < 1) { if (base.length) for (const [n, s] of base) rows.push([n, tot * (1 - give) * s / sum]); else rows.push(["Nhà nước (không có người thừa kế)", tot * (1 - give)]); }
  const unmarried = S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced && unionOf(S.fam.partner) === 'none' && !(W && ['spouse', 'fam'].includes(W.k));
  const stepOut = !(W && (W.k === 'fam' || W.k === 'own' || W.k === 'step')) && stepHeirs().length;
  return { total: tot, rows: rows.filter(r => r[1] > 0.5), how: how + (unmarried ? ' ' + "Người sống cùng bạn mà không kết hôn không phải là người thừa kế theo luật." : '') + (stepOut ? ' ' + "Con riêng của bạn đời mà bạn cùng nuôi lớn không phải là người thừa kế theo luật; chỉ khi có tên trong di chúc thì các con mới được nhận phần." : '') };
}
const willOK = () => S.age >= 50 && netWorth() > med() * 0.5 && !S.flags.hideCN && S.job !== 'prison';
const willCommon = c => c.p === 'hi' && !['KOR', 'JPN', 'TWN'].includes(c.id) && netWorth() > med() * 2;
const CATH = { ITA: 0.97, ESP: 0.95, PRT: 0.95, POL: 0.95, IRL: 0.9, FRA: 0.85, BEL: 0.85, AUT: 0.85, HRV: 0.95, SVK: 0.8, CZE: 0.6, HUN: 0.6, LTU: 0.9,
  PHL: 0.88, TLS: 0.97, VNM: 0.9, KOR: 0.3, CHN: 0.25, IND: 0.3, IDN: 0.3, LKA: 0.8, LBN: 0.7, USA: 0.3, CAN: 0.5, AUS: 0.35, NZL: 0.2, GBR: 0.15,
  DEU: 0.5, NLD: 0.4, CHE: 0.5, MEX: 0.9, BRA: 0.7, COL: 0.85, ARG: 0.85, PER: 0.85, CHL: 0.75, VEN: 0.85, ECU: 0.85, BOL: 0.8, PRY: 0.85, URY: 0.75,
  GTM: 0.55, HND: 0.55, SLV: 0.55, NIC: 0.55, CRI: 0.75, PAN: 0.8, DOM: 0.7, CUB: 0.8, HTI: 0.6, COD: 0.5, AGO: 0.6, RWA: 0.5, BDI: 0.65, UGA: 0.45,
  TZA: 0.5, KEN: 0.25, NGA: 0.3, GHA: 0.2, CMR: 0.5, CIV: 0.5, MDG: 0.5, MOZ: 0.5, MWI: 0.3, ZMB: 0.3, ZWE: 0.15, ZAF: 0.12, ETH: 0.02 };
const ORTH = new Set(['RUS', 'UKR', 'GRC', 'ROU', 'SRB', 'BGR', 'GEO', 'ARM', 'BLR', 'MDA', 'ETH', 'CYP', 'MKD', 'MNE', 'EGY']);
const VOC = () => ({
  cath: { tr: 6, t: ["chủng sinh", "linh mục"], st: ["cha xứ", "giám mục", "hồng y"], go: "Vào chủng viện", start: "Bạn vào chủng viện. Mỗi ngày bắt đầu bằng thánh lễ lúc sáng sớm.", done: "Bạn được truyền chức linh mục. Cả gia đình đều đến dự thánh lễ đầu tiên của bạn.", place: "nhà thờ giáo xứ", who: "cha xứ" },
  nun: { tr: 4, t: ["nữ tu tập sinh", "nữ tu"], st: ["mẹ bề trên"], go: "Vào tu viện", start: "Bạn vào tu viện. Ngày ngày trôi qua trong tĩnh lặng, cầu nguyện và lao động.", done: "Bạn khấn trọn đời và trở thành nữ tu.", place: "nhà thờ giáo xứ", who: "một nữ tu" },
  orth: { tr: 4, t: ["chủng sinh", "linh mục"], st: ["tổng linh mục", "giám mục"], go: "Vào chủng viện", start: "Bạn vào chủng viện và học từng bài thánh ca cổ.", done: "Bạn được truyền chức linh mục.", place: "nhà thờ", who: "vị linh mục" },
  prot: { tr: 3, t: ["chủng sinh", "mục sư"], st: ["mục sư quản nhiệm", "mục sư quản nhiệm một nhà thờ lớn"], go: "Vào chủng viện", start: "Bạn vào trường thần học. Cuối tuần, bạn dạy trẻ em ở một nhà thờ nhỏ.", done: "Bạn được phong chức mục sư.", place: "nhà thờ", who: "vị mục sư" },
  isl: { tr: 4, t: ["học viên trường madrasa", "imam"], st: ["imam của một nhà thờ Hồi giáo lớn", "nhà luật học Hồi giáo (mufti)"], go: "Vào trường thần học Hồi giáo", start: "Bạn vào trường thần học Hồi giáo, học thuộc Kinh Qur'an và học luật Hồi giáo.", done: "Học xong, bạn trở thành imam. Lần đầu tiên bạn dẫn lễ cầu nguyện ngày thứ Sáu.", place: "nhà thờ Hồi giáo", who: "vị imam" },
  bud: { tr: 4, t: ["người tu tập sự", "nhà sư"], st: ["sư trụ trì", "hòa thượng"], go: "Xuất gia", start: "Bạn cạo đầu xuất gia. Ba giờ sáng, tiếng mõ mở đầu một ngày mới.", done: "Bạn thọ giới và trở thành nhà sư.", place: "chùa", who: "một nhà sư" },
  hin: { tr: 3, t: ["tư tế đang tu tập", "tư tế đền Ấn Độ giáo"], st: ["trưởng tư tế của đền"], go: "Bắt đầu tu tập làm tư tế ở đền", start: "Bạn bắt đầu tu tập làm tư tế ở đền, học thuộc lòng kinh điển tiếng Phạn.", done: "Tu tập xong, bạn trở thành tư tế của đền.", place: "đền", who: "vị tư tế của đền" },
  jew: { tr: 5, t: ["học viên trường đào tạo rabbi", "rabbi"], st: ["rabbi trưởng của giáo đường"], go: "Vào trường đào tạo rabbi", start: "Bạn vào trường đào tạo rabbi để học Torah và Talmud.", done: "Bạn được phong chức rabbi (semikhah).", place: "giáo đường Do Thái", who: "vị rabbi" },
  sikh: { tr: 2, t: ["granthi đang tu tập", "granthi"], st: ["granthi trưởng của gurdwara"], go: "Bắt đầu tu tập ở gurdwara", start: "Bạn bắt đầu tu tập ở gurdwara, đọc kinh và phụ giúp ở langar (bếp ăn cộng đồng).", done: "Tu tập xong, bạn trở thành granthi của gurdwara.", place: "gurdwara", who: "vị granthi" },
});
const SECRET_FAITH = new Set(['PRK']);
const cnCR = () => S.cur === 'CHN' && typeof eraYr === 'function' && eraYr() != null && eraYr() >= 1966 && eraYr() <= 1978;
const faithHidden = () => (SECRET_FAITH.has(S.cur) && !S.flags.defSK) || cnCR();
const SW_T = { KOR: 0.56, ESP: 0.4, CAN: 0.38, NLD: 0.44, GBR: 0.35, SWE: 0.3, AUS: 0.3, FRA: 0.3, DEU: 0.28, USA: 0.28, JPN: 0.25, SGP: 0.25,
  ITA: 0.22, BRA: 0.21, ISR: 0.03, IND: 0.03, NGA: 0.04, THA: 0.03, LKA: 0.02, BGD: 0.01 };
const SW_R = { hi: 0.28, eca: 0.15, lac: 0.15, eap: 0.15, ssa: 0.06, sa: 0.03, mena: 0.02 };
const FAITH_K = { C: 1, B: 1, F: 0.8, O: 0.8, N: 0.45, M: 0.5, J: 0.3, H: 0.15, S: 0.2 };
const SW_K = 1.5;
const SW_C = { PHL: 0.01, HUN: 0.02, NGA: 0.02, GHA: 0.05, KEN: 0.05, POL: 0.05, LKA: 0.05, PER: 0.11, GRC: 0.13, BRA: 0.19, MEX: 0.19, ZAF: 0.19, ARG: 0.2,
  COL: 0.25, SGP: 0.25, ITA: 0.25, CHL: 0.25, USA: 0.27, CAN: 0.41, DEU: 0.41, ESP: 0.41, FRA: 0.41, GBR: 0.41, AUS: 0.41, SWE: 0.41, NLD: 0.47, KOR: 0.49 };
const SW_CR = { ssa: 0.05, sa: 0.05, mena: 0.02, lac: 0.19, hi: 0.35, eca: 0.1, eap: 0.1 };
const swT = c => S && S.rel === 'C' ? SW_C[c.id] ?? SW_CR[c.p] ?? 0.1 : SW_T[c.id] ?? SW_R[c.p] ?? 0.1;
const privOnly = () => S.rel === 'M' && relShare(C(), 'M') > 0.5;
const majRel = c => { let b = null, m = -1; c.rel.split(',').forEach(x => { if (+x.slice(1) > m) { m = +x.slice(1); b = x[0]; } }); return b; };
const relTo = r => r && REL[r] && !'NFO'.includes(r) ? r : null;
function swTo(c) {
  const r = S.rel;
  if (r === 'N') { const w = {}; c.rel.split(',').forEach(x => { if (relTo(x[0])) w[x[0]] = +x.slice(1); }); return Object.keys(w).length ? wpick(w) : null; }
  if (S.cur === 'KOR' && r === 'B' && chance(0.55)) return 'C';
  const m = relTo(majRel(c)); if (m && m !== r && chance(0.2)) return m;
  return 'N';
}
const faithLived = () => S.rel !== 'N' && ((S.hobbies || []).some(h => h.id === 'faith') || S.focus === 'faith' || (S.focusW && S.focusW.faith > 0.3) || (!!S.flags.voc && S.flags.voc.left == null));
const swHaz = c => (1 - Math.pow(1 - swT(c), 1 / 42)) * (FAITH_K[S.rel] ?? 0.8) * SW_K * (S.rel === 'C' ? SW_CK : 1) * (c.p === 'lac' && S.rel === 'C' && den() === 'cath' ? 1.8 : 1);
const SW_CK = 1;
function faithWhy(c) {
  const a = S.age, r = S.rel, P = S.fam.partner, g = (S.flags.grief || []).filter(x => a - x.at <= 2 && x.r !== 'fr');
  if (r === 'N') return friendsLeft() && chance(0.6) ? { why: 'invite', to: swTo(c) } : null;
  if (S.fam.married && P && P.alive && !P.divorced && !P.ss && relTo(P.rel) && P.rel !== r && P.rel !== 'M' && !privOnly()) return { why: 'pt', to: P.rel };
  if (g.length) return { why: 'loss', to: privOnly() ? null : (relTo(majRel(c)) !== r ? relTo(majRel(c)) : null) };
  if (S.mig && a - S.migY >= 10 && majRel(c) !== r) return { why: 'abroad', to: privOnly() ? null : relTo(majRel(c)) };
  if ((S.school === 'uni' || S.school === 'grad') && a <= 26) return { why: 'uni', to: null };
  return null;
}
function faithFam(from) {
  const f = S.fam, m = f.mom.alive, d = f.dad.alive && !f.dad.absent; if (!m && !d) return null;
  const p = B().p, bound = ['M', 'H', 'S', 'J'].includes(from);
  let lv = ['ssa', 'sa', 'mena'].includes(p) || bound ? 3 : ['lac', 'eap'].includes(p) ? 2 : 1; if (from === 'N') lv = Math.max(1, lv - 1);
  const cut = lv === 3 && chance(0.3), pw = parW(), far = typeof parAbroad === 'function' && parAbroad();
  S.flags.faithB = { p: cut ? 16 : [0, 4, 8, 12][lv], at: S.age, cut: cut ? 1 : 0 };
  const tog = typeof homeOthers === 'function' && (homeOthers().mom || homeOthers().dad);
  const told = S.rel === 'N' || !REL[S.rel] ? "Bạn nói với gia đình rằng mình đã buông bỏ đức tin." : L`가족에게 ${REL[S.rel]} 신앙을 받아들였다고 말했습니다.`;
  const r = faithFam0(cut, lv, tog, d, pw, far); return { t: told + ' ' + r.t, k: r.k };
}
function faithFam0(cut, lv, tog, d, pw, far) {
  if (cut) return { t: tog ? (d ? "Dù sống chung một nhà, suốt một thời gian bố không nói chuyện với bạn." : "Dù sống chung một nhà, suốt một thời gian mẹ không nói chuyện với bạn.") : d ? "Suốt một thời gian, bố không chịu nghe máy khi bạn gọi." : "Suốt một thời gian, mẹ không chịu nghe máy khi bạn gọi.", k: 'bad' };
  if (lv === 3) return { t: far ? L`${eun(pw)} 크게 반대했습니다. 전화할 때마다 그 이야기가 나왔습니다.` : tog ? L`${eun(pw)} 크게 반대했습니다. 밥상에 마주 앉을 때마다 그 이야기가 나왔습니다.` : L`${eun(pw)} 크게 반대했습니다. 집에 갈 때마다 그 이야기가 나왔습니다.`, k: 'bad' };
  if (lv === 2) return { t: tog ? L`${eun(pw)} 한동안 말이 없었습니다. 한집에 살면서도 명절 상 앞에서 서로 말을 아꼈습니다.` : far ? L`${eun(pw)} 한동안 말이 없었습니다. 명절에 거는 전화가 예전보다 짧아졌습니다.` : L`${eun(pw)} 한동안 말이 없었습니다. 명절에 집에 가는 길이 예전보다 멀게 느껴졌습니다.`, k: 'ev' };
  return { t: L`${eun(pw)} 서운해했지만 내 선택을 존중해 주었습니다.`, k: 'ev' };
}
const cardFree = () => { if (S.pending || S.queue.some(e => e.type === 'dec')) return false; for (let i = S.log.length - 1; i >= 0 && S.log[i].a === S.age; i--) if (S.log[i].kind === 'dec') return false; return true; };
const faithBNow = () => { const F = S.flags.faithB; return !F ? 0 : F.cut ? F.p : F.p * Math.pow(0.5, (S.age - F.at) / 8); };
function faithMove(to) {
  const from = S.rel; S.flags.conv = { from, at: S.age }; S.rel = to; S.flags.lapsed = null;
  casteConv(to);
  if (to === 'N' && S.hobbies) S.hobbies = S.hobbies.filter(h => h.id !== 'faith');
  const P = S.fam.partner; if (S.fam.married && P && P.alive && !P.divorced && P.rel && P.rel === from && to !== from) P.bd = (P.bd || 0) - 3;
  return faithFam(from);
}
const worshipAt = r => r === 'C' ? (den() === 'cath' ? "nhà thờ giáo xứ" : "nhà thờ") : ({ M: "nhà thờ Hồi giáo", H: "đền", B: "chùa", J: "giáo đường Do Thái", S: "gurdwara" })[r] || "sinh hoạt tôn giáo";
function funRel() {
  const cv = S.flags.conv, P = S.fam.partner;
  if (!cv || !REL[cv.from] || cv.from === S.rel || S.rel !== 'N' && P && P.alive && !P.divorced && P.rel === S.rel) return S.rel;
  return (S.deathAt ? S.deathAt.age : S.age) - cv.at >= 10 ? S.rel : cv.from === 'N' ? S.rel : cv.from;
}
const FAITH_FACT = () => "Trong một khảo sát ở 36 nước, tỷ lệ người trưởng thành đã rời bỏ tôn giáo mình theo từ nhỏ là 50% ở Hàn Quốc, 40% ở Tây Ban Nha, 28% ở Mỹ, và dưới 5% ở Ấn Độ, Israel, Nigeria và Thái Lan. Phần lớn những người rời đi sống không theo tôn giáo nào (Pew Research Center 2025)";
const FAITH_FACT_PRIV = () => "Năm 2019, 22 nước trên thế giới có luật trừng phạt việc rời bỏ tôn giáo (bội giáo) (Pew Research Center 2022)";
function faithYear(a) {
  const F = S.flags.faithB, f = S.fam;
  if (F && F.cut && a - F.at >= 2 && (f.mom.alive || (f.dad.alive && !f.dad.absent)) && chance(0.22)) {
    F.cut = 0; F.p = 8; F.at = a; eff({ h: 4, so: 3 });
    logA('phone', L`${iga(parW())} 먼저 연락을 해 왔습니다. 신앙 이야기는 꺼내지 않았지만, 예전처럼 함께 웃었습니다.`, 'warm'); return;
  }
  if (S.flags.privFaith != null && S.rel === 'M') {
    if (S.mig && relShare(C(), 'M') < 0.5 && a - S.migY >= 5 && !S.flags.faithOpenQ && chance(0.15)) { S.flags.faithOpenQ = a; queue(Math.min(0.97, S.t + 0.05), 'dec', 'faithopen', {}); return; }
    if (relShare(C(), 'M') > 0.5 && a - S.flags.privFaith >= 2 && (S.flags.pfL || 0) < 2 && chance(0.06)) { S.flags.pfL = (S.flags.pfL || 0) + 1; log("Đến tháng Ramadan, bạn vẫn nhịn ăn cùng gia đình. Lòng bạn không còn như trước, nhưng bữa tối cả nhà cùng dọn lúc hoàng hôn vẫn thật ấm áp.", 'ev'); }
  }
}
function vocKind() {
  const r = S.rel, F = S.sex === 'F', c = B();
  if (r === 'C') {
    const t = den() === 'angl' ? 'prot' : den();
    return F ? (t === 'prot' ? 'prot' : 'nun') : t;
  }
  if (r === 'M') return F ? null : 'isl';
  if (r === 'B') return 'bud';
  if (r === 'H') return F ? null : 'hin';
  if (r === 'J') return F && c.ppp < 30000 ? null : 'jew';
  if (r === 'S') return 'sikh';
  return null;
}
const ANGL = { GBR: 0.45, AUS: 0.3, NZL: 0.35, NGA: 0.2, UGA: 0.35, KEN: 0.2, ZAF: 0.08, CAN: 0.12, IRL: 0.05, USA: 0.02 };
function den() {
  if (!S || (S.rel !== 'C' && !(S.flags.conv && S.flags.conv.from === 'C'))) return null;
  if (S.flags.den) return S.flags.den;
  if (ORTH.has(S.born)) return 'orth';
  const h = hashStr(nmSeed() + S.born), p = CATH[S.born] ?? ({ lac: 80, eca: 50, hi: 45, ssa: 40, eap: 30, sa: 35, mena: 40 }[B().p] / 100 || 0.4);
  if (h % 100 < p * 100) return 'cath';
  return ANGL[S.born] && Math.floor(h / 100) % 100 < ANGL[S.born] * 100 ? 'angl' : 'prot';
}
const relName = () => S.rel === 'C' ? ({ cath: "Công giáo", prot: "Tin Lành", orth: "Chính thống giáo", angl: "Anh giáo" })[den()] : REL[S.rel];
const vocCelib = k => k === 'cath' || k === 'nun' || (k === 'bud' && S.born !== 'JPN');
const inCalling = () => !!S.flags.voc && S.flags.voc.left == null && (S.job === 'clergy' || (S.job === 'retired' && S.flags.lastJob === 'clergy'));
const vowedHome = () => inCalling() && vocCelib(S.flags.voc.k);
const vowedPlace = () => { const v = S.flags.voc; return v.k === 'nun' ? "tu viện" : v.k === 'bud' ? "chùa" : v.ord == null ? "chủng viện" : "nhà xứ"; };
function vowedLeave() { if (S.pet && !S.pet.par) S.pet.par = 1; if (!withParents()) return; S.flags.left = S.age; S.flags.stayHome = 0; if (S.flags.la == null) S.flags.la = S.age; S.flags.careHome = null; }
const VOC_K = 0.0022;
function vocOK(a) {
  if (a < 17 || a > 44 || S.flags.voc != null || (S.done.vocation || 0) >= 2 || (S.flags.last_vocation != null && a - S.flags.last_vocation < 6)) return false;
  if (S.school || inOffice() || S.job === 'prison' || S.retired || S.serveLeft > 0 || studyAway() || S.refugee || S.flags.hideCN || S.job === 'idol' || faithHidden() || S.flags.lapsed != null || S.flags.privFaith != null) return false;
  const k = vocKind(); return !!k && !(vocCelib(k) && S.fam.married);
}
function vocP(c) {
  const fh = S.hobbies.find(h => h.id === 'faith');
  return VOC_K * (S.age >= 35 ? 0.5 : 1) * (fh ? (fh.lv >= 2 ? 6 : 3) : 0.25) * ((S.focusW && S.focusW.faith) > 0.3 ? 2.5 : 1) * (c.p === 'hi' ? 0.5 : 1) * (S.major === 'hum' ? 1.5 : 1) * vocCasteK();
}
const VOC_CASTE = { gen: 2.5, khas: 2.5, obc: 0.15, jana: 0.15, madh: 0.15, st: 0.05, sc: 0.02, dalit: 0.02 };
const vocCasteK = () => S.rel === 'H' && S.caste && VOC_CASTE[S.caste.g] != null ? VOC_CASTE[S.caste.g] : 1;
function clergyTitle() {
  const v = S.flags.voc, V = v && VOC()[v.k]; if (!V) return "chức sắc tôn giáo";
  if (v.pope) return L`교황 ${v.pope}`;
  const r = rankOf('clergy'); if (r && V.st[r - 1]) return V.st[r - 1];
  return v.ord != null ? V.t[1] : V.t[0];
}
const clergyOld = () => { const v = S.flags.voc; return !!v && v.ord != null && v.left == null && !!VOC()[v.k] && (S.job === 'clergy' || S.flags.lastJob === 'clergy'); };
function clergyEmer() {
  const v = S.flags.voc, V = VOC()[v.k], r = rankOf('clergy');
  if (v.k === 'cath') return r >= 3 ? V.st[2] : r === 2 ? "Giám mục hưu trí" : "Linh mục hưu trí";
  return v.k === 'nun' || v.k === 'bud' ? V.t[1] : L`원로 ${V.t[1]}`;
}
function clergyRetLine() {
  const v = S.flags.voc, V = VOC()[v.k];
  if (v.k === 'cath') return "Bạn đệ đơn từ nhiệm và rời khỏi chức vụ. Là linh mục hưu trí, bạn vẫn dâng thánh lễ và gặp gỡ mọi người khi sức còn cho phép.";
  if (v.k === 'nun') return "Bạn trao lại bổn phận của mình và sống trong cộng đoàn tu viện, ngày ngày cầu nguyện.";
  if (v.k === 'bud') return "Bạn trao lại trách nhiệm của mình. Bạn ở lại chùa và tiếp tục tu hành.";
  return L`맡은 자리를 후임에게 넘기고 원로가 되었습니다. 힘이 닿는 만큼 ${V.place}에 나가 사람들 곁을 지킵니다.`;
}
const clergyLadder = () => { const v = S && S.flags.voc, V = v && VOC()[v.k]; return V ? V.st.map(n => ST(n, 'p')) : null; };
function clergyStepP(k, r, a, yrs) {
  if (r === 0) return yrs >= 5 ? 0.07 : 0;
  if (r === 1) return a < 40 ? 0 : ({ cath: 0.0006, orth: 0.002, prot: 0.004, isl: 0.003, bud: 0.004 })[k] || 0;
  if (r === 2) return k === 'cath' && a >= 55 && a < 80 ? 0.003 : 0;
  return 0;
}
const CONCLAVE_Y = [1958, 1963, 1978, 2005, 2013, 2025];
const PAPAL = () => ["Lêô XV", "Gioan Phaolô III", "Bênêđictô XVII", "Phanxicô II", "Gioan XXIV", "Phaolô VII", "Piô XIII", "Grêgôriô XVII", "Innôcentê XIV", "Clêmentê XV"];
function clergyYear(a) {
  const v = S.flags.voc; if (!v) return;
  if (S.job !== 'clergy') { if (v.left == null && isWorking() && !S.retired) { v.left = a; S.flags.celib = 0; if (S.flags.lastJob === 'clergy' || S.job === 'owner') log("Bạn rời bỏ con đường tu hành và trở về với đời thường."); } return; }
  const V = VOC()[v.k]; if (!V) return;
  if (vowedHome()) vowedLeave();
  if (v.ord == null) {
    if (S.jobY >= 1 && chance(v.k === 'cath' ? 0.1 : 0.07)) {
      v.left = a; S.flags.lastJob = 'clergy'; S.job = 'seeking'; S.flags.seekY = 0; S.flags.celib = 0; eff({ h: -3 });
      log("Bạn không theo hết quá trình tu tập và trở về đời thường. Những năm tháng ấy còn đọng lại trong lòng bạn rất lâu."); return;
    }
    if (S.jobY >= v.tr) { v.ord = a; S.pct = clamp(S.pct + 0.06, 0, 0.99); eff({ h: 8, so: 4 }); S.yearMark = 'job'; log(V.done, 'big'); }
    return;
  }
  if (v.pope) {
    if (!v.trip && a > v.popeAt) { v.trip = a; eff({ h: 4, so: 2 }); log(L`교황으로서 처음 해외 사목 방문을 떠났습니다. 공항에 나온 사람들 사이로 ${B().ko} 국기를 든 사람들도 보였습니다.`, 'ms'); }
    return;
  }
  if (v.k === 'cath' && rankOf('clergy') === 3 && a >= 60 && a < 80) {
    const yr = calYr(), cv = yr <= 2025 ? CONCLAVE_Y.includes(yr) : (S.flags.conclaveY !== yr && chance(1 / 12));
    if (cv) {
      S.flags.conclaveY = yr;
      if (chance((1 / 115) * (S.st.so >= 70 ? 1.5 : 1) * (S.st.sm >= 70 ? 1.3 : 1))) {
        const nm = pick(PAPAL()); v.pope = nm; v.popeAt = a; S.flags.pope = nm; eff({ h: 15, so: 10 }); S.yearMark = 'star';
        log(L`콘클라베의 굴뚝에서 흰 연기가 피어올랐습니다. 추기경들의 표가 모였고, 나는 교황 ${nm}가 되었습니다. 성 베드로 광장을 가득 메운 사람들 앞에서 처음으로 강복을 했습니다.`, 'big', "Giáo hoàng do khoảng 120 hồng y dưới 80 tuổi bầu chọn trong mật nghị, với ít nhất hai phần ba số phiếu. Đến nay đã có hơn 260 vị giáo hoàng (Tòa Thánh)", 'pope');
        eggGot('pope');
      } else log("Bạn vào mật nghị để bầu giáo hoàng mới. Cửa Nhà nguyện Sistine khép lại, và vài ngày sau khói trắng bốc lên.", 'ev');
    }
  }
}
const EGG_H = { nobel: 2.5e-5, fields: 2.7e-3, turing: 3.2e-4, oscar: 6.4e-5, grammy: 1.05e-5, comet: 2.3e-7, dino: 1.5e-7, species: 1.3e-7, relic: 4.2e-7, meteor: 1.3e-8, rescue: 3.4e-7, named: 1.5e-4 };
const EGG_ORDER = ['rescue', 'nobel', 'fields', 'turing', 'oscar', 'grammy', 'comet', 'dino', 'species', 'relic', 'meteor', 'named'];
const eggHad = id => !!(S.flags.egg && S.flags.egg[id] != null);
function eggGot(id) { (S.flags.egg || (S.flags.egg = {}))[id] = S.age; S.yearMark = 'star'; }
const eggYrs = id => (S.exp && S.exp[id] && S.exp[id][0]) || 0;
const hobAt = (id, lv) => S.hobbies.some(h => h.id === id && h.lv >= lv);
const HOB_MAX = 3;
const hobDrop = () => !S.hobbies || S.hobbies.length < HOB_MAX ? null : S.hobbies.reduce((m, h) => !m || h.lv < m.lv || (h.lv === m.lv && h.since <= m.since) ? h : m, null);
function hobAdd(h) { const d = hobDrop(); S.hobbies.unshift(h); if (d) S.hobbies.splice(S.hobbies.indexOf(d), 1); while (S.hobbies.length > HOB_MAX) S.hobbies.pop(); return d; }
const hobDropLine = () => { const d = hobDrop(); return d ? L`취미는 세 개까지라, 새로 시작하면 ${eun(hobbyName(d.id))} 그만둡니다.` : ''; };
const eggRes = n => S.flags.dr != null && eggYrs('prof') >= n && (S.job === 'prof' || S.retired);
const EGG_FARM = ['farm', 'farmhand', 'herder', 'agbiz'], EGG_DIG = ['farm', 'farmhand', 'herder', 'agbiz', 'construct', 'miner', 'fisher'];
const NOBEL_PM = { USA: 0.95, GBR: 1.5, DEU: 0.8, FRA: 0.65, JPN: 0.25, SWE: 1.9, CHE: 2.7, RUS: 0.12, CAN: 0.7, NLD: 0.7, ITA: 0.2, ISR: 1.4, AUS: 0.5, AUT: 1.4,
  NOR: 1.6, DNK: 1.3, BEL: 0.6, FIN: 0.5, POL: 0.15, HUN: 0.3, CZE: 0.15, ESP: 0.05, IRL: 0.3, NZL: 0.3, KOR: 0.02, TWN: 0.05, SGP: 0.05, CHN: 0.004, IND: 0.002 };
const nobelPM = c => NOBEL_PM[c.id] ?? (c.p === 'hi' ? 0.2 : c.p === 'eca' ? 0.06 : 0.003);
const NOBEL_F = { med: [['med', 1]], sci: [['phys', 0.5], ['chem', 0.5]], eng: [['phys', 0.3], ['chem', 0.2]], biz: [['econ', 0.6]], soc: [['econ', 0.6]], hum: [['lit', 0.15]], agr: [['chem', 0.2], ['med', 0.1]] };
const NOBEL_N = () => ({ phys: "Vật lý", chem: "Hóa học", med: "Sinh lý học hoặc Y học", econ: "Kinh tế học", lit: "Văn học", peace: "Hòa bình" });
const nobelW = () => (NOBEL_F[S.major] || []).reduce((t, f) => t + f[1], 0);
const NOBEL_PEACE = 2e-4;
const fieldsPM = c => nobelPM(c) / 9 * (({ FRA: 3, RUS: 2, ISR: 1.5, GBR: 1.3 })[c.id] || 1);
const turingPM = c => nobelPM(c) * 1.3 / 9 * (({ USA: 1.6, CAN: 1.2, ISR: 1.5, GBR: 1 })[c.id] || 0.4);
const OSCAR_PM = { USA: 0.54, GBR: 0.5, IRL: 0.5, AUS: 0.5, NZL: 0.5, CAN: 0.3 };
const oscarPM = c => OSCAR_PM[c.id] ?? (c.p === 'hi' ? 0.02 : 0.002);
const GRAMMY_PM = { USA: 16, GBR: 4, CAN: 4, IRL: 4, AUS: 3, NZL: 3, JAM: 4, NGA: 0.3, ZAF: 0.3, MLI: 0.3, BEN: 0.3, SEN: 0.3, IND: 0.1 };
const latinG = c => (c.p === 'lac' && !['JAM', 'HTI', 'TTO', 'GUY', 'BLZ', 'BRB', 'BHS', 'SUR'].includes(c.id)) || ['ESP', 'PRT'].includes(c.id);
const grammyPM = c => GRAMMY_PM[c.id] ?? (latinG(c) ? 5.5 : 0.1);
const cometPM = c => c.id === 'JPN' ? 1 : c.p === 'hi' ? 0.25 : c.p === 'eca' ? 0.1 : 0.005;
const DINO_PM = { MNG: 11, PRT: 2.9, ARG: 2.2, CAN: 1.4, ESP: 1.3, AUS: 1.3, GBR: 0.56, USA: 0.5, THA: 0.4, JPN: 0.39, FRA: 0.35, CHL: 0.3, URY: 0.3, KOR: 0.3,
  ZAF: 0.24, BRA: 0.23, CHN: 0.22, KAZ: 0.2, UZB: 0.2, MAR: 0.2, DEU: 0.15, NER: 0.13, ITA: 0.1, MDG: 0.1, EGY: 0.06, TZA: 0.05, IND: 0.01 };
const dinoPM = c => DINO_PM[c.id] ?? 0.02;
const BIODIV = new Set(['BRA', 'COL', 'PER', 'ECU', 'BOL', 'VEN', 'MEX', 'CRI', 'PAN', 'GTM', 'HND', 'NIC', 'IDN', 'PNG', 'PHL', 'MYS', 'VNM', 'LAO', 'KHM', 'MMR', 'THA',
  'MDG', 'CMR', 'COD', 'COG', 'GAB', 'TZA', 'KEN', 'UGA', 'RWA', 'ETH', 'ZAF', 'AUS', 'LKA', 'IND', 'CHN', 'NPL']);
const speciesPM = c => BIODIV.has(c.id) ? 30 : c.p === 'hi' ? 20 : 6;
const RELIC_PM = { GBR: 57, IRL: 40, ITA: 40, GRC: 40, EGY: 12, TUR: 30, IRQ: 12, SYR: 12, JOR: 15, ISR: 40, IRN: 10, MEX: 15, PER: 15, CHN: 8, IND: 3 };
const relicPM = c => RELIC_PM[c.id] ?? (c.p === 'hi' ? 30 : 2);
const EGG_PEOPLE = { carnegie: new Set(['USA', 'CAN']), carnegieEU: new Set(['GBR', 'IRL', 'FRA', 'DEU', 'NOR', 'NLD', 'CHE', 'BEL', 'ITA', 'SWE', 'DNK']) };
const EGG_SERVE = ['teacher', 'doctor', 'nurse', 'social', 'childcare', 'clergy', 'healthtech'];
const EGGS = {
  nobel: {
    p: (a, c) => {
      if (S.flags.leaderTitle && a >= 35) return NOBEL_PEACE;
      if (a < 38 || a > 92 || !eggRes(8)) return 0;
      const w = nobelW(); return w ? EGG_H.nobel * w * nobelPM(c) * (rankOf('prof') >= 2 ? 1.5 : 1) : 0;
    },
    go: (a, c) => {
      const peace = !!S.flags.leaderTitle, F = NOBEL_F[S.major] || [['peace', 1]];
      let k = 'peace'; if (!peace) { let u = rnd() * F.reduce((t, f) => t + f[1], 0); for (const [f, w] of F) { u -= w; if (u <= 0) { k = f; break; } } }
      S.flags.nobelF = k; const n = NOBEL_N()[k], x = incomeAt(c, 0.5) * 8;
      S.money += x; book("Tiền thưởng giải Nobel", x); eff({ h: 15, so: 6 }); S.pct = Math.max(S.pct, 0.99);
      if (k === 'peace') log("Tin báo về từ Oslo: bạn được chọn nhận giải Nobel Hòa bình. Những gương mặt hiện lên đầu tiên trong tâm trí là của những người đã cùng bạn nỗ lực.", 'big', "Giải Nobel Hòa bình do Ủy ban Nobel Na Uy trao tại Oslo. Từ năm 1950, hơn hai mươi nhà lãnh đạo quốc gia đương nhiệm hoặc đã mãn nhiệm từng nhận giải (Quỹ Nobel)", 'nobel');
      else if (k === 'lit') log("Một cuộc gọi đến từ Stockholm. Chỉ vài phút trước khi công bố, bạn được báo tin mình được chọn nhận giải Nobel Văn học. Bạn nhớ đến người từng đọc những trang viết đầu tiên của mình.", 'big', "Từ năm 1901 đến nay, khoảng 1.000 người đã nhận giải Nobel. Giải thường chỉ đến khi công trình đã ra đời hơn 20 năm (Quỹ Nobel)", 'nobel');
      else log(L`스톡홀름에서 전화가 걸려 왔습니다. 발표를 몇 분 앞두고, 노벨 ${n} 수상자로 뽑혔다는 소식이었습니다. 수십 년 전 연구실에서 밤을 새우던 날들이 떠올랐습니다.`, 'big', "Từ năm 1901 đến nay, khoảng 1.000 người đã nhận giải Nobel. Giải thường chỉ đến khi công trình đã ra đời hơn 20 năm (Quỹ Nobel)", 'nobel');
    },
  },
  fields: {
    p: (a, c) => a >= 28 && a < 40 && S.major === 'sci' && S.flags.dr != null && S.job === 'prof' && eggYrs('prof') >= 1 && calYr() % 4 === 2 ? EGG_H.fields * fieldsPM(c) : 0,
    go: () => { eff({ h: 14, so: 4 }); S.pct = Math.max(S.pct, 0.97);
      log("Tên bạn được xướng lên tại lễ khai mạc Đại hội Toán học Quốc tế. Đó là Huy chương Fields, giải thưởng bốn năm một lần dành cho các nhà toán học dưới bốn mươi tuổi.", 'big', "Huy chương Fields được trao bốn năm một lần cho 2-4 nhà toán học dưới 40 tuổi. Từ năm 1936 đến năm 2022 có 64 người nhận (Liên đoàn Toán học Quốc tế)", 'fields'); },
  },
  turing: {
    p: (a, c) => a >= 40 && a <= 92 && S.major === 'cs' && calYr() >= 1966 && eggRes(10) ? EGG_H.turing * turingPM(c) : 0,
    go: (a, c) => { eff({ h: 14, so: 4 }); S.pct = Math.max(S.pct, 0.99);
      if (calYr() >= 2014) { const x = incomeAt(c, 0.5) * 6; S.money += x; book("Tiền thưởng giải Turing", x); }
      log("Bạn nhận tin mình được chọn nhận giải Turing, giải thưởng thường được gọi là Nobel của ngành khoa học máy tính. Bạn nhớ lại cái đêm chương trình đầu tiên mình viết chạy được.", 'big', "Hiệp hội Máy tính Mỹ (ACM) trao giải Turing hằng năm từ năm 1966. Đến nay đã có hơn 70 người nhận (ACM)", 'turing'); },
  },
  oscar: {
    p: (a, c) => S.job === 'actor' && a >= 22 && a <= 85 && eggYrs('actor') >= 3 && calYr() >= 1929 ? EGG_H.oscar * (S.flags.actStar ? 12 : 1) * oscarPM(c) : 0,
    go: () => { eff({ h: 15, so: 5 }); S.pct = Math.max(S.pct, 0.995); S.flags.oscarW = 1;
      log("Tên bạn được xướng lên tại lễ trao giải Oscar. Đôi tay run run cầm lấy tượng vàng, điều đầu tiên bạn nói trên sân khấu là tên những người trong gia đình.", 'big', "Mỗi năm có bốn giải Oscar cho diễn xuất. Từ năm 1929 đến nay, hơn 300 người từng nhận giải diễn xuất (Viện Hàn lâm Khoa học và Nghệ thuật Điện ảnh Mỹ)", 'oscar'); },
  },
  grammy: {
    p: (a, c) => {
      if (a < 18 || a > 80 || calYr() < (latinG(c) ? 2000 : 1959)) return 0;
      const w = S.job === 'musician' && eggYrs('musician') >= 2 ? (S.flags.musStar ? 8 : 1) : S.job === 'idol' && S.idol && S.idol.hit === 2 ? 3 : 0;
      return w ? EGG_H.grammy * w * grammyPM(c) : 0;
    },
    go: (a, c) => { eff({ h: 12, so: 4 }); S.pct = Math.max(S.pct, 0.99); S.flags.grammyL = latinG(c) ? 1 : 0;
      if (latinG(c)) log("Tên bạn được xướng lên tại lễ trao giải Grammy Latin. Bạn nhớ lại đôi tay run rẩy trong lần đầu tiên đứng trên sân khấu.", 'big', "Giải Grammy Latin được trao cho âm nhạc tiếng Tây Ban Nha và tiếng Bồ Đào Nha từ năm 2000 (Viện Hàn lâm Thu âm Latin)", 'grammy');
      else log("Tên bạn được xướng lên tại lễ trao giải Grammy. Bạn nhớ lại đôi tay run rẩy trong lần đầu tiên đứng trên sân khấu.", 'big', "Viện Hàn lâm Thu âm Mỹ trao giải Grammy hằng năm từ năm 1959, ở khoảng 90 hạng mục", 'grammy'); },
  },
  comet: {
    p: (a, c) => {
      if (a < 16 || a > 85) return 0;
      const w = hobAt('photo', 3) ? (S.urban ? 1 : 1.5) : eggRes(3) && S.major === 'sci' ? 0.5 : 0;
      return w ? EGG_H.comet * w * cometPM(c) * (calYr() < 2000 ? 3 : 1) : 0;
    },
    go: () => { eff({ h: 8, sm: 2 }); const yr = calYr();
      if (yr >= 1980 && yr <= 2015 && chance(0.5)) log("Trong một bức ảnh chụp qua kính thiên văn, bạn tìm thấy một chấm nhỏ đang chậm rãi di chuyển giữa các vì sao. Đó là một tiểu hành tinh mới. Người phát hiện được quyền đặt tên, nên bạn đặt cho nó tên của mẹ mình.", 'big', "Người phát hiện tiểu hành tinh đề xuất tên, và Liên đoàn Thiên văn Quốc tế quyết định. Đã có hơn 25.000 tiểu hành tinh được đặt tên", 'comet');
      else log(L`밤하늘 사진 속에서 별자리 지도에 없는 희미한 빛을 찾았습니다. 며칠 뒤 새 혜성으로 확인되었고, 혜성에는 발견한 사람의 성이 붙었습니다. 이제 하늘에는 '${S.name.base} 혜성'이 있습니다.`, 'big', "Sao chổi mới được đặt theo tên người phát hiện. Ngày nay phần lớn do các kính thiên văn quan sát lớn tìm ra, nhưng đôi khi người nghiệp dư vẫn phát hiện được, như sao chổi Nishimura năm 2023 (Liên đoàn Thiên văn Quốc tế)", 'comet'); },
  },
  dino: {
    p: (a, c) => {
      if (a < 6) return 0;
      const w = Math.max(EGG_FARM.includes(S.job) || ['construct', 'miner'].includes(S.job) ? 1 : 0, hobAt('hiking', 2) ? 1 : 0, a <= 15 && !S.urban ? 0.5 : 0);
      return w ? EGG_H.dino * w * dinoPM(c) : 0;
    },
    go: (a) => { eff({ h: 7, so: 3 });
      const t = a <= 15 && !S.urban && !EGG_FARM.includes(S.job) ? "Đang chơi bên bờ suối với lũ trẻ trong xóm, bạn tìm thấy một khúc xương to lạ thường nằm kẹt trong đá." : S.job === 'herder' ? "Đang lùa gia súc, bạn tìm thấy một khúc xương lớn lộ ra khỏi lớp đất trên sườn đồi bị mưa làm sạt lở."
        : EGG_FARM.includes(S.job) ? "Đang cày ruộng, bạn thấy một khúc xương lớn mắc vào lưỡi cày." : ['construct', 'miner'].includes(S.job) ? "Đang đào đất, bạn tìm thấy một khúc xương lớn nằm trong đá." : "Đang đi đường núi, bạn tìm thấy một khúc xương lớn nằm trong đá ở một sườn dốc bị sạt.";
      log(t + ' ' + "Các nhà khoa học đến và đào suốt mấy năm, rồi công bố đó là một loài khủng long mới. Tên khoa học của loài khủng long ấy mang tên bạn, người đầu tiên tìm ra nó.", 'big', "Mỗi năm có hàng chục loài khủng long mới được công bố. Đôi khi người tìm ra đầu tiên là một nông dân, một người chăn gia súc hay một đứa trẻ (năm 2010, loài Patagotitan ở Argentina được một người làm công ở trang trại tìm thấy)", 'dino'); },
  },
  species: {
    p: (a, c) => {
      if (a < 16) return 0;
      const w = Math.max(eggRes(5) && ['sci', 'agr'].includes(S.major) ? 30 : eggRes(5) && S.major === 'med' ? 5 : 0, hobAt('hiking', 3) || hobAt('garden', 3) ? 1 : 0, BIODIV.has(c.id) && [...EGG_FARM, 'fisher'].includes(S.job) ? 0.3 : 0);
      return w ? EGG_H.species * w * speciesPM(c) : 0;
    },
    go: (a, c) => { eff({ h: 6, so: 2 });
      const T = ({ lac: ["ếch", "lan", "bọ cánh cứng"], eap: ["lan", "tắc kè", "nhện"], ssa: ["ếch cây", "Nabi", "lan"], sa: ["ếch", "bọ cánh cứng", "lan"], mena: ["bọ cánh cứng", "bọ cạp"] })[c.p] || ["nhện", "bọ cánh cứng", "rêu"], t = pick(T);
      const res = eggRes(5) && ['sci', 'agr', 'med'].includes(S.major);
      log(res ? L`함께 연구해 온 학자가 새로 기록한 ${t}의 학명에 내 이름을 붙였습니다. 학명 끝에 내 성이 라틴어로 달렸습니다.`
        : hobAt('hiking', 3) || hobAt('garden', 3) ? L`산과 들을 다니며 찍어 둔 ${t} 사진을 학자에게 보냈습니다. 몇 해 뒤 새로운 종으로 발표되었고, 학명에 내 이름이 들어갔습니다.`
        : L`마을 숲을 안내하다 학자들에게 처음 보는 ${eul(t)} 보여 주었습니다. 몇 해 뒤 새로운 종으로 발표되었고, 학명에 내 이름이 들어갔습니다.`, 'big',
        "Mỗi năm có hơn 15.000 loài sinh vật mới được đặt tên, và không ít loài mang tên người. Cứ năm tên khoa học của nhện thì có một tên dùng để vinh danh một người (BioScience 2025)", 'species'); },
  },
  relic: {
    p: (a, c) => {
      if (a < 14) return 0;
      const w = EGG_DIG.includes(S.job) ? 1 : hobAt('garden', 2) ? 0.3 : 0;
      return w ? EGG_H.relic * w * relicPM(c) : 0;
    },
    go: (a, c) => {
      const x = incomeAt(c, 0.5) * (0.1 + rnd() * 0.5); S.money += x; book("Tiền thưởng khai báo cổ vật", x); eff({ h: 5, so: 2 });
      const t = S.job === 'fisher' ? "Một món đồ gốm cổ mắc vào lưới được kéo lên." : S.job === 'herder' ? "Đang lùa gia súc, bạn tìm thấy một mảnh đồ đồng cổ trên sườn đồi bị sạt." : ['construct', 'miner'].includes(S.job) ? "Đang đào đất ở công trường, bạn tìm thấy ngói và đồ gốm cổ."
        : EGG_FARM.includes(S.job) ? "Đang cày ruộng, bạn thấy một chiếc bát cổ mắc vào lưỡi cày." : "Đang vỡ đất trồng rau, bạn tìm thấy một xâu tiền xu cổ.";
      log(t + ' ' + "Bạn khai báo ngay, và các nhà khoa học nói rằng nó có từ vài trăm năm trước. Giờ nó nằm trong tủ trưng bày của bảo tàng, và tấm nhãn nhỏ ghi tên bạn là người tìm thấy.", 'big',
        c.id === 'KOR' ? "Ở Hàn Quốc, di sản văn hóa tìm thấy dưới lòng đất phải được khai báo trong vòng 7 ngày, và nếu thuộc về nhà nước thì người phát hiện được nhận tiền thưởng (Luật Di sản chôn giấu)" : c.id === 'GBR' ? "Ở Anh, mỗi năm có hơn 1.500 hiện vật quý được khai báo, và khi bảo tàng mua lại, người tìm thấy và chủ đất chia nhau số tiền đó (Museums Association 2026)" : "Ở nhiều nước, cổ vật tìm thấy dưới đất thuộc về nhà nước, và người khai báo được nhận tiền thưởng", 'relic');
    },
  },
  meteor: {
    p: (a, c) => {
      const w = !S.urban && a >= 8 ? (EGG_FARM.includes(S.job) ? 1.5 : 1) : 0;
      return w ? EGG_H.meteor * w : 0;
    },
    go: () => { eff({ h: 6, sm: 1 });
      log(EGG_FARM.includes(S.job) ? "Sau một đêm bầu trời lóe sáng, sáng hôm sau có một hòn đá cháy đen cắm giữa ruộng. Các nhà khoa học đến và nói đó là thiên thạch. Thiên thạch ấy được đặt theo tên làng bạn." : "Sau một đêm bầu trời lóe sáng, sáng hôm sau có một hòn đá cháy đen cắm ở sân sau nhà. Các nhà khoa học đến và nói đó là thiên thạch. Thiên thạch ấy được đặt theo tên làng bạn.", 'big',
        "Mỗi năm chỉ có khoảng mười thiên thạch được người ta chứng kiến lúc rơi và thu hồi được. Thiên thạch được đặt theo tên nơi nó rơi xuống (Meteoritical Society)", 'meteor'); },
  },
  rescue: {
    p: (a) => a >= 15 && a <= 75 && S.st.hl >= 35 && !(S.serveLeft > 0) && !S.refugee ? EGG_H.rescue * (S.sex === 'M' ? 1.8 : 0.2) * (hobAt('fishing', 1) ? 1.3 : 1) * (a <= 40 ? 1.2 : a > 60 ? 0.6 : 1) : 0,
    go: (a, c) => {
      const k = chance(0.55) ? 'w' : chance(0.55) ? 'f' : 'r';
      const t = k === 'w' ? "Thấy một đứa trẻ bị đuối nước, bạn lao xuống mà không kịp suy nghĩ." : k === 'f' ? "Nghe nói có người bị kẹt trong căn nhà hàng xóm đang cháy, bạn lao vào giữa làn khói." : "Thấy một người ngã gục trên đường ray, bạn chạy tới kéo họ ra.";
      const fact = c.id === 'KOR' ? "Hàn Quốc vinh danh những người hy sinh hoặc bị thương khi cứu người khác là “người nghĩa hiệp”; từ năm 1970 đến năm 2024 có 893 người được công nhận (Bộ Y tế và Phúc lợi Hàn Quốc)" : EGG_PEOPLE.carnegie.has(c.id) ? "Từ năm 1904, Quỹ Anh hùng Carnegie đã trao huy chương cho hơn 10.000 người dân từng cứu người khác; khoảng một phần tư trong số họ đã mất mạng khi cứu người"
        : c.id === 'JPN' ? "Nhật Bản trao Huy chương Dải băng đỏ cho những người cứu người mà không màng đến nguy hiểm của bản thân (Văn phòng Nội các)" : EGG_PEOPLE.carnegieEU.has(c.id) ? "Từ năm 1908, các Quỹ Anh hùng Carnegie được lập ở Anh và chín nước châu Âu, trao huy chương cho những người dân đã cứu người khác" : null;
      S.flags.rescueK = k;
      if (chance(0.25)) {
        log(t + ' ' + (k === 'w' ? "Đứa trẻ được cứu sống, nhưng bạn đã không thể trở lên khỏi mặt nước." : "Người ấy được cứu sống, nhưng bạn đã không thể trở về."), 'big', fact, 'rescue');
        die(k === 'w' ? 'drown' : k === 'f' ? 'fire' : 'inj', k === 'w' ? "Đuối nước (khi cứu người)" : k === 'f' ? "Hỏa hoạn (khi cứu người)" : "Tai nạn (khi cứu người)");
        return;
      }
      eff({ hl: -5, h: 8, so: 6 });
      const r = c.id === 'KOR' ? "Nhà nước công nhận bạn là người bị thương khi cứu người." : EGG_PEOPLE.carnegie.has(c.id) ? "Vài tháng sau, Huy chương Anh hùng Carnegie được gửi đến." : c.id === 'JPN' ? "Bạn được nhà nước trao Huy chương Dải băng đỏ." : EGG_PEOPLE.carnegieEU.has(c.id) ? "Quỹ Anh hùng Carnegie gửi đến bạn một tấm huy chương." : "Người trong xóm còn nhắc về ngày hôm ấy suốt nhiều năm.";
      log(t + ' ' + (k === 'w' ? "Bạn đã cứu sống đứa trẻ." : "Bạn đã cứu sống người ấy.") + ' ' + r, 'big', fact, 'rescue');
    },
  },
  named: {
    p: (a) => {
      if (a < 60 || !(S.retired || a >= 66)) return 0;
      const y = EGG_SERVE.reduce((t, id) => t + eggYrs(id), 0);
      return EGG_H.named * (y >= 25 ? 1 : S.flags.council ? 0.5 : 0);
    },
    go: () => { eff({ h: 7, so: 5 });
      const best = EGG_SERVE.reduce((b, id) => eggYrs(id) > eggYrs(b) ? id : b, 'teacher');
      log(EGG_SERVE.reduce((t, id) => t + eggYrs(id), 0) < 25 ? "Hội đồng thành phố quyết định lấy tên bạn đặt cho cây cầu mới bắc qua con suối trong vùng. Ngày khánh thành cầu, bạn đứng trên đó thật lâu."
        : best === 'teacher' || best === 'childcare' ? "Ngôi trường nơi bạn dạy trẻ suốt đời đã lấy tên bạn đặt cho thư viện mới xây. Ngày gắn biển tên, những học trò cũ đã tìm về."
        : best === 'clergy' || best === 'social' ? "Những người hàng xóm gắn bó với bạn bao năm đã lấy tên bạn đặt cho nhà văn hóa mới của khu phố. Bạn đứng trước tấm biển tên thật lâu."
        : "Bệnh viện nơi bạn làm việc bao năm đã lấy tên bạn đặt cho khu điều trị mới. Những bệnh nhân bạn từng chăm sóc đã đến chúc mừng.", 'big',
        "Nhiều nước có lệ lấy tên những người đã gắn bó phục vụ một nơi suốt nhiều năm để đặt cho trường học, bệnh viện, cây cầu và đường phố. Hàn Quốc có chế độ tên đường danh dự", 'named'); },
  },
};
function eggYear(a) {
  if (S.isComp || S.job === 'prison' || S.flags.hideCN || S.phase !== 'life') return;
  const c = C();
  for (const id of EGG_ORDER) {
    if (eggHad(id)) continue;
    const r = EGGS[id].p(a, c); if (!(r > 0)) continue;
    if (S.eggSum) S.eggSum[id] = (S.eggSum[id] || 0) + r;
    if (chance(r)) { eggGot(id); EGGS[id].go(a, c); return; }
  }
}
const PET_OWN = { hi: 0.45, eca: 0.45, lac: 0.5, eap: 0.25, mena: 0.12, sa: 0.08, ssa: 0.1 };
const PET_OWN_C = { USA: 0.66, AUS: 0.69, GBR: 0.57, BRA: 0.55, KOR: 0.28, JPN: 0.18, CHN: 0.2 };
const petOwn = c => PET_OWN_C[c.id] != null ? PET_OWN_C[c.id] : PET_OWN[c.p] || 0.2;
const PET_NAMES = { KOR: ["Bori", "Kongi", "Choco", "Dubu", "Happy", "Nabi"], JPN: ["Hana", "Momo", "Sora", "Mugi", "Kotaro"],
  _: ['Max', 'Luna', 'Bella', 'Coco', 'Lucky', 'Simba', 'Milo', 'Toby', 'Kitty', 'Charlie', 'Nala', 'Rocky'] };
const PET_SM = { hi: { f: 0.4, h: 0.25, b: 0.2, r: 0.15 }, eap: { f: 0.45, h: 0.2, b: 0.25, r: 0.1 }, sa: { b: 0.55, f: 0.3, r: 0.15 }, mena: { b: 0.55, f: 0.3, r: 0.15 },
  ssa: { b: 0.4, r: 0.4, f: 0.2 }, lac: { b: 0.35, f: 0.3, h: 0.2, r: 0.15 }, eca: { f: 0.35, h: 0.25, b: 0.25, r: 0.15 } };
const PET_LIFE = { d: [10, 15], c: [12, 18], h: [2, 3], r: [8, 12], b: [6, 12], f: [4, 9] };
const PET_COSTK = { d: 0.03, c: 0.02, h: 0.006, r: 0.01, b: 0.008, f: 0.008 };
const petSmall = () => wpick(PET_SM[C().p] || PET_SM.hi);
function petSmallChoices() {
  const w = PET_SM[C().p] || PET_SM.hi, ks = Object.keys(w).sort((a, b) => w[b] - w[a]);
  const cs = ks.map(k => petCost(k)), ls = ks.map(k => PET_LIFE[k]), lo = Math.min(...ls.map(x => x[0])), hi = Math.max(...ls.map(x => x[1]));
  const gs = L`한 해 약 ${wonStr(Math.min(...cs))}~${wonStr(Math.max(...cs))} · 종류에 따라 ${lo}~${hi}년 함께`;
  return ks.map(k => ({ k: 'pk_' + k, label: k === 'f' ? "Đặt bể cá, nuôi cá" : L`${eul(petWord(k))} 들인다`, chip: petWord(k), sub: L`한 해 약 ${wonStr(petCost(k))} · ${petLong(k)}`, g: 'pk', gl: "Nhận nuôi một con vật nhỏ", gs }));
}
const petIncK = () => { const P = S.fam.partner, inc = Math.max(S.income, S.fam.married && P && P.alive && !P.divorced ? P.inc || 0 : 0), r = Math.max(0, inc) / incomeAt(C(), 0.5);
  return clamp(r < 1 ? r ** 0.4 : r ** 0.8, 0.55, 2.8); };
const petCost = k => incomeAt(C(), 0.5) * (PET_COSTK[k] || 0.02) * (C().p === 'hi' ? 1 : 0.6) * petIncK();
const petWord = k => ({ d: "chó", c: "mèo", h: "chuột hamster", r: "thỏ", b: "vẹt", f: "cá" })[k] || "mèo";
const petLong = k => { const [a, b] = PET_LIFE[k] || PET_LIFE.c; return L`${a}~${b}년 함께`; };
const PET_NM_MAX = 12;
const petFresh = () => { const was = S.flags.petNames || [], pool = PET_NAMES[S.cur] || PET_NAMES._, fresh = pool.filter(n => !was.includes(n)); return pick(fresh.length ? fresh : pool); };
const petNameAsk = () => { const nm = S.flags.petDef || (S.flags.petDef = petFresh()); return { ph: L`비워 두면 ‘${nm}’`, max: PET_NM_MAX }; };
const petNameClean = v => String(v == null ? '' : v).normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069<>"'`&\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, PET_NM_MAX);
function petAdopt(k, own) {
  const was = S.flags.petNames || [], def = S.flags.petDef; S.flags.petDef = null;
  const mine = petNameClean(own), nm = mine || (def && !was.includes(def) ? def : petFresh()); S.flags.petNames = was.concat(nm).slice(-12);
  const [l0, l1] = PET_LIFE[k] || PET_LIFE.c;
  S.pet = { k, n: nm, at: S.age, life: ri(l0, l1), par: S.age < 18 ? 1 : 0 };
  S.flags.petL = (S.flags.petL || []).concat({ n: nm, k }).slice(-6);
  const big = k === 'd' || k === 'c'; eff({ h: big ? 5 : 3, so: big ? 2 : 1 }); S.yearMark = S.yearMark || 'love';
  return k === 'd' ? L`강아지 ${iga(nm)} 가족이 되었습니다.` : k === 'c' ? L`고양이 ${iga(nm)} 가족이 되었습니다.` : k === 'f' ? L`어항을 들였습니다. 물고기 이름은 ${ro(nm)} 지었습니다.` : L`${petWord(k)} ${iga(nm)} 가족이 되었습니다.`;
}
function petStay(study) {
  const P = S.pet; if (!P || P.par) return;
  const c = C(), par = (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !farFromNK();
  if (!study && !S.refugee && S.age >= 18 && calYr() >= 1990 && c.ppp >= 15000 && chance(0.5)) { const x = med() * 0.06; S.money -= x; book("Chi phí mang thú cưng theo cùng", -x); log(L`${eul(P.n)} 데리고 함께 떠났습니다. 예방접종과 서류, 비행기 표에 ${wonStr(x)}이 들었습니다.`); return; }
  if (par) { P.par = 1; log(L`${eul(P.n)} 부모님 댁에 맡기고 떠났습니다.`); return; }
  S.pet = null; S.flags.petGone = S.age; eff({ h: -3 }); log(L`떠나기 전 ${eul(P.n)} 아껴 줄 이웃에게 보냈습니다.`, 'loss');
}
const svcAway = () => S.serveLeft > 0 && !svcSup();
const petHere = () => !!S.pet && S.job !== 'prison' && !S.nomad && !studyAway() && !svcAway() && (!S.pet.par || (withParents() && !(S.mig && !famCame())));
function petGone(t) { petMemo(S.pet); S.pet = null; S.flags.petGone = S.age; eff({ h: -7, so: -1 }); S.yearMark = S.yearMark || 'loss'; logA('loss:pet', t, 'loss'); }
const PET_BOND_P = 0.4, PET_BOND_GAP = 2;
function petBond(P, age) {
  if (S.age < 4 || !petHere() || (P.bl != null && S.age - P.bl <= PET_BOND_GAP) || !chance(PET_BOND_P)) return;
  const got = P.bd || (P.bd = []), n = P.n, k = P.k, ho = homeOthers();
  const kid = S.age >= 6 && S.age <= 15, adult = S.age >= 18, walk = !noWalk();
  const kids = ho.kids.filter(x => S.age - x.bornAt >= 2 && S.age - x.bornAt <= 12), kn = kids.length ? callName(kids[0].name) : '';
  const alone = S.age >= 25 && !ho.pt && !ho.kids.length && !ho.mom && !ho.dad && !S.flags.oldHome;
  const hard = (S.flags.lossY != null && S.age - S.flags.lossY <= 1) || !!S.mind, old = age >= P.life * 0.66, first = age <= 1;
  const W = PET_BOND[k] ? PET_BOND[k]({ n, kid, adult, walk, kids: kids.length, kn, alone, hard, old, first }) : [];
  const fit = W.filter(x => x[1] && !got.includes(x[0]) && !(noHear() && PET_HEAR.has(k + ':' + x[0])));
  if (!fit.length) return;
  const x = fit.find(y => y[3]) || pick(fit);
  got.push(x[0]); P.bl = S.age;
  eff({ h: 1, so: x[0] === 'nbr' ? 2 : 0.5 });
  logA('pet:' + k, x[2], 'warm', x[4]);
}
const PET_HEAR = new Set(['c:hard', 'c:alone', 'b:name', 'b:song', 'h:wheel']);
const PET_WALK_F = () => "Ở Anh, người nuôi chó có khả năng đạt mức khuyến nghị 150 phút vận động thể chất mỗi tuần cao gấp khoảng 4 lần so với người không nuôi (Westgarth và cộng sự 2019)";
const PET_NBR_F = () => "Trong khoảng 2.600 người nuôi thú cưng ở bốn thành phố, 40% cho biết từng nhận được sự giúp đỡ hoặc an ủi từ người họ quen qua thú cưng của mình (Wood và cộng sự 2015)";
const PET_BOND = {
  d: o => [
    ['night', o.first, L`첫날 밤 내내 낑낑거리던 ${iga(o.n)} 새벽녘에야 내 이불 발치에 몸을 말고 잠들었습니다.`, 1],
    ['school', o.kid && !!S.school, L`학교에서 돌아오면 ${iga(o.n)} 대문 앞에서 꼬리를 흔들며 기다리고 있었습니다. 누구에게도 못 한 이야기를 ${o.n}에게는 했습니다.`],
    ['door', o.adult, L`현관문 소리만 나도 ${iga(o.n)} 꼬리를 흔들며 달려 나왔습니다. 어떤 하루를 보냈든 반겨 주는 얼굴이 있었습니다.`],
    ['walk', o.adult && o.walk, L`아침저녁으로 ${wa(o.n)} 동네를 걸었습니다. 비가 오는 날에도 산책은 거르지 않았습니다.`, 0, PET_WALK_F()],
    ['nbr', o.adult && o.walk, L`산책길에 만나는 이웃들이 ${o.n}의 이름을 먼저 불렀습니다. 그렇게 알게 된 이웃과 안부를 묻는 사이가 되었습니다.`, 0, PET_NBR_F()],
    ['hard', o.hard && o.adult, L`힘든 해였습니다. ${iga(o.n)} 말없이 곁에 와 몸을 기댔고, 그 온기에 하루하루를 버텼습니다.`, 1],
    ['kids', o.kids > 0, L`${iga(o.kn)} ${wa(o.n)} 함께 뒹굴며 자랐습니다. ${eun(o.n)} 아이의 첫 친구였습니다.`],
    ['alone', o.alone, L`혼자 사는 집이었지만, 저녁마다 ${iga(o.n)} 문 앞에서 기다렸습니다. 집이 덜 조용했습니다.`],
    ['old', o.old && o.walk, L`${o.n}의 주둥이가 하얗게 셌습니다. 산책은 짧아졌지만, 느려진 걸음에 맞춰 천천히 걸었습니다.`, 1]],
  c: o => [
    ['night', o.first, L`처음 며칠 소파 밑에 숨어 있던 ${iga(o.n)} 어느 밤 슬그머니 내 무릎에 올라왔습니다.`, 1],
    ['school', o.kid, L`숙제를 펴면 ${iga(o.n)} 공책 위에 드러누웠습니다. ${o.n}에게만 털어놓은 비밀이 몇 개 있었습니다.`],
    ['book', o.adult && !S.flags.illit && !noSight(), L`책이나 신문을 펴면 ${iga(o.n)} 꼭 그 위에 올라앉았습니다. 비켜 달라는 말은 끝내 통하지 않았습니다.`],
    ['sun', true, L`오후 햇살이 드는 창가는 늘 ${o.n}의 자리였습니다. 그 옆에 앉아 있으면 시간이 천천히 흘렀습니다.`],
    ['hard', o.hard && o.adult, L`힘든 해였습니다. 밤마다 ${iga(o.n)} 가슴께에 올라와 골골거렸고, 그 소리를 들으며 잠이 들었습니다.`, 1],
    ['kids', o.kids > 0, L`${iga(o.kn)} ${o.n}의 꼬리를 쫓아다니며 자랐습니다. ${eun(o.n)} 귀찮은 얼굴을 하면서도 아이 곁을 떠나지 않았습니다.`],
    ['alone', o.alone, L`혼자 사는 집에 돌아오면 ${iga(o.n)} 먼저 야옹 하고 말을 걸었습니다.`],
    ['old', o.old, L`${iga(o.n)} 높은 곳에 잘 오르지 못하게 되었습니다. 창가에 작은 계단을 놓아 주었더니 다시 햇살 자리에 앉았습니다.`, 1]],
  r: o => [
    ['hop', true, L`기분이 좋으면 ${iga(o.n)} 공중으로 폴짝 뛰어오르며 몸을 비틀었습니다. 그 모습을 보러 저녁마다 거실 바닥에 앉았습니다.`],
    ['hand', true, L`처음엔 손만 내밀어도 숨던 ${iga(o.n)} 이제는 먼저 다가와 코를 비볐습니다.`]],
  b: o => [
    ['name', true, L`${iga(o.n)} 어느 날 내 이름을 흉내 내 불렀습니다. 아침마다 집에서 가장 먼저 들리는 인사는 ${o.n}의 목소리였습니다.`],
    ['song', true, L`라디오에서 노래가 나오면 ${iga(o.n)} 고개를 까딱이며 따라 불렀습니다.`]],
  h: o => [
    ['wheel', true, L`밤마다 ${o.n}의 쳇바퀴 도는 소리가 방을 채웠습니다. 해바라기씨를 주면 볼이 터질 듯 담아 갔습니다.`]],
  f: o => [
    ['tank', true, "Ngồi trước bể cá ngắm những chú cá bơi qua bơi lại, bạn thấy những ồn ào của một ngày dần lắng xuống."],
    ['feed', true, L`밥 줄 시간이 되면 ${iga(o.n)} 누구보다 먼저 물 위로 올라왔습니다.`]],
};
function petsOfLife() {
  const L0 = S.flags.petL || [S.flags.petMem, S.pet].filter(Boolean).map(p => ({ n: p.n, k: p.k }));
  return L0.map((p, i) => ({ n: p.n, k: p.k, now: !!S.pet && i === L0.length - 1 && S.pet.n === p.n }));
}
function petMemo(P) { if (P && !P.par) S.flags.petMem = { n: P.n, k: P.k, at: S.age }; }
function petMemYear() {
  const m = S.flags.petMem; if (!m) return;
  const y = S.age - m.at; if (y < 1) return;
  if (y > 2 || S.pet) { S.flags.petMem = null; return; }
  if (!chance(0.5)) return;
  S.flags.petMem = null;
  log(m.k === 'd' ? L`산책 시간이 되면 아직도 현관 쪽을 돌아보게 됩니다. ${m.n}의 목줄은 여전히 문고리에 걸려 있습니다.` : m.k === 'c' ? L`창가의 햇살 자리를 볼 때마다 ${iga(m.n)} 떠오릅니다.` : L`${m.n}의 빈자리를 한동안 치우지 못했습니다.`, 'warm');
}
const LOTTO_NO = new Set(['SAU', 'IRN', 'AFG', 'IDN', 'PRK', 'QAT', 'KWT', 'YEM', 'LBY', 'SDN', 'PAK', 'BRN', 'MDV', 'OMN']);
const LOTTO_FROM = { CHN: 1987 };
const lottoOK = () => !AGE12 && S.age >= (S.cur === 'KOR' ? 19 : 18) && !LOTTO_NO.has(S.cur) && !(LOTTO_FROM[S.cur] && calYr() < LOTTO_FROM[S.cur]) && S.job !== 'prison' && !S.refugee && !S.flags.hideCN && S.serveLeft === 0;
const lottoCost = () => med() * (C().p === 'hi' ? 0.009 : 0.006);
function lottoYear() {
  if (S.flags.lotto == null || !lottoOK()) return;
  const cost = lottoCost(); S.money -= cost * 0.82; book("Tiền mua vé số", -cost * 0.82);
  const u = rnd(), jp = S.cur === 'KOR' ? 3.2e-5 : 1.5e-5;
  if (u < jp) { const x = med() * 45 * (0.6 + rnd() * 0.8); S.money += x; book("Tiền trúng xổ số", x); eff({ h: 12, so: 2 }); S.flags.lottoWin = S.age; S.yearMark = 'buy';
    log(L`복권 1등에 당첨되었습니다! 세금을 떼고 ${wonStr(x)}이 들어왔습니다. 몇 번이고 번호를 다시 맞춰 보았습니다. 소식이 퍼지자 오랜만에 연락해 오는 친척도 늘었습니다.`, 'big', "Những người trúng xổ số ở Thụy Điển hài lòng với cuộc sống hơn trong nhiều năm sau khi trúng thưởng. Điều người ta hay gọi là “lời nguyền trúng số” rất hiếm (Lindqvist và cộng sự 2020)"); return; }
  if (u < jp + 1.9e-4) { const x = med() * 1.2; S.money += x; book("Tiền trúng xổ số", x); eff({ h: 6 }); log(L`복권 2등에 당첨되었습니다. ${wonStr(x)}, 큰돈이었지만 삶이 바뀔 만큼은 아니었습니다.`, 'big'); return; }
  if (u < jp + 1.9e-4 + 0.0073) { const x = med() * 0.045; S.money += x; book("Tiền trúng xổ số", x); eff({ h: 3 }); log(L`복권 3등에 당첨되었습니다. ${wonStr(x)}으로 가족과 근사한 저녁을 먹었습니다.`); return; }
  if (S.age - S.flags.lotto >= 5 && chance(0.04)) { S.flags.lotto = null; S.flags.lottoQuit = S.age; log("Mấy năm liền chẳng trúng gì, bạn quyết định thôi không mua vé số nữa."); }
}
const WTOP_R = { hi: [0.60, 0.25, 5.5], eap: [0.68, 0.31, 5], sa: [0.65, 0.33, 4.5], ssa: [0.70, 0.35, 3.5], lac: [0.77, 0.46, 4], mena: [0.76, 0.45, 4.5], eca: [0.70, 0.40, 4] };
const WTOP_C = { USA: [0.70, 0.35, 6], KOR: [0.58, 0.25, 8], JPN: [0.58, 0.25, 6.5], CHN: [0.68, 0.31, 6.5], IND: [0.65, 0.33, 5], BRA: [0.79, 0.49, 4], RUS: [0.74, 0.47, 3.5], ZAF: [0.85, 0.55, 3], DEU: [0.60, 0.29, 5], FRA: [0.59, 0.27, 6], GBR: [0.57, 0.21, 6.5], MEX: [0.79, 0.46, 3.5] };
function wealthTail(c) {
  const [s10, s1, b] = WTOP_C[c.id] || WTOP_R[c.p] || WTOP_R.hi, k = Math.log(s1 / s10) / Math.log(0.1);
  return { a: 1 / (1 - k), t10: s10 * b * c.ppp * 0.9 / 0.1 * k };
}
function wealthTop(c, nw) { const T = wealthTail(c); return nw >= T.t10 ? 0.1 * Math.pow(nw / T.t10, -T.a) : null; }
const wealthAt = (c, q) => { const T = wealthTail(c); return T.t10 * Math.pow(q / 0.1, -1 / T.a); };
const topStr = q => q >= 0.0095 ? L`상위 ${Math.round(q * 100)}%` : q >= 0.00095 ? L`상위 ${(q * 100).toFixed(1)}%` : q >= 0.0001 ? L`상위 ${(q * 100).toFixed(2)}%` : "trong top 0,01%";
const TMPR_EFF = { cur: { sm: 8 }, act: { hl: 6, so: 3 }, warm: { so: 8 }, grit: { sm: 4, hl: 3 } };
const tmprK = () => S.trait && typeof S.trait === 'object' ? S.trait.k : S.trait;
const gritK = () => tmprK() === 'grit' ? 0.8 : 1;
const TMPR_NM = () => ({ cur: "một đứa trẻ hay tò mò", act: "một đứa trẻ hiếu động", warm: "một đứa trẻ giàu tình cảm", grit: "một đứa trẻ kiên trì" });
const TMPR_LN = () => ({
  cur: ["Mỗi ngày bạn hỏi đến hàng chục lần: “Cái này là gì?”, “Tại sao?”", "Bạn ngồi xổm thật lâu, dõi theo một hàng kiến.", "Ngăn kéo nào với tới được, bạn cũng mở ra và lấy từng thứ bên trong ra xem."],
  act: noWalk() || (S.dis && S.dis.k === 'move') ? ["Bạn chẳng chịu yên lúc nào, thứ gì trong tầm tay cũng đem gõ, đem lắc thử.", "Ngày nào bạn cũng chỉ tay ra cửa mấy lần, đòi đi ra ngoài.", "Hễ nghe nhạc là bạn nhún nhảy cả người, thích thú vô cùng."]
    : ["Bạn chẳng chịu ngồi yên lúc nào, chạy nhảy suốt cả ngày.", "Thấy chỗ nào cao là bạn trèo lên, khiến người lớn phải thót tim.", "Bạn chơi ngoài trời đến tận lúc mặt trời lặn, về nhà là lăn ra ngủ say."],
  warm: ["Thấy đứa trẻ khác khóc, bạn đến gần và chìa đồ chơi của mình ra.", "Ngay cả với người lớn lần đầu gặp, bạn cũng vẫy tay cười trước.", "Bạn ngồi cạnh người nhà đang ốm và làm bộ đặt tay lên trán họ."],
  grit: ["Tháp đang xếp bị đổ, bạn không khóc mà xếp lại hết lần này đến lần khác.", "Bạn nhất định đòi tự cài cúc áo, loay hoay mãi không chịu thôi.", S.dis && S.dis.k === 'move' ? "Bạn hết lần này đến lần khác vươn người về phía món đồ chơi ngoài tầm tay." : "Ngã xuống, bạn không đòi ai đỡ mà tự mình đứng dậy."],
});
function tmprLean() {
  const f = S.flags.tmp || {}, w = { cur: 1, act: 1, warm: 1, grit: 1 };
  if (f.pick) w[f.pick] += 0.8;
  if (S.fam.older > 0) w.warm *= 1.3;
  if (!S.urban) w.act *= 1.3;
  if (S.q >= 4) w.cur *= 1.2; else if (S.q <= 2) w.grit *= 1.2;
  return w;
}
const LESSON_C = new Set(['KOR', 'JPN', 'CHN', 'TWN', 'HKG', 'SGP', 'VNM', 'IND']);
const LESSON_MAX = 2, LESSON_GAP = 3;
const TAL_K = ['st', 'bd', 'ar', 'mu', 'hd', 'wd'];
const TAL_H = { sport: 'bd', gym: 'bd', hiking: 'bd', dance: 'mu', music: 'mu', karaoke: 'mu', art: 'ar', photo: 'ar', crafts: 'hd', cooking: 'hd',
  garden: 'hd', fishing: 'hd', reading: 'st', board: 'st', games: 'st', drama: 'wd', faith: 'wd', sns: 'wd' };
const talOfH = id => TAL_H[id] || (String(id).startsWith('sp_') ? 'bd' : null);
const gaussR = r => invNorm(clamp(r(), 1e-4, 1 - 1e-4));
function talDraw(r) { const g = gaussR(r), t = {}; for (const k of TAL_K) t[k] = Math.round((0.25 * g + 0.968 * gaussR(r)) * 100) / 100; return t; }
function talEnsure() {
  if (S.tal) return S.tal;
  let h = hashStr((nmSeed() || (S.name && S.name.g)) + '|' + S.born + '|' + S.sex) || 1;
  const r = () => { h = (Math.imul(h ^ (h >>> 15), 2246822507) + 0x9e3779b9) >>> 0; return ((h >>> 8) + 0.5) / 16777216; };
  S.tal = talDraw(r); S.flags.talOld = 1;
  return S.tal;
}
const tal = k => (talEnsure()[k] || 0);
const talK = id => { const k = talOfH(id); return k ? clamp(1 + 0.35 * tal(k), 0.4, 1.9) : 1; };
const talPass = k => 0.05 * tal(k);
const talW = a => 0.9 * clamp(0.35 + 0.055 * (a - 3), 0.35, 1);
const KNOW_EFF = { study: 1, learn: 0.8, mind: 0.6, career: 0.4, help: -0.1, rest: -0.1, parttime: -0.1 };
const KNOW_W0 = a => a < 6 ? 0 : a < 18 ? 0.2 : a < 25 ? 0.25 : 0.05;
const kzOf = () => talW(S.age) * tal('st') + (S.kE || 0);
function smSync() { S.st.sm = clamp(100 * normCdf(kzOf()), 0.5, 99.9); }
function knowStart() {
  if (S.kE != null) return;
  talEnsure();
  const sm = isFinite(S.st.sm) ? S.st.sm : 40, z0 = S.age < 6 ? talW(S.age) * tal('st') : clamp((sm - 72) / 14, -2.4, 2.4);
  S.kE = clamp(z0 - talW(S.age) * tal('st'), -1.4, 1.6);
}
function knowAdd(d) { knowStart(); S.kE = clamp(S.kE + d * 0.009, -1.4, 1.6); smSync(); }
function knowYear(a, w) {
  knowStart();
  let e = 0; for (const k in w) e += (KNOW_EFF[k] || 0) * w[k];
  let d = a >= 6 ? 0.075 * (e - KNOW_W0(a)) : 0;
  for (const hb of S.hobbies) { const H = hobDef(hb.id); if (H.sm > 0) d += H.sm * 0.005; }
  if (a >= 6 && a <= 17 && !S.school) d -= 0.03;
  if (S.school === 'uni' || S.school === 'grad' || S.school === 'phd') d += 0.02;
  if (S.flags.gedAt != null) d += 0.06;
  else if (S.flags.openUni || S.flags.nightUni || S.flags.nightGrad) d += 0.02;
  if (a > 72) d -= 0.02 * (1 - mindKeep());
  if (a >= 6 && tmprK() === 'cur') d += 0.005;
  if (S.flags.goodT != null && S.flags.goodT === a) d += 0.05;
  const sm0 = S.st.sm;
  S.kE = clamp(S.kE * (a < 25 ? 0.97 : 0.985) + d, -1.4, 1.6);
  smSync();
  if (!S.isComp && a <= 17) {
    if (S.school && (w.study || 0) >= 0.5) { if (!S.flags.kSt) S.flags.kSm = sm0; S.flags.kSt = (S.flags.kSt || 0) + 1; } else S.flags.kSt = 0;
    if (S.flags.kSt >= 3 && a >= 9 && !S.flags.kHeld && S.st.sm - S.flags.kSm < 4) { S.flags.kHeld = 1;
      log("Nhờ mấy năm chăm chỉ học hành, bạn không bị tụt lại so với các bạn cùng trang lứa.", 'ev', "Kiến thức cho biết bạn đứng ở đâu so với những người cùng tuổi. Bạn bè cùng trang lứa cũng đang học, nên nếu ngừng học, bạn sẽ dần tụt lại phía sau"); }
  }
}
const TAL_WIN = { mu: [3, 8], ar: [4, 9], wd: [4, 9], bd: [5, 10], st: [6, 11], hd: [6, 12] };
const TAL_LN = (sch = true) => ({
  st: ["Bạn học chữ và số nhanh hơn các bạn cùng tuổi rất nhiều.", sch ? "Đọc qua một lần là bạn không quên. Thầy cô thường gọi riêng bạn ra để giao những bài khó hơn." : "Nghe qua một lần là bạn không quên. Nghe người lớn tính toán bên cạnh, bạn thường nói ra đáp số trước cả họ."],
  bd: ["Chạy thi lần nào bạn cũng về nhất.", "Việc gì cần đến sức vóc, bạn cũng vượt xa các bạn cùng tuổi. Người lớn trong xóm cứ bảo nên cho bạn tập luyện thể thao bài bản."],
  ar: [sch ? "Cầm bút sáp màu lên là bạn quên cả thời gian. Tranh bạn vẽ lúc nào cũng được treo trên tường lớp học." : "Dù là bút sáp hay cành cây, hễ cầm được thứ gì để vẽ là bạn quên cả thời gian. Người lớn thường dừng chân trước những bức vẽ của bạn.", "Người lớn kinh ngạc trước tài vẽ lại y hệt những gì bạn nhìn thấy."],
  mu: ["Bài hát nào nghe một lần, bạn cũng hát lại được không sai một nốt.", "Lần đầu cầm nhạc cụ, bạn đã nhanh chóng dò ra được giai điệu. Bạn có đôi tai cảm âm hơn hẳn người khác."],
  hd: ["Bạn hay tháo những món đồ chơi hỏng ra rồi sửa lại cho chạy được.", "Thứ gì trong tầm tay bạn cũng làm ra được một món gì đó. Có lần bạn còn bị mắng vì lén mượn đồ nghề của người lớn."],
  wd: ["Bạn nhanh chóng làm thân ngay cả với những đứa trẻ mới gặp lần đầu. Mỗi khi cả nhóm chọn trò, bạn luôn là người đi đầu.", "Bạn rất có tài ăn nói. Bạn thường đứng ra giữa những đứa trẻ cãi nhau để giảng hòa."],
});
const TAL_STORY = () => ({ st: "Từ nhỏ đã có năng khiếu đặc biệt về học hành.", bd: "Từ nhỏ đã có năng khiếu đặc biệt về thể thao và vận động.", ar: "Từ nhỏ đã có năng khiếu đặc biệt về hội họa.", mu: "Từ nhỏ đã có năng khiếu đặc biệt về âm nhạc.", hd: "Từ nhỏ đã khéo tay hơn người.", wd: "Từ nhỏ đã có năng khiếu đặc biệt trong việc hòa đồng với mọi người." });
function talYear(a) {
  if (S.isComp || a < 3 || a > 12 || S.flags.talOld) return;
  const t = talEnsure(), shown = S.flags.talShown || (S.flags.talShown = []);
  const top = TAL_K.filter(k => t[k] >= 1).sort((x, y) => t[y] - t[x]).slice(0, 2);
  for (const k of top) {
    if (shown.includes(k) || a < TAL_WIN[k][0] || a > TAL_WIN[k][1] || (k === 'wd' && ddTalkLate()) || (k === 'mu' && noHear()) || !chance(0.4)) continue;
    shown.push(k);
    const heard = noHear() && (k === 'wd' || (k === 'st' && !S.school));
    log(TAL_LN(!!S.school)[k][t[k] >= 1.8 && !heard ? 1 : 0], 'warm', shown.length === 1 ? "Tổng hợp các nghiên cứu về trẻ sinh đôi cho thấy nhiều đặc điểm của con người nhìn chung khoảng một nửa là bẩm sinh, một nửa được hình thành trong quá trình lớn lên (Polderman và cộng sự 2015)" : undefined);
    return;
  }
}
function lessonYear(a) {
  const F = S.flags, fk = S.focus, c = B();
  const kind = a >= 7 && a <= 17 && !S.isComp && S.job !== 'childwork' && S.school ? (fk === 'study' ? 'study' : fk === 'hobby' && S.hobbies.length ? 'hobby' : fk === 'sport' ? 'sport' : null) : null;
  if (F.lesson && F.lesson.k !== kind) F.lesson = null;
  if (!kind || fk !== F.focusPicked) { F.lessonFk = null; return; }
  if (!F.lessonFk || F.lessonFk[0] !== kind) F.lessonFk = [kind, a];
  if (F.lesson) {
    if (kind === 'study') { knowAdd(2.6); S.st.h = clamp(S.st.h - 0.5, 0, 100); }
    else { const h = kind === 'sport' ? S.hobbies.find(isSportH) : S.hobbies[0]; if (h) h.lv += 0.5 * talK(h.id); if (kind === 'sport') S.st.hl = clamp(S.st.hl + 1, 0, 100); }
    return;
  }
  const asked = F.lessonAsk || (F.lessonAsk = {}), was = Object.values(asked);
  if (asked[kind] || a - F.lessonFk[1] < 1 || was.length >= LESSON_MAX || was.some(x => a - x < LESSON_GAP)) return;
  asked[kind] = a;
  const q = clamp(S.q, 1, 5) - 1, p = kind === 'study' ? (LESSON_C.has(c.id) ? [0.5, 0.65, 0.75, 0.85, 0.9] : [0.15, 0.25, 0.35, 0.5, 0.65])[q]
    : [0.15, 0.3, 0.45, 0.65, 0.8][q] * (c.ppp < 8000 ? 0.4 : 1);
  const w = carerW();
  if (chance(p)) { F.lesson = { k: kind, at: a }; eff({ h: 2 });
    log(kind === 'study' ? L`공부를 더 하고 싶다고 조르자, ${iga(w)} 학원에 보내 주셨습니다.` : kind === 'sport' ? L`운동을 제대로 배우고 싶다고 조르자, ${iga(w)} 클럽에 보내 주셨습니다.` : L`좋아하는 일을 제대로 배우고 싶다고 조르자, ${iga(w)} 레슨을 받게 해 주셨습니다.`, 'warm'); return; }
  eff({ h: -1 }); const poor = S.q <= 2;
  log(kind === 'study' ? (poor ? L`학원에 보내 달라고 졸랐지만, ${eun(w)} 형편이 어렵다며 미안해하셨습니다.` : L`학원에 보내 달라고 졸랐지만, ${eun(w)} 조금 더 지켜보자고 하셨습니다.`)
    : kind === 'sport' ? (poor ? L`운동을 제대로 배우고 싶다고 졸랐지만, ${eun(w)} 형편이 어렵다며 미안해하셨습니다.` : L`운동을 제대로 배우고 싶다고 졸랐지만, ${eun(w)} 조금 더 지켜보자고 하셨습니다.`)
    : poor ? L`좋아하는 일을 제대로 배우고 싶다고 졸랐지만, ${eun(w)} 형편이 어렵다며 미안해하셨습니다.` : L`좋아하는 일을 제대로 배우고 싶다고 졸랐지만, ${eun(w)} 조금 더 지켜보자고 하셨습니다.`);
}
function tmprYear(a) {
  if (S.trait || a > 4 || S.isComp) return;
  if (a === 3 || a === 4) {
    if (chance(0.85)) { const f = S.flags.tmp || (S.flags.tmp = {}), k = wpick(tmprLean()); f[k] = (f[k] || 0) + 1; f.ln = f.ln || [];
      const ls = TMPR_LN()[k], i = [0, 1, 2].filter(j => !f.ln.includes(k + j) && !(k === 'cur' && j === 0 && ddTalkLate())); const j = i.length ? pick(i) : 1; f.ln.push(k + j); log(ls[j], 'warm'); }
  }
  if (a === 4) {
    const f = S.flags.tmp || {}, ks = ['cur', 'act', 'warm', 'grit'], top = Math.max(0, ...ks.map(k => f[k] || 0));
    const k = top > 0 ? pick(ks.filter(x => (f[x] || 0) === top)) : wpick(tmprLean());
    S.trait = k; eff(TMPR_EFF[k]); S.flags.tmp = null;
    log(L`다섯 살 무렵이 되자 어른들은 ${eul(callName(S.name))} ${ira(TMPR_NM()[k])}라고 불렀습니다.`, 'warm', "Tính khí thời thơ ấu thường kéo dài đến khi trưởng thành. Sự kiên trì và khả năng tự kiểm soát vào khoảng năm tuổi có liên hệ tuy nhỏ nhưng rõ ràng với việc học hành, sức khỏe và tài chính hàng chục năm sau (Moffitt và cộng sự 2011, nghiên cứu Dunedin, New Zealand)");
  }
}
function yearWork() {
  if (S.age < 15 || S.job === 'prison' || typeof shortJob !== 'function') return '';
  if (S.serveLeft > 0) return svcLbl();
  if (S.school) return S.school === 'uni' ? "sinh viên đại học" : S.school === 'grad' || S.school === 'phd' ? "học viên cao học" : "đang đi học";
  if (S.retired || S.job === 'retired') return clergyOld() ? clergyEmer() : "nghỉ hưu";
  if (S.job === 'homemaker') return shortJob('homemaker') || '';
  if (isWorking()) return shortJob(S.job) || '';
  if (S.job === 'seeking') return "đang tìm việc";
  return '';
}
const autoSkipTag = (on, sk) => S.flags[on] && S.flags[sk] ? ' · ' + "đang tạm dừng vì tiền tiết kiệm chưa đủ" : '';
function autoSkipNow(sk, cost) {
  if (S.money >= cost * 3) { S.flags[sk] = 0; return ''; }
  S.flags[sk] = 1; return ' ' + "Có điều hiện giờ tiền tiết kiệm chưa đủ: chỉ bắt đầu khi đã dành dụm được gấp ba chi phí.";
}
function checkAutoYear() {
  if (!S.flags.checkAuto || S.job === 'prison' || S.flags.shop_checkup === S.age) return;
  const it = SHOP.find(x => x.id === 'checkup'), cost = it.cost();
  if (S.money < cost * 3) { if (!S.flags.checkSkip) { S.flags.checkSkip = 1; log("Năm nay kinh tế eo hẹp nên bạn bỏ qua lần khám tổng quát và buổi tập PT. Khi dư dả hơn, bạn sẽ làm lại."); } return; }
  { const x = ncdCheckup(true); if (x) log("Ở lần khám tổng quát hằng năm, bạn được dặn một điều." + x, 'note'); }
  S.flags.checkSkip = 0; S.money -= cost; book("Khám tổng quát · tập PT", -cost); S.flags.shop_checkup = S.age; S.flags.healthy = S.age + 3; eff({ hl: 6 * fitK(S.age) });
}
const TUTOR_K = { KOR: 0.2 };
const tutorCost = () => med() * (TUTOR_K[C().id] || 0.08);
function tutorAutoYear() {
  if (!S.flags.tutorAuto || S.job === 'prison' || S.flags.shop_tutor === S.age) return;
  const ks = kidsYoung().filter(k => !k.placed && S.flags['shop_tutor_' + S.fam.kids.indexOf(k)] !== S.age);
  if (!ks.length) return;
  const cost = tutorCost() * ks.length;
  if (S.money < cost * 3) { if (!S.flags.tutorSkip) { S.flags.tutorSkip = 1; log("Năm nay kinh tế eo hẹp nên các con tạm nghỉ học thêm và gia sư. Khi dư dả hơn, bạn sẽ cho các con học lại."); } return; }
  S.flags.tutorSkip = 0; S.money -= cost; book("Học thêm · gia sư cho con", -cost); S.flags.shop_tutor = S.age;
  ks.forEach(k => { k.tutor = (k.tutor || 0) + 1; });
}
const courseOK = () => S.age >= 18 && S.age < 60 && !S.school;
function courseDo() {
  eff({ sm: 6 });
  if (isWorking()) {
    const [lo, hi] = jobRange(S.job, C()), room = clamp((hi + 0.04 - S.pct) / Math.max(0.05, hi - lo) * 1.2, 0, 1), st = 0.03 * effLeft();
    S.pct = clamp(S.pct + st * room, 0, Math.max(S.pct, 0.99)); S.flags.effG = (S.flags.effG || 0) + st;
  }
  S.flags.courseY = S.age;
}
function courseAutoYear() {
  if (!S.flags.courseAuto || !courseOK() || S.job === 'prison' || S.serveLeft > 0 || S.flags.hideCN) return;
  const last = S.flags.shop_course; if (last != null && S.age - last < 2) return;
  const cost = med() * 0.15;
  if (S.money < cost * 3) { if (!S.flags.courseSkip) { S.flags.courseSkip = 1; log("Năm nay kinh tế eo hẹp nên bạn bỏ qua khóa học chứng chỉ và nghiệp vụ. Khi dư dả hơn, bạn sẽ học lại."); } return; }
  S.flags.courseSkip = 0; S.money -= cost; book("Chứng chỉ · khóa học nghiệp vụ", -cost); S.flags.shop_course = S.age; courseDo();
}
function huntAutoYear() {
  if (!S.flags.huntAuto || !huntOK() || S.flags.huntAt != null) return;
  const last = S.flags.shop_jobhunt; if (last != null && S.age - last < 2) return;
  S.flags.shop_jobhunt = S.age; S.flags.huntAt = S.age;
}
const AUTO_KEEP = 1, AUTO_TOLD = 8;
const shopOk = id => { const it = SHOP.find(x => x.id === id); return !!it && it.ok(); };
const lc1 = s => s.charAt(0).toLowerCase() + s.slice(1);
function autoState(flag, A) {
  if (!S.flags[flag]) return '';
  const last = S.flags['shop_' + A.id];
  if (S.flags[flag + 'Sk']) return "đang tạm dừng vì tiền tiết kiệm chưa đủ";
  return last != null && S.age - last <= A.every ? L`마지막으로 ${last}세에 했어요` : '';
}
function autoItem(flag, A, sn, on, off) {
  return { id: A.id + 'auto', set: flag, sn, ev: () => { const s = autoState(flag, A); return A.ev() + (s ? ' · ' + s : '') + auMark(flag); }, n: sn, cd: 0, cost: () => 0, auto: A, can: () => shopOk(A.id),
    ok: () => !(A.off && A.off()) && (shopOk(A.id) || !!S.flags[flag]),
    run: () => { S.flags[flag] = S.flags[flag] ? 0 : 1; S.flags[flag + 'Sk'] = 0; auHand(flag); return S.flags[flag] ? on() + autoWait(A) : off(); } };
}
function autoWait(A) {
  const it = SHOP.find(x => x.id === A.id); if (!it) return '';
  const cost = it.cost(A.opt ? A.opt() : undefined);
  return S.money - cost < Math.max(cost * 2, med() * AUTO_KEEP) ? ' ' + "Có điều hiện giờ tiền tiết kiệm chưa đủ: chỉ bắt đầu khi chi xong vẫn còn lại ít nhất bằng thu nhập một năm của một người bình thường." : '';
}
const autoOnFor = id => SHOP.some(s => s.auto && s.auto.id === id && S.flags[s.set]);
const AU_SETS = [['dinnerAuto', 25], ['parentsAuto', 25], ['kmAuto', 50]];
const AU_KEEP = 2;
const auMark = f => S.flags[f] && (S.flags.auSets || []).includes(f) ? ' · ' + "đã bật do chế độ Tự động" : '';
function auFocus() {
  const o = focusOptions(); if (!o.length) return null;
  if (stage() === 'school' && S.school === 'uni' && S.schoolY >= 3 && o.includes('career')) return 'career';
  if (S.age >= 18 && S.st.hl < 40 && o.includes('health')) return 'health';
  return null;
}
function auYear() {
  const F = S.flags; if (!F.au) return;
  if (!F.focusOwn && !(S.focus && !focusOptions().includes(S.focus) && eduNext())) {
    const k = auFocus();
    if (k) { if (k !== S.focus) { if (F.auFo !== S.focus) F.auWas = S.focus; S.focus = F.auFo = k; F.focusBack = F.focusAuto = null; } }
    else if (F.auFo) { if (S.focus === F.auFo) { S.focus = F.auWas || null; ensureFocus(); } F.auFo = F.auWas = null; }
  }
  if (S.isComp) return;
  const no = F.auNo || [], on = F.auSets || (F.auSets = []);
  for (const [f, a] of AU_SETS) {
    if (F[f] || no.includes(f) || S.age < a) continue;
    const it = SHOP.find(x => x.set === f); if (!it || !it.ok() || (it.can && !it.can())) continue;
    F[f] = 1; F[f + 'Sk'] = 0; if (!on.includes(f)) on.push(f);
  }
}
function auOff() { for (const f of S.flags.auSets || []) S.flags[f] = 0; S.flags.auSets = []; S.flags.au = 0; }
function auHand(f) {
  S.flags.auSets = (S.flags.auSets || []).filter(x => x !== f);
  const no = (S.flags.auNo || []).filter(x => x !== f); if (!S.flags[f]) no.push(f); S.flags.auNo = no;
}
const shopD = it => (typeof it.d === 'function' ? it.d() : it.d) + (autoOnFor(it.id) ? ' · ' + "đã bật trong 'Tự động'" : '');
const GIVE_IDS = new Set(['dinner', 'party', 'parents', 'kidmoney', 'trip', 'abroad']);
function giveMark(id, o) {
  if (!GIVE_IDS.has(id) || ((id === 'trip' || id === 'abroad') && (!o || o === 'solo')) || S.stats.gvL === S.age) return;
  S.stats.gvL = S.age; S.stats.gvY = (S.stats.gvY || 0) + 1;
}
function shopAutoYear() {
  for (const f in SET_ENDS) if (S.flags[f] && SET_ENDS[f]()) S.flags[f] = 0;
  if (S.job === 'prison' || S.serveLeft > 0 || S.flags.hideCN) return;
  const tight = [];
  for (const s of SHOP) {
    const A = s.auto; if (!A || !S.flags[s.set]) continue;
    if (A.off && A.off()) { S.flags[s.set] = 0; continue; }
    const it = SHOP.find(x => x.id === A.id); if (!it || !it.ok() || (rohCamp() && ROH_NO_SHOP.has(A.id)) || ddShopNo(A.id)) continue;
    const last = S.flags['shop_' + A.id]; if (last != null && S.age - last < A.every) continue;
    const o = A.opt ? A.opt() : undefined; if (it.opts && !it.opts().some(x => x[0] === o)) continue;
    const cost = it.cost(o), sk = s.set + 'Sk';
    const au = (S.flags.auSets || []).includes(s.set);
    if (S.money - cost < Math.max(cost * 2, med() * (au ? AU_KEEP : AUTO_KEEP))) { if (!S.flags[sk]) { S.flags[sk] = 1; if (!au) tight.push(A.word()); } continue; }
    S.flags[sk] = 0;
    const n0 = netWorth(), mk = S.yearMark;
    S.money -= cost; S.flags['shop_' + A.id] = S.age;
    const r = A.go ? A.go(o) : it.run(o); giveMark(A.id, o);
    if (A.keepMark) S.yearMark = mk;
    bookSince(n0, typeof it.n === 'function' ? it.n() : it.n);
    if (r && A.line) { log(r, 'ev'); S.log[S.log.length - 1].sh = 1; }
  }
  if (tight.length && (S.flags.autoTold == null || S.age - S.flags.autoTold >= AUTO_TOLD)) { S.flags.autoTold = S.age;
    log(L`올해는 형편이 빠듯해 ${eul(listAnd(tight))} 건너뛰었습니다. 여유가 생기면 다시 합니다.`); }
}
const gearOpt = i => i ? 'lv' + i : 'lv';
const gearHob = o => S.hobbies[o === 'lv' ? 0 : +String(o).slice(2)] || null;
const gearRoom = lv => lv < 6 ? 1 : clamp((14 - lv) / 8, 0.1, 1);
const gearGain = h => 2 * talK(h.id) * gearRoom(h.lv);
const gearAutoW = () => { const i = S.hobbies.findIndex(h => h.id === S.flags.gearW); return gearOpt(Math.max(0, i)); };
const gearAutoN = () => { const h = gearHob(gearAutoW()); return h ? hobbyName(h.id) : ''; };
const cohabNow = () => { const P = S.fam.partner; return !!(S.fam.married && P && P.alive && P.cohab && !P.divorced); };
const tripAutoW = ab => { const w = tripWith(), t = ab && S.flags.tripWA != null ? S.flags.tripWA : S.flags.tripW; return w.some(x => x[0] === t) ? t : w[0][0]; };
const abroadDest = () => pick(COUNTRIES.filter(x => x.id !== S.cur && x.wh != null && x.wh > 6.4));
function tripTo(id) { if (!S || !id || !CBY[id] || id === S.cur) return; const t = S.trips || (S.trips = []); if (t.length < 40) t.push([S.age, id]); }
const parentAlive = () => S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent);
const petVetPar = () => S.age < 18 && withParents() && famCanHelp();
function petOrphan() {
  const P = S.pet; if (!P || !P.par || parentAlive() || S.age < 18) return;
  if (S.job !== 'prison' && !S.nomad && !studyAway() && !svcAway() && !(S.mig && !famCame()) && !farFromNK()) { P.par = 0; P.svc = null; log(L`부모님 댁에서 지내던 ${eul(P.n)} 데려와 함께 살게 되었습니다.`); return; }
  S.pet = null; S.flags.petGone = S.age;
  log(sibAliveN() > 0 ? L`부모님 댁에서 지내던 ${eul(P.n)} 형제자매가 데려가 키우기로 했습니다.` : L`부모님 댁에서 지내던 ${eul(P.n)} 이웃이 데려가 키우기로 했습니다.`);
}
function petSvc() {
  const P = S.pet; if (!P) return;
  if (!svcAway()) { if (P.svc) { P.svc = null; if (P.par === 2) { P.par = withParents() ? 1 : 0; if (!P.par) log(L`부모님 댁에 맡겨 두었던 ${eul(P.n)} 다시 데려왔습니다.`); } } return; }
  if (P.par || P.svc) return;
  const Pt = S.fam.partner; P.svc = 1;
  if (withParents() || (S.fam.married && Pt && Pt.alive && !Pt.divorced)) return;
  if (parentAlive() && !farFromNK()) { P.par = 2; log(L`${eul(P.n)} 부모님 댁에 맡기고 부대로 떠났습니다.`); return; }
  S.pet = null; S.flags.petGone = S.age; eff({ h: -3 }); log(L`부대로 떠나기 전 ${eul(P.n)} 아껴 줄 이웃에게 보냈습니다.`, 'loss');
}
function petYear() {
  petOrphan(); petSvc();
  const P = S.pet; if (!P) { petMemYear(); return; }
  const age = S.age - P.at;
  if (S.age >= 18 && !P.par) { const x = petCost(P.k); S.money -= x; book("Thú cưng", -x); }
  const big = P.k === 'd' || P.k === 'c';
  if (!P.par || petHere()) eff({ h: big ? 0.6 : 0.35, so: big ? 0.3 : 0.1 });
  if (age >= P.life) { petGone(P.par && !petHere() && S.age >= 18 ? L`부모님 댁에서 지내던 ${iga(P.n)} ${age}살로 무지개다리를 건넜다는 소식을 들었습니다.` : L`${iga(P.n)} ${age}살로 무지개다리를 건넜습니다.`); return; }
  petBond(P, age);
  if (age >= Math.round(P.life * 0.5) && P.k !== 'h' && P.k !== 'f' && chance(0.07) && petHere()) S.flags.petSickQ = 1;
}
const BIZ_K = {
  food: { n: "quán ăn nhỏ", t: "chủ quán ăn", cost: 1.2, close: 0.1, start: -0.05, pct: -0.02, fit: ['cook', 'vendor'] },
  shop: { n: "cửa hàng trong xóm", t: "chủ cửa hàng", cost: 1, close: 0.09, start: -0.02, pct: 0, fit: ['shop', 'vendor', 'clerk', 'domestic'] },
  service: { n: "tiệm dịch vụ tay nghề", t: "chủ cửa hàng", cost: 0.8, close: 0.06, start: 0.03, pct: 0, fit: ['hair', 'mechanic', 'electric', 'artisan', 'care'] },
  online: { n: "bán hàng trực tuyến", t: "chủ cửa hàng trực tuyến", cost: 0.5, close: 0.12, start: -0.05, pct: -0.02, fit: ['dev', 'clerk', 'shop', 'creator', 'delivery'] },
  workshop: { n: "xưởng sản xuất nhỏ", t: "chủ xưởng sản xuất nhỏ", cost: 2.5, close: 0.06, start: 0, pct: 0.06, fit: ['factory', 'garment', 'engineer', 'artisan', 'construct', 'miner'] },
  agri: { n: "buôn bán nông sản", t: "chủ cơ sở buôn bán nông sản", cost: 1, close: 0.07, start: 0, pct: 0, fit: ['farm', 'farmhand', 'herder', 'agbiz', 'fisher'] },
  transport: { n: "công ty vận tải nhỏ", t: "chủ doanh nghiệp vận tải", cost: 1.6, close: 0.07, start: 0.02, pct: 0.02, fit: ['driver', 'delivery', 'warehouse'], skill: 1 },
  build: { n: "cơ sở sửa chữa và cải tạo nhà", t: "chủ cơ sở cải tạo nhà", cost: 0.6, close: 0.07, start: 0.02, pct: 0.01, fit: ['construct', 'welder', 'electric', 'cleaner'], skill: 1 },
  law: { n: "văn phòng luật", t: "luật sư trưởng văn phòng luật", lb: "Mở văn phòng luật của riêng mình", cost: 0.8, close: 0.035, start: 0.1, pct: 0.03, hi: 0.99, fit: ['lawyer'], pro: 1 },
  clinic: { n: "phòng khám trong khu phố", t: "bác sĩ chủ phòng khám", lb: "Mở phòng khám trong khu phố", cost: 3, close: 0.025, start: 0.12, pct: 0.04, hi: 0.99, fit: ['doctor'], pro: 1 },
  soft: { n: "công ty phần mềm", t: "giám đốc công ty phần mềm", lb: "Thành lập công ty phần mềm (ứng dụng, trò chơi điện tử)", cost: 0.6, close: 0.15, start: -0.08, pct: 0.04, hi: 0.97, fit: ['dev'], pro: 1 },
  acct: { n: "văn phòng thuế và kế toán", t: "giám đốc văn phòng thuế và kế toán", lb: "Mở văn phòng thuế và kế toán", cost: 0.6, close: 0.04, start: 0.08, pct: 0.02, hi: 0.95, fit: ['finance'], pro: 1 },
  arch: { n: "văn phòng thiết kế kỹ thuật", t: "giám đốc văn phòng thiết kế kỹ thuật", lb: "Mở văn phòng thiết kế và kỹ thuật", cost: 0.8, close: 0.06, start: 0.04, pct: 0.02, hi: 0.95, fit: ['engineer'], pro: 1 },
  studio: { n: "studio thiết kế", t: "giám đốc studio thiết kế", lb: "Mở studio thiết kế", cost: 0.5, close: 0.08, start: 0, pct: 0.02, hi: 0.9, fit: ['designer', 'artist'], pro: 1 },
  academy: { n: "trung tâm học thêm", t: "giám đốc trung tâm học thêm", lb: "Mở trung tâm học thêm", cost: 1, close: 0.08, start: 0, pct: 0.01, hi: 0.9, fit: ['teacher', 'prof'], pro: 1 },
};
const BIZ_SVC = { hair: ["tiệm làm tóc", "chủ tiệm làm tóc"], mechanic: ["tiệm sửa xe", "chủ tiệm sửa xe"], electric: ["cơ sở thi công điện", "chủ cơ sở thi công điện"], artisan: ["xưởng thủ công", "chủ xưởng thủ công"], care: ["trung tâm chăm sóc", "chủ trung tâm chăm sóc"] };
const bizFitYears = k => { const xp = expMap(); return BIZ_K[k].fit.reduce((t, j) => t + ((xp[j] && xp[j][0]) || 0), 0); };
const bizFit = k => bizFitYears(k) >= 3;
const bizSvcJob = () => { const xp = expMap(); let b = null, y = 0; for (const j in BIZ_SVC) if (xp[j] && xp[j][0] > y) { b = j; y = xp[j][0]; } return b; };
const SHOP_V = {
  grocer: { n: "tiệm tạp hóa nhỏ", t: "chủ tiệm tạp hóa", w: () => 1.2 },
  conv: { n: "cửa hàng tiện lợi", t: "chủ cửa hàng tiện lợi", w: c => convOK(c) ? 1.2 : 0 },
  clothes: { n: "cửa hàng quần áo", t: "chủ cửa hàng quần áo", w: () => 1 },
  phone: { n: "cửa hàng điện thoại", t: "chủ cửa hàng điện thoại", w: () => eraBefore(2003) ? 0 : 0.8 },
  flower: { n: "tiệm hoa", t: "chủ tiệm hoa", w: c => S.urban && c.ppp >= 6000 ? 0.5 : 0 },
  hardware: { n: "cửa hàng ngũ kim", t: "chủ cửa hàng ngũ kim", w: () => 0.5 },
  stationery: { n: "tiệm văn phòng phẩm", t: "chủ tiệm văn phòng phẩm", w: () => 0.4 },
};
const FOOD_V = {
  rest: { n: "quán ăn nhỏ", t: "chủ quán ăn", w: () => 1.5 },
  cafe: { n: "quán cà phê", t: "chủ quán cà phê", w: c => S.urban && c.ppp >= 10000 && !eraBefore(2000) ? 1.2 : 0 },
  bakery: { n: "tiệm bánh", t: "chủ tiệm bánh", w: c => c.ppp >= 5000 ? 0.6 : 0 },
  chicken: { n: "quán gà rán", t: "chủ quán gà rán", w: c => c.id === 'KOR' && !eraBefore(1990) ? 1.2 : 0 },
  snack: { n: "quán ăn vặt", t: "chủ quán ăn vặt", w: c => c.id === 'KOR' ? 0.8 : 0 },
};
const BIZ_V = { shop: SHOP_V, food: FOOD_V };
function bizVarPick(k) { const V = BIZ_V[k], c = C(), w = {}; for (const v in V) { const x = V[v].w(c); if (x > 0) w[v] = x; } return wpick(w); }
const bizVarOf = k => { const V = BIZ_V[k]; if (!V) return null; const v = S.job === 'owner' && S.flags.bizK === k ? S.flags.bizV : S.flags.bizVo && S.flags.bizVo[k]; return V[v] || null; };
const bizName = k => { const j = k === 'service' ? bizSvcJob() : null, v = bizVarOf(k); return j ? BIZ_SVC[j][0] : v ? v.n : BIZ_K[k].n; };
function bizLabel(k) {
  if (BIZ_K[k] && BIZ_K[k].lb) return BIZ_K[k].lb;
  const v = bizVarOf(k); if (v) return L`${eul(v.n)} 연다`;
  if (k === 'transport') return L`${eul(BIZ_K[k].n)} 차린다`; if (k === 'build') return L`${eul(BIZ_K[k].n)} 차린다`;
  if (k === 'food') return "Mở một quán ăn nhỏ"; if (k === 'shop') return "Mở một cửa hàng trong xóm"; if (k === 'online') return "Bắt đầu bán hàng trực tuyến";
  if (k === 'workshop') return "Lập một xưởng sản xuất nhỏ"; if (k === 'agri') return "Bắt đầu thu mua và bán nông sản";
  const j = bizSvcJob(); return j ? L`${eul(BIZ_SVC[j][0])} 연다` : "Mở một tiệm làm dịch vụ bằng tay nghề của mình";
}
function bizKinds(n) {
  const c = C(), ok = Object.keys(BIZ_K).filter(k => !(BIZ_K[k].pro || BIZ_K[k].skill) || bizFit(k)).filter(k => k !== 'service' || bizSvcJob()).filter(k => k !== 'online' || (c.net >= 60 && S.urban && !eraBefore(2000))).filter(k => k !== 'agri' || !S.urban || bizFit('agri'));
  S.flags.bizVo = { shop: bizVarPick('shop'), food: bizVarPick('food') };
  const fit = ok.filter(bizFit), rest = ok.filter(k => !fit.includes(k));
  const rank = k => (BIZ_K[k].fit.includes(S.job) ? 4 : 0) + (BIZ_K[k].pro ? 2 : 0) + Math.min(1.5, bizFitYears(k) / 20) + rnd() * 0.5;
  const rk = {}; fit.forEach(k => { rk[k] = rank(k); });
  const out = fit.sort((x, y) => rk[y] - rk[x]).slice(0, 2);
  while (out.length < n && rest.length) out.push(rest.splice(Math.floor(rnd() * rest.length), 1)[0]);
  return out;
}
const bizStaffN = () => S.job !== 'owner' ? 0 : rankOf('owner') >= 1 || S.flags.bizBig ? 2 : S.flags.bizStaff > 0 ? 1 : 0;
const ownStaffTag = () => S.job !== 'owner' || rankOf('owner') >= 1 ? '' : S.flags.bizBig ? " · nhiều nhân viên" : S.flags.bizStaff > 0 ? " · 1 nhân viên" : '';
function bizOpKind() {
  const k = S.flags.bizK || 'shop', w = { ad: 1, slump: 0.9 };
  const cut = S.flags.bizCut != null ? S.age - S.flags.bizCut : 99, solo = S.flags.bizSolo != null ? S.age - S.flags.bizSolo : 99;
  if (!bizStaffN() && cut >= 3) w.hire = 1.1 * (solo < 6 ? 0.2 : 1);
  if (S.urban && (k === 'food' || k === 'shop' || (k === 'service' && bizSvcJob() !== 'electric'))) w.rent = 0.8;
  if (['food', 'workshop', 'service', 'clinic', 'transport', 'build'].includes(k)) w.loan = 0.7;
  if (S.flags.last_bizop != null && S.flags.bizOpK && w[S.flags.bizOpK]) w[S.flags.bizOpK] *= 0.3;
  return wpick(w);
}
const bizFamHelp = () => (S.fam.married && S.fam.partner && S.fam.partner.alive) || S.fam.kids.some(k => k.alive && S.age - k.bornAt >= 15 && !k.grown);
const bizFamFund = () => !famCanHelp() || S.age > 50 ? 0 : S.flags.rich ? 1 : S.q === 5 ? 0.6 : S.q === 4 ? 0.3 : 0;
const bizRoom = () => creditFormal(C()) ? Infinity : Math.max(0, S.money) + Math.max(0, creditLimit() - Math.max(0, -S.money));
function bizStart(k, fund) {
  const K = BIZ_K[k], cost = S.flags.bizBase * K.cost, want = cost * (fund === 'save' ? 0.4 : fund === 'partner' ? 0.5 : 1);
  const room = fund === 'save' ? Infinity : bizRoom(), g = fund === 'fam' ? cost * (bizFamFund() || 0.3) : 0, spent = Math.min(want, room + g), small = fund === 'save' || spent < want;
  if (fund === 'fam') { S.money += g; book("Vốn kinh doanh bố mẹ góp thêm", g); book("Kinh doanh", -g); S.flags.bizFam = S.age; }
  S.money -= spent;
  const svc = k === 'service' ? bizSvcJob() : null, nm = bizName(k), vr = bizVarOf(k), title = svc ? BIZ_SVC[svc][1] : vr ? vr.t : K.t;
  const r = rnd() + K.start + (bizFit(k) ? 0.08 : 0) + clamp((S.st.sm - 50) / 500, -0.06, 0.06) + (S.flags.retBiz >= S.age ? 0.06 : 0) + (fund === 'partner' ? 0.03 : 0);
  if (r <= 0.3) {
    S.flags.bizFail = S.age; S.flags.bizK = null; S.flags.bizPt = 0; eff({ h: -12 });
    if (isWorking()) S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0;
    return { t: fund === 'save' ? L`${iga(nm)} 1년을 버티지 못하고 문을 닫았습니다. 모은 돈을 잃었고, 다시 일자리를 찾아야 합니다. (−${wonStr(spent)})` : fund === 'fam' ? L`${iga(nm)} 1년을 버티지 못하고 문을 닫았습니다. 부모님이 보태 준 돈을 잃었고, 다시 일자리를 찾아야 합니다. (−${wonStr(spent)})` : fund === 'partner' ? L`${iga(nm)} 1년을 버티지 못하고 문을 닫았습니다. 동업자와 손실을 나눴고, 다시 일자리를 찾아야 합니다. (−${wonStr(spent)})` : L`${iga(nm)} 1년을 버티지 못하고 문을 닫았습니다. 빚이 남았고, 다시 일자리를 찾아야 합니다. (−${wonStr(spent)})`, k: 'bad' };
  }
  S.flags.ownFrom = ownFromNow(); S.job = 'owner'; S.jobY = 0; S.formal = false; S.flags.ownT = title; setRank('owner', 0); S.yearMark = 'job';
  S.flags.bizK = k; S.flags.bizE = 0; S.flags.bizV = S.flags.bizVo && S.flags.bizVo[k] || null; S.flags.bizKx = null; S.flags.bizWarn = S.flags.bizWarnE = null; S.flags.bizPt = fund === 'partner' ? 1 : 0; S.flags.bizStaff = 0; S.flags.bizHired = 0; S.flags.bizSolo = null; S.flags.bizCut = null; S.flags.bizBig = 0; S.flags.bizL = 0; S.flags.bizScale = 0;
  if (chance(bizFit(k) ? 0.06 : 0.045)) { S.pct = clamp(Math.max(S.pct, 0.8) + 0.08 + K.pct, 0, 0.99); S.money += spent * 1.5; eff({ h: 10 }); S.flags.bizBig = 1; S.flags.bizHired = 1; return L`${iga(nm)} 크게 자리를 잡았습니다! 직원도 여럿 생겼습니다.`; }
  S.pct = clamp(S.pct + 0.03 + K.pct - (small ? 0.04 : 0), 0.05, 0.95); S.money += spent * 0.6; eff({ h: 4 });
  return fund === 'partner' ? L`동업자와 함께 ${eul(nm)} 시작했습니다. 그럭저럭 굴러갑니다.` : fund === 'fam' ? L`부모님의 도움으로 ${eul(nm)} 시작했습니다. 그럭저럭 굴러갑니다. ${iga(title)} 되었습니다.` : L`${eul(nm)} 시작했습니다. 그럭저럭 굴러갑니다. ${iga(title)} 되었습니다.`;
}
const SSM = { NLD: 2001, BEL: 2003, ESP: 2005, CAN: 2005, ZAF: 2006, NOR: 2009, SWE: 2009, PRT: 2010, ARG: 2010, DNK: 2012, BRA: 2013, FRA: 2013,
  URY: 2013, NZL: 2013, GBR: 2014, USA: 2015, IRL: 2015, COL: 2016, FIN: 2017, DEU: 2017, AUS: 2017, AUT: 2019, TWN: 2019, ECU: 2019, CRI: 2020,
  CHL: 2022, CHE: 2022, CUB: 2022, MEX: 2022, GRC: 2024, THA: 2025, LUX: 2015, PRI: 2015, MLT: 2017, SVN: 2022, EST: 2024 };
const SSC = { DNK: 1989, NOR: 1993, SWE: 1995, NLD: 1998, FRA: 1999, DEU: 2001, FIN: 2002, GBR: 2005, NZL: 2005, CZE: 2006, CHE: 2007, COL: 2007,
  URY: 2008, ECU: 2008, HUN: 2009, AUS: 2009, AUT: 2010, BRA: 2011, IRL: 2011, CHL: 2015, GRC: 2015, ITA: 2016 };
const SS_BAN = new Set(['AFG', 'ARE', 'BDI', 'BFA', 'BGD', 'CMR', 'DZA', 'EGY', 'ERI', 'ETH', 'GHA', 'GIN', 'GMB', 'IDN', 'IRN', 'IRQ', 'JAM', 'KEN',
  'KWT', 'LBN', 'LBR', 'LBY', 'LKA', 'MAR', 'MLI', 'MMR', 'MRT', 'MWI', 'MYS', 'NGA', 'OMN', 'PAK', 'PNG', 'PRK', 'PSE', 'QAT', 'RUS', 'SAU', 'SDN',
  'SEN', 'SLE', 'SOM', 'SSD', 'SYR', 'TCD', 'TGO', 'TKM', 'TUN', 'TZA', 'UGA', 'UZB', 'YEM', 'ZMB', 'ZWE', 'COM', 'GUY', 'MDV', 'SLB', 'SWZ']);
const SS_DECRIM = { IND: 2018, SGP: 2022, BWA: 2019, AGO: 2021, GAB: 2020, NAM: 2024, MOZ: 2015, LSO: 2012, BTN: 2021, MUS: 2023, TTO: 2018 };
const CM18 = { DEU: 2017, DNK: 2017, NLD: 2015, SWE: 2014, NOR: 2018, FIN: 2019, GBR: 2023 };
const cmMinAge = () => { const c = C(); return CM18[c.id] && calYr() >= CM18[c.id] ? 18 : c.p === 'hi' ? 16 : 14; };
const cmVoid = () => { const c = C(); return c.id === 'PHL' && calYr() >= (S.rel === 'M' ? 2023 : 1988); };
const calYr = () => (S.by || NOW_Y) + S.age;
const SS_OK = { FRA: 1791, BEL: 1795, LUX: 1795, NLD: 1811, BRA: 1831, TUR: 1858, MEX: 1871, JPN: 1882, ARG: 1887, ITA: 1890, PER: 1924, POL: 1932, DNK: 1933, URY: 1934,
  ISL: 1940, CHE: 1942, SWE: 1944, GRC: 1951, THA: 1957, CZE: 1962, SVK: 1962, HUN: 1962, GBR: 1967, BGR: 1968, DEU: 1969, CAN: 1969, AUT: 1971, FIN: 1971,
  CRI: 1971, NOR: 1972, MLT: 1973, ESP: 1979, COL: 1981, PRT: 1983, NZL: 1986, ISR: 1988, HKG: 1991, UKR: 1991, EST: 1992, LVA: 1992, IRL: 1993, LTU: 1993,
  SRB: 1994, CHN: 1997, ECU: 1997, AUS: 1997, ZAF: 1998, CHL: 1999, ROU: 2001, USA: 2003, KOR: 1948, TWN: 1945, VNM: 1945, PHL: 1946 };
const SS_MEN = new Set(['GBR', 'HKG', 'IRL', 'DEU', 'NZL', 'AUS', 'SGP', 'UKR', 'EST', 'NOR', 'CHL', 'SRB', 'HUN', 'SWZ', 'GHA', 'SLE', 'GUY', 'JAM', 'KWT',
  'TKM', 'UZB', 'TTO']);
const ssPunished = (c, yr, sex) => !(sex === 'F' && SS_MEN.has(c.id)) && (SS_BAN.has(c.id) || (SS_DECRIM[c.id] && yr < SS_DECRIM[c.id]) || (ssLegal(c, yr) == null && !(SS_OK[c.id] != null && yr >= SS_OK[c.id])));
function ssLegal(c, yr) {
  if (SS_BAN.has(c.id) || (SS_DECRIM[c.id] && yr < SS_DECRIM[c.id])) return null;
  if (SSM[c.id] && yr >= SSM[c.id]) return 'm';
  if (SSC[c.id] && yr >= SSC[c.id]) return 'cp';
  return yr >= 2000 ? 'none' : null;
}
const SS_RATE = { m: 0.0165, cp: 0.012, none: 0.0063 };
const ssLife = () => { if (S.flags.ss == null) { const l = S.age >= 18 ? ssLegal(C(), calYr()) : null; S.flags.ss = l && chance(SS_RATE[l]) ? 1 : 0; } return !!S.flags.ss; };
const BI_RATE = { m: 0.03, cp: 0.02, none: 0.01 }, BI_SS = { m: 0.13, cp: 0.11, none: 0.07 };
const biLife = () => { if (S.flags.bi == null) { const l = S.age >= 18 && !ssLife() ? ssLegal(C(), calYr()) : null; S.flags.bi = l && chance(BI_RATE[l] * (S.sex === 'F' ? 1.3 : 0.7)) ? 1 : 0; } return !!S.flags.bi; };
const candSS = () => { if (ssLife()) return true; if (!biLife()) return false; const l = ssLegal(C(), calYr()); return !!l && chance(S.trans && S.trans.o === 'both' ? 1 - BI_SS[l] : BI_SS[l]); };
const BI_FACT = "Khoảng 5% người trưởng thành ở Mỹ cho biết mình là người song tính. Trong số người song tính đang có bạn đời, 88% sống cùng người khác giới (Gallup 2025, Pew Research Center 2019)";
function orientEarly() {
  const f = S.flags; if (S.isComp || f.ss != null || f.bi != null || f.oHid != null) return;
  const l = ssLegal(B(), calYr() + 6);
  transDraw();
  const T = S.trans;
  if (T && T.o && l) { f.ss = T.o === 'opp' ? 1 : 0; f.bi = T.o === 'both' ? 1 : 0; f.oHid = 0; f.ace = T.o === 'ace' ? 1 : 0; if (f.bi || f.ace) f.oKnow = S.age + ri(1, 6) + (f.ace ? ri(3, 6) : 0); return; }
  if (l) { f.ss = chance(SS_RATE[l]) ? 1 : 0; f.bi = !f.ss && chance(BI_RATE[l] * (S.sex === 'F' ? 1.3 : 0.7)) ? 1 : 0; f.oHid = 0; }
  else { f.ss = 0; f.bi = 0; f.oHid = chance(SS_RATE.m + BI_RATE.m * 0.5) ? 1 : 0; }
  f.ace = !f.ss && !f.bi && !f.oHid && chance(0.01) ? 1 : 0;
  if (f.ace) f.oKnow = S.age + ri(4, 12);
  else if (f.ss || f.bi) f.oKnow = S.age + ri(1, 6) + (l === 'none' ? ri(0, 5) : 0);
  else if (f.oHid) f.oKnow = chance(0.25) ? null : S.age + ri(1, 6) + ri(0, 12);
}
const orientK = () => S.flags.ace ? 0.35 : S.flags.oHid ? 0.6 : 1;
const oParP = () => { const l = ssLegal(S.mig && !famCame() ? B() : C(), calYr()); return l === 'm' ? 0.65 : l === 'cp' ? 0.55 : 0.35; };
function ssWedTell() {
  const f = S.flags, P = S.fam.partner; if (!P || !P.ss || S.trans || S.isComp) return true;
  if (f.oTold != null) return f.oTold !== 'hard';
  if (!((S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !farFromNK())) return true;
  if (f.oQuiet != null) return false;
  f.ssWedQ = { a: S.age, h: 0 }; return 'ask';
}
const ssWedOpen = () => { if (!S.flags.ssWedQ || S.pending || S.phase !== 'life') return; openDecision('sswed'); if (S.flags.ssWedQ && !(S.pending && S.pending.id === 'sswed')) S.flags.ssWedQ = null; };
const ssWedLater = () => { if (S.flags.ssWedQ && !S.pending && !S.queue.some(e => e.id === 'sswed')) queue(Math.min(0.97, S.t + 0.02), 'dec', 'sswed', {}); };
function orientYear(a) {
  if (S.isComp) return;
  if (a === 12) orientEarly();
  const f = S.flags; if (f.oKnow == null) return;
  const hc = hereC(), l = ssLegal(hc, calYr()), F = S.sex === 'F', par = () => (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !farFromNK();
  if (f.oHid && ssLegal(C(), calYr()) && a > f.oKnow && a >= 18 && !(S.fam.married && S.fam.partner && S.fam.partner.alive) && !S.fam.dating) {
    f.oHid = 0; f.ss = chance(0.55) ? 1 : 0; f.bi = f.ss ? 0 : 1;
    log("Bạn nhận ra rằng ở nơi này, bạn không cần phải giấu việc mình yêu ai. Bạn quyết định từng chút một mở lòng với những cảm xúc đã chôn giấu bấy lâu.", 'warm');
    f.oNever = null; if (f.oPar == null && f.oTold == null && chance(0.8 * (f.bi ? 0.5 : 1))) f.oPar = a + ri(1, 5);
    return;
  }
  if (a === f.oKnow) {
    if (f.ace) { log("Mỗi lần bạn bè kể chuyện thích ai đó, bạn nhận ra mình không thật sự cảm thấy sức hút như thế. Biết rằng cũng có những người như vậy, bạn thấy nhẹ lòng.", 'ev', "Ước tính khoảng 1% số người ít hoặc không cảm thấy sức hút tình dục với bất kỳ ai (Bogaert 2004)"); return; }
    const wed = S.fam.married && S.fam.partner && S.fam.partner.alive && !S.fam.partner.ss;
    if (f.bi) log(wed ? "Mãi sau này bạn mới nhận ra mình có thể rung động với cả nam lẫn nữ. Bạn lặng lẽ giữ điều đó cho riêng mình." : !l ? "Bạn nhận ra mình có thể rung động với cả nam lẫn nữ. Bạn quyết định không nói với ai." : "Bạn nhận ra mình có thể rung động với cả nam lẫn nữ. Thật khó để gọi tên cảm xúc ấy, nhưng bạn cũng hiểu rằng đó không phải là điều gì kỳ lạ.", 'ev');
    else if (wed) log("Chỉ sau khi kết hôn, bạn mới nhận ra trái tim mình hướng về người cùng giới. Bạn không thể nói với ai, đành chôn chặt trong lòng.", 'ev');
    else if (!l) { const away = hc.id !== S.born, yr = calYr(), pun = ssPunished(hc, yr, S.sex), men = !pun && ssPunished(hc, yr, 'M');
      log(pun ? (away ? L`같은 성별의 사람에게 마음이 끌린다는 것을 알게 되었습니다. ${eun(hc.ko)} 법으로 처벌하는 일이라, 그 마음을 깊이 숨겼습니다.` : "Bạn nhận ra mình rung động với người cùng giới. Ở đất nước này, pháp luật trừng phạt điều đó, nên bạn giấu thật kín trong lòng.")
        : men ? (away ? L`같은 성별의 사람에게 마음이 끌린다는 것을 알게 되었습니다. ${hc.ko}의 법이 처벌하는 것은 남자들 사이의 관계뿐이었지만, 그런 마음을 드러내고 사는 여자는 거의 없어 깊이 숨겼습니다.` : "Bạn nhận ra mình rung động với người cùng giới. Pháp luật ở đất nước này chỉ trừng phạt quan hệ giữa nam giới với nhau, nhưng hầu như chẳng người phụ nữ nào sống công khai như vậy, nên bạn giấu thật kín trong lòng.")
        : away ? L`같은 성별의 사람에게 마음이 끌린다는 것을 알게 되었습니다. ${hc.ko}에서도 그런 마음을 드러내고 사는 사람이 거의 없던 때라, 깊이 숨겼습니다.` : "Bạn nhận ra mình rung động với người cùng giới. Thời ấy hầu như chẳng ai sống công khai như vậy, nên bạn giấu thật kín trong lòng.",
        'ev', pun ? "Có hơn 60 quốc gia trừng phạt quan hệ đồng giới bằng luật pháp (ILGA World 2024)" : null); }
    else if (l === 'none') log("Bạn nhận ra mình rung động với người cùng giới. Xung quanh chẳng ai nói về chuyện ấy, nên bạn đã một mình suy nghĩ rất lâu.", 'ev', hc.id !== S.born ? ssFact(hc) : null);
    else log(F ? "Bạn nhận ra mình rung động với phụ nữ. Ban đầu bạn thấy bối rối, nhưng dần dần bạn chấp nhận rằng đó cũng là một phần con người mình." : "Bạn nhận ra mình rung động với đàn ông. Ban đầu bạn thấy bối rối, nhưng dần dần bạn chấp nhận rằng đó cũng là một phần con người mình.", 'ev');
    const open = l === 'm' || l === 'cp', bi = f.bi ? 0.5 : 1;
    if (S.trans) return;
    if (!wed && l && chance((open ? 0.9 : 0.5) * bi)) f.oFriend = a + ri(1, 5);
    if (!wed && l && chance((open ? 0.8 : 0.35) * bi)) f.oPar = a + ri(3, 9);
    if (!l || wed) f.oNever = a + ri(12, 20);
    return;
  }
  if (f.oFriend != null && a >= f.oFriend) { f.oFriend = null; eff({ so: 2, h: 2 }); log("Lần đầu tiên bạn tâm sự với người bạn thân nhất. Người bạn ấy cảm ơn vì bạn đã nói ra.", 'warm'); return; }
  if (f.oPar != null && a >= f.oPar) {
    f.oPar = null; if (!par() || f.oTold != null) return;
    if (chance(oParP())) { f.oTold = 'ok'; eff({ h: 4, so: 3 }); log(L`${parW()}께 내가 누구를 사랑하는 사람인지 말씀드렸습니다. 한참 말이 없으시더니 '그래도 넌 내 아이야'라고 하셨습니다.`, 'warm'); }
    else { f.oTold = 'hard'; eff({ h: -4, so: -3 }); f.oLater = a + ri(3, 8); log(homeOthers().mom || homeOthers().dad ? L`${parW()}께 털어놓았지만 받아들이기 어려워하셨습니다. 한동안 한집에서 서로 눈을 피했습니다.` : L`${parW()}께 털어놓았지만 받아들이기 어려워하셨습니다. 한동안 집에 가는 발걸음이 무거웠습니다.`, 'bad'); }
    return;
  }
  if (f.oLater != null && a >= f.oLater) { f.oLater = null; if (par() && chance(0.6)) { f.oTold = 'ok'; eff({ h: 4, so: 3 }); log(S.fam.married && S.fam.partner && S.fam.partner.alive && S.fam.partner.ss ? L`시간이 지나며 ${parW()}께서도 조금씩 마음을 여셨습니다. 명절이면 함께 사는 사람의 안부를 먼저 물어 오셨습니다.` : L`시간이 지나며 ${parW()}께서도 조금씩 마음을 여셨습니다. 다시 예전처럼 웃으며 이야기를 나누게 되었습니다.`, 'warm'); } return; }
  if (f.oNever != null && a >= f.oNever) { f.oNever = null; if (f.oTold == null && chance(0.5)) log("Bạn chưa bao giờ nói được với gia đình. Dẫu vậy, vẫn có vài người bạn hiểu lòng bạn luôn ở bên.", 'ev'); }
}
const TRANS_P = { CAN: [0.207, 0.183, 0.136], GBR: [0.2, 0.2, 0.062], USA: [0.386, 0.36, 0.128] };
const TRANS_GEN = by => by >= 1981 ? 1 : by >= 1966 ? 0.58 : by >= 1946 ? 0.45 : 0.36;
const TRANS_ORI = [['same', 0.21], ['opp', 0.18], ['both', 0.56], ['ace', 0.05]];
const TRANS_OPEN = 1990;
const transLived = () => !!(S && S.trans && S.trans.at != null);
const transB = () => transLived() && S.trans.g !== 'N';
const transNoCarry = () => transB() && S.trans.g === 'M';
const meSex = a => transB() && (a == null ? S.age : a) >= S.trans.at ? S.trans.g : S.sex;
const pubSex = () => transB() ? S.trans.g : S.sex;
const nmSeed = () => (S && S.trans && S.trans.nm0) || (S && S.name && S.name.full) || '';
const transOpen = c => calYr() >= TRANS_OPEN && !SS_BAN.has(c.id);
const TRANS_FACT = c => c.id === 'CAN' ? "Trong cuộc điều tra dân số năm 2021 của Canada, 0,33% người từ 15 tuổi trở lên, tức khoảng 1 trong 300 người, cho biết mình là người chuyển giới hoặc phi nhị nguyên giới. Ở độ tuổi đầu 20, tỷ lệ này là 0,85% (Statistics Canada)"
  : c.id === 'GBR' ? "Trong cuộc điều tra dân số năm 2021 ở Anh và xứ Wales, trong số người từ 16 tuổi trở lên, 48.000 người tự nhận là phụ nữ chuyển giới, 48.000 người là nam giới chuyển giới và 30.000 người là phi nhị nguyên giới (Office for National Statistics)"
  : "Ước tính khoảng 0,5% người trưởng thành ở Mỹ, tức chừng 1,3 triệu người, là người chuyển giới. Ở độ tuổi 13–17, tỷ lệ này là 1,4% (Williams Institute 2022)";
const TRANS_HELP = () => L`도움: Trans Lifeline (미국 877-565-8860, 캐나다 877-330-6366), Switchboard LGBT+ (영국 0800 0119 100)`;
function transDraw() {
  const f = S.flags; if (f.tg0 || S.isComp) return; f.tg0 = 1;
  const r = TRANS_P[B().id]; if (!r) return;
  const k = TRANS_GEN(S.by || NOW_Y) / 100, F = S.sex === 'F';
  const g = chance((F ? r[1] : r[0]) * k) ? (F ? 'M' : 'F') : chance(r[2] * k) ? 'N' : null;
  if (!g) return;
  S.trans = { g, k: chance(0.75) ? ri(13, 19) : chance(0.6) ? ri(20, 29) : ri(30, 50) };
  if (g !== 'N') { let u = rnd(), o = 'both'; for (const [x, w] of TRANS_ORI) { if (u < w) { o = x; break; } u -= w; } S.trans.o = o; }
}
function transYear(a, c) {
  const T = S.trans; if (!T || S.isComp || S.phase !== 'life') return;
  const par = () => (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !farFromNK(), away = S.job === 'prison' || S.serveLeft > 0 || !!S.flags.hideCN;
  if (a === T.k) {
    const open = transOpen(c), y = a < 20;
    const t = T.g === 'N' ? "Bạn nhận ra rằng chỉ một chữ “nam” hay “nữ” không thể nói hết con người mình. Bạn chọn gọi mình là người phi nhị nguyên giới."
      : T.g === 'F' ? (y ? "Từ nhỏ, việc bị gọi là con trai lúc nào cũng giống như mặc một bộ quần áo không vừa. Giờ bạn đã hiểu vì sao: bạn là con gái." : "Bạn đã tìm được lời đáp cho câu hỏi ấp ủ bấy lâu trong lòng: bạn là phụ nữ.")
      : y ? "Từ nhỏ, việc bị gọi là con gái lúc nào cũng giống như mặc một bộ quần áo không vừa. Giờ bạn đã hiểu vì sao: bạn là con trai." : "Bạn đã tìm được lời đáp cho câu hỏi ấp ủ bấy lâu trong lòng: bạn là đàn ông.";
    if (!open) { T.hid = 1; eff({ h: -2 }); }
    logD('trans', open ? t : t + ' ' + "Không tìm thấy nơi nào để bày tỏ lòng mình, bạn giữ kín điều ấy một mình suốt thời gian dài.", 'ev', TRANS_FACT(B()));
    if (chance(0.85)) T.fr = a + ri(1, 3);
    if (a < 30 && chance(0.8)) T.pa = a + ri(1, 5);
    if (chance(T.g === 'N' ? 0.6 : 0.85)) T.lv = Math.max(18, a + ri(1, 6), T.fr != null ? T.fr + ri(0, 2) : 0);
    return;
  }
  if (a < T.k || away) return;
  const open = transOpen(c);
  if (T.fr != null && a >= T.fr && open) { T.fr = null; eff({ so: 2, h: 2 }); logD('trans', "Lần đầu tiên bạn tâm sự với người bạn thân nhất. Người bạn ấy lặng lẽ lắng nghe, rồi hỏi từ giờ bạn muốn được gọi thế nào.", 'warm'); return; }
  if (T.pa != null && a >= T.pa && open) {
    T.pa = null; if (!par()) return;
    const u = rnd();
    if (u < 0.67) { eff({ h: 4, so: 3 }); logD('trans', L`${parW()}께 말씀드렸습니다. 많이 놀라셨지만 '네가 너답게 사는 게 제일이다'라고 하셨습니다.`, 'warm', TRANS_FAM_F()); }
    else if (u < 0.89) { T.pl = a + ri(2, 6); T.plK = 0.7; logD('trans', L`${parW()}께 말씀드렸습니다. 바로 받아들이지는 못하셨지만, 시간을 두고 더 이야기해 보자고 하셨습니다.`, 'ev', TRANS_FAM_F()); }
    else { eff({ h: -4, so: -3 }); T.pl = a + ri(3, 8); T.plK = 0.4; logD('trans', L`${parW()}께 털어놓았지만 받아들이지 못하셨습니다. 한동안 집에 발길을 끊었습니다.`, 'bad', TRANS_HELP()); }
    return;
  }
  if (T.pl != null && a >= T.pl) { const k = T.plK; T.pl = null; T.plK = null; if (par() && chance(k)) { eff({ h: 4, so: 3 }); logD('trans', transB() ? L`시간이 지나며 ${parW()}께서도 조금씩 마음을 여셨습니다. 어느 날부터 새 이름으로 불러 주셨습니다.` : L`시간이 지나며 ${parW()}께서도 조금씩 마음을 여셨습니다. 다시 예전처럼 웃으며 이야기를 나누게 되었습니다.`, 'warm'); } return; }
  if (T.lv != null && a >= T.lv) {
    if (!open) {
      T.lv = calYr() < TRANS_OPEN ? a + (TRANS_OPEN - calYr()) + ri(0, 12) : a + 1;
      if (T.lv > 70) { T.lv = null; T.nv = a + ri(3, 10); }
      return;
    }
    T.lv = null; T.at = a; eff({ h: 6, so: 2 });
    let t;
    if (T.g === 'N') t = "Bạn bắt đầu sống đúng với con người thật của mình, với cách ăn mặc và cách nói chuyện hợp với bạn.";
    else {
      const old = S.name, taken = familyNames(); let n = old;
      for (let i = 0; i < 12; i++) { n = makeName(old.cl || S.cl, T.g, { family: old.base, rel: S.rel }); if (n.g !== old.g && !taken.has(callName(n))) break; }
      T.nm0 = old.full; S.name = n;
      const oc = callName(old); for (const e of S.log) if (e && typeof e.text === 'string' && (e.text.includes(old.full) || e.text.includes(oc))) { e.nf = 1; delete e.act; }
      t = T.g === 'F' ? L`오래 준비한 끝에 여자로 살기 시작했습니다. 스스로 고른 이름 ${ro(callName(n))} 불리게 되었습니다.` : L`오래 준비한 끝에 남자로 살기 시작했습니다. 스스로 고른 이름 ${ro(callName(n))} 불리게 되었습니다.`;
      const P = S.fam.partner; if (T.g === 'M' && S.fam.married && P && P.alive && !P.divorced && P.sex === 'M' && !P.ss) { P.legal = unionOf(P); P.ss = 1; }
    }
    if (T.hid) t = "Thế giới đã đổi khác đôi chút. Giờ đây bạn quyết định bày tỏ những điều đã chôn giấu bấy lâu." + ' ' + t;
    logD('trans', t, 'big', TRANS_LIVE_F());
    const P = S.fam.partner, D = S.fam.dating, who = S.fam.married && P && P.alive && !P.divorced ? callName(P.name) : D ? callName(D.name) : null;
    if (who) logD('trans', L`가장 먼저 ${wa(who)} 오래 이야기를 나눴습니다.`, 'ev');
    if (chance(0.11)) T.wk = a + ri(0, 4);
    if (chance(0.5)) T.hc = a + ri(1, 8);
    if (chance(0.5)) T.cm = a + ri(1, 3);
    return;
  }
  if (T.cm != null && a >= T.cm) { T.cm = null; eff({ so: 3, h: 2 }); logD('trans', "Bạn bắt đầu tham gia một nhóm gồm những người từng đi qua con đường tương tự. Dù mới gặp lần đầu, bạn thấy thoải mái như giữa những người quen đã lâu.", 'warm'); return; }
  if (T.wk != null && a >= T.wk) {
    T.wk = null;
    if (isWorking() && !inOffice() && !['owner', 'farm', 'agbiz', 'herder', 'fisher'].includes(S.job)) { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -5 }); logD('trans', "Sau khi chuyện giới tính của bạn lan ra ở chỗ làm, bầu không khí đổi khác, và chẳng bao lâu sau bạn mất việc.", 'bad', TRANS_JOB_F()); }
    return;
  }
  if (T.hc != null && a >= T.hc) { T.hc = null; eff({ h: -2 }); logD('trans', "Mỗi lần đi khám bệnh, bạn lại phải giải thích đi giải thích lại về tên và giới tính của mình. Nhiều hôm bạn chỉ muốn hoãn việc đi khám.", 'bad', TRANS_MED_F()); return; }
  if (T.nv != null && a >= T.nv) { T.nv = null; logD('trans', "Ngày được sống như thế rốt cuộc chưa bao giờ đến, nhưng vẫn có vài người bạn hiểu lòng bạn ở bên.", 'ev'); }
}
const TRANS_FAM_F = () => "Trong số người trưởng thành chuyển giới có gia đình biết chuyện, 67% cho biết gia đình ủng hộ họ, 12% cho biết không (2022 US Transgender Survey)";
const TRANS_LIVE_F = () => "94% người trưởng thành chuyển giới đã sống theo giới tính của mình cho biết từ đó họ hài lòng với cuộc sống hơn (2022 US Transgender Survey)";
const TRANS_JOB_F = () => "11% người chuyển giới từng đi làm cho biết họ đã từng mất việc vì bản dạng giới của mình (2022 US Transgender Survey)";
const TRANS_MED_F = () => "48% người trưởng thành chuyển giới có đi khám bệnh trong năm qua cho biết đã ít nhất một lần gặp chuyện khó chịu vì là người chuyển giới (2022 US Transgender Survey)";
const unionOf = (P = S.fam.partner) => P && P.ss ? P.legal || 'none' : P && P.cohab ? 'none' : 'm';
const cohabOK = c => S.age >= 18 && !['sa', 'mena'].includes(c.p) && S.rel !== 'M';
const cohabChoice = () => ({ k: 'cohab', label: "Sống chung không kết hôn", sub: "Không đăng ký kết hôn · có thể kết hôn sau" });
const legalWed = () => unionOf() === 'm';
const LIVEIN_C = { PHL: { auto: 0.5, wed: 0.9, kid: 0.55, kidWed: 0.65 } };
const cohabAutoP = c => LIVEIN_C[c.id] ? LIVEIN_C[c.id].auto : nonMarital(c) * 0.5;
const PHL_LIVE_F = () => "Ở Philippines, tỷ lệ phụ nữ 15–49 tuổi chung sống với bạn đời mà không kết hôn đã tăng từ 5% năm 1993 lên 19% năm 2022 (Khảo sát Nhân khẩu học và Sức khỏe Quốc gia Philippines)";
const PHL_BIRTH_F = () => "Ở Philippines, 58% số trẻ được đăng ký khai sinh năm 2022 có bố mẹ không kết hôn (Cơ quan Thống kê Philippines)";
const SS_COURT = {
  USA: [2015, "Năm 2015, phán quyết Obergefell kiện Hodges của Tòa án Tối cao đã công nhận hôn nhân cùng giới ở mọi bang."],
  TWN: [2017, "Năm 2017, Giải thích số 748 của Tư pháp viện xác định quy định trong bộ luật dân sự ngăn cấm hôn nhân cùng giới là vi hiến, và năm 2019 luật được sửa đổi, lần đầu tiên ở châu Á."],
  ZAF: [2005, "Năm 2005, Tòa án Hiến pháp phán quyết rằng việc ngăn cấm hôn nhân cùng giới là vi hiến (vụ Fourie), và luật được sửa đổi vào năm sau."],
  BRA: [2011, "Năm 2011, Tòa án Liên bang Tối cao công nhận “kết hợp ổn định” của các cặp đôi cùng giới, và năm 2013, nghị quyết của Hội đồng Tư pháp Quốc gia đã cho phép họ kết hôn."],
  MEX: [2015, "Năm 2015, Tòa án Tối cao xác định các luật bang ngăn cấm hôn nhân cùng giới là vi hiến, và đến năm 2022, các cặp đôi đã có thể kết hôn ở mọi bang."],
  COL: [2016, "Phán quyết năm 2016 của Tòa án Hiến pháp đã công nhận hôn nhân cùng giới."],
  ECU: [2019, "Phán quyết năm 2019 của Tòa án Hiến pháp đã công nhận hôn nhân cùng giới."],
  CRI: [2018, "Năm 2018, Phòng Hiến pháp của Tòa án Tối cao phán quyết luật cấm kết hôn là vi hiến, và từ năm 2020 các cặp đôi đã có thể kết hôn."],
  AUT: [2017, "Năm 2017, Tòa án Hiến pháp xác định luật chỉ giới hạn hôn nhân giữa nam và nữ là vi hiến, và từ năm 2019 các cặp đôi đã có thể kết hôn."],
  ITA: [2015, "Năm 2015, Tòa án Nhân quyền châu Âu phán quyết rằng việc không bảo vệ các cặp đôi cùng giới bằng luật pháp là vi phạm nhân quyền (vụ Oliari kiện Ý), và năm 2016 chế độ kết hợp dân sự ra đời."],
  IND: [2018, "Năm 2018, Tòa án Tối cao đã bãi bỏ Điều 377 Bộ luật Hình sự vốn trừng phạt quan hệ đồng giới (phán quyết Navtej Singh Johar). Năm 2023, tòa phán quyết rằng việc hôn nhân là do Quốc hội quyết định."],
  KOR: [2024, "Năm 2024, Hội đồng toàn thể Tòa án Tối cao phán quyết rằng bạn đời cùng giới cũng có thể là người phụ thuộc trong bảo hiểm y tế, nhưng hôn nhân vẫn chưa được công nhận."],
  JPN: [2024, "Từ năm 2024, nhiều tòa án cấp cao đã phán quyết rằng luật không công nhận hôn nhân cùng giới là vi hiến, nhưng luật vẫn chưa thay đổi."],
  BWA: [2019, "Năm 2019, Tòa án Cấp cao đã bãi bỏ luật trừng phạt quan hệ đồng giới, và năm 2021 Tòa Phúc thẩm đã giữ nguyên phán quyết này."],
  NAM: [2024, "Năm 2024, Tòa án Cấp cao đã bãi bỏ luật vốn trừng phạt quan hệ đồng giới."],
};
const ssCourt = c => { const r = SS_COURT[c.id], y = calYr(); return (r && y >= r[0] ? ' ' + r[1] : '') + (c.id === 'JPN' && y >= 2015 ? ' ' + (y >= 2025 ? "Năm 2025, các chính quyền địa phương nơi 92,5% dân số Nhật Bản sinh sống cấp giấy chứng nhận quan hệ đối tác cho các cặp cùng giới. Giấy này không có hiệu lực pháp lý như hôn nhân (Nijiiro Diversity và quận Shibuya, 2025)." : "Bắt đầu từ quận Shibuya và Setagaya năm 2015, nhiều chính quyền địa phương đã cấp giấy chứng nhận quan hệ đối tác cho các cặp cùng giới. Giấy này không có hiệu lực pháp lý như hôn nhân.") : ''); };
const ssFact = c => { const l = ssLegal(c, calYr()), ct = ssCourt(c);
  if (ct && l === 'm') return L`${c.ko}에서는 ${SSM[c.id]}년부터 같은 성별의 두 사람도 결혼할 수 있습니다.` + ct;
  if (ct && l === 'cp') return L`${c.ko}에서는 같은 성별의 두 사람이 결혼할 수는 없지만, ${SSC[c.id]}년부터 동반자로 등록할 수 있습니다.` + ct;
  return (l === 'm' ? L`${c.ko}에서는 ${SSM[c.id]}년부터 같은 성별의 두 사람도 결혼할 수 있습니다` : l === 'cp' ? L`${c.ko}에서는 같은 성별의 두 사람이 결혼할 수는 없지만, ${SSC[c.id]}년부터 동반자로 등록할 수 있습니다`
    : L`${c.ko}에서는 같은 성별의 두 사람이 결혼할 수 없습니다. 같은 성별의 결혼을 법으로 인정하는 나라는 2025년 기준 40곳 가까이 됩니다 (Pew Research Center)`) + ssCourt(c); };
function wedLine(again) {
  const u = unionOf(), who = callName(S.fam.partner.name);
  const pk = S.flags.pkWed === S.age && S.flags.pkLine ? ' ' + S.flags.pkLine : '';
  const P = S.fam.partner, far = S.flags.wedFar === S.age && P.lb && CBY[P.lbIn] ? CBY[P.lbIn].ko : '';
  if (far) return (u !== 'm' ? L`${wa(who)} 앞으로 함께 살기로 약속했습니다.` : again ? "Bạn đã tái hôn!" : "Bạn đã kết hôn!") + ' ' + (S.flags.irreg != null || !tripOutOK() ? L`${eun(who)} ${far}에서 함께 살 날을 기다리기로 했습니다.` : L`${far}에 다녀와 식을 올렸습니다. ${eun(who)} 그곳에서 함께 살 날을 기다리기로 했습니다.`) + pk;
  return (u === 'none' ? L`${wa(who)} 함께 살기 시작했습니다!` : u === 'cp' ? L`${wa(who)} 동반자로 등록하고 함께 살기 시작했습니다!` : again ? "Bạn đã tái hôn!" : "Bạn đã kết hôn!") + pk;
}
const pkAges = as => listAnd(as.map(String));
const skKids = () => S.fam.married && S.fam.partner && S.fam.partner.alive ? S.fam.kids.filter(k => k.alive && k.sk && !k.away && !k.grown && S.age - k.bornAt < 18) : [];
const wedChoice = l => l === 'm' && wedBlocked() ? { k: 'yes', label: "Về sống chung", sub: "Cuộc hôn nhân với người bạn đời trước vẫn còn hiệu lực về mặt pháp lý" } : l === 'none' ? { k: 'yes', label: "Về sống chung", sub: "Hôn nhân không được pháp luật công nhận" } : l === 'cp' ? { k: 'yes', label: "Đăng ký là bạn đời", sub: "Không phải hôn nhân hợp pháp" } : { k: 'yes', label: "Kết hôn", sub: "Quan hệ↑ Hạnh phúc↑" };
function ssYear(c) {
  const f = S.fam, P = f.partner;
  if (!f.married || !P || !P.alive || !P.ss || P.legal === 'm' || S.job === 'prison') return;
  const l = ssLegal(c, calYr());
  if (l === 'cp' && P.legal !== 'cp' && chance(0.4)) { P.legal = 'cp'; eff({ h: 3 }); log(L`법이 바뀌어 ${wa(callName(P.name))} 동반자로 등록했습니다.`, 'big', ssFact(c)); }
  else if (l === 'm' && chance(0.35)) { P.legal = 'm'; eff({ h: 6, so: 4 }); S.yearMark = 'love'; log(L`법이 바뀌어 ${wa(callName(P.name))} 마침내 결혼식을 올렸습니다.`, 'big', ssFact(c)); }
}
const ssDonor = () => { const P = S.fam.partner, c = C(); return S.sex === 'F' && P && P.sex === 'F' && unionOf() !== 'none' && c.ppp >= 15000 && Math.min(S.age, P.age) < 43; };
const SURRO = { USA: [1995, 3], CAN: [2004, 1.5], GBR: [2010, 1.2], ISR: [2022, 2] };
const ssSurro = () => { const P = S.fam.partner, c = C(), r = SURRO[c.id]; return !!r && S.sex === 'M' && !!P && P.sex === 'M' && unionOf() !== 'none' && calYr() >= r[0] && Math.min(S.age, P.age) < 50; };
const ssKidWays = () => ssDonor() || ssSurro() || (unionOf() === 'm' && adoptOK());
function ptBrings(P, cand, c) {
  const med0 = incomeAt(c, 0.5), yrs = clamp((P.age - 22) / 10, 0.1, 3), base = Math.max(P.inc || 0, med0 * 0.2);
  const negP = (P.age < 35 ? 0.2 : P.age < 45 ? 0.1 : 0.06) * (c.id === 'USA' ? 1 : ['KOR', 'JPN', 'TWN'].includes(c.id) ? 0.35 : c.p === 'hi' ? 0.6 : c.p === 'eca' || c.p === 'lac' ? 0.7 : 0.5);
  return chance(negP) ? -base * (0.1 + rnd() * 0.7) * (c.id === 'USA' && P.age < 35 ? 1.5 : 1)
    : base * yrs * (0.05 + rnd() * 1.1) * (cand.q >= 4 ? 1.3 : cand.q <= 1 ? 0.6 : 1);
}
function ptNwT(cand, c, age) {
  if (!cand || cand.q == null) return '';
  const same = cand.sex === S.sex, who = callName(cand.name);
  if (cand.nw0 == null || cand.nw0a !== S.age) {
    cand.nw0a = S.age;
    const P = { age: Math.max(18, age != null ? age : cand.age), sex: cand.sex, base: pBase(cand.q, cand.sex, same), k: same ? 0.8 : cand.sex === 'F' ? (['sa', 'mena'].includes(c.p) ? 0.3 : 0.75) : 0.95, dev: 0, mp: 0, job: cand.job, ss: same ? 1 : 0 };
    P.inc = partnerPay(P); cand.nw0 = ptBrings(P, cand, c);
  }
  const x = cand.nw0, med0 = incomeAt(c, 0.5), pa = age != null ? age : cand.age;
  return ' ' + (Math.abs(x) <= med0 * 0.05 ? L`${who}에게는 모아 둔 돈도 빚도 거의 없습니다.` : x > 0 ? L`${who}에게는 모아 둔 돈이 약 ${wonStr(x)} 있습니다.` : pa < 45 ? L`${who}에게는 학자금이나 할부 같은 빚이 약 ${wonStr(-x)} 있습니다.` : L`${who}에게는 대출이나 할부 같은 빚이 약 ${wonStr(-x)} 있습니다.`);
}
function marry(early, o = {}) {
  S.flags.ptNo = 0;
  const c = C();
  let cand = S.flags.cand;
  if (wedBlocked() && !(cand && cand.name && cand.name.full === S.flags.phlSep)) o = Object.assign({}, o, { cohab: true });
  else if (cand && cand.name && cand.name.full === S.flags.phlSep) S.flags.phlSep = null;
  if (!cand) { const psex = S.sex === 'M' ? 'F' : 'M', G = Math.round(coupleGap(c)), ct0 = casteCand(true); cand = { name: partnerName(S.cl, psex, { rel: S.rel === 'S' ? 'S' : undefined, family: ct0 ? casteSurBut(ct0.g, S.cl, S.name && S.name.base) : undefined }), ct: ct0 ? ct0.g : undefined, cx: ct0 && ct0.x ? 1 : undefined, age: S.age + (psex === 'M' ? ri(Math.max(3, G - 2), Math.max(8, G + 5)) : -ri(1, 5)), sex: psex, q: S.q };
    if (early && psex === 'M' && chance(Math.min(0.5, polyRate(c, S.rel) * polyMe() * 0.55))) { cand.age = S.age + G + ri(5, 15); cand.co = { name: freshName(S.cl, 'F'), age: Math.max(18, cand.age - ri(0, 9)), kids: ri(0, 4) }; } }
  const same = cand.sex === S.sex;
  pastPartner();
  S.fam.partner = { name: cand.name, age: Math.max(18, cand.age), sex: cand.sex, alive: true, base: pBase(cand.q, cand.sex, same), k: same ? 0.8 : cand.sex === 'F' ? (['sa', 'mena'].includes(c.p) ? 0.3 : 0.75) : 0.95, dev: 0, home: c.id, mp: 0 };
  if (cand.sex === S.sex || (transNoCarry() && cand.sex === 'M')) { S.fam.partner.ss = 1; S.fam.partner.legal = ssLegal(c, calYr()) || 'none'; }
  else if (o.cohab) S.fam.partner.cohab = 1;
  if (cand.job) S.fam.partner.job = cand.job;
  if (cand.deg) S.fam.partner.uni = 1;
  if (cand.nat) S.fam.partner.nat = cand.nat;
  if (cand.far && cand.far !== S.cur && CBY[cand.far] && S.mig) { const P = S.fam.partner; P.lb = 1; P.lbIn = cand.far; P.home = cand.far; S.flags.famWait = S.flags.famWait || { at: S.age, from: cand.far }; S.flags.wedFar = S.age; }
  if (cand.ct) { S.fam.partner.ct = cand.ct; if (cand.cx) S.fam.partner.cx = 1; }
  S.fam.partner.rel = cand.rel || S.rel;
  S.fam.partner.inc = partnerPay(S.fam.partner);
  ptRetAtStart(S.fam.partner, c, cand.pen);
  if (!early) {
    const med0 = incomeAt(c, 0.5), nw = cand.nw0 != null && cand.nw0a === S.age ? cand.nw0 : ptBrings(S.fam.partner, cand, c);
    if (Math.abs(nw) > med0 * 0.05) S.flags.ptNw = (S.flags.ptNw || 0) + nw;
    S.flags.ptIn = Math.abs(nw) > med0 * 0.05 ? nw : 0;
  } else S.flags.ptIn = 0;
  S.flags.nwWed = netWorth(); S.flags.sepM = 0;
  if (S.flags.exD && callName(S.flags.exD.name) === callName(cand.name)) S.flags.exD = null;
  if (S.flags.exP && callName(S.flags.exP.name) === callName(cand.name)) {
    S.flags.exP = null; if (S.flags.exNm && S.flags.exNm.n === callName(cand.name)) S.flags.exNm = null;
    for (const k of S.fam.kids) if (k.alive && k.away && k.ra && !k.placed && !k.sk && !k.grown && S.age - k.bornAt < 18 && (!k.awayIn || k.awayIn === S.cur)) { k.away = 0; k.ra = 0; k.awayIn = 0; k.lostAt = null; }
    for (const k of S.fam.kids) { if (k.cust) k.cust = 0; if (k.hd) k.hd = 0; } S.flags.custody = null;
    for (const k of S.fam.kids) if (k.sk && k.exOf === cand.name.full) { if (k.cut) { k.cut = null; k.alive = true; } k.exOf = null; k.step = k.pm = (S.fam.marriages || 0) + 1; if (k.away && !k.grown && S.age - k.bornAt < 18) k.away = 0; }
  }
  S.fam.married = true; S.fam.marriedAt = S.age; anvReset(); S.flags.cand = null; S.fam.dating = null; S.flags.meetAt = null; if (S.fam.widowed || S.fam.marriages) S.flags.remarried = 1; S.fam.widowed = false; S.fam.marriages = (S.fam.marriages || 0) + 1;
  const stepk = S.fam.kids.filter(k => k.alive && !k.away && S.age - k.bornAt < 16 && !k.grown && !(k.op && k.op.full === cand.name.full));
  if (S.flags.ipv === 'on') S.flags.ipv = 'over';
  if (S.fam.marriages > 1 && stepk.length) { for (const k of stepk) k.step = S.fam.marriages; S.flags.stepAt = S.age + ri(1, 2); }
  if (cand.pk && cand.pk.length) {
    const P = S.fam.partner, pcl = (P.name && P.name.cl) || S.cl, N = NAMES[pcl] || NAMES.en, gone = cand.pkAt != null ? Math.max(0, S.age - cand.pkAt) : 0, home = [];
    const taken = familyNames();
    for (const x of cand.pk) {
      const age = x.age + gone, mk = () => makeName(pcl, x.sex, { family: P.sex === 'M' && N.o !== 'pat' && N.o !== 'bin' ? P.name.base : null, father: P.sex === 'M' ? P.name.g.split(' ')[0] : undefined, kid: 1 });
      let nm = mk(); for (let t = 0; t < 12 && taken.has(callName(nm)); t++) nm = mk();
      taken.add(callName(nm));
      const k = { name: nm, sex: x.sex, bornAt: S.age - age, alive: true, sk: 1, step: S.fam.marriages, pm: S.fam.marriages, bd: -8 };
      if (age >= 18) { k.grown = 1; k.ap = 1; } else home.push(callName(nm));
      S.fam.kids.push(k);
    }
    if (home.length) { S.flags.pkWed = S.age; S.flags.pkLine = L`배우자의 아이 ${wa(listAnd(home))} 한 식구가 되었습니다.`; S.flags.skAt = S.age + 1; }
  }
  S.fam.co = cand.co ? { name: cand.co.name, age: cand.co.age, kids: cand.co.kids || 0, home: 1, senior: 1, at: S.age } : null;
  if (S.fam.co) S.flags.poly = 2;
  if (chance(Math.min(0.4, hivPrev(c) * 1.1))) S.fam.partner.hiv = { at: S.age - ri(0, 6), known: false, art: false };
  const wedding = incomeAt(c, 0.5) * (c.p === 'sa' ? 1.2 : 0.4) * ({ m: 1, cp: 0.4, none: 0.15 })[unionOf()];
  S.money -= wedding * (early ? 0.2 : 1);
  const parOk = early || unionOf() !== 'm' || ssWedTell();
  if (!early && S.age < 45 && famCanHelp() && unionOf() === 'm' && parOk) {
    const help = wedding * (S.flags.rich ? 1 : [0, 0.05, 0.2, 0.4, 0.6, 0.8][S.q]);
    if (help > incomeAt(c, 0.5) * 0.03) { if (parOk === 'ask') S.flags.ssWedQ.h = help; else { S.money += help; log(L`부모님이 혼례 비용 가운데 ${wonStr(help)}을 보태 주셨습니다.`, 'warm'); } }
  }
  if (S.flags.royal === 'r' && !early) log(S.born === 'JPN' && S.sex === 'F' ? "Vì kết hôn với người không thuộc hoàng tộc, bạn đã rời khỏi hoàng tộc." : "Trước khi cưới, bạn phải được các bậc bề trên trong gia tộc cho phép. Sau nhiều lần bàn bạc, cuối cùng họ cũng đồng ý.");
  eff({ h: early ? 0 : 10, so: 10 }); S.yearMark = 'love';
  if (!early && S.sex === 'M' && S.caste && S.caste.g === 'sc' && casteHome() && !S.urban && calYr() >= 1990 && chance(0.05)) log("Vào ngày cưới, khi bạn cưỡi ngựa đi qua đường làng, vài người đã chặn đường. Chỉ khi cảnh sát đến, đoàn rước mới đi qua được.", 'bad', CASTE_F.IND);
  if (!early) faithWed();
}
function faithWed() {
  const P = S.fam.partner; if (!P || P.ss) return;
  const me = S.rel, you = P.rel || me, who = callName(P.name); if (me === you || me === 'N' || you === 'N') return;
  const man = S.sex === 'M', book = r => r === 'C' || r === 'J';
  if (you === 'M' || me === 'M') {
    const meM = me === 'M';
    if (meM && man) { if (book(you)) log("Vợ bạn vẫn giữ đức tin của mình khi kết hôn."); else if (chance(0.6)) { P.rel = 'M'; log(L`결혼에 앞서 ${iga(who)} 이슬람으로 개종했습니다.`); } else log("Vợ bạn vẫn giữ đức tin của mình khi kết hôn. Các bậc bề trên hai bên gia đình buồn lòng suốt một thời gian dài."); return; }
    if (meM && !man) { P.rel = 'M'; log(L`결혼에 앞서 ${iga(who)} 이슬람으로 개종했습니다. 이름을 새로 하나 더 얻었습니다.`); return; }
    if (man || !book(me)) { queue(Math.min(0.97, S.t + 0.04), 'dec', 'faithwed', {}); return; }
    log(L`각자의 신앙을 지키며 결혼했습니다. ${iga(who)} 그래도 괜찮다고 했습니다.`); return;
  }
  log("Hai bạn kết hôn trong khi mỗi người mang một đức tin khác nhau. Vào các dịp lễ, hai bạn cùng lo nghi lễ của cả hai bên gia đình.");
}
function freshName(cl, sex) { return partnerName(cl, sex, { rel: S.rel === 'S' ? 'S' : undefined }); }
const wife2Cost = c => incomeAt(c, 0.5) * (c.p === 'sa' ? 1.2 : 0.4);
const w2Age = (man, wife1, c) => clamp(Math.min(man - Math.round(coupleGap(c)) - ri(4, 16), wife1 - ri(2, 10), 30 + ri(0, 10)), 18, 55);
const polyFact = c => L`${c.ko}에서는 결혼한 여성의 약 ${POLY[c.id]}%가 다른 아내가 있는 남편과 삽니다 (DHS)`;
const coLine = () => S.fam.co && S.fam.co.senior && S.fam.co.at === S.age ? ' ' + L`남편의 첫 아내 ${wa(callName(S.fam.co.name))} 한집에서 살게 되었습니다.` : '';
const POLY_K = 0.085, POLY_KM = 0.13;
function polyAsk(c, a, add) {
  const f = S.fam, P = f.partner;
  if (!POLY[c.id] || !f.married || !P || !P.alive || P.divorced || P.ss || unionOf(P) !== 'm' || S.job === 'prison') return;
  const y = a - (f.marriedAt != null ? f.marriedAt : a), r = polyRate(c, S.rel) * polyMe();
  if (S.sex === 'F' && !f.co && a < 60 && P.age < 66 && chance(r * POLY_K * (y < 3 ? 0.4 : y < 15 ? 1 : 0.6))) add('cowife');
  if (S.sex === 'M' && !(f.wife2 && f.wife2.alive) && a >= 25 && a <= 60 && (S.flags.last_wife2 == null || a - S.flags.last_wife2 >= 8) && chance(r * POLY_KM * (a < 35 ? 0.6 : 1) * (y < 3 ? 0.3 : 1))) add('wife2');
}
function polyYear(c) {
  const f = S.fam, a = S.age, w = f.wife2;
  if (w && w.alive) {
    w.age++;
    if (chance(lifeTable(c, 'F').q[Math.min(110, w.age)])) {
      w.alive = false; const cause = pickCause(c, w.age, 'F', true);
      logA('loss:pt', L`두 번째 아내 ${iga(callName(w.name))} ${w.age}세로 세상을 떠났습니다. (${causeLabel(cause, w.age, 'F')})`, 'loss'); eff({ h: -12, so: -6 }); S.yearMark = 'loss';
      if (cause === 'suic') suicLoss('pt', callName(w.name));
      spouseFuneral(c);
    } else if (!w.nk && w.age < 43 && a > w.at && (w.lk == null || a - w.lk >= 2)) {
      const nk = f.kids.filter(k => k.m2).length, want = kidsW(c);
      if (chance(nk === 0 ? 0.6 : clamp(0.5 * (want - nk) / Math.max(1, want), 0.05, 0.5))) { w.lk = a; const lk = S.flags.last_kids; haveKid(w); S.flags.last_kids = lk; }
    }
  }
  const co = f.co, P = f.partner;
  if (co) {
    if (!f.married || !P || !P.alive || P.divorced) f.co = null;
    else {
      co.age++;
      if (co.age < 43 && chance(clamp(c.tfr / 22, 0.05, 0.3))) co.kids++;
      if (chance(lifeTable(c, 'F').q[Math.min(110, co.age)])) { log(L`남편의 다른 아내 ${iga(callName(co.name))} ${co.age}세로 세상을 떠났습니다.`, 'loss'); eff({ h: -3, so: -2 }); f.co = null; }
      else if (chance(0.012)) { log(L`남편의 다른 아내 ${iga(callName(co.name))} 남편과 헤어져 집을 떠났습니다.`); f.co = null; }
    }
  }
}
function pastPartner() {
  const P = S.fam.partner; if (!P || P.alive || P.divorced || !P.name || !P.name.full) return;
  (S.flags.exs || (S.flags.exs = [])).push({ n: P.name.full, y: Math.max(0, (P.endAt != null ? P.endAt : S.age) - (S.fam.marriedAt != null ? S.fam.marriedAt : S.age)), w: unionOf(P) === 'm' ? 1 : 0, d: 1 });
}
function promoteWife2(c) {
  const w = S.fam.wife2; if (!w || !w.alive) return '';
  pastPartner();
  S.fam.partner = { name: w.name, age: w.age, sex: 'F', alive: true, base: clamp(S.q / 5 - 0.25, 0.05, 0.9), k: ['sa', 'mena'].includes(c.p) ? 0.3 : 0.6, dev: 0, home: c.id, mp: 0, w2: 1 };
  S.fam.partner.inc = partnerPay(S.fam.partner); ptRetAtStart(S.fam.partner, c);
  S.fam.married = true; S.fam.widowed = false; S.fam.wife2 = null; S.fam.marriedAt = w.at != null ? w.at : S.age; anvReset();
  return L`이제 ${wa(callName(w.name))} 둘이 남았습니다.`;
}
function teenBirth() {
  log(L`${S.age}세, 아직 어린 나이에 아이를 가졌습니다. 몸도 마음도 엄마가 될 준비가 되지 않았습니다.`, 'bad', "Biến chứng khi mang thai và sinh nở là một trong những nguyên nhân tử vong hàng đầu ở nữ giới từ 15 đến 19 tuổi trên toàn thế giới (WHO, tờ thông tin về mang thai ở tuổi vị thành niên, 2024)");
  haveKid();
  if (!S.deathAt) eff({ h: -6, hl: -2 });
  if (!S.deathAt && S.flags.cmSch && S.school) { S.school = null; S.flags.cmSch = 0; S.flags.wedLeft = 1; S.job = 'homemaker'; log("Vì có em bé nên bạn đã nghỉ học.", 'bad'); }
}
const MISC_K = 0.47;
const MISC_F = () => "Khoảng 15% số ca mang thai đã được xác nhận kết thúc bằng sảy thai. Khoảng một nửa là do bất thường nhiễm sắc thể của thai nhi, và đó không phải lỗi của ai cả (Lancet 2021, ACOG)";
function haveKid(w2, o = {}) {
  const c = C(), psex = chance(0.512) ? 'M' : 'F';
  const fatherName = S.sex === 'M' || (S.fam.partner && S.fam.partner.ss) ? S.name : (S.fam.partner ? S.fam.partner.name : S.name);
  const N = NAMES[S.cl] || NAMES.en;
  const taken = new Set([S.name, natNmObj(), S.fam.partner && S.fam.partner.name, w2 && w2.name, ...S.fam.kids.map(k => k.name), ...(S.fam.given || []).map(g => g.name)].filter(Boolean).map(callName));
  for (const x of S.flags.fUsed || []) taken.add(x);
  const P = S.fam.partner, me = S.sex === 'M' || (P && P.ss), nn = S.flags.natNm;
  let cl = S.cl, fam = fatherName;
  if (S.cur !== S.born && me && nn && nn.cl) { cl = nn.cl; fam = nn; }
  else if (!w2 && S.flags.surM && S.flags.surM === S.fam.marriages && surOK()) fam = momName();
  else if (S.cur !== S.born && !me && P && P.name && P.name.cl && P.name.cl !== S.cl && (P.nat || P.home) === S.cur) cl = P.name.cl;
  const NK = NAMES[cl] || NAMES.en;
  const nmOpt = { family: NK.o === 'pat' || NK.o === 'bin' ? null : fam.base, father: fam.g.split(' ')[0], kid: 1, rel: S.rel === 'S' && cl === S.cl ? 'S' : undefined };
  let name; for (let i = 0; i < 12; i++) { name = makeName(cl, psex, nmOpt); if (!taken.has(callName(name))) break; }
  S.flags.last_kids = S.age;
  if (S.sex === 'F' && !o.pc) {
    const p = c.mmr / 100000 * (S.age < 18 ? 1.6 : S.age >= 35 ? 1.5 : 1) * (S.pct < 0.3 || S.q <= 2 ? 1.4 : 0.8);
    if (chance(p)) {
      const lives = chance(0.7); S.fam.kids.push({ name, sex: psex, bornAt: S.age, alive: lives }); S.stats.kidsBorn++;
      log(lives ? (psex === 'F' ? L`딸 ${iga(name.full)} 태어났지만, 출산 중 합병증이 생겼습니다.` : L`아들 ${iga(name.full)} 태어났지만, 출산 중 합병증이 생겼습니다.`) : "Biến chứng xảy ra trong lúc sinh. Em bé cũng không qua khỏi.", 'loss');
      die('mat'); return;
    }
  }
  if (chance(Math.min(0.05, c.im / 1000 * 0.15))) { log("Em bé sinh ra đã không còn sống. Bạn chìm trong đau buồn rất lâu.", 'loss'); eff({ h: -15 }); return; }
  let miscT = '';
  { const carrier = S.sex === 'F' && !o.pc ? S : !w2 && S.fam.partner && S.fam.partner.sex === 'F' && (S.sex === 'M' || o.pc) ? S.fam.partner : null;
    if (carrier) {
      const ma = carrier === S ? S.age : carrier.age, r = ma < 30 ? 0.10 : ma < 35 ? 0.11 : ma < 40 ? 0.17 : ma < 45 ? 0.33 : 0.55, p = MISC_K * r / (1 - r);
      const n = chance(p) ? (chance(p) ? 2 : 1) : 0;
      if (n) { eff({ h: -3 }); S.stats.misc = (S.stats.misc || 0) + n;
        miscT = carrier === S ? (n > 1 ? "Đứa con này đến sau hai lần sảy thai." : "Đứa con này đến sau một lần sảy thai vào năm trước.")
          : (n > 1 ? "Đứa con này đến sau khi bạn đời đã hai lần sảy thai." : "Đứa con này đến sau khi bạn đời bị sảy thai vào năm trước."); }
    } }
  const kid = { name, sex: psex, bornAt: S.age, alive: true, mn: S.fam.married ? S.fam.marriages : 0 };
  if (w2) kid.m2 = 1;
  { const P = w2 || (S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced ? S.fam.partner : null); if (P && P.name) { kid.op = P.name; kid.ops = P.sex || (w2 ? 'F' : null); } }
  { const dd = ddDraw(c, psex); if (dd) kid.dd = dd; const nd = ndDraw(psex, dd); if (nd) kid.nd = nd; }
  { const P = S.fam.partner; if (!w2 && S.sex === 'M' && famPt() && P.lb) { kid.lb = 1; kid.away = 1; kid.awayIn = P.lbIn; } }
  S.fam.kids.push(kid);
  S.stats.kidsBorn++; S.yearMark = 'baby';
  logA('baby', w2 ? (psex === 'F' ? L`두 번째 아내 ${callName(w2.name)}에게서 딸 ${iga(name.full)} 태어났습니다.` : L`두 번째 아내 ${callName(w2.name)}에게서 아들 ${iga(name.full)} 태어났습니다.`) : L`${psex === 'F' ? "con gái" : "con trai"} ${iga(name.full)} 태어났습니다.`, 'big');
  if (miscT) log(miscT, 'note', MISC_F());
  if (chance(pretermP(c))) { kid.pre = 1; log(c.ppp >= 20000 ? "Em bé sinh non và phải nằm ở phòng hồi sức tích cực sơ sinh một thời gian." : "Em bé sinh non và nhỏ bé. Được ôm sát vào lòng để giữ ấm, em bé đã vượt qua những ngày đầu khó khăn.", 'note'); }
  if (chance(c.p === 'ssa' ? 0.028 : 0.014)) {
    const sx2 = chance(0.6) ? psex : psex === 'F' ? 'M' : 'F'; taken.add(callName(name));
    let n2; for (let i = 0; i < 12; i++) { n2 = makeName(cl, sx2, nmOpt); if (!taken.has(callName(n2))) break; }
    S.fam.kids.push(Object.assign({}, kid, { name: n2, sex: sx2, tw: 1, ...(() => { const dd = ddDraw(c, sx2), nd = ndDraw(sx2, dd); return { dd: dd || undefined, nd: nd || undefined }; })() })); S.stats.kidsBorn++; eff({ h: 4, so: 2 });
    logA('baby', sx2 === 'F' ? L`쌍둥이였습니다! 딸 ${iga(n2.full)} 함께 태어났습니다.` : L`쌍둥이였습니다! 아들 ${iga(n2.full)} 함께 태어났습니다.`, 'big', "Cứ khoảng 70 ca sinh thì có một ca sinh đôi; ở châu Phi cận Sahara còn phổ biến hơn, khoảng một trên 35 (Smits & Monden 2011)");
  }
  const MH = S.sex === 'F' ? S.hiv : w2 ? null : (S.fam.partner && S.fam.partner.hiv);
  if (MH) {
    if (!MH.known && chance(0.75)) { if (S.sex === 'F') { hivDiagnosed('pregnancy'); hivKidsCheck(); } else { MH.known = true; MH.art = chance(0.9); log(L`배우자 ${iga(callName(S.fam.partner.name))} 임신 중 검사에서 HIV 양성 판정을 받았습니다.${MH.art ? " Cô ấy đã bắt đầu điều trị ngay để bảo vệ em bé." : ''}`, 'bad', "Nếu được điều trị, khả năng lây từ mẹ sang con giảm xuống dưới 5% (WHO)"); if (S.hiv && !S.hiv.known) hivDiagnosed('partner'); else if (!S.hiv) log("Hai người cùng đi xét nghiệm. Bạn âm tính."); hivKidsCheck(); } }
    if (chance(MH.art ? 0.03 : 0.3)) { kid.hiv = { known: MH.known, art: MH.known }; if (MH.known) log(L`${iga(callName(name))} HIV를 갖고 태어났습니다. 평생 매일 약을 먹어야 합니다.`, 'bad'); }
    else if (MH.known && MH.art) log((S.flags.hivFreeKid = (S.flags.hivFreeKid || 0) + 1) > 1 ? "Em bé lần này cũng sinh ra không nhiễm HIV." : "Nhờ điều trị, em bé sinh ra không nhiễm HIV.", 'big', "Nếu được điều trị, khả năng lây từ mẹ sang con giảm xuống dưới 5% (WHO)");
  }
  eff({ h: 10, so: 6, hl: S.sex === 'F' ? -4 : 0 });
  if (!w2) careAfterBirth(S.fam.kids.length - 1);
  if (!w2) birthPlanFine();
}
const birthRule = () => S.cur === 'CHN' && calYr() >= 1980 && calYr() <= 2015;
const birthOwn = () => S.fam.kids.filter(k => !k.sk && !k.adopted && k.alive && !k.tw);
function birthAllow() { const own = birthOwn(), g = ethG(); return (S.urban ? 1 : own.length && own[0].sex === 'F' && calYr() >= 1984 ? 2 : 1) + (g && g.k1 ? 1 : 0); }
const birthFine = () => incomeAt(C(), 0.5) * (S.urban ? 3 : 2);
const STATE_JOBS = ['civil', 'police', 'soldier', 'teacher'];
function birthPlanFine() {
  if (!birthRule() || S.isComp) return;
  const own = birthOwn().length; if (own <= birthAllow()) return;
  const fine = birthFine(); S.money -= fine; book("Phí nuôi dưỡng xã hội (sinh ngoài kế hoạch)", -fine); eff({ h: -4 });
  let t = L`정해진 수를 넘겨 낳은 아이라 사회부양비로 ${wonStr(fine)}를 냈습니다.`;
  if (STATE_JOBS.includes(S.job) && chance(0.7)) { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -6 }); t += ' ' + "Vì đang làm việc cho nhà nước, bạn cũng mất luôn việc làm."; }
  log(t, 'bad', "Chính sách một con của Trung Quốc (1980-2015) cho phép một con ở thành phố, còn ở nông thôn được hai con nếu con đầu là gái; sinh vượt phải nộp “phí nuôi dưỡng xã hội” bằng thu nhập của vài năm, và người làm cho nhà nước có thể mất việc (Hesketh và cộng sự 2005)");
}
const gradAbroadCost = () => usd2ppp(C(), 40000);
const UNI_FREE = new Set(['DEU', 'AUT', 'NOR', 'FIN', 'SWE', 'DNK', 'CZE', 'POL', 'SVK', 'GRC', 'FRA', 'TUR', 'ARG', 'BRA', 'URY', 'CUB', 'EGY', 'DZA', 'MAR', 'TUN', 'LBY', 'SAU', 'KWT', 'QAT', 'OMN', 'ARE', 'IRN', 'EST', 'SVN', 'HRV', 'MLT', 'CYP', 'LUX', 'MUS', 'BHR', 'MDV']);
const fledLately = () => !!(S.refugee || (S.refugeeUntil != null && S.age - S.refugeeUntil < 8));
const gradAbroadWay = () => !S.mig && !S.flags.studyAbroad && papersOK() && S.cur !== 'PRK' && !['USA', 'GBR', 'CAN', 'AUS'].includes(S.cur);
const gradAbroadOK = () => gradAbroadWay() && (S.q >= 3 || S.money >= gradAbroadCost());
const famAbroad = c => S.q >= 4 && (c.ppp < 30000 || S.flags.rich);
const abroadNeed = c => usd2ppp(c, 30000);
const lockedWhy = need => need > 0 ? L`집안 형편으로는 어려워요 · 모은 돈이 약 ${wonStr(need)} 있으면 고를 수 있어요` : "Vượt quá khả năng của gia đình";
const STUDY_TO = {
  IND: { USA: 34, CAN: 20, GBR: 16, AUS: 11, DEU: 5, RUS: 2.5, IRL: 1.5, NZL: 1.5, KGZ: 1.5 },
  CHN: { USA: 28, GBR: 17, AUS: 15, JPN: 11, KOR: 7, CAN: 6, DEU: 4, MYS: 3, RUS: 3, FRA: 2.5, SGP: 2, NZL: 1.5 },
  KOR: { USA: 40, CHN: 10, JPN: 9, CAN: 8, AUS: 7, GBR: 7, DEU: 6, FRA: 3 },
  JPN: { USA: 42, GBR: 12, AUS: 10, CAN: 9, DEU: 7, KOR: 7, CHN: 5, FRA: 4 },
  TWN: { USA: 45, JPN: 15, AUS: 13, GBR: 9, CAN: 6, DEU: 5, FRA: 3 },
  VNM: { JPN: 26, KOR: 26, USA: 20, AUS: 16, CAN: 5, GBR: 4, FRA: 2, DEU: 1.5 },
  NPL: { AUS: 40, JPN: 22, USA: 13, GBR: 8, CAN: 6, KOR: 5, IND: 4 },
  BGD: { USA: 22, GBR: 16, CAN: 13, MYS: 12, AUS: 12, DEU: 6, IND: 6, JPN: 4 },
  PAK: { GBR: 24, CHN: 15, AUS: 14, USA: 12, CAN: 8, DEU: 6, MYS: 4, TUR: 4, KGZ: 3 },
  LKA: { AUS: 30, GBR: 25, USA: 12, CAN: 10, IND: 6, MYS: 6, JPN: 5, NZL: 3 },
  AFG: { IND: 25, TUR: 20, IRN: 15, DEU: 10, RUS: 8, USA: 7, KAZ: 5 },
  IDN: { AUS: 28, MYS: 15, USA: 11, JPN: 9, GBR: 8, DEU: 6, NLD: 5, EGY: 5, TUR: 5, KOR: 4 },
  MYS: { GBR: 30, AUS: 28, USA: 9, EGY: 7, JPN: 5, NZL: 5, IDN: 4, IRL: 4 },
  PHL: { USA: 30, AUS: 28, CAN: 18, GBR: 10, JPN: 5, NZL: 3 },
  THA: { USA: 26, GBR: 20, AUS: 20, JPN: 10, CHN: 10, DEU: 4 },
  MMR: { THA: 25, JPN: 20, AUS: 12, USA: 10, KOR: 8, MYS: 8, GBR: 5, CHN: 5 },
  KHM: { THA: 25, JPN: 15, AUS: 15, KOR: 12, USA: 10, FRA: 8, CHN: 8, VNM: 5 },
  LAO: { VNM: 30, THA: 25, CHN: 15, JPN: 10, AUS: 8, KOR: 6 },
  MNG: { KOR: 30, JPN: 20, CHN: 15, RUS: 15, USA: 10, AUS: 5, DEU: 4 },
  PNG: { AUS: 70, NZL: 15, USA: 5, PHL: 5, GBR: 3 },
  MAR: { FRA: 60, ESP: 7, DEU: 7, CAN: 5, BEL: 4, RUS: 4, TUR: 3, USA: 3, ITA: 3 },
  DZA: { FRA: 73, CAN: 5, TUR: 5, DEU: 3, ESP: 3, RUS: 3, BEL: 2, USA: 2 },
  TUN: { FRA: 55, DEU: 15, CAN: 7, ITA: 5, RUS: 4, TUR: 3, BEL: 3 },
  EGY: { SAU: 15, DEU: 12, GBR: 12, USA: 12, ARE: 10, CAN: 7, MYS: 5, FRA: 5, RUS: 4, TUR: 3 },
  IRN: { TUR: 22, DEU: 16, CAN: 12, USA: 12, ITA: 10, GBR: 6, MYS: 5, FRA: 4, AUS: 4 },
  IRQ: { TUR: 30, IRN: 15, JOR: 10, GBR: 7, DEU: 6, MYS: 6, USA: 5, RUS: 5, LBN: 5 },
  SYR: { DEU: 30, TUR: 25, LBN: 10, JOR: 6, FRA: 6, SAU: 5, RUS: 5, CAN: 4 },
  JOR: { USA: 15, GBR: 12, DEU: 12, ARE: 12, SAU: 8, TUR: 6, RUS: 6, MYS: 5, CAN: 5 },
  LBN: { FRA: 40, CAN: 15, USA: 12, DEU: 8, GBR: 5, ARE: 5, BEL: 4 },
  PSE: { JOR: 30, TUR: 15, DEU: 10, EGY: 8, MYS: 8, USA: 5, RUS: 5, ITA: 5 },
  YEM: { MYS: 20, SAU: 15, EGY: 15, JOR: 10, IND: 10, TUR: 10 },
  LBY: { GBR: 25, MYS: 15, TUR: 15, EGY: 10, USA: 10, CAN: 8, JOR: 5, TUN: 5 },
  SAU: { USA: 42, GBR: 25, AUS: 8, CAN: 7, MYS: 4, IRL: 3, NZL: 3 },
  ARE: { GBR: 35, USA: 25, AUS: 15, CAN: 8, JOR: 5, MYS: 4 },
  NGA: { GBR: 40, CAN: 18, USA: 16, GHA: 6, DEU: 4, MYS: 3, ZAF: 3, CHN: 3, AUS: 2, IRL: 2 },
  GHA: { GBR: 30, USA: 25, CAN: 14, CHN: 8, DEU: 5, AUS: 4, RUS: 3, ZAF: 3 },
  KEN: { USA: 28, GBR: 20, CAN: 12, AUS: 10, IND: 6, DEU: 5, CHN: 5, ZAF: 4, RUS: 3 },
  ETH: { USA: 22, CHN: 12, IND: 10, TUR: 8, DEU: 8, GBR: 8, CAN: 6, ZAF: 6, ITA: 5, KEN: 4 },
  UGA: { KEN: 20, GBR: 15, USA: 15, IND: 12, ZAF: 10, CAN: 8, CHN: 8, MYS: 4 },
  TZA: { KEN: 15, GBR: 15, IND: 15, USA: 12, CHN: 12, ZAF: 10, CAN: 6, MYS: 5 },
  RWA: { USA: 15, IND: 12, KEN: 10, BEL: 10, CAN: 10, CHN: 10, UGA: 10, FRA: 6, ZAF: 5 },
  ZAF: { GBR: 30, USA: 25, AUS: 15, DEU: 8, CAN: 7, NLD: 5, NZL: 5 },
  ZWE: { ZAF: 45, GBR: 20, USA: 10, AUS: 7, CAN: 5, CHN: 5, NAM: 3 },
  NAM: { ZAF: 70, DEU: 10, GBR: 6, USA: 5, BWA: 3 },
  BWA: { ZAF: 60, GBR: 15, USA: 10, AUS: 8, MYS: 5 },
  LSO: { ZAF: 85, GBR: 4, USA: 4, CHN: 4 },
  ZMB: { ZAF: 35, GBR: 15, USA: 12, CHN: 10, IND: 10, AUS: 5, RUS: 5 },
  MWI: { ZAF: 35, GBR: 15, USA: 15, IND: 10, CHN: 10, AUS: 5 },
  MOZ: { PRT: 35, ZAF: 30, BRA: 15, USA: 5, GBR: 5, CHN: 5 },
  AGO: { PRT: 50, BRA: 18, ZAF: 10, USA: 7, GBR: 5, RUS: 4, CHN: 4 },
  GNB: { PRT: 50, BRA: 15, SEN: 15, FRA: 10, MAR: 6 },
  SOM: { KEN: 25, TUR: 20, USA: 12, GBR: 10, MYS: 8, EGY: 8, IND: 8, UGA: 6 },
  SDN: { EGY: 25, SAU: 20, MYS: 15, TUR: 10, IND: 10, GBR: 7, USA: 5, RUS: 4 },
  SSD: { UGA: 40, KEN: 35, USA: 10, EGY: 8 },
  LBR: { USA: 45, GHA: 25, GBR: 10, CHN: 7, NGA: 6 },
  SLE: { GBR: 35, USA: 20, GHA: 15, NGA: 10, CHN: 8, CAN: 6 },
  GMB: { GBR: 25, USA: 20, SEN: 15, MAR: 12, MYS: 8, TUR: 7, CAN: 6 },
  CMR: { FRA: 35, DEU: 15, CAN: 12, USA: 8, BEL: 6, MAR: 6, CHN: 5, RUS: 3, TUR: 3, ZAF: 3 },
  COD: { FRA: 25, BEL: 25, ZAF: 12, CAN: 10, MAR: 6, USA: 5, CHN: 5, TUN: 4, RUS: 4 },
  MDG: { FRA: 70, CAN: 6, DEU: 6, CHN: 6, USA: 5, ZAF: 4 },
  MEX: { USA: 45, ESP: 15, DEU: 7, CAN: 7, FRA: 6, GBR: 6, ARG: 3, AUS: 3, CHL: 2 },
  BRA: { USA: 30, PRT: 22, ARG: 8, FRA: 7, DEU: 7, AUS: 6, CAN: 6, ESP: 5, GBR: 4, ITA: 3 },
  COL: { ESP: 24, USA: 20, ARG: 12, FRA: 9, DEU: 8, MEX: 6, CAN: 6, CHL: 5, AUS: 5 },
  PER: { ESP: 20, ARG: 18, USA: 18, CHL: 10, MEX: 6, DEU: 6, BRA: 5, FRA: 5, ITA: 5 },
  VEN: { ESP: 22, USA: 20, ARG: 15, COL: 10, CHL: 10, MEX: 7, ECU: 5, FRA: 4 },
  ECU: { ESP: 25, USA: 20, ARG: 10, DEU: 6, MEX: 6, CHL: 6, FRA: 5, BRA: 5, CUB: 5 },
  BOL: { ARG: 30, BRA: 15, ESP: 15, USA: 10, CHL: 8, CUB: 8, DEU: 5, MEX: 4 },
  ARG: { ESP: 28, USA: 25, ITA: 8, FRA: 7, DEU: 7, BRA: 6, CHL: 5, MEX: 5, GBR: 5 },
  CHL: { USA: 25, ESP: 22, ARG: 10, AUS: 10, GBR: 8, DEU: 8, FRA: 7, MEX: 4 },
  CUB: { ESP: 30, MEX: 20, USA: 15, RUS: 15, ARG: 10, CHL: 5 },
  HTI: { FRA: 25, DOM: 25, USA: 20, CAN: 20, MEX: 4, CUB: 4 },
  JAM: { USA: 45, GBR: 25, CAN: 20, CUB: 5 },
  RUS: { DEU: 22, USA: 10, CZE: 10, FRA: 7, GBR: 6, ITA: 6, CHN: 6, FIN: 5, TUR: 4, AUT: 4 },
  UKR: { POL: 40, DEU: 20, CZE: 8, CAN: 5, USA: 5, ITA: 5, FRA: 4, SVK: 4, AUT: 3 },
  BLR: { RUS: 35, POL: 30, DEU: 10, CZE: 8, USA: 5, CHN: 5 },
  KAZ: { RUS: 60, KGZ: 5, CHN: 5, CZE: 5, TUR: 5, USA: 4, KOR: 4, GBR: 4, DEU: 3 },
  UZB: { RUS: 40, KAZ: 12, KOR: 10, KGZ: 8, TUR: 8, BLR: 5, CHN: 4, USA: 3, DEU: 3 },
  TJK: { RUS: 65, KAZ: 8, KGZ: 6, CHN: 6, BLR: 5, TUR: 5 },
  KGZ: { RUS: 55, KAZ: 15, TUR: 10, CHN: 6, KOR: 4, DEU: 4 },
  TKM: { TUR: 30, RUS: 25, BLR: 25, CHN: 8, MYS: 5 },
  AZE: { TUR: 30, RUS: 25, GBR: 8, DEU: 8, USA: 6, GEO: 5, ITA: 5 },
  GEO: { DEU: 30, USA: 10, TUR: 10, RUS: 10, FRA: 8, POL: 6, GBR: 6, ITA: 5, CZE: 5 },
  TUR: { DEU: 30, USA: 16, GBR: 8, AUT: 5, HUN: 5, NLD: 5, ITA: 5, CAN: 5, FRA: 4, POL: 4 },
  SRB: { DEU: 20, AUT: 20, USA: 8, HUN: 8, RUS: 8, ITA: 6, CHE: 6, FRA: 5, GBR: 5 },
  BGR: { GBR: 25, DEU: 25, NLD: 10, AUT: 8, ITA: 5, USA: 5, FRA: 5, DNK: 5 },
  ROU: { GBR: 20, DEU: 15, FRA: 15, ITA: 10, NLD: 8, ESP: 5, AUT: 5, USA: 5, DNK: 5 },
  HUN: { AUT: 25, DEU: 25, GBR: 15, NLD: 8, USA: 6, DNK: 5 },
  NZL: { AUS: 60, USA: 15, GBR: 15, CAN: 5 },
  IRL: { GBR: 60, USA: 15, NLD: 5, DEU: 5, AUS: 5 },
  DEU: { AUT: 28, NLD: 18, GBR: 12, CHE: 12, USA: 6, FRA: 5, DNK: 3, ESP: 3, SWE: 3 },
  FRA: { BEL: 24, CAN: 18, CHE: 12, GBR: 12, ESP: 6, DEU: 6, USA: 6, ITA: 3, NLD: 3 },
  ITA: { GBR: 25, AUT: 12, DEU: 12, FRA: 10, ESP: 8, CHE: 8, NLD: 7, USA: 6, SWE: 3 },
  ESP: { GBR: 25, USA: 12, DEU: 10, FRA: 10, NLD: 8, ITA: 6, PRT: 6, CHE: 5, IRL: 3 },
  PRT: { GBR: 30, FRA: 15, ESP: 15, DEU: 8, BRA: 8, NLD: 6, USA: 5 },
  NLD: { BEL: 25, GBR: 25, DEU: 15, USA: 10, CHE: 5, FRA: 5, SWE: 4 },
  BEL: { FRA: 25, NLD: 25, GBR: 15, DEU: 8, USA: 8, CHE: 5, ESP: 4 },
  AUT: { DEU: 50, CHE: 10, GBR: 10, NLD: 5, USA: 5 },
  CHE: { DEU: 30, GBR: 20, USA: 15, FRA: 10, AUT: 8, NLD: 5, ITA: 5 },
  POL: { GBR: 30, DEU: 25, DNK: 6, NLD: 6, FRA: 6, CZE: 5, USA: 5, ESP: 4, AUT: 4 },
  CZE: { GBR: 20, DEU: 20, AUT: 15, NLD: 8, USA: 8, FRA: 6, DNK: 5, SVK: 5 },
  SVK: { CZE: 75, AUT: 6, GBR: 6, HUN: 4, DEU: 4 },
  GRC: { GBR: 35, DEU: 15, NLD: 10, ITA: 8, USA: 8, FRA: 6, BGR: 5, ROU: 3 },
  NOR: { GBR: 25, DNK: 15, USA: 10, AUS: 8, SWE: 8, POL: 6, HUN: 5, NLD: 5, DEU: 5 },
  SWE: { GBR: 25, USA: 15, DNK: 10, NOR: 8, NLD: 8, DEU: 6, FRA: 5, ESP: 5, POL: 4 },
  FIN: { SWE: 30, GBR: 20, NLD: 8, DEU: 8, USA: 8, DNK: 5, FRA: 4 },
  DNK: { GBR: 30, USA: 15, SWE: 10, NOR: 8, NLD: 8, DEU: 8, AUS: 5 },
  ISR: { USA: 30, GBR: 12, DEU: 12, ITA: 10, FRA: 6, CAN: 6, HUN: 5, ROU: 5 },
  SGP: { GBR: 35, AUS: 30, USA: 20, JPN: 3, NZL: 3, CAN: 3 },
  HKG: { GBR: 35, AUS: 25, USA: 15, CAN: 12, TWN: 6, CHN: 5 },
  MAC: { CHN: 30, TWN: 28, AUS: 15, GBR: 10, USA: 8, PRT: 4 },
  LUX: { DEU: 30, BEL: 28, FRA: 20, GBR: 8, AUT: 6, CHE: 5 },
  CYP: { GRC: 50, GBR: 30, USA: 5, DEU: 5, NLD: 3 },
  MLT: { GBR: 55, ITA: 10, USA: 8, NLD: 6, DEU: 5 },
  EST: { FIN: 22, GBR: 20, NLD: 12, DEU: 10, DNK: 8, USA: 5 },
  LVA: { GBR: 30, DEU: 12, NLD: 10, DNK: 10, FIN: 5, USA: 5 },
  LTU: { GBR: 35, DNK: 12, NLD: 10, DEU: 10, POL: 5, USA: 5 },
  SVN: { AUT: 45, DEU: 15, GBR: 10, ITA: 8, NLD: 5 },
  HRV: { AUT: 25, DEU: 18, SVN: 12, ITA: 10, GBR: 8, USA: 6 },
  BIH: { SRB: 30, HRV: 25, AUT: 12, SVN: 10, DEU: 8, TUR: 6 },
  MNE: { SRB: 55, DEU: 8, ITA: 6, AUT: 6, TUR: 5, USA: 5 },
  MKD: { BGR: 20, TUR: 15, SRB: 12, DEU: 10, ITA: 8, AUT: 6, USA: 5 },
  ALB: { ITA: 40, TUR: 12, GRC: 8, DEU: 8, USA: 8, GBR: 5 },
  XKX: { ALB: 25, DEU: 20, TUR: 15, AUT: 10, USA: 6, GBR: 5 },
  ARM: { RUS: 45, DEU: 10, FRA: 8, USA: 8, CZE: 5, GBR: 3 },
  MDA: { ROU: 60, RUS: 12, ITA: 6, FRA: 5, DEU: 5 },
  BHR: { GBR: 30, USA: 15, SAU: 15, JOR: 10, ARE: 10, AUS: 5 },
  TTO: { USA: 40, GBR: 25, CAN: 15, JAM: 10 },
  GUY: { USA: 35, TTO: 20, JAM: 15, CAN: 15, GBR: 10 },
  SUR: { NLD: 75, USA: 15, BEL: 5 },
  PRI: { USA: 90, ESP: 5 },
  FJI: { AUS: 45, NZL: 30, USA: 8, IND: 5 },
  SLB: { FJI: 35, AUS: 25, PNG: 20, NZL: 15 },
  TLS: { IDN: 45, PRT: 20, AUS: 15, CUB: 5 },
  BTN: { IND: 40, AUS: 35, THA: 10, JPN: 5 },
  MDV: { MYS: 30, IND: 20, LKA: 15, AUS: 10, GBR: 10 },
  MUS: { FRA: 30, GBR: 20, AUS: 20, IND: 10, ZAF: 5 },
  SWZ: { ZAF: 80, GBR: 5, USA: 5 },
  DJI: { FRA: 50, MAR: 20, TUR: 10, CAN: 5 },
  COM: { FRA: 45, MAR: 25, MDG: 15, SEN: 5 },
  CPV: { PRT: 75, BRA: 15, USA: 5 },
};
const STUDY_R = {
  fr: { FRA: 45, MAR: 12, CAN: 12, BEL: 7, DEU: 5, USA: 5, CHN: 5, TUN: 3, RUS: 3, TUR: 3 },
  ssa: { GBR: 25, USA: 20, ZAF: 12, CAN: 10, CHN: 8, IND: 8, AUS: 5, MYS: 5, DEU: 4, KEN: 3 },
  lac: { USA: 35, ESP: 22, MEX: 8, ARG: 8, CHL: 5, DEU: 5, FRA: 5, CAN: 5, BRA: 3 },
  mena: { GBR: 15, TUR: 12, USA: 12, MYS: 10, EGY: 8, JOR: 8, DEU: 8, FRA: 8, SAU: 6, CAN: 5 },
  sa: { USA: 25, GBR: 20, AUS: 15, CAN: 12, IND: 8, MYS: 6, DEU: 5 },
  eap: { AUS: 25, USA: 20, JPN: 12, KOR: 10, GBR: 10, CHN: 8, MYS: 5, THA: 5 },
  eca: { RUS: 30, DEU: 20, TUR: 10, CZE: 6, POL: 6, GBR: 6, USA: 6, KAZ: 4, CHN: 4 },
  hi: { USA: 30, GBR: 25, DEU: 10, CAN: 8, FRA: 6, AUS: 6, NLD: 5, CHE: 4, AUT: 3 },
};
const STUDY_Y = { CHN: 1980, KOR: 1995, MYS: 2000, ARE: 2005, TUR: 1992, SGP: 1990, KGZ: 1995 };
const US_BAN = { 2025: ['AFG,MMR,TCD,COG,GNQ,ERI,HTI,IRN,LBY,SOM,SDN,YEM', 'BDI,CUB,LAO,SLE,TGO,TKM,VEN'],
  2026: ['AFG,MMR,BFA,TCD,COG,GNQ,ERI,HTI,IRN,LAO,LBY,MLI,NER,SLE,SOM,SSD,SDN,SYR,YEM', 'AGO,ATG,BEN,BDI,CIV,CUB,DMA,GAB,GMB,MWI,MRT,NGA,SEN,TZA,TGO,TON,VEN,ZMB,ZWE'] };
const usShut = (o, yr, full) => { if (yr < 2025) return false; const b = US_BAN[yr >= 2026 ? 2026 : 2025]; return b[0].split(',').includes(o) || (!full && b[1].split(',').includes(o)); };
const studyLim = (o, d, yr = calYr()) => d === 'USA' && yr >= 2025 ? [o === 'IND' ? 0.5 : 0.8, 0.85] : d === 'CAN' && yr >= 2024 ? [yr >= 2025 ? 0.45 : 0.55, 0.8] : [1, 1];
const studyOpen = (o, d, yr = calYr()) => {
  const dc = CBY[d]; if (!dc || d === o || d === S.born) return false;
  if (d === 'USA' && usShut(o, yr)) return false;
  if (STUDY_Y[d] && yr < STUDY_Y[d]) return false;
  if (((o === 'KOR' && d === 'CHN') || (o === 'CHN' && d === 'KOR')) && yr < 1992) return false;
  if (o === 'PRK' || d === 'PRK' || d === 'UKR' && yr >= 2022) return false;
  const dy = typeof eraAt === 'function' ? eraAt(dc, yr) : dc;
  return !((dy.war || 0) >= 0.2);
};
const studyTable = o => {
  if (STUDY_TO[o]) return STUDY_TO[o];
  const c = CBY[o]; if (!c) return STUDY_R.hi;
  return tongues(o, 3).has('fr') && c.p !== 'hi' ? STUDY_R.fr : STUDY_R[c.p] || STUDY_R.hi;
};
function studyW(o) {
  const t = studyTable(o), w = {};
  for (const d in t) if (studyOpen(o, d)) w[d] = t[d] * ((d === 'SAU' || d === 'EGY') && S.rel !== 'M' ? 0.2 : 1) * studyLim(o, d)[0];
  if (!Object.keys(w).length) for (const d in STUDY_R.hi) if (studyOpen(o, d)) w[d] = STUDY_R.hi[d];
  return w;
}
function studyDests() {
  const w = studyW(S.born), out = [];
  if (!Object.keys(w).length) return out;
  out.push(wpick(w));
  const top = Object.keys(w).sort((a, b) => w[b] - w[a])[0];
  if (!out.includes(top)) out.push(top);
  for (let g = 0; out.length < 3 && g < 20; g++) { const r = Object.assign({}, w); for (const d of out) delete r[d]; if (!Object.keys(r).length) break; out.push(wpick(r)); }
  return out;
}
const ST_COST = { USA: 1.5, GBR: 1.3, AUS: 1.2, CAN: 1.1, NZL: 1.1, IRL: 1.0, SGP: 1.1, CHE: 0.8, NLD: 0.85, SWE: 0.9, DNK: 0.9,
  FIN: 0.8, NOR: 0.55, ISR: 0.8, ARE: 0.8, JPN: 0.65, KOR: 0.6, DEU: 0.45, FRA: 0.5, BEL: 0.5, AUT: 0.45, ESP: 0.55, ITA: 0.5,
  PRT: 0.45, CZE: 0.45, POL: 0.4, HUN: 0.5, SVK: 0.4, GRC: 0.4 };
const stCost = d => ST_COST[d] || clamp(((CBY[d] && CBY[d].ppp) || 20000) / 60000, 0.25, 0.8);
const ADM_K = { USA: 0.85, GBR: 0.9, CAN: 0.95, AUS: 1.05, NZL: 1.05, DEU: 0.85, FRA: 0.95, NLD: 0.9, CHE: 0.75, JPN: 0.95,
  KOR: 1.05, CHN: 1.15, RUS: 1.2, TUR: 1.15, MYS: 1.15, KGZ: 1.2, KAZ: 1.15 };
const SCHOL = { CHN: 0.3, TUR: 0.25, RUS: 0.3, HUN: 0.2, MAR: 0.3, EGY: 0.2, SAU: 0.4, KOR: 0.08, JPN: 0.08, DEU: 0.06 };
const scholP = d => (d === 'CHN' && calYr() < 2000) || ((d === 'SAU' || d === 'EGY') && S.rel !== 'M') || (d === 'MAR' && CBY[S.born].p !== 'ssa') ? 0 : SCHOL[d] || 0;
const EN_PROG = new Set(['DEU', 'NLD', 'SWE', 'DNK', 'FIN', 'NOR', 'CHE', 'BEL', 'AUT', 'FRA', 'ITA', 'ESP', 'POL', 'CZE', 'HUN', 'MYS', 'KOR', 'JPN', 'CHN']);
function stLang(d, grad) {
  const mine = tongues(S.born, S.edu + 1), there = tongues(d, 9);
  if (grad) mine.add('en');
  if ([...mine].some(l => there.has(l)) || (S.flags.knowT || []).some(l => there.has(l))) return true;
  return !!(grad && EN_PROG.has(d));
}
const POST_STUDY = { CAN: 0.85, GBR: 0.85, AUS: 0.8, DEU: 0.8, NZL: 0.8, IRL: 0.75, NLD: 0.7, FIN: 0.65, SWE: 0.6, NOR: 0.6, DNK: 0.6,
  AUT: 0.6, JPN: 0.55, FRA: 0.55, BEL: 0.55, POL: 0.55, CZE: 0.55, PRT: 0.5, ARE: 0.5, USA: 0.45, KOR: 0.45, CHE: 0.45, ESP: 0.45,
  ITA: 0.45, HUN: 0.45, SGP: 0.45, RUS: 0.4, TUR: 0.3, MYS: 0.25, CHN: 0.15, SAU: 0.15 };
const postStudyBase = d => POST_STUDY[d] ?? (((CBY[d] && CBY[d].ppp) || 0) < 20000 ? 0.12 : 0.4);
const postStudyP = (d, grad) => clamp(postStudyBase(d) + (['med', 'nurse', 'eng', 'cs'].includes(S.major) ? 0.08 : 0) + (grad ? 0.05 : 0), 0.08, 0.95);
const PS_WORD = { USA: () => "OPT 1 năm, ngành khoa học - kỹ thuật được đến 3 năm", CAN: () => "giấy phép làm việc sau tốt nghiệp tối đa 3 năm", GBR: () => "thị thực sau tốt nghiệp 2 năm",
  AUS: () => "thị thực sau tốt nghiệp 2-3 năm", DEU: () => "18 tháng ở lại tìm việc", FRA: () => "1 năm ở lại tìm việc", JPN: () => "1 năm ở lại tìm việc",
  KOR: () => "thị thực tìm việc (D-10)", NZL: () => "thị thực làm việc sau tốt nghiệp tối đa 3 năm", IRL: () => "1-2 năm ở lại sau tốt nghiệp", NLD: () => "1 năm tìm việc", };
const psWord = d => { const p = postStudyBase(d), w = PS_WORD[d] && (!S.era || S.era === 'now' || (calYr() >= 2021 && calYr() <= 2035)) ? PS_WORD[d]() : '';
  const lv = p >= 0.75 ? "ở lại làm việc khá dễ" : p >= 0.4 ? "ở lại làm việc được hay không, chừng nửa nọ nửa kia" : "ở lại làm việc khá khó";
  return w ? L`${lv} (${w})` : lv; };
const ONWARD = { GBR: { CAN: 3, AUS: 3, ARE: 2, IRL: 1, NZL: 1, USA: 1 }, USA: { CAN: 4, GBR: 1, ARE: 1, AUS: 1 }, CAN: { USA: 3, AUS: 1, GBR: 1 },
  AUS: { NZL: 2, CAN: 2, GBR: 1, SGP: 1, ARE: 1 }, NZL: { AUS: 4, CAN: 1, GBR: 1 }, IRL: { GBR: 3, CAN: 1, AUS: 1, USA: 1 },
  DEU: { NLD: 2, CHE: 2, AUT: 1, GBR: 1, CAN: 1 }, FRA: { CAN: 2, BEL: 2, CHE: 2, GBR: 1 }, NLD: { DEU: 2, BEL: 1, GBR: 1, CHE: 1 },
  JPN: { USA: 1, AUS: 1, SGP: 1 }, KOR: { USA: 1, AUS: 1, CAN: 1 } };
function onwardTo() {
  const d = S.flags.studyAbroad; if (!d || S.mig || !CBY[d] || CBY[d].ppp < 30000 || !freeExit(C()) || !papersOK()) return null;
  const t = ONWARD[d] || { CAN: 1, AUS: 1, GBR: 1, DEU: 1 }, ks = Object.keys(t).filter(x => x !== S.born && x !== d && CBY[x] && studyOpen(S.born, x));
  if (!ks.length) return null;
  let n = hashStr(nmSeed() + d) % ks.reduce((s, k) => s + t[k], 0);
  for (const k of ks) { n -= t[k]; if (n < 0) return k; }
  return ks[0];
}
const onwardP = t => freeZone(S.born, t) ? 0.85 : clamp(postStudyBase(t) * 0.35 + (['med', 'nurse', 'eng', 'cs'].includes(S.major) ? 0.08 : 0), 0.08, 0.4);
const onwardChoice = () => { const t = onwardTo(); return t ? { k: 'third', label: L`다른 나라 ${CBY[t].ko}에서 일자리를 찾는다`, sub: "không dễ vì bằng cấp không phải của nước đó" } : null; };
const UNI_CITY_P = 0.8;
function uniCity() {
  if (!['uni', 'grad', 'phd'].includes(S.school) || S.urban !== false || studyAway() || S.flags.uniCity != null || S.owns.house || S.refugee || S.nomad || S.job === 'prison' || S.flags.hideCN || rohG()) return;
  S.flags.uniCity = S.age; if (!chance(UNI_CITY_P)) return;
  S.urban = true; S.city = cityOf(C()); S.stats.moves++; S.yearMark = S.yearMark || 'move';
  if (S.age >= 17 && withParents()) { S.flags.left = S.age; S.flags.stayHome = 0; if (S.flags.la == null) S.flags.la = S.age; }
  if (S.fam.married && S.flags.ownHome == null) S.flags.ownHome = S.age;
  log(S.school === 'uni' ? L`대학에 다니려고 ${ro(S.city)} 옮겨 왔습니다.` : L`대학원에 다니려고 ${ro(S.city)} 옮겨 왔습니다.`);
}
function studyLeft() {
  const d = S.flags.studyAbroad; if (!d || S.mig || S.school || S.flags.justGrad) return;
  const due = id => /^(afterUni|gradAbroadEnd|studyto)$/.test(id);
  if ((S.pending && due(S.pending.id)) || S.queue.some(e => e.type === 'dec' && due(e.id))) return;
  S.flags.studyAbroad = null; studyFamHome(); if (!CBY[d] || isWorking()) return;
  if (!S.urban) { S.urban = true; S.city = S.bornCity || cityOf(C()); }
  log(L`${CBY[d].ko}에서 지내던 생활을 정리하고 고향 ${ro(C().ko)} 돌아왔습니다.`);
}
function settleAfterStudy(stay, tried, third) {
  const d = S.flags.studyAbroad; S.flags.studyAbroad = null;
  const W = S.flags.famWait && S.flags.famWait.st ? S.flags.famWait : null, from = S.cur, famCome = to => { if (S.flags.stayHome) { S.flags.stayHome = 0; if (S.flags.left == null) S.flags.left = S.age; } return W && famApart() ? famMove({ to, skilled: true }, from) : ''; };
  if (W && !stay) famJoin();
  if (stay) officeLeave();
  if (third && stay) { S.mig = third; S.cur = third; S.migY = S.age; S.migPen = 0.08; S.flags.skilledMig = 1; S.flags.studyStay = S.age; S.stats.moves++; S.urban = true; S.city = cityOf(CBY[third]); S.done.abroad2 = 1; S.yearMark = 'move'; const fc = famCome(third); logA('fly:' + CBY[third].p, L`${CBY[d].ko}에서 받은 학위로 ${CBY[third].ko}에서 일자리를 구했습니다. ${S.city}에 자리를 잡았습니다.` + (fc ? ' ' + fc : ''), 'big'); return; }
  if (third) { if (!S.urban) { S.urban = true; S.city = S.bornCity || cityOf(C()); } log(L`${CBY[third].ko}에서 일자리를 구하지 못해 고향 ${ro(C().ko)} 돌아왔습니다.`, 'bad'); return; }
  if (stay) { S.mig = d; S.cur = d; S.migY = S.age; S.migPen = 0.05; S.flags.skilledMig = 1; S.flags.studyStay = S.age; S.stats.moves++; S.urban = true; S.city = S.flags.saCity || cityOf(CBY[d]); S.done.abroad2 = 1; S.yearMark = 'move'; const fc = famCome(d); log(L`유학한 ${CBY[d].ko}에 남아 일하기로 했습니다. ${S.city}에 자리를 잡았습니다.` + (fc ? ' ' + fc : ''), 'big'); return; }
  { const D = S.fam.dating; if (D && D.nat === d && d !== S.cur && !D.far) D.far = d; }
  if (!S.urban) { S.urban = true; S.city = S.bornCity || cityOf(C()); }
  log(tried ? L`${CBY[d].ko}에서 취업 비자를 받지 못해 고향 ${ro(C().ko)} 돌아왔습니다.` : L`${CBY[d].ko}에서의 공부를 마치고 고향 ${ro(C().ko)} 돌아왔습니다.`, tried ? 'bad' : 'big');
}
const homeLetOK = iso => S.house > 0 && !!S.owns.house && rentals().length < RENT_MAX && !S.refugee && S.job !== 'prison' && iso !== 'PRK' && !commEra(iso);
const homeKeepP = () => C().ppp < 20000 ? 0.75 : 0.55;
function homeLet(from) {
  rentals().push({ v: S.house, p: S.house, at: S.owns.house, c: from, k: 'b', own: 1, paid: S.flags.hPaid || 0 }); S.house = 0; S.flags.hPaid = 0; delete S.owns.house;
  return L`${CBY[from].ko}의 집은 팔지 않고 세를 주었습니다. 관리는 그곳 중개업체에 맡겼습니다.`;
}
function sellHomeOnLeaving(from) {
  if (!(S.house > 0) || !S.owns.house) return '';
  const v = S.house * 0.94, n0 = netWorth(), pl = paidLine(); S.money += v; S.house = 0; S.flags.hPaid = 0; delete S.owns.house; bookSince(n0, "Bán nhà");
  return L`${CBY[from].ko}의 집은 팔았습니다. (+${wonStr(v)})` + pl;
}
function cityHomeLeave() {
  if (!(S.house > 0) || !S.owns.house) return '';
  if (homeLetOK(S.cur) && chance(homeKeepP())) { rentals().push({ v: S.house, p: S.house, at: S.owns.house, c: S.cur, k: 'b', own: 1, paid: S.flags.hPaid || 0 }); S.house = 0; S.flags.hPaid = 0; delete S.owns.house;
    return ' ' + "Bạn không bán ngôi nhà đã ở mà cho thuê lại."; }
  const v = S.house * 0.94, n0 = netWorth(), pl = paidLine(); S.money += v; S.house = 0; S.flags.hPaid = 0; delete S.owns.house; bookSince(n0, "Bán nhà");
  return ' ' + L`살던 집은 팔았습니다. (+${wonStr(v)})` + pl;
}
const TONGUE = { en: 'USA,GBR,CAN,AUS,NZL,IRL,JAM,SGP,TTO,GUY,MLT', es: 'ESP,MEX,COL,ARG,PER,VEN,CHL,ECU,GTM,CUB,BOL,DOM,HND,PRY,SLV,NIC,CRI,PAN,URY,GNQ,PRI',
  pt: 'PRT,BRA,AGO,MOZ,GNB,CPV', fr: 'FRA,BEL,CHE,CAN,HTI,LUX', de: 'DEU,AUT,CHE,LUX', ru: 'RUS,BLR,KAZ,KGZ,UKR', zh: 'CHN,TWN,SGP,HKG,MAC',
  ar: 'SAU,ARE,EGY,JOR,IRQ,SYR,LBN,MAR,DZA,TUN,LBY,KWT,QAT,OMN,YEM,SDN,PSE,MRT,BHR', ko: 'KOR,PRK',
  el: 'GRC,CYP', ro: 'ROU,MDA', sq: 'ALB,XKX', sh: 'SRB,HRV,BIH,MNE', nl: 'NLD,SUR' };
const TONGUE_EDU = { en: [3, 'NGA,GHA,KEN,UGA,ZAF,ZMB,ZWE,SLE,LBR,MWI,PHL,TZA,RWA,BWA,NAM,LSO,GMB,PNG,CMR,FJI,SLB,BTN,MDV,MUS,SWZ,HKG,CYP'], en4: [4, 'IND,PAK,BGD,LKA,NPL,MYS'],
  fr: [3, 'SEN,CIV,MLI,BFA,NER,GIN,COD,COG,CMR,MDG,TCD,BEN,TGO,GAB,CAF,BDI,RWA,DJI,COM,MUS'], fr4: [4, 'DZA,MAR,TUN,LBN'], ru: [3, 'UZB,TJK,TKM,AZE,GEO,ARM,MDA,LVA,EST'] };
function tongues(id, edu) {
  const out = new Set(Object.keys(TONGUE).filter(l => TONGUE[l].split(',').includes(id)));
  for (const k in TONGUE_EDU) { const [e, list] = TONGUE_EDU[k]; if (edu >= e && list.split(',').includes(id)) out.add(k.replace('4', '')); }
  return out;
}
const MIG_COMM = { USA: 'lac', ESP: 'lac', GBR: 'sa', FRA: 'mena,ssa', DEU: 'eca,mena', NLD: 'mena', BEL: 'mena', ITA: 'eca,mena', CAN: 'sa,eap', AUS: 'eap,sa',
  RUS: 'eca', ZAF: 'ssa', ARG: 'lac', CHL: 'lac', JPN: '', KOR: '' };
function intlNat(c) {
  const mp = MIX_P[c.id], w = {};
  if (mp) { const t = S.sex === 'M' ? mp.m : mp.f; for (const k in t) if (CBY[k]) w[k] = t[k]; }
  else for (const x of COUNTRIES) if (x.id !== c.id && x.id !== S.born && (x.mig || '').split(',').includes(c.id)) w[x.id] = Math.sqrt(x.b);
  if (!Object.keys(w).length) for (const x of COUNTRIES) if (x.id !== c.id && x.p === c.p) w[x.id] = Math.sqrt(x.b);
  return Object.keys(w).length ? wpick(w) : null;
}
const intlBroker = () => ['KOR', 'TWN', 'JPN'].includes(S.cur) && S.sex === 'M' && (S.age >= 35 || !S.urban);
const intlOK = () => !S.flags.ss && S.age >= 22 && S.age <= 60 && !studyAway();
const intlCost = () => incomeAt(C(), 0.5) * (intlBroker() ? 0.6 : 0.03);
function candNat() {
  if (rohCamp()) return S.cur === S.born ? null : S.born;
  const sa = studyAway();
  if (sa && CBY[sa] && sa !== S.born) {
    const c = CBY[sa], b = BB(), y = Math.max(0, S.schoolY || 0), h = tongues(sa, 9), tg = [...tongues(S.born, S.edu)].some(l => h.has(l));
    const near = (b.p === c.p && b.p !== 'hi') || tg || (MIG_COMM[c.id] || '').split(',').includes(b.p);
    let pl = near ? clamp(0.2 + 0.025 * y, 0.2, 0.6) : clamp(0.45 + 0.03 * y, 0.45, 0.85) * (tg || y >= 1 ? 1 : 0.85);
    if (GULF.includes(c.id)) pl *= 0.1;
    if (chance(pl)) return sa;
    if (chance(0.15)) { const ts = tongues(S.born, 0), nb = COUNTRIES.filter(x => x.id !== S.born && x.id !== sa && x.p === b.p && [...tongues(x.id, 0)].some(l => ts.has(l))); if (nb.length) return pick(nb).id; }
    return S.born;
  }
  if (!S.mig || S.cur === S.born) return null;
  const c = C(), b = BB(), y = S.age - S.migY, kid = famCame() && S.migY < 16, near = (b.p === c.p && b.p !== 'hi') || sameTongue() || (MIG_COMM[c.id] || '').split(',').includes(b.p);
  let pl = kid ? 0.8 : near ? clamp(0.2 + 0.025 * y, 0.2, 0.6) : clamp(0.45 + 0.03 * y, 0.45, 0.85) * (speaksHere() ? 1 : 0.85);
  if (S.refugee) pl *= 0.4;
  if (GULF.includes(c.id)) pl *= 0.1;
  if (chance(pl)) return S.cur;
  if (chance(0.15)) { const ts = tongues(S.born, 0), nb = COUNTRIES.filter(x => x.id !== S.born && x.id !== S.cur && x.p === b.p && [...tongues(x.id, 0)].some(l => ts.has(l))); if (nb.length) return pick(nb).id; }
  return S.born;
}
const NAT_NAME = {
  KOR: { b: "Khi nhập quốc tịch, tên được ghi vào sổ đăng ký quan hệ gia đình bằng chữ Hangul. Có thể ghi tên cũ theo cách đọc, hoặc tự lập họ và bản quán mới để đặt một cái tên Hàn Quốc.", f: "Người nhập quốc tịch có thể phiên tên gốc sang chữ Hangul, hoặc lập mới tên, họ và bản quán kiểu Hàn Quốc (Luật Đăng ký quan hệ gia đình; tòa án cho phép lập họ và bản quán)", t: "Bạn đã đăng ký tên gốc viết bằng chữ Hangul theo cách đọc." },
  JPN: { b: "Khi nhập quốc tịch, tên được ghi vào sổ hộ tịch bằng chữ Hán (kanji) hoặc kana. Có thể viết tên gốc bằng katakana, hoặc đặt một tên Nhật mới.", f: "Cho đến thập niên 1980, người nhập quốc tịch Nhật Bản thường được khuyên nên dùng tên kiểu Nhật; ngày nay có thể viết tên gốc bằng katakana (Bộ Tư pháp Nhật Bản)", t: "Bạn đã đăng ký tên gốc viết bằng katakana theo cách đọc." },
  TWN: { b: "Muốn nhập quốc tịch phải có tên tiếng Trung. Có thể chuyển tên gốc sang chữ Hán theo cách đọc, hoặc đặt một tên mới theo ý nghĩa.", f: "Đài Loan yêu cầu người nhập quốc tịch đăng ký tên tiếng Trung (Quy định thi hành Luật Quốc tịch của Đài Loan)", t: "Bạn đã đăng ký tên gốc chuyển sang chữ Hán theo cách đọc." },
};
const natNameOK = c => !!NAT_NAME[c.id] && clusterFor(c, relPick(c)) !== S.cl && S.flags.natName == null;
const natJpSpouse = c => { const P = S.fam.partner; return c.id === 'JPN' && S.fam.married && legalWed() && P && P.alive && !P.divorced && !P.ss && P.name && P.name.cl === 'ja' ? P : null; };
const natWord = iso => L`${CBY[iso].ko} 사람`;
const natObjP = c => clamp((['JPN', 'KOR', 'CHN', 'TWN'].includes(c.id) ? 0.3 : ['sa', 'mena'].includes(c.p) ? 0.4 : 0.12) * (calYr() < 1990 ? 1.4 : 1), 0, 0.6);
const natFact = c => c.id === 'KOR' ? "Năm 2023, 10,6% số cuộc hôn nhân ở Hàn Quốc có một bên là người nước ngoài (Statistics Korea)" : c.id === 'JPN' ? "Ở Nhật Bản, hôn nhân có một bên là người nước ngoài nhiều nhất vào năm 2006, chiếm khoảng 6% số cuộc hôn nhân (Bộ Y tế, Lao động và Phúc lợi Nhật Bản, thống kê dân số)" : "Người nhập cư càng sống lâu ở một nước, ngôn ngữ và văn hóa càng gần với mình, thì càng hay kết hôn với người sinh ra ở nước đó (Dribe & Lundh 2011)";
const sharedTongue = (a, b) => { if (!a || !b || a === b) return true; const h = tongues(b, 0); return [...tongues(a, 0)].some(l => h.has(l)); };
const sameTongue = () => { const h = tongues(S.cur, 9); return [...tongues(S.born, S.edu)].some(l => h.has(l)); };
const speaksHere = () => !S.mig || S.migY < 15 || S.age - S.migY >= 10 || sameTongue() || knowsHere();
const knowsHere = () => { const k = S.flags.knowT; if (!k || !k.length) return false; const h = tongues(S.cur, 9); return k.some(l => h.has(l)); };
function learnTongues() {
  const add = id => { const k = S.flags.knowT || (S.flags.knowT = []); for (const l of tongues(id, 9)) if (!k.includes(l)) k.push(l); };
  if (S.mig && (S.age - S.migY >= 10 || S.migY < 15)) add(S.cur);
  const sa = studyAway(); if (sa && (awayTrainee() ? S.flags.trainee.y >= 2 : S.schoolY >= 2)) add(sa);
}
function emigrate(to, skilled, refugee, o = {}) {
  S.flags.irreg = null;
  S.flags.studyAbroad = null;
  if (o.post && S.house > 0 && S.owns.house) { rentals().push({ v: S.house, p: S.house, at: S.owns.house, c: S.cur, k: 'b', own: 1 }); S.house = 0; delete S.owns.house; log("Bạn cho thuê ngôi nhà đang ở rồi ra đi."); }
  const sold = refugee || o.post ? '' : o.keep && homeLetOK(S.cur) ? homeLet(S.cur) : sellHomeOnLeaving(S.cur); if (sold) log(sold);
  for (const k of S.fam.kids) if (k.alive && k.away && !k.awayIn) k.awayIn = S.cur;
  if (S.mig && S.cur !== S.born && !refugee) {
    const from = S.cur, left = kidsStay(from); S.flags.onward = S.age; S.flags.prevMig = from; S.flags.pr = null; S.flags.noPath = 0; S.flags.last_prq = S.flags.last_natq = null;
    if (left) log(left === 1 ? L`그곳에서 자란 아이는 ${CBY[from].ko}에 남았습니다.` : L`그곳에서 자란 아이들은 ${CBY[from].ko}에 남았습니다.`);
  }
  else if (!refugee && !o.post && S.fam.kids.some(k => k.alive && !k.abroad && !k.away && S.age - k.bornAt >= 18)) {
    const from = S.cur, left = kidsStay(from);
    if (left) log(left === 1 ? L`다 자란 아이는 ${CBY[from].ko}에 남았습니다.` : L`다 자란 아이들은 ${CBY[from].ko}에 남았습니다.`);
  }
  if (S.age >= 18 && !(refugee && withParents())) petStay(false);
  if (S.fam.dating && !S.fam.dating.nat) S.fam.dating.nat = S.cur;
  { const D = S.fam.dating; if (D && !(refugee && withParents())) D.far = D.far === to ? null : D.far || S.cur; }
  S.flags.famCame = (S.age < 18 || (refugee && withParents())) ? 1 : 0;
  S.flags.homeSt = null;
  officeLeave(); S.mig = to; S.cur = to; S.migY = S.age; S.stats.moves++;
  if (!refugee && S.age >= 18 && S.flags.stayHome) { S.flags.stayHome = 0; if (S.flags.left == null) S.flags.left = S.age; }
  S.migPen = refugee ? 0.25 : skilled ? 0.05 : 0.18; if (skilled) S.flags.skilledMig = 1;
  S.urban = true; S.city = cityOf(CBY[to]);
  if (refugee) { S.refugee = true; S.refugeeUntil = S.refugeeUntil || S.age + ri(3, 9); }
  eff({ so: -12, h: refugee ? -6 : 4 });
  if (S.age >= 15 && !S.school && !S.retired) {
    if (S.job === 'owner') { const bx = refugee ? '' : bizLeave(); S.flags.bizK = null; S.flags.bizBig = 0; S.flags.bizL = 0; if (bx) log(bx); }
    if (S.job === 'clergy') { S.yearMark = 'move'; S.done.abroad2 = 1; kidsHereAgain(); return; }
    const X = expMap(), mx = {}; for (const k of MIG_STAY) if (X[k] && X[k][0]) mx[k] = X[k][0]; S.flags.migX = Object.keys(mx).length ? mx : null;
    const m = S.flags.mig && S.flags.mig.to === to ? S.flags.mig : null;
    const findP = o.post ? 0.35 : refugee ? 0 : skilled ? 0.85 : m && m.easy ? 0.6 : m && m.legal && !m.zone ? 1 : m && m.zone ? 0.6 : 0.5;
    const keep = skilled && !refugee && !o.post && isWorking() && JOBS[S.job] && JOBS[S.job].e >= 3 && !MIG_STAY.includes(S.job) && !RARE_JOBS.includes(S.job) && !JOBS[S.job].special;
    if (keep) { if (chance(findP)) { const c2 = C(), [lo, hi] = jobRange(S.job, c2); takeJob({ id: S.job, formal: chance(clamp(1 - informal(c2) * 0.3, 0.02, 0.98)), pct: Math.max(clamp(lo + (hi - lo) * (0.15 + 0.3 * rnd()), 0.004, 0.99), minPct(c2, S.job, true)) }); } else { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; } }
    else { const offers = jobOffers(1);
    if (offers[0] && chance(findP)) takeJob(offers[0]); else { if (isWorking()) S.flags.lastJob = S.job; if (o.post) S.job = 'homemaker'; else { S.job = 'seeking'; S.flags.seekY = 0; } } }
  }
  S.yearMark = 'move'; S.done.abroad2 = 1; kidsHereAgain();
}
const FAM_NO = new Set(['SAU', 'ARE', 'QAT', 'KWT', 'OMN', 'BHR', 'MYS', 'SGP', 'KOR', 'JPN', 'TWN', 'THA']);
const famRoute = m => m.zone || m.skilled || m.easy || m.hw || (m.legal && !FAM_NO.has(m.to)) ? 'tog' : 'wait';
const famPt = () => { const f = S.fam, P = f.partner; return !!(f.married && P && P.alive && !P.divorced); };
const ptAway = () => { const P = S.fam.partner; return !!(S.fam.married && P && P.alive && !P.divorced && (P.lb || P.joinAt > S.age || P.postEnd > S.age)); };
const dateFar = () => { const D = S.fam.dating; return !!(D && D.far && D.far !== S.cur && CBY[D.far]); };
const kidsApartK = () => { const P = S.fam.partner; if (!P || !P.lb) return 1; return S.sex === 'F' || S.flags.irreg != null || !tripOutOK() ? 0 : 0.35; };
const famKidsNow = () => S.fam.kids.filter(k => k.alive && !k.grown && !k.placed && (!k.away || k.lb) && S.age - k.bornAt < 18);
const famApart = () => !!((famPt() && S.fam.partner.lb) || S.fam.kids.some(k => k.alive && k.lb));
const homeOld = () => S.retired || S.age >= retireAge(C());
const homeTurn = () => { const H = S.flags.homeSt; if (!H) return true; const old = homeOld();
  return (old && !H.o) || (H.w && !isWorking() && !old && !S.school) || (H.p && !famPt()) || famApart(); };
const famWho = (pt, n) => pt ? (n > 1 ? "bạn đời và các con" : n ? "bạn đời và con" : L`배우자${LBL}`) : n > 1 ? "các con" : L`아이${LBL}`;
const famWaitW = () => { const W = S.flags.famWait; if (!W || !famApart() || !CBY[W.from] || (S.cur === W.from && !(W.st && S.flags.studyAbroad))) return '';
  return L`${eun(famWho(famPt() && S.fam.partner.lb, S.fam.kids.filter(k => k.alive && k.lb).length))} ${CBY[W.from].ko}에서 기다림`; };
const FAMJ_F = () => "Di cư theo diện gia đình chiếm phần lớn nhất trong nhập cư lâu dài vào các nước giàu. Để đón gia đình sang phải chờ một hai năm, có khi vài năm (OECD International Migration Outlook)";
const PAR_ROUTE = { USA: [0.5, 'natz', 2500], CAN: [0.3, 'pr', 2500], AUS: [0.15, 'pr', 8000], NZL: [0.2, 'pr', 4000], SGP: [0.25, 'pr', 1500],
  SAU: [0.3, 'pay', 3000], ARE: [0.3, 'pay', 3000], QAT: [0.3, 'pay', 3000], KWT: [0.3, 'pay', 3000], OMN: [0.3, 'pay', 3000], BHR: [0.3, 'pay', 3000] };
const parRoute = m => m.zone ? 'now' : famRoute(m) === 'tog' && PAR_ROUTE[m.to] ? 'later' : null;
const parToBring = k => S.fam[k].alive && !(k === 'dad' && S.fam.dad.absent) && S.flags.careHome !== k;
const parLive = () => (parToBring('mom') ? 1 : 0) + (parToBring('dad') ? 1 : 0);
const parOld = () => Math.max(parToBring('mom') ? S.fam.mom.age : 0, parToBring('dad') ? S.fam.dad.age : 0);
const parBringW = () => S.flags.careHome && parLive() === 1 ? (parToBring('mom') ? "mẹ" : "bố") : parW();
const parYesP = () => parOld() >= 70 ? 0.5 : 0.68;
const parGoOK = m => !!m && S.age >= 18 && parLive() > 0 && !famCame() && S.flags.parCame == null && !!parRoute(m) && parOld() < 85;
const PAR_F = () => "Không nhiều nước cho người nhập cư đón bố mẹ sang. Mỹ nhận bố mẹ của công dân, nhưng Canada mỗi năm bốc thăm chọn một số người nộp đơn, còn thị thực cho bố mẹ ở Úc phải chờ nhiều năm (USCIS, IRCC, Department of Home Affairs)";
const famGP = () => { const f = S.fam; return (f.mom.alive && f.mom.age < 75) || (f.dad.alive && !f.dad.absent && f.dad.age < 75); };
function famNote(m) {
  const pt = famPt(), n = famKidsNow().length; if (!pt && !n) return '';
  if (famRoute(m) === 'wait' && !pt && !famGP()) return '';
  return famRoute(m) === 'tog' ? L`${famWho(pt, n)}도 함께 갈 수 있습니다.` : L`이 길로는 가족을 데려갈 수 없어 ${eun(famWho(pt, n))} 한동안 고향에서 기다려야 합니다.`;
}
function famMove(m, from, k) {
  const f = S.fam, P = f.partner, pt = famPt(), ks = famKidsNow(), out = [], fm = CBY[from] || B();
  if (famRoute(m) === 'wait') for (const x of f.kids) if (x.alive && !x.abroad && !x.away && !x.placed && !x.grown && S.age - x.bornAt >= 18) { x.abroad = from; x.grown = 1; x.withMe = 0; x.stay = 0; x.near = 0; x.city = null; }
  if (pt || ks.length) {
    const gp = famGP();
    if (famRoute(m) === 'wait' && (pt || gp) && !famApart()) {
      if (pt) { P.lb = 1; P.lbIn = from; }
      for (const x of ks) { x.lb = 1; x.away = 1; x.awayIn = from; }
      S.flags.famWait = { at: S.age, from }; eff({ h: -4, so: -2 });
      out.push(pt ? L`이 길로는 가족을 데려갈 수 없어, ${eun(famWho(pt, ks.length))} ${fm.ko}에서 기다리기로 했습니다.` : ks.length > 1 ? L`이 길로는 아이들을 데려갈 수 없어, ${fm.ko}에 계신 ${parW()}께 아이들을 맡기고 왔습니다.` : L`이 길로는 아이를 데려갈 수 없어, ${fm.ko}에 계신 ${parW()}께 아이를 맡기고 왔습니다.`);
    } else if (!famApart() || famRoute(m) === 'tog') {
      const was = famApart(); famJoin();
      if (pt && !P.ret && P.inc > 0 && !(P.out > 0)) { P.out = ri(1, 2); P.mvOut = 1; }
      eff({ so: 6 });
      out.push(was ? L`기다리던 ${famWho(pt, ks.length)}도 이번에는 함께 건너왔습니다.` : L`${famWho(pt, ks.length)}도 함께 건너왔습니다.`);
    }
  }
  if (k === 'gop' && parGoOK(m)) {
    const r = parRoute(m);
    if (!chance(parYesP())) out.push(L`${parBringW()}께서는 고향을 떠나지 않겠다고 하셨습니다.`);
    else if (r === 'now') { const x = usd2ppp(fm, 800) * parLive(); S.money -= x; out.push(L`${parBringW()}께서도 함께 건너와 한집에서 살게 되었습니다. (−${wonStr(x)})`); parArrive(); }
    else { S.flags.parPlan = { at: S.age, to: m.to }; out.push(L`자리를 잡으면 ${eul(parBringW())} 모셔 오기로 했습니다.`); }
  }
  return out.join(' ');
}
function kidsHereAgain() { for (const k of S.fam.kids) if (k.alive && k.abroad && k.abroad === S.cur) { k.abroad = 0; k.near = 0; k.city = null; } }
function studyFamWait() {
  const P = S.fam.partner, ks = famKidsNow().filter(k => !k.lb);
  if (!famPt() || P.lb) return '';
  P.lb = 1; P.lbIn = S.cur; for (const k of ks) { k.lb = 1; k.away = 1; k.awayIn = S.cur; }
  S.flags.famWait = { at: S.age, from: S.cur, st: 1 };
  return L`${eun(famWho(true, ks.length))} ${C().ko}에서 기다리기로 했습니다.`;
}
const studyFamHome = () => { if (S.flags.famWait && S.flags.famWait.st) famJoin(); };
function famJoin() {
  const P = S.fam.partner; if (P) { P.lb = 0; P.lbIn = null; }
  for (const k of S.fam.kids) if (k.lb) { k.lb = 0; k.away = 0; k.awayIn = 0; }
  S.flags.famWait = null;
}
function famWidow() {
  const W = S.flags.famWait, P = S.fam.partner; if (P) { P.lb = 0; P.lbIn = null; }
  const ks = S.fam.kids.filter(k => k.alive && k.lb); if (!ks.length || !W) { famJoin(); return; }
  if (!FAM_NO.has(S.cur) && S.flags.irreg == null) { famJoin(); log(ks.length > 1 ? L`${CBY[W.from].ko}에서 기다리던 아이들을 데려와 함께 살게 되었습니다.` : L`${CBY[W.from].ko}에서 기다리던 아이를 데려와 함께 살게 되었습니다.`, 'note'); return; }
  log(ks.length > 1 ? L`${CBY[W.from].ko}의 가족들이 아이들을 맡아 돌봐 주기로 했습니다.` : L`${CBY[W.from].ko}의 가족들이 아이를 맡아 돌봐 주기로 했습니다.`, 'note');
}
function parArrive() { const m = parToBring('mom'), d = parToBring('dad'); S.flags.parCame = S.age; S.flags.parPlan = null; eff({ so: 6, h: 3 }); if (m) btAdd(S.fam.mom, 4); if (d) btAdd(S.fam.dad, 4); }
function famWaitYear(a) {
  const W = S.flags.famWait; if (!W) return;
  if (W.st && S.flags.studyAbroad && !S.mig) return;
  if (!famApart() || !S.mig || S.cur === W.from) { famJoin(); return; }
  if (S.job === 'prison' || S.flags.hideCN || S.isComp) return;
  const c = C(), y = a - W.at, pt = famPt() && S.fam.partner.lb, n = S.fam.kids.filter(k => k.alive && k.lb).length;
  const x = incomeAt(c, 0.5) * 0.05; S.money -= x; book("Chi phí đi lại thăm gia đình ở quê", -x);
  if (y < 1) return;
  const irr = S.flags.irreg != null, settled = S.flags.natz === S.cur || S.flags.pr != null;
  const p = settled ? 0.6 : irr ? 0.15 : S.flags.regAt != null ? 0.4 : GULF.includes(c.id) || c.id === 'BHR' ? (isWorking() && S.pct >= 0.45 ? 0.25 : 0.03) : FAM_NO.has(c.id) ? (y >= 4 ? 0.06 : 0) : 0.4;
  if (chance(p)) {
    const who = famWho(pt, n); famJoin(); S.money -= x * (1 + n); book("Chi phí đón gia đình sang", -x * (1 + n));
    const P = S.fam.partner; if (pt && !P.ret && P.inc > 0 && !(P.out > 0)) { P.out = ri(1, 2); P.mvOut = 1; }
    eff({ h: 8, so: 5 }); S.yearMark = S.yearMark || 'love';
    log(irr ? L`${iga(who)} 먼 길을 건너 ${ro(c.ko)} 왔습니다. 머물 허가는 아직 없지만, 다시 한집에 살게 되었습니다.` : L`기다리던 가족 초청 비자가 나와 ${iga(who)} ${ro(c.ko)} 건너왔습니다. 다시 한집에 살게 되었습니다.`, 'warm', FAMJ_F());
    return;
  }
  eff({ h: -1 });
  const vc = !eraBefore(2010);
  if (chance(0.3)) log(varied('famwait', [n ? (vc ? "Qua cuộc gọi video, các con kể mãi chuyện ở trường." : "Qua cuộc gọi quốc tế, bọn trẻ kể mãi chuyện ở trường.") : vc ? "Bạn gọi video với bạn đời ở quê đến tận khuya." : "Bạn gọi điện quốc tế cho người bạn đời ở quê đến tận khuya.",
    pt ? "Gọi điện cho bạn đời, hai người bàn xem bao giờ mới được sống cùng nhau." : "Bạn gọi điện về quê hỏi thăm tin tức các con.",
    ...(irr ? [] : [n ? "Bạn được nghỉ phép về quê. Buổi sáng ngày quay lại, đứa con níu tay bạn ở sân bay rất lâu không buông." : "Bạn được nghỉ phép về quê. Mấy ngày ngắn ngủi trôi qua thật nhanh."])]), 'note');
}
const parWay = () => freeZone(S.born, S.cur) ? 'now' : PAR_ROUTE[S.cur] ? 'later' : null;
const parBringOK = () => !!S.mig && S.cur !== S.born && S.age >= 20 && !!parWay() && parLive() > 0 && !famCame() && S.flags.parCame == null && !S.flags.parPlan && parOld() < 85
  && !(S.flags.parNo != null && S.age - S.flags.parNo < 5) && S.flags.irreg == null && !S.refugee && S.job !== 'prison' && !S.flags.hideCN && !(S.serveLeft > 0);
function parBringDesc() {
  const w = parWay(), r = PAR_ROUTE[S.cur]; if (w === 'now' || !r) return "Ngỏ lời mời sang sống cùng · có thể sang ngay, không cần thị thực";
  const x = wonStr(usd2ppp(C(), r[2]) * parLive());
  return r[1] === 'natz' ? L`초청을 준비해요 · 이 나라 시민이 되어야 신청할 수 있어요 · 오실 때 약 ${x}` : r[1] === 'pr' ? L`초청을 준비해요 · 영주권이 있어야 신청할 수 있어요 · 오실 때 약 ${x}` : L`초청을 준비해요 · 벌이가 넉넉해야 비자가 나와요 · 오실 때 약 ${x}`;
}
function parBringStart() {
  if (!chance(parYesP())) { S.flags.parNo = S.age; eff({ h: -2 }); return L`${parBringW()}께 함께 살자고 여쭸지만, 고향을 떠나지 않겠다고 하셨습니다.`; }
  if (parWay() === 'now') { const w = parBringW(); parArrive(); S.yearMark = S.yearMark || 'love'; return L`${w}께서 ${ro(C().ko)} 건너오셔서 한집에서 함께 살게 되었습니다.`; }
  S.flags.parPlan = { at: S.age, to: S.cur }; eff({ h: 2 });
  return L`${eul(parBringW())} 모셔 오기로 하고 초청 서류를 준비하기 시작했습니다.`;
}
function parPlanYear(a) {
  const pl = S.flags.parPlan; if (!pl) return;
  if (!parLive() || !S.mig || S.cur !== pl.to || S.flags.parCame != null || parOld() >= 88 || !PAR_ROUTE[S.cur]) { S.flags.parPlan = null; return; }
  if (S.job === 'prison' || S.flags.irreg != null) return;
  const r = PAR_ROUTE[S.cur], ok = r[1] === 'natz' ? S.flags.natz === S.cur : r[1] === 'pr' ? S.flags.pr != null || S.flags.natz === S.cur : isWorking() && S.pct >= 0.6;
  const x = usd2ppp(C(), r[2]) * parLive();
  if (!ok) return;
  if (pl.ask == null) { pl.ask = a; log(L`${eul(parBringW())} 모셔 오려고 초청을 신청했습니다. 차례를 기다립니다.`, 'note'); return; }
  if (S.money < x || !chance(r[0])) return;
  S.money -= x; book("Chi phí bảo lãnh bố mẹ", -x);
  log(L`기다리던 초청 비자가 나와 ${parBringW()}께서 ${ro(C().ko)} 건너오셨습니다. 한집에서 함께 살게 되었습니다. (−${wonStr(x)})`, 'warm', PAR_F());
  parArrive(); S.yearMark = S.yearMark || 'love';
}
const MIL_PEN_Y = 20, MIL_PEN_LATE = new Set(['JPN']);
const milYrs = () => (S.exp && S.exp.soldier && S.exp.soldier[0]) || 0;
const milPenV = () => { const f = S.flags, y = milYrs(); if (f.milPen) return f.milPen.v; return y >= MIL_PEN_Y && f.milInc > 0 && !MIL_PEN_LATE.has(f.milC || S.cur) ? f.milInc * Math.min(0.5, 0.32 + 0.018 * (y - MIL_PEN_Y)) : 0; };
function pensionAmount() {
  const b = pensionBase(), mp = milPenV(); if (!mp) return b;
  const fy = Math.max(S.formalY || 0, milYrs());
  return Math.max(b, mp + b * Math.max(0, fy - milYrs()) / fy);
}
function milPenYear() {
  const f = S.flags; if (f.milPen || S.job === 'soldier' || S.serveLeft > 0) return;
  const v = milPenV(); if (!v) return;
  f.milPen = { v, at: S.age };
  if (!S.retired) log(L`${milYrs()}년 동안 복무한 군을 떠나 군인연금을 받기 시작했습니다.` + ' ' + L`다른 일을 해도 연금은 계속 나옵니다. (한국 체감 월 ${wonStr(v / 12)})`, 'ev', milPenFact());
}
const milPenFact = () => (S.flags.milC || S.cur) === 'KOR' ? "Ở Hàn Quốc, quân nhân phục vụ từ 20 năm trở lên được nhận lương hưu quân nhân suốt đời từ tháng sau khi xuất ngũ, không kể tuổi (Luật Lương hưu Quân nhân, Điều 21)"
  : "Ở nhiều nước, quân đội trả lương hưu cho quân nhân phục vụ khoảng 20 năm ngay từ ngày xuất ngũ, không kể tuổi." + ' ' + "Ở Mỹ, phục vụ 20 năm được 40-50% lương cơ bản, 30 năm được 60-75% (Bộ Quốc phòng Mỹ)";
function pensionBase() {
  const c = C();
  const covered = c.p === 'hi' || c.p === 'eca' || S.formalY >= 10 || (c.p === 'lac' && chance(0.5));
  const rep = (c.p === 'hi' ? 0.45 : 0.35) * eraPenK(c);
  const here = covered ? Math.max(incomeAt(c, 0.5) * 0.25 * eraPenK(c), Math.max(S.income, S.flags.careerInc || 0) * rep * (S.formalY >= 10 ? 1 : 0.6)) : 0;
  const yrs = {}; let tot = 0;
  const md = {}, mdOf = k => md[k] || (md[k] = incomeAt(CBY[k], 0.5));
  for (const y of S.years || []) if (y.a >= 20 && y.cur && CBY[y.cur] && y.inc >= mdOf(y.cur) * 0.25) { const o = yrs[y.cur] || (yrs[y.cur] = [0, 0]); o[0]++; o[1] += y.inc; tot++; }
  const away = Object.keys(yrs).filter(k => k !== S.cur);
  if (!tot || !away.length) return here;
  const hy = yrs[S.cur], hereH = !covered || !hy ? 0 : Math.max(incomeAt(c, 0.5) * 0.25 * eraPenK(c), hy[1] / hy[0] * rep * (S.formalY >= 10 ? 1 : 0.6));
  let p = hereH * ((hy ? hy[0] : 0) / tot);
  for (const k of away) { const x = CBY[k]; if (x.p === 'hi' || x.p === 'eca') p += yrs[k][1] / yrs[k][0] * (x.p === 'hi' ? 0.45 : 0.35) * eraPenK(x) * (yrs[k][0] / tot); }
  return p;
}
function hobDef(id) {
  if (!HOBBIES[id] && id.startsWith('sp_')) HOBBIES[id] = Object.assign({}, HOBBIES.sport, { n: SPORTS[id.slice(3)] || id.slice(3) });
  return HOBBIES[id] || HOBBIES.sport;
}
const HOB_SOLO = new Set(['screen', 'sns', 'faith']), HOB_TALK_NO = new Set(['screen', 'sns', 'faith']);
const HOB_ACT = { music: () => "Bạn lập một ban nhạc nhỏ với những người hợp ý và biểu diễn ở các sự kiện trong khu phố.", dance: () => "Bạn cùng các thành viên câu lạc bộ lên sân khấu lễ hội địa phương biểu diễn múa.",
  art: () => pick(["Bạn cùng câu lạc bộ tổ chức một triển lãm nhỏ và treo vài bức tranh của mình.", "Đi xem triển lãm nhiều, bạn đã có một họa sĩ mình yêu thích."]), sport: n => L`${n} 모임을 직접 꾸려 주말마다 사람들을 모았습니다.`,
  photo: () => "Bạn mang những bức ảnh đã chụp tham gia một triển lãm ảnh trong khu phố.", cooking: () => "Bạn mời hàng xóm đến, mở một ngày cùng nhau thưởng thức món ăn tự tay nấu.",
  hiking: () => "Bạn cùng nhóm leo núi lên tới đỉnh một ngọn núi nổi tiếng.",
  drama: () => "Bạn đã đứng trên sân khấu của một đoàn kịch trong khu phố.", garden: () => "Bạn chia cho hàng xóm những gì thu hoạch từ mảnh vườn nhỏ.",
  fishing: () => "Bạn cùng câu lạc bộ câu cá thuê thuyền ra tận biển khơi." };
const WC_SP = ['basketball', 'tabletennis', 'badminton', 'archery', 'running', 'cycling', 'rugby'];
const AMB_SP = ['basketball', 'tabletennis', 'badminton', 'archery', 'cycling'], VI_SP = ['running', 'cycling'];
const bodySp = () => !disOn() ? null : S.dis.k === 'move' && S.dis.wc ? WC_SP : S.dis.k === 'move' && ['acc', 'work', 'stroke'].includes(S.dis.src) ? AMB_SP
  : S.dis.k === 'sight' && ['acc', 'work'].includes(S.dis.src) ? VI_SP : null;
const hobBodyOff = h => { const ok = bodySp(); return !!ok && h.id.startsWith('sp_') && !ok.includes(h.id.slice(3)); };
const HOB_TEACH = new Set(['sport', 'music', 'dance', 'reading', 'fishing', 'cooking', 'garden', 'board', 'crafts', 'art', 'photo', 'drama']);
const HOB_CONTEST = new Set(['sport', 'music', 'dance', 'games', 'board', 'crafts', 'art', 'photo', 'cooking', 'fishing', 'garden']);
function hobbyName(id) {
  hobDef(id); const H = HOBBIES[id]; if (!H) return id;
  if (id === 'sp_cycling' && noWalk()) return "xe đạp tay";
  if (id.startsWith('sp_')) return SPORTS[id.slice(3)] || id.slice(3);
  if (id === 'sport') return lcVi("Thể thao");
  const hn = lcVi(H.n);
  return hn.replace('{screen}', (!eraBefore(2010) && SCREEN[S.cur]) || "phim truyền hình").replace('{board}', boardGame() === 'go' ? "cờ vây" : boardGame() === 'chess' ? "cờ vua" : BOARD[S.cur] || "bài lá và cờ bàn");
}
function hobbySub(id) { const H = hobDef(id); const parts = []; if (H.h) parts.push("Hạnh phúc+"); if (H.hl > 0) parts.push("Sức khỏe+"); if (H.hl < 0) parts.push("Sức khỏe−"); if (H.so > 1) parts.push("Quan hệ+"); if (H.sm > 1) parts.push("Kiến thức+"); if (H.cost >= 0.03) parts.push("Tốn tiền"); return parts.join(' '); }
const HOB_MIN = { gym: 14, travel: 16, photo: 12, karaoke: 12, sns: 13, cooking: 10 };
function hobbyOptions(n) {
  const c = C(); const have = new Set(S.hobbies.map(h => h.id)); const w = {};
  const wc = bodySp();
  for (const sp of wc || c.sp.split(',')) { const id = 'sp_' + sp; if (!HOBBIES[id]) HOBBIES[id] = Object.assign({}, HOBBIES.sport, { n: SPORTS[sp] || sp }); if (!have.has(id)) w[id] = (wc ? 0.5 : S.age < 50 ? 3 : 0.8) * Math.exp(0.5 * tal('bd') - 0.125); }
  if (!wc && !have.has('sp_football') && !c.sp.includes('football')) { HOBBIES.sp_football = Object.assign({}, HOBBIES.sport, { n: "bóng đá" }); w.sp_football = (S.age < 40 ? 1.5 : 0.3) * Math.exp(0.5 * tal('bd') - 0.125); }
  if (w.sp_football && S.sex === 'F') w.sp_football *= 0.12;
  for (const id in HOBBIES) {
    const H = HOBBIES[id]; if (id === 'sport' || id.startsWith('sp_') || have.has(id)) continue;
    if (H.need === 'smart' && !S.owns.phone) continue;
    if (H.need === 'net' && c.net < 60) continue;
    if (H.need === 'literate' && !canRead(1)) continue;
    if (noHear() && (id === 'music' || id === 'karaoke')) continue;
    if (H.rich && S.age >= 18 && S.pct < H.rich) continue;
    if (H.rich && S.age < 18 && S.q < 4) continue;
    if (H.urban && !S.urban) continue;
    if (H.only && !H.only.split(',').includes(c.id)) continue;
    if (id === 'faith' && (faithHidden() || (S.rel === 'N' && S.age < 15))) continue;
    if (S.age < (HOB_MIN[id] || 0)) continue;
    if (id === 'screen' && typeof eraOn === 'function' && eraOn() && calYr() < 1992 && !S.owns.tv) continue;
    if (id === 'board' && !S.flags.boardG) S.flags.boardG = boardDraw();
    let wt = 1; if (id === 'faith') wt = S.rel !== 'N' ? 1.5 : 0.15;
    if (id === 'screen') wt = c.ppp > 3000 ? 1.5 : 0.4; if (id === 'garden' && S.urban) wt = 0.4; if (id === 'karaoke') wt = 2;
    if (id === 'screen' && S.age < 13) wt = Math.min(wt, 1);
    if (S.age > 55 && ['games', 'dance'].includes(id)) wt *= 0.3;
    if (talOfH(id)) wt *= Math.exp(0.5 * tal(talOfH(id)) - 0.125);
    w[id] = wt;
  }
  const out = []; for (let i = 0; i < n && Object.keys(w).length; i++) { const id = wpick(w); delete w[id]; out.push(id); }
  const tS = talEnsure(), tTop = TAL_K.filter(k => tS[k] >= 1 && k !== 'st').sort((x, y) => tS[y] - tS[x])[0];
  const gift = [...new Set((S.flags.talShown || []).concat(tTop && !(tTop === 'mu' && noHear()) ? [tTop] : []))].filter(k => !S.hobbies.some(h => talOfH(h.id) === k));
  if (n >= 2 && out.length) for (const k of gift) {
    if (out.some(id => talOfH(id) === k)) continue;
    const fw = {}; for (const id in w) if (talOfH(id) === k) fw[id] = w[id]; if (!Object.keys(fw).length) continue;
    const told = (S.flags.talShown || []).includes(k), keep = told ? (S.flags.talShown || []) : gift;
    const first = {}; out.forEach((id, j) => { const t = talOfH(id); if (keep.includes(t) && first[t] == null) first[t] = j; });
    const dup = out.map((id, j) => j).filter(j => keep.includes(talOfH(out[j])) && first[talOfH(out[j])] !== j), other = out.map((id, j) => j).filter(j => !keep.includes(talOfH(out[j])));
    const pos = dup.length ? dup[dup.length - 1] : other.length > (Object.keys(first).length ? 1 : 0) ? other[other.length - 1] : -1; if (pos < 0) continue;
    const top = 'sp_' + c.sp.split(',')[0];
    if (k === 'bd' && fw[top]) fw[top] *= 2.5;
    const pickd = wpick(fw); delete w[pickd]; out[pos] = pickd;
  }
  { const top = 'sp_' + c.sp.split(',')[0], j = out.findIndex(id => String(id).startsWith('sp_') && id !== top);
    if (gift.includes('bd') && j >= 0 && !out.includes(top) && w[top] && chance(0.5 * Math.min(1, w[top] / Math.max(1e-6, w[out[j]] || 3)))) out[j] = top; }
  return out;
}
const BULLY_P = 0.075, BULLY_REG = { ssa: 48.2, mena: 42, eca: 25, lac: 25 };
const bullyP = () => BULLY_P * (BULLY_REG[C().p] || 32) / 32 * clamp(2 - S.st.so / 66, 0.5, 1.5) * Math.exp(-0.25 * tal('wd')) * (1 - 0.35 * (S.focusW.play || 0));
const RARE_JOBS = ['mp', 'leader', 'astro', 'athlete', 'idol'];
const parlSeats = c => Math.round(Math.cbrt(c.pop * 1000));
const mpOdds = c => parlSeats(c) * 0.08 / c.b;
const leaderOdds = c => 0.3 / c.b;
const K_MP = 0.0013, K_LEAD = 0.12;
const NATBORN_HEAD = new Set(['USA', 'BRA', 'MEX', 'PHL', 'IDN', 'NGA', 'GHA', 'COL', 'ARG', 'PER', 'CHL', 'VEN', 'ECU', 'KEN', 'EGY', 'RUS']);
const newCitizen = () => S.cur !== S.born && !S.adopt && !(S.born === 'PRK' && S.cur === 'KOR');
const natzK = c => !newCitizen() ? 1 : ['JPN', 'KOR', 'CHN', 'TWN'].includes(c.id) ? 0.1 : 0.35;
const headOK = c => !(newCitizen() && NATBORN_HEAD.has(c.id));
const NAT_WIN = 0.4;
const winNat0 = c => clamp(mpOdds(c) / K_MP, 0.001, 0.6);
const natRaceK = c => Math.min(1, winNat0(c) / NAT_WIN);
const winNational = c => Math.max(NAT_WIN, winNat0(c)) * natzK(c);
const winLeader = c => clamp(leaderOdds(c) / (mpOdds(c) * K_LEAD), 0.003, 0.5) * natzK(c);
const NO_VOTE = ['PRK', 'ERI'], ONE_PARTY = ['CHN', 'VNM', 'LAO', 'CUB'];
const NO_LEADER = ['PRK', 'SAU', 'ARE', 'QAT', 'OMN', 'KWT', 'ERI', ...ONE_PARTY];
const PM_TITLE = ['JPN', 'IND', 'GBR', 'DEU', 'CAN', 'AUS', 'ITA', 'ESP', 'NLD', 'SWE', 'NOR', 'DNK', 'FIN', 'BEL', 'IRL', 'ISR', 'GRC', 'PRT', 'AUT', 'CZE', 'HUN', 'POL', 'THA', 'MYS', 'PAK', 'BGD', 'NPL', 'ETH', 'KHM', 'IRQ', 'MAR', 'JOR', 'SGP', 'NZL', 'LSO', 'JAM'];
const leaderTitle = c => ['CHN', 'VNM', 'LAO'].includes(c.id) ? "chủ tịch nước" : c.id === 'DEU' || c.id === 'AUT' ? L`총리${LBL}` : PM_TITLE.includes(c.id) ? "thủ tướng" : "tổng thống";
const oddsStr = p => { const n = 1 / p; return '1 trên ' + viNum(n); };
const popStr = c => viNum(c.pop * 1000) + ' người';
const ASTRO_W = { USA: 1, RUS: 0.8, CHN: 0.8, JPN: 0.3, CAN: 0.3, IND: 0.25, ARE: 0.2, FRA: 0.15, DEU: 0.15, ITA: 0.15, GBR: 0.1, ESP: 0.1, NLD: 0.1, SWE: 0.1, BEL: 0.1, DNK: 0.1, CHE: 0.1, AUT: 0.05, KOR: 0.05, SAU: 0.05, TUR: 0.05, POL: 0.05, HUN: 0.05, CZE: 0.05 };
const ASTRO_AGENCY = { USA: 'NASA', RUS: "Cơ quan Vũ trụ Nga", CHN: "Cơ quan Vũ trụ có người lái Trung Quốc", JPN: 'JAXA', CAN: "Cơ quan Vũ trụ Canada", IND: "Tổ chức Nghiên cứu Vũ trụ Ấn Độ", ARE: "Cơ quan Vũ trụ UAE", KOR: "Cơ quan Hàng không Vũ trụ Hàn Quốc", FRA: "Cơ quan Vũ trụ châu Âu", DEU: "Cơ quan Vũ trụ châu Âu", ITA: "Cơ quan Vũ trụ châu Âu", GBR: "Cơ quan Vũ trụ châu Âu", ESP: "Cơ quan Vũ trụ châu Âu", NLD: "Cơ quan Vũ trụ châu Âu", SWE: "Cơ quan Vũ trụ châu Âu", BEL: "Cơ quan Vũ trụ châu Âu", DNK: "Cơ quan Vũ trụ châu Âu", CHE: "Cơ quan Vũ trụ châu Âu", AUT: "Cơ quan Vũ trụ châu Âu" };
const NOMAD_JOBS = { dev: 1, creator: 1, finance: 0.5, clerk: 0.3, prof: 0.3 };
const NOMAD_PLACES = [["Lisbon", 'PRT'], ["Bali", 'IDN'], ["Chiang Mai", 'THA'], ["Thành phố Mexico", 'MEX'], ["Medellín", 'COL'], ["Tbilisi", 'GEO'], ["Buenos Aires", 'ARG'], ["Cape Town", 'ZAF'], ["Bangkok", 'THA'], ["Đà Nẵng", 'VNM'], ["Istanbul", 'TUR'], ["Barcelona", 'ESP'], ["Budapest", 'HUN'], ["Kuala Lumpur", 'MYS'], ["Seoul", 'KOR'], ["Tokyo", 'JPN']];
const OLY = c => 1.3e-5 * (c.ppp > 40000 ? 4 : c.ppp > 15000 ? 1.5 : c.ppp > 5000 ? 0.7 : 0.3) * clamp(Math.pow(20000 / c.pop, 0.3), 1, 3);
const OLY_YEARS = 2.2;
const localPay = c => oneParty(c) ? 0.1 : ({ KOR: 1, JPN: 1.2, TWN: 0.8 })[c.id] || (c.ppp < 10000 ? 0.8 : 0.3);
const localWord = () => oneParty(C()) ? "đại biểu hội đồng nhân dân địa phương" : "nghị viên hội đồng địa phương";
function officeLeave() { if (!S.office || S.office.lvl !== 1) return; S.office = null; log(L`이 나라를 떠나며 ${localWord()} 자리를 내려놓았습니다.`); }
const inOffice = () => !!(S.office && S.office.lvl >= 2) || RARE_JOBS.includes(S.job);
const citizen = () => (S.cur === S.born ? !S.mig && S.flags.natzGave !== S.born : S.flags.natz === S.cur) && !S.refugee && !rohStateless() && recLic() < 0.5 && S.job !== 'prison' && !(S.adopt && S.adopt.noCit && S.adopt.cit == null);
function setRareJob(id) {
  proArtMark(id);
  if (JOBS[S.job] && !NONWORK.includes(S.job) && !RARE_JOBS.includes(S.job)) S.flags.preRare = S.job;
  const [lo, hi] = jobRange(id, C());
  S.job = id; S.jobY = 0; S.formal = true; S.pct = clamp((lo + hi) / 2, 0, 0.995);
  S.income = incomeAt(C(), S.pct);
}
function leaveRareJob(msg, retire) {
  const c = C();
  if (retire || S.age >= retireAge(c)) { S.job = 'retired'; S.retired = true; S.pension = pensionAmount(); }
  else if (S.flags.preRare && JOBS[S.flags.preRare]) { const id = S.flags.preRare, [lo, hi] = jobRange(id, c); S.job = id; S.jobY = 0; S.pct = clamp(Math.max(S.pct - 0.1, (lo + hi) / 2), lo, hi); }
  else { S.job = 'seeking'; S.flags.seekY = 0; }
  if (msg) log(msg, 'big');
}
const SETTLE = { USA: [4, 9, 1, 0.6], CAN: [2, 5, 1, 0.8], AUS: [2, 4, 1, 0.75], NZL: [2, 5, 1, 0.75], GBR: [5, 6, 1, 0.8], IRL: [5, 5, 1, 0.75],
  DEU: [5, 5, 1, 0.7], FRA: [5, 5, 1, 0.7], BEL: [5, 5, 1, 0.7], NLD: [5, 5, 0, 0.7], ESP: [5, 10, 0, 0.7], ITA: [5, 10, 1, 0.6], PRT: [5, 5, 1, 0.75],
  CHE: [10, 10, 1, 0.6], AUT: [5, 10, 0, 0.6], SWE: [5, 5, 1, 0.75], NOR: [3, 8, 1, 0.75], DNK: [8, 9, 1, 0.6], FIN: [4, 8, 1, 0.7], POL: [5, 8, 1, 0.6],
  CZE: [5, 5, 1, 0.6], SVK: [5, 8, 0, 0.6], GRC: [5, 7, 1, 0.5], KOR: [5, 5, 0, 0.5], JPN: [10, 5, 0, 0.7, 1], TWN: [5, 5, 0, 0.6], SGP: [2, 4, 0, 0.4],
  RUS: [1, 5, 1, 0.7], KAZ: [1, 5, 0, 0.7], TUR: [null, 5, 1, 0.6], IND: [null, 12, 0, 0.5], MEX: [4, 5, 1, 0.75], CHL: [5, 5, 1, 0.75], ARG: [2, 2, 1, 0.8],
  COL: [5, 5, 1, 0.7], PER: [3, 5, 1, 0.7], CRI: [3, 7, 1, 0.7], DOM: [5, 7, 1, 0.6], ISR: [null, 3, 1, 0.6],
  SAU: 0, ARE: 0, QAT: 0, KWT: 0, OMN: 0, CHN: 0, MYS: 0, THA: 0, IRN: 0, PAK: 0, LBN: 0, HKG: [7, 99, 0, 0.6] };
const GULF = ['SAU', 'ARE', 'QAT', 'KWT', 'OMN'];
const PR_SKILL = 0.9;
const prSkill = () => isWorking() && !!JOBS[S.job] && JOBS[S.job].e >= 4 && !JOBS[S.job].special;
function settleRule(c = C()) {
  const r = c.id in SETTLE ? SETTLE[c.id] : [5, 8, 1, 0.55];
  if (!r) return null;
  if (c.id === 'HKG' && !(S.flags.mig && S.flags.mig.skilled)) return null;
  const o = { pr: r[0], nat: r[1], keep: !!r[2], po: r[3], nf: !!r[4] };
  if (c.id === 'ESP' && B().p === 'lac') { o.nat = 2; o.keep = true; }
  const sp = SP_SETTLE[c.id];
  if (sp && wedLocal(c)) {
    const m0 = Math.max(0, (S.fam.marriedAt != null ? S.fam.marriedAt : 0) - Math.max(S.migY || 0, S.flags.regAt || 0));
    const nat = c.id === 'ITA' && S.fam.kids.some(k => k.alive && !k.sk && k.bornAt >= (S.fam.marriedAt || 0)) ? Math.ceil(sp[1] / 2) : sp[1];
    if (o.pr != null && sp[0] != null && m0 + sp[0] < o.pr) { o.pr = m0 + sp[0]; o.spP = 1; }
    if (nat != null && m0 + nat < o.nat) { o.nat = m0 + nat; o.spN = 1; if (sp[2]) o.nf = true; }
  }
  return o;
}
const SP_SETTLE = { USA: [2, 5], CAN: [1, 4], DEU: [3, null], FRA: [3, 4, 1], ESP: [null, 1, 1], ITA: [null, 2, 1], KOR: [2, 2, 1], JPN: [3, 3, 1], TWN: [null, 3, 1] };
const wedLocal = (c = C()) => { const f = S.fam, P = f.partner; return !!(f.married && legalWed() && P && P.alive && !P.divorced && !P.lb && P.nat === c.id); };
const settleOK = () => !!S.mig && S.cur === S.mig && S.cur !== S.born && !S.refugee && !S.flags.hideCN && S.job !== 'prison' && !S.nomad && S.age >= 18 && S.flags.irreg == null;
const settleFee = c => usd2ppp(c, c.p === 'hi' ? 1500 : 400);
const natGap = (c, st) => {
  if (c.id === 'USA') return wedLocal(c) ? 3 : 5;
  return Math.max(1, st.nat - st.pr); };
function settleYear(a, add) {
  if (!settleOK()) return;
  const c = C(), st = settleRule(c), y = a - Math.max(S.migY || a, S.flags.regAt || 0);
  if (!st) {
    if (y >= 10 && !S.flags.noPath) { S.flags.noPath = 1; log(L`${c.ko}에서 산 지 ${y}년이 되었지만, 이 나라의 영주권이나 시민권을 얻을 길은 없습니다.`, 'note', GULF.includes(c.id) ? "Khoảng 90% dân cư ở Các Tiểu vương quốc Ả Rập Thống nhất và Qatar là người nước ngoài, nhưng lao động di cư hầu như không có cách nào nhập quốc tịch (UN DESA, thống kê di cư quốc tế 2020)" : c.id === 'HKG' ? "Người giúp việc gia đình nước ngoài ở Hồng Kông không thể xin thường trú dù đã sống ở đó 7 năm (phán quyết của Tòa Phúc thẩm Tối cao Hồng Kông năm 2013)" : null); }
    return;
  }
  if (S.flags.natz === c.id) return;
  if (st.pr != null && S.flags.pr == null && y >= st.pr && (S.flags.last_prq == null || a - S.flags.last_prq >= 3) && chance(0.6)) add('prq');
  else if ((st.pr == null || st.nf || (S.flags.pr != null && a - S.flags.pr >= natGap(c, st))) && y >= st.nat && (S.flags.last_natq == null || a - S.flags.last_natq >= 4) && chance(0.5)) add('natq');
}
const kafala = () => relShare(C(), 'M') > 0.5 || (S.rel === 'M' && S.cur === S.born && C().p !== 'hi');
const SOLO_ADOPT_NO = new Set(['JPN', 'PRK', 'SAU', 'IRN', 'AFG', 'YEM', 'SOM', 'LBY', 'IRQ', 'SYR', 'PAK', 'SDN']);
const adoptSoloOK = () => !SOLO_ADOPT_NO.has(C().id) && (!kafala() || S.sex === 'F');
function adoptOK(pending) {
  const f = S.fam, couple = f.married && f.partner && f.partner.alive;
  if (S.age < 25 || S.age > 65 || S.job === 'prison' || S.refugee || S.flags.hideCN || S.flags.celib || f.kids.filter(k => k.alive && S.age - k.bornAt < 18).length >= 3) return false;
  if (!pending && S.flags.adoptAt != null) return false;
  if (couple && f.partner.ss && unionOf(f.partner) !== 'm') return false;
  return couple || (adoptSoloOK() && !f.dating && S.age >= 33);
}
const adoptP = () => clamp((C().p === 'hi' ? 0.7 : 0.55) - (S.age > 45 ? 0.15 : 0) - (S.age > 55 ? 0.1 : 0) - 0.4 * recW() + (S.fam.married ? 0.05 : -0.1)
  + (typeof hhPct === 'function' ? (hhPct() < 0.15 ? -0.2 : hhPct() > 0.6 ? 0.05 : 0) : 0) - (debtHeavy() ? 0.15 : 0), 0.08, 0.85);
function adoptStart(paid) {
  const c = C(), cost = incomeAt(c, 0.5) * (c.p === 'hi' ? 0.15 : 0.05);
  if (!paid) S.money -= cost; S.flags.adoptAt = S.age + 1;
  return kafala() ? L`아이를 맡을 수 있는지 알아보기 시작했습니다. 가정 조사와 서류를 거쳐야 합니다. (−${wonStr(cost)})` : L`입양 기관에 상담을 신청했습니다. 가정 조사와 부모 교육을 거쳐야 합니다. (−${wonStr(cost)})`;
}
function adoptChild() {
  const sex = !S.fam.married && S.sex === 'M' && C().id === 'IND' ? 'M' : chance(0.5) ? 'M' : 'F', age = S.age > 55 ? ri(7, 12) : S.age > 48 ? ri(3, 10) : chance(0.4) ? ri(0, 1) : chance(0.65) ? ri(2, 5) : ri(6, 10);
  const fatherName = S.sex === 'M' || (S.fam.partner && S.fam.partner.ss) ? S.name : (S.fam.partner ? S.fam.partner.name : S.name), N = NAMES[S.cl] || NAMES.en;
  const taken = familyNames(); (S.fam.given || []).forEach(g => g.name && taken.add(callName(g.name)));
  const fam = S.flags.surM && S.flags.surM === S.fam.marriages && surOK() ? momName() : fatherName;
  let name; for (let i = 0; i < 12; i++) { name = kafala() ? makeName(S.cl, sex, {}) : makeName(S.cl, sex, { family: N.o === 'pat' || N.o === 'bin' ? null : fam.base, father: fatherName.g.split(' ')[0], kid: 1, rel: S.rel === 'S' ? 'S' : undefined }); if (!taken.has(callName(name))) break; }
  return { name, sex, age };
}
const loveFirst = c => !['sa', 'mena'].includes(c.p);
const DATE_LEAD = { JPN: [4, 3] };
const dateLead = c => { const dd = DATE_LEAD[c.id]; if (!dd) return 2; const d = dd[S.sex === 'F' ? 1 : 0]; return c.yr && c.yr < 2021 ? 2 + (d - 2) * clamp((c.yr - 1987) / 34, 0, 1) : d; };
const wedAll = c => c.id === 'KOR';
const DATE_K = 2.1, DATE_END = c => c.p === 'eap' || c.p === 'ssa' || wedAll(c) ? 0.11 : 0.15;
const SOLO_C = { KOR: [0.12, 0.01], JPN: [0.29, 0.15], TWN: [0.18, 0.12], SGP: [0.15, 0.1], HKG: [0.18, 0.15], CHN: [0.06, 0.01], USA: [0.07, 0.05], ITA: [0.1, 0.07], ESP: [0.1, 0.07], DEU: [0.08, 0.05] };
const SOLO_R = { hi: [0.08, 0.06], eca: [0.05, 0.03], lac: [0.03, 0.03], eap: [0.04, 0.02], mena: [0.03, 0.03], ssa: [0.02, 0.01], sa: [0.01, 0.005] };
const SOLO_Y = { KOR: 1970 };
function soloK(c, a) {
  const f = S.flags;
  if (f.solo == null) {
    const [m, w] = SOLO_C[S.born] || SOLO_R[B().p] || SOLO_R.hi, y = S.by || NOW_Y;
    const t = clamp((y - 1945) / ((SOLO_Y[S.born] || 2025) - 1945), 0.05, 1);
    const era = S.era === 'past' ? (SOLO_Y[S.born] ? t * t : t) : S.era === 'future' ? 1.15 : 1;
    f.solo = chance((S.sex === 'M' ? m : w) * era) ? 1 : 0;
  }
  let k = f.solo ? 0.12 : 1;
  if (S.sex === 'M' && a >= 24 && !wasMarried()) { const ea = ['KOR', 'JPN', 'TWN', 'CHN', 'SGP', 'HKG'].includes(c.id), p = isWorking() ? S.pct : S.school ? S.q / 5 - 0.1 : 0.15; k *= clamp(1 + (ea ? 1.1 : 0.5) * (p - 0.5), 0.45, 1.5); }
  return k;
}
const wasMarried = () => { const f = S.fam, P = f.partner; if (f.married || !P || !(P.divorced || !P.alive || f.widowed)) return false;
  return unionOf(P) === 'm' || (S.flags.exs || []).some(e => e.w !== 0); };
function datingYear() {
  const d = S.fam.dating; if (!d) return;
  if (S.fam.married) { S.fam.dating = null; return; }
  { const x = Object.assign({}, d, { at: S.age }); delete x.pk; delete x.co; delete x.obj; delete x.mx; S.flags.exD = x; }
  const y = S.age + 1 - d.since;
  if (chance(DATE_END(C()))) { S.fam.dating = null; eff({ h: -5, so: -3 }); log(d.arr ? L`${wa(callName(d.name))}의 혼담은 끝내 이어지지 않았습니다.` : L`${wa(callName(d.name))} 헤어졌습니다.`, 'loss'); return; }
  if (y >= 1 && (S.flags.last_wedtalk == null || S.age + 1 - S.flags.last_wedtalk >= 1) && chance(y >= 3 ? 0.5 : 0.35)) S.flags.wedQ = 1;
  const fa = S.sex === 'F' ? S.age : d.age + (S.age - d.since), c = C();
  const far = dateFar() ? (S.sex === 'F' || S.flags.irreg != null || !tripOutOK() ? 0 : 0.35) : 1;
  if (d.sex !== S.sex && !transNoCarry() && fa >= 18 && fa <= 42 && !mpPast() && !S.flags.wedQ && chance(0.06 * far * (['sa', 'mena'].includes(c.p) ? 0.3 : 1))) S.flags.datePregQ = 1;
}
const prkPlace = () => { const cs = (CITIES.PRK || '').split(','); return !S.urban ? 1.3 : S.city === cs[2] ? 3 : S.city === cs[0] ? 0.2 : 1; };
const defectP = () => 0.0045 * prkPlace() * (S.sex === 'F' ? 1.4 : 0.7) * (S.age < 35 ? 1.3 : S.age < 45 ? 0.9 : 0.6) * (S.q <= 2 ? 1.3 : S.q >= 5 ? 0.6 : 1)
  * (S.fam.kids.some(k => k.alive && S.age - k.bornAt < 10) ? 0.6 : 1) * (S.flags.defCaught ? 2 : 1);
function nkDetain(yrs, kind) {
  S.flags.lastJob = isWorking() ? S.job : S.flags.lastJob; S.job = 'prison'; S.flags.nkCamp = kind; S.flags.defCaught = 1;
  S.flags.prisonUntil = S.age + yrs; S.flags.prisonLen = yrs; S.flags.prisonY0 = S.stats.campY || 0; S.flags.paroleAsked = 1;
  if (S.money > 0) { const x = S.money * 0.7; S.money -= x; book("Tiền bị tịch thu khi bị bắt", -x); }
  eff({ h: -15, hl: -8, so: -8 }); S.yearMark = 'loss';
}
function crossChina() {
  S.flags.defector = 1; S.flags.defX = S.age; if (S.money > 0) S.money *= 0.3; S.house = 0; delete S.owns.house;
  if (S.flags.left == null) S.flags.left = S.age; S.flags.stayHome = 0; S.flags.careHome = null;
  S.flags.exP = S.flags.exD = S.flags.exNm = null;
  emigrate('CHN', false, true); S.refugeeUntil = null; S.city = "Diên Cát";
  S.flags.hideCN = { at: S.age, n: ri(1, 4), y: 0, asks: 0 };
  hiddenWork();
}
function hiddenWork() {
  if (S.age < 15 || S.age >= 65 || S.retired || S.school) return;
  const id = S.sex === 'F' ? pick(['domestic', 'cook']) : pick(['construct', 'farmhand']), [lo] = jobRange(id, C());
  S.job = id; S.jobY = 0; S.formal = false; S.pct = lo; S.income = incomeAt(C(), payPct(lo, id, false));
}
function leaveChina() {
  S.flags.hideCN = null; S.refugee = false; S.refugeeUntil = null;
}
function sentBack() {
  const yrs = ri(2, 4);
  leaveChina(); S.cur = 'PRK'; S.mig = null; S.migPen = 0; S.stats.moves++; S.yearMark = 'move';
  const bu = S.bornUrban != null ? S.bornUrban : true; S.urban = bu; S.city = bu ? (S.bornCity || cityOf(B())) : null;
  nkDetain(yrs, 2);
  log(L`중국 공안에 붙잡혀 북한으로 강제 송환되었습니다. 교화소에서 ${yrs}년을 보내야 합니다.`, 'bad', "Trung Quốc không coi những người rời Triều Tiên bị bắt là người tị nạn mà đưa họ trở về Triều Tiên. Tháng 10 năm 2023, hơn 500 người đã bị đưa về cùng một lúc (Human Rights Watch)");
}
function arriveSK() {
  const y = Math.max(1, S.age - S.flags.hideCN.at);
  leaveChina(); S.flags.defSK = S.age; S.flags.natz = 'KOR';
  emigrate('KOR', false, true); S.refugee = false; S.refugeeUntil = null;
  const set = defSettle();
  eff({ h: 14, hl: 2 });
  return { t: L`중국에서 ${y}년을 숨어 지낸 끝에 한국에 도착했습니다.`, k: 'big', post: () => log(set.t, 'note', set.f) };
}
const DEF_HHK = [1, 1.71, 2.29, 2.86, 3.43, 4, 4.57];
const defBasic = yr => yr >= 2025 ? 0.44 : yr >= 2024 ? 0.29 : 0.25;
const defDepK = n => n >= 5 ? 0.67 : n >= 2 ? 0.58 : 0.46;
const defHH = () => { const o = homeOthers(); return 1 + (o.pt ? 1 : 0) + o.kids.length; };
const defYrs = () => S.flags.defSK != null && S.cur === 'KOR' ? S.age - S.flags.defSK : -1;
const DEF_PROTECT = 5;
const defMedAid = () => { const y = defYrs(); return y >= 0 && y < DEF_PROTECT; };
const defUniOwn = () => defYrs() >= 0 && (S.age <= 35 || calYr() >= 2025);
const defUniKid = k => defYrs() >= 0 && k.bornAt < S.flags.defSK && (S.flags.defX == null || k.bornAt < S.flags.defX || calYr() >= 2025);
function defSettle() {
  const c = C(), med = incomeAt(c, 0.5), yr = calYr(), n = defHH();
  const grant = med * defBasic(yr) * DEF_HHK[Math.min(n, 7) - 1];
  const broker = med * (0.2 + rnd() * 0.25) * (yr >= 2020 ? 2 : 1) * (1 + 0.5 * (n - 1));
  S.money += grant - broker;
  S.flags.pubRent = { at: S.age, dep: med * defDepK(n) };
  if (yr < 2015) S.flags.defJA = 0; else S.flags.defMH = chance(0.5) ? 0 : null;
  const left = grant - broker;
  const t = L`조사를 마치고 하나원에서 12주 동안 한국 생활을 배웠습니다. 정착기본금 ${wonStr(grant)}을 받았고, 주거지원금으로 보증금을 낸 임대 아파트를 배정받았습니다.` + ' '
    + (left >= med * 0.05 ? L`브로커 비용을 갚고 ${wonStr(left)}이 남았습니다.` : left > -med * 0.05 ? "Gần như toàn bộ tiền định cư đã dùng để trả cho người môi giới." : L`브로커 비용이 정착금보다 많아 ${wonStr(-left)}이 빚으로 남았습니다.`);
  const f = yr >= 2025 ? "Sau khóa học ở Hanawon, người rời Triều Tiên sang Hàn Quốc được nhận trợ cấp định cư cơ bản (15 triệu won cho hộ một người, nhà càng đông người càng nhiều hơn), trợ cấp nhà ở dùng để đặt cọc căn hộ thuê công (16 triệu won cho một người), tài khoản tiết kiệm có nhà nước góp thêm, trợ cấp y tế và học phí đại học (Bộ Thống nhất Hàn Quốc 2025)"
    : "Sau khóa học ở Hanawon, người rời Triều Tiên sang Hàn Quốc được nhận trợ cấp định cư cơ bản (nhà càng đông người càng nhiều hơn), trợ cấp nhà ở dùng để đặt cọc căn hộ thuê công, tiền thưởng khuyến khích việc làm hoặc tài khoản tiết kiệm có nhà nước góp thêm, cùng trợ cấp y tế (Bộ Thống nhất Hàn Quốc)";
  return { t, f };
}
function defRentYear(add, c) {
  const r = S.flags.pubRent; if (!r || S.cur !== 'KOR' || S.house > 0 || withParents() || ['kid', 'care'].includes(S.flags.oldHome) || S.job === 'prison') return;
  const med = incomeAt(c, 0.5), n = defHH(), mkt = housePrice(c) * 0.45 * rentY(c) * (n >= 2 ? 1.3 : 1), pub = med * 0.035 * (n >= 2 ? 1.5 : 1);
  const save = Math.max(0, mkt - pub) * (hhPct() > 0.75 ? 0.5 : 1);
  add("Tiền thuê nhà tiết kiệm nhờ ở căn hộ thuê công", save * (S.money < 0 ? 1 : OWN_KEEP));
}
function defAidYear(add, c) {
  const y = defYrs(); if (y < 0 || !isWorking() || S.income <= 0 || S.job === 'prison') return;
  const med = incomeAt(c, 0.5);
  if (S.flags.defJA != null && S.flags.defJA < 3 && y <= DEF_PROTECT + 1) { const k = S.flags.defJA++; add("Tiền thưởng khuyến khích việc làm", med * [0.18, 0.21, 0.25][k] * (capArea() ? 1 : 1.15)); }
  else if (S.flags.defMH != null && S.flags.defMH < 4 && y <= 10) { S.flags.defMH++; add("Phần nhà nước góp vào tài khoản tiết kiệm", Math.min(S.income * 0.3, med * 0.18)); }
}
const capArea = () => { const cs = (CITIES.KOR || '').split(','); return [cs[0], cs[2], cs[6]].includes(S.city); };
const NK_FAM_F = "Triều Tiên giám sát gia đình của những người bỏ trốn, hiếm khi cấp giấy phép đi lại cho họ và tra hỏi về tiền gửi từ bên ngoài. Tháng 7 năm 2022, ở tỉnh Ryanggang, 30 hộ có từ hai người trở lên sang Hàn Quốc đã bị cưỡng chế dời đến các làng núi hẻo lánh (Daily NK, Đài Á Châu Tự Do)";
function southYear(a) {
  const y = defYrs(), r = S.flags.pubRent;
  if (y === 1 && !S.flags.nkFamW && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent) || sibN() > 0)) { S.flags.nkFamW = 1;
    log("Bạn luôn canh cánh nỗi lo về gia đình còn ở lại Triều Tiên. Bạn nghe nói gia đình của người bỏ đi phải sống dưới sự giám sát của cơ quan an ninh, và bị tra hỏi mãi về chuyện có tiền gửi từ bên ngoài về hay không.", 'ev', NK_FAM_F); }
  if (y === DEF_PROTECT && !S.flags.defProt && S.job !== 'prison') { S.flags.defProt = 1; log("Thời hạn bảo hộ nơi cư trú 5 năm đã kết thúc. Bạn gửi lời cảm ơn đến cán bộ cảnh sát bảo vệ và các thầy cô ở Trung tâm Hana đã quan tâm đến bạn suốt thời gian qua.", 'ev', "Người rời Triều Tiên sang Hàn Quốc được bảo hộ nơi cư trú 5 năm sau khi rời Hanawon, và ở mỗi địa phương có một Trung tâm Hana giúp họ định cư (Bộ Thống nhất Hàn Quốc)"); }
  if (!r) return;
  const gone = S.cur !== 'KOR' || S.house > 0 || ['kid', 'care'].includes(S.flags.oldHome);
  if (!gone) return;
  S.flags.pubRent = null;
  if (a - r.at >= DEF_PROTECT && r.dep > 0) { S.money += r.dep; book("Tiền cọc nhà thuê được hoàn lại", r.dep); log(L`살던 임대 아파트를 나오며 보증금 ${wonStr(r.dep)}을 돌려받았습니다.`, 'ev'); }
}
const brokerOK = () => S.cur === 'PRK' && S.born === 'PRK' && S.age >= 17 && S.age <= 55 && S.job !== 'prison' && !(S.serveLeft > 0) && !S.flags.brokerQ && (S.done.defect || 0) < 4;
function brokerSeek() {
  if (chance(0.08)) { nkDetain(1, 1); return "Trong lúc dò hỏi tìm người môi giới, bạn bị một người chỉ điểm của cơ quan an ninh tố giác. Bạn bị đưa vào trại rèn luyện lao động."; }
  if (chance(clamp(0.35 * prkPlace(), 0.08, 0.75))) { S.flags.brokerQ = 1; return "Sau khi dò hỏi thận trọng, bạn đã liên lạc được với người có thể đưa bạn qua sông. Năm sau sẽ có tin."; }
  eff({ h: -2 }); return "Bạn không tìm được người môi giới đáng tin. Tiền bỏ ra đã mất trắng.";
}
function defectYear() {
  const h = S.flags.hideCN; if (!h || S.cur !== 'CHN' || S.job === 'prison') return;
  h.y = (h.y || 0) + 1;
  if (chance(h.stay ? 0.03 : 0.07)) { sentBack(); return; }
  if (S.job === 'seeking') hiddenWork();
  if (!h.stay && h.y >= h.n) S.flags.defRouteQ = 1;
}
function widowHome(c) {
  const f = S.fam, par = f.mom.alive || (f.dad.alive && !f.dad.absent);
  if (S.age >= 50 || !par || withParents() || S.house > 0 || S.mig || S.cur !== S.born || farFromNK() || S.job === 'prison') return;
  const small = f.kids.some(k => k.alive && !k.away && S.age - k.bornAt < 12);
  if (!chance((small ? 0.35 : 0.2) * ({ sa: 1.3, eap: 1.1, mena: 1.1, ssa: 1, lac: 1, eca: 0.8, hi: 0.5 })[c.p])) return;
  S.flags.stayHome = 1; S.flags.widowHome = S.age;
  if (S.city !== S.bornCity || S.urban !== S.bornUrban) { S.urban = S.bornUrban; S.city = S.bornCity; S.yearMark = S.yearMark || 'move'; }
  const pw = parW();
  log(S.sex === 'F' && ['sa', 'eap', 'mena'].includes(c.p) ? (small ? L`아이들을 데리고 친정으로 돌아가 ${wa(pw)} 함께 살게 되었습니다.` : L`친정으로 돌아가 ${wa(pw)} 함께 살게 되었습니다.`)
    : small ? L`아이들을 데리고 ${pw} 집으로 들어가 함께 살게 되었습니다.` + ' ' + L`${iga(pw)} 아이들을 함께 돌봐 주셨습니다.` : L`${pw} 집으로 들어가 함께 살게 되었습니다.`, 'ev');
}
function kidsStay(from) {
  let left = 0;
  for (const k of S.fam.kids) { if (k.alive && k.away && !k.awayIn) k.awayIn = from; if (!k.alive || k.abroad || k.away) continue; const ka = S.age - k.bornAt;
    if (ka >= 18 && (k.grown || k.withMe || !chance(0.35))) { k.abroad = from; k.grown = 1; k.withMe = 0; k.stay = 0; k.near = 0; k.city = null; left++; } }
  if (S.flags.oldHome === 'kid') S.flags.oldHome = 'own';
  return left;
}
const ptForeign = () => { const f = S.fam, P = f.partner; return !!(f.married && P && P.alive && !P.divorced && P.nat && P.nat !== S.born); };
function spouseGoHome() {
  if (!ptForeign()) return null;
  const f = S.fam, P = f.partner, kids = f.kids.some(k => k.alive && !k.away && !k.grown && S.age - k.bornAt < 18);
  const pc = kids ? 0.8 : P.ret || P.age >= 65 ? 0.78 : 0.68, pl = kids ? 0.13 : 0.2, u = rnd();
  return u < pc ? 'come' : u < pc + pl ? 'later' : 'part';
}
const IRR_DEP = c => GULF.includes(c.id) ? 0.07 : ['MYS', 'THA'].includes(c.id) ? 0.04 : c.id === 'USA' ? 0.02 : c.p === 'hi' || c.p === 'eca' ? 0.03 : 0.015;
const IRR_REG = c => ['ESP', 'ITA', 'PRT'].includes(c.id) ? 0.07 : c.id === 'USA' ? 0.012 : GULF.includes(c.id) ? 0.01 : 0.03;
function uiMark() { S.flags.uiC = S.cur; S.flags.uiF = !!S.formal && S.flags.irreg == null && S.job !== 'prison'; }
function uiOK() {
  if (S.flags.irreg != null) return false;
  if (S.flags.uiC == null) return (S.lastInc || 0) > 0 && !(S.mig && S.age - (S.migY || S.age) < 1);
  return S.flags.uiC === S.cur && !!S.flags.uiF;
}
function irregYear(a) {
  if (S.flags.irreg == null) return;
  if (!S.mig || S.cur === S.born || S.refugee) { S.flags.irreg = null; return; }
  if (S.job === 'prison' || S.flags.hideCN || S.isComp) return;
  const c = C(), y = a - S.flags.irreg, P = S.fam.partner, wed = S.fam.married && P && P.alive && !P.divorced && P.nat === S.cur && legalWed();
  if (y >= 1 && chance(wed ? 0.3 : y >= 3 ? IRR_REG(c) : IRR_REG(c) * 0.4)) {
    S.flags.irreg = null; S.flags.regAt = a; eff({ h: 6 });
    const amn = ['ESP', 'ITA', 'PRT', 'GRC', 'BEL'].includes(c.id);
    log(wed ? L`배우자 덕분에 ${c.ko}에 머물 수 있는 허가를 받았습니다. 이제 숨지 않고 일할 수 있습니다.` : amn ? L`${c.ko}의 합법화 조치로 머물 수 있는 허가를 받았습니다. 이제 숨지 않고 일할 수 있습니다.` : L`오랜 기다림 끝에 ${c.ko}에 머물 수 있는 허가를 받았습니다. 이제 숨지 않고 일할 수 있습니다.`, 'warm',
      amn && !wed ? "Ở Liên minh châu Âu, từ năm 1996 đến 2008, các đợt hợp thức hóa đã giúp 5-6 triệu người được cấp phép cư trú (REGINE 2009)" : null);
    return;
  }
  if (y >= 1 && chance(IRR_DEP(c))) { const eu = c.p === 'eca' || (c.p === 'hi' && !['USA', 'CAN', 'AUS', 'NZL', 'JPN', 'KOR', 'ISR', 'SGP', 'TWN', 'HKG'].concat(GULF).includes(c.id)); log(goHome(true), 'bad', eu ? "Trong số những người bị yêu cầu rời khỏi Liên minh châu Âu, chỉ khoảng một phần năm thực sự bị đưa về nước (Eurostat 2023)" : null); }
}
function goHome(dep, keep) {
  const apart = famApart(), sp = apart ? null : spouseGoHome(), P = S.fam.partner, pw = P && P.name ? callName(P.name) : '';
  const from = S.cur, yrs = S.age - (S.migY || S.age), sold = keep && !dep && homeLetOK(from) ? homeLet(from) : sellHomeOnLeaving(from);
  officeLeave(); S.cur = S.born; S.mig = null; S.migPen = 0; S.stats.moves++; S.flags.returnee = 1; S.flags.last_homecoming = S.age; S.flags.retBiz = S.age + 4;
  const hb = homeBack(); if (hb) log(hb);
  const bu = S.bornUrban != null ? S.bornUrban : true; S.urban = bu; S.city = bu ? (S.bornCity || cityOf(B())) : null;
  if (dep) { eff({ h: -10, so: -4 }); S.flags.deported = S.age; S.flags.irreg = null; } else eff({ h: 6, so: 8 }); S.yearMark = 'move';
  if (S.nomad) S.nomad = null;
  const left = kidsStay(from); kidsHereAgain();
  if (S.job === 'owner') { const bx = dep ? '' : bizLeave(); S.flags.bizK = null; S.flags.bizBig = 0; S.flags.bizL = 0; if (bx) log(bx); }
  if (isWorking() && !RARE_JOBS.includes(S.job) && S.job !== 'clergy') { const offers = jobOffers(1); if (offers[0]) takeJob(offers[0]); else { S.job = 'seeking'; S.flags.seekY = 0; } }
  let spt = '';
  if (sp === 'come') { if (!P.ret && !(P.out > 0) && P.inc > 0) { P.out = ri(1, 2); P.mvOut = 1; } spt = sharedTongue(P.nat || from, S.born) ? L`배우자 ${iga(pw)} 함께 왔습니다. 말은 통해도 낯선 음식과 동네에 한동안 애를 먹었습니다.` : L`배우자 ${iga(pw)} 함께 왔습니다. 낯선 말과 음식에 한동안 애를 먹었습니다.`; }
  else if (sp === 'later') { P.joinAt = S.age + ri(1, 2); spt = L`배우자 ${iga(pw)} ${CBY[from].ko}의 일을 정리하는 동안 한동안 떨어져 지내기로 했습니다.`; }
  else if (sp === 'part') { eff({ h: -4 }); P.exIn = from; spt = L`배우자 ${iga(pw)} ${CBY[from].ko}에 남겠다고 했습니다. 긴 이야기 끝에 각자의 나라에서 살기로 했습니다.` + ' ' + divorceNow(C()); homemakerAlone(false); }
  if (apart || S.flags.famWait) { const W = S.flags.famWait; famJoin(); if (apart && (!W || W.from === S.cur)) { eff({ h: 4, so: 3 }); spt = "Bạn lại được sống chung một mái nhà với gia đình đã chờ đợi bấy lâu."; } }
  return (dep ? L`단속에 걸려 ${CBY[from].ko}에서 ${yrs}년 만에 고향 ${ro(B().ko)} 강제로 돌려보내졌습니다. 그곳에서 일군 생활을 두고 와야 했습니다.` : L`${CBY[from].ko}에서 ${yrs}년을 살고 고향 ${ro(B().ko)} 돌아왔습니다.`) + (sold ? ' ' + sold : '') + (left ? ' ' + (left === 1 ? L`그곳에서 자란 아이는 ${CBY[from].ko}에 남았습니다.` : L`그곳에서 자란 아이들은 ${CBY[from].ko}에 남았습니다.`) : '') + (spt ? ' ' + spt : '');
}
const ST = (n, k) => ({ n, k });
const LADDER = {
  shop: [ST("quản lý cửa hàng", 'p'), ST("quản lý khu vực", 'p')], cook: [ST("bếp trưởng", 'p'), ST("chủ quán ăn", 'o')],
  construct: [ST("đội trưởng công trường", 'p'), ST("chủ thầu xây dựng", 'o')], factory: [ST("tổ trưởng sản xuất", 'p'), ST("quản lý nhà máy", 'p')],
  garment: [ST("chuyền trưởng", 'p'), ST("quản lý sản xuất", 'p')], miner: [ST("trưởng ca", 'p'), ST("quản đốc mỏ", 'p')],
  artisan: [ST("nghệ nhân có tiếng", 'p'), ST("chủ xưởng thủ công", 'o')], mechanic: [ST("trưởng nhóm thợ sửa chữa", 'p'), ST("chủ tiệm sửa xe", 'o')],
  electric: [ST("thợ điện trưởng", 'p'), ST("chủ cơ sở thi công điện", 'o')], vendor: [ST("chủ cửa hàng", 'g'), ST("người buôn sỉ", 'g')],
  driver: [ST("tài xế có xe riêng", 'g'), ST("chủ doanh nghiệp vận tải", 'o')], delivery: [ST("trưởng nhóm giao hàng", 'p'), ST("trưởng chi nhánh giao hàng", 'p')],
  guard: [ST("tổ trưởng bảo vệ", 'p'), ST("quản lý an ninh", 'p')], hair: [ST("thợ tóc chính", 'p'), ST("chủ tiệm làm tóc", 'o')],
  care: [ST("trưởng nhóm chăm sóc", 'p'), ST("quản lý viện dưỡng lão", 'p')], domestic: [ST("người giúp việc nhà có nhiều gia đình khách quen", 'p')], farmhand: [ST("đốc công nông trại", 'p')],
  farm: [ST("nông dân có thêm ruộng đất", 'g'), ST("chủ trang trại lớn", 'g')], herder: [ST("người chăn nuôi có đàn gia súc lớn hơn", 'g'), ST("chủ trang trại chăn nuôi lớn", 'g')],
  fisher: [ST("chủ thuyền", 'g'), ST("chủ đội tàu", 'g')], agbiz: [ST("chủ đồn điền", 'g')], clerk: [ST("trưởng nhóm", 'p'), ST("trưởng phòng", 'p'), ST("tổng giám đốc", 'p')],
  callc: [ST("trưởng nhóm tổng đài", 'p'), ST("quản lý trung tâm tổng đài", 'p')], police: [ST("sĩ quan cảnh sát cấp chỉ huy", 'p'), ST("trưởng đồn cảnh sát", 'p')], soldier: [ST("hạ sĩ quan", 'p'), ST("sĩ quan", 'p')],
  teacher: [ST("tổ trưởng chuyên môn", 'p'), ST("hiệu trưởng", 'p')], nurse: [ST("điều dưỡng trưởng khoa", 'p'), ST("trưởng phòng điều dưỡng", 'p')], civil: [ST("trưởng phòng", 'p'), ST("cục trưởng", 'p'), ST("trưởng văn phòng cấp bộ", 'p')],
  coach: [ST("huấn luyện viên đội chuyên nghiệp", 'p'), ST("huấn luyện viên trưởng", 'p'), ST("huấn luyện viên trưởng đội tuyển quốc gia", 'p')], trainer: [ST("huấn luyện viên thể hình trưởng", 'p'), ST("chủ phòng tập", 'o')], creator: [ST("nhà sáng tạo nội dung có tiếng", 'g')], designer: [ST("nhà thiết kế chính", 'p'), ST("giám đốc thiết kế", 'p')],
  owner: [ST("chủ cơ sở có nhiều nhân viên", 'g'), ST("giám đốc doanh nghiệp vừa và nhỏ", 'g')],
  cleaner: [ST("tổ trưởng vệ sinh", 'p'), ST("chủ công ty vệ sinh", 'o')], warehouse: [ST("tổ trưởng kho", 'p'), ST("quản lý trung tâm kho vận", 'p')],
  childcare: [ST("tổ trưởng giáo viên mầm non", 'p'), ST("chủ nhà trẻ", 'o')], healthtech: [ST("trưởng khoa trị liệu", 'p'), ST("chủ phòng khám trị liệu tư nhân", 'o')],
  social: [ST("trưởng nhóm công tác xã hội", 'p'), ST("giám đốc trung tâm phúc lợi xã hội", 'p')], salesagent: [ST("trưởng nhóm", 'p'), ST("chủ văn phòng môi giới", 'o')],
  welder: [ST("tổ trưởng thợ hàn", 'p'), ST("chủ công ty cơ khí lắp đặt", 'o')],
  pilot: [ST("cơ trưởng", 'p'), ST("cơ trưởng cấp cao", 'p')], cabin: [ST("tiếp viên trưởng", 'p'), ST("tiếp viên trưởng cấp cao", 'p')],
  engineer: [ST("kỹ sư trưởng", 'p'), ST("giám đốc kỹ thuật", 'p'), ST("tổng giám đốc", 'p')], dev: [ST("lập trình viên cấp cao", 'p'), ST("kỹ sư phần mềm chính", 'p'), ST("tổng giám đốc", 'p')],
  finance: [ST("trưởng nhóm tài chính", 'p'), ST("lãnh đạo công ty tài chính", 'p'), ST("tổng giám đốc", 'p')], doctor: [ST("bác sĩ trưởng khoa", 'p'), ST("giám đốc bệnh viện", 'p')],
  lawyer: [ST("luật sư thành viên hãng luật", 'p'), ST("luật sư điều hành hãng luật", 'p')], prof: [ST("giáo sư", 'p'), ST("trưởng khoa", 'p')],
};
const eduLbl = () => EDU[S.edu] + (S.edu >= 5 && S.flags && S.flags.dr != null ? " (tiến sĩ)" : '') + (S.dd && S.dd.sch === 'sp' && S.edu ? " (trường chuyên biệt)" : '');
const OF_FIELD = () => ["kế toán", "nhân sự", "kế hoạch", "mua hàng", "hành chính tổng hợp"];
const OF_L = {
  spec: f => [ST(L`${f} 전문가`, 'p'), ST(L`${f} 수석 전문위원`, 'p')],
  sales: () => [ST("trưởng nhóm kinh doanh", 'p'), ST("giám đốc kinh doanh", 'p'), ST("tổng giám đốc", 'p')],
};
const PROF_L = [ST("phó giáo sư", 'p'), ST("giáo sư", 'p'), ST("trưởng khoa", 'p')], RES_L = [ST("nghiên cứu viên chính", 'p'), ST("viện trưởng", 'p')];
const MIL_OFF = [ST("sĩ quan cấp tá", 'p'), ST("tướng", 'p')];
const ACAD3 = new Set(['KOR', 'USA', 'TWN', 'THA', 'IDN', 'PHL', 'TUR', 'GBR', 'FRA', 'RUS', 'BRA', 'EGY', 'PAK', 'MEX', 'CHL', 'ARG']);
const NO_ARMY = new Set(['CRI', 'PAN', 'ISL']), ACAD_NO_F = new Set(['SAU', 'IRN', 'AFG', 'YEM', 'SOM']);
const acadJP = () => S.cur === 'JPN' && !eraBefore(1953);
const acadOK = c => S.age <= 22 && !(c.id === 'JPN' && eraBefore(1953) && !eraBefore(1946)) && S.st.sm >= 55 && S.st.hl >= 60 && !(S.dis && S.dis.k !== 'hear') && S.cur === S.born && !S.mig && !S.refugee && papersOK() && !NO_ARMY.has(c.id)
  && !(S.sex === 'F' && (ACAD_NO_F.has(c.id) || eraBefore(1990))) && !S.fam.married && S.job !== 'idol' && !recEver();
const acadP = () => clamp(0.04 + (S.st.sm - 55) * 0.006 + (S.st.hl - 60) * 0.004, 0.03, 0.35);
const ofField = () => OF_FIELD()[S.flags.ofF || 0];
const PRO_L = {
  law: [ST("luật sư trưởng của văn phòng có nhiều luật sư", 'g'), ST("luật sư đứng đầu công ty luật", 'g')], clinic: [ST("giám đốc phòng khám có nhiều bác sĩ", 'g'), ST("giám đốc bệnh viện", 'g')],
  soft: [ST("giám đốc công ty phần mềm có nhiều nhân viên", 'g'), ST("giám đốc công ty phần mềm quy mô vừa", 'g')], acct: [ST("trưởng văn phòng kế toán có nhiều kế toán viên", 'g'), ST("giám đốc công ty kế toán", 'g')],
  arch: [ST("giám đốc văn phòng thiết kế kiến trúc có nhiều nhân viên", 'g'), ST("giám đốc công ty thiết kế kiến trúc tổng hợp", 'g')], studio: [ST("giám đốc studio có nhiều nhà thiết kế", 'g'), ST("giám đốc công ty thiết kế", 'g')],
  academy: [ST("chủ trung tâm học thêm có nhiều giáo viên", 'g'), ST("chủ chuỗi trung tâm học thêm có nhiều chi nhánh", 'g')],
};
const FARM_LS = [ST("nông dân thuê thêm ruộng để canh tác", 'g'), ST("nông dân điều hành một trang trại lớn", 'g')];
function ladder(id) {
  if (id === 'farm' && landState()) return FARM_LS;
  if (id === 'clerk' && S && S.flags.ofPath && OF_L[S.flags.ofPath]) return OF_L[S.flags.ofPath](ofField());
  if (id === 'owner' && S && S.flags && PRO_L[S.flags.bizK || (S.job !== 'owner' && S.flags.bizKx)]) return PRO_L[S.flags.bizK || S.flags.bizKx];
  if (id === 'prof' && S) return S.flags.profT != null ? PROF_L : RES_L;
  if (id === 'clergy') return clergyLadder();
  if (id === 'soldier' && S && S.flags && S.flags.offc != null) return MIL_OFF;
  return LADDER[id];
}
const phdOK = () => S.edu >= 5 && S.flags.dr == null && S.flags.phdAt == null && S.age <= 38 && !S.retired && S.job !== 'prison';
const phdAsk = () => clamp(0.15 + (S.st.sm - 55) / 120, 0.08, 0.6);
const profP = () => clamp(0.05 * clamp(0.6 + S.st.sm / 110, 0.6, 1.5) * (S.job === 'prof' ? 1.3 : 1) * (S.age - (S.flags.dr || S.age) <= 6 ? 1 : 0.6), 0.02, 0.2);
const rankOf = id => (S && S.exp && S.exp[id] && S.exp[id][2]) || 0;
function setRank(id, r) { const X = expMap(); (X[id] = X[id] || [0, S.pct])[2] = r; }
function rankHi(id, hi, r) {
  if (!r) return hi;
  const tech = (id === 'dev' || id === 'engineer') && C().ppp > 40000;
  const top = r >= 3 ? 0.997 : id === 'owner' ? 0.995 : 0.985;
  const k = id === 'owner' ? [0, 0.5, 0.85][r] : id === 'clerk' && S.flags.ofPath === 'spec' ? [0, 0.35, 0.7][r] : tech ? [0, 0.45, 0.8, 0.95][r] : id === 'soldier' && offScale() ? [0, 0.8, 0.95][r] : JOBS[id].e >= 4 ? [0, 0.2, 0.4, 0.9][r] : [0, 0.5, 0.92, 0.95][r];
  return hi + Math.max(0, top - hi) * (k || 0);
}
const LAD_K = { rankup: 'p', growup: 'g', ownup: 'o' };
const ladStepOK = (id, p) => { if ((p && p.j != null && p.j !== S.job) || (S.job === 'owner' && bigCo())) return false; const L0 = ladder(S.job), st = L0 && L0[rankOf(S.job)]; return !!st && st.k === LAD_K[id]; };
function stepUp(id, share) { const hi = jobRange(id, C())[1]; S.pct = clamp(S.pct + Math.max(0.04, (hi - S.pct) * share * (JOBS[id].e >= 4 ? 0.7 : 1)), 0, 0.995); }
function rankTitle(id) { const r = rankOf(id), L0 = r && ladder(id), st = L0 && L0[r - 1]; return st ? st.n : null; }
function ladderDecision(a, c) {
  if (!isWorking() || inOffice() || S.nomad || S.school || a < 22 || a > (S.job === 'clergy' ? 78 : 62) || S.flags.mandAt != null) return null;
  const st = ladder(S.job); if (!st) return null;
  const r = rankOf(S.job), next = st[r]; if (!next) return null;
  if (S.job === 'prof' && S.flags.profT != null && r < 2 && S.flags.profRe != null) return a >= S.flags.profRe ? 'rankup' : null;
  if (S.job === 'owner' && bigCo()) return null;
  if (S.flags.lastStep != null && a - S.flags.lastStep < (r ? 4 : 3)) return null;
  const X = expIn(S.job), hi = jobRange(S.job, c)[1];
  if (S.job === 'clergy') { const v = S.flags.voc; return v && v.ord != null && !v.pope && chance(clergyStepP(v.k, r, a, a - v.ord) * clamp(S.st.so / 55, 0.6, 1.5)) ? 'rankup' : null; }
  if (S.job === 'soldier' && r === 0) return X.same >= (S.flags.offc != null ? 9 : 3) && chance(S.flags.offc != null ? 0.22 : 0.35) ? 'rankup' : null;
  if (S.job === 'soldier' && S.flags.offc == null && r === 1) return X.same >= 8 && a <= 40 && chance(0.015) ? 'rankup' : null;
  if (S.job === 'soldier' && S.flags.offc != null && r === 1) return a >= 45 && X.same >= 18 && chance(0.002 * clamp(0.8 + S.st.sm / 100, 0.8, 1.6)) ? 'rankup' : null;
  if (S.job === 'coach' && r >= 2 && S.flags.natTeam == null) return null;
  if (S.job === 'prof' && S.flags.profT != null && r < 2) return X.same >= (r ? 10 : 5) && chance(0.2) ? 'rankup' : null;
  if (X.same < (r >= 2 ? 12 : r ? 6 : 4) || S.pct < hi - (r ? 0.15 : 0.09) || (r >= 2 && a < 40)) return null;
  const p = (S.job === 'owner' && next.k === 'g' ? 0.2 : next.k !== 'p' ? (r ? 0.09 : 0.05) : r >= 2 ? (S.job === 'civil' ? 0.012 : 0.0007) : r ? (JOBS[S.job].e >= 4 ? 0.008 : ['clerk', 'salesagent'].includes(S.job) ? 0.035 : 0.03) : JOBS[S.job].e >= 4 ? 0.035 : 0.05) * clamp(1.5 + (S.st.sm - 50) / 200, 1.25, 1.75) * clamp(S.st.so / 48, 0.7, 1.3) * (1 + (0.6 * (S.focusW.work || 0) + 0.3 * (S.focusW.learn || 0)) * effLeft()) * (next.k === 'p' ? 1 : 0.8)
    * (next.k === 'p' && S.flags.courseY != null && a - S.flags.courseY <= 3 ? 1 + 0.35 * effLeft() : 1);
  if (!chance(p * (S.job === 'clerk' ? ({ mgr: 1.4, spec: 0.55 })[S.flags.ofPath] || 1 : 1))) return null;
  return next.k === 'o' ? 'ownup' : next.k === 'g' ? 'growup' : 'rankup';
}
const PRO_K = 0.008, PRO_WIN = 0.24;
const MUS_K = 0.021, MUS_WIN = 0.45;
const hLv = h => Math.min(h.lv, 14);
const musicHobby = () => S.hobbies.find(h => h.id === 'music' && h.since <= 16 && h.lv >= 4);
const IDOL_K = 0.08, IDOL_SURV = [0.88, 0.79, 0.79, 0.816, 0.816, 0.845, 0.845, 0.88], IDOL_DEBUT = [0.12, 0.25, 0.3, 0.28];
const IDOL_H = ['music', 'dance', 'karaoke'];
const IDOL_AB = { JPN: 0.023, TWN: 0.046, THA: 0.0084, CHN: 0.0014, USA: 0.00083, CAN: 0.0028, AUS: 0.002, MYS: 0.0005, VNM: 0.0003, PHL: 0.00024, IDN: 0.000085 }, IDOL_AB_Y = 2005;
const idolK = () => S.cur === 'KOR' ? 1 : IDOL_AB[S.cur] && !eraBefore(IDOL_AB_Y) && !S.refugee && papersOK() && freeExit(C()) && !studyAway() ? IDOL_AB[S.cur] : 0;
const idolHobby = () => idolK() ? S.hobbies.find(h => IDOL_H.includes(h.id) && h.since <= 14 && h.lv >= 1.5) : null;
const idolHome = () => !!(S.flags.idolAb && S.mig === 'KOR' && S.cur === 'KOR' && S.born === S.flags.idolAb);
const idolSkill = () => { const h = S.hobbies.filter(h => IDOL_H.includes(h.id)); return h.reduce((m, x) => Math.max(m, x.lv), 0) + (h.length > 1 ? 1 : 0); };
function idolDebut() {
  const T = S.flags.trainee; if (T) T.done = 1;
  if (T && T.ab && S.cur === T.ab) idolMove(T);
  setRareJob('idol'); const [lo, hi] = jobRange('idol', C()); S.pct = clamp(lo + (hi - lo) * 0.25, 0, 0.9); S.income = incomeAt(C(), S.pct);
  S.idol = { at: S.age, y: 0, hit: 0, end: 0 };
  eff({ h: 15, so: 4 }); S.yearMark = 'star';
  log(S.sex === 'F' ? "Bạn đã ra mắt với tư cách thành viên một nhóm nhạc nữ! Lần đầu tiên bạn đứng trên sân khấu của chương trình âm nhạc." : "Bạn đã ra mắt với tư cách thành viên một nhóm nhạc nam! Lần đầu tiên bạn đứng trên sân khấu của chương trình âm nhạc.", 'big',
    "Từ năm 1996 đến 2025, có 1.182 nhóm nhạc thần tượng ra mắt ở Hàn Quốc, khoảng 39 nhóm mỗi năm. Sau 3 năm còn 55% nhóm hoạt động, sau 10 năm còn 18% (Asia Economy 2026)");
}
function idolMove(T) {
  if (S.fam.dating && !S.fam.dating.nat) S.fam.dating.nat = S.cur;
  S.flags.famCame = 0; S.flags.idolAb = S.cur; S.mig = 'KOR'; S.cur = 'KOR'; S.migY = T.at; S.migPen = 0.05; S.stats.moves++;
  if (withParents()) { S.flags.stayHome = 0; if (S.flags.left == null) S.flags.left = S.age; }
  const k = S.flags.knowT || (S.flags.knowT = []); if (!k.includes('ko')) k.push('ko');
  S.urban = true; S.city = CITIES.KOR.split(',')[0]; S.done.abroad2 = 1;
}
function idolEnd() {
  const I = S.idol; I.end = 1; S.flags.exIdol = 1; eff({ h: -8 });
  if (I.solo) { S.job = 'seeking'; S.flags.seekY = 0; log("Sự nghiệp solo của bạn đã khép lại. Bạn bắt đầu tìm công việc mới.", 'big'); return; }
  S.flags.idolEndQ = 1;
  log(I.y >= 7 ? L`계약이 끝나 멤버들이 각자의 길을 가기로 했습니다. 데뷔 ${I.y}년 만입니다.` : L`데뷔 ${I.y}년 만에 그룹이 활동을 마쳤습니다.`, 'big');
}
function idolBack() {
  setRareJob('idol'); S.pct = S.idol.pct || S.pct; S.income = incomeAt(C(), S.pct);
  log("Xuất ngũ xong, bạn lại đứng trên sân khấu cùng các thành viên.", 'big');
}
const ACT_K = 0.01, ACT_WIN = 0.35;
const DNC_K = 0.005, DNC_WIN = 0.35;
const danceHobby = () => S.hobbies.find(h => h.id === 'dance' && h.since <= 14 && h.lv >= 4);
const GO_C = new Set(['KOR', 'JPN', 'PRK']), CHESS_C = new Set(['RUS', 'ARM', 'UKR', 'GEO', 'AZE', 'BLR', 'KAZ', 'UZB']);
function boardDraw() { const c = S.cur; if (GO_C.has(c)) return 'go'; if (CHESS_C.has(c)) return 'chess'; if (c === 'CHN' || c === 'TWN') return chance(0.4) ? 'go' : 'local'; return chance(BOARD[c] ? 0.35 : 0.5) ? 'chess' : 'local'; }
const boardGame = () => S && S.flags ? S.flags.boardG || (GO_C.has(S.cur) ? 'go' : CHESS_C.has(S.cur) ? 'chess' : 'local') : 'local';
const boardHobby = () => S.hobbies.find(h => h.id === 'board' && h.since <= 12 && h.lv >= 2.5);
const boardSk = h => Math.pow(clamp((h.lv - 2.5) / 3.5, 0, 1.2), 2);
const BOARD_CK = { KOR: 0.4, JPN: 0.12, TWN: 0.5, CHN: 0.06, PRK: 0.05, RUS: 0.04, UKR: 0.13, GEO: 0.25, AZE: 0.15, BLR: 0.1, KAZ: 0.05, UZB: 0.04, HUN: 0.2, SRB: 0.2, NLD: 0.1, POL: 0.075, CZE: 0.08, ISR: 0.1, CUB: 0.12, DEU: 0.067, FRA: 0.06, ESP: 0.06, USA: 0.017, IND: 0.02, ARG: 0.03, PER: 0.03, VNM: 0.01 };
const boardCK = c => BOARD_CK[c.id] != null ? BOARD_CK[c.id] : c.p === 'eca' || c.p === 'hi' ? 0.06 : 0.005;
const BOARD_ASK = 0.065, BOARD_LEAVE = 0.05;
function boardStart() { const B0 = S.flags.boardPro; B0.wait = 0; takeJob({ id: 'boardpro', formal: false, pct: clamp(jobRange('boardpro', C())[0] + 0.05 + rnd() * 0.15, 0, 0.9) }); }
function boardBack() { const B0 = S.flags.boardPro, pc = B0.svc; B0.svc = null; setRareJob('boardpro'); S.pct = clamp(pc - 0.03, 0, 0.99); S.income = incomeAt(C(), S.pct);
  log(boardGame() === 'go' ? "Xuất ngũ xong, bạn trở lại nhà thi đấu cờ. Phải mất một năm để lấy lại cảm giác." : "Xuất ngũ xong, bạn bắt đầu thi đấu các giải trở lại. Phải mất một năm để lấy lại cảm giác.", 'big'); }
const boardWin = h => clamp((boardGame() === 'go' ? 0.06 : 0.05) + (h.lv - 4) * 0.025 + (S.st.sm - 60) / 400 + talPass('st') * 0.6, 0.02, 0.25);
const ESP_EE = { KOR: 5747, CHN: 8620, USA: 27065, RUS: 5266, BRA: 5191, DNK: 2078, SWE: 3191, FRA: 6035, DEU: 6406, CAN: 4043, GBR: 5143, JPN: 3565, UKR: 1567,
  FIN: 2110, AUS: 3979, THA: 2136, POL: 2835, PHL: 1793, TWN: 1656, MYS: 1629, IDN: 2514, NLD: 2069, VNM: 2508, ESP: 2583, SAU: 1112, NOR: 1319, TUR: 1601, BGR: 414,
  ARG: 1393, JOR: 146, MEX: 1402, PER: 673, ISR: 280, ITA: 1558, SGP: 1181, EST: 337, IND: 1522, PAK: 426, CZE: 1218, KAZ: 718, AUT: 709, ROU: 620, LBN: 109, SVK: 371,
  BEL: 884, HKG: 658, PRT: 1138, BLR: 382, MNG: 292, MKD: 89, SRB: 410, CHE: 690, CHL: 854, LVA: 336, SVN: 180, BIH: 82, NZL: 432, GRC: 527, EGY: 299, HUN: 723, HRV: 285,
  ZAF: 789, MAC: 37, LTU: 391, NPL: 165, IRQ: 150, KGZ: 101, COL: 392, IRL: 328, MAR: 194, DOM: 127, MDA: 58, MMR: 258, BOL: 67, ARE: 238, URY: 149, ARM: 49, UZB: 116,
  KHM: 229, IRN: 159, KWT: 185, DZA: 115, AZE: 110, GEO: 116, CUB: 49, SYR: 62, BHR: 47, XKX: 63, MNE: 19, VEN: 184, TUN: 93, AFG: 10, LAO: 108, ECU: 77, GTM: 52,
  BGD: 108, PSE: 28, MLT: 299, SEN: 12, CRI: 82, ALB: 59, NIC: 12, PAN: 60, LUX: 43, QAT: 53, HND: 28, OMN: 24, PRY: 44, LBY: 14, YEM: 10, LKA: 29, CMR: 1, ETH: 1,
  NGA: 6, TTO: 8, MUS: 23, SLV: 16, JAM: 18, GUY: 2, CIV: 7, SDN: 3, FJI: 1, TKM: 6, NAM: 5, TZA: 1, ZWE: 2, SUR: 2, TJK: 1, MDG: 6, GHA: 6, MOZ: 5, KEN: 3, CYP: 10,
  ZMB: 2, AGO: 3, TGO: 1, MDV: 7, MRT: 1, GAB: 1, BWA: 1, UGA: 2, PNG: 1 };
const espK = c => { const k = CBY.KOR; if (!c || !ESP_EE[c.id] || !c.b || !k || !k.b) return 0; return Math.min(1.5, (ESP_EE[c.id] / c.b) / (ESP_EE.KOR / k.b)); };
const espY = c => c.id === 'KOR' ? 1999 : 2010;
const gameHobby = () => S.hobbies.find(h => h.id === 'games' && h.since <= 14 && h.lv >= 2.5);
const gameSk = h => Math.pow(clamp((h.lv - 2.5) / 3.5, 0, 1.2), 2);
const gameWin = h => clamp(0.16 + (h.lv - 4) * 0.04 + talPass('hd') * 0.6 + (S.st.hl - 60) / 600, 0.05, 0.45);
const ESP_ASK = 0.21, ESP_FEM = 0.05, ESP_DEBUT = [0.3, 0.35, 0.3], ESP_CUT = 0.15;
const gamerOn = () => !!(S.flags.gamer && !S.flags.gamer.done && !S.flags.gamer.end);
const gamerLeave = a => a >= 26 ? 0.45 : a >= 24 ? 0.3 : 0.15;
function gamerDebut() {
  const G = S.flags.gamer; G.pro = 1; G.proAt = S.age;
  if (S.school) { G.wait = 1; log("Bạn đã ký hợp đồng với đội hình chính! Bạn quyết định học xong sẽ toàn tâm cho sự nghiệp tuyển thủ.", 'big'); S.yearMark = 'star'; eff({ h: 10, so: 2 }); return; }
  gamerStart(); log("Được lên đội hình chính, bạn ra mắt với tư cách tuyển thủ thể thao điện tử chuyên nghiệp! Bạn đã thi đấu trận đầu tiên ở giải đấu.", 'big', S.cur === 'KOR' ? "Năm 2024, các đội thể thao điện tử chuyên nghiệp của Hàn Quốc có 398 tuyển thủ và 167 tuyển thủ ở đội đào tạo trẻ. Tuổi trung bình của tuyển thủ là 23,5, số năm thi đấu trung bình là 4,6 năm (KOCCA, khảo sát thể thao điện tử 2025)" : null);
  S.yearMark = 'star'; eff({ h: 12, so: 2 });
}
function gamerStart() { const G = S.flags.gamer; G.wait = 0; G.proAt = S.age; takeJob({ id: 'progamer', formal: false, pct: clamp(jobRange('progamer', C())[0] + 0.1 + rnd() * 0.15, 0, 0.9) }); }
function gamerEnd(why) {
  const G = S.flags.gamer; G.end = 1; S.flags.exGamer = 1; S.flags.gameEndQ = 1; eff({ h: -6 });
  const y = S.age - (G.proAt || S.age);
  if (why === 'age') log(y >= 2 ? L`반응 속도가 예전 같지 않아 은퇴를 결심했습니다. 데뷔 ${y}년 만입니다.` : "Phản xạ không còn như trước, bạn quyết định giải nghệ.", 'big');
  else log("Hợp đồng với đội kết thúc và bạn không tìm được đội mới. Sự nghiệp tuyển thủ đã khép lại.", 'big');
}
const GAME_AC_DAYS = ["Mỗi ngày bạn tập hơn mười tiếng với các trận đấu tập và đấu xếp hạng.", "Huấn luyện viên tua lại video trận đấu trước, chỉ ra từng lỗi một.", "Lần đầu tiên bạn ra sân trong đội hình xuất phát ở giải đấu của đội trẻ.",
  "Cổ tay ê ẩm, bạn phải nghỉ tập mấy ngày.", "Bạn chứng kiến một đồng đội cùng ký túc xá được gọi lên đội hình chính.", "Bạn đấu xếp hạng đến tận khuya và leo được thứ hạng."];
const GAME_PRO_DAYS = ["Bạn thi đấu ở một nhà thi đấu chật kín khán giả.", "Bản cập nhật mới ra, cả đội thức trắng đêm để xây dựng lại chiến thuật.", "Bạn thức đến sáng để đấu tập với một đội nước ngoài.",
  "Thua trận, bạn trở về ký túc xá và lặng lẽ vào đấu xếp hạng tiếp.", "Ở buổi ký tặng người hâm mộ, những người lần đầu gặp đã gọi tên bạn.", "Bạn vẫn ra sân thi đấu trong khi điều trị vật lý trị liệu vì đau cổ tay.",
  "Ngày nghỉ, bạn phát trực tiếp và trò chuyện với người hâm mộ."];
const actHobby = () => S.hobbies.find(h => h.id === 'drama' && h.since <= 18 && h.lv >= 4);
const BOARD_DAYS_GO = ["Bạn đánh một ván cờ suốt cả ngày ở giải đấu, rồi thua nửa mục ở giai đoạn thu quan.", "Bạn dạy các em nhỏ những thế định thức ở lớp cờ vây.", "Đánh xong, bạn ngồi đối diện đối thủ và bày lại ván cờ từng nước một.", "Bạn bày lại các ván cờ trong kỳ phổ đến tận khuya để chuẩn bị cho ván đấu tiếp theo.", "Bạn làm bình luận viên cho một ván cờ trên kênh truyền hình cờ vây."];
const BOARD_DAYS_CH = ["Bạn đánh chín ván tại một giải mở rộng cuối tuần. Hòa ván cuối, bạn đồng hạng ba.", "Bạn dạy cờ vua trực tuyến cho trẻ em.", "Bạn nối mấy chuyến bay để đi dự một giải đấu ở nước ngoài rồi trở về.", "Bạn thức khuya bên bàn cờ để học một khai cuộc mới.", "Được câu lạc bộ cờ vua của một trường học mời, bạn đánh cờ đồng loạt với nhiều người."];
const ACT_DAYS = ["Bạn đứng trên sân khấu một nhà hát nhỏ, biểu diễn suốt một tháng.", "Bạn đóng một vai chỉ có vài câu thoại trong một bộ phim truyền hình.", "Bạn đi thử vai hơn mười lần nhưng không nhận được hồi âm nào.", "Một lần quay quảng cáo giúp bạn có tiền sinh hoạt cho vài tháng.",
  "Bạn dạy trẻ em ở một trung tâm dạy diễn xuất để có thêm thu nhập.", "Lần đầu tiên bạn nhận một vai có tên riêng, trong một bộ phim độc lập.", "Hết tháng này đến tháng khác không có việc, tiền sinh hoạt trở nên eo hẹp."];
const DNC_DAYS = ["Bạn giữ vững vị trí của mình trong đội múa tập thể ở các buổi biểu diễn định kỳ.", "Để dựng một tác phẩm mới, bạn ở trong phòng tập tám tiếng mỗi ngày.", "Chấn thương mắt cá chân khiến bạn không thể lên sân khấu trong nhiều tuần.",
  "Bạn dạy một lớp múa cho trẻ em để có thêm thu nhập.", "Lần đầu tiên bạn biên đạo một tác phẩm ngắn.", "Bạn đi lưu diễn qua nhiều thành phố.", "Nhiều tháng liền không có buổi diễn nào, tiền sinh hoạt trở nên eo hẹp."];
const ART_K = 0.005, ART_WIN = 0.4;
const artHobby = () => S.hobbies.find(h => (h.id === 'art' || h.id === 'crafts' || h.id === 'photo') && h.since <= 16 && h.lv >= 4);
const ART_DAYS = ["Bạn mở triển lãm cá nhân đầu tiên tại một phòng tranh nhỏ.", "Bạn vẽ minh họa cho một cuốn sách tranh.", "Bạn được đặt vẽ một bức tranh tường trên bức tường của khu phố.", "Bạn trang trải cuộc sống bằng việc dạy trẻ em vẽ.",
  "Có người thấy tranh bạn đăng trên mạng và tìm đến đặt việc.", "Nhiều tháng liền không bán được một bức tranh nào.", "Bạn vẽ suốt đêm, vẽ đi vẽ lại cho đến khi ưng ý."];
const offDays = (list, i) => S.flags.net ? list : list.filter((t, j) => j !== i);
const TRAINEE_DAYS = ["Bạn trình diễn hát và nhảy trong buổi đánh giá cuối tháng.", "Bạn tập vũ đạo trước gương phòng tập cho đến tận rạng sáng.", "Một thực tập sinh cùng khóa với bạn đã rời công ty.",
  "Nhiều hôm bạn bỏ bữa tối để giữ cân.", "Những buổi bạn vắng mặt ở trường ngày càng nhiều.", "Có tin đồn về đội hình ra mắt, nhưng tên bạn không được gọi."];
const TRAINEE_AB_DAYS = ["Trong lớp tiếng Hàn, lần đầu tiên bạn tự giới thiệu bằng tiếng Hàn.", "Buổi tối ở ký túc xá, bạn gọi video cho gia đình ở quê nhà.", "Ngay cả dịp lễ Tết bạn cũng không về quê được, phải ở lại ký túc xá.",
  "Bạn đến văn phòng xuất nhập cảnh để gia hạn thời gian lưu trú.", "Nhớ món ăn quê nhà, bạn tự tay nấu cho các bạn cùng khóa."];
const IDOL_DAYS = ["Bạn biểu diễn trên một chương trình âm nhạc truyền hình.", "Tại buổi ký tặng, một người hâm mộ bạn chưa từng gặp đã gọi tên bạn.", "Bạn trở lại sân khấu với một album mới.",
  "Bạn biểu diễn trước người hâm mộ ở nước ngoài.", "Bạn trò chuyện với các thành viên trong ký túc xá đến tận khuya.", "Bạn được cho biết công ty vẫn chưa thu hồi xong chi phí ra mắt, nên chuyện được chia thu nhập vẫn còn xa."];
const MUS_DAYS = ["Bạn tổ chức một buổi diễn riêng tại một sân khấu nhỏ.", "Lần đầu tiên bạn phát hành một bài hát do chính mình sáng tác.", "Bạn trang trải cuộc sống bằng việc hát ở đám cưới và các sự kiện.", "Bạn dạy nhạc cụ cho trẻ em để có thêm thu nhập.",
  "Bạn cùng các bạn trong ban nhạc đi lưu diễn qua nhiều thành phố.", "Khi biểu diễn trên đường phố, bạn đã cùng hát với những người chưa từng quen.", "Nhiều tháng liền không có buổi diễn nào, tiền sinh hoạt trở nên eo hẹp."]
const isSportH = h => h.id === 'sport' || h.id.startsWith('sp_');
const sportHobby = () => S.hobbies.find(h => isSportH(h) && h.since <= 14 && h.lv >= 5);
const proHobby = () => sportHobby() || (S.flags.youth ? S.hobbies.find(h => h.id === S.flags.youth.id) || { id: S.flags.youth.id, lv: 5 } : null);
const sportBack = (lv = 4) => !!(S.flags.youth || S.flags.sportTry || S.flags.exAthlete || S.hobbies.some(h => isSportH(h) && h.since <= 12 && h.lv >= lv));
const sportBackName = () => { const h = S.hobbies.find(isSportH) || (S.flags.youth && { id: S.flags.youth.id }); return h ? hobbyName(h.id) : S.flags.athSp || "Thể thao"; };
const CLUB_SP = ['football', 'baseball', 'basketball', 'icehockey', 'rugby', 'volleyball', 'handball', 'aussie', 'amfootball', 'gaelic', 'waterpolo'];
const youthKind = id => { const sp = id.replace(/^sp_/, ''); return sp === 'running' ? 'run' : CLUB_SP.includes(sp) ? 'club' : 'sel'; };
const youthHobby = () => S.hobbies.find(h => isSportH(h) && h.since <= 10 && h.lv >= 1.7);
const APPR = { mechanic: [1, 0.08], electric: [0.7, 0.08], hair: [0.15, 1], cook: [0.5, 0.6], artisan: [0.8, 0.8] };
const APPR_N = { mechanic: "thợ sửa ô tô", electric: "thợ điện", hair: "thợ làm tóc", cook: "đầu bếp", artisan: "thợ mộc hoặc thợ may" };
const ATH_DAYS = ["Bạn nâng cao thể lực trong một đợt tập huấn tập trung.", "Chấn thương khiến bạn phải nghỉ thi đấu vài tuần.", "Bạn ra sân trong đội hình chính suốt cả mùa giải.", "Một người hâm mộ nhỏ tuổi tìm đến xin chữ ký của bạn."];
const GOAL_SP = new Set(['football', 'icehockey', 'handball', 'waterpolo', 'hockey', 'gaelic', 'aussie', 'netball', 'polo', 'basketball']);
const athDays = A => { const id = String(A.sid || (proHobby() || {}).id || '').replace(/^sp_/, ''); return ATH_DAYS.concat(GOAL_SP.has(id) ? ["Bạn ghi bàn thắng quyết định trong một trận đấu quan trọng."] : ["Bạn là người định đoạt một trận đấu quan trọng."]); };
function athBack() {
  const A = S.ath; A.svc = 0;
  if (S.age >= A.until - 1) { endAthlete("Trong thời gian bạn đi nghĩa vụ, những năm tháng có thể thi đấu đã trôi qua."); return; }
  setRareJob('athlete'); S.pct = clamp((A.pct || S.pct) - 0.04, 0, 0.99); S.income = incomeAt(C(), S.pct);
  log("Xuất ngũ xong, bạn trở lại đội. Phải mất một mùa giải bạn mới lấy lại được thể lực.", 'big');
}
const MAJ_LG = { baseball: "giải bóng chày Major League", amfootball: 'NFL', basketball: 'NBA', icehockey: 'NHL' }, MAJ_P = 0.03;
const majLg = A => A && A.sid && (S.cur === 'USA' || S.cur === 'CAN') && calYr() >= 2000 && MAJ_LG[String(A.sid).replace(/^sp_/, '')] || null;
function endAthlete(msg) {
  const A = S.ath || {}; S.ath = null; S.flags.exAthlete = 1; S.flags.athSp = A.sp;
  if (S.age < 19 && S.edu < 3 && S.serveLeft === 0) { S.school = S.edu >= 2 ? 'usec' : 'lsec'; S.schoolY = 0; S.job = 'student'; log(L`${msg} 다시 학교로 돌아갔습니다.`, 'big'); return; }
  if (S.age >= 23 && S.age < retireAge(C()) && chance(A.star ? 0.5 : 0.35)) { takeJob({ id: 'coach', formal: true, pct: clamp(0.45 + (A.star ? 0.15 : 0), 0, 0.9) }); log(L`${msg} 이제 후배들을 가르치는 코치가 되었습니다.`, 'big'); return; }
  S.job = 'seeking'; S.flags.seekY = 0; log(L`${msg} 새로운 일을 찾기 시작했습니다.`, 'big');
}
const bizWhat = () => rankOf('owner') >= 1 || S.flags.bizBig || S.flags.bizScale ? "công ty" : BIZ_K[S.flags.bizK] && BIZ_K[S.flags.bizK].pro ? "văn phòng" : L`가게${LBL}`;
const BIZ_BUYER = 0.25;
const bizEarnNow = () => incomeAt(C(), payPct(S.pct, 'owner', false)) * eraIncK() * (S.flags.bizPt ? 0.8 : 1);
const bizEarn = () => S.flags.bizE || bizEarnNow();
const bizMult = mid => { const K = BIZ_K[S.flags.bizK] || {}; return ((mid ? 2.5 : 1.5 + 2 * rnd()) + (S.flags.bizK === 'workshop' ? 0.5 : 0)) * (K.pro ? 0.5 : 1); };
const bizVal = mid => { const r = rankOf('owner'), m = med(); if (S.flags.bizScale || S.flags.bizL) return 0;
  if (r >= 2) return m * (mid ? 40 : 20 + 40 * rnd());
  const e = S.job === 'owner' ? bizEarn() * bizMult(mid) : 0;
  return Math.max(e, m * (r >= 1 ? (mid ? 8 : 4 + 8 * rnd()) : S.flags.bizBig ? (mid ? 5.5 : 3 + 5 * rnd()) : 0.3)); };
const aiShop = () => S.era === 'future' && calYr() >= 2035;
function bizKeepYear(add) {
  const K = S.flags.bizKeep; if (!K) return;
  if (chance(aiShop() ? 0.05 : 0.07)) { S.flags.bizKeep = null; book("Cổ phần doanh nghiệp", -K.v); log(L`맡겨 둔 ${iga(K.w)} 기울어 결국 문을 닫았습니다.`, 'bad'); return; }
  add("Cổ tức từ cổ phần doanh nghiệp", K.v * (aiShop() ? 0.16 : 0.12));
}
function bizExit() {
  const r = rankOf('owner'), m = med(), pro = BIZ_K[S.flags.bizK] && BIZ_K[S.flags.bizK].pro;
  const what = bizWhat(), v = bizVal();
  const kid = S.fam.kids.find(k => k.alive && k.grown && k.near && !k.away && !k.abroad && S.age - k.bornAt >= 25);
  S.flags.bizKx = S.flags.bizK;
  const held = S.flags.bizScale || S.flags.bizL;
  const big = S.flags.bizBig; S.flags.bizK = null; S.flags.bizBig = 0; S.flags.bizPt = 0; S.flags.bizStaff = 0;
  if (kid && chance(0.3)) return L`일군 ${eul(what)} ${callName(kid.name)}에게 물려주었습니다.`;
  if (held) return "Bạn giao việc điều hành công ty cho một giám đốc mới và chỉ giữ lại cổ phần.";
  if (!r && !big && !chance(BIZ_BUYER)) {
    const a = m * (0.3 + 1.2 * rnd()); S.money += a; book("Tiền sang nhượng doanh nghiệp", a);
    return L`일군 ${eul(what)} 사겠다는 사람이 나서지 않아, 문을 닫고 집기와 물건을 정리해 ${wonStr(a)}을 받았습니다.`;
  }
  S.money += v; book("Tiền sang nhượng doanh nghiệp", v);
  return L`일군 ${eul(what)} 넘기고 ${wonStr(v)}을 받았습니다.`;
}
function bizLeave() {
  if (S.flags.bizKeep || S.flags.bizScale || S.flags.bizL || (BIZ_K[S.flags.bizK] && BIZ_K[S.flags.bizK].pro && S.flags.bizK !== 'soft')) return bizExit();
  const v = bizVal(), w = bizWhat(); if (!(v > 0)) return bizExit();
  S.flags.bizKeep = { v, w, at: S.age }; book("Cổ phần doanh nghiệp", v); S.flags.bizKx = S.flags.bizK; S.flags.bizK = null; S.flags.bizBig = 0; S.flags.bizPt = 0; S.flags.bizStaff = 0;
  return L`운영하던 ${eun(w)} 믿을 만한 사람에게 맡기고, 지분만 지닌 채 떠났습니다.`;
}
const HAND_W = { farm: "mảnh đất bạn từng canh tác", herder: "đàn gia súc", fisher: "chiếc thuyền đánh cá", agbiz: "trang trại", vendor: "sạp hàng", artisan: "xưởng thủ công" };
function workHandDown() {
  const what = S.job === 'herder' && rankOf('herder') >= 1 ? "trang trại chăn nuôi" : S.job === 'farm' && landState() ? "việc đồng áng" : HAND_W[S.job]; if (!what || S.cur !== S.born) return '';
  const kid = S.fam.kids.find(k => k.alive && (k.near || k.withMe || k.stay || !k.grown) && !k.abroad && !k.away && S.age - k.bornAt >= 20);
  const p = JOBS[S.job].s === 'agr' ? (['ssa', 'sa', 'eap'].includes(C().p) ? 0.6 : 0.4) : 0.25;
  if (!kid || !chance(p)) return '';
  kid.job = S.job; return L`평생 일군 ${eul(what)} ${callName(kid.name)}에게 물려주었습니다.`;
}
const bizScaleOK = () => S.job === 'owner' && !S.retired && (rankOf('owner') >= 1 || S.flags.bizBig) && S.jobY >= 4 && S.age >= 28 && S.age <= 62 && !S.flags.bizScale && !S.flags.bizL
  && !(BIZ_K[S.flags.bizK] && BIZ_K[S.flags.bizK].pro && S.flags.bizK !== 'soft') && (S.flags.bizScaleN || 0) < 2 && (S.flags.bizScaleAt == null || S.age - S.flags.bizScaleAt >= 6);
const BIZ_SCALE_P = 0.08;
const bigCo = () => !!(S.flags.bizScale || S.flags.bizL);
function rareDecision(a, c) {
  if (S.job === 'prison') return null;
  if (vocOK(a) && chance(vocP(c))) return 'vocation';
  if (bizScaleOK() && chance(BIZ_SCALE_P * (S.flags.bizK === 'soft' ? 2 : 1) * (c.ppp > 15000 ? 1 : 0.6))) return 'bizscale';
  if (a >= 16 && a <= 22 && !(S.dis && S.dis.k !== 'hear') && !S.flags.proTried && !S.flags.dreamEnd && S.job !== 'athlete' && !inOffice() && !c.war && S.st.hl >= 65 && proHobby()
    && chance(PRO_K * (S.sex === 'M' ? 1 : 0.15) * (c.ppp > 15000 ? 1.3 : 0.8) * (S.flags.youth ? 6 : 0.8) * artsK('sport'))) return 'protry';
  if (a >= 10 && a <= 14 && !(S.dis && S.dis.k !== 'hear') && !S.flags.youthTried && !c.war && S.job !== 'prison' && youthHobby() && S.st.hl >= 50
    && chance(0.12 * (S.urban ? 1 : 0.5) * (c.ppp > 15000 ? 1.2 : 0.8))) return 'youthtry';
  if (a >= 11 && a <= 17 && !S.flags.trainee && S.job !== 'idol' && (S.flags.audN || 0) < 3 && (S.flags.audAt == null || a - S.flags.audAt >= 1)
    && !c.war && !eraBefore(1996) && idolHobby() && S.st.hl >= 40 && chance(IDOL_K * idolK() * (S.urban ? 1 : 0.4) * ((S.flags.audN || 0) ? 0.7 : 1))) return 'idolaud';
  if (S.flags.trainee && !S.flags.trainee.done && S.flags.trainee.y >= 2 && !S.flags.trainee.q) return 'traineeq';
  if (!S.flags.boardTried && !S.flags.boardPro && !inOffice() && !c.war && boardHobby() && (boardGame() === 'go' ? a >= 12 && a <= 17 : boardGame() === 'chess' && a >= 12 && a <= 18)
    && chance(BOARD_ASK * boardCK(c) * (S.urban ? 1.2 : 0.6) * boardSk(boardHobby()))) return 'boardtry';
  if (a >= 14 && a <= 18 && !S.flags.gameTried && !S.flags.gamer && !inOffice() && !c.war && S.st.hl >= 30 && calYr() >= espY(c) && gameHobby()
    && chance(ESP_ASK * espK(c) * (S.sex === 'M' ? 1 : ESP_FEM) * (S.urban ? 1.2 : 0.6) * gameSk(gameHobby()))) return 'gametry';
  if (S.school) return null;
  if (a >= 23 && a <= 55 && !S.flags.coachQ && isWorking() && !['coach', 'athlete', 'trainer'].includes(S.job) && !inOffice() && !c.war && sportBack()
    && chance((c.ppp > 15000 ? 0.004 : 0.0015) * (S.flags.youth || S.flags.exAthlete ? 2 : 1))) return 'coachq';
  if (a >= 17 && a <= 26 && !S.flags.musTried && S.job !== 'musician' && !inOffice() && !c.war && (musicHobby() || (S.major === 'mus' && S.edu >= 4))
    && chance(MUS_K * (c.ppp > 15000 ? 1.4 : c.ppp > 5000 ? 0.8 : 0.5) * (S.urban ? 1.2 : 0.7) * (S.major === 'mus' ? 1.5 : 1) * artsK('art'))) return 'mustry';
  if (a >= 17 && a <= 28 && !S.flags.dncTried && S.job !== 'dancer' && S.job !== 'idol' && !(S.flags.trainee && !S.flags.trainee.done) && !inOffice() && !c.war && (danceHobby() || (S.major === 'dnc' && S.edu >= 4))
    && chance(DNC_K * (c.ppp > 15000 ? 1.4 : c.ppp > 5000 ? 0.8 : 0.5) * (S.urban ? 1.2 : 0.6) * (S.major === 'dnc' ? 2.5 : 1) * artsK('art'))) return 'dnctry';
  if (a >= 17 && a <= 30 && !S.flags.actTried && S.job !== 'actor' && !inOffice() && !c.war && actHobby()
    && chance(ACT_K * (c.ppp > 15000 ? 1.4 : c.ppp > 5000 ? 0.8 : 0.5) * (S.urban ? 1.2 : 0.6) * (S.major === 'art' ? 1.5 : 1) * artsK('art'))) return 'acttry';
  if (a >= 18 && a <= 30 && !S.flags.artTried && S.job !== 'artist' && !inOffice() && !c.war && (artHobby() || (S.major === 'art' && S.edu >= 4))
    && chance(ART_K * (c.ppp > 15000 ? 1.4 : c.ppp > 5000 ? 0.8 : 0.5) * (S.urban ? 1.2 : 0.7) * (S.major === 'art' ? 1.5 : 1) * artsK('art'))) return 'arttry';
  if (a >= 13 && a <= 20 && S.edu <= 2 && !S.flags.skill && !S.done.apprent && ['childwork', 'seeking', 'farmhand', 'vendor', 'construct', 'domestic', 'garment', 'factory', 'cook', 'delivery'].includes(S.job)
    && chance(0.04 + 0.08 * clamp(informal(c), 0, 1))) return 'apprent';
  if (a >= 18 && a <= 35 && S.edu <= 3 && c.net >= 60 && !eraBefore(2000) && S.st.sm >= 35 && (isWorking() || S.job === 'seeking') && S.job !== 'dev' && !S.done.selfcode && !inOffice()
    && chance(0.0035 * c.net / 100 * (S.owns.pc ? 1.8 : 0.75))) return 'selfcode';
  if (S.mig && !S.refugee && a >= 20 && S.cur !== S.born && S.born !== 'PRK' && (S.flags.last_homecoming == null || a - S.flags.last_homecoming >= 5) && !inOffice() && homeTurn()) {
    const yrs = a - (S.migY || a), old = S.retired || a >= retireAge(c);
    const ex = S.flags.exile ? (homeShut() ? 0 : ({ cub59: 0, mariel: 0, boat: 0.1, irn79: 0.2, arg76: 1, chl73: 1 })[S.flags.exile] ?? 0.4) : 1;
    if (chance((old ? 0.08 : yrs <= 5 ? 0.14 : 0.025) * (S.flags.natz === S.cur ? 0.4 : 1) * ex * (famApart() ? 2.5 : 1))) return 'homecoming';
  }
  const nw = NOMAD_JOBS[S.job];
  if (nw && !S.nomad && !S.flags.nomadEver && a >= 23 && a <= 45 && c.net >= 70 && !S.refugee && !eraBefore(2010)) {
    const youngKids = S.fam.kids.some(k => k.alive && a - k.bornAt < 6);
    if (chance(nw * (c.p === 'hi' ? 0.025 : 0.012) * (youngKids ? 0.2 : 1) * (S.fam.married ? 0.5 : 1))) return 'nomad';
  }
  if (citizen() && !noVote(c)) {
    const O = S.office;
    if (O && O.lvl === 2 && (S.flags.mpYears || 0) >= 4 && a >= 40 && a <= 75 && !noLeader(c) && headOK(c) && (S.done.runleader || 0) < 2 && chance(0.05)) return 'runleader';
    if (!oneParty(c) && ((O && O.lvl === 1 && a - O.since >= 2 && a <= 70 && chance(0.07 * natRaceK(c))) || (!O && a >= 40 && a <= 65 && RUN_FAME.includes(S.job) && S.pct > 0.85 && chance((S.job === 'lawyer' ? 0.0045 : 0.0015) * natRaceK(c))))) { if ((S.done.runnational || 0) < 3) return 'runnational'; }
    if (!O && a >= 30 && a <= 70 && (S.done.runlocal || 0) < 2 && chance(0.0003 * clamp(S.st.so / 52, 0.3, 1.6) * (S.edu >= 4 ? 1.4 : 1) * (S.job === 'lawyer' ? 3 : S.edu >= 4 && S.major === 'law' ? 1.6 : 1) * (oneParty(c) && partyOf(c) ? (partyMem() ? 3 : 0.3) : 1))) return 'runlocal';
  }
  const aw = ASTRO_W[c.id] || 0.02;
  if (!RARE_JOBS.includes(S.job) && !S.dis && eraAstroOK(c) && a >= 27 && a <= 45 && (S.edu >= 5 || (S.edu >= 4 && ['engineer', 'soldier', 'pilot'].includes(S.job))) && ['engineer', 'prof', 'doctor', 'dev', 'soldier', 'pilot'].includes(S.job) && S.st.hl >= 70 && !recEver() && (S.done.astro || 0) < 2 && chance(0.006 * aw * (S.job === 'pilot' || (S.job === 'soldier' && S.flags.acadB === 'f') ? 3 : 1))) return 'astro';
  if (['THA', 'LAO', 'KHM'].includes(S.cur) && S.rel === 'B' && S.sex === 'M' && a >= 18 && a <= 26 && !S.fam.married && !S.done.ordain && chance(0.18)) return 'ordain';
  return null;
}
const LOCAL_DAYS = () => ["Bạn xin được ngân sách để sửa sang sân chơi trong khu phố.", "Tại buổi đối thoại với cư dân, bạn lắng nghe những phàn nàn về các tuyến xe buýt.", "Bạn trò chuyện đến tận khuya với các tiểu thương ở chợ về chuyện chỗ đỗ xe.",
  ...(C().haz.includes('F') ? ["Đề xuất tu sửa hệ thống mương thoát nước để phòng lũ của bạn đã được thông qua."] : []), "Đề xuất lắp đèn giao thông ở lối qua đường trước cổng trường đã được thông qua.",
  "Bạn đưa ra đề xuất tăng ngân sách bữa ăn miễn phí cho người cao tuổi.", "Điện thoại phàn nàn của cư dân về lịch thu gom rác reo suốt cả ngày.", "Đề xuất kéo dài giờ mở cửa thư viện khu phố đã được thông qua.",
  "Bạn cùng cư dân đi bộ qua những con hẻm có đèn đường bị tắt.", "Hội đồng tranh luận đến khuya về việc cấp phép một tòa nhà thương mại mới.", "Đề xuất làm lối dốc cho xe lăn ở mọi tòa nhà công cộng đã được thông qua.",
  ...(S.urban ? [] : ["Bạn giành được ngân sách để trải nhựa con đường vào làng.", "Bạn bàn với bà con trong làng về chuyện nước tưới tiêu."])];
const MP_DAYS = ["Dự luật đầu tiên do bạn đứng tên đề xuất đã được quốc hội thông qua.", "Bạn thẩm tra ngân sách đến tận khuya.", "Bạn dành cả ngày lắng nghe kiến nghị của cử tri trong đơn vị bầu cử của mình.", "Bạn tranh luận nảy lửa đến cùng với một nghị sĩ đảng đối lập.", "Trong phiên giám sát hoạt động của chính phủ, bạn đặt ra những câu hỏi sắc bén."];
const LEADER_DAYS = ["Bạn hội đàm với lãnh đạo các nước khác.", "Bạn đến vùng bị bão tàn phá và gặp gỡ người dân ở đó.", "Tỷ lệ ủng hộ giảm mạnh khiến bạn trăn trở rất nhiều.", "Bạn giằng co với quốc hội về dự toán ngân sách năm mới.", "Bạn nói chuyện với toàn dân về mười năm tới của đất nước."];
const ASTRO_DAYS = ["Bạn tập đi bộ ngoài không gian trong bể huấn luyện dưới nước.", "Bạn tập luyện trên máy bay mô phỏng không trọng lực, cơ thể lơ lửng trong khoang.", "Bạn được huấn luyện thoát hiểm khẩn cấp khỏi tàu vũ trụ."];
function ncoYear(a) {
  const f = S.flags; if (f.nco == null || f.ncoDone || S.job !== 'soldier' || f.offc != null || a - f.nco < 4) return;
  f.ncoDone = 1; const y = calYr();
  if (chance(y < 2027 ? 0.25 : y < 2028 ? 0.5 : 0.9)) { log("Bạn đã được chọn vào diện phục vụ dài hạn. Giờ bạn có thể ở lại quân đội đến tuổi nghỉ hưu.", 'big'); return; }
  f.ncoOut = 1; f.lastJob = S.job; S.job = 'seeking'; f.seekY = 0; eff({ h: -3 });
  log("Không được chọn vào diện phục vụ dài hạn, bạn xuất ngũ sau 4 năm phục vụ.", 'ev');
}
function soldierWarYear(a, c) {
  const f = S.flags;
  if (S.job !== 'soldier' || inOffice() || studyAway()) return;
  if (c.war >= 1 && f.frontAt == null) { f.frontAt = a; log("Trong khi đất nước có chiến tranh, bạn cùng đơn vị giữ vững chiến tuyến.", 'bad'); }
  else if (f.frontAt != null && f.frontBack == null && (c.war < 1 || a - f.frontAt >= 4)) { f.frontBack = a; log(c.war < 1 ? "Giao tranh lắng xuống, đơn vị của bạn rút khỏi tiền tuyến. Trong số những đồng đội cùng ra đi, có người đã không trở về." : "Sau vài năm ở tiền tuyến, bạn chuyển về một đơn vị ở hậu phương.", 'note'); }
}
const MOB = { UKR: { from: 2022, p: 0.03, lo: y => y >= 2024 ? 25 : 27, hi: 60, war: 1, pay: 0.55, die: 0.02 }, RUS: { from: 2022, to: 2022, p: 0.009, lo: () => 20, hi: 50, war: 0, pay: 0.92, die: 0.02 } };
const MOB_F = { UKR: () => "Sau khi chiến tranh toàn diện nổ ra năm 2022, Ukraina cấm phần lớn nam giới từ 18 đến 60 tuổi xuất cảnh, và vào tháng 4 năm 2024 đã hạ tuổi động viên từ 27 xuống 25. Tháng 1 năm 2025, quân đội Ukraina có khoảng 880.000 người",
  RUS: () => "Từ ngày 21 tháng 9 đến ngày 28 tháng 10 năm 2022, Nga đã động viên 300.000 quân nhân dự bị. Độ tuổi trung bình của họ là 35 (Bộ Quốc phòng Nga)" };
const mobOn = () => !!(S.flags.mob && S.flags.mob.back == null && S.serveLeft > 0);
function mobYear(a, c) {
  mobFam(a);
  const f = S.flags, M = MOB[S.cur];
  if (mobOn() && MOB[S.cur] && MOB[S.cur].war && c.war < 1 && S.serveLeft > 1) S.serveLeft = 1;
  if (mobOn() && f.mob.front == null && S.age > f.mob.at) { f.mob.front = S.age; log("Sau khi huấn luyện xong, bạn cùng đơn vị được điều ra tiền tuyến.", 'bad'); }
  if (mobOn() && f.mob.front != null && MOB[S.cur] && (!MOB[S.cur].war || c.war >= 1) && chance(MOB[S.cur].die)) { die('war'); return; }
  if (!M || f.mob || S.sex !== 'M' || S.cur !== S.born) return;
  const yr = calYr(); if (yr < M.from || (M.to && yr > M.to) || (M.war && c.war < 1)) return;
  if (a < M.lo(yr) || a > M.hi) return;
  if (S.serveLeft > 0 || ['soldier', 'police', 'prison'].includes(S.job) || S.school || S.dis || S.dd || inOffice() || S.refugee || studyAway() || f.hideCN || f.irreg != null) return;
  const kids = S.fam.kids.filter(k => k.alive && S.age - k.bornAt < 18).length;
  if (kids >= 3 || (kids && soloParent())) return;
  const k = !c.yr && yr > NOW_Y ? Math.pow(0.5, (yr - NOW_Y) / 7) : 1;
  if (!chance(M.p * k)) return;
  const job = isWorking() ? S.job : null;
  f.mob = { at: a, job, pct: S.pct, formal: S.formal };
  S.serveLeft = ri(2, 4); S.job = 'service'; S.yearMark = 'svc'; eff({ h: -8, so: -2 });
  const P = S.fam.partner, home = S.fam.married && P && P.alive && !P.divorced;
  log("Bạn nhận được lệnh động viên. Bạn gác lại công việc đang làm và gia nhập một đơn vị." + (home ? ' ' + (kids ? "Bạn đời và các con tiễn bạn ra tận nhà ga." : "Bạn đời tiễn bạn ra tận nhà ga.") : ''), 'big', MOB_F[S.cur]());
}
function mobFam(a) {
  const f = S.fam; if (!f || S.isComp) return;
  const yr = calYr(), minors = f.kids.filter(k => k.alive && a - k.bornAt < 18).length;
  const one = (x, land, age, kid) => {
    const M = land && MOB[land.id], m = x.mob, n = callName(x.name);
    if (m && m.back == null) {
      if (!x.alive) { m.back = a; return; }
      const on = !M || !M.war || land.war >= 1;
      if (M && on && a > m.at && chance(M.die)) { x.mobD = 1; return; }
      if (a >= m.to || !on) { m.back = a; eff({ h: 4 }); log(kid ? L`${iga(n)} 복무를 마치고 무사히 집으로 돌아왔습니다.` : L`배우자 ${iga(n)} 복무를 마치고 무사히 집으로 돌아왔습니다.`, 'warm'); }
      return;
    }
    if (m || !M || !x.alive || x.sex !== 'M' || yr < M.from || (M.to && yr > M.to) || (M.war && land.war < 1) || age < M.lo(yr) || age > M.hi) return;
    if (['soldier', 'police', 'prison', 'student'].includes(x.job)) return;
    const k = !land.yr && yr > NOW_Y ? Math.pow(0.5, (yr - NOW_Y) / 7) : 1;
    if (!chance(M.p * k)) return;
    x.mob = { at: a, to: a + ri(2, 4) }; eff({ h: -5 });
    log(kid ? L`${iga(n)} 동원 통지서를 받고 부대에 합류했습니다.` : L`배우자 ${iga(n)} 동원 통지서를 받고 부대에 합류했습니다.`, 'bad', MOB_F[land.id] ? MOB_F[land.id]() : null);
  };
  for (const k of f.kids) {
    if (!k.alive && !k.mob) continue;
    const ka = a - k.bornAt;
    if (!k.mob && (ka < 18 || kidNotOurs(k) || nkCut(k) || kidInPr(k) || k.dd || (k.path === 'uni' && ka < 23) || gkOf(callName(k.name)).length >= 3)) continue;
    one(k, kidLand(k), ka, true);
  }
  const P = f.partner;
  if (P && P.mob && P.mob.back == null && P.divorced) P.mob.back = a;
  else if (P && P.name && (P.mob || (P.alive && !P.divorced && !P.ill && (f.married || f.co) && minors < 3 && (!P.nat || P.nat === S.cur || (P.lb && P.nat === P.lbIn)))))
    one(P, P.lb && CBY[P.lbIn] ? CBY[P.lbIn] : C(), P.age, false);
}
function mobBack() {
  const m = S.flags.mob; m.back = S.age; S.served = true;
  if (m.job && JOBS[m.job] && !NONWORK.includes(m.job)) { S.job = m.job; S.pct = m.pct; S.formal = m.formal; S.jobY = 0; }
  else { S.job = 'seeking'; S.flags.seekY = 0; }
  eff({ h: 6, so: 3 });
  logA('mil:out', "Kết thúc thời gian phục vụ theo lệnh động viên, bạn trở về nhà." + (m.job && S.job === m.job ? ' ' + (m.job === 'owner' ? "Bạn bắt đầu tự điều hành lại công việc kinh doanh từng giao cho người khác." : "Bạn trở lại nơi làm việc cũ.") : ''), 'big');
}
function rareYear() {
  const c = C(), a = S.age;
  clergyYear(a);
  if (((a >= 18 && S.flags.proTried) || a >= (S.flags.youth ? 19 : 21)) && (S.flags.youth || S.flags.sportTry != null) && !S.flags.dreamEnd && S.job !== 'athlete' && !S.flags.exAthlete && !S.ath) {
    S.flags.dreamEnd = a; const sp = sportBackName();
    log(S.flags.youth ? L`유소년팀을 나왔습니다. 프로 선수의 꿈은 꿈으로 남았지만, ${eun(sp)} 평생의 친구가 되었습니다.` : L`프로 선수의 꿈은 꿈으로 남았지만, ${eun(sp)} 평생의 친구가 되었습니다.`, 'note');
  }
  if (S.flags.apprUntil === a) { const id = S.flags.skill; if (S.job === id) S.pct = clamp(S.pct + 0.05, 0, 0.99); eff({ sm: 2, h: 3 }); log(L`견습을 마치고 어엿한 ${iga(frSx(APPR_N[id], S.sex) || shortJob(id))} 되었습니다.`, 'big'); }
  if (S.flags.codeAt === a) {
    if (S.flags.codeOK) { S.flags.codeOffer = 1; eff({ sm: 4, h: 4 }); log("Sau bao đêm miệt mài học, bạn đã có thể tự mình xây dựng một dịch vụ web.", 'big', "Khoảng một phần ba lập trình viên không có bằng cử nhân (Stack Overflow 2024)"); }
    else { eff({ h: -2 }); log("Bạn không theo học lập trình được đến cùng. Dù vậy, máy tính giờ đã quen thuộc với bạn hơn nhiều."); }
  }
  if (S.job === 'athlete') {
    const A = S.ath || (S.ath = { sp: "Thể thao", until: ri(30, 35), star: false });
    if (chance(0.035)) { endAthlete("Một chấn thương nặng khiến bạn phải sớm kết thúc sự nghiệp thi đấu."); eff({ h: -10, hl: -6 }); }
    else if (a >= A.until) endAthlete(L`${a}세에 선수 생활을 마쳤습니다.`);
    else if (!A.maj && !A.star && a >= 19 && a <= 30 && majLg(A) && chance(MAJ_P)) { A.maj = 1; S.pct = Math.max(S.pct, 0.985 + rnd() * 0.008); S.income = incomeAt(c, S.pct); eff({ h: 12 }); S.yearMark = 'star';
      log(L`${majLg(A)} 구단과 계약해 그 무대에 올랐습니다. 이 리그에서는 가장 적게 받는 선수도 일 년에 수십만 달러를 받습니다.`, 'big', "Năm 2025, mức lương tối thiểu là 760.000 đô la ở Major League Baseball, 840.000 đô la ở NFL và 775.000 đô la ở NHL. Trong số các tân binh bóng chày chuyên nghiệp, khoảng 1 trên 4 người từng được thi đấu ở Major League (Karcher 2017, SABR)"); }
    else if (!A.star && a >= 20 && chance(0.004 * (c.ppp > 15000 ? 1.5 : 1))) { A.star = true; S.flags.athStar = 1; S.pct = 0.99; eff({ h: 15 }); S.yearMark = 'star'; log("Được đánh giá là một trong những vận động viên xuất sắc nhất giải, bạn ký hợp đồng với một câu lạc bộ lớn. Đó là đấu trường bạn hằng mơ ước từ thuở nhỏ.", 'big', "2% cầu thủ bóng đá chuyên nghiệp có thu nhập hơn 720.000 đô la mỗi năm (FIFPRO 2016)"); }
    else if (!A.nat && a >= 19 && a <= 33 && chance(A.star ? 0.25 : 0.015)) { A.nat = 1; S.flags.natTeam = a; eff({ h: 10, so: 3 }); S.yearMark = 'star'; logA('award:medal', L`${A.sp} 국가대표로 뽑혔습니다. 가슴에 나라 이름을 달고 뛰었습니다.`, 'big'); }
    else if (chance(0.3)) log(varied('ath', athDays(A)));
  }
  const T = S.flags.trainee;
  if (T && !T.done && !(S.serveLeft > 0)) {
    T.y++; eff({ hl: -1, sm: -1 });
    if (T.ab && S.cur === 'KOR') T.ab = null;
    const ab = !!T.ab, back = ab ? ' ' + L`고향 ${ro(C().ko)} 돌아왔습니다.` : '';
    if (ab && S.cur !== T.ab) { T.done = 1; S.flags.idolDream = 1; log(L`가족이 ${ro(C().ko)} 옮기면서 연습생 생활도 끝났습니다.`); }
    else if (!ab && S.cur !== 'KOR') { T.done = 1; S.flags.idolDream = 1; log("Rời Hàn Quốc, quãng đời thực tập sinh của bạn cũng khép lại."); }
    else if (a >= 15 && chance(IDOL_DEBUT[T.y - 1] != null ? IDOL_DEBUT[T.y - 1] : 0.2)) idolDebut();
    else if (a >= 23 || T.y >= 7 || chance(0.12)) { T.done = 1; S.flags.idolDream = 1; eff({ h: -6, so: ab ? 5 : 0 }); log((a >= 23 ? "Đã quá tuổi, bạn kết thúc quãng đời thực tập sinh." : "Công ty quyết định không gia hạn hợp đồng. Quãng đời thực tập sinh của bạn đã kết thúc.") + back, 'bad'); }
    else if (ab && chance(0.3)) log(varied('traineeAb', TRAINEE_AB_DAYS));
    else if (chance(0.55)) log(varied('trainee', TRAINEE_DAYS));
  }
  if (S.job === 'idol' && S.idol && !S.idol.end) {
    const I = S.idol; I.y++;
    const surv = IDOL_SURV[Math.min(I.y, IDOL_SURV.length) - 1];
    if (!I.hit && chance(0.014)) { I.hit = 1; S.pct = Math.max(S.pct, 0.97); S.income = incomeAt(C(), S.pct); eff({ h: 12 }); S.yearMark = 'star'; log("Bài hát bạn phát hành trở thành một bản hit lớn. Tên nhóm bạn được xướng lên ở vị trí số 1 của một chương trình âm nhạc.", 'big'); }
    else if (I.hit === 1 && chance(0.012)) { I.hit = 2; S.pct = 0.995; S.income = incomeAt(C(), S.pct); eff({ h: 10 }); S.yearMark = 'star'; log("Album của bạn bán được hơn 1 triệu bản. Buổi diễn nào cũng chật kín người hâm mộ.", 'big'); }
    else if (!chance(I.hit ? Math.min(0.96, surv + 0.08) : surv)) idolEnd();
    else if (chance(0.4)) log(varied('idol', IDOL_DAYS));
  }
  if (S.flags.idolDream && !S.flags.idolDreamEnd && a >= 20 && S.job !== 'idol' && !S.flags.exIdol && !(S.flags.trainee && !S.flags.trainee.done)) {
    S.flags.idolDreamEnd = a; log("Giấc mơ thần tượng mãi chỉ là giấc mơ, nhưng ca hát và nhảy múa đã trở thành niềm vui suốt đời của bạn.");
  }
  if (S.job === 'musician' && a < 75) {
    if (!S.flags.musStar && chance(0.003 * (c.ppp > 15000 ? 1.5 : 1))) { S.flags.musStar = 1; S.pct = 0.99; eff({ h: 15 }); S.yearMark = 'star'; log("Bài hát bạn thể hiện trở thành một bản hit lớn. Buổi diễn nào cũng chật kín khán giả.", 'big'); }
    else if (!S.flags.musStar && a < retireAge(c) && S.jobY >= 2 && chance(0.05)) { S.flags.lastJob = 'musician'; S.flags.exMusician = 1; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 }); log("Chỉ làm nhạc thôi thì cuộc sống chật vật, nên bạn bắt đầu tìm việc khác. Bạn vẫn tiếp tục biểu diễn vào mỗi cuối tuần."); }
    else if (chance(0.3)) log(varied('mus', MUS_DAYS));
  }
  if (S.job === 'actor' && a < 80) {
    if (!S.flags.actStar && chance(0.002 * (c.ppp > 15000 ? 1.5 : 1))) { S.flags.actStar = 1; S.pct = 0.98; eff({ h: 15 }); S.yearMark = 'star'; log("Tác phẩm bạn đóng vai chính được yêu thích rộng rãi. Bắt đầu có người nhận ra bạn trên phố.", 'big'); }
    else if (!S.flags.actStar && a < retireAge(c) && S.jobY >= 2 && chance(0.06)) { S.flags.lastJob = 'actor'; S.flags.exActor = 1; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 }); log("Chỉ diễn xuất thôi thì cuộc sống chật vật, nên bạn bắt đầu tìm việc khác. Cuối tuần, bạn diễn trên sân khấu của một đoàn kịch địa phương."); }
    else if (chance(0.3)) log(varied('act', ACT_DAYS));
  }
  if (S.job === 'dancer' && a < 70) {
    if (!S.flags.dncStar && a <= 40 && chance(0.002 * (c.ppp > 15000 ? 1.5 : 1))) { S.flags.dncStar = 1; S.pct = 0.95; eff({ h: 14 }); S.yearMark = 'star'; log("Vai chính của bạn trên sân khấu được khen ngợi hết lời. Suất diễn nào cũng cháy vé.", 'big'); }
    else if (a < retireAge(c) && S.jobY >= 2 && chance(a >= 33 ? (S.flags.dncStar ? 0.1 : 0.2) : S.flags.dncStar ? 0 : 0.06)) { S.flags.lastJob = 'dancer'; S.flags.exDancer = 1; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 }); log(a >= 33 ? "Cơ thể không còn như xưa, bạn rời sân khấu. Bạn tiếp tục gắn bó với múa bằng việc dạy trẻ em." : "Chỉ múa thôi thì cuộc sống chật vật, nên bạn bắt đầu tìm việc khác. Bạn vẫn tiếp tục múa ở các lớp học buổi tối."); }
    else if (chance(0.3)) log(varied('dnc', DNC_DAYS));
  }
  if (S.job === 'boardpro' && a < 80) {
    const go = boardGame() === 'go', y = a - ((S.flags.boardPro && S.flags.boardPro.at) || a);
    if (!S.flags.boardTop && y >= 3 && chance(go ? 0.06 : 0.07) && y <= 15) { S.flags.boardTop = 1; S.pct = clamp(S.pct + 0.12, 0, payTop()); eff({ h: 8 }); S.yearMark = 'star'; log(go ? "Thăng đẳng hết lần này đến lần khác, cuối cùng bạn đạt 9 đẳng." : "Bạn đạt danh hiệu Đại kiện tướng. Tên bạn xuất hiện trên bảng xếp hạng thế giới.", 'big'); }
    else if (!S.flags.boardStar && S.flags.boardTop && chance(go ? 0.006 : 0.004)) { S.flags.boardStar = 1; S.pct = 0.98; eff({ h: 15 }); S.yearMark = 'star'; log(go ? "Bạn vô địch một giải cờ lớn và giành danh hiệu. Ván đấu vừa kết thúc, ánh đèn flash máy ảnh lóe lên dồn dập." : "Bạn vô địch một giải đấu quốc tế lớn. Gương mặt bạn xuất hiện trên bìa một tạp chí cờ vua.", 'big'); }
    else if (!S.flags.boardStar && a < retireAge(c) && y >= 3 && chance(BOARD_LEAVE * (go ? 0.7 : 1.4) * (a >= 30 ? 1.3 : 1))) { S.flags.lastJob = 'boardpro'; S.flags.exBoard = 1; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -3 }); log(go ? "Chỉ tiền thưởng thi đấu thôi thì cuộc sống chật vật, nên bạn bắt đầu tìm việc khác. Cuối tuần, bạn dạy trẻ em ở một lớp cờ vây." : "Chỉ tiền thưởng thi đấu thôi thì cuộc sống chật vật, nên bạn bắt đầu tìm việc khác. Cuối tuần, bạn dạy trẻ em ở một lớp cờ vua."); }
    else if (chance(0.3)) log(varied('bdp', go ? BOARD_DAYS_GO : offDays(BOARD_DAYS_CH, 1)));
  }
  const G = S.flags.gamer;
  if (G && !G.pro && !G.done && !(S.serveLeft > 0)) {
    G.y++; eff({ hl: -1, sm: -1 });
    if (a >= 17 && chance(ESP_DEBUT[G.y - 1] != null ? ESP_DEBUT[G.y - 1] : 0.15)) gamerDebut();
    else if (a >= 21 || G.y >= 5 || chance(ESP_CUT)) { G.done = 1; S.flags.gameDream = 1; eff({ h: -6 }); log(a >= 21 ? "Đã quá tuổi, bạn kết thúc quãng thời gian ở đội đào tạo trẻ." : "Đội quyết định không gia hạn hợp đồng. Quãng thời gian ở đội đào tạo trẻ của bạn đã kết thúc.", 'bad');
      if (S.edu === 3 && !S.school && a <= 21 && !S.done.college && S.job !== 'prison') queue(Math.min(0.97, S.t + 0.04), 'dec', 'college', {}); }
    else if (chance(0.5)) log(varied('gac', GAME_AC_DAYS));
  }
  if (S.job === 'progamer' && G && !G.end) {
    const y = a - (G.proAt || a);
    if (!G.champ && y >= 1 && chance(0.04)) { G.champ = 1; S.pct = clamp(S.pct + 0.15, 0, payTop()); S.income = incomeAt(c, S.pct); eff({ h: 12 }); S.yearMark = 'star'; log("Bạn vô địch trận chung kết của giải! Khi bạn nâng cúp, tiếng reo hò vang dội.", 'big'); }
    else if (G.champ === 1 && chance(['KOR', 'CHN'].includes(S.cur) ? 0.05 : 0.015)) { G.champ = 2; S.pct = 0.995; S.income = incomeAt(c, S.pct); eff({ h: 15 }); S.yearMark = 'star'; log("Bạn vô địch giải thế giới. Khán giả chật kín nhà thi đấu đồng thanh gọi tên bạn.", 'big'); }
    else if (chance(gamerLeave(a) * (G.champ ? 0.6 : 1))) gamerEnd(a >= 24 ? 'age' : 'cut');
    else if (chance(0.35)) log(varied('gpro', GAME_PRO_DAYS));
  }
  if (S.job === 'progamer' && G && G.end && !G.after && !S.flags.gameEndQ && S.serveLeft === 0) S.flags.gameEndQ = 1;
  if (S.flags.gameDream && !S.flags.gameDreamEnd && a >= 20 && !S.flags.exGamer && !(G && !G.done && !G.end)) {
    S.flags.gameDreamEnd = a; log("Giấc mơ trở thành tuyển thủ thể thao điện tử chuyên nghiệp mãi chỉ là giấc mơ, nhưng trò chơi điện tử đã trở thành thú vui suốt đời bên bạn bè.");
  }
  if (S.job === 'artist' && a < 80) {
    if (!S.flags.artStar && chance(0.003 * (c.ppp > 15000 ? 1.5 : 1))) { S.flags.artStar = 1; S.pct = 0.97; eff({ h: 15 }); S.yearMark = 'star'; log("Một bảo tàng mỹ thuật lớn tổ chức triển lãm tác phẩm của bạn. Người tìm mua tranh của bạn xếp hàng dài.", 'big'); }
    else if (!S.flags.artStar && a < retireAge(c) && S.jobY >= 2 && chance(0.05)) { S.flags.lastJob = 'artist'; S.flags.exArtist = 1; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 }); log("Chỉ vẽ tranh thôi thì cuộc sống chật vật, nên bạn bắt đầu tìm việc khác. Cuối tuần nào bạn cũng vẫn vẽ."); }
    else if (chance(0.3)) log(varied('art', offDays(ART_DAYS, 4)));
  }
  if (S.job === 'creator' && a < 70) {
    if (chance(0.002)) { S.pct = 0.99; setRank('creator', 1); eff({ h: 15 }); S.yearMark = 'star'; log("Tác phẩm của bạn nổi tiếng khắp thế giới. Giờ đây chỉ cần nhắc tên, ai cũng biết bạn là ai.", 'big'); }
    else if (chance(0.015)) { S.pct = clamp(S.pct + 0.15, 0, 0.97); eff({ h: 8 }); log("Một tác phẩm bạn đăng lên gây xôn xao, và tên tuổi bạn được biết đến. Công việc bắt đầu đổ về tới tấp.", 'big'); }
  }
  if (S.cur === 'MMR' && S.rel === 'B' && S.sex === 'M' && a >= 7 && a <= 12 && !S.flags.shinbyu && chance(0.3)) {
    S.flags.shinbyu = 1; eff({ so: 3, sm: 1 });
    log("Bạn trải qua lễ Shinbyu và sống vài tuần ở chùa như một chú tiểu. Cả xóm tụ họp lại để chúc mừng.", 'big', "Theo truyền thống, các bé trai trong những gia đình Phật giáo ở Myanmar trải qua lễ Shinbyu (xuất gia ngắn hạn) khi còn nhỏ");
  }
  const sp = S.hobbies.find(h => (h.id === 'sport' || h.id.startsWith('sp_')) && h.since <= 16 && h.lv >= 5);
  if (sp && a >= 16 && a <= 30 && S.st.hl >= 60 && !S.flags.olympian && S.job !== 'prison' && !c.war && chance(OLY(c) / OLY_YEARS * (S.dis && S.dis.k !== 'hear' ? PARA_K : 1))) olympics(sp, c);
  else if (S.flags.olympian && a === S.flags.olympian + 4 && a <= 34 && sp && chance(0.4)) olympics(sp, c);
  if (S.nomad) {
    if (!isWorking() || !NOMAD_JOBS[S.job]) { S.nomad = null; log("Công việc thay đổi nên bạn khép lại cuộc sống du mục và trở về nhà."); }
    else {
      const N = S.nomad, opts = NOMAD_PLACES.filter(([, iso]) => CBY[iso] && iso !== S.cur), p1 = pick(opts), p2 = pick(opts.filter(x => x !== p1));
      N.y++; N.last = p1[1];
      log(L`올해는 ${p1[0]}(${CBY[p1[1]].ko})${wa(p1[0]).slice(p1[0].length)} ${p2[0]}(${CBY[p2[1]].ko})에서 일하며 지냈습니다.`);
      eff({ h: 4, so: -3 });
      const save = S.income * (c.ppp > 25000 ? 0.06 : -0.03); S.money += save; book(save >= 0 ? "Tiền tiết kiệm nhờ chênh lệch giá cả" : "Chi phí di chuyển", save);
      if (N.y >= N.n) {
        S.nomad = null;
        if (chance(0.12) && CBY[N.last] && N.last !== S.born) { emigrate(N.last, true); log(L`떠돌던 생활을 마치고 ${ro(CBY[N.last].ko)} 아예 터를 잡았습니다.`, 'big'); }
        else log(L`${N.y}년의 디지털 노마드 생활을 마치고 집으로 돌아왔습니다.`, 'big');
      }
    }
  }
  const O = S.office, oJob = O && (O.lvl === 3 ? 'leader' : O.lvl === 2 ? 'mp' : null);
  if (oJob && S.job !== oJob) S.office = null;
  else if (O) {
    const job = oJob;
    if (O.lvl === 2) S.flags.mpYears = (S.flags.mpYears || 0) + 1;
    if (a >= O.until) {
      const again = a < 78 && (O.lvl > 1 || runGate()) && chance(O.lvl === 3 ? 0.45 : 0.6);
      const t = O.lvl === 3 ? S.flags.leaderTitle || leaderTitle(c) : O.lvl === 2 ? "nghị sĩ quốc hội" : "nghị viên hội đồng địa phương";
      if (again) { O.until = a + (O.lvl === 3 ? 5 : 4); eff({ h: 4 }); log(L`${t}에 다시 뽑혔습니다.`, 'big'); }
      else {
        S.office = null; eff({ h: -3 });
        if (O.lvl === 1) log("Nhiệm kỳ đại biểu hội đồng địa phương của bạn đã kết thúc.");
        else { S.flags['ex_' + job] = 1; leaveRareJob(O.lvl === 3 ? L`임기를 마치고 ${t} 자리에서 물러났습니다. 이제 전직 ${ro(t)}${S.age < retireAge(c) ? "đi diễn thuyết và viết sách" : "sống những ngày lặng lẽ"}.` : "Nhiệm kỳ nghị sĩ quốc hội của bạn đã kết thúc.", O.lvl === 3); }
      }
    } else if (chance(0.5)) log(O.lvl === 1 ? varied('local', LOCAL_DAYS()) : O.lvl === 3 ? varied('ldr', LEADER_DAYS) : varied('mp', MP_DAYS));
    if (O.lvl === 3) eff({ hl: -1.5, h: rnd() < 0.5 ? 2 : -2 });
  }
  if (S.astro) {
    const A = S.astro;
    if (S.job !== 'astro') S.astro = null;
    else if (A.train > 0) { A.train--; if (chance(0.6)) log(pick(ASTRO_DAYS)); }
    else if (a >= 55 || A.flights >= 3) { S.astro = null; leaveRareJob("Kết thúc thời gian làm phi hành gia, bạn trở về với công việc nghiên cứu trên mặt đất."); }
    else if (chance(0.45)) {
      A.flights++; S.flags.space = A.flights;
      if (chance(0.002)) { die('inj', "tai nạn trong chuyến bay vũ trụ"); return; }
      const st = c.id === 'CHN' ? "trạm vũ trụ Thiên Cung" : "Trạm Vũ trụ Quốc tế";
      const m = ri(4, 7); eff({ h: 15, hl: -3 }); S.yearMark = 'star';
      log(A.flights === 1 ? L`로켓에 올라 우주로 떠났습니다. ${st}에서 ${m}개월을 지내며 둥근 지구를 내려다보았습니다.` : L`${A.flights}번째로 우주에 다녀왔습니다. ${st}에서 ${m}개월을 지냈습니다.`, 'big', A.flights === 1 ? "Đến nay mới có khoảng 780 người từng bay vào vũ trụ" : null);
    }
  }
}
const PARA_K = 6;
function olympics(sp, c) {
  const first = !S.flags.olympian; S.flags.olympian = S.age;
  if (S.dis && S.dis.k !== 'hear') S.flags.para = 1;
  const n = hobbyName(sp.id), med = chance(c.ppp > 25000 ? 0.12 : 0.05);
  const kind = med ? pick(["vàng", "bạc", "đồng", "đồng"]) : null;
  eff({ h: med ? 15 : 10, so: 4 }); S.yearMark = 'star'; if (med) S.flags.medal = kind;
  if (S.flags.para) { log(L`${first ? '' : "Bốn năm sau, một lần nữa "}패럴림픽 ${n} 종목에 ${c.ko} 국가대표로 출전했습니다.${med ? L` ${kind}메달을 땄습니다!` : " Bạn không giành được huy chương, nhưng đó là những trận đấu cả đời không quên."}`, 'big', first ? "Khoảng 4.400 vận động viên từ hơn 160 đoàn đã tham dự Paralympic Paris 2024 (IPC)" : null); return; }
  log(L`${first ? '' : "Bốn năm sau, một lần nữa "}올림픽 ${n} 종목에 ${c.ko} 국가대표로 출전했습니다.${med ? L` ${kind}메달을 땄습니다!` : " Bạn không giành được huy chương, nhưng đó là những trận đấu cả đời không quên."}`, 'big', first ? "Khoảng 10.500 vận động viên từ 206 đoàn đã tham dự Olympic Paris 2024 (IOC)" : null);
}
const TEACH_FEET = new Set(['football', 'takraw', 'chinlone', 'gaelic', 'aussie']), TEACH_BODY = new Set(['running', 'ski', 'cycling', 'surf', 'wrestling', 'laamb', 'kabaddi', 'muaythai', 'kunkhmer', 'boxing', 'rugby', 'amfootball', 'icehockey', 'hockey', 'waterpolo', 'polo', 'kokboru']);
function teachLook(hid, gk) {
  const sp = hid.startsWith('sp_') ? hid.slice(3) : null;
  if (sp && TEACH_FEET.has(sp)) return gk ? "Những bước chân vụng về ấy giống hệt bạn ngày trước." : "Những bước chân vụng về trông thật đáng yêu.";
  if ((sp && TEACH_BODY.has(sp)) || hid === 'dance' || hid === 'gym' || (hid === 'drama' && noHear())) return gk ? "Những cử động vụng về ấy giống hệt bạn ngày trước." : "Những cử động vụng về trông thật đáng yêu.";
  if ((hid === 'reading' || hid === 'drama') && !noHear()) return gk ? "Giọng đọc ngắc ngứ ấy giống hệt bạn ngày trước." : "Giọng đọc ngắc ngứ nghe thật đáng yêu.";
  if (hid === 'board') return gk ? "Những nước đi ngẫu hứng ấy giống hệt bạn ngày trước." : "Những nước đi ngẫu hứng trông thật đáng yêu.";
  return gk ? "Đôi tay vụng về ấy giống hệt đôi tay bạn ngày trước." : "Đôi tay vụng về trông thật đáng yêu.";
}
const KIDS_CAFE = new Set(['KOR', 'JPN', 'TWN', 'CHN', 'SGP', 'HKG', 'VNM', 'THA', 'MYS']);
const outKid = () => kidAny(S.fam.kids.filter(k => k.alive && !k.away && !k.grown && S.age - k.bornAt >= 3 && S.age - k.bornAt <= 10));
const uniKid = () => S.fam.kids.find(k => k.alive && !nkCut(k) && k.path === 'uni' && !k.job && !k.od && !kidInPr(k) && S.age - k.bornAt >= 19 && S.age - k.bornAt <= 21);
const gkMindKid = () => { const f = S.fam; return f.kids.find(k => k.alive && k.grown && !k.abroad && !k.away && (k.near || k.withMe || k.stay) && !k.gm && (f.grand || []).some(g => !g.gone && g.of === callName(k.name) && S.age - g.bornAt <= 4)); };