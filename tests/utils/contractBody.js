const body = () => ({
  clientId: '8CMYK7T-HM0MA5J-M62W27M-SWF10ZY',
  entity: {
    about: {
      birthdate: '1997-01-18',
      educationLevel: 'COLLEGE',
      hasChild: true,
      hasSiblings: true,
      maritalStatus: 'MARRIED'
    },
    accounts: [],
    address: {
      cep: '02141000',
      city: 'São Paulo',
      complement: 'in the left avenue',
      neighborhood: 'Vila Sabrina',
      number: '1131',
      state: 'SP',
      streetAddress: 'Avenida João Simão de Castro'
    },
    averageIncome: 30000,
    documentNumber: '78441617015',
    documents: [],
    email: 'yuri+40@pontte.com.br',
    idWallCompanies: [],
    income: [
      {
        activity: 'Engineer',
        averageIncome: '20000',
        incomeOrigin: 'something',
        source: 'SALARIED',
        value: 15000
      }
    ],
    liveInProperty: true,
    name: 'Test John Doe',
    nickname: 'Test',
    phone: '+5599999999999',
    registry: [],
    relations: [
      {
        mother: {
          averageIncome: 15000,
          birth: '1965-02-15',
          cpf: '16356520060',
          email: 'mãe+email@gmail.com',
          incomeSource: 'SALARIED',
          name: 'Mãe da silva'
        }
      },
      {
        father: {
          averageIncome: 15000,
          birth: '1965-02-15',
          cpf: '16356520060',
          email: 'pai+email@gmail.com',
          incomeSource: 'SALARIED',
          name: 'Pae da silva'
        }
      },
      {
        child: {
          averageIncome: 15000,
          birth: '1965-02-15',
          cpf: '16356520060',
          email: 'filho+email@gmail.com',
          incomeSource: 'SALARIED',
          name: 'Filho da silva'
        }
      },
      {
        spouse: {
          averageIncome: 15000,
          birth: '1965-02-15',
          cpf: '16356520060',
          email: 'esposa+email@gmail.com',
          incomeSource: 'SALARIED',
          name: 'Esposa da silva'
        }
      },
      {
        sibling: {
          averageIncome: 15000,
          birth: '1965-02-15',
          cpf: '16356520060',
          email: 'irmao+email@gmail.com',
          incomeSource: 'SALARIED',
          name: 'Irmao da silva'
        }
      }
    ],
    secondPayer: true
  },
  makeUpIncome: [],
  pendencies: [],
  property: {
    address: {
      cep: '02141000',
      city: 'São Paulo',
      neighborhood: 'Vila Sabrina',
      number: '1131',
      state: 'SP',
      streetAddress: 'Avenida João Simão de Castro'
    },
    age: '<=2',
    bedrooms: '3',
    financed: false,
    floorArea: '400 m²',
    garages: '1',
    isResident: 'OWN',
    owners: [],
    suites: '1',
    type: 'APARTMENT'
  },
  secondPayers: ['spouse'],
  simulationId: 'lR0B7sQVTDqSrhQ_RyaJKw'
});

module.exports = body;
