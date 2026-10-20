// js/events.js - Su kien (EVENTS)
const EVENTS = [
  { id: 'vax', a: [0, 1], c: () => !S.flags.vax, w: 3, run: () => { S.flags.vax = 1; const c = C(), base = clamp(1 - c.u5 / 260, 0.45, 0.98), cov = 1 - (1 - base) * [1.35, 1.15, 1, 0.75, 0.5][S.q - 1] * (S.urban ? 0.85 : 1); if (chance(cov)) { eff({ hl: 3 }); return { t: "Bạn được tiêm các mũi vắc-xin cơ bản (DTP và sởi).", f: "Năm 2023, 84% trẻ sơ sinh trên thế giới được tiêm đủ ba mũi DTP (WHO·UNICEF)" }; } S.flags.noVax = 1;
    const far = c.u5 >= 25 && (!S.urban || (c.u5 >= 60 && S.q <= 3)); eff({ hl: far ? -4 : -2 });
    return { t: far ? "Bạn không được tiêm chủng đúng lịch. Trạm y tế ở quá xa." : "Bạn bị lỡ vài mũi tiêm chủng. Lỡ ngày tiêm rồi, một thời gian cứ thế trôi qua.", k: 'bad', f: far ? "Năm 2023, khoảng 14,5 triệu trẻ chưa được tiêm một mũi vắc-xin nào (WHO·UNICEF)" : null }; } },
  { id: 'steps', a: [1, 1], w: 3, run: () => { eff({ h: 2 }); return "Bạn chập chững những bước đi đầu tiên. Cả nhà vỗ tay."; } },
  { id: 'word', a: [1, 2], c: () => !S.flags.word, w: 2, run: () => { S.flags.word = 1; const f = S.fam, r = S.flags.raised;
      if (f.mom.alive) return "Bạn nói từ đầu tiên. Đó là một từ có nghĩa là “mẹ”.";
      if (f.dad.alive && !f.dad.absent) return "Bạn nói từ đầu tiên. Đó là một từ có nghĩa là “bố”.";
      if (r && r.k === 'gp') return r.sex === 'M' ? "Bạn nói từ đầu tiên. Đó là một từ có nghĩa là “ông”." : "Bạn nói từ đầu tiên. Đó là một từ có nghĩa là “bà”.";
      return "Bạn nói từ đầu tiên. Đó là “măm măm”, đòi được ăn."; } },
  { id: 'kidsick', a: [0, 4], c: () => yearRoll('kidsick', clamp(0.06 + C().u5 / 250, 0.06, 0.55) * [1.4, 1.2, 1, 0.8, 0.6][S.q - 1]), w: 40, rep: 1, run: () => {
      const c = C(); const opts = { diar: 3, lri: c.u5 < 15 ? 1 : 2.5 }; if (c.mal) opts.mal = 4 * c.mal; if (S.flags.noVax) opts.measles = 2;
      const k = wpick(opts), well = S.q >= 4 || c.ppp > 30000;
      const t = well ? { diar: "Bạn bị tiêu chảy mấy ngày, nhưng đi khám xong là khỏi ngay.", lri: "Bạn bị viêm phổi, nằm viện vài ngày rồi khỏi.", mal: "Sốt rét khiến bạn sốt cao, nhưng bạn được uống thuốc ngay và khỏi bệnh.", measles: "Bệnh sởi lan khắp làng, bạn ốm liệt giường." }[k]
        : { diar: calYr() >= 1975 ? "Bạn bị tiêu chảy nhiều ngày. Nhờ dung dịch bù nước oresol (ORS), bạn khó khăn lắm mới hồi phục được." : "Bạn bị tiêu chảy nhiều ngày, khó khăn lắm mới hồi phục được.", lri: "Bạn bị viêm phổi, thở rất khó nhọc.", mal: "Sốt rét khiến bạn lên cơn sốt cao.", measles: "Bệnh sởi lan khắp làng, bạn ốm liệt giường." }[k];
      eff({ hl: -4 }); return { t, k: 'bad', f: k === 'mal' ? "Năm 2023, khoảng 76% số ca tử vong do sốt rét là trẻ em dưới 5 tuổi (WHO World Malaria Report 2024)" : k === 'diar' ? "Tiêu chảy là nguyên nhân gây tử vong đứng thứ ba ở trẻ em dưới 5 tuổi (WHO)" : null }; } },
  { id: 'kid_dream', a: [6, 9], c: () => !S.flags.kidDream && yearRoll('kid_dream', 0.4), w: 30, run: () => { const id = S.flags.kidDream = kidDreamPick(); S.flags.kidDreamAt = S.age; S.flags.kidDreamC = S.cur; return { t: L`어른들이 커서 뭐가 되고 싶냐고 물으면 늘 ${iga(OWN_DREAM()[id])} 되겠다고 대답했습니다.`, k: 'warm' }; } },
  { id: 'fam_books', a: [2, 7], c: () => (S.q >= 4 || C().ppp > 40000) && !S.flags.famBooks && parW() !== "gia đình", w: 1.2, run: () => { S.flags.famBooks = 1; eff({ sm: 2, so: 1 }); return L`잠들기 전마다 ${iga(parW())} 그림책을 읽어 주셨습니다.`; } },
  { id: 'fam_room', a: [6, 11], c: () => S.q >= 4 && (C().ppp > 8000 || S.q === 5) && !S.flags.ownRoom, w: 0.9, run: () => { S.flags.ownRoom = 1; eff({ h: 2 }); return S.school ? "Khi vào tiểu học, bạn có phòng riêng của mình." : "Lần đầu tiên bạn có một căn phòng của riêng mình."; } },
  { id: 'fam_trip', a: [5, 14], c: () => S.q >= 4 && (C().ppp > 10000 || S.q === 5), w: 0.8, gap: 4, run: () => { eff({ h: 3, so: 1 }); return S.school ? "Vào kỳ nghỉ học, bạn cùng gia đình đi du lịch." : "Bạn cùng gia đình đi du lịch."; } },
  { id: 'kid_water', a: [5, 12], c: () => !S.urban && lowInc(C()) && S.q <= 3 && ['ssa', 'sa', 'mena', 'eap', 'lac'].includes(C().p) && !S.flags.kidWater && yearRoll('kw', S.sex === 'F' ? 0.18 : 0.09), w: 30, run: () => { S.flags.kidWater = 1; eff({ hl: 1, h: -1 }); return { t: "Trước khi mặt trời mọc, bạn xách can đến cái giếng xa để lấy nước. Đường về lúc nào cũng như dài hơn.", f: "Ở 7 trên 10 hộ gia đình không có nước tại nhà, phụ nữ và trẻ em gái là người đi lấy nước (WHO·UNICEF JMP 2023)" }; } },
  { id: 'puberty', a: [10, 17], c: () => !S.trans && S.flags.pubDone == null && S.age >= (S.flags.pubA ?? (S.flags.pubA = Math.round(clamp((S.sex === 'F' ? (lowInc(B()) ? 13.4 : 12.6) : (lowInc(B()) ? 14 : 13.4)) + (rnd() + rnd() - 1) * 2, 10, 16)))), w: 30, run: () => {
      S.flags.pubDone = S.age;
      if (S.sex !== 'F') return "Giọng bạn bắt đầu vỡ và trầm xuống. Chỉ trong một năm bạn cao vọt, quần chẳng mấy chốc đã ngắn cũn.";
      if (lowInc(C()) && S.q <= 2 && chance(0.5)) return { t: "Bạn có kỳ kinh nguyệt đầu tiên. Gia đình không đủ tiền mua băng vệ sinh, nên bạn dùng vải, giặt đi giặt lại.", k: 'ev', f: "Khoảng 500 triệu phụ nữ và trẻ em gái trên thế giới không được tiếp cận đầy đủ với sản phẩm vệ sinh kinh nguyệt và công trình vệ sinh (Ngân hàng Thế giới)" };
      return "Bạn có kỳ kinh nguyệt đầu tiên. Cơ thể thay đổi khiến bạn thấy lạ lẫm, nhưng bạn đón nhận đó như một phần của quá trình trưởng thành."; } },
  { id: 'menopause', a: [40, 60], c: () => S.sex === 'F' && !S.trans && S.flags.mpDone == null && S.age >= mpAge(), w: 30, run: () => {
      S.flags.mpDone = S.age;
      if (chance(0.25)) return { t: "Bạn đã đến tuổi mãn kinh. Mọi thứ qua đi mà không khó chịu nhiều như bạn tưởng.", f: "Phần lớn phụ nữ mãn kinh trong khoảng từ 45 đến 55 tuổi (WHO 2024)" };
      eff({ h: -1 }); return { t: "Bạn đã đến tuổi mãn kinh. Có một thời gian, những cơn bốc hỏa bất chợt và những đêm mất ngủ cứ kéo đến, rồi dần dần dịu đi.", f: "Phần lớn phụ nữ mãn kinh trong khoảng từ 45 đến 55 tuổi. Bốc hỏa, đổ mồ hôi và khó ngủ là thường gặp, và giảm dần trong vài năm (WHO 2024)" }; } },
  { id: 'kid_bike', a: [5, 10], c: () => (S.q >= 3 || C().ppp > 20000) && !S.flags.kidBike && yearRoll('kb', 0.12), w: 30, run: () => { S.flags.kidBike = 1; eff({ h: 3 }); return S.urban ? "Bạn tập đi xe đạp lần đầu trên bãi đất trống trước khu chung cư. Sau vài lần ngã, bạn đã tự đạp đi được." : "Bạn tập đi xe đạp lần đầu trên con đường làng. Sau vài lần ngã, bạn đã tự đạp đi được."; } },
  { id: 'kid_rain', a: [5, 11], c: () => ['sa', 'ssa', 'lac'].includes(C().p) || (C().p === 'eap' && !['CHN', 'KOR', 'JPN', 'MNG', 'PRK'].includes(S.cur)) ? !S.flags.kidRain && yearRoll('kr', 0.1) : false, w: 30, run: () => { S.flags.kidRain = 1; eff({ h: 2 }); return "Mùa mưa, các con hẻm ngập như sông. Bạn cùng lũ trẻ trong xóm thả thuyền giấy trên dòng nước đục ngầu."; } },
  { id: 'kid_snow', a: [3, 11], c: () => SNOWY.includes(S.cur) && !S.flags.kidSnow && yearRoll('ks', 0.1), w: 30, run: () => { S.flags.kidSnow = 1; eff({ h: 3, so: 1 }); return "Ngày tuyết đầu mùa rơi dày, bạn cùng lũ trẻ trong xóm ném tuyết và đắp người tuyết."; } },
  { id: 'kid_academy', a: [9, 13], c: () => ['KOR', 'CHN', 'JPN', 'TWN', 'HKG', 'SGP', 'VNM'].includes(S.cur) && S.school && S.q >= 2 && C().ppp > 8000 && !S.flags.kidAcad && yearRoll('ka', 0.2), w: 30, run: () => { S.flags.kidAcad = 1; eff({ sm: 2, h: -2 }); return { t: "Tan học, bạn còn đến hai trung tâm học thêm, tối mịt mới về đến nhà.", f: S.cur === 'KOR' ? "78,5% học sinh tiểu học và trung học ở Hàn Quốc học thêm (Statistics Korea, khảo sát chi phí học thêm năm 2023)" : null }; } },
  { id: 'kid_lamp', a: [7, 13], c: () => S.school && !S.urban && (C().p === 'ssa' || (C().p === 'sa' && calYr() < 2020)) && C().ppp < 6000 && S.q <= 3 && !S.flags.kidLamp && !S.flags.power && yearRoll('kl', 0.12), w: 30, run: () => { S.flags.kidLamp = 1; S.flags.noPow = S.age; eff({ sm: 1 }); return { t: "Nhà không có điện, bạn làm bài tập dưới ánh đèn dầu.", f: "Năm 2022, khoảng 685 triệu người trên thế giới sống không có điện, hơn 80% trong số đó ở châu Phi cận Sahara (Tracking SDG7 2024)" }; } },
  { id: 'kid_ball', a: [5, 12], c: () => (C().sp || '').split(',')[0] === 'football' && C().ppp < 20000 && !S.flags.kidBall && yearRoll('kf', 0.1), w: 30, run: () => { S.flags.kidBall = 1; eff({ h: 3, hl: 1, so: 2 }); return "Với quả bóng làm từ những chiếc túi ni lông cuộn tròn, bạn đá bóng chân trần cho đến khi mặt trời lặn."; } },
  { id: 'kid_library', a: [6, 12], c: () => S.urban && C().ppp > 15000 && S.school && !S.flags.kidLib && yearRoll('kli', 0.08), w: 30, run: () => { S.flags.kidLib = 1; eff({ sm: 2, h: 1 }); return "Ở thư viện khu phố, lần đầu tiên bạn nhận được thẻ thư viện có tên mình."; } },
  { id: 'faith_secret', a: [7, 14], c: () => faithHidden() && ['C', 'B', 'F'].includes(S.rel) && !S.flags.faithSecret, w: 30, run: () => { S.flags.faithSecret = 1; eff({ so: 1 });
    return { t: S.rel === 'C' ? "Gia đình bạn giữ gìn đức tin được truyền lại từ bà, ban đêm khẽ cầu nguyện trong chăn. Bạn đã bao lần phải hứa không bao giờ nói ra điều đó ở bên ngoài."
      : S.rel === 'B' ? "Người lớn lén lần chuỗi hạt cầu nguyện. Họ dặn bạn ra khỏi nhà thì không được nói một lời nào về chuyện đó." : cnCR() ? "Người lớn lặng lẽ duy trì việc cúng giỗ tổ tiên, tránh khỏi ánh mắt người ngoài." : "Người lớn lặng lẽ duy trì việc cúng tổ tiên và thần núi, tránh khỏi ánh mắt người ngoài.",
      k: 'ev', f: cnCR() ? "Trong Cách mạng Văn hóa, mọi hoạt động tôn giáo ở Trung Quốc bị cấm, nhà thờ, chùa và thánh đường Hồi giáo bị đóng cửa hoặc phá hủy (Pew Research Center 2023)" : "Ở Triều Tiên, người bị phát hiện hoạt động tôn giáo không được phép có thể bị đưa vào trại tù chính trị hoặc mất mạng (Ủy ban Điều tra của Liên Hợp Quốc về nhân quyền ở Triều Tiên, 2014)" }; } },
  { id: 'kid_faith', a: [5, 10], c: () => (S.rel === 'M' || S.rel === 'C') && !faithHidden() && !S.flags.kidFaith && yearRoll('kfa', 0.1), w: 30, run: () => { S.flags.kidFaith = 1; eff({ so: 2, h: 1 }); return S.rel === 'M' ? "Mỗi sáng bạn học đọc kinh Qur'an ở nhà thờ Hồi giáo trong xóm." : den() === 'cath' && S.age >= 7 ? "Bạn rước lễ lần đầu. Mặc áo trắng, bạn chụp ảnh cùng cả gia đình trước nhà thờ." : den() === 'orth' ? "Đêm Phục Sinh, bạn cầm nến đi ba vòng quanh nhà thờ. Nửa đêm, chuông vang lên." : "Trong vở kịch Giáng Sinh, bạn đóng vai một mục đồng. Bạn chỉ có một câu thoại, nhưng cả nhà đều đến xem."; } },
  { id: 'kid_tree', a: [6, 11], c: () => !S.urban && !S.flags.kidTree && yearRoll('kt', 0.08), w: 30, run: () => { S.flags.kidTree = 1; eff({ h: 2, hl: -1 }); return "Bạn trèo cây to ở đầu làng thì ngã, trầy cả đầu gối. Hôm sau bạn lại trèo lên."; } },
  { id: 'fam_maid', a: [1, 6], c: () => S.q === 5 && ['lac', 'sa', 'eap', 'mena', 'ssa'].includes(C().p) && C().ppp < 40000 && !S.flags.famMaid, w: 1, run: () => { S.flags.famMaid = 1; return "Nhà bạn có người giúp việc nhà và trông trẻ."; } },
  { id: 'fam_room1', a: [2, 12], c: () => S.q <= 2 && S.urban && !S.flags.famRoom1, w: 1, run: () => { S.flags.famRoom1 = 1; eff({ h: -1 }); return { t: "Cả nhà cùng ăn, cùng ngủ trong một căn phòng duy nhất.", f: "Khoảng 1 trên 4 người sống ở đô thị sống trong khu ổ chuột hoặc khu định cư tự phát (UN-Habitat)" }; } },
  { id: 'fam_clothes', a: [4, 12], c: () => S.q <= 2 && !S.flags.famClothes, w: 0.8, run: () => { S.flags.famClothes = 1; return "Chỉ dịp lễ Tết bạn mới có một bộ quần áo mới."; } },
  { id: 'hungry', a: [0, 17], c: () => C().ppp < 6000 && S.q <= 2, w: 1.5, rep: 1, run: () => { eff({ hl: -5, h: -3, sm: -1 }); return { t: "Mất mùa, nhiều ngày bạn chỉ được ăn một bữa.", k: 'bad', f: "Năm 2023, khoảng 733 triệu người trên thế giới phải chịu cảnh đói (FAO SOFI 2024)" }; } },
  { id: 'stunt', a: [1, 4], c: () => C().u5 > 40 && S.q <= 3 && !S.flags.stunt, w: 1, run: () => { S.flags.stunt = 1; eff({ hl: -4, sm: -3 }); return { t: "Thiếu dinh dưỡng khiến bạn thấp bé hơn các bạn cùng tuổi.", k: 'bad', f: "22% trẻ em dưới 5 tuổi trên thế giới bị thấp còi (UNICEF·WHO 2023)" }; } },
  { id: 'play', a: [2, 9], w: 2, rep: 1, run: () => { eff({ h: 3, so: 2 });
      const gm = gpWho('F'), story = gm && (S.flags.gmStory == null || S.age - S.flags.gmStory >= 4);
      const t = varied('play', [S.dis && S.dis.k === 'move' ? "Bạn chơi cùng lũ trẻ trong xóm cho đến khi mặt trời lặn." : "Bạn chạy nhảy cùng lũ trẻ trong xóm cho đến khi mặt trời lặn.", "Bạn nghịch đất, làm bẩn hết cả quần áo.", L`${SPORTS[C().sp.split(',')[0]]} 흉내를 내며 놀았습니다.`].concat(story ? [noHear() ? L`${iga(gm)} 그림을 그리고 손짓을 해 가며 옛날이야기를 해 주셨습니다.` : L`${iga(gm)} 옛날이야기를 들려주셨습니다.`] : []));
      if (story && t.indexOf(gm) >= 0) S.flags.gmStory = S.age;
      return t; } },
  { id: 'ruwar', a: [0, 2], c: () => S.born === 'RUS' && S.cur === 'RUS' && typeof nowWorld === 'function' && nowWorld() && !S.flags.ruWar, w: 20, run: () => { S.flags.ruWar = 1; return { t: "Năm bạn chào đời, cuộc chiến giữa Nga và Ukraine bắt đầu từ năm 2022 vẫn còn tiếp diễn.", f: "Sau cuộc xâm lược năm 2022, khoảng 6 triệu người Ukraine đã chạy nạn ra nước ngoài (UNHCR)" }; } },
  { id: 'powerin', a: [5, 100], c: () => S.flags.noPow != null && !S.flags.power && !S.urban && S.cur === S.born && calYr() >= NOW_Y && yearRoll('pwin', 0.04), w: 30, run: () => { S.flags.power = 1; eff({ h: 2 }); return { t: "Cuối cùng điện cũng về đến làng. Ban đêm trong nhà cũng sáng trưng.", k: 'warm', f: "Năm 2022, khoảng 685 triệu người trên thế giới sống không có điện (Tracking SDG7 2024)" }; } },
  { id: 'kinder', a: [3, 5], c: () => !S.flags.kinder && (C().ppp > 12000 || S.q >= 4), w: 2, run: () => { S.flags.kinder = 1; eff({ sm: 3, so: 2 }); return "Bạn bắt đầu đi mẫu giáo."; } },
  { id: 'fest', a: [1, 100], w: 0.8, rep: 1, gap: 7, run: () => {
      const fc = FEST_C[S.cur] && (!FEST_FAITH[S.cur] || FEST_FAITH[S.cur].includes(S.rel)) ? FEST_C[S.cur] : null;
      const f = fc && (!S.flags.festC || faithHidden() || chance(0.6)) ? fc : (FEST_RB[S.born] && FEST_RB[S.born][S.rel]) || FEST[S.rel];
      if (f === fc) S.flags.festC = 1;
      if (famNear() && S.mig && S.migY >= 18 && !famCame() && S.flags.parCame == null && !(S.flags.studyAbroad && S.school)) {
        const f0 = S.fam, P = f0.partner, pt = f0.married && P && P.alive && !P.lb, kn = f0.kids.filter(kidHereNow).length;
        eff({ h: 2, so: 1 }); const home = (f0.mom.alive || (f0.dad.alive && !f0.dad.absent) || sibN() > 0) && !farFromNK();
        const t = L`${eul(f)} ${pt && kn ? "cùng bạn đời và các con" : pt ? "cùng bạn đời" : kn > 1 ? "cùng các con" : "cùng con"} 함께 보냈습니다.`;
        return !home ? t : t + ' ' + ((S.owns.phone || C().net >= 50) && !eraBefore(2010) ? "Bạn gọi video hỏi thăm gia đình ở quê nhà." : eraBefore(2010) && C().ppp > 3000 ? "Bạn gọi điện quốc tế hỏi thăm gia đình ở quê nhà." : "Bạn nhớ gia đình ở quê nhà da diết.");
      }
      if (famNear()) { eff({ h: 2, so: 1 }); return L`${eul(f)} 가족과 함께 보냈습니다.`; }
      if (S.mig && famAnywhere()) { eff({ h: 1 }); return (S.owns.phone || C().net >= 50) && !farFromNK() && !eraBefore(2010) ? L`${f}에 고향의 가족과 영상통화로 안부를 나눴습니다.` : eraBefore(2010) && C().ppp > 3000 && !farFromNK() ? L`${f}에 고향의 가족에게 국제 전화로 안부를 전했습니다.` : L`${f}에 고향의 가족이 많이 그리웠습니다.`; }
      if (S.st.so >= 40) { eff({ h: 2, so: 1 }); return L`${eul(f)} ${pick(["cùng bạn bè", "cùng hàng xóm"])} 함께 보냈습니다.`; }
      eff({ h: -1 }); return { t: L`${eul(f)} 조용히 혼자 보냈습니다.`, k: 'bad' }; } },
  { id: 'water', a: [4, 15], c: () => !S.urban && S.q <= 3 && C().ppp < 9000 && ['ssa', 'sa'].includes(C().p), w: 1.5, run: () => { eff({ hl: -1, sm: -1 }); return { t: "Mỗi sáng bạn đi bộ một quãng đường xa để lấy nước.", f: "Năm 2022, 2,2 tỷ người trên thế giới không được tiếp cận nước uống được quản lý an toàn (WHO·UNICEF JMP)" }; } },
  { id: 'nopower', a: [4, 16], c: () => !S.urban && S.q <= 3 && C().ppp < 6000 && !S.flags.power && !(C().p === 'sa' && calYr() >= 2020), w: 1, run: () => (S.flags.noPow = S.age, { t: "Nhà không có điện, trời tối là bạn sống dưới ánh đèn dầu.", f: "Năm 2022, khoảng 685 triệu người trên thế giới sống không có điện (Tracking SDG7 2024)" }) },
  { id: 'grades', a: [7, 22], c: () => !!S.school, w: 2, rep: 1, run: () => {
      if (S.flags.cr == null) S.flags.cr = rnd();
      const r = normCdf(0.75 * clamp(kzOf(), -3, 3) + 0.45 * invNorm(clamp(S.flags.cr, 0.01, 0.99)) + 0.5 * invNorm(clamp(rnd(), 0.01, 0.99)) + 0.2 * ((S.focusW || {}).study || 0) - (S.nd && S.nd.l ? ND_L_MK : 0));
      if (r > 0.9) { eff({ h: 3 }); S.flags.topMk = S.age; return "Bạn đạt điểm số thuộc hàng đầu lớp."; }
      if (r < 0.1) { if (ddIDk(S.dd)) { if (S.flags.idPace) return null; S.flags.idPace = 1; return "Bạn học từng bước theo nhịp của riêng mình và hoàn thành năm học."; } eff({ h: -3 }); return { t: "Điểm số sa sút, bạn bị mắng.", k: 'bad' }; }
      if (r > 0.65) { eff({ h: 1 }); return "Bạn kết thúc năm học với kết quả tốt."; } return "Bạn kết thúc năm học với kết quả bình thường."; } },
  { id: 'teacher', a: [7, 17], c: () => !!S.school, w: 1, run: () => { eff({ sm: 4 }); S.flags.goodT = S.age; return L`좋은 선생님을 만나 ${pick(["môn toán", "môn khoa học", "việc viết lách", "môn lịch sử", TONGUE.en.split(',').includes(S.cur) ? "ngoại ngữ" : "tiếng Anh"])}에 흥미가 생겼습니다.`; } },
  { id: 'bully', a: [8, 15], c: () => !!S.school && (S.flags.bullyN || 0) < 2 && yearRoll('bully', bullyP()), w: 30, gap: 2, run: () => {
      const n = S.flags.bullyN = (S.flags.bullyN || 0) + 1; eff({ h: -6, so: -3 });
      return { t: n === 1 ? "Bạn bị bắt nạt ở trường." : "Việc bắt nạt kéo dài một thời gian. Bạn lấy hết can đảm kể lại với người lớn.", k: 'bad' }; } },
  { id: 'bff', a: [6, 20], w: 1.2, run: () => { const n = otherName(S.cl, chance(0.5) ? S.sex : (S.sex === 'M' ? 'F' : 'M')); eff({ so: 5, h: 3 }); return L`${wa(n)} 단짝 친구가 되었습니다.`; } },
  { id: 'chores', a: [6, 14], c: () => !S.urban || S.q <= 2, w: 1, rep: 1, run: () => { eff({ hl: 1, sm: -1, so: 1 });
    const pj = [S.fam.dad && S.fam.dad.job, S.fam.mom && S.fam.mom.job], farm = !S.urban || pj.some(j => ['farm', 'farmhand', 'herder', 'agbiz'].includes(j)),
      market = pj.some(j => ['vendor', 'shop', 'artisan'].includes(j));
    return pick([...(farm && !(S.dis && S.dis.k === 'move') ? [S.school ? "Sau giờ học, bạn chăn gia súc và phụ việc đồng áng." : "Suốt cả ngày, bạn chăn gia súc và phụ việc đồng áng."] : []),
      ...(sibLittle() && !ddKept() ? [sibLittle() > 1 ? "Phải trông các em, bạn không có thời gian vui chơi." : "Phải trông em, bạn không có thời gian vui chơi."] : []),
      ...(market ? [L`시장에서 ${parW() === "gia đình" ? "gia đình" : parW()} 장사를 도왔습니다.`] : []),
      ...(!farm && !ddKept() && parsOut() ? [L`${iga(parW() === "gia đình" ? "người lớn" : parW())} 늦게 오는 날이 많아, 빨래를 개고 저녁 준비를 해 두는 일이 내 몫이었습니다.`] : [])]) || null; } },
  { id: 'childwork', a: [6, 14], c: () => S.job === 'childwork', w: 2, rep: 1, run: () => { const mv = (S.dis && S.dis.k === 'move') || ddKept();
      if (S.flags.cwPaid && !mv) { eff({ hl: -2 });
        const pj = [S.fam.dad && S.fam.dad.job, S.fam.mom && S.fam.mom.job], fShop = pj.some(j => ['vendor', 'shop', 'owner', 'artisan'].includes(j)), fFarm = !S.urban || pj.some(j => ['farm', 'farmhand', 'herder', 'agbiz'].includes(j));
        const own = [...(fShop ? ["Thay vì đi học, bạn ở cửa hàng của gia đình tiếp khách cả ngày."] : []), ...(fFarm ? ["Thay vì đi học, bạn phụ việc đồng áng của gia đình."] : [])];
        if (!own.length) own.push("Thay vì đi học, bạn gánh vác việc nhà.");
        return { t: S.q >= 4 ? pick(own) : pick(["Thay vì đi học, bạn làm việc ngoài đồng cả ngày.", "Bạn làm thuê lấy công nhật ở một lò gạch.", "Bạn kiếm tiền bằng việc khuân vác hàng ở chợ."]), k: 'bad', f: "Khoảng 160 triệu trẻ em trên toàn thế giới đang phải lao động (ILO·UNICEF 2020)" }; }
      eff({ sm: -1 }); return pick([sibLittle() ? "Thay vì đi học, bạn gánh vác việc nhà và trông em." : "Thay vì đi học, bạn gánh vác việc nhà.", S.urban || mv ? "Ngày ngày bạn ở nhà phụ giúp việc nhà." : "Bạn phụ việc đồng áng gần nhà và đi lấy nước.", "Bạn ao ước được như những người bạn được đến trường."]); } },
  { id: 'net', a: [3, 25], c: () => { const nc = netC(); return !S.flags.net && nc.net >= 1 && !eraBefore(1993) && S.age >= (nc.net >= 80 && !eraBefore(2005) ? 3 : 9) && chance(nc.net / 100 + 0.1); },
    w: () => studyAway() && netC().net >= 50 ? 30 : 1.5, run: () => { S.flags.net = 1; eff({ sm: 2, h: 2 }); const cw = carerW(), nc = netC(); return { t: S.age < 7 && cw !== "gia đình" ? L`${cw} 옆에서 처음으로 인터넷 동영상을 보았습니다.` : "Lần đầu tiên bạn lên mạng. Thế giới của bạn rộng mở hơn.", f: L`${nc.ko}의 인터넷 이용률 ${nc.net}% (ITU, 세계은행)` }; } },
  { id: 'crush', a: [13, 18], w: 1, c: () => !S.fam.married && !(S.fam.partner && S.fam.partner.alive && !S.fam.partner.divorced), run: () => { eff({ h: 2 }); return S.school ? "Bạn rung động trước một người bạn cùng lớp." : "Bạn rung động trước một người bạn trong xóm."; } },
  { id: 'exam', a: [15, 18], c: () => S.school === 'usec', w: 2, run: () => { const r = markR();
      if (r > 0.6) { eff({ h: 3, sm: 2 }); return "Bạn làm tốt một kỳ thi quan trọng."; }
      if (r < 0.25) { eff({ h: -4 }); return { t: "Bạn làm bài không tốt trong một kỳ thi quan trọng.", k: 'bad' }; }
      return "Bạn hoàn thành một kỳ thi quan trọng suôn sẻ."; } },
  { id: 'teenjob', a: [14, 18], c: () => !!S.school && !S.flags.teenjob && (S.q <= 2 || (C().p === 'hi' && S.age >= 15 && yearRoll('tj', 0.15))), w: 1, run: () => { S.flags.teenjob = 1; S.money += incomeAt(C(), 0.15) * 0.1; return "Bạn đi làm trong kỳ nghỉ và lần đầu tiên tự kiếm được tiền."; } },
  { id: 'hithome', a: [4, 13], c: () => !AGE12 && !S.fam.partner && withParents() && !studyAway() && (S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && (S.flags.hitN || 0) < 2 && pHit(), w: 1.6, gap: 4, run: () => {
      const n = S.flags.hitN = (S.flags.hitN || 0) + 1; eff({ h: -3, so: -1 });
      return n === 1 ? { t: "Bạn lớn lên trong cảnh hễ làm sai là bị đánh đòn. Những đêm như thế, bạn trằn trọc đến khuya không ngủ được.", k: 'bad', f: KID_HELP() }
        : { t: "Bạn lại bị đánh. Khi ấy bạn chưa biết rằng không đứa trẻ nào đáng bị đánh cả.", k: 'bad', f: HIT_FACT() }; } },
  { id: 'hitschool', a: [6, 14], c: () => !AGE12 && (S.school === 'prim' || S.school === 'lsec') && !studyAway() && (S.flags.shN || 0) < 2 && (S.age <= 11 || yearRoll('shOld', 0.4)) && pSchHit(), w: 3, gap: 3, run: () => {
      const n = S.flags.shN = (S.flags.shN || 0) + 1; eff({ h: -3, sm: -1 });
      return n === 1 ? { t: pick(["Hôm không làm bài tập, bạn bị thầy cô tát ngay trước mặt cả lớp. Hôm đó về nhà, bạn không nói được lời nào.", "Vì nói chuyện trong lớp, bạn bị thầy cô lấy thước đánh vào lòng bàn tay. Từ đó, bạn không còn giơ tay phát biểu trong giờ học nữa."]), k: 'bad', f: SCH_HELP() }
        : { t: "Chỉ cần nghe tiếng bước chân thầy cô đi về phía lớp, người bạn đã cứng đờ.", k: 'bad', f: SCH_HIT_FACT() }; } },
  { id: 'envelope', a: [6, 17], c: () => ['prim', 'lsec', 'usec'].includes(S.school) && !studyAway() && !S.fam.partner && (S.flags.envN || 0) < 2 && envLife() && yearRoll('env', 0.35), w: 30, gap: 3, run: () => {
      S.flags.envN = (S.flags.envN || 0) + 1; const hot = hotClass(C()), pw = parW() === "gia đình" ? "người lớn" : parW(), f = ENV_FACT() || undefined;
      if (chance(S.q >= 4 ? 0.75 : S.q === 3 ? 0.55 : 0.3)) { S.flags.envP = (S.flags.envP || 0) + 1; return { t: hot ? L`${iga(pw)} 선생님에게 봉투를 건넨 뒤로 내 자리는 선풍기 바로 아래가 되었습니다. 뒷자리 친구들은 땀을 닦으며 수업을 들었습니다.` : L`${iga(pw)} 선생님에게 봉투를 건넨 뒤로 선생님의 눈빛이 달라졌습니다. 이상하게 마음이 편하지 않았습니다.`, f }; }
      eff({ h: -2 });
      return { t: hot ? "Những bạn có nhà dúi phong bì cho thầy cô được ngồi ngay dưới quạt, còn bạn ngồi bàn cuối, nơi gió không thổi tới, vừa lau mồ hôi vừa học." : pick(["Những bạn có nhà dúi phong bì cho thầy cô được ngồi bàn đầu, còn bạn bị dồn xuống tận bàn cuối.", "Thầy cô chỉ gọi tên những bạn mang phong bì đến bằng giọng trìu mến."]), k: 'bad', f }; } },
  { id: 'parentfight', a: [4, 17], c: () => !S.fam.partner && withParents() && !fcAway() && !raisedHere() && S.fam.mom.alive && S.fam.dad.alive && !S.fam.dad.absent && !parInPr('dad') && !parInPr('mom') && (S.flags.pfN || 0) < 3 && pFight(), w: 2, gap: 3, run: () => {
      const n = S.flags.pfN = (S.flags.pfN || 0) + 1; eff({ h: -3 });
      return { t: n === 1 ? "Bố mẹ thường xuyên cãi nhau." : n === 2 ? (noHear() ? "Những đêm sau khi bố mẹ cãi nhau, bạn không sao ngủ được." : "Có những đêm bạn mất ngủ vì tiếng bố mẹ cãi nhau.") : "Bố mẹ lại cãi nhau to. Bạn đóng cửa phòng và nín thở.", k: 'bad' }; } },
  { id: 'promo', a: [22, 62], c: () => isWorking() && S.job !== 'farm' && !RARE_JOBS.includes(S.job) && S.flags.mandAt == null && S.pct < payTop() - 0.015 && yearRoll('promo', (S.formal ? 0.09 : 0.07) + (0.05 * (S.focusW.work || 0) + 0.025 * (S.focusW.learn || 0)) * effLeft()), w: 40, run: () => { S.pct = Math.min(S.pct + 0.05, payTop()); S.flags.raiseAt = S.age; eff({ h: 5 }); S.flags.promoN = (S.flags.promoN || 0) + 1; return promoText(); } },
  { id: 'pr_visit', a: [14, 125], prison: 1, c: () => S.flags.noVisY !== S.age && (S.fam.married || S.fam.kids.some(k => k.alive) || ((S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent)) && !parFar())), w: 1, rep: 1, gap: 2, run: () => {
    const f = S.fam, mom = f.mom.alive && !parFar(), dad = f.dad.alive && !f.dad.absent && !parFar(), small = f.kids.some(k => k.alive && S.age - k.bornAt < 13), kid = f.kids.some(k => k.alive);
    S.flags.visY = S.age; if (S.flags.visitT !== S.flags.prisonY0) { S.flags.visitT = S.flags.prisonY0; S.flags.reoffK = (S.flags.reoffK || 1) * 0.87; }
    eff({ so: 3, h: 2 }); const o = [];
    if (kid) o.push("Con bạn đến thăm. Hai người áp lòng bàn tay vào nhau qua tấm kính.");
    if (small) o.push(meSex() === 'M' ? "Bạn nghe nói con cứ hỏi mãi bao giờ bố mới về nhà." : "Bạn nghe nói con cứ hỏi mãi bao giờ mẹ mới về nhà.");
    if (mom) o.push("Mẹ đến thăm, ngồi sau tấm kính, mãi một lúc lâu không nói nên lời.", "Mỗi lần đến thăm, mẹ lại trông già đi một chút.");
    if (dad) o.push("Lần đầu tiên bố đến thăm. Bố chỉ hỏi bạn ăn uống có đầy đủ không, nhưng câu nói ấy đọng lại rất lâu.");
    if (f.married && f.partner && f.partner.alive && !f.partner.divorced && !ptAway()) o.push("Bạn đời đến thăm, trông rất mệt mỏi vì một mình lo toan việc nhà.");
    if (!o.length) o.push("Gia đình đến thăm. Khoảng thời gian ngắn ngủi trôi qua thật nhanh.");
    return { t: pick(o), f: "Những người bị giam giữ được thăm gặp có nguy cơ tái phạm sau khi ra tù thấp hơn 13% (Sở Cải huấn bang Minnesota 2011)" }; } },
  { id: 'pr_novisit', a: [14, 125], prison: 1, c: () => S.flags.visY !== S.age, w: 0.5, rep: 1, gap: 3, run: () => { S.flags.noVisY = S.age; eff({ h: -2 }); const f = S.fam, any = f.married || f.kids.some(k => k.alive) || f.mom.alive || (f.dad.alive && !f.dad.absent);
    return { t: !any ? "Đã mấy tháng liền không ai đến thăm." : parFar() && !f.married ? "Gia đình ở quá xa nên không thể đến thăm. Chỉ có những lá thư qua lại." : S.flags.prK === 'wrong' ? "Dịp lễ Tết này không ai đến thăm. Bạn đã dặn gia đình đừng đến, vì thấy họ đã mệt mỏi với những chuyến đi đường xa." : "Dịp lễ Tết này cũng không ai đến thăm. Với gia đình, tên của bạn vẫn là cái tên khó nói ra.", k: 'bad',
      f: "Ở các nhà tù tiểu bang của Mỹ, chưa đến một phần ba số người được người thân đến thăm dù chỉ một lần trong một tháng (Prison Policy Initiative 2015)" }; } },
  { id: 'pr_appeal', a: [18, 125], prison: 1, c: () => S.flags.prK === 'wrong' && S.flags.wrongVoid == null, w: 1.5, rep: 1, gap: 2, run: () => { eff({ h: -1 });
    return pick(["Bạn làm đơn đề nghị tái thẩm nhưng không được chấp nhận. Dù vậy, bạn vẫn đọc lại hồ sơ vụ án từ đầu.", (S.fam.mom.alive ? "Một lá thư gửi đến: mẹ đã đi khắp xóm xin chữ ký để nộp đơn kiến nghị." : "Một lá thư gửi đến: gia đình đã đi khắp xóm xin chữ ký để nộp đơn kiến nghị."),
      "Một luật sư mới nói sẽ xem lại hồ sơ vụ án. Lần đầu tiên sau nhiều năm, bạn ngủ ngon."]); } },
  { id: 'atonelate', a: [18, 125], c: () => S.flags.atoneTry != null && S.flags.atoned == null && S.age > S.flags.atoneTry && S.job !== 'prison' && atoneWho() && yearRoll('atonelate', 0.3), w: 30, run: () => {
    const w = atoneWho(); S.flags.atoned = S.age; S.flags.atoneK = 'family'; eff({ h: 6, so: 4 });
    return { t: w === 'mom' ? "Sau mấy lần đến vào dịp lễ Tết, lần đầu tiên mẹ bảo bạn vào nhà ăn bữa cơm rồi hẵng về." : w === 'dad' ? "Sau mấy lần đến vào dịp lễ Tết, lần đầu tiên bố mở cửa cho bạn." : "Thời gian trôi qua, gia đình lại coi bạn là người nhà.", k: 'warm' }; } },
  { id: 'street', a: [13, 15], c: () => !AGE12 && S.job === 'childwork' && !S.school && S.urban && (S.q || 3) <= 2 && S.flags.street == null && yearRoll('street', 0.1 * (S.sex === 'M' ? 1 : 0.35)), w: 30, run: () => { S.flags.street = S.age; eff({ so: 2, h: -1 });
    return { t: (S.sex === 'M' ? "Bạn bắt đầu tụ tập với mấy anh lớn trong xóm không đi học." : "Bạn bắt đầu tụ tập với mấy chị lớn trong xóm không đi học.") + ' ' + L`밤늦게 들어오는 날이 늘었고, ${parW()}의 한숨도 늘었습니다.`, k: 'bad' }; } },
  { id: 'streetout', a: [14, 19], c: () => S.flags.street != null && S.flags.streetOut == null && S.age > S.flags.street && S.job !== 'prison' && yearRoll('streetout', 0.3), w: 30, run: () => { S.flags.streetOut = S.age; eff({ h: 4, so: 2 });
    return { t: pick(["Chủ phòng tập trong xóm ngỏ ý dạy bạn tập luyện và giữ bạn lại bên mình. Dần dần bạn xa nhóm ấy.", "Bạn gặp một thầy cô ở trung tâm hỗ trợ trẻ em không đi học. Tối nào bạn cũng ghé qua đó.", "Chú chủ cửa hàng trong xóm ngỏ ý dạy nghề và giao cho bạn việc ở cửa hàng. Thời gian tụ tập với nhóm ấy ít dần."]), k: 'warm',
      f: "Thanh thiếu niên có người cố vấn ít có khả năng bắt đầu sử dụng ma túy hơn 46%, và ít có khả năng đánh người khác hơn khoảng một phần ba (nghiên cứu Big Brothers Big Sisters, Tierney và cộng sự 1995)" }; } },
  { id: 'pr_learn', a: [14, 125], prison: 1, w: 0.8, run: () => { eff({ sm: 4, h: 2 }); return pick(["Bạn được học nghề trong nhà tù.", "Bạn bắt đầu mượn sách ở thư viện nhà tù để đọc."]); } },
  { id: 'pr_work', a: [14, 125], prison: 1, w: 0.7, rep: 1, gap: 2, run: () => { eff({ h: -1 }); return pick(["Bạn làm việc ở xưởng lao động trong nhà tù. Tiền công cả ngày còn không bằng một giờ làm việc ở bên ngoài.", "Bạn được làm việc ở bếp của nhà tù. Ngày trôi qua nhanh hơn một chút."]); } },
  { id: 'pr_letter', a: [14, 125], prison: 1, w: 0.6, rep: 1, gap: 2, run: () => { eff({ so: 2, h: 1 }); return pick(["Bạn viết cho gia đình một lá thư dài, rồi đếm từng ngày chờ hồi âm.", "Đêm nào bạn cũng ghi vào sổ những điều muốn làm khi ra ngoài."]); } },
  { id: 'pr_school', a: [16, 60], prison: 1, c: () => S.edu < 3 && !S.flags.prSchool, w: 0.6, run: () => { S.flags.prSchool = 1; S.edu = Math.max(S.edu, 3); S.flags.reoffK = 0.6; eff({ sm: 5, h: 4 }); return { t: "Bạn học trong nhà tù và thi đỗ kỳ thi tương đương bằng trung học phổ thông.", k: 'big', f: "Người tham gia học tập trong nhà tù có khả năng quay lại nhà tù thấp hơn khoảng 40% (RAND 2013)" }; } },
  { id: 'pr_friend', a: [14, 125], prison: 1, w: 0.6, run: () => { eff({ so: 2 }); return "Bạn và người cùng phòng giam chia sẻ chuyện đời của nhau và trở nên thân thiết."; } },
  { id: 'pr_hard', a: [14, 125], prison: 1, w: 0.8, rep: 1, gap: 2, run: () => { eff({ h: -3, hl: -2 }); return { t: pick(["Nhiều đêm bạn trằn trọc không ngủ được trong phòng giam chật hẹp.", "Bạn chỉ có thể nhìn bốn mùa thay đổi bên ngoài qua song sắt."]), k: 'bad' }; } },
  { id: 'pol_visit', a: [14, 125], prison: 1, c: () => !!S.flags.polPr, w: 1, rep: 1, gap: 2, run: () => { eff({ so: 3, h: 2 }); return S.fam.mom.alive && !parFar() ? "Mẹ đến thăm, ngồi sau tấm kính, chỉ mong bạn ra ngoài lành lặn." : "Các em khóa dưới ở trường đến thăm và kể cho bạn nghe tin tức bên ngoài."; } },
  { id: 'pol_letter', a: [14, 125], prison: 1, c: () => !!S.flags.polPr, w: 0.7, rep: 1, gap: 2, run: () => { eff({ so: 2 }); return "Những lá thư bạn bè gửi qua kiểm duyệt, đến tay bạn với vài dòng bị bôi đen."; } },
  { id: 'pk_work', a: [14, 125], prison: 'nk', w: 1, rep: 1, run: () => { eff({ hl: -2, h: -2 }); return { t: pick(["Từ tờ mờ sáng, bạn bị giải ra bãi đốn gỗ làm việc. Khẩu phần ăn lúc nào cũng thiếu.", "Bạn khuân đá ở mỏ đá suốt cả ngày.", "Tối nào bạn cũng phải nhận lỗi trong buổi sinh hoạt tự phê bình."]), k: 'bad', f: "Những người bị trả về Triều Tiên phải lao động cưỡng bức trong các trại rèn luyện lao động hoặc trại cải tạo (Ủy ban Điều tra của Liên Hợp Quốc về nhân quyền Triều Tiên, 2014)" }; } },
  { id: 'pk_hard', a: [14, 125], prison: 'nk', w: 0.8, rep: 1, gap: 2, run: () => { eff({ h: -3, hl: -2 }); return { t: pick(["Bạn đã chứng kiến một người cùng phòng gục xuống vì đói và bệnh.", "Bạn chịu đựng qua mùa đông chỉ với một bộ quần áo mỏng."]), k: 'bad' }; } },
  { id: 'pk_visit', a: [14, 125], prison: 'nk', c: () => S.fam.mom.alive || S.fam.married, w: 0.6, run: () => { eff({ so: 3, h: 2 }); return "Gia đình đã đi một chặng đường xa để gửi vào cho bạn một bao bột ngô."; } },
  { id: 'layoff', a: [20, 62], c: () => isWorking() && S.job !== 'owner' && S.job !== 'shelter' && S.job !== 'musician' && S.job !== 'artist' && S.job !== 'actor' && S.job !== 'dancer' && S.job !== 'boardpro' && S.job !== 'progamer' && S.job !== 'clergy' && !RARE_JOBS.includes(S.job) && !JOBS[S.job].s.startsWith('agr') && S.jobY >= 2 && yearRoll('layoff', layoffP(S.job)), w: 40, run: () => {
      if (LAYOFF_MOVE[S.job]) { S.jobY = 0; S.money -= S.income * 0.15; eff({ h: -4 }); return { t: LAYOFF_MOVE[S.job], k: 'bad' }; }
      const t = (STATE_J.has(S.job) ? null : eraLayText()) || (S.formal && LAYOFF_TF[S.job]) || LAYOFF_T[S.job] || "Bạn bị mất việc."; S.job = 'seeking'; eff({ h: -10 }); return { t, k: 'bad' }; } },
  { id: 'harvest', a: [16, 80], c: () => ['farm', 'agbiz', 'farmhand'].includes(S.job), w: 1.5, rep: 1, run: () => { const good = chance(0.55); S.money += (good ? 0.15 : -0.1) * Math.max(S.income, 500); eff({ h: good ? 4 : -4 }); return good ? "Năm nay được mùa." : { t: "Trời quá ít mưa, mùa màng giảm sút.", k: 'bad' }; } },
  { id: 'bonus', a: [22, 64], c: () => isWorking() && S.formal && yearRoll('bonus', 0.06), w: 0.6, gap: 6, run: () => { const x = S.income * 0.1; S.money += x; eff({ h: 3 }); return L`예상치 못한 보너스를 받았습니다. (+${wonStr(x)})`; } },
  { id: 'expense', a: [20, 90], c: () => expenseOpts().length > 0, w: 0.8, rep: 1, run: () => { const [k, t] = pick(expenseOpts()); const first = S.flags['exp_' + k] == null; S.flags['exp_' + k] = S.age; S.flags.expK = k;
      if (k === 'appl' && atParents() && S.income > 0) { queue(Math.min(0.97, S.t + 0.01), 'dec', 'applpar', { it: chance(0.5) ? 'f' : 'w' }); return null; }
      if (k === 'funeral' && giftK() === 0) return giftSkip(kinFar() ? "Nghe tin một người họ hàng ở quê qua đời, bạn gửi lời chia buồn từ nơi xa." : "Bạn đến dự đám tang một người họ hàng, phụ giúp việc nhà đám và bày tỏ lòng thành.");
      const x = expenseCost(k) * (k === 'funeral' ? giftK() : 1), m0 = S.money; S.money -= x;
      const hard = (m0 >= 0 && S.money < 0) || debtHeavy();
      return first || hard ? { t: `${t} (−${wonStr(x)})`, k: hard ? 'bad' : 'ev' } : null; } },
  { id: 'fight', a: [17, 60], c: () => lawOK() && yearRoll('fight', fightP()), w: 30, rep: 1, gap: 4, run: () => fightRun() },
  { id: 'teenbad', a: [13, 18], c: () => !AGE12 && S.job !== 'prison' && (S.flags.teenBad || 0) < 2 && (S.flags.teenBadAt == null || S.age - S.flags.teenBadAt >= 2) && yearRoll('teenbad', teenP()), w: 30, rep: 1, gap: 2, run: () => teenRun() },
  { id: 'kidbad', a: [26, 80], c: () => { if (AGE12) return false; const k = kidFor(13, 18, 'fbad'); return !!k && yearRoll('kidbad', 0.025 * (k.sex === 'M' ? 1 : 0.4) * kinFam()); }, w: 30, rep: 1, gap: 2, run: () => {
    const k = kidFor(13, 18, 'fbad'); k.fbad = 1; k.bd = (k.bd || 0) - 1; const n = callName(k.name); eff({ h: -4 });
    return { t: pick([L`경찰서에서 전화가 왔습니다. ${iga(n)} 친구들과 가게에서 물건을 훔치다 붙잡혔다고 했습니다. ${eul(n)} 데리고 가게 주인께 함께 사과하러 갔습니다.`,
      L`${iga(n)} 친구들과 밤늦게 낙서를 하다 붙잡혔습니다. 경찰서 복도에서 ${eul(n)} 기다리며 어디서부터 잘못됐는지 생각했습니다. 집에 오는 길에 야단 대신 오래 이야기를 나눴습니다.`]),
      k: 'bad', f: "Ở Anh, trong số nam giới sinh năm 1953, 20% đã bị kết án trước tuổi 20, nhưng chỉ 3% bị kết án lần đầu trong khoảng từ 30 đến 40 tuổi (Bộ Nội vụ Anh)" }; } },
  { id: 'needtheft', a: [16, 80], c: () => lawOK() && needHard() && (S.flags.ntAt == null || S.age - S.flags.ntAt >= 6) && yearRoll('needtheft', 0.04 * Math.sqrt(crimeBg())), w: 30, rep: 1, gap: 6, run: () => {
    S.flags.ntAt = S.age; const t = "Đã mấy ngày liền bạn không được ăn uống tử tế. Trong siêu thị, bạn bỏ bánh mì và sữa vào túi.", r = rnd(); eff({ h: -4, so: -2 });
    if (r < 0.25) return { t: t + ' ' + "Không ai nhìn thấy. Đêm đó, miếng bánh mì ấy nuốt mãi không trôi.", k: 'bad' };
    if (r < 0.55) { recAdd({ k: 'theft', s: 'warn' }); return { t: t + ' ' + "Bạn bị nhân viên giữ lại, nhưng người chủ nghe hoàn cảnh của bạn, không gọi cảnh sát mà chỉ lấy tiền hàng rồi để bạn đi. Mỗi lần đi ngang cửa hàng ấy, bạn đều cúi đầu.", k: 'bad' }; }
    if (r < 0.8) { recAdd({ k: 'theft', s: 'warn' }); return { t: t + ' ' + "Bạn bị nhân viên giữ lại và đưa đến đồn cảnh sát. Khi bạn kể hoàn cảnh, mọi chuyện kết thúc bằng một lời cảnh cáo thay vì hình phạt, và viên cảnh sát phụ trách dặn bạn đừng nhịn bữa, rồi ghi lại cho bạn địa chỉ những nơi có thể giúp đỡ.", k: 'bad' }; }
    return { t: t + ' ' + "Bạn bị nhân viên giữ lại, và sự việc đưa ra đến tòa." + ' ' + sentence('theft'), k: 'bad' }; } },
  { id: 'pp_v', a: [2, 18], c: () => !AGE12 && (parInPr('dad') || parInPr('mom')) && yearRoll('pp_v', 0.6), w: 30, rep: 1, gap: 1, run: () => {
    const w = parInPr('dad') ? 'dad' : 'mom', P = w === 'dad' ? "bố" : "mẹ", o = S.fam[w]; o.bd = (o.bd || 0) + 1; eff({ h: 1 });
    return { t: S.age < 10 ? L`${eul(P)} 만나러 교도소에 갔습니다. 유리창 너머 ${eun(P)} 웃으려고 애썼고, 나는 그 유리에 손바닥을 댔습니다.`
      : pick([L`한 달에 한 번 ${eul(P)} 만나러 갔습니다. 30분은 금방 지나갔습니다.`, L`${P}에게서 편지가 왔습니다. 맞춤법이 틀린 곳이 몇 군데 있었지만, 몇 번이고 다시 읽었습니다.`]), k: 'ev' }; } },
  { id: 'pp_ask', a: [7, 18], c: () => !AGE12 && (parInPr('dad') || parInPr('mom')) && !S.flags.ppAsk && yearRoll('pp_ask', 0.5), w: 30, run: () => {
    S.flags.ppAsk = 1; const P = parInPr('dad') ? "bố" : "mẹ"; eff({ h: -2 });
    return { t: S.school ? L`친구가 ${eun(P)} 왜 학교 행사에 안 오시느냐고 물었습니다. 멀리 일하러 가셨다고 대답했습니다.` : L`동네 친구가 ${eun(P)} 요즘 왜 안 보이시느냐고 물었습니다. 멀리 일하러 가셨다고 대답했습니다.`, k: 'bad', f: "Ở Hàn Quốc, trong số con cái của người đang thụ án, 30% biết bố hoặc mẹ mình đang bị giam giữ (Ủy ban Nhân quyền Quốc gia Hàn Quốc, 2017)" }; } },
  { id: 'sibpr_v', a: [10, 85], c: () => !AGE12 && !!sibInPr() && !farKin() && S.job !== 'prison' && yearRoll('sibpr_v', 0.45), w: 30, rep: 1, gap: 2, run: () => {
    const p = sibInPr(), par = S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent); eff({ so: 1 });
    return pick([L`${eul(p.w)} 면회하러 갔습니다. 유리창 너머에서 ${iga(p.w)} 먼저 웃어 보였습니다.`, S.flags.illit ? L`${p.w}에게 보낼 편지를 불러 주고 가족이 받아 적었습니다. 바깥 소식을 이것저것 말하다 보니 세 장이 되었습니다.` : L`${p.w}에게 편지를 썼습니다. 바깥 소식을 이것저것 적다 보니 세 장이 되었습니다.`].concat(par ? [L`${eul(parW())} 모시고 ${p.w}의 면회를 다녀왔습니다. 돌아오는 길에 아무도 말이 없었습니다.`] : [])); } },
  { id: 'kidpr_v', a: [36, 110], c: () => !AGE12 && S.fam.kids.some(kidInPr) && S.job !== 'prison' && yearRoll('kidpr_v', 0.6), w: 30, rep: 1, gap: 1, run: () => {
    const k = S.fam.kids.find(kidInPr), n = callName(k.name); k.bd = (k.bd || 0) + 1; eff({ h: -1 });
    return { t: pick([L`${eul(n)} 면회하러 갔습니다. 해 줄 수 있는 것이 많지 않아, 영치금만 넣고 돌아왔습니다.`, L`${n}에게서 편지가 왔습니다. 안에서 공부를 다시 시작했다고 했습니다.`, L`면회실 유리창 너머 ${iga(n)} 많이 야위어 있었습니다. 밥은 잘 먹느냐는 말밖에 하지 못했습니다.`]),
      f: "Những người bị giam giữ được thăm gặp có nguy cơ tái phạm sau khi ra tù thấp hơn 13% (Sở Cải huấn bang Minnesota 2011)" }; } },
  { id: 'theft', a: [16, 80], c: () => { const c = studyAway() ? CBY[S.flags.studyAbroad] || C() : C(); return S.urban && (S.flags.lastTheft == null || S.age - S.flags.lastTheft >= 3) && yearRoll('theft', clamp(0.025 + 0.002 * (c.hom || 0), 0.025, 0.07)); }, w: 6, run: () => {
      const c = studyAway() ? CBY[S.flags.studyAbroad] || C() : C(), safe = (c.hom || 0) < 1.5;
      S.flags.lastTheft = S.age; S.money -= Math.max(S.income, 300) * 0.04; eff({ h: -3 });
      if (safe && S.owns.bike && chance(0.4)) { delete S.owns.bike; return { t: "Chiếc xe đạp bạn dựng tạm một lát đã bị lấy mất.", k: 'bad' }; }
      const home = careNow() ? [] : ["Nhà bạn bị trộm đột nhập."];
      const phone = S.owns.phone || S.owns.cell, bus = wayOf() === 'transit' || !!studyAway(), car = S.owns.car ? ["Kính chiếc xe bạn đỗ bị đập vỡ, chiếc túi để bên trong đã biến mất."] : [];
      return { t: pick(safe ? [...home, "Chiếc túi bạn để quên ở quán cà phê đã biến mất.", ...car]
        : ["Bạn bị móc mất ví trên một con phố đông người.", phone ? (bus ? "Bạn bị trộm mất điện thoại trên một chuyến xe buýt đông người." : "Bạn bị trộm mất điện thoại ở một khu chợ đông người.") : "Bạn bị móc mất ví ở chợ.", ...car, ...home]), k: 'bad' }; } },
  { id: 'wedding', a: [13, 50], c: () => { const m = afmF(C()); return S.age >= m - 4 && S.age <= m + 9; }, w: 0.5, rep: 1, gap: 3, run: () => {
      const gk = giftK();
      if (gk === 0 && S.age >= 16) return giftSkip("Bạn đến dự đám cưới của một người bạn và gửi lời chúc phúc thay cho tiền mừng.");
      eff({ so: gk < 1 ? 2 : 3, h: 2 });
      if (S.money < 0 || S.income <= 0 || S.age < 16 || ddKept()) return varied('wed0', ["Bạn đến dự đám cưới của một người bạn và phụ giúp nấu nướng.", "Ở đám cưới của một người bạn, bạn nhảy múa chúc mừng đến tận khuya."]);
      const md = med(), x = md * 0.008 * clamp(Math.pow(Math.max(S.income, 1) / md, 0.3), 0.6, 1.8) * gk; S.money -= x;
      return varied('wed', [L`친구의 결혼식에 다녀왔습니다. (−${wonStr(x)})`].concat(aloneAbroad() ? [] : [L`오랜 친구의 결혼식에서 축하 인사를 건넸습니다. (−${wonStr(x)})`]));
    } },
  { id: 'reunion', a: [25, 80], c: () => oldFrHere() && !aloneAbroad(), w: 0.6, rep: 1, gap: 5, run: () => { eff({ so: 4, h: 3 }); return "Bạn gặp lại những người bạn cũ và trò chuyện suốt đêm."; } },
  { id: 'overwork', a: [22, 64], c: () => S.focus === 'work' && isWorking(), w: 2, rep: 1, run: () => { eff({ hl: -4, h: -2 });
      return { t: S.job === 'athlete' ? "Tập luyện và thi đấu liên tục không ngơi nghỉ khiến bạn kiệt sức." : RARE_JOBS.includes(S.job) ? "Lịch trình dày đặc không ngơi nghỉ khiến bạn kiệt sức."
        : SELF_JOBS.includes(S.job) ? "Ngày nào cũng làm từ sáng sớm đến tối mịt khiến bạn kiệt sức." : "Tăng ca triền miên khiến bạn kiệt sức.", k: 'bad' }; } },
  { id: 'commute', a: [20, 64], c: () => S.urban && isWorking() && CITIES[S.cur] && !nearWork() && !homeWork() && !S.flags.hideCN, w: 0.5, gap: 5, run: () => {
      const m = commuteMin(), d = minStr(m), w = wayOf(), N = S.flags.near, wk = workKey(), city = S.city || "thành phố";
      if (N && N.city === S.city && S.flags.nearX !== wk && (S.jobY || 0) <= 2 && m >= 60) { S.flags.nearX = wk; return L`일을 옮기고 나니 직장이 다시 멀어져, 출퇴근에 하루 ${d}이 걸립니다.`; }
      if (S.house > 0 && !S.flags.commuteHome && typeof S.owns.house === 'number' && S.age - S.owns.house <= 3 && m >= 90) { S.flags.commuteHome = 1; return L`내 집은 마련했지만 직장과 멀어, 출퇴근에 하루 ${d}이 걸립니다.`; }
      if (m <= 40) return L`직장이 멀지 않아 출퇴근은 하루 ${d}이면 됩니다.`;
      return varied('commute', [w === 'walk' ? L`${city}의 출퇴근길은 하루 ${d}이 걸립니다.` : L`${city}의 출퇴근길은 ${ro(wayName())} 하루 ${d}이 걸립니다.`,
        m >= 90 ? L`출퇴근에 하루 ${d}을 씁니다. 하루의 적지 않은 시간이 오가는 길에서 지나갑니다.` : L`출퇴근에 하루 ${d}을 씁니다.`].concat(m >= 90 && w !== 'walk' && w !== 'bike' ? [L`꽉 막힌 출근길에서 하루 ${d}을 보냅니다.`] : []));
    } },
  { id: 'flu', a: [5, 100], c: () => (S.flags.lastFlu == null || S.age - S.flags.lastFlu >= 8) && yearRoll('flu', 0.4), w: 0.2, run: () => { S.flags.lastFlu = S.age; eff({ hl: -3 }); return pick(["Bạn bị cúm, ốm mất một tuần.", "Một trận cảm nặng khiến bạn nằm liệt giường mấy ngày."]); } },
  { id: 'givedrive', a: [75, 105], c: () => !!S.owns.car && yearRoll('drive', (0.015 + (S.age - 75) * 0.008) * (S.st.hl < 45 ? 1.6 : 1) * (disOn() && S.dis.k === 'sight' ? 2 : 1)), w: 30, run: () => {
      const v = carValue(); delete S.owns.car; S.money += v; S.flags.soldCar = S.age; eff({ h: -1 });
      return ['KOR', 'JPN'].includes(S.cur) ? L`운전이 점점 부담스러워져 운전면허를 반납하고 자동차를 팔았습니다. ${wonStr(v)}이 손에 남았습니다.` : L`운전이 점점 부담스러워져 운전대를 내려놓고 자동차를 팔았습니다. ${wonStr(v)}이 손에 남았습니다.`; } },
  { id: 'back', a: [25, 90], c: () => !S.flags.back && yearRoll('back', 0.025 * (DIS_WORK[S.job] || JOBS[S.job] && JOBS[S.job].s === 'agr' ? 1.8 : 1) * (S.st.hl < 50 ? 1.4 : 1) * (S.age >= 45 ? 1.4 : 1)), w: 30, run: () => { S.flags.back = 1; eff({ hl: -3 });
      return DIS_WORK[S.job] || (JOBS[S.job] && JOBS[S.job].s === 'agr') ? "Từ lần bê vật nặng bị trẹo lưng, bạn bắt đầu bị đau lưng." : "Bạn bắt đầu bị đau lưng."; } },
  { id: 'accident', a: [10, 80], c: () => (S.flags.lastAcc == null || S.age - S.flags.lastAcc >= 8) && yearRoll('acc', C().road * 0.00015 * (S.owns.moto ? 2.5 : 1) * (['driver', 'delivery'].includes(S.job) ? 2 : 1) * (S.age >= 15 && S.age < 30 ? 1.4 : 1)), w: 40, run: () => {
      eff({ hl: -8 }); S.flags.lastAcc = S.age;
      if (!S.dis && S.age >= 6 && chance(0.06)) { disGet(chance(0.85) ? 'move' : 'sight', 'acc'); return null; }
      const opts = ["Bạn bị xe ô tô đâm khi đang băng qua đường và bị thương ở chân. Bạn phải chống nạng mấy tháng trời."]; if (!S.owns.car) opts.push("Chiếc xe buýt bạn đang đi gặp tai nạn, và bạn bị thương nặng.");
      if (S.owns.moto || ['driver', 'delivery'].includes(S.job)) opts.push("Bạn ngã xe máy và bị thương nặng.", "Xe máy trượt trên đường mưa, bạn bị gãy tay.", "Đang đi xe máy, bạn va chạm với một chiếc xe tải và bị thương nặng.");
      if (S.owns.car) opts.push("Bạn gặp tai nạn giao thông khi đang lái xe và phải nằm viện mấy tuần.", "Một chiếc xe vượt đèn đỏ đâm thẳng vào xe bạn.");
      if (['eap', 'sa', 'ssa'].includes(C().p) && !S.owns.car && !S.owns.moto && !S.flags.noMoto && S.age >= 16) opts.push("Bạn bị thương nặng trong một vụ tai nạn khi đi xe ôm.");
      if (S.owns.bike && S.age < 75 && !(disOn() && S.dis.k !== 'hear')) opts.push("Đang đạp xe thì bạn bị một chiếc ô tô va phải và bị thương.");
      return { t: pick(opts), k: 'bad', f: L`${C().ko}의 도로 교통사고 사망률: 인구 10만 명당 약 ${C().road}명 (WHO 추정)` };
    } },
  { id: 'dis_sign', a: [2, 6], c: () => disOn() && S.dis.k === 'hear' && S.dis.aid && !S.flags.disSign, w: 2, run: () => { S.flags.disSign = 1; eff({ h: 3, so: 2 }); return { t: "Lần đầu tiên bạn dùng tay để nói “mẹ”. Cả nhà cùng học ngôn ngữ ký hiệu theo bạn.", k: 'warm' }; } },
  { id: 'cp_life', a: [6, 85], c: () => disOn() && !!S.dis.cpT && (S.dis.cpN || 0) < 2 && S.job !== 'prison' && yearRoll('cpl', 0.08), w: 30, rep: 1, gap: 8, run: () => { S.dis.cpN = (S.dis.cpN || 0) + 1; eff({ h: 1 }); return { t: varied('cpl', CP_LIFE()[S.dis.cpT]), k: 'ev' }; } },
  { id: 'dis_play', a: [5, 12], c: () => disOn() && S.dis.k === 'move' && S.dis.wc && S.dis.aid && !S.flags.disPlay, w: 0.8, run: () => { S.flags.disPlay = 1; eff({ h: 3, so: 2 }); return { t: "Bạn lăn xe lăn băng qua sân trường, chơi đuổi bắt cùng các bạn.", k: 'warm' }; } },
  { id: 'dis_braille', a: [6, 14], c: () => disOn() && S.dis.k === 'sight' && S.dis.aid && S.school && !S.flags.disBraille, w: 1, run: () => { S.flags.disBraille = 1; eff({ h: 3, sm: 2 }); return { t: "Lần đầu tiên bạn tự mình đọc hết một cuốn sách chữ nổi.", k: 'warm' }; } },
  { id: 'dis_friend', a: [6, 17], c: () => disOn() && S.school && !S.flags.disFriend, w: 0.8, run: () => { S.flags.disFriend = 1; eff({ so: 4, h: 2 }); return { t: S.dis.k === 'hear' ? (S.dis.aid ? "Người bạn thân nhất bắt đầu học ngôn ngữ ký hiệu để có thể trò chuyện với bạn." : "Người bạn thân nhất cùng bạn đặt ra từng cử chỉ tay chỉ hai người hiểu, để có thể trò chuyện với nhau.") : "Mỗi lần cả lớp chuyển sang phòng khác, một bạn cùng lớp lại đi cùng bạn.", k: 'warm' }; } },
  { id: 'dis_class', a: [7, 16], c: () => disOn() && S.dis.k === 'hear' && !S.dis.aid && S.school && !S.flags.disClass, w: 0.8, run: () => { S.flags.disClass = 1; eff({ h: -2 }); return { t: "Không nghe được lời thầy cô, bạn tự theo kịp bài học bằng cách nhìn bảng và vở của bạn ngồi cạnh.", k: 'bad', f: S.cur === 'PRK' ? "Ở Triều Tiên, theo các nguồn tin, chỉ khoảng 2% trẻ khiếm thính được học ở trường dành cho người khiếm thính (CBS News)" : "Đất nước càng nghèo, trẻ không nghe được càng hiếm khi được đến trường (WHO)" }; } },
  { id: 'dis_tease', a: [6, 16], c: () => disOn() && S.school && !S.flags.disTease, w: 0.5, run: () => { S.flags.disTease = 1; eff({ h: -3 }); return { t: "Có những đứa trẻ trêu chọc bạn. Cô giáo đã nói chuyện rất lâu với cả lớp.", k: 'bad', f: "Trẻ em khuyết tật có khả năng cảm thấy mình bị phân biệt đối xử cao hơn 41% (UNICEF 2021)" }; } },
  { id: 'dis_stairs', a: [12, 100], c: () => disOn() && S.dis.k === 'move', w: 0.4, gap: 10, run: () => { eff({ h: -2 }); return { t: "Cửa hàng bạn muốn ghé chỉ có bậc thềm ở lối vào, nên bạn đành quay về.", k: 'bad' }; } },
  { id: 'dis_lift', a: [12, 100], c: () => disOn() && S.dis.k === 'move' && S.urban && C().ppp > 15000 && calYr() >= 2000 && !S.flags.disLift, w: 0.5, run: () => { S.flags.disLift = 1; eff({ h: 3 }); return { t: "Ga tàu điện gần nhà đã có thang máy. Những nơi bạn có thể tự mình đến được nhiều thêm.", k: 'warm' }; } },
  { id: 'dis_screen', a: [14, 100], c: () => disOn() && S.dis.k === 'sight' && C().net >= 40 && calYr() >= 2005 && !S.flags.disScreen, w: 0.6, run: () => { S.flags.disScreen = 1; eff({ h: 3, sm: 1 }); return { t: "Nhờ phần mềm đọc màn hình, bạn có thể tự mình làm các việc ở ngân hàng.", k: 'warm' }; } },
  { id: 'dis_caption', a: [10, 100], c: () => disOn() && S.dis.k === 'hear' && C().net >= 40 && calYr() >= 2010 && !S.flags.disCap, w: 0.6, run: () => { S.flags.disCap = 1; eff({ h: 3, so: 1 }); return { t: "Video bắt đầu có phụ đề, nên bạn đã có thể cùng bạn bè xem chung một đoạn phim và cùng cười.", k: 'warm' }; } },
  { id: 'dis_club', a: [16, 80], c: () => disOn() && S.dis.aid, w: 0.4, gap: 12, run: () => { eff({ so: 4, h: 3 }); return { t: S.dis.k === 'move' ? (S.dis.wc ? "Bạn bắt đầu tham gia một câu lạc bộ bóng rổ xe lăn. Bữa cơm sau khi đổ mồ hôi ngon tuyệt." : "Bạn bắt đầu tham gia một câu lạc bộ bơi dành cho người khuyết tật. Dưới nước, cơ thể bạn thấy nhẹ bẫng.") : S.dis.k === 'sight' ? "Cùng nắm sợi dây nối với người chạy dẫn đường, bạn đã chạy hết một cuộc thi marathon." : "Ở một hội người Điếc, bạn trò chuyện bằng ngôn ngữ ký hiệu đến tận khuya.", k: 'warm' }; } },
  { id: 'dis_ask', a: [14, 100], c: () => disOn(), w: 0.3, gap: 12, run: () => { eff({ h: 2 }); return { t: S.dis.k === 'move' ? "Bạn biết ơn một người đã hỏi trước xem bạn có cần giúp không, thay vì cứ thế giúp ngay." : S.dis.k === 'sight' ? "Bạn biết ơn một người đã hỏi trước xem bạn có muốn khoác tay họ để qua đường không." : "Bạn biết ơn một người đã nói chậm rãi để bạn nhìn thấy khẩu hình miệng.", k: 'warm' }; } },
  { id: 'dis_hire', a: [18, 60], c: () => disOn() && S.job === 'seeking' && !wdOn(), w: 0.8, gap: 6, run: () => { eff({ h: -3 }); return { t: "Khi chuyện khuyết tật của bạn được nhắc đến trong buổi phỏng vấn, không khí thay đổi hẳn. Họ không bao giờ liên lạc lại.", k: 'bad', f: "Tỷ lệ có việc làm của người khuyết tật khoảng 27%, chưa bằng một nửa so với người không khuyết tật (56%) (UN DESA 2024)" }; } },
  { id: 'dis_work', a: [20, 64], c: () => disOn() && isWorking() && !S.flags.disWork, w: 0.5, run: () => { S.flags.disWork = 1; eff({ h: 3, so: 2 });
      if (SELF_JOBS.includes(S.job)) return { t: S.dis.k === 'move' ? "Bạn tự sửa độ cao và lối đi lại ở chỗ làm cho hợp với cơ thể mình." : S.dis.k === 'sight' ? "Bạn gắn lên mỗi món đồ dùng để làm việc một dấu hiệu có thể nhận ra bằng tay." : "Với những người gặp trong công việc, bạn học cách viết ra để trao đổi.", k: 'warm' };
      return { t: S.dis.k === 'move' ? "Nơi làm việc đã điều chỉnh độ cao bàn và lối đi lại cho phù hợp với bạn." : S.dis.k === 'sight' ? "Đồng nghiệp gửi trước cho bạn tài liệu dưới dạng tệp bạn có thể đọc được." : "Đồng nghiệp ghi lại nội dung cuộc họp thành văn bản rồi đưa cho bạn.", k: 'warm' }; } },
  { id: 'dis_kid', a: [24, 70], c: () => disOn() && (S.dis.k !== 'hear' || S.dis.aid) && !S.flags.disKid && S.fam.kids.some(k => k.alive && !k.away && S.age - k.bornAt >= 3 && S.age - k.bornAt <= 9), w: 0.6, run: () => { S.flags.disKid = 1; eff({ h: 4, so: 2 });
      return { t: S.dis.k === 'move' ? (S.dis.wc ? "Con hớn hở chạy đến, đòi đẩy xe lăn cho bạn." : "Con đi chậm lại cho vừa bước chân của bạn.") : S.dis.k === 'sight' ? "Con mở cuốn sách tranh ra và kể cho bạn nghe từng bức tranh một." : (S.sex === 'F' ? "Con biết ra dấu “mẹ” trước cả khi biết nói." : "Con biết ra dấu “bố” trước cả khi biết nói."), k: 'warm' }; } },
  { id: 'kc_night', a: [16, 60], c: () => !!kidFor(0, 0, 'f0') && yearRoll('kc0', 0.4), w: 30, run: () => { const k = kidFor(0, 0, 'f0'), t = kidTwin(k, 'f0'); k.f0 = 1; eff({ hl: -1, h: -1 });
      if (t) { t.f0 = 1; return L`밤새 번갈아 우는 쌍둥이 ${wa(callName(k.name))} ${eul(callName(t.name))} 안고 집 안을 서성였습니다. 해가 뜰 무렵에야 모두 잠들었습니다.`; }
      return L`밤새 우는 ${eul(callName(k.name))} 안고 집 안을 서성였습니다. 해가 뜰 무렵에야 둘 다 잠들었습니다.`; } },
  { id: 'kc_word', a: [16, 60], c: () => !!kidFor(1, 2, 'f1') && yearRoll('kc1', 0.45), w: 30, run: () => { const k = kidFor(1, 2, 'f1'), t = kidTwin(k, 'f1'); k.f1 = 1; eff({ h: 4 });
      if (disOn() && S.dis.k === 'hear') { const again = S.flags.disKid; S.flags.disKid = 1;
        if (again) { if (t) { t.f1 = 1; return meSex() === 'F' ? L`쌍둥이 ${wa(callName(k.name))} ${callName(t.name)}도 며칠 사이로 처음 손으로 '엄마'를 불렀습니다.` : L`쌍둥이 ${wa(callName(k.name))} ${callName(t.name)}도 며칠 사이로 처음 손으로 '아빠'를 불렀습니다.`; }
          return meSex() === 'F' ? L`${callName(k.name)}도 처음으로 손으로 '엄마'를 불렀습니다.` : L`${callName(k.name)}도 처음으로 손으로 '아빠'를 불렀습니다.`; }
        if (t) { t.f1 = 1; return meSex() === 'F' ? L`쌍둥이 ${wa(callName(k.name))} ${iga(callName(t.name))} 며칠 사이로 처음 손으로 '엄마'를 불렀습니다. 수어였습니다.` : L`쌍둥이 ${wa(callName(k.name))} ${iga(callName(t.name))} 며칠 사이로 처음 손으로 '아빠'를 불렀습니다. 수어였습니다.`; }
        return meSex() === 'F' ? L`${iga(callName(k.name))} 처음으로 손으로 '엄마'를 불렀습니다. 말보다 수어가 먼저였습니다.` : L`${iga(callName(k.name))} 처음으로 손으로 '아빠'를 불렀습니다. 말보다 수어가 먼저였습니다.`; }
      if (t) { t.f1 = 1; return meSex() === 'F' ? L`쌍둥이 ${wa(callName(k.name))} ${iga(callName(t.name))} 며칠 사이로 처음 '엄마'라고 불렀습니다.` : L`쌍둥이 ${wa(callName(k.name))} ${iga(callName(t.name))} 며칠 사이로 처음 '아빠'라고 불렀습니다.`; }
      return meSex() === 'F' ? L`${iga(callName(k.name))} 처음으로 '엄마'라고 불렀습니다.` : L`${iga(callName(k.name))} 처음으로 '아빠'라고 불렀습니다.`; } },
  { id: 'kc_draw', a: [18, 65], c: () => !!kidFor(4, 7, 'f2') && yearRoll('kc2', 0.3), w: 30, run: () => { const k = kidFor(4, 7, 'f2'); k.f2 = 1; eff({ h: 3, so: 1 }); return L`${iga(callName(k.name))} 그려 준 가족 그림을 냉장고에 붙였습니다. 모두 활짝 웃고 있었습니다.`; } },
  { id: 'kc_sports', a: [20, 70], c: () => !!kidFor(7, 12, 'f3') && yearRoll('kc3', 0.25), w: 30, run: () => { const k = kidFor(7, 12, 'f3'), t = kidTwin(k, 'f3'); k.f3 = 1; eff({ h: 3, so: 1 });
      if (t) { t.f3 = 1; return L`쌍둥이 ${wa(callName(k.name))} ${callName(t.name)}의 운동회에 갔습니다. 둘이 나란히 달리는 모습에 목이 쉬도록 응원했습니다.`; }
      return L`${callName(k.name)}의 운동회에 갔습니다. 넘어졌다 일어나 끝까지 달리는 모습에 목이 쉬도록 응원했습니다.`; } },
  { id: 'kc_placed', a: [18, 75], c: () => S.fam.kids.some(k => k.alive && k.placed), w: 2, gap: 2, rep: 1, run: () => { const k = S.fam.kids.find(k => k.alive && k.placed), n = callName(k.name), P = k.placed;
    eff({ h: 1, so: 1 }); k.bd = (k.bd || 0) + 1;
    return varied('kcpl', P.k === 'kin' ? [L`주말마다 ${kinWord(P.who)} 댁에 가서 ${wa(n)} 하루를 보냈습니다. 헤어질 때마다 아이가 옷자락을 붙잡았습니다.`, L`${iga(n)} 전화로 언제 데리러 오냐고 물었습니다. 곧 가겠다고 답했습니다.`]
      : [P.fos ? L`위탁 가정에서 지내는 ${eul(n)} 만나고 왔습니다. 그새 키가 훌쩍 자랐습니다.` : L`주말에 시설로 ${eul(n)} 보러 갔습니다. 돌아오는 길이 늘 길었습니다.`, L`${iga(n)} 잘 지낸다는 소식을 선생님이 전해 주었습니다.`]); } },
  { id: 'kc_found', a: [35, 95], c: () => (S.fam.given || []).some(g => !g.met && S.age - g.bornAt >= 20) && yearRoll('kcfound', 0.03), w: 30, run: () => { const g = S.fam.given.find(g => !g.met && S.age - g.bornAt >= 20); g.met = 1; eff({ h: 5, so: 2 });
    return L`오래전 입양 보낸 ${iga(callName(g.name))} 연락을 해 왔습니다. 떨리는 마음으로 만나, 그동안 살아온 이야기를 들었습니다.`; } },
  { id: 'fr_call', a: [18, 85], c: () => friendsLeft() && S.st.so >= 30 && S.job !== 'prison' && !S.flags.hideCN && yearRoll('frc', 0.05), w: 30, gap: 6, rep: 1, run: () => { const n = friendName(3); eff({ so: 2, h: 2 }); return { t: varied('frc', [L`오랜 친구 ${iga(n)} 불쑥 전화를 걸어 와 한 시간을 떠들었습니다.`, ...(aloneAbroad() ? [] : [L`친구 ${wa(n)} 오랜만에 만나 밤늦도록 이야기를 나눴습니다.`]), L`친구 ${iga(n)} 내 생일을 잊지 않고 작은 선물을 보내 왔습니다.`]), k: 'warm' }; } },
  { id: 'fr_fight', a: [15, 70], c: () => friendsLeft() && S.job !== 'prison' && yearRoll('frf', 0.01), w: 30, gap: 15, rep: 1, run: () => { const n = friendName(); eff({ so: 1, h: -1 }); return L`사소한 오해로 친구 ${wa(n)} 한동안 연락을 끊었다가, 먼저 사과하고 다시 가까워졌습니다.`; } },
  { id: 'fr_help', a: [20, 85], c: () => friendsLeft() && !aloneAbroad() && S.flags.lossY != null && S.age - S.flags.lossY <= 1 && S.st.so >= 30 && S.job !== 'prison' && yearRoll('frh', 0.1), w: 30, gap: 10, rep: 1, run: () => { const n = friendName(); eff({ so: 3, h: 2 }); return { t: L`힘든 일이 있던 해, 친구 ${iga(n)} 말없이 찾아와 밥을 사 주었습니다.`, k: 'warm' }; } },
  { id: 'fr_hosp', a: [45, 90], c: () => friendsLeft() && !aloneAbroad() && S.st.so >= 30 && S.job !== 'prison' && yearRoll('frho', 0.012), w: 30, gap: 12, rep: 1, run: () => { const n = friendName(); eff({ so: 2 }); return L`친구 ${iga(n)} 병원에 입원해 병문안을 다녀왔습니다. 서로의 흰머리를 보며 웃었습니다.`; } },
  { id: 'fr_move', a: [22, 60], c: () => friendsLeft() && !aloneAbroad() && S.st.so >= 35 && !S.done.fr_move && S.job !== 'prison' && yearRoll('frm', 0.012), w: 30, run: () => { S.done.fr_move = 1; const n = friendName(); eff({ so: 3, h: 1 }); return { t: L`이삿날 친구 ${iga(n)} 트럭을 빌려 와 하루 종일 짐을 날라 주었습니다.`, k: 'warm' }; } },
  { id: 'kc_visit', a: [20, 75], c: () => S.fam.kids.some(k => k.alive && k.away && !k.placed && !k.lb && !nkCut(k)), w: 2, gap: 3, rep: 1, run: () => { const k = kidAny(S.fam.kids.filter(k => k.alive && k.away && !k.placed && !k.lb)), n = callName(k.name), met = () => { eff({ h: 3, so: 2 }); k.bd = (k.bd || 0) + 2; };
    const far = k.awayIn && k.awayIn !== S.cur && CBY[k.awayIn] ? CBY[k.awayIn].ko : '';
    if (far) {
      const go = tripOutOK() && S.flags.irreg == null && S.job !== 'prison' && !S.flags.hideCN, x = go ? (typeof homeTrip === 'function' ? homeTrip() : med() * 0.12) : 0;
      const os = [eraBefore(2008) ? (noHear() ? null : L`${far}에 사는 ${wa(n)} 국제 전화로 오래 이야기했습니다. 목소리가 반가웠습니다.`) : L`${far}에 사는 ${wa(n)} 영상 통화를 했습니다. 화면 너머로 웃는 얼굴이 반가웠습니다.`,
        go ? { t: L`${far}에 다녀오며 ${eul(n)} 만나 며칠을 함께 보냈습니다. (−${wonStr(x)})`, x } : null, go && S.age - k.bornAt >= 8 && chance(0.3) ? L`방학에 ${iga(n)} ${far}에서 비행기를 타고 와 며칠 지내다 갔습니다. 그새 훌쩍 자랐습니다.` : null].filter(Boolean);
      if (!os.length) return null;
      const o = varied('kcvisitf', os); met();
      if (o.x) { S.money -= o.x; tripTo(k.awayIn); }
      return { t: o.t || o, k: 'warm' };
    }
    const ka = S.age - k.bornAt;
    met(); return { t: varied('kcvisit', [L`주말에 ${eul(n)} 만나 함께 하루를 보냈습니다. 헤어질 때는 늘 아쉽습니다.`, ka >= 6 && ka <= 18 ? L`방학 동안 ${iga(n)} 와서 지냈습니다. 그새 훌쩍 자랐습니다.` : null, ka >= 7 && ka <= 18 ? L`${wa(n)} 통화하며 학교 이야기를 들었습니다.` : null].filter(Boolean)), k: 'warm' }; } },
  { id: 'kc_comeback', a: [25, 75], c: () => custBackKids().some(k => S.age - k.bornAt >= 12 && bondScore(k, 'kid') >= 20) && yearRoll('kcb', 0.05), w: 30, rep: 1, gap: 4, run: () => {
      const k = custBackKids().find(k => S.age - k.bornAt >= 12 && bondScore(k, 'kid') >= 20), n = callName(k.name), ka = S.age - k.bornAt;
      custBackHome([k]); eff({ h: 6, so: 2 });
      return { t: L`${ka}살이 된 ${iga(n)} 나와 함께 살고 싶다고 했습니다. 전 배우자와 이야기 끝에 ${iga(n)} 짐을 싸 들고 우리 집으로 왔습니다.`, k: 'warm' }; } },
  { id: 'kc_outing', a: [20, 70], c: () => !!outKid() && yearRoll('kco', 0.14), w: 30, rep: 1, gap: 3, run: () => {
      const k = outKid(), n = callName(k.name), c = C(), yr = calYr(), city = S.urban, out = [];
      if (city && KIDS_CAFE.has(c.id) && yr >= 2005 && c.ppp >= 8000) out.push(L`주말에 ${eul(n)} 데리고 키즈카페에 갔습니다. 땀범벅이 되도록 뛰어놀고는 돌아오는 길에 잠들었습니다.`);
      if (city && c.ppp >= 10000) out.push(L`${wa(n)} 수족관에 갔습니다. 커다란 가오리가 지나갈 때마다 유리에 코를 박고 소리를 질렀습니다.`);
      if (city && c.ppp >= 3000) out.push(L`${wa(n)} 동물원에 갔습니다. 기린 앞에서 한참을 떠나지 않으려 했습니다.`);
      if (city) out.push(L`${wa(n)} 공원에서 자전거 타기를 연습했습니다. 넘어져도 다시 일어나 페달을 밟았습니다.`);
      else out.push(L`${wa(n)} 개울에서 작은 물고기를 잡으며 오후를 보냈습니다.`, L`${eul(n)} 데리고 장날 구경을 갔습니다. 솜사탕 하나에 세상을 다 가진 얼굴이었습니다.`);
      eff({ h: 3, so: 2 }); btAdd(k, 2);
      return { t: varied('kco', out), k: 'warm' }; } },
  { id: 'kc_ownway', a: [36, 75], c: () => !!uniKid() && yearRoll('kcw', ['KOR', 'JPN', 'TWN'].includes(C().id) ? 0.02 : C().p === 'hi' ? 0.04 : 0.06), w: 30, rep: 1, gap: 3, run: () => {
      const k = uniKid(), n = callName(k.name); k.path = 'work'; k.od = 1; eff({ h: -2 });
      if (k.dj) { k.djK = 'look'; return { t: L`${iga(n)} 어릴 적 꿈을 좇겠다며 대학을 그만두었습니다. 걱정이 앞섰지만 등을 두드려 주었습니다.`, k: 'ev' }; }
      return { t: L`${iga(n)} 대학을 그만두고 다른 길을 찾겠다고 했습니다. 한참을 말렸지만, 결국 그 아이의 삶이라는 걸 받아들였습니다.`, k: 'ev' }; } },
  { id: 'gk_mind', a: [45, 85], c: () => !!gkMindKid() && yearRoll('gkm', 0.12), w: 30, rep: 1, gap: 2, run: () => {
      const k = gkMindKid(), n = callName(k.name); k.gm = 1;
      if (S.st.hl < 40 || S.age >= 80) { eff({ h: -1 }); return { t: L`${iga(n)} 손주를 봐 달라고 부탁했지만, 몸이 따라 주지 않아 가끔 들러 주는 것으로 대신했습니다.`, k: 'ev' }; }
      if (isWorking()) { eff({ h: 2, so: 2 }); btAdd(k, 2); return { t: L`${iga(n)} 일을 나가는 동안 손주를 봐 달라고 부탁해 왔습니다. 일을 하고 있어 주말마다 손주를 맡아 주었습니다.`, k: 'warm' }; }
      eff({ h: 3, so: 3, hl: -1 }); btAdd(k, 4);
      return { t: L`${iga(n)} 일을 나가는 동안 손주를 봐 달라고 부탁해 왔습니다. 몇 해 동안 일주일에 며칠씩 손주를 돌봤습니다. 허리는 쑤셨지만 하루가 금방 갔습니다.`, k: 'warm' }; } },
  { id: 'kc_prize', a: [22, 70], c: () => !!kidFor(8, 13, 'f6') && yearRoll('kc6', 0.2), w: 30, run: () => { const k = kidFor(8, 13, 'f6'); k.f6 = 1; eff({ h: 3 }); return varied('kcp', [L`${iga(callName(k.name))} 학교에서 받은 상장을 들고 뛰어 들어왔습니다.`, L`${iga(callName(k.name))} 학교 발표회에서 맡은 역할을 끝까지 해냈습니다. 객석에서 손을 흔들었습니다.`, L`${iga(callName(k.name))} 처음으로 혼자 심부름을 다녀와서는 거스름돈을 자랑스럽게 내밀었습니다.`]); } },
  { id: 'kc_trouble', a: [25, 75], c: () => !!kidFor(12, 16, 'f7') && yearRoll('kc7', 0.15), w: 30, run: () => { const k = kidFor(12, 16, 'f7'); k.f7 = 1; eff({ h: -2 }); return { t: varied('kct', [L`${callName(k.name)}의 일로 학교에 불려 갔습니다. 친구와 크게 다퉜다고 합니다. 돌아오는 길에 오래 이야기를 나눴습니다.`, L`${iga(callName(k.name))} 학교를 빼먹은 것을 뒤늦게 알았습니다. 야단치기 전에 왜 그랬는지부터 물었습니다.`, L`${iga(callName(k.name))} 시험을 망쳤다며 방에서 나오지 않았습니다. 좋아하는 음식을 문 앞에 두고 왔습니다.`]), k: 'bad' }; } },
  { id: 'kc_crush', a: [28, 80], c: () => !!kidFor(15, 18, 'f8') && yearRoll('kc8', 0.2), w: 30, run: () => { const k = kidFor(15, 18, 'f8'); k.f8 = 1; eff({ h: 2 }); return L`${callName(k.name)}에게 좋아하는 사람이 생긴 것 같습니다. 모른 척 웃었습니다.`; } },
  { id: 'kc_bday', a: [30, 90], c: () => !!kidFor(9, 30, 'f9') && yearRoll('kc9', 0.2), w: 30, run: () => { const k = kidFor(9, 30, 'f9'), ka = S.age - k.bornAt, n = callName(k.name); k.f9 = 1; eff({ h: 4, so: 2 });
      return { t: pick(ka < 14 ? [L`생일날 ${iga(n)} 손편지와 삐뚤빼뚤한 케이크를 내밀었습니다.`, L`${iga(n)} 생일 선물이라며 오래 모은 용돈으로 산 것을 건넸습니다.`]
        : ka < 20 ? [L`생일날 ${iga(n)} 아침상을 차려 놓고 기다리고 있었습니다.`, L`${iga(n)} 생일 선물이라며 오래 모은 용돈으로 산 것을 건넸습니다.`]
        : k.abroad ? [L`멀리 사는 ${iga(n)} 생일 축하 전화를 걸어 왔습니다.`] : kidApart(k) ? [L`${iga(n)} 생일이라며 근사한 저녁을 사 주었습니다.`, L`${iga(n)} 생일이라며 꽃다발을 들고 찾아왔습니다.`] : [L`생일날 ${iga(n)} 아침상을 차려 놓고 기다리고 있었습니다.`, L`${iga(n)} 생일이라며 근사한 저녁을 사 주었습니다.`]), k: 'warm' }; } },
  { id: 'kc_talk', a: [28, 80], c: () => !!kidFor(15, 19, 'f4') && yearRoll('kc4', 0.25), w: 30, run: () => { const k = kidFor(15, 19, 'f4'); k.f4 = 1; eff({ so: 2, h: 2 }); return L`${wa(callName(k.name))} 밤늦게 앞날 이야기를 나눴습니다. 어느새 훌쩍 자라 있었습니다.`; } },
  { id: 'kc_pay', a: [36, 95], c: () => !!kidPay() && yearRoll('kc5', 0.35), w: 30, run: () => { const k = kidPay(); k.f5 = 1; eff({ h: 5, so: 2 }); return L`${iga(callName(k.name))} 첫 월급으로 선물을 사 왔습니다. 오래도록 아껴 썼습니다.`; } },
  { id: 'kc_abroad', a: [40, 100], c: () => S.fam.kids.some(k => k.alive && k.abroad && !nkCut(k)) && yearRoll('kca', 0.2), w: 30, rep: 1, gap: 4, run: () => { const k = pick(S.fam.kids.filter(k => k.alive && k.abroad && !nkCut(k))); eff({ h: 2, so: 1 }); return varied('kca', [eraBefore(2008) ? (noHear() ? null : L`${CBY[k.abroad].ko}에 사는 ${wa(callName(k.name))} 국제 전화로 오래 이야기했습니다. 목소리가 반가웠습니다.`) : L`${CBY[k.abroad].ko}에 사는 ${wa(callName(k.name))} 영상 통화를 했습니다. 화면 너머로 웃는 얼굴이 반가웠습니다.`, L`${CBY[k.abroad].ko}에서 ${iga(callName(k.name))} 오랜만에 집에 다녀갔습니다.`].filter(Boolean)); } },
  { id: 'kidschool', a: [24, 70], c: () => S.fam.kids.some(k => k.alive && !k.away && S.age - k.bornAt === 6), w: 4, run: () => { const ks = S.fam.kids.filter(k => k.alive && !k.away && S.age - k.bornAt === 6), k = ks[0]; eff({ h: 4 });
      if (ks.length > 1) { const a = callName(ks[0].name), b = callName(ks[1].name);
        if (!ks.slice(0, 2).some(x => x.tw)) return L`${wa(a)} ${iga(b)} 나란히 학교에 입학했습니다.`;
        return kidPrivOf(ks[0]) && kidPrivOf(ks[1]) ? L`쌍둥이 ${wa(a)} ${iga(b)} 나란히 사립학교에 입학했습니다.` : L`쌍둥이 ${wa(a)} ${iga(b)} 나란히 학교에 입학했습니다.`; }
      return kidPrivOf(k) ? L`${iga(callName(k.name))} 사립학교에 입학했습니다.` : L`${iga(callName(k.name))} 학교에 입학했습니다.`; } },
  { id: 'grandkid', a: [40, 100], c: () => false, w: 1.2, rep: 1, run: () => { S.flags.grand = (S.flags.grand || 0) + 1; eff({ h: 6, so: 4 }); S.yearMark = S.yearMark || 'grand'; return S.flags.grand === 1 ? "Đứa cháu đầu tiên đã chào đời!" : L`손주가 또 태어났습니다. 이제 ${S.flags.grand}명입니다.`; } },
  { id: 'parentill', a: [25, 75], c: () => (S.fam.mom.alive && S.fam.mom.age > 60) || (S.fam.dad.alive && !S.fam.dad.absent && S.fam.dad.age > 60), w: 0.7, gap: 3, run: () => {
      const both = S.fam.mom.alive && S.fam.mom.age > 60 && S.fam.dad.alive && !S.fam.dad.absent && S.fam.dad.age > 60;
      const mom = both ? chance(0.5) : S.fam.mom.alive && S.fam.mom.age > 60, who = mom ? "mẹ" : "bố", home = S.flags.careHome === (mom ? 'mom' : 'dad');
      const far = !home && (parAbroad() || studyAway()), pc = far ? B() : C(), hk = HOSP_FREE.has(pc.id) ? 0 : pc.id === 'USA' ? 0.4 : clamp((pc.oop || 30) / 40, 0.2, 1.3);
      const x = (far ? homeRankInc(0.3) : Math.max(S.income, incomeAt(C(), 0.3))) * 0.06 * hk / (1 + 0.5 * Math.min(2, sibN())) * (S.q >= 5 ? 0.35 : S.q === 4 ? 0.7 : 1); eff({ h: -3 });
      if (ddKept()) return ddLv() === 3 ? L`${who}가 밤새 앓으셔서 곁을 지켰습니다.` : varied('parentill0k', [L`함께 사는 ${who}를 모시고 병원을 오갔습니다.`, L`${who}가 밤새 앓으셔서 곁을 지켰습니다.`]);
      if (!x) return far ? varied('parentillfar0', [L`${who}가 입원하셨다는 전화를 받고 밤새 잠을 이루지 못했습니다. 다행히 병원비 걱정은 없다고 하셨습니다.`, L`${who}가 넘어지셨다는 소식에 매일 저녁 전화를 드렸습니다.`])
        : varied('parentill0', home ? [L`함께 사는 ${who}를 모시고 병원을 오갔습니다.`, L`${who}가 밤새 앓으셔서 곁을 지켰습니다.`] : [L`${who}가 편찮으셔서 병원에 모시고 다녔습니다.`, L`${who}가 입원하셔서 퇴근길마다 병원에 들렀습니다.`, L`${who}가 넘어지셔서 한동안 찾아가 돌봐 드렸습니다.`]);
      S.money -= x; const m = wonStr(x);
      if (far) return varied('parentillfar', [L`${who}가 편찮으시다는 소식에 병원비를 보내 드렸습니다. (−${m})`, tripOutOK() ? L`${who}가 넘어지셨다는 소식에 비행기를 타고 다녀왔습니다. (−${m})` : null, L`${who}가 입원하셨다는 전화를 받고 밤새 잠을 이루지 못했습니다. 병원비를 보내 드렸습니다. (−${m})`].filter(Boolean));
      return varied('parentill', home ? [L`함께 사는 ${who}를 모시고 병원을 오갔습니다. (−${m})`, L`함께 사는 ${who}의 약값과 병원비가 늘었습니다. (−${m})`, L`${who}가 밤새 앓으셔서 곁을 지켰습니다. 병원비도 들었습니다. (−${m})`]
        : [L`${who}가 편찮으셔서 병원비를 보탰습니다. (−${m})`, L`${who}가 입원하셔서 병원비를 보탰습니다. (−${m})`, L`${who}가 넘어지셔서 한동안 찾아가 돌봐 드렸습니다. (−${m})`, sibN() ? L`${who}의 수술비를 형제자매와 나눠 냈습니다. (−${m})` : L`${who}의 수술비를 마련했습니다. (−${m})`]); } },
  { id: 'neighbor', a: [12, 95], c: () => S.flags.oldHome !== 'care', w: 0.5, rep: 1, gap: 7, run: () => {
      eff({ so: 3 }); const f = C().p === 'ssa' ? "Tỷ lệ người trả lời rằng mình “đã giúp một người lạ” ở các nước châu Phi thuộc hàng cao nhất. Họ thường giúp bằng thời gian và đôi tay nhiều hơn là bằng tiền (CAF World Giving Index)" : null;
      const kp = ddKept();
      if (kp ? S.q <= 1 && S.age >= 18 && chance(0.5) : debtHeavy() || (S.age >= 18 && S.income < incomeAt(C(), 0.3) && S.money < incomeAt(C(), 0.5) * 0.2)) {
        if (chance(0.4)) { S.money += incomeAt(C(), 0.5) * 0.03; eff({ h: 2 }); return { t: pick(["Biết bạn đang khó khăn, hàng xóm mỗi người góp một ít gạo và tiền cho bạn.", "Hàng xóm thay phiên nhau chia sẻ bữa ăn với bạn. Bạn mong một ngày nào đó sẽ đền đáp được."]), k: 'warm', f }; }
        return { t: pick([S.age >= 18 && !kp ? "Không có tiền, nhưng bạn vẫn góp sức giúp đám tang của một người hàng xóm." : "Bạn góp sức giúp đám tang của một người hàng xóm.", "Bạn phụ việc nhà cho một người hàng xóm đang ốm.", S.urban && !kp && S.age < 80 ? "Bạn trông giúp con của hàng xóm mấy ngày." : "Bạn cùng phụ hàng xóm làm đồng."]), f };
      }
      return { t: pick((S.age < 18 ? ["Bạn xách giúp giỏ đồ của bà cụ nhà bên đến tận cửa.", "Bạn kèm bài tập cho em nhỏ nhà hàng xóm.", "Bạn đi khắp xóm tìm giúp chú chó con nhà hàng xóm bị lạc.", "Bạn chạy việc vặt giúp một cụ hàng xóm đi lại khó khăn."]
        : ["Bạn đi chợ giúp một người hàng xóm đang ốm.", "Bạn thường ghé thăm một cụ hàng xóm sống một mình.", "Bạn chia sẻ thức ăn với những người hàng xóm đang khó khăn.", "Bạn trông giúp con của hàng xóm một ngày khi họ có việc đột xuất."]).filter((x, i) => (!(kp || S.age >= 80) || i !== (S.age < 18 ? 1 : 3)) && !(S.age < 18 && i === 1 && !S.school && !(S.edu >= 1)))), f }; } },
  { id: 'heat', a: [5, 100], c: () => C().haz.includes('H'), w: 0.6, gap: 6, run: () => { eff({ hl: -2 }); return { t: varied('heat', ["Một đợt nắng nóng kỷ lục ập đến.", "Những đêm oi bức kéo dài, mấy đêm liền bạn ngủ không yên giấc.", "Cái nóng kéo dài, suốt một thời gian bạn thấy người nặng nề, mệt mỏi.", isWorking() ? "Làm việc giữa trưa nắng gắt, bạn bị chóng mặt và phải nghỉ." : "Bạn ra ngoài một lát giữa trưa nắng gắt, bị chóng mặt và phải nghỉ một hồi lâu."]), k: 'bad' }; } },
  { id: 'youthday', a: [10, 17], c: () => !!S.flags.youth && !S.flags.dreamEnd && S.job !== 'athlete', w: 1.5, gap: 2, run: () => { eff({ hl: 1, h: 1 }); return varied('youthday', ["Mỗi lần buổi tập của đội trẻ kết thúc, trời đã tối từ bao giờ.", "Lần đầu tiên bạn được đá chính trong một trận đấu của giải trẻ.", "Huấn luyện viên bảo bạn phải tập lại từ những kỹ năng cơ bản.", "Một người bạn cùng tập đã rời đội.", "Bạn thi đấu trận sân khách với đội trẻ của một thành phố khác."]); } },
  { id: 'volcoach', a: [23, 80], c: () => S.flags.volCoach != null && S.age - S.flags.volCoach < 15, w: 0.8, gap: 3, run: () => { eff({ h: 2, so: 2 }); const sp = sportBackName(); return varied('volcoach', [L`주말마다 동네 아이들에게 ${eul(sp)} 가르쳤습니다.`, "Một đứa trẻ bạn dạy lần đầu tiên được ra thi đấu.", "Kể cả những ngày mưa, bọn trẻ vẫn có mặt ở sân tập.", "Một đứa trẻ bạn từng dạy, nay đã lớn, đến chào bạn."]); } },
  { id: 'hobbylv', a: [8, 95], c: () => S.hobbies.some(h => h.lv >= 3 && !h.m3) || S.hobbies.some(h => h.lv >= 8 && !h.m8), w: 3, run: () => {
      const h = S.hobbies.find(h => h.lv >= 8 && !h.m8) || S.hobbies.find(h => h.lv >= 3 && !h.m3); const n = hobbyName(h.id);
      if (h.id === 'board' && S.flags.boardPro) { h.m3 = h.m8 = 1; return null; }
      if (h.id === 'games' && S.flags.gamer) { h.m3 = h.m8 = 1; return null; }
      if (proSportH(h)) { h.m3 = h.m8 = 1; return null; }
      if (proArtH(h)) { h.m3 = h.m8 = 1; return null; }
      if (hobBodyOff(h)) { h.m3 = h.m8 = 1; if (S.flags.hobWc) return null; S.flags.hobWc = 1; return L`${eun(n)} 이제 경기장 밖에서 응원하며 즐깁니다.`; }
      const ms = h.id.startsWith('sp_') ? [L`함께 ${eul(n)} 하는 친구들이 생겼습니다.`, S.age >= 65 ? L`${n} 실력이 수준급이 되었습니다. 동호회에서는 나이를 잊은 사람으로 통했습니다.` : L`${n} 실력이 수준급이 되었습니다. 지역 대회에서 상을 받았습니다!`]
        : h.id === 'board' ? [L`함께 ${eul(n)} 하는 친구들이 생겼습니다.`, L`동네 ${n} 대회에서 우승했습니다!`]
        : S.flags.illit && h.id === 'screen' ? [HOBBY_MS.screen[0], "Bạn mê những bộ phim truyền hình yêu thích đến mức thuộc làu cốt truyện và tên từng diễn viên."]
        : S.flags.illit && h.id === 'sns' ? [HOBBY_MS.sns[0], "Đã có những người mong chờ ảnh và video bạn đăng lên mạng xã hội."] : HOBBY_MS[h.id];
      if (h.lv >= 8 && !h.m8) { h.m8 = 1; eff({ h: 6, so: 3 }); if (h.id === 'crafts') S.flags.craftSell = S.age; return ms ? ms[1] : L`${n} 실력이 수준급이 되었습니다. 지역 대회에서 상을 받았습니다!`; }
      h.m3 = 1; eff({ h: 3 }); return ms ? ms[0] : L`${n}에 제법 익숙해졌습니다. 같은 취미를 가진 친구들이 생겼습니다.`; } },
  { id: 'lonely', a: [60, 125], c: () => S.st.so < 40, w: 1.5, rep: 1, run: () => { eff({ h: -3 }); return { t: "Những ngày thấy trống trải ngày càng nhiều.", k: 'bad' }; } },
  { id: 'friendgone', a: [55, 125], c: () => { const fN = S.flags.fN || (S.flags.fN = ri(4, 8)), l = lifeTable(C(), S.sex).l; return (S.flags.fGone || 0) < Math.floor(fN * (1 - l[S.age] / l[40]) + 0.5) && S.flags.lastFG !== S.age; }, w: 1.5, rep: 1, run: () => {
    S.flags.lastFG = S.age; S.flags.fGone = (S.flags.fGone || 0) + 1; eff({ h: -4, so: -3 });
    const fam = [S.name, S.fam.partner && S.fam.partner.name, S.fam.mom && S.fam.mom.name, S.fam.dad && S.fam.dad.name, ...S.fam.kids.map(k => k.name)].filter(x => x && x.full);
    const last = S.flags.fGone >= S.flags.fN, used = S.flags.fUsed || (S.flags.fUsed = [callName(S.name)]), famW = new Set(fam.flatMap(x => String(x.full).split(/\s+/)));
    const bad = frBad(), known = (S.flags.frNames || []).filter(x => !used.includes(x) && !famW.has(x) && !bad.has(x) && frOld(x, 5));
    let nm = known.length && chance(0.6) ? known[0] : ''; for (let t = 0; t < 15 && (!nm || used.includes(nm) || famW.has(nm) || bad.has(nm)); t++) { const sx = chance(0.5) ? 'M' : 'F'; nm = frKeep(callName(makeName(S.cl, sx, {})), sx); }
    used.push(nm); if (S.flags.frNames) S.flags.frNames = S.flags.frNames.filter(x => x !== nm);
    grieve('fr', nm);
    return { t: L`오랜 친구 ${iga(nm)} 세상을 떠났습니다.${last ? " Giờ đây, những người bạn thời trẻ đều đã rời xa bạn." : ''}`, k: 'loss' }; } },
  { id: 'memory', a: [75, 125], c: () => !demNow() && yearRoll('memory', 0.45 * (1 - mindKeep())), w: 0.8, gap: 2, rep: 1, run: () => { eff({ sm: -3 }); return "Trí nhớ của bạn không còn như trước."; } },
  { id: 'mindkeep', a: [65, 105], c: () => mindKeep() >= 0.35 && !demNow(), w: 0.6, gap: 6, run: () => { eff({ sm: 1, h: 1 }); return { t: varied('mindkeep', ["Bạn theo học các lớp ở trung tâm phúc lợi và học được những điều mới.", "Ngày nào bạn cũng gặp gỡ, trò chuyện với hàng xóm. Đầu óc minh mẫn, lòng cũng thư thái.", ...(S.flags.illit ? [] : ["Ngày nào bạn cũng đi bộ và đọc sách. Mọi người bảo trí nhớ của bạn tốt hơn những người cùng tuổi."])]), f: "Học hỏi đều đặn, giao lưu với mọi người và vận động giúp giảm nguy cơ sa sút trí tuệ (Ủy ban Lancet về sa sút trí tuệ, 2024)" }; } },
  { id: 'grandgarden', a: [62, 100], c: () => S.flags.grand && gkNear(0, 70), w: 1, gap: 3,
    run: () => { eff({ h: 4, so: 3 }); return L`${S.flags.grand > 1 ? "các cháu" : "cháu"} 함께 시간을 보냈습니다.`; } },
  { id: 'checkup', a: [40, 90], c: () => (C().p === 'hi' || S.pct > 0.7) && !S.flags.termIll, w: 0.7, run: () => { eff({ hl: 1 }); const x = ncdCheckup(); return x ? "Bạn đi khám sức khỏe định kỳ." + x : "Bạn đi khám sức khỏe định kỳ. Không có gì bất thường."; } },
  { id: 'migjob', a: [18, 70], c: () => !!S.mig && !S.flags.hideCN, w: 1, rep: 1, gap: 3, run: () => {
    if (!speaksHere() && chance(0.5)) { eff({ h: -2 }); return "Vì chưa rành ngôn ngữ, bạn đã bị hiểu lầm."; }
    if (sameTongue() && S.age - S.migY < 5 && !S.flags.tongueSame) { S.flags.tongueSame = 1; eff({ h: -1 }); return "Dù nói cùng một thứ tiếng, cách diễn đạt và văn hóa khác nhau vẫn khiến bạn gặp những chuyện dở khóc dở cười."; }
    if (!S.flags.migClub && chance(0.5)) { S.flags.migClub = 1; eff({ so: 2 }); return "Bạn lập một hội với những người cùng quê."; }
    if (farFromNK()) { eff({ h: -1 }); return varied('migjobnk', [S.cur === 'KOR' ? "Nhớ món dubu-bap, đậu phụ nhồi cơm của quê nhà, bạn tìm đến một quán do người rời Triều Tiên mở." : "Nhớ món ăn quê nhà, bạn lần theo trí nhớ để nấu thử.", "Mỗi khi trên tivi có tin về Triều Tiên, bạn lại ngồi xem rất lâu.", "Trong mơ, bạn đi trên con ngõ bên ngôi nhà cũ ở quê."]); }
    eff({ h: -1 }); return varied('migjob', [L`${B().ko} 음식이 그리워 고향 가게를 찾아갔습니다.`, L`${B().ko}에서 온 소포를 뜯자 고향 냄새가 났습니다.`].concat(noHear() ? [] : [L`길에서 들려온 ${B().ko} 노래에 한참을 서 있었습니다.`], S.flags.migClub && !sameTongue() ? ["Ở hội đồng hương, lâu lắm rồi bạn mới được nói tiếng mẹ đẻ thỏa thích."] : [])); } },
  { id: 'seeking', a: [16, 64], c: () => S.job === 'seeking' && !wdOn(), w: 2, rep: 1, run: () => { eff({ h: -3 }); return { t: "Bạn đi tìm việc khắp nơi nhưng chẳng dễ dàng.", k: 'bad' }; } },
  { id: 'savings', a: [25, 70], c: () => S.money > incomeAt(C(), 0.5) * 2, w: 0.6, rep: 1, gap: 4, run: () => { eff({ h: 2 });
      const inv = S.invest && S.invest !== 'cash', more = homeV() > 0 || (S.flags.bizKeep && S.flags.bizKeep.v > 0);
      return (inv ? L`모아 둔 돈이 든든합니다. 예금과 투자를 합쳐 ${wonStr(S.money)} (한국 체감)에 이르렀습니다.` : L`통장 잔고가 든든합니다. 저축이 ${wonStr(S.money)} (한국 체감)에 이르렀습니다.`) + (more ? ' ' + L`가진 것을 모두 더한 순자산은 ${wonStr(netWorth())}입니다.` : ''); } },
  { id: 'debt', a: [20, 90], c: () => debtHeavy(), w: 1.2, rep: 1, gap: 3, run: () => { eff({ h: -4 }); return { t: L`${S.house > 0 ? ", tính cả khoản vay mua nhà" : ''}빚 ${wonStr(-S.money)} (한국 체감) 때문에 잠을 이루지 못했습니다.`, k: 'bad' }; } },
  { id: 'camp', a: [0, 100], c: () => S.refugee && !S.flags.hideCN, w: 2, rep: 1, run: () => { eff({ hl: -2, h: -2 }); return { t: pick(["Bạn xếp hàng nhận khẩu phần cứu trợ hàng mấy tiếng liền.", "Nước mưa tạt vào trong lều.", "Bạn chờ tin tức từ quê nhà, nhưng chẳng có tin nào."]), k: 'bad' }; } },
  { id: 'prkwork', a: [14, 60], c: () => S.cur === 'PRK', w: 1, rep: 1, run: () => pick(["Bạn bị huy động đi cấy lúa.", ...(calYr() >= 1994 ? ["Bạn lén bán hàng ở chợ jangmadang để kiếm thêm cái ăn."] : []), "Mất điện thường xuyên, mùa đông dài lê thê."]) },
  { id: 'prkmedia', a: [13, 40], c: () => S.cur === 'PRK' && calYr() >= 2005 && !S.flags.prkMedia && yearRoll('prkm', 0.08), w: 30, run: () => { S.flags.prkMedia = 1; eff({ h: 2 }); return { t: noHear() ? "Bạn xem một bộ phim truyền hình Hàn Quốc qua chiếc USB kiếm được một cách lén lút." + ' ' + "Sợ bị phát hiện, bạn trùm chăn kín đầu, dõi theo nét mặt và trang phục của mọi người thay vì âm thanh." : "Bạn xem một bộ phim truyền hình Hàn Quốc qua chiếc USB kiếm được một cách lén lút. Sợ bị phát hiện, bạn trùm chăn kín đầu và vặn nhỏ tiếng.", f: "83% người rời Triều Tiên trong giai đoạn 2016-2020 cho biết họ từng xem phim ảnh nước ngoài khi còn ở Triều Tiên (Bộ Thống nhất Hàn Quốc, báo cáo thực trạng kinh tế - xã hội Triều Tiên 2024)" }; } },
  { id: 'prkgone', a: [15, 60], c: () => S.cur === 'PRK' && calYr() >= 1995 && !S.flags.prkGone && yearRoll('prkg', 0.05 * prkPlace()), w: 30, run: () => { S.flags.prkGone = 1; return { t: "Một ngày nọ, gia đình nhà bên biến mất. Có tin đồn lặng lẽ lan ra rằng họ đã vượt sông.", f: "Từ năm 1998, trung bình mỗi năm có hơn 1.300 người rời Triều Tiên đến Hàn Quốc. Từ khi biên giới đóng cửa năm 2020, con số chỉ còn khoảng 200 người mỗi năm (Bộ Thống nhất Hàn Quốc)" }; } },
  { id: 'hidecn', a: [15, 90], c: () => !!S.flags.hideCN && S.cur === 'CHN', w: 3, rep: 1, run: () => { eff({ h: -3 }); return { t: pick(["Nghe tin đồn công an sắp truy quét, bạn trốn biệt mấy ngày liền.", "Không có giấy tờ tùy thân, bạn không được trả đủ tiền công.", "Qua người môi giới, bạn nghe được tin về gia đình còn ở lại miền Bắc."]), k: 'bad', f: S.sex === 'F' ? "Nhiều phụ nữ rời Triều Tiên sống lẩn trốn ở Trung Quốc là nạn nhân của buôn người và hôn nhân cưỡng ép (Ủy ban Điều tra của Liên Hợp Quốc về nhân quyền Triều Tiên, 2014)" : '' }; } },
  { id: 'defsk', a: [15, 125], c: () => !!S.flags.defSK && S.cur === 'KOR', w: 1, rep: 1, gap: 3, run: () => { eff({ h: 1 }); if (!S.flags.defBank && isWorking()) { S.flags.defBank = 1; return "Lần đầu tiên bạn mở một tài khoản ngân hàng đứng tên mình. Làm được bao nhiêu, tiền vào bấy nhiêu."; }
    return varied('defsk', ["Vì giọng nói, bạn thường bị hỏi là người ở đâu đến.", "Vào những dịp lễ, bạn đứng nhìn về bầu trời phương Bắc thật lâu.", "Lâu lắm rồi bạn mới gặp lại những người bạn cùng khóa ở Hanawon, cùng nhau nấu món ăn quê nhà."]); } },
  { id: 'royal', a: [6, 90], c: () => royalOn() && yearRoll('royal', S.flags.royal === 'r' ? 0.18 : 0.08), w: 30, rep: 1, gap: 3, run: () => { const t = royalLine(); if (!t) return null; if (t.cost) { const x = incomeAt(C(), 0.5) * t.cost; S.money -= x; return { t: L`${t.t} (−${wonStr(x)})`, k: 'bad' }; } eff({ so: 1 }); return t; } },
  { id: 'eth_disc', a: [6, 75], c: () => ethHome() && !!ethG() && ethG().d > 0 && S.job !== 'prison' && yearRoll('ethd', ethG().d), w: 30, rep: 1, gap: 2, run: () => {
      const t = ethDiscLine(); if (!t) return null; eff({ h: -3, so: -1 }); return { t, k: 'bad', f: ETH_LF[t] || ethFact() }; } },
  { id: 'eth_warm', a: [3, 95], c: () => ethHome() && !!ethG() && !ethG().quiet && yearRoll('ethw', 0.07), w: 30, rep: 1, gap: 3, run: () => {
      const t = ethWarmLine(); if (!t) return null; eff({ h: 3, so: 2 }); return { t, k: 'warm' }; } },
  { id: 'paygap', a: [22, 62], c: () => payGapLineOK() && yearRoll('pgap', PAY_GAP_T * payGapOf(C())), w: 30, run: () => {
      S.flags.payGapT = S.age; return { t: S.formal ? "Bạn phát hiện ra lương của mình thấp hơn các đồng nghiệp nam làm cùng công việc." : "Bạn phát hiện ra mình được trả ít tiền hơn những người đàn ông làm cùng công việc.", k: 'bad', f: payGapFact() }; } },
  { id: 'cst_form', a: [6, 8], c: () => casteHome() && !S.flags.cstForm && (S.caste.c !== 'IND' || !!S.school), w: 30, run: () => { S.flags.cstForm = 1; return casteFormLine(); } },
  { id: 'cst_disc', a: [6, 75], c: () => casteHome() && casteD() > 0 && S.job !== 'prison' && yearRoll('cstd', casteD()), w: 30, rep: 1, gap: 2, run: () => {
      const t = casteDiscLine(); if (!t) return null; eff({ h: -3, so: -1 }); return { t, k: 'bad', f: t === CASTE_HIRE_T() ? CASTE_HIRE_F : casteFactNow() }; } },
  { id: 'cst_warm', a: [5, 95], c: () => casteHome() && (['sc', 'dalit', 'jana', 'madh', 'dx'].includes(S.caste.g) || casteTongue()) && yearRoll('cstw', 0.06), w: 30, rep: 1, gap: 3, run: () => {
      const t = casteWarmLine(); if (!t) return null; eff({ h: 3, so: 2 }); return { t, k: 'warm' }; } },
  { id: 'cst_see', a: [8, 60], c: () => casteHome() && ['gen', 'obc', 'khas'].includes(S.caste.g) && (S.flags.cstSeeN || 0) < 2 && yearRoll('csts', 0.012), w: 30, rep: 1, gap: 8, run: () => {
      const t = casteSeeLine(); if (!t) return null; S.flags.cstSeeN = (S.flags.cstSeeN || 0) + 1; eff({ so: 2, h: 1 }); return { t, k: 'warm' }; } },
  { id: 'eth_xj', a: [14, 90], c: () => ethHome() && S.eth && S.eth.g === 'cn_uyg' && calYr() >= 2017 && calYr() <= 2019 && !S.flags.ethXj && yearRoll('xj', 0.7), w: 30, run: () => {
      S.flags.ethXj = 1; eff({ h: -4, so: -2 }); return { t: "Từ năm 2017, những người lớn trong xóm lần lượt bị đưa đến các “trung tâm giáo dục và đào tạo kỹ năng nghề”. Ông chú nhà bên cũng là một trong số đó, và không ai cho biết bao giờ chú ấy được trở về.", k: 'bad', f: XJ_F }; } },
  { id: 'eth_xjb', a: [18, 90], c: () => ethHome() && S.eth && S.eth.g === 'cn_uyg' && calYr() >= 2018 && calYr() <= 2019 && !S.flags.ethXjb && yearRoll('xjb', 0.5), w: 30, run: () => {
      S.flags.ethXjb = 1; return { t: "Tiếng trẻ sơ sinh khóc trong xóm thưa hẳn đi.", k: 'ev', f: XJ_B }; } },
  { id: 'eth_past', a: [6, 30], c: () => ethHome() && !!ethPastLine() && !S.flags.ethPast, w: 30, run: () => { const x = ethPastLine(); S.flags.ethPast = 1; return { t: x.t, k: 'ev', f: x.f }; } },
  { id: 'eth_noid', a: [14, 40], c: () => ethHome() && S.eth && S.eth.g === 'th_hill' && S.flags.noId == null && yearRoll('noid', 0.3), w: 30, run: () => {
      S.flags.noId = chance(ETH_G.th_hill.nid) ? S.age : 0;
      return S.flags.noId ? { t: "Không có giấy tờ chứng minh quốc tịch, bạn khó lòng đi nơi khác làm việc. Bạn nộp hồ sơ rồi chờ đợi mấy năm trời.", k: 'bad', f: ETH_F.THA } : null; } },
  { id: 'eth_idok', a: [16, 60], c: () => !!S.flags.noId && S.age - S.flags.noId >= 2 && yearRoll('idok', 0.3), w: 30, run: () => { S.flags.noId = null; eff({ h: 8 }); return { t: "Sau mấy năm chờ đợi, cuối cùng bạn cũng có được quốc tịch. Lần đầu tiên bạn cầm trên tay tấm thẻ căn cước có tên mình.", k: 'warm' }; } },
  { id: 'gpvisit', a: [3, 14], c: () => gpAlive(), w: 1.2, rep: 1, gap: 3, run: () => {
      const who = gpLabel(gpPick()); eff({ h: 3, so: 2 });
      const pm = L`${iga(who)} 몰래 용돈을 쥐여 주셨습니다.`, t = varied(S.school ? 'gpv' : 'gpvn', [L`명절에 ${who} 댁에 온 가족이 모였습니다.`, pm, L`${who} 곁에 앉아 옛날 사진을 한참 들여다보았습니다.`, ...(S.school ? [L`방학 동안 ${who} 댁에서 지냈습니다.`] : [])]);
      if (t !== pm) return t;
      const x = med() * 0.004; S.money += x; book("Tiền tiêu vặt", x); return t + ` (+${wonStr(x)})`; } },
  { id: 'gpcall', a: [15, 45], c: () => gpAlive(), w: 0.5, rep: 1, gap: 5, run: () => {
      const who = gpLabel(gpPick()); eff({ so: 2, h: 1 });
      return varied(ddKept() || noHear() ? 'gpck' : 'gpc', [...(ddKept() || noHear() ? [] : [L`오랜만에 ${who}께 전화를 드렸습니다. 목소리가 많이 약해지셨습니다.`]), L`${who}의 생신에 온 가족이 모였습니다.`, L`${iga(who)} 손수 만든 음식을 한 보따리 싸 주셨습니다.`]); } },
  { id: 'faithchg', a: [18, 75], c: () => !faithHidden() && !S.flags.conv && S.flags.privFaith == null && !S.flags.faithW && S.job !== 'prison' && !(S.flags.faithKeep != null && S.age - S.flags.faithKeep < 15)
      && yearRoll('fchg', privOnly() ? 0.001 : swHaz(C())), w: 30, run: () => {
      const c = C(), from = S.rel, why = faithWhy(c);
      if (why && !S.flags.faithQ && chance(0.6)) { if (cardFree()) { S.flags.faithQ = S.age; queue(Math.min(0.97, S.t + 0.04), 'dec', 'faithq', why); } else S.flags.faithW = { why, at: S.age }; return null; }
      if (privOnly()) { S.flags.privFaith = S.age; return { t: "Bề ngoài bạn vẫn sống như trước, nhưng trong lòng đã buông bỏ đức tin. Bạn không nói với ai cả.", k: 'ev' }; }
      if (from === 'C' && c.p === 'lac' && den() === 'cath' && chance(0.45)) { S.flags.den = 'prot'; S.flags.conv = { from: 'cath', at: S.age }; eff({ so: 2 }); return "Thay vì nhà thờ Công giáo, bạn bắt đầu đi lễ ở một hội thánh Tin Lành phái Phúc Âm nhỏ gần nhà. Buổi lễ nào cũng hát rất lâu."; }
      const to = swTo(c); if (!to || to === from) return null;
      if (to === 'N' && faithLived()) return null;
      const fam = faithMove(to); if (fam) log(fam.t, fam.k);
      if (from === 'N') { eff({ so: 3, h: 2 }); return { t: L`힘든 시기에 이웃의 권유로 ${relName()} 모임에 나가기 시작했습니다. 그곳에서 마음을 기댈 곳을 찾았습니다.`, k: 'ev' }; }
      if (to === 'N') return "Từ lúc nào không hay, bạn đã buông tôn giáo. Giờ ai hỏi, bạn trả lời là mình không theo tôn giáo nào.";
      eff({ so: 2 }); return { t: L`${relName()} 신앙을 받아들였습니다. 새 공동체에서 마음 둘 곳을 찾았습니다.`, k: 'ev' }; } },
  { id: 'faithlapse', a: [20, 70], c: () => !faithHidden() && S.rel !== 'N' && S.flags.lapsed == null && S.flags.privFaith == null && S.job !== 'prison' && !(S.flags.conv && S.flags.conv.at === S.age) && !faithLived()
      && yearRoll('flap', (['ssa', 'sa', 'mena'].includes(C().p) ? 0.0015 : 0.004) * (relShare(C(), 'M') > 0.5 && S.rel === 'M' ? 0.5 : 1)), w: 30, run: () => {
      S.flags.lapsed = S.age; eff({ so: -1 });
      return famNear() ? L`언제부턴가 ${worshipAt(S.rel)}에 나가지 않게 되었습니다. 그래도 명절이면 가족과 함께 예식을 지켰습니다.` : L`언제부턴가 ${worshipAt(S.rel)}에 나가지 않게 되었습니다. 그래도 명절이면 고향의 가족에게 안부를 전했습니다.`; } },
  { id: 'sib_life', a: [20, 80], c: () => sibN() > 0 && !farFromNK() && yearRoll('sibl', 0.09), w: 30, rep: 1, gap: 4, run: () => {
      const a = S.age, par = (S.fam.mom.alive && S.fam.mom.age >= 75) || (S.fam.dad.alive && !S.fam.dad.absent && S.fam.dad.age >= 75), out = [], far = aloneAbroad() || farKin();
      const sw = a <= 45 ? sibWedNext() : null;
      const vc = !eraBefore(2010);
      if (sw) out.push({ t: far ? (vc ? L`${iga(sibCall(sw))} 결혼했습니다. 멀리서 영상 통화로 식을 지켜보았습니다.` : L`${iga(sibCall(sw))} 결혼했습니다. 멀리서 보내온 사진으로 식을 보았습니다.`) : L`${iga(sibCall(sw))} 결혼했습니다. 식장에서 온 가족이 사진을 찍었습니다.`, w: sw.i });
      if (a >= 25 && a <= 50) out.push(far ? (vc ? "Một người anh chị em của bạn vừa có con. Bạn nhìn thấy gương mặt đứa cháu lần đầu qua cuộc gọi video." : "Anh chị em của bạn có con. Bạn lần đầu thấy mặt cháu qua những tấm ảnh gửi về.") : "Một người anh chị em của bạn vừa có con. Lần đầu tiên bạn được bế đứa cháu.");
      if (a >= 25 && a <= 60 && S.money > incomeAt(C(), 0.5) * 0.3 && !ddKept()) out.push({ t: "Bạn cho anh chị em vừa mất việc vay tiền sinh hoạt mấy tháng.", m: 0.08 });
      if (a >= 40) out.push(far ? "Một người anh chị em của bạn phải trải qua một ca phẫu thuật lớn. Ở nơi xa, bạn thức trắng đêm chờ tin." : "Một người anh chị em của bạn phải trải qua một ca phẫu thuật lớn. Bạn ở lại bệnh viện, thức trắng đêm bên cạnh.");
      const al = sibAliveList(), one = al.length === 1 ? sibCall(al[0]) : null;
      if (par && !ddKept()) out.push(one ? (far ? (vc ? L`${wa(one)} 영상 통화로 나이 드신 부모님을 어떻게 모실지 의논했습니다.` : L`${wa(one)} 전화로 나이 드신 부모님을 어떻게 모실지 의논했습니다.`) : L`${wa(one)} 마주 앉아 나이 드신 부모님을 어떻게 모실지 의논했습니다.`)
        : far ? (vc ? "Bạn cùng anh chị em gọi video bàn xem nên chăm sóc bố mẹ già thế nào." : "Bạn cùng anh chị em bàn qua điện thoại cách chăm sóc bố mẹ đã già.") : "Bạn cùng anh chị em ngồi lại bàn xem nên chăm sóc bố mẹ già thế nào.");
      if (a >= 45 && a <= 70 && !noHear()) out.push("Một người anh chị em của bạn gọi điện đến, giọng đầy háo hức: con của họ đã đỗ đại học.");
      const sf = S.flags.sibL || (S.flags.sibL = {});
      if (!sf.r && !far && a <= 35 && !S.fam.married && S.urban && !withParents() && !S.owns.house && !ddKept() && !vowedHome()) out.push({ t: "Để tiết kiệm tiền thuê nhà, bạn ở chung với anh chị em. Nhiều đêm hai người trò chuyện đến khuya.", g: 0.03, f: 'r' });
      if ((sf.t || 0) < 2 && !far && a >= 30 && a <= 70 && !ddKept()) out.push({ t: S.fam.kids.some(k => k.alive && !k.grown && !k.away) ? "Bạn đi du lịch cùng gia đình anh chị em. Bọn trẻ là anh em họ nên chẳng mấy chốc đã thân nhau." : "Lâu lắm rồi bạn mới cùng một người anh chị em đi du lịch, chỉ hai người. Hai người thức trắng đêm kể chuyện ngày bé.", m: 0.02, f: 't' });
      if (!sf.c && S.flags.lossY != null && a - S.flags.lossY <= 1) out.push({ t: far ? "Bạn gọi điện tâm sự với anh chị em về những chuyện khó khăn. Người ấy lặng lẽ lắng nghe rất lâu." : "Bạn tâm sự với một người anh chị em những điều chưa thể nói hết với ai. Người ấy chỉ lặng lẽ ở bên bạn.", f: 'c' });
      if (!sf.y && !far && a >= 60) out.push({ t: one ? L`${wa(one)} 해마다 날을 잡아 만나기로 했습니다. 만날 때마다 어릴 적 이야기가 끝이 없었습니다.` : "Bạn cùng anh chị em hẹn nhau mỗi năm chọn một ngày để sum họp. Lần nào gặp, chuyện ngày bé cũng kể mãi không hết.", f: 'y' });
      if (!out.length) return null;
      let x = pick(out); eff({ so: 2, h: 1 });
      if (x.w != null) { sibWedMark(x.w); x = x.t; }
      if (x.f) { sf[x.f] = (sf[x.f] || 0) + 1; if (!x.m && !x.g) x = x.t; }
      if (x.m) { const m = incomeAt(C(), 0.5) * x.m; S.money -= m; return L`${x.t} (−${wonStr(m)})`; }
      if (x.g) { const m = incomeAt(C(), 0.5) * x.g; S.money += m; return L`${x.t} (+${wonStr(m)})`; }
      return x; } },
  { id: 'hob_life', a: [12, 95], c: () => S.hobbies.some(h => h.lv >= 2) && S.job !== 'prison' && yearRoll('hobl', 0.06), w: 30, rep: 1, gap: 4, run: () => {
      const h = S.hobbies.filter(x => x.lv >= 2).sort((x, y) => y.lv - x.lv)[0], id = h.id.startsWith('sp_') ? 'sport' : h.id, n = hobbyName(h.id), out = [], a0 = S.age;
      const off = hobBodyOff(h); if (off && !S.flags.hobWc) { S.flags.hobWc = 1; eff({ h: 3, so: 1 }); return { t: L`${eun(n)} 이제 경기장 밖에서 응원하며 즐깁니다.`, k: 'warm' }; }
      if (!HOB_SOLO.has(id)) out.push(L`${n} 모임에서 오래 갈 친구를 사귀었습니다.`);
      if ((stressed() || S.st.h < 45) && id !== 'sns') out.push(L`힘든 시기에 ${eun(n)} 마음을 붙들어 준 버팀목이었습니다.`);
      if (S.retired && id !== 'sns') out.push(L`${n} 덕분에 은퇴한 뒤의 하루가 길게 느껴지지 않았습니다.`);
      if (HOB_TEACH.has(id) && !off && S.fam.kids.some(k => k.alive && !k.away && S.age - k.bornAt >= 5 && S.age - k.bornAt <= 15)) out.push(L`아이에게 ${eul(n)} 가르쳐 주었습니다.` + ' ' + teachLook(h.id));
      { const P = S.fam.partner; if (S.fam.married && P && P.alive && !P.divorced && homeOthers().pt && !HOB_SOLO.has(id) && !ddKept() && S.flags.hobPt !== P.name.full) out.push({ t: L`배우자도 ${n}에 재미를 붙여, 둘이 함께하는 날이 늘었습니다.`, pt: 1 }); }
      if (a0 >= 16 && HOB_ACT[id] && !(S.flags.hobAct || []).includes(id) && !(noWalk() && (id === 'hiking' || id === 'dance')) && !off && !ddKept() && !proArtH(h)) out.push({ t: HOB_ACT[id](n), act: id });
      if (h.lv >= 5 && HOB_CONTEST.has(id) && !S.flags.hobCt && a0 < ({ sport: 60, dance: 70 }[id] || 200) && !(id === 'board' && S.flags.boardPro) && !(id === 'games' && S.flags.gamer) && !proSportH(h) && !proArtH(h) && !off && !(id === 'dance' && noWalk())) out.push({ t: L`${n} 동호회 대회에 나가 처음으로 순위에 들었습니다.`, ct: 1 });
      if (!out.length) return null;
      let x = pick(out); if (x.ct) { S.flags.hobCt = S.age; x = x.t; } else if (x.pt) { S.fam.partner.bd = (S.fam.partner.bd || 0) + 2; S.flags.hobPt = S.fam.partner.name.full; x = x.t; } else if (x.act) { (S.flags.hobAct || (S.flags.hobAct = [])).push(x.act); x = x.t; }
      eff({ h: 3, so: 1 }); return { t: x, k: 'warm' }; } },
  { id: 'tmpr_life', a: [10, 75], c: () => !!S.trait && TMPR_EFF[tmprK()] && yearRoll('tmpl', 0.05), w: 30, rep: 1, gap: 6, run: () => {
      const t = tmprK(), a = S.age;
      const lib = (S.urban || C().ppp >= 15000) && !(S.cur === 'CHN' && calYr() >= 1966 && calYr() <= 1976);
      const L0 = { cur: ["Bạn vẫn giữ thói quen hễ tò mò điều gì là tìm hiểu đến tận khuya.", a >= 30 ? "Bạn thích đi về bằng những con đường chưa từng đi. Nhờ vậy mà tìm được một quán quen mới." : !canRead(2) || noSight() ? "Hễ có điều gì chưa biết, bạn lại tìm đến người biết mà hỏi, hỏi mãi." : lib ? "Chọn đại một cuốn sách ở thư viện, bạn đọc quên cả thời gian." : "Hễ thứ gì có chữ, đến cả một mẩu báo cũ, bạn cũng tìm đọc."],
        act: ["Cuối tuần, phải vận động một chút bạn mới thấy dễ chịu.", "Bạn rủ mọi người trong xóm cùng đá bóng cho ra mồ hôi."],
        warm: ["Bạn chủ động bắt chuyện với một người trông có vẻ đang gặp khó khăn. Sau này người ấy đã cảm ơn bạn.", "Ở buổi gặp gỡ nào, việc quan tâm đến người mới đến cũng luôn là phần của bạn."],
        grit: ["Kể cả lúc muốn bỏ cuộc, bạn vẫn thử thêm một lần nữa. Chính lần ấy đã giúp bạn vượt qua.", "Những việc người khác nhanh chóng bỏ dở, bạn vẫn kiên trì đến cùng."] }[t];
      const ls = !ddKept() ? (noWalk() || noSight() ? L0.filter((x, i) => !(t === 'act' && i === 1)) : L0) : t === 'warm' ? ["Khi người trong nhà ốm, bạn lặng lẽ đến ngồi bên cạnh rất lâu."] : L0.filter((x, i) => !(t === 'act' && i === 1));
      eff(t === 'cur' ? { sm: 2 } : t === 'act' ? { hl: 2 } : t === 'warm' ? { so: 2 } : { h: 1, sm: 1 }); return { t: pick(ls), k: 'warm' }; } },
  { id: 'sibling', a: [18, 85], c: () => sibN() > 0, w: 0.5, rep: 1, gap: 12, run: () => { eff({ so: 3, h: 2 });
      const al = sibAliveList(), w = al.length === 1 ? sibCall(al[0]) : null, parLive = S.fam.mom.alive || (S.fam.dad.alive && !S.fam.dad.absent), kinFar = !!farKin() && !ddKept();
      const meet = w ? L`${wa(w)} 부모님 댁에 모여 함께 저녁을 먹었습니다.` : "Anh chị em đều về tụ họp ở nhà bố mẹ.";
      const talk = kinFar ? (w ? L`고향의 ${wa(w)} 전화로 부모님 이야기를 나눴습니다.` : "Bạn gọi điện cho anh chị em ở quê, cùng trò chuyện về bố mẹ.") : w ? L`${wa(w)} 만나 부모님 이야기를 나눴습니다.` : "Anh chị em tụ họp lại, cùng trò chuyện về bố mẹ.";
      if (ddLv() === 3) return parLive ? meet : talk;
      const sibIn = ddKept() || withParents() || S.flags.ddHome === 'sib', vc = calYr() >= 2010;
      return varied(sibIn ? 'sibk' : 'sib', [...(sibIn ? [] : [w ? L`${wa(w)} 밤늦게까지 통화했습니다. 어릴 적 이야기에 한참 웃었습니다.` : "Bạn gọi điện cho anh chị em đến tận khuya. Kể chuyện ngày bé mà cười mãi."]), parLive ? (S.flags.parCame != null && farKin() ? (w ? (vc ? L`고향의 ${iga(w)} 영상통화로 함께 사는 ${parW()}께 안부를 여쭈었습니다.` : L`고향의 ${iga(w)} 함께 사는 ${parW()}께 안부 편지를 보내왔습니다.`) : vc ? L`고향의 형제자매들이 영상통화로 함께 사는 ${parW()}께 안부를 여쭈었습니다.` : L`고향의 형제자매들이 함께 사는 ${parW()}께 안부 편지를 보내왔습니다.`)
        : parAbroad() ? (w ? (vc ? L`고향의 ${iga(w)} 부모님 댁에 들렀다며 영상통화를 걸어 왔습니다.` : L`고향의 ${iga(w)} 부모님 댁에 들렀다는 편지를 받았습니다.`) : vc ? "Anh chị em ở quê gọi video cho bạn, kể rằng mọi người đã tụ họp ở nhà bố mẹ." : "Bạn nhận được thư báo rằng anh chị em ở quê đã tụ họp ở nhà bố mẹ.") : meet) : talk, w ? L`${wa(w)} 크게 다퉜다가 몇 달 만에 화해했습니다.` : "Bạn cãi nhau to với anh chị em, mấy tháng sau mới làm lành."]); } },
  { id: 'scam', a: [22, 95], c: () => S.money > incomeAt(C(), 0.5) * 0.3 && C().ppp > 2500 && (S.flags.lastScam == null || S.age - S.flags.lastScam >= 25) && yearRoll('scam', S.age >= 65 ? 0.035 : 0.015), w: () => (S.age >= 65 ? 1 : 0.6) * (S.st.sm > 70 ? 0.6 : 1), run: () => {
      S.flags.lastScam = S.age; const x = Math.min(S.money * 0.15, incomeAt(C(), 0.5) * 0.5); S.money -= x; eff({ h: -5 });
      const t = S.age >= 60 && S.fam.kids.some(k => k.alive) ? L`자녀를 사칭한 다급한 연락에 속아 돈을 보냈습니다. (−${wonStr(x)})` : calYr() < 2010 ? L`그럴듯한 투자 권유에 속아 돈을 잃었습니다. (−${wonStr(x)})` : pick([L`그럴듯한 투자 권유에 속아 돈을 잃었습니다. (−${wonStr(x)})`, L`문자 속 링크를 눌렀다가 계좌에서 돈이 빠져나갔습니다. (−${wonStr(x)})`]);
      return { t, k: 'bad', f: S.cur === 'USA' && S.age >= 60 ? "Năm 2023, số tiền bị lừa đảo mà người từ 60 tuổi trở lên ở Mỹ trình báo là khoảng 3,4 tỷ đô la (FBI IC3)" : null }; } },
  { id: 'richgift', a: [28, 45], c: () => !!(S.flags.rich && S.flags.richQ) && !S.flags.richGift && famCanHelp() && yearRoll('richgift', 0.12), w: 3, run: () => {
      const b = B(), gross = wealthAt(b, S.flags.richQ) * 0.15 * (0.6 + 0.6 * rnd()) / (1 + Math.min(6, sibN())), tax = gross * (EST_TAX[b.id] || 0), amt = gross - tax;
      S.flags.richGift = 1; S.money += amt; if (S.fam.married) S.flags.sepM = (S.flags.sepM || 0) + amt; eff({ h: 2 });
      return { t: L`부모님이 재산의 일부를 미리 물려주었습니다. (+${wonStr(amt)})` + (tax > 0 ? ' ' + L`증여세로 ${wonStr(tax)}을 냈습니다.` : ''), k: 'note' }; } },
  { id: 'kidback', a: [42, 80], c: () => !lowInc(C()) && !S.flags.kidBack && S.fam.kids.some(kidBackOK) && yearRoll('kidback', 0.06), w: 1, run: () => {
      const k = pick(S.fam.kids.filter(kidBackOK)), x = incomeAt(C(), 0.5) * 0.04; S.flags.kidBack = 1; S.money -= x; eff({ so: 2, h: 1 });
      return L`독립했던 ${iga(callName(k.name))} 일을 그만두고 한동안 집에 돌아와 지냈습니다. 오랜만에 식탁이 북적였습니다. (−${wonStr(x)})`; } },
  { id: 'volunteer', a: [16, 82], c: () => S.st.so > 40 && yearRoll('vol', S.focus === 'faith' ? 0.3 : 0.08), w: () => 0.2 + (S.focus === 'faith' ? 0.5 : 0), rep: 1, gap: 14, run: () => { eff({ h: 3, so: 3 });
      return { t: varied('vol', [S.urban ? "Cuối tuần nào bạn cũng đi làm tình nguyện, xới cơm ở một bếp ăn miễn phí." : "Bạn góp sức sửa con đường của làng.", "Bạn đến một vùng bị thiên tai để giúp khắc phục hậu quả.", S.edu >= 3 && !ddKept() && !ddIDk(S.dd) && S.st.sm >= 40 ? "Bạn dạy học cho những đứa trẻ có hoàn cảnh khó khăn." : "Bạn phụ một tay chăm sóc người hàng xóm bị ốm."]),
        f: "Hơn 1 trên 5 người trưởng thành trên thế giới cho biết đã làm tình nguyện trong tháng vừa qua (CAF World Giving Index)" }; } },
  { id: 'licret', a: [65, 105], c: () => (S.owns.car != null || S.owns.moto != null) && S.flags.licRet == null && S.job !== 'driver' && S.job !== 'delivery' && S.job !== 'prison' && LIC_RET[S.cur] && calYr() >= LIC_RET[S.cur][0]
      && yearRoll('licret', S.age >= 75 ? LIC_RET[S.cur][2] : LIC_RET[S.cur][1]), w: 30, run: () => {
      S.flags.licRet = S.age; let v = 0; const car = S.owns.car != null;
      if (S.owns.car != null) { v += carValue(); delete S.owns.car; S.flags.soldCar = S.age; }
      if (S.owns.moto != null) { v += usd2ppp(C(), 400); delete S.owns.moto; S.flags.noMoto = 1; }
      S.money += v; book("Tiền bán xe", v); eff({ h: -1 });
      return { t: car ? L`운전면허를 스스로 반납하고 차를 팔았습니다. 이제 가까운 곳은 걸어서, 먼 곳은 버스나 택시로 다닙니다. (+${wonStr(v)})` : L`운전면허를 스스로 반납하고 오토바이를 팔았습니다. 이제 가까운 곳은 걸어서, 먼 곳은 버스나 택시로 다닙니다. (+${wonStr(v)})`, f: LIC_RET[S.cur][3]() }; } },
  { id: 'graying', a: [26, 55], c: () => !S.flags.gray && yearRoll('gray', S.age < 30 ? 0.03 : 0.1), w: 30, run: () => { S.flags.gray = 1; eff({ h: -1 }); return S.age < 38 ? "Bạn phát hiện sợi tóc bạc đầu tiên trong gương." : pick(["Bạn phát hiện sợi tóc bạc đầu tiên trong gương.", "Leo cầu thang mà hụt hơi, bạn bật cười. Bạn đang già đi."]); } },
  { id: 'anniv', a: [28, 125], c: () => { const f = S.fam, y = anvY(); return f.married && f.partner && f.partner.alive && y >= 10 && y % 10 === 0 && !S.flags[anvK(y)]; }, w: 4, run: () => {
      const f = S.fam, y = anvY(), who = callName(f.partner.name); S.flags[anvK(y)] = 1; eff({ h: 4, so: 3 });
      if (ptAway()) return { t: legalWed() ? L`결혼 ${y}주년. 멀리 떨어져 지내는 ${wa(who)} 전화로 서로를 축하했습니다.` : L`함께한 지 ${y}년. 멀리 떨어져 지내는 ${wa(who)} 전화로 서로를 축하했습니다.`, k: 'warm' };
      if (!legalWed()) return { t: varied('anvS', [L`함께한 지 ${y}년. ${wa(who)} 조촐하게 저녁을 먹었습니다.`, L`함께한 지 ${y}년. ${wa(who)} 처음 만난 곳을 다시 찾았습니다.`, L`함께한 지 ${y}년. ${iga(who)} 손편지를 건넸습니다.`]), k: 'warm' };
      if (y >= 50) return { t: f.kids.some(k => k.alive) ? L`결혼 ${y}주년. 자녀들이 작은 잔치를 열어 주었습니다.` : L`결혼 ${y}주년. 둘이서 처음 만난 곳을 다시 찾았습니다.`, k: 'warm' };
      return { t: varied('anv', [L`결혼 ${y}주년. ${wa(who)} 조촐하게 저녁을 먹었습니다.`, L`결혼 ${y}주년. ${wa(who)} 오래된 결혼사진을 꺼내 보았습니다.`, L`결혼 ${y}주년. ${iga(who)} 손편지를 건넸습니다.`]), k: 'warm' }; } },
  { id: 'teachjr', a: [38, 64], c: () => isWorking() && (S.jobY || 0) >= 8, w: 0.5, rep: 1, gap: 8, run: () => { eff({ h: 2, so: 2 });
      return JOBS[S.job].s.startsWith('agr') ? "Bạn dạy một người trẻ trong xóm cách làm nông. Bạn nhớ lại chính mình ngày trước." : SELF_JOBS.includes(S.job) && !(S.job === 'owner' && BIZ_K[S.flags.bizK] && BIZ_K[S.flags.bizK].pro) ? "Bạn chỉ cho một người trẻ đến học việc những mẹo nghề. Bạn nhớ lại chính mình ngày trước." : "Bạn hướng dẫn công việc cho một đồng nghiệp mới vào. Bạn nhớ lại chính mình ngày trước."; } },
  { id: 'redevelop', a: [20, 85], c: () => S.urban && !S.flags.redev && !careNow() && (['eap', 'sa', 'ssa', 'lac', 'mena'].includes(C().p) || C().id === 'KOR') && yearRoll('redev', 0.008), w: 1, run: () => {
      S.flags.redev = 1; const m = incomeAt(C(), 0.5);
      if (S.house) { const x = m * 0.3; S.money += x; eff({ h: 2 }); return L`살던 동네가 재개발되면서 보상금을 받고 새 집으로 옮겼습니다. (+${wonStr(x)})`; }
      const x = m * 0.05; S.money -= x; eff({ h: -3, so: -2 }); return { t: L`세 들어 살던 동네가 재개발로 헐려, 정든 이웃들과 흩어졌습니다. (−${wonStr(x)})`, k: 'bad' }; } },
  { id: 'rift', a: [20, 70], c: () => !S.flags.rift && S.job !== 'prison' && !S.flags.hideCN && yearRoll('rift', 0.004), w: 30, run: () => {
      const sl = sibAliveList().filter(x => x.age >= 15), s = sl.length && chance(0.65) ? pick(sl) : null, sib = !!s;
      S.flags.rift = sib ? { at: S.age, who: 'sib', i: s.i } : { at: S.age, who: 'fr' }; eff({ h: -2, so: -2 });
      const w = sib ? sibCall(s) : '';
      return { t: sib ? pick([L`돈 문제로 ${wa(w)} 크게 다투고 연락을 끊었습니다.`, L`사소한 말다툼이 커져 ${wa(w)} 연락을 끊고 지내게 되었습니다.`]) : "Bạn cãi nhau to với một người bạn lâu năm rồi cắt đứt liên lạc.", k: 'bad' }; } },
  { id: 'noise', a: [20, 85], c: () => S.urban && !careNow() && yearRoll('noise', 0.04), w: 0.5, rep: 1, gap: 20, run: () => { eff({ so: 1 }); return pick(["Bạn to tiếng với hàng xóm vì chuyện ồn ào, rồi làm lành khi chia nhau món ăn.", "Bạn và người hàng xóm từng hay cãi nhau vì chuyện vặt, từ lúc nào đã thành những người hay hỏi thăm nhau."]); } },
  { id: 'scare', a: [40, 78], c: () => (C().p === 'hi' || C().p === 'eca' || S.pct > 0.6) && !Object.keys(S.conds).length && (S.flags.lastScare == null || S.age - S.flags.lastScare >= 15), w: 0.35, run: () => {
      S.flags.lastScare = S.age; eff({ h: -1, hl: 2 }); return noWalk() ? "Kết quả khám sức khỏe có điểm bất thường nên bạn đi kiểm tra kỹ hơn. May mà không có gì. Từ đó bạn bắt đầu vận động nhiều hơn một chút." : "Kết quả khám sức khỏe có điểm bất thường nên bạn đi kiểm tra kỹ hơn. May mà không có gì. Từ đó bạn bắt đầu đi bộ nhiều hơn một chút."; } },
  { id: 'oh_kid', a: [70, 125], c: () => S.flags.oldHome === 'kid', w: 1.5, rep: 1, gap: 3, run: () => {
      const k = S.fam.kids.find(x => x.withMe && x.alive && !kidInPr(x)), n = k ? callName(k.name) : ''; eff({ h: 2, so: 2 });
      const gs = (S.fam.grand || []).some(g => !g.gone && S.age - g.bornAt >= 6 && S.age - g.bornAt <= 17);
      if (!k) return gs ? "Đi học về, các cháu ghé phòng bạn trước tiên." : "Cùng nhau nấu món ăn dịp lễ Tết, bạn kể chuyện ngày xưa.";
      const fruit = kidWorks(k) ? L`${iga(n)} 퇴근길에 내가 좋아하는 과일을 사 왔습니다.` : L`${iga(n)} 장에 다녀오는 길에 내가 좋아하는 과일을 사 왔습니다.`;
      return varied('ohkid', [gs ? "Đi học về, các cháu ghé phòng bạn trước tiên." : fruit, fruit,
        "Sống chung một nhà nên đôi khi cũng cãi nhau vì chuyện vặt, nhưng đến tối lại cười với nhau.", "Cùng nhau nấu món ăn dịp lễ Tết, bạn kể chuyện ngày xưa."]); } },
  { id: 'oh_care', a: [70, 125], c: () => S.flags.oldHome === 'care', w: 1.5, rep: 1, gap: 3, run: () => {
      eff({ h: 1, so: 1 });
      const ab = S.fam.kids.some(k => k.alive && k.abroad && !nkCut(k)), near = S.fam.kids.some(k => k.alive && !k.abroad && !k.away);
      return varied('ohcare', [near ? "Cuối tuần, các con đến viện dưỡng lão thăm bạn." : ab && !(eraBefore(2010) && noHear()) ? (eraBefore(2010) ? "Đứa con sống ở nước ngoài gọi điện đến viện dưỡng lão. Bạn cầm ống nghe rất lâu." : "Đứa con sống ở nước ngoài gọi video đến viện dưỡng lão. Bạn ngắm gương mặt trên màn hình thật lâu.") : "Bạn có thêm một người bạn ở viện dưỡng lão. Ngày nào hai người cũng đi dạo cùng nhau.", "Bạn có thêm một người bạn ở viện dưỡng lão. Ngày nào hai người cũng đi dạo cùng nhau.",
        ...(noHear() ? [] : ["Ở lớp hát của viện dưỡng lão, lần đầu tiên sau nhiều năm bạn hát thật to."]), "Từ chỗ ngồi bên cửa sổ, bạn ngắm các mùa đổi thay.", "Ngày sinh nhật, mọi người ở viện dưỡng lão cắm nến lên một chiếc bánh nhỏ cho bạn."]); } },
  { id: 'kidcall', a: [50, 105], c: () => S.fam.kids.some(kidApart), w: 0.5, rep: 1, gap: 9, run: () => {
      const k = pick(S.fam.kids.filter(kidApart)), n = callName(k.name), far = k.abroad || !k.near; eff({ h: 2, so: 2 });
      const call = !far ? L`따로 사는 ${iga(n)} 안부 전화를 걸어 왔습니다.` : C().ppp > 4000 && !eraBefore(2010) ? L`멀리 사는 ${iga(n)} 영상 통화를 걸어 왔습니다.` : L`멀리 사는 ${iga(n)} 안부 전화를 걸어 왔습니다.`;
      return varied(careNow() ? 'kcc' : 'kc', k.abroad ? [call] : [call, L`${iga(n)} 내 생일을 잊지 않고 찾아왔습니다.`, ...(careNow() ? [] : [L`${iga(n)} 집 안 고장 난 곳을 말없이 고쳐 놓고 갔습니다.`])]); } },
  { id: 'wallet', a: [12, 88], c: () => !S.flags.wallet && yearRoll('wallet', 0.005), w: 1, run: () => { S.flags.wallet = 1; eff({ h: 3 });
      return { t: "Một người lạ nhặt được chiếc ví bạn đánh rơi và trả lại. Thế giới ấm áp hơn bạn nghĩ.", k: 'warm', f: "Trong một thí nghiệm cố ý “đánh rơi” hơn 17.000 chiếc ví ở 40 quốc gia, những chiếc ví có tiền bên trong lại được trả về cho chủ thường xuyên hơn (Science, 2019)" }; } },
  { id: 'kindhelp', a: [60, 105], c: () => yearRoll('kind', 0.08), w: 0.5, rep: 1, gap: 12, run: () => { eff({ h: 2, so: 1 }); return pick(["Khi bạn ngã trên đường, một học sinh đi ngang qua đã đỡ bạn dậy.", ...(careNow() ? [] : ["Bạn đang xách đồ nặng thì một người lạ mang giúp đến tận cửa nhà."])]); } },
  { id: 'repay', a: [20, 100], c: () => S.flags.lent && S.age - S.flags.lent.at >= 1, w: () => S.age - S.flags.lent.at >= 3 ? 4 : 1.2, run: () => {
      const L0 = S.flags.lent; S.flags.lent = null;
      if (L0.ok) { S.money += L0.amt; eff({ h: 3, so: 3 }); return L`친구가 빌려 간 돈을 갚았습니다. 고맙다며 밥을 샀습니다. (+${wonStr(L0.amt)})`; }
      if (chance(0.35)) { eff({ so: -4, h: -3 }); return { t: "Số tiền cho vay không bao giờ được trả lại, và bạn cũng xa cách người bạn ấy.", k: 'bad' }; }
      eff({ h: -1 }); return "Số tiền cho vay không bao giờ được trả lại. Nhưng bạn không mất đi người bạn ấy."; } },
];
const EVMAP = {};
EVENTS.forEach(e => { EVMAP[e.id] = e; });
const proSportH = h => { const sp = (S.ath && S.ath.sp) || S.flags.athSp; return !!sp && h.id.startsWith('sp_') && hobbyName(h.id) === sp; };
const PRO_ART_H = { musician: ['music', 'karaoke'], idol: ['music', 'karaoke', 'dance'], dancer: ['dance'], artist: ['art'] };
const proArtMark = id => { if (S && PRO_ART_H[id]) { const a = S.flags.proArt || (S.flags.proArt = []); if (!a.includes(id)) a.push(id); } };
const proArtH = h => [S.job, S.flags.lastJob, S.idol ? 'idol' : null, ...(S.flags.proArt || [])].some(j => j && PRO_ART_H[j] && PRO_ART_H[j].includes(h.id));
let ONCE_SET = null;
const onceLines = () => ONCE_SET || (ONCE_SET = new Set(["Lần đầu tiên bạn ra sân trong đội hình xuất phát ở giải đấu của đội trẻ.", "Lần đầu tiên bạn nhận một vai có tên riêng, trong một bộ phim độc lập.",
  "Lần đầu tiên bạn biên đạo một tác phẩm ngắn.", "Bạn mở triển lãm cá nhân đầu tiên tại một phòng tranh nhỏ.", "Trong lớp tiếng Hàn, lần đầu tiên bạn tự giới thiệu bằng tiếng Hàn.",
  "Lần đầu tiên bạn phát hành một bài hát do chính mình sáng tác.", "Dự luật đầu tiên do bạn đứng tên đề xuất đã được quốc hội thông qua."]));
