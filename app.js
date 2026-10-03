/* Catarina Gelato — delivery
   Produtos, preços, descrições e horários vêm da página do iFood da loja.
   A lista de sabores (FLAVORS), as opções de Cafés/Bebidas e a taxa de entrega
   são EXEMPLOS e devem ser ajustados no objeto MENU / STORE abaixo. */

const STORE = {
  name: 'Catarina Gelato Cavaleiros',
  rating: '4,9',
  // horários reais (iFood), 0 = domingo
  hours: { 0: [12.25, 20.5], 1: [12.25, 20.5], 2: [12.25, 20.5], 3: [12.25, 20.5], 4: [12.25, 21.5], 5: [12.25, 21.5], 6: [12.25, 21.5] },
  deliveryFee: 0,    // grátis (iFood)
  eta: '20-30 min',
  whatsapp: atob('NTUyMjk5MjEyMjY5Mg=='),   // número só é montado em tempo de execução
};
const DAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const fmtH = h => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
const FLAVORS = [
  ['Nozes com Doce de Leite', 'nozes'], ['Cheesecake de Frutas Vermelhas', 'cheesecake'], ['Pão de Mel', 'paodemel'], ['Ninho com Nutella', 'ninhonutella'],
  ['Flocos', 'flocos'], ['Musse de Chocolate Branco', 'musse'], ['Whey Protein + Cacau', 'whey'], ['Franui', 'franui'],
  ['Romeu e Julieta (Goiabada com Queijo)', 'romeu'], ['Novidade', 'novidade'], ['Sorbet de Maracujá', 'maracuja'], ['Sorbet de Manga', 'manga'],
  ['Sorbet de Morango', 'morango'], ['Ninho com Geleia de Morango', 'ninhogeleia'], ['Iogurte com Abacaxi', 'iogurte'], ['Coco Queimado', 'coco'],
  ['Paçoca com Chocolate', 'pacoca'], ['Chocolate 70% Cacau', 'choc70'], ['Catarina', 'catarina'],
].map(([label, f]) => ({ label, img: `assets/sabores/${f}.png` }));

/* ---------- ícones dos produtos ---------- */
const ICONS = {
  cake: `<svg viewBox="0 0 100 100" fill="none"><path d="M14 70 30 28l56 8-6 34Z" fill="#d9a066"/><path d="M14 70 30 28l56 8-1 6-54-7-9 24Z" fill="#f6e3c4"/><path d="M14 70h66l-1 8H14Z" fill="#6b3f26"/><path d="M30 28l56 8" stroke="#6b3f26" stroke-width="5" stroke-linecap="round"/><circle cx="62" cy="22" r="7" fill="#e8445f"/><path d="M62 15c1-5 5-7 9-6" stroke="#4d8a54" stroke-width="3" stroke-linecap="round"/></svg>`,
  drink: `<svg viewBox="0 0 100 100" fill="none"><path d="M30 28h40l-5 58H35Z" fill="#2d8f9c" fill-opacity=".25" stroke="#2d8f9c" stroke-width="3"/><path d="M33 50h34l-2 36H35Z" fill="#2d8f9c" fill-opacity=".55"/><path d="M52 28 62 8l8 3" stroke="#ff9ec6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="48" cy="62" r="4" fill="#fff" fill-opacity=".5"/><circle cx="58" cy="72" r="3" fill="#fff" fill-opacity=".5"/><rect x="26" y="24" width="48" height="6" rx="3" fill="#2d8f9c"/></svg>`,
  tub: `<svg viewBox="0 0 100 100" fill="none"><path d="M16 38h68l-6 46a6 6 0 0 1-6 5H28a6 6 0 0 1-6-5Z" fill="#ff9ec6"/><path d="M16 38h68l-1.5 10h-65Z" fill="#fff" fill-opacity=".25"/><path d="M14 38c0-14 16-24 36-24s36 10 36 24Z" fill="#fff8e8"/><path d="M26 30c4-8 14-12 24-12" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/><rect x="34" y="58" width="32" height="14" rx="7" fill="#fff" fill-opacity=".85"/></svg>`,
  scoop: `<svg viewBox="0 0 100 100" fill="none"><path d="M36 54h28L52 94q-2 3-4 0Z" fill="#d6a965"/><path d="M36 54h28l-3 8H39Z" fill="#b98a45"/><circle cx="50" cy="38" r="22" fill="#ff9ec6"/><path d="M28 44c0 4 4 6 6 2 2 5 7 5 9 0 2 5 7 5 9 0 2 5 7 5 9 0 2 4 6 2 6-2" fill="#ff9ec6"/><circle cx="50" cy="22" r="12" fill="#c9fbee"/><ellipse cx="40" cy="32" rx="7" ry="4" fill="#fff" fill-opacity=".5" transform="rotate(-30 40 32)"/><circle cx="50" cy="8" r="5" fill="#e8445f"/></svg>`,
  coffee: `<svg viewBox="0 0 100 100" fill="none"><path d="M20 40h50v24a22 22 0 0 1-22 22h-6A22 22 0 0 1 20 64Z" fill="#fff8e8"/><path d="M70 46h6a10 10 0 0 1 0 20h-8" stroke="#fff8e8" stroke-width="6" stroke-linecap="round"/><path d="M24 44h42v8H24Z" fill="#6b3f26"/><path d="M34 30c-3-5 3-8 0-13M46 30c-3-5 3-8 0-13M58 30c-3-5 3-8 0-13" stroke="#2d8f9c" stroke-width="3.5" stroke-linecap="round" opacity=".8"/><ellipse cx="45" cy="92" rx="30" ry="4" fill="#000" fill-opacity=".25"/></svg>`,
};

