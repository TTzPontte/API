const Entity = require('../models/entity');
const _ = require('lodash');

const save = async data => {
    let personas = ['mother', 'father', 'spouse', 'sibling', 'child'];

    personas = await personas.reduce(async (previousPromisse, persona) => {
        const obj = await previousPromisse;
        if (data[persona] && !_.isEmpty(data[persona])) {
            const entityService = new Entity({ ...data[persona] });
            const entity = await entityService.save();
            return { ...obj, [persona]: { ...entity}}
        }
    }, Promise.resolve({}));

    const entity = new Entity({ ...data, ...personas});
    return entity.save();
};

module.exports = { save };
