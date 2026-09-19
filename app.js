(function(){
'use strict';
function $(s,c){return (c||document).querySelector(s);}
function $all(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));}
/* ---------- SOUND (WebAudio synth) ---------- */
var audioOn=false, actx=null;
function tone(f,d,type){ if(!audioOn) return; try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended')actx.resume(); var o=actx.createOscillator(),g=actx.createGain(); o.type=type||'square'; o.frequency.value=f+Math.random()*120; g.gain.value=.045; o.connect(g); g.connect(actx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d); o.stop(actx.currentTime+d);}catch(e){} }
function blip(f){ tone(f||440,.07); }
/* ---------- PRELOADER ---------- */
var pv=0, bootLines=['&gt; mount /dev/kz_rage ............ OK','&gt; load python.exe ............... 65%','&gt; inject sql_sorcery.dll ......... OK','&gt; compile html/css/js ..... 31k/20k/6k','&gt; bypass fears ................. DELETED','&gt; launch EYEPHORIA.EXE'], bi=0;
var ln=$('#load-num'), lb=$('#load-bar'), blog=$('#boot-log'), pre=$('#preloader');
var bootTimer=setInterval(function(){ if(bi<bootLines.length && blog){ var d=document.createElement('div'); d.innerHTML=bootLines[bi++]; blog.appendChild(d);} },160);
var li=setInterval(function(){ pv+=6+Math.random()*13; if(pv>=100){ pv=100; clearInterval(li); clearInterval(bootTimer); if(ln)ln.textContent='100'; if(lb)lb.style.width='100%'; setTimeout(function(){ if(pre){ pre.classList.add('done'); setTimeout(function(){ if(pre.parentNode)pre.parentNode.removeChild(pre); },750);} heroIntro(); },350);} if(ln)ln.textContent=Math.floor(pv); if(lb)lb.style.width=pv+'%'; },95);
setTimeout(function(){ var p=$('#preloader'); if(p){ p.classList.add('done'); setTimeout(function(){ if(p.parentNode)p.parentNode.removeChild(p); },750);} },7000); /* hard failsafe */
/* ---------- SMOOTH SCROLL (Lenis, guarded) ---------- */
try{ if(window.Lenis){ var lenis=new Lenis({duration:1.15,smoothWheel:true}); function raf(t){ lenis.raf(t); requestAnimationFrame(raf);} requestAnimationFrame(raf); if(window.ScrollTrigger){ lenis.on('scroll',function(){ if(window.ScrollTrigger)ScrollTrigger.update(); }); } } }catch(e){}
try{ if(window.gsap && window.ScrollTrigger){ gsap.registerPlugin(ScrollTrigger); } }catch(e){}
/* ---------- CURSOR + TRAIL ---------- */
var fine=window.matchMedia && window.matchMedia('(pointer:fine)').matches;
var dot=$('#cDot'), ring=$('#cRing');
var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
if(fine){ addEventListener('mousemove',function(e){ mx=e.clientX; my=e.clientY; if(dot)dot.style.transform='translate('+(mx-6)+'px,'+(my-6)+'px)'; spawnTrail(mx,my); },{passive:true});
(function loop(){ rx+=(mx-rx)*.16; ry+=(my-ry)*.16; if(ring){ var w=ring.offsetWidth||44; ring.style.transform='translate('+(rx-w/2)+'px,'+(ry-w/2)+'px)'; } requestAnimationFrame(loop); })();
$all('a,button,.hoverable,input').forEach(function(el){ el.addEventListener('mouseenter',function(){ if(ring)ring.classList.add('hovering'); blip(620); }); el.addEventListener('mouseleave',function(){ if(ring)ring.classList.remove('hovering'); }); });
}
var tc=$('#trail'), tctx=tc?tc.getContext('2d'):null, parts=[];
function sizeT(){ if(!tc)return; tc.width=innerWidth; tc.height=innerHeight; } sizeT(); addEventListener('resize',sizeT);
function spawnTrail(x,y){ if(!tctx)return; parts.push({x:x,y:y,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3-1,life:1,c:Math.random()>.5?'#CCFF00':'#FF00E5',s:Math.random()*5+2}); if(parts.length>320)parts.shift(); }
(function drawT(){ if(tctx){ tctx.clearRect(0,0,tc.width,tc.height); parts=parts.filter(function(p){return p.life>0;}); parts.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; p.vy+=.05; p.life-=.02; tctx.globalAlpha=Math.max(p.life,0); tctx.fillStyle=p.c; tctx.fillRect(p.x,p.y,p.s,p.s); }); tctx.globalAlpha=1; } requestAnimationFrame(drawT); })();
/* ---------- BG STARS (2D fallback grid + stars) ---------- */
var bg=$('#bg-stars'), bctx=bg?bg.getContext('2d'):null, stars=[];
function sizeB(){ if(!bg)return; bg.width=innerWidth; bg.height=innerHeight; var n=innerWidth<768?70:150; stars=[]; for(var i=0;i<n;i++)stars.push({x:Math.random()*bg.width,y:Math.random()*bg.height,z:Math.random()*1.4+.3,r:Math.random()*1.8+.4}); } sizeB(); addEventListener('resize',sizeB);
(function drawB(){ if(!bctx){return;} bctx.fillStyle='#0d0d0d'; bctx.fillRect(0,0,bg.width,bg.height); var t=Date.now()/1000; for(var i=0;i<stars.length;i++){ var s=stars[i]; s.y+=s.z*.4; if(s.y>bg.height)s.y=0; var tw=.35+.65*Math.abs(Math.sin(t*2+s.x)); bctx.fillStyle=s.z>1?'#CCFF00':'#ffffff'; bctx.globalAlpha=tw*.8; bctx.beginPath(); bctx.arc(s.x,s.y,s.r,0,7); bctx.fill(); } bctx.globalAlpha=.1; bctx.strokeStyle='#CCFF00'; bctx.lineWidth=1; var x,y; for(x=0;x<bg.width;x+=44){ bctx.beginPath(); bctx.moveTo(x,0); bctx.lineTo(x,bg.height); bctx.stroke(); } for(y=0;y<bg.height;y+=44){ bctx.beginPath(); bctx.moveTo(0,y); bctx.lineTo(bg.width,y); bctx.stroke(); } bctx.globalAlpha=1; requestAnimationFrame(drawB); })();
/* ---------- THREE.JS HERO: NEBULA DRIFT (center stays clean for the type) ---------- */
try{
if(window.THREE && $('#webgl')){
var canvas=$('#webgl');
var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
var scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x0d0d0d,0.06);
var camera=new THREE.PerspectiveCamera(60,1,.1,100); camera.position.set(0,1.1,8); camera.lookAt(0,-.4,0);
var isMobile=innerWidth<768;
/* ambient particle nebula — dim, slow, never fights the headline */
var pn=isMobile?300:750, pos=new Float32Array(pn*3), spd=new Float32Array(pn);
for(var pi=0;pi<pn;pi++){ pos[pi*3]=(Math.random()-.5)*26; pos[pi*3+1]=(Math.random()-.5)*14; pos[pi*3+2]=(Math.random()-.5)*10-2; spd[pi]=.15+Math.random()*.5; }
var pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
var pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9beaff,size:.05,transparent:true,opacity:.55})); scene.add(pts);
/* sparse lime accent dust */
var pn2=isMobile?80:200, pos2=new Float32Array(pn2*3);
for(var pj=0;pj<pn2;pj++){ pos2[pj*3]=(Math.random()-.5)*24; pos2[pj*3+1]=(Math.random()-.5)*12; pos2[pj*3+2]=(Math.random()-.5)*8-1; }
var pg2=new THREE.BufferGeometry(); pg2.setAttribute('position',new THREE.BufferAttribute(pos2,3));
var dust=new THREE.Points(pg2,new THREE.PointsMaterial({color:0xccff00,size:.07,transparent:true,opacity:.45})); scene.add(dust);
/* synthwave grid floor — sits below the text */
var grid=new THREE.GridHelper(60,44,0xccff00,0x1e3a00); grid.position.y=-3.4; grid.material.transparent=true; grid.material.opacity=.32; scene.add(grid);
/* side accent rock — parked right of the headline, never over it */
var rock=new THREE.Mesh(new THREE.IcosahedronGeometry(1.15,1),new THREE.MeshBasicMaterial({color:0xff00e5,wireframe:true,transparent:true,opacity:.5}));
rock.position.set(2.5,0.6,-1.0); scene.add(rock);
var rock2=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7,0),new THREE.MeshBasicMaterial({color:0x00f0ff,wireframe:true,transparent:true,opacity:.2}));
rock2.position.copy(rock.position); scene.add(rock2);
/* magenta aura sprite behind the rock — cheap cinematic bloom */
var glowCv=document.createElement('canvas'); glowCv.width=glowCv.height=128;
var gg=glowCv.getContext('2d'); var grd=gg.createRadialGradient(64,64,0,64,64,64);
grd.addColorStop(0,'rgba(255,0,229,.5)'); grd.addColorStop(.45,'rgba(255,0,229,.16)'); grd.addColorStop(1,'rgba(255,0,229,0)');
gg.fillStyle=grd; gg.fillRect(0,0,128,128);
var glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(glowCv),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
glow.scale.set(7.5,7.5,1); glow.position.copy(rock.position); scene.add(glow);
function sizeGL(){ var h=canvas.parentElement; var w=h.clientWidth, hh=h.clientHeight; renderer.setSize(w,hh,false); camera.aspect=w/hh; camera.updateProjectionMatrix(); if(w<768){ rock.position.set(2.4,-2.6,-3); rock.scale.setScalar(.7); } else { rock.position.set(2.5,0.6,-1.0); rock.scale.setScalar(1); } rock2.position.copy(rock.position); rock2.scale.copy(rock.scale); rock.userData.by=rock.position.y; } sizeGL(); addEventListener('resize',sizeGL);
var tmx=0,tmy=0; addEventListener('mousemove',function(e){ tmx=(e.clientX/innerWidth-.5); tmy=(e.clientY/innerHeight-.5); },{passive:true});
var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var t0=Date.now()/1000;
(function anim(){ requestAnimationFrame(anim); if(reduce)return; var t=Date.now()/1000-t0;
var pa=pg.attributes.position.array; for(var i=0;i<pn;i++){ pa[i*3+1]+=spd[i]*.008; pa[i*3]+=Math.sin(t*.4+i)*.0012; if(pa[i*3+1]>7)pa[i*3+1]=-7; } pg.attributes.position.needsUpdate=true;
dust.rotation.y=t*.02; pts.rotation.y=tmx*.08;
rock.rotation.x=t*.25; rock.rotation.y=t*.3; rock2.rotation.x=-t*.15; rock2.rotation.y=-t*.2;
rock.position.y=(rock.userData.by||0)+Math.sin(t*.8)*.28; rock2.position.copy(rock.position); glow.position.copy(rock.position);
var sy=window.scrollY||0; grid.position.z=(sy*.004)%1.36; pts.position.y=sy*.0006;
camera.position.x+=(tmx*.9-camera.position.x)*.04; camera.position.y+=((1.1-tmy*.7)-camera.position.y)*.04; camera.lookAt(0,-.4,0);
renderer.render(scene,camera); })();
}
}catch(e){ var wgl=$('#webgl'); if(wgl)wgl.style.display='none'; }
/* ---------- TOGGLES ---------- */
var sBtn=$('#soundBtn'); if(sBtn)sBtn.onclick=function(e){ audioOn=!audioOn; sBtn.textContent='SOUND:'+(audioOn?'ON':'OFF'); tone(880,.15); explode(e.clientX||innerWidth/2,e.clientY||200,20); };
var pBtn=$('#psychoBtn'); if(pBtn)pBtn.onclick=function(e){ document.body.classList.toggle('psycho'); tone(200,.3,'sawtooth'); explode(e.clientX||innerWidth/2,e.clientY||200,40); };
/* ---------- TYPING ---------- */
var lines2=['Backend developer in training_','The world is yours_','Python > excuses_','from KZ with rage_']; var L2=0,C2=0,del=false;
(function type(){ var el=$('#typing'); if(!el)return; var cur=lines2[L2]; el.textContent=cur.slice(0,C2); if(!del){ C2++; if(C2>cur.length){ del=true; setTimeout(type,1100); return; } }else{ C2--; if(C2===0){ del=false; L2=(L2+1)%lines2.length; } } setTimeout(type,del?28:58); })();
/* ---------- REVEALS + COUNTERS (IO, no GSAP dependency) ---------- */
var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); },{threshold:.12});
$all('.reveal').forEach(function(el){ io.observe(el); });
/* NOTE: no timer failsafe here on purpose — IntersectionObserver is native and
   always works, so scroll reveals keep animating even if all CDNs die. */
