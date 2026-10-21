// Bako-72 menu admin: login, edit the menu in the browser, save through /api/menu.
const $ = (id) => document.getElementById(id)
const esc = window.escapeHtml
const PW_KEY = 'bako-admin-pw'

let menu = []
let dirty = false
let saving = false

/* ---------- helpers ---------- */
function toast(msg, error = false) {
  const t = $('toast')
  t.textContent = msg
  t.classList.toggle('is-error', error)
  t.classList.add('is-on')
  clearTimeout(toast.timer)
  toast.timer = setTimeout(() => t.classList.remove('is-on'), 3200)
}

function setDirty(v) {
  dirty = v
  $('save').disabled = !v || saving
  const s = $('status')
  s.classList.toggle('is-dirty', v)
  if (v) s.textContent = 'Modifications non enregistrées'
}

function showUpdated(iso) {
  $('status').classList.remove('is-dirty')
  $('status').textContent = iso
    ? `Enregistré le ${new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}`
    : 'Carte d’origine (jamais modifiée)'
}

const clone = (x) => JSON.parse(JSON.stringify(x))
const move = (arr, i, d) => {
  const j = i + d
  if (j < 0 || j >= arr.length) return
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

/* ---------- render ---------- */
function render() {
  $('cats').innerHTML = menu
    .map(
      (cat, ci) => `<section class="cat" data-ci="${ci}">
      <div class="cat__head">
        <span class="label">Catégorie</span>
        <div class="row">
          <input type="text" class="cat__title" data-field="title" value="${esc(cat.title)}" placeholder="Nom de la catégorie" maxlength="60" aria-label="Nom de la catégorie" />
          <div class="icons">
            <button type="button" class="icon" data-act="cat-up" ${ci === 0 ? 'disabled' : ''} aria-label="Monter la catégorie">↑</button>
            <button type="button" class="icon" data-act="cat-down" ${ci === menu.length - 1 ? 'disabled' : ''} aria-label="Descendre la catégorie">↓</button>
            <button type="button" class="icon icon--danger" data-act="cat-del" aria-label="Supprimer la catégorie">✕</button>
          </div>
        </div>
        <input type="text" data-field="subtitle" value="${esc(cat.subtitle || '')}" placeholder="Sous-titre (facultatif)" maxlength="80" aria-label="Sous-titre" />
      </div>
      <div class="cat__items">${cat.items
        .map(
          (it, ii) => `<div class="dish${it.soldOut ? ' dish--out' : ''}" data-ii="${ii}">
          <div class="dish__row">
            <input type="text" data-field="name" value="${esc(it.name)}" placeholder="Nom du plat" maxlength="80" aria-label="Nom du plat" />
            <label class="price"><input type="number" data-field="price" value="${it.price}" min="0" max="1000" step="0.5" inputmode="decimal" aria-label="Prix en euros" /><span>€</span></label>
          </div>
          <textarea data-field="desc" placeholder="Ingrédients / description (facultatif)" maxlength="400" aria-label="Ingrédients">${esc(it.desc || '')}</textarea>
          <div class="dish__tools">
            <label class="soldout"><input type="checkbox" data-field="soldOut" ${it.soldOut ? 'checked' : ''} /> Épuisé aujourd'hui</label>
            <div class="icons">
              <button type="button" class="icon" data-act="up" ${ii === 0 ? 'disabled' : ''} aria-label="Monter le plat">↑</button>
              <button type="button" class="icon" data-act="down" ${ii === cat.items.length - 1 ? 'disabled' : ''} aria-label="Descendre le plat">↓</button>
              <button type="button" class="icon icon--danger" data-act="del" aria-label="Supprimer le plat">✕</button>
            </div>
          </div>
        </div>`,
        )
        .join('')}</div>
      <div class="cat__foot"><button type="button" class="btn btn--line btn--block" data-act="add">+ Ajouter un plat</button></div>
    </section>`,
    )
    .join('')
}

/* ---------- editing ---------- */
$('cats').addEventListener('input', (e) => {
  const el = e.target
  const field = el.dataset.field
  if (!field) return
  const cat = menu[+el.closest('.cat').dataset.ci]
  const dishEl = el.closest('.dish')
  const target = dishEl ? cat.items[+dishEl.dataset.ii] : cat
  if (field === 'price') target.price = el.value === '' ? '' : Number(el.value)
  else if (field === 'soldOut') {
    target.soldOut = el.checked
    dishEl.classList.toggle('dish--out', el.checked)
  } else target[field] = el.value
  setDirty(true)
})

$('cats').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-act]')
  if (!btn) return
  const ci = +btn.closest('.cat').dataset.ci
  const cat = menu[ci]
  const dishEl = btn.closest('.dish')
  const ii = dishEl ? +dishEl.dataset.ii : -1
  switch (btn.dataset.act) {
    case 'up': move(cat.items, ii, -1); break
    case 'down': move(cat.items, ii, 1); break
    case 'del':
      if (!confirm(`Supprimer « ${cat.items[ii].name || 'ce plat'} » ?`)) return
      cat.items.splice(ii, 1)
      break
    case 'add':
      cat.items.push({ name: '', price: 12, desc: '', soldOut: false })
      break
    case 'cat-up': move(menu, ci, -1); break
    case 'cat-down': move(menu, ci, 1); break
    case 'cat-del':
      if (!confirm(`Supprimer toute la catégorie « ${cat.title} » et ses ${cat.items.length} plat(s) ?`)) return
      menu.splice(ci, 1)
      break
  }
  render()
  setDirty(true)
  if (btn.dataset.act === 'add') {
    const items = document.querySelectorAll(`.cat[data-ci="${ci}"] .dish`)
    items[items.length - 1]?.querySelector('input')?.focus()
  }
})

