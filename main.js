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
            <p>${it.desc}</p></li>`,
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