var cio=new IntersectionObserver(function(es){ es.forEach(function(en){ if(!en.isIntersecting)return; var c=en.target; cio.unobserve(c); var to=+c.dataset.to||0, v=0; var step=Math.max(1,Math.round(to/40)); var t=setInterval(function(){ v+=step; if(v>=to){ v=to; clearInterval(t);} c.textContent=v; },40); }); },{threshold:.4});
$all('.counter').forEach(function(c){ cio.observe(c); });
function heroIntro(){ if(window.gsap){ try{ gsap.from('#hero h1',{y:110,opacity:0,duration:1,ease:'power4.out',clearProps:'transform,opacity'}); gsap.from('#hero .btn-magnet',{scale:0,opacity:0,duration:.7,stagger:.1,ease:'back.out(2)',clearProps:'transform,opacity'}); }catch(e){} } setTimeout(function(){ $all('#hero .btn-magnet,#hero h1').forEach(function(b){ b.style.transform=''; b.style.opacity=''; }); },3000); }
/* ---------- PROGRESS ---------- */
addEventListener('scroll',function(){ var h=document.documentElement; var max=h.scrollHeight-h.clientHeight; var p=$('#progress'); if(p)p.style.width=(max>0?(h.scrollTop/max*100):0)+'%'; },{passive:true});
/* ---------- MAGNETIC + TILT ---------- */
if(fine){
$all('.btn-magnet').forEach(function(b){ b.addEventListener('mousemove',function(e){ var r=b.getBoundingClientRect(); var x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2; b.style.transform='translate('+(x*.25)+'px,'+(y*.25)+'px)'; }); b.addEventListener('mouseleave',function(){ b.style.transform=''; }); });
$all('.card-3d').forEach(function(card){ card.addEventListener('mousemove',function(e){ var r=card.getBoundingClientRect(); var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; card.style.transform='perspective(800px) rotateY('+(x*14)+'deg) rotateX('+(-y*14)+'deg) scale(1.02)'; }); card.addEventListener('mouseleave',function(){ card.style.transform=''; }); });
}
/* ---------- EXPLOSION SHARDS ---------- */
function explode(x,y,n){ n=n||22; var colors=['#CCFF00','#FF00E5','#00F0FF','#ffffff','#000000']; for(var i=0;i<n;i++){ var s=document.createElement('div'); s.className='shard'; var sz=Math.random()*14+6; s.style.left=x+'px'; s.style.top=y+'px'; s.style.width=sz+'px'; s.style.height=sz+'px'; s.style.background=colors[i%colors.length]; s.style.border='2px solid #000'; document.body.appendChild(s); (function(el){ var a=Math.random()*Math.PI*2, v=Math.random()*420+120; var dx=Math.cos(a)*v, dy=Math.sin(a)*v-120; if(window.gsap){ gsap.to(el,{x:dx,y:dy,rotation:Math.random()*720-360,opacity:0,duration:.9+Math.random()*.6,ease:'power2.out',onComplete:function(){ if(el.parentNode)el.parentNode.removeChild(el); }}); } else { el.style.transition='all .8s ease-out'; requestAnimationFrame(function(){ el.style.transform='translate('+dx+'px,'+dy+'px)'; el.style.opacity='0'; }); setTimeout(function(){ if(el.parentNode)el.parentNode.removeChild(el); },850); } })(s); } blip(150+Math.random()*500); }
document.addEventListener('click',function(e){ if(e.target.closest && e.target.closest('#term-in,#previewModal'))return; if(e.detail===3){ explode(e.clientX,e.clientY,90); return; } explode(e.clientX,e.clientY,12); });
$all('.stack-card').forEach(function(c){ c.addEventListener('click',function(e){ explode(e.clientX,e.clientY,42); tone(900,.18); if(window.gsap){ gsap.fromTo(c,{scale:1.06},{scale:1,duration:.4,ease:'elastic.out(1,.4)'}); } }); });
$all('.burst-target').forEach(function(el){ el.addEventListener('click',function(e){ e.stopPropagation(); explode(e.clientX,e.clientY,50); }); });
/* ---------- DRAG PROJECTS (mouse only, touch keeps scroll) ---------- */
$all('.draggable').forEach(function(el){
var sx,sy,drag=false;
el.addEventListener('pointerdown',function(e){ if(e.pointerType==='touch')return; if(e.target.closest && e.target.closest('a,button,input,iframe'))return; drag=true; sx=e.clientX; sy=e.clientY; try{el.setPointerCapture(e.pointerId);}catch(_){} el.style.position='relative'; el.style.zIndex=5000; });
el.addEventListener('pointermove',function(e){ if(!drag)return; el.style.left=(e.clientX-sx)+'px'; el.style.top=(e.clientY-sy)+'px'; });
el.addEventListener('pointerup',function(e){ if(!drag)return; drag=false; el.style.zIndex=''; if(window.gsap){ gsap.fromTo(el,{scale:1.04},{scale:1,duration:.5,ease:'elastic.out(1,.4)'}); } explode(e.clientX,e.clientY,20); });
el.addEventListener('pointercancel',function(){ drag=false; });
});
var spawn=$('#spawnBtn'); if(spawn)spawn.onclick=function(e){ var z=$('#proj-zone'); if(!z||!z.children.length)return; var c=z.children[0].cloneNode(true); var h=c.querySelector('h3'); if(h)h.textContent='CLONE-'+Math.floor(Math.random()*999); z.appendChild(c); explode(e.clientX||innerWidth/2,e.clientY||300,40); };
/* ---------- CHAOS LAB ---------- */
function emojiRain(){ var layer=$('#emoji-layer'); if(!layer)return; var em=['🍣','🧁','💥','🐍','☢','🍰','⚡','👾','🍩','🛸']; for(var i=0;i<34;i++){ (function(k){ setTimeout(function(){ var s=document.createElement('span'); s.className='emoji-bit'; s.textContent=em[Math.floor(Math.random()*em.length)]; s.style.left=(Math.random()*100)+'vw'; layer.appendChild(s); requestAnimationFrame(function(){ s.style.top='112vh'; s.style.transform='rotate('+(Math.random()*720-360)+'deg)'; }); setTimeout(function(){ if(s.parentNode)s.parentNode.removeChild(s); },2600); },k*70); })(i); } }
var matrixOn=false;
function matrixMode(){ var m=$('#matrix'); if(!m)return; matrixOn=!matrixOn; m.classList.toggle('hidden',!matrixOn); if(!matrixOn){ m.innerHTML=''; return; } var chars='01H1CHAN<>/\\|'; var html=''; for(var i=0;i<46;i++){ var col=''; for(var k=0;k<16;k++)col+=chars[Math.floor(Math.random()*chars.length)]+'<br>'; html+='<span style="left:'+(Math.random()*100)+'%;animation-duration:'+(1.4+Math.random()*2.4)+'s">'+col+'</span>'; } m.innerHTML=html; }
/* ---------- PREVIEW MODAL ---------- */
var modal=$('#previewModal'), frame=$('#previewFrame'), pTitle=$('#previewTitle');
function openPreview(title,url){ if(pTitle)pTitle.textContent=title||'PREVIEW'; if(frame)frame.src=url; if(modal)modal.classList.add('open'); }
function closePreview(){ if(modal)modal.classList.remove('open'); if(frame)frame.src='about:blank'; }
$all('.preview-open').forEach(function(b){ b.addEventListener('click',function(e){ e.stopPropagation(); openPreview(b.dataset.title||'PREVIEW',b.dataset.preview); tone(700,.12); }); });
var pClose=$('#previewClose'); if(pClose)pClose.onclick=function(e){ e.stopPropagation(); closePreview(); };
var pBack=$('#previewBackdrop'); if(pBack)pBack.onclick=closePreview;
addEventListener('keydown',function(e){ if(e.key==='Escape')closePreview(); });
/* ---------- TERMINAL ---------- */
var tin=$('#term-in'), tlog=$('#term-log');
function tprint(html,cls){ var r=document.createElement('div'); if(cls)r.className=cls; r.innerHTML=html; if(tlog)tlog.appendChild(r); }
if(tin)tin.addEventListener('keydown',function(e){
if(e.key!=='Enter')return; var raw=tin.value.trim(); var v=raw.toLowerCase(); tin.value='';
var d=document.createElement('div'); d.innerHTML='<span class="text-[#CCFF00]">➜ ~</span> '+raw.replace(/</g,'&lt;'); if(tlog)tlog.appendChild(d);
if(v==='help')tprint('cmds: whoami | stack | projects | kz | open sugar | open sushi | preview sugar | acid | matrix | hire-me | clear | rm -rf fears','text-white/80');
else if(v==='whoami')tprint('h1chan / eyephoria — backend apprentice, KZ, beginner → dangerous.','text-white/80');
else if(v==='stack')tprint('Python 65% • SQL 55% • HTML 80% • CSS 78% • JS 60% • Git 70%','text-white/80');
else if(v==='projects')tprint('1) Sugar-Rush — bakery, live on Pages 2) Sushi-Rush — fresh sep 2026 3) h1chan — profile readme 4) static.io — tg bot (private)','text-white/80');
else if(v==='kz')tprint('Greetings from Kazakhstan! Ping me on GitHub — github.com/h1chan','text-white/80');
else if(v==='sudo hire-me'||v==='hire-me')tprint('<b class="text-[#CCFF00]">[ACCESS GRANTED]</b> → <a class="underline" href="https://github.com/h1chan" target="_blank">github.com/h1chan</a> — hit HIRE!','text-white/80');
else if(v==='acid'){ document.body.classList.toggle('psycho'); tprint('ACID mode toggled. hue goes brrr.','text-white/80'); }
else if(v==='matrix'){ matrixMode(); tprint('matrix '+(matrixOn?'ON':'OFF'),'text-white/80'); }
else if(v==='open sugar'||v==='preview sugar'){ openPreview('Sugar-Rush — live preview','https://h1chan.github.io/Sugar-Rush/'); tprint('opening Sugar-Rush preview…','text-white/80'); }
else if(v==='open sushi'||v==='preview sushi'){ openPreview('Sushi-Rush — live preview','https://h1chan.github.io/Sushi-Rush/'); tprint('opening Sushi-Rush preview…','text-white/80'); }
else if(v==='clear'){ if(tlog)tlog.innerHTML=''; return; }
else if(v==='rm -rf fears'){ tprint('fears deleted. THE WORLD IS YOURS.','text-white/80'); explode(innerWidth/2,300,90); }
else if(!v)return; else tprint('command not found: '+v.replace(/</g,'&lt;')+' — try help','text-white/80');
tone(500,.07);
});
var topBtn=$('#topBtn'); if(topBtn)topBtn.onclick=function(){ scrollTo({top:0,behavior:'smooth'}); };
/* ---------- KONAMI EASTER EGG ---------- */
var seq=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'], ki=0;
addEventListener('keydown',function(e){ var k=e.key.length===1?e.key.toLowerCase():e.key; if(k===seq[ki]){ ki++; if(ki===seq.length){ ki=0; document.body.classList.add('psycho'); emojiRain(); explode(innerWidth/2,innerHeight/2,140); tprint('KONAMI ACCEPTED. ACID UNLOCKED FOREVER.','text-[#CCFF00] font-bold'); tone(1200,.4,'sawtooth'); } } else ki=0; });
})();

