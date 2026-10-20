// js/core.js - Nen tang: random, toan hoc, xac suat, moi truong, bang tuoi
const VND = 7000;
let rnd = Math.random;
function setRng(f) { rnd = f; }
function seedRng(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  let a = h >>> 0;
  return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = a => a[Math.floor(rnd() * a.length)];
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const chance = p => rnd() < p;
function wpick(o) {
  let t = 0; for (const k in o) t += Math.max(0, o[k]);
  if (t <= 0) return Object.keys(o)[0];
  let r = rnd() * t;
  for (const k in o) { r -= Math.max(0, o[k]); if (r <= 0) return k; }
  return Object.keys(o)[Object.keys(o).length - 1];
}
function invNorm(p) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  if (p < pl) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - pl) { const q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  const q = p - 0.5, r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
function normCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}
const odds = (p, or) => { p = clamp(p, 1e-4, 1 - 1e-4); return p * or / (1 - p + p * or); };
const pctStr = (x, d = 0) => { let s = (x * 100).toFixed(d); while (d < 3 && ((x < 1 && +s >= 100) || (x > 0 && +s <= 0))) s = (x * 100).toFixed(++d); return s + '%'; };
const u5Pct = () => { const p = eraBirthC().u5 / 10; return p < 1 ? p.toFixed(1) + '%' : Math.round(p) + '%'; };
const savedAmt = () => S.money >= 0 ? wonStr(S.money) : L`0원 (빚 ${wonStr(-S.money)})`;
const LOST = new Set(['road', 'war', 'drown', 'fall', 'fire', 'inj', 'geno', 'disa', 'od', 'pol']);
const J = (w, withBatchim, without) => { const ch = w.charCodeAt(w.length - 1); if (ch >= 0xAC00 && ch <= 0xD7A3) return w + (((ch - 0xAC00) % 28) ? withBatchim : without); return w + withBatchim + '(' + without + ')'; };
const eul = w => w;
const iga = w => w;
const ro = w => w;
const eun = w => w;
const ira = w => w;
const parW = () => { if (raisedHere()) { const r = S.flags.raised; return r.k === 'foster' ? "bố mẹ nuôi tạm thời" : r.k === 'home' ? "các cô chú ở mái ấm" : raisedWord(r); }
  if (S.age < 18 && fcKept()) return "gia đình";
  const m = S.fam.mom.alive && !parInPr('mom'), d = S.fam.dad.alive && !S.fam.dad.absent && !parInPr('dad'); return m && d ? "bố mẹ" : m ? "mẹ" : d ? "bố" : "gia đình"; };
const sibN = () => sibAliveN();
const famCame = () => !!S.mig && (S.flags.famCame != null ? !!S.flags.famCame : S.migY < 18 || S.refugeeUntil != null);
const pFight = () => { if (S.flags.pfight == null) S.flags.pfight = chance(S.q <= 2 ? 0.15 : 0.09) ? 1 : 0; return !!S.flags.pfight; };
const HIT_R = { ssa: 0.55, sa: 0.45, mena: 0.5, eap: 0.35, lac: 0.4, eca: 0.25, hi: 0.15 };
const HIT_C = { KOR: 0.25, JPN: 0.2, USA: 0.3, SWE: 0.04, NOR: 0.05, FIN: 0.06, DNK: 0.06, DEU: 0.1, NLD: 0.1 };
const CP_BAN = { SWE: 1979, FIN: 1983, NOR: 1987, AUT: 1989, DNK: 1997, DEU: 2000, ISR: 2000, ROU: 2004, UKR: 2004, HUN: 2005, GRC: 2006,
  NLD: 2007, NZL: 2007, PRT: 2007, ESP: 2007, URY: 2007, VEN: 2007, POL: 2010, KEN: 2010, TUN: 2010, BRA: 2014, ARG: 2014, BOL: 2014,
  IRL: 2015, PER: 2015, NPL: 2018, FRA: 2019, ZAF: 2019, JPN: 2020, COL: 2021, KOR: 2021, ZMB: 2022, THA: 2025, CYP: 1994, LVA: 1998, HRV: 1999, LUX: 2008, MDA: 2008, ALB: 2010, CPV: 2013, MKD: 2013, MLT: 2014, EST: 2014, SVN: 2016, MNE: 2016, LTU: 2017, XKX: 2019 };
const cpBan = (c, yr) => !!(CP_BAN[c.id] && (yr == null ? calYr() : yr) >= CP_BAN[c.id]);
const pHit = () => {
  if (S.flags.phit == null) { const c = B(), by = calYr() - S.age;
    let p = (HIT_C[c.id] ?? HIT_R[c.p] ?? 0.3) * (S.q <= 2 ? 1.2 : S.q >= 5 ? 0.8 : 1) * (by < 1990 ? 1.3 : 1) * (cpBan(c, by + 6) ? 0.5 : 1);
    S.flags.phit = chance(Math.min(0.85, p)) ? 1 : 0; }
  return !!S.flags.phit; };
const KID_HELP = () => B().id === 'KOR' || S.cur === 'KOR' ? L`집에서 맞거나 다치는 일이 이어진다면 혼자 견디지 않아도 돼요. 112, 청소년상담 1388 (휴대전화는 문자 #1388)` : L`집에서 맞거나 다치는 일이 이어진다면 혼자 견디지 않아도 돼요. 한국 112·청소년상담 1388 (문자 #1388) · 다른 나라는 findahelpline.com`;
const HIT_FACT = () => cpBan(C()) ? L`${eun(C().ko)} ${CP_BAN[C().id]}년부터 부모의 체벌도 법으로 금지합니다. 집에서까지 체벌을 모두 금지한 나라는 68곳입니다 (Save the Children 2025)` : "Cứ mười trẻ dưới năm tuổi thì có sáu em phải chịu cách dạy dỗ bằng bạo lực ở nhà. Trừng phạt thân thể không giúp trẻ ngoan hơn mà chỉ làm tăng tính hung hăng và khoảng cách giữa trẻ với bố mẹ (UNICEF 2024, Gershoff & Grogan-Kaylor 2016)";
const SCH_HIT_R = { sa: 0.8, ssa: 0.6, lac: 0.4, eap: 0.4, mena: 0.45, eca: 0.15, hi: 0.06 };
const SCH_HIT_C = { IND: 0.85, ETH: 0.65, PER: 0.5, VNM: 0.45, USA: 0.02 };
const pSchHit = () => {
  if (S.flags.shit == null) { const c = C(), by = calYr() - S.age;
    let p = c.id === 'KOR' ? (by + 8 < 2011 ? 0.9 : 0.25) : (SCH_HIT_C[c.id] ?? SCH_HIT_R[c.p] ?? 0.3) * (by < 1990 ? 1.2 : 1) * (cpBan(c, by + 6) ? 0.5 : 1);
    S.flags.shit = chance(Math.min(0.92, p * (meSex() === 'M' ? 1.3 : 0.7))) ? 1 : 0; }
  return !!S.flags.shit; };
const SCH_HELP = () => B().id === 'KOR' || S.cur === 'KOR' ? L`학교에서 맞거나 다치는 일이 있다면 혼자 견디지 않아도 돼요. 112, 청소년상담 1388 (휴대전화는 문자 #1388)` : L`학교에서 맞거나 다치는 일이 있다면 혼자 견디지 않아도 돼요. 한국 112·청소년상담 1388 (문자 #1388) · 다른 나라는 findahelpline.com`;
const SCH_HIT_FACT = () => { const id = C().id, by = calYr() - S.age;
  return id === 'KOR' ? (by + 8 < 2011 ? "Năm 2004, cứ mười học sinh Hàn Quốc thì có tám em cho biết đã bị thầy cô phạt đánh trong năm đó. Mãi đến năm 2011, trừng phạt thân thể trong trường học mới bị cấm (Viện Nghiên cứu Xã hội Hàn Quốc, Nghị định thi hành Luật Giáo dục Tiểu học và Trung học)" : "Trừng phạt thân thể trong trường học bị cấm từ năm 2011, nhưng năm 2015 cứ mười học sinh THCS ở Seoul vẫn có ba em cho biết từng bị phạt đánh (Sở Giáo dục Seoul, khảo sát về quyền học sinh)")
    : id === 'VNM' ? "Luật Giáo dục 2005 của Việt Nam đã cấm trừng phạt thân thể trong trường học, nhưng cứ năm trẻ 8 tuổi thì có một em cho biết đã bị thầy cô đánh trong tuần trước đó (Young Lives 2009)"
    : id === 'IND' ? "Ở bang Andhra Pradesh và Telangana của Ấn Độ, cứ mười trẻ 8 tuổi thì có tám em cho biết đã bị thầy cô đánh trong tuần trước đó (Young Lives 2009)"
    : "62 quốc gia vẫn chưa cấm hoàn toàn trừng phạt thân thể trong trường học. Những trẻ từng bị thầy cô đánh có điểm toán thấp hơn vài năm sau đó (End Corporal Punishment 2025, Young Lives)"; };
const ENV_C = { BGD: 6, KHM: 18, CHN: 27, IND: 22, IDN: 22, JPN: 2, MYS: 8, MDV: 1, MNG: 27, MMR: 12, NPL: 7, PHL: 18, KOR: 11, LKA: 13,
  TWN: 5, THA: 21, VNM: 11, BEN: 10, BWA: 2, BFA: 9, CPV: 7, CMR: 27, CIV: 18, COD: 59, SWZ: 12, GAB: 23, GMB: 9, GHA: 15, GIN: 23,
  KEN: 14, LSO: 4, LBR: 40, MDG: 12, MWI: 57, MLI: 6, MUS: 1, MAR: 6, MOZ: 22, NAM: 7, NER: 7, NGA: 32, SEN: 6, SLE: 33, ZAF: 14,
  SDN: 8, TZA: 4, TGO: 14, TUN: 8, UGA: 21, ZMB: 10, ZWE: 12, JOR: 4, LBN: 26, PSE: 11 };
