# Chekap – research summary (October 2026)

Research was done before development. Technical claims come from motoring organisations, manufacturers, regulators and technical suppliers (listed in `src/data/sources.ts`). Bulgarian forums (opelclub.bg, skodaclub.bg, bmwpower-bg.net, forum.vwclub.bg, audibg.com, clubford.org, peugeotclub.info, forum.nissanbg.com…) were used **only** to understand how drivers describe problems – never as a technical source, and no forum text was copied.

## 1. How good reference sites work
- RAC / AA / Consumer Reports organise warning lights by **colour first** (red = act now, amber = check soon, green/blue/white = info) and give **one clear action** ("stop and switch off", "drive carefully to a garage").
- Sources sometimes disagree (RAC general page: "don't drive with the engine light"; RAC EML page: "usually you can drive"). Chekap therefore uses **contextual urgency** (steady vs flashing, other symptoms) rather than colour alone.
- Manufacturer symbols and colours differ (oil, coolant, transmission, EPB). Every light page says "провери ръководството на автомобила".

## 2. Verified key facts – warning lights
- **Check engine steady** → not an emergency, book a check soon (Consumer Reports). **Flashing** → severe misfire, unburned fuel can damage the catalytic converter; AA: avoid heavy acceleration/high revs, stop when safe. VW: steady light – remove key 30 s, restart; flashing + vibration + power loss → call assistance.
- **Oil pressure (red)** → RAC: "switch the engine off immediately". Wait ~10 min, check dipstick. If level OK and light persists → do not restart, tow (AA).
- **Oil level (amber)** → low level rather than pressure (RAC). Some Ford use one symbol for both.
- **Battery/charging (red)** → AA: stop in a safe place, don't restart; Kia: drive carefully to nearest safe location. Car runs on battery only; if the auxiliary belt failed, the water pump may also stop on many engines.
- **Engine temperature (red)** → RAC: let it cool ≥30 min; never remove the radiator/expansion cap when hot (pressurised – severe steam burns). Blue thermometer = engine cold (info).
- **Brake (red)** → check parking brake fully released; if it stays on → stop (Toyota/RAC: "serious, potentially dangerous"). Red brake + ABS together → stop.
- **ABS (amber)** → normal brakes still work without anti-lock assistance (Kia); often a wheel-speed sensor (AA).
- **ESP flashing** = system intervening, normal (VW). Steady = fault, have it checked. ESP OFF = switched off.
- **Airbag** → lights ~6 s at start; if it stays on, fault – airbag may not deploy (Kia, Ford/RAC).
- **TPMS** → warning required at ≥25 % below recommended pressure (FMVSS 138). **Flashing 60–90 s then steady = system malfunction**, not pressure (Kia ≈70 s). Indirect systems need reset after inflating.
- **DPF** → AA: ~10 min above 40 mph (~65 km/h) on faster roads. VW UK: ≥15 min at ≥60 km/h, 1800–2500 rpm. If ignored → limp mode, forced regeneration, or expensive replacement.
- **AdBlue** → warning at ~1500 miles (~2400 km) left (AA); when the tank is empty the engine will not restart (VW/RAC, AA); ~3–5 L needed to restart (AA).
- **Glow plug** → wait until it goes out before starting (AA); flashing while driving = fault (VW).
- **EPC (VW group)** → throttle / engine-management fault; usually drivable to a garage, may enter limp mode.
- **Water in fuel (diesel)** → drain water filter; leaving it can damage the fuel system (Kia).
- **Frost** → VW: on below +4 °C, off above +6 °C – black ice possible.
- **EV turtle / power limited** → power limited to protect components; charge, avoid hard acceleration (Kia). VW red EV fault → stop immediately.
- **Regenerative braking warning (Kia)** → pedal may be harder, braking distance may increase.

## 3. OBD-II / EOBD
- EOBD mandatory in the EU: petrol from 2001, diesel from 2004. US OBD-II: 1996.
- 16-pin J1962 socket, usually under the dashboard on the driver's side (within ~0.6 m of the wheel).
- Code structure (SAE J2012): letter P/B/C/U; 2nd char 0 = generic, 1 = manufacturer; 3rd = subsystem (1–2 fuel/air, 3 ignition/misfire, 4 emissions, 5 speed/idle, 6 computer, 7–9 transmission).
- **Pending** (one drive cycle) vs **confirmed** (MIL on) vs **permanent** (cannot be erased with a tool; clears itself only after the monitor passes).
- **Freeze frame** = snapshot of conditions when the code set. **Readiness monitors** reset when codes are cleared.
- Clearing codes does not fix the fault; it deletes evidence (freeze frame) and resets monitors.
- **Code ≠ diagnosis**: the code is the failed test, the symptom is what the driver feels, the root cause is the actual defect. "Test, don't guess."

## 4. Exhaust smoke
- **Thin white vapour that clears quickly** = condensation, normal in cold weather. **Thick, persistent white smoke, sweet smell** = possible coolant burning (head gasket, cracked head/block).
- **Blue** = burning oil – never normal: valve stem seals, piston rings, turbo seals, PCV, overfilled oil.
- **Black** = rich mixture: injectors, air filter, MAF, boost leak/turbo on diesels, EGR, DPF; brief puff at start or during DPF regeneration possible.
- **Grey** = oil, PCV, transmission fluid (automatic) or turbo – needs investigation.

