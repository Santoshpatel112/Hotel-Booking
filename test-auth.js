const axios = require('axios');

const baseURL = 'http://localhost:8000/api';

async function testAuth() {
  try {
    console.log('🧪 Testing authentication...');
    
    console.log('📝 Registering user...');
    const registerData = {
      username: 'testuser',
      email: 'ja@gmail.com',
      password: 'ja@123'
    };
    
    try {
      const registerResponse = await axios.post(`${baseURL}/auth/register`, registerData);
      console.log('✅ Registration successful:', registerResponse.data);
    } catch (registerError) {
      console.log('⚠️ Registration failed (user might already exist):', registerError.response?.data);
    }
    
    console.log('🔐 Attempting login...');
    const loginData = {
      email: 'ja@gmail.com',
      password: 'ja@123'
    };
    
    const loginResponse = await axios.post(`${baseURL}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();