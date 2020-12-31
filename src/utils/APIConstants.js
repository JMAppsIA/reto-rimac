module.exports.RESPONSE_CONSTANTS = {
    OK_STATUS: {
        code: 200,

    }
}; 

module.exports.ERROR_CONSTANTS = {
    NOT_FOUND: {
        code:"0000001",
        httpCode: 404,
        message:"Dato no encontrado en SWAPI. Se omitio el registro."
    },
    ERROR_SAVE: {
        code: '0000002', 
        httpCode:500,
        message: 'Error al guardar en dynamoDB'
    },
    ERROR_QUERY: {
        code: '0000003', 
        httpCode:500,
        message: 'Error al obtener data'
    },
    DYNAMO_NOT_FOUND: {
        code:"0000004",
        httpCode: 404,
        message:"Dato no encontrado en dynamoDB."
    }
};

