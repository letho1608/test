// js/life.js - Quy luat cuoc doi: khoi tao, hoc tap, nhan nuoi, ket thuc nam
const ddSupOK = c => !!(S.dd && S.dd.lv === 1 && S.dd.told && S.dd.dx && ddRich(c) && calYr() >= 1990);
const DD_SUP = { id: 0.03, aut: 0.014 }, DD_MISS_SUP = { id: 0.95, aut: 0.972 };
function ddHire(c) {
  const d = S.dd; if (!d || !d.told || S.job !== 'seeking') return 'yes';
  if (!ddSupOK(c)) return chance(ddMiss()) ? 'no' : 'yes';
  const k = d.k === 'aut' && !d.xi ? 'aut' : 'id';
  return !chance(DD_MISS_SUP[k]) ? 'yes' : chance(DD_SUP[k]) ? 'sup' : 'no';
}
const ddLoveK = () => !S.dd ? 1 : S.dd.lv >= 3 ? 0 : S.dd.lv === 2 ? 0.01 : ddIDk(S.dd) ? 0.03 : 0.7;
const DD_MORT = [1, 4.9, 5.8, 8.5];
const ddMortK = (d, a) => !d || a < 18 ? 1 : ddIDk(d) ? DD_MORT[d.lv] : 2.18;
const ddSuicOff = (d, a) => d && ddIDk(d) && a >= 18 ? ddMortK(d, a) : 1;
const DD_SUIC = 0.22, DD_SUIC_RR = 0.54;
const ddAutKid = () => S.fam.kids.some(k => k.alive && k.dd && k.dd.k === 'aut' && k.dd.told && !k.away && S.age - k.bornAt < 18);
const DD_MOM = 0.44;
const ddShelterK = c => c.id === 'KOR' ? 0.146 : c.id === 'JPN' ? 0.08 : 0.1;
const ddRich = c => c.ppp >= 15000 && (c.p === 'hi' || c.p === 'eca');
function ddSchoolStart(c) {
  const d = S.dd;
  if (ddRich(c) || chance(disAccess(c))) {
    d.sch = d.lv === 3 || !chance(0.69) ? 'sp' : 'cls';
    regSchool(); S.school = 'prim'; S.schoolY = 0; S.job = 'student'; S.yearMark = 'edu';
    logA('school', d.sch === 'sp' ? "Bạn vào học ở một trường chuyên biệt. Lớp có hai giáo viên và sáu em nhỏ." : "Bạn vào lớp chuyên biệt ở trường tiểu học gần nhà. Một số tiết, bạn được học chung với các bạn nhỏ khác.", 'big');
    return;
  }
  d.sch = 'home'; S.job = 'dayc';
  log("Gần nhà không có trường nào chịu nhận bạn. Bạn ở nhà với gia đình và học từng ngày một.", 'bad', "Trẻ khuyết tật có khả năng chưa từng đi học cao hơn 49% (UNICEF 2021)");
}
function ddSchoolNext(c, done) {
  const d = S.dd;
  if (done === 'usec' || done === 'voc' || (done === 'lsec' && !ddRich(c)) || (done === 'prim' && !ddRich(c) && !chance(disAccess(c)))) {
    if (S.age >= 18 || done === 'usec' || done === 'voc') { ddAdult(c); return; }
    S.school = null; S.schoolY = 0; S.job = 'dayc'; log("Trường có thể theo học chỉ đến đó là hết. Từ đó về sau, bạn ở nhà với gia đình."); return;
  }
  S.school = done === 'prim' ? 'lsec' : 'usec'; S.schoolY = 0; S.job = 'student'; S.yearMark = 'edu';
  log(d.sch === 'sp' ? (done === 'prim' ? "Bạn lên học cấp trung học cơ sở của trường chuyên biệt." : "Bạn lên học cấp trung học phổ thông của trường chuyên biệt.") : (done === 'prim' ? "Bạn vào học lớp chuyên biệt ở trường trung học cơ sở." : "Bạn vào học lớp chuyên biệt ở trường trung học phổ thông."));
}
function ddAdult(c) {
  const d = S.dd; S.school = null; S.schoolY = 0; S.flags.ddAdult = S.age;
  const rich = ddRich(c);
  if (d.lv === 2 && rich && chance(0.25)) {
    S.job = 'shelter'; S.jobY = 0; S.formal = false; S.pct = 0.02; S.stats.jobs = (S.stats.jobs || 0) + 1;
    logA('work:shelter', "Bạn bắt đầu làm việc ở một xưởng lao động bảo trợ. Sáng nào bạn cũng ngồi ở cùng một chỗ, gấp và đóng hộp.", 'big', "Ở Hàn Quốc, 10.145 lao động khuyết tật không được áp dụng lương tối thiểu có mức lương trung bình 420.719 won (khoảng 300 USD) một tháng (Viện Nghiên cứu Quốc hội Hàn Quốc, 2025)");
    return;
  }
  const simple = ['cleaner', 'warehouse', 'cook', 'shop', 'artisan', 'factory'].filter(id => JOBS[id] && !(JOBS[id].only && !JOBS[id].only.split(',').some(x => x === c.p || x === c.id)));
  if (d.lv === 2 && (rich ? chance(0.13) : chance(0.27)) && simple.length) {
    const id = rich ? pick(simple) : S.urban ? 'vendor' : 'farm', rg = jobRange(id, c);
    takeJob({ id, formal: rich, pct: rg[0] + 0.02 });
    log(rich ? L`일자리 지원 기관의 도움으로 ${ro(jobName(id, S.sex))} 일하기 시작했습니다. 처음 몇 주는 직무 지도원이 곁에서 함께 일했습니다.` : id === 'farm' ? "Bạn bắt đầu phụ gia đình việc đồng áng." : "Bạn bắt đầu phụ việc ở quầy hàng của gia đình.", 'ev', "Trong số người khuyết tật ở độ tuổi lao động, 27% có việc làm, chỉ khoảng một nửa so với người không khuyết tật (56%) (UN DESA 2024)");
    return;
  }
  S.job = 'dayc';
  log(rich ? "Bạn bắt đầu đến một trung tâm sinh hoạt ban ngày. Sáng nào bạn cũng đi cùng một chuyến xe buýt, buổi chiều thì vẽ tranh hoặc đi dạo." : "Lớn lên, bạn vẫn sống ở nhà cùng gia đình, phụ một chút việc gánh nước hay quét sân.", 'ev',
    rich ? "Ở Hàn Quốc, 20,3% người khuyết tật phát triển từ 15 tuổi trở lên có việc làm (Khảo sát thực trạng người khuyết tật phát triển 2021)" : undefined);
}
function ddMove(c) {
  const sib = S.cur === S.born ? sibAliveList().filter(s => s.age >= 20).sort((x, y) => y.age - x.age)[0] : null;
  S.flags.left = S.age; S.flags.stayHome = 0;
  if (sib) { S.flags.ddHome = 'sib'; log(L`부모님이 떠난 뒤, ${sibCall(sib)}의 집으로 옮겨 함께 살게 되었습니다.`); return; }
  if (ddRich(c)) {
    S.flags.ddHome = 'gh';
    if (c.id === 'KOR' && chance(0.594)) log("Sau khi bố mẹ không còn nữa, bạn chờ hơn ba năm để có chỗ ở một nhà ở nhóm. Cuối cùng bạn cũng có một căn phòng của riêng mình.", 'ev', "Tháng 8 năm 2024, ở Hàn Quốc có 1.567 người đang chờ chỗ ở cơ sở nội trú dành cho người khuyết tật (Bộ Y tế và Phúc lợi Hàn Quốc)");
    else log("Sau khi bố mẹ không còn nữa, bạn chuyển đến một nhà ở nhóm và ăn tối cùng những người sống chung nhà.", 'ev', "Ở Mỹ, 71,5% người trưởng thành có khuyết tật phát triển sống cùng gia đình, và 12,5% sống ở nơi ở có hỗ trợ như nhà ở nhóm (State of the States 2011)");
    return;
  }
  S.flags.ddHome = 'kin'; log("Sau khi bố mẹ không còn nữa, bạn đến sống ở nhà họ hàng.");
}
const DD_FACT = { aut: () => "Cứ khoảng 127 người thì có 1 người thuộc phổ tự kỷ, và ở bé trai nhiều gấp khoảng hai lần bé gái (GBD 2021)", id: () => "Khoảng 2% trẻ em trên thế giới có khuyết tật trí tuệ (GBD 2019)" };
function ddYear(a) {
  const c = C();
  ddKidYear(c);
  const d = S.dd; if (!d) return;
  if (!d.told && a >= d.nt) {
    d.told = 1; d.dx = ddDxOK(c, d) ? 1 : 0;
    if (d.k === 'aut' && !d.xi && d.ld === 0) {
      if (!d.dx) { if (a < 18) log("Hòa đồng với bạn bè cùng trang lứa luôn là điều khó với bạn, nhưng bạn có thể đắm mình hàng giờ vào một thứ mình yêu thích." + ' ' + "Gần đó không có nơi nào có thể gọi tên sự khác biệt ấy.", 'ev'); return; }
      const t = a <= 5 ? "Bạn biết nói đúng lúc như những đứa trẻ khác, nhưng hòa đồng với chúng thì khó." + ' ' + "Hễ bắt đầu nói về thứ mình yêu thích là bạn không dừng lại được."
        : a <= 11 ? "Ở trường, hòa đồng với bạn cùng lớp luôn là điều khó." + ' ' + "Thầy cô gợi ý cho bạn đi đánh giá."
        : a <= 17 ? "Đến tuổi dậy thì, bạn thấy như mình sống theo một nhịp khác hẳn với bạn bè." + ' ' + "Theo gợi ý của thầy cô tư vấn học đường, bạn đi đánh giá."
        : "Mãi đến khi trưởng thành, bạn mới đi đánh giá.";
      log((S.sex === 'F' && a >= 12 ? "Từ nhỏ, bạn đã cố gắng hòa nhập bằng cách bắt chước giọng nói và nét mặt của người khác." + ' ' : '') + t + ' ' + "Bạn được chẩn đoán là tự kỷ."
        + (a >= 18 ? ' ' + "Giờ bạn đã hiểu vì sao mình luôn thấy hơi khác mọi người." : ''), 'ev',
        "Ở Anh (England), độ tuổi trung vị được chẩn đoán tự kỷ là 8,3 tuổi ở nam và 10,6 tuổi ở nữ (O'Nions và cộng sự 2023)");
      return;
    }
    const t = d.k === 'aut' && d.lv === 1 ? "Bạn biết nói muộn hơn những đứa trẻ khác, và thường không quay lại khi được gọi tên. Những thứ mình thích, bạn có thể ngắm thật lâu."
      : d.k === 'aut' ? "Bạn chưa nói được, và hiếm khi nhìn vào mắt ai. Gia đình đưa bạn đi hết phòng khám này đến phòng khám khác."
      : d.lv === 1 ? (S.school ? "Bạn học chữ và học đếm lâu hơn những đứa trẻ khác. Thầy cô gợi ý cho bạn đi đánh giá." : "Bạn học nói và học đếm lâu hơn những đứa trẻ khác.")
      : d.lv === 2 ? "Bạn biết đi và biết nói muộn hơn nhiều so với những đứa trẻ khác. Gia đình đưa bạn đến phòng khám." : "Bạn giữ được người và phát ra tiếng rất muộn. Gia đình lúc nào cũng ở bên cạnh bạn.";
    log(t + ' ' + (d.dx ? (d.k === 'aut' ? "Bạn được chẩn đoán là tự kỷ." : "Bạn được chẩn đoán có khuyết tật trí tuệ.") : "Phòng khám có thể gọi tên sự chậm ấy thì lại ở rất xa. Gia đình cùng bạn bước đi theo nhịp của bạn."), 'ev', DD_FACT[d.k]());
    return;
  }
  if (d.told && d.k === 'aut' && !d.xi && !d.dx && a >= 18 && a <= 65 && calYr() >= 2005 && ddDxOK(c, d) && chance(S.sex === 'F' ? 0.015 : 0.01)) {
    d.dx = 1; log(L`${a}세에 검사를 받고서야 자폐 스펙트럼이라는 것을 알게 되었습니다.` + ' ' + "Những chuyện đã qua dần dần trở nên dễ hiểu hơn.", 'ev', "Ở Anh (England), ước tính hơn một nửa người tự kỷ từ 20 đến 49 tuổi vẫn chưa được chẩn đoán (O'Nions và cộng sự 2023)");
    return;
  }
  const once = (k, p, f) => { const o = S.flags.ddL || (S.flags.ddL = {}); if (o[k] || !chance(p)) return false; o[k] = a; f(); return true; };
  if (S.school && a >= 7 && a <= 16 && d.lv <= 2 && once('bully', 0.055, () => { eff({ h: -3, so: -1 }); log("Giờ ra chơi nào cũng có mấy đứa trêu chọc bạn. Những ngày bạn không muốn đến trường cứ nhiều dần lên.", 'bad', d.told ? "43% người trưởng thành có khuyết tật học tập ở Anh cho biết họ từng bị bắt nạt khi còn đi học (Emerson và cộng sự 2005)" : null); })) return;
  if ((S.school || d.lv >= 2) && a >= 7 && a <= 17 && once('friend', 0.08, () => { eff({ h: 2, so: 3 }); log(!S.school ? "Một đứa trẻ trong xóm hay sang chơi, ngồi cạnh và chơi cùng bạn." : d.sch === 'sp' ? "Giờ ra chơi nào bạn cũng xếp khối với một bạn cùng lớp. Hai đứa có một trò chơi chỉ hai đứa biết." : "Có một bạn cùng lớp giờ ra chơi nào cũng đến ngồi cạnh bạn.", 'warm'); })) return;
  if ((d.lv >= 2 || d.xi) && a >= 4 && a <= 7 && once('word', d.lv === 3 ? 0.15 : 0.45, () => { eff({ h: 2, so: 2 }); log(d.lv === 3 ? "Thay cho lời nói, bạn học cách bày tỏ lòng mình bằng cử chỉ và âm thanh, và gia đình dần hiểu được từng âm thanh ấy." : "Phải đến sau bốn tuổi bạn mới nói được từ đầu tiên. Cả nhà nhắc đi nhắc lại từ ấy không biết bao nhiêu lần.", 'warm'); })) return;
  if (d.k === 'aut' && a >= 4 && a <= 12 && once('sound', 0.15, () => log("Ở chỗ ồn ào, bạn bịt tai lại và tìm một góc yên tĩnh. Mỗi lần ra ngoài, gia đình đều mang theo đồ chống ồn cho bạn."))) return;
  if (d.k === 'aut' && a >= 8 && a <= 16 && once('deep', 0.2, () => { const h = S.hobbies[0]; if (h) h.lv += 1.5; eff({ h: 3 }); log(h ? L`${hobbyName(h.id)}에 깊이 빠져, 그것만큼은 누구보다 많이 알게 되었습니다.` : "Bạn say mê một thứ mình yêu thích, và hiểu về nó hơn bất kỳ ai.", 'warm'); })) return;
  if (d.lv === 3 && a >= 5) {
    const J = ["Mỗi khi bài hát yêu thích vang lên, bạn vỗ tay và cười.", "Bạn thích ngồi bên cửa sổ đếm những chiếc xe buýt chạy qua.", "Mỗi lần gặp chú chó nào trên đường đi dạo, bạn lại cười rạng rỡ.", "Những ngày mưa, bạn áp lòng bàn tay lên cửa kính và lắng nghe tiếng mưa."];
    for (let i = 0; i < J.length; i++) if (once('j' + i, a >= 5 + i * 8 ? 0.12 : 0, () => { eff({ h: 2 }); log(J[i], 'warm'); })) return;
  }
  if (a < 18) return;
  if (d.lv >= 2 && S.flags.ddAdult == null && !S.school && (S.job === 'dayc' || S.job === 'childwork')) ddAdult(c);
  if (d.lv >= 2 && S.job === 'seeking') S.job = 'dayc';
  if ((S.job === 'dayc' || S.job === 'shelter' || (S.job === 'seeking' && a < 65)) && !S.school && !S.dis && (c.p === 'hi' || c.p === 'eca')) { const b = incomeAt(c, 0.5) * 0.18; S.money += b; book("Trợ cấp khuyết tật", b); }
  if (d.lv === 1 && d.dx && S.job === 'seeking' && a <= 50 && once('door', 0.2, () => { eff({ h: -2 }); log("Bạn gửi hồ sơ xin việc đến nhiều nơi." + ' ' + "Trong hồ sơ, bạn ghi rõ mình có khuyết tật." + ' ' + "Số nơi liên lạc lại chỉ đếm trên đầu ngón tay.", 'bad', "Trong một thí nghiệm ở Mỹ với hơn 6.000 hồ sơ xin việc, những hồ sơ cho biết người nộp có khuyết tật nhận được ít hơn 26% sự quan tâm của nhà tuyển dụng so với những hồ sơ giống hệt ở mọi điểm còn lại (Ameri và cộng sự 2018)"); })) return;
  if (d.lv === 1 && d.dx && S.job === 'seeking' && a <= 50 && S.flags.ddL && S.flags.ddL.door != null && once('few', 0.12, () => { eff({ h: -2 }); log("Thật khó tìm được nơi làm việc sẵn lòng nhận người khuyết tật.", 'bad', "Trong số người khuyết tật phát triển ở Hàn Quốc đã tìm được việc, 27,3% kể khó khăn khi tìm việc là “không có hoặc quá ít doanh nghiệp tuyển người khuyết tật phát triển”, còn 7,5% chọn “bản thân ít muốn đi làm” (Khảo sát công việc và cuộc sống của người khuyết tật phát triển 2024)"); })) return;
  if (d.lv === 1 && d.dx && S.job === 'seeking' && a >= 22 && a <= 55 && (S.flags.seekY || 0) >= 3 && once('want', 0.1, () => log(ddRich(c)
    ? "Bạn vẫn muốn được đi làm như trước." + ' ' + "Bạn theo học lớp kỹ năng nghề ở trung tâm phúc lợi trong lúc chờ cơ hội tiếp theo."
    : "Bạn vẫn muốn được đi làm, nhưng gần đó không có nơi nào giúp người khuyết tật tìm việc.", 'ev',
    ddRich(c) ? "Khi hỏi trực tiếp những người khuyết tật phát triển ở Hàn Quốc đang không có việc làm, 50,7% cho biết họ muốn đi làm (Khảo sát công việc và cuộc sống của người khuyết tật phát triển 2024)" : "Trong số người khuyết tật ở độ tuổi lao động, 27% có việc làm, chỉ khoảng một nửa so với người không khuyết tật (56%) (UN DESA 2024)"))) return;
  if (S.job === 'shelter' && once('pay', 0.5, () => { eff({ h: 3, so: 2 }); log("Với tiền lương nhận được ở xưởng, bạn mua bánh kẹo mang về cho gia đình.", 'warm'); })) return;
  if (d.lv === 3 && a >= 19 && a <= 22 && ddRich(c) && once('guard', 0.6, () => log("Khi bạn tròn hai mươi tuổi, bố mẹ đi lại giữa tòa án và trung tâm phúc lợi để tìm hiểu xem từ nay ai sẽ cùng bạn quyết định những việc lớn, và quyết định thế nào.", 'ev', "Công ước của Liên Hợp Quốc về Quyền của Người khuyết tật nói về quyền được tự mình quyết định với sự hỗ trợ, thay vì để người khác quyết định thay (Điều 12)"))) return;
  if (d.lv <= 2 && a >= 25 && a <= 45 && once('fr', 0.15, () => { if (chance(0.69)) { eff({ h: 2, so: 3 }); log("Cuối tuần, bạn gặp một người bạn quen đã lâu, đến quán quen và ăn món quen.", 'warm'); } else log("Cuối tuần bạn thường ở bên gia đình. Không có nhiều bạn bè để cùng đi chơi.", 'ev', "31% người trưởng thành có khuyết tật học tập ở Anh không liên lạc với bạn bè nào trong suốt một năm qua (Emerson và cộng sự 2005)"); })) return;
  const par = (S.fam.mom.alive && S.fam.mom.age >= 70) || (S.fam.dad.alive && !S.fam.dad.absent && S.fam.dad.age >= 70);
  if (d.lv >= 2 && par && withParents() && once('worry', 0.3, () => log("Nhìn tóc bố mẹ bạc trắng, đôi khi bạn hỏi sau này mình sẽ sống với ai.", 'ev', "Ở Hàn Quốc, 33,4% người trưởng thành có khuyết tật phát triển lo lắng nhất về việc sau này bị bỏ lại một mình (Khảo sát thực trạng người khuyết tật phát triển 2021)"))) return;
  if (d.lv >= 2 && !S.flags.ddHome && !(S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent))) ddMove(c);
}
function ddKidYear(c) {
  for (const k of S.fam.kids) {
    const d = k.dd; if (!k.alive || !d) continue;
    const ka = S.age - k.bornAt, n = callName(k.name);
    if (!d.told && ka >= d.nt && !k.away) {
      d.told = 1; d.dx = ddDxOK(c, d) ? 1 : 0;
      const on = d.k === 'aut' && !d.xi && d.ld === 0;
      if (on && ka >= 18) { if (d.dx) log(L`${iga(n)} 어른이 되어 검사를 받고, 자폐 스펙트럼이라는 것을 알게 되었다고 털어놓았습니다.`, 'ev'); continue; }
      const t = on ? L`${iga(n)} 또래와 어울리는 것을 어려워했고, 좋아하는 것 하나에 깊이 빠져들었습니다.` : d.k === 'aut' ? L`${iga(n)} 말이 또래보다 늦고, 불러도 돌아보지 않을 때가 많았습니다.` : d.lv === 1 ? L`${iga(n)} 글자와 셈을 익히는 데 또래보다 오래 걸렸습니다.` : L`${iga(n)} 걷고 말하는 것이 또래보다 한참 늦었습니다.`;
      log(t + ' ' + (d.dx ? (d.k === 'aut' ? "Sau các lần đánh giá, con được chẩn đoán là tự kỷ." : "Sau các lần đánh giá, con được chẩn đoán có khuyết tật trí tuệ.") : on ? "Bạn không biết gọi điều đó là gì, nhưng bạn vẫn đón nhận con trọn vẹn như chính con." : "Bạn không biết điều đó có tên gọi gì, nhưng bạn bước cùng con theo nhịp của con."), 'ev', d.k === 'aut' && S.sex === 'F' && isWorking() ? "Những người mẹ nuôi con tự kỷ có thu nhập trung bình ít hơn 56% so với những người mẹ khác (Cidav và cộng sự 2012)" : DD_FACT[d.k]());
    }
    if (d.lv >= 2 && ka === 6 && !k.away && !d.sch) { d.sch = ddRich(c) || chance(disAccess(c)) ? 'sp' : 'home'; log(d.sch === 'sp' ? L`${iga(n)} 특수학교에 다니기 시작했습니다. 아침마다 학교 버스가 집 앞에 섰습니다.` : L`${eul(n)} 받아 주는 학교가 가까이에 없었습니다.`, d.sch === 'sp' ? 'ev' : 'bad'); }
    if (d.lv >= 2 && ka >= 18 && !k.grown && !k.away) k.stay = 1;
    if (d.lv >= 2 && ka >= 18 && k.stay && !k.away && !S.isComp && S.job !== 'prison') ddKidPlan(c, k, n);
    if (d.lv >= 2 && ka >= 18 && k.stay && S.age >= 55 && !k.ddPl && !(S.flags.ddW || []).includes(k.bornAt) && chance(0.15)) { (S.flags.ddW = S.flags.ddW || []).push(k.bornAt); log(L`내가 떠난 뒤 ${eun(n)} 누구와 살게 될지, 밤늦게까지 생각하는 날이 늘었습니다.`, 'ev', "Ở Hàn Quốc, 34,9% gia đình có người khuyết tật phát triển cho biết điều họ lo nhất là chuyện sau khi người chăm sóc không còn nữa (Khảo sát thực trạng người khuyết tật phát triển 2021)"); }
  }
}
const DD_PLAN_P = 0.2, DD_PLAN_SIB = { rich: 0.45, other: 0.7 };
function ddKidPlan(c, k, n) {
  const f = S.fam;
  if (k.ddPl && k.ddPl.w === 'sib' && !f.kids.some(x => x.bornAt === k.ddPl.b && x.alive && callName(x.name) === k.ddPl.s)) k.ddPl = null;
  if (k.ddPl || !(S.age >= 60 || (S.age >= 50 && S.st.hl < 35)) || !chance(DD_PLAN_P)) return;
  const rich = ddRich(c), P = f.partner, two = !!(P && P.alive && !P.divorced), lv3 = k.dd.lv === 3;
  const close = x => !x.grown || x.near || x.withMe;
  const sib = f.kids.filter(x => x !== k && x.alive && !x.dd && !x.away && !x.abroad && !x.placed && x.cut == null && !(typeof kidInPr === 'function' && kidInPr(x)) && S.age - x.bornAt >= 22 && (close(x) || x.city))
    .sort((x, y) => (close(y) ? 1 : 0) - (close(x) ? 1 : 0) || x.bornAt - y.bornAt)[0];
  const w = sib && chance(rich ? DD_PLAN_SIB.rich : DD_PLAN_SIB.other) ? 'sib' : rich ? 'gh' : 'kin';
  k.ddPl = { w, at: S.age }; if (w === 'sib') { k.ddPl.s = callName(sib.name); k.ddPl.b = sib.bornAt; }
  const head = two ? L`우리 둘이 모두 떠난 뒤 ${n}의 곁을 누가 지킬지, 가족이 둘러앉아 오래 이야기했습니다.` : L`내가 떠난 뒤 ${n}의 곁을 누가 지킬지, 가족과 오래 이야기했습니다.`;
  const where = w === 'sib' ? L`${iga(k.ddPl.s)} ${wa(n)} 한집에서 함께 살겠다고 먼저 말해 주었습니다.`
    : w === 'gh' ? (lv3 ? L`${n}의 표정과 몸짓을 살피며, ${iga(n)} 편안해하던 그룹홈에 이름을 올려 두었습니다.` : L`${n}에게 몇 번이고 물어, ${iga(n)} 마음에 들어 한 그룹홈에 이름을 올려 두었습니다.`)
    : L`가까운 친척들이 ${eul(n)} 맡아 함께 살겠다고 약속해 주었습니다.`;
  const more = w === 'gh' ? L`큰일을 함께 정해 줄 후견인을 정하고, ${n} 앞으로 남길 돈은 믿을 만한 곳에 맡겨 두었습니다.`
    : lv3 ? L`${n}의 표정과 몸짓을 살피며 함께 정한 일이었습니다.` : L`${n}에게도 몇 번이고 물어 함께 정한 일이었습니다.`;
  eff({ h: 2 });
  log(head + ' ' + where + ' ' + more, 'ev', "Công ước của Liên Hợp Quốc về Quyền của Người khuyết tật nêu rõ quyền của người khuyết tật được lựa chọn sống ở đâu và sống với ai, bình đẳng như mọi người khác (Điều 19)");
}
function ddKidJob(k, c) {
  const d = k.dd; if (!d || d.lv < 2) return false;
  const rich = ddRich(c);
  k.job = d.lv === 3 ? 'dayc' : rich ? (chance(0.25) ? 'shelter' : 'dayc') : chance(0.27) ? (k.urb ? 'vendor' : 'farm') : 'dayc';
  if (k.away || S.job === 'prison') return true;
  const n = callName(k.name);
  log(k.job === 'shelter' ? L`${iga(n)} 보호작업장에 다니기 시작했습니다. 첫 월급날 과자 봉지를 들고 왔습니다.` : k.job === 'dayc' ? (rich ? L`${iga(n)} 주간활동센터에 다니기 시작했습니다.` : L`${eun(n)} 어른이 되어서도 집에서 가족과 지냅니다.`)
    : k.job === 'farm' ? L`${iga(n)} 가족 곁에서 농사일을 거들기 시작했습니다.` : L`${iga(n)} 가족의 가게 일을 거들기 시작했습니다.`, k.job === 'shelter' ? 'warm' : 'ev');
  return true;
}
const ddKidUni = k => (!k.dd ? 1 : k.dd.lv >= 2 ? 0 : ddIDk(k.dd) ? 0.43 : 0.66) * ndKidUni(k);
const ND_ADHD = { M: 0.07, F: 0.035 }, ND_DYS = { M: 0.0922, F: 0.0466 }, ND_PER = 0.5;
const ND_A_HS = 0.37, ND_A_UNI = 0.76, ND_L_UNI = 0.4, ND_A_HS_U = 0.8, ND_L_HS_U = 0.5, ND_L_UNI_U = 0.93;
const ND_L_MK = 0.31;
const ndUniK = () => !S.nd ? 1 : (S.nd.a ? ND_A_UNI : 1) * (S.nd.l ? ND_L_UNI * (S.nd.dl ? 1 : ND_L_UNI_U) : 1);
const ndHsK = () => !S.nd ? 1 : (S.nd.a ? ND_A_HS * (S.nd.da ? 1 : ND_A_HS_U) : 1) * (S.nd.l && !S.nd.dl ? ND_L_HS_U : 1);
function ndDraw(sex, dd) {
  if (dd) return null;
  const a = chance(ND_ADHD[sex] || 0.05) ? 1 : 0, l = chance(ND_DYS[sex] || 0.07) ? 1 : 0;
  if (!a && !l) return null;
  return { a, l, per: a && chance(ND_PER) ? 1 : 0, nt: a ? (sex === 'F' ? ri(7, 12) : ri(6, 9)) : 0 };
}
function ndBirth() { const d = ndDraw(S.sex, S.dd); if (d) S.nd = d; }
const ndKidUni = k => !k.nd ? 1 : (k.nd.a ? (k.nd.da ? 0.73 : 0.70) : 1) * (k.nd.l ? (k.nd.dl ? 0.41 : 0.36) : 1);
function ndNamedP(c, kind) {
  if (!(c.ppp >= 10000 || (S.urban && c.ppp >= 4000))) return 0;
  const y = calYr(), a = kind === 'a';
  if (c.id === 'USA') return a ? (y >= 1987 ? 0.9 : 0) : (y >= 1977 ? 0.68 : 0);
  if (a && c.id === 'SWE') return y >= 2005 ? 0.85 : y >= 2000 ? 0.3 : 0;
  if (a && c.id === 'KOR') return y >= 2020 ? 0.4 : y >= 2005 ? 0.15 : 0;
  if (ddRich(c)) return y >= 2000 ? 0.3 : 0;
  return y >= 2010 ? (a ? 0.08 : 0.05) : 0;
}
const ndFactA = c => c.id === 'USA' ? "Ở Mỹ, 11,4% trẻ em từ 3 đến 17 tuổi từng được chẩn đoán ADHD (Danielson và cộng sự 2024, khảo sát năm 2022)"
  : c.id === 'KOR' ? "Ở Hàn Quốc, số người khám và điều trị ADHD tăng từ 79.248 người năm 2020 lên 260.251 người năm 2025 (Cơ quan Thẩm định và Đánh giá Bảo hiểm Y tế Hàn Quốc)"
  : c.id === 'SWE' ? "Ở Thụy Điển, năm 2022 khoảng 8% trẻ em và thanh thiếu niên có chẩn đoán ADHD (Högberg 2026)"
  : c.id === 'GBR' ? "Ở Anh (England), 1,19% dân số có hồ sơ chẩn đoán ADHD, ít hơn nhiều so với mức 3-5% dự kiến (John và cộng sự 2026)"
  : "Khoảng 5% trẻ em trên thế giới có ADHD (Polanczyk và cộng sự 2007)";
const ndFactL = c => c.id === 'USA' ? "Ở các trường công lập của Mỹ, 32% học sinh nhận hỗ trợ giáo dục đặc biệt (15% tổng số học sinh) có khuyết tật học tập đặc thù (NCES 2022-23)"
  : "Khoảng 7% học sinh tiểu học mắc chứng khó đọc, ở bé trai nhiều gấp khoảng hai lần bé gái (Yang và cộng sự 2022)";
