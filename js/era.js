// js/era.js - Lich su, chien tranh, ky nguyen, cua hang, am ap
function promoText() {
  if (S.job === 'owner') return varied('promo', ["Doanh thu của cửa hàng tăng mạnh.", "Khách quen đông thêm, việc buôn bán thuận lợi.", "Tiếng lành đồn xa, khách đến đông hơn."]);
  if (!S.formal) return varied('promo', promoInformal(S.job));
  if (['civil', 'teacher', 'police', 'soldier'].includes(S.job)) return varied('promo', ["Bạn được lên bậc lương, lương tháng tăng lên.", "Được đánh giá công tác tốt, lương của bạn tăng lên."]);
  return varied('promo', ["Năng lực được ghi nhận, lương năm của bạn tăng lên.", "Bạn được giao việc lớn hơn. Lương cũng tăng theo.", "Được đánh giá tốt, lương của bạn tăng lên.", "Bạn hoàn thành tốt việc được giao, nhận tiền thưởng và được tăng lương năm."]);
}
const HOBBY_MS = {
  reading: ["Mê đọc sách, bạn bắt đầu tham gia một câu lạc bộ đọc sách trong khu phố.", "Những cuốn sách bạn đã đọc phủ kín cả một bức tường trong nhà. Bạn bắt đầu cho trẻ con trong xóm mượn sách."],
  faith: ["Bạn gặp được những người đồng điệu trong cộng đồng tín ngưỡng của mình.", "Trong cộng đồng, bạn nhận việc chăm lo cho những người hàng xóm khó khăn."],
  screen: ["Bạn thức trắng đêm cùng bạn bè bàn về bộ phim truyền hình yêu thích.", "Có con mắt xem phim, bạn bắt đầu viết cảm nhận. Khá nhiều người đọc."],
  sns: ["Bạn chia sẻ tin tức với những người bạn ở xa qua mạng xã hội.", "Đã có những người mong chờ bài đăng của bạn trên mạng xã hội."],
  games: ["Bạn có thêm những người bạn cùng chơi điện tử.", "Bạn vô địch một giải thi đấu trò chơi điện tử trong khu phố!"],
  board: ["Bạn có thêm những người bạn cùng chơi điện tử.", "Bạn vô địch một giải đấu trong khu phố!"],
  travel: ["Càng đi nhiều nơi, bạn càng thấy thế giới rộng lớn.", "Mọi người tìm đến để nghe bạn kể chuyện du lịch."],
  cooking: ["Tay nghề nấu nướng của bạn khá lên, người xung quanh đều thích.", "Tay nghề nấu nướng của bạn giỏi đến mức có thể lo trọn phần ăn cho các buổi tiệc trong xóm."],
  garden: ["Bạn chia rau trồng ở vườn nhà cho hàng xóm.", "Mảnh vườn của bạn trở thành mảnh vườn tươi tốt nhất xóm."],
  hiking: ["Bạn có những người bạn cùng leo núi mỗi cuối tuần.", "Bạn đã lên đến đỉnh ngọn núi cao mà bạn ao ước từ lâu."],
  fishing: ["Bạn có những người bạn cùng đi câu cá.", "Bạn trở thành một trong những tay câu cá cừ nhất vùng."],
  crafts: ["Bạn tặng gia đình những món đồ tự tay làm.", "Những món đồ bạn làm theo sở thích bắt đầu bán được ở chợ phiên, mang lại một khoản tiền tiêu vặt kha khá."],
  photo: ["Bạn có những người bạn cùng mê chụp ảnh.", "Ảnh bạn chụp được treo trong một cuộc triển lãm nhỏ."],
  art: ["Bạn tặng tranh mình vẽ cho gia đình và bạn bè.", "Tranh bạn vẽ được treo trên tường một quán cà phê trong khu phố. Còn có người muốn mua."],
  gym: ["Bạn có những người bạn cùng tập thể dục.", "Cơ thể bạn khỏe khoắn lên trông thấy, khác hẳn ngày trước."],
  karaoke: ["Bạn trở thành khách quen của quán karaoke.", "Bạn đoạt giải trong một cuộc thi hát của khu phố!"],
  music: ["Bạn có những người bạn cùng chơi nhạc.", "Bạn biểu diễn trên một sân khấu nhỏ. Tiếng vỗ tay kéo dài mãi."],
  dance: ["Bạn có những người bạn cùng nhảy múa.", "Bạn nhảy trên sân khấu của một lễ hội."],
  drama: ["Bạn có những người bạn cùng dựng kịch ở một đoàn kịch trong khu phố.", "Bạn đóng vai chính trên một sân khấu nhỏ. Tiếng vỗ tay lúc chào màn kéo dài mãi."],
  sport: ["Bạn có những người bạn cùng chơi thể thao.", "Trình độ của bạn đã lên hàng khá giỏi. Bạn đoạt giải ở một giải đấu địa phương!"],
};
const giftK = () => S.flags.gift === 'none' ? 0 : S.flags.gift === 'some' ? 0.5 : 1;
const homeRankInc = lo => incomeAt(B(), Math.max(lo, S.income > 0 ? pctOfIncome(C(), S.income) : 0));
const kinFar = () => S.cur !== S.born;
function giftSkip(t) {
  eff({ so: 1, h: 1 });
  if (chance(0.15)) { eff({ so: -2 }); return { t: t + ' ' + "Bạn cũng thoáng thấy có người hơi phật lòng.", k: 'ev' }; }
  return t;
}
function expenseCost(k) {
  const c = C(), med = incomeAt(c, 0.5), mine = Math.max(S.income, incomeAt(c, 0.4)), rich = 1 + Math.min(1.5, Math.max(0, mine / med - 1) * 0.5);
  if (k === 'roof') return S.urban && !SUBURB.includes(S.cur) ? Math.max(med * 0.05, S.house * 0.006) : Math.max(med * 0.1, S.house * 0.02);
  if (k === 'rent') return mine * 0.06;
  if (k === 'appl') return med * 0.03 * rich * (atParents() ? 0.35 : 1);
  if (k === 'applFull') return med * 0.03 * rich;
  if (k === 'fix') return med * 0.05 * rich * clamp(0.5 + vehAge() * 0.06, 0.8, 1.6);
  if (k === 'funeral') return kinFar() ? Math.min(homeRankInc(0.4) * 0.006, incomeAt(B(), 0.5) * 0.02) : Math.min(mine * 0.006, med * 0.02);
  return mine * 0.05;
}
const vehAge = () => { const y = S.owns.car != null && S.owns.car !== false ? S.owns.car : S.owns.moto; return typeof y === 'number' ? Math.max(0, S.age - y) : 10; };
const atParents = () => !S.fam.married && withParents() && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent));
const SUBURB = ['USA', 'CAN', 'AUS', 'NZL'];
function expenseOpts() {
  const a = S.age, gap = k => S.flags['exp_' + k] == null || a - S.flags['exp_' + k] >= ({ roof: 12, rent: 6, appl: 15, funeral: 5, fix: 10 }[k]);
  const o = [];
  const away = S.flags.oldHome === 'care' || S.flags.oldHome === 'kid';
  const kinGift = !farFromNK();
  const funL = kinFar() ? "Nghe tin một người họ hàng ở quê qua đời, bạn gửi tiền phúng viếng về." : "Bạn góp tiền phúng viếng đám tang một người họ hàng.";
  if (away) { if (kinGift && gap('funeral')) o.push(['funeral', funL]); return o; }
  if (S.house && gap('roof')) o.push(['roof', pick(S.urban && !SUBURB.includes(S.cur) ? ["Nước từ nhà tầng trên rò xuống, bạn phải sửa lại trần và giấy dán tường. Tốn một khoản lớn.", "Bạn thay toàn bộ đường ống cũ. Tốn một khoản lớn.", "Lò sưởi hỏng, bạn phải thay cái mới. Tốn một khoản lớn."]
    : ["Mái nhà bị dột, bạn phải sửa mái. Tốn một khoản lớn.", "Bạn thay toàn bộ đường ống cũ. Tốn một khoản lớn."])]);
  const atPar = atParents(), parPay = atPar && S.income <= 0 && S.q >= 3;
  if (!S.house && S.urban && !atPar && S.job !== 'soldier' && !(S.flags.pubRent && S.cur === 'KOR') && gap('rent')) o.push(['rent', S.invest === 'property' ? "Tiền thuê nhà tăng. Khoản tiền bạn đầu tư vào bất động sản cũng tăng theo, nên bạn không thiệt nhiều." : shopInc() >= incomeAt(C(), 0.5) * 2 ? "Tiền thuê nhà tăng." + ' ' + "Cũng không phải gánh nặng lớn cho chi tiêu gia đình." : "Tiền thuê nhà tăng, chi tiêu sinh hoạt trở nên eo hẹp."]);
  if ((S.owns.tv != null ? S.age - S.owns.tv >= 8 : C().ppp >= 20000) && gap('appl') && !parPay) o.push(['appl', atPar ? pick(["Tủ lạnh nhà bố mẹ hỏng, bạn góp tiền mua cái mới.", "Máy giặt nhà bố mẹ hỏng, bạn góp tiền mua cái mới."]) : pick(["Chiếc tủ lạnh dùng đã lâu bị hỏng, bạn mua cái mới.", "Chiếc tivi dùng đã lâu bị hỏng, bạn mua cái mới."])]);
  if ((S.owns.car || S.owns.moto) && vehAge() >= (S.owns.car ? 5 : 4) && gap('fix')) o.push(['fix', S.owns.car ? "Xe ô tô hỏng nặng, tiền sửa tốn rất nhiều." : "Bạn phải đại tu toàn bộ động cơ xe máy."]);
  if (kinGift && gap('funeral')) o.push(['funeral', funL]);
  return o;
}
const SNOWY = ['RUS', 'UKR', 'BLR', 'KAZ', 'KGZ', 'TJK', 'UZB', 'MNG', 'CAN', 'USA', 'KOR', 'PRK', 'JPN', 'CHN', 'POL', 'DEU', 'CZE', 'SVK', 'HUN', 'ROU', 'BGR', 'SRB', 'AUT', 'CHE', 'SWE', 'NOR', 'FIN', 'DNK', 'EST', 'LVA', 'LTU', 'TUR', 'IRN', 'AFG', 'GEO', 'ARM', 'AZE', 'FRA', 'ITA', 'GBR', 'NLD', 'BEL', 'BIH', 'MKD', 'ALB', 'HRV', 'SVN', 'MDA', 'ISL', 'IRL', 'NPL', 'BTN'];
const LAYOFF_P = { pilot: 0.03, cabin: 0.05, designer: 0.04, trainer: 0.06, construct: 0.08, cook: 0.07, callc: 0.07, creator: 0.06, delivery: 0.06, garment: 0.06, domestic: 0.06, shop: 0.05, hair: 0.05, driver: 0.05,
  factory: 0.05, miner: 0.05, vendor: 0.05, guard: 0.045, mechanic: 0.04, electric: 0.04, artisan: 0.04, clerk: 0.035, dev: 0.035, care: 0.03, engineer: 0.03, finance: 0.03,
  cleaner: 0.05, warehouse: 0.06, childcare: 0.03, salesagent: 0.08, welder: 0.06 };
const casualJob = id => !(JOBS[id] && (JOBS[id].special || (JOBS[id].e || 0) >= 2));
const svcCommit = () => S.job === 'soldier' && ((S.flags.offc != null && S.age - S.flags.offc < 5) || (S.flags.offc == null && S.flags.nco != null && S.age - S.flags.nco < 4));
const STATE_J = new Set(['civil', 'police', 'soldier']);
const layoffP = id => svcCommit() && id === 'soldier' ? 0 : Math.min(0.3, (LAYOFF_P[id] || 0.04 * (LAYOFF_K[id] || 1)) * (S.formal ? 1 : !casualJob(id) ? 1.5 : S.urban ? 3 : 5) * (lowInc(C()) ? 1.25 : 1) * (S.st.sm < 12 ? 1.4 : 1) * (STATE_J.has(id) ? (['KOR', 'JPN'].includes(S.cur) && id === 'civil' ? 0.25 : 1) : eraLayK(id)) * (disOn() || (S.dd && S.dd.told) ? 2 : 1) * (id === 'clerk' ? ({ spec: 0.7, sales: 1.2 })[S.flags.ofPath] || 1 : 1));
const LAYOFF_K = { doctor: 0.08, nurse: 0.15, civil: 0.1, teacher: 0.2, police: 0.15, soldier: 0.2, lawyer: 0.25, prof: 0.3, engineer: 0.6, finance: 0.7, dev: 0.8, care: 0.5, healthtech: 0.3, social: 0.4 };
const LAYOFF_T = { pilot: "Hãng hàng không cắt giảm đường bay và cho các phi công nghỉ việc.", cabin: "Hãng hàng không cắt giảm đường bay và cho các tiếp viên nghỉ việc.", vendor: "Buôn bán ế ẩm, bạn dẹp sạp hàng rong.", hair: "Tiệm làm tóc nơi bạn làm việc đã đóng cửa.", mechanic: "Xưởng sửa xe nơi bạn làm việc đã đóng cửa.", driver: "Công ty vận tải nơi bạn làm việc cắt giảm tài xế.", delivery: "Việc giao hàng ít dần, bạn mất việc.", guard: "Công ty bảo vệ mất hợp đồng, bạn mất việc.", care: "Cơ sở chăm sóc người già nơi bạn làm việc đã đóng cửa.", creator: "Không còn mối việc nào, một thời gian bạn không có thu nhập.", police: "Bạn bị kỷ luật và phải rời ngành cảnh sát.", civil: "Cơ quan bị sáp nhập, bạn mất vị trí công tác.", soldier: "Quân đội cắt giảm quân số, bạn phải rời quân ngũ.", factory: "Nhà máy nơi bạn làm việc đóng cửa, bạn mất việc.", garment: "Xưởng may đóng cửa, bạn mất việc.", construct: "Các công trình ngừng thi công, việc làm của bạn cũng không còn.", miner: "Mỏ đóng cửa, bạn mất việc.", clerk: "Công ty tái cơ cấu, bạn mất việc.", callc: "Tổng đài chăm sóc khách hàng chuyển sang nước khác, bạn mất việc.", finance: "Công ty tái cơ cấu, bạn mất việc.", dev: "Công ty tái cơ cấu, bạn mất việc.", engineer: "Công ty tái cơ cấu, bạn mất việc.", shop: "Cửa hàng nơi bạn làm việc đã đóng cửa.", cook: "Nhà hàng nơi bạn làm việc đã đóng cửa.", domestic: "Gia đình bạn giúp việc nói rằng họ không cần người làm nữa.",
  cleaner: "Hợp đồng dịch vụ vệ sinh kết thúc, bạn mất việc.", warehouse: "Trung tâm kho vận đưa máy móc vào và cắt giảm nhân công.", salesagent: "Doanh số không đạt, công ty chấm dứt hợp đồng với bạn.",
  welder: "Công trình kết thúc, việc làm cũng hết.", childcare: "Trẻ ít đi, nhà trẻ nơi bạn làm việc phải đóng cửa." };
const LAYOFF_TF = { welder: "Công ty nơi bạn làm việc ít việc hơn nên đã cắt giảm người.", construct: "Công ty xây dựng nơi bạn làm việc không giành được công trình mới nên đã cắt giảm người." };
const LAYOFF_MOVE = { doctor: "Bệnh viện nơi bạn làm việc đóng cửa. Vài tháng sau, bạn lại khám chữa bệnh ở một bệnh viện khác.", nurse: "Bệnh viện nơi bạn làm việc đóng cửa. Vài tháng sau, bạn lại đi làm ở một bệnh viện khác.", lawyer: "Văn phòng luật nơi bạn làm việc đóng cửa. Vài tháng sau, bạn chuyển sang một văn phòng khác.", prof: "Đề tài nghiên cứu kết thúc, bạn phải tìm chỗ khác. Vài tháng sau, bạn có được vị trí ở một viện nghiên cứu khác.", teacher: "Ngôi trường nơi bạn dạy đã đóng cửa. Sang học kỳ sau, bạn chuyển đến trường khác." };
const HAZ_P = { F: [0.004, 0.012], Q: [0.002, 0.006], S: [0.004, 0.012], D: [0.006, 0.015], E: [0.04, 0], H: [0, 0.02] };
let QZ_MAP = null;
const QUAKE_ZONE = () => QZ_MAP || (QZ_MAP = new Map([
  ...["tỉnh Tứ Xuyên", "tỉnh Hà Bắc", "tỉnh Vân Nam", "tỉnh Cam Túc", "tỉnh Thiểm Tây", "Urumqi", "Kashgar", "Hotan", "Aksu", "địa khu Kashgar", "địa khu Hotan", "địa khu Aksu",
    "Ili", "Turpan", "khu tự trị Duy Ngô Nhĩ Tân Cương", "Lhasa", "Shigatse", "Xining", "khu tự trị Tây Tạng", "miền tây tỉnh Tứ Xuyên", "tỉnh Thanh Hải", "miền nam tỉnh Cam Túc", "vùng tây bắc tỉnh Vân Nam"].map(n => [n, 2]),
  ...["tỉnh Hồ Nam", "Quảng Tây", "tỉnh Quý Châu", "tỉnh Giang Tây", "tỉnh Hồ Bắc", "tỉnh Hắc Long Giang"].map(n => [n, 0.25])]));
const QUAKE_CITY = [1, 2, 0.25, 1, 1, 0.25, 2, 1];
const quakeK = () => { if (S.cur !== 'CHN') return 1; const w = S.urban ? S.city : ruralWhere(), i = S.urban ? (CITIES.CHN || '').split(',').indexOf(w) : -1; return i >= 0 ? QUAKE_CITY[i] : (w && QUAKE_ZONE().get(w)) || 1; };
const FLOOD_CITY = { DEU: [0.03, 0.06, 1, 1] };
const floodK = () => { const k = FLOOD_CITY[S.cur]; if (!k || !S.urban) return 1; const i = (CITIES[S.cur] || '').split(',').indexOf(S.city); return i >= 0 ? k[i] : 1; };
function hazardRoll(c) {
  if (S.flags.lastHaz != null && S.age - S.flags.lastHaz < 3) return null;
  const kinds = c.haz.split('').sort(() => rnd() - 0.5);
  for (const kind of kinds) {
    let [sev, mild] = HAZ_P[kind] || [0, 0]; const hk = eraHazK() * (kind === 'Q' ? quakeK() : kind === 'F' ? floodK() : 1); sev *= hk; mild *= hk;
    if (kind === 'D') sev = S.urban ? 0 : lowInc(c) ? 0.03 : 0.006;
    if (kind === 'E' && typeof ecoYr === 'function' && ecoYr() != null && ecoYr() < NOW_Y && ECON_BY[c.id]) continue;
    if (chance(sev)) { S.flags.lastHaz = S.age; return { kind, severe: true }; }
    if (chance(mild)) { S.flags.lastHaz = S.age; return { kind, severe: false }; }
  }
  return null;
}
const ECO_EXPO = { cash: 1, bond: 1, mix: 0.6, stock: 0.3, trade: 0.3, property: 0.3, world: 0 };
const ecoExpo = () => ECO_EXPO[S.invest || 'cash'] ?? 1;
const ECO_FACT = "Khi khủng hoảng tiền tệ ập đến, tiền gửi bằng đồng nội tệ không theo kịp giá cả. Năm 1998 ở Nga, đồng rúp rớt từ 6,3 xuống 21 rúp đổi 1 đô la chỉ trong hơn một tháng, và giá cả năm đó tăng 84%. Năm 2002 ở Argentina, trong khi giá cả tăng 41%, đồng peso mất hơn 70% giá trị";
const fxOn = () => !!(S.flags.fx && C().haz && C().haz.includes('E'));
function econCrisis(pool) {
  const c = C(), m = Math.max(0, S.money), med = incomeAt(c, 0.5), t0 = "Khủng hoảng kinh tế ập đến, giá cả tăng vọt.";
  const l0 = 0.05 + 0.25 * rnd(); S.flags.ecoL = l0 * ecoExpo();
  if (S.invest === 'world' && m > 0) { S.flags.ecoL = null; S.flags.fxJ = l0 * 2; eff({ h: -3 }); return log(t0 + ' ' + "Tiền tiết kiệm của bạn đặt vào quỹ chỉ số thế giới, nên khi đồng nội tệ mất giá, số tiền ấy lại tăng lên tương ứng.", 'ev', ECO_FACT); }
  if (fxOn() && m > 0) {
    eff({ h: -3 });
    if (chance(0.1)) { const x = m * 0.25; S.money -= x; book("Đồng tiền mất giá", -x);
      return log(t0 + ' ' + L`은행들이 예금 인출을 막아, 달러로 맡겨 둔 돈의 일부를 돌려받지 못했습니다. (−${wonStr(x)})`, 'bad', "Năm 2001–02, Argentina phong tỏa việc rút tiền và đổi tiền gửi đô la sang peso theo tỷ giá 1,4 peso đổi 1 đô la. Từ năm 2019, các ngân hàng Liban cũng chặn việc rút tiền gửi bằng đô la"); }
    return log(t0 + ' ' + "Nhờ đã đổi sang đô la và vàng, số tiền dành dụm của bạn giữ được giá trị.", 'ev', ECO_FACT);
  }
  if (m < med * 0.3) {
    const x = m * S.flags.ecoL; S.flags.ecoL = null; eff({ h: -6 }); if (x > 0) { S.money -= x; book("Đồng tiền mất giá", -x); }
    return log(t0 + ' ' + (m > 0 ? "Không có nhiều tiền dành dụm, bạn chống chọi với giá cả leo thang từng ngày." : "Không có tiền dành dụm, bạn chống chọi với giá cả leo thang từng ngày."), 'bad', ECO_FACT);
  }
  pool.push(['disaster', { kind: 'E' }]);
}
function mildDisaster(kind) {
  const c = C(), kid = S.age < 18, care = careNow();
  const storm = c.p === 'sa' || ['MOZ', 'MDG', 'MWI', 'MUS', 'COM', 'FJI', 'SLB', 'MMR', 'OMN', 'AUS'].includes(c.id) ? "bão xoáy" : c.p === 'eap' || ['JPN', 'KOR', 'TWN', 'HKG', 'MAC'].includes(c.id) ? "bão" : "bão cuồng phong";
  const t = {
    F: kid ? (S.school ? "Mưa lớn làm khu phố ngập nước, bạn phải nghỉ học mấy ngày." : "Mưa lớn làm khu phố ngập nước, mấy ngày liền bạn không ra khỏi nhà được.") : care ? "Lũ lụt cắt đứt đường sá, một thời gian cuộc sống rất vất vả." : pick([isWorking() ? "Mưa lớn làm khu phố ngập nước. Mấy ngày liền bạn không đi làm được." : "Mưa lớn làm khu phố ngập nước. Mấy ngày liền bạn không ra khỏi nhà được.", "Lũ lụt cắt đứt đường sá, một thời gian cuộc sống rất vất vả."]),
    Q: care ? "Động đất làm tòa nhà viện dưỡng lão rung lắc dữ dội. Không ai bị thương." : "Động đất làm ngôi nhà rung lắc dữ dội. Tường bị nứt nhưng không ai bị thương.",
    S: care ? L`${iga(storm)} 지나가며 며칠 동안 전기가 끊겼습니다.` : L`${iga(storm)} 지나가며 지붕이 상하고 며칠 동안 전기가 끊겼습니다.`,
    D: S.urban || !(isWorking() && JOBS[S.job] && JOBS[S.job].s.startsWith('agr')) ? "Hạn hán kéo dài khiến giá nước và giá lương thực tăng." : "Hạn hán khiến mùa màng giảm sút.",
    H: kid ? "Một đợt nắng nóng kỷ lục ập đến. Một thời gian dài bạn không thể ra ngoài chơi." : "Nắng nóng kỷ lục kéo dài mãi. Đó là một mùa hè mệt nhoài vì cái nóng.",
  }[kind];
  if (!t) return;
  const dmg = kid || (care && 'FQS'.includes(kind)) ? 0 : Math.max(S.income, incomeAt(c, 0.3)) * 0.03; if (dmg) { S.money -= dmg; book("Thiệt hại do thiên tai", -dmg); }
  eff(kind === 'H' && S.age >= 65 ? { h: -3, hl: -3 } : { h: -3 });
  log(dmg ? `${t} (−${wonStr(dmg)})` : t, 'bad', "Chỉ riêng năm 2023, khoảng 93 triệu người đã chịu ảnh hưởng của thiên tai như lũ lụt, bão, hạn hán và động đất (EM-DAT)");
}
function childDisaster(kind) {
  const c = C(), n = { F: "lũ lụt", Q: "động đất", S: c.p === 'eap' || c.id === 'JPN' || c.id === 'KOR' ? "bão" : c.p === 'sa' || ['MOZ', 'MDG', 'MWI'].includes(c.id) ? "bão xoáy" : "bão cuồng phong", D: "hạn hán", E: "khủng hoảng kinh tế khiến giá cả tăng vọt", H: "đợt nắng nóng khắc nghiệt" }[kind];
  const fact = "Năm 2023, thiên tai khiến khoảng 26,4 triệu người trên thế giới phải rời bỏ nhà cửa, sơ tán ngay trong nước mình (IDMC 2024)";
  if (kind === 'Q' && chance(0.003)) { die('inj', "động đất"); return; }
  if (kind === 'F' && chance(0.0015)) { die('drown', "lũ lụt"); return; }
  const poor = lowInc(c) && S.q <= 3;
  if (kind === 'E') { eff({ h: -4 }); log(poor ? L`${iga(n)} 닥쳤습니다. ${eun(parW())} 끼니부터 줄였습니다.` : L`${iga(n)} 닥쳤습니다. 집안 분위기가 무거워졌습니다.`, 'bad', "Khi giá cả tăng, gia đình càng nghèo càng bị ảnh hưởng nặng, vì tiền ăn chiếm phần lớn hơn trong chi tiêu (Ngân hàng Thế giới)"); return; }
  if (kind === 'H') { eff({ hl: -2 }); log("Một đợt nắng nóng kỷ lục ập đến. Một thời gian dài bạn không thể ra ngoài chơi.", 'bad'); return; }
  if (kind === 'D') { eff({ hl: S.urban ? -1 : -4, h: -4 }); log(S.urban ? "Hạn hán kéo dài khiến giá nước và giá gạo tăng." : "Hạn hán kéo dài làm hỏng cả mùa màng. Một thời gian, bạn sống qua ngày với một bữa ăn mỗi ngày.", 'bad', fact); if (poor && !S.urban && S.q > 1 && chance(0.3)) S.q--; return; }
  eff({ h: -6, hl: -2 });
  log(L`${iga(n)} 마을을 덮쳤습니다. ${pick(poor ? [L`${eun(parW())} 빚을 내 무너진 집을 다시 고쳤습니다.`, "Một thời gian, bạn phải nương nhờ nhà họ hàng.", "Nhờ hàng xóm chung tay, ngôi nhà bị sập đã được dựng lại."] : [L`${eun(parW())} 모아 둔 돈으로 집을 다시 고쳤습니다.`, "Bạn cùng hàng xóm dọn dẹp những gì bị tàn phá."])}`, 'bad', fact);
  if (poor && S.q > 1 && chance(0.25)) S.q--;
}
DEC.hivtx = {
  build: () => ({ title: "Bắt đầu điều trị?", body: S.hiv.src === 'birth' ? "Bạn biết được rằng mình mang HIV từ lúc chào đời, lây từ mẹ." : "Bạn nhận kết quả dương tính với HIV. Bạn sợ những người xung quanh biết chuyện.", fact: "Trong khoảng 39,9 triệu người có HIV trên thế giới, 77% đang được điều trị. Nếu điều trị đều đặn, người có HIV có thể sống lâu gần bằng người không nhiễm (UNAIDS 2024)",
    choices: [{ k: 'art', label: "Bắt đầu điều trị", sub: "Uống thuốc mỗi ngày · tuổi thọ gần như phục hồi" }, { k: 'hide', label: "Không nói với ai và trì hoãn", sub: "Sợ bị kỳ thị · rất nguy hiểm" }] }),
  apply: k => {
    if (k === 'art') { S.hiv.art = true; eff({ h: -2 }); return pick(["Bạn đã bắt đầu điều trị. Mỗi ngày bạn uống thuốc vào cùng một giờ.", "Bạn đã bắt đầu điều trị. Chuyên viên tư vấn giới thiệu cho bạn một nhóm những người cùng hoàn cảnh."]); }
    S.flags.hivAsk = S.age + 3; eff({ h: -8 }); return { t: "Bạn không thể nói với ai.", k: 'bad' };
  }
};
const med = () => incomeAt(C(), 0.5);
const FAM_PAY = [0, 0.05, 0.2, 0.45, 0.75, 1];
const famCareSh = () => S.age >= 18 && S.age < 35 && !S.fam.married && famCanHelp() && !rohCamp() ? (S.flags.rich ? 1 : [0, 0, 0, 0, 0.5, 0.8][S.q] || 0) : 0;
const famCareHelp = m => { const x = m * famCareSh(); if (x > 0) { S.money += x; book("Tiền viện phí bố mẹ trả giúp", x); } return x; };
function remitNews() {
  const n = S.flags.remitN = (S.flags.remitN || 0) + 1, rural = S.bornUrban === false;
  const ch = S.flags.careHome, pc = S.flags.parCame != null, mB = S.fam.mom.alive && ch !== 'mom' && !pc, dB = S.fam.dad.alive && !S.fam.dad.absent && ch !== 'dad' && !pc;
  const sib = S.age < 45 && sibAliveList().some(s => s.d < 0 && s.age < 25), par = !famCame() && (mB || dB), parW = () => mB && dB ? "bố mẹ" : mB ? "mẹ" : "bố";
  const L1 = ["Bạn gửi tiền về quê. Tin nhắn về rằng mái nhà ở quê đã được lợp lại.",
    sib ? "Bạn gửi tiền về quê. Tin nhắn về rằng tiền đã góp vào học phí cho các em." : par ? L`송금을 보냈습니다. ${parW()}의 약값과 병원비에 썼다는 소식이 왔습니다.` : "Bạn gửi tiền về quê. Tin nhắn về rằng họ hàng đã tích trữ đủ lương thực cho mùa đông.",
    rural ? "Bạn gửi tiền về quê. Tin nhắn về rằng ở nhà đã đào giếng và đặt bồn nước ngay trước cửa." : "Bạn gửi tiền về quê. Tin nhắn về rằng nhà ở quê đã có tủ lạnh và được kéo điện mới.",
    par ? (rural ? L`송금을 보냈습니다. ${parW()}께서 그 돈으로 소 한 마리를 들였다는 소식이 왔습니다.` : L`송금을 보냈습니다. ${parW()}께서 그 돈으로 작은 가게를 열었다는 소식이 왔습니다.`) : "Bạn gửi tiền về quê. Tin nhắn về rằng nhà ở quê đã xây thêm một gian phòng.",
    "Bạn gửi tiền về quê. Nghe nói cuộc sống ở quê nhà đã dễ thở hơn nhiều, và cả xóm hay nhắc đến bạn."];
  const later = ["Bạn gửi tiền về quê. Một lời nhắn ngắn báo đã nhận được tiền, kèm theo một tấm ảnh.", "Bạn gửi tiền về quê. Nghe nói lần này tiền được góp vào việc hiếu hỉ trong nhà.", par ? L`송금을 보냈습니다. ${parW()}께서 이제 그만 보내도 된다고, 네 몸이나 챙기라고 하셨습니다.` : "Bạn gửi tiền về quê. Tin nhắn về rằng tiền đã góp vào học phí cho đứa cháu."];
  return n <= L1.length ? L1[n - 1] : pick(later);
}
const famCanHelp = () => (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !farFromNK() && !S.refugee;
const hschSec = c => c.ppp < 15000;
const hschPer = c => incomeAt(c, 0.5) * (hschSec(c) ? 0.25 : 0.12);
const hschN = () => clamp(1 + Math.floor(netWorth() / (hschPer(B()) * 60)), 2, 6);
function hschAsk(c, a, add) {
  if (S.done.hsch || S.flags.hsch || a < 45 || a > 75 || S.job === 'prison' || S.refugee || S.serveLeft > 0 || farFromNK()) return;
  const b = B(), per = hschPer(b), nw = netWorth();
  if (nw < per * 30 || S.money < per * 4) return;
  let p = 0.01 * clamp(nw / (per * 120), 0.25, 2);
  if (S.cur !== S.born && b.ppp < c.ppp * 0.6) p *= 2.5;
  if (S.q <= 2) p *= 1.5;
  if (['teacher', 'prof'].some(j => S.job === j || (S.exp && S.exp[j] && S.exp[j][0] >= 5))) p *= 1.4;
  if (S.rel !== 'N' && S.hobbies.some(h => h.id === 'faith')) p *= 1.3;
  if (chance(p)) add('hsch');
}
const hschPlace = away => S.bornUrban && S.bornCity ? (away ? cityIn(B().ko, S.bornCity) : S.bornCity) : (away ? L`${B().ko}의 마을` : "ngôi làng");
function hschPay(add, sv) {
  const H = S.flags.hsch; if (!H || H.end != null) return;
  const cost = H.n * hschPer(B()), cannot = S.job === 'prison' || S.refugee || farFromNK();
  const left = S.money + (sv || 0), need = cost + Math.max(0, -(sv || 0));
  if (H.off) { if (!cannot && left >= need * 6) { H.off = 0; H.back = 1; } else return; }
  else if (cannot || left < need * 2) { H.off = 1; H.cut = 1; return; }
  add("Học bổng cho quê nhà", -cost); H.y++; H.paid = 1;
}
function hschEnd() {
  const H = S.flags.hsch; if (!H || H.end != null) return null;
  H.end = S.age; H.off = 0; H.cut = 0; H.back = 0;
  return "Bạn khép lại quỹ học bổng ở quê nhà tại đây." + (H.st > 0 ? ' ' + L`그동안 장학생 ${H.st}명을 도왔습니다.` : '');
}
function hschYear(a) {
  const H = S.flags.hsch; if (!H || S.phase !== 'life' || H.end != null) return;
  if (H.cut) { H.cut = 0; H.offN = (H.offN || 0) + 1; if (H.offN <= 2) log("Chi tiêu eo hẹp, năm nay bạn không gửi được học bổng.", 'note'); return; }
  if (H.back) { H.back = 0; if (H.offN <= 2) log("Hoàn cảnh khá lên, bạn lại bắt đầu gửi học bổng.", 'warm'); }
  if (!H.paid) return; H.paid = 0;
  const G = H.sec ? 3 : 4, nm = () => otherName(S.cl, chance(0.5) ? 'F' : 'M');
  if ((H.y - 1) % G === 0) H.st += H.n;
  let m = -1; if (H.y % G === 0) { m = 0; for (let i = 0; i < H.n; i++) if (chance(H.sec ? 0.73 : 0.7)) m++; H.fin += m; }
  if (H.y === 1) { log(L`고향 학교에서 첫 장학생 ${H.n}명을 뽑았다는 소식이 왔습니다.` + ' ' + "Một em gửi đến lá thư cảm ơn viết nắn nót từng chữ.", 'warm'); eff({ h: 2 }); return; }
  if (H.y === G) {
    log(m === H.n ? L`첫 장학생 ${H.n}명이 모두 학교를 마쳤습니다.` : m === 0 ? "Nghe nói những học sinh nhận học bổng đầu tiên đều phải bỏ học giữa chừng vì hoàn cảnh gia đình."
      : L`첫 장학생 ${H.n}명 가운데 ${m}명이 학교를 마쳤습니다.` + ' ' + (H.n - m === 1 ? "Nghe nói có một em phải bỏ học giữa chừng để phụ giúp việc nhà." : "Nghe nói những em còn lại phải bỏ học giữa chừng vì hoàn cảnh gia đình."), m ? 'warm' : 'note');
    return;
  }
  if (H.y === G + 4 && H.fin > 0) {
    const n = nm(), w = H.sec ? { teach: 0.25, nurse: 0.25, civil: 0.15, shop: 0.2, eng: 0.05, uni: 0.1 } : { teach: 0.2, nurse: 0.15, civil: 0.15, eng: 0.2, work: 0.3 };
    const k = wpick(w);
    log(({ teach: () => L`장학생이었던 ${iga(n)} 학교 선생님이 되었다는 소식이 왔습니다.`, nurse: () => L`장학생이었던 ${iga(n)} 간호사가 되었다는 소식이 왔습니다.`,
      civil: () => L`장학생이었던 ${iga(n)} 공무원이 되었다는 소식이 왔습니다.`, eng: () => L`장학생이었던 ${iga(n)} 엔지니어가 되었다는 소식이 왔습니다.`,
      shop: () => L`장학생이었던 ${iga(n)} 읍내에 작은 가게를 열었다는 소식이 왔습니다.`, uni: () => L`장학생이었던 ${iga(n)} 대학에 들어갔다는 소식이 왔습니다.`,
      work: () => L`장학생이었던 ${iga(n)} 대학을 마치고 첫 직장을 구했다는 소식이 왔습니다.` })[k](), 'warm');
    eff({ h: 2 }); return;
  }
  if (H.y === G * 4 && H.fin >= 3) {
    log(chance(0.35) ? L`장학생이었던 ${iga(nm())} 고향 학교의 선생님이 되어 돌아왔다고 합니다.` : L`지금까지 장학생 ${H.fin}명이 학교를 마쳤습니다.`, 'warm');
    eff({ h: 2, so: 1 });
  }
}
const frOld = (nm, y) => { const at = S.flags.frAt && S.flags.frAt[nm]; return at == null || S.age - at >= y; };
const friendsLeft = () => S.flags.fN == null || S.flags.fN - (S.flags.fGone || 0) > 0;
const anvW = () => { const P = S.fam.partner; return !!(P && P.wedA != null && legalWed()); };
const anvY = () => S.age - (anvW() ? S.fam.partner.wedA : S.fam.marriedAt);
const anvK = y => (anvW() ? 'anvW' : 'anv') + y;
const anvReset = () => { for (const k of Object.keys(S.flags)) if (/^anvW?\d+$/.test(k)) delete S.flags[k]; };
function frBad() {
  const b = familyNames(), add = x => { if (x) String(x).split(/\s+/).forEach(w => w && b.add(w)); b.add(String(x || '')); };
  (S.flags.fUsed || []).forEach(x => b.add(x)); (S.flags.exs || []).forEach(e => add(e.n)); if (S.flags.exNm) add(S.flags.exNm.n);
  (S.flags.affNms || []).forEach(add); if (S.flags.affair && S.flags.affair.nm) add(S.flags.affair.nm);
  return b;
}
function friendName(old = 0) {
  const bad = frBad(), fr = (S.flags.frNames || (S.flags.frNames = [])), ok = fr.filter(x => frOld(x, old) && !bad.has(x));
  if (ok.length && chance(0.7)) return pick(ok);
  const taken = bad; let nm = '';
  let sx = 'M'; for (let i = 0; i < 10 && (!nm || taken.has(nm) || fr.includes(nm)); i++) { const cl = clusterFor(C(), relPick(C())); sx = chance(0.5) ? 'M' : 'F'; nm = callName(makeName(cl, sx, {})); }
  frKeep(nm, sx);
  if (fr.length < 5) fr.push(nm); return nm;
}
const kidPay = () => kidAny(S.fam.kids.filter(k => k.alive && !k.away && !k.f5 && k.job && S.age - k.bornAt >= 20 && S.age - k.bornAt <= 30 && (k.jA != null ? S.age - k.jA <= 2 : S.age - k.bornAt <= 24)));
const gkAged = (lo, hi) => Array.isArray(S.fam.grand) ? S.fam.grand.some(g => !g.gone && S.age - g.bornAt >= lo && S.age - g.bornAt <= hi && !nkCut(gkParent(g))) : (S.flags.grand || 0) > 0;
const kidFar = k => !!(k && k.abroad && k.abroad !== S.cur);
const gkParent = g => (g && S.fam.kids.find(k => k.name && callName(k.name) === g.of && k.sex === g.ofSex)) || null;
const gkFar = g => kidFar(gkParent(g));
const gkNear = (lo, hi) => Array.isArray(S.fam.grand) ? S.fam.grand.some(g => !g.gone && S.age - g.bornAt >= lo && S.age - g.bornAt <= hi && !gkFar(g)) : (S.flags.grand || 0) > 0;
const gkAway = (lo, hi) => (Array.isArray(S.fam.grand) && S.fam.grand.find(g => !g.gone && S.age - g.bornAt >= lo && S.age - g.bornAt <= hi && gkFar(g) && !nkCut(gkParent(g)))) || null;
const longTripHard = () => S.age >= 80 || S.st.hl < 35;
const kidBanned = k => k.sex === 'F' && !!eduProbs(kidLand(k), 'F', 3, true).ban;
const KID_SCH_F = new Set(['f6', 'f7']);
function kidFor(lo, hi, f, grown) { const ks = S.fam.kids.filter(k => k.alive && !k.away && !nkCut(k) && !k[f] && !(KID_SCH_F.has(f) && S.age - k.bornAt >= 12 && kidBanned(k)) && S.age - k.bornAt >= lo && S.age - k.bornAt <= hi && (grown ? k.grown || S.age - k.bornAt >= 22 : true));
  if (!ks.length) return null; const same = ks.filter(k => k.bornAt === ks[0].bornAt); return same.length > 1 ? pick(same) : ks[0]; }
const kidTwin = (k, f) => (k && S.fam.kids.find(x => x !== k && x.alive && !x.away && x.bornAt === k.bornAt && (x.tw || k.tw) && !(f && x[f]))) || null;
const kidAndTwin = k => { const t = kidTwin(k); return !t ? [k] : S.fam.kids.indexOf(t) < S.fam.kids.indexOf(k) ? [t, k] : [k, t]; };
const kidsCall = ks => listAnd(ks.map(x => callName(x.name)));
const kidAny = ks0 => { const ks = ks0.filter(k => !nkCut(k)); if (!ks.length) return null; const same = ks.filter(k => k.bornAt === ks[0].bornAt); return same[S.age % same.length]; };
const kidsYoung = () => S.fam.kids.filter(k => k.alive && S.age - k.bornAt >= 5 && S.age - k.bornAt < 19);
const OLD_KID = { sa: 0.8, ssa: 0.65, mena: 0.65, eap: 0.45, lac: 0.45, eca: 0.3, hi: 0.12 };
const OLD_KID_C = { KOR: 0.3, JPN: 0.3, TWN: 0.4, SGP: 0.55, CHN: 0.45, ITA: 0.18, ESP: 0.18, GRC: 0.2, POL: 0.25 };
const OLD_CARE = { hi: 0.18, eca: 0.06, lac: 0.04, eap: 0.04, mena: 0.02, sa: 0.01, ssa: 0.01 };
const careHomeOK = c => c.ppp >= 10000;
const careNow = () => !!S && !!S.flags && S.flags.oldHome === 'care';
const careHomeCost = c => incomeAt(c, 0.5) * (c.p === 'hi' ? 0.35 : 0.5);
function oldKid() {
  const ks = S.fam.kids.filter(k => k.alive && !k.abroad && !kidInPr(k) && S.age - k.bornAt >= 25 && !skApart(k) && !k.exOf);
  if (!ks.length) return null;
  return ks.sort((x, y) => bondScore(y, 'kid') - bondScore(x, 'kid'))[0];
}
function oldHomeFact(c) {
  const kid = OLD_KID_C[c.id] ?? OLD_KID[c.p] ?? 0.4;
  return c.p === 'hi' ? L`${c.ko}에서 자녀와 함께 사는 노인은 약 ${Math.round(kid * 100)}%입니다. 고소득국에서는 80세 넘은 노인 열 명 중 한두 명이 요양시설에서 지냅니다 (UN DESA, OECD)`
    : L`${c.ko}에서 자녀와 함께 사는 노인은 약 ${Math.round(kid * 100)}%입니다 (UN DESA 2017)`;
}
function oldHomeYear() {
  const O = S.flags.oldHome;
  if (O === 'kid' && !S.fam.kids.some(k => k.withMe && k.alive)) { S.flags.oldHome = null; for (const k of S.fam.kids) k.withMe = 0; }
}
const KID_GIVE = { eap: 0.05, sa: 0.06, ssa: 0.05, mena: 0.05, lac: 0.03, eca: 0.02, hi: 0.004 }, KID_GIVE_C = { KOR: 0.03, TWN: 0.03, CHN: 0.05, VNM: 0.06, SGP: 0.03, JPN: 0.004, HKG: 0.03 };
function kidHelp(c) {
  const x = kidHelpAmt(c);
  if (x && !S.flags.kidHelpT && x > incomeAt(c, 0.5) * 0.02) { S.flags.kidHelpT = S.age; log(kidHelpAmt.n > 1 ? "Các con đã lớn bắt đầu chia nhau gửi tiền sinh hoạt cho bạn mỗi tháng." : "Đứa con đã lớn bắt đầu gửi tiền sinh hoạt cho bạn mỗi tháng.", 'warm'); }
  return x;
}
function kidHelpAmt(c, est) {
  if ((S.age < 60 && !S.retired && !est) || farFromNK() || !S.fam || !S.fam.kids) return 0;
  const r = KID_GIVE_C[c.id] ?? KID_GIVE[c.p] ?? 0.02; let x = 0, n = 0;
  for (const k of S.fam.kids) {
    const ka = S.age - k.bornAt; if (!k.alive || ka < 25 || k.withMe || n >= 5) continue;
    if (skApart(k) || k.exOf) continue;
    if ((k.job && ['student', 'seeking', 'prison'].includes(k.job)) || kidInPr(k)) continue;
    if (k.km != null && S.age - k.km <= 1) continue;
    const cc = k.abroad && CBY[k.abroad] ? CBY[k.abroad] : c, j = JOBS[k.job];
    x += incomeAt(cc, 0.5) * r * (k.abroad ? 1.4 : 1) * (j && j.e >= 4 ? 1.5 : j && j.s === 'agr' ? 0.6 : 1) * (k.away ? 0.3 : 1) * (ka >= 65 ? 0.5 : 1) * (k.give ? 1.2 : 1) * Math.min(1.3, 1 + 0.03 * (k.kmN || 0)); n++;
  }
  if (!x) return 0;
  const well = clamp(1.4 - hhPct(), 0.3, 1) * (S.money > incomeAt(c, 0.5) * 10 ? 0.5 : 1) * clamp(0.5 + S.st.so / 100, 0.5, 1.3);
  x *= well; kidHelpAmt.n = n;
  return x;
}
const oldShare = () => S.flags.oldHome === 'care' || (S.age >= 60 && oldKidHere()) ? 0.5 : 1;
const oldKeep = () => S.retired && oldKidHere() ? 0.2 : 0;
const oldKidHere = () => homeOthers().kids.some(k => S.age - k.bornAt >= 22);
const kidTalkOK = () => { const P = S.fam.partner; if (!S.fam.married || !P || !P.alive || P.divorced || S.age < 18) return false;
  if (P.ss) return Math.min(S.age, P.age) < 46 && ssKidWays() && S.flags.adoptAt == null;
  return (S.sex === 'F' ? S.age : P.age) < 45 && !mpPast(); };
const kidTalkOpen = () => kidTalkOK() && S.flags.kidTalkAt == null && S.job !== 'prison' && !S.flags.tryK && kidsApartK() > 0;
const w2TalkOK = () => { const w = S.fam.wife2; return S.sex === 'M' && S.fam.married && !!w && w.alive && w.age < 43 && S.age >= 18; };
const w2TalkOpen = () => w2TalkOK() && S.flags.w2TalkAt == null && S.job !== 'prison';
function kidsW2View() {
  const c = C(), w = S.fam.wife2, n = ownKids().length, alive = ownKids().filter(k => k.alive).length;
  return { title: n ? L`${n + 1}번째 아이를 가질까요?` : "Có con?", body: (alive ? L`지금 아이가 ${alive}명 있습니다.` + ' ' : '') + L`두 번째 아내 ${wa(callName(w.name))} 아이 계획을 이야기하고 있습니다.`,
    fact: L`${c.ko} 합계출산율 ${c.tfr}명 (UN WPP 2024)`,
    choices: [{ k: 'yes', label: "Sinh con", sub: "Hạnh phúc↑ Chi phí nuôi con↑" }, { k: 'no', label: "Bây giờ thì chưa", sub: '' },
      { k: 'stop', label: alive ? "Không sinh thêm con nữa" : "Quyết định sống không có con", sub: "Sẽ không hỏi lại nữa" }] };
}
function kidsW2Apply(k) {
  const w = S.fam.wife2; if (!w || !w.alive) return false;
  if (k === 'stop') { w.nk = 1; return L`두 번째 아내 ${wa(callName(w.name))} 더는 아이를 갖지 않기로 마음을 정했습니다.`; }
  if (k !== 'yes') return false;
  if (!chance(w.age < 35 ? 0.85 : w.age < 40 ? 0.6 : 0.35)) { eff({ h: -2 }); return { t: "Bạn mong có con nhưng năm nay vẫn chưa có tin vui.", k: 'bad', f: "Khả năng có thai trong vòng 1 năm là khoảng 85% trước 35 tuổi, khoảng 60% ở tuổi 35–39 và khoảng 35% sau 40 tuổi (Hội Sản Phụ khoa Hoa Kỳ, ACOG)" }; }
  w.lk = S.age; const lk = S.flags.last_kids; haveKid(w); S.flags.last_kids = lk; return false;
}
const mpAge = () => S.flags.mpA ?? (S.flags.mpA = Math.round(clamp(({ hi: 51, eca: 50, lac: 49, eap: 50, mena: 49, sa: 47, ssa: 48 }[B().p] || 50) + (rnd() + rnd() + rnd() - 1.5) * 4, 42, 57)));
const fecAge = fa => fa < 35 ? 0.96 : fa < 40 ? 0.68 : Math.max(0.03, 0.45 - 0.08 * (fa - 40));
const mpPast = () => S.sex === 'F' && (S.flags.mpDone != null || (S.age >= 42 && S.age >= mpAge()));
function conceiveP() {
  const P = S.fam.partner; if (!P) return 0;
  const fa = S.sex === 'F' ? S.age : P.age, m = S.fam.marriages || 1;
  if (mpPast()) return 0;
  if (S.flags.infD !== m) { S.flags.infD = m; const r = rnd(); S.flags.infK = r < 0.03 ? 'hard' : r < 0.15 ? 'slow' : null; }
  let p = fecAge(fa);
  if (S.sex === 'F' && S.smoker) p *= 0.7;
  if (S.flags.infK === 'hard') p *= 0.1; else if (S.flags.infK === 'slow') p *= 0.4;
  return p;
}
const IVF_K = { KOR: 0.08, JPN: 0.1, ISR: 0.05, FRA: 0.08, BEL: 0.1, DNK: 0.1, SWE: 0.1, NOR: 0.1, FIN: 0.1, NLD: 0.1, DEU: 0.15, AUT: 0.15, ESP: 0.2, ITA: 0.2, GBR: 0.3, AUS: 0.2, NZL: 0.3, CAN: 0.35, USA: 0.45 };
const ivfOK = c => c.ppp >= 15000 || (S.urban && c.ppp >= 4000);
const ivfCost = c => incomeAt(c, 0.5) * (IVF_K[c.id] ?? (c.p === 'hi' ? 0.3 : 0.9));
const ivfP = fa => fa < 35 ? 0.58 : fa < 38 ? 0.44 : fa < 41 ? 0.29 : fa < 43 ? 0.13 : 0.04;
function ivfStart(paid) {
  const cost = ivfCost(C()); if (!paid) S.money -= cost; S.flags.tryK.ivfGo = 1; eff({ h: -1 });
  return L`검사를 받고 난임 치료를 시작했습니다. 결과는 몇 달을 기다려야 합니다. (−${wonStr(cost)})`;
}
const ivfOpen = () => { const tk = S.flags.tryK, P = S.fam.partner; if (!tk || tk.ivfGo || tk.ivf || !P || !ivfOK(C())) return false;
  return tk.y >= 1 || (S.sex === 'F' ? S.age : P.age) >= 35; };
function tryingYear(a, c) {
  const tk = S.flags.tryK; if (!tk) return null;
  const P = S.fam.partner, m = S.fam.marriages || 1;
  if (!(S.fam.married && P && P.alive && !P.divorced && !P.ss) || tk.m !== m || S.flags.noKidsM === m) { S.flags.tryK = null; return null; }
  if (S.job === 'prison' || S.flags.hideCN) return null;
  const fa = S.sex === 'F' ? a : P.age, ak = kidsApartK();
  if (fa >= 46 || mpPast()) { S.flags.tryK = null; if (tk.y >= 1) log("Những năm tháng mong con cứ thế trôi qua.", 'note'); return null; }
  if (ak < 1) { if (ak > 0 && chance(conceiveP() * ak)) { S.flags.tryK = null; haveKid(); return 'kid'; } return null; }
  tk.y++;
  if (tk.ivfGo || (tk.ivf && tk.ivf < 3)) {
    const cost = ivfCost(c), paid = !!tk.ivfGo;
    if (paid || canPay(cost)) {
      if (!paid) { const n0 = netWorth(); S.money -= cost; bookSince(n0, "Chi phí điều trị hiếm muộn"); }
      tk.ivfGo = 0; tk.ivf = (tk.ivf || 0) + 1; S.flags.ivfN = tk.ivf;
      if (chance(ivfP(fa))) { S.flags.tryK = null; S.flags.ivfKid = 1; log("Sau quá trình điều trị hiếm muộn, đứa con bạn hằng mong đã đến.", 'big'); haveKid(); return 'kid'; }
      eff({ h: -2 });
      log(tk.ivf >= 3 ? "Ba năm điều trị hiếm muộn mà con vẫn chưa đến. Bạn quyết định dừng điều trị tại đây." : paid ? "Bạn đã điều trị hiếm muộn nhưng năm nay vẫn chưa có tin vui." : L`올해도 난임 치료를 이어 갔지만 소식이 없었습니다. (−${wonStr(cost)})`, 'bad');
      return null;
    }
    tk.ivf = 3;
  }
  if (chance(conceiveP())) { S.flags.tryK = null; log("Sau hơn một năm chờ đợi, bạn đã có tin vui.", 'warm'); haveKid(); return 'kid'; }
  if (tk.y >= 2 && !tk.asked) {
    tk.asked = 1;
    const own = S.fam.kids.filter(k => k.alive && !k.sk && !k.adopted).length;
    if (!own || (own === 1 && fa < 40)) return 'ask';
    S.flags.tryK = null; S.flags.noKidsM = m; log("Bạn mong thêm một đứa con nhưng vẫn không có tin vui. Giờ bạn quyết định sống trọn vẹn với những đứa con hiện có.", 'note'); return null;
  }
  return null;
}
const YT_NO = new Set(['CHN', 'IRN', 'TKM']);
const KID_DREAM = iso => ({ doctor: L`의사${LBL}`, teacher: L`선생님${LBL}`, police: L`경찰관${LBL}`, nurse: L`간호사${LBL}`, dev: L`프로그래머${LBL}`, designer: L`디자이너${LBL}`, artist: L`화가${LBL}`, musician: L`가수${LBL}`, actor: L`배우${LBL}`, dancer: L`댄서${LBL}`, lawyer: L`변호사${LBL}`, prof: L`과학자${LBL}`, cook: L`요리사${LBL}`, creator: YT_NO.has(iso || S.cur) ? L`인터넷 방송인${LBL}` : L`유튜버${LBL}` });
const hereC = () => { const sa = studyAway(); return sa && CBY[sa] ? (S.era && S.era !== 'now' && eraLoaded() ? eraC(sa) : CBY[sa]) : C(); };
const netC = hereC;
const studyNet = () => { if (!S.flags.net && !eraBefore(2005)) S.flags.net = 1; };
const OWN_DREAM = () => { const D = Object.assign(KID_DREAM(S.flags.kidDreamC), { soldier: L`군인${LBL}`, pilot: L`비행기 조종사${LBL}`, athlete: L`운동선수${LBL}`, owner: L`사장님${LBL}` });
  
  return D; };
const DREAM_HOB = { artist: 'art', designer: 'art', musician: 'music', actor: 'drama', dancer: 'dance', cook: 'cooking', athlete: 'sport' };
const netDream = () => { const n = C().net; return n == null ? 0.6 : n < 1 ? 0 : clamp(n / 80, 0.1, 1); };
function kidDreamPick() {
  const y = calYr(), boy = S.sex === 'M', pw = parentWork();
  const w = { doctor: 3, teacher: boy ? 2 : 3.5, police: boy ? 2.2 : 1, athlete: boy ? 3.2 : 1.2, musician: boy ? 1.2 : 2, artist: boy ? 1 : 1.8, nurse: boy ? 0.2 : 2,
    soldier: boy ? 1.3 : 0.2, pilot: boy ? 1.2 : 0.6, prof: 1, cook: 0.8, actor: boy ? 0.5 : 1, dancer: boy ? 0.3 : 0.9, designer: boy ? 0.3 : 1, lawyer: 0.5, owner: 0.6,
    dev: y >= 1990 ? 0.8 : 0, creator: y >= 2012 && !(S.flags.noPow != null && !S.flags.power) ? (boy ? 2 : 1.5) * netDream() : 0 };
  for (const id in DREAM_HOB) if (S.hobbies.some(h => (DREAM_HOB[id] === 'sport' ? isSportH(h) : h.id === DREAM_HOB[id]))) w[id] *= 4;
  for (const id in w) if (pw.has(id)) w[id] *= 3;
  for (const id in w) if (!(w[id] > 0) || !JOBS[id]) delete w[id];
  return wpick(w);
}
const kidDreamHob = () => { const id = S.flags.kidDream; return id && DREAM_HOB[id] && !(DREAM_HOB[id] === 'music' && noHear()) && !S.hobbies.some(h => (DREAM_HOB[id] === 'sport' ? isSportH(h) : h.id === DREAM_HOB[id])) ? DREAM_HOB[id] : null; };
function kidqWhat(k) {
  const ka = S.age - k.bornAt, gp = [S.fam.mom, S.fam.dad].find(p => p && !p.alive && !p.absent && p.diedAt != null && S.age - p.diedAt <= 2);
  if (gp && ka >= 5 && ka <= 11) return 'gone';
  if (ka >= 6 && ka <= 11) return ka >= 10 && chance(0.4) ? 'money' : 'dream';
  if (ka >= 12 && ka <= 16) return chance(0.55) ? 'study' : 'money';
  return null;
}
const kqEduK = k => ({ wide: 1.08, job: 1.12, free: 0.9 }[k.kq] || 1) * (k.djK === 'real' ? 1.04 : 1);
const splitOK = () => { const P = S.fam.partner; return S.fam.married && !!P && P.alive && !P.divorced && S.age >= 18 && S.job !== 'prison' && !S.flags.hideCN && !S.flags.divQ && !(S.pending && S.pending.id === 'divtalk'); };
const noDivorce = c => c.id === 'PHL' && S.rel !== 'M';
const DIV_PHL = 0.35;
const wedBlocked = () => !!S.flags.phlSep && noDivorce(C());
const PHL_SEP_F = () => "Philippines không có chế độ ly hôn. Vợ chồng sống ly thân mà không có phán quyết tuyên bố hôn nhân vô hiệu hay hủy hôn thì về pháp lý vẫn là vợ chồng, nên với người mới chỉ có thể chung sống không đăng ký kết hôn (Bộ luật Gia đình Philippines)";
const ISL_FAM = new Set(['SDN', 'MRT', 'SOM', 'DJI', 'COM', 'GMB', 'NGA', 'NER']);
const islFam = c => S.rel === 'M' && (['mena', 'sa'].includes(c.p) || ISL_FAM.has(c.id));
const divLaw = c => { const P = S.fam.partner; if (!legalWed()) return 'free'; if (c.id === 'PHL' && S.rel !== 'M') return 'annul';
  return islFam(c) && S.sex === 'M' && P && !P.ss ? 'talaq' : 'court'; };
const divCourtP = c => islFam(c) ? 0.5 :['KOR', 'JPN', 'TWN'].includes(c.id) ? 0.65 : ['hi', 'eca', 'lac'].includes(c.p) ? 0.92 : c.p === 'sa' ? 0.4 : c.p === 'mena' ? 0.5 : 0.7;
function divFact(c) {
  if (S.flags.ipv === 'on') return IPV_HELP();
  if (!legalWed()) return null;
  if (c.id === 'KOR') return "Gần tám trên mười vụ ly hôn ở Hàn Quốc là ly hôn thuận tình. Trước khi tòa án xác nhận ý nguyện của hai bên, vợ chồng phải trải qua thời gian cân nhắc 3 tháng nếu có con chưa thành niên, 1 tháng nếu không có (Điều 836-2 Bộ luật Dân sự Hàn Quốc, Statistics Korea)";
  if (c.id === 'JPN') return "Gần chín trên mười vụ ly hôn ở Nhật Bản là ly hôn thuận tình, vợ chồng chỉ cần nộp tờ khai. Nếu không thỏa thuận được, hai bên phải qua hòa giải tại tòa án gia đình (Bộ Y tế, Lao động và Phúc lợi Nhật Bản)";
  if (c.id === 'PHL' && S.rel !== 'M') return "Philippines cùng với Vatican là những nơi không có chế định ly hôn. Muốn chấm dứt hôn nhân phải khởi kiện yêu cầu tuyên bố hôn nhân vô hiệu hoặc hủy hôn, mất nhiều năm và rất tốn kém (người Hồi giáo có thể ly hôn theo luật gia đình Hồi giáo)";
  if (islFam(c)) return "Theo luật gia đình Hồi giáo, người chồng có thể tuyên bố ly hôn bằng talaq, còn người vợ có thể xin tòa án cho ly hôn theo khula. Khi talaq, người chồng trả khoản mahr (sính lễ) đã hoãn lại; người vợ xin khula thường hoàn trả mahr";
  if (c.id === 'IND') return "Ở Ấn Độ, ly hôn thuận tình được hai vợ chồng cùng nộp đơn sau khi sống ly thân từ một năm trở lên, và phải qua thời gian cân nhắc 6 tháng (Điều 13B Luật Hôn nhân Hindu). Tỷ lệ ly hôn của Ấn Độ thuộc hàng thấp nhất thế giới";
  if (c.p === 'hi') return "Ở phần lớn các nước giàu, chỉ cần một bên muốn là có thể ly hôn mà không phải xét lỗi của ai. Cả 50 bang của Mỹ đều công nhận ly hôn không lỗi";
  return "Khi ly hôn, hai bên cùng quyết định cách chia tài sản, con cái sống với ai và tiền cấp dưỡng nuôi con là bao nhiêu";
}
const TRAIN_F = { tech: ['mechanic', 'electric', 'welder'], food: ['cook', 'hair'], care: ['care', 'childcare'], office: ['clerk', 'callc', 'salesagent'] };
const TRAIN_N = () => ({ tech: "Đào tạo nghề: kỹ thuật·sửa chữa", food: "Đào tạo nghề: nấu ăn·làm đẹp", care: "Đào tạo nghề: chăm sóc", office: "Đào tạo nghề: văn phòng·máy tính" });
const trainOK = () => S.edu <= 3 && S.age >= 18 && S.age <= 55 && !S.school && S.job !== 'prison' && !inOffice() && C().ppp >= 3000;
const trainCost = () => med() * (C().p === 'hi' || C().p === 'eca' ? 0.04 : 0.08);
const trainOn = id => { const f = S.flags.trainF; return !!f && S.age - (S.flags.trainAt || 0) <= 6 && (TRAIN_F[f] || []).includes(id); };
function trainStart(f) {
  S.flags.trainF = f; S.flags.trainAt = S.age; S.flags.huntAt = S.age; eff({ sm: 3, h: -1 });
  const n = { tech: "sửa chữa, điện và hàn", food: "nấu ăn và làm đẹp", care: "chăm sóc", office: "văn phòng và máy tính" }[f];
  return isWorking() ? L`일을 마치고 저녁마다 ${n} 직업훈련을 받았습니다. 수료증을 받았고, 그 분야에서 일할 길이 열렸습니다.` : L`${n} 직업훈련 과정을 마치고 수료증을 받았습니다. 그 분야에서 일할 길이 열렸습니다.`;
}
const VOC_W = { M: { tech: 0.51, office: 0.115, food: 0.13, care: 0.037 }, F: { tech: 0.11, office: 0.24, food: 0.22, care: 0.22 } };
const VOC_N = () => ({ tech: "cơ khí·điện", office: "thương mại·tin học", food: "nấu ăn·làm đẹp", care: "y tế·chăm sóc xã hội" });
const HS_J = { art: ['designer', 'artisan', 'creator'], sport: ['trainer', 'coach'] }, HS_YRS = 6;
function vocPick() {
  const w = Object.assign({}, VOC_W[S.sex === 'F' ? 'F' : 'M']);
  if (S.hobbies.some(h => h.id === 'cooking')) w.food *= 2;
  if (S.hobbies.some(h => h.id === 'crafts')) w.tech *= 1.5;
  return wpick(w);
}
const vocIn = () => { const f = S.flags.vocF = vocPick(); return VOC_N()[f]; };
const hsOn = id => { const f = S.flags.vocF || S.flags.artsHS, at = S.flags.hsAt; return !!f && at != null && S.edu <= 3 && S.age - at <= HS_YRS && (TRAIN_F[f] || HS_J[f] || []).includes(id); };
const ART_HS_H = ['art', 'music', 'dance', 'drama', 'crafts', 'photo'];
function artsHS() {
  if (B().ppp < 8000 || S.flags.artsHS || !S.hobbies) return null;
  const best = f => S.hobbies.filter(h => f(h) && h.since <= 13 && h.lv >= 2).sort((x, y) => y.lv - x.lv)[0];
  const a = best(h => ART_HS_H.includes(h.id)), sp = best(h => isSportH(h));
  if (!a && !sp) return null;
  return a && (!sp || a.lv >= sp.lv) ? { k: 'art', h: a } : { k: 'sport', h: sp };
}
const artsHSP = x => clamp(0.15 + 0.08 * x.h.lv + (S.q - 3) * 0.05 + (S.st.sm - 50) / 400, 0.12, 0.6) * (S.urban ? 1 : 0.6);
const artsK = k => S.flags.artsHS === k ? 1.6 : 1;
function artsChoice() { const x = artsHS(); if (!x) return null; const p = artsHSP(x);
  return { k: 'arts', label: x.k !== 'art' ? "Nộp đơn vào trường trung học phổ thông thể thao" : x.h.id === 'music' ? "Nộp đơn vào khoa âm nhạc của trường trung học nghệ thuật" : x.h.id === 'dance' ? "Nộp đơn vào khoa múa của trường trung học nghệ thuật" : x.h.id === 'drama' ? "Nộp đơn vào khoa sân khấu điện ảnh của trường trung học nghệ thuật" : "Nộp đơn vào khoa mỹ thuật của trường trung học nghệ thuật", sub: L`실기 시험 · 붙을 가능성 ${p >= 0.4 ? "khoảng một nửa" : "tương đối thấp"} · 떨어지면 일반 고등학교로` }; }
const matchOK = () => !S.flags.ss && S.age >= 22 && S.age <= 65 && !S.refugee && (C().ppp >= 5000 || ['sa', 'mena'].includes(C().p));
const matchCost = () => med() * (MATCH_CO.has(C().id) ? 0.15 : ['sa', 'mena'].includes(C().p) ? 0.04 : 0.08);
const MX_N = 3, MX_YEARS = 3, MX_NO = 0.4, MX_NO_ARR = 0.3;
function mxNext() {
  const M = S.flags.mx; if (!M) return '';
  if (M.left <= 0 || S.age > M.to) { S.flags.mx = null; return M.left <= 0 ? ' ' + "Những lần giới thiệu đã hứa đến đây là hết." : ''; }
  if (S.t < 0.7) { M.left--; M.next = -1; queue(Math.min(0.95, S.t + 0.25), 'dec', 'partner', { meet: 1, k: 'match', mxn: M.n - M.left, mxl: M.left === 0 ? 1 : 0 }); }
  else M.next = S.age + 1;
  return ' ' + (MATCH_CO.has(C().id) ? "Công ty môi giới hôn nhân hẹn sẽ sớm giới thiệu người tiếp theo." : "Người mai mối hứa sẽ tìm giúp một người khác.");
}
const askKidsList = () => S.fam.kids.filter(k => k.alive && S.age - k.bornAt >= 22 && !(k.job && ['student', 'seeking', 'prison'].includes(k.job)) && !k.placed);
const askKidsOK = () => S.age >= 55 && !farFromNK() && S.job !== 'prison' && askKidsList().length > 0 && (netWorth() < med() * 4 || debtHeavy());
function askKids() {
  const c = C(), need = S.money < 0 || (S.income < incomeAt(c, 0.5) * 0.4 && S.money < incomeAt(c, 0.5) * 2), rich = S.money > incomeAt(c, 0.5) * 8;
  let tot = 0; const yes = [], no = [];
  for (const k of askKidsList().slice(0, 5)) {
    const cc = k.abroad && CBY[k.abroad] ? CBY[k.abroad] : c, j = JOBS[k.job], n = callName(k.name);
    const p = clamp(0.4 + bondScore(k, 'kid') / 80 + (need ? 0.2 : 0) - (rich ? 0.3 : 0) + (k.give ? 0.1 : 0) - (k.away ? 0.2 : 0), 0.08, 0.92);
    if (!chance(p)) { no.push(n); continue; }
    tot += incomeAt(cc, 0.5) * (j && j.e >= 4 ? 0.1 : j && j.s === 'agr' ? 0.04 : 0.06) * (k.abroad ? 1.3 : 1) * (need ? 1.3 : 1); yes.push(n);
  }
  S.money += tot;
  if (!yes.length) { eff({ h: -2 }); return no.length > 1 ? "Các con cũng nói đang eo hẹp nên lần này không giúp được." : L`${iga(no[0])} 형편이 빠듯하다며 이번에는 돕지 못했습니다.`; }
  eff({ h: 2, so: 1 });
  return L`${iga(listAnd(yes))} 살림에 보태라며 돈을 보내 주었습니다. (+${wonStr(tot)})` + (no.length ? ' ' + L`${eun(listAnd(no))} 형편이 어렵다며 미안해했습니다.` : '');
}
const GED_LV = () => [L`초등학교${LBL}`, L`초등학교${LBL}`, L`중학교${LBL}`, L`고등학교${LBL}`][Math.min(3, S.edu + 1)];
const sawSchool = () => !!S.flags.pushSchool || (S.log || []).some(e => e && e.act === 'school') || (S.edu >= 1 && S.flags.gedLv == null && S.flags.gedPassAt == null && !(S.log || []).some(e => e && e.act));
const gedOK = () => S.edu <= 2 && !(S.edu >= 1 && talibanF()) && S.age >= 16 && S.age < 85 && !S.school && S.flags.gedAt == null && S.job !== 'prison' && !(S.serveLeft > 0) && !S.refugee;
const HUNT_P = 0.75;
const huntOK = () => !nkLife() && isWorking() && !svcCommit() && !S.retired && !S.school && S.age >= 18 && S.age <= 60 && !inOffice() && !S.nomad && S.flags.mandAt == null && S.job !== 'prison' && !(S.serveLeft > 0) && !S.flags.hideCN;
const newHobOK = () => S.age >= 10 && S.job !== 'prison' && S.serveLeft === 0 && (S.flags.last_hobby == null || S.age - S.flags.last_hobby >= 5) && hobbyOptions(3).length > 0;
const RET_DEST = { eu: ['ESP', 'PRT'], na: ['MEX', 'CRI', 'PAN'], ea: ['THA', 'MYS', 'PHL'], au: ['THA', 'MYS', 'PHL'], hi: ['ESP', 'PRT', 'THA'] };
const citizenOf = x => (x === S.born && S.flags.natzGave !== S.born) || S.flags.natz === x;
const freeTo = x => freeZone(S.born, x) || (S.flags.natz && freeZone(S.flags.natz, x));
function retDests() {
  const c = C(), out = [], seen = new Set([S.cur, S.born]), add = (iso, why) => { if (out.length < 3 && CBY[iso] && !seen.has(iso) && iso !== 'PRK' && !(CBY[iso].war)) { seen.add(iso); out.push({ iso, why }); } };
  for (const k of S.fam.kids) if (k.alive && k.abroad && (PAR_ROUTE[k.abroad] || freeTo(k.abroad) || citizenOf(k.abroad))) add(k.abroad, 'kid');
  const yrs = {}; for (const y of S.years || []) if (y.a >= 18 && y.cur) yrs[y.cur] = (yrs[y.cur] || 0) + 1;
  for (const x of Object.keys(yrs).sort((a, b) => yrs[b] - yrs[a])) if (yrs[x] >= 5 && (citizenOf(x) || freeTo(x))) add(x, 'past');
  if ((c.p === 'hi' || c.ppp >= 30000) && S.pension > 0) {
    const r = FREE_ZONES[0].y[S.born] != null && calYr() >= 1992 ? 'eu' : ['USA', 'CAN'].includes(S.born) ? 'na' : ['JPN', 'KOR', 'TWN', 'HKG', 'SGP'].includes(S.born) ? 'ea' : ['AUS', 'NZL'].includes(S.born) ? 'au' : 'hi';
    for (const x of RET_DEST[r]) if (CBY[x] && CBY[x].ppp < c.ppp * 0.9 && S.pension >= usd2ppp(c, 12000)) add(x, 'warm');
  }
  return out;
}
const retAbroadOK = sched => !!S.retired && S.age >= 55 && S.age <= 80 && freeExit(C()) && papersOK() && !S.refugee && S.job !== 'prison' && S.serveLeft === 0 && !S.flags.hideCN && !S.nomad
  && !['care', 'kid'].includes(S.flags.oldHome) && netWorth() > 0 && (sched || S.flags.raLookAt == null) && !S.done.retab && retDests().length > 0;
const toCityOK = () => !nkLife() && S.urban === false && S.age >= 16 && S.age <= 65 && !S.mig && !inOffice() && S.job !== 'prison' && S.job !== 'soldier' && !S.refugee && S.serveLeft === 0 && !S.school && !S.flags.hideCN && !!CITIES[S.cur];
const homeLookOK = sched => !!S.mig && S.cur !== S.born && !S.refugee && S.born !== 'PRK' && !S.flags.defector && !inOffice() && S.job !== 'prison' && S.serveLeft === 0 && !S.flags.hideCN && !studyAway() && !S.nomad && (sched || S.flags.homeLookAt == null);
const HOME_SHUT = { cub59: 2000, mariel: 2000, boat: 2000, arg76: 1984, chl73: 1988 };
const homeShut = () => !!S.flags.exile && calYr() < (HOME_SHUT[S.flags.exile] || 0);
const abroadLookOK = sched => S.age >= 18 && S.age <= (sched ? 46 : 45) && (sched || !S.house || S.age < 35) && !S.mig && freeExit(C()) && papersOK() && !inOffice() && S.job !== 'prison' && !S.refugee && S.serveLeft === 0 && !S.flags.hideCN && !studyAway() && !S.school && (sched || S.flags.abLookAt == null) && (!S.fam.married || S.age < 50);
const bizPlanOK = () => !nkLife() && (isWorking() || S.job === 'seeking') && S.job !== 'owner' && !S.retired && !S.school && S.age >= 20 && S.age <= 75 && !inOffice() && !S.nomad && S.job !== 'prison' && !(S.serveLeft > 0) && !S.flags.hideCN;
const RUN_FAME = ['lawyer', 'prof', 'doctor', 'owner', 'creator', 'civil'];
const RUN_NOM = { national: 0.2, leader: 0.12 }, RUN_DEC = { local: 'runlocal', national: 'runnational', leader: 'runleader' };
const ONE_A_YEAR = ['job', 'runlocal', 'runnational', 'runleader'];
const runGate = () => citizen() && !noVote(C()) && !S.school && !(S.serveLeft > 0) && !S.nomad && !studyAway() && !S.flags.hideCN && S.job !== 'prison' && !RARE_JOBS.some(j => j !== 'mp' && S.job === j);
function runLvl() {
  const c = C(), a = S.age, O = S.office;
  if (!runGate()) return null;
  if (O && O.lvl >= 3) return null;
  const tries = lv => (S.flags.runTry && S.flags.runTry[lv]) || 0;
  if (O && O.lvl === 2) return S.job === 'mp' && (S.flags.mpYears || 0) >= 3 && a < O.until && a >= 40 && a <= 75 && !noLeader(c) && headOK(c) && (S.done.runleader || 0) < 2 && tries('leader') < 3 ? 'leader' : null;
  if (oneParty(c)) return !O && a >= 25 && a <= 70 && (S.done.runlocal || 0) < 3 ? 'local' : null;
  if (O) return a - O.since >= 2 && a <= 70 && (S.done.runnational || 0) < 3 && tries('national') < 3 ? 'national' : null;
  if (a >= 40 && a <= 65 && RUN_FAME.includes(S.job) && S.pct > 0.85 && (S.done.runnational || 0) < 3 && tries('national') < 3) return 'national';
  return a >= 25 && a <= 70 && (S.done.runlocal || 0) < 3 ? 'local' : null;
}
const runCost = () => med() * ({ local: 0.03, national: 0.1, leader: 0.2 }[runLvl()] || 0.03);
const runShownLvl = () => runLvl() || (S.office && S.office.lvl === 2 ? 'leader' : S.office ? 'national' : 'local');
function runPrepName() {
  const lv = runShownLvl();
  return lv === 'leader' ? L`${leaderTitle(C())} 출마 준비하기` : lv === 'national' ? "Chuẩn bị tranh cử đại biểu quốc hội" : oneParty(C()) ? "Chuẩn bị ứng cử đại biểu hội đồng nhân dân địa phương" : "Chuẩn bị tranh cử hội đồng địa phương";
}
function runLock() {
  if (runLvl()) return null;
  const c = C(), a = S.age, O = S.office, tries = lv => (S.flags.runTry && S.flags.runTry[lv]) || 0;
  if (!O || O.lvl >= 3 || !citizen() || noVote(c) || S.school || S.serveLeft > 0 || S.nomad || studyAway() || S.flags.hideCN) return null;
  if (O.lvl === 2) {
    if (S.job !== 'mp' || noLeader(c) || a > 75) return null;
    if ((S.done.runleader || 0) >= 2) return "Bạn đã thử sức hai lần rồi";
    if (tries('leader') >= 3) return "Chỉ được tranh cử vòng trong đảng tối đa ba lần";
    if (a < 40) return "Có thể thử sức từ 40 tuổi";
    if ((S.flags.mpYears || 0) >= 3 && a >= O.until) return "Không thể chuẩn bị trong năm cuối nhiệm kỳ";
    return "Có thể thử sức từ năm thứ 4 làm đại biểu quốc hội";
  }
  if (oneParty(c) || a > 70) return null;
  if ((S.done.runnational || 0) >= 3) return "Bạn đã ra tranh cử quốc hội ba lần";
  if (tries('national') >= 3) return "Chỉ được xin đề cử tối đa ba lần";
  return "Có thể thử sức từ năm thứ 2 làm đại biểu hội đồng địa phương";
}
function runPrepDesc() {
  const lv = runShownLvl(), t = lv === 'leader' ? leaderTitle(C()) : '';
  return lv === 'leader' ? L`당의 ${t} 후보 경선을 준비해요 · 이기면 내년에 ${t} 선거 카드가 와요 (이기기 쉽지 않아요)`
    : lv === 'national' ? "Gặp gỡ mọi người để giành sự đề cử của đảng · nếu được đề cử, năm sau bạn có thể tranh cử đại biểu quốc hội (không dễ được đề cử)"
    : oneParty(C()) ? "Lo việc chung của khu phố, gặp gỡ tổ chức đảng và bà con lối xóm · năm sau bạn sẽ chọn có ra ứng cử đại biểu nhân dân hay không (nếu không phải đảng viên thì khó được giới thiệu)"
    : "Tham gia các hội nhóm địa phương và gặp gỡ hàng xóm · năm sau bạn sẽ chọn có ra tranh cử hội đồng địa phương hay không";
}
function runPrepStart() {
  const lv = runLvl(); S.flags.runAt = S.age; S.flags.runLv = lv; S.flags.runNom = null; eff({ so: 2, h: -1 });
  const T = S.flags.runTry = S.flags.runTry || {}; T[lv] = (T[lv] || 0) + 1;
  return lv === 'leader' ? L`${leaderTitle(C())} 출마를 준비하기 시작했습니다. 당의 후보 경선에 함께할 사람들을 모으고 있습니다.`
    : lv === 'national' ? "Bạn bắt đầu chuẩn bị tranh cử đại biểu quốc hội. Bạn đang gặp gỡ mọi người để giành sự đề cử của đảng."
    : "Bạn bắt đầu chuẩn bị ra tranh cử. Bạn tham gia các hội nhóm địa phương, gặp gỡ hàng xóm và lắng nghe chuyện của khu phố.";
}
const gedCost = () => med() * 0.04;
function gedStart() {
  S.flags.gedAt = S.age + 1; S.flags.gedLv = Math.min(3, S.edu + 1); eff({ sm: 2, h: -2, hl: -1 });
  return isWorking() ? L`일을 마치면 야간학교에 가서 ${GED_LV()} 과정 검정고시를 준비하기 시작했습니다.` : L`야간학교에 다니며 ${GED_LV()} 과정 검정고시를 준비하기 시작했습니다.`;
}
const skApartIn = (st, k) => !!k.sk && (!!k.ap || (!!k.grown && k.pm === st.fam.marriages && st.fam.marriedAt != null && st.fam.marriedAt - k.bornAt >= 18));
const skApart = k => skApartIn(S, k);
const kidNotOurs = k => !!(k && k.sk && (k.exOf || skApart(k)));
const kmKids = () => S.fam.kids.filter(k => k.alive && S.age - k.bornAt >= 20 && S.age - k.bornAt < 60 && k.job !== 'prison' && !k.placed && !skApart(k));
const kmGrand = () => { const ap = S.fam.kids.filter(skApart); return (S.fam.grand || []).filter(g => !g.gone && S.age - g.bornAt >= 3 && S.age - g.bornAt < 25 && !ap.some(k => g.of === callName(k.name) && g.ofSex === k.sex)); };
const kmHome = k => !!(k.withMe || ((k.stay || !k.grown) && !k.away && !k.abroad));
const kmHard = k => k.job === 'seeking' || k.job === 'student' || (k.div && !k.rewed);
const kmOpts = () => { const a = kmKids().length > 0, b = kmGrand().length > 0; return [a ? ['kids'] : null, b ? ['gk'] : null, a && b ? ['all'] : null].filter(Boolean); };
const kmCost = o => med() * ((o !== 'gk' ? kmKids().slice(0, 4).reduce((t, k) => t + (kmHard(k) ? 0.06 : 0.04), 0) : 0) + (o !== 'kids' ? 0.012 * Math.min(6, kmGrand().length) : 0));
const kmName = o => o === 'kids' ? (kmKids().length > 1 ? "Cho các con đã lớn" : "Cho đứa con đã lớn") : o === 'gk' ? (kmGrand().length > 1 ? "Cho các cháu" : "Cho cháu") : "Cho cả con và cháu";
const kmAutoW = () => { const o = kmOpts(); return o.some(x => x[0] === S.flags.kmW) ? S.flags.kmW : (o.find(x => x[0] === 'all') || o[0] || ['kids'])[0]; };
function kmGive(o) {
  S.flags.kmW = o;
  const ks = o !== 'gk' ? kmKids() : [], gs = o !== 'kids' ? kmGrand() : [];
  for (const k of ks) { k.km = S.age; k.kmN = (k.kmN || 0) + 1; btAdd(k, kmHard(k) ? 1.5 : 0.5); }
  eff({ so: 2, h: 1 });
  const hard = ks.find(kmHard);
  if (o === 'gk') return gs.length > 1 ? varied('kmg', ["Bạn chia tiền tiêu vặt cho các cháu. Đứa nào cũng hào hứng kể sẽ mua gì.", "Bạn cho các cháu tiền tiêu vặt. Lén bố mẹ chúng dúi tiền vào túi các cháu là cả một niềm vui."])
    : "Bạn cho cháu tiền tiêu vặt. Dáng cháu khoanh tay cúi đầu cảm ơn trông thật đáng yêu.";
  if (ks.length === 1 && o === 'kids') { const k = ks[0], kn = callName(k.name);
    if (!kmHard(k)) return L`${kn}에게 용돈을 보내 주었습니다.`;
    return k.job === 'seeking' ? L`일자리를 찾고 있는 ${kn}에게 용돈을 넉넉히 보내 주었습니다.` : k.job === 'student' ? L`공부하는 ${kn}에게 용돈을 보내 주었습니다. 고맙다는 문자가 왔습니다.`
      : kmHome(k) ? L`힘든 시기를 지나는 ${kn}에게 용돈을 건넸습니다. 그날 저녁 오랜만에 둘이 마주 앉아 이야기를 나눴습니다.` : L`힘든 시기를 지나는 ${kn}에게 용돈을 보내 주었습니다. 오랜만에 먼저 전화가 왔습니다.`; }
  const base = o === 'all' ? "Bạn chia tiền tiêu vặt cho các con và các cháu." : "Bạn gửi cho các con đã lớn một ít tiền tiêu.";
  return base + (hard ? ' ' + (hard.job === 'seeking' ? L`일자리를 찾고 있는 ${eul(callName(hard.name))} 생각해 조금 더 얹었습니다.` : hard.job === 'student' ? L`공부하는 ${iga(callName(hard.name))} 고맙다는 문자를 보내왔습니다.` : kmHome(hard) ? L`힘든 시기를 지나는 ${iga(callName(hard.name))} 그날 저녁 오랜만에 속 이야기를 꺼냈습니다.` : L`힘든 시기를 지나는 ${iga(callName(hard.name))} 오랜만에 먼저 전화를 걸어왔습니다.`) : '');
}
const SHOP = [
  { id: 'dinner', n: "Đi ăn ngoài·tặng quà cùng gia đình·bạn bè", d: "Quan hệ +4 · Hạnh phúc +2", cd: 1, cost: () => med() * 0.03, ok: () => true, run: () => { eff({ so: 4, h: 2 }); if (famNear()) { for (const k of kidsOut()) btAdd(k, 1.5); if (S.fam.married && S.fam.partner && S.fam.partner.alive && !ptAway()) btAdd(S.fam.partner, 1.5);   if (!parAbroad()) { btAdd(S.fam.mom, 1.5); if (!S.fam.dad.absent) btAdd(S.fam.dad, 1.5); } } return famNear() ? "Bạn cùng gia đình ăn một bữa tối thật ngon và trao nhau quà." : "Bạn đã cùng những người bạn thân ăn một bữa tối thật ngon và tặng quà cho nhau."; } },
  { id: 'party', n: "Khao bạn bè", d: "Quan hệ +5", cd: 1, cost: () => med() * 0.025, ok: () => S.age >= 18 && !S.flags.hideCN && !(S.flags.fN && (S.flags.fGone || 0) >= S.flags.fN), run: () => { eff({ so: 5, h: 1 }); return "Bạn đã khao những người bạn lâu năm một bữa thật thịnh soạn."; } },
  { id: 'parents', n: "Tiền biếu và viện phí cho bố mẹ", d: "Quan hệ +5 · Sức khỏe của bố mẹ ↑", cd: 2, cost: () => (typeof parAbroad === 'function' && parAbroad() ? incomeAt(B(), 0.5) : med()) * (S.fam.mom.alive && S.fam.dad.alive && !S.fam.dad.absent ? 0.12 : 0.085), ok: () => S.age >= 20 && !farFromNK() && parentAlive(), run: () => { S.flags.parentCare = S.age + 5; eff({ so: 5, h: 2 }); return L`${parW()}께 용돈과 병원비를 넉넉히 드렸습니다.`; } },
  { id: 'parbring', n: () => L`${parBringW()} 모셔 오기`, d: parBringDesc, cd: 2, cost: () => usd2ppp(C(), parWay() === 'now' ? 800 : 300) * parLive(), ok: parBringOK, run: parBringStart },
  { id: 'kidmoney', n: "Tiền cho con và cháu", d: "Quan hệ +2 · Hạnh phúc +1 · Chọn người được nhận", cd: 1, cost: o => kmCost(o), opts: kmOpts, optN: o => kmName(o), ok: () => S.age >= 40 && !S.refugee && kmOpts().length > 0, run: o => kmGive(o) },
  { id: 'trip', n: "Du lịch trong nước", d: "Hạnh phúc +5 · Kiến thức +1 · Chọn người đi cùng", cd: 1, cost: o => med() * 0.06 * tripMult(o), opts: () => tripWith(), ok: () => S.age >= 16, run: o => { S.flags.tripW = o; return tripGo(o, null); } },
  { id: 'abroad', n: "Du lịch nước ngoài", d: "Hạnh phúc +8 · Kiến thức +3 · Chọn người đi cùng", cd: 2, cost: o => (usd2ppp(C(), 2500) + med() * 0.02) * tripMult(o), opts: () => tripWith(), ok: () => S.age >= 18 && tripOutOK(), run: o => { S.flags.tripWA = o; return tripGo(o, abroadDest()); } },
  { id: 'broker', n: "Dò tìm người môi giới để rời Triều Tiên", d: "Rủi ro · Nếu liên lạc được, năm sau sẽ có cơ hội ra đi", cd: 2, cost: () => med() * 0.1, ok: () => brokerOK(), run: () => brokerSeek() },
  { id: 'checkup', n: "Khám tổng quát · tập PT", d: () => L`건강 +${Math.round(6 * fitK(S.age))} · 만성질환 위험 ↓ · 암을 일찍 찾기도 해요`, cd: 1, cost: () => med() * 0.08, ok: () => S.age >= 25, run: () => { S.flags.healthy = S.age + 3; eff({ hl: 6 * fitK(S.age) }); const x = ncdCheckup(true); return (S.age >= 65 ? "Bạn đã đi khám sức khỏe tổng quát và bắt đầu tập với huấn luyện viên cá nhân. Cơ thể không còn thay đổi nhanh như hồi trẻ, nhưng nhờ kiên trì nên bạn thấy người nhẹ nhõm hẳn." : "Bạn đã đi khám sức khỏe tổng quát và bắt đầu tập với huấn luyện viên cá nhân.") + x; } },
  { id: 'checkauto', set: 'checkAuto', sn: () => "Khám tổng quát · tập PT", ev: () => (S.flags.checkAuto && !S.flags.checkSkip && S.flags.shop_checkup >= S.age - 1 ? L`해마다 · 마지막으로 ${S.flags.shop_checkup}세에 했어요` : "hằng năm") + autoSkipTag('checkAuto', 'checkSkip'), n: () => S.flags.checkAuto ? "Thôi khám tổng quát và tập PT hằng năm" : "Khám tổng quát và tập PT hằng năm", d: () => S.flags.checkAuto && !S.flags.checkSkip ? "Giờ việc này tự diễn ra mỗi năm" : L`모아 둔 돈이 비용의 세 배를 넘는 해마다 알아서 해요 · 해마다 약 ${wonStr(med() * 0.08)}`, cd: 0, cost: () => 0, ok: () => S.age >= 25,
    run: () => { S.flags.checkAuto = S.flags.checkAuto ? 0 : 1; auHand('checkAuto'); return S.flags.checkAuto ? "Bạn đã quyết định từ nay mỗi năm đều đi khám tổng quát và tiếp tục tập luyện." + autoSkipNow('checkSkip', med() * 0.08) : "Bạn đã quyết định bỏ lịch khám tổng quát và tập PT hằng năm."; } },
  { id: 'willwrite', n: () => S.will ? "Viết lại di chúc" : "Viết di chúc", d: "Quyết định ai sẽ nhận tài sản bạn để lại và chia thế nào · thẻ sẽ hiện ra ngay sau đó", cd: 2, cost: () => 0, ok: willOK,
    run: () => { if (S.t < 0.95) queue(Math.min(0.97, S.t + 0.04), 'dec', 'will', {}); else S.flags.willQ = 1; return "Bạn bắt đầu bình tĩnh sắp xếp suy nghĩ để viết di chúc."; } },
  { id: 'lottostop', n: "Bỏ mua vé số", d: "Thôi mua vé số hằng tuần", cd: 0, cost: () => 0, ok: () => S.flags.lotto != null, run: () => { S.flags.lotto = null; S.flags.lottoQuit = S.age; return "Bạn đã bỏ thói quen mua vé số hằng tuần."; } },
  { id: 'hschend', n: "Dừng học bổng cho quê nhà", d: () => L`해마다 보내던 장학금을 이제 그만 보내요 · 한 해 약 ${wonStr(S.flags.hsch ? S.flags.hsch.n * hschPer(B()) : 0)}`, cd: 0, cost: () => 0, ok: () => !!S.flags.hsch && S.flags.hsch.end == null, run: () => hschEnd() },
  { id: 'course', n: () => trainOK() ? "Chứng chỉ và học nghề" : "Chứng chỉ · khóa học nghiệp vụ", d: () => trainOK() ? "Học khóa nghiệp vụ để tích lũy kiến thức, hoặc học nghề trong một lĩnh vực · học xong sẽ có lời mời làm việc trong lĩnh vực đó" : "Kiến thức +6 · Thu nhập ↑ · giúp thăng tiến một chút trong 3 năm", cd: 2,
    cost: o => o && o !== 'c' ? trainCost() : med() * 0.15, opts: () => [['c'], ...(trainOK() ? Object.keys(TRAIN_F).map(k => [k]) : [])],
    optN: o => o === 'c' ? "Chứng chỉ · khóa học nghiệp vụ" : TRAIN_N()[o], ok: courseOK,
    run: o => { if (o && o !== 'c') return trainStart(o);
      const wk = isWorking(); courseDo(); return wk ? "Sau giờ làm, bạn theo học các khóa cần cho công việc đang làm và lấy được chứng chỉ." + ' ' + "Khả năng nhận được lời mời làm việc mới đã tăng lên." : "Bạn đã theo học một khóa và lấy được chứng chỉ."; } },
  { id: 'courseauto', set: 'courseAuto', sn: () => "Chứng chỉ · khóa học nghiệp vụ", ev: () => "hai năm một lần" + autoSkipTag('courseAuto', 'courseSkip'), n: () => S.flags.courseAuto ? "Thôi học khóa chứng chỉ, nghiệp vụ hai năm một lần" : "Học khóa chứng chỉ, nghiệp vụ hai năm một lần", d: () => S.flags.courseAuto && !S.flags.courseSkip ? "Giờ bạn tự đi học hai năm một lần" : L`모아 둔 돈이 비용의 세 배를 넘으면 2년마다 알아서 들어요 · 한 번에 약 ${wonStr(med() * 0.15)}`, cd: 0, cost: () => 0,
    can: courseOK, ok: () => courseOK() || !!S.flags.courseAuto,
    run: () => { S.flags.courseAuto = S.flags.courseAuto ? 0 : 1; return S.flags.courseAuto ? "Bạn đã quyết định từ nay cứ hai năm lại học một khóa chứng chỉ hoặc nghiệp vụ." + autoSkipNow('courseSkip', med() * 0.15) : "Bạn đã quyết định bỏ khóa chứng chỉ, nghiệp vụ hai năm một lần."; } },
  { id: 'huntauto', set: 'huntAuto', sn: () => "Tìm chỗ làm mới", ev: () => "hai năm một lần", n: () => S.flags.huntAuto ? "Thôi tìm chỗ làm mới hai năm một lần" : "Tìm chỗ làm mới hai năm một lần", d: () => S.flags.huntAuto ? "Giờ bạn tự đi tìm hai năm một lần" : "Trong thời gian đi làm, bạn tự đi tìm hai năm một lần · khả năng có lời mời làm việc vào năm sau ↑", cd: 0, cost: () => 0,
    can: huntOK, ok: () => huntOK() || !!S.flags.huntAuto,
    run: () => { S.flags.huntAuto = S.flags.huntAuto ? 0 : 1; return S.flags.huntAuto ? "Bạn đã quyết định từ nay cứ hai năm lại tìm hiểu cơ hội chuyển việc." : "Bạn đã quyết định dừng việc tìm chỗ làm mới hai năm một lần."; } },
  autoItem('parentsAuto', { id: 'parents', every: 2, ev: () => "hai năm một lần", word: () => "tiền biếu bố mẹ", off: () => !parentAlive() }, () => "Tiền biếu và viện phí cho bố mẹ",
    () => L`이제 2년마다 ${parW()}께 용돈과 병원비를 넉넉히 드리기로 했습니다.`, () => L`${parW()}께 드리는 용돈은 이제 그때그때 챙기기로 했습니다.`),
  autoItem('kmAuto', { id: 'kidmoney', every: 1, ev: () => "hằng năm" + ' · ' + lc1(kmName(kmAutoW())), word: () => "Tiền cho con và cháu", opt: kmAutoW, off: () => !kmOpts().length }, () => "Tiền cho con và cháu",
    () => L`이제 해마다 ${lc1(kmName(kmAutoW()))} 용돈을 주기로 했습니다.`, () => "Từ nay bạn sẽ cho con và cháu tiền tùy lúc, không theo lịch nữa."),
  autoItem('meetAuto', { id: 'meet', every: 2, ev: () => "hai năm một lần", word: () => "đi gặp gỡ tìm người", opt: () => 'meet', off: () => S.fam.married || !!S.flags.celib || S.age > 80 }, () => "Tìm một người để gặp gỡ",
    () => "Bạn đã quyết định từ nay cứ hai năm lại đi các buổi gặp mặt và nhờ người giới thiệu để làm quen. Việc này tự dừng khi bạn kết hôn.", () => "Từ nay bạn sẽ chỉ đi gặp gỡ làm quen khi thấy muốn."),
  autoItem('dinnerAuto', { id: 'dinner', every: 1, ev: () => "hằng năm", word: () => "ăn ngoài và quà tặng" }, () => "Đi ăn ngoài·tặng quà cùng gia đình·bạn bè",
    () => "Bạn đã quyết định từ nay mỗi năm sẽ cùng gia đình, bạn bè ăn một bữa tối thật ngon và tặng quà cho nhau.", () => "Từ nay bạn sẽ đi ăn ngoài và tặng quà tùy lúc, không theo lịch nữa."),
  autoItem('tripAuto', { id: 'trip', every: 1, ev: () => "hằng năm" + ' · ' + lc1(tripName(tripAutoW())), word: () => L`국내 여행${LBL}`, opt: tripAutoW, go: o => tripGo(o, null), keepMark: 1 }, () => "Du lịch trong nước",
    () => L`이제 해마다 ${lc1(tripName(tripAutoW()))} 국내 여행을 떠나기로 했습니다.`, () => "Từ nay bạn sẽ đi du lịch trong nước tùy lúc, không theo lịch nữa."),
  autoItem('abroadAuto', { id: 'abroad', every: 2, ev: () => "hai năm một lần" + ' · ' + lc1(tripName(tripAutoW(1))), word: () => L`해외여행${LBL}`, opt: () => tripAutoW(1), go: o => tripGo(o, abroadDest()), line: 1, off: () => S.cur === 'PRK' }, () => "Du lịch nước ngoài",
    () => L`이제 2년마다 ${lc1(tripName(tripAutoW(1)))} 해외여행을 떠나기로 했습니다.`, () => "Từ nay bạn sẽ đi du lịch nước ngoài tùy lúc, không theo lịch nữa."),
  autoItem('donateAuto', { id: 'donate', every: 1, ev: () => "hằng năm", word: () => "quyên góp" }, () => "Quyên góp",
    () => "Bạn đã quyết định từ nay mỗi năm sẽ quyên góp tùy theo khả năng.", () => "Từ nay bạn sẽ quyên góp tùy lúc, không theo lịch nữa."),
  autoItem('gearAuto', { id: 'gear', every: 1, ev: () => "hằng năm" + (gearAutoN() ? ' · ' + gearAutoN() : ''), word: () => "lớp học sở thích", opt: gearAutoW, off: () => !S.hobbies.length || S.age < 15 }, () => "Dụng cụ và lớp học sở thích",
    () => L`이제 해마다 ${gearAutoN()}에 쓸 장비를 갖추고 레슨을 받기로 했습니다.`, () => "Từ nay bạn sẽ lo dụng cụ và lớp học sở thích tùy lúc, không theo lịch nữa."),
  { id: 'jobhunt', n: "Tìm chỗ làm mới", d: "Gửi hồ sơ xin việc và hỏi thăm người quen · khả năng có lời mời làm việc vào năm sau ↑", cd: 2, cost: () => 0, ok: huntOK,
    run: () => { S.flags.huntAt = S.age; return "Bạn bắt đầu tìm chỗ làm mới. Bạn chỉnh sửa lại hồ sơ xin việc và nhờ người quen báo cho biết khi có vị trí trống."; } },
  { id: 'bizplan', n: "Tìm hiểu việc khởi nghiệp", d: "Cân nhắc những việc đáng thử và số tiền cần bỏ ra · năm sau sẽ có thẻ để chọn có bắt đầu kinh doanh riêng hay không", cd: 2, cost: () => 0, ok: bizPlanOK,
    run: () => { S.flags.bizPlanAt = S.age; return "Bạn bắt đầu tìm hiểu việc khởi nghiệp. Bạn đang cân nhắc từng việc đáng thử và số tiền mỗi việc cần bỏ ra."; } },
  { id: 'runprep', n: runPrepName, d: runPrepDesc, cd: 2, cost: runCost, ok: () => S.flags.runAt == null && (!!runLvl() || !!runLock()), lock: runLock, run: runPrepStart },
  { id: 'dreamjob', n: "Thử sức với công việc từng mong muốn", d: "Tìm hiểu công việc bạn hằng muốn làm · năm sau sẽ có thẻ để thử sức với một trong ba việc (đa số đều khó vào)", cd: 2, cost: () => 0, ok: dreamOK,
    run: () => { S.flags.dreamAt = S.age; return "Bạn bắt đầu tìm hiểu công việc mình ấp ủ bấy lâu: làm sao để vào được, và cần những gì."; } },
  { id: 'workback', n: "Tìm việc làm", d: "Chia việc nhà cho mọi người cùng gánh và đi tìm việc · năm sau có lời mời làm việc", cd: 2, cost: () => 0, ok: () => S.job === 'homemaker' && S.age >= 16 && S.age < 60 && !S.school,
    run: () => { S.job = 'seeking'; S.flags.seekY = 0; S.flags.reSeek = S.age; return "Bạn đã chia việc nhà cho mọi người cùng gánh và đi tìm việc làm."; } },
  { id: 'meet', n: "Tìm một người để gặp gỡ", d: "Chọn cách tìm · khả năng gặp được ai đó vào năm sau ↑", cd: 2, cost: o => o === 'match' ? matchCost() : o === 'intl' ? intlCost() : med() * 0.02,
    opts: () => [['meet'], matchOK() && !S.flags.mx ? ['match'] : null, wasMarried() ? ['wide'] : null, S.flags.bi && !S.trans && ssLegal(C(), calYr()) != null ? ['ss'] : null, intlOK() ? ['intl'] : null].filter(Boolean),
    optN: o => ({ meet: "Đi các buổi gặp mặt và nhờ bạn bè giới thiệu", match: MATCH_CO.has(C().id) ? "Đăng ký với công ty mai mối hôn nhân" : "Nhờ người mai mối", wide: "Tìm với tâm thế cởi mở về tuổi tác", ss: "Gặp gỡ người cùng giới", intl: intlBroker() ? "Đăng ký với dịch vụ môi giới hôn nhân quốc tế" : "Gặp gỡ những người đến từ nước khác" })[o],
    ok: () => !S.fam.married && !S.fam.dating && S.age >= 18 && S.age <= 80 && S.flags.meetAt == null && S.serveLeft === 0 && S.job !== 'prison' && !S.flags.hideCN && !S.flags.celib,
    run: o => { if (o === 'match') { S.flags.mx = { n: MX_N, left: MX_N, to: S.age + MX_YEARS, next: S.age + 1 };
        return MATCH_CO.has(C().id) ? "Bạn đã đăng ký với công ty mai mối hôn nhân và ghi lại hình mẫu người bạn đời mong muốn. Bạn sẽ được giới thiệu lần lượt từng người, tối đa ba người." : "Bạn đã tìm đến người mai mối và nhờ giới thiệu một người tốt. Người ấy hứa sẽ tìm giúp tối đa ba người cho đến khi gặp được người hợp ý."; }
      S.flags.meetAt = S.age; S.flags.meetK = o && o !== 'meet' ? o : null;
      if (o === 'wide') return "Bạn đã quyết định gặp gỡ mọi người lần nữa mà không bận tâm đến tuổi tác.";
      if (o === 'intl') return intlBroker() ? "Bạn đã đăng ký với dịch vụ môi giới hôn nhân quốc tế. Hai bên trao đổi ảnh và lời giới thiệu, và bạn chờ đến ngày gặp mặt." : "Bạn bắt đầu tham gia các buổi gặp gỡ của những người đến từ nước khác và các buổi trao đổi ngôn ngữ.";
      return wasMarried() ? "Bạn quyết định lại mở lòng gặp gỡ mọi người. Bạn đi các buổi gặp mặt và nhờ người quen giới thiệu." : "Bạn đã đi các buổi gặp mặt và nhờ người quen giới thiệu."; } },
  { id: 'propose', n: () => S.fam.dating ? L`${wa(callName(S.fam.dating.name))}의 앞날` : "Ngỏ lời về chuyện kết hôn", d: () => S.fam.dating ? "Tùy vào thời gian quen nhau và mức độ gắn bó" : '', cd: 1, cost: () => 0, ok: () => (!!S.fam.dating && !S.fam.married) || (cohabNow() && !wedBlocked()),
    opts: () => cohabNow() ? [['ask']] : [['ask'], ['part']], optN: o => o === 'part' ? (S.fam.dating && S.fam.dating.arr ? "Thôi chuyện mai mối" : "Nói lời chia tay") : propSS() || wedBlocked() ? "Ngỏ ý về chuyện sống chung" : "Ngỏ lời về chuyện kết hôn",
    run: o => {
      if (!S.fam.dating && cohabNow()) { const P = S.fam.partner, pw = callName(P.name); S.flags.last_cohabwed = S.age;
        if (!chance(clamp(0.6 + (S.st.so - 40) / 200, 0.4, 0.9))) { eff({ h: -2 }); return L`${iga(pw)} 지금처럼 함께 사는 것도 좋다고 했습니다.`; }
        P.cohab = 0; P.wedA = S.age; const x = incomeAt(C(), 0.5) * 0.15; S.money -= x; eff({ h: 6, so: 4 }); S.yearMark = S.yearMark || 'love';
        return L`${wa(pw)} 혼인신고를 하고 가까운 사람들 앞에서 결혼식을 올렸습니다. (−${wonStr(x)})`; }
      const d = S.fam.dating, who = callName(d.name), y = S.age - d.since;
      if (o === 'part') { S.fam.dating = null; S.flags.lastPs = d.sex; eff({ h: -3, so: -1 }); return d.arr ? L`${who}에게 혼담을 없던 일로 하자고 말했습니다.` : L`${who}에게 헤어지자고 말했습니다. 둘은 각자의 길을 가기로 했습니다.`; }
      if (chance(clamp(0.5 + 0.1 * Math.min(3, y) + (S.st.so - 40) / 200, 0.3, 0.9))) { const again = wasMarried(); S.flags.cand = Object.assign({}, d, { age: d.age + S.age - d.since }); S.fam.dating = null; marry(false); return L`${iga(who)} 고개를 끄덕였습니다.` + ' ' + wedLine(again); }
      if (chance(0.2)) { const ns = propSS() || wedBlocked(); S.fam.dating = null; eff({ h: -6, so: -3 }); return d.arr ? L`더 기다리자고 했지만, ${who} 쪽에서 혼담을 거두었습니다.` : ns ? L`${iga(who)} 아직 함께 살 마음이 없다고 했습니다. 얼마 뒤 둘은 헤어졌습니다.` : L`${iga(who)} 아직 결혼할 마음이 없다고 했습니다. 얼마 뒤 둘은 헤어졌습니다.`; }
      eff({ h: -2 }); return L`${iga(who)} 조금 더 시간을 갖자고 했습니다.`;
    } },
  { id: 'ged', n: "Học lớp đêm, ôn thi lấy bằng tương đương (1 năm)", d: () => L`1년 뒤 시험 · 붙으면 ${GED_LV()} 졸업 학력`, cd: 1, cost: gedCost, ok: gedOK, run: gedStart },
  { id: 'nightgrad', n: () => S.retired ? "Học cao học (2 năm)" : "Vừa đi làm vừa học cao học (2 năm)", d: () => (S.retired ? "Lớp buổi tối và cuối tuần · có bằng thạc sĩ sau 2 năm" : "Lớp buổi tối và cuối tuần · có bằng thạc sĩ sau 2 năm · thu nhập ↑") + ' · ' + "khoảng ba phần tư học đến cùng", cd: 99, cost: () => med() * (C().p === 'hi' ? 0.6 : 0.4),
    ok: () => S.edu === 4 && S.age >= 24 && S.age < 70 && !S.flags.nightGrad && !S.school && (isWorking() || S.retired) && !inOffice() && !talibanF(),
    run: () => { if (!chance(clamp(0.6 + (S.st.sm - 50) / 150, 0.5, 0.92))) { const back = med() * (C().p === 'hi' ? 0.6 : 0.4) * 0.9; S.money += back; S.flags.shop_nightgrad = S.age + 1 - 99; eff({ h: -2 }); return "Bạn đã nộp đơn vào chương trình cao học buổi tối nhưng lần này không được nhận. Phần lớn số tiền đã đóng được hoàn lại."; }
      S.flags.nightGrad = S.age + 2; S.flags.gMaj = (!S.retired && workField()) || S.major || 'biz'; const f = MAJORS[S.flags.gMaj].n; eff({ sm: 3, h: -2 });
      return S.retired ? L`대학원 ${f} 야간 과정에 다니기 시작했습니다. 저녁마다 젊은 동기들과 강의실에 앉습니다.` : L`일하면서 대학원 ${f} 야간 과정에 다니기 시작했습니다. 퇴근 뒤 강의실로 향합니다.`; } },
  { id: 'openuni', n: () => L`${openUniName(C())} 등록 (5년쯤)`, d: "Bắt đầu học đại học muộn · học phí thấp · khoảng một nửa số người học đến cùng", cd: 99, cost: () => med() * 0.15, ok: () => openUniOK() && S.age >= 50 && S.age <= 75, run: () => openUniStart() },
  { id: 'nightuni', n: "Vừa đi làm vừa học đại học", d: () => defUniOwn() ? "Bằng cử nhân · thu nhập ↑ · hỗ trợ học phí cho người rời Triều Tiên" : "Bằng cử nhân · thu nhập ↑", cd: 99, cost: o => o === 'open' ? med() * 0.15 : med() * 0.8 * (defUniOwn() ? 0.25 : 1),
    opts: () => [['night'], openUniOK() ? ['open'] : null].filter(Boolean),
    optN: o => o === 'open' ? L`${openUniName(C())} (5년쯤 · 학비 적음 · 절반쯤 마침)` : "Đại học buổi tối (4 năm)",
    ok: () => S.edu === 3 && S.age >= 20 && S.age < 50 && !S.flags.nightUni && !S.flags.openUni && !S.school && !talibanF(),
    run: o => { if (o === 'open') return openUniStart(); S.flags.nightUni = S.age + 4; eff({ sm: 3, h: -2 }); return "Bạn đã bắt đầu vừa đi làm vừa học đại học buổi tối."; } },
  { id: 'moveout', n: () => S.fam.married ? "Dọn ra tổ ấm riêng của hai người" : "Dọn ra khỏi nhà bố mẹ", d: () => S.fam.married ? "Rời nhà bố mẹ để cùng nhau lập tổ ấm riêng · tiền đặt cọc và sắm sửa đồ đạc" : "Tiền đặt cọc và sắm sửa đồ đạc · sau đó tự lo chi phí sinh hoạt",
    cd: 99, cost: () => incomeAt(C(), 0.5) * (C().id === 'KOR' ? 0.25 : 0.15), ok: moveOutOK, run: moveOut },
  { id: 'movehome', n: "Về ở cùng bố mẹ", d: "Chi phí sinh hoạt giảm · cho đến khi tìm lại được việc hoặc hoàn cảnh khá hơn", cd: 3, cost: () => med() * 0.02, ok: () => moveHomeOK(), run: () => moveHome() },
  { id: 'custback', n: "Đón con về nuôi lại", d: "Nói chuyện với người bạn đời cũ, nếu không được thì xin tòa án thay đổi quyền nuôi con · mong muốn của con có sức nặng lớn", cd: 3, cost: () => med() * 0.02, ok: () => custBackOK(), run: () => custBack() },
  { id: 'kidtalk', n: "Dự định có con", d: () => kidTalkOpen() || w2TalkOpen() ? "Bàn với bạn đời chuyện có con hoặc tìm hiểu việc nhận con nuôi · năm sau sẽ có thẻ" : ivfOpen() ? "Đang mong có con · tìm hiểu điều trị hiếm muộn hoặc nhận con nuôi" : "Thẩm định gia đình và tập huấn · khoảng một năm sau cơ quan sẽ liên lạc", cd: 1,
    cost: o => o === 'adopt' ? med() * (C().p === 'hi' ? 0.15 : 0.05) : o === 'ivf' ? ivfCost(C()) : 0,
    opts: () => [kidTalkOpen() ? ['talk'] : null, w2TalkOpen() ? ['talk2'] : null, ivfOpen() ? ['ivf'] : null, adoptOK() && (S.flags.adoptAsk == null || S.age - S.flags.adoptAsk >= 3) ? ['adopt'] : null].filter(Boolean),
    optN: o => o === 'talk' ? "Ngỏ lời chuyện có con" : o === 'talk2' ? "Bàn chuyện có con với người vợ thứ hai" : o === 'ivf' ? "Điều trị hiếm muộn" : kafala() ? "Tìm hiểu cách nhận chăm nuôi một đứa trẻ" : "Tìm hiểu việc nhận con nuôi",
    ok: () => kidTalkOpen() || w2TalkOpen() || ivfOpen() || (adoptOK() && (S.flags.adoptAsk == null || S.age - S.flags.adoptAsk >= 3)),
    run: o => { if (o === 'adopt') { S.flags.adoptAsk = S.age; return adoptStart(true); }
      if (o === 'ivf') return ivfOpen() ? ivfStart(true) : null;
      if (o === 'talk2') { const w = S.fam.wife2; if (!w) return null; S.flags.w2TalkAt = S.age; w.nk = 0; return L`두 번째 아내 ${wa(callName(w.name))} 아이 이야기를 오래 나누었습니다.`; }
      S.flags.kidTalkAt = S.age; S.flags.noKidsM = null; return "Bạn và bạn đời đã nói chuyện rất lâu về việc có con."; } },
  { id: 'split', n: () => legalWed() ? "Ngỏ lời chuyện ly hôn" : "Ngỏ lời chuyện chia tay", d: "Tùy vào câu trả lời của người kia và luật pháp nơi bạn sống · thẻ sẽ hiện ra ngay", cd: 1, cost: () => 0, ok: () => splitOK(),
    run: () => { if (S.t < 0.95) queue(Math.min(0.97, S.t + 0.04), 'dec', 'divtalk', {}); else S.flags.divQ = 1;
      return legalWed() ? "Bạn đã quyết tâm nói ra chuyện ly hôn mà bấy lâu nay bạn vẫn do dự." : "Bạn đã quyết tâm nói ra chuyện chia tay mà bấy lâu nay bạn vẫn do dự."; } },
  { id: 'affend', n: () => "Chấm dứt với người đang lén lút gặp gỡ", d: "Không gặp riêng nữa · chuyện đã qua vẫn có thể bị lộ sau này", cd: 1, cost: () => 0, ok: () => !!S.flags.affair && S.fam.married && !!S.fam.partner && S.fam.partner.alive,
    run: () => { const A = S.flags.affair, P = S.fam.partner; S.flags.affair = null; S.flags.affHid = S.age; P.bd = (P.bd || 0) + 2;
      return L`${wa(A.nm)} 만남을 끝내겠다고 말했습니다. ${callName(P.name)}의 곁으로 돌아왔지만, 마음의 짐은 오래 남았습니다.`; } },
  { id: 'askkids', n: "Nhờ con cái giúp đỡ", d: "Nhờ các con đã trưởng thành phụ thêm một ít vào chi tiêu trong nhà · tùy vào hoàn cảnh của con và mức độ gắn bó", cd: 3, cost: () => 0, ok: () => askKidsOK(), run: () => askKids() },
  { id: 'kidpub', n: "Chuyển các con sang trường công", d: () => L`사립 학비 한 해 약 ${wonStr(schoolFee(C()) * kidsPrivNow())}이 줄어요 · 대학 진학 가능성 조금↓`, cd: 3, cost: () => 0, ok: () => kidsPrivNow() > 0,
    run: () => { kidsToPublic(); eff({ h: -1 }); return "Bạn đã chuyển các con từ trường tư sang trường công gần nhà."; } },
  { id: 'kidpriv', n: "Cho các con học trường tư", d: () => L`아이마다 한 해 약 ${wonStr(schoolFee(C()))} · 대학 진학 가능성 조금↑`, cd: 3, cost: () => 0, ok: () => privShare(C()) >= 0.03 && S.flags.kidSchool != null && kidsYoung().some(k => !k.priv && S.age - k.bornAt >= 6 && S.age - k.bornAt < 17),
    run: () => { S.flags.kidSchool = 'priv'; for (const k of S.fam.kids) if (k.alive && S.age - k.bornAt < 18) { if (typeof k.ps === 'string') k.ps = null; if (S.age - k.bornAt >= 6) k.priv = 1; } eff({ h: 1 }); return "Bạn đã chuyển các con sang trường tư."; } },
  { id: 'tutorauto', set: 'tutorAuto', sn: () => "Học thêm · gia sư cho con", ev: () => "hằng năm" + autoSkipTag('tutorAuto', 'tutorSkip'), n: () => S.flags.tutorAuto ? "Thôi cho con học thêm, học gia sư hằng năm" : "Cho con học thêm, học gia sư hằng năm", d: () => S.flags.tutorAuto && !S.flags.tutorSkip ? "Giờ năm nào các con cũng tự được cho đi học thêm" : L`모아 둔 돈이 비용의 세 배를 넘는 해마다 알아서 보내요 · 아이 한 명에 해마다 약 ${wonStr(tutorCost())}`, cd: 0, cost: () => 0,
    can: () => kidsYoung().length > 0, ok: () => kidsYoung().length > 0 || !!S.flags.tutorAuto,
    run: () => { S.flags.tutorAuto = S.flags.tutorAuto ? 0 : 1; return S.flags.tutorAuto ? "Bạn đã quyết định từ nay mỗi năm sẽ cho các con đi học thêm và học gia sư." + autoSkipNow('tutorSkip', tutorCost() * Math.max(1, kidsYoung().filter(k => !k.placed).length)) : "Bạn đã quyết định dừng việc cho các con học thêm, học gia sư hằng năm."; } },
  { id: 'askeach', set: 'askEach', sn: () => "Quyết định riêng cho từng con", ev: () => "học phí đại học · chi phí đám cưới · nhờ giúp tiền", n: () => S.flags.askEach ? "Thôi quyết định riêng cho từng con" : "Quyết định riêng cho từng con", d: () => "Hỏi lại về học phí đại học, chi phí đám cưới và việc nhờ giúp tiền cho từng con", cd: 0, cost: () => 0,
    ok: () => S.fam.kids.some(k => k.alive && !k.sk && S.age - k.bornAt >= 10) || !!S.flags.askEach,
    run: () => { S.flags.askEach = S.flags.askEach ? 0 : 1; return S.flags.askEach ? "Từ nay bạn sẽ quyết định riêng học phí đại học, chi phí đám cưới và việc nhờ giúp tiền cho từng con." : "Học phí đại học, chi phí đám cưới và việc các con nhờ giúp tiền sẽ theo như bạn đã quyết định ban đầu."; } },
  { id: 'tutor', n: "Học thêm · gia sư cho con", d: "Khả năng vào đại học của con ↑", cd: 1, cost: o => tutorCost() * (o && o !== 'all' ? 1 : Math.max(1, kidsYoung().length)),
    opts: () => { const ky = kidsYoung(); return ky.length >= 2 ? [['all'], ...ky.map(k => ['k' + S.fam.kids.indexOf(k)])] : [['all']]; },
    optN: o => o === 'all' ? (kidsYoung().length >= 2 ? "Tất cả các con" : "Cho con đi học") : L`${callName(S.fam.kids[+o.slice(1)].name)}만${LBL}`, ok: () => kidsYoung().length > 0,
    run: o => { if (o && o !== 'all') { const k = S.fam.kids[+o.slice(1)]; k.tutor = (k.tutor || 0) + 1; eff({ so: 1 }); return L`${callName(k.name)}만 학원과 과외에 보냈습니다.`; }
      kidsYoung().forEach(k => { k.tutor = (k.tutor || 0) + 1; }); eff({ so: 1 }); return "Bạn đã cho các con đi học thêm ở trung tâm và học gia sư."; } },
  { id: 'gear', n: "Sở thích", d: () => S.hobbies.length > 1 ? "Sắm dụng cụ, đi học để giỏi hơn hoặc tìm một sở thích mới · tối đa ba sở thích" : "Trau dồi thêm hoặc tìm một sở thích mới · tối đa ba sở thích", cd: 1, cost: o => o === 'new' ? med() * 0.02 : med() * 0.05,
    opts: () => [...S.hobbies.map((h, i) => [gearOpt(i)]), newHobOK() ? ['new'] : null].filter(Boolean),
    optN: o => o === 'new' ? "Tìm một sở thích mới" : S.hobbies.length > 1 && gearHob(o) ? hobbyName(gearHob(o).id) : "Dụng cụ và lớp học (kỹ năng ↑)",
    ok: () => S.hobbies.length > 0 || newHobOK(),
    run: o => { if (o === 'new') { S.flags.gearAct = null; if (S.t < 0.95) queue(Math.min(0.97, S.t + 0.04), 'dec', 'hobby', {}); else S.flags.hobQ = 1; return "Bạn đã ngó nghiêng đủ thứ để tìm một việc mới đáng thử."; }
      const h = gearHob(o) || S.hobbies[0]; S.flags.gearW = h.id; S.flags.gearAct = 'hobby:' + h.id;
      h.lv += gearGain(h); eff({ h: 3 }); return gearLine(h.id); } },
  { id: 'moveplan', n: "Chuyển nhà · di cư", d: () => homeLookOK(false) ? "Tìm hiểu việc trở về quê hương · năm sau sẽ có thẻ" : "Chuyển lên thành phố hoặc tìm hiểu cơ hội làm việc ở nước ngoài", cd: 3, cost: o => o === 'city' ? med() * 0.1 : o === 'home' ? med() * 0.03 : med() * 0.02,
    opts: () => [toCityOK() ? ['city'] : null, abroadLookOK(false) ? ['abroad'] : null, homeLookOK(false) ? ['home'] : null, retAbroadOK(false) ? ['ret'] : null].filter(Boolean), optN: o => o === 'city' ? "Chuyển lên thành phố" : o === 'home' ? "Tìm hiểu việc trở về quê hương" : o === 'ret' ? "Tìm hiểu nơi sống ở nước ngoài khi nghỉ hưu" : "Tìm hiểu cơ hội làm việc ở nước ngoài",
    ok: () => toCityOK() || abroadLookOK(false) || homeLookOK(false) || retAbroadOK(false),
    run: o => { if (o === 'ret') { S.flags.raLookAt = S.age; return "Bạn bắt đầu tìm hiểu việc sang nước khác sống sau khi nghỉ hưu, lần lượt tra cứu điều kiện thị thực và chi phí sinh hoạt ở đó."; }
      if (o === 'city') { cityOfPeek(); const r = DEC.city.apply('go'); return typeof r === 'string' ? r : "Bạn đã chuyển lên thành phố."; }
      if (o === 'home') { S.flags.homeLookAt = S.age; return L`고향 ${ro(B().ko)} 돌아갈 길을 알아보기 시작했습니다. 그곳의 일자리와 집을 하나씩 찾아보고 있습니다.`; }
      S.flags.abLookAt = S.age; return "Bạn bắt đầu tìm hiểu cơ hội làm việc ở nước khác. Bạn đang lần lượt xem xét điều kiện thị thực và các công việc."; } },
  { id: 'donate', n: "Quyên góp", d: "Hạnh phúc +4 · Quan hệ +2", cd: 1, cost: () => med() * 0.05, ok: () => S.age >= 18, run: () => { eff({ h: 4, so: 2 }); return pick(["Bạn đã tặng sách và đồ dùng học tập cho một trường học ở làng bên.", "Bạn đã quyên góp cho một tổ chức cứu trợ.", S.rel === 'N' || S.rel === 'F' ? "Bạn đã giúp đỡ những gia đình khó khăn thông qua trung tâm phúc lợi trong khu phố." : "Bạn đã giúp đỡ gia đình khó khăn thông qua cộng đồng tôn giáo của mình."]); } },
  { id: 'remodel', n: "Sửa chữa, cải tạo nhà", d: "Hạnh phúc +6 · Giá trị nhà +", cd: 5, cost: () => S.house * 0.08, ok: () => S.house > 0, run: () => { S.house *= 1.06; eff({ h: 6 }); return "Bạn đã sửa sang lại ngôi nhà."; } },
  { id: 'sellcar', n: "Bán ô tô", d: () => S.age >= 70 ? "Thôi lái xe · không còn tốn tiền sửa xe" : "Giữ lại tiền bán xe cũ · không còn tốn tiền sửa xe", cd: 1, cost: () => 0, gain: () => carValue(), ok: () => !!S.owns.car,
    run: () => { const v = carValue(); delete S.owns.car; S.money += v; S.flags.soldCar = S.age; eff({ h: -1 });
      return S.age >= 70 ? L`자동차를 팔고 운전대를 내려놓았습니다. ${wonStr(v)}이 손에 남았습니다.` : L`자동차를 팔았습니다. ${wonStr(v)}이 손에 남았습니다.`; } },
  { id: 'sellmoto', n: "Bán xe máy", d: "Nguy cơ tai nạn giao thông ↓", cd: 99, cost: () => 0, gain: () => usd2ppp(C(), 400), ok: () => !!S.owns.moto, run: () => { delete S.owns.moto; S.flags.noMoto = 1; S.money += usd2ppp(C(), 400); return "Bạn đã bán chiếc xe máy. Giờ bạn đi bộ hoặc đi xe buýt."; } },
  { id: 'bigger', n: "Chuyển đến nhà rộng hơn", d: "Hạnh phúc +10 · Quan hệ +3", cd: 8, cost: () => housePrice(C()) * 0.6, ok: () => S.house > 0, run: () => { S.house += housePrice(C()) * 0.6; if (S.flags.hPaid) S.flags.hPaid += housePrice(C()) * 0.6; houseStep(1); eff({ h: 10, so: 3 }); S.yearMark = 'buy'; return "Bạn đã chuyển đến một ngôi nhà rộng hơn."; } },
  { id: 'smaller', n: "Chuyển sang nhà nhỏ hơn", d: () => L`집을 팔고 작은 집으로 · 차액이 손에 남아요 · 사고파는 비용 약 ${wonStr(S.house * 0.06)}`, cd: 5, cost: () => 0, gain: () => downGain(), ok: () => S.house > 0 && !!S.owns.house && (S.age >= 45 || !homeOthers().kids.length) && downGain() > med() * 0.5 && S.flags.oldHome !== 'kid' && S.flags.oldHome !== 'care' && !S.flags.revM,
    run: () => { const g = downGain(), fee = S.house * 0.06, pl = paidLine(); S.house = downTo(); S.flags.hPaid = S.flags.hPaid ? S.house : 0; houseStep(-1); S.money += g; eff({ h: 2 }); S.yearMark = 'move'; return L`살던 집을 팔고 작은 집으로 옮겼습니다. 차액 ${wonStr(g)}이 손에 남았습니다.` + ' ' + L`중개비·세금·이사 비용으로 약 ${wonStr(fee)}이 들었습니다.` + pl; } },
  { id: 'kidsur', n: "Đổi họ cho con", cd: 5, cost: () => med() * 0.02,
    d: () => C().id === 'KOR' ? "Xin tòa án gia đình cho đổi họ và bản quán (gốc dòng họ) của con · nếu được chấp thuận, con sẽ mang họ của bạn" : "Xin tòa án cho đổi họ của con · nếu được chấp thuận, con sẽ mang họ của bạn",
    ok: () => !S.fam.married && !!S.fam.partner && !!S.fam.partner.divorced && MSN_OK.has(C().id) && surKids().length > 0,
    run: () => { const ks = surKids(); if (!chance(C().id === 'KOR' ? 0.85 : 0.75)) return "Tòa án không cho phép đổi họ của con. Tòa yêu cầu bạn cân nhắc thêm điều gì là tốt nhất cho con.";
      const ns = ks.map(k => { k.name = withSurname(k.name, S.name.base, k.sex); k.surCh = 1; return callName(k.name); }); eff({ h: 2 });
      return L`법원의 허가를 받아 ${listAnd(ns)}의 성을 내 성으로 바꾸었습니다.`; } },
  { id: 'rental', n: "Nhà cho thuê", cd: 1, cash: 1,
    d: () => { const R = rentals(), c = C(), cs = [...new Set(R.map(h => h.c))].filter(i => CBY[i]), far = cs.some(i => i !== S.cur);
      const t = R.length ? L`${R.length}채 · 시세 ${wonStr(rentV())}` + (far ? ' · ' + L`${listAnd(cs.map(i => CBY[i].ko))}에 있어요` : '') : "Mua và thu tiền thuê";
      const why = R.length < RENT_MAX && !rentDeal('s').ok ? ' · ' + "Với thu nhập hiện tại, bạn không vay thêm được nữa" : '';
      return t + ' · ' + (rentLTV(c) > 0 ? L`대출은 집값의 ${Math.round(rentLTV(c) * 100)}%까지` : "Phải mua mà không vay") + ' · ' + "Mua bán đều tốn thuế và phí, lại có những tháng nhà để trống và chi phí bảo trì" + why; },
    opts: () => [rentals().length < RENT_MAX && rentOK() ? ['s'] : null, rentals().length < RENT_MAX && rentOK() ? ['b'] : null, rentals().length ? ['sell'] : null, rentInOK() ? ['in'] : null].filter(Boolean),
    optN: o => o === 'in' ? "Dọn vào ở một căn" : o === 'sell' ? rentSellN() : o === 'b' ? L`집 사기 (${wonStr(rentDeal('b').v)})` : L`작은 집 사기 (${wonStr(rentDeal('s').v)})`,
    optOK: o => o === 'sell' || o === 'in' || rentDeal(o).ok, optG: o => o === 'sell' && rentals().length ? rentSellNet(rentals()[0]).net : null,
    cost: o => o === 'sell' || o === 'in' ? 0 : rentDeal(o).down,
    ok: () => rentals().length > 0 || (rentOK() && S.money >= rentDeal('s').down * 0.6),
    run: (o, paid) => o === 'in' ? rentIn() : o === 'sell' ? rentSell() : rentBuy(o, paid) },
  { id: 'sellhouse', n: () => rentals().length ? "Bán căn nhà đang ở" : "Bán nhà", d: () => [rentals().length ? homeAtD() : null, "Giữ lại tiền bán nhà sau khi trừ chi phí", sellAfter(false)].filter(Boolean).join(' · '),
    cd: 99, cost: () => 0, gain: () => S.house * 0.94, ok: () => S.house > 0 && !!S.owns.house, lock: () => S.flags.hBuyAt === S.age ? "Nhà mua năm nay phải sang năm mới bán được" : null,
    run: () => { const v = S.house * 0.94, pl = paidLine(), at = rentals().length ? homeAtSold() : "Bạn đã bán nhà.", stay = !ownHomeHere(); S.money += v; S.house = 0; S.flags.hPaid = 0; delete S.owns.house; eff({ h: -3 }); if (!stay) S.yearMark = 'move';
      return at + ' ' + L`${wonStr(v)}이 손에 들어왔습니다.` + ' ' + sellAfter(true) + (S.money < 0 ? ' ' + L`그래도 남은 빚이 ${wonStr(-S.money)}입니다.` : '') + pl; } },
];
function tripWith() {
  const f = S.fam, P = f.partner, pt = f.married && P && P.alive && !P.divorced && !ptAway(), kids = f.kids.filter(k => k.alive && !k.away && !k.grown && S.age - k.bornAt < 18).length;
  const par = (f.mom.alive || (f.dad.alive && !f.dad.absent)) && !farFromNK() && S.age >= 25 && !S.refugee && !(f.mom.age >= 88 && f.dad.age >= 88);
  const gks = kids ? [] : f.kids.filter(k => k.alive && !k.away && !k.abroad && S.age - k.bornAt >= 18), gk = gks.length;
  const gkPaid = gks.filter(k => !(k.job && JOBS[k.job] && !['student', 'seeking', 'prison'].includes(k.job) && S.age - k.bornAt >= 23)).length;
  const o = [];
  if (kids) o.push(['fam', 1 + (pt ? 0.8 : 0) + 0.5 * kids]);
  if (gk) o.push(['kids', 1 + (pt ? 0.8 : 0) + 0.5 * Math.min(3, gkPaid)]);
  if (pt) o.push(['pt', 1.8]);
  if (S.age >= 16 && (S.age < 50 || friendsLeft())) o.push(['fr', 1]);
  if (par) o.push(['par', 2]);
  o.push(['solo', 1]);
  return o;
}
const tripGrown = () => S.fam.kids.filter(k => k.alive && !k.away && !k.abroad && S.age - k.bornAt >= 18).length;
const tripMult = o => { const w = tripWith().find(x => x[0] === o); return w ? w[1] : 1; };
function tripName(o) {
  const P = S.fam.partner;
  const ptGo = S.fam.married && P && P.alive && !P.divorced && !ptAway();
  return o === 'fam' ? "Cùng gia đình" : o === 'kids' ? (ptGo ? (tripGrown() === 1 ? "Cùng bạn đời và con đã trưởng thành" : "Cùng bạn đời và các con đã trưởng thành") : tripGrown() === 1 ? "Cùng đứa con đã trưởng thành" : "Cùng các con đã trưởng thành") : o === 'pt' ? ({ m: "Chỉ có bạn và bạn đời", cp: "Chỉ có bạn và người đồng hành", none: "Chỉ có bạn và người sống cùng" })[unionOf(P)] || "Chỉ có bạn và bạn đời"
    : o === 'fr' ? "cùng bạn bè" : o === 'par' ? L`${eul(parW())} 모시고` : "Một mình";
}
function tripGo(o, dest) {
  if (!tripWith().some(x => x[0] === o)) o = 'solo';
  const f = S.fam, P = f.partner, d = dest && dest.ko, nm = P && P.name ? callName(P.name) : '';
  TRIP_ACT = 'trip:' + (dest ? actOf(['city', 'city', 'beach', 'nature'], dest.id) : actOf(['beach', 'mount', 'nature'])) + ':' + (dest ? dest.p : '') + ':' + o;
  eff(dest ? { h: 8, sm: 3 } : { h: 5, sm: 1 }); S.yearMark = dest ? 'trip' : S.yearMark || 'trip'; if (dest) tripTo(dest.id);
  if (o === 'fam') { eff({ so: 4 }); for (const k of f.kids) if (k.alive && !k.away && !k.grown && S.age - k.bornAt < 18) k.bd = (k.bd || 0) + 2; for (const k of kidsOut()) btAdd(k, 3); if (P && P.alive && f.married) { P.bd = (P.bd || 0) + 1; btAdd(P, 2); }
    const one = f.kids.filter(k => k.alive && !k.away && !k.grown && S.age - k.bornAt < 18).length === 1;
    return d ? (one ? L`가족과 함께 ${ro(d)} 여행을 다녀왔습니다. 아이에게는 처음 보는 세상이었습니다.` : L`가족과 함께 ${ro(d)} 여행을 다녀왔습니다. 아이들에게는 처음 보는 세상이었습니다.`) : one ? "Bạn đã cùng gia đình đi du lịch vài ngày. Trên đường về, con ngủ say lúc nào không hay." : "Bạn đã cùng gia đình đi du lịch vài ngày. Trên đường về, các con ngủ say lúc nào không hay."; }
  if (o === 'kids') { eff({ so: 4, h: 1 }); for (const k of f.kids) if (k.alive && !k.away && !k.abroad && S.age - k.bornAt >= 18) btAdd(k, 3); if (P && P.alive && f.married) { P.bd = (P.bd || 0) + 1; btAdd(P, 2); }
    if (tripGrown() === 1) return d ? L`다 자란 자녀와 ${ro(d)} 여행을 다녀왔습니다. 이번에는 아이가 앞장서 길을 찾았습니다.` : "Bạn đã đi du lịch vài ngày cùng đứa con đã trưởng thành. Những câu chuyện về các chuyến đi hồi nhỏ kéo dài đến tận khuya.";
    return d ? L`다 자란 자녀들과 ${ro(d)} 여행을 다녀왔습니다. 이번에는 아이들이 앞장서 길을 찾았습니다.` : "Bạn đã đi du lịch vài ngày cùng các con đã trưởng thành. Những câu chuyện về các chuyến đi hồi nhỏ kéo dài đến tận khuya."; }
  if (o === 'pt') { eff({ so: 3, h: 1 }); P.bd = (P.bd || 0) + 4; btAdd(P, 3); const again = S.flags.coupleT != null && S.age - S.flags.coupleT <= 2; S.flags.coupleT = S.age;
    const fresh = S.age - (f.marriedAt != null ? f.marriedAt : S.age - 10) < 5;
    if (fresh && d) return L`${wa(nm)} 단둘이 ${ro(d)} 여행을 다녀왔습니다.` + ' ' + "Vì mới bên nhau chưa lâu, khoảng thời gian riêng của hai người trên những con phố lạ thật mới mẻ.";
    if (fresh) return noWalk() ? L`${wa(nm)} 단둘이 여행을 다녀왔습니다. 함께한 날이 아직 길지 않아, 손을 꼭 잡고 바라본 바다가 새로웠습니다.` : L`${wa(nm)} 단둘이 여행을 다녀왔습니다. 함께한 날이 아직 길지 않아, 손을 잡고 걷는 길이 새로웠습니다.`;
    if (again) return d ? L`${wa(nm)} 이번에는 단둘이 ${ro(d)} 여행을 다녀왔습니다.` + ' ' + "Trên những con phố lạ, hai người có thời gian cho riêng mình." : L`${wa(nm)} 올해도 단둘이 여행을 다녀왔습니다.` + ' ' + "Những chuyến đi cùng nhau giờ đã quen thuộc và thoải mái.";
    return d ? L`${wa(nm)} 단둘이 ${ro(d)} 여행을 다녀왔습니다. 낯선 거리에서 오랜만에 둘만의 시간을 보냈습니다.` : noWalk() ? L`${wa(nm)} 단둘이 여행을 다녀왔습니다. 오랜만에 연애할 때처럼 손을 꼭 잡고 바다를 바라보았습니다.` : L`${wa(nm)} 단둘이 여행을 다녀왔습니다. 오랜만에 연애할 때처럼 손을 잡고 걸었습니다.`; }
  if (o === 'fr') { eff({ so: 5 }); return d ? L`친구들과 ${ro(d)} 여행을 다녀왔습니다. 두고두고 이야기할 추억이 생겼습니다.` : "Bạn đã đi du lịch cùng bạn bè. Mải trò chuyện đến khuya nên chẳng ngủ được mấy."; }
  if (o === 'par') { eff({ so: 4 }); S.flags.parTrip = S.age; btAdd(f.mom, 4); if (!f.dad.absent) btAdd(f.dad, 4);
    return d ? L`${eul(parW())} 모시고 ${ro(d)} 여행을 다녀왔습니다. 비행기 창밖을 한참 내다보셨습니다.` : L`${eul(parW())} 모시고 여행을 다녀왔습니다. 찍어 드린 사진을 한참 들여다보셨습니다.`; }
  eff({ h: 1, sm: 1 }); return d ? L`혼자 ${ro(d)} 여행을 다녀왔습니다. 세상이 넓다는 걸 실감했습니다.` : noWalk() ? "Bạn đã đi du lịch một mình vài ngày. Thong thả dạo quanh những con phố lạ, bạn sắp xếp lại suy nghĩ của mình." : "Bạn đã đi du lịch một mình vài ngày. Bước đi trên những con đường lạ, bạn sắp xếp lại suy nghĩ của mình.";
}
function downTo() { return Math.min(S.house * 0.55, housePrice(C()) * 0.7); }
function downGain() { return Math.max(0, S.house * 0.94 - downTo()); }
const SHOP_CREDIT = 0.2;
const shopInc = () => { const P = S.fam.partner; return Math.max(0, S.income) + (S.fam.married && P && P.alive && !P.divorced ? Math.max(0, P.inc || 0) : 0); };
const onCredit = price => price > 0 && S.money < price;
const creditOK = price => price <= shopInc() * SHOP_CREDIT && S.money - price >= -creditLimit() * 0.9;
const canPay = price => price <= 0 || S.money >= price || creditOK(price);
const payOK = (it, price) => price <= 0 || (it.cash ? S.money >= price : canPay(price));
const payWhy = price => price <= shopInc() * SHOP_CREDIT ? "Vượt quá hạn mức có thể vay" : "Không đủ tiền";
const PRISON_SHOP = new Set(['parents', 'willwrite']);
function shopItems() {
  const out = [], inside = S.job === 'prison';
  if (!inside) for (const k of ['phone', 'tv', 'pc', 'bike', 'moto', 'car', 'house']) {
    const it = ITEMS[k], c = C();
    if (S.owns[k] || S.age < it.age || (it.only && !it.only(c)) || (k === 'phone' && c.net < 5)) continue;
    if (k === 'bike' && disOn() && S.dis.k !== 'hear') continue;
    if (rohCamp() && k !== 'phone' && k !== 'bike') continue;
    if (k === 'moto' && S.owns.car) continue;
    if ((k === 'car' || k === 'moto') && S.flags.licRet != null) continue;
    if (k === 'pc' && S.money < itemPrice('pc')) continue;
    if (k === 'phone' && !smartOK(c)) { if (!S.owns.cell && cellOK(c)) { const pc = itemPrice('cell'); out.push({ id: 'own_cell', n: ITEMS.cell.n, d: L`행복 +${ITEMS.cell.joy}`, price: pc, avail: S.money >= pc, why: '' }); } continue; }
    const hd = k === 'house' ? houseDeal() : null, price = k === 'house' ? (hd ? hd.price : houseFirstK() * itemPrice(k)) : itemPrice(k);
    out.push({ id: 'own_' + k, n: k === 'house' ? "Mua nhà riêng" : it.n, d: k === 'house' ? (careNow() ? L`요양원에서 나와 내 집으로 옮겨요 · 행복 +${it.joy}` : L`행복 +${it.joy}`) + (hd ? ' · ' + (hd.loan > 0 ? L`모자라는 ${wonStr(hd.loan)}은 대출` : "Không cần vay") : '') : k === 'bike' ? L`행복 +${it.joy} · 타고 다니면 건강 ↑` : k === 'pc' ? L`행복 +${it.joy} · 혼자 코딩을 배울 수도 있어요` : L`행복 +${it.joy}${k === 'moto' ? " · Nguy cơ tai nạn giao thông ↑" : ''}`, price, avail: k === 'house' ? !!hd : S.money >= price, why: k === 'house' ? (S.age > 55 ? "Ở tuổi này khó vay được tiền, nên cần đủ toàn bộ giá nhà" : "Cần tiền trả trước (20% giá nhà) và đủ thu nhập để trả nợ vay") : '' });
  }
  for (const it of SHOP) {
    if (inside && (S.flags.nkCamp || !PRISON_SHOP.has(it.id))) continue;
    if (!it.ok() || it.set || (rohCamp() && ROH_NO_SHOP.has(it.id)) || ddShopNo(it.id)) continue;
    if (it.opts) {
      const last = shopLast(it), wait = last != null ? it.cd - (S.age - last) : 0;
      out.push({ id: it.id, n: typeof it.n === 'function' ? it.n() : it.n, d: shopD(it), opts: it.opts().map(([k]) => { const pr = it.cost(k), ok = wait <= 0 && (!it.optOK || it.optOK(k)) && payOK(it, pr); return { id: it.id + '@' + k, n: it.optN ? it.optN(k) : tripName(k), price: pr, gain: it.optG ? it.optG(k) : null, avail: ok, credit: ok && !it.cash && onCredit(pr) }; }), avail: wait <= 0, why: wait > 0 ? (wait > 50 ? "Đã ghi danh rồi" : L`${wait}년 뒤 다시 가능`) : '' });
      continue;
    }
    const price = it.cost(); const last = shopLast(it);
    const wait = last != null ? it.cd - (S.age - last) : 0, lock = it.lock ? it.lock() : null;
    if (lock) { out.push({ id: it.id, n: typeof it.n === 'function' ? it.n() : it.n, d: shopD(it), price, avail: false, why: lock }); continue; }
    out.push({ id: it.id, n: typeof it.n === 'function' ? it.n() : it.n, d: shopD(it), price, gain: it.gain ? it.gain() : null, avail: wait <= 0 && canPay(price), credit: wait <= 0 && onCredit(price) && canPay(price), why: wait > 0 ? (wait > 50 ? "Đã ghi danh rồi" : L`${wait}년 뒤 다시 가능`) : payWhy(price) });
  }
  return out;
}
const shopSets = () => SHOP.filter(it => it.set && it.ok() && !(rohCamp() && ROH_NO_SHOP.has(it.id)) && !ddShopNo(it.id)).map(it => { const on = !!S.flags[it.set], idle = on && it.can && !it.can(); return { id: it.id, n: it.sn(), ev: idle ? "tạm dừng lúc này" : it.ev ? it.ev() : '', on }; });
const SET_ENDS = { courseAuto: () => S.age >= 60, huntAuto: () => S.retired || S.age > 60, tutorAuto: () => S.age >= 55 && !kidsYoung().length };
const SHOP_TOP_N = 6;
const SHOP_FUN = new Set(['dinner', 'party', 'trip', 'abroad', 'gear', 'donate', 'remodel', 'bigger', 'kidmoney']);
function shopRank(it) {
  const id = it.id.split('@')[0], a = S.age, debt = S.money < 0, heavy = debt && debtHeavy();
  if (id.startsWith('tutor_')) return 0;
  const oldPar = [S.fam.mom, S.fam.dad].some(p => p && p.alive && !p.absent && p.age >= 70);
  const r = {
    broker: 10, workback: 9, propose: 9, affend: 8, movehome: 5, custback: 4, meet: a <= 50 ? 8 : 3, kidtalk: kidTalkOpen() || w2TalkOpen() ? 7 : S.fam.married && !S.fam.kids.length ? 5 : 1, split: 1, askkids: S.money < 0 || (S.retired && S.money < med() * 2) ? 6 : 1, moveout: 4, lottostop: 4, tutor: 5,
    checkup: S.st.hl < 55 || a >= 50 ? 7 : 3, parents: oldPar ? 6 : 3, parbring: oldPar ? 6 : 4, kidmoney: a >= 60 && kmGrand().length ? 4 : 2, course: isWorking() && a < 50 ? 4 : 2, jobhunt: 4,
    hschend: S.money < 0 || (S.flags.hsch && S.flags.hsch.off) ? 6 : 1, ged: 3, nightuni: gedNew() ? 8 : 3, openuni: gedNew() ? 8 : 3, nightgrad: 3, moveplan: S.urban === false ? 3 : 2, willwrite: a >= 70 ? 4 : 1, sellhouse: heavy ? 8 : 0, rental: heavy && rentals().length ? 8 : 1, smaller: heavy ? 8 : 1, sellcar: heavy ? 8 : 0,
    sellmoto: heavy ? 8 : 0, own_house: debt ? 0 : 5, dinner: 5, trip: 4, abroad: 3, party: 3, gear: 3, donate: 2, kidpub: heavy ? 8 : 1, kidpriv: debt ? 0 : 1,
  }[id];
  const v = r != null ? r : id.startsWith('own_') ? 2 : 1;
  return debt && (SHOP_FUN.has(id) || id.startsWith('own_')) ? Math.max(0, v - 3) : v;
}
function shopTop(items) {
  return items.map((it, i) => ({ it, i, r: shopRank(it) })).filter(x => x.r > 0 && (x.it.opts ? x.it.opts.some(o => o.avail) : x.it.avail))
    .sort((x, y) => y.r - x.r || x.i - y.i).slice(0, SHOP_TOP_N).map(x => x.it);
}
function shopLast(it) { const last = S.flags['shop_' + it.id], o = { sellcar: 'car', sellmoto: 'moto' }[it.id]; return o && last != null && S.owns[o] != null && S.owns[o] > last ? null : last; }
function buyShop(id) { const n0 = netWorth(); fxStart(); ACT_EV = ACT_DEC = null; TRIP_ACT = null; let r = buyShop0(id); ssWedLater();   if (r && typeof r === 'object') r = r.t;   if (r) giveMark(id.split('@')[0], id.split('@')[1]); { const f = SHOP_ACT[id.split('@')[0]]; ACT_NEXT = r ? TRIP_ACT || (typeof f === 'function' ? f() : f) || null : null; }
 if (r) { const it = SHOP.find(x => x.id === id.split('@')[0]); bookSince(n0, it ? (typeof it.n === 'function' ? it.n() : it.n) : id.startsWith('tutor_') ? "Học thêm · gia sư cho con" : id === 'own_house' ? "Hỗ trợ mua nhà" : (ITEMS[id.slice(4)] ? L`${ITEMS[id.slice(4)].n} 구입` : "Mua sắm")); } return r; }
const motoLine = () => isWorking() ? "Bạn đã mua một chiếc xe máy. Việc đi làm trở nên dễ dàng hơn nhiều." : S.school ? "Bạn đã mua một chiếc xe máy. Việc đến trường trở nên dễ dàng hơn nhiều." : "Bạn đã mua một chiếc xe máy. Việc đi chợ và đi chơi trở nên dễ dàng hơn nhiều.";
function buyShop0(id) {
  if (id.startsWith('tutor_')) {
    const k = S.fam.kids[+id.slice(6)], price = tutorCost(), last = S.flags['shop_' + id];
    if (!k || !k.alive || !kidsYoung().includes(k) || (last != null && S.age - last < 1) || !canPay(price)) return null;
    S.money -= price; S.flags['shop_' + id] = S.age; k.tutor = (k.tutor || 0) + 1; eff({ so: 1 });
    return L`${callName(k.name)}만 학원과 과외에 보냈습니다.`;
  }
  if (id.startsWith('own_')) {
    const k = id.slice(4), hd = k === 'house' ? houseDeal() : null, price = hd ? hd.price : itemPrice(k);
    if (S.owns[k] || (k === 'house' ? !hd : S.money < price)) return null;
    if (k === 'cell' ? S.owns.phone || !cellOK(C()) : k === 'phone' && !smartOK(C())) return null;
    if (hd && hd.help) { S.money += hd.help; S.flags.hHelp = S.age; }
    const h0 = k === 'car' ? carH0() : 0;
    const mv = k === 'house' ? homeBought() : '';
    S.money -= price; S.owns[k] = S.age; eff({ h: ITEMS[k].joy }); if (k === 'house') { S.house = price; S.flags.hPaid = price; houseSet(); S.flags.hadHome = 1; S.flags.hBuyAt = S.age; S.yearMark = 'buy'; } const ct = k === 'car' ? carBought(h0) : '';
    return { pc: "Bạn đã sắm một chiếc máy tính xách tay. Tối đến, bạn tìm thấy niềm vui trong việc học thử đủ thứ.", bike: S.urban && isWorking() && !S.owns.car ? "Bạn đã mua một chiếc xe đạp. Những quãng đường gần, bạn đi bằng xe đạp." : "Bạn đã mua một chiếc xe đạp.", phone: "Bạn có chiếc điện thoại thông minh đầu tiên.", cell: "Lần đầu tiên bạn có điện thoại di động.", moto: motoLine(), car: "Bạn đã mua ô tô." + ct, house: (hd && hd.help ? L`${parW()}의 도움을 받아 내 집을 마련했습니다!` : hd && hd.loan > 0 ? "Bạn đã có ngôi nhà của riêng mình nhờ vay thế chấp!" : "Bạn đã có căn nhà của riêng mình!") + mv, tv: "Nhà bạn đã có tivi và tủ lạnh." }[k];
  }
  const [bid, opt] = id.split('@');
  const it = SHOP.find(x => x.id === bid); if (!it || !it.ok() || (it.lock && it.lock())) return null;
  if (it.opts && (!it.opts().some(x => x[0] === opt) || (it.optOK && !it.optOK(opt)))) return null;
  const price = it.cost(opt); const last = shopLast(it);
  if ((last != null && S.age - last < it.cd) || !payOK(it, price)) return null;
  S.money -= price; S.flags['shop_' + bid] = S.age;
  return it.run(opt, price);
}
const NOW_Y = 2026;
const ERA_Y0 = 1950, ERA_PAST1 = 2025;
const eraLoaded = () => typeof ERA !== 'undefined' && !!(ERA && ERA.C);
const eA = (arr, y) => arr[clamp(Math.round(y) - ERA_Y0, 0, arr.length - 1)];
const e5 = (arr, y) => { const x = clamp((y - ERA_Y0) / 5, 0, arr.length - 1), i = Math.floor(x), t = x - i; return i >= arr.length - 1 ? arr[arr.length - 1] : arr[i] * (1 - t) + arr[i + 1] * t; };
const ERA_CC = {};
function eraGdp(c, E, yr) {
  if (yr <= ERA_PAST1) return E.g ? e5(E.g, yr) / 1000 : Math.pow(1.02, yr - NOW_Y);
  if (yr < NOW_Y) return E.g ? (e5(E.g, ERA_PAST1) / 1000) * (NOW_Y - yr) + (yr - ERA_PAST1) : 1;
  let k = 1, p = c.ppp;
  for (let y = NOW_Y; y < yr; y++) { const g = 0.009 + 0.017 * (1 - Math.min(1, p / 60000)); p *= 1 + g; k *= 1 + g; }
  return k;
}
function eraSchool(o, c, E, yr) {
  if (yr >= NOW_Y) {
    const t = 1 - Math.exp(-(yr - NOW_Y) / 35);
    o.ter = c.ter + (Math.min(100, c.ter + 35) - c.ter) * t;
    o.eys = c.eys + (Math.max(c.eys, 16.5) - c.eys) * (1 - Math.exp(-(yr - NOW_Y) / 40));
    return;
  }
  if (!E.e3) return;
  const k = E.own ? 1 : c.ter / 1.45 / Math.max(0.5, E.e3[12]);
  const terAt = y => y <= 2010 ? e5(E.e3, y) * (E.own ? 1 : k) : null;
  const ter10 = E.own ? E.e3[12] : c.ter / 1.45;
  o.ter = yr <= 2010 ? terAt(yr) : ter10 + (c.ter - ter10) * (yr - 2010) / 16;
  const pr = y => 6 * Math.min(1, e5(E.e1, y) / 100) + 6 * Math.min(1, e5(E.e2, y) / 100) + 4 * Math.min(1, e5(E.e3, y) / 100);
  const eys10 = c.eys / 1.08;
  o.eys = yr <= 2010 ? eys10 * pr(yr) / Math.max(0.5, pr(2010)) : eys10 + (c.eys - eys10) * (yr - 2010) / 16;
  o.ter = clamp(o.ter, 0, 100); o.eys = clamp(o.eys, 0.5, 20);
  if (yr < 2010) { o.eysB = eys10; o.k1 = clamp(e5(E.e1, yr) / Math.max(1, e5(E.e1, 2010)), 0.02, 1.1); o.k2 = clamp(e5(E.e2, yr) / Math.max(1, e5(E.e2, 2010)), 0.01, 1.1); }
}
const agrFit = p => 80 / (1 + Math.exp(Math.log(Math.max(200, p)) - 8.5));
const eraAgr = (c, p) => clamp(c.agr + agrFit(p) - agrFit(c.ppp), 0.5, 90);
function eraNet(c, yr) {
  if (yr >= NOW_Y) return c.net + (97 - c.net) * (1 - Math.exp(-(yr - NOW_Y) / 8));
  if (yr < 1991) return 0;
  const mid = c.ppp > 40000 ? 2001 : c.ppp > 15000 ? 2009 : 2016, S_ = y => 1 / (1 + Math.exp(-0.32 * (y - mid)));
  return c.net * S_(yr) / S_(NOW_Y);
}
const HIV_PEAK = { UGA: [1991, 3], KEN: [1996, 2.2], TZA: [1995, 1.6], RWA: [1992, 2.5], BDI: [1993, 2.5], ZWE: [1997, 2.2], ZMB: [1996, 1.6],
  MWI: [1998, 1.8], BWA: [2002, 1.35], LSO: [2003, 1.15], NAM: [2002, 1.5], ZAF: [2010, 1.05], MOZ: [2010, 1.2], CIV: [1998, 3], CMR: [2002, 2.2], CAF: [2000, 3] };
function eraHiv(c, yr) {
  if (!c.hiv) return c.hiv;
  if (yr >= NOW_Y) return c.hiv * Math.pow(0.965, yr - NOW_Y);
  if (yr < 1982) return 0;
  const [py, pk] = HIV_PEAK[c.id] || (c.hiv > 1 ? [1999, 1.6] : [2005, 1.2]);
  if (yr <= py) return c.hiv * pk * clamp((yr - 1982) / Math.max(4, py - 1982), 0, 1) ** 2;
  return c.hiv * (pk + (1 - pk) * (yr - py) / Math.max(1, NOW_Y - py));
}
const ERA_REL = { CHN: { r: 'C', pts: [[1950, 0.74], [1982, 0.6], [1997, 1.13], [2018, 3.15]] } };
function eraRel(c, yr) {
  const E = ERA_REL[c.id]; if (!E) return c.rel;
  const P = E.pts, last = P[P.length - 1]; if (yr >= last[0]) return c.rel;
  let v = P[0][1]; for (let i = 1; i < P.length; i++) if (yr >= P[i - 1][0] && yr <= P[i][0]) { const [y0, a] = P[i - 1], [y1, b] = P[i]; v = a + (b - a) * (yr - y0) / (y1 - y0); }
  const now = relShare(c, E.r) * 100, s = now * v / last[1], k = (100 - s) / Math.max(1, 100 - now);
  return c.rel.split(',').map(x => x[0] + Math.round((x[0] === E.r ? s : +x.slice(1) * k) * 100) / 100).join(',');
}
function eraAt(c, yr) {
  if (yr == null || !c || !eraLoaded() || !ERA.C[c.id]) return c;
  yr = clamp(Math.round(yr), ERA_Y0, ERA.y1 || 2100);
  const key = c.id + yr; if (ERA_CC[key]) return ERA_CC[key];
  const E = ERA.C[c.id], o = Object.assign({}, c);
  o.yr = yr;
  const dM = (eA(E.m, yr) - eA(E.m, NOW_Y)) / 10, dF = (eA(E.f, yr) - eA(E.f, NOW_Y)) / 10;
  const eM = Math.max(8, c.le - c.gap * 0.51 + dM), eF = Math.max(9, c.le + c.gap * 0.49 + dF);
  o.gap = eF - eM; o.le = eM + 0.51 * o.gap;
  const rk = arr => e5(arr, yr) / Math.max(0.1, e5(arr, NOW_Y));
  o.u5 = clamp(c.u5 * rk(E.u5), 1, 450); o.im = clamp(c.im * rk(E.im), 0.8, 300);
  o.tfr = clamp(c.tfr * eA(E.t, yr) / Math.max(30, eA(E.t, NOW_Y)), 0.5, 9);
  o.b = eA(E.b, yr) * 1000; o.pop = e5(E.p, yr);
  o.ppp = Math.max(250, c.ppp * eraGdp(c, E, yr));
  if (E.u) o.urb = clamp(c.urb + (e5(E.u, yr) - e5(E.u, NOW_Y)) / 10, 1, 99);
  eraSchool(o, c, E, yr);
  o.agr = eraAgr(c, o.ppp);
  o.net = clamp(eraNet(c, yr), 0, 99);
  o.hiv = eraHiv(c, yr);
  o.war = eraWar(c, yr);
  { const r = warAt(c.id, Math.min(yr, ERA_PAST1)); if (o.war > 0 && r) { o.wn = WAR_N[r[6]]; o.wHost = r[5]; o.wd = yr < NOW_Y ? r[4] : (DISP[c.id] || 0) * 0.035 * o.war / Math.max(0.1, c.war); } else { o.wn = null; o.wHost = null; o.wd = 0; } }
  eraCrisis(o, c, E, yr);
  if (yr < NOW_Y) { o.cs = eraCS(c, yr); if (eraClosed(c.id, yr)) o.mig = ''; o.rel = eraRel(c, yr); }
  o.du5 = Math.max(0, o.u5 - c.u5);
  const ck = clamp(o.u5 / Math.max(1, c.u5), 0.1, 12);
  o.mmr = c.mmr * Math.pow(ck, 0.9); if (c.mal) o.mal = clamp(c.mal * Math.pow(ck, 0.5), 0, 2);
  if (yr < NOW_Y) { const t = clamp((NOW_Y - yr) / 45, 0, 1); o.sm = c.sm + (Math.max(c.sm, c.p === 'hi' || c.p === 'eca' || c.p === 'eap' ? 60 : 45) - c.sm) * t; if (['hi', 'eca', 'lac'].includes(c.p)) o.sf = c.sf * (1 + 0.8 * t); }
  else { o.sm = c.sm * Math.pow(0.985, yr - NOW_Y); o.sf = c.sf * Math.pow(0.985, yr - NOW_Y); }
  if (c.cm) o.cm = yr < NOW_Y ? Math.min(85, c.cm * (1 + (NOW_Y - yr) / 45)) : c.cm * Math.pow(0.975, yr - NOW_Y);
  if (yr < NOW_Y && (c.p === 'hi' || c.p === 'eca')) o.road = Math.round(c.road * (yr < 1960 ? 1.8 : 1 + 1.4 * clamp((2010 - yr) / 40, 0, 1)) * 10) / 10;
  const r1 = x => Math.round(x * 10) / 10;
  o.le = r1(o.le); o.gap = r1(o.gap); o.u5 = r1(o.u5); o.im = r1(o.im); o.tfr = Math.round(o.tfr * 100) / 100; o.ppp = Math.round(o.ppp);
  o.urb = Math.round(o.urb); o.ter = Math.round(o.ter); o.eys = r1(o.eys); o.agr = Math.round(o.agr); o.net = Math.round(o.net); o.mmr = Math.round(o.mmr);
  o.sm = Math.round(o.sm); o.sf = Math.round(o.sf); if (o.cm != null) o.cm = r1(o.cm); if (o.hiv) o.hiv = Math.round(o.hiv * 100) / 100;
  return (ERA_CC[key] = o);
}
const eraYr = () => S && S.era && S.era !== 'now' && eraLoaded() ? (S.by || NOW_Y) + S.age : null;
const eraY = a => (S.by || NOW_Y) + a;
const ERA_WAR = [
  ['KOR', 1950, 1953, 5, 0.12, '', 'kw'], ['PRK', 1950, 1953, 5, 0.06, '', 'kw'],
  ['VNM', 1950, 1954, 1.5, 0.02, '', 'indo'], ['VNM', 1955, 1964, 1, 0.01, '', 'vnw'], ['VNM', 1965, 1975, 3, 0.05, '', 'vnw'], ['VNM', 1979, 1979, 0.5, 0.01, '', 'sinovn'],
  ['LAO', 1959, 1975, 1.5, 0.03, 'THA', 'laow'], ['KHM', 1970, 1975, 2.5, 0.06, 'THA', 'khw'], ['KHM', 1975, 1978, 3, 0, '', 'khm'], ['KHM', 1979, 1991, 1, 0.03, 'THA', 'khw2'],
  ['LKA', 1983, 2009, 1, 0.01, 'IND', 'lkw'], ['NPL', 1996, 2006, 0.4, 0.005, '', 'npw'],
  ['AFG', 1978, 1989, 3, 0.08, 'PAK,IRN', 'afw1'], ['AFG', 1990, 2001, 2, 0.05, 'PAK,IRN', 'afw2'], ['AFG', 2002, 2021, 1.2, 0.02, 'PAK,IRN,DEU', 'afw3'],
  ['BGD', 1971, 1971, 5, 0.3, 'IND', 'bdw'], ['PAK', 1971, 1971, 0.5, 0, '', 'bdw'],
  ['MYS', 1950, 1960, 0.3, 0, '', 'mye'], ['PHL', 1972, 1990, 0.3, 0.003, '', 'phm'],
  ['MMR', 1950, 2020, 0.4, 0.003, 'THA', 'mmw'], ['MMR', 2021, 2025, 1.5, 0.02, 'BGD,THA,MYS', 'mmw'],
  ['DZA', 1954, 1962, 3, 0.06, 'MAR,TUN', 'dzw'], ['DZA', 1992, 2002, 1.5, 0.005, '', 'dzw2'],
  ['EGY', 1956, 1956, 0.3, 0, '', 'suez'], ['EGY', 1967, 1967, 0.5, 0.01, '', 'w67'], ['EGY', 1973, 1973, 0.5, 0, '', 'w73'],
  ['SYR', 1967, 1967, 0.5, 0.01, '', 'w67'], ['SYR', 1973, 1973, 0.5, 0, '', 'w73'], ['SYR', 2011, 2024, 3, 0.08, 'TUR,LBN,JOR,DEU', 'syw'], ['SYR', 2025, 2025, 1, 0.01, 'TUR,LBN', 'syw'],
  ['JOR', 1967, 1967, 0.5, 0, '', 'w67'], ['JOR', 1970, 1971, 0.5, 0, '', 'bsep'],
  ['ISR', 1956, 1956, 0.3, 0, '', 'suez'], ['ISR', 1967, 1967, 0.5, 0, '', 'w67'], ['ISR', 1973, 1973, 1, 0, '', 'w73'], ['ISR', 1982, 1982, 0.3, 0, '', 'lbw82'], ['ISR', 2006, 2006, 0.3, 0, '', 'lbw06'], ['ISR', 2023, 2025, 0.6, 0.01, '', 'gaza23'],
  ['PSE', 1967, 1967, 1, 0.1, 'JOR', 'w67'], ['PSE', 1987, 1993, 0.5, 0, '', 'int1'], ['PSE', 2000, 2005, 1, 0, '', 'int2'], ['PSE', 2008, 2009, 1.5, 0.02, '', 'gaza08'], ['PSE', 2014, 2014, 1.5, 0.03, '', 'gaza14'], ['PSE', 2023, 2025, 5, 0.3, '', 'gaza23'],
  ['LBN', 1975, 1990, 2.5, 0.04, 'SYR,FRA,CAN', 'lbw'], ['LBN', 2006, 2006, 1, 0.05, 'SYR', 'lbw06'],
  ['IRN', 1980, 1988, 2, 0.008, '', 'iiw'], ['IRQ', 1961, 1970, 0.5, 0.005, '', 'kurd'], ['IRQ', 1974, 1975, 0.5, 0.005, '', 'kurd'], ['IRQ', 1980, 1988, 2.5, 0.01, 'IRN', 'iiw'],
  ['IRQ', 1991, 1991, 2, 0.05, 'TUR,IRN', 'gulf'], ['IRQ', 2003, 2011, 2.5, 0.03, 'SYR,JOR', 'iqw'], ['IRQ', 2014, 2017, 2, 0.04, 'TUR', 'isw'], ['KWT', 1990, 1991, 2, 0.2, 'SAU,EGY', 'gulf'],
  ['YEM', 1962, 1970, 1.5, 0.01, 'SAU', 'yew1'], ['YEM', 1986, 1986, 1, 0.01, '', 'yew86'], ['YEM', 1994, 1994, 0.5, 0, '', 'yew94'], ['YEM', 2015, 2025, 2, 0.03, 'SAU,OMN,SOM', 'yew'],
  ['OMN', 1963, 1976, 0.3, 0, '', 'dhofar'], ['LBY', 2011, 2011, 2, 0.03, 'TUN,EGY', 'lyw'], ['LBY', 2014, 2020, 1, 0.02, 'TUN,EGY', 'lyw'], ['TUR', 1984, 1999, 0.3, 0.002, '', 'pkk'],
  ['SRB', 1991, 1995, 0.3, 0, '', 'yuw'], ['SRB', 1998, 1999, 1.5, 0.03, '', 'kosw'], ['HUN', 1956, 1956, 1, 0.02, 'AUT', 'hun56'],
  ['AZE', 1988, 1994, 1.5, 0.03, '', 'nkw'], ['AZE', 2020, 2020, 0.5, 0, '', 'nkw2'], ['GEO', 1991, 1993, 1.5, 0.02, '', 'geow'], ['GEO', 2008, 2008, 0.5, 0.02, '', 'ruge'],
  ['TJK', 1992, 1997, 2.5, 0.05, 'AFG,RUS', 'tjw'], ['RUS', 1994, 1996, 0.5, 0.002, '', 'chw1'], ['RUS', 1999, 2009, 0.4, 0.002, '', 'chw2'], ['RUS', 2022, 2025, 0.6, 0, '', 'uaw'],
  ['UKR', 2014, 2021, 0.5, 0.01, '', 'donw'], ['UKR', 2022, 2025, 2, 0.08, 'POL,DEU,CZE,SVK', 'uaw'],
  ['AGO', 1961, 1974, 1, 0.01, 'COD', 'agw1'], ['AGO', 1975, 2002, 2, 0.03, 'COD,ZMB', 'agw'],
  ['MOZ', 1964, 1974, 1, 0.01, 'TZA', 'mzw1'], ['MOZ', 1977, 1992, 2.5, 0.05, 'MWI,ZWE', 'mzw'], ['MOZ', 2017, 2025, 0.3, 0.005, '', 'cabo'],
  ['GNB', 1963, 1974, 1.5, 0.01, 'SEN', 'gbw1'], ['GNB', 1998, 1999, 1, 0.05, '', 'gbw'], ['ZWE', 1972, 1979, 1.2, 0.01, 'MOZ,ZMB', 'rhw'], ['NAM', 1966, 1989, 0.5, 0.005, 'AGO,ZMB', 'naw'],
  ['NGA', 1967, 1970, 3, 0.08, '', 'biaf'], ['NGA', 2009, 2025, 0.5, 0.01, 'CMR,NER,TCD', 'boko'],
  ['COD', 1960, 1965, 1.5, 0.02, '', 'cgcr'], ['COD', 1996, 1997, 2, 0.03, 'TZA,UGA', 'cgw1'], ['COD', 1998, 2003, 3, 0.04, 'TZA,UGA,ZMB', 'cgw2'], ['COD', 2004, 2025, 1, 0.03, 'UGA,RWA,BDI', 'kivu'],
  ['COG', 1993, 1994, 1, 0.02, '', 'cgow'], ['COG', 1997, 1999, 1.5, 0.05, '', 'cgow'],
  ['CAF', 2004, 2007, 0.5, 0.01, 'TCD,CMR', 'cafw'], ['CAF', 2012, 2025, 1.5, 0.04, 'CMR,TCD,COD', 'cafw'],
  ['TCD', 1965, 1979, 1, 0.01, 'CMR', 'tcw'], ['TCD', 1980, 1990, 1.5, 0.01, 'CMR,CAF', 'tcw'], ['TCD', 2005, 2010, 1, 0.01, '', 'tcw'],
  ['CMR', 1955, 1964, 1, 0.01, '', 'upc'], ['CMR', 2014, 2025, 0.4, 0.01, 'NGA', 'cmw'],
  ['CIV', 2002, 2007, 1, 0.03, 'LBR,GHA', 'civw'], ['CIV', 2010, 2011, 1, 0.03, 'LBR', 'civw2'],
  ['LBR', 1989, 1997, 3, 0.15, 'GIN,CIV,SLE', 'lbrw'], ['LBR', 1999, 2003, 2.5, 0.1, 'GIN,CIV,SLE', 'lbrw'], ['SLE', 1991, 2002, 2.5, 0.1, 'GIN,LBR', 'slw'],
  ['MLI', 1990, 1995, 0.3, 0.005, 'MRT,BFA', 'tuar'], ['MLI', 2012, 2025, 1, 0.02, 'MRT,NER,BFA', 'mlw'], ['NER', 2015, 2025, 0.5, 0.01, 'NGA', 'sahel'], ['BFA', 2015, 2025, 1.5, 0.03, 'MLI,CIV,NER', 'sahel'],
  ['ETH', 1974, 1991, 2, 0.01, 'SDN,SOM,KEN', 'ethw'], ['ETH', 1998, 2000, 1, 0, '', 'eew'], ['ETH', 2020, 2025, 1, 0.02, 'SDN', 'tigw'],
  ['ERI', 1961, 1991, 1.5, 0.02, 'SDN', 'erw'], ['ERI', 1998, 2000, 2, 0.05, '', 'eew'],
  ['SOM', 1977, 1978, 0.5, 0, '', 'ogw'], ['SOM', 1988, 1992, 3, 0.08, 'KEN,ETH,YEM', 'sow'], ['SOM', 1993, 2005, 1.5, 0.03, 'KEN,ETH,YEM', 'sow'], ['SOM', 2006, 2012, 2.5, 0.06, 'KEN,ETH,YEM', 'sow'], ['SOM', 2013, 2025, 1.5, 0.03, 'KEN,ETH', 'sow'],
  ['SDN', 1955, 1972, 0.3, 0.003, 'UGA', 'sdw1'], ['SDN', 1983, 2005, 1, 0.01, 'ETH,UGA,KEN', 'sdw2'], ['SDN', 2003, 2010, 1.5, 0.03, 'TCD', 'darf'], ['SDN', 2023, 2025, 3, 0.1, 'TCD,EGY,SSD', 'sdw4'],
  ['SSD', 1955, 1972, 3, 0.03, 'UGA,COD', 'sdw1'], ['SSD', 1983, 2005, 3.5, 0.04, 'ETH,UGA,KEN', 'sdw2'], ['SSD', 2013, 2020, 3.5, 0.08, 'UGA,SDN,ETH,KEN', 'ssw'], ['SSD', 2021, 2025, 1, 0.02, 'UGA,SDN', 'ssw'],
  ['UGA', 1971, 1979, 1.5, 0.01, 'KEN,TZA', 'amin'], ['UGA', 1981, 1986, 2, 0.03, '', 'bush'], ['UGA', 1987, 2006, 1, 0.02, '', 'lra'],
  ['RWA', 1990, 1994, 1.5, 0.05, 'COD,TZA,BDI', 'rwaw'], ['RWA', 1995, 2000, 0.5, 0.01, '', 'rwaw'], ['BDI', 1972, 1972, 2, 0.05, 'TZA,RWA', 'bdi72'], ['BDI', 1993, 2005, 2, 0.04, 'TZA,RWA,COD', 'bdw2'],
  ['ZAF', 1984, 1994, 0.3, 0.002, '', 'apw'], ['MRT', 1975, 1978, 0.3, 0, '', 'wsw'], ['MAR', 1975, 1991, 0.2, 0, '', 'wsw'],
  ['COL', 1950, 1958, 1.5, 0.01, '', 'viol'], ['COL', 1964, 1997, 1, 0.01, 'ECU,VEN', 'colw'], ['COL', 1998, 2002, 1.5, 0.02, 'ECU,VEN', 'colw'], ['COL', 2003, 2016, 1, 0.01, 'ECU,VEN', 'colw'],
  ['SLV', 1979, 1992, 2.5, 0.04, 'USA,GTM', 'slvw'], ['GTM', 1960, 1977, 1, 0.01, 'MEX', 'gtmw'], ['GTM', 1978, 1984, 2.5, 0.03, 'MEX', 'gtmw'], ['GTM', 1985, 1996, 1, 0.01, 'MEX', 'gtmw'],
  ['NIC', 1978, 1979, 2.5, 0.04, 'CRI,HND', 'nicr'], ['NIC', 1981, 1990, 1.5, 0.02, 'HND,CRI', 'contra'], ['PER', 1980, 2000, 0.8, 0.005, '', 'sendero'],
  ['CUB', 1956, 1959, 0.5, 0, '', 'cubr'], ['DOM', 1965, 1965, 0.5, 0, '', 'domw'], ['HND', 1969, 1969, 0.3, 0.01, '', 'footw'], ['SLV', 1969, 1969, 0.3, 0, '', 'footw'],
  ['HTI', 2021, 2025, 0.5, 0.01, '', 'gang'], ['ARG', 1982, 1982, 0.1, 0, '', 'falk'],
  ['HRV', 1991, 1995, 1.5, 0.03, 'DEU,AUT', 'hrw'], ['BIH', 1992, 1995, 3, 0.15, 'DEU,AUT,HRV,SWE,USA', 'bhw'], ['XKX', 1998, 1999, 3, 0.3, 'ALB,MKD,DEU', 'kosw'],
  ['MKD', 2001, 2001, 0.5, 0.01, '', 'mkw'], ['ARM', 1988, 1994, 1.5, 0.02, '', 'nkw'], ['ARM', 2020, 2020, 1, 0, '', 'nkw2'], ['MDA', 1992, 1992, 0.5, 0.01, '', 'tnw'],
  ['CYP', 1974, 1974, 2, 0.02, 'GBR,GRC', 'cyw'], ['TLS', 1975, 1999, 1.5, 0.01, 'AUS,PRT', 'tlw'], ['SLB', 1998, 2003, 0.5, 0.005, '', 'slbw'],
  ['DJI', 1991, 1994, 0.8, 0.01, 'ETH', 'djw'], ['SUR', 1986, 1992, 0.8, 0.02, 'FRA,NLD', 'surw'], ['ALB', 1997, 1997, 1, 0.01, 'ITA,GRC', 'alb97'],
];
const WAR_N = {
  kw: "Chiến tranh Triều Tiên", indo: "Chiến tranh Đông Dương lần thứ nhất", vnw: "Chiến tranh Việt Nam", sinovn: "Chiến tranh biên giới Việt–Trung", laow: "Nội chiến Lào", khw: "Nội chiến Campuchia", khm: "Cuộc thảm sát của Khmer Đỏ",
  khw2: "Nội chiến Campuchia", lkw: "Nội chiến Sri Lanka", npw: "Nội chiến Nepal", afw1: "Chiến tranh Liên Xô–Afghanistan", afw2: "Nội chiến Afghanistan", afw3: "Chiến tranh Afghanistan",
  bdw: "Chiến tranh giải phóng Bangladesh", mye: "Tình trạng khẩn cấp Malaya", phm: "Xung đột Mindanao", mmw: "Nội chiến Myanmar", dzw: "Chiến tranh giành độc lập Algeria", dzw2: "Nội chiến Algeria", suez: "Chiến tranh Suez",
  w67: "Chiến tranh Sáu ngày", w73: "Chiến tranh Yom Kippur", syw: "Nội chiến Syria", bsep: "Nội chiến Jordan", lbw82: "Chiến tranh Liban năm 1982", lbw06: "Chiến tranh Liban năm 2006", gaza23: "Chiến tranh Gaza năm 2023",
  int1: "Intifada lần thứ nhất", int2: "Intifada lần thứ hai", gaza08: "Chiến tranh Gaza năm 2008", gaza14: "Chiến tranh Gaza năm 2014", lbw: "Nội chiến Liban", iiw: "Chiến tranh Iran–Iraq", kurd: "Chiến tranh người Kurd", gulf: "Chiến tranh Vùng Vịnh",
  iqw: "Chiến tranh Iraq", isw: "Cuộc chiến chống IS", yew1: "Nội chiến Bắc Yemen", yew86: "Nội chiến Nam Yemen", yew94: "Nội chiến Yemen", yew: "Nội chiến Yemen", dhofar: "Chiến tranh Dhofar", lyw: "Nội chiến Libya", pkk: "Xung đột người Kurd",
  yuw: "Các cuộc chiến tranh Nam Tư", kosw: "Chiến tranh Kosovo", hun56: "Cách mạng Hungary", nkw: "Chiến tranh Nagorno-Karabakh", nkw2: "Chiến tranh Nagorno-Karabakh lần thứ hai", geow: "Nội chiến Gruzia", ruge: "Chiến tranh Nga–Gruzia",
  tjw: "Nội chiến Tajikistan", chw1: "Chiến tranh Chechnya lần thứ nhất", chw2: "Chiến tranh Chechnya lần thứ hai", uaw: "Chiến tranh Nga–Ukraine", donw: "Chiến tranh ở Donbas", agw1: "Chiến tranh giành độc lập Angola", agw: "Nội chiến Angola",
  mzw1: "Chiến tranh giành độc lập Mozambique", mzw: "Nội chiến Mozambique", cabo: "Xung đột ở Cabo Delgado", gbw1: "Chiến tranh giành độc lập Guinea-Bissau", gbw: "Nội chiến Guinea-Bissau", rhw: "Chiến tranh du kích Rhodesia", naw: "Chiến tranh giành độc lập Namibia",
  biaf: "Chiến tranh Biafra", boko: "Xung đột với Boko Haram", cgcr: "Khủng hoảng Congo", cgw1: "Chiến tranh Congo lần thứ nhất", cgw2: "Chiến tranh Congo lần thứ hai", kivu: "Xung đột ở miền đông Congo", cgow: "Nội chiến Cộng hòa Congo",
  cafw: "Nội chiến Cộng hòa Trung Phi", tcw: "Nội chiến Chad", upc: "Cuộc đấu tranh giành độc lập của Cameroon", cmw: "Xung đột ở Cameroon", civw: "Nội chiến Bờ Biển Ngà", civw2: "Khủng hoảng bầu cử ở Bờ Biển Ngà", lbrw: "Nội chiến Liberia",
  slw: "Nội chiến Sierra Leone", tuar: "Cuộc nổi dậy của người Tuareg", mlw: "Xung đột ở Mali", sahel: "Xung đột ở vùng Sahel", ethw: "Nội chiến Ethiopia", eew: "Chiến tranh Ethiopia–Eritrea", tigw: "Chiến tranh Tigray",
  erw: "Chiến tranh giành độc lập Eritrea", ogw: "Chiến tranh Ogaden", sow: "Nội chiến Somalia", sdw1: "Nội chiến Sudan lần thứ nhất", sdw2: "Nội chiến Sudan lần thứ hai", darf: "Xung đột Darfur", sdw4: "Nội chiến Sudan", ssw: "Nội chiến Nam Sudan",
  amin: "Bạo lực dưới chế độ Idi Amin", bush: "Nội chiến Uganda", lra: "Xung đột với Quân kháng chiến của Chúa", rwaw: "Nội chiến Rwanda", bdi72: "Vụ thảm sát năm 1972 ở Burundi", bdw2: "Nội chiến Burundi", apw: "Bạo lực chính trị những năm cuối của chế độ apartheid",
  wsw: "Chiến tranh Tây Sahara", viol: "Thời kỳ bạo lực La Violencia", colw: "Nội chiến Colombia", slvw: "Nội chiến El Salvador", gtmw: "Nội chiến Guatemala", nicr: "Cách mạng Nicaragua", contra: "Chiến tranh Contra", sendero: "Xung đột với nhóm Con đường Sáng",
  cubr: "Cách mạng Cuba", domw: "Nội chiến Cộng hòa Dominica", footw: "Chiến tranh bóng đá", gang: "Bạo lực băng đảng", falk: "Chiến tranh Falklands",
  hrw: "Chiến tranh giành độc lập Croatia", bhw: "Chiến tranh Bosnia", mkw: "Xung đột Macedonia năm 2001", tnw: "Chiến tranh Transnistria", cyw: "Chiến tranh Síp năm 1974",
  tlw: "Việc Indonesia chiếm đóng Đông Timor", slbw: "Xung đột sắc tộc ở Quần đảo Solomon", djw: "Nội chiến Djibouti", surw: "Cuộc chiến vùng nội địa Suriname", alb97: "Tình trạng bất ổn ở Albania năm 1997",
};
const ERA_CRISIS = [
  ['CHN', 1959, 1961, 'f', 'gfam', 0], ['PRK', 1995, 2000, 'f', 'arduous', 0], ['KHM', 1975, 1978, 'g', 'khm', 0], ['KHM', 1979, 1979, 'f', 'khf', 0], ['RWA', 1994, 1994, 'g', 'rwag', 0],
  ['BDI', 1972, 1972, 'g', 'bdi72', 0], ['BDI', 1993, 1993, 'g', 'bdi93', 0], ['BGD', 1970, 1970, 's', 'bhola', 0], ['BGD', 1974, 1974, 'f', 'bgdf', 0.04], ['BGD', 1991, 1991, 's', 'bgd91', 0],
  ['ETH', 1957, 1958, 'f', 'tigf', 0], ['ERI', 1957, 1958, 'f', 'tigf', 0], ['ETH', 1973, 1974, 'f', 'wollo', 0.03], ['ETH', 1983, 1985, 'f', 'ethf', 0], ['ERI', 1983, 1985, 'f', 'ethf', 0],
  ['SOM', 1991, 1992, 'f', 'somf', 0], ['SOM', 2011, 2011, 'f', 'somf11', 0], ['NGA', 1968, 1969, 'f', 'biaff', 0], ['SDN', 1984, 1985, 'f', 'sdnf', 0], ['SSD', 1988, 1988, 'f', 'bahr', 0], ['SSD', 1998, 1998, 'f', 'bahr', 0],
  ['NER', 1973, 1974, 'f', 'sahelf', 0.03], ['MLI', 1973, 1974, 'f', 'sahelf', 0.03], ['TCD', 1973, 1974, 'f', 'sahelf', 0.03], ['MRT', 1973, 1974, 'f', 'sahelf', 0.03], ['BFA', 1973, 1974, 'f', 'sahelf', 0.03],
  ['HTI', 2010, 2010, 'q', 'htiq', 0], ['PER', 1970, 1970, 'q', 'ancash', 0], ['NIC', 1972, 1972, 'q', 'managua', 0], ['GTM', 1976, 1976, 'q', 'gtmq', 0], ['CHN', 1976, 1976, 'q', 'tangshan', 0.03],
  ['PAK', 2005, 2005, 'q', 'kashq', 0.05], ['TUR', 1999, 1999, 'q', 'izmit', 0.04], ['TUR', 2023, 2023, 'q', 'tq23', 0.1], ['IRN', 1990, 1990, 'q', 'manjil', 0.08], ['IRN', 2003, 2003, 'q', 'bam', 0.07],
  ['NPL', 2015, 2015, 'q', 'nepq', 0.04], ['JPN', 2011, 2011, 'q', 'tohoku', 0.015], ['CHN', 2008, 2008, 'q', 'sichuan', 0.009],
  ['HND', 1974, 1974, 's', 'fifi', 0], ['HND', 1998, 1998, 's', 'mitch', 0], ['NIC', 1998, 1998, 's', 'mitch', 0], ['MMR', 2008, 2008, 's', 'nargis', 0],
  ['LKA', 2004, 2004, 't', 'tsun', 0], ['IDN', 2004, 2004, 't', 'tsun', 0.03],
  ['IDN', 1965, 1966, 'g', 'idn65', 0], ['GTM', 1981, 1983, 'g', 'gtmg', 0], ['SYR', 1982, 1982, 'g', 'hama', 0], ['IRQ', 1988, 1988, 'g', 'anfal', 0], ['GNQ', 1969, 1979, 'g', 'macias', 0], ['UGA', 1971, 1979, 'g', 'amin', 0.03],
  ['BIH', 1995, 1995, 'g', 'srebrenica', 0], ['ARM', 1988, 1988, 'q', 'spitak', 0], ['TLS', 1977, 1979, 'f', 'tlf', 0], ['PRI', 2017, 2017, 's', 'maria', 0.05], ['MDV', 2004, 2004, 't', 'tsun', 0.05],
];
const CRISIS_N = {
  gfam: "Nạn đói lớn sau Đại nhảy vọt", arduous: "Hành quân gian khổ (nạn đói lớn)", khm: "Cuộc thảm sát của Khmer Đỏ", khf: "Nạn đói năm 1979 ở Campuchia", rwag: "Cuộc diệt chủng người Tutsi ở Rwanda", bdi72: "Vụ thảm sát năm 1972 ở Burundi", bdi93: "Vụ thảm sát năm 1993 ở Burundi",
  bhola: "Bão xoáy Bhola", bgdf: "Nạn đói năm 1974 ở Bangladesh", bgd91: "Bão xoáy năm 1991 ở Bangladesh", tigf: "Nạn đói năm 1958 ở Tigray", wollo: "Nạn đói Wollo", ethf: "Nạn đói ở Ethiopia những năm 1983–85",
  somf: "Nạn đói năm 1992 ở Somalia", somf11: "Nạn đói năm 2011 ở Somalia", biaff: "Nạn đói Biafra", sdnf: "Nạn đói năm 1984 ở Sudan", bahr: "Nạn đói Bahr el Ghazal", sahelf: "Đại hạn hán và nạn đói vùng Sahel",
  htiq: "Trận động đất lớn ở Haiti", ancash: "Trận động đất Ancash", managua: "Trận động đất Managua", gtmq: "Trận động đất ở Guatemala", tangshan: "Trận động đất lớn ở Đường Sơn", kashq: "Trận động đất Kashmir", izmit: "Trận động đất İzmit", tq23: "Trận động đất lớn ở Thổ Nhĩ Kỳ",
  manjil: "Trận động đất Manjil", bam: "Trận động đất Bam", nepq: "Trận động đất lớn ở Nepal", tohoku: "Trận động đất lớn ở miền Đông Nhật Bản", sichuan: "Trận động đất lớn ở Tứ Xuyên", fifi: "Bão Fifi", mitch: "Bão Mitch", nargis: "Bão Nargis",
  tsun: "Sóng thần Ấn Độ Dương", srebrenica: "Cuộc diệt chủng Srebrenica", spitak: "Trận động đất lớn ở Spitak", tlf: "Nạn đói trong những năm đầu Đông Timor bị chiếm đóng", maria: "Bão Maria", idn65: "Các vụ thảm sát ở Indonesia những năm 1965–66", gtmg: "Cuộc diệt chủng người Maya", hama: "Vụ thảm sát Hama", anfal: "Chiến dịch Anfal (cuộc thảm sát người Kurd)", macias: "Các vụ thảm sát dưới chế độ Macías Nguema", amin: "Các vụ thảm sát dưới chế độ Idi Amin",
};
const ERA_CS = {
  USA: [[1950, 1973, [24, 0, 's']]], GBR: [[1950, 1960, [24, 0, 'u']]], FRA: [[1950, 1970, [18, 0, 'u']], [1971, 1996, [12, 0, 'u']]], DEU: [[1957, 2010, [12, 0, 'u']]],
  ITA: [[1950, 2004, [12, 0, 'u']]], ESP: [[1950, 2001, [12, 0, 'u']]], PRT: [[1950, 1960, [18, 0, 'u']], [1961, 1974, [36, 0, 'u']], [1975, 2004, [12, 0, 'u']]], NLD: [[1950, 1996, [12, 0, 'u']]],
  BEL: [[1950, 1994, [12, 0, 'u']]], SWE: [[1950, 2009, [10, 0, 'u']], [2010, 2017, null]], NOR: [[1950, 2014, [12, 0, 's']]], DNK: [[1950, 1990, [12, 0, 's']]], GRC: [[1950, 1990, [24, 0, 'u']]],
  POL: [[1950, 2008, [18, 0, 'u']]], CZE: [[1950, 2004, [18, 0, 'u']]], SVK: [[1950, 2005, [18, 0, 'u']]], HUN: [[1950, 2004, [18, 0, 'u']]], ROU: [[1950, 2006, [16, 0, 'u']]],
  BGR: [[1950, 2007, [24, 0, 'u']]], SRB: [[1950, 2010, [12, 0, 'u']]], RUS: [[1950, 1991, [24, 0, 'u']], [1992, 2007, [24, 0, 'u']]], UKR: [[1950, 1991, [24, 0, 'u']]], BLR: [[1950, 1991, [24, 0, 'u']]],
  KAZ: [[1950, 1991, [24, 0, 'u']]], KGZ: [[1950, 2025, [24, 0, 'u']]], TJK: [[1950, 2025, [24, 0, 'u']]], TKM: [[1950, 1991, [24, 0, 'u']]], UZB: [[1950, 1991, [24, 0, 'u']]],
  AZE: [[1950, 1991, [24, 0, 'u']]], GEO: [[1950, 1991, [24, 0, 'u']]], KOR: [[1950, 1977, [36, 0, 'u']], [1978, 1989, [30, 0, 'u']], [1990, 2003, [26, 0, 'u']], [2004, 2011, [24, 0, 'u']], [2012, 2019, [21, 0, 'u']]],
  TWN: [[1950, 2000, [24, 0, 'u']], [2013, 2023, [4, 0, 'u']]], SGP: [[1950, 1966, null]], MMR: [[1950, 2023, null]], ERI: [[1950, 1993, null]], KWT: [[2002, 2016, null]], QAT: [[1950, 2013, null]],
  ARE: [[1950, 2013, null]], MAR: [[2007, 2018, null]], ARG: [[1950, 1994, [12, 0, 'u']]], AUS: [[1951, 1959, [6, 0, 'u']], [1965, 1972, [24, 0, 's']]], NZL: [[1950, 1972, [3, 0, 'u']]],
  EST: [[1950, 1991, [24, 0, 'u']], [1992, 2010, [12, 0, 'u']]], LVA: [[1950, 1991, [24, 0, 'u']], [1992, 2006, [12, 0, 'u']], [2007, 2023, null]],
  LTU: [[1950, 1991, [24, 0, 'u']], [1992, 2008, [12, 0, 'u']], [2009, 2014, null]], ARM: [[1950, 1991, [24, 0, 'u']]], MDA: [[1950, 1991, [24, 0, 'u']]],
  HRV: [[1950, 1990, [12, 0, 'u']], [1991, 2007, [10, 0, 'u']]], SVN: [[1950, 1990, [12, 0, 'u']], [1991, 2003, [7, 0, 'u']]], BIH: [[1950, 1991, [12, 0, 'u']], [1992, 2005, [6, 0, 'u']]],
  MNE: [[1950, 2005, [12, 0, 'u']]], MKD: [[1950, 2005, [12, 0, 'u']]], XKX: [[1950, 1990, [12, 0, 'u']]], ALB: [[1950, 1991, [24, 0, 'u']], [1992, 2009, [12, 0, 'u']]],
  CYP: [[1950, 1963, null], [1964, 2015, [24, 0, 'u']]],
};
const ERA_POL = ('RUS,UKR,BLR,KAZ,KGZ,TJK,TKM,UZB,AZE,GEO:1950-1990:o POL,CZE,SVK,HUN,ROU,BGR:1950-1989:o SRB:1950-1990:o MNG:1950-1990:o ESP:1950-1976:o PRT:1950-1975:o GRC:1967-1974:o '
  + 'CHL:1973-1989:o ARG:1966-1972:o ARG:1976-1983:o BRA:1964-1985:l URY:1973-1984:o PRY:1954-1988:o BOL:1964-1982:o PER:1968-1980:o ECU:1972-1979:o HND:1963-1981:o GTM:1954-1985:l SLV:1950-1983:l '
  + 'NIC:1950-1979:o DOM:1950-1961:o HTI:1957-1990:o PAN:1968-1989:o KOR:1961-1963:o KOR:1972-1987:l TWN:1950-1991:o TWN:1992-1995:l IDN:1966-1998:l PHL:1972-1986:o MMR:1962-2010:o THA:1958-1973:o '
  + 'THA:2014-2019:o KHM:1975-1993:o PAK:1958-1971:o PAK:1977-1988:o BGD:1975-1990:l NPL:1960-1990:o AFG:1950-2004:n AFG:2021-2025:n IRN:1953-1979:l IRQ:1958-2004:o SYR:1963-2024:o SYR:2025-2025:n '
  + 'EGY:1952-2004:l TUN:1956-2010:l DZA:1962-1990:o LBY:1969-2011:n YEM:1962-1990:o KEN:1969-1991:o TZA:1962-1992:o ZMB:1972-1991:o MWI:1964-1993:o MOZ:1975-1993:o AGO:1975-1991:o '
  + 'ETH:1950-1973:n ETH:1974-1991:o SOM:1969-1991:o SOM:1992-2025:n SDN:1958-1964:o SDN:1969-1985:o SDN:1989-2025:o SSD:2011-2025:n UGA:1971-1985:n RWA:1973-1993:o BDI:1966-1993:o COD:1965-1990:o '
  + 'COG:1963-1991:o CAF:1962-1993:o TCD:1962-1996:o CMR:1966-1990:o GAB:1968-1990:o GNQ:1968-2025:o CIV:1960-1990:o GHA:1964-1966:o GHA:1972-1992:o NGA:1966-1979:o NGA:1984-1998:o SEN:1966-1976:o '
  + 'GIN:1958-1993:o GNB:1974-1994:o SLE:1978-1996:o LBR:1980-1990:o MLI:1968-1991:o BFA:1966-1991:o NER:1974-1993:o MRT:1960-1991:o BEN:1972-1990:o TGO:1967-1993:o MDG:1975-1992:o '
  + 'EST,LVA,LTU,ARM,MDA:1950-1990:o HRV,SVN,BIH,MNE,MKD,XKX:1950-1990:o ALB:1950-1990:o CPV:1975-1990:o COM:1979-1989:o DJI:1981-1991:o SWZ:1973-2025:l '
  + 'BHR:1975-2001:n BHR:2002-2025:l MDV:1968-2007:o GUY:1978-1991:o SUR:1980-1987:o FJI:1987-1991:o FJI:2007-2013:o TLS:1976-1999:o BTN:1950-2007:n '
  + 'HKG:1950-1984:n HKG:1985-2025:l MAC:1950-1975:n MAC:1976-2025:l ZAF:1950-1993:n NAM:1950-1989:n LSO:1970-1993:o GMB:1994-2016:o').split(' ').map(s => { const [cs, yy, k] = s.split(':'), [a, b] = yy.split('-').map(Number); return [cs.split(','), a, b, k]; });
const ERA_CLOSED = [[['RUS', 'UKR', 'BLR', 'KAZ', 'KGZ', 'TJK', 'TKM', 'UZB', 'AZE', 'GEO'], 1950, 1990], [['POL', 'CZE', 'SVK', 'HUN', 'ROU', 'BGR', 'MNG'], 1950, 1989],
  [['EST', 'LVA', 'LTU', 'ARM', 'MDA'], 1950, 1990], [['ALB'], 1950, 1990],
  [['CHN'], 1950, 1978], [['VNM', 'LAO'], 1975, 1988], [['KHM'], 1975, 1991], [['CUB'], 1961, 1994], [['MMR'], 1962, 1988]];
const ERA_ECON = [
  ['hi', 1974, 1975, 'oil1', 1.5, -0.03, -0.3, -0.03, 1], ['hi', 1980, 1982, 'oil2', 1.5, -0.02, -0.1, -0.02, 1],
  ['ARG,BRA,MEX,PER,BOL,CHL,URY,VEN,ECU', 1982, 1989, 'debt', 1.6, -0.05, -0.25, -0.05, 0.8], ['BOL', 1985, 1985, 'hyper', 2, -0.1, 0, 0, 0.1], ['ARG', 1989, 1990, 'hyper', 2.5, -0.1, 0, 0, 0.3],
  ['BRA', 1990, 1990, 'collor', 2, -0.05, -0.3, 0, 0.5], ['PER', 1990, 1990, 'hyper', 2, -0.1, 0, 0, 0.3],
  ['JPN', 1986, 1990, 'jboom', 0.6, 0.03, 0.4, 0.12, 1], ['JPN', 1991, 2003, 'bubble', 1.3, 0, -0.38, -0.06, 1], ['RUS,UKR,BLR,KAZ,KGZ,TJK,TKM,UZB,AZE,GEO,ARM,MDA', 1992, 1998, 'ussr', 3, -0.15, 0, 0, 0.05], ['EST,LVA,LTU', 1992, 1994, 'ussr', 2.5, -0.12, 0, 0, 0.1], ['RUS', 1998, 1998, 'ru98', 2, -0.1, -0.8, 0, 0.6],
  ['POL,CZE,SVK,HUN,ROU,BGR,MNG,SVN', 1990, 1993, 'trans', 2.5, -0.08, 0, 0, 0.5], ['SRB,MNE,HRV,BIH,MKD,XKX', 1992, 1994, 'yugo', 3, -0.2, 0, 0, 0.05], ['MEX', 1994, 1995, 'tequila', 2, -0.07, -0.4, -0.2, 0.7],
  ['KOR,THA,MYS,PHL,HKG', 1997, 1998, 'asia', 3, -0.08, -0.5, -0.15, 1], ['IDN', 1997, 1998, 'asia', 3, -0.15, -0.6, -0.2, 0.5], ['ARG', 2001, 2002, 'corral', 3, -0.15, -0.5, -0.2, 0.4],
  ['TUR', 2001, 2001, 'tur01', 2, -0.08, -0.3, 0, 0.8], ['USA', 2001, 2002, 'dotcom', 1.3, 0, -0.2, 0, 1], ['hi', 2008, 2009, 'gfc', 2, -0.03, -0.4, -0.1, 1],
  ['GRC,ESP,PRT,IRL,ITA', 2010, 2013, 'euro', 2, -0.06, -0.2, -0.08, 1], ['ZWE', 2007, 2009, 'zim', 2, -0.3, 0, 0, 0.01], ['VEN', 2014, 2021, 'ven', 2, -0.25, 0, 0, 0.05],
  ['LBN', 2019, 2023, 'lbn', 2, -0.3, 0, 0, 0.2], ['ALB', 1997, 1997, 'pyramid', 2, -0.1, 0, 0, 0.5], ['CYP', 2012, 2014, 'cyp13', 2, -0.08, -0.5, -0.1, 0.95], ['LKA', 2022, 2022, 'lka', 2, -0.1, 0, 0, 0.6], ['*', 2020, 2020, 'covid', 2, -0.04, 0.1, 0, 1],
  ['KOR', 1986, 1988, 'kboom', 0.7, 0.03, 0, 0.04, 1], ['KOR', 2000, 2000, 'kdot', 1.3, 0, 0, 0, 1], ['KOR', 2003, 2003, 'card', 1.15, -0.01, 0, 0, 1],
  ['KOR', 2021, 2021, 'k21', 1, 0, 0, 0.1, 1], ['KOR', 2022, 2023, 'k22', 1.1, -0.02, 0, -0.08, 1], ['hi', 2022, 2022, 'infl22', 1.05, -0.03, -0.24, -0.03, 1],
  ['BRA', 2015, 2016, 'br15', 1.8, -0.04, -0.2, -0.05, 1], ['RUS', 2014, 2015, 'ru14', 1.4, -0.09, -0.15, -0.05, 0.95], ['RUS', 2022, 2022, 'ru22', 1.2, -0.02, -0.45, 0, 1],
  ['TUR', 2018, 2018, 'tur18', 1.4, -0.05, -0.3, -0.05, 0.85], ['TUR', 2022, 2023, 'tur22', 1.1, -0.04, 0, 0, 0.7], ['ARG', 2018, 2019, 'arg18', 1.5, -0.08, -0.3, -0.05, 0.85],
  ['ARG', 2023, 2024, 'arg23', 1.4, -0.12, 0, 0, 0.6], ['EGY', 2016, 2017, 'egy16', 1.3, -0.08, 0, 0, 0.8], ['NGA', 2016, 2016, 'ngn16', 1.4, -0.05, -0.15, 0, 0.9],
  ['NGA', 2023, 2024, 'ngn23', 1.2, -0.08, 0, 0, 0.8], ['PAK', 2022, 2023, 'pak22', 1.3, -0.08, 0, 0, 0.8], ['GHA', 2022, 2022, 'gha22', 1.3, -0.1, 0, 0, 0.75],
  ['IND', 2016, 2016, 'demo', 1.3, -0.01, 0, 0, 1], ['IRN', 2018, 2020, 'irn18', 1.4, -0.1, 0, 0, 0.75],
];
const ERA_YR = {
  CHN: { 1999: { h: 0.016 }, 2000: { h: 0.045 }, 2001: { h: 0.028 }, 2002: { h: 0.046 }, 2003: { h: 0.038 }, 2004: { h: 0.142 }, 2005: { h: 0.106 },
    2006: { h: 0.046 }, 2007: { h: 0.115 }, 2008: { h: -0.074 }, 2009: { h: 0.256 }, 2010: { h: 0.026 }, 2011: { h: 0.005 }, 2012: { h: 0.059 },
    2013: { h: 0.05 }, 2014: { h: -0.005 }, 2015: { h: 0.075 }, 2016: { h: 0.09 }, 2017: { h: 0.04 }, 2018: { h: 0.1 }, 2019: { h: 0.056 },
    2020: { h: 0.048 }, 2021: { h: 0.032 }, 2022: { h: -0.039 }, 2023: { h: 0.022 }, 2024: { h: -0.043 }, 2025: { h: -0.042 } },
  NLD: { 2011: { h: -0.05 }, 2012: { h: -0.09 }, 2013: { h: -0.09 }, 2014: { h: 0 }, 2015: { h: 0.02 }, 2016: { h: 0.05 }, 2017: { h: 0.06 }, 2018: { h: 0.07 },
    2019: { h: 0.04 }, 2020: { h: 0.06 }, 2021: { h: 0.12 }, 2022: { h: 0.03 }, 2023: { h: -0.06 }, 2024: { h: 0.05 }, 2025: { h: 0.05 } },
  KOR: { 1988: { h: 0.06 }, 1989: { h: 0.09 }, 1990: { h: 0.12 }, 1991: { h: -0.1 }, 1992: { h: -0.11 }, 1993: { h: -0.08 }, 1997: { l: 1.3, w: 0, h: 0 },
    1998: { l: 3, w: -0.09, h: -0.18, c: 0.04, d: 0.06 }, 2001: { h: 0.06 }, 2002: { h: 0.13 }, 2020: { h: 0.06 }, 2021: { h: 0.12 }, 2022: { h: -0.1 }, 2023: { h: -0.07 } },
  USA: { 2007: { h: -0.08 }, 2008: { h: -0.15 }, 2009: { h: -0.04 }, 2010: { h: -0.05 }, 2011: { h: -0.06 }, 2020: { h: 0.09 }, 2021: { h: 0.13 }, 2022: { h: -0.02 } },
};
const MKT_S0 = { USA: [1950, '29,13,14,-3,51,30,3,-15,38,9,-2,24,-11,20,14,9,-14,19,5,-15,-3,8,14,-21,-35,24,16,-14,-2,5,15,-15,13,17,0,26,15,0,11,24,-10,24,3,5,-3,32,18,29,25,17,-14,-16,-25,24,6,0,11,1,-41,25,12,-3,12,29,10,0,9,18,-8,28,15,21,-26,20,20,13'],
  JPN: [1960, '51,2,-6,-18,-3,11,-1,-14,28,32,-21,29,83,-26,-28,2,5,-10,19,6,0,2,1,20,13,11,41,14,38,25,-41,-7,-28,1,12,0,-3,-23,-11,37,-27,-23,-18,24,7,40,6,-11,-43,20,-2,-17,23,56,4,8,1,19,-13,18,16,5,-11,24,16,23'],
  KOR: [1980, '-15,4,-5,-6,18,15,63,87,62,-5,-29,-20,5,22,12,-18,-29,-44,39,82,-52,32,-12,25,7,50,2,29,-43,46,19,-14,7,0,-6,2,3,20,-18,8,30,1,-28,15,-11,72'] };
const MKT_S = {};
for (const k in MKT_S0) { const [y0, s] = MKT_S0[k], m = MKT_S[k] = {}; s.split(',').forEach((v, i) => { m[y0 + i] = +v / 100; }); }
const MKT_MU = 0.0788;
const eraBy = (rows, f) => { const m = {}; for (const r of rows) for (const i of f(r)) (m[i] || (m[i] = [])).push(r); return m; };
const WAR_BY = eraBy(ERA_WAR, r => [r[0]]), CRI_BY = eraBy(ERA_CRISIS, r => [r[0]]), POL_BY = eraBy(ERA_POL, r => r[0]);
const ECON_BY = eraBy(ERA_ECON, r => r[0].split(','));
const inSpan = (r, yr, i = 1) => yr >= r[i] && yr <= r[i + 1];
function warAt(iso, yr) { let b = null; for (const r of WAR_BY[iso] || []) if (inSpan(r, yr) && (!b || r[3] > b[3])) b = r; return b; }
function warSpan(iso, key) { let y0 = 9999, y1 = 0; for (const r of WAR_BY[iso] || []) if (r[6] === key) { y0 = Math.min(y0, r[1]); y1 = Math.max(y1, r[2]); } return [y0, y1]; }
function eraWar(c, yr) {
  if (yr >= NOW_Y) return c.war ? Math.round(c.war * Math.pow(0.5, (yr - NOW_Y) / 7) * 10) / 10 : 0;
  const r = warAt(c.id, yr); return r ? r[3] : 0;
}
function eraExcess(E, yr) {
  if (yr > 2024) return 0;
  const e = y => (eA(E.m, y) + eA(E.f, y)) / 20;
  let h = e(yr);
  for (let k = 1; k <= 6; k++) { const a = yr - k, b = yr + k; h = Math.max(h, a < ERA_Y0 ? e(b) - 0.45 * k : (e(a) + e(b)) / 2); }
  return clamp(1 - e(yr) / h, 0, 0.92);
}
function eraCrisis(o, c, E, yr) {
  const ex = eraExcess(E, yr), cr = (CRI_BY[c.id] || []).find(r => inSpan(r, yr));
  let ck = null, cn = null, cx = 0;
  if (cr) { ck = cr[3]; cn = CRISIS_N[cr[4]]; cx = Math.max(ex, cr[5]); }
  else if (yr >= 2020 && yr <= 2022 && ex > 0.015) { ck = 'c'; cx = ex; }
  else { const w = warAt(c.id, yr); if (w && w[3] >= 1 && ex > 0.02) { ck = 'w'; cn = WAR_N[w[6]]; cx = ex; } }
  if (ck && cx >= 0.01) { o.ck = ck; o.cx = Math.round(cx * 1000) / 1000; o.cn = cn; }
}
function eraCS(c, yr) { for (const r of ERA_CS[c.id] || []) if (yr >= r[0] && yr <= r[1]) return r[2]; return c.cs; }
const eraPolAt = (iso, yr) => { for (const r of POL_BY[iso] || []) if (inSpan(r, yr)) return r[3]; return null; };
const eraClosed = (iso, yr) => ERA_CLOSED.some(r => r[0].includes(iso) && inSpan(r, yr));
const eraOn = () => !!(S && S.era && S.era !== 'now' && eraLoaded());
const eraBefore = y => { const t = eraYr(); return t != null && t < y; };
const ERA_LIVE = { s: null, v: -1, m: {} };
function eraC(iso) {
  const base = CBY[iso]; if (!base) return base;
  const yr = (S.by || NOW_Y) + S.age, c = eraAt(base, yr), F = S.eraF;
  if (yr < NOW_Y || !F) return c;
  if (ERA_LIVE.s !== S || ERA_LIVE.v !== F.v) { ERA_LIVE.s = S; ERA_LIVE.v = F.v; ERA_LIVE.m = {}; }
  const k = iso + yr; if (ERA_LIVE.m[k]) return ERA_LIVE.m[k];
  let o = c;
  const w = (F.w[iso] || []).find(r => yr >= r[0] && yr <= r[1]);
  if (w && w[2] > c.war) o = Object.assign({}, o, { war: w[2], wd: w[3], fw: 1, wn: L`${base.ko}의 무력 분쟁`, wHost: REF_HOST[iso] || base.mig });
  if (F.pan && yr >= F.pan[0] && yr <= F.pan[1]) o = Object.assign({}, o, { ck: 'p', cx: F.pan[2] / (1 + F.pan[2]), cn: null });
  return (ERA_LIVE.m[k] = o);
}
const eraBirthC = () => eraOn() ? eraAt(CBY[S.born], S.by) : CBY[S.born];
const BB = () => eraOn() ? eraAt(CBY[S.born], S.by) : B();
const SURV_C = {};
function survL(iso, sex) {
  if (!eraOn()) return lifeTable(CBY[iso], sex).l;
  const k = iso + sex + S.by; if (SURV_C[k]) return SURV_C[k];
  const l = new Float64Array(112); l[0] = 1;
  for (let x = 0; x <= 110; x++) l[x + 1] = l[x] * (1 - lifeTable(eraAt(CBY[iso], S.by + x), sex).q[Math.min(110, x)]);
  return (SURV_C[k] = l);
}
const cohortL = (iso, sex, age) => survL(iso, sex)[Math.min(111, age)];
const ERA_W_C = {};
function eraWorldC(y) {
  if (ERA_W_C[y]) return ERA_W_C[y];
  let w = 0, le = 0, gap = 0, u5 = 0, im = 0;
  for (const c0 of COUNTRIES) { const c = eraAt(c0, y); w += c.b; le += c.b * c.le; gap += c.b * c.gap; u5 += c.b * c.u5; im += c.b * c.im; }
  return (ERA_W_C[y] = { id: 'WLD', yr: y, ko: "Trung bình thế giới", le: le / w, gap: gap / w, u5: u5 / w, im: im / w });
}
const ERA_INF = ['neo', 'lri', 'diar', 'tb', 'oinf', 'nut', 'mal', 'mat'];
function eraCT(c, b) {
  const T = CT[c.p][b]; if (!c.yr || !(c.du5 > 3)) return T;
  if (c.p === 'sa' || c.p === 'ssa') { const k = 1 + c.du5 / 100, o = Object.assign({}, T); for (const x of ERA_INF) if (o[x]) o[x] *= k; return o; }
  const x = clamp(c.du5 / 150, 0, 0.85), U = CT.sa[b], o = {};
  for (const k in T) o[k] = T[k] * (1 - x);
  for (const k in U) o[k] = (o[k] || 0) + U[k] * x;
  return o;
}
const ERA_CKEY = { w: 'war', f: 'nut', g: 'geno', q: 'disa', s: 'disa', t: 'disa', c: 'covid', p: 'epid' };
function eraCause(w, c, a, sex) {
  const key = ERA_CKEY[c.ck]; if (!key) return;
  let t = 0; for (const k in w) if (k !== key) t += w[k];
  const am = c.ck === 'w' ? (a >= 15 && a < 50 ? (sex === 'M' ? 1.6 : 1) : a < 15 ? 0.7 : 0.6) : c.ck === 'f' ? (a < 15 ? 1.4 : a >= 65 ? 1.2 : 0.8)
    : c.ck === 'c' || c.ck === 'p' ? (a >= 65 ? 1.6 : a >= 45 ? 0.8 : 0.15) : 1;
  const s = clamp(c.cx * am, 0, 0.93);
  if (s > 0.002) w[key] = (w[key] || 0) + s / (1 - s) * t;
}
function eraLabel(k, c) {
  if (!c || !c.yr) return null;
  if (c.ck && ERA_CKEY[c.ck] === k && c.cn) return c.cn;
  if (k === 'war' && c.wn) return c.wn;
  if (k === 'epid') return "Đại dịch do một bệnh truyền nhiễm mới";
  return null;
}
function eraMort(c, a) {
  if (!c || !c.yr || c.yr < NOW_Y) return 1;
  let k = 1;
  if (c.fw && a >= 1) k *= 1 + 0.04 * c.war * (a >= 15 && a < 60 ? 1.5 : 0.6);
  if (c.ck === 'p') { const s = c.cx / (1 - c.cx); k *= 1 + s * (a >= 65 ? 2 : a >= 45 ? 0.8 : 0.15); }
  return k;
}
function eraEconAt(iso, yr) {
  if (yr < NOW_Y) {
    const c = CBY[iso]; let b = null;
    for (const r of [...(ECON_BY[iso] || []), ...(c.p === 'hi' ? ECON_BY.hi || [] : []), ...(ECON_BY['*'] || [])]) if (inSpan(r, yr) && (!b || r[4] > b[4])) b = r;
    const o = b ? { k: b[3], y0: b[1], lay: b[4], inc: b[5], stk: yr === b[1] ? b[6] : null, hse: b[7], sav: yr === b[1] ? b[8] : 1 } : null;
    const y = ERA_YR[iso] && ERA_YR[iso][yr]; if (!y) return o;
    const e = o || { k: null, y0: null, lay: 1, inc: 0, stk: null, hse: 0, sav: 1 };
    if (y.l != null) e.lay = y.l; if (y.w != null) e.inc = y.w; if (y.h != null) e.hse = y.h; e.cash = y.c || 0; e.debt = y.d || 0;
    return e;
  }
  return (S.eraF && S.eraF.e[iso + yr]) || null;
}
function eraEconRoll(iso, yr) {
  const F = S.eraF, key = iso + yr; if (F.e[key] !== undefined) return;
  const c = eraAt(CBY[iso], yr), hi = c.p === 'hi';
  if (F.wr[yr] === undefined) F.wr[yr] = chance(0.07) ? 1 : 0;
  const prev = F.e[iso + (yr - 1)];
  let e = null;
  if (prev && prev.n > 0) e = Object.assign({}, prev, { n: prev.n - 1, stk: null, sav: 1, y0: prev.y0 });
  else if (chance(0.017)) e = { k: 'bank', lay: 2.5, inc: -0.06, stk: -0.4, hse: -0.12, sav: hi ? 1 : 0.85, n: 1 };
  else if (!hi && chance(0.015)) e = { k: 'cur', lay: 1.8, inc: -0.08, stk: -0.3, hse: -0.05, sav: 0.85, n: 0 };
  else if (F.wr[yr] || chance(hi ? 0.04 : 0.05)) e = { k: F.wr[yr] ? 'wrec' : 'rec', lay: 1.8, inc: -0.02, stk: -0.25, hse: -0.04, sav: 1, n: 0 };
  if (F.pan && yr === F.pan[0] && (!e || e.lay < 2)) e = { k: 'pan', lay: 2, inc: -0.04, stk: -0.1, hse: 0, sav: 1, n: 0 };
  if (e && e.y0 == null) e.y0 = yr;
  F.e[key] = e || 0;
}
const nowWorld = () => !!(S && (!S.era || S.era === 'now'));
const ecoYr = () => eraOn() ? eraYr() : nowWorld() ? calYr() : null;
const eraEcon = () => { const y = ecoYr(); return y != null && S.eraY && S.eraY.yr === y && S.eraY.iso === S.cur ? S.eraY : null; };
const ecoDrawn = () => { const y = ecoYr(); return y != null && y >= NOW_Y; };
function ecoOdds(hi) {
  const c = 0.017 / 1.017, wr = 0.07 + 0.93 * (hi ? 0.04 : 0.05), cu = hi ? 0 : 0.015;
  const bank = (1 - c) * 0.017, cur = (1 - c) * 0.983 * cu, rec = (1 - c) * 0.983 * (1 - cu) * wr, p = bank + cur + rec, rest = 1 - p - c;
  return { p, lay0: (1 - (c + bank) * 2.5 - (cur + rec) * 1.8) / rest, inc0: ((c + bank) * 0.06 + cur * 0.08 + rec * 0.02) / rest,
    sav0: hi ? 0 : (bank + cur) * 0.15 / (1 - bank - cur) };
}
const ECO_ODDS = { hi: ecoOdds(true), lo: ecoOdds(false) };
const ecoOd = () => ECO_ODDS[C().p === 'hi' ? 'hi' : 'lo'];
function ecoZ(z) {
  if (!ecoDrawn()) return z;
  const o = ecoOd(), e = eraEcon(), u = normCdf(z);
  return invNorm(clamp(e && e.stk != null ? u * o.p : o.p + u * (1 - o.p), 0.0005, 0.9995));
}
const eraLayK = id => { const e = eraEcon(); let k = e ? e.lay : ecoDrawn() ? ecoOd().lay0 : 1; const ai = aiK(id); if (ai) k *= 1 + (ai[1] - 1) * (S.flags.aiSkill ? 0.5 : 1); return k; };
const eraIncK = () => { const e = eraEcon(); let k = e ? 1 + e.inc : ecoDrawn() ? 1 + ecoOd().inc0 : 1; if (eraOn() && eraYr() >= NOW_Y && JOBS[S.job] && JOBS[S.job].s === 'agr') k *= 1 - climateT() * 0.1 * (['ssa', 'sa', 'mena'].includes(C().p) ? 1 : 0.3); return k; };
const eraHse = () => { if (ecoDrawn()) return 0; const e = eraEcon(); return e && e.hse ? e.hse : 0; };
function eraHseG(iso = S.cur) {
  if (!eraOn()) return 0;
  const yr = eraYr(), b = CBY[iso]; if (yr == null || !b || yr - 1 < ERA_Y0 || !ERA.C[b.id]) return 0;
  const y = ERA_YR[iso] && ERA_YR[iso][yr]; if (y && y.h != null) return 0;
  const p0 = eraAt(b, yr - 1).ppp, p1 = eraAt(b, yr).ppp;
  return p0 > 0 && p1 > 0 ? clamp(Math.log(p1 / p0), -0.15, 0.15) - 0.01 : 0;
}
const eraCash = () => { const e = eraEcon(); return e && e.cash || 0; };
const eraDebt = () => { const e = eraEcon(); return e && e.debt || 0; };
function mktStk(z, hi) {
  const yr = ecoYr();
  if (yr != null && yr < NOW_Y) {
    const s = MKT_S[S.cur] && MKT_S[S.cur][yr]; if (s != null) return clamp(s + 0.08 * z, -0.85, 0.95);
    const e = eraEcon(); if (e && e.stk != null) return clamp(e.stk + 0.08 * z, -0.85, 0.7);
    const u = MKT_S.USA[yr], d = u == null ? 0 : u - MKT_MU;
    return clamp(0.05 + (hi ? 0.75 : 0.5) * d + (hi ? 0.11 : 0.19) * z, -0.6, 0.8);
  }
  return clamp(STK_MU + (hi ? 0.17 : 0.22) * ecoZ(z), -0.55, 0.7);
}
const STK_MU = 0.055;
function mktCrash() {
  const yr = ecoYr(); if (yr == null) return false;
  if (yr < NOW_Y) { const s = MKT_S[S.cur] && MKT_S[S.cur][yr]; if (s != null) return s <= -0.25; const e = eraEcon(); if (e && e.stk != null) return e.stk <= -0.25;
    const u = MKT_S.USA[yr]; return u != null && u - MKT_MU <= -0.3; }
  const e = eraEcon(); return !!(e && e.stk != null && e.stk <= -0.25);
}
const ecoSavK = () => { if (!ecoDrawn()) return 0; const e = eraEcon(); return e && e.sav < 1 ? 0 : ecoOd().sav0 * (typeof ecoExpo === 'function' ? ecoExpo() : 1); };
function nowPlan() {
  if (!nowWorld() || typeof eraEconRoll !== 'function') return;
  const yr = calYr(), F = S.eraF || (S.eraF = ERA_F0());
  eraEconRoll(S.cur, yr);
  const e = F.e[S.cur + yr]; S.eraY = e ? Object.assign({ yr, iso: S.cur }, e) : null;
  if (e && e.y0 === yr && S.age >= 12 && e.k !== 'rec' && (e.sav < 1 || F.lastE == null || yr - F.lastE >= 4)) { F.lastE = yr; queue(0.05 + rnd() * 0.85, 'hist', 'FE|' + S.cur + '|' + e.k + '|' + yr); }
}
const AI_J = { clerk: [0.55, 2.2], callc: [0.4, 3], finance: [0.75, 1.6], salesagent: [0.8, 1.4], shop: [0.8, 1.3], designer: [0.8, 1.5], dev: [0.95, 1.4],
  lawyer: [0.9, 1.2], warehouse: [0.7, 1.8], driver: [0.8, 1.5], factory: [0.85, 1.4], creator: [1, 1.2], civil: [0.85, 1],
  care: [1.5, 0.8], nurse: [1.3, 0.8], healthtech: [1.4, 0.8], electric: [1.3, 0.9], welder: [1.15, 0.9], construct: [1.1, 1], childcare: [1.1, 1],
  social: [1.25, 0.9], trainer: [1.2, 1], engineer: [1.15, 1], doctor: [1.1, 1], delivery: [1.1, 1] };
function aiT() { if (!eraOn()) return 0; const yr = eraYr(); if (yr < NOW_Y) return 0; const c = C(); return clamp((yr - NOW_Y) / 22, 0, 1) * (c.ppp >= 40000 ? 1 : c.ppp >= 15000 ? 0.7 : 0.45); }
function aiK(id) { const j = AI_J[id], t = aiT(); if (!j || !t) return null; return [1 + (j[0] - 1) * t, 1 + (j[1] - 1) * t]; }
const climateT = () => { if (!eraOn()) return 0; const yr = eraYr(); return yr > NOW_Y ? clamp((yr - NOW_Y) / 45, 0, 1.6) : 0; };
const eraHazK = () => 1 + 0.5 * climateT();
function eraJobK(id, c) {
  if (!eraOn()) return 1;
  const yr = eraYr();
  if (yr < NOW_Y) {
    if (id === 'dev') return yr < 1965 ? 0 : yr < 1985 ? (c.ppp > 20000 ? 0.3 : 0) : yr < 1995 ? (c.ppp > 15000 ? 0.7 : 0.2) : 1;
    if (id === 'creator') return yr < 2006 ? 0 : 1;
    if (id === 'callc') return yr < 1997 ? 0 : 1;
    if (id === 'delivery' || id === 'warehouse') return yr < 1995 ? 0.5 : 1;
    if (id === 'care' || id === 'childcare' || id === 'social' || id === 'healthtech') return yr < 1980 ? 0.4 : yr < 2000 ? 0.7 : 1;
    return 1;
  }
  const ai = aiK(id); let k = ai ? ai[0] : 1;
  if (S.flags.aiMove != null && S.age - S.flags.aiMove <= 3 && AI_J[id] && AI_J[id][0] > 1.1) k *= 3;
  return k;
}
const eraNetOK = (j, c) => { if (!eraOn() || !j.net) return c.net >= (j.net || 0); return eraBefore(1995) ? true : c.net >= j.net; };
function eraAfm(c, base) {
  if (!c.yr || c.yr >= 2020 || !(c.p === 'hi' || c.p === 'eca' || c.id === 'CHN')) return base;
  return Math.max(c.p === 'eca' ? 21.5 : 21, base - clamp((2020 - c.yr) * 0.17, 0, 9));
}
const eraDivK = c => c && c.yr && c.yr < 1995 ? clamp((c.yr - 1955) / 40, 0.2, 1) : 1;
const eraKidsK = c => c && c.yr && c.id === 'CHN' && c.yr >= 1980 && c.yr <= 2015 && S.fam.kids.length >= 1 ? (S.urban ? 0.06 : (S.fam.kids.length >= 2 ? 0.1 : 0.45)) : 1;
function afWorkOut() {
  if (S.sex !== 'F' || S.cur !== 'AFG' || !isWorking() || TALIBAN_F_JOBS.has(S.job) || RARE_JOBS.includes(S.job) || inOffice()) return;
  if (S.job === 'owner') bizExit();
  S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0;
  log("Vì là phụ nữ, bạn không thể đến nơi làm việc của mình nữa.", 'bad');
}
function eraEdu(c, sex, res) {
  if (!c.yr) { if (c.id === 'AFG' && sex === 'F') { res.t2 = 0; res.t3 = 0; res.t4 = 0; res.ban = true; } return res; }
  const y = c.yr;
  if (c.id === 'AFG' && sex === 'F' && ((y >= 1996 && y <= 2001) || y >= 2021)) { res.t2 = 0; res.t3 = 0; res.t4 = 0; res.ban = true; }
  if (c.id === 'CHN' && y >= 1966 && y <= 1976) { res.t4 = y >= 1970 ? res.t4 * 0.1 : 0; res.closed = 1; }
  if (c.id === 'KHM' && y >= 1975 && y <= 1979) { res.t1 = 0; res.t2 = 0; res.t3 = 0; res.t4 = 0; res.closed = 1; }
  if (c.id === 'IRN' && y >= 1980 && y <= 1983) { res.t4 = 0; res.closed = 1; }
  return res;
}
const uniShut = c => !!(c && c.yr && eraEdu(c, 'M', { t1: 1, t2: 1, t3: 1, t4: 1 }).closed);
function uniShutNow() {
  S.flags.uniShut = { y: eraYr() };
  if (S.job === 'student') { S.job = 'seeking'; S.flags.seekY = 0; }
  log("Các trường đại học đóng cửa, không có kỳ thi tuyển sinh.", 'bad', S.cur === 'CHN' ? "Trong Cách mạng Văn hóa, các trường đại học ở Trung Quốc không tuyển sinh viên mới bằng kỳ thi (Nhân dân Nhật báo, 2014)" : null);
}
function eraUniYear(yr) {
  const f = S.flags.uniShut; if (!f || S.cur !== S.born || S.job === 'prison' || S.school || S.edu >= 4) return;
  const c = C();
  if (S.cur === 'CHN' && yr >= 1970 && yr <= 1976) {
    if (f.rec || yr - f.y < 2 || S.serveLeft > 0 || !isWorking()) return;
    f.rec = 1;
    if (!chance(eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1).t4)) return;
    const sd = S.flags.sentDown; if (sd && !sd.home) { sd.home = 1; S.urban = true; S.city = sd.city; }
    if (isWorking()) S.flags.lastJob = S.job;
    S.flags.uniShut = null; S.school = 'uni'; S.schoolY = 0; S.job = 'student'; S.yearMark = 'edu'; eff({ h: 5 });
    log("Được nơi làm việc tiến cử, bạn vào đại học." + ' ' + "Bạn là một “sinh viên công nông binh”, được chọn qua tiến cử thay vì thi.", 'big', "Năm 1970-1976, 295 trường đại học ở Trung Quốc tuyển 940.000 sinh viên công nông binh bằng tiến cử thay vì thi (Nhân dân Nhật báo, 2014)");
    return;
  }
  if (uniShut(c) || yr <= f.y) return;
  S.flags.uniShut = null;
  if (S.age <= 30 && S.edu === 3 && S.serveLeft === 0 && S.job !== 'owner' && !inOffice()) queue(0.3 + rnd() * 0.5, 'dec', 'college', { reo: 1 });
}
const eraPol = c => c && c.yr && c.yr < NOW_Y ? eraPolAt(c.id, c.yr) : null;
const zaVoter = c => c.id === 'ZAF' && typeof S !== 'undefined' && !!S && !!S.eth && S.eth.g === 'za_white' && S.born === 'ZAF';
const noVote = c => NO_VOTE.includes(c.id) || (eraPol(c) === 'n' && !zaVoter(c));
const oneParty = c => eraPol(c) === 'o' || ONE_PARTY.includes(c.id);
const noLeader = c => NO_LEADER.includes(c.id) || ['o', 'l'].includes(eraPol(c)) || (eraPol(c) === 'n' && !zaVoter(c));
const ASTRO_Y = { USA: 1961, RUS: 1961, FRA: 1982, DEU: 1978, JPN: 1990, CHN: 2003, KOR: 2008, CAN: 1984, IND: 1984, ITA: 1992, GBR: 1991, ISR: 2003, ARE: 2019, SAU: 1985 };
const eraAstroOK = c => !eraBefore(ASTRO_Y[c.id] || 1990);
const smartOK = c => { const y = eraYr(); return y == null || y >= (c.ppp > 30000 ? 2008 : 2012); };
const cellOK = c => { const y = eraYr(); return y == null || y >= (c.ppp >= 15000 ? 1993 : c.ppp >= 5000 ? 1998 : 2003); };
const pcOK = c => { const y = eraYr(); return y == null || y >= (c.ppp >= 15000 ? 1985 : c.ppp >= 5000 ? 1995 : 2002); };
function eraPenK(c) {
  if (!eraOn()) return 1;
  const y = eraYr();
  if (y < NOW_Y) return c.id === 'KOR' && y < 2008 ? clamp((y - 1988) / 20, 0.15, 1) : 1;
  return c.tfr < 1.6 && (c.p === 'hi' || c.p === 'eca') ? 1 - 0.25 * clamp((y - 2035) / 35, 0, 1) : 1;
}
const eraRetireAdd = c => { if (!eraOn()) return 0; const y = eraYr(); return y >= 2030 && (c.p === 'hi' || c.p === 'eca' || c.id === 'CHN') ? Math.min(5, Math.floor((y - 2030) / 10) + 1) : 0; };
const eraMandAge = (c, a) => { if (!eraOn() || a == null) return a; const y = eraYr(); if ((c.id === 'KOR' && y < 2016) || (c.id === 'JPN' && y < 1998)) return 55; return a + (c.id === 'KOR' || c.id === 'JPN' ? eraRetireAdd(c) : c.id === 'CHN' ? Math.max(0, eraRetireAdd(c) - 3) : 0); };
const HIST = [
  { id: 'sputnik', c: '*', y: 1957, p: 0.5, t: "Liên Xô phóng Sputnik 1, vệ tinh nhân tạo đầu tiên của loài người. Nhiều người ngước nhìn bầu trời đêm để tìm một ngôi sao đang di chuyển." },
  { id: 'gagarin', c: '*', y: 1961, p: 0.6, t: "Yuri Gagarin trở thành người đầu tiên bay vào vũ trụ và bay một vòng quanh Trái Đất." },
  { id: 'cuba62', c: '*', y: 1962, a: [12, 120], p: 0.5, t: "Suốt 13 ngày của cuộc khủng hoảng tên lửa Cuba, thế giới đứng bên bờ vực chiến tranh hạt nhân." },
  { id: 'moon', c: '*', y: 1969, p: 0.9, t: "Lần đầu tiên con người đặt chân lên Mặt Trăng. Nhiều người quây quần bên radio và tivi, nín thở dõi theo.", f: "Khoảng 600 triệu người đã xem truyền hình trực tiếp cảnh Apollo 11 đáp xuống Mặt Trăng ngày 20 tháng 7 năm 1969 (NASA)" },
  { id: 'smallpox', c: '*', y: 1980, a: [15, 120], p: 0.4, t: "Bệnh đậu mùa được tuyên bố đã biến mất khỏi Trái Đất. Đó là bệnh truyền nhiễm đầu tiên con người xóa sổ được.", f: "Chỉ riêng trong thế kỷ 20, bệnh đậu mùa đã cướp đi khoảng 300 triệu mạng người (WHO, tuyên bố xóa sổ năm 1980)" },
  { id: 'chern', c: '*', y: 1986, a: [10, 120], p: 0.5, t: "Nhà máy điện hạt nhân Chernobyl ở Liên Xô phát nổ. Đám mây phóng xạ lan đến tận châu Âu." },
  { id: 'wall', c: '*', y: 1989, a: [8, 120], p: 0.7, t: "Bức tường Berlin sụp đổ. Chiến tranh Lạnh đang dần đi đến hồi kết." },
  { id: 'ussr', c: '*', y: 1991, a: [10, 120], p: 0.6, t: "Liên Xô tan rã, chia thành mười lăm quốc gia." },
  { id: 'web', c: '@hi', y: 1995, a: [10, 120], p: 0.5, t: "Từ “internet” bắt đầu xuất hiện trên báo chí và truyền hình mỗi ngày." },
  { id: 'wtc', c: '*', x: 'USA', y: 2001, a: [8, 120], p: 0.8, t: "Trung tâm Thương mại Thế giới ở New York, Mỹ, sụp đổ trong một vụ tấn công khủng bố. Cả thế giới lặng người trước màn hình tivi.", f: "Vụ khủng bố ngày 11 tháng 9 năm 2001 đã cướp đi sinh mạng của 2.977 người (Ủy ban 11/9)" },
  { id: 'tsunami04', c: '*', y: 2004, a: [8, 120], p: 0.5, t: "Sóng thần do động đất ở Ấn Độ Dương ập vào bờ biển của mười bốn quốc gia.", f: "Trận sóng thần Ấn Độ Dương năm 2004 đã cướp đi khoảng 227.000 sinh mạng (UN)" },
  { id: 'iphone', c: '*', y: 2007, a: [10, 120], p: 0.4, t: "Điện thoại thông minh, chiếc máy tính nằm gọn trong lòng bàn tay, lần đầu xuất hiện." },
  { id: 'gfc', c: '*', y: 2008, a: [12, 120], p: 0.6, t: "Cuộc khủng hoảng tài chính bắt đầu từ Mỹ lan ra khắp thế giới. Ngày nào tin tức cũng nói về thị trường lao dốc và những đợt sa thải." },
  { id: 'covid', c: '*', y: 2020, p: 1, t: "Một bệnh truyền nhiễm mới, COVID-19, lan ra khắp thế giới. Trường học và cửa hàng đóng cửa, mọi người đeo khẩu trang và giữ khoảng cách với nhau.", f: "Do đại dịch COVID-19, trong hai năm 2020–2021 thế giới có thêm khoảng 15 triệu người qua đời (ước tính tử vong vượt mức của WHO)", fx: () => { eff({ h: -4, so: -4 }); } },
  { id: 'covidend', c: '*', y: 2022, a: [3, 120], p: 0.6, t: "COVID-19 dần suy yếu, và những gương mặt không còn đeo khẩu trang đã trở lại phố phường.", fx: () => eff({ h: 3, so: 3 }) },
  { id: 'uawar', c: '*', x: 'UKR,RUS', y: 2022, a: [12, 120], p: 0.5, t: "Nga xâm lược Ukraine. Cuộc chiến lớn nhất ở châu Âu kể từ Chiến tranh thế giới thứ hai đã bắt đầu." },
  { id: 'chatai', c: '*', y: 2023, a: [12, 120], p: 0.5, t: "Trí tuệ nhân tạo biết trò chuyện và viết như con người ra đời, khiến cả thế giới xôn xao." },
  { id: 'k419', c: 'KOR', y: 1960, a: [10, 120], t: "Cuộc Cách mạng 19 tháng 4 chống gian lận bầu cử đã buộc tổng thống phải từ chức." },
  { id: 'k516', c: 'KOR', y: 1961, a: [10, 120], t: "Cuộc đảo chính quân sự 16 tháng 5 nổ ra, giới quân nhân lên nắm quyền." },
  { id: 'k_nurse', c: 'KOR', y: 1966, a: [18, 40], p: 0.15, t: "Bạn tiễn những người thợ mỏ và điều dưỡng lên đường sang Tây Đức làm việc. Trong xóm cũng có người ra đi.", f: "Từ năm 1963 đến 1977, khoảng 7.900 thợ mỏ và khoảng 11.000 điều dưỡng Hàn Quốc đã sang Tây Đức (Bộ Ngoại giao Hàn Quốc)" },
  { id: 'k_saemaul', c: 'KOR', y: 1971, t: () => S.urban ? "Phong trào Làng mới (Saemaul) bắt đầu. Sáng nào bài hát Làng mới cũng vang lên khắp nơi." : "Nhờ phong trào Làng mới, đường làng được mở rộng và mái tranh được thay bằng mái lợp tấm fibro xi măng." },
  { id: 'k_mideast', c: 'KOR', y: 1977, a: [22, 45], p: 0.12, t: "Nhiều người sang các công trường xây dựng ở Trung Đông để kiếm tiền. Một người quen của bạn cũng đã sang Ả Rập Xê Út.", f: "Cuối những năm 1970, mỗi năm có hơn 100.000 lao động Hàn Quốc làm việc tại các công trường xây dựng ở Trung Đông (Hiệp hội Nhà thầu Quốc tế Hàn Quốc)" },
  { id: 'k518', c: 'KOR', y: 1980, a: [10, 120], t: "Ở Gwangju, quân đội thiết quân luật dùng vũ lực đàn áp những người dân đang đòi dân chủ (Phong trào Dân chủ hóa 18 tháng 5)." },
  { id: 'k87', c: 'KOR', y: 1987, a: [10, 120], t: "Nhờ Phong trào Dân chủ Tháng Sáu, người dân giành được quyền trực tiếp bầu tổng thống." },
  { id: 'k88', c: 'KOR', y: 1988, t: "Thế vận hội Seoul được tổ chức. Nhà nào cũng có món đồ in hình Hodori, chú hổ linh vật.", fx: () => eff({ h: 2 }) },
  { id: 'k89', c: 'KOR', y: 1989, a: [20, 120], p: 0.4, t: "Việc du lịch nước ngoài được tự do hóa. Ở sân bay, những người lần đầu đi máy bay xếp hàng dài." },
  { id: 'k_gold', c: 'KOR', y: 1998, a: [15, 120], p: 0.6, t: "Bạn góp những chiếc nhẫn vàng trong nhà vào phong trào quyên góp vàng để trả nợ quốc gia sau cuộc khủng hoảng tiền tệ.", f: "Khoảng 3,5 triệu người đã tham gia phong trào quyên góp vàng năm 1998, gom được khoảng 227 tấn vàng" },
  { id: 'k02', c: 'KOR', y: 2002, t: "Tại World Cup do Hàn Quốc và Nhật Bản đồng tổ chức, Hàn Quốc đã vào đến bán kết. Đường phố tràn ngập những người mặc áo đỏ.", fx: () => eff({ h: 3, so: 2 }) },
  { id: 'k_sewol', c: 'KOR', y: 2014, a: [8, 120], t: "Phà Sewol chìm, 304 người thiệt mạng, trong đó có nhiều học sinh đang trên chuyến dã ngoại của trường. Cả nước chìm trong đau thương.", fx: () => eff({ h: -3 }) },
  { id: 'k_candle', c: 'KOR', y: 2016, a: [10, 120], p: 0.7, t: "Người dân cầm nến tụ họp ở quảng trường Gwanghwamun. Tháng 12 năm ấy, Quốc hội bỏ phiếu luận tội tổng thống, và tháng 3 năm sau, Tòa án Hiến pháp quyết định bãi nhiệm." },
  { id: 'k_martial', c: 'KOR', y: 2024, a: [10, 120], p: 0.7, t: "Đêm 3 tháng 12, thiết quân luật khẩn cấp được ban bố rồi được dỡ bỏ chỉ sau vài giờ theo yêu cầu của Quốc hội." },
  { id: 'p_kis', c: 'PRK', y: 1994, a: [6, 120], t: "Chủ tịch Kim Nhật Thành qua đời. Cả nước khóc than suốt nhiều ngày liền." },
  { id: 'p_curr', c: 'PRK', y: 2009, a: [18, 120], t: "Đợt đổi tiền khiến số tiền bạn dành dụm chỉ sau một đêm đã thành giấy vụn.", fx: () => { if (S.money > 0) { const x = S.money * 0.9; S.money -= x; book("Cải cách tiền tệ", -x); } eff({ h: -5 }); } },
  { id: 'j_kwboom', c: 'JPN', y: 1950, a: [0, 120], t: () => S.age < 6 ? "Quanh thời điểm bạn chào đời, bên kia biển, chiến tranh nổ ra trên bán đảo Triều Tiên và cướp đi vô số sinh mạng. Các đơn đặt hàng quân nhu của cuộc chiến ấy đổ dồn về Nhật Bản, và những nhà máy đang ngừng hoạt động bắt đầu chạy lại." : "Bên kia biển, chiến tranh nổ ra trên bán đảo Triều Tiên và cướp đi vô số sinh mạng. Các đơn đặt hàng quân nhu của cuộc chiến ấy đổ dồn về Nhật Bản; những nhà máy đang ngừng hoạt động chạy lại và việc làm tăng lên.",
    f: "Các đơn đặt hàng quân nhu của quân đội Mỹ trong Chiến tranh Triều Tiên (cơn sốt kinh tế nhờ Chiến tranh Triều Tiên) là bàn đạp lớn cho sự phục hồi kinh tế sau chiến tranh của Nhật Bản" },
  { id: 'j64', c: 'JPN', y: 1964, t: "Thế vận hội Tokyo được tổ chức, và tàu cao tốc Shinkansen lần đầu lăn bánh.", fx: () => eff({ h: 2 }) },
  { id: 'j_kobe', c: 'JPN', y: 1995, a: [6, 120], t: "Một trận động đất lớn xảy ra ở Kobe, hơn 6.000 người thiệt mạng." },
  { id: 'c_leap', c: 'CHN', y: 1958, t: "Phong trào Đại nhảy vọt bắt đầu. Làng nào cũng có nhà ăn tập thể và lò luyện thép đắp bằng đất sét." },
  { id: 'c_cr', c: 'CHN', y: 1966, t: () => S.age >= 7 && S.age <= 20 ? "Cách mạng Văn hóa bắt đầu. Trường học ngừng dạy, Hồng vệ binh tràn khắp đường phố và lớp học." : "Cách mạng Văn hóa bắt đầu. Đó là thời mà hàng xóm tố cáo lẫn nhau.", fx: () => eff({ h: -4 }) },
  { id: 'c_mao', c: 'CHN', y: 1976, a: [6, 120], t: "Chủ tịch Mao Trạch Đông qua đời. Mùa hè năm ấy, một trận động đất lớn đã xảy ra ở Đường Sơn." },
  { id: 'c_gaokao', c: 'CHN', y: 1977, a: [15, 35], t: "Sau mười năm, kỳ thi tuyển sinh đại học được tổ chức trở lại. Cả những thanh niên đang làm việc ở nhà máy và nông thôn cũng đổ về phòng thi.", f: "Năm 1977, khoảng 5,7 triệu người dự kỳ thi đại học vừa được khôi phục, và khoảng 270.000 người trúng tuyển" },
  { id: 'c_reform', c: 'CHN', y: 1979, a: [8, 120], t: "Cải cách mở cửa bắt đầu." + ' ' + "Mỗi hộ nông dân được chia một phần đất để canh tác, và sau khi nộp phần cho nhà nước, phần còn lại được phép đem bán." },
  { id: 'c_onechild', c: 'CHN', y: 1980, a: [16, 45], t: "Chính sách mỗi gia đình chỉ được sinh một con bắt đầu được áp dụng.", f: "Chính sách một con kéo dài từ năm 1980 đến năm 2015" },
  { id: 'c_tam', c: 'CHN', y: 1989, a: [12, 120], p: 0.6, t: "Các cuộc biểu tình kéo dài ở quảng trường Thiên An Môn, Bắc Kinh, đã bị quân đội trấn áp." },
  { id: 'c_wto', c: 'CHN', y: 2001, a: [15, 120], p: 0.4, t: "Trung Quốc gia nhập Tổ chức Thương mại Thế giới. Đơn hàng xuất khẩu đổ dồn về các nhà máy." },
  { id: 'c_08', c: 'CHN', y: 2008, t: "Thế vận hội Bắc Kinh được tổ chức. Mùa xuân năm ấy, một trận động đất lớn đã xảy ra ở Tứ Xuyên." },
  { id: 't_ml', c: 'TWN', y: 1987, a: [10, 120], t: "Lệnh thiết quân luật kéo dài 38 năm đã được dỡ bỏ." },
  { id: 't_96', c: 'TWN', y: 1996, a: [18, 120], t: "Lần đầu tiên người dân trực tiếp bầu ra tổng thống." },
  { id: 'v_boat', c: 'VNM', y: 1979, a: [8, 120], p: 0.6, t: "Người ta nối nhau ra khơi trên những chiếc thuyền nhỏ. Vài gia đình hàng xóm cũng lặng lẽ biến mất.", f: "Khoảng 800.000 “thuyền nhân” đã rời Việt Nam trong giai đoạn 1975–1995, và nhiều người đã bỏ mạng trên biển (UNHCR)" },
  { id: 'v_doimoi', c: 'VNM', y: 1986, a: [10, 120], t: "Công cuộc Đổi Mới bắt đầu, người dân được phép tự buôn bán, kinh doanh." },
  { id: 'kh_75', c: 'KHM', y: 1975, t: "Khmer Đỏ tiến vào Phnôm Pênh. Toàn bộ người dân thành thị bị đuổi về nông thôn; tiền bạc, trường học và chợ búa đều biến mất.", f: "Dưới chế độ Khmer Đỏ giai đoạn 1975–1979, khoảng 1,7 đến 2,2 triệu người đã chết vì bị hành quyết, đói khát và lao động cưỡng bức (Yale Cambodian Genocide Program)",
    fx: () => { S.urban = false; S.city = null; if (S.money > 0) { book("Tài sản bị tịch thu", -S.money); S.money = 0; } if (S.house) { book("Tài sản bị tịch thu", -S.house); S.house = 0; } if (S.school) { S.school = null; S.schoolY = 0; } eff({ h: -15, hl: -10 }); } },
  { id: 'kh_79', c: 'KHM', y: 1979, t: "Quân đội Việt Nam tiến vào và chế độ Khmer Đỏ sụp đổ. Những người sống sót lang thang trên các nẻo đường tìm kiếm gia đình.", fx: () => eff({ h: 4 }) },
  { id: 'id_98', c: 'IDN', y: 1998, a: [10, 120], t: "Tổng thống Suharto, người cầm quyền suốt 32 năm, đã từ chức sau những cuộc biểu tình." },
  { id: 'ph_86', c: 'PHL', y: 1986, a: [10, 120], t: "Cách mạng Quyền lực Nhân dân buộc Tổng thống Marcos phải từ chức. Đường phố rợp những dải ruy băng vàng." },
  { id: 'mm_88', c: 'MMR', y: 1988, a: [12, 120], t: "Các cuộc biểu tình đòi dân chủ lan khắp cả nước nhưng bị quân đội đàn áp đẫm máu." },
  { id: 'mm_21', c: 'MMR', y: 2021, a: [12, 120], t: "Quân đội đảo chính và lên nắm quyền. Trên đường phố, người dân phản kháng bằng cách gõ xoong nồi." },
  { id: 'in_emerg', c: 'IND', y: 1975, a: [15, 120], t: "Tình trạng khẩn cấp quốc gia được ban bố, bầu cử và tự do báo chí bị đình chỉ suốt 21 tháng." },
  { id: 'in_84', c: 'IND', y: 1984, a: [12, 120], t: "Thủ tướng Indira Gandhi bị ám sát. Cùng năm đó, khí độc rò rỉ từ một nhà máy hóa chất ở Bhopal." },
  { id: 'in_91', c: 'IND', y: 1991, a: [15, 120], p: 0.6, t: "Nền kinh tế bắt đầu mở cửa. Các công ty nước ngoài và những món hàng mới bắt đầu tràn vào." },
  { id: 'in_note', c: 'IND', y: 2016, a: [16, 120], p: 0.7, t: "Chỉ sau một đêm, những tờ tiền mệnh giá lớn không còn tiêu được nữa. Người ta xếp hàng trước ngân hàng nhiều ngày liền." },
  { id: 'in_walk', c: 'IND', y: 2020, a: [10, 120], p: 0.7, t: "Khi lệnh phong tỏa được ban hành, vô số người đang làm việc ở thành phố đã đi bộ về quê." },
  { id: 'bd_rana', c: 'BGD', y: 2013, a: [14, 120], t: () => S.job === 'garment' ? "Tòa nhà xưởng may Rana Plaza sụp đổ, 1.134 người thiệt mạng. Họ đều làm cùng công việc với bạn." : "Tòa nhà xưởng may Rana Plaza sụp đổ, 1.134 người thiệt mạng.", fx: () => { if (S.job === 'garment') eff({ h: -6 }); } },
  { id: 'pk_flood', c: 'PAK', y: 2010, a: [6, 120], p: 0.7, t: "Trận lũ lớn nhấn chìm một phần năm đất nước." },
  { id: 'np_rep', c: 'NPL', y: 2008, a: [12, 120], t: "Chế độ quân chủ chấm dứt và Nepal trở thành một nước cộng hòa." },
  { id: 'af_79', c: 'AFG', y: 1979, a: [6, 120], t: "Quân đội Liên Xô tiến vào. Giao tranh kéo dài trên núi và trong các làng mạc." },
  { id: 'af_96', c: 'AFG', y: 1996, a: [6, 120], t: () => S.sex === 'F' ? "Taliban chiếm Kabul. Phụ nữ không còn được đến trường hay đi làm." : "Taliban chiếm Kabul.", fx: () => { if (S.sex === 'F' && S.school && S.school !== 'prim') { S.school = null; S.schoolY = 0; } afWorkOut(); } },
  { id: 'af_01', c: 'AFG', y: 2001, a: [6, 120], t: "Liên quân do Mỹ dẫn đầu tiến vào, chế độ Taliban sụp đổ. Các bé gái bắt đầu đến trường trở lại." },
  { id: 'af_21', c: 'AFG', y: 2021, a: [6, 120], t: () => S.sex === 'F' ? "Taliban quay lại nắm quyền. Các bé gái không còn được đi học sau bậc tiểu học." : "Taliban quay lại nắm quyền. Người dân đổ xô đến sân bay tìm cách rời khỏi đất nước.", fx: () => { if (S.sex === 'F' && S.school && S.school !== 'prim') { S.school = null; S.schoolY = 0; } afWorkOut(); eff({ h: -5 }); } },
  { id: 'ir_79', c: 'IRN', y: 1979, a: [8, 120], t: "Cách mạng Hồi giáo lật đổ chế độ quân chủ và lập nên nước Cộng hòa Hồi giáo." },
  { id: 'ir_uni', c: 'IRN', y: 1980, a: [17, 30], t: "Cuộc Cách mạng Văn hóa khiến các trường đại học đóng cửa. Phải 3 năm sau các trường mới mở cửa trở lại." },
  { id: 'iq_90', c: 'IRQ', y: 1990, a: [10, 120], t: "Iraq xâm lược Kuwait, và lệnh trừng phạt kinh tế của Liên Hợp Quốc bắt đầu. Lệnh trừng phạt kéo dài 13 năm." },
  { id: 'eg_aswan', c: 'EGY', y: 1970, a: [10, 120], p: 0.5, t: "Đập Cao Aswan hoàn thành, những trận lũ của sông Nile chấm dứt." },
  { id: 'ar_spring', c: 'EGY,TUN,LBY,YEM,SYR,BHR', y: 2011, a: [10, 120], t: "“Mùa xuân Ả Rập” lan rộng. Trên khắp các quảng trường, người dân tụ họp đòi thay đổi." },
  { id: 'lb_port', c: 'LBN', y: 2020, a: [6, 120], t: "Một vụ nổ lớn xảy ra ở cảng Beirut, phá hủy một nửa thành phố." },
  { id: 'sa_oil', c: 'SAU,KWT,ARE,QAT,OMN', y: 1974, a: [10, 120], p: 0.6, t: "Giá dầu tăng gấp bốn lần, tiền đổ về đất nước như nước. Những thành phố và con đường mới mọc lên nhanh chóng." },
  { id: 'sa_drive', c: 'SAU', y: 2018, a: [18, 120], t: () => S.sex === 'F' ? "Phụ nữ đã được phép lái xe. Lần đầu tiên bạn tự mình cầm lái." : "Phụ nữ đã được phép lái xe.", fx: () => { if (S.sex === 'F') eff({ h: 3 }); } },
  { id: 'qa_wc', c: 'QAT', y: 2022, t: "World Cup được tổ chức tại Qatar." },
  { id: 'ps_oslo', c: 'PSE,ISR', y: 1993, a: [12, 120], p: 0.7, t: "Hiệp định Oslo được ký kết. Trong một thời gian ngắn, hy vọng về hòa bình lan tỏa khắp nơi." },
  { id: 'za_60', c: 'ZAF', y: 1960, a: [10, 120], t: "Ở Sharpeville, cảnh sát nổ súng vào những người đang phản đối luật thông hành, làm 69 người thiệt mạng." },
  { id: 'za_76', c: 'ZAF', y: 1976, a: [8, 120], t: "Học sinh ở Soweto xuống đường phản đối việc phải học bằng tiếng Afrikaans và đã bị nổ súng." },
  { id: 'za_90', c: 'ZAF', y: 1990, a: [8, 120], t: "Nelson Mandela được trả tự do sau 27 năm ngồi tù.", fx: () => eff({ h: 3 }) },
  { id: 'za_94', c: 'ZAF', y: 1994, a: [18, 120], t: "Lần đầu tiên, mọi người đều được đi bầu, bất kể màu da. Những hàng người dài bất tận xếp trước các điểm bỏ phiếu.", fx: () => eff({ h: 5 }) },
  { id: 'za_wc', c: 'ZAF', y: 2010, t: "Lần đầu tiên World Cup được tổ chức ở châu Phi. Tiếng kèn vuvuzela vang khắp cả nước.", fx: () => eff({ h: 2 }) },
  { id: 'et_74', c: 'ETH', y: 1974, a: [10, 120], t: "Hoàng đế Haile Selassie bị quân đội phế truất." },
  { id: 'ug_72', c: 'UGA', y: 1972, a: [10, 120], t: "Idi Amin ra lệnh cho hàng chục nghìn cư dân gốc Á phải rời khỏi đất nước trong vòng 90 ngày." },
  { id: 'ke_07', c: 'KEN', y: 2008, a: [10, 120], t: "Bạo lực sau cuộc bầu cử tổng thống khiến hơn 1.100 người thiệt mạng và hàng trăm nghìn người phải rời bỏ nhà cửa." },
  { id: 'ebola', c: 'GIN,LBR,SLE', y: 2014, t: "Dịch Ebola lan rộng. Người ta được dặn không được chạm vào người bệnh, đến cả tang lễ cũng không thể tổ chức như mong muốn.", f: "Khoảng 11.300 người đã chết vì Ebola ở Tây Phi trong giai đoạn 2014–2016 (WHO)", fx: () => eff({ h: -4, so: -3 }) },
  { id: 'zw_land', c: 'ZWE', y: 2000, a: [10, 120], t: "Cải cách đất đai tịch thu các trang trại lớn. Chẳng bao lâu sau, lương thực và việc làm bắt đầu thiếu hụt." },
  { id: 'cu_59', c: 'CUB', y: 1959, a: [6, 120], t: "Quân cách mạng tiến vào Havana. Đất đai và nhà máy trở thành tài sản nhà nước." },
  { id: 'cu_80', c: 'CUB', y: 1980, a: [10, 120], p: 0.6, t: "Hơn 120.000 người đã lên thuyền từ cảng Mariel sang Mỹ." },
  { id: 'cu_91', c: 'CUB', y: 1991, a: [6, 120], t: "Liên Xô sụp đổ, “Thời kỳ đặc biệt” bắt đầu. Thiếu cả xăng dầu lẫn thức ăn, người ta đạp xe đi lại và chịu cảnh đói.", fx: () => eff({ hl: -4, h: -4 }) },
  { id: 'cl_73', c: 'CHL', y: 1973, a: [8, 120], t: "Trong cuộc đảo chính quân sự, Tổng thống Allende qua đời, và chế độ quân sự của Pinochet lên nắm quyền." },
  { id: 'cl_88', c: 'CHL', y: 1988, a: [18, 120], t: "Phe “Không” thắng trong cuộc trưng cầu dân ý, chế độ quân sự đi đến hồi kết." },
  { id: 'ar_76', c: 'ARG', y: 1976, a: [10, 120], t: "Quân đội lên nắm quyền. Trong những năm sau đó, rất nhiều người đã “mất tích”." },
  { id: 'ar_83', c: 'ARG', y: 1983, a: [18, 120], t: "Chế độ quân sự chấm dứt, và người dân lại bầu tổng thống qua bầu cử." },
  { id: 'br_64', c: 'BRA', y: 1964, a: [10, 120], t: "Một cuộc đảo chính quân sự nổ ra. Chế độ quân sự kéo dài 21 năm." },
  { id: 'br_real', c: 'BRA', y: 1994, a: [15, 120], t: "Đồng tiền mới, đồng real, ra đời, chấm dứt nhiều năm lạm phát phi mã.", fx: () => eff({ h: 2 }) },
  { id: 'mx_85', c: 'MEX', y: 1985, a: [6, 120], t: "Một trận động đất lớn xảy ra ở Thành phố Mexico, rất nhiều tòa nhà sụp đổ." },
  { id: 'co_16', c: 'COL', y: 2016, a: [12, 120], t: "Chính phủ và lực lượng nổi dậy FARC ký hiệp định hòa bình, chấm dứt cuộc nội chiến kéo dài hơn nửa thế kỷ.", fx: () => eff({ h: 3 }) },
  { id: 've_exodus', c: 'VEN', y: 2017, a: [10, 120], t: "Giá cả tăng từng ngày, kệ hàng trong các cửa hàng trống trơn. Bạn bè và hàng xóm lần lượt rời khỏi đất nước.", f: "Tính đến năm 2024, khoảng 7,7 triệu người đã rời Venezuela (UNHCR·IOM)", fx: () => eff({ h: -5, so: -4 }) },
  { id: 'ht_10', c: 'HTI', y: 2010, a: [6, 120], t: "Một trận động đất lớn đã san phẳng Port-au-Prince." },
  { id: 'su_stalin', c: 'RUS,UKR,BLR,KAZ,KGZ,TJK,TKM,UZB,AZE,GEO,EST,LVA,LTU,ARM,MDA', y: 1953, a: [8, 120], t: "Stalin qua đời. Bắt đầu có những người trở về từ các trại lao động." },
  { id: 'su_space', c: 'RUS,UKR,BLR,KAZ', y: 1961, t: "Gagarin trở về từ vũ trụ. Cả nước tưng bừng như ngày hội.", fx: () => eff({ h: 2 }) },
  { id: 'su_chern', c: 'UKR,BLR', y: 1986, a: [3, 120], t: "Nhà máy điện hạt nhân Chernobyl phát nổ. Người dân các làng gần nhà máy phải bỏ lại tất cả mà ra đi.", f: "Khoảng 350.000 người đã phải di dời vì thảm họa Chernobyl (IAEA)" },
  { id: 'su_91', c: 'RUS,UKR,BLR,KAZ,KGZ,TJK,TKM,UZB,AZE,GEO,ARM,MDA', y: 1991, a: [6, 120], t: () => S.cur === 'RUS' ? "Liên Xô tan rã. Chỉ sau một đêm, có những người họ hàng bỗng thành ra sống ở một nước khác." : L`소련이 해체되고, ${iga(C().ko)} 독립국이 되었습니다.` },
  { id: 'ru_mob', c: 'RUS', y: 2022, a: [18, 50], t: () => S.sex === 'M' ? "Lệnh động viên một phần được ban bố. Xe của những người đàn ông rời đi về phía biên giới nối thành hàng dài." : "Lệnh động viên một phần được ban bố. Những người đàn ông trong gia đình và hàng xóm nhận được giấy gọi nhập ngũ.", fx: () => eff({ h: -4 }) },
  { id: 'hu_56', c: 'HUN', y: 1956, a: [8, 120], t: "Xe tăng Liên Xô nghiền nát cuộc cách mạng ở Budapest. 200.000 người đã vượt biên giới ra đi." },
  { id: 'cz_68', c: 'CZE,SVK', y: 1968, a: [8, 120], t: "Những cải cách của “Mùa xuân Praha” bị xe tăng của khối Hiệp ước Warszawa chặn đứng." },
  { id: 'pl_80', c: 'POL', y: 1980, a: [12, 120], t: "Công đoàn tự do “Đoàn kết” ra đời từ cuộc đình công ở xưởng đóng tàu Gdańsk." },
  { id: 'ee_89', c: 'POL,CZE,SVK,HUN,ROU,BGR', y: 1989, a: [8, 120], t: "Chính quyền cộng sản sụp đổ. Lần đầu tiên, người dân chờ đợi một cuộc bầu cử tự do.", fx: () => eff({ h: 3 }) },
  { id: 'cs_93', c: 'CZE,SVK', y: 1993, a: [10, 120], t: "Tiệp Khắc tách thành Séc và Slovakia một cách hòa bình." },
  { id: 'rs_91', c: 'SRB,MNE', y: 1991, a: [6, 120], t: "Nam Tư tan rã, chiến tranh nổ ra ở Croatia, rồi năm sau ở Bosnia. Người tị nạn từ các nước cộng hòa lân cận tràn về, và thanh niên nhận được giấy gọi nhập ngũ." },
  { id: 'rs_95', c: 'SRB,MNE', y: 1995, a: [6, 120], t: "Hiệp định Dayton chấm dứt chiến tranh Bosnia. Mùa hè năm ấy, hàng trăm nghìn người tị nạn gốc Serbia bị đuổi khỏi Croatia đã vượt biên trên những chiếc máy kéo và xe kéo." },
  { id: 'rs_99', c: 'SRB', y: 1999, a: [6, 120], t: "Các cuộc không kích của NATO kéo dài 78 ngày. Đêm nào còi báo động cũng vang lên." },
  { id: 'tr_80', c: 'TUR', y: 1980, a: [12, 120], t: "Một cuộc đảo chính quân sự đã nổ ra." },
  { id: 'de_61', c: 'DEU', y: 1961, a: [8, 120], t: "Bức tường được dựng lên ở Berlin, những gia đình bị chia cắt giữa Đông và Tây không thể gặp nhau nữa." },
  { id: 'de_90', c: 'DEU', y: 1990, a: [8, 120], t: "Nước Đức lại thống nhất.", fx: () => eff({ h: 4 }) },
  { id: 'fr_68', c: 'FRA', y: 1968, a: [14, 120], t: "Tháng 5, các cuộc biểu tình của sinh viên, công nhân và cuộc tổng đình công khiến cả nước tê liệt." },
  { id: 'es_75', c: 'ESP', y: 1975, a: [10, 120], t: "Franco qua đời, và Tây Ban Nha bước lên con đường đi tới dân chủ." },
  { id: 'pt_74', c: 'PRT', y: 1974, a: [10, 120], t: "Cách mạng Hoa cẩm chướng chấm dứt chế độ độc tài kéo dài 48 năm.", fx: () => eff({ h: 3 }) },
  { id: 'gr_74', c: 'GRC', y: 1974, a: [10, 120], t: "Chế độ quân sự kéo dài 7 năm đã sụp đổ." },
  { id: 'ie_98', c: 'IRL,GBR', y: 1998, a: [12, 120], p: 0.6, t: "Hiệp định Thứ Sáu Tuần Thánh được ký kết, chấm dứt cuộc xung đột ở Bắc Ireland." },
  { id: 'no_oil', c: 'NOR', y: 1969, a: [10, 120], p: 0.6, t: "Một mỏ dầu lớn được phát hiện ở Biển Bắc." },
  { id: 'ch_vote', c: 'CHE', y: 1971, a: [18, 120], t: () => S.sex === 'F' ? "Phụ nữ đã được quyền bỏ phiếu trong các cuộc bầu cử liên bang. Lần đầu tiên bạn cầm trên tay lá phiếu." : "Phụ nữ đã được quyền bỏ phiếu trong các cuộc bầu cử liên bang." },
  { id: 'gb_brexit', c: 'GBR', y: 2016, a: [16, 120], p: 0.7, t: "Cuộc trưng cầu dân ý quyết định rời khỏi Liên minh châu Âu. Ý kiến người dân chia làm hai nửa." },
  { id: 'us_63', c: 'USA', y: 1963, a: [8, 120], t: "Tổng thống Kennedy bị ám sát ở Dallas." },
  { id: 'us_64', c: 'USA', y: 1964, a: [12, 120], t: "Đạo luật Dân quyền được thông qua, phân biệt đối xử theo chủng tộc bị pháp luật cấm." },
  { id: 'us_68', c: 'USA', y: 1968, a: [10, 120], t: "Mục sư Martin Luther King bị ám sát. Cơn phẫn nộ bùng lên ở nhiều thành phố." },
  { id: 'us_911', c: 'USA', y: 2001, a: [6, 120], t: "New York và Washington bị tấn công khủng bố. Rất lâu sau, bạn vẫn nhớ ngày hôm ấy mình đang làm gì.", fx: () => eff({ h: -3 }) },
  { id: 'us_kat', c: 'USA', y: 2005, a: [8, 120], p: 0.5, t: "Bão Katrina nhấn chìm New Orleans trong biển nước." },
  { id: 'au_ballot', c: 'AUS', y: 1965, a: [18, 21], p: 0.8, t: () => S.sex === 'M' ? "Một cuộc rút thăm theo ngày sinh quyết định ai sẽ bị gọi nhập ngũ tham gia Chiến tranh Việt Nam. Bạn thấp thỏm sợ ngày sinh của mình bị xướng lên." : "Một cuộc rút thăm theo ngày sinh quyết định ai sẽ bị gọi nhập ngũ tham gia Chiến tranh Việt Nam." },
  { id: 'bl_way', c: 'EST,LVA,LTU', y: 1989, a: [6, 120], t: "Khoảng 2 triệu người dân ba nước Baltic nắm tay nhau, tạo thành chuỗi người dài hơn 600 km từ Tallinn đến Vilnius.", fx: () => eff({ h: 2 }) },
  { id: 'bl_91', c: 'EST,LVA,LTU', y: 1991, a: [6, 120], t: () => L`${iga(C().ko)} 독립을 되찾았습니다. 소련도 결국 독립을 인정했습니다.`, fx: () => eff({ h: 4 }) },
  { id: 'eu_04', c: 'EST,LVA,LTU,SVN,CYP,MLT', y: 2004, a: [15, 120], p: 0.7, t: "Đất nước gia nhập Liên minh châu Âu. Chỉ với một tấm hộ chiếu, giờ đây bạn có thể làm việc và học tập ở bất cứ đâu tại châu Âu." },
  { id: 'eu_13', c: 'HRV', y: 2013, a: [15, 120], p: 0.7, t: "Đất nước gia nhập Liên minh châu Âu. Chỉ với một tấm hộ chiếu, giờ đây bạn có thể làm việc và học tập ở bất cứ đâu tại châu Âu." },
  { id: 'yu_tito', c: 'SRB,HRV,SVN,BIH,MNE,MKD,XKX', y: 1980, a: [8, 120], t: "Tito qua đời. Còi báo động vang lên khắp cả nước, mọi người đứng lặng tại chỗ." },
  { id: 'ba_sar', c: 'BIH', y: 1992, a: [6, 120], t: "Sarajevo bị bao vây. Cuộc bao vây kéo dài gần 4 năm." },
  { id: 'mk_19', c: 'MKD', y: 2019, a: [10, 120], p: 0.6, t: "Tên nước được đổi thành Bắc Macedonia." },
  { id: 'al_67', c: 'ALB', y: 1967, a: [8, 120], t: "Nhà nước tuyên bố là quốc gia vô thần. Mọi nhà thờ và thánh đường Hồi giáo đều phải đóng cửa." },
  { id: 'al_91', c: 'ALB', y: 1991, a: [8, 120], t: "Chính quyền cộng sản sụp đổ, biên giới được mở. Các bến cảng chật kín những người chen lên những con tàu cũ để sang Ý." },
  { id: 'am_18', c: 'ARM', y: 2018, a: [14, 120], p: 0.7, t: "Các cuộc biểu tình ôn hòa đã làm thay đổi chính quyền. Người ta gọi đó là Cách mạng Nhung." },
  { id: 'am_23', c: 'ARM', y: 2023, a: [8, 120], t: "Hơn 100.000 người Armenia ở Nagorno-Karabakh chạy nạn đến đây, tạm trú trong trường học và nhà văn hóa làng." },
  { id: 'cy_03', c: 'CYP', y: 2003, a: [10, 120], p: 0.7, t: "Các trạm kiểm soát trên đường ranh giới chia cắt miền bắc và miền nam lần đầu tiên được mở. Người ta xếp hàng để về thăm ngôi nhà cũ sau mấy chục năm xa cách." },
  { id: 'hk_97', c: 'HKG', y: 1997, a: [6, 120], t: "Anh chuyển giao chủ quyền Hồng Kông cho Trung Quốc." },
  { id: 'hk_sars', c: 'HKG', y: 2003, a: [3, 120], t: "Dịch SARS lan rộng. Ai ra đường cũng đeo khẩu trang.", f: "Năm 2003, SARS đã cướp đi sinh mạng của 299 người ở Hồng Kông (WHO)", fx: () => eff({ h: -3 }) },
  { id: 'hk_19', c: 'HKG', y: 2019, a: [12, 120], t: "Các cuộc biểu tình lớn phản đối dự luật dẫn độ kéo dài suốt nhiều tháng." },
  { id: 'hk_21', c: 'HKG', y: 2021, a: [18, 60], p: 0.6, t: "Sau khi Luật An ninh Quốc gia có hiệu lực, ngày càng nhiều hàng xóm và bạn bè rời đi Anh, Canada và Úc." },
  { id: 'mo_99', c: 'MAC', y: 1999, a: [6, 120], t: "Bồ Đào Nha chuyển giao chủ quyền Ma Cao cho Trung Quốc." },
  { id: 'tl_99', c: 'TLS', y: 1999, a: [17, 120], t: "Trong cuộc trưng cầu dân ý về độc lập, 78,5% người dân đã chọn độc lập. Cuộc bỏ phiếu vừa kết thúc, dân quân đã đốt phá các làng mạc." },
  { id: 'fj_87', c: 'FJI', y: 1987, a: [10, 120], t: "Quân đội hai lần đảo chính. Trong những năm sau đó, hàng chục nghìn cư dân gốc Ấn đã rời khỏi đất nước." },
  { id: 'fj_00', c: 'FJI', y: 2000, a: [10, 120], p: 0.6, t: "Những người có vũ trang chiếm tòa nhà quốc hội và bắt thủ tướng cùng các nghị sĩ làm con tin suốt 56 ngày." },
  { id: 'fj_06', c: 'FJI', y: 2006, a: [10, 120], p: 0.5, t: "Quân đội lại một lần nữa đảo chính." },
  { id: 'fj_16', c: 'FJI', y: 2016, a: [4, 120], t: "Bão Winston quét qua, hàng chục nghìn ngôi nhà bị tàn phá.", fx: () => eff({ h: -3 }) },
  { id: 'bt_90', c: 'BTN', y: 1990, a: [8, 120], t: () => S.rel === 'H' ? "Những cư dân gốc Nepal ở miền nam bắt đầu bị tước quyền công dân và bị trục xuất. Họ hàng và hàng xóm đã ra đi, đến các trại tị nạn ở Nepal." : "Hàng chục nghìn cư dân gốc Nepal ở miền nam bị tước quyền công dân, phải rời đất nước đến các trại tị nạn ở Nepal." },
  { id: 'bt_99', c: 'BTN', y: 1999, a: [6, 120], t: "Lần đầu tiên, truyền hình và internet đến với đất nước." },
  { id: 'bt_08', c: 'BTN', y: 2008, a: [18, 120], t: "Cuộc tổng tuyển cử đầu tiên mà người dân trực tiếp bầu ra đại biểu quốc hội đã diễn ra. Chính nhà vua đã tự nguyện từ bỏ quyền lực.", fx: () => eff({ h: 2 }) },
  { id: 'mv_08', c: 'MDV', y: 2008, a: [18, 120], p: 0.6, t: "Cuộc bầu cử tổng thống đầu tiên có nhiều đảng cùng tranh cử đã diễn ra. Chính quyền kéo dài 30 năm đã được thay thế." },
  { id: 'sr_80', c: 'SUR', y: 1980, a: [12, 120], t: "Một cuộc đảo chính quân sự đã nổ ra." },
  { id: 'sr_82', c: 'SUR', y: 1982, a: [12, 120], p: 0.7, t: "15 người từng chỉ trích chính quyền bị bắt và bị hành quyết." },
  { id: 'tt_90', c: 'TTO', y: 1990, a: [10, 120], p: 0.6, t: "Một nhóm vũ trang chiếm tòa nhà quốc hội và đài truyền hình, bắt thủ tướng làm con tin. Sáu ngày sau, họ đầu hàng." },
  { id: 'sz_73', c: 'SWZ', y: 1973, a: [18, 120], t: "Nhà vua đình chỉ hiến pháp và cấm các đảng phái chính trị." },
  { id: 'km_97', c: 'COM', y: 1997, a: [10, 120], p: 0.6, t: "Hai đảo Anjouan và Mohéli tuyên bố tách khỏi đất nước." },
  { id: 'sb_03', c: 'SLB', y: 2003, a: [10, 120], p: 0.6, t: "Phái bộ gìn giữ hòa bình do các nước láng giềng gửi đến đã tới nơi. Ngày càng nhiều người buông súng." },
  // Regional & Global History Expansions (Pillar 3)
  { id: 'vnm_doi_moi', c: 'VNM', y: 1986, a: [8, 120], p: 0.95, t: 'Việt Nam chính thức thông qua công cuộc Đổi Mới tại Đại hội Đảng VI, chuyển mình từ kinh tế bao cấp sang kinh tế thị trường định hướng xã hội chủ nghĩa.' },
  { id: 'vnm_us_norm', c: 'VNM', y: 1995, a: [10, 120], p: 0.9, t: 'Việt Nam và Hoa Kỳ chính thức bình thường hóa quan hệ ngoại giao, mở ra thời kỳ hội nhập sâu rộng với cộng đồng kinh tế quốc tế.' },
  { id: 'vnm_wto_07', c: 'VNM', y: 2007, a: [10, 120], p: 0.95, t: 'Việt Nam chính thức trở thành thành viên thứ 150 của Tổ chức Thương mại Thế giới (WTO), làn sóng vốn FDI và xuất khẩu bùng nổ mạnh mẽ.' },
  { id: 'sea_fin_97', c: '@eap', y: 1997, a: [14, 120], p: 0.85, t: 'Khủng hoảng tài chính châu Á bùng nổ từ Thái Lan, đồng Baht và hàng loạt đồng tiền khu vực mất giá dữ dội, thị trường tài sản lao dốc.' },
  { id: 'sea_tsunami_04', c: 'IDN,THA,IND,LKA,MDV', y: 2004, a: [6, 120], p: 0.95, t: 'Thảm họa động đất - sóng thần Ấn Độ Dương tàn phá các vùng ven biển, cộng đồng nhân loại chung tay viện trợ nhân đạo kỷ lục.' },
  { id: 'ind_econ_91', c: 'IND', y: 1991, a: [14, 120], p: 0.9, t: 'Ấn Độ thực hiện gói cải cách kinh tế lịch sử, bãi bỏ hệ thống giấy phép License Raj và mở cửa các ngành công nghiệp then chốt.' },
  { id: 'zaf_apart_94', c: 'ZAF', y: 1994, a: [10, 120], p: 0.95, t: 'Nelson Mandela tuyên thệ nhậm chức Tổng thống sau cuộc bầu cử dân chủ đa sắc tộc đầu tiên, chính thức chấm dứt chế độ phân biệt chủng tộc Apartheid.' },
  { id: 'bra_real_94', c: 'BRA', y: 1994, a: [10, 120], p: 0.85, t: 'Kế hoạch bình ổn tiền tệ Plano Real ra mắt tại Brazil, thành công chặn đứng cơn siêu lạm phát kéo dài nhiều năm.' },
  { id: 'afc_fta_21', c: '@ssa', y: 2021, a: [14, 120], p: 0.85, t: 'Hiệp định Thương mại Tự do Lục địa Châu Phi (AfCFTA) chính thức có hiệu lực, tạo ra thị trường chung rộng lớn với hơn 1,3 tỷ dân.' },
  { id: 'covid_20', c: '*', y: 2020, a: [6, 120], p: 1.0, t: 'Đại dịch COVID-19 bùng phát toàn cầu, các lệnh phong tỏa xã hội và gián đoạn chuỗi cung ứng làm đảo lộn nhịp sống hàng tỷ con người.' },
  // Specific national history milestones for the remaining 17 countries (100% UN/WPP coverage)
  { id: 'dza_indep_62', c: 'DZA', y: 1962, a: [8, 120], p: 0.95, t: 'Algeria chính thức tuyên bố độc lập sau Hiệp định Évian, khép lại cuộc chiến tranh giải phóng dân tộc trường kỳ.' },
  { id: 'dza_hirak_19', c: 'DZA', y: 2019, a: [14, 120], p: 0.9, t: 'Phong trào Hirak bùng nổ ôn hòa khắp các thành phố Algeria, mở ra thời kỳ chuyển giao chính trị sâu rộng.' },
  { id: 'mar_green_75', c: 'MAR', y: 1975, a: [10, 120], p: 0.9, t: 'Cuộc Tuần hành Xanh lịch sử huy động 350.000 người dân Morocco tuần hành khẳng định chủ quyền lãnh thổ.' },
  { id: 'mar_solar_16', c: 'MAR', y: 2016, a: [12, 120], p: 0.85, t: 'Nhà máy điện mặt trời tập trung Noor Ouarzazate khổng lồ đi vào vận hành, đưa Morocco dẫn đầu năng lượng xanh Bắc Phi.' },
  { id: 'jor_peace_94', c: 'JOR', y: 1994, a: [12, 120], p: 0.9, t: 'Hiệp ước Hòa bình Wadi Araba được ký kết, xác lập đường biên giới ổn định và hợp tác phát triển cho Jordan.' },
  { id: 'per_truth_03', c: 'PER', y: 2003, a: [14, 120], p: 0.85, t: 'Ủy ban Sự thật và Hòa giải Peru công bố báo cáo lịch sử, thúc đẩy hàn gắn xã hội sau hai thập kỷ xung đột nội bộ.' },
  { id: 'ecu_dollar_00', c: 'ECU', y: 2000, a: [12, 120], p: 0.95, t: 'Ecuador chính thức áp dụng đồng Đô la Mỹ làm đồng tiền lưu hành hợp pháp để dập tắt cơn bão siêu lạm phát.' },
  { id: 'bol_nat_06', c: 'BOL', y: 2006, a: [12, 120], p: 0.9, t: 'Bolivia quốc hữu hóa ngành công nghiệp khí đốt tự nhiên và thông qua Hiến pháp công nhận quyền lợi các cộng đồng bản địa.' },
  { id: 'pry_hydro_84', c: 'PRY', y: 1984, a: [12, 120], p: 0.9, t: 'Tổ máy đầu tiên của đập thủy điện Itaipu vĩ đại hòa lưới điện, đưa Paraguay trở thành nước xuất khẩu điện sạch hàng đầu thế giới.' },
  { id: 'ury_ceibal_07', c: 'URY', y: 2007, a: [6, 120], p: 0.95, t: 'Kế hoạch Ceibal cung cấp máy tính xách tay và Internet miễn phí cho 100% học sinh tiểu học, đưa Uruguay đi đầu về bình đẳng giáo dục số.' },
  { id: 'cri_peace_87', c: 'CRI', y: 1987, a: [10, 120], p: 0.95, t: 'Hiệp định Hòa bình Esquipulas do Tổng thống Costa Rica khởi xướng được ký kết, giải trừ các cuộc xung đột vũ trang khắp Trung Mỹ.' },
  { id: 'pan_canal_99', c: 'PAN', y: 1999, a: [10, 120], p: 0.95, t: 'Chủ quyền Kênh đào Panama chính thức được bàn giao trọn vẹn cho nhân dân Panama theo Hiệp ước Torrijos-Carter.' },
  { id: 'gtm_peace_96', c: 'GTM', y: 1996, a: [12, 120], p: 0.95, t: 'Hiệp định Hòa bình Vững chắc và Bền lâu được ký kết tại Guatemala, chấm dứt 36 năm nội chiến đau thương.' },
  { id: 'slv_peace_92', c: 'SLV', y: 1992, a: [12, 120], p: 0.95, t: 'Hiệp định Hòa bình Chapultepec chấm dứt cuộc xung đột vũ trang kéo dài 12 năm ở El Salvador.' },
  { id: 'hnd_trans_82', c: 'HND', y: 1982, a: [14, 120], p: 0.85, t: 'Honduras thông qua Hiến pháp dân sự mới, đánh dấu bước chuyển mình quan trọng sang thể chế quản trị pháp quyền.' },
  { id: 'nic_canal_90', c: 'NIC', y: 1990, a: [12, 120], p: 0.9, t: 'Cuộc bầu cử hòa bình lịch sử mở đường cho tiến trình hòa giải dân tộc và tái thiết kinh tế Nicaragua.' },
  { id: 'dom_growth_12', c: 'DOM', y: 2012, a: [10, 120], p: 0.85, t: 'Cộng hòa Dominica đẩy mạnh đầu tư 4% GDP cho giáo dục phổ thông, thúc đẩy làn sóng tăng trưởng dịch vụ du lịch hàng đầu Caribe.' },
  { id: 'jam_reggae_78', c: 'JAM', y: 1978, a: [10, 120], p: 0.9, t: 'Buổi hòa nhạc One Love Peace Concert vang dội tại Kingston, đưa âm nhạc Reggae trở thành biểu tượng đoàn kết của Jamaica.' },
  { id: 'guy_oil_19', c: 'GUY', y: 2019, a: [12, 120], p: 0.95, t: 'Thùng dầu thương mại đầu tiên được khai thác ngoài khơi Guyana, mở ra bước ngoặt tăng trưởng kinh tế nhảy vọt hàng đầu thế giới.' },
];
const INDEP = { MAR: 1956, TUN: 1956, SDN: 1956, GHA: 1957, GIN: 1958, CMR: 1960, SEN: 1960, CIV: 1960, MLI: 1960, NER: 1960, BFA: 1960, TCD: 1960, CAF: 1960, COG: 1960, GAB: 1960,
  MDG: 1960, MRT: 1960, BEN: 1960, TGO: 1960, COD: 1960, SOM: 1960, NGA: 1960, TZA: 1961, SLE: 1961, KWT: 1961, BDI: 1962, RWA: 1962, UGA: 1962, DZA: 1962, JAM: 1962, KEN: 1963,
  MWI: 1964, ZMB: 1964, GMB: 1965, SGP: 1965, BWA: 1966, LSO: 1966, GNQ: 1968, BGD: 1971, QAT: 1971, ARE: 1971, GNB: 1974, MOZ: 1975, AGO: 1975, ZWE: 1980, NAM: 1990, ERI: 1993, SSD: 2011,
  CYP: 1960, TTO: 1962, MLT: 1964, MDV: 1965, GUY: 1966, MUS: 1968, SWZ: 1968, FJI: 1970, BHR: 1971, CPV: 1975, COM: 1975, SUR: 1975, DJI: 1977,
  SLB: 1978, HRV: 1991, SVN: 1991, MKD: 1991, BIH: 1992, TLS: 2002, MNE: 2006, XKX: 2008 };
const WAR_T = { kw: "Rạng sáng ngày 25 tháng 6, quân đội Triều Tiên vượt vĩ tuyến 38 tiến xuống phía nam. Đường sá chật kín những người đội gánh đồ đạc đi lánh nạn.",
  'kw|PRK': "Rạng sáng ngày 25 tháng 6, Quân đội Nhân dân Triều Tiên vượt vĩ tuyến 38 tiến xuống phía nam, và chiến tranh bắt đầu. Chẳng bao lâu sau, bom đạn trút xuống khắp đất nước.",
  'uaw|RUS': "Nga xâm lược Ukraine. Ít lâu sau, những người đàn ông trong xóm lần lượt bị gọi ra mặt trận.",
  'bdw|PAK': "Quân đội được điều đến Đông Pakistan, nơi đang đòi độc lập. Mùa đông năm ấy, chiến tranh kết thúc với nền độc lập của Bangladesh.", syw: "Các cuộc biểu tình biến thành nội chiến. Thành phố nào cũng vang tiếng bom.",
  uaw: "Quân đội Nga vượt qua biên giới. Còi báo động không kích vang lên từ lúc rạng sáng.", bdw: "Ở Đông Pakistan, nơi người dân đang đòi độc lập, quân đội bắt đầu thảm sát. Chiến tranh giải phóng nổ ra.",
  biaf: "Biafra tuyên bố độc lập, và nội chiến nổ ra.", iiw: "Chiến tranh nổ ra giữa Iraq và Iran.", lbw: "Xung đột giữa các giáo phái biến thành nội chiến. Beirut bị chia cắt thành hai nửa đông và tây." };
const WAR_END_T = { kw: "Hiệp định đình chiến được ký kết, tiếng súng im bặt. Đất nước bị chia làm hai, ngăn cách bởi đường giới tuyến quân sự.", vnw: "Quân đội miền Bắc tiến vào Sài Gòn, chiến tranh kết thúc.",
  'vnw|VNM': "Quân đội miền Bắc tiến vào Sài Gòn, chiến tranh kết thúc. Đất nước thống nhất.", hun56: "Cuộc cách mạng Hungary kết thúc khi bị quân đội Liên Xô đàn áp.", 'bdw|PAK': "Đông Pakistan giành độc lập, trở thành Bangladesh, và chiến tranh kết thúc." };
const WAR_END_SAD = new Set(['hun56', 'bdw|PAK', 'cyw', 'nkw2|ARM']);
const WAR_F = { bhw: "Chiến tranh Bosnia đã cướp đi khoảng 100.000 sinh mạng, và khoảng 2,2 triệu người, hơn một nửa dân số, phải rời bỏ nhà cửa (UNHCR)",
  kosw: "Năm 1999, khoảng 850.000 người gốc Albania ở Kosovo đã chạy nạn ra nước ngoài (UNHCR)", tlw: "Trong thời gian Indonesia chiếm đóng từ năm 1975 đến 1999, khoảng 100.000 đến 180.000 người đã thiệt mạng (Ủy ban Sự thật và Hòa giải Đông Timor)",
  cyw: "Năm 1974, khoảng 160.000 đến 200.000 người ở Síp phải rời bỏ nhà cửa khi hòn đảo bị chia cắt thành hai miền nam bắc", hrw: "Khoảng 20.000 người đã thiệt mạng trong Chiến tranh giành độc lập Croatia",
  kw: "Chiến tranh Triều Tiên đã cướp đi sinh mạng của khoảng 3 triệu người ở cả hai miền Nam Bắc, và hơn 10 triệu người phải sống trong cảnh gia đình ly tán", bdw: "Năm 1971, khoảng 10 triệu người từ Bangladesh đã chạy nạn sang Ấn Độ (UNHCR)",
  syw: "Nội chiến Syria buộc khoảng 13 triệu người, hơn một nửa dân số, phải rời bỏ nhà cửa (UNHCR)", uaw: "Sau cuộc xâm lược năm 2022, khoảng 6 triệu người Ukraine đã chạy nạn ra nước ngoài (UNHCR)",
  afw1: "Trong những năm 1980, khoảng 6 triệu người Afghanistan đã chạy nạn sang Pakistan và Iran (UNHCR)", vnw: "Chiến tranh Việt Nam đã cướp đi sinh mạng của khoảng 1 đến 3 triệu người Việt Nam",
  lbrw: "Trong cuộc nội chiến Liberia, gần một nửa dân số đã phải rời bỏ nhà cửa (UNHCR)", sow: "Khoảng 1 triệu người Somalia đang sống tị nạn ở nước ngoài (UNHCR)" };
const CRISIS_T = { f: n => L`${iga(n)} 닥쳤습니다. 먹을 것이 모자라 많은 사람이 굶주렸습니다.`, g: n => L`${iga(n)} 벌어졌습니다. 많은 이웃이 목숨을 잃었습니다.`,
  q: n => L`${iga(n)} 일어났습니다. 수많은 집이 무너졌습니다.`, s: n => L`${iga(n)} 휩쓸고 지나갔습니다. 마을이 물에 잠기고 많은 사람이 목숨을 잃었습니다.`, t: n => L`${iga(n)} 해안을 덮쳤습니다.` };
const CRISIS_SP = { gfam: "Nạn đói lớn sau Đại nhảy vọt ập đến. Nhiều gia đình phải sống qua ngày bằng vỏ cây và rễ cỏ.", arduous: "Nạn đói lớn được gọi là “Hành quân gian khổ” ập đến. Chế độ phân phối bị cắt, người ta phải tự tìm thức ăn ở các khu chợ tự phát.",
  rwag: "Cuộc diệt chủng kéo dài 100 ngày đã diễn ra. Hàng xóm ra tay với hàng xóm." };
const CRISIS_F = { srebrenica: "Tháng 7 năm 1995, hơn 8.000 nam giới và thiếu niên người Bosnia theo đạo Hồi đã bị sát hại ở Srebrenica (Tòa án Hình sự Quốc tế về Nam Tư cũ)",
  spitak: "Trận động đất Spitak năm 1988 ở Armenia đã cướp đi khoảng 25.000 sinh mạng", maria: "Trong sáu tháng sau cơn bão Maria năm 2017, Puerto Rico có thêm khoảng 3.000 người tử vong so với bình thường (nghiên cứu của Đại học George Washington)",
  gfam: "Ước tính khoảng 15 đến 45 triệu người đã chết trong nạn đói lớn ở Trung Quốc giai đoạn 1959–1961", arduous: "Ước tính khoảng 600.000 đến 1 triệu người đã chết trong nạn đói ở Triều Tiên vào giữa và cuối những năm 1990 (Haggard·Noland)",
  rwag: "Khoảng 800.000 người, phần lớn là người Tutsi, đã thiệt mạng trong cuộc diệt chủng ở Rwanda từ tháng 4 đến tháng 7 năm 1994 (UN)", ethf: "Khoảng 400.000 đến 1 triệu người đã chết trong nạn đói ở Ethiopia những năm 1983–85",
  bhola: "Cơn bão xoáy Bhola năm 1970 đã cướp đi khoảng 300.000 đến 500.000 sinh mạng", htiq: "Hơn 200.000 người đã thiệt mạng trong trận động đất lớn ở Haiti năm 2010", nargis: "Bão Nargis năm 2008 đã cướp đi khoảng 140.000 sinh mạng",
  somf11: "Khoảng 260.000 người đã chết trong nạn đói năm 2011 ở Somalia. Một nửa trong số đó là trẻ em dưới năm tuổi", idn65: "Trong hai năm 1965–66, hơn 500.000 người bị quy là cộng sản đã bị sát hại ở Indonesia" };
const ECON_T = { oil1: "Cú sốc dầu mỏ khiến giá dầu tăng gấp bốn lần. Giá cả leo thang và việc làm ít đi.", oil2: "Cú sốc dầu mỏ lần thứ hai ập đến. Giá cả và thất nghiệp cùng tăng.",
  debt: "Khủng hoảng nợ nước ngoài bùng nổ. Đồng tiền mất giá và giá cả leo thang.", hyper: "Siêu lạm phát ập đến, giá cả tăng hàng nghìn phần trăm mỗi năm. Vừa nhận lương là phải đi chợ ngay.",
  collor: "Chính phủ phong tỏa tiền gửi ngân hàng, nói là để kìm giá cả.", bubble: "Bong bóng bất động sản và chứng khoán vỡ. “Thập niên mất mát” bắt đầu.",
  jboom: "Thời kỳ kinh tế bong bóng bắt đầu, giá đất và giá cổ phiếu tăng vọt năm này qua năm khác. Việc làm dư dả và tiền thưởng hậu hĩnh.",
  ussr: "Sau khi Liên Xô sụp đổ, giá cả tăng vọt. Khoản tiết kiệm cả đời hóa thành giấy vụn, lương bị nợ hàng tháng trời.", ru98: "Nhà nước tuyên bố không trả được nợ. Đồng rúp chỉ còn một phần ba giá trị.",
  trans: "Nền kinh tế kế hoạch chuyển sang kinh tế thị trường, nhà máy đóng cửa và giá cả tăng vọt.", pyramid: "Các công ty đầu tư kiểu kim tự tháp đồng loạt sụp đổ. Nhiều gia đình mất hết tiền dành dụm, và bất ổn nổ ra khắp cả nước.",
  cyp13: "Các ngân hàng đứng trước nguy cơ sụp đổ, một phần các khoản tiền gửi lớn bị dùng để cứu ngân hàng. Việc làm ít đi và lương bị cắt giảm.", yugo: "Giữa chiến tranh và lệnh trừng phạt, giá cả tăng gấp đôi mỗi ngày.", tequila: "Khủng hoảng tiền tệ ập đến, đồng peso lao dốc.",
  corral: "Việc rút tiền gửi ngân hàng bị chặn lại. Những đoàn người biểu tình gõ nồi tràn ngập đường phố.", tur01: "Khủng hoảng tài chính khiến đồng lira mất một nửa giá trị.", dotcom: "Bong bóng cổ phiếu các công ty internet vỡ.",
  gfc: "Khủng hoảng tài chính toàn cầu ập đến. Giá cổ phiếu lao dốc và việc làm ít đi.", euro: "Khủng hoảng nợ công ập đến, thời kỳ thắt lưng buộc bụng bắt đầu. Việc làm rất khó tìm.",
  zim: "Siêu lạm phát ập đến, giá cả tăng hàng triệu phần trăm mỗi tháng. Một tờ tiền in tới hơn mười chữ số 0.", ven: "Nền kinh tế sụp đổ, giá cả tăng hàng nghìn phần trăm mỗi năm.",
  lbn: "Các ngân hàng không trả tiền gửi cho người dân. Chỉ trong vài năm, đồng tiền mất gần hết giá trị.", lka: "Nhà nước không trả được nợ, xăng dầu và thuốc men cạn kiệt. Người ta xếp hàng nhiều ngày trước cây xăng.",
  covid: "Các đợt phong tỏa khiến cửa hàng và nhà máy đóng cửa, nhiều người mất việc.",
  bank: "Khủng hoảng tài chính bùng nổ. Các ngân hàng chao đảo và các công ty cắt giảm nhân sự.", cur: "Khủng hoảng tiền tệ khiến đồng tiền mất giá mạnh. Giá hàng nhập khẩu tăng vọt.", rec: "Kinh tế đi xuống, việc làm ít đi.",
  wrec: "Kinh tế thế giới rơi vào suy thoái. Nhà máy mất đơn hàng và việc làm ít đi.", pan: "Phong tỏa vì dịch bệnh khiến cửa hàng và nhà máy đóng cửa.",
  kboom: "Thời kỳ bùng nổ “ba thấp” đã đến: giá dầu thấp, lãi suất thấp, đồng đô la thấp. Xuất khẩu tăng mạnh và việc làm dồi dào.",
  kdot: "Tập đoàn Daewoo sụp đổ và bong bóng cổ phiếu công nghệ thông tin vỡ. Giá cổ phiếu mất một nửa chỉ trong một năm.",
  card: "“Khủng hoảng thẻ tín dụng” bùng nổ, vô số người không trả nổi nợ thẻ.",
  k21: "Giá nhà và giá cổ phiếu tăng vọt. Xuất hiện những từ mới: “yeongkkeul”, gom hết mọi khoản vay để mua nhà, và “kiến Donghak”, những nhà đầu tư nhỏ đổ xô mua cổ phiếu.",
  k22: "Lãi suất tăng nhanh, giá nhà giảm và tiền lãi vay phình to.",
  infl22: "Giá cả tăng nhanh nhất trong nhiều thập kỷ và lãi suất tăng vọt. Lương không theo kịp giá cả.",
  br15: "Suy thoái sâu ập đến, số người thất nghiệp vượt quá 12 triệu.", ru14: "Giá dầu lao dốc, lệnh trừng phạt nối tiếp nhau, đồng rúp mất một nửa giá trị.",
  ru22: "Vì lệnh trừng phạt, giá cổ phiếu lao dốc, các công ty nước ngoài đóng cửa và rút đi.", tur18: "Đồng lira mất gần 30% giá trị chỉ trong một năm, và giá cả tăng vọt.",
  tur22: "Giá cả tăng hơn 70% trong một năm, tiền tiết kiệm bằng đồng lira mất giá rất nhiều.", arg18: "Đồng peso mất một nửa giá trị trong vòng một năm và giá cả leo thang.",
  arg23: "Giá cả tăng hơn 200% trong một năm. Nhiều gia đình vừa nhận lương là đổi ngay sang đô la hoặc hàng hóa.",
  egy16: "Đồng bảng Ai Cập mất một nửa giá trị chỉ sau một đêm. Giá bánh mì và thuốc men tăng vọt.",
  ngn16: "Giá dầu lao dốc khiến nền kinh tế lần đầu tiên thụt lùi sau 25 năm. Đồng naira mất giá mạnh.",
  ngn23: "Chỉ trong vài tháng, đồng naira chỉ còn một phần ba giá trị và giá cả tăng hơn 30%.", pak22: "Giá cả tăng gần 30% trong một năm và đồng rupee mất giá mạnh.",
  gha22: "Giá cả tăng hơn 50%, và nhà nước tuyên bố không trả được nợ.", demo: "Chỉ sau một đêm, 86% số tiền giấy đang lưu hành không thể dùng được nữa. Trước mỗi ngân hàng là một hàng người dài.",
  irn18: "Lệnh trừng phạt quay trở lại, đồng rial lao dốc và giá cả tăng gần 40%." };
const ECON_F = { kboom: "Giai đoạn 1986–1988, kinh tế Hàn Quốc tăng trưởng hơn 11% mỗi năm, và chỉ số KOSPI tăng hơn năm lần trong ba năm (Ngân hàng Trung ương Hàn Quốc, Sở Giao dịch Hàn Quốc)",
  kdot: "Riêng năm 2000, chỉ số KOSPI giảm từ 1.028 xuống 505, tức giảm 51% (Sở Giao dịch Hàn Quốc)", card: "Cuối năm 2003, số người bị liệt vào danh sách nợ xấu lên tới 3,72 triệu người (Cơ quan Giám sát Tài chính Hàn Quốc)",
  k21: "Năm 2021, giá căn hộ trên toàn Hàn Quốc tăng hơn 20% trong một năm (KB Real Estate)",
  k22: "Lãi suất cơ bản của Ngân hàng Trung ương Hàn Quốc tăng từ 0,5% năm 2021 lên 3,5% năm 2023, còn giá căn hộ trên cả nước giảm 7,2% năm 2022 và 5,1% năm 2023 (Ngân hàng Trung ương Hàn Quốc, Korea Real Estate Board)",
  infl22: "Tháng 6 năm 2022, lạm phát ở Mỹ lên tới 9,1%, cao nhất trong 41 năm, còn khu vực đồng euro lên tới 10,6% vào tháng 10 năm đó (Cục Thống kê Lao động Mỹ, Eurostat)",
  br15: "Kinh tế Brazil thu hẹp gần 7% trong hai năm 2015–2016 (IBGE)", tur22: "Năm 2022, giá tiêu dùng ở Thổ Nhĩ Kỳ tăng trung bình 72% (Viện Thống kê Thổ Nhĩ Kỳ)",
  arg23: "Năm 2023, lạm phát ở Argentina là 211% (INDEC)", demo: "Tháng 11 năm 2016, chính phủ Ấn Độ thu hồi tờ 500 rupee và 1.000 rupee, chiếm 86% lượng tiền mặt đang lưu hành (Ngân hàng Dự trữ Ấn Độ)" };
const ECON_GOOD = { jboom: 'big', kboom: 'big', k21: 'ev' };
const ERA_PROJ = "tương lai này là dự báo theo xác suất của quá khứ";
const FUT_ECON_F = "Trong 60 năm qua, các nền kinh tế phát triển rơi vào suy thoái khoảng mười năm một lần, còn khủng hoảng tài chính xảy ra ở mỗi nước với xác suất khoảng 2% mỗi năm (IMF; Laeven và Valencia 2018)";
const techHad = id => id === 'cell' ? !!(S.owns.cell || S.owns.phone) : id === 'pc' ? !!S.owns.pc : id === 'tv' ? !!S.owns.tv : false;
const TECH = [{ id: 'tv', y0: 1952, y1: 1992, ppp: 2500, p: 0.22, t: "Lần đầu tiên nhà có tivi. Cả nhà quây quần ngồi trước màn hình." },
  { id: 'tel', y0: 1950, y1: 1998, ppp: 6000, p: 0.15, t: "Nhà lắp điện thoại. Bạn vẫn nhớ như in ngày đầu tiên nhấc ống nghe." },
  { id: 'pc', y0: 1984, y1: 2004, ppp: 15000, p: 0.2, t: "Lần đầu tiên nhà có máy tính." },
  { id: 'cell', y0: 1996, y1: 2010, ppp: 3000, p: 0.3, a: 12, t: "Lần đầu tiên bạn có điện thoại di động." }];
const ERA_F0 = () => ({ v: 0, w: {}, wy: {}, e: {}, wr: {}, pan: null, pr: null, h: {} });
const WPOP = { 2029: "Dân số thế giới vượt 8,5 tỷ người.", 2037: "Dân số thế giới vượt 9 tỷ người.", 2046: "Dân số thế giới vượt 9,5 tỷ người.", 2060: "Dân số thế giới vượt 10 tỷ người.",
  2083: "Dân số thế giới đạt đỉnh ở mức khoảng 10,3 tỷ người. Từ nay, số người trên Trái Đất sẽ giảm dần." };
const ERA_WPP = "UN World Population Prospects 2024 (phương án trung bình)";
function histFits(h, iso, a) {
  const [lo, hi] = h.a || [6, 120]; if (a < lo || a > hi) return false;
  if (h.c === '*') return !h.x || !h.x.split(',').includes(iso);
  if (h.c[0] === '@') return C().p === h.c.slice(1);
  return h.c.split(',').includes(iso);
}
const NO_FW = new Set(['KOR', 'PRK', 'TWN', 'CHN', 'JPN', 'USA']);
function eraPlan() {
  if (!eraOn()) return;
  const yr = eraYr(), F = S.eraF || (S.eraF = ERA_F0());
  if (yr >= NOW_Y) eraFuture(yr);
  const e = eraEconAt(S.cur, yr); S.eraY = e ? Object.assign({ yr, iso: S.cur }, e) : null;
  if (yr < NOW_Y) { eraSentDown(yr); eraUniYear(yr); if (S.age >= 1 && S.age < 18 && eraGoAt(yr, true)) queue(0.2 + rnd() * 0.6, 'hist', 'GK|' + yr); eraRoleYear(yr); }
  const due = eraDue(yr).slice(0, 3), ts = due.map(() => 0.05 + rnd() * 0.85).sort((x, y) => x - y);
  due.forEach((id, i) => queue(ts[i], 'hist', id));
}
const WAR_QUIET = new Set(['khm', 'bdi72', 'amin']);
function eraDue(yr) {
  const F = S.eraF, iso = studyAway() || S.cur, c = C(), a = S.age, out = [];
  const add = (id, pr) => { if (!F.h[id] && !out.some(x => x[1] === id)) out.push([pr, id]); };
  if (yr < NOW_Y) {
    const r = warAt(iso, yr);
    if (r && r[3] >= 0.5 && !WAR_QUIET.has(r[6])) { const [y0, y1] = warSpan(iso, r[6]); if (yr === y0) add('WS|' + iso + '|' + r[6], 9); else if (a === 0) add('W0|' + iso + '|' + r[6], 9); if (yr === y1 && y1 < ERA_PAST1) add('WE|' + iso + '|' + r[6], 8); }
    if (S.born && S.born !== iso) { const rb = warAt(S.born, yr); if (rb && rb[3] >= 0.5 && rb[4] > 0 && !WAR_QUIET.has(rb[6]) && yr === warSpan(S.born, rb[6])[0]) add('WB|' + S.born + '|' + rb[6], 8); }
    const cr = (CRI_BY[iso] || []).find(x => inSpan(x, yr));
    if (cr && (yr === cr[1] || a === 0)) add('C|' + iso + '|' + cr[4] + '|' + cr[1], 9);
    const e = eraEconAt(iso, yr); if (e && e.y0 === yr && a >= 12) add('E|' + iso + '|' + e.k + '|' + yr, 7);
    if (INDEP[iso] === yr) add('I|' + iso, 8);
    const reach = S.urban || c.ppp > 8000 ? 1 : 0.5;
    for (const h of HIST) if (h.y === yr && !F.h['H|' + h.id] && histFits(h, iso, a)) { const p = (h.p != null ? h.p : 1) * (h.c === '*' ? reach : 1); if (p < 1 && !chance(p)) { F.h['H|' + h.id] = 1; continue; } add('H|' + h.id, h.c === '*' ? 3 : 6); }
    for (const t of TECH) if (!F.h['T|' + t.id] && !techHad(t.id) && (t.id !== 'pc' || S.urban || (a < 18 ? S.q >= 3 : S.pct >= 0.4 || S.money > incomeAt(c, 0.5))) && yr >= t.y0 && yr <= t.y1 && a >= (t.a || 0) && incomeAt(c, clamp(a < 18 ? (S.q - 0.5) / 5 : Math.max(S.pct, 0.1), 0.05, 0.95)) >= t.ppp && chance(t.p)) add('T|' + t.id, 2);
  } else {
    for (const w of F.w[iso] || []) { if (w[0] === yr) add('FW|' + iso + '|' + w[0], 9); if (w[1] + 1 === yr) add('FWE|' + iso + '|' + w[0], 8); }
    const c0 = CBY[iso]; if (c0.war >= 0.5 && eraWar(c0, yr) < 0.3 && eraWar(c0, yr - 1) >= 0.3) add('FWD|' + iso, 7);
    if (F.pan && F.pan[0] === yr) add('FP|' + yr, 9); if (F.pan && F.pan[1] + 1 === yr) add('FPE|' + F.pan[0], 5);
    const e = F.e[iso + yr]; if (e && e.y0 === yr && a >= 12 && e.k !== 'rec' && (e.sav < 1 || F.lastE == null || yr - F.lastE >= 4)) { F.lastE = yr; add('FE|' + iso + '|' + e.k + '|' + yr, 7); }
    const E = ERA.C[iso]; if (E && a >= 10) { const k0 = e5(E.p, yr - 1) / e5(E.p, NOW_Y), k1 = e5(E.p, yr) / e5(E.p, NOW_Y);
      for (const t of [0.9, 0.8, 0.7, 0.6]) if (k0 > t && k1 <= t) add('FD|' + iso + '|' + t, 6);
      for (const t of [1.25, 1.5, 2]) if (k0 < t && k1 >= t) add('FD|' + iso + '|' + t, 6); }
    if (WPOP[yr] && a >= 8) add('WP|' + yr, 4);
    if (yr === 2032 && a >= 10) add('CL15', 4);
    if (yr === 2030 && a >= 15) add('AI1', 4);
    if (yr === 2042 && a >= 15) add('AI2', 4);
    if (yr >= 2035 && a >= 30 && c.tfr < 1.4 && (c.p === 'hi' || c.p === 'eca') && !F.h['AG|' + iso]) add('AG|' + iso, 5);
    if (['ssa', 'sa', 'mena', 'eap', 'lac'].includes(c.p) && (F.heat == null || yr - F.heat >= 6) && chance(0.12 * climateT())) add('HEAT|' + yr, 5);
  }
  return out.sort((x, y) => y[0] - x[0]).map(x => x[1]);
}
let ERA_FIRING = false;
function eraFactOK(f) { if (ERA_FIRING || !eraOn()) return true; const y = eraYr(), ys = String(f).match(/(?:19|20)\d\d/g); return !ys || ys.every(x => +x <= y + 2); }
function eraFire(id) { ERA_FIRING = true; try { eraFire0(id); } finally { ERA_FIRING = false; } }
function eraFire0(id) {
  const F = S.eraF; if (!F || F.h[id]) return; F.h[id] = 1;
  const [k, a1, a2, a3] = id.split('|'), c = C(), hist = (t, f, kind) => log(t, kind || 'hist', f);
  if (k === 'GK') return eraGoKid(+a1);
  if (k === 'R') return eraRoleFire(a1, a2);
  if (k === 'H') { const h = HIST.find(x => x.id === a1); if (!h) return; hist(typeof h.t === 'function' ? h.t() : h.t, h.f); if (h.fx) h.fx(); return; }
  if (k === 'WS') return hist(WAR_T[a2 + '|' + c.id] || WAR_T[a2] || L`${iga(WAR_N[a2])} 일어났습니다.`, WAR_F[a2], 'bad');
  if (k === 'WB') { eff({ h: -4 }); return hist(L`태어난 나라 ${CBY[a1].ko}에서 ${iga(WAR_N[a2])} 일어났다는 소식이 들려왔습니다. 고향에 남은 사람들 걱정에 한동안 잠을 이루지 못했습니다.`, WAR_F[a2], 'bad'); }
  if (k === 'W0') return hist(L`태어난 해, ${c.ko}에서는 ${iga(WAR_N[a2])} 이어지고 있었습니다.`, WAR_F[a2]);
  if (k === 'WE') { const wk = a2 + '|' + c.id, sad = WAR_END_SAD.has(a2) || WAR_END_SAD.has(wk); if (!sad) eff({ h: 4 }); return hist(WAR_END_T[wk] || WAR_END_T[a2] || L`${iga(WAR_N[a2])} 끝났습니다.`, null, sad ? 'bad' : 'big'); }
  if (k === 'C') {
    const r = (CRI_BY[a1] || []).find(x => x[4] === a2), n = CRISIS_N[a2]; if (!r) return;
    if (S.age === 0 && eraYr() > r[1]) return hist(L`태어난 해, ${c.ko}에서는 ${iga(n)} 이어지고 있었습니다.`, CRISIS_F[a2]);
    hist(CRISIS_SP[a2] || CRISIS_T[r[3]](n), CRISIS_F[a2], 'bad');
    if (r[3] === 'f') eff({ hl: S.q <= 3 ? -10 : -5, h: -6 });
    else if (r[3] === 'g') eff({ h: -10, so: -4 });
    else { eff({ h: -5 }); if (S.age >= 18 && chance(0.25)) { const x = Math.max(0, S.house) * 0.4 + Math.max(0, S.money) * 0.1; if (x > 0) { S.house *= S.house > 0 ? 0.6 : 1; S.money -= Math.max(0, S.money) * 0.1; book("Thiệt hại do thiên tai", -x); log(L`집이 크게 부서졌습니다. (−${wonStr(x)})`, 'bad'); } } }
    return;
  }
  if (k === 'E' || k === 'FE') {
    const e = k === 'E' ? eraEconAt(a1, +a3) : F.e[a1 + a3]; const t = a2 === 'asia' && a1 === 'KOR' ? "Khủng hoảng tiền tệ ập đến, nhà nước phải xin IMF cứu trợ. Các công ty đổ vỡ, người thất nghiệp tràn ra đường phố." : ECON_T[a2];
    if (t) hist(t, k === 'FE' ? FUT_ECON_F + (eraOn() ? ' — ' + ERA_PROJ : '') : a2 === 'jboom' ? "Sau Hiệp định Plaza năm 1985, trong bối cảnh lãi suất thấp, chỉ số Nikkei tăng gần gấp ba trong bốn năm, và người ta đồn rằng giá đất khu Hoàng cung Tokyo còn cao hơn giá đất của cả bang California" : ECON_F[a2] || null, ECON_GOOD[a2] || 'bad');
    const xk = typeof ecoExpo === 'function' ? ecoExpo() : 1;
    if (e && e.sav < 1 && S.money > 0 && S.age >= 15 && e.k === 'cur' && typeof fxOn === 'function' && fxOn()) log("Đồng tiền mất giá thảm hại, nhưng nhờ đã đổi sang đô la và vàng, bạn giữ được khoản tiền dành dụm.");
    else if (e && e.sav < 1 && S.money > 0 && S.age >= 15 && !xk) log("Tiền tiết kiệm của bạn đặt vào quỹ chỉ số thế giới, nên khi đồng nội tệ mất giá, số tiền ấy lại tăng lên tương ứng.", 'ev');
    else if (e && e.sav < 1 && S.money > 0 && S.age >= 15) { const sh = (1 - e.sav) * xk, x = S.money * sh; S.money -= x; book("Đồng tiền mất giá", -x); log(L`화폐 가치가 무너져 모아 둔 돈으로 살 수 있는 것이 ${Math.max(1, Math.round(sh * 100))}% 줄었습니다. (−${wonStr(x)})`, 'bad'); eff({ h: -5 }); }
    if (a2 === 'card' && S.age >= 20 && -S.money - homeV() * 0.8 > incomeAt(c, 0.5) * 0.2) { eff({ h: -4, so: -1 }); log("Không thể lấy thẻ này trả thẻ kia được nữa, bạn bị những cuộc gọi đòi nợ bám riết.", 'bad'); }
    return;
  }
  if (k === 'I') { eff({ h: 3 }); return hist(L`${iga(c.ko)} 독립했습니다. 사람들이 거리로 나와 새 국기를 흔들었습니다.`, null, 'big'); }
  if (k === 'T') { const t = TECH.find(x => x.id === a1); if (t && !techHad(a1)) { eff({ h: 2 }); if (S.flags.noPow != null && !S.flags.power && !S.urban && S.cur === S.born) log("Cuối cùng điện cũng về đến làng. Ban đêm trong nhà cũng sáng trưng.", 'warm'); S.flags.power = 1; log(t.t); if (a1 === 'cell' && !S.owns.phone) S.owns.cell = S.owns.cell || S.age; if (a1 === 'pc') S.owns.pc = S.owns.pc || S.age; } return; }
  if (k === 'FW') { eff({ h: -6 }); return hist(L`${iga(c.wn || L`${c.ko}의 무력 분쟁`)} 일어났습니다. 오래 이어진 평화가 깨졌습니다.`, "Từ năm 1945, xác suất một cuộc nội chiến mới bùng nổ càng cao ở những nước càng nghèo, lên tới 1–2% mỗi năm (Fearon và Laitin 2003)" + ' — ' + ERA_PROJ, 'bad'); }
  if (k === 'FWE') { eff({ h: 4 }); return hist(L`${iga(L`${CBY[a1].ko}의 무력 분쟁`)} 끝났습니다.`, null, 'big'); }
  if (k === 'FWD') { const r = warAt(a1, ERA_PAST1); return hist(L`${iga(r ? WAR_N[r[6]] : "cuộc xung đột")} 잦아들었습니다. 총성이 들리지 않는 날이 늘었습니다.`, "Từ năm 1945, thời gian kéo dài trung vị của các cuộc nội chiến là khoảng 7 năm (Fearon 2004)" + ' — ' + ERA_PROJ); }
  if (k === 'FP') { eff({ h: -4, so: -4 }); return hist("Một dịch bệnh mới lan khắp thế giới. Những ngày đeo khẩu trang và ở yên trong nhà lại quay trở lại.", "Xác suất xảy ra một đại dịch nghiêm trọng như COVID-19 được ước tính khoảng 2% mỗi năm (Marani et al. 2021, PNAS)" + ' — ' + ERA_PROJ, 'bad'); }
  if (k === 'FPE') { eff({ h: 3, so: 3 }); return hist("Đại dịch qua đi và cuộc sống thường ngày trở lại."); }
  if (k === 'FD') { const t = +a2, n = Math.round(Math.abs(1 - t) * 100);
    return hist(t < 1 ? L`${c.ko}의 인구가 ${NOW_Y}년보다 ${n}% 줄었습니다. 문을 닫는 학교와 빈집이 늘었습니다.` : L`${c.ko}의 인구가 ${NOW_Y}년보다 ${n}% 늘었습니다. 도시가 끝없이 넓어집니다.`, ERA_WPP + ' — ' + "dự báo"); }
  if (k === 'WP') return hist(WPOP[a1], ERA_WPP + ' — ' + "dự báo");
  if (k === 'CL15') return hist("Năm này qua năm khác, nhiệt độ trung bình của Trái Đất cao hơn thời kỳ tiền công nghiệp hơn 1,5°C.", "Nếu giữ chính sách như hiện nay, nhiệt độ Trái Đất sẽ tăng quá 1,5°C vào đầu thập niên 2030 và tăng khoảng 2,6–3,1°C vào năm 2100 (IPCC AR6, UNEP 2024)" + ' — ' + "dự báo");
  if (k === 'AI1') return hist("AI đang nhanh chóng thay đổi cách con người làm việc ở văn phòng, nhà máy và bệnh viện.", "IMF cho rằng khoảng 40% việc làm trên thế giới, và khoảng 60% ở các nền kinh tế phát triển, sẽ chịu tác động của AI. Khoảng một nửa trong số đó có thể tăng năng suất nhờ AI (IMF 2024)" + ' — ' + "dự báo");
  if (k === 'AI2') return hist("Khi AI và robot đảm nhận ngày càng nhiều việc, công việc của con người đang dịch chuyển sang chăm sóc, giảng dạy và các nghề kỹ thuật làm bằng tay.", "Diễn đàn Kinh tế Thế giới dự báo việc làm cho nhân viên chăm sóc, y tá, thợ xây dựng và thợ điện sẽ tăng, còn công việc văn phòng sẽ giảm (Future of Jobs 2025)" + ' — ' + "dự báo");
  if (k === 'AG') return hist("Vì thiếu người lao động, tin tức liên tục nói rằng tuổi nghỉ hưu sẽ lùi lại và lương hưu sẽ ít đi.", "Những nước càng ít trẻ em chào đời thì tỷ lệ lương hưu so với thu nhập trong tương lai càng được dự báo là thấp (OECD Pensions at a Glance 2023)" + ' — ' + "dự báo");
  if (k === 'HEAT') { F.heat = eraYr(); eff({ hl: S.age >= 65 ? -4 : -1, h: -2 }); return hist("Đợt nắng nóng kỷ lục kéo dài mãi. Giữa trưa thật khó làm việc ngoài trời.", "Nếu Trái Đất nóng lên 1,5°C, những đợt nắng nóng trước đây 50 năm mới có một lần sẽ đến thường xuyên hơn khoảng 9 lần, còn ở mức 2°C thì khoảng 14 lần (IPCC AR6)" + ' — ' + "dự báo", 'bad'); }
}
function eraFuture(yr) {
  const F = S.eraF, iso = S.cur, c0 = CBY[iso];
  if (F.pr !== yr) { F.pr = yr; if ((!F.pan || yr > F.pan[1] + 10) && chance(0.02)) { F.pan = [yr, yr + (chance(0.5) ? 1 : 2), chance(0.2) ? 0.3 : 0.1]; F.v++; } }
  if (F.wy[iso] !== yr) {
    F.wy[iso] = yr;
    const ws = F.w[iso] || (F.w[iso] = []), cur = eraAt(c0, yr);
    if (!ws.some(r => yr >= r[0] && yr <= r[1] + 2) && cur.war < 0.5) {
      const recent = ws.some(r => yr - r[1] <= 10) || (c0.war > 0 && yr - NOW_Y <= 10);
      const p = cur.ppp > 25000 || NO_FW.has(iso) ? 0 : ({ hi: 0.0008, eca: 0.004, lac: 0.003, eap: 0.003, mena: 0.006, sa: 0.007, ssa: 0.008 })[c0.p] * (recent ? 2 : 1);
      if (chance(p)) {
        const dur = Math.max(1, Math.round(-Math.log(Math.max(1e-6, rnd())) * 6)), w = clamp(Math.exp(Math.log(0.9) + 0.6 * invNorm(clamp(rnd(), 0.01, 0.99))), 0.3, 3);
        ws.push([yr, yr + dur - 1, Math.round(w * 10) / 10, Math.round((0.01 + 0.015 * w) * 1000) / 1000]); F.v++;
      }
    }
  }
  eraEconRoll(iso, yr);
}
function eraSentDown(yr) {
  const f = S.flags.sentDown;
  if (f) { if (yr >= f.back && !f.home && S.cur === 'CHN') { f.home = 1; S.urban = true; S.city = f.city; if (isWorking() && JOBS[S.job].s === 'agr') { S.job = 'seeking'; S.jobY = 0; } log("Bạn được phép trở về thành phố. Sau nhiều năm, bạn đã về nhà.", 'big'); eff({ h: 6 }); } return; }
  if (S.cur !== 'CHN' || yr < 1968 || yr > 1977 || !S.urban || S.age < 15 || S.age > 19 || S.fam.married || S.serveLeft > 0 || !chance(0.25)) return;
  S.flags.sentDown = { y: yr, back: Math.max(1978, yr + ri(3, 8)), city: S.city };
  S.urban = false; S.city = null; if (S.school) { S.school = null; S.schoolY = 0; }
  if (isWorking() || S.job === 'student' || S.job === 'seeking' || S.job === 'childwork') { S.job = 'farmhand'; S.jobY = 0; S.formal = false; }
  log("Bạn bị đưa về nông thôn theo phong trào “Thượng sơn hạ hương” (lên núi, xuống làng). Ở một ngôi làng xa lạ, bạn học làm nông.", 'big', "Từ năm 1968 đến năm 1980, khoảng 17 triệu thanh niên thành thị đã bị đưa về nông thôn");
  eff({ h: -6, so: -4 });
}
const dispP = c => c.yr ? (c.wd || 0) : (DISP[c.id] || 0) * 0.035;
const eraWarHosts = c => c.yr && c.wHost != null ? c.wHost : null;
const ERA_GO = [
  { k: 'irn79', c: 'IRN', y: [1979, 1986], p: 0.04, a: [20, 60], to: 'USA,DEU,CAN,GBR,SWE,FRA', auto: 0.3, kind: 'move',
    w: kid => (kid ? 1 : S.edu >= 4 ? 2.5 : 1) * (S.q >= 4 ? 2 : S.q <= 2 ? 0.4 : 1) * (S.rel !== 'M' ? 4 : 1) * (S.urban ? 1.3 : 0.3) },
  { k: 'boat', c: 'VNM', y: [1978, 1989], p: 0.015, a: [18, 50], to: 'USA,AUS,CAN,FRA', auto: 0.15, kind: 'boat', die: 0.1, caught: 0.15,
    w: () => (S.rel === 'C' ? 1.8 : 1) * (S.q >= 4 ? 1.5 : 1) * (S.urban ? 1.3 : 0.8) },
  { k: 'cub59', c: 'CUB', y: [1959, 1962], p: 0.015, a: [18, 65], to: 'USA,ESP', auto: 0.3, kind: 'move', w: () => (S.q >= 4 ? 4 : S.q === 3 ? 1 : 0.2) * (S.urban ? 1.5 : 0.5) },
  { k: 'mariel', c: 'CUB', y: [1980, 1980], p: 0.06, a: [18, 50], to: 'USA', auto: 0.2, kind: 'move', w: () => (S.q <= 3 ? 1.2 : 0.8) },
  { k: 'cze68', c: 'CZE', y: [1968, 1969], p: 0.03, a: [18, 50], to: 'DEU,AUT,CHE,CAN,USA', auto: 0.2, kind: 'move', w: kid => (kid ? 1 : S.edu >= 4 ? 2.5 : 1) * (S.urban ? 1.3 : 0.6) },
  { k: 'pol81', c: 'POL', y: [1981, 1988], p: 0.008, a: [20, 45], to: 'DEU,USA,CAN,AUS,SWE', auto: 0.3, kind: 'move', w: kid => (kid ? 1 : S.edu >= 4 ? 1.5 : 1) },
  { k: 'ven', c: 'VEN', y: [2015, 2025], p: 0.08, a: [18, 55], to: 'COL,PER,CHL,USA,ESP,ECU,BRA,ARG', auto: 0.5, kind: 'move', w: () => (S.q >= 2 && S.q <= 4 ? 1.2 : 0.8) },
  { k: 'zwe', c: 'ZWE', y: [2003, 2010], p: 0.03, a: [18, 50], to: 'ZAF,GBR,BWA', auto: 0.35, kind: 'move', w: () => (S.urban ? 1.3 : 0.8) },
  { k: 'mideast', c: 'KOR', y: [1975, 1985], p: 0.1, a: [22, 45], auto: 0.5, kind: 'temp', w: () => S.sex !== 'M' ? 0 : ['construct', 'welder', 'electric', 'mechanic', 'driver', 'factory'].includes(S.job) ? 1 : isWorking() || S.job === 'seeking' ? 0.15 : 0 },
  { k: 'pado', c: 'KOR', y: [1963, 1977], p: 0.06, a: [20, 35], to: 'DEU', auto: 0.35, kind: 'contract', stay: 0.4,
    w: () => S.sex === 'F' ? (['nurse', 'care'].includes(S.job) ? 1 : 0) : (['miner', 'construct', 'factory'].includes(S.job) || S.job === 'seeking' ? 0.06 : 0) },
];
const ERA_GO_T = () => ({
  irn79: { t: "Sau cách mạng, đi hay ở", b: "Sau cuộc cách mạng năm 1979, đất nước đã thay đổi rất nhiều. Vài người hàng xóm và họ hàng đã thu dọn đồ đạc ra nước ngoài. Gia đình mình có nên đi không?",
    f: "Ước tính hơn 1 triệu người đã rời Iran trong vài năm sau cuộc cách mạng năm 1979, đặc biệt là người tốt nghiệp đại học, các gia đình khá giả và người thuộc tôn giáo thiểu số (Migration Policy Institute 2006)",
    go: "Rời khỏi đất nước", kid: "Sau cách mạng, bố mẹ thu dọn đồ đạc và quyết định rời khỏi đất nước." },
  boat: { t: "Ra đi bằng thuyền?", b: "Có tin đồn rằng còn chỗ trên một chiếc thuyền lén ra khơi. Tiền đi thuyền phải trả bằng vàng, và nghe nói nhiều người bị bắt hoặc mất mạng trên biển.",
    f: "Giai đoạn 1975–1995, khoảng 800.000 người rời Việt Nam bằng thuyền đã đến được một nước khác. Số người thiệt mạng trên biển ước tính từ hàng chục nghìn đến hàng trăm nghìn người (UNHCR)",
    go: "Lên thuyền", kid: "Giữa đêm khuya, bố mẹ bước lên một chiếc thuyền nhỏ ra khơi." },
  cub59: { t: "Sau cách mạng, đi hay ở", b: "Từ khi chính quyền cách mạng lên nắm quyền, cửa hàng và đất đai đang dần thuộc về nhà nước. Vài gia đình quen biết đã sang Miami. Gia đình mình có nên đi không?",
    f: "Giai đoạn 1959–1962, khoảng 250.000 người đã rời Cuba, phần lớn thuộc tầng lớp trung lưu và khá giả (Pérez 1999)", go: "Rời khỏi đất nước", kid: "Sau cách mạng, bố mẹ thu dọn đồ đạc và quyết định rời khỏi đất nước." },
  mariel: { t: "Đến cảng Mariel?", b: "Chính phủ nói ai muốn đi thì có thể lên thuyền ở cảng Mariel. Họ hàng ở Mỹ đang gửi thuyền sang đón.",
    f: "Năm 1980, khoảng 125.000 người Cuba đã lên thuyền từ cảng Mariel sang Mỹ", go: "Đi thuyền sang Mỹ", kid: "Bố mẹ lên thuyền sang Mỹ ở cảng Mariel." },
  cze68: { t: "Ra đi trước khi biên giới đóng cửa?", b: "“Mùa xuân Praha” đã bị xe tăng nghiền nát. Biên giới vẫn còn mở, có những người đang đi sang phương Tây. Có thể chẳng bao lâu nữa biên giới sẽ lại đóng.",
    f: "Ước tính 70.000–100.000 người đã rời Tiệp Khắc trong hai năm 1968–1969. Sau đó biên giới bị đóng cho đến năm 1989", go: "Đi sang phương Tây", kid: "Trước khi biên giới đóng cửa, bố mẹ quyết định đi sang phương Tây." },
  pol81: { t: "Rời khỏi đất nước?", b: "Từ khi có thiết quân luật, kệ hàng trống trơn và tương lai mờ mịt. Một người bạn đã sang phương Tây ngỏ ý sẽ tìm việc giúp.",
    f: "Trong thập niên 1980, có tới hàng trăm nghìn người rời Ba Lan (Cục Thống kê Ba Lan)", go: "Rời khỏi đất nước", kid: "Bố mẹ quyết định đi sang một nước phương Tây." },
  ven: { t: "Rời khỏi đất nước?", b: "Lương một tháng khó mua đủ đồ ăn cho một tháng. Nhà thuốc không có thuốc, và năm nào cũng có thêm nhiều người sang các nước láng giềng.",
    f: "Từ năm 2015, khoảng 7,7 triệu người đã rời Venezuela, cứ bốn người dân thì có một người ra đi (R4V 2024)", go: "Sang nước láng giềng", kid: "Bố mẹ thu dọn đồ đạc và quyết định sang nước láng giềng." },
  zwe: { t: "Rời khỏi đất nước?", b: "Đồng tiền mất giá từng ngày, lương chẳng khác gì giấy vụn. Những người đã sang Nam Phi nhắn về rằng ở đó có việc làm.",
    f: "Ước tính 1–3 triệu người đã rời Zimbabwe trong thập niên 2000, phần lớn sang Nam Phi (IOM)", go: "Rời khỏi đất nước", kid: "Bố mẹ quyết định rời đất nước để tìm việc làm." },
  mideast: { t: "Đi làm ở công trường Trung Đông?", b: "Các công trường xây dựng ở Ả Rập Xê Út đang tuyển người theo hợp đồng hai năm. Bạn có thể dành dụm gấp mấy lần thu nhập ở nhà, nhưng trong thời gian đó phải xa gia đình, làm việc giữa sa mạc nóng bỏng.",
    f: "Giai đoạn 1975–1985, hơn 1 triệu lao động Hàn Quốc đã sang làm ở các công trường Trung Đông, và tiền họ kiếm được đã giúp đất nước vượt qua các cú sốc dầu mỏ (Hiệp hội Nhà thầu Quốc tế Hàn Quốc)", go: "Đi theo hợp đồng hai năm" },
  pado: { t: "Sang Tây Đức làm việc?", b: "Tây Đức đang tuyển người theo hợp đồng ba năm. Thu nhập gấp mấy lần, nhưng đó là một đất nước xa xôi, ngôn ngữ bất đồng.",
    f: "Giai đoạn 1963–1977, khoảng 8.000 thợ mỏ và 11.000 y tá Hàn Quốc đã sang Tây Đức. Khi hết hợp đồng, nhiều người ở lại Đức hoặc chuyển sang nước khác (Bảo tàng tưởng niệm thợ mỏ và y tá Hàn Quốc tại Đức)", go: "Đi theo hợp đồng ba năm" },
});
const eraGoAt = (yr, kid) => ERA_GO.find(g => g.c === S.cur && yr >= g.y[0] && yr <= g.y[1] && !S.flags['hg_' + g.k] && (kid ? g.kind !== 'temp' && g.kind !== 'contract' : S.age >= g.a[0] && S.age <= g.a[1]));
const eraGoDest = g => { const t = g.to.split(',').filter(x => CBY[x] && x !== S.cur); return t.length ? pick(t) : null; };
function eraGoKid(yr) {
  if (!eraOn() || yr >= NOW_Y || S.age < 1 || S.age >= 18 || S.mig || S.refugee || !withParents()) return;
  const g = eraGoAt(yr, true); if (!g || !chance(g.p * g.w(true) * g.auto)) return;
  S.flags['hg_' + g.k] = 1;
  const T = ERA_GO_T()[g.k], to = eraGoDest(g); if (!to) return;
  if (g.kind === 'boat' && chance(g.die)) { log(T.kid, 'bad', T.f); die('drown', "Chết đuối trên biển trên đường chạy nạn"); return; }
  if (g.kind === 'boat' && chance(g.caught)) { eff({ h: -6 }); log(T.kid + ' ' + "Nhưng chưa kịp ra khơi thì đã bị bắt và đưa trở về.", 'bad', T.f); return; }
  log(T.kid, 'big', T.f); emigrate(to, false, g.kind === 'boat'); S.flags.exile = g.k;
}
DEC.histgo = {
  ok: p => !!(p && ERA_GO.find(g => g.k === p.k)) && !S.mig,
  build: p => { const T = ERA_GO_T()[p.k];
    return { title: T.t, body: T.b, fact: T.f, choices: [{ k: 'go', label: T.go, sub: p.k === 'boat' ? "Phải liều cả mạng sống" : p.k === 'mideast' || p.k === 'pado' ? "Thu nhập ↑ · phải xa gia đình" : "Bắt đầu lại ở một đất nước xa lạ" }, { k: 'stay', label: "Ở lại", sub: '' }] }; },
  apply: (k, p) => {
    const g = ERA_GO.find(x => x.k === p.k); S.flags['hg_' + g.k] = 1; if (k === 'stay') return false;
    const m = incomeAt(C(), 0.5);
    if (g.kind === 'temp') { const x = Math.max(S.income, m * 0.6) * 2.4; S.money += x; book("Tiền dành dụm từ hợp đồng ở nước ngoài", x); eff({ h: -2, so: -3, hl: -2 });
      return L`사우디아라비아 건설 현장에서 2년을 일하고 돌아왔습니다. 뜨거운 모래바람 속에서 모은 돈은 ${wonStr(x)}입니다.`; }
    if (g.kind === 'contract') {
      const x = Math.max(S.income, m * 0.6) * 3; S.money += x; book("Tiền dành dụm từ hợp đồng ở nước ngoài", x); eff({ so: -2 });
      if (chance(g.stay) && CBY.DEU) { emigrate('DEU', false, false); return L`서독에서 3년 계약을 마쳤습니다. 모은 돈 ${wonStr(x)}을 들고 그대로 독일에 남아 살기로 했습니다.`; }
      return L`서독에서 3년 계약을 마치고 돌아왔습니다. 고향에 부친 돈과 남은 돈이 ${wonStr(x)}입니다.`;
    }
    const to = eraGoDest(g); if (!to) return false;
    if (g.kind === 'boat') {
      const fare = Math.max(0, S.money) * 0.5; S.money -= fare; book("Tiền đi thuyền", -fare);
      if (chance(g.die)) { die('drown', "Chết đuối trên biển trên đường chạy nạn"); return false; }
      if (chance(g.caught)) { eff({ h: -10 }); return { t: "Chưa kịp ra khơi, bạn đã bị bắt, bị giam mấy tháng rồi mới được thả. Số vàng trả tiền thuyền không bao giờ lấy lại được.", k: 'bad' }; }
      emigrate(to, false, true); S.flags.exile = g.k;
      return L`며칠을 바다 위에서 버틴 끝에 난민촌에 닿았고, 이듬해 ${CBY[to].ko}에 정착하게 되었습니다.`;
    }
    emigrate(to, S.edu >= 4, false); S.flags.exile = g.k;
    return L`가방 몇 개에 살림을 담아 ${ro(CBY[to].ko)} 떠났습니다. 낯선 나라에서 새로 시작합니다.`;
  }
};
const cityAt = (iso, i) => !!S.city && S.city === (CITIES[iso] || '').split(',')[i];
const CR_INT = new Set(['teacher', 'prof', 'doctor', 'engineer', 'lawyer', 'finance', 'artist', 'musician', 'actor', 'designer', 'nurse', 'healthtech']);
const CR_CADRE = new Set(['civil', 'police', 'clerk']);
function crCls() {
  if (S.flags.crCls) return S.flags.crCls;
  if (S.born !== 'CHN') return (S.flags.crCls = 'r');
  return (S.flags.crCls = chance(S.q >= 5 ? 0.35 : S.q === 4 ? 0.08 : 0.01) ? 'b' : 'r');
}
const crParP = p => (CR_INT.has(p.job) ? 0.13 : CR_CADRE.has(p.job) ? 0.08 : 0.008) + (crCls() === 'b' ? 0.12 : 0);
const eraParK = p => !AGE12 && p && p.crT != null && S.cur === 'CHN' && eraOn() && eraYr() >= p.crT && eraYr() <= 1970 ? 2 : 1;
const eraParWhy = () => "sự đàn áp thời Cách mạng Văn hóa";
const czPar = () => ['CZE', 'SVK'].includes(S.cur) && eraOn() && eraYr() < 1990 && [S.fam.dad, S.fam.mom].some(p => p && p.czT != null);
const eraAdmK = () => czPar() ? 0.35 : 1;
const eraAdmNote = () => czPar() ? ' ' + "Vì bố mẹ bị quy là “gia đình không đáng tin cậy”, người ta nói bạn sẽ khó vào được đại học." : '';
const eraAdmWhy = () => czPar() ? ' ' + "Người ta nói đó là do “đánh giá chính trị” của bố mẹ." : '';
const JUNTA_J = new Set(['factory', 'miner', 'construct', 'welder', 'mechanic', 'electric', 'garment', 'driver', 'warehouse']);
const KHM_J = new Set(['teacher', 'prof', 'doctor', 'nurse', 'civil', 'clerk', 'engineer', 'lawyer', 'finance', 'police', 'soldier', 'healthtech']);
function polJail(yrs, why) {
  S.flags.lastJob = isWorking() ? S.job : S.flags.lastJob; S.job = 'prison'; S.flags.polPr = why; S.flags.polWhy = why;
  S.flags.prisonUntil = S.age + yrs; S.flags.prisonLen = yrs; S.flags.prisonY0 = S.stats.polY || 0; S.flags.paroleAsked = 1;
  if (S.school) { S.school = null; S.schoolY = 0; }
  eff({ h: -12, so: -4, hl: -3 }); S.yearMark = 'loss';
}
function eraRole(a, add, out) {
  if (!eraOn() || out.length >= 2 || S.job === 'prison' || S.serveLeft > 0 || S.flags.hideCN || studyAway()) return;
  const yr = eraYr(), iso = S.cur, F = S.eraF; if (yr == null || yr >= NOW_Y || !F) return;
  const after = id => { const e = S.queue.find(x => x.type === 'hist' && x.id === 'H|' + id); return { qat: e ? Math.min(0.96, e.at + 0.04) : 0.3 + rnd() * 0.4 }; };
  if (iso === 'CHN' && (yr === 1966 || yr === 1967) && a >= 12 && a <= 19 && !S.done.histrg && S.school && chance((S.urban ? 0.75 : 0.3) * (yr === 1966 ? 1 : 0.5))) return add('histrg', after('c_cr'));
  if (iso === 'KOR' && yr >= 1974 && yr <= 1987 && S.school === 'uni' && !S.done.histdemo && chance(0.35)) return add('histdemo', { k: 'kor' });
  if (iso === 'CHN' && yr === 1989 && ['uni', 'grad', 'phd'].includes(S.school) && !S.done.histdemo && chance(0.85)) { F.h['H|c_tam'] = 1; return add('histdemo', { k: 'tam', qat: 0.3 }); }
  if (AGE12) return;
  const junta = (iso === 'ARG' && yr >= 1976 && yr <= 1979) || (iso === 'CHL' && yr >= 1973 && yr <= 1977);
  if (junta && a >= 17 && a <= 35 && S.urban && !S.mig && !S.done.histjunta && chance(S.school === 'uni' ? 0.15 : S.job === 'teacher' ? 0.08 : JUNTA_J.has(S.job) && S.formal ? 0.05 : 0)) return add('histjunta', after(iso === 'ARG' ? 'ar_76' : 'cl_73'));
  if (iso === 'KHM' && (yr === 1975 || yr === 1976) && a >= 18 && a <= 55 && !S.done.histkhm && (S.edu >= 2 || KHM_J.has(S.job) || KHM_J.has(S.flags.lastJob)) && chance(yr === 1975 ? 0.5 : 0.4)) return add('histkhm', after('kh_75'));
}
function eraRoleYear(yr) {
  const F = S.eraF, a = S.age, iso = S.cur, f = S.fam, q = (id, at) => { if (!F.h['R|' + id] && !S.queue.some(e => e.id === 'R|' + id)) queue(at != null ? at : 0.15 + rnd() * 0.75, 'hist', 'R|' + id); };
  if (iso === 'CHN') {
    for (const key of ['dad', 'mom']) {
      const p = f[key]; if (!p || p.absent) continue;
      if (yr >= 1966 && yr <= 1968 && a <= 35 && p.alive && p.crT == null && chance(crParP(p))) { p.crT = yr; q('crp|' + key); }
      if (p.crT != null && yr === 1969 && p.alive && (CR_INT.has(p.job) || CR_CADRE.has(p.job)) && chance(0.6)) q('crs|' + key);
      if (p.crT != null && p.crR == null && yr >= 1978 && yr <= 1981 && (yr === 1981 || chance(0.45))) { p.crR = yr; q('crr|' + key); }
    }
    if (yr === 1979 && S.flags.crCls === 'b') q('crc');
    const rg = S.flags.crRG;
    if (rg === 'join') {
      if (yr === 1967 && chance(0.5)) q('rgf');
      if ((yr === 1967 || yr === 1968) && !AGE12 && chance(0.002)) q('rgd');
      if (yr >= 2010 && a >= 55 && chance(0.015)) q('rga');
    }
    if ((rg === 'join' || rg === 'help') && yr >= 1978 && yr <= 1980 && chance(0.3)) q('rgt');
  }
  if (iso === 'KOR') {
    const d = S.flags.hdK;
    if (yr === 1980 && cityAt('KOR', 5) && a >= 8) q('gwj', 0.38);
    if (d && d.exp != null && d.exp < 1984 && yr === 1984 && !(S.serveLeft > 0) && S.job !== 'prison' && S.edu < 4 && a <= 32) q('kre', 0.12);
    if (d && (d.k === 'lead' || d.k === 'join') && yr === 1987 && a >= 18 && S.job !== 'prison') q('k87p', 0.45);
    if (d && (d.jail || d.exp != null || d.dr) && yr >= 2001 && yr <= 2012 && chance(0.2)) q('krec');
  }
  if (iso === 'TUR' && (yr === 1980 || yr === 1981) && a >= 16 && a <= 35 && S.job !== 'prison') {
    const p = (S.sex === 'M' ? 1 : 0.2) * (['uni', 'usec'].includes(S.school) ? 0.12 : (JUNTA_J.has(S.job) && S.formal) || S.job === 'teacher' ? 0.09 : 0.04) * (yr === 1980 ? 0.6 : 0.4);
    if (chance(p)) q('tur', yr === 1980 ? 0.8 + rnd() * 0.15 : null);
  }
  if (iso === 'CZE' || iso === 'SVK') {
    for (const key of ['dad', 'mom']) {
      const p = f[key]; if (!p || p.absent || !p.alive) continue;
      if (yr === 1970 && a <= 20 && p.czT == null && (CR_INT.has(p.job) || p.job === 'civil') && chance(0.25)) { p.czT = yr; q('czp|' + key); }
      if (yr === 1990 && p.czT != null) q('czr|' + key);
    }
  }
  if ((S.flags.exile === 'arg76' && yr === 1983) || (S.flags.exile === 'chl73' && yr === 1990)) { if (S.cur !== S.born) q('exn'); }
}
function eraRoleFire(id, key) {
  const f = S.fam, p = key ? f[key] : null, lb = key === 'mom' ? "mẹ" : "bố";
  if (id === 'crp') {
    const t = CR_INT.has(p.job) ? L`${iga(lb)} '반동 학술 권위'로 몰려, 목에 팻말을 건 채 비판 대회에 세워졌습니다. 그날 밤 ${lb}께서는 아무 말도 하지 않으셨습니다.`
      : CR_CADRE.has(p.job) ? L`${iga(lb)} '자본주의의 길을 걷는 실권파'로 몰려 일터에서 비판 대회에 세워졌습니다. 집에 돌아오지 못하시는 밤이 이어졌습니다.`
      : crCls() === 'b' ? L`할아버지 대에 땅이 있었다는 이유로 우리 집에 '흑오류' 딱지가 붙었습니다. 홍위병이 몰려와 ${lb}의 책과 사진을 불태웠습니다.`
      : L`${iga(lb)} 지나가며 한 말 한마디로 고발당해 비판 대회에 세워졌습니다.`;
    eff({ h: S.age < 25 ? -8 : -5, so: -3 });
    return log(t, 'bad', "Trong Cách mạng Văn hóa, khoảng 36 triệu người bị đàn áp chính trị, và ước tính 750.000 đến 1,5 triệu người đã thiệt mạng (Walder và Su 2003)");
  }
  if (id === 'crs') { if (!p.alive) return; eff({ h: -3 }); return log(L`${iga(lb)} 시골의 '5·7 간부학교'로 보내져, 몇 해 동안 농사일을 하며 집에 오지 못하셨습니다.`, 'bad'); }
  if (id === 'crr') {
    const fact = "Từ năm 1978, hơn 3 triệu vụ án oan ở Trung Quốc đã được minh oan (Nhân dân Nhật báo, ngày 1 tháng 6 năm 1989)";
    if (p.alive) { eff({ h: 4 }); return log(L`${iga(lb)} 누명을 벗었습니다. 명예를 되돌려 준다는 통지서를 받아 든 날, ${lb}께서는 한참 동안 말이 없으셨습니다.`, 'big', fact); }
    return log(L`세상을 떠난 ${lb}의 누명이 벗겨졌다는 통지서가 왔습니다. 너무 늦게 온 종이 한 장을 오래 들여다보았습니다.`, 'note', fact);
  }
  if (id === 'crc') { eff({ h: 5 }); return log("Những nhãn mác thành phần xuất thân như “địa chủ”, “phú nông” được xóa bỏ. Đó là cái mác đã đeo bám gia đình gần 30 năm.", 'big', "Tháng 1 năm 1979, Đảng Cộng sản Trung Quốc quyết định xóa bỏ nhãn mác địa chủ, phú nông"); }
  if (id === 'rgf') return log("Hồng vệ binh chia thành nhiều phe và bắt đầu đánh nhau. Đồng chí hôm qua, hôm nay đã thành kẻ thù.", 'ev');
  if (id === 'rgd') { if (S.job === 'prison' || S.cur !== 'CHN') return; return die('pol', "xung đột vũ trang giữa các phe phái Hồng vệ binh"); }
  if (id === 'rgt') {
    if (S.flags.crRG === 'help') { eff({ h: 4, so: 2 }); return log("Người giáo viên ấy đã trở lại trường, nắm lấy tay bạn và nói vẫn nhớ những chiếc bánh bao được để trước cửa vào mùa đông năm ấy.", 'warm'); }
    eff({ so: -2 }); return log("Bạn nghe tin người giáo viên mà nhóm bạn từng đưa ra phê đấu năm ấy đã trở lại trường. Mỗi lần chạm mặt trên đường, bạn không dám ngẩng đầu lên.", 'note');
  }
  if (id === 'rga') return log(chance(0.5) ? "Mấy chục năm sau, bạn tìm đến người giáo viên năm ấy, cúi đầu xin lỗi. Người ấy im lặng hồi lâu rồi nắm lấy tay bạn." : "Mấy chục năm sau, bạn tìm đến người giáo viên năm ấy, nhưng người ấy đã qua đời. Bạn đặt hoa trên mộ và đứng đó rất lâu.", 'note', "Năm 2013–2014, vài cựu Hồng vệ binh, trong đó có Trần Tiểu Lỗ và Tống Bân Bân, đã công khai xin lỗi về những việc làm thời ấy");
  if (id === 'gwj') { eff({ h: -10, so: 3 }); return log("Tháng 5, trên đường phố Gwangju, quân thiết quân luật đã nổ súng vào người dân. Suốt mười ngày, thành phố bị cắt đứt với bên ngoài, và hàng xóm nấu cơm nắm mang ra cho những người ngoài đường.", 'bad'); }
  if (id === 'kre') {
    const d = S.flags.hdK, fact = "Tháng 12 năm 1983, các biện pháp tự do hóa học đường cho phép 1.363 sinh viên bị đuổi học từ tháng 5 năm 1980 được trở lại trường";
    if (!S.fam.married && chance(S.age <= 28 ? 0.7 : 0.3)) {
      if (isWorking()) S.flags.lastJob = S.job;
      S.school = 'uni'; S.schoolY = Math.min(3, d.sy || 0); S.job = 'student'; S.yearMark = 'edu'; eff({ h: 6 });
      return log("Các biện pháp tự do hóa học đường cho phép sinh viên bị đuổi học được trở lại trường. Bạn quay về trường, tiếp tục việc học còn dang dở.", 'big', fact);
    }
    return log("Các biện pháp tự do hóa học đường cho phép sinh viên bị đuổi học được trở lại trường. Nhưng bạn đã đi trên một con đường khác nên không quay lại trường.", 'ev', fact);
  }
  if (id === 'k87p') { eff({ h: 3, so: 3 }); return log("Tháng 6, bạn lại xuống đường. Đến cả những nhân viên văn phòng thắt cà vạt cũng cùng hô khẩu hiệu.", 'warm'); }
  if (id === 'krec') { eff({ h: 2 }); return log("Bạn được công nhận là người tham gia phong trào dân chủ hóa. Những gì xảy ra năm ấy cuối cùng cũng được ghi vào hồ sơ của nhà nước.", 'note'); }
  if (id === 'tur') { eff({ h: -10, so: -3, hl: -2 }); return log("Sau cuộc đảo chính, binh lính ập vào nhà lúc rạng sáng. Bạn bị bắt đi, bị thẩm vấn mấy tuần liền mới được thả.", 'bad', "Sau cuộc đảo chính năm 1980, 650.000 người bị bắt giữ và thẩm vấn, 1,68 triệu người bị đưa vào danh sách theo dõi (Ủy ban điều tra của Quốc hội Thổ Nhĩ Kỳ, 2012)"); }
  if (id === 'czp') {
    eff({ h: S.age >= 6 ? -5 : -2 }); if (S.age < 18 && S.q > 1) S.q--;
    return log(L`1968년 '프라하의 봄'을 지지했다는 이유로 ${iga(lb)} 일터에서 쫓겨나, 보일러실에서 석탄을 나르는 일을 하게 되었습니다.`, 'bad', "Đảng Cộng sản Tiệp Khắc, năm 1968 có gần 1,7 triệu đảng viên, đã mất khoảng 500.000 người qua các đợt “thẩm tra chính trị”, và nhiều giáo viên, học giả, nhà báo bị mất việc (Library of Congress Country Studies)");
  }
  if (id === 'czr') { if (!p.alive) return; eff({ h: 3 }); return log(L`벨벳 혁명 뒤 ${iga(lb)} 20년 만에 명예를 되찾았습니다.`, 'big'); }
  if (id === 'exn') { eff({ h: 5 }); return log("Bạn nghe tin chế độ quân sự ở quê nhà đã chấm dứt. Giờ đây con đường trở về đã mở ra.", 'big'); }
}
DEC.histrg = {
  ok: () => S.cur === 'CHN',
  build: () => {
    const b = crCls() === 'b', ch = [];
    if (!b) ch.push({ k: 'join', label: "Đeo băng tay Hồng vệ binh", sub: "Hầu hết các bạn trong lớp đều tham gia · báo chữ to phê phán giáo viên" });
    ch.push({ k: 'out', label: "Đứng ngoài, ở yên trong nhà", sub: "Sẽ bị gọi là “phái tiêu dao”" }, { k: 'help', label: "Lén giúp giáo viên chủ nhiệm", sub: "Bị phát hiện thì chính mình cũng bị phê phán" });
    return { title: "Được hỏi có muốn làm Hồng vệ binh không", body: (eraYr() === 1966 ? "Trường học đã ngừng dạy." : "Trường đã đóng cửa mấy tháng nay.") + ' ' + "Các bạn cùng lớp đeo băng tay đỏ, rủ nhau dán báo chữ to tố cáo giáo viên chủ nhiệm là “quyền uy học thuật phản động”." + (b ? ' ' + "Nhưng nghe nói con cái những gia đình có “thành phần xuất thân” xấu thì không được làm Hồng vệ binh." : ''),
      fact: "Chỉ riêng tháng 8–9 năm 1966, ở Bắc Kinh đã có 1.772 người bị Hồng vệ binh giết hại, nhiều người trong số đó là giáo viên (số liệu chính thức của thành phố Bắc Kinh, 1980)", choices: ch };
  },
  apply: k => {
    S.flags.crRG = k;
    if (k === 'join') { eff({ so: 3, h: 2 }); const far = S.urban && eraYr() === 1966 && chance(0.5);
      return { t: far ? "Bạn đã đeo băng tay đỏ. Bạn đi tàu miễn phí lên Bắc Kinh, và từ giữa biển người chật kín quảng trường Thiên An Môn, bạn trông thấy Chủ tịch Mao từ xa." : "Bạn đã đeo băng tay đỏ. Trong buổi phê đấu người giáo viên, bạn cùng các bạn khác hô khẩu hiệu.", k: 'ev',
        f: far ? "Từ tháng 8 đến tháng 11 năm 1966, Mao Trạch Đông đã tiếp 11–12 triệu Hồng vệ binh tại quảng trường Thiên An Môn" : null }; }
    if (k === 'out') { eff({ sm: 3, so: -2 }); return { t: "Bạn không tham gia Hồng vệ binh mà ở nhà, trùm chăn đọc những cuốn sách lén kiếm được. Những đứa trẻ như vậy bị gọi là “phái tiêu dao”.", k: 'ev' }; }
    if (chance(crCls() === 'b' ? 0.4 : 0.25)) { S.flags.crRG = 'caught'; eff({ h: -8, so: -6 }); return { t: "Bạn bị phát hiện khi lén để bánh bao ở nhà người giáo viên, và phải tự phê bình trước cả lớp.", k: 'bad' }; }
    eff({ h: 2 }); return { t: "Ban đêm, bạn lén để mấy chiếc bánh bao trước cửa nhà người giáo viên. Không ai biết cả.", k: 'warm' };
  }
};
DEC.histdemo = {
  ok: p => !!p && (p.k === 'kor' ? S.cur === 'KOR' && S.school === 'uni' : S.cur === 'CHN'),
  build: p => {
    const yr = eraYr();
    if (p.k === 'kor') return { title: "Biểu tình trong khuôn viên trường",
      body: yr < 1980 ? "Một cuộc biểu tình phản đối Hiến pháp Yushin đang diễn ra trong trường. Biện pháp khẩn cấp số 9 trừng phạt cả những lời phê phán chế độ Yushin. Bạn bè cùng khoa rủ bạn cùng tham gia."
        : yr === 1980 ? "Đây là “Mùa xuân Seoul”. Những cuộc biểu tình đòi dỡ bỏ thiết quân luật và công bố lộ trình dân chủ hóa đang lan từ trường học ra đường phố. Bạn bè cùng khoa rủ bạn cùng tham gia."
        : "Một cuộc biểu tình phản đối chính quyền quân sự đang diễn ra trong trường. Cảnh sát mặc thường phục đi lại cả trong trường, và có tin đồn rằng ai bị bắt sẽ bị giam hoặc bị đuổi học. Bạn bè cùng khoa rủ bạn cùng tham gia.",
      fact: yr < 1980 ? "Trong 589 vụ vi phạm biện pháp khẩn cấp, 191 vụ liên quan đến phong trào sinh viên, và 282 vụ chỉ vì những lời phê phán chế độ Yushin trong lúc uống rượu hay trong giờ học (Ủy ban Sự thật và Hòa giải Hàn Quốc)"
        : yr <= 1984 ? "Từ tháng 9 năm 1980 đến tháng 11 năm 1984, 1.152 sinh viên từng tham gia biểu tình đã bị cưỡng ép nhập ngũ (Ủy ban làm rõ sự thật quá khứ của Bộ Quốc phòng Hàn Quốc)" : "Chỉ riêng vụ biểu tình chiếm giữ Đại học Konkuk tháng 10 năm 1986, 1.289 sinh viên đã bị bắt giam cùng lúc",
      choices: [{ k: 'lead', label: "Đi đầu", sub: "Có thể bị bắt giam hoặc bị đuổi học" }, { k: 'join', label: "Theo sau cùng mọi người", sub: "Có thể bị bắt đi" }, { k: 'study', label: "Ở lại thư viện", sub: '' }] };
    return { title: "Ra quảng trường?",
      body: cityAt('CHN', 1) ? "Tháng 4, sau khi cựu Tổng Bí thư Hồ Diệu Bang qua đời, sinh viên tụ tập tại quảng trường Thiên An Môn, bắt đầu kêu gọi chấm dứt tham nhũng và đòi tự do báo chí. Tháng 5, cuộc tuyệt thực bắt đầu, và từ mọi trường học, từng đoàn người nối nhau kéo ra quảng trường."
        : "Cuộc biểu tình của sinh viên bắt đầu từ quảng trường Thiên An Môn ở Bắc Kinh đã lan đến thành phố này. Từ mọi trường học, từng đoàn người nối nhau xuống đường.",
      fact: "Tháng 5 năm 1989, các cuộc biểu tình lan ra khoảng 400 thành phố của Trung Quốc, và riêng ở Bắc Kinh đã có gần 1 triệu người xuống đường",
      choices: [{ k: 'lead', label: "Ở lại quảng trường, cùng tuyệt thực", sub: "Có những người ở lại đến cùng" }, { k: 'join', label: "Cùng tham gia tuần hành", sub: '' }, { k: 'stay', label: "Ở lại trường", sub: '' }] };
  },
  apply: (k, p) => {
    const yr = eraYr();
    if (p.k === 'kor') {
      const d = S.flags.hdK = { k, yr };
      if (k === 'study') return { t: "Bạn ở lại thư viện. Qua khung cửa sổ, bạn thấy khói hơi cay bốc lên.", k: 'ev' };
      if (k === 'join') {
        if (chance(0.04)) { d.held = 1; eff({ h: -4, so: 1 }); return { t: "Bạn đi biểu tình, bị cảnh sát bắt đi và được thả sau vài ngày.", k: 'bad' }; }
        eff({ so: 3, h: 1 }); return { t: "Bạn đứng sau bạn bè, cùng hô khẩu hiệu. Nước mắt giàn giụa vì khói hơi cay, cả nhóm tản vào các con hẻm.", k: 'big' };
      }
      if (!chance(0.2)) { eff({ so: 4, h: -1 }); return { t: "Bạn đi đầu hô khẩu hiệu trước cổng trường, cùng bạn bè chạy qua làn khói hơi cay.", k: 'big' }; }
      const draft = S.sex === 'M' && !S.served && yr >= 1980 && yr <= 1984 && chance(0.4);
      d.exp = yr; d.sy = S.schoolY; S.school = null; S.schoolY = 0;
      if (draft) {
        const cs = eraCS(C(), yr); d.dr = 1; S.serveLeft = Math.max(2, Math.round((cs && cs[0] || 30) / 12)); S.job = 'service'; S.done.service = 1; S.flags.svcDelay = null; S.yearMark = 'svc'; eff({ h: -10, so: -4, hl: -2 });
        return { t: "Bạn bị bắt khi đang dẫn đầu cuộc biểu tình. Bạn bị đuổi học và lập tức bị đưa vào quân đội. Ở đơn vị, người ta liên tục yêu cầu bạn viết báo cáo về động tĩnh của bạn bè cùng trường.", k: 'bad',
          f: "Từ tháng 9 năm 1980 đến tháng 11 năm 1984, 1.152 sinh viên từng tham gia biểu tình đã bị cưỡng ép nhập ngũ (Ủy ban làm rõ sự thật quá khứ của Bộ Quốc phòng Hàn Quốc)" };
      }
      d.jail = 1; polJail(chance(0.6) ? 1 : 2, 'kor'); S.flags.polRec = 1988;
      return { t: "Bạn bị bắt giam khi đang dẫn đầu cuộc biểu tình. Nhà trường gửi giấy báo đuổi học.", k: 'bad' };
    }
    const bj = cityAt('CHN', 1), d = S.flags.hdC = { k };
    if (k === 'stay') return { t: "Bạn ở lại trường. Ngày ngày, chiếc radio trong ký túc xá phát tin tức từ quảng trường.", k: 'ev' };
    if (k === 'join') { eff({ so: 3, h: -4 }); return { t: (bj ? "Bạn cùng tham gia tuần hành. Người dân bên đường trao nước và bánh mì." : "Bạn cùng tham gia tuần hành trên phố. Người dân bên đường vẫy tay chào.") + ' ' + "Sau ngày 4 tháng 6, không ai còn nhắc đến chuyện mùa xuân năm ấy nữa.", k: 'bad' }; }
    if (chance(0.12)) { d.jail = 1; polJail(ri(1, 3), 'chn'); S.flags.polRec = yr + 12; return { t: "Sau cuộc trấn áp ngày 4 tháng 6, bạn bị chỉ đích danh là một trong những người cầm đầu cuộc biểu tình và bị bắt.", k: 'bad' }; }
    eff({ h: -10, so: 2 });
    return { t: (bj ? "Bạn đã cùng tuyệt thực. Rạng sáng ngày 4 tháng 6, giữa tiếng súng, bạn rời khỏi quảng trường." : "Bạn đã cùng ngồi biểu tình ở quảng trường. Khi tin tức từ Bắc Kinh truyền đến, các cuộc biểu tình dừng lại.") + ' ' + "Mùa thu năm ấy, bạn phải viết bản khai chi tiết nộp cho nhà trường, rằng mùa xuân đó mình đã ở đâu và làm gì.", k: 'bad' };
  }
};
DEC.histjunta = {
  ok: () => (S.cur === 'ARG' || S.cur === 'CHL') && !S.mig,
  build: () => {
    const arg = S.cur === 'ARG', who = S.school === 'uni' ? "một người bạn cùng khoa" : S.job === 'teacher' ? "một đồng nghiệp dạy cùng trường" : "một người cùng công đoàn";
    return { title: "Một người bạn đã bị bắt đi", body: L`새벽에 무장한 사람들이 ${who}의 집에 들이닥쳤고, 그 뒤로 아무도 그를 보지 못했습니다. 그의 수첩에 내 이름이 적혀 있었을지도 모릅니다.`,
      fact: arg ? "Dưới chế độ quân sự Argentina giai đoạn 1976–1983, số người mất tích theo hồ sơ chính thức là 8.961 người, theo ước tính của các tổ chức nhân quyền là 30.000 người. Trong số người mất tích, 30% là công nhân, 21% là sinh viên, và 70% ở độ tuổi 16–30 (CONADEP, “Nunca Más”)"
        : "Dưới chế độ Pinochet, khoảng 3.200 người bị giết hoặc mất tích, và khoảng 38.000 người bị giam giữ như tù chính trị và bị tra tấn (báo cáo Rettig và Valech)",
      choices: [{ k: 'leave', label: "Rời khỏi đất nước", sub: "Lưu vong · không biết bao giờ mới về được" }, { k: 'hide', label: "Chuyển nhà, cắt đứt với nhóm", sub: "Sống lặng lẽ, ẩn mình" }, { k: 'stay', label: "Sống như trước", sub: '' }] };
  },
  apply: k => {
    const arg = S.cur === 'ARG';
    if (k === 'leave') {
      const ds = (arg ? ['ESP', 'MEX', 'VEN', 'FRA', 'SWE', 'ITA'] : ['SWE', 'VEN', 'MEX', 'FRA', 'CAN', 'ESP']).filter(x => CBY[x]); const to = pick(ds);
      emigrate(to, S.edu >= 4, false); S.flags.exile = arg ? 'arg76' : 'chl73'; eff({ h: -6, so: -6 });
      return { t: L`며칠 만에 짐을 꾸려 ${ro(CBY[to].ko)} 떠났습니다. 언제 돌아갈 수 있을지 알 수 없었습니다.`, k: 'big' };
    }
    if (k === 'hide') eff({ so: -4, h: -3 });
    if (chance((k === 'hide' ? 0.015 : 0.05) * (arg ? 1 : 1.5))) {
      if (chance(arg ? 0.75 : 0.1)) { log("Không lâu sau, bạn cũng bị bắt đi giữa đêm.", 'bad'); die('pol', "bị chế độ quân sự cưỡng bức mất tích"); return false; }
      eff({ h: -20, hl: -8, so: -6 });
      return { t: "Không lâu sau, bạn cũng bị bắt đi. Bạn bị giam trong một trại bí mật suốt mấy tháng rồi mới được thả. Những gì xảy ra ở đó, rất lâu sau bạn vẫn không thể nói ra.", k: 'bad' };
    }
    return k === 'hide' ? { t: "Bạn chuyển sang khu phố khác và cắt đứt mọi liên lạc với nhóm. Đêm này qua đêm khác, bạn giật mình tỉnh giấc vì tiếng gõ cửa.", k: 'bad' }
      : { t: "Bạn vẫn sống như trước. Mỗi lần có chiếc xe lạ chạy chậm qua, bạn lại nín thở.", k: 'bad' };
  }
};
DEC.histkhm = {
  ok: () => S.cur === 'KHM',
  build: () => ({ title: "Angkar hỏi", body: "Tại cuộc họp làng, một cán bộ của “Angkar” lên tiếng: những ai từng đi học, từng là giáo viên, bác sĩ hay viên chức, hãy bước lên. Angkar sẽ giao việc mới, và ai muốn thì sẽ được đưa trở về Phnôm Pênh.",
    fact: "Trong hơn 20.000 giáo viên ở Campuchia đầu thập niên 1970, mười năm sau chỉ còn khoảng 5.000 người (Library of Congress Country Studies)",
    choices: [{ k: 'step', label: "Giơ tay bước lên", sub: "Nghe nói sẽ được giao việc mới" }, { k: 'hide', label: "Giả làm nông dân không biết chữ", sub: "Vứt kính đi, ít nói" }] }),
  apply: k => {
    if (k === 'hide') { eff({ h: -6, so: -3 }); return { t: "Bạn vứt cặp kính và giả làm một nông dân không biết chữ. Bạn ít nói, để không lộ ra mình là người có học.", k: 'bad' }; }
    if (chance(0.6)) { log("Những người giơ tay bị chở đi trên những chiếc xe tải, và không bao giờ trở lại.", 'bad'); die('geno', "Cuộc thảm sát của Khmer Đỏ"); return false; }
    eff({ h: -15, hl: -10, so: -6 }); return { t: "Bạn bị chở đi trên xe tải cùng những người đã giơ tay. Trong trại “cải tạo”, bạn sống sót qua nhiều năm lao động khổ sai.", k: 'bad' };
  }
};
function eraPool(pool) {
  if (!eraOn()) return;
  const yr = eraYr();
  if (yr < NOW_Y && S.age >= 18 && !S.mig && !S.refugee && S.job !== 'prison' && !(S.serveLeft > 0)) { const g = eraGoAt(yr, false); if (g && chance(g.p * g.w(false))) pool.push(['histgo', { k: g.k }]); }
  if (S.flags.aiQ || !isWorking() || S.age > 60) return;
  const ai = aiK(S.job); if (ai && ai[1] >= 1.25 && aiT() >= 0.2 && chance(0.25)) pool.push(['aiwork', {}]);
}
DEC.aiwork = {
  ok: () => isWorking(),
  build: () => ({ title: "Cách làm việc đang thay đổi", body: L`회사에 AI 도구가 들어오면서 ${shortJob(S.job)} 일의 많은 부분을 기계가 하게 되었습니다. 같은 일을 하던 동료 몇 명은 이미 자리를 잃었습니다.`,
    fact: "Trong số những việc làm chịu tác động của AI, khoảng một nửa có thể tăng năng suất nhờ AI, số còn lại có thể bị giảm bớt việc (IMF 2024)" + ' — ' + "dự báo",
    choices: [{ k: 'learn', label: "Học cách dùng công cụ AI", sub: "Kiến thức↑ giữ việc làm" }, { k: 'move', label: "Thử chuyển sang nghề chăm sóc con người", sub: "tìm việc mới" }, { k: 'keep', label: "Làm như trước", sub: '' }] }),
  apply: k => {
    S.flags.aiQ = S.age;
    if (k === 'learn') { S.flags.aiSkill = 1; eff({ sm: 4, h: -1 }); S.pct = Math.min(payTop(), S.pct + 0.02); return "Đêm nào bạn cũng học các công cụ mới. Công việc nhanh hơn hẳn."; }
    if (k === 'move') { S.flags.aiMove = S.age; S.flags.huntAt = S.age; eff({ sm: 2 }); return "Bạn bắt đầu tìm hiểu các công việc trong lĩnh vực chăm sóc và y tế."; }
    return false;
  }
};
function eraNew(o) { S.era = o.era; S.by = o.by; S.eraF = ERA_F0(); }
const artOK = c => { const y = eraYr(); return y == null || y >= (c.ppp > 15000 && c.p !== 'ssa' ? 1996 : 2004); };
function eraLayText() {
  if (!eraOn()) return null;
  const ai = aiK(S.job);
  if (ai && ai[1] > 1.2 && aiT() > 0.15 && chance(0.5)) return L`회사가 AI 시스템을 들이며 ${shortJob(S.job)} 자리를 줄였습니다. 일자리를 잃었습니다.`;
  const e = eraEcon(); if (e && e.lay >= 1.5 && chance(0.6)) return e.k === 'covid' || e.k === 'pan' ? "Nơi làm việc đóng cửa vì phong tỏa, bạn đã mất việc." : "Công ty cắt giảm nhân sự vì suy thoái. Bạn đã mất việc.";
  return null;
}
const eraUrbK = c => { if (!c || !c.yr) return 1; const a10 = eraAt(CBY[c.id], c.yr - 10).agr; return 1 + clamp((a10 - c.agr) / 6, 0, 3); };
function eraPcalK(c) { const n = CBY[c.id]; return clamp(Math.exp(0.739 * (c.ter - n.ter) / 100 - 0.048 * (c.agr - n.agr) / 100 + 0.168 * Math.log(c.ppp / n.ppp)), 0.3, 3); }
const REFLECT_AGES = [5, 15, 30, 50, 70];
const rqN = () => callName(S.name);
const rqPoor = () => S.q <= 2 && (CBY[S.born] || C()).ppp < 15000;
const REFLECT_Q = {
  5: [[() => "Hồi năm tuổi, cuộc sống của bạn thế nào? Hãy nhớ lại một điều mà hồi đó bạn coi là đương nhiên.", () => pick(["Bữa cơm tối ngày nào cũng có trên bàn", "Được đưa đi bệnh viện mỗi khi ốm", "Chiếc xích đu ở sân chơi gần nhà"])],
    [() => L`다섯 살 ${rqN()}에게 지금 가장 필요한 것은 무엇일까요?`, () => rqPoor() ? pick(["Một bữa tối no bụng", "Nước sạch", "Một con đường để được đi học"]) : pick(["Một người lớn ở bên chơi cùng", "Cuốn truyện tranh được đọc cho nghe trước giờ ngủ", "Một khoảng sân để tha hồ chạy nhảy"])]],
  15: [[() => "Năm mười lăm tuổi, trường học là nơi thế nào với bạn?", () => pick(["Nơi đến để gặp bạn bè", "Nơi lúc nào cũng chạy theo thi cử"])],
    [() => L`${iga(rqN())} 꿈꿀 수 있는 미래와, 열다섯의 당신이 꿈꾸던 미래는 얼마나 달랐을까요?`, () => pick(["Trước mặt tôi có nhiều con đường để chọn hơn", "Lòng mơ ước có lẽ cũng giống nhau thôi"])]],
  30: [[() => L`${rqN()}의 삶과 당신의 삶은 무엇이 같고, 무엇이 다른가요?`, () => "Đều mệt mỏi vì công việc, nhưng sống ở những nơi khác nhau"],
    [() => L`${iga(rqN())} 오늘 가장 고마워할 일은 무엇일까요?`, () => pick(["Hôm nay vẫn còn được làm việc", "Gia đình mạnh khỏe"])]],
  50: [[() => L`${iga(rqN())} 당신의 이웃이었다면, 어떤 이야기를 나누고 싶나요?`, () => pick(["Chuyện nuôi dạy con cái", "Những điều từng muốn làm khi còn trẻ"])],
    [() => "Trong cuộc đời, ai là người đã giữ cho bạn vững vàng?", () => "Người bạn đã gọi điện lúc khó khăn"]],
  70: [[() => L`한 번뿐인 삶에서, ${iga(rqN())} 가장 소중히 여긴 것은 무엇이었을까요?`, () => "Những bữa tối bên gia đình"],
    [() => "Bạn muốn được nhớ đến là người như thế nào?", () => "Một người mà ai ở bên cũng thấy dễ chịu"]],
};
const EDU_SENT = ["Không được đi học.", "Học hết tiểu học.", "Học đến trung học cơ sở.", "Học hết trung học phổ thông.", "Tốt nghiệp đại học.", "Học lên đến sau đại học."];
const QSHORT_E = ['', "một gia đình thuộc nhóm nghèo nhất", "một gia đình không mấy dư dả", "một gia đình bình thường", "một gia đình khá giả", "một gia đình thuộc nhóm giàu nhất"];
const rankStr = p => (p >= 0.5 ? L`상위 ${Math.max(1, Math.round((1 - p) * 100))}%` : L`하위 ${Math.max(1, Math.round(p * 100))}%`);
const shortJob = id => frSx(shortJob0(id), S && S.sex);
const shortJob0 = id => {
  if (id === 'leader' && S && S.flags.leaderTitle) return S.flags.leaderTitle;
  if (id === 'clergy' && S && S.flags.voc) return clergyTitle();
  if (id === 'retired' && S && typeof clergyOld === 'function' && clergyOld()) return clergyEmer();
  if (id === 'soldier' && S && S.flags.offc != null && !rankOf('soldier')) return "sĩ quan cấp úy";
  if (id === 'athlete' && S && (S.ath || S.flags.athSp)) return L`프로 ${(S.ath && S.ath.sp) || S.flags.athSp} 선수`;
  if (id === 'idol' && S && S.idol && S.idol.solo) return "ca sĩ solo";
  if (id === 'boardpro' && S) return boardGame() === 'go' ? "Kỳ thủ cờ vây chuyên nghiệp" : "Kiện tướng cờ vua";
  if (id === 'coach' && S && S.flags.gameCoach) return "Huấn luyện viên thể thao điện tử";
  if (id === 'creator' && S && S.flags.gameStream) return "Streamer trò chơi điện tử";
  if (id === 'owner' && S && (S.flags.bizScale || (S.flags.bizL && rankOf('owner') >= 2))) return "giám đốc một công ty lớn";
  if (id === 'dayc' && S) return S.age < 18 ? "Ở nhà" : ddRich(C()) ? "Đến trung tâm sinh hoạt ban ngày" : "Ở nhà cùng gia đình";
  if (id === 'seeking' && S && typeof wdOn === 'function' && wdOn()) return "Ở nhà";
  const t = S && typeof rankTitle === 'function' ? rankTitle(id) : null; if (t) return t;
  if (id === 'clerk' && S && S.flags.ofPath === 'sales') return "nhân viên kinh doanh";
  if (id === 'clerk' && S && S.flags.ofPath === 'spec') return L`${ofField()} 담당`;
  if (id === 'prof' && S) return S.flags.profT != null ? "trợ lý giáo sư" : "nhà nghiên cứu";
  if (id === 'owner' && S && S.flags.ownT) return S.flags.ownT;
  return JOBS[id] ? JOBS[id].n.replace(/ \(.*\)$|（.*）$/, '') : '';
};
function mainWork() {
  const X = S.exp || {}; let best = '', by = 0;
  for (const id in X) if (JOBS[id] && !NONWORK.includes(id) && !RARE_JOBS.includes(id) && X[id][0] > by) { best = id; by = X[id][0]; }
  if (!best || by < 3) return '';
  const n = shortJob(best); return lcVi(n);
}
function lifeRoad() {
  if (!S) return null;
  const f = S.flags || {}, X = S.exp || {}, yrs = id => (X[id] && X[id][0]) || 0;
  const had = id => S.job === id || yrs(id) > 0 || !!f['ex_' + id] || f.lastJob === id;
  const R = (t, s, k) => ({ t, s, k: k || 'road' });
  if (f.pope) return R(L`교황 ${f.pope}가 된 삶`, L`콘클라베에서 교황 ${f.pope}로 뽑힌 삶이었어요.`);
  const eg = f.egg || {};
  if (eg.nobel != null && f.nobelF && typeof NOBEL_N === 'function') { const n = NOBEL_N()[f.nobelF]; return R(L`노벨 ${eul(n)} 받은 삶`, L`노벨 ${eul(n)} 받은 삶이었어요.`); }
  if (eg.fields != null) return R("Cuộc đời nhận Huy chương Fields", "Đó là cuộc đời của một nhà toán học nhận Huy chương Fields.");
  if (eg.turing != null) return R("Cuộc đời nhận giải Turing", "Đó là một cuộc đời nhận giải Turing.");
  if (eg.oscar != null) return R("Cuộc đời nhận giải Oscar", "Đó là cuộc đời của một diễn viên nhận giải Oscar.");
  if (eg.grammy != null) return f.grammyL ? R("Cuộc đời nhận giải Grammy Latin", "Đó là cuộc đời của một nghệ sĩ âm nhạc nhận giải Grammy Latin.") : R("Cuộc đời nhận giải Grammy", "Đó là cuộc đời của một nghệ sĩ âm nhạc nhận giải Grammy.");
  if (f.leaderTitle) return R(L`${f.leaderTitle}까지 오른 삶`, L`${f.leaderTitle}까지 오른 삶이었어요.`);
  if (had('mp')) return R("Cuộc đời trở thành đại biểu quốc hội", "Đó là một cuộc đời trở thành đại biểu quốc hội.");
  if (f.space) return R("Cuộc đời từng bay vào vũ trụ", "Đó là một cuộc đời từng bay vào vũ trụ.");
  if (had('astro')) return R("Cuộc đời được chọn làm phi hành gia", "Đó là một cuộc đời được chọn làm phi hành gia.");
  if (f.medal && f.para) return R(L`패럴림픽 ${f.medal}메달을 딴 삶`, L`패럴림픽에서 ${f.medal}메달을 딴 삶이었어요.`);
  if (f.olympian && f.para) return R("Cuộc đời góp mặt tại Paralympic", "Đó là một cuộc đời từng góp mặt tại Paralympic.");
  if (f.medal) return R(L`올림픽 ${f.medal}메달을 딴 삶`, L`올림픽에서 ${f.medal}메달을 딴 삶이었어요.`);
  if (f.olympian) return R("Cuộc đời góp mặt tại Olympic", "Đó là một cuộc đời từng góp mặt tại Olympic.");
  if (f.athStar) return R("Cuộc đời trở thành vận động viên hàng đầu giải đấu", "Đó là một cuộc đời trở thành vận động viên hàng đầu của giải đấu.");
  const sp = (S.ath && S.ath.sp) || f.athSp;
  if (sp && f.natTeam != null) return R(L`${sp} 국가대표로 뛴 삶`, L`${sp} 국가대표로 뛴 삶이었어요.`);
  if (sp && (S.job === 'athlete' || f.exAthlete || yrs('athlete'))) return R(L`프로 ${sp} 선수로 뛴 삶`, L`프로 ${sp} 선수로 뛴 삶이었어요.`);
  if (S.idol && S.idol.hit === 2) return R("Cuộc đời thần tượng K-pop có album bán được 1 triệu bản", "Đó là cuộc đời của một thần tượng K-pop có album bán được hơn 1 triệu bản.");
  if (S.idol && S.idol.hit) return R("Cuộc đời thần tượng K-pop đứng đầu các chương trình âm nhạc", "Đó là cuộc đời của một thần tượng K-pop từng đứng đầu các chương trình âm nhạc.");
  if (S.idol) return R("Cuộc đời ra mắt làm thần tượng K-pop và đứng trên sân khấu", "Đó là một cuộc đời ra mắt làm thần tượng K-pop và đứng trên sân khấu.");
  if (f.musStar) return R("Cuộc đời có một bài hát ăn khách lớn", "Đó là một cuộc đời từng hát một bài hát ăn khách lớn.");
  if (had('musician') || f.exMusician) return R("Cuộc đời nghệ sĩ âm nhạc trên sân khấu", "Đó là cuộc đời của một nghệ sĩ âm nhạc trên sân khấu.");
  if (f.artStar) return R("Cuộc đời mở triển lãm ở một bảo tàng mỹ thuật lớn", "Đó là một cuộc đời từng mở triển lãm ở một bảo tàng mỹ thuật lớn.");
  if (had('artist') || f.exArtist) return R("Cuộc đời gắn bó với hội họa", "Đó là một cuộc đời gắn bó với việc vẽ tranh.");
  if (had('actor') || f.exActor) return R("Cuộc đời diễn xuất trên sân khấu và màn ảnh", "Đó là một cuộc đời diễn xuất trên sân khấu và màn ảnh.");
  if (f.dncStar) return R("Cuộc đời vũ công đảm nhận vai chính", "Đó là cuộc đời của một vũ công từng đảm nhận vai chính trên sân khấu.");
  if (had('dancer') || f.exDancer) return R("Cuộc đời nhảy múa trên sân khấu", "Đó là một cuộc đời gắn bó với những điệu múa trên sân khấu.");
  if (f.gamer && f.gamer.champ === 2) return R("Cuộc đời tuyển thủ thể thao điện tử vô địch thế giới", "Đó là cuộc đời của một tuyển thủ thể thao điện tử từng nâng cúp vô địch thế giới.");
  if (had('progamer') || f.exGamer) return R("Cuộc đời tuyển thủ thể thao điện tử chuyên nghiệp", "Đó là một cuộc đời thi đấu thể thao điện tử chuyên nghiệp.");
  if (had('boardpro') || f.exBoard) return boardGame() === 'go' ? R("Cuộc đời kỳ thủ cờ vây chuyên nghiệp", "Đó là một cuộc đời bên bàn cờ vây với tư cách kỳ thủ chuyên nghiệp.") : R("Cuộc đời kiện tướng cờ vua", "Đó là một cuộc đời bên bàn cờ vua với tư cách kiện tướng.");
  if (['clerk', 'engineer', 'dev', 'finance'].some(id => rankOf(id) >= 3)) return R("Cuộc đời vươn lên đến chức tổng giám đốc", "Đó là một cuộc đời vươn lên đến chức tổng giám đốc.");
  if (f.bizScale) return R("Cuộc đời gây dựng một công ty có tiếng", "Đó là một cuộc đời gây dựng một trong những công ty có tiếng của đất nước.");
  if (eg.rescue != null) return R("Cuộc đời từng cứu sống người khác", "Đó là một cuộc đời từng cứu sống người khác.");
  if (f.council) { const w = mainWork(); return w ? R(L`${ro(w)} 일하며 지역 의원을 지낸 삶`, L`${ro(w)} 일하며 지역 의원을 지낸 삶이었어요.`) : R("Cuộc đời làm đại biểu hội đồng địa phương", "Đó là một cuộc đời làm đại biểu hội đồng địa phương."); }
  if (f.defSK != null) return R("Cuộc đời vượt biên giới và đến được Hàn Quốc", "Đó là một cuộc đời liều mạng vượt biên giới và đến được Hàn Quốc.");
  if (f.defector) return R("Cuộc đời liều mạng vượt biên giới", "Đó là một cuộc đời liều mạng vượt biên giới.");
  const lived = new Set((S.years || []).map(y => y.cur)).size;
  if (lived >= 3) return R(L`${lived}개 나라에서 산 삶`, L`${lived}개 나라에서 산 삶이었어요.`, 'lands');
  let best = '', by = 0;
  for (const id in X) if (JOBS[id] && !NONWORK.includes(id) && !RARE_JOBS.includes(id) && X[id][0] > by) { best = id; by = X[id][0]; }
  if (best && by >= 3) {
    const r = rankOf(best), lb = r && ladder(best), st = lb && lb[r - 1];
    if (st && st.k === 'p') return R(L`${by}년을 일해 ${st.n}까지 오른 삶`, L`${by}년을 일해 ${st.n}까지 오른 삶이었어요.`, 'work');
    if (st) return R(L`${by}년을 일해 ${iga(st.n)} 된 삶`, L`${by}년을 일해 ${iga(st.n)} 된 삶이었어요.`, 'work');
    const n = lcVi(shortJob(best));
    if (n) return R(L`${ro(n)} ${by}년을 일한 삶`, L`${ro(n)} ${by}년을 일한 삶이었어요.`, 'work');
  }
  const k = ((S.fam && S.fam.kids) || []).filter(x => !x.cut).length;
  if (k) return k === 1 ? R("Cuộc đời nuôi dạy một người con", "Đó là một cuộc đời nuôi dạy một người con.", 'kids') : R(L`자녀 ${k}명을 키운 삶`, L`자녀 ${k}명을 키운 삶이었어요.`, 'kids');
  return null;
}
function lifeItemsS() {
  if (!S) return [];
  const f = S.flags || {}, X = S.exp || {}, yrs = id => (X[id] && X[id][0]) || 0, had = id => S.job === id || yrs(id) > 0 || !!f['ex_' + id] || f.lastJob === id;
  const out = new Set(), sc = (S.years || []).map(y => y.sc).filter(Boolean), hob = id => (S.hobbies || []).some(h => h.id === id && h.lv >= 3);
  const pets = sc.map(s => s.split('|')[7] || '');
  if (pets.includes('d') || (S.pet && S.pet.k === 'd')) out.add('l_dog');
  if (pets.includes('c') || (S.pet && S.pet.k === 'c')) out.add('l_cat');
  if (S.fam && (S.fam.married || S.fam.marriedAt != null)) out.add('l_wed');
  if (S.fam && (S.fam.kids || []).length) out.add('l_fam');
  if (S.edu >= 4) out.add('l_diploma');
  if (new Set((S.years || []).map(y => y.cur)).size >= 3 || hob('travel')) out.add('l_map');
  if (f.medal || f.olympian || f.athStar || had('athlete')) out.add('l_medal');
  if (f.space || had('astro')) out.add('l_rocket');
  if (f.leaderTitle || had('mp') || f.council) out.add('l_flag');
  if (had('musician') || f.exMusician || hob('music')) out.add('l_guitar');
  if (had('artist') || f.exArtist || had('creator') || hob('art')) out.add('l_easel');
  const work = (ids, n) => ids.some(id => yrs(id) >= n);
  if (work(['teacher', 'prof', 'lawyer'], 5) || hob('reading')) out.add('l_books');
  if (work(['farm', 'farmhand', 'agbiz', 'herder'], 5) || hob('garden')) out.add('l_basket');
  if (work(['fisher'], 3) || hob('fishing')) out.add('l_rod');
  if (work(['construct', 'mechanic', 'electric', 'artisan', 'welder', 'miner'], 5)) out.add('l_tools');
  if (work(['doctor', 'nurse', 'care', 'healthtech'], 3)) out.add('l_kit');
  if (work(['cook'], 3) || hob('cooking')) out.add('l_pot');
  if (work(['dev', 'engineer', 'designer', 'finance', 'clerk', 'callc'], 5)) out.add('l_laptop');
  if (hob('photo')) out.add('l_camera');
  if (f.sportTry || f.youth || (S.hobbies || []).some(h => isSportH(h) && h.lv >= 3)) out.add('l_ball');
  if (hob('crafts')) out.add('l_yarn');
  return [...out];
}
const WORK_T = () => ({ war: "Chiến tranh", refugee: "Những người buộc phải rời bỏ nhà cửa", defector: "Những người rời Triều Tiên và tìm nơi định cư", girls: "Tảo hôn",
  care: "Trẻ em lớn lên thiếu sự chăm sóc của bố mẹ", child: "Những đứa trẻ không sống qua 5 tuổi", mother: "Những người mẹ qua đời khi sinh con", disability: "Khuyết tật và rào cản",
  hunger: "Nạn đói", malaria: "sốt rét", tb: "bệnh lao", hiv: "HIV", dementia: "Sa sút trí tuệ", disaster: "Thiên tai", water: "Nước sạch", school: "Trẻ em phải đi làm thay vì đến trường" });
const WORK_F = () => ({
  war: "Năm 2025 có 65 cuộc xung đột vũ trang có sự tham gia của nhà nước, nhiều nhất kể từ năm 1946, và khoảng 244.600 người thiệt mạng vì bạo lực có tổ chức (Uppsala Conflict Data Program, 2026)",
  refugee: "Cuối năm 2025, có 117,8 triệu người buộc phải rời bỏ nhà cửa vì chiến tranh, bạo lực và đàn áp (UNHCR Global Trends 2025)",
  defector: "Đến nay đã có hơn 34.000 người rời Triều Tiên đến Hàn Quốc (Bộ Thống nhất Hàn Quốc)",
  girls: "Mỗi năm có khoảng 12 triệu trẻ em gái kết hôn trước 18 tuổi, và 640 triệu phụ nữ và trẻ em gái đang sống hiện nay đã kết hôn khi còn nhỏ (UNICEF, 2023)",
  care: "Cứ khoảng 1.000 trẻ em trên thế giới thì có 1 em lớn lên trong các cơ sở nuôi dưỡng như trại trẻ mồ côi hay mái ấm (UNICEF, 2024)",
  child: "Năm 2024, 4,9 triệu trẻ em qua đời trước sinh nhật lần thứ năm, phần lớn vì những nguyên nhân có thể ngăn ngừa bằng cách chăm sóc rẻ tiền và đã được kiểm chứng (UN IGME, 2025)",
  mother: "Năm 2023, khoảng 260.000 phụ nữ qua đời vì mang thai và sinh nở, gần như cứ 2 phút lại có một người, và phần lớn những ca tử vong ấy có thể ngăn ngừa được (WHO, 2025)",
  disability: "Khoảng 1,3 tỷ người, tức cứ 6 người trên thế giới thì có 1 người, đang sống với khuyết tật đáng kể (WHO, 2022)",
  hunger: "Năm 2025, khoảng 645 triệu người, tức 7,8% dân số thế giới, phải chịu cảnh đói kéo dài (Báo cáo SOFI về tình trạng an ninh lương thực và dinh dưỡng thế giới, 2026)",
  malaria: "Năm 2024, sốt rét gây ra khoảng 282 triệu ca bệnh và khoảng 610.000 ca tử vong, phần lớn ở châu Phi (Báo cáo Sốt rét Thế giới 2025 của WHO)",
  tb: "Năm 2024, 10,7 triệu người mắc bệnh lao và 1,23 triệu người qua đời. Lao là bệnh có thể phòng ngừa và chữa khỏi nếu được điều trị (Báo cáo Lao Toàn cầu 2025 của WHO)",
  hiv: "Năm 2025, 41 triệu người sống chung với HIV, 1,2 triệu người mới nhiễm và 570.000 người qua đời vì các bệnh liên quan đến AIDS (UNAIDS, 2026)",
  dementia: "Có 57 triệu người đang sống chung với chứng sa sút trí tuệ, và mỗi năm có gần 10 triệu người mới được chẩn đoán (WHO)",
  disaster: "Năm 2025, 358 thảm họa như động đất, lũ lụt và bão đã cướp đi 16.607 sinh mạng và ảnh hưởng đến 110 triệu người (CRED EM-DAT, 2026)",
  water: "Năm 2024, 2,1 tỷ người không có nước uống an toàn tại nhà, và 106 triệu người uống thẳng nước sông, nước ao chưa qua xử lý (WHO·UNICEF JMP, 2025)",
  school: "Năm 2024, có 138 triệu trẻ em phải lao động, trong đó 54 triệu em làm những công việc gây hại cho sức khỏe và sự an toàn (ILO·UNICEF, 2025)" });
const WORK_ORG = {
  en: {
    war: [['ICRC', 'https://www.icrc.org/en/what-we-do/protection'], ['Doctors Without Borders', 'https://msf.org.uk/issues/conflict-and-war']],
    refugee: [['UNHCR', 'https://www.unhcr.org/what-we-do'], ['Norwegian Refugee Council', 'https://www.nrc.no/who-we-are/about-us']],
    girls: [['Girls Not Brides', 'https://www.girlsnotbrides.org/en/about-us/'], ['UNFPA', 'https://www.unfpa.org/child-marriage']],
    care: [["SOS Children's Villages", 'https://www.sos-childrensvillages.org/our-work'], ['Hope and Homes for Children', 'https://www.hopeandhomes.org/what-we-do/']],
    child: [['UNICEF', 'https://www.unicef.org/health/maternal-newborn-and-child-survival'], ['New Incentives', 'https://www.newincentives.org/how']],
    mother: [['UNFPA', 'https://www.unfpa.org/maternal-health'], ['Doctors Without Borders', 'https://www.doctorswithoutborders.org/what-we-do/medical-issues/maternal-health']],
    disability: [['Humanity & Inclusion', 'https://www.hi-us.org/en/action/inclusion'], ['Sightsavers', 'https://www.sightsavers.org/disability-and-inclusion/']],
    hunger: [['World Food Programme', 'https://www.wfp.org/emergency-relief'], ['Helen Keller Intl', 'https://helenkellerintl.org/combatting-vitamin-a-deficiencies/']],
    malaria: [['Against Malaria Foundation', 'https://www.againstmalaria.com/Nets.aspx'], ['Malaria Consortium', 'https://www.malariaconsortium.org/resources/seasonal-malaria-chemoprevention']],
    tb: [['The Global Fund', 'https://www.theglobalfund.org/en/tuberculosis/'], ['Partners In Health', 'https://www.pih.org/programs/tuberculosis']],
    hiv: [['UNAIDS', 'https://www.unaids.org/en/whoweare/about'], ['The Global Fund', 'https://www.theglobalfund.org/en/hivaids/']],
    dementia: [["Alzheimer's Disease International", 'https://www.alzint.org/what-we-do/']],
    disaster: [['IFRC', 'https://www.ifrc.org/our-work/disasters-climate-and-crises'], ['ShelterBox', 'https://shelterbox.org/what-we-do/']],
    water: [['WaterAid', 'https://www.wateraid.org/us/what-does-wateraid-do'], ['charity: water', 'https://www.charitywater.org/our-work']],
    school: [['Global Partnership for Education', 'https://www.globalpartnership.org/what-we-do/access-education'], ['UNICEF', 'https://www.unicef.org/education']],
  },
};
const WORK_ORDER = ['refugee', 'war', 'defector', 'girls', 'care', 'child', 'mother', 'disability', 'hunger', 'malaria', 'tb', 'hiv', 'dementia', 'disaster', 'water', 'school'];
const WORK_DC = { war: 'war', geno: 'war', nut: 'hunger', mal: 'malaria', tb: 'tb', hiv: 'hiv', dem: 'dementia', mat: 'mother', disa: 'disaster' };
function worksOf(st, n = 2) {
  if (!st || !st.flags) return [];
  const f = st.flags, d = st.deathAt || {}, a = d.age != null ? d.age : st.age, done = st.done || {}, fam = st.fam || {}, kids = fam.kids || [];
  const P = fam.partner, ill = f.illHad || {}, met = new Set();
  if (WORK_DC[d.cause]) met.add(WORK_DC[d.cause]);
  else if (a < 5) met.add('child');
  if (f.refEver || st.refugee) met.add('refugee');
  if (done.war) met.add('war');
  if (f.defector) met.add('defector');
  if (f.cmWed != null || (done.cmarry && fam.marriedAt != null && fam.marriedAt < 18)) met.add('girls');
  if ((f.raised && (f.raised.k === 'foster' || f.raised.k === 'home')) || kids.some(k => k.placed && k.placed.k === 'care') || (fam.given && fam.given.length)) met.add('care');
  if (kids.some(k => k.dA != null && k.dA < 5)) met.add('child');
  if (P && P.dc === 'mat') met.add('mother');
  if (st.dis) met.add('disability');
  if (f.ev_hungry != null || f.ev_stunt != null || (done.disaster && f.disK === 'D')) met.add('hunger');
  if (ill.mal != null || kids.some(k => k.dC === 'mal')) met.add('malaria');
  if (ill.tb != null || f.tbUn != null || (P && P.dc === 'tb') || kids.some(k => k.dC === 'tb')) met.add('tb');
  if ((st.hiv && st.hiv.known) || (P && (P.dc === 'hiv' || (P.hiv && P.hiv.known))) || kids.some(k => k.dC === 'hiv')) met.add('hiv');
  if (P && P.dc === 'dem') met.add('dementia');
  if (done.disaster && ['F', 'Q', 'S'].includes(f.disK)) met.add('disaster');
  if (f.ev_water != null || f.ev_kid_water != null) met.add('water');
  if (f.ev_childwork != null || done.noschool) met.add('school');
  const orgs = WORK_ORG[LANG] || WORK_ORG.en, first = WORK_DC[d.cause] || (a < 5 ? 'child' : null);
  return [first, ...WORK_ORDER].filter((id, i, all) => id && all.indexOf(id) === i && met.has(id) && orgs[id] && orgs[id].length).slice(0, n);
}
function lastWorkLabel() {
  if (S.age < 15) return '—';
  const lj = S.flags.lastJob ? frSx(shortJob(S.flags.lastJob), S.sex) : '';
  if ((S.retired || S.job === 'retired') && typeof clergyOld === 'function' && clergyOld()) return clergyEmer();
  if (S.retired || S.job === 'retired') return lj ? L`${lj} · 은퇴` : "nghỉ hưu";
  if (S.job === 'homemaker') return shortJob('homemaker') || "nội trợ";
  if (!isWorking() && lj) return lj;
  return frSx(shortJob(S.job), S.sex) || '—';
}
function statusShort() {
  let w;
  if (S.age < 6) w = "thời thơ ấu";
  else if (S.serveLeft > 0) w = svcLbl();
  else if (S.school) w = S.school === 'uni' || S.school === 'grad' || S.school === 'phd' ? "học đại học" : "đi học";
  else if (S.retired) w = "nghỉ hưu";
  else w = { childwork: S.flags.cwPaid ? "trẻ đi làm" : "phụ giúp việc nhà", seeking: "đang tìm việc", homemaker: "chăm sóc gia đình", student: "không đi học" }[S.job] || shortJob(S.job);
  if (S.nomad) w += " · dân du mục kỹ thuật số";
  else if (S.office && S.office.lvl === 1) w += " · đại biểu hội đồng địa phương";
  const k = S.fam.kids.filter(x => x.alive).length;
  return `${S.cur !== S.born ? L`${CBY[S.cur].ko}에서 ` : ''}${w}${S.fam.married ? (legalWed() ? " · đã kết hôn" : " · sống chung với bạn đời") : ''}${k ? L` · 자녀 ${k}` : ''}`;
}
function summaryOf(st) {
  const d = st.deathAt || { age: st.age, label: '' };
  return { name: st.name, sex: st.sex, ...(st.trans && st.trans.at != null ? { sx0: 1 } : {}), iso: st.born, city: st.bornCity, urban: st.bornUrban, q: st.q, rel: st.rel, edu: st.edu, major: st.major || null, dr: st.flags.dr != null ? 1 : 0,
    lastJob: st.flags.lastJob || null, retired: !!st.retired, clg: st.retired && st.flags.lastJob === 'clergy' && st.flags.voc && st.flags.voc.ord != null && st.flags.voc.left == null ? 1 : 0, home: st.job === 'homemaker', kids: st.fam.kids.filter(k => !k.cut && !skApartIn(st, k)).length, kidsLost: st.stats.kidsLost, kidsSmall: st.fam.kids.some(k => !k.cut) && st.fam.kids.every(k => k.cut || (st.age - k.bornAt) < 10),
    alc: st.flags.alcEver ? (st.alc ? 1 : 2) : 0, gamb: st.flags.gambEver ? (st.gamb ? 1 : 2) : 0, prisonY: st.stats.prisonY || 0, wr: st.flags.wrongAt != null ? [st.flags.wrongY || (st.job === 'prison' ? (st.stats.prisonY || 0) - (st.flags.prisonY0 || 0) : 0), st.flags.wrongVoid != null ? 1 : 0] : 0, atone: st.flags.atoned != null ? 'f' : ({ mentor: 'm', repay: 'r' })[st.flags.atoneK] || 0, natz: st.flags.natz || null, adopted: st.stats.adopted || 0, campY: st.stats.campY || 0, polY: st.stats.polY ? [st.flags.polWhy || '', st.stats.polY] : null, hd: st.flags.hdK && ['lead', 'join'].includes(st.flags.hdK.k) ? 1 : 0, jx: ['arg76', 'chl73'].includes(st.flags.exile) ? 1 : 0, poly: st.flags.poly || 0, heir: st.flags.heir ? 1 : 0, hs: st.flags.hsch ? [st.flags.hsch.fin || 0] : 0, dream: st.flags.dreamGot || null, dreamG: st.flags.dreamG || 0, kd: st.flags.kidDream || null, tl: (st.flags.talShown || [])[0] || null, def: st.flags.defSK != null ? 2 : st.flags.defector ? 1 : 0,
    fc: st.flags.conv && REL[st.flags.conv.from] && st.flags.conv.from !== st.rel ? [st.flags.conv.from, st.rel, st.flags.conv.at] : null,
    ad: st.adopt && st.adopt.mv != null ? [st.adopt.from, st.adopt.mo, st.adopt.k, st.adopt.bm && st.adopt.bm.met != null ? st.adopt.bm.met : null, st.adopt.kn == null ? 1 : 0, st.adopt.kf ? 1 : 0] : null,
    cur: st.cur, hiv: !!(st.hiv && st.hiv.known), death: { age: d.age, label: (d.label || '').replace(/ \(.*\)$|（.*）$/, ''), cause: d.cause, ...(d.sleep ? { sleep: 1 } : {}) }, ...peopleOf(st, d.age) };
}
function peopleOf(st, age) {
  const f = st.fam, P = f.partner, o = { gk: st.flags.grand || 0, ggk: st.flags.ggrand || 0, care: st.flags.cared || st.flags.careHome || null };
  if (age < 18) return o;
  o.pN = f.marriages || (P ? 1 : 0); o.pU = P ? unionOf(P) : null;
  if (f.married && P && P.alive && !P.divorced) { o.pt = 'now'; o.pY = f.marriedAt != null ? age - f.marriedAt : null; }
  else if (P && P.divorced) { o.pt = 'apart'; if (P.sep) o.pS = 1; }
  else if (P && !P.alive) { o.pt = 'lost'; o.pY = P.endAt != null && f.marriedAt != null ? P.endAt - f.marriedAt : null; }
  else if (!f.dating) o.pt = 'never';
  return o;
}
function makeCompanions(n = 4) {
  const me = S, hk = Object.assign({}, HOOK), out = [];
  for (const k of ['log', 'change', 'decision', 'death', 'year']) HOOK[k] = () => { };
  try {
    for (let i = 0; i < n; i++) {
      newLife(me.mode || 'birth', 60, null, me.era && me.era !== 'now' ? { era: me.era, by: me.by } : null); S.isComp = true; S.phase = 'life';
      const yrs = []; let g = 0;
      while (S.phase === 'life' && g++ < 9000) {
        if (S.pending) { choose(autoChoice(S.pending)); continue; }
        const a = S.age; tick(S.yearSec / 2);
        if (S.age !== a || S.phase !== 'life') yrs[a] = statusShort();
      }
      const sm = summaryOf(S); sm.yrs = yrs;
      out.push(sm);
    }
  } finally { S = me; Object.assign(HOOK, hk); if (typeof ageSync === 'function') ageSync(); }
  S.comps = out;
  return out;
}
function storyOf(o) {
  const c = CBY[o.iso];
  const place = o.urban && o.city ? cityIn(c.ko, o.city) : L`${c.ko} 농촌 마을`;
  const sx = o.sx0 ? "em bé" : o.sex === 'F' ? "bé gái" : "bé trai", ad = o.ad && CBY[o.ad[0]] ? o.ad : null;
  const s = [ad && ad[2] === 'intl' ? (ad[1] >= 12 ? L`${CBY[ad[0]].ko}에서 ${sx}로 태어나, 돌이 지나 ${place}의 ${ro(QSHORT_E[o.q])} 입양되었습니다.` : L`${CBY[ad[0]].ko}에서 ${sx}로 태어나, 생후 ${ad[1]}개월에 ${place}의 ${ro(QSHORT_E[o.q])} 입양되었습니다.`)
    : ad && ad[5] ? L`${sx}로 태어나, ${place}의 아이를 기다리던 ${QSHORT_E[o.q]}에서 후견(카팔라)으로 자랐습니다.` : ad ? L`${sx}로 태어나, ${place}의 아이를 기다리던 ${ro(QSHORT_E[o.q])} 입양되었습니다.` : o.sx0 ? L`${place}의 ${QSHORT_E[o.q]}에서 태어났습니다.` : L`${place}의 ${QSHORT_E[o.q]}에서 ${sx}로 태어났습니다.`];
  if (ad && ad[3] != null && o.death.age >= ad[3]) s.push(L`${ad[3]}세에 낳아 준 어머니를 만났습니다.`);
  const a = o.death.age;
  if (a < 6) { s.push(a === 0 ? L`첫 생일을 맞지 못하고 ${ro(o.death.label)} 세상을 떠났습니다.` : L`${a}살에 ${ro(o.death.label)} 세상을 떠났습니다.`); return capS(s.join(' ')); }
  if (a >= 12) s.push(o.edu >= 4 && o.major && MAJORS[o.major] ? (o.dr ? L`대학원에서 ${eul(MAJORS[o.major].n)} 공부해 박사 학위를 받았습니다.` : L`${o.edu >= 5 ? "ở đại học và cao học" : "ở đại học"} ${eul(MAJORS[o.major].n)} 공부했습니다.`) : o.dr ? "Nhận bằng tiến sĩ." : EDU_SENT[o.edu]);
  const jn = o.lastJob ? frSx(shortJob0(o.lastJob), o.sex) : '';
  if (a >= 18) { if (jn) s.push(o.clg ? L`${ro(jn)} 평생을 섬겼습니다.` : o.retired ? L`${ro(jn)} 일하다 은퇴했습니다.` : L`${ro(jn)} 일했습니다.`); else if (o.home) s.push("Sống chăm lo cho gia đình."); }
  if (a >= 18 && jn && o.kd && o.kd === o.lastJob) s.push("Đó là công việc mơ ước từ thuở nhỏ.");
  if (a >= 15 && o.tl && typeof TAL_STORY === 'function' && TAL_STORY()[o.tl]) s.push(TAL_STORY()[o.tl]);
  if (o.pt) { const y = o.pY, wed = o.pU === 'm';
    if (o.pt === 'now' && y >= 1) s.push(o.pN >= 2 ? L`다시 만난 사람과 ${y}년을 함께 살았습니다.` : wed ? L`배우자와 ${y}년을 함께 살았습니다.` : L`사랑하는 사람과 ${y}년을 함께 살았습니다.`);
    else if (o.pt === 'lost') s.push(y >= 1 ? (wed ? L`배우자와 ${y}년을 함께하다 먼저 떠나보냈습니다.` : L`함께 살던 사람과 ${y}년을 지내다 먼저 떠나보냈습니다.`) : wed ? "Tiễn người bạn đời ra đi trước mình." : "Tiễn người từng chung sống ra đi trước mình.");
    else if (o.pt === 'apart') s.push(o.pS ? "Kết hôn rồi ly thân." : wed ? "Kết hôn rồi chia tay." : "Chung sống với một người rồi chia tay.");
    else if (o.pt === 'never' && a >= 30) s.push("Không kết hôn."); }
  if (o.kids) s.push(o.kidsSmall && !o.kidsLost ? L`아이 ${o.kids}명을 두었습니다.` : L`아이 ${o.kids}명을 키웠${o.kidsLost ? L`고, 그중 ${o.kidsLost}명을 먼저 떠나보냈` : ''}습니다.`);
  if (o.gk) { const g = [o.gk === 1 ? "một người cháu" : L`손주 ${o.gk}명`].concat(o.ggk ? [o.ggk === 1 ? "một người chắt" : L`증손주 ${o.ggk}명`] : []); s.push(L`${eul(listAnd(g))} 보았습니다.`); }
  if (o.care === 'mom' || o.care === 'dad') s.push(o.care === 'mom' ? "Ở bên chăm sóc mẹ lúc tuổi già." : "Ở bên chăm sóc bố lúc tuổi già.");
  if (o.adopted) s.push(o.adopted === 1 ? "Nhận nuôi một đứa trẻ và đón em vào gia đình." : L`아이 ${o.adopted}명을 입양해 가족으로 맞았습니다.`);
  if (o.poly === 1) s.push("Lập một gia đình cùng hai người vợ."); else if (o.poly === 2) s.push("Sống như một gia đình cùng người vợ khác của chồng.");
  if (o.heir) s.push("Nối nghiệp kinh doanh của bố mẹ.");
  if (o.hs) s.push(o.hs[0] ? L`고향에 장학금을 만들어 학생 ${o.hs[0]}명이 학교를 마치도록 도왔습니다.` : "Bạn đã lập quỹ học bổng ở quê nhà.");
  if (o.fc && a >= 18 && o.fc[2] < a) { const [fr, to, at] = o.fc;
    s.push(fr === 'N' ? L`종교 없이 자랐지만 ${at}세에 ${eul(REL[to])} 믿게 되었습니다.` : to === 'N' ? L`${REL[fr]} 집안에서 자랐고, ${at}세에 신앙을 내려놓았습니다.` : L`${REL[fr]} 집안에서 자랐고, ${at}세에 ${ro(REL[to])} 신앙을 옮겼습니다.`); }
  if (o.dream && JOBS[o.dream] && o.dream !== o.lastJob) s.push(o.dream === o.kd ? L`어릴 적 꿈이던 일, ${ro(JOBS[o.dream].n.replace(/ \(.*\)$|（.*）$/, ''))} 일한 적이 있습니다.` : o.dreamG ? L`해 보고 싶던 일, ${ro(JOBS[o.dream].n.replace(/ \(.*\)$|（.*）$/, ''))} 일한 적이 있습니다.` : L`꿈꾸던 일, ${ro(JOBS[o.dream].n.replace(/ \(.*\)$|（.*）$/, ''))} 일한 적이 있습니다.`);
  if (o.def === 2 && o.cur === 'KOR') s.push("Liều mạng vượt biên giới và đến được Hàn Quốc.");
  else if (o.def && o.cur === 'CHN') s.push("Vượt biên giới và sống lẩn trốn ở Trung Quốc.");
  else if (o.cur && o.cur !== o.iso) s.push(L`${ro(CBY[o.cur].ko)} 삶의 터전을 옮겼습니다.`);
  else if (o.def) s.push("Vượt biên giới nhưng bị bắt và đưa trở về.");
  if (o.natz && o.natz !== o.iso && o.def !== 2 && CBY[o.natz]) s.push(L`${CBY[o.natz].ko} 시민이 되었습니다.`);
  if (o.hiv && a >= 15) s.push("Sống chung với HIV.");
  { const wy = o.wr ? o.wr[0] : 0, py = (o.prisonY || 0) - wy;
    if (wy) s.push(o.wr[1] ? L`하지 않은 일로 ${wy}년을 교도소에서 보냈고, 재심에서 무죄를 받았습니다.` : L`하지 않은 일로 ${wy}년을 교도소에서 보냈습니다. 끝내 무죄를 밝히지 못했습니다.`);
    if (py > 0) s.push(L`교도소에서 ${py}년을 보냈습니다.`); }
  if (o.prisonY && o.atone) s.push(o.atone === 'f' ? "Ra tù, tìm về gia đình xin tha thứ, và cuối cùng đã được tha thứ." : o.atone === 'm' ? "Ra tù, giúp đỡ những người trẻ đang bước vào con đường mình từng đi." : "Ra tù, xin lỗi những người bị mình gây hại và dần bù đắp cho họ.");
  if (o.campY) s.push(L`붙잡혀 ${o.campY}년 동안 갇혀 지냈습니다.`);
  if (o.polY) s.push(o.polY[0] === 'chn' ? L`1989년 봄의 일로 ${o.polY[1]}년 동안 갇혀 지냈습니다.` : L`민주화를 요구하다 ${o.polY[1]}년 동안 옥살이를 했습니다.`);
  else if (o.hd) s.push("Thời trẻ, từng xuống đường đòi dân chủ.");
  if (o.jx) s.push("Rời đất nước để tránh chính quyền quân sự.");
  if (o.alc) s.push(o.alc === 2 ? "Vật lộn với rượu nhiều năm và cuối cùng đã vượt qua." : "Đến cuối đời vẫn không bỏ được rượu.");
  if (o.gamb) s.push(o.gamb === 2 ? "Sa vào cờ bạc rồi đứng dậy được." : "Đến cuối cùng vẫn không thoát khỏi cờ bạc.");
  if (o.ad && o.ad[4] && a >= 16) s.push("Đến cuối đời vẫn không biết mình là con nuôi.");
  s.push(o.death.cause === 'suic' ? L`${a}세에 세상을 떠났습니다.` : o.death.cause === 'hom' && o.death.label === CAUSE.hom ? L`${a}세에 누군가의 폭력에 목숨을 잃었습니다.` : o.death.sleep ? L`${a}세에 ${ro(o.death.label)} 잠든 채 조용히 세상을 떠났습니다.` : L`${a}세에 ${ro(o.death.label)} 세상을 떠났습니다.`);
  return capS(s.join(' '));
}
function compStatus(cp, a) {
  if (cp.death.age < a) return cp.death.cause === 'suic' ? L`${cp.death.age}세에 세상을 떠남` : L`${cp.death.age}세에 세상을 떠남 (${cp.death.label})`;
  return cp.yrs[a] || cp.yrs[a - 1] || "còn sống";
}
function compLine(a) {
  if (!S.comps || !S.comps.length) return null;
  return "Những người chào đời trong cùng một giây — " + S.comps.map(cp => L`${callName(cp.name)}(${CBY[cp.iso].ko}): ${compStatus(cp, a)}`).join(' · ');
}
function reflectMirror(a) {
  const b = B(), c = C(), H0 = S.home && CBY[S.home] ? CBY[S.home] : null, y = eraYr();
  const H = H0 && y ? eraAt(H0, y) : H0, surv = (iso, x) => cohortL(iso, S.sex, x), lt = { l: { 5: surv(S.born, 5), 50: surv(S.born, 50), 70: surv(S.born, 70) } };
  const lines = [];
  if (a === 5) {
    lines.push(L`${b.ko}에서는 아이 ${pctStr(1 - lt.l[5], 1)}가 다섯 살 생일을 맞이하지 못합니다. 이 아이는 맞이했습니다.`);
    if (H && H.id !== b.id) lines.push(S.homeG ? L`당신이 태어난 곳으로 짐작한 ${H.ko}에서는 ${pctStr(1 - surv(H.id, 5), 1)}입니다.` : L`당신이 실제로 태어난 ${H.ko}에서는 ${pctStr(1 - surv(H.id, 5), 1)}입니다.`);
  } else if (a === 15) {
    lines.push(S.flags.between && S.job === 'student' ? "Đứa trẻ này đang chọn con đường tiếp theo sau bậc học hiện tại." : S.school ? "Đứa trẻ này hiện đang đi học." : S.fam.married ? (S.flags.wedLeft ? "Đứa trẻ này đã kết hôn và rời ghế nhà trường." : "Đứa trẻ này đã kết hôn.") : "Đứa trẻ này đang đi làm thay vì đến trường.");
    lines.push(L`${b.ko}의 기대 교육연수는 ${b.eys}년${H && H.id !== b.id ? L`, ${eun(H.ko)} ${H.eys}년` : ''}입니다.`);
    if (S.sex === 'F' && b.cm >= 15) lines.push(L`이 나라 여성의 ${b.cm}%는 18세가 되기 전에 결혼합니다.`);
  } else if (a === 30) {
    if (S.income > 0) lines.push(L`이 사람의 한 해 소득은 세계 사람들 가운데 ${rankStr(worldPct(S.income))}에 듭니다.`);
    else lines.push("Người này hiện không có thu nhập.");
    lines.push(L`${c.ko}의 인터넷 이용률은 ${c.net}%, 도시에 사는 사람은 ${c.urb}%입니다.`);
  } else if (a === 50) {
    lines.push(L`같은 해 ${b.ko}에서 태어난 사람 중 ${pctStr(lt.l[50])}가 쉰 살을 맞습니다.`);
    if (H && H.id !== b.id) lines.push(L`${H.ko}에서 태어났다면 ${pctStr(surv(H.id, 50))}였을 겁니다.`);
  } else {
    lines.push(L`같은 해 ${b.ko}에서 태어난 사람 중 ${pctStr(lt.l[70])}만 일흔을 맞습니다.`);
    if (H && H.id !== b.id) lines.push(L`${H.ko}에서는 ${pctStr(surv(H.id, 70))}입니다.`);
  }
  return lines;
}
DEC.reflect = {
  build: () => {
    const a = S.age, r = pick(REFLECT_Q[a] || REFLECT_Q[30]), q = r[0](); S.flags.refQ = q;
    return { title: L`잠시 멈춤 · ${a}세`, body: reflectMirror(a).join(' '), fact: compLine(a), q, ph: L`예: ${r[1]()} (적지 않아도 괜찮아요)`, input: true,
      choices: [{ k: 'write', label: "Ghi lại rồi sống tiếp", sub: "Những gì bạn viết sẽ ở lại trong ghi chép của cuộc đời này" }, { k: 'skip', label: "Giữ trong lòng rồi sống tiếp", sub: '' }] };
  },
  apply: (k, p, text) => {
    const t = (text || '').trim().slice(0, 200);
    if (!t || k === 'skip') return false;
    S.journal = S.journal || []; S.journal.push({ a: S.age, q: S.flags.refQ, t });
    if (typeof crisisNote === 'function') setTimeout(() => crisisNote(t), 1500);
    return { t: `“${t}”`, k: 'note' };
  },
};
function reflectQuiet(a) { const t = reflectMirror(a).join(' '); if (t) log(t, 'ev', compLine(a)); }
const DISH = { NGA: "cơm jollof", GHA: "cơm jollof", ETH: "bánh injera và món hầm wat", ERI: "bánh injera", IND: "đậu dal và bánh roti", PAK: "cơm biryani", BGD: "cà ri cá", NPL: "cơm dal bhat", LKA: "cơm và cà ri", CHN: "sủi cảo", TWN: "mì bò", VNM: "phở", KOR: "canh tương doenjang", PRK: "mì lạnh naengmyeon", JPN: "súp miso", THA: "súp tom yum", IDN: "cơm chiên nasi goreng", MYS: "cơm nasi lemak", PHL: "adobo", MMR: "bún mohinga", KHM: "amok", MEX: "bánh tamale", GTM: "bánh tamale", BRA: "feijoada", ARG: "thịt nướng asado", COL: "bánh arepa", VEN: "bánh arepa", PER: "ceviche", EGY: "koshari", MAR: "tagine", DZA: "couscous", TUN: "couscous", TUR: "súp đậu lăng", IRN: "ghormeh sabzi", IRQ: "dolma", SYR: "kibbeh", SAU: "cơm kabsa", YEM: "saltah", AFG: "cơm Kabuli pulao", UZB: "cơm plov", KAZ: "beshbarmak", RUS: "súp borscht", UKR: "súp borscht", POL: "bánh pierogi", ITA: "lasagna", FRA: "ratatouille", DEU: "súp khoai tây", ESP: "paella", GBR: "shepherd's pie", USA: "súp gà", COD: "fufu", CMR: "ndolé", KEN: "ugali", TZA: "ugali", UGA: "matoke", ZAF: "pap", ZWE: "sadza", MWI: "nsima", ZMB: "nsima", SEN: "thieboudienne", MLI: "thieboudienne", SDN: "ful medames", SOM: "cambuulo", CIV: "attiéké", HTI: "cơm đậu diri kole ak pwa", CUB: "ropa vieja", NER: "dambou", BFA: "tô", TCD: "boule", MDG: "romazava", AGO: "funge", MOZ: "matapa", HKG: "mì hoành thánh", HRV: "sarma", PRI: "cơm đậu arroz con gandules", BIH: "ćevapi", MDA: "mămăligă", ARM: "dolma", LTU: "cepelinai", ALB: "tavë kosi", SVN: "bánh potica", LVA: "đậu Hà Lan xám ăn kèm thịt xông khói", MKD: "tavče gravče", XKX: "bánh flija", BHR: "cơm machboos", TTO: "bánh doubles", EST: "bánh mì lúa mạch đen", CYP: "phô mai halloumi", MUS: "bánh dholl puri", DJI: "skoudehkaris", FJI: "kokoda", COM: "mataba", GUY: "pepperpot", BTN: "ema datshi", MAC: "minchi", LUX: "thịt lợn hun khói Judd mat Gaardebounen", MNE: "kačamak", SUR: "bánh roti", MLT: "bánh pastizzi", MDV: "mas huni", CPV: "cachupa" };
const COOK_DAD_R = { hi: 0.3, eca: 0.22, lac: 0.26, eap: 0.24, ssa: 0.18, sa: 0.1, mena: 0.1 };
const COOK_DAD = { ITA: 0.45, ESP: 0.42, GBR: 0.4, CHE: 0.4, FRA: 0.4, IRL: 0.4, DEU: 0.4, JAM: 0.35, KOR: 0.18, JPN: 0.12,
  ETH: 0.05, TJK: 0.05, EGY: 0.05, NPL: 0.05, YEM: 0.05, DZA: 0.06, UZB: 0.06, AZE: 0.06, TUN: 0.06 };
const dadHome = () => S.fam.dad.alive && !S.fam.dad.absent;
function dishCook() {
  const m = S.fam.mom.alive && !parInPr('mom'), d = dadHome() && !parInPr('dad'), c = CBY[S.born] || C();
  if (m && d) return chance(COOK_DAD[c.id] ?? COOK_DAD_R[c.p] ?? 0.2) ? "bố" : "mẹ";
  if (m) return "mẹ";
  if (d && (!gpAlive('F') || chance(0.6))) return "bố";
  return gpWho('F') || (S.fam.mom.alive ? "mẹ" : "bố");
}
const EARLY_JOBS = new Set(['farm', 'farmhand', 'herder', 'fisher', 'agbiz', 'construct', 'factory', 'garment', 'miner', 'vendor', 'driver', 'delivery', 'cook', 'domestic', 'guard', 'care', 'childwork', 'cleaner', 'warehouse', 'welder']);
const WARM = [
  { id: 'w_dish', a: [4, 40], c: () => S.fam.mom.alive || gpAlive('F') || dadHome(), w: 0.35, run: () => { eff({ h: 2, so: 1 }); return { t: L`${dishCook()}가 만들어 준 ${DISH[S.born] || "bữa cơm nhà"}의 맛은 평생 잊지 못할 것 같습니다.`, k: 'warm' }; } },
  { id: 'w_stars', a: [4, 30], c: () => !S.urban && C().ppp < 9000 && gpAlive('M'), w: 0.3, run: () => { eff({ h: 3 }); return { t: L`전기 없는 밤, 쏟아지는 별 아래에서 ${iga(gpWho('M'))} 옛이야기를 들려주셨습니다.`, k: 'warm' }; } },
  { id: 'w_rain', a: [8, 95], c: () => !S.urban && ['ssa', 'sa'].includes(C().p), w: 0.25, run: () => { eff({ h: 3, so: 1 }); return { t: "Khi cơn mưa đầu mùa mong đợi bấy lâu đổ xuống, cả làng kéo nhau ra ngoài, cười vui.", k: 'warm' }; } },
  { id: 'w_share', a: [6, 95], w: 0.3, run: () => { eff({ so: 3, h: 2 }); const t = faithHidden() ? "Những ngày lễ, bạn chia sẻ đồ ăn với hàng xóm." : S.rel === 'M' ? "Một buổi tối tháng Ramadan, bạn cùng hàng xóm chia nhau bữa iftar." : S.rel === 'H' ? (S.born === 'IDN' ? "Ngày lễ Galungan, nhà nhà dựng cây tre trang trí penjor, và bạn chia sẻ đồ ăn với hàng xóm." : S.born === 'BGD' ? "Một buổi tối lễ Durga Puja, bạn cùng hàng xóm chia nhau những món ăn ngày hội." : "Đêm Diwali, bạn cùng hàng xóm thắp những ngọn đèn nhỏ khắp các ngõ.") : S.rel === 'C' ? "Dịp Giáng sinh, bạn mời một người hàng xóm sống một mình đến cùng dùng bữa." : S.rel === 'B' ? "Ở chùa, bạn cùng hàng xóm chuẩn bị đồ cúng dường." : S.rel === 'J' ? "Một buổi tối ngày Sa-bát, bạn mời người hàng xóm đến ngồi cùng bàn ăn." : "Những ngày lễ, bạn chia sẻ đồ ăn với hàng xóm."; return { t, k: 'warm' }; } },
  { id: 'w_stranger', a: [8, 95], w: 0.2, run: () => { eff({ h: 3 }); return { t: pick(["Khi bạn bị lạc đường, một người lạ đã đi cùng bạn một quãng dài cho đến khi tìm được đường.", "Bạn đang đứng dầm mưa thì một người chưa từng gặp bước tới che ô cho bạn.", S.age < 18 ? "Thiếu tiền vé xe buýt, bạn định xuống xe thì bác tài bảo không sao, cứ ngồi đi." : "Bạn thiếu tiền xe, và người đứng phía sau lặng lẽ trả giúp bạn."]), k: 'warm' }; } },
  { id: 'w_firstpay', a: [14, 40], c: () => isWorking() && S.jobY <= 1 && workYrs() <= 1 && !S.flags.firstPay && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)), w: 1.5, run: () => { S.flags.firstPay = 1; eff({ so: 5, h: 3 }); return { t: L`첫 벌이로 ${S.fam.mom.alive ? "mẹ" : "bố"}께 작은 선물을 드렸습니다. 말없이 오래 바라보셨습니다.`, k: 'warm' }; } },
  { id: 'w_teach', a: [16, 85], c: () => S.edu >= 2, w: 0.2, run: () => { eff({ so: 3, h: 2 }); return { t: eduProbs(C(), 'F', 1, false).p1 < 0.9 ? "Bạn dạy chữ cho lũ trẻ trong xóm. Có một em lần đầu tiên viết được tên mình." : "Bạn giúp con nhà hàng xóm làm bài tập. Vài ngày sau, em chạy sang khoe là mình làm bài kiểm tra rất tốt.", k: 'warm' }; } },
  { id: 'w_otherfaith', a: [10, 80], c: () => { const c = C(); if (['N', 'F'].includes(S.rel) || c.id === 'PRK' || (['CHN', 'VNM', 'LAO', 'CUB'].includes(c.id) && calYr() < 1990)) return false;
      return c.rel.split(',').some(x => !['N', 'F', S.rel].includes(x[0]) && +x.slice(1) >= 8); }, w: 0.25, run: () => { eff({ so: 4, h: 2 }); return { t: "Bạn kết thân với một người bạn khác tôn giáo. Đến dịp lễ của mỗi bên, hai người lại mời nhau đến chung vui.", k: 'warm' }; } },
  { id: 'w_walk', a: [20, 100], c: () => S.fam.married && S.fam.partner && S.fam.partner.alive && !ptAway(), w: 0.3, run: () => { eff({ so: 3, h: 3 }); return { t: noWalk() ? L`${wa(callName(S.fam.partner.name))} 오랜만에 둘이서 동네를 천천히 산책했습니다. 별말 없이도 좋았습니다.` : L`${wa(callName(S.fam.partner.name))} 오랜만에 둘이서 천천히 걸었습니다. 별말 없이도 좋았습니다.`, k: 'warm' }; } },
  { id: 'w_kidlove', a: [18, 75], c: () => S.fam.kids.some(k => k.alive && !k.away && S.age - k.bornAt >= 2 && S.age - k.bornAt < 10), w: 0.35, run: () => { const k = pick(S.fam.kids.filter(k => k.alive && !k.away && S.age - k.bornAt >= 2 && S.age - k.bornAt < 10)); eff({ h: 4, so: 2 });   return { t: L`${iga(callName(k.name))} 잠들기 전에 "사랑해"라고 속삭였습니다.`, k: 'warm' }; } },
  { id: 'w_sunrise', a: [14, 95], c: () => EARLY_JOBS.has(S.job) || (S.retired && S.age >= 60), w: 0.17, run: () => { eff({ h: 2 }); return { t: S.retired ? "Trên đường đi dạo sáng sớm, cảnh mặt trời mọc hôm nay đẹp lạ thường." : "Trên đường đi làm lúc tờ mờ sáng, cảnh mặt trời mọc hôm nay đẹp lạ thường.", k: 'warm' }; } },
  { id: 'w_welcome', a: [16, 95], c: () => !!S.mig && S.age - S.migY < 6, w: 0.5, run: () => { eff({ so: 4, h: 3 }); return { t: "Ở đất nước còn xa lạ, một người hàng xóm mang đồ ăn sang chào đón bạn.", k: 'warm' }; } },
  { id: 'w_voice', a: [16, 95], c: () => !!S.mig && S.migY >= 16 && !famCame() && S.fam.mom.alive && !homeOthers().mom, w: 0.3, run: () => { eff({ so: 2, h: 1 }); return { t: "Mẹ ở quê nhà gửi cho bạn một tin nhắn thoại: “Con có ăn uống đầy đủ không?”", k: 'warm' }; } },
  { id: 'w_lookback', a: [60, 125], w: 0.3, run: () => { eff({ h: 3 }); return { t: "Nhìn lại những năm tháng đã qua, từng gương mặt bạn mang ơn lần lượt hiện về.", k: 'warm' }; } },
  { id: 'w_grandstory', a: [55, 125], c: () => gkAged(3, 125), w: 0.4, run: () => { eff({ so: 3, h: 3 }); const pl = S.bornCity || "ngôi làng", k = !gkNear(3, 125) && gkParent(gkAway(3, 125));
      return { t: k && CBY[k.abroad] ? L`${CBY[k.abroad].ko}에 사는 손주가 다니러 온 날, 내가 태어난 ${pl} 이야기를 들려주었습니다.` : L`손주에게 내가 태어난 ${pl} 이야기를 들려주었습니다.`, k: 'warm' }; } },
  { id: 'w_song', a: [6, 85], w: 0.2, run: () => { eff({ h: 3, so: 2 }); return { t: "Ở bữa tiệc chung của xóm, bạn ca hát nhảy múa đến tận khuya.", k: 'warm' }; } },
  { id: 'w_sib', a: [8, 85], c: () => sibN() > 0, w: 0.2, run: () => { eff({ so: 3 }); return { t: typeof aloneAbroad === 'function' && (aloneAbroad() || farKin()) ? "Gọi video với anh chị em, kể lại chuyện hồi nhỏ, bạn cười đến đau cả bụng." : "Kể lại chuyện hồi nhỏ với anh chị em, bạn cười đến đau cả bụng.", k: 'warm' }; } },
  { id: 'w_oldfriends', a: [25, 90], c: () => S.st.so >= 25 && oldFrHere(), w: 0.25, run: () => { eff({ so: 4, h: 3 }); return { t: "Bạn cùng những người bạn lâu năm tụ họp lại, ôn chuyện cũ đến tận khuya.", k: 'warm' }; } },
  { id: 'w_thanks', a: [22, 85], w: 0.2, run: () => { eff({ so: 3, h: 3 }); return { t: "Người mà bạn từng giúp đỡ mấy năm trước vẫn không quên, gửi lời cảm ơn đến bạn.", k: 'warm' }; } },
  { id: 'w_table', a: [25, 90], c: () => { const h = homeOthers(); return h.pt || h.mom || h.dad || h.step || h.kids.length > 0; }, w: 0.25, run: () => { eff({ so: 3, h: 2 }); return { t: "Cả nhà quây quần bên mâm cơm nấu chu đáo. Mọi người cùng cười vì những chuyện chẳng có gì to tát.", k: 'warm' }; } },
  { id: 'w_neighborkid', a: [30, 95], c: () => S.flags.oldHome !== 'care', w: 0.15, run: () => { eff({ h: 2 }); return { t: "Đứa trẻ nhà bên mỗi lần gặp bạn ngoài đường lại vui vẻ vẫy tay chào.", k: 'warm' }; } },
  { id: 'w_learn', a: [30, 85], w: 0.15, run: () => { eff({ sm: 2, h: 2 }); return { t: "Thứ bạn bắt đầu học khi không còn trẻ nữa đang dần dần quen tay.", k: 'warm' }; } },
  { id: 'w_view', a: [20, 90], w: 0.2, run: () => { eff({ h: 3, hl: 1 }); return { t: "Lâu lắm rồi bạn mới đi xa, đứng ngắm một khung cảnh bao la thật lâu.", k: 'warm' }; } },
  { id: 'w_help', a: [25, 85], w: 0.2, c: () => !careNow(), run: () => { eff({ so: 3, h: 2 }); return { t: "Bạn giúp nhà hàng xóm khuân đồ khi họ chuyển nhà. Buổi tối, nhà ấy mang đồ ăn sang biếu.", k: 'warm' }; } },
  { id: 'w_kidcall', a: [40, 100], c: () => S.fam.kids.some(k => k.alive && k.grown && !k.withMe && !k.stay && !skApart(k) && !k.exOf), w: 0.25, run: () => { eff({ so: 3, h: 3 }); return { t: "Đứa con sống riêng gọi về chẳng vì việc gì: “Con chỉ muốn nghe giọng thôi.”", k: 'warm' }; } },
  { id: 'w_kidgift', a: [38, 90], c: () => S.fam.kids.some(k => k.alive && S.age - k.bornAt >= 18 && S.age - k.bornAt <= 30 && !skApart(k) && !k.exOf), w: 0.2, run: () => { eff({ so: 3, h: 4 }); return { t: "Đứa con mới đi làm dùng đồng lương đầu tiên mua tặng bạn một món quà nhỏ.", k: 'warm' }; } },
  { id: 'w_harvest', a: [25, 95], c: () => !S.urban || S.hobbies.some(h => h.id === 'garden'), w: 0.2, run: () => { eff({ so: 2, h: 2 }); return { t: "Bạn chia rau nhà tự trồng cho hàng xóm cùng ăn.", k: 'warm' }; } },
  { id: 'w_morning', a: [25, 100], w: 0.2, run: () => { eff({ h: 2 }); return { t: "Một buổi sáng yên tĩnh chẳng có việc gì, tách trà ấm bỗng ngon lạ thường.", k: 'warm' }; } },
  { id: 'w_mentor', a: [35, 70], c: () => isWorking() && S.jobY >= 8, w: 0.2, run: () => { eff({ so: 2, h: 2 }); return { t: "Bạn chỉ cho một đồng nghiệp trẻ mới vào nghề những gì mình biết. Bạn chợt nhớ đến người đã dạy mình từ rất lâu.", k: 'warm' }; } },
];
const WARM_MAX = { w_kidlove: 2 };
const JOYS = new Set(['w_oldfriends', 'w_thanks', 'w_table', 'w_neighborkid', 'w_learn', 'w_view', 'w_help', 'w_kidcall', 'w_kidgift', 'w_harvest', 'w_morning', 'w_mentor']);
for (const e of WARM) {
  const c0 = e.c, r0 = e.run, mx = WARM_MAX[e.id] || 1, key = 'wm_' + e.id;
  const joy = JOYS.has(e.id);
  e.c = () => (S.flags[key] || 0) < mx && S.flags.wmY !== S.age && (!joy || S.flags.wjA == null || S.age - S.flags.wjA >= 5) && (!c0 || c0());
  e.run = () => { S.flags[key] = (S.flags[key] || 0) + 1; S.flags.wmY = S.age; if (joy) S.flags.wjA = S.age; return r0(); };
  EVENTS.push(e); EVMAP[e.id] = e;
}
const OJ_P = 0.2, OJ_GAP = 2;
const ojPt = () => { const P = S.fam.partner; return S.fam.married && P && P.alive && !P.divorced && !ptAway() ? P : null; };
const ojKids = () => S.fam.kids.some(k => k.alive);
const OJ_TEACH = new Set(['music', 'fishing', 'cooking', 'garden', 'crafts', 'art', 'photo', 'board']);
const ojTeach = h => h.lv >= 2 && (OJ_TEACH.has(h.id) || h.id.startsWith('sp_')) && !hobBodyOff(h);
const ojWorkY = () => Object.values(S.exp || {}).reduce((m, x) => Math.max(m, (x && x[0]) || 0), 0);
const OLD_JOYS = [
  { id: 'worry', c: () => S.age <= 82, e: { h: 3 }, t: () => "Giờ bạn đã biết rằng phần lớn những điều từng khiến mình thấp thỏm thời trẻ rồi cũng qua. Nỗi lo vơi đi, nhường chỗ cho sự thư thái.",
    f: () => "Một khảo sát trên 340.000 người trưởng thành ở Mỹ cho thấy căng thẳng giảm dần theo tuổi, nỗi lo giảm mạnh sau tuổi 50, còn niềm vui và hạnh phúc lại tăng lên (Stone và cộng sự, PNAS 2010)" },
  { id: 'gkstay', c: () => gkAged(3, 14) && !careNow(), e: { h: 3, so: 2 }, t: () => { const g = !gkNear(3, 14) && gkAway(3, 14), k = gkParent(g);
      if (k && CBY[k.abroad] && !k.alive) return L`${CBY[k.abroad].ko}에 사는 손주가 며칠 다니러 와 묵어 갔습니다. 웃는 얼굴에서 먼저 떠난 ${callName(k.name)}의 모습이 언뜻언뜻 보였습니다.`;
      return k && CBY[k.abroad] ? L`${CBY[k.abroad].ko}에 사는 ${iga(callName(k.name))} 손주를 데리고 찾아와 며칠 묵어 갔습니다. 오랜만에 아침 밥상이 시끌벅적했습니다.` : "Cháu đến chơi cuối tuần và ngủ lại. Lâu lắm rồi bữa sáng mới rộn ràng như vậy."; } },
  { id: 'gkletter', c: () => gkAged(6, 11) && S.age >= 68, e: { h: 3, so: 1 }, t: () => S.flags.illit ? (gkNear(6, 11) ? "Cháu đưa bạn lá thư viết nét chữ nguệch ngoạc rồi đọc to cho bạn nghe. Bạn dán nó ở chỗ dễ thấy và ngắm đi ngắm lại không biết bao nhiêu lần." : "Đứa cháu ở một đất nước xa xôi gửi về một lá thư nét chữ nguệch ngoạc. Người nhà đọc cho bạn nghe, rồi bạn dán nó ở chỗ dễ thấy và ngắm đi ngắm lại không biết bao nhiêu lần.") : gkNear(6, 11) ? "Cháu đưa bạn lá thư viết nét chữ nguệch ngoạc. Bạn dán nó ở chỗ dễ thấy và đọc đi đọc lại không biết bao nhiêu lần." : "Đứa cháu ở một đất nước xa xôi gửi về một lá thư nét chữ nguệch ngoạc. Bạn dán nó ở chỗ dễ thấy và đọc đi đọc lại không biết bao nhiêu lần." },
  { id: 'gkteach', c: () => gkNear(5, 16) && S.hobbies.some(ojTeach), e: { h: 2, so: 2 },
    t: () => { const h = S.hobbies.filter(ojTeach).sort((x, y) => y.lv - x.lv)[0]; return L`손주에게 ${eul(hobbyName(h.id))} 가르쳐 주었습니다.` + ' ' + teachLook(h.id, true); } },
  { id: 'advice', c: () => ojWorkY() >= 10 && (S.retired || S.age >= 70), e: { h: 2, so: 2 }, t: () => "Một đồng nghiệp trẻ ở chỗ làm cũ tìm đến tâm sự chuyện khó khăn. Bạn thấy biết ơn vì công việc mình gắn bó bao năm vẫn còn có ích cho ai đó." },
  { id: 'friends', c: () => S.st.so >= 30 && (S.flags.fGone || 0) < (S.flags.fN || 5) && oldFrHere(), e: { h: 2, so: 3 }, t: () => "Bạn và những người bạn lâu năm bắt đầu gặp nhau mỗi tháng một lần. Chỉ cần hỏi han nhau thôi cũng đủ thấy vững lòng cả tháng." },
  { id: 'routine', e: { h: 2 }, t: () => noWalk() || careNow() ? "Sáng nào bạn cũng ngồi bên cùng một ô cửa sổ, nhâm nhi tách trà và nhìn ra phố. Bạn biết ơn một ngày bình yên chẳng có gì xảy ra." : "Sáng nào bạn cũng đi trên cùng một con đường, chào hỏi cùng một người chủ tiệm. Bạn biết ơn một ngày bình yên chẳng có gì xảy ra." },
  { id: 'spouse', c: () => !!ojPt(), e: { h: 3, so: 3 }, t: () => L`${wa(callName(ojPt().name))} 마주 앉아 옛날이야기를 하다 둘이 같이 웃었습니다. 말하지 않아도 아는 사이가 되었습니다.` },
  { id: 'photos', c: () => ojKids() || !!ojPt(), e: { h: 2, so: 2 }, t: () => "Bạn lấy cuốn album ảnh cũ ra, cùng gia đình lật từng trang. Mỗi người nhớ mỗi khoảnh khắc một khác, khiến cả nhà cười mãi." },
  { id: 'plant', e: { h: 2 }, t: () => S.urban || careNow() ? "Chậu cây bên cửa sổ năm nay lại nở hoa. Việc tưới cây đã thành một niềm vui nho nhỏ trong ngày." : "Cái cây bạn trồng ở góc sân lần đầu tiên ra quả." },
  { id: 'read', c: () => S.edu >= 2 && S.st.so >= 25 && S.flags.oldHome !== 'care', e: { h: 2, so: 3 }, t: () => "Bạn bắt đầu đọc sách cho trẻ con trong xóm mỗi tuần một lần. Chẳng bao lâu, bọn trẻ đã chủ động gọi tên bạn mỗi khi gặp." },
  { id: 'neighbor', c: () => { const h = homeOthers(); return !h.pt && !h.kids.length && S.flags.oldHome !== 'care'; }, e: { h: 3, so: 3 }, t: () => "Thấy bạn sống một mình, người hàng xóm mang mấy món ăn sang chia cho bạn. Lần sau, chính bạn mang món mình nấu sang gõ cửa nhà họ." },
  { id: 'song', c: () => !noHear(), e: { h: 2 }, t: () => "Một bài hát bạn yêu thích thời trẻ vang lên. Hát theo, bạn thấy những gương mặt của thời ấy lần lượt hiện về." },
];
const OJ_BDAY = { 70: "Gia đình quây quần mừng sinh nhật lần thứ bảy mươi của bạn. Trong tấm ảnh chụp chung, bạn ở ngay chính giữa.", 80: "Gia đình quây quần mừng sinh nhật lần thứ tám mươi của bạn. Trong tấm ảnh chụp chung, bạn ở ngay chính giữa." };
const OJ_ACT = { worry: 'walk', gkstay: 'grand', gkletter: 'grand', gkteach: 'grand', advice: 'talk:fr', friends: 'friends', routine: 'photos', spouse: 'talk:pt', photos: 'photos', plant: 'garden', read: 'grand', neighbor: 'meal', song: 'hobby:music' };
function oldJoyYear(a) {
  if (a < 65 || S.job === 'prison' || S.flags.hideCN || S.serveLeft > 0) return;
  const f = S.flags;
  if (OJ_BDAY[a] && (ojKids() || ojPt()) && !(f.ojB || []).includes(a)) { (f.ojB = f.ojB || []).push(a); f.ojA = a; f.wmY = a; eff({ h: 3, so: 3 }); logA('cake', OJ_BDAY[a], 'warm'); return; }
  if (f.wmY === a || (f.ojA != null && a - f.ojA < OJ_GAP) || !chance(OJ_P)) return;
  const done = f.ojD || (f.ojD = []), opts = OLD_JOYS.filter(j => !done.includes(j.id) && (!j.c || j.c()));
  if (!opts.length) return;
  const j = pick(opts); done.push(j.id); f.ojA = a; f.wmY = a; eff(j.e); logA(OJ_ACT[j.id] || null, j.t(), 'warm', j.f ? j.f() : undefined);
}