/* ---------- cardápio ---------- */
const MENU = [
  { id: 'gelatos', title: 'Potes de Gelato', items: [
    { id: 'pote120', name: 'Pote de 120 ml', price: 20, img: 'assets/ia/pote120.jpg', tint: 'linear-gradient(135deg,#dff0f7,#c9e4f0)',
      desc: 'Nosso pote de 120 ml é perfeito para consumo individual, ideal para quem quer saborear sem exagero.',
      groups: [{ name: 'Sabor', type: 'radio', required: true, options: FLAVORS.map(f => ({ ...f, price: 0 })) }] },
    { id: 'pote150', name: 'Pote de 150 ml', price: 22, img: 'assets/ia/pote150.jpg', tint: 'linear-gradient(135deg,#dff0f7,#c9e4f0)',
      desc: 'O pote de 150 ml é a medida certa para uma pessoa só e ainda dá para escolher dois sabores.',
      groups: [{ name: 'Sabores', type: 'check', min: 1, max: 2, hint: 'Escolha até 2', options: FLAVORS.map(f => ({ ...f, price: 0 })) }] },
    { id: 'pote240', name: 'Pote de 240 ml', price: 28.5, img: 'assets/ia/pote240.jpg', tint: 'linear-gradient(135deg,#dff0f7,#c9e4f0)',
      desc: 'Pote de 240 ml com até 2 sabores diferentes. Experimente combinações incríveis e aproveite o melhor do nosso Gelato!',
      groups: [{ name: 'Sabores', type: 'check', min: 1, max: 2, hint: 'Escolha até 2', options: FLAVORS.map(f => ({ ...f, price: 0 })) }] },
    { id: 'pote700', name: 'Pote de 700 ml', price: 75, img: 'assets/ia/pote700-full.jpg', tint: 'linear-gradient(135deg,#dff2f8,#bfe3ee)',
      desc: 'Pote de 700 ml para levar para casa. Escolha seus sabores favoritos.',
      groups: [{ name: 'Sabores', type: 'check', min: 1, max: 2, hint: 'Escolha até 2', options: FLAVORS.map(f => ({ ...f, price: 0 })) }] },
    { id: 'pote13', name: 'Pote de 1,3 L', price: 109.9, img: 'assets/pote13.png', tint: 'linear-gradient(135deg,#fbe1da,#f8cdc0)',
      desc: 'Escolha até três sabores incríveis e desfrute de uma combinação perfeita e deliciosa!',
      groups: [{ name: 'Sabores', type: 'check', min: 1, max: 3, hint: 'Escolha até 3', options: FLAVORS.map(f => ({ ...f, price: 0 })) }] },
  ] },
  { id: 'brownie', title: 'Bolos e Brownies', items: [
    { id: 'browniegelato', name: 'Brownie com Gelato', price: 28, img: 'assets/brownie-gelato.png', tint: 'linear-gradient(135deg,#fff0d9,#ffe0b3)',
      desc: 'Fatia de brownie acompanhada de uma bola de gelato da sua preferência!!',
      groups: [{ name: 'Sabor da bola', type: 'radio', required: true, options: FLAVORS.map(f => ({ ...f, price: 0 })) }] },
    { id: 'brownie', name: 'Brownie', price: 18, img: 'assets/brownie.png', tint: 'linear-gradient(135deg,#fff0d9,#ffe0b3)',
      desc: 'Fatia de brownie da casa.', groups: [] },
    { id: 'bologelato', name: 'Bolo com Gelato', price: 28, img: 'assets/ia/bolo-gelato.jpg', tint: 'linear-gradient(135deg,#fff0d9,#ffe0b3)',
      desc: 'Fatia de bolo da casa acompanhada de uma bola de gelato da sua preferência.',
      groups: [{ name: 'Sabor da bola', type: 'radio', required: true, options: FLAVORS.map(f => ({ ...f, price: 0 })) }] },
    { id: 'bolo', name: 'Bolo', price: 18, img: 'assets/ia/bolo.jpg', tint: 'linear-gradient(135deg,#fff0d9,#ffe0b3)',
      desc: 'Fatia de bolo da casa.', groups: [] },
  ] },
  { id: 'cafes', title: 'Cafés e Métodos', items: [
    { id: 'cafes', name: 'Cafés', price: 7.5, img: 'assets/ia/cafe.jpg', tint: 'linear-gradient(135deg,#f3e6d0,#e6d2b0)',
      desc: 'Cafés especiais e métodos de preparo para acompanhar o seu gelato.',
      groups: [{ name: 'Café', type: 'radio', required: true, replace: true, options: [
        { label: 'Espresso curto', price: 7.5 }, { label: 'Espresso longo', price: 7.5 }, { label: 'Latte', price: 12 },
        { label: 'Cappuccino', price: 14.9 }, { label: 'Cappuccino Catarina', price: 18 }, { label: 'Affogato', price: 22 }] }] },
  ] },
  { id: 'bebidas', title: 'Bebidas', items: [
    { id: 'bebidas', name: 'Bebidas', price: 5.5, img: 'assets/ia/bebidas.jpg', tint: 'linear-gradient(135deg,#dff2f8,#bfe3ee)',
      desc: 'Refresque o seu momento feliz.',
      groups: [{ name: 'Bebidas', type: 'radio', required: true, replace: true, options: [{ label: 'Água sem gás', price: 5.5 }, { label: 'Água com gás', price: 7.5 }] }] },
  ] },
];
const ALL = MENU.flatMap(c => c.items.map(i => ({ ...i, cat: c.id })));
const byId = id => ALL.find(i => i.id === id);

