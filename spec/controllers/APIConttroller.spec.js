const { obtenerNombres, registrarNombres } = require('../../src/controller/APIController');
const requestObtenerNombres = require('../data/obtenerNombres.request.json');
require('dotenv').config();

describe('APIController Spec ', () => {
  it('Response obtenerNombres must be true', async () => {
    const result = await obtenerNombres(requestObtenerNombres);
    const data = JSON.parse(result.body);
    expect(data.response.success).toBe(true);
  });

  it('Response registrarNombres must be true', async () => {
    const result = await registrarNombres(requestObtenerNombres);
    const data = JSON.parse(result.body);
    expect(data.response.success).toBe(true);
  });
});
