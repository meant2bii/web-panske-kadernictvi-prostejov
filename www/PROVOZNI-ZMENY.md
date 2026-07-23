# Provozní změny

Aktuální informace se upravují pouze v souboru `data/provozni-zmeny.json`.
Není třeba měnit `index.html` ani `app.js`.

Každá změna má tento tvar:

```json
{
  "from": "2026-08-15",
  "date": "2026-08-15",
  "until": "2026-08-17",
  "title": "Změna otevírací doby",
  "type": "closed",
  "hours": "Zavřeno",
  "text": "Sobota: mimořádně zavřeno."
}
```

- `from` je první den období a `until` poslední den platnosti (formát `RRRR-MM-DD`). Po posledním dni se zpráva sama přestane zobrazovat.
- `date` ponechte shodné s `from`; používá se ve výpisu provozních změn.
- `title` určuje nadpis upozornění v úvodní části webu.
- `type` může být `info` (běžná změna) nebo `closed` (u zprávy se zobrazí štítek „Zavřeno“).
- `hours` je otevírací doba, která se v úvodní části zobrazí pod danou změnou.
- `text` je vlastní sdělení pro návštěvníky.

Změny jsou v souboru oddělené čárkou. Poslední položka čárku nemá. Pro smazání stačí odstranit celou položku včetně případné čárky před ní.
