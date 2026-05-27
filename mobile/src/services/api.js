import axios from 'axios';
import storage from './storage';

const API_URL = 'http://192.168.105.30:5000/api';

class ApiService {
  constructor() {
    this.token = null;
    this.initToken();
  }

  async initToken() {
    this.token = await storage.getToken();
    console.log('🔑 Token initialized:', this.token ? 'exists' : 'not found');
  }

  async setToken(token) {
    this.token = token;
    await storage.setToken(token);
    console.log('🔑 Token saved');
  }

  async clearToken() {
    this.token = null;
    await storage.removeToken();
    console.log('🔑 Token cleared');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = `${API_URL}${endpoint}`;
    console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await axios({
        url,
        method: options.method || 'GET',
        headers,
        data: options.body ? JSON.parse(options.body) : undefined,
        timeout: 10000 
      });

      console.log(`✅ API Success: ${endpoint}`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Превышено время ожидания. Проверьте подключение к интернету.');
      }
      
      if (!error.response) {
        throw new Error('Не удалось подключиться к серверу. Проверьте интернет-соединение.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Ошибка сервера');
      }
      throw error;
    }
  }

  async register(userData) {
    console.log('📝 Registering user:', { email: userData.email, name: userData.name });
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    await this.setToken(data.token);
    console.log('✅ Registration successful, user:', data.user);
    return data;
  }

  async login(credentials) {
    console.log('🔐 Logging in:', credentials.email);
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    await this.setToken(data.token);
    console.log('✅ Login successful, user:', data.user);
    return data;
  }

  async forgotPassword(email) {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(token, password) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  }

  async getProfile() {
    console.log('👤 Getting profile...');
    const data = await this.request('/auth/me');
    console.log('✅ Profile loaded:', data.user);
    return data;
  }

  async updateProfile(updates) {
    console.log('📝 Updating profile:', updates);
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async logout() {
    await this.clearToken();
  }

  async getPlans() {
    return await this.request('/subscription/plans');
  }

  async getCurrentSubscription() {
    return await this.request('/subscription/current');
  }

  async upgradeSubscription(planType, paymentMethod) {
    return await this.request('/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planType, paymentMethod })
    });
  }

  async cancelSubscription() {
    return await this.request('/subscription/cancel', {
      method: 'POST'
    });
  }

  async getLessons(language, level = null) {
    const query = level ? `?level=${level}` : '';
    console.log(`📚 Getting lessons for ${language}${query}`);
    return await this.request(`/lessons/${language}${query}`);
  }

  async getLesson(language, lessonNumber) {
    return await this.request(`/lessons/${language}/${lessonNumber}`);
  }

  async getLevels(language) {
    return await this.request(`/lessons/${language}/levels`);
  }

  async getBeginnerLessons(language) {
    return await this.request(`/beginner-lessons/${language}`);
  }

  async getProgress() {
    console.log('📊 Getting all progress...');
    const data = await this.request('/progress');
    console.log('✅ Progress loaded:', data.progress);
    return data;
  }

  async getLanguageProgress(language) {
    console.log(`📊 Getting progress for ${language}...`);
    const data = await this.request(`/progress/${language}`);
    console.log('✅ Language progress loaded:', data.progress);
    return data;
  }

  async completeLesson(language, lessonId, score, lessonNumber, level) {
    return await this.request(`/progress/${language}/complete`, {
      method: 'POST',
      body: JSON.stringify({ 
        lessonId, 
        score,
        lessonNumber,
        level
      })
    });
  }

  async getOverallStats() {
    console.log('📈 Getting overall stats...');
    const data = await this.request('/progress/stats/overall');
    console.log('✅ Overall stats loaded:', data.stats);
    return data;
  }
}

export default new ApiService();