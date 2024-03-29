const parserBody = data => {
  const { order, clientId, questions, consumer } = data;
  const nickName = consumer.name
    .split(' ')
    .slice(0, -1)
    .join(' ');

  const cepFormated = questions.address_zip_code.replace('-', '');
  const phoneFormated = `+55${questions.cellphone.replace(/\D/g, '')}`;

  const simulationId = order.proposal_id;

  const entity = {
    documentNumber: consumer.cpf,
    email: consumer.email,
    contactEmail: consumer.email,
    phone: phoneFormated,
    name: consumer.name,
    nickName: nickName,
    accounts: [],
    documents: [],
    files: [],
    registry: [],
    address: {
      cep: cepFormated,
      city: questions.address_city,
      complement: questions.address_complement,
      neighborhood: questions.address_neighborhood,
      number: questions.address_number,
      state: questions.address_state.value,
      streetAddress: questions.address
    },
    about: {
      birthdate: consumer.birth_date
    },
    relations: [],
    income: [
      {
        activity: questions.profession.label,
        value: questions.income,
        source: questions.occupation.label.toUpperCase()
      }
    ]
  };

  const property = {
    address: {
      cep: cepFormated,
      city: questions.address_city,
      complement: questions.address_complement,
      neighborhood: questions.address_neighborhood,
      number: questions.address_number,
      state: questions.address_state.value,
      streetAddress: questions.address
    },
    id: simulationId,
    financed: 'Não',
    age: '6-10',
    isResident: 'proprio',
    type: questions.property_type.value
  };

  return { entity, clientId, simulationId, property };
};

const parserLastContract = ({ lastContract, bodyParsed }) => {
  const { email, phone } = bodyParsed.entity;
  lastContract.simulation.parameters.email = email;
  lastContract.simulation.parameters.phone = phone;

  return lastContract;
};

const parserResponseContract = ({ id }) => {
  const response = {
    message: 'The Order has been successfully processed.',
    proposal_id: id,
    proposal_status: 'under-analysis-data'
  };

  return response;
};

module.exports = { parserBody, parserLastContract, parserResponseContract };