function ndYear(a) {
  const c = C();
  ndKidYear(c);
  const d = S.nd; if (!d) return;
  const once = (k, p, f) => { const o = S.flags.ndL || (S.flags.ndL = {}); if (o[k] || !chance(p)) return false; o[k] = a; f(); return true; };
  if (d.a && d.ta == null && a >= d.nt) {
    d.ta = a; d.da = chance(ndNamedP(c, 'a')) ? 1 : 0;
    const t = !S.school ? "Từ nhỏ bạn đã không ngồi yên được lấy một lúc, và hay quên mình đang làm gì."
      : S.sex === 'F' ? "Trong giờ học, bạn hay mải nghĩ vẩn vơ rồi bỏ lỡ lời thầy cô giảng, và hay quên bài tập về nhà cùng đồ dùng học tập cần mang."
      : "Ngồi yên trong giờ học là điều đặc biệt khó với bạn, và bạn hay quên bài tập về nhà cùng đồ dùng học tập cần mang.";
    if (d.da) { eff({ h: 1 }); log(t + ' ' + "Sau khi đi đánh giá, bạn được chẩn đoán ADHD (rối loạn tăng động giảm chú ý)." + ' ' + "Thầy cô chuyển chỗ bạn lên bàn đầu và chia việc cần làm thành từng phần nhỏ.", 'ev', ndFactA(c)); }
    else { eff({ h: -2 }); log(t + ' ' + "Bạn hay bị mắng là “cẩu thả”, “lười biếng”." + ' ' + "Không ai biết rằng khó khăn ấy có một cái tên.", 'bad', "Khoảng 5% trẻ em trên thế giới có ADHD (Polanczyk và cộng sự 2007)"); }
    return;
  }
  if (d.l && d.tl == null && S.school && a >= 7) {
    d.tl = a; d.dl = chance(ndNamedP(c, 'l')) ? 1 : 0;
    if (d.dl) { eff({ h: 1 }); log("Bạn đọc chữ chậm khác thường và hay đọc sai." + ' ' + "Sau khi đi đánh giá, bạn biết mình mắc chứng khó đọc." + ' ' + "Bạn được thêm thời gian khi làm bài thi, và học bằng cách nghe sách giáo khoa được đọc thành tiếng.", 'ev', ndFactL(c)); }
    else { eff({ h: -2 }); log("Bạn đọc chữ chậm khác thường và hay đọc sai." + ' ' + "Bạn hay bị nói là “chưa đủ cố gắng”." + ' ' + "Không ai biết rằng khó khăn ấy có một cái tên.", 'bad', "Khoảng 7% học sinh tiểu học mắc chứng khó đọc, ở bé trai nhiều gấp khoảng hai lần bé gái (Yang và cộng sự 2022)"); }
    return;
  }
  if (d.a && d.ta != null && a >= 8 && a <= 30 && once('as', 0.12, () => {
    const h = S.hobbies[0], r = rnd(); eff({ h: 2 });
    if (h && r < 0.5) { h.lv += 1; log(L`${hobbyName(h.id)}만큼은 몇 시간이고 빠져들어 시간 가는 줄 몰랐습니다.`, 'warm'); }
    else log(r < 0.75 ? "Trong đầu bạn ý tưởng mới không ngừng nảy ra, và bạn thường tìm ra những lối đi mà người khác chưa nghĩ tới." : "Tràn đầy năng lượng, việc gì bạn cũng là người đầu tiên xông xáo làm thử.", 'warm');
  })) return;
  if (d.l && d.tl != null && a >= 9 && a <= 30 && once('ls', 0.1, () => { eff({ h: 2 }); log("Bạn học qua tranh ảnh và câu chuyện tốt hơn là qua chữ viết." + ' ' + "Câu chuyện nào đã nghe một lần, bạn nhớ rất lâu.", 'warm'); })) return;
  if (a < 18) return;
  if (d.a && !d.per && a <= 24 && once('ae', 0.2, () => log("Lớn lên, sự hiếu động của bạn đã lắng xuống nhiều." + ' ' + "Bạn cũng đã tự tìm ra vài mẹo riêng cho mình.", 'ev'))) return;
  if (d.a && d.per && !d.da && a <= 55 && calYr() >= 2010 && (ddRich(c) || c.id === 'USA') && chance(S.sex === 'F' ? 0.018 : 0.012)) {
    d.da = 1; d.aa = a; eff({ h: 1 });
    log(L`${a}세에 검사를 받고 ADHD라는 것을 알게 되었습니다.` + ' ' + "Những lời mắng mỏ thời thơ ấu giờ trông có phần khác đi.", 'ev', "6,0% người trưởng thành ở Mỹ hiện có chẩn đoán ADHD, và 55,9% trong số đó được chẩn đoán khi đã trưởng thành (CDC 2023)");
    return;
  }
  if (d.a && d.per && a >= 22 && a <= 50 && once('ap', 0.08, () => log("Để không quên lịch hẹn và việc cần làm, bạn sống giữa những tờ lịch và giấy ghi chú dán khắp nơi.", 'ev', "2,58% người trưởng thành trên thế giới có ADHD kéo dài từ thời thơ ấu (Song và cộng sự 2021)"))) return;
  if (d.l && d.tl != null && a >= 25 && a <= 55 && once('la', 0.03, () => { eff({ h: 1 }); log(calYr() >= 2005 ? "Bạn nghe sách dưới dạng sách nói." + ' ' + "Được đắm mình trong một câu chuyện là niềm vui bạn tận hưởng chẳng kém ai." : "Những đoạn văn dài, bạn hiểu rõ hơn khi có ai đó đọc to lên cho nghe.", 'warm'); })) return;
}
function ndKidYear(c) {
  for (const k of S.fam.kids) {
    const d = k.nd; if (!k.alive || !d || k.away) continue;
    const ka = S.age - k.bornAt, n = callName(k.name);
    if (d.a && d.ta == null && ka >= d.nt) {
      d.ta = ka; d.da = chance(ndNamedP(c, 'a')) ? 1 : 0;
      log(d.da ? L`학교에서 ${iga(n)} 수업 시간에 가만히 있지 못한다는 연락이 자주 왔습니다.` + ' ' + "Sau khi đi đánh giá, con được chẩn đoán ADHD, và bạn cùng thầy cô tìm cách giúp con."
        : L`${iga(n)} 산만하다는 꾸중을 자주 듣고 왔습니다.` + ' ' + "Bạn không biết gọi điều đó là gì, nhưng bạn cố gắng đứng về phía con.", 'ev', d.da ? ndFactA(c) : "Khoảng 5% trẻ em trên thế giới có ADHD (Polanczyk và cộng sự 2007)");
      continue;
    }
    if (d.l && d.tl == null && ka >= 8 && c.ppp >= 8000) {
      d.tl = ka; d.dl = chance(ndNamedP(c, 'l')) ? 1 : 0;
      log(L`${iga(n)} 글 읽기를 유난히 어려워했습니다.` + ' ' + (d.dl ? "Sau khi đi đánh giá, bạn biết con mắc chứng khó đọc, và tối nào hai người cũng cùng nhau đọc sách thành tiếng." : "Tối nào bạn cũng ngồi bên con, cùng đọc từng dòng một."), 'ev', d.dl ? ndFactL(c) : "Khoảng 7% học sinh tiểu học mắc chứng khó đọc, ở bé trai nhiều gấp khoảng hai lần bé gái (Yang và cộng sự 2022)");
    }
  }
}
const MIND_HELP = () => L`도움이 필요할 때: 정신건강위기상담 1577-0199 (24시간) · 다른 나라는 findahelpline.com`;
const MIND_FACT = () => "Lòng nặng trĩu kéo dài không phải là chuyện hiếm, và có thể khá hơn khi được giúp đỡ. Khoảng 5% người trưởng thành trên thế giới đang sống chung với trầm cảm (WHO 2026)";
const mindCounselOK = c => !(S.era && S.era !== 'now' && calYr() < 1980 && c.p !== 'hi');
const mindCost = c => S.refugee ? 0 : incomeAt(c, 0.5) * 0.04 * clamp((c.oop || 30) / 40, 0.3, 1.5);
const mindWho = () => { const P = S.fam.partner;
  if (S.fam.married && P && P.alive && !P.divorced) return P.ss || P.cohab ? 'p2' : 'p';
  if (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) return 'par';
  return sibN() > 0 ? 'sib' : 'fr'; };
function mindAsk(c, a, pool) {
  if (a < 18 || S.mind || (S.done.mind || 0) >= 2 || (S.flags.last_mind != null && a - S.flags.last_mind < 8) || S.job === 'prison' || S.flags.hideCN) return;
  const loss = S.flags.lossY != null && a - S.flags.lossY <= 1;
  if (chance(MIND_P * (stressed() ? 3.5 : 1) * (loss ? 1.5 : 1) * (S.sex === 'F' ? 1.25 : 0.8) * (S.refugee ? 2 : 1))) pool.push(['mind', {}]);
}
const MIND_P = 0.0016;
const mindK = () => S.mind ? (S.mind.way === 'alone' ? 7 : 4) : 0;
function mindYear() {
  const m = S.mind; if (!m) return;
  m.y++;
  if (m.y >= 5 || chance(m.way === 'counsel' ? 0.7 : m.way === 'talk' ? 0.55 : 0.3)) {
    S.mind = null; S.flags.mindOK = S.age; eff({ h: 4, so: 2 });
    if (m.way === 'counsel') log(pick(["Nhờ được tư vấn tâm lý, bạn dần ngủ lại được. Lòng bạn dần bình yên trở lại.", "Sau mấy tháng tư vấn tâm lý, bạn chợt nhận ra mình đang mỉm cười, lần đầu tiên sau một thời gian dài."]), 'warm');
    else if (m.way === 'talk') log(pick(["Nhờ những người đã ở bên, lòng bạn nhẹ dần.", "Một buổi sáng, lần đầu tiên sau một thời gian dài, bạn thức dậy thấy khoan khoái. Quãng thời gian khó khăn đã ở lại phía sau."]), 'warm');
    else log(pick(["Phải mất thời gian, nhưng nỗi nặng lòng cũng dần vơi đi.", "Một ngày nọ, bạn chợt nhận ra quãng thời gian nặng nề ấy đã qua."]), 'warm', "Ngay cả ở các nước thu nhập cao, chỉ khoảng một phần ba số người bị trầm cảm được điều trị (WHO 2026)");
    return;
  }
  if (m.way === 'alone' && m.y >= 2 && !m.asked) { m.asked = 1; S.flags.mindHelpQ = 1; return; }
  if (chance(0.5)) log(m.way === 'counsel' ? "Những ngày đi tư vấn về, lòng bạn nhẹ đi đôi chút, rồi lại nặng trĩu, cứ thế lặp đi lặp lại." : m.way === 'talk' ? "Ngày tốt và ngày khó cứ thay phiên nhau đến. Dù vậy, bạn vẫn có người để tâm sự." : "Cũng có những ngày tốt, nhưng lòng bạn vẫn nặng trĩu.", 'note');
}
const HAR_AM = new Set(['USA', 'CAN']), HAR_AF = new Set(['DZA', 'EGY', 'LBY', 'MAR', 'TUN']), HAR_AP = new Set(['JPN', 'KOR', 'AUS', 'NZL', 'SGP', 'TWN', 'HKG', 'MAC', 'IRN']);
const harReg = c => c.p === 'lac' || HAR_AM.has(c.id) ? 0.343 : c.p === 'ssa' || HAR_AF.has(c.id) ? 0.257 : c.p === 'eap' || c.p === 'sa' || HAR_AP.has(c.id) ? 0.192 : c.p === 'mena' ? 0.136 : 0.255;
const HAR_K = 0.058;
const HAR_HELP = () => "Bị bắt nạt nơi làm việc, bạn có thể hỏi cơ quan lao động hoặc công đoàn nơi mình sống";
const harOn = () => isWorking() && !SELF_JOBS.includes(S.job) && S.job !== 'shelter' && !inOffice() && !S.flags.hideCN;
function harassYear(c, a) {
  if (S.flags.harAt != null || a < 18 || a > 64 || !harOn() || S.isComp) return;
  if (!chance(HAR_K * -Math.log(1 - harReg(c)))) return;
  S.flags.harAt = a;
  const r = rnd(), what = r < 0.41 ? "Cấp trên thường quát mắng và làm bạn bẽ mặt trước mọi người." : r < 0.76 ? "Trong nhóm, mọi việc bắt đầu diễn ra mà không có bạn, và người ta bàn tán sau lưng bạn." : "Bạn liên tục bị giao khối lượng việc không ai làm xuể, rồi bị trách mắng vì không làm xong.";
  const rep = c.id === 'KOR' && calYr() >= 2019 ? 0.2 : c.id === 'JPN' ? 0.08 : 0.1, u = rnd();
  const way = u < 0.15 ? 'quit' : u < 0.15 + rep ? 'rep' : u < 0.53 + rep ? 'told' : 'silent';
  eff({ h: -5, so: -2 });
  const then = way === 'quit' ? "Cuối cùng bạn nghỉ việc ở nơi đó." : way === 'rep' ? "Bạn đã báo cáo chính thức với nơi làm việc." + ' ' + "Cuộc điều tra kéo dài, và không phải mọi thứ đều thay đổi ngay."
    : way === 'told' ? "Bạn tâm sự với đồng nghiệp và gia đình để vượt qua từng ngày." : "Bạn không nói với ai và cố chịu đựng suốt mấy tháng.";
  if (way === 'told') eff({ h: 1, so: 1 });
  if (way === 'quit') { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; S.flags.harQuit = a; }
  const fact = c.id === 'KOR' ? "28,8% người lao động Hàn Quốc đã bị hoặc chứng kiến bắt nạt nơi làm việc trong năm qua (Khảo sát của Bộ Việc làm và Lao động Hàn Quốc 2024)"
    : c.id === 'JPN' ? "19,3% người lao động ở Nhật Bản từng bị cấp trên hoặc người khác quấy rối quyền lực trong ba năm qua (Bộ Y tế, Lao động và Phúc lợi Nhật Bản 2024)"
    : "22,8% người lao động từng bị bạo lực hoặc quấy rối nơi làm việc, và trong số những người gặp phải trong năm năm qua, chỉ hơn một nửa kể với ai đó (ILO 2022)";
  logD('har', what + ' ' + then, 'bad', fact + ' · ' + HAR_HELP());
}
const WD_C = { KOR: { a: [18, 39], p: [0.064, 0], kp: [0.012, 0] }, JPN: { a: [18, 64], p: [0.055, 0.072], kp: [0.012, 0.023] } };
const WD_DUR = [[1, 0.34], [2, 0.18], [3, 0.11], [4, 0.07], [5, 0.06], [7, 0.06], [10, 0.06], [15, 0.06], [20, 0.06]];
const wdDur = a => { let u = rnd(), d = 1; for (const [y, p] of WD_DUR) { if (u < p) { d = y; break; } u -= p; } return a >= 40 ? Math.round(d * 1.6) : d; };
const wdOn = () => !!(S && S.flags && S.flags.wd && S.flags.wd.until > S.age);
const wdK = () => wdOn() ? 4 : 0;
const WD_HELP = () => "Nếu bạn hoặc người thân khó bước ra khỏi nhà, các dịch vụ y tế hoặc xã hội địa phương có thể giúp; findahelpline.com có danh sách đường dây miễn phí";
const WD_FACT = c => c.id === 'JPN' ? "Ở Nhật Bản, 2,05% người 15–39 tuổi và 2,02% người 40–64 tuổi hầu như không ra khỏi nhà suốt hơn nửa năm (Văn phòng Nội các 2023)" : "2,4% người Hàn Quốc 19–34 tuổi hầu như không ra khỏi nhà (Khảo sát đời sống thanh niên 2022)";
const wdSvc = c => c.id === 'JPN' ? calYr() >= 2009 : calYr() >= 2024;
function wdYear(c, a) {
  wdKidYear(c);
  const W = S.flags.wd;
  if (W && W.until > a + 1 && !W.done && !(S.job === 'seeking' || S.retired)) { W.done = 1; W.end = a; W.until = a; return; }
  if (W && W.until > a + 1) {
    if (!W.mid && a - W.at >= 1 && W.until - W.at >= 4) { W.mid = 1; logD('wd', "Bạn chỉ ra cửa hàng tiện lợi gần nhà vào đêm khuya, khi không có ai." + ' ' + "Bạn vừa muốn thoát ra, vừa sợ hãi.", 'ev',
      c.id === 'JPN' ? "Trong số người 15–39 tuổi ở Nhật Bản hầu như không ra khỏi nhà, 38,2% mới sống như vậy chưa đến hai năm (Văn phòng Nội các 2023)" : "Trong một khảo sát thanh niên Hàn Quốc từng sống cô lập, khép kín, hơn 80% cho biết muốn thoát khỏi tình trạng đó (Bộ Y tế và Phúc lợi Hàn Quốc 2023)"); }
    return;
  }
  if (W && W.until <= a + 1 && !W.done) {
    W.done = 1; W.end = a; eff({ h: 4, so: 3 });
    const fam = S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent) || (S.fam.married && S.fam.partner && S.fam.partner.alive), svc = wdSvc(c) && (!fam || chance(0.5));
    logD('wd', (svc ? "Một tư vấn viên của trung tâm hỗ trợ liên lạc với bạn nhiều lần, và hai người cùng bắt đầu lại từ những buổi đi dạo ngắn." : fam ? "Nhờ gia đình kiên nhẫn chờ đợi mà không thúc ép, một ngày nọ bạn lại bước ra khỏi cửa." : "Một ngày nọ, bạn tự mình đi bộ ra tới công viên gần nhà.") + ' ' + "Thời gian bạn ở bên ngoài dần dần nhiều lên.", 'warm',
      c.id === 'JPN' ? "Mỗi tỉnh, thành ở Nhật Bản đều có trung tâm hỗ trợ khu vực giúp người khó ra khỏi nhà và gia đình họ (Bộ Y tế, Lao động và Phúc lợi Nhật Bản)" : "Trong khảo sát thanh niên Hàn Quốc từng sống cô lập, khép kín, 67,2% đã thử thoát ra bằng cách bắt đầu đi làm hoặc đi học (Bộ Y tế và Phúc lợi Hàn Quốc 2023)");
    return;
  }
  const R = WD_C[S.cur]; if (!R || a < R.a[0] || a > R.a[1] || calYr() < 1990 || !(S.job === 'seeking' || (S.retired && a < 65)) || S.mind || S.flags.hideCN || S.isComp || (S.dd && S.dd.lv >= 2)) return;
  const n = W ? W.n : 0; if (n >= 2) return;
  const harQ = S.flags.harQuit != null && a - S.flags.harQuit <= 2, longS = (S.flags.seekY || 0) >= 2;
  const k = (harQ ? 3 : 1) * (longS ? 1.5 : 1) * (S.flags.bullyN ? 1.5 : 1) * (S.fam.married ? 0.3 : 1) * (n && W.end != null && a - W.end <= 6 ? 4 : 1);
  if (!chance(R.p[a < 40 ? 0 : 1] * k)) return;
  S.flags.wd = { at: a, until: a + wdDur(a) + 1, n: n + 1 };
  eff({ h: -5, so: -6 });
  const left = (S.flags.lastJob && (S.flags.seekY || 0) <= 1) || (S.retired && a < 65);
  const t = n ? "Mọi chuyện khá lên được một thời gian, rồi những ngày bạn ra ngoài lại ít dần." : harQ ? "Sau khi nghỉ công việc đó, bạn trở nên sợ gặp người khác." : longS ? "Khi việc tìm việc kéo dài, bạn bắt đầu tránh liên lạc với bạn bè." : left ? "Sau khi thôi việc, bạn ngày càng ít có lý do để ra ngoài." : "Không biết từ khi nào, những ngày bạn ra khỏi nhà trở nên hiếm hoi.";
  logD('wd', t + ' ' + "Suốt hơn nửa năm, bạn hầu như không ra khỏi nhà.", 'bad', (n && c.id === 'KOR' ? "Trong khảo sát thanh niên Hàn Quốc từng sống cô lập, khép kín, 45,6% người trả lời từng cố quay lại cuộc sống thường ngày rồi lại rơi vào cô lập (Bộ Y tế và Phúc lợi Hàn Quốc 2023)" : WD_FACT(c)) + ' · ' + WD_HELP());
}
function wdKidYear(c) {
  const R = WD_C[S.cur]; if (!R || S.isComp || S.job === 'prison') return;
  for (const k of S.fam.kids) {
    if (!k.alive || k.away || k.abroad || k.placed || (k.dd && k.dd.lv >= 2)) continue;
    const ka = S.age - k.bornAt, n = callName(k.name), W = k.wd;
    if (W && W.until > ka + 1) continue;
    if (W && W.until <= ka + 1 && !W.done) {
      W.done = 1; eff({ h: 3 });
      logD('wd', (wdSvc(c) && chance(0.5) ? L`${iga(n)} 지원 기관 상담사와 만나기 시작하더니, 밖에 나가는 날이 조금씩 늘었습니다.` : L`${iga(n)} 어느 날 함께 장을 보러 가자는 말에 따라나섰습니다.` + ' ' + "Những ngày ra ngoài dần dần nhiều lên."), 'warm');
      continue;
    }
    if (W || ka < R.a[0] + 2 || ka > R.a[1] || calYr() < 1990 || (k.wed && !k.div) || k.cuT || !(k.withMe || k.stay || !k.grown) || kidInPr(k)) continue;
    if (!chance(R.kp[ka < 40 ? 0 : 1])) continue;
    k.wd = { at: ka, until: ka + wdDur(ka) + 1 };
    eff({ h: -3 });
    logD('wd', L`${iga(n)} 언제부턴가 집 밖에 거의 나가지 않고 방에서 지냈습니다.` + ' ' + L`${eul(n)} 재촉하지 않고, 방문 너머로 말을 걸며 기다렸습니다.`, 'ev', WD_FACT(c) + ' · ' + WD_HELP());
  }
}
const kidWd = (k, ka) => !!(k && k.wd && k.wd.until > ka);
const kidWorks = k => { const ka = S.age - k.bornAt; return ka >= 18 && ka < 65 && !!k.job && !!JOBS[k.job] && !JOBS[k.job].special && !kidWd(k, ka) && !kidInPr(k); };
const WD_NO = new Set(['city', 'abroad', 'nomad']);
function darkYear() {
  const c = C(), med = incomeAt(c, 0.5);
  if (S.alc && S.job !== 'prison') {
    S.alc.y++; eff({ hl: -2.5, h: -2, so: -2 }); S.money -= med * 0.03; book("Tiền rượu bia", -med * 0.03);
    if (isWorking()) S.pct = clamp(S.pct - 0.01, 0.005, 0.99);
    if (chance(0.05)) { S.alc = null; S.flags.alcOK = S.age; log("Một ngày nọ, bạn bỏ rượu. Không dễ dàng gì, nhưng bạn không bao giờ đụng lại nữa.", 'big', "Nhiều người từng lệ thuộc rượu đã tự hồi phục mà không cần điều trị (NIAAA)"); }
    else if (isWorking() && !inOffice() && !['owner', 'farm', 'agbiz', 'herder', 'fisher'].includes(S.job) && chance(0.06)) { S.flags.lastJob = S.job; S.job = 'seeking'; eff({ h: -8 }); log("Vì rượu, bạn đi muộn và nghỉ làm ngày càng nhiều, và cuối cùng mất việc.", 'bad'); }
    else if (chance(0.3)) log(pick(["Đêm này qua đêm khác, không có rượu bạn không ngủ được.", ...(famNear() ? ["Một câu bạn nói lúc say đã gây ra trận cãi vã lớn với gia đình."] : []), "Sáng nào tay bạn cũng run, và thứ đầu tiên bạn tìm đến là rượu."]), 'bad');
  } else if (!AGE12 && S.flags.alcOK != null && chance(0.03)) { S.alc = { since: S.age, y: 0 }; log("Khi khó khăn dồn dập, bạn lại tìm đến rượu.", 'bad'); }
  if (S.gamb && S.job !== 'prison') {
    S.gamb.y++; const loss = Math.max(S.income, med * 0.5) * (0.15 + rnd() * 0.2); S.money -= loss; book("Cờ bạc", -loss); eff({ h: -3, so: -2 });
    if (chance(0.06)) { S.gamb = null; S.flags.gambOK = S.age; log("Bạn đã bỏ cờ bạc. Số tiền đã mất không quay lại, nhưng giờ bạn không mất thêm nữa.", 'big'); }
    else log(pick(["Cố gỡ lại số tiền đã thua, bạn lại thua thêm.", "Bạn vay tiền để trả nợ cờ bạc.", ...(famNear() ? ["Bạn nướng vào cờ bạc cả số tiền dành dụm giấu gia đình."] : [])]) + ` (−${wonStr(loss)})`, 'bad');
  }
  if (S.job === 'prison' && S.flags.nkCamp) {
    eff({ hl: -5, h: -6, so: -4 }); S.stats.campY = (S.stats.campY || 0) + 1;
    if (S.age + 1 >= S.flags.prisonUntil) {
      const y = S.stats.campY - (S.flags.prisonY0 || 0); S.job = 'seeking'; S.flags.seekY = 0; S.flags.nkCamp = 0; S.yearMark = 'move';
      log(L`${y}년 만에 풀려나 집으로 돌아왔습니다. 그 뒤로도 감시가 따라다녔습니다.`, 'big');
    }
  } else if (S.job === 'prison' && S.flags.polPr) {
    eff({ hl: -3, h: -5, so: -2 }); S.stats.polY = (S.stats.polY || 0) + 1;
    if (S.age + 1 >= S.flags.prisonUntil) {
      const y = S.stats.polY - (S.flags.prisonY0 || 0); S.job = 'seeking'; S.flags.seekY = 0; S.flags.polPr = 0; S.yearMark = 'move';
      log(L`${y}년 만에 풀려났습니다. 그사이 바깥의 계절이 몇 번이나 바뀌었습니다.`, 'big');
    }
  } else if (S.job === 'prison') {
    eff({ hl: -3, h: -6, so: -4 }); S.stats.prisonY = (S.stats.prisonY || 0) + 1;
    const left = S.flags.prisonUntil - (S.age + 1), served = S.stats.prisonY - (S.flags.prisonY0 || 0);
    if (!S.flags.paroleAsked && S.flags.prisonLen >= 2 && left >= 1 && served >= Math.ceil(S.flags.prisonLen / 2)) S.flags.paroleQ = 1;
    if (S.age + 1 >= S.flags.prisonUntil) {
      S.job = 'seeking'; S.flags.seekY = 0; const y = S.stats.prisonY - (S.flags.prisonY0 || 0); S.flags.relAt = S.age + 1;
      log(L`${y}년 만에 교도소에서 나왔습니다. 세상은 그사이 많이 바뀌어 있었습니다.`, 'big', "Người ra tù đặc biệt khó tìm việc vì tiền án"); S.yearMark = 'move';
    }
  }
}
function sikhCity() { return chance(0.75) ? pick(["Ludhiana", "Amritsar", "Jalandhar", "Patiala"]) : chance(0.6) ? "Delhi" : "Chandigarh"; }
function relPick(c) { const w = {}; c.rel.split(',').forEach(p => { w[p[0]] = +p.slice(1); }); return wpick(w); }
const MUS = ['ar', 'ur', 'tr', 'ngn', 'ms', 'ps', 'fa', 'bn', 'so', 'wf', 'bsm', 'km', 'dv'];
const FAITH_NM = Object.fromEntries(Object.entries({
  IND: 'M:inm,C:inc', NPL: 'M:inm', PAK: 'H:hi,C:pkc', BGD: 'H:bh,B:bh', LKA: 'H:ta,M:lkm', MMR: 'M:mmm,H:hi',
  IDN: 'C:idc,H:ba', PHL: 'M:film', THA: 'M:ms',
  ETH: 'M:amm', ERI: 'M:amm', TZA: 'M:swm', KEN: 'M:swm', UGA: 'M:swm', BDI: 'M:swm', RWA: 'M:swm', MWI: 'M:swm',
  MOZ: 'M:swm', MDG: 'M:swm',
  GHA: 'M:wf', LBR: 'M:wf', CMR: 'M:wf', CAF: 'M:wf', GAB: 'M:wf', GNQ: 'M:wf', COD: 'M:wf', COG: 'M:wf', SSD: 'M:ar',
  TCD: 'C:tdc', BFA: 'C:wfc', MLI: 'C:wfc', SEN: 'C:wfc', GIN: 'C:wfc', GMB: 'C:wfc', NER: 'C:wfc',
  EGY: 'C:arc', SDN: 'C:arc', SYR: 'C:arc', LBN: 'C:arc', JOR: 'C:arc', LBY: 'C:arc', IRQ: 'C:arc', PSE: 'C:arc', ISR: 'C:arc',
  SAU: 'C:fil,H:hi', OMN: 'C:fil,H:hi', KWT: 'C:fil,H:hi', QAT: 'C:fil',
  RUS: 'M:ca,C:ru,N:ru,O:ru', KAZ: 'M:ca,C:ru', KGZ: 'C:ru', UZB: 'C:ru', TJK: 'C:ru', TKM: 'C:ru', AZE: 'C:ru', MNG: 'M:ca',
  GEO: 'M:tr', BGR: 'M:tr', GRC: 'M:tr', SRB: 'M:bsm', AUT: 'M:tr', CHE: 'M:tr',
  ITA: 'M:ar', ESP: 'M:ar', NLD: 'M:ar', BEL: 'M:ar', SWE: 'M:ar', DNK: 'M:ar', FIN: 'M:ar', NOR: 'M:ur', IRL: 'M:ar',
  USA: 'M:ar', CAN: 'M:ur,H:hi,S:sik', AUS: 'M:ar,H:hi', NZL: 'M:ar,H:hi', ZAF: 'M:ur,H:hi',
  MKD: 'M:sq,C:mk', XKX: 'M:sq', MUS: 'C:fr,B:zhd', SUR: 'M:id', FJI: 'M:ur,C:fj', BTN: 'B:bo,H:ne',
}).map(([k, v]) => [k, Object.fromEntries(v.split(',').map(p => p.split(':')))]));
const ZH_DIA = new Set(['USA']);
function clusterFor(c, rel) { const k = clusterFor0(c, rel); return k === 'zh' && ZH_DIA.has(c.id) && NAMES.zhd ? 'zhd' : k === 'za' && c.id === 'ZAF' && NAMES.zaf ? 'zaf' : k; }
function clusterFor0(c, rel) {
  const fx = FAITH_NM[c.id]; if (fx && fx[rel] && NAMES[fx[rel]]) return fx[rel];
  if (rel === 'S' && NAMES.sik) return 'sik';
  const parts = c.nm.split(',').map(s => { const [k, w] = s.split(':'); return [k, w ? +w : 100]; });
  const keys = parts.map(p => p[0]);
  if (keys.length === 1) return keys[0];
  if (c.id === 'NGA') return rel === 'M' ? 'ngn' : 'ngs';
  if (rel === 'M') { const m = keys.find(k => MUS.includes(k)); if (m) return m; }
  if (rel === 'H' && keys.includes('hi')) return 'hi';
  if (rel === 'J' && keys.includes('he')) return 'he';
  if ((rel === 'B' || rel === 'F') && keys.includes('zh')) return 'zh';
  if (rel === 'C' && keys.includes('fil')) return 'fil';
  const w = {}; for (const [k, v] of parts) if (!MUS.includes(k)) w[k] = v;
  if (!Object.keys(w).length) for (const [k, v] of parts) w[k] = v;
  return wpick(w);
}
function femSurname(s, kind) {
  if (kind === 'a') return /(ov|ev|in)$/.test(s) ? s + 'a' : s;
  if (kind === 'az') return /(ov|ev)$/.test(s) ? s + 'a' : s;
  if (kind === 'pl') return s.replace(/ski$/, 'ska').replace(/cki$/, 'cka');
  if (kind === 'lt') return /ius$/.test(s) ? s.replace(/ius$/, 'iūtė') : /as$/.test(s) ? s.replace(/as$/, 'aitė') : /[iy]s$/.test(s) ? s.replace(/[iy]s$/, 'ytė') : /us$/.test(s) ? s.replace(/us$/, 'utė') : s;
  if (kind === 'lv') return /š$/.test(s) ? s.replace(/š$/, 'a') : /ons$/.test(s) ? s.replace(/ons$/, 'one') : /is$/.test(s) ? s.replace(/is$/, 'e') : /s$/.test(s) ? s.replace(/s$/, 'a') : s;
  if (kind === 'mk') return /ski$/.test(s) ? s.replace(/ski$/, 'ska') : /(ov|ev)$/.test(s) ? s + 'a' : s;
  if (kind === 'cz') return /ý$/.test(s) ? s.replace(/ý$/, 'á') : /a$/.test(s) ? s.replace(/a$/, 'ová') : /e[kc]$/.test(s) ? s.replace(/e([kc])$/, '$1ová') : s + 'ová';
  if (kind === 'el') return /idis$/.test(s) ? s.replace(/idis$/, 'idou') : /akis$/.test(s) ? s.replace(/akis$/, 'aki') : /os$/.test(s) ? s.replace(/os$/, 'ou') : /is$/.test(s) ? s.replace(/is$/, 'i') : /as$/.test(s) ? s.replace(/as$/, 'a') : s;
  return s;
}
const nameBand = y => y < 1945 ? '1' : y < 1965 ? '2' : y < 1985 ? '3' : '';
function makeName(cl, sex, o = {}) {
  const N = NAMES[cl] || NAMES.en;
  const y = o.y != null ? o.y : S && S.age != null ? (o.kid ? calYr() : S.by || NOW_Y) : NOW_Y, b = N.m1 ? nameBand(y) : '';
  const g = pick(sex === 'F' ? N['f' + b] || N.f : N['m' + b] || N.m);
  let base = o.family || '';
  if (!base) {
    if (N.o === 'pat') base = o.father || pick(N.m);
    else if (N.o === 'bin') base = o.father || pick(N.s);
    else if (N.o !== 'mono') base = pick(sex === 'F' && N.fs && !o.kid ? N.fs : N.s);
  }
  let fam = base;
  if (N.o === 'bin') fam = (sex === 'F' ? 'binti ' : 'bin ') + base;
  if (sex === 'F' && N.fem) fam = femSurname(base, N.fem);
  if (o.rel === 'S') base = fam = sex === 'F' ? 'Kaur' : 'Singh';
  let full;
  if (N.o === 'fgns') full = fam + ' ' + g;
  else if (N.o === 'fg') full = fam + ' ' + g;
  else if (N.o === 'vi') full = fam + ' ' + pick(sex === 'F' ? N.fm : N.mm) + ' ' + g;
  else if (N.o === 'mono') full = g;
  else full = g + ' ' + fam;
  return { g, base, full, cl };
}
const SAME_SUR_OK = new Set(['ko', 'zh', 'vi']);
function familyNames() {
  const f = S && S.fam; if (!f) return new Set();
  const s = new Set([S.name, natNmObj(), f.partner && f.partner.name, f.dating && f.dating.name, f.co && f.co.name, f.wife2 && f.wife2.name, ...(f.kids || []).map(k => k.name)].filter(Boolean).map(callName));
  for (const x of (S.flags && S.flags.fUsed) || []) s.add(x);
  return s;
}
const natNmObj = () => { const nn = S && S.flags && S.flags.natNm; return nn && nn.g ? { g: nn.g, base: nn.base, full: S.flags.natName || nn.g, cl: nn.cl } : null; };
function partnerName(cl, psex, o = {}) {
  const taken = familyNames();
  let n; for (let i = 0; i < 12; i++) { n = makeName(cl, psex, o); if ((i >= 8 || SAME_SUR_OK.has(cl) || !n.base || !S.name || n.base !== S.name.base) && !taken.has(callName(n))) break; }
  return n;
}
function otherName(cl, sex) { const taken = familyNames(); let nm = ''; for (let i = 0; i < 10 && (!nm || taken.has(nm)); i++) nm = callName(makeName(cl, sex, {})); return frKeep(nm, sex); }
const frKeep = (nm, sx) => {  return nm; };
const callName = n => !n ? '' : (n.cl === 'vi' && n.full ? n.full.split(' ').pop() : (n.cl === 'ko' || n.cl === 'zh' || n.cl === 'hk' || n.cl === 'ja') ? n.g : n.g.split(' ')[0]);
function cityOf(c) { const l = CITIES[c.id]; return l ? pick(l.split(',')) : "thủ đô"; }
const PRK_PY = [0.03, 0.07, 0.16, 0.28, 0.42];
const bornCityOf = (c, q) => { if (c.id !== 'PRK') return cityOf(c); const cs = (CITIES.PRK || '').split(','); return chance(PRK_PY[q - 1] || 0.16) ? cs[0] : pick(cs.slice(1)); };
function newLife(mode = 'birth', paceMin = 60, forceIso, o) {
  AGE12 = AGE12_SITE || EDU_ON;
  const era = o && o.era && o.era !== 'now' && eraLoaded() ? o.era : null, by = era ? clamp(Math.round(o.by || NOW_Y), ERA_Y0, NOW_Y) : null;
  const c = era ? eraAt(forceIso ? CBY[forceIso] : chooseCountry(mode, by), by) : forceIso ? CBY[forceIso] : chooseCountry(mode);
  const srb = c.id === 'CHN' ? 0.528 : c.id === 'IND' ? 0.519 : 0.512;
  const sex0 = chance(srb) ? 'M' : 'F', sex = o && (o.sex === 'M' || o.sex === 'F') ? o.sex : sex0;
  const rel = relPick(c);
  let cl = clusterFor(c, rel);
  const eth = ethDraw(c, rel, cl);
  if (eth && c.id === 'ZAF') cl = eth.g === 'za_white' || eth.g === 'za_col' ? 'en' : eth.g === 'za_black' ? 'zaf' : cl;
  if (eth && ETH_G[eth.g].ncl) cl = ETH_G[eth.g].ncl;
  const royal = royalDraw(c);
  const caste = royal ? null : casteDraw(c, rel, eth);
  const q = royal === 'r' ? 5 : royal === 'n' ? Math.max(4, ethQ(c.id, eth)) : caste ? casteQ(c.id, caste) : ethQ(c.id, eth);
  const urbP = eth && ETH_G[eth.g].urb != null ? ETH_G[eth.g].urb : c.urb;
  const urban = chance(lowInc(c) ? odds(urbP / 100, Math.exp(0.45 * (q - 3))) : odds(urbP / 100, Math.exp(0.15 * (q - 3))));
  const fatherName = pick((NAMES[cl] || NAMES.en).m);
  const name = makeName(cl, sex, { rel, father: fatherName, family: caste ? casteSur(caste, cl) : undefined, y: by || NOW_Y });
  const lt = lifeTable(c, sex);
  const afm = afmF(c);
  const mAge = Math.round(clamp(afm + 3 + (rnd() + rnd() + rnd() - 1.5) * 6 + (c.tfr - 2) * 1.2, 15, 46));
  const fAge = Math.round(clamp(mAge + coupleGap(c) + (rnd() - 0.5) * 6, 17, 70));
  const kidsMean = Math.max(1, c.tfr * (lowInc(c) ? 1.25 - 0.1 * (q - 1) : 1));
  let total = 1; { const lam = Math.max(0, kidsMean); let lim = Math.exp(-lam), k = 0, p = 1; do { k++; p *= rnd(); } while (p > lim); total += k - 1; }
  const older = Math.min(ri(0, total - 1), Math.max(0, Math.floor((mAge - 16) / 2.2)));
  const absentP = { hi: 0.16, lac: 0.25, ssa: 0.17, sa: 0.04, eap: 0.06, mena: 0.04, eca: 0.12 }[c.p] + (c.id === 'USA' ? 0.08 : 0);
  S = {
    v: 3, phase: 'birth', mode, paceMin,
    yearSec: clamp(paceMin * 60 / Math.max(lt.e0, 60), 12, 120),
    t: 0, age: 0, speed: 1, paused: false,
    born: c.id, cur: c.id, sex, q, urban, city: null, bornUrban: urban, bornCity: null, rel, cl, name, eth, caste,
    st: { hl: clamp(78 + (q - 3) * 3 - c.u5 / 12 + ri(-6, 6), 40, 95), h: 60 + ri(-8, 8), sm: 50, so: 55 + ri(-6, 6) },
    tal: talDraw(rnd), kE: 0,
    money: 0, house: 0, debt: 0, income: 0, pct: 0, job: 'student', jobY: 0, formal: false, formalY: 0, exp: {},
    edu: 0, school: null, schoolY: 0, focus: null, fT: {},
    fam: { mom: { age: mAge, alive: true }, dad: { age: fAge, alive: true, absent: chance(absentP) }, older, younger: total - 1 - older, sibBorn: 0, sibAt: [], mAt: mAge,
      partner: null, married: false, kids: [], father: fatherName },
    trait: null, smoker: false, quitTried: 0, conds: {}, hobbies: [], owns: {},
    mig: null, migY: 0, refugee: false, served: false, serveLeft: 0, pension: 0, retired: false,
    log: [], years: [], queue: [], pending: null, recent: [], flags: {}, done: {}, deathAt: null,
    stats: { maxIncome: 0, maxPct: 0, kidsBorn: 0, kidsLost: 0, moves: 0, decisions: 0 },
  };
  S.curse = CURSE_ON() ? cursePick() : null;
  if (EDU_ON) S.eduOn = 1;
  ageSync();
  if (era) eraNew({ era, by });
  sibPolicyOlder(by || NOW_Y);
  sibOlderFit(c);
  if (eth && eth.nat) S.fam[eth.p === 'f' ? 'dad' : 'mom'].nat = eth.nat;
  if (royal) { S.flags.royal = royal; if (royal === 'r' || chance(0.3)) { const top = royal === 'r' && (ROYAL_GULF.has(c.id) || chance(0.5)); S.flags.rich = top ? 2 : 1; S.flags.richQ = top ? Math.max(2e-5, rnd() * 0.001) : 0.001 + rnd() * 0.009; } }
  if (q === 5 && !S.flags.rich && chance(0.05)) { const top = chance(0.1); S.flags.rich = top ? 2 : 1; S.flags.richQ = top ? Math.max(2e-5, rnd() * 0.001) : 0.001 + rnd() * 0.009; }
  S.city = S.bornCity = urban ? (c.id === 'IND' && rel === 'S' ? sikhCity() : eth && ETH_G[eth.g].city ? pick(ETH_G[eth.g].city) : bornCityOf(c, q)) : null;
  S.fam.gp = makeGrandparents(c, S.fam.mom.age, S.fam.dad.age);
  parentJobs();
  rohBirth();
  hivBirth(c);
  disBirth(c);
  ddBirth(c);
  ndBirth();
  pretermBirth();
  { const ad = adoptDraw(c, sex, by || NOW_Y, eth); if (ad) { S.adopt = ad; if (!ad.scoop) adoptBirthFam(c); } }
  if (!S.adopt && !S.flags.royal && !S.flags.rich) S.fc = fcDraw(c);

  // Vô Hạn Lưu: Soul Karma (Luân Hồi Chủng Tử) Application (Pillar 6)
  try {
    const rawKarma = window.__SECURE_STORAGE__ ? window.__SECURE_STORAGE__.getItem('vhts_soul_karma', null) : localStorage.getItem('vhts_soul_karma');
    if (rawKarma) {
      const karma = JSON.parse(rawKarma);
      if (karma && karma.pts > 0) {
        S.vhtsKarma = karma;
        const pts = karma.pts;
        const trait = karma.trait || 'Hạt giống Luân hồi';
        if (karma.type === 'healer') {
          S.st.hl = Math.min(98, S.st.hl + 8);
          log(`[Luân Hồi Ấn Ký - Bàn tay Chữa lành]: Tích lũy thiện nghiệp từ tiền kiếp (+8 Sức khỏe sinh tồn).`, 'good');
        } else if (karma.type === 'wealth') {
          S.money += Math.round(incomeAt(c, 0.5) * 1.5);
          log(`[Luân Hồi Ấn Ký - Khứu giác Kim tiền]: Phúc báo kinh tài kiếp trước mang lại khoản tích lũy khởi đầu thuận lợi.`, 'good');
        } else if (karma.type === 'scholar') {
          S.st.sm = Math.min(95, S.st.sm + 8);
          log(`[Luân Hồi Ấn Ký - Tuệ căn Sáng suốt]: Tư chất thông tuệ từ kiếp trước soi sáng con đường tầm học (+8 Trí tuệ).`, 'good');
        } else if (karma.type === 'social') {
          S.st.so = Math.min(95, S.st.so + 8);
          eff({ so: 8 });
          log(`[Luân Hồi Ấn Ký - Duyên lành Gia tộc]: Nhân duyên hiền hòa từ tiền kiếp giúp kết nối sâu sắc với người xung quanh (+8 Xã hội).`, 'good');
        } else {
          S.st.h = Math.min(95, S.st.h + 8);
          log(`[Luân Hồi Ấn Ký - Ý chí Kiên định]: Tâm thức vững vàng từ tiền kiếp nâng đỡ tinh thần và sự lạc quan (+8 Hạnh phúc).`, 'good');
        }
        if (karma.pts >= 5 || karma.cultivator) {
          S.flags.vhts_cult_seed = 1;
          log(`[Tiên Thiên Linh Căn]: Duyên nợ luân hồi tích lũy sâu dày, linh hồn mang theo Tiên Thiên Khí Căn sẵn sàng thức tỉnh kỳ ngộ.`, 'good');
        }
      }
    }
    // Rare natural spiritual root (0.5% natural probability)
    if (!S.flags.vhts_cult_seed && Math.random() < 0.005) {
      S.flags.vhts_cult_seed = 1;
    }
  } catch (e) { console.error('Soul Karma application error:', e); }

  planYear();
  return S;
}
const FX = { base: null, entry: null };
function fxStart() { FX.base = S ? [S.st.hl, S.st.h, S.st.sm, S.st.so] : null; FX.entry = null; }
function fxEnd() {
  if (FX.base && FX.entry) { const d = {}; ['hl', 'h', 'sm', 'so'].forEach((k, i) => { const v = Math.round(S.st[k] - FX.base[i]); if (v) d[k] = v; }); if (Object.keys(d).length) FX.entry.fx = d; }
  FX.base = null; FX.entry = null;
}
let LOG_Q = null;
function log(text, kind = 'ev', fact, egg) {
  if (kind === 'loss' && S) S.flags.lossY = S.age;
  if (fact && S.era && S.era !== 'now' && typeof eraFactOK === 'function' && !eraFactOK(fact)) fact = null;
  const e = { a: S.age, text: capS(text), kind }; if (fact) e.fact = capS(fact);
  if (kind === 'dec' && LOG_Q) e.q = LOG_Q; LOG_Q = null;
  if (egg) e.egg = egg;
  if (NF_ON) e.nf = 1;

  if (FX.base) FX.entry = e;
  if (!S.isComp && kind !== 'comp') { try { const fa = famAges(e.text, true); if (fa) e.fa = fa; } catch (x) { } }
  { const act = actNow(kind, egg); if (act) e.act = act; }
  if (S.td && !S.isComp && typeof tdLine === 'function') tdLine(e, text);
  S.log.push(e); if (S.log.length > 1500) S.log.splice(0, S.log.length - 1500);
  HOOK.log(e);
}
let ACT_NEXT = null, ACT_EV = null, ACT_DEC = null, ACT_FN = null, TRIP_ACT = null;
const ACT_KINDS = new Set(['big', 'loss', 'warm', 'note']);
function actNow(kind, egg) {
  const nx = ACT_NEXT; ACT_NEXT = null;
  if (!ACT_KINDS.has(kind) || !S) return null;
  if (nx) return nx;
  if (egg) return EGG_ACT[egg] || 'award:prize';
  try {
    if (ACT_FN && !ACT_EV && !ACT_DEC) return ACT_FN() || null;
    if (ACT_EV) { const f = EV_ACT[ACT_EV]; return (typeof f === 'function' ? f() : f) || null; }
    if (ACT_DEC) { const f = DEC_ACT[ACT_DEC.id]; return (typeof f === 'function' ? f(ACT_DEC.k, ACT_DEC.p || {}, ACT_DEC) : f) || null; }
  } catch (e) { }
  return null;
}
function logA(act, text, kind, fact, egg) { ACT_NEXT = act; log(text, kind, fact, egg); }
const FA_SEEN = { a: -1, s: new Set() };
const FA_W = { ko: { par: ['부모님'], mom: ['어머니'], dad: ['아버지'], gk: ['손주', '손자', '손녀'] },
  vi: { par: ['bố mẹ', 'Bố mẹ', 'cha mẹ', 'Cha mẹ'], mom: ['mẹ', 'Mẹ'], dad: ['bố', 'Bố'], gk: ['cháu', 'Cháu'] } };
