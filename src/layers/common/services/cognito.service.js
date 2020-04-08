const AWS = require('aws-sdk');
const httpErrors = require('http-errors');

const { COGNITO_USER_POOL_ID, COGNITO_REGION } = process.env;

const adminCreateUser = async params => {
  const client = new AWS.CognitoIdentityServiceProvider({
    region: COGNITO_REGION
  });

  const defaultParams = {
    UserPoolId: COGNITO_USER_POOL_ID,
    DesiredDeliveryMediums: ['EMAIL', 'SMS']
  };

  try {
    return await client.adminCreateUser({ ...defaultParams, ...params }).promise();
  } catch (err) {
    throw new httpErrors.BadRequest(err);
  }
};

const requestNewTemporaryPassword = async Username => {
  const params = {
    Username,
    MessageAction: 'RESEND'
  };

  return await CognitoService.adminCreateUser(params);
};

const buildAttributes = ({ email, cpf, phone }) => [
  { Name: 'email', Value: email },
  { Name: 'phone_number', Value: phone },
  { Name: 'custom:cpf', Value: cpf }
];

const buildValidationData = ({ trackCode, simulationId, loanValue, term, installment, loanValueSelected, phone }) => [
  { Name: 'trackCode', Value: trackCode },
  { Name: 'simulationId', Value: simulationId },
  { Name: 'loanValue', Value: loanValue },
  { Name: 'term', Value: term },
  { Name: 'installment', Value: installment },
  { Name: 'loanValueSelected', Value: loanValueSelected },
  { Name: 'phone', Value: phone }
];

const createUser = async data => {
  const UserAttributes = buildAttributes(data);
  const ValidationData = buildValidationData(data);

  const params = {
    Username: data.email,
    ForceAliasCreation: false,
    UserAttributes,
    ValidationData
  };

  return await CognitoService.adminCreateUser(params);
};

const CognitoService = {
  createUser,
  requestNewTemporaryPassword,
  adminCreateUser
};

module.exports = CognitoService;
