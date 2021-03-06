const message = require('../constants/messages');
const calendar = require('../constants/calendar');
const dateMethods = require('./../method/dateMethods');
const common = require('../method/common');
const trashMethods = require('./../method/trashMethods');
const rifiutiCodeDetails = require('../constants/rifiutiCodeDetails');
const intents = require('../constants/intents');

const SpecificTrashHandler = {
    canHandle(handlerInput) {
		return common.checkRequestTypeAndName(handlerInput, 'IntentRequest', intents.INT_SPECIFIC);
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const trashSlot = slots['SlotTrash'] || "";
        const valuesTrashSlot = trashSlot.resolutions.resolutionsPerAuthority[0].values || "";

        if(trashSlot === "" || valuesTrashSlot === ""){
            return common.speak(handlerInput, message.UNKNOWN_TRASH);
        }

        const idTrash = trashSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        if(idTrash === undefined){
            return common.speak(handlerInput, message.UNKNOWN_TRASH);
        }

        const today = dateMethods.addDaysFromDate(dateMethods.getNowDate(), 1);
        let indexKey = -1;
        let date = today;
        do {
            indexKey = common.findIndexFromMap(calendar, date);
            date = dateMethods.addDaysFromDate(date, 1);
        } while (indexKey < 0);

        const sliceMap = common.getSliceMap(calendar, indexKey);
        const dateAndCodeTrash = trashMethods.findTrashAndDateFromSpecific(sliceMap, idTrash);

        if(dateAndCodeTrash === undefined) {
            return common.speak(handlerInput, message.NO_RIFIUTI_YEAR);
        }

        const dateSpeech = dateMethods.getFormatForSpeech(dateAndCodeTrash[0]);
        let speech = message.SPECIFIC_TRASH(rifiutiCodeDetails[idTrash], dateSpeech);
        const listCodeTrashWithoutTrashSlot = dateAndCodeTrash[1].filter(x => x !== idTrash);
        if(listCodeTrashWithoutTrashSlot.length === 0) {
            return common.speak(handlerInput, speech);
        }

        const listTrash = trashMethods.getListOfTrash(listCodeTrashWithoutTrashSlot);
        if(listTrash.size !== '') {
            speech = speech + ' insieme a : ' + listTrash;
        }
        return common.speak(handlerInput, speech);
    },
};

module.exports = SpecificTrashHandler;
