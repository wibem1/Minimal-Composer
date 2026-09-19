const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const script=(html.match(/<script>([\s\S]*?)<\/script>/)||[])[1];
assert(script,'script block missing');
new Function(script);
function fn(name,next){
  const a=script.indexOf('function '+name+'('); assert(a>=0,name+' missing');
  const b=script.indexOf(next,a); assert(b>a,next+' missing');
  return script.slice(a,b);
}
const ctx={}; vm.createContext(ctx);
vm.runInContext(fn('plannedBarsFromDraft','actualBarsFromScore')+fn('actualBarsFromScore','async function sha256Text'),ctx);
for(const [s,n] of [
 ['Teil A (Takt 1–16), B (Takt 17–32), A′ (Takt 33–44), Coda (Takt 45–52)',52],
 ['52 Takte',52],['52-taktiges Stück',52],['T. 1-54',54],['T 1—36',36],['16 taktige Komposition',16]
]) assert.equal(ctx.plannedBarsFromDraft(s),n,s);
const score={timeSignature:[4,4],tracks:[{notes:[[0,1,60,80],[59,1,64,80]]}]};
assert.equal(ctx.actualBarsFromScore(score),15);
assert(html.includes("stage.startsWith('midi_translation')"));
assert(html.includes("midi_translation_completeness_retry"));
assert(html.includes("if(actualBars<plannedBars)throw new Error"));
console.log('Minimal Composer smoke OK');
