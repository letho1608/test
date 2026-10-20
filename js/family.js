// js/family.js - Gia dinh, con cai, suc khoe, tu vong
const RET_DRAW = [0.04, 0.06, 0.08];
const retDraw = a => RET_DRAW[a < 75 ? 0 : a < 85 ? 1 : 2];
const DRAW_K = 20, DRAW_HI = 0.015;
function drawOf(r, c) { const W = Math.max(0, S.money), K = incomeAt(c || C(), 0.5) * DRAW_K; return r * Math.min(W, K) + DRAW_HI * Math.max(0, W - K); }
const oneHH = () => S.fam.married ? 1 : 0.8;
const retKeep = x => x > 1.5 ? clamp(1 - (1.5 + 0.25 * (x - 1.5)) / x, 0, 0.65) : 0;
const ownHomeHere = () => !['care', 'kid'].includes(S.flags.oldHome) && S.job !== 'prison' && !(S.serveLeft > 0) && !S.flags.hideCN;
const MORT_R = { KOR: 0.02, JPN: 0.012, TWN: 0.015, CHE: 0.012, DEU: 0.015, FRA: 0.015, ITA: 0.02, ESP: 0.02, NLD: 0.015, BEL: 0.015, AUT: 0.015, PRT: 0.02, FIN: 0.015,
  SWE: 0.015, DNK: 0.015, NOR: 0.02, IRL: 0.025, GBR: 0.025, CAN: 0.025, USA: 0.03, AUS: 0.03, NZL: 0.03 };
const mortR = c => MORT_R[c.id] ?? 0.03;
const OWN_RENT = { KOR: 0.02, CHN: 0.015, HKG: 0.015, TWN: 0.015 };
const OWN_KEEP = 0.35;
const creditFormal = c => c.p === 'hi' || c.p === 'eca' || (c.ppp > 15000 && S.formal);
function creditLimit(c) {
  c = c || C(); const med = incomeAt(c, 0.5), formal = creditFormal(c);
  return med * 0.2 + Math.max(0, S.income) * (formal ? 1 : 0.3) + homeV() * 0.8 + (formal && (S.edu >= 4 || S.school === 'uni' || S.school === 'grad' || S.school === 'phd') ? med * 0.8 : 0) + (S.owns.car ? usd2ppp(c, 8000) : 0);
}
const NO_STOCK = ['PRK', 'CUB', 'AFG', 'COD', 'SSD', 'ERI', 'SOM', 'YEM', 'HTI', 'LBR', 'BDI', 'GIN', 'MDG', 'TKM', 'LBY', 'CAF', 'TCD', 'ETH'];
const noStock = c => NO_STOCK.includes((c || C()).id);
const INV_KS = ['cash', 'bond', 'mix', 'stock', 'world', 'property', 'trade'];
const invOK = k => { const c = C(); if (k === 'cash' || S.invest === k) return true; if (k === 'property') return propOK(); if (k === 'world') return worldOK(c); if (noStock(c)) return false; return k !== 'trade' || calYr() >= 1996; };
const NO_WORLD = ['PRK', 'CUB', 'IRN', 'VEN', 'SYR', 'MMR', 'SDN', 'BLR'];
const WORLD_FROM = { KOR: 2000, TWN: 2000, CHN: 2007, IND: 2004, RUS: 2004, NGA: 2020, ISR: 1998 };
function worldOK(c) {
  c = c || C(); const y = calYr();
  if (noStock(c) || NO_WORLD.includes(c.id) || commEra(c.id) || S.refugee || (c.id === 'RUS' && y >= 2022)) return false;
  return y >= (WORLD_FROM[c.id] ?? (c.p === 'hi' ? 1990 : c.ppp >= 12000 ? 2005 : 2015));
}
const worldFee = c => c.p === 'hi' ? 0 : c.ppp >= 20000 ? 0.005 : 0.01;
function worldStk(z) {
  const yr = ecoYr(), u = yr != null && yr < NOW_Y ? MKT_S.USA[yr] : null;
  return u != null ? clamp(0.05 + 0.85 * (u - MKT_MU) + 0.06 * z, -0.5, 0.6) : clamp(STK_MU + 0.16 * z, -0.5, 0.6);
}
const FX_K = new Set(['debt', 'hyper', 'collor', 'ussr', 'ru98', 'trans', 'yugo', 'tequila', 'asia', 'corral', 'tur01', 'zim', 'ven', 'lbn', 'lka', 'br15', 'ru14', 'tur18', 'tur22', 'arg18', 'arg23', 'egy16', 'ngn16', 'ngn23', 'pak22', 'gha22', 'irn18', 'cur']);
const fxJump = () => { const e = eraEcon(); return e && e.y0 === ecoYr() && (FX_K.has(e.k) || e.sav < 1) ? 0.15 + 0.35 * rnd() : 0; };
const FX_USD = { ECU: [2000, 0], SLV: [2001, 0], PAN: [1904, 0], TLS: [2000, 0], HKG: [1983, 0.03], SAU: [1986, 0.03], OMN: [1986, 0.03], JOR: [1995, 0.03],
  ARE: [1997, 0.03], QAT: [2001, 0.03], BHR: [2001, 0.03], DJI: [1949, 0.03], KWT: [2007, 0.03] };
const FX_EUR = { BEN: 1948, BFA: 1948, CIV: 1948, GNB: 1997, MLI: 1984, NER: 1948, SEN: 1948, TGO: 1948, CMR: 1948, CAF: 1948, TCD: 1948, COG: 1948, GNQ: 1985,
  GAB: 1948, COM: 1979, CPV: 1999, BGR: 1997, BIH: 1998, MNE: 2002, XKX: 2002 };
const fxSd = c => { const y = calYr(), u = FX_USD[c.id]; if (u && y >= u[0]) return u[1]; return (FX_EUR[c.id] && y >= FX_EUR[c.id]) || c.p === 'hi' ? 0.09 : 0.13; };
function investReturn() {
  const z = () => invNorm(clamp(rnd(), 0.001, 0.999)), k = S.invest || 'cash', hi = C().p === 'hi';
  const stk = zs => mktStk(zs, hi);
  const bnd = zb => clamp(0.017 + (hi ? 0.06 : 0.09) * zb, -0.3, 0.35);
  const tell = big => { if (!big && S.flags.mktL != null && S.age - S.flags.mktL < 3) return false; S.flags.mktL = S.age; return true; };
  if (k === 'stock') {
    const r = stk(z());
    if (r < -0.18 && tell(r <= -0.35)) log(L`주식시장이 폭락해 투자금의 ${Math.round(-r * 100)}%가 사라졌습니다.`, 'bad');
    else if (r > 0.25 && tell(r >= 0.45)) log(L`주식이 크게 올라 투자금이 ${Math.round(r * 100)}% 불었습니다.`, 'big');
    return r;
  }
  if (k === 'bond') return bnd(z());
  if (k === 'world') {
    const c = C(), f = S.flags, zw = z(), r = worldStk(zw) - worldFee(c); let fx = 0;
    const sd = fxSd(c);
    if (c.id !== 'USA' && sd > 0) {
      if (f.fxC !== S.cur) { f.fxC = S.cur; f.fxL = 0; }
      const j = (f.fxJ || 0) + fxJump(), L0 = f.fxL || 0;
      const d = -0.2 * L0 + sd * (-0.3 * zw + 0.954 * z()) - sd * sd / 2 + Math.log(1 + j);
      f.fxJ = 0; f.fxL = L0 + d; fx = Math.exp(d) - 1;
    } else f.fxJ = 0;
    const t = (1 + r) * (1 + fx) - 1;
    if (fx > 0.2 && t > 0.15 && tell(fx >= 0.35)) log(L`환율이 크게 올라, 해외 지수에 넣어 둔 돈이 ${C().ko} 돈으로 ${Math.round(t * 100)}% 불었습니다.`, 'ev');
    else if (r < -0.18 && t < -0.12 && tell(t <= -0.35)) log(L`세계 주식시장이 크게 떨어져 해외 지수에 넣어 둔 돈의 ${Math.round(-t * 100)}%가 사라졌습니다.`, 'bad');
    else if (fx < -0.15 && t < -0.1 && tell(false)) log(L`환율이 크게 내려, 해외 지수에 넣어 둔 돈이 ${C().ko} 돈으로 ${Math.round(-t * 100)}% 줄었습니다.`, 'bad');
    return t;
  }
  if (k === 'mix') {
    const zs = z(), r = 0.5 * stk(zs) + 0.5 * bnd(0.2 * zs + 0.98 * z());
    if (r < -0.12 && tell(r <= -0.25)) log(L`주식시장이 크게 떨어져 반반 펀드도 ${Math.round(-r * 100)}% 줄었습니다. 채권 덕에 주식만큼 줄지는 않았습니다.`, 'bad');
    return r;
  }
  if (k === 'trade') {
    const m = stk(z()), r = clamp(m - 0.055 + Math.exp(0.25 * z() - 0.031) - 1, -0.9, 3);
    if (r < -0.3 && tell(r <= -0.5)) log(L`고른 종목들이 크게 떨어져 굴리던 돈의 ${Math.round(-r * 100)}%를 잃었습니다.`, 'bad', S.flags.tradeF ? null : (S.flags.tradeF = 1, "Trong số những nhà giao dịch trong ngày ở Đài Loan tự chọn cổ phiếu và mua bán thường xuyên, chưa đến 1% kiếm lời đều đặn năm này qua năm khác (Barber và cộng sự, 2014)"));
    else if (r > 0.5 && tell(r >= 0.8)) log(L`고른 종목이 크게 올라 굴리던 돈이 ${Math.round(r * 100)}% 불었습니다.`, 'big');
    return r;
  }
  if (k === 'property') {
    const r = clamp(0.035 + 0.07 * ecoZ(z()) + eraHse(), -0.3, 0.25);
    if (r < -0.08) log("Thị trường bất động sản đi xuống, số tiền bạn đầu tư bị hao hụt.", 'bad');
    return r;
  }
  return (lowInc(C()) ? 0.01 : 0.015) + eraCash() - (fxOn() ? 0.005 : 0);
}
const CG_TAX = { USA: 0.15, GBR: 0.2, IRL: 0.33, DEU: 0.26, FRA: 0.3, ITA: 0.26, ESP: 0.21, PRT: 0.28, NLD: 0.3, SWE: 0.3, NOR: 0.22, DNK: 0.27, FIN: 0.3, AUT: 0.27,
  JPN: 0.2, KOR: 0.15, CAN: 0.13, AUS: 0.15, NZL: 0, CHE: 0, BEL: 0, CHN: 0, TWN: 0, HKG: 0, SGP: 0, MYS: 0, THA: 0, IND: 0.125, BRA: 0.15, MEX: 0.1, TUR: 0, RUS: 0.13, POL: 0.19, ISR: 0.25, ZAF: 0.18 };
const cgTax = k => k === 'cash' || k === 'bond' ? 0 : C().id === 'KOR' && (k === 'stock' || k === 'trade') ? 0 : CG_TAX[C().id] ?? 0.15;
const INV_SELL = { bond: 0.002, mix: 0.003, stock: 0.002, world: 0.005, trade: 0.004, property: 0.02 };
function investYear() {
  const k = S.invest || 'cash', tx = cgTax(k); let G = S.flags.invG || 0; const M = S.flags.invM || 0;
  if (G && M > 0 && S.money < M) { const sold = G * (1 - S.money / M); G -= sold; if (sold > 0 && tx) { S.money -= sold * tx; book("Thuế trên lợi nhuận đầu tư", -sold * tx); } }
  const m0 = S.money, r = investReturn() + ecoSavK(), g = S.money * r; S.money += g;
  book({ stock: "Cổ phiếu", world: "Quỹ chỉ số thế giới", property: "Đầu tư bất động sản", bond: "Trái phiếu", mix: "Nửa cổ phiếu, nửa trái phiếu", trade: "Tự chọn và mua bán cổ phiếu" }[k] || "Lãi tiền gửi", g);
  if (k === 'cash' && S.age >= 18) {
    const ex = eraCash(), med0 = incomeAt(C(), 0.5);
    if (ex >= 0.03 && m0 * ex >= med0 * 0.02) log(L`금리가 치솟아 예금 이자로 ${wonStr(m0 * ex)}을 더 받았습니다.`, 'ev', S.cur === 'KOR' && ecoYr() === 1998 ? "Ngay sau khủng hoảng tiền tệ, lãi suất qua đêm có lúc vượt 30% một năm, lãi suất tiền gửi ngân hàng cũng lên gần 20% (Bank of Korea)" : null);
    if (!S.flags.botL && m0 >= med0 && S.age >= 20 && !ddKept() && mktCrash()) { S.flags.botL = S.age; log("Khi giá cổ phiếu lao dốc, những người cầm tiền mặt chia hai luồng ý kiến: người bảo giờ là lúc mua, người bảo giá còn xuống nữa.", 'ev'); }
  }
  S.flags.invG = k === 'cash' || k === 'bond' ? 0 : Math.max(-S.money, G + g); S.flags.invM = S.money;
  invTold(k, g);
}
const invMark = k => { S.flags.invA = S.age; S.flags.invK = k; S.flags.invS = 0; S.flags.invC = 0; };
function invTold(k, g) {
  const f = S.flags; if (f.invA == null || f.invK !== k) return;
  f.invS = (f.invS || 0) + g; f.invC = (f.invC || 0) + Math.max(0, S.money - g) * ((lowInc(C()) ? 0.01 : 0.015) + eraCash());
  if (S.age - f.invA < 10 || k === 'cash' || S.age < 18) return;
  const N = INV_NM()[k], s = f.invS, d = s - f.invC; f.invA = null;
  if (Math.abs(s) < med() * 0.05) return;
  log((s >= 0 ? L`${N}에 돈을 넣어 둔 지 10년, 그동안 불어난 돈은 모두 ${wonStr(s)}입니다.` : L`${N}에 돈을 넣어 둔 지 10년, 그동안 줄어든 돈은 모두 ${wonStr(-s)}입니다.`)
    + ' ' + (Math.abs(d) < med() * 0.05 ? "Cũng gần bằng nếu để tiền gửi tiết kiệm." : d > 0 ? L`예금에 두었다면 ${wonStr(d)}쯤 덜 벌었을 것입니다.` : L`예금에 두었다면 ${wonStr(-d)}쯤 더 남았을 것입니다.`), s >= 0 ? 'ev' : 'bad');
}
function invSwitch(to) {
  const was = S.invest || 'cash'; if (was === to || !INV_KS.includes(to)) return '';
  S.invest = to; invMark(to); if (to === 'world') { S.flags.fxL = 0; S.flags.fxC = S.cur; }
  if (!(S.money > 0)) { S.flags.invG = 0; S.flags.invM = 0; return S.money < 0 ? L`지금은 빚이 ${wonStr(-S.money)} 있어 굴릴 돈이 없습니다. 빚을 내서 투자하지는 않고, 빚을 다 갚은 뒤 모이는 돈부터 ${INV_NM()[to]}에 넣습니다.` : ''; }
  const fee = S.money * (INV_SELL[was] || 0), tax = Math.max(0, S.flags.invG || 0) * cgTax(was), N = INV_NM();
  S.money -= fee + tax; book("Phí và thuế khi chuyển khoản đầu tư", -(fee + tax)); S.flags.invG = 0; S.flags.invM = S.money;
  const cost = fee + tax >= med() * 0.005 ? ' ' + (tax > 0 ? L`수수료 ${wa(wonStr(fee))} 번 돈에 대한 세금 ${wonStr(tax)}이 나갔습니다.` : L`수수료 ${wonStr(fee)}이 나갔습니다.`) : '';
  if (was === 'cash') return L`예금을 빼서 ${N[to]}에 넣었습니다.`;
  return (to === 'cash' ? L`${eul(N[was])} 모두 팔아 예금으로 옮겼습니다.` : L`${eul(N[was])} 팔아 ${N[to]}에 넣었습니다.`) + cost;
}
const INV_NM = () => ({ cash: L`예금${LBL}`, bond: L`채권${LBL}`, mix: L`주식·채권 반반 펀드${LBL}`, stock: L`주식${LBL}`, world: L`해외 지수${LBL}`, property: L`부동산${LBL}`, trade: L`직접 고른 종목${LBL}` });
const RENT_Y = { KOR: 0.033, JPN: 0.045, TWN: 0.02, CHN: 0.018, HKG: 0.028, SGP: 0.03, USA: 0.065, CAN: 0.045, GBR: 0.05, IRL: 0.055, DEU: 0.035, FRA: 0.04, ITA: 0.045, ESP: 0.05, NLD: 0.045, AUS: 0.04, NZL: 0.04, SWE: 0.035, CHE: 0.03, AUT: 0.035 };
const RENT_COST = { USA: 0.022, CAN: 0.015, KOR: 0.009, JPN: 0.013, CHN: 0.004, TWN: 0.006, HKG: 0.008, GBR: 0.012, DEU: 0.012 };
const RENT_SELL = { USA: 0.06, CAN: 0.05, FRA: 0.06, DEU: 0.05, GBR: 0.03, KOR: 0.01, JPN: 0.04 };
const RENT_CGT = { KOR: 0.25, USA: 0.2, JPN: 0.2, GBR: 0.24, FRA: 0.2, CAN: 0.13, AUS: 0.15, CHN: 0.2, TWN: 0.2, SGP: 0, HKG: 0, NZL: 0, CHE: 0.2 };
const RENT_MAX = 3;
const rentY = c => RENT_Y[c.id] || (c.p === 'hi' ? 0.045 : 0.06);
const rentCost = c => RENT_COST[c.id] || (c.p === 'hi' ? 0.014 : 0.01);
const rentLTV = c => c.id === 'KOR' ? (S.house > 0 || rentals().length ? 0.5 : 0.7) : c.p === 'hi' ? 0.75 : ['eca', 'lac', 'eap', 'mena'].includes(c.p) && c.ppp >= 12000 ? 0.5 : 0;
const rentOK = () => S.age >= 25 && S.age < 80 && !S.school && S.job !== 'prison' && !S.refugee && !S.flags.hideCN && S.cur !== 'PRK' && !commEra(S.cur) && C().ppp >= 5000;
function rentDeal(k, m = S.money) {
  const c = C(), v = housePrice(c) * (k === 'b' ? 1 : 0.55), n = rentals().length, ltv = rentLTV(c);
  const buy = v * (c.id === 'KOR' && (S.house > 0 ? 1 : 0) + n >= 2 ? 0.08 : 0.03), loan = Math.min(v * ltv, Math.max(0, v + buy - Math.max(0, m))), down = v - loan + buy;
  const rent = (rentals().reduce((t, h) => t + h.v * rentY(CBY[h.c] || c), 0) + v * rentY(c)) * 0.7;
  return { v, loan, down, buy, ok: (Math.max(0, -m) + loan) * 0.06 <= 0.4 * (shopInc() + rent) };
}
function rentBuy(k, paid = 0) {
  const d = rentDeal(k, S.money + paid); if (!d.ok || rentals().length >= RENT_MAX) { S.money += paid; return null; }
  S.money -= d.loan; rentals().push({ v: d.v, p: d.v, at: S.age, c: S.cur, k }); S.yearMark = 'buy';
  return (d.loan > 0 ? L`대출 ${wonStr(d.loan)}을 끼고 세 놓을 ${k === 'b' ? "căn nhà" : "căn nhà nhỏ"}을 ${wonStr(d.v)}에 샀습니다.` : L`세 놓을 ${k === 'b' ? "căn nhà" : "căn nhà nhỏ"}을 ${wonStr(d.v)}에 샀습니다.`)
    + ' ' + L`세금과 비용으로 ${wonStr(d.buy)}이 들었습니다. 이제 다달이 월세가 들어옵니다.`;
}
const rentInOK = () => !(S.house > 0) && !S.owns.house && !S.refugee && S.job !== 'prison' && rentals().some(h => h.c === S.cur);
function rentIn() {
  const R = rentals(), i = R.findIndex(h => h.c === S.cur); if (i < 0 || !rentInOK()) return null;
  const h = R.splice(i, 1)[0]; S.house = h.v; S.owns.house = S.age; S.flags.hPaid = h.paid || 0; houseSet(); S.flags.hadHome = 1; S.yearMark = 'move';
  return "Sau khi người thuê dọn đi, bạn chuyển vào sống trong căn nhà từng cho thuê. Giờ bạn không phải trả tiền thuê nhà nữa.";
}
function rentSellNet(h) { const c = CBY[h.c] || C(), gain = Math.max(0, h.v - h.p), cgt = c.id === 'DEU' && S.age - h.at >= 10 ? 0 : RENT_CGT[c.id] ?? 0.15; return { net: h.v * (1 - (RENT_SELL[c.id] || 0.04)) - gain * cgt, tax: gain * cgt }; }
const homeAtW = () => { const city = S.urban && S.city ? S.city : null, both = S.cur !== S.born || rentals().some(h => h.c !== S.cur); return { c: C().ko, city: both ? city : null, one: city || C().ko }; };
const homeAtD = () => { const w = homeAtW(); return w.city ? L`${w.c} ${w.city}에 있는 집` : L`${w.one}에 있는 집`; };
const homeAtSold = () => { const w = homeAtW(); return w.city ? L`${w.c} ${w.city}에 있던 집을 팔았습니다.` : L`${w.one}에 있던 집을 팔았습니다.`; };
const sellAfter = done => S.flags.oldHome === 'kid' ? (done ? "Bạn vẫn sống ở nhà con." : "Sau đó bạn vẫn sống cùng con")
  : S.flags.oldHome === 'care' ? (done ? "Bạn vẫn sống ở viện dưỡng lão." : "Sau đó bạn vẫn ở viện dưỡng lão") : done ? "Giờ bạn đi thuê nhà." : "Từ đó đi thuê nhà để ở";