const FA_VI_PV = /(?:^|[^\p{L}])(công|tuyên|ban|khủng|phân|ông|bà|người|làm|thành|các|những|một|anh|chị|em) $/iu;
const FA_VI_NX = /^ (?:mẹ |bố )?(?:(?:chồng|vợ|kế|nuôi|dượng|ghẻ|đẻ|ruột|đỡ|bề|trí|cục|thí|ráp|nó|họ|(?:anh|chị|cậu|cô|em) ấy)(?!\p{L})|của (?!bạn(?!\p{L})))/iu;
const FA_VI_SIB = /anh chị em|anh trai|chị gái|em trai|em gái|anh em|chị em|cháu trai, con|cháu gái, con|con của anh|con của chị|con của em/i;
function faWord(t, w, nm) {
  for (let i = t.indexOf(w); i >= 0; i = t.indexOf(w, i + 1)) {
    const pv = t[i - 1] || '', nx = t.slice(i + w.length, i + w.length + 4);
    
    
    
          if (/\p{L}/u.test(pv) || /^\p{L}/u.test(nx)) continue; if (nm) return true;
      if (FA_VI_PV.test(t.slice(Math.max(0, i - 8), i)) || FA_VI_NX.test(t.slice(i + w.length, i + w.length + 12)) || (/^cháu$/i.test(w) && FA_VI_SIB.test(t))) continue;
      return true;
    
    
    
    if (/[A-Za-z]/.test(pv) || /^-/.test(nx) || (/^[A-Za-z]/.test(nx) && !/^ren\b/.test(nx))) continue; return true;
  }
  return false;
}
function famAges(text, yr) {
  if (!S || !S.fam || !text) return '';
  const t = String(text), f = S.fam, out = [], W = FA_W[LANG] || FA_W.ko, any = ws => ws.some(w => faWord(t, w));
  const has = n => new RegExp('(^|[^0-9])' + n + '([^0-9]|$)').test(t);
  if (yr && FA_SEEN.a !== S.age) { FA_SEEN.a = S.age; FA_SEEN.s = new Set(); }
  const add = (key, s) => { if (yr) { if (FA_SEEN.s.has(key)) return; FA_SEEN.s.add(key); } out.push(s); };
  for (const k of f.kids || []) {
    if (!k.alive || !k.name || k.cut != null) continue;
    const n = callName(k.name), ka = S.age - k.bornAt; if (!n || n.length < 2 || ka < 1 || has(ka)) continue;
    if ((k.name.full && t.includes(k.name.full)) || faWord(t, n, true)) add('k' + k.bornAt + n, L`${n} ${ka}세`);
  }
  const mom = f.mom && f.mom.alive && !f.mom.absent, dad = f.dad && f.dad.alive && !f.dad.absent, both = any(W.par);
  if (mom && (both || any(W.mom)) && !has(f.mom.age)) add('m', L`어머니 ${f.mom.age}세`);
  if (dad && (both || any(W.dad)) && !has(f.dad.age)) add('d', L`아버지 ${f.dad.age}세`);
  if (any(W.gk)) {
    const as = (Array.isArray(f.grand) ? f.grand : []).filter(g => !g.gone).map(g => S.age - g.bornAt).filter(a => a >= 1).sort((x, y) => x - y);
    if (as.length && !(as.length === 1 && has(as[0]))) add('g', as.length <= 4 ? L`손주 ${as.join('·')}세` : L`손주 ${as.length}명 ${as[0]}~${as[as.length - 1]}세`);
  }
  return out.join(' · ');
}
const EGG_ACT = { nobel: 'award:prize', fields: 'award:prize', turing: 'award:prize', named: 'award:prize', oscar: 'award:stage', grammy: 'award:stage', comet: 'stars', meteor: 'stars',
  dino: 'trip:nature::solo', species: 'trip:nature::solo', relic: 'trip:nature::solo', rescue: 'help' };
const actRare = () => { const j = S.job; if (S.yearMark === 'star') return j === 'athlete' ? 'award:medal' : ['musician', 'idol', 'actor', 'dancer'].includes(j) ? 'award:stage' : 'award:prize'; return actJob(j); };
const actOf = (a, x) => a[(S.age * 7 + S.log.length + String(x || '').length) % a.length];
const actJob = j => j && j !== 'seeking' && j !== 'student' && j !== 'retired' && j !== 'prison' ? 'work:' + j : null;
const actHob = () => { const h = (S.hobbies || []).slice().sort((x, y) => y.lv - x.lv)[0]; return h ? 'hobby:' + h.id : null; };
const actWed = () => { const f = S.fam, P = f.partner; if (f.married && P && f.marriedAt === S.age) return P.cohab ? 'home' : 'wed'; return f.dating ? 'date' : null; };
const EV_ACT = { kidsick: 'hosp:me', fam_books: 'bed:me', fam_room: 'study', fam_trip: () => 'trip:' + actOf(['beach', 'mount', 'nature']) + '::par', kid_bike: 'play:bike', kid_rain: 'rain', kid_snow: 'rain:snow',
  kid_academy: 'study', kid_lamp: 'study', kid_ball: 'play', kid_library: 'hobby:reading', kid_faith: 'fest', kid_tree: 'play', play: 'play', kinder: 'school', fest: 'fest', grades: 'study', teacher: 'study',
  bff: 'friends', exam: 'study', harvest: () => actJob(S.job), wedding: 'wed:g', reunion: 'friends', accident: 'hosp:me', dis_friend: 'friends', dis_class: 'study', dis_club: 'friends',
  kc_night: 'bed', kc_word: 'bed', kc_draw: 'bed', kc_sports: 'play', kc_prize: 'meal', kc_talk: 'talk:kid', kc_bday: 'cake:kid', kc_pay: 'phone', kc_abroad: 'phone', kc_visit: 'phone',
  fr_call: 'phone:gift', fr_help: 'friends', fr_move: 'help', fr_hosp: 'hosp:fr', grandkid: 'grand:new', parentill: 'hosp:par', neighbor: 'help', youthday: () => actHob(), volcoach: 'work:coach',
  friendgone: 'loss:fr', memory: 'photos', grandgarden: 'garden', anniv: 'anniv', teachjr: () => actJob(S.job), kidcall: 'phone', wallet: 'help', kindhelp: 'help', repay: 'phone', volunteer: 'help',
  sibling: 'baby', gpvisit: 'meal', gpcall: 'phone', sib_life: 'meal', hob_life: () => actHob(), oh_kid: 'meal', oh_care: 'photos', eth_warm: 'meal',
  w_dish: 'meal', w_stars: 'stars', w_rain: 'rain', w_share: 'fest', w_stranger: 'help', w_firstpay: 'talk:par', w_teach: 'study', w_otherfaith: 'fest', w_walk: 'walk:pt', w_kidlove: 'bed', w_sunrise: 'walk',
  w_welcome: 'help', w_voice: 'phone', w_lookback: 'photos', w_grandstory: 'grand', w_song: 'fest', w_sib: 'meal', w_oldfriends: 'friends', w_thanks: 'phone', w_table: 'meal', w_neighborkid: 'walk',
  w_learn: 'study', w_view: 'walk', w_help: 'help', w_kidcall: 'phone', w_kidgift: 'phone:gift', w_harvest: 'garden', w_morning: 'photos', w_mentor: () => actJob(S.job) };
const DEC_ACT = { school2: 'school', school3: 'school', college: () => S.school === 'uni' ? 'pass' : null, retake: 'study', afterUni: () => S.school ? 'pass' : null, service: 'mil:in',
  job: () => actJob(S.job), jobchange: () => actJob(S.job), adultedu: 'study', hmwork: () => actJob(S.job), petq: () => S.pet ? 'pet:' + S.pet.k : null, biz: null, bizfund: () => S.job === 'owner' ? 'shop' : null,
  bizop: () => actJob(S.job), partner: () => actWed(), prq: 'citizen', natq: 'citizen', wedtalk: () => actWed(), cohabwed: () => actWed(), datepreg: () => actWed(), wife2: 'wed', faithwed: () => actWed(),
  alcquit: 'walk', gambquit: 'walk', quit: 'walk', drink: k => k === 'no' || k === 'walk' ? 'walk' : null, mind: 'talk:fr', mindhelp: 'talk:fr', atone: 'talk:par',
  city: 'home', abroad: () => 'fly:' + C().p, erasmus: 'fly', war: k => k === 'flee' || k === 'go' ? 'flee' : null, defect: 'flee', defroute: 'flee', histgo: 'fly', homecoming: 'back', histjunta: k => k === 'leave' ? 'fly' : null, histrg: k => k === 'help' ? 'help' : null,
  hobby: k => k && k !== 'none' ? 'hobby:' + k : null, dream: () => actHob(), buy: (k, p) => p.item === 'house' ? 'home' : p.item === 'car' ? 'car' : p.item === 'moto' ? 'car:moto' : null,
  illness: 'hosp:me', tbcare: 'hosp:me', hivtx: 'hosp:me', babycare: 'play', maternity: 'baby', major: 'study', movenear: 'home', kidsick: 'hosp:kid',
  kidq: 'talk:kid', kidwant: 'talk:kid', kidteen: 'talk:kid', kidcm: 'talk:kid', kidabroad: 'phone',
  kidwed: (k, p) => { const kd = S.fam.kids[p.i]; return kd ? 'wed:' + (kidSS(kd) ? 's' : 'k') + ':' + kd.sex + ':' + (S.age - kd.bornAt) : 'wed:g'; },
  ofpath: () => actJob(S.job), phd: () => S.school === 'phd' ? 'pass' : null, profapp: () => S.job === 'prof' ? 'work:prof:rank' : null, vocation: () => actJob(S.job), ordain: 'work:clergy',
  rankup: () => S.job ? 'work:' + S.job + ':rank' : null, bizscale: () => actJob(S.job), growup: () => S.job ? 'work:' + S.job + ':rank' : null, ownup: () => S.job ? 'work:' + S.job + ':rank' : null,
  protry: () => S.job === 'athlete' ? 'work:athlete' : null, youthtry: () => S.flags.youth ? actHob() : null, coachq: () => actJob(S.job), mustry: () => S.job === 'musician' ? 'work:musician' : null,
  idolaud: () => S.flags.trainee ? 'pass' : null, idolafter: () => actJob(S.job), gametry: () => S.flags.gamer ? 'pass' : null, gameafter: () => actJob(S.job), acttry: () => S.job === 'actor' ? 'work:actor' : null, dnctry: () => S.job === 'dancer' ? 'work:dancer' : null, arttry: () => S.job === 'artist' ? 'work:artist' : null,
  apprent: () => actJob(S.job), selfcode: 'study', nomad: 'trip:city::solo', astro: 'work:astro', farmback: 'work:farm', heir: () => actJob(S.job), dreamtry: () => actJob(S.job),
  runlocal: () => S.flags.council === S.age ? 'award:elect' : null, runnational: () => S.job === 'mp' ? 'award:elect' : null, runleader: () => S.job === 'leader' ? 'award:elect' : null,
  mandret: (k, p, d) => S.retired ? (d.job ? 'work:' + d.job + ':ret' : null) : actJob(S.job), retire: (k, p, d) => d.job ? 'work:' + d.job + ':ret' : null,
  oldhome: k => k === 'kid' ? 'meal' : null, care: k => k === 'home' || k === 'near' ? 'talk:par' : null, lend: 'talk:fr', kidschool: 'school', stepin: 'meal', stepkids: 'meal',
  mcrisis: () => S.fam.married ? 'talk:pt' : null, hajj: 'trip:city:mena:solo', stranger: 'help', newneighbor: 'meal', speakup: () => actJob(S.job), forgive: 'talk:fr', thanks: 'talk:par', mentor: () => actJob(S.job),
  sm_after: 'hobby:reading', sm_wallet: 'help', sm_pocket: 'meal', sm_weekend: 'photos', sm_reunion: 'friends', sm_holiday: k => k === 'go' || k === 'trip' ? 'trip:' + actOf(['beach', 'mount', 'nature']) + '::' + (S.fam.married ? 'fam' : 'solo') : null,
  sm_cook: 'hobby:cooking', sm_walk: 'walk', sm_call: 'phone', sm_kidplay: 'play', sm_tidy: 'help', sm_volunteer: 'help', sm_friend: 'friends', sm_gkmoney: 'grand' };
const SHOP_ACT = { own_house: 'home', own_car: 'car', own_moto: 'car:moto', dinner: () => S.fam.married ? 'anniv' : 'meal', party: 'friends', parents: 'meal', course: 'study', ged: 'study', nightgrad: 'study', nightuni: 'study',
  moveout: 'home', movehome: 'home', moveplan: 'home', bigger: 'home', smaller: 'home', remodel: 'home', meet: 'date', openuni: 'study', gear: () => S.flags.gearAct || actHob() };
const griefFar = who => farFromNK() || (S.cur !== S.born && !famCame() && !(who && (S.flags.parCame != null || S.flags.careHome === who)));
function grieve(r, n) { if (!S || !n) return; const g = S.flags.grief || (S.flags.grief = []); g.push({ r, n, at: S.age }); if (g.length > 12) g.shift(); }
function eff(d) {
  const st = S.st, hk = HARD_K();
  if (hk > 1) { d = Object.assign({}, d); for (const k of ['hl', 'h', 'so']) if (d[k] < 0) d[k] = d[k] * hk; }
  for (const k of ['hl', 'h', 'so']) if (d[k]) st[k] = clamp(st[k] + d[k], 0, 100);
  if (d.sm) knowAdd(d.sm);
  if (d.money) S.money += d.money;
  HOOK.change(d);
}
function stage() {
  const a = S.age;
  if (a < 6) return 'baby';
  if (S.serveLeft > 0) return 'service';
  if (S.school || S.flags.between || S.flags.retakeAt != null) return 'school';
  if (a < 15) return 'kidwork';
  if (a >= 65 || S.retired) return 'elder';
  return 'adult';
}
const FOCUS = {
  study: { n: "Học tập", d: "Kiến thức↑ Hạnh phúc↓", e: { sm: 5, h: -1, so: -1 } },
  play: { n: "Bạn bè·vui chơi", d: "Quan hệ↑ Hạnh phúc↑", e: { so: 4, h: 4 } },
  help: { n: "Giúp việc nhà", d: "Gia đình↑ Kiến thức↓ một chút", e: { so: 2, sm: -1 } },
  sport: { n: "Thể thao", d: "Sức khỏe↑", e: { hl: 4, h: 2, so: 1 } },
  hobby: { n: "Sở thích", d: "Hạnh phúc↑ Kỹ năng sở thích↑", e: { h: 4 } },
  work: { n: "Dồn sức cho công việc", d: "Thu nhập·Thăng tiến↑ Sức khỏe·Quan hệ↓", e: { hl: -3, h: -2, so: -2 } },
  balance: { n: "Cân bằng", d: "Mỗi thứ một chút", e: { h: 1, hl: 1, so: 1 } },
  family: { n: "Gia đình·bạn bè", d: "Quan hệ↑ Hạnh phúc↑", e: { so: 5, h: 3 } },
  health: { n: "Chăm sóc sức khỏe", d: "Sức khỏe↑ Tiền↓ một chút", e: { hl: 5, h: 1 } },
  learn: { n: "Phát triển bản thân", d: "Kiến thức↑ Lời mời chuyển việc↑", e: { sm: 4, h: -1 } },
  faith: { n: "Tôn giáo·thiện nguyện", d: "Quan hệ↑ Hạnh phúc↑", e: { so: 4, h: 3 } },
  rest: { n: "Nghỉ ngơi", d: "Sức khỏe↑ Hạnh phúc↑", e: { hl: 2, h: 2, sm: -1 } },
  mind: { n: "Học hỏi·rèn trí não", d: "Kiến thức↑ Giữ trí nhớ", e: { sm: 3, h: 1, so: 1 } },
  parttime: { n: "Làm thêm", d: "Chút tiền · Kiến thức↓", e: { sm: -1, h: -1, so: 1 } },
  career: { n: "Chuẩn bị xin việc", d: "Việc làm đầu tiên↑ Hạnh phúc↓", e: { sm: 2, h: -2 } },
};
function focusOptions() {
  switch (stage()) {
    case 'baby': return [];
    case 'service': return ['balance', 'sport', 'family'];
    case 'school': return S.school === 'uni' || S.school === 'grad' || S.school === 'phd' ? ['study', 'play', 'parttime', 'career', 'sport', 'hobby']
      : S.flags.retakeAt != null ? ['study', 'play', 'parttime', 'sport', 'hobby'] : ['study', 'play', 'help', 'sport', 'hobby'];
    case 'kidwork': return ['help', 'play', 'sport', 'hobby'];
    case 'elder': { const o = S.job && JOBS[S.job].s !== 'none' && S.job !== 'homemaker' ? ['work', 'family', 'health', 'mind', 'hobby', 'faith'] : ['family', 'health', 'mind', 'hobby', 'faith', 'rest']; return typeof faithHidden === 'function' && faithHidden() ? o.filter(x => x !== 'faith') : o; }
    default: return isWorking() ? ['work', 'balance', 'family', 'health', 'learn', 'hobby'] : ['family', 'health', 'learn', 'hobby', 'rest'];
  }
}
const NONWORK = ['student', 'childwork', 'seeking', 'retired', 'homemaker', 'service', 'prison', 'dayc'];
function isWorking() { return !!JOBS[S.job] && !NONWORK.includes(S.job); }
const NO_MAND = ['USA', 'GBR', 'CAN', 'AUS', 'NZL'];
const mandAge = c => S && S.job === 'soldier' ? milRetAge() : c.yr ? eraMandAge(c, mandAge0(c)) : mandAge0(c);
const milRetAge = () => S.flags.offc != null ? [52, 56, 60][rankOf('soldier')] || 56 : 55;
function mandAge0(c) {
  if (NO_MAND.includes(c.id)) return null;
  if (c.id === 'KOR' || c.id === 'JPN') return 60;
  if (c.id === 'CHN') return (S.sex === 'F' ? 55 : 60) + clamp(Math.floor((calYr() - 2025) / 5), 0, 3);
  return retireAge(c);
}
const employee = () => isWorking() && (S.formal || ['police', 'soldier', 'civil'].includes(S.job)) && !SELF_JOBS.includes(S.job) && !['owner', 'agbiz', 'creator'].includes(S.job) && !JOBS[S.job].special && !(S.job === 'lawyer' && rankOf('lawyer') >= 1);
const CS_SEL = { SWE: 0.08, NOR: 0.15, DNK: 0.13, THA: 0.25, COL: 0.17, MAR: 0.05, GEO: 0.3, MNG: 0.3 };
function csPicked() { if (S.flags.csSel == null) S.flags.csSel = chance((CS_SEL[S.cur] || 0.3) * (S.sex === 'F' ? 0.5 : 1)) ? 1 : 0; return S.flags.csSel === 1; }
const svcDelayOK = () => S.age < 23 || (!!S.school && S.age < 28);
const KR_SVC = [[1969, 1973, 0.13, 0.28], [1974, 1975, 0.2, 0.28], [1976, 1991, 0.27, 0.24], [1992, 1994, 0.12, 0.08], [1995, 2013, 0.07, 0], [2014, 2014, 0.06, 0], [2015, 9999, 0.11, 0]];
function krSvcKind() {
  const f = S.flags; if (f.svcK) return f.svcK;
  const y = calYr(), r = KR_SVC.find(x => y >= x[0] && y <= x[1]); let k = 'act';
  if (r) { const u = rnd(), sup = clamp(r[2] * (S.edu <= 2 ? 1.4 : S.edu >= 4 || S.school === 'uni' ? 0.85 : 1) * (S.st.hl < 45 ? 1.3 : 1), 0, 0.8);
    k = u < r[3] ? 'ex' : u < r[3] + sup ? 'sup' : 'act'; }
  return (f.svcK = k);
}
const krSupN = () => { const y = calYr(); return y <= 1994 ? 'bw' : y <= 2013 ? 'pub' : 'soc'; };
const krMonths = (b, army) => {
  const y = calYr();
  if (b === 'bw' || b === 'pub' || b === 'soc') return y <= 1981 ? 12 : y <= 1985 ? 14 : y <= 1994 ? 18 : y <= 2002 ? 28 : y <= 2010 ? 26 : y <= 2019 ? 24 : 21;
  if (b === 'n') return y < 1968 ? 36 : y < 1979 ? 39 : y < 1990 ? 35 : y < 1993 ? 32 : y < 1994 ? 30 : y < 2003 ? 28 : y < 2011 ? 26 : y < 2020 ? 23 : 20;
  if (b === 'f') return y < 1968 ? 36 : y < 1979 ? 39 : y < 1993 ? 35 : y < 2003 ? 30 : y < 2004 ? 28 : y < 2011 ? 27 : y < 2020 ? 24 : 21;
  return army;
};
const krBrP = b => { const y = calYr(), k = clamp(0.75 + S.st.sm / 200, 0.75, 1.25) * (S.st.hl < 45 ? 0.7 : 1);
  return clamp((b === 'n' ? (y < 2005 ? 0.6 : y < 2020 ? 0.45 : 0.85) : b === 'f' ? (y < 2005 ? 0.5 : y < 2020 ? 0.35 : 0.5) : (y < 2000 ? 0.55 : y < 2012 ? 0.4 : y < 2013 ? 0.35 : y < 2014 ? 0.25 : 0.15)) * k, 0.05, 0.95); };
const krBrOK = b => S.cur === 'KOR' && S.sex === 'M' && !C().war && (b === 'p' ? calYr() >= 1983 && calYr() <= 2021 : calYr() >= 1954);
const svcSup = () => ['bw', 'pub', 'soc'].includes(S.flags.svcB);
const svcOutLine = () => { const b = S.flags.svcB;
  return b === 'n' ? "Bạn đã hoàn thành thời gian phục vụ trong hải quân và xuất ngũ." : b === 'f' ? "Bạn đã hoàn thành thời gian phục vụ trong không quân và xuất ngũ." : b === 'p' ? "Bạn đã hoàn thành thời gian phục vụ trong lực lượng cảnh sát nghĩa vụ và xuất ngũ." : b === 'bw' ? "Bạn đã hoàn thành thời gian làm lính phòng vệ địa phương và chính thức kết thúc nghĩa vụ."
    : b === 'pub' ? "Bạn đã hoàn thành thời gian làm nhân viên phục vụ công ích và chính thức kết thúc nghĩa vụ." : b === 'soc' ? "Bạn đã hoàn thành thời gian làm nhân viên phục vụ xã hội và chính thức kết thúc nghĩa vụ." : "Bạn đã hoàn thành nghĩa vụ quân sự và xuất ngũ."; };
const svcLbl = () => S.flags.svcB === 'pub' ? "phục vụ công ích" : S.flags.svcB === 'soc' ? "phục vụ xã hội" : S.flags.svcB === 'p' ? "làm cảnh sát nghĩa vụ" : "đi nghĩa vụ quân sự";
const ncoP = () => clamp((calYr() < 2015 ? 0.6 : 0.85) * (S.st.hl < 40 ? 0.6 : 1), 0.1, 0.9);
const ncoAskOK = a => S.cur === 'KOR' && S.serveLeft === 1 && S.job === 'service' && ['a', 'n', 'f'].includes(S.flags.svcB) && !S.done.nco && calYr() >= 1981 && a <= (calYr() >= 2020 ? 29 : 27);
const svcMidUni = () => S.cur === 'KOR' && S.sex === 'M' && S.school === 'uni' && !S.flags.acad && !S.flags.studyAbroad && S.flags.svcDelay == null
  && S.schoolY === (S.flags.svcUY || (S.flags.svcUY = chance(0.4) ? 1 : 2));
function mandDue() { const m = mandAge(C()); return m != null && S.flags.mandAt == null && employee() && S.age >= m; }
const lateCareer = () => S.age >= 58;
const oldWorkK = a => a < 70 ? 1 : Math.max(0.35, 1 - 0.05 * (a - 68));
const ownAgeK = a => S.job === 'owner' && rankOf('owner') >= 1 ? 1 - 0.5 * (1 - oldWorkK(a)) : oldWorkK(a);
const LATE_W = { guard: 4, cleaner: 3, care: 2.5, domestic: 1.5, vendor: 1.5, cook: 1.3, driver: 1.2, farmhand: 1.2, factory: 0.7, construct: 0.6, delivery: 0.5, miner: 0.2 };
const FOCUS_NEAR = { study: ['learn', 'mind', 'career'], learn: ['study', 'mind', 'career'], mind: ['learn', 'study'], career: ['learn', 'study'],
  play: ['family'], family: ['play'], sport: ['health'], health: ['sport'], hobby: ['hobby'], faith: ['family'], rest: ['health'], work: ['parttime', 'balance'], parttime: ['work', 'balance'] };
