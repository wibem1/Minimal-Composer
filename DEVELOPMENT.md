# Minimal Composer Modular – Entwicklungsdokumentation

## Verbindlicher Arbeitsablauf
Vor jeder Änderung zuerst ARCHITECTURE_CONTRACT.md und danach diese Datei lesen. Anschließend den betroffenen Pfad im Referenzstand v0.4.24 bestimmen. Änderungen werden in der zuständigen Architektur vorgenommen, nicht als nachträgliche Patch-Schicht.

## Ausgangspunkt
- Produktname: Minimal Composer Modular
- Zielversion: v0.5.0
- Referenz: Minimal Composer v0.4.24
- Referenz-Commit: d45884f2162fbbaeb1d652458d2aa15b3bc76918
- Entwicklungsbranch: minimal-composer-modular-v0.5
- reference-v0.4.24 bleibt unverändert.

## Aufgabe v0.5.0
Ausschließlich Trennung des monolithischen v0.4.24-Codes in Composition Engine und Interface bei unverändertem musikalischem und funktionalem Verhalten. Keine musikalische Weiterentwicklung.

## Freigabekriterien
- sichtbare Version v0.5.0 / Name Minimal Composer Modular
- bestehende Provider- und Modellwahl unverändert funktionsfähig
- identische dreistufige Kompositionspipeline und technische Verträge
- identische lokale MIDI-Erzeugung
- Verlauf, Backup, Diagnose, Player und Download weiter funktionsfähig
- keine neue Runtime-Web-Abhängigkeit außer den bereits für Provideraufrufe erforderlichen Verbindungen
- Syntax-/Lade-/Smoke-Test bestanden
- Diff gegen Referenz inhaltlich geprüft

## 20.09.2026 – Beginn der Modularisierung
Die Entwicklung wurde bewusst auf einem neuen Branch direkt vom exakten v0.4.24-Commit begonnen. Die bestehende App wird nicht überschrieben. Vor der ersten Codeverschiebung wurde dieser Architekturvertrag angelegt.


## 20.09.2026 – erste physische Modultrennung
Die aus v0.4.24 unverändert übernommenen reinen Funktionen für Provider-Request-Erzeugung, API-Key-Einsetzung in Request-Templates, Provider-Textauswertung, JSON-/Score-/Idee-Auswertung, SHA-256 und deterministische MIDI-Erzeugung wurden in `composition-engine.js` verschoben. `index.html` lädt dieses Modul vor dem Interface-Code und bindet dessen explizite API ein. DOM-/API-Key-Zugriff, Diagnose-Trace, Fetch-Orchestrierung, Speicherung, Titelhistorie, Player und UI verbleiben vorerst im Interface, weil sie Browser-/Anwendungszustand benötigen.

Es wurden keine Prompttexte, Providerparameter, Partiturregeln oder MIDI-Algorithmen geändert. Sichtbarer Produktname ist nun „Minimal Composer Modular“, Version 0.5.0. Dieser Stand ist noch kein freigegebener Testbuild; die weitere Trennung und technische Prüfung stehen aus.


## 20.09.2026 – Pipeline-Orchestrierung und Referenzprüfung
Die vollständige Kompositionsabfolge wird nun von `CompositionEngine.compose(...)` orchestriert. Das Interface stellt Browserdienste bereit (API-Key, Fetch/Trace, Speicherung, UI) und erhält Run + MIDI zurück.

Bei der anschließenden direkten Prüfung gegen `reference-v0.4.24` wurde ein Escape-Unterschied in den ausgelagerten Prompt-Zeilenumbrüchen entdeckt: durch die erste Extraktion wären `\\n`-Zeichenfolgen statt echter per JavaScript-Escape erzeugter Zeilenumbrüche an das Modell gegangen. Dieser Fehler wurde vor einer Testfreigabe korrigiert. Danach wurden die drei zentralen Prompt-Ausdrücke (musical_draft, midi_translation, composition_idea_afterwards) direkt gegen v0.4.24 verglichen: exakt identisch. Provider-Endpunkte, Anthropic-midi_translation-Sonderbehandlung, Pipeline-Stufen und lokaler MIDI-Kern sind weiterhin vorhanden.

Der Stand ist weiterhin nicht freigegeben; Syntax-/Browser-Smoke-Test und weitere Verhaltensprüfung stehen noch aus.


## 20.09.2026 – Architektur der neuen Kompositionsengine festgelegt

Nach den Hörvergleichen mit Suno wurde die innere Architektur der Engine neu gefasst und in `COMPOSITION_ENGINE_ARCHITECTURE.md` dokumentiert. Die zentrale Trennung lautet „Bauch – Kopf – Hand – Synthese“: Creative Composer, Musical Realizer, Technical Core, Provider Adapter und Composition Orchestrator.

Wesentliche Entwicklungsregel: Mehr KI-Aufrufe, mehr Regeln und höhere Kosten gelten nicht als Qualitätsgewinn. Zusätzliche Komplexität wird nur übernommen, wenn ein kontrollierter Hörvergleich einen klaren musikalischen Mehrwert zeigt. Der erste Versuch soll daher klein bleiben und die neue klangorientierte Herangehensweise ohne Kontroll-KI, Originalitätsmetrik oder Regelkatalog testen.

Die bestehende v0.4.24-Referenz und der geschützte Referenz-Branch bleiben unverändert. Die bereits laufende technische Modularisierung wird nicht verworfen; sie wird zur neutralen Grundlage, auf der austauschbare Komponierstrategien aufgebaut werden.


## 20.09.2026 – Implementierung begonnen: Technical Core

Als erster Codebaustein der neuen inneren Engine-Struktur wurde `engine/technical-core.js` angelegt. Er enthält ausschließlich die bereits vorhandene neutrale Technik: technischen Partiturvertrag, JSON-/Score-Auswertung, Hashing und deterministische MIDI-Erzeugung. Es wurden bewusst keine neuen musikalischen Regeln ergänzt.

Der neue Technical Core ist in diesem Commit noch nicht in den Runtime-Pfad eingehängt. Das ist Absicht: Zuerst wird die Modulgrenze sauber hergestellt; erst danach wird die bisherige identische Implementierung aus `composition-engine.js` entfernt und durch den Technical Core ersetzt. So vermeiden wir einen gleichzeitigen Architektur- und Verhaltenswechsel und insbesondere Patch-/Override-Ketten.
