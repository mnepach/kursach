export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatTime = (date) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getDaysDifference = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

export const truncateString = (str, maxLength) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getInitials = (name) => {
  const names = name.split(' ');
  if (names.length >= 2) {
    return names[0].charAt(0) + names[1].charAt(0);
  }
  return names[0].charAt(0);
};

export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getStreakMessage = (streak) => {
  if (streak === 0) return 'Начните серию сегодня!';
  if (streak === 1) return 'Отличное начало!';
  if (streak < 7) return `${streak} дней подряд!`;
  if (streak < 30) return `${streak} дней! Продолжайте!`;
  return `${streak} дней! Невероятно!`;
};

export const getDeclension = (count, one, twoToFour, fiveAndMore) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return fiveAndMore;
  }
  if (lastDigit === 1) {
    return one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return twoToFour;
  }
  return fiveAndMore;
};

export const getLanguageDeclension = (count) => {
  return getDeclension(count, 'язык', 'языка', 'языков');
};

export const getLessonDeclension = (count) => {
  return getDeclension(count, 'урок', 'урока', 'уроков');
};

export const getWordDeclension = (count) => {
  return getDeclension(count, 'слово', 'слова', 'слов');
};

export const getDayDeclension = (count) => {
  return getDeclension(count, 'день', 'дня', 'дней');
};

export const getAchievementDeclension = (count) => {
  return getDeclension(count, 'достижение', 'достижения', 'достижений');
};