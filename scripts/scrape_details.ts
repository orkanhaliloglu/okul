/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';


// Read files
const sayPath = path.join(process.cwd(), 'src/data/universities_say.json');
const eaPath = path.join(process.cwd(), 'src/data/universities_ea.json');

const sayData = JSON.parse(fs.readFileSync(sayPath, 'utf-8'));
const eaData = JSON.parse(fs.readFileSync(eaPath, 'utf-8'));

// Filter items that have program_code and haven't been scraped yet (roughly check for tyt_turkce)
// For now, let's just get the list of IDs to scrape.
const sayIds = sayData.filter((i: any) => i.program_code && !i.tyt_turkce).slice(0, 50).map((i: any) => i.program_code);
const eaIds = eaData.filter((i: any) => i.program_code && !i.tyt_turkce).slice(0, 50).map((i: any) => i.program_code);

console.log(JSON.stringify({ say: sayIds, ea: eaIds }));
