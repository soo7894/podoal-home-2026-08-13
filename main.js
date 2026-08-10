import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

const canvas = document.querySelector('#house-canvas');
const sceneWrap = document.querySelector('.scene-wrap');
const modal = document.querySelector('#entry-backdrop');
const input = document.querySelector('#memory-input');
const recentList = document.querySelector('#recent-list');
const countEl = document.querySelector('#record-count');
const progressFill = document.querySelector('#progress-fill');
const todayPreview = document.querySelector('#today-preview');
const previewCount = document.querySelector('#preview-count');
const toast = document.querySelector('#toast');
const streakButton = document.querySelector('#streak-button');
const streakNumber = document.querySelector('#streak-number');
const streakCopy = document.querySelector('#streak-copy');
const streakBackdrop = document.querySelector('#streak-backdrop');
const startDateInput = document.querySelector('#start-date-input');
const streakTitle = document.querySelector('#streak-title');
const streakDescription = document.querySelector('#streak-description');
const startDateNote = document.querySelector('#start-date-note');
const saveStartDate = document.querySelector('#save-start-date');
const decorTooltip = document.querySelector('#decor-tooltip');
const houseNameEditor = document.querySelector('#house-name-editor');
const houseNameButton = document.querySelector('#house-name-button');
const houseNameText = document.querySelector('#house-name-text');
const houseNameInput = document.querySelector('#house-name-input');
const STORAGE_KEY = 'my-little-day-memories-v1';
const HOUSE_NAME_KEY = 'my-little-day-house-name-v1';
const STREAK_START_KEY = 'my-little-day-streak-start-v1';
const DECOR_LAYOUT_KEY = 'my-little-day-decor-layout-v1';
let selectedDecor = 'flower';
let memories = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let streakStartDate = localStorage.getItem(STREAK_START_KEY) || '';
let decorLayout = JSON.parse(localStorage.getItem(DECOR_LAYOUT_KEY) || '{}');
let houseName = localStorage.getItem(HOUSE_NAME_KEY) || '우리';

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
camera.position.set(8.5, 6.1, 10.5);
const target = new THREE.Vector3(0, 1.45, 0);
const world = new THREE.Group();
world.rotation.y = -.5;
scene.add(world);

scene.add(new THREE.HemisphereLight(0xfff3c8, 0x56745c, 2.3));
const sun = new THREE.DirectionalLight(0xffe0a0, 3.1);
sun.position.set(4, 9, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);
const warm = new THREE.PointLight(0xffa73a, 2.2, 7); warm.position.set(-1, 2, 3); world.add(warm);

const palette = { wall:0xfff4d7, roof:0xeb7651, trim:0xf1a237, wood:0x99623e, lawn:0x82aa68, path:0xf0c97a, glass:0x93c7d0, leaf:0x537b50, pot:0xdd7652, dark:0x493727, cream:0xfff9e8, blue:0x6babc3, pink:0xea8790 };
const mat = (color, roughness=.8) => new THREE.MeshStandardMaterial({ color, roughness });
function mesh(geometry, material, position, parent=world) { const m = new THREE.Mesh(geometry, material); m.position.copy(position); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m; }
function box(x,y,z,color,pos, parent=world) { return mesh(new THREE.BoxGeometry(x,y,z),mat(color),pos,parent); }
function cylinder(rt,rb,h,color,pos,parent=world) { return mesh(new THREE.CylinderGeometry(rt,rb,h,20),mat(color),pos,parent); }
function sphere(r,color,pos,parent=world) { return mesh(new THREE.SphereGeometry(r,20,16),mat(color),pos,parent); }

// hand-painted toy base
const base = mesh(new THREE.CylinderGeometry(5.7, 5.95, .48, 64), mat(0x759d63), new THREE.Vector3(0,-.35,0));
const soil = mesh(new THREE.CylinderGeometry(5.32,5.42,.16,64),mat(0x9cc479),new THREE.Vector3(0,-.04,0));
base.rotation.z = .02;
// winding stone path
for (let i=0;i<6;i++) { const stone=mesh(new THREE.SphereGeometry(.54-(i%2)*.05,16,10),mat(palette.path),new THREE.Vector3(-.2+i*.22,.08,4.25-i*.73)); stone.scale.set(1.15,.22,.8); stone.rotation.y=i*.25; }