function eduNext() { const jg = S.flags.justGrad; return (jg === 'prim' && S.age >= 10) || jg === 'lsec' || ((jg === 'usec' || jg === 'voc' || jg === 'uni') && S.job !== 'idol'); }
function ensureFocus() {
  const o = focusOptions(); if (!o.length) { S.focus = null; return; }
  const F = S.flags;
  if (F.focusBack && F.focusBack !== S.focus && S.focus === F.focusAuto && o.includes(F.focusBack) && FOCUS[F.focusBack]) {
    S.focus = F.focusPicked = F.focusBack; F.focusBack = F.focusAuto = null;
    if (!S.isComp) log(L`다시 '${FOCUS[S.focus].n}'에 마음을 쏟기로 했습니다.`, 'note');
    return;
  }
  if (!o.includes(S.focus) && S.focus && S.focus === F.focusPicked && eduNext()) return;
  if (!o.includes(S.focus)) {
    const was = S.focus, near = was === F.focusPicked ? (FOCUS_NEAR[was] || []).find(k => o.includes(k)) : null;
    S.focus = near || (was === 'learn' && o.includes('mind') ? 'mind' : o.includes('balance') ? 'balance' : o[0]);
    if (was && was === F.focusPicked && S.age >= 6 && FOCUS[was] && FOCUS[S.focus] && !S.isComp) {
      F.focusPicked = near ? S.focus : null; F.focusBack = was; F.focusAuto = S.focus;
      log(S.job === 'seeking' ? L`일자리를 찾는 동안 '${FOCUS[was].n}' 대신 '${FOCUS[S.focus].n}'에 마음을 쏟기로 했습니다.` : L`삶의 단계가 바뀌어 '${FOCUS[was].n}' 대신 '${FOCUS[S.focus].n}'에 마음을 쏟기로 했습니다.`, 'note');
    }
  }
}
function mindKeep() {
  const f = S.focusW || {}, hobMind = S.hobbies.some(h => { const H = hobDef(h.id); return H.sm > 0 || H.so >= 3; });
  return clamp(0.8 * (f.mind || 0) + 0.45 * ((f.family || 0) + (f.faith || 0)) + 0.45 * (f.health || 0) + (hobMind ? 0.25 : 0) + (S.st.hl - 50) / 250, 0, 0.85);
}
function expHealth(a) { if (a < 1) return 72; if (a < 5) return 80; if (a < 30) return 90; if (a < 60) return 90 - (a - 30) * 0.6; return Math.max(15, 72 - (a - 60) * 0.95); }
const H_K = 12, SO_K = 8, H_UP = 0.35, H_DN = 0.2, SO_UP = 0.25;
function happyBase() { const c = C(); const wh = c.wh != null ? c.wh : 5; return 28 + wh * 5.5; }
const ST_DEF = { hl: 60, h: 55, sm: 40, so: 55 };
const fillNums = (a, d) => { const f = a.find(v => Number.isFinite(v)); let last = f != null ? f : d; return a.map(v => Number.isFinite(v) ? (last = v) : last); };
function healStats(s) {
  const bad = [];
  if (!s) return bad;
  const ys = Array.isArray(s.years) ? s.years : [];
  for (const k of ['h', 'hl']) if (ys.some(y => y && !Number.isFinite(y[k]))) { const v = fillNums(ys.map(y => y && y[k]), ST_DEF[k]); ys.forEach((y, i) => { if (y) y[k] = v[i]; }); }
  if (s.st) for (const k in ST_DEF) if (!Number.isFinite(s.st[k])) {
    const y = k === 'h' || k === 'hl' ? ys.slice().reverse().find(y => y && Number.isFinite(y[k])) : null;
    s.st[k] = y ? y[k] : ST_DEF[k]; bad.push(k);
  }
  if (s.endD && Array.isArray(s.endD.strip) && s.endD.strip.some(v => !Number.isFinite(v))) s.endD.strip = fillNums(s.endD.strip, 50);
  return bad;
}
const UPSEC = { KOR: 0.995, JPN: 0.985, TWN: 0.99 };
const LSEC_FREE = { CHN: 2008 };
const OPEN_UNI = { ARG: { k: 0.45, fact: () => "Các trường đại học công lập ở Argentina nhận tất cả mọi người mà không cần thi đầu vào, nhưng cứ 100 sinh viên nhập học năm 2017 thì chỉ 28 người tốt nghiệp tính đến năm 2021 (Trung tâm Nghiên cứu Giáo dục Argentina CEA, 2023)" },
  FRA: { k: 1, fact: () => "Ở Pháp, có bằng tú tài là vào được chương trình cử nhân của đại học công lập, nhưng chỉ khoảng một phần ba sinh viên học xong trong ba năm (Bộ Giáo dục Đại học Pháp)" },
  DEU: { k: 1, abi: 1, sub: () => "Không thi đầu vào · ngành đông người chọn xét theo điểm Abitur", fact: () => "Ở Đức, có bằng Abitur là vào đại học không cần thi (ngành đông người chọn xét theo điểm Abitur), nhưng khoảng 28% sinh viên bắt đầu học cử nhân bỏ dở khi chưa có bằng (Trung tâm Nghiên cứu Giáo dục Đại học và Khoa học Đức DZHW 2022)" },
  AUT: { k: 1, abi: 1, sub: () => "Không thi đầu vào · bằng Matura vào được hầu hết các ngành", fact: () => "Ở Áo, có bằng Matura là vào được hầu hết các ngành đại học không cần thi; chỉ một số ngành như y khoa, tâm lý học có kỳ thi tuyển (Luật Đại học Áo)" },
  CHE: { k: 1, abi: 1, sub: () => "Không thi đầu vào · bằng Matura vào được hầu hết các ngành", fact: () => "Ở Thụy Sĩ, có bằng Matura của trường gymnasium là vào đại học không cần thi; chỉ vài ngành như y khoa có bài kiểm tra năng khiếu (swissuniversities)" } };
const uniOpen = c => !!OPEN_UNI[c.id] && S.cur === S.born && !(OPEN_UNI[c.id].abi && S.flags.vocF != null);
function eduModel(c, e) {
  return [1 / (1 + Math.exp(-((c.p === 'ssa' ? e * 0.78 : e) - 7.0) / 1.3)), 1 / (1 + Math.exp(-(e - 10.0) / 1.4)), 1 / (1 + Math.exp(-(e - 12.0) / 1.5))];
}
const CR_UIS = { AFG:[44,31,27], DZA:[94,73,46], AGO:[55,38,21], AUS:[100,99,90], AUT:[99,98,85], AZE:[99,96,82], BGD:[88,71,31], BLR:[100,100,90], BEL:[98,95,88], BEN:[50,29,12], BOL:[99,96,81], BWA:[97,92,54], BRA:[98,92,76], BGR:[99,98,87], BFA:[60,34,16], BDI:[50,25,7], KHM:[82,56,27], CMR:[74,47,23], CAN:[0,0,94], CAF:[27,12,6], TCD:[27,13,5], CHL:[99,99,93], CHN:[99,96,88], COL:[97,85,80], COG:[80,50,23], CRI:[100,90,82], CIV:[65,35,17], CUB:[100,94,65], COD:[70,60,34], DNK:[99,99,78], DOM:[90,84,64], ECU:[98,92,81], EGY:[96,88,76], SLV:[91,78,61], ETH:[54,30,18], FIN:[100,100,90], FRA:[99,98,91], GAB:[76,44,22], GMB:[62,47,31], GEO:[100,99,97], DEU:[98,92,78], GHA:[78,71,45], GRC:[99,98,93], GTM:[85,56,23], GIN:[45,26,16], GNB:[39,26,14], HTI:[53,35,16], HND:[88,58,40], HUN:[99,98,84], IND:[94,86,51], IDN:[99,89,43], IRQ:[76,46,32], ISR:[100,99,0], ITA:[100,99,85], JAM:[99,95,87], JOR:[97,88,65], KAZ:[99,99,95], KEN:[91,87,65], KGZ:[99,99,86], LAO:[88,56,37], LBN:[97,84,61], LSO:[88,56,40], LBR:[31,27,19], MDG:[50,23,14], MWI:[49,23,15], MLI:[48,27,13], MRT:[58,37,15], MEX:[98,91,66], MNG:[97,99,94], MAR:[0,0,47], MOZ:[54,28,18], MMR:[83,45,17], NAM:[87,76,30], NPL:[86,78,36], NIC:[75,51,41], NER:[36,12,3], NGA:[77,74,69], NOR:[100,100,81], PAK:[60,54,27], PSE:[99,92,62], PAN:[97,90,75], PNG:[68,48,20], PRY:[97,88,71], PER:[99,96,93], PHL:[96,84,67], POL:[98,94,94], PRT:[99,99,90], QAT:[100,96,83], ROU:[98,96,84], RUS:[100,100,90], RWA:[63,32,19], SEN:[53,31,16], SRB:[100,98,83], SLE:[69,47,20], SOM:[50,48,0], ZAF:[98,92,62], KOR:[100,100,98], ESP:[99,97,76], LKA:[100,99,46], SDN:[65,51,31], SWE:[99,99,81], CHE:[99,99,93], TJK:[99,97,83], TZA:[74,28,9], THA:[99,90,71], TGO:[79,48,29], TUN:[93,76,36], TUR:[98,95,73], TKM:[99,99,0], UGA:[39,21,10], UKR:[100,99,99], GBR:[100,100,84], USA:[100,99,92], URY:[99,89,56], UZB:[100,99,95], VEN:[94,80,70], VNM:[98,87,58], YEM:[68,53,37], ZMB:[74,53,29], ZWE:[89,72,14] };
const CR_D = {};
function crShift(id) {
  if (id in CR_D) return CR_D[id];
  const r = CR_UIS[id], c0 = CBY[id]; if (!r || !c0) return CR_D[id] = null;
  const m = eduModel(c0, c0.eys), lg = x => Math.log(x / (1 - x));
  return CR_D[id] = r.map((v, i) => v ? lg(clamp(v / 100, 0.02, 0.995)) - lg(clamp(m[i], 0.002, 0.999)) : 0);
}
function eduProbs(c, sex, q, urban, dis, own) {
  const e = c.k1 != null ? c.eysB : c.eys;
  let [p1, p2, p3] = eduModel(c, e);
  const dc = crShift(c.id);
  if (dc) { const sh = (p, d) => d ? 1 / (1 + Math.exp(-(Math.log(p / (1 - p)) + d))) : p; p1 = sh(p1, dc[0]); p2 = Math.min(sh(p2, dc[1]), p1 * 0.998); p3 = Math.min(sh(p3, dc[2]), p2 * 0.998); }
  let p4 = Math.min(0.78, c.ter / 100 * 0.75);
  if (c.k1 != null) { p1 = Math.min(0.995, p1 * c.k1); p2 = Math.min(p1 * 0.995, p2 * Math.pow(c.k2, 0.7)); p3 = Math.min(p2 * 0.995, p3 * Math.pow(c.k2, 1.2)); p4 = Math.min(p4, p3 * 0.95); }
  const gw = c.ppp < 15000 ? 0.6 : 0.45;
  const or = Math.exp(gw * (q - 3)) * (lowInc(c) ? (urban ? 1.4 : 0.75) : 1);
  let fem = 1;
  if (sex === 'F' && ['PAK', 'NER', 'TCD', 'MLI', 'CAF', 'SSD', 'YEM', 'GIN', 'BEN', 'SOM', 'BFA', 'CIV', 'CMR', 'ETH'].includes(c.id)) fem = 1 - 0.35 * (q >= 5 ? (urban ? 0.25 : 0.7) : q === 4 && urban ? 0.6 : 1);
  const t1 = odds(p1, or * fem), t2 = odds(p2 / p1, or * fem), t3 = odds(p3 / p2, or * fem);
  let t4 = odds(Math.min(0.95, p4 / Math.max(p3, 0.05)), or * (sex === 'F' && c.p !== 'sa' && c.p !== 'ssa' && c.p !== 'mena' ? 1.2 : sex === 'M' ? 0.9 : fem));
  const res = { t1, t2, t3, t4, p1, p2, p3, p4, uis: dc && !c.yr ? CR_UIS[c.id] : null };
  const up = UPSEC[c.id]; if (up && !(c.yr && c.yr < 2000)) { res.p3 = Math.max(p3, up); res.t3 = Math.max(t3, up - (5 - q) * 0.003); }
  if (dis && dis.told) { const k = disEduK(c, dis); for (const t of ['t1', 't2', 't3', 't4']) res[t] = odds(res[t], k); }
  if (own && S.nd) { const k = ndHsK(); if (k !== 1) res.t3 = odds(res.t3, k); }
  if (own && S.dd && ddIDk(S.dd)) res.t4 = odds(res.t4, 0.2);
  if (own) { const ks = ethEduK('s'), ku = ethEduK('u'); if (ks !== 1) for (const t of ['t1', 't2', 't3']) res[t] = odds(res[t], ks); if (ku !== 1) res.t4 = odds(res.t4, ku); }
  if (own && S && S.flags && S.flags.rich) { const k = S.flags.rich === 2 ? 10 : 5; for (const t of ['t1', 't2', 't3', 't4']) res[t] = odds(res[t], k); }
  return eraEdu(c, sex, res);
}
const ETH_G = {
  us_black: { s: 13.5, k: 'race', q: -0.35, es: 0.92, eu: 0.65, hire: -0.03, m: 1.35, d: 0.09, pol: 1, n: "người Mỹ gốc Phi" },
  us_hisp: { cl: ['la'], sh: 25, k: 'race', q: -0.2, es: 0.88, eu: 0.55, hire: -0.02, m: 0.7, d: 0.06, t: 'es', n: "người gốc Hispanic hoặc Latino" },
  us_asian: { cl: ['zh', 'zhd'], sh: 2, k: 'race', q: 0.3, es: 1.05, eu: 3, hire: -0.01, m: 0.45, d: 0.05, t: 'zh', n: "người Mỹ gốc Á" },
  us_native: { s: 0.8, k: 'ind', q: -0.45, es: 0.8, eu: 0.5, hire: -0.03, m: 2.0, d: 0.08, pol: 1, n: "người Mỹ bản địa" },
  ca_ind: { s: 7, k: 'ind', q: -0.4, es: 0.75, eu: 0.55, hire: -0.02, m: 1.5, d: 0.08, n: "người bản địa Canada (First Nations, Métis hoặc Inuit)" },
  au_ind: { s: 6, k: 'ind', q: -0.5, es: 0.7, eu: 0.4, hire: -0.03, m: 1.9, d: 0.1, pol: 1, n: "người bản địa Úc (Aboriginal hoặc dân đảo eo biển Torres)" },
  nz_maori: { s: 27, k: 'ind', q: -0.3, es: 0.85, eu: 0.45, hire: -0.02, m: 1.55, d: 0.07, t: 'mi', fest: "lễ Matariki", n: "người Māori" },
  nz_pasi: { s: 10, k: 'race', q: -0.35, es: 0.85, eu: 0.5, hire: -0.02, m: 1.4, d: 0.06, n: "người gốc các đảo Thái Bình Dương (Pasifika)" },
  gb_pak: { cl: ['ur'], sh: 6, k: 'race', q: -0.35, es: 1, eu: 0.95, hire: -0.03, m: 1.05, d: 0.07, t: 'ur', n: "người Anh gốc Pakistan hoặc Bangladesh" },
  gb_ind: { cl: ['hi'], sh: 6.5, k: 'race', q: 0.15, es: 1.05, eu: 1.3, hire: -0.02, m: 0.85, d: 0.05, t: 'hi', n: "người Anh gốc Ấn" },
  gb_black: { s: 5, k: 'race', q: -0.25, es: 1, eu: 1.05, hire: -0.03, m: 0.95, d: 0.08, pol: 1, n: "người Anh gốc Phi hoặc Caribe" },
  fr_magh: { cl: ['ar'], sh: 9, k: 'race', q: -0.35, es: 0.9, eu: 0.8, hire: -0.04, m: 1, d: 0.08, pol: 1, t: 'ar', n: "người Pháp gốc Bắc Phi" },
  de_turk: { cl: ['tr'], sh: 6, k: 'eth', q: -0.3, es: 0.85, eu: 0.6, hire: -0.03, m: 1, d: 0.07, t: 'tr', n: "người Đức gốc Thổ Nhĩ Kỳ" },
  roma: { k: 'eth', q: -0.9, es: 0.45, eu: 0.12, hire: -0.05, m: 2.1, d: 0.14, pol: 1, t: 'rom', n: "người Roma" },
  kr_mix: { s: 5.6, k: 'mix', q: -0.35, es: 0.9, eu: 0.3, hire: -0.01, m: 1, d: 0.07, n: "gia đình đa văn hóa" },
  jp_mix: { s: 2.1, k: 'mix', q: -0.05, es: 1, eu: 0.95, hire: 0, m: 1, d: 0.05, n: "bố hoặc mẹ sinh ra ở nước ngoài" },
  jp_zai: { s: 0.15, k: 'eth', q: -0.15, es: 1, eu: 0.95, hire: -0.02, m: 1, d: 0.07, t: 'ko', n: "người Hàn Quốc tại Nhật (Zainichi)" },
  cn_min: { s: 8, relIn: ['N', 'F', 'B', 'C'], k: 'eth', q: -0.3, es: 0.85, eu: 0.9, hire: -0.01, m: 1.12, d: 0.03, k1: 1, n: "dân tộc thiểu số",
    sub: [["người Choang", 19.6, 1], ["người Miêu", 11.1, 1], ["người Mãn", 10.4, 0], ["người Di", 9.8, 1], ["người Thổ Gia", 9.6, 0], ["người Mông Cổ", 6.3, 1], ["người Bố Y", 3.6, 1], ["người Đồng", 3.5, 1], ["người Dao", 3.3, 1], ["người Bạch", 2.1, 1], ["người gốc Triều Tiên ở Trung Quốc (Joseonjok)", 1.7, 1], ["người Hà Nhì", 1.7, 1], ["người Lê", 1.6, 1], ["người Thái (Dai)", 1.3, 1]] },
  cn_uyg: { rel: ['M'], relP: 0.5, sh: 0.9, k: 'eth', q: -0.45, es: 0.9, eu: 0.45, hire: -0.02, m: 1.15, d: 0.05, k1: 1, t: 'ug', fest: "lễ Qurban Heyt", ncl: 'ug', urb: 40, n: "người Duy Ngô Nhĩ",
    city: ["Urumqi", "Kashgar", "Hotan", "Aksu"], rur: [["địa khu Kashgar", 31], ["địa khu Hotan", 17], ["địa khu Aksu", 16], ["Ili", 8], ["Turpan", 6], ["khu tự trị Duy Ngô Nhĩ Tân Cương", 22]] },
  cn_tib: { relIn: ['B'], relS: { B: 4.2 }, nojob: ['fisher'], s: 0.75, k: 'eth', q: -0.35, es: 0.7, eu: 0.65, hire: -0.02, m: 1.35, d: 0.04, k1: 1, t: 'bo', fest: "Tết Losar", ncl: 'bo', urb: 30, n: "người Tây Tạng",
    city: ["Lhasa", "Shigatse", "Xining"], rur: [["khu tự trị Tây Tạng", 44], ["miền tây tỉnh Tứ Xuyên", 23], ["tỉnh Thanh Hải", 21], ["miền nam tỉnh Cam Túc", 7], ["vùng tây bắc tỉnh Vân Nam", 2]] },
  cn_hui: { rel: ['M'], sh: 0.8, k: 'eth', q: -0.2, es: 0.9, eu: 0.85, hire: -0.01, m: 1.05, d: 0.04, k1: 1, n: "người Hồi" },
  vn_min: { s: 17, k: 'eth', q: -0.6, es: 0.6, eu: 0.45, hire: -0.02, m: 1.2, d: 0.04, n: "dân tộc thiểu số",
    sub: [["người Tày", 1.9, 1], ["người Thái", 1.9, 1], ["người Mường", 1.5, 1], ["người H'Mông", 1.5, 1], ["người Khmer", 1.4, 1], ["người Nùng", 1.1, 1], ["người Dao", 0.9, 1], ["người Gia Rai", 0.5, 1], ["người Ê Đê", 0.4, 1], ["người Ba Na", 0.3, 1]] },
  th_hill: { s: 2, relIn: ['B', 'C', 'N'], k: 'ind', q: -0.7, es: 0.6, eu: 0.35, hire: -0.03, m: 1.2, d: 0.06, nid: 0.25, n: "các dân tộc miền núi",
    sub: [["người Karen", 1, 1], ["người H'Mông", 0.3, 1], ["người Lahu", 0.25, 1], ["người Akha", 0.2, 1], ["người Mien", 0.1, 1], ["người Lisu", 0.1, 1]] },
  th_malay: { rel: ['M'], sh: 5, k: 'eth', q: -0.25, es: 0.85, eu: 0.7, hire: -0.01, m: 1.05, d: 0.04, t: 'ms', n: "người Thái gốc Mã Lai" },
  in_adiv: { s: 9, relIn: ['H', 'C', 'O', 'F'], relS: { H: 9.4, C: 32.8, O: 90, F: 90 }, k: 'ind', q: -0.6, es: 0.65, eu: 0.6, hire: -0.02, m: 1.18, d: 0.06, n: "người Adivasi (bộ tộc được liệt kê)",
    sub: [["người Bhil", 1.7, 1], ["người Gond", 1.3, 1], ["người Santal", 0.6, 1], ["người Oraon", 0.4, 1], ["người Munda", 0.2, 1], ["người Bodo", 0.1, 1]] },
  mx_ind: { s: 10, k: 'ind', q: -0.6, es: 0.65, eu: 0.4, hire: -0.03, m: 1.12, d: 0.08, n: "người bản địa",
    sub: [["người Nahua", 25, 1], ["người Maya", 13, 1], ["người Tseltal", 7, 1], ["người Mixtec", 7, 1], ["người Zapotec", 7, 1], ["người Tsotsil", 6, 1], ["người Otomí", 4, 1]] },
  gt_maya: { s: 45, k: 'ind', q: -0.6, es: 0.55, eu: 0.35, hire: -0.03, m: 1.12, d: 0.08, n: "người Maya bản địa",
    sub: [["người K'iche'", 11, 1], ["người Q'eqchi'", 8, 1], ["người Kaqchikel", 7.8, 1], ["người Mam", 5.2, 1]] },
  bo_ind: { s: 40, k: 'ind', q: -0.35, es: 0.8, eu: 0.7, hire: -0.02, m: 1.1, d: 0.05, n: "người bản địa", sub: [["người Quechua", 18, 1], ["người Aymara", 16, 1], ["người Guaraní", 1, 1]] },
  pe_ind: { s: 25, k: 'ind', q: -0.5, es: 0.7, eu: 0.55, hire: -0.02, m: 1.12, d: 0.07, n: "người bản địa", sub: [["người Quechua", 22, 1], ["người Aymara", 2.4, 1], ["người bản địa Amazon", 0.3, 1]] },
  ec_ind: { s: 8, k: 'ind', q: -0.6, es: 0.65, eu: 0.45, hire: -0.03, m: 1.15, d: 0.07, n: "người bản địa", sub: [["người Kichwa", 7, 1], ["người bản địa Amazon", 1, 1]] },
  ec_afro: { s: 5, k: 'race', q: -0.4, es: 0.8, eu: 0.6, hire: -0.03, m: 1.05, d: 0.08, pol: 1, n: "người Ecuador gốc Phi" },
  co_afro: { s: 9, k: 'race', q: -0.45, es: 0.8, eu: 0.55, hire: -0.03, m: 1.12, d: 0.08, pol: 1, n: "người Colombia gốc Phi" },
  co_ind: { s: 4.5, k: 'ind', q: -0.7, es: 0.55, eu: 0.35, hire: -0.03, m: 1.25, d: 0.06, n: "người bản địa", sub: [["người Wayuu", 0.8, 1], ["người Zenú", 0.6, 1], ["người Nasa", 0.5, 1], ["người Emberá", 0.5, 1]] },
  br_negro: { s: 55, k: 'race', q: -0.3, es: 0.85, eu: 0.6, hire: -0.03, m: 1.08, d: 0.07, pol: 1, n: "người da đen hoặc người lai (preto, pardo)" },
  cl_mapu: { s: 12, k: 'ind', q: -0.4, es: 0.85, eu: 0.6, hire: -0.02, m: 1.08, d: 0.06, t: 'arn', fest: "lễ We Tripantu", n: "người Mapuche" },
  tr_kurd: { s: 20, k: 'eth', q: -0.45, es: 0.75, eu: 0.6, hire: -0.02, m: 1.05, d: 0.05, t: 'ku', fest: "lễ Newroz", n: "người Kurd" },
  ru_turk: { cl: ['ca'], sh: 12, k: 'eth', q: -0.15, es: 0.95, eu: 0.85, hire: -0.02, m: 1.05, d: 0.05, n: "các dân tộc gốc Turk (Tatar, Bashkir và các dân tộc khác)" },
  il_arab: { cl: ['ar', 'arc'], sh: 21, k: 'eth', q: -0.6, es: 0.8, eu: 0.55, hire: -0.03, m: 1.25, d: 0.07, t: 'ar', n: "công dân Israel gốc Ả Rập" },
  lk_tamil: { cl: ['ta'], sh: 13, k: 'eth', q: -0.2, es: 0.95, eu: 0.85, hire: -0.01, m: 1.05, d: 0.05, t: 'ta', n: "người Tamil" },
  my_chin: { cl: ['zh'], sh: 23, k: 'eth', q: 0.3, es: 1.05, eu: 0.85, hire: 0, m: 0.9, d: 0.04, t: 'zh', n: "người Malaysia gốc Hoa" },
  my_ind: { cl: ['hi', 'ta'], sh: 7, k: 'eth', q: -0.15, es: 0.95, eu: 0.85, hire: -0.01, m: 1.1, d: 0.05, t: 'ta', n: "người Malaysia gốc Ấn" },
  mm_roh: { rel: ['M'], relP: c => (c.yr || NOW_Y) < 2017 ? 0.65 : 0.38, sh: 1.1, k: 'eth', q: -1.2, es: 1, eu: 1, hire: 0, m: 1, d: 0.05, roh: 1, t: 'roh', fest: "lễ Eid", ncl: 'mmm', urb: 12,
    n: "người Rohingya", city: ["Sittwe", "Maungdaw", "Buthidaung"], rur: [["Maungdaw, bang Rakhine", 40], ["Buthidaung, bang Rakhine", 32], ["Rathedaung, bang Rakhine", 10], ["Sittwe, bang Rakhine", 18]] },
  bd_roh: { rel: ['M'], relP: c => (c.yr || NOW_Y) >= 2018 ? 0.0094 : 0, sh: 0.86, k: 'eth', q: -2.5, es: 1, eu: 1, hire: 0, m: 1, d: 0, roh: 2, t: 'roh', fest: "lễ Eid", ncl: 'mmm', urb: 0,
    n: "người Rohingya" },
  za_ind: { cl: ['hi', 'ur'], sh: 2, k: 'race', q: 0.6, es: 1.25, eu: 2, hire: 0.015, m: 0.75, d: 0.03, n: "người Nam Phi gốc Ấn" },
  za_white: { s: 4.5, k: 'race', q: 1.1, es: 1.3, eu: 3, hire: 0.03, m: 0.55, d: 0, quiet: 1, n: "người da trắng" },
  za_col: { s: 8.5, k: 'race', q: 0.1, es: 0.9, eu: 0.6, hire: -0.01, m: 1.05, d: 0.04, maj: 1, t: 'af', n: "người Coloured (gốc lai)" },
  za_black: { s: 85, rest: 1, k: 'race', q: -0.06, es: 0.99, eu: 0.91, hire: -0.001, m: 1.0, d: 0.012, maj: 1, n: "người da đen (người châu Phi)",
    sub: [["người Zulu", 24.4, 1], ["người Xhosa", 16.3, 1], ["người Pedi", 10.1, 1], ["người Tswana", 8.3, 1], ["người Sotho", 7.8, 1], ["người Tsonga", 4.7, 1], ["người Swazi", 2.8, 1], ["người Venda", 2.5, 1], ["người Ndebele", 1.7, 1]] },
};
const ROMA_S = { ROU: 9, BGR: 10, HUN: 8, SVK: 11, CZE: 3, SRB: 8, ESP: 2, GRC: 3, MKD: 10, ALB: 4, MDA: 3, MNE: 3, BIH: 2, XKX: 2, HRV: 1, SVN: 0.5 };
const ETH_C = { USA: ['us_hisp', 'us_asian', 'us_black', 'us_native'], CAN: ['ca_ind'], AUS: ['au_ind'], NZL: ['nz_maori', 'nz_pasi'],
  GBR: ['gb_pak', 'gb_ind', 'gb_black'], FRA: ['fr_magh'], DEU: ['de_turk'], KOR: ['kr_mix'], JPN: ['jp_mix', 'jp_zai'], CHN: ['cn_uyg', 'cn_hui', 'cn_tib', 'cn_min'],
  VNM: ['vn_min'], THA: ['th_malay', 'th_hill'], IND: ['in_adiv'], MEX: ['mx_ind'], GTM: ['gt_maya'], BOL: ['bo_ind'], PER: ['pe_ind'],
  ECU: ['ec_ind', 'ec_afro'], COL: ['co_afro', 'co_ind'], BRA: ['br_negro'], CHL: ['cl_mapu'], TUR: ['tr_kurd'], RUS: ['ru_turk'], ISR: ['il_arab'],
  LKA: ['lk_tamil'], MYS: ['my_chin', 'my_ind'], ZAF: ['za_ind', 'za_white', 'za_col', 'za_black'], MMR: ['mm_roh'], BGD: ['bd_roh'] };
const ethShare = (g, iso) => g === 'roma' ? ROMA_S[iso] || 0 : ETH_G[g].sh != null ? ETH_G[g].sh : ETH_G[g].s || 0;
const ETH_T = { es: "tiếng Tây Ban Nha", zh: "tiếng Trung", mi: "tiếng Maori", ur: "tiếng Urdu", hi: "tiếng Hindi", ar: "tiếng Ả Rập", tr: "tiếng Thổ Nhĩ Kỳ", rom: "tiếng Romani", ko: "tiếng Hàn",
  ms: "tiếng Mã Lai", ta: "tiếng Tamil", ku: "tiếng Kurd", arn: "tiếng Mapudungun", af: "tiếng Afrikaans", ug: "tiếng Duy Ngô Nhĩ", bo: "tiếng Tây Tạng", roh: "tiếng Rohingya" };
const MIX_T = { VNM: "tiếng Việt", CHN: "tiếng Trung", THA: "tiếng Thái", PHL: "tiếng Tagalog", JPN: "tiếng Nhật", KHM: "tiếng Khmer", MNG: "tiếng Mông Cổ", UZB: "tiếng Uzbek", RUS: "tiếng Nga",
  USA: "tiếng Anh", CAN: "tiếng Anh", GBR: "tiếng Anh", AUS: "tiếng Anh", KOR: "tiếng Hàn", BRA: "tiếng Bồ Đào Nha", PER: "tiếng Tây Ban Nha", PAK: "tiếng Urdu", IND: "tiếng Hindi", NPL: "tiếng Nepal" };
const MIX_P = { KOR: { fm: 0.75, m: { VNM: 38, CHN: 20, THA: 9, PHL: 9, JPN: 6, KHM: 5, MNG: 2, UZB: 2, RUS: 2 }, f: { USA: 30, CHN: 25, VNM: 10, JPN: 10, CAN: 6, GBR: 5, AUS: 4, PAK: 3, UZB: 2 } },
  JPN: { fm: 0.6, m: { CHN: 34, PHL: 28, KOR: 12, THA: 8, BRA: 5, VNM: 5, PER: 2 }, f: { KOR: 25, USA: 22, CHN: 15, BRA: 8, GBR: 6, PHL: 5, IND: 3 } } };
const ETH_NORM = {};
function ethNorm(iso) {
  if (ETH_NORM[iso]) return ETH_NORM[iso];
  const L0 = ETH_C[iso] || [], p = [0, 0, 0, 0, 0]; let sh = 0, m = 0, es = 0, eu = 0, hire = 0;
  for (const id of L0) {
    const g = ETH_G[id], s = ethShare(id, iso) / 100; if (!s) continue;
    const w = [1, 2, 3, 4, 5].map(k => Math.exp(g.q * (k - 3))), t = w.reduce((a, b) => a + b, 0);
    w.forEach((x, i) => { p[i] += s * x / t; });
    sh += s; m += s * g.m; es += s * g.es; eu += s * g.eu; hire += s * g.hire;
  }
  const r = 1 - sh, q0 = p.map(x => Math.max(0.03, (0.2 - x) / Math.max(0.05, r))), qt = q0.reduce((a, b) => a + b, 0);
  return (ETH_NORM[iso] = { sh, m: r > 0.05 ? (1 - m) / r : 1, es: r > 0.05 ? clamp((1 - es) / r, 0.8, 1.3) : 1, eu: r > 0.05 ? clamp((1 - eu) / r, 0.8, 1.4) : 1, hire: r > 0.05 ? -hire / r : 0, q: q0.map(x => x / qt) });
}
function ethDraw(c, rel, cl) {
  const L0 = ETH_C[c.id]; if (!L0) return null;
  let marked = 0;
  for (const id of L0) { const g = ETH_G[id]; if ((g.cl && g.cl.includes(cl)) || (g.rel && g.rel.includes(rel) && (g.relP == null || chance(typeof g.relP === 'function' ? g.relP(c) : g.relP)))) return ethMake(id, c); if (g.cl || g.rel) marked += ethShare(id, c.id) / 100; }
  for (const id of L0) {
    const g = ETH_G[id]; if (g.cl || g.rel) continue;
    if (g.rest) return ethMake(id, c);
    if (g.relIn && !g.relIn.includes(rel)) continue;
    if (g.relS) { if (chance((g.relS[rel] || 0) / 100)) return ethMake(id, c); marked += ethShare(id, c.id) / 100; continue; }
    const elig = g.relIn ? Math.max(0.05, g.relIn.reduce((s, r) => s + relShare(c, r), 0) - marked * 0.5) : Math.max(0.05, 1 - marked);
    if (chance(Math.min(0.95, ethShare(id, c.id) / 100 / elig))) return ethMake(id, c);
    marked += ethShare(id, c.id) / 100;
  }
  return null;
}
function ethMake(id, c) {
  const g = ETH_G[id], e = { g: id };
  if (g.sub) { const w = {}; g.sub.forEach((x, i) => { w[i] = x[1]; }); e.sub = +wpick(w); }
  const mp = MIX_P[c.id];
  if (g.k === 'mix' && mp) { const mom = chance(mp.fm), w = {}; for (const k in (mom ? mp.m : mp.f)) if (CBY[k]) w[k] = (mom ? mp.m : mp.f)[k]; e.p = mom ? 'm' : 'f'; e.nat = wpick(w); }
  return e;
}
function ethQ(iso, e) {
  if (!ETH_C[iso]) return ri(1, 5);
  const N = ethNorm(iso), g = e && ETH_G[e.g];
  if (!g) { const w = {}; N.q.forEach((x, i) => { w[i + 1] = x; }); return +wpick(w); }
  const w = {}; [1, 2, 3, 4, 5].forEach(k => { w[k] = Math.exp(g.q * (k - 3)); }); return +wpick(w);
}
const ethG = () => S && S.eth && ETH_G[S.eth.g] || null;
const ethHome = () => !!(S && ETH_C[S.born] && S.cur === S.born && !studyAway());
const ethNoJob = id => { const eg = S && S.eth && ETH_G[S.eth.g]; return !!(eg && eg.nojob && eg.nojob.includes(id) && ethHome()); };
const ethMortK = () => casteK('m') * (!ethHome() ? 1 : ethG() ? ethG().m : ethNorm(S.born).m);
const ethEduK = t => fcEduK(t) * casteK(t === 'u' ? 'eu' : 'es') * (!ethHome() ? 1 : t === 'u' ? (ethG() ? ethG().eu : ethNorm(S.born).eu) : (ethG() ? ethG().es : ethNorm(S.born).es));
const ethHire = () => casteK('hire') + (!ethHome() ? 0 : ethG() ? ethG().hire : ethNorm(S.born).hire);
function ethSub() { const g = ethG(); return g && g.sub && S.eth.sub != null && g.sub[S.eth.sub] ? g.sub[S.eth.sub][0] : null; }
function ethLabel() {
  const g = ethG(); if (!g) return '';
  if (g.k === 'mix' && S.eth.nat && CBY[S.eth.nat]) return S.eth.p === 'f' ? L`아버지가 ${CBY[S.eth.nat].ko} 출신` : L`어머니가 ${CBY[S.eth.nat].ko} 출신`;
  if (g.roh && rohStateless()) return L`${g.n} (무국적)`;
  const sb = ethSub(); return sb ? L`${g.n} · ${sb}` : g.n;
}
function ethTongue() {
  const g = ethG(); if (!g) return null;
  if (g.k === 'mix') return S.eth.nat && MIX_T[S.eth.nat] || null;
  const sb = g.sub && S.eth.sub != null && g.sub[S.eth.sub]; if (sb && sb[2]) return L`${sb[0]} 말`;
  return g.t ? ETH_T[g.t] : null;
}
const ethPar = () => S.eth && S.eth.p === 'f' ? "bố" : "mẹ";
const ETH_F = { USA: "Với cùng một bản lý lịch, ứng viên da trắng được gọi lại nhiều hơn 36% so với ứng viên da đen và nhiều hơn 24% so với ứng viên gốc Latinh (Quillian và cộng sự 2017, tổng hợp các thực nghiệm thực địa ở Mỹ)",
  GBR: "Ứng viên thuộc dân tộc thiểu số có cùng lý lịch phải nộp đơn vào nhiều hơn khoảng 60% số nơi mới nhận được một cuộc gọi lại (Đại học Oxford, GEMM 2019)",
  FRA: "Ứng viên mang tên gốc Bắc Phi được gọi lại ít hơn 31,5% so với những người khác có cùng lý lịch (Bộ Lao động Pháp, DARES 2021)",
  DEU: "Ứng viên mang tên gốc Thổ Nhĩ Kỳ được gọi phỏng vấn ít hơn khoảng 14% so với những người có cùng lý lịch (Kaas và Manger 2012)",
  KOR: "Khoảng 16% người nhập cư theo diện kết hôn và người nhập quốc tịch ở Hàn Quốc cho biết từng bị phân biệt đối xử vì sinh ra ở nước ngoài. Tỷ lệ con em gia đình đa văn hóa học lên bậc giáo dục đại học là 40,5%, thấp hơn mức 71,5% của toàn dân (Bộ Bình đẳng Giới và Gia đình Hàn Quốc, Khảo sát thực trạng gia đình đa văn hóa 2021)",
  AUS: "Tuổi thọ của người bản địa Úc ngắn hơn những người Úc khác 8,8 năm ở nam và 8,1 năm ở nữ (Cục Thống kê Úc 2020–2022)",
  NZL: "Tuổi thọ của người Maori ngắn hơn những người New Zealand khác khoảng 7 năm (Stats NZ)",
  CAN: "Tuổi thọ của người bản địa Canada ngắn hơn những người Canada khác khoảng 6 đến 9 năm (Statistics Canada)",
  MEX: "65% người bản địa ở Mexico sống trong nghèo đói. Ở những người không phải bản địa, con số này là 36% (CONEVAL 2022)",
  BRA: "Ở Brazil, thu nhập bình quân của người lao động da đen và người lao động lai bằng khoảng 60% của người lao động da trắng (IBGE 2022)",
  VNM: "Các dân tộc thiểu số, chiếm khoảng 15% dân số Việt Nam, chiếm phần lớn số người nghèo (Ngân hàng Thế giới)",
  IND: "Các bộ tộc được liệt kê (Adivasi) chiếm 8,6% dân số Ấn Độ và được dành riêng một phần chỉ tiêu ở đại học và trong khu vực công (Điều tra dân số 2011, Hiến pháp Ấn Độ)",
  THA: "Ở Thái Lan có khoảng 480.000 người không có quốc tịch, nhiều người trong số đó thuộc các dân tộc vùng núi (UNHCR)",
  ISR: "Tỷ lệ nghèo của các gia đình người Ả Rập ở Israel cao gấp khoảng ba lần các gia đình người Do Thái (Viện Bảo hiểm Quốc gia Israel)",
  ZAF: "Ở Nam Phi, tỷ lệ thất nghiệp khoảng 36% ở người da đen và khoảng 8% ở người da trắng. Thu nhập bình quân của hộ gia đình da trắng cao gấp khoảng 4,5 lần hộ gia đình da đen (Stats SA, Khảo sát lực lượng lao động 2023, Khảo sát điều kiện sống 2014/15)" };
