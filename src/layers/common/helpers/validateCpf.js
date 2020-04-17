const calc = (string, size) => {
  let sum = 0;

  for (let j = 0; j < size; ++j) {
    sum += Number(string.toString().charAt(j)) * (size + 1 - j);
  }

  const lastSumChecker = sum % 11;

  return lastSumChecker < 2 ? 0 : 11 - lastSumChecker;
};

const validateCpf = cpf => {
  const firstNineDigits = cpf.substring(0, 9);
  const checker = cpf.substring(9, 11);

  if (cpf.length !== 11) {
    return false;
  }

  for (let i = 0; i < 10; i++) {
    if (`${firstNineDigits}${checker}` === Array(12).join(String(i))) {
      return false;
    }
  }

  const checker1 = calc(firstNineDigits, 9);
  const checker2 = calc(`${firstNineDigits}${checker1}`, 10);

  return checker.toString() === checker1.toString() + checker2.toString();
};

module.exports = validateCpf;