const ENV_ASIA = new Set(['BGD', 'KHM', 'CHN', 'IND', 'IDN', 'JPN', 'MYS', 'MDV', 'MNG', 'MMR', 'NPL', 'PHL', 'KOR', 'LKA', 'TWN', 'THA', 'VNM']);
const ENV_R = { ssa: 16, mena: 10, sa: 10, eap: 18, lac: 5, eca: 5, hi: 0.5 };
const envRate = c => (ENV_C[c.id] ?? ENV_R[c.p] ?? 5) / 100;
const envLife = () => { if (S.flags.envL == null) S.flags.envL = chance(Math.min(0.7, envRate(C()) * 4)) ? 1 : 0; return !!S.flags.envL; };
const HOT_CLASS = new Set(['VNM', 'THA', 'PHL', 'IDN', 'MYS', 'KHM', 'LAO', 'MMR', 'SGP', 'TLS', 'BRN']);
const hotClass = c => c.haz.includes('H') || HOT_CLASS.has(c.id) || c.p === 'sa' || c.p === 'ssa';
const ENV_FACT = () => { const c = C(); return ENV_C[c.id] != null ? L`${c.ko}에서 공립학교를 이용한 사람 중 ${ENV_C[c.id]}%가 지난 1년 사이 뇌물을 건넸다고 답했습니다 (국제투명성기구 세계부패바로미터 ${ENV_ASIA.has(c.id) ? 2020 : 2019})` : null; };
const kidHereNow = k => k.alive && !k.lb && !(k.abroad && k.abroad !== S.cur) && !(k.away && k.awayIn && k.awayIn !== S.cur);
const famNear = () => { const f = S.fam; if (f.married && f.partner && f.partner.alive && !f.partner.lb) return true; if (f.kids.some(kidHereNow)) return true; if ((S.mig && S.migY >= 18 && !famCame() && S.flags.parCame == null) || (S.flags.studyAbroad && S.school) || traineeAway() || (S.mig && S.flags.idolAb && !famCame())) return false; return f.mom.alive || (f.dad.alive && !f.dad.absent) || sibN() > 0; };
const traineeAway = () => { const T = S && S.flags && S.flags.trainee; return T && !T.done && T.ab && S.cur === T.ab && !(S.serveLeft > 0) ? 'KOR' : null; };
const studyAway = () => (S.flags.studyAbroad && S.school && !S.mig ? S.flags.studyAbroad : null) || traineeAway();
const studyWhere = () => (S.flags.studyAbroad && !S.mig ? S.flags.studyAbroad : null) || traineeAway();
const awayTrainee = () => !!traineeAway() && !(S.flags.studyAbroad && !S.mig);
const studyCity = () => awayTrainee() ? CITIES.KOR.split(',')[0] : S.flags.saCity || (S.flags.saCity = cityOf(CBY[S.flags.studyAbroad]));
const famAnywhere = () => famNear() || (S.fam.married && S.fam.partner && S.fam.partner.alive) || S.fam.kids.some(k => k.alive) || S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent) || sibN() > 0;
const wa = w => w;
const listAnd = ws => ws.length < 2 ? ws.join('') : ws.slice(0, -1).join(', ') + ' và ' + ws[ws.length - 1];
const CBY = {};
COUNTRIES.forEach(c => { CBY[c.id] = c; });
const WORLD_C = { id: 'WLD', ko: "Trung bình thế giới", le: 73.2, gap: 5.4, u5: 37, im: 28 };
const LT_CACHE = {};
const OLDEST = (x, sex) => Math.min(0.7, (sex === 'F' ? 0.39 : 0.5) * Math.exp(0.15 * (x - 100)));
const R514 = { AFG:.12, DZA:.14, AGO:.23, ARG:.18, AUS:.24, AUT:.21, AZE:.13, BGD:.15, BLR:.39, BEL:.19, BEN:.23, BOL:.2, BWA:.17, BRA:.18, BGR:.25, BFA:.1, BDI:.35, KHM:.2, CMR:.28, CAN:.18, CAF:.24, TCD:.2, CHL:.2, CHN:.25, COL:.19, COG:.15, CRI:.19, CIV:.23, CUB:.28, CZE:.3, COD:.2, DNK:.15, DOM:.1, ECU:.23, EGY:.15, SLV:.35, GNQ:.2, ERI:.17, ETH:.16, FIN:.33, FRA:.19, GAB:.25, GMB:.2, GEO:.19, DEU:.22, GHA:.25, GRC:.18, GTM:.16, GIN:.18, GNB:.17, HTI:.17, HND:.29, HUN:.24, IND:.15, IDN:.23, IRN:.28, IRQ:.21, IRL:.16, ISR:.23, ITA:.23, JAM:.18, JPN:.32, JOR:.09, KAZ:.27, KEN:.12, KWT:.2, KGZ:.16, LAO:.17, LBN:.22, LSO:.14, LBR:.18, LBY:.28, MDG:.28, MWI:.23, MYS:.24, MLI:.23, MRT:.18, MEX:.19, MNG:.24, MAR:.13, MOZ:.14, MMR:.11, NAM:.17, NPL:.16, NLD:.17, NZL:.19, NIC:.23, NER:.27, NGA:.19, PRK:.22, NOR:.29, OMN:.22, PAK:.1, PSE:.23, PAN:.21, PNG:.19, PRY:.12, PER:.2, PHL:.16, POL:.22, PRT:.26, QAT:.23, ROU:.2, RUS:.35, RWA:.12, SAU:.24, SEN:.22, SRB:.21, SLE:.23, SGP:.31, SVK:.18, SOM:.22, ZAF:.16, KOR:.26, SSD:.22, ESP:.25, LKA:.28, SDN:.14, SWE:.27, CHE:.15, SYR:.25, TJK:.07, TZA:.29, THA:.39, TGO:.18, TUN:.19, TUR:.18, TKM:.1, UGA:.23, UKR:.21, ARE:.24, GBR:.15, USA:.21, URY:.21, UZB:.22, VEN:.13, VNM:.15, YEM:.22, ZMB:.19, ZWE:.15 };
function lifeTable(c, sex) {
  const key = c.id + sex + (c.yr || ''); if (LT_CACHE[key]) return LT_CACHE[key];
  const e0 = sex === 'F' ? c.le + c.gap * 0.49 : c.le - c.gap * 0.51;
  const k = sex === 'F' ? 0.92 : 1.08;
  const q0 = Math.min(0.25, c.im / 1000 * k);
  const u5 = Math.min(0.35, Math.max(q0 + 0.0005, c.u5 / 1000 * k));
  const H = -Math.log((1 - u5) / (1 - q0));
  const qc = [0.4, 0.27, 0.19, 0.14].map(w => 1 - Math.exp(-H * w));
  const A = 0.00025 + 0.000028 * c.u5;
  const g = clamp(0.112 - 0.00016 * c.u5, 0.085, 0.112);
  const q514 = 1 - Math.pow(1 - Math.min(0.2, (R514[c.id] || 0.2) * c.u5 / 1000 * k), 0.1);
  const build = B => {
    const q = new Float64Array(111); q[0] = q0; for (let i = 1; i <= 4; i++) q[i] = qc[i - 1];
    for (let x = 5; x <= 110; x++) q[x] = x === 110 ? 1 : x < 15 ? q514 : Math.min(1, 1 - Math.exp(-Math.max(A + B * Math.exp(g * (x + 0.5)), OLDEST(x, sex))));
    let l = 1, e = 0;
    for (let x = 0; x <= 110; x++) { const d = l * q[x]; e += x === 0 ? l - 0.85 * d : l - 0.5 * d; l -= d; }
    return { q, e };
  };
  let lo = Math.log(1e-8), hi = Math.log(5e-2), r;
  for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; r = build(Math.exp(m)); if (r.e > e0) lo = m; else hi = m; }
  const l = new Float64Array(112); l[0] = 1;
  for (let x = 0; x <= 110; x++) l[x + 1] = l[x] * (1 - r.q[x]);
  return (LT_CACHE[key] = { q: r.q, l, e0 });
}
function sigmaOf(c) {
  let g = c.gi;
  if (['ssa', 'sa', 'mena'].includes(c.p) || (c.p === 'eap' && c.id !== 'CHN')) g += 0.07;
  g = clamp(g, 0.22, 0.68);
  return Math.SQRT2 * invNorm((g + 1) / 2);
}
function incomeAt(c, pct) { const s = sigmaOf(c); return c.ppp * 0.9 * Math.exp(s * invNorm(clamp(pct, 0.003, 0.997)) - s * s / 2); }
function pctOfIncome(c, inc) { const s = sigmaOf(c); const mu = Math.log(c.ppp * 0.9) - s * s / 2; return normCdf((Math.log(Math.max(1, inc)) - mu) / s); }
function worldPct(inc) { const y = typeof eraYr === 'function' ? eraYr() : null; let t = 0, b = 0; for (const c0 of COUNTRIES) { const c = y ? eraAt(c0, y) : c0; b += c.pop * pctOfIncome(c, inc); t += c.pop; } return b / t; }
const plr = c => clamp(0.11 * Math.sqrt(c.ppp / 1000), 0.22, 1.25);
const usd2ppp = (c, usd) => usd / plr(c);
const informal = c => clamp(0.15 + 0.75 * c.agr / 100 + 0.45 * (1 - Math.min(1, c.ppp / 40000)), 0.08, 0.95);
const engel = inc => clamp(0.62 - 0.12 * Math.log(Math.max(300, inc) / 1000), 0.08, 0.66);
const SAVE_MAX = 0.5;
const saveTop = x => 0.2 * clamp(Math.log(Math.max(x, 1e-6) / 1.6) / Math.log(8), 0, 1);
const TAX_C = { CHE: 18.6, LUX: 33.2, NOR: 28.1, DNK: 36.0, BEL: 39.9, DEU: 37.4, NLD: 27.3, IRL: 28.0, ISL: 27.4, AUT: 32.9, CAN: 25.6, AUS: 24.9,
  GBR: 23.7, USA: 24.2, KOR: 16.2, FIN: 31.6, FRA: 27.5, SWE: 23.9, JPN: 22.6, ITA: 27.7, NZL: 21.1, ISR: 18.8, ESP: 22.1, LTU: 37.8, TUR: 27.6,
  SVN: 34.2, GRC: 24.8, POL: 23.6, PRT: 28.6, HUN: 33.5, CZE: 20.0, EST: 18.9, LVA: 27.1, SVK: 24.3, CHL: 17, CRI: 10.7, MEX: 11.0, COL: 8,
  CHN: 12, TWN: 9, SGP: 21, HKG: 7, BRA: 14, ARG: 17, ZAF: 14, RUS: 13, UKR: 19.5, ROU: 41.5, BGR: 22.8, HRV: 30, SRB: 30, BLR: 14, KAZ: 20,
  VNM: 10.5, MYS: 13, EGY: 14, SAU: 10, ARE: 0, QAT: 0, KWT: 0, IND: 4, IDN: 5, THA: 5, PHL: 7, UZB: 12, TJK: 14, GEO: 22, ARM: 25 };
