class ErrorUtils extends Error {
    constructor({
      code = undefined, 
      statusCode = undefined, 
      errMsg = 'Ocurrio un error desconocido',
    }) {
      super();
      Error.captureStackTrace(this, this.constructor);
      this.code = code;
      this.statusCode = statusCode;
      this.errMsg = errMsg;
    }
  }
  
  module.exports = ErrorUtils;