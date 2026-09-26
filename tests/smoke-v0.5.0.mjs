import fs from 'node:fs';import vm from 'node:vm';
const html=fs.readFileSync('index.html','utf8');
const inline=html.split('<script>').slice(1).map(x=>x.split('</script>')[0]).filter(Boolean);
const checks=[];const ok=(name,value)=>{if(!value)throw new Error('FAIL: '+name);checks.push(name)};
inline.forEach((s,i)=>new vm.Script(s,{filename:'index-inline-'+(i+1)+'.js'}));ok('inline script syntax',true);
const engineTag='https://raw.githubusercontent.com/wibem1/Composition-Engine/representation-lab-2.9.0/composition-engine.js';
ok('central engine loaded before interface',html.indexOf(engineTag)>=0&&html.indexOf(engineTag)<html.indexOf("const APP_VERSION='1.0.0'"));
ok('visible app version',html.includes('Version 1.0.0'));
ok('representation selector options',html.includes('Compact 2.8')&&html.includes('ABC')&&html.includes('MIDI Performance')&&html.includes('Freie Wahl der KI'));ok('snapshot carries representation',html.includes('representation:representation.value'));ok('no app-local engine catalogue',!html.includes('engine-manifest.json')&&!html.includes('MinimalComposerEngineResolver'));
ok('no hard-coded old engine version',!html.includes('composition-engine.js?v=1.3.0')&&!html.includes('reference-1.3.0'));
for(const id of ['provider','model','representation','task','compose','midi','diagnosis','prompts','backupExport','backupSecure','backupImport','newSeries'])ok('DOM '+id,new RegExp('id=["\\\']'+id+'["\\\']').test(html));
ok('compose handler',html.includes("$('compose').addEventListener('click'"));
ok('diagnosis handler',html.includes("$('diagnosis').addEventListener('click'"));
ok('IndexedDB stores',html.includes("createObjectStore('series'")&&html.includes("createObjectStore('runs'")&&html.includes("createObjectStore('meta'"));
ok('PWA v1.0.0',html.includes("service-worker.js?v=1.0.0")&&html.includes("manifest.webmanifest?v=1.0.0"));
ok('diagnostic prompt protocol',html.includes('promptTextFromCall')&&html.includes('extractedModelText'));
console.log('PASS '+checks.length+' checks');for(const x of checks)console.log('✓ '+x);

// Architecture smoke guard updated for v1.0.0.