const TAX_R = { hi: 15, eca: 18, eap: 6, lac: 10, mena: 8, sa: 3, ssa: 5 };
function taxRate(c, inc, formal) {
  const T = (TAX_C[c.id] != null ? TAX_C[c.id] : TAX_R[c.p] || 5) / 100, x = Math.max(0.05, inc / incomeAt(c, 0.5));
  const t = clamp(T + 0.06 * Math.log(x), 0.4 * T, Math.min(T + 0.15, 0.46));
  return formal === false ? t * 0.2 : t;
}
const taxKeep = (c, inc) => clamp((1 - taxRate(c, inc)) / 0.8, 0.7, 1);
const saveLow = x => clamp((x - 0.3) / 0.6, 0, 1);
function saveRate(c, inc, med, pt) {
  const x = inc / med, b0 = clamp(0.05 + 0.05 * Math.log(Math.max(500, inc) / 4000), -0.05, 0.28), base = b0 > 0 ? b0 * saveLow(x) : b0;
  return SAVE_K * Math.min(SAVE_MAX, (Math.max(base, pt ? -1 : 0.12 * clamp((x - 1.2) / 2, 0, 1)) + saveTop(x)) * (base > 0 ? taxKeep(c, inc) : 1));
}
const SAVE_K = 0.8, PT_KEEP = 0.85;
const lowInc = c => c.ppp < 15000;
const afmF = c => c.yr ? eraAfm(c, afmF0(c)) : afmF0(c);
function afmF0(c) { if (c.p === 'hi') return c.id === 'KOR' ? 31.5 : c.id === 'JPN' ? 29.7 : 30.5; if (c.id === 'CHN') return 28; if (c.id === 'PHL') return 24.75; if (c.p === 'eca') return 25.5; return clamp(27 - c.cm * 0.15 - Math.max(0, c.tfr - 2) * 0.8, 16.5, 29.5); }
const AFM_M = { NGA: 27.7, IND: 24.9, BGD: 24, KOR: 33, JPN: 30.5, USA: 30.2, SEN: 30, GMB: 29, GIN: 26.5, MLI: 24.5, BFA: 25, MRT: 25.5, CIV: 25, CMR: 24.5, TCD: 24 };
const AFM_D = 1.2;
const afmM = c => AFM_M[c.id] != null ? AFM_M[c.id] + (c.yr ? afmF(c) - afmF0(c) : 0) : afmF(c) + clamp(2 + (c.tfr - 1.5) * 1.2, 2, 8) - AFM_D;
const GAP_C = { NGA: 8.5, BGD: 7.5, IND: 5.7, KOR: 2.3, JPN: 1.5, USA: 1.8, SEN: 9, GMB: 9, GIN: 9, GNB: 8, MLI: 8, BFA: 8, NER: 8, TCD: 7, MRT: 9, CIV: 8, CMR: 7, SLE: 8 };
const coupleGap = c => GAP_C[c.id] != null ? GAP_C[c.id] : { ssa: 5.5, sa: 5.5, mena: 5.5, lac: 3, eap: 3, eca: 2.5, hi: 2 }[c.p] || 3;
const gapDraw = c => { const m = coupleGap(c), z = (rnd() + rnd() + rnd() + rnd() - 2) * 1.732; return clamp(Math.round(m + z * 3.4), -8, Math.round(m + 12)); };
const MATCH_CO = new Set(['KOR', 'JPN', 'CHN', 'TWN']);
const gapDrawRe = c => { const m = coupleGap(c), z = (rnd() + rnd() + rnd() + rnd() - 2) * 1.732;
  return S.sex === 'M' ? clamp(Math.round(m + 2 + z * 6), -12, Math.round(m + 22)) : clamp(Math.round(m + 0.5 + z * 6.5), -14, Math.round(m + 22)); };
const POLY = { BFA: 42, GIN: 42, GNQ: 48, GMB: 39, TCD: 38, MLI: 37, NER: 36, SLE: 35, GNB: 38, SSD: 41, SEN: 32, NGA: 30, BEN: 30, TGO: 30, CAF: 27, UGA: 25,
  CIV: 24, CMR: 24, COD: 20, AGO: 20, SOM: 20, MOZ: 19, TZA: 18, SDN: 18, GHA: 15, LBR: 14, MWI: 13, GAB: 13, COG: 12, ZMB: 12, KEN: 11, ETH: 11, MRT: 10,
  ZWE: 9, BDI: 7, ERI: 6, RWA: 5, NAM: 4, ZAF: 3, MDG: 3, LSO: 2, BWA: 2,
  YEM: 7, SAU: 6, KWT: 6, IRQ: 6, QAT: 5, ARE: 5, OMN: 5, JOR: 4, PSE: 4, SYR: 3, LBY: 3, EGY: 2, LBN: 2, DZA: 1, MAR: 1, IRN: 1, AFG: 5, PAK: 3, BGD: 1, IND: 0.4, IDN: 1, MYS: 1 };
function polyRate(c, rel) {
  const P = (POLY[c.id] || 0) / 100; if (!P) return 0;
  if (c.p !== 'ssa') { const m = relShare(c, 'M'); return rel === 'M' && m > 0 ? Math.min(0.5, P / m) * 0.6 : 0; }
  const f = { M: 1.25, F: 1.3, C: 0.6 }, M = relShare(c, 'M'), F = relShare(c, 'F'), Ch = relShare(c, 'C');
  return P * (c.id === 'TCD' ? 1 : f[rel] || 1) / (c.id === 'TCD' ? 1 : Math.max(0.3, M * 1.25 + F * 1.3 + Ch * 0.6 + Math.max(0, 1 - M - F - Ch)));
}
const POLY_N = {};
function polyNorm(c) {
  const k = c.id + (c.yr ? Math.round(c.yr / 10) : '');
  if (POLY_N[k]) return POLY_N[k];
  const e = eduProbs(c, 'F', 3, false), u = (c.urb || 50) / 100;
  return POLY_N[k] = (e.p4 * 0.35 + Math.max(0, e.p3 - e.p4) * 0.65 + (1 - e.p3) * 1.15) * (u * 0.75 + (1 - u) * 1.15) * 0.98;
}
const polyMe = () => (S.edu >= 4 ? 0.35 : S.edu === 3 ? 0.65 : 1.15) * (S.urban ? 0.75 : 1.15) * (S.q >= 5 ? 0.6 : S.q <= 2 ? 1.1 : 1) / polyNorm(C());
function retireAge(c) { return { hi: 65, eca: 62, lac: 62, mena: 60, eap: 60, sa: 60, ssa: 60 }[c.p] + (c.yr ? eraRetireAdd(c) : 0); }
function wonStr(ppp) {
  
    const w = ppp * VND, a = Math.abs(w), sign = w < 0 ? '-' : '';
    if (a >= 1e9) return sign + viDec(a / 1e9, a >= 1e11 ? 0 : 1) + ' tỷ đồng';
    if (a >= 1e6) return sign + viDec(a / 1e6, a >= 1e8 ? 0 : 1) + ' triệu đồng';
    return sign + (a >= 1e4 ? Math.round(a / 1e3) * 1e3 : Math.round(a)).toLocaleString('vi-VN') + ' đồng';
}
const CUR_K = VND;
const usdStr = x => 'US$' + Math.round(x).toLocaleString('vi-VN');
let S = null;
const HOOK = { log() { }, change() { }, decision() { }, death() { }, year() { }, err(e) { throw e; }, noPause() { return false; }, humRecent() { return []; }, calm() { return false; } };
const C = () => S.era && S.era !== 'now' && eraLoaded() ? eraC(S.cur) : CBY[S.cur];
const B = () => S.era && S.era !== 'now' && eraLoaded() ? eraC(S.born) : CBY[S.born];
const LT = () => lifeTable(C(), S.sex);
const calOf = id => (typeof CAL !== 'undefined' && CAL[id]) || 1;
function chooseCountry(mode, yr) { const w = {}; for (const c0 of COUNTRIES) { const c = yr ? eraAt(c0, yr) : c0; w[c.id] = mode === 'pop' ? c.pop : c.b; } return CBY[wpick(w)]; }
const AGE12_SITE = false;
let AGE12 = AGE12_SITE;
let EDU_ON = false;
function ageSync() { AGE12 = AGE12_SITE || EDU_ON || !!(S && S.eduOn); }
const relShare = (c, r) => { const p = c.rel.split(',').find(x => x[0] === r); return p ? +p.slice(1) / 100 : 0; };
const AUD_REG = { eca: 0.085, hi: 0.055, lac: 0.06, eap: 0.035, sa: 0.03, ssa: 0.028, mena: 0.006 };
const audBase = c => AUD_REG[c.p] * (1 - 0.9 * relShare(c, 'M'));
const audMe = c => S.rel === 'M' ? AUD_REG[c.p] * 0.1 : audBase(c);
const PRISON_RATE = { USA: 540, BRA: 390, THA: 400, TUR: 380, RUS: 300, ZAF: 250, IRN: 230, MEX: 170, CHN: 120, KOR: 105, JPN: 35, IND: 40, NGA: 37, PAK: 40, BGD: 45 };
const prisonK = c => Math.sqrt((PRISON_RATE[c.id] || 140) / 140);
const CRIME_Q = [1, 1.6, 1.25, 1, 0.75, 0.55];
const crimeBg = () => CRIME_Q[S.q || 3] * (S.edu <= 1 ? 1.5 : S.edu === 2 ? 1.25 : S.edu >= 4 ? 0.6 : 1) * (S.flags.street != null && S.flags.streetOut == null ? 1.4 : 1);
const shameNow = () => { const f = S.flags; if (f.shame == null || f.atoned != null) return 0; const y = S.age - f.shame;
  return (y <= 6 ? 1 : Math.pow(0.5, (y - 6) / (f.shameQuiet ? 3 : 6))) * (f.shameK || 1); };
