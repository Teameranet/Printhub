// Test Registration API
import http from 'http';

const registrationData = JSON.stringify({
  name: 'John Doe',
  email: 'john@printhub.com',
  password: 'Test@12345',
  phone: '9876543210'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': registrationData.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n--- RESPONSE ---');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error(`ERROR: ${error.message}`);
});

console.log('📤 Sending registration request...\n');
req.write(registrationData);
req.end();
