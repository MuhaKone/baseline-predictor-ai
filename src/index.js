import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { predictFeature } from './predictor.js';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Baseline predictor endpoint
app.get('/predict', async (req,res) => {
  const feature = req.query.feature;
  if(!feature) return res.status(400).json({ error: 'feature query param required' });
  const r = await predictFeature(feature);
  res.json(r);
});

// OpenAI / IA endpoint
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.post('/predict-ai', async (req,res)=>{
  const feature = req.body.feature;
  if(!feature) return res.status(400).json({ error: 'feature field required' });

  const prompt = `Vous êtes un expert web. Explique si la feature "${feature}" est sûre à utiliser aujourd'hui. 
Indique le risque, le temps probable avant adoption universelle, et la recommandation SAFE / ADOPT_WITH_CARE / SECURE_WITH_FALLBACK.`;

  try{
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [{ role:"user", content: prompt }]
    });
    const response = completion.choices[0].message.content;
    res.json({ feature, ai_advice: response });
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'Erreur IA' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Baseline Predictor AI running on', PORT));
