/* Minimal Composer Modular V0.5
   Musical Realizer ("Kopf")
   Translates an already-created musical conception into the technical score contract.
   It must not compose, simplify or normalize.
*/
(function(global){
'use strict';

function buildTranslationPrompt(visibleTask,draft,technicalContract){
 return 'Du bist jetzt ausschließlich Notations- und MIDI-Übersetzer. Übertrage den folgenden bereits fertigen musikalischen Entwurf so vollständig und werkgetreu wie möglich in das nachfolgend geforderte technische Partiturformat. Komponiere NICHT neu, vereinfache NICHT, regularisiere NICHT den Rhythmus und ersetze keine ungewöhnlichen musikalischen Entscheidungen durch Standards. Bewahre insbesondere rhythmische Vielfalt, Pausen, Stimmführung und Phrasierung des Entwurfs.\n\nURSPRÜNGLICHER AUFTRAG:\n'+String(visibleTask||'')+'\n\nFERTIGER MUSIKALISCHER ENTWURF:\n'+String(draft||'')+'\n\n'+String(technicalContract||'');
}

global.MinimalComposerMusicalRealizer=Object.freeze({
 version:'0.5.0',
 buildTranslationPrompt
});
})(window);
