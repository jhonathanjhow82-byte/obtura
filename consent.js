/* Cookies e rastreadores do site (LGPD): nada de Meta Pixel, Google Ads ou Microsoft Clarity antes de a pessoa
   aceitar. A escolha fica no navegador (localStorage "obtura_consent", 12 meses) e pode ser mudada a qualquer hora
   pelo link "Cookies" do rodapé. Recusar é tão fácil quanto aceitar (mesmo tamanho, mesma tela).
   Categorias:
     - medicao: Microsoft Clarity (como as pessoas usam a página) e o código fixo do funil no navegador (funil.js);
     - anuncios: Meta Pixel e a tag do Google Ads (medir os anúncios).
   Sem escolha ou com recusa, nenhum desses scripts é carregado e nenhum cookie deles é gravado. */
(function () {
  var KEY = 'obtura_consent', VERSAO = 1, VALIDADE = 365 * 864e5;
  // data-so-aviso: página sem rastreadores (privacidade, termos): mostra o aviso e guarda a escolha, sem carregar nada
  var SO_AVISO = !!(document.currentScript && document.currentScript.hasAttribute('data-so-aviso'));
  var PIXELS = ['507503567409457', '1432541521585388'], GADS = 'AW-18558939916', CLARITY = 'z29b1lan3m';

  function ler() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && c.v === VERSAO && Date.now() - (+c.t || 0) < VALIDADE) return c;
    } catch (e) {}
    return null;
  }
  function gravar(medicao, anuncios) {
    var c = { v: VERSAO, medicao: !!medicao, anuncios: !!anuncios, t: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    return c;
  }
  function script(src) {
    var s = document.createElement('script'); s.async = true; s.src = src;
    document.head.appendChild(s);
  }

  var carregou = { medicao: false, anuncios: false };
  function carregar(c) {
    if (SO_AVISO) return;
    if (c.anuncios && !carregou.anuncios) {
      carregou.anuncios = true;
      /* Meta Pixel */
      !function (f, b, e, v, n) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; script(v);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      PIXELS.forEach(function (id) { window.fbq('init', id); });
      window.fbq('track', 'PageView');
      /* Google Ads */
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', GADS);
      script('https://www.googletagmanager.com/gtag/js?id=' + GADS);
    }
    if (c.medicao && !carregou.medicao) {
      carregou.medicao = true;
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      script('https://www.clarity.ms/tag/' + CLARITY);
    }
    if (window.funil && window.funil.consentiu) window.funil.consentiu(!!c.medicao);
    try { document.dispatchEvent(new CustomEvent('obtura:consent', { detail: c })); } catch (e) {}
  }

  var css = '#ckb{position:fixed;left:12px;right:12px;bottom:12px;z-index:200;max-width:560px;margin:0 auto;' +
    'background:#141418;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:16px;padding:18px 18px 16px;' +
    'font:15px/1.5 Inter,system-ui,-apple-system,sans-serif;box-shadow:0 20px 60px -10px rgba(0,0,0,.8)}' +
    '#ckb h2{font-size:16px;margin:0 0 6px}#ckb p{color:#d6d6de;margin:0 0 12px;font-size:14px}' +
    '#ckb a{color:#FFB98A;text-decoration:underline}' +
    '#ckb .ckb-row{display:flex;gap:8px;flex-wrap:wrap}' +
    '#ckb button{flex:1 1 140px;font:inherit;font-weight:600;font-size:15px;padding:11px 14px;border-radius:999px;cursor:pointer;' +
    'border:1px solid rgba(255,255,255,.35);background:#26262e;color:#fff;min-height:44px}' +
    '#ckb button:hover{background:#33333d}#ckb button:focus-visible,#ckb input:focus-visible{outline:3px solid #FFCD5A;outline-offset:2px}' +
    '#ckb .ckb-ops{display:none;margin:0 0 12px;padding:0;list-style:none}#ckb.mais .ckb-ops{display:block}' +
    '#ckb .ckb-ops li{margin:8px 0;font-size:14px;color:#d6d6de}#ckb label{display:flex;gap:10px;align-items:flex-start;cursor:pointer}' +
    '#ckb input{width:20px;height:20px;margin-top:2px;flex:none;accent-color:#EB3C8C}' +
    '#ckb .ckb-salvar{display:none}#ckb.mais .ckb-salvar{display:block}#ckb.mais .ckb-pers{display:none}';

  function banner(atual) {
    var velho = document.getElementById('ckb'); if (velho) velho.remove();
    var st = document.getElementById('ckb-css');
    if (!st) { st = document.createElement('style'); st.id = 'ckb-css'; st.textContent = css; document.head.appendChild(st); }
    var d = document.createElement('section');
    d.id = 'ckb'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Cookies');
    d.innerHTML =
      '<h2>Cookies</h2>' +
      '<p>Usamos cookies para medir os anúncios (Meta e Google) e entender como o site é usado (Microsoft Clarity). ' +
      'Só ligamos com o seu ok. <a href="/privacidade/#cookies">Saiba mais</a></p>' +
      '<ul class="ckb-ops">' +
      '<li><label><input type="checkbox" checked disabled> <span><b>Necessários</b>: guardar esta escolha e o código de embaixador do link. Sempre ligados.</span></label></li>' +
      '<li><label><input type="checkbox" id="ckb-med"> <span><b>Medição</b>: Microsoft Clarity (cliques e rolagem, sem o que você digita) e as etapas da visita.</span></label></li>' +
      '<li><label><input type="checkbox" id="ckb-ads"> <span><b>Anúncios</b>: Meta Pixel e Google Ads, para saber quais anúncios trazem quem baixa o Obtura.</span></label></li>' +
      '</ul>' +
      '<div class="ckb-row">' +
      '<button type="button" id="ckb-nao">Recusar</button>' +
      '<button type="button" id="ckb-sim">Aceitar</button>' +
      '<button type="button" class="ckb-pers" id="ckb-pers">Escolher</button>' +
      '<button type="button" class="ckb-salvar" id="ckb-salvar">Salvar escolha</button>' +
      '</div>';
    document.body.appendChild(d);
    var med = d.querySelector('#ckb-med'), ads = d.querySelector('#ckb-ads');
    if (atual) { med.checked = !!atual.medicao; ads.checked = !!atual.anuncios; d.classList.add('mais'); }
    function fim(c) {
      d.remove();
      var antes = ler();
      // quem tinha aceitado e agora recusa: os scripts já carregados só saem ao recarregar a página
      if (antes && ((antes.medicao && !c.medicao) || (antes.anuncios && !c.anuncios)) && (carregou.medicao || carregou.anuncios)) {
        gravar(c.medicao, c.anuncios); location.reload(); return;
      }
      carregar(gravar(c.medicao, c.anuncios));
    }
    d.querySelector('#ckb-nao').onclick = function () { fim({ medicao: false, anuncios: false }); };
    d.querySelector('#ckb-sim').onclick = function () { fim({ medicao: true, anuncios: true }); };
    d.querySelector('#ckb-pers').onclick = function () { d.classList.add('mais'); med.focus(); };
    d.querySelector('#ckb-salvar').onclick = function () { fim({ medicao: med.checked, anuncios: ads.checked }); };
  }

  window.obturaConsent = {
    estado: function () { return ler(); },
    abrir: function () { banner(ler()); }
  };
  function iniciar() {
    var c = ler();
    if (c) carregar(c); else banner(null);
    document.querySelectorAll('[data-cookies]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); window.obturaConsent.abrir(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
