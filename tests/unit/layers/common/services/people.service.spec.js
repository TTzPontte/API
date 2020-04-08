const layerPath = '../../../../../src/layers/common/';
let { save } = require(`${layerPath}services/people.service`);

describe('save people', () => {
  let people;
  beforeEach(() => {
    people = {
      address: {
        cep: '02141000',
        city: 'São Paulo',
        neighborhood: 'Vila Sabrina',
        number: '1131',
        state: 'SP',
        streetAddress: 'Avenida João Simão de Castro'
      },
      averageIncome: 30000,
      birth: '1997-01-18',
      child: {},
      children: 'Não',
      cpf: '31854887092',
      createdAt: '2020-04-06T19:30:45Z',
      documents: {},
      educationLevel: 'ENSINO SUPERIOR COMPLETO',
      email: 'jose.neto.chaves@codeminer42.com',
      father: {
        accepted: {},
        accounts: [],
        address: {},
        child: {},
        cpf: '41476624046',
        documents: {},
        email: 'paidasilva@gmail.com',
        father: {},
        mother: {},
        name: 'Pai da silva pagador',
        registry: [],
        sibling: {},
        spouse: {},
        welcome: true
      },
      hasSiblings: 'Sim',
      incomeSource: 'ASSALARIADO',
      liveInProperty: 'Sim',
      maritalStatus: 'CASADO',
      mother: {
        accepted: {},
        accounts: [],
        address: {},
        averageIncome: 15000,
        birth: '1965-02-15',
        child: {},
        cpf: '16356520060',
        documents: {},
        email: 'mãe+email@gmail.com',
        father: {},
        incomeSource: 'ASSALARIADO',
        mother: {},
        name: 'Mãe da silva',
        registry: [],
        sibling: {},
        spouse: {},
        welcome: true
      },
      name: 'Jose Chaves',
      nickname: 'Jose',
      phone: '+5586998599070',
      registry: [],
      secondPayer: 'Sim',
      sibling: {},
      spouse: {
        address: {},
        birth: '1997-09-14',
        child: {},
        cpf: '75798405028',
        documents: {},
        email: 'teste+t332@gmail.com',
        father: {},
        mother: {},
        name: 'Isabelly',
        registry: [],
        sibling: {},
        spouse: {},
        welcome: true
      },
      updatedAt: '2020-04-06T19:39:30Z',
      welcome: true
    };
  });

  it('saves people correctly', async () => {
    await save(people);
    expect(global.mockModelSave).toHaveBeenCalledTimes(4);
  });

  it('saves two people', async () => {
    delete people.father;
    delete people.mother;
    await save(people);
    expect(global.mockModelSave).toHaveBeenCalledTimes(2);
  });
});
