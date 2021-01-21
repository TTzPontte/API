const parserBody = data => {
  const { order, clientId, questions, consumer, property, secondPayers } = data;
  const nickName = consumer.name
    .split(' ')
    .slice(0, -1)
    .join(' ');

  const cepFormated = questions.address_zip_code.replace('-', '');

  const simulationId = order.proposal_id;

  const entity = {
    documentNumber: consumer.cpf,
    email: consumer.email,
    contactEmail: consumer.email,
    phone: questions.cellphone,
    name: consumer.name,
    nickName: nickName,
    address: {
      cep: cepFormated,
      city: questions.address_city,
      neighborhood: questions.address_neighborhood,
      number: questions.address_number,
      state: questions.address_state.value,
      streetAddress: questions.address
    },
    about: {
      birthdate: consumer.birth_date,
      educationLevel: consumer.education_level,
      maritalStatus: consumer.marital_status
    },
    relations: questions.relations,
    income: [
      {
        activity: questions.profession.label,
        value: questions.income,
        source: questions.ocupation.label.toUpperCase()
      }
    ]
  };

  return { entity, property, clientId, simulationId, secondPayers };
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
    proposal_status: 'created',
    proposal_status_message: null,
    redirect_url: null
  };

  return response;
};

module.exports = { parserBody, parserLastContract, parserResponseContract };
