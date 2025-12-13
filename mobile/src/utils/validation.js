export const validateEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const getPasswordStrength = (password) => {
  if (password.length === 0) return 0;
  
  let strength = 0;
  
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  return Math.min(strength, 4);
};

export const getPasswordStrengthText = (strength) => {
  switch (strength) {
    case 0:
      return 'Очень слабый';
    case 1:
      return 'Слабый';
    case 2:
      return 'Средний';
    case 3:
      return 'Сильный';
    case 4:
      return 'Очень сильный';
    default:
      return '';
  }
};

export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 0:
    case 1:
      return '#EF4444';
    case 2:
      return '#F59E0B';
    case 3:
    case 4:
      return '#10B981';
    default:
      return '#E2E8F0';
  }
};