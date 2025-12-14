import { Audio } from 'expo-av';

class AudioService {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
  }

  async playSound(audioFile) {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        audioFile,
        { shouldPlay: true }
      );

      this.sound = sound;
      this.isPlaying = true;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          this.isPlaying = false;
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
      throw error;
    }
  }

  async stopSound() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  }

  async pauseSound() {
    try {
      if (this.sound && this.isPlaying) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  }

  async resumeSound() {
    try {
      if (this.sound && !this.isPlaying) {
        await this.sound.playAsync();
        this.isPlaying = true;
      }
    } catch (error) {
      console.error('Error resuming sound:', error);
    }
  }

  async cleanup() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Error cleaning up sound:', error);
    }
  }
}

export default new AudioService();