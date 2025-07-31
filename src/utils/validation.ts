export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Mínimo 8 caracteres
  return password.length >= 8;
}

export function validateRFC(rfc: string): boolean {
  const rfcRegex = /^[A-ZÑ&]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/;
  return rfcRegex.test(rfc.toUpperCase());
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+52\s?)?([1-9]\d{9})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

export function validateMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

export function validateNumber(value: string): boolean {
  return !isNaN(Number(value)) && Number(value) >= 0;
}

export function validatePositiveNumber(value: string): boolean {
  return !isNaN(Number(value)) && Number(value) > 0;
}

export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
