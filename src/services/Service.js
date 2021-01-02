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
            console.error(error)                     
        }
    }

    static async insertarRegistroDynamo(request,data) {
      try {
        const {idPersona} = request;
        //Validamos si existe data, para obtener los campos e insertarlos en Dynamo, sino insertamos el request enviado.
        const items = {
          idPersona: String(idPersona),
          nombre: request.nombre ? request.nombre :  data.name,
          peso: request.peso ? request.peso :  data.height,
          masa: request.masa ? request.masa :  data.mass,
          colorCabello: request.colorCabello ? request.colorCabello :  data.hair_color,
          colorPiel: request.colorPiel ? request.colorPiel :  data.skin_color,
          colorOjos: request.colorOjos ? request.colorOjos :  data.eye_color,
          fechaNacimiento: request.fechaNacimiento ? request.fechaNacimiento :  data.birth_year,
          genero: request.genero ? request.genero :  data.gender,
          mundoNatal: request.mundoNatal ? request.mundoNatal :  data.homeworld,
          peliculas: request.peliculas.length > 0 ? request.peliculas :  data.films,
          especies: request.especies.length > 0 ? request.especies :  data.species,
          vehiculos: request.vehiculos.length > 0 ? request.vehiculos :  data.vehicles,
          navesEstelares: request.navesEstelares.length > 0 ? request.navesEstelares :  data.starships,
          fechaCreacion: request.fechaCreacion ? request.fechaCreacion :  extractDateFromDateTime(data.created),
          fechaModificacion: request.fechaModificacion ? request.fechaModificacion :  extractDateFromDateTime(data.edited),
          url: request.url ? request.url : data.url
        };
        const params = {
          TableName: process.env.DYNAMO_TABLE_NAME,
          Item: items,
          Exists: false,
          UpdateItem: false,
        };
        await dynamoDb.put(params).promise();                
      } catch (error) {
        console.error(`error --> ${error}`);
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
          TableName: process.env.DYNAMO_TABLE_NAME,
        };

        paramsScan = {
          TableName: process.env.DYNAMO_TABLE_NAME,
          Select: "ALL_ATTRIBUTES"
        };

        if(idPersona) {
          if(idPersona == 'all'){
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