// house body and roof
const houseBody=box(5.25,3.25,4.45,palette.wall,new THREE.Vector3(0,1.63,-.25));
box(5.48,.30,4.68,palette.trim,new THREE.Vector3(0,.12,-.25));
const roof = mesh(new THREE.ConeGeometry(3.95,2.55,4),mat(palette.roof),new THREE.Vector3(0,4.55,-.25)); roof.rotation.y=Math.PI/4;
const roofCap = mesh(new THREE.CylinderGeometry(.22,.29,.52,20),mat(palette.wood),new THREE.Vector3(0,5.85,-.25));
// roof stripes
for (let x=-1.72;x<2;x+=.68) { const stripe=box(.09,1.7,4.1,0xf7a17e,new THREE.Vector3(x,4.22,-.25)); stripe.rotation.z = x<0 ? -.06 : .06; }

// front door and windows
const frontFacade=new THREE.Group(); world.add(frontFacade);
const warmInterior = new THREE.Group(); warmInterior.visible=false; world.add(warmInterior);
const interiorCanvas=document.createElement('canvas'); interiorCanvas.width=256; interiorCanvas.height=384;
const interiorContext=interiorCanvas.getContext('2d');
const interiorGlow=interiorContext.createRadialGradient(134,146,8,134,146,218); interiorGlow.addColorStop(0,'#fff0b7'); interiorGlow.addColorStop(.5,'#c9784d'); interiorGlow.addColorStop(1,'#51332d'); interiorContext.fillStyle=interiorGlow; interiorContext.fillRect(0,0,256,384);
interiorContext.fillStyle='#7c4938'; interiorContext.fillRect(24,38,92,112); interiorContext.fillStyle='#ffe19a'; interiorContext.fillRect(34,49,72,88); interiorContext.fillStyle='rgba(255,255,240,.65)'; interiorContext.fillRect(68,49,7,88); interiorContext.fillRect(34,91,72,7);
interiorContext.fillStyle='#56372f'; interiorContext.fillRect(131,208,98,15); interiorContext.fillRect(145,223,11,70); interiorContext.fillRect(205,223,11,70); interiorContext.fillStyle='#f5be57'; interiorContext.fillRect(163,176,37,31); interiorContext.fillStyle='#fff2bb'; interiorContext.beginPath(); interiorContext.arc(181,166,18,0,Math.PI*2); interiorContext.fill();
interiorContext.fillStyle='#bf6f56'; interiorContext.fillRect(36,288,183,58); interiorContext.fillStyle='#edb17a'; interiorContext.fillRect(47,299,161,34);
const interiorTexture=new THREE.CanvasTexture(interiorCanvas); interiorTexture.colorSpace=THREE.SRGBColorSpace;
const interiorPanel=mesh(new THREE.PlaneGeometry(.99,1.82),new THREE.MeshBasicMaterial({map:interiorTexture,side:THREE.DoubleSide}),new THREE.Vector3(0,1.04,2.035),warmInterior); interiorPanel.renderOrder=2;
const interiorLight=new THREE.PointLight(0xffb347,0,4.5); interiorLight.position.set(0,1.15,2.3); world.add(interiorLight);
const doorPivot=new THREE.Group(); doorPivot.position.set(-.54,.08,2.04); world.add(doorPivot);
const doorMesh=box(1.08,1.92,.16,palette.wood,new THREE.Vector3(.54,.96,0),doorPivot); doorMesh.userData.isDoor=true;
box(.72,.055,.035,palette.trim,new THREE.Vector3(.54,1.38,.095),doorPivot); box(.72,.055,.035,palette.trim,new THREE.Vector3(.54,.56,.095),doorPivot);
mesh(new THREE.SphereGeometry(.085,12,10),mat(0xf6ca4d),new THREE.Vector3(.88,.97,.12),doorPivot);
let doorOpen=false, doorTargetRotation=0;
const OPEN_DOOR_ANGLE=-Math.PI*.47;
box(1.5,1.42,.12,palette.blue,new THREE.Vector3(-1.66,2.22,2.09),frontFacade);
box(1.5,1.42,.12,palette.blue,new THREE.Vector3(1.66,2.22,2.09),frontFacade);
for (const x of [-1.66,1.66]) { box(.12,1.62,.12,palette.cream,new THREE.Vector3(x,2.22,2.18),frontFacade); box(1.68,.12,.12,palette.cream,new THREE.Vector3(x,2.22,2.18),frontFacade); box(1.82,.15,.15,palette.roof,new THREE.Vector3(x,3.05,2.17),frontFacade); }

