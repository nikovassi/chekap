import React from 'react'
void React
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync } from 'node:fs'
import { LightIcon, LIGHT_ICON_KEYS } from '../../src/components/LightIcon'
const html = `<html><body style="background:#0a0d11;color:#ccc;font:11px sans-serif;display:grid;grid-template-columns:repeat(9,110px);gap:8px;padding:10px">` +
  LIGHT_ICON_KEYS.map(k => `<div style="text-align:center;background:#07090c;padding:6px;border-radius:10px">${renderToStaticMarkup(<LightIcon name={k} color="amber" size={72} />)}<div>${k}</div></div>`).join('') + `</body></html>`
writeFileSync('/tmp/claude-0/gallery.html', html)
