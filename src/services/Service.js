const uuid = require('uuid');
const AWS = require('aws-sdk');
const Axios = require('axios');
const { ERROR_CONSTANTS } = require('../utils/APIConstants');
const ErrorUtils = require('../utils/ErrorUtils');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});
class Service {
    static async registrarNombres(request) {        
        try {
          let response = await this.consumeStarWarsAPI(request);    
          let data = null;                    
          if(response) {
            data = await this.insertarRegistroDynamo(request,response);            
          }
          
          if(data) {
            response = data;
          }
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
            AnioNacimiento:data.birth_year,
            genero: data.gender,
            mundoHome: data.homeworld,
            peliculas: data.films,
            especies: data.species,
            vehiculos: data.vehicles,
            navesEstelares: data.starships,
            creado: data.created,
            editado: data.edited,
            url: data.url
          },
        };
        await dynamoDb.put(params).promise();
        const dynamoData = await this.obtenerNombres(null,idPersona);
        return dynamoData;
      } catch (error) {
        console.error("error -> ", error);
        throw new ErrorUtils({
          code: ERROR_CONSTANTS.ERROR_SAVE.code,
          statusCode: ERROR_CONSTANTS.ERROR_SAVE.httpCode,
          errMsg: ERROR_CONSTANTS.ERROR_SAVE.message,
        });
      }

    }

    static async obtenerNombres(request,inputPersona) {     
      const idPersona = request && request.multiValueQueryStringParameters? request.multiValueQueryStringParameters.idPersona[0]: inputPersona;
      let dynamo;
      try {
        const params = {
          KeyConditionExpression: '#idPersona = :idPersona',
          ExpressionAttributeNames: {
            '#idPersona': 'idPersona',
          },
          ExpressionAttributeValues: {
            ':idPersona': String(idPersona),
          },
          TableName: process.env.DYNAMO_TABLE_NAME,
        };
        console.log("params -> ", params);
        if(idPersona) {
          dynamo = await dynamoDb.query(params).promise();
        } else {
          const paramsScan = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Select: "ALL_ATTRIBUTES"
          }
          dynamo = await dynamoDb.scan(paramsScan).promise();
        }
        
        return dynamo.Items;
      } catch (error) {
        console.log("error -->>> ", error);
        throw new ErrorUtils({
          code: ERROR_CONSTANTS.ERROR_QUERY.code,
          statusCode: ERROR_CONSTANTS.ERROR_QUERY.httpCode,
          errMsg: ERROR_CONSTANTS.ERROR_QUERY.message,
        });
      }
    }
}
module.exports = Service;