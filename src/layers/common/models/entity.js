const { Schema } = require('dynamoose');
const { v4: uuid } = require('uuid');
const Dynamoose = require('../aws/dynamoose');

const { ENV } = process.env;

const SCR_OPERATION_ITEM_CATEGORY_SUB = {
  category: {
    category_code: Number,
    category_description: String
  },
  category_sub_code: String,
  description: String
};

const SCR_OPERATION_ITEM_DUE_TYPE = {
  description: String,
  due_code: Number,
  due_type_group: String
};

const SCR_OPERATION_ITEM = {
  category_sub: SCR_OPERATION_ITEM_CATEGORY_SUB,
  due_type: SCR_OPERATION_ITEM_DUE_TYPE,
  due_value: Number,
  exchange_variation: String
};

const SCR_SCR_DATA_ERROR = {
  description: String,
  error_code: Number,
  error_type: String
};

const SCR_SCR_DATA = {
  assumed_coobligation: Number,
  disagreement_operation_count: Number,
  disagreement_operation_value: Number,
  error: SCR_SCR_DATA_ERROR,
  financial_institution_count: Number,
  indirect_risk: Number,
  operation_count: Number,
  operation_items: [SCR_OPERATION_ITEM],
  receive_coobligation: Number,
  reference_date: String,
  start_relationship: String,
  subjudice_operations_count: Number,
  subjudice_operations_value: Number
};

const SCR_SIGNERS = {
  document_number: String,
  email: String,
  name: String
};

const SCR = {
  consent_term: String,
  consulted_at: String,
  created_at: String,
  origin_key: String,
  report_end_date: String,
  report_start_date: String,
  requester_person_key: String,
  result_document: String,
  scr_data: [SCR_SCR_DATA],
  scr_key: String,
  scr_status: String,
  signed_at: String,
  signers: [SCR_SIGNERS],
  subject_document_number: String,
  subject_name: String,
  subject_person_type: String
};

const EntitySchema = new Schema({
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
  description: String,
  scr: SCR
});

module.exports = Dynamoose.model(`Entity.${ENV}`, EntitySchema);
