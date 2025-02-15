const { FieldError } = require("../exceptions/exceptions")

const checkGetAverangeField = (field, fieldName) => {
    checkEmptyField(field, fieldName);
    if (!(checkISOFormat(field) || checkCustomFormat(field))) {
        throw new FieldError(400, `${fieldName} date format is incorrect, please enter in DD.MM.YYYY or ISO8061 format`);
    }
    return true;
}

const checkCustomFormat = (dateFromString) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])[^0-9](0[1-9]|1[0-2])[^0-9](\d+)$/;
    return regex.test(dateFromString);
}

const checkISOFormat = (dateFromString) => {
    const isoRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    return isoRegex.test(dateFromString);
}

const checkRandomNumbersField = (request) => {
    const fieldsToCheck = [
        { fieldName: 'len', value: request.len },
        { fieldName: 'maxNumber', value: request.maxNumber },
    ];

    fieldsToCheck.forEach(field => {
        checkEmptyField(field.value, field.fieldName);
        checkValueType(field.value, field.fieldName);
    });
}

const checkEmptyField = (value, fieldName) => {
    if (value === undefined || value === null) {
        throw new FieldError(400, "Empty required field: " + fieldName);
    }
}

function checkValueType(value, fieldName) {
    if (!Number.isInteger(value) || value < 0) {
        throw new FieldError(400, `Incorrect type or value of field ${fieldName}. It must be a non-negative integer.`);
    }
}

module.exports = {checkGetAverangeField, checkRandomNumbersField, checkISOFormat}