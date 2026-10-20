// js/app.js - Khoi dong app
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
  a2Init();
    if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ S, prefs: UI.prefs }));
  requestAnimationFrame(t => { last = t; frame(t); });
}
if (ROOT_AWAY) { } else if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start); else start((window.claude && window.claude.hot && window.claude.hot.data) || {});