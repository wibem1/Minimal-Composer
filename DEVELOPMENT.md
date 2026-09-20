# Minimal Composer – Entwicklungsprotokoll

## Referenz
- Funktionsfähige Basis: V0.4.24
- Referenz-Commit: `d45884f2162fbbaeb1d652458d2aa15b3bc76918`
- V0.4.24 wird nicht überschrieben.

## V0.5 – Modularisierung
Ziel: bestehendes Verhalten zunächst erhalten, Zuständigkeiten sauber trennen und danach Komponierstrategien experimentell untersuchen.

### Architekturentscheidung
Die Kompositionsengine wird in Creative Composer, Musical Realizer, Technical Core, Composition Orchestrator und Provider Adapter gegliedert. Schöpferischer Prozess und technische Realisierung werden getrennt. Mehr Aufwand/KI-Aufrufe werden nur übernommen, wenn ein hörbarer musikalischer Gewinn nachgewiesen ist.

### Aktueller Schritt
Der Technical Core wurde als erstes echtes Untermodul angelegt. Er übernimmt ausschließlich technische Partiturprüfung, Hashing und deterministische MIDI-Erzeugung. Das Interface delegiert diese Funktionen an das Modul; musikalisches Verhalten wird in diesem Schritt nicht verändert.

### Nächster Schritt
Creative Composer und Musical Realizer aus dem noch im Interface liegenden Ablauf lösen, zunächst ohne Prompt- oder Verhaltensänderung. Danach kann die erste klangorientierte Strategie als kontrollierter Vergleich ergänzt werden.
