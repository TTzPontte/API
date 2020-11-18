const { Schema } = require('dynamoose');
const Dynamoose = require('../aws/dynamoose');
const { v4: uuid } = require('uuid');
const baseModel = require('./baseModel');

const { ENV } = process.env;

const ContractsSchema = new Schema(
  Object.assign({}, baseModel, {
    id: {
      type: String,
      hashKey: true,
      default: () => uuid()
    },
    propertyId: String,
    contractManager: String,
    contractOwners: [
      {
        type: String
      }
    ],

    legalName: String,
    legalCNPJ: String,
    simulation: {
      parameters: {
        cep: String,
        email: String,
        age: Number,
        monthlyIncome: Number,
        propertyValue: Number,
        loanValue: Number,
        loanDate: String,
        cpf: String,
        skipMonth: Number,
        gracePeriod: Number,
        loanMotivation: [
          {
            type: String
          }
        ]
      },
      terms: {
        type: 'list',
        list: [Number]
      },
      installments: {
        type: 'list',
        list: [
          {
            type: 'list',
            list: [Number]
          }
        ]
      },
      lastInstallments: {
        type: 'list',
        list: [
          {
            type: 'list',
            list: [Number]
          }
        ]
      },
      ltv: {
        type: 'list',
        list: [
          {
            type: 'list',
            list: [Number]
          }
        ]
      },
      ltvMax: {
        type: 'list',
        list: [
          {
            type: 'list',
            list: [Number]
          }
        ]
      },
      cet: {
        type: 'list',
        list: [
          {
            type: 'list',
            list: [Number]
          }
        ]
      },
      loanValuesGross: [
        {
          type: Number
        }
      ],
      date: Date,
      installment: Number,
      loanValueSelected: Number,
      term: Number
    },
    makeUpIncome: [
      {
        peopleId: String,
        type: String
      }
    ],
    campaign: String,
    source: String,
    pendencies: {},
    contractPeople: [
      {
        id: String,
        role: String
      }
    ],
    secondPayers: [
      {
        type: String
      }
    ],
    clientId: String,
    trackCode: String
  })
);

module.exports = Dynamoose.model(`Contract.${ENV}`, ContractsSchema, {
  create: false,
  update: false
});
