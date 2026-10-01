# ЧЕКАП · Chekap

**Разбери какво ти казва колата.**

Чекап е малък, бърз, mobile-first автомобилен справочник на български. Шофьорът описва проблема с
думите си („светна ми масльонката“, „тресе на празен ход“, „пуши бяло“) и за секунди вижда:

- **Какво означава?**
- **Колко сериозно е?** (контекстна спешност: 🔴 Спри веднага · 🟠 Провери скоро · 🟡 Наблюдавай · 🔵 Информация)
- **Мога ли да карам?**
- **Какво да направя сега?**
- **Какви са възможните причини и как да ги различа?**
- **Какво да кажа на механика?**

> Справочник, а не сервиз. Чекап не поставя диагноза – показва възможни причини и следващи стъпки.

🔗 **Live:** https://nikovassi.github.io/chekap/

---

## Какво има вътре

| Раздел | Съдържание |
| --- | --- |
| Smart search | Разбира разговорен български, жаргон („чека“, „масльонка“, „спиралка“, „каре“, „биалетки“), правописни грешки, латиница („trese“, „check-a“) и OBD кодове (включително с кирилско „Р0300“). |
| „Какво прави колата?“ | Интерактивен помощник на началната страница – 10 категории, кратки въпроси, резултат с направления за проверка. |
| Лампи на таблото | 54 символа със собствена SVG визуална система, цветове, контекстна спешност, „мога ли да карам“, различия между производителите. |
| Check Engine | Подробна страница: постоянна vs. мигаща лампа, как работи OBD, код ≠ диагноза. |
| OBD2 кодове | 64 кода с описание, система, причини, симптоми, диагностика, какво да НЕ правиш, свързани кодове. |
| Симптоми | 62 симптома – двигател, охлаждане, масло, гориво/газ, електрика, спирачки, гуми, окачване, скоростна кутия, климатик, светлини. |
| Шумове · Пушек · Миризми · Течове | 26 шума (с филтри „кога“), 10 вида пушек (конденз vs. проблем), 13 миризми, 10 течове с цветови мостри. |
| Системи | 13 наръчника: масло (5W-30 vs 5W-40, ACEA/API/OEM одобрения), прегряване, акумулатор, спирачки, гуми (вкл. българското зимно правило), окачване, трансмисия, климатик, светлини, DPF/EGR/AdBlue, газова уредба. |
| Диагностика | 11 диагностични flow-а (не пали, тресе, прегрява, лампа, шум, пушек, миризма, теч, електрика, гуми, спирачки). |
| Поддръжка | Ежедневни/седмични/месечни/сезонни проверки, преди път, преди зима/лято, смяна на масло. |
| Service checklist | Марка, модел, година, двигател, гориво, трансмисия, км → списък за проверка (с ясно обозначени общи ориентири). |
| Моят гараж | Профил на автомобила, история на обслужването и напомняния (масло, ГТП, Гражданска отговорност, гуми…) в localStorage. |

Всички ~300 страници се **prerender-ват до статичен HTML** (SEO, бързо първо зареждане), с чисти URL
адреси (`/dashboard/oil-pressure`, `/smoke/white-smoke`, `/obd/p0300`, `/noises/engine-ticking`,
`/maintenance/oil-change`, `/no-start`), meta/OG тагове, JSON-LD (FAQ, Breadcrumb), `sitemap.xml` и `robots.txt`.

## Технологии

React 19 · TypeScript · Vite · Tailwind CSS v4 · Lucide Icons · Recharts · React Router.
Без backend – съдържанието е в типизирани TypeScript модули (`src/data`), които се зареждат на
отделни chunks само когато страницата ги изисква.

## Инсталация и разработка

Изисква Node.js 20+ (препоръчително 22).

```bash
git clone https://github.com/nikovassi/chekap.git
cd chekap
npm install
npm run dev          # http://localhost:5173/chekap/
```