const ROMA_F = "Người Roma sống ngắn hơn những người châu Âu khác khoảng 10 năm, và cứ mười người thì tám người sống trong nguy cơ nghèo đói. Cứ bốn người thì một người từng bị phân biệt đối xử trong một năm qua (Cơ quan Quyền cơ bản EU 2022)";
const ETH_GF = { mm_roh: "Luật Quốc tịch năm 1982 của Myanmar không công nhận người Rohingya là công dân. Người Rohingya là nhóm người không quốc tịch lớn nhất thế giới (Tổ chức Bác sĩ Không biên giới)", bd_roh: "1.204.492 người sống trong các trại tị nạn ở Cox's Bazar và Bhasan Char. 52% là trẻ em, và mỗi năm có khoảng 30.000 em bé chào đời ở đó (Ủy viên Cứu trợ và Hồi hương Người tị nạn Bangladesh, 2026)", cn_uyg: "Trong cuộc điều tra dân số năm 2020, cứ 100.000 người Duy Ngô Nhĩ thì có 8.944 người đã học cao đẳng hoặc đại học, so với 15.467 người trên toàn Trung Quốc. Số năm đi học trung bình là 9,19 và 9,91 năm (Cục Thống kê Quốc gia Trung Quốc, Sách trắng dân số Tân Cương 2021)",
  cn_tib: "Tuổi thọ ở Khu tự trị Tây Tạng là 72,2 tuổi, thấp hơn mức 77,9 tuổi của toàn Trung Quốc, và 28% người từ 15 tuổi trở lên không biết đọc (Điều tra dân số 2020)" };
const ETH_LF = {};
const lfOf = (t, f) => { ETH_LF[t] = f; return t; };
const ethFact = () => S.eth && S.eth.g === 'roma' ? ROMA_F : S.eth && ETH_GF[S.eth.g] || ETH_F[S.born] || null;
function ethDiscLine() {
  const g = ethG(), a = S.age, c = C(), out = [];
  if (a >= 6 && a <= 15 && !g.maj) {
    const sch = !!S.school;
    out.push(g.k === 'mix' ? (sch ? L`반 아이들이 ${ethPar()}의 나라를 두고 놀렸습니다. 집에 와서 ${ethPar()}께는 말하지 않았습니다.` : L`동네 아이들이 ${ethPar()}의 나라를 두고 놀렸습니다. 집에 와서 ${ethPar()}께는 말하지 않았습니다.`) : sch ? "Bạn cùng lớp trêu chọc tên và ngoại hình của bạn." : "Bọn trẻ trong xóm trêu chọc tên và ngoại hình của bạn.");
    if (S.eth.g === 'roma' && a <= 10 && sch) out.push("Bạn được xếp vào một lớp chỉ toàn trẻ em Roma. Ngay cả giờ ra chơi, bạn cũng không hòa vào với những đứa trẻ khác.");
    if (S.eth.g === 'cn_uyg' && calYr() >= 2017 && sch) out.push(lfOf("Ở trường, mọi tiết học đều dạy bằng tiếng Trung. Bạn bị nhắc nhở vì nói tiếng Duy Ngô Nhĩ trong giờ ra chơi.", "Năm 2017, địa khu Hòa Điền (Hotan) ở Tân Cương cấm dùng tiếng Duy Ngô Nhĩ trong trường học và buộc dạy bằng tiếng Trung từ mẫu giáo (Đài Á Châu Tự Do 2017)"));
    if (S.eth.g === 'cn_tib' && calYr() >= 2012 && sch) out.push(lfOf("Bạn học ở một trường nội trú xa nhà, chỉ về nhà vào kỳ nghỉ. Các tiết học đều dạy bằng tiếng Trung.", "Năm 2023, các chuyên gia nhân quyền Liên Hợp Quốc bày tỏ lo ngại rằng khoảng một triệu trẻ em Tây Tạng phải xa nhà để học ở trường nội trú. Chính phủ Trung Quốc nói rằng phụ huynh tự nguyện gửi con vì đường xa và địa hình hiểm trở"));
    if (ethTongue() && g.k !== 'mix' && sch) out.push(L`학교에서 집에서 쓰는 ${ro(ethTongue())} 말했다가 꾸중을 들었습니다.`);
  }
  if (a >= 14) {
    if ((g.k !== 'ind' || c.p === 'hi') && !g.maj && !['br_negro', 'us_black', 'co_afro', 'ec_afro'].includes(S.eth.g)) out.push("Lại có người hỏi bạn “thật ra bạn từ đâu đến”. Bạn sinh ra ở chính đất nước này.");
    if (g.k === 'race' || S.eth.g === 'roma') out.push("Vừa bước vào cửa hàng, nhân viên đã cứ đi theo sau bạn.");
    if (g.pol && a <= 50) out.push("Bạn bị cảnh sát chặn lại khám xét trên đường mà không được nghe lý do.");
    if (S.eth.g === 'cn_uyg' && calYr() >= 2014 && calYr() <= 2016 && (S.school || ['civil', 'teacher', 'police'].includes(S.job))) out.push(lfOf("Có thông báo rằng học sinh và công chức không được nhịn ăn trong tháng Ramadan.", "Trong những năm 2014–2016, nhiều chính quyền địa phương ở Tân Cương thông báo cấm đảng viên, công chức, học sinh và trẻ vị thành niên nhịn ăn trong tháng Ramadan (theo AFP)"));
    if (S.eth.g === 'cn_uyg' && a >= 18 && calYr() >= 2017) out.push(lfOf("Đã mấy năm nay bạn không liên lạc được với người thân ở nước ngoài. Gọi điện cũng không ai bắt máy.", "Trong những năm 2018–2019, Tổ chức Ân xá Quốc tế đã trò chuyện với khoảng 400 người Duy Ngô Nhĩ ở 22 quốc gia. Nhiều người cho biết họ đã mất liên lạc với gia đình ở Tân Cương (Tổ chức Ân xá Quốc tế 2020)"));
  }
  if (S.eth.g === 'mm_roh' && rohRakhine()) {
    if (a >= 10) out.push(lfOf("Muốn đi thăm họ hàng ở làng khác, bạn phải xin giấy phép. Đến trạm kiểm soát nào cũng phải xuất trình giấy tờ.", ROH_F.move));
    if (a >= 16 && calYr() >= 2012) out.push(lfOf("Khi người nhà bị ốm, bạn không thể đưa họ đến bệnh viện lớn ở Sittwe. Chỉ khi nguy cấp mới được đi, và phải có giấy phép.", ROH_F.move));
    if (a >= 16) out.push(lfOf("Ở cơ quan nhà nước, bạn được cho biết là không có giấy tờ chứng minh quốc tịch. Dù sinh ra ở đất nước này, bạn vẫn không được công nhận là công dân.", ROH_F.law));
  }
  if (a >= 20 && a <= 55) {
    if (g.hire < -0.005 && (S.job === 'seeking' || (S.jobY || 0) <= 2)) out.push("Bạn nhận ra rằng dù lý lịch như nhau, cái tên khiến bạn ít được gọi lại hơn.");
    if (!S.house && (S.urban || c.p === 'hi')) out.push("Bạn đi xem nhà thuê; vừa nghe tên bạn, chủ nhà đã nói là có người thuê mất rồi.");
    if (ethTongue() && g.k !== 'mix' && !g.maj) out.push("Bạn cố cười cho qua trước những người nhại lại giọng nói của mình.");
    if (g.maj && S.born === 'ZAF' && S.job === 'seeking') out.push("Suốt mấy tháng, sáng nào bạn cũng bắt xe buýt đi tìm việc. Trong số thanh niên cùng xóm, hiếm ai có việc làm.");
  }
  return ethFresh(out);
}
function ethFresh(out) {
  const seen = S.flags.ethSeen || [], f = out.filter(x => !seen.includes(x)); if (!f.length) return null;
  const t = pick(f); S.flags.ethSeen = seen.concat(t).slice(-24); return t;
}
function ethWarmLine() {
  const g = ethG(), a = S.age, t = ethTongue(), out = [];
  if (a <= 12 && t && !noHear() && (g.k === 'mix' || gpAlive('F'))) out.push(g.k === 'mix' ? L`${ethPar()}께서 ${ro(t)} 자장가를 불러 주셨습니다.` : L`할머니가 ${ro(t)} 옛이야기를 들려주셨습니다.`);
  if (a >= 6 && a <= 17 && t && S.school) out.push(L`집에서는 ${eul(t)} 쓰고, 학교에서는 다른 말을 쓰며 자랐습니다. 두 말을 오가는 것이 자연스러웠습니다.`);
  if (a >= 8 && a <= 18 && !g.maj && S.school) out.push("Một thầy giáo nói với bạn rằng hãy tự hào về cội nguồn của mình.");
  if (g.fest) out.push(L`${g.fest} 때 온 친척이 모여 노래하고 음식을 나눴습니다.`);
  else if (g.k !== 'mix') out.push("Mỗi dịp lễ tết, mọi người trong cộng đồng lại tụ họp, cùng hát những bài ca của dân tộc mình và chia sẻ đồ ăn.");
  if (S.eth.g === 'cn_uyg' && a >= 15) out.push("Dân làng tụ họp trong buổi meshrep để ca hát, nhảy múa và trò chuyện. Các bậc cao niên hát một đoạn trong Mười hai Muqam.");
  if (S.eth.g === 'cn_tib' && a >= 6) out.push(...(gpAlive('F') ? ["Bạn cùng bà đi vòng quanh ngôi chùa, quay những bánh xe cầu nguyện. Mỗi bước đi, bà lại khẽ đọc lời cầu nguyện."] : []), "Sáng ngày Losar, cả nhà mặc quần áo mới và thắp những ngọn đèn bơ.");
  if (g.k === 'mix' && a >= 5 && a <= 40 && S.eth.nat && CBY[S.eth.nat]) out.push(L`${ethPar()}의 고향 ${CBY[S.eth.nat].ko}에 가서 그쪽 친척들을 만났습니다. 모두 반갑게 안아 주었습니다.`);
  if (a >= 25 && t && !noHear()) out.push(L`공동체 모임에서 아이들에게 ${wa(t)} 옛 노래를 가르쳤습니다.`);
  if (a >= 25) out.push("Bạn lắng nghe một người trẻ đang trải qua điều mình từng trải qua, và kể cho họ nghe khi ấy mình đã thế nào.");
  if (a >= 50 && t && (S.flags.grand || 0) > 0 && gkNear(0, 12)) out.push(L`손주에게 ${ro(t)} 이름을 불러 주었습니다. 손주가 서툴게 따라 했습니다.`);
  return ethFresh(out);
}
const XJ_F = "Trong báo cáo tháng 8 năm 2022, Văn phòng Cao ủy Nhân quyền Liên Hợp Quốc kết luận rằng việc giam giữ tùy tiện người Duy Ngô Nhĩ và những người khác ở Tân Cương trong những năm 2017–2019 có thể cấu thành tội ác quốc tế, đặc biệt là tội ác chống lại loài người. Chính phủ Trung Quốc gọi các cơ sở này là trung tâm giáo dục và đào tạo nghề, và bác bỏ báo cáo";
const XJ_B = "Tỷ suất sinh ở Tân Cương giảm từ 15,88 trên 1.000 dân năm 2017 xuống 8,14 năm 2019 (Niên giám Thống kê Tân Cương). Chính phủ Trung Quốc giải thích đó là kết quả của việc thực hiện đúng chính sách kế hoạch hóa gia đình; nhiều nhà nghiên cứu và một báo cáo của Liên Hợp Quốc chỉ ra việc hạn chế sinh đẻ mang tính cưỡng ép";
const ZA_GA = "Với Đạo luật Khu vực Nhóm năm 1950, chính phủ Nam Phi quy định mỗi chủng tộc được sống ở đâu. Đạo luật này đến năm 1991 mới bị bãi bỏ";
const ZA_RM = "Dưới chế độ apartheid, hơn 3,5 triệu người Nam Phi đã bị cưỡng ép rời khỏi nơi mình sinh sống (Surplus People Project 1983)";
function ethPastLine() {
  const y = calYr(), g = S.eth && S.eth.g;
  if (g === 'us_black' && y < 1970 && S.age >= 6 && S.age <= 12) return { t: "Trường bạn học chỉ dành cho trẻ em da đen. Trên xe buýt, chỗ ngồi của bạn cũng đã bị quy định sẵn.", f: "Chế độ phân biệt chủng tộc ở miền Nam nước Mỹ chỉ chấm dứt về mặt pháp lý sau Đạo luật Dân quyền năm 1964" };
  if (g === 'cn_uyg' && (S.by || NOW_Y) >= 2010 && S.age >= 10 && S.age <= 25 && S.born === 'CHN' && gpAlive('F')) return { t: "Bà hạ giọng kể cho bạn nghe về những năm tháng mà nhiều người lớn trong xóm mấy năm liền không thể về nhà.", f: XJ_F };
  if (g === 'ca_ind' && S.by < 1990 && S.age >= 8 && S.age <= 30 && gpAlive('F')) return { t: "Bà kể rằng hồi nhỏ bà bị tách khỏi gia đình và đưa vào trường nội trú, nơi ai nói tiếng của dân tộc mình là bị phạt.", f: "Cho đến những năm 1990, Canada đã tách khoảng 150.000 trẻ em bản địa khỏi gia đình và đưa vào các trường nội trú (Ủy ban Sự thật và Hòa giải 2015)" };
  if (g && g.startsWith('za_')) {
    if (y < 1991 && S.age >= 6 && S.age <= 17) return g === 'za_white' ? { t: "Trường học, khu phố, cả bãi biển cũng bị phân chia theo chủng tộc. Khu phố của bạn chỉ có người da trắng sinh sống.", f: ZA_GA }
      : g === 'za_black' && y < 1986 ? { t: "Gia đình bạn sống trong khu dân cư mà chính phủ quy định dành cho người da đen. Người lớn làm việc trong thành phố phải luôn mang theo giấy thông hành, và đêm đến phải quay về đó.", f: "Người da đen ở Nam Phi phải mang theo giấy thông hành cho đến năm 1986. Mỗi năm có hàng trăm nghìn người bị bắt vì vi phạm luật thông hành" }
      : { t: "Trường bạn học bị phân chia theo chủng tộc. Sách giáo khoa và giáo viên lúc nào cũng thiếu.", f: "Sau Đạo luật Giáo dục Bantu năm 1953, chính phủ Nam Phi duy trì trường học riêng cho từng chủng tộc và chi cho các trường của người da đen, người Coloured và người gốc Ấn ít hơn nhiều so với trường của người da trắng" };
    if (g !== 'za_white' && (S.by || NOW_Y) >= 1985 && S.age >= 8 && S.age <= 16 && gpAlive('F')) return g === 'za_black'
      ? { t: "Bà kể cho bạn nghe về những năm tháng không thể ở lại thành phố nếu không có giấy thông hành, và về ngày bị đuổi khỏi khu phố mình từng sống.", f: ZA_RM }
      : { t: "Bà kể cho bạn nghe về ngày khu phố của bà bị quy định thành khu của một chủng tộc khác và gia đình bà bị đuổi đi. Mỗi lần nhắc đến tên khu phố ấy, giọng bà lại trầm xuống.", f: ZA_RM };
    return null;
  }
  if (g === 'au_ind' && S.by < 1990 && S.age >= 8 && S.age <= 30) return { t: "Mẹ bạn bị tách khỏi gia đình từ nhỏ và lớn lên ở nơi khác; suốt một thời gian dài, mẹ không thể kể về chuyện đó.", f: "Cho đến những năm 1970, Úc đã tách trẻ em bản địa khỏi gia đình để nuôi trong các cơ sở và những gia đình khác. Họ được gọi là “Thế hệ bị đánh cắp” (Bringing Them Home 1997)" };
  return null;
}
const CASTE = {
  IND: {
    sc: { n: "Đẳng cấp được liệt kê (Dalit)", sh: { H: 21, S: 32, B: 87 }, t: -0.24, m: 1.1, es: 0.92, eu: 0.95, hire: -0.02, d: 0.09, res: 1950 },
    obc: { n: "Tầng lớp thiệt thòi khác (OBC)", sh: { H: 46, S: 20, B: 3, M: 40.7, C: 37 }, t: -0.03, m: 1.02, es: 0.97, eu: 0.78, hire: -0.005, d: 0, res: 1993,
      f: { M: { t: -0.22, m: 1.0, es: 0.85, eu: 0.22 }, C: { t: 0.35, m: 1.0, es: 1.0, eu: 1.0 } } },
    gen: { n: "Nhóm phổ thông", sh: { H: 33, S: 48, B: 10, M: 58.7, C: 49.6 }, t: 0.25, m: 0.9, es: 1.07, eu: 1.45, hire: 0.01, d: 0,
      f: { M: { t: -0.1, m: 1.0, es: 0.9, eu: 0.3, hire: 0 }, C: { t: 0.35, m: 1.0, es: 1.0, eu: 1.0, hire: 0 } } },
    dx: { n: "Dalit (không được công nhận là đẳng cấp được liệt kê)", sh: { M: 0.6, C: 13.4 }, t: -0.06, m: 1.0, es: 1.0, eu: 1.0, hire: 0, d: 0.06,
      f: { M: { t: -0.3 } } } },
  NPL: {
    dalit: { n: "Dalit", sh: { H: 16 }, t: -0.4, m: 1.15, es: 0.78, eu: 0.5, hire: -0.025, d: 0.1, res: 2007 },
    khas: { n: "Khas Arya", sh: { H: 38 }, t: 0.22, m: 0.93, es: 1.1, eu: 1.45, hire: 0.01, d: 0 },
    jana: { n: "Janajati (dân tộc bản địa)", sh: { H: 27, B: 100, O: 80 }, t: -0.05, m: 1.0, es: 1.0, eu: 0.85, hire: -0.005, d: 0.012, res: 2007 },
    madh: { n: "Madhesi", sh: { H: 19 }, t: -0.12, m: 1.04, es: 0.85, eu: 0.75, hire: -0.005, d: 0.015, res: 2007 } },
};
const CASTE_SUR = {
  hi: { sc: ['Kumar', 'Das', 'Ram', 'Bharti', 'Gautam', 'Kamble', 'Gaikwad', 'Jatav', 'Paswan', 'Valmiki', 'Meghwal', 'Ahirwar', 'Rao'],
    obc: ['Kumar', 'Singh', 'Yadav', 'Patel', 'Verma', 'Das', 'Rao', 'Pillai', 'Chauhan', 'Chaudhary', 'Thakur', 'Maurya', 'Kushwaha', 'Prajapati', 'Sahu'],
    gen: ['Sharma', 'Kumar', 'Singh', 'Gupta', 'Verma', 'Reddy', 'Nair', 'Mishra', 'Iyer', 'Chauhan', 'Pandey', 'Jha', 'Tiwari', 'Srivastava', 'Joshi', 'Mehta', 'Shah', 'Rao', 'Menon', 'Desai', 'Saxena', 'Agarwal', 'Bhatt', 'Thakur', 'Rathore', 'Patel'] },
  ne: { dalit: ['Bishwakarma', 'Nepali', 'Pariyar', 'Sunar', 'Sarki', 'Mijar', 'Ram', 'Paswan'],
    khas: ['Adhikari', 'Karki', 'Poudel', 'Bhandari', 'Khadka', 'Basnet', 'Pandey', 'Sharma', 'Acharya', 'Bhattarai', 'Dahal', 'Rana', 'Thapa'],
    jana: ['Shrestha', 'Gurung', 'Tamang', 'Rai', 'Magar', 'Lama', 'Sherpa', 'Maharjan', 'Thapa', 'Limbu', 'Chaudhary'],
    madh: ['Yadav', 'Mahato', 'Sah', 'Mandal', 'Jha', 'Chaudhary'] },
};
const CASTE_SUB = {
  NPL: {
    jana: [{ n: "người Magar", w: 6.9, t: "tiếng Magar", k: 0.449, r: 'HB', s: ['Thapa', 'Magar', 'Pun', 'Ale', 'Rana'] },
      { n: "người Tharu", w: 6.2, t: "tiếng Tharu", k: 0.949, r: 'H', s: ['Chaudhary', 'Tharu'] },
      { n: "người Tamang", w: 5.62, t: "tiếng Tamang", k: 0.868, r: 'HB', s: ['Tamang', 'Lama', 'Moktan'] },
      { n: "người Newar", w: 4.6, t: "tiếng Newar (Nepal Bhasa)", k: 0.644, r: 'HB', s: ['Shrestha', 'Maharjan', 'Shakya', 'Bajracharya', 'Pradhan'] },
      { n: "người Rai", w: 2.2, t: "một thứ tiếng của người Rai", k: 0.7, r: 'OH', s: ['Rai'] },
      { n: "người Gurung", w: 1.86, t: "tiếng Gurung", k: 0.603, r: 'HB', s: ['Gurung'] },
      { n: "người Limbu", w: 1.42, t: "tiếng Limbu", k: 0.845, r: 'OH', s: ['Limbu', 'Subba'] },
      { n: "người Sherpa", w: 0.44, t: "tiếng Sherpa", k: 0.902, r: 'B', s: ['Sherpa', 'Lama'] },
      { n: "người Rajbanshi", w: 0.46, t: "tiếng Rajbanshi", k: 0.982, r: 'H', s: ['Rajbanshi'] }],
    madh: [{ w: 1, terai: 1, k: 0.929 }],
    dalit: [{ w: 8.8, s: ['Bishwakarma', 'Nepali', 'Pariyar', 'Sunar', 'Sarki', 'Mijar'] }, { w: 4.78, terai: 1, k: 0.929, s: ['Ram', 'Paswan', 'Sada'] }] } };
const TERAI_T = [["tiếng Maithili", 11.05], ["tiếng Bhojpuri", 6.24], ["tiếng Bajjika", 3.89], ["tiếng Awadhi", 2.96]];
function casteSubDraw(c, g, rel) {
  const L0 = CASTE_SUB[c] && CASTE_SUB[c][g]; if (!L0) return {};
  const w = {}; L0.forEach((x, i) => { if (!x.r || x.r.includes(rel)) w[i] = x.w; });
  if (!Object.keys(w).length) L0.forEach((x, i) => { w[i] = x.w; });
  const i = +wpick(w), x = L0[i], o = { sub: i };
  if (x.terai) { if (chance(x.k)) { const tw = {}; TERAI_T.forEach((y, j) => { tw[j] = y[1]; }); o.tt = +wpick(tw); } }
  else if (x.t && chance(x.k)) o.tt = -1;
  return o;
}
const casteSubOf = () => { const L0 = S && S.caste && CASTE_SUB[S.caste.c] && CASTE_SUB[S.caste.c][S.caste.g]; return L0 && S.caste.sub != null ? L0[S.caste.sub] : null; };
function casteTongue() { const x = casteSubOf(); if (!x || S.caste.tt == null) return null; return S.caste.tt >= 0 ? (TERAI_T[S.caste.tt] || [])[0] || null : x.t || null; }
const casteSur = (ct, cl) => { const x = CASTE_SUB[ct.c] && CASTE_SUB[ct.c][ct.g] && ct.sub != null ? CASTE_SUB[ct.c][ct.g][ct.sub] : null; if (x && x.s && cl === 'ne') return pick(x.s);
  const L0 = CASTE_SUR[cl] && CASTE_SUR[cl][ct.g]; return L0 ? pick(L0) : null; };
const casteSurBut = (g, cl, mine) => { const L0 = CASTE_SUR[cl] && CASTE_SUR[cl][g]; if (!L0) return undefined; const o = L0.filter(x => x !== mine); return pick(o.length ? o : L0); };
function casteDraw(c, rel, eth) {
  const T = CASTE[c.id]; if (!T || (eth && eth.g === 'in_adiv')) return null;
  const w = {}; for (const g in T) { const x = T[g].sh[rel]; if (x) w[g] = x; }
  if (!Object.keys(w).length) return null;
  const g = wpick(w); return Object.assign({ g, c: c.id, r: rel }, casteSubDraw(c.id, g, rel));
}
const casteGOf = (iso, g, r) => { const T = CASTE[iso] && CASTE[iso][g]; return !T ? null : T.f && T.f[r] ? Object.assign({}, T, T.f[r]) : T; };
const CASTE_NORM = {};
function casteNorm(iso) {
  if (CASTE_NORM[iso]) return CASTE_NORM[iso];
  const T = CASTE[iso], c = CBY[iso], W = {}; let tw = 0;
  for (const r of ['H', 'S', 'B', 'O', 'M', 'C']) { let s = 0; for (const g in T) s += T[g].sh[r] || 0; if (!s) continue; for (const g in T) { const x = relShare(c, r) * (T[g].sh[r] || 0) / s; if (x) { W[g + r] = { x, p: casteGOf(iso, g, r) }; tw += x; } } }
  const N = { m: 0, es: 0, eu: 0, hire: 0 }; for (const k0 in W) for (const k in N) N[k] += W[k0].x / tw * W[k0].p[k];
  return (CASTE_NORM[iso] = N);
}
function casteQ(iso, ct) {
  const t = casteGOf(iso, ct.g, ct.r || 'H').t, base = ETH_C[iso] ? ethNorm(iso).q : [0.2, 0.2, 0.2, 0.2, 0.2], w = {};
  base.forEach((x, i) => { w[i + 1] = x * Math.exp(t * (i - 2)); }); return +wpick(w);
}
const casteG = () => S && S.caste && CASTE[S.caste.c] ? casteGOf(S.caste.c, S.caste.g, S.caste.r || S.rel) : null;
const casteHome = () => !!(casteG() && S.cur === S.caste.c && S.born === S.caste.c && !studyAway());
const CASTE_LAND = { IND: { sc: [0.4, 2.0] } };
const casteLand = id => { if ((id !== 'farm' && id !== 'farmhand') || !casteHome()) return 1; const t = (CASTE_LAND[S.caste.c] || {})[S.caste.g]; return t ? t[id === 'farm' ? 0 : 1] : 1; };
const casteK = f => { if (!casteHome()) return f === 'hire' ? 0 : 1; const g = casteG(), N = casteNorm(S.caste.c); return f === 'hire' ? g.hire - N.hire : g[f] / N[f]; };
const casteLabel = () => { const g = casteG(), x = casteSubOf(); return !g ? '' : x && x.n ? L`${g.n} · ${x.n}` : g.n; };
const casteRowName = () => S.caste && S.caste.c === 'NPL' ? "Đẳng cấp hoặc nhóm dân tộc" : "Phân loại đẳng cấp";
function resWhat() {
  const y = calYr();
  if (S.eth && S.eth.g === 'in_adiv' && S.born === 'IND' && S.cur === 'IND' && !studyAway()) return 'st';
  if (!casteHome() || S.caste.lost) return null;
  const g = casteG(), k = S.caste.g;
  if (g.res && y >= g.res && !(k === 'obc' && S.q >= 5)) return k;
  if (k === 'gen' && S.caste.c === 'IND' && y >= 2019 && S.q <= 2) return 'ews';
  return null;
}
const RES_W = () => ({ st: "một suất dành riêng cho các bộ tộc được liệt kê", sc: "một suất dành riêng cho các đẳng cấp được liệt kê", obc: "một suất dành riêng cho các tầng lớp thiệt thòi khác", ews: "một suất dành cho các gia đình nhóm phổ thông có hoàn cảnh khó khăn",
  dalit: "một suất dành riêng cho người Dalit", jana: "một suất dành riêng cho người Janajati", madh: "một suất dành riêng cho người Madhesi" });
function resAdmitLine() { const r = resWhat(); return r && chance(r === 'ews' ? 0.25 : 0.5) ? ' ' + L`${RES_W()[r]}(유보 정원)로 들어갔습니다.` : ''; }
const resJobK = id => ['civil', 'police', 'teacher'].includes(id) && resWhat() ? (resWhat() === 'ews' ? 1.05 : 1.25) : 1;
const CASTE_F = { IND: "30% hộ gia đình ở nông thôn và 20% ở thành thị tại Ấn Độ cho biết đến nay họ vẫn giữ tục kỳ thị “không được chạm vào” dưới hình thức nào đó (Khảo sát Phát triển Con người Ấn Độ IHDS-II 2011-12). Tục này đã bị bãi bỏ theo Điều 17 của Hiến pháp năm 1950 và bị xử phạt từ năm 1989",
  NPL: "13,6% dân số Nepal là người Dalit (Điều tra dân số 2021). Năm 2011, Nepal ban hành luật xử phạt hành vi phân biệt đẳng cấp và tục kỳ thị “không được chạm vào”" };
const DX_RES_F = "Ở Ấn Độ, chỉ người theo Ấn Độ giáo, đạo Sikh và Phật giáo mới được công nhận là đẳng cấp được liệt kê (Sắc lệnh Tổng thống năm 1950, sửa đổi năm 1956 và 1990). Vì vậy, các gia đình Dalit theo Kitô giáo hoặc Hồi giáo không được hưởng những suất dành riêng cho đẳng cấp được liệt kê. Năm 2022, chính phủ đã lập một ủy ban để xem xét vấn đề này";
const DX_F = { M: "Trong một khảo sát ở Uttar Pradesh, khoảng một phần ba người Hồi giáo Dalit cho biết họ không được dùng nghĩa địa của các đẳng cấp khác, và 13% cho biết khi đến nhà người Hồi giáo thuộc đẳng cấp khác, họ được đưa bát đĩa để riêng (Trivedi và cộng sự 2016, EPW)",
  C: "Một báo cáo gửi Ủy ban Quốc gia về Người thiểu số của Ấn Độ ghi nhận rằng việc người Kitô giáo Dalit đi nhà thờ riêng và dùng nghĩa trang riêng là điều phổ biến (Deshpande và Bapna 2008)" };
