import { supabase, IS_SUPABASE_CONFIGURED, ALLOWED_ADMIN_EMAIL } from './supabaseClient'
import { seedProducts, seedChangelog } from './seed'

/**
 * Data access layer.
 * - SUPABASE MODE  : reads/writes to Supabase (products, product_changelog, contact_messages)
 * - DEMO MODE      : localStorage store seeded with the launch catalogue,
 *                    plus a simulated Google sign-in for the admin area.
 *
 * The rest of the app only talks to these functions, so behaviour is identical
 * in both modes (only persistence differs).
 */

const KEYS = {
  products: 'isoa_products',
  changelog: 'isoa_changelog',
  messages: 'isoa_messages',
  session: 'isoa_session',
  seeded: 'isoa_seeded',
}

/* ------------------------------------------------------------------ */
/* persistence helpers (demo mode)                                     */
/* ------------------------------------------------------------------ */
// A safe store: prefers localStorage (persists across reloads) but falls
// back to an in-memory map when storage is unavailable (e.g. a sandboxed
// preview iframe). This keeps the demo working everywhere.
const mem = {}
const canUseStorage = (() => {
  try {
    const k = '__isoa_t'
    localStorage.setItem(k, '1')
    localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
})()

const read = (k, fallback) => {
  try {
    if (canUseStorage) {
      const v = localStorage.getItem(k)
      if (v) return JSON.parse(v)
    }
    return k in mem ? mem[k] : fallback
  } catch {
    return k in mem ? mem[k] : fallback
  }
}
const write = (k, v) => {
  if (canUseStorage) localStorage.setItem(k, JSON.stringify(v))
  mem[k] = v
}

function ensureSeeded() {
  if (read(KEYS.seeded, false)) return
  write(KEYS.products, seedProducts())
  write(KEYS.changelog, seedChangelog())
  write(KEYS.messages, [])
  write(KEYS.seeded, true)
}

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

/* ------------------------------------------------------------------ */
/* PRODUCTS                                                             */
/* ------------------------------------------------------------------ */
export async function getProducts({ includeDrafts = false } = {}) {
  if (IS_SUPABASE_CONFIGURED) {
    let q = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (!includeDrafts) q = q.eq('status', 'published')
    const { data, error } = await q
    if (error) throw error
    return data
  }
  await delay()
  ensureSeeded()
  const all = read(KEYS.products, [])
  return includeDrafts ? all : all.filter((p) => p.status === 'published')
}

export async function getProductBySlug(slug) {
  if (IS_SUPABASE_CONFIGURED) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    const changelog = await getChangelog(data?.id)
    return data ? { ...data, changelog } : null
  }
  await delay()
  ensureSeeded()
  const p = read(KEYS.products, []).find((x) => x.slug === slug) || null
  if (!p) return null
  const changelog = read(KEYS.changelog, []).filter((c) => c.product_id === p.id)
  return { ...p, changelog }
}