const farKin = () => S.mig && S.migY >= 18 && !famCame();
const parFar = () => farKin() && S.flags.parCame == null;
const aloneAbroad = () => !!(typeof studyAway === 'function' && studyAway()) || (farKin() && S.age - (S.migY != null ? S.migY : S.age) < 10);
function courtLine() {
  const f = S.fam, mom = f.mom.alive, dad = f.dad.alive && !f.dad.absent, P = f.married && f.partner && f.partner.alive && !f.partner.divorced, kids = f.kids.some(k => k.alive && S.age - k.bornAt < 18), far = parFar();
  const t = [];
  if (mom) t.push(far ? "Nghe tin, mẹ gọi điện từ quê nhà, nhưng suốt một hồi lâu chỉ biết khóc." : "Ngồi ở hàng ghế cuối phòng xử án, mẹ đến cuối cùng vẫn không ngẩng đầu lên được.");
  else if (dad) t.push(far ? "Nghe nói bố ở quê nhà biết tin rồi mấy ngày liền không ra khỏi nhà." : "Suốt lúc tuyên án, bố không nhìn bạn lấy một lần.");
  if (P) t.push(kids ? "Bạn đời dắt tay các con, lặng lẽ rời khỏi phòng xử án." : "Mặt bạn đời tái nhợt đi.");
  if (!t.length) t.push("Không có ai đến phòng xử án vì bạn.");
  return ' ' + t.join(' ');
}
const atoneWho = () => { const f = S.fam; if (f.mom.alive) return 'mom'; if (f.dad.alive && !f.dad.absent) return 'dad'; if (f.married && f.partner && f.partner.alive && !f.partner.divorced) return 'pt';
  if (f.kids.some(k => k.alive && S.age - k.bornAt >= 6)) return 'kids'; return sibN() > 0 ? 'sib' : null; };
const atoneCost = () => incomeAt(C(), 0.5) * 0.15;
const stressed =() => S.st.h < 40 || S.job === 'seeking' || S.money < -incomeAt(C(), 0.5) * 0.5 || (S.flags.lossY != null && S.age - S.flags.lossY <= 2);
let NF_ON = false;
const NF_IDS = new Set(['duikey', 'kinback', 'fight', 'teenbad', 'kidbad', 'needtheft', 'sibpr_v', 'kidpr_v', 'pp_v', 'pp_ask', 'hithome', 'hitschool']);
function logN(text, kind, fact) { const o = NF_ON; NF_ON = true; try { log(text, kind, fact); } finally { NF_ON = o; } }
const REC_W = { fine: 0.35, susp: 0.65, prison: 1 };
const REC_FADE = { fine: [2, 2], susp: [4, 3], prison: [6, 5] };
function recList() {
  const r = (S.rec || []).slice();
  if (S.flags.record && !r.some(x => x.s === 'prison')) r.push({ k: 'crime', a: S.flags.shame != null ? S.flags.shame : S.age, s: 'prison', y: S.flags.prisonLen || 2 });
  return r;
}
const recT = r => S.age - r.a - (r.y || 0) - (r.p || 0);
function recW() {
  let w = S.job === 'prison' ? 1 : 0;
  for (const r of recList()) { const b = REC_W[r.s]; if (!b) continue; const t = recT(r), [full, half] = REC_FADE[r.s]; w = Math.max(w, b * (t <= full ? 1 : Math.pow(0.5, (t - full) / half))); }
  return w;
}
function recLic() {
  let w = S.job === 'prison' ? 1 : 0;
  for (const r of recList()) { const t = recT(r); w = Math.max(w, r.s === 'prison' ? (t <= 5 ? 1 : Math.pow(0.5, (t - 5) / 5)) : r.s === 'susp' ? (t <= 2 ? 0.8 : 0.8 * Math.pow(0.5, (t - 2) / 2)) : r.s === 'fine' && t <= 2 ? 0.15 : 0); }
  return w;
}
const recEver = () => recList().some(r => REC_W[r.s]);
const recN = k => (S.rec || []).filter(r => r.k === k && REC_W[r.s]).length;
const recAdd = o => { (S.rec = S.rec || []).push(Object.assign({ a: S.age }, o)); };
function goPrison(yrs, k) {
  const bt = S.job === 'owner' ? ' ' + "Ở trong tù thì không thể tiếp tục việc kinh doanh." + ' ' + bizExit() : '';
  S.flags.lastJob = isWorking() ? S.job : S.flags.lastJob; S.job = 'prison'; S.flags.prisonUntil = S.age + yrs; S.flags.prisonEver = 1;
  S.flags.prisonY0 = S.stats.prisonY || 0; S.flags.prisonLen = yrs; S.flags.paroleAsked = k === 'wrong' ? 1 : 0; S.flags.prK = k;
  if (k !== 'wrong') { S.flags.shame = S.age; S.flags.atoned = null; S.flags.atoneTry = null; S.flags.shameQuiet = null; S.flags.shameK = null; }
  eff({ h: -15, so: -10 }); S.yearMark = 'loss';
  return bt;
}
const SENT = {
  dui: [[0.93, 0.06, 0.01], [0.55, 0.35, 0.1]],
  duih: [[0.45, 0.47, 0.08], [0.15, 0.5, 0.35]],
  duik: [[0, 0.3, 0.7], [0, 0.15, 0.85]],
  fight: [[0.86, 0.12, 0.02], [0.5, 0.38, 0.12]],
  theft: [[0.8, 0.18, 0.02], [0.45, 0.4, 0.15]],
  embez: [[0.12, 0.55, 0.33], [0.05, 0.4, 0.55]],
};
const FINE_K = { dui: [0.12, 0.4], duih: [0.25, 0.6], duik: [0.3, 0.6], fight: [0.04, 0.15], theft: [0.02, 0.06], embez: [0.1, 0.3] };
const PRISON_Y = { dui: [1, 1], duih: [1, 2], duik: [2, 5], fight: [1, 2], theft: [1, 1], embez: [1, 4] };
function sentence(k) {
  const c = C(), again = (S.rec || []).some(r => REC_W[r.s] && S.age - r.a <= 10) || (S.flags.record && S.flags.shame != null && S.age - S.flags.shame <= 10);
  const w = SENT[k][again ? 1 : 0], s = chance(clamp(w[2] * prisonK(c), 0, 0.95)) ? 'prison' : chance(w[1] / Math.max(0.01, w[0] + w[1])) ? 'susp' : 'fine';
  if (s === 'prison') { const [y0, y1] = PRISON_Y[k], yrs = ri(y0, y1); recAdd({ k, s, y: yrs }); const bt = goPrison(yrs, k); return L`징역 ${yrs}년을 선고받았습니다.` + courtLine() + bt; }
  if (s === 'susp') { recAdd({ k, s, p: 2 }); eff({ h: -4, so: -3 }); return "Bạn bị tuyên án tù nhưng cho hưởng án treo. Nếu phạm lỗi lần nữa trong thời gian thử thách, bạn sẽ phải vào tù."; }
  const [f0, f1] = FINE_K[k], fine = incomeAt(c, 0.5) * (f0 + rnd() * (f1 - f0)); S.money -= fine; recAdd({ k, s }); eff({ h: -2 });
  return L`벌금 ${wonStr(fine)}을 냈습니다.`;
}
const EMB_J = ['clerk', 'finance', 'civil', 'salesagent', 'callc'];
const lawOK = () => !AGE12 && S.job !== 'prison' && !(S.serveLeft > 0) && !studyAway() && !S.flags.hideCN;
const ALC_12M = { AFG: [1.0, 0.3], PAK: [1.8, 0.6], YEM: [1.1, 0.3], LBY: [0.2, 0.1], KWT: [0.8, 0.2], SAU: [7.3, 3.5], IRN: [6.0, 1.1] };
const drinkP = c => { const w = ALC_12M[c.id]; return w ? w[S.sex === 'M' ? 0 : 1] / 100 : clamp(audMe(c) / 0.055 * (S.sex === 'M' ? 0.8 : 0.55), 0.03, 0.9); };
function drinker() {
  if (S.flags.drk == null) { if (S.age < 19) return !!S.alc; S.flags.drk = chance(drinkP(C())) ? 1 : 0; }
  return !!S.flags.drk || !!S.alc;
}
const licOff = () => S.flags.noLic != null && S.flags.noLic > S.age;
function duiP(a) {
  if (!lawOK() || a < 20 || a > 75 || !(S.owns.car || S.owns.moto) || licOff() || !drinker() || S.refugee || S.flags.duiKill != null || (S.done.duikey || 0) >= 5) return 0;
  if (S.flags.drk2 == null) S.flags.drk2 = chance(S.sex === 'M' ? 0.5 : 0.3) ? 1 : 0;
  if (!S.flags.drk2 && !S.alc) return 0;
  const habit = S.flags.duiH != null && a - S.flags.duiH <= 6, last = S.flags.last_duikey;
  if (last != null && a - last < (habit ? 2 : 5)) return 0;
  return 0.13 * (S.sex === 'M' ? 1 : 0.3) * (a < 35 ? 1.3 : a > 60 ? 0.25 : 1) * (S.alc ? 2.5 : 1) * (habit ? 2.5 : S.flags.duiSafe ? 0.3 : 1) * (C().id === 'JPN' ? 0.25 : 1);
}
const duiCatch = c => ({ KOR: 0.16, JPN: 0.16, TWN: 0.14 })[c.id] || (c.ppp >= 30000 ? 0.1 : c.ppp >= 10000 ? 0.07 : 0.04);
const DRIVE_J = ['driver', 'delivery'];
function duiLic(again, kill) { const y = kill ? 5 : again ? 2 : 1; S.flags.noLic = S.age + y;
  if (DRIVE_J.includes(S.job)) { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; return ' ' + L`면허가 취소되어 ${y}년 동안 운전할 수 없게 되었고, 운전하던 일도 그만두어야 했습니다.`; }
  return ' ' + L`면허가 취소되어 ${y}년 동안 운전할 수 없게 되었습니다.`; }
