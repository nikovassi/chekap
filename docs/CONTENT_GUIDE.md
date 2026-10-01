# Chekap – content guide (for writers & contributors)

Chekap (ЧЕКАП) is a Bulgarian car-help reference. Audience: ordinary drivers, often standing next to the car, on a phone.
Every page must answer in seconds: **Какво означава? Колко сериозно е? Мога ли да карам? Какво да проверя? Кога в сервиз? Какво да кажа на механика?**

## Language rules (MANDATORY)
- Bulgarian, plain, short sentences. Imperative for steps ("Спри на безопасно място.").
- NEVER diagnose categorically. Never "със сигурност е…", "това е…". Use: "Възможните причини включват…", "Този симптом често се свързва с…", "Необходима е проверка, за да се установи причината."
- Distinguish: **симптом** (what you notice) / **възможна причина** / **диагностичен тест** / **потвърдена повреда**.
- An OBD code is NOT a diagnosis: it says which self-test failed. Never "P0301 = сменете бобината".
- Intervals: never give a universal interval. Say "Следвай интервала в ръководството на конкретния автомобил." If giving an orientation, label it explicitly: "Общ ориентир: …".
- Safety: when sources justify it, say clearly "СПРИ АВТОМОБИЛА" / "НЕ ПРОДЪЛЖАВАЙ ДА КАРАШ" (low oil pressure, overheating, brake system failure, significant fuel leak, smoke or fire, serious steering problem, serious tyre damage, exhaust fumes in cabin).
- Never tell people to open a hot cooling system cap. Never suggest disabling/deleting DPF/EGR/AdBlue (illegal).
- Do not copy forum text. Do not invent statistics or URLs.
- Brand-specific notes are fine as "напр. при VW групата…" but say symbols/behaviour differ between manufacturers.

## Urgency scale (contextual, never by colour alone)
- `stop` – 🔴 СПРИ ВЕДНАГА – не продължавай без проверка.
- `soon` – 🟠 ПРОВЕРИ ВЪЗМОЖНО НАЙ-СКОРО.
- `monitor` – 🟡 НАБЛЮДАВАЙ И ПРОВЕРИ.
- `info` – 🔵 ИНФОРМАЦИЯ – активна функция / информация.
Every non-trivial entry needs `urgencyContext` with ≥2 rows, e.g. `{when:'Лампата мига', level:'stop'}`, `{when:'Свети постоянно, колата работи нормално', level:'soon'}`.

## Keywords (critical for search)
For every entry add 10–25 `keywords`: how real Bulgarian drivers write it — slang, misspellings, no-punctuation, Latin transliteration, mixed Latin/Cyrillic, plus 2–4 English terms. Examples:
"тресе на празен ход", "работи на 3 цилиндъра", "прекъсва", "мотора се дави", "trese", "свети чека", "check-a", "масльонката", "свири турбото", "влезе в авариен", "буксува съединителя", "щрака при завиване", "лагер бучи", "печката не грее", "гони антифриз", "спиралката мига", "не превключва на газ", "misfire", "rough idle".
Bulgarian slang ↔ part: чек=check engine, масльонка=oil pressure lamp, спиралка=glow plug lamp, компа=ECU, бобина/бубина=coil, дюзи=injectors, жигльори=LPG jets, дебитомер=MAF, турбина/турбото, интеркулер, ЕГР, ДПФ/FAP, катът=catalyst, гърне=muffler, гарнитура=(head) gasket, картер=oil pan, ангренаж=timing belt/chain, двумасовик=DMF, феродо/кош=clutch, каре/полуоска=CV joint/driveshaft, маншон=CV boot, биалетка=drop link, носач=control arm, шарнир=ball joint, тампон=bushing/mount, рейка=steering rack, накрайник=tie-rod end, кормилна=power steering, накладки=pads, апарат/челюст=caliper, печка/парно=heater, климата=AC, казанче=expansion tank, перка=radiator fan, газаджия=LPG tech, изпарител/редуктор=LPG reducer, маса=ground.
Bulgarian context: many 2000s VW 1.9 TDI, BMW N47/M47, Opel, Ford, Peugeot HDi; LPG (газова уредба) very common; cold winters (diesel gelling, weak batteries, glow plugs).

## Canonical slugs (use ONLY these in `related`, format `section/slug`)

