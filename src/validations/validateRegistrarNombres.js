const Joi = require('@hapi/joi');
module.exports.validateRegistrarNombres = () => {
    const validatorSchema = Joi.object().keys({
        idPersona: Joi.number().min(0).required(),
        nombre: Joi.string().allow("").required(),
        masa: Joi.string().allow("").required(),
        colorCabello: Joi.string().allow("").required(),
        vehiculos: Joi.array().required(),
        url: Joi.string().allow("").required(),
        peso: Joi.string().allow("").required(),
        fechaNacimiento: Joi.string().allow("").required(),
        peliculas: Joi.array().required(),
        navesEstelares: Joi.array().required(),
        fechaModificacion: Joi.string().allow("").required(),
        colorOjos: Joi.string().allow("").required(),
        colorPiel: Joi.string().allow("").required(),
        especies: Joi.array().required(),
        fechaCreacion: Joi.string().allow("").required(),
        mundoNatal: Joi.string().allow("").required(),
        genero: Joi.string().allow("").required()
      });
      return validatorSchema;
}   

