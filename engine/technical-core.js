(()=>{'use strict';

const TECHNICAL_CONTRACT=`TECHNISCHE AUSGABEANFORDERUNG – KEINE MUSIKALISCHEN ZUSATZREGELN:
Antworte ausschließlich mit validem JSON, ohne Markdown und ohne Text außerhalb des JSON.
Die Partitur steht entweder direkt im Wurzelobjekt oder im Feld "score".
Partiturformat:
{
  "title": "optional",
  "bpm": Zahl,
  "timeSignature": [Zaehler, Nenner],
  "tracks": [
    {
      "name": "Instrument",
      "program": 0-127,
      "channel": 0-15,
      "notes": [[StartBeat, DauerInBeats, MIDIPitch, Velocity], ...]
    }
  ]
}
Weitere Textfelder, die der Benutzer in seinem Auftrag ausdrücklich verlangt, dürfen zusätzlich im JSON stehen.
StartBeat und DauerInBeats dürfen Dezimalzahlen sein. MIDI-Pitch 0-127, Velocity 1-127.
Das technische Format macht keinerlei Vorgaben zu Stil, Harmonik, Melodik, Rhythmik, Form, Artikulation oder musikalischer Qualität.`;

function extractJson(text){
 let s=String(text||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
 try{return JSON.parse(s)}catch(_){
  const a=s.indexOf('{'),b=s.lastIndexOf('}');
  if(a>=0&&b>a)return JSON.parse(s.slice(a,b+1));
  throw _;
 }
}
function findScore(o){
 const s=o&&o.score&&Array.isArray(o.score.tracks)?o.score:o;
 if(!s||!Array.isArray(s.tracks)||!Number.isFinite(Number(s.bpm)))throw new Error('Kein gültiges Partitur-Objekt mit bpm und tracks gefunden.');
 return s;
}
function findIdea(o){
 if(!o||typeof o!=='object')return'';
 for(const k of['idea','kompositionsidee','description','beschreibung','concept'])if(typeof o[k]==='string'&&o[k].trim())return o[k].trim();
 return'';
}
async function sha256Text(text){
 const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
 return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
async function sha256Buffer(buf){
 const b=await crypto.subtle.digest('SHA-256',buf);
 return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function vlq(n){n=Math.max(0,Math.round(n));let b=[n&127];while((n>>=7))b.unshift((n&127)|128);return b}
const strBytes=s=>[...new TextEncoder().encode(s)],u32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],u16=n=>[(n>>>8)&255,n&255],chunk=(t,d)=>[...strBytes(t),...u32(d.length),...d];

function buildMidi(score){
 const ppq=480,bpm=Math.max(20,Math.min(400,Number(score.bpm)||120)),ts=Array.isArray(score.timeSignature)?score.timeSignature:[4,4],tracks=[],meta=[];
 const mpqn=Math.round(60000000/bpm);
 meta.push({tick:0,bytes:[255,81,3,(mpqn>>16)&255,(mpqn>>8)&255,mpqn&255]},{tick:0,bytes:[255,88,4,Number(ts[0])||4,Math.max(0,Math.round(Math.log2(Number(ts[1])||4))),24,8]});
 let last=0,md=[];
 for(const e of meta){md.push(...vlq(e.tick-last),...e.bytes);last=e.tick}
 md.push(0,255,47,0);tracks.push(chunk('MTrk',md));
 (score.tracks||[]).forEach((tr,ti)=>{
  const ch=Math.max(0,Math.min(15,Number.isFinite(Number(tr.channel))?Number(tr.channel):ti%16)),prog=Math.max(0,Math.min(127,Number(tr.program)||0)),ev=[];
  const name=strBytes(String(tr.name||`Track ${ti+1}`));
  ev.push({tick:0,p:0,b:[255,3,...vlq(name.length),...name]},{tick:0,p:1,b:[192|ch,prog]});
  for(const n of(tr.notes||[])){
   if(!Array.isArray(n)||n.length<4)continue;
   const st=Math.max(0,Number(n[0])||0),du=Math.max(.01,Number(n[1])||.25),pitch=Math.max(0,Math.min(127,Math.round(Number(n[2])||60))),vel=Math.max(1,Math.min(127,Math.round(Number(n[3])||80)));
   ev.push({tick:Math.round(st*ppq),p:2,b:[144|ch,pitch,vel]},{tick:Math.round((st+du)*ppq),p:1,b:[128|ch,pitch,0]});
  }
  ev.sort((a,b)=>a.tick-b.tick||a.p-b.p);
  let prev=0,d=[];
  for(const e of ev){d.push(...vlq(e.tick-prev),...e.b);prev=e.tick}
  d.push(0,255,47,0);tracks.push(chunk('MTrk',d));
 });
 return new Uint8Array([...chunk('MThd',[...u16(1),...u16(tracks.length),...u16(ppq)]),...tracks.flat()]);
}

window.CompositionTechnicalCore=Object.freeze({TECHNICAL_CONTRACT,extractJson,findScore,findIdea,sha256Text,sha256Buffer,buildMidi});
})();