/* ---------- utils ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem('cg_' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('cg_' + k, JSON.stringify(v)); } catch {} },
};
const icon = {
  plus: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
};
const thumbHTML = it => `<div class="thumb" style="--tint:${it.tint}">${it.img ? `<img src="${it.img}" alt="${esc(it.name)}">` : ICONS[it.icon]}</div>`;

let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------- horário ---------- */
const pad = n => String(n).padStart(2, '0');
function isOpen(d = new Date()) { const [o, c] = STORE.hours[d.getDay()]; const h = d.getHours() + d.getMinutes() / 60; return h >= o && h < c; }
function nextOpen(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60, today = STORE.hours[d.getDay()];
  if (h < today[0]) return { when: 'hoje', at: today[0] };
  return { when: 'amanhã', at: STORE.hours[(d.getDay() + 1) % 7][0] };
}
function hoursHTML() {
  return DAYS.map((d, i) => `${d.replace('-feira', '')}: ${fmtH(STORE.hours[i][0])} às ${fmtH(STORE.hours[i][1])}`).join('<br>');
}
function hoursTable() {
  const today = new Date().getDay();
  return DAYS.map((d, i) => `<li class="${i === today ? 'today' : ''}"><span>${d.replace('-feira', '')}</span><b>${fmtH(STORE.hours[i][0])} – ${fmtH(STORE.hours[i][1])}</b></li>`).join('');
}
function renderStatus() {
  const el = $('#status'), open = isOpen(), now = new Date(), n = nextOpen(now);
  el.classList.toggle('open', open);
  el.querySelector('span').textContent = open
    ? `Aberto agora · fecha às ${fmtH(STORE.hours[now.getDay()][1])}`
    : `Fechado. Abre ${n.when} às ${fmtH(n.at)}`;
  $('#footHours').innerHTML = hoursTable();
}

