const MARITAL_STATUS = ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'UNIÃO ESTÁVEL REGISTRADA', 'UNIÃO ESTÁVEL SEM REGISTRO', 'VIÚVO'];
const EDUCATION_LEVELS = [
  'ENSINO FUNDAMENTAL INCOMPLETO',
  'ENSINO FUNDAMENTAL COMPLETO',
  'ENSINO MÉDIO INCOMPLETO',
  'ENSINO MÉDIO COMPLETO',
  'ENSINO SUPERIOR INCOMPLETO',
  'ENSINO SUPERIOR COMPLETO'
];
const PROPERTY_TYPES = ['Apartamento', 'Casa', 'Comercial'];
const PROPERTY_AGE = ['<=2', '3-5', '6-10', '11-20', '21-30', '31-40', '41-50', '>=51'];
const BEDROOMS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const SUITES = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
const PERSONAS_PT = ['Mãe', 'Filho ou Filha', 'Cônjuge', 'Irmão ou Irmã', 'Pai'];
const PERSONAS = ['mother', 'child', 'spouse', 'father', 'sibling'];
const OWNERS = ['Mãe', 'Pai', 'Filho ou Filha', 'outros'];
const GARAGES = ['1', '2', '3', '4', '5+'];
const suitesOptions = bedrooms => SUITES.slice(0, bedrooms + 1);

module.exports = { MARITAL_STATUS, EDUCATION_LEVELS, PROPERTY_TYPES, PROPERTY_AGE, BEDROOMS, suitesOptions, OWNERS, PERSONAS, GARAGES, PERSONAS_PT };