const prRate = c => (PRISON_RATE[c.id] || 140) / 140;
const ppP = c => clamp(0.02 * prRate(c) * CRIME_Q[S.q || 3], 0, 0.15);
const parInPr = w => { const o = S.fam[w]; return !!(o && o.alive && o.pr != null && o.pr > S.age); };
const sibInPr = () => { const p = S.flags.sibPr; return p && p.to > S.age ? p : null; };
const kidInPr = k => !!(k && k.alive && k.pr && k.pr.to > S.age);
const KID_REC_J = new Set(['civil', 'police', 'soldier', 'teacher', 'nurse', 'doctor', 'lawyer', 'finance', 'prof']);
function kidJobOut(k, c, ka) { for (let i = 0; i < 6; i++) { const j = partnerJobFor({ base: 0.3, age: ka, sex: k.sex, deg: false }, c); if (j && !KID_REC_J.has(j)) return j; } return 'shop'; }
const kinFam = () => CRIME_Q[Math.min(5, Math.max(1, Math.ceil(hhPct() * 5)))] * (S.flags.prisonEver ? 1.3 : 1);
function kinBack(who, i) { (S.flags.kinQ = S.flags.kinQ || []).push({ who, i }); }
function wrongP(c, a) {
  if (!lawOK() || a < 18 || a > 55 || S.flags.wrongAt != null || S.refugee) return 0;
  const g = typeof ethG === 'function' && ethHome() ? ethG() : null;
  return 4e-6 * prRate(c) * (S.sex === 'M' ? 1 : 0.12) * CRIME_Q[S.q || 3] * (recEver() ? 2 : 1) * (1 + clamp(((g && g.d) || 0) * 8, 0, 1));
}
const FAM_MOVE = 0.025;
function famFortuneYear(a) {
  if (a < 1 || a > 17 || !withParents() || !famCanHelp() || S.flags.rich || S.adopt || S.fc || adoptWait() || (typeof rohG === 'function' && rohG()) || S.cur === 'PRK' || S.isComp) return;
  const q = S.q || 3, up = q < 5 && chance(FAM_MOVE), down = !up && q > 1 && chance(FAM_MOVE);
  if (!up && !down) return;
  S.q = q + (up ? 1 : -1); const pw = parW(), first = !S.flags.famMoveSaid; S.flags.famMoveSaid = 1;
  const F = first ? "Ở các nước OECD, khoảng 60% người thuộc nhóm 20% thu nhập thấp nhất vẫn ở nguyên nhóm đó sau 4 năm, và khoảng 70% người thuộc nhóm 20% cao nhất cũng vậy (OECD 2018)" : null;
  const f = S.fam, pj = [f.dad.alive && !f.dad.absent && !parInPr('dad') ? f.dad.job : null, f.mom.alive && !parInPr('mom') ? f.mom.job : null], sell = pj.some(j => ['vendor', 'shop', 'artisan', 'owner'].includes(j)), land = pj.some(j => ['farm', 'farmhand', 'herder', 'agbiz', 'fisher'].includes(j));
  const paid = pj.some(j => j && !PAR_NOPAY.has(j)), momHm = pj[1] === 'homemaker' && !raisedHere();
  if (up && !paid) { eff({ h: 2 }); if (momHm) { f.mom.job = parJobPick('F', f.mom.age, clamp((S.q - 0.5) / 5 - 0.05, 0.02, 0.97)); log("Mẹ bắt đầu đi làm, chi tiêu trong nhà rộng rãi hơn.", 'ev', F); } else log("Nhờ họ hàng giúp đỡ, kinh tế gia đình khá lên hẳn.", 'ev', F); }
  else if (up) { eff({ h: 2 }); log(pick([L`${iga(pw)} 하던 일이 자리를 잡으면서 집안 형편이 한결 나아졌습니다.`, ...(sell ? [L`${iga(pw)} 시작한 장사가 잘되어 집안 형편이 나아졌습니다.`] : land ? [] : [L`${iga(pw)} 더 나은 일자리를 구해 살림에 여유가 생겼습니다.`])]), 'ev', F); }
  else { eff({ h: -3 }); log(pick([...(!paid ? [] : sell ? [L`${iga(pw)} 하던 장사가 기울어 살림을 줄여야 했습니다.`] : land ? [] : [L`${iga(pw)} 일자리를 잃어 한동안 집안 형편이 어려워졌습니다.`]), "Gia đình mắc nợ, một thời gian cuộc sống trở nên khó khăn."]), 'bad', F); }
}
function lawYear(a) {
  if (AGE12 || !S.fam) return;
  const c = C(), f = S.fam;
  if (f.ppD == null && a <= 1) f.ppD = chance(ppP(c)) ? { w: chance(0.92) ? 'dad' : 'mom', at: ri(0, 15), y: wpick({ 1: 35, 2: 30, 3: 15, 4: 10, 5: 10 }) | 0 } : 0;
  const pd = f.ppD;
  if (pd && a === pd.at) {
    const o = f[pd.w];
    if (o && o.alive && !o.absent && withParents() && !adoptWait()) {
      o.pr = a + pd.y; f.ppEver = a; o.bd = (o.bd || 0) - 3; eff({ h: a >= 4 ? -5 : -1 });
      if (pd.w === 'dad' && chance(0.7)) S.q = Math.max(1, (S.q || 3) - 1);
      const gw = gpWho('F') || gpWho('M') || "người lớn";
      const other = pd.w === 'dad' ? (f.mom.alive ? "mẹ" : gw) : (f.dad.alive && !f.dad.absent ? "bố" : gw), P = pd.w === 'dad' ? "bố" : "mẹ";
      logN(a < 7 ? L`${iga(P)} 한동안 집에 오지 못하게 되었다고 ${iga(other)} 말했습니다. 왜인지는 한참 뒤에야 알게 되었습니다.`
        : S.school ? L`${iga(P)} 교도소에 가게 되었습니다. 학교에서는 아무에게도 말하지 않았습니다.` : L`${iga(P)} 교도소에 가게 되었습니다. 친구들에게는 아무 말도 하지 않았습니다.`, 'bad', "Khoảng 7% trẻ em Mỹ từng có bố hoặc mẹ sống cùng phải vào tù (Annie E. Casey Foundation 2016). Ở Hàn Quốc, mỗi năm có khoảng 54.000 em như vậy (Ủy ban Nhân quyền Quốc gia Hàn Quốc 2017)");
    }
  }
  for (const w of ['dad', 'mom']) {
    const o = f[w]; if (!o || o.pr == null || o.pr !== a) continue;
    if (!o.alive) continue;
    const P = w === 'dad' ? "bố" : "mẹ"; o.bd = (o.bd || 0) + 2;
    logN(a < 12 ? L`${iga(P)} 집에 돌아왔습니다. 처음에는 어색해서 문 뒤에 숨어 있었습니다. 그날 저녁, ${eun(P)} 밥을 아주 천천히 먹었습니다.`
      : L`${iga(P)} 집에 돌아왔습니다. 뭐라고 말해야 할지 몰라 “왔어?” 한마디만 했습니다.`, 'warm');
  }
  if (S.flags.sibPr == null && a >= 10 && a <= 75 && S.job !== 'prison' && !farFromNK()) {
    for (const s of sibAliveList()) {
      if (s.age < 18 || s.age > 45 || !chance(0.0006 * prRate(c) * CRIME_Q[S.q || 3] * (s.sex === 'M' ? 1 : 0.08))) continue;
      const yrs = wpick({ 1: 35, 2: 30, 3: 15, 4: 10, 6: 10 }) | 0, w = sibCall(s); S.flags.sibPr = { i: s.i, at: a, to: a + yrs, w };
      eff({ h: -4, so: -1 });
      logN(farKin() ? L`고향의 ${iga(w)} 교도소에 갔다는 소식을 들었습니다. ${parW()}께서 전화기 너머로 오래 말이 없으셨습니다.`
        : a < 18 ? L`${iga(w)} 교도소에 갔습니다. 그날부터 집 안이 조용해졌고, ${parW()}께서는 밤늦게까지 불을 끄지 않으셨습니다.`
        : L`${iga(w)} 재판을 받았습니다. 방청석 맨 뒷줄에 앉아 그 뒷모습만 바라보았습니다. 징역 ${yrs}년이었습니다.`, 'bad');
      break;
    }
  } else if (S.flags.sibPr && S.flags.sibPr.to === a && !S.flags.sibPr.back) {
    const p = S.flags.sibPr; p.back = 1; const s = sibAliveList().find(x => x.i === p.i);
    if (s && a >= 14 && !farKin()) kinBack('sib', p.i); else if (s) logN(L`${iga(p.w)} 교도소에서 나왔다는 소식을 들었습니다.`, 'ev');
  }
  if (a >= 36 && S.job !== 'prison' && f.kids.filter(k => k.pr).length < 2) {
    for (const k of f.kids) {
      const ka = a - k.bornAt;
      if (!k.alive || k.pr || k.placed || k.abroad || k.wmAt === a || ka < 18 || ka > 45 || !chance(0.0006 * prRate(c) * kinFam() * (k.sex === 'M' ? 1 : 0.08))) continue;
      const yrs = wpick({ 1: 35, 2: 30, 3: 15, 4: 10, 6: 10 }) | 0, n = callName(k.name); k.pr = { at: a, to: a + yrs }; if (KID_REC_J.has(k.job)) k.jobPr = k.job; k.bd = (k.bd || 0) - 4; eff({ h: -8, so: -2 });
      if (k.path === 'pending' || (k.path === 'uni' && !k.job && yrs > 2)) { k.path = 'work'; const q = S.flags.kidUniQ, ix = f.kids.indexOf(k); if (q && q.includes(ix)) q.splice(q.indexOf(ix), 1); }
      logN(L`${iga(n)} 재판을 받았습니다. 방청석 맨 뒷줄에 앉아 ${n}의 뒷모습만 바라보았습니다. 징역 ${yrs}년이 선고되던 순간, 고개를 돌린 ${iga(n)} 나를 찾았습니다.`, 'bad');
      break;
    }
  }
  f.kids.forEach((k, i) => { if (k.alive && k.pr && k.pr.to === a && !k.pr.back) { k.pr.back = 1; if (k.jobPr) { k.jobPr = null; k.job = kidJobOut(k, c, a - k.bornAt); } kinBack('kid', i); } });
  const em = S.flags.emb;
  if (em && a > em.at && S.job !== 'prison') {
    if (chance(0.4)) {
      S.flags.emb = null; S.flags.embDone = 1; S.money -= em.amt; const fired = isWorking(); if (fired) { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; } eff({ h: -8, so: -6 });
      NF_ON = true; try { log((fired ? L`감사에서 ${a - em.at}년 전 빼낸 돈이 드러났습니다. 회사에서 쫓겨났고, 가져간 돈을 모두 갚았습니다. (−${wonStr(em.amt)})` : L`감사에서 ${a - em.at}년 전 빼낸 돈이 드러났습니다. 가져간 돈을 모두 갚았습니다. (−${wonStr(em.amt)})`) + ' ' + sentence('embez'), 'bad'); } finally { NF_ON = false; }
    } else if (a - em.at >= 4 || S.retired) {
      S.flags.emb = null; S.flags.embDone = 1; S.money -= em.amt;
      logN(L`아무도 모르게 빼낸 돈을 몇 해에 걸쳐 몰래 채워 넣었습니다. 남은 것은 아무것도 없었고, 감사 공지가 뜰 때마다 가슴이 내려앉던 기억만 남았습니다. (−${wonStr(em.amt)})`, 'bad');
    } else eff({ h: -2 });
  }
  if (S.job !== 'prison' && chance(wrongP(c, a))) {
    const yrs = wpick({ 3: 25, 5: 30, 8: 25, 12: 15, 15: 5 }) | 0; recAdd({ k: 'wrong', s: 'prison', y: yrs }); const bt = goPrison(yrs, 'wrong'); S.flags.wrongAt = a;
    const P = f.married && f.partner && f.partner.alive && !f.partner.divorced;
    log(L`하지 않은 일로 체포되었습니다. 그날 밤 그 근처에 있었다는 이유로 재판에 넘겨졌고, 징역 ${yrs}년을 선고받았습니다.` + ' '
      + (f.mom.alive ? "Mẹ tin lời bạn đến tận cùng." : P ? "Mỗi lần đến thăm, bạn đời đều nói sẽ cùng bạn tìm cách chứng minh bạn vô tội." : "Người duy nhất tin lời bạn là luật sư.") + bt, 'bad',
      "Ước tính khoảng 4,1% người bị kết án tử hình ở Mỹ có thể vô tội (Gross và cộng sự 2014)");
  }
  if (S.flags.wrongAt != null && S.flags.wrongVoid == null && S.flags.prK === 'wrong') {
    const inside = S.job === 'prison', served = (S.stats.prisonY || 0) - (S.flags.prisonY0 || 0);
    if ((inside && served >= 2 && chance(0.08)) || (!inside && a - S.flags.wrongAt <= 25 && chance(0.04))) {
      S.flags.wrongVoid = a; for (const r of S.rec || []) if (r.k === 'wrong' && r.s === 'prison') r.s = 'void';
      const yrsIn = inside ? served : (S.flags.wrongY || served), comp = incomeAt(c, 0.5) * 0.6 * Math.max(1, yrsIn); S.money += comp; eff({ h: 10, so: 6 }); S.flags.shame = null; S.flags.wrongY = yrsIn;
      if (inside) { S.job = 'seeking'; S.flags.seekY = 0; S.flags.prisonUntil = a; S.yearMark = 'move'; }
      logN(inside ? (f.mom.alive ? L`${yrsIn}년 만에 재심에서 무죄를 선고받았습니다. 교도소 문을 나서는데 어머니가 기다리고 계셨습니다.` : L`${yrsIn}년 만에 재심에서 무죄를 선고받았습니다. 교도소 문 앞에서 그동안 나를 도운 사람들이 기다리고 있었습니다.`) + ' ' + L`국가가 보상금 ${wonStr(comp)}을 주었지만, 잃어버린 시간은 돌아오지 않았습니다.`
        : L`재심에서 마침내 무죄를 선고받았습니다. 국가가 보상금 ${wonStr(comp)}을 주었지만, 잃어버린 시간은 돌아오지 않았습니다.`, 'big');
    }
  }
  if (S.flags.wrongAt != null && S.job !== 'prison' && S.flags.wrongY == null && S.flags.prK === 'wrong') S.flags.wrongY = Math.max(1, (S.stats.prisonY || 0) - (S.flags.prisonY0 || 0));
  const kl = S.flags.kinLate;
  if (kl && a - kl.at >= 2 && chance(0.4)) {
    S.flags.kinLate = null; const kid = kl.who === 'kid' ? f.kids[kl.i] : null;
    if (kid ? kid.alive : sibAliveList().some(s => s.i === kl.i)) { const n = kid ? callName(kid.name) : S.flags.sibPr.w; if (kid) kid.bd = (kid.bd || 0) + 6; eff({ h: 3, so: 2 });
      logN(L`오랜만에 ${n}에게 먼저 전화를 걸었습니다. 수화기 너머에서 한참 아무 말이 없다가, 울먹이는 소리가 들렸습니다.`, 'warm'); }
  }
  if (S.flags.duiH != null && a > S.flags.duiH && S.job !== 'prison' && (S.owns.car || S.owns.moto) && !licOff()) {
    const moto = !S.owns.car, again = recN('dui') + recN('duih') > 0;
    if (a - S.flags.duiH > 6 || chance(0.15)) S.flags.duiH = null;
    else if (chance(0.006 * (moto ? 1.4 : 1))) { S.flags.duiH = null; const st = incomeAt(c, 0.5) * (0.3 + rnd() * 0.7); S.money -= st; eff({ h: -10, so: -5 });
      NF_ON = true; try { log(L`술을 마시고 운전하던 밤, 길을 건너던 사람을 치었습니다. 그 사람은 몇 달 동안 병원에 있었습니다. 치료비와 합의금을 건네고 병실 앞에서 고개를 숙였습니다. (−${wonStr(st)})` + ' ' + sentence('duih') + duiLic(again), 'bad'); } finally { NF_ON = false; } }
    else if (chance(duiCatch(c) * 1.5)) { S.flags.duiH = chance(0.4) ? a : null; eff({ h: -6, so: -3 });
      NF_ON = true; try { log("Lái xe sau khi uống rượu, bạn bị chặn lại ở chốt kiểm tra nồng độ cồn." + ' ' + sentence('dui') + duiLic(again), 'bad'); } finally { NF_ON = false; } }
  }
  if (S.flags.duiKill != null && a - S.flags.duiKill === 2 && S.job !== 'prison') logN("Từ hôm đó bạn không bao giờ cầm lái nữa. Mỗi năm đến ngày giỗ của người ấy, suốt cả ngày bạn chẳng làm nổi việc gì.", 'bad');
}
const fightP = () => 0.003 * (S.sex === 'M' ? 1 : 0.12) * (S.age < 25 ? 2 : S.age < 35 ? 1.2 : S.age < 45 ? 0.6 : 0.3) * (S.alc ? 3 : drinker() ? 1.2 : 0.4)
  * clamp((C().hom || 2) / 4, 0.6, 1.4) * Math.sqrt(crimeBg()) * (S.trait === 'act' ? 1.2 : 1);
