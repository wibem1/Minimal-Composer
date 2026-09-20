# Minimal Composer Modular – Architekturvertrag

## Ziel
Minimal Composer Modular v0.5.0 entsteht getrennt aus dem unveränderten Referenzstand Minimal Composer v0.4.24 (Commit d45884f2162fbbaeb1d652458d2aa15b3bc76918). Die Referenzversion und der geschützte Referenz-Branch werden nicht verändert.

## Verbindliche Grundsätze
1. v0.5.0 ist zunächst ausschließlich eine strukturelle Modularisierung: neues Gehäuse, altes Verhalten.
2. Composition Engine und Interface werden klar getrennt. Das Interface darf Darstellung, Browserzustand, Verlauf, Player, Backup und Bedienung verwalten. Die Engine enthält die kompositionsbezogene Provider-/Prompt-/Partitur-Logik.
3. Die musikalische Pipeline von v0.4.24 bleibt unverändert: musical_draft → midi_translation → lokale deterministische MIDI-Erzeugung → composition_idea_afterwards → bestehende Titelbehandlung.
4. Keine Promptänderungen, keine Retry-/Kontrolllogik, keine zusätzlichen musikalischen Regeln und keine Provideroptimierung während der Modularisierung.
5. Anthropic-Sonderverhalten von v0.4.24 bleibt exakt erhalten; insbesondere Thinking-Deaktivierung nur an der dort vorgesehenen technischen Übersetzungsstufe.
6. Keine zusätzliche Web-Abhängigkeit für die Engine. Sie muss später auch lokal in Composition Lab Native und Composition Studio übernommen/adaptiert werden können.
7. Keine Patch-, Override- oder Wrapper-Ketten, wenn die zuständige Logik sauber getrennt werden kann.
8. Jeder Teststand erhält eine eindeutige Versionsnummer. Ein Commit oder Deploy ist kein Funktionstest.
9. Vor Freigabe wird der Diff gegen v0.4.24 inhaltlich geprüft und das Verhalten technisch getestet. Nicht automatisierbare Provider-/Musikqualitätstests werden ausdrücklich getrennt benannt.

## Zielstruktur v0.5.0
- Composition Engine: kompositionsbezogene Verträge, Request-Erzeugung, Providerantwort-Auswertung und deterministische Partitur/MIDI-Verarbeitung.
- Minimal-Composer-Interface: DOM, Eingaben, lokale Speicherung, Verlauf, Backup, Player, Diagnose-Download und Benutzerinteraktion.
- Eine schmale, explizite Schnittstelle verbindet beide Module.

## Referenz
Musikalische und funktionale Wahrheit für v0.5.0 ist ausschließlich Minimal Composer v0.4.24. Frühere v0.5-Experimente sind keine Implementierungsgrundlage.
