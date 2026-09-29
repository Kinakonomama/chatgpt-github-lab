import fs from 'node:fs';

const history=fs.readFileSync('medication-history.html','utf8');
if(!history.includes('id="historySummary"')) throw new Error('history summary missing');
if(!history.includes('id="historyCount"')) throw new Error('history count missing');
if(!history.includes('id="historyTime"')) throw new Error('history time missing');
if(!history.includes('投薬件数')) throw new Error('dose count label missing');
if(!history.includes('投薬時間')) throw new Error('dose time label missing');
if(!history.includes('今日の投薬画面から記録できます。')) throw new Error('empty-state guidance missing');
if(!history.includes(".eq('medications.pet_id',currentPet.id)")) throw new Error('pet-scoped history query missing');
console.log('medication history summary checks passed');
