import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.min.js';

const canvas = document.querySelector('#house-canvas');
const sceneWrap = document.querySelector('.scene-wrap');
const sceneLoader = document.querySelector('#scene-loader');
const modal = document.querySelector('#entry-backdrop');
const input = document.querySelector('#memory-input');
const recentList = document.querySelector('#recent-list');
const countEl = document.querySelector('#record-count');
const progressFill = document.querySelector('#progress-fill');
const rewardTotalDays = document.querySelector('#reward-total-days');
const rewardMilestones = document.querySelector('#reward-milestones');
const rewardBackdrop = document.querySelector('#reward-backdrop');
const rewardModalTitle = document.querySelector('#reward-modal-title');
const rewardModalDescription = document.querySelector('#reward-modal-description');
const rewardChoiceList = document.querySelector('#reward-choice-list');
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
const openRemindersButton = document.querySelector('#open-reminders');
const reminderBackdrop = document.querySelector('#reminder-backdrop');
const reminderList = document.querySelector('#reminder-list');
const saveRemindersButton = document.querySelector('#save-reminders');
const downloadRemindersButton = document.querySelector('#download-reminders');
const decorTooltip = document.querySelector('#decor-tooltip');
const houseNameEditor = document.querySelector('#house-name-editor');
const houseNameButton = document.querySelector('#house-name-button');
const houseNameText = document.querySelector('#house-name-text');
const houseNameInput = document.querySelector('#house-name-input');
const openHomeCaptureButton = document.querySelector('#open-home-capture');
const shareHomeLinkButton = document.querySelector('#share-home-link');
const captureBackdrop = document.querySelector('#capture-backdrop');
const closeCaptureButton = document.querySelector('#close-capture');
const capturedHomeImage = document.querySelector('#captured-home-image');
const saveCapturedImageButton = document.querySelector('#save-captured-image');
const shareCapturedImageButton = document.querySelector('#share-captured-image');
const decorOptions = document.querySelector('#decor-options');
const managerBackdrop = document.querySelector('#manager-backdrop');
const managerList = document.querySelector('#manager-list');
const weekSummary = document.querySelector('#week-summary');
const managerEditor = document.querySelector('#manager-editor');
const editMemoryText = document.querySelector('#edit-memory-text');
const guideBackdrop = document.querySelector('#guide-backdrop');
const doorMissionBadge = document.querySelector('#door-mission-badge');
const doorMissionCopy = document.querySelector('#door-mission-copy');
const doorMissionCount = document.querySelector('#door-mission-count');
const interiorView = document.querySelector('#interior-view');
const interiorRoom = document.querySelector('#interior-room');
const interiorCanvas = document.querySelector('#interior-canvas');
const interiorItems = document.querySelector('#interior-items');
const interiorInventoryList = document.querySelector('#interior-inventory-list');
const interiorItemCount = document.querySelector('#interior-item-count');
const interiorHouseName = document.querySelector('#interior-house-name');
const interiorRoomMap = document.querySelector('#interior-room-map');
const interior3DHint = document.querySelector('#interior-3d-hint');
const interiorProgressCopy = document.querySelector('#interior-progress-copy');
const interiorRoomAction = document.querySelector('#interior-room-action');
const roomActionIcon = document.querySelector('#room-action-icon');
const roomActionTitle = document.querySelector('#room-action-title');
const roomActionDescription = document.querySelector('#room-action-description');
const interiorActivityButton = document.querySelector('#interior-activity-button');
const interiorInventoryTitle = document.querySelector('#interior-inventory-title');
const interiorInventoryHelp = document.querySelector('#interior-inventory-help');
const futureRoomCard = document.querySelector('#future-room-card');
const futureRoomTitle = document.querySelector('#future-room-title');
const futureRoomDescription = document.querySelector('#future-room-description');
const adminPreviewButton = document.querySelector('#admin-preview-button');
const adminPreviewBackdrop = document.querySelector('#admin-preview-backdrop');
const adminPreviewStatus = document.querySelector('#admin-preview-status');
const stopAdminPreviewButton = document.querySelector('#stop-admin-preview');
const STORAGE_KEY = 'my-little-day-memories-v1';
const HOUSE_NAME_KEY = 'my-little-day-house-name-v1';
const STREAK_START_KEY = 'my-little-day-streak-start-v1';
const DECOR_LAYOUT_KEY = 'my-little-day-decor-layout-v1';
const GUIDE_SEEN_KEY = 'my-little-day-guide-seen-v1';
const INTERIOR_LAYOUT_KEY = 'my-little-day-interior-layout-v1';
const REMINDER_STORAGE_KEY = 'my-little-day-reminders-v1';
const REMINDER_LAST_FIRED_KEY = 'my-little-day-reminder-last-fired-v1';
const MILESTONE_REWARDS_KEY = 'my-little-day-milestone-rewards-v1';
const MONTHLY_TARGET_DAYS = 15;
const INTERIOR_UNLOCK_DAYS = 3;
const SHARE_HASH_PREFIX = '#my-little-home=';
const SHARE_ID_PREFIX = '#share=';
const SHARE_LINK_CACHE_KEY = 'my-little-day-last-share-link-v1';
const SHARE_ENDPOINT = 'https://alpxeyqkqlacbbluwazq.supabase.co/functions/v1/home-share';
const SHARE_PUBLISHABLE_KEY = 'sb_publishable_kx3FsYOCmIZJTVcIDr1B0g_FWZr8BT_';
const REMINDER_PRESETS = {
  morning:{label:'아침',time:'08:00'},
  lunch:{label:'점심',time:'12:30'},
  evening:{label:'저녁',time:'19:00'},
  bedtime:{label:'자기 전',time:'22:30'}
};
const REWARD_MILESTONES = [
  {days:1,title:'첫 집 꾸미기 아이템',description:'기록을 남기자마자 장식 하나를 받아요.'},
  {days:3,title:'집 문과 실내 공개',description:'문을 열고 따뜻한 원룸을 직접 꾸며요.'},
  {days:7,title:'희귀 아이템 선택',description:'특별한 장식 3개 중 하나를 골라요.',action:'rare'},
  {days:14,title:'외관 변경권',description:'지붕·창문·현관의 분위기를 바꿔요.',action:'exterior'},
  {days:30,title:'방 또는 집 업그레이드',description:'방을 넓히거나 집의 형태를 발전시켜요.'},
  {days:60,title:'핵심 장기 목표',description:'2층 증축 또는 특별한 새 집이 열려요.',longGoal:true},
  {days:90,title:'계절별 특별 공간',description:'계절 별장 또는 특별 정원을 만나요.'}
];
const RARE_REWARD_OPTIONS = [
  {id:'lantern',label:'별빛 랜턴',description:'저녁 정원을 밝혀주는 조명'},
  {id:'topiary',label:'하트 토피어리',description:'둥글고 포근한 초록 장식'},
  {id:'arch',label:'꽃 정원 아치',description:'집으로 이어지는 특별한 입구'}
];
const EXTERIOR_REWARD_OPTIONS = [
  {id:'sunset',label:'살구빛 외관',description:'지금의 따뜻한 색감을 깊게',roof:0xeb7651,door:0x99623e,window:0x93c7d0},
  {id:'berry',label:'포도빛 외관',description:'차분한 포도와 라일락 색감',roof:0x9b6b88,door:0x70506b,window:0x91bdc6},
  {id:'forest',label:'숲빛 외관',description:'초록 지붕과 호두색 현관',roof:0x62835c,door:0x75513b,window:0x80b7b2}
];
let selectedDecor = 'flower';
let editingMemoryDate = null;
let currentRewardAction = null;
let adminPreviewActive = false;
let activeInteriorRoomId = 'living';
let adminInteriorLayout = {};
let adminPreviewRewards = {rareItem:'',exteriorStyle:''};
let adminDecorLayoutSnapshot = null;
const DECOR_OPTIONS = [
  ['flower','✿','꽃 화분'],['lamp','☀','작은 조명'],['book','▤','책 더미'],['flag','⚑','응원 깃발'],['tree','♟','작은 나무'],['bigtree','♟','큰 나무'],['bench','▰','나무 벤치'],
  ['fountain','⛲','분수'],['birdhouse','⌂','새집'],['mailbox','✉','우편함'],['fence','▥','울타리'],['swing','♧','그네'],['bicycle','◎','자전거'],
  ['stone','●','정원 돌'],['mushroom','♣','버섯'],['birdbath','◉','새 목욕탕'],['lantern','◈','랜턴'],['leafplant','☘','잎 화분'],['watering','♒','물뿌리개'],
  ['flowerbed','✽','꽃밭'],['sunflower','✺','해바라기'],['gnome','♟','정원 요정'],['basket','▱','피크닉 바구니'],['hammock','⌒','해먹'],['arch','∩','정원 아치'],
  ['chime','♬','바람 종'],['pumpkin','●','호박'],['cat','⌁','고양이'],['dog','♧','강아지'],['stepping','◌','디딤돌'],['topiary','✦','토피어리'],
  ['rooflight','✦','지붕 조명']
];
const SHARE_DECOR_TYPES = DECOR_OPTIONS.map(([type])=>type);
const DECOR_INFO = Object.fromEntries(DECOR_OPTIONS.map(([type,icon,label])=>[type,{icon,label}]));
const DECOR_CATEGORIES=[
  ['식물 · 꽃',['flower','tree','bigtree','leafplant','flowerbed','sunflower','mushroom','pumpkin','topiary','stone']],
  ['정원 · 휴식',['bench','fountain','birdbath','fence','swing','hammock','arch','stepping','watering']],
  ['야외 소품',['lamp','book','flag','birdhouse','mailbox','bicycle','lantern','basket','chime']],
  ['집 · 친구',['rooflight','gnome','cat','dog']]
];
const FUTURE_DECOR_OPTIONS = ['작은 온실','연못과 오리','꽃 아치 조명','포도나무 그늘','비밀 우체통','새로운 친구'];
const INTERIOR_ROOMS = [
  {id:'living',label:'거실',icon:'🛋️',unlockDays:3,action:'쉬어가기',description:'따뜻하게 쉬고 오늘의 기록을 돌아보는 공간',target:[1.25,.78,1.0],bounds:{x:[-.05,3.05],z:[-.2,2.75]}},
  {id:'entry',label:'현관',icon:'🚪',unlockDays:3,action:'현관문 열기',description:'문을 열면 내가 꾸민 마당이 그대로 보여요',target:[-.55,.75,-2.45],bounds:{x:[-1.25,.05],z:[-3.0,-2.05]}},
  {id:'kitchen',label:'주방·식당',icon:'🍳',unlockDays:7,action:'요리하기',description:'모은 재료로 따뜻한 한 끼를 만드는 공간',target:[1.45,.78,-1.72],bounds:{x:[.05,3.05],z:[-2.95,-.42]}},
  {id:'bedroom',label:'침실',icon:'🛏️',unlockDays:14,action:'잘 준비하기',description:'하루를 정리하고 편안히 쉬는 공간',target:[-1.62,.72,1.0],bounds:{x:[-3.05,-.22],z:[-.15,2.35]}},
  {id:'bathroom',label:'욕실',icon:'🛁',unlockDays:30,action:'나 돌보기',description:'나를 씻고 다정하게 돌보는 공간',target:[-2.25,.72,-1.68],bounds:{x:[-3.05,-1.42],z:[-2.95,-.42]}},
  {id:'terrace',label:'테라스',icon:'🌿',unlockDays:60,action:'화분 물주기',description:'햇살과 바람을 느끼며 식물을 돌보는 공간',target:[-1.55,.55,2.48],bounds:{x:[-3.05,-.22],z:[2.38,2.95]}}
];
const INTERIOR_ITEMS = [
  {id:'welcome-mat',label:'포근한 현관 매트',room:'entry',unlockDays:3,x:47,y:20},
  {id:'sun-rug',label:'햇살 러그',room:'living',unlockDays:3,x:70,y:70},
  {id:'leaf-pot',label:'둥근 잎 화분',room:'living',unlockDays:3,x:84,y:62},
  {id:'mood-lamp',label:'작은 무드등',room:'living',unlockDays:3,x:62,y:54},
  {id:'book-stack',label:'저녁 책 더미',room:'living',unlockDays:5,x:76,y:80},
  {id:'picnic-basket',label:'포도 바구니',room:'kitchen',unlockDays:7,x:70,y:31},
  {id:'tea-set',label:'살구 찻잔 세트',room:'kitchen',unlockDays:7,x:58,y:27},
  {id:'soft-cushion',label:'살구 쿠션',room:'bedroom',unlockDays:14,x:27,y:70},
  {id:'sleep-lamp',label:'달빛 협탁등',room:'bedroom',unlockDays:14,x:36,y:58},
  {id:'bath-basket',label:'포근한 수건 바구니',room:'bathroom',unlockDays:30,x:16,y:29},
  {id:'terrace-planter',label:'테라스 화분',room:'terrace',unlockDays:60,x:28,y:88}
];
const DECOR_ART = {
  flower:'<path d="M29 42h15l-2-13H31z" fill="#d97855"/><path d="M36 29v-12" stroke="#4f7d50" stroke-width="3"/><g fill="#ef90a3"><circle cx="36" cy="15" r="6"/><circle cx="29" cy="20" r="6"/><circle cx="43" cy="20" r="6"/><circle cx="31" cy="27" r="6"/><circle cx="41" cy="27" r="6"/></g><circle cx="36" cy="21" r="4" fill="#f8cb50"/>',
  lamp:'<path d="M36 43V24" stroke="#75533c" stroke-width="4"/><path d="M23 27h26L36 12z" fill="#f3c558"/><circle cx="36" cy="29" r="6" fill="#fff0a3"/>',
  book:'<rect x="18" y="34" width="35" height="8" rx="2" fill="#dc7658"/><rect x="22" y="26" width="32" height="8" rx="2" fill="#f0bd48"/><rect x="18" y="18" width="33" height="8" rx="2" fill="#72a7a4"/>',
  flag:'<path d="M26 43V11" stroke="#79543a" stroke-width="4"/><path d="M28 13h25L42 23l11 10H28z" fill="#eb7d62"/>',
  tree:'<path d="M36 44V31" stroke="#795039" stroke-width="6"/><circle cx="29" cy="24" r="13" fill="#5c8e58"/><circle cx="42" cy="25" r="13" fill="#6c9f60"/><circle cx="35" cy="15" r="14" fill="#477f50"/>',
  bigtree:'<path d="M36 45V29" stroke="#795039" stroke-width="8"/><circle cx="25" cy="25" r="15" fill="#5a8b52"/><circle cx="47" cy="26" r="15" fill="#6fa161"/><circle cx="36" cy="14" r="18" fill="#477f50"/><circle cx="35" cy="28" r="16" fill="#5f9558"/>',
  bench:'<path d="M20 33h34v7H20zM23 22h30v7H23z" fill="#a66d45"/><path d="M27 40v6m20-6v6" stroke="#795039" stroke-width="4"/>',
  fountain:'<ellipse cx="36" cy="40" rx="21" ry="7" fill="#74a9b4"/><path d="M29 39v-12h14v12" fill="#8ac0c6"/><path d="M31 26c0-8 10-9 10 0" fill="none" stroke="#dff7f3" stroke-width="3"/>',
  birdhouse:'<path d="M36 43V30" stroke="#795039" stroke-width="4"/><path d="M23 32V19h26v13z" fill="#7cadbf"/><path d="M20 20l16-11 16 11z" fill="#e97b58"/><circle cx="36" cy="25" r="4" fill="#46382c"/>',
  mailbox:'<path d="M28 44V31" stroke="#795039" stroke-width="4"/><path d="M19 32v-11c0-7 7-9 16-9h10v20z" fill="#5e9fba"/><path d="M35 12v20" stroke="#447b97" stroke-width="2"/>',
  fence:'<path d="M17 40h38M17 31h38" stroke="#fff2d2" stroke-width="4"/><path d="M22 44V18l4-6 4 6v26m11 0V18l4-6 4 6v26" stroke="#fff2d2" stroke-width="4"/>',
  swing:'<path d="M19 43L28 13m25 30L44 13M25 16h22" stroke="#795039" stroke-width="4"/><path d="M32 17v15m8-15v15" stroke="#eee2c8" stroke-width="2"/><path d="M28 32h16v5H28z" fill="#e98962"/>',
  bicycle:'<circle cx="23" cy="37" r="8" fill="none" stroke="#4d5960" stroke-width="3"/><circle cx="50" cy="37" r="8" fill="none" stroke="#4d5960" stroke-width="3"/><path d="M23 37l12-16 8 16H23l15-7 12 7M35 21h9m-8 0l-4-5" fill="none" stroke="#e16f54" stroke-width="3"/>',
  stone:'<ellipse cx="23" cy="38" rx="10" ry="6" fill="#a9a799"/><ellipse cx="38" cy="35" rx="13" ry="8" fill="#c6bfaa"/><ellipse cx="53" cy="40" rx="8" ry="5" fill="#a9a799"/>',
  mushroom:'<path d="M31 43V30h10v13z" fill="#fff0d4"/><path d="M20 31c2-14 30-14 32 0z" fill="#e77c5c"/><g fill="#fff8e8"><circle cx="29" cy="25" r="2"/><circle cx="40" cy="21" r="2"/><circle cx="46" cy="27" r="2"/></g>',
  birdbath:'<path d="M33 43v-13h6v13" fill="#879aa1"/><ellipse cx="36" cy="28" rx="16" ry="7" fill="#9ec1c7"/><ellipse cx="36" cy="27" rx="10" ry="3" fill="#d9f0ec"/>',
  lantern:'<path d="M25 42V22h22v20z" fill="#74543b"/><path d="M29 38V25h14v13z" fill="#ffe79a"/><path d="M24 22l12-10 12 10" fill="#493727"/>',
  leafplant:'<path d="M29 43h15l-2-13H31z" fill="#d97855"/><path d="M36 31V17" stroke="#527f50" stroke-width="3"/><g fill="#5f9a65"><ellipse cx="27" cy="23" rx="6" ry="10" transform="rotate(-35 27 23)"/><ellipse cx="45" cy="23" rx="6" ry="10" transform="rotate(35 45 23)"/><ellipse cx="36" cy="17" rx="6" ry="10"/></g>',
  watering:'<path d="M23 35a12 12 0 0 1 24 0v7H23z" fill="#78aabd"/><path d="M46 34l13-7" stroke="#78aabd" stroke-width="5"/><path d="M25 30c0-12 15-12 15 0" fill="none" stroke="#78aabd" stroke-width="4"/>',
  flowerbed:'<path d="M16 43h40l-3-14H19z" fill="#895b42"/><path d="M25 30v-10m11 10V16m11 14V20" stroke="#4e7c4e" stroke-width="3"/><g fill="#ef8fa1"><circle cx="25" cy="18" r="4"/><circle cx="47" cy="18" r="4"/></g><circle cx="36" cy="14" r="5" fill="#f5c74d"/>',
  sunflower:'<path d="M36 43V26" stroke="#547a3f" stroke-width="4"/><g fill="#ffd256"><circle cx="36" cy="16" r="12"/><circle cx="25" cy="16" r="6"/><circle cx="47" cy="16" r="6"/><circle cx="36" cy="5" r="6"/><circle cx="36" cy="27" r="6"/></g><circle cx="36" cy="16" r="7" fill="#70462f"/>',
  gnome:'<path d="M25 43c0-14 22-14 22 0z" fill="#5692b2"/><circle cx="36" cy="25" r="8" fill="#ffd0ab"/><path d="M22 22l14-15 14 15z" fill="#e6635d"/>',
  basket:'<path d="M20 42c1-16 31-16 32 0z" fill="#c88b4e"/><path d="M27 29c0-14 18-14 18 0" fill="none" stroke="#9b663d" stroke-width="4"/><circle cx="31" cy="35" r="4" fill="#ed7e5a"/><circle cx="41" cy="35" r="4" fill="#f1b640"/>',
  hammock:'<path d="M18 43V14m36 29V14" stroke="#795039" stroke-width="4"/><path d="M20 26c11 19 22 19 34 0-10 6-24 6-34 0z" fill="#e8967a"/>',
  arch:'<path d="M22 43V27a14 14 0 0 1 28 0v16" fill="none" stroke="#f6ecd3" stroke-width="5"/><g fill="#ef8fa1"><circle cx="24" cy="28" r="5"/><circle cx="31" cy="16" r="5"/><circle cx="43" cy="16" r="5"/><circle cx="50" cy="28" r="5"/></g>',
  chime:'<path d="M20 16h32" stroke="#795039" stroke-width="4"/><path d="M25 17v20m11-20v25m11-25v20" stroke="#cfdfe0" stroke-width="3"/><path d="M20 16l16-8 16 8" fill="none" stroke="#795039" stroke-width="3"/>',
  pumpkin:'<path d="M36 17v-6" stroke="#587945" stroke-width="4"/><g fill="#f39b36"><ellipse cx="27" cy="34" rx="10" ry="9"/><ellipse cx="36" cy="33" rx="11" ry="11"/><ellipse cx="45" cy="34" rx="10" ry="9"/></g>',
  cat:'<path d="M22 41c0-18 21-20 27-8 8 15-8 12-13 5" fill="#e79d64"/><circle cx="43" cy="25" r="8" fill="#e79d64"/><path d="M37 19l3-7 5 6m3 0l4-6 2 8" fill="#e79d64"/>',
  dog:'<path d="M20 40c0-15 24-16 27-3 3 11-16 10-19 4" fill="#c78653"/><circle cx="45" cy="27" r="8" fill="#c78653"/><ellipse cx="48" cy="20" rx="4" ry="7" fill="#795039"/>',
  stepping:'<ellipse cx="21" cy="40" rx="10" ry="5" fill="#dbc99a"/><ellipse cx="36" cy="32" rx="10" ry="5" fill="#e8d7a8"/><ellipse cx="51" cy="22" rx="10" ry="5" fill="#dbc99a"/>',
  topiary:'<path d="M29 43h15l-2-12H31z" fill="#d97855"/><path d="M36 31V23" stroke="#795039" stroke-width="4"/><circle cx="36" cy="16" r="12" fill="#57854f"/><circle cx="43" cy="21" r="8" fill="#6ba15d"/>',
  rooflight:'<path d="M13 29L36 10l23 19" fill="#e97855"/><path d="M17 27c10-2 27-2 38 0" fill="none" stroke="#534338" stroke-width="3"/><g fill="#ffe075"><circle cx="21" cy="29" r="4"/><circle cx="29" cy="27" r="4"/><circle cx="36" cy="26" r="4"/><circle cx="43" cy="27" r="4"/><circle cx="51" cy="29" r="4"/></g>'
};
function decorThumbnail(type){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 52"><rect width="72" height="52" rx="10" fill="#fff1c9"/><path d="M0 45c19-8 49-8 72 0v7H0z" fill="#b7d774"/>${DECOR_ART[type]||''}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
function interiorItemMarkup(type){
  if(type==='welcome-mat') return '<span class="interior-item-art art-welcome-mat"><i>HI</i></span>';
  if(type==='sun-rug') return '<span class="interior-item-art art-rug"><i></i><b></b></span>';
  if(type==='leaf-pot') return '<span class="interior-item-art art-plant"><i></i><i></i><i></i><b></b></span>';
  if(type==='mood-lamp') return '<span class="interior-item-art art-lamp"><i></i><b></b><em></em></span>';
  if(type==='soft-cushion') return '<span class="interior-item-art art-cushion"><i></i><b></b></span>';
  if(type==='book-stack') return '<span class="interior-item-art art-books"><i></i><b></b><em></em></span>';
  if(type==='picnic-basket'||type==='bath-basket') return '<span class="interior-item-art art-basket"><i></i><b></b><em></em></span>';
  if(type==='tea-set') return '<span class="interior-item-art art-tea"><i></i><b></b><em></em></span>';
  if(type==='sleep-lamp') return '<span class="interior-item-art art-sleep-lamp"><i></i><b></b><em></em></span>';
  return '<span class="interior-item-art art-terrace-planter"><i></i><i></i><b></b></span>';
}
function renderDecorOptions(){
  const available=DECOR_CATEGORIES.map(([category,types])=>`<section class="decor-category" aria-label="${category}"><h3>${category}</h3><div class="decor-category-grid">${types.map(type=>{ const {label}=DECOR_INFO[type]; return `<button class="decor-option${type===selectedDecor?' selected':''}" data-decor="${type}" type="button"><img class="decor-option-image" src="${decorThumbnail(type)}" alt="" aria-hidden="true" /><span class="decor-option-label">${label}</span></button>`; }).join('')}</div></section>`).join('');
  const future=`<section class="decor-category future-decor-category" aria-label="곧 공개될 장식"><h3>곧 만날 장식 <span>아직 비공개 · 추후 공개</span></h3><div class="decor-category-grid">${FUTURE_DECOR_OPTIONS.map(label=>`<article class="decor-option locked-decor" aria-label="${label}, 추후 공개"><span class="locked-decor-image">?</span><span class="decor-option-label">${label}</span><small>COMING SOON</small></article>`).join('')}</div></section>`;
  decorOptions.innerHTML=available+future;
}
renderDecorOptions();
function decodeSharedHome(){
  const encoded=location.hash.startsWith(SHARE_HASH_PREFIX)?location.hash.slice(SHARE_HASH_PREFIX.length):'';
  if(!encoded) return null;
  try {
    const unpacked=window.LZString?.decompressFromEncodedURIComponent(encoded);
    const padded=encoded.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((encoded.length+3)%4);
    const binary=unpacked?null:atob(padded);
    const bytes=binary?Uint8Array.from(binary,char=>char.charCodeAt(0)):null;
    const data=JSON.parse(unpacked||new TextDecoder().decode(bytes));
    if(data.v===2) return unpackSharedHome(data);
    if(!Array.isArray(data.memories)||!data.decorLayout||typeof data.houseName!=='string') return null;
    return data;
  } catch { return null; }
}
function sharedHomeIdFromHash(){
  const id=location.hash.startsWith(SHARE_ID_PREFIX)?location.hash.slice(SHARE_ID_PREFIX.length):'';
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)?id:'';
}
async function loadSharedHome(id){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),8000);
  try {
    const response=await fetch(`${SHARE_ENDPOINT}?id=${encodeURIComponent(id)}`,{
      headers:{apikey:SHARE_PUBLISHABLE_KEY},
      signal:controller.signal,
    });
    if(!response.ok) return null;
    const payload=await response.json();
    return payload?.state?.v===2?unpackSharedHome(payload.state):null;
  } catch { return null; }
  finally { clearTimeout(timeout); }
}
function compactDecorationId(id){
  return id.startsWith('memory-')?`m${Date.parse(id.slice(7))}`:id==='starter-flower'?'s0':id==='starter-book'?'s1':id;
}
function expandDecorationId(id){
  if(typeof id!=='string') return '';
  if(id.startsWith('m')) {
    const time=Number(id.slice(1));
    return Number.isFinite(time)?`memory-${new Date(time).toISOString()}`:id;
  }
  return id==='s0'?'starter-flower':id==='s1'?'starter-book':id;
}
function packSharedHome(){
  const active=placed.children.map(decoration=>{
    const saved=decorLayout[decoration.userData.decorationId]||{};
    const bloomMask=(saved.bloomedBuds||[]).reduce((bits,index)=>bits|(1<<index),0);
    return [
      compactDecorationId(decoration.userData.decorationId),
      Math.round(decoration.position.x*100),
      Math.round(decoration.position.z*100),
      decoration.userData.flowerColor||saved.flowerColor||0,
      bloomMask,
      decoration.userData.roofLightOn?1:0
    ];
  });
  return {
    v:2,
    m:memories.map(memory=>[memory.text,SHARE_DECOR_TYPES.indexOf(memory.decor),Date.parse(memory.date)||0,memory.flowerColor||0]),
    s:streakStartDate,
    n:houseName,
    r:[milestoneRewards.rareItem||'',milestoneRewards.exteriorStyle||''],
    d:active,
    w:[Math.round(world.rotation.y*1000),Math.round(camera.position.y*100)]
  };
}
function unpackSharedHome(data){
  if(!Array.isArray(data.m)||!Array.isArray(data.d)||typeof data.n!=='string') return null;
  const memories=data.m.map(([text,typeIndex,time,flowerColor])=>({
    text:String(text||''),
    decor:SHARE_DECOR_TYPES[typeIndex]||'flower',
    date:Number.isFinite(time)&&time>0?new Date(time).toISOString():new Date().toISOString(),
    flowerColor:flowerColor||null
  }));
  const decorLayout={};
  data.d.forEach(([compactId,x,z,flowerColor,bloomMask,roofLightOn])=>{
    const id=expandDecorationId(compactId);
    if(!id||!Number.isFinite(x)||!Number.isFinite(z)) return;
    const saved={x:x/100,z:z/100};
    if(flowerColor) saved.flowerColor=flowerColor;
    if(bloomMask) saved.bloomedBuds=[0,1,2].filter(index=>bloomMask&(1<<index));
    if(roofLightOn) saved.roofLightOn=true;
    decorLayout[id]=saved;
  });
  return {memories,streakStartDate:data.s||'',houseName:data.n,decorLayout,milestoneRewards:{rareItem:data.r?.[0]||'',exteriorStyle:data.r?.[1]||''},view:{rotation:(data.w?.[0]??440)/1000,cameraHeight:(data.w?.[1]??630)/100}};
}
function encodeSharedHome(data){
  const packed=window.LZString?.compressToEncodedURIComponent(JSON.stringify(data));
  if(packed) return packed;
  const bytes=new TextEncoder().encode(JSON.stringify(data));
  let binary='';
  bytes.forEach(byte=>{ binary+=String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
let sharedHome=decodeSharedHome();
const shortSharedHomeId=sharedHomeIdFromHash();
if(!sharedHome&&shortSharedHomeId) sharedHome=await loadSharedHome(shortSharedHomeId);
const isSharedHome=Boolean(sharedHome);
const adminPreviewAllowed=!isSharedHome&&(['localhost','127.0.0.1'].includes(location.hostname)||new URLSearchParams(location.search).get('admin')==='preview');
adminPreviewButton.hidden=!adminPreviewAllowed;
const sharedView=sharedHome?.view||{};
const sharedRotation=Number.isFinite(sharedView.rotation)?sharedView.rotation:.44;
const sharedCameraHeight=Number.isFinite(sharedView.cameraHeight)?sharedView.cameraHeight:6.3;
function persistLocal(key,value){ if(!isSharedHome&&!adminPreviewActive) localStorage.setItem(key,value); }
let memories = sharedHome?.memories ?? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let streakStartDate = sharedHome?.streakStartDate ?? (localStorage.getItem(STREAK_START_KEY) || '');
let decorLayout = sharedHome?.decorLayout ?? JSON.parse(localStorage.getItem(DECOR_LAYOUT_KEY) || '{}');
let houseName = sharedHome?.houseName ?? (localStorage.getItem(HOUSE_NAME_KEY) || '우리');
let interiorLayout = isSharedHome ? {} : JSON.parse(localStorage.getItem(INTERIOR_LAYOUT_KEY) || '{}');
function loadMilestoneRewards(){
  try { return JSON.parse(localStorage.getItem(MILESTONE_REWARDS_KEY)||'{}')||{}; }
  catch { return {}; }
}
let milestoneRewards=sharedHome?.milestoneRewards??loadMilestoneRewards();
function loadReminderSettings(){
  let saved={};
  try { saved=JSON.parse(localStorage.getItem(REMINDER_STORAGE_KEY)||'{}')||{}; } catch {}
  return Object.fromEntries(Object.entries(REMINDER_PRESETS).map(([id,preset])=>[id,{
    enabled:Boolean(saved[id]?.enabled),
    time:/^([01]\d|2[0-3]):[0-5]\d$/.test(saved[id]?.time||'')?saved[id].time:preset.time
  }]));
}
let reminderSettings=loadReminderSettings();
if(!isSharedHome&&!streakStartDate&&memories.length){
  const firstRecordTime=Math.min(...memories.map(memory=>Date.parse(memory.date)).filter(Number.isFinite));
  if(Number.isFinite(firstRecordTime)){
    streakStartDate=localDateString(new Date(firstRecordTime));
    persistLocal(STREAK_START_KEY,streakStartDate);
  }
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, preserveDrawingBuffer:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
camera.position.set(3.6, 6.3, 13.6);
const target = new THREE.Vector3(0, 1.45, 0);
const world = new THREE.Group();
// Keep the front facade in view so the open doorway can reveal the room depth.
world.rotation.y = .44;
scene.add(world);

scene.add(new THREE.HemisphereLight(0xfff3c8, 0x56745c, 2.3));
const sun = new THREE.DirectionalLight(0xffe0a0, 3.1);
sun.position.set(4, 9, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);

const palette = { wall:0xfff4d7, roof:0xeb7651, trim:0xf1a237, wood:0x99623e, lawn:0x82aa68, path:0xf0c97a, glass:0x93c7d0, leaf:0x537b50, pot:0xdd7652, dark:0x493727, cream:0xfff9e8, blue:0x6babc3, pink:0xea8790 };
const mat = (color, roughness=.8) => new THREE.MeshStandardMaterial({ color, roughness });
function mesh(geometry, material, position, parent=world) { const m = new THREE.Mesh(geometry, material); m.position.copy(position); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m; }
function box(x,y,z,color,pos, parent=world) { return mesh(new THREE.BoxGeometry(x,y,z),mat(color),pos,parent); }
function cylinder(rt,rb,h,color,pos,parent=world) { return mesh(new THREE.CylinderGeometry(rt,rb,h,20),mat(color),pos,parent); }
function sphere(r,color,pos,parent=world) { return mesh(new THREE.SphereGeometry(r,20,16),mat(color),pos,parent); }

// The full-screen room uses the same rounded, low-poly Three.js language as the garden house.
const interiorRenderer=new THREE.WebGLRenderer({canvas:interiorCanvas,antialias:true,alpha:true});
interiorRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
interiorRenderer.shadowMap.enabled=true;
interiorRenderer.shadowMap.type=THREE.PCFSoftShadowMap;
interiorRenderer.outputColorSpace=THREE.SRGBColorSpace;
const interiorScene=new THREE.Scene();
interiorScene.background=new THREE.Color(0xf3c95a);
const interiorCamera=new THREE.PerspectiveCamera(36,1,.1,60);
const interiorTarget=new THREE.Vector3(0,.9,-.25);
const interiorWorld=new THREE.Group(); interiorScene.add(interiorWorld);
interiorScene.add(new THREE.HemisphereLight(0xfff4cf,0x8a6a4c,2.5));
const interiorSun=new THREE.DirectionalLight(0xffdda0,3.2); interiorSun.position.set(4.5,8,6); interiorSun.castShadow=true; interiorSun.shadow.mapSize.set(1024,1024); interiorScene.add(interiorSun);
const interiorWarmLight=new THREE.PointLight(0xffc86b,1.45,12,2); interiorWarmLight.position.set(0,3.05,.2); interiorScene.add(interiorWarmLight);
const interiorMaterial=(color,roughness=.82)=>new THREE.MeshStandardMaterial({color,roughness});
function interiorMesh(geometry,color,position,parent=interiorWorld,roughness=.82){ const object=new THREE.Mesh(geometry,interiorMaterial(color,roughness)); object.position.copy(position); object.castShadow=true; object.receiveShadow=true; parent.add(object); return object; }
function interiorBox(x,y,z,color,position,parent=interiorWorld){ return interiorMesh(new THREE.BoxGeometry(x,y,z),color,position,parent); }
function interiorCylinder(rt,rb,h,color,position,parent=interiorWorld,segments=18){ return interiorMesh(new THREE.CylinderGeometry(rt,rb,h,segments),color,position,parent); }
function interiorSphere(radius,color,position,parent=interiorWorld){ return interiorMesh(new THREE.SphereGeometry(radius,18,14),color,position,parent); }

const interiorFloorGroup=new THREE.Group(); interiorWorld.add(interiorFloorGroup);
interiorCylinder(4.95,5.08,.36,0xb8663d,new THREE.Vector3(0,-.26,0),interiorFloorGroup,48);
interiorBox(7.08,.18,7.08,0xd99551,new THREE.Vector3(0,.02,0),interiorFloorGroup);
for(let index=0;index<8;index++) interiorBox(.035,.012,7.02,0xb86c42,new THREE.Vector3(-3.05+index*.87,.12,0),interiorFloorGroup);

const interiorRoomBackWall=new THREE.Group(); interiorWorld.add(interiorRoomBackWall);
const interiorRoomLeftWall=new THREE.Group(); interiorWorld.add(interiorRoomLeftWall);
const interiorRoomRightWall=new THREE.Group(); interiorWorld.add(interiorRoomRightWall);
interiorBox(.58,3.55,.18,palette.wall,new THREE.Vector3(-3.25,1.83,-3.45),interiorRoomBackWall);
interiorBox(5.42,3.55,.18,palette.wall,new THREE.Vector3(.78,1.83,-3.45),interiorRoomBackWall);
interiorBox(1.04,1.04,.18,palette.wall,new THREE.Vector3(-2.43,3.08,-3.45),interiorRoomBackWall);
interiorBox(.18,3.55,7.08,palette.wall,new THREE.Vector3(-3.46,1.83,0),interiorRoomLeftWall);
interiorBox(.18,3.55,7.08,palette.wall,new THREE.Vector3(3.46,1.83,0),interiorRoomRightWall);
interiorBox(7.08,.16,.20,palette.trim,new THREE.Vector3(0,.19,-3.31),interiorRoomBackWall);
interiorBox(.20,.16,7.08,palette.trim,new THREE.Vector3(-3.31,.19,0),interiorRoomLeftWall);
interiorBox(.20,.16,7.08,palette.trim,new THREE.Vector3(3.31,.19,0),interiorRoomRightWall);

// A real opening with a small garden beyond it, rather than a flat door picture.
interiorBox(1.04,.13,.24,palette.wood,new THREE.Vector3(-2.43,2.57,-3.31),interiorRoomBackWall);
interiorBox(.13,2.45,.24,palette.wood,new THREE.Vector3(-2.99,1.35,-3.31),interiorRoomBackWall);
interiorBox(.13,2.45,.24,palette.wood,new THREE.Vector3(-1.87,1.35,-3.31),interiorRoomBackWall);
interiorBox(1.0,1.22,.05,0xaed8dc,new THREE.Vector3(-2.43,1.91,-3.57),interiorRoomBackWall);
interiorBox(1.0,1.16,.05,0x9acb70,new THREE.Vector3(-2.43,.72,-3.57),interiorRoomBackWall);
interiorSphere(.34,palette.leaf,new THREE.Vector3(-2.68,.94,-3.48),interiorRoomBackWall);
interiorCylinder(.07,.09,.62,palette.wood,new THREE.Vector3(-2.68,.45,-3.48),interiorRoomBackWall);

// The entrance is a real moving door. Opening it reveals the same warm garden palette outside.
const interiorEntranceDoorPivot=new THREE.Group();
interiorEntranceDoorPivot.position.set(-2.99,.13,-3.20);
interiorWorld.add(interiorEntranceDoorPivot);
const interiorEntranceDoor=interiorBox(1.05,2.35,.14,palette.wood,new THREE.Vector3(.535,1.18,0),interiorEntranceDoorPivot);
interiorEntranceDoor.userData.isInteriorEntranceDoor=true;
interiorBox(.70,.06,.04,palette.trim,new THREE.Vector3(.535,1.62,.09),interiorEntranceDoorPivot);
interiorBox(.70,.06,.04,palette.trim,new THREE.Vector3(.535,.70,.09),interiorEntranceDoorPivot);
interiorSphere(.075,0xf5c84b,new THREE.Vector3(.86,1.18,.11),interiorEntranceDoorPivot);
let interiorEntranceDoorOpen=false;
let interiorEntranceDoorTarget=0;
const INTERIOR_ENTRANCE_OPEN_ANGLE=Math.PI*.48;

const interiorGardenDecorGroup=new THREE.Group();
interiorRoomBackWall.add(interiorGardenDecorGroup);
function clearThreeGroup(group){
  group.children.slice().forEach(child=>{
    child.traverse(object=>{ object.geometry?.dispose?.(); if(object.material){ const materials=Array.isArray(object.material)?object.material:[object.material]; materials.forEach(material=>material.dispose?.()); } });
    group.remove(child);
  });
}
function syncInteriorGardenPreview(){
  clearThreeGroup(interiorGardenDecorGroup);
  const visibleDecor=placed.children.filter(decoration=>decoration.userData.memoryText&&!decoration.userData.isRoofDecoration).slice(0,8);
  visibleDecor.forEach((decoration,index)=>{
    const group=new THREE.Group();
    const x=-2.43+THREE.MathUtils.clamp(decoration.position.x/5,-.42,.42);
    const z=-3.60-index*.035;
    group.position.set(x,.20,z);
    const type=decoration.userData.type;
    if(['tree','bigtree','topiary'].includes(type)){
      interiorCylinder(.025,.035,.25,palette.wood,new THREE.Vector3(0,.13,0),group,10);
      interiorSphere(type==='bigtree'?.16:.12,palette.leaf,new THREE.Vector3(0,.34,0),group);
    }else if(['flower','flowerbed','sunflower','leafplant'].includes(type)){
      interiorCylinder(.06,.08,.12,palette.pot,new THREE.Vector3(0,.06,0),group,10);
      interiorSphere(.08,type==='sunflower'?0xf5c74b:0xea8790,new THREE.Vector3(0,.18,0),group);
    }else{
      interiorBox(.12,.12,.12,0xe78a57,new THREE.Vector3(0,.07,0),group);
    }
    interiorGardenDecorGroup.add(group);
  });
}
function toggleInteriorEntranceDoor(){
  interiorEntranceDoorOpen=!interiorEntranceDoorOpen;
  interiorEntranceDoorTarget=interiorEntranceDoorOpen?INTERIOR_ENTRANCE_OPEN_ANGLE:0;
  if(interiorEntranceDoorOpen) syncInteriorGardenPreview();
  roomActionDescription.textContent=interiorEntranceDoorOpen?'열린 문 너머로 지금의 마당이 보여요.':'문을 열면 내가 꾸민 마당이 그대로 보여요.';
  interiorActivityButton.textContent=interiorEntranceDoorOpen?'현관문 닫기':'현관문 열기';
}

// Window and warm pendant repeat the exterior palette and toy proportions.
interiorBox(1.62,1.25,.07,palette.glass,new THREE.Vector3(.05,2.22,-3.31),interiorRoomBackWall);
interiorBox(.10,1.42,.10,palette.cream,new THREE.Vector3(.05,2.22,-3.25),interiorRoomBackWall);
interiorBox(1.82,.10,.10,palette.cream,new THREE.Vector3(.05,2.22,-3.25),interiorRoomBackWall);
interiorBox(1.88,.15,.14,palette.roof,new THREE.Vector3(.05,2.91,-3.24),interiorRoomBackWall);
const pendantGroup=new THREE.Group(); interiorWorld.add(pendantGroup);
interiorCylinder(.025,.025,1.05,palette.dark,new THREE.Vector3(0,3.25,0),pendantGroup,12);
const pendantShade=interiorMesh(new THREE.ConeGeometry(.42,.42,18,1,true),0xf1a543,new THREE.Vector3(0,2.62,0),pendantGroup); pendantShade.rotation.x=Math.PI;
interiorSphere(.13,0xfff0a2,new THREE.Vector3(0,2.52,0),pendantGroup);

// Fixed furniture: kitchen/dining, sleeping corner and a softly separated bathroom.
const kitchenGroup=new THREE.Group(); interiorWorld.add(kitchenGroup);
kitchenGroup.userData.roomId='kitchen';
interiorBox(.72,1.62,.68,0x79a9a5,new THREE.Vector3(-2.72,.91,-2.96),kitchenGroup);
interiorBox(1.62,.72,.68,0xe4a04e,new THREE.Vector3(-1.48,.46,-2.96),kitchenGroup);
interiorBox(1.76,.12,.78,palette.wood,new THREE.Vector3(-1.48,.87,-2.96),kitchenGroup);
const sinkBowl=interiorCylinder(.26,.26,.08,0x8bbabd,new THREE.Vector3(-1.78,.96,-2.96),kitchenGroup,20); sinkBowl.scale.z=.68;
for(const x of [-1.95,-1.05]) interiorSphere(.045,palette.wood,new THREE.Vector3(x,.53,-2.59),kitchenGroup);
kitchenGroup.position.x=3.25;
const diningGroup=new THREE.Group(); interiorWorld.add(diningGroup);
diningGroup.userData.roomId='kitchen';
const diningTop=interiorCylinder(.63,.68,.16,palette.wood,new THREE.Vector3(-1.48,.78,-1.35),diningGroup,24); diningTop.scale.z=.78;
interiorCylinder(.12,.16,.72,palette.wood,new THREE.Vector3(-1.48,.38,-1.35),diningGroup,16);
for(const x of [-2.18,-.78]){ interiorBox(.48,.14,.48,0xe98266,new THREE.Vector3(x,.47,-1.35),diningGroup); interiorCylinder(.055,.065,.44,palette.wood,new THREE.Vector3(x,.22,-1.35),diningGroup,12); }
diningGroup.position.x=3.25;

const bedGroup=new THREE.Group(); interiorWorld.add(bedGroup);
bedGroup.userData.roomId='bedroom';
interiorBox(1.82,.30,1.18,palette.wood,new THREE.Vector3(.83,.26,-2.67),bedGroup);
interiorBox(1.68,.24,1.07,palette.cream,new THREE.Vector3(.83,.50,-2.64),bedGroup);
interiorBox(1.03,.18,1.09,0xf0a07f,new THREE.Vector3(.53,.68,-2.63),bedGroup);
interiorBox(.56,.18,.43,0xfff9e8,new THREE.Vector3(1.31,.69,-2.91),bedGroup);
interiorBox(1.83,1.10,.16,palette.wood,new THREE.Vector3(.83,.70,-3.16),bedGroup);
bedGroup.position.set(-1.8,0,4.6);

const bathGroup=new THREE.Group(); interiorWorld.add(bathGroup);
bathGroup.userData.roomId='bathroom';
interiorBox(.12,1.72,2.05,0xf2c379,new THREE.Vector3(1.78,.88,-.42),bathGroup);
interiorBox(1.35,.48,.72,0x8fc1c1,new THREE.Vector3(2.60,.32,-1.12),bathGroup);
interiorBox(1.18,.22,.56,0xd9f0e8,new THREE.Vector3(2.60,.61,-1.12),bathGroup);
interiorBox(.62,.62,.52,palette.cream,new THREE.Vector3(2.72,.42,.33),bathGroup);
const basin=interiorCylinder(.28,.25,.12,0x91bdbd,new THREE.Vector3(2.72,.79,.33),bathGroup,20); basin.scale.z=.72;
interiorBox(.07,.44,.07,palette.wood,new THREE.Vector3(2.72,1.06,.22),bathGroup);
interiorSphere(.08,0xf3c94d,new THREE.Vector3(2.72,1.30,.22),bathGroup);
bathGroup.position.set(-4.75,0,-1.1);

// Low toy-like partitions preserve the square exterior footprint while keeping every room visible.
const interiorPartitionsGroup=new THREE.Group(); interiorWorld.add(interiorPartitionsGroup);
interiorBox(.14,1.18,3.15,0xf1c378,new THREE.Vector3(-.15,.62,1.22),interiorPartitionsGroup);
interiorBox(2.70,1.18,.14,0xf1c378,new THREE.Vector3(-1.72,.62,-.35),interiorPartitionsGroup);
interiorBox(3.15,1.18,.14,0xf1c378,new THREE.Vector3(1.48,.62,-.35),interiorPartitionsGroup);
interiorBox(.14,1.18,1.28,0xf1c378,new THREE.Vector3(-1.34,.62,-2.36),interiorPartitionsGroup);

const interiorRoomLockMeshes=[];
function interiorRoomLockPanel(roomId,width,depth,x,z){
  const material=new THREE.MeshStandardMaterial({color:0xb8aa91,roughness:1,transparent:true,opacity:.74});
  const panel=new THREE.Mesh(new THREE.BoxGeometry(width,.055,depth),material);
  panel.position.set(x,.16,z); panel.receiveShadow=true; panel.userData.roomId=roomId;
  interiorWorld.add(panel); interiorRoomLockMeshes.push(panel); return panel;
}
interiorRoomLockPanel('kitchen',3.02,2.48,1.52,-1.69);
interiorRoomLockPanel('bedroom',2.72,2.40,-1.64,1.08);
interiorRoomLockPanel('bathroom',1.58,2.48,-2.23,-1.69);
interiorRoomLockPanel('terrace',2.72,.54,-1.64,2.66);

const interior3DItemsGroup=new THREE.Group(); interiorWorld.add(interior3DItemsGroup);
const interiorRaycaster=new THREE.Raycaster();
const interiorPointer=new THREE.Vector2();
const interiorGroundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
const interiorGroundPoint=new THREE.Vector3();
let interiorYaw=.58,interiorPitch=.52,interiorDistance=11.8,interiorControl=null,interiorInsideMode=false;
function markInteriorItem(group,id){ group.userData.interiorItemId=id; group.traverse(child=>{ child.userData.interiorItemRoot=group; }); return group; }
function buildInterior3DItem(item){
  const group=new THREE.Group(); interior3DItemsGroup.add(group); const type=item.id;
  if(type==='welcome-mat'){ const welcome=interiorBox(.84,.06,.48,0xd58b52,new THREE.Vector3(0,.05,0),group); welcome.rotation.y=-.05; interiorBox(.54,.025,.07,0xffe5a9,new THREE.Vector3(0,.09,0),group); }
  if(type==='sun-rug'){ const rug=interiorCylinder(.72,.74,.07,0xefb74e,new THREE.Vector3(0,.05,0),group,28); rug.scale.z=.72; const center=interiorCylinder(.27,.27,.075,0xffefb5,new THREE.Vector3(0,.09,0),group,24); center.scale.z=.72; }
  if(type==='leaf-pot'){ interiorCylinder(.28,.36,.42,palette.pot,new THREE.Vector3(0,.22,0),group); for(const [x,z,s,c] of [[-.18,0,.32,0x5a9256],[.17,.02,.34,0x76a565],[0,-.12,.38,0x4e8350]]){ const leaf=interiorSphere(s,c,new THREE.Vector3(x,.66,z),group); leaf.scale.set(.65,1.15,.48); } }
  if(type==='mood-lamp'){ interiorCylinder(.20,.26,.09,palette.wood,new THREE.Vector3(0,.05,0),group); interiorCylinder(.035,.045,.74,palette.dark,new THREE.Vector3(0,.45,0),group,12); const shade=interiorMesh(new THREE.ConeGeometry(.33,.42,18,1,true),0xf2c44f,new THREE.Vector3(0,.90,0),group); shade.rotation.x=Math.PI; const glow=new THREE.PointLight(0xffcf73,.75,2.6,2); glow.position.set(0,.78,0); group.add(glow); }
  if(type==='soft-cushion'){ const cushion=interiorSphere(.48,0xee8c72,new THREE.Vector3(0,.30,0),group); cushion.scale.set(1,.58,.88); cushion.rotation.y=.18; }
  if(type==='book-stack'){ const colors=[0x6e9c91,0xdf795e,0xefbb50]; colors.forEach((color,index)=>{ const book=interiorBox(.72,.14,.46,color,new THREE.Vector3((index-1)*.025,.09+index*.15,0),group); book.rotation.y=(index-1)*.08; }); }
  if(type==='picnic-basket'){ interiorCylinder(.40,.34,.42,0xc9844c,new THREE.Vector3(0,.23,0),group,18); const handle=interiorMesh(new THREE.TorusGeometry(.31,.045,8,20,Math.PI),palette.wood,new THREE.Vector3(0,.47,0),group); handle.rotation.z=Math.PI; handle.rotation.y=Math.PI/2; interiorSphere(.10,0x8e648f,new THREE.Vector3(-.13,.48,.18),group); interiorSphere(.10,0xb8799c,new THREE.Vector3(.10,.48,.18),group); }
  if(type==='tea-set'){ interiorCylinder(.48,.50,.07,palette.wood,new THREE.Vector3(0,.05,0),group,24); for(const x of [-.18,.18]){ interiorCylinder(.14,.12,.22,0xfff4d7,new THREE.Vector3(x,.19,0),group,18); const handle=interiorMesh(new THREE.TorusGeometry(.10,.025,7,14),0xe6a24c,new THREE.Vector3(x+.12,.20,0),group); handle.rotation.x=Math.PI/2; } }
  if(type==='sleep-lamp'){ interiorCylinder(.20,.25,.10,palette.wood,new THREE.Vector3(0,.05,0),group); interiorCylinder(.035,.04,.43,palette.dark,new THREE.Vector3(0,.31,0),group,12); const shade=interiorMesh(new THREE.ConeGeometry(.28,.34,18,1,true),0xf0a780,new THREE.Vector3(0,.62,0),group); shade.rotation.x=Math.PI; const glow=new THREE.PointLight(0xffcc86,.55,2.1,2); glow.position.set(0,.54,0); group.add(glow); }
  if(type==='bath-basket'){ interiorBox(.68,.34,.48,0xc98752,new THREE.Vector3(0,.19,0),group); for(const [x,c] of [[-.20,0xfff4d7],[0,0xf0b58d],[.20,0x8fb6ad]]){ const towel=interiorCylinder(.105,.105,.42,c,new THREE.Vector3(x,.44,0),group,16); towel.rotation.z=Math.PI/2; } }
  if(type==='terrace-planter'){ interiorCylinder(.31,.40,.44,palette.pot,new THREE.Vector3(0,.23,0),group); for(const [x,z,c] of [[-.17,0,0x5d9456],[.16,.03,0x74a65f],[0,-.14,0x4e8250]]){ const leaf=interiorSphere(.28,c,new THREE.Vector3(x,.67,z),group); leaf.scale.set(.7,1.2,.5); } }
  return markInteriorItem(group,item.id);
}
function interiorLayoutToPosition(saved){ return {x:THREE.MathUtils.clamp((saved.x-50)/45*3,-3.05,3.05),z:THREE.MathUtils.clamp((saved.y-53)/35*2.65,-2.75,2.75)}; }
function interiorPositionToLayout(x,z){ return {x:THREE.MathUtils.clamp(50+x/3*45,4,96),y:THREE.MathUtils.clamp(53+z/2.65*35,16,90)}; }
function clearInterior3DItems(){ while(interior3DItemsGroup.children.length){ const child=interior3DItemsGroup.children[0]; interior3DItemsGroup.remove(child); child.traverse(object=>{ object.geometry?.dispose?.(); if(object.material){ const materials=Array.isArray(object.material)?object.material:[object.material]; materials.forEach(material=>material.dispose?.()); } }); } }
function syncInterior3DItems(){
  clearInterior3DItems();
  const days=interiorDayCount(); const layout=activeInteriorLayout();
  INTERIOR_ITEMS.filter(item=>days>=item.unlockDays&&layout[item.id]?.placed!==false).forEach(item=>{ const saved=layout[item.id]||item; const position=interiorLayoutToPosition(saved); const group=buildInterior3DItem(item); group.position.set(position.x,.12,position.z); });
  syncDoorwayInteriorPreview();
}
function setInteriorPointer(event){ const bounds=interiorCanvas.getBoundingClientRect(); interiorPointer.x=((event.clientX-bounds.left)/bounds.width)*2-1; interiorPointer.y=-((event.clientY-bounds.top)/bounds.height)*2+1; interiorRaycaster.setFromCamera(interiorPointer,interiorCamera); }
function interiorItemAtEvent(event){ setInteriorPointer(event); const hit=interiorRaycaster.intersectObjects(interior3DItemsGroup.children,true)[0]; return hit?.object?.userData?.interiorItemRoot||null; }
function interiorDoorAtEvent(event){ setInteriorPointer(event); return interiorRaycaster.intersectObject(interiorEntranceDoorPivot,true).length>0; }
function updateInteriorViewMode(){
  const nextInside=interiorDistance<=5.8;
  if(nextInside===interiorInsideMode) return;
  interiorInsideMode=nextInside;
  interiorView.classList.toggle('inside-mode',interiorInsideMode);
  interior3DHint.innerHTML=interiorInsideMode?'<span>↡</span> 집 안을 둘러보는 중 · 휠을 아래로 내려 전체 보기':'<span>↟</span> 휠을 위로 올려 집 안으로 · 빈 공간을 끌어 둘러보기';
}
function updateInteriorCamera(){
  updateInteriorViewMode();
  const insideProgress=THREE.MathUtils.clamp((7.4-interiorDistance)/5.15,0,1);
  const cameraPitch=THREE.MathUtils.lerp(interiorPitch,THREE.MathUtils.clamp(interiorPitch,.17,.34),insideProgress);
  const horizontal=Math.cos(cameraPitch)*interiorDistance;
  interiorCamera.position.set(Math.sin(interiorYaw)*horizontal,interiorTarget.y+Math.sin(cameraPitch)*interiorDistance,Math.cos(interiorYaw)*horizontal);
  interiorCamera.fov=THREE.MathUtils.lerp(36,52,insideProgress);
  interiorCamera.updateProjectionMatrix();
  interiorCamera.lookAt(interiorTarget);
}
function resizeInteriorRenderer(){ const width=interiorCanvas.clientWidth,height=interiorCanvas.clientHeight; if(!width||!height) return; interiorRenderer.setSize(width,height,false); interiorCamera.aspect=width/height; interiorCamera.updateProjectionMatrix(); }
function renderInterior3D(){
  resizeInteriorRenderer(); updateInteriorCamera();
  interiorEntranceDoorPivot.rotation.y+=(interiorEntranceDoorTarget-interiorEntranceDoorPivot.rotation.y)*.14;
  interiorRoomBackWall.visible=interiorCamera.position.z>-3.25;
  interiorRoomLeftWall.visible=interiorCamera.position.x>-3.25;
  interiorRoomRightWall.visible=interiorCamera.position.x<3.25;
  interiorRenderer.render(interiorScene,interiorCamera);
}

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

// front door and windows
const frontFacade=new THREE.Group(); world.add(frontFacade);
const warmInterior = new THREE.Group(); warmInterior.visible=false; world.add(warmInterior);
// The doorway preview is rebuilt from the user's actual entry/living-room layout.
box(1.03,.08,2.38,0x704838,new THREE.Vector3(0,.12,.67),warmInterior);
box(1.02,2.24,.09,0xc88362,new THREE.Vector3(0,1.17,-.52),warmInterior);
box(.38,.30,.035,0x8e5948,new THREE.Vector3(-.12,1.58,-.46),warmInterior);
box(.28,.20,.02,0x9fc8ba,new THREE.Vector3(-.12,1.58,-.43),warmInterior);
const warmInteriorItemsGroup=new THREE.Group(); warmInterior.add(warmInteriorItemsGroup);
function syncDoorwayInteriorPreview(){
  clearThreeGroup(warmInteriorItemsGroup);
  const days=interiorDayCount();
  const layout=activeInteriorLayout();
  INTERIOR_ITEMS.filter(item=>['entry','living'].includes(item.room)&&days>=item.unlockDays&&layout[item.id]?.placed!==false).forEach(item=>{
    const saved=layout[item.id]||item;
    const group=new THREE.Group();
    const sourceX=THREE.MathUtils.clamp((saved.x-50)/45*3,-3.05,3.05);
    const sourceZ=THREE.MathUtils.clamp((saved.y-53)/35*2.65,-2.75,2.75);
    group.position.set(sourceX*.12,.16,.58+sourceZ*.28);
    if(item.id==='sun-rug'){
      const rug=sphere(.22,0xefb74e,new THREE.Vector3(0,.01,0),group); rug.scale.set(1,.05,.72);
    }else if(item.id==='leaf-pot'){
      cylinder(.07,.09,.16,palette.pot,new THREE.Vector3(0,.08,0),group);
      sphere(.10,palette.leaf,new THREE.Vector3(0,.25,0),group);
    }else if(item.id==='mood-lamp'){
      cylinder(.012,.014,.28,palette.dark,new THREE.Vector3(0,.16,0),group,8);
      const shade=mesh(new THREE.ConeGeometry(.11,.14,12),mat(0xf2c44f),new THREE.Vector3(0,.34,0),group); shade.rotation.x=Math.PI;
    }else if(item.id==='book-stack'){
      box(.22,.06,.16,0x6e9c91,new THREE.Vector3(0,.04,0),group);
      box(.20,.05,.15,0xdf795e,new THREE.Vector3(0,.095,0),group);
    }else if(item.id==='welcome-mat'){
      box(.30,.025,.17,0xd58b52,new THREE.Vector3(0,.01,0),group);
    }else{
      sphere(.13,0xee8c72,new THREE.Vector3(0,.08,0),group);
    }
    warmInteriorItemsGroup.add(group);
  });
}
const doorPivot=new THREE.Group(); doorPivot.position.set(-.54,.08,2.04); world.add(doorPivot);
const doorMesh=box(1.08,1.92,.16,palette.wood,new THREE.Vector3(.54,.96,0),doorPivot); doorMesh.userData.isDoor=true;
box(.72,.055,.035,palette.trim,new THREE.Vector3(.54,1.38,.095),doorPivot); box(.72,.055,.035,palette.trim,new THREE.Vector3(.54,.56,.095),doorPivot);
mesh(new THREE.SphereGeometry(.085,12,10),mat(0xf6ca4d),new THREE.Vector3(.88,.97,.12),doorPivot);
let doorOpen=false, doorTargetRotation=0, interiorOpenTimer=null;
const OPEN_DOOR_ANGLE=-Math.PI*.47;
box(1.5,1.42,.08,palette.blue,new THREE.Vector3(-1.66,2.22,2.005),frontFacade);
box(1.5,1.42,.08,palette.blue,new THREE.Vector3(1.66,2.22,2.005),frontFacade);
for (const x of [-1.66,1.66]) { box(.12,1.62,.09,palette.cream,new THREE.Vector3(x,2.22,2.055),frontFacade); box(1.68,.12,.09,palette.cream,new THREE.Vector3(x,2.22,2.055),frontFacade); box(1.82,.15,.14,palette.roof,new THREE.Vector3(x,3.05,2.04),frontFacade); }
const windowPanels=frontFacade.children.filter(child=>child.material?.color?.getHex()===palette.blue);
const windowAwnings=frontFacade.children.filter(child=>child.material?.color?.getHex()===palette.roof);
function applyExteriorReward(){
  roof.material.color.setHex(palette.roof);
  doorMesh.material.color.setHex(palette.wood);
  windowPanels.forEach(panel=>panel.material.color.setHex(palette.blue));
  windowAwnings.forEach(awning=>awning.material.color.setHex(palette.roof));
  const rewardState=adminPreviewActive?adminPreviewRewards:milestoneRewards;
  const style=EXTERIOR_REWARD_OPTIONS.find(option=>option.id===rewardState.exteriorStyle);
  if(!style) return;
  roof.material.color.setHex(style.roof);
  doorMesh.material.color.setHex(style.door);
  windowPanels.forEach(panel=>panel.material.color.setHex(style.window));
  windowAwnings.forEach(awning=>awning.material.color.setHex(style.roof));
}
applyExteriorReward();

// A heart-shaped nameplate, rendered as part of the house facade.
const nameplateCanvas = document.createElement('canvas');
nameplateCanvas.width = 512; nameplateCanvas.height = 512;
const nameplateContext = nameplateCanvas.getContext('2d');
const nameplateTexture = new THREE.CanvasTexture(nameplateCanvas);
nameplateTexture.colorSpace = THREE.SRGBColorSpace;
nameplateTexture.minFilter = THREE.LinearMipmapLinearFilter;
nameplateTexture.magFilter = THREE.LinearFilter;
nameplateTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
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
const heartPlateScale=1.42/256;
const heartPlateX=value=>(value-128)*heartPlateScale;
const heartPlateY=value=>(128-value)*heartPlateScale;
const heartPlateShape=new THREE.Shape();
heartPlateShape.moveTo(heartPlateX(128),heartPlateY(231));
heartPlateShape.bezierCurveTo(heartPlateX(112),heartPlateY(216),heartPlateX(35),heartPlateY(165),heartPlateX(35),heartPlateY(92));
heartPlateShape.bezierCurveTo(heartPlateX(35),heartPlateY(52),heartPlateX(82),heartPlateY(31),heartPlateX(111),heartPlateY(56));
heartPlateShape.bezierCurveTo(heartPlateX(119),heartPlateY(63),heartPlateX(124),heartPlateY(71),heartPlateX(128),heartPlateY(80));
heartPlateShape.bezierCurveTo(heartPlateX(132),heartPlateY(71),heartPlateX(137),heartPlateY(63),heartPlateX(145),heartPlateY(56));
heartPlateShape.bezierCurveTo(heartPlateX(174),heartPlateY(31),heartPlateX(221),heartPlateY(52),heartPlateX(221),heartPlateY(92));
heartPlateShape.bezierCurveTo(heartPlateX(221),heartPlateY(165),heartPlateX(144),heartPlateY(216),heartPlateX(128),heartPlateY(231));
const nameplatePlate=mesh(new THREE.ExtrudeGeometry(heartPlateShape,{depth:.055,bevelEnabled:false,curveSegments:24}),mat(0xd97565),new THREE.Vector3(0,2.65,1.965));
nameplatePlate.castShadow=false;
const nameplate = mesh(new THREE.PlaneGeometry(1.42,1.42),new THREE.MeshBasicMaterial({map:nameplateTexture,transparent:true,alphaTest:.05,depthWrite:true,depthTest:true,side:THREE.FrontSide}),new THREE.Vector3(0,2.65,2.024));
nameplate.renderOrder = 3;
nameplate.visible = true;
// chimney
box(.72,1.45,.72,palette.wood,new THREE.Vector3(1.58,4.7,-.65)); box(.9,.16,.9,palette.cream,new THREE.Vector3(1.58,5.42,-.65));

const placed = new THREE.Group(); world.add(placed);
const roofGarland = new THREE.Group(); world.add(roofGarland);
houseNameText.textContent = `${houseName}네 집`;
const slots = [ [-2.65,.04,1.75], [2.3,.04,1.42], [-3.05,.04,-.2], [3.15,.04,.15], [-1.7,.04,3.2], [1.72,.04,3.28], [-3.75,.04,1.0], [3.8,.04,2.1] ];
const houseZone = { minX:-2.82, maxX:2.82, minZ:-2.82, maxZ:2.28 };
const TOP_LAWN_RADIUS = 5.32;
const DECOR_FOOTPRINTS={flower:.42,lamp:.38,book:.44,flag:.36,tree:.68,bigtree:.98,bench:.6,fountain:.55,birdhouse:.4,mailbox:.44,fence:.56,swing:.74,bicycle:.56,stone:.44,mushroom:.4,birdbath:.44,lantern:.34,leafplant:.48,watering:.44,flowerbed:.58,sunflower:.44,gnome:.38,basket:.4,hammock:.72,arch:.58,chime:.38,pumpkin:.5,cat:.42,dog:.44,stepping:.46,topiary:.48};
function decorFootprint(type){ return DECOR_FOOTPRINTS[type]??.5; }
function keepInsideTopLawn(x,z){
  const maxRadius=TOP_LAWN_RADIUS;
  const distance=Math.hypot(x,z);
  if(distance<=maxRadius) return {x,z};
  return {x:x/distance*maxRadius,z:z/distance*maxRadius};
}
function keepOutsideHouse(x,z,clearance=.28){
  const {x:safeX,z:safeZ}=keepInsideTopLawn(x,z);
  const safeHouse={minX:houseZone.minX-clearance,maxX:houseZone.maxX+clearance,minZ:houseZone.minZ-clearance,maxZ:houseZone.maxZ+clearance};
  if(safeX<=safeHouse.minX || safeX>=safeHouse.maxX || safeZ<=safeHouse.minZ || safeZ>=safeHouse.maxZ) return {x:safeX,z:safeZ};
  const edges=[
    {distance:safeX-safeHouse.minX,x:safeHouse.minX,z:safeZ},
    {distance:safeHouse.maxX-safeX,x:safeHouse.maxX,z:safeZ},
    {distance:safeZ-safeHouse.minZ,x:safeX,z:safeHouse.minZ},
    {distance:safeHouse.maxZ-safeZ,x:safeX,z:safeHouse.maxZ}
  ];
  const nearest=edges.reduce((closest,edge)=>edge.distance<closest.distance?edge:closest);
  return keepInsideTopLawn(nearest.x,nearest.z);
}
const DECORATION_GAP = .08;
function keepDecorationSeparate(x,z,excludedDecoration=null,type='flower'){
  const candidateRadius=decorFootprint(type);
  let position=keepOutsideHouse(x,z,candidateRadius+.08);
  for(let attempt=0;attempt<48;attempt++){
    const conflict=placed.children.find(decoration=>{
      if(decoration===excludedDecoration) return false;
      if(!decoration.userData.memoryText) return false;
      if(decoration.userData.isRoofDecoration) return false;
      return Math.hypot(decoration.position.x-position.x,decoration.position.z-position.z)<candidateRadius+decorFootprint(decoration.userData.type)+DECORATION_GAP;
    });
    if(!conflict) return position;
    const dx=position.x-conflict.position.x;
    const dz=position.z-conflict.position.z;
    const angle=(Math.abs(dx)+Math.abs(dz)<.01?(attempt+1)*2.399:Math.atan2(dz,dx)+attempt*.45);
    const openDistance=candidateRadius+decorFootprint(conflict.userData.type)+DECORATION_GAP;
    position=keepOutsideHouse(conflict.position.x+Math.cos(angle)*openDistance,conflict.position.z+Math.sin(angle)*openDistance,candidateRadius+.08);
  }
  return position;
}
function isDecorationPositionOpen(x,z,excludedDecoration,type){
  const radius=decorFootprint(type);
  if(Math.hypot(x,z)>TOP_LAWN_RADIUS) return false;
  const houseSafe=keepOutsideHouse(x,z,radius+.08);
  if(Math.hypot(houseSafe.x-x,houseSafe.z-z)>.001) return false;
  return !placed.children.some(decoration=>{
    if(decoration===excludedDecoration||!decoration.userData.memoryText||decoration.userData.isRoofDecoration) return false;
    const minimumDistance=radius+decorFootprint(decoration.userData.type)+DECORATION_GAP;
    return Math.hypot(decoration.position.x-x,decoration.position.z-z)<minimumDistance;
  });
}
function keepDragPosition(decoration,x,z){
  const type=decoration.userData.type;
  const target=keepInsideTopLawn(x,z);
  if(isDecorationPositionOpen(target.x,target.z,decoration,type)) return target;
  const start={x:decoration.position.x,z:decoration.position.z};
  if(!isDecorationPositionOpen(start.x,start.z,decoration,type)) return keepDecorationSeparate(target.x,target.z,decoration,type);
  let free=0;
  let blocked=1;
  for(let step=0;step<14;step++){
    const progress=(free+blocked)/2;
    const candidate={x:THREE.MathUtils.lerp(start.x,target.x,progress),z:THREE.MathUtils.lerp(start.z,target.z,progress)};
    if(isDecorationPositionOpen(candidate.x,candidate.z,decoration,type)) free=progress;
    else blocked=progress;
  }
  return {x:THREE.MathUtils.lerp(start.x,target.x,free),z:THREE.MathUtils.lerp(start.z,target.z,free)};
}
const flowerColors = [0xf0a4ac,0xf18b75,0xeb7795,0xaf83ce,0xffb943,0x8fcf9a];
function randomFlowerColor(){ return flowerColors[Math.floor(Math.random()*flowerColors.length)]; }
function nextFlowerColor(currentColor){ const choices=flowerColors.filter(color=>color!==currentColor); return choices[Math.floor(Math.random()*choices.length)]; }
function saveDecorationPosition(decoration){
  decorLayout[decoration.userData.decorationId]={...decorLayout[decoration.userData.decorationId],x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2))};
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
}
function changeFlowerColor(decoration){
  const nextColor=nextFlowerColor(decoration.userData.flowerColor);
  decoration.userData.flowerColor=nextColor;
  decoration.userData.petalMeshes.forEach(petal=>petal.material.color.setHex(nextColor));
  decorLayout[decoration.userData.decorationId]={...decorLayout[decoration.userData.decorationId],x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2)),flowerColor:nextColor};
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
}
function bloomFlowerbedBud(decoration,bud,animate=true){
  if(!bud||bud.bloomed) return;
  bud.bloomed=true;
  bud.roundBud.visible=false;
  bud.stem.scale.y=.56;
  bud.stem.position.y=.284;
  const tulip=new THREE.Group();
  const tulipColor=bud.color;
  const heartShape=new THREE.Shape();
  heartShape.moveTo(0,-.105);
  heartShape.bezierCurveTo(-.075,-.045,-.11,.01,-.1,.07);
  heartShape.bezierCurveTo(-.09,.12,-.035,.14,0,.08);
  heartShape.bezierCurveTo(.035,.14,.09,.12,.1,.07);
  heartShape.bezierCurveTo(.11,.01,.075,-.045,0,-.105);
  const heartMaterial=mat(tulipColor);
  heartMaterial.polygonOffset=true;
  heartMaterial.polygonOffsetFactor=-1;
  heartMaterial.polygonOffsetUnits=-1;
  const heart=mesh(new THREE.ExtrudeGeometry(heartShape,{depth:.055,bevelEnabled:true,bevelThickness:.014,bevelSize:.012,bevelSegments:2,curveSegments:14}),heartMaterial,new THREE.Vector3(0,0,-.028),tulip);
  heart.castShadow=true;
  heart.receiveShadow=true;
  bud.holder.add(tulip);
  if(animate){
    const start=performance.now();
    const grow=now=>{
      const progress=Math.min((now-start)/360,1);
      const size=.12+Math.sin(progress*Math.PI*.5)*.98;
      tulip.scale.setScalar(size);
      if(progress<1) requestAnimationFrame(grow); else tulip.scale.setScalar(1);
    };
    requestAnimationFrame(grow);
  }
  const saved=decorLayout[decoration.userData.decorationId]??{};
  const bloomedBuds=new Set(saved.bloomedBuds??[]);
  bloomedBuds.add(bud.index);
  decorLayout[decoration.userData.decorationId]={...saved,x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2)),bloomedBuds:[...bloomedBuds]};
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
}
const ROOF_LIGHT_BOUNDS={minX:-1.05,maxX:1.05,minZ:.86,maxZ:1.62};
const ROOF_LIGHT_GAP=.43;
const roofLightRaycaster=new THREE.Raycaster();
function keepRoofLightsSeparate(decoration,x,z){
  let position={x:THREE.MathUtils.clamp(x,ROOF_LIGHT_BOUNDS.minX,ROOF_LIGHT_BOUNDS.maxX),z:THREE.MathUtils.clamp(z,ROOF_LIGHT_BOUNDS.minZ,ROOF_LIGHT_BOUNDS.maxZ)};
  for(let attempt=0;attempt<24;attempt++){
    const conflict=placed.children.find(other=>other!==decoration&&other.userData.isRoofDecoration&&Math.hypot(other.position.x-position.x,other.position.z-position.z)<ROOF_LIGHT_GAP);
    if(!conflict) return position;
    const dx=position.x-conflict.position.x;
    const dz=position.z-conflict.position.z;
    const angle=Math.abs(dx)+Math.abs(dz)<.01?(attempt%2?1:-1)*Math.PI/2:Math.atan2(dz,dx)+attempt*.45;
    position={x:THREE.MathUtils.clamp(conflict.position.x+Math.cos(angle)*ROOF_LIGHT_GAP,ROOF_LIGHT_BOUNDS.minX,ROOF_LIGHT_BOUNDS.maxX),z:THREE.MathUtils.clamp(conflict.position.z+Math.sin(angle)*ROOF_LIGHT_GAP,ROOF_LIGHT_BOUNDS.minZ,ROOF_LIGHT_BOUNDS.maxZ)};
  }
  return position;
}
function setRoofLightPosition(decoration,x,z){
  const openPosition=keepRoofLightsSeparate(decoration,x,z);
  const {x:safeX,z:safeZ}=openPosition;
  world.updateMatrixWorld(true);
  const probe=world.localToWorld(new THREE.Vector3(safeX,8,safeZ));
  roofLightRaycaster.set(probe,new THREE.Vector3(0,-1,0));
  const roofHit=roofLightRaycaster.intersectObject(roof,false)[0];
  if(!roofHit) return;
  const roofPosition=placed.worldToLocal(roofHit.point.clone());
  const roofNormalWorld=roofHit.face.normal.clone().transformDirection(roof.matrixWorld).normalize();
  const roofNormal=placed.worldToLocal(roofHit.point.clone().add(roofNormalWorld)).sub(roofPosition).normalize();
  decoration.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),roofNormal);
  decoration.position.set(safeX,roofPosition.y+roofNormal.y*.015,safeZ);
  refreshRoofGarland();
}
function clearRoofGarland(){
  roofGarland.children.forEach(line=>line.traverse(node=>{
    node.geometry?.dispose();
    if(Array.isArray(node.material)) node.material.forEach(material=>material.dispose());
    else node.material?.dispose();
  }));
  roofGarland.clear();
}
function refreshRoofGarland(){
  clearRoofGarland();
  world.updateMatrixWorld(true);
  const roofLights=placed.children.filter(decoration=>decoration.userData.isRoofDecoration&&decoration.userData.garlandPoint).sort((a,b)=>a.position.x-b.position.x);
  for(let index=1;index<roofLights.length;index++){
    const start=roofGarland.worldToLocal(roofLights[index-1].localToWorld(roofLights[index-1].userData.garlandPoint.clone()));
    const end=roofGarland.worldToLocal(roofLights[index].localToWorld(roofLights[index].userData.garlandPoint.clone()));
    if(start.distanceTo(end)<.14) continue;
    const sagPoint=start.clone().lerp(end,.5);
    sagPoint.y-=.08+Math.min(.05,start.distanceTo(end)*.03);
    sagPoint.z+=.04;
    mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(start,sagPoint,end),22,.018,7,false),mat(0x534338),new THREE.Vector3(0,0,0),roofGarland);
  }
}
function setRoofLightState(decoration,isOn){
  decoration.userData.roofLightOn=isOn;
  decoration.userData.roofBulbs.forEach(({mesh:bulb})=>{
    bulb.material.color.setHex(isOn?0xfffff1:0xf0b63f);
    bulb.material.emissive.setHex(isOn?0xfffff1:0xf0b63f);
    bulb.material.emissiveIntensity=isOn ? 1.05 : .03;
  });
  decoration.userData.roofGlows.forEach(glow=>{ glow.intensity=isOn ? .38 : 0; });
}
function toggleRoofLight(decoration){
  setRoofLightState(decoration,!decoration.userData.roofLightOn);
  decorLayout[decoration.userData.decorationId]={...decorLayout[decoration.userData.decorationId],x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2)),roofLightOn:decoration.userData.roofLightOn};
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
  showCaptureNotice(decoration.userData.roofLightOn?'지붕 조명을 켰어요':'지붕 조명을 껐어요',decoration.userData.roofLightOn?' 전구가 따뜻하게 반짝입니다.':' 전구 불빛이 꺼졌습니다.');
}
function toggleSmallLamp(decoration){
  const isOn=!decoration.userData.lampOn;
  decoration.userData.lampOn=isOn;
  decoration.userData.lampBulb.material.color.setHex(isOn?0xffffe2:0xffed9b);
  decoration.userData.lampBulb.material.emissive.setHex(0xffd878);
  decoration.userData.lampBulb.material.emissiveIntensity=isOn ? .95 : .08;
  decoration.userData.lampGlow.intensity=isOn ? .75 : 0;
  showCaptureNotice(isOn?'작은 조명을 켰어요':'작은 조명을 껐어요',isOn?' 주변에 은은한 빛이 퍼집니다.':' 빛이 사그라들었습니다.');
}
function nudgeChime(decoration){
  if(decoration.userData.chimeAnimating) return;
  decoration.userData.chimeAnimating=true;
  const silver=decoration.userData.chimeSilver;
  if(!silver){ decoration.userData.chimeAnimating=false; return; }
  const start=performance.now();
  const move=now=>{ const progress=Math.min((now-start)/540,1); silver.rotation.z=-Math.sin(progress*Math.PI)*.16; if(progress<1) requestAnimationFrame(move); else { silver.rotation.z=0; decoration.userData.chimeAnimating=false; } };
  requestAnimationFrame(move);
}
function swingForwardBack(decoration){
  if(decoration.userData.swingAnimating) return;
  decoration.userData.swingAnimating=true;
  const pivot=decoration.userData.swingPivot;
  const start=performance.now();
  const move=now=>{ const progress=Math.min((now-start)/1050,1); pivot.rotation.x=Math.sin(progress*Math.PI*3)*.25*(1-progress*.55); if(progress<1) requestAnimationFrame(move); else { pivot.rotation.x=0; decoration.userData.swingAnimating=false; } };
  requestAnimationFrame(move);
}
function addDecoration(type,index,animate=false,memoryText='나를 위한 첫 장식',decorationId=`${type}-${index}`,flowerColor=null) {
  const isRoofDecoration=type==='rooflight';
  const [slotX,slotY,slotZ]=slots[index%slots.length];
  const savedPosition=decorLayout[decorationId];
  const roofLightNumber=placed.children.filter(decoration=>decoration.userData.isRoofDecoration).length;
  const roofLightX=[-1.02,-.51,0,.51,1.02][roofLightNumber%5];
  const roofLightZ=1.46-(Math.floor(roofLightNumber/5)%2)*.22;
  const [x,y,z]=isRoofDecoration?[savedPosition?.x??roofLightX,0,savedPosition?.z??roofLightZ]:[slotX,slotY,slotZ];
  const g = new THREE.Group(); const safePosition=keepOutsideHouse(savedPosition?.x??x,savedPosition?.z??z,decorFootprint(type)+.08); const openPosition=isRoofDecoration?{x,z}:keepDecorationSeparate(safePosition.x,safePosition.z,null,type); g.position.set(openPosition.x,y,openPosition.z); placed.add(g);
  g.userData.memoryText = memoryText;
  g.userData.type = type;
  g.userData.decorationId = decorationId;
  g.userData.isRoofDecoration = isRoofDecoration;
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
  hotspot.addEventListener('click', () => { if(g.userData.isRoofDecoration) toggleRoofLight(g); });
  if(type==='flower') { const petalColor=savedPosition?.flowerColor??flowerColor??randomFlowerColor(); g.userData.flowerColor=petalColor; g.userData.petalMeshes=[]; cylinder(.26,.34,.42,palette.pot,new THREE.Vector3(0,.21,0),g); for(let i=0;i<5;i++){ const a=i*Math.PI*2/5; g.userData.petalMeshes.push(sphere(.14,petalColor,new THREE.Vector3(Math.cos(a)*.18,.58,Math.sin(a)*.18),g)); } sphere(.12,0xf3c743,new THREE.Vector3(0,.58,0),g); }
  if(type==='lamp') { cylinder(.06,.09,.78,palette.dark,new THREE.Vector3(0,.39,0),g); const shade=mesh(new THREE.ConeGeometry(.3,.42,18,1,true),mat(0xf5c64d),new THREE.Vector3(0,.86,0),g); shade.rotation.x=Math.PI; const bulb=sphere(.11,0xffed9b,new THREE.Vector3(0,.78,0),g); bulb.material.emissive.setHex(0xffd878); bulb.material.emissiveIntensity=.08; const glow=new THREE.PointLight(0xffcd71,0,1.55,2); glow.position.set(0,.78,.12); g.add(glow); g.userData.lampBulb=bulb; g.userData.lampGlow=glow; g.userData.lampOn=false; }
  if(type==='book') { box(.55,.16,.38,0x74a7a0,new THREE.Vector3(0,.1,0),g); box(.48,.16,.36,0xf1b640,new THREE.Vector3(.03,.26,.01),g); box(.43,.16,.34,0xe47758,new THREE.Vector3(-.02,.42,-.01),g); }
  if(type==='flag') { cylinder(.045,.055,1.05,palette.wood,new THREE.Vector3(0,.53,0),g); const flag=mesh(new THREE.PlaneGeometry(.54,.34),mat(0xf08368),new THREE.Vector3(.3,.84,0),g); flag.rotation.y=Math.PI/18; }
  if(type==='tree') { cylinder(.12,.17,.78,palette.wood,new THREE.Vector3(0,.39,0),g); sphere(.42,palette.leaf,new THREE.Vector3(0,.92,0),g); sphere(.31,0x6b975b,new THREE.Vector3(.25,.78,.06),g); sphere(.29,0x6b975b,new THREE.Vector3(-.25,.82,.06),g); }
  if(type==='bigtree') { cylinder(.18,.25,1.38,palette.wood,new THREE.Vector3(0,.69,0),g); sphere(.72,0x4f824e,new THREE.Vector3(0,1.73,0),g); sphere(.56,0x649856,new THREE.Vector3(.42,1.52,.08),g); sphere(.54,0x5a8d51,new THREE.Vector3(-.42,1.55,.08),g); sphere(.48,0x76a964,new THREE.Vector3(0,2.13,.02),g); }
  if(type==='bench') { box(.82,.13,.25,0xa66b43,new THREE.Vector3(0,.49,0),g); box(.82,.12,.12,0xa66b43,new THREE.Vector3(0,.72,-.1),g); for(const x of [-.31,.31]) box(.10,.48,.10,palette.wood,new THREE.Vector3(x,.24,0),g); }
  if(type==='fountain') { cylinder(.38,.48,.14,0x8eb9c3,new THREE.Vector3(0,.07,0),g); cylinder(.17,.23,.27,0x79afbc,new THREE.Vector3(0,.25,0),g); sphere(.12,0xeaf7fa,new THREE.Vector3(0,.49,0),g); }
  if(type==='birdhouse') { cylinder(.05,.07,.75,palette.wood,new THREE.Vector3(0,.38,0),g); box(.36,.32,.28,0x79a8ba,new THREE.Vector3(0,.84,0),g); const roof=mesh(new THREE.ConeGeometry(.32,.22,4),mat(0xeb7651),new THREE.Vector3(0,1.11,0),g); roof.rotation.y=Math.PI/4; sphere(.05,palette.dark,new THREE.Vector3(0,.84,.15),g); }
  if(type==='mailbox') { box(.11,.74,.11,palette.wood,new THREE.Vector3(0,.37,0),g); const mailbox=mesh(new THREE.CylinderGeometry(.22,.22,.48,16,1,false,0,Math.PI),mat(0x5f9ab3),new THREE.Vector3(0,.75,0),g); mailbox.rotation.z=Math.PI/2; }
  if(type==='fence') { for(const x of [-.32,0,.32]) box(.08,.52,.08,palette.cream,new THREE.Vector3(x,.26,0),g); box(.8,.07,.07,palette.cream,new THREE.Vector3(0,.18,0),g); box(.8,.07,.07,palette.cream,new THREE.Vector3(0,.4,0),g); }
  if(type==='swing') { for(const x of [-.3,.3]) { const post=box(.06,.98,.06,palette.wood,new THREE.Vector3(x,.49,0),g); post.rotation.z=x<0?.18:-.18; } box(.72,.06,.06,palette.wood,new THREE.Vector3(0,.96,0),g); const swingPivot=new THREE.Group(); swingPivot.position.set(0,.97,0); g.add(swingPivot); for(const x of [-.13,.13]) cylinder(.012,.012,.60,0xe7d9bd,new THREE.Vector3(x,-.30,0),swingPivot); box(.38,.07,.18,0xe98759,new THREE.Vector3(0,-.63,0),swingPivot); g.userData.swingPivot=swingPivot; }
  if(type==='bicycle') {
    const rearLeft=new THREE.Vector3(-.23,.14,-.16);
    const rearRight=new THREE.Vector3(-.23,.14,.16);
    const frontWheel=new THREE.Vector3(.31,.18,0);
    const wheel=(position,radius)=>{
      mesh(new THREE.TorusGeometry(radius,.026,8,16),mat(0x556169),position,g);
      sphere(.028,0xf3c84c,position.clone().add(new THREE.Vector3(0,0,.026)),g);
    };
    wheel(rearLeft,.12); wheel(rearRight,.12); wheel(frontWheel,.17);
    box(.07,.06,.42,0xe56f52,new THREE.Vector3(-.23,.17,0),g);
    const tube=(from,to,width=.03)=>mesh(new THREE.TubeGeometry(new THREE.LineCurve3(from,to),5,width,7,false),mat(0xe56f52),new THREE.Vector3(0,0,0),g);
    const seatBase=new THREE.Vector3(-.13,.43,0);
    const handleBase=new THREE.Vector3(.25,.52,0);
    tube(new THREE.Vector3(-.23,.2,0),seatBase); tube(seatBase,handleBase); tube(handleBase,frontWheel);
    box(.26,.065,.2,0xf2b849,new THREE.Vector3(-.15,.49,0),g);
    box(.08,.055,.38,0x5d6870,new THREE.Vector3(.25,.59,0),g);
  }
  if(type==='stone') { for(const [x,z,s] of [[-.2,-.05,.22],[.14,.05,.28],[.02,.2,.18]]) { const rock=sphere(s,0xb9b2a1,new THREE.Vector3(x,.06,z),g); rock.scale.y=.35; } }
  if(type==='mushroom') { cylinder(.09,.12,.32,0xffe6c5,new THREE.Vector3(0,.16,0),g); const cap=sphere(.27,0xe77c5c,new THREE.Vector3(0,.37,0),g); cap.scale.y=.55; sphere(.035,0xfff6df,new THREE.Vector3(-.1,.44,.17),g); sphere(.03,0xfff6df,new THREE.Vector3(.12,.45,.14),g); }
  if(type==='birdbath') { cylinder(.06,.1,.48,0x879aa1,new THREE.Vector3(0,.24,0),g); const bath=mesh(new THREE.CylinderGeometry(.3,.21,.10,20),mat(0x9ebec4),new THREE.Vector3(0,.51,0),g); bath.scale.y=.55; sphere(.04,0x5f7f95,new THREE.Vector3(.08,.55,0),g); }
  if(type==='lantern') { box(.18,.42,.18,0x7b5a3f,new THREE.Vector3(0,.28,0),g); sphere(.09,0xffe797,new THREE.Vector3(0,.3,.1),g); const cap=mesh(new THREE.ConeGeometry(.17,.16,4),mat(palette.dark),new THREE.Vector3(0,.57,0),g); cap.rotation.y=Math.PI/4; }
  if(type==='leafplant') { cylinder(.22,.28,.35,palette.pot,new THREE.Vector3(0,.18,0),g); for(let i=0;i<5;i++){ const leaf=sphere(.18,0x5e9b68,new THREE.Vector3(Math.cos(i*1.26)*.17,.52,Math.sin(i*1.26)*.17),g); leaf.scale.set(.65,1.45,.65); } }
  if(type==='watering') { const can=cylinder(.18,.18,.32,0x79a9b3,new THREE.Vector3(0,.23,0),g); can.rotation.z=Math.PI/2; const spout=box(.38,.07,.07,0x79a9b3,new THREE.Vector3(.27,.28,0),g); spout.rotation.z=.22; const handle=mesh(new THREE.TorusGeometry(.14,.03,8,16,Math.PI),mat(0x79a9b3),new THREE.Vector3(-.08,.39,0),g); handle.rotation.y=Math.PI/2; }
  if(type==='flowerbed') {
    box(.72,.16,.48,0x8a5a3f,new THREE.Vector3(0,.08,0),g);
    const bloomedBuds=new Set(savedPosition?.bloomedBuds??[]);
    for(const [index,x] of [-.22,0,.22].entries()) {
      const stem=cylinder(.018,.025,.36,0x537b50,new THREE.Vector3(x,.28,0),g);
      const holder=new THREE.Group();
      holder.position.set(x,.49,0);
      g.add(holder);
      const roundBud=sphere(.11,index===1?0xf3bb43:0xed8194,new THREE.Vector3(0,0,0),holder);
      const bud={index,holder,roundBud,stem,color:index===1?0xf3bb43:0xed8194,bloomed:false};
      holder.userData.flowerbedBud=bud;
      if(bloomedBuds.has(index)) bloomFlowerbedBud(g,bud,false);
    }
  }
  if(type==='sunflower') { cylinder(.035,.05,.75,0x55763d,new THREE.Vector3(0,.38,0),g); for(let i=0;i<8;i++){ const a=i*Math.PI/4; const petal=sphere(.11,0xffd24d,new THREE.Vector3(Math.cos(a)*.16,.82,Math.sin(a)*.16),g); petal.scale.y=.55; } sphere(.11,0x70462f,new THREE.Vector3(0,.82,0),g); }
  if(type==='gnome') { mesh(new THREE.ConeGeometry(.22,.48,16),mat(0x4d8fb0),new THREE.Vector3(0,.24,0),g); sphere(.13,0xffd1ad,new THREE.Vector3(0,.54,0),g); mesh(new THREE.ConeGeometry(.17,.36,16),mat(0xe45f59),new THREE.Vector3(0,.78,0),g); }
  if(type==='basket') { cylinder(.28,.23,.28,0xc78a4f,new THREE.Vector3(0,.14,0),g); const handle=mesh(new THREE.TorusGeometry(.21,.03,8,16,Math.PI),mat(0x9b663d),new THREE.Vector3(0,.38,0),g); handle.rotation.y=Math.PI/2; sphere(.1,0xf07e5a,new THREE.Vector3(-.1,.3,.05),g); sphere(.09,0xf1b640,new THREE.Vector3(.1,.31,.05),g); }
  if(type==='hammock') { for(const x of [-.38,.38]) box(.06,.85,.06,palette.wood,new THREE.Vector3(x,.43,0),g); const bed=mesh(new THREE.PlaneGeometry(.68,.28),mat(0xe8967a),new THREE.Vector3(0,.45,0),g); bed.rotation.x=-Math.PI/2; }
  if(type==='arch') { for(const x of [-.28,.28]) box(.08,.74,.08,0xf5edd2,new THREE.Vector3(x,.37,0),g); const arch=mesh(new THREE.TorusGeometry(.28,.045,8,20,Math.PI),mat(0xf5edd2),new THREE.Vector3(0,.72,0),g); arch.rotation.y=Math.PI; sphere(.09,0xf08b94,new THREE.Vector3(-.24,.7,.03),g); sphere(.09,0xf08b94,new THREE.Vector3(.24,.7,.03),g); }
if(type==='chime') {
  box(.42,.05,.08,palette.wood,new THREE.Vector3(0,.8,0),g);
  const silverChimes=new THREE.Group();
  silverChimes.position.set(0,.8,0);
  g.add(silverChimes);
  for(const x of [-.14,0,.14]) cylinder(.02,.02,.44,0xd6e1df,new THREE.Vector3(x,-.24,0),silverChimes);
  cylinder(.025,.025,.84,palette.wood,new THREE.Vector3(0,.42,0),g);
  g.userData.chimeSilver=silverChimes;
}
  if(type==='pumpkin') { for(const x of [-.12,0,.12]) { const pumpkin=sphere(.2,0xf39b36,new THREE.Vector3(x,.19,0),g); pumpkin.scale.y=.8; } cylinder(.025,.03,.12,0x59804a,new THREE.Vector3(0,.42,0),g); }
  if(type==='cat') { sphere(.2,0xe69c62,new THREE.Vector3(-.05,.2,0),g); sphere(.15,0xe69c62,new THREE.Vector3(.19,.25,0),g); for(const x of [.12,.26]) { const ear=mesh(new THREE.ConeGeometry(.07,.13,3),mat(0xe69c62),new THREE.Vector3(x,.42,0),g); ear.rotation.z=.1; } const tail=mesh(new THREE.TorusGeometry(.16,.025,8,16,Math.PI),mat(0xe69c62),new THREE.Vector3(-.22,.29,0),g); tail.rotation.y=-Math.PI/2; }
  if(type==='dog') { sphere(.23,0xc78653,new THREE.Vector3(-.08,.23,0),g); sphere(.15,0xc78653,new THREE.Vector3(.22,.27,0),g); sphere(.07,0x795039,new THREE.Vector3(.28,.34,.11),g); const tail=mesh(new THREE.TorusGeometry(.14,.025,8,16,Math.PI),mat(0xc78653),new THREE.Vector3(-.28,.32,0),g); tail.rotation.y=Math.PI/2; }
  if(type==='stepping') { for(const [x,z] of [[-.23,-.12],[.08,0],[.25,.15]]) { const step=sphere(.19,0xd8c99a,new THREE.Vector3(x,.05,z),g); step.scale.y=.24; } }
  if(type==='topiary') { cylinder(.2,.27,.34,palette.pot,new THREE.Vector3(0,.17,0),g); cylinder(.06,.07,.36,palette.wood,new THREE.Vector3(0,.48,0),g); sphere(.28,0x54834f,new THREE.Vector3(0,.77,0),g); sphere(.18,0x6da05d,new THREE.Vector3(.16,.69,.03),g); }
  if(type==='rooflight') {
    const cablePoint=new THREE.Vector3(0,-.03,.035);
    const bulbPosition=new THREE.Vector3(0,-.115,.09);
    g.userData.garlandPoint=cablePoint;
    mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,.02,.008),cablePoint),5,.017,7,false),mat(0x534338),new THREE.Vector3(0,0,0),g);
    cylinder(.038,.05,.075,0x534338,new THREE.Vector3(0,-.072,.065),g);
    g.userData.roofBulbs=[];
    g.userData.roofGlows=[];
    const bulbMaterial=new THREE.MeshStandardMaterial({color:0xf0b63f,emissive:0xf0b63f,emissiveIntensity:.03,roughness:.22});
    const bulb=mesh(new THREE.SphereGeometry(.105,20,16),bulbMaterial,bulbPosition,g);
    bulb.scale.y=1.2;
    g.userData.roofBulbs.push({mesh:bulb});
    const glow=new THREE.PointLight(0xffc66a,0,.82,2);
    glow.position.copy(bulbPosition);
    g.add(glow);
    g.userData.roofGlows.push(glow);
    setRoofLightPosition(g,openPosition.x,openPosition.z);
    setRoofLightState(g,Boolean(savedPosition?.roofLightOn));
    refreshRoofGarland();
  }
  if(!savedPosition || savedPosition.x!==g.position.x || savedPosition.z!==g.position.z) saveDecorationPosition(g);
  if(animate) { const baseY=g.position.y; g.scale.setScalar(.01); const start=performance.now(); const grow=now=>{ const p=Math.min((now-start)/480,1); g.scale.setScalar(1+(1-p)*.15); g.position.y=baseY+Math.sin(p*Math.PI)*.22; if(p<1) requestAnimationFrame(grow); else g.position.y=baseY; }; requestAnimationFrame(grow); }
}
function addStoredDecorations(){
  memories.forEach((m,i)=>addDecoration(m.decor,i,false,m.text,`memory-${m.date||i}`,m.flowerColor));
  if(milestoneRewards.rareItem){
    const reward=RARE_REWARD_OPTIONS.find(option=>option.id===milestoneRewards.rareItem);
    addDecoration(milestoneRewards.rareItem,memories.length+7,false,`7일 보상 · ${reward?.label||'특별한 장식'}`,'milestone-7');
  }
}
addStoredDecorations();
function settleGroundDecorations(){
  for(let pass=0;pass<5;pass++){
    let moved=false;
    placed.children.filter(decoration=>decoration.userData.memoryText&&!decoration.userData.isRoofDecoration).forEach(decoration=>{
      const safePosition=keepOutsideHouse(decoration.position.x,decoration.position.z,decorFootprint(decoration.userData.type)+.08);
      const openPosition=keepDecorationSeparate(safePosition.x,safePosition.z,decoration,decoration.userData.type);
      if(Math.hypot(decoration.position.x-openPosition.x,decoration.position.z-openPosition.z)>.01){
        decoration.position.set(openPosition.x,decoration.userData.baseY,openPosition.z);
        saveDecorationPosition(decoration);
        moved=true;
      }
    });
    if(!moved) break;
  }
}
settleGroundDecorations();

