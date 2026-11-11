# TradeLab – Design-System v6b „Ink & Amber“ + Trainingsmodus „Night Training“

Zwei Welten in einer App:

* **Hauptapp „Ink & Amber“:** warmes Dunkel, Serif-Headlines, große Zahlen, randlose Charts.
* **Trainingsmodus „Night Training“:** dunkel (Tinte/Navy), verspielt, Duolingo-artig. Für Karteikarten und den Lernpfad.

Der Wechsel zwischen beiden ist ein Kreis-Morph vom Tippunkt aus.

## 1. Hauptapp – Tokens

| Token | Wert | Verwendung |
|---|---|---|
| `--bg` | `#0f0e0c` | Grund (warmes Schwarz, nie #000) |
| `--s1` / `--s2` / `--s3` | `#1a1916` / `#24221e` / `#302d28` | Kacheln, Felder, Spuren |
| `--well` | `#0b0a09` | Chart-Hintergrund |
| `--hair` / `--line` | `rgba(255,236,208,.075/.09)` | Kanten, Trennlinien |
| `--t1` / `--t2` / `--t3` | `#f6f0e6` / `#a59e91` / `#6b655b` | Text |
| `--acc`, `--acc2`, `--acc-ink`, `--acc-t`, `--acc-l` | Standard Amber `#f2b448` | **Akzent – umschaltbar** |
| `--up` / `--dn` | `#6fd3a0` / `#ff7f66` | Steigend/fallend. **Bleibt fest**, unabhängig vom Akzent |
| Trade-Plan | Einstieg `#6e9bff`, Stop `#ff7f66`, Ziel `#6fd3a0` | Feste Semantik |

### Akzentfarben

Einstellbar unter Einstellungen → Akzentfarbe. Gespeichert in `localStorage` unter `tl_accent`. `applyAccent()` setzt die CSS-Variablen schon beim Start, bevor gerendert wird.

| ID | Name | Farbe | Tinte darauf |
|---|---|---|---|
| amber | Amber (Standard) | `#F2B448` | `#1D1406` |
| blue | Electric | `#6F95FF` | `#08112E` |
| mint | Mint | `#5FDDB8` | `#04261C` |
| violet | Violett | `#AE93FF` | `#170B33` |
| silver | Silber | `#E7E2D8` | `#141210` |

Coral wurde bewusst weggelassen, weil es mit dem bärischen Rot verwechselbar wäre.

Diese Elemente folgen dem Akzent:

* Buttons, aktive Tab-Pille, Ringe, Fortschrittsbalken, Lektions-Ticks
* Serif-Kursiv-Akzente, Eyebrows, Nummern (01/02 …)
* Hero-Play-Button, Burst-Partikel

### Typografie

Alle Schriften liegen lokal unter `/fonts` und werden offline über den Service Worker gecacht.

* **Instrument Serif:** Headlines `.lt` 44–46 px, Abschnittstitel `.sh h3` 30 px (mit 26-px-Akzentstrich darunter), Musternamen. Ein kursives Akzentwort `<i>` in `--acc` („Dein *Lernpfad*“).
* **Inter:** UI und Fließtext 15–16,5 px.
* **Instrument Serif (Zahlen):** große Display-Zahlen, siehe Abschnitt 2b.
* **Inter Tight:** kleine und mittlere Zahlen, Tabular Nums.
* Eyebrows `.eb`: 11 px, Versalien, +0,12 em.

### Abstände (v6b „mehr Luft“)

| Token | Wert | Verwendung |
|---|---|---|
| `--pad` | 16 px | Seitenrand links/rechts auf allen Screens (vorher 20 px) |
| `--gap` | 10 px | Bento-, Grid- und Karussell-Abstände |
| `--cpad` / `--cpad-l` | 16 / 18 px | Innenabstand Kacheln / große Karten (Hero, Champion, Feature) |
| `--sec` | 56 px | Abstand zwischen Abschnitten (`.sh`, `.bandA`, `.chapter`) |
| `--sh-gap` | 18 px | Abschnittstitel → Inhalt |
| `--top-air` | 22 px | Kopfleiste → erster Inhalt |

* Randlos (`.bleed`): Karussells laufen bis zum Bildschirmrand, das erste Element startet eingerückt (`scroll-padding: var(--pad)`); Detail-Charts und KV-Leisten ebenfalls randlos.
* Muster-Karten im Karussell: `min(232px, 62vw)` breit.
* Abschnittstitel `.sh` fliegen beim Scrollen ein: Titel von links unten mit Fade, danach wächst der Akzentstrich (scaleX, +200 ms), dann der Link (+240 ms). Der Inhalt folgt gestaffelt (55 ms pro Element). Bei `prefers-reduced-motion` sofort sichtbar.

### Layout-Prinzipien

Keine Karten-Suppe: Jeder Screen mischt mindestens zwei dieser Formen.

* Hero-Kachel (Radius 30), Bento-Raster (`.tile.tall/.wide/.acc`), Karussell (`.hscroll.car`)
* Haarlinien-Listen (`.lrow`, `.rrow`, `.src`, `.gl-item`), editoriale Nummernabschnitte (`.art h3 em`)
* Big-Number-Band (`.bandA` und `.ticks`), KV-Leisten (`.kv`, `.metaA`, `.qstats`)
* Zitatblöcke (`.quoteT`)

So sind die einzelnen Screens aufgebaut:

* **Detailseiten** (Kerze/Formation): Chart randlos (`.plan-card.bleed`), darunter Plan-Leiste und KV-Strip (R:R · Rang · Kerzen). Dann die Trade-Plan-Zeilen und die Abschnitte 01–04.
* **Strategien:** Platz 1 als Champion mit 112-px-Score, Platz 2–3 als Duo-Kacheln, Rest als Haarlinien-Rangliste.
* **Timing:** 120-px-Uhr, Session-Timeline, Karussell „Beste Zeiten“, Wochentage als Serif-Liste.

### Tab-Leiste

Die Tab-Leiste ist eine schwebende Pille:

* links/rechts 12 px, Höhe 64 px, Radius 32
* `bottom: var(--tbb)` mit `--tbb: max(10px, calc(var(--sab) - 12px))` – iPhone: 22 px vom physischen Rand, ohne Safe-Area 10 px.
* Kein dunkler Verlauf/Kasten mehr unter der Pille – der Inhalt scrollt sichtbar dahinter.
* iOS-26-Standalone: `innerHeight`/`100%`/`100dvh` sind um den oberen Safe-Bereich zu kurz, nur `100lvh` ist die Bildschirmhöhe. Im Standalone-Modus bekommt `html` deshalb `height: 100lvh` (Klasse `html.sa`, nicht fixed). `body` bleibt dabei `position: fixed; inset: 0` – fließt das Dokument unter die Statusleiste, legt iOS 26 dort seinen Liquid-Glass-„Scroll Edge“-Blur über den Kopf (v16-Fehler). Erkennt das JS nach 1,5 s, dass der Viewport trotzdem kurz bleibt, fällt es auf das normale Layout zurück (`html.sa-short`, Pille 10 px über der Viewport-Kante). Keine JS-Höhenkorrektur von Elementen mehr.
* Diagnosezeile in Einstellungen („TradeLab 6.1“): Anzeige, Bildschirm, Modus (lvh/kurz/normal), html-Höhe, Safe-Area, Abstand der Tab-Leiste.
* Der aktive Tab wächst (flex 2,1), wird akzentfarben und zeigt sein Label.

Ein Verlauf (`#app::after`) lässt den Inhalt weich unter der Pille auslaufen. Seit dem Umzug auf GitHub Pages (v6d) gibt es keinen deed.page-Hinweis und keine Reservierung dafür mehr.

## 2. Trainingsmodus „Night Training“ (`body.train`)

Gilt für die Routen `#/training` (Lernpfad) und `#/karten` (Karteikarten). In v6 dunkel statt weiß, damit der Modus zur App passt – bleibt aber durch Nunito, Chunky-Buttons und Navy-Ton klar als eigener, verspielter Modus erkennbar.

* **Farben:**
  * Grund `#10131a` (Tinte/Navy), Flächen `#181c26` / `#222838`, Rahmen `#2b3245`, Kante unten `#07090d`
  * Text `#eef1f7` / `#a3abbd` / `#6c7489`
  * Blau `#4d7cff` (Kante `#2b4fc4`), Amber `#ffb020` (Kante `#b87400`)
  * Grün `#2fcf7a` (richtig), Rot `#ff5c4d` (falsch) – jeweils mit dunkel getönten Flächen (`rgba(…,.13–.16)`)
  * Kein Violett, kein Weiß als Fläche.
* **Schrift:** Nunito 700–1000 (auch für Zahlen im Training – Serif passt hier nicht zum verspielten Ton).
* **Kopfleiste** `.trt`: dunkel, sticky, 2-px-Trennlinie. Enthält X (Ausgang), Titel oder grünen Fortschrittsbalken, Serie (Flamme amber).
* **Chunky-Buttons `.b3`:** `box-shadow: 0 4px 0` mit dunklerer Kante, beim Drücken 4 px nach unten. Varianten `bl`, `gr`, `rd`, `gh` (dunkle Fläche, blaue Schrift).
* **Lernpfad:** Kapitel-Banner `.ban` (blau = begonnen, grau = später), Knoten `.nd` mit X-Offsets `[0,-62,-88,-62,0,62,88,62]`, aktueller Knoten amber mit Ring und hüpfender START-Blase, Übungsknoten am Kapitelende, schräge Muster-Sticker auf der freien Seite.
* **Karteikarten:** Auswahl (`.op.sel`, blau getönt) → PRÜFEN in `.fbar` → Leiste wird dunkelgrün („Super!“) oder dunkelrot („Leider falsch – Lösung: …“) mit WEITER. Karte dreht sich auf die Rückseite. Charts in Paneelen `#0b0e14`. Modi: Auswahl (2×2), Eintippen (Fuzzy), Richtung. Spaced Repetition, Tagesziel 10, Serie.
* **Morph:** Kreis (`clip-path`) vom Tippunkt, 0,52 s – beim Betreten Navy mit „Trainingsmodus“, beim Verlassen Ink mit „TradeLab“. Bei `prefers-reduced-motion` direkter Wechsel.
* **Ausgang:** X kehrt zur Herkunftsseite zurück (`trainRet`), sonst zu Lernen.

## 2b. Große Zahlen in Instrument Serif (v6)

Große Display-Zahlen nutzen die Serif (Instrument Serif 400), das „%“ bzw. „/100“ als kursives Suffix:

| Stelle | Klasse | Größe |
|---|---|---|
| Lernfortschritt „24 %“, „5/21“, Strategie-Score | `.bignum` | 138 / 112 px |
| Ranking Platz 1 „86/100“ | `.champ-n` | 136 px |
| Trefferquote „78 %“ | `.price .v` | 108 px |
| Uhr Timing | `.clockA` | 150 px |
| Rechner-Ergebnis | `.cr-n` | 78 / 52 px |
| Kachel-Zahlen (fällige Karten, Platz 2/3) | `.tile .bn` | 84 / 76 px |
| „Harte Wahrheit“ | `.fact .v` | 62 px |
| Beste Zeiten | `.bt-t` | 40 px |

Kleine Zahlen bleiben Inter/Inter Tight mit Tabular Nums (KV-Leisten, Ranglisten-Scores, Ring-Mitte, Session-Zeiten). Im Training bleibt Nunito.

Instrument Serif hat keine Tabellenziffern. Damit Hochzählen nicht springt, fixiert `cuLock()` vor der Animation die Endbreite (min/max-width) des Zahlen-Elements; nach dem Ende wird sie wieder freigegeben. Das Suffix bleibt dadurch pixelgenau stehen.

## 2c. Bewegungs-Sperre (v6)

* `html, body` sind `position: fixed` mit `overflow: hidden` und `overscroll-behavior: none` – kein Gummiband der ganzen Seite in der iOS-PWA.
* Nur `.view` scrollt (vertikal, `overscroll-behavior: none`, `overflow-x: hidden`, `touch-action: pan-y`).
* Querscroller (`.hscroll`, `.filters`, `.tablewrap`, `.layer-row`) scrollen nur quer: `overflow-y: hidden`, `overscroll-behavior-x: contain`.
* Kopf, Tab-Leiste, Prüfen-Leiste, Morph, Toast: `touch-action: none`; zusätzlich verhindert ein `touchmove`-Wächter jede Ziehbewegung außerhalb echter Scrollflächen.
* Global `touch-action: manipulation` (kein Doppeltipp-Zoom), `gesturestart` wird verhindert (kein Pinch), keine Callouts, keine Textauswahl, kein Bild/SVG-Ziehen.
* Testskript `tools/move6.js`: prüft auf 390 und 375 px jede Route auf horizontalen Überlauf und ungewollte Scrollcontainer und simuliert Wischgesten.

## 3. Motion (aus v4 übernommen)

* Scroll-Reveal: Jedes Element mit Klasse `.r` (und `.card`) blendet beim Eintritt per IntersectionObserver ein, mit 55 ms Stagger.
* Zahlen zählen hoch (`data-count`), Balken und Ringe füllen sich.
* Charts bauen sich auf (`.pat-svg.go`: Kerzen wachsen, Linien zeichnen sich).
* Trade-Plan-Levels zeichnen sich beim Antippen ein. Lektions-Ticks wachsen gestaffelt.
* Karten fliegen ein und drehen sich. Die Prüfen-Leiste springt hoch.
* Nur `transform` und `opacity` (plus `clip-path` beim Morph).
* `prefers-reduced-motion` schaltet alle Animationen ab.

## 4. Regeln

* Bull/Bear-Farben sind Semantik und nie Akzent.
* Keine Regenbogen-Verläufe, kein Emoji-Spam, kein schweres Glas.
* App-Texte auf Deutsch, Du-Form.
* Kein API-Schlüssel im Code. Der Schlüssel liegt nur im `localStorage` des Geräts.
* Service-Worker-Cache: `tradelab-v19`.

## 5. Sticky-Elemente und Tab-Zuordnung (v6b)

* `.view` hat **kein** `padding-top` mehr; der Abstand unter der Kopfleiste kommt aus `.view::before`. Grund: Browser rechnen `position: sticky` innerhalb eines Scrollcontainers ab dessen Inhaltskante – mit Padding hing die Glossar-Suche mitten im Inhalt.
* Glossar-Suche `.sbar`: sticky direkt unter der Kopfleiste (`top: calc(var(--sat) + var(--nav))`), volle Breite, feste `--bg`-Fläche, weicher Verlauf darunter, Haarlinie sobald angeheftet (`.stuck`). Buchstaben (C, D …) scrollen normal.
* Weitere Sticky-Elemente: nur im Training (`.trt` oben, Kapitel-Banner `.ban` darunter) – geprüft, korrekt.
* Tab-Zuordnung von Unterseiten: Lexikon, Muster, Formationen, Lektionen, Glossar, Training → **Lernen**; Strategie-Details, Quellen → **Strategien**; Rechner → **Timing**; Einstellungen → Tab, von dem man kam (Standard Start).

## 6. Keine Unschärfe (v6c)

* Kopfleiste inkl. Statusleisten-Bereich: immer massiv `--bg`, **kein** `backdrop-filter`, kein Verlauf. Inhalt verschwindet sauber darunter; beim Scrollen erscheint eine klare Haarlinie (`rgba(255,236,208,.12)`).
* Zurück-/Zahnrad-Buttons: massive Fläche `--s2`.
* Tab-Leiste: massiv `#24221e`, ohne Blur.
* Glossar-Suche: massive Fläche mit Haarlinie, kein Verlauf.
* Training-Kopf `.trt`: massiv `--tbg` mit 2-px-Linie.
* Regel: Blur/Glas wird in der App nirgends verwendet.

## 7. Hosting

GitHub Pages: https://vielleicht420.github.io/tradelab/ – siehe `DEPLOY.md`.

## 8. App-Icon (v2 „Ink & Amber“)

* Drei aufsteigende Kerzen in Amber (`#ffcb6b` → `#e9a636`): zwei als Kontur, die letzte gefüllt. Grund warmes Tinten-Schwarz mit leichter radialer Tiefe (`#211d17` → `#0c0b09`). Kein Glas, kein Regenbogen.
* Quelle: `icons/icon-v2.svg` (auch Favicon). PNGs: `apple-touch-icon-v2.png` 180 (randlos, ohne Transparenz), `icon-192-v2.png`, `icon-512-v2.png`, `icon-maskable-512-v2.png` (Motiv auf 76 % für die Safe-Zone), `favicon-32-v2.png`.
* Dateinamen mit Versions-Suffix, damit iOS kein altes Icon aus dem Cache nimmt. Bei einem neuen Icon `-v3` usw. verwenden.

## 9. KI-Chart-Analyse (Google Gemini, v6f)

* Anbieter: nur Google Gemini (kostenloser Schlüssel aus https://aistudio.google.com/apikey). xAI/OpenAI wurden entfernt.
* Endpoint: `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`, Header `x-goog-api-key`. Bild als `inline_data` (JPEG, max. 1600 px, base64), Prompt als `system_instruction`, `responseMimeType: application/json`.
* Modelle: Standard `gemini-3.8-flash`; bei 429/404/5xx automatischer Wechsel auf `gemini-3.5-flash-lite` (höheres Gratis-Tageslimit). `gemini-2.5-flash` ist abgekündigt (Abschaltung 1.12.2026) und für neue Projekte nicht mehr verfügbar.
* Schlüssel nur in `localStorage` (`tl_ai`). Fehlertexte auf Deutsch: ungültiger Schlüssel, Limit erreicht (Reset 9 Uhr deutscher Zeit), keine Berechtigung, Modell nicht gefunden, Region, Überlastung, Blockiert.

## 10. Fixe Leisten (v6h)

* `.view` hat in Ruhe **kein** `will-change`/`transform`. Sonst wird die Ansicht zum Containing Block für `position: fixed`, und die Prüfen-/„LOS GEHT'S“-Leiste (`.fbar`) scrollt mit dem Inhalt mit (v16-Fehler: Leiste mitten im Bild).
* `.fbar`: unten bündig, kompakt (`padding: 10px 16px var(--tbb)`) – der Button sitzt auf derselben Höhe wie die Tab-Leiste, inkl. „kurz“-Fallback. Feedback-Varianten (`.ok`/`.no`) oben 14 px.
* Training-Inhalt endet über der Leiste (`padding-bottom: calc(var(--tbb) + 120px)`), Toasts im Training bei `var(--tbb) + 92px`.

## 11. Statusleiste (v6i)

* `apple-mobile-web-app-status-bar-style` = **`black`** (nicht `black-translucent`). Die Web-Ansicht beginnt unter einer opaken schwarzen Statusleiste; iOS 26 legt dort keinen Liquid-Glass-„Scroll Edge“-Blur mehr über Kopf/Titel/Zahnrad. iOS übernimmt das nur bei einer **neuen** Home-Bildschirm-Installation.
* `--sat` ist damit 0. Die 100lvh-Korrektur (`html.sa`) greift nur noch, wenn die App noch mit `black-translucent` installiert ist (`--sat` > 0); sonst normales Layout. „kurz“-Fallback bleibt.
* Kopf in Ruhe ohne Transform/Filter/Schatten; Titel blendet nur per Opacity ein; Zurück/Zahnrad massiv `#24221e` mit Rand `#34312b`; Haarlinie `#2a2722` beim Scrollen.


## 12. Sticky-Chart & Scrollytelling (v19)
- Muster- und Formationsseiten: `.plan-card[data-kind]` ist `position:sticky` direkt unter dem Kopf (`top: var(--sat)+var(--nav)`), opak (`--well`), Haarlinie unten, kein Blur. SVG max. `min(290px,31vh)` → ca. 250 px auf 390×844, 225 px auf 375×667.
- `stickyStory(v)` (v5_views.js): Marker `[data-st]` (plan, pat, where, confirm, mistake bzw. what, note). Aktiv ist der letzte Marker oberhalb Panel-Unterkante + min(130px, 30 % Restfläche); am Seitenende der letzte sichtbare. Setzt `svg[data-focus]`, Caption-Pill `.pc-cap`, `h3.st-on`.
- Ebenen (story_patch.py): `.k.ctx/.pat/.fol`, `.f-box`, `.f-hl`, `.zn`, `.trd`, `.fla`, `.ann` (O/H/L/C), `.gh` (Geister-Kerze), `.mis`; Formationen `.lv`, `.pth`, `.brk`, `.brk-r`. Nur Opacity/Transform-Übergänge; reduced-motion schaltet sie ab.
- Trade-Plan: Beim Erreichen des Plan-Abschnitts werden Entry/Stop/Ziel automatisch eingeblendet (falls nicht manuell bedient), beim Verlassen wieder aus. Kein Auto-Scroll mehr beim Tippen einer Plan-Zeile, weil der Chart sichtbar bleibt.
- Strategie-Seiten haben keinen Chart → unverändert.