export async function createProduct(product) {
  if (IS_SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('products').insert(product).select().single()
    if (error) throw error
    return data
  }
  await delay()
  ensureSeeded()
  const all = read(KEYS.products, [])
  const item = {
    id: 'p' + Date.now(),
    name: product.name || 'Sans titre',
    slug: product.slug || 'produit-' + Date.now(),
    type: product.type || 'app',
    category: product.category || '',
    short_description: product.short_description || '',
    long_description: product.long_description || '',
    icon_url: product.icon_url || '',
    screenshots: product.screenshots || [],
    demo_video_url: product.demo_video_url || '',
    site_url: product.site_url || '',
    apk_url: product.apk_url || '',
    features: product.features || [],
    status: product.status || 'draft',
    is_featured: Boolean(product.is_featured),
    created_at: product.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  write(KEYS.products, [item, ...all])
  return item
}

export async function updateProduct(id, updates) {
  if (IS_SUPABASE_CONFIGURED) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  await delay()
  ensureSeeded()
  const all = read(KEYS.products, [])
  const next = all.map((p) =>
    p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
  )
  write(KEYS.products, next)
  return next.find((p) => p.id === id)
}

export async function deleteProduct(id) {
  if (IS_SUPABASE_CONFIGURED) {
    await supabase.from('product_changelog').delete().eq('product_id', id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    return
  }
  await delay()
  ensureSeeded()
  write(KEYS.products, read(KEYS.products, []).filter((p) => p.id !== id))
  write(KEYS.changelog, read(KEYS.changelog, []).filter((c) => c.product_id !== id))
}

/* ------------------------------------------------------------------ */
/* CHANGELOG                                                            */
/* ------------------------------------------------------------------ */
export async function getChangelog(productId) {
  if (IS_SUPABASE_CONFIGURED) {
    const { data, error } = await supabase
      .from('product_changelog')
      .select('*')
      .eq('product_id', productId)
      .order('released_at', { ascending: false })
    if (error) throw error
    return data
  }
  return read(KEYS.changelog, []).filter((c) => c.product_id === productId)
}

export async function saveChangelogEntry(entry) {
  if (IS_SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('product_changelog').insert(entry).select().single()
    if (error) throw error
    return data
  }
  const all = read(KEYS.changelog, [])
  const e = { id: 'c' + Date.now(), ...entry }
  write(KEYS.changelog, [e, ...all])
  return e
}

export async function deleteChangelogEntry(id) {
  if (IS_SUPABASE_CONFIGURED) {
    await supabase.from('product_changelog').delete().eq('id', id)
    return
  }
  write(KEYS.changelog, read(KEYS.changelog, []).filter((c) => c.id !== id))
}

/* ------------------------------------------------------------------ */
/* CONTACT MESSAGES                                                     */
/* ------------------------------------------------------------------ */
export async function sendMessage(msg) {
  if (IS_SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('contact_messages').insert({
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      status: 'new',
    })
    if (error) throw error
    return true
  }
  await delay(300)
  ensureSeeded()
  const all = read(KEYS.messages, [])
  write(KEYS.messages, [
    {
      id: 'm' + Date.now(),
      ...msg,
      status: 'new',
      created_at: new Date().toISOString(),
    },
    ...all,
  ])
  return true
}

export async function getMessages() {
  if (IS_SUPABASE_CONFIGURED) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  await delay()
  ensureSeeded()
  return read(KEYS.messages, [])
}

export async function setMessageStatus(id, status) {
  if (IS_SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
    if (error) throw error
    return
  }
  write(
    KEYS.messages,
    read(KEYS.messages, []).map((m) => (m.id === id ? { ...m, status } : m))
  )
}

export async function deleteMessage(id) {
  if (IS_SUPABASE_CONFIGURED) {
    await supabase.from('contact_messages').delete().eq('id', id)
    return
  }
  write(KEYS.messages, read(KEYS.messages, []).filter((m) => m.id !== id))
}

/* ------------------------------------------------------------------ */
/* AUTH (admin only)                                                    */
/* ------------------------------------------------------------------ */
// In SUPABASE MODE: real "Sign in with Google" via Supabase Auth. The allowed
// email check is enforced SERVER-SIDE with RLS policies (see /supabase), so a
// non-authorized Google account can never read/write admin data. We ALSO check
// the email client-side so the UI refuses early with a clear message.
//
// In DEMO MODE: we simulate the OAuth round-trip and cap it to the allowed email,
// so you can preview the admin experience end-to-end.

export function isAuthenticated() {
  return !!getSession()
}

export function getSession() {
  if (IS_SUPABASE_CONFIGURED) {
    return { email: read('isoa_last_email', null) } // refreshed in UI via supabase
  }
  return read(KEYS.session, null)
}

export async function signInWithGoogle() {
  if (IS_SUPABASE_CONFIGURED) {
    // Real OAuth — redirect flow. The result is handled by an auth callback,
    // and the profile page verifies auth.email() against the allow-list.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/admin' },
    })
    if (error) throw error
    return { needsRedirect: true }
  }
  await delay(500)
  const session = {
    email: ALLOWED_ADMIN_EMAIL,
    name: 'i-SOA DigiLab',
    demo: true,
    at: Date.now(),
  }
  write(KEYS.session, session)
  return session
}

export async function signOut() {
  if (IS_SUPABASE_CONFIGURED) {
    try {
      await supabase.auth.signOut()
    } catch {
      /* noop */
    }
    try {
      localStorage.removeItem('isoa_last_email')
    } catch {
      /* noop */
    }
    delete mem.isoa_last_email
    return
  }
  write(KEYS.session, null)
}

export function isAdminEmail(email) {
  return (email || '').trim().toLowerCase() === ALLOWED_ADMIN_EMAIL
}

/* ------------------------------------------------------------------ */
/* ABOUT PAGE CONTENT (editable from admin, no code needed)             */
/* ------------------------------------------------------------------ */
export const DEFAULT_ABOUT = {
  intro:
    'i-SOA DigiLab est la branche de recherche et développement informatique du groupe i-SOAMADA Company. Notre équipe imagine, conçoit et développe les applications, sites web et solutions technologiques que vous retrouvez sur cette vitrine.',
  mission:
    'Notre mission est de créer des produits numériques utiles, performants et accessibles — conçus de bout en bout par nos soins — pour répondre aux besoins de notre écosystème et de nos clients.',
  vision:
    'Devenir la référence du produit numérique fait maison à Madagascar et au-delà : des solutions web et mobiles modernes, fiables et sécurisées, portées par une même marque.',
  values: ['Innovation', 'Qualité', 'Sécurité', 'Transparence'],
}

export async function getAboutContent() {
  if (IS_SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('about_content').select('*').maybeSingle()
    if (error) throw error
    return data || DEFAULT_ABOUT
  }
  return read('isoa_about', DEFAULT_ABOUT)
}

export async function saveAboutContent(content) {
  if (IS_SUPABASE_CONFIGURED) {
    const row = { ...content, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('about_content').upsert(row, { onConflict: 'id' }).select().single()
    if (error) throw error
    return data
  }
  write('isoa_about', content)
  return content
}

/* Tracking of "most viewed" products (demo + optional Supabase analytics col) */
export function recordView(slug) {
  try {
    const map = read('isoa_views', {})
    map[slug] = (map[slug] || 0) + 1
    write('isoa_views', map)
  } catch {
    /* noop */
  }
}
export function getViews() {
  return read('isoa_views', {})
}
export function resetViews() {
  try {
    localStorage.removeItem('isoa_vie
