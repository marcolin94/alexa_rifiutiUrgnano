const messages = require('./../constants/messages');
const dateMethods = require('./../method/dateMethods');
const trashMethods = require('./../method/trashMethods');

const InvocationHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const today = dateMethods.getNowDate();
        const listCodesTrash = dateMethods.getRifiutidelGiorno(today);
        const dateToSpeech = dateMethods.getFormatForSpeech(today);

        let SPEECH = "";
        if (listCodesTrash.size === 0) {
            SPEECH = messages.NO_RIFIUTI + dateToSpeech;
        } else {
            const trashToSpeech = trashMethods.getListOfTrash(listCodesTrash);
            SPEECH = messages.RIFIUTI + dateToSpeech + " sono: " + trashToSpeech + ". " + messages.MORE_INFO;
        }
        return handlerInput.responseBuilder
            .speak(SPEECH)
            .withShouldEndSession(false)
            .getResponse();
    },
};

module.exports = InvocationHandler;