const { validate } = require('../../../src/contracts/validator');
const body = require('../../utils/contractBody');

describe('contract validator', () => {
  let data;
  beforeEach(() => {
    data = body();
  });

  describe('returns true when', () => {
    it('all data is correctly', async () => {
      expect(await validate(data)).toBe(true);
    });
  });

  describe('throws an error when', () => {
    describe('people', () => {
      describe('address', () => {
        it('is undefined', async () => {
          delete data.people.address;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        describe('cep', () => {
          it('is undefined', async () => {
            delete data.people.address.cep;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.people.address.cep = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('city', () => {
          it('is undefined', async () => {
            delete data.people.address.city;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.people.address.city = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('neighborhood', () => {
          it('is undefined', async () => {
            delete data.people.address.neighborhood;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.people.address.neighborhood = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('number', () => {
          it('is undefined', async () => {
            delete data.people.address.number;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.people.address.number = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('state', () => {
          it('is undefined', async () => {
            delete data.people.address.state;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.people.address.state = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('streetAddress', () => {
          it('is undefined', async () => {
            delete data.people.address.streetAddress;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.people.address.streetAddress = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('complement', () => {
          it('not a string', async () => {
            data.people.address.complement = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
      });

      describe('averageIncome', () => {
        it('is undefined', async () => {
          delete data.people.averageIncome;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a number', async () => {
          data.people.averageIncome = '123123123';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('birth', () => {
        it('is undefined', async () => {
          delete data.people.birth;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a number', async () => {
          data.people.birth = '123123123';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('children', () => {
        it('is undefined', async () => {
          delete data.people.children;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.people.children = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('is not one of [Sim, Não]', async () => {
          data.people.children = 'A';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('cnpj', () => {
        it('not a string', async () => {
          data.people.cnpj = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('has a length different from 14', async () => {
          data.people.cnpj = '2313213';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('cpf', () => {
        it('is undefined when cnpj is undefined', async () => {
          delete data.people.cpf;
          delete data.people.cnpj;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.people.cpf = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('has a length different from 11', async () => {
          data.people.cpf = '2313213';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('email', () => {
        it('is undefined', async () => {
          delete data.people.email;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.people.email = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a email', async () => {
          data.people.email = '2313213';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('incomeSource', () => {
        it('is undefined', async () => {
          delete data.people.incomeSource;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.people.incomeSource = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('incomeSourceActivity', () => {
        it('is undefined and cnpj exists', async () => {
          data.people.cnpj = '12345678912345';
          delete data.people.incomeSourceActivity;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.people.incomeSourceActivity = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('maritalStatus', () => {
        it('is undefined', async () => {
          delete data.people.maritalStatus;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        it('is not a valid marital status', async () => {
          data.people.maritalStatus = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        it('not a string', async () => {
          data.people.maritalStatus = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('educationLevel', () => {
        it('is undefined', async () => {
          delete data.people.educationLevel;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        it('is not a valid education level', async () => {
          data.people.educationLevel = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        it('not a string', async () => {
          data.people.educationLevel = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('secondPayer', () => {
        it('is undefined', async () => {
          delete data.people.secondPayer;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        it('is not one of [Sim, Não]', async () => {
          data.people.secondPayer = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        it('not a string', async () => {
          data.people.secondPayer = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });
      describe('liveInProperty', () => {
        it('is undefined', async () => {
          delete data.people.liveInProperty;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        it('is not one of [Sim, Não]', async () => {
          data.people.liveInProperty = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        it('not a string', async () => {
          data.people.liveInProperty = 2313213;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('Personas', () => {
        describe('secondPayer', () => {
          it('incomeSource is undefined', async () => {
            delete data.people.mother.incomeSource;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
          it('averageIncome is undefined', async () => {
            delete data.people.mother.averageIncome;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });

        describe('spouse', () => {
          it('is undefined', async () => {
            delete data.people.spouse;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
      });
    });

    describe('property', () => {
      describe('address', () => {
        it('is undefined', async () => {
          delete data.property.address;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
        describe('cep', () => {
          it('is undefined', async () => {
            delete data.property.address.cep;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.property.address.cep = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('city', () => {
          it('is undefined', async () => {
            delete data.property.address.city;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.property.address.city = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('neighborhood', () => {
          it('is undefined', async () => {
            delete data.property.address.neighborhood;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.property.address.neighborhood = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('number', () => {
          it('is undefined', async () => {
            delete data.property.address.number;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.property.address.number = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('state', () => {
          it('is undefined', async () => {
            delete data.property.address.state;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.property.address.state = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('streetAddress', () => {
          it('is undefined', async () => {
            delete data.property.address.streetAddress;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });

          it('not a string', async () => {
            data.property.address.streetAddress = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
        describe('complement', () => {
          it('not a string', async () => {
            data.property.address.complement = 123123123;
            try {
              await validate(data);
            } catch (error) {
              expect(error).toBeTruthy();
            }
          });
        });
      });

      describe('type', () => {
        it('is undefined', async () => {
          delete data.property.type;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('is not a valid type', async () => {
          data.property.type = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.property.type = 123123123;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('floorArea', () => {
        it('is undefined', async () => {
          delete data.property.floorArea;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.property.floorArea = 123123123;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('age', () => {
        it('is undefined', async () => {
          delete data.property.age;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('is not a valid age', async () => {
          data.property.age = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.property.age = 123123123;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });
      describe('bedrooms', () => {
        it('is undefined', async () => {
          delete data.property.bedrooms;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('is not a valid bedrooms', async () => {
          data.property.bedrooms = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.property.bedrooms = 123123123;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });
      describe('suites', () => {
        it('is undefined', async () => {
          delete data.property.suites;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('is not a valid suites', async () => {
          data.property.suites = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.property.suites = 123123123;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });
      describe('isResident', () => {
        it('is undefined', async () => {
          delete data.property.isResident;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('is not a valid isResident', async () => {
          data.property.isResident = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.property.isResident = 123123123;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('garages', () => {
        it('is undefined when type is Apartamento', async () => {
          delete data.property.garages;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('is not a valid garages', async () => {
          data.property.garages = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.property.garages = 123123123;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('financed', () => {
        it('is undefined', async () => {
          delete data.property.financed;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('is not a valid financed', async () => {
          data.property.financed = 'al';
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.property.financed = 123123123;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });

      describe('financingDebt', () => {
        it('is undefined when financed is Sim', async () => {
          delete data.property.financingDebt;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });

        it('not a string', async () => {
          data.property.financingDebt = 123123123;
          try {
            await validate(data);
          } catch (error) {
            expect(error).toBeTruthy();
          }
        });
      });
    });

    describe('whoIsSecondPayer', () => {
      it('is undefined', async () => {
        delete data.property.whoIsSecondPayer;
        try {
          await validate(data);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });

      it('is not a valid whoIsSecondPayer', async () => {
        data.property.financed = 'al';
        try {
          await validate(data);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });

      it('not a string', async () => {
        data.property.whoIsSecondPayer = 123123123;
        try {
          await validate(data);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });

    describe('clientId', () => {
      it('is undefined', async () => {
        delete data.property.clientId;
        try {
          await validate(data);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });

      it('not a string', async () => {
        data.property.clientId = 123123123;
        try {
          await validate(data);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });

    describe('legalName', () => {
      it('not a string', async () => {
        data.property.legalName = 123123123;
        try {
          await validate(data);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });

    describe('legalCnpj', () => {
      it('not a string', async () => {
        data.property.legalCnpj = 123123123;
        try {
          await validate(data);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
      it('has a length different from 14', async () => {
        data.property.legalCnpj = 123;
        try {
          await validate(data);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
