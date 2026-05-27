const axios = require('axios');

const API_URL = 'http://192.168.105.30:5000/api';

async function testConnection() {
  console.log('🧪 Testing connection to Railway...\n');
  
  console.log('1️⃣ Testing /api/health...');
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/api/health`);
    console.log('✅ Server is healthy:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return;
  }
  
  console.log('\n2️⃣ Testing /api/subscription/plans...');
  try {
    const response = await axios.get(`${API_URL}/subscription/plans`);
    console.log('✅ Plans loaded:', response.data.plans.length, 'plans');
  } catch (error) {
    console.error('❌ Plans failed:', error.message);
  }
  
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
    const userId = response.data.user.id;
    
    console.log('\n⏳ Waiting 2 seconds for MongoDB...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n4️⃣ Testing profile...');
    try {
      const profileResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile loaded:', {
        email: profileResponse.data.user.email,
        hasOnboardingData: !!profileResponse.data.user.onboardingData,
        selectedLanguage: profileResponse.data.user.onboardingData?.selectedLanguage
      });
    } catch (error) {
      console.error('❌ Profile failed:', error.response?.data || error.message);
    }
    
    console.log('\n5️⃣ Testing language progress for Английский...');
    try {
      const langProgressResponse = await axios.get(`${API_URL}/progress/Английский`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Language progress loaded:', {
        language: langProgressResponse.data.progress.language,
        currentLevel: langProgressResponse.data.progress.currentLevel,
        completedLessons: langProgressResponse.data.progress.totalLessonsCompleted,
        _id: langProgressResponse.data.progress._id
      });
    } catch (error) {
      console.error('❌ Language progress failed:', error.response?.data || error.message);
    }
    
    console.log('\n6️⃣ Testing all progress...');
    try {
      const progressResponse = await axios.get(`${API_URL}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Progress loaded:', progressResponse.data.progress.length, 'languages');
      if (progressResponse.data.progress.length > 0) {
        console.log('First language:', {
          language: progressResponse.data.progress[0].language,
          currentLevel: progressResponse.data.progress[0].currentLevel
        });
      } else {
        console.warn('⚠️ Progress array is empty!');
      }
    } catch (error) {
      console.error('❌ Progress failed:', error.response?.data || error.message);
    }

    console.log('\n7️⃣ Testing overall stats...');
    try {
      const statsResponse = await axios.get(`${API_URL}/progress/stats/overall`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Stats loaded:', {
        totalLanguages: statsResponse.data.stats.totalLanguages,
        totalLessons: statsResponse.data.stats.totalLessonsCompleted,
        languages: statsResponse.data.stats.languages.map(l => ({
          name: l.language,
          level: l.currentLevel,
          lessons: l.lessonsCompleted
        }))
      });
    } catch (error) {
      console.error('❌ Stats failed:', error.response?.data || error.message);
    }
    

    console.log('\n8️⃣ Testing lessons for Английский...');
    try {
      const lessonsResponse = await axios.get(`${API_URL}/lessons/Английский`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Lessons loaded:', lessonsResponse.data.lessons.length, 'lessons');
      if (lessonsResponse.data.lessons.length > 0) {
        console.log('First lesson:', {
          number: lessonsResponse.data.lessons[0].lessonNumber,
          title: lessonsResponse.data.lessons[0].title,
          level: lessonsResponse.data.lessons[0].level
        });
      }
    } catch (error) {
      console.error('❌ Lessons failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
  }
  
  console.log('\n🏁 Test completed!');
}

testConnection();