const rentSellN = () => { const h = rentals()[0], far = h && CBY[h.c] && (h.c !== S.cur || rentals().some(x => x.c !== h.c)); return far ? L`${CBY[h.c].ko}의 집 한 채 팔기` : "Bán một căn"; };
function rentSell() {
  const h = rentals().shift(); if (!h) return null; const { net, tax } = rentSellNet(h);
  S.money += net; S.yearMark = 'move';
  return (h.c !== S.cur && CBY[h.c] ? L`${CBY[h.c].ko}에 세 놓았던 집을 ${wonStr(h.v)}에 팔았습니다. (산 값 ${wonStr(h.p)})` : L`세 놓았던 집을 ${wonStr(h.v)}에 팔았습니다. (산 값 ${wonStr(h.p)})`) + ' ' + (tax > 0 ? L`비용과 양도세 ${wonStr(tax)}를 빼고 ${wonStr(net)}이 손에 들어왔습니다.` : L`비용을 빼고 ${wonStr(net)}이 손에 들어왔습니다.`)
    + (S.money < 0 ? ' ' + L`그래도 남은 빚이 ${wonStr(-S.money)}입니다.` : '');
}
function rentalYear(add) {
  for (const h of S.rentals || []) {
    const c = CBY[h.c] || C(), vac = chance(0.15) ? 2 + Math.floor(rnd() * 5) : 0, rent = h.v * rentY(c) * (h.k === 's' ? 1.3 : 1) * (1 - vac / 12), cost = h.v * rentCost(c);
    const mgr = h.c !== S.cur ? rent * 0.09 : 0;
    add("Thu nhập từ cho thuê nhà", rent); add("Phí quản lý và thuế nhà cho thuê", -(cost + Math.max(0, rent - cost - mgr) * 0.15)); if (mgr) add("Phí dịch vụ quản lý nhà cho thuê", -mgr);
    if (vac >= 4 && !S.flags.rvacAt) (S.flags.rvacAt = S.age, log(h.c !== S.cur && CBY[h.c] ? L`${CBY[h.c].ko}에 두고 온 집의 세입자가 나가고 ${vac}달 동안 새 세입자를 찾지 못해 집이 비었습니다.` : L`세입자가 나가고 ${vac}달 동안 새 세입자를 찾지 못해 집이 비었습니다.`, 'bad'));
  }
}
function hrAt(iso) {
  const yr = typeof ecoYr === 'function' ? ecoYr() : null, z = invNorm(clamp(rnd(), 0.001, 0.999));
  if (yr != null && yr >= NOW_Y) { const M = S.flags.hMkA || (S.flags.hMkA = {}), o = M[iso] || 0, n = clamp(0.85 * o + 0.05 * z, -0.6, 0.6); M[iso] = n; return 0.002 + n - o; }
  const e = yr != null && typeof eraEconAt === 'function' ? eraEconAt(iso, yr) : null;
  return 0.002 + 0.05 * z + (e && e.hse ? e.hse : 0) + eraHseG(iso);
}
function rentalPrices(hr) {
  const far = {};
  for (const h of S.rentals || []) {
    const base = h.c && h.c !== S.cur && CBY[h.c] ? (far[h.c] != null ? far[h.c] : (far[h.c] = hrAt(h.c))) : hr;
    const r = clamp(base - (h.k === 's' ? 0.007 : 0) + 0.03 * invNorm(clamp(rnd(), 0.001, 0.999)), -0.35, 0.3), d = h.v * r; h.v += d; book("Biến động giá nhà cho thuê", d);
  }
}
function rentalFire() {
  const h = rentals().pop(), net = h.v * 0.88 - rentSellNet(h).tax; S.money += net; book("Bán gấp nhà cho thuê", net - h.v);
  log(L`빚을 감당하지 못해 세 놓은 집을 시세보다 싸게 급히 팔았습니다. (시세 ${wonStr(h.v)}, 손에 쥔 돈 ${wonStr(net)})`, 'bad');
}
function loseRentals(iso) { const R = rentals(), lost = R.filter(h => h.c === iso); if (!lost.length) return; S.rentals = R.filter(h => h.c !== iso); book("Nhà bị mất", -lost.reduce((t, h) => t + h.v, 0)); }
function makeGrandparents(c, mAge, fAge) {
  const out = [];
  for (const [side, pAge] of [['m', mAge], ['f', fAge]]) for (const sex of ['F', 'M']) {
    const gap = clamp(afmF(c) - (c.p === 'hi' ? 3 : 0) + 3 + (rnd() + rnd() - 1) * 6, 16, 42) + (sex === 'M' ? coupleGap(c) : 0);
    const age = Math.round(pAge + gap), l = lifeTable(c, sex).l;
    out.push({ side, sex, age, alive: chance(Math.pow(l[Math.min(110, age)] / l[Math.min(age, 30)], 1.15)) });
  }
  return out;
}
const gpLabel = g => g.side === 'm' ? (g.sex === 'F' ? "bà ngoại" : "ông ngoại") : (g.sex === 'F' ? "bà" : "ông");
const gpPick = () => pick(S.fam.gp.filter(g => g.alive && !(g.side === 'f' && S.fam.dad.absent)));
const gpAlive = sex => (S.fam.gp || []).some(g => g.alive && (!sex || g.sex === sex) && !(g.side === 'f' && S.fam.dad.absent));
const gpWho = sex => { const g = (S.fam.gp || []).filter(g => g.alive && g.sex === sex && !(g.side === 'f' && S.fam.dad.absent)); return g.length ? gpLabel(pick(g)) : null; };
function funeralLine() {
  const b = S.born, r = S.rel, p = B().p;
  if (b === 'KOR') return "Gia đình tổ chức tang lễ ở nhà tang lễ, tiếp khách đến viếng suốt ba ngày.";
  if (b === 'JPN') return "Sau đêm canh thức (tsuya) và lễ tiễn biệt là lễ hỏa táng.";
  if (r === 'M') return "Theo phong tục Hồi giáo, ngay trong ngày thi hài được tắm rửa, quấn vải trắng rồi an táng.";
  if (r === 'H') return "Theo phong tục, thi hài được hỏa táng và tro được thả xuống dòng sông.";
  if (r === 'S') return "Theo phong tục, thi hài được hỏa táng, và gia đình quây quần đọc kinh.";
  if (r === 'J') return "Sau tang lễ, gia đình giữ shiva (thời gian để tang) tại nhà suốt một tuần.";
  if (['CHN', 'TWN', 'VNM', 'HKG', 'SGP', 'PRK'].includes(b)) return "Gia đình mặc tang phục trắng trong tang lễ, và hẹn năm nào cũng đi tảo mộ.";
  if (r === 'B') return "Tang lễ diễn ra trong tiếng tụng kinh của các nhà sư, rồi thi hài được hỏa táng.";
  if (p === 'ssa' && r === 'C') return den() === 'cath' ? "Thánh lễ an táng được cử hành ở nhà thờ, rồi người đã khuất được chôn cất ở nghĩa trang. Suốt mấy ngày, cả xóm cùng hát và chia sẻ nỗi buồn." : "Lễ tang được tổ chức ở nhà thờ, rồi người đã khuất được an táng ở nghĩa trang. Suốt mấy ngày, cả xóm cùng hát và chia sẻ nỗi buồn.";
  if (p === 'ssa') return "Cả xóm tụ họp, tang lễ kéo dài nhiều ngày trong tiếng hát.";
  if (r === 'C') return den() === 'cath' ? "Sau thánh lễ an táng là lễ chôn cất ở nghĩa trang." : den() === 'orth' ? "Một linh mục xông hương và cử hành lễ tang theo nghi thức Chính thống giáo, rồi người đã khuất được an táng ở nghĩa trang." : "Sau lễ tang là lễ chôn cất ở nghĩa trang.";
  return "Gia đình và bạn bè tụ họp để làm tang lễ.";
}
function selfFuneralLine(age) {
  const w = (S.deathAt && S.deathAt.where) || S.cur, r = funRel(), p = (CBY[w] || C()).p;
  if (age < 5) return "Trước chiếc quan tài nhỏ, gia đình mãi không nỡ rời đi.";
  if (w === 'KOR') return "Gia đình tiếp khách đến viếng ở nhà tang lễ suốt ba ngày. Trước di ảnh của bạn là những bông cúc trắng.";
  if (w === 'JPN') return "Gia đình làm đêm canh thức (tsuya) và lễ tiễn biệt, rồi bạn được hỏa táng.";
  if (r === 'M') return "Theo phong tục Hồi giáo, bạn được quấn vải trắng và an táng trước khi mặt trời lặn ngay trong ngày.";
  if (r === 'H') return "Theo phong tục, bạn được hỏa táng, tro được thả xuống dòng sông.";
  if (r === 'S') return "Theo phong tục, bạn được hỏa táng, và gia đình quây quần đọc kinh.";
  if (r === 'J') return "Sau tang lễ, gia đình giữ shiva (thời gian để tang) suốt một tuần.";
  if (['CHN', 'TWN', 'VNM', 'HKG', 'SGP', 'PRK'].includes(w)) return "Gia đình mặc tang phục trắng trong tang lễ, và hẹn năm nào cũng đến viếng mộ bạn.";
  if (r === 'B') return "Bạn được hỏa táng trong tiếng tụng kinh của các nhà sư.";
  if (p === 'ssa' && r === 'C') return den() === 'cath' ? "Thánh lễ an táng được cử hành ở nhà thờ, và bạn được chôn cất ở nghĩa trang. Suốt mấy ngày, cả xóm cùng hát tiễn bạn đoạn đường cuối." : "Lễ tang được tổ chức ở nhà thờ, và bạn được an táng ở nghĩa trang. Suốt mấy ngày, cả xóm cùng hát tiễn bạn đoạn đường cuối.";
  if (p === 'ssa') return "Cả xóm tụ họp, hát suốt mấy ngày để tiễn bạn đoạn đường cuối.";
  if (r === 'C') return den() === 'cath' ? "Thánh lễ an táng được cử hành, và bạn được chôn cất ở nghĩa trang." : den() === 'orth' ? "Linh mục xông hương và cử hành lễ tang theo nghi thức Chính thống giáo, rồi bạn được an táng tại nghĩa trang." : "Một buổi lễ tang được cử hành, rồi bạn được an táng tại nghĩa trang.";
  return "Gia đình và bạn bè tụ họp để làm tang lễ.";
}
function funeral(parent, label, who) {
  const fa = parent ? 'loss:par' : 'loss:gp';
  if (S.age < 6) return;
  if (S.job === 'prison') { logA(fa, S.flags.nkCamp ? L`갇혀 있어 ${label}의 장례에 가지 못했습니다. 풀려난 뒤에야 소식을 들었습니다.` : L`교도소에 있어 ${label}의 장례에 가지 못했습니다. 면회 온 가족에게서 소식을 들었습니다.`, 'note'); return; }
  if (farFromNK()) { logA(fa, L`북에 남은 ${label}의 부고를 몇 달 뒤에야 브로커를 통해 전해 들었습니다. 장례에는 갈 수 없었습니다.`, 'note'); return; }
  if (rohAway() && !(parent && famCame())) { logA(fa, L`라카인에 남은 ${label}의 부고를 전화로 전해 들었습니다. 국경을 넘어 장례에 갈 수는 없었습니다.`, 'note'); return; }
  const away = S.cur !== S.born && !(parent && (famCame() || S.flags.parCame != null || (who && S.flags.careHome === who)));
  if (away && S.flags.irreg != null) { logA(fa, S.flags.funIrr ? "Vì ở quá xa, bạn không thể về dự đám tang. Bạn chỉ có thể nói lời từ biệt từ nơi xa." : L`머물 허가가 없어 한번 나가면 돌아올 수 없었습니다. ${label}의 장례에 가지 못하고 먼 곳에서 마지막 인사를 했습니다.`, 'note'); S.flags.funIrr = 1; return; }
  if (away && chance(lowInc(C()) || S.refugee ? 0.75 : 0.35)) { logA(fa, "Vì ở quá xa, bạn không thể về dự đám tang. Bạn chỉ có thể nói lời từ biệt từ nơi xa.", 'note'); return; }
  const key = parent ? 'funP' : 'funG', first = !S.flags[key]; S.flags[key] = 1;
  let t = away ? L`서둘러 ${ro(B().ko)} 돌아갔습니다.` + ' ' : '';
  if (first) t += funeralLine();
  else if (parent) t += "Giờ đây cả bố lẫn mẹ đều không còn bên bạn nữa.";
  else t += S.age < 13 ? "Bạn lặng nhìn người lớn khóc rất lâu." : varied('fun', [L`가족이 모두 모여 ${eul(label)} 보내 드렸습니다.`, L`${label}의 장례식에서 오랜만에 친척들을 만났습니다.`, L`${label}의 손때 묻은 물건들을 정리했습니다.`]);
  if (parent && S.age >= 20 && !ddKept()) {
    const cost = incomeAt(B(), 0.5) * ({ hi: 0.12, eca: 0.15, lac: 0.18, eap: 0.18, mena: 0.08, sa: 0.12, ssa: 0.35 }[B().p] || 0.15) / (1 + 0.7 * Math.min(4, sibN()));
    if (cost > 0) { eff({ money: -cost }); book("Chi phí tang lễ", -cost); t += ' ' + (sibN() ? L`형제자매와 장례비를 나눠 냈습니다. (−${wonStr(cost)})` : L`장례비를 냈습니다. (−${wonStr(cost)})`); }
  }
  logA(fa, t, 'note');
}
const ESTATE = [0, 0.5, 1.5, 4, 8, 18];
const EST_TAX = { KOR: 0.35, JPN: 0.35, FRA: 0.3, BEL: 0.3, GBR: 0.25, IRL: 0.25, USA: 0.2, DEU: 0.2, ESP: 0.2, NLD: 0.2, CHL: 0.15, FIN: 0.15, DNK: 0.15, TWN: 0.1, PHL: 0.06, POL: 0.05, THA: 0.05, ITA: 0.04, CHE: 0.03 };
const PHOME_K = [0, 0.5, 0.65, 0.8, 1, 1.4];
function parentHomeValue() { const b = B(), u = S.bornUrban != null ? S.bornUrban : S.urban; return incomeAt(b, 0.5) * (b.p === 'hi' ? 5.5 : 5) * (u ? 1.4 : 0.7) * (HOUSE_K[b.id] || 1) * PHOME_K[S.q]; }
function inherit() {
  if (S.flags.inherit || S.age < 18) return; S.flags.inherit = 1;
  if (farFromNK()) return;
  const b = B(), hiP = b.p === 'hi' || b.p === 'eca';
  if (S.flags.rich && S.flags.richQ) {
    const gross = wealthAt(b, S.flags.richQ) * (0.6 + 0.6 * rnd()) * (S.flags.richGift ? 0.85 : 1) / (1 + Math.min(6, sibN())), tax = gross * (EST_TAX[b.id] || 0), amt = gross - tax;
    eff({ money: amt }); book("Thừa kế", amt); if (S.fam.married) S.flags.sepM = (S.flags.sepM || 0) + amt;
    log((sibN() ? L`부모님이 일군 큰 재산을 형제자매와 나눠 물려받았습니다. (+${wonStr(amt)})` : L`부모님이 일군 큰 재산을 물려받았습니다. (+${wonStr(amt)})`) + (tax > 0 ? ' ' + L`상속세로 ${wonStr(tax)}을 냈습니다.` : ''), 'note');
    return;
  }
  if (!chance([0, 0.08, 0.2, 0.4, 0.6, 0.85][S.q] * (hiP ? 1 : 0.7))) return;
  const home = S.q >= 3 && parentHome() === 'own', med = incomeAt(b, 0.5), save = med * ESTATE[S.q] * (hiP ? 1 : 0.6);
  const amt = (home ? parentHomeValue() + save * 0.4 : save) * (0.5 + rnd()) / (1 + 0.8 * Math.min(4, sibN()));
  eff({ money: amt }); book("Thừa kế", amt); if (S.fam.married) S.flags.sepM = (S.flags.sepM || 0) + amt;
  log(sibN() ? (home ? L`부모님이 살던 집과 모은 재산을 형제자매와 나눠 물려받았습니다. (+${wonStr(amt)})` : L`부모님이 남긴 재산을 형제자매와 나눠 물려받았습니다. (+${wonStr(amt)})`)
    : (home ? L`부모님이 살던 집과 모은 재산을 물려받았습니다. (+${wonStr(amt)})` : L`부모님이 남긴 재산을 물려받았습니다. (+${wonStr(amt)})`), 'note');
}
function gpInherit(g) {
  if (S.age < 16 || farFromNK()) return;
  const f = S.fam; if ((f.gp || []).some(x => x.side === g.side && x.alive)) return;
  const b = B(), hiP = b.p === 'hi' || b.p === 'eca', par = g.side === 'm' ? f.mom : f.dad;
  if (!par.alive && !(g.side === 'f' && f.dad.absent)) {
    if (!chance([0, 0.08, 0.2, 0.4, 0.6, 0.85][S.q] * (hiP ? 1 : 0.7))) return;
    const amt = incomeAt(b, 0.5) * ESTATE[S.q] * (hiP ? 1 : 0.6) * (0.5 + rnd()) / (b.tfr > 3 ? 4 : 2.5) / (1 + 0.8 * Math.min(4, sibN()));
    eff({ money: amt }); book("Thừa kế", amt); if (S.fam.married) S.flags.sepM = (S.flags.sepM || 0) + amt;
    log(g.side === 'm' ? L`외가에서 남긴 재산 가운데 먼저 떠난 어머니의 몫을 물려받았습니다. (+${wonStr(amt)})` : L`친가에서 남긴 재산 가운데 먼저 떠난 아버지의 몫을 물려받았습니다. (+${wonStr(amt)})`, 'note');
    return;
  }
  if (S.age >= 18 && chance(0.12 * (S.q >= 4 ? 1.5 : 1))) {
    const amt = incomeAt(b, 0.5) * (0.02 + 0.06 * rnd()) * (S.q / 3);
    eff({ money: amt }); book("Thừa kế", amt); if (S.fam.married) S.flags.sepM = (S.flags.sepM || 0) + amt;
    log(L`${gpLabel(g)}께서 손주들 몫으로 조금씩 모아 두신 돈을 받았습니다. (+${wonStr(amt)})`, 'note');
  }
}
const RAISED_KIN = (side, sex) => side === 'm' ? (sex === 'F' ? "dì" : "cậu") : (sex === 'F' ? "cô" : "chú");
function raisedWord(r) { return r.k === 'gp' ? gpLabel(r) : r.k === 'kin' ? RAISED_KIN(r.side, r.sex) : r.k === 'foster' ? "gia đình nhận nuôi tạm thời" : "mái ấm"; }
const raisedHere = () => { const r = S.flags.raised; return !!r && S.age < 18 && withParents() && !(r.k === 'gp' && !(S.fam.gp || []).some(g => g.alive && g.side === r.side && g.sex === r.sex)); };
const carerW = () => { const r = S.flags.raised; if (!r || !raisedHere()) return parW(); return r.k === 'foster' ? "bố mẹ nuôi tạm thời" : r.k === 'home' ? "các cô chú ở mái ấm" : raisedWord(r); };
function orphanCare(again) {
  const f = S.fam; if (S.age >= 16 || S.fam.married || !withParents() || (!again && S.flags.raised)) return;
  if (f.mom.alive || (f.dad.alive && !f.dad.absent)) return;
  const b = B(), gps = (f.gp || []).filter(g => g.alive && g.age < 85 && !(g.side === 'f' && f.dad.absent));
  let r;
  if (gps.length && chance(0.75)) { const g = gps.find(x => x.sex === 'F') || gps[0]; r = { k: 'gp', sex: g.sex, side: g.side, age: g.age }; }
  else if (chance(b.ppp >= 20000 ? 0.6 : 0.9)) { const par = f.mom.age ? f.mom : f.dad; r = { k: 'kin', sex: chance(0.6) ? 'F' : 'M', side: f.dad.absent ? 'm' : chance(0.5) ? 'm' : 'f', age: Math.max(22, (par.age || 35) + ri(-8, 6)) }; }
  else r = { k: fosterLand(b) ? 'foster' : 'home', sex: 'F', age: ri(35, 55) };
  r.at = S.age; S.flags.raised = r; eff({ so: 2 });
  const w = raisedWord(r);
  log(r.k === 'gp' ? L`이제 ${w} 댁에서 자라게 되었습니다.` : r.k === 'kin' ? L`이제 ${w} 댁에서 사촌들과 함께 자라게 되었습니다.` : r.k === 'foster' ? "Từ đây, bạn lớn lên trong một gia đình nhận nuôi tạm thời." : "Từ đây, bạn lớn lên ở mái ấm.",
    'ev', "Trẻ mất cả bố lẫn mẹ thường được ông bà hoặc họ hàng nuôi nấng. Ở châu Phi hạ Sahara, gần chín trên mười em lớn lên trong nhà họ hàng (UNICEF)");
}
function familyYear() {
  const c = C(), f = S.fam;
  sibDeathYear(); sibLeaveYear(); hadanaYear();
  let parentDied = false;
  for (const g of f.gp || []) {
    if (!g.alive) continue; g.age++;
    if (!chance(lifeTable(B(), g.sex).q[Math.min(110, g.age)] * 1.15)) continue;
    g.alive = false;
    const R = S.flags.raised, carer = !!R && R.k === 'gp' && R.side === g.side && R.sex === g.sex, carerGone = () => { if (R.fc && S.age < 18) fcCarerGone(); else if (S.age < 16) orphanCare(true); };
    if (S.age < 4 || (g.side === 'f' && f.dad.absent)) { if (carer) carerGone(); continue; }
    const label = gpLabel(g), cause = pickCause(B(), g.age, g.sex, true);
    logA('loss:gp', L`${label}가 ${g.age}세로 세상을 떠났습니다. (${causeLabel(cause, g.age, g.sex)})`, 'loss');
    eff({ h: S.age < 25 ? -6 : -4, so: -2 }); S.yearMark = S.yearMark || 'loss'; if (S.age >= 6) { grieve('gp', label); const gq = S.flags.grief.slice(-1)[0]; if (gq && griefFar(null)) gq.far = 1; }
    if (cause === 'suic') suicLoss('gp', label);
    funeral(false, label); gpInherit(g);
    if (carer) carerGone();
  }
  for (const [key, label] of [['mom', "mẹ"], ['dad', "bố"]]) {
    const p = f[key]; if (!p.alive) continue; p.age++;
    const lt = lifeTable(B(), key === 'mom' ? 'F' : 'M');
    const pk = eraParK(p);
    if (chance(lt.q[Math.min(110, p.age)] * (S.q <= 2 && lowInc(B()) ? 1.25 : 1) * (S.flags.parentCare >= S.age ? 0.8 : 1) * (p.hiv ? hivMult(p.hiv, S.age) : 1) * pk)) {
      p.alive = false; p.diedAt = S.age;
      if (p.absent) {
        if (p.met != null) { logA('loss:par', L`다시 만났던 아버지가 ${p.age}세로 세상을 떠났습니다. 늦게라도 만나서 다행이었습니다.`, 'loss'); eff({ h: -5 }); }
        else if (S.age >= 10 && chance(0.6)) { logA('mem:par', L`함께 살지 않았던 아버지가 ${p.age}세로 세상을 떠났다는 소식을 들었습니다.`, 'loss'); eff({ h: -3 }); }
        continue;
      }
      const pol = pk > 1 && chance(1 - 1 / pk);
      const cause = pol ? 'pol' : p.hiv ? pickCauseFor(B(), p.age, key === 'mom' ? 'F' : 'M', p.hiv) : pickCause(B(), p.age, key === 'mom' ? 'F' : 'M', true);
      p.dc = cause;
      if (!pol) adDie(B(), cause, p.age, label);
      logA('loss:par', L`${label}가 ${p.age}세로 세상을 떠났습니다. (${pol ? eraParWhy() : causeLabel(cause, p.age, key === 'mom' ? 'F' : 'M')})`, 'loss');
      if (cause === 'suic') { if (S.age >= 5) grieve('par', label); suicLoss('par', label); }
      if (S.flags.thanksLater && !S.flags.saidThanks) { S.flags.saidThanks = 1; logA('mem:par', "Giá như hồi đó bạn đã nói lời cảm ơn.", 'note'); }
      eff({ h: -12, so: -6 }); S.yearMark = 'loss'; if (S.age >= 5 && cause !== 'suic') grieve('par', label);
      { const gq = (S.flags.grief || []).slice(-1)[0]; if (gq && gq.r === 'par' && gq.n === label && griefFar(key)) gq.far = 1; }
      if (S.age < 18) S.flags.orphan = (S.flags.orphan || 0) + 1;
      if (S.age < 15 && key === 'dad' && lowInc(B())) { S.q = Math.max(1, S.q - 1); }
      funeral(true, label, key); parentDied = true;
      if (key === 'dad') afterDad(f);
      const bc = S.flags.bcare;
      if (bc && bc.k === 'gp' && bc.who !== 'inlaw' && !f.mom.alive && !(f.dad.alive && !f.dad.absent)) {
        S.flags.bcare = null; const ya = youngestAge();
        if (ya < 6) { const yi = f.kids.findIndex(k => k.alive && !k.away && !k.sk && S.age - k.bornAt === ya); if (yi >= 0 && isWorking()) { S.flags.careQ = yi; S.flags.careAgain = 1; } }
      }
    }
  }
  if (parentDied && !f.mom.alive && (!f.dad.alive || f.dad.absent)) { inherit(); orphanCare(); }
  else if (S.age === 18 && !S.flags.inherit && !f.mom.alive && (!f.dad.alive || f.dad.absent)) inherit();
  const stp = f.step;
  if (stp && stp.alive) {
    stp.age++;
    if (chance(lifeTable(B(), 'M').q[Math.min(110, stp.age)])) {
      stp.alive = false; stp.diedAt = S.age;
      if (S.age >= 4) {
        const cause = pickCause(B(), stp.age, 'M', true);
        logA('loss:par', L`새아버지가 ${stp.age}세로 세상을 떠났습니다. (${causeLabel(cause, stp.age, 'M')})`, 'loss');
        if (cause === 'suic') suicLoss('step', "bố dượng");
        eff({ h: -8, so: -4 }); S.yearMark = S.yearMark || 'loss'; funeral(false, "bố dượng");
      }
    }
  }
  if (f.partner && f.partner.alive && !f.partner.divorced) {
    f.partner.age++;
    const PH = f.partner.hiv, P = f.partner, ill = P.ill, PC = P.lb && CBY[P.lbIn] ? CBY[P.lbIn] : C();
    if (ill || P.mobD || chance(lifeTable(PC, P.sex).q[Math.min(110, P.age)] * (PH ? hivMult(PH, S.age) : 1 - hivShare(PC, P.age, P.sex)))) {
      const cause = P.mobD ? 'war' : ill ? ill.c : pickCauseFor(PC, P.age, P.sex, PH), label = ill && !P.mobD ? ill.l : causeLabel(cause, P.age, P.sex);
      if (!ill && LONG_ILL.includes(cause)) partnerIll(c, cause, label);
      else {
        if (ill) { const m = spouseCare(c), far = P.lb && CBY[P.lbIn] ? CBY[P.lbIn].ko : ''; eff({ money: -m }); book("Chi phí chữa bệnh cho bạn đời", -m);
          logA('hosp:pt', !far ? L`배우자 ${eul(callName(P.name))} 마지막까지 곁에서 돌보았습니다. (−${wonStr(m)})` : tripOutOK() ? L`${far}에서 투병하던 배우자 ${eul(callName(P.name))} 마지막 몇 주 곁에서 돌보았습니다. (−${wonStr(m)})` : L`${far}에서 투병하던 배우자 ${callName(P.name)}의 치료비를 끝까지 보냈지만, 곁을 지키지는 못했습니다. (−${wonStr(m)})`, 'bad'); }
        P.alive = false; P.ill = null; P.endAt = S.age; P.dc = cause;
        adDie(PC, cause, P.age, callName(P.name), 1);
        logA('loss:pt', L`배우자 ${iga(callName(P.name))} ${P.age}세로 세상을 떠났습니다. (${label})`, 'loss');
        if (cause === 'hiv' && PH && !PH.known) revealPartnerHiv(true);
        eff({ h: -18, so: -12 }); S.yearMark = 'loss'; f.married = false; f.widowed = true; f.co = null; grieve('pt', callName(P.name)); if (S.flags.ipv === 'on') S.flags.ipv = 'over'; S.flags.stepAt = null;
        if (cause === 'suic') { const e = S.log.filter(x => x.kind === 'loss').pop(); if (e) e.d = 'suic'; suicLoss('pt', callName(P.name)); }
        spouseFuneral(c);
        if (P.lb) famWidow();
        skWidow(c, P);
        homemakerAlone(true);
        widowHome(c);
        if (f.wife2 && f.wife2.alive) log(promoteWife2(c));
      }
    } else if (f.married && chance(divorceRisk(c))) {
      const got = S.flags.mfix != null && S.flags.mcrisisAt != null && S.flags.mfix >= S.flags.mcrisisAt;
      if (S.flags.mcrisisAt == null || S.age - S.flags.mcrisisAt > 3 || got) { S.flags.mcrisisQ = 1; S.flags.mcAgain = got && S.age - S.flags.mcrisisAt <= 3 ? 1 : 0; S.flags.mcrisisAt = S.age; partnerYear(c); }
      else divorceNow(c, true);
    } else if (f.married) partnerYear(c);
  }
  for (const k of f.kids) {
    if (!k.alive) continue;
    const ka = S.age - k.bornAt;
    if (k.lostAt != null && !k.away && !k.grown) k.lostAt = null;
    if (k.lostAt === S.age) log(L`${wa(callName(k.name))}는 만나는 날이 점점 줄더니, 어느새 한 해가 다 가도록 얼굴을 보지 못했습니다.`, 'bad', NR_LOST[k.lostC] ? NR_LOST[k.lostC][1]() : null);
    if (kidPrivOf(k) && ka >= 6 && ka < 18) k.priv = 1;
    if (ka === 19 && !k.path && kidInPr(k)) k.path = 'work';
    if (ka === 18 && !k.path && !S.isComp && !kidInPr(k)) {
      const p = rohUniShut() || ddKidUni(k) === 0 ? 0 : kidUniP(k);
      if (chance(p)) { if (kidNotOurs(k) || nkCut(k)) { k.path = 'uni'; kidUniWed(k); if (!nkCut(k)) log(L`${iga(callName(k.name))} 대학에 들어갔다는 소식을 들었습니다.`); } else { k.path = 'pending'; kidUniWed(k); (S.flags.kidUniQ = S.flags.kidUniQ || []).push(f.kids.indexOf(k)); } }
    }
    if (ka === 19 && !k.path && k.dd && k.dd.lv >= 2) { k.path = 'work'; if (k.dd.sch === 'sp' && !k.away) log(L`${iga(callName(k.name))} 특수학교를 마쳤습니다.`); }
    if (ka === 19 && !k.path) {
      const p = rohUniShut() || ddKidUni(k) === 0 ? 0 : kidUniP(k);
      k.path = chance(p) ? 'uni' : 'work'; if (k.path === 'uni') kidUniWed(k);
      if (!nkCut(k)) log(k.path === 'uni' ? L`${iga(callName(k.name))} 대학에 합격했습니다.` : kidBanned(k) ? L`${iga(callName(k.name))} 열두 살 이후로는 학교에 다닐 수 없었습니다. 집안일을 도우며 지냅니다.` : S.edu >= 4 && S.q >= 3 && chance(0.4) ? L`${iga(callName(k.name))} 대학 대신 바로 일을 하겠다고 했습니다. 서운한 마음을 접고 응원하기로 했습니다.` : L`${iga(callName(k.name))} 학교를 마치고 일을 시작했습니다.`, k.path === 'uni' ? 'big' : 'ev', k.tutor ? L`학원·과외 ${k.tutor}년을 지원했습니다` : null);
      eff({ h: k.path === 'uni' ? 5 : 1 });
    }
    if (k.path && k.path !== 'pending' && !k.job && ka >= (k.path === 'uni' ? 23 : 20) && !S.isComp && !kidWd(k, ka) && !kidInPr(k)) kidLife(k, c, ka);
    const klt = lifeTable(C(), k.sex);
    const kq = ka < 15 ? kidHomeQ(c) : 3, mult = kidMortK(c, ka, kq) * ddMortK(k.dd, ka);
    const kh = k.hiv ? (k.hiv.art ? (ka < 5 ? 2 : 1.5) : (ka < 5 ? 8 : 4)) : 1 - hivShare(C(), ka, k.sex);
    if (k.mobD || chance(klt.q[Math.min(110, ka)] * mult * kh)) {
      k.alive = false; S.stats.kidsLost++;
      let cause = k.mobD ? 'war' : k.hiv ? (chance(k.hiv.art ? 0.3 : 0.7) ? 'hiv' : pickCauseFor(C(), ka, k.sex, null, kq, k.dd)) : pickCauseFor(C(), ka, k.sex, null, kq, k.dd);
      { const same = new Set(f.kids.filter(x => x !== k && !x.alive && x.dA != null && x.bornAt + x.dA === S.age).map(x => x.dC));
        for (let t = 0; t < 4 && same.has(cause) && cause !== 'war' && cause !== 'hiv'; t++) cause = pickCauseFor(C(), ka, k.sex, null, kq, k.dd); }
      k.dA = ka; k.dC = cause; k.dL = causeLabel(cause, ka, k.sex);
      if (cause === 'hiv' && !k.hiv.known) S.flags.kidHivDeath = 1;
      const kn = callName(k.name), skW = k.sk ? (k.exOf || k.cut != null ? "con của bạn đời cũ" : "con của bạn đời") : null;
      logA('loss:kid', skW ? L`${skW} ${iga(kn)} ${ka}세에 세상을 떠났습니다. (${k.dL})` : ka < 1 ? L`아이 ${iga(kn)} 첫돌을 맞지 못하고 세상을 떠났습니다. (${k.dL})` : ka >= 20 ? L`자녀 ${iga(kn)} ${ka}세에 세상을 떠났습니다. (${k.dL})` : L`아이 ${iga(kn)} ${ka}살에 세상을 떠났습니다. (${k.dL})`, 'loss', ka < 5 ? L`${c.ko}의 5세 미만 사망률: 출생아 1,000명당 ${c.u5}명 (UN IGME)` : null);
      eff({ h: -22, so: -6 }); S.yearMark = 'loss'; grieve('kid', callName(k.name));
      { const gq = (S.flags.grief || []).slice(-1)[0]; if (gq && gq.r === 'kid') gq.ka = ka; }
      if (cause === 'suic') suicLoss('kid', callName(k.name));
      else if (ka >= 18 && !S.isComp) kidGrief(k, ka);
      kidOrphans(k);
    }
  }
  descendantsYear();
  familyNews(c);
  datingYear();
  polyYear(c);
  homeYear(true);
  const SIB_GAP1 = 0.12, SIB_GAP2 = 0.4;
  const lastSib = f.lastSib != null ? f.lastSib : (f.sibBorn ? S.age - 2 : 0), sibGap = S.age - lastSib;
  const sibYs = [0].concat((f.sibAt || []).map(x => Array.isArray(x) ? x[0] : null).filter(x => x != null)), sibNear = sibYs.length >= 2 && sibYs[sibYs.length - 1] - sibYs[sibYs.length - 2] === 1;
  if (f.momRe != null && S.age >= f.momRe && f.mom.alive && !f.step) {
    f.step = { age: clamp(f.mom.age + Math.round(coupleGap(B()) + (rnd() - 0.5) * 6), f.mom.age - 3, f.mom.age + 14), alive: true, at: S.age };
    if (S.age === f.momRe) log(homeOthers().step ? "Mẹ tái hôn, và bố dượng về sống cùng gia đình bạn." : "Mẹ bạn đã tái hôn.", 'note');
  }
  const re = f.momRe != null && S.age >= f.momRe, posth = f.posth && !f.dad.alive;
  if (f.younger > f.sibBorn && S.age < 22 && f.mom.alive && f.mom.age < 45 && ((f.dad.alive && !f.dad.absent) || posth || re) && chance(posth ? 1 : sibGap < 1 ? 0 : sibGap === 1 ? (sibNear ? 0 : SIB_GAP1) : sibGap === 2 ? SIB_GAP2 : 0.45)) {
    if (!posth && !chance(sibPolicyK(f.older + f.sibBorn + 2, calYr()))) { f.younger = f.sibBorn; return; }
    f.lastSib = S.age;
    const boy = chance(0.512), at = f.sibAt || (f.sibAt = Array(f.sibBorn).fill(0)), sx = boy ? 'M' : 'F';
    if (posth) { f.posth = 0; f.sibBorn++; at.push([S.age, sx]); log(boy ? "Vài tháng sau khi bố mất, em trai bạn chào đời." : "Vài tháng sau khi bố mất, em gái bạn chào đời.", 'note'); eff({ so: 2 }); }
    else if (!f.dad.alive) { f.sibBorn++; at.push([S.age, sx]); log(boy ? "Em trai bạn, con của mẹ và bố dượng, đã chào đời." : "Em gái bạn, con của mẹ và bố dượng, đã chào đời."); eff({ so: 2 }); }
    else if (f.younger - f.sibBorn >= 2 && chance(c.p === 'ssa' ? 0.028 : 0.014)) { f.sibBorn += 2; at.push([S.age, sx], [S.age, chance(0.6) ? sx : (boy ? 'F' : 'M')]); log("Một cặp em sinh đôi đã chào đời."); eff({ so: 3 }); }
    else { f.sibBorn++; at.push([S.age, sx]); log(L`${boy ? "em trai" : "em gái"}이 태어났습니다.`); eff({ so: 2 }); }
  }
}
function afterDad(f) {
  if (S.age >= 22 || !f.mom.alive) return;
  { const c = B(), m = MOM_WORK[c.p] || 0.5, so = SOLO_MOM_WORK[c.p] || m;
    if (f.mom.job === 'homemaker' && S.age < 18 && f.mom.age < 60 && withParents() && !raisedHere() && !parInPr('mom') && chance((so - m) / (1 - m))) {
      f.mom.job = parJobPick('F', f.mom.age, clamp((S.q - 0.5) / 5 - 0.05, 0.02, 0.97)); log("Mẹ bắt đầu đi làm để lo cho gia đình.", 'note'); } }
  const left = Math.max(0, f.younger - f.sibBorn);
  const lastSib = f.lastSib != null ? f.lastSib : (f.sibBorn ? S.age - 2 : 0), gap = S.age - lastSib;
  f.posth = left > 0 && f.mom.age < 45 && chance(gap < 1 ? 0 : gap === 1 ? 0.15 : 0.3) ? 1 : 0;
  const reP = S.age < 16 && f.mom.age < 40 ? (f.mom.age < 35 ? 1 : 0.5) * ({ ssa: 0.6, lac: 0.45, hi: 0.35, eca: 0.35, mena: 0.35, eap: 0.3, sa: 0.1 }[B().p] || 0.3) : 0;
  f.momRe = chance(reP) ? S.age + ri(1, 4) : null;
  f.younger = f.sibBorn + f.posth + (f.momRe != null ? Math.min(left - f.posth, ri(0, 2)) : 0);
}
const pBase = (q, sex, same) => { const b = clamp(q / 5 - 0.1, 0.05, 0.95); if (same) return b; const c = C(); return clamp(pctOfIncome(c, incomeAt(c, b) * payGapSexK(c, sex)), 0.05, 0.95); };
const P_AGE = a => a < 25 ? -0.12 : a < 35 ? -0.06 : a < 45 ? 0.02 : a < 55 ? 0.05 : 0.02;
const LICENSED = new Set(['doctor', 'lawyer', 'nurse', 'healthtech', 'prof', 'pilot']);
const CAND_DEG = { love: 0.78, mx: 0.88 };
function partnerJobFor(P, c) {
  const pct = clamp(P.base + P_AGE(P.age) + (P.dev || 0) - (P.mp || 0), 0.01, 0.99), w = {};
  let best = 'clerk', bd = 9;
  for (const id in JOBS) {
    const j = JOBS[id]; if (j.special || j.rare || !JOB_AV[id]) continue;
    if (P.deg === false && j.e >= 4) continue;
    if (P.dd && (j.e > 2 || DD_NOJOB.has(id))) continue;
    if (P.top && (GRAD_RARE.has(id) || TOP_NO.has(id))) continue;
    if (P.uni && (GRAD_RARE.has(id) || j.s === 'agr' && id !== 'agbiz')) continue;
    if (j.only && !j.only.split(',').some(x => x === c.p || x === c.id)) continue;
    if (j.net && !eraNetOK(j, c)) continue; if (j.rich && c.ppp < 25000) continue; if (!eraJobK(id, c)) continue; if (P.fam && ethNoJob(id)) continue;
    if (P.prev && id !== P.prev && LICENSED.has(id)) continue;
    if (P.age != null && (j.e >= 5 ? P.age < 26 : j.e >= 4 ? P.age < 22 : false)) continue;
    const [lo, hi] = jobRange(id, c, P.uni ? 'o' : 'e'), d = pct < lo ? lo - pct : pct > hi ? pct - hi : 0;
    if (d < bd) { bd = d; best = id; }
    if (d > (P.top ? 0.06 : 0.03)) continue;
    let x = JOB_AV[id] * (j.s === 'agr' ? 1 + c.agr / 20 : 1) * (P.uni && j.e >= 4 ? 3 : 1) * (P.fam ? casteLand(id) : 1);
    if (P.uni) { const gp = 4 - (j.e || 0); x *= gp <= 0 ? 2.2 : gp === 1 ? 1.4 : gp === 2 ? 0.7 : 0.35; if (GRAD_MAN.has(id)) x *= 0.35; }
    if (j.fem) x *= P.sex === 'F' ? j.fem : 1 / (j.fem * 1.5);
    if (j.male) x *= P.sex === 'M' ? j.male : 1 / (j.male * 2);
    if (j.u === 1) x *= S.urban ? 1.6 : 0.5; else if (j.u === -1) x *= S.urban ? 0.1 : 2;
    const u = clamp(hi > lo ? (pct - lo) / (hi - lo) : 0.5, 0, 1); x *= 0.5 + Math.min(1, 2 * Math.min(u, 1 - u));
    if (P.prev) x *= id === P.prev ? 6 : JOB_FAM[id] && JOB_FAM[id] === JOB_FAM[P.prev] ? 2.5 : 1;
    w[id] = x;
  }
  return Object.keys(w).length ? wpick(w) : best;
}
function partnerWork(P) {
  const c = C();
  if (P.ret) return { t: "nghỉ hưu", m: P.inc > 0 ? L`연금 월 ${wonStr(P.inc / 12)}` : '' };
  if (P.ill) return { t: "đang điều trị bệnh", m: '' };
  if (P.age < 18) return { t: "đang đi học", m: '' };
  if (P.out > 0) return { t: P.hm ? "tạm nghỉ ở nhà chăm con" : "đang tìm việc", m: '' };
  if (!P.job || !JOBS[P.job]) P.job = partnerJobFor(P, c);
  const home = P.k < 0.5 && P.sex === 'F';
  const t = home ? "việc nhà và thỉnh thoảng làm thêm" : JOBS[P.job].n + (P.penOk === 0 && P.age >= retireAge(c) + 2 ? ' · ' + "không có lương hưu, vẫn đi làm" : '');
  return { t, m: P.inc > 0 ? L`월 ${wonStr(P.inc / 12)}` : '' };
}
const PRO_HRS = new Set(['doctor', 'lawyer', 'prof', 'engineer', 'dev', 'finance', 'pilot']), PRO_HK = 0.9;
const partnerK = P => P.k >= 0.5 && P.k < PRO_HK && P.sex === 'F' && PRO_HRS.has(P.job) ? PRO_HK : P.k;
function partnerPay(P) {
  const c = P.lb && CBY[P.lbIn] ? CBY[P.lbIn] : C();
  return incomeAt(c, clamp(Math.min(P.base + P_AGE(P.age) + (P.dev || 0) - (P.mp || 0), rohCamp() ? ROH_PCT : 1), 0.01, 0.99)) * partnerK(P) * (S.sex === 'M' && !P.ss && ddAutKid() ? DD_MOM : 1);
}
const LONG_ILL = ['can', 'copd', 'kid', 'cir', 'dem', 'tb', 'dia'];
const AD_LAW = {
  NLD: { from: 2002, yr: 2025, s: 0.06, src: 'RTE 2025' },
  BEL: { from: 2002, yr: 2025, s: 0.04, src: 'FCEE 2025' },
  CAN: { from: 2016, yr: 2024, s: 0.051, src: 'Health Canada 2025' },
  CHE: { from: 1999, fy: 1942, yr: 2023, s: 0.024, src: 'FSO 2024' },
  LUX: { from: 2009, yr: 2024, s: 0.008, src: 'Commission nationale de contrôle 2025' },
  NZL: { from: 2022, fy: 2021, yr: 2025, s: 0.013, src: 'NZ Ministry of Health 2026' },
  AUS: { from: 2019, yr: 2025, s: 0.018, st: 1, src: 'state VAD review boards 2024-25' },
  ESP: { from: 2021, yr: 2024, s: 0.001, src: 'Ministerio de Sanidad 2025' },
  AUT: { from: 2022, yr: 2024, s: 0.0013, src: 'Statistik Austria 2025' },
  USA: { from: 1998, fy: 1997, yr: 2025, s: 0.0009, st: 1, src: 'state reports 2024-25' }
};
const AD_ELIG = new Set(['can', 'copd', 'kid', 'cir', 'dia', 'ihd', 'ocd']), AD_ELIG_F = 0.73;
const adShare = (c, yr) => { const A = AD_LAW[c.id]; return !A || yr < A.from ? 0 : A.s * Math.min(1, (yr - A.from + 1) / (A.yr - A.from + 1)); };
const adShow = () => !AGE12 && !!S && S.age >= 15 && !HOOK.calm();
function adDie(c, cause, age, who, pt) {
  if (!adShow() || age < 18 || !AD_ELIG.has(cause) || !chance(Math.min(0.5, adShare(c, calYr()) / AD_ELIG_F))) return;
  const A = AD_LAW[c.id], cn = c.ko, pct = A.s >= 0.0095 ? +(A.s * 100).toFixed(1) : +(A.s * 100).toFixed(2);
  const t = (pt ? L`병이 깊어지자 배우자 ${eun(who)} ${cn}의 법에 따라 의사의 도움을 받아 마지막 날을 스스로 정했습니다.` : L`병이 깊어지자 ${eun(who)} ${cn}의 법에 따라 의사의 도움을 받아 마지막 날을 스스로 정했습니다.`)
    + ' ' + pick(["Mỗi người trong gia đình nghĩ một khác, nhưng hôm ấy tất cả đều ở bên.", "Cả gia đình đã trò chuyện rất lâu về quyết định ấy." + ' ' + "Vào ngày cuối cùng, mọi người đều nắm tay nhau.", "Quyết định ấy đúng hay không, đến giờ vẫn còn là một câu hỏi trong lòng bạn."]);
  const fact = A.st ? L`${cn}에서는 ${A.fy || A.from}년부터 주별로 법에 따른 조력 사망이 허용되기 시작했으며, ${A.yr}년 사망의 약 ${pct}%였습니다 (${A.src})`
    : L`${cn}에서는 ${A.fy || A.from}년부터 법에 따른 조력 사망이 허용되며, ${A.yr}년 사망의 약 ${pct}%였습니다 (${A.src})`;
  log(t, 'note', fact); S.log[S.log.length - 1].d = 'ad';
}
const TERM_P = { can: 0.6, copd: 0.45, kid: 0.4, cir: 0.55, dem: 0.45 }, TERM_FOUND = 0.85;
const TERM_DX = c => c.p === 'hi' ? 0.65 : 0.1 + 0.45 * careT(c);
const TERM_T = { can: "Xét nghiệm phát hiện bạn bị ung thư, và bệnh đã ở giai đoạn khá muộn. Bạn bắt đầu điều trị.", copd: "Thấy khó thở, bạn đến bệnh viện và được chẩn đoán chức năng phổi đã suy giảm nhiều. Bạn bắt đầu điều trị.",
  kid: "Chức năng thận suy giảm nghiêm trọng, bạn bắt đầu phải chạy thận.", cir: "Bạn được chẩn đoán gan đã xơ hóa nặng. Bạn bắt đầu điều trị." };
