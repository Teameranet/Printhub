async function testOrderAPI() {
  const baseURL = 'http://localhost:5000/api';
  
  console.log('🚀 Testing Order API...\n');

  // 1. Register a test user
  console.log('1️⃣  Creating test user...');
  let authToken = '';
  let userEmail = '';
  
  try {
    const response = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Order Test',
        email: `order-test-${Date.now()}@test.com`,
        password: 'testpass123',
        phone: '9876543210'
      })
    });
    const data = await response.json();
    if (data.success) {
      authToken = data.token;
      userEmail = data.user.email;
      console.log('✅ User created:', userEmail);
      console.log('   Token:', authToken.substring(0, 20) + '...\n');
    } else {
      console.log('❌ Error:', data.message);
      return;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return;
  }

  // 2. Create an order
  console.log('2️⃣  Creating test order...');
  try {
    const orderData = {
      items: [
        {
          name: 'Test Document.pdf',
          pages: 25,
          copies: 2,
          printColor: 'Black & White',
          printSide: 'Double Sided',
          bindingType: 'Spiral Binding',
          price: 250
        },
        {
          name: 'Report.docx',
          pages: 15,
          copies: 1,
          printColor: 'Full Color',
          printSide: 'Single Sided',
          bindingType: 'No Binding',
          price: 150
        }
      ],
      userDetails: {
        fullName: 'John Doe',
        email: userEmail,
        mobile: '9876543210'
      },
      deliveryType: 'delivery',
      deliveryDetails: {
        address: '123 Main Street, Apartment 4B, New York',
        pincode: '400001'
      },
      pricing: {
        subtotal: 400,
        deliveryCharge: 40,
        tax: 44,
        discount: 0,
        total: 484
      },
      payment: {
        method: 'online',
        status: 'pending'
      },
      notes: 'Urgent order - needed for presentation'
    };

    const response = await fetch(`${baseURL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(orderData)
    });
    const data = await response.json();
    if (data.success) {
      console.log('✅ Order created successfully!');
      console.log('   Order ID:', data.data.orderId);
      console.log('   Status:', data.data.status);
      console.log('   Total: ₹' + data.data.pricing.total);
      console.log('   Items:', data.data.items.length + '\n');
    } else {
      console.log('❌ Error:', data.message);
      return;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return;
  }

  // 3. Get user's orders
  console.log('3️⃣  Fetching user orders...');
  try {
    const response = await fetch(`${baseURL}/orders`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    if (data.success) {
      console.log('✅ Orders retrieved!');
      console.log('   Total Orders:', data.pagination.total);
      if (data.data.length > 0) {
        console.log('\n   📋 Latest Order:');
        console.log('   Order ID:', data.data[0].orderId);
        console.log('   Status:', data.data[0].status);
        console.log('   Customer:', data.data[0].userDetails.fullName);
        console.log('   Type:', data.data[0].deliveryType);
      }
    } else {
      console.log('❌ Error:', data.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n✅ Order API tests complete!');
  process.exit(0);
}

testOrderAPI().catch(console.error);
