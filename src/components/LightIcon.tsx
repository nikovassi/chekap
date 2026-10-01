import type { ReactNode } from 'react'

/**
 * Chekap dashboard-symbol system.
 * Original line-art drawings of the ISO 2575-style symbols commonly used on dashboards.
 * 48×48 grid, 2.6 stroke, round caps – designed to read clearly at 32–96 px.
 * Real symbols vary by manufacturer; these are representative, not brand-exact.
 */

const T = ({ x = 24, y = 28.5, s = 11, children }: { x?: number; y?: number; s?: number; children: ReactNode }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={800} fontFamily="Unbounded, Manrope Variable, sans-serif" fill="currentColor" stroke="none">
    {children}
  </text>
)

const BrakeArcs = () => (
  <>
    <circle cx="24" cy="24" r="11.5" />
    <path d="M9.5 13.5a17 17 0 0 0 0 21M38.5 13.5a17 17 0 0 1 0 21" />
  </>
)
const Bang = ({ x = 24, y = 24, h = 9 }: { x?: number; y?: number; h?: number }) => (
  <>
    <path d={`M${x} ${y - h / 2 - 1}v${h - 2}`} />
    <circle cx={x} cy={y + h / 2 + 1.2} r="1.4" fill="currentColor" stroke="none" />
  </>
)
const CarSide = ({ y = 0 }: { y?: number }) => (
  <g transform={`translate(0 ${y})`}>
    <path d="M9 27v-4.5l3.5-6.5c.5-1 1.4-1.5 2.5-1.5h18c1.1 0 2 .5 2.5 1.5l3.5 6.5V27c0 1-.8 1.8-1.8 1.8H10.8C9.8 28.8 9 28 9 27z" />
    <path d="M12.5 22h23" />
    <circle cx="15.5" cy="28.8" r="2.6" />
    <circle cx="32.5" cy="28.8" r="2.6" />
  </g>
)
const Squiggles = () => <path d="M12 38c2-2 3 2 5 0s3 2 5 0M26 38c2-2 3 2 5 0s3 2 5 0" />
const Headlamp = ({ flip = false }: { flip?: boolean }) => (
  <path d={flip ? 'M30 12c-6 0-10 5.4-10 12s4 12 10 12c1.7 0 3-5.4 3-12s-1.3-12-3-12z' : 'M18 12c6 0 10 5.4 10 12s-4 12-10 12c-1.7 0-3-5.4-3-12s1.3-12 3-12z'} />
)
const Thermo = ({ x = 24 }: { x?: number }) => (
  <>
    <path d={`M${x - 2.5} 30V10.5a2.5 2.5 0 0 1 5 0V30`} />
    <circle cx={x} cy="33" r="4" />
    <path d={`M${x + 2.5} 15h4M${x + 2.5} 20h4M${x + 2.5} 25h4`} />
  </>
)
const OilCan = () => (
  <>
    <path d="M8 21h6l3-3h9l3 3 10-4 3 2-11 10H17l-3-4H8z" />
    <path d="M20 18v-3h4M18 15h8" />
    <path d="M43 24c0 1.5-1 2.5-1.8 2.5S39.4 25.5 39.4 24s1.8-3.6 1.8-3.6S43 22.5 43 24z" fill="currentColor" />
  </>
)
const Gear = () => (
  <>
    <circle cx="24" cy="24" r="6" />
    <path d="M24 9v5M24 34v5M9 24h5M34 24h5M13.4 13.4l3.5 3.5M31.1 31.1l3.5 3.5M13.4 34.6l3.5-3.5M31.1 16.9l3.5-3.5" />
    <circle cx="24" cy="24" r="11" />
  </>
)
const Person = () => (
  <>
    <circle cx="20" cy="10" r="3.4" />
    <path d="M18 16l-2 12 3 3h7l4 9M16 28l-4 1M19 16l9 3" />
  </>
)
const Battery = ({ low = false }: { low?: boolean }) => (
  <>
    <rect x="8" y="15" width="32" height="21" rx="2.5" />
    <path d="M13 15v-3h6v3M29 15v-3h6v3" />
    {low ? <path d="M23 20l-3 6h6l-3 6" /> : <path d="M13 25h6M16 22v6M29 25h6" />}
  </>
)

