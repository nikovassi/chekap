/** Friendly / legacy URLs → canonical pages (client redirect + prerendered meta-refresh pages). */
export const ALIASES: Record<string, string> = {
  '/symptoms/engine-shaking': '/symptoms/engine-shaking-idle',
  '/symptoms/white-smoke': '/smoke/white-smoke',
  '/symptoms/blue-smoke': '/smoke/blue-smoke',
  '/symptoms/black-smoke': '/smoke/black-smoke',
  '/symptoms/no-start': '/no-start',
  '/overheating': '/symptoms/overheating',
  '/obd2': '/obd',
  '/lights': '/dashboard',
  '/guides/check-engine': '/check-engine',
}
