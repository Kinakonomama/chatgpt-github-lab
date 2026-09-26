import fs from 'node:fs';

const index=fs.readFileSync('index.html','utf8');
if(!index.includes('🔴 まだ投薬されていません')) throw new Error('missed-dose warning missing');
if(!index.includes('dose-status overdue')) throw new Error('overdue status styling missing');
if(!index.includes('予定時刻まで待機中')) throw new Error('upcoming status missing');
if(!index.includes('担当：')) throw new Error('administered-by display missing');
console.log('missed dose status checks passed');
