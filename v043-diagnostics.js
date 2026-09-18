(()=>{'use strict';
const VERSION='0.4.3';
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open('composition_testbench',1);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function one(db,store,key){return new Promise((res,rej)=>{const r=db.transaction(store).objectStore(store).get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function put(db,store,val){return new Promise((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).put(val);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
async function currentRun(db){const ws=await one(db,'meta','workspace');const id=ws?.currentRunId||ws?.value?.currentRunId;return id?await one(db,'runs',id):null}
async function persist(){const trace=window.MCTDiagnosticEngine?.lastTrace;if(!trace)return;let db;try{db=await openDB();const run=await currentRun(db);if(!run)return;run.aiTrace=structuredClone(trace);run.musicalDraft=trace.musicalDraft||'';run.compositionIdea=trace.compositionIdea||'';run.diagnosticEngineVersion=VERSION;if(run.score&&trace.compositionIdea)run.score.compositionIdea=trace.compositionIdea;await put(db,'runs',run);const el=document.getElementById('v041CompositionIdeaText');if(el&&trace.compositionIdea)el.textContent=trace.compositionIdea}catch(e){console.error('v0.4.3 diagnosis persist',e)}finally{try{db?.close()}catch(_){}}}
window.addEventListener('mct-trace-updated',()=>{setTimeout(persist,250);setTimeout(persist,1200)});
new MutationObserver(()=>{if(window.MCTDiagnosticEngine?.lastTrace)setTimeout(persist,200)}).observe(document.body,{subtree:true,childList:true,characterData:true});
})();