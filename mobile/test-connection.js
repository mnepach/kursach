const axios = require('axios');

const API_URL = 'https://linguaplay-production.up.railway.app/api';

async function testConnection() {
  console.log('🧪 Testing connection to Railway...\n');
  
  // Тест 1: Проверка здоровья сервера
  console.log('1️⃣ Testing /api/health...');
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/api/health`);
    console.log('✅ Server is healthy:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return;
  }
  
  // Тест 2: Получение планов подписки
  console.log('\n2️⃣ Testing /api/subscription/plans...');
  try {
    const response = await axios.get(`${API_URL}/subscription/plans`);
    console.log('✅ Plans loaded:', response.data.plans.length, 'plans');
  } catch (error) {
    console.error('❌ Plans failed:', error.message);
  }
  
  // Тест 3: Регистрация тестового пользователя
  console.log('\n3️⃣ Testing registration...');
  const testEmail = `test${Date.now()}@test.com`;
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: testEmail,
      password: 'test123',
      onboardingData: {
        selectedLanguage: {
          id: 'english',
          name: 'Английский'
        }
      },
      selectedPlan: 'free'
    });
    console.log('✅ Registration successful!');
    console.log('User:', response.data.user.email);
    console.log('Token:', response.data.token ? 'received' : 'missing');
    
    const token = response.data.token;
    
    // Тест 4: Получение прогресса
    console.log('\n4️⃣ Testing progress...');
    try {
      const progressResponse = await axios.get(`${API_URL}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Progress loaded:', progressResponse.data.progress.length, 'languages');
    } catch (error) {
      console.error('❌ Progress failed:', error.response?.data || error.message);
    }
    
    // Тест 5: Получение общей статистики
    console.log('\n5️⃣ Testing overall stats...');
    try {
      const statsResponse = await axios.get(`${API_URL}/progress/stats/overall`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Stats loaded:', statsResponse.data.stats);
    } catch (error) {
      console.error('❌ Stats failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
  }
  
  console.log('\n🏁 Test completed!');
}

testConnection();