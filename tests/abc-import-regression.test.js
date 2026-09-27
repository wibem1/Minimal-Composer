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
assert.deepStrictEqual(Array.from(s.tracks,t=>t.notes.length),[7,16,8]);
assert.deepStrictEqual(Array.from(s.tracks,t=>t.notes[0][2]),[69,62,50]);
assert.deepStrictEqual(Array.from(s.tracks,t=>t.program),[40,0,0]);
console.log('ABC 3-voice / D minor regression: OK');

const reported=`X:1
T:Abendgesang in a-Moll
M:4/4
L:1/8
Q:1/4=84
%%score Vln { RH LH }
V:Vln clef=treble name="Violine"
V:RH clef=treble name="Klavier"
V:LH clef=bass
K:Am
V:Vln
E2 A2 c2 B2 | A4 E2 ^G2 | A2 c2 e2 d2 | c4 B2 E2 |
F2 A2 c2 B2 | A4 G2 F2 | E2 G2 B2 d2 | c4 B4 |
e2 e2 d2 c2 | B2 c2 d4 | c2 c2 B2 A2 | ^G4 E4 |
A2 B2 c2 e2 | d2 c2 B2 ^G2 | A2 E2 ^G2 B2 | A8 |]
V:RH
[Ace]4 [^GBe]4 | [Ace]4 [^GBe]4 | [Ace]4 [Adf]4 | [Gce]4 [^GBe]4 |
[Acf]4 [Ace]4 | [Ace]4 [Gce]4 | [EGB]4 [GBd]4 | [Ace]4 [^GBe]4 |
[Ace]4 [Gce]4 | [^GBe]4 [Adf]4 | [Ace]4 [Acf]4 | [^GBe]8 |
[Ace]4 [Gce]4 | [Adf]4 [^GBe]4 | [Ace]4 [^GBe]4 | [Ace]8 |]
V:LH
A,,4 E,4 | A,,4 E,4 | A,,4 D,4 | C,4 E,4 |
F,,4 A,,4 | A,,4 C,4 | E,,4 G,,4 | A,,4 E,4 |
A,,4 C,4 | E,,4 D,4 | A,,4 F,,4 | E,,8 |
A,,4 C,4 | D,4 E,4 | A,,4 E,4 | A,,8 |]`;
const actual=sandbox.window.ABCImport.parse(reported);
assert.strictEqual(actual.barCount,16,'diagnostic ABC has 16, not 51 bars');
assert.strictEqual(actual.tracks.length,3,'diagnostic ABC has three distinct voices');
assert.deepStrictEqual(Array.from(actual.tracks,t=>t.program),[40,0,0]);
assert.deepStrictEqual(Array.from(actual.tracks,t=>t.notes[0][2]),[64,69,45]);
assert.ok(actual.tracks.every(t=>t.notes.every(n=>n[0]+n[1]<=64)),'all voices must end by bar 16');
console.log('Reported 16-bar violin/piano ABC regression: OK');
