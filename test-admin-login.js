const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login for admin123@gmail.com...\n');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin123@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ Login Successful!');
    console.log('📧 Email:', response.data.user.email);
    console.log('👤 Username:', response.data.user.username);
    console.log('🔑 Admin Status:', response.data.user.isAdmin);
    console.log('🎫 Token:', response.data.token ? 'Generated' : 'Missing');
    console.log('📝 Message:', response.data.message);
    
    if (response.data.user.isAdmin) {
      console.log('\n🎉 Admin dashboard access should work now!');
      console.log('🔗 Try accessing: http://localhost:3000/admin');
    }
    
  } catch (error) {
    console.error('❌ Login Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
      console.error('Details:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');
  
  try {
    const response = await axios.get(`${API_BASE}/hotels/test-db`);
    console.log('✅ Database Connected!');
    console.log('📊 Total hotels:', response.data.hotels.count);
    console.log('🏨 Database status:', response.data.database.status);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. MongoDB is running');
    console.log('   2. Backend server is running (npm run dev)');
  }
}

async function runTests() {
  console.log('🚀 EasyStay Admin Login Test\n');
  console.log('=' * 50);
  
  await testDatabaseConnection();
  console.log('\n' + '-' * 50 + '\n');
  await testAdminLogin();
}

runTests().catch(console.error);