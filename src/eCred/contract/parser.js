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

module.exports = { parserBody };
