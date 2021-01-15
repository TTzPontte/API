const MIN_LOAN_VALUE = 30000;
const MAX_LOAN_VALUE = 5000000;
const MIN_PROPERTY_VALUE = 200000;
const MIN_AGE = 18;
const MAX_AGE = 75;

const PROPERTY_AGE = ['<=2', '3-5', '6-10', '11-20', '21-30', '31-40', '41-50', '>=51'];

const BEDROOMS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const SUITES = ['0', ...BEDROOMS];

const suitesOptions = bedrooms => SUITES.slice(0, bedrooms + 1);

const GARAGES = ['1', '2', '3', '4', '5+'];

const EDUCATION_LEVELS = {
  INCOMPLETE_ELEMENTARY_SCHOOL: 'ENSINO FUNDAMENTAL INCOMPLETO',
  ELEMENTARY_SCHOOL: 'ENSINO FUNDAMENTAL COMPLETO',
  INCOMPLETE_HIGHSCHOOL: 'ENSINO MÉDIO INCOMPLETO',
  HIGHSCHOOL: 'ENSINO MÉDIO COMPLETO',
  INCOMPLETE_COLLEGE: 'ENSINO SUPERIOR INCOMPLETO',
  COLLEGE: 'ENSINO SUPERIOR COMPLETO'
};

const INCOME_SOURCES = {
  SALARIED: 'ASSALARIADO',
  INDEPENDENT: 'AUTONOMO',
  PUBLIC_EMPLOYEE: 'PÚBLICO'
};

const RESIDENTS = {
  THIRD_PARTIES: 'Terceiros',
  OWN: 'Próprio'
};

const PERSONAS = {
  mother: 'Mãe',
  child: 'Filho ou Filha',
  spouse: 'Cônjuge',
  sibling: 'Irmão ou Irmã',
  father: 'Pai'
};

const LOAN_MOTIVATION = {
  PAY_OFF_DEBTS: 'Quitar dívidas',
  OPEN_OWN_BUSINESS: 'Abrir o meu negócio',
  FUND_STUDIES: 'Financiar meus estudos',
  INVESTING_OWN_BUSINESS: 'Investir no meu negócio',
  RENOVATE_HOUSE: 'Reformar a minha casa',
  CORONA_VIRUS: 'Imprevisto com coronavírus',
  PAY_MARRIAGE: 'Pagar meu casamento',
  ANOTHER_REASON: 'Outro Motivo',
  JUST_CURIOSITY: 'Apenas curiosidade'
};

const MARITAL_STATUS = {
  MARRIED: 'CASADO',
  REGISTERED_STABLE_UNION: 'UNIÃO ESTÁVEL REGISTRADA',
  NOT_REGISTERED_STABLE_UNION: 'UNIÃO ESTÁVEL NÃO REGISTRADA',
  SINGLE: 'SOLTEIRO',
  DIVORCED: 'DIVORCIADO',
  WIDOWER: 'VIÚVO'
};

const PROPERTY_TYPES = {
  APARTMENT: 'Apartamento',
  HOME: 'Casa',
  BUILDING: 'Comercial'
};

const PHONE_REG_EXP = /^(\+\d{2}\d{2})(\d{4,5}\d{4})$/;

const TERMS = [60, 90, 120, 150, 180, 210, 240];

const GRACE_PERIOD = [0, 1, 3, 6];

module.exports = {
  MIN_LOAN_VALUE,
  MIN_PROPERTY_VALUE,
  MIN_AGE,
  MAX_AGE,
  LOAN_MOTIVATION,
  TERMS,
  GRACE_PERIOD,
  MAX_LOAN_VALUE,
  PHONE_REG_EXP,
  MARITAL_STATUS,
  PROPERTY_TYPES,
  PROPERTY_AGE,
  BEDROOMS,
  RESIDENTS,
  PERSONAS,
  GARAGES,
  suitesOptions,
  INCOME_SOURCES,
  EDUCATION_LEVELS
};