| Команда | Какво прави |
| --- | --- |
| `npm run dev` | Генерира индексите и стартира dev сървър |
| `npm run build` | Валидира съдържанието → индекси → typecheck → bundle → SSR bundle → prerender на всички страници в `dist/` |
| `npm run preview` | Сервира `dist/` локално (http://localhost:4173/chekap/) |
| `npm test` | Тестове за качество на търсенето (реални фрази на шофьори → очаквана страница в топ 3) |
| `npm run validate` | Проверява, че всички вътрешни препратки и източници съществуват |
| `npm run qa` | Playwright crawler: всички страници, console грешки, хоризонтален overflow, title/h1/description, счупени линкове (изисква `npm run preview`) |
| `node tests/interactions.mjs` | Playwright тестове на търсене, помощник, OBD търсене, филтри, гараж (localStorage), checklist, меню, 404 |

За друг домейн: `BASE_PATH=/ SITE_URL=https://example.bg npm run build`.

## Deployment

Сайтът е на **GitHub Pages** и се deploy-ва автоматично от GitHub Actions
(`.github/workflows/deploy.yml`) при всеки push в `main`:

1. `npm ci` → тестове на търсенето → `npm run build`
2. `dist/` се качва като Pages artifact и се публикува.

Нов deployment = `git push` в `main` (или ръчно „Run workflow“ в таба Actions).

## Структура на проекта

```
src/
  data/                 съдържание (типизирано)
    types.ts            модел на данните (Topic, WarningLight, ObdCode, Flow, Guide…)
    sources.ts          регистър на проверените източници
    lights.ts           лампи на таблото
    obd.ts              OBD2 кодове
    symptoms-*.ts       симптоми
    noises.ts smoke.ts smells.ts leaks.ts
    guides.ts           наръчници по системи (вкл. Check Engine)
    maintenance.ts      поддръжка + checklist
    flows.ts            диагностични flow-ове
    load.ts             lazy достъп до данните (сменя се с API при backend)
  lib/
    search.ts           smart search (нормализация, транслитерация, жаргон, stemming, fuzzy)
    storage.ts          GarageRepository интерфейс + localStorage адаптер
    head.tsx            SEO (title, meta, canonical, JSON-LD)
  components/           UI (Layout, SearchBox, FlowRunner, LightIcon – SVG символи, …)
  pages/                страници
  entry-client.tsx      hydrate
  entry-server.tsx      prerender
scripts/
  build-index.ts        генерира catalog/search/routes индекси
  validate-content.ts   проверка на препратки и източници
  prerender.mjs         статичен HTML за всеки route + sitemap
tests/                  тестове за търсене, QA crawler, interaction тестове
docs/
  RESEARCH.md           резюме на проучването
  CONTENT_GUIDE.md      правила за писане на съдържание и канонични slugs
```

### Готов за разширяване

- **Backend / database:** `src/data/load.ts` е единственото място, откъдето UI-ят чете съдържание → замени loader-ите с API заявки.
- **User accounts / vehicle profiles / service history:** `GarageRepository` (`src/lib/storage.ts`) – добави REST/Supabase адаптер със същия интерфейс.
- **AI асистент:** търсенето връща структурирани резултати (`SearchHit`), които могат да се подадат като контекст.
- **OBD интеграция:** `ObdCode` модел + `/obd/:code` маршрути са готови за данни от Bluetooth четец.
- **Push известия / mobile app:** има web manifest; напомнянията имат дати и км.

## Източници на данни

Техническото съдържание е базирано на: AA, RAC, AAA, NHTSA (FMVSS 138, TSB), Consumer Reports,
California Air Resources Board, California BAR, Ohio EPA, Haynes, Bosch, NGK, VARTA, Michelin,
Continental, ACEA, API, SAE J300, Prestone, Fel-Pro, Alcon, ръководства на Volkswagen и Kia,
RAC ръководства за VW/Toyota/Ford/BMW, ЗДвП чл. 139 и правила за ГТП в България. Пълен списък –
`src/data/sources.ts` и страницата [/sources](https://nikovassi.github.io/chekap/sources).

Форумите (opelclub.bg, skodaclub.bg, bmwpower-bg.net, forum.vwclub.bg, Reddit и др.) са използвани
**само** за да разберем как шофьорите описват проблемите си (за търсенето) – не като технически
източник и без копиране на мнения. Виж `docs/RESEARCH.md`.

## Принос (contributing)

1. Прочети `docs/CONTENT_GUIDE.md` – езикови правила (без категорични диагнози!), скала за спешност, канонични slugs.
2. Добави/редактирай запис в съответния файл в `src/data/` и посочи източник от `sources.ts` (или добави нов, проверен източник).
3. Добави 10–25 `keywords` – както реалните шофьори пишат.
4. `npm run validate && npm test && npm run build`.
5. Отвори Pull Request с кратко описание и линк към източника.

Грешки и предложения: [Issues](https://github.com/nikovassi/chekap/issues).

## Лиценз

MIT за кода. Съдържанието е обобщение с позоваване на посочените източници; не замества
професионална диагностика.
