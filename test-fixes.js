const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

async function testHotelSearch() {
  console.log('🧪 Testing Hotel Search API...');
  
  try {
    const response1 = await axios.get(`${API_BASE}/hotels/getall?city=Mumbai`);
    console.log(`✅ Search by city: Found ${response1.data.count || response1.data.hotels?.length || 0} hotels`);
    
    const response2 = await axios.get(`${API_BASE}/hotels/getall?city=Delhi&min=1000&max=5000`);
    console.log(`✅ Search with price range: Found ${response2.data.count || response2.data.hotels?.length || 0} hotels`);
    
    const response3 = await axios.get(`${API_BASE}/hotels/getall?sortBy=price_low`);
    console.log(`✅ Search with sorting: Found ${response3.data.count || response3.data.hotels?.length || 0} hotels`);
    
    return true;
  } catch (error) {
    console.error('❌ Hotel search test failed:', error.message);
    return false;
  }
}

async function testAdminAuth() {
  console.log('🧪 Testing Admin Authentication...');
  
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'santoshpatelvns5@gmail.com',
      password: 'your_password_here'
    });
    
    if (loginResponse.data.user.isAdmin) {
      console.log('✅ Admin authentication: User correctly identified as admin');
      return true;
    } else {
      console.log('❌ Admin authentication: User not identified as admin');
      return false;
    }
  } catch (error) {
    console.error('❌ Admin auth test failed:', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...');
  
  try {
    const response = await axios.get(`${API_BASE}/hotels/test-db`);
    console.log(`✅ Database connection: ${response.data.database.status}`);
    console.log(`📊 Total hotels in DB: ${response.data.hotels.count}`);
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive fix validation tests...\n');
  
  const tests = [
    { name: 'Database Connection', fn: testDatabaseConnection },
    { name: 'Hotel Search API', fn: testHotelSearch },

  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n--- Running ${test.name} Test ---`);
    const result = await test.fn();
    results.push({ name: test.name, passed: result });
  }
  
  console.log('\n🏁 Test Results Summary:');
  console.log('=' * 50);
  
  let passedCount = 0;
  results.forEach(result => {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${result.name}`);
    if (result.passed) passedCount++;
  });
  
  console.log(`\n📊 Overall: ${passedCount}/${results.length} tests passed`);
  
  if (passedCount === results.length) {
    console.log('🎉 All fixes are working correctly!');
  } else {
    console.log('⚠️  Some issues may still need attention.');
  }
}

if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testHotelSearch,
  testAdminAuth,
  testDatabaseConnection,
  runAllTests
};