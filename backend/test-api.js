async function testApplicationsAPI() {
  try {
    console.log('🧪 Testing Applications API...');
    
    // Test 1: Stats endpoint
    console.log('\n1️⃣ Testing /api/applications/stats...');
    const statsResponse = await fetch('http://localhost:3002/api/applications/stats');
    console.log(`📊 Status: ${statsResponse.status} ${statsResponse.statusText}`);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Stats Success! Data received:');
      console.log(JSON.stringify(statsData, null, 2));
    } else {
      const errorText = await statsResponse.text();
      console.log('❌ Stats Error response:');
      console.log(errorText);
    }
    
    // Test 2: Applications list endpoint
    console.log('\n2️⃣ Testing /api/applications...');
    const appsResponse = await fetch('http://localhost:3002/api/applications?limit=5');
    console.log(`📊 Status: ${appsResponse.status} ${appsResponse.statusText}`);
    
    if (appsResponse.ok) {
      const appsData = await appsResponse.json();
      console.log('✅ Applications Success! Data received:');
      console.log(JSON.stringify(appsData, null, 2));
    } else {
      const errorText = await appsResponse.text();
      console.log('❌ Applications Error response:');
      console.log(errorText);
    }
    
    // Test 3: Health check
    console.log('\n3️⃣ Testing /health...');
    const healthResponse = await fetch('http://localhost:3002/health');
    console.log(`📊 Status: ${healthResponse.status} ${healthResponse.statusText}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Success! Data received:');
      console.log(JSON.stringify(healthData, null, 2));
    } else {
      const errorText = await healthResponse.text();
      console.log('❌ Health Error response:');
      console.log(errorText);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testApplicationsAPI();
