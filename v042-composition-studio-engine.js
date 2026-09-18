(()=>{'use strict';
const nativeFetch=window.fetch.bind(window);
const MARK='TECHNISCHE AUSGABEANFORDERUNG';
const VERSION='0.4.2';
function provider(url){url=String(url||'');if(url.includes('api.openai.com/v1/responses'))return'openai';if(url.includes('api.anthropic.com/v1/messages'))return'anthropic';if(url.includes('generativelanguage.googleapis.com'))return'google';return''}
function getPrompt(p,b){return p==='openai'?(b?.input?.[0]?.content?.[0]?.text||''):p==='anthropic'?(b?.messages?.[0]?.content||''):(b?.contents?.[0]?.parts?.[0]?.text||'')}
function setPrompt(p,b,t){b=structuredClone(b);if(p==='openai')b.input=[{role:'user',content:[{type:'input_text',text:t}]}];else if(p==='anthropic')b.messages=[{role:'user',content:t}];else b.contents=[{role:'user',parts:[{text:t}]}];return b}
function extract(p,j){if(p==='openai'){if(typeof j.output_text==='string'&&j.output_text.trim())return j.output_text;return(j.output||[]).flatMap(x=>x.content||[]).map(x=>x.text||'').join('\n')}if(p==='anthropic')return(j.content||[]).filter(x=>x.type==='text').map(x=>x.text||'').join('\n');return(j.candidates||[]).flatMap(x=>x.content?.parts||[]).map(x=>x.text||'').join('\n')}
function response(raw,status,statusText,headers){return new Response(raw,{status,statusText,headers})}
window.fetch=async(input,init={})=>{
 const url=typeof input==='string'?input:(input?.url||''),p=provider(url);
 if(!p||!init.body)return nativeFetch(input,init);
 let body;try{body=JSON.parse(init.body)}catch(_){return nativeFetch(input,init)}
 const original=getPrompt(p,body);
 if(!original.includes(MARK))return nativeFetch(input,init);
 const cut=original.indexOf(MARK),task=original.slice(0,cut).trim(),technicalContract=original.slice(cut).trim();
 if(!task||!technicalContract)return nativeFetch(input,init);
 const stage1='Komponiere das verlangte Stück musikalisch frei und eigenständig. Konzentriere dich ausschließlich auf musikalische Gestalt, Verlauf, Stimmen, Rhythmus, Harmonik, Artikulation und Charakter. Denke noch NICHT an MIDI-Codierung, QN-Werte, CS-Zeilen oder ein technisches Ausgabeformat. Schreibe einen vollständigen, konkret ausnotierbaren musikalischen Entwurf, aus dem anschließend eine andere technische Instanz die MIDI-Daten erzeugen kann. Gib in der ersten Zeile lediglich einen kurzen passenden Werktitel als „Titel: …“ an; dies soll die musikalische Gestaltung nicht einschränken. Mache keine Erläuterung über deine Arbeitsweise.\n\nAUFTRAG:\n'+task;
 const body1=setPrompt(p,body,stage1);
 window.MCTCompositionEngine.lastTrace={version:VERSION,task,stage1:{prompt:stage1}};
 const r1=await nativeFetch(input,{...init,body:JSON.stringify(body1)}),raw1=await r1.text();
 window.MCTCompositionEngine.lastTrace.stage1.httpStatus=r1.status;
 window.MCTCompositionEngine.lastTrace.stage1.rawResponse=raw1;
 if(!r1.ok)return response(raw1,r1.status,r1.statusText,r1.headers);
 let draft;try{draft=extract(p,JSON.parse(raw1)).trim()}catch(e){return response(JSON.stringify({error:'Musikalischer Entwurf konnte nicht gelesen werden: '+e.message}),500,'Composition stage 1 error',{'Content-Type':'application/json'})}
 if(!draft)return response(JSON.stringify({error:'Musikalischer Entwurf ist leer.'}),500,'Composition stage 1 error',{'Content-Type':'application/json'});
 const stage2='Du bist jetzt ausschließlich Notations- und MIDI-Übersetzer. Übertrage den folgenden bereits fertigen musikalischen Entwurf so vollständig und werkgetreu wie möglich in das nachfolgend geforderte technische Partiturformat. Komponiere NICHT neu, vereinfache NICHT, regularisiere NICHT den Rhythmus und ersetze keine ungewöhnlichen musikalischen Entscheidungen durch Standards. Bewahre insbesondere rhythmische Vielfalt, Pausen, Stimmführung und Phrasierung des Entwurfs. Die technische Ausgabe muss exakt dem nachfolgenden Formatvertrag entsprechen, damit Minimal Composer sie unverändert verarbeiten kann.\n\nURSPRÜNGLICHER AUFTRAG:\n'+task+'\n\nFERTIGER MUSIKALISCHER ENTWURF:\n'+draft+'\n\n'+technicalContract;
 const body2=setPrompt(p,body,stage2);
 window.MCTCompositionEngine.lastTrace.draft=draft;
 window.MCTCompositionEngine.lastTrace.stage2={prompt:stage2};
 const r2=await nativeFetch(input,{...init,body:JSON.stringify(body2)}),raw2=await r2.text();
 window.MCTCompositionEngine.lastTrace.stage2.httpStatus=r2.status;
 window.MCTCompositionEngine.lastTrace.stage2.rawResponse=raw2;
 return response(raw2,r2.status,r2.statusText,r2.headers);
};
window.MCTCompositionEngine={version:VERSION,name:'Composition Studio two-stage engine',lastTrace:null};
})();