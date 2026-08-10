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
const openHomeCaptureButton = document.querySelector('#open-home-capture');
const captureBackdrop = document.querySelector('#capture-backdrop');
const closeCaptureButton = document.querySelector('#close-capture');
const capturedHomeImage = document.querySelector('#captured-home-image');
const saveCapturedImageButton = document.querySelector('#save-captured-image');
const shareCapturedImageButton = document.querySelector('#share-captured-image');
const decorOptions = document.querySelector('#decor-options');
const STORAGE_KEY = 'my-little-day-memories-v1';
const HOUSE_NAME_KEY = 'my-little-day-house-name-v1';
const STREAK_START_KEY = 'my-little-day-streak-start-v1';
const DECOR_LAYOUT_KEY = 'my-little-day-decor-layout-v1';
let selectedDecor = 'flower';
const DECOR_OPTIONS = [
  ['flower','✿','꽃 화분'],['lamp','☀','작은 조명'],['book','▤','책 더미'],['flag','⚑','응원 깃발'],['tree','♟','작은 나무'],['bench','▰','나무 벤치'],
  ['fountain','⛲','분수'],['birdhouse','⌂','새집'],['mailbox','✉','우편함'],['fence','▥','울타리'],['swing','♧','그네'],['bicycle','◎','자전거'],
  ['stone','●','정원 돌'],['mushroom','♣','버섯'],['birdbath','◉','새 목욕탕'],['lantern','◈','랜턴'],['leafplant','☘','잎 화분'],['watering','♒','물뿌리개'],
  ['flowerbed','✽','꽃밭'],['sunflower','✺','해바라기'],['gnome','♟','정원 요정'],['basket','▱','피크닉 바구니'],['hammock','⌒','해먹'],['arch','∩','정원 아치'],
  ['chime','♬','바람 종'],['pumpkin','●','호박'],['cat','⌁','고양이'],['dog','♧','강아지'],['stepping','◌','디딤돌'],['topiary','✦','토피어리']
];
const DECOR_INFO = Object.fromEntries(DECOR_OPTIONS.map(([type,icon,label])=>[type,{icon,label}]));
function renderDecorOptions(){
  decorOptions.innerHTML=DECOR_OPTIONS.map(([type,icon,label])=>`<button class="decor-option${type===selectedDecor?' selected':''}" data-decor="${type}" type="button"><span>${icon}</span>${label}</button>`).join('');
}
renderDecorOptions();
let memories = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let streakStartDate = localStorage.getItem(STREAK_START_KEY) || '';
let decorLayout = JSON.parse(localStorage.getItem(DECOR_LAYOUT_KEY) || '{}');
let houseName = localStorage.getItem(HOUSE_NAME_KEY) || '우리';

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, preserveDrawingBuffer:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
camera.position.set(8.5, 6.1, 10.5);
const target = new THREE.Vector3(0, 1.45, 0);
const world = new THREE.Group();
// Keep the front facade in view so the open doorway can reveal the room depth.
world.rotation.y = .44;
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
const houseBody=new THREE.Group(); world.add(houseBody);
// Build the walls as a shell so the doorway is a real opening, not a picture on the facade.
box(5.25,3.25,.18,palette.wall,new THREE.Vector3(0,1.63,-2.38),houseBody);
box(.18,3.25,4.45,palette.wall,new THREE.Vector3(-2.54,1.63,-.25),houseBody);
box(.18,3.25,4.45,palette.wall,new THREE.Vector3(2.54,1.63,-.25),houseBody);
box(5.25,.18,4.45,palette.wall,new THREE.Vector3(0,3.16,-.25),houseBody);
box(2.08,3.25,.18,palette.wall,new THREE.Vector3(-1.58,1.63,1.88),houseBody);
box(2.08,3.25,.18,palette.wall,new THREE.Vector3(1.58,1.63,1.88),houseBody);
box(1.08,1.25,.18,palette.wall,new THREE.Vector3(0,2.63,1.88),houseBody);
box(5.48,.30,4.68,palette.trim,new THREE.Vector3(0,.12,-.25));
const roof = mesh(new THREE.ConeGeometry(3.95,2.55,4),mat(palette.roof),new THREE.Vector3(0,4.55,-.25)); roof.rotation.y=Math.PI/4;
const roofCap = mesh(new THREE.CylinderGeometry(.22,.29,.52,20),mat(palette.wood),new THREE.Vector3(0,5.85,-.25));
// roof stripes
for (let x=-1.72;x<2;x+=.68) { const stripe=box(.09,1.7,4.1,0xf7a17e,new THREE.Vector3(x,4.22,-.25)); stripe.rotation.z = x<0 ? -.06 : .06; }