function clearPlacedDecorations(){
  placed.children.slice().forEach(decoration=>{
    decoration.userData.hotspot?.remove();
    decoration.traverse(node=>{
      node.geometry?.dispose();
      if(Array.isArray(node.material)) node.material.forEach(material=>material.dispose());
      else node.material?.dispose();
    });
    placed.remove(decoration);
  });
  clearRoofGarland();
}
function rebuildDecorations(){
  clearPlacedDecorations();
  addStoredDecorations();
  settleGroundDecorations();
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0,1,0),-.04);
const dragPoint = new THREE.Vector3();
const decorationDragOffset = new THREE.Vector2();
let dragging=false, draggingDecoration=null, clickedFlowerbedBud=null, dragStartX=0, dragStartY=0, decorationMoved=false, doorPressed=false, doorStartX=0, doorStartY=0, lastX=0, lastY=0, desiredRotation=sharedRotation, desiredCameraHeight=sharedCameraHeight, userHasDragged=isSharedHome;
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
function getFlowerbedBudAtEvent(event){
  const rect=canvas.getBoundingClientRect();
  pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(placed.children,true)[0];
  if(!hit) return null;
  let target=hit.object;
  while(target){
    if(target.userData.flowerbedBud) return target.userData.flowerbedBud;
    target=target.parent;
  }
  return null;
}
function getDoorAtEvent(event){
  const rect=canvas.getBoundingClientRect();
  pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  return raycaster.intersectObject(doorPivot,true).length>0;
}
function toggleDoor(){
  if(!isInteriorUnlocked()){
    const days=recordedDayCount();
    showCaptureNotice('3일의 기록을 모으면 문이 열려요',`서로 다른 날에 ${Math.max(INTERIOR_UNLOCK_DAYS-days,0)}번 더 기록해 주세요.`);
    updateDoorMissionUI();
    return;
  }
  doorOpen=!doorOpen;
  doorTargetRotation=doorOpen?OPEN_DOOR_ANGLE:0;
  if(doorOpen) syncDoorwayInteriorPreview();
  warmInterior.visible=doorOpen;
  clearTimeout(interiorOpenTimer);
  if(doorOpen) interiorOpenTimer=setTimeout(openInterior,850);
}
function getGroundPointAtEvent(event){
  const rect=canvas.getBoundingClientRect();
  pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  if(!raycaster.ray.intersectPlane(dragPlane,dragPoint)) return null;
  return placed.worldToLocal(dragPoint.clone());
}
function moveDecoration(event,decoration){
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y = -((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  if(decoration.userData.isRoofDecoration){
    const roofHit=raycaster.intersectObject(roof,false)[0];
    if(!roofHit) return;
    const roofPosition=placed.worldToLocal(roofHit.point.clone());
    setRoofLightPosition(decoration,roofPosition.x,roofPosition.z);
    return;
  }
  if(!raycaster.ray.intersectPlane(dragPlane,dragPoint)) return;
  const localPoint=placed.worldToLocal(dragPoint.clone());
  const openPosition=keepDragPosition(decoration,localPoint.x+decorationDragOffset.x,localPoint.z+decorationDragOffset.y);
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
canvas.addEventListener('pointerdown',e=>{ if(getDoorAtEvent(e)){ doorPressed=true; doorStartX=e.clientX; doorStartY=e.clientY; canvas.setPointerCapture(e.pointerId); return; } const decoration=getDecorationAtEvent(e); if(decoration&&isSharedHome){ showCaptureNotice('공유받은 집이에요','장식은 원래 모습 그대로 보기 전용으로 열려 있어요.'); return; } dragging=true; lastX=e.clientX; lastY=e.clientY; desiredRotation=world.rotation.y; canvas.setPointerCapture(e.pointerId); if(decoration){ draggingDecoration=decoration; clickedFlowerbedBud=decoration.userData.type==='flowerbed'?getFlowerbedBudAtEvent(e):null; const groundPoint=decoration.userData.isRoofDecoration?null:getGroundPointAtEvent(e); decorationDragOffset.set(groundPoint?decoration.position.x-groundPoint.x:0,groundPoint?decoration.position.z-groundPoint.z:0); dragStartX=e.clientX; dragStartY=e.clientY; decorationMoved=false; hideDecorTooltip(); canvas.style.cursor='grabbing'; return; } });
canvas.addEventListener('pointermove',e=>{ if(doorPressed) return; if(!dragging) return checkDecorHover(e); if(draggingDecoration){ if(Math.hypot(e.clientX-dragStartX,e.clientY-dragStartY)>6){ decorationMoved=true; moveDecoration(e,draggingDecoration); } return; } desiredRotation=THREE.MathUtils.clamp(desiredRotation+(e.clientX-lastX)*.012,-Math.PI/2,Math.PI*.75); desiredCameraHeight=THREE.MathUtils.clamp(desiredCameraHeight+(lastY-e.clientY)*.012,5.45,7.45); lastX=e.clientX; lastY=e.clientY; userHasDragged=true; });
canvas.addEventListener('mousemove',e=>{ if(!dragging&&!doorPressed) checkDecorHover(e); });
canvas.addEventListener('pointerup',e=>{ if(doorPressed){ if(Math.hypot(e.clientX-doorStartX,e.clientY-doorStartY)<8) toggleDoor(); doorPressed=false; checkDecorHover(e); return; } if(draggingDecoration){ const decoration=draggingDecoration; if(decorationMoved) saveDecorationPosition(decoration); else if(decoration.userData.type==='flower') changeFlowerColor(decoration); else if(decoration.userData.type==='flowerbed') bloomFlowerbedBud(decoration,clickedFlowerbedBud); else if(decoration.userData.isRoofDecoration) toggleRoofLight(decoration); else if(decoration.userData.type==='lamp') toggleSmallLamp(decoration); else if(decoration.userData.type==='chime') nudgeChime(decoration); else if(decoration.userData.type==='swing') swingForwardBack(decoration); draggingDecoration=null; clickedFlowerbedBud=null; decorationDragOffset.set(0,0); } dragging=false; checkDecorHover(e); });
canvas.addEventListener('pointercancel',()=>{ doorPressed=false; if(draggingDecoration&&decorationMoved) saveDecorationPosition(draggingDecoration); draggingDecoration=null; clickedFlowerbedBud=null; decorationDragOffset.set(0,0); dragging=false; hideDecorTooltip(); });
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
let sceneHasRendered=false;
function frame(time){ resize(); if(!dragging&&!userHasDragged) desiredRotation=.44+Math.sin(time*.00022)*.08; world.rotation.y += (desiredRotation-world.rotation.y)*.055; camera.position.y+=(desiredCameraHeight-camera.position.y)*.08; doorPivot.rotation.y += (doorTargetRotation-doorPivot.rotation.y)*.14; camera.lookAt(target); updateDecorHotspots(); updateHouseName(); renderer.render(scene,camera); if(interiorView.classList.contains('open')) renderInterior3D(); if(!sceneHasRendered){ sceneHasRendered=true; sceneLoader?.classList.add('ready'); } requestAnimationFrame(frame); }
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
function shareBaseUrl(){
  return (location.hostname==='127.0.0.1'||location.hostname==='localhost')
    ? 'https://soo7894.github.io/podoal-home-2026-08-13/'
    : `${location.origin}${location.pathname}`;
}
function readCachedShareLink(signature){
  try {
    const cached=JSON.parse(localStorage.getItem(SHARE_LINK_CACHE_KEY)||'null');
    return cached?.signature===signature&&typeof cached.url==='string'?cached.url:'';
  } catch { return ''; }
}
function cacheShareLink(signature,url){
  try { localStorage.setItem(SHARE_LINK_CACHE_KEY,JSON.stringify({signature,url})); } catch {}
}
async function currentSharedHomeUrl(){
  const snapshot=packSharedHome();
  const signature=JSON.stringify(snapshot);
  const cached=readCachedShareLink(signature);
  if(cached) return cached;
  const response=await fetch(SHARE_ENDPOINT,{
    method:'POST',
    headers:{apikey:SHARE_PUBLISHABLE_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({state:snapshot}),
  });
  const payload=await response.json().catch(()=>null);
  if(!response.ok||typeof payload?.id!=='string') throw new Error('share-link-failed');
  const url=`${shareBaseUrl()}${SHARE_ID_PREFIX}${payload.id}`;
  cacheShareLink(signature,url);
  return url;
}
async function shareHomeLink(){
  showCaptureNotice('공유 링크를 만들고 있어요.','잠시만 기다려 주세요.');
  try {
    const url=await currentSharedHomeUrl();
    if(navigator.share){
      try {
        await navigator.share({title:'나의 오늘의 집',text:'오늘의 잘한 일로 꾸민 나의 작은 집이에요.',url});
        showCaptureNotice('집 링크를 공유했어요!','친구가 같은 배치와 각도로 집을 볼 수 있어요.');
        return;
      } catch(error) { if(error?.name==='AbortError') return; }
    }
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(url);
      showCaptureNotice('집 링크를 복사했어요!','친구에게 붙여넣어 보내 보세요.');
      return;
    }
    window.prompt('아래 링크를 복사해 친구에게 보내세요.',url);
  } catch(error) {
    showCaptureNotice('공유 링크를 만들지 못했어요.','인터넷 연결을 확인한 뒤 다시 눌러 주세요.');
  }
}
openHomeCaptureButton.addEventListener('click',openCapturePreview);
shareHomeLinkButton.addEventListener('click',shareHomeLink);
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

function memoryDayKey(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function recordedDayCount(){ return new Set(memories.map(memory=>memoryDayKey(memory.date)).filter(Boolean)).size; }
function monthlyRecordedDayCount(date=new Date()){
  const prefix=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-`;
  return new Set(memories.map(memory=>memoryDayKey(memory.date)).filter(day=>day.startsWith(prefix))).size;
}
function milestoneRewardClaimed(action){
  const rewardState=adminPreviewActive?adminPreviewRewards:milestoneRewards;
  if(action==='rare') return Boolean(rewardState.rareItem);
  if(action==='exterior') return Boolean(rewardState.exteriorStyle);
  return false;
}
function renderRewardJourney(){
  const days=adminPreviewActive?REWARD_MILESTONES.at(-1).days:recordedDayCount();
  const next=REWARD_MILESTONES.find(milestone=>days<milestone.days||(milestone.action&&!milestoneRewardClaimed(milestone.action)));
  rewardTotalDays.textContent=adminPreviewActive?'관리자 · 전체 공개':`누적 ${days}일`;
  rewardMilestones.innerHTML=REWARD_MILESTONES.map(milestone=>{
    const reached=days>=milestone.days;
    const claimed=milestone.action?milestoneRewardClaimed(milestone.action):reached;
    const current=next?.days===milestone.days;
    const classes=['reward-milestone',reached&&claimed?'completed':'locked',current?'current':'',milestone.longGoal?'long-goal':''].filter(Boolean).join(' ');
    let footer=`<span class="reward-status">${reached?'✓ 달성 완료':`${Math.min(days,milestone.days)} / ${milestone.days}일`}</span>`;
    if(reached&&milestone.action&&!claimed) footer=`<button type="button" data-open-reward="${milestone.action}">선물 고르기 →</button>`;
    if(claimed&&milestone.action) footer=adminPreviewActive?`<button type="button" data-open-reward="${milestone.action}">다른 선택 체험 →</button>`:'<span class="reward-status">✓ 선택 완료</span>';
    return `<article class="${classes}"><span class="reward-day">${milestone.days}일${reached?'<i>✓</i>':''}</span><h4>${milestone.title}</h4><p>${milestone.description}</p>${footer}</article>`;
  }).join('');
}
function saveMilestoneRewards(){ localStorage.setItem(MILESTONE_REWARDS_KEY,JSON.stringify(milestoneRewards)); }
function hexColor(value){ return `#${value.toString(16).padStart(6,'0')}`; }
function openRewardModal(action){
  if(isSharedHome){ showCaptureNotice('공유받은 집이에요','보상은 집의 원래 주인만 선택할 수 있어요.'); return; }
  const requiredDays=action==='rare'?7:14;
  if(!adminPreviewActive&&recordedDayCount()<requiredDays) return;
  currentRewardAction=action;
  if(action==='rare'){
    rewardModalTitle.innerHTML='7일의 잘한 나에게<br /><em>희귀 아이템 선물</em>';
    rewardModalDescription.textContent='마음에 드는 장식 하나를 골라 집에 놓아보세요. 한 번 선택하면 이 집의 소중한 기념품이 됩니다.';
    rewardChoiceList.innerHTML=RARE_REWARD_OPTIONS.map(option=>`<button class="reward-choice" type="button" data-reward-choice="${option.id}"><img src="${decorThumbnail(option.id)}" alt="${option.label}" /><b>${option.label}</b><small>${option.description}</small></button>`).join('');
  } else {
    rewardModalTitle.innerHTML='14일의 잘한 나에게<br /><em>외관 변경 선물</em>';
    rewardModalDescription.textContent='지붕·창문·현관이 함께 어울리는 외관 색감을 골라주세요.';
    rewardChoiceList.innerHTML=EXTERIOR_REWARD_OPTIONS.map(option=>`<button class="reward-choice" type="button" data-reward-choice="${option.id}"><span class="exterior-swatch" style="--swatch-roof:${hexColor(option.roof)};--swatch-door:${hexColor(option.door)}"><i></i></span><b>${option.label}</b><small>${option.description}</small></button>`).join('');
  }
  rewardBackdrop.classList.add('open');
  rewardBackdrop.setAttribute('aria-hidden','false');
}
function closeRewardModal(){
  rewardBackdrop.classList.remove('open');
  rewardBackdrop.setAttribute('aria-hidden','true');
  currentRewardAction=null;
}
function chooseMilestoneReward(choice){
  if(adminPreviewActive&&currentRewardAction==='rare'){
    const reward=RARE_REWARD_OPTIONS.find(option=>option.id===choice);
    if(!reward) return;
    adminPreviewRewards.rareItem=choice;
    rebuildDecorations();
    addDecoration(choice,memories.length+12,true,`관리자 체험 · ${reward.label}`,'admin-preview-rare');
    settleGroundDecorations();
    closeRewardModal();
    renderRewardJourney();
    showCaptureNotice(`${reward.label} 체험 중`,`관리자 미리보기 장식이며 실제 보상에는 저장되지 않아요.`);
    return;
  }
  if(adminPreviewActive&&currentRewardAction==='exterior'){
    const style=EXTERIOR_REWARD_OPTIONS.find(option=>option.id===choice);
    if(!style) return;
    adminPreviewRewards.exteriorStyle=choice;
    applyExteriorReward();
    closeRewardModal();
    renderRewardJourney();
    showCaptureNotice(`${style.label} 체험 중`,'관리자 미리보기 외관이며 실제 선택에는 저장되지 않아요.');
    return;
  }
  if(currentRewardAction==='rare'&&!milestoneRewards.rareItem){
    const reward=RARE_REWARD_OPTIONS.find(option=>option.id===choice);
    if(!reward) return;
    milestoneRewards.rareItem=choice;
    saveMilestoneRewards();
    addDecoration(choice,memories.length+7,true,`7일 보상 · ${reward.label}`,'milestone-7');
    settleGroundDecorations();
    closeRewardModal();
    renderRewardJourney();
    showCaptureNotice(`${reward.label}이 도착했어요!`,'7일의 잘한 내가 만든 특별한 장식을 집에 놓았어요.');
    return;
  }
  if(currentRewardAction==='exterior'&&!milestoneRewards.exteriorStyle){
    const style=EXTERIOR_REWARD_OPTIONS.find(option=>option.id===choice);
    if(!style) return;
    milestoneRewards.exteriorStyle=choice;
    saveMilestoneRewards();
    applyExteriorReward();
    closeRewardModal();
    renderRewardJourney();
    showCaptureNotice(`${style.label}으로 바뀌었어요!`,'14일 동안 쌓아온 잘한 일이 집의 새로운 분위기가 되었어요.');
  }
}
function interiorDayCount(){ return adminPreviewActive?Math.max(...INTERIOR_ITEMS.map(item=>item.unlockDays),...INTERIOR_ROOMS.map(room=>room.unlockDays),INTERIOR_UNLOCK_DAYS):recordedDayCount(); }
function activeInteriorLayout(){ return adminPreviewActive?adminInteriorLayout:interiorLayout; }
function isInteriorUnlocked(){ return adminPreviewActive||recordedDayCount()>=INTERIOR_UNLOCK_DAYS; }
function interiorRoomById(roomId){ return INTERIOR_ROOMS.find(room=>room.id===roomId)||INTERIOR_ROOMS[0]; }
function isInteriorRoomUnlocked(room){ return interiorDayCount()>=room.unlockDays; }
function updateInteriorRoomVisibility(){
  const days=interiorDayCount();
  [kitchenGroup,diningGroup,bedGroup,bathGroup].forEach(group=>{ const room=interiorRoomById(group.userData.roomId); group.visible=days>=room.unlockDays; });
  interiorRoomLockMeshes.forEach(panel=>{ panel.visible=days<interiorRoomById(panel.userData.roomId).unlockDays; });
}
function renderInteriorRoomMap(){
  const days=interiorDayCount();
  interiorRoomMap.innerHTML=INTERIOR_ROOMS.map(room=>{
    const unlocked=days>=room.unlockDays;
    return `<button type="button" class="interior-room-tab${room.id===activeInteriorRoomId?' active':''}${unlocked?' unlocked':' locked'}" data-interior-room="${room.id}" aria-pressed="${room.id===activeInteriorRoomId}" ${unlocked?'':`aria-label="${room.label}, 서로 다른 날 ${room.unlockDays}번 기록 후 공개"`}><span aria-hidden="true">${unlocked?room.icon:'🔒'}</span><b>${unlocked?room.label:'???'}</b><small>${unlocked?'OPEN':`${room.unlockDays}일`}</small></button>`;
  }).join('');
}
function updateInteriorRoomPanel(){
  const room=interiorRoomById(activeInteriorRoomId);
  roomActionIcon.textContent=room.icon;
  roomActionTitle.textContent=room.label;
  roomActionDescription.textContent=room.description;
  interiorActivityButton.textContent=room.action;
  if(room.id==='entry'){
    roomActionDescription.textContent=interiorEntranceDoorOpen?'열린 문 너머로 지금의 마당이 보여요.':room.description;
    interiorActivityButton.textContent=interiorEntranceDoorOpen?'현관문 닫기':room.action;
  }
  interiorRoomAction.dataset.room=room.id;
  interiorInventoryTitle.textContent=`${room.label} 아이템`;
  interiorInventoryHelp.textContent=`${room.label}에서 사용할 아이템을 골라, 표시된 공간 안에 놓아보세요.`;
  const next=INTERIOR_ROOMS.find(candidate=>!isInteriorRoomUnlocked(candidate));
  futureRoomCard.hidden=!next;
  if(next){
    futureRoomTitle.textContent=`${next.label} · 아직 비공개`;
    futureRoomDescription.textContent=`서로 다른 날 ${next.unlockDays}번 기록하면 ${next.icon} ${next.action} 활동과 아이템이 열려요.`;
  }
  const openCount=INTERIOR_ROOMS.filter(isInteriorRoomUnlocked).length;
  interiorProgressCopy.textContent=adminPreviewActive?'관리자 · 모든 방 공개':`${openCount}/${INTERIOR_ROOMS.length} 공간 공개`;
  updateInteriorRoomVisibility();
}
function selectInteriorRoom(roomId,{focus=true}={}){
  const room=interiorRoomById(roomId);
  if(!isInteriorRoomUnlocked(room)){
    showCaptureNotice(`${room.label}은 아직 비공개예요`,`서로 다른 날에 ${room.unlockDays}번 기록하면 새로운 공간과 활동이 열려요.`);
    return;
  }
  activeInteriorRoomId=room.id;
  if(focus){ interiorTarget.set(...room.target); interiorDistance=interiorInsideMode?4.4:9.7; }
  renderInteriorRoomMap();
  updateInteriorRoomPanel();
  renderInteriorInventory();
}
function runInteriorActivity(){
  const room=interiorRoomById(activeInteriorRoomId);
  if(room.id==='entry'){
    toggleInteriorEntranceDoor();
    return;
  }
  const messages={
    living:['포근한 소파에 앉아 오늘 적어둔 잘한 일을 천천히 돌아봤어요.'],
    entry:['오늘의 마음을 현관에 살며시 내려두고 따뜻한 집으로 들어왔어요.'],
    kitchen:['따뜻한 채소 수프를 완성했어요.','말랑한 포도 팬케이크를 만들었어요.','향긋한 허브 차를 우려냈어요.'],
    bedroom:['조명을 낮추고 오늘의 나에게 “수고했어”라고 말해줬어요.'],
    bathroom:['따뜻한 물로 씻으며 오늘의 피로를 다정하게 돌봤어요.'],
    terrace:['테라스 화분에 물을 주었어요. 새잎이 조금 더 반짝여요.']
  };
  const choices=messages[room.id]||['집 안에서 따뜻한 시간을 보냈어요.'];
  const message=choices[Math.floor(Math.random()*choices.length)];
  showCaptureNotice(`${room.icon} ${room.action} 완료`,message);
}
function updateDoorMissionUI(){
  const days=recordedDayCount();
  const progress=Math.min(days,INTERIOR_UNLOCK_DAYS);
  const unlocked=isInteriorUnlocked();
  doorMissionBadge.classList.toggle('unlocked',unlocked);
  doorMissionBadge.querySelector('.door-mission-icon').textContent=unlocked?'🔑':'🔒';
  doorMissionCopy.textContent=adminPreviewActive?'관리자 체험 중':unlocked?'문을 눌러 실내 꾸미기':'서로 다른 날 3번';
  doorMissionCount.textContent=adminPreviewActive?'PREVIEW':unlocked?'OPEN':`${progress} / ${INTERIOR_UNLOCK_DAYS}`;
  doorMissionBadge.setAttribute('aria-label',adminPreviewActive?'관리자 미리보기로 실내 꾸미기 열기':unlocked?'실내 꾸미기 열기':`서로 다른 날 기록 ${progress}/${INTERIOR_UNLOCK_DAYS}번, 문 열기 미션`);
}
function saveInteriorLayout(){ if(!adminPreviewActive) persistLocal(INTERIOR_LAYOUT_KEY,JSON.stringify(interiorLayout)); }
function ensureInteriorLayout(){
  const layout=activeInteriorLayout();
  const days=interiorDayCount();
  let changed=false;
  INTERIOR_ITEMS.filter(item=>days>=item.unlockDays).forEach(item=>{
    if(!layout[item.id]){
      layout[item.id]={x:item.x,y:item.y,placed:true};
      changed=true;
      return;
    }
    const room=interiorRoomById(item.room);
    const position=interiorLayoutToPosition(layout[item.id]);
    const clampedX=THREE.MathUtils.clamp(position.x,room.bounds.x[0],room.bounds.x[1]);
    const clampedZ=THREE.MathUtils.clamp(position.z,room.bounds.z[0],room.bounds.z[1]);
    if(Math.abs(clampedX-position.x)>.001||Math.abs(clampedZ-position.z)>.001){
      layout[item.id]={...layout[item.id],...interiorPositionToLayout(clampedX,clampedZ)};
      changed=true;
    }
  });
  if(changed&&!adminPreviewActive) saveInteriorLayout();
}
function renderInteriorItems(){
  ensureInteriorLayout();
  interiorItems.innerHTML='';
  syncInterior3DItems();
}
function renderInteriorInventory(){
  const days=interiorDayCount();
  const layout=activeInteriorLayout();
  const roomItems=INTERIOR_ITEMS.filter(item=>item.room===activeInteriorRoomId);
  const unlocked=roomItems.filter(item=>days>=item.unlockDays);
  interiorItemCount.textContent=adminPreviewActive?`${unlocked.length}개 체험`:`${unlocked.length}개 보유`;
  interiorInventoryList.innerHTML=roomItems.map(item=>{
    const available=days>=item.unlockDays;
    const placed=available&&layout[item.id]?.placed!==false;
    const status=available?(placed?(adminPreviewActive?'미리 배치됨 · 눌러 보관':'방에 배치됨 · 눌러 보관'):(adminPreviewActive?'체험 보관함 · 눌러 배치':'획득 완료 · 눌러 방에 놓기')):`${item.unlockDays}번째 기록 후 공개`;
    return `<button class="inventory-item-card${available?' unlocked':' locked'}${placed?' placed':''}" type="button" data-inventory-item="${item.id}" ${available?'':'aria-disabled="true"'}><span class="inventory-item-preview">${available?interiorItemMarkup(item.id):'<i class="inventory-question">?</i>'}</span><span><b>${available?item.label:'???'}</b><small>${status}</small></span></button>`;
  }).join('');
}
function openInterior(){
  if(!isInteriorUnlocked()) return;
  clearTimeout(interiorOpenTimer);
  interiorHouseName.textContent=`${houseName}네 집`;
  renderInteriorItems();
  renderInteriorInventory();
  interiorView.classList.add('open');
  interiorView.setAttribute('aria-hidden','false');
  document.body.classList.add('interior-open');
  document.querySelector('#close-interior').focus({preventScroll:true});
}
function closeInterior(){
  interiorView.classList.remove('open');
  interiorView.setAttribute('aria-hidden','true');
  document.body.classList.remove('interior-open');
  interiorDistance=9.7;
  interiorInsideMode=false;
  interiorView.classList.remove('inside-mode');
  interior3DHint.innerHTML='<span>↟</span> 휠을 위로 올려 집 안으로 · 빈 공간을 끌어 둘러보기';
  doorOpen=false;
  doorTargetRotation=0;
  warmInterior.visible=false;
}
function requestInteriorOpen(){
  if(!isInteriorUnlocked()) return toggleDoor();
  if(!doorOpen){ doorOpen=true; doorTargetRotation=OPEN_DOOR_ANGLE; syncDoorwayInteriorPreview(); warmInterior.visible=true; }
  clearTimeout(interiorOpenTimer);
  interiorOpenTimer=setTimeout(openInterior,850);
}

function createAdminInteriorLayout(){
  adminInteriorLayout=Object.fromEntries(INTERIOR_ITEMS.map(item=>{
    const saved=interiorLayout[item.id]||item;
    return [item.id,{x:saved.x,y:saved.y,placed:true}];
  }));
}
function enableAdminPreview(){
  if(adminPreviewActive||!adminPreviewAllowed) return;
  adminDecorLayoutSnapshot=JSON.parse(JSON.stringify(decorLayout));
  adminPreviewRewards={rareItem:'',exteriorStyle:''};
  createAdminInteriorLayout();
  adminPreviewActive=true;
  adminPreviewButton.classList.add('active');
  document.body.classList.add('admin-preview-active');
  updateDoorMissionUI();
  renderRewardJourney();
  renderInteriorInventory();
}
function openAdminPreview(){
  if(!adminPreviewAllowed) return;
  enableAdminPreview();
  adminPreviewStatus.classList.toggle('active',adminPreviewActive);
  adminPreviewStatus.querySelector('span').textContent='현재 구현된 잠금 기능이 모두 열렸어요. 체험 내용은 실제 기록과 선택에 저장되지 않아요.';
  stopAdminPreviewButton.hidden=!adminPreviewActive;
  adminPreviewBackdrop.classList.add('open');
  adminPreviewBackdrop.setAttribute('aria-hidden','false');
}
function closeAdminPreview(){
  adminPreviewBackdrop.classList.remove('open');
  adminPreviewBackdrop.setAttribute('aria-hidden','true');
}
function startAdminPreview(mode){
  if(!adminPreviewAllowed) return;
  enableAdminPreview();
  closeAdminPreview();
  if(mode==='door'){
    closeInterior();
    requestInteriorOpen();
    showCaptureNotice('관리자 문 열림 체험','잠시 후 실내 화면으로 이어집니다. 실제 기록은 바뀌지 않아요.');
  }else if(mode==='items'){
    openInterior();
    showCaptureNotice('관리자 아이템 배치 체험','모든 실내 아이템을 자유롭게 움직여 보세요. 체험 배치는 저장되지 않아요.');
  }else{
    document.querySelector('.reward-journey')?.scrollIntoView({behavior:'smooth',block:'center'});
    showCaptureNotice('관리자 보상 체험','희귀 장식과 외관 변경을 날짜와 관계없이 선택할 수 있어요.');
  }
}
function stopAdminPreview(){
  closeInterior();
  adminPreviewActive=false;
  adminInteriorLayout={};
  adminPreviewRewards={rareItem:'',exteriorStyle:''};
  if(adminDecorLayoutSnapshot) decorLayout=adminDecorLayoutSnapshot;
  adminDecorLayoutSnapshot=null;
  adminPreviewButton.classList.remove('active');
  document.body.classList.remove('admin-preview-active');
  closeAdminPreview();
  applyExteriorReward();
  rebuildDecorations();
  renderRecords();
  showCaptureNotice('관리자 체험을 끝냈어요','기존 기록과 아이템 배치는 그대로 유지되어 있어요.');
}

function startInteriorControl(event){
  if(event.button!==undefined&&event.button!==0) return;
  const item=interiorItemAtEvent(event);
  const door=!item&&interiorDoorAtEvent(event);
  interiorControl={mode:door?'door':item&&!isSharedHome?'item':'orbit',item,id:item?.userData?.interiorItemId||'',x:event.clientX,y:event.clientY,moved:false};
  interiorCanvas.setPointerCapture?.(event.pointerId);
  interiorCanvas.style.cursor=interiorControl.mode==='door'?'pointer':'grabbing';
  event.preventDefault();
}
function moveInteriorControl(event){
  if(!interiorControl) return;
  const dx=event.clientX-interiorControl.x,dy=event.clientY-interiorControl.y;
  if(Math.hypot(dx,dy)>2) interiorControl.moved=true;
  if(interiorControl.mode==='item'){
    setInteriorPointer(event);
    if(interiorRaycaster.ray.intersectPlane(interiorGroundPlane,interiorGroundPoint)){
      const item=INTERIOR_ITEMS.find(candidate=>candidate.id===interiorControl.id);
      const room=interiorRoomById(item?.room||activeInteriorRoomId);
      const x=THREE.MathUtils.clamp(interiorGroundPoint.x,room.bounds.x[0],room.bounds.x[1]);
      const z=THREE.MathUtils.clamp(interiorGroundPoint.z,room.bounds.z[0],room.bounds.z[1]);
      interiorControl.item.position.set(x,.12,z);
      const saved=interiorPositionToLayout(x,z),layout=activeInteriorLayout();
      layout[interiorControl.id]={...(layout[interiorControl.id]||{}),...saved,placed:true};
    }
  }else if(interiorControl.mode==='orbit'){
    interiorYaw-=dx*.009;
    interiorPitch=THREE.MathUtils.clamp(interiorPitch+dy*.006,.22,1.02);
  }
  interiorControl.x=event.clientX; interiorControl.y=event.clientY;
  event.preventDefault();
}
function finishInteriorControl(event){
  if(!interiorControl) return;
  if(interiorControl.mode==='door'&&!interiorControl.moved) toggleInteriorEntranceDoor();
  if(interiorControl.mode==='item'&&!adminPreviewActive) saveInteriorLayout();
  if(interiorControl.mode==='item') renderInteriorInventory();
  interiorControl=null;
  interiorCanvas.releasePointerCapture?.(event.pointerId);
  interiorCanvas.style.cursor='grab';
}

function renderRecords(){
  const total = memories.length;
  const monthlyDays=monthlyRecordedDayCount();
  countEl.innerHTML=`${String(monthlyDays).padStart(2,'0')} <small>/ ${MONTHLY_TARGET_DAYS}일</small>`;
  progressFill.style.width=`${Math.min(monthlyDays/MONTHLY_TARGET_DAYS*100,100)}%`;
  const decorationTotal=total+(milestoneRewards.rareItem?1:0);
  previewCount.textContent=`장식 ${String(decorationTotal).padStart(2,'0')}개`;
  todayPreview.innerHTML=memories[0]?memories[0].text.replace(/(.{17})/g,'$1<br>'):'여기에 오늘 잘한 일을<br />기록해 주세요.';
  const shown = memories.slice(0,3).map(m=>`<li><span class="memory-dot ${m.decor}">${DECOR_INFO[m.decor]?.icon||'✦'}</span><div><b>${escapeHTML(m.text)}</b><small>${formatMemoryTimestamp(m.date)}</small></div></li>`).join('');
  recentList.innerHTML=shown||'<li><span class="memory-dot">＋</span><div><b>아직 기록이 없어요</b><small>첫 잘한 일을 남기면 이곳에 나타나요.</small></div></li>';
  updateDoorMissionUI();
  renderRewardJourney();
  renderInteriorInventory();
  if(interiorView.classList.contains('open')) renderInteriorItems();
}
function escapeHTML(text){ const el=document.createElement('div');el.textContent=text;return el.innerHTML; }
renderRecords();

function memoryWeekKey(value){
  const date=new Date(value);
  return Number.isNaN(date.getTime())?'':localDateString(date);
}
function renderWeekSummary(){
  const today=dateFromString(localDateString());
  const monday=new Date(today);
  monday.setDate(today.getDate()-(today.getDay()+6)%7);
  const weekday=['월','화','수','목','금','토','일'];
  weekSummary.innerHTML=`<div class="week-days">${Array.from({length:7},(_,index)=>{
    const day=new Date(monday); day.setDate(monday.getDate()+index);
    const key=localDateString(day);
    const count=memories.filter(memory=>memoryWeekKey(memory.date)===key).length;
    return `<div class="week-day${key===localDateString()?' today':''}"><small>${weekday[index]}</small><b>${count}</b></div>`;
  }).join('')}</div>`;
}
function renderManager(){
  renderWeekSummary();
  managerList.innerHTML=memories.length?memories.map(memory=>`<article class="manager-item"><div><b>${escapeHTML(memory.text)}</b><small>${formatMemoryTimestamp(memory.date)}</small></div>${isSharedHome?'':`<div class="manager-item-actions"><button type="button" data-edit-memory="${memory.date}">수정</button><button class="delete-memory" type="button" data-delete-memory="${memory.date}">삭제</button></div>`}</article>`).join(''):'<p class="manager-empty">아직 기록한 잘한 일이 없어요.</p>';
}
function saveAllData(){
  persistLocal(STORAGE_KEY,JSON.stringify(memories));
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
  persistLocal(STREAK_START_KEY,streakStartDate);
  persistLocal(HOUSE_NAME_KEY,houseName);
}
function openManager(){
  editingMemoryDate=null;
  managerEditor.hidden=true;
  renderManager();
  managerBackdrop.classList.add('open');
  managerBackdrop.setAttribute('aria-hidden','false');
}
function closeManager(){
  managerBackdrop.classList.remove('open');
  managerBackdrop.setAttribute('aria-hidden','true');
  editingMemoryDate=null;
}
function openMemoryEditor(date){
  const memory=memories.find(item=>item.date===date);
  if(!memory) return;
  editingMemoryDate=date;
  editMemoryText.value=memory.text;
  managerEditor.hidden=false;
  editMemoryText.focus();
}
function saveMemoryEdit(){
  const memory=memories.find(item=>item.date===editingMemoryDate);
  const text=editMemoryText.value.trim();
  if(!memory||!text) return editMemoryText.focus();
  memory.text=text;
  saveAllData();
  rebuildDecorations();
  renderRecords();
  renderManager();
  managerEditor.hidden=true;
  editingMemoryDate=null;
}
function deleteMemory(date){
  memories=memories.filter(memory=>memory.date!==date);
  delete decorLayout[`memory-${date}`];
  saveAllData();
  rebuildDecorations();
  renderRecords();
  renderManager();
}

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
  if(isSharedHome){ showCaptureNotice('공유받은 집이에요','기록 시작일은 원래 모습 그대로 보기 전용으로 열려 있어요.'); return; }
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
  persistLocal(STREAK_START_KEY,streakStartDate);
  updateStreak();
  closeStreakModal();
});
updateStreak();

function enabledReminders(){
  return Object.entries(reminderSettings).filter(([,setting])=>setting.enabled);
}
function updateReminderButton(){
  const count=enabledReminders().length;
  openRemindersButton.classList.toggle('active',count>0);
  openRemindersButton.setAttribute('aria-label',count?`기록 알림 ${count}개 설정됨. 알림 설정 열기`:'기록 알림 설정');
  openRemindersButton.title=count?`기록 알림 ${count}개 설정됨`:'기록 알림 설정';
}
function fillReminderForm(){
  Object.entries(reminderSettings).forEach(([id,setting])=>{
    const enabled=reminderList.querySelector(`[data-reminder-enabled="${id}"]`);
    const time=reminderList.querySelector(`[data-reminder-time="${id}"]`);
    if(enabled) enabled.checked=setting.enabled;
    if(time) time.value=setting.time;
  });
  updateCalendarButton();
}
function collectReminderForm(){
  return Object.fromEntries(Object.keys(REMINDER_PRESETS).map(id=>{
    const enabled=reminderList.querySelector(`[data-reminder-enabled="${id}"]`);
    const time=reminderList.querySelector(`[data-reminder-time="${id}"]`);
    return [id,{enabled:Boolean(enabled?.checked),time:time?.value||REMINDER_PRESETS[id].time}];
  }));
}
function selectedReminderCountFromForm(){
  return reminderList.querySelectorAll('[data-reminder-enabled]:checked').length;
}
function updateCalendarButton(){
  const count=selectedReminderCountFromForm();
  downloadRemindersButton.disabled=count===0;
  downloadRemindersButton.textContent=count?`선택한 ${count}개를 캘린더에 추가`:'캘린더에 반복 알림 추가';
}
function openReminderModal(){
  fillReminderForm();
  reminderBackdrop.classList.add('open');
  reminderBackdrop.setAttribute('aria-hidden','false');
}
function closeReminderModal(){
  reminderBackdrop.classList.remove('open');
  reminderBackdrop.setAttribute('aria-hidden','true');
}
function saveReminderSettings({close=true,notify=true}={}){
  reminderSettings=collectReminderForm();
  localStorage.setItem(REMINDER_STORAGE_KEY,JSON.stringify(reminderSettings));
  updateReminderButton();
  if(close) closeReminderModal();
  if(notify){
    const count=enabledReminders().length;
    showCaptureNotice(count?'알림 시간을 기억해 둘게요':'알림을 모두 쉬게 했어요',count?`${count}개의 시간에 사이트 안에서도 다정하게 알려드릴게요.`:'언제든 종 모양을 눌러 다시 켤 수 있어요.');
  }
}
function padCalendarNumber(value){ return String(value).padStart(2,'0'); }
function calendarLocalStamp(date){
  return `${date.getFullYear()}${padCalendarNumber(date.getMonth()+1)}${padCalendarNumber(date.getDate())}T${padCalendarNumber(date.getHours())}${padCalendarNumber(date.getMinutes())}00`;
}
function calendarUtcStamp(date){
  return `${date.getUTCFullYear()}${padCalendarNumber(date.getUTCMonth()+1)}${padCalendarNumber(date.getUTCDate())}T${padCalendarNumber(date.getUTCHours())}${padCalendarNumber(date.getUTCMinutes())}${padCalendarNumber(date.getUTCSeconds())}Z`;
}
function calendarEscape(value){ return value.replace(/\\/g,'\\\\').replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n'); }
function buildReminderCalendar(){
  const now=new Date();
  const stamp=calendarUtcStamp(now);
  const events=enabledReminders().map(([id,setting])=>{
    const [hour,minute]=setting.time.split(':').map(Number);
    const start=new Date(now.getFullYear(),now.getMonth(),now.getDate(),hour,minute,0,0);
    if(start<now) start.setDate(start.getDate()+1);
    const label=REMINDER_PRESETS[id].label;
    return [
      'BEGIN:VEVENT',
      `UID:podoal-${id}-${Date.now()}@today-home`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${calendarLocalStamp(start)}`,
      'RRULE:FREQ=DAILY',
      `SUMMARY:${calendarEscape(`오늘의 잘한 일 기록하기 · ${label}`)}`,
      'DESCRIPTION:오늘 잘한 일을 한 줄 남기고 나의 작은 집을 꾸며보세요.',
      'BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:오늘의 잘한 일을 기록할 시간이에요.','END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  });
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Today Home//Gentle Reminder//KO','CALSCALE:GREGORIAN','METHOD:PUBLISH',...events,'END:VCALENDAR',''].join('\r\n');
}
function downloadReminderCalendar(){
  reminderSettings=collectReminderForm();
  if(!enabledReminders().length){ updateCalendarButton(); return; }
  localStorage.setItem(REMINDER_STORAGE_KEY,JSON.stringify(reminderSettings));
  updateReminderButton();
  const blob=new Blob([buildReminderCalendar()],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;
  link.download='오늘의-집-기록-알림.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  showCaptureNotice('캘린더 알림 파일을 만들었어요','다운로드한 파일을 열고 휴대폰 캘린더에 추가해 주세요.');
}
function checkDueReminder(){
  if(document.visibilityState==='hidden'||!enabledReminders().length) return;
  const now=new Date();
  const currentTime=`${padCalendarNumber(now.getHours())}:${padCalendarNumber(now.getMinutes())}`;
  const due=enabledReminders().find(([,setting])=>setting.time===currentTime);
  if(!due) return;
  const fireKey=`${localDateString(now)}-${due[0]}-${currentTime}`;
  if(localStorage.getItem(REMINDER_LAST_FIRED_KEY)===fireKey) return;
  localStorage.setItem(REMINDER_LAST_FIRED_KEY,fireKey);
  showCaptureNotice('오늘의 나를 칭찬할 시간이에요',`${REMINDER_PRESETS[due[0]].label}의 작은 잘함을 한 줄 남겨볼까요?`);
}
openRemindersButton.addEventListener('click',openReminderModal);
document.querySelector('#close-reminders').addEventListener('click',closeReminderModal);
reminderBackdrop.addEventListener('click',event=>{ if(event.target===reminderBackdrop) closeReminderModal(); });
reminderList.addEventListener('change',updateCalendarButton);
saveRemindersButton.addEventListener('click',()=>saveReminderSettings());
downloadRemindersButton.addEventListener('click',downloadReminderCalendar);
document.addEventListener('visibilitychange',checkDueReminder);
document.addEventListener('keydown',event=>{ if(event.key==='Escape'&&reminderBackdrop.classList.contains('open')) closeReminderModal(); });
setInterval(checkDueReminder,15000);
updateReminderButton();
checkDueReminder();

function saveHouseName(){
  if(isSharedHome) return;
  const nextName=houseNameInput.value.trim().replace(/네\s*집$/,'').trim();
  if(nextName) houseName=nextName;
  houseNameText.textContent=`${houseName}네 집`;
  houseNameInput.value=houseName;
  persistLocal(HOUSE_NAME_KEY,houseName);
  drawNameplate();
  houseNameEditor.classList.remove('editing');
}
houseNameButton.addEventListener('click',()=>{ if(isSharedHome){ showCaptureNotice('공유받은 집이에요','집 이름은 원래 모습 그대로 보기 전용으로 열려 있어요.'); return; } houseNameInput.value=houseName; houseNameEditor.classList.add('editing'); houseNameInput.focus(); houseNameInput.select(); });
houseNameInput.addEventListener('keydown',e=>{ if(e.key==='Enter') saveHouseName(); if(e.key==='Escape') houseNameEditor.classList.remove('editing'); });
houseNameInput.addEventListener('blur',saveHouseName);

function openModal(){ if(isSharedHome){ showCaptureNotice('공유받은 집이에요','기록과 장식은 원래 모습 그대로 보기 전용으로 열려 있어요.'); return; } modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); setTimeout(()=>input.focus(),180); }
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
  const recordedAt=new Date();
  const memory={text,decor:selectedDecor,date:recordedAt.toISOString(),flowerColor};
  const shouldSetStartDate=!streakStartDate;
  memories.unshift(memory);
  persistLocal(STORAGE_KEY,JSON.stringify(memories));
  if(shouldSetStartDate){
    streakStartDate=localDateString(recordedAt);
    persistLocal(STREAK_START_KEY,streakStartDate);
    updateStreak();
  }
  addDecoration(selectedDecor,memories.length,true,text,`memory-${memory.date}`,flowerColor);
  renderRecords();
  input.value='';
  closeModal();
  showCaptureNotice(shouldSetStartDate?'오늘부터 시작했어요!':'오늘의 장식이 놓였어요!',shouldSetStartDate?'첫 기록 날짜가 시작일로 자동 설정되고, 장식도 집에 놓였어요.':'집이 조금 더 따뜻해졌습니다.');
});
input.addEventListener('keydown',e=>{ if(e.key==='Enter') document.querySelector('#save-memory').click(); });
document.querySelector('#sound-button').addEventListener('click',event=>{
  const button=event.currentTarget;
  const muted=button.classList.toggle('muted');
  button.setAttribute('aria-pressed',String(muted));
  button.setAttribute('aria-label',muted?'소리 켜기':'소리 끄기');
});

doorMissionBadge.addEventListener('click',requestInteriorOpen);
document.querySelector('#close-interior').addEventListener('click',closeInterior);
interiorCanvas.addEventListener('pointerdown',startInteriorControl);
interiorCanvas.addEventListener('pointermove',moveInteriorControl,{passive:false});
interiorCanvas.addEventListener('pointerup',finishInteriorControl);
interiorCanvas.addEventListener('pointercancel',finishInteriorControl);
interiorCanvas.addEventListener('wheel',event=>{ interiorDistance=THREE.MathUtils.clamp(interiorDistance+event.deltaY*.010,2.25,17); event.preventDefault(); },{passive:false});
interiorRoomMap.addEventListener('click',event=>{
  const button=event.target.closest('[data-interior-room]');
  if(button) selectInteriorRoom(button.dataset.interiorRoom);
});
interiorActivityButton.addEventListener('click',runInteriorActivity);
interiorInventoryList.addEventListener('click',event=>{
  const button=event.target.closest('[data-inventory-item]');
  if(!button) return;
  const item=INTERIOR_ITEMS.find(candidate=>candidate.id===button.dataset.inventoryItem);
  if(!item) return;
  if(interiorDayCount()<item.unlockDays){
    showCaptureNotice('아직 비공개인 아이템이에요',`${item.unlockDays}번째 기록을 남기면 이름과 모습이 공개돼요.`);
    return;
  }
  if(isSharedHome){
    showCaptureNotice('공유받은 집이에요','실내 아이템은 원래 주인만 움직일 수 있어요.');
    return;
  }
  const layout=activeInteriorLayout();
  const current=layout[item.id]||{x:item.x,y:item.y,placed:false};
  layout[item.id]={...current,placed:current.placed===false};
  saveInteriorLayout();
  renderInteriorItems();
  renderInteriorRoomMap();
  updateInteriorRoomPanel();
  renderInteriorInventory();
});
document.addEventListener('keydown',event=>{ if(event.key==='Escape'&&interiorView.classList.contains('open')) closeInterior(); });

document.querySelector('#open-manager').addEventListener('click',openManager);
document.querySelector('#close-manager').addEventListener('click',closeManager);
managerBackdrop.addEventListener('click',event=>{ if(event.target===managerBackdrop) closeManager(); });
rewardMilestones.addEventListener('click',event=>{
  const button=event.target.closest('[data-open-reward]');
  if(button) openRewardModal(button.dataset.openReward);
});
document.querySelector('#close-reward').addEventListener('click',closeRewardModal);
rewardBackdrop.addEventListener('click',event=>{ if(event.target===rewardBackdrop) closeRewardModal(); });
rewardChoiceList.addEventListener('click',event=>{
  const choice=event.target.closest('[data-reward-choice]');
  if(choice) chooseMilestoneReward(choice.dataset.rewardChoice);
});
document.addEventListener('keydown',event=>{ if(event.key==='Escape'&&rewardBackdrop.classList.contains('open')) closeRewardModal(); });
managerList.addEventListener('click',event=>{
  const edit=event.target.closest('[data-edit-memory]');
  const remove=event.target.closest('[data-delete-memory]');
  if(edit) openMemoryEditor(edit.dataset.editMemory);
  if(remove&&confirm('이 기록과 연결된 장식을 삭제할까요?')) deleteMemory(remove.dataset.deleteMemory);
});
document.querySelector('#save-memory-edit').addEventListener('click',saveMemoryEdit);
document.querySelector('#cancel-memory-edit').addEventListener('click',()=>{ editingMemoryDate=null; managerEditor.hidden=true; });

function openGuide(){ guideBackdrop.classList.add('open'); guideBackdrop.setAttribute('aria-hidden','false'); }
function closeGuide(){ guideBackdrop.classList.remove('open'); guideBackdrop.setAttribute('aria-hidden','true'); persistLocal(GUIDE_SEEN_KEY,'true'); }
document.querySelector('#open-guide').addEventListener('click',openGuide);
document.querySelector('#close-guide').addEventListener('click',closeGuide);
document.querySelector('#finish-guide').addEventListener('click',closeGuide);
guideBackdrop.addEventListener('click',event=>{ if(event.target===guideBackdrop) closeGuide(); });
if(!localStorage.getItem(GUIDE_SEEN_KEY)) setTimeout(openGuide,550);

adminPreviewButton.addEventListener('click',openAdminPreview);
document.querySelector('#close-admin-preview').addEventListener('click',closeAdminPreview);
adminPreviewBackdrop.addEventListener('click',event=>{ if(event.target===adminPreviewBackdrop) closeAdminPreview(); });
adminPreviewBackdrop.addEventListener('click',event=>{
  const action=event.target.closest('[data-admin-preview]');
  if(action) startAdminPreview(action.dataset.adminPreview);
});
stopAdminPreviewButton.addEventListener('click',stopAdminPreview);
document.addEventListener('keydown',event=>{ if(event.key==='Escape'&&adminPreviewBackdrop.classList.contains('open')) closeAdminPreview(); });
