(()=>{
const CLASSIC=window.STC_PLAYERS, HARD=window.STC_HARD_PLAYERS, MAX=8, LAUNCH='2026-09-16';
const $=s=>document.querySelector(s), input=$('#guessInput'), suggestions=$('#suggestions'), rows=$('#rows'), form=$('#guessForm'), message=$('#message'), endPanel=$('#endPanel'), board=$('.board'), headers=$('.headers');
let mode='daily', answer=null, guesses=[], finished=false, selected=null;
const DAY=86400000;
function pool(){return mode==='hard'?HARD:CLASSIC}
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function ordinal(n){const v=n%100;return n+(['th','st','nd','rd'][(v-20)%10]||['th','st','nd','rd'][v]||'th')}
function placeText(p){return p.placementDisplay||ordinal(p.placement)}
function dateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function localMidnightMs(key){const [y,m,d]=key.split('-').map(Number);return new Date(y,m-1,d).getTime()}
function puzzleNumber(){return Math.floor((localMidnightMs(dateKey())-localMidnightMs(LAUNCH))/DAY)+1}
function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(a){return()=>{let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function shuffledPool(items,seed){const a=[...items],r=mulberry32(hash(seed));for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
// Do not change this Classic seed: it preserves the already-published Daily sequence.
const classicShuffled=shuffledPool(CLASSIC,'STCdle-S1-S8-v1');
const hardShuffled=shuffledPool(HARD,'Rydle-Hard-AllEvents-v1');
function dailyAnswer(){const n=Math.max(1,puzzleNumber()), a=mode==='hard'?hardShuffled:classicShuffled;return a[(n-1)%a.length]}
function stateKey(){return mode==='hard'?`rydle_hard_daily_${dateKey()}`:`stcdle_daily_${dateKey()}`}
function loadDaily(){answer=dailyAnswer();const P=pool(),s=JSON.parse(localStorage.getItem(stateKey())||'null');guesses=s?.guesses?.map(id=>P.find(p=>p.id===id)).filter(Boolean)||[];finished=!!s?.finished}
function saveDaily(){localStorage.setItem(stateKey(),JSON.stringify({guesses:guesses.map(g=>g.id),finished}))}
function randomPractice(){const P=CLASSIC;let next;do{next=P[Math.floor(Math.random()*P.length)]}while(P.length>1&&next?.id===answer?.id);answer=next;guesses=[];finished=false;selected=null}
function placementRange(p){return [p.placementLow??p.placement,p.placementHigh??p.placement]}
function placementDistance(a,b){const [al,ah]=placementRange(a),[bl,bh]=placementRange(b);if(ah<bl)return bl-ah;if(bh<al)return al-bh;return 0}
function samePlacement(a,b){const [al,ah]=placementRange(a),[bl,bh]=placementRange(b);return al===bl&&ah===bh}
function placementArrow(g){if(samePlacement(g,answer))return '';const [gl,gh]=placementRange(g),[al,ah]=placementRange(answer);const gm=(gl+gh)/2,am=(al+ah)/2;return am<gm?' ↑':' ↓'}
function compare(g){
 const hard=mode==='hard';
 const seasonDistance=hard?Math.abs(g.eventIndex-answer.eventIndex):Math.abs(g.season-answer.season);
 const pd=placementDistance(g,answer), pExact=samePlacement(g,answer);
 const cells=[
  [g.displayName,g.id===answer.id?'green':'gray'],
  [`S${g.season}${g.season===answer.season?'':(hard?answer.eventIndex>g.eventIndex:answer.season>g.season)?' ↑':' ↓'}`,seasonDistance===0?'green':seasonDistance===1?'yellow':'gray'],
  [`${placeText(g)}${placementArrow(g)}`,pExact?'green':pd<=2?'yellow':'gray'],
  [g.gender,g.gender===answer.gender?'green':'gray'],
  [g.tribeColor,g.tribeColor===answer.tribeColor?'green':'gray'],
  [g.returnee?'Yes':'No',g.returnee===answer.returnee?'green':'gray']
 ];
 if(hard)cells.push([g.format,g.format===answer.format?'green':'gray']);
 return cells;
}
function setBoardMode(){const hard=mode==='hard';board.classList.toggle('hard-board',hard);headers.innerHTML=hard?'<div>Castaway</div><div>Season</div><div>Place</div><div>Gender</div><div>Color</div><div>Returnee</div><div>Format</div>':'<div>Castaway</div><div>Season</div><div>Place</div><div>Gender</div><div>Color</div><div>Returnee</div>'}
function render(){
 setBoardMode();rows.innerHTML='';
 guesses.forEach(g=>{const r=document.createElement('div');r.className='guess-row';compare(g).forEach(([t,c])=>{const d=document.createElement('div');d.className=`cell ${c}`;d.textContent=t;r.appendChild(d)});rows.appendChild(r)});
 const count=mode==='hard'?7:6;for(let i=guesses.length;i<MAX;i++){const r=document.createElement('div');r.className='guess-row';for(let j=0;j<count;j++){const d=document.createElement('div');d.className='cell empty';r.appendChild(d)}rows.appendChild(r)}
 const won=guesses.at(-1)?.id===answer.id;
 $('#puzzleMeta').textContent=mode==='daily'?`Rydle #${Math.max(1,puzzleNumber())} · ${dateKey()}`:mode==='hard'?`Rydle Hard #${Math.max(1,puzzleNumber())} · ${dateKey()}`:'Random practice puzzle';
 $('#modeDescription').textContent=mode==='daily'?'One full-season appearance. Eight guesses. Same puzzle for everyone today.':mode==='practice'?'Unlimited random Classic puzzles. Practice games do not affect your streak.':'Every STC event counts. Full seasons and minis. Eight guesses.';
 document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));input.disabled=finished;$('#guessBtn').disabled=finished;$('#newPracticeBtn').classList.toggle('hidden',mode!=='practice');
 if(finished){endPanel.classList.remove('hidden');$('#endTitle').textContent=won?'You survived!':'The tribe has spoken.';$('#endAnswer').innerHTML=`The answer was <strong>${answer.displayName}</strong> — ${placeText(answer)}, ${answer.startingTribe} (${answer.tribeColor}).`;$('#nextPuzzle').textContent=mode==='practice'?'':'Next daily puzzle arrives at local midnight.'}else endPanel.classList.add('hidden');
 $('#legendText').innerHTML=mode==='hard'?'<span class="swatch green"></span> Exact match. <span class="swatch yellow"></span> Season is one <em>event</em> away chronologically or placement is within 2. Gray means farther/different. Format is Full or Mini.':'<span class="swatch green"></span> Exact match. <span class="swatch yellow"></span> Season is 1 away or placement is within 2. Gray means farther/different.';
}
function showSuggestions(){
 const q=norm(input.value.trim());suggestions.innerHTML='';selected=null;if(!q){suggestions.classList.add('hidden');return}
 const P=pool(),used=new Set(guesses.map(g=>g.id));
 const hits=P.filter(p=>{if(used.has(p.id))return false;const fullName=norm(p.name),words=fullName.split(/\s+/);return fullName.includes(q)||words.some(word=>word.startsWith(q))}).sort((a,b)=>{const aName=norm(a.name),bName=norm(b.name),aWords=aName.split(/\s+/),bWords=bName.split(/\s+/);function score(name,words){if(name===q)return 0;if(words.some(word=>word===q))return 1;if(words[0]?.startsWith(q))return 2;if(words.some(word=>word.startsWith(q)))return 3;if(name.includes(q))return 4;return 5}const d=score(aName,aWords)-score(bName,bWords);if(d!==0)return d;if(aName===bName)return (a.eventIndex??a.season)-(b.eventIndex??b.season);return aName.localeCompare(bName)}).slice(0,12);
 if(!hits.length){suggestions.classList.add('hidden');return}hits.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='suggestion';b.textContent=p.displayName;b.addEventListener('click',()=>{selected=p;input.value=p.displayName;suggestions.classList.add('hidden');input.focus()});suggestions.appendChild(b)});suggestions.classList.remove('hidden')
}
function statsKey(){return mode==='hard'?'rydle_hard_stats_v1':'stcdle_stats_v1'}
function getStats(){return JSON.parse(localStorage.getItem(statsKey())||'{"played":0,"wins":0,"streak":0,"maxStreak":0,"lastCompleted":null,"distribution":[0,0,0,0,0,0,0,0]}')}
function updateStats(won){if(mode==='practice')return;const today=dateKey(),s=getStats();if(s.lastCompleted===today)return;const yesterday=dateKey(new Date(Date.now()-DAY));s.played++;if(won){s.wins++;s.streak=s.lastCompleted===yesterday?s.streak+1:1;s.maxStreak=Math.max(s.maxStreak,s.streak);s.distribution[guesses.length-1]++}else s.streak=0;s.lastCompleted=today;localStorage.setItem(statsKey(),JSON.stringify(s))}
function renderStats(){const oldMode=mode==='practice'?'daily':mode,s=JSON.parse(localStorage.getItem(oldMode==='hard'?'rydle_hard_stats_v1':'stcdle_stats_v1')||'{"played":0,"wins":0,"streak":0,"maxStreak":0,"lastCompleted":null,"distribution":[0,0,0,0,0,0,0,0]}');$('#statsTitle').textContent=oldMode==='hard'?'Hard statistics':'Daily statistics';$('#statPlayed').textContent=s.played;$('#statWin').textContent=s.played?Math.round(s.wins/s.played*100)+'%':'0%';$('#statStreak').textContent=s.streak;$('#statMax').textContent=s.maxStreak;const box=$('#distribution');box.innerHTML='';const max=Math.max(1,...s.distribution);s.distribution.forEach((n,i)=>{const r=document.createElement('div');r.className='dist-row';r.innerHTML=`<span>${i+1}</span><div class="dist-bar" style="width:${Math.max(8,n/max*100)}%">${n}</div>`;box.appendChild(r)})}
function emojiResult(){const won=guesses.at(-1)?.id===answer.id;const title=mode==='hard'?`Rydle Hard #${Math.max(1,puzzleNumber())} ${won?guesses.length:'X'}/8`:mode==='daily'?`Rydle #${Math.max(1,puzzleNumber())} ${won?guesses.length:'X'}/8`:`Rydle Practice ${won?guesses.length:'X'}/8`;const lines=guesses.map(g=>compare(g).map(([,c])=>c==='green'?'🟩':c==='yellow'?'🟨':'⬛').join(''));return `${title}\n\n${lines.join('\n')}`}
async function share(){const text=emojiResult();try{if(navigator.share)await navigator.share({text});else if(navigator.clipboard){await navigator.clipboard.writeText(text);message.textContent='Results copied to clipboard.'}else window.prompt('Copy your results:',text)}catch(e){if(e?.name!=='AbortError')window.prompt('Copy your results:',text)}}
form.addEventListener('submit',e=>{e.preventDefault();if(finished)return;const P=pool();let p=selected;const typed=norm(input.value.trim());if(!p)p=P.find(x=>norm(x.displayName)===typed);if(!p){message.textContent='Choose an appearance from the suggestions.';showSuggestions();return}if(guesses.some(g=>g.id===p.id)){message.textContent='You already guessed that appearance.';return}guesses.push(p);input.value='';selected=null;suggestions.classList.add('hidden');const won=p.id===answer.id;if(won||guesses.length===MAX){finished=true;updateStats(won)}if(mode!=='practice')saveDaily();message.textContent='';render()});
input.addEventListener('input',showSuggestions);input.addEventListener('focus',showSuggestions);document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))suggestions.classList.add('hidden')});
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;message.textContent='';input.value='';selected=null;if(mode==='practice')randomPractice();else loadDaily();render()}));
$('#newPracticeBtn').addEventListener('click',()=>{randomPractice();render();input.focus()});$('#shareBtn').addEventListener('click',share);$('#helpBtn').addEventListener('click',()=>$('#helpDialog').showModal());$('#statsBtn').addEventListener('click',()=>{renderStats();$('#statsDialog').showModal()});document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close).close()));
loadDaily();render();
})();
