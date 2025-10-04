const featureInput = document.getElementById('featureInput');
const predictBtn = document.getElementById('predictBtn');
const aiBtn = document.getElementById('aiBtn');
const resultDiv = document.getElementById('result');
const aiResultDiv = document.getElementById('aiResult');

predictBtn.addEventListener('click', async ()=>{
  const feature = featureInput.value.trim();
  if(!feature) return alert("Entrez une feature!");

  resultDiv.innerHTML = `<p class="text-gray-500">Chargement...</p>`;

  try{
    const res = await fetch(`/predict?feature=${encodeURIComponent(feature)}`);
    if(!res.ok) throw new Error("Erreur serveur");
    const data = await res.json();
    let color='text-gray-700';
    if(data.recommendation==='SAFE') color='text-green-600';
    else if(data.recommendation==='ADOPT_WITH_CARE') color='text-yellow-600';
    else if(data.recommendation==='SECURE_WITH_FALLBACK') color='text-red-600';
    resultDiv.innerHTML=`
      <div class="p-4 border rounded ${color}">
        <p><strong>Feature:</strong> ${data.feature}</p>
        <p><strong>Baseline connue:</strong> ${data.baseline_known}</p>
        <p><strong>Baseline:</strong> ${data.baseline}</p>
        <p><strong>Estimation adoption (mois):</strong> ${data.months_to_widespread_adoption_estimate}</p>
        <p><strong>Popularité:</strong> ${data.popularity_growth}</p>
        <p><strong>Recommandation:</strong> ${data.recommendation}</p>
      </div>
    `;
  }catch(err){
    console.error(err);
    resultDiv.innerHTML=`<p class="text-red-600">Erreur prédiction</p>`;
  }
});

aiBtn.addEventListener('click', async ()=>{
  const feature = featureInput.value.trim();
  if(!feature) return alert("Entrez une feature!");

  aiResultDiv.innerHTML=`<p class="text-gray-500">Chargement IA...</p>`;

  try{
    const res = await fetch('/predict-ai',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ feature })
    });
    const data = await res.json();
    aiResultDiv.innerHTML=`
      <div class="p-4 border rounded text-purple-600 whitespace-pre-line">
        <strong>Conseil IA:</strong>\n${data.ai_advice}
      </div>
    `;
  }catch(err){
    console.error(err);
    aiResultDiv.innerHTML=`<p class="text-red-600">Erreur IA</p>`;
  }
});
