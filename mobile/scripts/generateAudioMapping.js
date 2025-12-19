const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '..', 'assets', 'audio');

if (!fs.existsSync(audioDir)) {
  console.error(`❌ Директория не найдена: ${audioDir}`);
  console.log('💡 Создайте папку: mobile/assets/audio/');
  process.exit(1);
}

const audioFiles = fs.readdirSync(audioDir)
  .filter(file => file.endsWith('.mp3'))
  .sort();

console.log(`✅ Найдено ${audioFiles.length} аудио файлов:\n`);
audioFiles.forEach(file => console.log(`   - ${file}`));

const audioFilesCode = `// Mapping audio file names to actual asset imports
// Автоматически сгенерировано на основе файлов в mobile/assets/audio/
// Дата генерации: ${new Date().toLocaleString('ru-RU')}

const AUDIO_FILES = {
${audioFiles.map(file => `  '${file}': require('../../assets/audio/${file}'),`).join('\n')}
};

export const getAudioFile = (fileName) => {
  if (!fileName) {
    console.warn('No audio file name provided');
    return null;
  }
  
  const audioFile = AUDIO_FILES[fileName];
  
  if (!audioFile) {
    console.warn(\`Audio file not found: \${fileName}. Please add it to assets/audio/ folder.\`);
    return null;
  }
  
  return audioFile;
};

export const getAvailableAudioFiles = () => Object.keys(AUDIO_FILES);

export default AUDIO_FILES;
`;

const outputPath = path.join(__dirname, '..', 'src', 'constants', 'audioFiles.js');
fs.writeFileSync(outputPath, audioFilesCode, 'utf8');

console.log(`\n✅ Файл сгенерирован: ${outputPath}`);
console.log('\n📝 Доступные файлы добавлены в AUDIO_FILES');
console.log('\n💡 Для использования в уроках укажите имя файла в поле "audio"');