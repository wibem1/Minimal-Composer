(()=>{'use strict';
let latest=null;
window.addEventListener('mct-strategy-trace',e=>{latest=e.detail||null});
const DB='composition_testbench';
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function attach(){if(!latest)return;const facts=document.getElementById('facts')?.textContent||'',id=facts.match(/Test-ID\s+([^\s]+)/)?.[1];if(!id)return;const db=await openDB(),tx=db.transaction('runs','readwrite'),st=tx.objectStore('runs'),g=st.get(id);g.onsuccess=()=>{const run=g.result;if(!run)return;run.compositionStrategy={version:'0.5.4',name:'Composition Studio two-stage CS',trace:structuredClone(latest)};st.put(run)}}
new MutationObserver(()=>setTimeout(()=>attach().catch(()=>{}),50)).observe(document.querySelector('main'),{attributes:true,childList:true,subtree:true});
window.addEventListener('mct-strategy-trace',()=>setTimeout(()=>attach().catch(()=>{}),250));
})();