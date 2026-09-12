// Simulation of frontend aiApi calling backend and parsing in Travel & Planner
async function testFrontendAIConsumption() {
  const base = 'http://localhost:5000/api';

  console.log('Testing frontend AI consumption flow...');

  // 1. Travel Prompt
  const travelPrompt = `Analyze travel safety for Zurich, Switzerland on 2026-09-15. Return ONLY a JSON object with this exact structure (no markdown block, just raw JSON): { "decision": "GO" | "CAUTION" | "AVOID", "reasoning": "brief explanation", "risks": { "aqi": "string", "rain": "string", "storm": "string", "heatwave": "string" } }`;

  const travelRes = await fetch(`${base}/v1/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: travelPrompt,
      weatherData: { name: 'Zurich', main: { temp: 20, humidity: 55 }, weather: [{ main: 'Clear' }] }
    })
  });

  const travelData = await travelRes.json();
  const replyText = travelData.reply || travelData.response || '';
  const normalizedTravel = {
    ...travelData,
    reply: replyText,
    response: replyText
  };

  // Travel.jsx parsing logic
  const aiText = normalizedTravel.reply || normalizedTravel.response || '';
  let travelResult = null;
  try {
    let jsonStr = aiText.replace(/```json\n?|\n?```/g, '').trim();
    const match = jsonStr.match(/\{[\s\S]*\}/);
    if (match) jsonStr = match[0];
    travelResult = JSON.parse(jsonStr);
    console.log('[PASS] Travel.jsx parsing succeeded:', travelResult.decision, '-', travelResult.reasoning);
  } catch (err) {
    console.error('[FAIL] Travel.jsx parsing failed:', err.message);
  }

  // 2. Planner Prompt
  const plannerPrompt = `Generate a personalized daily executive atmospheric schedule and weather intelligence briefing for Zurich. Return ONLY valid JSON with this structure: { "greeting": "string", "summary": "string", "suggestions": ["string"], "schedule": [{ "time": "string", "activity": "string", "icon": "string" }] }`;

  const plannerRes = await fetch(`${base}/v1/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: plannerPrompt,
      weatherData: { name: 'Zurich', main: { temp: 20, humidity: 55 }, weather: [{ main: 'Clear' }] }
    })
  });

  const plannerData = await plannerRes.json();
  const plannerReplyText = plannerData.reply || plannerData.response || '';
  const normalizedPlanner = {
    ...plannerData,
    reply: plannerReplyText,
    response: plannerReplyText
  };

  const plannerAiText = normalizedPlanner.reply || normalizedPlanner.response || '';
  let plannerResult = null;
  try {
    let jsonStr = plannerAiText.replace(/```json\n?|\n?```/g, '').trim();
    const match = jsonStr.match(/\{[\s\S]*\}/);
    if (match) jsonStr = match[0];
    plannerResult = JSON.parse(jsonStr);
    console.log('[PASS] Planner.jsx parsing succeeded:', plannerResult.greeting, '| Schedule items:', plannerResult.schedule?.length);
  } catch (err) {
    console.error('[FAIL] Planner.jsx parsing failed:', err.message);
  }
}

testFrontendAIConsumption();

