/* Lerninhalte – TradeLab */
window.LESSONS = [
/* ================= KAPITEL 1 ================= */
{ch:"1 · Basics", id:"maerkte", ico:"🌍", title:"Was du eigentlich handelst", sub:"Forex, Indizes, Gold, CFDs", min:6, html:`
<p>Bei Pepperstone in MT5 kaufst du keine echten Euros, keine echten Goldbarren und keine echten Aktien. Du handelst <b>CFDs</b> (Contracts for Difference). Das sind Verträge, bei denen du nur auf die <b>Preisdifferenz</b> setzt. Steigt der Kurs und du bist „long“ (gekauft), gewinnst du. Fällt er, verlierst du. Bei „short“ (verkauft) ist es umgekehrt.</p>
<div class="key"><b>Wichtig</b>Du kannst mit CFDs genauso leicht auf fallende wie auf steigende Kurse setzen. Das ist der große Unterschied zum normalen Aktienkauf.</div>
<h3>Die Märkte im Überblick</h3>
<div class="tablewrap"><table class="t"><tr><th>Markt</th><th>Beispiele in MT5</th><th>Charakter</th></tr>
<tr><td><b>Forex Majors</b></td><td>EURUSD, GBPUSD, USDJPY, USDCHF, AUDUSD, USDCAD, NZDUSD</td><td>Günstigste Spreads, sehr liquide, ideal zum Lernen</td></tr>
<tr><td><b>Forex Crosses</b></td><td>EURGBP, EURJPY, GBPJPY, AUDCAD</td><td>Etwas teurer, GBPJPY sehr wild</td></tr>
<tr><td><b>Exoten</b></td><td>USDTRY, USDZAR, AUDHKD</td><td>Hohe Spreads, Sprünge – für Anfänger meiden</td></tr>
<tr><td><b>Indizes</b></td><td>GER40 (DAX), US500 (S&amp;P), NAS100, US30 (Dow)</td><td>Starke Bewegungen zur Börseneröffnung</td></tr>
<tr><td><b>Rohstoffe</b></td><td>XAUUSD (Gold), XAGUSD (Silber), WTI/Brent (Öl)</td><td>Gold reagiert stark auf US-Daten &amp; Zinsen</td></tr>
<tr><td><b>Aktien-CFDs</b></td><td>Apple, Tesla, Nvidia …</td><td>Nur zu Börsenzeiten, Gaps bei Quartalszahlen</td></tr>
<tr><td><b>Krypto-CFDs</b></td><td>BTCUSD, ETHUSD</td><td>Extrem volatil, max. Hebel 2:1 in der EU</td></tr></table></div>
<h3>Wie liest man ein Währungspaar?</h3>
<p><b>EURUSD = 1,1600</b> heißt: 1 Euro kostet 1,16 US-Dollar. Die erste Währung ist die <b>Basiswährung</b>, die zweite die <b>Kurswährung</b>. Kaufst du EURUSD, wettest du darauf, dass der Euro gegenüber dem Dollar stärker wird.</p>
<h3>Bid, Ask &amp; Spread</h3>
<p>In MT5 siehst du immer zwei Preise: <b>Bid</b> (Verkaufen) und <b>Ask</b> (Kaufen). Die Differenz ist der <b>Spread</b> – das ist die Gebühr, die du bei jedem Trade sofort zahlst. Deshalb startet jeder Trade leicht im Minus.</p>
<div class="tip"><b>Für dich als Anfänger</b>Starte mit 1–3 Märkten, z. B. <b>EURUSD</b>, <b>GBPUSD</b> und später <b>XAUUSD</b> oder <b>GER40</b>. Wer alles gleichzeitig beobachtet, lernt keinen Markt richtig kennen.</div>`},

{ch:"1 · Basics", id:"pips-lots", ico:"📏", title:"Pips, Punkte & Lots", sub:"Wie groß ist dein Trade wirklich?", min:7, html:`
<h3>Pip</h3>
<p>Ein <b>Pip</b> ist die übliche kleinste Bewegungseinheit. Bei EURUSD ist das die 4. Nachkommastelle: 1,1600 → 1,1601 = 1 Pip. Bei JPY-Paaren (USDJPY 150,00) ist es die 2. Stelle: 150,00 → 150,01 = 1 Pip. MT5 zeigt oft eine 5. (bzw. 3.) Stelle an – das ist ein <b>Zehntel-Pip</b> („Point“).</p>
<h3>Lot = Positionsgröße</h3>
<div class="tablewrap"><table class="t"><tr><th>Größe</th><th>Einheiten</th><th>Wert pro Pip (EURUSD)</th></tr>
<tr><td>1,00 Lot (Standard)</td><td>100.000</td><td>≈ 10 $</td></tr>
<tr><td>0,10 Lot (Mini)</td><td>10.000</td><td>≈ 1 $</td></tr>
<tr><td>0,01 Lot (Mikro)</td><td>1.000</td><td>≈ 0,10 $</td></tr></table></div>
<p>Beispiel: Du kaufst 0,10 Lot EURUSD, der Kurs steigt 30 Pips → ca. +30 $. Fällt er 30 Pips → ca. –30 $. Dein Konto ist in Euro, daher wird das in € umgerechnet.</p>
<h3>Gold, Indizes &amp; Co.</h3>
<p>Bei <b>XAUUSD</b> ist 1 Lot meist 100 Unzen – bewegt sich Gold um 1 $, sind das bei 1 Lot 100 $ (bei 0,01 Lot = 1 $). Bei Indizes wie GER40 oder NAS100 rechnet man in <b>Punkten</b>. Was ein Punkt pro Lot wert ist, unterscheidet sich je nach Broker.</p>
<div class="key"><b>So prüfst du es in MT5 (iPhone)</b>Kurse → Symbol antippen → <b>Details/Spezifikation</b>. Dort stehen Kontraktgröße, Mindest-Lot, Tick-Größe und Tick-Wert. Vor dem ersten Trade auf einem neuen Markt immer ansehen!</div>
<div class="tip"><b>Rechner nutzen</b>Den Positionsrechner in dieser App findest du unter <b>Start → Rechner</b>. Er sagt dir, wie viele Lots zu deinem Risiko passen.</div>`},

{ch:"1 · Basics", id:"hebel", ico:"⚖️", title:"Hebel, Margin & Margin Call", sub:"Warum Konten so schnell leer sind", min:7, html:`
<p>Mit <b>Hebel</b> bewegst du eine große Position mit wenig eigenem Geld. Bei einem Hebel von 30:1 brauchst du für 30.000 € Positionswert nur 1.000 € als <b>Margin</b> (Sicherheitsleistung).</p>
<div class="warn"><b>Der Hebel wirkt in beide Richtungen</b>1 % Bewegung gegen dich bei 30-fachem Hebel = 30 % deines eingesetzten Geldes weg. Der Hebel macht nicht reich, er macht schnell.</div>
<h3>Was in der EU gilt (ESMA-Regeln für Privatkunden)</h3>
<div class="tablewrap"><table class="t"><tr><th>Markt</th><th>Max. Hebel</th></tr>
<tr><td>Major-Währungspaare</td><td>30:1</td></tr><tr><td>Andere Paare, Gold, große Indizes</td><td>20:1</td></tr>
<tr><td>Andere Rohstoffe, kleinere Indizes</td><td>10:1</td></tr><tr><td>Einzelaktien</td><td>5:1</td></tr><tr><td>Krypto</td><td>2:1</td></tr></table></div>
<p>Dazu kommen: <b>Margin-Close-Out bei 50 %</b> (der Broker schließt Positionen automatisch, wenn dein Konto unter die Hälfte der benötigten Margin fällt) und <b>Negativsaldoschutz</b> (du kannst nicht mehr als dein Konto verlieren).</p>
<h3>Begriffe in MT5</h3>
<ul class="list"><li><b>Kontostand (Balance):</b> Geld ohne offene Trades</li><li><b>Equity (Kapital):</b> Kontostand ± offene Gewinne/Verluste</li><li><b>Margin:</b> aktuell gebundene Sicherheit</li><li><b>Freie Margin:</b> was du noch für neue Trades hast</li><li><b>Margin-Level:</b> Equity ÷ Margin × 100 %. Fällt er auf 50 % → Stop-Out.</li></ul>
<div class="tip"><b>Profi-Gedanke</b>Der Hebel ist nicht dein Risiko. Dein Risiko ist der <b>Abstand zum Stop-Loss × Positionsgröße</b>. Wer immer einen Stop setzt und klein handelt, für den ist der Hebel nur ein Werkzeug.</div>`},

{ch:"1 · Basics", id:"kosten", ico:"💸", title:"Kosten: Spread, Kommission, Swap", sub:"Was dich jeder Trade kostet", min:5, html:`
<ul class="list"><li><b>Spread:</b> Differenz Bid/Ask. Bei EURUSD meist sehr klein, bei Exoten groß. Nachts (ca. 23–1 Uhr) und bei News wird er oft deutlich größer.</li>
<li><b>Kommission:</b> Beim Razor/Raw-Konto zahlst du einen festen Betrag pro Lot, dafür ist der Spread enger. Beim Standardkonto steckt alles im Spread.</li>
<li><b>Swap (Übernachtgebühr):</b> Hältst du einen Trade über den Tageswechsel (ca. 23:00 Uhr deutscher Zeit, wenn es in New York 17:00 ist), wird ein Zins verrechnet – meist eine Gebühr. Bei Forex wird mittwochs oft ein <b>dreifacher Swap</b> berechnet (fürs Wochenende).</li>
<li><b>Slippage:</b> Du bekommst einen schlechteren Preis als geplant, z. B. bei News oder Kurslücken.</li></ul>
<div class="key"><b>Warum das so wichtig ist</b>Je kürzer deine Trades (Scalping), desto größer ist der Anteil der Kosten am Gewinn. Eine Strategie, die ohne Kosten leicht im Plus ist, kann mit Kosten im Minus landen – genau das zeigte z. B. eine unabhängige Nachrechnung der bekannten Opening-Range-Breakout-Studie.</div>`},

{ch:"1 · Basics", id:"ordertypen", ico:"🧾", title:"Ordertypen", sub:"Market, Limit, Stop, SL & TP", min:6, html:`
<div class="tablewrap"><table class="t"><tr><th>Order</th><th>Was passiert</th><th>Wann nutzen</th></tr>
<tr><td><b>Market Buy/Sell</b></td><td>Sofort zum aktuellen Preis</td><td>Wenn dein Signal jetzt da ist</td></tr>
<tr><td><b>Buy Limit</b></td><td>Kaufen, wenn der Preis <b>fällt</b> auf X</td><td>Rücksetzer an Unterstützung kaufen</td></tr>
<tr><td><b>Sell Limit</b></td><td>Verkaufen, wenn der Preis <b>steigt</b> auf X</td><td>An Widerstand shorten</td></tr>
<tr><td><b>Buy Stop</b></td><td>Kaufen, wenn der Preis <b>über</b> X steigt</td><td>Ausbruch nach oben</td></tr>
<tr><td><b>Sell Stop</b></td><td>Verkaufen, wenn der Preis <b>unter</b> X fällt</td><td>Ausbruch nach unten</td></tr>
<tr><td><b>Buy/Sell Stop Limit</b></td><td>Stop-Auslöser, dann Limit-Order</td><td>Ausbruch mit Preisgrenze</td></tr></table></div>
<h3>Stop-Loss (SL) &amp; Take-Profit (TP)</h3>
<p>Der <b>Stop-Loss</b> schließt deinen Trade automatisch bei einem festen Verlust. Der <b>Take-Profit</b> schließt ihn bei deinem Ziel. Setze beide <b>beim Öffnen</b> – nicht „gleich danach“.</p>
<div class="warn"><b>Goldene Regel</b>Kein Trade ohne Stop-Loss. Und den Stop niemals weiter wegschieben, wenn der Kurs gegen dich läuft.</div>
<div class="tip"><b>Trailing Stop?</b>Einen automatisch nachziehenden Stop gibt es in MT5 nur in der Desktop-Version – und er funktioniert nur, solange das Programm läuft. Auf dem iPhone ziehst du den Stop von Hand nach (z. B. auf Einstand, sobald du 1R im Plus bist).</div>`},

{ch:"1 · Basics", id:"mt5", ico:"📱", title:"MT5 auf dem iPhone", sub:"Die App Schritt für Schritt", min:8, html:`
<p>Unten in der MT5-App hast du: <b>Kurse</b>, <b>Chart</b>, <b>Handel</b>, <b>Verlauf</b>, <b>Nachrichten/Einstellungen</b>.</p>
<h3>Symbol hinzufügen</h3><p>Kurse → <b>+</b> oben → Gruppe wählen (z. B. Forex) → Symbol antippen.</p>
<h3>Chart einstellen</h3><ul class="list"><li>Chart öffnen → einmal tippen → Rad-Menü: Zeitrahmen (M1 … MN), Indikatoren (<b>f</b>), Objekte (Linien).</li><li>Zwei Finger auseinander = Zoom im Chart, wischen = zurück in der Zeit.</li><li>Horizontale Linie: Objekte → Horizontale Linie – damit markierst du Unterstützungen &amp; Widerstände.</li></ul>
<h3>Trade eröffnen</h3><ol class="list"><li>Im Chart oder in Kurse auf das Symbol → <b>Handel</b> / „Neue Order“.</li><li>Typ: Sofortausführung (Market) oder Pending (Limit/Stop).</li><li>Volumen in Lots eintragen (Rechner nutzen!).</li><li><b>Stop Loss</b> und <b>Take Profit</b> eintragen.</li><li>Buy oder Sell tippen.</li></ol>
<h3>Trade ändern/schließen</h3><p>Reiter <b>Handel</b> → Position lange gedrückt halten → „Position ändern“ (SL/TP) oder „Position schließen“. Alternativ SL/TP-Linien im Chart ziehen (wenn in den Einstellungen aktiviert).</p>
<div class="key"><b>Zeitzone im Chart</b>Die Uhrzeiten im MT5-Chart sind die <b>Serverzeit des Brokers</b>, nicht deine Ortszeit. Prüfe einmal den Unterschied, indem du die Uhrzeit der letzten Kerze mit deiner Uhr vergleichst.</div>
<div class="tip"><b>One-Click-Trading</b>Lässt du besser aus (Einstellungen → Charts). Ein versehentlicher Tipp = echter Trade.</div>`},

/* ================= KAPITEL 2 ================= */
{ch:"2 · Charts lesen", id:"kerzen-basics", ico:"🕯️", title:"Kerzen verstehen", sub:"Kurzfassung – ausführlich im Kerzen-Lexikon", min:4, link:"#/kerzen", html:`
<p>Jede Kerze zeigt, was in einem Zeitraum passiert ist: <b>Eröffnung, Hoch, Tief, Schluss</b> (OHLC). Grün = Schluss über Eröffnung, Rot = Schluss unter Eröffnung. Der dicke Teil ist der <b>Körper</b>, die dünnen Striche sind die <b>Dochte</b>.</p>
<div class="tip"><b>Mehr dazu</b>Alles über Kerzen inkl. über 30 Mustern mit Zeichnungen, Einstieg/Stop/Ziel, Studienwerten und Quiz findest du im <a href="#/kerzen">Kerzen-Lexikon</a>.</div>`},

{ch:"2 · Charts lesen", id:"timeframes", ico:"⏱️", title:"Zeiteinheiten & Trading-Stile", sub:"M1 bis Monatschart", min:5, html:`
<div class="tablewrap"><table class="t"><tr><th>Stil</th><th>Haltedauer</th><th>Charts</th><th>Für dich?</th></tr>
<tr><td><b>Scalping</b></td><td>Sekunden–Minuten</td><td>M1, M5</td><td><span class="lvl r">Nein</span> Kosten &amp; Stress zu hoch</td></tr>
<tr><td><b>Daytrading</b></td><td>Minuten–Stunden</td><td>M5, M15, H1</td><td><span class="lvl a">Bedingt</span> nur mit fester Zeit am Bildschirm</td></tr>
<tr><td><b>Swingtrading</b></td><td>Tage–Wochen</td><td>H1, H4, D1</td><td><span class="lvl g">Ja</span> ideal neben Job/Schule</td></tr>
<tr><td><b>Position</b></td><td>Wochen–Monate</td><td>D1, W1</td><td><span class="lvl g">Ja</span> ruhig, braucht Geduld</td></tr></table></div>
<h3>Multi-Timeframe-Analyse (Top-down)</h3>
<ol class="list"><li><b>Großer Zeitrahmen</b> (z. B. D1): Wohin geht der Trend? Wo sind große Zonen?</li><li><b>Mittlerer</b> (H4/H1): Wo ist ein gutes Setup in Trendrichtung?</li><li><b>Kleiner</b> (M15): Exaktes Einstiegssignal, enger Stop.</li></ol>
<div class="key"><b>Faustregel</b>Faktor 4–6 zwischen den Zeitrahmen: D1 → H4 → H1 oder H4 → H1 → M15. Handle nie gegen den großen Trend, solange du lernst.</div>
<div class="warn"><b>Rauschen</b>Je kleiner der Zeitrahmen, desto mehr Zufall und desto stärker fressen Spread und Kommission deinen Gewinn.</div>`},

{ch:"2 · Charts lesen", id:"trend-sr", ico:"📈", title:"Trend, Marktstruktur, Support & Resistance", sub:"Das Fundament jeder Strategie", min:9, html:`
<h3>Trend erkennen</h3>
<ul class="list"><li><b>Aufwärtstrend:</b> höhere Hochs (HH) und höhere Tiefs (HL)</li><li><b>Abwärtstrend:</b> tiefere Hochs (LH) und tiefere Tiefs (LL)</li><li><b>Seitwärts (Range):</b> Hochs und Tiefe auf ähnlichem Niveau</li></ul>
<svg viewBox="0 0 320 130" class="pat-svg"><polyline points="10,115 60,70 85,90 140,45 165,62 220,22 245,40 305,8" fill="none" stroke="#34e5a5" stroke-width="3" stroke-linejoin="round"/>
<g fill="#fff" font-size="10" font-weight="700"><text x="54" y="62">HH</text><text x="80" y="104">HL</text><text x="134" y="37">HH</text><text x="160" y="76">HL</text><text x="214" y="15">HH</text><text x="240" y="54">HL</text></g></svg>
<p>Ein einfacher Trendfilter: Liegt der Kurs über dem <b>200er gleitenden Durchschnitt</b> (EMA 200) und dieser steigt → eher nur Longs. Darunter → eher nur Shorts.</p>
<h3>Trendwechsel: Break of Structure</h3>
<p>Ein Aufwärtstrend ist gefährdet, wenn der Kurs das letzte <b>höhere Tief</b> nach unten bricht. Erst dann reden viele Trader von einem möglichen Trendwechsel (SMC-Leute nennen das „CHoCH“ – Change of Character).</p>
<h3>Unterstützung &amp; Widerstand</h3>
<p><b>Support</b> = Preisbereich, an dem der Kurs mehrfach nach oben abgeprallt ist (Käufer). <b>Resistance</b> = Bereich, an dem er mehrfach nach unten gedreht hat (Verkäufer). Zeichne sie als <b>Zonen</b>, nicht als exakte Linien.</p>
<ul class="list"><li>Je öfter getestet und je größer der Zeitrahmen, desto wichtiger.</li><li><b>Rollentausch:</b> Ein gebrochener Widerstand wird oft zur Unterstützung (und umgekehrt).</li><li>Runde Zahlen (1,1500 / 2000 $ bei Gold / 20.000 im DAX) wirken oft wie Magneten.</li><li>Vortageshoch/-tief und Wochenhoch/-tief sind wichtige Marken für Daytrader.</li></ul>
<div class="tip"><b>Übung</b>Nimm EURUSD im H4-Chart und markiere die 3 wichtigsten Zonen der letzten 2 Monate. Wechsel dann auf H1 und beobachte, wie der Kurs dort reagiert.</div>`},

{ch:"2 · Charts lesen", id:"chartmuster", ico:"🔺", title:"Chartformationen", sub:"SKS, Doppel-Top, Dreiecke, Flaggen …", min:4, link:"#/kerzen/chart", html:`
<p>Chartformationen sind größere Muster aus vielen Kerzen: Kopf-Schulter, Doppel-Top/-Boden, Dreiecke, Flaggen, Keile, Cup &amp; Handle. Jede Formation mit Zeichnung, Einstieg, Stop und Ziel findest du im Kerzen-Lexikon im Reiter <a href="#/kerzen/chart">Chartmuster</a>.</p>`},

{ch:"2 · Charts lesen", id:"indikatoren", ico:"🧮", title:"Die wichtigsten Indikatoren", sub:"EMA, RSI, MACD, Bollinger, ATR", min:9, html:`
<p>Indikatoren werden aus dem Preis berechnet – sie zeigen <b>nichts, was nicht schon im Chart ist</b>, nur anders aufbereitet. Sie hinken immer etwas hinterher. Nutze maximal 2–3.</p>
<h3>Gleitende Durchschnitte (SMA/EMA)</h3><p>Glätten den Kurs. Beliebt: <b>EMA 20/21</b> (kurzfristiger Trend, Pullback-Zone), <b>EMA 50</b>, <b>EMA 200</b> (großer Trendfilter). Kreuzt der 50er den 200er nach oben = „Golden Cross“, nach unten = „Death Cross“.</p>
<h3>RSI (Relative Strength Index, 14)</h3><p>Schwingt zwischen 0 und 100. Über 70 = „überkauft“, unter 30 = „überverkauft“. <b>Achtung:</b> In starken Trends bleibt der RSI lange überkauft – das ist dann kein Verkaufssignal. Besser: RSI-<b>Divergenz</b> (Kurs macht neues Hoch, RSI nicht) als Warnsignal.</p>
<h3>MACD (12, 26, 9)</h3><p>Differenz zweier EMAs plus Signallinie. Kreuzt die MACD-Linie die Signallinie nach oben = bullisch. Bekannte YouTube-Variante (Trading Rush): Nur Long-Kreuzungen <b>unter</b> der Nulllinie und nur, wenn der Kurs über dem EMA 200 liegt.</p>
<h3>Bollinger-Bänder (20, 2)</h3><p>Band um einen 20er-Durchschnitt, das sich mit der Schwankung weitet. Enge Bänder („Squeeze“) kündigen oft eine große Bewegung an. In Ranges wird am Bandrand gehandelt, in Trends „läuft“ der Kurs am Band entlang.</p>
<h3>ATR (Average True Range, 14)</h3><p>Zeigt die durchschnittliche Schwankung. <b>Super für den Stop-Loss:</b> z. B. Stop = 1,5 × ATR vom Einstieg. So ist dein Stop an die aktuelle Volatilität angepasst.</p>
<h3>Volumen</h3><p>Bei Forex gibt es kein zentrales Volumen – MT5 zeigt „Tick-Volumen“ (Anzahl Kursänderungen). Als grober Aktivitätsanzeiger trotzdem brauchbar.</p>
<div class="key"><b>Was die Forschung sagt</b>Eine große Übersichtsstudie (Park &amp; Irwin, 2007) fand in 56 von 95 modernen Studien positive Ergebnisse für technische Regeln, vor allem bei Devisen und Futures – warnt aber ausdrücklich vor „Data Snooping“ (so lange testen, bis zufällig etwas passt) und unterschätzten Kosten.</div>`},

{ch:"2 · Charts lesen", id:"fibonacci", ico:"🌀", title:"Fibonacci-Retracements", sub:"38,2 – 50 – 61,8 %", min:4, html:`
<p>Du ziehst das Fibonacci-Werkzeug vom Tief zum Hoch einer Bewegung (im Aufwärtstrend). MT5 zeichnet dann Linien bei <b>23,6 %, 38,2 %, 50 %, 61,8 %, 78,6 %</b>. Viele Trader erwarten, dass Rücksetzer an diesen Marken enden – vor allem in der „Golden Zone“ zwischen 50 und 61,8 %.</p>
<ul class="list"><li><b>Einstieg:</b> nur, wenn an einem Fib-Level zusätzlich eine Unterstützung liegt und eine Bestätigungskerze kommt.</li><li><b>Stop:</b> unter 78,6 % bzw. unter dem Bewegungstief.</li><li><b>Ziel:</b> altes Hoch oder Extension 127,2 % / 161,8 %.</li></ul>
<div class="warn"><b>Ehrlich gesagt</b>Bei 5–6 Linien trifft der Kurs fast immer „irgendeine“. Robuste Belege, dass Fibonacci-Zahlen besonders sind, haben wir nicht gefunden. Nutze Fib als Orientierung, nie als alleinigen Grund.</div>`},

/* ================= KAPITEL 3 ================= */
{ch:"3 · Ein- & Ausstieg", id:"einstieg", ico:"🎯", title:"Wann steige ich ein?", sub:"Die Checkliste vor jedem Trade", min:8, html:`
<p>Ein guter Einstieg ist kein Bauchgefühl, sondern das Ergebnis einer Checkliste. Wenn ein Punkt fehlt → <b>kein Trade</b>.</p>
<ol class="list"><li><b>Trend:</b> Was macht der große Zeitrahmen? Ich handle in diese Richtung.</li><li><b>Ort:</b> Ist der Kurs an einer wichtigen Zone (Support/Resistance, EMA, Vortageshoch …)?</li><li><b>Signal:</b> Gibt es eine Bestätigung (z. B. Engulfing, Pin Bar, Ausbruch mit Schlusskurs)?</li><li><b>Stop:</b> Wo ist mein Setup klar falsch? Dort liegt der Stop – nicht da, wo es „wenig weh tut“.</li><li><b>Ziel:</b> Ist bis zur nächsten Gegenzone mindestens das <b>1,5- bis 2-Fache</b> des Stop-Abstands Platz?</li><li><b>Zeit:</b> Ist gerade eine aktive Session? Kommen in 30 Minuten wichtige News?</li><li><b>Größe:</b> Positionsgröße mit dem Rechner, max. 1 % Risiko.</li></ol>
<h3>3 typische Einstiegsarten</h3>
<ul class="list"><li><b>Pullback (Rücksetzer):</b> Trend ist intakt, Kurs kommt zurück an EMA 20/50 oder an alten Widerstand (jetzt Support). Einstieg nach bullischer Bestätigungskerze. <i>Am anfängerfreundlichsten.</i></li><li><b>Breakout (Ausbruch):</b> Kurs schließt über einer Range/einem Widerstand. Einstieg per Buy Stop oder beim Retest.</li><li><b>Reversal (Umkehr):</b> Gegen den Trend an einer starken Zone. <i>Schwierigste Variante – erst später.</i></li></ul>
<div class="key"><b>Kerzenschluss abwarten</b>Ein Signal zählt erst, wenn die Kerze <b>geschlossen</b> ist. Eine Kerze, die nach 10 Minuten wie ein Hammer aussieht, kann nach 60 Minuten ganz anders aussehen.</div>`},

{ch:"3 · Ein- & Ausstieg", id:"ausstieg", ico:"🚪", title:"Wann halten, wann raus?", sub:"Stop, Ziel, Teilgewinne, Breakeven", min:7, html:`
<h3>Raus mit Verlust</h3><p>Nur durch deinen <b>Stop-Loss</b> – oder früher, wenn das Setup klar ungültig wird (z. B. Kerze schließt deutlich auf der falschen Seite der Zone). Niemals Stop vergrößern.</p>
<h3>Raus mit Gewinn – 4 Methoden</h3>
<ul class="list"><li><b>Festes Ziel:</b> TP an der nächsten Gegenzone oder fix bei 2R. Einfach &amp; gut für Anfänger.</li><li><b>Teilgewinn:</b> 50 % bei 1R–1,5R schließen, Stop auf Einstand, Rest laufen lassen.</li><li><b>Nachziehen:</b> Stop unter jedes neue höhere Tief (Swing-Low) oder unter den EMA 20 ziehen.</li><li><b>Zeit-Exit:</b> Daytrader schließen spätestens vor Sessionende / vor dem Wochenende.</li></ul>
<h3>Wann halten?</h3><p>Solange die Marktstruktur in deine Richtung intakt ist (neue höhere Hochs &amp; Tiefs bei Long) und dein Stop nicht erreicht ist. Gewinne laufen lassen fällt schwerer als Verluste begrenzen – genau das muss man trainieren.</p>
<div class="key"><b>R-Multiple</b>1R = dein Risiko (Abstand Einstieg → Stop). Gewinn von 2R = doppelt so viel wie riskiert. Denke in R statt in Euro – das beruhigt die Psyche.</div>
<div class="warn"><b>Wochenende</b>Positionen über das Wochenende können mit einer Kurslücke (Gap) am Montag öffnen – dann greift der Stop zum schlechteren Preis.</div>`},

{ch:"3 · Ein- & Ausstieg", id:"news", ico:"📰", title:"News & Wirtschaftskalender", sub:"NFP, CPI, Fed, EZB", min:6, html:`
<p>Wichtige Wirtschaftsdaten bewegen den Markt in Sekunden um viele Pips. Spreads werden kurz riesig, Stops rutschen. Checke jeden Morgen einen <b>Wirtschaftskalender</b> (z. B. bei Forex Factory oder Investing.com) und filtere auf „hohe Wichtigkeit“.</p>
<div class="tablewrap"><table class="t"><tr><th>Event</th><th>Wann (dt. Zeit)</th><th>Wirkt auf</th></tr>
<tr><td><b>US-Arbeitsmarkt (NFP)</b></td><td>meist 1. Freitag im Monat, 14:30</td><td>USD, Gold, Indizes</td></tr>
<tr><td><b>US-Inflation (CPI)</b></td><td>monatlich, 14:30</td><td>USD, Gold, NAS100</td></tr>
<tr><td><b>Fed-Zinsentscheid (FOMC)</b></td><td>8× im Jahr, 20:00 + Pressekonferenz 20:30</td><td>alles mit USD</td></tr>
<tr><td><b>EZB-Zinsentscheid</b></td><td>14:15, Pressekonferenz 14:45</td><td>EUR, GER40</td></tr>
<tr><td><b>Bank of England</b></td><td>meist 13:00</td><td>GBP</td></tr></table></div>
<p class="muted">Die US-Zeiten verschieben sich ein paar Wochen im Frühjahr und Herbst um 1 Stunde, weil die USA die Uhren zu anderen Terminen umstellen als Europa.</p>
<div class="tip"><b>Anfänger-Regel</b>15 Minuten vor bis 15 Minuten nach High-Impact-News: keine neuen Trades. Offene Trades: Stop prüfen oder Gewinn sichern.</div>`},

/* ================= KAPITEL 4 ================= */
{ch:"4 · Risiko & Kopf", id:"risiko", ico:"🛡️", title:"Risikomanagement", sub:"Das Einzige, was du wirklich kontrollierst", min:9, html:`
<h3>Die 1-%-Regel</h3><p>Riskiere pro Trade maximal <b>1 % deines Kontos</b> (Anfänger gern 0,5 %). Bei 1.000 € sind das 10 €. Daraus ergibt sich die Lotgröße – nicht umgekehrt.</p>
<p><b>Formel:</b> Lots = (Konto × Risiko %) ÷ (Stop in Pips × Pip-Wert pro Lot)</p>
<h3>Chance-Risiko-Verhältnis (CRV) &amp; Trefferquote</h3>
<div class="tablewrap"><table class="t"><tr><th>CRV</th><th>Nötige Trefferquote, um ±0 zu sein</th></tr><tr><td>1 : 1</td><td>50 %</td></tr><tr><td>1 : 1,5</td><td>40 %</td></tr><tr><td>1 : 2</td><td>33,3 %</td></tr><tr><td>1 : 3</td><td>25 %</td></tr></table></div>
<p class="muted">Formel: 1 ÷ (1 + CRV). Kosten (Spread, Kommission) sind hier noch nicht drin.</p>
<h3>Warum große Verluste tödlich sind</h3>
<div class="tablewrap"><table class="t"><tr><th>Verlust</th><th>Nötiger Gewinn zurück auf Start</th></tr><tr><td>–10 %</td><td>+11,1 %</td></tr><tr><td>–20 %</td><td>+25 %</td></tr><tr><td>–30 %</td><td>+42,9 %</td></tr><tr><td>–50 %</td><td>+100 %</td></tr><tr><td>–75 %</td><td>+300 %</td></tr></table></div>
<h3>Verlustserien sind normal</h3><p>Selbst mit 50 % Trefferquote sind 6–8 Verluste in Folge über ein paar hundert Trades ganz normal. Mit 1 % Risiko kostet dich das ~6–8 %. Mit 10 % Risiko wäre die Hälfte des Kontos weg.</p>
<h3>Deine Limits</h3><ul class="list"><li>Max. <b>3 %</b> Verlust pro Tag → App zu.</li><li>Max. <b>6 %</b> pro Woche → Pause, Journal auswerten.</li><li>Max. 2–3 Trades gleichzeitig, nicht alle auf dem gleichen USD-Thema.</li></ul>
<div class="good"><b>Das Wichtigste der ganzen App</b>Gute Trader unterscheiden sich weniger durch die Strategie als durch konsequent kleines Risiko und Disziplin. Das war auch der Konsens in den Reddit-Threads profitabler Trader, die wir gelesen haben.</div>`},

{ch:"4 · Risiko & Kopf", id:"psychologie", ico:"🧠", title:"Trading-Psychologie", sub:"FOMO, Revenge, Overtrading", min:7, html:`
<ul class="list"><li><b>FOMO</b> (Angst, etwas zu verpassen): Du springst einer großen Kerze hinterher. Gegenmittel: Nur Setups aus deinem Plan. Der nächste Bus kommt immer.</li>
<li><b>Revenge Trading:</b> Nach einem Verlust sofort größer rein, um es „zurückzuholen“. Gegenmittel: Nach 2 Verlusten am Tag Schluss.</li>
<li><b>Overtrading:</b> Aus Langeweile handeln. Gegenmittel: Max. 2–3 Trades pro Tag, feste Handelszeiten.</li>
<li><b>Stop verschieben / Verlust aussitzen:</b> Der häufigste Konto-Killer.</li>
<li><b>Gewinne zu früh mitnehmen:</b> Aus Angst, dass sie wieder verschwinden. Gegenmittel: TP vorher festlegen und nicht anfassen.</li>
<li><b>Overconfidence nach Gewinnserie:</b> Plötzlich doppelte Größe. Gegenmittel: Größe nur nach Regel erhöhen.</li></ul>
<div class="key"><b>Erkenntnis aus der Forschung</b>In einer Studie mit allen brasilianischen Daytradern, die 300+ Tage durchhielten, verloren 97 % Geld – und die Forscher fanden <b>keine Hinweise, dass man durch reines Daytraden besser wird</b>. Durchhalten allein reicht also nicht. Man muss systematisch lernen (Journal, Regeln, Auswertung).</div>`},

{ch:"4 · Risiko & Kopf", id:"journal", ico:"📓", title:"Journal, Backtest & Demo", sub:"So wirst du wirklich besser", min:6, html:`
<h3>Trading-Journal – nach jedem Trade notieren</h3>
<ul class="list"><li>Datum, Uhrzeit, Markt, Long/Short</li><li>Setup/Strategie, Grund für den Einstieg (Screenshot!)</li><li>Einstieg, Stop, Ziel, Lots, Risiko in €</li><li>Ergebnis in R und €</li><li>Gefühl vorher/nachher, Fehler, Lektion</li></ul>
<p>Nach 20–30 Trades auswerten: Welche Setups, Uhrzeiten und Märkte bringen Geld, welche nicht?</p>
<h3>Backtesting</h3><p>Scroll im Chart zurück, verdecke die Zukunft und spiele deine Regeln Kerze für Kerze durch. Notiere 50–100 Trades. Erst wenn das Ergebnis nach Kosten positiv ist, testest du live auf Demo.</p>
<h3>Der richtige Weg</h3><ol class="list"><li>Regeln aufschreiben</li><li>50–100 Trades Backtest</li><li>4–8 Wochen Demo mit exakt den Regeln</li><li>Live mit Mini-Risiko (0,25–0,5 %)</li><li>Langsam steigern, wenn 3 Monate stabil</li></ol>
<div class="warn"><b>Vorsicht bei „100 Trades getestet“-Videos</b>Viele YouTube-Tests sind manuell, ohne Kosten und mit kleiner Stichprobe. 100 Trades sind statistisch wenig – ein Ergebnis von 60 % Trefferquote kann auch Zufall sein.</div>`},

/* ================= KAPITEL 5 ================= */
{ch:"5 · Praxis & Sicherheit", id:"propfirms", ico:"🏢", title:"Prop Firms (Funded Accounts)", sub:"FTMO & Co. – was dahinter steckt", min:5, html:`
<p>Bei einer Prop Firm zahlst du eine Gebühr für eine „Challenge“ auf einem Demo-Konto (z. B. 10 % Gewinn ohne mehr als 5 % Tagesverlust). Bestehst du, bekommst du ein „gefundetes“ Konto und einen Anteil am Gewinn.</p>
<ul class="list"><li>Eine Analyse von knapp 10.000 Tradern (Swiset/FXStreet, 2024–25) fand: nur <b>20,3 %</b> bestanden einphasige und <b>11,8 %</b> zweiphasige Challenges.</li><li>Ein Technikanbieter der Branche (FPFX Tech) berichtete: von 300.000 Konten erhielten nur <b>7 %</b> eine Auszahlung.</li></ul>
<div class="key"><b>Einordnung</b>Prop Firms verdienen vor allem an den Gebühren. Für dich kann es trotzdem ein Weg sein, mit kleinem Einsatz (Gebühr) große Kontogrößen zu testen – aber erst, wenn du auf Demo/Live 3+ Monate profitabel bist.</div>`},

{ch:"5 · Praxis & Sicherheit", id:"betrug", ico:"🚨", title:"Betrug & Warnsignale", sub:"Signalgruppen, Fake-Broker, Gurus", min:5, html:`
<ul class="list"><li><b>Garantierte Gewinne</b> oder „90 % Trefferquote“ → Lüge.</li><li><b>WhatsApp/Telegram-Gruppen</b>, in die du „eingeladen“ wirst → die BaFin warnt ausdrücklich vor Anlagebetrug über diese Kanäle.</li><li><b>Unregulierter Broker</b> / Offshore → immer in der BaFin-Datenbank prüfen.</li><li><b>„Account Manager“</b>, der für dich tradet oder dich zum Nachschießen drängt.</li><li><b>Lifestyle-Gurus</b> auf TikTok/Instagram mit Lamborghini, die Kurse oder Signale verkaufen. Ihr Geschäft ist der Kurs, nicht das Trading.</li><li><b>Martingale-/Grid-EAs</b> mit perfekter Equity-Kurve → funktionieren, bis das Konto auf einen Schlag explodiert.</li><li>Fremden niemals deine MT5-Zugangsdaten oder Fernzugriff aufs Handy geben.</li></ul>
<div class="tip"><b>BaFin-Tipp</b>Finfluencer sind meist keine zugelassenen Anlageberater und kennen deine Situation nicht. Hintergrund prüfen, unabhängige Infos vergleichen.</div>
<p><a href="https://portal.mvp.bafin.de/database/InstInfo/" target="_blank" rel="noopener">→ BaFin-Unternehmensdatenbank</a><br><a href="https://www.bafin.de/DE/verbraucherinnen-verbraucher/news-warnungen/warnmeldungen/warnmeldungen_node.html" target="_blank" rel="noopener">→ BaFin-Warnungen</a></p>`},

{ch:"5 · Praxis & Sicherheit", id:"fahrplan", ico:"🗺️", title:"Dein 90-Tage-Fahrplan", sub:"Von null zum ersten System", min:5, html:`
<h3>Woche 1–2: Grundlagen</h3><p>Alle Lektionen in Kapitel 1–2 lesen. MT5 kennenlernen. Kerzen-Quiz bis 80 % richtig.</p>
<h3>Woche 3–4: Eine Strategie wählen</h3><p>Nimm <b>Platz 1 oder 2</b> aus dem Ranking. Schreib die Regeln auf eine Seite (Markt, Zeitrahmen, Einstieg, Stop, Ziel, Uhrzeit).</p>
<h3>Woche 5–6: Backtest</h3><p>50–100 Trades in der Vergangenheit durchspielen, ins Journal schreiben.</p>
<h3>Woche 7–12: Demo wie echt</h3><p>Gleiche Kontogröße wie geplant, 1 % Risiko, jede Regel einhalten. Ziel ist nicht Gewinn, sondern <b>Disziplin</b>: 30+ Trades ohne Regelbruch.</p>
<h3>Ab Monat 4: Klein live</h3><p>Nur Geld, dessen Verlust dich nicht stört. 0,25–0,5 % Risiko. Nach jedem Monat auswerten.</p>
<div class="good"><b>Realistische Erwartung</b>Die meisten Privatkunden verlieren bei CFDs Geld (bei Pepperstone Deutschland laut eigenem Risikohinweis 76,1 %). Wenn du nach einem Jahr ungefähr bei null bist und viel gelernt hast, bist du schon besser als die Mehrheit.</div>`}
];