## 5. Smells (RAC)
Fuel – leak/injector/cap → stop, ventilate, don't drive (AA). Burning oil – oil on hot parts. Sweet – coolant leak (heater core inside cabin). Burning rubber – belts, brakes, debris. Burning clutch – slipping clutch. Hot brakes – stuck caliper. Exhaust fumes in cabin – CO risk (odourless; headache, dizziness, nausea) → stop, ventilate. Rotten egg – catalytic converter or overcharged battery. Burning plastic – electrical short → stop. Musty AC – drains, cabin filter.

## 6. Leaks (RAC, Fel-Pro)
Engine oil brown/black, slippery – under engine. Coolant green/yellow/pink/blue/orange, sweet, slimy – around engine/radiator (toxic to pets). Brake fluid clear-to-brown, slippery, near wheels – **critical, don't drive**. Transmission fluid red/pink (mid car). Power steering red/brown (front). Fuel – strong smell, rainbow sheen – **critical**. Water/AC condensate – clear, odourless, normal. Washer fluid – blue etc. Differential – dark, thick gear oil at rear axle.

## 7. Overheating
RAC: pull over safely, hazards, engine off, wait 30+ min, never remove the cap hot, don't pour cold water on a hot engine. AAA: AC off & heater full hot as a temporary measure, pull over. Causes: low coolant/leak, thermostat, water pump, radiator, fan, cap, airlock (natrad), head gasket (milky oil, white sweet smoke, coolant loss – RAC).

## 8. Oil
Check on level ground, 5–10 min after switching off (AA, RAC); gap min–max ≈ 1 L. Milky oil = possible coolant contamination. Overfilling is harmful (AA) – drain to correct level. SAE J300: "W" = winter cold-cranking/pumping; second number = viscosity at 100 °C (30: 9.3–12.5 cSt; 40: 12.5–16.3 cSt). 5W-30 vs 5W-40: same cold class, 40 thicker when hot. ACEA: A3/B4 high SAPS; C2/C3 mid-SAPS, DPF compatible; API SP (2020). OEM approvals: VW 504 00/507 00, MB 229.51/229.52, BMW LL-04. **Approval in the handbook matters more than viscosity alone.** Oil consumption: example VW TSB "up to 0.5 L per 1000 km" – check own handbook.

## 9. Battery & electrical
~12.6 V resting, ~13–14.5 V running (AAA). Capacity falls strongly in cold (VARTA); batteries a leading cause of winter breakdowns (AA); life ~3–5 years. Parasitic drain typically < 50 mA after modules sleep (Identifix). Alternator symptoms: battery light, dim/flickering lights, stalling after a jump (AAA, RAC). Jump-start sequence (RAC): red + dead, red + donor, black − donor, black to earth point on dead car; remove in reverse.

## 10. Brakes
Fluid is hygroscopic; most manufacturers: change every 2 years (Haynes); Bosch: DOT 4 every 2 years / 40,000 km. Squeal: wear indicator, morning rust, glazing; grinding: worn-through pads – unsafe (CR); pulsation: disc thickness variation (Alcon); pulling: sticking caliper; spongy pedal: air / fluid.

## 11. Tyres – Bulgaria
Min tread 1.6 mm. **Bulgaria, 15 Nov – 1 Mar: tyres intended for winter conditions OR tread ≥ 4 mm (ЗДвП чл. 139(4))**. Studded tyres banned. DOT date: last 4 digits = week/year. Michelin: inspect after 5 years, replace by 10 years. Load index / speed letter (T 190, H 210, V 240, Y 300 km/h). Pressure: door/fuel-flap sticker, check cold. TPMS direct vs indirect.

## 12. Bulgaria admin
ГТП (technical inspection) for cars: 3rd and 5th year after first registration, then annually (pravatami.bg, updated Feb 2026). Mandatory "Гражданска отговорност" insurance. E-vignette via bgtoll.bg.

## 13. How Bulgarian drivers describe problems (for search)
- Titles: model + engine code + symptom + condition: "Golf 4 1.9 TDI тресе като загрее".
- Slang: чека, масльонката, спиралката, бобини, дюзи, дебитомер, турбото, ЕГР, ДПФ, каре, биалетки, носач, рейка, печката, казанчето, перката, двумасовик.
- Conditions: на студено / като загрее / на празен ход / при газ / на завой / на дупки / при спиране / при скорост.
- Urgency phrasing: "мога ли да карам така?", "опасно ли е?", "ще стигна ли до…".
- Mixed scripts & misspellings: check-a, chek, DPF/ДПФ, луфт/люфт, авариен/аварийен, бубини.
- LPG is a big topic: "не превключва на газ", "прекъсва на газ", "връща на бензин", "гасне на газ".
- Winter: "не пали сутрин на студено", "замръзна нафтата", "сяда акумулатора".
