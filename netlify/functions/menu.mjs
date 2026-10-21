// Menu API for Bako-72.
//   GET  /api/menu           -> current menu (404 if never saved: the site then uses its built-in data.js)
//   POST /api/menu/login     -> checks the admin password
//   PUT  /api/menu           -> saves the menu (admin password required)
//   POST /api/menu/password  -> changes the admin password (current password required)
// Passwords are only ever stored as salted scrypt hashes. Order of precedence:
// ADMIN_PASSWORD env var (if set) > hash saved from the admin ("auth" blob) > DEFAULT_HASH below.
import { getStore } from '@netlify/blobs'
import { timingSafeEqual, createHash, scryptSync, randomBytes } from 'node:crypto'

const STORE = 'bako-menu'
const KEY = 'current'
const AUTH_KEY = 'auth'
const DEFAULT_HASH = 'scrypt$32768$8$1$h+izIq8yDOIlq7MTEplv9A==$KVxsoTDwwe/BO/Y0793hFTNFjGrUmVNe224xir2bZIo='

const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }
function hashPassword(pw) {
  const salt = randomBytes(16)
  const h = scryptSync(pw, salt, 32, SCRYPT)
  return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64'), h.toString('base64')].join('$')
}
function matchesHash(pw, stored) {
  const [alg, N, r, p, salt, hash] = String(stored).split('$')
  if (alg !== 'scrypt') return false
  const expected = Buffer.from(hash, 'base64')
  const got = scryptSync(pw, Buffer.from(salt, 'base64'), expected.length, { N: +N, r: +r, p: +p, maxmem: SCRYPT.maxmem })
  return timingSafeEqual(got, expected)
}

const json = (status, body, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  })

async function checkPassword(store, given) {
  if (typeof given !== 'string' || !given || given.length > 200) return false
  const env = process.env.ADMIN_PASSWORD
  if (env) {
    const a = createHash('sha256').update(given).digest()
    const b = createHash('sha256').update(env).digest()
    return timingSafeEqual(a, b)
  }
  const saved = await store.get(AUTH_KEY, { type: 'json' })
  return matchesHash(given, saved?.hash || DEFAULT_HASH)
}

const bearer = (req) => (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const str = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max
const optStr = (v, max) => v === undefined || (typeof v === 'string' && v.length <= max)

// returns a cleaned copy of the menu, or throws with a French message for the admin
function validate(menu) {
  if (!Array.isArray(menu) || menu.length === 0 || menu.length > 12) throw new Error('La carte doit contenir entre 1 et 12 catégories.')
  return menu.map((cat, ci) => {
    if (!str(cat?.title, 60)) throw new Error(`Catégorie ${ci + 1} : le titre est obligatoire (60 caractères max).`)
    if (!optStr(cat.subtitle, 80)) throw new Error(`Catégorie « ${cat.title} » : sous-titre trop long.`)
    if (!Array.isArray(cat.items) || cat.items.length > 60) throw new Error(`Catégorie « ${cat.title} » : 60 plats maximum.`)
    return {
      id: str(cat.id, 40) ? cat.id : `cat-${ci + 1}`,
      title: cat.title.trim(),
      subtitle: (cat.subtitle || '').trim(),
      items: cat.items.map((it, ii) => {
        if (!str(it?.name, 80)) throw new Error(`« ${cat.title} », plat ${ii + 1} : le nom est obligatoire.`)
        const price = Number(it.price)
        if (!Number.isFinite(price) || price < 0 || price > 1000) throw new Error(`« ${it.name} » : prix invalide.`)
        if (!optStr(it.desc, 400)) throw new Error(`« ${it.name} » : description trop longue (400 caractères max).`)
        return { name: it.name.trim(), price: Math.round(price * 100) / 100, desc: (it.desc || '').trim(), soldOut: it.soldOut === true }
      }),
    }
  })
}

export default async (req) => {
  const url = new URL(req.url)
  const store = getStore(STORE)

  if (req.method === 'GET' && url.pathname === '/api/menu') {
    const data = await store.get(KEY, { type: 'json' })
    if (!data) return json(404, { error: 'not-found' })
    return json(200, data, { 'cache-control': 'public, max-age=0, must-revalidate' })
  }

  if (req.method === 'POST' && url.pathname === '/api/menu/login') {
    const { password } = await req.json().catch(() => ({}))
    if (!(await checkPassword(store, password))) {
      await wait(800) // slows down password guessing
      return json(401, { error: 'Mot de passe incorrect.' })
    }
    return json(200, { ok: true })
  }

  if (req.method === 'POST' && url.pathname === '/api/menu/password') {
    if (process.env.ADMIN_PASSWORD) return json(409, { error: 'Le mot de passe est géré dans les réglages Netlify.' })
    const { current, next } = await req.json().catch(() => ({}))
    if (!(await checkPassword(store, current))) {
      await wait(800)
      return json(401, { error: 'Mot de passe actuel incorrect.' })
    }
    if (typeof next !== 'string' || next.length < 10 || next.length > 100) {
      return json(400, { error: 'Le nouveau mot de passe doit contenir au moins 10 caractères.' })
    }
    await store.setJSON(AUTH_KEY, { hash: hashPassword(next), changedAt: new Date().toISOString() })
    return json(200, { ok: true })
  }

  if (req.method === 'PUT' && url.pathname === '/api/menu') {
    if (!(await checkPassword(store, bearer(req)))) {
      await wait(800)
      return json(401, { error: 'Session expirée, reconnectez-vous.' })
    }
    const body = await req.json().catch(() => null)
    let menu
    try {
      menu = validate(body?.menu)
    } catch (e) {
      return json(400, { error: e.message })
    }
    const data = { menu, updatedAt: new Date().toISOString() }
    await store.setJSON(KEY, data)
    return json(200, data)
  }

  return json(405, { error: 'Méthode non autorisée.' })
}

export const config = { path: ['/api/menu', '/api/menu/login', '/api/menu/password'] }
