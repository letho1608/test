// js/app.js - Khoi dong app
if (typeof tApply === 'function') tApply();
COUNTRIES.forEach(c => { CBY[c.id] = c; });
for (const iso in ROMA_S) (ETH_C[iso] = ETH_C[iso] || []).push('roma');
Object.assign(DEC, {
  kidcare: {
    ok: () => !AGE12 && kidsSmall().length > 0 && soloParent(),
    build: () => {
      const c = C(), ks = kidsSmall(), y = ks.reduce((m, k) => k.bornAt > m.bornAt ? k : m, ks[0]), n = callName(y.name), who = kinWho(), fos = fosterLand(c);
      S.flags.kcI = S.fam.kids.indexOf(y);
      const why = S.st.hl < 35 ? "Bạn ốm nặng đến mức không thể làm việc." : debtHeavy() ? "Các khoản nợ tăng lên từng ngày." : "Đã lâu rồi không có thu nhập.";
      return { title: "Nuôi các con thế nào đây?", body: (ks.length > 1 ? L`혼자 아이 ${ks.length}명을 키우며 버티기가 점점 힘들어졌습니다.` : "Một mình nuôi con, bạn ngày càng thấy khó gắng gượng.") + ' ' + why + ' ' + L`주변에서는 ${eul(n)} 당분간 다른 곳에 맡기라고 권합니다.`,
        fact: kidcareFact(c) + ' · ' + KIDCARE_HELP(),
        choices: [{ k: 'hold', label: "Cùng nhau gắng gượng, có người giúp đỡ", sub: c.ppp >= 15000 ? "Xin hỗ trợ dành cho cha mẹ đơn thân · tiền bạc vẫn eo hẹp" : "Nhờ họ hàng và hàng xóm giúp · tiền bạc vẫn eo hẹp" },
          who ? { k: 'kin', label: L`${kinWord(who)}께 ${eul(n)} 잠시 맡긴다`, sub: "Sống xa con · gửi tiền nuôi con" } : null,
          { k: 'care', label: fos ? L`위탁 가정에 ${eul(n)} 잠시 맡긴다` : L`보육 시설에 ${eul(n)} 잠시 맡긴다`, sub: "Có thể đến thăm · có thể dần xa cách con" },
          S.age - y.bornAt < 4 ? { k: 'adopt', label: L`${eul(n)} 입양 보내는 데 동의한다`, sub: "Khó quay lại" } : null].filter(Boolean) };
    },
    apply: k => {
      const c = C(), i = S.flags.kcI, y = S.fam.kids[i]; S.flags.kcI = null;
      if (k === 'hold' || !y || !y.alive) {
        eff({ h: -2, so: 2 });
        if (c.ppp >= 15000) { S.flags.soloAid = S.age + 3; return "Bạn xin hỗ trợ dành cho cha mẹ đơn thân và gắng gượng qua từng ngày. Có các con bên cạnh, bạn lại tìm thấy sức mạnh."; }
        if (famCanHelp()) S.money += med() * 0.05;
        return "Họ hàng và hàng xóm thay phiên nhau trông các con. Dù eo hẹp, mọi người vẫn cùng nhau vượt qua.";
      }
      const n = callName(y.name); S.flags.lossY = S.age;
      if (k === 'adopt') { dropKid(i); (S.fam.given = S.fam.given || []).push({ name: y.name, sex: y.sex, bornAt: y.bornAt, at: S.age }); S.flags.givenAt = S.age; eff({ h: -14, so: -5 });
        return { t: L`${eul(n)} 입양 보내는 서류에 서명했습니다. 더 좋은 곳에서 자라기를 빌었습니다.`, k: 'bad', f: KIDCARE_HELP() }; }
      const who = kinWho(), fos = fosterLand(c);
      y.away = 1; y.placed = { k, at: S.age, who: k === 'kin' ? who : null, fos: k === 'care' && fos ? 1 : 0 }; y.pc = k; y.bd = (y.bd || 0) - (k === 'care' ? 12 : 8);
      eff({ h: k === 'care' ? -10 : -8, so: -3 });
      return { t: k === 'kin' ? L`${eul(n)} ${kinWord(who)} 댁에 맡겼습니다. 떠나는 날 아이는 차창 밖으로 오래 손을 흔들었습니다.` : fos ? L`${eul(n)} 위탁 가정에 맡겼습니다. 주말마다 찾아가겠다고 약속했습니다.` : L`${eul(n)} 보육 시설에 맡겼습니다. 돌아서는 발걸음이 떨어지지 않았습니다.`, k: 'bad', f: KIDCARE_HELP() };
    }
  },
  kidhome: {
    ok: p => { const k = S.fam.kids[p.i]; return !!k && k.alive && !!k.placed; },
    build: p => { const k = S.fam.kids[p.i], n = callName(k.name), y = S.age - k.placed.at;
      return { title: L`${eul(n)} 다시 데려올까?`, body: L`${wa(n)} 떨어져 지낸 지 ${Math.max(1, y)}년이 되었습니다. 형편이 조금 나아졌습니다.`,
        choices: [{ k: 'home', label: "Đón con về ngay", sub: "Sống cùng nhau lần nữa" }, { k: 'wait', label: "Khi hoàn cảnh khá hơn chút nữa", sub: '' }] }; },
    apply: (k, p) => { const kid = S.fam.kids[p.i]; if (!kid || !kid.placed || k !== 'home') return false;
      const n = callName(kid.name); kid.away = 0; kid.placed = null; kid.bd = (kid.bd || 0) + 6; eff({ h: 8, so: 3 }); S.yearMark = S.yearMark || 'love';
      return L`${eul(n)} 다시 집으로 데려왔습니다. 처음 며칠은 서먹했지만 곧 예전처럼 웃었습니다.`; }
  },
  will: {
    ok: () => willOK(),
    build: () => {
      const c = C(), h = heirsOf(), law = inhLaw(c), isl = law === 'isl', nw = netWorth(), to = giveTo(), gn = GIVE_N()[to], P = S.fam.partner;
      S.flags.willTo = to;
      const ptW0 = P && P.alive && !P.divorced ? ({ m: "Bạn đời", cp: "Bạn đời", none: "Người chung sống" })[unionOf(P)] : null, ptW = ptW0 ? lcVi(ptW0) : ptW0;
      const ks = h.units.filter(u => u.k.alive), home = S.house > 0 && ks.length >= 2 ? (ks.find(u => u.k.withMe || u.k.stay) || ks[0]) : null;
      const hks = home ? ks : [];
      S.flags.willKids = hks.map(u => u.n); S.flags.willHome = home ? 'home' + Math.max(0, hks.indexOf(home)) : null;
      const lawShort = !h.sp && !h.units.length && !h.par.length && !h.sib ? "Nếu không có người thừa kế, tài sản thuộc về nhà nước" : law === 'kor' ? "Bạn đời 1,5 : mỗi người con 1" : law === 'jpn' ? "Bạn đời một nửa, các con một nửa" : isl ? "Theo phần định của luật Hồi giáo" : law === 'hin' ? "Bạn đời, các con và mẹ chia đều" : "Theo phần luật định";
      const gm = giveMax(c);
      return { title: "Viết di chúc không?", body: L`남길 것을 생각할 나이가 되었습니다. 지금 재산은 약 ${wonStr(nw)}입니다. 유언장이 없으면 법이 정한 순서대로 나뉩니다.`,
        fact: c.id === 'KOR' ? "Ở Hàn Quốc, nếu qua đời mà không có di chúc, bạn đời nhận gấp rưỡi phần của mỗi người con, còn các con chia đều cho nhau (Bộ luật Dân sự, Điều 1009)" : isl ? "Theo luật Hồi giáo, di chúc chỉ được để lại tối đa một phần ba tài sản cho người không phải là người thừa kế" : "Khoảng một phần ba người trưởng thành ở Mỹ có di chúc (Caring.com 2024)",
        choices: [{ k: 'law', label: "Không viết, để luật quyết định", sub: lawShort },
          !isl && ptW && (h.units.length || unionOf(P) === 'none') ? { k: 'spouse', label: L`${ptW}에게 먼저 남긴다`, sub: FREE_WILL.has(c.id) || !h.units.length ? '' : "Luật vẫn giữ một nửa phần của các con" } : null,
          !isl && (h.sp || h.units.length) && (h.sp ? 1 : 0) + h.units.length + stepHeirs().length >= 2 ? { k: 'fam', label: "Chia đều cho gia đình", sub: stepHeirs().length ? "Gồm cả con riêng của bạn đời mà bạn cùng nuôi" : '' } : null,
          !isl && stepHeirs().length && h.units.length ? { k: 'own', label: "Chỉ chia đều cho con ruột của mình", sub: "Không gồm con riêng của bạn đời" } : null,
          stepHeirs().length && (isl || (!h.sp && !h.units.length)) ? (sg => ({ k: 'step', label: sg >= 1 ? "Để lại cho con riêng của bạn đời" : "Để lại tối đa một phần ba cho con riêng của bạn đời", sub: sg >= 1 ? "Theo luật không phải người thừa kế: chỉ di chúc mới ghi tên được" : "Phần còn lại chia theo luật thừa kế Hồi giáo" }))(stepMax(c)) : null,
          ...(!isl ? hks.map((u, i) => ({ k: 'home' + i, label: L`집은 ${u.n}에게, 나머지는 법대로`, chip: callName(u.k.name), sub: '', g: 'home', gl: "Nhà cho một người con, phần còn lại theo luật" })) : []),
          { k: 'give', label: L`5분의 1을 ${gn}에 남긴다`, sub: "Phần còn lại cho gia đình" },
          { k: 'giveall', label: gm >= 1 ? L`모두 ${gn}에 남긴다` : L`법이 허락하는 만큼 ${gn}에 남긴다`, sub: gm >= 1 ? (h.units.length ? "Không để lại gì cho các con" : '') : isl ? "Tối đa một phần ba" : "Luật vẫn giữ một nửa phần của gia đình" }].filter(Boolean) };
    },
    apply: k => {
      const to = S.flags.willTo || giveTo(), gn = GIVE_N()[to];
      const hk = /^home\d+$/.test(k) ? (S.flags.willKids || [])[+k.slice(4)] || null : k === 'home' ? S.flags.willKid : null;
      if (hk) k = 'home';
      S.will = { k, at: S.age, to, kid: hk };
      if (k === 'law') { S.will = null; S.flags.willNo = S.age; return "Bạn quyết định không viết di chúc. Bạn nghĩ những người ở lại cứ chia theo luật là được."; }
      eff({ h: 2 });
      return k === 'give' ? L`유언장을 썼습니다. 재산의 5분의 1은 ${gn}에 남기기로 했습니다.` : k === 'giveall' ? L`유언장을 썼습니다. 남길 수 있는 만큼을 ${gn}에 남기기로 했습니다.`
        : k === 'home' ? L`유언장을 썼습니다. 집은 ${S.will.kid}에게 남기기로 했습니다.` : k === 'own' ? "Bạn viết di chúc. Các con ruột của bạn sẽ chia đều cho nhau." : k === 'step' ? "Bạn viết di chúc và ghi cả tên con riêng của bạn đời vào đó." : k === 'spouse' ? "Bạn viết di chúc để những gì bạn để lại trước hết thuộc về người đã cùng bạn chung sống." : "Bạn viết di chúc để gia đình chia đều cho nhau.";
    }
  },
});
EVENTS.forEach(e => { EVMAP[e.id] = e; });
DEC.hivtx = {
  build: () => ({ title: "Bắt đầu điều trị?", body: S.hiv.src === 'birth' ? "Bạn biết được rằng mình mang HIV từ lúc chào đời, lây từ mẹ." : "Bạn nhận kết quả dương tính với HIV. Bạn sợ những người xung quanh biết chuyện.", fact: "Trong khoảng 39,9 triệu người có HIV trên thế giới, 77% đang được điều trị. Nếu điều trị đều đặn, người có HIV có thể sống lâu gần bằng người không nhiễm (UNAIDS 2024)",
    choices: [{ k: 'art', label: "Bắt đầu điều trị", sub: "Uống thuốc mỗi ngày · tuổi thọ gần như phục hồi" }, { k: 'hide', label: "Không nói với ai và trì hoãn", sub: "Sợ bị kỳ thị · rất nguy hiểm" }] }),
  apply: k => {
    if (k === 'art') { S.hiv.art = true; eff({ h: -2 }); return pick(["Bạn đã bắt đầu điều trị. Mỗi ngày bạn uống thuốc vào cùng một giờ.", "Bạn đã bắt đầu điều trị. Chuyên viên tư vấn giới thiệu cho bạn một nhóm những người cùng hoàn cảnh."]); }
    S.flags.hivAsk = S.age + 3; eff({ h: -8 }); return { t: "Bạn không thể nói với ai.", k: 'bad' };
  }
};
for (const k in MKT_S0) { const [y0, s] = MKT_S0[k], m = MKT_S[k] = {}; s.split(',').forEach((v, i) => { m[y0 + i] = +v / 100; }); }
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
for (const e of WARM) {
  const c0 = e.c, r0 = e.run, mx = WARM_MAX[e.id] || 1, key = 'wm_' + e.id;
  const joy = JOYS.has(e.id);
  e.c = () => (S.flags[key] || 0) < mx && S.flags.wmY !== S.age && (!joy || S.flags.wjA == null || S.age - S.flags.wjA >= 5) && (!c0 || c0());
  e.run = () => { S.flags[key] = (S.flags[key] || 0) + 1; S.flags.wmY = S.age; if (joy) S.flags.wjA = S.age; return r0(); };
  EVENTS.push(e); EVMAP[e.id] = e;
}
Object.assign(DEC, HUM);
Object.assign(DEC, SMALL);
for (const k in SKIN_C) for (const i of SKIN_C[k].split(',')) SKIN_CI[i] = k;
PX_PET.h = ['.B..B..', 'BBBBBB.', 'BkBBBBB', 'NBBBBBB', '.wwwww.'];
PX_PET.r = ['.B.....', '.BB....', '.BB....', 'BBBB...', 'kBBBBB.', 'NBBBBBw', '.BBBBBw', '..w..w.'];
PX_PET.b = ['..BB...', '.BkBB..', 'cBBBBB.', '.BBBww.', '..BBT..', 'yyyyyyy', '...y...', '...y...', '...y...', '..yyy..'];
PX_PET.f = ['GGGGGGGGGG', 'WWWWWWWWWW', 'WWWoWWWWWW', 'WWooWWWpWW', 'WWWoWWWpWW', 'WWWWWWpWWW', 'ssssssssss', 'GGGGGGGGGG', '.G......G.', '.G......G.'];
MO.born = c => {
  const P = c.P, k = c.cast, hosp = c.m.urban && !['hut', 'tent'].includes(c.m.home);
  const mom = k.par.find(p => p.sex === 'F') || (k.par.length ? null : moGen(c, 'par', 'F', 28)), dad = k.par.find(p => p.sex === 'M');
  moRoom(c, hosp ? { wall: pxMix(P.wall, P.light(P.water, 0.6), 0.3), floor: 'tile', win: [[22, 26], [150, 22]], plain: true } : { win: [[24, 22]], frames: [150, 164] });
  const bun = P.light(P.me, 0.55);
  if (mom) {
    const s = moFig(mom, P, { pose: 'hold', bun, top: hosp ? moWear('patient', P).top : undefined });
    moBed(c, 72, 44, PX.G - (hosp ? 12 : 8), s, { hosp });
    fxHeart(c, 79, PX.G - (hosp ? 12 : 8) - s.hand[1] - 8);
  } else { const s = pxNewborn(k.me, P); moBed(c, 76, 34, PX.G - 9, null, {}); moPut(c, s, 84, PX.G - 20); moSpan(c, 76, 110); }
  if (dad) { const s = moFig(dad, P, {}); moPut(c, s, 120, PX.G - s.h); moSpan(c, 70, 130); }
  for (const sb of k.sib.slice(0, 2)) { const s = moFig(sb, P, { pose: 'wave' }); moPut(c, s, dad ? 132 + k.sib.indexOf(sb) * 10 : 120 + k.sib.indexOf(sb) * 10, PX.G - s.h); }
  moVase(c, 56, PX.G - 12);
  c.span = [70, 114];
};
MO.baby = c => {
  const P = c.P, k = c.cast, babies = k.kids.filter(p => p.age <= 1).sort((a, b) => a.age - b.age), baby = babies[0];
  moRoom(c, { win: [[28, 22]], frames: [136, 150], lamp: 170 });
  const others = [...k.pt, ...k.kids.filter(p => p !== baby && p.age >= 2).slice(0, 3), ...k.par.slice(0, 1)];
  const me = { p: k.me, s: moFig(k.me, P, { pose: 'hold', bun: P.light(P.kid, 0.55) }), dy: 1 };
  const hold2 = babies.length > 1 ? others.find(p => p.role === 'pt' || p.role === 'par') : null;
  const row = moAround(me, others.map(p => ({ p, s: moFig(p, P, p === hold2 ? { pose: 'hold', bun: P.light(P.kid, 0.45) } : p.role === 'kid' ? { pose: 'wave' } : {}), dy: 0 })));
  const xs = moRow(c, row, MO_CX - 10);
  const x = c.span[1] + 4, r = c.front; r.rect(x, PX.G - 11, 18, 1, P.trunk); for (let i = 0; i < 18; i += 3) r.rect(x + i, PX.G - 11, 1, 11, P.trunk); r.rect(x, PX.G - 4, 18, 1, P.trunk);
  r.line(x + 9, 8, x + 9, 16, P.ol); r.rect(x + 4, 16, 11, 1, P.ol); [P.gold, P.accent, P.water].forEach((col, i) => { r.px(x + 4 + i * 5, 17, P.ol); r.rect(x + 3 + i * 5, 18, 3, 2, col); });
  fxHeart(c, MO_CX - 14, 18); fxHeart(c, MO_CX - 2, 14, P.light(P.gold, 0.2)); moSpan(c, c.span[0], x + 18);
};
MO.school = c => {
  const P = c.P, k = c.cast; moSky(c, 'm'); moFar(c); moGrass(c);
  const b = pxHouse(P, 58, 18, 7, P.stamp, P.wall, {}); c.mid.blit(b, 66, PX.G - b.h - 2, P.ol);
  c.mid.rect(93, PX.G - b.h - 1, 5, 4, P.wall); c.mid.px(95, PX.G - b.h, P.ol);
  for (const x of [56, 132]) { c.mid.rect(x, PX.G - 16, 4, 16, P.wall2); c.mid.rect(x - 1, PX.G - 17, 6, 2, P.shade(P.wall2, 0.2)); }
  c.mid.rect(60, PX.G - 1, 72, 1, P.pave2);
  for (const x of [30, 160]) moTreeBig(c, x, PX.G, c.m.region === 'hi' || c.m.region === 'eap' ? 'round' : null);
  const grown = k.me.age >= 18, child = grown ? (k.kids.filter(p => p.age >= 4 && p.age <= 13).sort((a, b) => a.age - b.age)[0] || k.gk[0] || moGen(c, 'kid', null, 6)) : k.me;
  const me = moFig(child, P, { pose: 'wave' });
  const par = (grown ? [k.me, ...k.pt.slice(0, 1)] : k.par.slice(0, 1)).map(p => ({ p, s: moFig(p, P, { pose: 'wave' }) }));
  const kids = [moSome(c, 'kid', null, child.age), moSome(c, 'sib', null, child.age)];
  const xs = moRow(c, [kids[0], { s: me, dy: 1 }, ...par, kids[1]], MO_CX, PX.G, 3);
  { const sy = PX.G - me.h + 1 + me.hand[1] - 4, A = P.accent; c.mid.rect(xs[1] - 1, sy, me.w + 2, 5, A); c.mid.rect(xs[1] - 1, sy, me.w + 2, 1, P.light(A, 0.3)); c.mid.rect(xs[1] - 1, sy + 4, me.w + 2, 1, P.shade(A, 0.25)); }
  if (c.m.region === 'hi' || c.m.region === 'eap') fxPetals(c, 16);
};
MO.grad = c => {
  const P = c.P, k = c.cast, lv = +c.a[0] || 3, uni = lv >= 4;
  moSky(c, 'd'); moFar(c); moGrass(c);
  if (uni) {
    const r = c.mid, x0 = 58, w = 76, W = P.light(P.wall, 0.3);
    for (let j = 0; j < 7; j++) r.rect(x0 + 2 + (6 - j) * 5, PX.G - 34 + j, w - 4 - (6 - j) * 10, 1, j === 6 ? P.shade(W, 0.15) : W);
    r.rect(x0 + 2, PX.G - 27, w - 4, 3, W); r.rect(x0 + 2, PX.G - 24, w - 4, 1, P.shade(W, 0.2));
    for (let i = 0; i < 7; i++) { r.rect(x0 + 6 + i * 11, PX.G - 23, 3, 18, W); r.rect(x0 + 8 + i * 11, PX.G - 23, 1, 18, P.shade(W, 0.12)); }
    r.rect(x0, PX.G - 5, w, 2, P.shade(W, 0.08)); r.rect(x0 - 3, PX.G - 3, w + 6, 3, P.shade(W, 0.14));
    { const cap = pxSprite(['.KKK.', 'KKKKK', '.KKKY', '..K.Y'], { K: moNavy(P), Y: P.gold }); for (let i = 0; i < 6; i++) c.front.blit(cap, 66 + i * 11 + (c.R() * 4 | 0), 3 + (c.R() * 12 | 0), null); }
  } else {
    const b = pxHouse(P, 70, 16, 6, P.stamp, P.wall, {}); c.mid.blit(b, 60, PX.G - b.h - 1, P.ol);
    moBunting(c, PX.G - 26, 56, 138);
  }
  const gown = uni ? moWear('gown', P) : moWear('school', P);
  const me = moFig(k.me, P, Object.assign({ pose: 'up', hat: uni ? 'grad' : undefined }, gown));
  const mates = [moSome(c, 'sib', null, k.me.age, Object.assign({ pose: 'wave', hat: uni ? 'grad' : undefined }, gown)), moSome(c, 'pt', null, k.me.age, Object.assign({ hat: uni ? 'grad' : undefined }, gown))];
  const par = (k.par.length ? k.par : uni ? [moGen(c, 'par', 'F', k.me.age + 28), moGen(c, 'par', 'M', k.me.age + 30)] : []).slice(0, 2);
  const row = [mates[0], { s: me, dy: 1 }, ...par.map(p => ({ s: moFig(p, P, { pose: 'wave' }) })), mates[1]];
  const xs = moRow(c, row, MO_CX, PX.G, 3);
  const r = c.front, hx = xs[1] + me.w + 1, hy = PX.G - me.h + 6; r.rect(hx, hy, 5, 2, moWhite(P)); r.px(hx + 2, hy, P.accent); r.px(hx + 2, hy + 1, P.accent);
  if (!uni && (c.m.region === 'hi' || c.m.region === 'eap')) moBouquet(c, xs[1] - 2, PX.G - me.h + 9);
  fxConfetti(c, uni ? 30 : 16, 34);
};
MO.pass = c => {
  const P = c.P, k = c.cast; moRoom(c, { win: [[30, 22]], frames: [140], lamp: 168 });
  const me = moFig(k.me, P, { pose: 'up' });
  const row = moAround({ s: me, dy: -2 }, moFam(c, 4).map(p => ({ s: moFig(p, P, { pose: p.role === 'par' ? 'wave' : 'up' }) })));
  const xs = moRow(c, row, MO_CX); const i = row.findIndex(x => x.s === me);
  c.front.rect(xs[i] - 2, PX.G - me.h - 6, 4, 3, moWhite(P)); c.front.px(xs[i] - 1, PX.G - me.h - 5, P.accent);
  fxConfetti(c, 22, 40); fxSpark(c, MO_CX, 16, 3);
};
MO.study = c => {
  const P = c.P, k = c.cast; moRoom(c, { win: [[58, 24]], view: 'night', frames: [140] });
  const me = moFig(k.me, P, { pose: 'sit' }); const x = MO_CX - 4; moPut(c, me, x, PX.G - me.h - 7); moSpan(c, x - 18, x + 26);
  const r = c.front; r.rect(x - 16, PX.G - 12, 40, 2, P.light(P.trunk, 0.1)); r.rect(x - 15, PX.G - 10, 1, 10, P.trunk); r.rect(x + 22, PX.G - 10, 1, 10, P.trunk); r.rect(x + 12, PX.G - 10, 10, 10, P.shade(P.trunk, 0.1));
  [P.accent, P.stamp, P.gold].forEach((col, i) => r.rect(x - 14, PX.G - 14 - i * 2, 8, 2, col)); r.rect(x + 1, PX.G - 13, 7, 1, moWhite(P));
  r.line(x + 18, PX.G - 12, x + 15, PX.G - 20, P.ol); r.rect(x + 13, PX.G - 22, 6, 2, P.gold);
  for (let j = -6; j <= 10; j++) for (let i = -14; i <= 14; i++) if (i * i + j * j * 2 < 170) c.front.dither(x + 14 + i, PX.G - 18 + j, P.light(P.gold, 0.6), 0.1);
};
MO.wed = c => {
  const P = c.P, k = c.cast, kidS = c.a[0] === 's', kidW = c.a[0] === 'k' || kidS, gst = c.a[0] === 'g', sa = c.m.region === 'sa', hall = c.m.urban && !sa;
  let A, B;
  if (gst) { A = moGen(c, 'inlaw', 'F', Math.max(24, k.me.age < 30 ? k.me.age + 2 : 28)); B = moGen(c, 'inlaw', 'M', A.age + 2); }
  else if (kidW) { A = { role: 'kid', sex: c.a[1] === 'M' ? 'M' : 'F', age: Math.max(18, +c.a[2] || 28), sk: k.sk }; B = kidS ? moGen(c, 'inlaw', A.sex, A.age + 1) : moGen(c, 'inlaw', A.sex === 'F' ? 'M' : 'F', A.age + (A.sex === 'F' ? 2 : -2)); }
  else { A = k.me; B = k.pt[0] || moGen(c, 'pt', k.me.sex === 'F' ? 'M' : 'F', k.me.age + (k.me.sex === 'F' ? 2 : -2)); }
  if (hall) moRoom(c, { wall: P.light(P.wall, 0.4), floor: 'tile', plain: true });
  else { moSky(c, 'd'); moFar(c); moGrass(c); for (const x of [26, 168]) moTreeBig(c, x, PX.G); }
  if (hall) { const r = c.mid; for (const x of [40, 152]) { r.rect(x, 2, 1, 6, P.gold); r.disc(x, 10, 3, P.light(P.gold, 0.5)); r.px(x - 2, 12, moRGB('#FFF4CF')); r.px(x + 2, 12, moRGB('#FFF4CF')); } for (let x = 60; x < 132; x++) c.mid.px(x, PX.G + 4 + (x % 2), P.light(P.accent, 0.5)); c.mid.rect(60, PX.G + 3, 72, 6, P.light(P.accent, 0.62)); }
  const r = c.mid, ax = MO_CX, half = 16, fl = sa ? [moRGB('#F2A23A'), moRGB('#E85A4F'), P.gold] : [P.light(P.accent, 0.55), P.light(P.wall, 0.85), P.light(P.accent, 0.35)];
  if (sa) { for (const x of [ax - half, ax + half - 1]) r.rect(x, PX.G - 26, 2, 26, P.gold); r.rect(ax - half - 2, PX.G - 28, half * 2 + 4, 3, moRGB('#C0303A')); for (let x = ax - half - 2; x < ax + half + 2; x += 2) { r.px(x, PX.G - 25, fl[(x >> 1) % 3]); r.px(x + 1, PX.G - 24, fl[(x >> 1) % 3]); } }
  else {
    for (const x of [ax - half, ax + half - 1]) r.rect(x, PX.G - 20, 2, 20, P.light(P.wall, 0.6));
    for (let t = 0; t <= 40; t++) { const a = Math.PI * t / 40, x = Math.round(ax - Math.cos(a) * half), y = Math.round(PX.G - 20 - Math.sin(a) * 9); r.px(x, y, P.tree); r.px(x, y - 1, fl[t % 3]); if (t % 2) r.px(x + 1, y, fl[(t + 1) % 3]); }
    for (let y = PX.G - 20; y < PX.G - 2; y += 3) { r.px(ax - half - 1, y, fl[y % 3]); r.px(ax + half + 1, y, fl[(y + 1) % 3]); r.px(ax - half - 1, y + 1, P.tree); r.px(ax + half + 1, y + 1, P.tree); }
  }
  const dressFor = p => sa ? (p.sex === 'F' ? Object.assign(moWear('red', P), { hat: undefined }) : { top: P.light(P.sand, 0.45), bot: P.light(P.sand, 0.3) })
    : p.sex === 'F' ? Object.assign(moWear('bride', P), { hat: 'veil' }) : moWear('suit', P);
  const sA = moFig(A, P, dressFor(A)), sB = moFig(B, P, dressFor(B));
  const guests = kidW || gst ? [Object.assign({}, k.me), ...k.pt, ...(gst ? k.kids.slice(0, 2) : [])] : [...k.par, ...k.sib.slice(0, 2)];
  while (guests.length < 4) guests.push(moGen(c, 'sib', null, (kidW ? A.age : k.me.age) + (c.R() < 0.5 ? 0 : 25)));
  const GC = [P.gold, P.stamp, P.light(P.accent, 0.25), P.water, P.light(P.tree, 0.1), P.light(P.wall3, 0.1)];
  const gs = guests.slice(0, 6).map((p, i) => ({ s: moFig(p, P, Object.assign({ pose: i % 2 ? 'wave' : 'up' }, p.gen ? { top: GC[(i + (c.R() * 6 | 0)) % 6] } : {})), dy: 0 }));
  const L = gs.filter((_, i) => i % 2 === 0), Rr = gs.filter((_, i) => i % 2);
  moRow(c, [...L, { s: sA, dy: 1, gap: 1 }, { s: sB, dy: 1, gap: 3 }, ...Rr].map((x, i, a) => x), MO_CX, PX.G, 2);
  if (!sa) { const brideL = A.sex === 'F' ? 0 : B.sex === 'F' ? 1 : -1; if (brideL >= 0) { const w = sA.w + 1 + sB.w; const x0 = Math.round(MO_CX - (gs.length ? 0 : 0)); } }
  fxPetals(c, 26, sa ? moRGB('#F2A23A') : null);
};
MO.date = c => {
  const P = c.P, k = c.cast, B = k.pt[0] || moGen(c, 'pt', k.me.sex === 'F' ? 'M' : 'F', k.me.age + (c.R() * 4 - 2));
  moSky(c, 'dusk'); moFar(c); moGrass(c);
  for (const x of [44, 150]) moTreeBig(c, x, PX.G, 'round');
  const r = c.mid; r.rect(130, PX.G - 26, 1, 26, P.ol); r.rect(128, PX.G - 28, 5, 2, P.ol); r.disc(130, PX.G - 25, 2, moRGB('#FFE7A8'));
  const s1 = moFig(k.me, P, { pose: 'sit' }), s2 = moFig(B, P, { pose: 'sit' });
  const by = PX.G - 6; moRow(c, [{ s: s1 }, { s: s2 }], MO_CX, by + 3, 0);
  const bx = c.span[0] - 4, bw = c.span[1] - c.span[0] + 8; c.front.rect(bx, by, bw, 2, P.trunk); c.front.rect(bx, by + 2, bw, 1, P.shade(P.trunk, 0.25)); c.front.rect(bx + 1, by + 3, 1, PX.G - by - 3, P.ol); c.front.rect(bx + bw - 2, by + 3, 1, PX.G - by - 3, P.ol);
  c.mid.rect(bx, by - 8, bw, 2, P.trunk); c.mid.rect(bx + 1, by - 6, 1, 6, P.trunk); c.mid.rect(bx + bw - 2, by - 6, 1, 6, P.trunk);
  fxHeart(c, MO_CX - 3, by - 24); fxHeart(c, MO_CX + 6, by - 30, P.light(P.accent, 0.45));
};
MO.anniv = c => {
  const P = c.P, k = c.cast, B = k.pt[0] || moGen(c, 'pt', k.me.sex === 'F' ? 'M' : 'F', k.me.age);
  moRoom(c, { win: [[40, 30]], view: 'night', frames: [140, 154] });
  moAtTable(c, [{ s: moFig(k.me, P, {}) }, { s: moFig(B, P, {}), gap: 6 }], MO_CX, PX.G - 8, { gap: 10 });
  const r = c.front, cx = MO_CX; r.rect(cx, PX.G - 12, 1, 4, moWhite(P)); r.px(cx, PX.G - 13, moRGB('#FFB43A')); r.px(cx, PX.G - 14, moRGB('#FFF0B0'));
  for (const gx of [cx - 6, cx + 5]) { r.rect(gx, PX.G - 12, 2, 2, P.light(P.accent, 0.2)); r.px(gx, PX.G - 10, P.light(P.wall, 0.6)); r.px(gx + 1, PX.G - 10, P.light(P.wall, 0.6)); r.rect(gx, PX.G - 9, 2, 1, P.light(P.wall, 0.6)); }
  for (let j = -8; j <= 4; j++) for (let i = -18; i <= 18; i++) if (i * i + j * j * 4 < 300) c.mid.dither(cx + i, PX.G - 13 + j, P.light(P.gold, 0.55), 0.18);
  fxHeart(c, cx - 2, 8, P.light(P.accent, 0.3));
};
MO.cake = c => {
  const P = c.P, k = c.cast, whose = c.a[0] || 'me';
  moRoom(c, { win: [[30, 22]], view: 'dusk', frames: [150] }); moBunting(c, 3, 50, 142);
  let star = k.me; if (whose === 'kid') star = k.kids.slice().sort((a, b) => a.age - b.age)[0] || k.me; else if (whose === 'gk') star = k.gk[0] || moGen(c, 'kid', null, 6);
  const others = [k.me, ...moFam(c, 6)].filter(p => p !== star).slice(0, 5);
  while (others.length < 2) others.push(moGen(c, 'sib', null, k.me.age + (c.R() * 10 - 5)));
  const row = moAround({ s: moFig(star, P, { hat: 'party', pose: 'up' }), dy: star.role === 'me' ? 1 : 0 }, others.map((p, i) => ({ s: moFig(p, P, { hat: i < 3 ? 'party' : undefined, cap: [P.gold, P.water, P.stamp][i % 3] }) })));
  moAtTable(c, row, MO_CX, PX.G - 8);
  moCake(c, MO_CX - 4, PX.G - 8, 5); moBalloons(c, c.span[0] - 10, 16); moBalloons(c, c.span[1] + 4, 14, 2);
};
MO.meal = c => {
  const P = c.P, k = c.cast;
  moRoom(c, { win: [[28, 22]], view: c.R() < 0.5 ? 'dusk' : 'd', frames: [146, 160] });
  const ps = moFam(c, 6); while (ps.length < 2) ps.push(moGen(c, 'sib', null, k.me.age));
  const row = moAround({ s: moFig(k.me, P, {}), dy: 1 }, ps.map(p => ({ s: moFig(p, P, {}) })));
  moAtTable(c, row, MO_CX, PX.G - 8);
  moDishes(c, c.span[0] - 4, c.span[1] - c.span[0] + 8, PX.G - 8);
  const r = c.mid; r.rect(MO_CX, 0, 1, 8, P.ol); r.rect(MO_CX - 4, 8, 9, 3, P.light(P.gold, 0.3)); for (let j = 0; j <= 30; j++) for (let i = -30; i <= 30; i++) if (i * i / 4 + j * j < 600) r.dither(MO_CX + i, 11 + j, P.light(P.gold, 0.6), 0.1);
};
MO.bed = c => {
  const P = c.P, k = c.cast;
  moRoom(c, { win: [[44, 22]], view: 'night', frames: [148], plain: true });
  let child, adult;
  if (k.me.age < 13) { child = k.me; adult = k.par.find(p => p.sex === 'F') || k.par[0] || k.sib[0] || moGen(c, 'par', 'F', k.me.age + 28); }
  else { child = k.kids.filter(p => p.age < 13).sort((a, b) => a.age - b.age)[0] || k.gk[0] || moGen(c, 'kid', null, 6); adult = k.me; }
  const sc = moFig(child, P, { top: P.light(child.role === 'me' ? P.me : P.kid, 0.3) });
  moBed(c, MO_CX - 4, 34, PX.G - 9, sc, { blanket: P.light(P.water, 0.35) });
  const sa = moFig(adult, P, { pose: 'sit' }); moPut(c, sa, MO_CX - 18, PX.G - sa.h); moSpan(c, MO_CX - 20, MO_CX + 30);
  const r = c.front; r.rect(MO_CX - 21, PX.G - 6, 9, 1, P.trunk); r.rect(MO_CX - 20, PX.G - 5, 1, 5, P.trunk); r.rect(MO_CX - 14, PX.G - 5, 1, 5, P.trunk);
  r.rect(MO_CX - 18 + sa.w - 3, PX.G - sa.h + sa.hand[1] - 3, 4, 3, P.accent); r.rect(MO_CX - 18 + sa.w - 2, PX.G - sa.h + sa.hand[1] - 3, 1, 3, moWhite(P));
  r.rect(MO_CX + 34, PX.G - 8, 5, 8, P.shade(P.trunk, 0.05)); r.rect(MO_CX + 35, PX.G - 12, 3, 4, P.light(P.gold, 0.4));
  for (let j = -10; j <= 8; j++) for (let i = -14; i <= 14; i++) if (i * i + j * j * 2 < 170) r.dither(MO_CX + 36 + i, PX.G - 11 + j, P.light(P.gold, 0.6), 0.14);
  fxStars(c, 0); for (const [x, y] of [[MO_CX + 6, 12], [MO_CX + 14, 8], [MO_CX + 22, 13]]) { r.px(x, y, P.light(P.gold, 0.5)); r.px(x - 1, y, P.light(P.gold, 0.5)); r.px(x + 1, y, P.light(P.gold, 0.5)); r.px(x, y - 1, P.light(P.gold, 0.5)); r.px(x, y + 1, P.light(P.gold, 0.5)); }
};
MO.play = c => {
  const P = c.P, k = c.cast; moSky(c, 'd'); moFar(c); moGrass(c);
  for (const x of [30, 62, 160]) moTreeBig(c, x, PX.G, 'round');
  let child, adult;
  if (k.me.age < 13) { child = k.me; adult = k.par.find(p => p.sex === 'M') || k.par[0] || moGen(c, 'par', 'M', k.me.age + 30); }
  else { child = k.kids.filter(p => p.age >= 2 && p.age < 13).sort((a, b) => a.age - b.age)[0] || k.gk[0] || moGen(c, 'kid', null, 5); adult = k.me; }
  const v = c.a[0] || ['sh', 'bike', 'kite'][Math.floor(c.R() * 3)], sa = moFig(adult, P, { pose: v === 'sh' ? 'up' : v === 'kite' ? 'wave' : '' }), sc = moFig(child, P, { pose: v === 'bike' ? '' : 'up' });
  const r = c.front, x = MO_CX - 4;
  if (v === 'sh') { const ya = PX.G - sa.h + 1; moPut(c, sc, x + Math.round((sa.w - sc.w) / 2), ya - sc.h + 4); moPut(c, sa, x, ya); moSpan(c, x - 6, x + sa.w + 6); }
  else if (v === 'bike') {
    const bx = x + 4, wy = PX.G - 3, sk = moFig(child, P, { pose: 'sit' });
    for (const wx of [bx, bx + 12]) { for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; r.px(Math.round(wx + Math.cos(t) * 3), Math.round(wy + Math.sin(t) * 3), P.ol); } r.px(wx, wy, P.metal); }
    moPut(c, sk, bx + 2, wy - 4 - sk.h + 3);
    r.line(bx, wy, bx + 6, wy - 1, P.accent); r.line(bx + 6, wy - 1, bx + 12, wy, P.accent); r.line(bx + 4, wy - 4, bx + 6, wy - 1, P.accent); r.line(bx + 10, wy - 6, bx + 12, wy, P.accent); r.rect(bx + 9, wy - 7, 3, 1, P.ol); r.rect(bx + 3, wy - 5, 3, 1, P.ol);
    moPut(c, sa, bx - 10, PX.G - sa.h + 1); moSpan(c, bx - 12, bx + 16);
  } else {
    moPut(c, sa, x - 6, PX.G - sa.h + 1); moPut(c, sc, x + sa.w - 3, PX.G - sc.h); moSpan(c, x - 8, x + 20);
    const kx = x + 26, ky = 10; c.sky.px(kx, ky - 3, P.accent); for (let j = -2; j <= 2; j++) for (let i = -(2 - Math.abs(j)); i <= 2 - Math.abs(j); i++) c.sky.px(kx + i, ky + j, j < 0 ? P.accent : P.gold);
    for (let t = 0; t < 1; t += 0.02) c.sky.px(Math.round(kx + (x + sa.w + 4 - kx) * t), Math.round(ky + 3 + (PX.G - 12 - ky) * t * t), P.light(P.ol, 0.3));
  }
};
MO.hosp = c => {
  const P = c.P, k = c.cast, who = c.a[0] || 'me';
  moRoom(c, { wall: pxMix(P.wall, P.light(P.water, 0.6), 0.3), floor: 'tile', win: [[22, 26]], plain: true });
  const pick = who === 'kid' ? k.kids.slice().sort((a, b) => a.age - b.age)[0] : who === 'pt' ? k.pt[0] : who === 'par' ? k.par[0] || moGen(c, 'par', null, k.me.age + 28) : k.me;
  const pat = pick || k.me, s = moFig(pat, P, moWear('patient', P));
  moBed(c, MO_CX - 22, 42, PX.G - 12, s, { hosp: true });
  const vis = (pat === k.me ? moFam(c, 3) : [k.me, ...moFam(c, 2).filter(p => p !== pat)]).slice(0, 3);
  let x = MO_CX + 28; for (const p of vis) { const sv = moFig(p, P, {}); moPut(c, sv, x, PX.G - sv.h + (p.role === 'me' ? 1 : 0)); x += sv.w + 2; }
  moSpan(c, MO_CX - 24, Math.min(PX.W, x));
  moVase(c, MO_CX - 36, PX.G - 12);
  const r = c.mid; r.rect(MO_CX + 2, 10, 14, 9, P.ol); r.rect(MO_CX + 3, 11, 12, 7, moRGB('#18302A')); for (let i = 0; i < 12; i++) r.px(MO_CX + 3 + i, 14 + (i === 5 ? -2 : i === 6 ? 2 : 0), moRGB('#6FE0A0'));
};
MO.loss = c => {
  const P = c.P, k = c.cast, pet = c.a[0] === 'pet';
  const sk = Object.assign({}, c.m, { mood: 'low' }); pxSky(c.sky, Object.assign(sk, { stage: 'e' }), P, c.R);
  for (let i = 0; i < 5; i++) pxCloud(c.sky, Math.round(10 + i * 42 + c.R() * 10), Math.round(12 + c.R() * 8), Math.round(24 + c.R() * 10), P, c.R, true);
  moFar(c); moGrass(c);
  for (const x of [24, 170]) moTreeBig(c, x, PX.G, 'pine');
  const r = c.mid, gx = MO_CX + 16, St = P.light(P.stone, 0.3);
  if (pet) { r.rect(gx - 6, PX.G - 2, 13, 2, P.soil); r.disc(gx, PX.G - 1, 3, P.soil); r.rect(gx, PX.G - 9, 1, 7, P.trunk); r.rect(gx - 2, PX.G - 8, 5, 1, P.trunk); }
  else {
    for (const ox of [-38, 36]) { r.rect(gx + ox - 3, PX.G - 8, 7, 8, P.shade(St, 0.1)); r.rect(gx + ox - 2, PX.G - 9, 5, 1, P.shade(St, 0.1)); }
    r.rect(gx - 5, PX.G - 13, 11, 13, St); r.rect(gx - 4, PX.G - 14, 9, 1, St); r.rect(gx - 3, PX.G - 15, 7, 1, St); r.rect(gx + 4, PX.G - 13, 2, 13, P.shade(St, 0.15));
    r.rect(gx - 2, PX.G - 10, 5, 1, P.shade(St, 0.25)); r.rect(gx - 2, PX.G - 8, 5, 1, P.shade(St, 0.25));
  }
  moFlowers(c, gx - 4, PX.G - 3, c.front, 4, P.light(P.wall, 0.9)); moFlowers(c, gx + 3, PX.G - 3, c.front, 3, P.light(P.wall, 0.9));
  const ps = [k.me, ...moFam(c, 3)].slice(0, 4), blk = moWear('black', P), umb = [P.ol, P.shade(P.accent, 0.35), P.shade(P.stamp, 0.35), P.shade(P.wall3, 0.3)];
  let x = MO_CX - 12 - ps.length * 6;
  ps.forEach((p, i) => {
    const s = moFig(p, P, pet ? {} : blk), ux = x + (s.w >> 1), uy = PX.G - s.h - 3 + (p.role === 'me' ? 1 : 0);
    moPut(c, s, x, PX.G - s.h + (p.role === 'me' ? 1 : 0));
    if (p.age >= 7) { const U = umb[i % 4]; [2, 4, 6, 6].forEach((hw, j) => { for (let ii = -hw; ii <= hw; ii++) c.front.px(ux + ii, uy - 7 + j, j === 3 && (ii + 6) % 4 === 0 ? P.light(U, 0.25) : U); }); c.front.px(ux, uy - 8, P.ol); c.front.line(ux, uy - 3, ux, uy + 3, P.ol); }
    x += s.w + 4;
  });
  moSpan(c, MO_CX - 12 - ps.length * 6 - 4, gx + 8);
  fxRain(c, 80);
};
MO.mem = c => {
  const P = c.P, k = c.cast; moSky(c, 'e'); moFar(c); moGrass(c);
  for (const x of [30, 164]) moTreeBig(c, x, PX.G, 'round');
  const r = c.mid, gx = MO_CX + 12, St = P.light(P.stone, 0.35);
  r.rect(gx - 5, PX.G - 13, 11, 13, St); r.rect(gx - 4, PX.G - 14, 9, 1, St); r.rect(gx - 3, PX.G - 15, 7, 1, St); r.rect(gx + 4, PX.G - 13, 2, 13, P.shade(St, 0.15));
  moFlowers(c, gx - 4, PX.G - 3, c.front, 4); moFlowers(c, gx + 3, PX.G - 3, c.front, 3);
  const s = moFig(k.me, P, {}); moPut(c, s, MO_CX - 14, PX.G - s.h + 1); moBouquet(c, MO_CX - 14 + s.w, PX.G - s.h + 1 + s.hand[1] - 1);
  moSpan(c, MO_CX - 20, gx + 10);
  for (let i = 0; i < 3; i++) { const bx = 60 + i * 9, by = 10 + (i % 2) * 3; c.sky.px(bx - 1, by - 1, P.ol); c.sky.px(bx, by, P.ol); c.sky.px(bx + 1, by - 1, P.ol); }
};
MO.friends = c => {
  const P = c.P, k = c.cast, fire = c.R() < 0.4 && !c.m.urban;
  moSky(c, 'night'); if (fire) { moFar(c); moGrass(c); } else { moFar(c); moPave(c); }
  const fr = [moGen(c, 'sib', null, k.me.age + 1), moGen(c, 'pt', null, k.me.age - 1), moGen(c, 'inlaw', null, k.me.age + 2)];
  if (fire) {
    const row = moAround({ s: moFig(k.me, P, { pose: 'sit' }) }, fr.map((p, i) => ({ s: moFig(p, P, { pose: i === 0 ? 'up' : 'sit' }) })));
    moRow(c, row, MO_CX, PX.G - 1, 10);
    const r = c.front, fx = MO_CX + 1; r.rect(fx - 4, PX.G - 1, 9, 2, P.trunk); for (let j = 0; j < 7; j++) for (let i = -3 + (j >> 1); i <= 3 - (j >> 1); i++) r.px(fx + i, PX.G - 2 - j, j < 3 ? moRGB('#F2A23A') : moRGB('#FFD86A'));
    for (let j = -14; j <= 4; j++) for (let i = -30; i <= 30; i++) if (i * i + j * j * 4 < 900) c.mid.dither(fx + i, PX.G - 4 + j, moRGB('#F2A23A'), 0.12);
    fxStars(c, 30);
  } else {
    fxLanterns(c, 2, 30, 162);
    const row = moAround({ s: moFig(k.me, P, { pose: 'up' }), dy: 1 }, fr.map((p, i) => ({ s: moFig(p, P, { pose: i === 1 ? 'wave' : '' }) })));
    moAtTable(c, row, MO_CX, PX.G - 8, { cloth: false });
    for (let i = 0; i < 4; i++) { const gx = c.span[0] + 4 + i * 9; c.front.rect(gx, PX.G - 11, 2, 3, P.light(P.gold, 0.4)); c.front.px(gx, PX.G - 11, moWhite(P)); }
  }
};
MO.walk = c => {
  const P = c.P, k = c.cast, two = (c.a[0] === 'pt' || (!c.a[0] && k.pt.length)) && k.pt.length;
  moSky(c, 'm'); fxRays(c, 30, 14); moFar(c); moGrass(c);
  const r = c.mid; for (let y = PX.G; y < PX.H; y++) { const w = 8 + (y - PX.G) * 3; r.rect(MO_CX - (w >> 1) - (y - PX.G), y, w, 1, P.light(P.sand, 0.2)); }
  for (const x of [36, 150, 172]) moTreeBig(c, x, PX.G - 1);
  const ps = two ? [k.me, k.pt[0]] : [k.me];
  moRow(c, ps.map(p => ({ s: moFig(p, P, { pose: 'walk' }), dy: p.role === 'me' ? 1 : 0 })), MO_CX, PX.G + 2, 0);
  if (two) c.front.px(MO_CX, PX.G - 6, P.skin);
  for (let i = 0; i < 3; i++) { const bx = 120 + i * 8, by = 12 + (i % 2) * 2; c.sky.px(bx - 1, by - 1, P.ol); c.sky.px(bx, by, P.ol); c.sky.px(bx + 1, by - 1, P.ol); }
};
MO.work = c => {
  const job = c.a[0] || 'clerk', kind = MO_WORK[job] || 'office', sub = c.a[1] || '';
  (MO_W[kind] || MO_W.office)(c, job, sub);
  const P = c.P;
  if (sub === 'rank' || sub === 'ret') {
    const mates = [moGen(c, 'pt', null, c.cast.me.age - 6), moGen(c, 'sib', null, c.cast.me.age + 4)];
    const xs = [c.span ? c.span[0] - 12 : MO_CX - 30, c.span ? c.span[1] + 3 : MO_CX + 22];
    mates.forEach((p, i) => { const s = moFig(p, P, { pose: i ? 'wave' : 'up' }); moPut(c, s, xs[i], PX.G - s.h); moSpan(c, xs[i] - 1, xs[i] + s.w + 1); });
    if (sub === 'rank') fxSpark(c, MO_CX, 14, 4); else { moBunting(c, 3, MO_CX - 50, MO_CX + 50, c.front); fxPetals(c, 10); }
  }
};
MO_W.office = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.wall2, 0.35), floor: 'tile', plain: true });
  const r = c.mid; r.rect(20, 6, 152, 26, P.light(P.metal, 0.2)); for (let x = 21; x < 171; x += 15) { r.rect(x, 7, 14, 24, moRGB(P.sky.d[0])); for (let i = 0; i < 14; i += 4) { const h = 6 + ((x + i) * 13 % 9); r.rect(x + i, 31 - h, 3, h, P.far1); } }
  r.rect(160, 34, 6, 6, P.shade(P.trunk, 0.1)); r.disc(163, 32, 4, P.tree); r.px(162, 30, P.treehi);
  r.disc(30, 38, 3, moWhite(P)); r.px(30, 37, P.ol); r.px(31, 38, P.ol);
  const desk = (x, who, me) => {
    const s = moFig(who, P, me && (c.a[1] === 'rank' || c.a[1] === 'ret') ? (c.a[1] === 'rank' ? { pose: 'up' } : {}) : { pose: 'sit' });
    moPut(c, s, x + 8, PX.G - s.h - 6 + (me ? 1 : 0)); if (me) { moSpan(c, x - 2, x + 28); if (c.a[1] === 'ret') moBouquet(c, x + 8 + s.w, PX.G - s.h - 6 + 1 + s.hand[1] - 1); }
    const f = c.front; f.rect(x, PX.G - 10, 26, 2, P.light(P.trunk, 0.2)); f.rect(x + 1, PX.G - 8, 1, 8, P.shade(P.trunk, 0.1)); f.rect(x + 24, PX.G - 8, 1, 8, P.shade(P.trunk, 0.1));
    f.rect(x + 15, PX.G - 19, 10, 7, P.ol); f.rect(x + 16, PX.G - 18, 8, 5, P.light(P.water, 0.35)); f.rect(x + 19, PX.G - 12, 2, 2, P.ol);
    f.rect(x + 3, PX.G - 11, 6, 1, moWhite(P));
  };
  desk(MO_CX - 13, c.cast.me, true); desk(MO_CX - 46, moGen(c, 'pt', null, c.cast.me.age + 3), false); desk(MO_CX + 20, moGen(c, 'sib', null, c.cast.me.age - 4), false);
};
MO_W.class = (c, job) => {
  const P = c.P, kid = job === 'childcare' ? 4 : job === 'prof' ? 20 : 9;
  moRoom(c, { win: [[16, 20]], frames: [170], plain: true });
  const r = c.mid; r.rect(56, 8, 84, 24, P.trunk); r.rect(58, 10, 80, 20, job === 'childcare' ? P.light(P.gold, 0.3) : moRGB('#2F5D4A'));
  const ch = job === 'childcare' ? P.accent : P.light(P.wall, 0.8);
  for (let i = 0; i < 3; i++) { r.rect(62, 13 + i * 5, 14 + i * 6, 1, ch); r.rect(80 + i * 7, 13 + i * 5, 4, 1, ch); } r.disc(118, 18, 4, ch); r.rect(112, 24, 18, 1, ch);
  if (job === 'childcare') { for (const [x, col] of [[64, P.water], [72, P.tree], [80, P.accent]]) r.rect(x, 26, 6, 3, col); }
  moWorker(c, { pose: 'wave' }, 128, null);
  for (let i = 0; i < 4; i++) { const st = moFig(moGen(c, 'kid', null, kid), P, {}), x = 66 + i * 16; moPut(c, st, x, PX.G - st.h + 6); c.front.rect(x - 2, PX.G - 1, st.w + 4, 2, P.light(P.trunk, 0.15)); c.front.rect(x - 2, PX.G + 1, 1, PX.H - PX.G - 1, P.trunk); c.front.rect(x + st.w + 1, PX.G + 1, 1, PX.H - PX.G - 1, P.trunk); }
  moSpan(c, 64, 138);
};
MO_W.clinic = (c, job) => {
  const P = c.P; moRoom(c, { wall: pxMix(P.wall, P.light(P.water, 0.6), 0.3), floor: 'tile', win: [[18, 22]], plain: true });
  const r = c.mid; r.rect(150, 14, 9, 9, moWhite(P)); r.rect(153, 15, 3, 7, P.accent); r.rect(151, 17, 7, 3, P.accent);
  const pat = moFig(moGen(c, 'par', null, 70), P, moWear('patient', P)); moBed(c, MO_CX - 34, 40, PX.G - 12, pat, { hosp: true });
  const w = moWorker(c, job === 'doctor' ? moWear('coat', P) : moWear('scrubs', P), MO_CX + 14, null);
  c.front.rect(w.x + w.s.w - 1, w.y + w.s.hand[1] - 4, 4, 5, P.light(P.trunk, 0.3)); c.front.rect(w.x + w.s.w, w.y + w.s.hand[1] - 3, 2, 3, moWhite(P));
  if (job === 'doctor') { c.front.px(w.x + 3, w.y + w.s.hand[1] - 2, P.ol); c.front.px(w.x + 4, w.y + w.s.hand[1] - 1, P.ol); }
  moSpan(c, MO_CX - 34, w.x + w.s.w + 4);
};
MO_W.field = (c, job) => {
  const P = c.P, wet = c.m.region === 'sa' || c.m.region === 'eap'; moSky(c, 'd'); moFar(c); moGrass(c);
  const r = c.mid; r.rect(0, PX.G - 3, PX.W, PX.H - PX.G + 3, wet ? pxMix(P.water, P.grass, 0.35) : P.soil);
  for (let k = 0; k < 5; k++) { const y = PX.G - 2 + k * 3; if (!wet) r.rect(0, y + 1, PX.W, 1, P.soil2); for (let x = (k % 2) * 3; x < PX.W; x += 6) { r.px(x, y, P.tree2); r.px(x - 1, y - 1, P.tree); r.px(x + 1, y - 1, P.tree); r.px(x, y - 2 - (k === 0 ? 1 : 0), P.treehi); } }
  if (wet) for (let x = 0; x < PX.W; x += 4) r.px(x, PX.G + 6 + (x % 3) * 3, P.light(P.water2 || P.win, 0.4));
  moTreeBig(c, 30, PX.G - 3); moTreeBig(c, 172, PX.G - 3);
  const w = moWorker(c, { hat: 'straw' }, MO_CX - 4, PX.G - 17 + 1 - 2);
  const hx = w.x + w.s.w, hy = w.y + w.s.hand[1]; c.front.line(hx, hy - 4, hx + 4, PX.G + 2, P.trunk); c.front.rect(hx + 3, PX.G + 2, 4, 1, P.metal);
  const bk = pxSprite(['.TTTTT.', 'TGgGgGT', 'TTTTTTT', '.TTTTT.'], { T: P.thatch, G: P.accent, g: P.tree }); moPut(c, bk, w.x - 12, PX.G - 3);
  moSpan(c, w.x - 14, hx + 8);
};
MO_W.herd = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); moGrass(c); moTreeBig(c, 40, PX.G); moTreeBig(c, 168, PX.G);
  const w = moWorker(c, { hat: 'straw' }, MO_CX - 22, null); c.front.line(w.x + w.s.w, w.y + 3, w.x + w.s.w + 1, PX.G, P.trunk);
  const sheep = pxSprite(['.WWWW...', 'WWWWWWK.', 'WWWWWWKK', 'WWWWWW..', '.K..K...'], { W: P.light(P.wall, 0.45), K: P.ol }), goat = pxSprite(['K......', 'KBBBBB.', '.BBBBBK', '.BBBBBB', '.B..B..'], { B: P.trunk, K: P.ol });
  [[MO_CX - 4, sheep], [MO_CX + 8, goat], [MO_CX + 18, sheep], [MO_CX + 6, sheep]].forEach(([x, sp], i) => moPut(c, sp, x, PX.G - sp.h + (i === 3 ? 4 : 0)));
  moSpan(c, w.x - 2, MO_CX + 28);
};
MO_W.sea = (c, job) => {
  const P = c.P; moSky(c, 'm');
  const r = c.mid; r.rect(0, 32, PX.W, PX.H - 32, P.water); for (let x = 0; x < PX.W; x++) { if ((x * 7) % 13 < 3) r.px(x, 34 + (x % 5) * 4, P.water2); } r.rect(0, 32, PX.W, 1, P.light(P.water2, 0.3));
  for (let i = 0; i < 3; i++) { const bx = 40 + i * 50, by = 10 + (i % 2) * 4; c.sky.px(bx - 1, by - 1, P.ol); c.sky.px(bx, by, P.ol); c.sky.px(bx + 1, by - 1, P.ol); }
  const w = moWorker(c, { hat: 'cap', cap: P.gold }, MO_CX - 6, 34 - 17 + 9);
  const boat = new PxR(46, 9); for (let j = 0; j < 9; j++) boat.rect(Math.max(0, j - 3), j, 46 - Math.max(0, j - 3) * 2, 1, j < 2 ? P.light(P.brick, 0.2) : P.brick); boat.rect(4, 3, 38, 1, P.shade(P.brick, 0.2));
  c.front.blit(boat, MO_CX - 23, PX.G - 8, P.ol);
  for (let t = 0; t < 12; t++) for (let u = 0; u < 6; u++) if ((t + u) % 2 === 0) c.front.px(w.x + w.s.w + 2 + t, w.y + w.s.hand[1] - 2 + u, P.light(P.wall3, 0.2));
  c.front.rect(w.x + w.s.w + 6, w.y + w.s.hand[1] + 2, 4, 1, P.light(P.metal, 0.5)); c.front.rect(w.x + w.s.w + 9, w.y + w.s.hand[1] + 4, 3, 1, P.light(P.metal, 0.5));
  moSpan(c, MO_CX - 24, MO_CX + 24);
};
MO_W.market = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); moPave(c);
  const r = c.mid, x0 = MO_CX - 26, w = 52;
  for (let x = x0; x < x0 + w; x++) { const col = ((x - x0) >> 2) % 2 ? P.wall : P.accent; r.rect(x, 12, 1, 4, col); if ((x - x0) % 4 < 2) r.px(x, 16, col); }
  r.rect(x0 + 1, 17, 1, PX.G - 17, P.trunk); r.rect(x0 + w - 2, 17, 1, PX.G - 17, P.trunk);
  for (const nx of [x0 - 34, x0 + w + 8]) { for (let x = nx; x < nx + 26; x++) { const col = ((x - nx) >> 2) % 2 ? P.wall : P.stamp; r.rect(x, 18, 1, 3, col); } r.rect(nx + 1, 21, 1, PX.G - 21, P.trunk); r.rect(nx + 24, 21, 1, PX.G - 21, P.trunk); r.rect(nx, PX.G - 10, 26, 2, P.trunk); }
  const me = moFig(c.cast.me, P, { top: c.a[1] === 'rank' ? undefined : undefined }); moPut(c, me, MO_CX - 4, PX.G - me.h - 4 + 1); moSpan(c, x0, x0 + w);
  const f = c.front; f.rect(x0 + 2, PX.G - 12, w - 4, 2, P.trunk); f.rect(x0 + 3, PX.G - 10, w - 6, 10, P.shade(P.trunk, 0.15));
  for (let i = 0; i < 12; i++) { const col = [P.accent, P.gold, P.tree, moRGB('#E07A3A')][i % 4]; f.disc(x0 + 6 + i * 3.6, PX.G - 14, 1, col); }
  const cu = moFig(moGen(c, 'pt', null, 40), P, {}); moPut(c, cu, x0 - 4, PX.G - cu.h); moSpan(c, x0 - 6, x0 + w);
  if (c.a[1] === 'ret') moBouquet(c, MO_CX + 6, PX.G - 16);
};
MO_W.site = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c);
  const r = c.mid; r.rect(0, PX.G, PX.W, PX.H - PX.G, P.light(P.soil, 0.15)); for (let x = 0; x < PX.W; x++) if (c.R() < 0.2) r.px(x, PX.G + 1 + c.R() * 10, P.stone);
  for (let y = PX.G - 40; y < PX.G; y += 8) r.rect(110, y, 50, 1, P.metal); for (let x = 110; x <= 160; x += 10) r.rect(x, PX.G - 40, 1, 40, P.metal); r.rect(112, PX.G - 24, 46, 8, P.light(P.brick, 0.15));
  for (let y = PX.G - 50; y < PX.G; y++) { r.px(40, y, P.crane); r.px(43, y, P.crane); if ((y & 3) === 0) r.line(40, y, 43, y + 3, P.crane); } r.rect(26, PX.G - 51, 60, 2, P.crane); r.line(80, PX.G - 49, 80, PX.G - 34, P.ol); r.rect(76, PX.G - 34, 9, 3, P.wall3);
  const w = moWorker(c, Object.assign({ hat: 'hard' }, moWear('vest', P)), MO_CX - 6, null);
  c.front.line(w.x + w.s.w, w.y + w.s.hand[1] - 3, w.x + w.s.w + 3, PX.G - 1, P.trunk); c.front.rect(w.x + w.s.w + 2, PX.G - 2, 3, 2, P.metal);
  const m2 = moFig(moGen(c, 'sib', 'M', c.cast.me.age + 5), P, Object.assign({ hat: 'hard', cap: P.light(P.crane, 0.25) }, { top: P.light(P.accent, 0.2) })); moPut(c, m2, MO_CX + 16, PX.G - m2.h);
  moSpan(c, w.x - 6, MO_CX + 28);
};
MO_W.factory = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.wall3, 0.3), floor: 'tile', plain: true });
  const r = c.mid; for (let x = 12; x < 180; x += 28) { r.rect(x, 6, 20, 14, P.light(P.win, 0.25)); r.rect(x + 10, 6, 1, 14, P.metal); }
  r.rect(26, PX.G - 22, 22, 20, P.metal); r.rect(29, PX.G - 19, 6, 4, P.light(P.water, 0.4)); r.px(42, PX.G - 18, P.accent); r.px(44, PX.G - 18, P.tree); r.rect(150, PX.G - 26, 24, 24, P.metal); r.rect(154, PX.G - 22, 16, 8, P.shade(P.metal, 0.3));
  const w = moWorker(c, Object.assign({ hat: 'cap', cap: P.stamp }, moWear('vest', P)), MO_CX - 4, PX.G - 17 - 2);
  const f = c.front, by = PX.G - 6; f.rect(MO_CX - 40, by, 80, 3, P.wall3); f.rect(MO_CX - 40, by + 3, 80, 1, P.shade(P.wall3, 0.3)); for (let x = MO_CX - 40; x < MO_CX + 40; x += 6) f.disc(x + 3, by + 1, 1, P.metal);
  for (const bx of [MO_CX - 34, MO_CX - 18, MO_CX + 12, MO_CX + 28]) { f.rect(bx, by - 5, 7, 5, P.light(P.trunk, 0.35)); f.rect(bx, by - 3, 7, 1, P.shade(P.trunk, 0.1)); }
  for (let x = MO_CX - 38; x < MO_CX + 40; x += 18) f.rect(x, by + 4, 2, PX.G - by + 2, P.shade(P.metal, 0.2));
  moSpan(c, MO_CX - 40, MO_CX + 40);
};
MO_W.road = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); const r = c.mid;
  r.rect(0, PX.G - 2, PX.W, 3, P.pave); r.rect(0, PX.G + 1, PX.W, PX.H - PX.G - 1, P.road); for (let x = 3; x < PX.W; x += 12) r.rect(x, PX.G + 6, 6, 1, P.roadline);
  if (job === 'delivery') {
    const bx = MO_CX - 10, wy = PX.G + 3; c.front.blit(pxMoto(P, true), bx, wy - 6, null);
    const s = moFig(c.cast.me, P, { pose: 'sit', hat: 'cap', cap: P.accent }); moPut(c, s, bx + 4, wy - 4 - s.h + 2); moSpan(c, bx - 2, bx + 18);
    return;
  }
  const T = new PxR(44, 22); T.rect(0, 2, 30, 16, P.wall2); T.rect(30, 6, 13, 12, P.accent); T.rect(32, 8, 7, 5, P.win); T.rect(0, 17, 44, 2, P.shade(P.wall2, 0.3)); T.rect(43, 14, 1, 2, P.gold);
  c.front.blit(T, MO_CX - 22, PX.G - 19, P.ol); for (const wx of [MO_CX - 14, MO_CX + 14]) { c.front.disc(wx, PX.G + 1, 3, P.ol); c.front.px(wx, PX.G + 1, P.metal); }
  const s = moFig(c.cast.me, P, { pose: 'wave' }), cut = new PxR(s.w, 7); for (let j = 0; j < 7; j++) for (let i = 0; i < s.w; i++) cut.d[j * s.w + i] = s.get(i, j);
  c.front.blit(cut, MO_CX + 10 - (s.ox || 0), PX.G - 19 + 7, null); c.front.rect(MO_CX + 10, PX.G - 19 + 14, 7, 1, P.accent);
  moSpan(c, MO_CX - 22, MO_CX + 22);
};
MO_W.kitchen = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.wall, 0.5), floor: 'tile', plain: true });
  const r = c.mid; for (let y = 4; y < PX.G - 12; y += 4) for (let x = (y % 8 ? 0 : 4); x < PX.W; x += 8) r.rect(x, y, 7, 3, P.light(P.water, 0.62));
  for (let i = 0; i < 4; i++) { const x = 40 + i * 8; r.rect(x, 6, 1, 6, P.metal); r.disc(x, 13, 2, P.shade(P.metal, 0.2)); }
  const w = moWorker(c, Object.assign({ hat: 'chef' }, moWear('chef', P)), MO_CX - 4, PX.G - 17 - 2);
  const f = c.front; f.rect(MO_CX - 30, PX.G - 7, 60, 7, P.metal); f.rect(MO_CX - 30, PX.G - 7, 60, 1, P.light(P.metal, 0.4));
  for (const px of [MO_CX - 24, MO_CX + 14]) { f.rect(px, PX.G - 12, 10, 5, P.shade(P.metal, 0.25)); f.rect(px - 1, PX.G - 12, 12, 1, P.ol); for (let k = 0; k < 3; k++) { f.px(px + 2 + k * 3, PX.G - 15 - (k % 2), P.light(P.smoke, 0.5)); f.px(px + 3 + k * 3, PX.G - 17, P.light(P.smoke, 0.6)); } f.rect(px + 2, PX.G - 6, 6, 1, moRGB('#F2A23A')); }
  moSpan(c, MO_CX - 30, MO_CX + 30);
};
MO_W.studio = (c, job) => {
  const P = c.P; moRoom(c, { win: [[22, 26]], frames: [150, 164], plain: true });
  const r = c.front, ex = MO_CX + 8;
  if (job === 'creator') { r.line(ex + 4, PX.G - 1, ex + 4, PX.G - 18, P.ol); r.line(ex, PX.G - 1, ex + 4, PX.G - 8, P.ol); r.line(ex + 8, PX.G - 1, ex + 4, PX.G - 8, P.ol); r.rect(ex + 1, PX.G - 22, 7, 5, P.ol); r.px(ex + 4, PX.G - 20, P.water); r.disc(ex + 16, PX.G - 24, 5, P.light(P.wall, 0.8)); r.disc(ex + 16, PX.G - 24, 3, P.light(P.wall, 0.4)); r.line(ex + 16, PX.G - 19, ex + 16, PX.G - 1, P.metal); }
  else { r.line(ex, PX.G - 1, ex + 6, PX.G - 24, P.trunk); r.line(ex + 12, PX.G - 1, ex + 6, PX.G - 24, P.trunk); r.blit(pxSprite(['WWWWWWWWWWWW', 'WSSSSSSSSWWW', 'WSSGSSSSSSWW', 'WSGGGSSTTSSW', 'WTTTTTTTTTTW', 'WTTTTGGTTTTW', 'WWWWWWWWWWWW'], { W: P.light(P.wall, 0.4), S: moRGB(P.sky.d[0]), G: P.gold, T: P.tree }), ex, PX.G - 22, P.ol); }
  const w = moWorker(c, {}, MO_CX - 14, null); if (job !== 'creator') r.line(w.x + w.s.w, w.y + w.s.hand[1], w.x + w.s.w + 3, w.y + w.s.hand[1] - 4, P.trunk);
  for (let i = 0; i < 3; i++) { const cx = 40 + i * 10; r.rect(cx, PX.G - 12, 8, 12, P.light(P.wall, 0.4)); r.rect(cx + 1, PX.G - 11, 6, 10, [P.water, P.accent, P.gold][i]); }
  moSpan(c, w.x - 2, ex + (job === 'creator' ? 22 : 14));
};
MO_W.stage = (c, job) => {
  const P = c.P; moSky(c, 'night'); const r = c.mid;
  for (let k = 0; k < 4; k++) { const x0 = 30 + k * 44; for (let y = 0; y < PX.G; y++) { const w = 2 + y / 5; for (let i = -w; i <= w; i++) r.dither(Math.round(x0 + (MO_CX - x0) * y / PX.G + i), y, moRGB(k % 2 ? '#F6E7B0' : '#BFD8F0'), 0.18); } }
  r.rect(0, PX.G - 2, PX.W, PX.H - PX.G + 2, P.shade(P.trunk, 0.35)); r.rect(0, PX.G - 2, PX.W, 1, P.light(P.trunk, 0.1));
  const w = moWorker(c, { pose: c.a[1] === 'rank' ? 'up' : 'wave', top: job === 'idol' ? P.light(P.accent, 0.15) : undefined }, MO_CX - 4, PX.G - 2 - 17 + 1);
  c.front.line(MO_CX - 7, PX.G - 2, MO_CX - 7, PX.G - 14, P.metal); c.front.rect(MO_CX - 8, PX.G - 16, 3, 2, P.ol);
  if (job === 'musician') { const g = moFig(moGen(c, 'sib', null, c.cast.me.age), P, {}); moPut(c, g, MO_CX + 16, PX.G - 2 - g.h); c.front.rect(MO_CX + 15, PX.G - 9, 6, 3, P.gold); c.front.line(MO_CX + 21, PX.G - 8, MO_CX + 26, PX.G - 13, P.trunk); }
  for (let x = 4; x < PX.W; x += 6) { const h = 3 + (x * 7 % 3); c.front.disc(x, PX.H - h + 2, 2, P.ol); if ((x / 6 | 0) % 3 === 0) { c.front.px(x + 1, PX.H - h - 3, moRGB(['#FFD86A', '#7FE0F0', '#F28AB0'][(x / 18 | 0) % 3])); c.front.px(x + 1, PX.H - h - 2, P.ol); } }
  moSpan(c, MO_CX - 14, MO_CX + 28);
};
MO_W.sport = (c, job) => {
  const P = c.P; moSky(c, 'd'); const r = c.back; r.rect(0, 22, PX.W, PX.G - 22, P.light(P.wall3, 0.2)); for (let y = 24; y < PX.G - 2; y += 3) for (let x = (y % 6) ? 0 : 2; x < PX.W; x += 4) r.px(x, y, [P.accent, P.water, P.gold, P.light(P.wall, 0.6)][(x + y) % 4]);
  moGrass(c); const g = c.mid; g.rect(0, PX.G + 4, PX.W, 1, P.light(P.wall, 0.7)); g.disc(MO_CX, PX.G + 9, 6, P.grasshi); g.disc(MO_CX, PX.G + 9, 5, P.grass);
  const w = moWorker(c, { pose: c.a[1] === 'rank' ? 'up' : 'up', top: job === 'coach' ? P.stamp : P.accent }, MO_CX - 4, null);
  c.front.disc(w.x + w.s.w + 5, PX.G - 2, 2, P.light(P.wall, 0.85)); c.front.px(w.x + w.s.w + 5, PX.G - 2, P.ol);
  if (job === 'coach' || job === 'trainer') for (let i = 0; i < 3; i++) { const k = moFig(moGen(c, 'kid', null, 12), P, { top: P.accent }); moPut(c, k, MO_CX + 16 + i * 10, PX.G - k.h); }
  moSpan(c, w.x - 4, MO_CX + (job === 'coach' ? 46 : 16));
};
MO_W.church = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.stone, 0.45), floor: 'tile', plain: true });
  const r = c.mid; for (const x of [40, MO_CX - 7, 140]) { r.rect(x, 8, 14, 24, P.shade(P.stone, 0.1)); r.disc(x + 7, 9, 7, P.shade(P.stone, 0.1)); for (let j = 0; j < 22; j++) for (let i = 1; i < 13; i++) r.px(x + i, 9 + j, [moRGB('#5F8FD0'), moRGB('#E85A4F'), moRGB('#F6D365'), moRGB('#6FBF73')][((i >> 2) + (j >> 2)) % 4]); r.disc(x + 7, 9, 5, moRGB('#F6D365')); }
  const w = moWorker(c, { top: P.light(P.ol, 0.12), dress: P.light(P.ol, 0.12), bot: P.light(P.ol, 0.12) }, MO_CX - 4, PX.G - 17 - 4);
  c.front.rect(w.x + 3, w.y + 9, 3, 1, moWhite(P));
  const f = c.front; f.rect(MO_CX - 18, PX.G - 9, 36, 9, moWhite(P)); f.rect(MO_CX - 18, PX.G - 9, 36, 1, P.gold); f.rect(MO_CX - 1, PX.G - 6, 2, 4, P.gold);
  for (const cx of [MO_CX - 14, MO_CX + 13]) { f.rect(cx, PX.G - 14, 1, 5, moWhite(P)); f.px(cx, PX.G - 15, moRGB('#FFB43A')); }
  for (let x = 20; x < PX.W - 10; x += 11) if (Math.abs(x - MO_CX) > 24) { f.disc(x, PX.H - 2, 2, P.light(P.hair, 0.15)); f.rect(x - 3, PX.H - 1, 7, 1, P.light(P.hair, 0.1)); }
  moSpan(c, MO_CX - 20, MO_CX + 20);
};
MO_W.base = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); moPave(c);
  const b = pxHouse(P, 40, 12, 4, P.wall3, P.light(P.tree2, 0.3), {}); c.mid.blit(b, 120, PX.G - b.h, P.ol);
  c.mid.line(60, PX.G - 1, 60, PX.G - 34, P.metal); c.mid.rect(61, PX.G - 34, 10, 6, P.accent); c.mid.rect(61, PX.G - 31, 10, 1, P.light(P.wall, 0.7));
  const uni = job === 'police' ? { top: moNavy(P), bot: moNavy(P), hat: 'mil', cap: moNavy(P) } : job === 'guard' ? { top: moNavy(P), hat: 'cap', cap: moNavy(P) } : Object.assign({ hat: 'mil' }, moWear('mil', P));
  const w = moWorker(c, Object.assign({ pose: 'wave' }, uni), MO_CX - 4, null);
  for (const dx of [-16, 14]) { const s = moFig(moGen(c, 'sib', job === 'soldier' || job === 'service' ? 'M' : null, c.cast.me.age + 1), P, uni); moPut(c, s, MO_CX + dx, PX.G - s.h); }
  if (job === 'police') { const car = pxCar(P, P.light(P.wall, 0.8)); c.mid.blit(car, MO_CX + 30, PX.G - 7, P.ol); c.mid.rect(MO_CX + 35, PX.G - 8, 2, 1, P.accent); c.mid.rect(MO_CX + 37, PX.G - 8, 2, 1, P.water); }
  moSpan(c, MO_CX - 18, MO_CX + 24);
};
MO_W.house = (c, job) => {
  const P = c.P; moRoom(c, { win: [[30, 22]], frames: [140], plain: false });
  const r = c.mid; r.line(110, 8, 180, 10, P.ol); [P.accent, P.water, P.gold, P.light(P.wall, 0.7)].forEach((col, i) => { const x = 116 + i * 15; r.rect(x, 10, 9, 8 + (i % 2) * 3, col); r.px(x + 2, 9, P.ol); r.px(x + 6, 9, P.ol); });
  const w = moWorker(c, {}, MO_CX - 4, null); c.front.line(w.x + w.s.w + 1, w.y + 6, w.x + w.s.w + 5, PX.G, P.trunk); c.front.rect(w.x + w.s.w + 2, PX.G - 1, 7, 1, P.light(P.thatch, 0.1));
  const bk = pxSprite(['.WWWWW.', 'WwWWWwW', 'WWWWWWW', '.WWWWW.'], { W: P.light(P.wall3, 0.3), w: P.light(P.wall, 0.8) }); moPut(c, bk, w.x - 14, PX.G - 4);
  moSpan(c, w.x - 16, w.x + w.s.w + 10);
};
MO_W.sky = (c, job) => {
  const P = c.P; moSky(c, 'd'); moFar(c); moPave(c);
  moPlane(c, 104, PX.G - 20, c.mid, 2); for (const x of [112, 120]) { c.mid.rect(x, PX.G - 14, 1, 14, P.metal); }
  c.mid.rect(100, PX.G - 14, 50, 1, P.shade(P.wall, 0.2));
  const uni = { top: moNavy(P), bot: moNavy(P), dress: moNavy(P), hat: job === 'pilot' ? 'mil' : undefined, cap: moNavy(P) };
  moWorker(c, Object.assign({ pose: 'wave' }, uni), MO_CX - 20, null); moSuitcase(c, MO_CX - 28, PX.G, P.ol);
  const m2 = moFig(moGen(c, 'sib', null, c.cast.me.age + 2), P, uni); moPut(c, m2, MO_CX - 6, PX.G - m2.h);
  moSpan(c, MO_CX - 30, MO_CX + 6);
};
MO_W.space = (c, job) => {
  const P = c.P, r = c.sky; r.rect(0, 0, PX.W, PX.H, moRGB('#0B1020')); fxStars(c, 60);
  for (let x = 0; x < PX.W; x++) { const y = Math.round(PX.G + 2 + ((x - 96) * (x - 96)) / 900); for (let j = y; j < PX.H; j++) r.px(x, j, (x + j) % 9 < 5 ? moRGB('#3E7CC0') : moRGB('#5AA36A')); r.px(x, y, moRGB('#A8D8F0')); }
  const s = moFig(c.cast.me, P, { pose: 'wave', top: moWhite(P), bot: moWhite(P), dress: moWhite(P) }); const x = MO_CX - 4, y = 14; moPut(c, s, x, y);
  c.front.disc(x + ((s.hw || 9) >> 1) + (s.ox || 0), y + 4, 6, null); for (let a = 0; a < 40; a++) { const t = a / 40 * Math.PI * 2; c.front.px(Math.round(x + 4 + (s.ox || 0) + Math.cos(t) * 6), Math.round(y + 4 + Math.sin(t) * 6), P.light(P.wall, 0.7)); }
  c.front.rect(MO_CX + 20, 18, 30, 4, P.metal); c.front.rect(MO_CX + 28, 10, 2, 20, P.metal); for (let i = 0; i < 4; i++) c.front.rect(MO_CX + 52 + i * 6, 14, 5, 12, moRGB('#2C4A8A'));
  moSpan(c, MO_CX - 10, MO_CX + 30);
};
MO_W.hall = (c, job) => {
  const P = c.P; moRoom(c, { wall: P.light(P.trunk, 0.55), floor: 'wood', plain: true });
  const r = c.mid; for (let x = 6; x < PX.W; x += 22) { r.rect(x, 4, 4, PX.G - 6, P.light(P.trunk, 0.35)); } r.rect(MO_CX - 4, 6, 9, 6, P.gold); r.disc(MO_CX, 9, 2, P.light(P.gold, 0.4));
  for (let k = 0; k < 2; k++) for (let x = 10 + k * 5; x < PX.W - 8; x += 11) if (Math.abs(x - MO_CX) > 18) { c.front.disc(x, PX.H - 2 - k * 5, 2, [P.light(P.hair, 0.15), P.hairold][(x + k) % 2]); c.front.rect(x - 3, PX.H - 1 - k * 5, 7, 1, P.light(P.hair, 0.1)); }
  const w = moWorker(c, Object.assign({ pose: 'wave' }, moWear('suit', P)), MO_CX - 4, PX.G - 17 - 4);
  const f = c.front; f.rect(MO_CX - 9, PX.G - 9, 18, 9, P.light(P.trunk, 0.15)); f.rect(MO_CX - 9, PX.G - 9, 18, 1, P.gold); f.rect(MO_CX - 2, PX.G - 6, 4, 3, P.gold);
  f.line(MO_CX + 6, PX.G - 9, MO_CX + 3, PX.G - 14, P.metal); f.rect(MO_CX + 2, PX.G - 15, 2, 2, P.ol);
  moSpan(c, MO_CX - 14, MO_CX + 14);
};
MO.trip = c => {
  const P = c.P, k = c.cast, place = c.a[0] || 'beach', reg = c.a[1] || c.m.region, who = c.a[2] || 'solo';
  const cm = Object.assign({}, c.m, { region: reg, urban: false }), c2 = Object.assign({}, c, { m: cm });
  (MO_T[place] || MO_T.beach)(c2, reg);
  c.span = c2.span;
  const others = moTripWho(c, who), solo = !others.length;
  const ppl = moAround({ s: moFig(k.me, P, { pose: place === 'mount' ? 'up' : solo ? 'wave' : 'up', hat: place === 'beach' && k.me.age >= 13 ? 'cap' : undefined, cap: P.gold }), dy: 1 },
    others.map((p, i) => ({ s: moFig(p, P, { pose: i % 2 ? 'wave' : '' }) })));
  const gy = c2.gy || PX.G; moRow(c, ppl, c2.gx || MO_CX, gy, 2);
  if (solo) { const r = c.front, x = c.span[1] + 1, y = gy - 10; r.rect(x, y, 3, 2, P.ol); r.px(x + 1, y - 1, P.ol); }
  if (place !== 'mount') moSuitcase(c, c.span[0] - 7, gy, P.accent);
};
MO_T.beach = (c, reg) => {
  const P = c.P; moSky(c, 'd'); const r = c.mid, hz = 30;
  c.back.rect(0, hz, PX.W, PX.G - hz, P.water); for (let x = 0; x < PX.W; x++) { if ((x * 11) % 17 < 3) c.back.px(x, hz + 3 + (x % 4) * 3, P.water2); } c.back.rect(0, hz, PX.W, 1, P.light(P.water2, 0.4));
  c.back.disc(150, hz, 4, P.hill2); c.back.rect(146, hz, 9, 1, P.hill2);
  r.rect(0, PX.G - 6, PX.W, PX.H - PX.G + 6, P.sand); for (let x = 0; x < PX.W; x++) { r.px(x, PX.G - 6, P.light(P.water2, 0.5)); if (c.R() < 0.15) r.px(x, PX.G - 4 + c.R() * 12, P.sand2); }
  for (let x = 0; x < PX.W; x += 3) r.px(x, PX.G - 7, P.light(P.wall, 0.8));
  if (reg !== 'hi' && reg !== 'eca') { pxTree(r, 24, PX.G - 2, 'palm', P); pxTree(r, 36, PX.G, 'palm', P); }
  const ux = MO_CX - 34; for (let j = 0; j < 4; j++) for (let i = -8 + j * 2; i <= 8 - j * 2; i++) c.front.px(ux + i, PX.G - 22 + (3 - j), ((i + 8) >> 2) % 2 ? P.light(P.wall, 0.85) : P.accent);
  c.front.line(ux, PX.G - 22, ux, PX.G - 1, P.ol); c.front.rect(ux - 6, PX.G - 1, 12, 2, P.light(P.water, 0.3));
  const cs = c.front, sx = MO_CX + 30; cs.rect(sx, PX.G - 4, 8, 4, P.sand2); cs.rect(sx + 1, PX.G - 6, 2, 2, P.sand2); cs.rect(sx + 5, PX.G - 6, 2, 2, P.sand2); cs.px(sx + 2, PX.G - 8, P.accent);
  for (let i = 0; i < 3; i++) { const bx = 60 + i * 14, by = 8 + (i % 2) * 3; c.sky.px(bx - 1, by - 1, P.ol); c.sky.px(bx, by, P.ol); c.sky.px(bx + 1, by - 1, P.ol); }
  c.gy = PX.G + 2;
};
MO_T.mount = (c, reg) => {
  const P = c.P; moSky(c, 'm'); const r = c.back, snow = P.light(P.wall, 0.85);
  for (const [px, ph, pw] of [[40, 34, 40], [100, 42, 52], [160, 30, 40]]) for (let y = 0; y < ph; y++) { const w = Math.round(pw * y / ph); for (let i = -w; i <= w; i++) r.px(px + i, PX.G - 8 - ph + y, y < ph * 0.28 ? snow : i < 0 ? P.far2 : P.far1); }
  pxHills(c.mid, P, c.R, 0.05, PX.G - 2, 5, P.hill2, P.light(P.hill2, 0.15));
  const g = c.mid; g.rect(0, PX.G, PX.W, PX.H - PX.G, P.stone); for (let x = 0; x < PX.W; x++) if (c.R() < 0.3) g.px(x, PX.G + c.R() * 12, P.shade(P.stone, 0.2));
  for (const x of [20, 30, 168, 178]) pxTree(g, x, PX.G, 'pine', P);
  const fx = MO_CX + 22; c.front.rect(fx, PX.G - 22, 1, 22, P.ol); c.front.rect(fx + 1, PX.G - 22, 7, 4, P.accent); for (let i = 0; i < 4; i++) c.front.rect(fx - 3 + i, PX.G - 3 - i * 2, 7 - i * 2, 2, P.shade(P.stone, 0.1 + i * 0.05));
};
MO_T.city = (c, reg) => {
  const P = c.P; moSky(c, 'd'); const r = c.back, m = c.mid, G = PX.G;
  if (reg === 'eap') {
    const pg = P.shade(P.accent, 0.15); for (let t = 0; t < 4; t++) { const y = G - 10 - t * 8, w = 18 - t * 3; m.rect(132 - w, y - 1, w * 2, 2, P.ol); m.rect(132 - w + 2, y + 1, w * 2 - 4, 7, P.light(P.wall, 0.4)); } m.rect(131, G - 46, 2, 6, P.gold);
    const gx = 40; m.rect(gx, G - 26, 2, 26, pg); m.rect(gx + 20, G - 26, 2, 26, pg); m.rect(gx - 4, G - 28, 30, 2, pg); m.rect(gx - 2, G - 23, 26, 1, pg);
    for (const x of [22, 72, 168]) { m.rect(x, G - 6, 1, 6, P.trunk); for (let i = 0; i < 18; i++) m.disc(x + (c.R() - 0.5) * 10, G - 10 + (c.R() - 0.5) * 6, 1, P.light(P.accent, 0.55)); }
  } else if (reg === 'mena') {
    for (const [x, w] of [[30, 24], [120, 34]]) { r.rect(x, G - 16, w, 16, P.light(P.sand, 0.4)); r.disc(x + w / 2, G - 17, w / 3, P.light(P.sand, 0.4)); r.disc(x + w / 2, G - 17 - w / 3, 1, P.gold); }
    for (const x of [24, 58, 114, 160]) { r.rect(x, G - 34, 3, 34, P.light(P.sand, 0.3)); r.rect(x - 1, G - 30, 5, 1, P.light(P.sand, 0.15)); r.px(x + 1, G - 36, P.gold); }
    for (const x of [70, 176]) pxTree(m, x, G, 'palm', P);
  } else if (reg === 'sa') {
    const W = P.light(P.wall, 0.7); r.rect(66, G - 22, 60, 16, W); r.disc(96, G - 26, 11, W); r.disc(96, G - 38, 1, P.gold); for (const x of [72, 120]) r.disc(x, G - 24, 4, W); for (const x of [56, 136]) { r.rect(x, G - 34, 3, 28, W); r.px(x + 1, G - 36, P.gold); }
    for (let i = 0; i < 5; i++) r.rect(76 + i * 9, G - 15, 4, 7, P.shade(W, 0.12));
    m.rect(60, G + 2, 72, 3, P.water); for (const x of [46, 146, 30, 162]) { m.rect(x, G - 9, 3, 9, P.tree2); m.rect(x + 1, G - 11, 1, 2, P.tree2); }
  } else if (reg === 'lac') {
    const St = P.light(P.stone, 0.15); for (let t = 0; t < 6; t++) r.rect(96 - 30 + t * 5, G - 6 - t * 5, 60 - t * 10, 5, t % 2 ? St : P.shade(St, 0.08)); r.rect(93, G - 40, 6, 6, P.shade(St, 0.15)); r.rect(94, G - 39, 4, 5, P.ol);
    for (let i = 0; i < 6; i++) r.rect(94, G - 6 - i * 5, 4, 5, P.light(St, 0.1));
    for (const x of [20, 40, 152, 172]) pxTree(m, x, G, 'palm', P);
  } else if (reg === 'ssa') {
    pxHills(r, P, c.R, 0.03, G - 4, 4, P.light(P.sand, 0.1), null); for (const x of [30, 150]) pxTree(m, x, G, 'acacia', P);
    const Y = P.gold, B = P.shade(P.trunk, 0.05), gi = new PxR(10, 22); gi.rect(6, 0, 3, 2, Y); gi.rect(6, 2, 2, 10, Y); gi.rect(0, 11, 8, 5, Y); for (const lx of [0, 2, 5, 7]) gi.rect(lx, 16, 1, 6, Y); for (let i = 0; i < 6; i++) gi.px(1 + (i * 3) % 7, 12 + (i % 3), B); m.blit(gi, 140, G - 22, P.ol);
    const E = P.light(P.wall3, 0.15), el = new PxR(16, 11); el.rect(2, 0, 12, 7, E); el.rect(0, 1, 4, 6, P.shade(E, 0.1)); el.rect(0, 6, 1, 4, E); for (const lx of [3, 6, 10, 13]) el.rect(lx, 7, 2, 4, E); m.blit(el, 44, G - 11, P.ol);
  } else {
    for (let i = 0; i < 9; i++) { const x = 4 + i * 21, h = 18 + (i * 7) % 9, col = [P.light(P.gold, 0.4), P.light(P.accent, 0.5), P.light(P.water, 0.4), P.light(P.wall, 0.3)][i % 4]; if (Math.abs(x + 9 - 96) < 14) continue; r.rect(x, G - h, 18, h, col); for (let j = 0; j < 6; j++) r.rect(x + j, G - h - 1 - j, 18 - j * 2, 1, P.roof); for (let y = G - h + 3; y < G - 3; y += 5) for (let xx = x + 3; xx < x + 16; xx += 5) r.rect(xx, y, 2, 3, P.win); }
    const tx = 96; for (let y = 0; y < 44; y++) { const w = Math.round(1 + (y / 44) ** 2 * 12); r.px(tx - w, G - 44 + y, P.metal); r.px(tx + w, G - 44 + y, P.metal); if (y % 6 === 0) r.rect(tx - w, G - 44 + y, w * 2 + 1, 1, P.metal); } r.px(tx, G - 46, P.metal);
  }
  moPave(c);
};
MO_T.nature = (c, reg) => {
  const P = c.P; moSky(c, 'd'); const r = c.back, G = PX.G;
  for (const [px, ph, pw] of [[50, 26, 40], [140, 32, 46]]) for (let y = 0; y < ph; y++) { const w = Math.round(pw * y / ph); for (let i = -w; i <= w; i++) r.px(px + i, G - 14 - ph + y, i < 0 ? P.far2 : P.far1); }
  c.mid.rect(0, G - 14, PX.W, 10, P.water); for (let x = 0; x < PX.W; x++) if ((x * 7) % 11 < 2) c.mid.px(x, G - 12 + (x % 3) * 3, P.water2);
  moGrass(c, c.mid, G - 4); for (const x of [16, 26, 38, 158, 170, 182]) pxTree(c.mid, x, G - 3, reg === 'hi' || reg === 'eca' ? 'pine' : pxTreeKind(reg), P);
};
MO.fly = c => {
  const P = c.P, k = c.cast; moRoom(c, { wall: P.light(P.wall2, 0.3), floor: 'tile', plain: true });
  const r = c.mid; r.rect(10, 4, 172, 32, P.light(P.metal, 0.2)); for (let x = 11; x < 181; x += 17) { for (let y = 5; y < 35; y++) r.rect(x, y, 16, 1, pxMix(moRGB(P.sky.d[0]), moRGB(P.sky.d[1]), (y - 5) / 30)); }
  r.rect(11, 30, 170, 5, P.pave2); for (let x = 14; x < 180; x += 10) r.rect(x, 32, 5, 1, P.light(P.wall, 0.7));
  moPlane(c, 120, 14, r, 2); r.line(116, 20, 104, 26, P.light(P.wall, 0.5));
  r.rect(22, 38, 30, 7, P.ol); for (let i = 0; i < 3; i++) for (let x = 24; x < 50; x += 3) r.px(x, 39 + i * 2, x % 9 ? P.gold : P.tree);
  const goers = [k.me, ...k.pt, ...k.kids.filter(p => p.age < 18)].slice(0, 4), stay = k.me.age < 30 ? k.par.slice(0, 2) : [];
  const xs = moRow(c, goers.map(p => ({ s: moFig(p, P, { pose: p === k.me ? 'wave' : '' }), dy: p === k.me ? 1 : 0 })), MO_CX + 10);
  moSuitcase(c, c.span[1] + 2, PX.G, P.accent); moSuitcase(c, c.span[0] - 7, PX.G, P.stamp);
  let x = c.span[0] - 12; for (const p of stay) { const s = moFig(p, P, { pose: 'wave' }); x -= s.w + 2; moPut(c, s, x, PX.G - s.h); moSpan(c, x, c.span[1]); }
};
MO.back = c => {
  const P = c.P, k = c.cast; moSky(c, 'e'); moFar(c); moGrass(c);
  const h = pxHome(Object.assign({}, c.m, { home: c.m.home === 'flat' ? 'house' : c.m.home }), P, c.R); c.mid.blit(h, 20, PX.G - h.h, P.ol);
  moBunting(c, 10, 60, 150);
  const fam = [...k.par, ...k.sib, ...k.pt, ...k.kids].slice(0, 4); while (fam.length < 2) fam.push(moGen(c, 'sib', null, k.me.age + 25));
  moRow(c, [...fam.map(p => ({ s: moFig(p, P, { pose: 'up' }) })), { s: moFig(k.me, P, { pose: 'up' }), dy: 1, gap: 3 }], MO_CX + 6);
  moSuitcase(c, c.span[1] + 2, PX.G, P.accent); fxSpark(c, MO_CX + 6, 16, 3);
};
MO.home = c => {
  const P = c.P, k = c.cast; moSky(c, 'd'); moFar(c); moGrass(c);
  const hm = Object.assign({}, c.m, { stage: 'd' }), h = pxHome(hm, P, c.R); c.mid.blit(h, MO_CX - (h.w >> 1) + 30, PX.G - h.h, P.ol);
  moTreeBig(c, 26, PX.G); moTreeBig(c, 170, PX.G);
  const me = moFig(k.me, P, { pose: 'wave' }), row = moAround({ s: me, dy: 1 }, moFam(c, 4, { noPar: true }).map(p => ({ s: moFig(p, P, { pose: p.age < 13 ? 'up' : '' }) })));
  const xs = moRow(c, row, MO_CX - 14); const i = row.findIndex(x => x.s === me);
  c.front.rect(xs[i] + me.w - 1, PX.G - me.h + 1 - 1, 2, 3, P.gold); c.front.px(xs[i] + me.w, PX.G - me.h + 3, P.gold);
  const bx = c.span[0] - 18; for (const [dx, dy, w] of [[0, 0, 10], [10, 0, 8], [3, -6, 8]]) { c.front.rect(bx + dx, PX.G - 6 + dy, w, 6, P.light(P.trunk, 0.35)); c.front.rect(bx + dx + (w >> 1), PX.G - 6 + dy, 1, 6, P.light(P.sand, 0.5)); }
  moSpan(c, bx, c.span[1]); fxConfetti(c, 10, 30);
};
MO.car = c => {
  const P = c.P, k = c.cast, moto = c.a[0] === 'moto'; moSky(c, 'd'); moFar(c); moPave(c);
  const r = c.front, x = MO_CX + 2;
  if (moto) { const mt = pxMoto(P, false); r.blit(mt, x, PX.G - mt.h, null); }
  else { const C = P.accent, car = new PxR(32, 13); car.rect(8, 0, 14, 5, C); car.rect(10, 1, 4, 3, P.win); car.rect(15, 1, 5, 3, P.win); car.rect(0, 5, 32, 5, C); car.rect(0, 9, 32, 1, P.shade(C, 0.3)); car.rect(30, 6, 2, 2, P.gold); car.rect(0, 6, 1, 2, P.light(P.accent, 0.5)); r.blit(car, x, PX.G - 14, P.ol); for (const wx of [x + 7, x + 25]) { r.disc(wx, PX.G - 2, 2, P.ol); r.px(wx, PX.G - 2, P.metal); } const R2 = moRGB('#E04848'); r.rect(x + 14, PX.G - 14, 2, 10, R2); r.disc(x + 15, PX.G - 15, 2, R2); r.px(x + 15, PX.G - 15, P.light(R2, 0.4)); }
  const me = moFig(k.me, P, { pose: 'wave' }); moPut(c, me, x - me.w - 4, PX.G - me.h + 1); moSpan(c, x - me.w - 6, x + (moto ? 16 : 34));
  const o = moFam(c, 2, { noPar: true }); let xx = x - me.w - 6; for (const p of o) { const s = moFig(p, P, { pose: 'up' }); xx -= s.w + 2; moPut(c, s, xx, PX.G - s.h); moSpan(c, xx, c.span[1]); }
  fxSpark(c, x + 14, 18, 3);
};
MO.pet = c => {
  const P = c.P, k = c.cast, kind = c.a[0] || c.m.pet || 'd'; moSky(c, 'd'); moFar(c); moGrass(c);
  const h = pxHome(c.m, P, c.R); c.mid.blit(h, 18, PX.G - h.h, P.ol); moTreeBig(c, 170, PX.G);
  const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 8; moPut(c, me, x, PX.G - me.h);
  const pet = pxPet(kind, P); moPut(c, pet, x + me.w - 2, PX.G - pet.h);
  const o = moFam(c, 2); let xx = x - 2; for (const p of o) { const s = moFig(p, P, { pose: 'up' }); xx -= s.w + 2; moPut(c, s, xx, PX.G - s.h); }
  c.front.disc(x + me.w + pet.w + 6, PX.G - 2, 2, P.accent); c.front.px(x + me.w + pet.w + 5, PX.G - 3, P.light(P.accent, 0.5));
  fxHeart(c, x + me.w - 2, PX.G - me.h - 8); moSpan(c, xx, x + me.w + pet.w + 10);
};
MO.grand = c => {
  const P = c.P, k = c.cast, born = c.a[0] === 'new'; moRoom(c, { win: [[30, 22]], frames: [146, 160], lamp: 176 });
  const r = c.front, x0 = MO_CX - 26, w = 52; r.rect(x0, PX.G - 12, w, 3, P.light(P.accent, 0.35)); r.rect(x0, PX.G - 9, w, 6, P.light(P.accent, 0.25)); r.rect(x0 - 3, PX.G - 14, 4, 11, P.light(P.accent, 0.3)); r.rect(x0 + w - 1, PX.G - 14, 4, 11, P.light(P.accent, 0.3)); r.rect(x0 + 2, PX.G - 3, 2, 3, P.trunk); r.rect(x0 + w - 4, PX.G - 3, 2, 3, P.trunk);
  c.mid.rect(x0, PX.G - 22, w, 10, P.light(P.accent, 0.4));
  const gks = k.gk.length ? k.gk.slice(0, 3) : [moGen(c, 'kid', null, 6), moGen(c, 'kid', null, 3)];
  const me = moFig(k.me, P, born ? { pose: 'hold', bun: P.light(P.kid, 0.55) } : { pose: 'sit' });
  const items = [{ s: me, dy: -3 }, ...k.pt.slice(0, 1).map(p => ({ s: moFig(p, P, { pose: 'sit' }), dy: -3 })), ...gks.map(p => ({ s: moFig(p, P, { pose: p.age < 7 ? 'up' : 'sit' }), dy: p.age < 7 ? 0 : -3 }))];
  moRow(c, items, MO_CX, PX.G - 3 + 0, 1);
  r.rect(x0, PX.G - 9, w, 1, P.shade(P.light(P.accent, 0.25), 0.1));
  fxHeart(c, MO_CX - 2, 10);
};
MO.phone = c => {
  const P = c.P, k = c.cast, gift = c.a[0] === 'gift'; moRoom(c, { win: [[MO_CX - 2, 26]], frames: [40, 150] });
  const me = moFig(k.me, P, {}), x = MO_CX - 16; moPut(c, me, x, PX.G - me.h + 1);
  c.front.rect(x + me.w - 2, PX.G - me.h + 1 + 4, 2, 3, P.ol);
  c.front.blit(pxSprite(['.WWWWW.', 'WWWWWWW', 'WWWHWWW', 'WWWWWWW', '.WWWWW.', '....WW.', '.....W.'], { W: moWhite(P), H: P.light(P.accent, 0.1) }), x + me.w + 2, PX.G - me.h - 8, P.ol);
  if (gift) { const bx = x + me.w + 14; c.front.rect(bx, PX.G - 7, 9, 7, P.light(P.trunk, 0.35)); c.front.rect(bx + 4, PX.G - 7, 1, 7, P.accent); c.front.rect(bx, PX.G - 5, 9, 1, P.accent); c.front.px(bx + 3, PX.G - 8, P.accent); c.front.px(bx + 5, PX.G - 8, P.accent); }
  moSpan(c, x - 4, x + me.w + 24);
};
MO.photos = c => {
  const P = c.P, k = c.cast; moRoom(c, { lamp: MO_CX - 26 });
  const r = c.mid; for (let i = 0; i < 9; i++) { const x = 62 + (i % 5) * 14 + (i >= 5 ? 7 : 0), y = 8 + (i >= 5 ? 12 : 0); r.rect(x, y, 10, 8, P.trunk); r.rect(x + 1, y + 1, 8, 6, P.light(P.wall, 0.65)); r.rect(x + 3, y + 3, 4, 4, [P.me, P.kid, P.pt, P.accent][i % 4]); r.disc(x + 5, y + 3, 1, P.skin); }
  const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 6; const f = c.front;
  f.rect(x - 4, PX.G - 18, me.w + 8, 14, P.light(P.accent, 0.3)); moPut(c, me, x, PX.G - me.h - 2); f.rect(x - 5, PX.G - 9, 4, 9, P.light(P.accent, 0.2)); f.rect(x + me.w + 1, PX.G - 9, 4, 9, P.light(P.accent, 0.2)); f.rect(x - 3, PX.G - 4, me.w + 6, 4, P.light(P.accent, 0.25));
  f.rect(x + 1, PX.G - 10, 7, 3, moWhite(P)); f.rect(x + 4, PX.G - 10, 1, 3, P.shade(P.trunk, 0.2));
  if (k.pt.length) { const s = moFig(k.pt[0], P, {}); moPut(c, s, x + me.w + 8, PX.G - s.h); }
  moSpan(c, x - 8, x + me.w + 18);
};
MO.garden = c => {
  const P = c.P, k = c.cast; moSky(c, 'e'); moFar(c); moGrass(c);
  const r = c.mid; r.rect(50, PX.G - 2, 92, 8, P.soil); for (let i = 0; i < 4; i++) { r.rect(50, PX.G + i * 2, 92, 1, P.soil2); for (let x = 54 + (i % 2) * 3; x < 140; x += 7) { r.disc(x, PX.G - 3 + i * 2, 2, i % 2 ? P.tree : P.light(P.tree, 0.2)); if (i === 1) r.px(x + 1, PX.G - 4, P.accent); } }
  for (let x = 0; x < PX.W; x += 5) { r.rect(x, PX.G - 9, 1, 9, P.light(P.trunk, 0.3)); } r.rect(0, PX.G - 7, PX.W, 1, P.light(P.trunk, 0.3));
  const me = moFig(k.me, P, { hat: 'straw' }), x = MO_CX - 10; moPut(c, me, x, PX.G - me.h + 1);
  const bk = pxSprite(['.RGRYR.', 'TGRYGRT', 'TTTTTTT', '.TTTTT.'], { T: P.thatch, G: P.tree, R: P.accent, Y: P.gold }); moPut(c, bk, x + me.w, PX.G - me.h + 1 + me.hand[1] - 1);
  const nb = moFig(k.pt[0] || moGen(c, 'par', null, k.me.age + 2), P, { pose: 'wave' }); moPut(c, nb, x + me.w + 12, PX.G - nb.h);
  moSpan(c, x - 2, x + me.w + 12 + nb.w + 2);
};
MO.help = c => {
  const P = c.P, k = c.cast; moSky(c, 'd'); moFar(c); moPave(c);
  const h = pxHome(Object.assign({}, c.m, { home: c.m.urban ? 'flat' : c.m.home }), P, c.R); c.mid.blit(h, 14, PX.G - h.h, P.ol);
  const T = new PxR(40, 18); T.rect(0, 0, 28, 14, P.light(P.wall, 0.5)); T.rect(28, 4, 11, 10, P.stamp); T.rect(30, 6, 6, 4, P.win); T.rect(0, 13, 40, 2, P.shade(P.wall3, 0.2)); c.mid.blit(T, 128, PX.G - 17, P.ol); for (const wx of [136, 162]) { c.mid.disc(wx, PX.G - 1, 2, P.ol); }
  const me = moFig(k.me, P, {}), nb = moFig(moGen(c, 'par', null, k.me.age + 6), P, {}), x = MO_CX - 12;
  moPut(c, me, x, PX.G - me.h + 1); moPut(c, nb, x + me.w + 8, PX.G - nb.h);
  const by = PX.G - me.h + 1 + me.hand[1] - 4; c.front.rect(x + me.w - 2, by, 12, 6, P.light(P.trunk, 0.35)); c.front.rect(x + me.w + 3, by, 1, 6, P.light(P.sand, 0.5));
  const kid = moFig(moGen(c, 'kid', null, 6), P, { pose: 'wave' }); moPut(c, kid, x + me.w + nb.w + 12, PX.G - kid.h);
  moSpan(c, x - 2, x + me.w + nb.w + 20);
};
MO.fest = c => {
  const P = c.P, k = c.cast, sa = c.m.region === 'sa'; moSky(c, 'night'); moFar(c); moGrass(c);
  fxLanterns(c, 4, 10, 182); fxLanterns(c, 12, 30, 160, c.back);
  const ps = [k.me, ...moFam(c, 3)]; while (ps.length < 5) ps.push(moGen(c, 'sib', null, 10 + c.R() * 50));
  moRow(c, ps.map((p, i) => ({ s: moFig(p, P, { pose: i % 2 ? 'wave' : 'up' }), dy: (i % 2) - (p.role === 'me' ? 0 : 0) })), MO_CX, PX.G, 4);
  if (sa) for (let x = 20; x < PX.W; x += 14) { c.front.rect(x, PX.G - 2, 3, 2, P.shade(P.trunk, 0.1)); c.front.px(x + 1, PX.G - 3, moRGB('#FFD86A')); }
  else { const fx = c.span[1] + 10; c.front.rect(fx - 4, PX.G - 1, 9, 2, P.trunk); for (let j = 0; j < 8; j++) for (let i = -3 + (j >> 1); i <= 3 - (j >> 1); i++) c.front.px(fx + i, PX.G - 2 - j, j < 3 ? moRGB('#F2A23A') : moRGB('#FFD86A')); moSpan(c, c.span[0], fx + 6); }
  fxNote(c, MO_CX - 20, 18); fxNote(c, MO_CX + 18, 14);
};
MO.stars = c => {
  const P = c.P, k = c.cast; moSky(c, 'night'); fxStars(c, 90);
  for (let i = 0; i < 140; i++) { const t = c.R(), x = t * PX.W, y = 4 + t * 30 + (c.R() - 0.5) * 10; c.sky.dither(Math.round(x), Math.round(y), moRGB('#6B6E9A'), 0.6); }
  c.sky.line(150, 8, 162, 12, moRGB('#FFF4CF'));
  pxHills(c.mid, P, c.R, 0.04, PX.G - 3, 5, moRGB('#2A3A44'), null); c.mid.rect(0, PX.G, PX.W, PX.H - PX.G, moRGB('#24343A')); for (let x = 0; x < PX.W; x++) if (c.R() < 0.25) c.mid.px(x, PX.G - 1, moRGB('#2E4248'));
  const old = k.me.age < 13 ? (k.par[0] || moGen(c, 'par', 'M', 66)) : null, two = old ? [old, k.me] : [k.me, ...(k.gk[0] ? [k.gk[0]] : k.kids[0] ? [k.kids[0]] : k.pt.slice(0, 1))];
  moRow(c, two.map(p => ({ s: moFig(p, P, { pose: 'sit' }) })), MO_CX, PX.G - 1, 2);
  c.front.rect(c.span[0] - 3, PX.G - 2, c.span[1] - c.span[0] + 6, 2, P.light(P.accent, 0.2));
};
MO.rain = c => {
  const P = c.P, k = c.cast, snow = c.a[0] === 'snow';
  if (snow) { for (let y = 0; y < PX.H; y++) c.sky.rect(0, y, PX.W, 1, pxMix(P.light(P.wall3, 0.35), P.light(P.wall, 0.6), y / PX.G)); moFar(c); c.mid.rect(0, PX.G - 1, PX.W, PX.H - PX.G + 1, P.light(P.wall, 0.85)); for (let x = 0; x < PX.W; x += 4) c.mid.px(x, PX.G + 2 + (x % 7), P.light(P.wall3, 0.5)); }
  else { const sk = Object.assign({}, c.m, { mood: 'low', stage: 'd' }); pxSky(c.sky, sk, P, c.R); for (let i = 0; i < 5; i++) pxCloud(c.sky, Math.round(15 + i * 40), Math.round(14 + c.R() * 6), 26, P, c.R, true); moFar(c); moGrass(c); for (const x of [40, 70, 130, 160]) c.mid.rect(x, PX.G + 4, 10, 1, P.light(P.water, 0.4)); }
  const h = pxHome(c.m, P, c.R); c.mid.blit(h, 16, PX.G - h.h, P.ol);
  const ps = [k.me, ...moFam(c, 3)]; while (ps.length < 3) ps.push(moGen(c, 'kid', null, 8));
  moRow(c, ps.map(p => ({ s: moFig(p, P, { pose: 'up' }), dy: p.role === 'me' ? 1 : 0 })), MO_CX + 8, PX.G, 4);
  if (snow) { const x = c.span[1] + 8, W = P.light(P.wall, 0.9); c.front.disc(x, PX.G - 3, 3, W); c.front.disc(x, PX.G - 8, 2, W); c.front.px(x, PX.G - 8, P.gold); c.front.px(x - 1, PX.G - 9, P.ol); c.front.px(x + 1, PX.G - 9, P.ol); moSpan(c, c.span[0], x + 4); fxSnow(c, 60); }
  else fxRain(c, 90);
};
MO.talk = c => {
  const P = c.P, k = c.cast, w = c.a[0] || 'fr';
  const o = w === 'par' ? k.par[0] || moGen(c, 'par', 'F', k.me.age + 28) : w === 'pt' ? k.pt[0] || moGen(c, 'pt', null, k.me.age) : w === 'kid' ? k.kids[0] || moGen(c, 'kid', null, 16) : moGen(c, 'sib', null, k.me.age);
  moSky(c, 'dusk'); moFar(c); moGrass(c); moTreeBig(c, 40, PX.G, 'round'); moTreeBig(c, 156, PX.G, 'round');
  const by = PX.G - 6; moRow(c, [{ s: moFig(k.me, P, { pose: 'sit' }) }, { s: moFig(o, P, { pose: 'sit' }) }], MO_CX, by + 3, 2);
  const bx = c.span[0] - 4, bw = c.span[1] - c.span[0] + 8; c.front.rect(bx, by, bw, 2, P.trunk); c.front.rect(bx + 1, by + 2, 1, PX.G - by - 2, P.ol); c.front.rect(bx + bw - 2, by + 2, 1, PX.G - by - 2, P.ol);
  c.mid.rect(bx, by - 8, bw, 2, P.trunk);
  for (const cx of [MO_CX - 9, MO_CX + 7]) { c.front.rect(cx, by - 9, 2, 2, moWhite(P)); c.front.px(cx, by - 11, P.light(P.smoke, 0.5)); }
};
MO.mil = c => {
  const P = c.P, k = c.cast, out = c.a[0] === 'out'; moSky(c, 'd'); moFar(c); moPave(c);
  for (const x of [60, 132]) { c.mid.rect(x, PX.G - 20, 4, 20, P.wall3); c.mid.rect(x - 1, PX.G - 21, 6, 2, P.shade(P.wall3, 0.2)); }
  c.mid.rect(64, PX.G - 18, 68, 3, P.wall3); c.mid.line(150, PX.G - 1, 150, PX.G - 32, P.metal); c.mid.rect(151, PX.G - 32, 10, 6, P.accent); c.mid.rect(151, PX.G - 29, 10, 1, P.light(P.wall, 0.7));
  const me = moFig(k.me, P, Object.assign({ pose: 'wave', hat: 'mil' }, moWear('mil', P)));
  const fam = [...k.par, ...k.pt, ...k.sib].slice(0, 3);
  const xs = moRow(c, moAround({ s: me, dy: 1 }, fam.map(p => ({ s: moFig(p, P, { pose: out ? 'up' : 'wave' }) }))), MO_CX);
  if (out) { const i = Math.floor(fam.length / 2); moBouquet(c, xs[Math.max(0, i - 1)] + 9, PX.G - 9); fxConfetti(c, 12, 30); }
};
MO.award = c => {
  const P = c.P, k = c.cast, kind = c.a[0] || 'prize';
  if (kind === 'medal') {
    moSky(c, 'd'); const r = c.back; r.rect(0, 20, PX.W, PX.G - 20, P.light(P.wall3, 0.2)); for (let y = 22; y < PX.G - 2; y += 3) for (let x = (y % 6) ? 0 : 2; x < PX.W; x += 4) r.px(x, y, [P.accent, P.water, P.gold, P.light(P.wall, 0.6)][(x + y) % 4]);
    moPave(c); const f = c.front, W = moWhite(P);
    for (const [dx, h, n] of [[-22, 6, 2], [-7, 11, 1], [8, 4, 3]]) { f.rect(MO_CX + dx, PX.G - h, 15, h, W); f.rect(MO_CX + dx, PX.G - h, 15, 1, P.light(P.gold, 0.3)); f.rect(MO_CX + dx + 7, PX.G - h + 2, 1, 2, P.ol); }
    const me = moFig(k.me, P, { pose: 'up', top: P.accent }); moPut(c, me, MO_CX - 7 + ((15 - me.w) >> 1), PX.G - 11 - me.h);
    f.disc(MO_CX + ((15 - me.w) >> 1) + (me.w >> 1) - 7, PX.G - 11 - me.h + me.hand[1] - 2, 1, P.gold);
    for (const [dx, h] of [[-22, 6], [8, 4]]) { const s = moFig(moGen(c, 'sib', k.me.sex, k.me.age), P, { pose: 'wave', top: dx < 0 ? P.water : P.stamp }); moPut(c, s, MO_CX + dx + ((15 - s.w) >> 1), PX.G - h - s.h); }
    for (let i = 0; i < 3; i++) { c.mid.line(70 + i * 26, PX.G - 1, 70 + i * 26, 6, P.metal); c.mid.rect(71 + i * 26, 6, 10, 6, [P.accent, P.water, P.gold][i]); }
    moSpan(c, MO_CX - 24, MO_CX + 24); fxConfetti(c, 24, 30); return;
  }
  if (kind === 'elect') {
    moSky(c, 'night'); moFar(c); moPave(c); const r = c.mid; r.rect(MO_CX - 40, 10, 80, 10, P.accent); for (let x = MO_CX - 36; x < MO_CX + 36; x += 4) r.rect(x, 14, 2, 2, P.light(P.wall, 0.8));
    r.rect(MO_CX - 50, PX.G - 6, 100, 6, P.shade(P.trunk, 0.2));
    const me = moFig(k.me, P, Object.assign({ pose: 'up' }, moWear('suit', P))); moPut(c, me, MO_CX - (me.w >> 1), PX.G - 6 - me.h + 1);
    k.pt.slice(0, 1).forEach(p => { const s = moFig(p, P, { pose: 'wave' }); moPut(c, s, MO_CX + 10, PX.G - 6 - s.h); });
    for (let x = 4; x < PX.W; x += 7) { c.front.disc(x, PX.H - 2, 3, P.shade(P.hair, 0.05)); if ((x / 7 | 0) % 2) { c.front.rect(x - 2, PX.H - 12, 5, 4, [P.light(P.wall, 0.85), P.light(P.accent, 0.3)][(x / 14 | 0) % 2]); c.front.px(x, PX.H - 8, P.trunk); } }
    moSpan(c, MO_CX - 16, MO_CX + 20); fxConfetti(c, 30, 40); return;
  }
  if (kind === 'stage') { MO_W.stage(c, 'idol'); const s = c.front, x = MO_CX + 4; s.rect(x, PX.G - 12, 3, 3, P.gold); s.rect(x + 1, PX.G - 9, 1, 2, P.gold); s.rect(x - 1, PX.G - 7, 5, 1, P.gold); fxConfetti(c, 22, 36); return; }
  moRoom(c, { wall: P.shade(P.accent, 0.35), floor: 'wood', plain: true });
  const r = c.mid; for (let x = 0; x < PX.W; x += 4) r.rect(x, 0, 2, PX.G - 2, P.shade(P.accent, 0.45)); for (let y = 0; y < PX.G; y++) for (let i = -12; i <= 12; i++) r.dither(MO_CX + i + Math.round((y - 20) / 4), y, P.light(P.gold, 0.5), 0.12);
  const me = moFig(k.me, P, Object.assign({ pose: 'wave' }, moWear('suit', P))); moPut(c, me, MO_CX - (me.w >> 1), PX.G - me.h + 1);
  const f = c.front, x = MO_CX + (me.w >> 1) + 1, y = PX.G - me.h + 1 + me.hand[1] - 6; f.rect(x, y, 4, 3, P.gold); f.rect(x + 1, y + 3, 2, 2, P.gold); f.rect(x, y + 5, 4, 1, P.gold);
  for (let xx = 10; xx < PX.W - 8; xx += 11) if (Math.abs(xx - MO_CX) > 18) { f.disc(xx, PX.H - 2, 2, P.light(P.hair, 0.15)); f.rect(xx - 3, PX.H - 1, 7, 1, P.light(P.hair, 0.1)); }
  moSpan(c, MO_CX - 12, MO_CX + 12); fxSpark(c, MO_CX, 14, 4);
};
MO.shop = c => {
  const P = c.P, k = c.cast; moSky(c, 'd'); moFar(c); moPave(c);
  const r = c.mid, x0 = MO_CX - 30, w = 60; r.rect(x0, PX.G - 30, w, 30, P.light(P.wall, 0.3)); r.rect(x0 + 4, PX.G - 22, 24, 14, P.win); r.rect(x0 + 36, PX.G - 22, 18, 22, P.shade(P.trunk, 0.1)); r.rect(x0 + 38, PX.G - 20, 14, 18, P.light(P.win, 0.2));
  for (let x = x0 - 2; x < x0 + w + 2; x++) { const col = ((x - x0) >> 2) % 2 ? P.wall : P.stamp; r.rect(x, PX.G - 34, 1, 4, col); if ((x - x0) % 4 < 2) r.px(x, PX.G - 30, col); }
  r.rect(x0 + 10, PX.G - 40, 40, 5, P.ol); r.rect(x0 + 12, PX.G - 39, 36, 3, P.gold);
  for (const fx of [x0 - 12, x0 + w + 4]) { r.line(fx + 4, PX.G - 1, fx + 4, PX.G - 14, P.trunk); r.disc(fx + 4, PX.G - 18, 5, P.light(P.accent, 0.4)); r.disc(fx + 4, PX.G - 18, 3, P.light(P.wall, 0.8)); }
  const ppl = [k.me, ...moFam(c, 3)]; const xs = moRow(c, ppl.map((p, i) => ({ s: moFig(p, P, { pose: p === k.me ? '' : 'up' }), dy: p === k.me ? 1 : 0 })), MO_CX, PX.G, 3);
  const R2 = moRGB('#E04848'); c.front.line(c.span[0] - 6, PX.G - 9, c.span[1] + 6, PX.G - 9, R2); c.front.disc(MO_CX, PX.G - 9, 1, R2);
  fxConfetti(c, 14, 30);
};
MO.flee = c => {
  const P = c.P, k = c.cast; pxSky(c.sky, Object.assign({}, c.m, { stage: 'e', mood: 'low' }), P, c.R);
  moFar(c); for (const [x0, n] of [[30, 7], [56, 5]]) for (let kk = n - 1; kk >= 0; kk--) { const cx = x0 + kk * 2, cy = PX.G - 10 - kk * 4, rad = 2 + (kk >> 1); c.back.disc(cx, cy, rad, P.shade(P.smoke, 0.15)); c.back.disc(cx - 1, cy - 1, rad - 1, P.smoke); }
  const r = c.mid; r.rect(0, PX.G, PX.W, PX.H - PX.G, P.light(P.soil, 0.2)); for (let y = PX.G; y < PX.H; y++) r.rect(60 - (y - PX.G) * 2, y, 70 + (y - PX.G) * 4, 1, P.light(P.sand, 0.15));
  const ps = [k.me, ...k.pt, ...k.kids, ...k.par, ...k.sib].slice(0, 5);
  const xs = moRow(c, ps.map(p => ({ s: moFig(p, P, { pose: 'walk' }), dy: p.role === 'me' ? 1 : 0 })), MO_CX + 10, PX.G + 1, 3);
  ps.forEach((p, i) => { if (p.age >= 12) { const s = moFig(p, P, {}); c.front.rect(xs[i] + 1, PX.G - s.h - 3, 7, 4, [P.light(P.accent, 0.3), P.light(P.water, 0.3), P.thatch][i % 3]); c.front.rect(xs[i] + 2, PX.G - s.h - 4, 5, 1, P.ol); } });
  for (let x = 140; x < 190; x += 14) { for (let y = 0; y < 8; y++) { const half = y; c.back.rect(x - half, PX.G - 9 + y, half * 2, 1, P.light(P.wall2, 0.2)); } }
};
MO.citizen = c => {
  const P = c.P, k = c.cast; moRoom(c, { wall: P.light(P.wall2, 0.3), floor: 'wood', plain: true });
  const r = c.mid; r.line(130, PX.G - 1, 130, 8, P.gold); r.rect(131, 8, 16, 12, P.stamp); r.disc(139, 14, 3, P.gold); r.disc(139, 14, 1, P.stamp);
  const me = moFig(k.me, P, { pose: 'wave' }); const xs = moRow(c, moAround({ s: me, dy: 1 }, moFam(c, 3).map(p => ({ s: moFig(p, P, { pose: 'up' }) }))), MO_CX - 6);
  const i = Math.floor(moFam(c, 3).length / 2) + (moFam(c, 3).length % 2 ? 0 : 0);
  c.front.rect(MO_CX - 6 - 2, PX.G - me.h - 4, 6, 4, moWhite(P)); c.front.px(MO_CX - 4, PX.G - me.h - 2, P.gold);
  fxConfetti(c, 12, 30);
};
MO.hobby = c => {
  const P = c.P, k = c.cast, id = c.a[0] || 'reading', sp = id.startsWith('sp_');
  const out = { sport: 1, hiking: 1, fishing: 1, photo: 1, garden: 1, art: 1, travel: 1 };
  if (id === 'travel') { c.a = ['mount', '', 'solo']; return MO.trip(c); }
  if (id === 'garden') return MO.garden(c);
  if (id === 'hiking') { c.a = ['mount', '', k.pt.length ? 'pt' : 'solo']; return MO.trip(c); }
  if (id === 'faith') return MO.fest(c);
  if (sp || id === 'sport') {
    moSky(c, 'd'); moFar(c); moGrass(c); c.mid.rect(0, PX.G + 4, PX.W, 1, P.light(P.wall, 0.7)); for (const x of [30, 166]) { c.mid.rect(x, PX.G - 14, 1, 14, moWhite(P)); c.mid.rect(x, PX.G - 14, 10, 1, moWhite(P)); c.mid.rect(x + 9, PX.G - 14, 1, 14, moWhite(P)); }
    const ball = { sp_basketball: P.light(P.accent, 0.1), sp_cricket: P.accent, sp_baseball: moWhite(P), sp_tennis: P.light(P.gold, 0.2) }[id] || moWhite(P);
    const me = moFig(k.me, P, { pose: 'up', top: P.accent }); moPut(c, me, MO_CX - 6, PX.G - me.h + 1);
    for (const [dx, col] of [[-26, P.water], [16, P.accent], [28, P.water]]) { const s = moFig(moGen(c, 'sib', k.me.sex, k.me.age), P, { pose: dx > 20 ? 'wave' : '', top: col }); moPut(c, s, MO_CX + dx, PX.G - s.h); }
    c.front.disc(MO_CX + 8, PX.G - 22, 1, ball); c.front.px(MO_CX + 8, PX.G - 22, P.ol); moSpan(c, MO_CX - 28, MO_CX + 40); return;
  }
  if (id === 'fishing') {
    moSky(c, 'm'); moFar(c); const r = c.mid; r.rect(0, PX.G - 6, PX.W, PX.H - PX.G + 6, P.water); for (let x = 0; x < PX.W; x++) if ((x * 7) % 11 < 2) r.px(x, PX.G - 3 + (x % 3) * 3, P.water2);
    r.rect(40, PX.G - 8, 70, 3, P.trunk); for (const x of [44, 76, 106]) r.rect(x, PX.G - 5, 2, 10, P.shade(P.trunk, 0.2));
    const me = moFig(k.me, P, { pose: 'sit', hat: 'cap', cap: P.stamp }); moPut(c, me, MO_CX - 10, PX.G - 8 - me.h + 2);
    const hx = MO_CX - 10 + me.w, hy = PX.G - 8 - me.h + 2 + me.hand[1]; c.front.line(hx, hy, hx + 16, hy - 14, P.trunk); c.front.line(hx + 16, hy - 14, hx + 18, PX.G - 2, P.light(P.ol, 0.4));
    c.front.rect(MO_CX - 22, PX.G - 13, 6, 5, P.metal); moSpan(c, MO_CX - 24, MO_CX + 26); return;
  }
  if (id === 'photo') { c.a = ['nature', '', 'solo']; return MO.trip(c); }
  if (id === 'art') { MO_W.studio(c, 'artist'); return; }
  if (id === 'drama' || id === 'dance' || id === 'karaoke') {
    moRoom(c, { wall: P.shade(P.accent, 0.4), floor: 'wood', plain: true }); const r = c.mid;
    for (let x = 0; x < PX.W; x += 4) r.rect(x, 0, 2, PX.G - 2, P.shade(P.accent, 0.5)); for (let y = 0; y < PX.G; y++) for (let i = -14; i <= 14; i++) r.dither(MO_CX + i, y, P.light(P.gold, 0.5), 0.12);
    const ps = [k.me, ...(id === 'karaoke' ? [moGen(c, 'sib', null, k.me.age), moGen(c, 'pt', null, k.me.age)] : [moGen(c, 'sib', null, k.me.age)])];
    moRow(c, ps.map((p, i) => ({ s: moFig(p, P, { pose: i ? 'wave' : 'up' }) })), MO_CX, PX.G, 6);
    if (id === 'karaoke') { r.rect(MO_CX - 16, 6, 32, 18, P.ol); r.rect(MO_CX - 15, 7, 30, 16, P.light(P.water, 0.2)); for (let i = 0; i < 3; i++) r.rect(MO_CX - 12, 17 + i * 2, 24 - i * 6, 1, P.light(P.wall, 0.8)); }
    fxNote(c, MO_CX - 22, 12); fxNote(c, MO_CX + 20, 16); return;
  }
  if (id === 'gym') {
    moRoom(c, { wall: P.light(P.wall3, 0.35), floor: 'tile', plain: true }); const r = c.mid; r.rect(20, 8, 152, 20, P.light(P.win, 0.35)); r.rect(140, PX.G - 12, 26, 10, P.ol); r.rect(142, PX.G - 14, 22, 2, P.metal);
    const me = moFig(k.me, P, { pose: 'up', top: P.stamp }); moPut(c, me, MO_CX - 4, PX.G - me.h + 1); c.front.rect(MO_CX - 8, PX.G - me.h - 2, me.w + 8, 1, P.metal); c.front.rect(MO_CX - 10, PX.G - me.h - 4, 3, 5, P.ol); c.front.rect(MO_CX + me.w - 1, PX.G - me.h - 4, 3, 5, P.ol);
    moSpan(c, MO_CX - 12, MO_CX + 16); return;
  }
  if (id === 'board') {
    moRoom(c, { win: [[30, 22]], frames: [150] }); const ps = [k.me, k.pt[0] || moGen(c, 'sib', null, k.me.age + 3)];
    moAtTable(c, ps.map(p => ({ s: moFig(p, P, {}) })), MO_CX, PX.G - 8, { gap: 14, cloth: false });
    const f = c.front; for (let i = 0; i < 8; i++) f.rect(MO_CX - 6 + i * 2 - 2, PX.G - 9, 2, 1, i % 2 ? P.ol : P.light(P.wall, 0.8)); f.px(MO_CX - 3, PX.G - 10, P.ol); f.px(MO_CX + 3, PX.G - 10, moWhite(P)); return;
  }
  if (id === 'cooking') { moRoom(c, { wall: P.light(P.wall, 0.5), floor: 'tile' }); const w = moFig(k.me, P, {}); moPut(c, w, MO_CX - 4, PX.G - w.h - 2); const f = c.front; f.rect(MO_CX - 22, PX.G - 7, 44, 7, P.light(P.trunk, 0.2)); f.rect(MO_CX + 6, PX.G - 12, 10, 5, P.shade(P.metal, 0.2)); for (let i = 0; i < 3; i++) f.px(MO_CX + 8 + i * 3, PX.G - 15 - (i % 2), P.light(P.smoke, 0.5)); const o = moFam(c, 2); let x = MO_CX - 24; for (const p of o) { const s = moFig(p, P, { pose: 'up' }); x -= s.w + 2; moPut(c, s, x, PX.G - s.h); } moSpan(c, x, MO_CX + 22); return; }
  if (id === 'crafts') { moRoom(c, { lamp: MO_CX + 24, frames: [50] }); const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 6; const f = c.front; f.rect(x - 4, PX.G - 18, me.w + 8, 14, P.light(P.stamp, 0.35)); moPut(c, me, x, PX.G - me.h - 2); f.rect(x - 3, PX.G - 4, me.w + 6, 4, P.light(P.stamp, 0.25)); f.disc(x + me.w + 6, PX.G - 2, 2, P.accent); f.line(x + me.w + 6, PX.G - 2, x + me.w - 1, PX.G - 9, P.accent); f.rect(x + 1, PX.G - 10, 6, 2, P.light(P.accent, 0.3)); moSpan(c, x - 6, x + me.w + 10); return; }
  if (id === 'music') { moSky(c, 'e'); moFar(c); moGrass(c); moTreeBig(c, 60, PX.G, 'round'); const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 6; moPut(c, me, x, PX.G - me.h); const f = c.front; f.rect(x - 1, PX.G - me.h + me.hand[1] - 2, 7, 4, P.gold); f.disc(x + 1, PX.G - me.h + me.hand[1], 1, P.ol); f.line(x + 6, PX.G - me.h + me.hand[1] - 1, x + 13, PX.G - me.h + me.hand[1] - 5, P.trunk); fxNote(c, x + 14, PX.G - me.h - 6); fxNote(c, x - 10, PX.G - me.h - 10); moSpan(c, x - 12, x + 20); return; }
  if (id === 'games' || id === 'screen' || id === 'sns') { moRoom(c, { view: 'night', win: [[24, 20]] }); const f = c.front, r = c.mid; r.rect(MO_CX + 14, 18, 26, 16, P.ol); r.rect(MO_CX + 15, 19, 24, 14, P.light(P.water, 0.25)); for (let j = -10; j <= 14; j++) for (let i = -30; i <= 6; i++) if (i * i + j * j < 600) r.dither(MO_CX + 20 + i, 26 + j, P.light(P.water, 0.5), 0.12); f.rect(MO_CX - 30, PX.G - 12, 40, 4, P.light(P.accent, 0.3)); const ps = [k.me, ...moFam(c, 1)]; moRow(c, ps.map(p => ({ s: moFig(p, P, { pose: 'sit' }) })), MO_CX - 10, PX.G - 2, 2); f.rect(MO_CX - 30, PX.G - 8, 40, 5, P.light(P.accent, 0.22)); if (id === 'games') f.rect(MO_CX - 12, PX.G - 9, 4, 2, P.ol); return; }
  moSky(c, 'e'); moFar(c); moGrass(c); const r = c.mid; r.rect(MO_CX - 22, PX.G - 20, 3, 20, P.trunk); r.disc(MO_CX - 20, PX.G - 26, 12, P.tree); r.disc(MO_CX - 16, PX.G - 24, 7, P.tree2);
  const me = moFig(k.me, P, { pose: 'sit' }), x = MO_CX - 14; moPut(c, me, x, PX.G - me.h); c.front.rect(x + 1, PX.G - me.h + me.hand[1] - 2, 7, 3, P.accent); c.front.rect(x + 4, PX.G - me.h + me.hand[1] - 2, 1, 3, moWhite(P));
  moSpan(c, MO_CX - 34, MO_CX + 4);
};
for (const [k, v] of Object.entries(RPAL)) RC[k] = pxRGB(v);
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('button'); if (!t) return;
  if (t.dataset.wishgo != null) wishSheet(t.dataset.wishgo);
  else if (t.id === 'wshGo') wishStart();
  else if (t.dataset.wsh != null) wishPick(+t.dataset.wsh);
  else if (t.id === 'wshBack') { if (typeof WS.step === 'number' && WS.step > 0) { WS.step--; wishDraw(); } }
  else if (t.id === 'wshAgain') wishStart();
  else if (t.id === 'wshPic') wishPicture();
});
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[data-ps]');
  if (a && PS.o) { track('card_share', { kind: PS.o.kind + '_' + a.dataset.ps }); return; }
  const t = e.target.closest && e.target.closest('button'); if (!t || !PS.o) return;
  if (t.id === 'psImg') psImg();
  else if (t.id === 'psSave') psSave();
  else if (t.id === 'psCopy') { copyText(PS.o.text, L`글과 링크를 복사했어요. ${pasteWhere()} 붙여넣어 주세요.`); track('card_share', { kind: PS.o.kind + '_copy' }); }
});
(function copyNote() {
  // Disclaimers disabled permanently
})();
delete UI.prefs.edu;
try { lsSet(PREF_KEY, UI.prefs); } catch(e){}
EDU_ON = false;
HOOK.noPause = () => UI.prefs.reflect === false;
HOOK.humRecent = () => { const v = lsGet(HUM_KEY, []); return Array.isArray(v) ? v.flat().filter(x => typeof x === 'string') : []; };
HOOK.calm = () => { if (CALM_AT == null) { let v = 0; try { v = +localStorage.getItem(CALM_KEY) || 0; } catch (e) { } CALM_AT = v; } return Date.now() - CALM_AT < CALM_MS; };
addEventListener('beforeinstallprompt', e => { e.preventDefault(); A2.evt = e; a2Render(); });
addEventListener('appinstalled', () => { A2.evt = null; UI.prefs.a2hs = 'done'; lsSet(PREF_KEY, UI.prefs); track('a2hs', { kind: 'installed' }); a2Render(); });
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
    if (window.__SECURE_STORAGE__) window.__SECURE_STORAGE__.setItem('vhts_soul_karma', soulData); else localStorage.setItem('vhts_soul_karma', JSON.stringify(soulData));
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
function start(data) {
  applyTheme();
  track('view');
  const fl = $('#friendLine'), ft = FRIEND_PATH && !EDU_ON ? friendLine() : ''; if (fl && ft) { fl.textContent = ft; fl.hidden = false; }
  try { tdBand(); } catch (e) { reportCaught(e); }
  if (FRIEND_PATH && history.replaceState) try { history.replaceState(null, '', LP + '/'); } catch (e) { }
  const foot = $('#introFoot'), row = $('#startBtn') && $('#startBtn').closest('.ctarow');
  const footAt = row && matchMedia('(min-width: 701px)').matches ? (row.closest('.opts') || row) : row;
  if (foot && footAt && 'IntersectionObserver' in window) new IntersectionObserver(es => { foot.classList.toggle('off', es[0].isIntersecting); unlivedPlace(); }, { threshold: 0 }).observe(footAt);
  bind();

document.addEventListener('click', function(e) {
  if (e.target && (e.target.id === 'cfgToggle' || e.target.closest('#cfgToggle'))) {
    const p = document.getElementById('cfgPanel');
    if (p) {
      const isHidden = p.style.display === 'none';
      p.style.display = isHidden ? 'grid' : 'none';
      if (isHidden) p.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

  if ($('#verTag')) $('#verTag').textContent = 'v' + verStr();
  eduApply();
  initHomeSel();
  renderIntro(); pdbInit(); unlivedRender();
  tgStart();
  const snap = data && data.S;
  if (snap) { UI.prefs = data.prefs || UI.prefs; restore(snap); }
  else { show('intro'); resumeDead(); }
  initOnlineCounter();
  a2Init();
  if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ S, prefs: UI.prefs }));
  requestAnimationFrame(t => { last = t; frame(t); });
}

// Bộ đếm số người chơi cùng lúc (mô phỏng nhịp thở máy chủ thời gian thực)
let _onlineCount = Math.floor(980 + Math.random() * 240); // Khởi tạo ngẫu nhiên quanh khoảng 1.000 (980 - 1.220)
function updateOnlineDisplay() {
  const el = document.getElementById('onlineCountNum');
  if (el) el.textContent = _onlineCount.toLocaleString('vi-VN');
}
function tickOnlinePlayers() {
  const steps = [-2, -1, 0, 1, 1, 2, -1, 1];
  const step = steps[Math.floor(Math.random() * steps.length)];
  _onlineCount = Math.max(880, Math.min(1450, _onlineCount + step));
  updateOnlineDisplay();
  const delay = Math.floor(20000 + Math.random() * 25000);
  setTimeout(tickOnlinePlayers, delay);
}
function initOnlineCounter() {
  updateOnlineDisplay();
  const initialDelay = Math.floor(15000 + Math.random() * 15000);
  setTimeout(tickOnlinePlayers, initialDelay);
}
if (ROOT_AWAY) { } else if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start); else start((window.claude && window.claude.hot && window.claude.hot.data) || {});