// A heart-shaped nameplate, rendered as part of the house facade.
const nameplateCanvas = document.createElement('canvas');
nameplateCanvas.width = 512; nameplateCanvas.height = 512;
const nameplateContext = nameplateCanvas.getContext('2d');
const nameplateTexture = new THREE.CanvasTexture(nameplateCanvas);
nameplateTexture.colorSpace = THREE.SRGBColorSpace;
function drawNameplate(){
  const ctx = nameplateContext; ctx.clearRect(0,0,512,512); ctx.save(); ctx.scale(2,2);
  ctx.beginPath(); ctx.moveTo(128,231);
  ctx.bezierCurveTo(112,216,35,165,35,92);
  ctx.bezierCurveTo(35,52,82,31,111,56);
  ctx.bezierCurveTo(119,63,124,71,128,80);
  ctx.bezierCurveTo(132,71,137,63,145,56);
  ctx.bezierCurveTo(174,31,221,52,221,92);
  ctx.bezierCurveTo(221,165,144,216,128,231); ctx.closePath();
  ctx.fillStyle='#ed8c78'; ctx.fill(); ctx.lineWidth=5; ctx.strokeStyle='#fff1ca'; ctx.stroke();
  ctx.beginPath(); ctx.arc(92,73,8,0,Math.PI*2); ctx.fillStyle='rgba(255,245,210,.72)'; ctx.fill();
  const label=`${houseName}네 집`; ctx.fillStyle='#fffdf4'; ctx.textAlign='center'; ctx.textBaseline='middle';
  const nameFontSize = label.length <= 4 ? 44 : label.length <= 6 ? 34 : 27;
  ctx.font=`800 ${nameFontSize}px Nanum Gothic, sans-serif`; ctx.fillText(label,128,134);
  ctx.restore(); nameplateTexture.needsUpdate=true;
}
drawNameplate();
const nameplate = mesh(new THREE.PlaneGeometry(1.42,1.42),new THREE.MeshBasicMaterial({map:nameplateTexture,transparent:true,alphaTest:.05,depthWrite:false,depthTest:true,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:THREE.DoubleSide}),new THREE.Vector3(0,2.65,2.18));
nameplate.renderOrder = 3;
nameplate.visible = true;
// chimney
box(.72,1.45,.72,palette.wood,new THREE.Vector3(1.58,4.7,-.65)); box(.9,.16,.9,palette.cream,new THREE.Vector3(1.58,5.42,-.65));

// mailbox
box(.12,1.1,.12,palette.wood,new THREE.Vector3(3.6,.7,2.2));
const mail=mesh(new THREE.CylinderGeometry(.35,.35,.65,18,1,false,0,Math.PI),mat(0x5f9ab3),new THREE.Vector3(3.6,1.22,2.2)); mail.rotation.z=Math.PI/2;
// fence
for(let x=-4.7;x<-2.2;x+=.5){ box(.10,.72,.10,palette.cream,new THREE.Vector3(x,.44,2.9)); }
box(2.62,.09,.10,palette.cream,new THREE.Vector3(-3.45,.65,2.9));