const demNow = () => !!(S.flags.termIll && S.flags.termIll.k === 'dem');
const DEM_DX_F = () => "57 triệu người đang sống chung với sa sút trí tuệ. Sau khi được chẩn đoán, người bệnh sống thêm khoảng 5 năm (trung vị), càng lớn tuổi càng ngắn hơn (WHO; Brück và cộng sự 2025, BMJ)";
const DEM_UN_F = () => "75% người bị sa sút trí tuệ không được chẩn đoán, ở các nước thu nhập thấp và trung bình con số này lên tới 90% (Hiệp hội Alzheimer Quốc tế, Báo cáo Alzheimer Thế giới 2021)";
const termCost = c => incomeAt(c, 0.5) * 0.6 * hospPrice(c) * hospShare(c, S.age);
const dxBig = () => { S.stats.dxBig = (S.stats.dxBig || 0) + 1; };
function termStart(k, c) {
  S.flags.termIll = { k, at: S.age }; dxBig();
  const m = termCost(c); S.money -= m; book("Tiền chữa bệnh", -m); famCareHelp(m); eff({ h: -8, hl: -15 });
  const scr = k === 'can' && !S.flags.canSv && (scrOwn() || scrNat());
  if (k === 'dem') { const dx = chance(TERM_DX(c)); S.flags.termIll.dx = dx ? 1 : 0;
    log((dx ? "Lời nói và trí nhớ cứ dần mờ đi, bạn đến bệnh viện và được chẩn đoán sa sút trí tuệ. Bạn và gia đình bắt đầu chuẩn bị cho những ngày sắp tới." : "Trí nhớ cứ dần mờ đi, có những ngày bạn lạc cả trên con đường vẫn đi hằng ngày. Gia đình bắt đầu ở bên cạnh bạn.") + ` (−${wonStr(m)})`, 'bad', dx ? DEM_DX_F() : DEM_UN_F()); }
  else log((k === 'can' ? canFoundT(scr) : TERM_T[k]) + ` (−${wonStr(m)})`, 'bad', scr ? SCR_HARD_F() : k === 'can' ? "Với ung thư được phát hiện khi đã di căn xa, tỷ lệ sống sau 5 năm là khoảng 30% (Viện Ung thư Quốc gia Hoa Kỳ, SEER)" : null);
  S.yearMark = S.yearMark || 'loss';
  if (isWorking() && !inOffice() && !RARE_JOBS.includes(S.job)) {
    if (S.age >= 58) { const bx = S.job === 'owner' ? bizExit() : workHandDown(); S.pension = pensionAmount(); S.retired = true; S.flags.lastJob = S.job; S.job = 'retired'; log("Bạn nghỉ việc và về hưu để chăm sóc sức khỏe.", 'note'); if (bx) log(bx, 'ev'); }
    else if (!bizMinded()) { const bx = S.job === 'owner' ? bizExit() : ''; S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; S.flags.sickOut = S.age; log("Bạn nghỉ công việc đang làm để tập trung điều trị.", 'note'); if (bx) log(bx, 'ev'); }
  }
}
function bizMinded() {
  if (S.job !== 'owner') return false;
  const P = S.fam.partner, kid = S.fam.kids.find(k => k.alive && k.grown && k.near && !k.away && !k.abroad && S.age - k.bornAt >= 20);
  const st = bizStaffN(), who = S.fam.married && P && P.alive && !P.divorced && !(P.postEnd > S.age) ? "bạn đời" : st >= 2 ? "các nhân viên" : st ? "nhân viên của bạn" : kid ? iga(callName(kid.name)) : null;
  if (!who) return false;
  const x = Math.max(0, S.income) * 0.4; S.money -= x; book("Thu nhập giảm trong thời gian nghỉ điều trị", -x);
  log(L`치료받는 동안 ${bizWhat() === "công ty" ? "việc ở công ty" : "việc ở cửa hàng"} ${who} 맡아 꾸렸습니다.` + ' ' + "Năm đó thu nhập của bạn giảm mạnh.", 'note');
  return true;
}
function termYear() {
  const t = S.flags.termIll, c = C(), y = S.age - t.at;
  if (chance(Math.min(0.95, TERM_P[t.k] * (y >= 3 ? 1.4 : 1)))) {
    S.flags.termIll = null; const h = homeOthers();
    if (h.pt || h.kids.length || (S.age < 40 && (h.mom || h.dad))) log(t.k === 'dem' ? "Bạn sống những ngày cuối đời bên gia đình. Cả những ngày trí nhớ mờ đi, gia đình vẫn nắm tay bạn." : "Bạn dành những tháng cuối cùng bên gia đình. Đã có thời gian để nói những điều bạn muốn nói.", 'warm');
    die(t.k); return true;
  }
  if (t.k !== 'dem' && chance(t.k === 'can' ? 0.1 : 0.05)) { S.flags.termIll = null; eff({ h: 8, hl: 12 }); log(t.k === 'kid' ? "Bạn được ghép thận và không còn phải chạy thận nữa. Bạn trở lại cuộc sống thường ngày." : "Việc điều trị có hiệu quả và bệnh đã thuyên giảm. Bạn trở lại cuộc sống thường ngày.", 'big'); return false; }
  const m = termCost(c) * 0.6; S.money -= m; book("Tiền chữa bệnh", -m); famCareHelp(m); eff({ hl: -6, h: -2 });
  if (y === 1) log(t.k === 'dem' ? L`가까운 사람들이 번갈아 곁을 지켰습니다. 좋은 날에는 함께 옛 사진을 꺼내 보았습니다. (−${wonStr(m)})` : L`병원을 오가며 치료를 이어 갔습니다. 가까운 사람들이 번갈아 곁을 지켰습니다. (−${wonStr(m)})`, 'ev');
  return false;
}
const SCR_SAVE = 0.12;
const scrOwn = () => !!(S.flags.checkAuto && !S.flags.checkSkip) || (S.flags.shop_checkup != null && S.age - S.flags.shop_checkup <= 2);
const scrNat = () => SCREEN_C.has(C().id) && S.age >= 40 && !!(S.flags.natScr != null ? S.flags.natScr : (S.flags.natScr = chance(0.6) ? 1 : 0));
const scrSave = c => scrOwn() && S.age >= 40 && S.age < 80 && chance((SCR_SAVE + (S.smoker || S.flags.exSmoker ? 0.03 : 0)) * (0.4 + 0.6 * careT(c)));
function canScrType(a, sex, c) {
  const w = { colorectal: 11, stomach: c.id === 'KOR' ? 24 : c.id === 'JPN' || c.id === 'CHN' || c.id === 'MNG' ? 20 : 6 };
  if (sex === 'F') { w.breast = 12; w.cervix = c.p === 'ssa' || c.p === 'sa' ? 8 : 3; } else w.prostate = c.p === 'hi' ? 8 : 3;
  return CAN_NM[wpick(w)];
}
const SCR_NM = () => new Set(['colorectal', 'stomach', 'breast', 'cervix', 'prostate', 'thyroid'].map(k => CAN_NM[k]));
const SCR_F = () => "Nội soi dạ dày tầm soát đã giảm 47% nguy cơ tử vong do ung thư dạ dày (chương trình tầm soát ung thư quốc gia Hàn Quốc, Jun và cộng sự 2017). Chụp nhũ ảnh giúp giảm khoảng 40% số ca tử vong do ung thư vú ở những phụ nữ được tầm soát (IARC 2016)";
const SCR_HARD_F = () => "Nhiều loại ung thư cướp đi nhiều sinh mạng nhất, như ung thư phổi, gan và tụy, rất khó phát hiện sớm qua khám sức khỏe thông thường. Ở Hàn Quốc, cứ 5 ca ung thư được chẩn đoán thì có 1 ca chỉ được phát hiện khi đã di căn xa (Trung tâm Ung thư Quốc gia Hàn Quốc, 2024)";
function canFoundT(scr) {
  if (S.flags.canSv) return "Ung thư đã quay trở lại, và bệnh đã ở giai đoạn khá muộn. Bạn bắt đầu điều trị lại.";
  if (!scr) return TERM_T.can;
  const r = rnd();
  return r < 0.6 ? "Đó là loại ung thư khó phát hiện qua khám sức khỏe định kỳ. Khi bạn thấy trong người không ổn và đến bệnh viện thì bệnh đã ở giai đoạn khá muộn. Bạn bắt đầu điều trị."
    : r < 0.85 ? "Bạn vẫn khám sức khỏe định kỳ, nhưng khối u này phát triển nhanh giữa hai lần khám. Khi được phát hiện, nó đã di căn sang nơi khác. Bạn bắt đầu điều trị."
    : "Lần khám định kỳ đã phát hiện ung thư, nhưng bệnh đã di căn sang nơi khác. Bạn bắt đầu điều trị.";
}
function popQ(c, a) { const lt = lifeTable(c, S.sex), q = lt.q[Math.min(a, 109)]; return 1 - Math.pow(1 - q, clamp(calOf(c.id) * eraMort(c, a), 0.25, 9)); }
function causeShare(c, a, k) { const w = causeWeights(c, a, S.sex, false); let t = 0; for (const x in w) t += w[x]; return t > 0 && w[k] ? w[k] / t : 0; }
const careT = c => clamp((Math.log(c.ppp) - Math.log(3000)) / (Math.log(50000) - Math.log(3000)), 0, 1);
const EAS_CAN = new Set(['KOR', 'JPN', 'TWN', 'SGP', 'HKG', 'MAC']);
function svCanK(c, a) {
  if (a < 20) { const s5 = 0.2 + 0.62 * careT(c); return s5 / (1 - s5); }
  const t = careT(c);
  return (SV_CAN.base + SV_CAN.care * Math.pow(t, 1.5)) * (EAS_CAN.has(c.id) ? SV_CAN.eas : 1) * (a < 50 ? 1 + 0.8 * t : a < 65 ? 1 + 0.2 * t : a < 80 ? 0.9 : 0.5);
}
const SV_CAN = { base: 0.15, care: 1.2, eas: 0.675 }, SV_STR = { base: 0.6, care: 1.3 };
function svStrK(c, a) {
  const ht = S.conds.htn ? (S.conds.htn.treated ? 1.4 : 2.2) : 1, sm = S.smoker ? 1.8 : S.flags.exSmoker ? 1.2 : 1, dm = S.conds.dm ? 1.4 : 1;
  return (SV_STR.base + SV_STR.care * careT(c)) * (a < 55 ? 1.4 : a < 75 ? 1.1 : 0.8) * ht * sm * dm / 1.35;
}
const CAN_NM = { leuk: "bệnh bạch cầu", lymph: "ung thư hạch", brain: "u não", kidney: "ung thư thận", bone: "ung thư xương", thyroid: "ung thư tuyến giáp", colorectal: "ung thư đại trực tràng", bladder: "ung thư bàng quang", stomach: "ung thư dạ dày",
  breast: "ung thư vú", cervix: "ung thư cổ tử cung", uterus: "ung thư nội mạc tử cung", prostate: "ung thư tuyến tiền liệt", testis: "ung thư tinh hoàn", mel: "u hắc tố (ung thư da)" };
