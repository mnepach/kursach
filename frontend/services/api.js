const API_URL = 'http://192.168.8.11:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
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
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка сервера');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    this.setToken(data.token);
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    this.setToken(data.token);
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

  logout() {
    this.clearToken();
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

  async getLevelTestLessons(language) {
    return await this.request(`/level-test-lessons/${language}`);
  }

  async getProgress() {
    return await this.request('/progress');
  }

  async getLanguageProgress(language) {
    return await this.request(`/progress/${language}`);
  }

  async completeLesson(language, lessonId, score) {
    return await this.request(`/progress/${language}/complete`, {
      method: 'POST',
      body: JSON.stringify({ lessonId, score })
    });
  }

  async getOverallStats() {
    return await this.request('/progress/stats/overall');
  }
}

const api = new ApiService();