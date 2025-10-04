import fs from 'fs';
import path from 'path';
import { lookupBaselineStatus } from './scanner.js';

const historyPath = path.resolve('./data/history.json');
let history = {};
try { history = JSON.parse(fs.readFileSync(historyPath, 'utf8')); } catch(e){}

function monthsEstimateFromPopularity(popularityGrowth, baselineFlag) {
  if (baselineFlag) return 0;
  const growth = Math.max(0, Math.min(1, popularityGrowth));
  return Math.max(1, Math.round((1 - growth) * 12));
}

export async function predictFeature(name) {
  const scan = await lookupBaselineStatus(name);
  const hist = history[name.toLowerCase()] || history[name] || null;
  const popularity = hist ? hist.popularity_growth || 0 : 0;
  const months = monthsEstimateFromPopularity(popularity, scan.baseline);
  const recommendation = scan.baseline ? 'SAFE' : (months <= 3 ? 'ADOPT_WITH_CARE' : 'SECURE_WITH_FALLBACK');
  return {
    feature: name,
    baseline_known: scan.found,
    baseline: !!scan.baseline,
    months_to_widespread_adoption_estimate: months,
    popularity_growth: popularity,
    recommendation,
    raw_scan: scan.raw
  };
}

export async function predictFromList(list) {
  const out = [];
  for (const f of list) out.push(await predictFeature(f));
  return out;
}
