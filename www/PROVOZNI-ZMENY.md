# Provozní změny

Aktuální informace se upravují pouze v souboru `data/provozni-zmeny.json`.
Není třeba měnit `index.html` ani `app.js`.

Každá změna má tento tvar:

```json
{
  "date": "2026-08-15",
  "until": "2026-08-15",
  "type": "closed",
  "text": "Sobota: mimořádně zavřeno."
}
```

- `date` je datum, které se na webu zobrazí (formát `RRRR-MM-DD`).
- `until` je poslední den platnosti. Po tomto dni se zpráva sama přestane zobrazovat.
- `type` může být `info` (běžná změna) nebo `closed` (u zprávy se zobrazí štítek „Zavřeno“).
- `text` je vlastní sdělení pro návštěvníky.

Změny jsou v souboru oddělené čárkou. Poslední položka čárku nemá. Pro smazání stačí odstranit celou položku včetně případné čárky před ní.
