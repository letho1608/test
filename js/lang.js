// js/lang.js - Ngon ngu: L() (dich), capS, tro giup
window.LANG = 'vi';
const LANG = 'vi';
const LP = location.pathname.replace(/\/[^/]*$/, '');
const LANG_CFG = {
  vi: { loc: 'vi-VN', name: 'Tiếng Việt', brand: 'Vô Hạn Trùng Sinh', file: 'vohantrungsinh' },
};
const LC = LANG_CFG[LANG];
const L_WEST = !!LC.west;
const L_CJK = !!LC.cjk;
const L_MISS = new Set();
const L_CACHE = new WeakMap();
function lJoin(strs, vals) { let s = strs[0]; for (let i = 0; i < vals.length; i++) s += String(vals[i]) + strs[i + 1]; return s; }
const L_RT = new Array(8), L_RS = new Array(8);
let L_RI = 0;
function L(strs, ...vals) { const r = L0(strs, vals), i = L_RI++ & 7; L_RT[i] = r; L_RS[i] = strs; return r; }
function L0(strs, vals) {
  if (typeof I18N_T === 'undefined') return lJoin(strs, vals);
  let t = L_CACHE.get(strs);
  if (t === undefined) {
    const k = strs.join('\u0001'); t = Object.prototype.hasOwnProperty.call(I18N_T, k) ? I18N_T[k] : null;
    if (t === null) L_MISS.add(k);
    L_CACHE.set(strs, t);
  }
  if (t === null) return lJoin(strs, vals);
  
  
  if (t.indexOf('{@') >= 0) t = t.replace(/\{@(\w+)\}/g, (_, k) => helpVi(k));
  const r = vals.length ? t.replace(/\{(\d+)\}/g, (_, i) => viVal(vals[+i])) : t;
  return r;
}
const LBL = '';
const viDec = (x, d) => (+x.toFixed(d)).toLocaleString('vi-VN', { maximumFractionDigits: d });
const viNum = n => n >= 1e9 ? viDec(n / 1e9, n >= 1e10 ? 0 : 1) + ' tỷ' : n >= 1e6 ? viDec(n / 1e6, n >= 1e7 ? 0 : 1) + ' triệu' : Math.round(n).toLocaleString('vi-VN');
const VI_EN_GRP = /^([−+-]?)(\d{1,3}(?:,\d{3})+)(\.\d+)?(%?)$/, VI_EN_DEC = /^([−+-]?\d+)\.(\d{1,2})(%?)$/;
const viVal = v => {
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v).replace('.', ',');
  if (typeof v !== 'string' || v.length > 24) return String(v);
  let m = VI_EN_GRP.exec(v); if (m) return m[1] + m[2].replace(/,/g, '.') + (m[3] ? ',' + m[3].slice(1) : '') + m[4];
  m = VI_EN_DEC.exec(v); if (m) return m[1] + ',' + m[2] + m[3];
  return v;
};
const lcVi = s => String(s).replace(/^\p{Lu}(?=\p{Ll})/u, c => c.toLowerCase());
const cityIn = (country, city) => city + ', ' + country;
const CAP_FR1 = /((?:\.["”’)]?|\.[\s\u00a0]?»|[!?])\s+(?:<[^>]+>\s*)*(?:["“‘(]|«[\s\u00a0]?)?)(\p{Ll})/gu;
const CAP_VI0 = /^(\s*(?:<[^>]+>\s*)*["“‘(]?)(\p{Ll})/u, CAP_VI1 = /((?:\.["”’)]?|[!?])\s+(?:<[^>]+>\s*)*["“‘(]?)(\p{Ll})/gu;
const capS = s => typeof s !== 'string' ? s : s.replace(CAP_VI0, (m, p, c) => p + c.toUpperCase()).replace(CAP_VI1, (m, p, c) => p + c.toUpperCase());
const HELP_VI_TZ = { 'Asia/Ho_Chi_Minh': 'VN', 'Asia/Saigon': 'VN' };
const HELP_VI_C = 'ở Việt Nam, Đường dây nóng Ngày Mai 096 306 1414 (thứ Tư đến Chủ nhật, 13:00–20:30, miễn phí); khi nguy cấp, gọi cấp cứu 115';
const HELP_VI_A = 'ở Việt Nam, Đường dây nóng Ngày Mai 096 306 1414 (thứ Tư đến Chủ nhật, 13:00–20:30, miễn phí)';
const HELP_VI_D = 'ở Việt Nam, Tổng đài quốc gia về phòng, chống bạo lực gia đình 117 (24/7)';
const HELP_VI = {
  c: HELP_VI_C, u: HELP_VI_C, a: HELP_VI_A, g: HELP_VI_A, d: HELP_VI_D, dm: HELP_VI_D,
  y: 'ở Việt Nam, Tổng đài quốc gia bảo vệ trẻ em 111 (24/7, miễn phí) hoặc Đường dây nóng Ngày Mai 096 306 1414',
  k: 'ở Việt Nam, Tổng đài quốc gia bảo vệ trẻ em 111 (24/7, miễn phí)',
  s: 'ở Việt Nam, đường dây nóng của CSAGA 024 3333 5599 (8:00–21:00 hằng ngày, miễn phí); người dưới 18 tuổi có thể gọi 111 (24/7)',
  t: 'ở Việt Nam, đường dây nóng của CSAGA 024 3333 5599 (8:00–21:00 hằng ngày, miễn phí) hoặc Đường dây nóng Ngày Mai 096 306 1414',
};
let HELP_VI_RG = null;
function helpRegionVi() {
  if (typeof document === 'undefined') return 'VN';
  let z = ''; try { z = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {   }
  if (HELP_VI_TZ[z]) return 'VN';
  if (z && !/^(UTC|GMT|Etc\/)/.test(z)) return 'X';
  const ls = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
  return ls.some(l => /^vi(-vn)?$/i.test(l || '')) ? 'VN' : 'X';
}
function helpVi(k) {
  if (HELP_VI_RG === null) HELP_VI_RG = helpRegionVi();
  const line = HELP_VI_RG === 'VN' ? HELP_VI[k] || '' : '';
  if (k === 'c' || k === 'y' || k === 'k') return line ? `${line}; ở nơi khác, findahelpline.com có danh sách đường dây hỗ trợ miễn phí` : 'findahelpline.com có danh sách đường dây hỗ trợ miễn phí ở nơi bạn sống';
  return line ? `${line}; ở nơi khác, xem findahelpline.com` : 'findahelpline.com có danh sách đường dây hỗ trợ ở nơi bạn sống';
}
const TH_L = /[A-Za-z0-9À-ɏ$€£¥₩%฿]/, TH_ANY = /[ก-๎]/;
const TH_SPB = /([ก-๎])\((?=[^\s)])/g, TH_RANGE = /(\d[\d,.]*) บาท([–~-])(?=\d[\d,.]* บาท)/g;
const TH_AGE0B = /(?<![\d.,])อายุ 0 ปี/g;
const cLbl = s => s;
const monthEn = m => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][(+m || 1) - 1] || String(m);
let FR_PLRE = null, FR_NM = null;
const FR_VOW = /^(?:[aeiouàâäéèêëîïôöûüœæ]|h(?:abit|abil|alluc|armon|ébergement|ectare|éli|émi|émo|épat|erb|érit|éroï|ésit|eur|ier|indou|ispan|istoi|istor|iver|omicide|omme|omo|onnêt|onneur|ônn|ôpit|orai|orizon|orloge|ormon|ospi|ôte|uile|uî|umain|umani|umeur|umid|umil|umour|ygi|ypert|ypot|ystér))/i;
const frSx = (s, sex) => s;