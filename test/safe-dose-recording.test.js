import fs from 'node:fs';

const index=fs.readFileSync('index.html','utf8');
if(!index.includes('予定時刻前です')) throw new Error('early dose guard missing');
if(!index.includes('投薬した（記録する）')) throw new Error('dose record button label missing');
if(!index.includes('実際に投薬した場合のみ「OK」を押してください。')) throw new Error('dose confirmation missing');
if(!index.includes('medicationName')) throw new Error('medication name confirmation data missing');
console.log('safe dose recording checks passed');
