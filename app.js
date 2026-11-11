/* TradeLab – App-Logik */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LS={get(k,d){try{const v=localStorage.getItem("tl_"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem("tl_"+k,JSON.stringify(v))}catch(e){toast("Speicher voll – alte Analyse wird nicht gespeichert")}},del(k){localStorage.removeItem("tl_"+k)}};
const fmt=(n,d=2)=>Number(n).toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});

/* ---------- Zoom/Selektion verhindern ---------- */
["gesturestart","gesturechange","gestureend"].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
document.addEventListener("touchmove",e=>{if(e.scale!==undefined&&e.scale!==1)e.preventDefault()},{passive:false});
document.addEventListener("touchstart",e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
document.addEventListener("contextmenu",e=>{if(!e.target.closest("input,textarea"))e.preventDefault()});
document.addEventListener("selectstart",e=>{if(!e.target.closest("input,textarea"))e.preventDefault()});
document.addEventListener("dragstart",e=>e.preventDefault());

/* ---------- Icons (Lucide-Stil, 24px, stroke 1.75) ---------- */
const ico=(p,sw)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw||1.75}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I={
 home:ico('<path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5.5v-6.5h-5V21H4a1 1 0 0 1-1-1z"/>'),
 learn:ico('<path d="M2.5 5.2C5 4 8.5 4 12 6c3.5-2 7-2 9.5-.8V19c-2.5-1.2-6-1.2-9.5.8-3.5-2-7-2-9.5-.8z"/><path d="M12 6v13.8"/>'),
 strat:ico('<path d="M3 20h18"/><rect x="4.5" y="11" width="3.5" height="6.5" rx=".8"/><rect x="10.25" y="5" width="3.5" height="12.5" rx=".8"/><rect x="16" y="8" width="3.5" height="9.5" rx=".8"/>'),
 time:ico('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>'),
 scan:ico('<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="m7.5 14.5 3-3 2 2 4-4.5"/>'),
 back:ico('<path d="m15 18-6-6 6-6"/>',2.2),
 chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
 gear:ico('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
 search:ico('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
 check:ico('<path d="M20 6 9 17l-5-5"/>',2.6),
 candle:ico('<path d="M8 3.5V7M8 17v3.5M16 3v5M16 16v5"/><rect x="5.5" y="7" width="5" height="10" rx="1"/><rect x="13.5" y="8" width="5" height="8" rx="1"/>'),
 calc:ico('<rect x="4.5" y="2.5" width="15" height="19" rx="2.5"/><path d="M8 6.5h8M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5V18M8.5 18h.01M12 18h.01"/>'),
 camera:ico('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.2"/>'),
 image:ico('<rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="9" cy="9" r="1.8"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>'),
 book:ico('<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>'),
 link:ico('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
 trend:ico('<path d="M22 7 13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/>'),
 eye:ico('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
 pin:ico('<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
 ok:ico('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>'),
 target:ico('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
 shield:ico('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
 flag:ico('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>'),
 alert:ico('<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>'),
 info:ico('<circle cx="12" cy="12" r="9.5"/><path d="M12 16v-4.5M12 8h.01"/>'),
 x:ico('<circle cx="12" cy="12" r="9.5"/><path d="m15 9-6 6M9 9l6 6"/>'),
 key:ico('<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2"/>'),
 lock:ico('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
 phone:ico('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
 spark:ico('<path d="M12 3.5 13.6 9a2 2 0 0 0 1.4 1.4l5.5 1.6-5.5 1.6a2 2 0 0 0-1.4 1.4L12 20.5 10.4 15A2 2 0 0 0 9 13.6L3.5 12 9 10.4A2 2 0 0 0 10.4 9z"/>'),
 globe:ico('<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5a14.5 14.5 0 0 1 0 19 14.5 14.5 0 0 1 0-19z"/>'),
 ruler:ico('<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>'),
 scale:ico('<path d="M12 3v18M7 21h10M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/><path d="m16 16 3-8 3 8c-.9.6-1.9 1-3 1s-2.1-.4-3-1zM2 16l3-8 3 8c-.9.6-1.9 1-3 1s-2.1-.4-3-1z"/>'),
 euro:ico('<path d="M4 10h11M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>'),
 list:ico('<path d="M8.5 6H21M8.5 12H21M8.5 18H21M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'),
 tri:ico('<path d="M3 20h18L12 4z"/>'),
 pulse:ico('<path d="M22 12h-4l-3 8L9 4l-3 8H2"/>'),
 fib:ico('<path d="M3 3v18h18"/><path d="M7 7h14M7 11h14M7 15h14" stroke-dasharray="2 2.5"/>'),
 enter:ico('<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>'),
 exit:ico('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
 news:ico('<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>'),
 bulb:ico('<path d="M9 18h6M10 21.5h4M12 2.5a6.5 6.5 0 0 0-4 11.6c.7.6 1 1.4 1 2.4h6c0-1 .3-1.8 1-2.4a6.5 6.5 0 0 0-4-11.6z"/>'),
 building:ico('<path d="M3 21h18M5 21V7l7-4 7 4v14M9.5 21v-5h5v5M9 10h.01M15 10h.01"/>'),
 map:ico('<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>'),
 cpu:ico('<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'),
 trash:ico('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>'),
 cards:ico('<rect x="3" y="6.5" width="13.5" height="15" rx="2.2"/><path d="M7.5 3H19a2 2 0 0 1 2 2v12.5"/>'),
 flame:ico('<path d="M12 22c4 0 7-2.8 7-7 0-3.4-2.1-5.9-3.9-7.9.1 2-1 3.4-2.4 3.4-1.7 0-1.9-2.6-.9-8.5C8 5 5 9.2 5 15c0 4.2 3 7 7 7z"/>'),
 close:ico('<path d="M18 6 6 18M6 6l12 12"/>',2),
 keyb:ico('<rect x="2" y="6" width="20" height="12" rx="2.5"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7.5 14h9"/>'),
 grid:ico('<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>'),
 updown:ico('<path d="m7 4-4 4h3v12h2V8h3zM17 20l4-4h-3V4h-2v12h-3z"/>'),
 reset:ico('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>')
};
const LICO={maerkte:"globe","pips-lots":"ruler",hebel:"scale",kosten:"euro",ordertypen:"list",mt5:"phone","kerzen-basics":"candle",timeframes:"time","trend-sr":"trend",chartmuster:"tri",indikatoren:"pulse",fibonacci:"fib",einstieg:"enter",ausstieg:"exit",news:"news",risiko:"shield",psychologie:"bulb",journal:"book",propfirms:"building",betrug:"alert",fahrplan:"map"};
const lico=l=>I[LICO[l.id]]||I.learn;
const TABS=[["start","Start",I.home],["lernen","Lernen",I.learn],["strategien","Strategien",I.strat],["timing","Timing",I.time],["analyse","Analyse",I.scan]];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Sessions ---------- */
const SESS=[{n:"Sydney",f:"SYD",tz:"Australia/Sydney",o:7,c:16},{n:"Tokio",f:"TYO",tz:"Asia/Tokyo",o:9,c:18},{n:"London",f:"LON",tz:"Europe/London",o:8,c:17},{n:"New York",f:"NYC",tz:"America/New_York",o:8,c:17}];

const dtfCache={};
function parts(d,tz){const f=dtfCache[tz]||(dtfCache[tz]=new Intl.DateTimeFormat("en-US",{timeZone:tz,hour:"numeric",minute:"numeric",weekday:"short",hourCycle:"h23"}));
 const o={};f.formatToParts(d).forEach(p=>o[p.type]=p.value);return{h:(+o.hour)%24,m:+o.minute,wd:o.weekday}}
function fxOpen(d){const p=parts(d,"America/New_York");if(p.wd==="Sat")return false;if(p.wd==="Fri"&&p.h>=17)return false;if(p.wd==="Sun"&&p.h<17)return false;return true}
function sessOpen(s,d){if(!fxOpen(d))return false;const p=parts(d,s.tz);if(p.wd==="Sat"||p.wd==="Sun")return false;const t=p.h+p.m/60;return t>=s.o&&t<s.c}
const berlinHM=d=>d.toLocaleTimeString("de-DE",{timeZone:"Europe/Berlin",hour:"2-digit",minute:"2-digit"});
const berlinDay=d=>d.toLocaleDateString("de-DE",{timeZone:"Europe/Berlin",weekday:"short"});
function nextChange(fn,from){const st=fn(from);for(let i=1;i<=72*12;i++){const t=new Date(from.getTime()+i*5*60000);if(fn(t)!==st)return t}return null}
function dur(ms){const m=Math.round(ms/60000);const h=Math.floor(m/60);return h>0?`${h} h ${m%60} min`:`${m} min`}
function marketNow(){const now=new Date();const open=SESS.filter(s=>sessOpen(s,now));let label,cls;
 if(!fxOpen(now)){label="Wochenende – Forex geschlossen";cls="r"}
 else if(open.some(s=>s.n==="London")&&open.some(s=>s.n==="New York")){label="London + New York Overlap – beste Zeit";cls="g"}
 else if(open.some(s=>s.n==="London")){label="London-Session – sehr aktiv";cls="g"}
 else if(open.some(s=>s.n==="New York")){label="New-York-Session – aktiv";cls="b"}
 else if(open.length){label="Asien-Session – eher ruhig";cls="a"}
 else{label="Übergang – dünner Markt, große Spreads";cls="a"}
 return{now,open,label,cls}}

/* ---------- Toast ---------- */
let toastT;function toast(msg){let t=$(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=msg;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),2600)}
/* ---------- Kerzen-SVG ---------- */
/* ---------- Trade-Plan: Level-Berechnung ---------- */
const PC={entry:"#6e9bff",stop:"#ff7f66",target:"#6fd3a0"};
const PCFG={bullengulf:{e:"close"},bearengulf:{e:"close"},morningstar:{e:"close"},eveningstar:{e:"close"},"3insideup":{e:"close"},"3insidedown":{e:"close"},"3outsideup":{e:"close"},"3outsidedown":{e:"close"},
 rising3:{e:"close",s:[1,2,3],t:"proj0"},falling3:{e:"close",s:[1,2,3],t:"proj0"},marubozubull:{e:"limit"},marubozubear:{e:"limit"},"3soldiers":{e:"limit",s:[1]},"3crows":{e:"limit",s:[1]},insidebar:{e:"mother",s:[1]}};
const planDirs=p=>p.dir==="bull"?["long"]:p.dir==="bear"?["short"]:["long","short"];
const planDefault=p=>p.dir==="bull"?"long":p.dir==="bear"?"short":p.fol==="up"?"long":p.fol==="down"?"short":p.ctx==="up"?"short":"long";
function candlePlan(p,dir){const pat=p.c,n=pat.length,last=pat[n-1],cfg=PCFG[p.id]||{},L=dir==="long";
 const phi=Math.max(...pat.map(k=>k[1])),plo=Math.min(...pat.map(k=>k[2])),buf=Math.max(.35,(phi-plo)*.05);
 let e,ref,ei=n-1,et;
 if(cfg.e==="close"){e=ref=last[3];et=L?"Kauf bei Schluss":"Verkauf bei Schluss"}
 else if(cfg.e==="limit"){e=ref=(last[1]+last[2])/2;et=L?"Buy Limit bei 50 %":"Sell Limit bei 50 %"}
 else if(cfg.e==="mother"){const m=pat[0];ei=0;ref=L?m[1]:m[2];e=L?ref+buf:ref-buf;et=L?"Buy Stop über Mutterkerze":"Sell Stop unter Mutterkerze"}
 else{ref=L?last[1]:last[2];e=L?ref+buf:ref-buf;et=L?"Buy Stop über Hoch":"Sell Stop unter Tief"}
 const idx=cfg.s||pat.map((_,i)=>i);const sref=L?Math.min(...idx.map(i=>pat[i][2])):Math.max(...idx.map(i=>pat[i][1]));const si=idx.find(i=>pat[i][L?2:1]===sref);
 const s=L?sref-buf:sref+buf;
 const st=(L?"unter ":"über ")+(p.id==="insidebar"?"Inside Bar":cfg.s&&cfg.s.length>1?"kleinen Kerzen":cfg.s?"Kerze 2":n===1?(L?"Docht-Tief":"Docht-Hoch"):(L?"Muster-Tief":"Muster-Hoch"));
 const R=Math.abs(e-s);let t,tt;
 if(cfg.t==="proj0"){const len=pat[0][1]-pat[0][2];t=L?e+len:e-len;tt="Länge Kerze 1"}else{t=L?e+2*R:e-2*R;tt="2R oder nächste Zone"}
 return{long:L,entry:{v:e,ref,i:ei,t:"Einstieg · "+et},stop:{v:s,ref:sref,i:si,t:"Stop · "+st},target:{v:t,t:"Ziel · "+tt},rr:Math.abs(t-e)/R}}
/* Formationen: aus Punkten (p) und Linien (l) abgeleitet */
const lineAt=(l,x)=>l[1]+(l[3]-l[1])*(x-l[0])/(l[2]-l[0]);
function crossX(pts,fn,from){for(let i=from;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],da=a[1]-fn(a[0]),db=b[1]-fn(b[0]);if(da===0)return a[0];if(da*db<0)return a[0]+(b[0]-a[0])*da/(da-db)}return pts[pts.length-1][0]}
function formPlan(p,dir){const P=p.p,Ls=p.l,L=dir==="long",B=2.5;let e,ex,eref,et,s,sx,sref,st,t,tt;
 const neck=(l,k,txt)=>{const fn=x=>lineAt(l,x);ex=crossX(P,fn,k);eref=fn(ex);e=L?eref+B:eref-B;et=txt};
 const stopAt=(i,txt)=>{sx=P[i][0];sref=P[i][1];s=L?sref-B:sref+B;st=txt};
 switch(p.id){
  case"sks":neck(Ls[0],5,"Sell Stop unter Nackenlinie");stopAt(5,"über rechter Schulter");t=e-(P[3][1]-lineAt(Ls[0],P[3][0]));tt="Kopfhöhe nach unten";break;
  case"isks":neck(Ls[0],5,"Buy Stop über Nackenlinie");stopAt(5,"unter rechter Schulter");t=e+(lineAt(Ls[0],P[3][0])-P[3][1]);tt="Kopfhöhe nach oben";break;
  case"dtop":neck(Ls[1],3,"Sell Stop unter Nackenlinie");stopAt(3,"über 2. Hoch");t=e-(P[3][1]-Ls[1][1]);tt="Formationshöhe";break;
  case"dbottom":neck(Ls[1],3,"Buy Stop über Nackenlinie");stopAt(3,"unter 2. Tief");t=e+(Ls[1][1]-P[3][1]);tt="Formationshöhe";break;
  case"asctri":neck(Ls[0],6,"Buy Stop über Widerstand");stopAt(6,"unter letztem Tief");t=e+(Ls[0][1]-P[2][1]);tt="Höhe am Anfang";break;
  case"desctri":neck(Ls[0],6,"Sell Stop unter Unterstützung");stopAt(6,"über letztem Hoch");t=e-(P[2][1]-Ls[0][1]);tt="Höhe am Anfang";break;
  case"symtri":{const up=Ls[0],lo=Ls[1],xb=Math.min(up[2],lo[2]),h=lineAt(up,lo[0])-lineAt(lo,lo[0]);ex=sx=xb;
   if(L){eref=lineAt(up,xb);e=eref+B;et="Buy Stop über oberer Linie";sref=lineAt(lo,xb);s=sref-B;st="unter unterer Linie";t=e+h}
   else{eref=lineAt(lo,xb);e=eref-B;et="Sell Stop unter unterer Linie";sref=lineAt(up,xb);s=sref+B;st="über oberer Linie";t=e-h}tt="Höhe der Öffnung";break}
  case"bullflag":{const xb=Ls[0][2]+2;ex=xb;eref=lineAt(Ls[0],xb);e=eref+B;et="Buy Stop über Flagge";let m=1;for(let i=1;i<=6;i++)if(P[i][1]<P[m][1])m=i;stopAt(m,"unter Flaggen-Tief");t=e+(P[1][1]-P[0][1]);tt="Länge Fahnenmast";break}
  case"bearflag":{const xb=Ls[0][2]+2;ex=xb;eref=lineAt(Ls[0],xb);e=eref-B;et="Sell Stop unter Flagge";let m=1;for(let i=1;i<=6;i++)if(P[i][1]>P[m][1])m=i;stopAt(m,"über Flaggen-Hoch");t=e-(P[0][1]-P[1][1]);tt="Länge Fahnenmast";break}
  case"risingwedge":neck(Ls[1],7,"Sell Stop unter Keil");stopAt(7,"über letztem Hoch");t=P[0][1];tt="Beginn des Keils";break;
  case"fallingwedge":neck(Ls[0],7,"Buy Stop über Keil");stopAt(7,"unter letztem Tief");t=P[0][1];tt="Beginn des Keils";break;
  case"cup":{neck(Ls[0],9,"Buy Stop über Tassenrand");const m=P[8][1]<P[9][1]?8:9;stopAt(m,"unter Henkel-Tief");const bot=Math.min(...P.slice(1,7).map(q=>q[1]));t=e+(Ls[0][1]-bot);tt="Tassentiefe";break}
  default:return null}
 return{long:L,entry:{v:e,ref:eref,x:ex,t:"Einstieg · "+et},stop:{v:s,ref:sref,x:sx,t:"Stop · "+st},target:{v:t,t:"Ziel · "+tt},rr:Math.abs(t-e)/Math.abs(e-s)}}

/* ---------- Kerzen-SVG (mit optionalem Trade-Plan) ---------- */
function candleGeo(p,withPlan){
 const pat=p.c.map(x=>x.slice()),first=pat[0],ctx=[],s=6;let nx=first[0];
 const varr=[1,.85,-.45,1.1,.9];
 if(p.ctx==="down"){for(let i=4;i>=0;i--){const v=varr[i];const c=nx+.3,op=c+s*v;ctx.unshift([op,Math.max(op,c)+1.2,Math.min(op,c)-1.2,c]);nx=op}}
 else if(p.ctx==="up"){for(let i=4;i>=0;i--){const v=varr[i];const c=nx-.3,op=c-s*v;ctx.unshift([op,Math.max(op,c)+1.2,Math.min(op,c)-1.2,c]);nx=op}}
 else{[[2,-2],[-1.5,1.5],[1.8,-1.2],[-1.2,1.6],[1,-.8]].forEach(([a,b])=>{const op=first[0]+a,c=first[0]+b;ctx.push([op,Math.max(op,c)+1,Math.min(op,c)-1,c])})}
 const fol=[];const lc=pat[pat.length-1][3];
 if(p.fol==="up"){fol.push([lc+.3,lc+6,lc-.5,lc+5.5],[lc+5,lc+11,lc+4,lc+10])}
 if(p.fol==="down"){fol.push([lc-.3,lc+.5,lc-6,lc-5.5],[lc-5,lc-4,lc-11,lc-10])}
 const all=ctx.concat(pat,fol);let lo=Infinity,hi=-Infinity;all.forEach(k=>{lo=Math.min(lo,k[2]);hi=Math.max(hi,k[1])});
 const plans={};if(withPlan)planDirs(p).forEach(d=>{const q=candlePlan(p,d);plans[d]=q;[q.entry.v,q.stop.v,q.target.v].forEach(v=>{lo=Math.min(lo,v);hi=Math.max(hi,v)})});
 const W=320,H=withPlan?190:170,pt=withPlan?14:22,pb=withPlan?14:18,rng=(hi-lo)||1;const Y=v=>pt+(hi-v)/rng*(H-pt-pb);
 const n=all.length,slots=n+(withPlan&&!fol.length?2:0),slot=(W-24)/slots,cw=Math.min(18,slot*.58);const X=i=>12+slot*i+slot/2;
 let g="";const ps=ctx.length,pe=ps+pat.length-1;
 let plo=Infinity,phi=-Infinity;pat.forEach(k=>{plo=Math.min(plo,k[2]);phi=Math.max(phi,k[1])});
 g+=`<g class="fd" style="--dd:${ps*45+60}ms"><rect x="${X(ps)-slot/2+2}" y="${Y(phi)-7}" width="${slot*pat.length-4}" height="${Y(plo)-Y(phi)+14}" rx="10" fill="rgba(255,240,222,.045)" stroke="rgba(255,240,222,.22)" stroke-dasharray="3 3"/></g>`;
 if(p.lvl==="sup"){const y=Y(plo)+5;g+=`<g class="hl" style="--dd:${(pe+1)*45}ms"><line x1="8" x2="${W-8}" y1="${y}" y2="${y}" stroke="#6fd3a0" stroke-width="1.2" stroke-dasharray="5 5" opacity=".55"/><text x="${W-10}" y="${y+12>H-3?y-4:y+12}" text-anchor="end" font-size="9" fill="#6fd3a0" opacity=".8" font-weight="600">Support</text></g>`}
 if(p.lvl==="res"){const y=Y(phi)-5;g+=`<g class="hl" style="--dd:${(pe+1)*45}ms"><line x1="8" x2="${W-8}" y1="${y}" y2="${y}" stroke="#ff7f66" stroke-width="1.2" stroke-dasharray="5 5" opacity=".55"/><text x="${W-10}" y="${y-5}" text-anchor="end" font-size="9" fill="#ff7f66" opacity=".8" font-weight="600">Widerstand</text></g>`}
 const arrow=(x1,y1,x2,y2,col,dash,dl)=>{const ang=Math.atan2(y2-y1,x2-x1),L=7;const ax=x2-L*Math.cos(ang-.5),ay=y2-L*Math.sin(ang-.5),bx=x2-L*Math.cos(ang+.5),by=y2-L*Math.sin(ang+.5);
  return `<g class="ar" style="--dd:${dl||0}ms"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2" ${dash?'stroke-dasharray="5 4"':''} stroke-linecap="round"/><path d="M${ax},${ay} L${x2},${y2} L${bx},${by}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`};
 if(p.ctx!=="side"){const a=ctx[0],b=ctx[ctx.length-1];g+=arrow(X(0)-4,Math.max(6,Y(a[1])-10),X(ctx.length-1)+4,Math.max(6,Y(b[1])-10),"rgba(255,240,222,.32)",false,ctx.length*45+80)}
 if(fol.length){const a=fol[0],b=fol[fol.length-1];const up=p.fol==="up";const col=up?"#6fd3a0":"#ff7f66";
  const y1=up?Y(a[2])+12:Y(a[1])-10,y2=up?Y(b[2])+12:Y(b[1])-10;g+=arrow(X(pe+1)-6,Math.min(H-4,Math.max(6,y1)),X(n-1)+6,Math.min(H-4,Math.max(6,y2)),col,true,n*45+120)}
 all.forEach((k,i)=>{const [op,h,l,c]=k;const bull=c>op+.25,bear=c<op-.25;const col=bull?"#6fd3a0":bear?"#ff7f66":"#b5ada0";
  const isF=i>pe,isP=i>=ps&&i<=pe;const opa=isF?.3:isP?1:.5;const x=X(i);const top=Y(Math.max(op,c)),bot=Y(Math.min(op,c));
  g+=`<g opacity="${opa}"><g class="cd" style="--i:${i}"><line x1="${x}" x2="${x}" y1="${Y(h)}" y2="${Y(l)}" stroke="${col}" stroke-width="1.4" stroke-linecap="round"/><rect x="${x-cw/2}" y="${top}" width="${cw}" height="${Math.max(1.8,bot-top)}" rx="2.2" fill="${col}"/></g></g>`});
 const svg=`<svg class="pat-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${g}${withPlan?'<g class="plan-z"></g><g class="plan-l"></g>':""}</svg>`;
 const draw={};Object.entries(plans).forEach(([d,q])=>{const mk=o=>({y:Y(o.v),mx:X(ps+o.i),my:Y(o.ref),off:cw/2+3,t:o.t});
  draw[d]={long:q.long,rr:q.rr,entry:mk(q.entry),stop:mk(q.stop),target:{y:Y(q.target.v),t:q.target.t},zx:X(ps+q.entry.i)+cw/2+4,lx:X(ps)-slot/2+2}});
 return{svg,W,H,draw}}
function candleSVG(p){return candleGeo(p,false).svg}
function chartGeo(p,withPlan){const MAPC={"#34e5a5":"#6fd3a0","#ff5c7a":"#ff7f66","#ffc14d":"#e9b44c"};const W=320,H=withPlan?200:170;
 let y0=0,y1=100;const plans={};if(withPlan)planDirs(p).forEach(d=>{const q=formPlan(p,d);if(!q)return;plans[d]=q;[q.entry.v,q.stop.v,q.target.v].forEach(v=>{y0=Math.min(y0,v);y1=Math.max(y1,v)})});
 const X=x=>14+x/100*(W-28),Y=y=>H-14-(y-y0)/(y1-y0)*(H-28);
 let g=p.l.map((l,li)=>`<g class="fd" style="--dd:${650+li*90}ms"><line x1="${X(l[0])}" y1="${Y(l[1])}" x2="${X(l[2])}" y2="${Y(l[3])}" stroke="${MAPC[l[4]]||l[4]}" stroke-width="1.5" stroke-dasharray="6 5" opacity=".8"/>`+(l[5]?`<text x="${X(l[2])}" y="${Y(l[3])-6}" font-size="9.5" fill="${MAPC[l[4]]||l[4]}" text-anchor="end" font-weight="600">${l[5]}</text>`:"")+"</g>").join("");
 const pts=p.p.map((q,i)=>(i?"L":"M")+X(q[0])+","+Y(q[1])).join(" ");const col=p.dir==="bull"?"#6fd3a0":p.dir==="bear"?"#ff7f66":"#b5ada0";
 g+=`<path class="dl" pathLength="1" d="${pts}" fill="none" stroke="url(#lg_${p.id})" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round"/>`;
 const last=p.p[p.p.length-1];g+=`<g class="pop" style="--dd:950ms"><circle cx="${X(last[0])}" cy="${Y(last[1])}" r="4.5" fill="${col}"/></g>`;
 const svg=`<svg class="pat-svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="lg_${p.id}" x1="0" x2="1"><stop offset="0" stop-color="#857d70"/><stop offset=".72" stop-color="#e8e0d2"/><stop offset="1" stop-color="${col}"/></linearGradient></defs>${g}${withPlan?'<g class="plan-z"></g><g class="plan-l"></g>':""}</svg>`;
 const draw={};Object.entries(plans).forEach(([d,q])=>{const mk=o=>({y:Y(o.v),mx:X(o.x),my:Y(o.ref),off:5,t:o.t});
  draw[d]={long:q.long,rr:q.rr,entry:mk(q.entry),stop:mk(q.stop),target:{y:Y(q.target.v),t:q.target.t},zx:X(q.entry.x),lx:Math.min(X(q.entry.x),X(q.stop.x))-10}});
 return{svg,W,H,draw}}
function chartSVG(p){return chartGeo(p,false).svg}

/* ---------- Trade-Plan zeichnen ---------- */
const SVGNS="http://www.w3.org/2000/svg";
function svgEl(tag,attrs,parent){const e=document.createElementNS(SVGNS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function planLevel(gl,G,D,k){const o=D[k],c=PC[k],W=G.W;const g=svgEl("g",{class:"pl","data-k":k},gl);
 const x0=Math.max(6,D.lx);svgEl("path",{class:"ln",d:`M${x0} ${o.y} H${W-6}`,stroke:c,"stroke-width":1.6,fill:"none",pathLength:1},g);
 if(o.mx!=null){const ax=o.mx+o.off;
  if(Math.abs(o.my-o.y)>1.5)svgEl("path",{class:"mk",d:`M${o.mx} ${o.my} V${o.y}`,stroke:c,"stroke-width":1.2,"stroke-dasharray":"2 2",fill:"none"},g);
  svgEl("circle",{class:"mk",cx:o.mx,cy:o.my,r:2.8,fill:c,stroke:"#0a0a0b","stroke-width":1.2},g);
  svgEl("path",{class:"mk",d:`M${ax} ${o.y} l6 -4 v8 z`,fill:c},g)}
 const pg=svgEl("g",{class:"pill"},g);const r=svgEl("rect",{height:16,rx:8,fill:"rgba(10,10,11,.92)",stroke:c,"stroke-width":.8},pg);
 const t=svgEl("text",{"font-size":9.5,"font-weight":600,fill:c,"dominant-baseline":"central"},pg);t.textContent=o.t;
 let w=o.t.length*5.2+14;try{w=t.getComputedTextLength()+14}catch(e){}
 g.__pill={pg,r,t,w,y:o.y};return g}
function layoutPills(gl,G,D){const ps=[...gl.querySelectorAll(".pl:not(.out)")].map(g=>g.__pill).filter(Boolean).sort((a,b)=>a.y-b.y);
 let prev=-1e9;ps.forEach(p=>{let y=Math.max(p.y,prev+18);y=Math.min(G.H-9,Math.max(9,y));prev=y;const x=Math.max(4,Math.min(D.lx-4,G.W-6)-p.w);
  p.r.setAttribute("x",x);p.r.setAttribute("y",y-8);p.r.setAttribute("width",p.w);p.t.setAttribute("x",x+7);p.t.setAttribute("y",y+.5)})}
function planZones(gz,G,D,st){gz.innerHTML="";const e=st.entry,s=st.stop,t=st.target;if(!e||!(s||t))return"";const x=D.zx,w=G.W-6-x;
 const box=(y1,y2,c)=>svgEl("rect",{class:"pz",x,y:Math.min(y1,y2),width:w,height:Math.abs(y2-y1),fill:c,"fill-opacity":.16},gz);
 if(s)box(D.entry.y,D.stop.y,PC.stop);if(t)box(D.entry.y,D.target.y,PC.target);
 const lab=s&&t?`R:R 1 : ${fmtN(D.rr,1)}`:s?"Risiko = 1R":`Chance = ${fmtN(D.rr,1)}R`;
 const yy=t?(D.entry.y+D.target.y)/2:(D.entry.y+D.stop.y)/2;const tx=svgEl("text",{class:"pz",x:G.W-12,y:yy,"text-anchor":"end","dominant-baseline":"central","font-size":10,"font-weight":700,fill:"#f5f5f7"},gz);tx.textContent=lab;
 return lab}
function planCtl(v,G,defDir){const svg=$(".plan-card svg",v);if(!svg)return;const gl=$(".plan-l",svg),gz=$(".plan-z",svg);const st={entry:false,stop:false,target:false};let dir=defDir;
 const rows=$$("[data-pk]",v),all=$("#pall",v),info=$("#prr",v),tip=$("#ptip",v);
 const sync=()=>{const D=G.draw[dir];rows.forEach(r=>r.classList.toggle("on",st[r.dataset.pk]));const n=Object.values(st).filter(Boolean).length;all.textContent=n===3?"Alle ausblenden":"Alle zeigen";all.classList.toggle("on",n===3);
  $$(".pl",gl).forEach(g=>{if(!st[g.dataset.k]&&!g.classList.contains("out")){g.classList.add("out");setTimeout(()=>g.remove(),reduce?0:200)}});
  ["entry","stop","target"].forEach(k=>{if(st[k]&&!$(`.pl[data-k="${k}"]:not(.out)`,gl))planLevel(gl,G,D,k)});layoutPills(gl,G,D);
  const lab=planZones(gz,G,D,st);const full=lab&&lab.startsWith("R:R");info.textContent=n?(D.long?"Long":"Short")+(full?" · "+lab:""):"";if(tip){tip.style.display=full&&D.rr<1.5?"":"none"}};
 const show=()=>{const r=svg.getBoundingClientRect(),top=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sat"))||0;const navB=top+44+8,botLim=innerHeight-49-40;
  if(r.top<navB||r.bottom>botLim){v.scrollTo({top:v.scrollTop+r.top-navB-8,behavior:reduce?"auto":"smooth"});return reduce?0:340}return 0};
 rows.forEach(r=>r.onclick=()=>{const k=r.dataset.pk;st[k]=!st[k];const d=st[k]?show():0;r.classList.toggle("on",st[k]);setTimeout(sync,d)});
 all.onclick=()=>{const on=!(st.entry&&st.stop&&st.target);st.entry=st.stop=st.target=on;sync()};
 $$("[data-pdir]",v).forEach(b=>b.onclick=()=>{dir=b.dataset.pdir;$$("[data-pdir]",v).forEach(x=>x.classList.toggle("on",x===b));const th=$(".thumb",b.parentNode);if(th)placeThumb(th,b);gl.innerHTML="";sync()});
 sync()}
const planRow=(k,icon,t,x)=>`<button class="f plan-row" data-pk="${k}" style="--c:${PC[k]}"><div class="ic">${I[icon]}</div><div style="flex:1;min-width:0"><b>${t}</b><p>${esc(x)}</p></div><span class="tg">${I.check}</span></button>`;
const planBar=(p,dd)=>`<div class="plan-bar">${planDirs(p).length>1?seg([["long","Long-Ausbruch"],["short","Short-Ausbruch"]],dd,"data-pdir"):""}<div class="row" style="justify-content:space-between"><button class="fchip" id="pall">Alle zeigen</button><span class="muted tnum" id="prr"></span></div><div class="warn" id="ptip" style="display:none;margin:10px 0 0;font-size:14px;line-height:20px"><b>CRV unter 1 : 1,5</b>Der Lehrbuch-Stop liegt weit weg. Besser: Einstieg beim Retest (z. B. der Nackenlinie) mit engerem Stop – oder kleinere Lotgröße.</div></div>`;

const ANATOMY=`<svg class="pat-svg" viewBox="0 0 320 214"><g font-size="10.5" font-weight="650">
<line x1="90" y1="22" x2="90" y2="190" stroke="#6fd3a0" stroke-width="2.5"/><rect x="72" y="62" width="36" height="90" rx="4" fill="#6fd3a0"/>
<line x1="230" y1="22" x2="230" y2="190" stroke="#ff7f66" stroke-width="2.5"/><rect x="212" y="62" width="36" height="90" rx="4" fill="#ff7f66"/>
<g fill="#b5ada0"><text x="96" y="26">Hoch</text><text x="114" y="66">Schluss</text><text x="114" y="156">Eröffnung</text><text x="96" y="194">Tief</text>
<text x="236" y="26">Hoch</text><text x="254" y="66">Eröffnung</text><text x="254" y="156">Schluss</text><text x="236" y="194">Tief</text></g>
<g fill="#857d70"><text x="6" y="44">oberer Docht</text><text x="22" y="110">Körper</text><text x="6" y="176">unterer Docht</text></g>
<g stroke="rgba(255,240,222,.25)"><line x1="66" y1="40" x2="86" y2="40"/><line x1="58" y1="107" x2="70" y2="107"/><line x1="72" y1="172" x2="86" y2="172"/></g>
<text x="90" y="210" text-anchor="middle" fill="#6fd3a0" font-size="11" font-weight="700">BULLISCH</text><text x="230" y="210" text-anchor="middle" fill="#ff7f66" font-size="11" font-weight="700">BÄRISCH</text></g></svg>`;
/* ---------- View-Helfer ---------- */
const doneSet=()=>new Set(LS.get("done",[]));
function toggleDone(id){const s=doneSet();const on=!s.has(id);on?s.add(id):s.delete(id);LS.set("done",[...s]);try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}return on}
const fmtN=(v,d)=>Number(v).toLocaleString("de-DE",{minimumFractionDigits:d||0,maximumFractionDigits:d||0});
function cuLock(e,to,dec,suf){if(e.__lk===to)return;e.__lk=to;e.style.minWidth=e.style.maxWidth="";if(getComputedStyle(e).display==="inline")e.classList.add("cu-lock");e.textContent=fmtN(to,dec)+suf;const w=e.getBoundingClientRect().width;if(w){e.style.minWidth=e.style.maxWidth=Math.ceil(w)+"px"}}
function countUp(e){const to=+e.dataset.count,suf=e.dataset.suf||"",dec=+(e.dataset.dec||0);cuLock(e,to,dec,suf);const from=+(e.dataset.from||0);
 if(reduce){e.textContent=fmtN(to,dec)+suf;e.style.minWidth=e.style.maxWidth="";e.__lk=null;return}const t0=performance.now(),d=700;
 const step=t=>{const k=Math.min(1,(t-t0)/d),v=from+(to-from)*(1-Math.pow(1-k,3));e.textContent=fmtN(v,dec)+suf;if(k<1)requestAnimationFrame(step);else{e.style.minWidth=e.style.maxWidth="";e.__lk=null}};requestAnimationFrame(step)}
/* ---------- Motion: Scroll-Reveal, Zahlen, Charts ---------- */
const RV_SEL=".r,.card,.pat-card,.group>.cell,.group>.stat-row,.group>.gl-item,.group>.f,.eyebrow,.ch-head,.chapter>.pb,.seg,.filters,.view>.btn,#ksub>.btn,.disclaimer";
const sel=(el,s)=>(el.matches&&el.matches(s)?[el]:[]).concat([...el.querySelectorAll(s)]);
function goSvg(el,d){if(reduce)return;sel(el,".pat-svg").forEach(s=>{if(s.classList.contains("go"))return;s.style.setProperty("--b",(d||0)+"ms");s.classList.add("go")})}
function fx(el,d){d=d||0;
 sel(el,"[data-w]").forEach(e=>{if(e.__fx)return;e.__fx=1;setTimeout(()=>e.style.width=e.dataset.w+"%",reduce?0:d+60)});
 sel(el,".ring .fg").forEach(c=>{if(c.__fx)return;c.__fx=1;setTimeout(()=>c.style.strokeDashoffset=c.dataset.off,reduce?0:d+60)});
 sel(el,"[data-count]").forEach(e=>{if(e.__fx)return;e.__fx=1;setTimeout(()=>countUp(e),reduce?0:d+40)});
 goSvg(el,d)}
function reveal(root,base){if(!root)return;const view=root.closest?root.closest(".view")||root:root;base=base||0;
 if(reduce||!("IntersectionObserver" in window)){fx(root,0);return}
 if(!view.__io){let batch=[],tm=0;
  const flush=()=>{tm=0;batch.sort((a,b)=>a.r-b.r);batch.forEach((x,i)=>{const d=Math.min(i,9)*55+(x.el.__base||0);x.el.style.setProperty("--d",d+"ms");x.el.classList.add("in");fx(x.el,d);
   setTimeout(()=>{x.el.classList.remove("rv","in");x.el.style.removeProperty("--d")},d+800)});batch=[]};
  view.__io=new IntersectionObserver(es=>{es.forEach(e=>{if(!e.isIntersecting)return;view.__io.unobserve(e.target);batch.push({el:e.target,r:e.boundingClientRect.top});});if(batch.length&&!tm)tm=requestAnimationFrame(flush)},{root:view,rootMargin:"0px 0px -4% 0px",threshold:0})}
 const io=view.__io;
 sel(root,RV_SEL).forEach(el=>{if(el.__rv)return;const p=el.parentElement&&el.parentElement.closest(".rv");if(p)return;el.__rv=1;el.__base=base;el.classList.add("rv");io.observe(el)});
 // alles, was in keinem animierten Block steckt, sofort
 sel(root,"[data-w],.ring .fg,[data-count],.pat-svg").forEach(e=>{if(!e.closest(".rv"))fx(e,base)})}
function animateIn(){}
function tw(el,to,f){if(!el)return;const from=el.__v==null?0:el.__v;el.__v=to;cancelAnimationFrame(el.__raf);if(reduce||!isFinite(from)||from===to){el.textContent=f(to);return}
 const t0=performance.now(),d=520;const step=t=>{const k=Math.min(1,(t-t0)/d),v=from+(to-from)*(1-Math.pow(1-k,3));el.textContent=f(v);if(k<1)el.__raf=requestAnimationFrame(step)};el.__raf=requestAnimationFrame(step);
 el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump")}
function burst(anchor,n){if(reduce||!anchor)return;const r=anchor.getBoundingClientRect();const b=document.createElement("div");b.className="burst";b.style.left=(r.left+r.width/2)+"px";b.style.top=(r.top+r.height/2)+"px";
 n=n||10;for(let i=0;i<n;i++){const s=document.createElement("i");const a=i/n*Math.PI*2+Math.random()*.4,dist=34+Math.random()*26;s.style.setProperty("--x",Math.cos(a)*dist+"px");s.style.setProperty("--y",Math.sin(a)*dist+"px");s.style.animationDelay=Math.random()*60+"ms";if(i%3===0)s.className="w";b.appendChild(s)}
 document.body.appendChild(b);setTimeout(()=>b.remove(),900)}

function ring(pct,size){const r=40,C=2*Math.PI*r;return `<svg class="ring" viewBox="0 0 92 92" width="${size||64}" height="${size||64}"><circle class="bgc" cx="46" cy="46" r="${r}"/><circle class="fg" cx="46" cy="46" r="${r}" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C*(1-pct)}" transform="rotate(-90 46 46)"/></svg>`}
const score=s=>Math.round((.3*s.P+.4*s.E+.3*s.A)/5*100);
const bar=(v,max,c)=>`<div class="pb thin ${c||""}"><i data-w="${Math.round(v/(max||5)*100)}"></i></div>`;
const dirTxt=d=>d==="bull"?'<span class="dir g">Bullisch</span>':d==="bear"?'<span class="dir r">Bärisch</span>':'<span class="dir n">Neutral</span>';
const dirChip=d=>d==="bull"?'<span class="chip g">Bullisch</span>':d==="bear"?'<span class="chip r">Bärisch</span>':'<span class="chip">Neutral</span>';
const nChip=n=>`<span class="chip">${n===1?"1 Kerze":n+" Kerzen"}</span>`;
const cell=(href,icon,t1,t2,rt)=>`<a class="cell" href="${href}">${icon?`<div class="ic">${icon}</div>`:""}<div class="tx"><div class="t1">${t1}</div>${t2?`<div class="t2">${t2}</div>`:""}</div>${rt?`<div class="rt">${rt}</div>`:""}${I.chev}</a>`;
const fact=(icon,t,x)=>`<div class="f"><div class="ic">${I[icon]}</div><div><b>${t}</b><p>${esc(x)}</p></div></div>`;
const nextLesson=d=>LESSONS.find(l=>!d.has(l.id));
const chParts=ch=>{const m=String(ch).split(" · ");return m.length>1?{num:m[0],title:m.slice(1).join(" · ")}:{num:"",title:ch}};
const V={};
/* ================= v5 Views: „Ink & Amber“ ================= */
const ARW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const PLAY='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
const TT=(a,b,cls)=>`<h1 class="lt r ${cls||""}">${a}${b?` <i>${b}</i>`:""}</h1>`;
const EB=(t,a,st)=>`<div class="eb${a?" a":""}"${st?` style="${st}"`:""}>${t}</div>`;
const SH=(t,link,href)=>`<div class="sh r"><h3>${t}</h3>${link?`<a href="${href}">${link}</a>`:""}</div>`;
const TG=d=>d==="bull"?'<span class="tag up">Bullisch</span>':d==="bear"?'<span class="tag dn">Bärisch</span>':'<span class="tag n">Neutral</span>';
const nTxt=n=>n===1?"1 Kerze":n+" Kerzen";
const bkP=p=>{const m=/(\d+)\s*%/.exec(p.bk||""),r=/Rang\s*(\d+)\/(\d+)/.exec(p.bk||"");return{pct:m?+m[1]:null,rank:r?+r[1]:null,of:r?+r[2]:null}};
const greetTxt=()=>{const hr=parseInt(new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Berlin",hour:"2-digit",hourCycle:"h23"}).format(new Date()),10);return hr<5?"Gute Nacht":hr<11?"Guten Morgen":hr<18?"Hallo":"Guten Abend"};
function ticks(d){const nx=(nextLesson(d)||{}).id;let k=0;return `<div class="ticks r">${chapters().map(c=>`<div class="tk" style="--n:${c.ls.length}">${c.ls.map(l=>`<i style="--k:${k++}" class="${d.has(l.id)?"on":l.id===nx?"nx":""}"></i>`).join("")}</div>`).join("")}</div>
 <div class="tkl">${chapters().map((c,i)=>`<span style="--n:${c.ls.length}">0${i+1}</span>`).join("")}</div>`}
const pc=(p,href,f)=>`<a class="pc press r" href="${href}"><div class="w">${f?chartSVG(p):candleSVG(p)}</div><div class="nm">${esc(p.name)}</div><div class="mt">${TG(p.dir)}<span>${f?"Formation":nTxt(p.n)}</span></div></a>`;
function trainTeaser(t,s,href){return `<a class="teaser press r" href="${href}"><div class="tz-l"><div class="tz-eb">Trainingsmodus</div><div class="tz-t">${t}</div><div class="tz-s">${s}</div><span class="tz-b">Los geht's</span></div>
 <div class="tz-path"><i class="d"></i><i class="d"></i><i class="c"></i><i class="f"></i></div></a>`}
function ringS(v,max,size,cls){const r=36,C=2*Math.PI*r;return `<div class="ringw ${cls||""}" style="width:${size}px;height:${size}px"><svg viewBox="0 0 84 84" class="ring"><circle class="bgc" cx="42" cy="42" r="${r}"/><circle class="fg" cx="42" cy="42" r="${r}" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C*(1-Math.min(1,v/max))}" transform="rotate(-90 42 42)"/></svg><div class="c"><span data-count="${Math.min(v,max)}">0</span><small>/${max}</small></div></div>`}

V.start=()=>{const d=doneSet(),N=LESSONS.length,pct=Math.round(d.size/N*100),m=marketNow(),nx=nextLesson(d),dd=daily(),st=dayStreak(),due=fcDue("gemischt","mc");const tip=TIPS[Math.floor(Date.now()/864e5)%TIPS.length];
 const standalone=navigator.standalone||matchMedia("(display-mode: standalone)").matches;const lon=m.open.some(s=>s.n==="London"),ny=m.open.some(s=>s.n==="New York");
 const ci=nx?chapters().findIndex(c=>c.ls.some(l=>l.id===nx.id)):-1;
 const lead=[due?`${due} Karten warten auf dich`:`Tagesziel: ${Math.min(dd.n,GOAL)} von ${GOAL} Karten`,lon&&ny?"London und New York sind offen":lon?"London ist gerade offen":ny?"New York ist offen":m.open.length?"Asien handelt gerade":"der Markt ist ruhig"].join(" · ")+".";
 const week=["hammer","bullengulf","eveningstar","shootingstar","morningstar","3soldiers","piercing","darkcloud"];const off=Math.floor(Date.now()/(7*864e5))%week.length;const wk=[0,1,2,3,4].map(i=>CANDLES.find(p=>p.id===week[(off+i)%week.length])).filter(Boolean);
 return{title:"Start",html:`<div class="toprow r"><span class="eb">${new Date().toLocaleDateString("de-DE",{timeZone:"Europe/Berlin",weekday:"long",day:"numeric",month:"long"})}</span><span style="flex:1"></span><a class="pill" href="#/training">${I.flame}<span class="tnum">${st.days||0}</span></a><a class="pill" href="#/karten">${I.cards}<span class="tnum">${due}</span></a></div>
 ${TT(greetTxt()+",","Tim","hello")}<p class="lead r">${lead}</p>
 ${nx?`<a class="hero press r" href="#/lernen/${nx.id}"><div class="eb a">Kapitel ${ci+1} · Lektion ${LESSONS.indexOf(nx)+1}</div><h2>${esc(nx.title)}</h2><div class="meta">${esc(nx.sub)} · ${nx.min} Min.</div><span class="hplay">${PLAY}</span><div class="art">${candleSVG(CANDLES.find(p=>p.id==="morningstar"))}</div></a>`
  :`<div class="hero r"><div class="eb a">Geschafft</div><h2>Alle Lektionen abgeschlossen</h2><div class="meta">Jetzt: Demo-Konto, Journal, Geduld.</div></div>`}
 <section class="bandA r"><div class="eb">Lernfortschritt</div><div class="bignum"><span data-count="${pct}">0</span><sup>%</sup></div><div class="bn-sub"><b>${d.size} von ${N}</b> Lektionen · noch ${N-d.size} bis zum eigenen System</div></section>
 <div class="bleed">${ticks(d)}</div>
 ${SH("Muster der Woche","Lexikon","#/kerzen/muster")}
 <div class="hscroll car bleed">${wk.map(p=>pc(p,"#/kerze/"+p.id)).join("")}</div>
 ${SH("Dein Tag")}
 <div class="bento">
  <a class="tile tall mk press r" href="#/timing"><div class="eb">Markt · <span data-clock class="tnum">${berlinHM(m.now)}</span></div><h4>${lon?"London":ny?"New York":m.open.length?m.open[0].n:"Ruhig"}</h4><div class="sub">${esc(m.label)}</div>
   <div class="ss">${SESS.map(s=>{const o=sessOpen(s,m.now),c=nextChange(t=>sessOpen(s,t),m.now);return `<div><i class="${o?"on":""}"></i><span>${s.n}</span><b class="tnum">${c?(o?"–":"")+berlinHM(c):""}</b></div>`}).join("")}</div></a>
  <a class="tile acc press r" href="#/karten"><div class="eb">Karteikarten</div><div class="bn" data-count="${due}">0</div><div class="bl">${due===1?"Karte":"Karten"} fällig</div><span class="arr">${ARW}</span></a>
  <a class="tile press r" href="#/training"><div class="eb">Tagesziel</div>${ringS(dd.n,GOAL,84)}<div class="bl" style="margin-top:8px">${st.days?`${st.days} ${st.days===1?"Tag":"Tage"} in Folge`:"Starte deine Serie"}</div></a>
  <div class="tile wide r"><div class="eb a">Tipp des Tages</div><p class="quote">${esc(tip)}</p></div>
 </div>
 ${SH("Die harte Wahrheit","Quellen","#/quellen")}
 <div class="facts2"><div class="fact r"><div class="eb">Pepperstone</div><div class="v dn"><span data-count="76.1" data-dec="1">0</span>%</div><p>der Privatkunden-Konten verlieren Geld mit CFDs.</p></div><div class="fact r"><div class="eb">Brasilien-Studie</div><div class="v"><span data-count="97">0</span>%</div><p>der Dauer-Daytrader verloren Geld. Nur 1,1 % verdienten mehr als den Mindestlohn.</p></div>
  <div class="fact wide r"><div class="eb">Taiwan · 450.000 Daytrader</div><div class="row" style="gap:16px;align-items:center"><div class="v" style="flex:none">&lt;1%</div><p style="margin:0">waren über Jahre verlässlich profitabel nach Kosten (Barber, Lee, Liu, Odean).</p></div></div></div>
 ${SH("Werkzeuge")}
 <div class="tools r">${[["#/analyse","scan","Analyse"],["#/rechner","calc","Rechner"],["#/strategien","strat","Ranking"],["#/glossar","book","Glossar"]].map(t=>`<a class="tool" href="${t[0]}"><span class="press">${I[t[1]]}</span>${t[2]}</a>`).join("")}</div>
 ${standalone?"":`<div class="hint r">${I.phone}<div><b>Als App installieren</b><span>Safari → Teilen → „Zum Home-Bildschirm“</span></div></div>`}
 <p class="disclaimer">Keine Anlageberatung. Alle Inhalte dienen nur der Bildung. Trading mit Hebel kann zum Totalverlust deines Einsatzes führen.</p>`}};

/* Lernen */
function chapters(){const chs=[];LESSONS.forEach((l,i)=>{let c=chs.find(x=>x.ch===l.ch);if(!c)chs.push(c={ch:l.ch,ls:[]});c.ls.push(Object.assign({idx:i+1},l))});return chs}
V.lernen=()=>{const d=doneSet(),N=LESSONS.length,nx=(nextLesson(d)||{}).id;
 let h=`${EB("Lernen","a","margin-top:6px")}${TT("Dein","Lernpfad")}<p class="lead r">Von null bis zum eigenen System. Tippe auf den Kreis, um eine Lektion abzuhaken – erneut tippen setzt sie zurück.</p>
 <section class="bandA r" style="margin-top:8px"><div class="row" style="align-items:flex-end;justify-content:space-between"><div class="bignum sm"><span id="ov_n" data-count="${d.size}">0</span><sup>/${N}</sup></div><div class="bn-pct"><span id="ov_p" data-count="${Math.round(d.size/N*100)}" data-suf=" %">0 %</span></div></div>
 <div class="bn-sub" id="ov_t">${d.size===N?"Alles geschafft. Stark.":d.size?`Noch ${N-d.size} Lektionen bis zum Ziel.`:"Starte mit Kapitel 1."}</div><div class="pb" style="margin-top:14px"><i id="ov_pb" data-w="${d.size/N*100}"></i></div></section>
 ${trainTeaser("Lernpfad &amp; Karteikarten","Im Duolingo-Stil üben – mit Serie und Tagesziel.","#/training")}
 <a class="feat press r" href="#/kerzen"><div class="w">${candleSVG(CANDLES.find(p=>p.id==="bullengulf"))}</div><div class="b"><div class="eb a">Nachschlagen</div><h2>Kerzen-Lexikon</h2><p>Anatomie, ${CANDLES.length} Kerzenmuster und ${CHARTPATTERNS.length} Formationen – jedes mit Einstieg, Stop und Ziel im Chart.</p></div></a>`;
 chapters().forEach((c,ci)=>{const p=chParts(c.ch);const n=c.ls.filter(l=>d.has(l.id)).length;
  h+=`<section class="chapter" data-ch="${ci}"><div class="ch-head r"><div><div class="eb">Kapitel ${esc(p.num)}</div><div class="ch-t">${esc(p.title)}</div></div><div class="ch-c ${n===c.ls.length?"full":""}"><span class="cn">${n}</span> / ${c.ls.length}</div></div>
  <div class="pb thin r"><i data-w="${n/c.ls.length*100}"></i></div>
  <div class="lpath">${c.ls.map(l=>{const dn=d.has(l.id);return `<div class="lrow r ${dn?"done":""}" data-row="${l.id}"><button class="node ${dn?"on":l.id===nx?"next":""}" data-tg="${l.id}" aria-label="Erledigt umschalten"><span>${l.idx}</span><span class="ck">${I.check}</span></button>
   <a class="tx-link" href="#/lernen/${l.id}"><div class="tx"><div class="t1">${esc(l.title)}</div><div class="t2">${esc(l.sub)} · ${l.min} Min.</div></div>${I.chev}</a></div>`}).join("")}</div></section>`});
 return{title:"Lernen",html:h,after(v){$$("[data-tg]",v).forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();const on=toggleDone(b.dataset.tg);refreshLearn(v);b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop");if(on)burst(b,8);toast(on?"Lektion abgehakt":"Lektion zurückgesetzt")})}}};
function refreshLearn(v){const d=doneSet(),N=LESSONS.length,nx=(nextLesson(d)||{}).id;
 $$("[data-row]",v).forEach(r=>{const id=r.dataset.row,dn=d.has(id);r.classList.toggle("done",dn);const b=$(".node",r);b.classList.toggle("on",dn);b.classList.toggle("next",!dn&&id===nx)});
 chapters().forEach((c,ci)=>{const s=$(`[data-ch="${ci}"]`,v);if(!s)return;const n=c.ls.filter(l=>d.has(l.id)).length;$(".cn",s).textContent=n;$(".ch-c",s).classList.toggle("full",n===c.ls.length);$(".pb i",s).style.width=n/c.ls.length*100+"%"});
 const on=$("#ov_n",v);if(on){on.dataset.from=on.textContent;on.dataset.count=d.size;countUp(on)}const pb=$("#ov_pb",v);if(pb)pb.style.width=d.size/N*100+"%";
 const op=$("#ov_p",v);if(op){op.dataset.from=parseInt(op.textContent)||0;op.dataset.count=Math.round(d.size/N*100);countUp(op)}
 const t=$("#ov_t",v);if(t)t.textContent=d.size===N?"Alles geschafft. Stark.":d.size?`Noch ${N-d.size} Lektionen bis zum Ziel.`:"Starte mit Kapitel 1."}
V.lesson=(id)=>{const i=LESSONS.findIndex(l=>l.id===id),l=LESSONS[i];if(!l)return V.lernen();const nx=LESSONS[i+1];const p=chParts(l.ch);
 const btn=dn=>dn?`${I.check}<span>Erledigt</span><span class="soft">· erneut tippen setzt zurück</span>`:`Als erledigt markieren`;
 return{title:l.title,html:`${EB(`Kapitel ${esc(p.num)} · ${esc(p.title)}`,"a","margin-top:6px")}<h1 class="lt r" style="font-size:40px;line-height:42px">${esc(l.title)}</h1><p class="lead r">${esc(l.sub)}</p>
 <div class="metaA r"><div><span class="eb">Lektion</span><b>${i+1}<span>/${LESSONS.length}</span></b></div><div><span class="eb">Lesezeit</span><b>${l.min}<span> Min.</span></b></div><div><span class="eb">Status</span><b id="l_st" class="${doneSet().has(l.id)?"pos":""}">${doneSet().has(l.id)?"Erledigt":"Offen"}</b></div></div>
 <article class="lesson r">${l.html}</article>
 <button class="btn ${doneSet().has(l.id)?"sec":""} r" data-done="${l.id}">${btn(doneSet().has(l.id))}</button>
 ${nx?`${SH("Nächste Lektion")}<a class="nextL press r" href="#/lernen/${nx.id}"><div class="ic">${lico(nx)}</div><div style="flex:1;min-width:0"><b>${esc(nx.title)}</b><span>${esc(nx.sub)} · ${nx.min} Min.</span></div><span class="arr">${ARW}</span></a>`:""}`,
 after(v){const b=$("[data-done]",v);b.onclick=()=>{const on=toggleDone(l.id);b.className="btn "+(on?"sec":"");b.innerHTML=btn(on);const s=$("#l_st",v);s.textContent=on?"Erledigt":"Offen";s.classList.toggle("pos",on);if(on)burst(b,12);b.animate&&!reduce&&b.animate([{transform:"scale(.96)"},{transform:"scale(1.02)"},{transform:"scale(1)"}],{duration:380,easing:"cubic-bezier(.34,1.45,.64,1)"});toast(on?"Lektion abgehakt":"Lektion zurückgesetzt")}}}};

/* Kerzen-Lexikon */
const kState={dir:"all",n:"all"};
const seg=(items,cur,attr)=>`<div class="seg">${items.map(s=>`<button class="${s[0]===cur?"on":""}" ${attr}="${s[0]}">${s[1]}</button>`).join("")}</div>`;
V.kerzen=(sub)=>{sub=sub||"basics";
 let h=`${EB("Kerzen &amp; Formationen","a","margin-top:6px")}${TT("Das","Lexikon")}<p class="lead r">Was eine Kerze dir verrät – mit Zeichnung, Einstieg, Stop und Ziel.</p>
 <div class="r">${seg([["basics","Grundlagen"],["muster","Kerzen"],["chart","Formationen"],["quiz","Quiz"]],sub,"data-sub")}</div><div id="ksub">`;
 if(sub==="basics")h+=kBasics();if(sub==="muster")h+=kMuster();if(sub==="chart")h+=kChart();if(sub==="quiz")h+=`${trainTeaser("Karteikarten","Muster erkennen, Namen tippen, Richtung raten – mit Spaced Repetition.","#/karten")}${SH("Schnell-Quiz")}<div id="quiz"></div>`;
 h+="</div>";
 return{title:"Lexikon",html:h,after(v){$$("[data-sub]",v).forEach(b=>b.onclick=()=>{history.replaceState(null,"","#/kerzen/"+b.dataset.sub);render(true)});
  $$("[data-fd]",v).forEach(b=>b.onclick=()=>{kState.dir=b.dataset.fd;render(true)});$$("[data-fn]",v).forEach(b=>b.onclick=()=>{kState.n=kState.n===b.dataset.fn?"all":b.dataset.fn;render(true)});
  if(sub==="quiz")quiz($("#quiz",v));$$("[data-goall]",v).forEach(b=>b.onclick=()=>{kState.dir="all";kState.n="all";history.replaceState(null,"","#/kerzen/muster");render(true);const cv=$(".view.current");if(cv)cv.scrollTo({top:0,behavior:reduce?"auto":"smooth"})})}}};
function kBasics(){return `
<div class="feat r"><div class="w" style="padding:14px 12px 4px">${ANATOMY}</div><div class="b"><div class="eb a">Anatomie</div><h2>Eine Kerze, vier Preise</h2><p>Eine Kerze fasst einen Zeitraum zusammen – im H1-Chart eine Stunde, im D1-Chart einen Tag.</p></div></div>
<div class="ohlc r">${[["O","Open","erster Kurs im Zeitraum"],["H","High","Spitze des oberen Dochts"],["L","Low","Ende des unteren Dochts"],["C","Close","letzter Kurs – der wichtigste"]].map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span><p>${x[2]}</p></div>`).join("")}</div>
<article class="lesson r"><p><b>Grün (bullisch):</b> Schluss über Eröffnung – die Eröffnung ist unten am Körper. <b>Rot (bärisch):</b> Schluss unter Eröffnung – die Eröffnung ist oben. In MT5 kannst du die Farben in den Chart-Einstellungen ändern.</p></article>
${SH("Kerzen lesen wie ein Profi")}
<div class="readg">${[["Großer Körper, kleine Dochte","Eine Seite hat klar gewonnen (Momentum)."],["Kleiner Körper","Unentschlossenheit, Kraft lässt nach."],["Langer unterer Docht","Verkäufer wurden zurückgeschlagen – bullisches Zeichen an Support."],["Langer oberer Docht","Käufer wurden abgewiesen – bärisches Zeichen am Widerstand."],["Kerzen werden kleiner","Der Trend ermüdet."],["Größte Kerze seit Tagen","Wichtige Info, News oder Ausbruch."]].map(x=>`<div class="r"><b>${x[0]}</b><p>${x[1]}</p></div>`).join("")}</div>
<div class="quoteT r"><div class="eb a">Zeitrahmen verschmelzen</div><p>Vier M15-Kerzen ergeben eine H1-Kerze. Ein „Hammer“ im H1 kann im M15 ein Absturz mit Erholung sein. Je größer der Zeitrahmen, desto aussagekräftiger die Kerze.</p></div>
${SH("Die 6 goldenen Regeln")}
<ol class="numl">${[["Kontext schlägt Muster.","Ein Muster zählt nur an einer wichtigen Zone und nach einer Bewegung."],["Kerzenschluss abwarten.","Bis zum Schluss kann sich alles ändern."],["Bestätigung nutzen.","Die Folgekerze sollte in die erwartete Richtung schließen."],["Mit dem Trend","sind Muster deutlich zuverlässiger als dagegen."],["H1 und größer.","Auf M1/M5 sind Kerzenmuster großteils Rauschen."],["Stop hinter den Docht","– das Muster ist falsch, wenn der Docht gebrochen wird."]].map((x,i)=>`<li class="r"><span>${String(i+1).padStart(2,"0")}</span><div><b>${x[0]}</b> ${x[1]}</div></li>`).join("")}</ol>
${SH("Was die Forschung sagt")}
<article class="lesson r"><p>Thomas Bulkowski hat 103 Kerzenmuster an Millionen Kerzen US-amerikanischer Aktien getestet. Bei jedem Muster findest du zwei Werte: <b>Prozent</b> – wie oft der Kurs danach in die erwartete Richtung ausbrach – und <b>Rang x/103</b> – Gesamt-Performance inkl. Größe der Bewegung (1 = am besten).</p>
<div class="warn"><b>Wichtig</b>Viele berühmte Muster liegen nahe 50 % – also Münzwurf. Manche Lehrbuch-Muster laufen sogar meist in die <i>Gegenrichtung</i> (z. B. Inverted Hammer, Hanging Man). Die Daten stammen von Aktien, nicht von Forex.</div>
<div class="tip"><b>Fazit</b>Kerzen sind ein Werkzeug fürs <b>Timing</b> innerhalb einer Strategie – keine Strategie für sich.</div></article>
<button type="button" class="btn r" data-goall style="width:100%">Alle ${CANDLES.length} Kerzenmuster ansehen</button>`}
function kMuster(){const list=CANDLES.filter(p=>(kState.dir==="all"||p.dir===kState.dir)&&(kState.n==="all"||(kState.n==="3"?p.n>=3:p.n===+kState.n)));
 const fd=(v,l)=>`<button class="fchip ${kState.dir===v?"on":""}" data-fd="${v}">${l}</button>`,fn=(v,l)=>`<button class="fchip ${kState.n===v?"on":""}" data-fn="${v}">${l}</button>`;
 const all=kState.dir==="all"&&kState.n==="all";const fe=CANDLES.find(p=>p.id===["morningstar","bullengulf","eveningstar","hammer","3soldiers","shootingstar","piercing"][new Date().getDay()]);const b=bkP(fe);
 return `<div class="filters r">${fd("all","Alle")}${fd("bull","Bullisch")}${fd("bear","Bärisch")}${fd("neutral","Neutral")}<span class="fsep"></span>${fn("1","1 Kerze")}${fn("2","2 Kerzen")}${fn("3","3+ Kerzen")}</div>
 ${all?`<a class="feat press r" href="#/kerze/${fe.id}"><div class="w">${candleSVG(fe)}</div><div class="b"><div class="eb a">Muster des Tages</div><h2>${esc(fe.name)}</h2><p>${esc(fe.what)}</p>${b.pct?`<div class="meter"><span class="eb">Trefferquote</span><div class="m">${Array.from({length:10},(_,i)=>`<i class="${i<Math.round(b.pct/10)?"on":""}"></i>`).join("")}</div><b>${b.pct} %</b></div>`:""}</div></a>`:""}
 <div class="cnt r">${list.length} Muster</div>
 <div class="bg2">${list.map((p,i)=>i%5===0?`<a class="mini wide press r" href="#/kerze/${p.id}"><div class="w">${candleSVG(p)}</div><div><div class="nm">${esc(p.name)}</div><div class="mt">${TG(p.dir)}<span>${nTxt(p.n)}</span></div><p>${esc(p.what.split(". ")[0])}.</p></div></a>`
  :`<a class="mini press r" href="#/kerze/${p.id}"><div class="w">${candleSVG(p)}</div><div class="nm">${esc(p.name)}</div><div class="mt">${TG(p.dir)}<span>${nTxt(p.n)}</span></div></a>`).join("")}</div>`}
function kChart(){return `<p class="lead r" style="margin-top:4px">Größere Formationen aus vielen Kerzen. Sie gelten erst nach dem <b>Ausbruch mit Kerzenschluss</b>.</p>
 <div class="bg2">${CHARTPATTERNS.map((p,i)=>i%3===0?`<a class="mini wide f press r" href="#/formation/${p.id}"><div class="w">${chartSVG(p)}</div><div><div class="nm">${esc(p.name)}</div><div class="mt">${TG(p.dir)}</div><p>${esc(p.what.split(". ")[0])}.</p></div></a>`:`<a class="mini press r" href="#/formation/${p.id}"><div class="w">${chartSVG(p)}</div><div class="nm">${esc(p.name)}</div><div class="mt">${TG(p.dir)}</div></a>`).join("")}</div>`}
function quiz(el){const st=LS.get("quiz",{r:0,t:0,best:0,streak:0});
 const pool=CANDLES;const q=pool[Math.floor(Math.random()*pool.length)];const opts=[q];while(opts.length<4){const o=pool[Math.floor(Math.random()*pool.length)];if(!opts.includes(o))opts.push(o)}opts.sort(()=>Math.random()-.5);
 el.innerHTML=`<div class="fadein"><div class="qstats"><div><span class="eb">Richtig</span><b>${st.r}<span>/${st.t}</span></b></div><div><span class="eb">Serie</span><b class="${st.streak?"acc-t":""}">${st.streak}</b></div><div><span class="eb">Rekord</span><b>${st.best}</b></div></div>
 <div class="tile" style="padding:14px"><div class="w well">${candleSVG(q)}</div><h3 style="margin:14px 4px 4px">Welches Muster ist markiert?</h3>${opts.map(o=>`<button class="quiz-opt" data-q="${o.id}">${esc(o.name)}</button>`).join("")}<div id="qfb"></div></div></div>`;
 $$("[data-q]",el).forEach(b=>b.onclick=()=>{if(el.dataset.ans)return;el.dataset.ans=1;const ok=b.dataset.q===q.id;st.t++;if(ok){st.r++;st.streak++;st.best=Math.max(st.best,st.streak)}else st.streak=0;LS.set("quiz",st);
  $$("[data-q]",el).forEach(x=>{if(x.dataset.q===q.id)x.classList.add("ok");else if(x===b)x.classList.add("no")});
  if(ok)burst(b);$("#qfb",el).innerHTML=`<div class="${ok?"good":"warn"} fadein"><b>${ok?"Richtig":"Leider falsch"}</b>${esc(q.name)}: ${esc(q.what)}</div><div class="btn-row"><a class="btn sec" href="#/kerze/${q.id}">Details</a><button class="btn" id="qnext">Nächste Frage</button></div>`;
  $("#qnext",el).onclick=()=>{delete el.dataset.ans;quiz(el)}});goSvg(el,80)}
const ctxTxt=c=>c==="down"?"nach Abwärtstrend":c==="up"?"nach Aufwärtstrend":"aus Seitwärtsphase";
const planSec=(p,neutral,tl)=>`${SH("Der Trade-Plan")}<p class="lead r" style="margin-top:-4px">Tippe auf eine Zeile – das Level erscheint oben im Chart.${neutral?" Neutral: Die Richtung entscheidet der Ausbruch – wähle Long oder Short.":""}</p>
 <div class="planL r">${planRow("entry","enter","Einstieg",p.entry)}${planRow("stop","shield","Stop-Loss",p.stop)}${planRow("target","target",tl||"Ziel",p.target)}</div>`;
V.kerze=(id)=>{const i=CANDLES.findIndex(p=>p.id===id),p=CANDLES[i];if(!p)return V.kerzen("muster");const nx=CANDLES[(i+1)%CANDLES.length];const G=candleGeo(p,true),dd=planDefault(p),neutral=planDirs(p).length>1;const b=bkP(p);
 const rr=G.draw[dd]?G.draw[dd].rr:0;
 return{title:p.name,html:`${EB(`${nTxt(p.n)} · ${ctxTxt(p.ctx)}`,"a","margin-top:6px")}<h1 class="lt r dt">${esc(p.name)}</h1><div class="tagl r">${TG(p.dir)}${p.en&&p.en!==p.name?`<span>${esc(p.en)}</span>`:""}</div>
 ${b.pct?`<div class="price r"><span class="v"><span data-count="${b.pct}">0</span> %</span><span class="c ${p.dir==="bear"?"dn":p.dir==="bull"?"up":""}">${esc((p.bk.split(" · ")[0]||"").replace(/^\d+\s*%\s*/,""))}</span></div><div class="eb" style="margin-top:6px">Trefferquote · Bulkowski, US-Aktien</div>`:`<p class="lead r" style="margin-top:14px">${esc(p.bk||"")}</p>`}
 <div class="plan-card bleed r">${G.svg}</div><div class="r">${planBar(p,dd)}</div>
 <div class="kv r bleed"><div><span class="eb">R:R</span><b>1 : ${fmtN(rr,1)}</b></div><div><span class="eb">Rang</span><b>${b.rank?`${b.rank}<span>/${b.of}</span>`:"–"}</b></div><div><span class="eb">Kerzen</span><b>${p.n}</b></div></div>
 ${planSec(p,neutral)}
 <div class="art">${[["Erkennen",p.what],["Wo es auftreten muss",p.where],["Bestätigung",p.confirm],["Häufige Fehler",p.mistakes]].map((x,j)=>`<h3 class="r"><em>0${j+1}</em>${x[0]}</h3><p class="r">${esc(x[1])}</p>`).join("")}</div>
 <a class="nextL press r" href="#/kerze/${nx.id}"><div class="th">${candleSVG(nx)}</div><div style="flex:1;min-width:0"><span class="eb">Nächstes Muster</span><b>${esc(nx.name)}</b></div><span class="arr">${ARW}</span></a>`,after(v){planCtl(v,G,dd)}}};
V.formation=(id)=>{const i=CHARTPATTERNS.findIndex(x=>x.id===id),p=CHARTPATTERNS[i];if(!p)return V.kerzen("chart");const nx=CHARTPATTERNS[(i+1)%CHARTPATTERNS.length];const G=chartGeo(p,true),dd=planDefault(p),neutral=planDirs(p).length>1;const rr=G.draw[dd]?G.draw[dd].rr:0;
 return{title:p.name,html:`${EB("Chartformation","a","margin-top:6px")}<h1 class="lt r dt">${esc(p.name)}</h1><div class="tagl r">${TG(p.dir)}<span>gilt erst nach Ausbruch</span></div>
 <div class="plan-card bleed r" style="margin-top:18px">${G.svg}</div><div class="r">${planBar(p,dd)}</div>
 <div class="kv r bleed"><div><span class="eb">R:R</span><b>1 : ${fmtN(rr,1)}</b></div><div><span class="eb">Richtung</span><b>${p.dir==="bull"?"Long":p.dir==="bear"?"Short":"Beide"}</b></div><div><span class="eb">Typ</span><b>${p.dir==="neutral"?"Fortsetz.":"Umkehr"}</b></div></div>
 ${planSec(p,neutral,"Kursziel")}
 <div class="art"><h3 class="r"><em>01</em>Was du siehst</h3><p class="r">${esc(p.what)}</p><h3 class="r"><em>02</em>Einordnung</h3><p class="r">${esc(p.note)}</p></div>
 <a class="nextL press r" href="#/formation/${nx.id}"><div class="th">${chartSVG(nx)}</div><div style="flex:1;min-width:0"><span class="eb">Nächste Formation</span><b>${esc(nx.name)}</b></div><span class="arr">${ARW}</span></a>`,after(v){planCtl(v,G,dd)}}};

/* Strategien */
let sSort="total";
V.strategien=()=>{const key={total:score,P:s=>s.P,E:s=>s.E,A:s=>s.A}[sSort];const list=STRATEGIES.slice().sort((a,b)=>key(b)-key(a)||score(b)-score(a));
 const lab={total:"Score",P:"Beliebtheit",E:"Evidenz",A:"Anfänger"}[sSort],tot=sSort==="total";const val=s=>tot?score(s):key(s);const num=s=>`<span data-count="${val(s)}" data-dec="${Number.isInteger(val(s))?0:1}">0</span>`;
 const [a,b,c]=list,rest=list.slice(3);
 return{title:"Strategien",html:`${EB("Strategien","a","margin-top:6px")}${TT("Das ehrliche","Ranking")}<p class="lead r">Wie beliebt ist sie, was sagen Studien und Tests – und passt sie zu dir als Anfänger?</p>
 <div class="r">${seg([["total","Gesamt"],["P","Beliebtheit"],["E","Evidenz"],["A","Anfänger"]],sSort,"data-sort")}</div>
 <a class="champ press r" href="#/strategie/${a.id}"><div class="row" style="justify-content:space-between;align-items:flex-start"><div class="eb a">Platz 1 · ${esc(lab)}</div><span class="arr">${ARW}</span></div>
  <div class="champ-n">${num(a)}<sup>${tot?"/100":"/5"}</sup></div><h2>${esc(a.name)}</h2><div class="meta">${esc(a.tf)} · ${esc(a.market)}</div>
  <div class="bars">${[["Beliebtheit",a.P],["Evidenz",a.E],["Anfänger",a.A]].map(x=>`<span>${x[0]}</span>${bar(x[1],5,"acc")}<span class="v">${fmtN(x[1],1).replace(",0","")}</span>`).join("")}</div></a>
 <div class="duo">${[b,c].map((s,i)=>`<a class="tile press r" href="#/strategie/${s.id}"><div class="eb">Platz ${i+2}</div><div class="bn">${num(s)}</div><b>${esc(s.short)}</b><span>${esc(s.tf)}</span></a>`).join("")}</div>
 <div class="rank r">${rest.map((s,i)=>`<a href="#/strategie/${s.id}" class="rrow r"><span class="rk">${String(i+4).padStart(2,"0")}</span><div class="tx"><b>${esc(s.short)}</b>${bar(val(s),tot?100:5,"mono")}</div><span class="sc">${num(s)}</span>${I.chev}</a>`).join("")}</div>
 <div class="quoteT r"><div class="eb a">So bewerten wir</div><p>Gesamt = 30 % Beliebtheit + 40 % Evidenz (Studien, unabhängige Backtests) + 30 % Anfängertauglichkeit. Keine Strategie garantiert Gewinn.</p></div>
 ${SH("Finger weg")}<div class="avoid">${AVOID.map(x=>`<div class="r"><span class="xx">${I.x}</span><div><b>${esc(x[1])}</b><p>${esc(x[2])}</p></div></div>`).join("")}</div>
 <p class="disclaimer">Bewertung = Einordnung aus Recherche (Links unter „Quellen“), keine Anlageberatung.</p>`,
 after(v){$$("[data-sort]",v).forEach(x=>x.onclick=()=>{sSort=x.dataset.sort;render(true)})}}};
V.strategie=(id)=>{const s=STRATEGIES.find(x=>x.id===id);if(!s)return V.strategien();const rank=STRATEGIES.slice().sort((a,b)=>score(b)-score(a)).indexOf(s)+1;
 return{title:s.short,html:`${EB(`Platz ${rank} von ${STRATEGIES.length}`,"a","margin-top:6px")}<h1 class="lt r" style="font-size:40px;line-height:42px">${esc(s.name)}</h1><div class="tagl r">${s.tags.map(t=>`<span class="tag n">${esc(t)}</span>`).join("")}</div>
 <section class="bandA r"><div class="eb">Gesamt-Score</div><div class="bignum"><span data-count="${score(s)}">0</span><sup>/100</sup></div>
  <div class="bars" style="margin-top:18px">${[["Beliebtheit",s.P],["Evidenz",s.E],["Anfänger",s.A]].map(x=>`<span>${x[0]}</span>${bar(x[1],5,"acc")}<span class="v" data-count="${x[1]}" data-dec="${Number.isInteger(x[1])?0:1}">0</span>`).join("")}</div></section>
 <div class="kvl r">${[["Zeitrahmen",s.tf],["Märkte",s.market],["Beste Zeit",s.time]].map(x=>`<div><span class="eb">${x[0]}</span><b>${esc(x[1])}</b></div>`).join("")}</div>
 <div class="art"><h3 class="r"><em>01</em>So funktioniert's</h3><p class="r">${esc(s.how)}</p>
 <h3 class="r"><em>02</em>Einstieg</h3><ol class="numl sm">${s.entry.map((x,i)=>`<li class="r"><span>${i+1}</span><div>${esc(x)}</div></li>`).join("")}</ol>
 <h3 class="r"><em>03</em>Ausstieg</h3><ol class="numl sm">${s.exit.map((x,i)=>`<li class="r"><span>${i+1}</span><div>${esc(x)}</div></li>`).join("")}</ol></div>
 <div class="procon"><div class="tile r"><span class="tag up">Anhänger sagen</span><p>${esc(s.pro)}</p></div><div class="tile r"><span class="tag dn">Kritiker sagen</span><p>${esc(s.con)}</p></div></div>
 <div class="tile r" style="margin-top:10px"><span class="tag n">Evidenz</span><p class="tp">${esc(s.evidence)}</p></div>
 <div class="quoteT r"><div class="eb a">Unser Fazit</div><p>${esc(s.verdict)}</p></div>
 ${SH("So testest du sie")}<ol class="numl">${["Regeln oben 1:1 abschreiben.","50 Trades im Chart zurückscrollen und durchspielen (Backtest).","4–8 Wochen auf dem Demo-Konto, 1 % Risiko.","Journal auswerten: Trefferquote, Ø R, max. Drawdown."].map((x,i)=>`<li class="r"><span>0${i+1}</span><div>${x}</div></li>`).join("")}</ol>`}};

/* Timing */
V.timing=()=>{const m=marketNow();
 const best=[["EURUSD · GBPUSD","9–12 & 14–18","London-Open & Overlap: meiste Liquidität, engste Spreads"],["USDJPY · AUDUSD","1–9 & 14–17","Asien-Session plus US-Daten"],["GER40 (DAX)","9–11 & 15:30–17:30","Xetra- und US-Eröffnung"],["NAS100 · US500","15:30–17:30 & 21–22","US-Eröffnung und letzte Stunde"],["XAUUSD (Gold)","9–11 & 14:30–18","London plus US-Daten"]];
 return{title:"Timing",html:`${EB("Timing · Berlin","a","margin-top:6px")}<div class="clockA r" data-clock>${berlinHM(m.now)}</div><p class="mkline r"><span class="dot ${m.open.length?"on":""}"></span>${esc(m.label)}</p>
 ${SH("Sessions heute")}<div class="sessA r" id="tl"></div>
 <div class="sessL">${SESS.map(s=>{const o=sessOpen(s,m.now);const ch=nextChange(t=>sessOpen(s,t),m.now);return `<div class="r"><span class="dot ${o?"on":""}"></span><b>${s.n}</b><span class="soft">${o?"schließt":"öffnet"} ${ch?`${berlinDay(ch)} ${berlinHM(ch)}`:""}</span><span class="in">${ch?"in "+dur(ch-m.now):""}</span></div>`}).join("")}</div>
 ${SH("Beste Zeiten nach Markt")}<div class="hscroll car bleed">${best.map(b=>`<div class="bt r"><div class="eb">${b[0]}</div><div class="bt-t">${b[1].replace("&","&amp;")}<small> Uhr</small></div><p>${b[2]}</p></div>`).join("")}</div>
 <p class="lead r" style="margin-top:12px">Die US-Börse eröffnet meist um 15:30 Uhr deutscher Zeit; ein paar Wochen im März und Ende Oktober schon um 14:30, weil die USA die Uhr an anderen Tagen umstellen.</p>
 ${SH("Wochentage")}<div class="days">${[["Mo","Oft ruhiger Start, Gaps vom Wochenende möglich. Erst Struktur beobachten."],["Di–Do","Meist die aktivsten Tage mit den saubersten Bewegungen."],["Mi","Dreifacher Swap über Nacht; Fed-Entscheide meist mittwochs 20:00."],["Fr","Vormittags gut; 1. Freitag im Monat NFP (14:30); ab ca. 19 Uhr dünner Markt."],["Sa/So","Forex geschlossen. Öffnet Sonntag ca. 23 Uhr mit breiten Spreads."]].map(x=>`<div class="r"><b>${x[0]}</b><p>${x[1]}</p></div>`).join("")}</div>
 ${SH("Meiden")}<div class="avoid">${[["22:45–00:30 Uhr","Tageswechsel/Rollover – Spreads sehr breit."],["±15 Min. um High-Impact-News","14:30 US-Daten, 20:00 Fed, 14:15 EZB."],["Feiertage","Weihnachten, US-Feiertage: wenig Liquidität."],["Asien-Session bei EUR/GBP","Oft Seitwärts-Gezappel."]].map(x=>`<div class="r"><span class="xx">${I.alert}</span><div><b>${x[0]}</b><p>${x[1]}</p></div></div>`).join("")}</div>
 <a class="btn sec r" href="#/lernen/news">News-Termine &amp; Wirtschaftskalender</a>`,
 after(v){timeline($("#tl",v))}}};
function timeline(el){if(!el)return;const now=new Date();const bp=parts(now,"Europe/Berlin");let start=new Date(now.getTime()-(bp.h*60+bp.m)*60000-now.getSeconds()*1000);let note="";
 for(let k=0;k<3&&!Array.from({length:96},(_,i)=>new Date(start.getTime()+i*15*60000)).some(fxOpen);k++){start=new Date(start.getTime()+864e5);note="Heute geschlossen – Anzeige für "+start.toLocaleDateString("de-DE",{timeZone:"Europe/Berlin",weekday:"long"})}
 let h="";SESS.forEach((s,si)=>{const live=sessOpen(s,now);let segs="",run=-1;for(let i=0;i<=96;i++){const o=i<96&&sessOpen(s,new Date(start.getTime()+i*15*60000));if(o&&run<0)run=i;if(!o&&run>=0){segs+=`<div class="tl-seg ${live?"on":""}" style="left:${run/96*100}%;width:${(i-run)/96*100}%"></div>`;run=-1}}
  h+=`<div class="tl-row" style="--r:${si}"><span>${s.f}</span><div class="tl-track">${segs}</div></div>`});
 const nowPct=(now-start)/864e5;
 el.innerHTML=`<div class="timeline">${h}${nowPct>=0&&nowPct<=1?`<div class="tl-now" style="left:calc(52px + (100% - 52px) * ${nowPct})"></div>`:""}</div><div class="tl-axis"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>${note?`<p class="lead">${note}</p>`:""}`}

/* Rechner */
let rTab="lots";
V.rechner=()=>{const c=LS.get("calc",{bal:1000,risk:1,sl:20,inst:"EURUSD",eurusd:1.16,pv:1,entry:"",stop:"",tp:""});let body="";
 const F=(lab,id,val,ex)=>`<label class="frm" ${ex||""}><span>${lab}</span><input class="input" inputmode="decimal" id="${id}" value="${val}"></label>`;
 if(rTab==="lots")body=`<div class="calcR r"><div class="eb a">Positionsgröße</div><div class="cr-n" id="o_lots">–</div><p id="o_info"></p></div>
 <div class="frms r">${F("Kontogröße (€)","c_bal",c.bal)}${F("Risiko pro Trade (%)","c_risk",c.risk)}
 <label class="frm"><span>Markt</span><select class="input" id="c_inst">${["EURUSD","GBPUSD","AUDUSD","NZDUSD","USDJPY","XAUUSD","Index/Andere"].map(x=>`<option ${x===c.inst?"selected":""}>${x}</option>`).join("")}</select></label>
 <label class="frm"><span id="l_sl">Stop-Abstand</span><input class="input" inputmode="decimal" id="c_sl" value="${c.sl}"></label>
 <label class="frm" id="f_eu"><span>EUR/USD-Kurs (MT5)</span><input class="input" inputmode="decimal" id="c_eu" value="${c.eurusd}"></label>
 <label class="frm" id="f_jpy" style="display:none"><span>USD/JPY-Kurs</span><input class="input" inputmode="decimal" id="c_jpy" value="${c.usdjpy||150}"></label>
 <label class="frm" id="f_pv" style="display:none"><span>€ pro Punkt bei 1 Lot</span><input class="input" inputmode="decimal" id="c_pv" value="${c.pv}"></label></div>
 <p class="lead r">Rundung immer <b>abwärts</b> auf 0,01 Lot. Pip-Werte sind Näherungen (Standard-Kontraktgrößen) – prüfe sie in MT5 unter Spezifikation.</p>`;
 if(rTab==="crv")body=`<div class="calcR r"><div class="eb a">Chance-Risiko-Verhältnis</div><div class="cr-n" id="o_crv">–</div><p id="o_crv2"></p></div>
 <div class="frms r"><label class="frm"><span>Einstieg</span><input class="input" inputmode="decimal" id="c_e" value="${esc(c.entry)}" placeholder="1.16250"></label><label class="frm"><span>Stop-Loss</span><input class="input" inputmode="decimal" id="c_s" value="${esc(c.stop)}" placeholder="1.16000"></label><label class="frm"><span>Take-Profit</span><input class="input" inputmode="decimal" id="c_t" value="${esc(c.tp)}" placeholder="1.16750"></label></div>`;
 if(rTab==="dd")body=`<div class="calcR two r"><div><div class="eb a">Erwartung / Trade</div><div class="cr-n sm" id="o_ev">–</div></div><div><div class="eb">Nach 100 Trades</div><div class="cr-n sm" id="o_100">–</div></div></div>
 <div class="frms r">${F("Trefferquote (%)","c_w",c.w||45)}${F("Ø Gewinn in R","c_r",c.r||2)}${F("Risiko pro Trade (%)","c_rr",c.rr||1)}</div><p class="lead r" id="o_ls"></p>`;
 return{title:"Rechner",html:`${EB("Werkzeug","a","margin-top:6px")}${TT("Risiko zuerst,","dann Lots")}<div class="r">${seg([["lots","Positionsgröße"],["crv","CRV"],["dd","Erwartung"]],rTab,"data-rt")}</div><div class="fadein">${body}</div>`,
 after:RECHNER_AFTER}};
V.glossar=()=>{const L={};GLOSSAR.forEach(g=>{const k=g[0][0].toUpperCase().replace(/[^A-ZÄÖÜ]/,"#");(L[k]=L[k]||[]).push(g)});
 return{title:"Glossar",html:`${EB("Nachschlagen","a","margin-top:6px")}${TT("Das","Glossar")}<p class="lead r">${GLOSSAR.length} Begriffe, einfach erklärt.</p>
 <div class="sbar"><div class="search">${I.search.replace("<svg","<svg width='18' height='18'")}<input id="gq" placeholder="Begriff suchen" autocomplete="off"></div></div>
 <div id="gl">${Object.keys(L).sort((a,b)=>a.localeCompare(b,"de")).map(k=>`<section class="gls" data-l="${k}"><div class="gl-l r">${k}</div>${L[k].map(g=>`<div class="gl-item r" data-s="${esc((g[0]+" "+g[1]).toLowerCase())}"><b>${esc(g[0])}</b><p>${esc(g[1])}</p></div>`).join("")}</section>`).join("")}</div>`,
 after(v){$("#gq",v).addEventListener("input",e=>{const q=e.target.value.toLowerCase().trim();$$(".gl-item",v).forEach(x=>x.style.display=x.dataset.s.includes(q)?"":"none");$$(".gls",v).forEach(s=>s.style.display=$$(".gl-item",s).some(x=>x.style.display!=="none")?"":"none")})}}};
V.quellen=()=>({title:"Quellen",html:`${EB("Belege","a","margin-top:6px")}${TT("Die","Quellen")}<p class="lead r">Alle Zahlen und Aussagen in der App stammen aus diesen Seiten (Stand November 2026). Tippen öffnet die Seite.</p>
 ${SOURCES.map((g,gi)=>`<div class="srcg"><h3 class="r"><em>${String(gi+1).padStart(2,"0")}</em>${esc(g.g)}</h3>${g.items.map(s=>`<a class="src r" href="${esc(s[1])}" target="_blank" rel="noopener"><div class="tx"><b>${esc(s[0])}</b><span>${esc(s[1].replace(/^https?:\/\/(www\.)?/,"").split("/")[0])}</span></div>${I.chev}</a>`).join("")}</div>`).join("")}`});

/* Akzentfarben */
const ACCENTS=[["amber","Amber","#F2B448","#C98B25","#1D1406"],["blue","Electric","#6F95FF","#4A70E0","#08112E"],["mint","Mint","#5FDDB8","#2FB592","#04261C"],["violet","Violett","#AE93FF","#8265EA","#170B33"],["silver","Silber","#E7E2D8","#B3ACA0","#141210"]];
const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
function applyAccent(id){const a=ACCENTS.find(x=>x[0]===id)||ACCENTS[0];const s=document.documentElement.style;s.setProperty("--acc",a[2]);s.setProperty("--acc2",a[3]);s.setProperty("--acc-ink",a[4]);s.setProperty("--acc-t",hexA(a[2],.14));s.setProperty("--acc-l",hexA(a[2],.32));document.documentElement.dataset.accent=a[0];return a}
applyAccent(LS.get("accent","amber"));
V.einstellungen=()=>{const c=getCfg(),ac=LS.get("accent","amber");return{title:"Einstellungen",html:`${EB("TradeLab","a","margin-top:6px")}${TT("Deine","Einstellungen")}<p class="lead r">Farbe, KI-Zugang für die Chart-Analyse und deine App-Daten.</p>
 ${SH("Akzentfarbe")}
 <div class="accp r" role="radiogroup" aria-label="Akzentfarbe">${ACCENTS.map(a=>`<button class="sw ${a[0]===ac?"on":""}" data-acc="${a[0]}" role="radio" aria-checked="${a[0]===ac}" style="--c:${a[2]};--k:${a[4]}"><i>${I.check}</i><span>${a[1]}</span></button>`).join("")}</div>
 <div class="prev r" aria-hidden="true"><div class="pv-l"><div class="eb a">Vorschau</div><div class="pv-t">Dein <i>Lernpfad</i></div><div class="pv-pb"><i></i></div><div class="pv-b"><span class="pv-btn">Weiter ${ARW}</span><span class="pv-tab">${I.home||I.book}<b>Start</b></span></div></div>
  <div class="pv-r">${ringS(7,10,74)}</div></div>
 <p class="lead r" style="margin-top:10px">Gilt für Buttons, Tab-Leiste, Ringe und Hervorhebungen. Grün und Rot im Chart bleiben immer gleich – sie bedeuten steigend und fallend.</p>
 ${SH("KI für Chart-Analyse")}
 <div class="frms r"><label class="frm"><span>Gemini API-Key</span><input class="input" id="s_k" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(c.key)}" placeholder="AIza…"></label>
 <label class="frm"><span>Modell (optional)</span><input class="input" id="s_m" autocapitalize="off" spellcheck="false" value="${esc(c.model)}" placeholder="${GEM.model}"></label></div>
 <div class="btn-row r"><button class="btn" id="s_save">Speichern</button><button class="btn sec" id="s_test">Testen</button></div><button class="btn danger r" id="s_del">Schlüssel löschen</button>
 <article class="lesson r" style="margin-top:6px"><p><b>Kostenlosen Schlüssel holen – in 3 Schritten.</b></p><ol class="numl"><li><span>01</span><div><b>Öffnen:</b> <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> und mit deinem Google-Konto anmelden.</div></li><li><span>02</span><div><b>Erstellen:</b> „API-Schlüssel erstellen“ tippen (falls gefragt, ein Projekt anlegen). Keine Kreditkarte nötig.</div></li><li><span>03</span><div><b>Einfügen:</b> Schlüssel kopieren (beginnt mit „AIza…“), oben einfügen, Speichern, dann Testen.</div></li></ol><p>Das Modell-Feld kannst du leer lassen – Standard ist <span class="kbd">${GEM.model}</span>. Ist das Tageslimit voll, weicht die App automatisch auf <span class="kbd">${GEM.fallback}</span> aus.</p></article>
 <div class="quoteT r"><div class="eb a">Datenschutz</div><p>Dein Schlüssel wird nur auf diesem iPhone gespeichert und direkt an Google geschickt – an keinen anderen Server. Im kostenlosen Kontingent darf Google Eingaben zur Verbesserung nutzen, lade also keine privaten Daten hoch.</p></div>
 ${SH("Daten")}
 <div class="rows r"><button class="rw" id="s_rp"><span class="ic">${I.reset}</span><b>Lernfortschritt &amp; Quiz zurücksetzen</b></button><button class="rw" id="s_rk"><span class="ic">${I.cards}</span><b>Karteikarten-Fortschritt zurücksetzen</b></button><button class="rw" id="s_ra"><span class="ic">${I.trash}</span><b>Gespeicherte Analyse löschen</b></button></div>
 ${SH("App")}
 <div class="rows r"><div class="rw"><span class="ic">${I.phone}</span><div><b>Installieren</b><span>Safari → Teilen → Zum Home-Bildschirm. Danach auch offline nutzbar (außer KI-Analyse).</span></div></div><div class="rw"><span class="ic">${I.info}</span><div><b>TradeLab 6.1</b><span>Inhalte Stand November 2026 · Keine Anlageberatung</span><span id="s_vh" style="opacity:.6;font-size:12px"></span></div></div></div>`,
 after(v){{const e=$("#s_vh",v),x=window.__vh&&window.__vh();if(e&&x)e.textContent=` · Anzeige ${x.iw}×${x.ih} · Bildschirm ${x.sw}×${x.sh} · ${x.sa?"Home-Bildschirm-App":"Browser"} · Modus ${x.mode} · Safe-Area oben ${(x.sat||"").trim()||"0px"} · html ${x.hh} · Safe-Area unten ${x.sab.trim()||"0px"} · Abstand Tab-Leiste ${x.gap}px`}$$("[data-acc]",v).forEach(b=>b.onclick=()=>{LS.set("accent",b.dataset.acc);applyAccent(b.dataset.acc);$$("[data-acc]",v).forEach(x=>{x.classList.toggle("on",x===b);x.setAttribute("aria-checked",x===b)});
   b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop");const pr=$(".prev",v);pr.classList.remove("flash");void pr.offsetWidth;pr.classList.add("flash");try{navigator.vibrate&&navigator.vibrate(6)}catch(e){}});
  const read=()=>({provider:"gemini",key:$("#s_k",v).value.trim(),model:$("#s_m",v).value.trim()});
  $("#s_save",v).onclick=()=>{LS.set("ai",read());toast("Gespeichert")};
  $("#s_del",v).onclick=()=>{const c=read();c.key="";LS.set("ai",c);$("#s_k",v).value="";toast("Schlüssel gelöscht")};
  $("#s_test",v).onclick=async e=>{const b=e.currentTarget;LS.set("ai",read());b.disabled=true;b.textContent="Teste …";try{const t=await callAI(null,"Antworte nur mit dem Wort OK.",true);toast("Verbindung ok · "+String(t).trim().slice(0,20))}catch(err){toast("Fehler: "+err.message)}b.disabled=false;b.textContent="Testen"};
  $("#s_rp",v).onclick=()=>{if(confirm("Lernfortschritt und Quiz wirklich zurücksetzen?")){LS.del("done");LS.del("quiz");toast("Zurückgesetzt")}};
  $("#s_rk",v).onclick=()=>{if(confirm("Karteikarten, Serie und Tagesziel zurücksetzen?")){["srs","daily","dstreak"].forEach(k=>LS.del(k));toast("Karteikarten zurückgesetzt")}};
  $("#s_ra",v).onclick=()=>{LS.del("last");cur=null;toast("Analyse gelöscht")}}}};

function RECHNER_AFTER(v){const c=LS.get("calc",{bal:1000,risk:1,sl:20,inst:"EURUSD",eurusd:1.16,pv:1,entry:"",stop:"",tp:""});$$("[data-rt]",v).forEach(x=>x.onclick=()=>{rTab=x.dataset.rt;render(true)});const num=id=>{const e=$("#"+id,v);return e?parseFloat(String(e.value).replace(",",".")):NaN};
 const calc=()=>{
  if(rTab==="lots"){const inst=$("#c_inst",v).value;const fx=["EURUSD","GBPUSD","AUDUSD","NZDUSD"].includes(inst);
   $("#f_eu",v).style.display=inst==="Index/Andere"?"none":"";$("#f_jpy",v).style.display=inst==="USDJPY"?"":"none";$("#f_pv",v).style.display=inst==="Index/Andere"?"":"none";
   $("#l_sl",v).textContent=inst==="XAUUSD"?"Stop-Abstand in $ (z. B. 5 = 5 $ im Goldpreis)":inst==="Index/Andere"?"Stop-Abstand in Punkten":"Stop-Abstand in Pips";
   const bal=num("c_bal"),risk=num("c_risk"),sl=num("c_sl"),eu=num("c_eu"),jpy=num("c_jpy"),pvIn=num("c_pv");let pv;
   if(fx)pv=10/eu;else if(inst==="USDJPY")pv=(1000/jpy)/eu;else if(inst==="XAUUSD")pv=100/eu;else pv=pvIn;
   const riskEur=bal*risk/100;const raw=riskEur/(sl*pv);const lots=Math.floor(raw*100+1e-9)/100;
   LS.set("calc",Object.assign(c,{bal,risk,sl,inst,eurusd:eu,usdjpy:jpy,pv:pvIn}));
   if(!(raw>0)||!isFinite(raw)){$("#o_lots",v).textContent="–";$("#o_lots",v).__v=0;$("#o_info",v).textContent="Bitte alle Felder ausfüllen.";return}
   tw($("#o_lots",v),lots,x=>fmt(x)+" Lot");const unit=inst==="XAUUSD"?"$":inst==="Index/Andere"?"Punkt":"Pip";
   $("#o_info",v).innerHTML=lots<0.01?`<span style="color:var(--red)">Unter dem Minimum von 0,01 Lot – Stop zu weit oder Konto zu klein. Mit 0,01 Lot riskierst du ${fmt(0.01*sl*pv)} € (${fmt(0.01*sl*pv/bal*100,1)} %).</span>`:`Risiko: <b>${fmt(lots*sl*pv)} €</b> (Ziel ${fmt(riskEur)} €) · ≈ ${fmt(pv*lots)} € pro ${unit}`}
  if(rTab==="crv"){const e=num("c_e"),s=num("c_s"),t=num("c_t");LS.set("calc",Object.assign(c,{entry:$("#c_e",v).value,stop:$("#c_s",v).value,tp:$("#c_t",v).value}));
   if([e,s,t].some(isNaN)||e===s){$("#o_crv",v).textContent="–";$("#o_crv2",v).textContent="Einstieg, Stop und Ziel eingeben.";return}
   const long=s<e;const risk=Math.abs(e-s),rew=long?t-e:e-t;if(rew<=0){$("#o_crv",v).textContent="–";$("#o_crv2",v).innerHTML='<span style="color:var(--red)">Ziel liegt auf der falschen Seite.</span>';return}
   const r=rew/risk;tw($("#o_crv",v),r,x=>"1 : "+fmt(x,2));$("#o_crv2",v).innerHTML=`${long?"Long":"Short"} · Break-even-Trefferquote: <b>${fmt(100/(1+r),1)} %</b><br>${r<1.5?'<span style="color:var(--amber)">Unter 1:1,5 – lohnt sich selten.</span>':'<span style="color:var(--green)">Gutes Verhältnis.</span>'}`}
  if(rTab==="dd"){const w=num("c_w")/100,r=num("c_r"),rr=num("c_rr");if([w,r,rr].some(isNaN)||w<=0||w>=1)return;LS.set("calc",Object.assign(c,{w:w*100,r,rr}));
   const ev=w*r-(1-w);tw($("#o_ev",v),ev,x=>(x>=0?"+":"")+fmt(x,2)+"R");$("#o_ev",v).style.color=ev>=0?"var(--green)":"var(--red)";
   const tot=Math.pow(1+rr/100*r,100*w)*Math.pow(1-rr/100,100*(1-w));tw($("#o_100",v),(tot-1)*100,x=>(x>=0?"+":"")+fmt(x,0)+" %");$("#o_100",v).style.color=tot>=1?"var(--green)":"var(--red)";
   const ls=Math.round(Math.log(100)/-Math.log(1-w));$("#o_ls",v).innerHTML=`Bei ${fmt(w*100,0)} % Trefferquote musst du in 100 Trades mit einer Verlustserie von etwa <b>${ls} Trades</b> rechnen (Faustformel). Mit ${fmt(rr,1)} % Risiko sind das ca. <b>${fmt((1-Math.pow(1-rr/100,ls))*100,1)} %</b> Drawdown. Kosten sind nicht eingerechnet.`}};
 $$("input,select",v).forEach(e=>e.addEventListener("input",calc));calc()}
const GEM={model:"gemini-3.8-flash",fallback:"gemini-3.5-flash-lite",url:m=>"https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(m)+":generateContent"};
const getCfg=()=>{const c=LS.get("ai",{provider:"gemini",key:"",model:""});return c.provider==="gemini"?{provider:"gemini",key:c.key||"",model:c.model||""}:{provider:"gemini",key:"",model:""}};
/* ---------- KI ---------- */
const SYS=`Du bist ein erfahrener, nüchterner Chart-Analyst und Trading-Lehrer für einen Anfänger. Du bekommst ein Foto oder einen Screenshot eines Kurscharts (oft MetaTrader 5 auf dem iPhone).
Analysiere es so genau wie möglich: Trend und Marktstruktur (Hochs/Tiefs), wichtige Unterstützungen/Widerstände, Zonen, Trendlinien, Kerzen- und Chartmuster, sichtbare Indikatoren. Gib 1-2 mögliche Trade-Szenarien (Long und/oder Short) mit Einstieg, Stop-Loss und Ziel, jeweils mit Auslöser-Bedingung. Sei ehrlich, wenn das Bild unklar ist oder es kein gutes Setup gibt ("kein Trade" ist eine gültige Antwort; dann szenarien leer lassen oder als Beobachtung formulieren).
KOORDINATEN: Alle x- und y-Werte sind Bruchteile (0 bis 1) der GESAMTEN Bildbreite bzw. Bildhöhe, gemessen vom linken bzw. OBEREN Bildrand. Ein Preisniveau entspricht einer horizontalen Linie bei y. Lies Preise an der Preisachse ab, wenn sichtbar, und gib sie als Text an. Die Koordinaten müssen exakt zu den Stellen im Bild passen, weil sie eingezeichnet werden.
Antworte AUSSCHLIESSLICH mit einem gültigen JSON-Objekt (kein Markdown, kein Text davor/danach) in genau diesem Schema, alle Texte auf Deutsch, locker und verständlich (du-Form):
{"ist_chart":true,"symbol":"","zeiteinheit":"","zusammenfassung":"2-4 Sätze","trend":{"richtung":"aufwärts|abwärts|seitwärts","staerke":"schwach|mittel|stark","begruendung":""},
"levels":[{"typ":"support|resistance","y":0.5,"preis":"","staerke":2,"notiz":""}],
"zonen":[{"typ":"demand|supply|range","y1":0.4,"y2":0.45,"x1":0,"x2":1,"label":""}],
"trendlinien":[{"x1":0.1,"y1":0.8,"x2":0.9,"y2":0.3,"label":""}],
"muster":[{"name":"","x":0.5,"y":0.5,"bedeutung":"bullisch|bärisch|neutral","beschreibung":""}],
"indikatoren":["kurze Beobachtung je Indikator"],
"szenarien":[{"name":"","richtung":"long|short","ausloeser":"","entry":{"y":0.5,"preis":""},"stop":{"y":0.55,"preis":""},"ziel":{"y":0.4,"preis":""},"crv":"1:2","wahrscheinlichkeit":"niedrig|mittel|hoch"}],
"risiken":["…"],"lernhinweis":"ein konkreter Lerntipp zu diesem Chart","konfidenz":60,"bildqualitaet":"gut|mittel|schlecht – kurz warum"}
Maximal 6 levels, 3 zonen, 3 trendlinien, 4 muster, 2 szenarien. Wenn kein Chart erkennbar ist: ist_chart=false und erkläre es in zusammenfassung.`;
function gemErr(st,d,raw){const e=(d&&d.error)||{};const m=String(e.message||raw||"");const det=JSON.stringify(e.details||"");
 if(/API_KEY_INVALID|API key not valid|API key expired/i.test(m+det))return "Der API-Schlüssel ist ungültig. Bitte in AI Studio neu kopieren und komplett einfügen.";
 if(st===429||e.status==="RESOURCE_EXHAUSTED")return "Kostenloses Limit erreicht. Warte kurz oder versuch es morgen wieder (Tageslimit wird um 9 Uhr deutscher Zeit zurückgesetzt).";
 if(st===403||e.status==="PERMISSION_DENIED")return "Dieser Schlüssel darf die Gemini API nicht nutzen. Erstelle in AI Studio einen neuen Schlüssel.";
 if(st===404||e.status==="NOT_FOUND")return "Modell nicht gefunden. Lass das Feld „Modell“ in den Einstellungen leer.";
 if(/location is not supported|User location/i.test(m))return "Gemini ist in deiner Region gerade nicht verfügbar.";
 if(st===400)return "Anfrage abgelehnt ("+(e.status||400)+"). Versuch es mit einem anderen Bild.";
 if(st>=500)return "Gemini ist gerade überlastet. Bitte gleich nochmal versuchen.";
 return "Fehler "+st+": "+m.slice(0,160)}
async function callAI(dataUrl,text,test){const c=getCfg();if(!c.key)throw new Error("Kein Gemini API-Key – bitte in den Einstellungen eintragen.");
 const parts=[];if(dataUrl){const mm=/^data:([^;]+);base64,(.*)$/.exec(dataUrl);if(!mm)throw new Error("Bild konnte nicht gelesen werden.");parts.push({inline_data:{mime_type:mm[1],data:mm[2]}})}parts.push({text});
 const body={contents:[{role:"user",parts}],generationConfig:test?{maxOutputTokens:20}:{responseMimeType:"application/json",temperature:.3}};if(!test)body.system_instruction={parts:[{text:SYS}]};
 const models=c.model?[c.model]:[GEM.model,GEM.fallback];
 for(let i=0;i<models.length;i++){const ctl=new AbortController();const to=setTimeout(()=>ctl.abort(),180000);
  try{const r=await fetch(GEM.url(models[i]),{method:"POST",signal:ctl.signal,headers:{"Content-Type":"application/json","x-goog-api-key":c.key},body:JSON.stringify(body)});
   const raw=await r.text();let d;try{d=JSON.parse(raw)}catch(e){d={}}
   if(!r.ok){if((r.status===429||r.status===404||r.status>=500)&&i<models.length-1)continue;throw new Error(gemErr(r.status,d,raw))}
   if(d.promptFeedback&&d.promptFeedback.blockReason)throw new Error("Gemini hat das Bild abgelehnt ("+d.promptFeedback.blockReason+"). Versuch einen anderen Screenshot.");
   const cand=(d.candidates||[])[0]||{};const t=((cand.content&&cand.content.parts)||[]).filter(p=>!p.thought&&typeof p.text==="string").map(p=>p.text).join("");
   if(!t){if(cand.finishReason==="SAFETY")throw new Error("Gemini hat die Antwort blockiert. Versuch einen anderen Screenshot.");if(test)return "OK";throw new Error("Gemini hat keine Antwort geliefert. Bitte nochmal versuchen.")}
   return t}
  catch(e){if(e.name==="AbortError")throw new Error("Zeitüberschreitung – bitte nochmal versuchen.");if(e instanceof TypeError)throw new Error("Netzwerkfehler – Internet prüfen.");throw e}
  finally{clearTimeout(to)}}}
function parseJSON(t){t=String(t).replace(/```json|```/g,"");const a=t.indexOf("{"),b=t.lastIndexOf("}");if(a<0||b<0)throw new Error("Die KI hat kein gültiges Ergebnis geliefert. Bitte nochmal versuchen.");return JSON.parse(t.slice(a,b+1))}
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error("Bild konnte nicht geladen werden"));i.src=src})}
async function fileToDataUrl(f){const url=URL.createObjectURL(f);try{const img=await loadImg(url);const M=1600,s=Math.min(1,M/Math.max(img.naturalWidth,img.naturalHeight));const cv=document.createElement("canvas");cv.width=Math.round(img.naturalWidth*s);cv.height=Math.round(img.naturalHeight*s);cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);return cv.toDataURL("image/jpeg",.86)}finally{URL.revokeObjectURL(url)}}

/* ---------- Overlay zeichnen ---------- */
const layers={levels:true,zonen:true,trendlinien:true,muster:true,sz:0};
const cl=v=>Math.max(0,Math.min(1,+v||0));
function drawOverlay(cv,img,a){const W=img.naturalWidth,H=img.naturalHeight;cv.width=W;cv.height=H;const g=cv.getContext("2d");g.drawImage(img,0,0,W,H);
 const u=Math.max(1.5,W/420),fs=Math.round(Math.max(11,W/36));g.font=`600 ${fs}px -apple-system,Helvetica,Arial`;g.textBaseline="middle";
 const rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
 const pill=(x,y,txt,col,align)=>{txt=String(txt).trim();if(!txt)return;const p=fs*.45,w=g.measureText(txt).width+p*2,h=fs*1.5;let px=align==="left"?x:x-w;px=Math.max(2,Math.min(W-w-2,px));const py=Math.max(2,Math.min(H-h-2,y-h/2));
  g.fillStyle="rgba(0,0,0,.78)";rr(px,py,w,h,h/2);g.fill();g.strokeStyle=col;g.lineWidth=u*.8;g.stroke();g.fillStyle=col;g.fillText(txt,px+p,py+h/2+1)};
 if(layers.zonen)(a.zonen||[]).forEach(z=>{const col=z.typ==="demand"?"50,209,124":z.typ==="supply"?"242,85,76":"200,200,205";const x1=cl(z.x1==null?0:z.x1)*W,x2=(z.x2==null?1:cl(z.x2))*W,y1=cl(Math.min(z.y1,z.y2))*H,y2=cl(Math.max(z.y1,z.y2))*H;
  g.fillStyle=`rgba(${col},.2)`;g.fillRect(x1,y1,Math.max(4,x2-x1),Math.max(2,y2-y1));g.strokeStyle=`rgba(${col},.75)`;g.lineWidth=u;g.setLineDash([]);g.strokeRect(x1,y1,Math.max(4,x2-x1),Math.max(2,y2-y1));if(z.label)pill(x1+u*4,(y1+y2)/2,z.label,`rgb(${col})`,"left")});
 if(layers.levels)(a.levels||[]).forEach(l=>{const y=cl(l.y)*H,col=l.typ==="support"?"#32d17c":"#f2554c";g.strokeStyle=col;g.lineWidth=u*(0.8+(+l.staerke||1)*.45);g.setLineDash([u*6,u*4]);g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();g.setLineDash([]);
  pill(W-u*4,y,(l.typ==="support"?"S ":"R ")+(l.preis||""),col)});
 if(layers.trendlinien)(a.trendlinien||[]).forEach(t=>{g.strokeStyle="#e9b44c";g.lineWidth=u*1.6;g.setLineDash([]);g.beginPath();g.moveTo(cl(t.x1)*W,cl(t.y1)*H);g.lineTo(cl(t.x2)*W,cl(t.y2)*H);g.stroke();if(t.label)pill(cl(t.x2)*W,cl(t.y2)*H-fs*1.2,t.label,"#e9b44c")});
 if(layers.muster)(a.muster||[]).forEach((m,i)=>{const x=cl(m.x)*W,y=cl(m.y)*H,col=/bull/.test(m.bedeutung)?"#32d17c":/b[äa]r/.test(m.bedeutung)?"#f2554c":"#f5f5f7";g.strokeStyle=col;g.lineWidth=u*1.4;g.beginPath();g.arc(x,y,fs*1.1,0,7);g.stroke();
  g.fillStyle=col;g.beginPath();g.arc(x,y,fs*.6,0,7);g.fill();g.fillStyle="#000";g.textAlign="center";g.fillText(String(i+1),x,y+1);g.textAlign="left";pill(x+fs*1.4,y-fs*1.3,m.name,col,"left")});
 const s=(a.szenarien||[])[layers.sz];
 if(s&&s.entry&&s.stop&&s.ziel){const x1=W*.6,x2=W*.97,ye=cl(s.entry.y)*H,ys=cl(s.stop.y)*H,yt=cl(s.ziel.y)*H;
  g.fillStyle="rgba(242,85,76,.2)";g.fillRect(x1,Math.min(ye,ys),x2-x1,Math.abs(ys-ye));g.fillStyle="rgba(50,209,124,.2)";g.fillRect(x1,Math.min(ye,yt),x2-x1,Math.abs(yt-ye));
  [[ye,"#7fb0ff","Entry "+(s.entry.preis||"")],[ys,"#f2554c","SL "+(s.stop.preis||"")],[yt,"#32d17c","TP "+(s.ziel.preis||"")]].forEach(([y,c,t])=>{g.strokeStyle=c;g.lineWidth=u*1.6;g.setLineDash([]);g.beginPath();g.moveTo(x1,y);g.lineTo(x2,y);g.stroke();pill(x1-u*3,y,t,c)});
  pill(x1+u*3,Math.min(ye,ys,yt)-fs*1.3,(s.richtung==="short"?"SHORT ":"LONG ")+(s.crv||""),s.richtung==="short"?"#f2554c":"#32d17c","left")}}
function wipeOverlay(cv,img,a,ms){cancelAnimationFrame(cv.__raf);if(reduce||!ms){drawOverlay(cv,img,a);return}
 const off=document.createElement("canvas");drawOverlay(off,img,a);const W=off.width,H=off.height;cv.width=W;cv.height=H;const g=cv.getContext("2d");g.drawImage(img,0,0,W,H);let t0=0;
 const step=t=>{if(!t0)t0=t+380;const k=Math.max(0,Math.min(1,(t-t0)/ms)),e=1-Math.pow(1-k,3),w=Math.max(1,Math.round(W*e));g.drawImage(img,0,0,W,H);g.drawImage(off,0,0,w,H,0,0,w,H);
  if(k<1){const gr=g.createLinearGradient(w-60,0,w,0);gr.addColorStop(0,"rgba(50,209,124,0)");gr.addColorStop(1,"rgba(50,209,124,.35)");g.fillStyle=gr;g.fillRect(w-60,0,60,H);g.fillStyle="#32d17c";g.fillRect(w-2,0,2,H);cv.__raf=requestAnimationFrame(step)}};
 cv.__raf=requestAnimationFrame(step)}
/* ---------- Demo-Chart ---------- */
function demoChart(){const W=1170,H=1500,cv=document.createElement("canvas");cv.width=W;cv.height=H;const g=cv.getContext("2d");g.fillStyle="#0d1117";g.fillRect(0,0,W,H);
 let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;const N=60,c=[];let p=1.1520;
 const drift=i=>i<22?0.00055:i<34?-0.0005:i<52?0.0007:-0.00035;
 for(let i=0;i<N;i++){const o=p;const cc=o+drift(i)+(rnd()-.5)*0.0011;const h=Math.max(o,cc)+rnd()*0.0005,l=Math.min(o,cc)-rnd()*0.0005;c.push([o,h,l,cc]);p=cc}
 const hi=Math.max(...c.map(k=>k[1]))+0.0012,lo=Math.min(...c.map(k=>k[2]))-0.0012,top=170,bot=H-180,left=20,right=W-170;const Y=v=>top+(hi-v)/(hi-lo)*(bot-top),cw=(right-left)/N;
 g.strokeStyle="rgba(255,255,255,.06)";g.lineWidth=1;g.font="26px Helvetica";g.fillStyle="rgba(255,255,255,.55)";
 for(let k=0;k<=8;k++){const v=lo+(hi-lo)*k/8,y=Y(v);g.beginPath();g.moveTo(0,y);g.lineTo(right,y);g.stroke();g.fillText(v.toFixed(5),right+14,y+8)}
 c.forEach((k,i)=>{const x=left+cw*i+cw/2,up=k[3]>=k[0];g.strokeStyle=g.fillStyle=up?"#26a69a":"#ef5350";g.lineWidth=3;g.beginPath();g.moveTo(x,Y(k[1]));g.lineTo(x,Y(k[2]));g.stroke();const t=Y(Math.max(k[0],k[3])),b=Y(Math.min(k[0],k[3]));g.fillRect(x-cw*.33,t,cw*.66,Math.max(2,b-t))});
 g.fillStyle="#fff";g.font="bold 40px Helvetica";g.fillText("EURUSD, H1",30,90);g.font="28px Helvetica";g.fillStyle="rgba(255,255,255,.5)";g.fillText("Beispiel-Chart (simuliert)",30,135);
 const idxMax=(a,b)=>{let m=a;for(let i=a;i<=b;i++)if(c[i][1]>c[m][1])m=i;return m},idxMin=(a,b)=>{let m=a;for(let i=a;i<=b;i++)if(c[i][2]<c[m][2])m=i;return m};
 const h1=idxMax(14,28),l1=idxMin(26,40),l0=idxMin(0,8),h2=idxMax(44,N-1);const fy=v=>Y(v)/H,fx=i=>(left+cw*i+cw/2)/W,pr=v=>v.toFixed(4);
 const sup=c[h1][1],slope=(c[l1][2]-c[l0][2])/(l1-l0);
 const a={ist_chart:true,symbol:"EURUSD",zeiteinheit:"H1",zusammenfassung:"Klarer Aufwärtstrend mit höheren Hochs und höheren Tiefs. Nach dem Ausbruch über das alte Hoch läuft gerade eine kleine Korrektur. Das alte Hoch kann jetzt als Unterstützung dienen (Rollentausch).",
  trend:{richtung:"aufwärts",staerke:"mittel",begruendung:"Höhere Tiefs bei "+pr(c[l0][2])+" und "+pr(c[l1][2])+", neues Hoch bei "+pr(c[h2][1])+"."},
  levels:[{typ:"resistance",y:fy(c[h2][1]),preis:pr(c[h2][1]),staerke:2,notiz:"Aktuelles Hoch"},{typ:"support",y:fy(sup),preis:pr(sup),staerke:3,notiz:"Altes Hoch = neue Unterstützung"},{typ:"support",y:fy(c[l1][2]),preis:pr(c[l1][2]),staerke:2,notiz:"Letztes höheres Tief"}],
  zonen:[{typ:"demand",y1:fy(sup+0.0004),y2:fy(sup-0.0004),x1:fx(h1)-.12,x2:1,label:"Kaufzone"}],
  trendlinien:[{x1:fx(l0),y1:fy(c[l0][2]),x2:fx(N-1),y2:fy(c[l0][2]+slope*(N-1-l0)),label:"Trendlinie"}],
  muster:[{name:"Höheres Tief",x:fx(l1),y:fy(c[l1][2])+.035,bedeutung:"bullisch",beschreibung:"Der Rücksetzer endete über dem vorherigen Tief – der Trend ist intakt."},{name:"Neues Hoch (BOS)",x:fx(h2),y:fy(c[h2][1])-.035,bedeutung:"bullisch",beschreibung:"Break of Structure nach oben bestätigt den Aufwärtstrend."}],
  indikatoren:["Keine Indikatoren sichtbar – füg im echten Chart z. B. EMA 50 und EMA 200 hinzu."],
  szenarien:[{name:"Pullback-Long an der Kaufzone",richtung:"long",ausloeser:"Kurs fällt in die Kaufzone und bildet dort eine bullische H1-Kerze (Pin Bar oder Engulfing).",entry:{y:fy(sup+0.0003),preis:pr(sup+0.0003)},stop:{y:fy(sup-0.0010),preis:pr(sup-0.0010)},ziel:{y:fy(sup+0.0029),preis:pr(sup+0.0029)},crv:"1:2",wahrscheinlichkeit:"mittel"},
   {name:"Short nur bei Trendbruch",richtung:"short",ausloeser:"Erst wenn eine H1-Kerze klar unter "+pr(c[l1][2])+" schließt.",entry:{y:fy(c[l1][2]-0.0002),preis:pr(c[l1][2]-0.0002)},stop:{y:fy(c[l1][2]+0.0010),preis:pr(c[l1][2]+0.0010)},ziel:{y:fy(c[l1][2]-0.0026),preis:pr(c[l1][2]-0.0026)},crv:"1:2",wahrscheinlichkeit:"niedrig"}],
  risiken:["US-News um 14:30 können die Zone einfach durchschlagen.","Nicht blind in den Rücksetzer kaufen – Bestätigungskerze abwarten."],
  lernhinweis:"Lehrbuch-Rollentausch: Ein gebrochener Widerstand wird zur Unterstützung. Genau dort setzt die Trendfolge-Strategie (Platz 1) an.",konfidenz:68,bildqualitaet:"gut – simulierter Beispielchart",_demo:true};
 return{url:cv.toDataURL("image/jpeg",.9),a}}
/* ---------- Analyse-View ---------- */
let cur=null;
V.analyse=()=>{const c=getCfg();if(!cur){const l=LS.get("last",null);if(l)cur=l}
 return{title:"Analyse",html:`${EB("KI-Werkzeug","a","margin-top:6px")}<h1 class="lt r">Chart-<i>Analyse</i></h1><p class="lead r">Foto oder Screenshot deines Charts – die KI zeichnet Zonen, Linien und Szenarien ein.</p>
 ${c.key?"":`<div class="group ic-rows">${cell("#/einstellungen",I.key,"API-Schlüssel einrichten","Für echte Analysen – kostenloser Gemini-Schlüssel. Das Beispiel geht ohne.")}</div>`}
 <div class="card upl"><div class="eb a">Chart hochladen</div><p style="color:var(--read);font-size:15px;line-height:22px">Am besten ein <b>Screenshot</b> aus MT5 (Seitentaste + Lauter). Preisachse sichtbar lassen.</p>
 <div class="btn-row"><label class="btn">${I.camera}Kamera<input type="file" accept="image/*" capture="environment" id="a_cam" hidden></label><label class="btn sec">${I.image}Galerie<input type="file" accept="image/*" id="a_gal" hidden></label></div>
 <button class="btn ghost" id="a_demo">${I.spark}Beispiel ansehen</button>
 <div class="hr"></div>
 <div class="grid2"><div class="field" style="margin:0"><label>Symbol (optional)</label><input class="input" id="a_sym" placeholder="EURUSD" autocapitalize="characters"></div><div class="field" style="margin:0"><label>Zeitrahmen (optional)</label><input class="input" id="a_tf" placeholder="H1" autocapitalize="characters"></div></div>
 <div class="field" style="margin:14px 0 0"><label>Frage (optional)</label><input class="input" id="a_q" placeholder="Soll ich hier long gehen?"></div></div>
 <div id="a_out"></div>
 <p class="disclaimer">Die KI-Analyse ist <b>keine Anlageberatung</b> und kann sich irren (falsch abgelesene Preise, verschobene Linien). Prüfe jede Linie selbst im Chart und handle nur nach deinen eigenen Regeln.</p>`,
 after(v){const out=$("#a_out",v);if(cur)showResult(out,cur);
  const onFile=async e=>{const f=e.target.files&&e.target.files[0];e.target.value="";if(!f)return;let url;try{url=await fileToDataUrl(f)}catch(err){toast(err.message);return}
   if(!getCfg().key){out.innerHTML=`<div class="card fadein"><img src="${url}" style="width:100%;border-radius:12px;display:block"><div class="warn"><b>Fast geschafft</b>Trag in den <a href="#/einstellungen">Einstellungen</a> deinen API-Schlüssel ein – danach wird dieses Bild automatisch analysiert.</div></div>`;LS.set("pending",url);return}
   runAnalysis(out,url,v)};
  $("#a_cam",v).onchange=onFile;$("#a_gal",v).onchange=onFile;
  $("#a_demo",v).onclick=()=>{const d=demoChart();cur={img:d.url,a:d.a};layers.sz=0;showResult(out,cur).then(()=>v.scrollTo({top:out.offsetTop-90,behavior:reduce?"auto":"smooth"}))};
  const pend=LS.get("pending",null);if(pend&&getCfg().key){LS.del("pending");runAnalysis(out,pend,v)}}}};
async function runAnalysis(out,url,v){out.innerHTML=`<div class="card fadein"><div class="canvas-wrap"><img src="${url}" style="width:100%;display:block;opacity:.6"><div class="scan"></div></div><div class="loader"><div class="spinner"></div><div style="font-weight:600;margin-top:6px">Analysiere Chart …</div><div class="muted">Das kann 10–60 Sekunden dauern.</div></div></div>`;
 v.scrollTo({top:out.offsetTop-90,behavior:reduce?"auto":"smooth"});
 const val=id=>{const e=$("#"+id,v);return e&&e.value.trim()};
 const meta=[`Symbol laut Nutzer: ${val("a_sym")||"unbekannt"}`,`Zeitrahmen laut Nutzer: ${val("a_tf")||"unbekannt"}`,`Frage des Nutzers: ${val("a_q")||"-"}`,`Aktuelle Zeit (Berlin): ${new Date().toLocaleString("de-DE",{timeZone:"Europe/Berlin"})}`].join("\n");
 try{const t=await callAI(url,"Analysiere diesen Chart.\n"+meta);const a=parseJSON(t);cur={img:url,a};LS.set("last",cur);layers.sz=0;await showResult(out,cur)}
 catch(e){out.innerHTML=`<div class="card warn fadein"><b>Analyse fehlgeschlagen</b>${esc(e.message)}<button class="btn sec" id="a_retry" style="margin-top:12px">Nochmal versuchen</button></div>`;$("#a_retry",out).onclick=()=>runAnalysis(out,url,v)}}
async function showResult(out,r){const a=r.a||{};const img=await loadImg(r.img);
 const sz=a.szenarien||[];const tr=a.trend||{};const trCol=/auf/.test(tr.richtung)?"g":/ab/.test(tr.richtung)?"r":"";
 const chip=(k,l)=>`<button class="fchip ${layers[k]?"on":""}" data-l="${k}">${l}</button>`;
 const conf=Math.max(0,Math.min(100,+a.konfidenz||0));
 out.innerHTML=`<div class="fadein"><div class="eb" style="margin:26px 4px 10px">${a._demo?"Beispiel-Analyse (simuliert)":"Ergebnis"}</div>
 <div class="card tight"><div class="canvas-wrap"><canvas id="a_cv"></canvas></div>
 <div class="layer-row">${chip("levels","Levels")}${chip("zonen","Zonen")}${chip("trendlinien","Trendlinien")}${chip("muster","Muster")}${sz.map((s,i)=>`<button class="fchip ${layers.sz===i?"on":""}" data-sz="${i}">Szenario ${i+1}</button>`).join("")}</div></div>
 ${a.ist_chart===false?`<div class="card warn"><b>Kein Chart erkannt</b>${esc(a.zusammenfassung)}</div>`:`
 <div class="card"><div style="margin-bottom:6px"><span class="chip b">${esc(a.symbol||"?")}</span><span class="chip b">${esc(a.zeiteinheit||"?")}</span><span class="chip ${trCol}">Trend ${esc(tr.richtung||"?")}${tr.staerke?" · "+esc(tr.staerke):""}</span></div>
 <p style="color:var(--t1);font-size:16px;line-height:24px;margin:8px 0">${esc(a.zusammenfassung)}</p>${tr.begruendung?`<p class="muted">${esc(tr.begruendung)}</p>`:""}
 <div class="row" style="justify-content:space-between;margin-top:12px"><span class="muted">Konfidenz der KI</span><b class="tnum">${conf} %</b></div><div class="conf"><i style="width:${conf}%"></i></div></div>
 ${sz.map((s,i)=>`<div class="card"><div class="row" style="justify-content:space-between;align-items:flex-start"><h3 style="margin:0;flex:1">${esc(s.name||"Szenario "+(i+1))}</h3><span class="chip ${s.richtung==="short"?"r":"g"}">${esc((s.richtung||"").toUpperCase())}</span></div>
  <p style="color:var(--read);font-size:15px;line-height:22px;margin:8px 0 4px"><b>Auslöser:</b> ${esc(s.ausloeser)}</p><div class="tablewrap"><table class="t"><tr><td>Einstieg</td><td class="tnum"><b>${esc(s.entry&&s.entry.preis||"–")}</b></td></tr><tr><td>Stop-Loss</td><td class="tnum"><b class="neg">${esc(s.stop&&s.stop.preis||"–")}</b></td></tr><tr><td>Ziel</td><td class="tnum"><b class="pos">${esc(s.ziel&&s.ziel.preis||"–")}</b></td></tr><tr><td>CRV</td><td class="tnum">${esc(s.crv||"–")}</td></tr><tr><td>Chance</td><td>${esc(s.wahrscheinlichkeit||"–")}</td></tr></table></div>
  <button class="btn sec" data-calc="${i}">CRV im Rechner prüfen</button></div>`).join("")}
 ${(a.levels||[]).length?`<div class="card"><h3 style="margin-top:0">Wichtige Level</h3>${a.levels.map(l=>`<div class="lvl-row"><span class="dot" style="margin-top:7px;background:${l.typ==="support"?"var(--acc)":"var(--neg)"}"></span><div style="flex:1"><b class="tnum">${esc(l.preis||"–")}</b> <span class="muted">${l.typ==="support"?"Unterstützung":"Widerstand"} · Stärke ${esc(l.staerke||"")}/3</span><div class="muted">${esc(l.notiz||"")}</div></div></div>`).join("")}</div>`:""}
 ${(a.muster||[]).length?`<div class="card"><h3 style="margin-top:0">Erkannte Muster</h3>${a.muster.map((m,i)=>`<div class="lvl-row"><span class="rk top" style="width:18px">${i+1}</span><div style="flex:1"><b>${esc(m.name)}</b> <span class="chip ${/bull/.test(m.bedeutung)?"g":/b[äa]r/.test(m.bedeutung)?"r":""}" style="margin-left:4px">${esc(m.bedeutung)}</span><div style="color:var(--read);font-size:15px;line-height:22px">${esc(m.beschreibung)}</div></div></div>`).join("")}</div>`:""}
 ${(a.indikatoren||[]).length?`<div class="card lesson"><h3 style="margin-top:0">Indikatoren</h3><ul class="list">${a.indikatoren.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}
 ${(a.risiken||[]).length?`<div class="card warn"><b>Risiken</b><ul class="list">${a.risiken.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}
 ${a.lernhinweis?`<div class="card tip"><b>Lerntipp</b>${esc(a.lernhinweis)}</div>`:""}
 ${a.bildqualitaet?`<p class="muted" style="margin:0 4px">Bildqualität: ${esc(a.bildqualitaet)}</p>`:""}`}</div>`;
 const cv=$("#a_cv",out);const redraw=ms=>wipeOverlay(cv,img,a,ms);redraw(1100);reveal(out);
 $$("[data-l]",out).forEach(b=>b.onclick=()=>{layers[b.dataset.l]=!layers[b.dataset.l];b.classList.toggle("on");redraw(0)});
 $$("[data-sz]",out).forEach(b=>b.onclick=()=>{const i=+b.dataset.sz;layers.sz=layers.sz===i?-1:i;$$("[data-sz]",out).forEach((x,j)=>x.classList.toggle("on",layers.sz===j));redraw(0)});
 $$("[data-calc]",out).forEach(b=>b.onclick=()=>{const s=sz[+b.dataset.calc];const c=LS.get("calc",{});const n=x=>String(x||"").replace(/[^\d.,-]/g,"").replace(",",".");Object.assign(c,{entry:n(s.entry&&s.entry.preis),stop:n(s.stop&&s.stop.preis),tp:n(s.ziel&&s.ziel.preis)});LS.set("calc",c);rTab="crv";go("#/rechner")})}
/* ---------- Karteikarten (Spaced Repetition) ---------- */
const FCA={sks:["Kopf-Schulter","Kopf-Schulter-Formation","Schulter-Kopf-Schulter","SKS","Head and Shoulders","Head & Shoulders","Head Shoulders"],
 isks:["Inverse SKS","Umgekehrte Kopf-Schulter","Inverse Kopf-Schulter-Formation","Inverse Head and Shoulders","Inverted Head and Shoulders","Reverse Head and Shoulders"],
 dtop:["Doppeltop","Doppelhoch","Double Top","M-Formation"],dbottom:["Doppelboden","Doppeltief","Double Bottom","W-Formation"],
 asctri:["Ascending Triangle","Steigendes Dreieck"],desctri:["Descending Triangle","Fallendes Dreieck"],symtri:["Symmetrical Triangle","Symmetric Triangle","Dreieck"],
 bullflag:["Bull Flag","Bullische Flagge","Flagge"],bearflag:["Bear Flag","Bärische Flagge"],risingwedge:["Rising Wedge","Aufsteigender Keil"],fallingwedge:["Falling Wedge","Absteigender Keil"],
 cup:["Cup and Handle","Cup with Handle","Tasse mit Henkel","Untertasse mit Henkel"],
 invhammer:["Umgekehrter Hammer","Inverser Hammer"],hangingman:["Hängender Mann","Hanging Men"],shootingstar:["Sternschnuppe"],dragonfly:["Libellen-Doji","Dragonfly"],gravestone:["Grabstein-Doji","Gravestone"],
 longlegged:["Long Legged Doji","Langbeiniger Doji"],spinningtop:["Kreisel"],marubozubull:["Bullischer Marubozu","Weißer Marubozu","Grüner Marubozu"],marubozubear:["Bärischer Marubozu","Schwarzer Marubozu","Roter Marubozu"],
 pinbar:["Pinbar","Pinocchio Bar"],bullengulf:["Bullisches Engulfing","Bullish Engulfing Pattern","Bullische Umarmung"],bearengulf:["Bärisches Engulfing","Bearish Engulfing Pattern","Bärische Umarmung"],
 bullharami:["Bullisches Harami"],bearharami:["Bärisches Harami"],piercing:["Piercing Pattern","Durchdringungsmuster"],darkcloud:["Dunkle Wolkendecke","Dark Cloud"],
 tweezerbottom:["Tweezers Bottom","Pinzetten-Boden","Pinzette unten"],tweezertop:["Tweezers Top","Pinzetten-Top","Pinzette oben"],insidebar:["Innenstab","Inside Day"],
 morningstar:["Morgenstern"],eveningstar:["Abendstern"],"3soldiers":["Drei weiße Soldaten","3 White Soldiers","Three Soldiers"],"3crows":["Drei schwarze Krähen","3 Black Crows","Three Crows"],
 "3insideup":["3 Inside Up"],"3insidedown":["3 Inside Down"],"3outsideup":["3 Outside Up"],"3outsidedown":["3 Outside Down"],rising3:["Rising Three","Steigende drei Methoden"],falling3:["Falling Three","Fallende drei Methoden"]};
const fcItem=id=>{const t=id[0],k=id.slice(2);const p=(t==="f"?CHARTPATTERNS:CANDLES).find(x=>x.id===k);return p?{id,t,p}:null};
const fcAll=m=>(m!=="formationen"?CANDLES.map(p=>"c:"+p.id):[]).concat(m!=="kerzen"?CHARTPATTERNS.map(p=>"f:"+p.id):[]);
const fnorm=s=>String(s||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
 .replace(/&/g," ").replace(/\b(and|und|with|mit|the|das|der|die|pattern|muster|formation)\b/g," ").replace(/[^a-z0-9]/g,"").replace(/(.{4,})(pattern|muster|formation)$/,"$1");
function lev(a,b){if(a===b)return 0;const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=Array.from({length:n+1},(_,j)=>j);
 for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
const fcNames=p=>[...new Set([p.name,p.en,p.name.replace(/\s*\(.*?\)\s*/g," ").trim()].concat(FCA[p.id]||[]).filter(Boolean))];
function fcMatch(p,inp){const q=fnorm(inp);if(q.length<2)return null;let best=null;
 fcNames(p).forEach(n=>{const c=fnorm(n);if(!c)return;const d=lev(q,c),tol=c.length<=4?0:c.length<=8?1:c.length<=14?2:3;if(d<=tol&&(!best||d<best.d))best={d,n}});return best}
const SRS_INT=[0,1,3,7,16,35].map(d=>d*864e5);
const srsGet=()=>LS.get("srs",{});
const srsKey=(id,type)=>(type==="dir"?"d|":"")+id;
function srsUpd(id,type,ok){const s=srsGet(),k=srsKey(id,type);const e=s[k]||{b:0,due:0,n:0,w:0};e.n++;if(ok)e.b=Math.min(5,e.b+1);else{e.b=0;e.w++}e.due=Date.now()+(ok?SRS_INT[e.b]:2*60000);s[k]=e;LS.set("srs",s)}
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function fcDue(mode,type){const s=srsGet(),now=Date.now();return fcAll(mode).filter(id=>{const e=s[srsKey(id,type)];return e&&e.due<=now}).length}
function fcLearned(mode,type){const s=srsGet();return fcAll(mode).filter(id=>{const e=s[srsKey(id,type)];return e&&e.b>=2}).length}
function fcDeck(mode,type,only){if(only)return shuf(only.slice()).map(fcItem).filter(Boolean);const s=srsGet(),now=Date.now(),E=id=>s[srsKey(id,type)];const ids=fcAll(mode);
 const due=shuf(ids.filter(id=>E(id)&&E(id).due<=now)).sort((a,b)=>E(a).b-E(b).b),fresh=shuf(ids.filter(id=>!E(id))),rest=shuf(ids.filter(id=>E(id)&&E(id).due>now)).sort((a,b)=>E(a).due-E(b).due);
 return shuf(due.concat(fresh,rest).slice(0,10)).map(fcItem).filter(Boolean)}
const bDay=t=>new Date(t).toLocaleDateString("sv-SE",{timeZone:"Europe/Berlin"});
const GOAL=10;
function daily(){const d=LS.get("daily",{d:"",n:0});return d.d===bDay(Date.now())?d:{d:bDay(Date.now()),n:0}}
function dayStreak(){const s=LS.get("dstreak",{last:"",days:0});return(s.last===bDay(Date.now())||s.last===bDay(Date.now()-864e5))?s:{last:s.last,days:0}}
function bumpDaily(){const d=daily();d.n++;LS.set("daily",d);if(d.n===GOAL){const s=dayStreak();if(s.last!==d.d){s.days=(s.days||0)+1;s.last=d.d;LS.set("dstreak",s)}return true}return false}
const FC={mode:LS.get("fcmode","gemischt"),type:LS.get("fctype","mc")};
let fcS=null;
/* ================= Trainingsmodus „Daylight“ ================= */
let trainRet="#/lernen";
const exitTrain=()=>go(trainRet||"#/lernen");
const trTop=(mid,right)=>`<div class="trt"><button class="trx" data-exit aria-label="Training beenden">${I.close}</button>${mid}${right||""}</div>`;
const trStreak=n=>`<span class="trs ${n?"on":""}" id="tr_st">${I.flame}<b>${n}</b></span>`;
const PX=[0,-62,-88,-62,0,62,88,62];
V.training=()=>{const d=doneSet(),nx=nextLesson(d),dd=daily(),st=dayStreak(),due=fcDue("gemischt","mc")+fcDue("gemischt","type");let k=0;const stk=["hammer","bullengulf","eveningstar","morningstar","shootingstar"];
 let path="";chapters().forEach((c,ci)=>{const p=chParts(c.ch);const n=c.ls.filter(l=>d.has(l.id)).length,started=n>0||c.ls.some(l=>nx&&l.id===nx.id);
  path+=`<section class="tch"><div class="ban ${started?"":"ink"} r"><div><small>KAPITEL ${esc(p.num||ci+1)}</small><b>${esc(p.title)}</b></div><span class="bn-c">${n}/${c.ls.length}</span></div><div class="nodes">`;
  c.ls.forEach(l=>{const dn=d.has(l.id),cu=nx&&l.id===nx.id;const x=PX[k++%8];
   path+=`<div class="ndw r ${cu?"cur":""}" style="--x:${x}px">${cu?'<div class="stb">START</div>':""}<a class="nd ${dn?"done":cu?"cur":"fut"}" href="#/lernen/${l.id}" aria-label="${esc(l.title)}">${dn?I.check:cu?lico(l):lico(l)}</a>${cu?`<div class="cl">${esc(l.title)}</div>`:""}</div>`});
  const x=PX[k++%8];path+=`<div class="ndw r" style="--x:${x}px"><a class="nd prac ${n?"":"fut"}" href="#/karten" aria-label="Kapitel-Übung">${I.cards}</a></div></div>
  <div class="stk ${ci%2?"l":"rt"}">${candleSVG(CANDLES.find(q=>q.id===stk[ci%stk.length]))}</div></section>`});
 return{title:"Training",html:`${trTop('<div class="trt-t">Training</div>',`${trStreak(st.days||0)}<span class="trs bl">${I.cards}<b>${due}</b></span>`)}
 <div class="tr-body"><h1 class="th1 r">Bereit, Tim?</h1><p class="tp r">${nx?`Als Nächstes: <b>${esc(nx.title)}</b>.`:"Alle Lektionen geschafft – jetzt Karten festigen."} ${due?`${due} Karten sind fällig.`:""}</p>
 <div class="box quest r"><div class="q-ic">${I.target}</div><div style="flex:1;min-width:0"><div class="q-h"><b>Tagesziel</b><span>${Math.min(dd.n,GOAL)} / ${GOAL}</span></div><div class="cbar"><i data-w="${Math.min(1,dd.n/GOAL)*100}"></i></div><div class="q-s">${dd.n>=GOAL?"Geschafft – deine Serie läuft weiter.":`Noch ${GOAL-dd.n} Karten für deine Serie.`}</div></div></div>
 <div class="row2 r"><a class="b3 bl" href="#/karten">${I.cards}KARTEN ÜBEN</a></div>
 <div class="path">${path}</div><p class="tfoot">Tippe auf einen Kreis, um die Lektion zu öffnen. Die Übung am Kapitelende startet die Karteikarten.</p></div>`,
 after(v){$$("[data-exit]",v).forEach(b=>b.onclick=exitTrain);$$(".tch",v).forEach(ch=>{const st=$(".stk",ch);if(!st)return;let best=null,bx=-1;$$(".ndw",ch).forEach(n=>{const x=parseFloat(n.style.getPropertyValue("--x"))||0;if(Math.abs(x)>bx&&!n.classList.contains("cur")){bx=Math.abs(x);best={n,x}}});if(!best)return;st.classList.remove("l","rt");st.classList.add(best.x<0?"rt":"l");st.style.top=(best.n.offsetTop+4)+"px"});const c=$(".ndw.cur",v);if(c)setTimeout(()=>{const y=c.getBoundingClientRect().top-v.getBoundingClientRect().top+v.scrollTop-v.clientHeight*.38;if(y>0)v.scrollTo({top:y,behavior:reduce?"auto":"smooth"})},reduce?0:650)}}};

V.karten=()=>({title:"Karteikarten",html:`<div id="fcw"></div>`,after(v){const w=$("#fcw",v);if(fcS&&fcS.deck&&fcS.deck.length&&!fcS.done){if(fcS.lock){fcS.i++;fcS.lock=false}if(fcS.i>=fcS.deck.length)fcSummary(w);else fcCard(w);return}fcSetup(w,v)}});
const fcModes=[["kerzen","Kerzen","hammer"],["formationen","Formationen","dtop"],["gemischt","Gemischt","morningstar"]];
const fcTypes=[["mc",I.grid,"Auswahl","4 Antworten – tippe die richtige"],["type",I.keyb,"Eintippen","Namen schreiben, Deutsch oder Englisch"],["dir",I.updown,"Richtung","Bullisch, bärisch oder neutral?"]];
const goLbl=du=>du?`LOS GEHT'S · ${Math.min(10,du)} FÄLLIG`:"LOS GEHT'S";
function fcSetup(w,v){fcS=null;const d=daily(),st=dayStreak();const tot=fcAll(FC.mode).length,learned=fcLearned(FC.mode,FC.type),due=fcDue(FC.mode,FC.type);
 const art=m=>{const id=m[2];const f=m[0]==="formationen";const p=(f?CHARTPATTERNS:CANDLES).find(x=>x.id===id);return f?chartSVG(p):candleSVG(p)};
 w.innerHTML=`${trTop('<div class="trt-t">Karteikarten</div>',trStreak(st.days||0))}
 <div class="tr-body"><h1 class="th1 r">Was üben wir?</h1><p class="tp r">Muster sehen, Namen nennen, Lösung umdrehen. Was du nicht wusstest, kommt öfter wieder.</p>
 <div class="box quest r"><div class="q-ic">${I.target}</div><div style="flex:1;min-width:0"><div class="q-h"><b>Tagesziel</b><span>${Math.min(d.n,GOAL)} / ${GOAL}</span></div><div class="cbar"><i data-w="${Math.min(1,d.n/GOAL)*100}"></i></div></div></div>
 <div class="tl r">Stapel</div><div class="decks r">${fcModes.map(m=>`<button class="dk ${FC.mode===m[0]?"on":""}" data-fm="${m[0]}"><div class="dk-a">${art(m)}</div><b>${m[1]}</b><span>${fcAll(m[0]).length} Karten</span></button>`).join("")}</div>
 <div class="tl r">Abfrage</div><div class="types">${fcTypes.map(t=>`<button class="ty r ${FC.type===t[0]?"on":""}" data-ft="${t[0]}"><span class="ty-i">${t[1]}</span><span class="ty-t"><b>${t[2]}</b><span>${t[3]}</span></span><span class="ty-r"></span></button>`).join("")}</div>
 <div class="mstats r"><div class="ms am"><b data-count="${st.days||0}">0</b><span>Tage in Folge</span></div><div class="ms gr"><b data-count="${learned}">0</b><span>von ${tot} sitzen</span></div><div class="ms bl"><b data-count="${due}">0</b><span>fällig</span></div></div>
 <a class="b3 gh wide r" href="#/training">${I.map||""}ZUM LERNPFAD</a>
 <p class="tfoot">Spaced Repetition: Richtige Karten kommen nach 1, 3, 7, 16 und 35 Tagen wieder, falsche sofort in der nächsten Runde. Gespeichert nur auf diesem Gerät.</p></div>
 <div class="fbar"><button class="b3 bl" id="fc_go">${goLbl(due)}</button></div>`;
 $$("[data-exit]",w).forEach(b=>b.onclick=exitTrain);
 $$("[data-fm]",w).forEach(b=>b.onclick=()=>{FC.mode=b.dataset.fm;LS.set("fcmode",FC.mode);$$("[data-fm]",w).forEach(x=>x.classList.toggle("on",x===b));refreshSetup(w)});
 $$("[data-ft]",w).forEach(b=>b.onclick=()=>{FC.type=b.dataset.ft;LS.set("fctype",FC.type);$$("[data-ft]",w).forEach(x=>x.classList.toggle("on",x===b));refreshSetup(w)});
 $("#fc_go",w).onclick=()=>fcStart(w,fcDeck(FC.mode,FC.type));
 reveal(w)}
function refreshSetup(w){const tot=fcAll(FC.mode).length,learned=fcLearned(FC.mode,FC.type),due=fcDue(FC.mode,FC.type);const ms=$$(".ms b",w);
 [[ms[1],learned],[ms[2],due]].forEach(([e,n])=>{e.dataset.from=parseInt(e.textContent)||0;e.dataset.count=n;countUp(e)});$$(".ms span",w)[1].textContent=`von ${tot} sitzen`;$("#fc_go",w).textContent=goLbl(due)}
function fcStart(w,deck){fcS={deck,i:0,ok:0,streak:0,best:0,missed:[],type:FC.type,mode:FC.mode,goal:false};const v=w.closest(".view");if(v)v.scrollTop=0;fcCard(w)}
const PRAISE=["Super!","Stark!","Genau!","Sauber!","Sitzt!"];
function fcCard(w){const S=fcS,N=S.deck.length,it=S.deck[S.i],p=it.p,isF=it.t==="f";const art=isF?chartSVG(p):candleSVG(p);
 const q=S.type==="dir"?"Bullisch, bärisch oder neutral?":isF?"Wie heißt diese Formation?":"Wie heißt das markierte Muster?";
 const v=w.closest(".view");if(v)v.scrollTop=0;
 w.innerHTML=`${trTop(`<div class="tpb"><i style="transform:scaleX(${S.i/N})"></i></div>`,trStreak(S.streak))}
 <div class="tr-body play"><div class="fkind">${isF?"Formation":"Kerzenmuster"} · Karte ${S.i+1} von ${N}</div><h2 class="fq">${q}</h2>
 <div class="fc deal" id="fc"><div class="fc-in"><div class="fc-face fc-front"><div class="fc-dark">${art}</div><div class="fc-hint">${isF?"Achte auf Hochs, Tiefs und die Linien.":"Gestrichelter Rahmen = das Muster. Achte auf den Trend davor."}</div></div><div class="fc-face fc-back" id="fc_back"></div></div></div>
 <div class="fc-ans" id="fc_ans"></div></div><div class="fbar" id="fbar"><button class="b3 bl" id="fc_chk" disabled>PRÜFEN</button></div>`;
 $$("[data-exit]",w).forEach(b=>b.onclick=()=>{(fcS.ok+fcS.missed.length)?fcSummary(w):fcSetup(w)});
 const A=$("#fc_ans",w),chk=$("#fc_chk",w);let pick=null,judge=null;
 const choose=(b,fn)=>{if(S.lock)return;$$(".op",A).forEach(x=>x.classList.toggle("sel",x===b));pick=b;judge=fn;chk.disabled=false;try{navigator.vibrate&&navigator.vibrate(5)}catch(e){}};
 if(S.type==="mc"){const pool=isF?CHARTPATTERNS:CANDLES;let cand=pool.filter(x=>x!==p&&(isF||Math.abs(x.n-p.n)<=1));if(cand.length<3)cand=pool.filter(x=>x!==p);const opts=shuf([p].concat(shuf(cand.slice()).slice(0,3)));
  A.innerHTML=`<div class="ops mc4">${opts.map((o,i)=>`<button class="op" data-o="${o.id}"><span class="ok-k">${i+1}</span>${esc(o.name)}</button>`).join("")}</div>`;
  $$("[data-o]",A).forEach(b=>b.onclick=()=>choose(b,()=>{const ok=b.dataset.o===p.id;$$("[data-o]",A).forEach(x=>{x.disabled=true;if(x.dataset.o===p.id)x.classList.add("ok");else if(x===b)x.classList.add("no")});
   return[ok,ok?"":`Du hast „${esc((pool.find(x=>x.id===b.dataset.o)||{}).name)}“ gewählt.`]}))}
 if(S.type==="dir"){A.innerHTML=`<div class="ops dirs">${[["bull","Bullisch","g"],["bear","Bärisch","r"],["neutral","Neutral","n"]].map(d=>`<button class="op dir ${d[2]}" data-d="${d[0]}"><span class="dd"></span>${d[1]}</button>`).join("")}</div>`;
  $$("[data-d]",A).forEach(b=>b.onclick=()=>choose(b,()=>{const ok=b.dataset.d===p.dir;$$("[data-d]",A).forEach(x=>{x.disabled=true;if(x.dataset.d===p.dir)x.classList.add("ok");else if(x===b)x.classList.add("no")});return[ok,""]}))}
 if(S.type==="type"){A.innerHTML=`<form id="fc_f" autocomplete="off"><input class="tin" id="fc_i" placeholder="Name des Musters" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">
  <div class="fc-tip">Deutsch oder Englisch · Groß/klein und kleine Tippfehler sind egal</div><button type="button" class="b3 gh sm" id="fc_skip">WEISS NICHT</button></form>`;
  const inp=$("#fc_i",A);inp.addEventListener("input",()=>{chk.disabled=!inp.value.trim()});
  const tj=()=>{const val=inp.value.trim();const m=fcMatch(p,val);let info;if(m){info=m.d===0?`Deine Antwort: „${esc(val)}“`:`Fast exakt – richtig geschrieben: <b>${esc(m.n)}</b>`}
   else{const pool=CANDLES.concat(CHARTPATTERNS);const o=pool.find(x=>x!==p&&fcMatch(x,val));info=o?`„${esc(val)}“ wäre <b>${esc(o.name)}</b> – das sieht anders aus.`:`Deine Antwort: „${esc(val)}“`}
   inp.blur();inp.disabled=true;inp.classList.add(m?"ok":"no");return[!!m,info]};
  $("#fc_f",A).onsubmit=e=>{e.preventDefault();if(S.lock)return;if(!inp.value.trim()){inp.classList.remove("shake");void inp.offsetWidth;inp.classList.add("shake");return}judge=tj;chk.click()};
  $("#fc_skip",A).onclick=()=>{if(S.lock)return;judge=()=>{inp.disabled=true;return[false,"Kein Problem – die Karte kommt bald wieder."]};chk.disabled=false;chk.click()};
  if(S.i>0||S.focus)setTimeout(()=>inp.focus({preventScroll:true}),reduce?0:420);judge=tj}
 chk.onclick=()=>{if(S.lock||chk.disabled||!judge)return;const [ok,info]=judge();fcAnswer(w,ok,info,pick||chk)};
 S.lock=false;goSvg($("#fc",w),reduce?0:200);
 requestAnimationFrame(()=>{const fcEl=$("#fc",w);setTimeout(()=>fcEl&&fcEl.classList.remove("deal"),600)})}
function fcAnswer(w,ok,info,btn){const S=fcS,it=S.deck[S.i],p=it.p,isF=it.t==="f",N=S.deck.length;S.lock=true;
 if(ok){S.ok++;S.streak++;S.best=Math.max(S.best,S.streak)}else{S.streak=0;S.missed.push(it.id)}
 srsUpd(it.id,S.type,ok);const goalNow=bumpDaily();
 try{navigator.vibrate&&navigator.vibrate(ok?10:[10,40,10])}catch(e){}
 const st=$("#tr_st",w);st.classList.toggle("on",S.streak>0);$("b",st).textContent=S.streak;st.classList.remove("pop","shake");void st.offsetWidth;st.classList.add(ok?"pop":"shake");
 $(".tpb i",w).style.transform=`scaleX(${(S.i+1)/N})`;
 const dirW=p.dir==="bull"?"bullisch":p.dir==="bear"?"bärisch":"neutral";
 const head=ok?(S.streak>=3?`${S.streak} in Folge!`:PRAISE[Math.floor(Math.random()*PRAISE.length)]):S.type==="dir"?`Nicht ganz – ${dirW}`:"Leider falsch";
 const sub=info||(S.type==="dir"?`${esc(p.name)} gilt als ${dirW}.`:"");
 $("#fc_back",w).innerHTML=`<div class="fb-name">${esc(p.name)}</div>${p.en&&p.en!==p.name?`<div class="fb-en">${esc(p.en)}</div>`:""}
  <div class="fb-chips"><span class="cp ${p.dir==="bull"?"g":p.dir==="bear"?"r":""}">${p.dir==="bull"?"Bullisch":p.dir==="bear"?"Bärisch":"Neutral"}</span><span class="cp">${isF?"Formation":nTxt(p.n)}</span>${p.bk&&/%/.test(p.bk)?`<span class="cp">${esc(p.bk.split(" · ")[0])}</span>`:""}</div>
  <div class="fb-mini">${isF?chartSVG(p):candleSVG(p)}</div><p class="fb-what">${esc(p.what)}</p>`;
 setTimeout(()=>{const c=$("#fc",w);c&&c.classList.add("flip")},reduce?0:S.type!=="type"?260:60);
 const last=S.i+1>=N;const F=$("#fbar",w);
 F.className="fbar "+(ok?"ok":"no");
 F.innerHTML=`<div class="fb-h"><span class="fb-i">${ok?I.check:I.close}</span><div style="min-width:0"><b>${head}</b>${sub?`<span>${sub}</span>`:""}${!ok&&S.type!=="dir"?`<span>Lösung: <b>${esc(p.name)}</b></span>`:""}</div></div>
  <div class="fb-b"><a class="b3 gh" href="#/${isF?"formation":"kerze"}/${p.id}">DETAILS</a><button class="b3 ${ok?"gr":"rd"}" id="fc_n">${last?"AUSWERTUNG":"WEITER"}</button></div>`;
 if(ok)setTimeout(()=>burst($(".fb-i",F),12),reduce?0:180);
 $("#fc_n",F).onclick=()=>{S.i++;if(S.i>=N)fcSummary(w);else fcCard(w)};
 if(goalNow){S.goal=true;toast(`Tagesziel geschafft · ${dayStreak().days} ${dayStreak().days===1?"Tag":"Tage"} in Folge`)}}
function fcSummary(w){fcS.done=true;const S=fcS,done=S.missed.length+S.ok,N=done||1,pct=S.ok/N,d=daily(),st=dayStreak();const v=w.closest(".view");if(v)v.scrollTop=0;
 const msg=pct>=.9?"Hervorragend. Du erkennst die Muster sicher.":pct>=.7?"Gut gemacht. Die Fehler kommen bald wieder.":pct>=.4?"Solide Basis – wiederhole die Fehler gleich nochmal.":"Am Anfang normal. Schau dir die Muster unten nochmal an.";
 const missed=[...new Set(S.missed)].map(fcItem).filter(Boolean);
 w.innerHTML=`${trTop('<div class="trt-t">Auswertung</div>',trStreak(st.days||0))}
 <div class="tr-body"><div class="sum-hero r"><div class="trophy">${pct>=.7?I.check:I.cards}</div><h1 class="th1">${pct>=.7?"Runde geschafft!":"Runde beendet"}</h1><p class="tp">${msg}</p></div>
 <div class="sstats r"><div class="sst gr"><small>RICHTIG</small><b><span data-count="${Math.round(pct*100)}">0</span>%</b><span>${S.ok} von ${done}</span></div><div class="sst am"><small>SERIE</small><b data-count="${S.best}">0</b><span>beste Serie</span></div><div class="sst bl"><small>HEUTE</small><b><span data-count="${Math.min(d.n,GOAL)}">0</span>/${GOAL}</b><span>${st.days?`${st.days} ${st.days===1?"Tag":"Tage"} in Folge`:"Tagesziel"}</span></div></div>
 ${missed.length?`<div class="tl r">Nochmal anschauen</div><div class="box miss r">${missed.map(it=>`<a class="ms-row" href="#/${it.t==="f"?"formation":"kerze"}/${it.p.id}"><div class="ms-th">${it.t==="f"?chartSVG(it.p):candleSVG(it.p)}</div><div style="flex:1;min-width:0"><b>${esc(it.p.name)}</b><span>${it.p.dir==="bull"?"Bullisch":it.p.dir==="bear"?"Bärisch":"Neutral"} · ${esc(it.p.what.split(". ")[0])}</span></div>${I.chev}</a>`).join("")}</div>`:""}
 <a class="b3 gh wide r" href="#/training">ZUM LERNPFAD</a></div>
 <div class="fbar two">${missed.length?`<button class="b3 gh" id="fc_rep">FEHLER (${missed.length})</button>`:`<button class="b3 gh" id="fc_done">FERTIG</button>`}<button class="b3 bl" id="fc_again">NEUE RUNDE</button></div>`;
 $$("[data-exit]",w).forEach(b=>b.onclick=()=>fcSetup(w));
 if(missed.length)$("#fc_rep",w).onclick=()=>{FC.type=S.type;fcStart(w,fcDeck(S.mode,S.type,missed.map(m=>m.id)))};else $("#fc_done",w).onclick=()=>fcSetup(w);
 $("#fc_again",w).onclick=()=>fcStart(w,fcDeck(S.mode,S.type));
 reveal(w);if(pct>=.7)setTimeout(()=>burst($(".trophy",w),16),reduce?0:500)}

/* iOS-Standalone: 100lvh-Hülle (CSS html.sa). Prüfen, ob WebKit den Viewport danach wirklich vergrößert; sonst normales Layout (html.sa-short). */
const isSA=()=>navigator.standalone===true||(window.matchMedia&&matchMedia("(display-mode: standalone)").matches);
let saChecks=0;
function saCheck(){const R=document.documentElement;const sat=parseFloat(getComputedStyle(R).getPropertyValue("--sat"))||0;if(!isSA()||sat<1){R.classList.remove("sa","sa-short");return}
 if(!R.classList.contains("sa-short"))R.classList.add("sa");
 const hh=R.getBoundingClientRect().height,ih=window.visualViewport?visualViewport.height:innerHeight;
 if(R.classList.contains("sa")&&hh-ih>2&&saChecks>=2){R.classList.remove("sa");R.classList.add("sa-short")}}
saCheck();[400,1500].forEach(t=>setTimeout(()=>{saChecks++;saCheck()},t));addEventListener("resize",saCheck);
window.__vh=()=>{const R=document.documentElement,cs=getComputedStyle(R),tb=document.querySelector(".tabbar");return{ih:innerHeight,iw:innerWidth,sh:screen.height,sw:screen.width,sa:isSA(),mode:R.classList.contains("sa")?"lvh":R.classList.contains("sa-short")?"kurz":"normal",sat:cs.getPropertyValue("--sat"),hh:Math.round(R.getBoundingClientRect().height),sab:cs.getPropertyValue("--sab"),gap:tb?Math.round(innerHeight-tb.getBoundingClientRect().bottom):0}};
/* ---------- Router ---------- */
/* iOS: nur echte Scrollflächen dürfen sich bewegen – Kopf, Tab-Leiste, Prüfen-Leiste nie */
document.addEventListener("touchmove",e=>{if(e.touches.length!==1)return;const t=e.target;if(t&&t.closest&&t.closest(".view,.hscroll,.filters,.tablewrap,input,textarea,select"))return;if(e.cancelable)e.preventDefault()},{passive:false});
const ROUTES={start:[V.start,0,"start"],lernen:[V.lernen,0,"lernen"],strategien:[V.strategien,0,"strategien"],timing:[V.timing,0,"timing"],analyse:[V.analyse,0,"analyse"],
 kerzen:[V.kerzen,1,"lernen"],kerze:[V.kerze,2,"lernen"],formation:[V.formation,2,"lernen"],strategie:[V.strategie,1,"strategien"],rechner:[V.rechner,1,"timing"],glossar:[V.glossar,1,"lernen"],quellen:[V.quellen,1,"strategien"],einstellungen:[V.einstellungen,1,null],lesson:[V.lesson,1,"lernen"],
 training:[V.training,1,"lernen"],karten:[V.karten,2,"lernen"]};
let curDepth=0,curTab="start",curKey="",navCount=0;
function parse(){const h=location.hash.replace(/^#\/?/,"").split("/");let a=h[0],b=h[1];if(!a||!ROUTES[a])a="start";if(a==="lernen"&&b)return{r:ROUTES.lesson,arg:b,key:"lesson/"+b};return{r:ROUTES[a],arg:b,key:a+(b&&a!=="kerzen"?"/"+b:"")}}
function go(h){location.hash=h}
const isTrain=k=>/^(training|karten)/.test(k);
let lastPt=null,lastHash=location.hash||"#/start";
addEventListener("pointerdown",e=>{lastPt={x:e.clientX,y:e.clientY}},{capture:true,passive:true});
const placeThumb=(t,b)=>{if(!b)return;t.style.width=b.offsetWidth+"px";t.style.transform=`translateX(${b.offsetLeft-2}px)`};
function initSegs(v,prev){if(!v)return;$$(".seg",v).forEach((s,i)=>{let t=$(".thumb",s);if(!t){t=document.createElement("div");t.className="thumb";s.prepend(t)}const on=$("button.on",s);const p=prev&&prev[i];
 t.style.transition="none";if(p&&p.w){t.style.transform=p.x;t.style.width=p.w}else placeThumb(t,on);void t.offsetWidth;t.style.transition="";if(p&&p.w)requestAnimationFrame(()=>placeThumb(t,on))})}
function onScroll(v){$(".topbar").classList.toggle("scrolled",v.scrollTop>38);const sb=$(".sbar",v);if(sb)sb.classList.toggle("stuck",sb.getBoundingClientRect().top<=$(".topbar").getBoundingClientRect().bottom+1);document.body.classList.toggle("tr-sc",v.scrollTop>6)}
function setMode(tr){document.body.classList.toggle("train",tr);const m=$('meta[name="theme-color"]');if(m)m.content=tr?"#10131a":"#0f0e0c"}
let morphing=false;
function route(){const {key}=parse();const want=isTrain(key),has=document.body.classList.contains("train");
 if(want&&!has&&curKey)trainRet=lastHash&&!isTrain(lastHash.replace(/^#\/?/,""))?lastHash:"#/lernen";
 lastHash=location.hash||"#/start";
 if(want!==has&&curKey&&!reduce){morph(want);return}
 setMode(want);render()}
function morph(toTrain){if(morphing){setMode(toTrain);render();return}morphing=true;const p=lastPt||{x:innerWidth/2,y:innerHeight*.6};
 const m=document.createElement("div");m.className="morph "+(toTrain?"to-l":"to-d");m.style.setProperty("--x",p.x+"px");m.style.setProperty("--y",p.y+"px");
 m.innerHTML=`<div class="mk">${toTrain?`${I.cards}<b>Trainingsmodus</b>`:`<b>TradeLab</b>`}</div>`;document.body.appendChild(m);
 let done=false;const mid=()=>{if(done)return;done=true;setMode(toTrain);render(false,true);requestAnimationFrame(()=>{m.classList.add("out");setTimeout(()=>{m.remove();morphing=false},420)})};
 m.addEventListener("animationend",e=>{if(e.target===m)mid()},{once:false});setTimeout(mid,700)}
function render(inPlace,instant){const {r,arg,key}=parse();const res=r[0](arg);const depth=r[1];const tab=r[2]||curTab;
 const vp=$("#viewport");const old=$(".view.current",vp);
 if(old&&(inPlace===true||key===curKey)){const st=old.scrollTop;const prev=$$(".seg",old).map(s=>{const t=$(".thumb",s);return t?{x:t.style.transform,w:t.style.width}:null});
  old.innerHTML=res.html;old.scrollTop=st;initSegs(old,prev);res.after&&res.after(old);reveal(old);setTitle(res.title,depth,key);return}
 const v=document.createElement("section");v.className="view current";v.innerHTML=res.html;vp.appendChild(v);
 const dir=!old?"tab":depth>curDepth?"fwd":depth<curDepth?"back":(tab!==curTab||depth===0?"tab":"fwd");
 const anim=!reduce&&!instant;
 if(anim)v.classList.add("enter-"+dir);if(old){old.classList.remove("current");if(!anim)old.remove();else{old.classList.add("leave-"+dir);const kill=()=>old.remove();old.addEventListener("animationend",kill,{once:true});setTimeout(kill,600)}}
 v.addEventListener("animationend",e=>{if(e.target===v)v.classList.remove("enter-"+dir)});
 v.addEventListener("scroll",()=>onScroll(v),{passive:true});onScroll(v);
 curDepth=depth;curKey=key;curTab=tab;setTab(tab);setTitle(res.title,depth,key);initSegs(v);res.after&&res.after(v);reveal(v,instant?60:dir==="fwd"||dir==="back"?120:30)}
function setTitle(t,depth,key){$(".tb-title").textContent=t||"";$("#btn-back").classList.toggle("invis",depth===0);$("#btn-set").classList.toggle("invis",key==="einstellungen")}
function setTab(t){$$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.t===t));const nav=$(".tabbar");const a=$(".tab.active",nav),pill=$(".tab-pill",nav);if(!pill)return;if(!a){pill.style.opacity=0;return}
 requestAnimationFrame(()=>{pill.style.opacity=1;pill.style.width=a.offsetWidth+"px";pill.style.transform=`translateX(${a.offsetLeft}px)`})}
const parentOf=()=>{const k=parse().key.split("/")[0];if(k==="lesson"||k==="kerzen"||k==="training")return"#/lernen";if(k==="karten")return"#/training";if(k==="kerze")return"#/kerzen/muster";if(k==="formation")return"#/kerzen/chart";if(k==="strategie")return"#/strategien";return"#/"+curTab};
function shell(){
 $("#app").innerHTML=`<header class="topbar"><button class="nav-btn back invis" id="btn-back" aria-label="Zurück">${I.back}<span>Zurück</span></button><div class="tb-title"></div><button class="nav-btn" id="btn-set" aria-label="Einstellungen">${I.gear}</button></header>
 <div id="viewport"></div><nav class="tabbar"><div class="tab-pill"></div>${TABS.map(t=>`<button class="tab" data-t="${t[0]}">${t[2]}<span>${t[1]}</span></button>`).join("")}</nav>`;
 $$(".tab").forEach(b=>b.onclick=()=>{if(location.hash==="#/"+b.dataset.t||(!location.hash&&b.dataset.t==="start")){const v=$(".view.current");v&&v.scrollTo({top:0,behavior:reduce?"auto":"smooth"});return}go("#/"+b.dataset.t)});
 $("#btn-back").onclick=()=>{if(navCount>0){navCount-=2;history.back()}else go(parentOf())};
 $("#btn-set").onclick=()=>go("#/einstellungen");
 window.addEventListener("hashchange",()=>{navCount++;route()});
 window.addEventListener("resize",()=>{initSegs($(".view.current"));setTab(curTab)});
 setInterval(()=>{$$("[data-clock]").forEach(e=>e.textContent=berlinHM(new Date()))},10000)}
shell();route();
if("serviceWorker" in navigator&&location.protocol==="https:"){const had=!!navigator.serviceWorker.controller;let rl=false;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(had&&!rl){rl=true;location.reload()}});navigator.serviceWorker.register("sw.js").then(r=>r.update()).catch(()=>{})}
window.__tl={demoChart,go,applyAccent};

window.__fc=()=>fcS&&fcS.deck[fcS.i]&&fcS.deck[fcS.i].p.id;
window.__fcTypo=id=>{const p=CANDLES.concat(CHARTPATTERNS).find(x=>x.id===id);const n=(p.en||p.name).toLowerCase();const i=Math.floor(n.length/2);return n.length>6?n.slice(0,i)+n.slice(i+1):n};
window.__fcTest=()=>{const P=id=>CANDLES.concat(CHARTPATTERNS).find(x=>x.id===id);const T=[["morningstar","morgenstern"],["morningstar","Morning Starr"],["bearflag","barenflagge"],["bearflag","Bärenflage"],["sks","head and shoulders"],["sks","kopf schulter"],["cup","Tasse mit Henkel"],["bullengulf","bullish engulfin"],["3soldiers","drei weisse soldaten"],["hammer","hamer"],["hammer","hanging man"],["doji","doji"],["dragonfly","doji"],["shootingstar","sternschnupe"],["dtop","double bottom"]];return T.map(([id,v])=>id+":"+v+"="+(fcMatch(P(id),v)?"OK":"no"))};
})();

