import type { Source } from './types'

/**
 * Central registry of verified sources. Content modules reference these by id.
 * Every URL here was fetched during research (Oct 2026).
 */
export const SOURCES: Source[] = [
  // ---- AA ----
  { id: 'aa-lights', publisher: 'AA', title: 'Dashboard warning lights explained', url: 'https://www.theaa.com/breakdown-cover/advice/dashboard-warning-lights' },
  { id: 'aa-eml', publisher: 'AA', title: 'Engine management light', url: 'https://www.theaa.com/breakdown-cover/advice/engine-management-light' },
  { id: 'aa-dpf', publisher: 'AA', title: 'Diesel particulate filters', url: 'https://www.theaa.com/driving-advice/fuels-environment/diesel-particulate-filters' },
  { id: 'aa-adblue', publisher: 'AA', title: 'AdBlue explained', url: 'https://www.theaa.com/breakdown-cover/advice/adblue' },
  { id: 'aa-petrol-smell', publisher: 'AA', title: 'Car smells of petrol', url: 'https://www.theaa.com/breakdown-cover/advice/car-smells-of-petrol' },
  { id: 'aa-coolant', publisher: 'AA', title: 'How to check your engine coolant', url: 'https://www.theaa.com/breakdown-cover/advice/how-to-check-your-engine-coolant' },
  { id: 'aa-oil-check', publisher: 'AA', title: 'How to check and top up your oil', url: 'https://www.theaa.com/breakdown-cover/advice/how-to-check-and-top-up-your-oil' },
  { id: 'aa-oil-overfill', publisher: 'AA', title: 'Overfilled engine oil', url: 'https://www.theaa.com/cars/advice/guides/oil-light-overfilled' },
  { id: 'aa-winter', publisher: 'AA', title: 'Common winter breakdown causes', url: 'https://www.theaa.com/breakdown-cover/advice/winter-breakdown-causes' },
  { id: 'aa-cold', publisher: 'AA', title: 'How cold weather affects your car', url: 'https://www.theaa.com/cars/advice/guides/how-cold-weather-affects-your-car-' },
  { id: 'aa-cambelt', publisher: 'AA', title: 'Cam belts', url: 'https://www.theaa.com/driving-advice/service-repair/cam-belts' },
  { id: 'aa-rattle', publisher: 'AA', title: 'Engine rattling noise', url: 'https://www.theaa.com/breakdown-cover/advice/engine-rattling-noise' },

  // ---- RAC ----
  { id: 'rac-lights', publisher: 'RAC', title: 'Car dashboard warning lights and what they mean', url: 'https://www.rac.co.uk/drive/advice/know-how/car-dashboard-warning-lights-meaning/' },
  { id: 'rac-oil-light', publisher: 'RAC', title: 'Oil warning light – causes and solutions', url: 'https://www.rac.co.uk/drive/advice/car-maintenance/oil-warning-light-causes-and-solutions/' },
  { id: 'rac-overheating', publisher: 'RAC', title: 'Car overheating – causes and what to do', url: 'https://www.rac.co.uk/drive/advice/car-maintenance/car-overheating/' },
  { id: 'rac-eml', publisher: 'RAC', title: 'Reasons your engine management light is on', url: 'https://www.rac.co.uk/drive/advice/know-how/reasons-your-engine-management-light-is-on/' },
  { id: 'rac-vw', publisher: 'RAC', title: 'Volkswagen dashboard warning lights', url: 'https://www.rac.co.uk/drive/advice/know-how/volkswagen-dashboard-warning-lights-what-they-mean/' },
  { id: 'rac-toyota', publisher: 'RAC', title: 'Toyota dashboard warning lights', url: 'https://www.rac.co.uk/drive/advice/know-how/toyota-dashboard-warning-lights-what-they-mean/' },
  { id: 'rac-ford', publisher: 'RAC', title: 'Ford warning lights', url: 'https://www.rac.co.uk/drive/advice/know-how/ford-warning-lights-what-they-mean-and-what-do-you-need-to-do/' },
  { id: 'rac-bmw', publisher: 'RAC', title: 'BMW warning lights', url: 'https://www.rac.co.uk/drive/advice/know-how/bmw-warning-lights-what-they-mean-and-what-do-you-need-to-do/' },
  { id: 'rac-smoke', publisher: 'RAC', title: 'Engine smoking – why it is happening and what to do', url: 'https://www.rac.co.uk/drive/advice/know-how/engine-smoking-why-its-happening-and-what-to-do/' },
  { id: 'rac-head-gasket', publisher: 'RAC', title: 'Head gasket guide', url: 'https://www.rac.co.uk/drive/advice/car-maintenance/head-gasket-guide-why-does-it-fail-and-how-can-i-tell/' },
  { id: 'rac-smells', publisher: 'RAC', title: 'Car smells guide – causes and solutions', url: 'https://www.rac.co.uk/drive/advice/car-maintenance/car-smells-guide-causes-and-solutions/' },
  { id: 'rac-leaks', publisher: 'RAC', title: 'Car leaking – how to identify the liquid', url: 'https://www.rac.co.uk/drive/advice/know-how/car-leaking-how-to-identify-liquid-dripping-from-your-car-and-what-to-do/' },
  { id: 'rac-oil-check', publisher: 'RAC', title: 'How to check your oil', url: 'https://www.rac.co.uk/drive/advice/how-to/how-to-check-your-oil/' },
  { id: 'rac-checks', publisher: 'RAC', title: 'Regular car checks (FORCES)', url: 'https://www.rac.co.uk/drive/advice/know-how/regular-car-checks/' },
  { id: 'rac-alternator', publisher: 'RAC', title: 'Signs of a faulty alternator', url: 'https://www.rac.co.uk/drive/advice/car-maintenance/signs-of-a-faulty-alternator-all-you-need-to-know/' },
  { id: 'rac-jump', publisher: 'RAC', title: 'How to jump start a car', url: 'https://www.rac.co.uk/drive/advice/car-maintenance/how-to-jump-start-a-car/' },
  { id: 'rac-brakes', publisher: 'RAC', title: 'Squeaky brakes – causes and solutions', url: 'https://www.rac.co.uk/drive/advice/car-maintenance/squeaky-brakes-causes-and-solutions/' },
  { id: 'rac-noises', publisher: 'RAC', title: 'Guide to unusual vehicle noises', url: 'https://www.rac.co.uk/drive/advice/know-how/guide-to-unusual-vehicle-noises/' },
  { id: 'rac-suspension', publisher: 'RAC', title: 'Common car suspension problems', url: 'https://www.rac.co.uk/drive/advice/car-maintenance/common-car-suspension-problems-your-complete-guide1/' },

  // ---- AAA ----
  { id: 'aaa-alternator', publisher: 'AAA', title: 'Bad alternator vs bad battery', url: 'https://www.aaa.com/autorepair/articles/bad-alternator-vs-bad-battery' },
  { id: 'aaa-overheating', publisher: 'AAA', title: 'Tips for an overheating car', url: 'https://info.oregon.aaa.com/tips-for-an-overheating-car/' },

  // ---- Consumer Reports ----
  { id: 'cr-cel', publisher: 'Consumer Reports', title: 'What does the check engine light mean?', url: 'https://www.consumerreports.org/cars/car-repair-maintenance/what-does-check-engine-light-mean-a2041364753/' },
  { id: 'cr-lights', publisher: 'Consumer Reports', title: 'What the dashboard warning lights mean', url: 'https://www.consumerreports.org/cars/car-maintenance/what-the-dashboard-warning-lights-mean-in-your-car-a1337083802/' },
  { id: 'cr-noises', publisher: 'Consumer Reports', title: 'What your car is telling you when it whines, creaks or squeals', url: 'https://www.consumerreports.org/media-room/press-releases/2010/02/what-your-car-is-telling-you-when-it-whines-creaks-or-squeals/' },

  // ---- NHTSA / regulators ----
  { id: 'nhtsa-tires', publisher: 'NHTSA', title: 'Tires – vehicle safety', url: 'https://www.nhtsa.gov/vehicle-safety/tires' },
  { id: 'fmvss-138', publisher: 'US eCFR / NHTSA', title: 'FMVSS No. 138 – Tire pressure monitoring systems', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-571/subpart-B/section-571.138' },
  { id: 'nhtsa-vw-oil-tsb', publisher: 'NHTSA (VW TSB)', title: 'VW technical service bulletin – engine oil consumption', url: 'https://static.nhtsa.gov/odi/tsbs/2018/MC-10161473-9999.pdf' },
  { id: 'carb-obd', publisher: 'California Air Resources Board', title: 'On-Board Diagnostic II (OBD II) systems fact sheet', url: 'https://ww2.arb.ca.gov/resources/fact-sheets/board-diagnostic-ii-obd-ii-systems-fact-sheet' },
  { id: 'bar-obd', publisher: 'California Bureau of Automotive Repair', title: 'OBD test reference', url: 'https://www.bar.ca.gov/obd-test-reference' },
  { id: 'ohio-epa-obd', publisher: 'Ohio EPA', title: 'E-Check – OBD and readiness monitors', url: 'https://epa.ohio.gov/divisions-and-offices/air-pollution-control/e-check/06-obd' },
  { id: 'wiki-obd', publisher: 'Wikipedia', title: 'On-board diagnostics (EOBD dates, J1962, J2012)', url: 'https://en.wikipedia.org/wiki/On-board_diagnostics' },

  // ---- Manufacturers ----
  { id: 'vw-dpf', publisher: 'Volkswagen UK', title: 'Warning light – diesel particulate filter', url: 'https://www.volkswagen.co.uk/en/owners-and-services/my-car/warning-light/diesel-particulate-filter.html' },
  { id: 'vw-mil', publisher: 'Volkswagen UK', title: 'Warning light – emission control', url: 'https://www.volkswagen.co.uk/en/owners-and-services/my-car/warning-light/emission-control.html' },
  { id: 'vw-esp', publisher: 'Volkswagen UK', title: 'Warning light – electronic stability programme', url: 'https://www.volkswagen.co.uk/en/owners-and-services/my-car/warning-light/electronic-stability-programme.html' },
  { id: 'vw-frost', publisher: 'Volkswagen UK', title: 'Warning light – outside temperature below +4 °C', url: 'https://www.volkswagen.co.uk/en/owners-and-services/my-car/warning-light/electric-outside-temperature-colder-than--4c--39f.html' },
  { id: 'vw-epb', publisher: 'Volkswagen UK', title: 'Warning light – electronic parking brake fault', url: 'https://www.volkswagen.co.uk/en/owners-and-services/my-car/warning-light/electric-electronic-parking-brake-fault.html' },
  { id: 'vw-ev', publisher: 'Volkswagen UK', title: 'Warning light – fault in electric drive system', url: 'https://www.volkswagen.co.uk/en/owners-and-services/my-car/warning-light/electric-fault-in-electric-drive-system.html' },
  { id: 'kia-lights', publisher: 'Kia Owner’s Manual', title: 'Warning and indicator lights', url: 'https://ownersmanual.kia.com/docview/webhelp/doc/e3c7a752-0202-4e76-868c-a0123fb176dc/topics/chapter5_16_1.html' },
  { id: 'kia-ev', publisher: 'Kia Owner’s Manual (EV)', title: 'EV warning lights – READY, power down, regenerative braking', url: 'https://ownersmanual.kia.com/docview/webhelp/Kia/eb4f9a9a-a9a9-47b7-9e8f-ab976a670538/topics/t00070.html' },
  { id: 'kia-hybrid', publisher: 'Kia Owner’s Manual (Hybrid)', title: 'Hybrid warning lights', url: 'https://ownersmanual.kia.com/docview/webhelp/Kia/f341457d-e95b-4f5d-82bd-c150e85833d7/topics/t00040.html' },
  { id: 'kia-water-fuel', publisher: 'Kia Owner’s Manual', title: 'Water in fuel filter warning', url: 'https://www.kia.com/content/dam/kia2/in/en/content/seltos-manual/topics/chapter8_13_1.html' },

  // ---- Haynes / technical ----
  { id: 'haynes-p0300', publisher: 'Haynes', title: 'How to fix fault code P0300', url: 'https://uk.haynes.com/blogs/tips-tutorials/how-to-fix-fault-code-p0300' },
  { id: 'haynes-brake-fluid', publisher: 'Haynes', title: 'Brake fluid change – how much and how often', url: 'https://uk.haynes.com/blogs/tips-tutorials/brake-fluid-change-how-much-and-how-often' },
  { id: 'haynes-brake-fluid-why', publisher: 'Haynes', title: 'Why brake fluid needs to be changed regularly', url: 'https://haynes.com/en-gb/tips-tutorials/why-brake-fluid-needs-be-changed-regularly' },
  { id: 'bosch-brake-fluid', publisher: 'Bosch', title: 'Bosch brake fluids – brochure', url: 'https://www.boschaftermarket.com/xrm/media/images/services/news_3/23_2_bosch_brakes/bc_brochure_brake_fluids_en.pdf' },
  { id: 'ngk-faq', publisher: 'NGK', title: 'NGK spark plug FAQ', url: 'https://ngk.com.au/ngk/faq/' },
  { id: 'varta-temp', publisher: 'VARTA', title: 'The temperature’s effect on batteries', url: 'https://www.varta-automotive.com/knowledge/articles/article-details/the-temperature%27s-effect-on-batteries' },
  { id: 'continental-pressure', publisher: 'Continental', title: 'Tyre pressure', url: 'https://www.continental-tyres.co.uk/tyre-knowledge/tyre-pressure/' },
  { id: 'michelin-markings', publisher: 'Michelin', title: 'Tire markings explained', url: 'https://www.michelinman.com/auto/auto-tips-and-advice/tires-101/tire-markings-explained' },
  { id: 'michelin-ratings', publisher: 'Michelin', title: 'Tyre load rating and speed rating', url: 'https://www.michelin.co.uk/auto/advice/tyre-basics/tyre-load-rating-speed-rating' },
  { id: 'acea-2023', publisher: 'ACEA', title: 'ACEA oil sequences 2023 – light-duty engines', url: 'https://www.acea.auto/files/2023_ACEA_oil_sequences_light-duty_engines.pdf' },
  { id: 'api-oil', publisher: 'API', title: 'Engine oil categories', url: 'https://www.api.org/products-and-services/engine-oil/eolcs-categories-and-classifications/oil-categories' },
  { id: 'sae-j300', publisher: 'Wikipedia (SAE J300)', title: 'SAE J300 viscosity grades', url: 'https://en.wikipedia.org/wiki/SAE_J300' },
  { id: 'prestone-coolant', publisher: 'Prestone', title: 'Different coolant types explained', url: 'https://www.prestoneuk.com/blog/different-coolant-types-explained/' },
  { id: 'felpro-leaks', publisher: 'Fel-Pro', title: 'Car leak colour guide', url: 'https://www.felpro.com/gaskets-101/car-leak-color-guide.html' },
  { id: 'alcon-discs', publisher: 'Alcon', title: 'The myth of warped brake discs', url: 'https://alconkits.com/blogs/brake-tech/the-myth-of-warped-brake-discs' },
  { id: 'underhood-misfire', publisher: 'Underhood Service', title: 'Understanding misfire codes & ignition coils', url: 'https://www.underhoodservice.com/understanding-misfire-codes-ignition-coils/' },
  { id: 'tt-wheel-bearing', publisher: 'Tomorrow’s Technician', title: 'Diagnosing and repairing wheel bearing noise', url: 'https://www.tomorrowstechnician.com/diagnosing-and-repairing-wheel-bearing-noise/' },
  { id: 'pt-turbo-smoke', publisher: 'PT Turbo', title: 'Black smoke and turbocharger failure', url: 'https://ptturbo.com/black-smoke-and-turbocharger-failure/' },
  { id: 'autoexpress-smoke', publisher: 'Auto Express', title: 'Car exhaust smoke – what the colours mean', url: 'https://www.autoexpress.co.uk/car-news/102502/car-exhaust-smoke-what-do-the-different-kinds-and-colours-of-smoke-mean' },
  { id: 'autoexpress-tread', publisher: 'Auto Express', title: 'Tyre tread depths explained', url: 'https://www.autoexpress.co.uk/tips-advice/365401/tyre-tread-depths-explained-legal-limit-and-what-it-means-you' },
  { id: 'mayo-co', publisher: 'Mayo Clinic', title: 'Carbon monoxide poisoning – symptoms', url: 'https://www.mayoclinic.org/diseases-conditions/carbon-monoxide/symptoms-causes/syc-20370642' },
  { id: 'autozone-p0171', publisher: 'AutoZone', title: 'P0171 – system too lean (bank 1)', url: 'https://www.autozone.com/diy/diagnostic-trouble-codes/p0171-system-too-lean-bank-1' },
  { id: 'edmunds-p0135', publisher: 'Edmunds', title: 'P0135 – O2 sensor heater circuit', url: 'https://www.edmunds.com/obd-dtc/p0135.html' },
  { id: 'carparts-p0087', publisher: 'CarParts.com', title: 'P0087 – fuel rail pressure too low', url: 'https://www.carparts.com/blog/p0087-code-fuel-rail-system-pressure-too-low/' },
  { id: 'carparts-p2002', publisher: 'CarParts.com', title: 'P2002 – DPF efficiency below threshold', url: 'https://www.carparts.com/blog/p2002-code-diesel-particulate-filter-efficiency-below-threshold-bank-1/' },
  { id: 'carparts-u0100', publisher: 'CarParts.com', title: 'U0100 – lost communication with ECM/PCM', url: 'https://www.carparts.com/blog/u0100-code-lost-communication-with-ecm-pcm-a/' },
  { id: 'carparts-manifold', publisher: 'CarParts.com', title: 'How to tell if your exhaust manifold is leaking', url: 'https://www.carparts.com/blog/how-to-tell-if-your-exhaust-manifold-is-leaking/' },
  { id: 'ziptuning-p20ee', publisher: 'ZIPtuning', title: 'P20EE – SCR NOx catalyst efficiency', url: 'https://www.ziptuning.com/blog/p20ee-scr-nox-catalyst-efficiency-below-threshold/' },
  { id: 'ziptuning-p242f', publisher: 'ZIPtuning', title: 'P242F – DPF ash accumulation', url: 'https://www.ziptuning.com/blog/p242f-diesel-particulate-filter-restriction-ash-accumulation/' },
  { id: 'obdcodes-p0420', publisher: 'OBD-Codes.com', title: 'P0420 – catalyst efficiency below threshold', url: 'https://www.obd-codes.com/p0420' },
  { id: 'natrad-airlock', publisher: 'Natrad', title: 'Car radiator airlock symptoms', url: 'https://natrad.com.au/info-advice/car-radiator-airlock-symptoms/' },
  { id: 'identifix-drain', publisher: 'Identifix', title: 'How to test for parasitic draw', url: 'https://www.identifix.com/blogs/how-to-test-for-parasitic-draw-with-a-multimeter-12-steps/' },
  { id: 'wiki-tpms', publisher: 'Wikipedia', title: 'Tire-pressure monitoring system', url: 'https://en.wikipedia.org/wiki/Tire-pressure_monitoring_system' },
  { id: 'speedway-lifter', publisher: 'Speedway Motors', title: 'Lifter tick vs rod knock', url: 'https://www.speedwaymotors.com/the-toolbox/how-to-diagnose-lifter-tick-vs-rod-knock-troubleshooting-tips/145810' },
  { id: 'apex-chain', publisher: 'Apex Tech Nation', title: 'Diagnosing timing chain noise', url: 'https://apextechnation.com/articles/diagnosing-timing-chain-noise' },
  { id: 'wiki-knock', publisher: 'Wikipedia', title: 'Engine knocking', url: 'https://en.wikipedia.org/wiki/Engine_knocking' },
  { id: 'oilspec-vw', publisher: 'oilspecifications.org', title: 'Volkswagen oil specifications', url: 'https://oilspecifications.org/specifications/volkswagen' },

  // ---- Bulgaria ----
  { id: 'bg-zdvp-139', publisher: 'ЗДвП (globi.bg)', title: 'Закон за движението по пътищата – чл. 139', url: 'https://globi.bg/zdvp/chl-139' },
  { id: 'bg-gtp', publisher: 'pravatami.bg', title: 'Периодичност на годишния технически преглед', url: 'https://www.pravatami.bg/s/21003' },
  { id: 'bg-winter-sofiaglobe', publisher: 'The Sofia Globe', title: 'From November 15, vehicles in Bulgaria must have tyres suitable for winter conditions', url: 'https://sofiaglobe.com/2025/11/14/from-november-15-vehicles-in-bulgaria-must-have-tyres-suitable-for-winter-conditions/' },
  { id: 'bg-vignette', publisher: 'БГ ТОЛ', title: 'Електронна винетка', url: 'https://bgtoll.bg/en/e-vignette' },
  { id: 'bg-tyremap', publisher: 'TyreMap', title: 'Tyre laws – Bulgaria', url: 'https://tyremap.com/tyre-laws/bulgaria/' },
]

export const SOURCE_MAP: Record<string, Source> = Object.fromEntries(SOURCES.map((s) => [s.id, s]))
