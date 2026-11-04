/* Funil do site: cada etapa vai para o Supabase (funnel_events, pela função "evento"), com o aparelho em que
   aconteceu. Nada sobre a pessoa: só um código aleatório guardado no navegador, a etapa, o aparelho e o anúncio. */
(function(){
  const URL = 'https://oqclsemdwzpsdyjbfxyh.supabase.co/functions/v1/evento';
  const ua = navigator.userAgent;
  const celular = /iPhone|iPad|iPod|Android/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua) && innerWidth < 1100);
  const os = /iPhone|iPad|iPod/.test(ua) || (celular && /Macintosh/.test(ua)) ? 'ios' : /Android/.test(ua) ? 'android'
    : /Windows/.test(ua) ? 'windows' : /Macintosh|Mac OS/.test(ua) ? 'mac' : /Linux/.test(ua) ? 'linux' : 'outro';
  const br = /Instagram/.test(ua) ? 'instagram' : /FBAN|FBAV|FB_IAB|FBIOS/.test(ua) ? 'facebook'
    : /CriOS|Chrome/.test(ua) ? 'chrome' : /Safari/.test(ua) ? 'safari' : 'outro';
  const novo = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  let v = null;
  try { v = localStorage.getItem('obtura_v'); if (!v || !/^[a-z0-9]{8,40}$/.test(v)) { v = novo(); localStorage.setItem('obtura_v', v); } }
  catch (e) { v = v || novo(); }
  // o anúncio que trouxe a pessoa vale para a visita inteira
  const utm = {};
  try { const q = new URLSearchParams(location.search);
    ['utm_source', 'utm_campaign', 'utm_content'].forEach(k => { const x = q.get(k); if (x) sessionStorage.setItem('obtura_' + k, x);
      utm[k] = x || sessionStorage.getItem('obtura_' + k) || undefined; }); } catch (e) {}
  const send = (e, d, extra) => {
    const body = JSON.stringify(Object.assign({v, e, d: d || undefined, dev: celular ? 'celular' : 'computador', os, br,
      src: utm.utm_source, cmp: utm.utm_campaign, cnt: utm.utm_content, ref: window.OBTURA_REF || undefined}, extra || {}));
    try { if (!(navigator.sendBeacon && navigator.sendBeacon(URL, body)))
      fetch(URL, {method: 'POST', body, keepalive: true, headers: {'Content-Type': 'text/plain'}}).catch(() => {}); } catch (e) {}
  };
  window.funil = {send, celular, os, novoLink: novo};
})();
