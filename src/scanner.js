import fetch from 'node-fetch';

export async function lookupBaselineStatus(featureName) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error("Set GEMINI_API_KEY in environment");

  try {
    const res = await fetch(`https://gemini.googleapis.com/v1/webFeatures?feature=${gemini-2.0-flash-lite}&key=${GEMINI_API_KEY}`);
    if (!res.ok) throw new Error("Erreur API Gemini");
    const data = await res.json();

    const baseline = data.baselineStatus === 'STABLE';
    const popularity = data.popularityEstimate || 0;

    return {
      found: true,
      baseline,
      popularity_growth: popularity,
      raw: data
    };
  } catch (err) {
    console.error("Erreur Gemini:", err);
    return { found: false, baseline: false, popularity_growth: 0, raw: null };
  }
}
