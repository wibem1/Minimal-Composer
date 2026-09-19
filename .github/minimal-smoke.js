const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const script=(html.match(/<script>([\s\S]*?)<\/script>/)||[])[1];
assert(script,'script block missing');
new Function(script);
function extractFunction(name){
  const marker='function '+name+'(';
  const start=script.indexOf(marker);
  assert(start>=0,name+' missing');
  const brace=script.indexOf('{',start);
  let depth=0,quote=null,esc=false;
  for(let i=brace;i<script.length;i++){
    const ch=script[i];
    if(quote){if(esc)esc=false;else if(ch==='\\\\')esc=true;else if(ch===quote)quote=null;continue}
    if(ch==="'"||ch==='"'||ch==='\x60'){quote=ch;continue}
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0)return script.slice(start,i+1);
  }
  throw new Error('Unvollständige Funktion '+name);
}
const planned=Function(extractFunction('plannedBarsFromDraft')+';return plannedBarsFromDraft')();
const actual=Function(extractFunction('actualBarsFromScore')+';return actualBarsFromScore')();
for(const [s,n] of [
 ['Teil A (Takt 1–16), B (Takt 17–32), A′ (Takt 33–44), Coda (Takt 45–52)',52],
 ['52 Takte',52],['52-taktiges Stück',52],['T. 1-54',54],['T 1—36',36],['16 taktige Komposition',16]
]) assert.equal(planned(s),n,s);
assert.equal(actual({timeSignature:[4,4],tracks:[{notes:[[0,1,60,80],[59,1,64,80]]}]}),15);
assert.equal(actual({timeSignature:[3,4],tracks:[{notes:[[0,1,60,80],[155,1,64,80]]}]}),52);
assert(html.includes("stage.startsWith('midi_translation')"));
assert(html.includes("midi_translation_completeness_retry"));
assert(html.includes("if(actualBars<plannedBars)throw new Error"));
assert(html.includes("catch(e){ideaWarning="));
assert(html.includes("currentRun.status=ideaWarning?'ok_with_warning':'ok'"));
assert(html.includes("MIDI wurde vollständig erzeugt; die nachträgliche Kompositionsidee konnte nicht geladen werden."));
console.log('Minimal Composer smoke OK');