function canSvType(a, sex, c) {
  if (a < 20) return CAN_NM[wpick({ leuk: 35, lymph: 18, brain: 15, kidney: a < 10 ? 10 : 2, bone: a >= 10 ? 8 : 2, thyroid: a >= 12 ? 6 : 0 })];
  const w = { colorectal: 12, thyroid: 6, lymph: 4, kidney: 4, bladder: sex === 'M' ? 5 : 2, stomach: 5 };
  if (sex === 'F') { w.breast = a < 40 ? 20 : 30; w.cervix = c.p === 'ssa' || c.p === 'sa' ? 10 : 4; w.uterus = c.p === 'hi' && a >= 45 ? 5 : 2; }
  else { w.prostate = a < 50 ? 1 : c.p === 'hi' || c.p === 'lac' || c.p === 'ssa' ? 25 : 8; if (a < 45) w.testis = 6; }
  if (c.id === 'KOR') { w.thyroid *= 5; w.stomach *= 3; } else if (c.id === 'JPN' || c.id === 'CHN' || c.id === 'MNG') w.stomach *= 2.5;
  if (c.p === 'hi' && !EAS_CAN.has(c.id)) w.mel = ['AUS', 'NZL'].includes(c.id) ? 18 : 6;
  if (a < 45) w.thyroid *= 1.5;
  return CAN_NM[wpick(w)];
}
const canSvFact = c => c.id === 'KOR' ? "Tỷ lệ sống tương đối sau 5 năm của người bệnh ung thư ở Hàn Quốc là 72,9%, tức so với những người cùng độ tuổi (Thống kê Đăng ký Ung thư Quốc gia Hàn Quốc, 2022)" : c.id === 'USA' ? "Tỷ lệ sống tương đối sau 5 năm của người bệnh ung thư ở Mỹ là khoảng 69%, tức so với những người cùng độ tuổi (Viện Ung thư Quốc gia Hoa Kỳ, SEER)" : "Nhiều loại ung thư có thể chữa khỏi nếu được phát hiện sớm và điều trị đúng cách (WHO)";
const STR_FACT = () => "Cứ 4 người trên 25 tuổi thì có khoảng 1 người bị đột quỵ ít nhất một lần trong đời (GBD 2016, NEJM 2018)";
function sickWork(a, pOut) {
  if (!isWorking() || inOffice() || RARE_JOBS.includes(S.job)) return;
  if (a >= 60 && chance(pOut + 0.2)) { const bx = S.job === 'owner' ? bizExit() : workHandDown(); S.pension = pensionAmount(); S.retired = true; S.flags.lastJob = S.job; S.job = 'retired'; log("Bạn nghỉ việc và về hưu để chăm sóc sức khỏe.", 'note'); if (bx) log(bx, 'ev'); }
  else if (a < 60 && chance(pOut) && !bizMinded()) { const bx = S.job === 'owner' ? bizExit() : ''; S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; S.flags.sickOut = a; log("Bạn nghỉ công việc đang làm để tập trung điều trị.", 'note'); if (bx) log(bx, 'ev'); }
}
function canSvStart(c, a, scr) {
  const k = scr ? canScrType(a, S.sex, c) : canSvType(a, S.sex, c), sv = S.flags.canSv = { at: a, n: ((S.flags.canSv || {}).n || 0) + 1, nm: k };
  dxBig();
  const byScr = sv.n === 1 && a >= 30 && (scr || ((scrOwn() || scrNat()) && SCR_NM().has(k) && chance(0.7)));
  if (a < 18) { eff({ hl: -12, h: -6 }); logA('hosp:me', L`${k} 진단을 받았습니다. 긴 치료가 시작되었고, 가족이 번갈아 병원을 지켰습니다.`, 'bad', "Ở các nước thu nhập cao, hơn 80% trẻ em mắc ung thư được chữa khỏi, nhưng ở nhiều nước nghèo hơn, con số này chưa tới 30% (WHO)"); return; }
  const m = termCost(c) * 0.8; S.money -= m; book("Tiền chữa bệnh", -m); famCareHelp(m); eff({ hl: -12, h: -8 });
  logA('hosp:me', (sv.n > 1 ? L`검사에서 또 다른 암, ${k} 진단을 받았습니다. 다시 치료를 시작했습니다.` : byScr ? L`정기 검진에서 ${eul(k)} 일찍 발견했습니다. 수술과 치료를 시작했습니다.` : L`검사에서 ${k} 진단을 받았습니다. 수술과 치료를 시작했습니다.`) + ` (−${wonStr(m)})`, 'bad', byScr ? SCR_F() : canSvFact(c));
  sickWork(a, 0.3);
}
function strSvStart(c, a) {
  S.flags.strSv = a; dxBig();
  const m = termCost(c) * 0.5; S.money -= m; book("Tiền chữa bệnh", -m); famCareHelp(m);
  if (S.conds.htn && S.conds.htn.dx === false) ncdFound('htn');
  if (!S.dis && chance(0.45)) { eff({ hl: -6, h: -2 }); disGet('move', 'stroke', "Sau cơn đột quỵ, bạn không còn cử động được một bên tay chân như trước. Bạn kiên trì tập phục hồi chức năng." + ` (−${wonStr(m)})`); }
  else { eff({ hl: -12, h: -8 }); logA('hosp:me', "Bạn bị đột quỵ nhưng được đưa đến bệnh viện kịp thời. Qua quá trình phục hồi chức năng, bạn tập đi và tập nói lại." + ` (−${wonStr(m)})`, 'bad', STR_FACT()); }
  sickWork(a, 0.3);
}
const BREG = { AFG: [42, 64, 36], AGO: [25, 33, 14], BDI: [84, 90, 83], BEN: [86, 91, 82], BFA: [77, 93, 74], BGD: [56, 54, 57], BOL: [92, null, null], BRA: [96, null, null], BWA: [88, 92, 82], CAF: [45, 68, 35], CHL: [99, null, null], CIV: [72, 90, 60], CMR: [62, 80, 47], COD: [40, 57, 29], COG: [96, 99, 91], COL: [97, 97, 96], DOM: [92, 94, 87], ECU: [87, 95, 91], EGY: [99, 100, 99], ETH: [3, 12, 2], GAB: [90, 89, 91], GEO: [98, 98, 99], GHA: [71, 80, 64], GIN: [62, 81, 54], GMB: [59, 57, 63], GNB: [46, 59, 41], GNQ: [54, 60, 47], GTM: [96, 97, 96], HND: [97, 97, 97], HTI: [85, 90, 82], IDN: [77, 80, 73], IND: [89, 93, 88], IRN: [99, 99, 98], IRQ: [99, 99, 99], JAM: [98, 100, 99], JOR: [98, 98, 99], KEN: [67, 79, 61], KGZ: [99, 99, 99], KHM: [73, 84, 72], LAO: [73, 89, 67], LBN: [99, null, null], LBR: [66, 69, 63], LSO: [44, 54, 40], MAR: [97, 98, 96], MDG: [74, 89, 71], MEX: [97, 96, 94], MLI: [87, 96, 84], MMR: [81, 94, 78], MOZ: [55, 64, 52], MRT: [45, 68, 30], MWI: [67, 75, 66], NAM: [78, 85, 72], NER: [64, 92, 60], NGA: [43, 60, 32], NIC: [85, null, null], NPL: [77, 76, 79], PAK: [42, 60, 34], PAN: [97, 97, 96], PER: [96, 96, 96], PHL: [92, 94, 90], PNG: [13, 25, 12], PRY: [71, 86, 48], PSE: [99, 99, 99], RWA: [86, 85, 86], SAU: [99, null, null], SDN: [67, 89, 59], SEN: [79, 93, 71], SLE: [90, 93, 89], SLV: [91, 98, 99], SOM: [6, 7, 5], SSD: [35, 45, 32], TCD: [26, 50, 21], TGO: [83, 94, 76], TJK: [96, 97, 96], TUR: [98, 99, 98], TZA: [68, null, null], UGA: [32, 36, 31], VEN: [81, null, null], VNM: [96, 97, 96], YEM: [31, 48, 24], ZAF: [89, null, null], ZMB: [14, 25, 8], ZWE: [49, 69, 40] };
const YLIT = { AFG: [83, 44], AGO: [88, 73], BDI: [88, 89], BEN: [75, 68], BFA: [65, 67], BGD: [92, 94], BGR: [98, 98], BRA: [99, 100], CAF: [65, 37], CHL: [99, 100], CIV: [82, 58], CMR: [88, 76], COD: [88, 68], COL: [98, 100], CRI: [99, 100], DOM: [98, 99], ECU: [99, 99], EGY: [96, 95], ETH: [88, 81], GAB: [95, 93], GHA: [92, 91], GIN: [70, 43], GMB: [72, 63], GNB: [86, 78], GTM: [96, 95], HND: [95, 97], HTI: [88, 89], IDN: [93, 95], IND: [98, 97], IRN: [99, 99], IRQ: [94, 91], JAM: [88, 99], JOR: [98, 99], KEN: [94, 92], KHM: [96, 97], KWT: [99, 100], LAO: [92, 89], LBN: [98, 95], LBR: [84, 63], LKA: [99, 99], LSO: [94, 99], MAR: [93, 85], MDG: [83, 82], MEX: [99, 99], MLI: [57, 43], MMR: [96, 96], MNG: [100, 99], MOZ: [78, 65], MRT: [75, 67], MWI: [81, 80], MYS: [99, 98], NAM: [91, 93], NER: [64, 45], NGA: [81, 81], NIC: [94, 97], NPL: [97, 92], PAK: [79, 67], PAN: [100, 99], PER: [99, 100], PNG: [93, 91], PRT: [99, 99], PRY: [99, 99], PSE: [100, 99], QAT: [98, 100], RWA: [88, 92], SEN: [69, 66], SLE: [78, 68], SLV: [98, 99], SOM: [76, 65], SYR: [98, 98], TCD: [56, 33], TGO: [93, 88], THA: [98, 98], TJK: [100, 98], TUN: [98, 98], TUR: [93, 92], TZA: [89, 85], UGA: [84, 86], URY: [99, 99], VEN: [98, 99], VNM: [99, 99], ZAF: [96, 98], ZMB: [79, 76], ZWE: [91, 94] };
const HL_EVER = { USA: 6.2, GBR: 7.7, ITA: 4.0, BEL: 3.4, DEU: 2.4 }, HL_K = 0.22;
const HL_FIT = { USA: 1.2, GBR: 2.5, ITA: 2.4, BEL: 1.9, DEU: 1.3 };
const HL_FAM = [1, 1, 0.8, 0.5, 0.25, 0.08];
const papersOK = () => !(S.flags && S.flags.noReg);
const BREG_F = () => "Trên thế giới, khoảng 150 triệu trẻ em dưới 5 tuổi chưa được đăng ký khai sinh (UNICEF 2024)";
const LIT_F = () => "Trên thế giới có khoảng 765 triệu người trưởng thành không biết đọc, biết viết, hai phần ba trong số đó là phụ nữ (UNESCO 2024)";
const HL_F = () => "Tỷ lệ người từng có lúc không có nhà ở trong đời: Anh 7,7%, Mỹ 6,2%, Ý 4%, Bỉ 3,4%, Đức 2,4% (Toro và cộng sự 2007)";
const BREG_Q = 0.65;
function bregP(p, q) {
  const f = x => 1 / (1 + Math.exp(-x)); p = clamp(p, 0.01, 0.995);
  let lo = -9, hi = 9; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2, avg = (f(m - 2 * BREG_Q) + f(m - BREG_Q) + f(m) + f(m + BREG_Q) + f(m + 2 * BREG_Q)) / 5; if (avg < p) lo = m; else hi = m; }
  return f(lo + BREG_Q * (clamp(q || 3, 1, 5) - 3));
}
const BREG_PL = {};
function bregPlace(b, r, urban) {
  if (r[1] == null || r[2] == null) return r[0] / 100;
  let d = BREG_PL[b.id];
  if (d == null) {
    const f = x => 1 / (1 + Math.exp(-x)), lg = p => Math.log(p / (1 - p)), u = clamp(b.urb / 100, 0, 1), a = lg(clamp(r[1] / 100, 0.01, 0.99)), v = lg(clamp(r[2] / 100, 0.01, 0.99)), t = r[0] / 100;
    let lo = -4, hi = 4; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (u * f(a + m) + (1 - u) * f(v + m) < t) lo = m; else hi = m; }
    d = BREG_PL[b.id] = (lo + hi) / 2;
  }
  return 1 / (1 + Math.exp(-(Math.log(clamp((urban ? r[1] : r[2]) / 100, 0.01, 0.99) / (1 - clamp((urban ? r[1] : r[2]) / 100, 0.01, 0.99))) + d)));
}
function regSchool() {
  if (!S.flags || !S.flags.noReg || S.flags.regSch) return;
  S.flags.regSch = 1;
  log("Vì không có giấy khai sinh, gia đình phải lo xong giấy tờ thì bạn mới được vào học.", 'note', BREG_F());
  if (chance(0.6)) { S.flags.noReg = 0; log("Gia đình bạn đi lại nhiều lần đến cơ quan chức năng và đã làm xong thủ tục đăng ký khai sinh muộn cho bạn.", 'ev'); }
  else log("Nhà trường tạm cho bạn vào học dù chưa có giấy tờ, nhưng bạn vẫn chưa được đăng ký khai sinh.", 'note');
}
function regNext() {
  if (!S.flags || !S.flags.noReg || !chance(0.7)) return;
  S.flags.noReg = 0; log("Muốn học lên cấp trên phải có giấy khai sinh, nên gia đình đã làm thủ tục đăng ký khai sinh muộn cho bạn.", 'ev');
}
function regYear(a) {
  const b = B();
  if (a === 0 && S.flags.noReg == null) {
    const r = !b.yr && BREG[b.id], p = r ? bregP(bregPlace(b, r, S.urban), S.q) : 1;
    S.flags.noReg = r && !rohStateless() && chance(1 - p) ? 1 : 0; if (S.flags.noReg) S.stats.noReg0 = 1;
    return;
  }
  if (!S.flags.noReg) return;
  if (a < 18) { if (chance(0.06)) { S.flags.noReg = 0; log("Nhờ một đợt vận động đăng ký khai sinh về tận địa phương, cuối cùng bạn cũng được đăng ký khai sinh, dù muộn.", 'ev'); } return; }
  if (a === 18) { eff({ h: -3 }); log("Không có giấy khai sinh, bạn không thể làm giấy tờ tùy thân. Việc mở tài khoản ngân hàng hay tìm một công việc chính thức đều rất khó.", 'bad', BREG_F()); return; }
  if (a > 18 && chance(0.12)) { const m = incomeAt(C(), 0.5) * 0.03; S.money -= m; book("Đăng ký khai sinh muộn", -m); S.flags.noReg = 0; eff({ h: 4 }); log(L`법원과 관청을 오간 끝에 늦은 출생신고를 마치고 신분증을 받았습니다. (−${wonStr(m)})`, 'big'); }
}
const canRead = (y = 1) => !S.flags.illit && (S.edu >= 1 || S.flags.litAt != null || (!!S.school && S.schoolY >= y) || (S.age >= 15 && S.flags.illit === 0 && !B().yr));
function litOdds(c, sex) {
  const y = YLIT[c.id]; if (!y || c.yr) return null;
  const u = 1 - (sex === 'F' ? y[1] : y[0]) / 100; let d0 = 0, d1 = 0;
  for (let q = 1; q <= 5; q++) { const e = eduProbs(c, sex, q, S.urban); d0 += (1 - e.t1) / 5; d1 += e.t1 * (1 - e.t2) / 5; }
  let a = Math.min(0.95, u / Math.max(0.01, d0 + 0.25 * d1)), b = 0.25 * a;
  if (a >= 0.95) b = clamp((u - 0.95 * d0) / Math.max(0.01, d1), 0, 0.7);
  return [a, b];
}
const LIT_RHO = 0.7, LIT_Z = [-0.45, 1.0];
function litTilt(p) {
  if (S.flags.topMk != null || !(p > 0)) return 0;
  const z = (clamp(kzOf(), -3, 3) - LIT_Z[0]) / LIT_Z[1];
  return normCdf((invNorm(clamp(p, 0.001, 0.999)) - LIT_RHO * z) / Math.sqrt(1 - LIT_RHO * LIT_RHO));
}
function litYear(a) {
  if (a >= 15 && S.flags.illit == null) {
    if (S.school) return;
    const o = S.edu <= 1 && !S.hobbies.some(h => h.id === 'reading') ? litOdds(B(), S.sex) : null;
    S.flags.illit = o && chance(litTilt(S.edu === 0 ? o[0] : o[1])) ? 1 : 0;
    if (S.flags.illit) log(S.edu === 0 ? "Vì không được đi học lâu, bạn không biết đọc, biết viết. Khi cần đọc gì, người nhà đọc giúp bạn." : "Bạn đã học tiểu học nhưng chưa bao giờ thật sự biết đọc. Khi cần đọc gì, người nhà đọc giúp bạn.", 'note', LIT_F());
    return;
  }
  if (!S.flags.illit || a < 16 || S.job === 'prison') return;
  if (S.edu >= 2) { S.flags.illit = 0; S.flags.litAt = a; return; }
  if (!S.flags.thumb && a >= 18 && chance(0.12)) { S.flags.thumb = 1; log("Bạn điểm chỉ thay cho chữ ký trên giấy tờ ở cơ quan nhà nước.", 'note'); return; }
  const kid = S.fam.kids.find(k => k.alive && S.age - k.bornAt >= 8 && S.age - k.bornAt <= 16 && !k.abroad && !(S.age - k.bornAt >= 12 && kidBanned(k)));
  if (kid && chance(0.04)) { S.flags.illit = 0; S.flags.litAt = a; eff({ h: 5, so: 3 }); log(L`학교에 다니는 ${iga(callName(kid.name))} 저녁마다 글자를 가르쳐 주었습니다. 처음으로 내 이름을 써 보았습니다.`, 'warm'); return; }
  if (a <= 70 && chance(['sa', 'ssa', 'mena', 'eap'].includes(C().p) ? 0.02 : 0.01)) { S.flags.illit = 0; S.flags.litAt = a; eff({ h: 5, so: 2 }); log("Bạn bắt đầu theo học một lớp xóa mù chữ gần nhà. Vài tháng sau, lần đầu tiên bạn viết được tên của chính mình.", 'warm'); }
}
const MIGX_P = { legal: 0.006, irreg: 0.012 }, MIGX_TO = new Set(['SAU', 'ARE', 'QAT', 'KWT', 'OMN', 'BHR', 'MYS', 'SGP', 'THA', 'LBN', 'JOR', 'RUS', 'KAZ', 'KOR', 'JPN', 'TWN']);
const REC_F = () => "Người lao động từ các nước nghèo thường phải trả phí môi giới bằng vài tháng lương để có được việc làm ở nước ngoài (Khảo sát chi phí di cư của World Bank KNOMAD và ILO)";
const MIGX_F = () => "Khoảng 27,6 triệu người đang phải chịu lao động cưỡng bức, và người lao động di cư có nguy cơ cao gấp khoảng ba lần so với những người lao động khác (ILO, Walk Free và IOM 2022)";
const MIGX_SX = () => "Vào một ngày bất kỳ của năm 2021, khoảng 6,3 triệu người đang bị cưỡng bức bóc lột tình dục vì mục đích thương mại (ILO, Walk Free và IOM 2022)";
function migxYear(a, c) {
  if (!S.mig || S.cur === S.born || S.flags.skilledMig || S.refugee || !isWorking() || SELF_JOBS.includes(S.job) || a >= 60 || B().ppp >= 15000 || S.isComp) return;
  if (citizen() || (S.born === 'PRK' && S.cur === 'KOR')) return;
  const irr = S.flags.irreg != null; if (!irr && !MIGX_TO.has(S.cur)) return;
  if (S.flags.migxAt != null && a - S.flags.migxAt < 8) return;
  if (!chance(irr ? MIGX_P.irreg : MIGX_P.legal)) return;
  S.flags.migxAt = a; const m = Math.max(S.income, incomeAt(c, 0.3)) * 0.25; S.money -= m; book("Tiền công không được trả", -m); eff({ h: -10, so: -3 });
  log(irr ? "Vì bạn làm việc không có giấy phép, chủ đã lợi dụng điều đó để giữ lại mấy tháng tiền công. Nhờ một tổ chức hỗ trợ người di cư, bạn đã thoát khỏi nơi đó."
    : "Nơi bạn làm việc giữ hộ chiếu của bạn và nợ mấy tháng lương. Nhờ đại sứ quán và một tổ chức lao động giúp đỡ, bạn đã chuyển chỗ làm, nhưng không đòi lại được hết số tiền bị nợ.", 'bad', MIGX_F() + (AGE12 ? '' : ' · ' + MIGX_SX()));
  if (!inOffice()) { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; }
}
function hlYear(a, c) {
  const h = S.flags.hless;
  if (h) {
    if (S.house > 0 || withParents() || S.flags.oldHome === 'care' || vowedHome() || (h.c && h.c !== S.cur)) { S.flags.hless = null; return; }
    const P = S.fam.partner;
    if (S.fam.married && P && P.alive && !P.divorced && !P.lb && S.fam.marriedAt != null && S.fam.marriedAt >= h.at) { S.flags.hless = null; eff({ h: 6, hl: 3 }); log("Bạn kết hôn và cùng bạn đời tìm được một mái nhà. Quãng thời gian không nhà đã qua.", 'big'); return; }
    const y = a - h.at;
    if (chance(y === 0 ? 0.7 : 0.45) || S.job === 'prison') {
      S.flags.hless = null; eff({ h: 8, hl: 3 });
      if (S.job !== 'prison') log(isWorking() ? (h.w ? "Bạn dùng tiền dành dụm từ công việc để thuê lại một căn phòng. Quãng thời gian không nhà đã qua." : "Bạn tìm được việc và lại thuê được một căn phòng. Quãng thời gian không nhà đã qua.") : "Nhờ chương trình hỗ trợ nhà ở, bạn có được một căn phòng nhỏ. Bạn lại có chìa khóa nhà của riêng mình.", 'big');
    } else { eff({ hl: -4, h: -3 }); log("Thêm một năm không nhà. Những người ở nhà tạm trú và các bếp ăn miễn phí đã giúp bạn trụ vững.", 'bad'); }
    return;
  }
  const ev = HL_EVER[c.id];
  if (!ev || a < 18 || a > 75 || S.job === 'prison' || S.isComp || S.house > 0 || withParents() || S.flags.oldHome === 'care' || vowedHome() || S.school) return;
  const P = S.fam.partner, ptInc = S.fam.married && P && P.alive && !P.divorced && P.inc > 0;
  let r = 0;
  if (S.money < incomeAt(c, 0.5) * 0.05 && hhPct() < 0.3) r += 1;
  if (debtHeavy()) r += 1;
  if (S.job === 'seeking') r += 1;
  if (S.flags.relAt != null && a - S.flags.relAt <= 1) r += 3;
  if (P && P.divorced && P.endAt === a) r += 1.5;
  if (S.alc || S.gamb || S.drug) r += 1.5;
  if (ptInc) r *= 0.3;
  if (S.money >= incomeAt(c, 0.5) * 0.25) r *= 0.3;
  if (famCanHelp() && !S.mig && S.cur === S.born) r *= S.flags.rich ? 0 : HL_FAM[S.q] || 1;
  if (!r || !chance(HL_K * (HL_FIT[c.id] || 1) * ev / 100 * r)) return;
  S.flags.hless = { at: a, c: S.cur }; S.flags.hlEver = 1; eff({ h: -10, hl: -6, so: -4 });
  const kn = homeOthers().kids.filter(k => a - k.bornAt < 18 && !k.abroad).length;
  log(S.flags.relAt != null && a - S.flags.relAt <= 1 ? "Bạn ra tù nhưng không có nhà để về. Bạn ở nhà tạm trú một thời gian."
    : kn > 1 ? "Vì nợ tiền thuê nhà, bạn và các con phải rời khỏi căn nhà đang ở. Bạn ở tại một nhà tạm trú dành cho gia đình và tìm cách gượng dậy."
    : kn ? "Vì nợ tiền thuê nhà, bạn và con phải rời khỏi căn nhà đang ở. Bạn ở tại một nhà tạm trú dành cho gia đình và tìm cách gượng dậy."
    : c.id === 'USA' && S.owns.car ? "Vì nợ tiền thuê nhà, bạn phải rời khỏi căn nhà đang ở. Một thời gian, bạn ngủ trong xe và ra vào các nhà tạm trú."
    : "Vì nợ tiền thuê nhà, bạn phải rời khỏi căn nhà đang ở. Một thời gian, bạn ở lúc thì nhà tạm trú, lúc thì nhà người quen.", 'bad', HL_F());
  if (isWorking() && !inOffice() && !RARE_JOBS.includes(S.job) && S.job !== 'owner' && chance(0.3)) { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; log("Trong lúc chạy qua chạy lại giữa các nhà tạm trú, bạn cũng mất luôn việc làm.", 'bad'); }
  S.flags.hless.w = isWorking() ? 1 : 0;
}
const DRUG_US = 9.9, DRUG_K = 0.02;
const drugEver = c => (c.p === 'mena' ? 0.3 : 1) * DRUG_US * Math.pow((OD[c.id] || 0.3) / 7, 0.8) / 100;
const DRUG_HELP = () => B().id === 'KOR' || S.cur === 'KOR' ? L`도움: 마약류 중독 상담 1342 (24시간)` : L`도움: 마약류 중독 상담 1342 (한국, 24시간) · 다른 나라는 findahelpline.com`;
function logD(d, text, kind, fact) { log(text, kind, fact); const e = S.log[S.log.length - 1]; if (e) { e.d = d; delete e.act; } }
function drugYear(a, c) {
  if (AGE12 || S.isComp) return;
  const D = S.drug;
  if (D) {
    if (S.job === 'prison') return;
    D.y++; const m = incomeAt(c, 0.5) * 0.05; S.money -= m; book("Tiền mua chất gây nghiện", -m); eff({ hl: -3, h: -3, so: -3 });
    if (isWorking()) S.pct = clamp(S.pct - 0.01, 0.005, 0.99);
    if (chance((0.08 + 0.12 * careT(c)) * (D.y >= 2 ? 1.3 : 1))) { S.drug = null; S.flags.drugOK = a; S.flags.drugY1 = 0; eff({ h: 6, hl: 4 }); logD('drug', "Bạn tham gia một chương trình điều trị. Nhờ tư vấn và điều trị, bạn kéo dài thêm từng ngày sống không dùng chất gây nghiện.", 'big', DRUG_HELP()); return; }
    if (isWorking() && !inOffice() && !['owner', 'farm', 'agbiz', 'herder', 'fisher'].includes(S.job) && chance(0.08)) { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -6 }); logD('drug', "Vì chất gây nghiện, bạn không làm việc được như bình thường và đã mất việc.", 'bad'); return; }
    if (chance(0.35)) logD('drug', pick(["Số tiền dành dụm cứ vơi dần vì phải mua chất gây nghiện.", ...(famNear() ? ["Chuyện dùng chất gây nghiện khiến bạn cãi nhau lớn với gia đình."] : []), "Sức khỏe của bạn sa sút thấy rõ."]), 'bad');
    return;
  }
  if (S.flags.drugOK != null) {
    if (a - S.flags.drugOK === 1 && !S.flags.drugY1) { S.flags.drugY1 = 1; logD('drug', "Đã một năm bạn không dùng chất gây nghiện. Con đường ấy không dễ dàng, nhưng bạn đã không quay lại.", 'warm'); return; }
    if (a - S.flags.drugOK <= 5 && S.job !== 'prison' && chance(0.05)) { S.drug = { since: a, y: 0, re: 1 }; logD('drug', "Khi những chuyện khó khăn dồn dập, bạn lại dùng chất gây nghiện.", 'bad', DRUG_HELP()); }
    return;
  }
  if (a < 16 || a > 55 || S.job === 'prison' || S.flags.drugEver) return;
  const P = S.fam.partner, hard = S.job === 'seeking' || (S.flags.lossY != null && a - S.flags.lossY <= 1) || !!S.alc || !!(P && P.divorced && P.endAt >= a - 1) || !!S.flags.hless;
  const pain = !!(S.dis && S.dis.at > 0) || S.flags.strSv != null || !!S.flags.canSv;
  const r = (a < 26 ? 1.6 : a < 36 ? 1.2 : a < 46 ? 0.7 : 0.4) * (hard ? 2 : 1) * (pain ? 1.8 : 1) * (S.sex === 'M' ? 1.4 : 0.6);
  if (!chance(drugEver(c) * DRUG_K * r)) return;
  S.drug = { since: a, y: 0 }; S.flags.drugEver = 1; eff({ h: -6, hl: -4 });
  const rx = pain && ['USA', 'CAN', 'AUS', 'GBR', 'IRL'].includes(c.id) || (c.id === 'USA' && chance(0.4));
  logD('drug', rx ? "Sau một lần bị thương, bạn khó bỏ được thuốc giảm đau đã được kê." : "Để vượt qua giai đoạn khó khăn, bạn dựa vào chất gây nghiện, và chẳng mấy chốc đã khó bỏ được.", 'bad', DRUG_HELP());
}
const SV_F = 0.06, SV_M_US = 0.019 / 0.852, SV_W = a => a < 15 ? 0 : a < 18 ? 2.4 : a < 25 ? 2.2 : a < 35 ? 1.4 : a < 50 ? 0.6 : a < 65 ? 0.2 : 0, SV_SUM = 48.6;
const SV_HELP = young => { const kr = B().id === 'KOR' || S.cur === 'KOR';
  if (young) return kr ? L`도움: 청소년상담 1388 (24시간) · 해바라기센터는 1366에서 안내받을 수 있어요 · 112` : L`도움: 청소년상담 1388 (한국, 24시간) · 다른 나라는 findahelpline.com`;
  if (S.sex === 'M') return kr ? L`도움: 112 · 해바라기센터는 남성 피해자도 돕습니다 (여성긴급전화 1366에서 안내, 24시간)` : L`도움: 112, 해바라기센터 (한국, 1366에서 안내) · 다른 나라는 findahelpline.com`;
  return kr ? L`도움: 여성긴급전화 1366 (24시간)에서 가까운 해바라기센터를 안내받을 수 있어요 · 112` : L`도움: 여성긴급전화 1366 (한국, 24시간) · 다른 나라는 findahelpline.com`; };
function svYear(a, c) {
  if (AGE12 || S.isComp) return;
  const v = S.flags.sv;
  if (v) {
    if (v.ok != null || S.job === 'prison') return;
    const y = a - v.at;
    if (y >= 1 && chance(v.help ? 0.45 : y >= 3 ? 0.35 : 0.15)) {
      v.ok = a; eff({ h: 6, so: 3 });
      logD('sv', v.help ? "Nhờ được tư vấn, bạn dần lấy lại cuộc sống thường ngày. Bạn hiểu ra rằng chuyện đã xảy ra không phải lỗi của bạn." : "Sau thời gian dài một mình chịu đựng, lần đầu tiên bạn kể với một người bạn tin tưởng. Bạn hiểu ra rằng chuyện đã xảy ra không phải lỗi của bạn.", 'warm', SV_HELP(a < 19));
    }
    return;
  }
  if (a < 15 || a > 64 || S.job === 'prison') return;
  const life = S.sex === 'F' ? SV_F : c.id === 'USA' ? SV_M_US : 0;
  if (!life || !chance(life * SV_W(a) / SV_SUM)) return;
  const young = a < 18, help = chance(young ? 0.4 : 0.6), rep = help && chance(young ? 0.4 : 0.5);
  S.flags.sv = { at: a, help: help ? 1 : 0 }; eff({ h: -12, so: -5, hl: -3 });
  if (young) { logD('sv', rep ? "Bạn đã bị một người xâm hại tình dục. Cùng với một người lớn bạn tin tưởng, bạn đã báo cảnh sát và được tư vấn." : help ? "Bạn đã bị một người xâm hại tình dục. Bạn tâm sự với một người lớn mà bạn tin tưởng và bắt đầu được tư vấn." : "Bạn đã bị một người xâm hại tình dục. Suốt một thời gian dài, bạn không thể nói với ai.", 'bad', SV_HELP(true)); return; }
  logD('sv', rep ? "Bạn đã bị một người xâm hại tình dục. Bạn đã báo cảnh sát và được tư vấn, hỗ trợ pháp lý." : help ? "Bạn đã bị một người xâm hại tình dục. Bạn tâm sự với một người thân thiết và bắt đầu được tư vấn." : "Bạn đã bị một người xâm hại tình dục. Suốt một thời gian dài, bạn không thể nói với ai.", 'bad', SV_HELP());
}
const PRETERM = { sa: 13.2, ssa: 10.1, mena: 9, lac: 9.7, eap: 7.5, eca: 6.5, hi: 8 };
const PRETERM_C = { BGD: 16.2, PAK: 14.3, MWI: 14.5, USA: 10, GRC: 11.6, SRB: 3.8, MDA: 4, KAZ: 4.7, KOR: 9.9 };
const pretermP = c => (PRETERM_C[c.id] || PRETERM[c.p] || 9.9) / 100;
const PRETERM_F = () => "Cứ 10 trẻ thì có 1 trẻ sinh non. Riêng năm 2020 có khoảng 13,4 triệu trẻ như vậy (WHO 2023)";
function pretermBirth() {
  S.flags.preT = chance(pretermP(B())) ? 1 : 0;
  if (S.flags.preT) { eff({ hl: -5 }); log(B().ppp >= 20000 ? "Bạn sinh non và phải nằm vài tuần trong phòng hồi sức tích cực sơ sinh. Cơ thể bé nhỏ của bạn đã vượt qua cơn nguy kịch." : "Bạn sinh non và nhẹ cân. Được mẹ ôm sát vào lòng để giữ ấm, bạn đã vượt qua những ngày đầu khó khăn.", 'note', PRETERM_F()); }
}
function sickYear(a, c) {
  if (a === 0 && S.flags.preT == null) pretermBirth();
  const sv = S.flags.canSv;
  if (sv) {
    if (a - sv.at === 1) { eff({ hl: 6, h: 3 }); log(sv.at < 18 && a < 19 ? "Điều trị xong, bạn đi học trở lại." : "Bạn đã điều trị xong. Giờ bạn sống cùng những lần tái khám định kỳ.", 'ev'); }
    else if (a - sv.at === 5) { eff({ h: 4 }); log(sv.nm ? L`${sv.at}세에 진단받은 ${eun(sv.nm)} 5년이 지나도록 다시 찾아오지 않았습니다.` : "Đã 5 năm kể từ khi được chẩn đoán ung thư, và bệnh không quay trở lại.", 'warm'); }
  }
  if (S.flags.termIll || S.job === 'prison' || S.isComp || a < 1) return;
  const q = popQ(c, a);
  if ((!sv || (sv.n < 2 && a - sv.at >= 5)) && chance(q * causeShare(c, a, 'can') * svCanK(c, a))) { canSvStart(c, a); return; }
  if (a >= 25 && S.flags.strSv == null && chance(q * causeShare(c, a, 'str') * svStrK(c, a))) strSvStart(c, a);
}
const HOSP_FREE = new Set(['GBR', 'IRL', 'CAN', 'AUS', 'NZL', 'NOR', 'SWE', 'DNK', 'FIN', 'ISL', 'ITA', 'ESP', 'PRT', 'CUB']);
const HOSP_WAIT = new Set(['GBR', 'IRL', 'CAN', 'NZL', 'NOR']);
const HOSP_TRADE = 0.5, HOSP_PLR = 0.8;
const hospPrice = c => (c.id === 'USA' ? 1.6 : 1) * (1 - HOSP_TRADE + HOSP_TRADE * Math.max(1, HOSP_PLR / plr(c)));
const KID_HOSP = { KOR: [2017, 0.08], JPN: [2012, 0.02] };
const kidHosp = c => { const k = KID_HOSP[c.id]; return k && calYr() >= k[0] ? k[1] : null; };
const insOn = () => S.flags && S.flags.ins === 'more';
const insK = () => insOn() ? 0.3 : 1;
function hospShare(c, age) { return hospShare0(c, age) * insK(); }
const milCare = () => isWorking() && (S.job === 'soldier' || S.job === 'service') || S.serveLeft > 0;
function hospShare0(c, age) {
  if (HOSP_FREE.has(c.id) || defMedAid() || rohCamp() || milCare()) return 0.02;
  if (c.id === 'USA' && age < 65 && S.flags.milPen && S.flags.milC === 'USA') return 0.11;
  if (c.id === 'USA') { if (age >= 65) return 0.12; if (S.formal && isWorking()) return 0.11; if (hhPct() < 0.25) return 0.03; return partnerWorks() ? 0.11 : 0.35; }
  return (c.oop || 30) / 100 * (S.formal ? 0.6 : 1);
}
const spouseCare = c => incomeAt(c, 0.5) * 0.6 * hospPrice(c) * (HOSP_FREE.has(c.id) ? 0.02 : c.id === 'USA' ? hospShare0(c, (S.fam.partner && S.fam.partner.age) || S.age) : (c.oop || 30) / 100) * insK();
function partnerIll(c, cause, label) {
  const P = S.fam.partner, m = spouseCare(c);
  P.ill = { c: cause, l: label, at: S.age };
  eff({ h: -6, so: -2, money: -m }); book("Chi phí chữa bệnh cho bạn đời", -m);
  log(P.lb && CBY[P.lbIn] ? L`${CBY[P.lbIn].ko}에 있는 배우자 ${iga(callName(P.name))} ${label} 진단을 받았습니다. 그곳에서 치료를 시작했고, 치료비를 보냈습니다. (−${wonStr(m)})` : L`배우자 ${iga(callName(P.name))} ${label} 진단을 받았습니다. 함께 병원을 오가며 치료를 시작했습니다. (−${wonStr(m)})`, 'bad');
  if (!P.ret && P.age >= 18) { P.out = Math.max(P.out || 0, 1); P.inc = 0; }
}
function spouseFuneral(c) {
  if (S.job === 'prison') { log(S.flags.nkCamp ? "Vì đang bị giam giữ, bạn không thể dự đám tang của bạn đời." : "Vì đang ở trong tù, bạn không thể dự đám tang của bạn đời.", 'note'); return; }
  const P = S.fam.partner, far = P && P.lb && CBY[P.lbIn] ? CBY[P.lbIn] : null, fc = far || c;
  const m = incomeAt(fc, 0.5) * ({ hi: 0.12, eca: 0.15, lac: 0.18, eap: 0.18, mena: 0.08, sa: 0.12, ssa: 0.35 }[fc.p] || 0.15);
  eff({ money: -m }); book("Chi phí tang lễ", -m);
  logA('loss:pt', !far ? L`배우자의 장례를 치렀습니다. (−${wonStr(m)})` : tripOutOK() ? L`서둘러 ${ro(far.ko)} 가서 배우자의 장례를 치렀습니다. (−${wonStr(m)})` : L`머물 허가가 없어 ${far.ko}에서 치른 배우자의 장례에 가지 못했습니다. 장례비를 보냈습니다. (−${wonStr(m)})`, 'note');
}
function partnerYear(c) {
  const P = S.fam.partner, who = callName(P.name), hiP = c.p === 'hi' || c.p === 'eca';
  if (P.joinAt != null) {
    if (S.age < P.joinAt) { const x = incomeAt(c, 0.5) * 0.06; S.money -= x; book("Chi phí đi lại thăm bạn đời sống xa", -x); }
    else { P.joinAt = null;
      if (chance(0.8)) { if (!P.ret && !(P.out > 0)) { P.out = 1; P.mvOut = 1; } eff({ h: 4, so: 2 }); log(L`배우자 ${iga(who)} 일을 정리하고 ${ro(c.ko)} 건너왔습니다. 다시 한집에 살게 되었습니다.`, 'warm'); }
      else { log("Những tháng ngày xa cách khiến hai trái tim cũng xa nhau.", 'bad'); divorceNow(c, true); return; } }
  }
  if (P.base == null) { P.k = 0.8; P.base = clamp(pctOfIncome(c, Math.max(1, P.inc || 0) / 0.8) - P_AGE(P.age), 0.05, 0.95); P.dev = 0; P.home = c.id; P.mp = 0; }
  if (P.lb) {}
  else if (P.home !== c.id) { P.home = c.id; P.mp = Math.max(P.mp || 0, S.migPen || 0.18); }
  else if (P.mp > 0) P.mp = Math.max(0, P.mp - 0.015);
  if (P.penOk == null && P.age >= retireAge(c)) partnerPension(P, c);
  if (P.age >= retireAge(c) + 2 && (P.penOk !== 0 || P.age >= 70 || P.out > 0 && P.age >= 66)) {
    if (!P.ret) { P.ret = 1; P.out = 0; if (P.age < 90) log(L`배우자 ${iga(who)} 일을 그만두고 은퇴했습니다.`); }
    P.inc = partnerPension(P, c);
    if (!P.inc && S.job === 'homemaker' && S.age < 62 && S.money < incomeAt(c, 0.5) * 0.25 && (S.flags.last_hmwork == null || S.age - S.flags.last_hmwork >= 3)) S.flags.hmQ = 1;
    return;
  }
  if (P.penOk === 0 && !P.ret && !P.penW && P.age >= retireAge(c) + 2 && !(P.out > 0) && !P.ill && !(P.k < 0.5 && P.sex === 'F')) { P.penW = 1; log(L`배우자 ${iga(who)} 연금이 없어 일을 계속하기로 했습니다.`, 'ev', "Trên thế giới, khoảng 77% người ở độ tuổi nghỉ hưu nhận lương hưu, nhưng ở các nước thu nhập thấp chỉ khoảng 23% (ILO 2021)"); }
  if (P.age < 18) { P.inc = partnerPay(P); return; }
  if (P.out > 0) {
    P.out--;
    if (!P.out) { if (!P.hm) { P.prev = P.job || P.prev; P.job = null; } P.dev = clamp(P.dev - (P.hm ? 0.05 : 0.03), -0.15, 0.15); log(P.hm ? (S.fam.kids.some(k => k.alive && S.age - k.bornAt <= 8) ? L`아이가 자라 배우자 ${iga(who)} 다시 일을 시작했습니다.` : L`배우자 ${iga(who)} 다시 일을 시작했습니다.`) : L`배우자 ${iga(who)} 다시 일자리를 구했습니다.`); P.hm = 0; }
  } else {
    P.dev = clamp(P.dev + (rnd() - 0.5) * 0.03, -0.15, 0.15);
    if (chance(P.job && JOBS[P.job] ? Math.min(0.2, (LAYOFF_P[P.job] || 0.04 * (LAYOFF_K[P.job] || 1)) * 0.75 * (lowInc(c) ? 1.2 : 1)) : lowInc(c) ? 0.035 : 0.03)) {
      P.out = chance(0.6) ? 1 : 2; P.mvOut = 0; eff({ h: -3 });
      const tail = S.income > 0 ? '' : hiP ? " Một thời gian, gia đình sống nhờ trợ cấp thất nghiệp." : " Gia đình mất hẳn nguồn thu nhập.";
      log(S.job === 'seeking' ? L`배우자 ${who}도 일자리를 잃었습니다.${tail}` : L`배우자 ${iga(who)} 일자리를 잃었습니다.${tail}`, 'bad', hiP ? "Trợ cấp thất nghiệp thường bù đắp khoảng một nửa thu nhập trước đó trong một thời gian (OECD)" : null);
    } else if (P.age >= 25 && P.age < 55 && chance(0.04)) {
      P.dev = clamp(P.dev + 0.04, -0.15, 0.15); eff({ h: 2 });
      log(L`배우자 ${iga(who)} 일이 잘 풀려 벌이가 늘었습니다.`);
    }
  }
  P.inc = partnerPay(P) * (P.out ? (P.hm ? 0 : hiP ? 0.5 : 0) : 1);
  if (!P.inc && S.job === 'homemaker' && S.age < 62 && S.money < incomeAt(c, 0.5) * 0.25 && (S.flags.last_hmwork == null || S.age - S.flags.last_hmwork >= 3)) S.flags.hmQ = 1;
  else if (P.inc && S.job === 'homemaker' && S.age >= 18 && S.age < 58 && S.money < -incomeAt(c, 0.5) * 0.5 && (S.flags.last_hmwork == null || S.age - S.flags.last_hmwork >= 4) && chance(0.35)) S.flags.hmQ = 2;
  if (S.flags.ipv === 'on' && !P.lb && chance(0.45 * ipvOnK(S.age))) { eff({ h: -6, hl: -3, so: -2 }); if (chance(0.5)) log("Trong nhà lại xảy ra bạo lực. Bạn không thể nói với ai.", 'bad', IPV_HELP()); }
}
const IPV_L = { ssa: 0.33, sa: 0.3, mena: 0.31, lac: 0.25, hi: 0.2, eca: 0.2, eap: 0.2 };
const IPV_MK = { sa: 0.03, mena: 0.03 };
const ipvAgeK = a => a < 30 ? 1.5 : a < 40 ? 1.15 : a < 50 ? 0.85 : a < 65 ? 0.35 : 0.15;
const ipvOnK = a => a < 50 ? 1 : a < 65 ? 0.75 : 0.5;
function ipvOnset(c) {
  const P = S.fam.partner; let p = -Math.log(1 - (IPV_L[c.p] || 0.25)) / 30;
  if (P && P.out > 0 && !P.hm) p *= 1.4; if (S.q <= 2) p *= 1.2; if (S.fam.marriedAt != null && S.fam.marriedAt < 18) p *= 1.5;
  p *= ipvAgeK(S.age);
  return S.sex === 'F' ? p : p * (IPV_MK[c.p] ?? 0.25);
}
const IPV_FACT = () => S.sex === 'M' ? "Bạo lực từ bạn đời cũng xảy ra với nam giới. Ở Mỹ, khoảng 1 trong 7 nam giới từng ít nhất một lần trong đời bị bạn đời bạo hành thể xác nghiêm trọng. Đó không phải lỗi của bạn (CDC NISVS 2010)" : "Trên thế giới, hơn 1 trong 4 phụ nữ từng ít nhất một lần trong đời bị bạn đời bạo hành. Đó không phải lỗi của họ (WHO 2021)";
const IPV_HELP = () => { const kr = B().id === 'KOR' || S.cur === 'KOR';
  if (S.sex === 'M') return kr ? L`도움: 112, 가정폭력 상담 1366(24시간)` : L`도움: 가정폭력 상담 1366(한국, 24시간), 112 · 다른 나라는 findahelpline.com`;
  return kr ? L`도움: 1366 여성긴급전화(24시간), 112` : L`도움: 1366 여성긴급전화(한국, 24시간) · 다른 나라는 findahelpline.com`; };
