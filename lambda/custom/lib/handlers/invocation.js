const messages = require('./../constants/messages');
const dateMethods = require('./../method/dateMethods');
const trashMethods = require('./../method/trashMethods');
const common = require('../method/common');
const intents = require('../constants/intents');

const InvocationHandler = {
    canHandle(handlerInput) {
        return common.checkRequestType(handlerInput, intents.INVOCATION);
    },
    handle(handlerInput) {
        const today = dateMethods.addDaysFromDate(dateMethods.getNowDate(), 1);
        const listCodesTrash = dateMethods.getRifiutidelGiorno(today);
        const dateToSpeech = dateMethods.getFormatForSpeech(today);

        let SPEECH = "";
        if (listCodesTrash.size === 0) {
            SPEECH = messages.NO_RIFIUTI + dateToSpeech;
        } else {
            const trashToSpeech = trashMethods.getListOfTrash(listCodesTrash);
            SPEECH = messages.RIFIUTI + dateToSpeech + " sono: " + trashToSpeech + ". " + messages.MORE_INFO;
        }
        return common.speak(handlerInput, SPEECH);
    },
};

module.exports = InvocationHandler;