// front door and windows
const frontFacade=new THREE.Group(); world.add(frontFacade);
const warmInterior = new THREE.Group(); warmInterior.visible=false; world.add(warmInterior);
// A small three-dimensional room sits behind the open doorway.
const interiorFloor=box(1.03,.08,2.38,0x704838,new THREE.Vector3(0,.12,.67),warmInterior);
const interiorBackWall=box(1.02,2.24,.09,0xc88362,new THREE.Vector3(0,1.17,-.52),warmInterior);
const interiorRug=mesh(new THREE.CircleGeometry(.34,24),mat(0x7fa5a0),new THREE.Vector3(0,.17,.56),warmInterior); interiorRug.rotation.x=-Math.PI/2;
const sofa=box(.72,.47,.28,0x6c8f89,new THREE.Vector3(-.05,.4,-.18),warmInterior);
box(.78,.10,.34,0xb2d0be,new THREE.Vector3(-.05,.68,-.18),warmInterior);
const table=box(.36,.28,.28,0x6f4739,new THREE.Vector3(.26,.34,.5),warmInterior);
mesh(new THREE.CylinderGeometry(.15,.17,.06,16),mat(0xf3c45f),new THREE.Vector3(.26,.52,.5),warmInterior);
const lampStand=cylinder(.025,.025,.54,0x705044,new THREE.Vector3(.34,.63,-.28),warmInterior);
const lampShade=mesh(new THREE.ConeGeometry(.16,.22,16,1,true),mat(0xffdf81),new THREE.Vector3(.34,.99,-.28),warmInterior); lampShade.rotation.x=Math.PI;
const picture=box(.38,.30,.035,0x8e5948,new THREE.Vector3(-.12,1.58,-.46),warmInterior);
box(.28,.20,.02,0x9fc8ba,new THREE.Vector3(-.12,1.58,-.43),warmInterior);
const interiorLight=new THREE.PointLight(0xffb347,0,3.3); interiorLight.position.set(.05,1.42,.32); warmInterior.add(interiorLight);
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
  if(type==='bench') { box(.82,.13,.25,0xa66b43,new THREE.Vector3(0,.49,0),g); box(.82,.12,.12,0xa66b43,new THREE.Vector3(0,.72,-.1),g); for(const x of [-.31,.31]) box(.10,.48,.10,palette.wood,new THREE.Vector3(x,.24,0),g); }
  if(type==='fountain') { cylinder(.38,.48,.14,0x8eb9c3,new THREE.Vector3(0,.07,0),g); cylinder(.17,.23,.27,0x79afbc,new THREE.Vector3(0,.25,0),g); sphere(.12,0xeaf7fa,new THREE.Vector3(0,.49,0),g); }
  if(type==='birdhouse') { cylinder(.05,.07,.75,palette.wood,new THREE.Vector3(0,.38,0),g); box(.36,.32,.28,0x79a8ba,new THREE.Vector3(0,.84,0),g); const roof=mesh(new THREE.ConeGeometry(.32,.22,4),mat(0xeb7651),new THREE.Vector3(0,1.11,0),g); roof.rotation.y=Math.PI/4; sphere(.05,palette.dark,new THREE.Vector3(0,.84,.15),g); }
  if(type==='mailbox') { box(.11,.74,.11,palette.wood,new THREE.Vector3(0,.37,0),g); const mailbox=mesh(new THREE.CylinderGeometry(.22,.22,.48,16,1,false,0,Math.PI),mat(0x5f9ab3),new THREE.Vector3(0,.75,0),g); mailbox.rotation.z=Math.PI/2; }
  if(type==='fence') { for(const x of [-.32,0,.32]) box(.08,.52,.08,palette.cream,new THREE.Vector3(x,.26,0),g); box(.8,.07,.07,palette.cream,new THREE.Vector3(0,.18,0),g); box(.8,.07,.07,palette.cream,new THREE.Vector3(0,.4,0),g); }
  if(type==='swing') { for(const x of [-.3,.3]) { const post=box(.06,.98,.06,palette.wood,new THREE.Vector3(x,.49,0),g); post.rotation.z=x<0?.18:-.18; } box(.72,.06,.06,palette.wood,new THREE.Vector3(0,.96,0),g); for(const x of [-.13,.13]) cylinder(.012,.012,.45,0xe7d9bd,new THREE.Vector3(x,.57,0),g); box(.38,.07,.18,0xe98759,new THREE.Vector3(0,.35,0),g); }
  if(type==='bicycle') { for(const x of [-.25,.25]) { const wheel=mesh(new THREE.TorusGeometry(.18,.025,8,16),mat(0x4c5960),new THREE.Vector3(x,.2,0),g); wheel.rotation.y=Math.PI/2; } const frame=box(.46,.05,.05,0xe66f52,new THREE.Vector3(0,.34,0),g); frame.rotation.z=-.38; box(.06,.36,.05,0xe66f52,new THREE.Vector3(.18,.43,0),g); box(.22,.05,.05,palette.dark,new THREE.Vector3(.17,.61,0),g); }
  if(type==='stone') { for(const [x,z,s] of [[-.2,-.05,.22],[.14,.05,.28],[.02,.2,.18]]) { const rock=sphere(s,0xb9b2a1,new THREE.Vector3(x,.06,z),g); rock.scale.y=.35; } }
  if(type==='mushroom') { cylinder(.09,.12,.32,0xffe6c5,new THREE.Vector3(0,.16,0),g); const cap=sphere(.27,0xe77c5c,new THREE.Vector3(0,.37,0),g); cap.scale.y=.55; sphere(.035,0xfff6df,new THREE.Vector3(-.1,.44,.17),g); sphere(.03,0xfff6df,new THREE.Vector3(.12,.45,.14),g); }
  if(type==='birdbath') { cylinder(.06,.1,.48,0x879aa1,new THREE.Vector3(0,.24,0),g); const bath=mesh(new THREE.CylinderGeometry(.3,.21,.10,20),mat(0x9ebec4),new THREE.Vector3(0,.51,0),g); bath.scale.y=.55; sphere(.04,0x5f7f95,new THREE.Vector3(.08,.55,0),g); }
  if(type==='lantern') { box(.18,.42,.18,0x7b5a3f,new THREE.Vector3(0,.28,0),g); sphere(.09,0xffe797,new THREE.Vector3(0,.3,.1),g); const cap=mesh(new THREE.ConeGeometry(.17,.16,4),mat(palette.dark),new THREE.Vector3(0,.57,0),g); cap.rotation.y=Math.PI/4; }
  if(type==='leafplant') { cylinder(.22,.28,.35,palette.pot,new THREE.Vector3(0,.18,0),g); for(let i=0;i<5;i++){ const leaf=sphere(.18,0x5e9b68,new THREE.Vector3(Math.cos(i*1.26)*.17,.52,Math.sin(i*1.26)*.17),g); leaf.scale.set(.65,1.45,.65); } }
  if(type==='watering') { const can=cylinder(.18,.18,.32,0x79a9b3,new THREE.Vector3(0,.23,0),g); can.rotation.z=Math.PI/2; const spout=box(.38,.07,.07,0x79a9b3,new THREE.Vector3(.27,.28,0),g); spout.rotation.z=.22; const handle=mesh(new THREE.TorusGeometry(.14,.03,8,16,Math.PI),mat(0x79a9b3),new THREE.Vector3(-.08,.39,0),g); handle.rotation.y=Math.PI/2; }
  if(type==='flowerbed') { box(.72,.16,.48,0x8a5a3f,new THREE.Vector3(0,.08,0),g); for(const x of [-.22,0,.22]) { cylinder(.018,.025,.36,0x537b50,new THREE.Vector3(x,.28,0),g); sphere(.11,x===0?0xf3bb43:0xed8194,new THREE.Vector3(x,.49,0),g); } }
  if(type==='sunflower') { cylinder(.035,.05,.75,0x55763d,new THREE.Vector3(0,.38,0),g); for(let i=0;i<8;i++){ const a=i*Math.PI/4; const petal=sphere(.11,0xffd24d,new THREE.Vector3(Math.cos(a)*.16,.82,Math.sin(a)*.16),g); petal.scale.y=.55; } sphere(.11,0x70462f,new THREE.Vector3(0,.82,0),g); }
  if(type==='gnome') { mesh(new THREE.ConeGeometry(.22,.48,16),mat(0x4d8fb0),new THREE.Vector3(0,.24,0),g); sphere(.13,0xffd1ad,new THREE.Vector3(0,.54,0),g); mesh(new THREE.ConeGeometry(.17,.36,16),mat(0xe45f59),new THREE.Vector3(0,.78,0),g); }
  if(type==='basket') { cylinder(.28,.23,.28,0xc78a4f,new THREE.Vector3(0,.14,0),g); const handle=mesh(new THREE.TorusGeometry(.21,.03,8,16,Math.PI),mat(0x9b663d),new THREE.Vector3(0,.38,0),g); handle.rotation.y=Math.PI/2; sphere(.1,0xf07e5a,new THREE.Vector3(-.1,.3,.05),g); sphere(.09,0xf1b640,new THREE.Vector3(.1,.31,.05),g); }
  if(type==='hammock') { for(const x of [-.38,.38]) box(.06,.85,.06,palette.wood,new THREE.Vector3(x,.43,0),g); const bed=mesh(new THREE.PlaneGeometry(.68,.28),mat(0xe8967a),new THREE.Vector3(0,.45,0),g); bed.rotation.x=-Math.PI/2; }
  if(type==='arch') { for(const x of [-.28,.28]) box(.08,.74,.08,0xf5edd2,new THREE.Vector3(x,.37,0),g); const arch=mesh(new THREE.TorusGeometry(.28,.045,8,20,Math.PI),mat(0xf5edd2),new THREE.Vector3(0,.72,0),g); arch.rotation.y=Math.PI; sphere(.09,0xf08b94,new THREE.Vector3(-.24,.7,.03),g); sphere(.09,0xf08b94,new THREE.Vector3(.24,.7,.03),g); }
  if(type==='chime') { box(.42,.05,.08,palette.wood,new THREE.Vector3(0,.8,0),g); for(const x of [-.14,0,.14]) cylinder(.02,.02,.44,0xd6e1df,new THREE.Vector3(x,.56,0),g); cylinder(.025,.025,.84,palette.wood,new THREE.Vector3(0,.42,0),g); }
  if(type==='pumpkin') { for(const x of [-.12,0,.12]) { const pumpkin=sphere(.2,0xf39b36,new THREE.Vector3(x,.19,0),g); pumpkin.scale.y=.8; } cylinder(.025,.03,.12,0x59804a,new THREE.Vector3(0,.42,0),g); }
  if(type==='cat') { sphere(.2,0xe69c62,new THREE.Vector3(-.05,.2,0),g); sphere(.15,0xe69c62,new THREE.Vector3(.19,.25,0),g); for(const x of [.12,.26]) { const ear=mesh(new THREE.ConeGeometry(.07,.13,3),mat(0xe69c62),new THREE.Vector3(x,.42,0),g); ear.rotation.z=.1; } const tail=mesh(new THREE.TorusGeometry(.16,.025,8,16,Math.PI),mat(0xe69c62),new THREE.Vector3(-.22,.29,0),g); tail.rotation.y=-Math.PI/2; }
  if(type==='dog') { sphere(.23,0xc78653,new THREE.Vector3(-.08,.23,0),g); sphere(.15,0xc78653,new THREE.Vector3(.22,.27,0),g); sphere(.07,0x795039,new THREE.Vector3(.28,.34,.11),g); const tail=mesh(new THREE.TorusGeometry(.14,.025,8,16,Math.PI),mat(0xc78653),new THREE.Vector3(-.28,.32,0),g); tail.rotation.y=Math.PI/2; }
  if(type==='stepping') { for(const [x,z] of [[-.23,-.12],[.08,0],[.25,.15]]) { const step=sphere(.19,0xd8c99a,new THREE.Vector3(x,.05,z),g); step.scale.y=.24; } }
  if(type==='topiary') { cylinder(.2,.27,.34,palette.pot,new THREE.Vector3(0,.17,0),g); cylinder(.06,.07,.36,palette.wood,new THREE.Vector3(0,.48,0),g); sphere(.28,0x54834f,new THREE.Vector3(0,.77,0),g); sphere(.18,0x6da05d,new THREE.Vector3(.16,.69,.03),g); }
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
  interiorLight.intensity=doorOpen?.9:0;
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
function frame(time){ resize(); if(!dragging&&!userHasDragged) desiredRotation=.44+Math.sin(time*.00022)*.08; world.rotation.y += (desiredRotation-world.rotation.y)*.055; doorPivot.rotation.y += (doorTargetRotation-doorPivot.rotation.y)*.14; camera.lookAt(target); updateDecorHotspots(); updateHouseName(); renderer.render(scene,camera); requestAnimationFrame(frame); }
requestAnimationFrame(frame);