const casteFactNow = () => S.caste.g === 'dx' ? DX_F[S.caste.r || S.rel] || DX_RES_F : CASTE_F[S.caste.c];
const casteSurSays = () => { const s = S.name && S.name.base, T = CASTE_SUR.hi; return !!s && T.sc.includes(s) && !T.gen.includes(s) && !T.obc.includes(s); };
const CASTE_HIRE_T = () => "Bạn nhận ra rằng dù lý lịch như nhau, chỉ vì cái họ mà bạn ít được gọi lại hơn.";
const CASTE_HIRE_F = "Trong một thực nghiệm dùng các bản lý lịch giống nhau ở Ấn Độ, khả năng được gọi lại của ứng viên Dalit chỉ bằng khoảng hai phần ba so với những ứng viên khác (Thorat và Attewell 2007)";
function casteFormLine() {
  const ind = S.caste.c === 'IND', r = S.caste.r || S.rel;
  if (S.caste.g === 'dx') return { t: L`학교 입학 서류의 카스트 범주 칸 앞에서 부모님이 한참 망설였습니다. 우리 집안은 달리트이지만, ${r === 'M' ? "người Hồi giáo" : "người Kitô giáo"}이라서 지정 카스트로는 인정되지 않습니다.`, k: 'ev', f: DX_RES_F };
  if (ind && r === 'M' && S.caste.g === 'obc') return { t: L`학교 입학 서류의 카스트 범주 칸에 ${ira(casteLabel())}라고 적었습니다.`, k: 'ev',
    f: "Khoảng 41% người Hồi giáo ở Ấn Độ thuộc các tầng lớp thiệt thòi khác (OBC). Những cộng đồng Hồi giáo có tên trong danh sách OBC cùng được hưởng phần chỉ tiêu dành riêng cho OBC ở đại học và trong khu vực công (NSS 2004-05, Ủy ban Sachar 2006)" };
  return { t: ind ? L`학교 입학 서류의 카스트 범주 칸에 ${ira(casteLabel())}라고 적었습니다.` : L`우리 집안은 네팔 인구 조사에서 ${ro(casteLabel())} 분류됩니다.`, k: 'ev',
    f: ind ? "Ấn Độ dành riêng một phần chỉ tiêu ở đại học và trong khu vực công cho các đẳng cấp được liệt kê (SC), các bộ tộc được liệt kê (ST) và các tầng lớp thiệt thòi khác (OBC) (chế độ ưu tiên). Nhóm phổ thông là những gia đình không thuộc diện này; từ năm 2019, 10% chỉ tiêu cũng được dành cho những gia đình có hoàn cảnh khó khăn trong nhóm này"
      : "Điều tra dân số Nepal chia dân cư thành các nhóm như Khas Arya (người Brahmin, Chhetri và những nhóm khác ở vùng đồi núi), Janajati (các dân tộc bản địa), Madhesi và Dalit. Từ năm 2007, 45% chỉ tiêu tuyển dụng công chức được dành riêng cho phụ nữ và một số nhóm trong số đó" };
}
function casteDiscLine() {
  const a = S.age, k = S.caste.g, ind = S.caste.c === 'IND', vil = !S.urban, out = [];
  if (k === 'sc' || k === 'dalit') {
    if (a >= 6 && a <= 14) { out.push("Bạn đến nhà một người bạn chơi, mẹ của bạn ấy dặn bạn đừng vào bếp."); if (S.school) out.push("Giờ ăn trưa ở trường, vài đứa trẻ không muốn ngồi cạnh bạn.");
      if (vil && !(S.dis && S.dis.k === 'move')) out.push(ind ? "Bạn ra giếng làng lấy nước thì bị bảo rằng người ở xóm bạn phải dùng giếng khác." : "Ở vòi nước công cộng, bạn vừa chạm vào vòi thì vài người liền hứng lại nước từ đầu."); }
    if (a >= 15) {
      if (vil) out.push(ind ? "Ở quán trà, người ta rót trà cho bạn vào chiếc cốc để riêng cho những người như bạn." : "Ở quán trà, bạn bị bảo phải tự rửa chiếc ly mình đã uống.",
        ind ? "Đoàn rước lễ hội của ngôi đền làng không đi vào những con đường trong xóm nhà bạn." : "Bạn bị dặn không được bước qua ngưỡng cửa nhà người khác.");
      if (a <= 40 && (S.school === 'uni' || (S.edu >= 4 && S.age - (S.flags.degAt || S.age) <= 6) || S.job === 'civil')) out.push("Có người xì xào sau lưng rằng bạn là “người vào nhờ suất dành riêng”. Bạn đã thi cùng một ngày, cùng một đề như mọi người.");
      if (a >= 20 && a <= 55 && !S.house && (S.urban || S.cur !== S.born)) out.push("Khi bạn đi tìm phòng trọ, chủ nhà nghe tên xong liền hỏi lại họ của bạn. Rồi nói rằng phòng đã có người thuê.");
      if (a >= 18 && a <= 60 && isWorking()) out.push("Vài người làm cùng không muốn ăn cơm trưa chung với bạn.");
      if (ind && a >= 20 && a <= 55 && (S.job === 'seeking' || (S.jobY || 0) <= 2) && casteSurSays()) out.push(CASTE_HIRE_T());
      if (a >= 20 && a <= 35 && !S.fam.married) out.push("Chuyện cưới hỏi đang được bàn bạc thì nhà bên kia nghe đến đẳng cấp của bạn và cắt đứt liên lạc.");
    }
  } else if (k === 'dx') {
    const mus = (S.caste.r || S.rel) === 'M';
    if (a >= 6 && a <= 14) out.push(...(S.school ? ["Giờ ăn trưa ở trường, vài đứa trẻ không muốn ngồi cạnh bạn."] : []),
      mus ? "Bạn được sai sang nhà một bác hàng xóm; bác rót nước cho trẻ con xóm bạn vào một chiếc cốc để riêng." : "Mỗi khi đến nhà thờ lớn, người trong xóm bạn luôn ngồi riêng ở phía sau.");
    if (a >= 15) {
      if (vil) out.push(mus ? "Bạn được cho biết nghĩa địa của làng không nhận chôn người nhà bạn. Gia đình bạn dùng một khu đất khác ở cuối làng." : "Trong nghĩa trang của nhà thờ làng, người trong xóm bạn có một góc riêng.");
      if (a >= 20 && a <= 55 && !S.house && (S.urban || S.cur !== S.born)) out.push("Khi bạn đi tìm phòng trọ, chủ nhà nghe tên xong liền hỏi lại họ của bạn. Rồi nói rằng phòng đã có người thuê.");
      if (a >= 20 && a <= 35 && !S.fam.married) out.push("Chuyện cưới hỏi đang được bàn bạc thì nhà bên kia biết gia đình bạn là người Dalit và cắt đứt liên lạc.");
    }
  } else if (k === 'madh') {
    if (a >= 12) out.push("Ở Kathmandu, có người hỏi bạn: “Người Ấn Độ à?”. Bạn sinh ra và lớn lên ở Nepal.");
    if (a >= 18 && casteTongue()) out.push("Ở quầy của một cơ quan nhà nước, có người buông lời nhận xét về giọng nói tiếng Nepal của bạn.");
    if (a >= 18) out.push("Khi nộp hồ sơ xin giấy chứng nhận quốc tịch, bạn bị yêu cầu chứng minh hết lần này đến lần khác, nhiều hơn những người khác.");
  } else if (k === 'jana') {
    if (a >= 6 && a <= 14 && calYr() < 2007 && casteTongue()) out.push(L`학교에서는 네팔어만 써야 했습니다. 집에서 쓰던 ${ro(casteTongue())} 이야기하면 꾸중을 들었습니다.`);
    if (a >= 18) out.push("Bạn gặp một người chỉ nghe tên bạn đã nói: “Người bên đó vốn là thế mà”.");
  }
  return ethFresh(out);
}
const casteD = () => { const g = casteG(); return !g || !g.d ? 0 : g.d * (S.urban ? 0.5 : 1) * (calYr() < 1990 ? 1.4 : 1) * (S.q >= 4 ? 0.7 : 1); };
function casteWarmLine() {
  const a = S.age, k = S.caste.g, ind = S.caste.c === 'IND', out = [];
  if (k === 'sc') {
    if (a >= 6 && a <= 16 && gpAlive('M')) out.push("Ông kể cho bạn nghe về Tiến sĩ Ambedkar. Ông nói người soạn ra Hiến pháp Ấn Độ ấy hồi nhỏ cũng từng phải ngồi riêng ở trường.");
    if (a >= 6) out.push("Ngày 14 tháng 4, ngày kỷ niệm Ambedkar (Ambedkar Jayanti), bạn cùng mọi người trong xóm đi diễu hành. Bọn trẻ đi đầu, cầm ảnh của ông.");
    if (S.rel === 'B' && a >= 6 && a <= 18 && (S.by || NOW_Y) <= 2000 && gpAlive('F')) out.push("Bà kể cho bạn nghe về ngày năm 1956 ở Nagpur, khi hàng trăm nghìn người cùng Tiến sĩ Ambedkar cải sang Phật giáo.");
    if (a >= 8 && a <= 20) out.push("Một người bạn thuộc đẳng cấp khác dẫn bạn vào bếp nhà mình, và hai người cùng ăn cơm chung một đĩa.");
  }
  if (k === 'dalit') {
    if (a >= 6 && a <= 16 && gpAlive('F')) out.push("Bà tự hào kể về tay nghề rèn của ông. Bà nói mọi cái liềm, cái cuốc trong làng đều qua tay ông.");
    if (a >= 15) out.push("Trong nhóm thanh niên Dalit của làng, bạn cùng mọi người học đọc, học viết, và học cách trình báo khi bị phân biệt đối xử.");
  }
  if ((k === 'sc' || k === 'dalit' || k === 'dx') && a >= 25 && S.edu >= 3 && !ddIDk(S.dd) && S.st.sm >= 40) out.push("Tối nào bạn cũng gom bọn trẻ trong xóm lại để dạy học. Ngày trước bạn cũng được học như thế.");
  if ((k === 'sc' || k === 'dalit') && S.edu >= 4 && S.q <= 2 && S.flags.degAt != null && a - S.flags.degAt <= 2) out.push("Bạn là người đầu tiên trong gia đình có bằng đại học. Bố mẹ treo ảnh lễ tốt nghiệp ở chỗ dễ thấy nhất trong nhà.");
  if (k === 'jana') out.push(casteTongue() ? L`명절이면 마을 사람들이 모여 ${ro(casteTongue())} 노래하고 춤을 추었습니다.` : "Mỗi dịp lễ hội, dân làng lại tụ họp, cùng ca hát và nhảy múa.");
  if (k === 'madh' && a >= 5) out.push("Rạng sáng ngày lễ Chhath, cả nhà đứng bên bờ sông, cầu nguyện trước mặt trời đang lên.");
  if (k === 'dx' && a >= 5) out.push((S.caste.r || S.rel) === 'M' ? "Sáng ngày lễ Eid, mọi người trong xóm cùng tụ họp cầu nguyện và chia sẻ đồ ăn." : "Đêm Giáng sinh, mọi người trong xóm tụ họp ở ngôi nhà thờ nhỏ, cùng hát và chia sẻ đồ ăn.");
  const tg = S.caste.c === 'NPL' ? casteTongue() : null;
  if (tg) {
    if (a <= 12 && !noHear() && gpAlive('F')) out.push(L`할머니가 ${ro(tg)} 옛이야기를 들려주셨습니다.`);
    if (a >= 6 && a <= 17) out.push(L`집에서는 ${eul(tg)} 쓰고, 학교에서는 네팔어를 쓰며 자랐습니다. 두 말을 오가는 것이 자연스러웠습니다.`);
    if (a >= 6 && a <= 12 && calYr() >= 2016) out.push(L`학교에서 일주일에 몇 시간, ${tg} 교과서로 배웠습니다. 집에서 쓰는 말이 책에 적혀 있는 것이 신기했습니다.`);
    if (a >= 50 && (S.flags.grand || 0) > 0 && gkNear(0, 6) && !noHear()) out.push(L`손주에게 ${ro(tg)} 자장가를 불러 주었습니다. 손주가 서툴게 따라 했습니다.`);
  }
  return ethFresh(out.filter(Boolean));
}
function casteSeeLine() {
  const a = S.age, out = [];
  if (a >= 8 && a <= 22 && gpAlive('F')) out.push(S.caste.c === 'IND' ? "Bà đưa cho người đến làm việc ở nhà một chiếc cốc để riêng. Bạn rót trà mời người ấy bằng chính chiếc cốc của mình." : "Bà bảo một người hàng xóm đừng bước qua ngưỡng cửa. Bạn mời người hàng xóm ấy vào nhà.");
  if (a >= 20 && a <= 55) out.push("Nghe tin một người bạn không thuê được phòng vì đẳng cấp, bạn cùng bạn ấy đến gặp chủ nhà.");
  if (a >= 30 && S.fam.kids.some(k => k.alive && !k.grown && S.age - k.bornAt >= 6)) out.push("Bạn dặn con đừng hỏi đẳng cấp của bạn bè, vì con người không phân chia theo những thứ như thế.");
  return ethFresh(out);
}
function casteCand(arranged) {
  if (!casteHome()) return null;
  const T = CASTE[S.caste.c], same = chance(arranged ? 0.965 : S.urban && S.edu >= 4 ? 0.82 : 0.9);
  if (same) return { g: S.caste.g, x: 0 };
  const w = {}; for (const g in T) if (g !== S.caste.g) { const x = T[g].sh[S.rel] || T[g].sh.H || 0; if (x) w[g] = x; }
  return Object.keys(w).length ? { g: wpick(w), x: 1 } : { g: S.caste.g, x: 0 };
}
const CASTE_X_F = "Ở Ấn Độ, khoảng 5% phụ nữ kết hôn với người thuộc đẳng cấp khác (Khảo sát Phát triển Con người Ấn Độ IHDS-II 2011-12)";
function casteConv(to) {
  if (!S.caste || S.caste.c !== 'IND' || S.caste.g !== 'sc' || S.caste.lost || !['C', 'M'].includes(to)) return;
  S.caste.lost = S.age; S.caste.g = 'dx'; S.caste.r = to;
  log("Khi cải đạo, bạn không còn được hưởng những suất dành riêng cho đẳng cấp được liệt kê nữa.", 'ev', "Ở Ấn Độ, chỉ người theo Ấn Độ giáo, đạo Sikh và Phật giáo mới được công nhận là đẳng cấp được liệt kê (Sắc lệnh Tổng thống năm 1950, sửa đổi năm 1956 và 1990)");
}
const FC_WHY_US = { neglect: 55, drug: 29, drink: 7, house: 10, ill: 5, left: 5 };
const FC = {
  USA: { p: 4.4, k: { kin: 39, foster: 34, home: 8 }, o: { home: 52, adopt: 26, guard: 16, age: 9 }, why: FC_WHY_US, et: { us_black: 1.72, us_hisp: 0.72, us_asian: 0.28, us_native: 2.15, '': 0.94 } },
  GBR: { p: 3.2, k: { kin: 16, foster: 51, home: 21 }, o: { home: 50, adopt: 9, guard: 12, age: 29 }, why: { neglect: 40, cope: 22, left: 6, ill: 3, drug: 10, drink: 5 } },
  NZL: { p: 2.5, k: { kin: 60, foster: 30, home: 10 }, o: { home: 55, adopt: 2, guard: 20, age: 23 }, why: FC_WHY_US, et: { nz_maori: 2.29, '': 0.52 } },
  AUS: { p: 2.4, k: { kin: 60, foster: 30, home: 10 }, o: { home: 50, adopt: 2, guard: 25, age: 23 }, why: FC_WHY_US, et: { au_ind: 6, '': 0.68 } },
  KOR: { p: 0.37, k: { home: 48.5, kin: 46, foster: 5.5 }, o: { age: 65, home: 28, adopt: 7 }, why: { cope: 11.3, poor: 8.2, left: 4.3, young: 12.6 } },
  JPN: { p: 0.6, k: { home: 74, foster: 26 }, o: { age: 67, home: 26, adopt: 7 }, why: { ill: 17.1, neglect: 15, cope: 7.4, poor: 4.9, left: 2.9 } } };
const FC_Q = { 1: 2.0, 2: 1.3, 3: 0.8, 4: 0.55, 5: 0.35 };
const FC_F = () => ({ USA: "Khoảng 5,3% trẻ em Mỹ từng trải qua nuôi dưỡng tạm thời trước 18 tuổi. Trong số trẻ rời diện nuôi dưỡng, 46% trở về nhà và 26% được nhận làm con nuôi (Yi và cộng sự 2020, Bộ Y tế và Dịch vụ Nhân sinh Hoa Kỳ AFCARS 2025)",
  GBR: "Khoảng 4% trẻ em sinh năm 2000 ở Anh (England) từng được nhà nước bảo trợ trước 18 tuổi (Jay và cộng sự 2022). Trong số trẻ rời diện bảo trợ năm 2025, khoảng 9% được nhận làm con nuôi (Bộ Giáo dục Anh)",
  NZL: "Trong số trẻ em sinh năm 1998 ở New Zealand, 3,1% từng được đưa đến sống ngoài gia đình trước 18 tuổi; ở trẻ em Maori, tỷ lệ này là 7,1% (Rouland và Vaithianathan 2018)",
  AUS: "Trẻ em bản địa ở Úc được chăm sóc ngoài gia đình nhiều gấp khoảng 11 lần so với những trẻ khác (Viện Y tế và Phúc lợi Úc 2024)",
  KOR: "Năm 2023, ở Hàn Quốc có 2.054 trẻ em cần được bảo vệ đã được gửi vào cơ sở nuôi dưỡng hoặc một gia đình. Khoảng 90% trường hợp nuôi dưỡng tại gia đình là ở với ông bà và họ hàng (Bộ Y tế và Phúc lợi Hàn Quốc)",
  JPN: "Ở Nhật Bản, khoảng 42.000 trẻ em đang được nuôi dưỡng thay thế, và khoảng một phần tư trong số đó lớn lên trong các gia đình nhận nuôi tạm thời (Bộ Y tế, Lao động và Phúc lợi Nhật Bản; Cơ quan Trẻ em và Gia đình)" });
function fcDraw(c) {
  const F = FC[c.id]; if (!F || AGE12) return null;
  const et = F.et ? (S.eth && F.et[S.eth.g] != null ? F.et[S.eth.g] : F.et[''] || 1) : 1;
  const eg = S.eth && ETH_G[S.eth.g], qw = [1, 2, 3, 4, 5].map(k => eg ? Math.exp(eg.q * (k - 3)) : ETH_C[c.id] ? ethNorm(c.id).q[k - 1] : 1);
  const qm = qw.reduce((t, w, i) => t + w * FC_Q[i + 1], 0) / qw.reduce((t, w) => t + w, 0);
  if (!chance(F.p / 100 * et * (FC_Q[S.q] || 1) / qm)) return null;
  const why = wpick(F.why), at = why === 'young' ? 0 : +wpick({ 0: 18, 1: 5.4, 2: 5.4, 3: 5.4, 4: 5.4, 5: 5.4, 6: 4.2, 7: 4.2, 8: 4.2, 9: 4.2, 10: 4.2, 11: 4.67, 12: 4.67, 13: 4.67, 14: 4.67, 15: 4.67, 16: 4.67, 17: 4 });
  let o = wpick(F.o), end = o === 'age' ? 18 : at + ri(1, 3) + (o === 'adopt' ? 1 : 0);
  if (end >= 18 && o !== 'age') { o = 'age'; end = 18; }
  return { at, why, k: wpick(F.k), o, end, c: c.id };
}
const fcKept = () => !!(S && S.fc && S.fc.in === 0 && (S.fc.o === 'adopt' || S.fc.o === 'guard') && S.flags.raised && S.flags.raised.fc);
const fcAway = () => !!(S && S.fc && (S.fc.in || fcKept()));
const raisedAlive = () => { const r = S.flags.raised; return !!r && !(r.k === 'gp' && !(S.fam.gp || []).some(g => g.alive && g.side === r.side && g.sex === r.sex)); };
const fcPar = () => { const f = S.fam; return f.mom.alive ? 'mom' : f.dad.alive && !f.dad.absent ? 'dad' : null; };
const fcPW = w => w === 'dad' ? "bố" : "mẹ";
const fcPlace = () => { const F = S.fc, r = S.flags.raised; return F.k === 'kin' && r ? L`${raisedWord(r)} 댁` : F.k === 'foster' ? "gia đình nhận nuôi tạm thời" : "mái ấm"; };
function fcLabel() {
  const F = S.fc; if (!F || F.in == null) return '';
  const pl = F.pl || '';
  if (F.in) return L`${F.at}세부터 ${pl}`;
  return F.o === 'home' ? L`${F.at}~${F.end}세 ${pl} · 집으로 돌아옴` : F.o === 'adopt' && F.end <= S.age ? L`${F.at}세부터 ${pl} · ${F.end}세에 입양` : F.o === 'guard' ? L`${F.at}세부터 ${pl} · 후견인과 함께 자람` : L`${F.at}~18세 ${pl} · 보호 종료`;
}
const fcEduK = t => !S.fc || S.fc.in == null ? 1 : t === 'u' ? (S.fc.o === 'age' ? 0.2 : 0.6) : S.fc.o === 'age' ? 0.6 : 0.85;
function fcYear(a) {
  const F = S.fc; if (!F || AGE12 || S.phase !== 'life') return;
  const c = C();
  if (F.in == null && a === F.at) {
    const w = fcPar(); if (!w || !withParents() || S.adopt || S.flags.raised) { S.fc = null; return; }
    const f = S.fam, gps = (f.gp || []).filter(g => g.alive && g.age < 80 && !(g.side === 'f' && f.dad.absent));
    let r = null;
    if (F.k === 'kin') r = gps.length && chance(0.6) ? (g => ({ k: 'gp', sex: g.sex, side: g.side, age: g.age }))(gps.find(x => x.sex === 'F') || gps[0])
      : { k: 'kin', sex: chance(0.6) ? 'F' : 'M', side: w === 'mom' ? 'm' : 'f', age: Math.max(25, (f[w].age || 35) + ri(-6, 8)) };
    else r = { k: F.k === 'foster' ? 'foster' : 'home', sex: 'F', age: ri(35, 55) };
    r.at = a; r.fc = 1; S.flags.raised = r; F.in = 1; F.w = w; F.pl = fcPlace();
    f[w].bd = (f[w].bd || 0) - 6;
    const P = fcPW(w), small = a < 5;
    const why = { neglect: small ? "Bạn được nghe kể rằng hồi bạn còn bé, có nhiều ngày không có người lớn nào ở nhà trông bạn." : "Nhiều ngày không có người lớn ở nhà, có những ngày hết cả đồ ăn. Nhà trường biết chuyện, và một nhân viên công tác xã hội đã tìm đến.",
      drug: L`${iga(P)} 약물 문제로 치료를 받아야 했고, 나를 돌볼 수 없게 되었습니다.`, drink: L`${iga(P)} 술을 끊지 못해 나를 돌볼 수 없게 되었습니다.`,
      house: "Gia đình bạn mất nhà, sống lúc trong xe, lúc ở nơi tạm trú. Một nhân viên công tác xã hội đã tìm đến.", ill: L`${iga(P)} 오래 아파 나를 돌볼 수 없게 되었습니다.`,
      left: L`어느 날 ${iga(P)} 집에 돌아오지 않았습니다.`, poor: "Gia đình quá khó khăn, bố mẹ không thể nuôi bạn.",
      cope: f.mom.alive && f.dad.alive && !f.dad.absent ? "Sau khi bố mẹ chia tay, cả hai đều không đủ điều kiện nuôi bạn." : L`${iga(P)} 혼자서는 나를 키울 수 없었습니다.`,
      young: "Mẹ không đủ điều kiện để một mình nuôi bạn." }[F.why] || '';
    const pl = r.k === 'gp' || r.k === 'kin' ? L`사회복지 기관이 나를 ${raisedWord(r)} 댁에 맡겼습니다.` : r.k === 'foster' ? "Cơ quan công tác xã hội gửi bạn đến một gia đình nhận nuôi tạm thời." : "Cơ quan công tác xã hội gửi bạn vào một mái ấm.";
    eff({ h: a >= 4 ? -6 : -2, so: -3 }); logN(why + ' ' + pl, 'bad', FC_F()[F.c] || null);
    return;
  }
  if (!F.in) {
    if (F.o === 'age' && F.c === 'USA' && a >= 18 && a <= 23 && !F.hl && chance(0.06)) { F.hl = 1; eff({ h: -3 }); logN("Có một thời gian bạn không có chỗ ở, phải ngủ nhờ trên sofa hết nhà người bạn này đến nhà người bạn khác.", 'bad', "29% thanh niên Mỹ rời diện nuôi dưỡng tạm thời từng mất chỗ ở ít nhất một lần tính đến 23–24 tuổi (Chapin Hall, Midwest Study)"); }
    if (F.o === 'age' && F.al && F.al > a && S.cur === 'KOR') { const x = incomeAt(c, 0.5) * 0.2; eff({ money: x }); book("Trợ cấp tự lập", x); }
    return;
  }
  const P = fcPW(F.w), po = S.fam[F.w], r = S.flags.raised;
  if (a === F.end) {
    F.in = 0;
    if (F.o === 'home' && po && po.alive) {
      S.flags.raised = null; po.bd = (po.bd || 0) + 3; eff({ h: 4, so: 2 });
      logN(L`${a - F.at}년 만에 집으로 돌아왔습니다. ${iga(P)} 나를 꼭 안아 주었습니다.`, 'warm'); return;
    }
    if (F.o === 'adopt' && r && (r.k === 'foster' || r.k === 'home')) {
      const f = S.fam; F.bp = { mom: Object.assign({}, f.mom), dad: Object.assign({}, f.dad) };
      const mAge = r.k === 'foster' ? r.age + (a - r.at) : ri(32, 45), fAge = mAge + ri(0, 4);
      f.mom = { age: mAge, alive: true }; f.dad = { age: fAge, alive: true, absent: false }; S.flags.raised = null;
      S.q = Math.max(S.q || 3, ri(2, 4)); parentJobs(); eff({ h: 5, so: 3 });
      logN(r.k === 'foster' ? "Bố mẹ nuôi tạm thời đã nhận bạn làm con nuôi. Thẩm phán nói rằng từ nay mọi người chính thức là một gia đình." : "Một cặp vợ chồng đã nhận bạn làm con nuôi. Thẩm phán nói rằng từ nay mọi người chính thức là một gia đình.", 'warm'); return;
    }
    if (F.o === 'age') {
      S.flags.raised = null; S.flags.left = S.flags.left == null ? a : S.flags.left; eff({ h: -2 });
      let t = "Mười tám tuổi, thời gian được bảo trợ kết thúc. Bạn thuê một căn phòng nhỏ và bắt đầu sống một mình.";
      if (S.cur === 'KOR') { const y = calYr(), g = incomeAt(c, 0.5) * (y >= 2022 ? 0.5 : 0.25); eff({ money: g }); book("Tiền hỗ trợ tự lập ban đầu", g); if (y >= 2022) F.al = a + 5; t += ' ' + L`자립정착금 ${wonStr(g)}을 받았습니다.`; }
      logN(t, 'ev', S.cur === 'KOR' ? "Ở Hàn Quốc, thanh niên rời diện bảo trợ được nhận khoản hỗ trợ tự lập ban đầu 10–20 triệu won tùy địa phương, và từ năm 2024 còn được trợ cấp tự lập 500.000 won mỗi tháng trong tối đa 5 năm (Bộ Y tế và Phúc lợi Hàn Quốc)" : "Trong số thanh niên Mỹ rời diện nuôi dưỡng tạm thời, chỉ 7,6% có bằng đại học trước 26 tuổi, thấp xa so với 46,1% ở bạn bè cùng trang lứa (Midwest Study)"); return;
    }
    if (F.o === 'adopt' && r && (r.k === 'gp' || r.k === 'kin')) { eff({ h: 4, so: 2 }); logN(L`${iga(raisedWord(r))} 나를 정식으로 입양했습니다. 판사가 이제 서류로도 한 가족이 되었다고 말해 주었습니다.`, 'warm'); return; }
    F.o = 'guard'; eff({ h: 2, so: 1 });
    logN(r && (r.k === 'gp' || r.k === 'kin') ? L`${iga(raisedWord(r))} 정식으로 나의 후견인이 되었습니다.` : "Bố mẹ nuôi tạm thời đã chính thức trở thành người giám hộ của bạn.", 'ev'); return;
  }
  if (po && po.alive && a - (F.va ?? -9) >= 3 && yearRoll('fcv', ['KOR', 'JPN'].includes(F.c) ? 0.15 : 0.3)) { F.va = a; logN(['KOR', 'JPN'].includes(F.c) ? L`명절에 ${iga(P)} 찾아왔습니다. 짧게 만나고 헤어졌습니다.` : L`토요일마다 ${eul(P)} 한 시간씩 만났습니다. 사회복지사가 곁에 앉아 있었습니다.`, 'ev'); return; }
  if (r && (r.k === 'foster' || r.k === 'home') && yearRoll('fcm', 0.1)) { eff({ h: -3 }); logN(S.school ? (r.k === 'foster' ? "Bạn chuyển đến một gia đình nhận nuôi tạm thời khác. Trường học cũng đổi." : "Bạn chuyển đến một mái ấm khác. Trường học cũng đổi.") : r.k === 'foster' ? "Bạn chuyển đến một gia đình nhận nuôi tạm thời khác." : "Bạn chuyển đến một mái ấm khác.", 'bad'); return; }
  if (r && a >= 4 && a - (F.wa ?? -9) >= 3 && yearRoll('fcw', 0.2)) { F.wa = a; eff({ h: 2, so: 1 }); logN(r.k === 'foster' ? "Mẹ nuôi tạm thời lần đầu tiên làm bánh sinh nhật cho bạn." : r.k === 'home' ? (S.school ? "Sáng ngày thi, người chăm sóc ở mái ấm chuẩn bị cơm hộp cho bạn." : "Người chăm sóc ở mái ấm đọc truyện cổ tích cho bạn nghe đến khi bạn ngủ thiếp đi.") : S.school ? L`${iga(raisedWord(r))} 학교 앞에서 나를 기다리고 계셨습니다.` : L`${iga(raisedWord(r))} 밤마다 옛날이야기를 들려주셨습니다.`, 'warm'); }
}
function fcCarerGone() {
  const f = S.fam, F = S.fc, w = F && F.w ? F.w : 'mom', gps = (f.gp || []).filter(g => g.alive && g.age < 85 && !(g.side === 'f' && f.dad.absent));
  let r;
  if (gps.length && chance(0.6)) { const g = gps.find(x => x.sex === 'F') || gps[0]; r = { k: 'gp', sex: g.sex, side: g.side, age: g.age }; }
  else if (!(F && F.in) || chance(0.7)) r = { k: 'kin', sex: chance(0.6) ? 'F' : 'M', side: w === 'mom' ? 'm' : 'f', age: Math.max(25, ((f[w] && f[w].age) || 35) + ri(-6, 8)) };
  else r = { k: fosterLand(B()) ? 'foster' : 'home', sex: 'F', age: ri(35, 55) };
  r.at = S.age; r.fc = 1; S.flags.raised = r;
  if (F && F.in) { F.k = r.k === 'gp' ? 'kin' : r.k; F.pl = fcPlace(); }
  const wd = raisedWord(r);
  logN(r.k === 'gp' ? L`이제 ${wd} 댁에서 자라게 되었습니다.` : r.k === 'kin' ? L`이제 ${wd} 댁에서 사촌들과 함께 자라게 되었습니다.` : r.k === 'foster' ? "Từ đây, bạn lớn lên trong một gia đình nhận nuôi tạm thời." : "Từ đây, bạn lớn lên ở mái ấm.", 'ev');
}
const ADOPT_D = { USA: [[1950, 12], [1960, 14], [1970, 20], [1975, 12], [1980, 8], [1990, 6], [2000, 5], [2026, 4.5]],
  CAN: [[1950, 10], [1965, 14], [1975, 8], [1985, 3], [2000, 1.5], [2026, 1.2]], GBR: [[1950, 12], [1968, 18], [1975, 8], [1985, 2.5], [2000, 1], [2026, 0.6]],
  IRL: [[1950, 15], [1967, 22], [1975, 15], [1985, 5], [1995, 1], [2026, 0.2]], AUS: [[1950, 12], [1970, 15], [1975, 8], [1985, 2], [2000, 0.4], [2026, 0.2]],
  NZL: [[1955, 14], [1968, 20], [1978, 6], [1990, 1], [2026, 0.4]], KOR: [[1955, 1], [1980, 2], [1990, 1.7], [2000, 2.2], [2007, 2.8], [2012, 2.3], [2014, 1.5], [2020, 1], [2023, 0.65], [2026, 0.6]],
  JPN: [[1950, 2], [1970, 1.5], [1990, 0.5], [2010, 0.4], [2026, 0.8]], DEU: [[1950, 5], [1980, 3], [2000, 1], [2026, 0.6]], FRA: [[1950, 5], [1980, 3], [2000, 1], [2026, 0.7]],
  CHN: [[1950, 2], [1990, 3], [2005, 2.5], [2015, 1.2], [2026, 0.5]], RUS: [[1950, 3], [1990, 3], [2005, 4], [2026, 2.5]], IND: [[1950, 0.2], [2026, 0.17]] };
const ADOPT_DR = { hi: 0.4, eca: 1, lac: 0.4, ssa: 0.15, sa: 0.15, eap: 0.3, mena: 0.1 };
const ADOPT_I = {
  KOR: { r: [[1955, 0.3], [1960, 1], [1965, 0.6], [1970, 1.9], [1975, 5.8], [1980, 4.8], [1985, 13.5], [1988, 10], [1990, 3.6], [1995, 3], [2000, 3.7], [2005, 4.8], [2010, 2.2], [2015, 0.85], [2020, 0.86], [2023, 0.34], [2025, 0.05], [2026, 0.02]],
    to: { USA: 60, FRA: 8, DNK: 7, SWE: 7, NOR: 5, NLD: 3.5, BEL: 3.5, AUS: 2.5, DEU: 2, CAN: 1.5, CHE: 1 }, y2: 1990, to2: { USA: 82, SWE: 4, NOR: 4, DNK: 3, AUS: 3, CAN: 3, FRA: 1 }, mo: [3, 7], f: 0.13 },
  CHN: { r: [[1991, 0], [1993, 0.05], [1995, 0.15], [2000, 0.3], [2005, 0.9], [2008, 0.4], [2010, 0.33], [2015, 0.14], [2019, 0.05], [2020, 0]], girl: 1,
    to: { USA: 58, ESP: 14, CAN: 8, NLD: 5, FRA: 4, SWE: 3, GBR: 2, DNK: 2, NOR: 2, ITA: 2 }, mo: [8, 14], f: 0.03 },
  VNM: { r: [[1973, 0.4], [1975, 2], [1976, 0], [1990, 0.3], [2000, 0.8], [2008, 1.1], [2009, 0.2], [2015, 0.15], [2026, 0.08]], to: { FRA: 35, USA: 30, ITA: 15, ESP: 5, CAN: 5, IRL: 5, DNK: 5 }, mo: [4, 10], f: 0.1 },
  KHM: { r: [[1995, 0.5], [2000, 1.5], [2001, 0.2], [2005, 0]], to: { USA: 70, FRA: 20, CAN: 5, ITA: 5 }, mo: [5, 12], f: 0.1 },
  THA: { r: [[1975, 0.3], [1985, 0.4], [2000, 0.5], [2010, 0.4], [2026, 0.2]], to: { USA: 25, SWE: 15, NOR: 10, DNK: 10, FRA: 10, ITA: 10, NLD: 5, CHE: 5, DEU: 5, CAN: 5 }, mo: [6, 14], f: 0.15 },
  PHL: { r: [[1975, 0.15], [1990, 0.25], [2010, 0.25], [2020, 0.1], [2026, 0.07]], to: { USA: 45, ITA: 15, CAN: 10, FRA: 8, NOR: 6, SWE: 6, DNK: 5, AUS: 5 }, mo: [8, 18], f: 0.15 },
  IND: { r: [[1970, 0.04], [1980, 0.06], [1990, 0.08], [2000, 0.04], [2010, 0.025], [2026, 0.012]], to: { USA: 30, SWE: 15, ITA: 15, ESP: 8, FRA: 8, DNK: 6, NLD: 5, BEL: 4, CAN: 4, NOR: 3, AUS: 2 }, mo: [6, 16], f: 0.08 },
  LKA: { r: [[1978, 0.5], [1982, 4], [1987, 3], [1988, 0.5], [2000, 0.05], [2026, 0.02]], to: { NLD: 30, DEU: 20, SWE: 15, DNK: 10, CHE: 10, GBR: 5, NOR: 5, BEL: 5 }, mo: [2, 8], f: 0.1 },
  NPL: { r: [[1995, 0.2], [2005, 0.6], [2008, 0.6], [2010, 0.2], [2012, 0]], to: { ESP: 30, USA: 20, ITA: 20, FRA: 15, DEU: 10, CAN: 5 }, mo: [8, 20], f: 0.1 },
  KAZ: { r: [[1998, 1], [2003, 3], [2008, 1.5], [2012, 0.5], [2026, 0.05]], to: { USA: 70, ESP: 10, ITA: 10, FRA: 5, DEU: 5 }, mo: [10, 20], f: 0.15 },
  RUS: { r: [[1991, 0.2], [1995, 3.5], [2000, 5.5], [2004, 6.3], [2008, 2.3], [2012, 1.4], [2014, 0.5], [2018, 0.2], [2022, 0]],
    to: { USA: 50, ESP: 18, ITA: 17, FRA: 8, DEU: 3, CAN: 2 }, y2: 2013, to2: { ESP: 35, ITA: 40, FRA: 15, DEU: 5, CAN: 5 }, mo: [10, 22], f: 0.2 },
  UKR: { r: [[1992, 0.5], [2000, 4], [2005, 4], [2010, 2.5], [2015, 1.2], [2021, 1], [2022, 0]], to: { USA: 35, ITA: 40, ESP: 10, DEU: 5, FRA: 5, CAN: 5 }, mo: [12, 24], f: 0.2 },
  ROU: { r: [[1989, 0], [1990, 30], [1991, 25], [1992, 8], [1995, 8], [2000, 10], [2001, 3], [2005, 0.1], [2006, 0]], to: { USA: 35, ITA: 25, FRA: 15, ESP: 10, CAN: 5, DEU: 5, GBR: 3, CHE: 2 }, mo: [8, 24], f: 0.25 },
  BGR: { r: [[1990, 2], [1995, 5], [2000, 14], [2005, 6], [2015, 4.5], [2026, 2.5]], to: { USA: 30, ITA: 30, FRA: 10, ESP: 10, CAN: 5, NLD: 5, CHE: 5, BEL: 5 }, mo: [12, 24], f: 0.2 },
  GTM: { r: [[1985, 0.5], [1990, 1], [1995, 1.3], [2000, 3.5], [2005, 9], [2007, 11], [2008, 9], [2009, 1.8], [2010, 0]], to: { USA: 98, CAN: 2 }, mo: [5, 11], f: 0.35 },
  COL: { r: [[1975, 1], [1980, 2.5], [1985, 3], [1995, 3], [2000, 2.5], [2010, 2], [2015, 0.7], [2020, 0.5], [2026, 0.4]],
    to: { USA: 25, FRA: 18, ESP: 12, ITA: 12, NLD: 8, SWE: 6, NOR: 6, DNK: 4, DEU: 4, CAN: 3, BEL: 2 }, mo: [6, 18], f: 0.3 },
  CHL: { r: [[1973, 1], [1978, 3], [1985, 3.5], [1990, 2], [1995, 0.3], [2026, 0.05]], to: { SWE: 30, USA: 20, FRA: 15, ITA: 10, NLD: 10, DEU: 8, CHE: 5, ESP: 2 }, mo: [2, 10], f: 0.25 },
  PER: { r: [[1985, 0.3], [1990, 1], [1993, 1.2], [1996, 0.3], [2026, 0.08]], to: { ITA: 40, USA: 20, ESP: 15, FRA: 10, DEU: 5, NLD: 5, SWE: 5 }, mo: [6, 18], f: 0.2 },
  PRY: { r: [[1985, 0.5], [1990, 3], [1995, 4], [1996, 0.2], [2026, 0]], to: { USA: 60, ESP: 20, ITA: 10, FRA: 10 }, mo: [3, 10], f: 0.25 },
  BRA: { r: [[1975, 0.2], [1985, 0.6], [1990, 0.7], [2000, 0.2], [2010, 0.05], [2026, 0.02]], to: { ITA: 40, FRA: 25, USA: 10, NLD: 8, SWE: 5, NOR: 5, DEU: 5 }, mo: [8, 24], f: 0.2 },
  HTI: { r: [[1985, 0.5], [1990, 1], [2000, 3.5], [2005, 4], [2009, 4], [2010, 9], [2011, 2], [2015, 1.5], [2020, 0.8], [2026, 0.5]], to: { USA: 50, FRA: 30, CAN: 10, NLD: 5, BEL: 3, CHE: 2 }, mo: [10, 24], f: 0.3 },
  ETH: { r: [[1995, 0.1], [2000, 0.2], [2005, 0.6], [2009, 1.5], [2010, 1.5], [2012, 0.9], [2015, 0.2], [2017, 0.05], [2018, 0]],
    to: { USA: 50, ESP: 12, FRA: 10, ITA: 10, NLD: 4, BEL: 3, DNK: 3, SWE: 2, NOR: 2, CAN: 2, AUS: 2 }, mo: [8, 24], f: 0.35 },
  COD: { r: [[2008, 0.05], [2011, 0.3], [2013, 0.1], [2014, 0]], to: { USA: 50, FRA: 15, BEL: 15, ITA: 15, CAN: 5 }, mo: [12, 24], f: 0.2 },
  UGA: { r: [[2008, 0.03], [2012, 0.1], [2016, 0.03], [2026, 0.01]], to: { USA: 85, NLD: 5, ITA: 5, CAN: 5 }, mo: [12, 24], f: 0.25 },
};
const adoptAt = (P, y, pre) => { if (y < P[0][0]) return pre ? P[0][1] : 0;
  for (let i = 1; i < P.length; i++) if (y <= P[i][0]) { const [y0, v0] = P[i - 1], [y1, v1] = P[i]; return v0 + (v1 - v0) * (y - y0) / Math.max(1, y1 - y0); }
  return P[P.length - 1][1]; };
