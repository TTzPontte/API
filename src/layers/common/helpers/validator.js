const calc = (string, size) => {
  let sum = 0;

  for (let j = 0; j < size; ++j) {
    sum += Number(string.toString().charAt(j)) * (size + 1 - j);
  }

  const lastSumChecker = sum % 11;

  return lastSumChecker < 2 ? 0 : 11 - lastSumChecker;
};

const validateCpf = cpf => {
  if (!cpf || cpf.length !== 11) return false;

  const firstNineDigits = cpf.substring(0, 9);
  const checker = cpf.substring(9, 11);

  for (let i = 0; i < 10; i++) {
    if (`${firstNineDigits}${checker}` === Array(12).join(String(i))) {
      return false;
    }
  }

  const checker1 = calc(firstNineDigits, 9);
  const checker2 = calc(`${firstNineDigits}${checker1}`, 10);
  return checker.toString() === checker1.toString() + checker2.toString();
};

const calcCnpj = (number, cnpj) => {
  const string = cnpj.substring(0, number);
  let sum = 0;
  let digits = number - 7;
  let checker = 0;

  for (let i = number; i >= 1; i--) {
    sum += string.charAt(number - i) * digits--;
    if (digits < 2) digits = 9;
  }

  checker = 11 - (sum % 11);
  return checker > 9 ? 0 : checker;
};

const validateCnpj = cnpj => {
  if (!cnpj || cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  let numbers = cnpj.length - 2;
  let string = cnpj.substring(numbers);
  let checker1 = +string.charAt(0);
  let checker2 = +string.charAt(1);

  return calcCnpj(numbers, cnpj) === checker1 && calcCnpj(numbers + 1, cnpj) === checker2;
};

module.exports = { validateCpf, validateCnpj };
