const { Schema } = require('dynamoose');
const { v4: uuid } = require('uuid');
const baseModel = require('./baseModel');
const Dynamoose = require('../aws/dynamooses');

const { ENV } = process.env;

const EntitySchema = new Schema(
  Object.assign({}, baseModel, {
    id: {
      type: String,
      hashKey: true,
      default: () => uuid()
    },
    documentNumber: String,
    email: String,
    contactEmail: String,
    type: String,
    accounts: [],
    phone: String,
    liveInProperty: String,
    relations: {
      type: 'list',
      list: [
        {
          type: 'map',
          map: {
            type: {
              type: 'list',
              list: [String]
            },
            participation: Number,
            id: String
          }
        }
      ]
    },
    address: {
      cep: String,
      city: String,
      complement: String,
      neighborhood: String,
      number: String,
      state: String,
      streetAddress: String
    },
    income: {
      type: 'list',
      list: [
        {
          type: 'map',
          map: {
            type: String,
            source: String,
            activity: String,
            value: Number,
            incomeOrigin: String,
            averageIncome: String
          }
        }
      ]
    },
    files: {
      type: 'list',
      list: [
        {
          type: 'map',
          map: {
            category: String,
            type: String,
            filename: String,
            id: String,
            size: Number,
            date: String
          }
        }
      ]
    },
    name: String,
    nickname: String,
    idWallCompanies: {
      type: 'list',
      list: [
        {
          cnpj: String,
          name: String,
          relationship: String
        }
      ]
    },
    documents: {
      type: 'list',
      list: [
        {
          type: 'map',
          map: {
            type: String,
            value: String
          }
        }
      ]
    },
    registry: [],
    about: {
      hasSiblings: Boolean,
      hasChild: Boolean,
      birthdate: String,
      educationLevel: String,
      maritalStatus: String,
      maritalRegime: String
    },
    description: String
  })
);

module.exports = Dynamoose.model(`Entity.${ENV}`, EntitySchema);
