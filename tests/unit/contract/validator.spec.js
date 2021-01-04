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
    describe('entity', () => {
      describe('address', () => {
        it('is undefined', async () => {
          delete data.entity.address;
          await expect(validate(data)).rejects.toThrow();
        });
        describe('cep', () => {
          it('is undefined', async () => {
            delete data.entity.address.cep;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('city', () => {
          it('is undefined', async () => {
            delete data.entity.address.city;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('neighborhood', () => {
          it('is undefined', async () => {
            delete data.entity.address.neighborhood;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('number', () => {
          it('is undefined', async () => {
            delete data.entity.address.number;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('state', () => {
          it('is undefined', async () => {
            delete data.entity.address.state;
            await expect(validate(data)).rejects.toThrow();
          });
        });
        describe('streetAddress', () => {
          it('is undefined', async () => {
            delete data.entity.address.streetAddress;
            await expect(validate(data)).rejects.toThrow();
          });
        });
      });

      describe('averageIncome', () => {
        it('is undefined', async () => {
          delete data.entity.averageIncome;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a number', async () => {
          data.entity.averageIncome = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('birth', () => {
        it('is undefined', async () => {
          delete data.entity.birth;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a number', async () => {
          data.entity.birth = '123123123';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('children', () => {
        it('is undefined', async () => {
          delete data.entity.children;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.entity.children = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });

        it('is not boolean', async () => {
          data.entity.children = 'A';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('cnpj', () => {
        it('not a string', async () => {
          data.entity.cnpj = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });

        it('has a length different from 14', async () => {
          data.entity.cnpj = '2313213';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('documentNumber', () => {
        it('is undefined when cnpj is undefined', async () => {
          delete data.entity.documentNumber;
          delete data.entity.cnpj;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.entity.documentNumber = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });

        it('has a length different from 11', async () => {
          data.entity.documentNumber = '2313213';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('email', () => {
        it('is undefined', async () => {
          delete data.entity.email;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.entity.email = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a email', async () => {
          data.entity.email = '2313213';
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('incomeSource', () => {
        it('is undefined', async () => {
          delete data.entity.incomeSource;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.entity.incomeSource = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('incomeSourceActivity', () => {
        it('is undefined and cnpj exists', async () => {
          data.entity.cnpj = '12345678912345';
          delete data.entity.incomeSourceActivity;
          await expect(validate(data)).rejects.toThrow();
        });

        it('not a string', async () => {
          data.entity.incomeSourceActivity = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('maritalStatus', () => {
        it('is undefined', async () => {
          delete data.entity.maritalStatus;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is not a valid marital status', async () => {
          data.entity.maritalStatus = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.entity.maritalStatus = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('educationLevel', () => {
        it('is undefined', async () => {
          delete data.entity.educationLevel;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is not a valid education level', async () => {
          data.entity.educationLevel = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.entity.educationLevel = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('secondPayer', () => {
        it('is undefined', async () => {
          delete data.entity.secondPayer;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is not boolean', async () => {
          data.entity.secondPayer = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.entity.secondPayer = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });
      describe('liveInProperty', () => {
        it('is undefined', async () => {
          delete data.entity.liveInProperty;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is not boolean', async () => {
          data.entity.liveInProperty = 'al';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.entity.liveInProperty = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('phone', () => {
        it('is undefined', async () => {
          delete data.entity.phone;
          await expect(validate(data)).rejects.toThrow();
        });
        it('is invalid', async () => {
          data.entity.phone = '9859-9070';
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a string', async () => {
          data.entity.phone = 2313213;
          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('Personas', () => {
        describe('secondPayer', () => {
          it('incomeSource is undefined', async () => {
            delete data.entity.mother.incomeSource;
            await expect(validate(data)).rejects.toThrow();
          });
          it('averageIncome is undefined', async () => {
            delete data.entity.mother.averageIncome;
            await expect(validate(data)).rejects.toThrow();
          });
        });

        describe('spouse', () => {
          it('is undefined', async () => {
            delete data.entity.spouse;
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
        delete data.entity.secondPayer;

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
