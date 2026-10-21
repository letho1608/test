// js/human.js - Nhan vat, chuyen, tang, tri an
const GRIEF_P = 0.45, GRIEF_MAX = 6, GRIEF_ORD = { pt: 0, kid: 1, par: 2, sib: 3, gp: 4, fr: 5 }, GRIEF_CAP = { gp: 1, fr: 2, sib: 2 };
function griefLine(g) {
  const n = g.n, kids = S.fam.kids.some(k => k.alive && k.grown);
  if (g.s) return varied('gfx', [L`${n}의 기일이 돌아왔습니다. 오래 붙들고 있던 '왜'를 내려놓고, 함께한 날들을 떠올리기로 했습니다.`, L`${n}의 이야기를 처음으로 다른 사람 앞에서 꺼냈습니다. 마지막보다 함께 웃던 날들을 이야기했습니다.`]);
  switch (g.r) {
    case 'pt': return varied('gfp', [noWalk() ? L`${wa(n)} 자주 가던 찻집에 혼자 들렀습니다. 슬프기보다 고마운 마음이 먼저 들었습니다.` : L`${wa(n)} 자주 걷던 길을 혼자 걸었습니다. 슬프기보다 고마운 마음이 먼저 들었습니다.`,
      kids ? L`${n}의 기일에 아이들이 모여 옛이야기를 하며 한참 웃었습니다.` : L`${iga(n)} 아끼던 물건을 하나씩 정리했습니다. 몇 가지는 그대로 두기로 했습니다.`]);
    case 'kid': if (g.ka >= 18) {
        const gk = (S.fam.grand || []).some(x => !x.gone && x.of === n);
        return varied('gfK', [L`${n}의 생일에 ${iga(n)} 좋아하던 음식을 차렸습니다. 함께 먹던 날들을 이야기하다 처음으로 웃었습니다.`,
          L`${iga(n)} 쓰던 물건 몇 가지를 버리지 못하고 간직했습니다. 가끔 꺼내 만져 보면 그 시절이 손끝에 남아 있었습니다.`].concat(gk ? [L`${n}의 아이들이 찾아왔습니다. 웃는 얼굴이 ${eul(n)} 꼭 닮아서 한참을 바라보았습니다.`] : []));
      }
      return varied('gfk', [L`${n}의 생일이면 가족이 모여 ${n} 이야기를 합니다. 올해는 처음으로 웃으며 이야기했습니다.`, L`${n}의 이름으로 동네 아이들에게 작은 선물을 보냈습니다. 그렇게 ${eul(n)} 기억하고 싶었습니다.`]);
    case 'par': return S.age < 18 ? L`${n}의 사진을 머리맡에 두고 잠듭니다. 이제는 사진을 보며 웃을 수 있게 되었습니다.`
      : varied(g.far ? 'gfrF' : 'gfr', [g.far ? L`${n}의 기일에 멀리서나마 생전에 즐겨 드시던 음식을 차려 놓았습니다. 슬프기보다 그리운 날이었습니다.` : L`${n}의 기일에 가족이 모여 생전에 즐겨 드시던 음식을 차렸습니다. 슬프기보다 그리운 날이었습니다.`, L`문득 ${iga(n)} 늘 하던 말이 떠올라 혼자 웃었습니다. 그 말이 어느새 내 말버릇이 되어 있었습니다.`]);
    case 'gp': return S.age < 18 && !noHear() ? L`${iga(n)} 들려주던 이야기를 아직 기억합니다. 가끔 혼자 그 이야기를 다시 떠올려 봅니다.` : g.far ? L`${iga(n)} 쓰던 물건 하나를 아직 간직하고 있습니다.` : varied('gfg', [L`${n}의 기일에 가족이 모여 옛이야기를 나눴습니다.`, L`${iga(n)} 쓰던 물건 하나를 아직 간직하고 있습니다.`]);
    case 'sib': return S.age < 18 ? L`${iga(n)} 쓰던 물건을 아직 버리지 못했습니다. 가끔 꺼내 보며 함께 놀던 날을 떠올립니다.`
      : typeof farKin === 'function' && farKin() ? L`${iga(n)} 남긴 사진을 보다가 어릴 적 함께 뛰놀던 골목이 떠올랐습니다.`
      : varied('gfs', [L`${n}의 기일에 남은 가족이 모여 ${n} 이야기를 나눴습니다. 어릴 적 이야기에 다 같이 웃었습니다.`, L`${iga(n)} 남긴 사진을 보다가 어릴 적 함께 뛰놀던 골목이 떠올랐습니다.`]);
    default: return varied('gff', [L`오랜 친구 ${n}의 기일에 함께 어울리던 이들이 모여 밤새 ${n} 이야기를 나눴습니다.`].concat(noHear() ? [] : [L`먼저 떠난 친구 ${iga(n)} 좋아하던 노래가 흘러나와 끝까지 들었습니다.`]));
  }
}
function griefYear(a) {
  const f = S.flags; if (!f.grief || !f.grief.length) return;
  f.grief = f.grief.filter(x => !x.done && a - x.at <= 4);
  if (S.job === 'prison' || f.wmY === a || (f.griefN || 0) >= GRIEF_MAX || !chance(GRIEF_P)) return;
  const cnt = f.griefR || (f.griefR = {});
  const due = f.grief.filter(x => a - x.at >= 1 && (cnt[x.r] || 0) < (GRIEF_CAP[x.r] || 9)).sort((x, y) => GRIEF_ORD[x.r] - GRIEF_ORD[y.r]);
  if (!due.length) return;
  const x = due[0]; x.done = 1; cnt[x.r] = (cnt[x.r] || 0) + 1; f.griefN = (f.griefN || 0) + 1; f.wmY = a;
  eff({ h: 2, so: 1 });
  const fact = f.griefFact ? undefined : "Phần lớn những người mất đi người thân, dù đau buồn sâu sắc, vẫn giữ được nhịp sống thường ngày hoặc lấy lại được trong vòng một hai năm (Bonanno 2004)";
  f.griefFact = 1; logA('mem:' + x.r, griefLine(x), 'warm', fact);
  if (x.s) S.log[S.log.length - 1].d = 'suic';
}
function kidMemYear(a) {
  const f = S.flags; if (S.isComp || S.job === 'prison' || f.wmY === a || f.hideCN) return;
  for (const k of S.fam.kids || []) {
    if (k.alive || k.dA == null || k.dA < 18 || k.dC === 'suic' || k.mem2 || k.cut != null || !k.name) continue;
    const would = a - k.bornAt; if (a - (k.bornAt + k.dA) < 5 || would % 10 !== 0 || !chance(0.5)) continue;
    const n = callName(k.name), gk = (S.fam.grand || []).some(g => !g.gone && g.of === n && g.ofSex === k.sex && a - g.bornAt >= 18);
    k.mem2 = 1; f.wmY = a; eff({ h: 1, so: 1 });
    logA('mem:kid', gk ? L`${n}의 아이가 어느새 어른이 되어 찾아왔습니다. 그 얼굴에서 ${eul(n)} 보았습니다.` : L`살아 있었다면 ${n}도 올해 ${would}세가 되었을 겁니다. 그날은 하루 종일 ${n} 생각을 했습니다.`, 'warm');
    return;
  }
}
const HOSTS = ['TUR', 'IRN', 'COL', 'DEU', 'PAK', 'UGA', 'RUS', 'POL', 'BGD', 'ETH', 'SDN', 'TCD', 'JOR', 'LBN', 'KEN', 'PER', 'CHL', 'EGY', 'USA', 'FRA', 'CMR', 'COD', 'SSD', 'NER', 'BRA', 'ECU', 'GBR', 'CAN', 'ESP', 'ITA', 'SWE', 'NLD', 'KOR', 'JPN'];
const parentWord = () => S.fam.mom.alive ? "mẹ" : "bố";
const parHome = () => { const h = homeOthers(); return S.fam.mom.alive ? h.mom : h.dad; };
const riftSib = () => { const r = S.flags.rift, l = typeof sibAliveList === 'function' ? sibAliveList() : []; return !r ? null : r.i != null ? l.find(x => x.i === r.i) || null : l[0] || null; };
const HUM = {
  stranger: { ok: () => S.age >= 16 && S.age < 80, build: () => ({ title: "Người ngã gục bên đường", body: "Một người lạ ngã gục bên đường. Ai cũng vội vã đi qua.", choices: [{ k: 'help', label: "Đưa người ấy đến bệnh viện", sub: "Tốn một chút thời gian và tiền" }, { k: 'pass', label: "Sẽ có người khác giúp, đi tiếp", sub: '' }] }),
    apply: k => { if (k === 'help') { S.money -= med() * 0.02; eff({ h: 4, so: 3 }); return { t: "Bạn đi cùng người ấy đến tận bệnh viện. Vài ngày sau, gia đình họ tìm đến cảm ơn bạn.", k: 'warm' }; } eff({ h: -2 }); return { t: "Bạn không bao giờ biết người ấy rồi ra sao.", k: 'bad' }; } },
  newneighbor: { ok: () => S.age >= 18 && !S.refugee && HOSTS.includes(S.cur) && !careNow(), build: () => ({ title: "Gia đình mới chuyển đến nhà bên", body: "Một gia đình chạy tránh xung đột vừa chuyển đến nhà bên. Hai bên khó mà hiểu được lời nhau.", fact: "Khoảng 69% người tị nạn trên thế giới sống ở một nước láng giềng ngay cạnh quê hương mình (UNHCR 2024)", choices: [{ k: 'share', label: "Mang đồ ăn sang chào hỏi", sub: '' }, { k: 'keep', label: "Giữ khoảng cách vừa phải", sub: '' }] }),
    apply: k => { if (k === 'share') { eff({ so: 5, h: 4 }); const myKid = S.fam.kids.some(k => k.alive && S.age - k.bornAt >= 3 && S.age - k.bornAt < 16);
      return { t: myKid ? "Bạn trò chuyện rất lâu bằng vốn từ ít ỏi và cử chỉ tay. Con nhà ấy đã kết bạn với con bạn." : S.age >= 60 ? (S.sex === 'F' ? "Bạn trò chuyện rất lâu bằng vốn từ ít ỏi và cử chỉ tay. Lũ trẻ nhà ấy gọi bạn là bà và rất quý bạn." : "Bạn trò chuyện rất lâu bằng vốn từ ít ỏi và cử chỉ tay. Lũ trẻ nhà ấy gọi bạn là ông và rất quý bạn.") : L`서툰 말과 손짓으로 한참을 이야기했습니다. 그 집 아이들이 나를 ${ira(S.sex === 'F' ? "dì" : "chú")}라고 부르며 따랐습니다.`, k: 'warm' }; } return false; } },
  speakup: { ok: () => isWorking() && S.age < 65, build: () => ({ title: "Đồng nghiệp bị chế giễu", body: "Một đồng nghiệp đang bị chế giễu trước mặt mọi người vì nơi họ xuất thân và giọng nói.", choices: [{ k: 'speak', label: "Lên tiếng bảo mọi người dừng lại", sub: "Không khí có thể trở nên ngượng ngùng" }, { k: 'silent', label: "Làm như không thấy", sub: '' }] }),
    apply: k => { if (k === 'speak') { eff({ so: 3, h: 2 }); return { t: "Từ hôm đó, bạn và người đồng nghiệp ấy trở nên thân thiết hơn ai hết.", k: 'warm' }; } eff({ h: -3 }); return { t: "Đêm hôm ấy, lòng bạn nặng trĩu rất lâu.", k: 'bad' }; } },
  forgive: { ok: () => { const r = S.flags.rift; return S.age >= 22 && !!r && !r.done && S.age - r.at >= 3 && (r.who !== 'sib' || !!riftSib()); },
    build: () => { const far = S.cur !== S.born && !famCame(), s = S.flags.rift.who === 'sib' ? riftSib() : null;
      return { title: "Mối bất hòa cũ", body: L`몇 년 전 크게 다투고 연락을 끊은 ${s ? sibCall(s) : "người bạn lâu năm"}에게서 먼저 연락이 왔습니다.`, choices: [{ k: 'meet', label: far ? "Nghe người ấy nói qua điện thoại" : "Gặp mặt và lắng nghe", sub: '' }, { k: 'later', label: "Lòng vẫn chưa sẵn sàng", sub: '' }] }; },
    apply: k => { if (k === 'meet') { S.flags.rift.done = S.age; eff({ so: 8, h: 5 }); return { t: S.cur !== S.born && !famCame() ? "Cuộc gọi dài kết thúc trong tiếng cười của cả hai. Bạn tự hỏi sao bấy lâu lại giận nhau như thế." : "Sau một cuộc trò chuyện dài, cả hai cùng bật cười. Bạn tự hỏi sao bấy lâu lại giận nhau như thế.", k: 'warm' }; } eff({ so: -2 }); return false; } },
  dream: { ok: () => S.age >= 18 && S.age <= 45 && !!kidDreamHob(), build: () => ({ title: "Giấc mơ ấp ủ bấy lâu", body: L`어릴 때는 커서 ${iga(OWN_DREAM()[S.flags.kidDream])} 되겠다고 말하곤 했습니다. 그 꿈은 어느새 마음 한구석에만 남았습니다. 이제라도 ${eul(hobbyName(kidDreamHob()))} 시작해 볼까요?` + (hobDrop() ? ' ' + hobDropLine() : ''), choices: [{ k: 'try', label: "Dành thời gian để bắt đầu", sub: "Hạnh phúc +, tốn tiền và thời gian" }, { k: 'later', label: "Tập trung vào chuyện mưu sinh", sub: '' }] }),
    apply: k => { if (k === 'try') { let id = kidDreamHob() || pick(['music', 'crafts', 'reading', 'photo', 'dance'].filter(x => !S.hobbies.some(h => h.id === x))) || 'music'; if (id === 'sport') { id = 'sp_' + C().sp.split(',')[0]; hobDef(id); } if (!S.hobbies.some(h => h.id === id)) hobAdd({ id, lv: 1, since: S.age }); S.money -= med() * 0.03; eff({ h: 6 }); return { t: L`${eul(hobbyName(id))} 시작했습니다. 서툴러도 즐거웠습니다.`, k: 'warm' }; } if (isWorking()) S.pct = clamp(S.pct + 0.01, 0, 0.99); return false; } },
  thanks: { ok: () => S.age >= 25 && S.age <= 70 && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !S.flags.saidThanks, build: () => ({ title: "Lời cảm ơn", body: L`${parentWord()}께 고맙다는 말을 마지막으로 한 게 언제였는지 기억나지 않습니다.`, choices: parHome() ? [{ k: 'call', label: "Nói trực tiếp ngay tối nay", sub: '' }, { k: 'next', label: "Để sau vậy", sub: '' }] : [{ k: 'call', label: "Gọi điện ngay để nói", sub: '' }, { k: 'next', label: "Để lần sau gặp rồi nói", sub: '' }] }),
    apply: k => { if (k === 'call') { S.flags.saidThanks = 1; eff({ so: 6, h: 4 }); return { t: parHome() ? L`저녁상 앞에서 말을 꺼내자 ${parentWord()}가 한참 말이 없으셨습니다.` : L`수화기 너머로 ${parentWord()}가 한참 말이 없으셨습니다.`, k: 'warm' }; } S.flags.thanksLater = 1; return false; } },
  mentor: { ok: () => isWorking() && S.age >= 40, build: () => ({ title: "Nỗi trăn trở của đồng nghiệp trẻ", body: "Một đồng nghiệp trẻ ở chỗ làm tâm sự với bạn rằng thấy tương lai mịt mờ.", choices: [{ k: 'help', label: "Dành thời gian lắng nghe", sub: '' }, { k: 'busy', label: "Bảo đang bận, hẹn để sau", sub: '' }] }),
    apply: k => { if (k === 'help') { eff({ so: 4, h: 3 }); return { t: "Vài năm sau, người đồng nghiệp ấy mời bạn đến dự đám cưới, nói rằng tất cả là nhờ bạn.", k: 'warm' }; } return false; } },
  nbrkid: { ok: () => S.age >= 25 && S.age <= 75 && !S.refugee && S.job !== 'prison' && !S.flags.hideCN && !AGE12 && !careNow(),
    build: () => { const c = C(), kr = c.id === 'KOR', svc = c.ppp >= 15000;
      return { title: "Đứa trẻ nhà bên", body: "Bạn thường nghe tiếng đứa trẻ nhà bên khóc lúc đêm khuya. Tối nay trời se lạnh, đứa trẻ đứng một mình ngoài cửa.",
        fact: kr ? "Năm 2024, Hàn Quốc xác nhận khoảng 24.000 vụ bạo hành trẻ em, và 84% người gây ra là cha mẹ. Chỉ cần nghi ngờ là đã có thể báo, và người báo được pháp luật bảo vệ (Bộ Y tế và Phúc lợi Hàn Quốc, Luật Xử lý tội phạm bạo hành trẻ em)"
          : "Phần lớn các vụ bạo hành trẻ em xảy ra trong nhà, do chính người lớn chăm sóc trẻ gây ra. Người lớn xung quanh nhận ra và lên tiếng là bước đầu tiên để bảo vệ trẻ (WHO)",
        choices: [{ k: 'report', label: kr ? "Báo cảnh sát (112) về việc bạo hành trẻ em" : svc ? "Báo cho cơ quan bảo vệ trẻ em" : "Cùng những người lớn tuổi trong làng đến nhà ấy", sub: '' },
          { k: 'talk', label: "Bắt chuyện với đứa trẻ và để mắt đến em", sub: '' }, { k: 'pass', label: "Chuyện nhà người ta, làm như không biết", sub: '' }] }; },
    apply: k => { const svc = C().ppp >= 15000;
      if (k === 'report') { if (chance(0.6)) { eff({ h: 3, so: 2 }); return { t: svc ? "Sau khi bạn báo, cơ quan bảo vệ trẻ em đã đến nhà ấy. Gia đình ấy tiếp tục được hỗ trợ, và tiếng khóc của đứa trẻ thưa dần." : "Những người lớn tuổi nói chuyện rất lâu với bố mẹ đứa trẻ. Từ đó, tiếng khóc của đứa trẻ thưa dần.", k: 'warm' }; }
        eff({ h: 1 }); return svc ? "Sau khi tìm hiểu, họ nói không có chuyện gì nghiêm trọng. Dù vậy, gia đình ấy vẫn tiếp tục được tư vấn." : "Bố mẹ đứa trẻ khó chịu, bảo bạn đừng xen vào chuyện nhà người khác. Dù vậy, bạn vẫn để mắt đến đứa trẻ ấy."; }
      if (k === 'talk') { eff({ so: 1, h: 1 }); return "Bạn đưa cho đứa trẻ chút đồ ăn vặt và bắt chuyện. Đứa trẻ chỉ gật đầu. Từ đó, bạn luôn để mắt đến nhà ấy."; }
      eff({ h: -3 }); return { t: "Mỗi lần đi ngang qua nhà ấy, lòng bạn lại nặng trĩu.", k: 'bad' }; } },
};
const parAway = () => (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !parHome() && !farFromNK() && !rohAway();
const parAbroad = () => parAway() && !!S.mig && !famCame() && S.cur !== S.born;
const homeTrip = () => med() * 0.12;
const smKid = () => kidAny(S.fam.kids.filter(k => k.alive && !k.away && !k.grown && S.age - k.bornAt >= 3 && S.age - k.bornAt <= 10));
const SMALL = {
  sm_after: { max: 2, gap: 3, ok: () => S.age >= 8 && S.age <= 14 && !!S.school,
    build: () => ({ title: "Sau giờ học", body: "Tan học rồi. Hôm nay bạn sẽ làm gì?",
      choices: [{ k: 'play', label: S.dis && S.dis.k === 'move' ? "Chơi cùng các bạn đến lúc mặt trời lặn" : "Chạy nhảy cùng các bạn đến lúc mặt trời lặn", sub: '' }, { k: 'read', label: "Ghé thư viện đọc sách", sub: '' }, { k: 'home', label: "Về nhà giúp việc nhà", sub: '' }] }),
    apply: k => { if (k === 'play') { eff({ so: 3, hl: 1, h: 2 }); return S.dis && S.dis.k === 'move' ? "Bạn chơi cùng các bạn đến lúc mặt trời lặn." : "Bạn chạy nhảy cùng các bạn đến lúc mặt trời lặn."; } if (k === 'read') { eff({ sm: 3, h: 1 }); return "Ngồi bên cửa sổ thư viện, bạn đọc hết trọn một cuốn sách."; } eff({ so: 2 }); return "Bạn về nhà gấp quần áo và giúp việc nhà. Bố mẹ cảm ơn bạn."; } },
  sm_wallet: { ok: () => S.age >= 7 && S.age <= 14,
    build: () => ({ title: "Chiếc ví nhặt được trên đường", body: "Bạn nhặt được một chiếc ví trên đường. Bên trong có khá nhiều tiền.",
      choices: [{ k: 'return', label: "Báo người lớn và tìm trả lại cho chủ", sub: '' }, { k: 'keep', label: "Lén giữ lấy", sub: '' }] }),
    apply: k => { if (k === 'return') { eff({ h: 3, so: 2 }); return pick(["Bà cụ chủ chiếc ví cảm ơn bạn hết lần này đến lần khác.", "Bạn mang nộp ở đồn công an. Vài ngày sau, bạn nghe tin người chủ đã đến nhận lại."]); }
      eff({ h: -3 }); return { t: "Bạn dùng số tiền đó mua quà vặt, nhưng suốt một thời gian lòng vẫn thấy không yên.", k: 'bad' }; } },
  sm_pocket: { ok: () => S.age >= 8 && S.age <= 15 && (S.q >= 2 || C().ppp > 8000),
    build: () => ({ title: "Khoản tiền tiêu vặt lớn đầu tiên", body: "Vào dịp lễ, bạn được người lớn cho khá nhiều tiền tiêu vặt.",
      choices: [{ k: 'save', label: "Bỏ vào heo đất", sub: '' }, { k: 'snack', label: "Rủ bạn bè đi ăn quà vặt", sub: '' }, { k: 'gift', label: carerW() === "bố mẹ" ? "Mua quà tặng bố mẹ" : L`${carerW()}께 드릴 선물을 산다`, sub: '' }] }),
    apply: k => { if (k === 'save') { eff({ sm: 1, h: 1 }); S.flags.saver = 1; return "Bạn thấy tự hào khi chú heo đất ngày càng nặng thêm."; } if (k === 'snack') { eff({ so: 3, h: 2 }); return "Bạn cùng bạn bè ăn quà vặt và cười mãi không thôi."; }
      eff({ so: 3, h: 2 }); return carerW() === "bố mẹ" ? "Bạn tặng bố mẹ một món quà nhỏ. Bữa cơm tối hôm ấy vui hơn hẳn mọi ngày." : L`${carerW()}께 작은 선물을 드렸습니다. 그날 저녁 식탁이 유난히 환했습니다.`; } },
  sm_weekend: { max: 2, gap: 8, ok: () => S.age >= 18 && S.age <= 75 && !S.refugee,
    build: () => { const fam = S.fam.married || S.fam.kids.some(k => k.alive && !k.away && !k.grown);
      return { title: "Cuối tuần hiếm hoi được nghỉ", body: "Một cuối tuần không còn việc gì tồn đọng. Bạn sẽ làm gì?",
        choices: [{ k: 'friends', label: "Gặp lại bạn bè lâu ngày", sub: '' }, { k: 'rest', label: "Nghỉ ngơi thỏa thích ở nhà", sub: '' }, fam ? { k: 'family', label: "Đi chơi cùng gia đình", sub: '' } : { k: 'alone', label: "Một mình đến nơi muốn đến từ lâu", sub: '' }] }; },
    apply: k => { const x = med() * 0.01;
      if (k === 'friends') { S.money -= x; eff({ so: 3, h: 2 }); return "Bạn trò chuyện với bạn bè đến khuya."; } if (k === 'rest') { eff({ hl: 2, h: 1 }); return "Bạn ngủ nướng và chẳng làm gì cả. Như vậy cũng thật dễ chịu."; }
      if (k === 'family') { S.money -= x; eff({ so: 3, h: 2 }); return "Bạn cùng gia đình mang cơm hộp ra công viên gần nhà chơi."; } S.money -= x; eff({ h: 3 }); return "Bạn một mình đi tàu đến nơi mình muốn ghé từ lâu và dạo bộ quanh đó."; } },
  sm_reunion: { ok: () => S.age >= 25 && S.age <= 75 && !S.mig && S.edu >= 1 && sawSchool(),
    build: () => ({ title: "Tin họp lớp", body: "Bạn nhận được tin lớp cũ tổ chức họp lớp sau một thời gian dài.", choices: [{ k: 'go', label: "Thử xem", sub: '' }, { k: 'skip', label: "Lần này không đi", sub: '' }] }),
    apply: k => { if (k === 'skip') return false; if (chance(0.7)) { eff({ so: 4, h: 3 }); return { t: "Bạn cùng bạn cũ thức trắng đêm kể chuyện thời đi học. Từ đó, mọi người lại giữ liên lạc với nhau.", k: 'warm' }; }
      eff({ h: -2 }); return "Ai cũng có vẻ sống tốt, bạn trở về với một nỗi chạnh lòng khó tả."; } },
  sm_holiday: { max: 2, gap: 10, ok: () => S.age >= 22 && S.age <= 72 && isWorking() && C().ppp >= 5000 && !S.refugee,
    build: () => { const c = C(), rich = c.ppp >= 20000 && S.money > med() * 0.3 && tripOutOK();
      return { title: "Đi nghỉ ở đâu đây?", body: "Bạn được nghỉ vài ngày.",
        choices: [parAway() ? (parAbroad() ? (S.flags.irreg != null ? null : { k: 'home', label: L`고향 ${B().ko}의 부모님 댁에 다녀온다`, sub: L`약 ${wonStr(homeTrip())}` }) : { k: 'home', label: "Về thăm bố mẹ", sub: '' }) : null, { k: 'trip', label: "Đi biển hoặc lên núi gần nhà", sub: L`약 ${wonStr(med() * 0.03)}` },
          rich ? { k: 'abroad', label: "Đi du lịch nước ngoài", sub: L`약 ${wonStr(med() * 0.12)}` } : null, { k: 'stay', label: "Ở nhà nghỉ ngơi", sub: '' }].filter(Boolean) }; },
    apply: k => { if (k === 'home' && parAbroad()) { S.money -= homeTrip(); eff({ so: 5, h: 4 }); S.yearMark = S.yearMark || 'trip'; tripTo(S.born); return L`비행기를 타고 ${B().ko}에 다녀왔습니다. ${wa(parentWord())} 고향 음식을 먹으며 몇 주를 보냈습니다. 어릴 적 방이 그대로였습니다.`; }
      if (k === 'home') { eff({ so: 4, h: 2 }); return "Bạn ở nhà bố mẹ vài ngày. Căn phòng thời thơ ấu vẫn y như xưa."; } if (k === 'trip') { S.money -= med() * 0.03; eff({ h: 4, hl: 1 }); return "Ngắm biển, lâu lắm rồi bạn mới được thở phào nhẹ nhõm."; }
      if (k === 'abroad') { S.money -= med() * 0.12; eff({ h: 6 }); return noWalk() ? "Bạn ngắm nhìn những con phố ở một đất nước lần đầu ghé thăm. Bạn cảm nhận rõ thế giới thật rộng lớn." : "Bạn đi bộ qua những con hẻm ở một đất nước lần đầu ghé thăm. Bạn cảm nhận rõ thế giới thật rộng lớn."; } eff({ hl: 2 }); return "Bạn ở nhà ngủ bù."; } },
  sm_phone: { ok: () => S.age >= 13 && S.age <= 60 && C().net >= 40 && calYr() >= 2012 && S.owns && S.owns.phone != null,
    build: () => ({ title: "Điện thoại trước giờ ngủ", body: "Nằm lướt điện thoại, chẳng mấy chốc đã gần sáng.", choices: [{ k: 'down', label: "Đặt điện thoại xuống trước khi ngủ", sub: '' }, { k: 'keep', label: "Cứ để vậy", sub: "Đây là lúc để thư giãn" }] }),
    apply: k => { if (k === 'down') { eff({ hl: 2, sm: 1 }); return "Bạn để điện thoại ngoài giường khi ngủ. Buổi sáng nhẹ nhõm hẳn."; } eff({ hl: -1, h: 1 }); return "Lại thêm “vài video nữa thôi”, và hôm nay bạn lại ngủ muộn."; } },
  sm_cook: { ok: () => S.age >= 20 && S.age <= 75 && !S.refugee && S.job !== 'cook' && !(S.exp && S.exp.cook && S.exp.cook[0] >= 2) && !S.hobbies.some(h => h.id === 'cooking'),
    build: () => ({ title: "Thử học nấu ăn?", body: "Nhiều hôm bạn chỉ ăn qua loa cho xong bữa.", choices: [{ k: 'learn', label: "Thử học nấu ăn", sub: '' }, { k: 'buy', label: "Mua đồ ăn sẵn tiện hơn", sub: '' }] }),
    apply: k => { if (k === 'learn') { eff({ hl: 2, so: 1, h: 1 }); return ['KOR', 'PRK'].includes(S.cur) ? "Nồi canh hầm jjigae đầu tiên bạn nấu bị mặn, nhưng vài tháng sau tay nghề đã khá đến mức có thể mời khách đến đãi." : "Món ăn đầu tiên bạn nấu mặn chát, nhưng vài tháng sau tay nghề đã khá đến mức có thể mời khách đến đãi."; } return false; } },
  sm_walk: { ok: () => S.age >= 40 && S.age <= 85 && !noWalk(),
    build: () => ({ title: "Hãy đi bộ một chút", body: "Khi khám sức khỏe, bác sĩ khuyên bạn mỗi ngày nên đi bộ, dù chỉ một chút.", fact: "Tổ chức Y tế Thế giới khuyến nghị người trưởng thành vận động ít nhất 150 phút mỗi tuần, ở mức khiến hơi thở hơi gấp một chút (WHO)",
      choices: [{ k: 'walk', label: "Bắt đầu đi bộ mỗi sáng", sub: '' }, { k: 'later', label: "Khi nào rảnh sẽ làm", sub: '' }] }),
    apply: k => { if (k === 'walk') { eff({ hl: 3, h: 1 }); return "Sáng nào bạn cũng đi bộ một vòng quanh khu phố. Chẳng biết từ lúc nào, đó đã thành khởi đầu của mỗi ngày."; } eff({ hl: -1 }); return false; } },
  sm_call: { max: 2, gap: 10, ok: () => S.age >= 25 && S.age <= 80 && parAway(),
    build: () => ({ title: L`${parentWord()}께 연락한 지 오래`, body: L`바쁘다는 핑계로 ${parentWord()}께 연락을 드린 지 한참 되었습니다.`,
      choices: [{ k: 'call', label: parAbroad() ? (calYr() >= 2010 && C().net >= 40 ? "Gọi video ngay tối nay" : "Gọi điện quốc tế ngay tối nay") : "Gọi điện ngay tối nay", sub: '' }, parAbroad() ? (S.flags.irreg != null ? null : { k: 'visit', label: L`휴가를 내어 ${B().ko}에 다녀온다`, sub: L`약 ${wonStr(homeTrip())}` }) : { k: 'visit', label: "Cuối tuần về thăm", sub: '' }, { k: 'later', label: "Để lần sau", sub: '' }].filter(Boolean) }),
    apply: k => { if (k === 'call') { eff({ so: 2, h: 1 }); return L`${parentWord()}의 목소리가 생각보다 반가워 보였습니다.`; }
      if (k === 'visit' && parAbroad()) { S.money -= homeTrip(); eff({ so: 5, h: 3 }); S.yearMark = S.yearMark || 'trip'; tripTo(S.born); return L`휴가를 내어 ${B().ko}에 다녀왔습니다. ${parentWord()}께서 공항까지 마중을 나와 계셨습니다.`; }
      if (k === 'visit') { S.money -= med() * 0.01; eff({ so: 4, h: 2 }); return L`${parentWord()}께서 좋아하시는 반찬을 잔뜩 싸 주셨습니다.`; }
      eff({ so: -1 }); return false; } },
  sm_kidplay: { max: 2, gap: 4, ok: () => S.age >= 22 && S.age <= 65 && isWorking() && !!smKid(),
    build: () => { const kd = smKid(), n = callName(kd.name);
      return { title: meSex() === 'F' ? "Mẹ ơi, chơi với con đi" : "Bố ơi, chơi với con đi", body: L`${iga(n)} 같이 놀자고 조릅니다. 오늘 끝내야 할 일이 아직 남았습니다.`, choices: [{ k: 'play', label: "Để việc mai làm, chơi với con", sub: '' }, { k: 'work', label: "Làm cho xong việc", sub: '' }] }; },
    apply: k => { const kd = smKid(); if (!kd) return false; const n = callName(kd.name);
      if (k === 'play') { kd.bd = (kd.bd || 0) + 2; eff({ so: 2, h: 3 }); return L`${wa(n)} 숨바꼭질을 했습니다. 일은 다음 날 아침에 끝냈습니다.`; }
      kd.bd = (kd.bd || 0) - 1; S.pct = clamp(S.pct + 0.003, 0, 0.99); return L`일을 끝내고 나오니 ${iga(n)} 소파에서 잠들어 있었습니다.`; } },
  sm_tidy: { ok: () => S.age >= 25 && S.age <= 85 && !S.refugee && S.job !== 'prison',
    build: () => ({ title: "Ngôi nhà đầy ắp đồ đạc", body: "Những món đồ giữ lại vì nghĩ có ngày sẽ dùng đến khiến nhà chật chội.", choices: [{ k: 'tidy', label: "Dọn những thứ không dùng và đem cho", sub: '' }, { k: 'keep', label: "Biết đâu có ngày sẽ cần", sub: '' }] }),
    apply: k => { if (k === 'tidy') { eff({ h: 2, so: 1 }); return "Bạn dọn dẹp suốt cuối tuần và đem những thứ còn dùng được cho hàng xóm. Ngôi nhà trông rộng hẳn ra."; } return false; } },
  sm_volunteer: { ok: () => S.age >= 20 && S.age <= 75 && !S.refugee && S.job !== 'prison',
    build: () => ({ title: "Nhóm tình nguyện trong khu phố", body: "Một tờ thông báo được dán lên: nhóm tình nguyện trong khu phố đang tìm người tham gia.", choices: [{ k: 'join', label: "Tham gia, dù chỉ mỗi tháng một lần", sub: '' }, { k: 'pass', label: "Bây giờ chưa có điều kiện", sub: '' }] }),
    apply: k => { if (k === 'join') { eff({ so: 3, h: 2 }); return "Nhờ nhóm tình nguyện, bạn quen thêm nhiều người trong khu phố."; } return false; } },
  sm_friend: { max: 2, gap: 10, ok: () => S.age >= 8 && S.age <= 85 && !S.refugee,
    build: () => { const a = S.age, taken = familyNames(); let nm = ''; for (let i = 0; i < 10 && (!nm || taken.has(nm)); i++) { const cl = clusterFor(C(), relPick(C())), sx = chance(0.5) ? 'M' : 'F'; nm = frKeep(callName(makeName(cl, sx, {})), sx); }
      S.flags.frNm = nm;
      const body = a < 18 ? (S.school ? L`전학 온 ${iga(nm)} 쉬는 시간마다 혼자 앉아 있습니다. 눈이 마주치자 어색하게 웃습니다.` : L`동네에 새로 이사 온 또래 ${iga(nm)} 일이 끝날 무렵이면 골목에서 혼자 서성입니다. 눈이 마주치자 어색하게 웃습니다.`) : a >= 65 ? L`공원 벤치에서 자주 마주치는 ${iga(nm)} 오늘은 먼저 말을 걸어 옵니다.`
        : isWorking() ? L`새로 온 동료 ${iga(nm)} 점심을 같이 먹자고 합니다. 이야기가 잘 통할 것 같기도 합니다.` : L`이웃에 이사 온 ${iga(nm)} 먼저 인사를 건네며 차 한잔하자고 합니다.`;
      return { title: "Kết bạn chứ?", body, choices: [{ k: 'close', label: "Chủ động làm quen, kết bạn", sub: '' }, { k: 'keep', label: "Chỉ chào hỏi, giữ khoảng cách", sub: '' }] }; },
    apply: k => { const nm = S.flags.frNm || ''; S.flags.frNm = null; if (k !== 'close' || !nm) return false;
      if (chance(0.25)) { eff({ so: 1 }); return L`${wa(nm)} 몇 번 어울렸지만, 생각만큼 가까워지지는 않았습니다.`; }
      S.flags.fN = Math.min(12, (S.flags.fN || ri(4, 8)) + 1); eff({ so: 4, h: 2 }); const fr = S.flags.frNames || (S.flags.frNames = []); if (!fr.includes(nm)) { fr.unshift(nm); fr.length = Math.min(fr.length, 5); }
      (S.flags.frAt || (S.flags.frAt = {}))[nm] = S.age;
      return { t: S.age < 18 ? (S.school ? L`${wa(nm)} 단짝이 되었습니다. 방과 후마다 붙어 다녔습니다.` : L`${wa(nm)} 단짝이 되었습니다. 일이 끝나면 늘 붙어 다녔습니다.`) : L`${wa(nm)} 친구가 되었습니다. 그 뒤로 힘든 일이 있을 때마다 서로 먼저 연락했습니다.`, k: 'warm' }; } },
  sm_gkmoney: { max: 2, gap: 6, ok: () => S.age >= 45 && (S.flags.grand || 0) > 0 && gkNear(0, 30) && !S.refugee && S.job !== 'prison' && !(S.flags.kmAuto && S.flags.kmW !== 'kids'),
    build: () => ({ title: "Cho cháu tiền tiêu vặt?", body: "Các cháu đến chơi. Lúc các cháu về, bạn sẽ dúi vào tay chúng thứ gì?",
      choices: [{ k: 'sneak', label: "Lén bố mẹ các cháu, dúi cho ít tiền", sub: L`약 ${wonStr(med() * 0.01)}` }, { k: 'bank', label: "Mở sổ tiết kiệm đứng tên cháu", sub: L`약 ${wonStr(med() * 0.05)}` }, { k: 'hug', label: "Ôm thật chặt, gửi gắm tấm lòng", sub: '' }] }),
    apply: k => { if (k === 'sneak') { S.money -= med() * 0.01; eff({ so: 3, h: 3 }); return { t: "Bạn lén bố mẹ cháu, nhét ít tiền vào túi cháu. Cháu nháy mắt với bạn.", k: 'warm' }; }
      if (k === 'bank') { S.money -= med() * 0.05; eff({ so: 2, h: 2 }); return "Bạn mở sổ tiết kiệm đứng tên cháu và gửi khoản tiền đầu tiên. Bạn dặn cháu lớn lên hãy dùng khi thật cần."; }
      eff({ so: 2, h: 1 }); return "Bạn ôm thật chặt từng đứa cháu."; } },
};
const SM_P = 0.09, SM_GAP = 5;
function smallPick() {
  if (S.isComp || S.age < 7 || S.age >= 65 || S.job === 'prison' || S.serveLeft > 0 || S.flags.hideCN) return null;
  if (S.flags.lastSm != null && S.age - S.flags.lastSm < SM_GAP) return null;
  if (!chance(SM_P)) return null;
  const ids = Object.keys(SMALL).filter(id => (S.done[id] || 0) < (SMALL[id].max || 1) && (S.flags['last_' + id] == null || S.age - S.flags['last_' + id] >= (SMALL[id].gap || 99)) && SMALL[id].ok());
  if (!ids.length) return null;
  let recent = []; try { recent = HOOK.humRecent() || []; } catch (e) { }
  const fresh = ids.filter(id => !recent.includes(id));
  S.flags.lastSm = S.age;
  return pick(fresh.length ? fresh : ids);
}
const HUM_MAX = 4, HUM_GAP = 6;
function humanPick() {
  if (S.isComp || S.age < 16) return null;
  if (S.flags.lastHum != null && S.age - S.flags.lastHum < HUM_GAP) return null;
  if (!chance(0.45)) return null;
  if (Object.keys(HUM).filter(id => S.done[id]).length >= HUM_MAX) return null;
  let ids = Object.keys(HUM).filter(id => !S.done[id] && HUM[id].ok());
  if (!ids.length) return null;
  let recent = []; try { recent = HOOK.humRecent() || []; } catch (e) { }
  const fresh = ids.filter(id => !recent.includes(id));
  if (fresh.length) ids = fresh; else if (!chance(0.25)) return null;
  S.flags.lastHum = S.age;
  const w = {}; for (const id of ids) w[id] = HUM_W[id] || 1;
  return wpick(w);
}
const HUM_W = { nbrkid: 0.3 };
const AUTO_W = {
  reflect: { skip: 1 },
  invest: { cash: 0.4, mix: 0.25, stock: 0.2, property: 0.15 },
  adsearch: { go: 0.45, later: 0.4, no: 0.15 }, reunite: { meet: 0.35, no: 0.65 }, cosign: { sign: 0.35, help: 0.35, no: 0.3 }, ptpost: { go: 0.45, alone: 0.25, no: 0.3 },
  parback: { meet: 0.5, money: 0.15, no: 0.35 }, gkhome: { home: 0.5, kin: 0.3, other: 0.2 },
  cowife: { accept: 0.8, apart: 0.12, leave: 0.08 },
  kinask: { give: 0.35, some: 0.45, no: 0.2 },
  sskids: { donor: 0.25, surro: 0.08, adopt: 0.15, no: 0.6 },
  bizop: { hire: 0.35, fam: 0.25, alone: 0.4, ad: 0.45, word: 0.55, pay: 0.5, move: 0.25, talk: 0.25, buy: 0.4, wait: 0.6, price: 0.35, shrink: 0.3, borrow: 0.25, close: 0.2 },
  dreamtry: { no: 1 },
  histrg: { join: 0.65, out: 0.28, help: 0.07 }, histdemo: { lead: 0.08, join: 0.42, study: 0.5, stay: 0.45 }, histjunta: { leave: 0.15, hide: 0.45, stay: 0.4 }, histkhm: { step: 0.3, hide: 0.7 },
  wife2: { yes: 0.5, no: 0.5 },
  hivtx: { art: 0.85, hide: 0.15 },
  illness: { hospital: 0.7, cheap: 0.3 },
  tbcare: { treat: 0.85, wait: 0.15 },
  smoke: { no: 0.65, yes: 0.35 },
  nbrkid: { report: 0.45, talk: 0.3, pass: 0.25 },
  quit: { try: 0.5, no: 0.5 },
  buy: { buy: 0.55, loan: 0.4, no: 0.35, never: 0.1 },
  kidsick: { hospital: 0.75, home: 0.25 },
  kiduni: { pay: 0.4, half: 0.35, self: 0.25 },
  kidwed: { help: 0.35, little: 0.45, none: 0.2 },
  kidout: { hug: 0.4, listen: 0.35, time: 0.25 },
  farmback: { go: 0.3, stay: 0.7 },
  homecoming: { go: 0.55, stay: 0.45 },
  defect: { go: 0.07, stay: 0.93 }, defroute: { go: 0.85, stay: 0.15 },
  prq: { go: 0.85, no: 0.15 }, natq: { go: 0.6, no: 0.4 }, wedtalk: { yes: 0.58, wait: 0.27, part: 0.15 }, adoptq: { go: 0.1, no: 0.9 }, adopt: { yes: 0.9, no: 0.1 },
  nomad: { go: 0.35, stay: 0.65 },
  erasmus: { go: 0.5, no: 0.5 }, party: { join: 0.6, no: 0.4 },
  runlocal: { run: 0.3, no: 0.7 },
  runnational: { run: 0.45, no: 0.55 },
  runleader: { run: 0.4, no: 0.6 },
  astro: { apply: 0.4, no: 0.6 },
  ordain: { go: 0.5, no: 0.5 },
  maternity: { keep: 0.7, quit: 0.3 },
  drink: { drink: 0.4, stop: 0.6 },
  alcquit: { help: 0.5, later: 0.5 },
  gamble: { try: 0.35, no: 0.65 },
  gambquit: { help: 0.55, later: 0.45 },
  crime: { refuse: 0.82, accept: 0.18 },
  duikey: { cab: 0.42, leave: 0.25, drive: 0.33 }, kinback: { hug: 0.75, time: 0.25 },
  atone: { family: 0.45, repay: 0.15, mentor: 0.1, quiet: 0.3 },
  service: { go: 0.8, delay: 0.2 },
  affair: { line: 0.55, go: 0.45 },
  faithwed: { conv: 0.6, keep: 0.4 },
  biz: { food: 0.13, shop: 0.13, service: 0.13, online: 0.13, workshop: 0.13, agri: 0.13, transport: 0.13, build: 0.13, law: 0.2, clinic: 0.2, soft: 0.13, acct: 0.2, arch: 0.15, studio: 0.15, academy: 0.15, go: 0.4, no: 0.6 },
  bizfund: { save: 0.45, fam: 0.4, loan: 0.3, partner: 0.2, no: 0.05 },
  loan: { family: 1, lender: 1, sellv: 0.6, sellh: 0.4, sell: 1, equity: 0.25 },
  youthtry: { try: 0.5, no: 0.5 },
  idolaud: { try: 0.14, no: 0.86 }, traineeq: { stay: 0.6, quit: 0.4 }, idolafter: { solo: 0.3, teach: 0.3, new: 0.4 },
  coachq: { job: 0.2, vol: 0.4, no: 0.4 },
  petq: { beg: 0.6, dog: 0.3, cat: 0.22, small: 0.08, no: 0.4 }, vocation: { go: 0.3, lay: 0.7 },
  petsick: { treat: 0.6, comfort: 0.4 },
  hmwork: { work: 0.5, wait: 0.5 },
  adultedu: { go: 0.25, no: 0.75 },
  city: { go: 0.5, stay: 0.5 },
  war: { flee: 0.7, stay: 0.3 },
  school2: { go: 0.88, work: 0.12, home: 0.6 },
  school3: { go: 0.62, voc: 0.25, work: 0.13 },
  college: { uni: 0.75, job: 0.25, abroad: 0.03, acad: 0.02, acadn: 0.005, acadf: 0.005 },
  afterUni: { job: 0.75, grad: 0.25, stayjob: 1, gradabroad: 0.06, third: 0.08 },
  gradAbroadEnd: { stay: 0.75, home: 0.25, third: 0.05 },
  partner: { yes: 0.6, date: 0.3, no: 0.1 },
  kids: { yes: 0.75, no: 0.25 },
  mcrisis: { talk: 0.5, counsel: 0.35, part: 0.15 },
  custody: {},
  stepkids: { slow: 0.45, together: 0.4, side: 0.15 },
  stepafter: { keep: 0.45, theirs: 0.4, part: 0.15 },
  lend: { lend: 0.45, gift: 0.3, no: 0.25 },
  rankup: { up: 0.85, no: 0.15 },
  growup: { up: 0.5, no: 0.5 },
  bizscale: { scale: 0.4, sell: 0.15, keep: 0.45 },
  applpar: { all: 0.25, half: 0.45, par: 0.3 },
  ownup: { own: 0.45, no: 0.55 },
  protry: { try: 0.6, no: 0.4 },
  mustry: { try: 0.55, no: 0.45 },
  boardtry: { try: 0.5, no: 0.5 }, gametry: { try: 0.5, no: 0.5 }, gameafter: { stream: 0.35, coach: 0.3, new: 0.35 },
  arttry: { try: 0.55, no: 0.45 },
  dnctry: { try: 0.55, no: 0.45 },
  pbiz: { go: 0.5, no: 0.5 }, pstock: { go: 0.35, no: 0.65 }, ipv: { help: 0.5, leave: 0.25, stay: 0.25 },
  kidq: { yes: 0.4, look: 0.25, real: 0.35, faith: 0.4, heart: 0.35, true: 0.25, people: 0.4, work: 0.35, unsure: 0.25, wide: 0.4, job: 0.45, free: 0.15 }, divtalk: { back: 1 },
  kidwant: { yes: 0.6, no: 0.4 }, kidteen: { talk: 0.65, strict: 0.35 }, kidcm: { school: 0.5, later: 0.5 },
  mind: { talk: 0.45, counsel: 0.3, alone: 0.25 },
  sm_after: { play: 0.5, read: 0.25, home: 0.25 }, sm_wallet: { return: 0.8, keep: 0.2 }, sm_pocket: { save: 0.35, snack: 0.4, gift: 0.25 }, sm_weekend: { friends: 0.35, rest: 0.35, family: 0.3, alone: 0.3 },
  lotto: { weekly: 0.25, once: 0.35, no: 0.4 }, ofpath: { mgr: 0.5, spec: 0.35, sales: 0.15 }, phd: { go: 0.4, no: 0.6 }, profapp: { apply: 0.85, no: 0.15 },
  sm_reunion: { go: 0.55, skip: 0.45 }, sm_holiday: { home: 0.3, trip: 0.35, abroad: 0.15, stay: 0.2 }, sm_phone: { down: 0.35, keep: 0.65 }, sm_cook: { learn: 0.45, buy: 0.55 }, sm_walk: { walk: 0.5, later: 0.5 },
  sm_call: { call: 0.5, visit: 0.3, later: 0.2 }, sm_kidplay: { play: 0.6, work: 0.4 }, sm_tidy: { tidy: 0.5, keep: 0.5 }, sm_volunteer: { join: 0.3, pass: 0.7 }, sm_friend: { close: 0.55, keep: 0.45 }, sm_gkmoney: { sneak: 0.5, bank: 0.2, hug: 0.3 }, kidhome: { home: 0.75, wait: 0.25 }, stepin: { friend: 0.45, together: 0.4, rules: 0.15 },
  disaid: { get: 0.7, no: 0.3 }, disadj: { back: 0.55, learn: 0.25, rest: 0.2 }, mindhelp: { counsel: 0.4, talk: 0.4, later: 0.2 }, kidabroad: { go: 0.65, stay: 0.35 },
  apprent: { mechanic: 1, electric: 1, hair: 1, cook: 1, artisan: 1, no: 1.6 },
  selfcode: { learn: 0.4, no: 0.6 },
  mandret: { retire: 0.3, rehire: 0.45, other: 0.25 },
};
const SS_ACC19 = { ARG: 76, AUS: 81, BRA: 67, BGR: 32, CAN: 85, CZE: 59, FRA: 86, DEU: 86, GRC: 48, HUN: 49, IND: 37, IDN: 9, ISR: 47, ITA: 75, JPN: 68, KEN: 14,
  LBN: 13, LTU: 28, MEX: 69, NLD: 92, NGA: 7, PHL: 73, POL: 47, RUS: 14, SVK: 44, ZAF: 54, KOR: 44, ESP: 89, SWE: 94, TUN: 9, TUR: 25, UKR: 14, GBR: 86, USA: 72 };
function autoChoice(pd) {
  const ch = pd.view.choices;
  if (pd.p && pd.p.prep && ch.some(c => c.k === 'run')) return chance(0.9) ? 'run' : 'no';
  if (pd.id === 'buy' && pd.p && pd.p.item === 'house' && ch.some(x => x.k === 'buy')) {
    if (rentLife()) { S.flags.skipN_house = 4; return 'no'; }
    const kids = S.fam.kids.some(k => k.alive && !k.away && S.age - k.bornAt < 18), m = S.fam.married;
    return chance(m && kids ? 0.92 : m ? 0.85 : S.age >= 35 ? 0.6 : 0.45) ? 'buy' : 'no';
  }
  if ((pd.id === 'school2' || pd.id === 'school3') && ch.some(x => x.k === 'go')) {
    const pr = eduProbs(B(), S.sex, S.q, S.urban, S.dis, 1), t = pd.id === 'school2' ? pr.t2 : pr.t3;
    if (ch.some(x => x.k === 'work') && chance(0.3 * (1 - t))) return 'work';
    return pd.id === 'school3' && ch.some(x => x.k === 'voc') && chance(0.28) ? 'voc' : 'go';
  }
  if (pd.id === 'faithq') { const has = k => ch.some(x => x.k === k);
    if (has('no')) return wpick({ join: has('join') ? 0.6 : 0, visit: 0.25, no: 0.15 });
    if (has('priv')) return wpick({ priv: 0.75, lapse: 0.15, keep: 0.1 });
    return wpick({ leave: has('other') ? 0.55 : 0.75, other: has('other') ? 0.2 : 0, lapse: 0.15, keep: 0.1 }); }
  if (pd.id === 'faithopen') return chance(0.4) ? 'open' : 'keep';
  if (pd.id === 'sswed') { const bi = !!S.flags.bi, M = S.sex === 'M', mom = S.fam.mom.alive;
    return chance(bi ? (mom ? 0.40 : 0.24) : M ? (mom ? 0.70 : 0.53) : (mom ? 0.67 : 0.45)) ? 'tell' : 'quiet'; }
  if (pd.id === 'service' && ch.some(c => ['n', 'f', 'p'].includes(c.k))) {
    const has = k => ch.some(c => c.k === k);
    if (has('delay') && chance(S.school === 'uni' ? 0.12 : 0.2)) return 'delay';
    const w = k => has(k) ? Math.min(0.3, (k === 'p' ? 0.06 : 0.08) / krBrP(k)) : 0, wn = w('n'), wf = w('f'), wp = w('p');
    return wpick({ go: Math.max(0.1, 1 - wn - wf - wp), n: wn, f: wf, p: wp });
  }
  if (pd.id === 'nco') return chance(0.15) ? 'apply' : 'out';
  if (pd.id === 'service' && S.school === 'uni' && ch.some(c => c.k === 'delay')) return chance(0.88) ? 'go' : 'delay';
  if (pd.id === 'studyto') return wpick(Object.fromEntries(ch.map(x => [x.k, x.k === 'd0' ? 0.85 : x.k === 'home' ? 0.06 : 0.045])));
  if ((pd.id === 'afterUni' && ch.some(x => x.k === 'stayjob')) || (pd.id === 'gradAbroadEnd' && ch.some(x => x.k === 'stay'))) {
    const d = CBY[S.flags.studyAbroad]; if (d && d.ppp < C().ppp * 1.3) return wpick(pd.id === 'afterUni' ? { stayjob: 0.15, job: 0.75, grad: 0.1 } : { stay: 0.15, home: 0.85 }); }
  if (pd.id === 'retire') return wpick({ retire: 0.5, work: ch.some(x => x.k === 'less') ? 0.4 : 0.5, less: ch.some(x => x.k === 'less') ? 0.1 : 0 });
  if (pd.id === 'diag') { const rich = C().ppp >= 25000; return wpick({ treat: rich ? 0.55 : 0.5, life: rich ? 0.25 : 0.15, ignore: rich ? 0.2 : 0.35 }); }
  if (pd.id === 'infert') { const has = k => ch.some(x => x.k === k); return wpick({ ivf: has('ivf') ? (C().p === 'hi' ? 0.5 : 0.3) : 0, adopt: has('adopt') ? 0.08 : 0, wait: 0.3, stop: 0.12 }); }
  if (pd.id === 'custody') { const c = C(), sh = ch.some(x => x.k === 'share') ? custShare(c) : 0, mom = S.sex === 'F' && !S.flags.exSs;
    const mk = (CUST_MOM[c.p] || 0.7) * (1 - sh), me = S.flags.exSs ? 0.5 : mom ? Math.min(0.95 - sh, mk / custGrant(c, true)) : Math.min(0.95 - sh, (1 - sh - mk) / custGrant(c, false));
    return wpick({ me, share: sh, them: Math.max(0.02, 1 - me - sh) }); }
  if (pd.id === 'histgo') { const g = typeof ERA_GO !== 'undefined' && pd.p ? ERA_GO.find(x => x.k === pd.p.k) : null; return chance(g ? g.auto : 0.3) ? 'go' : 'stay'; }
  if (pd.id === 'oldhome') { const c = C(), kid = OLD_KID_C[c.id] ?? OLD_KID[c.p] ?? 0.4, care = OLD_CARE[c.p] || 0.02, has = k => ch.some(x => x.k === k);
    const let_ = has('carelet') ? homeKeepP() : 0;
    return wpick({ kid: has('kid') ? kid : 0, care: has('care') ? care * (1 - let_) : 0, carelet: care * let_, own: Math.max(0.05, 1 - (has('kid') ? kid : 0) - (has('care') ? care : 0)) }); }
  if (pd.p && pd.p.talk && ch.some(c => c.k === 'yes')) return chance(0.85) ? 'yes' : 'no';
  if (pd.id === 'partner' && ch.length === 2 && ch[0].k === 'date') return chance(0.85) ? 'date' : 'no';
  if (pd.id === 'petq' && ch.some(c => c.k === 'dog')) { const y = 0.3 + 0.6 * petOwn(C()), sm = ch.some(c => /^pk_/.test(c.k)), pick = wpick({ dog: y * 0.55, cat: y * 0.37, small: sm || ch.some(c => c.k === 'small') ? y * 0.1 : 0, no: 1 - y });
    if (pick === 'small' && sm) { const k = 'pk_' + petSmall(); return ch.some(c => c.k === k) ? k : ch.find(c => /^pk_/.test(c.k)).k; }
    return pick; }
  if (pd.id === 'retake') { const y = (EXAM_C.has(C().id) ? 0.5 : 0.25) * (pd.p && pd.p.n ? (pd.p.n >= 2 ? 0.3 : 0.5) : 1) * (S.q >= 3 ? 1.2 : 0.7); return chance(y) ? 'retake' : 'work'; }
  if (pd.id === 'major' && ch.some(c => c.k === 'med') && chance(0.55)) return 'med';
  if (pd.id === 'major') { const au = ch.find(c => typeof AUD_MAJ !== 'undefined' && AUD_MAJ[c.k]); if (au && chance(au.k === 'mus' ? 0.45 : 0.2)) return au.k; }
  if (pd.id === 'kidcare') { const p = C().p, w = p === 'ssa' ? { hold: 0.5, kin: 0.42, care: 0.06, adopt: 0.02 } : ['sa', 'mena', 'eap'].includes(p) ? { hold: 0.65, kin: 0.28, care: 0.05, adopt: 0.02 } : { hold: 0.75, kin: 0.13, care: 0.1, adopt: 0.02 };
    const o = {}; for (const x of ch) if (w[x.k] != null) o[x.k] = w[x.k]; return wpick(o); }
  if (pd.id === 'will') { const c = C(), w = c.id === 'KOR' || c.id === 'JPN' ? { law: 0.85, fam: 0.06, step: 0.06, spouse: 0.05, home: 0.02, give: 0.02 } : c.p === 'hi' ? { law: 0.4, spouse: 0.25, fam: 0.2, step: 0.2, home: 0.05, give: 0.07, giveall: 0.03 } : { law: 0.75, fam: 0.1, step: 0.1, spouse: 0.08, home: 0.03, give: 0.03, giveall: 0.01 };
    const o = {}; for (const x of ch) { const kk = /^home\d+$/.test(x.k) ? (x.k === S.flags.willHome ? 'home' : null) : x.k; if (kk && w[kk] != null) o[x.k] = w[kk]; } return wpick(o); }
  if (pd.id === 'care') { const w = C().p === 'hi' ? { home: 0.2, pay: 0.35, sib: 0.15, near: 0.3 } : { home: 0.4, pay: 0.2, sib: 0.2, near: 0.2 };
    const o = {}; for (const x of ch) if (w[x.k] != null) o[x.k] = w[x.k]; return wpick(o); }
  if (pd.id === 'natq' && ch.some(c => c.k === 'goname')) return wpick({ go: 0.4, goname: 0.2, no: 0.4 });
  if (pd.id === 'kidschool') return chance(kidPrivP()) ? 'priv' : 'pub';
  if (pd.id === 'hsch') { const r = rnd(), f = S.cur !== S.born ? 0.4 : 0.28; return r < f ? 'fund' : r < f + 0.35 ? 'once' : 'no'; }
  if (pd.id === 'heir') { const P = S.fam[pd.p.k], better = isWorking() && S.pct > (S.fam.pPct || 0.4) + 0.1; return chance(!isWorking() || JOBS[S.job].s === 'agr' && JOBS[P.job].s === 'agr' ? 0.6 : better ? 0.15 : 0.35) ? 'take' : 'keep'; }
  if (ch.some(c => c.k === 'cohab') && chance(cohabAutoP(C()))) return 'cohab';
  if (pd.id === 'datepreg') { const nm = nonMarital(C()), o = { wed: 1 - nm * 0.7, apart: 0.15 }; if (ch.some(c => c.k === 'cohab')) o.cohab = nm * 0.8; return wpick(o); }
  if (pd.id === 'cohabwed') return chance(0.6) ? 'wed' : 'stay';
  if (pd.id === 'discipline') { const c = C(), was = !!S.flags.phit && (S.flags.hitN || 0) > 0;
    const hit = Math.min(0.6, ({ ssa: 0.4, sa: 0.35, mena: 0.35, eap: 0.22, lac: 0.25, eca: 0.12, hi: 0.06 }[c.p] ?? 0.2) * (was ? 1.5 : 1) * (cpBan(c) ? 0.5 : 1));
    return wpick({ talk: (1 - hit) * 0.6, calm: (1 - hit) * 0.4, hit }); }
  if (pd.id === 'babycare') { const c = C(), has = k => ch.some(x => x.k === k), w = {}; if (pd.p) pd.p.auto = 1; S.flags.bcareAuto = 1;
    if (has('me')) w.me = S.sex === 'F' ? momQuitP(c) : 0.02;
    if (has('partner')) w.partner = S.sex === 'M' && !S.fam.partner.ss ? wifeHomeP(c) : 0.03;
    const was = pd.p && pd.p.why && S.flags.way && S.flags.way.babycare;
    if (was && has(was) && was !== 'me' && was !== 'partner') { const q = (w.me || 0) + (w.partner || 0); return chance(q) ? wpick({ me: w.me || 0, partner: w.partner || 0 }) : was; }
    const rest = Math.max(0.05, 1 - (w.me || 0) - (w.partner || 0)), r = {};
    if (has('gp')) r.gp = CARE_GP[c.p] ?? 0.3;
    if (has('pt')) r.pt = S.sex === 'F' ? (CARE_PT[c.id] ?? (c.p === 'hi' ? 0.15 : 0.05)) : 0.03;
    if (has('carry')) r.carry = 0.6;
    if (has('pay')) r.pay = c.p === 'hi' ? 0.6 : 0.3;
    const sum = Object.values(r).reduce((x, y) => x + y, 0);
    for (const x in r) w[x] = rest * r[x] / sum;
    if (!Object.keys(w).length) return ch[0].k;
    return wpick(w); }
  if (pd.id === 'mind' && C().ppp < 8000 && !S.refugee && ch.some(c => c.k === 'counsel')) return wpick({ talk: 0.5, counsel: 0.1, alone: 0.4 });
  if (pd.id === 'abroad' && ch.some(c => c.k === 'gos' || c.k === 'gop')) { let k = pick(ch.filter(c => c.k !== 'gos' && c.k !== 'gop')).k;
    if (k === 'go' && ch.some(c => c.k === 'gos') && !chance(homeKeepP())) k = 'gos';
    if (k === 'go' && ch.some(c => c.k === 'gop') && chance(S.flags.mig && S.flags.mig.zone ? 0.08 : 0.2)) k = 'gop';
    return k; }
  if (pd.id === 'homecoming' && ch.some(c => c.k === 'gok')) { const k = wpick({ go: AUTO_W.homecoming.go, stay: AUTO_W.homecoming.stay }); return k === 'go' && chance(0.35) ? 'gok' : k; }
  if (pd.id === 'kidout' && ch.some(c => c.k === 'hard')) { const c = C(), l = ssLegal(c, calYr()), acc = SS_ACC19[c.id] != null ? SS_ACC19[c.id] : l === 'm' ? 75 : l === 'cp' ? 60 : 35;
    const h = clamp(0.15 + (60 - acc) * 0.003, 0.12, 0.3), W = AUTO_W.kidout;
    return wpick({ hug: W.hug * (1 - h), listen: W.listen * (1 - h), time: W.time * (1 - h), hard: h }); }
  const w = AUTO_W[pd.id];
  if (w) { const o = {}; for (const c of ch) if (w[c.k] != null) o[c.k] = w[c.k]; if (Object.keys(o).length) return wpick(o); }
  if (pd.id === 'job' || pd.id === 'jobchange') {
    const offers = S.flags.offers || [], ps = offers.map(x => x.pct), lo = Math.min(...ps), hi = Math.max(...ps), o = {};
    for (const c of ch) {
      if (c.k[0] === 'o' && offers[+c.k.slice(1)]) { const x = offers[+c.k.slice(1)].pct; o[c.k] = pd.id === 'job' ? 0.6 + 1.4 * (hi > lo ? (x - lo) / (hi - lo) : 1) : x > S.pct + 0.02 ? 1.2 + (x - S.pct) * 5 : 0.3; }
      else o[c.k] = c.k === 'wait' ? 0.25 : c.k === 'stay' ? 1 : 0.3;
    }
    return wpick(o);
  }
  return pick(ch).k;
}
const TD_SUP = /털어놓|도움을 청|상담을 받|곁을 지켜|곁에 있어|이야기를 들어|안부를 물|안부 전화|위로가 되|위로를 받|위로해|위로했|위로받|손을 잡아|함께 울/;
const TD_SCH = /학교에 가지 못|학교를 그만|학교에 다니지 못|학교를 더 다니지|진학하지 못|학교가 문을 닫|학교 밖|학비가 없|학업을 중단/;
const TD_NOK = new Set(['ledger', 'death', 'comp']);
const TD_SKIP = new Set(['drug', 'sv', 'suic', 'ad']);
const TD_SKIP_E = new Set(['ipv', 'discipline', 'nbrkid', 'kidhome', 'kidcare', 'affair', 'crime', 'gamble']);
const TD_SKIP_EV = new Set(['hithome', 'hitschool', 'envelope']);
const tdSkip = e => !!(e && e.d) && (TD_SKIP.has(e.d) || (TD_SKIP_E.has(e.d) && !(e.d === 'ipv' && S.td && TD_TH[S.td.k] && TD_TH[S.td.k].heavy)));
const TD_TH = {
  food: { re: /굶|끼니|배고프|배를 곯|하루 한 끼|기근|영양이 부족|영양실조|먹을 것이 (없|모자)|식량 (배급|지원)/, nm: () => L`끼니${LBL}`,
    met: () => "đã trải qua những năm lo từng bữa ăn.", far: () => "Cuộc đời này chưa từng có năm nào phải lo từng bữa ăn.",
    f: () => "Năm 2025, khoảng 645 triệu người, tức 7,8% dân số thế giới, phải chịu cảnh đói kéo dài (Báo cáo SOFI về tình trạng an ninh lương thực và dinh dưỡng thế giới, 2026)" },
  poverty: { re: /형편이 어려워|형편이 어려운 것을 안|집안 형편이 어려|가난한 집|빚을 (내|져|지)|빚이 생겨|끼니와 씀씀이|빈민가|판잣집|돈이 모자라|품을 팔/, no: /도박/, nm: () => L`가난${LBL}`,
    met: () => "đã có những năm sống dưới gánh nặng nghèo khó.", far: () => "Cuộc đời này không phải gánh nhiều sức nặng của nghèo khó.",
    f: () => "Năm 2024, 8,5% dân số thế giới, khoảng 700 triệu người, sống với dưới 2,15 đô la mỗi ngày (Ngân hàng Thế giới 2024)" },
  water: { re: /물을 길|우물|식수|수도가 없|깨끗한 물|물통|화장실이 없|공중화장실|변소/, ev: ['water', 'kid_water'], nm: () => L`깨끗한 물${LBL}`,
    met: () => "đã phải đi lấy nước xa hoặc thiếu nước sạch.", far: () => "Cuộc đời này chưa từng phải đi bộ xa để lấy nước.",
    f: () => "Năm 2024, 2,1 tỷ người không có nước uống an toàn tại nhà, và 106 triệu người uống thẳng nước sông, nước ao chưa qua xử lý (WHO·UNICEF JMP, 2025)" },
  school: { re: TD_SCH, no: /며칠/, nm: () => L`학교${LBL}`,
    met: () => "đã không được đi học lâu như mong muốn.", far: () => "Cuộc đời này được đi học mà không phải bỏ dở.",
    f: () => "Trên thế giới, khoảng 78 triệu trẻ em trong độ tuổi tiểu học đang không được đến trường (UNESCO 2023)" },
  girls: { re: new RegExp(TD_SCH.source + '|이른 결혼|결혼을 서두르|지참금|딸이 (학교|멀리)|딸은|딸이라|여자아이라'), no: /며칠/, sx: 'F', nm: () => L`소녀${LBL}`,
    met: () => "lớn lên là bé gái và gặp rào cản trước việc học hay tảo hôn.",
    far: () => S.sex === 'F' ? "Cuộc đời này lớn lên là một bé gái và được tự quyết chuyện học hành, hôn nhân." : "Cuộc đời này lớn lên là một bé trai. Các bé gái ở cùng đất nước đôi khi phải đi một con đường khác.",
    f: () => { const c = C(); return c.cm >= 5 ? L`${c.ko}에서는 여성의 약 ${c.cm}%가 18세가 되기 전에 결혼합니다. 학교에 계속 다니는 것이 이른 결혼을 막는 가장 큰 힘입니다 (UNICEF)` : "Mỗi năm có khoảng 12 triệu trẻ em gái kết hôn trước 18 tuổi, và 640 triệu phụ nữ và trẻ em gái đang sống hiện nay đã kết hôn khi còn nhỏ (UNICEF, 2023)"; } },
  childlab: { re: /일을 시작했|돈을 벌러|어린 나이부터 일|아동노동|학교를 그만두고 일|공장에서 일|일터에 나가/, ev: ['childwork'], kid: 15, nm: () => L`아이들의 일${LBL}`,
    met: () => "đã phải làm việc từ khi còn nhỏ.", far: () => "Cuộc đời này trải qua tuổi thơ không phải ở nơi làm việc.",
    f: () => "Năm 2024, có 138 triệu trẻ em phải lao động, trong đó 54 triệu em làm những công việc gây hại cho sức khỏe và sự an toàn (ILO·UNICEF, 2025)" },
  disaster: { re: /홍수|가뭄|지진|태풍|사이클론|허리케인|산사태|폭염|쓰나미|화산|산불|큰비|물에 잠겼/, nm: () => L`재해${LBL}`,
    met: () => "đã trải qua thiên tai như lũ lụt, hạn hán hay nắng nóng.", far: () => "Cuộc đời này trôi qua mà không gặp thiên tai lớn.",
    f: () => "Năm 2025, 358 thảm họa như động đất, lũ lụt và bão đã cướp đi 16.607 sinh mạng và ảnh hưởng đến 110 triệu người (CRED EM-DAT, 2026)" },
  refugee: { re: /난민|피난|피란|국경을 넘|집을 떠나야/, stc: () => !!S.refugee, nm: () => L`피난${LBL}`,
    met: () => "đã phải rời nhà đi lánh nạn.", far: () => "Cuộc đời này chưa từng phải bỏ nhà đi lánh nạn.",
    f: () => "Cuối năm 2025, có 117,8 triệu người buộc phải rời bỏ nhà cửa vì chiến tranh, bạo lực và đàn áp (UNHCR Global Trends 2025)" },
  migrant: { re: /이주했|이민|외국에서 일|해외로 (떠|나가)|송금/, stc: () => !!S.mig || (S.years || []).some(y => y.cur && y.cur !== S.born), nm: () => L`이주${LBL}`,
    met: () => "đã chuyển sang nước khác sống hoặc có người nhà làm việc ở nước ngoài.", far: () => "Cuộc đời này sống ở chính đất nước nơi mình sinh ra.",
    f: () => "Năm 2023, kiều hối gửi về các nước thu nhập thấp và trung bình đạt khoảng 656 tỷ đô la Mỹ, nhiều hơn cả đầu tư trực tiếp nước ngoài (Ngân hàng Thế giới)" },
  peace: { re: /전쟁|분쟁|공습|포격|총성|무력|징집|동원 통지|휴전/, nm: () => L`평화${LBL}`,
    met: () => "đã bị chiến tranh hay xung đột chạm đến cuộc đời.", far: () => "Chiến tranh không chạm đến thời đại và vùng đất của cuộc đời này.",
    f: () => "Năm 2025 có 65 cuộc xung đột vũ trang có sự tham gia của nhà nước, nhiều nhất kể từ năm 1946, và khoảng 244.600 người thiệt mạng vì bạo lực có tổ chức (Uppsala Conflict Data Program, 2026)" },
  read: { re: /글을 읽지 못|글을 모르|문맹|글을 배우지 못|학교에 가지 못|글을 늦게/, no: /며칠/, nm: () => L`글${LBL}`,
    met: () => "được học chữ muộn hoặc không có cơ hội.", far: () => "Cuộc đời này được học chữ từ nhỏ.",
    f: () => "Trên thế giới có khoảng 765 triệu người trưởng thành không biết đọc, biết viết, hai phần ba trong số đó là phụ nữ (UNESCO 2024)" },
  teacher: { re: /선생님|스승|담임|가르쳐 주/, stc: () => S.job === 'teacher', nm: () => L`선생님들${LBL}`,
    met: () => "đã gặp một người thầy đáng nhớ hoặc tự mình dạy người khác.", far: () => "Ghi chép của cuộc đời này không có câu chuyện nào về thầy cô.",
    f: () => "Để mọi trẻ em đều được học vào năm 2030, thế giới cần thêm 44 triệu giáo viên (UNESCO 2024)" },
  old: { re: /은퇴|정년|손주|연금|노년|요양/, stc: () => !!(S.deathAt && S.deathAt.age >= 65), at: null, nm: () => L`나이 듦${LBL}`,
    met: () => "đã sống qua tuổi 65, bước vào tuổi già.", far: () => "Cuộc đời này kết thúc trước khi đến tuổi già.",
    f: () => "Đến năm 2030, cứ 6 người trên thế giới thì có 1 người từ 60 tuổi trở lên (WHO 2024)" },
  disability: { re: /장애|휠체어|보청기|점자|수어|지팡이|보조기기/, nm: () => L`장애${LBL}`,
    met: () => "đã sống cùng khuyết tật, của chính mình hay của người nhà.", far: () => "Ghi chép của cuộc đời này không có khuyết tật.",
    f: () => "Trong số người khuyết tật ở độ tuổi lao động, 27% có việc làm, chỉ khoảng một nửa so với người không khuyết tật (56%) (UN DESA 2024)" },
  health: { re: /병원비|치료비|약값|의료비|진료비|보험이 없|돈이 없어 (병원|치료)/, nm: () => L`병원${LBL}`,
    met: () => "đã có những năm lo tiền viện phí hay tiền thuốc.", far: () => "Cuộc đời này không phải lo nhiều về viện phí.",
    f: () => { const c = C(); return c.oop != null ? L`${c.ko}의 의료비 중 본인 부담 비율 ${c.oop}% (WHO GHED)` : ''; } },
  malaria: { re: /말라리아/, nm: () => L`말라리아${LBL}`,
    met: () => "đã bị sốt rét chạm đến bản thân hoặc người nhà.", far: () => "Sốt rét không chạm đến cuộc đời này.",
    f: () => "Năm 2024, sốt rét gây ra khoảng 282 triệu ca bệnh và khoảng 610.000 ca tử vong, phần lớn ở châu Phi (Báo cáo Sốt rét Thế giới 2025 của WHO)" },
  tb: { re: /결핵/, nm: () => L`결핵${LBL}`,
    met: () => "đã bị bệnh lao chạm đến bản thân hoặc người nhà.", far: () => "Bệnh lao không chạm đến cuộc đời này.",
    f: () => "Phần lớn người mắc lao khỏi bệnh sau 6 tháng uống thuốc, và ở nhiều nước, điều trị lao tại cơ sở y tế công là miễn phí. Nếu không điều trị, gần một nửa số người bệnh tử vong (WHO, Báo cáo Lao toàn cầu)" },
  road: { re: /교통사고|차에 치|오토바이 사고|버스 사고/, nm: () => L`길 위의 안전${LBL}`,
    met: () => "đã gặp tai nạn giao thông, bản thân hoặc người nhà.", far: () => "Cuộc đời này trôi qua mà không gặp tai nạn giao thông.",
    f: () => { const c = C(); return c.road != null ? L`${c.ko}의 도로 교통사고 사망률: 인구 10만 명당 약 ${c.road}명 (WHO 추정)` : ''; } },
  kind: { re: /나눠 주|음식을 나눴|도와주|도왔|자원봉사|봉사|기부|손을 내밀|갚고 싶/, nm: () => L`나눔${LBL}`,
    met: () => "đã giúp đỡ ai đó hoặc được giúp đỡ.", far: () => "Ghi chép của cuộc đời này hiếm có khoảnh khắc sẻ chia.",
    f: () => "Hơn 1 trên 5 người trưởng thành trên thế giới cho biết đã làm tình nguyện trong tháng vừa qua (CAF World Giving Index)" },
  friend: { re: /친구|단짝/, no: /설렘/, nm: () => L`우정${LBL}`,
    met: () => "đã có bạn bè bên cạnh.", far: () => "Ghi chép của cuộc đời này hiếm có câu chuyện về bạn bè.",
    f: () => "Cứ 6 người trên thế giới thì có 1 người cô đơn (Ủy ban về Kết nối Xã hội của WHO 2025)" },
  family: { re: /가족|저녁상|식탁|부모님|아이들과/, no: /그 사람의 가족/, kinds: ['warm', 'big'], nm: () => L`가족${LBL}`,
    met: () => "đã có những khoảnh khắc ấm áp bên gia đình.", far: () => "Ghi chép của cuộc đời này hiếm có khoảnh khắc ấm áp bên gia đình.",
    f: () => "Ở các nước OECD, khoảng 40% trẻ em sinh ra có bố mẹ không kết hôn (Cơ sở dữ liệu Gia đình của OECD)" },
  discrim: { re: /차별(을|받|당|이)|따돌림|무시당|셋방을 구하지 못|외국인이라고|피부색 때문|카스트 때문|출신이라는 이유|불가촉|어디서 왔느냐/, ev: ['eth_disc', 'cst_disc', 'dis_tease', 'dis_hire'], nm: () => L`차별 없는 세상${LBL}`,
    met: () => "đã chịu phân biệt đối xử hoặc chứng kiến nó ngay bên cạnh.", far: () => "Ghi chép của cuộc đời này không có lần nào bị phân biệt đối xử.",
    f: () => "Khoảng 1 trong 6 người trên thế giới cho biết từng bị phân biệt đối xử (Báo cáo Mục tiêu Phát triển Bền vững của Liên Hợp Quốc 2023)" },
  women: { re: /남자 동료들?보다|남자들보다 받는 돈|경력 단절|여성이라는 이유|여자라는 이유/, ev: ['paygap'], sx: 'F', nm: () => L`일하는 여성${LBL}`,
    met: () => "đã gặp rào cản trong công việc và tiền lương vì là phụ nữ.",
    far: () => S.sex === 'F' ? "Cuộc đời này sống là phụ nữ mà không gặp nhiều rào cản trong công việc và tiền lương." : "Cuộc đời này sống là đàn ông. Phụ nữ ở cùng đất nước đôi khi gặp những rào cản khác nơi làm việc.",
    f: () => "Khoảng một nửa phụ nữ trên thế giới đang đi làm hoặc đang tìm việc. Mức chênh lệch giữa các nước rất lớn: ở Nam Á và Trung Đông, con số chỉ nhỉnh hơn 1 trên 4 người (ILO 2024)" },
  work: { re: /해고|일자리를 잃|구조조정|일하다 다쳤|산업재해|과로|야근|실업|일자리를 찾지 못|폐업/, nm: () => L`일${LBL}`,
    met: () => "đã mất việc, hoặc bị thương hay kiệt sức vì công việc.", far: () => "Cuộc đời này trôi qua mà không mất việc hay bị thương nơi làm việc.",
    f: () => "Mỗi năm khoảng 3 triệu người chết vì tai nạn và bệnh tật do công việc (ILO 2023)" },
  care: { re: /돌보|간병|요양|병간호|모시/, no: /가축/, nm: () => L`돌봄${LBL}`,
    met: () => "đã chăm sóc người nhà đau ốm hay con nhỏ.", far: () => "Ghi chép của cuộc đời này hiếm khi có lúc chăm sóc ai đó.",
    f: () => "Ở các nước thu nhập thấp và trung bình, phần lớn việc chăm sóc người cao tuổi do gia đình đảm nhận, nhất là phụ nữ (WHO)" },
  home: { re: /빈민가|집 없이|쫓겨|판잣집|셋방|집을 잃|노숙|집세|월세를 내지/, no: /큰 부담은 아니/, nm: () => L`살 곳${LBL}`,
    met: () => "đã vất vả vì chỗ ở.", far: () => "Cuộc đời này không phải lo nhiều về chỗ ở.",
    f: () => "Khoảng 1 trên 4 người sống ở đô thị sống trong khu ổ chuột hoặc khu định cư tự phát (UN-Habitat)" },
  play: { re: /놀|공을 차|술래|장난감|그림을 그리|연을|자전거/, kid: 13, kinds: ['warm', 'ev', 'big'], nm: () => L`놀이${LBL}`,
    met: () => "còn nhớ những ngày thơ ấu được vui chơi thỏa thích.", far: () => "Ghi chép tuổi thơ của cuộc đời này hiếm có lúc vui chơi.", at: 13, f: () => '' },
  city: { re: /도시로|상경|도시에서 일/, stc: () => !!S.urban, nm: () => L`도시${LBL}`,
    met: () => "đã sống ở thành phố.", far: () => "Cuộc đời này sống ở nơi không phải thành phố.",
    f: () => { const c = C(); return c.urb != null ? L`${c.ko} 도시 인구 비율 ${c.urb}% (UN-Habitat 2023)` : ''; } },
  net: { re: /인터넷|휴대폰|스마트폰|컴퓨터|영상통화|온라인/, ev: ['net', 'phone', 'web', 'iphone', 'chatai'], stc: () => !!S.flags.net, nm: () => L`인터넷${LBL}`,
    met: () => "đã có internet và điện thoại bước vào cuộc sống.", far: () => "Internet không chạm đến cuộc đời này.",
    f: () => { const c = C(); return c.net != null ? L`${c.ko}의 인터넷 이용률 ${c.net}% (ITU, 세계은행)` : ''; } },
  lang: { re: /말을 배우|말이 서툴|언어|사투리|모국어|통역|말이 통하지/, nm: () => L`모어${LBL}`,
    met: () => "đã học một ngôn ngữ khác hoặc sống ở nơi không nói tiếng của mình.", far: () => "Cuộc đời này sống trọn bằng tiếng nói của chính mình.",
    f: () => "40% người dân thế giới không được học bằng ngôn ngữ mình nói hoặc hiểu (UNESCO)" },
  birth: { act: ['baby'], stc: () => !!(S.fam && S.fam.kids && S.fam.kids.length), nm: () => L`새 생명${LBL}`,
    met: () => "đã sinh hoặc đón nhận một đứa con.", far: () => "Cuộc đời này không có con.", at: null,
    f: () => { const c = C(); return c.tfr != null ? L`${c.ko} 합계출산율 ${c.tfr}명 (UN WPP 2024)` : ''; } },
  epidemic: { re: /코로나|감염병|전염병|역병|천연두|사스|에볼라|봉쇄|독감이 크게 유행/, nm: () => L`감염병${LBL}`,
    met: () => "đã sống qua một thời dịch bệnh.", far: () => "Cuộc đời này trôi qua mà không gặp đại dịch lớn.",
    f: () => "COVID-19 khiến khoảng 14,9 triệu người trên thế giới tử vong thêm trong giai đoạn 2020–2021 (WHO 2022)" },
  happy: { happy: 1, nm: () => L`행복${LBL}` },
  mind: { heavy: 1, re: TD_SUP, nm: () => L`마음 건강${LBL}`, say: () => "Khi khó khăn, có nơi để tâm sự là một sức mạnh lớn.",
    f: () => "Cứ 8 người trên thế giới thì có 1 người sống với khó khăn về sức khỏe tinh thần. Khi được giúp đỡ, mọi thứ có thể tốt hơn (WHO 2022)", help: () => MIND_HELP() },
  suic: { heavy: 1, re: TD_SUP, nm: () => L`곁에 있어 주는 일${LBL}`, say: () => "Nỗi lòng nặng nề có thể nhẹ đi khi được sẻ chia. Hỏi han những người bên cạnh cũng là một cách giúp đỡ.",
    f: () => '', help: () => SUIC_HELP() },
  vaw: { heavy: 1, re: TD_SUP, nm: () => L`폭력 없는 삶${LBL}`, say: () => "Bạo lực không bao giờ là lỗi của người phải chịu, và luôn có nơi để tìm sự giúp đỡ.",
    f: () => "Khoảng 1 trong 3 phụ nữ trên thế giới từng chịu bạo lực thể xác hoặc tình dục trong đời (WHO 2021)", help: () => L`도움: 여성긴급전화 1366 (한국, 24시간) · 다른 나라는 findahelpline.com` },
  aids: { heavy: 1, re: TD_SUP, nm: () => L`HIV와 함께 사는 삶${LBL}`, say: () => "Người có HIV nếu điều trị đều đặn và kiểm soát được virus thì không lây cho người khác (WHO · U=U)",
    f: () => "Năm 2025, 41 triệu người sống chung với HIV, 1,2 triệu người mới nhiễm và 570.000 người qua đời vì các bệnh liên quan đến AIDS (UNAIDS, 2026)", help: () => '' },
};
const TD_DAYS = {
  '01-04': ['disability', () => "Ngày Chữ nổi Braille Thế giới"], '01-24': ['school', () => "Ngày Quốc tế Giáo dục"], '02-20': ['work', () => "Ngày Thế giới vì Công bằng Xã hội"],
  '02-21': ['lang', () => "Ngày Quốc tế Tiếng mẹ đẻ"], '03-01': ['discrim', () => "Ngày Không phân biệt đối xử"], '03-08': ['women', () => "Ngày Quốc tế Phụ nữ"],
  '03-20': ['happy', () => "Ngày Quốc tế Hạnh phúc"], '03-21': ['discrim', () => "Ngày Quốc tế Xóa bỏ Phân biệt Chủng tộc"], '03-22': ['water', () => "Ngày Nước Thế giới"],
  '03-24': ['tb', () => "Ngày Thế giới phòng chống Lao"], '04-07': ['health', () => "Ngày Sức khỏe Thế giới"], '04-22': ['disaster', () => "Ngày Quốc tế Mẹ Trái Đất"],
  '04-23': ['read', () => "Ngày Sách và Bản quyền Thế giới"], '04-25': ['malaria', () => "Ngày Thế giới phòng chống Sốt rét"], '04-28': ['work', () => "Ngày Thế giới về An toàn và Sức khỏe tại Nơi làm việc"],
  '05-15': ['family', () => "Ngày Quốc tế Gia đình"], '05-17': ['net', () => "Ngày Viễn thông và Xã hội Thông tin Thế giới"], '06-01': ['family', () => "Ngày Cha mẹ Toàn cầu"],
  '06-05': ['disaster', () => "Ngày Môi trường Thế giới"], '06-07': ['food', () => "Ngày An toàn Thực phẩm Thế giới"], '06-11': ['play', () => "Ngày Quốc tế Vui chơi"],
  '06-12': ['childlab', () => "Ngày Thế giới phòng chống Lao động trẻ em"], '06-16': ['migrant', () => "Ngày Quốc tế Kiều hối Gia đình"], '06-17': ['disaster', () => "Ngày Thế giới chống Sa mạc hóa và Hạn hán"],
  '06-20': ['refugee', () => "Ngày Người tị nạn Thế giới"], '07-11': ['birth', () => "Ngày Dân số Thế giới"], '07-30': ['friend', () => "Ngày Quốc tế Tình bạn"],
  '08-09': ['discrim', () => "Ngày Quốc tế các Dân tộc Bản địa Thế giới"], '08-19': ['kind', () => "Ngày Nhân đạo Thế giới"], '09-05': ['kind', () => "Ngày Quốc tế Từ thiện"],
  '09-08': ['read', () => "Ngày Quốc tế Xóa mù chữ"], '09-10': ['suic', () => "Ngày Thế giới Phòng chống Tự tử"], '09-18': ['women', () => "Ngày Quốc tế Trả lương Bình đẳng"],
  '09-21': ['peace', () => "Ngày Quốc tế Hòa bình"], '09-23': ['disability', () => "Ngày Quốc tế Ngôn ngữ Ký hiệu"], '10-01': ['old', () => "Ngày Quốc tế Người cao tuổi"],
  '10-05': ['teacher', () => "Ngày Nhà giáo Thế giới"], '10-06': ['home', () => "Ngày Nhà ở Thế giới"], '10-10': ['mind', () => "Ngày Sức khỏe Tâm thần Thế giới"],
  '10-11': ['girls', () => "Ngày Quốc tế Trẻ em gái"], '10-13': ['disaster', () => "Ngày Quốc tế Giảm nhẹ Rủi ro Thiên tai"], '10-16': ['food', () => "Ngày Lương thực Thế giới"],
  '10-17': ['poverty', () => "Ngày Quốc tế Xóa nghèo"], '10-24': ['peace', () => "Ngày Liên Hợp Quốc"], '10-29': ['care', () => "Ngày Quốc tế Chăm sóc và Hỗ trợ"],
  '10-31': ['city', () => "Ngày Đô thị Thế giới"], '11-16': ['discrim', () => "Ngày Quốc tế Khoan dung"], '11-19': ['water', () => "Ngày Nhà vệ sinh Thế giới"],
  '11-20': ['play', () => "Ngày Thiếu nhi Thế giới"], '11-25': ['vaw', () => "Ngày Quốc tế Xóa bỏ Bạo lực đối với Phụ nữ"], '11-27': ['girls', () => "Ngày Quốc tế Xóa bỏ Tảo hôn và Hôn nhân Cưỡng ép"],
  '12-01': ['aids', () => "Ngày Thế giới phòng chống AIDS"], '12-03': ['disability', () => "Ngày Quốc tế Người khuyết tật"], '12-05': ['kind', () => "Ngày Quốc tế Tình nguyện viên"],
  '12-10': ['discrim', () => "Ngày Nhân quyền"], '12-12': ['health', () => "Ngày Quốc tế Bao phủ Y tế Toàn dân"], '12-18': ['migrant', () => "Ngày Quốc tế Người di cư"],
  '12-20': ['kind', () => "Ngày Quốc tế Đoàn kết Nhân loại"], '12-27': ['epidemic', () => "Ngày Quốc tế Sẵn sàng Ứng phó Dịch bệnh"],
};
const TD_ROAD = ['road', () => "Ngày Thế giới Tưởng niệm Nạn nhân Tai nạn Giao thông"];
const TD_ROT = ['food', 'water', 'school', 'poverty', 'disaster', 'refugee', 'health', 'old', 'disability', 'read', 'work', 'women', 'kind', 'friend',
  'family', 'home', 'road', 'girls', 'childlab', 'peace', 'care', 'migrant', 'play', 'city', 'net', 'lang', 'teacher', 'discrim', 'birth', 'malaria'];
const tdCalm = () => (typeof AGE12 !== 'undefined' && AGE12) || (typeof EDU_ON !== 'undefined' && EDU_ON) || (typeof HOOK !== 'undefined' && !!HOOK.calm && !!HOOK.calm());
function tdPick(dt) {
  const m = dt.getMonth() + 1, d = dt.getDate(), md = (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
  const road = m === 11 && dt.getDay() === 0 && d >= 15 && d <= 21, day = road ? TD_ROAD : TD_DAYS[md];
  let k = day ? day[0] : null, dn = day ? (road ? 'rd' : md) : '';
  if (k && TD_TH[k].heavy && tdCalm()) { k = null; dn = ''; }
  if (!k) k = TD_ROT[Math.floor(Date.UTC(dt.getFullYear(), m - 1, d) / 864e5) % TD_ROT.length];
  return { k, md, y: String(dt.getFullYear()).slice(2), dn };
}
function tdTitle(td) {
  const T = td && TD_TH[td.k]; if (!T) return '';
  const day = td.dn === 'rd' ? TD_ROAD : td.dn ? TD_DAYS[td.dn] : null;
  return day && day[0] === td.k ? day[1]() : T.nm();
}
function tdStart(dt) { if (S && !S.isComp) S.td = tdPick(dt || new Date()); }
function tdKo(t) {
  if (typeof L_RT === 'undefined') return '';
  t = String(t); const out = [];
  for (let j = 7; j >= 0; j--) {
    const i = (L_RI - 1 - j) & 7, r = L_RT[i];
    if (r && r.length >= 4 && (t.includes(r) || (j < 2 && t.slice(1).startsWith(r.slice(1))))) out.push(L_RS[i].join(' '));
  }
  return out.join(' ');
}
let TD_QUIET = false;
function tdLine(e, text) {
  const td = S.td, T = td && TD_TH[td.k];
  if (!T || T.happy || TD_QUIET || TD_NOK.has(e.kind) || (T.kid != null && e.a >= T.kid) || (T.sx && S.sex !== T.sx) || (T.kinds && !T.kinds.includes(e.kind))) return;
  if (typeof ACT_EV !== 'undefined' && ACT_EV && TD_SKIP_EV.has(ACT_EV)) return;
  const ko = T.re || T.no ? tdKo(text) : '';
  if (T.no && T.no.test(ko)) return;
  if (!((T.ev && typeof ACT_EV !== 'undefined' && ACT_EV && T.ev.includes(ACT_EV)) || (T.act && e.act && T.act.includes(String(e.act).split(':')[0])) || (T.re && T.re.test(ko)))) return;
  if (tdHits().length < 3) e.td = 1;
}
const tdHits = () => ((S && S.log) || []).filter(e => e.td === 1 && !tdSkip(e));
function tdMet() { const T = S && S.td && TD_TH[S.td.k]; return !!T && (tdHits().length > 0 || !!(T.stc && T.stc())); }
function tdYear(a) {
  const td = S.td, T = td && TD_TH[td.k];
  if (!T || td.said || S.isComp || S.phase !== 'life' || T.heavy || T.happy || T.at === null || a !== (T.at || 30) || tdMet()) return;
  td.said = 1;
  const f = T.f ? T.f() : '';
  TD_QUIET = true; try { log(T.far(), 'note', f || undefined); } finally { TD_QUIET = false; }
  const e = S.log[S.log.length - 1]; e.d = 'today'; e.td = 2;
}
function tdEnd() {
  const td = S && S.td, T = td && TD_TH[td.k]; if (!T || !S.deathAt) return null;
  const x = { title: tdTitle(td), heavy: !!T.heavy, happy: !!T.happy };
  if (T.happy) {
    const Y = (S.years || []).filter(y => y.h != null); if (!Y.length) return null;
    const best = Y.reduce((p, y) => y.h > p.h ? y : p, Y[0]);
    x.best = best.a; x.hits = S.log.filter(e => Math.floor(e.a) === best.a && e.kind === 'warm' && !tdSkip(e)).slice(0, 2);
    return x;
  }
  x.hits = tdHits().filter((e, i, A) => A.findIndex(y => y.text === e.text) === i).slice(0, 3); x.met = tdMet(); x.f = T.f ? T.f() : '';
  if (T.heavy) { x.say = T.say(); x.help = T.help ? T.help() : ''; }
  else { x.metS = T.met(); x.far = T.far(); }
  return x;
}
function tdWire() {
  const td = S && S.td, T = td && TD_TH[td.k];
  if (!T || T.heavy || T.happy || !S.deathAt || S.replay || !/^\d\d$/.test(td.y) || !/^\d\d-\d\d$/.test(td.md)) return null;
  return td.y + td.md.replace('-', '') + '.' + td.k + '.' + (tdMet() ? 'm' : 'f');
}
const CARD = { W: 1080, H: 1350, paper: '#EBF0ED', card: '#F7FAF8', ink: '#13212A', ink2: '#4A5A61', ink3: '#7A898D', rule: '#C7D2CE', rule2: '#DCE4E1', accent: '#8C1D3C', stamp: '#0F6E68', lo: '#DCE4E1', hi: '#0F6E68', loss: '#2C2F3A' };
const CF = { d: "Hahmlet, 'Noto Serif', Georgia, serif", b: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Helvetica Neue', Arial, sans-serif", m: "'IBM Plex Mono', ui-monospace, Menlo, monospace" };
const cardCache = {};
async function loadCardFonts(text) {
  if (!document.fonts || !document.fonts.load) return;
  const t = (text || "Aă") + '0123456789%·–';
  try {
    await Promise.race([
      Promise.all([`700 60px Hahmlet`, `400 30px 'IBM Plex Sans KR'`, `600 30px 'IBM Plex Sans KR'`, `400 26px 'IBM Plex Mono'`, `600 26px 'IBM Plex Mono'`].map(f => document.fonts.load(f, t))),
      new Promise(r => setTimeout(r, 3000)),
    ]);
  } catch (e) { }
}
function cfont(ctx, w, size, fam) { ctx.font = `${w} ${size}px ${fam}`; }
function fitText(ctx, text, w, fam, size, maxW, min) { let s = size; for (; s > min; s -= 2) { cfont(ctx, w, s, fam); if (ctx.measureText(text).width <= maxW) break; } cfont(ctx, w, s, fam); return s; }
const WRAP_NO_START = /^[。、，．,.！？!?）」』】〕〉》”’：；:;…‥ー々ゝゞぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ・]/, WRAP_NO_END = /[（「『【〔〈《“‘]$/;
const TH_MARK = /[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/;
function wrapLines(ctx, text, maxW) {
  const out = []; let line = '';
  for (const word of String(text).split(' ')) {
    
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width <= maxW) { line = test; continue; }
    if (line) out.push(line);
    if (ctx.measureText(word).width > maxW) {
      let part = [];
      for (const ch of word) {
        if (part.length && ctx.measureText(part.join('') + ch).width > maxW) {
          let k = part.length;
          if (WRAP_NO_START.test(ch) && k > 1) { k--; while (k > 1 && WRAP_NO_START.test(part[k])) k--; }
          while (k > 1 && WRAP_NO_END.test(part[k - 1])) k--;
          out.push(part.slice(0, k).join('')); part = part.slice(k);
        }
        part.push(ch);
      }
      line = part.join('');
    }
    else line = word;
  }
  if (line) out.push(line);
  return out;
}
function drawWrapped(ctx, text, x, y, maxW, lh, maxLines) {
  text = capS(text);
  let lines = wrapLines(ctx, text, maxW);
  if (maxLines && lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/.$/, '…'); }
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
  return y + lines.length * lh;
}
function cardBase(ctx, title, no) {
  const { W, H } = CARD;
  ctx.fillStyle = CARD.paper; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.09; ctx.strokeStyle = CARD.stamp; ctx.lineWidth = 1.3;
  for (let i = 0; i < 16; i++) {
    ctx.beginPath(); const ph = i * 0.45, amp = H * (0.11 + 0.01 * i), lam = W / (1.6 + i * 0.06);
    for (let x = 0; x <= W; x += 6) { const y = H * 0.56 + amp * Math.sin(2 * Math.PI * x / lam + ph) * Math.cos(Math.PI * x / W * 1.3 + i * 0.2); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  }
  ctx.restore();
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.fillStyle = CARD.accent; ctx.fillRect(0, 0, W, 112);
  ctx.fillStyle = '#FFFFFF'; cfont(ctx, 700, 46, CF.d); ctx.fillText("Vô Hạn Trùng Sinh", 64, 72);
  cfont(ctx, 400, 24, CF.m); ctx.textAlign = 'right'; ctx.fillText(no, W - 64, 68); ctx.textAlign = 'left';
  ctx.fillStyle = CARD.stamp; cfont(ctx, 600, 26, CF.b); ctx.fillText(title, 64, 168);
  ctx.strokeStyle = CARD.rule; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(64, H - 128); ctx.lineTo(W - 64, H - 128); ctx.stroke();
  ctx.fillStyle = CARD.ink; cfont(ctx, 600, 34, CF.b); ctx.fillText("Giữa 8 tỷ người, bạn sẽ chào đời là ai?", 64, H - 64);
  const dom = "#VoHanTrungSinh";
  ctx.fillStyle = CARD.accent; cfont(ctx, 600, 32, CF.m); ctx.textAlign = 'right'; ctx.fillText(dom, W - 64, H - 64); ctx.textAlign = 'left';
}
function pxBitmap(r, k) {
  const c = document.createElement('canvas'); c.width = r.w * k; c.height = r.h * k;
  const small = document.createElement('canvas'); small.width = r.w; small.height = r.h;
  const sx = small.getContext('2d'), img = sx.createImageData(r.w, r.h);
  for (let i = 0; i < r.d.length; i++) { const v = r.d[i]; if (!v) continue; img.data[i * 4] = v[0]; img.data[i * 4 + 1] = v[1]; img.data[i * 4 + 2] = v[2]; img.data[i * 4 + 3] = 255; }
  sx.putImageData(img, 0, 0);
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(small, 0, 0, c.width, c.height); return c;
}
function pxOutlined(s, ol) {
  const o = new PxR(s.w + 2, s.h + 2); o.blit(s, 1, 1, null);
  for (let y = 0; y < o.h; y++) for (let x = 0; x < o.w; x++) if (!o.get(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const c = o.get(x + dx, y + dy); return c && c !== ol; })) o.px(x, y, ol);
  return o;
}
function cardSceneModel(age) {
  const F = S.endD && S.endD.frames ? S.endD.frames.filter(f => f && f.m) : [];
  let m = null;
  if (age > 0 && F.length) m = F.reduce((b, f) => Math.abs(f.a - age) < Math.abs(b.a - age) ? f : b).m;
  else if (typeof sceneModel === 'function') try { m = sceneModel(); } catch (e) { m = null; }
  return m ? Object.assign({}, m, { people: [], pet: '', act: '' }) : null;
}
function cardPortraitPx(ctx, x, y, w, h, age) {
  const m = cardSceneModel(age); if (!m) return false;
  const P = pxPalette('light'), bg = pxBitmap(pxScene(m, P), 1), k = h / PX.H, cw = w / k;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(bg, Math.max(0, Math.min(PX.W - cw, 108 - cw / 2)), 0, cw, PX.H, x, y, w, h);
  const shown = Math.min(age, 80), who = { role: 'me', sex: typeof meSex === 'function' ? meSex(shown) : S.sex, age: shown, sk: typeof skinMe === 'function' ? skinMe() : null };
  const fig = pxOutlined(shown < 1 ? pxNewborn(who, P) : pxPerson(who, P), P.ol), k2 = shown < 1 ? 11 : shown < 3 ? 14 : 10;
  const fc = pxBitmap(fig, k2), gy = y + PX.G * k + 8;
  ctx.drawImage(fc, x + (w - fc.width) / 2, Math.min(y + h - fc.height + 6, gy - fc.height + k2));
  ctx.restore();
  return true;
}
function cardPortrait(ctx, x, y, w, h, age) {
  ctx.fillStyle = CARD.card; ctx.fillRect(x, y, w, h);
  let drawn = false; try { drawn = cardPortraitPx(ctx, x, y, w, h, age); } catch (e) { drawn = false; }
  ctx.strokeStyle = CARD.rule; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
  if (drawn) return;
  const s = age < 3 ? 0.55 : age < 12 ? 0.72 : age < 18 ? 0.88 : 1;
  const cx = x + w / 2, base = y + h;
  const hr = w * 0.2 * (age < 3 ? 1.15 : 1) * Math.max(0.8, s);
  const hy = base - h * 0.52 * s - hr * 0.6;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = CARD.ink3; ctx.globalAlpha = age > 70 ? 0.55 : 0.8;
  ctx.beginPath(); ctx.arc(cx, hy, hr, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 0.6; ctx.beginPath();
  const sw = w * 0.42 * s; ctx.moveTo(cx - sw, base + 4);
  ctx.bezierCurveTo(cx - sw, hy + hr * 1.6, cx + sw, hy + hr * 1.6, cx + sw, base + 4); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function cardGrid(ctx, x, y, maxW, maxH, death, e0) {
  const last = Math.max(death == null ? S.age : death, Math.floor(e0));
  const rows = Math.max(5, Math.ceil((last + 1) / 10)), gap = 5;
  const cell = Math.min((maxW - 9 * gap) / 10, (maxH - (rows - 1) * gap) / rows);
  const ys = {}; S.years.forEach(v => { ys[v.a] = v; });
  const lo = hexToRgb(CARD.lo), hi = hexToRgb(CARD.hi);
  for (let a = 0; a < rows * 10 && a < 125; a++) {
    const cx = x + (a % 10) * (cell + gap), cy = y + Math.floor(a / 10) * (cell + gap);
    const v = ys[a];
    if (v) { const t = clamp(0.15 + v.h / 100 * 0.85, 0, 1); ctx.fillStyle = `rgb(${lo.map((c, i) => Math.round(c + (hi[i] - c) * t)).join(',')})`; }
    else ctx.fillStyle = 'rgba(19,33,42,0.05)';
    if (death != null && a === death) ctx.fillStyle = CARD.loss;
    ctx.fillRect(cx, cy, cell, cell);
    if (a === Math.floor(e0)) { ctx.strokeStyle = CARD.ink; ctx.lineWidth = 2.5; ctx.strokeRect(cx + 1.25, cy + 1.25, cell - 2.5, cell - 2.5); }
  }
  return y + rows * (cell + gap);
}
function factCell(ctx, x, y, w, label, value, color) {
  ctx.fillStyle = CARD.ink3; cfont(ctx, 400, 24, CF.b); ctx.fillText(label, x, y);
  ctx.fillStyle = color || CARD.ink; fitText(ctx, value, 600, CF.b, 34, w, 22); ctx.fillText(value, x, y + 44);
}
function drawDeathCard(ctx) {
  const d = S.deathAt, b = BB(), c = CBY[d.where], lt = lifeTable(b, S.sex), W = CARD.W;
  cardBase(ctx, "Ghi chép cuộc đời", `${S.born}-${S.by}-${String(d.age).padStart(3, '0')}`);
  cardPortrait(ctx, 64, 200, 200, 250, d.age);
  const ad = typeof adoptFrom === 'function' && adoptFrom();
  ctx.fillStyle = CARD.stamp; cfont(ctx, 600, 28, CF.b); ctx.fillText(`${ad ? CBY[ad].ko : b.ko} · ${pubSex() === 'F' ? L`여성${LBL}` : L`남성${LBL}`}`, 300, 238);
  ctx.fillStyle = CARD.ink; fitText(ctx, S.name.full, 700, CF.d, 74, W - 364, 40); ctx.fillText(S.name.full, 300, 318);
  ctx.fillStyle = CARD.ink2; cfont(ctx, 400, 30, CF.m); ctx.fillText(L`${S.by} – ${S.by + d.age} · 향년 ${d.age}세`, 300, 374);
  cfont(ctx, 400, 28, CF.b); drawWrapped(ctx, L`${S.urban && S.city ? S.city + (', ') : ''}${c.ko}에서 생을 마감`, 300, 424, W - 364, 36, 1);
  const kidsN = S.fam.kids.filter(k => !k.cut).length;
  const kids = kidsN ? L`자녀 ${kidsN}명${S.stats.kidsLost ? L` (${S.stats.kidsLost}명 먼저 보냄)` : ''}` : (S.fam.married || S.fam.widowed ? "Không có con" : "Chưa từng kết hôn");
  const job = lastWorkLabel();
  const countries = [...new Set((ad ? [ad] : []).concat(S.years.map(y => y.cur)))].map(i => CBY[i].ko).join(' → ');
  const cw = (W - 128 - 40) / 2;
  const rows = [["Nơi sinh", ad ? L`${CBY[ad].ko} · 입양` : `${(S.bornUrban !== false && S.bornCity) ? S.bornCity : "một làng quê"} · ${QSHORT[S.q]}`], ["Học vấn", eduLbl()], ["Công việc cuối cùng", job], [L`가족${LBL}`, kids], ["Những nước đã sống", countries], ["Nguyên nhân qua đời", d.label.replace(/ \(.*\)$|（.*）$/, '')]];
  if (d.cause === 'suic') rows.pop();
  rows.forEach(([k, v], i) => factCell(ctx, 64 + (i % 2) * (cw + 40), 530 + Math.floor(i / 2) * 112, cw, k, v, k === "Nguyên nhân qua đời" ? CARD.accent : null));
  ctx.fillStyle = CARD.ink3; cfont(ctx, 400, 22, CF.b); ctx.fillText("Bản đồ cuộc đời · 1 ô = 1 năm · càng đậm = càng hạnh phúc · viền đậm = tuổi thọ kỳ vọng", 64, 896);
  const note = (S.farewell || '').trim();
  const comps = S.comps && S.comps.length ? L`같은 1초에 태어난 ${S.comps.length}명은 ${S.comps.map(c => c.death.age).join(' · ')}세까지 살았습니다` : '';
  const tight = !!(note && comps);
  cardGrid(ctx, 64, 916, 560, note ? 196 : 290, d.age, lt.e0);
  const longer = survL(S.born, S.sex)[Math.min(111, d.age + 1)];
  ctx.fillStyle = CARD.stamp; fitText(ctx, pctStr(longer), 700, CF.d, note ? 104 : 120, W - 64 - 660, 72); ctx.fillText(pctStr(longer), 660, note ? 996 : 1012);
  ctx.fillStyle = CARD.ink2; cfont(ctx, 400, 25, CF.b);
  let yy = drawWrapped(ctx, L`같은 해 ${b.ko}에서 태어난 아이 중 나보다 오래 사는 비율`, 664, note ? 1036 : 1054, W - 64 - 664, 32, 2);
  const diff = d.age - lt.e0;
  ctx.fillStyle = CARD.ink; cfont(ctx, 400, 23, CF.m); ctx.fillText(L`기대수명 ${lt.e0.toFixed(1)}세 ${diff >= 0 ? '+' : '−'}${Math.abs(diff).toFixed(1)}년`, 664, yy + 6);
  if (comps && !note) { ctx.fillStyle = CARD.ink2; cfont(ctx, 400, 22, CF.b); drawWrapped(ctx, comps, 664, yy + 44, W - 64 - 664, 30, 2); }
  if (note) {
    const q = `“${note}”`;
    fitText(ctx, q, 700, CF.d, 34, W - 128, 24); const one = ctx.measureText(q).width <= W - 128;
    if (comps) { ctx.fillStyle = CARD.ink2; fitText(ctx, comps, 400, CF.b, 23, W - 128, 18); ctx.fillText(comps, 64, one ? 1150 : 1136); }
    ctx.fillStyle = CARD.accent;
    if (one) { fitText(ctx, q, 700, CF.d, 34, W - 128, 24); ctx.fillText(q, 64, tight ? 1198 : 1180); }
    else { cfont(ctx, 700, 26, CF.d); drawWrapped(ctx, q, 64, 1176, W - 128, 32, 2); }
  }
}
function drawBirthCard(ctx) {
  const b = BB(), lt = lifeTable(b, S.sex), W = CARD.W, sh = share(b);
  cardBase(ctx, L`출생 신고 · ${S.by}년 ${S.bm}월`, `${S.born}-${S.by}`);
  ctx.fillStyle = CARD.ink; fitText(ctx, b.ko, 700, CF.d, 150, W - 128, 70); ctx.fillText(b.ko, 60, 340);
  ctx.fillStyle = CARD.ink2; cfont(ctx, 400, 34, CF.b);
  drawWrapped(ctx, L`${S.bornCity ? S.bornCity : "một làng quê"} · ${QSHORT[S.q]}에서 ${S.sex === 'F' ? "bé gái" : "bé trai"}로 태어났습니다`, 64, 410, W - 128, 46, 2);
  cardPortrait(ctx, 64, 500, 200, 250, 0);
  ctx.fillStyle = CARD.ink; fitText(ctx, S.name.full, 700, CF.d, 66, W - 364, 36); ctx.fillText(S.name.full, 300, 572);
  ctx.fillStyle = CARD.ink2; cfont(ctx, 400, 28, CF.b);
  ctx.fillText(L`어머니 ${S.fam.mom.age}세${S.fam.dad.absent ? " · bố không ở bên" : L` · 아버지 ${S.fam.dad.age}세`}`, 300, 628);
  ctx.fillText(`${S.fam.older ? L`위로 형제자매 ${S.fam.older}명` : "Con đầu lòng"} · ${S.rel === 'N' ? "Không theo tôn giáo" : typeof relName === 'function' ? relName() : REL[S.rel]}`, 300, 674);
  ctx.fillText(L`출신 가정 소득 ${S.q}분위 (5분위 중)`, 300, 720);
  const tiles = [[fmtShare(sh), UI.prefs.mode === 'pop' ? "Tỷ lệ của nước này trong dân số thế giới" : "Xác suất chào đời ở nước này"], [pctStr(1 - cohortL(S.born, S.sex, 5), 1), "Xác suất qua đời trước 5 tuổi"], [L`${lt.e0.toFixed(1)}세`, L`${S.sex === 'F' ? "nữ giới" : "nam giới"} 기대수명`]];
  const tw = (W - 128 - 2 * 32) / 3;
  tiles.forEach(([v, k], i) => {
    const x = 64 + i * (tw + 32), y = 800;
    ctx.fillStyle = CARD.card; ctx.fillRect(x, y, tw, 200); ctx.strokeStyle = CARD.rule; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, tw - 2, 198);
    ctx.fillStyle = i === 1 ? CARD.accent : CARD.stamp; fitText(ctx, v, 700, CF.d, 76, tw - 48, 40); ctx.fillText(v, x + 24, y + 104);
    ctx.fillStyle = CARD.ink2; cfont(ctx, 400, 24, CF.b); drawWrapped(ctx, k, x + 24, y + 150, tw - 48, 32, 2);
  });
  ctx.fillStyle = CARD.ink; cfont(ctx, 600, 34, CF.b);
  drawWrapped(ctx, S.comps && S.comps.length ? L`같은 1초에 지구에서 태어난 ${S.comps.length}명: ${S.comps.map(c => CBY[c.iso].ko).join(', ')}` : L`지금 태어나는 아기 ${Math.round(1 / sh).toLocaleString('vi-VN')}명 중 1명꼴로 ${b.ko}에서 태어납니다.`, 64, 1078, W - 128, 46, 2);
  ctx.fillStyle = CARD.accent; cfont(ctx, 600, 34, CF.b); ctx.fillText("Em bé này có thể sống đến bao nhiêu tuổi?", 64, 1172);
}
async function prepCard(kind) {
  if (!S) return null;
  const key = kind + '|' + S.name.full + '|' + S.born + '|' + (S.deathAt ? S.deathAt.age : '') + '|' + (S.farewell || '');
  if (cardCache.key === key && cardCache.blob) return cardCache;
  if (cardCache.pending && cardCache.pendingKey === key) return cardCache.pending;
  const job = (async () => {
    const txt = [S.name.full, B().ko, C().ko, S.farewell || '', (S.comps || []).map(c => CBY[c.iso].ko).join(''), "người chào đời trên Trái Đất trong cùng giây ấy · lần lượt sống đến tuổi “”", S.city || '', S.bornCity || '', S.deathAt ? S.deathAt.label : '', EDU.join(''), Object.values(JOBS).map(j => j.n).join(''), QSHORT.join(''), REL[S.rel] || '', "Ghi chép cuộc đời Khai sinh Giữa 8 tỷ người, bạn sẽ chào đời là ai? số trẻ sinh cùng năm ở sống lâu hơn bạn Tuổi thọ kỳ vọng qua đời lúc tuổi Qua đời tại Những nước đã sống Nguyên nhân qua đời Học vấn Công việc cuối cùng Gia đình người con Không có con Chưa từng kết hôn đã ra đi trước nghỉ hưu một làng quê bé gái bé trai chào đời là trong Mẹ bố không ở bên Có anh chị Con đầu lòng Không theo tôn giáo Thu nhập gia đình: nhóm trên 5 Xác suất chào đời ở nước này Xác suất qua đời trước 5 tuổi Nữ Nam Cứ khoảng em bé chào đời lúc này thì có 1 em ở Em bé này có thể sống đến bao nhiêu tuổi? Bản đồ cuộc đời 1 ô = 1 năm càng đậm = càng hạnh phúc viền đậm"].join(' ');
    await loadCardFonts(txt);
    const cv = document.createElement('canvas'); cv.width = CARD.W; cv.height = CARD.H;
    const ctx = cv.getContext('2d');
    if (kind === 'death') drawDeathCard(ctx); else drawBirthCard(ctx);
    const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
    if (!blob) return null;
    if (cardCache.url) URL.revokeObjectURL(cardCache.url);
    const name = L`VoHanTrungSinh-${kind === 'death' ? "ghi-chep-cuoc-doi" : "Sinh"}-${S.born}.png`;
    let file = null; try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { }
    const dataUrl = await new Promise(r => { try { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.onerror = () => r(null); fr.readAsDataURL(blob); } catch (e) { r(null); } });
    Object.assign(cardCache, { key, kind, blob, file, name, url: URL.createObjectURL(blob), dataUrl, pending: null });
    return cardCache;
  })();
  cardCache.pending = job; cardCache.pendingKey = key;
  return job;
}