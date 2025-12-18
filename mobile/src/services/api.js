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
  }

  async setToken(token) {
    this.token = token;
    await storage.setToken(token);
  }

  async clearToken() {
    this.token = null;
    await storage.removeToken();
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await axios({
        url: `${API_URL}${endpoint}`,
        method: options.method || 'GET',
        headers,
        data: options.body ? JSON.parse(options.body) : undefined
      });

      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Ошибка сервера');
      }
      throw error;
    }
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    await this.setToken(data.token);
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    await this.setToken(data.token);
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
    return await this.request('/auth/me');
  }

  async updateProfile(updates) {
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
    return await this.request('/progress');
  }

  async getLanguageProgress(language) {
    return await this.request(`/progress/${language}`);
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
    return await this.request('/progress/stats/overall');
  }
}

export default new ApiService();