function divorceRisk(c) {
  const f = S.fam, y = S.age - (f.marriedAt != null ? f.marriedAt : S.age - 10), W = S.focusW || {};
  const dur = y < 2 ? 0.8 : y < 5 ? 1.7 : y < 10 ? 1.5 : y < 20 ? 0.85 : 0.45;
  const care = 1 - 0.45 * (W.family || 0) - 0.15 * (W.faith || 0) + 0.5 * (W.work || 0);
  const so = S.st.so < 35 ? 2 : S.st.so > 70 ? 0.7 : 1;
  const fix = S.flags.mfix != null && S.age - S.flags.mfix < 5 ? 0.5 : 1;
  return { hi: 0.055, eca: 0.06, lac: 0.036, eap: 0.026, mena: 0.024, sa: 0.0015, ssa: 0.026 }[c.p] * eraDivK(c) * (AGE12 ? 1.25 : affairOK(c) ? 0.65 : 0.87) * dur * care * so * fix * (S.flags.stepStrain != null && S.age - S.flags.stepStrain < 4 ? 1.4 : 1) * (S.fam.partner && S.fam.partner.postEnd > S.age ? 1.4 : 1) * (S.alc || S.gamb || S.drug ? 2.5 : 1) * (S.job === 'prison' ? 4 : 1) * (S.fam.wife2 && S.fam.wife2.alive || S.fam.co ? 1.4 : 1) * (S.fam.partner && S.fam.partner.cohab ? 1.6 : noDivorce(c) && legalWed() ? DIV_PHL : 1) * (S.flags.coupleT != null && S.age - S.flags.coupleT <= 3 ? 0.85 : 1) * (S.age >= 70 ? 0.35 : S.age >= 60 ? 0.6 : 1);
}
function mcCause(y) {
  if (S.flags.mcWhyF) { const w = S.flags.mcWhyF; S.flags.mcWhyF = null; return w; }
  const W = S.focusW || {}, small = S.fam.kids.some(k => k.alive && S.age - k.bornAt < 10 && !k.away);
  return wpick({ temper: 0.43, money: S.money < 0 && S.income > 0 ? (debtHeavy() ? 0.35 : 0.18) : 0.08, affair: 0.08, inlaw: inLawHome(y) ? 0.25 : 0.05,
    chores: small ? 0.12 : 0, work: (W.work || 0) > 0.35 && isWorking() ? 0.6 : 0, drink: S.alc || S.gamb ? 0.7 : 0 });
}
function inLawHome(y) {
  const P = S.fam.partner; if (!S.fam.married || !P || P.ss || S.mig || S.flags.ownHome != null) return null;
  if (S.flags.stayHome && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent))) return 'my';
  if (y == null) y = S.age - (S.fam.marriedAt != null ? S.fam.marriedAt : S.age);
  if (S.sex === 'F' && patri(C()) && legalWed() && y < 12 && (P.nat || S.born) === S.cur && !ptAway() && (S.flags.left == null || S.flags.left >= S.fam.marriedAt)) return 'in';
  return null;
}
function divSplit(c, fault) {
  const f = S.fam, P = f.partner, y = S.age - (f.marriedAt != null ? f.marriedAt : S.age);
  if (S.flags.nwWed == null) return Math.max(0, S.money) * 0.3;
  const brought = S.flags.ptIn || 0, gain = netWorth() - S.flags.nwWed - brought - (S.flags.sepM || 0);
  const pi = Math.max(0, P.inc || 0), mi = Math.max(0, S.income || 0), ps = pi + mi > 0 ? pi / (pi + mi) : 0.5;
  let share = 0.5 + (ps - 0.5) * 0.6 * (1 - Math.min(y, 20) / 25);
  if (c.p === 'mena' || c.p === 'sa') share *= 0.4;
  if (P.cohab || unionOf(P) === 'none') share *= 0.5;
  if (fault && ['CHN', 'TWN'].includes(c.id) && gain > 0) share = fault === 'me' ? 1 - (1 - share) * 0.75 : share * 0.75;
  const s = brought + share * gain;
  return s > 0 ? Math.min(s, Math.max(0, netWorth())) : s;
}
function divComp(c, fault, P) {
  if (!fault || !P || !legalWed()) return 0;
  const east = { KOR: 0.6, JPN: 0.4, TWN: 0.4, CHN: 0.4 }[c.id];
  if (fault !== 'viol' && (!east || c.id === 'CHN')) return 0;
  const k = east || (c.p === 'hi' ? 0.3 : c.p === 'eca' || c.p === 'lac' ? 0.15 : 0);
  if (!k || !chance(east ? 0.85 : c.p === 'hi' ? 0.5 : 0.3)) return 0;
  const med = incomeAt(c, 0.5), want = med * k * (fault === 'viol' ? 1 : 0.8);
  return fault === 'me' ? want : Math.min(want, Math.max(0, P.inc || 0) * 0.8 + med * 0.05);
}
function divorceNow(c, inYear, fault) {
  if (S.flags.ptNw) { const x = S.flags.ptNw; S.flags.ptNw = 0; S.money += x; if (inYear) book(x > 0 ? "Tiền bạn đời mang theo" : "Nợ bạn đời mang theo", x); }
  if (!fault && S.flags.ipv === 'on') fault = 'viol';
  if (S.flags.ipv === 'on') S.flags.ipv = 'over';
  S.flags.stepAt = null;
  if (S.fam.partner && S.fam.partner.name) S.flags.exNm = { n: callName(S.fam.partner.name), sex: S.fam.partner.sex };
  { const P = S.fam.partner; if (P && P.name) S.flags.exP = { name: P.name, sex: P.sex, age: P.age, at: S.age, y: Math.max(1, S.age - (S.fam.marriedAt != null ? S.fam.marriedAt : S.age)), q: P.q, job: P.job, rel: P.rel, nat: P.nat, v: S.flags.ipv ? 1 : 0 }; }
  const f = S.fam, P0 = f.partner, split = divSplit(c, fault), comp = divComp(c, fault, f.partner), m0 = S.money, back = S.flags.nwWed != null ? S.flags.ptIn || 0 : 0, who = callName(f.partner.name); f.married = false; f.partner.divorced = true; f.partner.endAt = S.age; f.co = null;
  (S.flags.exs || (S.flags.exs = [])).push({ n: f.partner.name.full, y: Math.max(0, S.age - (f.marriedAt != null ? f.marriedAt : S.age)), w: unionOf(f.partner) === 'm' ? 1 : 0 });
  const wed = legalWed(), big = Math.abs(split) > incomeAt(c, 0.5) * 0.05, annul = S.flags.annulNow, sep = wed && noDivorce(c) && !annul && !P0.ss; S.flags.annulNow = 0;
  if (sep) { P0.sep = 1; S.flags.phlSep = P0.name.full; (S.flags.exs || []).slice(-1).forEach(x => { x.s = 1; }); }
  else if (annul) S.flags.phlSep = null;
  let t = (sep ? L`${wa(who)} 따로 살게 되었습니다. 이혼 제도가 없어 법적으로는 여전히 부부입니다.` : wed && !annul ? L`${wa(who)} 이혼했습니다.` : L`${wa(who)} 헤어졌습니다.`) + (!big ? '' : split > 0 ? ' ' + L`함께 이룬 재산을 나눴습니다. 결혼 전에 각자 가진 것은 각자의 몫입니다. (−${wonStr(split)})`
    : ' ' + (back < 0 && split - back < -incomeAt(c, 0.5) * 0.05 ? L`${iga(who)} 결혼 전에 지고 온 빚과 함께 진 빚의 자기 몫을 가져갔습니다. (+${wonStr(-split)})`
      : back < 0 ? L`${iga(who)} 결혼 전에 지고 온 빚은 자기가 가져갔습니다. (+${wonStr(-split)})` : L`함께 진 빚도 나눴습니다. ${iga(who)} 자기 몫의 빚을 가져갔습니다. (+${wonStr(-split)})`));
  if (big && split > 0 && split > Math.max(0, m0) && homeV() > 0) t += ' ' + "Bạn giữ lại căn nhà và vay nợ để trả phần còn thiếu cho người kia.";
  if (fault === 'viol' && big && split > 0) t += ' ' + (['CHN', 'TWN'].includes(c.id) ? "Tòa án đã giảm phần tài sản của người gây ra bạo lực." : "Tài sản được chia theo luật, dựa trên phần đóng góp của mỗi người, tách biệt với chuyện bạo lực.");
  if (comp > 0) t += ' ' + (fault === 'me' ? L`내 외도로 끝난 결혼이라 위자료를 물어 주었습니다. (−${wonStr(comp)})` : fault === 'viol' ? L`배우자의 폭력에 대한 위자료를 받았습니다. (+${wonStr(comp)})` : L`배우자의 외도에 대한 위자료를 받았습니다. (+${wonStr(comp)})`);
  const net = split + (comp > 0 ? (fault === 'me' ? comp : -comp) : 0);
  eff({ h: -10, so: -8, money: -net }); S.yearMark = 'loss'; S.flags.nwWed = null;
  if (f.wife2 && f.wife2.alive) t += ' ' + promoteWife2(c);
  if (inYear) { log(t, 'bad'); book("Chia tài sản khi ly hôn", -net); homemakerAlone(false); }
  S.flags.custV = fault === 'viol' ? 1 : 0;
  for (const k of f.kids) if (k.sk && k.alive && !k.grown && S.age - k.bornAt < 18) k.away = 1;
  { const P = P0, w = P.lb && P.lbIn ? P.lbIn : P.exIn || null; S.flags.exIn = w && w !== S.cur && CBY[w] ? w : null; P.exIn = null; }
  { const lb = f.kids.filter(k => k.alive && k.lb); P0.lb = 0; S.flags.famWait = null;
    if (lb.length) { for (const k of lb) { k.lb = 0; k.cust = k.sk ? k.cust : 1; } S.flags.custody = S.flags.custody || 'them'; S.flags.exInc = P0.inc || 0; S.flags.exName = P0.name; S.flags.exSs = P0.ss ? 1 : 0; } }
  custodyAsk(P0);
  skAfterAsk(f, P0);
  return t;
}
const skAftKids = () => { const A = S.flags.skAft; return A ? S.fam.kids.filter(k => k.alive && k.sk && k.step === A.m && k.exOf != null) : []; };
function skAfterAsk(f, P0 = f.partner) {
  const ks = f.kids.filter(k => k.sk && k.alive && k.step === f.marriages); if (!ks.length) return;
  for (const k of ks) k.exOf = P0.name.full;
  S.flags.skAft = { m: f.marriages, ex: callName(P0.name), y: Math.max(1, S.age - (f.marriedAt != null ? f.marriedAt : S.age)), at: S.age };
  if (S.phase === 'life' && S.t < 0.95) queue(Math.min(0.98, S.t + 0.05), 'dec', 'stepafter', {}); else S.flags.skAftQ = 1;
}
const SKW_C = { JPN: 0.5, KOR: 0.85 };
function skWidow(c, P) {
  const f = S.fam, ks = f.kids.filter(k => k.alive && k.sk && !k.away && !k.grown && S.age - k.bornAt < 18 && (k.pm == null || k.pm === f.marriages));
  if (!ks.length || S.isComp) return;
  const bx = P.sex === 'F' ? 'M' : 'F', oa = Math.max(20, P.age + ri(-4, 4)), lt = lifeTable(c, bx).q;
  let sv = 1; for (let x = 20; x < Math.min(110, oa); x++) sv *= 1 - lt[x];
  const there = chance(sv * 0.75), go = [], stay = [];
  for (const k of ks) {
    const ka = S.age - k.bornAt, lived = Math.min(ka, Math.max(0, S.age - (f.marriedAt != null ? f.marriedAt : S.age)));
    const pat = ['sa', 'mena', 'ssa'].includes(c.p) ? (bx === 'M' ? 1.2 : 0.9) : 1;
    const p = clamp(0.65 - 0.035 * Math.min(lived, 10), 0.2, 0.75) * (ka >= 14 ? 0.7 : 1) * (SKW_C[c.id] || 1) * pat;
    if (there && chance(p)) { k.away = 1; k.ra = 1; k.bp = bx; k.bpAt = S.age; go.push(k); } else stay.push(k);
  }
  const nm = xs => xs.length > 1 ? listAnd(xs.map(x => callName(x.name))) : callName(xs[0].name);
  const F = "Khi bố hoặc mẹ qua đời, đứa trẻ thường về sống với người bố hoặc mẹ ruột còn lại. Bố dượng hay mẹ kế muốn tiếp tục nuôi đứa trẻ thì cần sự đồng ý của người kia, quyết định của tòa án hoặc được chỉ định làm người giám hộ (Đạo luật Trẻ em 1989 của Anh, Điều 909-2 Bộ luật Dân sự Hàn Quốc, Mason 1998)";
  if (go.length) { eff({ h: -4 }); log((bx === 'M' ? L`${eun(nm(go))} 친아버지 곁으로 가서 살게 되었습니다.` : L`${eun(nm(go))} 친어머니 곁으로 가서 살게 되었습니다.`) + ' ' + "Hai bên vẫn gặp nhau vào cuối tuần và những kỳ nghỉ học.", 'bad', F); }
  if (stay.length) {
    const formal = c.p === 'hi' || c.p === 'eca' || ['KOR', 'JPN', 'CHN', 'BRA', 'MEX', 'ARG', 'CHL', 'ZAF'].includes(c.id);
    log(there ? (bx === 'M' ? L`${eun(nm(stay))} 친아버지와 의논한 끝에 나와 함께 살며 다니던 학교를 계속 다니기로 했습니다.` : L`${eun(nm(stay))} 친어머니와 의논한 끝에 나와 함께 살며 다니던 학교를 계속 다니기로 했습니다.`)
      : formal ? L`법원에 후견인 신청을 해 ${eul(nm(stay))} 계속 키우게 되었습니다.` : L`${eun(nm(stay))} 그대로 나와 함께 살았습니다.`, 'ev', F);
  }
}
function skCut(k) {
  k.cut = S.age; k.alive = false;
  const f = S.fam, n = callName(k.name), drop = (f.grand || []).filter(g => g.of === n && g.ofSex === k.sex && g.home == null);
  if (!drop.length) return;
  f.grand = f.grand.filter(g => !drop.includes(g)); S.flags.grand = Math.max(0, (S.flags.grand || 0) - drop.length);
  S.flags.ggrand = Math.max(0, (S.flags.ggrand || 0) - drop.reduce((t, g) => t + (g.kb || 0), 0));
}
const kidsCount = () => S.fam.kids.filter(k => !k.cut).length;
const ownKids = () => S.fam.kids.filter(k => !k.sk && !k.cut);
const skOnly = () => !ownKids().some(k => k.alive) && S.fam.kids.some(k => k.sk && k.alive && !k.cut);
function kidLife(k, c, ka) {
  const uni = k.path === 'uni', pp = Math.max(S.pct || 0, S.flags.careerPct || 0) || 0.4, cc = k.abroad && CBY[k.abroad] ? CBY[k.abroad] : c;
  const pct = clamp(0.5 + 0.4 * (pp - 0.5) + (uni ? 0.15 : -0.05) + (k.drive ? 0.02 : 0) + (rnd() - 0.5) * 0.45, 0.03, 0.97);
  k.urb = k.abroad || S.urban ? (k.abroad || chance(0.9) ? 1 : 0) : (chance(clamp(cc.urb / 100 * (uni ? 1.2 : 0.7), 0.1, 0.9)) ? 1 : 0);
  const u0 = S.urban; S.urban = !!k.urb;
  try { k.job = partnerJobFor({ base: pct, age: ka, sex: k.sex, deg: uni ? undefined : false, uni, dd: ddIDk(k.dd) }, cc); } finally { S.urban = u0; }
  if (ddKidJob(k, cc)) { k.near = 1; k.jA = S.age; return; }
  if (rohCamp() && !k.abroad) { k.job = k.sex === 'F' ? pick(['artisan', 'vendor', 'homemaker']) : pick(ROH_CAMP_J); k.urb = 0; }
  let dream = false;
  if (k.dj && JOBS[k.dj] && k.djK !== 'real' && (JOBS[k.dj].e < 4 || uni) && chance((k.djK === 'look' ? 0.14 : 0.1) * (JOBS[k.dj].special ? 0.3 : 1))) { k.job = k.dj; dream = true; }
  if (JOBS[k.job] && JOBS[k.job].u === -1 && !k.abroad) k.urb = 0;
  k.near = !k.abroad && !(k.urb && !S.urban) && chance(cc.p === 'hi' ? 0.5 : 0.65) ? 1 : 0;
  if (!k.near && !k.abroad && k.urb && CITIES[cc.id]) {
    const l = CITIES[cc.id].split(',').filter(x => x && x !== S.city); let h = 0; for (const ch of String((k.name && k.name.full) || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    if (l.length) k.city = l[h % l.length];
  }
  k.jA = S.age;
  if (ka > 30 || S.job === 'prison') return;
  const n = callName(k.name), jn = JOBS[k.job] ? frSx(JOBS[k.job].n.replace(/ \(.*\)$|（.*）$/, ''), k.sex) : '';
  if (jn && !nkCut(k)) log(dream ? L`${iga(n)} 어릴 적 꿈이던 ${ro(jn)} 일하기 시작했습니다.` : uni ? L`${iga(n)} 대학을 마치고 ${ro(jn)} 일하기 시작했습니다.` : L`${eun(n)} ${ro(jn)} 일하고 있습니다.`, dream ? 'warm' : undefined);
}
function kidLine(k) {
  const ka = S.age - k.bornAt, out = [];
  if (kidWd(k, ka)) out.push("Ở nhà");
  else if (k.job && ka >= 20 && JOBS[k.job] && !(kidInPr(k) && k.jobPr)) out.push(ka >= 65 ? "nghỉ hưu" : frSx(JOBS[k.job].n.replace(/ \(.*\)$|（.*）$/, ''), k.sex));
  if (k.wed) out.push(frSx(L`기혼${LBL}`, k.sex)); else if (k.div) out.push(frSx(k.sep ? L`별거${LBL}` : L`이혼${LBL}`, k.sex)); else if (k.cuT) out.push("sống chung với người yêu");
  if (k.kb) out.push(k.kb === 1 ? "một con" : L`아이 ${k.kb}명`);
  if (kidInPr(k)) out.push("đang ở tù");
  else if (k.withMe || ((k.stay || !k.grown) && ka >= 18 && !k.away && !k.abroad)) out.push("sống cùng bạn");
  else if (k.placed) out.push(k.placed.k === 'kin' ? L`${kinWord(k.placed.who)} 댁에서 지냄` : k.placed.fos ? "sống với gia đình nuôi tạm thời" : "sống ở mái ấm trẻ em");
  else if (k.lb && CBY[k.awayIn]) out.push(L`${CBY[k.awayIn].ko}에서 기다림`);
  else if (k.away && k.bp) out.push(k.bp === 'M' ? "sống với bố ruột" : "sống với mẹ ruột");
  else if (k.away && k.awayIn && k.awayIn !== S.cur && CBY[k.awayIn]) { const w = CBY[k.awayIn].ko; out.push(S.flags.exSs ? L`${w}에서 다른 부모와 삶` : S.sex === 'F' ? L`${w}에서 아빠와 삶` : L`${w}에서 엄마와 삶`); }
  else if (k.away) out.push(S.flags.exSs ? "sống với người phụ huynh còn lại" : S.sex === 'F' ? "sống với bố" : "sống với mẹ");
  else if (k.abroad && CBY[k.abroad]) out.push(L`${CBY[k.abroad].ko}에서 삶`);
  else if (k.grown) out.push(k.near ? "sống gần nhà" : k.city ? L`${k.city}에서 삶` : k.urb === 0 ? "sống ở làng khác" : "sống riêng");
  return out;
}
const moveOutOK = () => S.age >= 18 && S.age < 60 && withParents() && !S.owns.house && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !studyAway() && S.job !== 'prison'
  && !S.refugee && !(S.serveLeft > 0) && !S.nomad && !S.flags.hideCN;
function homeBought() {
  if (S.age < 18) return '';
  if (S.flags.oldHome === 'care') { S.flags.oldHome = 'own'; S.flags.last_oldhome = S.age; return ' ' + "Bạn rời viện dưỡng lão, chuyển sang nhà mới."; }
  if (inLawHome() === 'in') { S.flags.ownHome = S.age; return ' ' + "Bạn rời nhà bố mẹ chồng, chuyển sang nhà mới."; }
  if (!withParents()) return '';
  S.flags.left = S.age; S.flags.stayHome = 0; if (S.flags.la == null) S.flags.la = S.age; if (S.fam.married) S.flags.ownHome = S.age;
  return ' ' + "Bạn rời nhà bố mẹ, chuyển sang nhà mới.";
}
const moveHomeOK = () => S.age >= 20 && S.age <= 39 && !withParents() && !S.fam.married && !S.owns.house && S.cur === S.born && !S.mig && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent))
  && S.job !== 'prison' && !S.refugee && !(S.serveLeft > 0) && !S.nomad && !S.flags.hideCN && !studyAway() && !S.flags.defector
  && (S.job === 'seeking' || S.money < 0 || (S.fam.partner && S.fam.partner.divorced && S.fam.partner.endAt != null && S.age - S.fam.partner.endAt <= 2))
  && !(parElsewhere() && isWorking()) && !vowedHome();
