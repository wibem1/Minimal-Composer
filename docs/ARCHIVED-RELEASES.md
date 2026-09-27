# Wiederherstellbare Referenzstände

## Minimal Composer 1.0.0 / Composition Engine 2.9.0

- Historischer Host-Commit: `9e73bb8210a82864a1211d32e959d52beb9ef2f1`
- Historischer Engine-Release-Commit: `6881f063dafe350094c3b50ac00c462da363e618`
- Archivzweig Host: `archive/minimal-composer-v1.0.0-engine-2.9.0` (zeigt unverändert auf den historischen Host-Commit)
- Archivzweig Engine: `wibem1/Composition-Engine:archive/engine-v2.9.0-for-minimal-v1.0.0` (zeigt unverändert auf den historischen Engine-Commit)

**Achtung:** Der historische Host lädt `https://wibem1.github.io/Composition-Engine/composition-engine.js` dynamisch. Nur den alten Host-Branch zu starten stellt die historische Kombination daher NICHT wieder her. Für eine lauffähige Referenz muss eine separate Host-Kopie explizit die Engine aus dem oben angegebenen Engine-Commit laden; die Archivzweige selbst nicht verändern. Erst nach Browser- und Kompositionstest als praktisch wiederhergestellt kennzeichnen.

Die ursprüngliche vom Nutzer besonders geschätzte V1.0-Testkomposition ist noch nicht zweifelsfrei mit ihrer Laufdiagnose abgeglichen. Die obige Paarung ist die dokumentierte Release-Kombination, nicht der Nachweis der tatsächlich geladenen Engine in jedem Testlauf.

Die aktuelle Produktivversion und zentrale Engine-URL nicht für einen Rollback überschreiben. Siehe auch `wibem1/Composition-Engine/docs/DEVELOPMENT-TRACEABILITY.md`.
