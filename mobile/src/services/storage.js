import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  async setItem(key, value) {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  }

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      throw error;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw error;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async setToken(token) {
    await this.setItem('token', token);
  }

  async getToken() {
    return await this.getItem('token');
  }

  async removeToken() {
    await this.removeItem('token');
  }

  async setUser(user) {
    await this.setItem('user', user);
  }

  async getUser() {
    return await this.getItem('user');
  }

  async removeUser() {
    await this.removeItem('user');
  }
}

export default new StorageService();