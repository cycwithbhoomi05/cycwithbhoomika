export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[+]?[\d\s-]{10,15}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validatePrice = (price) => {
  const num = Number(price);
  if (isNaN(num) || num < 0) return 'Price must be a positive number';
  return null;
};

export const validateForm = (fields) => {
  const errors = {};
  Object.entries(fields).forEach(([key, { value, validators }]) => {
    for (const validator of validators) {
      const error = validator(value, key);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  });
  return errors;
};
