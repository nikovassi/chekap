/** ЧЕКАП logo: a gauge arc whose needle forms a check mark. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3df5c8" />
          <stop offset="1" stopColor="#4da3ff" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#11151b" stroke="#252d39" />
      <path d="M9.5 27a12 12 0 1 1 21 0" fill="none" stroke="url(#lg-a)" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M13.5 20.5l4.5 4.5 9-10" fill="none" stroke="#eef2f6" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="25" r="1.6" fill="#3df5c8" />
    </svg>
  )
}

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="font-display text-[1.15rem] font-bold tracking-tight text-ink">
        ЧЕКАП<span className="text-accent">.</span>
      </span>
    </span>
  )
}