function varied(key, list) {
  const k = 'vt_' + key, last = S.flags[k], told = S.flags.vOnce || [], once = onceLines();
  const fresh = i => !(once.has(list[i]) && told.includes(list[i]));
  const opts = list.map((t, i) => i).filter(i => i !== last && fresh(i)), rest = list.map((t, i) => i).filter(fresh);
  const i = opts.length ? pick(opts) : rest.length ? rest[0] : 0; S.flags[k] = i;
  if (once.has(list[i]) && !told.includes(list[i])) S.flags.vOnce = told.concat([list[i]]);
  return list[i];
}
function promoInformal(j) {
  const word = "Tiếng lành về tay nghề của bạn lan ra, thu nhập của bạn tăng lên.", more = "Nhiều người tìm đến hơn, việc làm cũng nhiều hơn.", regulars = "Bạn có khách quen, thu nhập khá lên.";
  const skill = "Tay nghề được công nhận, tiền công của bạn tăng lên.", boss = "Được tổ trưởng để ý, tiền công nhật của bạn tăng lên.", raise = "Làm việc giỏi được ghi nhận, lương tháng của bạn tăng lên.";
  if (['vendor', 'hair', 'artisan', 'mechanic', 'electric', 'driver', 'creator', 'musician'].includes(j)) return [word, more, regulars];
  if (j === 'domestic') return ["Số nhà thuê bạn làm thường xuyên tăng lên, thu nhập khá hơn.", word];
  if (j === 'fisher') return ["Bạn biết được chỗ cá hay tụ về, thu nhập tăng lên.", "Bạn có được chỗ làm trên một con thuyền lớn hơn, thu nhập tăng lên."];
  if (j === 'herder') return ["Đàn gia súc sinh sôi, thu nhập tăng lên.", "Tiếng lành bạn nuôi gia súc giỏi lan ra, bạn bán được giá cao hơn."];
  if (j === 'agbiz') return ["Mùa màng bội thu hơn, nông trại làm ăn khá lên.", "Bạn tìm được mối buôn tốt, nông sản bán được giá cao hơn."];
  if (['construct', 'farmhand'].includes(j)) return [skill, boss, more];
  if (['factory', 'garment', 'miner'].includes(j)) return [skill, boss, "Làm quen tay nên mỗi ngày bạn làm được nhiều hơn. Thu nhập cũng tăng lên."];
  if (j === 'delivery') return ["Làm quen tay nên mỗi ngày bạn kiếm được nhiều tiền hơn.", more];
  if (j === 'cook') return [skill, raise];
  return [raise, "Nhờ nhiều năm chăm chỉ làm việc, tiền công của bạn tăng lên."];
}