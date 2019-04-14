const Alexa = require('ask-sdk-core');
const handlers = require('./libs/handlers');

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
    .addRequestHandlers(
        ...handlers.request,
    )
    .addErrorHandlers(
        ...handlers.error,
    )
    .lambda();