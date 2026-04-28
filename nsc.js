
// BACKGROUND — Animated Neural Network Canvas
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [];

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);

class Node {
  constructor() {
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.vx = (Math.random()-.5)*.4; this.vy = (Math.random()-.5)*.4;
    this.r = Math.random()*2+1;
    this.col = Math.random()>.5 ? '124,58,237' : '6,182,212';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if(this.x<0||this.x>W) this.vx*=-1;
    if(this.y<0||this.y>H) this.vy*=-1;
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(${this.col},.75)`; ctx.fill();
  }
}
for(let i=0;i<80;i++) nodes.push(new Node());

(function loop(){
  ctx.clearRect(0,0,W,H);
  nodes.forEach(n=>{ n.update(); n.draw(); });
  for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
    const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d<140){ ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.strokeStyle=`rgba(124,58,237,${(1-d/140)*.22})`; ctx.lineWidth=.5; ctx.stroke(); }
  }
  requestAnimationFrame(loop);
})();

// PARTICLES
const pc=document.getElementById('particles');
for(let i=0;i<22;i++){
  const p=document.createElement('div'); p.className='particle';
  const s=Math.random()*5+2;
  const c=['rgba(124,58,237,.7)','rgba(6,182,212,.6)','rgba(157,92,246,.5)','rgba(192,132,252,.4)','rgba(34,211,238,.4)'];
  p.style.cssText=`width:${s}px;height:${s}px;background:${c[Math.floor(Math.random()*c.length)]};left:${Math.random()*100}%;animation-duration:${Math.random()*14+8}s;animation-delay:-${Math.random()*14}s`;
  pc.appendChild(p);
}

// COUNTER
function animateCounters(){
  document.querySelectorAll('.stat-val').forEach(el=>{
    const html=el.innerHTML, num=parseFloat(html.replace(/<[^>]+>/g,'').replace(/[^0-9.]/g,''));
    if(!num) return;
    let start=0; const inc=num/(1800/16);
    const t=setInterval(()=>{
      start=Math.min(start+inc,num);
      const v=start%1===0?Math.floor(start):start.toFixed(2);
      const s=html.replace(/<[^>]+>/g,'');
      const suffix=s.replace(/[0-9.]/g,'');
      const spanMatch=el.innerHTML.match(/<span>([^<]+)<\/span>/);
      el.innerHTML=v+(spanMatch?`<span>${spanMatch[1]}</span>`:suffix);
      if(start>=num) clearInterval(t);
    },16);
  });
}

// OBSERVER
const io=new IntersectionObserver(e=>{e.forEach(x=>{
  if(x.isIntersecting){ x.target.classList.add('visible'); if(x.target.closest('.stats-band')) animateCounters(); }
})},{threshold:.12});
document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));
document.querySelectorAll('.stats-band').forEach(el=>io.observe(el));

// HAMBURGER
const hb=document.getElementById('hamburger'), mm=document.getElementById('mobileMenu');
hb.addEventListener('click',()=>{ const o=mm.classList.toggle('open'); hb.classList.toggle('open',o); document.body.style.overflow=o?'hidden':''; });
function closeMob(){ mm.classList.remove('open'); hb.classList.remove('open'); document.body.style.overflow=''; }
function msub(e,el){ e.preventDefault(); el.parentElement.classList.toggle('m-open'); }
mm.querySelectorAll('a:not([onclick])').forEach(a=>a.addEventListener('click',closeMob));

// FAQ
function toggleFaq(btn){ const item=btn.parentElement; document.querySelectorAll('.faq-item.open').forEach(i=>{if(i!==item)i.classList.remove('open')}); item.classList.toggle('open'); }
