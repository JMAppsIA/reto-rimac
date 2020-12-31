const uuid = require('uuid');
const AWS = require('aws-sdk');
const Axios = require('axios');
const { ERROR_CONSTANTS } = require('../utils/APIConstants');
const ErrorUtils = require('../utils/ErrorUtils');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});
class Service {
    static async registrarNombres(request) {        
        try {
          const {idPersona} = request;
          let response = await this.consumeStarWarsAPI(request);    
          let data = null;                    
          if(response) {
            await this.insertarRegistroDynamo(request,response);            
            data = await this.obtenerNombresDynamo(null,idPersona);
          }
          
          if(data) {
            response = data;
            response.msg = 'Se registro el dato correctamente';          
          }
          console.log("response -> ", response)
          return response;
        } catch (error) {         
          throw new ErrorUtils({
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            statusCode: ERROR_CONSTANTS.NOT_FOUND.httpCode,
            errMsg: ERROR_CONSTANTS.NOT_FOUND.message,
          });
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
          console.log("error -> ", error.message);      
          throw new ErrorUtils({
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            statusCode: ERROR_CONSTANTS.NOT_FOUND.httpCode,
            errMsg: ERROR_CONSTANTS.NOT_FOUND.message,
          });
        }
    }

    static async insertarRegistroDynamo(request,data) {
      try {
        const {idPersona} = request;
        const params = {
          TableName: process.env.DYNAMO_TABLE_NAME,
          Item: {
            idPersona: String(idPersona),
            nombre: data.name,
            peso: data.height,
            masa: data.mass,
            colorCabello: data.hair_color,
            colorPiel: data.skin_color,
            colorOjos: data.eye_color,
            fechaNacimiento:data.birth_year,
            genero: data.gender,
            hogar: data.homeworld,
            peliculas: data.films,
            especies: data.species,
            vehiculos: data.vehicles,
            navesEstelares: data.starships,
            fechaCreacion: data.created,
            fechaModificacion: data.edited,
            url: data.url
          },
          Exists: false
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
          TableName: process.env.DYNAMO_TABLE_NAME,
        };

        paramsScan = {
          TableName: process.env.DYNAMO_TABLE_NAME,
          Select: "ALL_ATTRIBUTES"
        };

        if(idPersona) {
          if(idPersona == 0){
            dynamo = await dynamoDb.scan(paramsScan).promise();
          } else {
            console.log("inputPersona -> ", inputPersona)
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