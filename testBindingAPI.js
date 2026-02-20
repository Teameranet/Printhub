const http = require('http');

async function testAPI() {
  const baseURL = 'http://localhost:5000/api/binding';

  console.log('Testing Binding API Endpoints...\n');

  // Test 1: Get binding types
  console.log('1️⃣  Testing GET /api/binding/types');
  try {
    const res = await fetch(`${baseURL}/types`);
    const data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }

  // Test 2: Get binding prices
  console.log('\n2️⃣  Testing GET /api/binding/prices');
  try {
    const res = await fetch(`${baseURL}/prices`);
    const data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }

  // Test 3: Test price config calculation
  console.log('\n3️⃣  Testing GET /api/binding/price-config?bindingType=Spiral Binding&pageCount=10');
  try {
    const res = await fetch(`${baseURL}/price-config?bindingType=Spiral Binding&pageCount=10`);
    const data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('   Error:', error.message);
  }

  console.log('\n✅ Test complete!');
  process.exit(0);
}

testAPI().catch(console.error);
