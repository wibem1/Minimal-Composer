/* Minimal Composer Modular V0.5
   Creative Composer ("Bauch")
   Owns the creative-composition instruction, not technical realization.
   Baseline wording is intentionally unchanged during structural extraction.
*/
(function(global){
'use strict';

function buildDraftPrompt(visibleTask){
 return 'Komponiere das verlangte Stück musikalisch frei und eigenständig. Konzentriere dich ausschließlich auf musikalische Gestalt, Verlauf, Stimmen, Rhythmus, Harmonik, Artikulation und Charakter. Denke noch NICHT an MIDI-Codierung, QN-Werte, CS-Zeilen oder ein technisches Ausgabeformat. Schreibe einen vollständigen, konkret ausnotierbaren musikalischen Entwurf, aus dem anschließend eine andere technische Instanz die MIDI-Daten erzeugen kann. Gib in der ersten Zeile lediglich einen kurzen passenden Werktitel als „Titel: …“ an; dies soll die musikalische Gestaltung nicht einschränken. Mache keine Erläuterung über deine Arbeitsweise.\n\nAUFTRAG:\n'+String(visibleTask||'');
}

global.MinimalComposerCreativeComposer=Object.freeze({
 version:'0.5.0',
 strategy:'baseline-free-draft',
 buildDraftPrompt
});
})(window);
