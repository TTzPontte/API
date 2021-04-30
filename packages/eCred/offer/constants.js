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

const PROPOSAL_STATUS = {
  CONCLUÍDO: 'released',
  NEGADO: 'declined'
};

module.exports = { INCOME_SOURCES, LOAN_MOTIVATION, PROPOSAL_STATUS };
