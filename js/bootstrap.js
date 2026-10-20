// js/bootstrap.js - don dep localStorage + bo ?edu khoi URL (chay truoc app)
try {
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.includes('pref')) {
      const v = JSON.parse(localStorage.getItem(k) || '{}');
      if (v && v.edu) { delete v.edu; localStorage.setItem(k, JSON.stringify(v)); }
    }
  }
} catch(e){}
if (location.search && /[?&]edu(=|&|$)/.test(location.search)) {
  history.replaceState(null, '', location.pathname);
}