function moveHome() {
  if (parElsewhere()) { S.urban = S.bornUrban; S.city = S.bornCity; }
  S.flags.stayHome = 1; S.flags.backHome = S.age; eff({ h: -1, so: 2 }); S.yearMark = S.yearMark || 'move';
  return S.fam.mom.alive ? "Bạn thu dọn đồ đạc và về lại nhà bố mẹ. Lâu lắm rồi bạn mới lại được ăn bữa cơm mẹ nấu." : "Bạn thu dọn đồ đạc và về lại nhà bố mẹ. Bố đã lặng lẽ dọn sẵn căn phòng cũ cho bạn.";
}
function moveOut() {
  S.flags.left = S.age; S.flags.stayHome = 0; if (S.flags.la == null) S.flags.la = S.age; eff({ h: 3, so: -1 }); S.yearMark = S.yearMark || 'move';
  return S.fam.married ? "Bạn rời nhà bố mẹ và cùng bạn đời dựng tổ ấm riêng." : "Bạn rời nhà bố mẹ và lần đầu tiên tự lập ở riêng.";
}
const stepKids = () => S.fam.married && S.fam.partner && S.fam.partner.alive ? S.fam.kids.filter(k => k.alive && !k.away && !(k.sk && (k.pm == null || k.pm === S.fam.marriages)) && k.step === S.fam.marriages && S.age - k.bornAt < 19) : [];
const ptKid = k => { const P = S.fam.partner, co = S.flags.custOf, x = (co && S.age - co.at <= 1 && co.n) || (!S.fam.married && S.flags.exName) || (P && P.name); return k.op && k.op.full && x && x.full ? k.op.full === x.full : !(k.step && k.step === S.fam.marriages); };
const custodyKids = () => S.fam.kids.filter(k => k.alive && S.age - k.bornAt < 18 && !k.away && !k.grown && !k.sk && ptKid(k));
function custodyAsk(P) {
  const prev = S.flags.exName; S.flags.exName = P && P.name ? P.name : null; S.flags.custOf = S.flags.exName ? { n: S.flags.exName, at: S.age } : null;
  if (!custodyKids().length) { S.flags.exName = prev; S.flags.custOf = null; return; }
  S.flags.exInc = P && P.inc || 0; S.flags.exSs = P && P.ss ? 1 : 0;
  if (S.phase === 'life' && S.t < 0.95) queue(Math.min(0.97, S.t + 0.04), 'dec', 'custody', {}); else S.flags.custodyQ = 1;
}
const exFar = () => { const w = S.flags.exIn; return w && w !== S.cur && CBY[w] ? CBY[w] : null; };
const CUST_MOM = { hi: 0.78, eca: 0.8, lac: 0.8, eap: 0.75, mena: 0.55, sa: 0.55, ssa: 0.55 };
const custShare = c => c.p === 'hi' ? (['SWE', 'BEL', 'NOR', 'DNK', 'NLD'].includes(c.id) ? 0.3 : 0.12) : c.p === 'eca' ? 0.06 : c.p === 'lac' || c.p === 'eap' ? 0.04 : 0;
const custGrant = (c, mom) => ['mena', 'sa', 'ssa'].includes(c.p) ? (mom ? 0.75 : 0.9) : (mom ? 0.9 : 0.75);
const HADANA = { SDN: [7, 9] }, HADANA_KEEP = 0.15;
const hadanaOn = c => !!HADANA[c.id] && S.rel === 'M' && !S.flags.exSs;
const hadAge = (c, k) => HADANA[c.id][k.sex === 'M' ? 0 : 1];
function hadanaYear() {
  const c = C(); if (!hadanaOn(c)) return;
  const mom = S.sex === 'F', ex = S.flags.exName ? callName(S.flags.exName) : "bạn đời cũ";
  for (const k of S.fam.kids) {
    if (!k.hd || !k.alive || k.grown || k.placed || k.lb) continue;
    const ka = S.age - k.bornAt; if (ka < hadAge(c, k)) continue;
    k.hd = 0; const nm = callName(k.name);
    if (ka >= 18) continue;
    if (mom && !k.away && !chance(HADANA_KEEP)) { k.away = k.ra = 1; k.cust = 0; eff({ h: -4 }); log(L`${iga(nm)} ${ka}세가 되어, ${c.ko}의 가족법에 따라 ${ex}의 집으로 가서 살게 되었습니다.` + ' ' + "Bạn thường xuyên đến thăm.", 'bad'); }
    else if (!mom && k.away && (!k.awayIn || k.awayIn === S.cur) && !chance(HADANA_KEEP)) { k.away = k.ra = 0; k.awayIn = 0; k.cust = 0; k.lostAt = null; eff({ h: 3 }); S.yearMark = S.yearMark || 'baby'; log(L`${iga(nm)} ${ka}세가 되어, ${c.ko}의 가족법에 따라 내 집으로 와서 살게 되었습니다.`); }
  }
}
const custPay = n => n >= 2 ? 0.25 : 0.17, custPaid = c => c.p === 'hi' || c.p === 'eca' ? 0.35 : c.p === 'lac' || c.p === 'eap' ? 0.25 : 0.15;
function custodyFact(c) {
  if (hadanaOn(c)) return "Theo Luật Nhân thân Hồi giáo năm 1991 của Sudan, sau khi ly hôn con nhỏ ở với mẹ, và quyền nuôi con chuyển sang người cha khi con trai lên 7 tuổi, con gái lên 9 tuổi. Quyền giám hộ và tiền nuôi con vẫn do người cha đảm nhận (OECD SIGI 2019)";
  return (c.p === 'mena'|| c.p === 'sa' || c.p === 'ssa') && S.rel === 'M' ? "Ở những nơi áp dụng luật gia đình Hồi giáo, con nhỏ thường ở với mẹ, nhưng quyền giám hộ pháp lý thường vẫn thuộc về bố. Con cái lớn lên ở đâu khác nhau rất nhiều tùy theo quốc gia và phong tục của từng gia đình"
    : c.p === 'sa' ? "Ở Nam Á, người bố thường được xem là người giám hộ hợp pháp, nhưng con nhỏ thường ở với mẹ (Đạo luật Giám hộ và Người chưa thành niên Ấn Độ giáo của Ấn Độ: thường là mẹ cho đến khi con lên năm tuổi)"
    : c.p === 'ssa' ? "Ở nhiều vùng châu Phi, theo phong tục, con cái thường thuộc về họ nội, nhưng trên thực tế, số trẻ sống với mẹ lại nhiều hơn"
    : c.id === 'KOR' ? "Ở Hàn Quốc, khoảng 78% người một mình nuôi con trong độ tuổi 20–39 là mẹ (Cục Thống kê Hàn Quốc, phân tích hộ gia đình đơn thân trẻ năm 2023)"
    : c.id === 'JPN' ? (calYr() >= 2026 ? "Ở Nhật Bản, khoảng 85% cặp vợ chồng ly hôn trao toàn bộ quyền cha mẹ đối với các con cho người mẹ (Bộ Y tế, Lao động và Phúc lợi, Thống kê Động thái Dân số). Từ tháng 4 năm 2026, các cặp vợ chồng cũng có thể chọn cùng giữ quyền cha mẹ" : "Ở Nhật Bản, khoảng 85% cặp vợ chồng ly hôn trao toàn bộ quyền cha mẹ đối với các con cho người mẹ (Bộ Y tế, Lao động và Phúc lợi, Thống kê Động thái Dân số)")
    : c.id === 'USA' ? "Ở Mỹ, khoảng 80% người trực tiếp nuôi con khi bố mẹ sống riêng là người mẹ (Cục Điều tra Dân số Hoa Kỳ 2020)"
    : c.id === 'CAN' ? "Trong số trẻ em Canada có bố mẹ chia tay, khoảng 70% sống chủ yếu với mẹ, 15% với bố, và 9% sống ở hai nhà với thời gian ngang nhau (Cục Thống kê Canada 2011)"
    : "Trẻ có bố mẹ chia tay phần lớn sống chủ yếu với mẹ. Ở Canada và Mỹ, 70–80% sống chủ yếu với mẹ, một hai trong mười em sống với bố, số còn lại đi về giữa hai nhà (Cục Thống kê Canada 2011, Cục Điều tra Dân số Hoa Kỳ 2020)";
}
const custBackKids = () => S.fam.kids.filter(k => k.alive && k.away && !k.lb && !k.placed && !k.sk && !k.grown && S.age - k.bornAt < 18 && (!k.awayIn || k.awayIn === S.cur));
const custBackOK = () => custBackKids().length > 0 && S.age >= 20 && S.job !== 'prison' && !S.flags.hideCN && !(S.serveLeft > 0);
function custBackHome(ks) {
  for (const k of ks) { k.away = 0; k.ra = 0; k.awayIn = 0; k.cust = 1; k.bd = (k.bd || 0) + 3; k.lostAt = null; }
  if (!custBackKids().some(k => k.cust)) S.flags.custody = 'me';
  S.flags.custAt = S.age; S.yearMark = S.yearMark || 'baby';
}
function custBack() {
  const c = C(), ks = custBackKids(), m = incomeAt(c, 0.5); if (!ks.length) return '';
  const ex = S.flags.exName ? callName(S.flags.exName) : "bạn đời cũ", kn = ks.length > 1 ? "các con" : callName(ks[0].name);
  const wants = ks.some(k => S.age - k.bornAt >= 12 && bondScore(k, 'kid') >= 20);
  const steady = (isWorking() || S.retired) && !debtHeavy() && (S.fam.married || S.owns.house || S.money > 0);
  if (chance(wants ? 0.4 : 0.15)) { custBackHome(ks); eff({ h: 8, so: 3 }); return { t: L`${wa(ex)} 오래 이야기를 나눈 끝에 ${eul(kn)} 다시 내가 키우기로 했습니다. 아이의 방을 다시 꾸미며 마음이 벅찼습니다.`, k: 'warm' }; }
  const fee = m * (c.p === 'hi' ? 0.15 : 0.06); S.money -= fee; book("Chi phí kiện tụng giành quyền nuôi con", -fee);
  const mom = S.sex === 'F' && !S.flags.exSs;
  const p = clamp(0.15 + (wants ? 0.25 : 0) + (steady ? 0.06 : -0.05) - 0.12 * recW() + (custGrant(c, mom) - 0.825), 0.06, 0.55);
  if (chance(p)) { custBackHome(ks); eff({ h: 6, so: 2 }); return { t: L`${iga(ex)} 반대해 법원에 양육권 변경을 청했습니다. 법원은 ${eul(kn)} 내가 키우는 편이 낫다고 보았습니다. (−${wonStr(fee)})`, k: 'warm' }; }
  eff({ h: -5, so: -1 }); for (const k of ks) k.bd = (k.bd || 0) - 1;
  return { t: L`${iga(ex)} 반대해 법원에 양육권 변경을 청했지만, 법원은 지금처럼 지내는 편이 아이에게 낫다고 보았습니다. 주말마다 만나는 날을 더 소중히 하기로 했습니다. (−${wonStr(fee)})`, k: 'bad' };
}
const PEN_SH = { lac: 0.7, eap: 0.65, sa: 0.35, mena: 0.35, ssa: 0.2 };
const penDraw = c => c.p === 'hi' || c.p === 'eca' || chance(PEN_SH[c.p] || 0.3) ? 1 : 0;
function partnerPension(P, c) {
  const med = incomeAt(c, 0.5), hiP = c.p === 'hi' || c.p === 'eca';
  if (P.penOk == null) P.penOk = penDraw(c);
  if (!P.penOk) return 0;
  const pay = partnerPay(P);
  return hiP ? clamp(pay * 0.45, med * 0.25, med * 0.9) : clamp(pay * 0.3, med * 0.1, med * 0.6);
}
const ptRetOld = (age, pen, c) => age >= retireAge(c) + 2 && (pen !== 0 || age >= 70);
function ptRetAtStart(P, c, pen) {
  if (pen != null) P.penOk = pen;
  if (P.age < retireAge(c)) return;
  if (P.penOk == null) P.penOk = penDraw(c);
  if (ptRetOld(P.age, P.penOk, c)) { P.ret = 1; P.out = 0; P.inc = partnerPension(P, c); }
}
function homemakerAlone(widow) {
  if (S.job !== 'homemaker') return;
  const c = C(), P = S.fam.partner, hiP = c.p === 'hi' || c.p === 'eca';
  if (S.age < retireAge(c)) { S.job = 'seeking'; S.flags.seekY = 0; log("Bạn bắt đầu tìm việc trở lại để lo cái ăn cái mặc."); return; }
  S.job = 'retired'; S.retired = true;
  S.pension = Math.max(S.pension || 0, pensionAmount() + (widow && hiP && P ? P.inc * (P.ret ? 0.6 : 0.25) : 0));
  if (S.pension > 0) log(widow && hiP ? "Bạn sống bằng lương hưu tử tuất của người bạn đời đã khuất và lương hưu của chính mình." : "Bạn sống bằng lương hưu.");
}
const KIDS_KN = [[2.2, 1.05], [2.75, 1.4], [3.4, 1.55], [4, 1.6], [4.5, 1.9], [6, 2.7]];
const KIDS_K = { BEN:1.65, BFA:1.55, COG:1.54, COM:1.41, DOM:0.97, DZA:1.66, FJI:1.4, GAB:1.36, GIN:1.53, GUY:1.04, HND:1.1, HTI:1.66, ISR:3.48, JOR:1.57, KAZ:2.74, KGZ:1.84, LAO:1.11, LBN:1.34, LBR:1.4, MNG:1.55, MOZ:1.75, MRT:2.27, MWI:1.24, NAM:1.7, NER:2.44, OMN:1.47, PRY:1, PSE:2.35, SAU:1.33, SDN:1.58, SEN:1.4, SLE:1.32, SOM:4.28, SSD:1.35, SWZ:1.51, TGO:1.52, TJK:2.91, TKM:2.44, UGA:1.61, UZB:3.58, ZWE:1.34 };
function kidsK(c) {
  const t = c.tfr; if (t <= 2.2) return 1.05;
  if (!c.yr && KIDS_K[c.id] != null) return KIDS_K[c.id];
  const K = KIDS_KN; let i = 1; while (i < K.length - 1 && t > K[i][0]) i++;
  const [a, b] = [K[i - 1], K[i]]; return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
}
const kidsW = c => c.tfr * kidsK(c);
const kidsA = c => 0.55 + clamp((c.tfr - 4.5) * 0.1, 0, 0.15);
function kidsTarget(c, tfr = c.tfr) {
  if (chance(c.p === 'hi' || c.p === 'eca' ? 0.17 : 0.07)) return 0;
  let n = 1, lim = Math.exp(-Math.max(0.2, tfr * 1.05 - 1)), p = 1; while (true) { p *= rnd(); if (p < lim) break; n++; } return Math.min(n, 9);
}
function tfrAt(c, yr) {
  const t = Math.max(0, yr - 2025);
  if (c.tfr > 1.9) return 1.9 + (c.tfr - 1.9) * Math.exp(-t / 45);
  return c.tfr < 1.5 ? c.tfr + (1.5 - c.tfr) * (1 - Math.exp(-t / 50)) : c.tfr;
}
const youngDeath = c => clamp(c.u5 / 1000 * 0.75 + 0.01, 0.01, 0.15);
const KID_DIV = { hi: 0.011, eca: 0.011, lac: 0.008, eap: 0.006, mena: 0.005, ssa: 0.006, sa: 0.0008 }, KID_DIV_C = { USA: 0.013, KOR: 0.009, JPN: 0.008, CHN: 0.008, IND: 0.0006 };
function familyNews(c) {
  const a = S.age, f = S.fam; if (a < 45 || S.job === 'prison' || S.flags.hideCN || S.isComp || (typeof farFromNK === 'function' && farFromNK())) return;
  for (const k of f.kids) if (k.alive && k.back != null && a >= k.back) { k.back = null; if (S.flags.oldHome !== 'kid') { k.withMe = 0; log(L`${iga(callName(k.name))} 다시 따로 살림을 차려 나갔습니다.`); } }
  if (S.flags.newsAt != null && a - S.flags.newsAt < (a >= 60 ? 1 : 2)) return;
  const med0 = incomeAt(c, 0.5), out = [];
  for (const k of f.kids) {
    if (!k.alive || k.sk && k.away || kidInPr(k) || nkCut(k)) continue;
    const ka = a - k.bornAt, n = callName(k.name), far = !!k.abroad;
    const st = k.job && LADDER[k.job] && LADDER[k.job][0];
    if (st && st.k === 'p' && ka >= 33 && ka <= 55 && !k.nUp) out.push([0.05, () => { k.nUp = 1; eff({ h: 2 }); return kmHome(k) && !far ? [L`${iga(n)} 일하는 곳에서 ${iga(frSx(st.n, k.sex))} 되었습니다. 그날 저녁 식탁에서 다 같이 축하했습니다.`, 'warm', 'meal'] : [L`${iga(n)} 일하는 곳에서 ${iga(frSx(st.n, k.sex))} 되었다는 소식을 들었습니다.`, 'warm']; }]);
    if (ka >= 28 && ka <= 50 && !k.nHome && !k.withMe && !k.stay && k.grown) out.push([0.035 * (HOME_OWN_C[c.id] || HOME_OWN_R[c.p] || 0.6), () => { k.nHome = 1; eff({ h: 2 }); return [far ? L`${iga(n)} ${CBY[k.abroad] ? CBY[k.abroad].ko : ''}에 집을 마련했다는 소식을 들었습니다.` : L`${iga(n)} 집을 마련했습니다. 집들이에 가서 한참을 둘러보았습니다.`, 'warm']; }]);
    const kc = kidLand(k), kNoDiv = kc.id === 'PHL' && S.rel !== 'M';
    if (k.wed && !k.div && ka >= 28 && ka <= 62) out.push([(KID_DIV_C[c.id] ?? KID_DIV[c.p] ?? 0.006) * (kNoDiv ? DIV_PHL : 1), () => {
      k.div = a; k.wed = 0; if (kNoDiv) k.sep = 1; eff({ h: -4 });
      if (!far && a >= 55 && !k.withMe && S.flags.oldHome !== 'care' && chance(0.25)) { k.withMe = 1; k.back = a + ri(1, 4); return [kNoDiv ? L`${iga(n)} 배우자와 따로 살게 되었습니다. 한동안 집에 들어와 함께 지내기로 했습니다. 곁에서 해 줄 수 있는 건 따뜻한 밥 한 끼였습니다.` : L`${iga(n)} 이혼했습니다. 한동안 집에 들어와 함께 지내기로 했습니다. 곁에서 해 줄 수 있는 건 따뜻한 밥 한 끼였습니다.`, 'bad']; }
      return [kNoDiv ? L`${iga(n)} 배우자와 따로 살게 되었습니다. 곁에서 해 줄 수 있는 게 많지 않아 마음이 무거웠습니다.` : L`${iga(n)} 이혼했습니다. 곁에서 해 줄 수 있는 게 많지 않아 마음이 무거웠습니다.`, 'bad']; }]);
    if (k.div && !k.wed && !k.rewed && !k.sep && ka < 60) out.push([0.06, () => { k.rewed = 1; k.wed = a; k.back = null; if (k.withMe && S.flags.oldHome !== 'kid') k.withMe = 0; eff({ h: 3 }); return [L`${iga(n)} 다시 결혼했습니다. 이번에는 가까운 사람들만 모여 조용히 식을 올렸습니다.`, 'warm']; }]);
    if (k.job && ka >= 60 && ka <= 66 && a >= 80 && !k.nRet) out.push([0.25, () => { k.nRet = 1; return [L`${iga(n)} 일을 내려놓고 은퇴했습니다. 내 아이가 은퇴할 나이가 되었다니 믿기지 않았습니다.`, 'ev']; }]);
  }
  const gs = (f.grand || []).filter(g => !g.gone);
  for (const g of gs) {
    const ga = a - g.bornAt, who = g.sex === 'F' ? L`${g.of}의 딸` : L`${g.of}의 아들`, gp = gkFar(g) ? gkParent(g) : null, there = gp && CBY[gp.abroad] ? CBY[gp.abroad].ko : '';
    if (ga >= 6 && ga <= 7 && !g.nS && (S.flags.gnS || 0) < 2) out.push([0.5, () => { g.nS = 1; S.flags.gnS = (S.flags.gnS || 0) + 1; const x = med0 * 0.006; S.money -= x; book("Quà mừng cho cháu", -x); eff({ h: 2 }); return [there ? L`${there}에 사는 ${iga(who)} 학교에 들어갔습니다. 책가방을 사서 부쳐 주었습니다.` : S.cur === 'JPN' ? L`${iga(who)} 초등학교에 들어갔습니다. 입학 선물로 란도셀을 사 주었습니다.` : L`${iga(who)} 학교에 들어갔습니다. 책가방을 하나 사 주었습니다.`, 'warm']; }]);
    if (ga === 19 && !g.nU && chance(clamp((c.ter || 30) / 100 * 0.85, 0.05, 0.9))) out.push([0.9, () => { g.nU = 1; const x = med0 * 0.02 * giftK(); if (x) { S.money -= x; book("Quà mừng cho cháu", -x); } eff({ h: 3 }); return [x ? L`${iga(who)} 대학에 합격했다는 소식에 축하 봉투를 보냈습니다.` : L`${iga(who)} 대학에 합격했다는 소식을 들었습니다.`, 'warm']; }]);
    if (ga >= 23 && ga <= 25 && !g.nJ && (S.flags.gnJ || 0) < 2) out.push([0.25, () => { g.nJ = 1; S.flags.gnJ = (S.flags.gnJ || 0) + 1; eff({ h: 3, so: 1 }); return [there ? L`${there}에 사는 ${iga(who)} 첫 월급을 받았다며 선물을 부쳐 왔습니다.` : S.cur === 'KOR' ? L`${iga(who)} 첫 월급으로 내 내복을 사 왔습니다.` : L`${iga(who)} 첫 월급을 받았다며 저녁을 샀습니다.`, 'warm']; }]);
    if (ga >= Math.max(20, afmF(c) - 2) && ga <= afmF(c) + 8 && !g.nW && g.kt !== 0) out.push([0.12, () => { g.nW = 1; const x = med0 * 0.03 * giftK(); if (x) { S.money -= x; book("Quà cưới cho cháu", -x); } eff({ h: 4, so: 2 }); S.yearMark = S.yearMark || 'love';
      return [!there ? L`${who} 결혼식에 갔습니다. 손주의 결혼식을 보게 될 줄은 몰랐습니다.` : !longTripHard() ? L`${ro(there)} 날아가 ${who} 결혼식에 갔습니다. 손주의 결혼식을 보게 될 줄은 몰랐습니다.`
        : calYr() >= 2010 ? L`${there}에서 열린 ${who} 결혼식을 영상 통화로 지켜보았습니다. 손주의 결혼식을 보게 될 줄은 몰랐습니다.` : L`${there}에서 열린 ${who} 결혼식 사진을 우편으로 받아 보았습니다. 손주의 결혼식을 보게 될 줄은 몰랐습니다.`, 'warm']; }]);
  }
  for (const [p, run] of out.sort(() => rnd() - 0.5)) if (chance(p)) { const [t, k, act] = run(); S.flags.newsAt = a; logA(act || 'phone', t, k); return; }
}
function descendantsYear() {
  const c = C(), f = S.fam, afm = afmF(c), yr = (S.by || 2026) + S.age; f.grand = f.grand || [];
  const newG = [], newGG = [];
  for (const k of f.kids) {
    const ka = S.age - k.bornAt;
    if (k.kt == null && ka >= 18) { k.kt = kidsTarget(c, tfrAt(c, yr + 10)); k.kb = 0; if (kidSS(k)) k.kt = chance(c.ppp >= 15000 && ['m', 'cp'].includes(ssLegal(c, yr)) ? 0.35 : 0.1) ? Math.max(1, Math.round(k.kt * 0.7)) : 0; }
    if (k.la != null && k.cu === undefined) kidUnion(k, c, ka);
    if (skApart(k)) continue;
    if (nkCut(k)) continue;
    if (k.kt && k.kb < k.kt && ka >= (k.path === 'uni' ? Math.max(afm + 2, 25) : afm) + (k.sex === 'M' ? 3 : 0) && ka <= (k.sex === 'F' ? 44 : 50) && k.alive && !kidInPr(k) && (!kidSS(k) || gkSsCan(k)) && chance(0.4) && (k.wed || k.cuT || chance(nonMarital(c) * 0.1))) {
      k.kb++; const g = { bornAt: S.age, sex: chance(0.512) ? 'M' : 'F', of: callName(k.name), ofSex: k.sex }; if (chance(youngDeath(c))) g.gone = 1; f.grand.push(g); newG.push(g);
      { const w = gkSsWay(k); if (w) { g.w = w; g.pw = k.wed && !k.div ? 1 : k.cuT ? 0 : 2; if (w === 'ad') g.gone = 0; } }
    }
  }
  for (const g of f.grand) {
    const ga = S.age - g.bornAt;
    if (g.kt == null && ga >= 18) { g.kt = g.gone ? 0 : kidsTarget(c, tfrAt(c, yr + 10)); g.kb = 0; }
    if (g.kt && g.kb < g.kt && ga >= afm + (g.sex === 'M' ? 3 : 0) && ga <= 44 && chance(0.4)) { g.kb++; (g.ggB = g.ggB || []).push(S.age); newGG.push(g); }
  }
  if (newG.length) {
    const before = S.flags.grand || 0; S.flags.grand = before + newG.length;
    const g = newG[0], who = g.ofSex === 'F' ? L`딸 ${g.of}` : L`아들 ${g.of}`, gw = g.sex === 'F' ? "con gái" : "con trai";
    eff({ h: 6, so: 4 }); S.yearMark = S.yearMark || 'grand';
    const one = newG.length === 1, adT = g.pw === 1 ? L`${iga(who)} 배우자와 함께 ${eul(gw)} 입양했습니다.` : g.pw === 2 ? L`${iga(who)} ${eul(gw)} 입양했습니다.` : L`${iga(who)} 함께 사는 사람과 ${eul(gw)} 입양했습니다.`;
    const t = one && g.w === 'ad' ? (before === 0 ? "Bạn đã có đứa cháu đầu tiên!" + ' ' + adT : adT + ' ' + L`손주가 ${S.flags.grand}명이 되었습니다.`)
      : (before === 0 ? (newG.length > 1 ? L`첫 손주들이 태어났습니다! 올해 한꺼번에 ${newG.length}명이 태어났습니다.` : L`첫 손주가 태어났습니다! ${who}에게 ${gw}이 생겼습니다.`) : newG.length > 1 ? L`손주가 ${newG.length}명 더 태어났습니다. 이제 손주가 ${S.flags.grand}명입니다.` : L`${who}에게 ${gw}이 태어났습니다. 손주가 ${S.flags.grand}명이 되었습니다.`)
        + (one && g.w === 'dn' ? ' ' + "Đứa bé được thụ thai nhờ tinh trùng hiến tặng." : one && g.w === 'sr' ? ' ' + "Đứa bé ra đời nhờ sự giúp đỡ của người mang thai hộ." : '');
    logA('grand:new', t, before === 0 ? 'big' : 'ev', one && g.w ? GK_SS_F() : undefined);
    for (const x of newG) if (x.gone) { log(L`${x.ofSex === 'F' ? L`딸 ${x.of}` : L`아들 ${x.of}`}의 아기는 오래 살지 못하고 어려서 세상을 떠났습니다.`, 'loss'); eff({ h: -4, so: -1 }); }
  }
  if (newGG.length) {
    const before = S.flags.ggrand || 0; S.flags.ggrand = before + newGG.length;
    eff({ h: 6, so: 3 }); S.yearMark = S.yearMark || 'grand';
    const g = newGG[0], who = g.sex === 'F' ? L`${g.of}의 딸` : L`${g.of}의 아들`;
    logA('grand:new', before === 0 ? (newGG.length > 1 ? L`첫 증손주가 ${newGG.length}명 태어났습니다! 네 세대가 한자리에 모였습니다.` : "Đứa chắt đầu tiên đã chào đời! Bốn thế hệ quây quần bên nhau.") : newGG.length > 1 ? L`증손주가 ${newGG.length}명 더 태어났습니다. 이제 증손주가 ${S.flags.ggrand}명입니다.` : L`손주 ${who}에게 아이가 태어났습니다. 이제 증손주가 ${S.flags.ggrand}명입니다.`, before === 0 ? 'big' : 'ev');
  }
}
const LEAVE_AGE = { FIN: 21.4, SWE: 21.5, DNK: 21.8, NOR: 22, FRA: 23.4, NLD: 23.5, NZL: 23.5, DEU: 23.9, USA: 24, AUS: 24, GBR: 24.5, CHE: 24.5,
  AUT: 25.3, CAN: 25.5, BEL: 26, CZE: 26, ISR: 26, IRL: 27, HUN: 27, ROU: 27.5, POL: 28, JPN: 28, SGP: 29, PRT: 29.5, BGR: 30, KOR: 30, TWN: 30,
  ITA: 30.2, ESP: 30.2, SVK: 30.9, GRC: 30.9, SRB: 31, HRV: 33.4, MNE: 33, MKD: 32, XKX: 32, BIH: 31, ALB: 31, MLT: 30, SVN: 29, CYP: 27, LUX: 27, LVA: 26.5, LTU: 26, EST: 23 };
const PATRI_X = ['CHN', 'VNM', 'MNG', 'UZB', 'TJK', 'KGZ', 'TKM', 'AZE', 'TUR'];
const patri = c => ['sa', 'mena', 'ssa'].includes(c.p) || PATRI_X.includes(c.id);
function leaveAt(c, sex) {
  if (patri(c) || c.p === 'eap') return 0;
  const base = LEAVE_AGE[c.id] || { hi: 25, eca: 28, lac: 27 }[c.p] || 27;
  return Math.max(19, Math.round(base + (sex === 'F' ? -1 : 1) + (rnd() + rnd() - 1) * 5));
}
const STAY_P = { sa: 0.85, mena: 0.7, eap: 0.6, ssa: 0.5, lac: 0.55, eca: 0.3, hi: 0.08 };
const stayP = c => ['JPN', 'KOR', 'TWN', 'SGP', 'HKG', 'MAC'].includes(c.id) ? 0.25 : c.p === 'eca' && PATRI_X.includes(c.id) ? 0.7 : STAY_P[c.p];
const WED_P = { hi: 0.72, eca: 0.85, lac: 0.75, mena: 0.92, sa: 0.97, ssa: 0.88, eap: 0.9 };
const wedAt = (c, sex) => chance(WED_P[c.p]) ? Math.max(18, Math.round((sex === 'M' ? afmM(c) + 0.5 : afmF(c)) + (rnd() + rnd() - 1) * 8)) : 0;
const kidUniWed = k => { if (k.uw) return; k.uw = 1; if (k.wa && !k.wed && k.wa - (S.age - k.bornAt) < 5 && !chance(0.1)) { k.wa = Math.max(k.wa, 23 + ri(0, 4)); if (k.wq) { k.wq = 0; const q = S.flags.kidWedQ, i = S.fam.kids.indexOf(k); if (q && q.includes(i)) q.splice(q.indexOf(i), 1); } } };
const nonMarital = c => ['JPN', 'KOR', 'TWN'].includes(c.id) ? 0.03 : { hi: 0.4, eca: 0.25, lac: 0.7, ssa: 0.35, eap: 0.1, mena: 0.02, sa: 0.01 }[c.p];
function kidGrief(k, ka) {
  const n = callName(k.name), f = S.fam, P = f.partner, pt = P && P.alive && !P.divorced;
  const little = (f.grand || []).some(g => !g.gone && g.of === n && g.ofSex === k.sex && S.age - g.bornAt < 12);
  const W = [];
  if (little) W.push(L`장례식장에서 ${n}의 아이들이 내 손을 꼭 잡았습니다. 그 작은 손을 오래 놓지 못했습니다.`);
  if (kmHome(k)) W.push(L`${n}의 방을 한동안 그대로 두었습니다. 문을 열면 ${iga(n)} 아직 그 자리에 있을 것만 같았습니다.`);
  const late = skApart(k);
  if (late) W.push(L`늦게 만나 가족이 된 사이였지만, ${n}의 빈자리는 컸습니다.`);
  if (S.age >= 75 && !late) W.push(L`자식을 앞세우는 일이 이토록 아플 줄은 몰랐습니다. 눈을 감으면 ${n}의 어릴 적 얼굴이 먼저 떠올랐습니다.`);
  if (pt && !ptAway()) W.push(L`${wa(callName(P.name))} 서로를 붙들고 오래 울었습니다. ${n} 이야기를 함께 나눌 사람이 곁에 있어 견딜 수 있었습니다.`);
  if (ka < 35 && !late) W.push(L`${iga(n)} 첫걸음을 떼던 날이 엊그제 같았습니다. 그 아이가 살아 보지 못한 날들을 오래 헤아렸습니다.`);
  if (W.length < 2) W.push(L`자식을 먼저 보낸 부모의 슬픔에는 이름조차 없다고들 합니다. ${n}의 목소리가 듣고 싶은 밤이 많았습니다.`);
  logA('mem:kid', pick(W), 'note');
}
function kidOrphans(k) {
  const n = callName(k.name), gs = (S.fam.grand || []).filter(g => !g.gone && g.of === n && S.age - g.bornAt < 18);
  if (!gs.length) return;
  if (!(k.wed || k.cuT || k.div)) { S.flags.gkQ = n; return; }
  const who = kidSS(k) ? L`${n}의 배우자` : k.wed && !k.div ? (k.sex === 'F' ? "con rể" : "con dâu") : k.sex === 'F' ? "bố của các cháu" : "mẹ của các cháu";
  const tail = nkCut(k) ? (gs.length > 1 ? "Tin tức về các cháu chỉ thỉnh thoảng nghe được qua người khác." : "Tin tức về cháu chỉ thỉnh thoảng nghe được qua người khác.") : k.abroad ? (gs.length > 1 ? "Dù ở xa, bạn quyết định sẽ thường xuyên liên lạc với các cháu." : "Dù ở xa, bạn quyết định sẽ thường xuyên liên lạc với cháu.") : gs.length > 1 ? "Bạn quyết định sẽ thường xuyên đến thăm các cháu." : "Bạn quyết định sẽ thường xuyên đến thăm cháu.";
  log((gs.length > 1 ? L`${iga(n)} 남긴 아이 ${gs.length}명은 ${iga(who)} 키우게 되었습니다.` : L`${iga(n)} 남긴 아이는 ${iga(who)} 키우게 되었습니다.`) + ' ' + tail, 'ev');
}
const gkOf = n => (S.fam.grand || []).filter(g => !g.gone && g.of === n && S.age - g.bornAt < 18);
const gkHome = () => (S.fam.grand || []).filter(g => !g.gone && g.home != null);
const gkCost = c => incomeAt(c, 0.5) * 0.12;
function reunWho(k) {
  if (k === 'ex') { const x = S.flags.exP; if (!x) return null; return { name: x.name, y: x.y, cand: { name: x.name, sex: x.sex, age: x.age + (S.age - x.at), q: x.q || S.q, job: x.job, rel: x.rel, nat: x.nat } }; }
  const d = S.flags.exD; if (!d) return null; return { name: d.name, cand: Object.assign({}, d, { age: d.age + (S.age - d.since) }) };
}
function cosignWho() {
  const o = [], sibs = sibAliveList().filter(x => x.age >= 25);
  if (sibs.length) { const x = pick(sibs); o.push({ n: sibCall(x), k: 'sib' }); }
  if (friendsLeft()) o.push({ n: L`오랜 친구 ${friendName(1)}`, k: 'friend' });
  const ks = S.fam.kids.map((k, i) => [k, i]).filter(([k]) => kidApart(k) && S.age - k.bornAt >= 25);
  if (ks.length) { const [k, i] = pick(ks); o.push({ n: L`${k.sex === 'F' ? "con gái" : "con trai"} ${callName(k.name)}`, k: 'kid', i }); }
  return o.length ? pick(o) : null;
}
const FAR_SEA = ['KOR', 'JPN', 'TWN', 'CHN', 'IDN', 'PHL', 'VNM', 'MMR', 'THA', 'ESP', 'PRT', 'RUS', 'GHA', 'SEN'], FAR_CREW = ['IDN', 'PHL', 'VNM', 'MMR'];
const POST_TO = { USA: 3, CHN: 2.5, VNM: 1.5, SGP: 1.5, GBR: 1.5, DEU: 1.2, JPN: 1.2, ARE: 1, HKG: 1, IND: 1, IDN: 0.8, FRA: 0.8, AUS: 0.8, CAN: 0.8, MEX: 0.6 };
const POST_JOBS = ['engineer', 'dev', 'finance', 'clerk', 'civil', 'prof', 'doctor', 'lawyer', 'designer', 'salesagent'];
function postDest() { const w = {}; for (const k in POST_TO) if (CBY[k] && k !== S.cur && !CBY[k].war) w[k] = POST_TO[k]; return wpick(w); }
const payHome = old => { if (old) return ''; const r = incomeAt(B(), 0.5) / Math.max(1, incomeAt(C(), 0.5));
  return r < 0.8 ? ' · ' + L`고향 벌이는 대개 이곳의 ${Math.max(5, Math.round(r * 20) * 5)}%쯤` : r > 1.25 ? ' · ' + L`고향 벌이는 대개 이곳의 ${(Math.round(r * 10) / 10).toFixed(1).replace(/\.0$/, '')}배쯤` : ''; };
function homeBack() {
  const R = rentals(), i = R.findIndex(h => h.own && h.c === S.cur); if (i < 0 || S.house > 0) return '';
  const h = R.splice(i, 1)[0]; S.house = h.v; S.owns.house = h.at; S.flags.hPaid = h.paid || 0; houseSet();
  return "Bạn chuyển về lại căn nhà của mình, nơi đã cho thuê trong thời gian đi xa.";
}
const MSN_OK = new Set(['KOR', 'JPN', 'CHN', 'TWN', 'USA', 'CAN', 'GBR', 'IRL', 'AUS', 'NZL', 'FRA', 'DEU', 'AUT', 'CHE', 'NLD', 'BEL', 'LUX', 'SWE', 'NOR', 'DNK', 'FIN', 'ISL',
  'ITA', 'ESP', 'PRT', 'GRC', 'POL', 'CZE', 'SVK', 'HUN', 'SVN', 'HRV', 'EST', 'LVA', 'LTU', 'ISR', 'ARG', 'BRA', 'CHL', 'COL', 'MEX', 'URY']);