const placed = new THREE.Group(); world.add(placed);
houseNameText.textContent = `${houseName}네 집`;
const slots = [ [-2.65,.04,1.75], [2.3,.04,1.42], [-3.05,.04,-.2], [3.15,.04,.15], [-1.7,.04,3.2], [1.72,.04,3.28], [-3.75,.04,1.0], [3.8,.04,2.1] ];
const houseZone = { minX:-3.12, maxX:3.12, minZ:-3.10, maxZ:2.58 };
function keepOutsideHouse(x,z){
  const safeX=THREE.MathUtils.clamp(x,-4.45,4.45);
  const safeZ=THREE.MathUtils.clamp(z,-3.95,3.75);
  if(safeX<=houseZone.minX || safeX>=houseZone.maxX || safeZ<=houseZone.minZ || safeZ>=houseZone.maxZ) return {x:safeX,z:safeZ};
  const edges=[
    {distance:safeX-houseZone.minX,x:houseZone.minX,z:safeZ},
    {distance:houseZone.maxX-safeX,x:houseZone.maxX,z:safeZ},
    {distance:safeZ-houseZone.minZ,x:safeX,z:houseZone.minZ},
    {distance:houseZone.maxZ-safeZ,x:safeX,z:houseZone.maxZ}
  ];
  const nearest=edges.reduce((closest,edge)=>edge.distance<closest.distance?edge:closest);
  return {x:nearest.x,z:nearest.z};
}
const DECORATION_GAP = .82;
function keepDecorationSeparate(x,z,excludedDecoration=null){
  let position=keepOutsideHouse(x,z);
  for(let attempt=0;attempt<32;attempt++){
    const conflict=placed.children.find(decoration=>{
      if(decoration===excludedDecoration) return false;
      return Math.hypot(decoration.position.x-position.x,decoration.position.z-position.z)<DECORATION_GAP;
    });
    if(!conflict) return position;
    const dx=position.x-conflict.position.x;
    const dz=position.z-conflict.position.z;
    const angle=(Math.abs(dx)+Math.abs(dz)<.01?(attempt+1)*2.399:Math.atan2(dz,dx)+attempt*.45);
    position=keepOutsideHouse(conflict.position.x+Math.cos(angle)*DECORATION_GAP,conflict.position.z+Math.sin(angle)*DECORATION_GAP);
  }
  return position;
}
const flowerColors = [0xf0a4ac,0xf18b75,0xeb7795,0xaf83ce,0xffb943,0x8fcf9a];
function randomFlowerColor(){ return flowerColors[Math.floor(Math.random()*flowerColors.length)]; }
function nextFlowerColor(currentColor){ const choices=flowerColors.filter(color=>color!==currentColor); return choices[Math.floor(Math.random()*choices.length)]; }
function saveDecorationPosition(decoration){
  decorLayout[decoration.userData.decorationId]={...decorLayout[decoration.userData.decorationId],x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2))};
  localStorage.setItem(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
}
function changeFlowerColor(decoration){
  const nextColor=nextFlowerColor(decoration.userData.flowerColor);
  decoration.userData.flowerColor=nextColor;
  decoration.userData.petalMeshes.forEach(petal=>petal.material.color.setHex(nextColor));
  decorLayout[decoration.userData.decorationId]={...decorLayout[decoration.userData.decorationId],x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2)),flowerColor:nextColor};
  localStorage.setItem(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
}
function addDecoration(type,index,animate=false,memoryText='나를 위한 첫 장식',decorationId=`${type}-${index}`,flowerColor=null) {
  const g = new THREE.Group(); const [x,y,z]=slots[index%slots.length]; const savedPosition=decorLayout[decorationId]; const safePosition=keepOutsideHouse(savedPosition?.x??x,savedPosition?.z??z); const openPosition=keepDecorationSeparate(safePosition.x,safePosition.z); g.position.set(openPosition.x,y,openPosition.z); placed.add(g);
  g.userData.memoryText = memoryText;
  g.userData.type = type;
  g.userData.decorationId = decorationId;
  g.userData.baseY = y;
  const hotspot = document.createElement('button');
  hotspot.className = 'decor-hotspot'; hotspot.type = 'button';
  hotspot.setAttribute('aria-label', `잘한 일: ${memoryText}`);
  sceneWrap.appendChild(hotspot);
  g.userData.hotspot = hotspot;
  hotspot.addEventListener('mouseenter', () => showDecorTooltip(g, Number.parseFloat(hotspot.style.left), Number.parseFloat(hotspot.style.top)));
  hotspot.addEventListener('focus', () => showDecorTooltip(g, Number.parseFloat(hotspot.style.left), Number.parseFloat(hotspot.style.top)));
  hotspot.addEventListener('mouseleave', hideDecorTooltip);
  hotspot.addEventListener('blur', hideDecorTooltip);
  if(type==='flower') { const petalColor=savedPosition?.flowerColor??flowerColor??randomFlowerColor(); g.userData.flowerColor=petalColor; g.userData.petalMeshes=[]; cylinder(.26,.34,.42,palette.pot,new THREE.Vector3(0,.21,0),g); for(let i=0;i<5;i++){ const a=i*Math.PI*2/5; g.userData.petalMeshes.push(sphere(.14,petalColor,new THREE.Vector3(Math.cos(a)*.18,.58,Math.sin(a)*.18),g)); } sphere(.12,0xf3c743,new THREE.Vector3(0,.58,0),g); }
  if(type==='lamp') { cylinder(.06,.09,.78,palette.dark,new THREE.Vector3(0,.39,0),g); const shade=mesh(new THREE.ConeGeometry(.3,.42,18,1,true),mat(0xf5c64d),new THREE.Vector3(0,.86,0),g); shade.rotation.x=Math.PI; sphere(.11,0xfff4ad,new THREE.Vector3(0,.78,0),g); }
  if(type==='book') { box(.55,.16,.38,0x74a7a0,new THREE.Vector3(0,.1,0),g); box(.48,.16,.36,0xf1b640,new THREE.Vector3(.03,.26,.01),g); box(.43,.16,.34,0xe47758,new THREE.Vector3(-.02,.42,-.01),g); }
  if(type==='flag') { cylinder(.045,.055,1.05,palette.wood,new THREE.Vector3(0,.53,0),g); const flag=mesh(new THREE.PlaneGeometry(.54,.34),mat(0xf08368),new THREE.Vector3(.3,.84,0),g); flag.rotation.y=Math.PI/18; }
  if(type==='tree') { cylinder(.12,.17,.78,palette.wood,new THREE.Vector3(0,.39,0),g); sphere(.42,palette.leaf,new THREE.Vector3(0,.92,0),g); sphere(.31,0x6b975b,new THREE.Vector3(.25,.78,.06),g); sphere(.29,0x6b975b,new THREE.Vector3(-.25,.82,.06),g); }
  if(!savedPosition || savedPosition.x!==openPosition.x || savedPosition.z!==openPosition.z) saveDecorationPosition(g);
  if(animate) { g.scale.setScalar(.01); const start=performance.now(); const grow=now=>{ const p=Math.min((now-start)/480,1); g.scale.setScalar(1+(1-p)*.15); g.position.y=y+Math.sin(p*Math.PI)*.22; if(p<1) requestAnimationFrame(grow); else g.position.y=y; }; requestAnimationFrame(grow); }
}
// a welcoming starter scene
addDecoration('flower',0,false,'친구에게 먼저 안부를 물었다','starter-flower'); addDecoration('book',1,false,'미뤄둔 책을 20쪽 읽었다','starter-book');

