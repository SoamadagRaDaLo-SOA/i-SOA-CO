// Tiny helpers that produce self-contained SVG data-URIs (icons & screenshots)
// so the demo catalogue renders without any external asset.

const wrap = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`

export function makeIcon({ bg, fg, label }) {
  const initials = (label || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <defs><linearGradient id="g" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/>
    </linearGradient></defs>
    <rect width="128" height="128" rx="30" fill="url(#g)"/>
    <text x="64" y="74" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="52" fill="${fg}">${initials}</text>
  </svg>`
  return wrap(svg)
}

export function makeScreenshot({ title, accent, body }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 460">
    <rect width="720" height="460" rx="20" fill="#0f172a"/>
    <rect x="0" y="0" width="720" height="52" rx="20" fill="#1e293b"/>
    <rect x="24" y="18" width="54" height="10" rx="5" fill="#334155"/>
    <rect x="150" y="18" width="40" height="10" rx="5" fill="#334155"/>
    <rect x="240" y="18" width="40" height="10" rx="5" fill="#334155"/>
    <rect x="0" y="36" width="720" height="16" fill="#1e293b"/>
    <rect x="28" y="84" width="220" height="24" rx="8" fill="${accent}"/>
    <rect x="28" y="126" width="300" height="10" rx="5" fill="#334155"/>
    <circle cx="660" cy="96" r="14" fill="${accent}"/>
    <text x="650" y="230" text-anchor="end" font-family="Arial, sans-serif" font-weight="700" font-size="28" fill="#e2e8f0">${title}</text>
    <rect x="28" y="260" width="664" height="150" rx="14" fill="#1e293b"/>
    ${(body || [])
      .map(
        (w, i) =>
          `<rect x="${58 + i * 130}" y="286" width="86" height="96" rx="12" fill="${i % 2 ? '#334155' : accent}" opacity="0.85"/>`
      )
      .join('')}
  </svg>`
  return wrap(svg)
}

export function fakeImg(seed = 'a') {
  // a very light abstract banner used as fallback
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 460">
    <rect width="720" height="460" fill="#1e293b"/>
    <circle cx="${120 + (seed.charCodeAt(0) % 4) * 90}" cy="120" r="70" fill="#3382ff" opacity="0.5"/>
    <circle cx="620" cy="330" r="90" fill="#7c3aed" opacity="0.4"/>
  </svg>`
  return wrap(svg)
}