function homeImageFileName(){
  const now=new Date();
  const stamp=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('')+'-'+[String(now.getHours()).padStart(2,'0'),String(now.getMinutes()).padStart(2,'0')].join('');
  return `my-little-home-${stamp}.png`;
}
function captureHomeImage(){
  renderer.render(scene,camera);
  const verticalMargin=Math.round(canvas.width*.12);
  const snapshot=document.createElement('canvas'); snapshot.width=canvas.width; snapshot.height=canvas.height+verticalMargin*2;
  const context=snapshot.getContext('2d'); context.fillStyle='#f5cd58'; context.fillRect(0,0,snapshot.width,snapshot.height); context.drawImage(canvas,0,verticalMargin);
  return new Promise((resolve,reject)=>snapshot.toBlob(blob=>blob?resolve(blob):reject(new Error('capture failed')),'image/png'));
}
function downloadHomeImage(blob,fileName){
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a'); link.href=url; link.download=fileName; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function showCaptureNotice(title,description){
  const message=toast.querySelector('p');
  toast.querySelector('span').textContent='✦';
  message.replaceChildren();
  const heading=document.createElement('b'); heading.textContent=title;
  message.append(heading,document.createTextNode(description));
  toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3200);
}
let capturedImageBlob=null, capturedImageUrl='', capturedImageName='';
async function openCapturePreview(){
  try {
    capturedImageBlob=await captureHomeImage();
    capturedImageName=homeImageFileName();
    if(capturedImageUrl) URL.revokeObjectURL(capturedImageUrl);
    capturedImageUrl=URL.createObjectURL(capturedImageBlob);
    capturedHomeImage.src=capturedImageUrl;
    captureBackdrop.classList.add('open'); captureBackdrop.setAttribute('aria-hidden','false');
    setTimeout(()=>saveCapturedImageButton.focus(),160);
  } catch { showCaptureNotice('이미지를 만들지 못했어요.','잠시 후 다시 시도해 주세요.'); }
}
function closeCapturePreview(){ captureBackdrop.classList.remove('open'); captureBackdrop.setAttribute('aria-hidden','true'); }
function saveCapturedImage(){
  if(!capturedImageBlob) return;
  downloadHomeImage(capturedImageBlob,capturedImageName);
  showCaptureNotice('사진을 저장했어요!','다운로드한 PNG 파일을 확인해 보세요.');
}
async function shareCapturedImage(){
  if(!capturedImageBlob) return;
  try {
    const file=new File([capturedImageBlob],capturedImageName,{type:'image/png'});
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
      await navigator.share({ title:'나의 오늘의 집', text:'오늘의 잘한 일로 꾸민 나의 작은 집이에요.', files:[file] });
      showCaptureNotice('사진을 공유했어요!','따뜻한 오늘을 함께 나눴어요.');
      return;
    }
    downloadHomeImage(file,capturedImageName);
    showCaptureNotice('공유용 이미지를 저장했어요!','이 기기에서는 저장한 파일로 공유할 수 있어요.');
  } catch(error) {
    if(error?.name!=='AbortError') showCaptureNotice('공유를 준비하지 못했어요.','잠시 후 다시 시도해 주세요.');
  }
}
openHomeCaptureButton.addEventListener('click',openCapturePreview);
closeCaptureButton.addEventListener('click',closeCapturePreview);
captureBackdrop.addEventListener('click',event=>{ if(event.target===captureBackdrop) closeCapturePreview(); });
saveCapturedImageButton.addEventListener('click',saveCapturedImage);
shareCapturedImageButton.addEventListener('click',shareCapturedImage);

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
  const shown = memories.slice(0,3).map(m=>`<li><span class="memory-dot ${m.decor}">${DECOR_INFO[m.decor]?.icon||'✦'}</span><div><b>${escapeHTML(m.text)}</b><small>${formatMemoryTimestamp(m.date)}</small></div></li>`).join('');
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
decorOptions.addEventListener('click',event=>{ const button=event.target.closest('.decor-option'); if(!button) return; selectedDecor=button.dataset.decor; renderDecorOptions(); });
document.querySelector('#save-memory').addEventListener('click',()=>{
  const text=input.value.trim();
  if(!text){ input.focus(); input.placeholder='오늘의 잘한 일을 한 줄로 적어 주세요 :)'; return; }
  const flowerColor=selectedDecor==='flower'?randomFlowerColor():null;
  const memory={text,decor:selectedDecor,date:new Date().toISOString(),flowerColor}; memories.unshift(memory); localStorage.setItem(STORAGE_KEY,JSON.stringify(memories)); addDecoration(selectedDecor,memories.length+1,true,text,`memory-${memory.date}`,flowerColor); renderRecords(); input.value=''; closeModal(); toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3600);
});
input.addEventListener('keydown',e=>{ if(e.key==='Enter') document.querySelector('#save-memory').click(); });
document.querySelector('#sound-button').addEventListener('click',e=>{ e.currentTarget.textContent=e.currentTarget.textContent==='♪'?'×':'♪'; });
