const faker = require('faker');

const CognitoService = require('common/services/cognito.service');

describe('create user', () => {
  let dataMock = {
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    cpf: faker.random.number(),
    trackCode: faker.random.uuid(),
    simulationId: faker.random.uuid(),
    loanValue: faker.random.number(),
    term: faker.random.number(),
    installment: faker.random.number(),
    loanValueSelected: faker.random.number()
  };

  describe('send a valid payload', () => {
    it('create a new user and request a new password', async () => {
      const adminCreateUserSpy = jest.spyOn(CognitoService, 'adminCreateUser');

      await CognitoService.createUser(dataMock);
      expect(adminCreateUserSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('request new temporary password', () => {
  describe('send a valid username', () => {
    it('will not fail', async () => {
      const username = faker.random.word();
      const adminCreateUserSpy = jest.spyOn(CognitoService, 'adminCreateUser');

      await CognitoService.requestNewTemporaryPassword(username);
      expect(adminCreateUserSpy).toHaveBeenCalledTimes(1);
    });
  });
});
