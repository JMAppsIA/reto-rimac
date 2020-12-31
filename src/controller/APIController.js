const Service = require("../services/Service");
const Utils = require("../utils/Utils");
    
    module.exports.registrarNombres = async (event) => {           
        try {
            const request = Utils.getRequest(event);        
            const result = await Service.registrarNombres(request);
            return Utils.createResponse(result);            
        } catch (error) {
            console.error("error >>> ", error);
            return Utils.createErrorResponse(error);
        }     
    }

    module.exports.obtenerNombres = async (event) => {
        try {       
            const result = await Service.obtenerNombres(event);
            return Utils.createResponse(result);            
        } catch (error) {
            console.error("error >>> ", error);
            return Utils.createErrorResponse(error);
        }
    }
