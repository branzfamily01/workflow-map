(()=>{
const KEY='workflow-map-state-v2';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const labels={unassigned:'未担当',assigned:'担当決定',doing:'作業中',waiting:'相手待ち',done:'完了',hold:'保留',not_needed:'不要になった'};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{works:[]}}catch{return{works:[]}}}
function work(s){return s.works?.find(w=>w.id===s.currentWorkId)||s.works?.[0]}
function tasks(c){return (c.stages||[]).flatMap(s=>(s.tasks||[]).map(t=>({...t,stageTitle:s.title})))}
function progress(c){const a=tasks(c).filter(t=>t.status!=='not_needed');return a.length?Math.round(a.filter(t=>t.status==='done').length/a.length*100):0}
function next(c){return tasks(c).find(t=>!['done','not_needed'].includes(t.status))}
function date(v){if(!v)return'';const d=new Date(v+'T00:00:00');return `${d.getMonth()+1}/${d.getDate()}`}
function render(){const s=load(),w=work(s),hide=$('#shareHideDetails').checked;if(!w){$('#shareCanvas').innerHTML='<div class="share-empty">共有できるワークがまだありません。</div>';return}const cases=(w.cases||[]).filter(c=>c.status!=='archived');const all=cases.flatMap(c=>tasks(c).map(t=>({...t,caseTitle:c.title})));const waiting=all.filter(t=>t.status==='waiting');const open=all.filter(t=>!['done','not_needed'].includes(t.status));$('#shareCanvas').innerHTML=`<header class="share-head"><div class="eyebrow">WORKFLOW MAP · SHARE VIEW</div><h1>${esc(w.name)}</h1><p>${cases.length}件の案件・未完了${open.length}件・相手待ち${waiting.length}件</p></header>${cases.map(c=>{const n=next(c),p=progress(c);return `<section class="share-case"><div class="share-case-top"><h2>${esc(c.title)}</h2><strong>${p}%</strong></div><div class="progress"><i style="width:${p}%"></i></div>${n?`<div class="share-next"><small>次にやること</small><b>${esc(n.title)}</b><div class="share-meta"><span>${esc(labels[n.status]||n.status)}</span>${!hide&&n.assignees?.length?`<span>担当 ${esc(n.assignees.join('・'))}</span>`:''}${n.dueDate?`<span>期限 ${date(n.dueDate)}</span>`:''}</div></div>`:'<div class="share-done">✓ 完了</div>'}${!hide?tasks(c).filter(t=>t.status==='waiting').map(t=>`<div class="share-wait">⏳ 相手待ち：${esc(t.title)}${t.dueDate?` <small>期限 ${date(t.dueDate)}</small>`:''}</div>`).join(''):''}</section>`}).join('')||'<div class="share-empty">案件はまだありません。</div>'}<footer class="share-foot">${new Date().toLocaleDateString('ja-JP')} 時点</footer>`}
function open(){render();$('#shareOverlay').classList.remove('hidden');document.body.classList.add('sharing')}
function close(){$('#shareOverlay').classList.add('hidden');document.body.classList.remove('sharing')}
document.addEventListener('DOMContentLoaded',()=>{$('#shareViewBtn')?.addEventListener('click',open);$('#closeShareView')?.addEventListener('click',close);$('#shareHideDetails')?.addEventListener('change',render)});
})();