const ICONS: Record<string, ReactNode> = {
  'check-engine': (
    <>
      <path d="M8 19v10M8 24h3M11 18h4v-3h9v3h4l3 3h3v-3h3v14h-3v-3h-3l-4 4H15l-4-4z" />
      <path d="M17 15v-3h5" />
    </>
  ),
  'oil-pressure': <OilCan />,
  'oil-level': (
    <>
      <g transform="translate(0 -4)">
        <OilCan />
      </g>
      <path d="M10 37c2.5-2 4.5 2 7 0s4.5 2 7 0 4.5 2 7 0 4.5 2 7 0" />
    </>
  ),
  battery: <Battery />,
  'engine-temperature': (
    <>
      <Thermo />
      <path d="M8 40c2.5-2 4.5 2 7 0s4.5 2 7 0 4.5 2 7 0 4.5 2 7 0 4.5 2 5 0" />
    </>
  ),
  'coolant-cold': (
    <>
      <Thermo />
      <path d="M8 40c2.5-2 4.5 2 7 0s4.5 2 7 0 4.5 2 7 0 4.5 2 7 0 4.5 2 5 0" />
    </>
  ),
  'coolant-level': (
    <>
      <path d="M12 14h24v20a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" />
      <path d="M17 14v-4h14v4" />
      <path d="M15 26c2-1.5 3.5 1.5 5.5 0s3.5 1.5 5.5 0 3.5 1.5 5.5 0" />
      <path d="M38 22h4M38 30h4" />
    </>
  ),
  'brake-system': (
    <>
      <BrakeArcs />
      <Bang />
    </>
  ),
  'brake-pads': (
    <>
      <circle cx="24" cy="24" r="10" />
      <path d="M11 13a16 16 0 0 0 0 22M37 13a16 16 0 0 1 0 22" strokeDasharray="3 3.5" />
      <path d="M7 10a20 20 0 0 0 0 28M41 10a20 20 0 0 1 0 28" />
    </>
  ),
  abs: (
    <>
      <path d="M9.5 13.5a17 17 0 0 0 0 21M38.5 13.5a17 17 0 0 1 0 21" />
      <circle cx="24" cy="24" r="12.5" />
      <T s={8.5} y={27}>ABS</T>
    </>
  ),
  esp: (
    <>
      <CarSide y={-4} />
      <Squiggles />
    </>
  ),
  'esp-off': (
    <>
      <CarSide y={-6} />
      <path d="M12 33c2-2 3 2 5 0s3 2 5 0M26 33c2-2 3 2 5 0s3 2 5 0" />
      <T s={8} y={45}>OFF</T>
    </>
  ),
  'traction-control': (
    <>
      <CarSide y={-4} />
      <Squiggles />
    </>
  ),
  airbag: (
    <>
      <Person />
      <circle cx="35" cy="17" r="6" />
      <path d="M10 41h28" />
    </>
  ),
  'seat-belt': (
    <>
      <circle cx="24" cy="9" r="3.6" />
      <path d="M16 41V22a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v19" />
      <path d="M17 18l15 18" strokeWidth="3.4" />
    </>
  ),
  tpms: (
    <>
      <path d="M14 38c-3-3.5-5-8.5-5-14 0-6 2.3-11 5.5-14M34 38c3-3.5 5-8.5 5-14 0-6-2.3-11-5.5-14" />
      <path d="M11 38h26" />
      <path d="M14 30h2M32 30h2M12 22h2M34 22h2" />
      <Bang y={23} h={11} />
    </>
  ),
  'power-steering': (
    <>
      <circle cx="21" cy="24" r="13" />
      <circle cx="21" cy="24" r="4" />
      <path d="M8.5 21h8.5M25 21h8.5M21 28v9" />
      <Bang x={41} y={24} h={11} />
    </>
  ),
  'glow-plug': (
    <path d="M6 30c3 0 3-12 6-12s3 12 6 12 3-12 6-12 3 12 6 12 3-12 6-12 3 12 6 12M24 18v-6" />
  ),
  dpf: (
    <>
      <path d="M5 24h6M37 24h6" />
      <rect x="11" y="13" width="26" height="22" rx="4" />
      {[17, 24, 31].map((x) => [19, 24, 29].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill="currentColor" stroke="none" />))}
    </>
  ),
  adblue: (
    <>
      <path d="M10 12h14v26H10z" />
      <path d="M24 18h4l3 3v9" />
      <path d="M38 22s5 6 5 9a5 5 0 0 1-10 0c0-3 5-9 5-9z" />
      <path d="M13 17h8" />
    </>
  ),
  'water-in-fuel': (
    <>
      <path d="M9 40V11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v29M6 40h22" />
      <path d="M12 15h10v7H12z" />
      <path d="M25 18h4l3 3v11" />
      <path d="M38 22s4 5 4 8a4 4 0 0 1-8 0c0-3 4-8 4-8z" fill="currentColor" />
    </>
  ),
  epc: <T s={13} y={29}>EPC</T>,
  service: (
    <path d="M30 8a8 8 0 0 0-7.6 10.4L9.5 31.3a3.3 3.3 0 1 0 4.7 4.7l12.9-12.9A8 8 0 0 0 37.6 15.5l-4.8 4.8-4.4-1.2-1.2-4.4 4.8-4.8A8 8 0 0 0 30 8z" />
  ),
  transmission: (
    <>
      <Gear />
      <Bang x={42} y={24} h={11} />
    </>
  ),
  'transmission-temperature': (
    <>
      <g transform="translate(-6 0)">
        <Gear />
      </g>
      <path d="M38 30V13a2.2 2.2 0 0 1 4.4 0v17" />
      <circle cx="40.2" cy="33" r="3.4" />
    </>
  ),
  'low-fuel': (
    <>
      <path d="M10 40V11a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v29M7 40h23" />
      <path d="M13 15h11v8H13z" />
      <path d="M27 17h4l4 4v13a2.5 2.5 0 0 0 5 0V18l-4-5" />
    </>
  ),
  'washer-fluid': (
    <>
      <path d="M7 38c4-9 11-14 17-14s13 5 17 14z" />
      <path d="M24 24v-4M16 18l2 3M32 18l-2 3M24 13v2M11 13l3 3M37 13l-3 3" />
    </>
  ),
  'bulb-failure': (
    <>
      <path d="M17 31c-3-2.5-5-6-5-10a12 12 0 0 1 24 0c0 4-2 7.5-5 10v4H17z" />
      <path d="M18 39h12" />
      <Bang y={21} h={10} />
    </>
  ),
  'low-beam': (
    <>
      <Headlamp />
      <path d="M31 15l9 3M31 21l9 3M31 27l9 3M31 33l9 3" />
    </>
  ),
  'high-beam': (
    <>
      <Headlamp />
      <path d="M31 14h10M31 20h10M31 26h10M31 32h10" />
    </>
  ),
  'front-fog': (
    <>
      <Headlamp />
      <path d="M31 16l9 3M31 22.5l9 3M31 29l9 3" />
      <path d="M36 10c-2 4.5 2 9 0 14s2 9.5 0 14" />
    </>
  ),
  'rear-fog': (
    <>
      <Headlamp flip />
      <path d="M7 16h10M7 22.5h10M7 29h10" />
      <path d="M12 10c-2 4.5 2 9 0 14s2 9.5 0 14" />
    </>
  ),
  'turn-signals': (
    <>
      <path d="M4 24l9-8v4.5h7v7h-7V32z" fill="currentColor" />
      <path d="M44 24l-9-8v4.5h-7v7h7V32z" fill="currentColor" />
    </>
  ),
  'cruise-control': (
    <>
      <path d="M9 32a15 15 0 1 1 30 0" />
      <path d="M24 32l7-9" />
      <circle cx="24" cy="32" r="2" fill="currentColor" stroke="none" />
      <path d="M13 24l2.5 1.5M24 17v3M35 24l-2.5 1.5" />
      <path d="M30 38l6 0l-2.5-2.5M36 38l-2.5 2.5" />
    </>
  ),
  'lane-assist': (
    <>
      <path d="M17 13h14l3 9v9H14v-9z" />
      <path d="M14 22h20M18 31v3M30 31v3" />
      <path d="M7 10l-2 6M4 22l-1.5 6M2 34l-1 4M41 10l2 6M44 22l1.5 6M46 34l1 4" />
    </>
  ),
  'blind-spot': (
    <>
      <rect x="9" y="12" width="15" height="25" rx="5" />
      <path d="M9 21h15M9 30h15" />
      <path d="M30 18a9 9 0 0 1 0 13M35 14a15 15 0 0 1 0 21M40 10a21 21 0 0 1 0 29" />
    </>
  ),
  'parking-sensors': (
    <>
      <path d="M10 37V12h8a7 7 0 0 1 0 14h-8" />
      <path d="M30 18a9 9 0 0 1 0 13M35 14a15 15 0 0 1 0 21M40 10a21 21 0 0 1 0 29" />
    </>
  ),
  'start-stop': (
    <>
      <path d="M35.3 13.5A15 15 0 1 0 39 24" />
      <path d="M36 6v8h-8" />
      <T s={13} y={29}>A</T>
    </>
  ),
  immobilizer: (
    <>
      <CarSide y={-8} />
      <circle cx="18" cy="35" r="4.5" />
      <path d="M22.5 35H38M33 35v4M37 35v3" />
    </>
  ),
  'parking-brake': (
    <>
      <BrakeArcs />
      <T s={13} y={29}>P</T>
    </>
  ),
  'electric-parking-brake': (
    <>
      <BrakeArcs />
      <T s={11} x={21} y={28.5}>P</T>
      <path d="M28 19.5v5" />
      <circle cx="28" cy="28.5" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  'four-wheel-drive': (
    <>
      <rect x="10" y="9" width="7" height="10" rx="2" />
      <rect x="31" y="9" width="7" height="10" rx="2" />
      <rect x="10" y="29" width="7" height="10" rx="2" />
      <rect x="31" y="29" width="7" height="10" rx="2" />
      <path d="M17 14h14M17 34h14M24 14v20" />
      <circle cx="24" cy="14" r="2.5" />
      <circle cx="24" cy="34" r="2.5" />
    </>
  ),
  'hybrid-system': (
    <>
      <CarSide y={-5} />
      <Bang x={24} y={14} h={7} />
      <path d="M24 30l-3 5h6l-3 5" />
    </>
  ),
  'ev-system': (
    <>
      <CarSide y={6} />
      <path d="M26 4l-5 7.5h6L22 19" />
    </>
  ),
  'power-limited': (
    <>
      <path d="M10 30c0-8 6-14 14-14s14 6 14 14z" />
      <path d="M17 22l7 8 7-8M24 16v14" />
      <path d="M38 27c3 0 5 1 5 3s-2 2-4 1" />
      <path d="M13 30l-2 5M35 30l2 5" />
      <path d="M10 30H7" />
    </>
  ),
  'charging-cable': (
    <>
      <path d="M17 8v8M31 8v8" />
      <path d="M12 16h24v6a12 12 0 0 1-24 0z" />
      <path d="M24 34v8" />
    </>
  ),
  'regenerative-braking': (
    <>
      <BrakeArcs />
      <path d="M19 22a6 6 0 0 1 10.5-2.5M29 26a6 6 0 0 1-10.5 2.5" />
      <path d="M30 16v4h-4M18 32v-4h4" />
    </>
  ),
  'ev-battery-low': <Battery low />,
  'frost-warning': (
    <path d="M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18M19 9l5 4 5-4M19 39l5-4 5 4M9 21l6-1-2-6M39 27l-6 1 2 6M9 27l6 1-2 6M39 21l-6-1 2-6" />
  ),
  'door-open': (
    <>
      <path d="M17 8h14c2 0 3.5 1.5 3.5 3.5V36c0 2-1.5 3.5-3.5 3.5H17c-2 0-3.5-1.5-3.5-3.5V11.5C13.5 9.5 15 8 17 8z" />
      <path d="M13.5 18H34.5M13.5 30H34.5" />
      <path d="M34.5 19l7 5M13.5 19l-7 5" />
    </>
  ),
  'bonnet-open': (
    <>
      <path d="M6 33v-5l5-1 6-8h14l8 7h3v7z" />
      <path d="M6 28l-1-12 13 3" />
      <circle cx="13" cy="34" r="3" />
      <circle cx="35" cy="34" r="3" />
    </>
  ),
  'auto-hold': (
    <>
      <path d="M9.5 13.5a17 17 0 0 0 0 21M38.5 13.5a17 17 0 0 1 0 21" />
      <circle cx="24" cy="24" r="12.5" />
      <T s={10} y={28}>A</T>
    </>
  ),
  'hill-descent': (
    <>
      <path d="M4 40L44 22v18z" />
      <g transform="rotate(-24 22 22)">
        <CarSide y={-6} />
      </g>
    </>
  ),
  'steering-lock': (
    <>
      <circle cx="20" cy="24" r="13" />
      <circle cx="20" cy="24" r="4" />
      <path d="M7.5 21H16M24 21h8.5M20 28v9" />
      <rect x="33" y="26" width="11" height="9" rx="1.5" />
      <path d="M35.5 26v-3a3 3 0 0 1 6 0v3" />
    </>
  ),
}

const LAMP: Record<string, string> = {
  red: 'var(--color-lamp-red)',
  amber: 'var(--color-lamp-amber)',
  green: 'var(--color-lamp-green)',
  blue: 'var(--color-lamp-blue)',
  white: 'var(--color-lamp-white)',
}

export function lampColor(c: string) {
  return LAMP[c] ?? c
}

export function LightIcon({
  name,
  color = 'amber',
  size = 48,
  glow = true,
  className,
}: {
  name: string
  color?: string
  size?: number
  glow?: boolean
  className?: string
}) {
  const c = lampColor(color)
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ color: c, filter: glow ? `drop-shadow(0 0 6px ${c}88)` : undefined }}
      aria-hidden="true"
    >
      {ICONS[name] ?? <Bang />}
    </svg>
  )
}

export const LIGHT_ICON_KEYS = Object.keys(ICONS)
