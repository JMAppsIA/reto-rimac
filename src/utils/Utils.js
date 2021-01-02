const { RESPONSE_CONSTANTS } = require('./APIConstants');
const moment = require('moment');
class Utils {

    static createResponse(res) {
        const obj = {
            response: {       
                msg: `Operacion realizada correctamente`,
                data: res,
                success: true,
              }
          };

        const response = {
            statusCode: RESPONSE_CONSTANTS.OK_STATUS.code,
            body: JSON.stringify(obj),
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
              'X-Content-Type-Options': 'nosniff',
              'X-XSS-Protection': '1; mode=block',
              'X-Frame-Options': 'SAMEORIGIN',
              'Referrer-Policy': 'no-referrer-when-downgrade',
              'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            },
          };
          console.log(response.body);
          return response;
    }

    static createErrorResponse(error) {
      const obj = {
        response: {
            data: null,
            success: false,
            error: error
          },
      };

      const response = {
        statusCode: error.statusCode?error.statusCode: 400,
        body: JSON.stringify(obj),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block',
          'X-Frame-Options': 'SAMEORIGIN',
          'Referrer-Policy': 'no-referrer-when-downgrade',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        },
      };
      return response;
  
    }

    static getRequest(event){
      let request;
      if (event.body) {
        request = JSON.parse(event.body);
      } else {
        request = event;
      }
      return request;
    }

    static extractDateFromDateTime(date) {
      var datetime = moment(date,[`DD/MM/YYYY`,`YYYY-MM-DD`]);
      const fecha = datetime.format(`DD/MM/YYYY`);
      return fecha;
    }

}

module.exports = Utils;