### dashboard/
check-engine, oil-pressure, oil-level, battery, engine-temperature, coolant-cold, coolant-level, brake-system, brake-pads, abs, esp, esp-off, traction-control, airbag, seat-belt, tpms, power-steering, glow-plug, dpf, adblue, water-in-fuel, epc, service, transmission, transmission-temperature, low-fuel, washer-fluid, bulb-failure, low-beam, high-beam, front-fog, rear-fog, turn-signals, cruise-control, lane-assist, blind-spot, parking-sensors, start-stop, immobilizer, parking-brake, electric-parking-brake, four-wheel-drive, hybrid-system, ev-system, power-limited, charging-cable, regenerative-braking, ev-battery-low, frost-warning, door-open, bonnet-open, auto-hold, hill-descent, steering-lock

### symptoms/
Engine/fuel/cooling/oil/electrical:
no-start-no-crank, no-start-cranks, hard-start-cold, starts-then-dies, engine-shaking-idle, engine-misfire, engine-shaking-acceleration, loss-of-power, limp-mode, hesitation-acceleration, high-idle, unstable-idle, stalls-when-stopping, stalls-on-acceleration, oil-consumption, coolant-loss, overheating, turbo-not-working, oil-in-intercooler, low-compression, poor-fuel-economy, lpg-problems, oil-in-coolant, coolant-in-oil, battery-drains, slow-crank, flickering-lights, electrical-faults, alternator-not-charging
Chassis/transmission/climate/lights:
brake-vibration, soft-brake-pedal, hard-brake-pedal, brake-pedal-sinks, car-pulls-braking, handbrake-not-holding, tire-losing-air, uneven-tire-wear, vibration-at-speed, car-pulls-to-side, steering-wheel-shakes, steering-play, heavy-steering, car-unstable, bouncy-ride, clutch-slipping, hard-shifting, gear-pops-out, clutch-pedal-problems, automatic-harsh-shift, automatic-slipping, gearbox-delay-engagement, dsg-judder, gearbox-limp-mode, ac-not-cold, heater-weak, no-airflow, blower-not-working, foggy-windows, headlight-condensation, dim-headlights, bulb-out, headlights-flicker

### noises/
engine-knocking, engine-ticking, timing-chain-rattle, clunk-over-bumps, belt-squeal, turbo-whistle, suspension-squeak, brake-squeal, brake-grinding, transmission-whine, power-steering-whine, wheel-bearing-hum, cv-joint-clicking, exhaust-popping, hissing, metal-rattle-underneath, humming-vibration, cold-start-noise, noise-when-warm, noise-acceleration, noise-braking, noise-turning, noise-idle, starter-clicking, clutch-noise, exhaust-leak-noise

### smoke/
white-smoke, white-smoke-cold-start, blue-smoke, black-smoke, grey-smoke, smoke-on-acceleration, smoke-at-idle, smoke-after-standing, smoke-on-deceleration, smoke-from-bonnet

### smells/
fuel-smell, diesel-smell, lpg-smell, burning-oil-smell, coolant-smell, burning-smell, burning-rubber-smell, clutch-smell, brake-smell, exhaust-fumes-cabin, sulphur-smell, burning-plastic-smell, ac-smell

### leaks/
engine-oil, coolant, brake-fluid, fuel, water, washer-fluid, transmission-fluid, differential-oil, power-steering-fluid, ac-condensate

### guides/
check-engine, obd-basics, engine-oil, cooling-system, battery-electrical, brakes, tires, suspension-steering, transmission-clutch, ac-heating, lights, dpf-egr-adblue, lpg

### maintenance/
daily, weekly, monthly, seasonal, annual, by-mileage, by-age, before-trip, before-winter, before-summer, oil-change

### flow/
no-start, engine-shaking, warning-light, noise, smoke, smell, leak, overheating, electrical, tires, brakes

### obd/
lowercase code, e.g. obd/p0300 (see obd.ts for list)

## Sources
Use ids from `src/data/sources.ts` only (e.g. 'aa-lights', 'rac-overheating', 'cr-cel', 'kia-lights', 'vw-dpf', 'fmvss-138', 'bosch-brake-fluid', 'bg-zdvp-139'). Every entry needs ≥1 source. Do not cite forums as sources.
