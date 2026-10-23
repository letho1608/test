// js/decisions.js - Bang quyet dinh (DEC)
const DEC = {
  hd_hardwork: {
    build: () => {
      if (!isWorking() || S.flags.hdHard) return null;
      return { title: "Sếp gọi bạn lại: thêm ca, thêm lương, thêm hai tiếng mỗi ngày.",
        body: ["Bạn cần tiền. Bạn cũng cần sức khỏe. Cả hai không thể có cùng lúc — nhưng sếp không quan tâm điều đó."],
        fact: "WHO ước tính khoảng 55 triệu ca tử vong mỗi năm liên quan đến lao động và tai nạn nghề nghiệp",
        choices: [{ k: 'yes', label: "Nhận ca thêm", sub: "Tiền nhiều hơn, sức khỏe mất đi" }, { k: 'no', label: "Từ chối", sub: "Giữ sức khỏe, giữ mức lương cũ" }] };
    },
    apply: k => { S.flags.hdHard = 1; if (k === 'yes') { eff({ h: -7, hl: -5, money: 0.07 }); log("Bạn nhận ca thêm. Tháng đầu còn được, tháng sau bạn nhìn đồng hồ và không muốn dậy.", 'ev'); } else { eff({ hl: 3, so: 2 }); log("Bạn từ chối. Sếp gật đầu và nói: vậy thì cẩn thận hơn đấy.", 'ev'); } } },
  hd_school: {
    build: () => {
      if (S.flags.hdSchool || !S.school || (S.school !== 'high' && S.school !== 'uni')) return null;
      return { title: "Có chỗ thực tập trả lương, và một khóa học nâng cao không trả lương.",
        body: ["Bạn phải chọn một con đường. Con đường nào cũng dài, nhưng chỉ một con đường dẫn về cùng một chỗ."],
        fact: "Theo UNESCO, khoảng 30% thanh niên không đọc được một đoạn văn đơn giản",
        choices: [{ k: 'work', label: "Đi thực tập có lương", sub: "Có tiền hôm nay" }, { k: 'study', label: "Học tiếp", sub: "Nợ có thể chờ, kiến thức thì không" }] };
    },
    apply: k => { S.flags.hdSchool = 1; if (k === 'work') { eff({ sm: 2, money: 0.04, hl: -2 }); log("Bạn đi thực tập có lương và học được nghề thật, nhưng bằng chứng chỉ còn một tờ giấy.", 'ev'); } else { eff({ sm: 6, money: -0.03, hl: 3 }); log("Bạn học tiếp. Sáu năm nữa, bạn sẽ có một cái gì đó không thể mất đi.", 'ev'); } } },
  hd_migrate: {
    build: () => {
      if (S.flags.hdMig || S.refugee) return null;
      return { title: "Cơ hội ở một nước khác. Giấy tờ của bạn không sang được đâu cả.",
        body: ["Ở đây bạn biết ai, và biết mình thuộc về đâu. Ở kia bạn không biết gì cả, trừ việc lương cao hơn."],
        fact: "Khoảng 280 triệu người đang sống ở nước ngoài so với nơi họ sinh ra (UNHCR)",
        choices: [{ k: 'go', label: "Đi", sub: "Bắt đầu lại từ đầu, ở nơi không ai biết tên bạn" }, { k: 'stay', label: "Ở lại", sub: "Giữ những gì bạn đã có" }] };
    },
    apply: k => { S.flags.hdMig = 1; if (k === 'go') { eff({ money: 0.08, hl: -10, so: -8, sm: 2 }); log("Bạn đi. Năm đầu ở nơi mới, không ai biết bạn từng là ai.", 'ev'); } else { eff({ hl: 3, so: 3 }); log("Bạn Ở lại. Vài năm sau, bạn tự hỏi lần nữa.", 'ev'); } } },
  hd_care: {
    build: () => {
      if (S.flags.hdCare) return null;
      const old = (S.fam.mom.alive && S.fam.mom.age > 75) || (S.fam.dad.alive && S.fam.dad.age > 75);
      if (!old) return null;
      return { title: "Bạn có thể đưa cha mẹ về ở, hoặc thuê người chăm sóc, hoặc để họ tự lo.",
        body: ["Cả ba cách đều tốn tiền. Chỉ có một cách không tốn tiền."],
        fact: "Khoảng 60% người cao tuổi sống ở nước ngoài sống cùng con cái (UN DESA)",
        choices: [{ k: 'home', label: "Đưa về nhà", sub: "Tốn thời gian, mệt, nhưng gần" }, { k: 'hire', label: "Thuê người chăm", sub: "Tốn tiền, nhưng bạn vẫn làm việc được" }, { k: 'none', label: "Để họ tự lo", sub: "Rẻ nhất. Bạn sẽ nghĩ về nó mỗi ngày" }] };
    },
    apply: k => { S.flags.hdCare = 1; if (k === 'home') { eff({ hl: 5, money: -0.05, h: -4 }); log("Bạn đưa cha mẹ về nhà. Nhà nhỏ hơn, nhưng có tiếng cười của trẻ nữa.", 'ev'); } else if (k === 'hire') { eff({ hl: -2, money: -0.08 }); log("Bạn thuê người chăm. Bạn đi làm, và mỗi tháng nhận một hóa đơn.", 'ev'); } else { eff({ hl: -12, so: -5 }); log("Bạn để họ tự lo. Câu đầu tiên bạn nói mỗi lần gọi điện là: 'Con bận lắm'.", 'bad'); } } },
  hd_dark: {
    build: () => {
      if (!S.curse || S.flags.hdDark) return null;
      return { title: "Có thứ gì đó hỏi bạn muốn xem. Không cần trả tiền, không cần dấu tên, chỉ cần bạn nhìn.",
        body: ["Nhìn một lần thôi. Bạn tự nhủ vậy, và đó là lý do bạn sẽ nhìn."],
        fact: "Hiện tượng 'kẻ xấu mắt' (evil gaze) được ghi nhận ở nhiều nền văn hóa, từ thời Trung Đông đến Việt Nam và Ba Lan",
        choices: [{ k: 'look', label: "Nhìn", sub: "Bạn sẽ không quên được thứ vừa thấy" }, { k: 'away', label: "Quay đi", sub: "Có thứ gì đó sẽ nhớ mặt bạn" }] };
    },
    apply: k => { S.flags.hdDark = 1; if (k === 'look') { eff({ hl: -10, h: -5, sm: 3 }); log("Bạn nhìn. Nó không có mặt, nhưng có tiếng thở của bạn trả lại.", 'bad'); } else { eff({ hl: -6, so: -3 }); log("Bạn quay đi. Nhưng từ đó, mỗi lần có ai đó đứng sau lưng, bạn đều ngoái lại.", 'bad'); } } },
  hd_ritual: {
    build: () => {
      if (S.flags.hdRitual || !S.rel || 'IBH'.indexOf(S.rel) < 0) return null;
      return { title: "Nhà thầy nhắc: năm nay phải làm lễ, nếu không thì nhà sẽ xấu.",
        body: ["Lễ tốn kém gần hết khoản tiền dành dành. Bỏ qua thì đồng nào cũng biết, và nhà thầy sẽ nhắc lại."],
        fact: "Chi tiêu tôn giáo ở nhiều nước chiếm khoảng 5–10% thu nhập hộ gia đình (Pew)",
        choices: [{ k: 'do', label: "Làm lễ", sub: "Mất tiền, giữ được nhà" }, { k: 'no', label: "Bỏ qua", sub: "Giữ được tiền, mất nhà" }] };
    },
    apply: k => { S.flags.hdRitual = 1; if (k === 'do') { eff({ money: -0.07, hl: 6, so: 3 }); log("Bạn làm lễ. Nhà thầy nói: năm sau cũng vậy nha.", 'ev'); } else { eff({ money: 0.03, hl: -8, so: -5 }); log("Bạn bỏ qua. Mùa sau, người ta không nhìn mặt bạn nữa.", 'bad'); } } },
  hd_last: {
    build: () => {
      if (S.flags.hdLast || S.age < 55) return null;
      return { title: "Bác sĩ hỏi bạn muốn xử lý thế nào nếu ngày nào đó mọi việc không còn khả năng.",
        body: ["Có những người trì hoãn câu trả lời cho tới khi không còn kịp trả lời."],
        fact: "Khoảng 70% người bệnh muốn được hỏi về việc chăm sóc cuối đời, nhưng chỉ khoảng 40% thực sự được hỏi (WHO)",
        choices: [{ k: 'write', label: "Viết ra, sớm", sub: "Gia đình biết trước, dù đau đớn" }, { k: 'later', label: "Để sau", sub: "Chuyện gì cũng có thể đợi được" }] };
    },
    apply: k => { S.flags.hdLast = 1; if (k === 'write') { eff({ hl: 6, so: 3, sm: 2 }); log("Bạn viết ra, và đặt trong ngăn kéo. Chiếc ngăn kéo đó sau này sẽ được mở.", 'ev'); } else { eff({ hl: -6, so: -2 }); log("Bạn nói: để sau. Rồi bạn không nói nữa.", 'ev'); } } },
  hd_child_fut: {
    build: () => {
      if (S.flags.hdFut || !S.fam.kids || !S.fam.kids.length) return null;
      return { title: "Con bạn hỏi bạn muốn nó sống như thế nào.",
        body: ["Bạn đã sống như thế này để nó có được thứ bạn không có. Nhưng nó đang sống như thế này vì bạn sống."],
        fact: "Theo các nghiên cứu dài hạn, mức thu nhập của trẻ em phụ thuộc mạnh vào thu nhập của cha mẹ",
        choices: [{ k: 'better', label: "Cho con một đời dễ hơn", sub: "Bạn sẽ phá vỡ một thứ gì đó" }, { k: 'same', label: "Để nó tự quyết", sub: "Chúng ta không giống nhau ở nhiều chỗ" }] };
    },
    apply: k => { S.flags.hdFut = 1; if (k === 'better') { eff({ money: -0.08, hl: 6, so: 3 }); log("Bạn dành cho con một đời dễ hơn đời bạn. Bạn hy vọng nó không hỏi vì sao.", 'ev'); } else { eff({ hl: -3, so: 2 }); log("Bạn nói: tùy con. Con gật đầu, và cả hai đều biết là lời nói dối.", 'ev'); } } },

  temper: {
    build: () => { const mv = !!(S.dis && S.dis.k === 'move'), sg = !!(S.dis && S.dis.k === 'sight');
      const nm = callName(S.name);
      return { title: "Hai tuổi, thế giới bên ngoài lạ lẫm", body: [mv ? L`${eun(nm)} 바깥에 나가는 것을 무척 좋아합니다.` : L`${eun(nm)} 이제 제법 걷습니다.`,
        mv ? "Được cả nhà bế ra ngoài, đứa bé sẽ làm gì trước tiên?" : sg ? "Bên ngoài đầy những âm thanh, mùi hương lần đầu được biết, đứa bé sẽ làm gì trước tiên?" : "Bên ngoài, nơi mọi thứ đều mới lạ, đứa bé sẽ làm gì trước tiên?",
        "Lựa chọn của bạn khiến tính khí của bé nghiêng về phía đó; những khoảnh khắc như thế cộng dồn lại, và tính khí dần định hình vào khoảng năm tuổi."].join(' '),
      fact: "Tính khí được tạo nên từ cả phần bẩm sinh lẫn những gì trải qua khi lớn lên. Tổng hợp các nghiên cứu về trẻ sinh đôi, khoảng 40% khác biệt về tính cách được giải thích bởi di truyền (Vukasović & Bratko 2015)",
      choices: [{ k: 'cur', label: sg ? "Mân mê đất và sỏi thật lâu" : "Chăm chú nhìn đất và sỏi thật lâu", sub: '' }, { k: 'act', label: mv ? "Dồn hết sức vươn người về phía có tiếng động" : "Chạy ào đi hết sức", sub: '' },
        { k: 'warm', label: mv ? "Chìa tay về phía đứa trẻ đang khóc" : "Lại gần đứa trẻ đang khóc", sub: '' }, { k: 'grit', label: mv ? "Dù không với tới vẫn vươn tay hết lần này đến lần khác" : "Ngã rồi tự đứng dậy, lại bước tiếp", sub: '' }] }; },
    apply: k => { if (S.trait) return; const f = S.flags.tmp || (S.flags.tmp = {}); f[k] = (f[k] || 0) + 1; f.pick = k; }
  },
  noschool: {
    build: () => ({ title: "Con muốn được đi học", body: S.dis && S.dis.k === 'move' ? "Vài đứa trẻ cùng tuổi được đi học. Bạn ở nhà giúp đỡ gia đình." : "Vài đứa trẻ cùng tuổi được đi học. Bạn phụ việc đồng áng và đi lấy nước.", fact: L`${B().ko}의 기대 교육연수: ${B().eys}년 (UNDP HDR 2022)`,
      choices: [{ k: 'beg', label: "Nài nỉ được cho đi học", sub: "Thành hay không tùy vào hoàn cảnh gia đình" }, { k: 'help', label: "Giúp đỡ gia đình", sub: "Quan hệ +4" }] }),
    apply: k => {
      if (k === 'help') { eff({ so: 4 }); return "Bạn ở lại bên gia đình thay vì đi học."; }
      if (chance(0.25 + 0.1 * S.q + S.st.so / 400)) { S.school = 'prim'; S.schoolY = 0; S.job = 'student'; S.flags.pushSchool = 1; S.yearMark = 'edu';
        if (S.flags.noReg) return { t: L`${iga(carerW())} 허락했습니다.`, k: 'big', post: () => { regSchool(); logA('school', "Tuy muộn một chút, bạn đã được vào tiểu học!", 'big'); } };
        return L`${iga(carerW())} 허락했습니다. 늦게나마 초등학교에 입학했습니다!`; }
      eff({ h: -5 }); return { t: S.q >= 4 ? outWhy('start') : "Vì học phí và vì gia đình cần người phụ giúp, rốt cuộc bạn chưa từng được đến trường.", k: 'bad' };
    }
  },
  school2: {
    ok: () => true,
    build: () => {
      if (rohCamp()) {
        if (calYr() >= 2021 && chance(0.5)) { S.school = 'lsec'; S.schoolY = 0; S.job = 'student'; log("Ở trung tâm học tập, bạn được lên các lớp trung học theo chương trình của Myanmar.", 'ev', ROH_F.edu); return null; }
        toChildwork(); log(calYr() >= 2021 ? "Các lớp trung học không đủ chỗ nên bạn đã rời trung tâm học tập." : "Trung tâm học tập không có lớp nào cao hơn. Việc học của bạn dừng lại ở đó.", 'bad', ROH_F.edu); return null;
      }
      const pr = eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1);
      const B0 = B(); if (!pr.ban && (B0.p === 'hi' || B0.p === 'eca' || pr.t2 > 0.985 || (pr.t2 > 0.97 && S.q >= 2))) { S.school = 'lsec'; S.schoolY = 0; S.job = 'student'; log("Bạn đã lên trung học cơ sở.", 'big'); regNext(); return null; }
      if (!pr.ban && LSEC_FREE[C().id] && calYr() >= LSEC_FREE[C().id]) { S.school = 'lsec'; S.schoolY = 0; S.job = 'student'; S.flags.lsKeep = clamp(odds(Math.max(pr.t2, 0.1), effortOdds(1.15)), 0.05, 1); log("Bạn đã lên trung học cơ sở.", 'big'); regNext(); return null; }
      if (pr.ban) return { title: "Lên trung học cơ sở", body: "Nữ sinh bị cấm học bậc trung học nên bạn không thể vào trung học cơ sở.", fact: "Từ năm 2021, Afghanistan cấm nữ sinh đi học sau lớp 6 (UNESCO)", choices: [{ k: 'home', label: "Lén tiếp tục tự học ở nhà", sub: "Kiến thức +5, nhưng có rủi ro" }, { k: 'work', label: "Phụ giúp việc nhà", sub: "Quan hệ +3" }] };
      return { title: "Học tiếp lên trung học cơ sở?", body: "Bạn đã học xong tiểu học. Muốn học tiếp thì phải lo học phí, đồng phục và tiền đi lại.", fact: L`${B().ko}에서 중학교를 마치는 비율은 약 ${pctStr(pr.p2)}입니다 (${eduSrc(pr, 1)})`,
        choices: [{ k: 'go', label: "Tiếp tục đi học", sub: "Cơ hội tùy vào điều kiện gia đình và kết quả học tập" }, { k: 'work', label: "Bắt đầu đi làm để giúp gia đình", sub: "Có chút thu nhập, thôi học" }] };
    },
    apply: k => {
      const pr = eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1);
      if (k === 'home') { eff({ sm: 5, h: -3 }); toChildwork(); return "Bạn lén tìm sách về đọc và tiếp tục việc học."; }
      if (k === 'work') { toChildwork(true); eff({ so: 3 }); return { t: "Bạn thôi học và bắt đầu đi làm.", f: "Khoảng 160 triệu trẻ em trên toàn thế giới đang phải lao động (ILO·UNICEF 2020)" }; }
      if (chance(odds(Math.max(pr.t2, 0.1), effortOdds(1.15)))) { S.school = 'lsec'; S.schoolY = 0; S.job = 'student'; S.yearMark = 'edu'; return { t: "Bạn đã lên trung học cơ sở.", k: 'big', post: regNext }; }
      if (S.q >= 4 && (S.st.sm >= 90 || (S.flags.topMk != null && S.age - S.flags.topMk <= 2)) && !pr.ban) { S.school = 'lsec'; S.schoolY = 0; S.job = 'student'; S.yearMark = 'edu'; return { t: "Trường trung học cơ sở không đủ chỗ, nhưng điểm thi tuyển của bạn tốt nên bạn vẫn giành được một suất.", k: 'big', post: regNext }; }
      toChildwork(); eff({ h: -6 }); return { t: outWhy('lsec'), k: 'bad' };
    }
  },
  school3: {
    build: () => {
      if (rohCamp()) { if (S.age < 15) toChildwork(); else S.job = 'seeking'; log("Ở các trại tị nạn hầu như không nơi nào dạy bậc trung học phổ thông. Việc học của bạn dừng lại ở đó.", 'bad', ROH_F.edu11); return null; }
      const pr = eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1);
      if (pr.t3 > 0.96 && (S.q >= 2 || UPSEC[B().id])) return { title: "Chọn hướng đi", body: "Bạn đã học xong trung học cơ sở. Bạn sẽ vào trường trung học phổ thông nào?", fact: L`${B().ko}의 고등학교 이수 비율 약 ${pctStr(pr.p3)} (${eduSrc(pr, 2)})`,
        choices: [{ k: 'go', label: "Trường trung học phổ thông", sub: "Thuận lợi hơn để vào đại học" }, artsChoice(), { k: 'voc', label: "Trường trung học nghề", sub: "Thuận lợi hơn cho nghề kỹ thuật" }].filter(Boolean) };
      return { title: "Học tiếp lên trung học phổ thông?", body: pr.t3 > 0.8 ? "Bạn đã học xong trung học cơ sở." : "Bạn đã học xong trung học cơ sở. Vài người bạn đã bắt đầu đi làm.", fact: usecFact(pr),
        choices: [{ k: 'go', label: "Học tiếp lên trung học phổ thông", sub: "Cơ hội tùy vào hoàn cảnh và điểm số" }, artsChoice(), { k: 'voc', label: "Vào trường nghề", sub: "Học một nghề, sớm có việc làm" }, { k: 'work', label: "Bắt đầu đi làm", sub: "Có thu nhập ngay" }].filter(Boolean) };
    },
    apply: k => {
      const pr = eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1);
      if (k === 'work') { if (S.age < 15) toChildwork(true); else S.job = 'seeking'; return "Bạn kết thúc việc học và bắt đầu tìm việc."; }
      let miss = '';
      if (k === 'arts') { const x = artsHS();
        if (x && chance(artsHSP(x))) { S.school = 'usec'; S.schoolY = 0; S.job = 'student'; S.yearMark = 'edu'; S.flags.artsHS = x.k; S.flags.artsHH = x.h.id; const h = S.hobbies.find(q => q.id === x.h.id); if (h) h.lv += 2; eff({ h: 5 });
          return { t: x.k === 'art' ? "Bạn đã đỗ kỳ thi năng khiếu vào trường trung học nghệ thuật! Nửa ngày của bạn trôi qua trong phòng thực hành." : "Bạn đã đỗ vào trường trung học thể thao! Sáng nào bạn cũng chạy quanh sân.", k: 'big', post: regNext }; }
        miss = (x && x.k === 'sport' ? "Bạn đã trượt kỳ thi năng khiếu của trường trung học thể thao." : "Bạn đã trượt kỳ thi năng khiếu của trường trung học nghệ thuật.") + ' '; eff({ h: -3 }); k = 'go'; }
      const p = k === 'voc' ? Math.max(pr.t3, Math.min(0.98, pr.t3 * 1.2 + 0.1)) : pr.t3;
      if (chance(odds(Math.max(p, 0.08), effortOdds(1.15)))) { S.school = k === 'voc' ? 'voc' : 'usec'; S.schoolY = 0; S.job = 'student'; S.yearMark = 'edu'; return { t: miss + (k === 'voc' ? L`직업학교 ${vocIn()}에 입학했습니다.` : "Bạn đã lên trung học phổ thông."), k: 'big', post: regNext }; }
      if (k !== 'voc' && pr.t3 > 0.9 && chance(Math.min(0.98, pr.t3 * 1.2 + 0.1))) { const up = UPSEC[B().id]; S.school = up ? 'usec' : 'voc'; S.schoolY = 0; S.job = 'student'; S.yearMark = 'edu';
        return { t: miss + (up ? "Bạn trượt kỳ thi vào trường trung học mình muốn, nhưng đã vào được một trường khác." : L`인문계 고등학교 입시에서는 떨어졌지만, 직업학교 ${vocIn()}에 들어갔습니다.`), k: 'big', post: regNext }; }
      if (S.age < 15) toChildwork(); else S.job = 'seeking'; eff({ h: -6 }); return { t: miss + usecWhy(k) + ' ' + (S.age < 15 ? "Bạn bắt đầu phụ giúp việc nhà và công việc của gia đình." : "Bạn bắt đầu tìm việc."), k: 'bad', f: usecFact(pr) };
    }
  },
  college: {
    build: p => {
      if (S.job === 'prison') return null;
      if (rohUniShut()) { S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 });
        log(rohCamp() ? "Là người tị nạn, bạn không thể vào đại học ở Bangladesh." : "Học sinh Rohingya không được vào giảng đường Đại học Sittwe. Học đại học vẫn chỉ là ước mơ.", 'bad', rohCamp() ? ROH_F.edu : ROH_F.uni); return null; }
      if (typeof uniShut === 'function' && uniShut(C())) { uniShutNow(); return null; }
      const c = C(), pr = eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1), re = p && p.re, reo = p && p.reo;
      const pu = uniTop(odds(Math.max(pr.t4, 0.03), effortOdds(1.15) * (re ? RETAKE_OR(c) : FIRST_OR)), pr) * eraAdmK(), lv = pu >= 0.7 ? "tương đối cao" : pu >= 0.4 ? "khoảng một nửa" : "tương đối thấp";
      const open = uniOpen(c);
      const ch = [open ? { k: 'uni', label: "Đăng ký vào đại học công lập", sub: OPEN_UNI[c.id].sub ? OPEN_UNI[c.id].sub() : "Không thi đầu vào · ít người học được đến khi tốt nghiệp" } : { k: 'uni', label: "Thử sức thi đại học", sub: L`붙을 가능성 ${lv} · 지식 ${Math.round(S.st.sm)} · 형편과 정원에 따라` }, reo ? { k: 'job', label: "Không dự thi", sub: '' } : { k: 'job', label: "Đi làm ngay", sub: "Sớm kiếm tiền" }];
      const lk = [];
      if (!(p && p.home) && !reo && freeExit(c) && papersOK()) {
        if (famAbroad(c)) ch.push(fledLately() ? { k: 'abroad', label: "Nộp đơn xin học bổng du học", sub: "Toàn bộ học phí và sinh hoạt phí · rất ít suất" } : { k: 'abroad', label: "Đi du học", sub: "Tốn kém, nhưng cơ hội cũng lớn" });
        else if (S.money >= abroadNeed(c)) ch.push({ k: 'abroad', label: "Đi du học", sub: "Bằng tiền tiết kiệm · tốn kém, nhưng cơ hội cũng lớn" });
        else if (!fledLately()) lk.push({ label: "Đi du học", sub: lockedWhy(abroadNeed(c)) });
      }
      if (!reo && acadOK(c)) { const w = acadP() >= 0.4 ? "khoảng một nửa" : "tương đối thấp";
        if (ACAD3.has(c.id)) ch.push({ k: 'acad', label: "Thi vào học viện lục quân", sub: L`붙을 가능성 ${w} · 학비 없음 · 졸업하면 장교로 복무` }, { k: 'acadn', label: "Thi vào học viện hải quân", sub: L`붙을 가능성 ${w} · 바다에서 복무` }, { k: 'acadf', label: "Thi vào học viện không quân", sub: L`붙을 가능성 ${acadP() * 0.85 >= 0.4 ? "khoảng một nửa" : "tương đối thấp"} · 시력과 체력이 까다로움 · 조종사의 길` });
        else if (acadJP()) ch.push({ k: 'acad', label: "Thi vào Học viện Phòng vệ Quốc gia", sub: L`붙을 가능성 ${w} · 학비 없음, 매달 수당 · 졸업하면 자위대 간부로 복무` });
        else ch.push({ k: 'acad', label: "Thi vào học viện quân sự", sub: L`붙을 가능성 ${w} · 학비 없음 · 졸업하면 장교로 복무` }); }
      if (reo) return { title: "Kỳ thi đại học mở lại", body: "Các trường đại học từng đóng cửa nay lại tuyển sinh viên mới bằng kỳ thi tuyển sinh." + ' ' + "Bạn có đi thi không?", choices: ch,
        fact: c.id === 'CHN' ? "Năm 1977, khoảng 5,7 triệu người dự kỳ thi đại học vừa được khôi phục, và khoảng 270.000 người trúng tuyển" : L`이 나라 같은 세대 중 대학을 마치는 비율은 약 ${pctStr(pr.p4)}로 추정됩니다. 지식은 같은 나이 가운데 어디쯤인지를 뜻하고, 높을수록 붙기 쉽지만 정원이 정해져 있어 장담할 수는 없습니다` };
      return { title: p && p.home ? "Thi đại học trong nước" : re ? "Thi đại học lần nữa" : "Ngã rẽ tuổi hai mươi", body: p && p.home ? "Con đường du học đã khép lại. Nộp đơn vào đại học trong nước, hay bắt đầu đi làm?" : (re ? "Bạn đã ôn thêm một năm. Lần này sẽ làm gì?" : S.school === null && S.edu === 3 && S.flags.vocF != null ? "Bạn đã học xong chương trình học nghề." : "Bạn đã học xong trung học phổ thông. Tiếp theo là gì?") + eraAdmNote(), fact: open ? OPEN_UNI[c.id].fact() : L`이 나라 같은 세대 중 대학을 마치는 비율은 약 ${pctStr(pr.p4)}로 추정됩니다. 지식은 같은 나이 가운데 어디쯤인지를 뜻하고, 높을수록 붙기 쉽지만 정원이 정해져 있어 장담할 수는 없습니다`, choices: ch, locked: lk.length ? lk : undefined };
    },
    apply: (k, p) => {
      const c = C(), pr = eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1), re = p && p.re, reo = p && p.reo;
      if (k === 'job') { if (reo) return false; S.job = 'seeking'; return "Bạn đã chọn đi làm thay vì học đại học."; }
      if (k === 'acad' || k === 'acadn' || k === 'acadf') {
        const br = k === 'acadn' ? 'n' : k === 'acadf' ? 'f' : ACAD3.has(c.id) ? 'a' : acadJP() ? 'jp' : null;
        if (chance(acadP() * (br === 'f' ? (S.st.hl >= 70 ? 0.85 : 0.4) : 1))) { S.school = 'uni'; S.schoolY = 0; S.flags.acad = 1; S.flags.acadB = br; S.major = 'mil'; S.yearMark = 'edu'; eff({ h: 6, hl: 2 });
          return br === 'n' ? "Bạn đã đỗ vào học viện hải quân! Bạn cắt tóc ngắn và khoác lên bộ quân phục học viên màu trắng." : br === 'f' ? "Bạn đã đỗ vào học viện không quân! Bạn cắt tóc ngắn và khoác lên bộ quân phục học viên màu xanh da trời." : br === 'jp' ? "Bạn đã đỗ vào Học viện Phòng vệ Quốc gia! Bạn cắt tóc ngắn và mặc bộ đồng phục sinh viên." : "Bạn đã đỗ vào học viện quân sự! Bạn cắt tóc ngắn và khoác lên bộ quân phục học viên."; }
        S.job = 'seeking'; eff({ h: -6 });
        if (retakeWhy() === 'ok') { queue(Math.min(0.97, S.t + 0.04), 'dec', 'retake', { n: S.flags.retakeN || 0, c: S.cur }); return { t: br === 'jp' ? "Bạn đã trượt kỳ thi vào Học viện Phòng vệ Quốc gia." : "Bạn đã trượt kỳ thi vào học viện quân sự.", k: 'bad' }; }
        return { t: br === 'jp' ? "Bạn đã trượt kỳ thi vào Học viện Phòng vệ Quốc gia. Bạn quyết định đi tìm việc." : "Bạn đã trượt kỳ thi vào học viện quân sự. Bạn quyết định đi tìm việc.", k: 'bad' };
      }
      if (k === 'abroad') { const ds = studyDests(), fa = famAbroad(c); if (ds.length) { S.job = 'seeking'; queue(Math.min(0.97, S.t + 0.04), 'dec', 'studyto', { lv: 'uni', ds, re: p && p.re, sch: fa && fledLately() ? 1 : 0, own: fa ? 0 : 1 }); return false; } k = 'uni'; }
      const pu = uniTop(odds(Math.max(pr.t4, 0.03), effortOdds(1.15) * (re ? RETAKE_OR(c) : FIRST_OR)), pr);
      if (uniOpen(c)) { S.school = 'uni'; S.schoolY = 0; S.flags.uniKeep = clamp(pu * OPEN_UNI[c.id].k * ndUniK(), 0.05, 0.9); S.yearMark = 'edu'; eff({ h: 4 }); return "Bạn đã đăng ký vào một trường đại học công lập. Không có kỳ thi đầu vào."; }
      if (chance(pu * eraAdmK() * (S.dd && S.dd.k === 'aut' && !S.dd.xi ? 0.66 : 1) * ndUniK())) {
        if (reo) { const sd = S.flags.sentDown; if (sd && !sd.home) { sd.home = 1; S.urban = true; S.city = sd.city; } if (isWorking()) S.flags.lastJob = S.job; S.job = 'student'; }
        S.school = 'uni'; S.schoolY = 0; S.yearMark = 'edu'; eff({ h: re || reo ? 7 : 5 }); return (re ? "Thi lại lần này, bạn đã đỗ đại học!" : "Bạn đã đỗ đại học!") + resAdmitLine(); }
      if (reo) { eff({ h: -4 }); return { t: "Bạn đã thi trượt đại học." + (isWorking() ? ' ' + "Bạn tiếp tục công việc đang làm." : ''), k: 'bad' }; }
      S.job = 'seeking'; eff({ h: -8 });
      const why = retakeWhy();
      const few = czPar() ? eraAdmWhy() : S.st.sm >= 85 ? ' ' + "Điểm của bạn đủ cao, nhưng số chỗ quá ít so với số người dự thi." : '';
      if (why === 'ok') { queue(Math.min(0.97, S.t + 0.04), 'dec', 'retake', { n: S.flags.retakeN || 0, c: S.cur }); return { t: (re ? "Thi lại lần này, bạn vẫn không đỗ đại học." : "Bạn đã thi trượt đại học.") + few, k: 'bad' }; }
      if (why === 'money' && !re) return { t: "Bạn đã thi trượt đại học. Hoàn cảnh gia đình không cho phép bạn dành thêm một năm chỉ để ôn thi, nên bạn quyết định đi tìm việc." + few, k: 'bad' };
      return { t: (re ? "Thi lại lần này, bạn vẫn không đỗ đại học. Bạn quyết định đi tìm việc." : "Bạn đã thi trượt đại học. Bạn quyết định đi tìm việc.") + few, k: 'bad' };
    }
  },
  retake: {
    build: p => {
      if (S.job === 'prison' || S.flags.irreg || (p && p.c && p.c !== S.cur)) return null;
      const c = C(), ex = EXAM_C.has(c.id), n = (p && p.n) || 0;
      return { title: n ? "Thi thêm một lần nữa?" : "Thi lại?",
        body: n >= 2 ? "Lần thi thứ ba cũng không như ý. Gia đình bảo bạn cố thêm một năm. Có thể đây là cơ hội cuối cùng." : n ? "Lần thi thứ hai cũng không như ý. Bạn có thể ôn thêm một năm, hoặc bắt đầu đi làm từ bây giờ." : "Bạn đã thi trượt đại học. Bạn có thể ôn thêm một năm rồi thi lại, hoặc bắt đầu đi làm ngay bây giờ.",
        fact: c.id === 'KOR' ? "Trong hơn 520.000 thí sinh đăng ký kỳ thi đại học Suneung năm học 2025 ở Hàn Quốc, 31% đã tốt nghiệp trung học phổ thông từ trước và đang thi lại (Korea Institute for Curriculum and Evaluation)"
          : ex ? "Ở những nước mà một kỳ thi quyết định ai được vào đại học, nhiều người thi trượt sẽ ôn thêm một năm rồi thi lại (như “rōnin” ở Nhật Bản, “fùdú” ở Trung Quốc)"
          : "Ở nhiều nước, người trượt đại học sẽ nộp đơn lại vào năm sau. Nhưng nếu không đủ tiền lo học phí và sinh hoạt phí thì rất khó thử lại",
        choices: [{ k: 'retake', label: "Ôn thêm một năm rồi thi lại", sub: n >= 2 ? (ex ? "Lần thi thứ tư · thêm một năm không có thu nhập" : "Thử lại lần thứ ba · thêm một năm không có thu nhập") : n ? (ex ? "Lần thi thứ ba · thêm một năm không có thu nhập" : "Thử lại lần thứ hai · thêm một năm không có thu nhập") : "Ôn thi lại · một năm không có thu nhập" }, { k: 'work', label: "Bắt đầu đi làm", sub: "Sớm kiếm tiền" }] };
    },
    apply: (k, p) => {
      if (k === 'work') { S.flags.retakeN = 9; return "Bạn quyết định không thi lại mà đi tìm việc."; }
      S.flags.retakeN = ((p && p.n) || 0) + 1; S.flags.retakeAt = S.age + 1; S.job = 'student'; eff({ h: -3, sm: 2 });
      return EXAM_C.has(C().id) && S.q >= 3 ? "Bạn quyết định học thêm một năm ở lò luyện thi rồi thi lại." : "Bạn quyết định học thêm một năm rồi thi lại.";
    }
  },
  afterUni: {
    build: () => {
      const d = S.flags.studyAbroad && !S.mig ? CBY[S.flags.studyAbroad] : null;
      return { title: "Sau khi tốt nghiệp", body: d ? L`${d.ko}에서 학사 학위를 받았습니다. 어디에서 무엇을 할까요?` : "Bạn đã nhận bằng cử nhân. Học tiếp, hay bắt đầu đi làm?",
        fact: d ? "Tùy theo quốc gia và chế độ thị thực, khoảng 20–60% du học sinh ở lại nước sở tại làm việc sau khi tốt nghiệp (OECD International Migration Outlook 2022)" : "Trên thế giới, khoảng 15–20% người từ 25 tuổi trở lên có bằng cử nhân trở lên (ước tính của UNESCO·Barro-Lee)",
        choices: d ? [{ k: 'stayjob', label: L`${d.ko}에 남아 일자리를 찾는다`, sub: L`취업 비자를 받아야 합니다 · ${psWord(S.flags.studyAbroad)}` }, { k: 'job', label: L`고향 ${ro(C().ko)} 돌아가 취업한다`, sub: "Gần gia đình" }, { k: 'grad', label: L`${d.ko}에서 대학원에 진학한다`, sub: "Học thêm 2 năm, có thể làm nghề chuyên môn" }, onwardChoice()].filter(Boolean)
          : [{ k: 'job', label: "Đi làm", sub: "Tìm việc bằng tấm bằng cử nhân" }, { k: 'grad', label: "Học cao học", sub: "Học thêm 2 năm, có thể làm nghề chuyên môn" }]
            .concat(gradAbroadOK() ? [{ k: 'gradabroad', label: "Đi du học cao học ở nước ngoài", sub: S.q >= 3 ? L`약 ${wonStr(gradAbroadCost())} · 입학과 비자가 필요합니다` : L`약 ${wonStr(gradAbroadCost())} · 모은 돈으로 · 입학과 비자가 필요합니다` }] : []),
        locked: !d && gradAbroadWay() && !gradAbroadOK() ? [{ label: "Đi du học cao học ở nước ngoài", sub: lockedWhy(gradAbroadCost()) }] : undefined };
    },
    apply: k => {
      if (S.flags.studyAbroad && !S.mig) {
        if (k === 'stayjob') settleAfterStudy(chance(postStudyP(S.flags.studyAbroad)), true);
        else if (k === 'job') settleAfterStudy(false);
        else if (k === 'third') { const t = onwardTo(); if (t) settleAfterStudy(chance(onwardP(t)), true, t); else settleAfterStudy(false); }
      }
      if (k === 'stayjob' || k === 'third') k = 'job';
      if (k === 'gradabroad') { const ds = studyDests(); if (ds.length) { S.job = 'seeking'; queue(Math.min(0.97, S.t + 0.04), 'dec', 'studyto', { lv: 'grad', ds }); return false; } k = 'grad'; }
      if (k === 'grad') { if (chance(gradAdmit())) { S.school = 'grad'; S.schoolY = 0; S.job = 'student'; return "Bạn đã vào học cao học."; } S.job = 'seeking';
        const abroad = S.flags.studyAbroad && !S.mig, d = abroad ? CBY[S.flags.studyAbroad] : null;
        return { t: abroad ? L`대학원 입학에 실패했습니다. ${d.ko}에 남아 일자리를 알아보기로 했습니다.` : "Bạn không đỗ cao học.", k: 'bad', post: () => { if (abroad) settleAfterStudy(chance(postStudyP(S.flags.studyAbroad)), true); } }; }
      S.job = 'seeking'; return false;
    }
  },
  gradAbroadEnd: {
    ok: () => !!(S.flags.studyAbroad && !S.mig && !S.school),
    build: () => { const d = CBY[S.flags.studyAbroad];
      return { title: "Sau khi tốt nghiệp", body: L`${d.ko}에서 대학원을 마쳤습니다. 어디에서 일할까요?`,
        fact: "Tùy theo quốc gia và chế độ thị thực, khoảng 20–60% du học sinh ở lại nước sở tại làm việc sau khi tốt nghiệp (OECD International Migration Outlook 2022)",
        choices: [{ k: 'stay', label: L`${d.ko}에 남아 일자리를 찾는다`, sub: L`취업 비자를 받아야 합니다 · ${psWord(S.flags.studyAbroad)}` }, { k: 'home', label: L`고향 ${ro(C().ko)} 돌아가 취업한다`, sub: "Gần gia đình" }, onwardChoice()].filter(Boolean) }; },
    apply: k => { if (k === 'third') { const t = onwardTo(); if (t) { settleAfterStudy(chance(onwardP(t)), true, t); return false; } }
      settleAfterStudy(k === 'stay' && chance(postStudyP(S.flags.studyAbroad, true)), k === 'stay'); return false; }
  },
  studyto: {
    ok: () => !S.mig && !S.flags.studyAbroad && !S.school,
    build: p => {
      const grad = p.lv === 'grad', base = grad ? gradAbroadCost() : usd2ppp(C(), 30000);
      const ch = (p.ds || []).filter(d => CBY[d]).map((d, i) => { const lang = stLang(d, grad), cost = base * stCost(d) * (lang ? 1 : 1.15);
        return { k: 'd' + i, label: L`${ro(CBY[d].ko)} 간다`, sub: p.sch ? L`전액 장학금 · ${lang ? "không gặp rào cản ngôn ngữ" : "học thêm 1 năm ngôn ngữ trước"} · ${psWord(d)}` : L`약 ${wonStr(cost)} · ${lang ? "không gặp rào cản ngôn ngữ" : "học thêm 1 năm ngôn ngữ trước"} · ${psWord(d)}` }; });
      ch.push({ k: 'home', label: grad ? "Đổi ý, nộp đơn học cao học trong nước" : "Đổi ý, nộp đơn vào đại học trong nước", sub: "Ở gần gia đình" });
      return { title: "Sẽ đi nước nào?", body: p.sch ? "Bạn quyết định nộp đơn xin học bổng dành cho sinh viên phải lánh nạn. Nếu đỗ, bạn được lo toàn bộ học phí và sinh hoạt phí, nhưng số suất rất ít." : grad ? L`대학원 유학을 떠나기로 했습니다. ${C().ko}에서 대학원 공부를 하러 가는 사람들은 주로 이런 곳으로 갑니다.` : L`유학을 떠나기로 했습니다. ${C().ko}의 유학생들은 주로 이런 곳으로 갑니다.`,
        fact: (p.ds || []).includes('USA') && calYr() >= 2025 ? "Mùa thu năm 2025, số du học sinh mới đến Mỹ giảm 17% so với một năm trước. Từ năm 2026, công dân của 38 nước không thể xin thị thực du học Mỹ, và từ tháng 9, thời gian lưu trú của sinh viên bị giới hạn tối đa 4 năm (IIE, US State Department, US Department of Homeland Security)"
          : (p.ds || []).includes('CAN') && calYr() >= 2024 ? "Canada đặt giới hạn số giấy phép du học từ năm 2024, khiến số giấy phép du học mới năm đó giảm 48% (Immigration, Refugees and Citizenship Canada)"
          : "Năm 2022, khoảng 6,9 triệu sinh viên đại học đang học ở nước ngoài. Nơi họ đến tùy theo ngôn ngữ, khoảng cách, mối liên hệ từ xưa và chi phí: sinh viên Maroc phần lớn sang Pháp, sinh viên Nepal sang Úc (UNESCO UIS, IIE Project Atlas 2024)", choices: ch };
    },
    apply: (k, p) => {
      const grad = p.lv === 'grad', c = C();
      if (k === 'home') {
        if (!grad) { queue(Math.min(0.97, S.t + 0.04), 'dec', 'college', { home: 1, re: p.re }); return "Bạn quyết định nộp đơn vào đại học trong nước."; }
        if (chance(gradAdmit())) { S.school = 'grad'; S.schoolY = 0; S.job = 'student'; return "Bạn đã vào học cao học trong nước."; }
        S.job = 'seeking'; eff({ h: -4 }); return { t: "Bạn không đỗ cao học trong nước. Bạn quyết định đi tìm việc.", k: 'bad' };
      }
      const dest = (p.ds || [])[+k.slice(1)]; if (!dest || !CBY[dest]) return false;
      const lang = stLang(dest, grad), base = grad ? gradAbroadCost() : usd2ppp(c, 30000);
      let cost = base * stCost(dest) * (lang ? 1 : 1.15);
      const fam = p.own ? 0 : grad ? [0, 0, 0, 0.2, 0.4, 0.6][S.q] || 0 : S.q >= 5 ? 0.7 : 0.4;
      if (p.sch) {
        if (chance(clamp((0.15 + (S.st.sm - 50) / 300) * (ADM_K[dest] || 1), 0.04, 0.3))) { petStay(true); studyNet(); S.school = 'uni'; S.schoolY = lang ? 0 : -1; S.job = 'student';
          const fw = studyFamWait();
          S.flags.studyAbroad = dest; S.flags.saCity = cityOf(CBY[dest]); S.flags.skilledMig = 1; eff({ sm: 6, h: 8 }); S.yearMark = 'edu';
          return { t: L`장학금에 뽑혔습니다! 학비와 생활비를 모두 받고 ${CBY[dest].ko}의 대학으로 떠났습니다.` + (lang ? '' : ' ' + "Năm đầu tiên bạn học tiếng của nước đó trước.") + (fw ? ' ' + fw : ''), k: 'big' }; }
        S.job = 'seeking'; eff({ h: -5 }); queue(Math.min(0.97, S.t + 0.04), 'dec', 'college', { home: 1, re: p.re });
        return { t: "Bạn không giành được học bổng. Bạn quyết định thử nộp đơn vào đại học trong nước.", k: 'bad' };
      }
      const lim = studyLim(S.born, dest)[1], pAdm = grad ? clamp((gradAdmit() * 0.8 + (S.st.sm - 50) / 200) * (ADM_K[dest] || 1) * lim * (lang ? 1 : 0.9), 0.05, 0.85)
        : clamp((0.6 + (S.st.sm - 40) / 100) * (ADM_K[dest] || 1) * lim * (lang ? 1 : 0.9), 0.05, 0.95);
      if (chance(pAdm)) {
        const sch = chance(scholP(dest)); if (sch) cost *= 0.25;
        const due = cost * (1 - fam), own = clamp(S.money, 0, due);
        petStay(true); studyNet(); S.money -= due; S.school = grad ? 'grad' : 'uni'; S.schoolY = lang ? 0 : -1; S.job = 'student';
        const fw = studyFamWait();
        S.flags.studyAbroad = dest; S.flags.saCity = cityOf(CBY[dest]); S.flags.skilledMig = 1; eff({ sm: grad ? 4 : 6, h: lang ? 4 : 2 }); S.yearMark = 'edu';
        const pay = sch ? L`정부 장학금을 받아 학비와 생활비 대부분을 덜었습니다. 남은 비용 ${wonStr(cost)}` : L`비용 ${wonStr(cost)}`;
        const rest = own >= due * 0.999 ? 'own' : own > 0 ? 'mix' : 'debt';
        const who = fam ? (rest === 'own' ? L`${pay} 가운데 ${wonStr(cost * fam)}은 ${iga(parW())} 댔고, 나머지는 모아 둔 돈으로 냈습니다.` : rest === 'mix' ? L`${pay} 가운데 ${wonStr(cost * fam)}은 ${iga(parW())} 댔고, 나머지는 모아 둔 돈과 빚으로 마련했습니다.` : L`${pay} 가운데 ${wonStr(cost * fam)}은 ${iga(parW())} 댔고, 나머지는 빚으로 남았습니다.`)
          : rest === 'own' ? L`${pay}은 모두 모아 둔 돈으로 냈습니다.` : rest === 'mix' ? L`${pay} 가운데 ${wonStr(own)}은 모아 둔 돈으로 냈고, 나머지는 빚으로 남았습니다.` : L`${pay}은 모두 빚으로 남았습니다.`;
        return { t: (grad ? L`${CBY[dest].ko}의 대학원에 합격해 유학을 떠났습니다.` : L`${CBY[dest].ko}의 대학에 합격해 유학을 떠났습니다.`) + ' ' + (lang ? '' : "Năm đầu tiên bạn học tiếng của nước đó trước. ") + who + (fw ? ' ' + fw : ''), k: 'big' };
      }
      S.job = 'seeking'; eff({ h: -5 });
      if (!grad) { queue(Math.min(0.97, S.t + 0.04), 'dec', 'college', { home: 1, re: p.re }); return { t: L`${CBY[dest].ko} 대학의 입학이나 유학 비자가 거절되었습니다. 국내 대학에 지원해 보기로 했습니다.`, k: 'bad' }; }
      if (chance(gradAdmit() * 0.8)) { S.school = 'grad'; S.schoolY = 0; S.job = 'student'; eff({ h: 3 }); return { t: L`${CBY[dest].ko} 대학원 입학이나 비자가 거절되어, 함께 지원했던 국내 대학원에 진학했습니다.`, k: 'big' }; }
      return { t: L`${CBY[dest].ko} 대학원 입학이나 비자가 거절되었습니다. 일자리를 찾기로 했습니다.`, k: 'bad' };
    }
  },
  service: {
    ok: () => S.job !== 'soldier' && !S.served && !S.flags.acad,
    build: p => {
      const delay = S.cur === 'PRK' || C().war || !svcDelayOK() ? [] : [{ k: 'delay', label: "Hoãn nhập ngũ", sub: "Tạm hoãn vì việc học hoặc hoàn cảnh riêng" }];
      if (p.kr === 'sup') { const n = krSupN(), m = krMonths(n, p.months);
        return { title: "Giấy triệu tập", body: n === 'bw' ? L`징병검사에서 보충역 판정을 받아 방위병으로 소집됩니다. 몇 주 훈련을 받은 뒤 집에서 부대나 동사무소로 출퇴근하며 약 ${m}개월 복무합니다.`
          : n === 'pub' ? L`징병검사에서 보충역 판정을 받아 공익근무요원으로 소집됩니다. 기초 군사훈련을 받은 뒤 집에서 공공기관으로 출퇴근하며 약 ${m}개월 복무합니다.`
          : L`병역판정검사에서 보충역 판정을 받아 사회복무요원으로 소집됩니다. 기초 군사훈련을 받은 뒤 집에서 복지시설이나 공공기관으로 출퇴근하며 약 ${m}개월 복무합니다.`,
          fact: n === 'bw' ? "Năm 1990, trong khoảng 450.000 nam giới thuộc diện nghĩa vụ quân sự, 200.000 người phục vụ tại ngũ, 120.000 người được triệu tập làm lính phòng vệ địa phương (bangwi) và 130.000 người được miễn (Seoul Shinmun, 1991)." : null,
          choices: [{ k: 'go', label: "Chấp hành lệnh triệu tập", sub: L`${m}개월 · 집에서 출퇴근` }].concat(delay.map(d => ({ ...d, label: "Hoãn lệnh triệu tập" }))) };
      }
      const br = p.kr === 'act' ? ['n', 'f', 'p'].filter(krBrOK) : [];
      const brC = br.map(b => { const m = krMonths(b, p.months), w = oddsWord(krBrP(b));
        return b === 'n' ? { k: 'n', label: "Đăng ký vào hải quân", sub: L`붙을 가능성 ${w} · ${m}개월 복무 · 배를 타고 바다를 지킴` }
          : b === 'f' ? { k: 'f', label: "Đăng ký vào không quân", sub: L`붙을 가능성 ${w} · ${m}개월 복무 · 비행장과 레이더 기지에서 근무` }
          : { k: 'p', label: "Đăng ký vào cảnh sát nghĩa vụ", sub: L`붙을 가능성 ${w} · ${m}개월 복무 · 경찰서에서 치안을 도움` }; });
      return { title: "Giấy gọi nhập ngũ", body: L`${C().ko}에서는 ${S.sex === 'M' ? "nam giới" : "nữ giới"}에게 병역 의무가 있습니다. 복무 기간은 약 ${p.months}개월입니다.`, fact: C().war ? "Đất nước này hiện đang có xung đột vũ trang." : null,
        choices: [{ k: 'go', label: br.length ? "Nhập ngũ lục quân" : "Nhập ngũ", sub: L`${p.months}개월 복무` }].concat(brC, delay) };
    },
    apply: (k, p) => {
      if (k === 'delay' && svcDelayOK()) { S.flags.svcDelay = S.age; return p.kr === 'sup' ? (S.school === 'uni' ? "Bạn đã hoãn lệnh triệu tập cho đến khi tốt nghiệp." : "Bạn đã hoãn lệnh triệu tập 1 năm.") : S.school === 'uni' ? "Bạn đã hoãn nhập ngũ cho đến khi tốt nghiệp." : "Bạn đã hoãn nhập ngũ 1 năm."; }
      S.flags.svcDelay = null;
      const leave = S.school === 'uni'; if (leave) { S.flags.uniLeave = S.schoolY; S.school = null; }
      const late = k === 'delay';
      if (S.job === 'idol' && S.idol) S.idol.pct = S.pct;
      const ath = S.job === 'athlete' && S.ath; if (ath) { S.ath.pct = S.pct; S.ath.svc = 1; }
      if (S.job === 'boardpro' && S.flags.boardPro) S.flags.boardPro.svc = S.pct;
      const gm = S.job === 'progamer' && S.flags.gamer && !S.flags.gamer.end; if (gm) { S.flags.gamer.end = 1; S.flags.gamer.svc = 1; S.flags.exGamer = 1; }
      const tryB = ['n', 'f', 'p'].includes(k) ? k : null, b = p.kr === 'sup' ? krSupN() : tryB && chance(krBrP(tryB)) ? tryB : p.kr ? 'a' : null;
      S.flags.svcB = b;
      S.serveLeft = Math.max(1, Math.round((b ? krMonths(b, p.months) : p.months) / 12)); S.job = 'service'; S.done.service = 1; S.yearMark = 'svc';
      eff(svcSup() ? { hl: 1, so: 1, h: -2 } : { hl: 3, so: 2, h: -4 });
      if (b === 'bw') return leave ? "Bạn tạm nghỉ học đại học và được triệu tập làm lính phòng vệ địa phương." : "Bạn được triệu tập làm lính phòng vệ địa phương. Sau vài tuần huấn luyện, bạn vẫn ở nhà và đi về hằng ngày để phục vụ.";
      if (b === 'pub') return leave ? "Bạn tạm nghỉ học đại học và được triệu tập làm nhân viên phục vụ công ích." : "Bạn được triệu tập làm nhân viên phục vụ công ích. Sau khóa huấn luyện quân sự cơ bản, bạn vẫn ở nhà và đi về hằng ngày để phục vụ.";
      if (b === 'soc') return leave ? "Bạn tạm nghỉ học đại học và được triệu tập làm nhân viên phục vụ xã hội." : "Bạn được triệu tập làm nhân viên phục vụ xã hội. Sau khóa huấn luyện quân sự cơ bản, bạn vẫn ở nhà và đi về hằng ngày để phục vụ.";
      if (b === 'n') return leave ? "Bạn tạm nghỉ học đại học và nhập ngũ hải quân." : "Bạn đã nhập ngũ hải quân. Bạn sẽ phục vụ trên tàu, canh giữ vùng biển.";
      if (b === 'f') return leave ? "Bạn tạm nghỉ học đại học và nhập ngũ không quân." : "Bạn đã nhập ngũ không quân và được phân về một đơn vị canh giữ sân bay quân sự.";
      if (b === 'p') return leave ? "Bạn tạm nghỉ học đại học và nhập ngũ làm cảnh sát nghĩa vụ." : "Bạn đã nhập ngũ làm cảnh sát nghĩa vụ. Bạn sẽ canh gác đồn cảnh sát, hỗ trợ điều tiết giao thông và tuần tra giữ an ninh khu phố.";
      if (tryB) return tryB === 'n' ? "Không được hải quân nhận, bạn nhập ngũ lục quân." : tryB === 'f' ? "Không được không quân nhận, bạn nhập ngũ lục quân." : "Không được chọn vào cảnh sát nghĩa vụ, bạn nhập ngũ lục quân.";
      return ath ? "Bạn tạm gác sự nghiệp thi đấu để nhập ngũ." : gm ? "Bạn khép lại sự nghiệp thi đấu và nhập ngũ." : late ? "Không thể hoãn thêm được nữa, bạn đã nhập ngũ." : leave ? "Bạn bảo lưu việc học đại học để nhập ngũ." : "Bạn đã nhập ngũ.";
    }
  },
  nco: {
    ok: () => S.serveLeft > 0 && S.cur === 'KOR' && !S.done.nco,
    build: () => ({ title: "Trước ngày xuất ngũ", body: "Đơn vị khuyên bạn thử đăng ký làm hạ sĩ. Nếu đỗ, bạn sẽ học khóa đào tạo hạ sĩ quan rồi được phong quân hàm hạ sĩ, trở thành quân nhân chuyên nghiệp hưởng lương hằng tháng. Sau 4 năm phục vụ, nếu được chọn vào diện phục vụ dài hạn, bạn sẽ ở lại quân đội đến tuổi nghỉ hưu.",
      fact: "Trong số hạ sĩ quan phục vụ ngắn hạn, tỷ lệ được chọn vào diện phục vụ dài hạn là khoảng 25% năm 2010 và khoảng 20% năm 2026 (Seoul Shinmun, Money Today).",
      choices: [{ k: 'apply', label: "Đăng ký làm hạ sĩ", sub: L`붙을 가능성 ${oddsWord(ncoP())} · 의무복무 4년 · 그 뒤 장기복무 심사` }, { k: 'out', label: "Xuất ngũ như dự định", sub: "Hoàn thành thời gian phục vụ còn lại rồi trở về đời thường" }] }),
    apply: k => {
      S.done.nco = 1;
      if (k !== 'apply') return false;
      if (!chance(ncoP())) return "Bạn không được chọn làm hạ sĩ quan. Bạn quyết định hoàn thành thời gian phục vụ còn lại rồi xuất ngũ.";
      S.serveLeft = 0; S.served = true; S.flags.uniLeave = null;
      takeJob({ id: 'soldier', formal: true, pct: jobRange('soldier', C(), 'e')[0] + 0.04 }); S.flags.offc = null; setRank('soldier', 1); S.flags.nco = S.age; S.yearMark = 'job';
      eff({ h: 3, so: 1 });
      return "Học xong khóa đào tạo hạ sĩ quan, bạn được phong quân hàm hạ sĩ. Bạn bắt đầu bước trên con đường của một quân nhân chuyên nghiệp.";
    }
  },
  job: {
    ok: () => !S.retired && !isWorking() && S.school !== 'phd',
    build: p => {
      const offers = jobOffers(3, false, false, p && p.code ? 'dev' : null); if (!offers.length) return null;
      S.flags.offers = offers;
      const ch = offers.map((o, i) => ({ k: 'o' + i, label: frSx(JOBS[o.id].n, S.sex), sub: offerText(o) }));
      ch.push({ k: 'wait', label: "Chờ một công việc tốt hơn", sub: "Tìm việc thêm 1 năm" });
      if (S.sex === 'F' && S.fam.married && ['sa', 'mena'].includes(C().p)) ch.push({ k: 'home', label: "Ở nhà lo việc nhà và chăm con", sub: "Không có thu nhập" });
      const first = !S.stats.jobs, sup = !!(p && p.sup);
      const why = (first ? '' : S.flags.lastJob ? L`전에는 ${ro(frSx(JOBS[S.flags.lastJob].n.replace(/ \(.*\)$|（.*）$/, ''), S.sex))} 일했습니다. ` : '') + (lateCareer() ? "Ở tuổi này, đi tìm việc lại thì ít lựa chọn hơn và thu nhập cũng thấp hơn. " : '');
      const body = L`${why}학력: ${eduLbl()}. ${C().ko}의 ${S.urban ? "thành phố" : "nông thôn"}에서 구할 수 있는 일자리입니다.`;
      if (sup) return { title: "Công việc tìm được cùng trung tâm hỗ trợ việc làm", body: "Bạn cùng một người hướng dẫn việc làm của trung tâm hỗ trợ việc làm cho người khuyết tật đi tìm việc." + ' ' + "Khi bạn bắt đầu đi làm, mấy tuần đầu người hướng dẫn sẽ ở bên bạn tại nơi làm việc." + ' ' + body,
        fact: "Trong một thử nghiệm ngẫu nhiên ở Mỹ, 87% thanh niên tự kỷ được thực tập tại nơi làm việc kèm hỗ trợ tại chỗ trong năm học cuối đã có việc làm sau một năm, so với 12% ở những người chỉ học trên lớp (Wehman và cộng sự 2017)", choices: ch };
      return { title: first ? (S.edu >= 4 ? "Chọn công việc đầu tiên" : "Bạn đã tìm được việc làm đầu tiên") : (S.mig && S.migY === S.age ? "Tìm việc ở đất nước mới" : "Chọn công việc mới"), body, fact: L`${C().ko} 노동자의 약 ${pctStr(informal(C()))}가 비공식 고용으로 추정됩니다 (ILO 기준 추정) · 농업 종사 ${C().agr}%`, choices: ch };
    },
    apply: (k, p) => {
      if (k === 'wait') { S.job = 'seeking'; eff({ h: -3 }); return "Bạn quyết định chờ thêm một thời gian."; }
      if (k === 'home') { S.job = 'homemaker'; return "Bạn đảm nhận việc nhà và chăm con."; }
      const o = S.flags.offers[+k.slice(1)]; takeJob(o); S.yearMark = 'job';
      if (nkLife()) return L`국가의 배치에 따라 ${ro(frSx(JOBS[o.id].n.replace(/ \(.*\)$|（.*）$/, ''), S.sex))} 일하게 되었습니다.`;
      if (p && p.sup && S.flags.ddSup == null) { S.flags.ddSup = S.age; return L`${ro(frSx(JOBS[o.id].n.replace(/ \(.*\)$|（.*）$/, ''), S.sex))} 일하기 시작했습니다.` + ' ' + "Mấy tuần đầu, người hướng dẫn việc làm ở bên cạnh giúp bạn làm quen với công việc."; }
      return L`${ro(frSx(JOBS[o.id].n.replace(/ \(.*\)$|（.*）$/, ''), S.sex))} 일하기 시작했습니다.`;
    }
  },
  jobchange: {
    ok: () => isWorking() && !S.retired && !svcCommit(),
    build: p => {
      const deg = !!(p && p.deg), cur = S.job, short = id => frSx(JOBS[id].n.replace(/ \(.*\)$|（.*）$/, ''), S.sex);
      const code = !!(p && p.code), hunt = !!(p && p.hunt), offers = jobOffers(hunt ? 3 : 2, true, deg, code ? 'dev' : null).filter(o => offerInc(o) >= payNow() * (o.id === S.job ? 1.05 : 0.98) || (code && o.id === 'dev'));
      if (!offers.length) { if (hunt) log("Bạn đã tìm việc mới nhưng không thấy chỗ nào tốt hơn chỗ hiện tại."); return null; }
      S.flags.offers = offers;
      const tot = expIn(cur).same;
      const body = hunt ? L`이직을 알아본 끝에 제안이 들어왔습니다. 지금은 ${ro(short(cur))} ${S.jobY}년째 일하고 있습니다.`
        : code ? L`밤마다 독학한 코딩 실력을 보고 개발자 자리 제안이 들어왔습니다. 지금은 ${ro(short(cur))} 일하고 있습니다.`
        : deg ? L`학사 학위를 받고 나니 새로운 일자리 제안이 들어왔습니다. 지금은 ${ro(short(cur))} 일하고 있습니다.`
        : tot > S.jobY ? L`지금은 ${ro(short(cur))} ${S.jobY}년째 일하고 있습니다. 이 일을 한 지는 모두 ${tot}년입니다. 다른 일자리 제안이 들어왔습니다.`
        : L`지금은 ${ro(short(cur))} ${S.jobY}년째 일하고 있습니다. 다른 일자리 제안이 들어왔습니다.`;
      return { title: hunt ? "Lời mời chuyển việc" : code ? "Cánh cửa do tự học mở ra" : deg ? "Cánh cửa do tấm bằng mở ra" : "Một lời mời mới", body, fact: L`현재 소득: 연 ${usdStr(payNow()) + ' PPP'} · 한국 체감 월 ${wonStr(payNow() / 12)}`,
        choices: offers.map((o, i) => o.id === cur ? { k: 'o' + i, label: "Cùng công việc, chuyển sang chỗ làm khác", sub: L`${short(cur)} · ${offerText(o)} · 지금보다 ${Math.round((offerInc(o) / Math.max(1, payNow()) - 1) * 100)}% 더` } : { k: 'o' + i, label: L`${ro(short(o.id))} 옮긴다`, sub: offerText(o) }).concat([{ k: 'stay', label: "Tiếp tục công việc hiện tại", sub: "Tích lũy thêm kinh nghiệm" }]) };
    },
    apply: k => {
      if (k === 'stay') { S.pct = clamp(S.pct + 0.01, 0, 0.99); return false; }
      const o = S.flags.offers[+k.slice(1)], same = o.id === S.job; takeJob(o); eff({ h: 3 }); S.yearMark = 'job';
      return same ? L`더 좋은 조건으로 직장을 옮겼습니다. 하는 일은 ${frSx(JOBS[o.id].n.replace(/ \(.*\)$|（.*）$/, ''), S.sex)} 그대로입니다.` : L`${ro(frSx(JOBS[o.id].n.replace(/ \(.*\)$|（.*）$/, ''), S.sex))} 직업을 바꿨습니다.`;
    }
  },
  parole: {
    ok: () => S.job === 'prison' && !S.flags.paroleAsked,
    build: () => { const left = S.flags.prisonUntil - S.age;
      return { title: "Xét tha tù trước thời hạn", body: L`형기의 절반을 채웠습니다. 남은 형기는 약 ${left}년입니다. 가석방 심사를 받을 수 있습니다.`,
        fact: "Những người ra khỏi nhà tù cấp bang ở Mỹ năm 2018 trung bình đã thụ án 44% thời hạn bị tuyên (US Bureau of Justice Statistics 2021)",
        choices: [{ k: 'apply', label: "Viết bản kiểm điểm và chờ xét duyệt", sub: "Tùy vào quá trình cải tạo trong tù và sự ủng hộ của gia đình" }, { k: 'stay', label: "Chấp hành hết án", sub: '' }] }; },
    apply: k => {
      S.flags.paroleAsked = 1; if (k === 'stay') return false;
      const p = clamp(0.35 + (S.flags.prSchool ? 0.15 : 0) + (S.st.so - 40) / 200 + (S.fam.married || S.fam.mom.alive ? 0.1 : 0), 0.15, 0.75);
      if (!chance(p)) { eff({ h: -4 }); return { t: "Bạn không được tha tù trước thời hạn. Bạn phải chấp hành nốt phần án còn lại.", k: 'bad' }; }
      const y = S.stats.prisonY - (S.flags.prisonY0 || 0); S.job = 'seeking'; S.flags.seekY = 0; S.yearMark = 'move'; eff({ h: 8 }); S.flags.relAt = S.age;
      return { t: L`가석방이 허가되었습니다. ${y}년 만에 교도소 문을 나섰습니다.`, k: 'big', f: "Người ra tù đặc biệt khó tìm việc vì tiền án" };
    }
  },
  adultedu: {
    ok: () => gedOK(),
    build: () => {
      const c = C(), cost = gedCost();
      return { title: "Đi học lại?",
        body: S.edu === 0 ? "Bạn chưa từng được đến trường. Vừa đi làm, bạn có thể học đọc, viết và làm tính ở lớp học ban đêm, rồi thi lấy bằng tiểu học." : L`${GED_LV()} 과정을 마치지 못했습니다. 일을 하면서 야간학교에 다니거나 검정고시를 준비해 졸업 학력을 받을 수 있습니다.`,
        fact: c.id === 'KOR' ? "Ở Hàn Quốc, kỳ thi công nhận trình độ (geomjeong gosi) được tổ chức hai lần mỗi năm, giúp người dự thi được công nhận đã học xong tiểu học, trung học cơ sở hoặc trung học phổ thông (Ministry of Education)"
          : ['USA', 'CAN'].includes(c.id) ? "Ở Mỹ và Canada, đỗ kỳ thi GED được công nhận tương đương với tốt nghiệp trung học phổ thông"
          : c.id === 'IND' ? "Ở Ấn Độ, Viện Quốc gia về Giáo dục Mở (NIOS) giúp người vừa đi làm vừa học xong bậc trung học"
          : "Nhiều nước có lớp học ban đêm và kỳ thi công nhận trình độ dành cho người vừa đi làm (UNESCO Global Report on Adult Learning and Education)",
        choices: [{ k: 'go', label: "Thử đi học lớp ban đêm", sub: L`1년 · 약 ${wonStr(cost)} · 고단함` }, { k: 'no', label: "Tạm thời tập trung vào công việc", sub: '' }] };
    },
    apply: k => { if (k !== 'go') return false; S.money -= gedCost(); S.flags.shop_ged = S.age; return gedStart(); }
  },
  hmwork: {
    ok: () => S.job === 'homemaker' && S.fam.married && S.fam.partner && S.fam.partner.alive,
    build: p => { const P = S.fam.partner, who = callName(P.name);
      if (p && p.debt) return { title: "Khoản nợ không giảm", body: L`배우자 ${who}의 벌이만으로는 빚 ${wonStr(-S.money)}을 갚아 나가기 어렵습니다. 장사든 품팔이든 할 수 있는 일을 찾아볼까요?`,
        fact: "Khoảng một nửa phụ nữ trên thế giới đang đi làm hoặc đang tìm việc. Mức chênh lệch giữa các nước rất lớn: ở Nam Á và Trung Đông, con số chỉ nhỉnh hơn 1 trên 4 người (ILO 2024)",
        choices: [{ k: 'work', label: "Đi tìm việc làm", sub: "Thu nhập ↑ · chia sẻ việc nhà" }, { k: 'wait', label: "Sống như hiện tại", sub: "Khoản nợ vẫn còn nguyên" }] };
      const why = P.ret ? L`배우자 ${iga(who)} 일을 그만둔 뒤로 집에 들어오는 돈이 없습니다.` : P.ill ? L`배우자 ${iga(who)} 치료에 전념하느라 일을 쉬면서 집에 들어오는 돈이 없습니다.`
        : P.out > 0 && P.hm ? L`배우자 ${iga(who)} 아이를 돌보느라 일을 쉬면서 집에 들어오는 돈이 없습니다.` : P.out > 0 && P.mvOut ? L`배우자 ${iga(who)} 이곳에서 아직 일자리를 구하지 못해 집에 들어오는 돈이 없습니다.`
        : L`배우자 ${iga(who)} 일자리를 잃은 뒤로 집에 들어오는 돈이 없습니다.`;
      return { title: "Gia đình mất nguồn thu nhập", body: why + ' ' + "Nếu chỉ lo việc nhà thì cuộc sống sẽ rất chật vật.",
        fact: "Khi người chồng mất việc, nhiều người vợ bắt đầu đi làm hơn, và ở các nước càng nghèo thì điều này càng rõ (Bhalotra & Umaña-Aponte 2010)",
        choices: [{ k: 'work', label: "Đi tìm việc lại", sub: "Thu nhập ↑ · chia sẻ việc nhà" }, { k: 'wait', label: "Cố cầm cự thêm", sub: "Bằng tiền tiết kiệm và tiền vay" }] }; },
    apply: (k, p) => { if (k === 'wait') return false; S.job = 'seeking'; S.flags.seekY = 0; S.flags.reSeek = S.age; return p && p.debt ? "Bạn bắt đầu đi tìm việc để trả nợ." : "Bạn bắt đầu tìm việc trở lại để lo cái ăn cái mặc."; }
  },
  petq: {
    ok: () => !S.pet && !S.refugee && S.job !== 'prison' && !svcAway() && !careNow() && !(S.age >= 70 && (S.money < petCost('d') * 3 || debtHeavy())),
    build: () => { const c = C(), fact = L`${c.ko}에서는 약 ${pctStr(petOwn(c))}의 가구가 개나 고양이를 키우는 것으로 추정됩니다 (APPA, FEDIAF, KB, GfK 조사를 바탕으로 한 대략적인 값)`;
      if (S.age < 15) return { name: petNameAsk(), title: "Con muốn nuôi cún", body: L`친구 집 강아지를 보고 온 날부터 ${carerW()}께 조르고 있습니다.`, fact,
        choices: [{ k: 'beg', label: "Nài nỉ mãi", sub: "Có được đồng ý hay không tùy vào hoàn cảnh gia đình" }, { k: 'no', label: "Cố nhịn", sub: '' }] };
      const kid = S.fam.kids.find(k => k.alive && !k.grown && !k.away && !k.placed && S.age - k.bornAt >= 6 && S.age - k.bornAt <= 14), sk = S.flags.petSm = petSmall();
      return { name: petNameAsk(), title: "Nuôi thú cưng?", body: kid ? L`${iga(callName(kid.name))} 강아지를 키우자고 며칠째 조릅니다.` : pick(["Nhà hàng xóm có một lứa thú con mới sinh đang tìm gia đình mới.", "Ở trại cứu hộ, bạn thấy những con vật đang chờ một gia đình mới.", "Chú mèo hoang bạn hay gặp trong xóm cứ khiến bạn nghĩ mãi."]), fact,
        choices: [{ k: 'dog', label: "Nuôi một chú chó", sub: L`한 해 약 ${wonStr(petCost('d'))} · 10~15년 함께` }, { k: 'cat', label: "Nuôi một chú mèo", sub: L`한 해 약 ${wonStr(petCost('c'))} · 12~18년 함께` },
          ...petSmallChoices(), { k: 'no', label: "Bây giờ thì chưa", sub: '' }] }; },
    apply: (k, p, nm) => {
      S.flags.petAsk = S.age; if (k === 'no') { S.flags.petNo = (S.flags.petNo || 0) + 1; return false; }
      if (k === 'beg') { if (!chance(clamp(0.25 + 0.08 * (S.q - 3) + petOwn(C()) * 0.6, 0.1, 0.8))) { eff({ h: -2 }); return L`${iga(carerW())} 아직은 안 된다고 하셨습니다.`; } k = 'dog'; }
      if (/^pk_[hrbf]$/.test(k)) return petAdopt(k.slice(3), nm);
      if (k === 'small') return petAdopt(S.flags.petSm || 'h', nm);
      const t = petAdopt(k === 'dog' ? 'd' : 'c', nm);
      if (k === 'dog' && S.cur === 'IRN' && S.urban && (calYr() >= 2025 || (calYr() >= 2019 && S.city === (CITIES.IRN || '').split(',')[0])))
        return { t: t + ' ' + "Dắt chó ra phố hay vào công viên đều bị cấm, nên bạn chỉ dắt nó đi dạo quanh nhà vào lúc vắng người.", k: 'big', f: "Ở Iran, năm 2019 cảnh sát Tehran cấm dắt chó đi dạo nơi công cộng, và đến năm 2025 lệnh cấm đã lan ra ít nhất 18 thành phố. Không có luật quốc gia nào cấm nuôi chó trong nhà (Đài Âu Châu Tự Do 2025)" };
      return t;
    }
  },
  petsick: {
    ok: () => !!S.pet,
    build: () => { const P = S.pet, cost = incomeAt(C(), 0.5) * (C().p === 'hi' ? 0.08 : 0.05) * (petVetPar() ? 1 : petIncK()); S.flags.petVet = cost;
      return { title: L`${iga(P.n)} 아파요`, body: L`${S.age - P.at}살 ${iga(P.n)} 며칠째 밥을 먹지 않습니다. 동물병원에서는 치료하면 나을 수도 있다고 합니다.`,
        choices: [{ k: 'treat', label: "Chữa trị", sub: petVetPar() ? L`치료비 약 ${wonStr(cost)}은 부모님이 내요 · 나을 수도, 아닐 수도` : L`약 ${wonStr(cost)} · 나을 수도, 아닐 수도` }, { k: 'comfort', label: "Ở bên và để bé ra đi thanh thản", sub: '' }] }; },
    apply: k => {
      const P = S.pet, par = petVetPar();
      if (k === 'treat') { if (!par) S.money -= S.flags.petVet; if (chance(0.65)) { eff({ h: 2 }); P.life = Math.max(P.life, S.age - P.at + ri(1, 3)); return par ? L`부모님이 치료비를 내 주셨고, 치료를 받은 ${iga(P.n)} 다시 기운을 차렸습니다.` : L`치료를 받은 ${iga(P.n)} 다시 기운을 차렸습니다. (−${wonStr(S.flags.petVet)})`; }
        return { t: par ? L`부모님이 치료비를 내 주셨지만, ${iga(P.n)} 끝내 떠났습니다.` : L`치료를 받았지만 ${iga(P.n)} 끝내 떠났습니다. (−${wonStr(S.flags.petVet)})`, k: 'loss', post: () => { petMemo(S.pet); S.pet = null; S.flags.petGone = S.age; eff({ h: -7 }); } }; }
      return { t: L`${eul(P.n)} 품에 안고 편히 보내 주었습니다.`, k: 'loss', post: () => { petMemo(S.pet); S.pet = null; S.flags.petGone = S.age; eff({ h: -6 }); } };
    }
  },
  biz: {
    ok: () => !S.retired && S.job !== 'owner' && !nkLife(),
    build: (p = {}) => {
      const base = Math.max(incomeAt(C(), 0.5) * 1.5, S.income), ks = bizKinds(4), back = S.flags.bizFail != null ? S.age - S.flags.bizFail : 0;
      S.flags.bizBase = base;
      const ch = ks.map(k => { const K = BIZ_K[k], cost = base * K.cost, fit = bizFit(k);
        return { k, label: bizLabel(k), sub: fit ? L`약 ${wonStr(cost)} · 해 온 일과 가까움` : K.close >= 0.1 ? L`약 ${wonStr(cost)} · 문 닫는 곳이 많음` : K.close <= 0.06 ? L`약 ${wonStr(cost)} · 오래가는 곳이 많음` : L`약 ${wonStr(cost)}` }; });
      const soon = Object.keys(BIZ_K).find(k => BIZ_K[k].pro && BIZ_K[k].fit.includes(S.job) && !ks.includes(k));
      const rv = { title: p.plan ? "Bắt đầu kinh doanh riêng?" : p.again ? "Thử tự kinh doanh lần nữa?" : "Thử tự kinh doanh?",
        body: p.plan ? "Bạn đã dành một năm tìm hiểu chuyện khởi nghiệp. Những việc đáng thử đã thu hẹp lại còn vài hướng. Bạn sẽ thử việc nào?" : p.again ? L`${back}년 전 사업을 접었습니다. 그때 배운 것도 있습니다. 다시 해 볼까요?` : S.flags.retBiz >= S.age ? "Với số tiền và kinh nghiệm tích góp được ở nước ngoài, bạn có thể tự kinh doanh ở quê nhà. Bạn sẽ thử làm gì?" : S.job === 'seeking' ? "Thay vì đi tìm việc, bạn cũng có thể tự gây dựng công việc của riêng mình. Bạn sẽ thử làm gì?" : "Mong muốn tự làm chủ thay vì làm công ăn lương ngày càng lớn trong bạn. Bạn sẽ thử làm gì?",
        fact: p.again ? "Người khởi nghiệp từng thất bại một lần có khả năng thành công ở lần sau tương đương hoặc cao hơn một chút so với người khởi nghiệp lần đầu (Gompers và cộng sự 2010, các công ty được đầu tư mạo hiểm)" : S.flags.retBiz >= S.age ? "Những người đi làm ở nước ngoài rồi trở về khởi nghiệp nhiều hơn những người ở lại quê, nhờ số tiền tích góp và kinh nghiệm mang về (Wahba & Zenou 2012, Ai Cập)" : "Khoảng một nửa số doanh nghiệp mới đóng cửa trong vòng 5 năm: nhà hàng và bán lẻ đóng cửa nhiều hơn, những nghề dựa vào tay nghề thì ít hơn (OECD, nhân khẩu học doanh nghiệp; Cục Thống kê Lao động Mỹ)",
        choices: ch.concat([p.plan ? { k: 'no', label: "Chưa phải lúc này", sub: S.job === 'seeking' ? '' : "Tiếp tục công việc hiện tại" } : S.job === 'seeking' ? { k: 'no', label: "Tiếp tục tìm việc", sub: '' } : { k: 'no', label: "Chọn sự ổn định", sub: "Tiếp tục công việc hiện tại" }]) };
      if (soon && !bizFit(soon)) rv.body += ' ' + L`${eun(BIZ_K[soon].n)} 지금 하는 일을 3년 넘게 한 뒤에 열 수 있습니다.`;
      return rv;
    },
    apply: (k, p = {}) => {
      if (p.again) S.flags.bizAgain = 1;
      if (k === 'no') return false;
      if (k === 'go') { k = 'shop'; S.flags.bizBase = S.flags.bizCost || Math.max(incomeAt(C(), 0.5) * 1.5, S.income); return bizStart(k, 'loan'); }
      return { t: L`${eul(bizName(k))} 해 보기로 마음먹었습니다.`, k: 'ev', post: () => openDecision('bizfund', { k }) };
    }
  },
  bizfund: {
    ok: p => !!(p && BIZ_K[p.k]) && !S.retired,
    build: p => { const cost = S.flags.bizBase * BIZ_K[p.k].cost, small = cost * 0.4, room = bizRoom(), broke = room < 1;
      return { title: "Lấy đâu ra tiền để bắt đầu?", body: L`${eul(bizName(p.k))} 제대로 시작하려면 약 ${wonStr(cost)}이 듭니다. 지금 가진 돈은 ${wonStr(Math.max(0, S.money))}입니다.`,
        fact: "Hơn một nửa số người mới khởi nghiệp bắt đầu bằng tiền tiết kiệm của mình; vay ngân hàng hay góp vốn cùng người khác ít hơn (Cục Điều tra Dân số Mỹ, Annual Business Survey)",
        locked: [S.money < small ? { label: "Bắt đầu nhỏ bằng tiền tiết kiệm", sub: L`모은 돈이 약 ${wonStr(small)} 있어야 해요` } : null,
          famCanHelp() && S.age <= 50 && !bizFamFund() ? { label: "Bắt đầu bài bản nhờ bố mẹ giúp đỡ", sub: lockedWhy(0) } : null,
          broke ? { label: "Vay được bao nhiêu thì vay, bắt đầu nhỏ", sub: "Không còn chỗ nào để vay thêm" } : null, broke ? { label: "Bắt đầu cùng một người cộng sự", sub: "Không còn chỗ nào để vay thêm" } : null].filter(Boolean),
        choices: [S.money >= small ? { k: 'save', label: "Bắt đầu nhỏ bằng tiền tiết kiệm", sub: L`약 ${wonStr(small)} · 빚 없이, 벌이도 작게` } : null,
          bizFamFund() ? { k: 'fam', label: "Bắt đầu bài bản nhờ bố mẹ giúp đỡ", sub: bizFamFund() >= 1 ? L`부모님이 약 ${wonStr(cost)}을 모두 대 줌` : L`부모님이 약 ${wonStr(cost * bizFamFund())}을 보태 줌 · 나머지는 대출` } : null,
          broke ? null : room < cost ? { k: 'loan', label: "Vay được bao nhiêu thì vay, bắt đầu nhỏ", sub: L`약 ${wonStr(room)} · 잘 안되면 빚이 남음` } : { k: 'loan', label: "Vay tiền để bắt đầu bài bản", sub: L`약 ${wonStr(cost)} · 잘 안되면 빚이 남음` },
          broke ? null : { k: 'partner', label: "Bắt đầu cùng một người cộng sự", sub: "Chia đôi chi phí và lợi nhuận · có thể nảy sinh bất hòa" },
          { k: 'no', label: "Thôi không làm nữa", sub: "Tiếp tục công việc hiện tại" }].filter(Boolean) }; },
    apply: (k, p) => k === 'no' ? "Nghĩ kỹ rồi, bạn quyết định tiếp tục công việc hiện tại." : bizStart(p.k, k)
  },
  bizop: {
    ok: p => S.job === 'owner' && !S.retired && S.job !== 'prison' && !bigCo(),
    build: p => {
      const c = C(), med = incomeAt(c, 0.5), k = p.k;
      if (k === 'hire') { const w = incomeAt(c, 0.25); S.flags.bizX = w;
        return { title: S.flags.bizHired ? "Lại thuê nhân viên?" : "Thuê nhân viên đầu tiên?", body: S.flags.bizHired ? L`형편이 나아지면서 다시 일손이 모자랍니다. 직원 한 명을 다시 두면 한 해 약 ${wonStr(w)}이 듭니다.` : L`일손이 모자라 손님을 놓치는 날이 늘었습니다. 직원 한 명을 두면 한 해 약 ${wonStr(w)}이 듭니다.`,
          fact: "Ở các nước đang phát triển, chưa đến một phần tư cơ sở kinh doanh nhỏ từng tuyển thêm người, và chỉ hơn 1% phát triển lên quá 10 người (Mead & Liedholm 1998)",
          choices: [{ k: 'hire', label: "Thuê nhân viên", sub: L`인건비 약 ${wonStr(w)} · 매출이 늘 수도` }].concat(bizFamHelp() ? [{ k: 'fam', label: "Cùng gia đình gánh vác", sub: "Tiết kiệm được tiền nhưng vất vả" }] : [], [{ k: 'alone', label: "Tiếp tục tự mình xoay xở", sub: '' }]) }; }
      if (k === 'ad') { const x = med * 0.15; S.flags.bizX = x;
        return { title: "Quảng bá cửa hàng?", body: (eraBefore(2008) ? L`오는 손님만 옵니다. 간판을 새로 달고 전단과 신문 광고를 내는 데 약 ${wonStr(x)}이 듭니다.` : L`오는 손님만 옵니다. 간판과 전단, 온라인 지도 등록과 광고에 약 ${wonStr(x)}이 듭니다.`),
          choices: [{ k: 'ad', label: "Quảng cáo", sub: L`약 ${wonStr(x)} · 손님이 늘 수도` }, { k: 'word', label: "Chờ khách truyền miệng", sub: '' }] }; }
      if (k === 'rent') { const x = med * 0.25; S.flags.bizX = x;
        return { title: "Tiền thuê tăng", body: L`건물주가 가게 임대료를 크게 올리겠다고 합니다. 한 해 약 ${wonStr(x)}이 더 듭니다.`,
          choices: [{ k: 'pay', label: "Chấp nhận tăng và cầm cự", sub: L`한 해 약 ${wonStr(x)} 더` }, { k: 'move', label: "Chuyển đến chỗ rẻ hơn", sub: "Tốn tiền chuyển chỗ · có thể mất một số khách quen" }, { k: 'talk', label: "Thương lượng với chủ nhà", sub: "Khoảng một nửa trường hợp được tăng ít hơn" }] }; }
      if (k === 'loan') { const x = med * 0.6; S.flags.bizX = x;
        return { title: "Thay thiết bị?", body: S.money >= x * 2 ? L`낡은 설비 때문에 일이 더딥니다. 새로 들이려면 약 ${wonStr(x)}이 듭니다.` : L`낡은 설비 때문에 일이 더딥니다. 새로 들이려면 약 ${wonStr(x)}이 들고, 모자란 돈은 대출을 받아야 합니다.`,
          choices: [{ k: 'buy', label: S.money >= x * 2 ? "Mua thiết bị mới" : "Vay tiền để mua", sub: L`약 ${wonStr(x)} · 일이 빨라짐` }, { k: 'wait', label: "Vừa sửa vừa dùng tiếp", sub: '' }] }; }
      const x = med * 0.4; S.flags.bizX = x;
      return { title: "Một năm làm ăn khó khăn", body: "Mấy tháng nay khách cứ vơi dần. Cứ thế này thì khó mà trụ nổi.",
        fact: "Trong số các doanh nghiệp mới mở, chỉ khoảng một nửa còn hoạt động sau 5 năm (OECD, thống kê nhân khẩu học doanh nghiệp)",
        choices: [{ k: 'price', label: "Giảm giá để cầm cự", sub: "Thu nhập giảm nhưng giữ được khách" }, { k: 'shrink', label: "Thu hẹp quy mô để cầm cự", sub: bizStaffN() ? "Giảm nhân viên và mặt bằng · thu nhập giảm nhưng nguy cơ đóng cửa cũng giảm" : "Rút ngắn giờ mở cửa và nhập ít hàng hơn · thu nhập giảm nhưng nguy cơ đóng cửa cũng giảm" }, S.money >= x * 2 ? { k: 'borrow', label: "Dùng tiền tiết kiệm để cầm cự", sub: L`약 ${wonStr(x)}` } : { k: 'borrow', label: "Vay tiền để cầm cự", sub: L`약 ${wonStr(x)} 빚` }, { k: 'close', label: "Đóng cửa trước khi quá muộn", sub: "Giữ được số tiền còn lại" }] };
    },
    apply: (k, p) => {
      const x = S.flags.bizX || 0, up = d => { S.pct = clamp(S.pct + d, 0.02, payTop()); }; S.flags.bizOpK = p.k;
      if (k === 'hire') { S.money -= x * 0.5;
        S.flags.bizHired = 1;
        if (chance(0.55)) { up(0.05); S.flags.bizStaff = 1; eff({ h: 3 }); return "Có nhân viên, bạn đỡ tất bật hơn và khách cũng đông lên."; }
        S.money -= x * 0.3; S.flags.bizStaff = 1; eff({ h: -3 }); return { t: L`매출이 생각만큼 늘지 않아 인건비가 부담이 되었습니다. (−${wonStr(x * 0.8)})`, k: 'bad' }; }
      if (k === 'fam') { S.flags.bizSolo = S.age; up(0.02); eff({ hl: -2, h: -1, so: 2 }); return "Gia đình phụ một tay. Tối nào cả nhà cũng cùng nhau dọn dẹp cửa hàng."; }
      if (k === 'alone') { S.flags.bizSolo = S.age; eff({ hl: -1 }); return "Bạn quyết định tiếp tục tự mình xoay xở."; }
      if (k === 'ad') { S.money -= x;
        if (chance(0.4)) { up(0.03); eff({ h: 3 }); return "Khách thấy quảng cáo mà tìm đến ngày một đông."; }
        eff({ h: -2 }); return { t: L`광고비만큼 손님이 늘지는 않았습니다. (−${wonStr(x)})`, k: 'bad' }; }
      if (k === 'word') return "Bạn quyết định tin vào lời truyền miệng của khách quen.";
      if (k === 'pay') { S.money -= x * 0.5; up(-0.02); eff({ h: -2 }); return "Bạn chấp nhận trả tiền thuê cao hơn. Tiền dư ra ít đi."; }
      if (k === 'move') { S.money -= x * 0.6; S.stats.moves++;
        if (chance(0.5)) { up(-0.03); eff({ h: -3 }); return { t: "Bạn đã chuyển cửa hàng. Vài khách quen không ghé nữa.", k: 'bad' }; }
        eff({ h: 1 }); return "Bạn đã chuyển cửa hàng. Khách quen vẫn tìm đến chỗ mới."; }
      if (k === 'talk') { if (chance(0.5)) { up(-0.01); return "Bạn nói chuyện với chủ nhà và mức tăng giảm được một nửa."; }
        S.money -= x * 0.5; up(-0.02); eff({ h: -2 }); return { t: "Thương lượng không thành. Cuối cùng bạn vẫn phải trả mức thuê mới.", k: 'bad' }; }
      if (k === 'buy') { const own = S.money >= x * 2; S.money -= x;
        if (chance(0.6)) { up(0.04); eff({ h: 3 }); return "Nhờ thiết bị mới, công việc nhanh hơn và đơn hàng cũng tăng."; }
        eff({ h: -3 }); return { t: own ? L`설비는 좋아졌지만 주문은 그대로입니다. (−${wonStr(x)})` : L`설비는 좋아졌지만 주문은 그대로입니다. 대출을 갚아 나가야 합니다. (−${wonStr(x)})`, k: 'bad' }; }
      if (k === 'wait') return "Bạn quyết định sửa chữa để dùng thêm một thời gian nữa.";
      if (k === 'price') { up(-0.03); if (chance(0.6)) return "Giảm giá xong, khách dần dần quay lại.";
        S.flags.bizRisk = S.age; eff({ h: -3 }); return { t: "Dù đã giảm giá, khách vẫn không dễ gì quay lại.", k: 'bad' }; }
      if (k === 'shrink') { const r = rankOf('owner'), had = bizStaffN(); up(-0.05); if (r) setRank('owner', r - 1); if (had) S.flags.bizHired = 1; S.flags.bizStaff = 0; S.flags.bizBig = 0; S.flags.bizCut = S.age; eff({ h: -2 });
        return had ? "Bạn đã cắt giảm nhân viên và thu hẹp quy mô cửa hàng. Thu nhập ít đi nhưng có vẻ sẽ vượt qua được giai đoạn khó khăn." : "Bạn đã rút ngắn giờ mở cửa và nhập ít hàng hơn. Thu nhập ít đi nhưng có vẻ sẽ vượt qua được giai đoạn khó khăn."; }
      if (k === 'borrow') { const own = S.money >= x * 2; S.money -= x; if (chance(0.6)) { eff({ h: -1 }); return own ? "Nhờ tiền tiết kiệm, bạn đã vượt qua giai đoạn khó khăn." : "Nhờ tiền vay, bạn đã vượt qua giai đoạn khó khăn."; }
        S.flags.bizRisk = S.age; eff({ h: -4 }); return { t: own ? L`모아 둔 돈으로 버텼지만 형편은 나아지지 않았습니다. (−${wonStr(x)})` : L`빌린 돈으로 버텼지만 형편은 나아지지 않았습니다. (−${wonStr(x)})`, k: 'bad' }; }
      S.flags.lastJob = 'owner'; S.job = 'seeking'; S.flags.seekY = 0; setRank('owner', 0); S.flags.bizFail = S.age; S.flags.bizK = null; S.flags.bizBig = 0; S.flags.bizL = 0; S.flags.bizScale = 0; S.flags.bizPt = 0; S.flags.bizStaff = 0;
      S.money += incomeAt(C(), 0.5) * 0.15; eff({ h: -5 }); S.yearMark = 'job';
      return { t: "Bạn đóng cửa hàng trước khi quá muộn. Bán hết hàng còn lại nên bạn không phải mang nợ.", k: 'bad' };
    }
  },
  cmarry: {
    build: () => ({ title: "Chuyện kết hôn sớm", body: B().p === 'sa' ? L`${iga(parW())} ${S.age}세인 당신의 결혼을 서두르려 합니다. 상대 집안과 지참금 이야기가 오가고 있습니다.` : B().p === 'ssa' ? L`${iga(parW())} ${S.age}세인 당신의 결혼을 서두르려 합니다. 상대 집안에서 신붓값 이야기가 오가고 있습니다.` : L`${iga(parW())} ${S.age}세인 당신의 결혼을 서두르려 합니다. 두 집안 사이에 혼담이 오가고 있습니다.`, fact: B().id === 'PHL' ? L`${B().ko}에서는 20~24세 여성의 약 ${B().cm}%가 18세 이전에 결혼하거나 함께 살기 시작했습니다 (UNICEF)` : L`${B().ko}에서는 20~24세 여성의 약 ${B().cm}%가 18세 이전에 결혼했습니다 (UNICEF)`,
      choices: [{ k: 'refuse', label: S.school ? "Thuyết phục hoãn lại để còn đi học" : "Thuyết phục hoãn lại vì mình còn quá trẻ", sub: "Thuyết phục được hay không tùy vào hoàn cảnh gia đình và mối quan hệ" }, { k: 'accept', label: L`${parW()} 뜻을 따른다`, sub: cmVoid() ? (S.school ? "Sống chung không đăng ký kết hôn, thường sẽ phải nghỉ học" : "Sống chung không đăng ký kết hôn") : S.school ? "Kết hôn, thường sẽ phải nghỉ học" : "Kết hôn" }] }),
    apply: k => {
      S.done.cmarry = 1;
      if (k === 'refuse' && chance((0.3 + S.edu * 0.1 + (S.q - 1) * 0.07 + S.st.so / 300) * (B().cm > 50 ? clamp(1 - (B().cm - 50) / 50, 0.4, 1) : 1))) { eff({ so: -3 }); return L`${eul(parW())} 설득했습니다. 결혼은 미뤄졌습니다.`; }
      const wasIn = !!S.school, keep = wasIn && chance(CM_KEEP[B().p] || 0.2); if (wasIn && !keep) S.flags.wedLeft = 1;
      const inf = cmVoid();
      marry(true, inf ? { cohab: true } : {}); S.flags.cmWed = S.age; if (keep) { S.flags.cmSch = 1; S.job = 'student'; } else { S.school = null; S.job = 'homemaker'; }
      eff({ h: -8, sm: wasIn && !keep ? -2 : 0 });
      if (inf) {
        const t1 = k === 'refuse' ? "Thuyết phục không thành, bạn về sống chung với người ấy mà không đăng ký kết hôn." : "Bạn về sống chung với người ấy mà không đăng ký kết hôn.";
        return { t: t1 + (keep ? ' ' + "Được gia đình bên kia cho phép, bạn vẫn tiếp tục đi học." : wasIn ? ' ' + "Bạn đã nghỉ học." : '') + coLine(), k: 'bad',
          f: calYr() >= 2022 ? "Từ Bộ luật Gia đình năm 1988, Philippines không công nhận hôn nhân của người dưới 18 tuổi, và từ năm 2022 luật pháp cấm kết hôn hay chung sống với trẻ em." + ' ' + "Kết hôn hay chung sống trước 18 tuổi là vi phạm quyền trẻ em (Luật Cộng hòa số 11596, Mục tiêu Phát triển Bền vững 5.3 của Liên Hợp Quốc, UNICEF)"
            : "Từ Bộ luật Gia đình năm 1988, Philippines không công nhận hôn nhân của người dưới 18 tuổi." + ' ' + "Kết hôn hay chung sống trước 18 tuổi là vi phạm quyền trẻ em (Mục tiêu Phát triển Bền vững 5.3 của Liên Hợp Quốc, UNICEF)" };
      }
      const t0 = k === 'refuse' ? "Thuyết phục không thành, đám cưới vẫn diễn ra." : "Đám cưới đã diễn ra.";
      return { t: (keep ? t0 + ' ' + "Được nhà chồng cho phép, bạn vẫn tiếp tục đi học." : k === 'refuse' || !wasIn ? t0 : "Đám cưới đã diễn ra. Bạn đã nghỉ học.") + coLine(), k: 'bad', f: "Kết hôn trước 18 tuổi là vi phạm quyền trẻ em. Thế giới đã cam kết chấm dứt tình trạng tảo hôn trước năm 2030 (Mục tiêu Phát triển Bền vững 5.3 của Liên Hợp Quốc, UNICEF)" };
    }
  },
  partner: {
    ok: p => !S.flags.celib && !(p && p.mxn && (S.fam.married || S.fam.dating)),
    build: p => {
      const c = C(); let arranged = ['sa', 'mena'].includes(c.p) || (c.p === 'ssa' && chance(0.4)) || (S.cur === 'CHN' && chance(0.2));
      const mk = p && p.k, mx = mk === 'match';
      const ss = S.age >= 18 && ((mk === 'ss' && S.flags.bi && ssLegal(c, calYr()) != null) || candSS()), psex = ss ? S.sex : S.sex === 'M' ? 'F' : 'M', sl = ss ? ssLegal(c, calYr()) || 'none' : 'm';
      if (ss) arranged = false;
      if (mx && !ss) arranged = !loveFirst(c);
      const prevSex = S.flags.lastPs || (S.fam.dating && S.fam.dating.sex) || (S.fam.partner && S.fam.partner.sex) || null;
      const biT = S.flags.bi && !arranged && prevSex && prevSex !== psex ? ' ' + (psex === 'F' ? "Mối tình trước của bạn là một người đàn ông, còn lần này bạn rung động trước một người phụ nữ." : "Mối tình trước của bạn là một người phụ nữ, còn lần này bạn rung động trước một người đàn ông.") : '';
      const here = studyAway() && CBY[studyAway()] ? studyAway() : S.cur, hc = here === S.cur ? c : CBY[here];
      let nat = mk === 'intl' ? intlNat(c) : candNat(); if (arranged && nat === here && mk !== 'intl') nat = S.born;
      const prel = nat && nat !== S.born ? relPick(nat === S.cur ? c : CBY[nat]) : S.rel;
      const cl = nat === S.cur ? (S.cur === 'ZAF' && S.born === 'ZAF' && S.eth && chance(0.92) ? S.cl : clusterFor(c, prel)) : nat && nat !== S.born ? clusterFor(CBY[nat], prel) : S.cl;
      const ct = !ss && (!nat || nat === S.born) && cl === S.cl ? casteCand(arranged) : null;
      const pname = partnerName(cl, psex, { rel: S.rel === 'S' ? 'S' : undefined, family: ct ? casteSurBut(ct.g, cl, S.name && S.name.base) : undefined });
      const again = wasMarried(), g = again ? gapDrawRe(c) : gapDraw(c), met = p && p.meet;
      let page = ss ? clamp(S.age + ri(-5, 5), 18, 90) : S.sex === 'M' ? Math.max(18, S.age - g) : clamp(S.age + g, 18, 90), co = null;
      const brk = mk === 'intl' && intlBroker() && !ss;
      if (brk) page = Math.max(20, S.age - (chance(0.4) ? ri(10, 18) : ri(3, 9)));
      if (mx && !ss && !brk && (MATCH_CO.has(c.id) || !arranged)) { const ag = MATCH_CO.has(c.id), lo = ag ? 23 : 20, gg = ag ? Math.min(g, 6) : g;
        page = S.sex === 'M' ? Math.max(lo, S.age - gg) : clamp(S.age + gg, lo, 90); }
      if (mk === 'wide') page = ss ? clamp(S.age - ri(8, 18), 25, 90) : S.sex === 'M' ? (chance(0.23) ? clamp(S.age + ri(6, 12), 25, 95) : Math.max(25, S.age - ri(10, Math.max(10, Math.min(25, S.age - 25)))))
        : chance(0.72) ? clamp(S.age + ri(8, 18), 25, 95) : Math.max(25, S.age - ri(6, 14));
      if (S.sex === 'F' && !ss && chance(Math.min(0.5, polyRate(c, S.rel) * polyMe() * 0.55 * (again ? 1.6 : 1)))) {
        page = clamp(S.age + Math.round(coupleGap(c)) + ri(3, 12), 18, 90);
        co = { name: freshName(cl, 'F'), age: clamp(page - ri(0, 9), 18, 90), kids: ri(0, 3) };
      }
      const eduQ = S.school === 'phd' || S.school === 'grad' || S.edu >= 5 ? 4 : S.school === 'uni' || S.edu >= 4 ? 3 : S.edu >= 3 ? 2 : 1;
      const own = S.age >= 18 ? Math.max(Math.round(clamp(S.pct - P_AGE(S.age) + P_AGE(45), 0, 0.99) * 5 + 0.5), S.age < 35 ? eduQ : 1) : S.q;
      const pq = clamp(mx ? own + (chance(0.45) ? 1 : 0) : own + ri(-1, 1), 1, 5);
      S.flags.cand = { name: pname, age: page, sex: psex, q: pq };
      if (mx) S.flags.cand.mx = 1;
      if (mx && p.mxn) S.flags.cand.mxi = p.mxn;
      if (nat) S.flags.cand.nat = nat;
      if (prel !== S.rel) S.flags.cand.rel = prel;
      const cx = !!(ct && ct.x), obj = (nat === here && nat !== S.born && !ss && chance(natObjP(hc))) || (cx && chance(arranged ? 0.4 : 0.6)); if (obj) S.flags.cand.obj = 1;
      if (ct) { S.flags.cand.ct = ct.g; if (cx) S.flags.cand.cx = 1; }
      if (co) S.flags.cand.co = co;
      if (!co && page >= 25 && chance(again ? 0.45 : page >= 32 ? 0.06 : 0)) {
        const n = chance(0.6) ? 1 : chance(0.85) ? 2 : 3;
        const kLo = Math.max(1, page - (psex === 'F' ? 43 : 50)), kHi = Math.max(kLo, page - 20);
        S.flags.cand.pk = Array.from({ length: n }, () => ({ sex: chance(0.512) ? 'M' : 'F', age: ri(kLo, kHi) })).sort((x, y) => y.age - x.age);
        S.flags.cand.pkAt = S.age;
      }
      const PK = S.flags.cand.pk, pkGrown = PK && PK.every(x => x.age >= 18);
      const love = loveFirst(c) && !arranged && !co && !brk;
      const pkT = PK ? ' ' + (PK.length > 1 ? (pkGrown ? L`그에게는 다 자란 자녀가 ${PK.length}명 있습니다 (${pkAges(PK.map(x => x.age))}).` : L`그에게는 아이가 ${PK.length}명 있습니다 (${pkAges(PK.map(x => x.age))}).`)
        : pkGrown ? L`그에게는 다 자란 자녀가 하나 있습니다 (${PK[0].age}살).` : L`그에게는 ${PK[0].age}살 아이가 하나 있습니다.`) : '';
      const myDeg = S.edu >= 4 || S.school === 'uni' || S.school === 'grad' || S.school === 'phd', cDeg = myDeg && page >= 22 && chance(mx || arranged ? CAND_DEG.mx : CAND_DEG.love);
      if (page >= 18) S.flags.cand.job = partnerJobFor({ base: pBase(pq, psex, psex === S.sex), age: page, sex: psex, dev: 0, mp: 0, uni: cDeg || undefined }, c);
      if (cDeg) S.flags.cand.deg = 1;
      if (page >= retireAge(c)) { const pen = penDraw(c); S.flags.cand.pen = pen; if (ptRetOld(page, pen, c)) S.flags.cand.ret = 1; }
      const jobT = !S.flags.cand.job ? '' : ' ' + (S.flags.cand.ret ? L`하는 일: 은퇴 (전에는 ${frSx(JOBS[S.flags.cand.job].n, psex)}).` : L`하는 일: ${frSx(JOBS[S.flags.cand.job].n, psex)}.`);
      const desc = ["ân cần", "chăm chỉ", "hài hước", "tháo vát", "trầm tính", "hoạt bát"];
      S.flags.cand.arr = arranged ? 1 : 0;
      return { title: brk ? "Mai mối kết hôn với người nước ngoài" : again ? (arranged ? "Mai mối tái hôn" : "Tình yêu lại đến") : arranged ? "Lời mai mối" : "Tình yêu đã đến", body: L`${brk ? "Người do công ty môi giới hôn nhân quốc tế giới thiệu" : mx ? (p.mxn > 1 ? (MATCH_CO.has(c.id) ? "Người tiếp theo do công ty mai mối hôn nhân giới thiệu" : "Người tiếp theo do người mai mối giới thiệu") : MATCH_CO.has(c.id) ? "Người do công ty mai mối hôn nhân giới thiệu" : "Người do người mai mối giới thiệu") : arranged ? "Người do người lớn trong gia đình giới thiệu" : met ? "Người bạn gặp ở một buổi gặp mặt" : "Người bạn đã quen biết từ lâu"} ${page}세 ${pick(desc)} ${psex === 'F' ? "nữ giới" : "nam giới"}, ${pname.full}${nat ? L` (${natWord(nat)})` : ''}.` + (obj ? ' ' + (cx ? "Hai bạn thuộc hai đẳng cấp khác nhau, người lớn hai bên gia đình đều phản đối cuộc hôn nhân." : "Gia đình bên kia phản đối việc kết hôn với người nước ngoài.") : cx ? ' ' + "Người ấy xuất thân từ một gia đình thuộc đẳng cấp khác." : '') + jobT + (co ?' ' + (co.kids > 1 ? L`그에게는 이미 아내 한 명과 아이 ${co.kids}명이 있습니다.` : co.kids ? "Người ấy đã có một người vợ và một đứa con." : "Người ấy đã có một người vợ.") : '') + pkT + biT + (mx && p.mxl ? ' ' + "Đây là lần giới thiệu cuối cùng trong số những lần đã hứa." : '') + (love ? '' : ptNwT(S.flags.cand, c)),
        fact: ss && !transB() ? ssFact(c) : biT ? BI_FACT : co ? polyFact(c) : cx && S.caste.c === 'IND' ? CASTE_X_F : nat && nat !== S.born ? natFact(hc) : pkT ? "Khoảng 16% trẻ em Mỹ lớn lên trong gia đình tái hôn, có cha mẹ kế hoặc anh chị em khác cha hay khác mẹ (Pew Research Center 2015)"
          : again && Math.abs(page - S.age) >= 10 ? "Trong số đàn ông Mỹ tái hôn, 20% cưới vợ kém mình từ 10 tuổi trở lên; ở phụ nữ, 13% lấy chồng hơn mình từ 10 tuổi trở lên. Ở lần kết hôn đầu, các con số này là 5% và 7% (Pew Research Center 2014)"
          : !again && Math.abs(page - S.age) >= 6 ? (coupleGap(c) >= 5 ? L`${c.ko}에서는 남편이 아내보다 평균 ${Math.round(coupleGap(c))}살쯤 많습니다. 이만한 나이 차는 드물지 않습니다 (UN 세계 결혼 자료, DHS)` : L`${c.ko}에서 부부의 나이 차는 평균 ${Math.round(coupleGap(c))}살쯤입니다. 이만큼 나는 경우는 흔하지 않습니다 (UN 세계 결혼 자료)`)
          : mx ? (MATCH_CO.has(c.id) ? "Các công ty mai mối hôn nhân phân hạng hội viên theo công việc, học vấn và gia cảnh rồi ghép những người tương đương với nhau. Không nhiều lần giới thiệu đi đến hôn nhân" : "Người mai mối và các văn phòng môi giới hôn nhân thường ghép những người có gia cảnh, học vấn và điều kiện tương đương") : again ? "Ở Mỹ, cứ 10 cuộc hôn nhân mới thì có 4 cuộc mà ít nhất một người từng kết hôn trước đó (Pew Research Center 2014)" : S.sex === 'M' ? L`${c.ko} 남성의 평균 초혼 연령은 약 ${Math.round(afmM(c) + 0.5)}세로 추정됩니다` : L`${c.ko} 여성의 평균 초혼 연령은 약 ${afmF(c).toFixed(0)}세로 추정됩니다`,
        choices: love ? [{ k: 'date', label: "Thử tìm hiểu", sub: "Thời gian để hiểu nhau · chuyện cưới xin tính sau" }, { k: 'no', label: "Không thấy rung động", sub: '' }]
          : [obj ? Object.assign(wedChoice(sl), { sub: "Bất chấp gia đình phản đối" }) : wedChoice(sl), !ss && !arranged && !co && cohabOK(c) ? cohabChoice() : null, { k: 'date', label: arranged || brk ? "Tìm hiểu thêm một thời gian" : "Chỉ hẹn hò thôi", sub: "Hoãn quyết định" }, { k: 'no', label: arranged ? "Từ chối" : "Không thấy rung động", sub: arranged ? "Có thể nảy sinh mâu thuẫn với gia đình" : '' }].filter(Boolean) };
    },
    apply: k => {
      if ((k === 'yes' || k === 'cohab') && S.flags.cand && S.flags.cand.obj && chance(0.25)) { const who = callName(S.flags.cand.name); S.flags.cand = null; eff({ h: -6, so: -2 }); return { t: L`${iga(who)} 끝내 집안의 반대를 넘지 못했습니다. 둘은 헤어졌습니다.`, k: 'loss' }; }
      { const cd = S.flags.cand; if (cd && cd.mxi && (k === 'yes' || k === 'cohab' || k === 'date') && chance(cd.arr ? MX_NO_ARR : MX_NO)) {
        const who = callName(cd.name); S.flags.cand = null; eff({ h: -2 });
        return { t: (cd.arr ? L`${who} 쪽 집안에서 정중히 거절해 왔습니다.` : L`${who}에게서 더 만나기는 어렵겠다는 연락이 왔습니다.`) + mxNext(), k: 'ev' }; } }
      if (S.flags.cand && (k === 'yes' || k === 'cohab' || k === 'date')) S.flags.lastPs = S.flags.cand.sex;
      if (S.flags.mx && S.flags.cand && S.flags.cand.mxi) S.flags.mx.next = null;
      if (k === 'yes' || k === 'cohab') { const again = wasMarried(), obj = S.flags.cand && S.flags.cand.obj; marry(false, { cohab: k === 'cohab' }); if (obj) eff({ so: -2 }); return wedLine(again) + coLine() + (obj ? ' ' + "Theo thời gian, gia đình bên kia từng phản đối cũng dần mở lòng." : ''); }
      if (k === 'no') { eff({ so: -2 }); const mi = S.flags.cand && S.flags.cand.mxi; S.flags.cand = null; S.flags.ptNo = (S.flags.ptNo || 0) + 1; S.flags.ptNoAt = S.age; const nx = mi ? mxNext().trim() : ''; return nx ? { t: nx, k: 'ev' } : false; }
      const cand = S.flags.cand; S.flags.cand = null; eff({ h: 3, so: 2 }); S.flags.ptNo = 0;
      if (!cand) return false;
      S.fam.dating = Object.assign({}, cand, { since: S.age }); S.flags.last_wedtalk = S.age;
      return cand.arr ? L`${wa(callName(cand.name))} 몇 번 더 만나 보기로 했습니다.` : L`${wa(callName(cand.name))} 연애를 시작했습니다.`;
    }
  },
  prq: {
    ok: () => settleOK() && S.flags.pr == null,
    build: () => { const c = C(), y = S.age - S.migY, fee = settleFee(c), st = settleRule(c);
      return { title: "Nộp đơn xin thường trú?", body: L`${c.ko}에서 산 지 ${y}년이 되었습니다. 영주권이 있으면 비자를 갱신하지 않아도 되고, 일자리를 옮기기도 쉬워집니다. 서류와 수수료가 들고 심사에 몇 달이 걸립니다.` + (st && st.spP ? ' ' + L`${c.ko} 시민인 배우자가 있어 기다리는 기간이 짧았습니다.` : ''),
        fact: c.id === 'USA' ? "Mỗi năm Mỹ cấp quyền thường trú (thẻ xanh) cho khoảng 1 triệu người (Bộ An ninh Nội địa Mỹ 2022)" : c.id === 'CAN' ? "Năm 2024, Canada cấp quyền thường trú cho khoảng 480.000 người (Bộ Di trú, Tị nạn và Quốc tịch Canada)" : "Ở các nước OECD, khoảng hai phần ba người nhập cư đã sống ở đó trên 10 năm có quốc tịch nước đó (OECD 2023)",
        choices: [{ k: 'go', label: "Nộp đơn xin thường trú", sub: L`비용 약 ${wonStr(fee)} · 일과 기록에 따라 심사` }, { k: 'no', label: "Bây giờ thì chưa", sub: '' }] }; },
    apply: k => {
      if (k === 'no') return false;
      const c = C(), st = settleRule(c) || { po: 0.5 }; S.money -= settleFee(c);
      const p = (prSkill() ? Math.max(st.po, PR_SKILL) : st.po) * (isWorking() ? 1 : 0.7) * (1 - 0.7 * recW()) * (speaksHere() ? 1 : 0.85) * (S.fam.married ? 1.1 : 1);
      if (chance(clamp(p, 0.05, 0.95))) { S.flags.pr = S.age; S.migPen = Math.max(0, (S.migPen || 0) - 0.04); eff({ h: 8, so: 2 }); return { t: L`영주권이 나왔습니다! 이제 ${c.ko}에서 비자 걱정 없이 살 수 있습니다.`, k: 'big' }; }
      eff({ h: -4 }); return { t: "Đơn xin thường trú của bạn bị từ chối. Vài năm nữa bạn có thể nộp lại.", k: 'bad' };
    }
  },
  natq: {
    ok: () => settleOK() && S.flags.natz !== S.cur,
    build: () => { const c = C(), y = S.age - S.migY, st = settleRule(c) || { keep: true }, fee = settleFee(c), nn = natNameOK(c);
      const sub = st.keep ? L`시험·선서 · 비용 약 ${wonStr(fee)}` : L`${B().ko} 국적을 내려놓음 · 비용 약 ${wonStr(fee)}`;
      const jp = nn && natJpSpouse(c);
      return { title: L`${c.ko} 시민이 될까?`, body: L`${c.ko}에서 산 지 ${y}년이 되었습니다. 시민권 시험과 선서를 거치면 투표하고 선거에 나갈 수 있고, 여권도 바뀝니다.` + (st.spN ? ' ' + L`${c.ko} 시민인 배우자가 있어 기다리는 기간이 짧았습니다.` : '') + (st.keep ? '' : ' ' + L`다만 ${eun(c.ko)} 이중국적을 허락하지 않아 ${B().ko} 국적을 내려놓아야 합니다.`) + (nn ? ' ' + NAT_NAME[c.id].b : '') + (jp ? ' ' + L`일본에서는 부부가 같은 성을 쓰므로, 귀화하면 배우자의 성(${jp.name.base})을 따릅니다.` : ''),
        fact: nn ? NAT_NAME[c.id].f : "Ở các nước OECD, khoảng hai phần ba người nhập cư đã sống ở đó trên 10 năm có quốc tịch nước đó (OECD 2023)",
        choices: nn ? [{ k: 'go', label: "Nhập tịch, ghi tên mình theo phiên âm", sub }, { k: 'goname', label: L`귀화하며 ${c.ko} 이름을 새로 짓는다`, sub }, { k: 'no', label: "Giữ quốc tịch hiện tại", sub: '' }]
          : [{ k: 'go', label: "Nộp đơn xin nhập tịch", sub }, { k: 'no', label: "Giữ quốc tịch hiện tại", sub: '' }] }; },
    apply: k => {
      if (k === 'no') return false;
      const nk = k;
      const c = C(), st = settleRule(c) || { keep: true }; S.money -= settleFee(c);
      if (!chance(clamp(0.9 * (1 - 0.7 * recW()) * (speaksHere() ? 1 : 0.75), 0.05, 0.95))) { eff({ h: -3 }); return { t: "Bạn đã trượt kỳ thi quốc tịch. Bạn có thể chuẩn bị và thi lại.", k: 'bad' }; }
      S.flags.natz = c.id; S.flags.natzAt = S.age; if (!st.keep) S.flags.natzGave = S.born; eff({ h: 6, so: 3 });
      let nl = '';
      const jp = natNameOK(c) && natJpSpouse(c);
      if (jp) {
        let g = S.name.g;
        if (nk === 'goname') { const taken = familyNames(); for (let i = 0; i < 10; i++) { g = makeName('ja', meSex(), {}).g; if (!taken.has(g)) break; } }
        S.flags.natName = jp.name.base + ' ' + g; S.flags.natNm = { g, base: jp.name.base, cl: nk === 'goname' ? 'ja' : S.cl };
        nl = ' ' + L`배우자의 호적에 들어가며 성은 배우자를 따랐습니다. 새 이름은 ‘${S.flags.natName}’입니다.`;
      } else if (natNameOK(c)) {
        if (nk === 'goname') { let n; const taken = familyNames(); for (let i = 0; i < 10; i++) { n = makeName(clusterFor(c, relPick(c)), meSex(), {}); if (!taken.has(callName(n))) break; } S.flags.natName = n.full; S.flags.natNm = { g: n.g, base: n.base, cl: n.cl }; nl = ' ' + L`새 이름 ‘${n.full}’도 함께 올렸습니다.`; }
        else nl = ' ' + NAT_NAME[c.id].t;
      }
      return { t: L`시민권 선서를 하고 ${c.ko} 시민이 되었습니다.` + (st.keep ? '' : ' ' + L`${B().ko} 여권은 반납했습니다.`) + nl, k: 'big' };
    }
  },
  wedtalk: {
    ok: () => !!S.fam.dating && !S.fam.married,
    build: () => { const d = S.fam.dating, who = callName(d.name), y = Math.max(1, S.age - d.since), sl = d.sex === S.sex ? ssLegal(C(), calYr()) || 'none' : 'm';
      const nwT = ptNwT(d, C(), d.age + S.age - d.since);
      if (sl !== 'm') return { title: "Chuyện về sống chung", body: L`${wa(who)} 만난 지 ${y}년이 되었습니다. ${iga(who)} 함께 살자는 이야기를 꺼냅니다.` + nwT, fact: ssFact(C()),
        choices: [wedChoice(sl), { k: 'wait', label: "Hẹn hò thêm một thời gian", sub: "Không vội" }, { k: 'part', label: "Chia tay", sub: '' }] };
      if (wedBlocked()) return { title: "Chuyện về sống chung", body: L`${wa(who)} 만난 지 ${y}년이 되었습니다. ${iga(who)} 함께 살자는 이야기를 꺼냅니다.` + nwT, fact: PHL_SEP_F(),
        choices: [wedChoice('m'), { k: 'wait', label: "Hẹn hò thêm một thời gian", sub: "Không vội" }, { k: 'part', label: "Chia tay", sub: '' }] };
      const late = S.age >= 60 && d.age + S.age - d.since >= 55, kids = S.fam.kids.some(k => k.alive) || (d.pk && d.pk.length);
      const lateT = !late ? '' : ' ' + (kids ? "Kết hôn ở tuổi này, hai người còn bàn với nhau chuyện con cái đã trưởng thành, tài sản và lương hưu." : "Kết hôn ở tuổi này, hai người còn bàn với nhau chuyện tài sản và lương hưu.");
      return { title: "Chuyện cưới xin", body: L`${wa(who)} 만난 지 ${y}년이 되었습니다. ${iga(who)} 결혼 이야기를 꺼냅니다.` + lateT + nwT,
        fact: late && cohabOK(C()) ? "Ở Mỹ, năm 2016 có khoảng 4 triệu người từ 50 tuổi trở lên sống chung với bạn đời mà không kết hôn, tăng 75% so với năm 2007 (Pew Research Center 2017)" : C().id === 'PHL' && cohabOK(C()) ? PHL_LIVE_F() : "Ở Mỹ, hơn một nửa (53%) số cặp đính hôn đã hẹn hò 2–5 năm trước khi đính hôn (The Knot 2024)",
        choices: [wedBlocked() ? wedChoice('m') : { k: 'yes', label: "Kết hôn", sub: "Quan hệ↑ Hạnh phúc↑" }, cohabOK(C()) && !d.arr && !wedBlocked() && !dateFar() ? Object.assign(cohabChoice(), { label: "Hoãn cưới, sống chung trước" }) : null, d.arr ? { k: 'wait', label: "Tìm hiểu thêm một thời gian", sub: "Không vội" } : { k: 'wait', label: "Hẹn hò thêm một thời gian", sub: "Không vội" }, d.arr ? { k: 'part', label: "Từ chối", sub: "Có thể nảy sinh mâu thuẫn với gia đình" } : { k: 'part', label: "Chia tay", sub: '' }].filter(Boolean) }; },
    apply: k => {
      const d = S.fam.dating;
      if ((k === 'yes' || k === 'cohab') && d && d.obj && chance(0.25)) { S.fam.dating = null; eff({ h: -6, so: -2 }); return { t: L`${iga(callName(d.name))} 끝내 집안의 반대를 넘지 못했습니다. 둘은 헤어졌습니다.`, k: 'loss' }; }
      if (k === 'yes' || k === 'cohab') { const again = wasMarried(), obj = d && d.obj; S.flags.cand = Object.assign({}, d, { age: d.age + S.age - d.since }); S.fam.dating = null; marry(false, { cohab: k === 'cohab' }); if (obj) eff({ so: -2 }); return wedLine(again) + coLine() + (obj ? ' ' + "Theo thời gian, gia đình bên kia từng phản đối cũng dần mở lòng." : ''); }
      if (k === 'part') { S.fam.dating = null; eff({ h: -5, so: -3 }); return { t: d.arr ? L`${wa(callName(d.name))}의 혼담을 거절했습니다.` : L`${wa(callName(d.name))} 헤어졌습니다.`, k: 'loss' }; }
      if (chance(0.25)) { S.fam.dating = null; eff({ h: -6, so: -3 }); return { t: d.arr ? L`더 기다리자고 했지만, ${callName(d.name)} 쪽에서 혼담을 거두었습니다.` : L`더 기다리자고 했지만, ${iga(callName(d.name))} 끝내 이별을 말했습니다.`, k: 'loss' }; }
      eff({ so: 1 }); return d.arr ? "Bạn quyết định tìm hiểu thêm một thời gian." : "Bạn quyết định hẹn hò thêm một thời gian.";
    }
  },
  cohabwed: {
    ok: () => cohabNow() && !ptAway() && !wedBlocked(),
    build: () => { const c = C(), P = S.fam.partner, who = callName(P.name), y = Math.max(1, S.age - (S.fam.marriedAt || S.age));
      return { title: "Đến lúc kết hôn chưa?", body: L`${wa(who)} 함께 산 지 ${y}년이 되었습니다. 혼인신고를 하고 작은 결혼식을 올리자는 이야기가 나왔습니다.`,
        fact: c.id === 'USA' ? "Ở Mỹ, khoảng 70% cuộc hôn nhân đầu tiên là của những cặp đã sống chung trước khi cưới (CDC, Khảo sát Quốc gia về Tăng trưởng Gia đình)" : ['hi', 'eca'].includes(c.p) ? "Ở Liên minh châu Âu, hơn 40% trẻ em sinh ra có bố mẹ không kết hôn (Eurostat 2022)" : c.id === 'PHL' ? PHL_LIVE_F() : null,
        choices: [{ k: 'wed', label: "Kết hôn", sub: "Đăng ký kết hôn · đám cưới nhỏ" }, { k: 'stay', label: "Tiếp tục sống chung như hiện nay", sub: '' }] }; },
    apply: k => {
      const P = S.fam.partner;
      if (k === 'stay') { eff({ so: 1 }); return "Bạn quyết định tiếp tục sống chung như hiện nay."; }
      P.cohab = 0; P.wedA = S.age; const x = incomeAt(C(), 0.5) * 0.15; S.money -= x; eff({ h: 6, so: 4 }); S.yearMark = S.yearMark || 'love';
      return L`${wa(callName(P.name))} 혼인신고를 하고 가까운 사람들 앞에서 결혼식을 올렸습니다.`;
    }
  },
  datepreg: {
    ok: () => !!S.fam.dating && !S.fam.married,
    build: () => { const c = C(), d = S.fam.dating, who = callName(d.name), y = Math.max(1, S.age - d.since);
      return { title: S.sex === 'F' ? "Bạn đã có thai" : L`${iga(who)} 아이를 가졌습니다`, body: L`${wa(who)} 만난 지 ${y}년. 계획하지 않았던 아이가 생겼습니다. 둘이 어떻게 할지 이야기를 나눕니다.`,
        fact: c.id === 'KOR' ? "Ở Hàn Quốc, trong số trẻ sinh năm 2023, 4,7% có bố mẹ không kết hôn (Cục Thống kê Hàn Quốc)" : ['hi', 'eca', 'lac'].includes(c.p) ? "Ở các nước OECD, khoảng 40% trẻ em sinh ra có bố mẹ không kết hôn (Cơ sở dữ liệu Gia đình của OECD)" : c.id === 'PHL' ? PHL_BIRTH_F() : null,
        choices: [wedBlocked() ? null : { k: 'wed', label: "Kết hôn", sub: "Quan hệ↑" }, cohabOK(c) && !dateFar() ? { k: 'cohab', label: "Cùng nuôi con mà không kết hôn", sub: wedBlocked() ? "Cuộc hôn nhân với người bạn đời trước vẫn còn hiệu lực về mặt pháp lý" : "Không đăng ký kết hôn" } : null,
          { k: 'apart', label: S.sex === 'F' ? "Chia tay và một mình nuôi con" : "Chia tay nhưng gửi tiền cấp dưỡng nuôi con", sub: S.sex === 'F' ? "Có thể nhận được tiền cấp dưỡng, cũng có thể không" : "Con sống với mẹ" }].filter(Boolean) }; },
    apply: k => {
      const c = C(), d = S.fam.dating; if (!d) return false;
      if (k === 'wed' || k === 'cohab') {
        const again = wasMarried(); S.flags.cand = Object.assign({}, d, { age: d.age + S.age - d.since }); S.fam.dating = null; marry(false, { cohab: k === 'cohab' });
        return { t: wedLine(again) + ' ' + "Em bé sắp chào đời.", k: 'big', post: () => { if (S.phase === 'life') haveKid(); } };
      }
      S.fam.dating = null; eff({ h: -4, so: -3 });
      const exInc = incomeAt(c, clamp((d.q || 3) / 5 - 0.1, 0.05, 0.95));
      return { t: S.sex === 'F' ? L`${wa(callName(d.name))} 헤어지고 아이를 혼자 키우기로 했습니다.` : L`${wa(callName(d.name))} 헤어졌습니다. 아이는 엄마와 살고, 양육비를 보내기로 했습니다.`, k: 'bad',
        post: () => { if (S.phase !== 'life') return; const n = S.fam.kids.length; haveKid(); const born = S.fam.kids.slice(n).filter(x => x.alive); if (!born.length) return;
          for (const kid of born) { kid.cust = 1; if (S.sex === 'M') kid.away = 1; }
          if (S.sex === 'M') S.flags.custody = S.flags.custody || 'them'; else { S.flags.custody = S.flags.custody || 'me'; if (!(S.flags.exInc > 0)) S.flags.exInc = exInc; } } };
    }
  },
  cowife: {
    ok: () => S.fam.married && !!S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced && !S.fam.co && legalWed(),
    build: () => { const c = C(), P = S.fam.partner, who = callName(P.name);
      const cand = { name: freshName(S.cl, 'F'), age: w2Age(P.age, S.age, c) };
      S.flags.coCand = cand;
      return { title: "Chồng bạn muốn cưới vợ hai", body: L`남편 ${iga(who)} ${cand.age}세 ${eul(cand.name.full)} 두 번째 아내로 맞겠다고 합니다. 혼담은 이미 오가고 있습니다.`,
        fact: polyFact(c),
        choices: [{ k: 'accept', label: "Chấp nhận và sống chung một nhà", sub: "Hạnh phúc↓ · thu nhập của chồng chia cho hai gia đình" }, { k: 'apart', label: "Đề nghị được ở riêng một nhà", sub: "Nếu chồng có điều kiện thì sống riêng" }, { k: 'leave', label: "Không chấp nhận và ra đi", sub: "Ly hôn · cần nhà mẹ đẻ giúp đỡ" }] }; },
    apply: k => {
      const c = C(), P = S.fam.partner, cand = S.flags.coCand || { name: partnerName(S.cl, 'F', {}), age: clamp(S.age - 5, 18, 55) }, nm = callName(cand.name);
      S.flags.coCand = null;
      let held = false;
      if (k === 'leave') {
        if (chance(c.p === 'ssa' ? 0.75 : c.p === 'mena' ? 0.55 : 0.35)) { const t = divorceNow(c, false); return { t: "Bạn không thể chấp nhận một người vợ hai." + ' ' + t, k: 'bad', post: () => homemakerAlone(false) }; }
        held = true; k = 'accept';
      }
      const apart = k === 'apart' && (P.inc >= incomeAt(c, 0.5) * 0.9 || S.q >= 4 || S.income >= incomeAt(c, 0.5) * 0.6);
      S.fam.co = { name: cand.name, age: cand.age, kids: 0, home: apart ? 0 : 1, at: S.age }; S.flags.poly = 2;
      eff({ h: apart ? -5 : -8, so: -3 });
      return { t: held ? L`떠나려 했지만 친정에서도 돌아가라고 했습니다. ${iga(nm)} 들어와 한집에서 함께 살게 되었습니다.` : apart ? L`남편은 ${nm}에게 따로 집을 마련했습니다. 남편은 두 집을 오가며 지냅니다.` : k === 'apart' ? L`따로 살림을 차릴 형편이 되지 않았습니다. ${iga(nm)} 들어와 한집에서 함께 살게 되었습니다.` : L`${iga(nm)} 두 번째 아내로 들어와 한집에서 함께 살게 되었습니다.`, k: 'bad' };
    }
  },
  wife2: {
    ok: () => S.fam.married && !!S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced && !(S.fam.wife2 && S.fam.wife2.alive) && legalWed(),
    build: () => { const c = C(), who = callName(S.fam.partner.name), cost = wife2Cost(c);
      const cand = { name: freshName(S.cl, 'F'), age: w2Age(S.age, S.fam.partner.age, c) };
      S.flags.w2Cand = cand;
      return { title: "Cưới vợ hai?", body: L`집안 어른들이 ${cand.age}세 ${wa(cand.name.full)}의 혼담을 꺼냈습니다. 아내 ${eun(who)} 이 이야기를 반기지 않습니다.`,
        fact: polyFact(c),
        choices: [{ k: 'yes', label: "Cưới vợ hai", sub: L`혼례 비용 약 ${wonStr(cost)} · 두 살림 · 아내와의 사이↓` }, { k: 'no', label: "Giữ gia đình như hiện tại", sub: '' }] }; },
    apply: k => {
      const cand = S.flags.w2Cand, who = callName(S.fam.partner.name); S.flags.w2Cand = null; S.flags.last_wife2 = S.age;
      if (k === 'no' || !cand) { eff({ so: 2 }); return "Bạn quyết định giữ gia đình như hiện tại."; }
      S.money -= wife2Cost(C()); S.fam.wife2 = { name: cand.name, age: cand.age, alive: true, at: S.age }; S.flags.poly = 1;
      eff({ so: -5 });
      return L`${eul(callName(cand.name))} 두 번째 아내로 맞았습니다. 혼례와 신부 집안에 보낸 예물에 ${iga(wonStr(wife2Cost(C())))} 들었습니다. 아내 ${wa(who)}의 사이에는 한동안 찬바람이 불었습니다.`;
    }
  },
  sskids: {
    ok: () => S.fam.married && S.fam.partner && S.fam.partner.alive && S.fam.partner.ss && ssKidWays(),
    build: () => {
      const c = C(), P = S.fam.partner, who = callName(P.name), cost = incomeAt(c, 0.5) * (c.p === 'hi' ? 0.25 : 0.4); S.flags.ssCost = cost;
      const ch = [];
      if (ssDonor()) ch.push({ k: 'donor', label: "Có con nhờ tinh trùng hiến tặng", sub: L`병원 시술 약 ${wonStr(cost)} · 둘 중 한 사람이 출산` });
      if (ssSurro()) { const sc = S.flags.ssCostS = incomeAt(c, 0.5) * SURRO[c.id][1]; ch.push({ k: 'surro', label: "Có con nhờ người mang thai hộ", sub: L`이 나라 법이 정한 절차 · 약 ${wonStr(sc)}` }); }
      if (unionOf() === 'm' && adoptOK()) ch.push({ k: 'adopt', label: "Đăng ký tư vấn với cơ quan nhận con nuôi", sub: "Thẩm định gia đình và tập huấn · khoảng 1 năm" });
      if (!ch.length) return null;
      ch.push({ k: 'no', label: S.fam.kids.some(k => k.alive) ? "Các con hiện tại là đủ rồi" : "Bây giờ cứ sống hai người với nhau", sub: '' });
      return { title: S.fam.kids.some(k => k.alive) ? "Đón thêm một đứa con?" : "Đón một đứa trẻ vào gia đình?", body: L`${wa(who)} 아이 이야기를 나눴습니다.`,
        fact: transB() ? '' : "Ở Mỹ, khoảng 15% các cặp vợ chồng cùng giới nuôi con dưới 18 tuổi; ở các cặp vợ chồng khác là khoảng 38% (Cục Điều tra Dân số Mỹ 2019)", choices: ch };
    },
    apply: k => {
      if (k === 'no') return false;
      if (k === 'adopt') return adoptStart();
      if (k === 'surro') { const sc = S.flags.ssCostS || 0; S.money -= sc;
        if (!chance(0.6)) { eff({ h: -4 }); return { t: L`대리모를 통한 시술을 했지만 이번에는 아이가 생기지 않았습니다. (−${wonStr(sc)})`, k: 'bad' }; }
        return { t: L`대리모가 아이를 출산했습니다. (−${wonStr(sc)})`, k: 'big', post: () => haveKid(null, {}) }; }
      S.money -= S.flags.ssCost || 0;
      if (!chance(0.55)) { eff({ h: -4 }); return { t: L`몇 번의 시술에도 이번에는 아이가 생기지 않았습니다. (−${wonStr(S.flags.ssCost || 0)})`, k: 'bad' }; }
      const me = !transNoCarry() && chance(S.age <= S.fam.partner.age ? 0.6 : 0.4);
      return { t: me ? "Sau quá trình điều trị, bạn đã có thai." : L`시술 끝에 ${iga(callName(S.fam.partner.name))} 아이를 가졌습니다.`, k: 'big', post: () => haveKid(null, { pc: !me }) };
    }
  },
  adoptq: {
    ok: () => adoptOK() && !S.fam.kids.some(k => k.alive),
    build: () => { const y = S.fam.marriedAt != null ? S.age - S.fam.marriedAt : 0;
      return { title: kafala() ? "Nhận một đứa trẻ về nuôi?" : "Tìm hiểu về việc nhận con nuôi?", body: L`아이 없이 지낸 지 ${y}년이 되었습니다. ${kafala() ? "Bạn nghe nói một cặp vợ chồng hàng xóm đã nhận nuôi một đứa trẻ theo hình thức kafala (giám hộ)." : "Bạn nghe kể về một gia đình có thêm thành viên nhờ nhận con nuôi."}`,
        fact: "Mỗi năm trên thế giới có khoảng 260.000 trẻ em được nhận làm con nuôi (UN DESA 2009)",
        choices: [{ k: 'go', label: kafala() ? "Tìm hiểu" : "Đăng ký tư vấn với cơ quan nhận con nuôi", sub: "Thẩm định gia đình và tập huấn · khoảng 1 năm" }, { k: 'no', label: "Sống như hiện tại", sub: '' }] }; },
    apply: k => { if (k === 'no') return false; return adoptStart(); }
  },
  adopt: {
    ok: () => adoptOK(true),
    build: p => { const kid = S.flags.adoptKid; if (!kid) return null;
      const who = kid.name.full, ag = kid.age, kd = ag === 0 ? L`태어난 지 몇 달 된 ${iga(who)}` : L`${ag}살 ${iga(who)}`;
      return { title: kafala() ? "Nhận một đứa trẻ về nuôi?" : "Gặp một đứa trẻ",
        body: kafala() ? L`기관에서 연락이 왔습니다. ${kd} 자기 이름을 지닌 채 새 가족을 기다리고 있습니다. 이슬람 법은 입양 대신 카팔라(후견)로 아이를 키웁니다.` : L`기관에서 연락이 왔습니다. ${kd} 새 가족을 기다리고 있습니다.`,
        fact: "Mỗi năm trên thế giới có khoảng 260.000 trẻ em được nhận làm con nuôi (UN DESA 2009)",
        choices: [{ k: 'yes', label: "Đón bé vào gia đình", sub: "Hạnh phúc↑ Chi phí nuôi con↑" }, { k: 'no', label: "Chưa phải lúc này", sub: '' }] }; },
    apply: k => {
      const kid = S.flags.adoptKid; S.flags.adoptKid = null;
      if (k === 'no' || !kid) return false;
      S.fam.kids.push({ name: kid.name, sex: kid.sex, bornAt: S.age - kid.age, alive: true, adopted: 1 });
      S.stats.adopted = (S.stats.adopted || 0) + 1; S.yearMark = 'baby'; eff({ h: 10, so: 6 });
      return L`${iga(callName(kid.name))} 가족이 되었습니다.`;
    }
  },
  kids: {
    ok: p => p && p.w2 ? w2TalkOK() : S.fam.married && S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced && !S.fam.partner.ss && kidsApartK() > 0,
    build: p => {
      if (p && p.w2) return kidsW2View();
      const c = C(), n = ownKids().length, alive = ownKids().filter(k => k.alive).length, sko = skOnly();
      if (S.sex === 'F' && S.age < 18) { if (chance(c.tfr > 3.5 ? 0.85 : 0.75)) teenBirth(); else S.flags.last_kids = S.age; return null; }
      const unplanned = hereC().tfr > 3.5 && chance(0.4);
      if (unplanned && mpPast()) return null;
      if (unplanned) { haveKid(); log("Đây là đứa con ngoài dự định. Ở nơi này, rất khó tìm được thuốc tránh thai hay được tư vấn.", 'note', "Khoảng một nửa số ca mang thai trên thế giới là ngoài ý muốn (UNFPA, Báo cáo Tình trạng Dân số Thế giới 2022)"); return null; }
      const lbW = S.fam.partner.lb && CBY[S.fam.partner.lbIn] ? CBY[S.fam.partner.lbIn].ko : '';
      return { title: n ? L`${n + 1}번째 아이를 가질까요?` : "Có con?", body: lbW ? (alive ? L`지금 아이가 ${alive}명 있습니다.` + ' ' : '') + L`휴가를 받아 ${lbW}에 다녀가는 길에 배우자와 아이 이야기를 나눴습니다.` : alive ? L`지금 아이가 ${alive}명 있습니다.` : sko ? "Bạn và bạn đời đang bàn chuyện có một đứa con chung." : "Bạn và bạn đời đang bàn chuyện sinh con.",
        fact: L`${c.ko} 합계출산율 ${c.tfr}명 (UN WPP 2024)${S.sex === 'F' ? L` · 모성사망비 출생 10만 명당 ${c.mmr}명 (WHO 2020)` : ''}`,
        choices: [{ k: 'yes', label: "Sinh con", sub: birthRule() && birthOwn().length >= birthAllow() ? L`정책을 넘기면 사회부양비 약 ${wonStr(birthFine())}${STATE_JOBS.includes(S.job) ? " · có thể mất việc trong cơ quan nhà nước" : ''}` : "Hạnh phúc↑ Chi phí nuôi con↑" }, { k: 'no', label: "Bây giờ thì chưa", sub: '' },
          { k: 'stop', label: alive ? "Không sinh thêm con nữa" : sko ? "Quyết định không có con chung" : "Quyết định sống không có con", sub: "Sẽ không hỏi lại nữa" }] };
    },
    apply: (k, p) => {
      if (p && p.w2) return kidsW2Apply(k);
      if (k === 'stop') { S.flags.noKidsM = S.fam.marriages || 1; const n = ownKids().filter(x => x.alive).length; return n ? L`아이는 지금의 ${n}명으로 충분하다고 둘이서 마음을 정했습니다.` : skOnly() ? "Hai bạn đã quyết định không có con chung." : "Hai bạn đã quyết định sống không có con."; }
      if (k !== 'yes') return false;
      if (!chance(conceiveP())) { S.flags.tryK = { m: S.fam.marriages || 1, y: 0 }; eff({ h: -2 }); return { t: "Bạn mong có con nhưng năm nay vẫn chưa có tin vui.", k: 'bad', f: "Khả năng có thai trong vòng 1 năm là khoảng 85% trước 35 tuổi, khoảng 60% ở tuổi 35–39 và khoảng 35% sau 40 tuổi (Hội Sản Phụ khoa Hoa Kỳ, ACOG)" }; }
      haveKid(); return false;
    }
  },
  infert: {
    ok: () => !!S.flags.tryK && S.fam.married && !!S.fam.partner && S.fam.partner.alive,
    build: () => {
      const c = C(), tk = S.flags.tryK, ch = [];
      if (ivfOK(c) && !tk.ivf && !tk.ivfGo) ch.push({ k: 'ivf', label: "Điều trị hiếm muộn", sub: L`한 해 약 ${wonStr(ivfCost(c))} · 길면 3년` });
      if (adoptOK()) ch.push({ k: 'adopt', label: kafala() ? "Tìm cách nhận một đứa trẻ về nuôi" : "Tìm hiểu việc nhận con nuôi", sub: "Thẩm định gia đình và tập huấn · khoảng 1 năm sau có phản hồi" });
      ch.push({ k: 'wait', label: "Chờ thêm một thời gian", sub: '' }, { k: 'stop', label: S.fam.kids.some(k => k.alive) ? "Sống trọn vẹn với gia đình hiện tại" : "Sống cùng nhau, chỉ hai người", sub: "Sẽ không hỏi lại nữa" });
      return { title: L`아이가 생기지 않은 지 ${tk.y}년째입니다`,
        body: tk.ivf ? "Hai bạn đã thử cả điều trị hiếm muộn nhưng con vẫn chưa đến. Giờ hai người bàn xem tiếp theo sẽ thế nào." : ivfOK(c) ? "Bệnh viện nói có thể làm xét nghiệm và bắt đầu điều trị hiếm muộn. Trong lúc chờ đợi, cả hai người đều dần mỏi mệt." : "Gần đây không có bệnh viện nào điều trị hiếm muộn. Trong lúc chờ đợi, cả hai người đều dần mỏi mệt.",
        fact: "Cứ 6 người trưởng thành trên thế giới thì có 1 người gặp tình trạng hiếm muộn vào một lúc nào đó trong đời (WHO 2023) · Khả năng sinh con sau một lần thụ tinh trong ống nghiệm là khoảng 44% trước 35 tuổi, khoảng 20% ở tuổi 38–40 và khoảng 3% sau 43 tuổi (CDC Mỹ 2021)",
        choices: ch };
    },
    apply: k => {
      const tk = S.flags.tryK; if (!tk) return false;
      if (k === 'stop') { S.flags.tryK = null; S.flags.noKidsM = S.fam.marriages || 1; eff({ h: -3 }); return S.fam.kids.some(k => k.alive) ? "Hai người cùng nhau quyết định không chờ thêm con nữa, mà sống trọn vẹn với gia đình hiện tại." : "Hai người cùng nhau quyết định sống không con, nương tựa vào nhau."; }
      if (k === 'wait') return false;
      if (k === 'adopt') return adoptStart();
      return ivfStart();
    }
  },
  drink: {
    build: () => { const hard = stressed(), co = isWorking() && !SELF_JOBS.includes(S.job), sc = !!S.school && !isWorking(); return { title: hard ? "Bạn uống rượu nhiều hơn" : "Các cuộc nhậu ngày càng dày",
      body: hard ? "Có vẻ không gì giúp quên những chuyện khó khăn bằng rượu. Một ly trước khi ngủ đã thành ba bốn ly lúc nào không hay." : co ? "Hầu như ngày nào tan làm cũng có cuộc nhậu. Không đi thì có cảm giác mình sẽ thành người lạc lõng." : sc ? "Hầu như ngày nào tan học cũng có cuộc nhậu. Không đi thì có cảm giác mình sẽ thành người lạc lõng." : "Hầu như ngày nào cũng có cuộc nhậu với hàng xóm. Không đi thì có cảm giác mình sẽ thành người lạc lõng.",
      fact: "Khoảng 7% người trưởng thành trên thế giới bị rối loạn sử dụng rượu, và 3,7% bị phụ thuộc rượu (WHO 2024)",
      choices: [{ k: 'stop', label: "Bớt uống và tìm cách khác", sub: "Đi bộ · trò chuyện · tìm trợ giúp" }, { k: 'drink', label: "Dựa vào rượu để cầm cự", sub: "Trước mắt thấy dễ chịu · có thể dẫn đến phụ thuộc" }] }; },
    apply: k => {
      if (k === 'stop' && DEC_Q) { const n = S.flags.alcStopQ = (S.flags.alcStopQ || 0) + 1; eff({ h: 1, hl: 1 }); return n === 1 ? "Suýt nữa lại uống nhiều hơn, nhưng lần này bạn vẫn đặt ly xuống." : n === 2 ? "Từ đó về sau, mỗi khi thấy mình bắt đầu uống nhiều hơn, bạn lại tự đặt ly xuống." : false; }
      if (k === 'stop') { eff({ h: 1, hl: 2 }); return pick([noWalk() ? "Bạn đặt ly rượu xuống và bắt đầu ra ngoài đi dạo mỗi tối." : "Bạn đặt ly rượu xuống và bắt đầu đi bộ mỗi tối.","Bạn tâm sự với một người bạn rằng dạo này mình thấy khó khăn. Lòng nhẹ đi một chút."]); }
      if (chance(0.5)) { S.alc = { since: S.age, y: 0 }; S.flags.alcEver = 1; return { t: "Ngày càng có nhiều đêm bạn không thể ngủ nếu không uống rượu.", k: 'bad' }; }
      eff({ hl: -1 }); return "Có một thời gian bạn uống nhiều hơn, rồi tự mình giảm bớt.";
    }
  },
  alcquit: {
    build: () => ({ title: "Bỏ rượu?", body: L`술을 가까이한 지 ${S.alc.y}년. 술 때문에 잃은 것들이 하나둘 보이기 시작합니다.`, fact: L`치료를 받은 알코올 의존 환자의 약 3분의 1은 1년 뒤 증상이 없었습니다 (NIAAA) · 정신건강 상담 1577-0199`,
      choices: [{ k: 'help', label: "Tìm sự giúp đỡ", sub: L`치료·자조 모임 · 비용 약 ${wonStr(incomeAt(C(), 0.5) * 0.08)}` }, { k: 'later', label: "Bây giờ vẫn ổn", sub: '' }] }),
    apply: k => {
      if (k === 'later') { eff({ h: -1 }); return false; }
      S.money -= incomeAt(C(), 0.5) * 0.08;
      if (chance(0.35)) { S.alc = null; S.flags.alcOK = S.age; eff({ hl: 6, h: 6, so: 4 }); return { t: famNear() ? "Bạn kiên trì đi điều trị và sinh hoạt nhóm, và đã bỏ được rượu. Gia đình lại bắt đầu nở nụ cười." : "Bạn kiên trì đi điều trị và sinh hoạt nhóm, và đã bỏ được rượu. Lâu lắm rồi bạn mới đón buổi sáng với đầu óc tỉnh táo.", k: 'big' }; }
      eff({ h: -3 }); return { t: "Bạn đã bắt đầu điều trị, nhưng vài tháng sau lại uống trở lại.", k: 'bad' };
    }
  },
  lotto: {
    ok: () => lottoOK() && S.flags.lotto == null,
    build: () => { const c = C(), kor = S.cur === 'KOR' && calYr() >= 2002;
      return { title: "Mua vé số?", body: kor ? (isWorking() ? "Đồng nghiệp rủ bạn góp tiền mua Lotto chung mỗi tuần. Xác suất trúng giải nhất là 1 trên 8,14 triệu mỗi lượt." : "Trước cửa hàng vé số trong khu phố treo băng rôn “Điểm bán may mắn: từng có vé trúng giải nhất”. Xác suất trúng giải nhất là 1 trên 8,14 triệu mỗi lượt.") : "Cạnh quầy thu ngân có bán vé số. Người ta nói giải nhất tuần này đã dồn lên rất lớn.",
        fact: kor ? "Xổ số chỉ trả lại khoảng một nửa doanh thu dưới dạng tiền thưởng. Ở Hàn Quốc, xác suất trúng giải nhất Lotto là 1 trên 8,14 triệu mỗi lượt (Ủy ban Xổ số Hàn Quốc)" : "Xổ số thường chỉ trả lại khoảng một nửa doanh thu dưới dạng tiền thưởng. Phần lớn người mua mỗi năm mất hơn một nửa số tiền đã bỏ ra",
        choices: [{ k: 'weekly', label: "Mua một ít mỗi tuần", sub: L`한 해 약 ${wonStr(lottoCost())} · 대부분은 잃는 돈` }, { k: 'once', label: "Chỉ mua lần này thôi", sub: '' }, { k: 'no', label: "Không mua", sub: '' }] }; },
    apply: k => {
      if (k === 'weekly') { S.flags.lotto = S.age; eff({ h: 1 }); return "Bạn bắt đầu mua vé số mỗi tuần. Tối ngày quay thưởng, dò số trở thành một niềm vui nho nhỏ."; }
      if (k === 'once') { eff({ h: 1 }); return chance(0.05) ? "Bạn trúng giải nhỏ nhất. Bạn lấy số tiền đó mua thêm một tờ nữa, nhưng không trúng gì." : "Quả nhiên không trúng. Dù vậy, cả tuần chờ đến ngày quay thưởng vẫn thật vui."; }
      return false;
    }
  },
  gamble: {
    build: () => { const online = S.urban && C().net >= 60; return { title: "Thử vận may một ván?", body: online ? "Một người bạn gửi đường link rủ bạn cá cược thể thao trên điện thoại. Người ấy kể tuần trước mình vừa thắng được cả tháng lương." : "Trong xóm vừa mở một chiếu bạc. Người ta nói mỗi ván có thể được thua bằng cả tháng thu nhập.",
      fact: "Ước tính khoảng 80 triệu người trưởng thành trên thế giới đang mắc chứng rối loạn cờ bạc (The Lancet Public Health 2024)",
      choices: [{ k: 'no', label: "Không làm vậy", sub: '' }, { k: 'try', label: "Thử một lần", sub: "Có thể thắng, có thể thua · có thể bị cuốn vào" }] }; },
    apply: k => {
      if (k === 'no') return false;
      const med = incomeAt(C(), 0.5), won = chance(0.3);
      S.money += won ? med * 0.08 : -med * 0.06;
      if (chance(won ? 0.4 : 0.25)) { S.gamb = { since: S.age, y: 0 }; S.flags.gambEver = 1; return { t: won ? "Lúc đầu bạn thắng. Không quên được cảm giác ấy, bạn cứ thế đánh tiếp." : "Muốn gỡ lại số tiền đã thua, bạn lại sa vào, hết lần này đến lần khác.", k: 'bad' }; }
      return won ? "Bạn thắng được một ít, rồi dừng lại ở đó." : "Thua một ít, bạn dừng lại.";
    }
  },
  gambquit: {
    build: () => { const fam = famAnywhere(); return { title: "Bỏ cờ bạc?", body: fam ? L`도박을 시작한 지 ${S.gamb.y}년. 잃은 돈보다, 가족에게 숨긴 일이 더 무겁습니다.` : L`도박을 시작한 지 ${S.gamb.y}년. 잃은 돈보다, 아무에게도 말하지 못한 일이 더 무겁습니다.`, fact: L`도박 문제는 상담과 치료로 회복할 수 있습니다 · 한국도박문제예방치유원 1336`,
      choices: [{ k: 'help', label: fam ? "Thú nhận với gia đình và đi tư vấn" : "Tìm sự giúp đỡ và đi tư vấn", sub: "Khó nói ra, nhưng là khởi đầu của sự hồi phục" }, { k: 'later', label: "Thắng ván tới thì bỏ", sub: '' }] }; },
    apply: k => {
      if (k === 'later') { S.money -= incomeAt(C(), 0.5) * 0.1; eff({ h: -2 }); return { t: "Lần này bạn cũng không thắng.", k: 'bad' }; }
      if (chance(0.45)) { S.gamb = null; S.flags.gambOK = S.age; eff({ h: 5, so: 3 }); return { t: famAnywhere() ? "Bạn kể hết với gia đình và bắt đầu đi tư vấn. Bạn đã bỏ được cờ bạc." : "Bạn tìm sự giúp đỡ và bắt đầu đi tư vấn. Bạn đã bỏ được cờ bạc.", k: 'big' }; }
      eff({ so: 2 }); return { t: "Bạn đã bắt đầu đi tư vấn, nhưng vẫn cứ bị cuốn trở lại.", k: 'bad' };
    }
  },
  disaid: {
    ok: () => disOn() && !S.dis.aid && S.age >= 18,
    build: () => { const c = C(), d = S.dis, cost = disAidCost(c), far = disAccess(c) < 0.2;
      const body = d.k === 'move' ? (d.wc ? "Có một chiếc xe lăn tốt, bạn sẽ tự mình đi được tới nhiều nơi hơn hẳn." : "Có nẹp chỉnh hình vừa với cơ thể, bạn sẽ đỡ mệt và đi được xa hơn.")
        : d.k === 'sight' ? (calYr() >= 1995 ? "Có gậy trắng và phần mềm đọc màn hình, bạn sẽ tự làm được nhiều việc hơn." : "Học cách dùng gậy trắng và chữ nổi, bạn sẽ tự đi được tới nhiều nơi hơn.")
        : "Có máy trợ thính và học ngôn ngữ ký hiệu, mọi việc ở nơi làm việc và cơ quan nhà nước sẽ dễ dàng hơn nhiều.";
      return { title: "Trang bị dụng cụ hỗ trợ?", body, fact: "Hơn 2,5 tỷ người trên thế giới cần dụng cụ hỗ trợ, nhưng khoảng 1 tỷ người trong số đó không thể có được (WHO·UNICEF 2022)",
        choices: [{ k: 'get', label: "Trang bị", sub: far ? L`약 ${wonStr(cost)} · 먼 도시까지 가야 한다` : L`약 ${wonStr(cost)}` }, { k: 'no', label: "Tạm thời cứ sống như hiện tại", sub: '' }] }; },
    apply: k => {
      if (k !== 'get') return false;
      const d = S.dis; S.money -= disAidCost(C()); d.aid = 1; eff({ h: 4 });
      return { t: d.k === 'move' ? (d.wc ? "Bạn đã có chiếc xe lăn mới. Những nơi bạn tự đi được đã nhiều hơn." : "Bạn đã có nẹp chỉnh hình vừa với cơ thể. Bạn đỡ mệt hơn hẳn.") : d.k === 'sight' ? "Bạn đã học cách dùng gậy trắng. Những con đường bạn tự đi được đã nhiều hơn." : "Bạn đã có máy trợ thính và bắt đầu học ngôn ngữ ký hiệu. Trò chuyện dễ dàng hơn hẳn.", k: 'warm' };
    }
  },
  disadj: {
    ok: () => disOn() && S.age >= 18 && S.job !== 'prison',
    build: () => { const c = C(), can = isWorking() && disJobOK(S.job);
      return { title: "Cuộc sống sau chấn thương", body: can ? (SELF_JOBS.includes(S.job) ? "Cơ thể không còn như trước, nhưng bạn có thể vẫn tiếp tục công việc cũ." + ' ' + "Điều quan trọng là bạn có thể thay đổi cách làm việc đến đâu." : "Cơ thể không còn như trước, nhưng bạn có thể vẫn tiếp tục công việc cũ. Điều quan trọng là nơi làm việc sẽ điều chỉnh cho bạn đến đâu.") : "Cơ thể không còn như trước. Bạn cần quyết định từ nay sẽ làm việc thế nào.",
        fact: "Tỷ lệ có việc làm của người khuyết tật khoảng 27%, chưa bằng một nửa so với người không khuyết tật (56%) (UN DESA 2024)",
        choices: [can ? { k: 'back', label: "Quay lại công việc cũ", sub: SELF_JOBS.includes(S.job) ? "Phải thay đổi cách làm việc cho hợp với cơ thể" : "Nơi làm việc phải điều chỉnh cho bạn" } : null, { k: 'learn', label: "Học một nghề mới", sub: c.p === 'hi' || c.p === 'eca' ? "Đào tạo phục hồi nghề nghiệp · 1 năm" : "Một năm để học nghề" },
          { k: 'rest', label: "Nghỉ một thời gian để hồi phục", sub: "Khoảng 2 năm" }].filter(Boolean) }; },
    apply: k => {
      const c = C();
      if (k === 'back') {
        if (SELF_JOBS.includes(S.job)) {
          if (chance(0.7)) { eff({ h: 4 }); return { t: "Bạn sửa lại chỗ làm cho hợp với cơ thể và bắt đầu làm việc trở lại.", k: 'warm' }; }
          S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 }); return { t: "Tiếp tục công việc như trước đã trở nên quá khó." + ' ' + "Bạn phải tìm một công việc khác.", k: 'bad' };
        }
        if (chance(c.ppp >= 30000 ? 0.8 : c.ppp >= 10000 ? 0.65 : 0.5)) { eff({ h: 4 }); return { t: "Nơi làm việc đã đổi bàn làm việc và lối đi lại cho bạn. Bạn bắt đầu đi làm trở lại.", k: 'warm' }; }
        S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; eff({ h: -4 }); return { t: "Nơi làm cũ không nhận bạn trở lại. Bạn phải tìm một công việc mới.", k: 'bad' };
      }
      if (isWorking()) { S.flags.lastJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; }
      if (k === 'learn') { S.flags.courseY = S.age; eff({ sm: 4 }); S.flags.disRestTo = S.age + 1; return "Bạn quyết định nghỉ làm một năm để học một nghề mới."; }
      S.flags.disRestTo = S.age + 2; eff({ hl: 4, h: 2 }); return "Bạn quyết định nghỉ làm một thời gian để hồi phục sức khỏe.";
    }
  },
  mind: {
    ok: () => S.age >= 18 && !S.mind && S.job !== 'prison',
    build: () => {
      const c = C(), a = S.age, loss = S.flags.lossY != null && a - S.flags.lossY <= 1, who = mindWho(), cost = mindCost(c);
      const body = S.refugee ? "Từ khi rời bỏ quê hương, đêm nào những chuyện khi ấy cũng ùa về. Ngay cả ban ngày, tâm trí bạn vẫn luôn ở đâu đó thật xa."
        : loss ? "Khoảng trống người đã khuất để lại mãi không lấp đầy được. Bạn khó ngủ, đến cả những việc từng yêu thích cũng chẳng thiết làm."
        : S.job === 'seeking' ? "Những ngày tìm việc kéo dài, sáng thức dậy ngày càng khó khăn. Bạn bắt đầu tránh gặp mọi người."
        : S.money < -incomeAt(c, 0.5) * 0.5 ? "Lo nợ nần khiến đêm nào bạn cũng mất ngủ. Làm gì lòng cũng nặng trĩu."
        : (S.focusW.work || 0) > 0.6 && isWorking() ? "Những ngày bị công việc đuổi theo cứ nối tiếp, bạn thấy mình như cạn kiệt. Ngay cả ngày nghỉ cũng không nghỉ ngơi được."
        : "Dạo này lòng bạn nặng trĩu mà không rõ vì sao. Bạn khó ngủ, những việc từng yêu thích cũng nhạt dần.";
      const talk = { p: "Tâm sự với bạn đời", p2: "Tâm sự với người đang sống chung", par: "Tâm sự với bố mẹ", sib: "Tâm sự với anh chị em", fr: "Tâm sự với một người bạn thân" }[who];
      return { title: "Lòng bạn đã quá mệt mỏi", body, fact: `${MIND_FACT()} · ${MIND_HELP()}`,
        choices: [{ k: 'talk', label: talk, sub: "Chỉ cần nói ra cũng có thể nhẹ lòng hơn" },
          mindCounselOK(c) ? { k: 'counsel', label: S.refugee ? "Thử gặp người tư vấn ở một tổ chức hỗ trợ" : "Thử gặp chuyên gia tư vấn", sub: S.refugee ? "Miễn phí · có thể phải chờ" : c.ppp < 8000 ? L`상담할 곳이 멀고 드물다 · 비용 약 ${wonStr(cost)}` : L`비용 약 ${wonStr(cost)}` } : null,
          { k: 'alone', label: "Thử tự mình chịu đựng", sub: "Có thể sẽ mất thời gian" }].filter(Boolean) };
    },
    apply: k => {
      const c = C(), who = mindWho();
      if (k === 'counsel') { const cost = mindCost(c); S.money -= cost; S.mind = { at: S.age, way: 'counsel', y: 0 }; eff({ h: 2 });
        return { t: S.refugee ? "Bạn bắt đầu gặp người tư vấn ở một tổ chức hỗ trợ. Bạn đã gặp những người từng trải qua điều tương tự." : "Bạn lấy hết can đảm để bắt đầu đi tư vấn. Từng chút một, bạn học cách nhìn vào lòng mình.", k: 'note' }; }
      if (k === 'talk') { S.mind = { at: S.age, way: 'talk', y: 0 }; eff({ h: 2, so: 2 });
        const parNear = typeof parHome === 'function' ? parHome() || (!parFar() && !parElsewhere() && !studyAway()) : !parFar();
        return { t: { p: "Bạn tâm sự với bạn đời rằng dạo này mình đang rất khó khăn. Người ấy lặng lẽ lắng nghe bạn thật lâu.", p2: "Bạn tâm sự với người đang sống chung rằng dạo này mình đang rất khó khăn. Người ấy lặng lẽ lắng nghe bạn thật lâu.",
          par: parNear ? "Bạn nói với bố mẹ rằng dạo này mình đang rất khó khăn. Bố mẹ không hỏi gì cả, chỉ dọn cho bạn một bữa cơm nóng." : "Bạn gọi điện cho bố mẹ ở xa, kể rằng dạo này mình thấy rất mệt mỏi. Bố mẹ không hỏi gì, chỉ lặng lẽ nghe bạn nói thật lâu.", sib: "Bạn tâm sự với anh chị em rằng dạo này mình đang rất khó khăn. “Mình cũng từng như vậy.” Chỉ một câu ấy thôi cũng an ủi bạn rất nhiều.",
          fr: "Bạn tâm sự với một người bạn lâu năm rằng dạo này mình đang rất khó khăn. Đêm ấy, người bạn ở bên bạn đến tận khuya." }[who], k: 'warm' }; }
      S.mind = { at: S.age, way: 'alone', y: 0 }; eff({ h: -2 }); return { t: "Bạn quyết định không nói với ai và tự mình chịu đựng.", k: 'note' };
    }
  },
  mindhelp: {
    ok: () => !!S.mind && S.mind.way === 'alone' && S.job !== 'prison',
    build: () => { const c = C(), who = mindWho(), cost = mindCost(c);
      return { title: "Thử tìm sự giúp đỡ?", body: L`혼자 견딘 지 ${S.mind.y}년이 지났습니다. 좋은 날도 있지만, 마음은 여전히 무겁습니다.`, fact: `${MIND_FACT()} · ${MIND_HELP()}`,
        choices: [mindCounselOK(c) ? { k: 'counsel', label: S.refugee ? "Thử gặp người tư vấn ở một tổ chức hỗ trợ" : "Thử gặp chuyên gia tư vấn", sub: S.refugee ? "Miễn phí" : L`비용 약 ${wonStr(cost)}` } : null,
          { k: 'talk', label: { p: "Tâm sự với bạn đời", p2: "Tâm sự với người đang sống chung", par: "Tâm sự với bố mẹ", sib: "Tâm sự với anh chị em", fr: "Tâm sự với một người bạn thân" }[who], sub: '' },
          { k: 'later', label: "Tự chịu đựng thêm một thời gian nữa", sub: '' }].filter(Boolean) }; },
    apply: k => {
      if (k === 'later') return false;
      if (k === 'counsel') { S.money -= mindCost(C()); S.mind.way = 'counsel'; eff({ h: 2 }); return { t: "Bạn bắt đầu đi tư vấn, điều bạn đã chần chừ rất lâu.", k: 'note' }; }
      S.mind.way = 'talk'; eff({ h: 2, so: 2 }); return { t: "Lần đầu tiên, bạn nói ra những điều đã ôm giữ một mình bấy lâu. Người ta bảo rằng có nhiều người hơn bạn nghĩ đã từng đi qua một giai đoạn như thế.", k: 'warm' };
    }
  },
  atone: {
    ok: () => S.job !== 'prison' && S.flags.relAt != null,
    build: () => {
      const w = atoneWho(), y = S.age - S.flags.relAt, par = w === 'mom' || w === 'dad';
      const hurt = par ? L`${parW()}께 남긴 상처가 마음에 걸립니다.` : w === 'pt' ? "Vết thương bạn đã gây ra cho bạn đời cứ đè nặng trong lòng." : w === 'kids' ? "Vết thương bạn đã gây ra cho các con cứ đè nặng trong lòng." : w === 'sib' ? "Vết thương bạn đã gây ra cho anh chị em cứ đè nặng trong lòng." : "Những người đã bị tổn hại vì việc ấy cứ đè nặng trong lòng bạn.";
      const home = par && !!homeOthers()[w];
      const fam = par ? (home ? L`${parW()}께 용서를 구한다` : L`${eul(parW())} 찾아가 용서를 구한다`) : w === 'pt' ? "Kể hết mọi chuyện với bạn đời và xin tha thứ" : w === 'kids' ? "Kể cho các con nghe chuyện đó và xin lỗi" : w === 'sib' ? "Tìm đến anh chị em để xin tha thứ" : null;
      return { title: "Con đường làm lại", body: (y <= 0 ? "Bạn mới ra tù chưa được bao lâu." : L`교도소에서 나온 지 ${y}년이 되었습니다.`) + ' ' + hurt + ' ' + "Chuyện đã qua không thể thay đổi, nhưng từ bây giờ vẫn có những điều bạn có thể làm.",
        fact: "Các buổi gặp gỡ theo mô hình tư pháp phục hồi, nơi người phạm tội ngồi trò chuyện với người bị hại, đã giúp giảm tái phạm tuy ít nhưng đều đặn, và giá trị của những vụ phạm tội được ngăn chặn gấp 3,7 đến 8,1 lần chi phí bỏ ra (Strang và cộng sự 2013, tổng quan hệ thống Campbell)",
        choices: [fam ? { k: 'family', label: fam, sub: "Chưa biết họ có tha thứ hay không" } : null,
          { k: 'repay', label: "Xin lỗi những người đã bị tổn hại và đền bù cho họ", sub: L`약 ${wonStr(atoneCost())}` },
          { k: 'mentor', label: "Giúp những người trẻ đang bước vào con đường giống bạn", sub: "Tình nguyện làm người dẫn dắt cho thanh thiếu niên vừa rời trường giáo dưỡng" },
          { k: 'quiet', label: "Lặng lẽ sống lương thiện", sub: "Lấy lại lòng tin cần có thời gian" }].filter(Boolean) };
    },
    apply: k => {
      S.flags.atoneFor = S.flags.relAt; S.flags.atoneK = k;
      const w = atoneWho(), re = x => { S.flags.reoffK = (S.flags.reoffK || 1) * x; };
      if (k === 'family' && w) {
        const home = (w === 'mom' || w === 'dad') && !!homeOthers()[w];
        const y = S.age - S.flags.relAt, p = clamp(0.5 + (S.st.so - 60) / 200 + 0.06 * y + (S.flags.prSchool ? 0.05 : 0), 0.3, 0.8);
        if (chance(p)) { S.flags.atoned = S.age; re(0.8); eff({ h: 6, so: 4 });
          return { t: { mom: home ? "Bạn ngồi trước mặt mẹ và cúi đầu. Mẹ khóc rất lâu, rồi nắm lấy tay bạn." : L`${eul(parW())} 찾아가 고개를 숙였습니다. 어머니는 한참을 우시다가, 밥은 먹고 다니느냐고 물으셨습니다.`, dad: home ? "Bạn xin bố tha thứ. Bố im lặng rất lâu, rồi vỗ vai bạn và bảo thôi, được rồi." : "Bạn tìm đến bố để xin tha thứ. Bố im lặng rất lâu, rồi vỗ vai bạn và bảo thế là đủ rồi.",
            pt: "Bạn kể hết với bạn đời mọi chuyện bấy lâu nay và xin tha thứ. Câu trả lời bạn nhận được là: mình hãy bắt đầu lại từ đầu.", kids: "Lần đầu tiên, bạn kể với các con về chuyện ấy và xin lỗi. Một đứa lặng lẽ nắm lấy tay bạn.",
            sib: "Bạn tìm đến anh chị em để xin tha thứ. Dịp lễ Tết năm ấy, sau bao năm cả nhà mới lại ngồi quây quần bên nhau." }[w], k: 'warm' }; }
        S.flags.atoneTry = S.age; eff({ h: -3 });
        return { t: { mom: home ? "Dù sống chung một nhà, mẹ vẫn chưa nhìn thẳng vào mắt bạn. Dù vậy, bạn quyết định sáng nào cũng chào mẹ trước." : "Mẹ nói vẫn chưa thể gặp bạn. Dù vậy, bạn quyết định dịp lễ Tết nào cũng sẽ đến tận trước cửa nhà mẹ.", dad: home ? "Bố sống chung một nhà mà vẫn chưa chịu nói chuyện với bạn. Dù vậy, bạn quyết định sáng nào cũng chào bố trước." : "Bố không mở cửa. Dù vậy, bạn quyết định dịp lễ Tết nào cũng sẽ tìm đến.",
          pt: "Bạn đời vẫn chưa thể mở lòng với bạn. Bạn nói rằng mình sẽ chờ.", kids: "Các con vẫn còn ngại ngùng với bạn. Bạn quyết định từ từ lại gần các con.", sib: "Anh chị em vẫn chưa sẵn lòng đón nhận bạn. Bạn quyết định chờ đợi." }[w], k: 'bad' };
      }
      if (k === 'repay') { const cost = atoneCost(); S.money -= cost; S.flags.shameK = 0.5; re(0.85); eff({ h: 4, so: 2 });
        return L`그 일로 피해를 본 이들을 찾아가 사죄하고, 모아 둔 돈을 털어 갚기 시작했습니다. (−${wonStr(cost)})`; }
      if (k === 'mentor') { S.flags.shameK = 0.6; S.flags.mentorEx = S.age; re(0.8); eff({ h: 5, so: 5 });
        return { t: "Bạn bắt đầu tình nguyện làm người dẫn dắt cho những em vừa rời trường giáo dưỡng. Một em nghe câu chuyện của bạn đã quay lại vào tuần sau.", k: 'warm' }; }
      S.flags.shameQuiet = 1; re(0.9); eff({ h: 1 });
      return "Bạn không thanh minh với ai, chỉ ngày ngày làm việc. Bạn nghĩ lòng tin được vun đắp bằng thời gian chứ không phải bằng lời nói.";
    }
  },
  crime: {
    build: (p = {}) => p.emb ? { title: S.job === 'civil' ? "Động vào tiền công quỹ?" : "Động vào tiền công ty?", body: L`빚 독촉 전화가 하루에도 몇 번씩 옵니다. 마침 ${S.job === 'civil' ? "tiền công quỹ" : "tiền công ty"} 관리를 맡고 있어서, 잠깐 빌렸다가 채워 넣으면 아무도 모를 것 같습니다.`,
      fact: "43% vụ biển thủ và gian lận nơi làm việc bị phát hiện nhờ tố giác của đồng nghiệp và những người khác, và thường phải mất khoảng một năm mới lộ ra (ACFE 2024)",
      choices: [{ k: 'refuse', label: "Không động vào", sub: "Khoản nợ vẫn còn nguyên" }, { k: 'accept', label: "Chỉ mượn tạm một thời gian", sub: "Trả được nợ · nếu bị phát hiện: mất việc và ra tòa" }] } : ({ title: "Một lời đề nghị nguy hiểm", body: L`${S.job === 'seeking' ? "Không có việc làm," : "Thu nhập eo hẹp,"} ${S.money < 0 ? "nợ nần thì cứ chồng chất" : "cuộc sống chẳng có dấu hiệu khá lên"}. 아는 사람이 "한 번만 도와주면 큰돈을 주겠다"며 위험한 일을 제안합니다.`,
      fact: "Hơn 10 triệu người đang bị giam giữ trong các nhà tù trên khắp thế giới (World Prison Brief)",
      choices: [{ k: 'refuse', label: "Từ chối", sub: "Hoàn cảnh vẫn như cũ" }, { k: 'accept', label: "Nhận lời", sub: "Hứa hẹn tiền lớn · bị bắt thì vào tù" }] }),
    apply: (k, p = {}) => {
      if (k === 'refuse') { eff({ h: 1 }); return p.emb ? "Bạn đã không động vào. Những cuộc gọi đòi nợ vẫn tiếp tục, nhưng đêm đến bạn vẫn ngủ được." : "Bạn đã từ chối. Hoàn cảnh vẫn như cũ, nhưng lòng bạn thanh thản."; }
      const med = incomeAt(C(), 0.5);
      if (p.emb) { const amt = med * (0.3 + rnd() * 0.5); S.money += amt; S.flags.emb = { amt, at: S.age }; eff({ h: -4 });
        return { t: L`${S.job === 'civil' ? "tiền công quỹ" : "tiền công ty"}에 손을 댔습니다. 급한 빚은 막았지만, 그날부터 감사 공지만 뜨면 손이 떨렸습니다.`, k: 'bad' }; }
      if (chance(clamp(0.35 * prisonK(C()), 0.12, 0.7))) {
        const yrs = ri(1, 4); recAdd({ k: 'crime', s: 'prison', y: yrs }); const bt = goPrison(yrs, 'crime');
        return { t: L`붙잡혀 재판을 받았습니다. 징역 ${yrs}년을 선고받았습니다.` + courtLine() + bt, k: 'bad' };
      }
      S.money += med * (0.04 + rnd() * 0.08); S.flags.crimeN = (S.flags.crimeN || 0) + 1; eff({ h: -6, so: -3 });
      const askP = (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !parFar();
      return { t: "Khoản tiền lớn được hứa hẹn rốt cuộc chẳng bao giờ đến. Thứ bạn nhận được chỉ bằng vài tuần làm việc, và từ hôm đó, bạn thường giật mình tỉnh giấc giữa đêm vì tiếng gõ cửa." + (askP ? ' ' + L`${parW()}께서 요즘 무슨 일을 하느냐고 물으셨지만, 대답하지 못했습니다.` : ''), k: 'bad',
        f: "Một nghiên cứu phân tích sổ sách của một băng đảng ma túy ở Chicago cho thấy thu nhập của các thành viên cấp thấp chỉ quanh mức lương tối thiểu (Levitt & Venkatesh 2000)" };
    }
  },
  duikey: {
    ok: () => !licOff() && !!(S.owns.car || S.owns.moto) && S.job !== 'prison',
    build: () => {
      const c = C(), moto = !S.owns.car, kr = c.id === 'KOR', cost = incomeAt(c, 0.5) * 0.0012;
      const occ = isWorking() && chance(0.5) ? "Buổi liên hoan với đồng nghiệp đã kết thúc." : S.age >= 25 && chance(0.3) ? "Dịp lễ Tết, bạn uống rượu cùng họ hàng đến khuya." : "Buổi nhậu với bạn bè đã kết thúc.";
      return { title: "Đêm uống rượu", body: occ + ' ' + (moto ? "Bạn đã uống vài ly, và chiếc xe máy đang dựng ngay trước mặt. Về đến nhà mất 20 phút." : "Bạn đã uống vài ly, và chiếc ô tô đang ở bãi đỗ xe. Lái xe về nhà mất 20 phút.")
          + (S.flags.duiH != null ? ' ' + "Lần trước bạn cũng về đến nhà mà chẳng có chuyện gì." : ''),
        fact: kr ? "Số vụ bị phát hiện lái xe sau khi uống rượu bia ở Hàn Quốc đã giảm từ 243.000 vụ năm 2015 xuống 118.000 vụ năm 2024, nhưng khoảng 44% người từng bị phát hiện lại bị phát hiện lần nữa (Samsung Traffic Safety Research Institute 2026)"
          : "Với nồng độ cồn trong máu 0,05–0,08%, nguy cơ tử vong do tai nạn giao thông cao gấp ít nhất 6 lần (WHO, Global Road Safety Partnership)",
        choices: [{ k: 'cab', label: kr ? "Gọi tài xế lái hộ" : "Gọi taxi", sub: L`약 ${wonStr(cost)}` }, { k: 'leave', label: moto ? "Để xe máy lại, mai quay lại lấy" : "Để ô tô lại, mai quay lại lấy", sub: "Hơi phiền một chút" },
          { k: 'drive', label: "Cứ thế lái về", sub: "“Chắc không sao đâu” · kiểm tra nồng độ cồn và tai nạn" }] };
    },
    apply: k => {
      const c = C(), moto = !S.owns.car, kr = c.id === 'KOR';
      if (k !== 'drive') S.flags.duiSafe = 1;
      if (k === 'cab') { S.money -= incomeAt(c, 0.5) * 0.0012; if (S.flags.duiH != null && chance(0.5)) S.flags.duiH = null; eff({ h: 1 });
        return { t: kr ? "Bạn đứng hóng gió lạnh chờ tài xế lái hộ. Đến trước cửa nhà, nhận lại chìa khóa, bạn mới thấy nhẹ nhõm." : "Bạn đi taxi về nhà. Hôm sau mới quay lại lấy xe.", k: 'ev' }; }
      if (k === 'leave') { if (S.flags.duiH != null && chance(0.5)) S.flags.duiH = null;
        return { t: moto ? "Bạn để xe máy lại và đi bộ về nhà. Sáng hôm sau mới quay lại lấy." : "Bạn để ô tô lại và đi xe buýt về nhà. Sáng hôm sau mới quay lại lấy.", k: 'ev' }; }
      S.flags.duiN = (S.flags.duiN || 0) + 1; const again = recN('dui') + recN('duih') > 0;
      if (chance(0.02 * (S.alc ? 1.5 : 1) * (moto ? 1.4 : 1))) {
        const r = rnd(); S.flags.duiH = null;
        if (r < 0.1) { S.flags.duiKill = S.age; eff({ h: -20, so: -8 }); S.yearMark = 'loss';
          return { t: "Trên đường về, bạn đâm vào một chiếc xe đi ngược chiều. Người lái chiếc xe ấy rốt cuộc đã qua đời. Trước gia đình của người ấy, bạn không thể ngẩng đầu lên." + ' ' + sentence('duik') + duiLic(again, true), k: 'bad' }; }
        if (r < 0.75) { const st = incomeAt(c, 0.5) * (0.3 + rnd() * 0.7); S.money -= st; eff({ h: -10, so: -5 });
          return { t: L`신호를 놓쳐 길을 건너던 사람을 치었습니다. 그 사람은 몇 달 동안 병원에 있었습니다. 치료비와 합의금을 건네고 병실 앞에서 고개를 숙였습니다. (−${wonStr(st)})` + ' ' + sentence('duih') + duiLic(again), k: 'bad' }; }
        eff({ hl: -12, h: -6 });
        return { t: (moto ? "Chiếc xe máy trượt bánh ở khúc cua. Chân bạn bị thương nặng, phải nằm viện mấy tuần." : "Bạn đâm vào cây bên đường. Người bị thương chỉ có mình bạn, nhưng bạn phải nằm viện mấy tuần.") + ' ' + sentence('dui') + duiLic(again), k: 'bad' };
      }
      if (chance(duiCatch(c))) { eff({ h: -6, so: -3 }); S.flags.duiH = chance(0.5) ? S.flags.duiH : null;
        return { t: "Bạn bị chặn lại kiểm tra nồng độ cồn ngay trong con ngõ trước nhà." + ' ' + sentence('dui') + duiLic(again), k: 'bad' }; }
      S.flags.duiH = S.age; eff({ h: -1 });
      return { t: "Bạn về đến nhà mà không có chuyện gì. Sáng hôm sau, bạn không nhớ rõ mình đã lái xe về bằng cách nào.", k: 'bad' };
    }
  },
  kinback: {
    ok: p => p.who === 'kid' ? !!(S.fam.kids[p.i] && S.fam.kids[p.i].alive) : !!S.flags.sibPr && sibAliveList().some(s => s.i === p.i),
    build: p => {
      const k = p.who === 'kid' ? S.fam.kids[p.i] : null, n = k ? callName(k.name) : S.flags.sibPr.w;
      return { title: L`${iga(n)} 돌아왔습니다`, body: k ? L`교도소에서 나온 ${iga(n)} 집 앞에 섰습니다. 한참을 망설이다 고개를 숙였습니다. “죄송해요. 다시 시작하고 싶어요.”`
          : L`교도소에서 나온 ${iga(n)} 찾아왔습니다. 문 앞에서 한참을 망설이다 고개를 숙였습니다. “미안해. 다시 시작하고 싶어.”`,
        fact: "Những người bị giam giữ được thăm gặp có nguy cơ tái phạm sau khi ra tù thấp hơn 13% (Sở Cải huấn bang Minnesota 2011)",
        choices: [{ k: 'hug', label: "Ôm lấy", sub: "Lại là gia đình" }, { k: 'time', label: "Nói rằng mình vẫn cần thời gian", sub: "Cho đến khi lòng mình sẵn sàng" }] };
    },
    apply: (k, p) => {
      const kid = p.who === 'kid' ? S.fam.kids[p.i] : null, n = kid ? callName(kid.name) : S.flags.sibPr.w;
      if (k === 'hug') { if (kid) kid.bd = (kid.bd || 0) + 8; eff({ h: 4, so: 3 });
        return { t: kid ? L`말없이 ${eul(n)} 안아 주었습니다. 그날 저녁, 오랜만에 한 식탁에 마주 앉았습니다.` : L`${eul(n)} 안아 주었습니다. 그해 명절, 오랜만에 형제자매가 한자리에 모였습니다.`, k: 'warm' }; }
      if (kid) kid.bd = (kid.bd || 0) - 2; S.flags.kinLate = { who: p.who, i: p.i, at: S.age }; eff({ h: -2 });
      return { t: L`아직은 받아들이기 어렵다고 말했습니다. ${iga(n)} 고개를 끄덕이고 돌아섰습니다.`, k: 'ev' };
    }
  },
  smoke: {
    build: () => ({ title: "Hút một điếu không?", body: "Bạn bè mời bạn hút thuốc. Hút cùng nhau, bạn thấy như được nhập hội, lại như mình đã lớn hơn một chút.", fact: L`${C().ko} ${S.sex === 'F' ? "nữ giới" : "nam giới"}의 담배 사용률: ${S.sex === 'F' ? C().sf : C().sm}% (WHO 2020, 연령 표준화)`,
      choices: [{ k: 'no', label: "Từ chối", sub: '' }, { k: 'yes', label: "Hút thử", sub: "Hòa nhập với bạn bè · có thể bị nghiện" }] }),
    apply: k => { S.done.smoke = 1; if (k === 'no' && chance(0.135) && chance(0.6)) S.flags.smokeLate = S.age + 1 + (chance(0.5) ? 1 : 0);
      if (k === 'yes') { eff({ so: 2 }); if (chance(0.6)) { S.smoker = true; const w = carerW(), told = S.age < 18 && withParents() && !S.fam.partner && !studyAway() && chance(0.5);
      return { t: "Bạn bắt đầu hút thuốc cùng bạn bè. Hút một điếu, bạn thấy lòng như dịu lại." + (told ? ' ' + L`얼마 뒤 옷에 밴 담배 냄새로 ${w === "gia đình" ? "người lớn" : w}께 들켜 크게 꾸중을 들었습니다.` : ''), f: "Cảm giác dịu lại khi hút thuốc phần lớn chỉ là cơn thèm thuốc tạm thời được xoa dịu. Những người bỏ thuốc lá sau vài tháng sẽ bớt lo âu, bớt chán nản và tâm trạng tốt hơn (Taylor và cộng sự, BMJ 2014)" }; } return "Hút vài lần rồi bạn bỏ."; } return false; }
  },
  quit: {
    build: () => ({ title: "Bỏ thuốc lá?", body: "Bạn ho ngày càng nhiều. Có nên bỏ thuốc lá không?", fact: "Trung bình, người hút thuốc giảm hơn 10 năm tuổi thọ (CDC)." + ' ' + "Ở Mỹ, trong số những người hút thuốc đã thử bỏ thuốc trong một năm, khoảng 13% bỏ được hơn sáu tháng (CDC 2015)",
      choices: [{ k: 'try', label: "Thử bỏ thuốc", sub: "Nếu thành công, sức khỏe sẽ hồi phục" }, { k: 'no', label: "Cứ hút tiếp", sub: '' }] }),
    apply: k => { if (k === 'no') return false; if (chance(0.13)) { S.smoker = false; S.flags.exSmoker = 1; eff({ hl: 4, h: 2 }); return "Bạn đã bỏ được thuốc lá!"; } eff({ h: -3 }); return { t: "Bạn đã cố bỏ thuốc nhưng không thành.", k: 'bad' }; }
  },
  city: {
    ok: () => !studyAway() && !S.mig && !S.school && S.job !== 'soldier',
    build: () => ({ title: "Lên thành phố?", body: L`${C().ko}의 도시에는 일자리가 더 많습니다. 하지만 아는 사람이 없습니다.`, fact: C().yr ? L`${eraYr()}년 ${C().ko} 도시 인구 비율 약 ${C().urb}% (UN 세계 도시화 전망)` : L`${C().ko} 도시 인구 비율 ${C().urb}% (UN-Habitat 2023)`,
      choices: [{ k: 'go', label: L`${ro(cityOfPeek())} 간다`, sub: "Thu nhập↑ Quan hệ↓" }, { k: 'stay', label: "Ở lại quê nhà", sub: '' }] }),
    apply: k => { if (k === 'stay') return false; S.urban = true; S.city = S.flags.cityPeek; S.stats.moves++; eff({ so: -8, h: -2 }); if (eraOn() && isWorking() && JOBS[S.job].s === 'agr') { S.flags.lastJob = S.job; S.job = 'seeking'; } else if (isWorking()) S.pct = clamp(S.pct + 0.06, 0, 0.99); else S.job = S.age >= 15 ? 'seeking' : S.job; S.yearMark = 'move'; return L`${ro(S.city)} 이사했습니다.` + cityHomeLeave(); }
  },
  retabroad: {
    ok: () => retAbroadOK(true),
    build: () => {
      const c = C(), ds = retDests(), P = S.fam.partner, pt = S.fam.married && P && P.alive && !P.divorced;
      const sub = d => d.why === 'kid' ? "Nơi con bạn đang sống · theo diện bảo lãnh gia đình" : d.why === 'past' ? "Nơi bạn từng sống · bạn có quyền cư trú" : freeTo(d.iso) ? "Nơi ấm áp, giá cả thấp · có thể tự do chuyển đến sống" : "Nơi ấm áp, giá cả thấp · thị thực hưu trí";
      return { title: "Nghỉ hưu rồi sẽ sống ở đâu?", body: "Giờ đã thôi làm việc, bạn thấy cũng có thể sang một nước khác để dưỡng già. Dù sống ở đâu, lương hưu vẫn được chuyển đến." + (pt ? ' ' + "Bạn đời cũng sẽ đi cùng." : '') + ' ' + "Có điều, bạn sẽ phải xa khu phố đã sống bao năm, xa bạn bè và thứ tiếng quen thuộc.",
        fact: "Anh chi trả hơn 1 triệu khoản lương hưu nhà nước ra nước ngoài, nhiều nhất cho những người về hưu sống ở Úc, Tây Ban Nha, Canada, Mỹ và Ireland (Bộ Lao động và Hưu trí Anh)",
        choices: ds.map((d, i) => ({ k: 'go' + i, label: L`${ro(CBY[d.iso].ko)} 간다`, sub: sub(d) })).concat([{ k: 'stay', label: "Ở lại nơi đang sống", sub: "Bên những người thân quen" }]) };
    },
    apply: k => {
      S.done.retab = 1; if (k === 'stay') return "Thay vì đi xa, bạn chọn dưỡng già ở khu phố quen thuộc.";
      const d = retDests()[+k.slice(2)]; if (!d) return false;
      const c = C(), x = usd2ppp(c, 4000) * (S.fam.married ? 1.6 : 1); S.money -= x; book("Chi phí di cư", -x);
      const from = S.cur; emigrate(d.iso, false, false, { keep: chance(homeKeepP()) });
      S.flags.retAb = { to: d.iso, at: S.age, why: d.why }; eff({ h: 4, so: -4 });
      return d.why === 'kid' ? L`${eul(CBY[from].ko)} 떠나 자녀가 사는 ${ro(CBY[d.iso].ko)} 옮겨 갔습니다. 이제 자녀 가까이에서 지냅니다. (−${wonStr(x)})`
        : d.why === 'past' ? L`${eul(CBY[from].ko)} 떠나 예전에 살던 ${ro(CBY[d.iso].ko)} 다시 건너갔습니다. 낯익은 거리가 반가웠습니다. (−${wonStr(x)})`
        : (sameTongue() || knowsHere() ? L`${eul(CBY[from].ko)} 떠나 ${ro(CBY[d.iso].ko)} 옮겨 노후를 보내기로 했습니다. 따뜻한 날씨와 낮은 물가가 반가웠습니다. (−${wonStr(x)})`
          : L`${eul(CBY[from].ko)} 떠나 ${ro(CBY[d.iso].ko)} 옮겨 노후를 보내기로 했습니다. 따뜻한 날씨와 낮은 물가가 반가웠지만, 말이 서툴러 한동안 장보기도 쉽지 않았습니다. (−${wonStr(x)})`);
    }
  },
  abroad: {
    build: (p = {}) => {
      const c = C(), hw = healthMig(), rich = c.mig.split(',').filter(x => CBY[x] && CBY[x].ppp > 40000);
      const er = S.flags.erasmus && CBY[S.flags.erasmus] && freeZone(c.id, S.flags.erasmus) && chance(0.5) ? S.flags.erasmus : null;
      const dests = (er ? [er] : hw ? (rich.length ? rich : ['GBR', 'USA', 'CAN', 'AUS', 'SAU', 'ARE']) : c.mig.split(',')).filter(x => CBY[x] && x !== c.id && !(p.on && (x === S.born || CBY[x].ppp <= c.ppp * 1.3)) && !(x === 'USA' && usShut(S.born, calYr(), true))); const d = CBY[pick(dests)]; if (!d) return null;
      const offer = d => {
        const skilled = S.edu >= 4 || (S.edu >= 3 && chance(0.3)), zone = freeZone(c.id, d.id);
        const fee = zone ? usd2ppp(c, 800) : skilled ? usd2ppp(c, 3000) : usd2ppp(c, d.ppp > 40000 ? 8000 : 2500);
        const easy = !zone && !skilled && c.ppp >= 30000;
        const legal = !!zone || skilled || easy || ['SAU', 'ARE', 'QAT', 'KWT', 'OMN', 'MYS', 'KOR', 'JPN', 'TWN', 'THA', 'RUS', 'KAZ', 'HKG', 'SGP'].includes(d.id);
        return { to: d.id, skilled, fee: easy ? usd2ppp(c, 2000) : fee, zone, legal, easy, hw: hw ? 1 : 0 };
      };
      const m = S.flags.mig = offer(d), { skilled, fee, zone, legal } = m;
      const d2 = p.look && !er && !hw ? CBY[pick(dests.filter(x => x !== d.id)) || ''] : null, m2 = S.flags.mig2 = d2 ? offer(d2) : null;
      const how0 = m => m.zone ? L`${freeName(m.zone, c.id, m.to)} 덕분에 비자 없이 가서 일할 수 있습니다.` : m.skilled ? "Bạn có thể xin thị thực lao động tay nghề cao." : m.easy ? "Bạn có thể đi theo thị thực vừa làm việc vừa du lịch (working holiday) hoặc được công ty bảo lãnh." : m.legal ? "Bạn có thể đi làm lao động di cư thông qua một công ty môi giới việc làm." : "Thị thực chính thức thì khó xin được, chỉ còn con đường không chính thức qua người môi giới.";
      const how = m => { const fn = famNote(m); return fn ? how0(m) + ' ' + fn : how0(m); };
      const fam = famPt() || famKidsNow().length > 0, famStay = m => fam && famRoute(m) === 'wait' && (famPt() || famGP()), famSub = m => !fam ? "Thu nhập↑ Cô đơn↑" : !famStay(m) ? "Thu nhập↑ · cùng gia đình" : "Thu nhập↑ Cô đơn↑ · gia đình ở lại quê nhà";
      const let_ = homeLetOK(c.id), goCh = (m, k) => ({ k, label: L`${ro(CBY[m.to].ko)} 떠난다`, sub: (m.legal ? famSub(m) : famStay(m) ? "Con đường nguy hiểm, thu nhập↑ · gia đình ở lại quê nhà" : "Con đường nguy hiểm, thu nhập↑") + (m2 ? ' · ' + L`약 ${wonStr(m.fee)}` : '') + (let_ ? ' · ' + "cho thuê nhà" : '') });
      const sellCh = let_ && !m2 ? { k: 'gos', label: L`집을 팔고 ${ro(CBY[m.to].ko)} 떠난다`, sub: "mang theo tiền bán nhà" } : null;
      const pr = !m2 && parGoOK(m) ? parRoute(m) : null, pw = pr ? parBringW() : '';
      const parCh = pr === 'now' ? { k: 'gop', label: L`${wa(pw)} 함께 ${ro(CBY[m.to].ko)} 떠난다`, sub: L`약 ${wonStr(m.fee + usd2ppp(c, 800) * parLive())} · ${iga(pw)} 원하셔야 함` }
        : pr === 'later' ? { k: 'gop', label: L`${ro(CBY[m.to].ko)} 떠나고, 자리 잡으면 ${eul(pw)} 모셔 온다`, sub: L`초청에 몇 해 걸릴 수 있음 · ${iga(pw)} 원하셔야 함` } : null;
      return { title: p.on ? "Cơ hội chuyển tiếp sang một nước khác" : "Cơ hội ra nước ngoài", body: hw ? L`${d.ko}의 병원이 ${S.job === 'doctor' ? "bác sĩ" : "y tá"}를 구합니다. 그 나라 면허 시험을 다시 봐야 할 수 있습니다. 비용 약 ${wonStr(fee)} (한국 체감).`
          : m2 ? L`알아본 끝에 두 곳에서 일할 길을 찾았습니다. ${d.ko}: ${how(m)} ${d2.ko}: ${how(m2)}`
          : L`${d.ko}에서 일할 길이 생겼습니다. ${how(m)} 비용 약 ${wonStr(fee)} (한국 체감).`,
        fact: L`${d.ko}의 1인당 GDP(PPP)는 ${c.ko}의 약 ${(d.ppp / c.ppp).toFixed(1)}배 · 전 세계 국제 이주자 약 2억 8,100만 명 (IOM 2024)`,
        choices: [goCh(m, 'go'), sellCh, parCh, m2 ? goCh(m2, 'go2') : null, { k: 'stay', label: "Ở lại", sub: '' }].filter(Boolean) };
    },
    apply: k => {
      S.done.abroad2 = (S.done.abroad2 || 0); if (k === 'stay') return false;
      const m = k === 'go2' && S.flags.mig2 ? S.flags.mig2 : S.flags.mig; S.flags.mig2 = null; if (!m.legal) S.money -= m.fee;
      if (!m.legal && chance(0.015)) { die('drown', "tai nạn trên đường di cư"); return false; }
      if (m.legal && !m.zone && chance(0.85 * recW())) { const x = visaApp(m); S.money -= x; eff({ h: -10 }); return { t: L`범죄 기록 때문에 비자가 거절되었습니다. 신청 비용만 날렸습니다. (−${wonStr(x)})`, k: 'bad' }; }
      if (m.zone || chance(m.legal ? 0.75 : 0.55)) { if (m.legal) S.money -= m.fee; const c0 = C(); emigrate(m.to, m.skilled, false, { keep: k !== 'gos' }); if (!m.legal) S.flags.irreg = S.age;
        if (m.legal && !m.skilled && !m.zone && !m.easy && c0.ppp < 15000 && S.money < 0) log("Bạn đã vay tiền để trả phí môi giới và vé máy bay. Lương mấy năm đầu sẽ phải dùng để trả dần.", 'note', REC_F());
        const fm = famMove(m, c0.id, k);
        return L`${CBY[m.to].ko}에 도착했습니다. 새 삶이 시작됩니다.` + (fm ? ' ' + fm : '') + (m.legal ? '' : ' ' + "Bạn không có giấy phép cư trú.") + (S.job === 'seeking' ? ' ' + "Trước hết, bạn cần tìm việc làm." : ''); }
      eff({ h: -10 }); if (!m.legal) return { t: "Bạn bị bắt ở biên giới và bị đưa trả về.", k: 'bad' };
      const x = visaApp(m); S.money -= x; return { t: L`비자가 거절되었습니다. 신청 비용만 날렸습니다. (−${wonStr(x)})`, k: 'bad' };
    }
  },
  erasmus: {
    ok: () => erasmusOK(),
    build: () => {
      const c = C(), d = CBY[erasmusTo()]; if (!d) return null;
      const city = cityOf(d), cost = usd2ppp(c, 1200); S.flags.erasP = { to: d.id, city, cost };
      return { title: "Thử đi trao đổi sinh viên?", body: L`학교의 에라스무스 교환 프로그램으로 한 학기 동안 ${cityIn(d.ko, city)}의 대학에서 공부할 수 있습니다. 장학금이 나오지만 생활비가 조금 더 듭니다. 약 ${wonStr(cost)} (한국 체감).`,
        fact: "Ngày nay, mỗi năm có khoảng 470.000 sinh viên đại học châu Âu sang nước khác học theo chương trình Erasmus. Những người từng tham gia sau này đi làm ở nước ngoài nhiều hơn (Ủy ban châu Âu)",
        choices: [{ k: 'go', label: "Lên đường", sub: "Hạnh phúc↑ Quan hệ↑ · tốn một ít chi phí" }, { k: 'no', label: "Lần này thì ở lại", sub: '' }] };
    },
    apply: k => {
      S.done.erasmus = 1; const e = S.flags.erasP; if (k === 'no' || !e || !CBY[e.to]) return false;
      S.flags.erasmus = e.to; S.money -= e.cost; eff({ h: 7, so: 4, sm: 2 }); S.yearMark = 'trip'; tripTo(e.to);
      return { t: L`에라스무스 교환학생으로 ${cityIn(CBY[e.to].ko, e.city)}에서 한 학기를 보냈습니다. 여러 나라에서 온 친구들이 생겼습니다. (−${wonStr(e.cost)})`, k: 'warm' };
    }
  },
  party: {
    ok: () => !!partyOf(C()) && S.flags.party == null && S.job !== 'prison',
    build: () => {
      const c = C(), P = partyOf(c), where = S.school ? "Ở trường, có người" : S.serveLeft > 0 || ['soldier', 'police'].includes(S.job) ? "Trong đơn vị, có người" : isWorking() ? "Chi bộ đảng ở nơi làm việc" : "Chi bộ đảng ở khu phố";
      return { title: L`${P.n}에 들어갈까?`, body: L`${where} 입당을 권했습니다. 당원이 되면 공직과 승진에 길이 넓어지지만, 학습과 모임에 시간을 내고 당비를 내야 합니다.`,
        fact: P.f,
        choices: [{ k: 'join', label: "Vào đảng", sub: "Có lợi cho chức vụ nhà nước và thăng tiến · sinh hoạt và đảng phí" }, { k: 'no', label: "Tạm thời từ chối", sub: '' }] };
    },
    apply: k => {
      S.flags.last_party = S.age; S.done.party = (S.done.party || 0) + 1; if (k === 'no') return false;
      S.flags.party = S.age; eff({ so: 2 });
      return L`${partyOf(C()).n}에 입당했습니다. 한동안 예비 당원으로 학습 모임에 나갔습니다.`;
    }
  },
  remit: {
    build: () => ({ title: "Gửi tiền về quê?", body: farFromNK() ? "Qua người môi giới, bạn nhận được tin gia đình còn ở lại Triều Tiên đang sống rất khó khăn. Tiền gửi về sẽ bị trừ phí môi giới." : L`고향 ${B().ko}의 가족이 어려움을 겪고 있습니다.`, fact: "Năm 2023, kiều hối gửi về các nước thu nhập thấp và trung bình đạt khoảng 656 tỷ đô la Mỹ, nhiều hơn cả đầu tư trực tiếp nước ngoài (Ngân hàng Thế giới)",
      choices: [{ k: 'send', label: "Gửi 20% thu nhập", sub: "Quan hệ gia đình↑ Tài sản↓" }, { k: 'no', label: "Lo cho cuộc sống của mình trước", sub: '' }] }),
    apply: k => { if (k === 'send') { S.money -= S.income * 0.2; eff({ so: 6, h: 3 }); if (S.fam.mom.alive) btAdd(S.fam.mom, 3); if (S.fam.dad.alive && !S.fam.dad.absent) btAdd(S.fam.dad, 3); return farFromNK() ? "Bạn gửi tiền qua người môi giới. Một tin nhắn ngắn gửi lại: gia đình đã mua được gạo để qua mùa đông." : remitNews(); } eff({ so: -3 });
      return DEC_Q ? { t: "Lại có tin gia đình ở quê đang khó khăn, nhưng lần này bạn vẫn lo cho cuộc sống của mình trước.", k: 'ev' } : false; }
  },
  war: {
    build: () => ({ title: "Xung đột đã đến gần", body: (C().yr && C().wn ? L`${iga(C().wn)} 마을 가까이 번졌습니다. ` : '') + (S.age < 18 ? L`총성이 들리기 시작했습니다. 이웃들이 짐을 싸고, ${eun(parW())} 밤새 의논합니다.` : "Tiếng súng bắt đầu vang lên. Hàng xóm đang thu dọn đồ đạc."),
      fact: C().yr ? (C().yr < NOW_Y ? "Cứ mười người chạy khỏi chiến tranh thì có bảy người ở lại gần đó hoặc ở nước láng giềng (UNHCR)" : "Cuộc chiến này là một dự phóng dựa trên xác suất trong quá khứ. Năm 2024, trên thế giới có hơn 120 triệu người buộc phải rời bỏ nơi ở (UNHCR)") : "Năm 2024, trên thế giới có hơn 120 triệu người buộc phải rời bỏ nơi ở (UNHCR)",
      choices: S.age < 18 ? [{ k: 'flee', label: "Cùng gia đình đi lánh nạn", sub: "An toàn↑ bỏ lại tất cả" }, { k: 'stay', label: "Cùng gia đình ở lại nhà", sub: "Nguy hiểm" }] : [{ k: 'flee', label: "Đi lánh nạn", sub: "Tài sản↓ An toàn↑" }, { k: 'stay', label: "Ở lại giữ nhà", sub: "Nguy hiểm" }] }),
    apply: k => {
      const c = C();
      if (k === 'stay') { if (chance((c.yr && c.yr < NOW_Y ? 0.01 : 0.03) * c.war)) { die('war'); return false; } eff({ h: -8, hl: -4 }); return { t: "Bạn đã vượt qua những ngày tháng đáng sợ.", k: 'bad' }; }
      S.refugee = true; S.refugeeUntil = S.age + ri(2, 8); S.money *= 0.4; S.house = 0; delete S.owns.house; loseRentals(c.id); S.stats.moves++; eff({ h: -10, so: -8 });
      const eh = eraWarHosts(c), hosts = (eh != null ? eh : (REF_HOST[c.id] || c.mig || '')).split(',').filter(x => CBY[x] && x !== c.id), dest = hosts.length ? pick(hosts) : null;
      if (dest && chance(0.5)) { emigrate(dest, false, true); return CAMPS.has(dest) ? L`국경을 넘어 ${CBY[dest].ko}의 난민촌으로 피난했습니다.` : L`국경을 넘어 ${ro(CBY[dest].ko)} 피난했습니다. 난민 신청을 하고 낯선 도시에서 새 삶을 시작했습니다.`; }
      return { t: "Bạn rời quê hương và trở thành người di tản ngay trên đất nước mình.", k: 'bad' };
    }
  },
  hobby: {
    build: () => {
      const opts = hobbyOptions(3); if (!opts.length) return null;
      S.flags.hobOpts = opts;
      return { title: S.hobbies.length ? "Bắt đầu một sở thích mới?" : "Tìm được điều mình yêu thích", body: S.hobbies.length ? L`지금 취미: ${S.hobbies.map(h => hobbyName(h.id)).join(', ')}` + (hobDrop() ? ' · ' + hobDropLine() : '') : "Lúc rảnh rỗi, bạn sẽ làm gì?",
        choices: opts.map(o => ({ k: o, label: hobbyName(o), sub: hobbySub(o) })).concat(S.hobbies.length ? [{ k: 'none', label: "Sở thích hiện tại là đủ rồi", sub: '' }] : []) };
    },
    apply: k => { if (k === 'none') return false; hobAdd({ id: k, lv: 0, since: S.age }); eff({ h: 3 });
      if (k === 'faith' && S.rel === 'N') { const P = S.fam.partner, to = S.fam.married && P && P.alive && !P.divorced && P.rel && P.rel !== 'N' && relTo(P.rel) ? P.rel : swTo(C());
        if (to && to !== 'N') { const fam = faithMove(to); eff({ so: 2 }); return L`${relName()} 모임에 꾸준히 나가기 시작했습니다. 그곳에서 마음 둘 곳을 찾았습니다.` + (fam ? ' ' + fam.t : ''); } }
      return k === 'faith' ? "Bạn bắt đầu đều đặn tham gia các buổi sinh hoạt tôn giáo." : L`${hobbyName(k)}에 푹 빠졌습니다.`; }
  },
  buy: {
    ok: p => !S.owns[p.item],
    build: p => {
      const it = ITEMS[p.item], price = itemPrice(p.item);
      const fin = canFinance(p.item, price), loanCh = { k: 'loan', label: "Mua trả góp", sub: L`4년 할부 · 빚 약 ${wonStr(price - Math.max(0, S.money))} · 이자가 붙어요` };
      if (p.item === 'moto') return { title: "Mua xe máy?", body: isWorking() ? L`가격은 약 ${wonStr(price)} (한국 체감 금액). 출퇴근과 장보기가 훨씬 쉬워지지만, 사고 위험도 커집니다.${fin ? " Tiền dành dụm không đủ nên bạn phải mua trả góp." : ''}` : L`가격은 약 ${wonStr(price)} (한국 체감 금액). 장보기와 나들이가 훨씬 쉬워지지만, 사고 위험도 커집니다.${fin ? " Tiền dành dụm không đủ nên bạn phải mua trả góp." : ''}`, fact: L`전 세계 교통사고 사망자의 약 21%가 오토바이 등 이륜·삼륜차 탑승자입니다 (WHO 2023) · ${C().ko} 도로 교통사고 사망률 인구 10만 명당 약 ${C().road}명`,
        choices: [fin ? Object.assign(loanCh, { label: "Mua trả góp một chiếc xe máy" }) : { k: 'buy', label: "Mua xe máy", sub: L`행복 +${it.joy} · 교통사고 위험 ↑` }, { k: 'never', label: "Không đi xe máy", sub: "Sẽ không hỏi lại nữa" }, { k: 'no', label: "Để sau hãy tính", sub: '' }] };
      if (fin) return { title: L`${eul(it.n)} 할부로 살까?`, body: L`가격은 약 ${wonStr(price)} (한국 체감 금액). 지금 모은 돈은 ${savedAmt()}이라 한 번에 살 수는 없습니다. 4년 할부로 사면 그동안 빚이 남고 이자가 붙습니다.` + (p.item === 'car' ? carCommuteNote() : ''),
        fact: "Ở Mỹ, hơn 80% ô tô mới được bán theo hình thức vay vốn hoặc thuê tài chính (Experian, quý 3 năm 2025)", choices: [Object.assign(loanCh, { sub: loanCh.sub + L` · 행복 +${it.joy}` }), { k: 'no', label: "Dành dụm đủ rồi mới mua", sub: "Không mắc nợ" }] };
      const d = p.item === 'house' ? houseDeal() : null; S.flags.houseDeal = d;
      if (p.item === 'house' && !d) return null;
      const rv = { title: L`${eul(it.n)} 살까?`, body: d ? L`가격은 약 ${wonStr(d.price)} (한국 체감 금액). ${S.money > 0 ? (d.help ? L`모은 돈 ${wonStr(S.money)}에 ${parW()}께서 ${wonStr(d.help)}을 보태 주시기로 했습니다` : L`모은 돈 ${wonStr(S.money)}이 있습니다`) : (d.help ? L`모은 돈은 없지만 ${parW()}께서 ${wonStr(d.help)}을 보태 주시기로 했습니다` : "Bạn không có tiền dành dụm")}. ${d.loan > 0 ? L`나머지 ${wonStr(d.loan)}은 대출로 갚아야 합니다.` : "Bạn có thể mua mà không cần vay."}` : L`가격은 약 ${wonStr(price)} (한국 체감 금액). 지금 모은 돈은 ${savedAmt()}입니다.`, fact: p.item === 'house' ? cityFact(C()) || L`${C().ko}의 집값은 중위 연소득의 약 ${(housePrice(C()) / incomeAt(C(), 0.5)).toFixed(0)}배로 가정했습니다` : C().id === 'USA' ? L`시장가 약 $${ITEMS[p.item].usd.toLocaleString()}` : L`시장가 약 $${ITEMS[p.item].usd.toLocaleString()} · ${C().ko} 물가수준은 미국의 약 ${pctStr(plr(C()))}`,
        choices: [{ k: 'buy', label: p.item === 'house' ? (d && S.money + (d.help || 0) >= d.price ? "Mua bằng tiền dành dụm" : "Vay ngân hàng để mua") : "Mua", sub: L`행복 +${it.joy}` }, { k: 'no', label: "Để sau", sub: "Giữ khoản tiết kiệm" }] };
      if (p.item === 'car') rv.body += carCommuteNote();
      if (p.item === 'house' && S.invest === 'property') rv.body += ' ' + "Đây là căn nhà để bạn ở, tách biệt với khoản tiền bạn đang đầu tư vào bất động sản.";
      return rv;
    },
    apply: (k, p) => {
      if (k === 'never') { S.flags.noMoto = 1; return "Bạn quyết định không đi xe máy."; }
      if (k === 'no') { S.flags['skip_' + p.item] = S.age; S.flags['skipN_' + p.item] = (S.flags['skipN_' + p.item] || 0) + 1; return false; }
      if (S.owns[p.item]) return false;
      const hd = p.item === 'house' ? S.flags.houseDeal : null; if (hd && hd.help) { S.money += hd.help; S.flags.hHelp = S.age; }
      const h0 = p.item === 'car' ? carH0() : 0;
      const price = hd && hd.price ? hd.price : itemPrice(p.item); S.money -= price; S.owns[p.item] = S.age; eff({ h: ITEMS[p.item].joy });
      const ct = p.item === 'car' ? carBought(h0) : '';
      const mv = p.item === 'house' ? homeBought() : '';
      if (p.item === 'house') { S.house = price; S.flags.hPaid = price; houseSet(); S.flags.hadHome = 1; S.flags.hBuyAt = S.age; }
      S.yearMark = S.yearMark || 'buy';
      if (k === 'loan') { S.flags.loanBuy = S.age; return L`${eul(ITEMS[p.item].n)} 할부로 샀습니다. 앞으로 몇 년 동안 갚아 나가야 합니다.` + ct; }
      return { phone: "Bạn có chiếc điện thoại thông minh đầu tiên.", moto: motoLine(), car: "Bạn đã mua ô tô." + ct, house: (hd && hd.help ? L`${parW()}의 도움을 받아 내 집을 마련했습니다!` : "Bạn đã có căn nhà của riêng mình!") + mv, tv: "Nhà bạn đã có tivi và tủ lạnh." }[p.item];
    }
  },
  diag: {
    build: (p = {}) => {
      const c = C(); let k = p.k;
      if (k ? !S.conds[k] || S.conds[k].dx === false || S.conds[k].card : false) { S.flags.dxQ = (S.flags.dxQ || []).filter(x => x !== k); return null; }
      if (!k) { const opts = NCD_K.filter(x => !S.conds[x]); if (!opts.length) return null;
        const w = { htn: 3, dm: c.p === 'mena' ? 2.5 : c.p === 'sa' ? 2 : 1.3, heart: S.age > 50 ? 1 : 0.3 };
        const ok = {}; opts.forEach(o => ok[o] = w[o]); k = wpick(ok); }
      S.flags.dg = k;
      const name = ncdName(k);
      const cost = incomeAt(c, 0.5) * 0.08 * (c.oop / 100) * 3 * (HOSP_FREE.has(c.id) ? 0.5 : 1);
      S.flags.dgCost = cost;
      return { title: L`${name} 진단을 받았습니다`, body: L`꾸준한 약 복용과 관리가 필요합니다. 본인 부담 약값은 연 ${wonStr(cost)} 정도입니다 (한국 체감).`, fact: k === 'htn' ? "Trên thế giới có khoảng 1,3 tỷ người trưởng thành 30–79 tuổi bị tăng huyết áp, và gần một nửa trong số đó không biết mình bị bệnh (WHO 2023)" : k === 'dm' ? "Tỷ lệ người trưởng thành mắc bệnh đái tháo đường trên thế giới khoảng 10,5% (IDF 2021)" : L`${c.ko}의 의료비 중 본인 부담 비율 ${c.oop}% (WHO GHED)`,
        choices: [{ k: 'treat', label: "Điều trị đều đặn", sub: "Giữ được sức khỏe, tốn chi phí" }, { k: 'life', label: "Uống thuốc, đồng thời thay đổi cách ăn uống và vận động", sub: "Tốn chi phí · nguy cơ ↓" }, { k: 'ignore', label: "Chắc không sao đâu, cứ để vậy", sub: "Tiết kiệm tiền nhưng nguy hiểm" }] };
    },
    apply: k => {
      const dg = S.flags.dg, was = S.conds[dg];
      S.conds[dg] = { since: was ? was.since : S.age, dx: true, dxAt: was && was.dxAt != null ? was.dxAt : S.age, treated: k !== 'ignore', card: 1 };
      S.flags.dxQ = (S.flags.dxQ || []).filter(x => x !== dg);
      const nm = ncdName(dg);
      if (k === 'ignore') { eff({ hl: -6 }); return DEC_Q ? { t: L`${nm} 진단을 받았지만, 이번에도 괜찮겠지 하고 버티기로 했습니다.`, k: 'bad' } : false; }
      S.money -= S.flags.dgCost * 5; eff({ hl: -2 });
      if (k === 'life') { S.flags.diet = 'good'; S.flags.ncdLife = S.age; eff({ hl: 2 }); return DEC_Q ? L`${nm} 진단을 받았습니다. 이번에도 약을 챙겨 먹으며 식습관과 운동을 함께 챙기기로 했습니다.` : noWalk() ? "Bạn bắt đầu uống thuốc đều đặn, ăn nhạt hơn và tập thói quen vận động thường xuyên." : "Bạn bắt đầu uống thuốc đều đặn, ăn nhạt hơn và tập thói quen đi bộ."; }
      return DEC_Q ? L`${nm} 진단을 받았습니다. 이번에도 약을 꾸준히 챙겨 먹기로 했습니다.` : false;
    }
  },
  illness: {
    build: () => {
      const c = C(), id = pickIllness(c); if (!id) return null;
      const ill = ILLS[id].n; const full = incomeAt(c, 0.5) * 0.35 * hospPrice(c); const oop = full * hospShare(c, S.age);
      const free = hospShare0(c, S.age) <= 0.02, sh = free ? 0 : famCareSh(), own = oop * (1 - sh);
      S.flags.ill = { id, ill, cost: oop, sh };
      return { title: ILLS[id].t, body: ILLS[id].b + ' ' + (free ? "Viện phí gần như không mất gì." + ' ' + L`약값 등 본인 부담은 약 ${wonStr(oop)} (한국 체감)입니다.` + ' ' + L`모아 둔 돈은 ${savedAmt()}입니다.` : (insOn() ? "Bảo hiểm trả phần lớn viện phí." + ' ' : '') + (sh >= 1 ? L`병원 치료비 본인 부담 약 ${wonStr(oop)} (한국 체감)은 부모님이 모두 내 주시기로 했습니다.` : sh > 0 ? L`병원 치료비 본인 부담이 약 ${wonStr(oop)} (한국 체감)입니다. 그 가운데 ${wonStr(oop - own)}은 부모님이 내 주시기로 했습니다. 모아둔 돈은 ${savedAmt()}.` : L`병원 치료비 본인 부담이 약 ${wonStr(oop)} (한국 체감)입니다. 모아둔 돈은 ${savedAmt()}.`)), fact: milCare() ? "Quân nhân tại ngũ thường được hệ thống y tế quân đội chữa trị mà không phải tự chi trả (Bộ Quốc phòng Anh, Bộ Quốc phòng Mỹ TRICARE)" : c.id === 'USA' ? "Ở Mỹ, cứ mười người lớn dưới 65 tuổi thì khoảng một người không có bảo hiểm y tế, và khi không có bảo hiểm, dù được giảm giá vẫn phải tự trả một phần lớn viện phí (KFF 2024)" : HOSP_FREE.has(c.id) ? L`${c.ko}의 공공 병원은 세금으로 운영되어 입원 치료비를 거의 내지 않습니다. 다만 급하지 않은 수술은 오래 기다리기도 합니다 (OECD)` : L`${c.ko} 의료비 본인 부담 비율 ${c.oop}% · 전 세계 약 20억 명이 의료비로 재정적 어려움을 겪습니다 (WHO·세계은행 2023)`,
        choices: [{ k: 'hospital', label: "Điều trị ở bệnh viện", sub: sh >= 1 ? "Bố mẹ trả giúp" : S.money >= own ? L`약 ${wonStr(own)}` : "Dù phải mắc nợ" }, { k: 'cheap', label: "Cầm cự bằng thuốc tự mua và cách chữa dân gian", sub: "Tiết kiệm tiền nhưng nguy hiểm" }] };
    },
    apply: k => {
      const f = S.flags.ill; if (f.id) (S.flags.illHad = S.flags.illHad || {})[f.id] = S.age;
      if (k === 'hospital') { S.money -= f.cost * (1 - (f.sh || 0)); eff({ hl: -4, h: -3 }); S.flags.hospAt = S.age;
        if (HOSP_WAIT.has(C().id) && !insOn() && ['gall', 'disc'].includes(f.id) && chance(0.5)) { eff({ hl: -3, h: -2 }); return L`병원에서 ${ira(illDx(f.id))}라는 진단을 받았습니다. 치료비는 거의 들지 않았지만, 수술까지 몇 달을 기다리는 동안 몸이 많이 상했습니다.`; }
        return L`병원에서 ${ira(illDx(f.id))}라는 진단을 받고 치료해 회복했습니다.`; }
      if (f.id === 'tb') { S.flags.tbUn = S.age; eff({ hl: -10, h: -5 }); return { t: "Ho và sốt kéo dài mấy tuần, nhưng bạn chỉ cầm cự bằng thuốc mua ở hiệu thuốc. Nếu là bệnh lao, cứ thế này sẽ không khỏi.", k: 'bad', f: "Phần lớn người mắc lao khỏi bệnh sau 6 tháng uống thuốc, nhưng nếu không điều trị, gần một nửa số người bệnh tử vong (WHO, Báo cáo Lao toàn cầu)" }; }
      const D = ILL_DIE[f.id], p = D ? (typeof D[0] === 'function' ? D[0](S.age) : D[0]) : 0;
      if (chance(p)) { die(D[1], D[2] || undefined); return false; }
      eff({ hl: -14, h: -6 }); return { t: "Bạn ốm rất lâu mà không biết mình mắc bệnh gì, và cơ thể không còn được như trước.", k: 'bad' };
    }
  },
  tbcare: {
    ok: () => S.flags.tbUn != null && S.job !== 'prison',
    build: () => ({ title: "Cơn ho không dứt", body: "Mấy tháng nay bạn ho, sốt nhẹ kéo dài và sụt cân. Bạn có muốn đến trạm y tế xét nghiệm lao không?",
      fact: "Phần lớn người mắc lao khỏi bệnh sau 6 tháng uống thuốc, và ở nhiều nước, điều trị lao tại cơ sở y tế công là miễn phí. Nếu không điều trị, gần một nửa số người bệnh tử vong (WHO, Báo cáo Lao toàn cầu)",
      choices: [{ k: 'treat', label: "Đi xét nghiệm và bắt đầu điều trị", sub: "Uống thuốc mỗi ngày trong 6 tháng" }, { k: 'wait', label: "Cố cầm cự thêm", sub: "Rủi ro" }] }),
    apply: k => {
      if (k === 'wait') { eff({ h: -1 }); return false; }
      S.flags.tbUn = null; eff({ hl: -3, h: 2 });
      if (chance(0.05)) { die('tb'); return false; }
      return { t: "Bạn được chẩn đoán mắc lao và uống thuốc không sót ngày nào suốt 6 tháng. Cơn ho đã dứt và sức khỏe dần trở lại.", k: 'warm' };
    }
  },
  babycare: {
    ok: p => { const k = S.fam.kids[p.i]; if (!k || !k.alive || k.away) return false;
      if (!kidCareNow()) { careLater(p.i); return false; }
      return careOpts().length >= 2; },
    build: p => {
      const c = C(), k = S.fam.kids[p.i], n = kidsCall(kidAndTwin(k)), o = careOpts(), P = S.fam.partner, gp = careGp(), cost = careCost(c), two = partnerWorks();
      const lab = { me: { k: 'me', label: "Tự nghỉ việc ở nhà chăm con", sub: "Mất thu nhập · thời gian bên con" },
        pt: { k: 'pt', label: "Giảm bớt việc, chuyển sang làm bán thời gian", sub: "Thu nhập còn khoảng 60% trong chừng 3 năm" },
        partner: { k: 'partner', label: "Bạn đời nghỉ việc ở nhà chăm con", sub: "Bạn đời mất thu nhập trong vài năm" },
        gp: { k: 'gp', label: gp !== 'mine' ? (S.sex === 'F' ? "Gửi con cho bố mẹ chồng" : "Gửi con cho bố mẹ vợ") : parElsewhere() ? L`고향의 ${parW()}께 아이를 맡긴다` : !S.fam.married ? L`${parW()}께 아이를 맡긴다` : S.sex === 'F' ? L`친정 ${parW()}께 아이를 맡긴다` : L`내 ${parW()}께 아이를 맡긴다`,
          sub: gp === 'mine' && parElsewhere() ? "Gần như không tốn tiền · phải sống xa con" : gp === 'mine' ? L`비용은 거의 없다 · ${parW()}께 신세를 진다` : "Gần như không tốn tiền · nhờ cậy bố mẹ" },
        pay: { k: 'pay', label: "Gửi nhà trẻ hoặc thuê người trông trẻ", sub: L`해마다 약 ${wonStr(cost)}` },
        carry: { k: 'carry', label: "Mang con theo khi đi làm", sub: "Vất vả nhưng con luôn ở bên cạnh" } };
      const why = p.why ? ' ' + ({ debt: "Nợ nần tăng lên, chi tiêu trong nhà eo hẹp.", job: "Trong thời gian đó, công việc của bạn đã thay đổi.", gpnew: "Giờ đây đã có thể gửi con cho bố mẹ trông.",
        gpgone: "Không còn có thể gửi con cho bố mẹ trông như trước nữa.", years: "Đã mấy năm trôi qua kể từ lần quyết định trước." }[p.why] || '') : '';
      const was = p.why && S.flags.way && S.flags.way.babycare, ch = o.map(x => lab[x]);
      if (was && lab[was] && o.includes(was)) { const w = lab[was]; ch.splice(ch.indexOf(w), 1); ch.unshift(Object.assign({}, w, { sub: L`지난번처럼 · ${w.sub}` })); }
      const sp = two && P.name ? (o.includes('partner') && P.inc < S.income * 0.7 ? 'partner' : o.includes('gp') ? 'gp' : o.includes('pay') ? 'pay' : null) : null, pn = sp ? callName(P.name) : '';
      const spl = sp ? ' ' + (sp === 'partner' ? L`배우자 ${eun(pn)} 몇 해는 자기가 일을 쉬고 아이를 보겠다고 합니다.` : sp === 'gp' ? L`배우자 ${eun(pn)} 부모님께 부탁드려 보자고 합니다.` : L`배우자 ${eun(pn)} 아이를 맡기고 둘 다 계속 일하자고 합니다.`) : '';
      return { title: L`누가 ${eul(n)} 돌볼까요?`, body: (p.again ? L`${eul(n)} 봐 주시던 부모님이 떠나셨습니다. 이제 누가 아이를 돌볼지 다시 정해야 합니다.` : p.back ? (two ? L`이제 둘 다 일을 하게 되어, 누가 ${eul(n)} 돌볼지 정해야 합니다.` : L`다시 일을 하게 되어, 누가 ${eul(n)} 돌볼지 정해야 합니다.`) : p.why ?L`${n}의 첫돌이 다가옵니다. 아이가 늘어, 누가 아이들을 돌볼지 다시 정해야 합니다.` + why : two ? L`${n}의 첫돌이 다가옵니다. 둘 다 일을 하고 있어서, 누가 아이를 돌볼지 정해야 합니다.` : L`${n}의 첫돌이 다가옵니다. 일을 하면서 누가 아이를 돌볼지 정해야 합니다.`) + spl,
        fact: c.id === 'KOR' ? "Từ năm 2013, Hàn Quốc hỗ trợ phí giữ trẻ cho trẻ từ 0 đến 5 tuổi, nên phụ huynh chỉ phải trả rất ít cho nhà trẻ (Bộ Y tế và Phúc lợi Hàn Quốc)" : c.p === 'hi' ? "Chi phí giữ trẻ ở các nước OECD rất khác nhau: ở Anh, Thụy Sĩ và Mỹ có thể vượt quá một phần tư thu nhập, còn ở Bắc Âu và Đức thì rất thấp (OECD)" : matFact(c),
        choices: ch };
    },
    apply: (k, p) => {
      const c = C(), kid0 = S.fam.kids[p.i], tw = kidAndTwin(kid0), n = kidsCall(tw), P = S.fam.partner, until = S.age + 6;
      const bdAdd = v => { for (const x of tw) x.bd = (x.bd || 0) + v; };
      S.flags.bcareW = { k, at: S.age, j: S.job, inc: Math.round(S.income), g: careGp() ? 1 : 0 }; if (k === 'me' || k === 'pt' || k === 'partner') S.flags.bcare = null;
      S.flags.careWait = null;
      if (k === 'me') { S.flags.lastJob = S.job; S.job = 'homemaker'; bdAdd(3); eff({ so: 3 }); return { t: L`일을 그만두고 ${eul(n)} 돌보기로 했습니다.`, f: matFact(c) }; }
      if (k === 'pt') { S.flags.ptTo = S.age + 3; bdAdd(2); eff({ h: 1, so: 2 }); return L`일을 줄여 시간제로 일하며 ${eul(n)} 돌보기로 했습니다.`; }
      if (k === 'partner') { P.out = ri(2, 6); P.hm = 1; P.inc = 0; return { t: L`배우자 ${iga(callName(P.name))} 일을 쉬고 ${eul(n)} 돌보기로 했습니다.`, f: matFact(c) }; }
      const au = (p && p.auto) || S.flags.bcareAuto ? 1 : 0;
      if (k === 'gp') { const who = careGp(), far = who === 'mine' && parElsewhere(); S.flags.bcare = { k: 'gp', until, who, auto: au }; eff({ so: 3 });
        if (far) { bdAdd(-2); return { t: L`고향의 ${parW()}께 ${eul(n)} 맡기고 도시에서 일했습니다. 명절마다 아이를 보러 내려갔습니다.`, f: c.id === 'CHN' ? "Ở Trung Quốc, hơn 40 triệu trẻ em lớn lên bên ông bà ở quê trong khi bố mẹ lên thành phố làm việc (UNICEF Trung Quốc, điều tra dân số năm 2020)" : null }; }
        const ho = homeOthers();
        const pw = parW();
        if (who === 'mine' && (ho.mom || ho.dad)) return S.fam.married && S.sex === 'F' ? L`함께 사는 친정 ${pw}께서 ${eul(n)} 맡아 길러 주셨습니다.` : L`함께 사는 ${pw}께서 ${eul(n)} 맡아 길러 주셨습니다.`;
        return who !== 'mine' ? L`배우자의 부모님께서 ${eul(n)} 맡아 길러 주셨습니다.` : S.fam.married && S.sex === 'F' ? L`친정 ${pw}께서 ${eul(n)} 맡아 길러 주셨습니다. 퇴근길마다 아이를 데리러 갔습니다.`
          : S.fam.married ? L`내 ${pw}께서 ${eul(n)} 맡아 길러 주셨습니다. 퇴근길마다 아이를 데리러 갔습니다.` : L`${pw}께서 ${eul(n)} 맡아 길러 주셨습니다. 퇴근길마다 아이를 데리러 갔습니다.`; }
      if (k === 'pay') { S.flags.bcare = { k: 'pay', until, auto: au }; eff({ h: -1 }); return L`${eul(n)} 어린이집에 맡기고 다시 출근했습니다.`; }
      S.flags.bcare = { k: 'carry', until, auto: au }; eff({ hl: -2, h: -1 }); bdAdd(2); return L`${eul(n)} 등에 업고 일을 나갔습니다.`;
    }
  },
  maternity: {
    build: () => ({ title: "Tiếp tục đi làm sau khi sinh?", body: L`아기가 아직 어립니다. ${frSx(JOBS[S.job].n.replace(/ \(.*\)$|（.*）$/, ''), S.sex)} 일을 계속하려면 아이를 맡길 곳과 가족의 도움이 필요합니다.`, fact: matFact(C()),
      choices: [{ k: 'keep', label: "Tiếp tục đi làm", sub: "Giữ được thu nhập và sự nghiệp · mệt cả thể chất lẫn tinh thần" }, { k: 'quit', label: "Nghỉ việc ở nhà chăm con", sub: "Không có thu nhập · thời gian bên con" }] }),
    apply: k => {
      if (k === 'keep') { eff({ h: -2, hl: -2, so: -1 }); return pick(["Bạn gửi con vào nhà trẻ rồi đi làm lại."].concat(S.fam.mom.alive || S.fam.married ? ["Nhờ bà trông con giúp, bạn tiếp tục đi làm."] : [])); }
      S.job = 'homemaker'; eff({ so: 3 }); return { t: "Bạn quyết định nghỉ việc để ở nhà chăm con.", k: 'bad' };
    }
  },
  major: {
    build: () => {
      const c = C(), sm = S.st.sm;
      const bg = sportBack(5), medIn = !S.flags.nightUni && sm >= 92 && chance(medLine(sm));
      const ok = Object.keys(MAJORS).filter(k => k !== 'med' && !MAJORS[k].acad && !MAJORS[k].aud && (k !== 'law' || sm >= 40) && (k !== 'cs' || c.net >= 40) && (k !== 'pe' || bg || chance(0.2)));
      const opts = []; const pool = {}; for (const k of ok) pool[k] = MAJORS[k].w || 1;
      while (opts.length < (medIn ? 4 : 5) && Object.keys(pool).length) { const k = wpick(pool); delete pool[k]; opts.push(k); }
      if (bg && !opts.includes('pe')) opts[opts.length - 1] = 'pe';
      const aud = S.flags.nightUni || S.school === 'grad' ? [] : Object.keys(AUD_MAJ).filter(audOK);
      const hm = hobbyMajor(ok.concat(aud));
      const keep = new Set(bg ? ['pe'] : []);
      const put = k => { if (opts.includes(k)) { keep.add(k); return; } for (let i = opts.length - 1; i >= 0; i--) if (!keep.has(opts[i])) { opts[i] = k; keep.add(k); return; } };
      if (hm) put(hm.k);
      const dm = dreamMajor(ok);
      if (dm) put(dm);
      const tm = !hm ? talMajor(ok) : null;
      if (tm) put(tm.k);
      for (const k of aud) put(k);
      if (medIn) opts.unshift('med');
      const line = (medIn ? ' ' + "Điểm của bạn đã vượt ngưỡng trúng tuyển ngành y." : sm >= 80 && !S.flags.nightUni ? ' ' + "Điểm của bạn chỉ thiếu một chút là đạt ngưỡng trúng tuyển ngành y." : '')
        + (hm ? ' ' + L`오래 해 온 취미(${hobbyName(hm.id)})와 이어지는 전공도 있습니다.` : tm ? ' ' + L`어릴 때부터 남다른 소질을 보인 ${wa(tm.w)} 이어지는 전공도 있습니다.` : '')
        + (aud.length ? ' ' + (aud.length > 1 ? "Ngành âm nhạc và ngành múa tuyển sinh bằng thi năng khiếu." : aud[0] === 'mus' ? "Ngành âm nhạc tuyển sinh bằng thi năng khiếu." : "Ngành múa tuyển sinh bằng thi năng khiếu.") : '');
      return { title: "Bạn sẽ học ngành gì?", body: L`${S.school === 'grad' ? "cao học" : "đại học"}에서 전공을 정할 때입니다. 전공은 첫 직업을 크게 좌우합니다.` + line,
        fact: aud.length && !medIn ? "Các trường âm nhạc và khoa múa phần lớn tuyển sinh bằng thi năng khiếu, chọn từ những học sinh đã học riêng từ nhỏ. Ở Mỹ, trong khoảng 2 triệu bằng cử nhân năm học 2021-22, ngành âm nhạc có 14.420 người, ngành múa chưa đến 3.000 người (NEA 2024)"
          : medIn || line ? "Ngành y là ngành khó vào nhất ở bất kỳ nước nào. Ở Mỹ, mỗi năm trong khoảng 2 triệu người mới tốt nghiệp cử nhân, chỉ hơn 22.000 người vào được trường y (AAMC 2024)" : L`${c.ko} 고등교육 총취학률 ${c.ter}% (UNESCO)`,
        choices: opts.map(k => ({ k, label: majCardN(k), sub: AUD_MAJ[k] ? L`${majCardD(k)} · 실기 시험, 붙을 가능성 ${oddsWord(audP(k))}` : majorCmp(k) ? L`${majCardD(k)} · 경쟁이 세요, 들어갈 가능성 ${oddsWord(majorP(k))}` : majCardD(k) })) };
    },
    apply: k => {
      if (AUD_MAJ[k] && !chance(audP(k))) {
        const fb = pick({ mus: ['art', 'art', 'edu', 'media'], dnc: ['pe', 'pe', 'art', 'edu'] }[k]);
        S.major = fb; eff({ sm: 2, h: -4 });
        return { t: L`${MAJORS[k].n} 전공 실기 시험에서 떨어졌습니다. ${eul(MAJORS[fb].n)} 전공하게 되었습니다.`, k: 'bad' };
      }
      if (AUD_MAJ[k]) { S.major = k; eff({ sm: 2, h: 4 }); const h = audHob(k); if (h) h.lv += 1; return { t: L`실기 시험에 붙어 ${eul(MAJORS[k].n)} 전공하게 되었습니다.`, k: 'big' }; }
      if (majorCmp(k) && !chance(majorP(k))) {
        const fb = pick(MAJOR_ALT.filter(x => x !== k));
        S.major = fb; eff({ sm: 2, h: -3 });
        return { t: L`원하던 ${MAJORS[k].n} 전공은 지원자가 몰려 자리를 얻지 못했습니다. ${eul(MAJORS[fb].n)} 전공하게 되었습니다.`, k: 'bad' };
      }
      S.major = k; eff({ sm: 2 }); return L`${eul(MAJORS[k].n)} 전공하기로 했습니다.`;
    }
  },
  movenear: {
    build: () => {
      const c = C(), h = commuteMin(), hs = minStr(h), m = incomeAt(c, 0.5), own = S.house > 0, cost = own ? m * 0.04 + S.house * 0.11 : m * 0.12;
      S.flags.mvCost = cost;
      return { title: "Chuyển đến gần chỗ làm?", body: own ? L`${S.city || "thành phố"}에서 출퇴근에 하루 ${hs}이 걸립니다. 직장 근처로 옮기려면 지금 집을 팔고 그 동네에서 집을 사야 합니다. 그 동네 집이 조금 더 비싸고 사고파는 비용도 들지만, 매일 그만큼의 시간이 생깁니다.` : L`${S.city || "thành phố"}에서 출퇴근에 하루 ${hs}이 걸립니다. 직장 근처로 옮기면 집세가 더 들지만, 매일 그만큼의 시간이 생깁니다.`, fact: L`1년이면 출퇴근에만 약 ${Math.round(h * 4)}시간, 하루 8시간씩 일하는 날로 치면 ${Math.round(h / 2)}일입니다`,
        choices: [own ? { k: 'move', label: "Bán nhà, mua nhà gần chỗ làm", sub: L`사고파는 비용과 집값 차이 약 ${wonStr(cost)}` } : { k: 'move', label: "Chuyển đến gần chỗ làm", sub: L`이사 비용 약 ${wonStr(cost)} · 매년 주거비 ↑` }, { k: 'stay', label: "Vẫn đi làm từ nhà hiện tại", sub: '' }] };
    },
    apply: k => {
      if (k === 'stay') return false;
      S.money -= S.flags.mvCost; if (S.house) S.house *= 1.05; if (S.flags.hPaid) S.flags.hPaid += S.flags.mvCost;
      if (S.house > 0) { S.flags.near = { job: S.job, city: S.city, w: workKey() }; eff({ h: 6, hl: 3, so: 3 }); S.yearMark = S.yearMark || 'move'; return "Bạn đã bán căn nhà đang ở và chuyển đến một căn nhà gần chỗ làm. Bạn có thêm thời gian buổi tối."; }
      S.flags.near = { job: S.job, city: S.city, w: workKey() }; eff({ h: 6, hl: 3, so: 3 }); S.yearMark = S.yearMark || 'move';
      return "Bạn đã chuyển đến khu gần chỗ làm. Bạn có thêm thời gian buổi tối.";
    }
  },
  kidsick: {
    build: p => {
      const c = C(), k = S.fam.kids[p.i]; if (!k || !k.alive) return null;
      const app = !['ssa', 'sa'].includes(c.p) && !k.appx && chance(0.15);
      const [ill, ck] = app ? ["viêm ruột thừa", 'ocd'] : pick(c.p === 'ssa' ? [["sốt rét", 'mal'], ["viêm phổi nặng", 'lri'], ["tiêu chảy nặng", 'diar']] : c.p === 'sa' ? [["sốt xuất huyết", 'oinf'], ["viêm phổi nặng", 'lri'], ["thương hàn", 'oinf']] : [["viêm phổi nặng", 'lri'], ["sốt cao kéo dài không hạ", 'oinf']]);
      if (app) k.appx = 1;
      const cost = Math.max(incomeAt(c, 0.5) * 0.2 * hospPrice(c) * (HOSP_FREE.has(c.id) ? 0.02 : kidHosp(c) != null ? kidHosp(c) : c.id === 'USA' ? 0.06 : Math.max(0.15, c.oop / 100)) * insK(), usd2ppp(c, 30));
      S.flags.ks = { ill, cost, mal: ck === 'mal' ? 1 : 0, ck };
      return { title: L`${iga(callName(k.name))} 크게 아픕니다`, body: HOSP_FREE.has(c.id) ? L`${S.age - k.bornAt}살 ${callName(k.name)}의 ${ill}.` + ' ' + L`큰 병원의 치료비는 거의 들지 않고, 약값 등 본인 부담은 약 ${wonStr(cost)} (한국 체감)입니다.` + ' ' + L`모아 둔 돈은 ${savedAmt()}입니다.` : L`${S.age - k.bornAt}살 ${callName(k.name)}의 ${ill}. 큰 병원에 가면 본인 부담이 약 ${wonStr(cost)} (한국 체감)입니다. 모아 둔 돈은 ${savedAmt()}.`, fact: "Nhiều ca tử vong ở trẻ dưới 5 tuổi là do những bệnh có thể chữa được như viêm phổi, tiêu chảy và sốt rét (WHO)",
        choices: [{ k: 'hospital', label: S.money >= cost ? "Đến bệnh viện lớn" : "Đến bệnh viện lớn, dù phải vay tiền", sub: L`약 ${wonStr(cost)}` }, { k: 'home', label: "Chăm sóc ở nhà và theo dõi", sub: "Tiết kiệm tiền nhưng nguy hiểm" }] };
    },
    apply: (k, p) => {
      const kid = S.fam.kids[p.i], f = S.flags.ks; if (!kid || !kid.alive) return false;
      if (k === 'hospital') { S.money -= f.cost; eff({ h: -2, so: 2 }); return L`${iga(callName(kid.name))} 치료를 받고 나았습니다. 밤새 곁을 지켰습니다.`; }
      if (chance((lowInc(C()) ? 0.06 : 0.025) * (S.age - kid.bornAt < 5 ? 1 : 0.35))) { kid.alive = false; kid.dA = S.age - kid.bornAt; kid.dC = f.ck || (f.mal ? 'mal' : 'oinf'); kid.dL = f.ill; S.stats.kidsLost++; grieve('kid', callName(kid.name)); eff({ h: -25, so: -6 }); S.yearMark = 'loss'; return { t: L`아이 ${iga(callName(kid.name))} ${f.ill}로 세상을 떠났습니다. 병원에 데려갔더라면 하는 생각이 떠나지 않습니다.`, k: 'loss' }; }
      eff({ h: -3 }); return L`며칠을 앓던 ${iga(callName(kid.name))} 다행히 털고 일어났습니다.`;
    }
  },
  kiduni: {
    build: p => {
      const k = S.fam.kids[p.i]; if (!k || !k.alive) return null;
      if (kidInPr(k)) { if (k.path === 'pending') k.path = 'work'; return null; }
      const c = kidLand(k);
      const dk = c.id === 'KOR' && defUniKid(k), free = UNI_FREE.has(c.id), cost = incomeAt(c, 0.5) * (c.p === 'hi' ? 1.6 : c.p === 'eca' ? 0.8 : 1.0) * (free ? 0.5 : dk ? 0.4 : 1);
      S.flags.ku = cost;
      return { title: L`${iga(callName(k.name))} 대학에 합격했습니다`, body: dk ? L`탈북민 자녀 지원으로 등록금은 거의 들지 않습니다. 4년 동안 생활비로 약 ${wonStr(cost)} (한국 체감)이 듭니다. 모아 둔 돈은 ${savedAmt()}.` : free ? L`등록금은 없지만, 4년 동안 생활비로 약 ${wonStr(cost)} (한국 체감)이 듭니다. 모아 둔 돈은 ${savedAmt()}.` : L`4년 동안 등록금과 생활비로 약 ${wonStr(cost)} (한국 체감)이 듭니다. 모아 둔 돈은 ${savedAmt()}.`,
        fact: dk ? "Người rời Triều Tiên sang Hàn Quốc được miễn học phí ở các trường đại học quốc lập; ở trường tư, Quỹ Hana Hàn Quốc trả một nửa và trường thường giảm nốt phần còn lại. Từ năm 2025, con cái sinh ra ở Trung Quốc hay nơi khác rồi cùng sang cũng được hỗ trợ (Bộ Thống nhất Hàn Quốc)" : free ? L`${c.ko}의 국공립 대학은 자국 학생에게 등록금을 받지 않거나 아주 적게 받습니다 (OECD Education at a Glance 2024)` : L`${c.ko}의 대학 진학률(총 등록률) ${c.ter}% (UNESCO)`,
        choices: [{ k: 'pay', label: "Chi trả toàn bộ", sub: L`약 ${wonStr(cost)}` }, { k: 'half', label: "Tự trả một nửa, nửa còn lại vay vốn sinh viên", sub: L`약 ${wonStr(cost / 2)}` }, { k: 'self', label: "Để con tự lo bằng học bổng và việc làm thêm", sub: "Không tốn tiền, nhưng con vất vả" }] };
    },
    apply: (k, p) => {
      const kid = S.fam.kids[p.i], cost = S.flags.ku; if (!kid || !kid.alive) return false;
      kid.path = 'uni'; kidUniWed(kid); S.yearMark = S.yearMark || 'edu';
      if (k === 'pay') { S.money -= cost; eff({ h: 6, so: 4 }); kid.bd = (kid.bd || 0) + 4; kid.give = 1; return L`${callName(kid.name)}의 등록금을 내주었습니다. 입학식 날 오래 손을 흔들었습니다.`; }
      if (k === 'half') { S.money -= cost / 2; eff({ h: 4, so: 3 }); kid.bd = (kid.bd || 0) + 2; return L`${wa(callName(kid.name))} 등록금을 반씩 나눠 내기로 했습니다.`; }
      if (chance(0.25)) { kid.path = 'work'; eff({ h: -6, so: -2 }); return { t: L`${eun(callName(kid.name))} 학비를 감당하지 못해 한 학기 만에 학교를 그만두었습니다.`, k: 'bad' }; }
      eff({ h: 2 }); return L`${eun(callName(kid.name))} 아르바이트를 하며 스스로 학비를 벌었습니다.`;
    }
  },
  pbiz: {
    ok: () => { const P = S.fam.partner; return S.fam.married && P && P.alive && !P.ret && !(P.out > 0) && !nkLife(); },
    build: () => { const P = S.fam.partner, cost = incomeAt(C(), 0.5) * 1.0; S.flags.pbizCost = cost;
      return { title: "Bạn đời muốn mở cửa hàng", body: L`배우자 ${iga(callName(P.name))} 오래 꿈꾸던 자기 가게를 열고 싶다고 합니다. 모아 둔 돈에서 약 ${wonStr(cost)} (한국 체감)이 듭니다.`,
        fact: "Khoảng một nửa số cơ sở kinh doanh nhỏ mới mở đóng cửa trong vòng 5 năm (Cục Thống kê Lao động Mỹ)",
        choices: [{ k: 'go', label: "Đồng ý cùng nhau làm", sub: "Thành công thì thu nhập↑ · thất bại thì mắc nợ" }, { k: 'no', label: "Can ngăn, bảo bây giờ chưa phải lúc", sub: "Quan hệ↓" }] }; },
    apply: k => {
      const P = S.fam.partner, who = callName(P.name), cost = S.flags.pbizCost;
      if (k === 'no') { eff({ so: -3 }); return L`배우자 ${iga(who)} 아쉬워했지만 다음을 기약했습니다.`; }
      S.money -= cost; const r = rnd();
      if (r < 0.55) P.job = 'owner';
      if (r < 0.15) { P.dev = clamp((P.dev || 0) + 0.12, -0.15, 0.25); S.money += cost * 1.4; eff({ h: 8, so: 4 }); S.yearMark = 'job'; return { t: L`배우자의 가게가 크게 자리를 잡았습니다. 집안 형편이 눈에 띄게 나아졌습니다. (+${wonStr(cost * 0.4)})`, k: 'big' }; }
      if (r < 0.55) { P.dev = clamp((P.dev || 0) + 0.03, -0.15, 0.25); S.money += cost * 0.8; eff({ h: 3, so: 3 }); return "Cửa hàng của bạn đời làm ăn tàm tạm. Bạn biết ơn quãng thời gian hai người cùng nhau gắng gượng."; }
      P.out = 1; P.mvOut = 0; eff({ h: -8, so: -2 }); return { t: L`배우자의 가게는 2년을 버티지 못하고 문을 닫았습니다. (−${wonStr(cost)})`, k: 'bad' };
    }
  },
  pstock: {
    ok: () => S.fam.married && S.fam.partner && S.fam.partner.alive && S.money > 0,
    build: () => { const P = S.fam.partner, x = S.money * 0.5; S.flags.pstockX = x;
      return { title: "Bạn đời muốn dồn nhiều tiền vào cổ phiếu", body: L`배우자 ${iga(callName(P.name))} 아는 사람에게 확실한 종목이라는 이야기를 들었다며, 모아 둔 돈의 절반인 ${wonStr(x)}을 넣자고 합니다.`,
        fact: "Nhà đầu tư cá nhân mua bán cổ phiếu thường xuyên thường có lợi nhuận thấp hơn mức trung bình của thị trường (Barber & Odean 2000)",
        choices: [{ k: 'go', label: "Tin tưởng và thử đầu tư", sub: "Thắng lớn hoặc mất lớn" }, { k: 'no', label: "Can ngăn vì quá rủi ro", sub: "Quan hệ hơi↓" }] }; },
    apply: k => {
      const x = S.flags.pstockX; if (k === 'no') { eff({ so: -1 }); return "Sau một trận cãi vã, chuyện cổ phiếu bị gác lại."; }
      const r = rnd();
      if (r < 0.45) { const l = x * (0.3 + rnd() * 0.4); S.money -= l; eff({ h: -8, so: -4 }); return { t: L`주가가 곤두박질쳤습니다. 넣은 돈의 상당 부분을 잃었습니다. (−${wonStr(l)})`, k: 'bad' }; }
      if (r < 0.75) { eff({ h: -1 }); return "Giá cổ phiếu lên xuống thất thường rồi lại về chỗ cũ. Chỉ tổ lo lắng."; }
      const g = x * (0.15 + rnd() * 0.35); S.money += g; eff({ h: 5, so: 2 }); return { t: L`주가가 올라 꽤 벌었습니다. (+${wonStr(g)})`, k: 'big' };
    }
  },
  ipv: {
    ok: () => { const P = S.fam.partner; return S.fam.married && P && P.alive; },
    build: () => { const P = S.fam.partner, again = S.flags.ipv === 'on';
      return { title: again ? "Bạo lực chưa chấm dứt" : "Bạo lực trong nhà", body: again ? L`배우자 ${iga(callName(P.name))} 휘두르는 폭력이 계속되고 있습니다. 혼자 견디지 않아도 됩니다.` : L`배우자 ${iga(callName(P.name))} 화를 참지 못하고 처음으로 손을 올렸습니다. 사과했지만, 마음 깊이 무서워졌습니다.`,
        fact: IPV_FACT(),
        choices: [{ k: 'help', label: "Tìm sự giúp đỡ", sub: "Đường dây tư vấn · gia đình · nhà tạm lánh" }, { k: 'leave', label: "Rời khỏi nhà", sub: "An toàn là trên hết" }, { k: 'divorce', label: "Đề nghị ly hôn", sub: ['sa', 'mena'].includes(C().p) ? "Qua tòa án · gia đình có thể phản đối gay gắt" : "Qua tòa án · có cơ quan tư vấn hỗ trợ" }, { k: 'stay', label: "Tạm thời nhẫn nhịn", sub: "Có thể lặp lại" }].filter(ch => ch.k !== 'divorce' || legalWed()) }; },
    apply: k => {
      const P = S.fam.partner, who = callName(P.name);
      if (k === 'stay') { S.flags.ipv = 'on'; eff({ h: -8, hl: -2 }); return { t: "Bạn quyết định chịu đựng mà không nói với ai. Trong lòng lúc nào cũng nặng trĩu.", k: 'bad', f: IPV_HELP() }; }
      const c = C(), trad = ['sa', 'mena'].includes(c.p), loose = ['hi', 'eca', 'lac'].includes(c.p);
      if (k === 'divorce') {
        if (!chance(c.p === 'sa' ? 0.4 : trad ? 0.5 : loose ? 0.9 : 0.75)) { S.flags.ipv = 'on'; eff({ h: -5, so: -3 }); return { t: trad ? (S.age < 60 && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) ? "Bạn đã nộp đơn ly hôn lên tòa, nhưng vấp phải sự phản đối của người lớn hai bên gia đình nên cuối cùng lại quay về nhà. Bạo lực không dễ gì chấm dứt." : S.fam.kids.some(k => k.alive && S.age - k.bornAt >= 18) ? "Bạn đã nộp đơn ly hôn lên tòa, nhưng con cái và họ hàng can ngăn nên cuối cùng lại quay về nhà. Bạo lực không dễ gì chấm dứt." : "Bạn đã nộp đơn ly hôn lên tòa, nhưng vấp phải sự phản đối của họ hàng nên cuối cùng lại quay về nhà. Bạo lực không dễ gì chấm dứt.") : "Bạn đã đề nghị ly hôn, nhưng bạn đời từ chối nên vụ kiện kéo dài. Bạo lực vẫn chưa chấm dứt.", k: 'bad', f: IPV_HELP() }; }
        S.flags.ipv = 'over';
        const t = divorceNow(c, false, 'viol');
        eff({ h: 4, hl: 2, so: trad ? -4 : 0 }); homemakerAlone(false);
        return { t: (trad ? "Bất chấp sự phản đối của những người xung quanh, bạn đã nộp đơn ly hôn lên tòa." : "Được cơ quan tư vấn giúp đỡ, bạn đã nộp đơn ly hôn lên tòa.") + ' ' + t, k: 'big', f: IPV_HELP() };
      }
      if (k === 'help' && chance(trad ? 0.45 : 0.35)) { S.flags.ipv = 'over'; eff({ h: 2, so: 3 }); return { t: trad ? L`가족과 마을 어른들에게 도움을 청했습니다. 배우자 ${iga(who)} 다시는 손을 올리지 않겠다고 약속했고, 폭력은 멈췄습니다.` : L`상담 전화로 도움을 청했습니다. 배우자 ${iga(who)} 상담과 치료를 받기 시작했고, 폭력은 멈췄습니다.`, k: 'big', f: IPV_HELP() }; }
      if (!chance(k === 'help' ? (c.p === 'sa' ? 0.02 : trad ? 0.15 : loose ? 0.65 : 0.45) : (c.p === 'sa' ? 0.04 : trad ? 0.3 : loose ? 0.85 : 0.6))) {
        S.flags.ipv = 'on'; eff({ h: -4 });
        return { t: k === 'help' ? "Bạn đã tìm sự giúp đỡ, nhưng không có nhiều thay đổi. Dù vậy, giờ bạn biết mình không đơn độc." : S.sex === 'F' ? "Bạn về nhà bố mẹ đẻ lánh tạm nhưng cuối cùng lại quay về. Bạo lực không dễ gì chấm dứt." : "Bạn đến lánh nhờ gia đình nhưng cuối cùng lại quay về. Bạo lực không dễ gì chấm dứt.", k: 'bad', f: IPV_HELP() };
      }
      S.flags.ipv = 'over';
      const t = divorceNow(C(), false, 'viol');
      eff({ h: k === 'help' ? 4 : 2, hl: 2 }); homemakerAlone(false);
      return { t: (k === 'help' ? "Nhờ cơ quan tư vấn và gia đình giúp đỡ, bạn đã chuyển đến một nơi an toàn." : "Bạn thu dọn đồ đạc và rời khỏi nhà. Bạn sợ hãi, nhưng đã có thể thở nhẹ nhõm trở lại.") + ' ' + t, k: 'big', f: IPV_HELP() };
    }
  },
  kidq: {
    ok: p => { const k = S.fam.kids[p.i]; return !!k && k.alive && !k.grown && !k.away; },
    build: p => {
      const k = S.fam.kids[p.i], ka = S.age - k.bornAt, n = callName(k.name), what = S.flags.kqWhat = kidqWhat(k) || 'study', mom = meSex() === 'F';
      if (what === 'dream') {
        const D = KID_DREAM(), ids = Object.keys(D).filter(j => JOBS[j] && (j !== 'creator' || (calYr() >= 2008 && netDream() > 0)) && (j !== 'dev' || calYr() >= 1985)), dj = S.flags.kqJob = pick(ids);
        return { title: L`${n}의 꿈`, body: L`${ka}살 ${iga(n)} 눈을 반짝이며 물었습니다. "${mom ? "mẹ" : "bố"}, 나 커서 ${D[dj]} 될 수 있을까?"`,
          fact: "Kỳ vọng và sự động viên của bố mẹ ảnh hưởng lâu dài đến việc học và con đường nghề nghiệp của con (Davis-Kean 2005)",
          choices: [{ k: 'yes', label: "Được chứ, con muốn làm gì thì cứ thử", sub: '' }, { k: 'look', label: "Mình cùng tìm hiểu xem làm thế nào để làm được nghề ấy nhé", sub: '' }, { k: 'real', label: "Con thử nghĩ đến một công việc ổn định hơn xem", sub: '' }] };
      }
      if (what === 'gone') {
        const gp = [S.fam.mom, S.fam.dad].find(q => q && !q.alive && !q.absent && q.diedAt != null && S.age - q.diedAt <= 2), gw = gp === S.fam.mom ? "bà" : "ông", r = S.rel;
        return { title: L`${n}의 물음`, body: L`${ka}살 ${iga(n)} 물었습니다. "${eun(gw)} 이제 어디에 계셔?"`,
          fact: "Trẻ em thường bắt đầu hiểu rằng cái chết không thể đảo ngược vào khoảng năm, sáu tuổi (Speece & Brent 1984)",
          choices: [r && r !== 'N' ? { k: 'faith', label: r === 'B' || r === 'H' || r === 'S' ? "Rồi sẽ được sinh ra lần nữa ở một nơi tốt đẹp" : r === 'F' ? "Đã về bên tổ tiên rồi" : "Đang dõi theo chúng ta từ trên trời", sub: '' } : null,
            { k: 'heart', label: "Vẫn luôn ở trong tim chúng ta", sub: '' }, { k: 'true', label: "Ai rồi cũng sẽ ra đi. Vì thế, lúc được ở bên nhau thế này mới quý", sub: '' }].filter(Boolean) };
      }
      if (what === 'money') return { title: L`${n}의 물음`, body: L`${ka}살 ${iga(n)} 물었습니다. "${mom ? "mẹ" : "bố"}, 돈이 많으면 행복해?"`,
        fact: "Trẻ lớn lên khi thấy bố mẹ biết sẻ chia thì khi trưởng thành cũng sẻ chia nhiều hơn (Wilhelm và cộng sự 2008)",
        choices: [{ k: 'people', label: "Những người ở bên mình quý hơn tiền bạc", sub: '' }, { k: 'work', label: "Có tiền thì làm được nhiều điều hơn. Vì thế bố mẹ mới làm việc chăm chỉ", sub: '' },
          { k: 'unsure', label: mom ? "Mẹ cũng chưa biết rõ nữa. Mình cùng nghĩ xem nhé" : "Bố cũng chưa biết rõ nữa. Mình cùng nghĩ xem nhé", sub: '' }] };
      return { title: L`${n}의 물음`, body: L`${ka}살 ${iga(n)} 문제집을 덮으며 물었습니다. "${mom ? "mẹ" : "bố"}, 공부는 왜 해야 해?"`,
        fact: "Kỳ vọng và sự động viên của bố mẹ ảnh hưởng lâu dài đến việc học và con đường nghề nghiệp của con (Davis-Kean 2005)",
        choices: [{ k: 'wide', label: "Để sau này con có thể chọn điều mình muốn làm", sub: '' }, { k: 'job', label: "Để vào được đại học tốt và có việc làm tốt", sub: '' }, { k: 'free', label: "Học không phải là con đường duy nhất. Mình cùng tìm điều con thích nhé", sub: '' }] };
    },
    apply: (k, p) => {
      const kid = S.fam.kids[p.i], n = callName(kid.name), what = S.flags.kqWhat; kid.kqd = 1;
      const bd = x => { kid.bd = (kid.bd || 0) + x; };
      if (what === 'dream') { kid.dj = S.flags.kqJob; kid.djK = k;
        if (k === 'real') { bd(-2); return L`${iga(n)} 고개를 끄덕였지만, 조금 시무룩해 보였습니다.`; }
        bd(k === 'look' ? 4 : 3); eff({ so: 1, h: 1 });
        return k === 'look' ? L`${wa(n)} 함께 그 일에 대해 찾아보았습니다. ${n}의 눈이 반짝였습니다.` : L`${iga(n)} 그날 저녁 내내 커서 할 일을 신나게 이야기했습니다.`; }
      if (what === 'gone') { bd(k === 'true' ? 4 : 3); eff({ so: 1, h: 1 });
        return { t: k === 'heart' ? L`${iga(n)} 가슴에 가만히 손을 얹어 보았습니다.` : k === 'true' ? L`${iga(n)} 내 손을 꼭 잡고 한참 놓지 않았습니다.` : L`${iga(n)} 내 품에 기대어 한참 말이 없었습니다.`, k: 'warm' }; }
      if (what === 'money') { if (k === 'people') { kid.give = 1; bd(2); return { t: L`${iga(n)} 내 손을 꼭 잡았습니다.`, k: 'warm' }; }
        if (k === 'work') { kid.drive = 1; return L`${iga(n)} 고개를 끄덕이며 저금통을 흔들어 보았습니다.`; }
        bd(4); eff({ so: 1 }); return { t: L`${wa(n)} 한참 동안 행복이 무엇인지 이야기를 나눴습니다.`, k: 'warm' }; }
      kid.kq = k; bd(k === 'free' ? 3 : k === 'wide' ? 2 : -1);
      return k === 'wide' ? L`${iga(n)} 잠시 생각하더니 다시 문제집을 폈습니다.` : k === 'job' ? L`${iga(n)} 작게 한숨을 쉬고 다시 책상 앞에 앉았습니다.` : L`${iga(n)} 놀란 얼굴로 나를 보더니 씩 웃었습니다.`;
    }
  },
  kidwant: {
    ok: p => { const k = S.fam.kids[p.i]; return k && k.alive && !k.grown; },
    build: p => { const k = S.fam.kids[p.i], ka = S.age - k.bornAt, n = callName(k.name), cost = incomeAt(C(), 0.5) * 0.05; S.flags.kwCost = cost;
      const what = ka >= 11 && C().net >= 50 && smartOK(C()) && !k.phone ? 'phone' : chance(0.5) ? 'club' : 'music'; S.flags.kwWhat = what;
      return { title: L`${iga(n)} 조르는 것이 있습니다`, body: what === 'phone' ? L`${ka}살 ${iga(n)} 반 친구들은 다 있다며 스마트폰을 사 달라고 합니다. 약 ${wonStr(cost)} (한국 체감).` : what === 'club' ? L`${ka}살 ${iga(n)} 친구들과 같은 운동 클럽에 다니고 싶다고 합니다. 한 해 약 ${wonStr(cost)} (한국 체감).` : L`${ka}살 ${iga(n)} 악기를 배우고 싶다고 합니다. 한 해 약 ${wonStr(cost)} (한국 체감).`,
        choices: [{ k: 'yes', label: "Đồng ý", sub: "Quan hệ↑" }, { k: 'no', label: "Giải thích hoàn cảnh và hẹn để sau", sub: '' }] }; },
    apply: (k, p) => {
      const kid = S.fam.kids[p.i], n = callName(kid.name), what = S.flags.kwWhat;
      if (k === 'no') { eff({ so: -1 }); return L`${iga(n)} 잠깐 서운해했지만 금세 웃었습니다.`; }
      S.money -= S.flags.kwCost; if (what === 'phone') kid.phone = 1; kid.bd = (kid.bd || 0) + 2; eff({ so: 3, h: 2 });
      return what === 'phone' ? L`${n}에게 첫 스마트폰을 사 주었습니다. 하루 종일 손에서 놓지 않았습니다. (−${wonStr(S.flags.kwCost)})` : what === 'club' ? L`${iga(n)} 운동 클럽에 다니기 시작했습니다. 주말마다 경기를 보러 갔습니다. (−${wonStr(S.flags.kwCost)})` : L`${iga(n)} 악기를 배우기 시작했습니다. 서툰 연주도 듣기 좋았습니다. (−${wonStr(S.flags.kwCost)})`;
    }
  },
  kidcm: {
    ok: p => { const k = S.fam.kids[p.i]; return !!k && k.alive && !k.cmAsk; },
    build: p => { const c = C(), k = S.fam.kids[p.i], n = callName(k.name), ka = S.age - k.bornAt;
      return { title: L`${n}의 혼처 이야기`, body: L`집안 어른들이 ${iga(n)} 벌써 ${ka}살이니 혼처를 알아보자고 합니다. 이웃의 또래 딸들도 하나둘 시집을 갔습니다.`,
        fact: L`${c.ko}에서는 여성의 약 ${c.cm}%가 18세가 되기 전에 결혼합니다. 학교에 계속 다니는 것이 이른 결혼을 막는 가장 큰 힘입니다 (UNICEF)`,
        choices: [{ k: 'school', label: "Xin đợi đến khi con học xong", sub: "Có thể va chạm với người lớn trong nhà" }, { k: 'later', label: "Gác lại, đợi con trưởng thành rồi tính", sub: '' }] }; },
    apply: (k, p) => {
      const kid = S.fam.kids[p.i], n = callName(kid.name); kid.cmAsk = 1;
      if (k === 'school') { kid.bd = (kid.bd || 0) + 3; kid.cmS = 1; if (kid.wa) kid.wa = Math.max(kid.wa, 20 + ri(0, 3)); eff({ so: -3, h: 1 }); return L`${eul(n)} 학교에 계속 보내겠다고 했습니다. 어른들의 서운한 기색은 한동안 가시지 않았습니다.`; }
      eff({ so: -1 }); return L`${iga(n)} 어른이 된 뒤에 이야기하자고 했습니다.`;
    }
  },
  discipline: {
    ok: p => { const k = S.fam.kids[p.i]; return !!k && k.alive && !k.grown && !k.away; },
    build: p => { const c = C(), k = S.fam.kids[p.i], n = callName(k.name), ban = cpBan(c), was = !!S.flags.phit && (S.flags.hitN || 0) > 0;
      const little = S.age - k.bornAt <= 6;
      return { title: "Đứa trẻ không chịu nghe lời", body: (little ? L`${S.age - k.bornAt}살 ${iga(n)} 몇 번을 말해도 듣지 않고 떼를 씁니다. 오늘따라 지치고 화가 납니다.` : L`${S.age - k.bornAt}살 ${iga(n)} 몇 번을 말해도 말대꾸를 하며 고집을 부립니다. 오늘따라 지치고 화가 납니다.`) + (was ? ' ' + "Bỗng dưng bạn nhớ lại những lần bị đánh đòn hồi nhỏ." : ''),
        fact: HIT_FACT(),
        choices: [{ k: 'talk', label: "Ngồi xuống cùng con, bình tĩnh khuyên bảo và cùng đặt ra quy ước", sub: "Cần thời gian" }, { k: 'calm', label: "Tạm tách ra một lúc để cả hai bình tĩnh lại", sub: '' },
          { k: 'hit', label: "Đánh đòn con", sub: ban ? "Bị pháp luật cấm · con có thể xa cách bạn" : "Con có thể xa cách bạn" }] }; },
    apply: (k, p) => {
      const kid = S.fam.kids[p.i], n = callName(kid.name), was = !!S.flags.phit && (S.flags.hitN || 0) > 0, little = S.age - kid.bornAt <= 6;
      if (k === 'hit') { kid.bd = (kid.bd || 0) - 6; kid.hit = 1; eff({ so: -2, h: -3 });
        return { t: was ? L`나도 모르게 내가 자란 방식대로 손이 올라갔습니다. ${iga(n)} 한동안 내 눈을 피했습니다.` : little ? L`매를 들었습니다. ${iga(n)} 울음을 그쳤지만, 한동안 내 눈을 피했습니다.` : L`매를 들었습니다. ${iga(n)} 아무 말도 하지 않았지만, 한동안 내 눈을 피했습니다.`, k: 'bad' }; }
      if (k === 'calm') { kid.bd = (kid.bd || 0) + 2; eff({ h: 1 });
        if (!little) return L`잠시 밖에 나가 숨을 골랐습니다. 돌아와 보니 ${n}도 한결 누그러져 있었습니다.`;
        return S.urban ? L`잠시 베란다에 나가 숨을 골랐습니다. 돌아와 보니 ${n}도 울음을 그쳐 있었습니다.` : L`잠시 마당에 나가 숨을 골랐습니다. 돌아와 보니 ${n}도 울음을 그쳐 있었습니다.`; }
      if (chance(clamp(0.6 + (S.st.so - 50) / 300, 0.5, 0.85))) { kid.bd = (kid.bd || 0) + 4; eff({ so: 2, h: 1 });
        return was ? { t: L`나는 내가 자란 방식과 다르게 키우기로 했습니다. ${wa(n)} 손가락을 걸고 약속을 하나 정했습니다.`, k: 'warm' } : L`${wa(n)} 마주 앉아 이야기했습니다. 서툴러도 약속을 하나 정했습니다.`; }
      kid.bd = (kid.bd || 0) + 1; return little ? L`타일렀지만 ${iga(n)} 한동안 또 떼를 썼습니다. 그래도 날마다 조금씩 나아졌습니다.` : L`타일렀지만 ${iga(n)} 한동안 또 고집을 부렸습니다. 그래도 날마다 조금씩 나아졌습니다.`;
    }
  },
  kidteen: {
    ok: p => { const k = S.fam.kids[p.i]; return k && k.alive && !k.grown; },
    build: p => { const k = S.fam.kids[p.i], n = callName(k.name), why = chance(0.5) ? 'fight' : 'skip'; S.flags.ktWhy = why;
      return { title: "Nhà trường gọi điện", body: why === 'fight' ? L`${iga(n)} 학교에서 친구와 크게 싸웠다고 합니다.` : L`${iga(n)} 며칠째 학교에 가지 않았다고 합니다.`,
        choices: [{ k: 'talk', label: "Ngồi xuống lắng nghe con", sub: "Cần thời gian" }, { k: 'strict', label: "Nghiêm khắc trách mắng", sub: '' }] }; },
    apply: (k, p) => {
      const n = callName(S.fam.kids[p.i].name);
      const kid = S.fam.kids[p.i];
      if (k === 'talk') { if (chance(clamp(0.55 + S.st.so / 250, 0.55, 0.95))) { kid.bd = (kid.bd || 0) + 6; eff({ so: 3, h: 1 }); return L`밤늦도록 ${n}의 이야기를 들었습니다. 그동안 혼자 끙끙 앓던 일이 있었습니다. 조금씩 나아졌습니다.`; } eff({ so: 1, h: -2 }); return L`이야기를 들어 주려 했지만 ${iga(n)} 좀처럼 마음을 열지 않았습니다.`; }
      if (chance(0.5)) { kid.bd = (kid.bd || 0) - 4; eff({ so: -1 }); return L`크게 혼냈습니다. ${iga(n)} 다시 그러지는 않았지만, 한동안 말이 없었습니다.`; }
      kid.bd = (kid.bd || 0) - 10; eff({ so: -4, h: -3 }); return { t: L`크게 혼냈더니 ${wa(n)} 사이가 더 멀어졌습니다.`, k: 'bad' };
    }
  },
  kidabroad: {
    ok: p => { const k = S.fam.kids[p.i]; return k && k.alive; },
    build: p => { const k = S.fam.kids[p.i], n = callName(k.name), d = CBY[(C().mig || 'USA').split(',')[0]] || CBY.USA, cost = incomeAt(C(), 0.5) * 0.4; S.flags.kaCost = cost; S.flags.kaTo = d.id;
      return { title: L`${iga(n)} 외국으로 가고 싶어 합니다`, body: L`${iga(n)} ${d.ko}에서 공부하고 일해 보고 싶다고 합니다. 떠날 준비에 약 ${wonStr(cost)} (한국 체감)이 듭니다.`,
        fact: "Năm 2024, khoảng 304 triệu người sống ngoài đất nước nơi mình sinh ra, chiếm 3,7% dân số thế giới (UN DESA)",
        choices: [{ k: 'go', label: "Động viên và để con đi", sub: "Tiền↓ · sống xa nhau" }, { k: 'stay', label: "Mong con ở gần", sub: "Quan hệ↓" }] }; },
    apply: (k, p) => {
      const kid = S.fam.kids[p.i], n = callName(kid.name), d = CBY[S.flags.kaTo];
      if (k === 'stay') { eff({ so: -3 }); return L`${iga(n)} 남기로 했습니다. 서운한 마음이 오래 남은 것 같았습니다.`; }
      S.money -= S.flags.kaCost; kid.abroad = d.id; kid.grown = true; kid.withMe = 0; kid.stay = 0; kid.near = 0; kid.city = null; eff({ h: -2, so: 2 });
      return L`공항에서 ${eul(n)} 꼭 안아 주었습니다. ${iga(n)} ${ro(d.ko)} 떠났습니다. (−${wonStr(S.flags.kaCost)})`;
    }
  },
  kidout: {
    ok: p => { const k = S.fam.kids[p.i]; return !!k && k.alive && !k.oTold && !nkCut(k); },
    build: p => {
      const k = S.fam.kids[p.i], n = callName(k.name), home = homeOthers().kids.includes(k);
      const how = k.abroad ? L`외국에 사는 ${iga(n)} 오랜만에 전화를 걸어 왔습니다. 한참 망설이더니,` : home ? L`저녁을 먹고 나서 ${iga(n)} 할 말이 있다며 마주 앉았습니다. 한참 망설이더니,` : L`오랜만에 집에 들른 ${iga(n)} 할 말이 있다며 마주 앉았습니다. 한참 망설이더니,`;
      return { title: L`${iga(n)} 털어놓은 이야기`, body: k.sex === 'F' ? L`${how} 사랑하는 사람이 같은 여자라고 털어놓았습니다. 오래 혼자 고민했다고 했습니다.` : L`${how} 사랑하는 사람이 같은 남자라고 털어놓았습니다. 오래 혼자 고민했다고 했습니다.`,
        fact: "Những người trẻ thuộc cộng đồng LGBT được gia đình chấp nhận có lòng tự trọng và sức khỏe tốt hơn những người không được gia đình chấp nhận (Ryan et al. 2010, Family Acceptance Project)",
        choices: [{ k: 'hug', label: "Lặng lẽ ôm con", sub: "Cảm ơn con đã nói ra" }, { k: 'listen', label: "Lắng nghe con đến tận khuya", sub: "Hỏi con bấy lâu nay cảm thấy thế nào" }, { k: 'time', label: "Thành thật nói mình bất ngờ và hứa sẽ dần thấu hiểu", sub: "Sẽ cần một chút thời gian" }, { k: 'hard', label: "Nói rằng lúc này mình khó chấp nhận", sub: "Có thể khiến bạn và con xa cách" }] };
    },
    apply: (c0, p) => {
      const k = S.fam.kids[p.i]; if (!k || !k.alive) return false; k.oTold = S.age; const n = callName(k.name);
      if (c0 === 'hug') { k.bd = (k.bd || 0) + 6; eff({ h: 2, so: 2 }); return { t: L`${eul(n)} 꼭 안아 주었습니다. 말해 줘서 고맙다고, 너는 언제나 내 아이라고 했습니다.`, k: 'warm' }; }
      if (c0 === 'listen') { k.bd = (k.bd || 0) + 5; eff({ h: 1, so: 2 }); return { t: L`밤늦도록 ${n}의 이야기를 들었습니다. 그동안 혼자 얼마나 마음을 졸였을지 생각하니 가슴이 아팠습니다.`, k: 'warm' }; }
      if (c0 === 'hard') {
        k.bd = (k.bd || 0) - 6; k.oHard = S.age; k.oMend = kidMendAt(); eff({ h: -3, so: -2 });
        return { t: "Bạn nói rằng lúc này mình khó chấp nhận." + ' ' + (k.abroad ? L`${iga(n)} 한참 말이 없다가 전화를 끊었고, 그 뒤로 연락이 뜸해졌습니다.` : L`${iga(n)} 말없이 자리에서 일어났고, 그 뒤로 연락이 뜸해졌습니다.`), k: 'bad' };
      }
      k.bd = (k.bd || 0) + 1; k.oWarm = S.age + ri(2, 4);
      return L`솔직히 놀랐다고 말했습니다. 그래도 ${eul(n)} 이해해 가겠다고 약속했습니다.`;
    }
  },
  kidwed: {
    build: p => {
      const k = S.fam.kids[p.i]; if (!k || !k.alive || kidInPr(k)) { if (k && k.alive) k.wq = 0; return null; }
      const c = kidLand(k);
      const big = ['sa', 'mena'].includes(c.p) || ['CHN', 'KOR', 'VNM', 'NGA'].includes(c.id);
      const cost = incomeAt(c, 0.5) * (big ? 1.0 : 0.3);
      S.flags.kw = cost;
      const far = kidFar(k), there = far && CBY[k.abroad] ? CBY[k.abroad].ko : '';
      const ss = kidSS(k), a = S.age - k.bornAt, n = callName(k.name), sF = k.sex === 'F', law = ss && ssLegal(c, calYr()) === 'm' ? ssFact(c) + ' · ' : '';
      const bigT = big ? " Ở nước này, bố mẹ thường góp một phần lớn chi phí đám cưới." : '';
      if (k.cuT && !ss) return { title: L`${iga(n)} 결혼합니다`, body: (there ? L`${there}에 사는 ${a}살 ${iga(n)} 함께 살아온 사람과 결혼한다는 소식을 전해 왔습니다.` + (longTripHard() ? ' ' + "Sức khỏe của bạn không còn như trước để đi một chặng đường xa như thế." : '') : L`${a}살 ${iga(n)} 함께 살아온 사람과 결혼식을 올리기로 했습니다.`) + bigT,
        fact: L`결혼식에 약 ${wonStr(cost)} (한국 체감)이 듭니다. 모아 둔 돈은 ${savedAmt()}.`,
        choices: [{ k: 'help', label: "Góp nhiều vào chi phí đám cưới", sub: L`약 ${wonStr(cost)}` }, { k: 'little', label: "Góp một ít, tùy khả năng", sub: L`약 ${wonStr(cost * 0.25)}` }, { k: 'none', label: "Chỉ gửi lời chúc phúc", sub: '' }] };
      return { title: L`${iga(n)} 결혼합니다`, body: there ? (ss ? (sF ? L`${there}에 사는 ${a}살 ${iga(n)} 평생을 함께할 여자를 만나 결혼한다는 소식을 전해 왔습니다.` : L`${there}에 사는 ${a}살 ${iga(n)} 평생을 함께할 남자를 만나 결혼한다는 소식을 전해 왔습니다.`)
          : L`${there}에 사는 ${S.age - k.bornAt}살 ${iga(callName(k.name))} 평생을 함께할 사람을 만나 결혼한다는 소식을 전해 왔습니다.`) + (longTripHard() ? ' ' + "Sức khỏe của bạn không còn như trước để đi một chặng đường xa như thế." : '') + (big ? " Ở nước này, bố mẹ thường góp một phần lớn chi phí đám cưới." : '')
        : ss ? (sF ? L`${a}살 ${iga(n)} 평생을 함께할 여자를 데려왔습니다.${big ? " Ở nước này, bố mẹ thường góp một phần lớn chi phí đám cưới." : ''}` : L`${a}살 ${iga(n)} 평생을 함께할 남자를 데려왔습니다.${big ? " Ở nước này, bố mẹ thường góp một phần lớn chi phí đám cưới." : ''}`)
        : L`${S.age - k.bornAt}살 ${iga(callName(k.name))} 평생을 함께할 사람을 데려왔습니다.${big ? " Ở nước này, bố mẹ thường góp một phần lớn chi phí đám cưới." : ''}`, fact: law + L`결혼식과 새 살림에 약 ${wonStr(cost)} (한국 체감)이 듭니다. 모아 둔 돈은 ${savedAmt()}.`,
        choices: [{ k: 'help', label: "Góp nhiều vào chi phí đám cưới", sub: L`약 ${wonStr(cost)}` }, { k: 'little', label: "Góp một ít, tùy khả năng", sub: L`약 ${wonStr(cost * 0.25)}` }, { k: 'none', label: "Chỉ gửi lời chúc phúc", sub: '' }] };
    },
    apply: (k, p) => {
      const kid = S.fam.kids[p.i], cost = S.flags.kw; if (!kid || !kid.alive) return false;
      kid.wed = S.age; S.yearMark = S.yearMark || 'love';
      const there = kidFar(kid) && CBY[kid.abroad] ? CBY[kid.abroad].ko : '', n = callName(kid.name);
      if (there) {
        if (k === 'help') { S.money -= cost; eff({ h: 8, so: 6 }); return !longTripHard() && tripOutOK() ? L`${ro(there)} 날아가 ${n}의 결혼식에서 하객들에게 인사했습니다.`
          : calYr() >= 2010 ? L`먼 길을 나설 수 없어 ${n}의 결혼식을 영상 통화로 지켜보았습니다. 비행기 값까지 얹어 결혼 비용을 넉넉히 보냈습니다.` : L`먼 길을 나설 수 없어 전화로 ${n}의 결혼을 축하했습니다. 비행기 값까지 얹어 결혼 비용을 넉넉히 보냈습니다.`; }
        if (k === 'little') { S.money -= cost * 0.25; eff({ h: 6, so: 4 }); return L`${iga(n)} ${there}에서 결혼했습니다. 작은 정성을 부쳐 보냈습니다.`; }
        eff({ h: 4, so: 1 }); return L`${iga(n)} ${there}에서 결혼했습니다. 멀리서 축복의 말을 전했습니다.`;
      }
      if (k === 'help') { S.money -= cost; eff({ h: 8, so: 6 }); return L`${callName(kid.name)}의 결혼식에서 하객들에게 인사하느라 목이 쉬었습니다.`; }
      if (k === 'little') { S.money -= cost * 0.25; eff({ h: 6, so: 4 }); return L`${iga(callName(kid.name))} 결혼했습니다. 작은 정성을 보탰습니다.`; }
      eff({ h: 4, so: 1 }); return L`${iga(callName(kid.name))} 결혼했습니다. 손을 꼭 잡고 축복해 주었습니다.`;
    }
  },
  ofpath: {
    ok: () => S.job === 'clerk' && !S.flags.ofPath && rankOf('clerk') === 0,
    build: () => { const x = expIn('clerk').same, fi = S.flags.ofF = ri(0, OF_FIELD().length - 1), f = OF_FIELD()[fi];
      return { title: "Đi theo con đường nào?", body: L`사무직으로 ${x}년을 일했습니다. 팀장 자리를 바라볼 때가 되자, 회사에서 앞으로의 길을 묻습니다. 사람을 이끌지, 한 분야를 깊이 팔지, 영업으로 옮길지.`,
        fact: "Các công ty lớn đôi khi tách riêng con đường quản lý và con đường chuyên gia (thang sự nghiệp kép, Allen & Katz 1986)",
        choices: [{ k: 'mgr', label: "Con đường quản lý: dẫn dắt một nhóm", sub: "Khả năng lên trưởng nhóm ↑ · trách nhiệm ↑" }, { k: 'spec', label: L`${f} 전문가의 길`, sub: "Nguy cơ bị sa thải ↓ · thu nhập tăng chậm mà đều" }, { k: 'sales', label: "Chuyển sang kinh doanh", sub: "Tiền thưởng lên xuống nhiều theo kết quả" }] }; },
    apply: k => { S.flags.ofPath = k; S.yearMark = S.yearMark || 'job';
      if (k === 'mgr') return "Bạn chọn con đường quản lý và bắt đầu dẫn dắt nhóm từ những việc nhỏ.";
      if (k === 'spec') { eff({ sm: 2 }); return L`${ofField()} 일을 깊이 파기로 했습니다. 퇴근 후에도 관련 공부를 이어 갔습니다.`; }
      eff({ so: 2, h: -1 }); return "Bạn chuyển sang phòng kinh doanh. Những ngày đi gặp khách hàng và vật lộn với chỉ tiêu doanh số bắt đầu."; }
  },
  phd: {
    ok: () => phdOK(),
    build: () => ({ title: "Học tiếp lên tiến sĩ?", body: studyWhere() ? L`${CBY[studyWhere()].ko}에서 석사 학위를 받았습니다. 지도교수가 그곳에서 박사 과정을 이어 가라고 권합니다. 4~6년을 연구에 매달려야 하고, 그동안은 연구 수당으로 빠듯하게 지냅니다. 박사가 되어도 교수가 되는 사람은 많지 않습니다.` : "Bạn đã nhận bằng thạc sĩ. Giáo sư hướng dẫn khuyên bạn học tiếp tiến sĩ. Bạn sẽ phải miệt mài nghiên cứu 4-6 năm, sống chật vật bằng trợ cấp nghiên cứu. Có bằng tiến sĩ rồi cũng không nhiều người trở thành giảng viên đại học.",
      fact: "Ở các nước OECD, khoảng 1% người từ 25 đến 64 tuổi có bằng tiến sĩ (OECD Education at a Glance 2023)",
      choices: [{ k: 'go', label: "Học tiến sĩ", sub: "4-6 năm · sống bằng trợ cấp nghiên cứu · con đường làm giảng viên đại học" }, { k: 'no', label: "Bắt đầu đi làm", sub: "Đi xin việc với bằng thạc sĩ" }] }),
    apply: k => { if (k !== 'go') return false;
      S.school = 'phd'; S.schoolY = 0; S.job = 'student'; S.flags.phdAt = S.age; S.yearMark = 'edu'; eff({ sm: 3 });
      return "Bạn bắt đầu học tiến sĩ. Phòng thí nghiệm trở thành ngôi nhà thứ hai."; }
  },
  profapp: {
    ok: () => S.flags.dr != null && S.flags.profT == null && !S.retired,
    build: () => { const y = S.age - S.flags.dr, p = profP(); S.flags.profP = p;
      return { title: "Ứng tuyển làm giảng viên đại học?", body: y ? L`박사 학위를 받은 지 ${y}년이 되었습니다. 한 대학에서 교수 임용 공고가 났습니다. 자리는 하나, 지원자는 수십 명입니다.` : "Bạn đã nhận bằng tiến sĩ. Một trường đại học đăng thông báo tuyển giảng viên. Chỉ có một vị trí, mà có đến vài chục người ứng tuyển.",
        fact: "Ở Mỹ, ước tính chỉ khoảng 1 trong 8 người có bằng tiến sĩ giành được vị trí giảng viên chính thức ở trường đại học (Larson và cộng sự 2014)",
        choices: [{ k: 'apply', label: "Ứng tuyển", sub: L`붙을 가능성: ${dreamWord(p)}` }, { k: 'no', label: "Lần này bỏ qua", sub: '' }] }; },
    apply: k => { if (k !== 'apply') return false;
      if (chance(S.flags.profP || profP())) {
        const [lo, hi] = jobRange('prof', C()); takeJob({ id: 'prof', formal: true, pct: clamp(lo + (hi - lo) * 0.3, 0, 0.99) });
        S.flags.profT = S.age; S.yearMark = 'job'; eff({ h: 10, so: 3 });
        return { t: L`조교수로 임용되었습니다! 박사 과정에 들어선 지 ${S.age - (S.flags.phdAt != null ? S.flags.phdAt : S.flags.dr)}년 만입니다.`, k: 'big' };
      }
      eff({ h: -3 }); return { t: chance(0.4) ? "Bạn đã vào đến vòng phỏng vấn cuối, nhưng chỉ có một vị trí." : "Lần tuyển dụng này bạn đã không được nhận.", k: 'bad' }; }
  },
  vocation: {
    ok: () => vocOK(S.age),
    build: () => {
      const k = vocKind(), V = k && VOC()[k]; if (!V) return null; S.flags.vocK = k;
      const cel = vocCelib(k), c = C();
      const fact = k === 'cath' || k === 'nun' ? "Trên thế giới có khoảng 400.000 linh mục Công giáo và khoảng 600.000 nữ tu (Niên giám Thống kê của Tòa Thánh 2023)" : k === 'bud' ? "Thái Lan có khoảng 250.000 nhà sư; Tông Tào Khê (Jogye) của Hàn Quốc có khoảng 12.000 nhà sư" : k === 'isl' ? "Khoảng 100.000 người, trong đó có các imam, làm việc cho Tổng cục Tôn giáo Thổ Nhĩ Kỳ (Diyanet)" : "Ở Mỹ, cứ khoảng 750 người lao động thì có 1 người là chức sắc tôn giáo (BLS 2024)";
      return { title: k === 'bud' ? "Xuất gia?" : k === 'nun' ? "Bước vào đời tu?" : "Bước vào con đường chức sắc tôn giáo?",
        body: L`오랫동안 ${V.place}에서 봉사해 왔습니다. 어느 날 ${V.who} 조용히 물었습니다. 평생 이 길을 걸어 볼 생각은 없느냐고.` + (cel ? ' ' + "Đi con đường này, bạn sẽ sống không kết hôn." : ''), fact,
        choices: [{ k: 'go', label: V.go, sub: cel ? L`${V.tr}년의 수련 · 결혼하지 않는 삶` : L`${V.tr}년의 수련 · 평생의 일로` }, { k: 'lay', label: "Giữ đức tin và tiếp tục cuộc sống hiện tại", sub: '' }] };
    },
    apply: k => {
      const kind = S.flags.vocK || vocKind(), V = kind && VOC()[kind];
      if (k !== 'go' || !V) { eff({ h: 1, so: 2 }); return "Bạn quyết định giữ đức tin và tiếp tục cuộc sống hiện tại, dành nhiều thời gian hơn cho việc của cộng đoàn."; }
      let t = V.start;
      if (vocCelib(kind)) { S.flags.celib = 1; if (S.fam.dating) { t += ' ' + L`만나던 ${wa(callName(S.fam.dating.name))}는 헤어졌습니다.`; S.fam.dating = null; } }
      S.flags.voc = { k: kind, at: S.age, tr: V.tr };
      takeJob({ id: 'clergy', formal: true, pct: jobRange('clergy', C())[0] + 0.02 }); setRank('clergy', 0);
      if (vowedHome()) vowedLeave();
      eff({ h: 4, so: 2 }); S.yearMark = 'job';
      return t;
    }
  },
  rankup: {
    ok: p => ladStepOK('rankup', p),
    build: () => {
      const st = ladder(S.job)[rankOf(S.job)], x = expIn(S.job).same;
      if (S.job === 'prof' && S.flags.profT != null && rankOf('prof') < 2) return { title: L`${st.n} 승진 심사`, body: L`${x}년 동안 강의하고 논문을 써 왔습니다. ${st.n} 승진 심사를 받을 때가 되었습니다.`,
        fact: "Ở các trường đại học Mỹ, trợ lý giáo sư thường được xét biên chế vĩnh viễn (tenure) sau khoảng 6 năm (AAUP)",
        choices: [{ k: 'up', label: "Nộp hồ sơ xét", sub: "Phần lớn được thông qua, nhưng cũng có người trượt" }, { k: 'no', label: "Chuẩn bị thêm một năm", sub: '' }] };
      if (S.job === 'clergy') return { title: L`${st.n} 자리를 맡을까?`, body: L`${ro(shortJob(S.job))} ${x}년을 섬기며 사람들의 믿음을 얻었습니다. ${iga(st.n)} 되면 돌볼 사람과 맡을 일이 훨씬 많아집니다.`,
        fact: st.n === VOC().cath.st[1] ? "Trên thế giới có khoảng 5.600 giám mục Công giáo, cứ khoảng 70 linh mục thì có 1 giám mục (Niên giám Thống kê của Tòa Thánh 2023)" : null,
        choices: [{ k: 'up', label: "Nhận", sub: "Trách nhiệm↑" }, { k: 'no', label: "Ở lại vị trí hiện tại", sub: '' }] };
      return { title: L`${st.n} 자리를 맡을까?`, body: L`${ro(shortJob(S.job))} ${x}년 일하며 실력을 인정받았습니다. ${iga(st.n)} 되면 벌이가 늘지만 책임과 일도 많아집니다.`,
        fact: S.job === 'shop' ? "Khoảng 75% quản lý cửa hàng của Walmart ở Mỹ đã khởi đầu bằng công việc làm theo giờ (Walmart)" : /임원|대표/.test(st.n) ? "Ở 100 doanh nghiệp lớn nhất Hàn Quốc, cứ khoảng 120 nhân viên thì có 1 người là lãnh đạo cấp cao (Unicosearch 2022)" : JOBS[S.job].e >= 4 ? null : "Ở Mỹ, 16% người lao động chỉ có bằng tốt nghiệp trung học hoặc thấp hơn kiếm được nhiều hơn một nửa số người tốt nghiệp đại học (Georgetown CEW 2021)",
        choices: [{ k: 'up', label: "Nhận", sub: "thu nhập↑ · trách nhiệm↑" }, { k: 'no', label: "Ở lại vị trí hiện tại", sub: '' }] };
    },
    apply: k => {
      const prv = S.job === 'prof' && S.flags.profT != null && rankOf('prof') < 2; S.flags.profRe = null;
      S.flags.lastStep = S.age; if (k === 'no') { if (prv) S.flags.profRe = S.age + 1; return false; }
      const r = rankOf(S.job) + 1, st = ladder(S.job)[r - 1];
      if (prv && !chance(0.85)) { S.flags.profRe = S.age + 2; eff({ h: -4 }); return { t: L`${st.n} 승진 심사에서 떨어졌습니다. 논문을 더 쌓아 다시 도전하기로 했습니다.`, k: 'bad' }; }
      setRank(S.job, r); stepUp(S.job, 0.5); eff({ h: 5, hl: -1 }); S.yearMark = 'job';
      if (S.job === 'coach' && r >= 2) S.pct = Math.max(S.pct, jobRange('coach', C())[1] - 0.03);
      if (S.job === 'soldier' && S.flags.offc == null && r === 2) { S.flags.offc = S.age; setRank('soldier', 0); return "Từ hàng hạ sĩ quan, bạn đã trở thành sĩ quan. Học xong khóa đào tạo sĩ quan, bạn được gắn quân hàm thiếu úy."; }
      if (S.job === 'soldier' && S.flags.offc != null && r === 2) return "Bạn đã trở thành tướng. Ngày gắn ngôi sao lên vai, bạn nhớ lại ngày đầu tiên khoác lên mình bộ quân phục.";
      return L`${iga(st.n)} 되었습니다.`;
    }
  },
  applpar: {
    ok: () => atParents() && S.income > 0,
    build: p => { const it = p && p.it === 'w' ? "máy giặt" : "tủ lạnh", full = expenseCost('applFull'); S.flags.ap = full;
      return { title: L`부모님 댁 ${iga(it)} 고장 났습니다`, body: L`함께 사는 부모님 댁 ${eul(it)} 새로 사야 합니다. 새것은 약 ${wonStr(full)}입니다.`,
        choices: [{ k: 'all', label: "Tự trả toàn bộ", sub: L`약 ${wonStr(full)}` }, { k: 'half', label: "Góp một nửa", sub: L`약 ${wonStr(full / 2)}` }, { k: 'par', label: "Để bố mẹ lo", sub: "Bạn không mất tiền" }] }; },
    apply: (k, p) => {
      const it = p && p.it === 'w' ? "máy giặt" : "tủ lạnh", full = S.flags.ap || expenseCost('applFull');
      const parBt = x => { if (S.fam.mom.alive) btAdd(S.fam.mom, x); if (S.fam.dad.alive && !S.fam.dad.absent) btAdd(S.fam.dad, x); };
      if (k === 'all') { S.money -= full; eff({ so: 2, h: 1 }); parBt(3); return { t: L`부모님 댁 새 ${eul(it)} 내 돈으로 들여놓았습니다. (−${wonStr(full)})`, k: 'warm' }; }
      if (k === 'half') { S.money -= full / 2; eff({ so: 1 }); parBt(1.5); return { t: L`부모님 댁 새 ${it} 값의 절반을 보탰습니다. (−${wonStr(full / 2)})`, k: 'ev' }; }
      if (S.q <= 2) eff({ h: -1 });
      return { t: S.q <= 2 ? L`부모님이 새 ${eul(it)} 장만하셨습니다. 넉넉지 않은 살림이라 마음이 쓰였습니다.` : L`부모님이 새 ${eul(it)} 장만하셨습니다.`, k: 'ev' };
    }
  },
  bizscale: {
    ok: () => bizScaleOK(),
    build: () => ({ title: "Cơ hội đưa công ty lớn mạnh", body: L`${ro(shortJob('owner'))} ${S.jobY}년, 회사가 단단히 자리를 잡았습니다. 투자자가 큰돈을 넣어 회사를 키워 보자고 합니다. 지분 일부를 내줘야 하고, 잘 안되면 회사를 잃을 수도 있습니다. 회사를 사겠다는 곳도 나타났습니다.`,
      fact: "Hơn một nửa số công ty nhận vốn đầu tư mạo hiểm làm mất tiền của nhà đầu tư, và 6% trả lại hơn năm lần số tiền đã bỏ vào (Mỹ 1985-2009, Kerr, Nanda & Rhodes-Kropf 2014). Phần lớn nhóm 0,1% giàu nhất trong một nước là những người gây dựng công ty và gia đình họ (Smith, Yagan, Zidar & Zwick 2019)",
      choices: [{ k: 'scale', label: "Nhận vốn đầu tư và mở rộng mạnh", sub: "Có thể lớn mạnh, cũng có thể mất công ty" }, { k: 'sell', label: "Bán công ty", sub: "Cầm một khoản tiền lớn và tìm con đường tiếp theo" }, { k: 'keep', label: "Giữ quy mô hiện tại", sub: '' }] }),
    apply: k => {
      S.flags.bizScaleAt = S.age; S.flags.bizScaleN = (S.flags.bizScaleN || 0) + 1;
      const c = C(), m = incomeAt(c, 0.5);
      if (k === 'keep') return false;
      if (k === 'sell') {
        const amt = m * (rankOf('owner') >= 2 ? 30 + 60 * rnd() : 8 + 20 * rnd());
        S.money += amt; S.flags.lastJob = 'owner'; setRank('owner', 0); S.flags.bizK = null; S.flags.bizBig = 0; S.flags.bizL = 0; S.flags.bizPt = 0; S.flags.bizStaff = 0; S.flags.bizSold = S.age;
        if (S.age >= 58) { S.pension = pensionAmount(); S.retired = true; S.job = 'retired'; } else { S.job = 'seeking'; S.flags.seekY = 0; }
        eff({ h: 6 }); S.yearMark = 'job';
        return S.retired ? L`일군 회사를 팔고 일에서 물러났습니다. ${wonStr(amt)}을 손에 쥐었습니다.` : L`일군 회사를 팔았습니다. ${wonStr(amt)}을 손에 쥐고 다음 길을 찾기로 했습니다.`;
      }
      const r = rnd() + clamp((S.st.sm - 50) / 400, -0.05, 0.08) + (S.flags.bizK === 'soft' ? 0.04 : 0);
      if (r < 0.55) {
        const lost = Math.min(Math.max(0, S.money) * 0.3, m * 3); S.money -= lost;
        S.flags.lastJob = 'owner'; setRank('owner', 0); S.flags.bizK = null; S.flags.bizBig = 0; S.flags.bizL = 0; S.flags.bizPt = 0; S.flags.bizStaff = 0; S.flags.bizFail = S.age;
        S.job = 'seeking'; S.flags.seekY = 0; S.pct = clamp(S.pct - 0.1, 0.05, 0.9); eff({ h: -12 });
        return { t: "Bạn đã nhận vốn đầu tư và mở rộng, nhưng thị trường không thuận theo. Công ty đã về tay nhà đầu tư, và bạn phải đi tìm việc lại." + (lost > 0 ? ` (−${wonStr(lost)})` : ''), k: 'bad' };
      }
      if (r < 0.94) { const amt = m * (4 + 12 * rnd()); S.money += amt; S.pct = Math.max(S.pct, payTop() - 0.02); eff({ h: 6 });
        return L`투자를 받아 회사가 한층 커졌습니다. 직원이 늘고, 내 몫의 지분 값도 ${wonStr(amt)}쯤 올랐습니다.`; }
      const q = chance(0.06) ? 2e-5 + rnd() * 8e-5 : 1e-4 + rnd() * 0.0024, stake = wealthAt(c, q);
      S.money += stake; S.flags.bizScale = 1; setRank('owner', 2); S.pct = payTop(); eff({ h: 12, so: 2 }); S.yearMark = 'star';
      return { t: L`투자를 받아 키운 회사가 나라에서 손꼽히는 회사로 자랐습니다. 내 몫의 지분은 ${wonStr(stake)}의 값이 되었습니다.`, k: 'big' };
    }
  },
  growup: {
    ok: p => ladStepOK('growup', p),
    build: () => {
      const r = rankOf(S.job), st = ladder(S.job)[r], x = expIn(S.job).same, med = incomeAt(C(), 0.5);
      const cost = Math.max(med * (r ? 1 : 0.4), S.income * (r ? 0.8 : 0.3)) * (S.job === 'owner' ? 1.8 : 1); S.flags.stepCost = cost;
      return { title: S.job === 'owner' ? "Mở rộng kinh doanh?" : "Mở rộng công việc?", body: JOBS[S.job].s === 'agr' ? L`${x}년 동안 ${ro(shortJob(S.job))} 일하며 경험과 밑천이 생겼습니다. 약 ${wonStr(cost)}을 들이면 ${iga(st.n)} 될 수 있습니다. 잘 안되면 들인 돈을 잃습니다.` : L`${x}년 동안 ${ro(shortJob(S.job))} 일하며 단골과 밑천이 생겼습니다. 약 ${wonStr(cost)}을 들이면 ${iga(st.n)} 될 수 있습니다. 잘 안되면 들인 돈을 잃습니다.`,
        fact: "Ở các nước đang phát triển, chưa đến một phần tư cơ sở kinh doanh nhỏ từng tuyển thêm người, và chỉ hơn 1% phát triển lên quá 10 người (Mead & Liedholm 1998)",
        choices: [{ k: 'up', label: "Mở rộng", sub: "thu nhập↑ · có thể mất số tiền bỏ ra" }, { k: 'no', label: "Giữ quy mô hiện tại", sub: '' }] };
    },
    apply: k => {
      S.flags.lastStep = S.age; if (k === 'no') return false;
      const r = rankOf(S.job), st = ladder(S.job)[r], cost = S.flags.stepCost; S.money -= cost;
      const p = clamp((r ? 0.42 : 0.58) + (S.st.sm - 50) / 300 + Math.min(expIn(S.job).same, 20) * 0.006, 0.25, 0.8);
      if (!chance(p)) { S.pct = clamp(S.pct - 0.04, 0, 0.99); eff({ h: -7 }); return { t: L`일을 키우려다 잘 안됐습니다. 들인 돈 ${wonStr(cost)}을 잃었습니다.`, k: 'bad' }; }
      setRank(S.job, r + 1); stepUp(S.job, 0.5); eff({ h: 8 }); S.yearMark = 'job';
      return L`일을 키워 ${iga(st.n)} 되었습니다.`;
    }
  },
  ownup: {
    ok: p => ladStepOK('ownup', p) && !nkLife(),
    build: () => {
      const st = ladder(S.job)[rankOf(S.job)], x = expIn(S.job).same, cost = Math.max(incomeAt(C(), 0.5) * 1.2, S.income * 0.8); S.flags.stepCost = cost;
      return { title: L`독립해서 ${iga(st.n)} 될까?`, body: L`${x}년 동안 ${ro(shortJob(S.job))} 일하며 기술과 손님을 얻었습니다. 약 ${wonStr(cost)}을 들여 내 가게를 차릴 수 있습니다.`,
        fact: "Khoảng một nửa số cơ sở kinh doanh mới mở trụ được 5 năm (OECD). Vì đã làm nghề này lâu, bạn có lợi thế hơn người mới bắt đầu",
        choices: [{ k: 'own', label: "Ra riêng", sub: "nếu thành công, thu nhập↑ · nếu không, mắc nợ" }, { k: 'no', label: "Ở lại vị trí hiện tại", sub: '' }] };
    },
    apply: k => {
      S.flags.lastStep = S.age; if (k === 'no') return false;
      const from = S.job, st = ladder(from)[rankOf(from)], cost = S.flags.stepCost; S.money -= cost;
      const r = rnd() + clamp((S.st.sm - 50) / 500, -0.06, 0.06) + Math.min(expIn(from).same, 15) * 0.008;
      if (r < 0.36) { S.pct = clamp(S.pct - 0.03, 0, 0.99); eff({ h: -10 }); return { t: L`가게를 열었지만 손님이 들지 않아 1년 만에 접었습니다. 다시 ${ro(shortJob(from))} 일합니다. (−${wonStr(cost)})`, k: 'bad' }; }
      const pct0 = S.pct, big = r > 0.92; S.flags.ownT = st.n; S.flags.ownFrom = from; setRank('owner', 0);
      takeJob({ id: 'owner', formal: false, pct: clamp(Math.max(pct0 + (big ? 0.1 : 0.02), 0.45), 0, 0.97) });
      if (big) S.money += cost * 1.2; eff({ h: big ? 12 : 6 }); S.yearMark = 'job';
      return big ? L`${iga(st.n)} 되었습니다. 문을 열자마자 손님이 몰려 장사가 아주 잘됩니다!` : L`${iga(st.n)} 되었습니다. 이제 내 가게입니다.`;
    }
  },
  protry: {
    ok: () => !!proHobby() && S.job !== 'athlete',
    build: () => {
      const sp = hobbyName(proHobby().id);
      return { title: "Dự tuyển vào đội chuyên nghiệp?", body: L`어릴 때부터 해 온 ${sp} 실력이 눈에 띄어 프로 팀 스카우트가 연락해 왔습니다. 입단 테스트를 통과하면 운동이 직업이 됩니다.`,
        fact: "Trên thế giới có khoảng 130.000 cầu thủ bóng đá nam chuyên nghiệp (FIFA 2023). Trong số đó, 45% kiếm chưa tới 1.000 đô la mỗi tháng, và chỉ 2% kiếm được nhiều tiền (FIFPRO 2016)",
        choices: [{ k: 'try', label: "Đi tuyển chọn", sub: "đỗ thì thành vận động viên chuyên nghiệp · có thể trượt" }, { k: 'no', label: "Giữ thể thao làm sở thích", sub: '' }] };
    },
    apply: k => {
      S.flags.proTried = 1; if (k === 'no') return false;
      const h = proHobby(), sp = hobbyName(h.id);
      if (!chance(PRO_WIN + (Math.max(h.lv, S.flags.youth ? 5 : 0) - 5) * 0.03 + (S.flags.youth ? 0.1 : 0) + talPass('bd'))) { eff({ h: -4 }); return { t: L`입단 테스트에서 떨어졌습니다. ${eun(sp)} 취미로 계속하기로 했습니다.`, k: 'bad' }; }
      if (S.school) { S.school = null; S.schoolY = 0; }
      setRareJob('athlete'); S.pct = clamp(0.5 + rnd() * 0.2, 0, 0.9); S.ath = { sp, sid: h.id, until: ri(30, 35), star: false }; eff({ h: 12, hl: 3 }); S.yearMark = 'star';
      return { t: L`입단 테스트에 붙었습니다! 프로 ${sp} 선수가 되었습니다.`, k: 'big' };
    }
  },
  youthtry: {
    ok: () => !!youthHobby() && !S.flags.youthTried,
    build: () => {
      const h = youthHobby(), sp = hobbyName(h.id), kind = youthKind(h.id);
      return { title: kind === 'club' ? L`${sp} 유소년팀 입단 테스트를 볼까?` : kind === 'run' ? "Thi tuyển vào trại huấn luyện điền kinh?" : L`${sp} 유소년 대표 선발전에 나가 볼까?`,
        body: kind === 'club' ? (S.urban ? L`도시의 프로 구단 유소년팀이 입단 테스트를 엽니다. 동네에서 ${sp} 좀 한다는 아이들이 모두 모인다고 합니다.` : L`가까운 도시의 구단 유소년팀이 입단 테스트를 엽니다. 동네에서 ${sp} 좀 한다는 아이들이 모두 모인다고 합니다.`)
          : kind === 'run' ? "Nghe nói những em đạt thành tích tốt ở giải điền kinh liên trường sẽ được chọn vào trại huấn luyện điền kinh."
          : L`지역 유소년 ${sp} 대표를 뽑는 선발전이 열립니다. 학교마다 잘한다는 아이들이 모인다고 합니다.`,
        fact: h.id === 'sp_football' ? "Trong khoảng 1,5 triệu cậu bé chơi bóng đá trẻ ở Anh, chỉ khoảng 180 người trở thành cầu thủ Premier League, tức 0,012% (Calvin 2017)"
          : "Tùy môn thể thao, chỉ 0,03–0,5% vận động viên trung học ở Mỹ trở thành vận động viên chuyên nghiệp (NCAA 2020)",
        choices: [{ k: 'try', label: "Thử xem", sub: "Đỗ thì được tập ở đội trẻ · phần lớn đều trượt" }, { k: 'no', label: "Chơi vì yêu thích", sub: '' }] };
    },
    apply: k => {
      S.flags.youthTried = S.age; if (k === 'no') return false;
      const h = youthHobby() || S.hobbies.find(isSportH); if (!h) return false;
      const sp = hobbyName(h.id), kind = youthKind(h.id), p = clamp(0.015 + (h.lv - 2) * 0.04 + (S.st.hl - 60) / 400 + talPass('bd'), 0.02, 0.35);
      if (!chance(p)) { S.flags.sportTry = S.age; eff({ h: -3 }); return { t: kind === 'club' ? L`입단 테스트에서 떨어졌습니다. 아쉬웠지만 ${eun(sp)} 계속하기로 했습니다.` : L`선발되지 못했습니다. 아쉬웠지만 ${eun(sp)} 계속하기로 했습니다.`, k: 'bad' }; }
      S.flags.youth = { id: h.id, at: S.age }; h.lv += 1; eff({ h: 8, hl: 2, so: 2 }); S.yearMark = 'star';
      return { t: kind === 'club' ? (S.school ? "Bạn đã vượt qua buổi tuyển chọn và vào đội trẻ! Ngày nào tan học bạn cũng đến sân tập." : "Bạn đã vượt qua buổi tuyển chọn và vào đội trẻ! Ngày nào bạn cũng đến sân tập.") : kind === 'run' ? "Bạn đã được chọn vào trại huấn luyện điền kinh! Sáng sớm nào bạn cũng chạy trên những con dốc." : "Bạn đã vượt qua đợt tuyển chọn và vào đội tuyển trẻ!", k: 'big' };
    }
  },
  coachq: {
    ok: () => isWorking() && sportBack() && !['coach', 'athlete', 'trainer'].includes(S.job),
    build: () => { const sp = sportBackName();
      return { title: L`아이들에게 ${eul(sp)} 가르쳐 볼까?`, body: L`동네 유소년팀에서 코치를 구한다는 이야기를 들었습니다. 어릴 때 ${sp}에 쏟았던 시간이 떠오릅니다.`,
        fact: "Ở Mỹ có khoảng 300.000 người làm huấn luyện viên và tuyển trạch viên, cứ khoảng 530 người lao động thì có 1 người. Còn nhiều người hơn thế dạy trẻ em với tư cách tình nguyện viên (BLS 2024)",
        choices: [{ k: 'job', label: "Chuyển sang làm huấn luyện viên", sub: "Thu nhập có thể giảm · Việc mình yêu thích" }, { k: 'vol', label: "Dạy tình nguyện vào mỗi cuối tuần", sub: "Hạnh phúc↑ Quan hệ↑" }, { k: 'no', label: "Tiếp tục công việc hiện tại", sub: '' }] }; },
    apply: k => {
      S.flags.coachQ = S.age; if (k === 'no') return false; const sp = sportBackName();
      if (k === 'vol') { S.flags.volCoach = S.age; eff({ h: 4, so: 4 }); return L`주말마다 동네 아이들에게 ${eul(sp)} 가르치기로 했습니다.`; }
      const [lo, hi] = jobRange('coach', C()); takeJob({ id: 'coach', formal: chance(0.5), pct: clamp(lo + (hi - lo) * (0.25 + rnd() * 0.3), 0, 0.95) }); eff({ h: 6 }); S.yearMark = 'job';
      return L`유소년팀 ${sp} 코치가 되었습니다. 아이들과 함께 운동장에서 하루를 보냅니다.`;
    }
  },
  mustry: {
    ok: () => (!!musicHobby() || S.major === 'mus') && S.job !== 'musician',
    build: () => ({ title: "Sống bằng âm nhạc?",
      body: S.urban ? "Tiếng hát và tiếng đàn bạn theo đuổi từ nhỏ được nhiều người truyền tai nhau, và có người rủ bạn cùng lên sân khấu, cùng sáng tác. Đây là cơ hội để biến âm nhạc thành công việc."
        : "Tài ca hát và chơi nhạc của bạn ở các lễ hội làng và đám cưới đã nổi tiếng đến tai một nhóm biểu diễn ở thành phố, và họ mời bạn tham gia. Đây là cơ hội để biến âm nhạc thành công việc.",
      fact: "Ở Mỹ có khoảng 170.000 người làm nhạc sĩ, ca sĩ, cứ khoảng 1.000 người lao động thì có 1 người, và một nửa là tự làm chủ (BLS 2025). 43% nhạc sĩ ở Anh kiếm được dưới 14.000 bảng Anh mỗi năm từ âm nhạc (Musicians' Census 2023)",
      choices: [{ k: 'try', label: "Biến âm nhạc thành công việc", sub: "thu nhập bấp bênh · nếu thành công, có thể được biết tên tuổi" }, { k: 'no', label: "Giữ âm nhạc làm sở thích", sub: '' }] }),
    apply: k => {
      S.flags.musTried = 1; if (k === 'no') return false;
      const h = musicHobby();
      if (!chance(MUS_WIN + (h ? (hLv(h) - 4) * 0.03 : -0.05) + (S.major === 'mus' ? 0.08 : 0) + talPass('mu'))) { eff({ h: -4 }); return { t: "Bạn đã lên sân khấu vài lần nhưng không thành công việc. Bạn quyết định giữ âm nhạc làm sở thích.", k: 'bad' }; }
      takeJob({ id: 'musician', formal: false, pct: clamp(0.2 + rnd() * 0.25, 0, 0.9) }); eff({ h: 10 }); S.yearMark = 'star';
      return { t: "Bạn đã trở thành nhạc sĩ! Bạn biểu diễn, sáng tác, dạy nhạc và sống bằng âm nhạc.", k: 'big' };
    }
  },
  idolaud: {
    ok: () => !!idolHobby() && !S.flags.trainee && S.job !== 'idol',
    build: () => {
      const n = S.flags.audN || 0, ab = S.cur !== 'KOR', cast = !n && !ab && S.urban && chance(0.3);
      if (ab) return { title: n ? "Đi thử giọng ở một công ty giải trí Hàn Quốc khác?" : "Đi thử giọng ở công ty giải trí Hàn Quốc?",
        body: (n ? L`지난번에는 떨어졌지만, 다른 한국 기획사가 ${C().ko}에서 오디션을 엽니다. 그동안 더 연습했습니다.` : L`한국의 한 연예 기획사가 ${C().ko}에서 오디션을 엽니다. 노래와 춤에 자신 있는 아이들이 수천 명 몰린다고 합니다.`)
          + ' ' + "Người đỗ sẽ một mình sang Hàn Quốc, sống trong ký túc xá thực tập sinh và bắt đầu từ việc học tiếng Hàn.",
        fact: "Năm 2023, khoảng 28% thực tập sinh ở các hãng thu âm trong nước của HYBE mang quốc tịch nước ngoài. Đầu năm 2026, 10,2% thành viên của 100 nhóm K-pop hàng đầu mang quốc tịch nước ngoài, nhiều nhất là Nhật Bản, rồi đến Trung Quốc, Đài Loan và Thái Lan (The Korea Herald 2023, Balance Now Insight 2026)",
        choices: [{ k: 'try', label: "Đi thử giọng", sub: "Đỗ thì làm thực tập sinh ở Hàn Quốc · phần lớn đều trượt" }, { k: 'no', label: "Giữ ca hát và nhảy múa làm niềm vui", sub: '' }] };
      return { title: n ? "Đi thử giọng ở một công ty giải trí khác?" : cast ? "Bạn nhận được danh thiếp của người tìm kiếm tài năng" : "Đi thử giọng ở công ty giải trí?",
        body: n ? "Lần trước bạn đã trượt, nhưng một công ty giải trí khác đang tổ chức thử giọng. Thời gian qua bạn đã luyện tập thêm."
          : cast ? "Trước cổng trường, một nhân viên công ty giải trí đưa bạn danh thiếp và mời bạn đến thử giọng."
          : "Một công ty giải trí lớn tổ chức buổi thử giọng mở. Nghe nói hàng nghìn bạn trẻ tự tin vào giọng hát và vũ đạo sẽ kéo đến.",
        fact: "Từ năm 1996 đến 2025, có 1.182 nhóm nhạc thần tượng ra mắt ở Hàn Quốc, khoảng 39 nhóm mỗi năm. Trong đó, 8,2% từng bán được hơn 100.000 bản một album (Asia Economy 2026)",
        choices: [{ k: 'try', label: "Đi thử giọng", sub: "Đỗ thì làm thực tập sinh · phần lớn đều trượt" }, { k: 'no', label: "Giữ ca hát và nhảy múa làm niềm vui", sub: '' }] };
    },
    apply: k => {
      S.flags.audAt = S.age; if (k === 'no') { S.flags.audN = 3; return false; }
      S.flags.audN = (S.flags.audN || 0) + 1;
      const p = clamp(0.08 + (idolSkill() - 2) * 0.04 + (S.st.hl - 60) / 500 + (S.urban ? 0.02 : 0) + talPass('mu'), 0.04, 0.45);
      if (!chance(p)) { S.flags.idolDream = 1; eff({ h: -4 }); return { t: "Bạn đã trượt buổi thử giọng. Tiếc thật, nhưng bạn vẫn quyết định tiếp tục ca hát và nhảy múa.", k: 'bad' }; }
      S.flags.trainee = { at: S.age, y: 0 }; eff({ h: 8, so: 2 }); S.yearMark = 'star';
      if (S.cur !== 'KOR') { S.flags.trainee.ab = S.cur; eff({ so: -6 }); petStay(true); return { t: "Bạn đã đỗ buổi thử giọng và trở thành thực tập sinh! Bạn chia tay gia đình ở sân bay và chuyển vào ký túc xá thực tập sinh ở Seoul. Việc đầu tiên là học tiếng Hàn.", k: 'big' }; }
      return { t: "Bạn đã đỗ buổi thử giọng và trở thành thực tập sinh! Tan học là bạn đến phòng tập.", k: 'big' };
    }
  },
  traineeq: {
    ok: () => !!(S.flags.trainee && !S.flags.trainee.done),
    build: () => ({ title: L`연습생 ${S.flags.trainee.y}년째, 계속할까?`,
      body: "Bạn bè cùng trang lứa đang chuẩn bị cho kỳ thi và con đường phía trước. Không ai biết bạn có được vào đội hình ra mắt hay không.",
      choices: [{ k: 'stay', label: "Tiếp tục cố gắng", sub: "Có thể được ra mắt · Việc học bị tụt lại" }, { k: 'quit', label: "Dừng lại và trở về với việc học ở trường", sub: "Gác lại giấc mơ, nhưng việc học và bạn bè sẽ trở lại" }] }),
    apply: k => {
      S.flags.trainee.q = 1; if (k === 'stay') return false;
      const ab = traineeAway(); S.flags.trainee.done = 1; S.flags.idolDream = 1; eff({ h: -3, sm: 2, so: ab ? 6 : 3 });
      return ab ? L`연습생 생활을 그만두고 고향 ${ro(C().ko)} 돌아왔습니다. 가족 곁에서 다시 학교에 다닙니다.` : "Bạn đã thôi làm thực tập sinh và trở về với việc học ở trường.";
    }
  },
  idolafter: {
    ok: () => S.job === 'idol' && !!(S.idol && S.idol.end),
    build: () => ({ title: "Nhóm đã ngừng hoạt động", body: L`${S.age}세, 무대 밖의 삶이 시작됩니다. 무엇을 할까요?`,
      choices: [{ k: 'solo', label: "Tiếp tục thử sức với tư cách nghệ sĩ solo hoặc diễn viên", sub: "Nếu thành công, bạn sẽ tiếp tục đứng trên sân khấu · Phần lớn không thành" },
        { k: 'teach', label: "Trở thành huấn luyện viên thanh nhạc và vũ đạo", sub: "Dạy các thực tập sinh" }, idolHome() ? { k: 'new', label: L`고향 ${ro(B().ko)} 돌아가 새 길을 찾는다`, sub: "Làm việc khác hoặc đi học, ở bên gia đình" } : { k: 'new', label: "Tìm con đường mới", sub: "Làm việc khác hoặc đi học" }] }),
    apply: k => {
      const I = S.idol;
      if (k === 'solo' && chance(I.hit ? 0.5 : 0.12)) { I.end = 0; I.solo = 1; I.y = 0; eff({ h: 6 }); return { t: "Bạn đã trở lại sân khấu với tư cách nghệ sĩ solo.", k: 'big' }; }
      if (k === 'solo' && chance(I.hit ? 0.35 : 0.08)) { takeJob({ id: 'actor', formal: false, pct: clamp(0.3 + rnd() * 0.2 + (I.hit ? 0.2 : 0), 0, 0.95) }); eff({ h: 6 }); return { t: "Bạn bắt đầu theo nghề diễn và trở thành diễn viên. Lần đầu xuất hiện của bạn là một vai nhỏ trong phim truyền hình.", k: 'big' }; }
      if (k === 'teach') { takeJob({ id: 'musician', formal: false, pct: clamp(0.3 + rnd() * 0.2 + (I.hit ? 0.15 : 0), 0, 0.9) }); S.flags.vocalCoach = 1; return "Bạn trở thành huấn luyện viên thanh nhạc và vũ đạo, dạy các thực tập sinh."; }
      S.job = 'seeking'; S.flags.seekY = 0;
      if (k === 'new' && idolHome()) return "Bạn đã rời sân khấu." + ' ' + goHome(false, false) + ' ' + "Bạn bắt đầu tìm công việc mới.";
      return k === 'solo' ? { t: "Bạn đã gõ cửa vài lần nhưng không đi đến đâu. Bạn bắt đầu tìm công việc mới.", k: 'bad' } : "Bạn rời sân khấu và bắt đầu tìm công việc mới.";
    }
  },
  acttry: {
    ok: () => !!actHobby() && S.job !== 'actor',
    build: () => ({ title: "Sống bằng nghề diễn?",
      body: S.urban ? "Một đoàn kịch và một công ty giải trí để ý đến những vai diễn của bạn trên sân khấu ở trường và đoàn kịch địa phương, và đã mời bạn đến thử vai. Đây là cơ hội để biến diễn xuất thành công việc."
        : "Tài diễn xuất của bạn trên sân khấu lễ hội làng được nhiều người biết đến, và một đoàn kịch ở thành phố đã mời bạn đến thử vai. Đây là cơ hội để biến diễn xuất thành công việc.",
      fact: "Ở Mỹ có khoảng 55.000 người làm diễn viên, cứ khoảng 3.000 người lao động thì có 1 người. Phần lớn làm theo những hợp đồng ngắn, giữa các hợp đồng là những quãng dài không có việc, nên nhiều diễn viên làm thêm công việc khác (BLS 2024)",
      choices: [{ k: 'try', label: "Thử vai và biến diễn xuất thành công việc", sub: "thu nhập bấp bênh · nếu thành công, có thể được biết tên tuổi" }, { k: 'no', label: "Giữ diễn xuất làm sở thích", sub: '' }] }),
    apply: k => {
      S.flags.actTried = 1; if (k === 'no') return false;
      const h = actHobby();
      if (!h || !chance(ACT_WIN + (hLv(h) - 4) * 0.03 + (S.major === 'art' ? 0.06 : 0) + talPass('wd'))) { eff({ h: -4 }); return { t: "Bạn đã đỗ vài buổi thử vai nhưng không thành công việc. Bạn quyết định tiếp tục diễn ở đoàn kịch địa phương.", k: 'bad' }; }
      takeJob({ id: 'actor', formal: false, pct: clamp(0.12 + rnd() * 0.25, 0, 0.9) }); eff({ h: 10 }); S.yearMark = 'star';
      return { t: "Bạn đã trở thành diễn viên! Bạn lên sân khấu, đi thử vai, nhận từng vai nhỏ một và sống bằng nghề diễn.", k: 'big' };
    }
  },
  dnctry: {
    ok: () => (!!danceHobby() || S.major === 'dnc') && S.job !== 'dancer',
    build: () => ({ title: "Sống bằng nghề múa?",
      body: S.major === 'dnc' && S.edu >= 4 ? "Một đoàn múa đã thông báo đợt thử vai định kỳ. Đây là cơ hội để đưa những gì bạn học ở đại học lên sân khấu."
        : S.urban ? "Một đoàn múa và một nhóm biểu diễn để ý đến những điệu nhảy bạn theo đuổi từ nhỏ, và đã mời bạn đến thử vai. Đây là cơ hội để biến múa thành công việc."
        : "Tài nhảy múa của bạn ở các lễ hội và tiệc làng được nhiều người biết đến, và một nhóm biểu diễn ở thành phố đã mời bạn tham gia. Đây là cơ hội để biến múa thành công việc.",
      fact: "Ở Mỹ có khoảng 13.800 người làm vũ công và khoảng 4.700 biên đạo múa, cứ khoảng 9.000 người lao động thì có 1 người. Phần lớn bắt đầu tập luyện từ nhỏ, làm bán thời gian là chuyện thường, và đây là một trong những nghề hay chấn thương nhất (BLS 2025)",
      choices: [{ k: 'try', label: "Thử vai và biến múa thành công việc", sub: "Thu nhập bấp bênh · Những năm đứng trên sân khấu không dài" }, { k: 'no', label: "Giữ múa làm sở thích", sub: '' }] }),
    apply: k => {
      S.flags.dncTried = 1; if (k === 'no') return false;
      const h = danceHobby();
      if (!chance(DNC_WIN + (h ? (hLv(h) - 4) * 0.03 : -0.05) + (S.major === 'dnc' ? 0.08 : 0) + talPass('bd'))) { eff({ h: -4 }); return { t: "Bạn đã đi thử vai vài lần nhưng không thành công việc. Bạn quyết định tiếp tục múa ở các lớp buổi tối.", k: 'bad' }; }
      takeJob({ id: 'dancer', formal: false, pct: clamp(0.12 + rnd() * 0.25, 0, 0.9) }); eff({ h: 10 }); S.yearMark = 'star';
      return { t: "Bạn đã trở thành vũ công! Bạn biểu diễn, tập các tác phẩm mới, dạy trẻ em và sống bằng nghề múa.", k: 'big' };
    }
  },
  boardtry: {
    ok: () => !!boardHobby() && S.job !== 'boardpro' && ['go', 'chess'].includes(boardGame()),
    build: () => { const go = boardGame() === 'go';
      return go ? { title: "Thử sức trở thành kỳ thủ chuyên nghiệp?", body: "Tài chơi cờ vây bạn rèn từ nhỏ được nhiều người biết đến, và hiệp hội cờ vây đã mời bạn vào làm học viên để chuẩn bị thi lên chuyên nghiệp. Bạn sẽ phải dồn hết mấy năm trời cho cờ vây, và chỉ rất ít người đỗ.",
          fact: "Hiệp hội Cờ vây Hàn Quốc mỗi năm chỉ nhận khoảng mười lăm đến hai mươi kỳ thủ chuyên nghiệp mới. Trong số học viên, chỉ một số ít đỗ (Korea Baduk Association)",
          choices: [{ k: 'try', label: "Làm học viên và thử sức lên chuyên nghiệp", sub: "Dồn mấy năm cho cờ vây · Chỉ số ít đỗ" }, { k: 'no', label: "Giữ cờ vây làm sở thích", sub: '' }] }
        : { title: "Thử sức giành danh hiệu cờ vua?", body: "Sau một loạt chiến thắng ở các giải đấu, huấn luyện viên đề nghị bạn dự các giải quốc tế để giành danh hiệu. Bạn sẽ phải dồn mấy năm trời cho tập luyện và thi đấu, và chỉ rất ít người giành được danh hiệu.",
          fact: "Mỗi năm, Liên đoàn Cờ vua Thế giới (FIDE) trao hơn 60 danh hiệu đại kiện tướng và hơn 150 danh hiệu kiện tướng quốc tế trên toàn thế giới (FIDE)",
          choices: [{ k: 'try', label: "Dự giải và thử sức giành danh hiệu", sub: "Dồn mấy năm cho cờ vua · Chỉ số ít giành được danh hiệu" }, { k: 'no', label: "Giữ cờ vua làm sở thích", sub: '' }] }; },
    apply: k => {
      S.flags.boardTried = 1; if (k === 'no') return false;
      const go = boardGame() === 'go', h = boardHobby();
      if (!h || !chance(boardWin(h))) { eff({ h: -4 }); return { t: go ? "Bạn đã dự các giải thi lên chuyên nghiệp suốt mấy năm nhưng cuối cùng vẫn không đỗ. Cờ vây ở lại với bạn như một sở thích suốt đời." : "Bạn đã dự các giải đấu suốt mấy năm nhưng không chạm tới danh hiệu. Cờ vua ở lại với bạn như một sở thích suốt đời.", k: 'bad' }; }
      S.flags.boardPro = { at: S.age }; eff({ h: 12, so: 3 }); S.yearMark = 'star';
      if (S.school) { S.flags.boardPro.wait = 1; return { t: go ? "Bạn đã vượt qua giải thi lên chuyên nghiệp và trở thành kỳ thủ cờ vây chuyên nghiệp! Lần đầu tiên bạn nhận giấy chứng nhận nhất đẳng (1 dan). Bạn quyết định học xong sẽ dồn hết sức cho thi đấu." : "Bạn đã giành danh hiệu kiện tướng quốc tế! Bạn quyết định học xong sẽ dồn hết sức cho cờ vua.", k: 'big' }; }
      boardStart();
      return { t: go ? "Bạn đã vượt qua giải thi lên chuyên nghiệp và trở thành kỳ thủ cờ vây chuyên nghiệp! Lần đầu tiên bạn nhận giấy chứng nhận nhất đẳng (1 dan)." : "Bạn đã giành danh hiệu kiện tướng quốc tế! Bạn bắt đầu sống bằng tiền thưởng giải đấu và tiền dạy cờ.", k: 'big' };
    }
  },
  gametry: {
    ok: () => !!gameHobby() && !S.flags.gamer,
    build: () => ({ title: "Dự tuyển vào đội thể thao điện tử chuyên nghiệp?",
      body: "Khi tên bạn lọt vào nhóm đầu bảng xếp hạng trực tuyến, một đội thể thao điện tử chuyên nghiệp đã liên lạc mời bạn đến tuyển chọn. Nếu đỗ, bạn sẽ sống ở nhà chung của đội và luyện tập hơn mười tiếng mỗi ngày, và chỉ rất ít người được lên đội hình chính.",
      fact: S.cur === 'KOR' ? "Năm 2024, các đội thể thao điện tử chuyên nghiệp của Hàn Quốc có 398 tuyển thủ và 167 tuyển thủ ở đội đào tạo trẻ. Tuổi trung bình của tuyển thủ là 23,5, số năm thi đấu trung bình là 4,6 năm (KOCCA, khảo sát thể thao điện tử 2025)"
        : "Tốc độ phản xạ của tuyển thủ thể thao điện tử thường bắt đầu chậm lại từ khoảng 24 tuổi. Vì thế sự nghiệp thi đấu ngắn, và nhiều người giải nghệ ở độ tuổi giữa 20 (Thompson và cộng sự 2014, 3.305 tuyển thủ StarCraft II)",
      choices: [{ k: 'try', label: "Đi tuyển chọn", sub: "Đỗ thì vào đội đào tạo trẻ · Chỉ số ít lên đội hình chính" }, { k: 'no', label: "Giữ trò chơi điện tử làm sở thích", sub: '' }] }),
    apply: k => {
      S.flags.gameTried = 1; if (k === 'no') return false;
      const h = gameHobby();
      if (!h || !chance(gameWin(h))) { S.flags.gameDream = 1; eff({ h: -4 }); return { t: "Bạn đã trượt buổi tuyển chọn. Tiếc thật, nhưng bạn vẫn tiếp tục chơi điện tử cùng bạn bè.", k: 'bad' }; }
      S.flags.gamer = { at: S.age, y: 0 }; eff({ h: 8, so: 2 }); S.yearMark = 'star';
      return { t: "Bạn đã vượt qua buổi tuyển chọn và vào đội đào tạo trẻ! Bạn bắt đầu luyện tập cùng đồng đội ở nhà chung của đội.", k: 'big' };
    }
  },
  gameafter: {
    ok: () => !!(S.flags.gamer && S.flags.gamer.end && !S.flags.gamer.after),
    build: () => ({ title: "Sự nghiệp thi đấu đã kết thúc", body: L`${S.age}세, 경기장 밖의 삶이 시작됩니다. 무엇을 할까요?`,
      fact: "Các tuyển thủ thể thao điện tử chuyên nghiệp Hàn Quốc sắp giải nghệ cho biết con đường tiếp theo họ nghĩ đến là phát sóng cá nhân 19,6%, làm ban huấn luyện 19,6%, kinh doanh ngoài thể thao điện tử 9,8%, bình luận viên 3,9%, đi học 3,9%, còn 37,3% chưa quyết định (khảo sát của Hiệp hội Thể thao điện tử Hàn Quốc, công bố năm 2019)",
      choices: [{ k: 'stream', label: "Bắt đầu phát sóng cá nhân", sub: "Nếu thành công, tiếp tục sống nhờ trò chơi điện tử · Phần lớn chỉ ở quy mô nhỏ" }, { k: 'coach', label: "Ở lại làm huấn luyện viên cho lớp đàn em", sub: "Đội phải có chỗ trống" },
        { k: 'new', label: "Tìm con đường mới", sub: "Làm việc khác hoặc đi học" }] }),
    apply: k => {
      const G = S.flags.gamer; G.after = 1; S.flags.exGamer = 1;
      if (k === 'stream' && chance(G.champ ? 0.6 : 0.3)) { takeJob({ id: 'creator', formal: false, pct: clamp(0.2 + rnd() * 0.25 + (G.champ ? 0.25 : 0) + (G.champ === 2 ? 0.2 : 0), 0, 0.97) }); S.flags.gameStream = 1; eff({ h: 5 }); return "Bạn bắt đầu phát sóng trò chơi điện tử. Những người hâm mộ từng cổ vũ bạn thời còn thi đấu đã đến xem."; }
      if (k === 'coach' && chance(G.champ ? 0.7 : 0.45)) { const [lo, hi] = jobRange('coach', C()); takeJob({ id: 'coach', formal: true, pct: clamp(lo + (hi - lo) * (0.2 + rnd() * 0.3), 0, 0.95) }); S.flags.gameCoach = 1; eff({ h: 4 }); return "Bạn ở lại đội làm huấn luyện viên. Giờ đây bạn dõi theo lớp đàn em từ phía sau sân khấu."; }
      S.job = 'seeking'; S.flags.seekY = 0;
      return k === 'stream' ? { t: "Bạn đã thử phát sóng vài tháng nhưng không đủ sống. Bạn bắt đầu tìm công việc mới.", k: 'bad' }
        : k === 'coach' ? { t: "Không có vị trí huấn luyện viên nào trống. Bạn bắt đầu tìm công việc mới.", k: 'bad' } : "Bạn rời đội và bắt đầu tìm công việc mới.";
    }
  },
  arttry: {
    ok: () => (!!artHobby() || S.major === 'art') && S.job !== 'artist',
    build: () => ({ title: "Sống bằng hội họa?",
      body: S.urban ? "Một phòng tranh nhỏ và một nhà xuất bản đã xem những bức tranh bạn vẽ từ nhỏ và ngỏ ý muốn cùng làm việc. Đây là cơ hội để biến hội họa thành công việc."
        : "Tài vẽ biển hiệu cho các cửa hàng trong làng và trang trí cho các lễ hội của bạn được nhiều người biết đến, và một xưởng ở thành phố đã mời bạn đến làm cùng. Đây là cơ hội để biến hội họa thành công việc.",
      fact: "Ở Mỹ có khoảng 55.000 người làm họa sĩ mỹ thuật và khoảng 70.000 người làm họa sĩ minh họa, họa sĩ hoạt hình, cứ khoảng 1.300 người lao động thì có 1 người, và hơn một nửa là tự làm chủ (BLS 2024)",
      choices: [{ k: 'try', label: "Biến hội họa thành công việc", sub: "thu nhập bấp bênh · nếu thành công, có thể được biết tên tuổi" }, { k: 'no', label: "Giữ hội họa làm sở thích", sub: '' }] }),
    apply: k => {
      S.flags.artTried = 1; if (k === 'no') return false;
      const h = artHobby();
      if (!chance(ART_WIN + (h ? (hLv(h) - 4) * 0.03 : 0) + (S.major === 'art' ? 0.08 : 0) + talPass('ar'))) { eff({ h: -4 }); return { t: "Bạn đã bán được vài bức tranh nhưng không thành công việc. Bạn quyết định giữ hội họa làm sở thích.", k: 'bad' }; }
      takeJob({ id: 'artist', formal: false, pct: clamp(0.15 + rnd() * 0.25, 0, 0.9) }); eff({ h: 10 }); S.yearMark = 'star';
      return { t: "Bạn đã trở thành họa sĩ! Bạn bán tranh, nhận vẽ minh họa và tranh tường, dạy trẻ em và sống bằng hội họa.", k: 'big' };
    }
  },
  apprent: {
    build: () => {
      const c = C(), w = {}; for (const id in APPR) { if (JOBS[id].only && !JOBS[id].only.split(',').some(x => x === c.p || x === c.id)) continue; if (talibanF() && !TALIBAN_F_JOBS.has(id)) continue; w[id] = APPR[id][S.sex === 'F' ? 1 : 0]; }
      if (!Object.keys(w).length) return null;
      const a = wpick(w); delete w[a]; const b = Object.keys(w).length ? wpick(w) : null; S.flags.apprOpts = [a, b].filter(Boolean);
      return { title: "Học nghề?", body: "Một nghệ nhân có tiếng trong vùng đang tìm người học việc. Hai, ba năm đầu thu nhập ít, nhưng bạn sẽ có một nghề trong tay.",
        fact: "Ở Tây Phi, khoảng 80% kỹ năng dùng trong các công việc phi chính thức được truyền lại qua việc học nghề dưới tay nghệ nhân (ILO 2008)",
        choices: S.flags.apprOpts.map(id => ({ k: id, label: L`${frSx(APPR_N[id], S.sex)} 일을 배운다`, sub: "Học việc 2–3 năm · có một nghề trong tay" })).concat([{ k: 'no', label: "Tiếp tục công việc hiện tại", sub: '' }]) };
    },
    apply: k => {
      if (k === 'no') return false;
      S.flags.skill = k; S.flags.apprUntil = S.age + ri(2, 3);
      const [lo, hi] = jobRange(k, C()); takeJob({ id: k, formal: false, pct: lo + (hi - lo) * clamp(0.05 + 0.04 * tal('hd'), 0, 0.15) }); eff({ sm: 3, h: 2 }); S.yearMark = 'job';
      return L`${frSx(APPR_N[k], S.sex)} 견습생이 되었습니다. 장인 밑에서 일을 배웁니다.`;
    }
  },
  selfcode: {
    build: () => ({ title: "Tự học lập trình?", body: "Mỗi tối sau giờ làm, bạn có thể học lập trình qua các khóa học trực tuyến. Mất một, hai năm, và không nhiều người theo được đến cùng.",
      fact: "Khoảng một phần ba lập trình viên không có bằng cử nhân, và chưa đến một nửa học lập trình lần đầu ở trường (Stack Overflow 2024)",
      choices: [{ k: 'learn', label: "Học mỗi tối", sub: "kiến thức↑ · mệt mỏi · có thể trở thành lập trình viên" }, { k: 'no', label: "Giữ cuộc sống hiện tại", sub: '' }] }),
    apply: k => {
      if (k === 'no') return false;
      const cost = incomeAt(C(), 0.5) * 0.04; S.money -= cost;
      S.flags.codeAt = S.age + ri(1, 2); S.flags.codeOK = chance(clamp(0.25 + (S.st.sm - 50) / 100, 0.15, 0.5)); eff({ sm: 4, h: -2, hl: -1 });
      return "Bạn bắt đầu học lập trình mỗi tối sau giờ làm.";
    }
  },
  homecoming: {
    ok: () => !!S.mig && S.cur !== S.born && !S.refugee && S.born !== 'PRK' && !rohG(),
    build: p => {
      const yrs = S.age - (S.migY || S.age), old = S.retired || S.age >= retireAge(C());
      return { title: old ? L`고향 ${B().ko}에서 노년을 보낼까?` : L`고향 ${ro(B().ko)} 돌아갈까?`, body: (p && p.look ? L`${C().ko}에서 산 지 ${yrs}년이 되었습니다. 한 해 동안 고향으로 돌아갈 길을 알아봤습니다. 일자리와 집, 아이들 학교까지 하나씩 따져 보았습니다.` : L`${C().ko}에서 산 지 ${yrs}년이 되었습니다. ${old ? "Giờ đã thôi làm việc, bạn cứ nhớ mãi tiếng nói và món ăn quê nhà." : famApart() ? "Hình ảnh gia đình đang chờ ở quê cứ hiện lên trước mắt bạn." : famCame() ? "Mỗi lần nghe tin họ hàng và bạn bè còn ở quê, lòng bạn lại xao động." : "Mỗi lần nghe tin gia đình và bạn bè ở quê, lòng bạn lại xao động."}`) + (ptForeign() ? ' ' + L`배우자 ${callName(S.fam.partner.name)}에게 ${B().ko}는 낯선 나라입니다. 함께 갈지는 둘이 정해야 합니다.` : ''),
        fact: "20–50% người di cư trở về quê hoặc chuyển sang nước khác trong vòng 5 năm (OECD International Migration Outlook)",
        choices: [{ k: 'go', label: "Về quê", sub: "Quan hệ↑ Hạnh phúc↑ · tìm việc lại ở quê" + payHome(old) + (homeLetOK(S.cur) ? ' · ' + "bán căn nhà ở đây" : '') },
          homeLetOK(S.cur) ? { k: 'gok', label: "Cho thuê căn nhà ở đây rồi về quê", sub: "giao việc quản lý cho bên môi giới, nhận tiền thuê hằng tháng" } : null, { k: 'stay', label: L`${C().ko}에 남는다`, sub: "Tiếp tục cuộc sống đã gây dựng" }].filter(Boolean) };
    },
    apply: k => { if (k === 'stay') { S.flags.homeSt = { a: S.age, o: homeOld() ? 1 : 0, w: isWorking() ? 1 : 0, p: famPt() ? 1 : 0 }; return false; } return goHome(false, k === 'gok'); }
  },
  nomad: {
    ok: () => !!NOMAD_JOBS[S.job] && !S.nomad && !S.office,
    build: () => ({ title: "Lên đường chỉ với một chiếc máy tính xách tay?", body: L`${shortJob(S.job)} 일은 어디서든 할 수 있습니다. 회사와 원격 근무를 합의하면 몇 년쯤 여러 나라를 옮겨 다니며 살 수 있습니다.${S.fam.married ? " Bạn đời của bạn cũng muốn đi cùng." : ''}`,
      fact: "Khoảng 11% người lao động Mỹ cho biết họ là dân du mục kỹ thuật số. Trung bình họ ở mỗi nơi 5–6 tuần (MBO Partners 2024)",
      choices: [{ k: 'go', label: "Trở thành dân du mục kỹ thuật số", sub: "Hạnh phúc↑ Quan hệ↓ · Vài năm sau trở về" }, { k: 'stay', label: "Sống như hiện tại", sub: '' }] }),
    apply: k => { if (k === 'stay') return false; S.nomad = { y: 0, n: ri(1, 4) }; S.flags.nomadEver = 1; eff({ h: 6 }); S.yearMark = 'move'; return L`노트북 하나 들고 떠나기로 했습니다. 디지털 노마드 생활을 시작합니다.${S.fam.married ? " Bạn đời đi cùng bạn." : ''}`; }
  },
  runlocal: {
    ok: () => citizen() && !S.office,
    build: p => { const where = S.urban && S.city ? S.city : "địa phương bạn";
      if (oneParty(C())) return { title: "Ứng cử đại biểu hội đồng nhân dân địa phương?", body: p && p.prep ? L`한 해 동안 동네 일에 힘쓰며 당 조직과 이웃들을 만났습니다. ${where} 인민대표 후보 추천이 다가옵니다.` : L`동네 일에 오래 마음을 써 온 걸 당 조직과 이웃들이 압니다. ${where} 인민대표 후보로 추천하겠다고 합니다.`,
        fact: "Ngay cả trong chế độ một đảng, đại biểu địa phương vẫn do cử tri bỏ phiếu bầu ra, nhưng ứng viên thường phải qua sự thẩm định và giới thiệu của đảng và các tổ chức liên quan (Freedom House)",
        choices: [{ k: 'run', label: "Ra ứng cử", sub: "4 năm nếu trúng cử · song song với công việc chính" }, { k: 'no', label: p && p.prep ? "Lần này không ra" : "Cảm ơn nhưng xin từ chối", sub: '' }] };
      return { title: "Ra tranh cử hội đồng địa phương?", body: p && p.prep ? L`한 해 동안 출마를 준비하며 이웃들을 만났습니다. ${where} 의원 선거의 후보 등록이 다가옵니다.` : L`동네 일에 오래 마음을 써 온 걸 이웃들이 압니다. ${where} 의원 선거에 나가 보라는 권유를 받았습니다.`,
        fact: "Trên thế giới có khoảng 45.000 đại biểu quốc hội, và số đại biểu hội đồng địa phương còn nhiều hơn thế rất nhiều. Phần lớn vừa làm đại biểu vừa giữ công việc chính (IPU 2026)",
        choices: [{ k: 'run', label: "Ra tranh cử", sub: "Nhiệm kỳ 4 năm nếu đắc cử · tốn chi phí tranh cử" }, { k: 'no', label: p && p.prep ? "Lần này không ra" : "Cảm ơn nhưng xin từ chối", sub: '' }] }; },
    apply: (k, p) => {
      if (k === 'no') return false;
      const c = C(), cost = incomeAt(c, 0.5) * 0.15, prep = !!(p && p.prep); S.money -= cost; book("Chi phí tranh cử", -cost);
      if (!chance(prep ? clamp(0.25 + (S.st.so - 40) / 200 + talPass('wd') * 0.6, 0.12, 0.5) * (oneParty(c) ? (partyMem() ? 0.8 : 0.3) : 1) : clamp(0.35 + (S.st.so - 40) / 200 + talPass('wd') * 0.6, 0.2, 0.6))) { eff({ h: -4 }); return { t: oneParty(c) ? L`후보 추천을 받지 못했습니다. (준비 비용 −${wonStr(cost)})` : L`선거에서 아쉽게 떨어졌습니다. (선거 비용 −${wonStr(cost)})`, k: 'bad' }; }
      S.office = { lvl: 1, since: S.age, until: S.age + 4 }; S.flags.council = 1; eff({ h: 8, so: 6 }); S.yearMark = 'job';
      if (oneParty(c)) return L`지역 인민대표로 뽑혔습니다. 일을 하면서 대표 활동을 겸합니다. (준비 비용 −${wonStr(cost)})`;
      return L`지역 의회 의원에 당선되었습니다. 일을 하면서 의정 활동을 겸합니다. (선거 비용 −${wonStr(cost)})`;
    }
  },
  runnational: {
    ok: () => citizen() && !inOffice(),
    build: p => { const c = C();
      return { title: "Ứng cử đại biểu quốc hội?", body: p && p.prep ? "Sau một năm chuẩn bị, bạn đã được đảng đề cử làm ứng viên đại biểu quốc hội." : L`${S.office ? "Công việc ở hội đồng địa phương đã giúp tên tuổi bạn được nhiều người biết đến. " : L`${shortJob(S.job)}로 쌓은 이름이 알려졌습니다. `}당에서 국회의원 후보로 나와 달라고 합니다.`,
        fact: L`${c.ko} 의회는 약 ${parlSeats(c)}석 규모입니다 (인구로 본 추정). 전 세계 국회의원은 약 4만 5천 명입니다 (IPU 2026)`,
        choices: [{ k: 'run', label: "Ra tranh cử", sub: L`당선 가능성 ${oddsWord(winNational(c))} · 비용이 큼` }, { k: 'no', label: "Giữ vị trí hiện tại", sub: '' }] }; },
    apply: k => {
      if (k === 'no') return false;
      const c = C(), cost = incomeAt(c, 0.5) * 0.5; S.money -= cost; book("Chi phí tranh cử", -cost);
      if (!chance(winNational(c))) { eff({ h: -5 }); return { t: L`국회의원 선거에서 떨어졌습니다. (선거 비용 −${wonStr(cost)})`, k: 'bad' }; }
      S.office = { lvl: 2, since: S.age, until: S.age + 4 }; setRareJob('mp'); eff({ h: 10, so: 4 }); S.yearMark = 'job';
      return { t: L`국회의원에 당선되었습니다! ${c.ko} 의회 약 ${parlSeats(c)}석 가운데 한 자리입니다. (선거 비용 −${wonStr(cost)})`, k: 'big', f: L`${c.ko}에서 태어난 사람이 국회의원이 될 확률은 대략 ${oddsStr(mpOdds(c))}입니다 (추정)` };
    }
  },
  runleader: {
    ok: () => citizen() && !!S.office && S.office.lvl === 2 && S.job === 'mp',
    build: p => { const c = C(), t = leaderTitle(c);
      return { title: L`${t}에 도전할까?`, body: p && p.prep ? L`한 해 동안 준비한 끝에 당의 다음 ${t} 후보로 뽑혔습니다.` : L`오랜 의정 활동으로 신망을 쌓았습니다. 동료들이 당신을 다음 ${t} 후보로 밀고 있습니다.`,
        fact: L`${c.ko}에서 태어난 사람이 ${iga(t)} 될 확률은 대략 ${oddsStr(leaderOdds(c))}입니다 (해마다 태어나는 아기와 지도자가 바뀌는 빈도로 본 추정)`,
        choices: [{ k: 'run', label: "Thử sức", sub: "Vị trí lãnh đạo đất nước · Sức khỏe↓" }, { k: 'no', label: "Tiếp tục làm việc ở vị trí hiện tại", sub: '' }] }; },
    apply: k => {
      if (k === 'no') return false;
      const c = C(), t = leaderTitle(c);
      if (!chance(winLeader(c))) { eff({ h: -6 }); return { t: L`${t} 자리를 두고 겨뤘지만 졌습니다.`, k: 'bad' }; }
      S.office = { lvl: 3, since: S.age, until: S.age + 5 }; S.flags.leaderTitle = t; setRareJob('leader'); eff({ h: 12, hl: -3 }); S.yearMark = 'job';
      return { t: L`${c.ko}의 ${iga(t)} 되었습니다. 약 ${popStr(c)}의 삶을 책임지는 자리입니다.`, k: 'big', f: L`${c.ko}에서 태어난 사람이 ${iga(t)} 될 확률은 대략 ${oddsStr(leaderOdds(c))}입니다 (추정)` };
    }
  },
  astro: {
    ok: () => !RARE_JOBS.includes(S.job) && isWorking(),
    build: () => { const c = C();
      return { title: "Nộp đơn tuyển chọn phi hành gia?", body: L`${ASTRO_AGENCY[c.id] || "Một chương trình vũ trụ quốc tế"}에서 새 우주비행사를 뽑는다는 공고가 났습니다. 학위와 경력, 건강 모두 지원 자격이 됩니다.`,
        fact: "Năm 2021, NASA đã chọn 10 người trong số hơn 12.000 người nộp đơn",
        choices: [{ k: 'apply', label: "Ứng tuyển", sub: "Khả năng được chọn rất thấp" }, { k: 'no', label: "Không nộp đơn", sub: '' }] }; },
    apply: k => {
      if (k === 'no') return false;
      const p = 10 / 12000 * (S.st.hl > 85 ? 1.5 : 1) * (S.edu >= 5 ? 1.3 : 1) * (S.st.sm > 70 ? 1.3 : 1);
      if (!chance(p)) return { t: "Bạn đã nộp đơn tuyển chọn phi hành gia nhưng không được chọn. Đó là kỳ tuyển chọn mà cứ 1.000 người nộp đơn thì chưa tới 1 người được chọn.", k: 'ev' };
      S.astro = { train: 2, flights: 0 }; setRareJob('astro'); eff({ h: 15 }); S.yearMark = 'job';
      return { t: "Bạn đã được chọn làm phi hành gia! Bạn sẽ được huấn luyện trong 2 năm tới.", k: 'big', f: "Đến nay mới có khoảng 780 người từng bay vào vũ trụ" };
    }
  },
  ordain: {
    build: () => ({ title: "Xuất gia một thời gian trước khi cưới?", body: "Bố mẹ mong bạn sẽ làm nhà sư một thời gian để tích công đức. Thường người ta ở chùa từ vài tuần đến khoảng ba tháng.",
      fact: "Ở Thái Lan, Lào và Campuchia có truyền thống thanh niên xuất gia một thời gian ngắn trước khi kết hôn để hồi hướng công đức cho bố mẹ",
      choices: [{ k: 'go', label: "Xuất gia trong ba tháng", sub: "Quan hệ↑ Hạnh phúc↑ · Không có thu nhập trong thời gian đó" }, { k: 'no', label: "Không làm vậy", sub: '' }] }),
    apply: k => { if (k === 'no') return false; S.flags.ordained = 1; const lost = Math.max(0, S.income) * 0.25; S.money -= lost; book("Thu nhập mất đi khi xuất gia", -lost); eff({ h: 5, so: 6, sm: 2 }); return "Bạn cạo đầu và sống ở chùa như một nhà sư trong ba tháng. Bố mẹ vô cùng vui mừng."; }
  },
  farmback: {
    build: () => {
      const c = C(); const home = homeVillage();
      return { title: home ? "Trở về quê?" : "Về nông thôn sống?", body: L`도시의 일에 지쳤습니다. ${home ? "trở về ngôi làng nơi bạn lớn lên và" : landState() ? "thuê một mảnh đất ở nông thôn và" : "kiếm một mảnh đất ở nông thôn và"} 농사를 지으며 살 수도 있습니다.`, fact: L`${c.ko} 노동자의 약 ${c.agr}%가 농업에 종사합니다 (ILO)`,
        choices: [{ k: 'go', label: "Về quê làm nông", sub: "Thu nhập↓ Sức khỏe↑ Hạnh phúc↑" }, { k: 'stay', label: "Tiếp tục công việc hiện tại", sub: '' }] };
    },
    apply: k => {
      if (k === 'stay') return false;
      const id = S.money > incomeAt(C(), 0.5) * 2 ? 'agbiz' : 'farm';
      takeJob({ id, formal: false, pct: id === 'agbiz' ? 0.55 : 0.25 });
      S.urban = false; S.city = null; S.stats.moves++; eff({ h: 6, hl: 4, so: -3 }); S.yearMark = 'move';
      return id === 'agbiz' ? "Bạn gác lại cuộc sống thành phố và lập một trang trại nhỏ ở nông thôn." : L`${homeVillage() ? "về làng quê cũ" : "về nông thôn"} 내려가 농사를 짓기 시작했습니다.`;
    }
  },
  disaster: {
    build: p => {
      const n = { F: "lũ lụt", Q: "động đất", S: C().p === 'eap' || C().id === 'JPN' || C().id === 'KOR' ? "bão" : C().p === 'sa' || ['MOZ', 'MDG', 'MWI'].includes(C().id) ? "bão xoáy" : "bão cuồng phong", D: "hạn hán", E: "khủng hoảng kinh tế khiến giá cả tăng vọt", H: "đợt nắng nóng khắc nghiệt" }[p.kind];
      S.flags.dis = n; S.flags.disK = p.kind;
      return { title: p.kind === 'E' ? "Khủng hoảng kinh tế ập đến, giá cả tăng vọt" : L`${iga(n)} 덮쳤습니다`, body: p.kind === 'E' ? "Đồng tiền mất giá mạnh và giá cả leo thang." + ' ' + "Tiền gửi ngân hàng không theo kịp giá cả tăng." : p.kind === 'D' ? "Trời không mưa, mùa màng thất bát." : "Nhà cửa và làng xóm của bạn bị thiệt hại nặng.",
        fact: p.kind === 'E' ? ECO_FACT : "Năm 2023, thiên tai khiến khoảng 26,4 triệu người trên thế giới phải rời bỏ nhà cửa, sơ tán ngay trong nước mình (IDMC 2024)",
        choices: p.kind === 'E' ? [{ k: 'dollar', label: "Đổi tiền tiết kiệm sang đô la hoặc vàng", sub: "Giữ được giá trị khi giá cả lại tăng · năm bình thường lãi ít hơn một chút" }, { k: 'save', label: "Để tiền trong ngân hàng và thắt lưng buộc bụng", sub: "Vẫn hưởng lãi tiền gửi · mất giá theo mức tăng giá năm nay" }] : [{ k: 'rebuild', label: "Vay tiền để gây dựng lại", sub: "Tài sản↓ Phục hồi nhanh" }, { k: 'wait', label: "Chờ cứu trợ", sub: "Sức khỏe·Hạnh phúc↓" }] };
    },
    apply: (k, p) => {
      if (p.kind === 'Q' && chance(0.003)) { die('inj', "động đất"); return false; }
      if (p.kind === 'F' && chance(0.0015)) { die('drown', "lũ lụt"); return false; }
      if (p.kind === 'E' && (k === 'dollar' || k === 'save')) {
        const m = Math.max(0, S.money), L0 = S.flags.ecoL != null ? S.flags.ecoL : 0.17; S.flags.ecoL = null; eff({ h: -4 });
        if (k === 'dollar') { const x = m * (L0 * 0.5 + 0.03); S.money -= x; book("Đồng tiền mất giá", -x); S.flags.fx = S.age;
          return L`서둘러 모은 돈을 달러와 금으로 바꿨습니다. 바꾸기 전에 떨어진 만큼은 잃었지만, 남은 돈은 더 줄지 않았습니다. (−${wonStr(x)})`; }
        const x = m * L0; S.money -= x; book("Đồng tiền mất giá", -x);
        return { t: L`허리띠를 졸라매고 버텼습니다. 은행에 둔 돈은 오른 물가만큼 가치가 줄었습니다. (−${wonStr(x)})`, k: 'bad' };
      }
      if (k === 'dollar') { if (chance(0.6)) { S.money *= 0.95; return "Bạn đã giữ được tài sản."; } S.money *= 0.6; return { t: "Bạn chọn sai thời điểm và mất một phần lớn tài sản.", k: 'bad' }; }
      if (k === 'save') { const m0 = S.money; eff({ h: -6 }); if (m0 <= 0) return { t: "Bạn thắt lưng buộc bụng mà vượt qua. Không có tiền dành dụm, bạn chống chọi với giá cả leo thang từng ngày.", k: 'bad' }; S.money *= 0.75; return { t: L`허리띠를 졸라매고 버텼습니다. 물가가 올라 ${L`모아 둔 돈으로 살 수 있는 것이 4분의 1(${wonStr(m0 - S.money)})만큼 줄었습니다`}.`, k: 'bad' }; }
      if (k === 'rebuild') { const x = incomeAt(C(), 0.5) * 0.4; S.money -= x; if (S.house) S.house *= 0.85; eff({ h: -4 }); return { t: L`빚을 내 무너진 집과 생계를 다시 일으켰습니다. (−${wonStr(x)}${S.house ? ", giá nhà cũng giảm 15%" : ''})`, k: 'bad' }; }
      eff({ h: -8, hl: -6 }); if (S.house) { S.house *= 0.7; return { t: "Chờ cứu trợ khiến bạn kiệt sức cả thân lẫn tâm. Ngôi nhà không được sửa chữa mất 30% giá trị.", k: 'bad' }; } return { t: "Chờ cứu trợ khiến bạn kiệt sức cả thân lẫn tâm.", k: 'bad' };
    }
  },
  mandret: {
    ok: p => !S.retired && (p && p.end ? isWorking() && S.job === S.flags.rehireJob : employee()),
    build: p => {
      const c = C(), pen = pensionAmount(), jn = frSx(JOBS[S.job].n.replace(/ \(.*\)$|（.*）$/, ''), S.sex), pub = ['civil', 'police', 'soldier', 'teacher'].includes(S.job);
      const inc = S.income * 0.65; S.flags.rehireInc = inc;
      const fact = c.id === 'KOR' ? "Từ năm 2016, luật Hàn Quốc quy định tuổi nghỉ hưu bắt buộc từ 60 trở lên. Khoảng 37% người trên 65 tuổi ở Hàn Quốc vẫn đi làm, cao nhất trong OECD, nhưng phần lớn là việc giản đơn, thu nhập thấp (Bộ Việc làm và Lao động Hàn Quốc, Statistics Korea)"
        : c.id === 'JPN' ? "Luật Nhật Bản buộc doanh nghiệp tạo cách để người lao động làm việc đến 65 tuổi (như tuyển dụng lại). Người được tuyển dụng lại thường nhận 60–70% mức lương cũ (Bộ Y tế, Lao động và Phúc lợi Nhật Bản; JILPT)"
        : c.id === 'CHN' ? "Tuổi nghỉ hưu ở Trung Quốc từ lâu là 60 với nam và 50–55 với nữ; từ năm 2025, tuổi này đang được nâng dần trong vài năm (Đại hội Đại biểu Nhân dân Toàn quốc)" : null;
      const ch = [{ k: 'retire', label: p.end ? "Gác lại công việc và nghỉ hưu" : "Nghỉ hưu đúng tuổi quy định", sub: pen > 0 ? L`연금 한국 체감 월 ${wonStr(pen / 12)}` : "Không có lương hưu" }];
      if (!p.end && !pub) ch.push({ k: 'rehire', label: "Được tuyển lại theo hợp đồng và làm tiếp công việc cũ", sub: L`한국 체감 월 ${wonStr(inc / 12)} · 5년 동안` });
      const mp = S.job === 'soldier' ? milPenV() : 0;
      const op = !mp && pen > 0 && S.age >= retireAge(c) && (c.p === 'hi' || c.p === 'eca' || S.formalY >= 10);
      ch.push({ k: 'other', label: "Tìm việc khác", sub: mp > 0 ? L`군인연금 한국 체감 월 ${wonStr(mp / 12)}을 받으면서 · 벌이는 줄어듭니다` : op ? L`연금 한국 체감 월 ${wonStr(pen / 12)}을 받으면서 · 벌이는 줄어듭니다` : "Chủ yếu là việc bảo vệ, dọn dẹp, chăm sóc hay lái xe, thu nhập thấp hơn" });
      return { title: p.end ? "Hợp đồng đã kết thúc" : "Bạn đã đến tuổi nghỉ hưu", fact, choices: ch,
        body: p.end ? L`${S.age}세. 정년 뒤 다시 고용되어 일하던 계약 기간이 끝났습니다.` : L`${S.age}세. ${jn} 일을 해 온 직장에서 정년퇴직할 나이가 되었습니다.${pub ? " Trong khu vực công, không ai được ở lại vị trí cũ sau tuổi nghỉ hưu." : ''}` };
    },
    apply: (k, p) => {
      if (S.flags.mandAt == null) { S.flags.mandAt = S.age; S.flags.careerInc = Math.max(S.flags.careerInc || 0, S.income); if (S.flags.careerPct == null) S.flags.careerPct = S.pct; }
      if (k === 'retire') { S.pension = pensionAmount(); S.retired = true; S.flags.lastJob = S.job; S.job = 'retired'; eff({ h: 4, hl: 3 }); S.yearMark = 'job'; return p.end ? "Bạn gác lại công việc và nghỉ hưu." : "Bạn nghỉ hưu đúng tuổi quy định. Đồng nghiệp tổ chức cho bạn một buổi chia tay nhỏ."; }
      if (k === 'rehire') {
        S.income = S.flags.rehireInc; S.flags.rehireEnd = S.age + 5; S.flags.rehireJob = S.job; eff({ h: -1 });
        return "Sau tuổi nghỉ hưu, bạn được tuyển lại theo hợp đồng. Công việc gần như cũ, nhưng lương thì ít đi.";
      }
      S.flags.lastJob = S.job; S.flags.oldJob = S.job; S.job = 'seeking'; S.flags.seekY = 0; S.flags.oldLook = S.age; S.income = 0; eff({ h: -2 });
      return p.end ? "Hợp đồng kết thúc, bạn đi tìm việc khác." : "Bạn nghỉ hưu đúng tuổi quy định rồi đi tìm việc khác.";
    }
  },
  retire: {
    ok: () => isWorking() && !S.retired && !inOffice(),
    build: () => {
      const c = C(), pen = pensionAmount(), m = incomeAt(c, 0.5); S.flags.retPen = pen;
      const ak = S.fam.kids.filter(k => k.alive && S.age - k.bornAt >= 22 && !skApart(k) && !k.exOf).length;
      const kids = kidHelpAmt(c, true) + (pen > 0 ? 0 : Math.min(2, ak) * m * 0.12 * (S.st.so > 40 ? 1 : 0.5)), need = m * 0.3 * (S.fam.married ? 0.6 : 1) * oldShare(), net = need - pen - kids, b = [];
      b.push(pen > 0 ? L`은퇴하면 연금으로 연 ${usdStr(pen) + ' PPP'} (한국 체감 월 ${wonStr(pen / 12)})을 받습니다.` : "Bạn không có lương hưu.");
      if (kids > m * 0.01) b.push(L`다 자란 자녀들이 보내 줄 돈은 한국 체감 월 ${wonStr(kids / 12)} 정도입니다.`);
      if (net <= 0) b.push(pen > 0 && kids > m * 0.01 ? "Với lương hưu và tiền các con gửi, nếu chi tiêu dè sẻn thì bạn vẫn đủ sống." : pen > 0 ? "Với lương hưu, nếu chi tiêu dè sẻn thì bạn vẫn đủ sống." : "Với tiền các con gửi, nếu chi tiêu dè sẻn thì bạn vẫn đủ sống.");
      else if (S.money > 0) { const y = Math.floor(S.money / net); b.push(y >= 30 ? L`모아 둔 돈은 ${savedAmt()}. 남은 생활비를 꾸리기에 넉넉합니다.` : y >= 1 ? L`모아 둔 돈은 ${savedAmt()}. 아껴 쓰면 약 ${y}년을 지낼 수 있습니다.` : L`모아 둔 돈은 ${savedAmt()}. 한 해를 버티기에도 모자랍니다.`); }
      else b.push("Bạn không có tiền dành dụm, nên nếu nghỉ làm sẽ không đủ sống.");
      if (S.st.hl < 45) b.push("Cơ thể không còn được như xưa.");
      const clg = S.job === 'clergy' && clergyOld();
      const ch = [clg ? { k: 'retire', label: "Rời chức vụ đang đảm nhận", sub: "Vẫn phụng sự trong sức mình · thu nhập↓" } : { k: 'retire', label: "Nghỉ hưu", sub: "Sức khỏe↑ Thu nhập↓" }];
      if (S.flags.lessAt == null && !inOffice() && !clg) ch.push({ k: 'less', label: "Giảm việc, chuyển sang làm bán thời gian", sub: "Thu nhập khoảng một nửa · đỡ mệt hơn" });
      ch.push({ k: 'work', label: clg ? "Tiếp tục phụng sự ở vị trí hiện tại" : S.flags.lessAt != null ? "Tiếp tục làm bán thời gian" : "Tiếp tục làm việc", sub: "Giữ nguyên thu nhập" });
      if (S.job === 'owner' && !S.flags.bizScale && !S.flags.bizL && !(BIZ_K[S.flags.bizK] && BIZ_K[S.flags.bizK].pro && S.flags.bizK !== 'soft')) ch.push({ k: 'keepbiz', label: "Giao việc điều hành, chỉ giữ cổ phần", sub: aiShop() ? "AI lo đơn hàng và hàng tồn kho · cổ tức hằng năm · có thể sa sút" : L`해마다 배당 · 맡긴 ${iga(bizWhat())} 기울 수도 있음` });
      if (clg) return { title: "Rời chức vụ đang đảm nhận?", body: b.join(' '), choices: ch, fact: S.flags.voc.k === 'cath' ? "Linh mục chánh xứ và giám mục Công giáo đệ đơn từ nhiệm khi tròn 75 tuổi (Giáo luật điều 538, 401), và phần lớn tiếp tục làm linh mục hưu, dâng Thánh lễ và giúp việc mục vụ trong sức mình" : S.flags.voc.k === 'nun' || S.flags.voc.k === 'bud' ? "Người tu hành dù tuổi cao vẫn sống trong cộng đoàn, tiếp tục cầu nguyện và tu tập" : null };
      return { title: "Đã đến lúc nghỉ hưu?", body: b.join(' '), fact: c.p === 'hi' || c.p === 'eca' ? "Phần lớn người cao tuổi ở các nước thu nhập cao nhận lương hưu công (ILO)" : "Trên thế giới, khoảng 77% người ở độ tuổi nghỉ hưu nhận lương hưu, nhưng ở các nước thu nhập thấp chỉ khoảng 23% (ILO 2021)", choices: ch };
    },
    apply: k => {
      if (k === 'work') return false;
      if (k === 'less') { S.flags.lessAt = S.age; S.flags.careerInc = Math.max(S.flags.careerInc || 0, S.income); if (S.flags.careerPct == null) S.flags.careerPct = S.pct; eff({ h: 3, hl: 2 }); return "Bạn giảm việc, chuyển sang làm bán thời gian. Thu nhập ít đi, nhưng buổi tối đã là của bạn."; }
      if (k === 'keepbiz' && S.job === 'owner') { const v = bizVal(), w = bizWhat(); S.flags.bizKeep = { v, w, at: S.age }; book("Cổ phần doanh nghiệp", v); S.flags.bizKx = S.flags.bizK; S.flags.bizK = null; S.flags.bizBig = 0; S.flags.bizL = 0; S.flags.bizPt = 0; S.flags.bizStaff = 0;
        S.pension = S.flags.retPen != null ? S.flags.retPen : pensionAmount(); S.flags.retPen = null; S.retired = true; S.job = 'retired'; eff({ h: 5, hl: 3 }); S.yearMark = 'job';
        return L`은퇴했습니다. ${eul(w)} 믿을 만한 사람에게 맡기고, 지분만 지니기로 했습니다.`; }
      const clg = S.job === 'clergy' && clergyOld();
      const bx = S.job === 'owner' ? bizExit() : workHandDown(); S.pension = S.flags.retPen != null ? S.flags.retPen : pensionAmount(); S.flags.retPen = null; S.retired = true; S.job = 'retired'; eff({ h: 5, hl: 3 }); S.yearMark = 'job'; return clg ? clergyRetLine() : "Bạn đã nghỉ hưu." + (bx ? ' ' + bx : '');
    }
  },
  defect: {
    ok: () => S.cur === 'PRK' && S.job !== 'prison',
    build: p => {
      const again = !!S.flags.defCaught, fam = (S.fam.married && S.fam.partner && S.fam.partner.alive) || S.fam.kids.some(k => k.alive && !k.grown);
      const why = p && p.broker ? "Người môi giới mà bạn dò hỏi mãi mới liên lạc được đã định ngày. Họ nói tiền đưa cho lính biên phòng cũng đã lo xong."
        : again ? "Được thả rồi mà bạn vẫn không quên được bờ sông bên kia. Một người bạn quen trong thời gian bị giam ngỏ ý giúp bạn vượt sông lần nữa."
        : pick(["Một người họ hàng xa sống bên kia sông Đồ Môn, ở Trung Quốc, đã cử người đến. Họ ngỏ ý giúp bạn vượt sông.", "Bạn được giới thiệu một người môi giới nói rằng có thể vượt sông nếu đút tiền cho lính biên phòng.", "Một người hàng xóm đã đi trước ngỏ ý gửi tiền từ Hàn Quốc về để thuê người môi giới cho bạn."]);
      return { title: again ? "Thử vượt biên giới lần nữa?" : "Thử rời khỏi Triều Tiên?",
        body: L`${why} ${fam ? "Bạn sẽ phải đưa cả gia đình đi cùng. " : ''}붙잡히면 노동단련대나 교화소로 끌려가고, 남은 가족은 감시와 처벌을 받을 수 있습니다.`,
        fact: "Từ năm 1998, khoảng 34.000 người rời Triều Tiên đã đến Hàn Quốc. Cứ 10 người thì 7 là phụ nữ, và cứ 4 người thì 3 đến từ Bắc Hamgyong và Ryanggang, hai tỉnh giáp Trung Quốc (Bộ Thống nhất Hàn Quốc)",
        choices: [{ k: 'go', label: "Vượt sông", sub: "Rất nguy hiểm · phải sống lẩn trốn ở Trung Quốc" }, { k: 'stay', label: "Ở lại", sub: '' }] };
    },
    apply: k => {
      if (k === 'stay') return false;
      const r = rnd();
      if (r < 0.03) { die('hom', "bị lính biên phòng bắn"); return false; }
      if (r < 0.15) { nkDetain(1, 1); return { t: "Bạn bị bắt trước khi kịp vượt sông và bị đưa vào trại rèn luyện lao động.", k: 'bad' }; }
      crossChina();
      return { t: "Trong đêm, bạn vượt sông Đồ Môn sang Trung Quốc. Không có giấy tờ, bạn phải sống lẩn trốn.", k: 'big' };
    }
  },
  defroute: {
    ok: () => !!S.flags.hideCN && S.cur === 'CHN' && S.job !== 'prison',
    build: () => {
      const y = Math.max(1, S.age - S.flags.hideCN.at);
      return { title: "Đường đến Hàn Quốc", body: L`중국에서 숨어 지낸 지 ${y}년이 되었습니다. 브로커가 라오스와 태국을 거쳐 한국 대사관까지 데려다주겠다고 합니다. 비용은 한국에 도착해 받는 정착금으로 갚기로 했습니다.`,
        fact: "Ngày nay, phần lớn người rời Triều Tiên đến được Hàn Quốc sau nhiều năm ở Trung Quốc hoặc một nước thứ ba (Bộ Thống nhất Hàn Quốc, 2026)",
        choices: [{ k: 'go', label: "Lên đường sang Hàn Quốc", sub: "Nếu bị bắt sẽ bị cưỡng chế đưa về Triều Tiên" }, { k: 'stay', label: "Ở lại Trung Quốc", sub: "Tiếp tục sống lẩn trốn" }] };
    },
    apply: k => {
      const h = S.flags.hideCN;
      if (k === 'stay') {
        h.asks = (h.asks || 0) + 1;
        if (h.asks >= 3) { h.stay = 1; S.refugee = false; return "Bạn quyết định ở lại Trung Quốc. Dần dần, bạn quen với cuộc sống lẩn trốn."; }
        h.n = (h.y || 0) + ri(2, 4); return false;
      }
      if (chance(0.08)) { sentBack(); return false; }
      return arriveSK();
    }
  },
  oldhome: {
    ok: () => S.age >= 70 && S.job !== 'prison',
    build: () => {
      const c = C(), kid = oldKid(), care = careHomeOK(c), cost = careHomeCost(c), careOwn = homeLetOK(S.cur);
      S.flags.oldKidI = kid ? S.fam.kids.indexOf(kid) : -1;
      const body = (S.st.hl < 45 ? "Cơ thể không còn như xưa, tự mình lo việc nhà đã trở nên khó khăn." : "Những ngày sống một mình đã kéo dài.") + (kid ? ' ' + L`${iga(callName(kid.name))} 함께 살자고 합니다.` : '');
      return { title: "Về già sẽ sống ở đâu?", body, fact: oldHomeFact(c),
        choices: [kid && { k: 'kid', label: L`${wa(callName(kid.name))} 함께 산다`, sub: "Quan hệ↑ Chi phí sinh hoạt↓" },
          care && !careOwn && { k: 'care', label: "Vào viện dưỡng lão", sub: L`돌봄을 받아요 · 해마다 약 ${wonStr(cost)}` },
          care && careOwn && { k: 'care', label: "Vào viện dưỡng lão và bán nhà", sub: L`해마다 약 ${wonStr(cost)} · 집 판 돈 약 ${wonStr(S.house * 0.94)}` },
          care && careOwn && { k: 'carelet', label: "Vào viện dưỡng lão và cho thuê nhà", sub: L`해마다 약 ${wonStr(cost)} · 월세가 보탬이 돼요` },
          { k: 'own', label: "Ở lại nhà mình", sub: c.p === 'hi' ? "Có người chăm sóc đến tận nhà" : "Nhờ hàng xóm và họ hàng giúp đỡ" }].filter(Boolean) };
    },
    apply: k => {
      const c = C();
      if (k === 'kid') {
        const kid = S.fam.kids[S.flags.oldKidI]; if (!kid || !kid.alive) return false;
        kid.withMe = 1; kid.wmAt = S.age; kid.bd = (kid.bd || 0) + 4; S.flags.oldHome = 'kid'; eff({ h: 4, so: 6 });
        return L`${wa(callName(kid.name))} 한집에 살게 되었습니다. 저녁마다 식탁이 북적입니다.`;
      }
      if (k === 'care' || k === 'carelet') {
        S.flags.oldHome = 'care'; S.flags.careHomeAt = S.age; eff({ hl: 3, h: -3, so: -1 });
        let t = '';
        if (S.house > 0 && S.owns.house) {
          if (k === 'carelet' && homeLetOK(S.cur)) { rentals().push({ v: S.house, p: S.house, at: S.owns.house, c: S.cur, k: 'b', own: 1, paid: S.flags.hPaid || 0 }); S.house = 0; S.flags.hPaid = 0; delete S.owns.house; t = ' ' + "Bạn không bán ngôi nhà mình từng sống mà cho thuê. Tiền thuê nhà phụ thêm vào chi phí viện dưỡng lão."; }
          else if (k === 'care') { const v = S.house * 0.94, pl = paidLine(); S.money += v; S.house = 0; S.flags.hPaid = 0; delete S.owns.house; t = ' ' + L`살던 집은 팔아 요양원비에 보태기로 했습니다. (+${wonStr(v)})` + pl; }
        }
        return "Bạn vào viện dưỡng lão. Ban đầu thấy lạ lẫm, nhưng ở đây có người lo cho bạn từng bữa ăn, từng liều thuốc." + t;
      }
      S.flags.oldHome = 'own'; eff({ h: 1 });
      return c.p === 'hi' ? "Bạn quyết định ở lại nhà mình. Mỗi tuần, người chăm sóc tại nhà ghé qua vài lần." : "Bạn quyết định ở lại nhà mình. Hàng xóm và họ hàng thường ghé qua trông nom.";
    }
  },
  care: {
    build: () => { const who = S.fam.mom.alive && S.fam.mom.age >= 75 ? "mẹ" : "bố"; S.flags.careWho = who;
      const far = typeof parAbroad === 'function' && parAbroad(), pc = far ? CBY[S.born] || C() : C(); S.flags.careFar = far ? 1 : 0;
      const tog = !far && !!homeOthers()[who === "mẹ" ? 'mom' : 'dad']; S.flags.careTog = tog ? 1 : 0;
      const nop = far && S.flags.irreg != null;
      const wait = far && !nop && !!S.flags.parPlan && S.flags.parPlan.to === S.cur;
      return { title: L`${who}를 누가 돌볼까?`, body: far ? L`고향 ${pc.ko}에 계신 ${who}의 거동이 불편해졌습니다.` + (nop ? ' ' + "Không có giấy phép cư trú, bạn không thể đón sang mà cũng không thể về thăm." : wait ? ' ' + "Hồ sơ bảo lãnh bạn đã nộp để đón sang vẫn đang chờ đến lượt." : '') : tog ? L`함께 사는 ${who}의 거동이 불편해졌습니다.` : L`${who}의 거동이 불편해졌습니다.`, fact: pc.p === 'hi' ? "Ở các nước thu nhập cao, viện dưỡng lão và dịch vụ chăm sóc tại nhà được dùng rộng rãi (OECD)" : "Ở các nước thu nhập thấp và trung bình, phần lớn việc chăm sóc người cao tuổi do gia đình đảm nhận, nhất là phụ nữ (WHO)",
        choices: [far ? (nop ? { k: 'call', label: "Thường xuyên gọi điện và nhờ họ hàng ở quê trông nom", sub: "Quan hệ↑ · không thể ở bên" } : wait ? null : { k: 'home', label: L`${ro(C().ko)} 모셔 와 함께 산다`, sub: freeZone(S.born, S.cur) ? "Quan hệ↑ thu nhập↓ · chi phí chuyển nhà" : "Quan hệ↑ thu nhập↓ · chi phí chuyển nhà và visa" }) : tog ? { k: 'home', label: "Tự mình chăm sóc", sub: "Quan hệ↑ Thu nhập↓" } : { k: 'home', label: "Đón về nhà mình chăm sóc", sub: "Quan hệ↑ Thu nhập↓" },
          tog || nop ? null : far ? { k: 'near', label: "Thường xuyên về quê chăm sóc", sub: "Quan hệ↑ · tiền vé máy bay và ngày nghỉ" } : { k: 'near', label: "Sống riêng và thường xuyên qua chăm sóc", sub: "Quan hệ↑ · tốn thời gian và công sức" },
          { k: 'pay', label: far ? (pc.p === 'hi' ? "Đưa vào viện dưỡng lão ở quê" : "Thuê người chăm sóc ở quê") : pc.p === 'hi' ? "Đưa vào viện dưỡng lão" : "Thuê người chăm sóc", sub: "Tốn tiền" }, { k: 'sib', label: "Nhờ anh chị em", sub: "Quan hệ↓" }].filter(x => x && (x.k !== 'sib' || sibN() > 0) && !(x.k === 'home' && vowedHome())) }; },
    apply: k => { S.done.care = 1; const far = !!S.flags.careFar; S.flags.careFar = 0;
      if (k === 'near' || k === 'home') S.flags.cared = S.flags.careWho === "mẹ" ? 'mom' : 'dad';
      if (k === 'call') { eff({ so: 3, h: -3 }); return L`자주 전화로 안부를 여쭈며 고향의 친척들에게 ${eul(S.flags.careWho)} 부탁했습니다. 곁에 있지 못해 마음이 무거웠습니다.`; }
      if (k === 'near' && far) { const x = (typeof homeTrip === 'function' ? homeTrip() : incomeAt(C(), 0.5) * 0.12) * 2; S.money -= x; tripTo(S.born); S.flags.parentCare = S.age + 5; eff({ so: 5, h: -3, hl: -1 }); S.pct = clamp(S.pct - 0.02, 0, 1); return L`해마다 휴가를 모아 고향에 몇 번씩 다녀오며 ${eul(S.flags.careWho)} 돌봤습니다. (−${wonStr(x)})`; }
      if (k === 'near') { S.flags.parentCare = S.age + 5; eff({ so: 5, h: -2, hl: -1 }); S.pct = clamp(S.pct - 0.015, 0, 1); return L`가까이 살며 자주 찾아가 ${eul(S.flags.careWho)} 돌봤습니다. 장을 봐 드리고 병원에 모시고 다녔습니다.`; }
      if (k === 'home' && far) {
        const x = (typeof homeTrip === 'function' ? homeTrip() : incomeAt(C(), 0.5) * 0.12) * 3; S.money -= x;
        S.flags.careHome = S.flags.careWho === "mẹ" ? 'mom' : 'dad'; eff({ so: 8, h: -3, hl: -2 }); S.pct = clamp(S.pct - 0.04, 0, 1);
        const fz = freeZone(S.born, S.cur), st = sharedTongue(S.born, S.cur), w = S.flags.careWho;
        return fz ? (st ? L`${eul(w)} ${ro(C().ko)} 모셔 와 함께 살기로 했습니다. 이사에 돈이 들었고, 말은 통해도 친구들과 정든 동네를 두고 온 ${w}는 한동안 고향을 그리워하셨습니다. (−${wonStr(x)})` : L`${eul(w)} ${ro(C().ko)} 모셔 와 함께 살기로 했습니다. 이사에 돈이 들었고, 말이 낯선 곳에서 ${w}는 한동안 고향을 그리워하셨습니다. (−${wonStr(x)})`)
          : st ? L`${eul(w)} ${ro(C().ko)} 모셔 와 함께 살기로 했습니다. 비자와 이사에 돈이 들었고, 말은 통해도 친구들과 정든 동네를 두고 온 ${w}는 한동안 고향을 그리워하셨습니다. (−${wonStr(x)})` : L`${eul(w)} ${ro(C().ko)} 모셔 와 함께 살기로 했습니다. 비자와 이사에 돈이 들었고, 말이 낯선 곳에서 ${w}는 한동안 고향을 그리워하셨습니다. (−${wonStr(x)})`; }
      if (k === 'home') { S.flags.careHome = S.flags.careWho === "mẹ" ? 'mom' : 'dad'; eff({ so: 8, h: -3, hl: -2 }); S.pct = clamp(S.pct - 0.04, 0, 1); return S.flags.careTog ? L`함께 사는 ${eul(S.flags.careWho)} 곁에서 돌보기로 했습니다. 일하는 시간을 줄였습니다.` : L`${eul(S.flags.careWho)} 집에 모시고 함께 살기로 했습니다.`; } if (k === 'pay') {
        const c = far ? CBY[S.born] || C() : C(), who = S.flags.careWho === "mẹ" ? 'mom' : 'dad', sh = 1 / (1 + 0.5 * Math.min(2, sibN()));
        const cost = incomeAt(c, 0.5) * (c.p === 'hi' ? 0.08 : c.p === 'eca' ? 0.12 : 0.15) * sh;
        S.flags.careCost = cost; S.flags.careKey = who; eff({ so: 2 });
        return (c.p === 'hi' ? L`${eul(S.flags.careWho)} 요양시설에 모셨습니다.` : L`${eul(S.flags.careWho)} 돌봐 줄 사람을 구했습니다.`) + ' ' + (sh < 1 ? L`해마다 약 ${wonStr(cost)}씩 형제자매와 나눠 냅니다.` : L`해마다 약 ${wonStr(cost)}씩 냅니다.`);
      } eff({ so: -6 }); return { t: L`형제자매에게 ${eul(S.flags.careWho)} 부탁했습니다. 사이가 조금 서먹해졌습니다.`, k: 'bad' }; }
  },
  lend: {
    ok: () => S.money > incomeAt(C(), 0.5) * 0.1 && friendsLeft() && S.st.so >= 30,
    build: () => {
      const c = C(), amt = Math.min(S.money * 0.3, incomeAt(c, 0.5) * 0.15); S.flags.lendAmt = amt;
      return { title: "Một người bạn hỏi vay tiền", body: L`오랜 친구가 급한 사정이 생겼다며 ${wonStr(amt)}을 빌려 달라고 합니다. 모아 둔 돈은 ${savedAmt()}.`,
        choices: [{ k: 'lend', label: "Cho vay", sub: L`약 ${wonStr(amt)}` }, { k: 'gift', label: "Chỉ giúp một khoản không cần lấy lại", sub: L`약 ${wonStr(amt * 0.3)}` }, { k: 'no', label: "Từ chối vì không đủ khả năng", sub: '' }] };
    },
    apply: k => {
      const amt = S.flags.lendAmt;
      if (k === 'lend') { S.money -= amt; S.flags.lent = { amt, at: S.age, ok: chance(0.55) }; eff({ so: 2 }); return "Bạn cho bạn mình vay tiền và chọn tin vào lời hứa sẽ trả lại."; }
      if (k === 'gift') { S.money -= amt * 0.3; eff({ so: 3, h: 1 }); return "Bạn giúp một ít và nói không cần trả lại. Người bạn cúi đầu thật lâu."; }
      eff({ so: -2 }); return { t: "Bạn giải thích hoàn cảnh và từ chối. Lòng bạn không yên.", k: 'bad' };
    }
  },
  adsearch: {
    ok: () => !!(S.adopt && S.adopt.mv != null && S.adopt.kn != null && S.adopt.srch == null && S.adopt.found == null && !S.adopt.no),
    build: () => {
      const A = S.adopt, c = C(), from = CBY[A.from], intl = A.k === 'intl', y = calYr(), dna = y >= 2015 && ADOPT_DNA.has(c.id);
      return { title: "Tìm người đã sinh ra bạn?",
        body: (intl ? L`${from.ko}에서 태어나 ${c.ko}에서 자랐습니다. 입양 서류에 적힌 것은 태어난 날짜와 몇 줄의 기록뿐입니다.` : "Nếu xin hồ sơ của cơ quan nhận con nuôi và giấy khai sinh gốc, có thể bạn sẽ biết được người đã sinh ra mình.")
          + (dna ? ' ' + "Ngày nay nhiều người tìm được họ hàng nhờ xét nghiệm ADN." : ''),
        fact: (A.from === 'KOR' || c.id === 'KOR') && y >= 2012 ? "Từ năm 2012, người được nhận làm con nuôi ở Hàn Quốc có thể xin công khai hồ sơ nhận nuôi, nhưng chỉ được biết khi cha mẹ ruột đồng ý. Năm 2024, thông tin về cha mẹ ruột được công khai trong 13,3% trường hợp (Segye Ilbo 2025)"
          : "Khoảng một nửa số người được nhận làm con nuôi có lúc đi tìm cha mẹ ruột. Không phải cuộc tìm kiếm nào cũng dẫn đến gặp mặt (Müller & Perry 2001)",
        choices: [{ k: 'go', label: "Bắt đầu tìm", sub: intl ? "Xin hồ sơ và về thăm nơi mình sinh ra" : "Xin hồ sơ và dò hỏi" }, { k: 'later', label: "Chưa phải lúc này", sub: "Khi nào sẵn lòng thì tìm" }, { k: 'no', label: "Quyết định không tìm", sub: "Gia đình đã nuôi lớn mình là đủ" }] };
    },
    apply: k => {
      const A = S.adopt; A.st = (A.st || 0) + 1;
      if (k === 'go') { A.srch = S.age; S.money -= incomeAt(C(), 0.5) * (A.k === 'intl' ? 0.08 : 0.02); return { t: "Bạn xin hồ sơ từ cơ quan nhận con nuôi và bắt đầu chờ hồi âm." + (A.k === 'intl' ? ' ' + "Bạn cũng chuẩn bị về nơi mình sinh ra để tự dò hỏi." : ''), k: 'ev' }; }
      if (k === 'later') { A.sAt = S.age; return { t: "Bạn vẫn chưa sẵn sàng. Có lẽ một ngày nào đó.", k: 'ev' }; }
      A.no = 1; return { t: "Bạn quyết định không tìm. Gia đình đã nuôi bạn lớn chính là gia đình của bạn.", k: 'ev' };
    }
  },
  reunite: {
    ok: p => !S.fam.married && !S.fam.dating && !S.flags.celib && !!reunWho(p.k),
    build: p => { const x = reunWho(p.k), n = callName(x.name);
      return { title: "Người xưa trở lại", body: p.k === 'ex' ? L`이혼했던 ${wa(n)} 우연히 다시 마주쳤습니다. 함께 지낸 ${x.y}년이 떠올랐습니다. 그사이 둘 다 많이 달라져 있었습니다.` : L`헤어졌던 ${n}에게서 오랜만에 연락이 왔습니다. 잘 지내느냐는 짧은 인사였습니다.`,
        fact: "Hơn 40% người trẻ trưởng thành nói rằng họ từng quay lại với người đã chia tay. Chia tay lần nữa cũng là chuyện thường (Halpern-Meekin và cộng sự, 2013)",
        choices: [{ k: 'meet', label: "Gặp lại", sub: "Có thể là khởi đầu mới, cũng có thể lại đau" }, { k: 'no', label: "Để chuyện cũ lại phía sau", sub: '' }] }; },
    apply: (k, p) => {
      const x = reunWho(p.k); if (p.k === 'ex') S.flags.exP.asked = 1; else S.flags.exD = null;
      if (k === 'no' || !x) return "Bạn vui vì nhận được tin, nhưng quyết định để chuyện cũ lại phía sau.";
      S.fam.dating = Object.assign({}, x.cand, { since: S.age, again: 1 }); eff({ h: 5, so: 2 }); S.yearMark = 'love';
      return { t: p.k === 'ex' ? L`${wa(callName(x.name))} 다시 만나기 시작했습니다. 이번에는 서두르지 않기로 했습니다.` : L`${wa(callName(x.name))} 다시 만나기 시작했습니다.`, k: 'warm' };
    }
  },
  cosign: {
    ok: () => S.job !== 'prison' && !S.flags.cosign && !!(S.flags.csWho || cosignWho()),
    build: () => { const c = C(), w = S.flags.csWho = cosignWho(), amt = S.flags.csAmt = med() * (1 + rnd() * 2);
      return { title: "Lời nhờ đứng ra bảo lãnh", body: L`${iga(w.n)} 대출을 받는 데 보증을 서 달라고 합니다. 빌리는 돈은 ${wonStr(amt)}입니다. 갚지 못하면 그 빚을 내가 갚아야 합니다.`,
        fact: c.id === 'KOR' ? "Năm 2012–2013, Hàn Quốc bãi bỏ việc cá nhân bảo lãnh liên đới cho các khoản vay ngân hàng và ngân hàng tiết kiệm. Trước đó, nhiều người phải gánh nợ vì đứng ra bảo lãnh cho người thân hay bạn bè (Ủy ban Dịch vụ Tài chính Hàn Quốc)" : "Đứng ra bảo lãnh là hứa sẽ trả thay toàn bộ số nợ còn lại nếu người vay không trả được",
        choices: [{ k: 'sign', label: "Đứng ra bảo lãnh", sub: "Quan hệ↑ · có thể phải gánh nợ" }, { k: 'help', label: "Giúp một ít thay vì bảo lãnh", sub: L`약 ${wonStr(amt * 0.1)}` }, { k: 'no', label: "Nói rằng mình không thể bảo lãnh", sub: "Quan hệ↓" }] }; },
    apply: k => {
      const w = S.flags.csWho, amt = S.flags.csAmt; S.flags.csWho = null; if (!w) return false;
      if (k === 'sign') { S.flags.cosign = { amt, n: w.n, at: S.age, end: S.age + ri(3, 6), k: w.k, i: w.i }; eff({ so: 3 }); return L`${w.n}의 대출에 보증을 서 주었습니다. 고맙다는 말을 몇 번이나 들었습니다.`; }
      if (k === 'help') { S.money -= amt * 0.1; eff({ so: 1 }); return L`보증은 설 수 없다고 말하고, 대신 ${wonStr(amt * 0.1)}을 보태 주었습니다.`; }
      eff({ so: -3 }); if (w.k === 'kid' && S.fam.kids[w.i]) S.fam.kids[w.i].bd = (S.fam.kids[w.i].bd || 0) - 3;
      return { t: "Bạn nói mình không thể bảo lãnh. Hai người gượng gạo với nhau một thời gian.", k: 'bad' };
    }
  },
  ptpost: {
    ok: () => { const P = S.fam.partner; return S.fam.married && P && P.alive && !P.divorced && !P.ret && !(P.out > 0) && !(P.postEnd > S.age) && S.cur === S.born && !S.mig && !S.flags.post && S.job !== 'prison'; },
    build: () => { const P = S.fam.partner, to = S.flags.postTo = postDest(), who = callName(P.name), kn = homeOthers().kids.length;
      return { title: "Bạn đời được điều sang nước ngoài", body: L`배우자 ${iga(who)} 회사에서 ${CBY[to].ko} 근무를 제안받았습니다. 2~4년입니다.` + (kn ? ' ' + "Còn phải tính đến chuyện học hành của các con." : ''),
        fact: "Trong số những người theo bạn đời được điều ra nước ngoài, cứ mười người thì chín người từng đi làm trước khi chuyển đi, nhưng chỉ khoảng một phần ba có việc làm ở nơi mới (Permits Foundation, 2012)",
        choices: [{ k: 'go', label: "Cả nhà cùng đi", sub: isWorking() ? "Có thể bạn phải bỏ việc của mình" : "Vài năm ở một đất nước mới" }, { k: 'alone', label: "Để bạn đời đi một mình", sub: "Xa nhau vài năm" }, { k: 'no', label: "Đề nghị đừng đi", sub: "Bạn đời mất cơ hội" }] }; },
    apply: k => {
      const P = S.fam.partner, who = callName(P.name), to = S.flags.postTo; S.flags.postTo = null; if (!to || !CBY[to]) return false;
      if (k === 'no') { eff({ so: -3 }); P.dev = (P.dev || 0) - 0.02; return { t: L`배우자 ${iga(who)} 제안을 거절했습니다. 아쉬운 기색이 오래 남았습니다.`, k: 'ev' }; }
      if (k === 'alone') { P.postEnd = S.age + ri(2, 3); eff({ so: -2 }); return L`배우자 ${iga(who)} 혼자 ${ro(CBY[to].ko)} 떠났습니다. 한동안 떨어져 지냅니다.`; }
      const was = isWorking(); emigrate(to, true, false, { post: 1 }); S.flags.post = { to, back: S.age + ri(2, 4) }; S.migPen = 0; P.home = to; P.mp = 0;
      return L`가족이 함께 ${ro(CBY[to].ko)} 건너갔습니다. 몇 해 동안 그곳에서 지냅니다.` + (was && S.job === 'homemaker' ? ' ' + "Ở đó bạn không tìm được việc nên lo việc nhà." : '');
    }
  },
  farsea: {
    ok: () => !S.flags.farSea && S.job !== 'prison',
    build: () => { const crew = FAR_CREW.includes(S.cur) && S.job !== 'fisher', fam = homeOthers().pt || homeOthers().kids.length;
      return { title: "Lên tàu đánh cá viễn dương?", body: (crew ? "Một người môi giới đến tìm thuyền viên cho tàu đánh cá viễn dương nước ngoài. Hợp đồng 2–3 năm, thu nhập khoảng gấp đôi ở đây." : "Một tàu đánh cá viễn dương đang tuyển người. Bạn sẽ phải ở trên biển 2–3 năm, nhưng thu nhập khoảng gấp đôi hiện nay.") + (fam ? ' ' + "Trong thời gian đó, bạn phải sống xa gia đình." : ''),
        fact: crew ? "Không ít ngư dân di cư trên các tàu đánh cá viễn dương nước ngoài bị nợ lương và phải làm việc nhiều giờ liền (ILO, 2016)" : "Đánh bắt cá là một trong những nghề nguy hiểm nhất, và đánh bắt xa bờ còn xảy ra tai nạn thường xuyên hơn (FAO)",
        choices: [{ k: 'go', label: "Ra khơi", sub: "Thu nhập↑ · xa gia đình · nguy hiểm" }, { k: 'no', label: "Ở lại đánh bắt gần bờ", sub: '' }] }; },
    apply: k => {
      if (k === 'no') return false;
      if (S.job !== 'fisher') takeJob({ id: 'fisher', pct: 0.3 });
      S.flags.farSea = { at: S.age, until: S.age + ri(2, 3) }; eff({ so: -4 }); S.yearMark = 'move';
      return "Bạn lên tàu đánh cá viễn dương. Những ngày tháng liền không đặt chân lên đất liền bắt đầu.";
    }
  },
  parback: {
    ok: () => S.fam.dad.alive && S.fam.dad.absent && !S.fam.dad.met,
    build: () => { const d = S.fam.dad, well = netWorth() > med() * 8 || S.pct > 0.85;
      return { title: "Người cha đã bỏ đi", body: L`어릴 때 집을 떠났던 아버지가 연락을 해 왔습니다. ${d.age}세가 된 아버지는 한 번 만나고 싶다고 했습니다.` + (well ? ' ' + "Bạn cũng nghe nói ông đang sống chật vật." : ''),
        choices: [{ k: 'meet', label: "Thử tìm hiểu", sub: '' }, well ? { k: 'money', label: "Không gặp, chỉ giúp ông một ít", sub: L`약 ${wonStr(med() * 0.3)}` } : null, { k: 'no', label: "Không gặp", sub: '' }].filter(Boolean) }; },
    apply: k => {
      const d = S.fam.dad;
      if (k === 'money') { const x = med() * 0.3; S.money -= x; return { t: L`만나지는 않고, 사정이 어렵다는 아버지에게 ${wonStr(x)}을 보냈습니다.`, k: 'ev' }; }
      if (k === 'no') return { t: "Bạn quyết định không gặp. Bạn không muốn khơi lại những cảm xúc đã chôn giấu bấy lâu.", k: 'ev' };
      d.met = S.age;
      if (chance(0.6)) { eff({ h: 3, so: 2 }); return { t: "Sau mấy chục năm, hai bố con mới ngồi đối diện nhau. Có phần ngượng ngùng, nhưng ông nói xin lỗi hết lần này đến lần khác. Từ đó, thỉnh thoảng hai người vẫn liên lạc.", k: 'warm' }; }
      return { t: "Bạn đã gặp ông, nhưng không có nhiều điều để nói. Sau đó, liên lạc lại thưa dần.", k: 'ev' };
    }
  },
  gkhome: {
    ok: p => gkOf(p.of).length > 0,
    build: p => { const gs = gkOf(p.of), n = p.of, cost = gkCost(C()) * gs.length, able = S.age <= 78 && S.st.hl >= 35 && S.job !== 'prison';
      return { title: "Những đứa cháu ở lại", body: (gs.length > 1 ? L`혼자 아이들을 키우던 ${iga(n)} 세상을 떠나 손주 ${gs.length}명이 남았습니다.` : L`혼자 아이를 키우던 ${iga(n)} 세상을 떠나 손주가 남았습니다.`) + ' ' + "Phải quyết định ai sẽ nuôi các cháu.",
        fact: "Ở Mỹ, khoảng 2,7 triệu trẻ em được ông bà nuôi thay cho bố mẹ. Ông bà là những người nhận nuôi trẻ mất cha hoặc mẹ nhiều hơn bất kỳ ai (Cục Điều tra Dân số Mỹ, Generations United)",
        choices: [able ? { k: 'home', label: "Tự mình đón về nuôi", sub: L`한 해 약 ${wonStr(cost)} · 기운이 많이 든다` } : null, { k: 'kin', label: "Người thân khác nuôi, mình gửi tiền nuôi dưỡng", sub: L`한 해 약 ${wonStr(cost * 0.35)}` }, { k: 'other', label: "Gửi cho người cha hoặc mẹ còn lại của cháu, hay họ hàng", sub: "Thường xuyên đến thăm" }].filter(Boolean) }; },
    apply: (k, p) => {
      const gs = gkOf(p.of); if (!gs.length) return false;
      if (k === 'home') { for (const g of gs) g.home = S.age; eff({ h: -3, so: 3, hl: -2 });
        return { t: gs.length > 1 ? L`손주 ${gs.length}명을 집으로 데려왔습니다. 다시 아이를 키우는 집이 되었습니다.` : "Bạn đón cháu về nhà. Ngôi nhà lại một lần nữa có trẻ con.", k: 'note' }; }
      if (k === 'kin') { const y = Math.min(...gs.map(g => S.age - g.bornAt)); S.flags.gkPay = { n: gs.length, to: S.age + Math.max(1, 18 - y) };
        return { t: "Một người thân khác sẽ nuôi cháu. Bạn sẽ gửi tiền nuôi dưỡng hằng năm.", k: 'ev' }; }
      return { t: gs.length > 1 ? "Các cháu sẽ do người cha hoặc mẹ còn lại nuôi. Bạn tự nhủ sẽ thường xuyên đến thăm." : "Cháu sẽ do người cha hoặc mẹ còn lại nuôi. Bạn tự nhủ sẽ thường xuyên đến thăm.", k: 'ev' };
    }
  },
  heir: {
    ok: p => { const P = S.fam[p.k]; return !!P && HEIR_JOBS.includes(P.job) && S.job !== P.job && S.job !== 'prison'; },
    build: p => {
      const P = S.fam[p.k], who = p.k === 'dad' ? "bố" : "mẹ", id = P.job, sz = id === 'owner' ? famBizOf(p.k) : 0, what = sz ? L`회사${LBL}` : HEIR_WHAT(id);
      if (sz === 3) return { title: "Nối nghiệp gia đình?", body: P.alive ? L`${iga(who)} 이제 회사 경영에서 물러나려 합니다. 자식 가운데 누가 경영을 맡을지 이야기가 나왔습니다.` : L`${iga(who)} 이끌던 회사의 경영을 누가 맡을지 이야기가 나왔습니다.`,
        fact: famBizFact(3),
        choices: [{ k: 'take', label: "Tiếp quản việc điều hành công ty", sub: "Đứng đầu một công ty lớn · bỏ công việc hiện tại" }, { k: 'keep', label: "Tiếp tục công việc hiện tại", sub: sibN() ? "Anh chị em tiếp quản" : "Giao cho người quản lý chuyên nghiệp · cổ phần vẫn trong gia đình" }] };
      return { title: "Nối nghiệp gia đình?", body: P.alive ? L`${iga(who)} 이제 ${eul(what)} 내려놓으려 합니다. 자식 가운데 누가 이어받을지 이야기가 나왔습니다.` : L`${iga(who)} 남긴 ${eul(what)} 누가 이어받을지 이야기가 나왔습니다.`,
        fact: sz ? famBizFact(sz) : ['farm', 'herder', 'fisher', 'agbiz'].includes(id) ? "Trong khoảng 570 triệu nông trại trên thế giới, hơn 90% do các gia đình điều hành (FAO 2014)" : "Người có bố mẹ tự kinh doanh có khả năng cũng tự kinh doanh cao gấp khoảng hai lần (Dunn & Holtz-Eakin 2000, Mỹ)",
        choices: [{ k: 'take', label: "Nối nghiệp", sub: L`${sz === 1 ? "chủ cơ sở có nhiều nhân viên" : sz === 2 ? "giám đốc doanh nghiệp vừa và nhỏ" : jobName(id, S.sex)} · ${['farm', 'herder', 'fisher', 'agbiz'].includes(id) && S.urban ? "về quê" : "bỏ công việc hiện tại"}` }, { k: 'keep', label: "Tiếp tục công việc hiện tại", sub: sibN() ? "Anh chị em tiếp quản" : "Cơ nghiệp chuyển sang tay người ngoài" }] };
    },
    apply: (k, p) => {
      const P = S.fam[p.k], id = P.job, who = p.k === 'dad' ? "bố" : "mẹ", sz = id === 'owner' ? famBizOf(p.k) : 0, what = sz ? L`회사${LBL}` : HEIR_WHAT(id);
      if (k === 'keep') { eff({ so: -1 }); if (sz === 3) return sibN() ? "Anh chị em của bạn đã tiếp quản việc điều hành công ty." : "Công ty được giao cho người quản lý chuyên nghiệp điều hành.";
        return sibN() ? L`${eul(what)} 형제자매가 이어받았습니다.` : L`${eul(what)} 다른 사람에게 넘겼습니다.`; }
      if (id === 'owner') setRank('owner', Math.min(2, sz));
      const c = C(), [lo, hi] = jobRange(id, c), home = ['farm', 'herder', 'fisher', 'agbiz'].includes(id) && S.urban;
      if (home) { S.urban = false; S.city = null; S.stats.moves++; S.yearMark = 'move'; }
      takeJob({ id, formal: false, pct: clamp(Math.max(lo + (hi - lo) * [0.3, 0.75, 0.88, 0.97][sz], (S.fam.pPct || 0.4) - 0.05), lo, hi) });
      const xe = expMap()[id] || (expMap()[id] = [0, S.pct]); xe[0] += 3;
      if (id === 'owner') { S.flags.ownT = sz ? null : "chủ cửa hàng"; S.flags.bizK = 'shop'; S.flags.bizInh = 1; S.flags.bizL = sz === 3 ? 1 : 0; S.flags.bizV = null; }
      eff({ h: 4, so: 4 }); S.flags.heir = id;
      if (sz === 3) return L`${who}의 뒤를 이어 회사 경영을 맡았습니다.`;
      return L`${who}의 ${eul(what)} 이어받았습니다.` + (home ? ' ' + "Bạn khép lại cuộc sống thành phố và trở về quê." : '');
    }
  },
  hsch: {
    ok: () => !S.flags.hsch && S.money > 0,
    build: () => {
      const h = B(), per = hschPer(h), n = hschN(), away = S.cur !== S.born, place = hschPlace(away);
      return { title: "Lập quỹ học bổng ở quê nhà?",
        body: away ? L`고향 ${place}에서 형편 때문에 학교를 그만두는 아이들이 있다는 소식을 들었습니다.` : L`어릴 적 자란 ${place}에서 형편 때문에 학교를 그만두는 아이들이 있다는 이야기를 들었습니다.`,
        fact: hschSec(h) ? "Ở Ghana, 73% học sinh nhận học bổng trung học đã tốt nghiệp, so với 45% ở những em không nhận được (Duflo, Dupas & Kremer, J-PAL)" : "Ở bang Florida (Mỹ), học bổng dành cho sinh viên khó khăn đã làm tăng 22% số sinh viên hoàn thành đại học trong vòng sáu năm (Castleman & Long 2016)",
        choices: [{ k: 'fund', label: "Gửi học bổng hằng năm", sub: L`학생 ${n}명 · 한 해 약 ${wonStr(per * n)}` }, { k: 'once', label: "Ủng hộ trường một khoản lớn một lần", sub: L`약 ${wonStr(per * 3)} · 책과 컴퓨터` }, { k: 'no', label: "Bây giờ thì chưa được", sub: '' }] };
    },
    apply: k => {
      const h = B(), per = hschPer(h);
      if (k === 'no') return false;
      if (k === 'once') { const x = per * 3; S.money -= x; book("Tiền gửi cho trường ở quê", -x); eff({ h: 3, so: 2 }); return "Bạn gửi sách và máy tính cho trường học ở quê." + ' ' + "Bạn nhận được tấm ảnh lũ trẻ cầm những cuốn sách mới mở ra."; }
      const n = hschN(); S.flags.hsch = { at: S.age, n, y: 0, st: 0, fin: 0, sec: hschSec(h) ? 1 : 0 };
      eff({ h: 5, so: 3 });
      return "Bạn đã lập quỹ học bổng ở quê nhà." + ' ' + L`해마다 형편이 어려운 학생 ${n}명의 학비를 대기로 했습니다.`;
    }
  },
  kidschool: {
    ok: p => { const k = S.fam.kids[p.i]; return !!k && k.alive && !nkCut(k) && typeof k.ps !== 'string' && (S.flags.kidSchool == null || S.flags.kidSchool === 'priv'); },
    build: p => {
      const c = C(), k = S.fam.kids[p.i], tw = kidAndTwin(k), n = kidsCall(tw), fee = schoolFee(c), sh = Math.round(privShare(c) * 100), more = S.flags.kidSchool === 'priv';
      const inc0 = Math.max(0, S.income) + (S.fam.married && S.fam.partner && S.fam.partner.alive ? Math.max(0, S.fam.partner.inc || 0) : 0), part = inc0 > 0 ? Math.round(fee / inc0 * 100) : 0;
      if (more) { const np = S.fam.kids.filter(x => x.alive && !tw.includes(x) && S.age - x.bornAt >= 5 && S.age - x.bornAt < 18 && kidPrivOf(x)).length;
        return { title: L`${n}의 학교를 정할 때입니다`, body: L`${iga(n)} 내년이면 학교에 갑니다. 형제자매는 사립학교에 다니는데, ${n}까지 보내면 사립 학비가 한 해 약 ${wonStr(fee * (np + tw.length))}이 됩니다.`,
          fact: L`${c.ko}에서는 초등학생의 약 ${sh}%가 사립학교에 다닙니다 (세계은행·UNESCO)`,
          choices: [{ k: 'priv', label: L`${n}도 사립학교에 보낸다`, sub: L`한 해 약 ${wonStr(fee)} 더` }, { k: 'pub', label: L`${eun(n)} 공립학교에 보낸다`, sub: "Gần như không mất học phí" }] }; }
      return { title: L`${n}의 학교를 정할 때입니다`, body: L`${iga(n)} 내년이면 학교에 갑니다. 가까운 공립학교는 학비가 거의 들지 않고, 사립학교는 아이 한 명에 한 해 약 ${wonStr(fee)}이 듭니다.` + (inc0 <= 0 ? ' ' + "Hiện giờ gia đình không có nguồn thu nhập nào." : part >= 100 ? ' ' + "Số tiền đó nhiều hơn thu nhập cả năm của gia đình." : part >= 15 ? ' ' + L`집안 벌이의 약 ${part}%입니다.` : ''),
        fact: L`${c.ko}에서는 초등학생의 약 ${sh}%가 사립학교에 다닙니다 (세계은행·UNESCO)`,
        choices: [{ k: 'pub', label: "Trường công", sub: "Gần như không mất học phí" }, { k: 'priv', label: "Trường tư", sub: L`아이마다 해마다 약 ${wonStr(fee)} · 대학 진학 가능성 조금↑` }] };
    },
    apply: (k, p) => {
      const kid = S.fam.kids[p.i], tw = kidAndTwin(kid), n = kidsCall(tw);
      if (S.flags.kidSchool === 'priv') { for (const x of tw) x.ps = k; } else S.flags.kidSchool = k;
      if (k === 'pub') return L`${eul(n)} 동네 공립학교에 보냈습니다.`;
      return L`${eul(n)} 사립학교에 보냈습니다.`;
    }
  },
  kinask: {
    ok: p => p.who === 'kid' ? !!(S.fam.kids[p.i] && S.fam.kids[p.i].alive) : p.who !== 'sib' || p.s == null || sibAliveList().some(s => s.i === p.s),
    build: p => {
      const c = C(), kid = p.who === 'kid' ? S.fam.kids[p.i] : null, ac = kid ? kidLand(kid) : farKin() ? B() : c;
      const med = incomeAt(ac, 0.5), rich = ac.p === 'hi' || ac.p === 'eca' || ac.p === 'eap';
      const r = p.who === 'kid' ? (rich ? 0.4 + rnd() * 0.5 : 0.2 + rnd() * 0.3) : p.who === 'sib' ? 0.1 + rnd() * 0.2 : 0.08 + rnd() * 0.12;
      const amt = Math.min(med * r, Math.max(S.money * 0.6, incomeAt(c, 0.5) * 0.2)); S.flags.kinAmt = amt;
      const n = kid ? callName(kid.name) : '', A = wonStr(amt);
      const sl = p.s != null ? sibList() : null, sw = sl && sl[p.s] ? sibCall(Object.assign({ i: p.s }, sl[p.s])) : null, nw = sw && p.who === 'rel' && p.r === 2 ? (p.ns === 'F' ? L`${sw}네 딸` : L`${sw}네 아들`) : null;
      const body = p.who === 'kid' ? [L`${iga(n)} 집을 얻을 보증금이 모자란다며 ${A}을 부탁합니다.`, L`${iga(n)} 빚을 정리하고 다시 시작하고 싶다며 ${A}을 부탁합니다.`, L`${iga(n)} 작은 가게를 열고 싶다며 ${A}을 부탁합니다.`][p.r]
        : p.who === 'sib' ? (sw ? [L`${iga(sw)} 아이 학비가 모자란다며 ${A}을 부탁합니다.`, L`${iga(sw)} 병원비가 급하다며 ${A}을 부탁합니다.`, L`${iga(sw)} 장사 밑천이 필요하다며 ${A}을 부탁합니다.`] : [L`형제자매가 아이 학비가 모자란다며 ${A}을 부탁합니다.`, L`형제자매가 병원비가 급하다며 ${A}을 부탁합니다.`, L`형제자매가 장사 밑천이 필요하다며 ${A}을 부탁합니다.`])[p.r]
        : [L`사촌이 혼사 비용이 모자란다며 ${A}을 부탁합니다.`, L`고향의 친척이 병원비가 급하다며 ${A}을 부탁합니다.`, nw ? L`${iga(nw)} 학비가 모자란다며 ${A}을 부탁합니다.` : L`조카가 학비가 모자란다며 ${A}을 부탁합니다.`][p.r];
      S.flags.kinWhat = p.who === 'kid' ? [L`${n}의 집 보증금`, L`${n}의 빚 정리`, L`${n}의 가게 밑천`][p.r] : p.who === 'sib' ? (sw ? [L`${sw}네 아이 학비`, L`${sw}의 병원비`, L`${sw}의 장사 밑천`] : ["học phí cho con của anh chị em", "viện phí của anh chị em", "vốn buôn bán của anh chị em"])[p.r]
        : ["chi phí đám cưới của anh chị em họ", "viện phí của người họ hàng ở quê", nw ? L`${nw}의 학비` : "học phí của đứa cháu"][p.r];
      return { title: p.who === 'kid' ? L`${iga(n)} 돈을 부탁합니다` : p.who === 'sib' ? (sw ? L`${iga(sw)} 돈을 부탁해 왔습니다` : "Anh chị em nhờ bạn giúp tiền") : nw ? "Cháu nhờ bạn giúp tiền" : "Họ hàng nhờ bạn giúp tiền", body: body + (S.money > 0 ? ' ' + L`모아 둔 돈은 ${savedAmt()}입니다.` : ''),
        fact: c.p === 'ssa' && p.who !== 'kid' ? "Ở châu Phi hạ Sahara, cứ mười người trưởng thành thì hơn bốn người đã gửi tiền cho hoặc nhận tiền từ gia đình, họ hàng trong nước trong một năm (World Bank Global Findex 2017)" : p.who === 'kid' && c.p === 'hi' ? "59% bố mẹ ở Mỹ có con từ 18 đến 34 tuổi đã giúp con về tiền bạc trong năm qua (Pew Research Center 2024)" : null,
        choices: [{ k: 'give', label: "Giúp đủ số được nhờ", sub: L`약 ${A} · 관계↑` }, { k: 'some', label: "Giúp một phần trong khả năng", sub: L`약 ${wonStr(amt * 0.3)}` }, { k: 'no', label: "Nói rằng lần này không giúp được", sub: "Quan hệ↓" }] };
    },
    apply: (k, p) => {
      const amt = S.flags.kinAmt || 0, kid = p.who === 'kid' ? S.fam.kids[p.i] : null, c = C();
      const out = () => { if (!kid || p.r !== 0 || !kid.alive || kid.grown || kid.withMe) return ''; kid.grown = 1; kid.stay = 0; return ' ' + L`${iga(callName(kid.name))} 그 돈으로 방을 얻어 집을 떠났습니다.`; };
      const q = DEC_Q && S.flags.kinWhat, A = wonStr(amt);
      if (k === 'give') { S.money -= amt; eff({ so: 4, h: 2 }); if (kid) kid.bd = (kid.bd || 0) + 3; return (q ? L`${ro(q)} ${A}을 부탁받아, 이번에도 부탁한 만큼 보탰습니다.` : "Bạn đã giúp đủ số tiền được nhờ. Lời cảm ơn ấy còn đọng lại rất lâu.") + out(); }
      if (k === 'some') { S.money -= amt * 0.3; eff({ so: 1 }); return (q ? L`${ro(q)} ${A}을 부탁받아, 이번에도 형편껏 일부를 보탰습니다.` : "Bạn đã góp một phần trong khả năng.") + out(); }
      eff({ so: ['ssa', 'sa'].includes(c.p) ? -5 : -3, h: -1 }); if (kid) kid.bd = (kid.bd || 0) - 4;
      return { t: q ? L`${ro(q)} ${A}을 부탁받았지만, 이번에도 어렵다고 말했습니다. 한동안 서먹했습니다.` : "Lần này bạn nói là không thể. Hai bên ngượng ngùng với nhau một thời gian.", k: 'bad' };
    }
  },
  dreamtry: {
    ok: () => dreamOK(),
    build: () => {
      const ids = dreamPool(); S.flags.dreamIds = ids;
      if (!ids.length) return null;
      const os = S.flags.dreamOs = ids.map(dreamOffer);
      const tags = ids.map(dreamWhy), own = tags.some(Boolean), now = isWorking() ? payNow() : 0;
      const seen = S.flags.dreamSeen || (S.flags.dreamSeen = []); ids.forEach((id, i) => { if (tags[i] && !seen.includes(id)) seen.push(id); });
      const pay = o => { const inc = offerInc(o), d = now > 0 ? Math.round((inc / now - 1) * 100) : 0; return L`한국 체감 월 ${wonStr(inc / 12)}` + (d <= -5 ? L` · 지금보다 ${-d}% 적게` : d >= 5 ? L` · 지금보다 ${d}% 더` : ''); };
      return { title: own ? "Thử sức với công việc mơ ước?" : "Thử sức với công việc bạn từng muốn làm?", body: "Trong những công việc bạn từng tìm hiểu, có một việc vẫn đọng lại trong lòng. Nếu được nhận, bạn sẽ bắt đầu lại gần như người mới vào nghề; nếu không, cuộc sống vẫn tiếp tục như cũ.",
        fact: "Việc làm thường được lấp đầy qua kinh nghiệm và người quen, nên bước thẳng vào một công việc chưa từng làm là không dễ. Trong một nghiên cứu, 56% người làm nghề chuyên môn và quản lý tìm được việc nhờ các mối quan hệ cá nhân (Granovetter 1974)",
        choices: ids.map((id, i) => ({ k: 'd' + i, label: L`${jobName(id, S.sex)}에 도전한다`, sub: (tags[i] ? L`${tags[i]} · 붙을 가능성: ${dreamWord(dreamP(id))}` : L`붙을 가능성: ${dreamWord(dreamP(id))}`) + ((S.flags.dreamF || {})[id] ? ' · ' + "lần trước chưa được nhận" : '') + ' · ' + pay(os[i]) })).concat([{ k: 'no', label: "Tạm giữ làm ước mơ", sub: '' }]) };
    },
    apply: k => {
      const ids = S.flags.dreamIds || [], os = S.flags.dreamOs || []; S.flags.dreamIds = null; S.flags.dreamOs = null;
      if (k === 'no' || k[0] !== 'd' || !ids[+k.slice(1)]) return "Bạn quyết định tạm giữ ước mơ ấy trong lòng.";
      const id = ids[+k.slice(1)], nm = jobName(id, S.sex);
      if (!chance(dreamP(id))) { eff({ h: -4 }); const F = S.flags.dreamF = S.flags.dreamF || {}; F[id] = (F[id] || 0) + 1; return { t: L`${nm}에 도전했지만 이번에는 닿지 않았습니다. 준비하며 배운 것은 남았습니다.`, k: 'bad' }; }
      const o = os[+k.slice(1)] && os[+k.slice(1)].id === id ? os[+k.slice(1)] : dreamOffer(id);
      takeJob({ id, formal: o.formal, pct: o.pct });
      const why = dreamWhy(id);
      eff({ h: 10, sm: 2 }); S.yearMark = 'job'; S.flags.dreamGot = id; S.flags.dreamG = why ? 0 : 1;
      return { t: S.flags.kidDream === id ? L`어릴 적 꿈이던 ${nm}, 이제 그 일을 하게 되었습니다! 처음부터 다시 배우는 마음으로 시작합니다.` : why ? L`꿈꾸던 일, ${ro(nm)} 일하게 되었습니다! 처음부터 다시 배우는 마음으로 시작합니다.` : L`해 보고 싶던 일, ${ro(nm)} 일하게 되었습니다! 처음부터 다시 배우는 마음으로 시작합니다.`, k: 'big' };
    }
  },
  stepin: {
    ok: () => skKids().length > 0,
    build: () => {
      const ks = skKids(), kn = ks.length > 1 ? "các con" : callName(ks[0].name);
      return { title: "Gần gũi với con của bạn đời", body: L`한 식구가 된 지 한 해. ${iga(kn)} 아직 나를 어색해합니다. 인사는 하지만 눈을 잘 마주치지 않습니다.`,
        fact: "Một gia đình tái hôn thường mất 4 đến 7 năm để thật sự thành một nhà. Mọi việc suôn sẻ hơn khi người cha mẹ mới tiến lại gần từ từ như một người bạn, thay vì nhận việc dạy bảo ngay từ đầu (Papernow, nghiên cứu về gia đình tái hôn)",
        choices: [{ k: 'friend', label: "Từ từ tiến lại gần như một người bạn hơn là bố mẹ", sub: "Để bạn đời lo việc dạy bảo" }, { k: 'together', label: "Chủ động dành thời gian làm việc cùng nhau", sub: "Đi chơi cuối tuần, ăn tối cùng nhau" },
          { k: 'rules', label: "Đặt nội quy gia đình rõ ràng ngay từ đầu", sub: "Có thể xảy ra va chạm" }] };
    },
    apply: k => {
      const ks = skKids(); if (!ks.length) return false;
      const kn = ks.length > 1 ? "các con" : callName(ks[0].name);
      const p = { friend: 0.7, together: 0.5, rules: 0.3 }[k] + (S.st.so - 60) / 300;
      if (chance(p)) { for (const kd of ks) kd.bd = (kd.bd || 0) + 6; eff({ h: 3, so: 3 });
        return k === 'friend' ? L`몇 해가 걸렸지만 ${iga(kn)} 먼저 말을 걸어 오기 시작했습니다.` : k === 'together' ? L`함께 보낸 주말이 쌓이며 ${wa(kn)} 웃는 날이 늘었습니다.` : L`처음엔 부딪혔지만 ${iga(kn)} 차츰 집의 규칙을 받아들였습니다.`; }
      S.flags.stepStrain = S.age; for (const kd of ks) kd.bd = (kd.bd || 0) - 2; eff({ h: -3, so: -2 });
      return { t: L`${iga(kn)} 여전히 마음을 열지 않습니다. 집 안 공기가 무겁습니다.`, k: 'bad' };
    }
  },
  stepkids: {
    ok: () => stepKids().length > 0,
    build: () => {
      const P = S.fam.partner, who = callName(P.name), ks = stepKids(), kn = ks.length > 1 ? "các con" : callName(ks[0].name);
      const par = P.ss ? "bố mẹ mới" : P.sex === 'F' ? "mẹ mới" : "bố mới";
      return { title: "Trở thành một gia đình mới", body: L`${wa(who)} 함께 산 지 한두 해. ${iga(kn)} ${eul(par)} 아직 쉽게 받아들이지 못합니다.`,
        fact: "Một gia đình tái hôn thường mất 4 đến 7 năm để thật sự thành một nhà. Mọi việc suôn sẻ hơn khi người cha mẹ mới tiến lại gần từ từ như một người bạn, thay vì nhận việc dạy bảo ngay từ đầu (Papernow, nghiên cứu về gia đình tái hôn)",
        choices: [{ k: 'slow', label: "Không vội, chờ các con gần gũi dần theo nhịp của mình", sub: "Tự mình lo việc dạy bảo" }, { k: 'together', label: "Chủ động dành thời gian làm việc cùng nhau", sub: "Đi chơi cuối tuần, ăn tối cùng nhau" },
          { k: 'side', label: L`아이 편에 서서 ${who}에게 한발 물러서 달라고 한다`, sub: "Hôn nhân có thể nguội lạnh" }] };
    },
    apply: k => {
      const P = S.fam.partner, who = callName(P.name), ks = stepKids(); if (!ks.length || !P || !P.alive) return false;
      const kn = ks.length > 1 ? "các con" : callName(ks[0].name);
      const p = { slow: 0.65, together: 0.5, side: 0.75 }[k] + (S.st.so - 60) / 300;
      if (k === 'side') { S.flags.stepStrain = S.age; for (const kd of ks) kd.bd = (kd.bd || 0) + 3; eff({ so: -2 });
        return chance(p) ? L`${iga(kn)} 마음을 놓았습니다. ${wa(who)}의 사이는 한동안 서먹했습니다.` : { t: L`${wa(who)} 다투는 날이 늘었습니다. 아이들도 눈치를 봅니다.`, k: 'bad' }; }
      if (chance(p)) { for (const kd of ks) kd.bd = (kd.bd || 0) + 4; eff({ h: 3, so: 3 });
        return k === 'slow' ? L`몇 해가 걸렸지만 ${iga(kn)} ${wa(who)} 조금씩 가까워졌습니다. 어느 날 먼저 말을 걸어 왔습니다.` : L`함께 보낸 주말이 쌓이며 ${iga(kn)} ${wa(who)} 웃는 날이 늘었습니다.`; }
      S.flags.stepStrain = S.age; for (const kd of ks) kd.bd = (kd.bd || 0) - 3; eff({ h: -3, so: -2 });
      return { t: L`${iga(kn)} ${wa(who)} 여전히 거리를 둡니다. 집 안 공기가 무겁습니다.`, k: 'bad' };
    }
  },
  stepafter: {
    ok: () => skAftKids().length > 0,
    build: () => {
      const A = S.flags.skAft, ks = skAftKids(), kn = ks.length > 1 ? "các con" : callName(ks[0].name), ex = A.ex || "bạn đời cũ";
      const went = ks.filter(k => k.away && !k.grown), wn = went.length === ks.length ? kn : went.length > 1 ? "các con" : went.length ? callName(went[0].name) : '';
      return { title: L`${wa(kn)}의 사이`, body: L`${wa(ex)} 헤어지면서, ${A.y}년을 한 식구로 지낸 ${wa(kn)}의 사이도 갈림길에 섰습니다.` + (wn ? ' ' + L`${iga(wn)} ${ex} 곁으로 떠났습니다.` : ''),
        fact: C().id === 'KOR' ? "Theo luật dân sự Hàn Quốc, quan hệ họ hàng do hôn nhân với con của bạn đời chấm dứt cùng với việc ly hôn (Bộ luật Dân sự, Điều 775). Những trường hợp vẫn giữ liên lạc sau đó phần lớn là khi hai bên đã coi nhau như gia đình, khoảng một phần tư (Coleman và cộng sự 2015)"
          : "Liên lạc giữa cha mẹ kế và con riêng giảm mạnh và đột ngột sau ly hôn (1.663 cha mẹ kế ở Mỹ từ 50 tuổi trở lên, Noël-Miller 2013). Những trường hợp vẫn giữ liên lạc sau đó phần lớn là khi hai bên đã coi nhau như gia đình, khoảng một phần tư (Coleman và cộng sự 2015)",
        choices: [{ k: 'keep', label: "Giữ liên lạc", sub: "Hỏi thăm vào sinh nhật và các dịp lễ Tết" }, { k: 'theirs', label: L`${kn}의 마음에 맡긴다`, sub: "Niềm nở đón tiếp nếu có ghé thăm" },
          { k: 'part', label: "Lặng lẽ để mọi thứ phai dần", sub: "Tôn trọng khởi đầu mới của nhau" }] };
    },
    apply: k => {
      const A = S.flags.skAft, ks = skAftKids(); if (!ks.length) return false;
      const kn = ks.length > 1 ? "các con" : callName(ks[0].name), names = xs => xs.length > 1 ? listAnd(xs.map(x => callName(x.name))) : callName(xs[0].name);
      const half = S.fam.kids.some(o => o.alive && !o.sk && o.mn === A.m), kept = [], gone = [];
      for (const kd of ks) {
        const ja = A.at - kd.bornAt - A.y, lived = ja >= 18 ? 0 : Math.min(A.y, 18 - Math.max(0, ja));
        const base = 0.025 * Math.min(lived, 10) + (half ? 0.15 : 0) + clamp(bondScore(kd, 'kid'), -30, 40) * 0.005;
        if (chance(k === 'part' ? 0.04 : clamp(k === 'keep' ? base + 0.15 : base, 0.03, 0.85))) { kd.bd = (kd.bd || 0) - 4; kept.push(kd); }
        else { skCut(kd); gone.push(kd); }
      }
      S.flags.skAft = null;
      if (!gone.length) { eff({ h: 2, so: 2 });
        return { t: k === 'part' ? L`멀어지게 두려 했지만, ${iga(kn)} 먼저 안부를 물어 왔습니다. 그 뒤로도 이따금 소식을 주고받습니다.` : k === 'theirs' ? L`${iga(kn)} 이따금 먼저 연락해 옵니다. 그때마다 반갑게 맞았습니다.`
          : L`해가 바뀌어도 생일과 명절이면 ${wa(kn)} 안부를 주고받습니다. 한 식구였던 시간은 남았습니다.`, k: 'warm' }; }
      if (!kept.length) { eff({ h: k === 'part' ? -1 : -3 });
        return k === 'part' ? L`${wa(kn)}의 연락은 그렇게 조용히 끊겼습니다.` : k === 'theirs' ? L`${iga(kn)} 다시 찾아오지 않았습니다. 서로의 삶으로 돌아갔습니다.`
          : { t: "Bạn vẫn gửi lời hỏi thăm, nhưng hồi âm thưa dần, rồi vài năm sau thì mất liên lạc.", k: 'bad' }; }
      eff({ h: -1, so: 1 });
      return L`${iga(names(kept))} 이따금 안부를 전해 옵니다.` + ' ' + L`${eun(names(gone))} 연락이 끊겼습니다.`;
    }
  },
  custody: {
    ok: () => custodyKids().length > 0,
    build: () => {
      const c = C(), n = custodyKids().length, ex = S.flags.exName ? callName(S.flags.exName) : "bạn đời cũ", xf = exFar(), sh = custShare(c) > 0 && !xf;
      if (xf) return { title: "Các con sẽ sống với ai?", body: (n > 1 ? L`이혼 뒤 아이 ${n}명이 어디에서 자랄지 정해야 합니다.` : "Sau ly hôn, bạn cần quyết định con sẽ lớn lên ở đâu.") + ' ' + L`${eun(ex)} ${xf.ko}에 삽니다.`, fact: custodyFact(c),
        choices: [{ k: 'me', label: "Tự mình nuôi con", sub: "Có thể nhận tiền cấp dưỡng nuôi con" }, { k: 'them', label: L`${xf.ko}의 ${ex}에게 보낸다`, sub: "Gửi tiền cấp dưỡng nuôi con · Sống xa nhau" }] };
      return { title: "Các con sẽ sống với ai?", body: S.fam.partner && (unionOf(S.fam.partner) !== 'm' || S.fam.partner.sep) ? (n > 1 ? L`헤어진 뒤 아이 ${n}명이 어디에서 자랄지 정해야 합니다.` : "Giờ đã chia tay, bạn cần quyết định con sẽ lớn lên ở đâu.") : n > 1 ? L`이혼 뒤 아이 ${n}명이 어디에서 자랄지 정해야 합니다.` : "Sau ly hôn, bạn cần quyết định con sẽ lớn lên ở đâu."    , fact: custodyFact(c),
        choices: [{ k: 'me', label: "Tự mình nuôi con", sub: "Có thể nhận tiền cấp dưỡng nuôi con" }, { k: 'them', label: L`${ex}에게 맡기고 자주 만난다`, sub: "Gửi tiền cấp dưỡng nuôi con" },
          sh ? { k: 'share', label: "Cùng nuôi con, qua lại giữa hai nhà", sub: "Cần sống gần nhau" } : null].filter(Boolean) };
    },
    apply: k => {
      const c = C(), ks = custodyKids(), n = ks.length, mom = S.sex === 'F' && !S.flags.exSs, ex = S.flags.exName ? callName(S.flags.exName) : "bạn đời cũ";
      S.flags.custOf = null;
      if (!n) return false;
      if (k === 'me' && hadanaOn(c) && !exFar() && !S.flags.custV) {
        const mine = [], theirs = [], young = kd => S.age - kd.bornAt < hadAge(c, kd);
        for (const kd of ks) (young(kd) === mom || chance(HADANA_KEEP) ? mine : theirs).push(kd);
        for (const kd of mine) { kd.cust = mom ? 1 : 0; kd.hd = mom && young(kd) ? 1 : 0; }
        for (const kd of theirs) { kd.cust = mom ? 0 : 1; kd.hd = !mom && young(kd) ? 1 : 0; kd.away = kd.ra = 1; }
        S.flags.custody = mine.length ? 'me' : 'them'; S.flags.custAt = S.age;
        eff(mine.length ? { h: theirs.length ? -3 : -1 } : { h: -6, so: -3 });
        const nms = xs => xs.length === n && n > 1 ? "các con" : xs.length > 1 ? listAnd(xs.map(x => callName(x.name))) : callName(xs[0].name);
        if (!theirs.length) return L`${eul(nms(mine))} 내가 키우기로 했습니다.`;
        if (!mine.length) return { t: L`${eul(nms(theirs))} 키우고 싶었지만 ${ex}에게 맡기게 되었습니다. 주말과 방학마다 만납니다.`, k: 'bad' };
        return { t: L`${eul(nms(mine))} 내가 키우기로 했습니다.` + ' ' + (mom ? L`${eun(nms(theirs))} ${c.ko}의 가족법에 따라 ${ex}의 집에서 살게 되었습니다.` : L`어린 ${eun(nms(theirs))} ${c.ko}의 가족법에 따라 ${ex} 곁에 남았습니다.`), k: 'bad' };
      }
      const got = k === 'them' ? true : k === 'share' ? chance(0.8) : chance(S.flags.custV ? 0.95 : S.flags.exSs ? 0.6 : custGrant(c, mom));
      const res = got ? k : k === 'share' ? (mom ? 'me' : 'them') : 'them';
      S.flags.custody = res; S.flags.custAt = S.age;
      const xf = exFar();
      for (const kd of ks) { kd.cust = 1; if (res === 'them') { kd.away = kd.ra = 1; if (xf) kd.awayIn = xf.id; if (NR_LOST[c.id] && chance(NR_LOST[c.id][0])) { kd.lostAt = S.age + ri(1, 4); kd.lostC = c.id; } } }
      eff(res === 'them' ? { h: -6, so: -3 } : { h: res === 'me' ? -1 : -2 });
      const kn = n > 1 ? "các con" : callName(ks[0].name);
      if (res === 'them' && xf) return k === 'them' ? L`${eul(kn)} ${xf.ko}의 ${ex}에게 보냈습니다. 멀리서 자주 연락하며 지냅니다.` : { t: L`${eul(kn)} 키우고 싶었지만 ${xf.ko}의 ${ex}에게 보내게 되었습니다. 멀리서 자주 연락합니다.`, k: 'bad' };
      if (res === 'share') return L`${wa(ex)} 가까이 살며 ${eul(kn)} 번갈아 키우기로 했습니다.`;
      if (res === 'me') return L`${eul(kn)} 내가 키우기로 했습니다.`;
      return k === 'them' ? L`${eul(kn)} ${ex}에게 맡기고, 주말과 방학마다 만나기로 했습니다.`
        : { t: L`${eul(kn)} 키우고 싶었지만 ${ex}에게 맡기게 되었습니다. 주말과 방학마다 만납니다.`, k: 'bad' };
    }
  },
  divtalk: {
    ok: () => { const P = S.fam.partner; return S.fam.married && !!P && P.alive && !P.divorced; },
    build: () => {
      const c = C(), P = S.fam.partner, who = callName(P.name), law = divLaw(c), m = incomeAt(c, 0.5), hi = c.p === 'hi';
      const recent = S.flags.last_mcrisis != null && S.age - S.flags.last_mcrisis <= 3;
      const agree = S.flags.dtAgree = law === 'free' || chance(clamp(0.3 + (20 - bondScore(P, 'pt')) / 100 + (recent ? 0.2 : 0), 0.15, 0.8)) ? 1 : 0;
      const cA = m * (hi ? 0.05 : 0.03), cC = law === 'talaq' ? m * 0.3 : law === 'annul' ? m * 1.2 : m * (hi ? 0.3 : 0.12);
      S.flags.dtCost = law === 'free' ? 0 : agree && law !== 'annul' ? cA : cC; S.flags.dtLaw = law;
      const poor = !(S.income > 0) && S.money < m * 0.3, kids = custodyKids().length > 0;
      const said = legalWed() ? L`${who}에게 이혼 이야기를 꺼냈습니다.` : L`${who}에게 헤어지자는 이야기를 꺼냈습니다.`;
      const ans = agree ? L`${iga(who)} 한참을 말없이 있다가, 자기도 오래 같은 생각을 해 왔다고 했습니다.` : L`${iga(who)} 놀라며 받아들일 수 없다고 했습니다.`;
      const end = law === 'free' ? { k: 'part', label: "Chia tay", sub: "Thu dọn đồ đạc và sống riêng" }
        : law === 'annul' ? { k: 'annul', label: "Nộp đơn xin tuyên hôn nhân vô hiệu", sub: L`몇 년이 걸려요 · 약 ${wonStr(cC)}` }
        : agree ? { k: 'agree', label: "Thuận tình ly hôn", sub: L`절차 비용 약 ${wonStr(cA)} · 함께 모은 재산을 나눠요` }
        : law === 'talaq' ? { k: 'court', label: "Tuyên bố ly hôn", sub: L`미뤄 두었던 마흐르 약 ${wonStr(cC)}` }
        : { k: 'court', label: "Xin tòa án cho ly hôn", sub: L`1년 남짓 · 소송 비용 약 ${wonStr(cC)}` };
      return { title: legalWed() ? "Chuyện ly hôn" : "Chuyện chia tay",
        body: L`${said} ${ans}` + (poor ? ' ' + "Không có tiền tiết kiệm, cũng không có thu nhập, cuộc sống sau khi chia tay thật mờ mịt." : '') + (kids ? ' ' + "Cũng cần quyết định các con sẽ sống ở đâu." : ''),
        fact: divFact(c),
        choices: [end, { k: 'try', label: "Thử thêm một lần nữa", sub: "Ngồi lại nói chuyện với nhau lần nữa" }, { k: 'back', label: "Rút lại lời đã nói", sub: '' }] };
    },
    apply: k => {
      const c = C(), P = S.fam.partner, who = callName(P.name), W = S.focusW || {}, law = S.flags.dtLaw, cost = S.flags.dtCost || 0;
      if (!S.fam.married || !P || !P.alive) return false;
      if (k === 'back') { eff({ so: -3, h: -1 }); return "Bạn đã rút lại lời. Những điều nói ra hôm ấy còn đọng lại giữa hai người rất lâu."; }
      if (k === 'try') {
        if (chance(clamp(0.3 + 0.35 * (W.family || 0) + (S.st.so - 40) / 250 + (S.flags.dtAgree ? -0.1 : 0.1), 0.1, 0.7))) { S.flags.mfix = S.age; eff({ h: 2, so: 3 }); return L`${wa(who)} 마주 앉아 밤늦도록 이야기했습니다. 한 번 더 해 보기로 했습니다.`; }
        S.flags.last_mcrisis = S.age; eff({ h: -2, so: -2 }); return { t: "Bạn đã cố thử lại, nhưng lòng đã xa nhau thì không dễ quay về." + ' ' + (ptAway() ? "Hai người không chia tay, nhưng giữa hai người vẫn có khoảng cách." : "Hai người không chia tay và vẫn sống chung một nhà, nhưng giữa hai người vẫn có khoảng cách."), k: 'bad' };
      }
      const ok = k === 'part' || k === 'agree' || (k === 'court' && (law === 'talaq' ? chance(0.97) : chance(divCourtP(c)))) || (k === 'annul' && chance(0.6));
      S.money -= cost;
      if (!ok) { S.flags.last_mcrisis = S.age; eff({ h: -5, so: -4 });
        const fam = ['sa', 'mena'].includes(c.p) && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent));
        return { t: k === 'annul' ? L`3년 가까이 걸린 소송 끝에 법원은 혼인 무효를 받아들이지 않았습니다. 법적으로는 여전히 부부입니다. (−${wonStr(cost)})`
          : fam ? L`법원에 이혼을 청했지만 양가 어른들이 나서 말렸고, 끝내 청을 거두었습니다. (−${wonStr(cost)})`
          : L`법원은 아직 혼인을 끝낼 만한 사유가 부족하다고 했습니다. 둘은 한집에서 데면데면하게 지냅니다. (−${wonStr(cost)})`, k: 'bad' }; }
      const how = k === 'part' ? '' : k === 'agree' ? (c.id === 'KOR' ? "Hai người thỏa thuận, nộp hồ sơ lên tòa án và trải qua thời gian cân nhắc lại." : "Hai người thỏa thuận và nộp hồ sơ.")
        : k === 'annul' ? "Sau gần ba năm kiện tụng, tòa án đã chấp nhận tuyên hôn nhân vô hiệu." : law === 'talaq' ? "Bạn tuyên bố ly hôn và trả khoản sính lễ mahr đã hoãn." : "Sau gần một năm kiện tụng, tòa án đã chấp nhận cho ly hôn.";
      if (k === 'annul') S.flags.annulNow = 1;
      const t = divorceNow(c, false);
      eff({ h: 5, so: 2 });
      return { t: (how ? how + ' ' : '') + t + (cost > incomeAt(c, 0.5) * 0.02 ? ' ' + L`(이혼 절차 비용 −${wonStr(cost)})` : ''), k: 'big', post: () => homemakerAlone(false) };
    }
  },
  faithq: {
    ok: p => !!p && !faithHidden() && !S.flags.conv && S.job !== 'prison',
    build: p => {
      const c = C(), r = S.rel, to = relTo(p.to) && p.to !== r ? p.to : null, P = S.fam.partner, priv = privOnly();
      const body = ({ loss: "Từ khi tiễn biệt một người thân, niềm tin bấy lâu không còn chạm đến lòng như trước.",
        abroad: L`${c.ko}에서 산 지 ${S.age - S.migY}년. 이웃들의 예배와 명절이 어느새 익숙해졌습니다.`,
        uni: "Ở đại học, bạn gặp những người có suy nghĩ hoàn toàn khác. Lần đầu tiên, bạn nghĩ lại về niềm tin mình mang từ thuở nhỏ.",
        pt: P && P.name ? L`${callName(P.name)}의 신앙을 곁에서 지켜본 지 여러 해가 되었습니다. 함께 예배에 가 보자는 말을 들었습니다.` : '',
        invite: "Trong một giai đoạn khó khăn, một người bạn rủ bạn cùng đến cộng đồng đức tin của họ." })[p.why] || "Bạn bắt đầu nghĩ lại về niềm tin bấy lâu.";
      if (r === 'N') return { title: "Ngã rẽ đức tin", body, fact: FAITH_FACT(), choices: (to ? [{ k: 'join', label: L`${REL[to]} 신앙을 받아들인다`, sub: "cộng đồng mới · gia đình có thể thấy lạ lẫm" }] : [])
        .concat([{ k: 'visit', label: "Thỉnh thoảng đi cùng", sub: "dù chưa đến mức tin theo" }, { k: 'no', label: "Cứ sống như hiện tại", sub: '' }]) };
      const ch = [{ k: 'keep', label: "Giữ đức tin hiện có", sub: "vững lòng lại" }, { k: 'lapse', label: "Lặng lẽ rời xa", sub: "vẫn theo tôn giáo ấy · không còn đi sinh hoạt" }];
      if (priv) ch.push({ k: 'priv', label: "Buông bỏ, nhưng chỉ trong lòng", sub: "bên ngoài vẫn như cũ · không nói với ai" });
      else { ch.push({ k: 'leave', label: "Buông bỏ đức tin", sub: "không theo tôn giáo nào · gia đình có thể buồn lòng" }); if (to) ch.push({ k: 'other', label: L`${ro(REL[to])} 신앙을 옮긴다`, sub: "cộng đồng mới · gia đình có thể buồn lòng" }); }
      return { title: "Ngã rẽ đức tin", body, fact: priv ? FAITH_FACT_PRIV() : FAITH_FACT(), choices: ch };
    },
    apply: (k, p) => {
      const r = S.rel, to = relTo(p && p.to) && p.to !== r ? p.to : null, fam = x => x ? () => log(x.t, x.k) : undefined;
      if (k === 'keep') { S.flags.faithKeep = S.age; eff({ so: 1, h: 1 }); return "Lòng đang chao đảo đã vững lại. Đức tin lại trở thành chỗ dựa."; }
      if (k === 'no') { S.flags.faithKeep = S.age; return false; }
      if (k === 'visit') { S.flags.faithKeep = S.age; eff({ so: 2 }); return "Thỉnh thoảng bạn đi cùng bạn mình đến các buổi sinh hoạt. Dù chưa đến mức tin theo, mọi người ở đó rất ấm áp."; }
      if (k === 'lapse') { S.flags.lapsed = S.age; eff({ so: -1 }); return famNear() ? L`조용히 ${worshipAt(r)}에 나가지 않게 되었습니다. 그래도 명절이면 가족과 함께 예식을 지켰습니다.` : L`조용히 ${worshipAt(r)}에 나가지 않게 되었습니다. 그래도 명절이면 고향의 가족에게 안부를 전했습니다.`; }
      if (k === 'priv') { S.flags.privFaith = S.age; return "Bạn buông bỏ đức tin, nhưng chỉ trong lòng. Bên ngoài vẫn sống như trước, và không nói với ai."; }
      if (k === 'join' && to) { const f = faithMove(to); eff({ so: 3, h: 2 }); return { t: L`${REL[to]} 모임에 나가기 시작했습니다. 그곳에서 마음을 기댈 곳을 찾았습니다.`, k: 'ev', post: fam(f) }; }
      if (k === 'other' && to) { const f = faithMove(to); eff({ so: 2 }); return { t: L`${ro(REL[to])} 신앙을 옮겼습니다. 새 공동체에서 마음 둘 곳을 찾았습니다.`, k: 'ev', post: fam(f) }; }
      const f = faithMove('N'); eff({ h: 1 });
      return { t: "Bạn quyết định buông bỏ đức tin. Đặt xuống điều đã giữ bấy lâu, lòng bạn vừa trống trải vừa nhẹ nhõm.", k: 'ev', post: fam(f) };
    }
  },
  faithopen: {
    ok: () => S.flags.privFaith != null && S.rel === 'M' && !!S.mig,
    build: () => ({ title: "Giờ thì nói ra chứ?", body: L`${C().ko}에서 산 지 ${S.age - S.migY}년. 마음속으로만 내려놓았던 신앙을 여기서는 숨기지 않아도 됩니다. 다만 고향의 가족은 아직 모릅니다.`,
      fact: FAITH_FACT_PRIV(), choices: [{ k: 'open', label: "Không giấu nữa", sub: "nói rằng mình không theo tôn giáo nào · gia đình có thể rất buồn lòng" }, { k: 'keep', label: "Vẫn giữ trong lòng như hiện tại", sub: '' }] }),
    apply: k => {
      if (k !== 'open') return "Bạn quyết định vẫn giữ điều đó trong lòng như trước.";
      S.flags.privFaith = null; const f = faithMove('N'); eff({ h: 3 });
      return { t: "Bạn quyết định không giấu nữa. Giờ ai hỏi, bạn trả lời rằng mình không theo tôn giáo nào.", k: 'ev', post: f ? () => log(f.t, f.k) : undefined };
    }
  },
  faithwed: {
    ok: () => S.fam.married && !!S.fam.partner && S.fam.partner.rel === 'M' && S.rel !== 'M',
    build: () => {
      const P = S.fam.partner, who = callName(P.name);
      return { title: "Giữa hai đức tin", body: S.sex === 'M' ? L`${who}의 가족은 결혼하려면 이슬람으로 개종해야 한다고 합니다. 많은 이슬람 국가에서는 그래야 혼인이 인정됩니다.` : L`${who}의 가족은 이슬람으로 개종하기를 바랍니다. 개종하지 않아도 결혼은 할 수 있지만, 집안의 눈길이 따라다닐 것 같습니다.`,
        fact: "Theo luật Hồi giáo, đàn ông Hồi giáo được phép kết hôn với phụ nữ Kitô giáo hoặc Do Thái, nhưng phụ nữ Hồi giáo không được kết hôn với đàn ông không theo Hồi giáo. Vì vậy, trong nhiều trường hợp, người chồng cải đạo (Pew Research Center 2013)",
        choices: [{ k: 'conv', label: "Cải đạo sang Hồi giáo", sub: "Học một đức tin mới" }, { k: 'keep', label: "Giữ đức tin của mình", sub: S.sex === 'M' ? "Có thể khó đăng ký kết hôn" : "Quan hệ với gia đình bên ấy có thể nguội lạnh" }] };
    },
    apply: k => {
      const P = S.fam.partner, who = callName(P.name);
      if (k === 'conv') { S.flags.conv = { from: S.rel, at: S.age }; S.rel = 'M'; eff({ so: 3 }); return L`이슬람으로 개종했습니다. ${wa(who)} 함께 처음으로 라마단을 지냈습니다.`; }
      P.bd = (P.bd || 0) - 3; eff({ so: -3 });
      return S.sex === 'M' ? L`내 신앙을 지키기로 했습니다. 혼인은 ${who}의 나라가 아닌 곳에서 신고했고, ${who}의 집안은 오래 서운해했습니다.` : L`내 신앙을 지키기로 했습니다. ${who}의 집안은 오래 서운해했습니다.`;
    }
  },
  sswed: {
    ok: () => !!S.flags.ssWedQ && S.fam.married && !!S.fam.partner && S.fam.partner.alive && !!S.fam.partner.ss,
    build: () => {
      const P = S.fam.partner, who = callName(P.name), F = P.sex === 'F', far = parFar() ? B().ko : '';
      return { title: L`결혼식에 ${eul(parW())} 모실까요?`,
        body: L`${wa(who)} 식을 올릴 날이 다가옵니다.` + ' ' + (far ? (F ? L`${far}에 계신 ${parW()}께서는 함께할 사람이 여자라는 것을 아직 모르십니다.` : L`${far}에 계신 ${parW()}께서는 함께할 사람이 남자라는 것을 아직 모르십니다.`)
          : F ? L`${parW()}께서는 함께할 사람이 여자라는 것을 아직 모르십니다.` : L`${parW()}께서는 함께할 사람이 남자라는 것을 아직 모르십니다.`),
        fact: "Trong số người trưởng thành LGBT ở Mỹ, 56% đã nói thật với mẹ mình là ai, 39% đã nói với bố (Pew Research Center 2013)",
        choices: [{ k: 'tell', label: L`${parW()}께 말씀드리고 식에 모신다`, sub: "Có thể chấp nhận, cũng có thể khó lòng chấp nhận" }, { k: 'quiet', label: "Hai người lặng lẽ làm lễ cưới", sub: L`${parW()}께는 아직 말씀드리지 않는다` }] };
    },
    apply: k => {
      const f = S.flags, q = f.ssWedQ || { h: 0 }, P = S.fam.partner, who = callName(P.name), F = P.sex === 'F'; f.ssWedQ = null;
      if (k === 'quiet') { f.oQuiet = S.age; f.oPar = null;
        return { t: L`${wa(who)} 가까운 친구 몇 명만 불러 조용히 식을 올렸습니다.` + ' ' + L`${parW()}께는 아직 말씀드리지 않았습니다.`, k: 'ev' }; }
      f.oPar = null; f.oNever = null;
      if (chance(oParP())) { f.oTold = 'ok'; eff({ h: 3, so: 2 }); const h = q.h || 0; if (h) S.money += h;
        return { t: F ? L`결혼을 앞두고 ${parW()}께 함께할 사람이 여자라고 말씀드렸습니다. 한참 말이 없으시더니 결혼식에 오시겠다고 하셨습니다.` : L`결혼을 앞두고 ${parW()}께 함께할 사람이 남자라고 말씀드렸습니다. 한참 말이 없으시더니 결혼식에 오시겠다고 하셨습니다.`, k: 'warm',
          post: h ? () => log(L`부모님이 혼례 비용 가운데 ${wonStr(h)}을 보태 주셨습니다.`, 'warm') : undefined }; }
      f.oTold = 'hard'; f.oLater = S.age + ri(3, 8); eff({ h: -4, so: -3 });
      return { t: F ? L`결혼을 앞두고 ${parW()}께 함께할 사람이 여자라고 말씀드렸지만, 받아들이기 어려워하셨습니다. 결혼식에는 오지 않으셨습니다.` : L`결혼을 앞두고 ${parW()}께 함께할 사람이 남자라고 말씀드렸지만, 받아들이기 어려워하셨습니다. 결혼식에는 오지 않으셨습니다.`, k: 'bad' };
    }
  },
  affair: {
    ok: () => S.fam.married && !!S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced && !S.flags.affair,
    build: () => {
      const P = S.fam.partner, who = callName(P.name), ss = P.ss ? true : S.flags.bi ? chance(0.15) : false, sex = ss ? S.sex : S.sex === 'M' ? 'F' : 'M';
      const oldOK = oldFrHere() && !farKin();
      const ex = S.flags.exNm && S.flags.exNm.sex === sex && chance(0.4) ? S.flags.exNm : null, kind = ex ? 'ex' : isWorking() && chance(0.6) ? 'work' : oldOK && chance(0.5) ? 'old' : 'meet';
      const n0 = kind !== 'ex' && kind !== 'old' ? candNat() : null, ncl = n0 && n0 !== S.born && CBY[n0] ? clusterFor(CBY[n0], relPick(CBY[n0])) : S.cl;
      const nm = ex ? ex.n : callName(freshName(ncl, sex)); S.flags.afC = { nm, kind };
      const msg = calYr() >= 2005 ? "tin nhắn" : "thư từ";
      const body = kind === 'work' ? L`함께 일하는 ${wa(nm)} 이야기가 잘 통합니다. 늦게까지 남은 날이면 둘이서 저녁을 먹게 되었습니다. ${who}에게는 말하지 않았습니다.`
        : kind === 'ex' ? L`헤어진 전 배우자 ${nm}에게서 오랜만에 연락이 왔습니다. 잘 지내느냐는 짧은 말에 마음이 흔들립니다.`
        : kind === 'old' ? (sawSchool() ? L`학창 시절 첫사랑 ${wa(nm)} 모임에서 다시 만났습니다. 그 뒤로 ${msg}가 오가고 있습니다.` : L`어린 시절 동네에서 좋아했던 ${wa(nm)} 모임에서 다시 만났습니다.` + ' ' + L`그 뒤로 ${msg}가 오가고 있습니다.`)
        : L`모임에서 알게 된 ${iga(nm)} 자꾸 생각납니다. ${who}에게는 말하지 못한 마음입니다.`;
      return { title: "Lòng xao động", body, fact: "Trong số những người Mỹ đã kết hôn, khoảng 20% nam giới và 13% nữ giới cho biết từng có quan hệ với người khác ngoài bạn đời trong thời gian hôn nhân. Ngoại tình là một trong những lý do ly hôn được nêu nhiều nhất (General Social Survey; Scott và cộng sự 2013)",
        choices: [{ k: 'line', label: "Vạch rõ giới hạn", sub: "Không gặp riêng nữa" }, { k: 'go', label: "Tiếp tục gặp lén lút", sub: "Nếu bị phát hiện, hôn nhân sẽ lung lay" }] };
    },
    apply: k => {
      const A = S.flags.afC || { nm: '' }, P = S.fam.partner, who = P ? callName(P.name) : ''; S.flags.afC = null;
      if (!S.fam.married || !P || !P.alive) return false;
      if (k === 'line') { P.bd = (P.bd || 0) + 2; return A.kind === 'ex' ? L`${A.nm}에게 이제는 각자의 삶을 살자고 답했습니다. 그날 저녁 ${who}의 얼굴을 오래 바라보았습니다.` : L`${A.nm}에게 더는 따로 만나지 않겠다고 말했습니다. 그날 저녁 ${who}의 얼굴을 오래 바라보았습니다.`; }
      S.flags.affair = { nm: A.nm, at: S.age, y: 0 }; (S.flags.affNms || (S.flags.affNms = [])).push(A.nm); eff({ h: -1 });
      return { t: L`${wa(A.nm)} 몰래 만나기 시작했습니다. 마음 한쪽이 늘 불안했습니다.`, k: 'bad' };
    }
  },
  mcrisis: {
    build: () => {
      const c = C(), P = S.fam.partner, who = callName(P.name), W = S.focusW || {}, y = S.age - (S.fam.marriedAt || S.age);
      const cost = incomeAt(c, 0.5) * 0.03, canPay = c.p === 'hi' || c.p === 'eca' || c.p === 'lac' || (S.city && S.pct > 0.6);
      S.flags.mcCost = cost;
      const why = S.flags.mcWhy = mcCause(y), inl = inLawHome(y), mv = incomeAt(c, 0.5) * 0.25; S.flags.mcMove = mv;
      const fam = (W.family || 0) > 0.35 ? " Bạn đã dồn nhiều tâm sức cho gia đình, nhưng lòng người không bao giờ chỉ do nỗ lực của một người quyết định." : '';
      const txt = why === 'work' ? " Mải mê công việc, bạn ít có thời gian bên nhau." : why === 'drink' ? " Rượu và cờ bạc đã phủ bóng tối lên gia đình."
        : why === 'money' ? (S.money < 0 ? " Những ngày cãi nhau vì tiền ngày càng nhiều. Hễ nhắc đến nợ nần và chi phí sinh hoạt là lại lớn tiếng." : " Hai người thường cãi nhau về cách tiêu tiền.")
        : why === 'affair' ? L` ${who}에게 다른 사람이 생긴 것 같습니다. 믿음이 흔들립니다.` + fam
        : why === 'mine' ? L` 내가 몰래 다른 사람을 만나 온 것을 ${iga(who)} 알게 되었습니다. ${who}의 눈을 마주 보기가 어렵습니다.`
        : why === 'inlaw' ? (inl === 'in' ? " Mâu thuẫn với gia đình nhà chồng đã lan sang quan hệ vợ chồng." : inl === 'my' ? L` 함께 사는 부모님과 ${who} 사이의 갈등이 부부 사이로 번졌습니다.` : " Chuyện gia đình hai bên cũng hay khiến hai người bất hòa.")
        : why === 'chores' ? " Nuôi con nhỏ, nỗi buồn lòng cứ chồng chất quanh chuyện ai làm việc nhà và chăm con nhiều hơn."
        : " Chuyện nhỏ nào cũng bất đồng, và câu “chúng ta không hợp nhau” được nói ra thường xuyên." + fam;
      const extra = why === 'work' && isWorking() ? { k: 'less', label: "Bớt làm việc, dành thời gian cho nhau", sub: "Thu nhập giảm một chút" }
        : why === 'inlaw' && inl ? { k: 'move', label: "Tìm nhà dọn ra ở riêng hai người", sub: L`약 ${wonStr(mv)}` }
        : why === 'money' && S.money < 0 ? { k: 'budget', label: "Cùng lập lại kế hoạch chi tiêu gia đình", sub: '' } : null;
      return { title: L`${wa(who)} 사이가 멀어졌습니다`, body: (S.flags.mcAgain ? "Vượt qua khó khăn chưa được bao lâu, hai người lại xa cách. Vượt qua lần nữa khó hơn lần đầu." + ' ' : '') + (legalWed() ? L`결혼한 지 ${y}년. 대화가 줄고 작은 일에도 부딪힙니다.` : L`함께 산 지 ${y}년. 대화가 줄고 작은 일에도 부딪힙니다.`) + txt,
        fact: c.id === 'KOR' && legalWed() ? "Ở Hàn Quốc, các cặp vợ chồng ly hôn nêu lý do nhiều nhất là khác biệt tính cách (43%), tiếp đến là vấn đề kinh tế (khoảng 10%), bạn đời ngoại tình (7%) và bất hòa trong gia đình (7%) (Statistics Korea 2017)"
          : legalWed() ? "Khoảng một nửa số cuộc hôn nhân kết thúc bằng ly hôn đã kết thúc trong vòng 10 năm đầu. Thời gian bên nhau và những cuộc trò chuyện là điều giúp vượt qua khủng hoảng nhiều nhất (OECD Family Database, CDC)" : null,
        choices: [{ k: 'talk', label: "Mở lòng và nói chuyện lại với nhau", sub: '' }, extra, canPay ? { k: 'counsel', label: P.ss ? "Thử đi tư vấn cho các cặp đôi" : "Thử đi tư vấn hôn nhân", sub: L`약 ${wonStr(cost)}` } : null, { k: 'part', label: "Quyết định buông tay nhau", sub: legalWed() ? (noDivorce(c) ? "Ly thân · về pháp lý vẫn là vợ chồng" : "Ly hôn") : "Chia tay" }].filter(Boolean) };
    },
    apply: k => {
      const c = C(), P = S.fam.partner, who = callName(P.name), W = S.focusW || {}, why = S.flags.mcWhy;
      if (!S.fam.married || !P || !P.alive) return false;
      const fault = why === 'affair' ? 'pt' : why === 'mine' ? 'me' : null;
      if (k === 'part') return { t: divorceNow(c, false, fault), k: 'bad', post: () => homemakerAlone(false) };
      if (k === 'counsel') S.money -= S.flags.mcCost;
      if (k === 'less') { S.focus = S.flags.focusPicked = 'family'; S.flags.focusBack = S.flags.focusAuto = null; }
      if (k === 'move') { S.money -= S.flags.mcMove || 0; if (S.flags.stayHome) { S.flags.stayHome = 0; S.flags.left = S.age; } S.flags.ownHome = S.age; S.yearMark = S.yearMark || 'move'; }
      const mod = { temper: 0.03, money: -0.03, affair: -0.15, mine: -0.2, inlaw: -0.03 }[why] || 0, step = k === 'less' || k === 'move' ? 0.2 : k === 'budget' ? 0.12 : 0;
      const p = clamp(0.3 + 0.35 * (W.family || 0) + 0.1 * (W.faith || 0) - 0.15 * (W.work || 0) + (S.st.so - 40) / 250 + (k === 'counsel' ? 0.15 : 0) - (S.alc || S.gamb ? 0.15 : 0) + mod + step - (S.flags.mcAgain ? 0.12 : 0), 0.1, 0.75);
      if (chance(p)) {
        S.flags.mfix = S.age; eff({ h: 3, so: 5 });
        if (k === 'less') return L`일을 줄이고 ${wa(who)} 함께하는 저녁을 늘렸습니다. 다시 웃는 날이 많아졌습니다.`;
        if (k === 'move') return L`둘만의 집으로 옮기고 나서 숨통이 트였습니다. ${wa(who)} 다시 가까워졌습니다. (이사 −${wonStr(S.flags.mcMove || 0)})`;
        if (k === 'budget') return "Cùng nhau sắp xếp lại nợ nần và chi tiêu sinh hoạt, hai người ít cãi nhau hơn.";
        if (why === 'affair') return L`쉽지 않았지만 ${wa(who)} 다시 믿어 보기로 했습니다.`;
        if (why === 'mine') return L`용서를 구하고 또 구했습니다. ${iga(who)} 한 번만 더 믿어 보기로 했습니다. 예전 같아지기까지 오래 걸렸습니다.`;
        return varied('mfix', [L`${wa(who)} 밤늦게까지 이야기를 나눴습니다. 고비를 함께 넘겼습니다.`, L`서로 서운했던 일을 꺼내 놓고 나니 조금 가벼워졌습니다. ${wa(who)} 다시 손을 잡았습니다.`, L`${wa(who)} 다시 함께 걸어 보기로 했습니다.`]);
      }
      if ((why === 'mine' || why === 'affair') && (c.p === 'sa' || c.p === 'mena') && chance(0.92)) { P.bd = (P.bd || 0) - 6; eff({ h: -4 });
        return { t: "Bạn đã cố gắng, nhưng tình cảm không trở lại như xưa. Hai người không ly hôn, nhưng những ngày ít lời dưới một mái nhà cứ thế tiếp diễn.", k: 'bad' }; }
      return { t: "Bạn đã cố gắng, nhưng tình cảm không trở lại như xưa." + ' ' + divorceNow(c, false, fault), k: 'bad', post: () => homemakerAlone(false) };
    }
  },
  hajj: {
    build: () => ({ title: "Đi hành hương Hajj?", body: "Bạn luôn mong một lần trong đời được hành hương đến Mecca.", fact: "Năm 2024, có khoảng 1,83 triệu người hành hương Hajj (Saudi General Authority for Statistics)",
      choices: [{ k: 'go', label: "Lên đường hành hương", sub: L`비용 약 ${wonStr(usd2ppp(C(), 7000))}` }, { k: 'no', label: "Để lần sau", sub: '' }] }),
    apply: k => { S.done.hajj = 1; if (k === 'go') { S.money -= usd2ppp(C(), 7000); eff({ h: 12, so: 6 }); S.yearMark = 'trip'; tripTo('SAU'); return L`메카 순례를 다녀왔습니다. 이제 사람들이 ‘${hajjTitle()}’ 하고 부릅니다.`; } return false; }
  },
  invest: {
    ok: () => S.money > 0,
    build: () => { const c = C();
      return { title: "Dùng khoản tiết kiệm thế nào?", body: L`모은 돈이 ${wonStr(S.money)} (한국 체감)이 되었습니다. 여유 자금을 어디에 둘까요? 나중에 '돈 쓰기·투자'에서 언제든 바꿀 수 있어요.` + (noStock(c) ? '' : ' ' + "Trái phiếu, tự chọn cổ phiếu và nhà cho thuê cũng có ở đó."),
        fact: noStock(c) ? L`${c.ko}에는 일반 사람이 주식을 사고팔 수 있는 증권시장이 사실상 없습니다. 장기 실질 수익률은 대략 예금 1~2%, 주택 3% 안팎입니다 (UBS Global Investment Returns Yearbook 등)`
          : c.p === 'hi' ? "Lợi suất thực dài hạn vào khoảng 1–2% với tiền gửi ngân hàng, quanh 5% mỗi năm với cổ phiếu (dao động ±17% từ năm này sang năm khác) và quanh 3% với nhà ở (UBS Global Investment Returns Yearbook và các nguồn khác)"
          : "Lợi suất thực dài hạn vào khoảng 1–2% với tiền gửi ngân hàng, quanh 5% mỗi năm với cổ phiếu và quanh 3% với nhà ở. Cổ phiếu ở các thị trường mới nổi dao động mạnh hơn, khoảng ±22% mỗi năm (UBS Global Investment Returns Yearbook, chỉ số MSCI Emerging Markets)",
        choices: [{ k: 'cash', label: "Gửi tiết kiệm ngân hàng", sub: "1–1,5% mỗi năm sau lạm phát · gần như an toàn" }, { k: 'mix', label: "Bỏ vào quỹ cân bằng nửa cổ phiếu nửa trái phiếu", sub: "Trung bình 3,5% mỗi năm sau lạm phát · dao động vừa" }, { k: 'stock', label: "Đầu tư cổ phiếu", sub: "Trung bình 5% mỗi năm sau lạm phát · có thể lao dốc" }, { k: 'property', label: "Đầu tư bất động sản", sub: "Trung bình 3,5% mỗi năm sau lạm phát · biến động vừa" }].filter(x => (x.k === 'cash' || x.k === 'property' || !noStock(c)) && (x.k !== 'property' || propOK())) }; },
    apply: k => { const was = S.invest || 'cash', N = INV_NM(); S.invest = k; S.flags.invG = 0; S.flags.invM = 0; invMark(k);
      return k === was ? L`모은 돈은 ${N[k]}에 그대로 두기로 했습니다.` : was === 'cash' ? L`예금을 빼서 ${N[k]}에 넣었습니다.` : k === 'cash' ? L`${eul(N[was])} 모두 팔아 예금으로 옮겼습니다.` : L`${eul(N[was])} 팔아 ${N[k]}에 넣었습니다.`; }
  },
  loan: {
    ok: () => S.money < 0,
    build: () => (S.flags.loanDebt = -S.money, { title: "Nợ đã phình to", body: L`빚이 ${wonStr(-S.money)} (한국 체감)입니다.`, fact: lowInc(C()) ? "Khoảng 24% người trưởng thành trên thế giới không có tài khoản ngân hàng (World Bank Findex 2021)" : null,
      choices: [{ k: 'family', label: "Nhờ gia đình giúp đỡ", sub: "Quan hệ↓" }, { k: 'lender', label: lowInc(C()) ? "Vay của người cho vay nặng lãi" : "Đảo nợ sang khoản vay khác", sub: "Tiền lãi" }, ...(revMortOK() ? [{ k: 'equity', label: C().id === 'KOR' ? "Đăng ký lương hưu từ nhà ở" : "Thế chấp nhà để nhận lương hưu tuổi già (thế chấp ngược)", sub: "Vẫn ở nhà mình và nhận tiền hằng tháng · giá trị nhà để lại cho con cháu sẽ giảm" }] : []), ...loanSells()] }),
    apply: k => {
      const debt = -S.money; if (!(debt > 0)) return "Đến lúc đó bạn đã trả hết nợ, nên không cần nhờ ai giúp nữa.";
      if (k === 'family') { const fam = famHelpWho(), x = familyHelp(debt); S.money += x; eff({ so: -6 }); return L`${fam ? "gia đình và họ hàng" : "bạn bè"}이 형편껏 모아 준 ${wonStr(x)}으로 빚 일부를 갚았습니다. 남은 빚은 ${wonStr(Math.max(0, -S.money))}입니다.`; }
      if (k === 'equity') { const lump = Math.min(debt, S.house * 0.3), y = S.house * revRate(); S.money += lump; S.house = Math.max(0, S.house - lump * 1.03); S.flags.revM = { y, at: S.age }; eff({ h: 3 });
        return { t: (C().id === 'KOR' ? "Bạn đã đăng ký lương hưu từ nhà ở với căn nhà mình đang sống." : "Bạn đã thế chấp căn nhà đang sống để nhận lương hưu tuổi già.") + ' ' + L`빚 ${wonStr(lump)}을 갚고, 앞으로 해마다 ${wonStr(y)}씩 받습니다.`, k: 'big', f: "Lương hưu từ nhà ở (thế chấp ngược) cho phép bạn vẫn sống trong nhà mình mà nhận dần giá trị căn nhà dưới dạng lương hưu; chế độ này có ở Hàn Quốc, Mỹ, Anh, Canada, Úc, Nhật Bản và nhiều nơi khác. Khoản phải trả được quyết toán từ giá trị căn nhà khi bán hoặc khi thừa kế (Korea Housing Finance Corporation, US HUD)" }; }
      if (k === 'sellr') { const t = rentSell(); eff({ h: -2 }); return { t: t || "Không có gì đáng để bán. Khoản nợ vẫn còn nguyên.", k: 'bad' }; }
      if (k === 'sellv' || k === 'sellh') {
        const veh = k === 'sellv', sold = veh ? loanVehicles() : ["căn nhà"];
        const v = veh ? (S.owns.car ? carValue() : 0) + (S.owns.moto ? usd2ppp(C(), 500) : 0) : S.house * 0.9;
        if (veh) { delete S.owns.car; delete S.owns.moto; } else { S.house = 0; delete S.owns.house; }
        S.money += v; eff({ h: veh ? -3 : -6 });
        if (!sold.length || v <= 0) return { t: "Không có gì đáng để bán. Khoản nợ vẫn còn nguyên.", k: 'bad' };
        return { t: L`${eul(listAnd(sold))} 팔아 ${wonStr(v)}을 마련했습니다. ${S.money >= 0 ? "Bạn đã trả hết nợ." : L`남은 빚은 ${wonStr(-S.money)}입니다.`}`, k: 'bad' };
      }
      if (k === 'sell') {
        const sold = [S.house > 0 ? "căn nhà" : null, S.owns.car ? "ô tô" : null, S.owns.moto ? "xe máy" : null].filter(Boolean);
        const v = S.house * 0.9 + (S.owns.car ? usd2ppp(C(), 6000) : 0) + (S.owns.moto ? usd2ppp(C(), 500) : 0); S.money += v; S.house = 0; delete S.owns.car; delete S.owns.moto; if (v > 0) delete S.owns.house; eff({ h: -6 });
        if (!sold.length) return { t: "Không có gì đáng để bán. Khoản nợ vẫn còn nguyên.", k: 'bad' };
        return { t: L`${eul(listAnd(sold))} 팔아 ${wonStr(v)}을 마련했습니다. ${S.money >= 0 ? "Bạn đã trả hết nợ." : L`남은 빚은 ${wonStr(-S.money)}입니다.`}`, k: 'bad' };
      }
      S.money -= debt * 0.1; return { t: L`${lowInc(C()) ? "Bạn vay người cho vay nặng lãi để trả những khoản nợ gấp nhất" : "Bạn đã đảo nợ sang khoản vay khác"}. 이자로 빚이 ${wonStr(debt * 0.1)} 늘었습니다.`, k: 'bad' };
    }
  },
  vhts_startup: {
    ok: () => S.age >= 20 && S.age <= 55 && !S.flags.vhts_startup_done,
    build: () => ({
      title: 'Khởi nghiệp Công nghệ hay Đi làm Thuê ổn định?',
      body: `Ở tuổi ${S.age}, cơ hội gia nhập một dự án khởi nghiệp tiềm năng mở ra trước mắt. Đi kèm với cơ hội bứt phá tài chính là rủi ro trắng tay và kiệt sức kéo dài.`,
      fact: 'Theo thống kê của Startup Genome, hơn 90% startup công nghệ thất bại trong 3 năm đầu, nhưng các nhà sáng lập thành công sở hữu mức tích lũy tài sản gấp 12 lần mức trung bình.',
      choices: [
        { k: 'all_in', label: 'Dốc toàn lực khởi nghiệp (Mạo hiểm cao, lợi nhuận lớn)', sub: 'Tiêu hao năng lượng và sức khỏe, cơ hội nhảy vọt tài chính' },
        { k: 'side_hustle', label: 'Vừa đi làm vừa phát triển dự án phụ', sub: 'Tăng trưởng thu nhập vừa phải, tăng áp lực cuộc sống' },
        { k: 'stable', label: 'Chọn sự ổn định, từ chối rủi ro phiêu lưu', sub: 'Bảo toàn sức khỏe và sự thanh thản' }
      ]
    }),
    apply: k => {
      S.flags.vhts_startup_done = 1;
      if (k === 'all_in') {
        const win = Math.random() < (0.35 + (S.tal ? 0.15 : 0) + (S.st.sm > 65 ? 0.1 : 0));
        if (win) {
          const reward = Math.max(50000000, S.income * 3.5);
          S.money += reward;
          eff({ sm: 8, h: 10, hl: -4 });
          log(`Dự án khởi nghiệp thành công vang dội! Bạn thu hút vốn đầu tư và tạo ra bước nhảy vọt tài chính với lợi nhuận vượt trội.`, 'good', 'Dữ liệu GEM Global Entrepreneurship Monitor');
        } else {
          S.money = Math.max(0, S.money - 20000000);
          eff({ sm: 5, h: -10, hl: -6, so: -5 });
          log(`Dự án khởi nghiệp dừng bước sau thời gian dài cạn vốn. Dù tổn thất tài chính, bạn tích lũy kinh nghiệm quản trị thương trường vô giá.`, 'bad');
        }
      } else if (k === 'side_hustle') {
        S.money += 15000000;
        eff({ h: -3, hl: -3, sm: 4 });
        log(`Bạn duy trì dự án phụ ngoài giờ làm việc. Nguồn thu nhập thứ hai giúp củng cố quỹ dự phòng tài chính gia đình.`, 'ev');
      } else {
        eff({ hl: 3, h: 4, so: 4 });
        log(`Bạn ưu tiên sự an toàn và ổn định của bản thân, giữ gìn nhịp sống cân bằng và bình yên.`, 'ev');
      }
    }
  },
  vhts_burnout: {
    ok: () => S.age >= 24 && S.age <= 60 && isWorking(),
    build: () => ({
      title: 'Khủng hoảng Kiệt sức (Burnout) vì Áp lực Công việc',
      body: 'Những ca làm thêm thấu đêm và áp lực chỉ tiêu đè nặng khiến sức khỏe tinh thần và thể chất sụt giảm nghiêm trọng.',
      fact: 'Nghiên cứu của WHO/ILO ước tính làm việc trên 55 giờ mỗi tuần làm tăng 35% nguy cơ đột quỵ và 17% nguy cơ tử vong do bệnh tim thiếu máu cục bộ.',
      choices: [
        { k: 'rest', label: 'Tạm nghỉ việc 6 tháng để phục hồi thể chất & tâm trí', sub: 'Giảm thu nhập tạm thời, phục hồi mạnh chỉ số sức khỏe' },
        { k: 'boundary', label: 'Thiết lập ranh giới làm việc nghiêm ngặt, từ chối tăng ca', sub: 'Cân bằng nhịp sống, giảm nhẹ tốc độ thăng tiến' },
        { k: 'endure', label: 'Cắn răng chịu đựng để giữ vị trí và thu nhập', sub: 'Tiếp tục nhận lương nhưng sức khỏe suy giảm' }
      ]
    }),
    apply: k => {
      if (k === 'rest') {
        S.money = Math.max(0, S.money - Math.round(S.income * 0.3));
        eff({ hl: 12, h: 10, sm: 2 });
        log(`Bạn quyết định dành trọn một kỳ nghỉ dài để tĩnh dưỡng và tái tạo năng lượng sống. Thể lực và tinh thần dần bình phục kỳ diệu.`, 'good');
      } else if (k === 'boundary') {
        eff({ hl: 6, h: 5, so: 4 });
        log(`Bạn kiên quyết từ chối các cuộc gọi công việc ngoài giờ hành chính. Nhịp sinh hoạt gia đình trở nên điều độ hơn.`, 'ev');
      } else {
        eff({ hl: -12, h: -8, sm: 3 });
        log(`Áp lực triền miên bào mòn sức đề kháng. Cơ thể bạn thường xuyên phát tín hiệu mệt mỏi và mất ngủ kéo dài.`, 'bad', 'Cảnh báo dịch tễ học WHO về hội chứng kiệt sức lao động');
      }
    }
  },
  vhts_invest: {
    ok: () => S.age >= 22 && S.money > 10000000,
    build: () => ({
      title: 'Chiến lược Phân bổ Tài sản & Tích lũy Dài hạn',
      body: `Tài khoản tích lũy của bạn đã đạt mức ${wonStr(S.money)}. Bạn sẽ phân bổ tài chính thế nào giữa thời kỳ biến động kinh tế?`,
      fact: 'Theo dữ liệu lịch sử 100 năm của S&P 500 và Credit Suisse Global Investment Returns, chiến lược danh mục đa dạng hóa mang lại lợi suất thực trung bình 5-6%/năm vượt lạm phát.',
      choices: [
        { k: 'etf', label: 'Đầu tư định kỳ vào Quỹ chỉ số đa dạng hóa toàn cầu', sub: 'Lợi nhuận bền vững, giảm thiểu rủi ro biến động cục bộ' },
        { k: 'crypto', label: 'Phân bổ 30% vào tài sản số & công nghệ mới nổi', sub: 'Biên độ dao động cực lớn, có thể nhân tài sản hoặc mất vốn' },
        { k: 'cash', label: 'Gửi tiết kiệm ngân hàng và giữ tiền mặt thanh khoản', sub: 'An toàn tuyệt đối nhưng chịu hao mòn bởi lạm phát' }
      ]
    }),
    apply: k => {
      if (k === 'etf') {
        const gain = Math.round(S.money * 0.12);
        S.money += gain;
        eff({ h: 4, sm: 4 });
        log(`Chiến lược đầu tư có kỷ luật phát huy tác dụng. Giá trị tài sản gia tăng ổn định cùng đà tăng trưởng kinh tế.`, 'good');
      } else if (k === 'crypto') {
        const bull = Math.random() < 0.45;
        if (bull) {
          const gain = Math.round(S.money * 0.4);
          S.money += gain;
          eff({ h: 8, sm: 2 });
          log(`Làn sóng tăng trưởng tài sản số mang lại khoản lợi nhuận đột biến cho danh mục đầu tư mạo hiểm của bạn.`, 'good');
        } else {
          const loss = Math.round(S.money * 0.25);
          S.money = Math.max(0, S.money - loss);
          eff({ h: -6, sm: 3 });
          log(`Thị trường điều chỉnh mạnh khiến giá trị phần tài sản số sụt giảm đáng kể. Bạn học được bài học đắt giá về kỷ luật quản trị vốn.`, 'bad');
        }
      } else {
        eff({ h: 2 });
        log(`Bạn kiên định duy trì dự trữ tiền mặt an toàn, đảm bảo nguồn tài chính sẵn sàng ứng phó mọi biến cố.`, 'ev');
      }
    }
  },
  vhts_creator: {
    ok: () => S.age >= 18 && S.age <= 48 && !S.flags.vhts_creator_done,
    build: () => ({
      title: 'Cơ hội Thử sức Lĩnh vực Sáng tạo Nội dung Số',
      body: 'Bạn có đam mê chia sẻ kiến thức, nghệ thuật hoặc phong cách sống trên các nền tảng mạng xã hội đa quốc gia.',
      fact: 'Theo báo cáo Oxford Economics, nền kinh tế sáng tạo (Creator Economy) đóng góp hơn 35 tỷ USD vào GDP toàn cầu và tạo ra hàng triệu việc làm tự do linh hoạt.',
      choices: [
        { k: 'pro', label: 'Đầu tư bài bản thiết bị và nội dung chuyên sâu', sub: 'Tiêu hao vốn ban đầu, có cơ hội xây dựng thương hiệu cá nhân lớn' },
        { k: 'hobby', label: 'Làm nội dung như một sở thích giải trí bán thời gian', sub: 'Không tốn phí, mở rộng thêm các mối quan hệ xã hội' },
        { k: 'skip', label: 'Bỏ qua, tập trung vào công việc chuyên môn hiện tại', sub: 'Bảo tồn thời gian cá nhân' }
      ]
    }),
    apply: k => {
      S.flags.vhts_creator_done = 1;
      if (k === 'pro') {
        const viral = Math.random() < 0.4;
        if (viral) {
          S.money += 45000000;
          eff({ so: 10, h: 8, sm: 6 });
          log(`Kênh nội dung của bạn được cộng đồng đón nhận nồng nhiệt, mang về hợp đồng tài trợ và nguồn thu nhập thụ động bền vững.`, 'good');
        } else {
          eff({ so: 5, sm: 4, h: -2 });
          log(`Dù chưa đạt được độ nhận diện bùng nổ, việc sản xuất nội dung giúp bạn kết nối được nhiều bằng hữu cùng chí hướng.`, 'ev');
        }
      } else if (k === 'hobby') {
        eff({ so: 4, h: 4 });
        log(`Bạn duy trì góc chia sẻ cá nhân định kỳ, tìm thấy niềm vui mộc mạc sau những giờ làm việc căng thẳng.`, 'ev');
      }
    }
  },
  vhts_career_pivot: {
    ok: () => S.age >= 28 && S.age <= 52 && isWorking() && !S.flags.vhts_pivot_done,
    build: () => ({
      title: 'Chuyển đổi Ngành nghề hay Tiếp tục Bám trụ?',
      body: 'Sự xuất hiện của công nghệ mới và tự động hóa đang làm thay đổi căn bản cấu trúc ngành nghề của bạn.',
      fact: 'Báo cáo Tương lai Việc làm của Diễn đàn Kinh tế Thế giới (WEF) chỉ ra 44% kỹ năng cốt lõi của người lao động sẽ bị xáo trộn sau mỗi chu kỳ 5 năm.',
      choices: [
        { k: 'reskill', label: 'Đăng ký chương trình đào tạo lại chuyên sâu về công nghệ', sub: 'Đầu tư học phí và thời gian, nâng cao năng lực cạnh tranh dài hạn' },
        { k: 'stay', label: 'Tận dụng bề dày kinh nghiệm hiện có, kiên trì phát huy thế mạnh', sub: 'Bảo đảm thu nhập ngắn hạn trước mắt' }
      ]
    }),
    apply: k => {
      S.flags.vhts_pivot_done = 1;
      if (k === 'reskill') {
        eff({ sm: 8, h: 4, hl: -2 });
        S.income = Math.round(S.income * 1.25);
        log(`Hoàn thành chứng chỉ công nghệ mới, bạn tự tin đảm nhận các dự án chuyển đổi số và nâng tầm thu nhập đáng kể.`, 'good');
      } else {
        eff({ h: 2, sm: 2 });
        log(`Bạn phát huy triệt để vốn sống và kinh nghiệm thực chiến dày dạn, củng cố vị thế chuyên gia tại đơn vị công tác.`, 'ev');
      }
    }
  },
  vhts_care_elder: {
    ok: () => S.age >= 35 && S.age <= 65 && ((S.fam.mom && S.fam.mom.alive && S.fam.mom.age >= 70) || (S.fam.dad && S.fam.dad.alive && S.fam.dad.age >= 70)) && !S.flags.vhts_elder_done,
    build: () => ({
      title: 'Chăm sóc Cha Mẹ Già yếu khi Sức khỏe Suy giảm',
      body: 'Cha mẹ tuổi xế chiều cần sự đỡ đần thường xuyên về y tế và sinh hoạt hàng ngày.',
      fact: 'Theo Khảo sát Lão hóa Toàn cầu của WHO, mô hình gia đình đa thế hệ hỗ trợ chăm sóc lẫn nhau giúp kéo dài kỳ vọng sống bình quân của người cao tuổi thêm 3,2 năm.',
      choices: [
        { k: 'home_care', label: 'Đón cha mẹ về sống chung và tận tâm phụng dưỡng', sub: 'Gia tăng trách nhiệm sinh hoạt, làm tròn đạo hiếu gia đình' },
        { k: 'prof_service', label: 'Thuê dịch vụ y tế và điều dưỡng chuyên trách hỗ trợ', sub: 'Tốn kém chi phí y tế định kỳ, duy trì chất lượng chăm sóc chuyên môn' },
        { k: 'split_sib', label: 'Họp bàn anh chị em luân phiên san sẻ trách nhiệm', sub: 'Hài hòa gánh nặng giữa các thành viên' }
      ]
    }),
    apply: k => {
      S.flags.vhts_elder_done = 1;
      if (k === 'home_care') {
        eff({ so: 8, h: 5, hl: -3 });
        log(`Ngôi nhà rộn rã ấm cúng khi các thế hệ quây quần sum họp. Bạn chu toàn phụng dưỡng đấng sinh thành lúc tuổi xế chiều.`, 'good');
      } else if (k === 'prof_service') {
        S.money = Math.max(0, S.money - 15000000);
        eff({ h: 4, so: 4 });
        log(`Nhờ chế độ điều dưỡng chuyên biệt, cha mẹ bạn duy trì được phác đồ hồi phục thể trạng ổn định và an tâm an dưỡng.`, 'ev');
      } else {
        eff({ so: 5, h: 3 });
        log(`Các anh chị em cùng ngồi lại thảo luận chân thành, chia sẻ công việc chăm sóc cha mẹ một cách vẹn toàn.`, 'ev');
      }
    }
  },
  vhts_whistleblower: {
    ok: () => S.age >= 26 && S.age <= 60 && isWorking() && !S.flags.vhts_wb_done,
    build: () => ({
      title: 'Đứng Trước Lằn Ranh Đạo đức Nghề nghiệp',
      body: 'Bạn tình cờ phát hiện sai phạm nghiêm trọng có nguy cơ tổn hại đến người tiêu dùng và an toàn công cộng tại tổ chức đang làm việc.',
      fact: 'Báo cáo của ACFE (Hiệp hội Giám sát Gian lận Toàn cầu) chỉ ra hơn 43% các vụ án kinh tế được đưa ra ánh sáng nhờ nguồn tin từ người lao động nội bộ dũng cảm lên tiếng.',
      choices: [
        { k: 'expose', label: 'Lên tiếng tố giác sai phạm ra cơ quan chức năng bảo vệ công lý', sub: 'Đối mặt nguy cơ bị trả đũa công việc, giữ gìn thanh danh và lương tâm' },
        { k: 'internal', label: 'Báo cáo bảo mật lên ban lãnh đạo cao nhất yêu cầu thanh tra nội bộ', sub: 'Hạn chế xung đột trực diện, kỳ vọng sửa sai từ bên trong' },
        { k: 'silent', label: 'Giữ im lặng và âm thầm tìm kiếm nơi làm việc mới', sub: 'Bảo toàn sự bình an cho bản thân và gia đình' }
      ]
    }),
    apply: k => {
      S.flags.vhts_wb_done = 1;
      if (k === 'expose') {
        eff({ sm: 10, h: 6, so: -4 });
        log(`Bạn dũng cảm công bố sự thật vì lợi ích cộng đồng. Dù con đường sau đó gặp không ít khó khăn thử thách, bạn luôn ngẩng cao đầu với lương tâm trong sạch.`, 'good');
      } else if (k === 'internal') {
        eff({ sm: 5, h: 3 });
        log(`Báo cáo nội bộ kín đáo của bạn thúc đẩy ban lãnh đạo tiến hành rà soát quy trình quản trị rủi ro kịp thời.`, 'ev');
      } else {
        eff({ h: -3, sm: -2 });
        log(`Bạn chọn cách rút lui trong im lặng, tránh xa những thị phi và bảo đảm an toàn sinh kế gia đình.`, 'ev');
      }
    }
  },
  vhts_debtcrisis: {
    ok: () => S.age >= 25 && S.money < 0 && !S.flags.vhts_debt_resolved,
    build: () => ({
      title: 'Tái Cấu trúc Nợ nần & Khôi phục Tự chủ Tài chính',
      body: 'Gánh nặng nợ phát sinh từ các chi phí y tế bất ngờ hoặc làm ăn thua lỗ đang bào mòn tâm lý của bạn.',
      fact: 'Theo Ngân hàng Thế giới, việc tham vấn tái cơ cấu nợ kịp thời giúp giảm 70% nguy cơ phá sản cá nhân không thể đảo ngược.',
      choices: [
        { k: 'restructure', label: 'Lập kế hoạch thắt lưng buộc bụng và đàm phán giãn nợ ngân hàng', sub: 'Hạ nhẹ áp lực lãi suất tức thời, cam kết trả nợ dài hạn' },
        { k: 'family_help', label: 'Mở lời nhờ gia đình họ hàng hỗ trợ tạm thời', sub: 'Giảm gánh nợ tài chính, dựa vào tình thân trợ lực' },
        { k: 'extra_work', label: 'Nhận thêm hai công việc bán thời gian để tối đa hóa thu nhập', sub: 'Tăng tốc độ trả nợ nhưng tiêu hao thể lực' }
      ]
    }),
    apply: k => {
      S.flags.vhts_debt_resolved = 1;
      if (k === 'restructure') {
        eff({ h: 6, hl: 2, sm: 4 });
        log(`Đàm phán giãn tiến độ trả nợ thành công giúp bạn trút bỏ phần lớn áp lực tinh thần, từng bước ổn định lại cuộc sống.`, 'good');
      } else if (k === 'family_help') {
        S.money = 0;
        eff({ so: 6, h: 5 });
        log(`Tình thân gia đình dang rộng vòng tay che chở lúc ngặt nghèo. Khoản hỗ trợ quý báu giúp bạn giải tỏa dứt điểm cơn khủng hoảng nợ.`, 'good');
      } else {
        S.money = Math.round(S.money * 0.5);
        eff({ hl: -8, h: -4, sm: 5 });
        log(`Bạn nỗ lực làm việc cật lực ngày đêm để thanh toán dứt điểm các khoản nợ quá hạn, từng bước vươn lên.`, 'ev');
      }
    }
  },
  vhts_legacy: {
    ok: () => S.age >= 68 && S.money > 20000000 && !S.flags.vhts_legacy_done,
    build: () => ({
      title: 'Tâm nguyện Di sản Cuộc đời & Đóng góp Xã hội',
      body: 'Khi bước sang sườn dốc bên kia của cuộc đời, bạn ngẫm nghĩ về những gì mình muốn để lại cho thế hệ mai sau.',
      fact: 'Các nghiên cứu tâm lý học phát triển từ Đại học Harvard chỉ ra việc cống hiến cho thế hệ sau (Generativity) là chỉ dấu mạnh nhất dự báo sự viên mãn của tuổi già.',
      choices: [
        { k: 'scholarship', label: 'Trích quỹ thành lập học bổng khuyến học cho học sinh nghèo vượt khó', sub: 'Gieo hạt mầm tri thức, lan tỏa phúc đức lâu dài' },
        { k: 'family_trust', label: 'Lập quỹ gia tộc bảo bọc học vấn cho các cháu chắt', sub: 'Giữ gìn truyền thống và bảo đảm tương lai hậu duệ' },
        { k: 'memoir', label: 'Dành thời gian ghi chép hồi ký truyền lại bài học nhân sinh', sub: 'Lưu giữ ký ức và trải nghiệm sống cho con cháu' }
      ]
    }),
    apply: k => {
      S.flags.vhts_legacy_done = 1;
      if (k === 'scholarship') {
        S.money = Math.max(0, S.money - 20000000);
        eff({ h: 12, so: 8 });
        log(`Quỹ học bổng mang tên bạn chính thức đi vào hoạt động, chắp cánh ước mơ đến trường cho những đứa trẻ hiếu học.`, 'good');
      } else if (k === 'family_trust') {
        eff({ h: 8, so: 8 });
        log(`Bạn chu đáo thiết lập quỹ dự phòng học tập cho các thế hệ con cháu, gửi gắm trọn vẹn tình thương gia tộc.`, 'good');
      } else {
        eff({ h: 10, sm: 6 });
        log(`Tập hồi ký chắt lọc những thăng trầm đời người hoàn thành, trở thành cuốn gia phả tinh thần vô giá cho con cháu.`, 'good');
      }
    }
  },
  vhts_divorce: {
    ok: () => S.age >= 26 && S.fam.married && S.fam.partner && S.fam.partner.alive && !S.flags.vhts_div_done,
    build: () => ({
      title: 'Đối diện Rạn nứt Hôn nhân Sau Nhiều Năm Gắn bó',
      body: 'Những bất đồng quan điểm sống và khoảng cách vô hình kéo dài khiến cuộc hôn nhân đứng trước ngã ba đường.',
      fact: 'Theo số liệu thống kê hộ gia đình OECD, tỷ lệ ly hôn toàn cầu đạt mức 35-45%, và việc giải quyết hòa bình giúp giảm 60% tác động tiêu cực tới tâm lý con cái.',
      choices: [
        { k: 'counseling', label: 'Cùng nhau đi tư vấn tâm lý hôn nhân để tìm tiếng nói chung', sub: 'Nỗ lực thấu hiểu và hàn gắn tình cảm gia đình' },
        { k: 'peace_split', label: 'Thuận tình ly hôn trong hòa bình và tôn trọng lẫn nhau', sub: 'Giải thoát cho nhau, cùng có trách nhiệm với con cái' },
        { k: 'coexist', label: 'Tiếp tục duy trì cuộc sống vì trách nhiệm với con nhỏ', sub: 'Bảo đảm vỏ bọc gia đình trọn vẹn' }
      ]
    }),
    apply: k => {
      S.flags.vhts_div_done = 1;
      if (k === 'counseling') {
        eff({ h: 8, so: 6 });
        log(`Những buổi trò chuyện cởi mở cùng chuyên gia tâm lý giúp hai bạn lắng nghe và thấu hiểu vết thương của nhau, thắp lại ngọn lửa tình cảm.`, 'good');
      } else if (k === 'peace_split') {
        S.fam.married = false;
        S.fam.partner = null;
        eff({ h: 4, so: -2 });
        log(`Hai người quyết định dừng lại trong văn minh và sự tôn trọng, bắt đầu một chương mới độc lập và thanh thản hơn.`, 'ev');
      } else {
        eff({ h: -5, hl: -2 });
        log(`Bạn chấp nhận sống chung dưới một mái nhà vì nghĩa vụ làm cha mẹ, giữ gìn mái ấm bình lặng cho các con khôn lớn.`, 'ev');
      }
    }
  },
  vhts_fertility: {
    ok: () => S.age >= 24 && S.age <= 40 && S.fam.married && S.fam.kids.length === 0 && !S.flags.vhts_fert_done,
    build: () => ({
      title: 'Kế hoạch Sinh con & Tiếp nối Thế hệ',
      body: 'Gia đình hai bên và người bạn đời mong muốn có thêm tiếng cười trẻ thơ trong mái ấm.',
      fact: 'Theo Ngân hàng Thế giới (WPP 2024), tỷ suất sinh toàn cầu đã giảm từ 5 con/phụ nữ năm 1950 xuống còn 2,2 hiện nay do chi phí nuôi dạy con cái gia tăng.',
      choices: [
        { k: 'have_baby', label: 'Quyết định sinh con và chuẩn bị chu đáo điều kiện nuôi dạy', sub: 'Đón nhận niềm hạnh phúc làm cha mẹ, gia tăng trách nhiệm kinh tế' },
        { k: 'delay', label: 'Hoãn lại vài năm để tập trung củng cố sự nghiệp vững chắc', sub: 'Tối ưu hóa tài chính trước mắt' },
        { k: 'dink', label: 'Thống nhất lối sống gia đình không sinh con (DINK)', sub: 'Tự do tài chính và thời gian cá nhân tuyệt đối' }
      ]
    }),
    apply: k => {
      S.flags.vhts_fert_done = 1;
      if (k === 'have_baby') {
        const babyAge = S.age;
        S.fam.kids.push({ bornAt: babyAge, sex: Math.random() < 0.5 ? 'M' : 'F', alive: true });
        S.stats.kidsBorn = (S.stats.kidsBorn || 0) + 1;
        eff({ h: 12, so: 8, hl: -2 });
        log(`Thiên thần nhỏ cất tiếng khóc chào đời trong niềm hân hoan vô bờ bến của cả gia đình.`, 'good');
      } else if (k === 'delay') {
        eff({ sm: 4, h: 2 });
        log(`Hai bạn thống nhất tập trung xây dựng nền tảng tài chính vững vàng trước khi đón nhận thiên chức làm cha mẹ.`, 'ev');
      } else {
        eff({ h: 4, sm: 3 });
        log(`Lựa chọn lối sống linh hoạt giúp hai bạn tận hưởng trọn vẹn những chuyến hành trình trải nghiệm thế giới cùng nhau.`, 'ev');
      }
    }
  },
  vhts_fast_money: {
    ok: () => S.age >= 20 && S.age <= 50 && !S.flags.vhts_fm_done,
    build: () => ({
      title: 'Lời Mời Tham Gia Dự Án Đầu Tư Lãi Suất Bất Thường',
      body: 'Một người quen giới thiệu cơ hội góp vốn lợi nhuận cam kết 30%/tháng với giải thích là thuật toán giao dịch nội bộ.',
      fact: 'Ủy ban Chứng khoán và Giao dịch Quốc tế (IOSCO) khuyến cáo: Mọi cam kết lợi nhuận vượt quá 3 lần lãi suất cơ bản ngân hàng trung ương đều tiềm ẩn 99% rủi ro mô hình Ponzi lừa đảo.',
      choices: [
        { k: 'refuse', label: 'Từ chối dứt khoát và cảnh báo người thân bạn bè', sub: 'Bảo vệ nguồn tiền mồ hôi nước mắt' },
        { k: 'gamble', label: 'Mạo hiểm trích một khoản nhỏ thử vận may', sub: 'Nguy cơ mất trắng toàn bộ số tiền thử nghiệm' }
      ]
    }),
    apply: k => {
      S.flags.vhts_fm_done = 1;
      if (k === 'refuse') {
        eff({ sm: 8, h: 5 });
        log(`Vài tháng sau, đường dây đầu tư đó bị cơ quan công an triệt phá. Bạn thở phào nhẹ nhõm vì đã giữ vững lý trí và bảo toàn tài sản.`, 'good');
      } else {
        const loss = Math.min(S.money, 15000000);
        S.money = Math.max(0, S.money - loss);
        eff({ h: -8, sm: 4 });
        log(`Chủ dự án bất ngờ biến mất không để lại dấu vết. Bạn mất trắng khoản tiền thử nghiệm nhưng đổi lại bài học cảnh giác sâu sắc.`, 'bad');
      }
    }
  },

  // =========================================================================
  // TIỀN KIẾP TƯƠNG PHÙNG: TIẾNG VỌNG LUÂN HỒI (Feature 3)
  // =========================================================================
  vhts_past_echo: {
    ok: () => {
      const lives = (typeof lsGet === 'function' ? lsGet(LIVES_KEY, []) : []) || [];
      return lives.length >= 1 && !S.flags.vhts_echo_done;
    },
    build: () => {
      const lives = lsGet(LIVES_KEY, []) || [];
      const past = lives[lives.length - 1]; // Most recent previous life
      const sameCty = past.iso === S.cur;
      return {
        title: 'Tiếng Vọng Luân Hồi: Dấu Vết Tiền Kiếp',
        body: sameCty
          ? `Ở tuổi ${S.age}, bạn tình cờ đọc được tư liệu về một nhân vật từng sống tại ${esc(past.ko)} tên là "${esc(past.name)}", từng làm nghề ${esc(past.job || 'lao động')} và qua đời ở tuổi ${past.age}. Một cảm giác quen thuộc đến rợn ngợp dâng lên trong huyết quản như thể chính bạn từng đi qua cuộc đời ấy.`
          : `Ở tuổi ${S.age}, trong một bài giảng quốc tế, bạn bất ngờ nghe kể về di sản của một con người tên là "${esc(past.name)}" từ đất nước ${esc(past.ko)}. Dù chưa từng đặt chân đến đó, từng dòng ký ức bỗng rung chuyển mãnh liệt trong tiềm thức của bạn.`,
        fact: 'Hiện tượng Déjà vu và ký ức tiền kiếp (Past-life memories) thường được các nhà tâm lý học phân tích như cơ chế kích hoạt liên tưởng sâu sắc của tiềm thức dưới tác động của hoàn cảnh tương đồng.',
        choices: [
          { k: 'embrace', label: 'Tĩnh tâm cảm thụ ký ức tiền kiếp, tiếp nối chí hướng còn dang dở', sub: 'Thức tỉnh ngộ tính và ý chí sống (+8 Hạnh phúc, +6 Trí tuệ)' },
          { k: 'fund', label: 'Quyên góp một khoản nhỏ vào quỹ tưởng niệm mang tên người ấy', sub: 'Tích lũy âm đức luân hồi (+6 Xã hội, -tiền nhỏ)' },
          { k: 'pass', label: 'Coi là ảo giác trùng hợp ngẫu nhiên rồi mỉm cười bước tiếp', sub: 'Bình tâm sống trọn vẹn với kiếp này' }
        ]
      };
    },
    apply: k => {
      S.flags.vhts_echo_done = 1;
      if (k === 'embrace') {
        eff({ h: 8, sm: 6, so: 4 });
        log('[Tiền Kiếp Khế Ước]: Ký ức xa xăm từ tiền kiếp soi sáng tâm can, thôi thúc bạn sống một cuộc đời trọn vẹn và kiên cường hơn bao giờ hết.', 'good');
      } else if (k === 'fund') {
        const gift = Math.min(S.money, 5000000);
        S.money = Math.max(0, S.money - gift);
        eff({ so: 8, h: 5 });
        log('[Âm Đức Tiếp Nối]: Nghĩa cử tri ân tiền kiếp gieo thêm hạt giống thiện lành cho dòng họ và cộng đồng xung quanh.', 'good');
      } else {
        eff({ h: 3 });
        log('Bạn cất giữ xúc cảm bồi hồi ấy vào góc sâu ký ức, vững vàng bước tiếp chặng đường hiện tại.', 'ev');
      }
    }
  },

  // =========================================================================
  // TU TIÊN ĐÔ THỊ / DỊ NĂNG ẨN TÀNG (Urban Supernatural Cultivation)
  // =========================================================================
  vhts_dao_encounter: {
    ok: () => S.age >= 16 && S.age <= 35 && !S.flags.vhts_cult_started,
    build: () => {
      const isEast = ['VNM', 'CHN', 'JPN', 'KOR', 'TWN'].includes(S.cur);
      const isInd = ['IND', 'NPL', 'LKA'].includes(S.cur);
      const isWest = ['USA', 'GBR', 'FRA', 'DEU'].includes(S.cur);
      const placeText = isEast ? 'Một hiệu sách cổ kỹ thuật phủ đầy bụi tại khu phố cổ, bạn tình cờ nhìn thấy một cuốn tàn thư da dê khắc các mạch lạc hô hấp kỳ dị'
        : isInd ? 'Tại một tu viện cổ kính nép mình chân dãy Himalaya, một hành giả du già râu tóc bạc phơ nhìn thẳng vào mắt bạn và trao một cuốn kinh thư lá bối'
        : 'Trong một gian hàng bán đồ cổ kỳ lạ cuối hẻm vắng, bạn bị thu hút bởi một phiến ngọc bích chạm khắc hoa văn cổ đại tỏa hơi ấm nhè nhẹ';
      return {
        title: 'Cơ Duyên Kỳ Ngộ: Tàn Quyển Dẫn Khí Cổ Xưa',
        body: `Ở tuổi ${S.age}, một cơ duyên khó tin bất ngờ xuất hiện. ${placeText}. Giác quan bên trong thôi thúc bạn rằng đây không phải sách giả tưởng thông thường.`,
        fact: 'Học thuyết kinh lạc và kỹ thuật điều tức dưỡng sinh cổ đại từng được ghi chép trong Hoàng Đế Nội Kinh và Yoga Sutra, miêu tả trạng thái bế khí kéo dài tuổi thọ sinh học.',
        choices: [
          { k: 'practice', label: 'Bí mật tĩnh tâm thử nghiệm theo phương pháp điều tức cổ truyền', sub: 'Khai mở đường tu chân ẩn tàng, tiêu hao thời gian rảnh rỗi' },
          { k: 'sell', label: 'Đem bán cho nhà sưu tầm đồ cổ để kiếm một món tiền tươi', sub: 'Quy đổi cơ duyên thành của cải vật chất ngay trước mắt' },
          { k: 'ignore', label: 'Coi là chuyện mê tín hoang đường, cất vào xó tủ quên lãng', sub: 'Tiếp tục cuộc đời người phàm bình lặng' }
        ]
      };
    },
    apply: k => {
      S.flags.vhts_cult_started = 1;
      if (k === 'practice') {
        S.cultivation = { stage: 1, name: 'Luyện Khí Tầng 1 (Khai Khiếu)', qi: 20, maxAgeBonus: 10 };
        eff({ hl: 8, sm: 8, h: 6 });
        log('[Kỳ Ngộ Đạo Căn]: Bạn ngồi kiết già thổ nạp theo đồ hình. Một luồng khí ấm luân chuyển dọc sống lưng đả thông kinh mạch, cơ thể nhẹ bẫng tựa lông hồng!', 'good');
      } else if (k === 'sell') {
        const reward = Math.max(30000000, S.income * 2);
        S.money += reward;
        eff({ h: 4 });
        log('[Đoạn Tuyệt Tiên Duyên]: Bạn bán cổ vật cho một đại gia sưu tầm với giá cao. Dù túi tiền rủng rỉnh, đôi lúc bạn vẫn cảm thấy dường như đã bỏ lỡ một điều gì thiêng liêng.', 'ev');
      } else {
        log('Bạn mỉm cười trước những điều huyền hoặc rồi đặt cuốn sách lại giá cũ, tiếp tục hòa mình vào dòng chảy tất bật thường nhật.', 'ev');
      }
    }
  },

  vhts_dao_dilemma: {
    ok: () => S.cultivation && S.cultivation.stage >= 1 && !S.flags.vhts_dao_choice,
    build: () => ({
      title: 'Đạo Tâm Nghịch Lý: Nhập Thế Hưởng Lạc hay Xuất Thế Khổ Tu?',
      body: 'Khí tức trong người ngày một ngưng tụ. Bạn đã đạt đến cảnh giới có thể nhìn thấu bệnh tật của người khác, phản xạ nhanh gấp ba lần người thường và tinh thần minh mẫn phi phàm.',
      fact: 'Trong triết học Đạo gia và Phật học, "Độ kỷ" (tự cứu lấy mình) và "Độ nhân" (cứu giúp thế nhân) luôn là bài toán khảo nghiệm tâm tính lớn nhất của bậc hành giả.',
      choices: [
        { k: 'worldly', label: 'Nhập thế: Vận dụng đan đạo & dị năng chữa bệnh cho giới siêu giàu', sub: 'Tích lũy tài sản khổng lồ, gia tăng nhân duyên xã hội' },
        { k: 'hidden', label: 'Xuất thế: Ẩn mình nơi thâm sơn cùng cốc hoặc thiền phòng, quyết chí tu đạo', sub: 'Đột phá cảnh giới Trúc Cơ, trường thọ vượt giới hạn phàm nhân' },
        { k: 'charity', label: 'Hành thiện: Âm thầm cứu chữa cho người nghèo khó cùng khổ không lấy tiền', sub: 'Tích lũy phúc đức vô lượng, đại đạo viên mãn' }
      ]
    }),
    apply: k => {
      S.flags.vhts_dao_choice = k;
      if (k === 'worldly') {
        const gold = Math.max(80000000, S.income * 5);
        S.money += gold;
        eff({ so: 10, h: 8, sm: 4 });
        log('[Nhập Thế Hồng Trần]: Bạn bí mật cứu mạng một nhà tài phiệt mắc bệnh hiểm nghèo. Tiền bạc và mối quan hệ quyền quý ùn ùn kéo đến mái ấm gia đình.', 'good');
      } else if (k === 'hidden') {
        S.cultivation.stage = 2;
        S.cultivation.name = 'Trúc Cơ Kỳ (Tẩy Tủy Hoán Cốt)';
        S.cultivation.maxAgeBonus = 25;
        eff({ hl: 15, sm: 12, so: -6 });
        log('[Trúc Cơ Thành Công]: Tẩy sạch tạp chất nhục thân, khí tức ngưng tụ thành đan điền! Bạn thoát thai hoán cốt, thọ nguyên kéo dài vượt trội phàm nhân.', 'good');
      } else {
        S.cultivation.stage = 2;
        S.cultivation.name = 'Trúc Cơ Kỳ (Công Đức Kim Thân)';
        S.cultivation.maxAgeBonus = 20;
        eff({ h: 15, so: 12, hl: 10 });
        log('[Công Đức Vô Lượng]: Lòng trắc ẩn cứu sống muôn người tạo nên tấm màn phúc quang hộ thể. Đạo tâm của bạn sáng rực như gương không vướng chút bụi trần.', 'good');
      }
    }
  },

  vhts_tribulation: {
    ok: () => S.cultivation && S.cultivation.stage >= 2 && S.age >= 60 && !S.flags.vhts_trib_done,
    build: () => ({
      title: 'Thiên Kiếp Khảo Nghiệm: Ngưng Kết Kim Đan',
      body: `Ở tuổi ${S.age}, linh lực tích lũy đã đạt đến cực hạn nhân sinh. Bầu trời bỗng vần vũ mây đen, áp suất không khí biến đổi dị thường, lôi kiếp tâm ma sắp sửa giáng xuống.`,
      fact: 'Các nghiên cứu về điện từ sinh học chỉ ra hệ thần kinh con người có thể phát sinh những đột biến điện thế cực lớn trong trạng thái thiền định sâu hoặc khi cận kề cửa tử.',
      choices: [
        { k: 'face_trib', label: 'Vận chuyển toàn bộ linh lực đối diện Thiên Kiếp (Độ Kiếp)', sub: 'Nếu thành công: Đạt Kim Đan Đại Đạo, thọ nguyên 120-150 tuổi; Nếu bại: Tổn hao đạo hạnh' },
        { k: 'dissolve', label: 'Tự nguyện tán khí hồi quy thiên địa, giữ gìn một đời an yên', sub: 'Trở lại làm người phàm khỏe mạnh, phúc thọ trọn vẹn bên con cháu' }
      ]
    }),
    apply: k => {
      S.flags.vhts_trib_done = 1;
      if (k === 'face_trib') {
        const win = Math.random() < (0.6 + (S.flags.vhts_dao_choice === 'charity' ? 0.2 : 0) + (S.st.hl > 80 ? 0.15 : 0));
        if (win) {
          S.cultivation.stage = 3;
          S.cultivation.name = 'Kim Đan Chân Nhân (Lục Địa Thần Tiên)';
          S.cultivation.maxAgeBonus = 40;
          eff({ hl: 25, sm: 20, h: 20 });
          log('[ĐỘ KIẾP THÀNH CÔNG - KIM ĐAN ĐẠI THÀNH]: Sấm sét rạch ngang trời đêm, một vầng kim quang ngưng tụ giữa đan điền! Bạn đã chính thức bước chân vào hàng ngũ Lục Địa Thần Tiên, thọ cùng trời đất!', 'good');
        } else {
          eff({ hl: -15, h: -5 });
          log('[Độ Kiếp Thất Bại]: Thiên uy cuồn cuộn đánh tan linh giáp. Dù Kim Đan chưa thành, căn cốt kiên cường vẫn giúp bạn giữ được chân mạng an toàn.', 'bad');
        }
      } else {
        S.cultivation.stage = 1;
        S.cultivation.name = 'Phản Phác Quy Chân (Hòa Quang Đồng Trần)';
        eff({ h: 10, so: 8 });
        log('[Phản Phác Quy Chân]: Bạn nhẹ nhàng xả bỏ tu vi, biến linh khí thành cơn mưa lành tưới mát cây cỏ quanh nhà, mỉm cười an hưởng tuổi già thanh thản.', 'good');
      }
    }
  },

  // Modern Era Decisions (2024-2026)
  dec_ai_upskill: {
    build: () => {
      if (S.flags.dec_ai_done) return null;
      return {
        title: "Cơ hội nâng cấp kỹ năng: Ứng dụng Trí tuệ Nhân tạo (AI)",
        body: ["Cơ quan và thị trường khuyến khích người lao động ứng dụng các công cụ AI vào quy trình làm việc để gia tăng hiệu suất."],
        fact: "Theo Diễn đàn Kinh tế Thế giới (WEF), 85% công việc trong tương lai gần sẽ yêu cầu kỹ năng cộng tác với các công cụ AI.",
        choices: [
          { k: 'learn', label: "Chủ động học cách ứng dụng AI vào công việc", sub: "Tốn chút thời gian học hỏi, nhưng năng suất và thu nhập tăng vọt" },
          { k: 'pass', label: "Tiếp tục làm việc theo phương pháp quen thuộc", sub: "Giữ nhịp điệu thường ngày, không phải làm quen công nghệ mới" }
        ]
      };
    },
    apply: k => {
      S.flags.dec_ai_done = 1;
      if (k === 'learn') {
        S.flags.ai_skilled = 1;
        const b = incomeAt(C(), 0.5) * 0.15;
        S.money += b;
        eff({ sm: 6, h: 3 });
        log("Bạn làm chủ các công cụ AI mới, tự động hóa quy trình lặp lại và được khen thưởng vì năng suất vượt bậc.", 'good');
      } else {
        eff({ h: 1 });
        log("Bạn chọn giữ nguyên cách làm truyền thống và hoàn thành công việc theo kinh nghiệm sẵn có.", 'ev');
      }
    }
  },

  dec_side_gig: {
    build: () => {
      if (S.flags.dec_gig_done) return null;
      return {
        title: "Nghề tay trái trong kỷ nguyên số (Side Hustle / Bán hàng Online)",
        body: ["Ngoài công việc chính, bạn có cơ hội mở gian hàng trực tuyến hoặc nhận dự án tự do trên các nền tảng số."],
        fact: "Kinh tế làm việc linh hoạt (Gig Economy) đóng góp hơn 30% lực lượng lao động tại các nền kinh tế mới nổi (ILO, 2024).",
        choices: [
          { k: 'gig', label: "Bắt đầu làm thêm ngoài giờ", sub: "Kiếm thêm thu nhập nhưng sẽ bận rộn hơn đôi chút" },
          { k: 'rest', label: "Giữ thời gian nghỉ ngơi và chăm sóc bản thân", sub: "Bảo đảm sức khỏe và sự thư thái trọn vẹn" }
        ]
      };
    },
    apply: k => {
      S.flags.dec_gig_done = 1;
      if (k === 'gig') {
        const extra = incomeAt(C(), 0.5) * 0.12;
        S.money += extra;
        eff({ sm: 3, hl: -1, h: 1 });
        log("Nghề tay trái đem lại nguồn thu nhập mới vững vàng, giúp bạn tích lũy thêm khoản tài chính an tâm.", 'good');
      } else {
        eff({ hl: 4, h: 3 });
        log("Bạn duy trì lối sống cân bằng, bảo vệ sức khỏe và tận hưởng trọn vẹn những buổi tối thảnh thơi.", 'good');
      }
    }
  },

  dec_green_commute: {
    build: () => {
      if (S.flags.dec_green_done) return null;
      return {
        title: "Lựa chọn lối sống: Chuyển sang Phương tiện Điện thông minh",
        body: ["Hạ tầng trạm sạc và xe máy điện phủ khắp phố phường. Bạn cân nhắc đổi xe để tiết kiệm nhiên liệu và giảm phát thải."],
        fact: "Tỷ lệ xe hai bánh chạy điện tại Đông Nam Á dự kiến vượt mốc 35% trước năm 2030 (BloombergNEF).",
        choices: [
          { k: 'ev', label: "Đổi sang phương tiện điện thân thiện môi trường", sub: "Chi phí vận hành rẻ hơn nhiều so với tiền xăng, êm ái không khói bụi" },
          { k: 'gas', label: "Tiếp tục sử dụng phương tiện hiện có", sub: "Không phải chi tiền mua sắm phương tiện mới" }
        ]
      };
    },
    apply: k => {
      S.flags.dec_green_done = 1;
      if (k === 'ev') {
        S.flags.green_moto = 1;
        eff({ h: 3, hl: 3 });
        log("Chiếc xe điện vận hành êm ru và tiết kiệm đáng kể chi phí hàng tháng, bạn cảm thấy nhẹ nhõm hơn mỗi khi lưu thông.", 'good');
      } else {
        eff({ h: 1 });
        log("Bạn tiếp tục sử dụng phương tiện quen thuộc bấy lâu nay.", 'ev');
      }
    }
  },
};