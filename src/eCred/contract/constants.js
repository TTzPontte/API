const INCOME_SOURCES = [
  'Agricultor',
  'Outros',
  'Aposentado',
  'Assalariado',
  'Autônomo',
  'Empresário',
  'Funcionário Público',
  'Pensionista',
  'Profissional Liberal',
  'Servidor Doméstico'
];

const PHONE_REG_EXP = /^(\+\d{2}\d{2})(\d{4,5}\d{4})$/;

module.exports = { PHONE_REG_EXP, INCOME_SOURCES };
