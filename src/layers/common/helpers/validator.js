const calc = (string, size) => {
  let sum = 0;

  for (let j = 0; j < size; ++j) {
    sum += Number(string.toString().charAt(j)) * (size + 1 - j);
  }

  const lastSumChecker = sum % 11;

  return lastSumChecker < 2 ? 0 : 11 - lastSumChecker;
};

const validateDocumentNumber = ( documentNumber ) => {
  if (documentNumber.length == 11) {
    return validateCpf(documentNumber);
  } else if (documentNumber.length == 14) {
    return validateCnpj(documentNumber);
  }
};

const validateCpf = documentNumber => {
  if (!documentNumber || documentNumber.length !== 11) return false;
  const firstNineDigits = documentNumber.substring(0, 9);
  const checker = documentNumber.substring(9, 11);

  for (let i = 0; i < 10; i++) {
    if (`${firstNineDigits}${checker}` === Array(12).join(String(i))) {
      return false;
    }
  }

  const checker1 = calc(firstNineDigits, 9);
  const checker2 = calc(`${firstNineDigits}${checker1}`, 10);

  return checker.toString() === checker1.toString() + checker2.toString();
};

const calcCnpj = (number, documentNumber) => {
  const string = documentNumber.substring(0, number);
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

const validateCnpj = documentNumber => {
  if (!documentNumber || documentNumber.length !== 14) return false;

  if (/^(\d)\1+$/.test(documentNumber)) return false;

  let numbers = documentNumber.length - 2;
  let string = documentNumber.substring(numbers);
  let checker1 = +string.charAt(0);
  let checker2 = +string.charAt(1);

  return calcCnpj(numbers, documentNumber) === checker1 && calcCnpj(numbers + 1, documentNumber) === checker2;
};

module.exports = { validateCpf, validateCnpj, validateDocumentNumber };