const MSN_WED = new Set(['KOR', 'JPN']);
const surType = cl => { const N = NAMES[cl] || NAMES.en; return !['pat', 'bin', 'mono'].includes(N.o); };
const momName = () => { const P = S.fam.partner; return S.sex === 'F' ? S.name : P && P.sex === 'F' ? P.name : null; };
function surOK() {
  const f = S.fam, P = f.partner, m = momName();
  return f.married && P && P.alive && !P.divorced && !P.ss && MSN_OK.has(C().id) && S.rel !== 'S' && surType(S.cl) && !!m && m.cl === S.cl && !!(S.name && P.name) && S.name.base !== P.name.base;
}
const surFixed = () => MSN_WED.has(C().id) && S.fam.kids.some(k => k.alive && !k.sk && k.mn === S.fam.marriages);
function surSet(k) { if (!surOK() || surFixed()) return false; S.flags.surM = k === 'm' ? S.fam.marriages : 0; return true; }
function withSurname(nm, base, sex) {
  const N = NAMES[nm.cl] || NAMES.en; if (!surType(nm.cl)) return nm;
  const fam = sex === 'F' && N.fem ? femSurname(base, N.fem) : base;
  let full;
  if (N.o === 'fgns') full = fam + ' ' + nm.g;
  else if (N.o === 'fg') full = fam + ' ' + nm.g;
  else if (N.o === 'vi') { const p = nm.full.split(' '); full = [fam].concat(p.slice(1)).join(' '); }
  else full = nm.g + ' ' + fam;
  return Object.assign({}, nm, { base, full });
}
const surKids = () => { const m = momName() || (S.sex === 'F' ? S.name : null); return S.sex !== 'F' || !m || !surType(m.cl) ? [] : S.fam.kids.filter(k => k.alive && !k.sk && !k.away && S.age - k.bornAt < 19 && k.name && k.name.cl === m.cl && k.name.base !== m.base && !k.surCh); };
function kinYear(a) {
  const c = C(), f = S.fam, cs = S.flags.cosign;
  if (cs) {
    if (a >= cs.end) { S.flags.cosign = null; if (chance(0.5)) log(L`${iga(cs.n)} 대출을 다 갚았습니다. 보증도 끝났습니다.`, 'ev'); }
    else if (chance(0.07)) { const owe = cs.amt * (0.4 + 0.6 * rnd()); S.flags.cosign = null; S.money -= owe; book("Khoản nợ do đứng ra bảo lãnh", -owe); eff({ h: -8, so: -4 });
      if (cs.k === 'kid' && f.kids[cs.i]) f.kids[cs.i].bd = (f.kids[cs.i].bd || 0) - 4;
      log(L`${iga(cs.n)} 빚을 갚지 못해, 보증을 선 ${wonStr(owe)}을 대신 떠안았습니다.`, 'bad'); }
  }
  for (const g of gkHome()) if (a - g.bornAt >= 19) { g.home = null; if (!S.flags.gkOut) { S.flags.gkOut = 1; logA('help', "Đứa cháu bạn cùng nuôi nấng đã trưởng thành và rời nhà. Căn nhà lặng đi một thời gian.", 'warm'); eff({ h: 3 }); } }
  if (S.flags.gkPay && a >= S.flags.gkPay.to) S.flags.gkPay = null;
  const P = f.partner;
  if (P && P.postEnd != null && a >= P.postEnd) { P.postEnd = null;
    if (!P.alive || P.divorced || !f.married) {}
    else if (chance(0.9)) { eff({ h: 5, so: 3 }); log(L`배우자 ${iga(callName(P.name))} 해외 근무를 마치고 돌아왔습니다. 다시 한집에 살게 되었습니다.`, 'warm'); }
    else { log("Những tháng ngày xa cách khiến hai trái tim cũng xa nhau.", 'bad'); divorceNow(c, true); } }
  const po = S.flags.post;
  if (po && (S.cur !== po.to || !f.married)) S.flags.post = null;
  else if (po && a >= po.back) { S.flags.post = null;
    if (chance(0.2)) log(L`발령은 끝났지만, 가족은 ${c.ko}에 남기로 했습니다.`, 'note');
    else { const t = goHome(); log("Đợt công tác kết thúc, cả gia đình cùng trở về." + ' ' + t, 'note'); } }
  const fs = S.flags.farSea;
  if (fs) { if (chance(0.003)) { S.flags.farSea = null; die('drown', "tai nạn tàu đánh cá viễn dương"); return; }
    if (a >= fs.until) { S.flags.farSea = null; eff({ h: 6, so: 4 }); log(L`${a - fs.at}년 만에 원양어선에서 내려 집으로 돌아왔습니다.`, 'warm'); } }
  if (a === 5 && S.flags.ownPriv == null && S.school !== false && ddLv() < 2) {
    const pf = privShare(B()) * [0, 0.3, 0.6, 1, 1.6, 2.6][S.q] * (S.flags.rich ? 2 : 1);
    S.flags.ownPriv = chance(Math.min(0.9, pf)) ? 1 : 0;
    if (S.flags.ownPriv) { S.kE = (S.kE || 0) + 0.05; log(L`${eun(carerW())} 나를 사립학교에 보내기로 했습니다. 학비가 만만치 않았습니다.`, 'ev'); } }
  if (!S.flags.halfSib && a >= 12 && a <= 50 && f.dad.absent && chance(0.01)) { S.flags.halfSib = 1;
    log("Bạn biết được rằng bố có một đứa con với một gia đình khác. Đó là người anh chị em cùng cha khác mẹ mà bạn chưa từng thấy mặt.", 'ev'); }
  else if (!S.flags.halfSib && a >= 25 && a <= 75 && ['USA', 'CAN', 'GBR', 'AUS', 'NZL', 'IRL'].includes(S.cur) && calYr() >= 2014 && chance(0.0005)) { S.flags.halfSib = 1;
    log("Qua một trang web xét nghiệm ADN, bạn được kết nối với một người anh chị em cùng cha khác mẹ mà bạn chưa từng biết. Đó là đứa con bố có với một người khác khi còn trẻ.", 'ev', "Theo một khảo sát, khoảng 2–3% người làm xét nghiệm ADN phát hiện ra cha mẹ hoặc anh chị em mà họ chưa từng biết (Guerrini và cộng sự, 2022)"); }
}
function kidOrient(k, c, ka) {
  if (k.or !== undefined) return; k.or = ''; k.pS = 0;
  if (k.sk || S.isComp) return;
  const l = ssLegal(c, calYr() + Math.max(0, 18 - ka)); if (!l) return;
  if (chance(SS_RATE[l])) k.or = 'ss'; else if (chance(BI_RATE[l] * (k.sex === 'F' ? 1.3 : 0.7))) k.or = 'bi'; else return;
  k.pS = k.or === 'ss' || chance(BI_SS[l]) ? 1 : 0; if (!k.pS) return;
  if (k.wa && ssLegal(c, calYr() + Math.max(0, k.wa - ka)) !== 'm') { k.wa = 0; k.psCu = 1; }
  if (chance((l === 'm' || l === 'cp' ? 0.8 : 0.45) * (k.or === 'bi' ? 0.55 : 1))) k.oTell = Math.max(ka + 1, 16 + ri(1, 9));
}
function kidUnion(k, c, ka) {
  kidOrient(k, c, ka);
  k.cu = k.psCu ? (chance(0.6) ? Math.max(18, Math.round((k.sex === 'M' ? afmM(c) + 0.5 : afmF(c)) + (rnd() + rnd() - 1) * 8)) : 0) : !k.wa && chance(clamp(nonMarital(c) * 1.5, 0.03, 0.9)) ? Math.max(18, Math.round((k.sex === 'M' ? afmM(c) + 0.5 : afmF(c)) + (rnd() + rnd() - 1) * 8)) : 0;
  if (k.cu && ka > k.cu + 1) k.cuT = S.age;
}
const gkSsCan = k => { const c = kidLand(k), yr = calYr(), l = ssLegal(c, yr); return l === 'm' || (k.sex === 'F' ? l === 'cp' && c.ppp >= 15000 : !!SURRO[c.id] && yr >= SURRO[c.id][0]); };
function gkSsWay(k) {
  if (!kidSS(k)) return null;
  const c = kidLand(k), yr = calYr(), m = ssLegal(c, yr) === 'm';
  if (k.sex === 'F') return c.ppp >= 15000 && (!m || chance(0.7)) ? 'dn' : 'ad';
  return SURRO[c.id] && yr >= SURRO[c.id][0] && (!m || chance(0.35)) ? 'sr' : 'ad';
}
const GK_SS_F = () => "Trong các cặp đôi cùng giới đã kết hôn dưới 50 tuổi ở Mỹ, 15% nuôi con được thụ thai nhờ tinh trùng hiến tặng và 14% nuôi con nuôi (Williams Institute 2024)";
const cohabFact = c => c.p === 'lac' ? "Ở Mỹ Latinh, hơn một nửa số trẻ em được sinh ra từ những cặp bố mẹ sống chung mà không kết hôn (OECD Family Database)" : c.p === 'hi' || c.p === 'eca' ? "Ở các nước OECD, khoảng 40% trẻ em được sinh ra từ những cặp bố mẹ không kết hôn (OECD Family Database)" : c.id === 'PHL' ? PHL_BIRTH_F() : null;
const withParents = () => S.flags.left == null || !!S.flags.stayHome;
const parElsewhere = () => !withParents() && S.cur === S.born && !S.mig && (S.city || '') !== (S.bornCity || '');
function sibPolicyK(n, yr) {
  if (S.born !== 'CHN' || yr < 1980 || yr > 2015 || (S.mig && famCame())) return 1;
  const g = ethG(), m = n - (g && g.k1 ? 1 : 0); if (m < 2) return 1;
  if (S.bornUrban) return m === 2 ? SIBPOL.u2 : SIBPOL.u3;
  return m === 2 ? SIBPOL.r2 : yr < 1991 ? SIBPOL.r3a : SIBPOL.r3b;
}
const SIBPOL = { u2: 0.4, u3: 0.1, r2: 1, r3a: 0.6, r3b: 0.5 };
function sibPolicyOlder(by) { const f = S.fam; let o = f.older; while (o > 0 && !chance(sibPolicyK(o + 1, by))) o--; f.older = o; }
const sibR = () => { let h = 2166136261; for (const ch of nmSeed() + S.born) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  return () => { h = (Math.imul(h ^ (h >>> 15), 2246822507) + 2654435769) >>> 0; return h / 4294967296; }; };
function sibOlderD(n) { const R = sibR(); let d = 0; for (let i = 0; i < n; i++) { d += 2 + Math.floor(R() * 3); R(); R(); R(); } return d; }
const sibFb = c => clamp(afmF(c) - 3, 16, 20);
function sibOlderFit(c) {
  const f = S.fam; f.fb = sibFb(c);
  const need = f.older > 0 ? sibOlderD(f.older) + f.fb - f.mAt : 0, up = need > 0 ? clamp(Math.ceil(need) + ri(0, 2), 0, Math.max(0, 45 - f.mAt)) : 0;
  if (up) { f.mAt += up; f.mom.age += up; f.dad.age = Math.min(f.dad.age + up, Math.max(f.dad.age, 75)); }
  while (f.older > 0 && sibOlderD(f.older) > f.mAt - f.fb) { f.older--; f.younger++; }
}
function sibList() {
  const f = S.fam, at = f.sibAt || [], out = [];
  const R = sibR();
  let d = 0;
  for (let i = 0; i < (f.older || 0); i++) { d += 2 + Math.floor(R() * 3); out.push({ d, sex: R() < 0.512 ? 'M' : 'F', lv: Math.round((R() + R() - 1) * 4) }); }
  const room = (f.mAt != null ? f.mAt : f.mom && !f.mom.diedAt && f.mom.alive ? f.mom.age - S.age : null) - (f.fb != null ? f.fb : 16);
  if (out.length && room >= 1 && d > room) for (const o of out) o.d = Math.max(1, Math.round(o.d * room / d));
  const n = f.sibBorn || 0, last = f.lastSib != null ? f.lastSib : 2 + 3 * (n - 1);
  for (let i = 0; i < n; i++) {
    const r = at[i] || [Math.max(1, last - 3 * (n - 1 - i)), R() < 0.512 ? 'M' : 'F'];
    out.push({ d: -r[0], sex: r[1], lv: Math.round((R() + R() - 1) * 4) });
  }
  return out;
}
function sibDA(i, s) {
  const f = S.fam, da = f.sibDA || (f.sibDA = []);
  if (da[i] != null) return da[i];
  const l = lifeTable(B(), s.sex).l, lo = Math.min(Math.max(0, S.age + s.d), l.length - 2), base = l[lo] || 1e-9, u = rnd();
  let x = lo; while (x < Math.min(110, l.length - 2) && l[x + 1] / base > u) x++;
  return (da[i] = x);
}
const sibAliveList = () => sibList().map((s, i) => Object.assign({ i, age: S.age + s.d }, s)).filter(s => s.age >= 0 && s.age < sibDA(s.i, s));
const sibAliveN = () => (S && S.fam ? sibAliveList().length : 0);
const sibWord = s => s.d > 0 ? (s.sex === 'M' ? (meSex() === 'M' ? "anh trai" : "anh trai") : (meSex() === 'M' ? "chị gái" : "chị gái")) : s.sex === 'M' ? "em trai" : "em gái";
function sibOrd(c, k, n) {
  const T = c === 'h' ? ["anh trai cả", "anh trai thứ hai", "anh trai thứ hai", "anh trai thứ ba", "anh trai thứ tư", "anh trai thứ năm"]
    : c === 'o' ? ["anh trai cả", "anh trai thứ hai", "anh trai thứ hai", "anh trai thứ ba", "anh trai thứ tư", "anh trai thứ năm"]
    : c === 'n' ? ["chị gái cả", "chị gái thứ hai", "chị gái thứ hai", "chị gái thứ ba", "chị gái thứ tư", "chị gái thứ năm"]
    : c === 'u' ? ["chị gái cả", "chị gái thứ hai", "chị gái thứ hai", "chị gái thứ ba", "chị gái thứ tư", "chị gái thứ năm"]
    : c === 'b' ? ["em trai lớn", "em trai út", "em trai thứ hai", "em trai thứ ba", "em trai thứ tư", "em trai thứ năm"]
    : ["em gái lớn", "em gái út", "em gái thứ hai", "em gái thứ ba", "em gái thứ tư", "em gái thứ năm"];
  return k === 0 ? T[0] : n === 2 ? T[1] : T[k + 1] || null;
}
const sibKind = s => s.d > 0 ? (s.sex === 'M' ? (meSex() === 'M' ? 'h' : 'o') : (meSex() === 'M' ? 'n' : 'u')) : s.sex === 'M' ? 'b' : 'g';
function sibCall(s) {
  if (!s || !S || !S.fam) return s ? sibWord(s) : '';
  const all = sibList().map((x, i) => Object.assign({ i }, x)), i = s.i != null ? s.i : all.findIndex(x => x.d === s.d && x.sex === s.sex);
  const me = all[i]; if (!me) return sibWord(s);
  const kd = sibKind(me), same = all.filter(x => S.age + x.d >= 0 && sibKind(x) === kd).sort((a, b) => b.d - a.d || a.i - b.i);
  if (same.length < 2) return sibWord(me);
  return sibOrd(kd, same.findIndex(x => x.i === i), same.length) || sibWord(me);
}
function sibDeathYear() {
  const f = S.fam; if (!f || !(f.older + f.sibBorn)) return;
  sibList().forEach((s, i) => {
    const age = S.age + s.d, d = sibDA(i, s);
    const late = d === 0 && age === 1 && s.d < 0;
    if (age < 0 || (age !== d && !late)) return;
    const w = sibCall(Object.assign({ i }, s)), ck = d >= 1 ? pickCause(B(), d, s.sex, true) : null, cause = ck ? causeLabel(ck, d, s.sex) : null;
    if (S.age - (late ? 1 : 0) < 3) { if (s.d > 0) eff({ so: -1 });
      logA('loss:sib', (d < 1 ? L`갓 태어난 ${iga(w)} 첫돌을 넘기지 못하고 세상을 떠났습니다.` : d < 15 ? L`${iga(w)} 어린 나이에 세상을 떠났습니다.` : L`${iga(w)} ${d}세로 세상을 떠났습니다.`) + ' ' + "Khi ấy bạn còn quá nhỏ nên không nhớ gì, nhưng lớn lên bạn được gia đình kể lại.", 'note');
      return; }
    const far = S.mig && !famCame() && S.cur !== S.born;
    const t = d < 1 ? L`갓 태어난 ${iga(w)} 첫돌을 넘기지 못하고 세상을 떠났습니다.` : d < 5 ? L`${iga(w)} 다섯 살을 넘기지 못하고 세상을 떠났습니다. (${cause})`
      : farFromNK() ? L`북에 남은 ${w}의 부고를 몇 달 뒤에야 브로커를 통해 전해 들었습니다. 장례에는 갈 수 없었습니다.`
      : far ? L`고향의 ${iga(w)} ${d}세로 세상을 떠났다는 소식을 들었습니다. (${cause})` : L`${iga(w)} ${d}세로 세상을 떠났습니다. (${cause})`;
    logA('loss:sib', t, 'loss');
    eff({ h: S.age < 25 ? -6 : -5, so: -2 }); S.yearMark = S.yearMark || 'loss'; if (S.age >= 6) grieve('sib', w);
    if (ck === 'suic') suicLoss('sib', w);
  });
}
function sibLeave(c, s) {
  if (patri(c) || c.p === 'eap') return (s.sex === 'F' ? afmF(c) : afmM(c) + 3) + s.lv;
  return (LEAVE_AGE[c.id] || { hi: 25, eca: 28, lac: 27 }[c.p] || 27) + (s.sex === 'F' ? -1 : 1) + s.lv;
}
const sibHomeOK = () => !!S.fam && withParents() && !studyAway() && S.job !== 'prison' && !S.nomad && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent));
const sibsLeft = () => sibHomeOK() ? sibAliveList().length - sibsHome().length : 0;
const sibLittle = () => sibsHome().filter(s => s.d < 0 && s.age < 12).length;
function sibLeaveYear() {
  if (!sibHomeOK() || S.age < 4 || S.isComp) return;
  const f = S.fam, c = CBY[S.born] || C(), told = f.sibLT || (f.sibLT = []), wed = patri(c) || c.p === 'eap';
  for (const s of sibAliveList()) {
    if (told.includes(s.i) || s.age !== Math.ceil(sibLeave(c, s))) continue;
    told.push(s.i); const w = sibCall(s), wedT = wed && (S.fam.sibW || []).includes(s.i); if (wed) sibWedMark(s.i);
    log(wed ? (s.sex === 'F' && !wedT ? L`${iga(w)} 결혼해 집을 떠났습니다.` : L`${iga(w)} 결혼하고 몇 해 뒤 따로 살림을 차려 나갔습니다.`) : L`${iga(w)} 집을 떠나 따로 살기 시작했습니다.`);
  }
}
const sibWedMark = i => { const f = S.fam, w = f.sibW || (f.sibW = []); if (!w.includes(i)) w.push(i); };
const sibWedNext = () => { const w = S.fam.sibW || [], c = CBY[S.born] || C(), home = sibHomeOK() && (patri(c) || c.p === 'eap');
  const ok = sibAliveList().filter(s => { if (w.includes(s.i) || s.age < 18 || s.age > 50) return false; const lv = Math.ceil(sibLeave(c, s)) - s.age; return !(home && lv >= 0 && (s.sex === 'F' || lv < 2)); }); return ok.length ? pick(ok) : null; };
function sibsHome() {
  if (!sibHomeOK()) return [];
  const c = CBY[S.born] || C();
  return sibAliveList().map(s => ({ age: S.age + s.d, sex: s.sex, d: s.d, home: S.age + s.d >= 0 && S.age + s.d < sibLeave(c, s) }))
    .filter(s => s.home).sort((a, b) => Math.abs(a.d) - Math.abs(b.d));
}
const parsOut = () => { const h = homeOthers(), ws = ['mom', 'dad'].filter(w => h[w]); return !ws.length || ws.every(w => { const j = S.fam[w].job; return !!j && !['homemaker', 'retired', 'seeking'].includes(j); }); };
function homeOthers() {
  const f = S.fam, par = withParents() && !studyAway() && !adoptWait() && !fcAway();
  const pc = S.flags.parCame != null;
  return { mom: f.mom.alive && !parInPr('mom') && (par || pc || S.flags.careHome === 'mom'), dad: f.dad.alive && !f.dad.absent && !parInPr('dad') && (par || pc || S.flags.careHome === 'dad'),
    step: !!(f.step && f.step.alive && f.mom.alive && par),
    pt: f.married && f.partner && f.partner.alive && !(f.partner.joinAt > S.age) && !(f.partner.postEnd > S.age) && !f.partner.lb, kids: f.kids.filter(k => k.alive && !k.away && !kidInPr(k) && (!k.grown || k.withMe)),
    pt2: f.married && f.wife2 && f.wife2.alive ? f.wife2 : null, co: f.married && f.co && f.co.home ? f.co : null };
}
const NR_LOST = { USA: [0.27, () => "Ở Mỹ, 27% người cha sống xa con không gặp con lần nào trong năm qua (Trung tâm Nghiên cứu Pew 2011)"],
  GBR: [0.2, () => "Ở Anh, khoảng một phần năm số cha mẹ sống xa con không gặp con (Khảo sát cha mẹ ly thân của Bộ Lao động và Hưu trí Anh 2021)"],
  NOR: [0.02, () => "Ở Na Uy, 2% người cha sống xa con không gặp lại con kể từ khi chia tay (Cục Thống kê Na Uy 2012)"] };