$('addCat').addEventListener('click', () => {
  menu.push({ id: `cat-${Date.now()}`, title: 'Nouvelle catégorie', subtitle: '', items: [] })
  render()
  setDirty(true)
  document.querySelector('.cat:last-child .cat__title')?.select()
})

/* ---------- save ---------- */
$('save').addEventListener('click', async () => {
  saving = true
  $('save').disabled = true
  $('save').textContent = 'Enregistrement…'
  try {
    const res = await fetch('/api/menu', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${sessionStorage.getItem(PW_KEY) || ''}` },
      body: JSON.stringify({ menu }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.status === 401) {
      toast(data.error || 'Session expirée.', true)
      logout(true)
      return
    }
    if (!res.ok) throw new Error(data.error || 'Erreur pendant l’enregistrement.')
    menu = data.menu
    render()
    saving = false
    setDirty(false)
    showUpdated(data.updatedAt)
    toast('Carte enregistrée ✓ Le site est à jour.')
  } catch (err) {
    toast(err.message || 'Pas de connexion internet ?', true)
    saving = false
    setDirty(true)
  } finally {
    saving = false
    $('save').textContent = 'Enregistrer'
    $('save').disabled = !dirty
  }
})

addEventListener('beforeunload', (e) => {
  if (dirty) e.preventDefault()
})

/* ---------- login ---------- */
async function load() {
  $('login').hidden = true
  $('app').hidden = false
  try {
    const res = await fetch('/api/menu', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      menu = data.menu
      showUpdated(data.updatedAt)
    } else {
      menu = clone(window.BAKO.menu)
      showUpdated(null)
    }
  } catch {
    menu = clone(window.BAKO.menu)
    showUpdated(null)
  }
  render()
}

function logout(keepMessage) {
  sessionStorage.removeItem(PW_KEY)
  dirty = false
  $('app').hidden = true
  $('login').hidden = false
  if (!keepMessage) $('loginError').textContent = ''
  $('password').value = ''
  $('password').focus()
}

$('logout').addEventListener('click', () => {
  if (dirty && !confirm('Des modifications ne sont pas enregistrées. Se déconnecter quand même ?')) return
  logout()
})

$('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const pw = $('password').value
  const btn = e.submitter
  btn.disabled = true
  $('loginError').textContent = ''
  try {
    const res = await fetch('/api/menu/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Connexion impossible.')
    sessionStorage.setItem(PW_KEY, pw)
    load()
  } catch (err) {
    $('loginError').textContent = err.message
  } finally {
    btn.disabled = false
  }
})

// stay logged in for this browser tab
if (sessionStorage.getItem(PW_KEY)) load()

/* ---------- change password ---------- */
$('pwForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const next = $('pwNext').value
  $('pwError').textContent = ''
  if (next !== $('pwConfirm').value) {
    $('pwError').textContent = 'Les deux nouveaux mots de passe ne correspondent pas.'
    return
  }
  const btn = e.submitter
  btn.disabled = true
  try {
    const res = await fetch('/api/menu/password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ current: $('pwCurrent').value, next }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Impossible de changer le mot de passe.')
    sessionStorage.setItem(PW_KEY, next)
    e.target.reset()
    e.target.closest('details').open = false
    toast('Mot de passe changé ✓')
  } catch (err) {
    $('pwError').textContent = err.message
  } finally {
    btn.disabled = false
  }
})
