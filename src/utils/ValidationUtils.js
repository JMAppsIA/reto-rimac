const customErrorMessages = require("../utils/spanish-joi-messages.json");
const ErrorUtils = require('./ErrorUtils');
const { ERROR_CONSTANTS } = require('../utils/APIConstants');
class ValidationUtils {
    static async validateRequest(event,validationschema) {
        const validation = validationschema.validate(event,{
            language: customErrorMessages
          });    
        if(validation.error) { 
            const messagesError = [];
            validation.error.details.forEach((val) => {
                messagesError.push(val.message);
            });
            throw new ErrorUtils({
                code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
                statusCode: ERROR_CONSTANTS.VALIDATION_ERROR.httpCode,
                errMsg: messagesError,
            });
        }
    }    
}

module.exports = ValidationUtils