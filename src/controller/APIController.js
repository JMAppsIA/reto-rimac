const { required } = require("@hapi/joi");
const Service = require("../services/Service");
const Utils = require("../utils/Utils");
const ValidationUtils = require("../utils/ValidationUtils");
const { validateRegistrarNombres } = require("../validations/validateRegistrarNombres");


    module.exports.registrarNombres = async (event) => {          
        try {
            console.log(`------ registrarNombres ------`);
            const request = Utils.getRequest(event);   
            await ValidationUtils.validateRequest(request,validateRegistrarNombres());                 
            const result = await Service.registrarNombres(request);
            return Utils.createResponse(result);            
        } catch (error) {
            console.error(`error >>> ${error}`);            
            return Utils.createErrorResponse(error);
        }     
    }

    module.exports.obtenerNombres = async (event) => {
        try {   
            console.log(`------ obtenerNombres ------`);     
            const result = await Service.obtenerNombresDynamo(event);
            return Utils.createResponse(result);            
        } catch (error) {
            console.error(`error >>> ${error}`);
            return Utils.createErrorResponse(error);
        }
    }
