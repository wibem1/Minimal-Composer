# Neue Kompositionsengine – innere Architektur

## Ausgangspunkt

Die neue Kompositionsengine wird nicht als monolithisches Modul verstanden, sondern als System klar getrennter Teilmodule. Ausgangsbeobachtung der gemeinsamen Hörvergleiche mit Suno: Unser bisheriges System komponiert stark aus einer sprachlich/formal beschriebenen Vorstellung; Suno wirkt im Ergebnis stärker vom Klang, Höreindruck und musikalischen Gefühl her gedacht. Über Sunos interne Architektur wird daraus ausdrücklich keine Behauptung abgeleitet.

Die technische Modularisierung von Minimal Composer Modular v0.5.0 bleibt weiterhin gegen Minimal Composer v0.4.24 abgesichert. Die hier beschriebene musikalische Weiterentwicklung darf die Referenz v0.4.24 nicht überschreiben.

## Leitbild: Bauch – Kopf – Hand – Synthese

### 1. Creative Composer – „Bauch“
Verantwortet den schöpferischen Prozess: musikalische Geste, Melodie, Spannung, Erinnerung, Überraschung, Pause, Reaktion zwischen Stimmen und klangliche Vorstellung.

Er soll NICHT gleichzeitig MIDI, JSON, Providerformate oder technische Validierung lösen müssen.

Wichtig: „Bauch“ wird nicht in neue starre Regeln übersetzt. Keine Quoten für Pausen, Sprünge, asymmetrische Phrasen oder Originalität. Sonst entsteht nur ein raffinierterer Baukasten.

### 2. Musical Realizer – „Kopf“
Übersetzt eine bereits entstandene musikalische Vorstellung werkgetreu in konkrete musikalische Ereignisse: Tonhöhen, Dauern, Stimmen, Dynamik, Artikulation und Partiturstruktur.

Er darf ungewöhnliche Entscheidungen des Creative Composer nicht „verbessern“, normalisieren oder neu komponieren.

### 3. Technical Core – „Hand“
Reine Technik ohne kompositorische Ambition:
- Score-Datenmodell und Validierung
- JSON-/Partitur-Parsing
- deterministische MIDI-Erzeugung
- MusicXML später als eigener technischer Adapter
- Hashing/Diagnose-relevante technische Funktionen

Der Technical Core entscheidet nicht über Melodik, Harmonik, Rhythmik, Form oder musikalische Qualität.

### 4. Provider Adapter
Kapselt ausschließlich die technischen Unterschiede von OpenAI, Anthropic und Google:
- Endpoint
- Request-Format
- Authentifizierung
- Antwort-Extraktion
- technisch notwendige Provider-Sonderfälle

Keine musikalischen Provider-Sonderprompts in diesem Modul.

### 5. Composition Orchestrator – „Synthese“
Verbindet die Module und entscheidet, welche Komponierstrategie für einen Lauf verwendet wird. Er ist kein zusätzlicher Kritiker.

Er verwaltet:
- Auftrag
- gewählte Strategie
- Reihenfolge der Schritte
- Zahl der KI-Aufrufe
- Übergaben zwischen Creative Composer, Musical Realizer und Technical Core
- Diagnoseprotokoll

## Komponierstrategien sind austauschbar

Die Architektur darf keine einzige Komponiermethode fest verdrahten. Geplante experimentelle Strategien:

- **Direct / Referenz:** vollständige Komposition nach bisherigem Verfahren.
- **Sound-imagination / Klangvorstellung:** zuerst innerer Höreindruck und musikalisches Gefühl, daraus die Musik, erst danach technische Realisierung.
- **Melody first:** zunächst eine eigenständige Melodie; weitere Stimmen/Struktur entstehen daraus.
- **Organic continuation:** kurzer Anfang → musikalisch betrachten → aus dem bereits Entstandenen weiterkomponieren.
- **Dialogue:** Stimmen reagieren musikalisch aufeinander statt nur gleichzeitig Funktionen zu erfüllen.
- **Free experiment:** möglichst wenig Prozessvorgaben.

Keine Strategie gilt vorab als besser. Entscheidend ist der Hörvergleich.

## Kosten- und Komplexitätsprinzip

Mehr KI-Aufrufe, mehr Regeln und mehr Rechenaufwand gelten NICHT als Qualitätsmerkmal.

Verbindlicher Grundsatz:

> Zusätzliche Komplexität wird nur übernommen, wenn sie einen klar hörbaren musikalischen Gewinn bringt.

Erstes Ziel ist deshalb, neue Denkorganisation möglichst ohne zusätzliche KI-Aufrufe zu testen. Mehrstufige Verfahren werden erst eingeführt, wenn ein kontrollierter Hörvergleich ihren Mehrwert zeigt.

Kosten werden pro Lauf diagnostisch erfassbar gemacht, soweit der jeweilige Provider verwertbare Nutzungsdaten liefert. Es gibt kein Ziel „maximal billig“; entscheidend ist musikalischer Gewinn pro zusätzlichem Aufwand.

## Ausdruck / Performance

Eine spätere Expression Engine ist vorgesehen, aber NICHT Bestandteil des ersten Umbauschritts. Sie soll musikalische Ausdrucksabsichten in hochwertige Wiedergabeparameter übersetzen, insbesondere für SWAM bzw. kontinuierliche Controller und Artikulation.

Wichtig: Ausdruck darf keine schwache Komposition kaschieren. Zuerst wird die kompositorische Qualität untersucht, danach die klangliche Realisierung.

## Späterer Hörkreislauf

Langfristig denkbar, zunächst ausdrücklich nicht implementiert:

Vorstellung → Partitur → hochwertige Klangwiedergabe → Höreindruck → musikalische Reaktion → Revision.

Damit könnte das System irgendwann nicht nur aus einer Vorstellung, sondern teilweise aus dem tatsächlich erzeugten Klang zurückkomponieren. Dies ist eine Forschungsrichtung, kein aktuelles Implementierungsziel.

## Erster experimenteller Schritt

Die erste neue Strategie bleibt absichtlich klein:

1. Derselbe knappe Kompositionsauftrag und dasselbe Modell wie bei der Referenz.
2. Creative Composer richtet seine Entscheidungen zuerst auf vorgestellten Klang, Verlauf und Gefühl aus.
3. Musical Realizer überträgt anschließend werkgetreu in die technische Partitur.
4. Keine zusätzliche Kontroll-KI, keine Originalitätsmetrik, keine neuen Harmonie-/Formregeln.
5. Vergleich mit der Referenz ausschließlich durch Hören und Diagnose der tatsächlich gesendeten Requests.
6. Nur bei hörbarem Gewinn wird die Strategie weiterentwickelt.

## Trennung von Architektur und Experiment

Die stabile Referenz Minimal Composer v0.4.24 bleibt unverändert.

Minimal Composer Modular v0.5.0 ist die strukturelle Ausgangsbasis. Neue Komponierstrategien werden so gekapselt, dass die Referenzstrategie erhalten bleibt und ein Experiment ohne Eingriff in Technical Core, Provider Adapter oder Interface ausgetauscht werden kann.

Damit soll ein misslungenes musikalisches Experiment jederzeit durch Wahl der Referenzstrategie zurückgenommen werden können, ohne technische Rückbauten oder Patch-Ketten.