const ADOPT_CLOSED = { USA: { RUS: 2013 } };
function adoptTellP(c, y) {
  if (['KOR', 'JPN', 'TWN', 'CHN'].includes(c.id)) return y < (c.id === 'JPN' ? 1988 : 2012) ? 0.3 : 0.65;
  if (['hi', 'eca'].includes(c.p)) return y < 1965 ? 0.6 : y < 1985 ? 0.82 : 0.95;
  return 0.5;
}
function adoptDraw(c, sex, y, eth) {
  const I = ADOPT_I[c.id];
  if (I) {
    let r = adoptAt(I.r, y) / 1000; if (I.girl && y < 2010) r *= sex === 'F' ? 1.75 : 0.25;
    if (r > 0 && chance(r)) {
      const T = I.y2 && y >= I.y2 ? I.to2 : I.to, w = {};
      for (const d in T) if (CBY[d] && !(ADOPT_CLOSED[d] && ADOPT_CLOSED[d][c.id] && y >= ADOPT_CLOSED[d][c.id])) w[d] = T[d];
      if (Object.keys(w).length) { const mo = ri(I.mo[0], I.mo[1]); return { k: 'intl', from: c.id, to: wpick(w), mo, at: mo >= 12 ? 1 : 0, y }; }
    }
  }
  if (c.id === 'CAN' && eth && eth.g === 'ca_ind' && y >= 1960 && y <= 1985 && chance(0.035)) { const mo = ri(1, 11); return { k: 'dom', from: c.id, to: c.id, mo, at: 0, y, scoop: 1 }; }
  const D = ADOPT_D[c.id];
  const r = (D ? adoptAt(D, y, 1) : ADOPT_DR[c.p] || 0.2) / 1000;
  if (!chance(r)) return null;
  const mo = ri(0, 3), kf = relShare(c, 'M') > 0.5;
  return { k: 'dom', from: c.id, to: c.id, mo, at: 0, y, kf: kf ? 1 : 0 };
}
const adoptFrom = () => S && S.adopt && S.adopt.k === 'intl' && S.adopt.mv != null ? S.adopt.from : null;
const adoptVis = () => { const A = S && S.adopt; if (!A || A.k !== 'intl') return false; const f = CBY[A.from], t = CBY[A.to]; return !!(f && t && !(['eca', 'hi'].includes(f.p) && ['eca', 'hi'].includes(t.p))); };
function adoptPlan() {
  const A = S.adopt; if (!A) return '';
  return A.k === 'intl' ? (A.mo >= 12 ? L`돌이 지나 ${CBY[A.to].ko}의 한 가정으로` : L`생후 ${A.mo}개월 무렵 ${CBY[A.to].ko}의 한 가정으로`) : A.kf ? L`생후 ${A.mo}개월 무렵 후견(카팔라)으로 한 가정에` : A.mo ? L`생후 ${A.mo}개월 무렵 다른 가정으로` : "Vừa chào đời, về với một gia đình khác";
}
function adoptBirthLine() {
  const A = S.adopt; if (!A) return '';
  if (A.scoop) return "Bạn sắp bị đưa khỏi vòng tay gia đình.";
  if (A.k === 'intl' && A.from === 'CHN') return "Vài ngày sau khi chào đời, bạn được tìm thấy bên vệ đường và được đưa vào một mái ấm.";
  return A.k === 'intl' ? "Mẹ không thể nuôi bạn, và bạn được gửi đến một cơ quan nhận con nuôi. Bạn sẽ đến với một gia đình ở bên kia đại dương." : "Mẹ không thể nuôi bạn, và bạn sẽ được một gia đình khác nhận làm con nuôi.";
}
const ADOPT_IF = { KOR: "Từ những năm 1950, khoảng 170.000 trẻ em Hàn Quốc đã được nhận làm con nuôi ở nước ngoài, khoảng 65% sang Mỹ. Vào những năm 1970–80, tỷ lệ này là khoảng 1 trên 100 em bé chào đời mỗi năm (Bộ Y tế và Phúc lợi Hàn Quốc, AP 2025)",
  CHN: "Từ năm 1992, khoảng 160.000 trẻ em Trung Quốc đã được nhận làm con nuôi ở nước ngoài, phần lớn là bé gái. Năm 2024, Trung Quốc chấm dứt việc cho con nuôi ra nước ngoài",
  GTM: "Năm 2007, ở Guatemala cứ khoảng 100 em bé chào đời thì có 1 em được nhận làm con nuôi ở nước ngoài (gần như tất cả là ở Mỹ). Khi việc làm giả giấy tờ và mua bán trẻ em bị phát hiện, nước này đã dừng cho con nuôi ra nước ngoài vào năm 2008",
  RUS: "Từ năm 1999 đến 2012, khoảng 60.000 trẻ em Nga được các gia đình ở Mỹ nhận làm con nuôi. Năm 2013, Nga cấm người Mỹ nhận con nuôi",
  ROU: "Sau cuộc cách mạng năm 1989, khi thực trạng các trại trẻ mồ côi ở Romania được thế giới biết đến, chỉ riêng trong hai năm 1990–91 đã có hơn 10.000 trẻ em được nhận làm con nuôi ở nước ngoài. Romania dừng cho con nuôi ra nước ngoài vào năm 2001",
  ETH: "Khoảng năm 2010, mỗi năm Ethiopia cho hơn 4.000 trẻ em làm con nuôi ở nước ngoài, và đến năm 2018 thì cấm cho con nuôi ra nước ngoài" };
const ADOPT_GF = "Số trẻ em được nhận làm con nuôi xuyên quốc gia đạt đỉnh vào năm 2004 với khoảng 45.000 em, rồi giảm mạnh kể từ đó (Selman, Hội nghị La Hay về Tư pháp quốc tế)";
function adoptBirthFam(c) {
  const f = S.fam, w = {}; [1, 2, 3, 4, 5].forEach(k => { w[k] = Math.exp(-0.35 * (k - 3)); });
  S.q = +wpick(w); S.flags.rich = null; S.flags.richQ = null;
  f.dad.absent = chance(0.85); f.mom.age = Math.max(16, Math.min(f.mom.age, ri(17, 29))); f.mAt = f.mom.age;
  f.older = chance(0.75) ? 0 : Math.min(1, f.older); sibOlderFit(c); f.younger = 0;
  S.fam.gp = makeGrandparents(c, f.mom.age, f.dad.age);
  delete f.dad.job; delete f.mom.job; delete f.pHome; delete f.pPct; parentJobs();
}
const adoptWait = () => !!(S && S.adopt && S.adopt.mv == null && S.adopt.k === 'intl' && S.adopt.at > S.age);
function adoptMove() {
  const A = S.adopt; if (!A || A.mv != null) return;
  if (typeof skinMe === 'function') A.sk = skinMe();
  A.nm0 = S.name.full; A.city0 = S.bornCity; A.urb0 = S.bornUrban; A.q0 = S.q; A.bm = { age: S.fam.mom.age, alive: S.fam.mom.alive }; A.rel0 = S.rel; A.mv = S.age;
  const intl = A.k === 'intl';
  if (intl) { S.born = S.cur = A.to; S.eth = null; }
  S.caste = null; S.flags.royal = null; S.flags.rich = null; S.flags.richQ = null;
  const c = C();
  if (intl) { S.rel = relPick(c); const top = c.nm.split(',').map(x => x.split(':')).sort((p, q) => (+q[1] || 100) - (+p[1] || 100))[0][0]; S.cl = NAMES[top] && chance(0.85) ? top : clusterFor(c, S.rel); }
  const w = {}; [1, 2, 3, 4, 5].forEach(k => { w[k] = Math.exp((intl ? 0.55 : 0.35) * (k - 3)); }); S.q = +wpick(w);
  S.urban = S.bornUrban = chance(odds(c.urb / 100, Math.exp(0.25 * (S.q - 3)))); S.city = S.bornCity = S.urban ? cityOf(c) : null;
  const mAge = ri(31, 42), fAge = clamp(mAge + Math.round(coupleGap(c)) + ri(-2, 3), 28, 60), fatherName = pick((NAMES[S.cl] || NAMES.en).m);
  if (!A.kf) S.name = makeName(S.cl, S.sex, { rel: S.rel, father: fatherName });
  S.fam = { mom: { age: mAge, alive: true }, dad: { age: fAge, alive: true, absent: false }, older: chance(0.55) ? 0 : chance(0.75) ? 1 : 2, younger: chance(0.7) ? 0 : 1,
    sibBorn: 0, sibAt: [], mAt: mAge, partner: null, married: false, kids: [], father: fatherName };
  S.fam.gp = makeGrandparents(c, mAge, fAge);
  parentJobs();
  A.kn = intl || A.kf ? ri(3, 6) : chance(A.scoop ? 0.7 : adoptTellP(c, A.y)) ? (A.y < 1985 ? ri(5, 12) : ri(3, 7)) : null;
  if (A.kn == null) A.sec = 1;
  if (intl && A.to === 'USA' && A.y <= 1982 && chance(0.18)) A.noCit = 1;
  const nm = A.kf ? '' : ' ' + L`부모님은 나에게 ${ira(S.name.full)}라는 이름을 지어 주었습니다.`;
  S.yearMark = 'move';
  if (intl) { ACT_NEXT = 'fly'; log((A.mo >= 12 ? L`돌이 지나 ${CBY[A.from].ko}에서 비행기를 타고 ${c.ko}의 새 가족에게 갔습니다.` : L`생후 ${A.mo}개월, ${CBY[A.from].ko}에서 비행기를 타고 ${c.ko}의 새 가족에게 갔습니다.`) + ' ' + "Bố mẹ đã chờ sẵn ở sân bay và lần đầu tiên ôm bạn vào lòng." + nm, 'big', ADOPT_IF[A.from] || ADOPT_GF); return; }
  ACT_NEXT = 'baby';
  if (A.scoop) { log(L`생후 ${A.mo}개월, 사회복지 기관이 나를 데려가 원주민이 아닌 한 부부에게 입양 보냈습니다.` + nm, 'big', "Từ những năm 1960 đến giữa những năm 1980, khoảng 20.000 trẻ em bản địa ở Canada bị đưa khỏi gia đình và cộng đồng, phần lớn được các gia đình không phải người bản địa nhận làm con nuôi. Sự việc này được gọi là “Sixties Scoop” (thỏa thuận dàn xếp của Chính phủ Canada năm 2017)"); return; }
  if (A.kf) { log(L`생후 ${A.mo}개월, 후견(카팔라)으로 아이를 기다리던 한 부부의 가정에 맡겨졌습니다. 이름은 태어날 때의 이름 그대로입니다.`, 'big', "Theo luật Hồi giáo, trẻ em được nuôi dạy theo hình thức kafala (giám hộ) thay vì nhận con nuôi. Đứa trẻ vẫn giữ tên riêng và họ của gia đình ruột"); return; }
  const east = ['KOR', 'JPN', 'TWN', 'CHN'].includes(c.id);
  log((A.mo ? L`생후 ${A.mo}개월에 아이를 기다리던 한 부부에게 입양되었습니다.` : "Vừa chào đời, bạn đã được một cặp vợ chồng mong con đã lâu nhận làm con nuôi.") + nm
    + (A.sec ? ' ' + (east ? "Cặp vợ chồng ấy khai sinh cho bạn như con ruột của mình." : "Hồ sơ khai sinh gốc được niêm phong, và giấy khai sinh mới được làm lại mang tên bố mẹ mới.") : ''), 'big');
}
function adoptLabel() {
  const A = S.adopt; if (!A) return '';
  if (A.mv == null) return adoptPlan();
  const k = A.k === 'intl' ? (A.mo >= 12 ? L`${CBY[A.from].ko} 출생 · 돌이 지나 입양` : L`${CBY[A.from].ko} 출생 · 생후 ${A.mo}개월 입양`) : A.kf ? "Lớn lên theo hình thức giám hộ (kafala)" : A.mo ? L`생후 ${A.mo}개월 입양` : "Được nhận nuôi ngay khi vừa chào đời";
  return A.kn == null || A.kn > S.age ? L`${k} (본인은 모름)` : k;
}
function adoptBmRow() {
  const A = S.adopt; if (!A || !A.bm || A.found == null) return null;
  const B0 = A.bm; return B0.met != null ? (B0.alive ? L`${B0.at + S.age - B0.met}세 · ${B0.met}세에 처음 만남` : L`세상을 떠남 · ${B0.met}세에 처음 만남`) : B0.ref ? "Đã chọn không gặp" : "Đã qua đời";
}
const ADOPT_LATE_F = "Những người biết mình là con nuôi khi đã lớn cho biết họ cảm thấy bị phản bội và hoang mang về bản thân nhiều hơn những người được cho biết từ nhỏ (Baden và cộng sự 2019, khảo sát người được nhận nuôi ở Mỹ)";
const ADOPT_PARADOX_F = "Một đứa trẻ được nhận nuôi từ nước khác lớn lên trong văn hóa của bố mẹ khi ở nhà, nhưng ra ngoài lại bị đối xử như người thuộc chủng tộc thiểu số. Các nhà nghiên cứu gọi đây là “nghịch lý của việc nhận con nuôi khác chủng tộc” (Lee 2003)";
function adoptFindP() {
  const A = S.adopt, y = calYr(), dna = y >= 2015 ? 1 : 0;
  if (A.k === 'intl') { const I = ADOPT_I[A.from]; return clamp((I ? I.f : 0.15) + dna * (A.from === 'CHN' ? 0.03 : 0.08), 0.02, 0.6); }
  if (A.scoop) return 0.5;
  const c = C(); if (['KOR', 'JPN', 'TWN', 'CHN'].includes(c.id)) return 0.15 + dna * 0.05;
  return ['hi', 'eca'].includes(c.p) ? (y < 2000 ? 0.35 : y < 2015 ? 0.45 : 0.65) : 0.2;
}
const ADOPT_DNA = new Set(['USA', 'CAN', 'GBR', 'AUS', 'NZL', 'IRL', 'SWE', 'NOR', 'DNK', 'NLD', 'DEU', 'FRA', 'BEL', 'CHE']);
const adoptPar = () => S.fam.mom.alive ? "mẹ" : S.fam.dad.alive ? "bố" : null;
function adoptYear(a) {
  const A = S.adopt; if (!A || A.mv == null || S.isComp && a > 1) return;
  const c = C(), from = CBY[A.from], rich = ['hi', 'eca'].includes(c.p);
  if (A.kn === a) {
    if (A.k === 'intl') log(L`부모님은 공항에서 찍은 사진을 보여 주며, 내가 ${from.ko}에서 태어나 비행기를 타고 이 집에 왔다고 이야기해 주셨습니다.`, 'ev');
    else if (A.kf) log("Bố mẹ kể với bạn rằng có một người khác đã sinh ra bạn, còn bố mẹ đã nhận bạn về và nuôi nấng bạn từ đó.", 'ev');
    else log("Bố mẹ cho bạn ngồi xuống và kể rằng một người khác đã sinh ra bạn, còn bố mẹ đã chờ đợi và nhận bạn làm con nuôi. Bạn chưa hiểu hết nghĩa là gì, nhưng bàn tay của bố mẹ thật ấm áp.", 'ev');
    return;
  }
  if (A.sec && A.kn == null && a >= 16) {
    const parDied = (!S.fam.mom.alive && S.fam.mom.diedAt === a) || (!S.fam.dad.alive && S.fam.dad.diedAt === a);
    const dna = ADOPT_DNA.has(c.id) && calYr() >= 2015, p = 0.005 + (dna ? (calYr() >= 2019 ? 0.02 : 0.012) : 0) + (parDied ? 0.15 : 0);
    if (chance(p)) {
      A.kn = a; A.late = 1; A.sec = 0; eff({ h: -8, so: -2 }); S.yearMark = S.yearMark || 'loss';
      for (const p0 of [S.fam.mom, S.fam.dad]) if (p0.alive) p0.bd = (p0.bd || 0) - 6;
      const pw = parDied ? (!S.fam.mom.alive && S.fam.mom.diedAt === a ? "mẹ" : "bố") : null;
      log(parDied ? L`${pw}의 유품을 정리하다 입양 서류를 발견했습니다. ${a}년 동안 몰랐던 일이었습니다.`
        : dna && chance(0.6) ? "Bạn làm xét nghiệm ADN cho vui, và kết quả hiện ra tên hàng loạt người họ hàng bạn chưa từng biết. Bạn hỏi bố mẹ, và lần đầu tiên biết mình là con nuôi."
        : "Từ một câu nói vô tình của một người lớn trong họ, bạn biết mình là con nuôi. Bố mẹ im lặng hồi lâu rồi kể cho bạn nghe mọi chuyện.", 'big', ADOPT_LATE_F);
      if (adoptPar()) A.rec = a + ri(1, 3);
      return;
    }
  }
  if (A.rec === a && adoptPar()) { A.rec = null; for (const p0 of [S.fam.mom, S.fam.dad]) if (p0.alive) p0.bd = (p0.bd || 0) + 4;
    log(L`${wa(adoptPar())} 긴 이야기를 나눴습니다. 말하지 못한 세월이 얼마나 무거웠는지 들었습니다. 그래도 두 분이 나의 부모님이라는 것은 변하지 않았습니다.`, 'warm'); return; }
  if (A.srch != null && a - A.srch >= 1) { A.srch = null; adoptFound(c, from); return; }
  const B0 = A.bm;
  if (B0 && B0.met != null && B0.alive) {
    const ba = B0.at + a - B0.met;
    if (chance(ba < 60 ? 0.003 : clamp(0.012 * Math.exp((ba - 60) * 0.085), 0, 0.5))) { B0.alive = false; eff({ h: -5 });
      log("Bạn nghe tin người mẹ đã sinh ra mình qua đời." + (A.k === 'intl' ? ' ' + L`장례에 가려고 ${from.ko}행 비행기를 탔습니다.` : ''), 'loss'); return; }
    if (!B0.fade && a - B0.met >= 2 && chance(0.06)) { B0.fade = 1; log("Niềm vui ban đầu qua đi, bạn và người mẹ sinh ra mình thưa liên lạc dần. Bạn vẫn chưa biết hai người nên là gì của nhau.", 'ev'); return; }
    if (!B0.fade && a - B0.met >= 1 && yearRoll('adbm', 0.12) && (A.bmL == null || a - A.bmL >= 4)) { A.bmL = a; eff({ h: 2 });
      log(A.k === 'intl' ? pick([L`${from.ko}의 어머니에게서 사진과 편지가 왔습니다. 번역기를 돌려 몇 번이고 읽었습니다.`, L`어머니와 짧게라도 직접 이야기하고 싶어 ${from.ko} 말을 배우기 시작했습니다.`, L`어머니를 만나러 다시 ${from.ko}에 다녀왔습니다. 이번에는 둘이서 시장에 갔습니다.`])
        : pick(["Thỉnh thoảng bạn gặp người mẹ đã sinh ra mình để cùng uống trà. Hai người dần dần kể cho nhau nghe những năm tháng đã qua.", "Người mẹ đã sinh ra bạn gửi một món quà nhỏ vào mỗi dịp sinh nhật của các con bạn."]), 'warm'); return; }
  }
  const vis = adoptVis(), D = S.flags.adD || (S.flags.adD = {}), once = (k, p) => !D[k] && chance(p) ? (D[k] = a, true) : false;
  if (A.kn != null && A.kn < a) {
    if (vis && a >= 7 && a <= 13 && once('face', 0.08)) { log("Hôm cả lớp vẽ tranh gia đình, lần đầu tiên bạn nghĩ thật lâu về việc gương mặt mình trong gương khác với gương mặt của bố mẹ.", 'ev'); return; }
    if (vis && a >= 6 && a <= 17 && once('race', 0.07)) { eff({ h: -3 }); log("Bạn bị trêu chọc ở trường vì ngoại hình. Bố mẹ chưa từng trải qua chuyện như vậy nên không biết phải nói gì với bạn.", 'bad', ADOPT_PARADOX_F); return; }
    if (vis && a >= 7 && a <= 14 && calYr() >= 1980 && ['USA', 'CAN', 'AUS', 'SWE', 'NOR', 'DNK', 'NLD'].includes(c.id) && once('camp', 0.08)) { eff({ h: 3, so: 2 });
      log(L`${from.ko}에서 입양된 아이들이 모이는 여름 캠프에 갔습니다. 처음으로 나와 닮은 아이들 틈에 섞여 ${from.ko} 노래를 배웠습니다.`, 'warm'); return; }
    if (a >= 6 && a <= 40 && once('real', 0.025)) { log("Có người hỏi bạn “bố mẹ thật” của bạn là ai. Bạn trả lời rằng những người đã nuôi bạn khôn lớn chính là bố mẹ thật.", 'ev'); return; }
    if (A.k === 'intl' && a >= 16 && a <= 45 && calYr() >= 1985 && once('trip', 0.035)) { const x = incomeAt(c, 0.5) * 0.08; S.money -= x; book("Về thăm đất nước nơi mình sinh ra", -x); eff({ h: 3 }); tripTo(A.from);
      ACT_NEXT = 'trip:city:' + from.p + ':alone'; log(L`태어난 나라 ${from.ko}에 처음 가 보았습니다. 거리의 사람들은 모두 나와 닮았는데, 말은 한마디도 통하지 않았습니다.`, 'big',
        A.from === 'KOR' ? "Hàn Quốc hỗ trợ những người được nhận nuôi ở nước ngoài về thăm và lưu trú, và từ năm 2011 cho phép họ lấy lại quốc tịch Hàn Quốc" : null); return; }
    if (a >= 20 && a <= 60 && once('med', 0.02)) { log("Ở bệnh viện, bạn bỏ trống ô tiền sử bệnh gia đình. Không có gì để ghi.", 'ev'); return; }
    if (!D.kid && S.fam.kids.some(k => k.alive && !k.sk && k.bornAt === a)) { D.kid = a; log("Lần đầu tiên, bạn ôm vào lòng một người cùng huyết thống với mình.", 'warm'); return; }
  }
  if (A.noCit && A.ncAt == null && a >= 18 && calYr() >= 1990 && chance(0.08)) { A.ncAt = a; eff({ h: -6 });
    log("Khi nộp hồ sơ làm hộ chiếu, bạn mới biết mình không phải công dân Mỹ. Bố mẹ chưa từng hoàn tất thủ tục nhập quốc tịch cho bạn.", 'bad', "Đạo luật Quốc tịch Trẻ em năm 2000 chỉ cấp quốc tịch cho những người được nhận nuôi khi ấy chưa đủ 18 tuổi. Hàng chục nghìn người được nhận nuôi từ nước ngoài đã trưởng thành trước đó vẫn không có quốc tịch (Adoptee Rights Campaign)"); return; }
  if (A.noCit && A.ncAt != null && A.cit == null && a - A.ncAt >= 1 && chance(0.6)) { A.cit = a; const x = incomeAt(c, 0.5) * 0.12; S.money -= x; book("Nộp đơn xin quốc tịch", -x); eff({ h: 6 });
    log("Bạn nhờ luật sư nộp đơn xin quốc tịch, và cuối cùng đã tuyên thệ. Bạn trở thành công dân của đất nước mà mình đã sống cả đời.", 'warm'); }
}
function adoptFound(c, from) {
  const A = S.adopt, a = S.age, B0 = A.bm;
  if (!chance(adoptFindP())) {
    A.sAt = a; eff({ h: -3 });
    if (A.k === 'intl' && A.from === 'KOR' && A.y <= 1999 && chance(0.45)) { log("Lần theo hồ sơ, bạn phát hiện tên và ngày tháng ghi trong giấy tờ là của một đứa trẻ khác. Con đường tìm kiếm dừng lại ở đó.", 'bad', "Năm 2025, Ủy ban Sự thật và Hòa giải Hàn Quốc xác nhận rằng các cơ quan nhận con nuôi đã ghi những đứa trẻ có bố mẹ thành trẻ mồ côi và tráo đổi danh tính của trẻ"); return; }
    if (A.k === 'intl' && A.from === 'CHN') { log("Bạn tìm đến mái ấm và nơi mình được tìm thấy, nhưng không ở đâu có ghi chép gì về người đã để bạn lại.", 'bad'); return; }
    log("Hồ sơ chỉ có vài dòng, và con đường tìm kiếm dừng lại ở đó. Bạn quyết định một ngày nào đó sẽ tìm lại.", 'bad'); return;
  }
  A.found = a;
  const ba = B0.age + a, alive = chance(clamp(1.05 - (ba - 40) * 0.022, 0.08, 0.97) * (from.ppp < 10000 ? 0.85 : 1));
  if (!alive) { B0.alive = false; eff({ h: -4 }); const sib = chance(0.6);
    log("Bạn đã tìm được người mẹ sinh ra mình, nhưng được biết mẹ đã qua đời từ mấy năm trước." + ' ' + (sib ? "Người em lần đầu gặp mặt đón bạn ân cần và trao cho bạn tấm ảnh của mẹ." : "Bạn tìm đến nơi mẹ yên nghỉ và đặt lại một bó hoa."), 'loss'); return; }
  if (!chance(0.78)) { B0.ref = 1; eff({ h: -5 });
    log("Qua cơ quan, bạn đã tìm được người mẹ sinh ra mình, nhưng mẹ nhắn rằng chưa thể gặp bạn. Bạn nhận được một lá thư ngắn.", 'bad',
      A.from === 'KOR' || c.id === 'KOR' ? "Ở Hàn Quốc, phải có sự đồng ý của bố mẹ ruột thì người được nhận nuôi mới được cung cấp thông tin về họ. Năm 2024, thông tin về bố mẹ ruột được công khai trong 13,3% trường hợp (Segye Ilbo 2025)" : null); return; }
  B0.met = a; B0.at = ba; B0.alive = true; eff({ h: 7, so: 3 }); S.yearMark = 'love';
  const pr = adoptPar(), hurt = pr && chance(0.25);
  if (pr && hurt) for (const p0 of [S.fam.mom, S.fam.dad]) if (p0.alive) p0.bd = (p0.bd || 0) - 3;
  ACT_NEXT = 'meal';
  log((A.k === 'intl' ? L`${from.ko}에서, 나를 낳아 준 어머니를 ${a}년 만에 만났습니다. 통역사를 사이에 두고 한참을 마주 앉아 있었습니다. 어머니는 내 손을 놓지 않았습니다.`
    : "Bạn đã gặp người mẹ sinh ra mình. Mẹ nói từ ngày ấy đến nay, chưa một ngày nào mẹ quên bạn.")
    + (pr ? ' ' + (hurt ? L`${eun(pr)} 잘됐다고 하시면서도 며칠 말수가 적어지셨습니다.` : L`${eun(pr)} 잘됐다며 함께 기뻐해 주셨습니다.`) : ''), 'big');
}
function adoptSearchP() {
  const A = S.adopt, a = S.age;
  if (!A || A.mv == null || A.kn == null || A.kn >= a || a < 18 || a > 70 || A.found != null || A.no || A.srch != null || (A.st || 0) >= 3 || (A.sAt != null && a - A.sAt < 5) || S.job === 'prison') return 0;
  const kid = S.fam.kids.some(k => !k.sk && a - k.bornAt <= 1), par = (!S.fam.mom.alive && S.fam.mom.diedAt != null && a - S.fam.mom.diedAt <= 2) || (!S.fam.dad.alive && S.fam.dad.diedAt != null && a - S.fam.dad.diedAt <= 2);
  return 0.05 * (kid ? 2 : 1) * (par ? 1.8 : 1) * (A.late ? 2.5 : 1) * (adoptVis() ? 1.3 : 1);
}
const ROYAL = { SAU: [0.05, 0, "hoàng tộc Saud"], QAT: [1.5, 0, "hoàng tộc Al Thani"], ARE: [0.1, 0, "một gia tộc tiểu vương"], KWT: [0.08, 0, "hoàng tộc Al Sabah"], OMN: [0.005, 0, "hoàng tộc Al Said"],
  JOR: [0.003, 0, "hoàng tộc Hashemite"], MAR: [0.002, 0, "hoàng tộc Alaouite"], GBR: [0.0003, 0.02, "hoàng gia"], ESP: [0.0002, 0.01, "hoàng gia"], NLD: [0.0002, 0.01, "hoàng gia"],
  BEL: [0.0002, 0.05, "hoàng gia"], SWE: [0.0002, 0.27, "hoàng gia"], NOR: [0.0002, 0, "hoàng gia"], DNK: [0.0002, 0.03, "hoàng gia"], JPN: [0.0001, 0, "hoàng thất"],
  THA: [0.003, 0, "hoàng gia"], MYS: [0.01, 0, "gia tộc sultan"], KHM: [0.003, 0, "hoàng gia"], LSO: [0.02, 0, "hoàng gia"], DEU: [0, 0.1], AUT: [0, 0.1], FRA: [0, 0.1], ITA: [0, 0.05],
  IND: [0, 0.005] };