function fightRun() {
  const st = incomeAt(C(), 0.5) * (0.05 + rnd() * 0.25); S.money -= st; eff({ h: -5, so: -3 });
  const t = pick([...(drinker() ? ["Trong một cuộc nhậu, hai bên cãi nhau. Trong lúc xô đẩy, người kia ngã và bị thương, còn bạn phải qua đêm ở đồn cảnh sát."] : []), "Một trận cãi vã nhỏ biến thành ẩu đả. Người kia vào bệnh viện, còn bạn vào đồn cảnh sát.",
    "Va vai với một người trên đường, hai bên lớn tiếng rồi bạn vung nắm đấm. Sáng hôm sau, bạn không tin nổi mình đã làm gì."]);
  if (chance(0.35)) { recAdd({ k: 'fight', s: 'warn' }); return { t: t + ' ' + L`치료비와 합의금을 건네며 고개를 숙였습니다. 상대가 처벌을 원하지 않아 일은 거기서 끝났습니다. (−${wonStr(st)})`, k: 'bad' }; }
  return { t: t + ' ' + L`치료비와 합의금을 건넸지만 재판까지 갔습니다. (−${wonStr(st)})` + ' ' + sentence('fight'), k: 'bad' };
}
const convOK = c => S.urban && c.ppp >= 8000 && !eraBefore(1995);
const teenP = () => (S.sex === 'M' ? 0.03 : 0.012) * Math.sqrt(crimeBg()) * (S.flags.street != null && S.flags.streetOut == null ? 2 : 1) * (S.urban ? 1.1 : 0.8);
function teenRun() {
  S.flags.teenBad = (S.flags.teenBad || 0) + 1; S.flags.teenBadAt = S.age;
  const f = S.fam, mom = f.mom.alive && !parInPr('mom'), dad = f.dad.alive && !f.dad.absent && !parInPr('dad'), who = mom && dad ? "bố mẹ" : mom ? "mẹ" : dad ? "bố" : "người giám hộ";
  if (mom) f.mom.bd = (f.mom.bd || 0) - 1; if (dad) f.dad.bd = (f.dad.bd || 0) - 1; eff({ h: -3, so: -1 });
  const sch = !!S.school;
  const t = pick([convOK(C()) ? "Bạn cùng bạn bè bị bắt quả tang khi lén bỏ bánh kẹo và nước uống vào cặp ở cửa hàng tiện lợi." : "Bạn cùng bạn bè bị bắt quả tang khi lén bỏ bánh kẹo và nước uống vào cặp ở cửa hàng trong xóm.", sch ? "Bạn cùng bạn bè bị bắt quả tang khi đang phun sơn vẽ bậy lên tường trường học vào ban đêm." : "Bạn cùng bạn bè bị bắt quả tang khi đang phun sơn vẽ bậy lên tường trong hẻm vào ban đêm.",
    sch ? "Bạn đánh nhau với học sinh trường khác ngay trước cổng trường." : "Bạn đánh nhau với bọn trẻ xóm khác ở bãi đất trống gần nhà.", "Bạn cùng bạn bè bị bắt khi lén lấy chiếc xe tay ga dựng bên đường đi lòng vòng."]) + ' ' + L`경찰서로 ${who}께서 오셨습니다.`;
  const F = "Ở nhiều nước, việc bị bắt vì phạm tội nhiều nhất vào cuối tuổi thiếu niên và giảm mạnh khi lớn tuổi hơn. Ở Anh, trong số nam giới sinh năm 1953, 20% đã bị kết án trước tuổi 20, nhưng chỉ 3% bị kết án lần đầu trong khoảng từ 30 đến 40 tuổi (Bộ Nội vụ Anh)";
  if (chance(0.7)) { recAdd({ k: 'teen', s: 'warn' }); return { t: t + ' ' + L`함께 찾아가 고개 숙여 사과했고, 경찰은 훈계만 하고 돌려보냈습니다. 돌아오는 길 내내 ${who}께서는 아무 말씀도 하지 않으셨습니다.`, k: 'bad', f: F }; }
  recAdd({ k: 'teen', s: 'juv' });
  return { t: t + ' ' + "Tòa án vị thành niên buộc bạn làm công việc phục vụ cộng đồng trong vài tháng. Việc này không ghi vào lý lịch khi bạn trưởng thành.", k: 'bad', f: F };
}
const needHard = () => S.age >= 16 && S.money < -incomeAt(C(), 0.5) * 0.3 && (S.job === 'seeking' || !isWorking() || S.pct < 0.15) && hhPct() < 0.2;
const DIS_NM = { move: "Khuyết tật vận động", sight: "Khiếm thị", hear: "Khiếm thính" };
const DIS_NOJOB = { move: new Set(['farmhand', 'herder', 'fisher', 'construct', 'miner', 'delivery', 'police', 'soldier', 'warehouse', 'welder', 'trainer', 'domestic', 'cleaner', 'pilot', 'cabin']),
  sight: new Set(['driver', 'delivery', 'police', 'soldier', 'welder', 'electric', 'mechanic', 'construct', 'miner', 'guard', 'fisher', 'designer', 'doctor', 'healthtech', 'pilot', 'cabin']),
  hear: new Set(['police', 'soldier', 'callc', 'pilot']) };