/* ---------- cardápio: render ---------- */
function renderMenu(q = '') {
  const term = q.trim().toLowerCase();
  const hl = t => term ? esc(t).replace(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>') : esc(t);
  let total = 0;
  $('#sections').innerHTML = MENU.map(c => {
    const items = c.items.filter(i => !term || (i.name + ' ' + c.title + ' ' + i.desc).toLowerCase().includes(term));
    total += items.length;
    if (!items.length) return '';
    return `<section class="cat" id="cat-${c.id}" data-cat="${c.id}">
      <h3 class="cat-title">${esc(c.title)}</h3>
      <div class="cards">${items.map(i => `
        <button class="card" data-id="${i.id}" aria-label="${esc(i.name)}, ${brl(i.price)}">
          <div class="card-info">
            <div><h4>${hl(i.name)}</h4><p>${esc(i.desc)}</p></div>
            <div class="price-row"><div class="price">${i.groups.some(g => g.replace) ? 'A partir de' : '&nbsp;'}<b>${brl(i.price)}</b></div><span class="add" aria-hidden="true">${icon.plus}</span></div>
          </div>
          ${thumbHTML(i)}
        </button>`).join('')}</div>
    </section>`;
  }).join('');
  $('#empty').hidden = total > 0;
  bindCards(); observeCats();
}

function renderTabs() {
  $('#tabs').innerHTML = MENU.map((c, i) => `<button class="tab${i ? '' : ' on'}" role="tab" data-go="${c.id}">${esc(c.title)}</button>`).join('');
}
function goCat(id) {
  const el = $('#cat-' + id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
let spy;
function observeCats() {
  spy?.disconnect();
  spy = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.go === e.target.dataset.cat));
      const on = $('.tab.on'), bar = $('#tabs');
      if (on && bar && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: on.offsetLeft - (bar.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  $$('.cat').forEach(c => spy.observe(c));
}
function bindCards() {
  $$('.card').forEach(c => {
    c.addEventListener('click', () => openProduct(c.dataset.id));
    c.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
    });
  });
}

/* ---------- modal ---------- */
const modal = $('#modal'), mcard = $('#modalCard'), scrim = $('#scrim');
let lastFocus;
function openModal(html) {
  lastFocus = document.activeElement;
  mcard.innerHTML = `<button class="icon-btn m-close" data-close aria-label="Fechar">${icon.close}</button>` + html;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  scrim.hidden = false; scrim.style.zIndex = 95; document.body.style.overflow = 'hidden';
  mcard.scrollTop = 0;
}
function closeModal() {
  modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
  if (!$('#drawer').classList.contains('open')) { scrim.hidden = true; document.body.style.overflow = ''; }
  scrim.style.zIndex = ''; lastFocus?.focus?.();
}

/* ---------- produto ---------- */
function openProduct(id) {
  const it = byId(id);
  const groupsHTML = (it.groups || []).map((g, gi) => `
    <div class="group" data-g="${gi}">
      <div class="group-h"><span>${esc(g.name)}${g.hint ? ` <em>· ${esc(g.hint)}</em>` : ''}</span><span class="group-tags">${g.max ? `<span class="cnt" data-cnt="${gi}">0/${g.max}</span>` : ''}${g.required || g.min ? '<span class="tag">Obrigatório</span>' : '<span class="tag" style="background:var(--glass);color:var(--ink-3)">Opcional</span>'}</span></div>
      ${g.options.map((o, oi) => `
        <label class="opt"><input type="${g.type === 'radio' ? 'radio' : 'checkbox'}" name="g${gi}" data-g="${gi}" data-o="${oi}" ${g.type === 'radio' && g.replace && oi === 0 ? 'checked' : ''}>
          ${o.img ? `<img class="opt-img" src="${o.img}" alt="" loading="lazy">` : ''}<span>${esc(o.label)}</span>${g.replace ? `<em>${brl(o.price)}</em>` : o.price ? `<em>+ ${brl(o.price)}</em>` : ''}</label>`).join('')}
    </div>`).join('');

  openModal(`
    <div class="m-hero" style="--tint:${it.tint}">${it.img ? `<img src="${it.img}" alt="">` : ICONS[it.icon]}</div>
    <div class="m-body">
      <h3 class="m-title">${esc(it.name)}</h3>
      <p class="m-desc">${esc(it.desc)}</p>
      ${groupsHTML}
      <label class="field"><span>Observações</span><input id="obs" type="text" maxlength="120" placeholder="Ex.: sem cobertura"></label>
    </div>
    <div class="m-foot">
      <div class="qty" id="pq"><button data-d="-1" aria-label="Menos">−</button><span id="pqv">1</span><button data-d="1" aria-label="Mais">+</button></div>
      <button class="btn btn-primary" id="addBtn">Adicionar <b id="addTotal"></b></button>
    </div>`);

  let qty = 1;
  const read = () => {
    let unit = it.price, parts = [], ok = true;
    (it.groups || []).forEach((g, gi) => {
      const sel = $$(`input[data-g="${gi}"]:checked`, mcard).map(i => g.options[+i.dataset.o]);
      if (g.type === 'radio') { if (sel[0]) { if (g.replace) unit = sel[0].price; else unit += sel[0].price; parts.push(sel[0].label); } else if (g.required) ok = false; }
      else { unit += sel.reduce((s, o) => s + o.price, 0); if (sel.length) parts.push(sel.map(o => o.label).join(', ')); if (sel.length < (g.min || 0)) ok = false; }
    });
    return { unit, parts, ok };
  };
  const refresh = () => {
    (it.groups || []).forEach((g, gi) => {
      if (g.type !== 'check' || !g.max) return;
      const boxes = $$(`input[data-g="${gi}"]`, mcard), n = boxes.filter(b => b.checked).length;
      boxes.forEach(b => b.closest('.opt').classList.toggle('dis', !b.checked && n >= g.max));
      $(`[data-cnt="${gi}"]`, mcard).textContent = `${n}/${g.max}`;
    });
    const r = read();
    $('#addTotal').textContent = brl(r.unit * qty);
    $('#addBtn').disabled = !r.ok;
    $('#pqv').textContent = qty;
  };
  mcard.oninput = e => {
    const t = e.target, g = it.groups?.[+t.dataset.g];
    if (g?.max && t.checked && $$(`input[data-g="${t.dataset.g}"]:checked`, mcard).length > g.max) t.checked = false;
    refresh();
  };
  $('#pq').onclick = e => { const b = e.target.closest('button'); if (!b) return; qty = Math.max(1, Math.min(20, qty + +b.dataset.d)); refresh(); };
  $('#addBtn').onclick = () => {
    const r = read();
    addToCart({ id: it.id, unit: r.unit, desc: r.parts.join(' · '), obs: $('#obs').value.trim(), qty });
    closeModal(); toast(`${it.name} adicionado ao carrinho`);
  };
  refresh();
}

/* ---------- carrinho ---------- */
let cart = store.get('cart', []);
const subtotal = () => cart.reduce((s, l) => s + l.unit * l.qty, 0);
const count = () => cart.reduce((s, l) => s + l.qty, 0);
function addToCart(l) {
  const key = [l.id, l.desc, l.obs].join('|');
  const ex = cart.find(c => c.key === key);
  ex ? ex.qty += l.qty : cart.push({ ...l, key });
  saveCart(true);
}
function saveCart(pop) { store.set('cart', cart); renderCart(); updateBadges(pop); }
function updateBadges(pop) {
  const n = count(), b = $('#cartCount');
  b.hidden = !n; b.textContent = n;
  if (pop) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
  $('#cartBar').hidden = !n; $('#cbCount').textContent = n; $('#cbTotal').textContent = brl(subtotal());
}
function renderCart() {
  const body = $('#cartBody'), foot = $('#cartFoot');
  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 7H6"/></svg><div><b style="color:var(--ink)">Seu carrinho está vazio</b><br>Que tal um gelato para começar?</div></div>`;
    foot.hidden = true; return;
  }
  foot.hidden = false;
  body.innerHTML = cart.map((l, i) => {
    const it = byId(l.id);
    return `<div class="line">${thumbHTML(it)}
      <div><h5>${esc(it.name)}</h5><small>${esc(l.desc)}${l.obs ? `<br>Obs.: ${esc(l.obs)}` : ''}</small></div>
      <div class="line-r"><b>${brl(l.unit * l.qty)}</b>
        <div class="qty" data-i="${i}"><button data-d="-1" aria-label="Menos">−</button><span>${l.qty}</span><button data-d="1" aria-label="Mais">+</button></div></div>
    </div>`;
  }).join('');
  const sub = subtotal(), tot = sub + STORE.deliveryFee;
  foot.innerHTML = `
    ${isOpen() ? '' : `<div class="notice"><span>🌙</span><span>Estamos fechados agora. Seu pedido será agendado e preparado assim que abrirmos ${nextOpen().when} às ${fmtH(nextOpen().at)}.</span></div>`}
    <div class="sum-row"><span>Subtotal</span><span>${brl(sub)}</span></div>
    <div class="sum-row"><span>Entrega</span><span>${STORE.deliveryFee ? brl(STORE.deliveryFee) : 'Grátis'}</span></div>
    <div class="sum-row total"><span>Total</span><span>${brl(tot)}</span></div>
    <button class="btn btn-primary" id="checkoutBtn">${isOpen() ? 'Finalizar pedido' : 'Agendar pedido'}</button>`;
}
$('#cartBody').addEventListener('click', e => {
  const q = e.target.closest('.qty'); const b = e.target.closest('.qty button'); if (!q || !b) return;
  const i = +q.dataset.i; cart[i].qty += +b.dataset.d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart();
});
$('#cartFoot').addEventListener('click', e => { if (e.target.closest('#checkoutBtn')) openCheckout(); });

