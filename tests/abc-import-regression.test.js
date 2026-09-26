const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('abc-import.js','utf8');
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(src,sandbox);
const abc=`X:1
T:Three voices
M:4/4
L:1/8
Q:1/4=84
K:Dm
V:Vln name="Violine" clef=treble
V:RH name="Klavier RH" clef=treble
V:LH name="Klavier LH" clef=bass
[V:Vln]
A2 d2 f2 e2 | d4 c2 A2 |
[V:RH]
D F A d A F E D | F A d f e d A F |
[V:LH]
D,2 A,2 D2 A,2 | D,2 A,2 C2 A,2 |`;
const s=sandbox.window.ABCImport.parse(abc);
assert.strictEqual(s.tracks.length,3);
assert.strictEqual(s.barCount,2);
assert.deepStrictEqual(Array.from(s.tracks,t=>t.notes.length),[8,16,8]);
assert.deepStrictEqual(Array.from(s.tracks,t=>t.notes[0][2]),[69,62,38]);
assert.deepStrictEqual(Array.from(s.tracks,t=>t.program),[40,0,0]);
console.log('ABC 3-voice / D minor regression: OK');
