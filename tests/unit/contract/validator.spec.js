const { validate } = require('../../../src/contracts/validator');
const body = require('../../utils/contractBody');

describe('contract validator', () => {
  let data;
  beforeEach(() => {
    data = body();
  });

  describe('returns true when', () => {
    it('all data is correctly', async () => {
      expect(await validate(data)).toBeTruthy();
    });
  });

  describe('throws an error when', () => {
    describe('people', () => {
      describe('address', () => {
        it('is undefined', async () => {
          delete data.people.address;
          await expect(validate(data)).rejects.toThrow();
        });
        describe('cep', () => {
          it('is undefined', async () => {
            delete data.people.address.cep;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('city', () => {
          it('is undefined', async () => {
            delete data.people.address.city;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('neighborhood', () => {
          it('is undefined', async () => {
            delete data.people.address.neighborhood;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('number', () => {
          it('is undefined', async () => {
            delete data.people.address.number;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('state', () => {
          it('is undefined', async () => {
            delete data.people.address.state;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('streetAddress', () => {
          it('is undefined', async () => {
            delete data.people.address.streetAddress;
            await expect(validate(data)).rejects.toThrow();
          });
        });
      });

      describe('averageIncome', () => {
        it('is undefined', async () => {
          delete data.people.averageIncome;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a number', async () => {
          data.people.averageIncome = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('birth', () => {
        it('is undefined', async () => {
          delete data.people.birth;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a number', async () => {
          data.people.birth = '123123123';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('children', () => {
        it('is undefined', async () => {
          delete data.people.children;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.people.children = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });

        it('is not boolean', async () => {
          data.people.children = 'A';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('cnpj', () => {
        it('not a string', async () => {
          data.people.cnpj = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });

        it('has a length different from 14', async () => {
          data.people.cnpj = '2313213';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('cpf', () => {
        it('is undefined when cnpj is undefined', async () => {
          delete data.people.cpf;
          delete data.people.cnpj;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.people.cpf = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });

        it('has a length different from 11', async () => {
          data.people.cpf = '2313213';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('email', () => {
        it('is undefined', async () => {
          delete data.people.email;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.people.email = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a email', async () => {
          data.people.email = '2313213';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('incomeSource', () => {
        it('is undefined', async () => {
          delete data.people.incomeSource;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.people.incomeSource = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('incomeSourceActivity', () => {
        it('is undefined and cnpj exists', async () => {
          data.people.cnpj = '12345678912345';
          delete data.people.incomeSourceActivity;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.people.incomeSourceActivity = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('maritalStatus', () => {
        it('is undefined', async () => {
          delete data.people.maritalStatus;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is not a valid marital status', async () => {
          data.people.maritalStatus = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.people.maritalStatus = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('educationLevel', () => {
        it('is undefined', async () => {
          delete data.people.educationLevel;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is not a valid education level', async () => {
          data.people.educationLevel = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.people.educationLevel = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('secondPayer', () => {
        it('is undefined', async () => {
          delete data.people.secondPayer;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is not boolean', async () => {
          data.people.secondPayer = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.people.secondPayer = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });
      describe('liveInProperty', () => {
        it('is undefined', async () => {
          delete data.people.liveInProperty;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is not boolean', async () => {
          data.people.liveInProperty = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.people.liveInProperty = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('phone', () => {
        it('is undefined', async () => {
          delete data.people.phone;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is invalid', async () => {
          data.people.phone = '9859-9070';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.people.phone = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('Personas', () => {
        describe('secondPayer', () => {
          it('incomeSource is undefined', async () => {
            delete data.people.mother.incomeSource;
            await expect(validate(data)).rejects.toThrow();
          });
          it('averageIncome is undefined', async () => {
            delete data.people.mother.averageIncome;
            await expect(validate(data)).rejects.toThrow();
          });
        });

        describe('spouse', () => {
          it('is undefined', async () => {
            delete data.people.spouse;
            await expect(validate(data)).rejects.toThrow();
          });
        });
      });
    });

    describe('property', () => {
      describe('address', () => {
        it('is undefined', async () => {
          delete data.property.address;
          await expect(validate(data)).rejects.toThrow();
        });
        describe('cep', () => {
          it('is undefined', async () => {
            delete data.property.address.cep;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('city', () => {
          it('is undefined', async () => {
            delete data.property.address.city;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('neighborhood', () => {
          it('is undefined', async () => {
            delete data.property.address.neighborhood;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('number', () => {
          it('is undefined', async () => {
            delete data.property.address.number;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('state', () => {
          it('is undefined', async () => {
            delete data.property.address.state;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('streetAddress', () => {
          it('is undefined', async () => {
            delete data.property.address.streetAddress;
            await expect(validate(data)).rejects.toThrow();
          });
        });
      });

      describe('type', () => {
        it('is undefined', async () => {
          delete data.property.type;
          await expect(validate(data)).rejects.toThrow();
        });

        it('is not a valid type', async () => {
          data.property.type = 'al';
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.property.type = 123123123;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('floorArea', () => {
        it('is undefined', async () => {
          delete data.property.floorArea;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.property.floorArea = 123123123;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('age', () => {
        it('is undefined', async () => {
          delete data.property.age;
          await expect(validate(data)).rejects.toThrow();
        });

        it('is not a valid age', async () => {
          data.property.age = 'al';
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.property.age = 123123123;
          await expect(validate(data)).rejects.toThrow();
        });
      });
      describe('bedrooms', () => {
        it('is undefined', async () => {
          delete data.property.bedrooms;
          await expect(validate(data)).rejects.toThrow();
        });

        it('is not a valid bedrooms', async () => {
          data.property.bedrooms = 'al';
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.property.bedrooms = 123123123;
          await expect(validate(data)).rejects.toThrow();
        });
      });
      describe('suites', () => {
        it('is undefined', async () => {
          delete data.property.suites;
          await expect(validate(data)).rejects.toThrow();
        });

        it('is not a valid suites', async () => {
          data.property.suites = 'al';
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.property.suites = 123123123;
          await expect(validate(data)).rejects.toThrow();
        });
      });
      describe('isResident', () => {
        it('is undefined', async () => {
          delete data.property.isResident;
          await expect(validate(data)).rejects.toThrow();
        });

        it('is not a valid isResident', async () => {
          data.property.isResident = 'al';
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.property.isResident = 123123123;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('garages', () => {
        it('is undefined when type is Apartamento', async () => {
          delete data.property.garages;
          await expect(validate(data)).rejects.toThrow();
        });

        it('is not a valid garages', async () => {
          data.property.garages = 'al';
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.property.garages = 123123123;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('financed', () => {
        it('is undefined', async () => {
          delete data.property.financed;
          await expect(validate(data)).rejects.toThrow();
        });

        it('is not a valid financed', async () => {
          data.property.financed = 'al';
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.property.financed = 123123123;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('financingDebt', () => {
        it('is undefined when financed is true', async () => {
          delete data.property.financingDebt;
          data.property.financed = true;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.property.financingDebt = 123123123;
          data.property.financed = true;
          await expect(validate(data)).rejects.toThrow();
        });
      });
    });

    describe('whoIsSecondPayer', () => {
      it('is undefined when secondPayer is true', async () => {
        delete data.whoIsSecondPayer;
        delete data.people.secondPayer;

        await expect(validate(data)).rejects.toThrow();
      });

      it('is not a valid whoIsSecondPayer', async () => {
        data.whoIsSecondPayer = 'al';

        await expect(validate(data)).rejects.toThrow();
      });

      it('not a string', async () => {
        data.whoIsSecondPayer = 123123123;

        await expect(validate(data)).rejects.toThrow();
      });
    });

    describe('clientId', () => {
      it('is undefined', async () => {
        delete data.clientId;

        await expect(validate(data)).rejects.toThrow();
      });

      it('not a string', async () => {
        data.clientId = 123123123;

        await expect(validate(data)).rejects.toThrow();
      });
    });
  });
});
