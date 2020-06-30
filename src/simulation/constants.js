const MIN_LOAN_VALUE = 30000;
const MAX_LOAN_VALUE = 5000000;
const MIN_PROPERTY_VALUE = 200000;
const MIN_AGE = 18;
const MAX_AGE = 75;

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
  PHONE_REG_EXP
};
