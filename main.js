const { menu } = window.BAKO
const tabs = document.getElementById('tabs')
const list = document.getElementById('menu')

// tabs: "Tout" + one per category
const cats = [{ id: 'all', title: 'Tout' }, ...menu]
tabs.innerHTML = cats
  .map((c, i) => `<button role="tab" aria-selected="${i === 0}" data-cat="${c.id}">${c.title}</button>`)
  .join('')

list.innerHTML = menu
  .map(
    (cat) => `<section class="menu__cat" data-cat="${cat.id}">
      <header><h3>${cat.title}</h3><p>${cat.subtitle}</p></header>
      <ul>${cat.items
        .map(
          (it) => `<li class="dish">
            <div class="dish__top"><h4>${it.name}${it.tag ? ` <span class="dish__tag">${it.tag}</span>` : ''}</h4><i></i><span class="dish__price">${window.formatPrice(it.price)}</span></div>
            ${it.desc ? `<p>${it.desc}</p>` : ''}</li>`,
        )
        .join('')}</ul></section>`,
  )
  .join('')

tabs.addEventListener('click', (e) => {
  const btn = e.target.closest('button')
  if (!btn) return
  tabs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(b === btn)))
  const cat = btn.dataset.cat
  list.querySelectorAll('.menu__cat').forEach((s) => (s.hidden = cat !== 'all' && s.dataset.cat !== cat))
})

// 3D medallion: build the coin's thickness from stacked discs
const edge = document.getElementById('coinEdge')
if (edge) {
  const layers = 18
  edge.innerHTML = Array.from({ length: layers }, (_, i) => `<i style="--z:${i - (layers - 1) / 2}"></i>`).join('')
}

// 3D medallion motion, driven by JS so it runs on every phone
// (CSS animations get switched off by "remove animations" / power-saving modes).
const coinBody = document.querySelector('.coin__body')
if (coinBody) {
  const gentle = matchMedia('(prefers-reduced-motion: reduce)').matches
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 }

  // idle pose at time t (seconds): a slow, small sway that keeps the 3D edge visible without distracting
  const pose = (t) => ({
    y: -14 + Math.sin(t * (gentle ? 0.25 : 0.4)) * 10,
    x: 6 + Math.sin(t * 0.3) * 3,
  })

  // desktop: follow the pointer
  if (matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', (e) => {
      tilt.ty = ((e.clientX / innerWidth) - 0.5) * 12
      tilt.tx = -((e.clientY / innerHeight) - 0.5) * 8
    }, { passive: true })
  }
  // phones: follow the device tilt (gyroscope)
  addEventListener('deviceorientation', (e) => {
    if (e.gamma == null || e.beta == null) return
    tilt.ty = Math.max(-30, Math.min(30, e.gamma)) * 0.3
    tilt.tx = Math.max(-25, Math.min(25, e.beta - 45)) * -0.2
  }, { passive: true })

  let visible = true
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(coinBody)

  const start = performance.now()
  const frame = (now) => {
    requestAnimationFrame(frame)
    if (!visible || document.hidden) return
    tilt.x += (tilt.tx - tilt.x) * 0.04
    tilt.y += (tilt.ty - tilt.y) * 0.04
    const p = pose((now - start) / 1000)
    coinBody.style.transform = `rotateX(${(p.x + tilt.x).toFixed(2)}deg) rotateY(${(p.y + tilt.y).toFixed(2)}deg)`
  }
  requestAnimationFrame(frame)
}

// mobile menu
const burger = document.getElementById('burger')
const nav = document.getElementById('nav')
const setMenu = (open) => {
  nav.classList.toggle('is-open', open)
  burger.setAttribute('aria-expanded', String(open))
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu')
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')))
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)))
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false))

document.getElementById('year').textContent = new Date().getFullYear()
