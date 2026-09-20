/* Minimal Composer V0.5 Composition Engine
   Extracted from the verified V0.4.24 baseline.
   This module owns provider request construction only; musical prompts and workflow remain in the interface during the first structural step.
*/
(function(global){
'use strict';

function makeRequest(p,m,promptText,stage){
 if(p==='openai')return{provider:p,model:m,url:'https://api.openai.com/v1/responses',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{API_KEY}}'},body:{model:m,input:[{role:'user',content:[{type:'input_text',text:promptText}]}],store:false}};
 if(p==='anthropic'){
  const body={model:m,max_tokens:32768,messages:[{role:'user',content:promptText}]};
  if(/^claude-(?:sonnet|opus)-5(?:$|-)/i.test(m)&&stage==='midi_translation'){body.thinking={type:'disabled'};body.max_tokens=32768}
  return{provider:p,model:m,url:'https://api.anthropic.com/v1/messages',method:'POST',headers:{'Content-Type':'application/json','x-api-key':'{{API_KEY}}','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body};
 }
 return{provider:p,model:m,url:`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent?key={{API_KEY}}`,method:'POST',headers:{'Content-Type':'application/json'},body:{contents:[{role:'user',parts:[{text:promptText}]}]}};
}

global.CompositionEngine=Object.freeze({
 version:'0.5.0',
 makeRequest
});
})(window);
