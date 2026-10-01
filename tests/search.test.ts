import { readFileSync } from 'node:fs'
import { prepare, searchIndex } from '../src/lib/search.ts'
const idx = prepare(JSON.parse(readFileSync('src/generated/search.json', 'utf8')))
// expected: one id, or several equally-valid ids (any of them in the top 3 passes)
const cases: [string, string | string[]][] = [
  ['Светна ми лампата за маслото', 'dashboard/oil-pressure'],
  ['Светна check engine', 'dashboard/check-engine'],
  ['Колата тресе на празен ход', 'symptoms/engine-shaking-idle'],
  ['Чува се тракане от двигателя', 'noises/engine-ticking'],
  ['От ауспуха излиза бял пушек', 'smoke/white-smoke'],
  ['Колата не пали', 'flow/no-start'],
  ['Акумулаторът пада', 'symptoms/battery-drains'],
  ['Свети ABS', 'dashboard/abs'],
  ['Колата загрява', 'symptoms/overheating'],
  ['Чува се свистене при ускорение', 'noises/belt-squeal'],
  ['светна ми червена лампа с масльонка', 'dashboard/oil-pressure'],
  ['колата пуши бяло', 'smoke/white-smoke'],
  ['чува се чукане от двигателя', 'noises/engine-knocking'],
  ['колата трудно пали сутрин', 'symptoms/hard-start-cold'],
  ['воланът тресе при спиране', 'symptoms/brake-vibration'],
  ['чувам свистене при подаване на газ', 'noises/noise-acceleration'],
  ['има масло под колата', 'leaks/engine-oil'],
  ['температурата се вдига', 'symptoms/overheating'],
  ['колата губи антифриз', ['symptoms/coolant-loss', 'leaks/coolant', 'dashboard/coolant-level']],
  ['работи на 3 цилиндъра', 'symptoms/engine-misfire'],
  ['двигателят прекъсва', 'symptoms/engine-misfire'],
  ['p0300', 'obd/p0300'],
  ['Р0420', 'obd/p0420'],
  ['svети chekа', 'dashboard/check-engine'],
  ['свири турбото', 'noises/turbo-whistle'],
  ['щрака при завиване', 'noises/cv-joint-clicking'],
  ['буксува съединителя', 'symptoms/clutch-slipping'],
  ['печката не грее', 'symptoms/heater-weak'],
  ['не превключва на газ', 'symptoms/lpg-problems'],
  ['мирише на газ', 'smells/lpg-smell'],
  ['спиралката мига', 'dashboard/glow-plug'],
  ['влезе в авариен', 'symptoms/limp-mode'],
  ['лагер бучи', 'noises/wheel-bearing-hum'],
  ['климата духа топло', 'symptoms/ac-not-cold'],
  ['5w30 или 5w40', 'guides/engine-oil'],
]
let ok = 0
for (const [q, exp] of cases) {
  const r = searchIndex(idx, q, 5)
  const ok3 = Array.isArray(exp) ? exp : [exp]
  const pos = r.findIndex((h) => ok3.includes(h.id))
  const pass = pos >= 0 && pos < 3
  if (pass) ok++
  console.log(`${pass ? 'OK ' : 'XX '} [${pos}] ${q} → ${r.slice(0, 3).map((h) => h.id).join(', ')}`)
}
console.log(`\n${ok}/${cases.length} in top-3`)
if (ok < cases.length) process.exitCode = 1
