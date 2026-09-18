(()=>{'use strict';
const VERSION='0.4.3', MARK='TECHNISCHE AUSGABEANFORDERUNG', nativeFetch=window.fetch.bind(window);
const now=()=>new Date().toISOString();
const clone=x=>{try{return structuredClone(x)}catch(_){return JSON.parse(JSON.stringify(x))}};
const provider=url=>{url=String(url||'');if(url.includes('api.openai.com/v1/responses'))return'openai';if(url.includes('api.anthropic.com/v1/messages'))return'anthropic';if(url.includes('generativelanguage.googleapis.com'))return'google';return''};
function promptOf(p,b){if(p==='openai'){if(typeof b?.input==='string')return b.input;const i=b?.input?.[0];const c=i?.content; if(typeof c==='string')return c;return c?.[0]?.text||''}if(p==='anthropic'){const c=b?.messages?.[0]?.content;return typeof c==='string'?c:(c?.map?.(x=>x?.text||'').join('\n')||'')}return b?.contents?.[0]?.parts?.map?.(x=>x?.text||'').join('\n')||''}
function withPrompt(p,b,t){b=clone(b);if(p==='openai'){if(typeof b.input==='string')b.input=t;else b.input=[{role:'user',content:[{type:'input_text',text:t}]}]}else if(p==='anthropic')b.messages=[{role:'user',content:t}];else b.contents=[{role:'user',parts:[{text:t}]}];return b}
function textOf(p,j){if(p==='openai'){if(typeof j?.output_text==='string')return j.output_text;return(j?.output||[]).flatMap(x=>x?.content||[]).map(x=>x?.text||'').join('\n')}if(p==='anthropic')return(j?.content||[]).filter(x=>x?.type==='text').map(x=>x?.text||'').join('\n');return(j?.candidates||[]).flatMap(x=>x?.content?.parts||[]).map(x=>x?.text||'').join('\n')}
function safeHeaders(h){const out={};try{new Headers(h||{}).forEach((v,k)=>out[k]=/authorization|api-key/i.test(k)?'[REDACTED]':v)}catch(_){}return out}
function snap(p,url,init,body,prompt){return{at:now(),provider:p,url:String(url),method:init?.method||'POST',headers:safeHeaders(init?.headers),body:clone(body),prompt}}
function resp(raw,r){return new Response(raw,{status:r.status,statusText:r.statusText,headers:r.headers})}
async function send(input,init,p,body,prompt,slot){const req=snap(p,typeof input==='string'?input:input?.url,init,body,prompt);slot.request=req;const r=await nativeFetch(input,{...init,body:JSON.stringify(body)}),raw=await r.text();slot.response={at:now(),httpStatus:r.status,statusText:r.statusText,raw};let txt='';try{txt=textOf(p,JSON.parse(raw)).trim()}catch(_){}slot.response.text=txt;return{r,raw,text:txt}}
window.MCTDiagnosticEngine={version:VERSION,lastTrace:null};
window.fetch=async(input,init={})=>{
 const url=typeof input==='string'?input:(input?.url||''),p=provider(url);
 if(!p||!init.body)return nativeFetch(input,init);
 let body;try{body=JSON.parse(init.body)}catch(_){return nativeFetch(input,init)}
 const original=promptOf(p,body);
 if(!original.includes(MARK))return nativeFetch(input,init);
 const cut=original.indexOf(MARK),task=original.slice(0,cut).trim(),contract=original.slice(cut).trim();
 if(!task||!contract)return nativeFetch(input,init);
 const trace={schema:'minimal-composer-ai-trace-v1',engineVersion:VERSION,startedAt:now(),task,provider:p,model:body.model||((url.match(/\/models\/([^:/?]+)/)||[])[1]||''),originalBaseRequest:snap(p,url,init,body,original),stages:{}};
 window.MCTDiagnosticEngine.lastTrace=trace;
 const draftPrompt='Komponiere das verlangte Stück musikalisch frei und eigenständig. Konzentriere dich ausschließlich auf musikalische Gestalt, Verlauf, Stimmen, Rhythmus, Harmonik, Artikulation und Charakter. Denke noch NICHT an MIDI-Codierung, QN-Werte, CS-Zeilen oder ein technisches Ausgabeformat. Schreibe einen vollständigen, konkret ausnotierbaren musikalischen Entwurf, aus dem anschließend eine andere technische Instanz die MIDI-Daten erzeugen kann. Gib in der ersten Zeile lediglich einen kurzen passenden Werktitel als „Titel: …“ an; dies soll die musikalische Gestaltung nicht einschränken. Mache keine Erläuterung über deine Arbeitsweise.\n\nAUFTRAG:\n'+task;
 trace.stages.musicalDraft={}; const s1=await send(input,init,p,withPrompt(p,body,draftPrompt),draftPrompt,trace.stages.musicalDraft);
 if(!s1.r.ok||!s1.text){trace.completedAt=now();return resp(s1.raw,s1.r)}
 trace.musicalDraft=s1.text;
 const translationPrompt='Du bist jetzt ausschließlich Notations- und MIDI-Übersetzer. Übertrage den folgenden bereits fertigen musikalischen Entwurf so vollständig und werkgetreu wie möglich in das nachfolgend geforderte technische Partiturformat. Komponiere NICHT neu, vereinfache NICHT, regularisiere NICHT den Rhythmus und ersetze keine ungewöhnlichen musikalischen Entscheidungen durch Standards. Bewahre insbesondere rhythmische Vielfalt, Pausen, Stimmführung und Phrasierung des Entwurfs. Die technische Ausgabe muss exakt dem nachfolgenden Formatvertrag entsprechen, damit Minimal Composer sie unverändert verarbeiten kann.\n\nURSPRÜNGLICHER AUFTRAG:\n'+task+'\n\nFERTIGER MUSIKALISCHER ENTWURF:\n'+s1.text+'\n\n'+contract;
 trace.stages.midiTranslation={}; const s2=await send(input,init,p,withPrompt(p,body,translationPrompt),translationPrompt,trace.stages.midiTranslation);
 trace.midiTranslation=s2.text; trace.completedAt=now();
 if(s2.r.ok&&s2.text){
   const ideaPrompt='Analysiere die soeben entstandene Komposition und formuliere ihre Kompositionsidee knapp und musikalisch konkret. Beschreibe insbesondere Charakter, formalen Verlauf, rhythmische und harmonische Grundidee sowie das Verhältnis der Stimmen bzw. Instrumente. Erfinde nichts und gib keine Bewertung ab. Antworte nur mit der Kompositionsidee als normalem Text.\n\nURSPRÜNGLICHER AUFTRAG:\n'+task+'\n\nMUSIKALISCHER ENTWURF:\n'+s1.text+'\n\nTECHNISCHE PARTITUR:\n'+s2.text;
   trace.stages.compositionIdea={};
   const ideaBody=withPrompt(p,body,ideaPrompt); if(p==='anthropic')ideaBody.max_tokens=Math.min(2000,+ideaBody.max_tokens||2000);
   send(input,init,p,ideaBody,ideaPrompt,trace.stages.compositionIdea).then(s3=>{trace.compositionIdea=s3.text;trace.ideaCompletedAt=now();window.dispatchEvent(new CustomEvent('mct-trace-updated'))}).catch(e=>{trace.stages.compositionIdea.error=String(e);trace.ideaCompletedAt=now();window.dispatchEvent(new CustomEvent('mct-trace-updated'))});
 }
 window.dispatchEvent(new CustomEvent('mct-trace-updated'));
 return resp(s2.raw,s2.r);
};
})();