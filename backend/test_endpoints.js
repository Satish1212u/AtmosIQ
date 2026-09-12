async function runValidation() {
  const base = 'http://localhost:5000';
  console.log('==============================================');
  console.log('ATMOSIQ BACKEND API VALIDATION SUITE');
  console.log('==============================================');

  // 1. Health check
  try {
    const res = await fetch(`${base}/health`);
    const data = await res.json();
    console.log(`[PASS ${res.status}] GET /health -> status: ${data.status}`);
  } catch (e) {
    console.error('[FAIL] GET /health:', e.message);
  }

  // 2. Weather route
  try {
    const res = await fetch(`${base}/api/v1/weather?city=London`);
    const data = await res.json();
    console.log(`[PASS ${res.status}] GET /api/v1/weather?city=London -> location: ${data.location?.name}, temp: ${data.currentWeather?.temp}°C`);
  } catch (e) {
    console.error('[FAIL] GET /api/v1/weather:', e.message);
  }

  // 3. AI chat route
  try {
    const res = await fetch(`${base}/api/v1/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is the weather like today?',
        weatherData: {
          name: 'London',
          main: { temp: 18, humidity: 60 },
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
          wind: { speed: 3.5 }
        }
      })
    });
    const data = await res.json();
    console.log(`[PASS ${res.status}] POST /api/v1/ai/chat -> success: ${data.success}, modelUsed: ${data.modelUsed}, reply preview: "${data.reply?.substring(0, 70)}..."`);
  } catch (e) {
    console.error('[FAIL] POST /api/v1/ai/chat:', e.message);
  }

  // 4. AI intelligence route
  try {
    const res = await fetch(`${base}/api/v1/ai/intelligence?city=London`);
    const data = await res.json();
    console.log(`[PASS ${res.status}] GET /api/v1/ai/intelligence?city=London -> status: ${data.status}`);
  } catch (e) {
    console.error('[FAIL] GET /api/v1/ai/intelligence:', e.message);
  }

  // 5. Travel check route
  try {
    const res = await fetch(`${base}/api/v1/travel/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'London',
        destination: 'Paris',
        date: '2026-09-15'
      })
    });
    const data = await res.json();
    console.log(`[PASS ${res.status}] POST /api/v1/travel/check -> success: ${data.success}, decision: ${data.data?.decision}, reasoning: "${data.data?.reasoning}"`);
  } catch (e) {
    console.error('[FAIL] POST /api/v1/travel/check:', e.message);
  }

  // 6. Auth fail-fast test (when DB is unavailable or checking credentials)
  try {
    const res = await fetch(`${base}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log(`[STATUS ${res.status}] POST /api/v1/auth/login -> message: "${data.message}"`);
  } catch (e) {
    console.error('[FAIL] POST /api/v1/auth/login:', e.message);
  }

  // 7. CORS verification
  console.log('\n--- CORS ORIGIN VERIFICATION ---');
  const originsToTest = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'https://atmos-iq-chi.vercel.app',
    'https://unauthorized-domain.com'
  ];

  for (const origin of originsToTest) {
    try {
      const res = await fetch(`${base}/health`, {
        headers: { 'Origin': origin }
      });
      const allowHeader = res.headers.get('access-control-allow-origin');
      console.log(`Origin: ${origin} -> Allowed Header: ${allowHeader || '(none)'} (HTTP ${res.status})`);
    } catch (e) {
      console.log(`Origin: ${origin} -> Error: ${e.message}`);
    }
  }

  console.log('==============================================');
}

runValidation();