const nkCut = k => !!k && ((farFromNK() && (k.abroad === 'PRK' || (!!(k.lb || k.away) && k.awayIn === 'PRK'))) || (k.lostAt != null && S.age >= k.lostAt && (k.away || (k.grown && !k.withMe && !k.stay))));
const kidApart = k => k.alive && k.grown && !k.withMe && !k.stay && !k.away && !kidInPr(k) && !nkCut(k);
const kidLand = k => { const id = (k.lb || k.away) && k.awayIn ? k.awayIn : k.abroad; return !id || !CBY[id] || id === S.cur ? C() : S.era && S.era !== 'now' && eraLoaded() ? eraC(id) : CBY[id]; };
const kidBackOK = k => kidApart(k) && !k.abroad && !k.wed && !k.cuT && S.age - k.bornAt >= 22 && S.age - k.bornAt <= 38;
const btNow = o => o && o.bt ? o.bt[0] * Math.pow(0.92, Math.max(0, S.age - o.bt[1])) : 0;
const btAdd = (o, x) => { if (o && o.alive !== false) o.bt = [Math.min(24, btNow(o) + x), S.age]; };
const kidsOut = () => S.fam.kids.filter(k => k.alive && !k.away && !k.abroad && (!k.grown || k.withMe || k.stay || k.near));
function bondScore(o, kind) {
  const nm = (o && o.name && (o.name.full || o.name)) || '', home = homeOthers(); let h = 0;
  for (const ch of String(nm) + kind + nmSeed()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const t = h % 100;
  let s = (S.st.so - 61) * 0.6 + (t < 10 ? -30 : t < 45 ? -10 : 10) + (S.focusW && S.focusW.family ? 8 * S.focusW.family : 0);
  if (kind === 'mom' || kind === 'dad') {
    if (home[kind]) s += 6; if (S.flags.careHome === kind) s += 10; if (S.flags.parentCare != null && S.flags.parentCare >= S.age) s += 8; if (S.flags.parTrip != null && S.age - S.flags.parTrip <= 5) s += 6;
    s += Math.min(20, btNow(o));
    if (farFromNK() || studyAway() || (S.mig && !home[kind])) s -= 10;
    s -= 18 * shameNow();
    s -= faithBNow();
    s += (o && o.bd) || 0;
  } else if (kind === 'pt') {
    if (S.flags.last_mcrisis != null && S.age - S.flags.last_mcrisis <= 3) s -= 20;
    if (S.flags.affair) s -= 8;
    s -= 10 * shameNow();
    s += Math.min(12, o.bd || 0) + Math.min(12, btNow(o));
  } else if (kind === 'date') s += 12;
  else if (kind === 'step') { if (home.step) s += 4; s -= 6; }
  else if (kind === 'kid') { const ka = S.age - o.bornAt; if (ka < 10) s += 20; else if (ka < 19) s -= 4; if (ka >= 8) s -= 10 * shameNow(); s += (o.bd || 0) + Math.min(20, btNow(o)); if (o.abroad) s -= 6; if (o.withMe) s += 8; if (o.ra) s -= 8; if (o.oHard != null) s -= 12; }
  return s;
}
function bondWord(o, kind) {
  if (!o || !o.alive || o.absent || o.divorced || (kind === 'kid' && S.age - o.bornAt < 3)) return '';
  if (kind === 'pt' && S.flags.ipv === 'on') return "đang khó khăn";
  const s = bondScore(o, kind); return s >= 26 ? "thân thiết" : s >= 4 ? "hòa thuận" : "xa cách";
}
function playerHome(c, yearly) {
  const f = S.fam, fl = S.flags;
  if (fl.left != null || fl.stayHome || S.age < 15) return;
  if (ddLv() >= 2) return;
  if (fl.la == null) {
    fl.mv = S.stats.moves;
    if (S.age >= 17) { if (S.age >= 18) fl.left = S.age; else fl.la = leaveAt(c, S.sex); return; }
    fl.la = leaveAt(c, S.sex);
  }
  if (S.refugee) { fl.mv = S.stats.moves; return; }
  if (!f.mom.alive && !(f.dad.alive && !f.dad.absent)) { fl.left = S.age; return; }
  if (S.stats.moves > fl.mv || S.nomad) { fl.left = S.age; return; }
  if (S.job === 'prison' || S.serveLeft > 0) return;
  let t = null;
  if (f.married) {
    const P = f.partner;
    if (P && P.ss) t = legalWed() ? "Bạn kết hôn, rời nhà bố mẹ và dựng tổ ấm riêng." : "Hai người tìm được một chỗ ở chung, và bạn rời nhà bố mẹ.";
    else if (patri(c) && S.sex === 'F' && legalWed()) t = "Khi kết hôn, bạn về sống bên nhà chồng.";
    else if (chance(patri(c) ? stayP(c) : c.p === 'hi' ? 0.03 : stayP(c) * 0.4)) { fl.stayHome = 1; log(legalWed() ? "Sau khi kết hôn, bạn vẫn sống chung một nhà với bố mẹ." : "Sau khi về sống chung, hai người vẫn ở nhà bố mẹ bạn."); return; }
    else t = legalWed() ? "Bạn kết hôn, rời nhà bố mẹ và dựng tổ ấm riêng." : "Hai người tìm được một chỗ ở chung, và bạn rời nhà bố mẹ.";
  } else if (yearly && fl.la && S.age >= fl.la) t = S.school === 'uni' || S.school === 'grad' ? "Khi học đại học, bạn rời nhà bố mẹ và lần đầu sống một mình." : "Bạn rời nhà bố mẹ để tự lập. Lần đầu tiên bạn tự lo liệu cuộc sống của riêng mình.";
  if (!t) return;
  fl.left = S.age; eff({ h: 1 }); S.yearMark = S.yearMark || 'move';
  log(t);
}
function kidMendAt() { const w = wpick({ a: 20, b: 30, c: 18, d: 10, n: 22 }); return w === 'n' ? null : S.age + (w === 'a' ? ri(1, 2) : w === 'b' ? ri(3, 5) : w === 'c' ? ri(6, 10) : ri(11, 20)); }
function kidMend(k, wed) {
  const n = callName(k.name); k.oHard = null; k.oMend = null; k.bd = (k.bd || 0) + 4; eff({ h: 3, so: 2 }); S.yearMark = S.yearMark || 'love';
  const fact = "Khoảng một nửa số bố mẹ lúc đầu không chấp nhận được đã mở lòng trong vòng vài năm (Samarova và cộng sự 2014, khảo sát 140 thanh thiếu niên LGB ở Israel)";
  if (wed) return log(L`연락이 뜸하던 ${iga(n)} 결혼식에 와 달라고 먼저 연락해 왔습니다.` + ' ' + "Bạn đáp rằng mình xin lỗi vì ngày ấy đã làm con tổn thương, và nhất định sẽ đến.", 'warm', fact);
  log((k.wed || k.cuT ? L`${iga(n)} 함께 사는 사람과 같이 찾아왔습니다.` : L`한동안 서먹하던 ${wa(n)} 다시 마주 앉았습니다.`) + ' ' + "Bạn nói rằng mình xin lỗi vì ngày ấy đã làm con tổn thương, và rằng con mãi mãi là con của mình.", 'warm', fact);
}
function kidsHome(c, yearly) {
  const f = S.fam;
  for (const k of f.kids) {
    if (!k.alive) continue;
    const ka = S.age - k.bornAt; if (ka < 15) continue;
    if (k.oWarm != null && S.age >= k.oWarm) { k.oWarm = null; k.bd = (k.bd || 0) + 3; eff({ h: 2, so: 2 }); const n = callName(k.name);
      log(k.wed || k.cuT ? L`${iga(n)} 함께 사는 사람을 집에 데려와 다 같이 저녁을 먹었습니다. 어느새 마음이 편해져 있었습니다.` : L`${wa(n)} 마주 앉아 오랜만에 웃으며 이야기했습니다. 그사이 마음이 많이 가까워졌습니다.`, 'warm'); }
    if (k.oHard != null && k.oMend != null && S.age >= k.oMend) kidMend(k);
    if (k.dd && k.dd.lv >= 2) { if (k.la == null) { k.la = 999; k.wa = 0; } continue; }
    if (k.la == null) {
      k.la = leaveAt(c, k.sex); k.wa = wedAt(c, k.sex); if (k.cmS && k.wa) k.wa = Math.max(k.wa, 20 + ri(0, 3));
      if (k.dd && k.wa && !chance(ddIDk(k.dd) ? 0.12 : 0.8)) k.wa = 0;
      kidUnion(k, c, ka);
      if (ka >= 17) { if (ka >= 22) k.grown = 1; if (k.wa && ka > k.wa) k.wed = k.wed || S.age; }
    }
    { const lv = k.wa && !k.wed && !k.wq && !k.cu && ka >= k.wa && !kidInPr(k) && !kidWd(k, ka) ? LIVEIN_C[kidLand(k).id] : null;
      if (lv && chance(lv.kid)) { k.cu = ka; k.wa = chance(lv.kidWed) ? ka + ri(2, 16) : 0; } }
    if (k.cu && !k.cuT && !k.wed && ka >= k.cu && !kidInPr(k) && !kidWd(k, ka)) {
      k.cuT = S.age; const n = callName(k.name);
      const ss = kidSS(k), pF = ss ? k.sex === 'F' : k.sex !== 'F';
      if (k.grown || k.stay || k.away) { if (k.away) k.grown = 1; if (!nkCut(k)) log(ss ? (pF ? L`${iga(n)} 결혼식 없이 사랑하는 여자와 살림을 합쳤습니다.` : L`${iga(n)} 결혼식 없이 사랑하는 남자와 살림을 합쳤습니다.`) : L`${iga(n)} 결혼식 없이 함께 살 사람을 만나 살림을 합쳤습니다.`); }
      else { k.grown = 1; eff({ h: 1 }); log(ss ? (pF ? L`${iga(n)} 결혼식 없이 사랑하는 여자와 새 살림을 차려 집을 떠났습니다.` : L`${iga(n)} 결혼식 없이 사랑하는 남자와 새 살림을 차려 집을 떠났습니다.`) : L`${iga(n)} 결혼식 없이 함께 살 사람을 만나 새 살림을 차려 집을 떠났습니다.`, 'ev', ss ? ssFact(kidLand(k)) : cohabFact(c)); }
    }
    if (k.wa && !k.wed && !k.wq && ka >= k.wa && !kidInPr(k) && !kidWd(k, ka)) { k.wq = 1;
      if (k.oHard != null && !chance(0.5)) { k.wed = S.age; log(L`${iga(callName(k.name))} 결혼했다는 소식을 다른 가족에게서 전해 들었습니다.`, 'ev'); }
      else if (kidNotOurs(k)) { k.wed = S.age; log(!k.exOf && f.married && f.partner && f.partner.alive && !f.partner.divorced ? L`배우자의 아이 ${iga(callName(k.name))} 결혼했습니다. 배우자와 함께 결혼식에 갔습니다.` : L`${iga(callName(k.name))} 결혼했다는 소식을 들었습니다.`); }
      else if (nkCut(k)) k.wed = S.age;
      else { if (k.oHard != null) kidMend(k, 1); (S.flags.kidWedQ = S.flags.kidWedQ || []).push(f.kids.indexOf(k)); } }
    if (k.away) { if (ka >= 18) { k.grown = 1; k.away = 0;
      if (k.lb) { k.lb = 0; k.lbG = k.awayIn || 1; if (k.awayIn && k.awayIn !== S.cur) k.abroad = k.awayIn; k.awayIn = 0; }
      else if (k.awayIn && k.awayIn !== S.cur && CBY[k.awayIn]) { k.abroad = k.awayIn; k.awayIn = 0; }
      if (k.placed) { const P = k.placed, n = callName(k.name); k.placed = null; log(P.k === 'kin' ? L`${iga(n)} 어른이 되어 ${kinWord(P.who)} 댁을 나와 자기 길을 갔습니다.` : P.fos ? L`${iga(n)} 어른이 되어 위탁 가정을 나왔습니다. 가끔 연락하며 지냅니다.` : L`${iga(n)} 어른이 되어 보육 시설을 나왔습니다. 가끔 연락하며 지냅니다.`); } } continue; }
    if (k.grown || k.stay || S.job === 'prison') continue;
    const last = !f.kids.some(o => o !== k && o.alive && !o.grown), n = callName(k.name);
    let why = null;
    if (k.wed) why = 'wed';
    else if (yearly && k.la && ka >= k.la && !kidWd(k, ka)) why = k.path === 'uni' && ka <= 23 ? 'uni' : 'own';
    else if (yearly && !k.la && !S.urban && ka >= 17 && ka <= 35 && chance(0.025)) why = 'city';
    if (!why) continue;
    const stay = why === 'wed' ? (patri(c) ? k.sex === 'M' && !f.kids.some(o => o.stay) && chance(stayP(c)) : last && chance(stayP(c) * (c.p === 'hi' ? 0.5 : 1)))
      : why !== 'city' && last && chance(stayP(c));
    if (stay) {
      k.stay = 1;
      log(why === 'wed' ? L`갓 결혼한 ${n} 부부가 우리 집에서 함께 살기로 했습니다.` : L`${iga(n)} 집을 떠나지 않고 부모 곁에 남았습니다.`);
      continue;
    }
    k.grown = 1; eff({ h: 1 });
    let t = why === 'wed' ? (patri(c) && k.sex === 'F' ? L`${iga(n)} 시댁으로 들어가 살게 되었습니다.` : L`${iga(n)} 새 살림을 차려 집을 떠났습니다.`)
      : why === 'uni' ? L`${iga(n)} 대학 근처에 방을 얻어 집을 떠났습니다.`
      : why === 'city' ? L`${iga(n)} 일자리를 찾아 도시로 떠났습니다.`
      : varied('kidout', [L`${iga(n)} 독립해 집을 떠났습니다. 빈 방이 한동안 낯설었습니다.`, L`${iga(n)} 직장 가까운 곳에 방을 얻어 독립했습니다.`, L`${iga(n)} 독립했습니다. 짐을 옮겨 주고 돌아오는 길이 허전했습니다.`]);
    if (last) { const h = homeOthers(); if (!h.mom && !h.dad && !h.step && !h.kids.length) t += ' ' + (h.pt ? "Giờ trong nhà chỉ còn lại hai người." : "Giờ trong nhà chỉ còn lại mình bạn."); }
    log(t);
  }
}
function homeYear(yearly) { if (!S || S.phase !== 'life') return; const c = C(); playerHome(c, yearly); kidsHome(c, yearly); }
function deathProb() {
  const c = C(), a = S.age, lt = LT();
  let q = a >= 110 ? lt.q[109] : lt.q[a];
  let m = 1;
  const off = 6 + (a < 15 ? c.u5 / 20 : 0) + (a > 50 ? (a - 50) * 0.08 : 0);
  m *= Math.max(0.5, Math.exp((expHealth(a) - off - S.st.hl) * (a < 5 ? 0.02 : 0.03)));
  const g = MORT_G[c.p];
  const qe = a < 18 ? S.q : clamp(Math.max(S.pct, S.flags.careerPct || 0) * 5 + 0.5, 0.5, 5.5);
  const norm = [1, 2, 3, 4, 5].reduce((s, k) => s + Math.exp(-g * (k - 3)), 0) / 5;
  m *= Math.exp(-g * (qe - 3)) / norm;
  if (a >= 25) { const sp = (S.sex === 'F' ? c.sf : c.sm) / 100; const sm = S.smoker ? 1.7 : (S.flags.exSmoker ? 1.25 : 1); m *= sm / (1 + 0.7 * sp); }
  if (c.hiv > 0.05) m *= (1 - hivShare(c, a, S.sex)) * (S.hiv ? hivMult(S.hiv, a) : 1);
  else if (S.hiv) m *= hivMult(S.hiv, a);
  for (const k in S.conds) m *= S.conds[k].treated ? 1.0 : 1.3;
  if (S.refugee) m *= 1.15;
  if (S.alc && a >= 18) m *= 1.5;
  if (S.drug && a >= 16) m *= 2;
  if (S.job === 'prison') m *= S.flags.nkCamp ? 2 : 1.3;
  if (S.serveLeft > 0 && c.war > 0) m *= 1 + c.war * 0.8;
  m *= tiesK(a);
  m *= ethMortK();
  m *= ddMortK(S.dd, a);
  m *= suicMortK(c, a);
  if (a >= 85) m = Math.pow(m, clamp(1 - (a - 85) / 20, 0.3, 1));
  m *= calOf(c.id) * eraMort(c, a);
  return 1 - Math.pow(1 - q, clamp(m, 0.25, 9));
}
function tiesK(a) {
  if (a < 25 || S.job === 'prison') return 1;
  const h = homeOthers(), so = S.st.so;
  const alone = !h.pt && !h.mom && !h.dad && !h.step && !h.kids.length && !h.pt2 && S.flags.oldHome !== 'care' && !S.flags.ddHome;
  let k = alone ? 1.2 : 1;
  if (so < 75) k *= 1 + 0.15 * clamp((75 - so) / 35, 0, 1); else if (so >= 80) k *= 0.95;
  return Math.min(1.35, k);
}
const HIVSH = {};
function hivShare(c, a, sex) {
  const key = c.id + band(a) + sex + (c.yr || '') + (c.ck || ''); if (HIVSH[key] != null) return HIVSH[key];
  const w = causeWeights(c, a, sex, false); delete w.suic; let t = 0; for (const k in w) t += w[k];
  return (HIVSH[key] = w.hiv ? clamp(w.hiv / t, 0, 0.6) : 0);
}
const hivMult = (h, a) => h.art ? 1.8 : (a - h.at < 6 ? 1.4 : 7);
const hivPrev = c => (c.hiv || 0) / 100;
function hivCause(h, a) { return h && chance(h.art ? 0.35 : a - h.at >= 6 ? 0.8 : 0.3); }
function pickCauseFor(c, a, sex, h, q, dd) { if (hivCause(h, a)) return 'hiv'; const w = causeWeights(c, a, sex, false); delete w.hiv; if (q != null && a < 15) povCause(w, q); if (dd && ddIDk(dd) && w.suic) w.suic *= DD_SUIC_RR / ddSuicOff(dd, a); return wpick(w); }
const MORT_G = { ssa: 0.25, sa: 0.25, eap: 0.2, lac: 0.2, mena: 0.15, eca: 0.2, hi: 0.15 };
const KID_HC = { ssa: 0.61, sa: 0.48, lac: 0.55, hi: 0.67, eap: 0.63, mena: 0.48, eca: 0.64 };
const KID_NORM = 1;
function kidHomeQ(c) {
  let q = clamp(3 + (hhPct() - (KID_HC[c.p] || 0.6)) * 5, 0.5, 5.5);
  if (withParents() && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent))) q = Math.max(q, S.q);
  return q;
}
function kidMortK(c, ka, q) { return ka >= 15 ? 1 : Math.exp(-(MORT_G[c.p] || 0.2) * (ka < 5 ? 1 : 0.65) * (q - 3)) / KID_NORM; }
const POV_C = { nut: 0.6, diar: 0.4, lri: 0.3, mal: 0.3, oinf: 0.25, tb: 0.3, neo: 0.1 };
function povCause(w, q) { for (const k in POV_C) if (w[k]) w[k] *= Math.exp(-POV_C[k] * (q - 3)); return w; }
const HIV_FACT = "Người có HIV nếu điều trị đều đặn và kiểm soát được virus thì không lây cho người khác (WHO · U=U)";
function hivBirth(c) {
  const pv = hivPrev(c); if (!(pv > 0.001)) return;
  if (chance(Math.min(0.4, pv * 1.25))) {
    S.fam.mom.hiv = { at: -ri(1, 8), known: chance(0.85) && !eraBefore(1985), art: false }; S.fam.mom.hiv.art = S.fam.mom.hiv.known && chance(0.9) && artOK(c);
    if (chance(S.fam.mom.hiv.art ? 0.04 : 0.3)) { const k = S.fam.mom.hiv.known && chance(0.75); S.hiv = { at: 0, src: 'birth', known: k, art: k }; }
  }
}
function hivDiagnosed(how) {
  const h = S.hiv; if (!h || h.known || eraBefore(1985)) return;
  h.known = true; h.dxAt = S.age;
  if (S.age < 15) { h.art = true; log(how === 'parent' ? L`함께 검사를 받았고, 나도 HIV 양성이었습니다. ${iga(parW())} 매일 약을 챙겨 주십니다.` : "Bạn có kết quả dương tính với HIV. Bạn bị lây từ mẹ khi chào đời. Giờ đây bạn uống thuốc mỗi ngày.", 'bad', HIV_FACT); return; }
  if (how === 'pregnancy') { h.art = true; partnerTest(); log("Xét nghiệm khi mang thai cho thấy bạn dương tính với HIV. Vì em bé, bạn bắt đầu điều trị ngay.", 'bad', "Nếu được điều trị, khả năng lây từ mẹ sang con giảm xuống dưới 5% (WHO)"); return; }
  partnerTest();
  log(how === 'kid' ? "Sau khi mất con, bạn đi xét nghiệm và cũng dương tính với HIV." : how === 'partner' ? "Hai người cùng đi xét nghiệm. Bạn cũng dương tính với HIV." : how === 'sick' ? "Vì hay ốm, bạn đi xét nghiệm và nhận kết quả dương tính với HIV." : "Xét nghiệm cho thấy bạn dương tính với HIV.", 'bad', HIV_FACT);
  eff({ h: -10 });
}
function partnerTest() {
  const P = S.fam.partner; if (!P || !P.alive || !S.fam.married || (P.hiv && P.hiv.known) || P.tested === S.age) return;
  P.tested = S.age;
  if (P.hiv) { P.hiv.known = true; P.hiv.art = chance(0.85); log(L`배우자 ${callName(P.name)}도 검사를 받았고, HIV 양성이었습니다.${P.hiv.art ? " Hai người cùng bắt đầu điều trị." : ''}`, 'bad'); }
  else log(L`배우자 ${callName(P.name)}도 검사를 받았습니다. 음성이었습니다.`);
}
function hivKidsCheck() {
  for (const k of S.fam.kids) if (k.alive && k.hiv && !k.hiv.known) { k.hiv.known = true; k.hiv.art = true; log(L`아이 ${callName(k.name)}도 검사에서 HIV 양성이 나왔습니다. 함께 치료를 시작했습니다.`, 'bad'); }
}
function revealPartnerHiv(dead) {
  const P = S.fam.partner; if (!P || !P.hiv || P.hiv.known) return;
  P.hiv.known = true;
  if (!dead) { P.hiv.art = chance(0.85); log(L`배우자 ${iga(callName(P.name))} HIV 양성 판정을 받았습니다.${P.hiv.art ? " Người ấy bắt đầu điều trị ngay." : " Người ấy không chịu điều trị."}`, 'bad', HIV_FACT); eff({ h: -8 }); }
  if (S.hiv && !S.hiv.known) hivDiagnosed('partner');
  else if (!S.hiv) log("Hai người cùng đi xét nghiệm. Bạn âm tính.");
  if (P.sex === 'F') hivKidsCheck();
}
function hivYear() {
  const c = C(), a = S.age, pv = hivPrev(c), f = S.fam, P = f.partner, withP = P && P.alive && f.married;
  if (!artOK(c)) { if (S.hiv && S.hiv.art) S.hiv.art = false; if (f.mom.hiv && f.mom.hiv.art) f.mom.hiv.art = false; if (P && P.hiv && P.hiv.art) P.hiv.art = false; }
  if (a === 0 && S.hiv && S.hiv.src === 'birth' && S.hiv.known) { S.hiv.art = true; log("Bạn bị lây HIV từ mẹ. Bạn lớn lên, ngày nào cũng uống thuốc.", 'bad', "Trong khoảng 1,4 triệu trẻ em có HIV trên toàn thế giới, khoảng 57% đang được điều trị (UNAIDS 2024)"); }
  if (withP && !P.hiv && P.age < 60 && chance(pv * 0.03)) P.hiv = { at: a, known: false, art: false };
  if (withP && P.hiv && !P.hiv.known && chance(a - P.hiv.at >= 6 ? 0.45 : 0.15)) revealPartnerHiv(false);
  if (!S.hiv && a >= 15 && a < 60) {
    let p = pv * (withP ? 0.01 : a < 35 ? 0.05 : 0.02);
    if (withP && P.hiv) p += P.hiv.art ? 0.002 : 0.08;
    if (p > 0 && chance(p)) S.hiv = { at: a, src: withP && P.hiv ? 'partner' : 'other', known: false, art: false };
  }
  if (S.flags.kidHivDeath) { S.flags.kidHivDeath = 0; if (S.sex === 'F') { if (S.hiv) hivDiagnosed('kid'); } else revealPartnerHiv(false); }
  if (S.hiv && !S.hiv.known && a > 0) {
    const late = a - S.hiv.at >= 6;
    if (chance(late ? 0.35 : a < 15 ? 0.08 : 0.15)) hivDiagnosed(late ? 'sick' : a < 15 ? 'child' : 'test');
    if (S.hiv.known && S.sex === 'F') hivKidsCheck();
  }
}
function band(a) { return a < 1 ? 0 : a < 5 ? 1 : a < 15 ? 2 : a < 30 ? 3 : a < 50 ? 4 : a < 70 ? 5 : 6; }
function causeWeights(c, a, sex, personal) {
  const t = c.yr ? eraCT(c, band(a)) : CT[c.p][band(a)]; const w = {};
  for (const k in t) w[k] = t[k];
  const P = c.p;
  if (w.hiv != null || c.hiv > 1) w.hiv = (w.hiv || 1) * Math.pow(Math.max(0.01, c.hiv) / REF.hiv[P], 0.8);
  if (w.mal != null || c.mal > 0) w.mal = P === 'ssa' ? (w.mal || 0) * c.mal / REF.mal.ssa : (a < 15 ? 8 * c.mal : 2 * c.mal);
  const hom = c.war > 0 ? Math.min(c.hom, 2 * REF.hom[P]) : c.hom;
  if (w.hom != null) w.hom = w.hom * Math.pow(hom / REF.hom[P], 0.85); else if (a >= 15) w.hom = hom * (a < 50 ? 0.33 : a < 70 ? 0.06 : 0.0075);
  if (w.road != null) w.road = w.road * c.road / REF.road[P];
  if (c.war > 0 && a >= 1) w.war = (w.war || 0) + (a >= 15 && a < 50 ? (sex === 'M' ? 8 : 3) : 2) * c.war;
  else if (!c.war) delete w.war;
  if (w.od != null) w.od = w.od * (OD[c.id] || 0.3) / 2;
  if (c.id === 'PHL' || c.id === 'IDN' || c.id === 'MMR' || c.id === 'PNG') { if (a >= 15) w.tb = (w.tb || 2) * 2.5; }
  if (['KOR', 'JPN', 'TWN', 'SGP', 'HKG', 'MAC'].includes(c.id)) { if (w.ihd) w.ihd *= 0.5; if (w.can) w.can *= 1.25; if (a >= 70) w.lri = (w.lri || 2) * 2.2; }
  if (sex === 'F' && a >= 15 && a < 30 && w.hom) w.hom *= 0.25;
  if (sex === 'F' && a >= 15 && a < 50 && w.road) w.road *= 0.4;
  if (sex === 'F' && w.cir) w.cir *= 0.5;
  if (sex === 'F' && w.inj) w.inj *= 0.4;
  if (personal) {
    if (S.smoker || S.flags.exSmoker) { const k = S.smoker ? 1 : 0.5; ['can', 'copd', 'ihd', 'str'].forEach(x => { if (w[x]) w[x] *= 1 + k * (x === 'copd' ? 2 : x === 'can' ? 0.8 : 0.4); }); }
    if (S.conds.htn) { ['ihd', 'str', 'kid'].forEach(x => { if (w[x]) w[x] *= 1.35; }); }
    if (S.conds.dm) { if (w.dia) w.dia *= 2.2; ['ihd', 'kid'].forEach(x => { if (w[x]) w[x] *= 1.25; }); }
    if (S.conds.heart) { if (w.ihd) w.ihd *= 1.8; }
    if (S.flags.strSv != null && w.str) w.str *= 2;
    if (S.drug) w.od = (w.od || 0.5) * 20; else if (S.flags.drugOK != null && w.od) w.od *= 3;
    const jr = (JOBS[S.job] || {}).risk; if (jr) for (const x in jr) w[x] = (w[x] || 1) * jr[x];
    if (S.owns.moto) w.road = (w.road || 1) * 1.6;
    if (S.alc || S.flags.alcOK != null) { const k = S.alc ? 1 : 0.35; w.cir = (w.cir || 0.5) * (1 + 5 * k); ['road', 'inj', 'fall', 'hom'].forEach(x => { if (w[x]) w[x] *= 1 + k; }); if (w.str) w.str *= 1 + 0.3 * k; }
    if (S.job === 'prison') { ['hom', 'tb', 'oinf'].forEach(x => { if (w[x]) w[x] *= 2; }); }
    if (!S.hiv) delete w.hiv;
    else { let t = 0; for (const x in w) if (x !== 'hiv') t += w[x]; w.hiv = t * (S.hiv.art ? 0.5 : a - S.hiv.at >= 6 ? 4 : 0.4); }
    if (S.serveLeft > 0 && c.war) w.war = (w.war || 1) * 4;
    if (a < 15) povCause(w, S.q);
    else if (S.flags.want) povCause(w, 3 - 2 * S.flags.want);
  }
  if (a >= 10 && suicOn()) { const s = suicShare(c, a, sex); if (s > 0) { let t = 0; for (const k in w) if (w[k] > 0) t += w[k]; w.suic = t * s / (1 - s) * (personal ? Math.pow(suicRR(), suicFade(a)) / ddSuicOff(S.dd, a) / Math.exp(0.03 * (S.flags.hlM || 0)) : 1); } }
  if (c.ck) eraCause(w, c, a, sex);
  for (const k in w) if (!(w[k] > 0)) delete w[k];
  return w;
}
function pickCause(c, a, sex, other) { return wpick(causeWeights(c, a, sex, !other)); }
const SUIC_PROF = {
  hi: [[0.11, 0.5, 0.85, 1.15, 1.25, 1.1, 1.6], [0.3, 0.75, 0.7, 1.15, 1.45, 1, 0.95]], eca: [[0.08, 0.35, 0.8, 1.3, 1.45, 1.35, 1.7], [0.25, 0.7, 0.6, 0.95, 1.3, 1.5, 2.1]],
  lac: [[0.12, 0.6, 1.15, 1.15, 1.1, 1.3, 1.9], [0.35, 1, 1.45, 1.05, 0.95, 0.85, 1]], ssa: [[0.1, 0.45, 0.8, 1, 1.4, 2.3, 3.4], [0.2, 0.7, 0.75, 0.9, 1.3, 2.4, 3.6]],
  sa: [[0.12, 0.7, 1.15, 1.2, 1.15, 1.25, 1.6], [0.35, 1.4, 1.55, 1.05, 0.85, 1, 1.35]], mena: [[0.1, 0.55, 1.05, 1.15, 1.15, 1.4, 2], [0.3, 1, 1.2, 1, 1, 1.3, 1.9]],
  eap: [[0.1, 0.45, 0.75, 0.95, 1.25, 2, 3.4], [0.2, 0.6, 0.6, 0.75, 1.15, 2.2, 3.8]] };
const SUIC_PROF_C = { TWN: 'eap', SGP: 'eap', HKG: 'eap' };
const SUIC_ABS = {
  KOR: [[2.2, 10, 27, 45, 49, 60, 110], [2.8, 12, 20, 20, 15, 16, 26]],
  JPN: [[2.2, 9, 24, 25, 28, 24, 30], [1.8, 8, 12, 10, 11, 12, 13]],
  USA: [[2.4, 14, 25, 29.6, 29.4, 26.4, 40.5], [2.3, 4.8, 6.3, 7.5, 8.4, 5.9, 4.9]] };
const SUIC_NOW = { KOR: 0.835 };
const SUIC_Y = [1990, 1995, 2000, 2005, 2010, 2015, 2017];
function suicYearK(id, yr) {
  const d = SUIC[id]; let k = 1;
  if (d && yr < 2017) { const ys = d[2].concat([1]); if (yr <= 1990) k = ys[0]; else for (let i = 0; i < 6; i++) if (yr <= SUIC_Y[i + 1]) { k = ys[i] + (ys[i + 1] - ys[i]) * (yr - SUIC_Y[i]) / (SUIC_Y[i + 1] - SUIC_Y[i]); break; } }
  const n = SUIC_NOW[id]; if (n) k *= yr >= 2024 ? 1 : yr <= 2017 ? n : n + (1 - n) * (yr - 2017) / 7;
  return k;
}
function suicRate(c, a, sex) {
  if (a < 10) return 0;
  const s = sex === 'F' ? 1 : 0, b = a < 15 ? 0 : a < 18 ? 1 : a < 30 ? 2 : a < 50 ? 3 : a < 70 ? 4 : a < 80 ? 5 : 6, ab = SUIC_ABS[c.id];
  let r;
  if (ab) r = ab[s][b];
  else { const d = SUIC[c.id]; r = (d ? d[s] : s ? 4 : 12) * SUIC_PROF[SUIC_PROF_C[c.id] || c.p][s][b]; }
  return r * (c.yr ? suicYearK(c.id, c.yr) : 1) / 1e5;
}
function suicShare(c, a, sex) { const r = suicRate(c, a, sex); if (!r) return 0; const q = lifeTable(c, sex).q[Math.min(110, a)]; return q > 0 ? Math.min(0.75, r / q) : 0; }
const suicOn = () => !AGE12 && !!S && S.age >= 10 && !HOOK.calm();
function suicRR() {
  const a = S.age, f = S.flags, P = S.fam.partner; let k = 1;
  if (a < 18) {
    if (f.lossY != null && a - f.lossY <= 1) k *= 1.3;
    if (f.suicLoss != null && a - f.suicLoss <= 5) k *= 1.6;
    if (f.raised && (f.raised.k === 'foster' || f.raised.k === 'home')) k *= 1.5;
    if (f.street != null && f.streetOut == null) k *= 2;
    if (S.dd && ddIDk(S.dd)) k *= DD_SUIC;
    return Math.min(15, k) / (SUIC_NORM[C().p] || SUIC_NORM.hi)[0];
  }
  if (S.mind) k *= S.mind.way === 'alone' ? 5 : S.mind.way === 'talk' ? 3 : 2.5;
  else if (f.mindOK != null && a - f.mindOK <= 2) k *= 1.5;
  if (f.lossY != null && a - f.lossY <= 1) k *= 1.3;
  if (P && P.endAt != null && a - P.endAt <= 2) k *= P.divorced ? (S.sex === 'M' ? 1.8 : 1.3) : !P.alive ? (S.sex === 'M' ? 2.2 : 1.5) : 1;
  if (S.job === 'seeking' && a < 65) k *= 1.7;
  if (debtHeavy()) k *= 1.6;
  if (S.alc) k *= 3;
  if (S.gamb) k *= 2.5;
  if (S.job === 'prison') k *= 3; else if (f.relAt != null && a - f.relAt <= 1) k *= 3;
  if (f.termIll && f.termIll.k !== 'dem') k *= 2;
  if (S.refugee) k *= 1.3;
  if (f.suicLoss != null && a - f.suicLoss <= 5) k *= 1.6;
  if (S.job !== 'prison') {
    const h = homeOthers();
    if (a >= 25 && !h.pt && !h.mom && !h.dad && !h.step && !h.kids.length && !h.pt2 && f.oldHome !== 'care') k *= 1.5;
    if (h.pt) k *= 0.8;
    if (S.sex === 'F' && S.fam.kids.some(x => x.alive && !x.away && S.age - x.bornAt < 18)) k *= 0.7;
  }
  if (S.dd && ddIDk(S.dd)) k *= DD_SUIC;
  return Math.min(15, k) / (SUIC_NORM[C().p] || SUIC_NORM.hi)[a < 30 ? 1 : a < 50 ? 2 : a < 70 ? 3 : 4];
}
const SUIC_NORM = { hi: [1.04, 1.39, 1.28, 1.33, 1.44], eca: [1.04, 1.32, 1.2, 1.26, 1.39], lac: [1.04, 1.23, 1.16, 1.28, 1.4], ssa: [1.04, 1.11, 1.09, 1.21, 1.41],
  sa: [1.04, 1.06, 0.96, 1.06, 1.23], mena: [1.04, 1.18, 0.95, 1.03, 1.23], eap: [1.04, 1.19, 1, 1.12, 1.38] };
const suicFade = a => a >= 85 ? clamp(1 - (a - 85) / 20, 0.3, 1) : 1;
function suicMortK(c, a) { if (!suicOn()) return 1; const s = suicShare(c, a, S.sex); return s ? 1 - s + s * suicRR() : 1; }
const SUIC_HELP = () => S && S.age < 19 ? L`도움이 필요할 때: 자살예방상담전화 109 (24시간) · 청소년상담 1388 (문자 #1388) · SNS 상담 마들랜 · 다른 나라는 findahelpline.com`
  : L`도움이 필요할 때: 자살예방상담전화 109 · 정신건강위기상담 1577-0199 (모두 24시간) · SNS 상담 마들랜 · 다른 나라는 findahelpline.com`;
const SUIC_LOSS_F = () => S && S.age < 19 ? L`가까운 사람을 자살로 잃은 사람은 자신을 탓하기 쉽지만, 자살은 한 사람의 탓으로 일어나지 않습니다. 한 사람의 자살은 주변의 많게는 135명에게 영향을 줍니다 (Cerel 외 2018) · 이야기할 곳: 청소년상담 1388 (문자 #1388), 109`
  : L`가까운 사람을 자살로 잃은 사람은 자신을 탓하기 쉽지만, 자살은 한 사람의 탓으로 일어나지 않습니다. 한 사람의 자살은 주변의 많게는 135명에게 영향을 줍니다 (Cerel 외 2018) · 유족을 위한 도움: 109, 가까운 정신건강복지센터 (자살유족 원스톱 서비스)`;
function suicLoss(rel, n) {
  const e = S.log[S.log.length - 1]; if (e) e.d = 'suic';
  if (S.isComp) return;
  if (['par', 'pt', 'kid', 'sib'].includes(rel)) S.flags.suicLoss = S.age;
  const g = (S.flags.grief || []).slice(-1)[0]; if (g && g.n === n) g.s = 1;
  const t = rel === 'kid' ? "Lẽ ra mình phải làm gì, câu hỏi không lời đáp ấy đọng lại trong lòng rất lâu. Gặp gỡ những bậc cha mẹ từng trải qua điều tương tự, bạn mới dần dần thở được."
    : rel === 'pt' ? "Bạn đã tự trách mình rất lâu vì ở ngay bên cạnh mà không nhận ra. Tại một nhóm gặp gỡ của những người cùng trải qua mất mát ấy, lần đầu tiên bạn có thể nói ra chuyện đó."
    : rel === 'par' ? "Tang lễ đã xong mà câu hỏi “tại sao” vẫn còn đó rất lâu. Phải mất một thời gian bạn mới chấp nhận được rằng đó không phải lỗi của ai."
    : rel === 'sib' ? "Những ngày cùng chơi đùa thuở nhỏ cứ hiện về. Những người còn lại trong gia đình hứa với nhau sẽ không ai trách ai."
    : "Gia đình nhẹ nhàng nhắc đến chuyện ấy và an ủi lẫn nhau.";
  log(t, 'note', SUIC_LOSS_F());
  const e2 = S.log[S.log.length - 1]; if (e2) e2.d = 'suic';
}
const COPE_P = 0.0022, LIFELINE_P = 0.0013;
function copeYear(a) {
  if (AGE12 || S.isComp || a < 20 || S.job === 'prison' || S.flags.hideCN) return;
  const k = HOOK.calm() ? 2 : 1, mark = () => { const e = S.log[S.log.length - 1]; if (e) e.d = 'suic'; }, ll = S.flags.lifeL;
  if (ll && !ll.thx && a - ll.a >= 2 && chance(0.4)) { ll.thx = 1; eff({ h: 3, so: 2 });
    log(ll.w === 'co' ? "Một người đồng nghiệp cũ liên lạc với bạn. Người ấy nói rằng nhờ hôm đó bạn đã hỏi han và lắng nghe đến cùng mà mình mới gắng gượng được, và giờ đang dần ổn hơn."
      : L`친구 ${iga(ll.n)} 그날 물어봐 주고 곁에 있어 준 덕분에 버틸 수 있었다며, 지금은 조금씩 괜찮아지고 있다고 했습니다.`, 'warm'); mark(); return; }
  if (!S.flags.cope && a >= 25 && chance(COPE_P * k)) {
    const co = isWorking() && chance(0.35), nm = co ? '' : friendName(5);
    S.flags.cope = a; eff({ so: 2 });
    log(co ? "Một đồng nghiệp tâm sự rằng vài năm trước, người ấy từng trải qua một quãng thời gian khó khăn đến mức không muốn sống nữa. Khi đó người ấy lần đầu nói ra với gia đình, rồi nhờ được tư vấn mà từ từ vượt qua."
      : L`오랜 친구 ${iga(nm)} 살고 싶지 않다는 생각이 들 만큼 힘든 때가 있었다고 털어놓았습니다. 누군가에게 처음 말을 꺼낸 날부터 조금씩 달라졌고, 상담을 받으며 그 시기를 지나왔다고 했습니다.`,
      'warm', L`세계 17개국 조사에서 성인 약 9%가 살면서 한 번은 자살을 생각한 적이 있다고 답했고, 그 가운데 대부분은 그 시기를 지나 살아갑니다 (Nock 외 2008) · ${SUIC_HELP()}`);
    mark(); return;
  }
  if (!ll && chance(LIFELINE_P * k)) {
    const co = isWorking() && chance(0.6), nm = co ? '' : friendName(3);
    S.flags.lifeL = { a, w: co ? 'co' : 'fr', n: nm }; eff({ so: 2 });
    log(co ? "Bạn hỏi một đồng nghiệp dạo này bỗng trầm hẳn đi rằng họ có ổn không. Sau một hồi ngập ngừng, người ấy trả lời rằng đã nghĩ đến cả chuyện tự tử. Bạn lắng nghe đến cùng, rồi cùng người ấy tìm nơi tư vấn và gọi điện."
      : L`한동안 연락이 뜸하던 친구 ${nm}에게서 늦은 밤 걱정스러운 문자가 왔습니다. 바로 전화를 걸어 혹시 자살을 생각하고 있는지 돌려 말하지 않고 물었고, 끝까지 이야기를 들은 뒤 다음 날 함께 상담받을 곳을 찾았습니다.`,
      'warm', L`자살을 생각하는지 직접 묻는 것은 그 생각을 키우지 않습니다. 13개 연구를 모은 검토에서 오히려 줄어들 수 있다고 했습니다 (Dazzi 외 2014) · ${SUIC_HELP()}`);
    mark();
  }
}
function cancerType(a, sex, c) {
  if (a < 20) return { leuk: "bệnh bạch cầu", brain: "u não", lymph: "ung thư hạch", bone: "ung thư xương", kidney: "ung thư thận ở trẻ em" }[wpick({ leuk: 40, brain: 25, lymph: 12, bone: a >= 10 ? 10 : 3, kidney: a < 10 ? 8 : 1 })];
  if (a < 35) { const y = { leuk: 18, lymph: 14, brain: 10, stomach: 6, colorectal: 5, liver: c.p === 'ssa' || c.p === 'eap' ? 10 : 4 }; if (sex === 'F') { y.breast = 18; y.cervix = (c.p === 'ssa' || c.p === 'sa') ? 14 : 6; } else y.testis = 8;
    return { leuk: "bệnh bạch cầu", lymph: "ung thư hạch", brain: "u não", stomach: "ung thư dạ dày", colorectal: "ung thư đại trực tràng", liver: "ung thư gan", breast: "ung thư vú", cervix: "ung thư cổ tử cung", testis: "ung thư tinh hoàn" }[wpick(y)]; }
  const w = { lung: 20, colorectal: 12, stomach: 8, liver: 8, pancreas: 6, leuk: a < 30 ? 30 : 4, esoph: 4 };
  if (sex === 'F') { w.breast = 18; w.cervix = (c.p === 'ssa' || c.p === 'sa') ? 16 : 4; w.lung *= 0.6; } else { w.prostate = c.p === 'ssa' || c.p === 'lac' ? 14 : 8; }
  if (c.p === 'eap' || ['KOR', 'JPN', 'TWN'].includes(c.id)) { w.stomach *= 2; w.liver *= 2; }
  if (c.p === 'sa' && sex === 'M') w.oral = 14;
  if (c.p === 'ssa') { w.liver *= 1.5; w.esoph *= 2; }
  if (S && (S.smoker || S.flags.exSmoker) && S.sex === sex) w.lung *= 2.5;
  const n = { lung: "ung thư phổi", colorectal: "ung thư đại trực tràng", stomach: "ung thư dạ dày", liver: "ung thư gan", pancreas: "ung thư tụy", leuk: "bệnh bạch cầu", esoph: "ung thư thực quản", breast: "ung thư vú", cervix: "ung thư cổ tử cung", prostate: "ung thư tuyến tiền liệt", oral: "ung thư khoang miệng" };
  return n[wpick(w)];
}
function causeLabel(k, a, sex, c) {
  c = c || C();
  const ek = c.yr ? eraLabel(k, c) : null; if (ek) return ek;
  if (k === 'can') return cancerType(a, sex, c);
  if (k === 'oinf') return pick(OINF);
  if (k === 'ocd') return pick(OCD_SUB);
  return CAUSE[k];
}