const drawer = $('#drawer');
function openCart() { renderCart(); drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); scrim.hidden = false; document.body.style.overflow = 'hidden'; }
function closeCart() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); if (!modal.classList.contains('open')) { scrim.hidden = true; document.body.style.overflow = ''; } }

/* ---------- endereço ---------- */
let addr = store.get('addr', null);
const addrText = a => a ? `${a.street}, ${a.number}${a.hood ? ' - ' + a.hood : ''}` : 'Selecionar endereço';
function renderAddr() { $('#addrLabel').textContent = addrText(addr); }
function openAddress() {
  const a = addr || {};
  openModal(`<form class="form-pad" id="addrForm">
    <h3 class="m-title">Onde entregamos?</h3>
    <p class="m-desc">Entrega em Macaé em ${STORE.eta} · ${STORE.deliveryFee ? 'a partir de ' + brl(STORE.deliveryFee) : 'entrega grátis'}.</p>
    <label class="field"><span>Rua / Avenida</span><input name="street" required value="${esc(a.street || '')}" placeholder="Ex.: Avenida Atlântica"></label>
    <div class="row2">
      <label class="field"><span>Número</span><input name="number" required value="${esc(a.number || '')}" placeholder="2436"></label>
      <label class="field"><span>Bairro</span><input name="hood" value="${esc(a.hood || '')}" placeholder="Cavaleiros"></label>
    </div>
    <label class="field"><span>Complemento</span><input name="comp" value="${esc(a.comp || '')}" placeholder="Apto, bloco, referência"></label>
    <div class="form-actions"><button class="btn btn-primary" type="submit">Confirmar endereço</button></div>
  </form>`);
  $('#addrForm').onsubmit = e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    addr = { street: f.street.trim(), number: f.number.trim(), hood: f.hood.trim(), comp: f.comp.trim() };
    store.set('addr', addr); renderAddr(); closeModal(); toast('Endereço salvo');
  };
}

