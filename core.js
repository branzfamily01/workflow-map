export const TASK_STATUSES = [
  ['unassigned','未担当'],['assigned','担当決定'],['doing','作業中'],
  ['waiting','相手待ち'],['done','完了'],['hold','保留'],['not_needed','不要になった']
];

export const STATUS_LABEL = Object.fromEntries(TASK_STATUSES);
export const STATUS_CLASS = {unassigned:'gray',assigned:'blue',doing:'blue',waiting:'yellow',done:'green',hold:'gray',not_needed:'gray'};
export const PEOPLE = [];

export const uid = (prefix='id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
export const todayISO = () => new Date().toISOString().slice(0,10);
export const deepClone = obj => JSON.parse(JSON.stringify(obj));

export function allTasks(caseItem){
  return (caseItem.stages||[]).flatMap((stage, si)=>(stage.tasks||[]).map((task, ti)=>({...task, stageId:stage.id, stageTitle:stage.title, stageIndex:si, taskIndex:ti})));
}
export function calcProgress(caseItem){
  const tasks=allTasks(caseItem).filter(t=>t.status!=='not_needed');
  if(!tasks.length) return 0;
  return Math.round(tasks.filter(t=>t.status==='done').length/tasks.length*100);
}
export function getNextTask(caseItem){
  return allTasks(caseItem).find(t=>!['done','not_needed'].includes(t.status)) || null;
}
export function daysUntil(dateStr, now=new Date()){
  if(!dateStr) return null;
  const d=new Date(`${dateStr}T23:59:59`);
  return Math.ceil((d-now)/(1000*60*60*24));
}
export function dueSoonTasks(state, withinDays=7){
  return (state.cases||[]).filter(c=>c.status!=='archived').flatMap(c=>allTasks(c).map(t=>({...t,caseId:c.id,caseTitle:c.title})))
    .filter(t=>!['done','not_needed'].includes(t.status) && t.dueDate && daysUntil(t.dueDate)<=withinDays)
    .sort((a,b)=>(a.dueDate||'').localeCompare(b.dueDate||''));
}
export function tasksForPerson(state, person){
  return (state.cases||[]).filter(c=>c.status!=='archived').flatMap(c=>allTasks(c).map(t=>({...t,caseId:c.id,caseTitle:c.title})))
    .filter(t=>!['done','not_needed'].includes(t.status) && (t.assignees||[]).includes(person));
}
export function tasksByStatus(state, status){
  return (state.cases||[]).filter(c=>c.status!=='archived').flatMap(c=>allTasks(c).map(t=>({...t,caseId:c.id,caseTitle:c.title})))
    .filter(t=>t.status===status);
}
export function unassignedTasks(state){
  return (state.cases||[]).filter(c=>c.status!=='archived').flatMap(c=>allTasks(c).map(t=>({...t,caseId:c.id,caseTitle:c.title})))
    .filter(t=>!['done','not_needed'].includes(t.status) && !(t.assignees||[]).length);
}
export function recentDoneTasks(state, limit=8){
  return (state.cases||[]).flatMap(c=>allTasks(c).map(t=>({...t,caseId:c.id,caseTitle:c.title})))
    .filter(t=>t.status==='done').sort((a,b)=>(b.completedAt||b.updatedAt||'').localeCompare(a.completedAt||a.updatedAt||'')).slice(0,limit);
}
export function searchableText(caseItem){
  const taskText=allTasks(caseItem).map(t=>[t.title,t.memo,t.stageTitle,(t.assignees||[]).join(' '),(t.needs||[]).join(' '),(t.completionCriteria||[]).join(' ')].join(' ')).join(' ');
  const notes=(caseItem.notes||[]).map(n=>Object.values(n).join(' ')).join(' ');
  const contacts=(caseItem.contacts||[]).map(c=>Object.values(c).join(' ')).join(' ');
  return [caseItem.title,caseItem.summary,caseItem.goal,taskText,notes,contacts].join(' ').toLowerCase();
}
export function caseMatches(caseItem, query){
  return !query || searchableText(caseItem).includes(query.trim().toLowerCase());
}
