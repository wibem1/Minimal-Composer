# ARCHITECTURE CONTRACT – Minimal Composer

## Verbindlicher Standard

Minimal Composer ist Oberfläche und Diagnosewerkzeug. Die musikalische Standardlogik kommt ausschließlich aus dem zentralen, freigegebenen Entry-Point von `wibem1/Composition-Engine`.

Der Normalpfad lautet:

1. Nutzer-Kompositionsauftrag.
2. Freie vollständige Komposition durch die KI. Keine von Minimal Composer oder der Engine vorgeschaltete Form-, Harmonie-, Dramaturgie- oder Klangplan-Stufe.
3. Rein technische, werkgetreue Übersetzung der fertigen Komposition in das Partiturformat.
4. Deterministische lokale MIDI-Erzeugung.
5. Beschreibung ausschließlich nach der fertigen Komposition.

Technische Fortsetzungen abgeschnittener JSON-Ausgaben dürfen keine neuen musikalischen Entscheidungen treffen.

## Verbotene Architekturdrift

- Keine app-lokalen Kopien oder Varianten des Standard-Kompositionsprompts.
- Keine fest verdrahtete alte Engine-Version.
- Keine versteckte Engine-Auswahl über veraltete Katalog-/Resolverlogik.
- Keine musikalische Nachbearbeitung in Parser, Validator oder MIDI-Core.
- Keine Freigabe, wenn Dokumentation, geladene Engine und Diagnoseprotokoll unterschiedliche Pipelines zeigen.

## Diagnose

Die Diagnosedatei muss die geladene Engine-Version, den sichtbaren Nutzerauftrag, jede KI-Stufe, den tatsächlich versendeten Prompt und die technische Antwort nachvollziehbar machen. API-Schlüssel werden nicht protokolliert.

## Freigabe

Ein Build-/Syntaxerfolg ist nur technische Voraussetzung. Der nächste manuelle Hörtest erfolgt erst nach Architektur- und Promptprüfung.