/* ---------- login ---------- */
let user = store.get('user', null);
function renderUser() {}
function openLogin() {
  openModal(`<form class="form-pad" id="loginForm">
    <h3 class="m-title">${user ? 'Sua conta' : 'Entre ou cadastre-se'}</h3>
    <p class="m-desc">Salve seus dados para pedir mais rápido na próxima vez.</p>
    <label class="field"><span>Nome</span><input name="name" required value="${esc(user?.name || '')}" placeholder="Seu nome"></label>
    <label class="field"><span>WhatsApp</span><input name="phone" type="tel" required value="${esc(user?.phone || '')}" placeholder="(22) 90000-0000"></label>
    <div class="form-actions">${user ? '<button class="btn btn-ghost" type="button" id="logout">Sair</button>' : ''}<button class="btn btn-primary" type="submit">${user ? 'Salvar' : 'Continuar'}</button></div>
  </form>`);
  $('#loginForm').onsubmit = e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    user = { name: f.name.trim(), phone: f.phone.trim() }; store.set('user', user); renderUser(); closeModal(); toast(`Bem-vindo(a), ${user.name.split(' ')[0]}!`);
  };
  $('#logout')?.addEventListener('click', () => { user = null; store.set('user', null); renderUser(); closeModal(); });
}

/* ---------- checkout ---------- */
function openCheckout() {
  closeCart();
  const a = addr || {}, u = user || {};
  const sub = subtotal(), tot = sub + STORE.deliveryFee;
  openModal(`<form id="coForm">
    <div class="form-pad">
      <h3 class="m-title">Finalizar pedido</h3>
      <p class="m-desc">${count()} ${count() > 1 ? 'itens' : 'item'} · Total ${brl(tot)} (entrega grátis)</p>
      <div class="row2">
        <label class="field"><span>Nome</span><input name="name" required value="${esc(u.name || '')}"></label>
        <label class="field"><span>WhatsApp</span><input name="phone" type="tel" required value="${esc(u.phone || '')}"></label>
      </div>
      <div class="row2">
        <label class="field"><span>Rua / Avenida</span><input name="street" required value="${esc(a.street || '')}"></label>
        <label class="field"><span>Número</span><input name="number" required value="${esc(a.number || '')}"></label>
      </div>
      <div class="row2">
        <label class="field"><span>Bairro</span><input name="hood" value="${esc(a.hood || '')}"></label>
        <label class="field"><span>Complemento</span><input name="comp" value="${esc(a.comp || '')}"></label>
      </div>
      <div class="group"><div class="group-h"><span>Pagamento na entrega</span></div>
        <div class="pay">
          <label class="opt"><input type="radio" name="pay" value="Pix" checked><span>Pix</span></label>
          <label class="opt"><input type="radio" name="pay" value="Cartão"><span>Cartão</span></label>
          <label class="opt"><input type="radio" name="pay" value="Dinheiro"><span>Dinheiro</span></label>
        </div></div>
    </div>
    <div class="form-actions"><button class="btn btn-primary" type="submit">${isOpen() ? 'Confirmar pedido' : 'Agendar pedido'} · ${brl(tot)}</button></div>
  </form>`);
  $('#coForm').onsubmit = e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    user = { name: f.name.trim(), phone: f.phone.trim() }; store.set('user', user); renderUser();
    addr = { street: f.street.trim(), number: f.number.trim(), hood: f.hood.trim(), comp: f.comp.trim() }; store.set('addr', addr); renderAddr();
    const n = Math.floor(1000 + Math.random() * 9000), wasOpen = isOpen();
    const lines = cart.map(l => {
      const it = byId(l.id);
      return `• ${l.qty}x ${it.name}${l.desc ? ` (${l.desc})` : ''}${l.obs ? ` — Obs.: ${l.obs}` : ''} — ${brl(l.unit * l.qty)}`;
    });
    const total = subtotal() + STORE.deliveryFee;
    const msg = [
      `*Novo pedido #${n} — ${STORE.name}*`,
      wasOpen ? '' : `_Pedido agendado para quando a loja abrir (${nextOpen().when} às ${fmtH(nextOpen().at)})_`,
      '',
      '*Itens*', ...lines, '',
      `Subtotal: ${brl(subtotal())}`,
      `Entrega: ${STORE.deliveryFee ? brl(STORE.deliveryFee) : 'Grátis'}`,
      `*Total: ${brl(total)}*`,
      `Pagamento: ${f.pay}`, '',
      `*Cliente:* ${user.name} — ${user.phone}`,
      `*Endereço:* ${addr.street}, ${addr.number}${addr.hood ? ' - ' + addr.hood : ''}${addr.comp ? ' (' + addr.comp + ')' : ''}, Macaé - RJ`,
    ].filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n');
    const link = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`;
    cart = []; saveCart();
    mcard.innerHTML = `<button class="icon-btn m-close" data-close aria-label="Fechar">${icon.close}</button>
      <div class="success"><div class="ok">${icon.check}</div>
        <h3 class="m-title">Pedido #${n} montado!</h3>
        <p>Falta só um passo, ${esc(user.name.split(' ')[0])}: envie o pedido para a loja pelo WhatsApp. ${wasOpen ? `A entrega chega em ${STORE.eta}` : `Assim que abrirmos às ${fmtH(nextOpen().at)} começamos o preparo`} em <b>${esc(addrText(addr))}</b>. Pagamento: ${esc(f.pay)}.</p>
        <a class="btn btn-primary wa-btn" href="${link}" target="_blank" rel="noopener" style="width:100%">Enviar pedido pelo WhatsApp</a>
        <button class="btn btn-ghost" data-close style="width:100%;margin-top:10px">Voltar ao cardápio</button></div>`;
  };
}

/* ---------- about (hambúrguer) ---------- */
function openAbout() {
  openModal(`<div class="form-pad"><h3 class="m-title">${esc(STORE.name)}</h3>
    <p class="m-desc">Descubra o sabor da felicidade.</p>
    <div class="group"><div class="group-h"><span>Endereço</span></div><p class="m-desc">Avenida Atlântica, 2436 - Cavaleiros, Macaé - RJ, CEP 27920-390</p></div>
    <div class="group"><div class="group-h"><span>Delivery</span></div><p class="m-desc">Entrega em ${STORE.eta} · ${STORE.deliveryFee ? 'a partir de ' + brl(STORE.deliveryFee) : 'grátis'}<br>${hoursHTML()}</p></div>
  </div><div class="form-actions"><button class="btn btn-primary" data-close>Fechar</button></div>`);
}

/* ---------- eventos globais ---------- */
document.addEventListener('click', e => {
  if (e.target.closest('[data-close]') || e.target === scrim) { closeModal(); closeCart(); return; }
  if (e.target.closest('[data-open-address]')) { openAddress(); return; }
  const go = e.target.closest('[data-go]');
  if (go) { e.preventDefault(); goCat(go.dataset.go); return; }
});
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeCart(); } });
$('#cartBtn').onclick = openCart;
$('#cartBar').onclick = openCart;
$('#menuBtn').onclick = openAbout;
$('#search').addEventListener('input', e => {
  renderMenu(e.target.value);
  if (e.target.value) $('#cardapio').scrollIntoView({ behavior: 'smooth' });
});

/* ---------- WhatsApp direto (sem exibir o número) ---------- */
function waLink(text) { return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`; }
document.addEventListener('click', e => {
  const a = e.target.closest('[data-wa]');
  if (!a) return;
  e.preventDefault();
  window.open(waLink(a.dataset.wa || 'Olá! Gostaria de fazer um pedido.'), '_blank', 'noopener');
});
/* glow do cursor + reveal */
if (matchMedia('(pointer:fine)').matches) {
  const g = $('.cursor-glow');
  addEventListener('pointermove', e => { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }, { passive: true });
}
const rev = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), { threshold: .12 });
$$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 6) * 70 + 'ms'; rev.observe(el); });

/* ---------- init ---------- */
$('#year').textContent = new Date().getFullYear();
renderTabs(); renderMenu(); renderStatus(); renderAddr(); renderUser(); renderCart(); updateBadges();
setInterval(renderStatus, 60000);














