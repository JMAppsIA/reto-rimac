const uuid = require('uuid');
const AWS = require('aws-sdk');
const Axios = require('axios');
const { ERROR_CONSTANTS } = require('../utils/APIConstants');
const ErrorUtils = require('../utils/ErrorUtils');
const { extractDateFromDateTime } = require('../utils/Utils');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});
class Service {
    static async registrarNombres(request) {   
        let responseFinal = {};     
        let data = null;
        try {          
          const {idPersona} = request;       
          //Consumimos el api externa SWAPI   
          const response = await this.consumeStarWarsAPI(request);
          //Insertamos la respuesta a DynamoDB                              
          await this.insertarRegistroDynamo(request,response);            
          data = await this.obtenerNombresDynamo(null,idPersona);

          if(data) {
            responseFinal = data;
          }

          return responseFinal;
        } catch (error) {         
          console.error(error);
          throw error;
        }
    }

    static async consumeStarWarsAPI(request) {
      try {
          const {idPersona} = request;
          const { data } = await Axios
            .get(
            `https://${process.env.SWAPI_HOST}/api/people/${idPersona}`,
            );
          return data;
        } catch (error) {  
                                 
        }
    }

    static async insertarRegistroDynamo(request,data) {
      try {
        const {idPersona} = request;
        //Validamos si existe data, para obtener los campos e insertarlos en Dynamo, sino insertamos el request enviado.
        const items = {
          idPersona: String(idPersona),
          nombre: data? data.name:request.nombre,
          peso: data? data.height: request.peso,
          masa: data? data.mass: request.masa,
          colorCabello: data? data.hair_color: request.colorCabello,
          colorPiel: data? data.skin_color: request.colorPiel,
          colorOjos: data? data.eye_color: request.colorOjos,
          fechaNacimiento: data? data.birth_year: request.fechaNacimiento,
          genero: data? data.gender: request.genero,
          mundoNatal: data? data.homeworld: request.mundoNatal,
          peliculas: data? data.films: request.peliculas,
          especies: data? data.species: request.especies,
          vehiculos: data? data.vehicles: request.vehiculos,
          navesEstelares: data? data.starships: request.navesEstelares,
          fechaCreacion: data? extractDateFromDateTime(data.created): extractDateFromDateTime(request.fechaCreacion),
          fechaModificacion: data? extractDateFromDateTime(data.edited): extractDateFromDateTime(request.fechaModificacion),
          url: data? data.url: request.url
        };
        const params = {
          TableName: process.env.DYNAMO_TABLE_NAME,
          Item: items,
          Exists: false,
          UpdateItem: false,
        };
        await dynamoDb.put(params).promise();                
      } catch (error) {
        console.error("error -> ", error);
        throw new ErrorUtils({
          code: ERROR_CONSTANTS.ERROR_SAVE.code,
          statusCode: ERROR_CONSTANTS.ERROR_SAVE.httpCode,
          errMsg: ERROR_CONSTANTS.ERROR_SAVE.message,
        });
      }

    }

    static async obtenerNombresDynamo(request,inputPersona) {   
      const idPersona = request && request.pathParameters? request.pathParameters.idPersona: inputPersona;
      let dynamo,params,paramsScan,errorMessage;
      try {
        params = {
          KeyConditionExpression: '#idPersona = :idPersona',
          ExpressionAttributeNames: {
            '#idPersona': 'idPersona',
          },
          ExpressionAttributeValues: {
            ':idPersona': String(idPersona),
          },
          TableName: 'DBPERSONAS',//process.env.DYNAMO_TABLE_NAME,
        };

        paramsScan = {
          TableName: process.env.DYNAMO_TABLE_NAME,
          Select: "ALL_ATTRIBUTES"
        };

        if(idPersona) {
          if(idPersona == 0){
            dynamo = await dynamoDb.scan(paramsScan).promise();
          } else {
            dynamo = await dynamoDb.query(params).promise();            
          }
        } else {
          dynamo = await dynamoDb.scan(paramsScan).promise();
        }
        
        if(dynamo.Items.length == 0) {
          errorMessage = ERROR_CONSTANTS.DYNAMO_NOT_FOUND.message;
          throw new ErrorUtils({
            code: ERROR_CONSTANTS.DYNAMO_NOT_FOUND.code,
            statusCode: ERROR_CONSTANTS.DYNAMO_NOT_FOUND.httpCode,
            errMsg: errorMessage
          });
        }
        return dynamo.Items;
      } catch (error) {
        if(errorMessage){
          throw new ErrorUtils({
            code: ERROR_CONSTANTS.DYNAMO_NOT_FOUND.code,
            statusCode: ERROR_CONSTANTS.DYNAMO_NOT_FOUND.httpCode,
            errMsg: errorMessage,
          });
        } else {
          throw new ErrorUtils({
            code: ERROR_CONSTANTS.ERROR_QUERY.code,
            statusCode: ERROR_CONSTANTS.ERROR_QUERY.httpCode,
            errMsg: ERROR_CONSTANTS.ERROR_QUERY.message,
          });
        }
        
      }
    }
}
module.exports = Service;