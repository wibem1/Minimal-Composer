# Minimal Composer Modular V0.5 – Kompositionsarchitektur

## Ziel
Die Kompositionsengine ist kein Monolith mehr, sondern ein System klar getrennter Zuständigkeiten. Leitbild: **Bauch – Kopf – Hand – Synthese**.

## Module

### 1. Creative Composer – Bauch
Erzeugt die musikalische Vorstellung und den schöpferischen Verlauf. Keine MIDI-Codierung, kein JSON-Zwang, keine technische Reparatur. Strategien müssen austauschbar bleiben.

### 2. Musical Realizer – Kopf
Übersetzt die musikalische Vorstellung werkgetreu in konkrete musikalische Ereignisse. Er soll nicht neu komponieren, vereinheitlichen oder ungewöhnliche Entscheidungen durch Standards ersetzen.

### 3. Technical Core – Hand
Reine Technik: Partiturvertrag, Parsing/Validierung, Hashing, deterministische MIDI-Erzeugung, später MusicXML. Keine musikalischen Entscheidungen.

### 4. Composition Orchestrator – Synthese
Steuert die Zusammenarbeit der Module und die gewählte Komponierstrategie. Er ist kein zusätzlicher Kritiker.

### 5. Provider Adapter
Kapselt ausschließlich API-/Provider-Unterschiede für OpenAI, Anthropic und Google.

## Komponierstrategien
Die Strategie ist austauschbar und darf nicht als starres Regelwerk in den Technical Core einsickern. Zu untersuchen sind zunächst:
- bisheriges Verfahren als Referenz,
- klangorientierte Vorstellung vor technischer Realisierung,
- später ggf. Melodie-zuerst und organisches Fortschreiben.

## Suno-Hypothese
Aus den Hörvergleichen leiten wir **keine Behauptung über Sunos interne Architektur** ab. Arbeitshypothese für unsere Experimente: Unser System komponiert stark aus sprachlich/formal beschriebener Vorstellung; Sunos Ergebnisse wirken stärker vom Klang und Höreindruck her gedacht. Wir versuchen daher, Vorstellung und später Höreindruck enger zu koppeln, ohne Suno nachzubauen.

## Kosten- und Komplexitätsprinzip
Mehr Modellaufrufe, mehr Regeln und mehr Rechenaufwand gelten nicht als Qualitätsgewinn. **Jede zusätzliche Stufe muss einen hörbaren musikalischen Mehrwert zeigen.** Zunächst bevorzugen wir möglichst kleine Experimente und vermeiden Kontrollkaskaden.

## Ausbau in Etappen
1. Technische Funktionen ohne Verhaltensänderung aus dem Interface herauslösen.
2. Creative Composer und Musical Realizer als getrennte Zuständigkeiten herauslösen.
3. Alte und neue Komponierstrategie mit gleichem Auftrag/Modell hörend vergleichen.
4. Nur bei nachgewiesenem Gewinn weitere Rückkopplung ergänzen.
5. Später: Expression/Performance und ggf. SWAM-basierter Hörkreislauf.

## Schutzregel
Die funktionierende Referenz V0.4.24 bleibt unangetastet. V0.5 wird modular entwickelt; keine Patch-Kette im Interface.
