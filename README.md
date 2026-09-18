# Minimal Composer

Minimal Composer ist das bewusst kleine Experimentierfeld für die Frage, wie wenig Architektur eine KI für musikalisch überzeugende Kompositionen benötigt.

## Rolle

- minimaler Kompositionspfad
- Vergleich unterschiedlicher KI-Modelle
- Experimente mit Zeitpunkt und Rolle der Kompositionsidee
- Referenz dafür, unnötige Vorgaben und technische Überfrachtung zu vermeiden

Historische kleine Versionsdateien bleiben als Entwicklungsdokumentation erhalten; die aktuelle Anwendung lädt sie nicht als Patchkette.


## Entwicklungsregel

Die produktive Anwendung wird konsolidiert entwickelt. Kompositionslogik, Diagnose und Fehlerbehebungen werden im verantwortlichen Hauptcode integriert; keine Ketten aus Fetch-Wrappern, Inject-Skripten oder kompensierenden Patches. Vor einer Veröffentlichung wird der tatsächliche Datenfluss geprüft.

Historische Versionsdateien dürfen zur Dokumentation im Repository verbleiben, werden aber nicht als Laufzeit-Patchkette verwendet.