const disOn = () => !!(S.dis && S.dis.told);
const CP_T = () => ({ sp: "Bác sĩ nói đó là bại não thể co cứng: cơ lúc nào cũng cứng đờ. Ngày nào cũng có những bài tập giúp thả lỏng cơ.",
  dy: "Bác sĩ nói đó là bại não thể loạn động: cơ thể tự cử động ngoài ý muốn. Ngay cả việc cầm một chiếc thìa cũng phải tập rất lâu.",
  at: "Bác sĩ nói đó là bại não thể thất điều: rất khó giữ thăng bằng. Bạn học cách cử động chậm rãi, cẩn thận.",
  mx: "Bác sĩ nói đó là bại não thể hỗn hợp: vừa có cơ bị co cứng, vừa có những cử động cơ thể tự phát ra." });
const CP_LIFE = () => ({ sp: ["Mỗi sáng bạn bắt đầu ngày mới bằng những động tác giãn cơ cho đỡ cứng. Dần dần nó thành thói quen mà cơ thể tự nhớ.", "Trời lạnh thì cơ càng cứng hơn. Những buổi tối được ngâm mình trong nước ấm là dễ chịu nhất."],
  dy: ["Khi căng thẳng, cơ thể cử động nhiều hơn, nhưng ở bên những người quen thuộc thì thoải mái hơn hẳn.", "Bạn học cách gõ bàn phím thay vì viết tay. Ý nghĩ hiện lên màn hình còn nhanh hơn cả bàn tay."],
  at: ["Bạn có mẹo chọn đường bằng phẳng thay vì đường gồ ghề. Những con đường đi hằng ngày, nhắm mắt cũng thấy như thuộc lòng.", "Đi chậm hơn người khác, nhưng bạn ngắm được thật lâu những thứ họ vội lướt qua."],
  mx: ["Tình trạng cơ thể mỗi ngày mỗi khác. Vào những ngày khỏe, bạn dồn làm hết những việc mình muốn làm.", "Tập phục hồi chức năng với cùng một người suốt nhiều năm, hai bên thuộc hết những câu đùa của nhau."] });
const disJobOK = id => !S.dis || !DIS_NOJOB[S.dis.k].has(id);
const DIS_SKIP = { move: new Set(['steps', 'kid_bike', 'kid_ball', 'kid_tree', 'w_walk', 'kid_water', 'water']), sight: new Set(['kid_bike', 'kid_tree', 'w_view']), hear: new Set(['word', 'w_song', 'w_stars', 'w_voice', 'w_kidcall']) };
const DIS_WORK = { construct: 0.0012, miner: 0.0015, farmhand: 0.0003, farm: 0.0002, fisher: 0.0008, welder: 0.0008, factory: 0.0003, warehouse: 0.0004, driver: 0.0003, delivery: 0.0004, herder: 0.0002, mechanic: 0.0003, electric: 0.0004, agbiz: 0.0002 };
const disAccess = c => clamp(0.03 + 0.87 * (Math.log(c.ppp) - Math.log(1500)) / (Math.log(60000) - Math.log(1500)), 0.03, 0.9) * (calYr() < 1980 && c.p !== 'hi' ? 0.5 : 1);
const disAidCost = c => usd2ppp(c, { move: 1200, sight: 600, hear: 2500 }[S.dis.k]) * clamp((c.oop || 30) / 50, 0.3, 1) * (disAccess(c) < 0.2 ? 1.5 : 1);
const disEduK = (c, d) => Math.min(0.9, (c.ppp >= 30000 ? 0.7 : c.ppp >= 10000 ? 0.5 : 0.35) * (d.aid ? 1.5 : 1));
const disMiss = c => Math.min(0.85, (c.ppp >= 30000 ? 0.6 : 0.65) * (S.dis.aid ? 0.85 : 1) + 0.05 * (S.flags.seekY || 0));
const disDraw = () => !disOn() || !S.dis.aid ? '' : S.dis.k === 'move' && S.dis.wc ? 'w' : S.dis.k === 'sight' && S.age >= 6 ? 'c' : '';
const noWalk = () => disOn() && S.dis.k === 'move';
const noHear = () => !!(S && S.dis && S.dis.k === 'hear');
const noSight = () => !!(S && S.dis && S.dis.k === 'sight');
const disLabel0 = () => !disOn() ? '' : DIS_NM[S.dis.k] + (S.dis.k === 'move' && S.dis.wc && S.dis.aid ? " · dùng xe lăn" : S.dis.k === 'hear' && S.dis.aid ? " · dùng ngôn ngữ ký hiệu" : '');
const disLabel = () => [disLabel0(), typeof ddLabel === 'function' ? ddLabel() : ''].filter(Boolean).join(' · ');
function disBirth(c) {
  const lo = c.ppp < 5000 ? 1 : c.ppp < 20000 ? 0.6 : 0;
  const w = { move: 0.0028 + 0.0012 * lo, hear: 0.0012 + 0.0025 * lo, sight: 0.0004 + 0.001 * lo };
  for (const k of ['move', 'hear', 'sight']) if (chance(w[k])) { S.dis = { k, at: 0, src: 'birth', aid: 0, wc: k === 'move' && chance(0.45) ? 1 : 0, told: 0, tellAt: k === 'hear' ? ri(1, 2) : 1 }; return; }
  const yr = calYr(), polio = yr < 1960 && c.p === 'hi' ? 0.003 : yr < 1990 && c.p !== 'hi' ? 0.005 * (c.ppp < 20000 ? 1 : 0.4) : yr < 2000 && (c.p === 'sa' || c.p === 'ssa') ? 0.002 : 0;
  if (polio && chance(polio)) S.flags.polioAt = ri(1, 4);
}
function disGet(k, src, line) {
  const a = S.age, wc = k === 'move' && chance(src === 'acc' || src === 'work' ? 0.6 : src === 'stroke' ? 0.15 : 0.3) ? 1 : 0;
  S.dis = { k, at: a, src, aid: 0, wc, told: 1, tellAt: a };
  eff({ hl: -8, h: -6 });
  if (line) logA('hosp:me', line, 'big', src === 'stroke' ? STR_FACT() : null);
  else if (src === 'polio') log("Sau một trận sốt cao, một bên chân của bạn không còn sức nữa. Đó là bệnh bại liệt.", 'big', "Số ca bại liệt đã giảm hơn 99% kể từ năm 1988, nhờ tiêm chủng (WHO)");
  else if (src === 'fever') log(k === 'hear' ? "Sau một trận sốt cao, bạn gần như không còn nghe được âm thanh." : "Sau một trận sởi nặng, bạn gần như không còn nhìn thấy gì.", 'big', k === 'hear' ? "Khoảng 60% trường hợp suy giảm thính lực ở trẻ em có nguyên nhân phòng ngừa được (WHO)" : "Sởi và thiếu vitamin A là những nguyên nhân lớn gây mù lòa ở trẻ em tại các nước nghèo (WHO)");
  else if (src === 'acc') log(k === 'sight' ? "Bạn bị thương nặng trong một vụ tai nạn giao thông và mất gần hết thị lực." : wc ? "Bạn bị thương nặng trong một vụ tai nạn giao thông và không còn dùng được đôi chân. Từ đó bạn đi xe lăn." : "Bạn bị thương nặng trong một vụ tai nạn giao thông. Sau thời gian dài tập phục hồi chức năng, bạn đi lại được với cây gậy.", 'big', "Mỗi năm có từ 20 đến 50 triệu người bị thương vì tai nạn giao thông, và nhiều người trong số đó sống cùng khuyết tật (WHO 2023)");
  else log(k === 'sight' ? "Một tai nạn khi làm việc khiến bạn mất gần hết thị lực ở cả hai mắt." : wc ? "Bạn bị thương nặng khi làm việc và không còn dùng được đôi chân. Từ đó bạn đi xe lăn." : "Bạn bị thương nặng khi làm việc, cơ thể không còn vận động được như trước.", 'big', "Mỗi năm có khoảng 395 triệu người bị thương tại nơi làm việc (ILO)");
  if (a >= 18 && (isWorking() || S.job === 'seeking')) S.flags.disAdjQ = 1;
  if (isWorking() && !disJobOK(S.job)) { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; log("Không thể làm việc như trước nữa, bạn đã nghỉ công việc đang làm.", 'bad'); }
}
function disYear() {
  const c = C(), a = S.age, d = S.dis;
  if (!d) {
    if (S.flags.polioAt != null && a >= S.flags.polioAt) { S.flags.polioAt = null; disGet('move', 'polio'); return; }
    if (a >= 1 && a <= 10 && c.u5 > 20 && chance(c.u5 / 400000)) { disGet(chance(0.7) ? 'hear' : 'sight', 'fever'); return; }
    if (a >= 16 && a < 65 && isWorking() && DIS_WORK[S.job] && chance(DIS_WORK[S.job])) disGet(S.job === 'welder' && chance(0.3) ? 'sight' : 'move', 'work');
    return;
  }
  if (!d.told) {
    if (a < d.tellAt) return;
    d.told = 1;
    if (d.k === 'move') log(d.wc ? "Qua thôi nôi mà bạn vẫn chưa tự ngồi hay đứng được, nên gia đình đưa bạn đi khám. Bác sĩ nói đó là bại não." : "Qua thôi nôi mà chân bạn vẫn yếu, nên gia đình đưa bạn đi khám. Bác sĩ nói đó là khuyết tật sẽ theo bạn suốt đời.", 'big', "Cứ 1.000 trẻ sinh ra thì có 2–3 trẻ bị bại não (CDC)");
    else if (d.k === 'sight') log("Mắt bạn không dõi theo được món đồ chơi trước mặt, nên gia đình đưa bạn đi khám. Bác sĩ nói bạn gần như không nhìn thấy.", 'big', "Khoảng 1,3 tỷ người trên thế giới, cứ 6 người thì có 1 người, đang sống với khuyết tật đáng kể (WHO 2022)");
    else log("Gọi mà bạn không quay lại, nên bạn được đưa đi kiểm tra. Bác sĩ nói bạn gần như không nghe được âm thanh.", 'big', "Thế giới có khoảng 70 triệu người Điếc, dùng hơn 300 ngôn ngữ ký hiệu (Liên đoàn Người Điếc Thế giới)");
    return;
  }
  if (d.k === 'move' && d.wc && d.src === 'birth' && !d.cpT && a >= 3) {
    d.cpT = wpick({ sp: 80, dy: 10, at: 5, mx: 5 });
    log(CP_T()[d.cpT], 'ev', "Khoảng 80% người bị bại não thuộc thể co cứng (CDC Hoa Kỳ)");
    return;
  }
  if (!d.aid && !d.aidTried && a < 18 && a >= d.tellAt + 1) {
    d.aidTried = 1;
    if (chance(Math.min(0.95, disAccess(c) * [0.6, 0.8, 1, 1.15, 1.3][S.q - 1]))) {
      d.aid = 1; eff({ h: 3 });
      log(d.k === 'move' ? (d.wc ? "Lần đầu tiên bạn có chiếc xe lăn của riêng mình. Bạn tự mình đi đến tận cuối ngõ." : "Nhờ có nẹp chân và tập phục hồi chức năng, bạn đã tự đi được.")
        : d.k === 'sight' ? "Bạn bắt đầu học chữ nổi và cách dùng gậy trắng." : S.cur === 'KOR' ? "Bạn được lắp máy trợ thính và bắt đầu học ngôn ngữ ký hiệu Hàn Quốc. Giờ bạn đã có một ngôn ngữ để kết nối với thế giới." : "Bạn được lắp máy trợ thính và bắt đầu học ngôn ngữ ký hiệu. Giờ bạn đã có một ngôn ngữ để kết nối với thế giới.", 'warm');
    } else log(d.k === 'move' && d.wc ? "Không có cách nào kiếm được xe lăn, nên gia đình cõng bạn đi khắp nơi." : "Không có cách nào kiếm được dụng cụ hỗ trợ. Gia đình luôn ở bên bạn.", 'bad', "Ở một số nước nghèo, chỉ 3% người cần dụng cụ hỗ trợ có thể có được chúng (WHO·UNICEF 2022)");
  }
  if (!d.aid && a >= 18 && (S.done.disaid || 0) < 2 && (S.flags.last_disaid == null || a - S.flags.last_disaid >= 8) && S.job !== 'prison') S.flags.disAidQ = 1;
  if (a >= 18 && a < 65 && (S.job === 'seeking' || S.job === 'homemaker') && !S.school && (c.p === 'hi' || c.p === 'eca')) { const b = incomeAt(c, 0.5) * 0.18; S.money += b; book("Trợ cấp khuyết tật", b); }
}
const DD_IDP = c => 1.77 * Math.exp(Math.log(0.0234) + (Math.log(0.0033) - Math.log(0.0234)) * clamp((Math.log(c.ppp) - Math.log(2500)) / (Math.log(45000) - Math.log(2500)), 0, 1));
const DD_AUT = { M: 0.0106, F: 0.0051 };
const DD_AUT_NT = { M: [0.1, 0.6, 0.85], F: [0.05, 0.4, 0.7] };
function ddDraw(c, sex) {
  let k = null, xi = 0;
  if (chance(DD_AUT[sex] || 0.008)) { k = 'aut'; xi = chance(0.396) ? 1 : 0; }
  else if (chance(DD_IDP(c))) k = 'id';
  if (!k) return null;
  const r = rnd(), lv = k === 'aut' && !xi ? 1 : r < 0.85 ? 1 : r < 0.95 ? 2 : 3;
  const ld = k === 'aut' ? (xi || chance(0.4) ? 1 : 0) : 1;
  let nt = lv === 3 ? ri(1, 2) : lv === 2 ? ri(2, 4) : k === 'aut' ? ri(3, 5) : ri(6, 8);
  if (k === 'aut' && !xi && !ld) { const q = DD_AUT_NT[sex] || DD_AUT_NT.M, u = rnd(); nt = u < q[0] ? ri(3, 5) : u < q[1] ? ri(6, 11) : u < q[2] ? ri(12, 17) : ri(18, 45); }
  return { k, xi, lv, nt, ld, told: 0, dx: 0 };
}
function ddBirth(c) {
  const d = ddDraw(c, S.sex); if (!d) return;
  S.dd = d;
  if (d.k === 'id' || d.xi) { talEnsure(); S.tal.st = Math.round((-2.4 - 1.2 * (d.lv - 1) + 0.25 * gaussR(rnd)) * 100) / 100; }
}
const ddLv = () => (S && S.dd ? S.dd.lv : 0);
const ddIDk = d => !!(d && (d.k === 'id' || d.xi));
const ddDxOK = (c, d) => (c.ppp >= 10000 || (S.urban && c.ppp >= 4000)) && !(d.k === 'aut' && calYr() < (c.p === 'hi' ? 1980 : 2000));
const ddLabel = () => !S.dd || !S.dd.dx ? '' : S.dd.k === 'aut' ? (S.dd.xi ? "Tự kỷ · khuyết tật trí tuệ" : "Tự kỷ") : "Khuyết tật trí tuệ";
const DD_OWN = new Set(['temper', 'petq', 'petsick', 'hobby', 'reflect']);
const DD_FAM = new Set(['illness', 'diag', 'tbcare', 'hivtx', 'disaster', 'war', 'histgo', 'oldhome', 'care', 'homecoming', 'loan', 'retire', 'mandret', 'will', 'kidsick', 'parole', 'defroute']);
const DD2_NO = new Set(['nco', 'college', 'retake', 'afterUni', 'gradAbroadEnd', 'studyto', 'phd', 'profapp', 'erasmus', 'major', 'adultedu', 'noschool', 'school2', 'school3', 'job', 'jobchange', 'hmwork',
  'biz', 'bizfund', 'bizop', 'bizscale', 'growup', 'ownup', 'rankup', 'ofpath', 'apprent', 'selfcode', 'protry', 'youthtry', 'coachq', 'mustry', 'idolaud', 'traineeq', 'idolafter', 'acttry', 'dnctry', 'boardtry', 'gametry', 'gameafter',
  'arttry', 'runlocal', 'runnational', 'runleader', 'party', 'astro', 'nomad', 'abroad', 'city', 'movenear', 'farmback', 'invest', 'buy', 'crime', 'duikey', 'gamble', 'gambquit', 'drink', 'alcquit', 'smoke',
  'quit', 'lotto', 'affair', 'lend', 'cosign', 'kinask', 'heir', 'dreamtry', 'histrg', 'histdemo', 'histjunta', 'histkhm', 'defect', 'aiwork', 'vocation', 'ptpost', 'farsea', 'pbiz', 'pstock', 'service', 'cmarry', 'wife2', 'remit', 'hsch']);
