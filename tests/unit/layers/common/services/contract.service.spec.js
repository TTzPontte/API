const layerPath = '../../../../../src/layers/common/';
let { isRegistered, getContractByOwner, save } = require(`${layerPath}services/contract.service`);
const People = require(`${layerPath}services/people.service`);
const Property = require(`${layerPath}services/property.service`);
const Simulation = require(`${layerPath}services/simulation.service`);
const ContractModel = require(`${layerPath}models/contract`);
const { getPeople } = require(`${layerPath}elasticsearch/people.es`);
const faker = require('faker');

jest.mock('../../../../../src/layers/common/elasticsearch/people.es');

describe('Contract service', () => {
  let contract;
  beforeEach(() => {
    contract = {
      people: {
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
      },
      property: {
        address: {},
        age: '<=2',
        bedrooms: '3',
        financed: 'Não',
        floorArea: '400 m²',
        haveRegistration: 'Não',
        isResident: 'Próprio',
        owners: [],
        suites: '1',
        type: 'Apartamento'
      },
      simulationId: 'lR0B7sQVTDqSrhQ_RyaJKw',
      makeUpIncome: [],
      pendencies: [],
      whoIsSecondPayer: 'Cônjuge'
    };
  });
  describe('get contract by contract owner', () => {
    it('should return the contract', async () => {
      const contractOwner = faker.random.uuid();
      const result = 'Contract';
      const exec = jest.fn(() => result);
      const using = jest.fn(() => ({ exec }));
      ContractModel.query = jest.fn(() => ({ using }));

      const response = await getContractByOwner(contractOwner);

      expect(ContractModel.query).toHaveBeenCalledWith({ contractOwner: { eq: contractOwner } });
      expect(using).toHaveBeenCalledWith('ContractByOwner');
      expect(exec).toHaveBeenCalledTimes(1);
      expect(response).toEqual(result);
    });
  });

  describe('verifies if is registered', () => {
    let email, cpf;
    beforeEach(() => {
      email = faker.internet.email();
      cpf = '12345678910';
    });
    it('returns false if not registered', async () => {
      getPeople.mockReturnValueOnce([]);

      expect(await isRegistered({ email, cpf })).toBe(false);
    });
    it('returns error if is registered', async () => {
      getPeople.mockReturnValueOnce([{ name: 'name' }]);
      try {
        await isRegistered({ email, cpf });
      } catch (error) {
        expect(error.message).toBe('Cliente já cadastrado');
      }
    });
  });

  describe('save contract', () => {
    it('saves contract correctly', async () => {
      People.save = jest.fn(() => ({ id: '1' }));
      Property.save = jest.fn(() => ({ id: '1' }));
      Simulation.getLastSimulation = jest.fn(() => ({ trackCode: '12345' }));

      await save(contract);
      expect(People.save).toHaveBeenCalledWith(contract.people);
      expect(Property.save).toHaveBeenCalledWith(contract.property, '12345');
      expect(Simulation.getLastSimulation).toHaveBeenCalledWith(contract.simulationId);
      expect(global.mockModelSave).toHaveBeenCalledTimes(1);
    });
  });
});