const ROYAL_GULF = new Set(['SAU', 'QAT', 'ARE', 'KWT', 'OMN']);
function royalDraw(c) {
  const R = ROYAL[c.id]; if (!R || (c.yr && c.yr < 1950)) return null;
  if (R[0] && chance(R[0] / 100)) return 'r';
  if (R[1] && chance(R[1] / 100)) return 'n';
  return null;
}
const royalOn = () => !!(S && S.flags.royal);
const royalHouse = () => { const R = ROYAL[S.born]; return S.flags.royal === 'r' ? (R && R[2]) || "hoàng gia" : S.born === 'IND' ? "một gia tộc vương công xưa" : "một gia tộc quý tộc xưa"; };
function royalLine() {
  const r = S.flags.royal, a = S.age, gulf = ROYAL_GULF.has(S.born), out = [];
  if (r === 'r') {
    if (a >= 6 && a <= 17) out.push("Đi đâu cũng có một vệ sĩ theo sau bạn một bước.", "Bạn đi học như mọi bạn cùng lứa, nhưng vào ngày hội thể thao, máy ảnh đã có mặt ở đó trước bạn.");
    if (a >= 12 && !gulf) out.push("Phóng viên theo bạn đến tận cổng trường. Bạn bè đã che chắn cho bạn.");
    if (a >= 18) out.push("Với tư cách thành viên hoàng gia, bạn đến dự lễ khánh thành một bệnh viện và cắt băng.", "Bạn nhận làm chủ tịch danh dự của vài tổ chức từ thiện và năm nào cũng đến thăm họ.", "Trong một buổi lễ kỷ niệm của đất nước, bạn đứng ở hàng đầu cùng gia đình. Bạn đứng suốt mấy tiếng đồng hồ với nụ cười trên môi.");
    if (a >= 18 && gulf) out.push("Bạn đến buổi họp của các bậc trưởng lão trong gia tộc (majlis) và lắng nghe lời thỉnh cầu của mọi người.");
  } else {
    if (a <= 17) out.push("Bạn lớn lên trong một ngôi nhà cổ treo chân dung tổ tiên.", "Bạn chơi trốn tìm giữa những đồ vật khắc gia huy xưa của dòng họ.");
    if (a >= 25) out.push({ t: "Sửa ngôi nhà cổ tốn một khoản tiền lớn. Riêng một mái nhà đã ngốn cả năm thu nhập.", cost: 0.4 }, "Khi sắp xếp giấy tờ của dòng họ, bạn đọc được lá thư một vị tổ tiên viết từ hàng trăm năm trước.", "Có người hỏi cái tên của bạn có nghĩa bạn là quý tộc không. Bạn đáp rằng giờ đó chỉ còn là một cái tên lâu đời.");
  }
  const seen = S.flags.rySeen || [], f = out.filter(x => !seen.includes(x.t || x)); if (!f.length) return null;
  const t = pick(f); S.flags.rySeen = seen.concat(t.t || t); return t;
}
function royalYear() {
  if (S.flags.royal !== 'r' || !ROYAL_GULF.has(S.born) || S.age < 18 || S.cur !== S.born) return;
  const x = incomeAt(C(), 0.5) * 1.5; S.money += x; book("Trợ cấp hoàng gia", x);
}
const AFF_K = 0.035, AFF_R = { hi: 1, eca: 1, lac: 1.1, ssa: 0.9, eap: 0.7, sa: 0.3, mena: 0.3 };
const ADULT_CRIME = new Set(['AFG', 'IRN', 'SAU', 'YEM', 'SOM', 'SDN', 'PAK', 'QAT', 'KWT', 'OMN', 'ARE', 'MRT', 'EGY', 'MAR', 'DZA', 'LBY', 'IRQ', 'SYR', 'JOR', 'TUN', 'IDN', 'PHL', 'BGD']);
function affairOK(c) {
  const y = calYr();
  if (ADULT_CRIME.has(c.id) || ((c.id === 'NGA' || c.id === 'MYS') && S.rel === 'M')) return false;
  return !((c.id === 'KOR' && y < 2015) || (c.id === 'TWN' && y < 2020) || (c.id === 'IND' && y < 2018));
}
function affairYear() {
  const A = S.flags.affair, f = S.fam, P = f.partner, c = C();
  if (!A) { if (S.flags.affHid != null && S.age - S.flags.affHid <= 10 && f.married && P && P.alive && chance(0.03)) { S.flags.affHid = null; affairFound(c, true); } return; }
  if (!f.married || !P || !P.alive || P.divorced || S.job === 'prison') { S.flags.affair = null; return; }
  const x = incomeAt(c, 0.5) * 0.02; S.money -= x; book("Tiền tiêu lén", -x);
  eff({ h: -2 }); P.bd = (P.bd || 0) - 2;
  if (A.at === S.age) return;
  A.y++;
  if (chance(0.33)) { S.flags.affair = null; affairFound(c, false); return; }
  if (chance(0.25)) { S.flags.affair = null; S.flags.affHid = S.age; log(L`${wa(A.nm)} 만남을 끝냈습니다. 아무도 몰랐지만 마음은 오래 무거웠습니다.`, 'bad'); return; }
  if (A.y === 1) log(calYr() >= 2008 ? "Những lời nói dối cứ nhiều dần. Bạn có thói quen úp điện thoại xuống." : "Những lời nói dối cứ nhiều dần. Mỗi lần về muộn, bạn lại phải bịa ra một cái cớ.", 'bad');
}
function affairFound(c, past) {
  const f = S.fam, P = f.partner, who = callName(P.name);
  P.bd = (P.bd || 0) - 15; eff({ h: -8, so: -6 }); S.yearMark = S.yearMark || 'loss';
  const kids = f.kids.filter(k => k.alive && !k.sk && S.age - k.bornAt >= 12); for (const k of kids) k.bd = (k.bd || 0) - 6;
  log((past ? L`몇 해 전에 끝낸 만남을 ${iga(who)} 알게 되었습니다.` : L`${iga(who)} 모든 것을 알게 되었습니다.`) + ' ' + "Không khí trong nhà đã khác đi." + (kids.length ? ' ' + "Các con cũng đã biết." : ''), 'bad');
  if (chance({ sa: 0.02, mena: 0.06, ssa: 0.15, eap: 0.15 }[c.p] || 0.25)) { log(L`${eun(who)} 더는 함께 살 수 없다고 했습니다.`, 'bad'); divorceNow(c, true); return; }
  S.flags.mcWhyF = 'mine'; S.flags.mcrisisQ = 1; S.flags.mcAgain = 0; S.flags.mcrisisAt = S.age;
}
function queue(at, type, id, p) { S.queue.push({ at, type, id, p: p || {} }); S.queue.sort((a, b) => a.at - b.at); }
function planYear() {
  S.fl = { nw0: netWorth(), m0: S.money, it: {} };
  // Feature 1: Record What-If Snapshots at key milestones
  try {
    if (!S.replay && S.age >= 1) {
      if (!S.vhtsSnaps) S.vhtsSnaps = [];
      const keyAges = [16, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
      if (keyAges.includes(S.age) && !S.vhtsSnaps.some(sn => sn.age === S.age)) {
        const snapCopy = JSON.parse(JSON.stringify(Object.assign({}, S, { queue: [], pending: null, recent: [], vhtsSnaps: [] })));
        S.vhtsSnaps.push({
          age: S.age,
          job: S.job,
          money: S.money,
          cur: S.cur,
          desc: `Tuổi ${S.age} · ${esc((JOBS[S.job] && JOBS[S.job].n) || S.job)} · ${wonStr(S.money)}`,
          snap: snapCopy
        });
        if (S.vhtsSnaps.length > 8) S.vhtsSnaps.shift();
      }
    }
  } catch (e) { }
  S.queue = []; S.fT = {};
  if (S.flags.ssWedQ && S.flags.ssWedQ.a < S.age) S.flags.ssWedQ = null;
  if (S.era && S.era !== 'now') eraPlan(); else if (typeof nowPlan === 'function') nowPlan();
  // Vô Hạn Lưu: Future Procedural Scenarios (2025-2100) & Cultural Context (Pillars 4 & 5)
  try {
    const curYear = (S.by || 2024) + S.age;
    const c = C();
    if (curYear >= 2026 && curYear <= 2100 && S.age >= 10 && !S.flags['vhts_fut_' + curYear]) {
      S.flags['vhts_fut_' + curYear] = 1;
      const futEvents = [
        { y: 2026, id: 'agi_breakthrough', t: 'Hệ thống mô hình ngôn ngữ và suy luận tự hành thế hệ mới đạt năng lực giải quyết các bài toán toán học và lập trình cấp chuyên gia.' },
        { y: 2027, id: 'ai_agents', t: 'Làn sóng trợ lý trí tuệ nhân tạo thế hệ mới tự động hóa hàng triệu tác vụ văn phòng, năng suất lao động xã hội tăng vọt.' },
        { y: 2029, id: 'autonomous_fleet', t: 'Xe tự hành cấp độ 4 bắt đầu thay thế xe buýt và taxi truyền thống tại các đô thị phát triển, giảm 70% tai nạn giao thông.' },
        { y: 2030, id: 'green_grid', t: 'Chi phí năng lượng mặt trời và lưu trữ pin giảm kỷ lục, quá trình chuyển đổi năng lượng sạch tăng tốc trên toàn cầu.' },
        { y: 2032, id: 'solid_battery', t: 'Pin thể rắn thương mại hóa diện rộng, xe điện đạt cự ly 1.200 km mỗi lần sạc và sạc đầy trong 10 phút.' },
        { y: 2035, id: 'biotech_crispr', t: 'Liệu pháp gen và công nghệ chỉnh sửa tế bào gốc bước vào ứng dụng lâm sàng đại trà, mở ra hy vọng điều trị triệt để nhiều bệnh nan y.' },
        { y: 2038, id: 'aging_therapy', t: 'Thuốc loại bỏ tế bào lão hóa (senolytics) thử nghiệm thành công, kéo dài tuổi thọ khỏe mạnh của con người thêm 7-10 năm.' },
        { y: 2040, id: 'quantum_leap', t: 'Máy tính lượng tử thương mại hóa đầu tiên giải mã các cấu trúc protein phức tạp, cách mạng hóa ngành dược phẩm sinh học.' },
        { y: 2042, id: 'carbon_capture', t: 'Công nghệ hút trực tiếp carbon từ không khí (DAC) đạt điểm hòa vốn kinh tế, biến carbon thu giữ thành vật liệu xây dựng.' },
        { y: 2045, id: 'fusion_pilot', t: 'Lò phản ứng nhiệt hạch thử nghiệm hòa lưới điện thành công, hứa hẹn nguồn năng lượng vô tận và sạch cho nhân loại.' },
        { y: 2048, id: 'brain_computer', t: 'Giao diện não - máy tính (BCI) không xâm lấn giúp người khiếm thị phục hồi thị giác và người liệt điều khiển thiết bị bằng suy nghĩ.' },
        { y: 2050, id: 'smart_megacity', t: 'Mạng lưới siêu đô thị không phát thải với hệ thống giao thông tự hành ngầm biến chuyển diện mạo cuộc sống hàng ngày.' },
        { y: 2055, id: 'lunar_base', t: 'Trạm nghiên cứu thường trực trên Mặt Trăng đi vào vận hành với nguồn năng lượng mặt trời vùng cực và nước từ băng ngầm.' },
        { y: 2060, id: 'climate_geoeng', t: 'Cộng đồng quốc tế bắt đầu triển khai các dự án công nghệ địa kỹ thuật quy mô lớn nhằm ổn định nhiệt độ khí quyển.' },
        { y: 2065, id: 'mars_outpost', t: 'Đoàn thám hiểm nhân loại đầu tiên thiết lập tiền đồn nghiên cứu bán tự động trên Sao Hỏa.' },
        { y: 2070, id: 'synthetic_ecology', t: 'Rạn san hô nhân tạo sinh học phục hồi 40% diện tích hệ sinh thái biển nhiệt đới sau nhiều thập kỷ suy thoái.' },
        { y: 2075, id: 'deep_ocean_farm', t: 'Nông nghiệp sinh thái biển sâu và đạm sinh học nhân tạo trở thành nguồn cung cấp dinh dưỡng chính thay thế chăn nuôi truyền thống.' },
        { y: 2080, id: 'nanomed_bots', t: 'Robot nano tuần hoàn trong máu phát hiện và tiêu diệt các khối u tiềm ẩn từ cấp độ tế bào đơn lẻ.' },
        { y: 2090, id: 'global_clean_water', t: 'Mạng lưới khử muối biển năng lượng hạt nhân nhỏ (SMR) xóa bỏ vĩnh viễn tình trạng khan hiếm nước ngọt cho 3 tỷ người.' },
        { y: 2099, id: 'centenary_leap', t: 'Kỳ vọng sống trung bình toàn cầu chạm mốc 95 tuổi, nhân loại bước vào thế kỷ 22 với nền tảng khoa học vượt bậc.' }
      ];
      const match = futEvents.find(fe => fe.y === curYear);
      if (match && Math.random() < 0.8) {
        log(match.t, 'ev', 'Dự báo xu thế tương lai World Economic Forum & UN Global Trends');
      }
    }

    // Pillar 5: Cultural Flavor Snippets
    if (S.age >= 6 && S.age <= 75 && Math.random() < 0.08 && !S.flags['vhts_cult_' + S.age]) {
      S.flags['vhts_cult_' + S.age] = 1;
      const cultMap = {
        VNM: [
          'Bạn cùng gia đình sum vầy gói bánh chưng đón Tết Nguyên Đán ấm cúng, gửi gắm ước nguyện một năm mưa thuận gió hòa.',
          'Không khí Tết Trung thu rộn rã phố phường với tiếng trống múa lân rộn rã và ánh đèn ông sao lung linh.',
          'Một bữa cơm chiều giản dị với bát canh rau muống, dưa cà giòn tan gợi nhớ những ký ức tuổi thơ êm đềm.',
          'Tiếng còi tàu và dòng người hối hả về quê đón Tết cuối năm khơi dậy niềm xúc động thiêng liêng về nguồn cội.',
          'Mùa thi cử căng thẳng với những đêm chong đèn học bài bên tách trà sen và sự kỳ vọng âm thầm của cha mẹ.'
        ],
        KOR: [
          'Gia đình tề tựu làm lễ Charye trang nghiêm và cùng thưởng thức bánh Songpyeon nhân vừng trong tiết trời thu Tết Chuseok.',
          'Sĩ tử toàn quốc bước vào kỳ thi đại học Suneung sinh tử, cả đất nước tạm dừng các chuyến bay để giữ yên tĩnh.',
          'Mùa muối kim chi Gimjang đầu đông gắn kết các bà các mẹ cùng nhau chuẩn bị hũ dưa cho cả năm.'
        ],
        CHN: [
          'Đêm Giao thừa cả nhà quây quần gói sủi cảo nóng hổi, tiếng pháo hoa rực sáng góc trời đón chào năm mới cát tường.',
          'Kỳ thi Cao khảo khốc liệt khép lại, mở ra ngã rẽ cuộc đời giữa hàng triệu bạn bè đồng trang lứa.',
          'Tết Đoan Ngọ rộn rã tiếng hò reo đua thuyền rồng trên sông và hương thơm lá dong bánh ú.'
        ],
        JPN: [
          'Mùa hoa anh đào nở rộ khắp các con phố, bạn cùng người thân trải thảm ngắm hoa Hanami dưới tán cây rợp bóng.',
          'Tiếng chuông chùa ngân vang 108 hồi trong đêm trừ tịch xua đi những muộn phiền và ham muốn trần tục của năm cũ.',
          'Lễ hội Obon mùa hè với điệu múa Bon Odori và những ngọn hoa đăng trôi lững lờ trên sông tưởng nhớ tổ tiên.'
        ],
        IND: [
          'Lễ hội ánh sáng Diwali rực rỡ với muôn ngàn ngọn đèn dầu Diyas thắp sáng niềm tin hướng thiện và thịnh vượng.',
          'Sắc màu rực rỡ và tiếng cười rộn rã tràn ngập khắp các ngõ phố trong ngày hội ném bột màu Holi rộn rã.',
          'Tiếng chuông reo và hương thơm gia vị nồng nàn từ gánh trà Masala Chai góc phố đón chào buổi sớm mai.'
        ],
        FRA: [
          'Bạn thong thả thưởng thức ly cà phê sữa và bánh sừng bò giòn tan tại một quán nhỏ ven đường, ngắm nhìn nhịp sống êm ả.',
          'Ngày hội Fête de la Musique đưa âm nhạc tự do rộn rã vang vọng khắp các ngõ ngách quảng trường.',
          'Mùa thu hoạch nho rộn ràng tại các vùng nông thôn với những buổi tiệc nếm thử rượu vang mới ủ.'
        ],
        DEU: [
          'Hội chợ Giáng sinh tràn ngập hương thơm rượu vang nóng Glühwein và bánh gừng nướng giữa làn tuyết trắng đầu mùa.',
          'Lễ hội tháng Mười Oktoberfest rộn rã tiếng nâng ly chúc tụng và các điệu nhạc truyền thống xứ Bavaria.'
        ],
        GBR: [
          'Thói quen thưởng thức tách trà chiều cùng bánh nướng kem bơ giúp bạn tìm thấy khoảng lặng tĩnh tâm giữa bộn bề.',
          'Không khí háo hức bàn luận giải bóng đá Ngoại hạng Anh cùng các đồng nghiệp trong quán rượu ấm cúng sau giờ làm.'
        ],
        USA: [
          'Gia đình quây quần ấm cúng bên bữa tiệc Lễ Tạ Ơn, sẻ chia những điều trân quý và lòng biết ơn đã trải qua suốt một năm.',
          'Đêm quốc khánh ngày 4 tháng 7 rực rỡ màn pháo hoa và những buổi tiệc nướng BBQ ngoài trời rộn rã tiếng cười.'
        ],
        BRA: [
          'Tiếng trống Samba rộn rã và những bộ trang phục lộng lẫy cuồng nhiệt thiêu đốt mọi giác quan trong tuần lễ Carnival.',
          'Trận bóng đá giao hữu trên bãi biển cát trắng lúc hoàng hôn kết nối những người xa lạ thành bạn tri kỷ.'
        ],
        MEX: [
          'Bàn thờ Ofrenda rực rỡ sắc cam hoa cúc vạn thọ và bánh mì ngọt Pan de Muerto đón linh hồn người thân trở về trong Ngày của Người Chết.',
          'Giai điệu rộn ràng của ban nhạc Mariachi cất lên chúc mừng ngày sinh nhật ấm cúng của người thân.'
        ],
        EGY: [
          'Tiếng loa cầu nguyện vang vọng từ ngàn ngôi đền Hồi giáo giữa hoàng hôn sông Nile huyền bí.',
          'Bữa tiệc Iftar xua tan cơn khát sau ngày dài nhịn ăn tháng Ramadan, người người sẻ chia thức ăn cho người nghèo khó.'
        ],
        NGA: [
          'Đám cưới truyền thống rực rỡ sắc màu trang phục Aso Ebi và tiếng trống talking drum tưng bừng suốt đêm.',
          'Mùi hương gạo rang và nước sốt cay nồng của món cơm Jollof thơm lừng trong ngày họp mặt gia đình.'
        ],
        IDN: [
          'Lễ hội Galungan rộn rã với những cây nêu Penjor uốn lượn trước cửa nhà đón chào các vị thần bảo trợ.',
          'Bữa cơm gia đình ấm cúng với món cơm chiên Nasi Goreng và tương ớt Sambal cay nồng đậm đà vị đảo.'
        ],
        THA: [
          'Lễ hội té nước Songkran tưng bừng khắp các ngả đường, người người trao nhau làn nước mát lành chúc phúc năm mới.',
          'Hàng ngàn chiếc đèn trời lung linh trôi dần vào bầu trời đêm rực rỡ trong lễ hội Yi Peng kỳ ảo.'
        ]
      };
      const list = cultMap[c.id] || (c.p === 'ssa' ? ['Cộng đồng làng rộn rã tiếng trống truyền thống và những điệu múa gắn kết tình làng nghĩa xóm trong ngày mùa.'] : c.p === 'lac' ? ['Lễ hội âm nhạc đường phố tưng bừng với giai điệu rộn rã, người người cùng hòa mình vào vũ điệu nồng nhiệt.'] : null);
      if (list && list.length) {
        const item = list[Math.floor(Math.random() * list.length)];
        log(item, 'note');
      }
    }
  } catch (e) { reportCaught(e); }
  ensureFocus();
  auYear();
  const decs = scheduledDecisions();
  const n = S.age < 1 ? 2 : (S.age < 6 ? 2 : 3);
  let ts = [];
  for (let i = 0; i < n; i++) ts.push(0.08 + (i + rnd() * 0.8) / n * 0.86);
  const used = new Set();
  for (const at of ts) {
    const ev = chooseFeed(used); if (ev) { used.add(ev); queue(at, 'ev', ev); }
  }
  decs.slice(0, 2).forEach((d, i) => queue(d.p && d.p.qat != null ? d.p.qat : 0.3 + i * 0.3 + rnd() * 0.15, 'dec', d.id, d.p));
  if (decs.slice(2).some(d => d.p && d.p.hunt)) S.flags.huntAt = S.age - 1;
  if (decs.slice(2).some(d => d.id === 'biz' && d.p && d.p.plan)) S.flags.bizPlanAt = S.age - 1;
  if (decs.slice(2).some(d => d.id === 'dreamtry')) S.flags.dreamAt = S.age - 1;
  if (decs.slice(2).some(d => d.p && d.p.look)) { if (decs.slice(2).some(d => d.id === 'homecoming' && d.p.look)) S.flags.homeLookAt = S.age - 1; if (decs.slice(2).some(d => d.id === 'abroad' && d.p.look)) S.flags.abLookAt = S.age - 1; }
  if (decs.slice(2).some(d => d.p && d.p.talk && !d.p.w2)) S.flags.kidTalkAt = S.age - 1;
  if (decs.slice(2).some(d => d.p && d.p.talk && d.p.w2)) S.flags.w2TalkAt = S.age - 1;
  { const mp = decs.slice(2).find(d => d.id === 'partner' && d.p && d.p.meet);
    if (mp && mp.p.mxn && S.flags.mx) { S.flags.mx.left++; S.flags.mx.next = S.age + 1; } else if (mp && !mp.p.mxn) { S.flags.meetAt = S.age; S.flags.meetK = mp.p.k || null; } }
  const rp = decs.slice(2).find(d => d.p && d.p.prep && RUN_DEC[S.flags.runLv] === d.id); if (rp) { S.flags.runAt = S.age - 1; S.flags.runNom = 1; }
  if (MILESTONE_AGES.includes(S.age)) queue(0.03, 'ms', 'survive');
  if (S.adopt && S.adopt.mv == null && S.age >= (S.adopt.at || 0)) queue(0.02, 'ad', 'move');
}
const MILESTONE_AGES = [1, 5, 15, 30, 50, 65, 80, 90, 100];
function tick(dtSec) {
  if (!S || S.phase !== 'life' || S.pending || S.paused) return;
  const dt = dtSec * S.speed / S.yearSec;
  if (S.focus) S.fT[S.focus] = (S.fT[S.focus] || 0) + dt;
  const nt = S.t + dt;
  while (S.queue.length && S.queue[0].at <= nt) {
    const e = S.queue.shift();
    S.t = e.at;
    fire(e);
    if (S.pending || S.phase !== 'life') return;
  }
  S.t = Math.min(nt, 1);
  if (S.t >= 1) endYear();
}
function fire(e) {
  ACT_EV = null;
  try {
    if (e.type === 'ev') { const ev = EVMAP[e.id]; if (ev && (!ev.c || ev.c()) && evFits(ev)) { const n0 = netWorth(); fxStart(); ACT_EV = e.id; ACT_NEXT = null; NF_ON = NF_IDS.has(e.id); const r = ev.run(); bookSince(n0, EV_BOOK[e.id === 'expense' ? 'exp_' + S.flags.expK : e.id] || "Khoản khác"); if (r) { if (typeof r === 'string') log(r); else { log(r.t, r.k || 'ev', r.f); if (r.k === 'loss') S.log[S.log.length - 1].ev = e.id; } } ACT_EV = null; NF_ON = false; fxEnd(); S.flags['ev_' + e.id] = S.age; S.recent.push(e.id); if (S.recent.length > 14) S.recent.shift(); } }
    else if (e.type === 'ms') milestone();
    else if (e.type === 'ad') adoptMove();
    else if (e.type === 'hist') { fxStart(); eraFire(e.id); fxEnd(); }
    else if (e.type === 'dec') openDecision(e.id, e.p);
  } catch (err) { NF_ON = false; HOOK.err(err); }
}
const STUDY_SKIP = new Set(['neighbor', 'gpcall', 'gpvisit', 'parentfight', 'chores', 'redevelop', 'prkwork', 'heat', 'w_song', 'w_rain', 'w_stars']);
const SERVICE_SKIP = new Set([...STUDY_SKIP, 'expense', 'theft', 'w_share', 'w_teach', 'volunteer', 'pet', 'w_table', 'w_harvest', 'w_neighborkid', 'w_help', 'kc_outing', 'gk_mind']);
const FAR_SKIP = new Set(['parentill', 'gpvisit', 'gpcall', 'sibling', 'w_voice', 'w_dish', 'w_firstpay', 'w_sib', 'parentfight', 'hithome', 'chores']);
const HIDE_SKIP = new Set([...STUDY_SKIP, ...FAR_SKIP, 'reunion', 'wedding', 'crush']);
const PR_CRIME = new Set(['pr_visit', 'pr_novisit', 'pr_school']);
const evFits = ev => (S.job === 'prison') === !!ev.prison && (!ev.prison || (ev.prison === 'nk') === !!S.flags.nkCamp) && !(S.flags.polPr && PR_CRIME.has(ev.id))
  && !(studyAway() && STUDY_SKIP.has(ev.id)) && !(S.flags.hideCN && HIDE_SKIP.has(ev.id)) && !(S.flags.defector && S.cur !== 'PRK' && FAR_SKIP.has(ev.id))
  && !(S.serveLeft > 0 && SERVICE_SKIP.has(ev.id)) && !(S.dis && DIS_SKIP[S.dis.k].has(ev.id)) && !(S.dd && ddSkip(ev.id));
function chooseFeed(used) {
  const w = {};
  for (const ev of EVENTS) {
    if (S.age < ev.a[0] || S.age > ev.a[1] || used.has(ev.id)) continue;
    if (!evFits(ev)) continue;
    if (ev.c && !ev.c()) continue;
    if (ev.gap && S.flags['ev_' + ev.id] != null && S.age - S.flags['ev_' + ev.id] < ev.gap) continue;
    let wt = typeof ev.w === 'function' ? ev.w() : (ev.w || 1);
    if (ev.dark) wt *= 1 + 0.5 * HARD_LV();
    if (S.recent.includes(ev.id)) wt *= ev.rep ? 0.5 : 0.08;
    if (wt > 0) w[ev.id] = wt;
  }
  if (!Object.keys(w).length) return null;
  return wpick(w);
}
function milestone() {
  const l = LT().l[S.age];
  const sx = transLived() ? "người cùng lứa" : S.sex === 'F' ? "bé gái" : "bé trai";
  if (S.age === 5) log(L`다섯 번째 생일. ${B().ko}에서 태어난 아이 ${u5Pct()} 정도는 5살이 되기 전에 세상을 떠납니다. 당신은 그 시기를 넘겼습니다.`, 'ms');
  else { const sv = cohortL(S.born, S.sex, S.age); log(sv >= 0.995 ? L`${S.age}세. 같은 해 ${B().ko}에서 태어난 ${sx} 거의 모두가 지금도 살아 있습니다.` : sv < 0.0005 ? L`${S.age}세. 같은 해 ${B().ko}에서 태어난 ${sx} 가운데 지금도 살아 있는 사람은 천 명에 한 명도 되지 않습니다.` : L`${S.age}세. 같은 해 ${B().ko}에서 태어난 ${sx} 중 약 ${pctStr(sv, sv < 0.01 ? 1 : 0)}가 지금도 살아 있습니다.`, 'ms'); }
}
const VN_DEP = { USA: [1965, 1972, 0.24, 0.022, () => "Khoảng 2,7 triệu quân Mỹ đã tham chiến ở Việt Nam và khoảng 58.000 người thiệt mạng (Bộ Cựu chiến binh Hoa Kỳ, Cục Lưu trữ Quốc gia Hoa Kỳ)"],
  KOR: [1964, 1973, 0.045, 0.016, () => "Năm 1964-1973, khoảng 320.000 quân Hàn Quốc được đưa sang Việt Nam và khoảng 5.000 người tử trận (Bộ Quốc phòng Hàn Quốc)"],
  AUS: [1965, 1972, 0.13, 0.009, () => "Khoảng 60.000 quân Úc đã tham chiến ở Việt Nam và 523 người thiệt mạng (Đài tưởng niệm Chiến tranh Úc)"] };
function vnYear(a) {
  const v = VN_DEP[S.cur], y = calYr();
  if (!v || S.sex !== 'M' || S.flags.vnDep != null || a < 18 || y < v[0] || y > v[1] || !(S.serveLeft > 0 || S.job === 'soldier') || !chance(v[2])) return;
  S.flags.vnDep = S.age;
  if (chance(v[3])) { log("Bạn được đưa sang Việt Nam.", 'bad', v[4]()); die('war', "Chiến tranh Việt Nam"); return; }
  eff({ h: -4, hl: -2 }); log("Bạn được đưa sang Việt Nam và ở đó một năm. Bạn trở về nhà bình an.", 'bad', v[4]());
}
const LIC_RET = { JPN: [1998, 0.015, 0.042, () => "Năm 2022 ở Nhật Bản có khoảng 448.000 người tự nộp lại bằng lái, khoảng sáu phần mười trong số đó từ 75 tuổi trở lên (Cơ quan Cảnh sát Quốc gia Nhật Bản)"],
  KOR: [2019, 0.012, 0.055, () => "Năm 2023, khoảng 113.000 trong số 4,75 triệu tài xế từ 65 tuổi trở lên ở Hàn Quốc (2,4%) đã tự nộp lại bằng lái (Cơ quan Cảnh sát Quốc gia Hàn Quốc)"] };
function endYear() {
  ACT_EV = ACT_DEC = ACT_NEXT = null;
  const c = C(), a = S.age, st = S.st;
  if (S.refugee) S.flags.refEver = 1;
  let tot = 0; for (const k in S.fT) tot += S.fT[k];
  if (tot > 0) for (const k in S.fT) { const f = FOCUS[k], w = S.fT[k] / tot; for (const s in f.e) if (s !== 'sm') st[s] = clamp(st[s] + f.e[s] * w * (k === 'health' && s === 'hl' ? fitK(S.age) : 1), 0, 100); if (k === 'hobby' && S.hobbies[0]) S.hobbies[0].lv += 1.2 * w * talK(S.hobbies[0].id); if (k === 'sport') { const sh = S.hobbies.find(isSportH); if (sh) sh.lv += 1.2 * w * talK(sh.id); } }
  S.focusW = tot > 0 ? Object.fromEntries(Object.entries(S.fT).map(([k, v]) => [k, v / tot])) : {};
  if (a >= 18 && tot > 0) { const fY = S.stats.fY || (S.stats.fY = {}); if (S.stats.fYa == null) S.stats.fYa = a; for (const k in S.focusW) fY[k] = Math.round(((fY[k] || 0) + S.focusW[k]) * 100) / 100; }
  if (S.focusW.career) S.flags.prep = Math.min(2, (S.flags.prep || 0) + S.focusW.career);
  else if (S.flags.prep && isWorking()) S.flags.prep = 0;
  for (const hb of S.hobbies) { const H = hobDef(hb.id); st.h = clamp(st.h + H.h * 0.35, 0, 100); st.hl = clamp(st.hl + H.hl * 0.3, 0, 100); st.so = clamp(st.so + H.so * 0.3, 0, 100); hb.lv += 0.35 * talK(hb.id) + (ARTS_JOB_H[S.job] === hb.id ? 0.5 : 0); }
  knowYear(a, S.focusW);
  schoolYear();
  finances();
  const eh = expHealth(a + 1);
  const hlMoney = (debtHeavy() ? 2 : 0) + WANT_HL * (S.flags.want || 0);
  let hTarget = eh + bikeFit() + dietFit() + (tmprK() === 'act' ? 1.5 : 0) + (S.flags.lessAt != null && isWorking() ? 1.5 : 0) + (S.q - 3) * 1.5 - (S.smoker ? 6 : 0) - Object.keys(S.conds).length * 5 - (S.refugee ? 6 : 0) + (S.focusW.health || 0) * 6 * fitK(a) - hlMoney - (S.flags.tbUn != null ? 10 : 0);
  st.hl = clamp(st.hl + (hTarget - st.hl) * 0.25, 1, 100);
  if (hlMoney || S.flags.hlM) { const m0 = S.flags.hlM || 0, m1 = m0 + (hlMoney - m0) * 0.25; S.flags.hlM = !hlMoney && m1 < 0.05 ? 0 : m1; }
  const kidsAlive = S.fam.kids.filter(k => k.alive).length;
  if (S.fam.married && S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced) S.stats.pY = (S.stats.pY || 0) + 1;
  let soTarget = 45 + (S.fam.partner && S.fam.partner.alive && S.fam.married ? 12 : 0) + Math.min(15, kidsAlive * 4) + (S.fam.mom.alive ? 3 : 0) + (S.mig ? -6 : 0) + (S.hobbies.length ? 3 : 0) + (a >= 6 ? 1.5 * tal('wd') : 0) + (a >= 6 && tmprK() === 'warm' ? 2 : 0);
  const ak = clamp((a - 14) / 6, 0, 1);
  { const t = soTarget - SO_K * ak; st.so = clamp(st.so + (t - st.so) * (st.so > t ? 0.12 + (SO_UP - 0.12) * ak : 0.12), 0, 100); }
  const relInc = S.age >= 18 && !S.school ? (S.pct - 0.5) * 18 : (S.q - 3) * 3;
  const jobDream = isWorking() && (S.job === S.flags.kidDream || S.job === S.flags.dreamGot) ? 3 : 0;
  let hpTarget = happyBase() + relInc + jobDream + (S.flags.diet === 'out' && a >= 18 ? 1 : 0) + (st.so - 50) * 0.25 + (st.hl - eh) * 0.2 - (debtHeavy() ? 6 : S.money < 0 ? 1 : 0) - (S.refugee ? 10 : 0) - mindK() - wdK() - placedK();
  { const t = hpTarget - H_K * ak; st.h = clamp(st.h + (t - st.h) * (0.22 + ((st.h > t ? H_UP : H_DN) - 0.22) * ak), 0, 100); }
  familyYear();
  if (S.phase !== 'life') return;
  petYear();
  ACT_FN = () => 'play'; tmprYear(a); ACT_FN = null;
  talYear(a);
  orientYear(a);
  transYear(a, c);
  phoneYear(c);
  checkAutoYear();
  tutorAutoYear();
  lessonYear(a);
  if (typeof griefYear === 'function') griefYear(a);
  if (typeof kidMemYear === 'function') kidMemYear(a);
  if (typeof oldJoyYear === 'function') oldJoyYear(a);
  if (S.td && typeof tdYear === 'function') tdYear(a);
  faithYear(a);
  courseAutoYear();
  huntAutoYear();
  shopAutoYear();
  lottoYear();
  hivYear();
  tbYear();
  if (S.phase !== 'life') return;
  darkYear();
  mindYear();
  copeYear(a);
  disYear();
  sickYear(a, c);
  regYear(a); litYear(a); hlYear(a, c); migxYear(a, c);
  drugYear(a, c); svYear(a, c);
  ddYear(a);
  harassYear(c, a); wdYear(c, a);
  ndYear(a);
  if (S.phase !== 'life') return;
  royalYear();
  affairYear();
  hschYear(a);
  kinYear(a);
  adoptYear(a);
  fcYear(a);
  rohYear(a);
  if (S.phase !== 'life') return;
  lawYear(a);
  famFortuneYear(a);
  if (S.phase !== 'life') return;
  learnTongues();
  irregYear(S.age);
  famWaitYear(S.age); parPlanYear(S.age);
  defectYear();
  southYear(a);
  if (S.phase !== 'life') return;
  soldierWarYear(a, C());
  mobYear(a, C());
  if (S.phase !== 'life') return;
  ncoYear(a);
  ACT_FN = actRare; rareYear(); ACT_FN = null;
  if (S.phase !== 'life') return;
  eggYear(a);
  if (S.phase !== 'life') return;
  if (isWorking()) S.flags.lastJob = S.job;
  if (S.comps && !S.isComp) for (const cp of S.comps) if (cp.death.age === a && !cp.told) { cp.told = 1; log(L`같은 1초에 태어난 ${CBY[cp.iso].ko}의 ${iga(callName(cp.name))} ${a}세에 세상을 떠났습니다. (${cp.death.label})`, 'comp', cp.death.cause === 'suic' ? SUIC_HELP() : undefined); }
  const fl = closeBooks();
  { const bad = healStats(S); if (bad.length) HOOK.err(new Error('measure not a number: ' + bad.join(','))); }
  S.years.push({ a, h: Math.round(st.h), hl: Math.round(st.hl), so: Math.round(st.so), sm: Math.round(st.sm), nw: Math.round(netWorth()), inc: Math.round(S.income), mk: S.yearMark || null, cur: studyWhere() || S.cur, fl });
  if (!S.isComp) { const y = S.years[S.years.length - 1], w = yearWork(), v = S.age < 15 ? '' : S.money < 0 ? (S.house > 0 ? 'loan' : 'debt') : S.money > 0 ? (S.invest || 'cash') : '';
    if (w !== (S.flags.lastW || '')) { y.w = w; S.flags.lastW = w; }
    if (v !== (S.flags.lastV || '')) { y.v = v; S.flags.lastV = v; } }
  if (typeof sceneSnap === 'function' && !S.isComp) { try { const sc = sceneSnap(); if (sc !== S.flags.lastSc) { S.years[S.years.length - 1].sc = sc; S.flags.lastSc = sc; } } catch (e) { } }
  S.yearMark = null;
  if (S.flags.termIll) { if (termYear()) return; }
  else if (chance(deathProb())) {
    const dc = studyAway() && CBY[studyAway()] ? CBY[studyAway()] : C(), k = pickCause(dc, S.age, S.sex);
    if (k === 'can' && !S.isComp && scrSave(dc)) canSvStart(dc, S.age, 1);
    else if (TERM_P[k] && S.age >= 30 && !S.isComp && (k === 'dem' || chance(TERM_FOUND))) termStart(k, dc); else { die(k); return; }
  }
  if (S.refugee && S.refugeeUntil && S.age >= S.refugeeUntil) { S.refugee = false; log(S.mig ? "Bạn đã khép lại cuộc sống tị nạn và ổn định cuộc sống ở nơi mới." : "Bạn trở về quê hương và bắt đầu dựng lại cuộc sống.", 'big'); }
  vnYear(a); if (S.phase !== 'life') return;
  if (S.serveLeft > 0) { S.serveLeft = Math.max(0, S.serveLeft - 1); if (S.serveLeft === 0 && S.flags.mob && S.flags.mob.back == null) mobBack(); else if (S.serveLeft === 0) { S.served = true; S.job = 'seeking'; logA('mil:out', svcOutLine(), 'big');
    if (S.flags.uniLeave != null) { S.school = 'uni'; S.schoolY = S.flags.uniLeave; S.flags.uniLeave = null; S.job = 'student'; log("Bạn đã quay lại trường đại học sau thời gian bảo lưu.", 'ev'); }
    else if (S.idol && !S.idol.end) idolBack(); else if (S.ath && S.ath.svc) athBack(); else if (S.flags.boardPro && S.flags.boardPro.svc != null) boardBack(); else if (S.flags.gamer && S.flags.gamer.svc && !S.flags.gamer.after) S.flags.gameEndQ = 1; } }
  S.age++; S.t = 0;
  // Cultivation Lifespan & Vitality Shield
  const cultAgeLimit = 122 + (S.cultivation ? (S.cultivation.maxAgeBonus || 0) : 0);
  if (S.cultivation && S.cultivation.stage >= 1) {
    S.st.hl = Math.min(100, S.st.hl + 2); // Cultivation passively replenishes vitality
  }
  if (S.age >= cultAgeLimit) { die('ocd', S.cultivation && S.cultivation.stage >= 3 ? 'Vũ Hóa Đăng Tiên (Hết Thọ Nguyên)' : undefined); return; }
  if (S.flags.gradDue) { S.flags.gradDue = 0; graduate(); }
  planYear();
  HOOK.year();
}