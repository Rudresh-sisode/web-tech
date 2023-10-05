export const generatePassword = (length: number = 8): string => {
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const allChars = uppercaseLetters + lowercaseLetters + numbers;

  let password = '';
  password += getRandomChar(uppercaseLetters);
  password += getRandomChar(lowercaseLetters);
  password += getRandomChar(numbers);

  for (let i = 0; i < length - 3; i++) {
    password += getRandomChar(allChars);
  }

  password = shuffleString(password);

  return password;
};

const getRandomChar = (charSet: string): string => {
  const randomIndex = Math.floor(Math.random() * charSet.length);
  return charSet[randomIndex];
};

const shuffleString = (str: string): string => {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
};