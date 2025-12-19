const AUDIO_FILES = {
  'how_are_you.mp3': require('../../assets/audio/how_are_you.mp3'),
  'i_like_pizza.mp3': require('../../assets/audio/i_like_pizza.mp3'),
  'my_family.mp3': require('../../assets/audio/my_family.mp3'),
  'one_tea.mp3': require('../../assets/audio/one_tea.mp3'),
  'whats_your_name.mp3': require('../../assets/audio/whats_your_name.mp3'),
};

export const getAudioFile = (fileName) => {
  if (!fileName) {
    console.warn('No audio file name provided');
    return null;
  }
  
  const audioFile = AUDIO_FILES[fileName];
  
  if (!audioFile) {
    console.warn(`Audio file not found: ${fileName}. Please add it to AUDIO_FILES mapping.`);
    return null;
  }
  
  return audioFile;
};

export default AUDIO_FILES;