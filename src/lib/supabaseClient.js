import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client.
 *
 * Set these in a `.env` file (see `.env.example`) to go live:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJhbGci...
 *
 * If they are missing, the app runs in DEMO MODE: it uses a local
 * in-browser data store (localStorage) seeded with the launch catalogue,
 * and a simulated Google sign-in. This lets you preview the whole product
 * without a backend. When you add real credentials, everything switches
 * over to Supabase automatically.
 */

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const IS_SUPABASE_CONFIGURED = Boolean(url && anonKey)

export const supabase = IS_SUPABASE_CONFIGURED
  ? createClient(url, anonKey)
  : null

/** The ONLY Google account allowed into the admin space. */
export const ALLOWED_ADMIN_EMAIL = 'isoadigilabmailaka@gmail.com'