function addStoredDecorations(){ memories.forEach((m,i)=>addDecoration(m.decor,i+2,false,m.text,`memory-${m.date||i}`,m.flowerColor)); }
addStoredDecorations();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0,1,0),-.04);
const dragPoint = new THREE.Vector3();
let dragging=false, draggingDecoration=null, dragStartX=0, dragStartY=0, decorationMoved=false, doorPressed=false, doorStartX=0, doorStartY=0, lastX=0, desiredRotation=-.5, userHasDragged=false;
function hideDecorTooltip(){ decorTooltip.classList.remove('show'); canvas.style.cursor='grab'; }
function showDecorTooltip(decoration, x, y){
  decorTooltip.querySelector('p').textContent=decoration.userData.memoryText;
  decorTooltip.style.left=`${x}px`;
  decorTooltip.style.top=`${y-6}px`;
  decorTooltip.classList.add('show');
}
function getDecorationAtEvent(event){
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y = -((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hit = raycaster.intersectObjects(placed.children,true)[0];
  if(!hit) return null;
  let decoration=hit.object;
  while(decoration && !decoration.userData.memoryText) decoration=decoration.parent;
  return decoration||null;
}
function getDoorAtEvent(event){
  const rect=canvas.getBoundingClientRect();
  pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  return raycaster.intersectObject(doorPivot,true).length>0;
}
function toggleDoor(){
  doorOpen=!doorOpen;
  doorTargetRotation=doorOpen?OPEN_DOOR_ANGLE:0;
  warmInterior.visible=doorOpen;
  interiorLight.intensity=doorOpen?2.2:0;
}
function moveDecoration(event,decoration){
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y = -((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  if(!raycaster.ray.intersectPlane(dragPlane,dragPoint)) return;
  placed.worldToLocal(dragPoint);
  const safePosition=keepOutsideHouse(dragPoint.x,dragPoint.z);
  const openPosition=keepDecorationSeparate(safePosition.x,safePosition.z,decoration);
  decoration.position.set(openPosition.x,decoration.userData.baseY,openPosition.z);
}
function checkDecorHover(event){
  if(dragging) return hideDecorTooltip();
  const rect = canvas.getBoundingClientRect();
  if(getDoorAtEvent(event)){ hideDecorTooltip(); canvas.style.cursor='pointer'; return; }
  const decoration=getDecorationAtEvent(event);
  if(!decoration) return hideDecorTooltip();
  showDecorTooltip(decoration,event.clientX-rect.left,event.clientY-rect.top);
  canvas.style.cursor='pointer';
}
canvas.addEventListener('pointerdown',e=>{ if(getDoorAtEvent(e)){ doorPressed=true; doorStartX=e.clientX; doorStartY=e.clientY; canvas.setPointerCapture(e.pointerId); return; } const decoration=getDecorationAtEvent(e); dragging=true; lastX=e.clientX; canvas.setPointerCapture(e.pointerId); if(decoration){ draggingDecoration=decoration; dragStartX=e.clientX; dragStartY=e.clientY; decorationMoved=false; hideDecorTooltip(); canvas.style.cursor='grabbing'; return; } });
canvas.addEventListener('pointermove',e=>{ if(doorPressed) return; if(!dragging) return checkDecorHover(e); if(draggingDecoration){ if(Math.hypot(e.clientX-dragStartX,e.clientY-dragStartY)>6){ decorationMoved=true; moveDecoration(e,draggingDecoration); } return; } desiredRotation += (e.clientX-lastX)*.012; lastX=e.clientX; userHasDragged=true; });
canvas.addEventListener('mousemove',e=>{ if(!dragging&&!doorPressed) checkDecorHover(e); });
canvas.addEventListener('pointerup',e=>{ if(doorPressed){ if(Math.hypot(e.clientX-doorStartX,e.clientY-doorStartY)<8) toggleDoor(); doorPressed=false; checkDecorHover(e); return; } if(draggingDecoration){ const decoration=draggingDecoration; if(decorationMoved) saveDecorationPosition(decoration); else if(decoration.userData.type==='flower') changeFlowerColor(decoration); draggingDecoration=null; } dragging=false; checkDecorHover(e); });
canvas.addEventListener('pointercancel',()=>{ doorPressed=false; if(draggingDecoration&&decorationMoved) saveDecorationPosition(draggingDecoration); draggingDecoration=null; dragging=false; hideDecorTooltip(); });
canvas.addEventListener('pointerleave',hideDecorTooltip);

function resize(){ const w=canvas.clientWidth,h=canvas.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
const projectedPosition = new THREE.Vector3();
const nameplatePosition = new THREE.Vector3();
function updateDecorHotspots(){
  world.updateMatrixWorld(true);
  placed.children.forEach(decoration=>{
    const hotspot=decoration.userData.hotspot;
    if(!hotspot) return;
    decoration.getWorldPosition(projectedPosition);
    projectedPosition.y += .48;
    projectedPosition.project(camera);
    const visible = projectedPosition.z > -1 && projectedPosition.z < 1;
    hotspot.style.display=visible ? 'block' : 'none';
    hotspot.style.left=`${(projectedPosition.x*.5+.5)*canvas.clientWidth}px`;
    hotspot.style.top=`${(-projectedPosition.y*.5+.5)*canvas.clientHeight}px`;
  });
}
function updateHouseName(){
  nameplate.getWorldPosition(nameplatePosition); nameplatePosition.project(camera);
  houseNameEditor.style.left=`${(nameplatePosition.x*.5+.5)*canvas.clientWidth}px`;
  houseNameEditor.style.top=`${(-nameplatePosition.y*.5+.5)*canvas.clientHeight}px`;
}
function frame(time){ resize(); if(!dragging&&!userHasDragged) desiredRotation=-.5+Math.sin(time*.00022)*.17; world.rotation.y += (desiredRotation-world.rotation.y)*.055; doorPivot.rotation.y += (doorTargetRotation-doorPivot.rotation.y)*.14; camera.lookAt(target); updateDecorHotspots(); updateHouseName(); renderer.render(scene,camera); requestAnimationFrame(frame); }
requestAnimationFrame(frame);

function formatMemoryTimestamp(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime())) return '기록 시간 없음';
  const hour=date.getHours();
  const period=hour<12?'오전':'오후';
  const displayHour=hour%12||12;
  return `${date.getMonth()+1}월 ${date.getDate()}일 ${period} ${displayHour}:${String(date.getMinutes()).padStart(2,'0')}`;
}

function renderRecords(){
  const total = memories.length+2; countEl.innerHTML=`${String(total).padStart(2,'0')} <small>/ 31</small>`; progressFill.style.width=`${Math.min(total/31*100,100)}%`;
  previewCount.textContent=`장식 ${String(total).padStart(2,'0')}개`;
  if(memories[0]) todayPreview.innerHTML=memories[0].text.replace(/(.{17})/g,'$1<br>');
  const shown = memories.slice(0,3).map(m=>`<li><span class="memory-dot ${m.decor}"></span><div><b>${escapeHTML(m.text)}</b><small>${formatMemoryTimestamp(m.date)}</small></div></li>`).join('');
  if(shown) recentList.innerHTML=shown;
}
function escapeHTML(text){ const el=document.createElement('div');el.textContent=text;return el.innerHTML; }
renderRecords();

function localDateString(date = new Date()){
  const offset = date.getTimezoneOffset()*60000;
  return new Date(date.getTime()-offset).toISOString().slice(0,10);
}
function dateFromString(value){
  const [year,month,day] = value.split('-').map(Number);
  return new Date(year,month-1,day);
}
function streakDays(startDate){
  const today = dateFromString(localDateString());
  return Math.max(1,Math.floor((today-dateFromString(startDate))/86400000)+1);
}
function formatStartDate(value){
  const date=dateFromString(value);
  return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`;
}
function updateStreak(){
  if(!streakStartDate){
    streakNumber.textContent='시작일';
    streakCopy.textContent='을 정해 주세요';
    streakButton.classList.add('needs-setup');
    streakButton.setAttribute('aria-label','따뜻하게 살기 시작한 날 정하기');
    return;
  }
  const days=streakDays(streakStartDate);
  streakNumber.textContent=days;
  streakCopy.textContent='일째 따뜻하게 살고 있어요';
  streakButton.classList.remove('needs-setup');
  streakButton.setAttribute('aria-label',`${formatStartDate(streakStartDate)}부터 ${days}일째. 시작일 확인 또는 변경`);
}
function updateStartDateNote(){
  if(!startDateInput.value){ startDateNote.textContent=''; return; }
  startDateNote.textContent=`${formatStartDate(startDateInput.value)}부터 오늘로 ${streakDays(startDateInput.value)}일째예요.`;
}
function openStreakModal(){
  const hasStart=Boolean(streakStartDate);
  startDateInput.max=localDateString();
  startDateInput.value=streakStartDate||localDateString();
  streakTitle.innerHTML=hasStart?'언제부터<br /><em>시작했나요?</em>':'언제부터<br /><em>따뜻하게 살까요?</em>';
  streakDescription.textContent=hasStart?'처음 시작한 날을 확인하거나 바꿀 수 있어요.':'따뜻하게 살기로 한 첫날을 기록해 보세요.';
  saveStartDate.innerHTML=hasStart?'시작일 저장하기 <span>→</span>':'이날부터 시작하기 <span>→</span>';
  updateStartDateNote();
  streakBackdrop.classList.add('open');
  streakBackdrop.setAttribute('aria-hidden','false');
  setTimeout(()=>startDateInput.focus(),180);
}
function closeStreakModal(){ streakBackdrop.classList.remove('open'); streakBackdrop.setAttribute('aria-hidden','true'); }
streakButton.addEventListener('click',openStreakModal);
document.querySelector('#close-streak').addEventListener('click',closeStreakModal);
streakBackdrop.addEventListener('click',event=>{ if(event.target===streakBackdrop) closeStreakModal(); });
startDateInput.addEventListener('change',updateStartDateNote);
saveStartDate.addEventListener('click',()=>{
  if(!startDateInput.value){ startDateInput.focus(); return; }
  streakStartDate=startDateInput.value;
  localStorage.setItem(STREAK_START_KEY,streakStartDate);
  updateStreak();
  closeStreakModal();
});
updateStreak();

function saveHouseName(){
  const nextName=houseNameInput.value.trim().replace(/네\s*집$/,'').trim();
  if(nextName) houseName=nextName;
  houseNameText.textContent=`${houseName}네 집`;
  houseNameInput.value=houseName;
  localStorage.setItem(HOUSE_NAME_KEY,houseName);
  drawNameplate();
  houseNameEditor.classList.remove('editing');
}
houseNameButton.addEventListener('click',()=>{ houseNameInput.value=houseName; houseNameEditor.classList.add('editing'); houseNameInput.focus(); houseNameInput.select(); });
houseNameInput.addEventListener('keydown',e=>{ if(e.key==='Enter') saveHouseName(); if(e.key==='Escape') houseNameEditor.classList.remove('editing'); });
houseNameInput.addEventListener('blur',saveHouseName);

function openModal(){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); setTimeout(()=>input.focus(),180); }
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
document.querySelector('#open-entry').addEventListener('click',openModal);
document.querySelector('#card-entry').addEventListener('click',openModal);
document.querySelector('#close-entry').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });
document.querySelectorAll('.decor-option').forEach(btn=>btn.addEventListener('click',()=>{ document.querySelector('.decor-option.selected').classList.remove('selected'); btn.classList.add('selected'); selectedDecor=btn.dataset.decor; }));
document.querySelector('#save-memory').addEventListener('click',()=>{
  const text=input.value.trim();
  if(!text){ input.focus(); input.placeholder='오늘의 잘한 일을 한 줄로 적어 주세요 :)'; return; }
  const flowerColor=selectedDecor==='flower'?randomFlowerColor():null;
  const memory={text,decor:selectedDecor,date:new Date().toISOString(),flowerColor}; memories.unshift(memory); localStorage.setItem(STORAGE_KEY,JSON.stringify(memories)); addDecoration(selectedDecor,memories.length+1,true,text,`memory-${memory.date}`,flowerColor); renderRecords(); input.value=''; closeModal(); toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3600);
});
input.addEventListener('keydown',e=>{ if(e.key==='Enter') document.querySelector('#save-memory').click(); });
document.querySelector('#sound-button').addEventListener('click',e=>{ e.currentTarget.textContent=e.currentTarget.textContent==='♪'?'×':'♪'; });