const DD2_FAM = new Set(['loan', 'retire', 'mandret', 'will', 'war', 'disaster', 'histgo']);
function ddWay(id) {
  const d = S.dd; if (!d || d.lv < 2 || id.startsWith('sm_')) return null;
  if (d.lv === 3) return DD_OWN.has(id) ? null : DD_FAM.has(id) ? 'fam' : 'no';
  return DD2_FAM.has(id) ? 'fam' : DD2_NO.has(id) ? 'no' : null;
}
const DD_SKIP2 = new Set(['steps', 'word', 'grades', 'exam', 'teenjob', 'kid_academy', 'kid_lamp', 'teenbad', 'needtheft', 'fight', 'w_firstpay', 'w_teach', 'migjob', 'seeking', 'kid_dream',
  'debt', 'expense', 'savings', 'reunion', 'w_oldfriends', 'fr_call', 'fr_move', 'bff', 'bully', 'rift']);
const DD_SKIP3 = new Set(['kid_bike', 'kid_ball', 'crush', 'net', 'w_otherfaith', 'wallet', 'volunteer', 'teacher', 'neighbor', 'w_help', 'w_thanks', 'wedding', 'w_sib', 'noise', 'fr_help', 'fr_fight']);
const ddSkip = id => { const d = S.dd; return d.lv >= 2 ? DD_SKIP2.has(id) || (d.lv === 3 && DD_SKIP3.has(id)) : d.xi ? id === 'word' : false; };
const ddWithFam = id => !!(S && S.dd && S.dd.lv === 2 && S.age >= 16 && !String(id).startsWith('sm_') && !DD_OWN.has(id));
const DD3_SHOP = new Set(['dinner', 'dinnerauto', 'party', 'trip', 'tripauto', 'gear', 'gearauto', 'checkup', 'checkauto', 'donate', 'donateauto']);
const DD2_SHOP_NO = new Set(['parbring', 'abroad', 'abroadauto', 'broker', 'course', 'courseauto', 'huntauto', 'jobhunt', 'bizplan', 'runprep', 'dreamjob', 'workback', 'ged', 'nightgrad', 'openuni', 'nightuni',
  'moveout', 'movehome', 'rental', 'sellhouse', 'remodel', 'bigger', 'smaller', 'moveplan', 'askkids', 'split', 'willwrite', 'lottostop']);
const ddShopNo = id => !!(S && S.dd && S.dd.lv >= 2 && S.age >= 16 && (S.dd.lv === 3 ? !DD3_SHOP.has(id) : DD2_SHOP_NO.has(id)));
const ddKept = () => !!(S && S.dd && S.dd.lv >= 2);
const ddTalkLate = () => !!(S && S.dd && ((S.dd.k === 'aut' && S.dd.ld !== 0) || S.dd.lv >= 2));
const DD_NOJOB = new Set(['soldier', 'police', 'salesagent', 'driver', 'delivery', 'pilot', 'cabin', 'electric', 'miner', 'callc']);
const ddJobNo = id => !!(S && S.dd && ddIDk(S.dd) && (JOBS[id].e > 2 || DD_NOJOB.has(id)));
const ddMiss = () => S.dd.k === 'aut' && !S.dd.xi ? 0.97 : 0.93;