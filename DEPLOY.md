# TradeLab – Deploy (GitHub Pages)

* Live: https://vielleicht420.github.io/tradelab/
* Repo: https://github.com/vielleicht420/tradelab (öffentlich, Branch `main`, Ordner `/`)
* Quelle der Wahrheit: `/workspace/trading-app` (Box). `app.js` wird mit `/workspace/tools/build5.py` gebaut – nie direkt editieren.
* Die alte deed.page-Seite (https://tradelab-tim-7k3.deed.page/) bleibt unverändert stehen, bekommt aber keine Updates mehr.

## Update veröffentlichen

1. Änderungen in den Quellen machen, dann `cd /workspace/tools && python3 build5.py`.
2. In `sw.js` die Cache-Version hochzählen (`const V="tradelab-vNN"`), sonst sehen installierte Apps die Änderung erst spät.
3. Deploy-Kopie synchronisieren und pushen:

```bash
cd /workspace/tradelab-deploy
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -a /workspace/trading-app/. .
git add -A && git commit -m "Update: <kurz beschreiben>" && git push origin main
```

4. GitHub Pages baut automatisch (1–2 Min.). Status: `gh api repos/vielleicht420/tradelab/pages/builds/latest --jq .status` → `built`.
5. Prüfen: `curl -s https://vielleicht420.github.io/tradelab/sw.js | head -c 40` zeigt die neue Version.

## Regeln

* Alle Pfade relativ (`sw.js`, `manifest.json`, `icons/…`, `fonts/…`) – die Seite läuft unter dem Unterpfad `/tradelab/`.
* `.nojekyll` muss im Repo bleiben.
* Keine Schlüssel/Tokens ins Repo: Der KI-API-Schlüssel liegt nur im `localStorage` des Geräts.
