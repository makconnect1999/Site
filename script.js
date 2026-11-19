(function () {
  'use strict';

  // Ano no rodapé
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu mobile
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  function closeMenu() {
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menu');
  }
  menuBtn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });

  // Logo 3D: camadas de profundidade
  var mark = document.getElementById('mark');
  var top = mark.querySelector('.mark-top');
  for (var i = 14; i >= 1; i--) {
    var layer = document.createElement('div');
    layer.className = 'mark-layer';
    layer.textContent = 'MAK';
    layer.style.color = 'hsl(36, 8%, ' + Math.max(10, 74 - i * 4.4) + '%)';
    layer.style.transform = 'translateZ(' + (-i * 2.2).toFixed(1) + 'px)';
    mark.insertBefore(layer, top);
  }

  // Inclinação do hero acompanhando o cursor
  var stage = document.getElementById('stage');
  var scene = document.getElementById('scene');
  stage.addEventListener('mousemove', function (e) {
    var r = stage.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    scene.style.setProperty('--tx', (-8 - y * 22).toFixed(1) + 'deg');
    scene.style.setProperty('--ty', (14 + x * 34).toFixed(1) + 'deg');
  });
  stage.addEventListener('mouseleave', function () {
    scene.style.setProperty('--tx', '-8deg');
    scene.style.setProperty('--ty', '14deg');
  });

  // Faixa de valores
  var words = ['Valorização da criadora', 'Alinhamento estratégico', 'Transparência', 'Excelência na execução', 'Atendimento personalizado', 'Credibilidade'];
  var marquee = document.getElementById('marquee');
  words.concat(words).forEach(function (w) {
    var s = document.createElement('span');
    s.textContent = w;
    s.appendChild(document.createElement('i'));
    marquee.appendChild(s);
  });

  // Cartão Influenciadora / Marca
  var card = document.getElementById('card3d');
  var btnInf = document.getElementById('btn-inf');
  var btnMarca = document.getElementById('btn-marca');
  var faceInf = document.getElementById('face-inf');
  var faceMarca = document.getElementById('face-marca');
  var perfil = document.getElementById('f-perfil');
  function setSide(side) {
    var isInf = side !== 'marca';
    card.classList.toggle('flipped', !isInf);
    btnInf.setAttribute('aria-pressed', String(isInf));
    btnMarca.setAttribute('aria-pressed', String(!isInf));
    faceInf.setAttribute('aria-hidden', String(!isInf));
    faceMarca.setAttribute('aria-hidden', String(isInf));
    perfil.selectedIndex = isInf ? 0 : 1;
  }
  btnInf.addEventListener('click', function () { setSide('inf'); });
  btnMarca.addEventListener('click', function () { setSide('marca'); });
  document.querySelectorAll('[data-side]').forEach(function (a) {
    a.addEventListener('click', function () { setSide(a.getAttribute('data-side')); });
  });
  setSide('inf');

  // Cartões de valores: toque/Enter para girar
  document.querySelectorAll('.flip').forEach(function (f) {
    f.addEventListener('click', function () { f.classList.toggle('on'); });
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f.classList.toggle('on'); }
    });
  });

  // Revelar ao rolar
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.2 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Formulário de contato
  // Enquanto não houver um serviço de envio, a mensagem abre no app de e-mail.
  var CONTACT_EMAIL = '[SEU E-MAIL]';
  var form = document.getElementById('form');
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      f.setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    if (!ok) { status.textContent = 'Preencha nome, um e-mail válido e a mensagem.'; return; }
    var d = new FormData(form);
    var body = 'Nome: ' + d.get('nome') + '\nE-mail: ' + d.get('email') + '\nPerfil: ' + d.get('perfil') + '\n\n' + d.get('mensagem');
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Contato pelo site — ' + d.get('perfil')) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Abrimos seu app de e-mail com a mensagem pronta. Obrigada!';
  });
})();
