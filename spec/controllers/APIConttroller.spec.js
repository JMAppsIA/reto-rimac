require('dotenv').config();
const { obtenerNombres, registrarNombres } = require('../../src/controller/APIController');
const requestPersonaRegistro = require('../data/registrarPersona.request.json');
const requestPersonaConsulta = require('../data/registrarPersona.request.json');
require('dotenv').config();

describe('APIController Spec ', () => {
  it('Response obtenerNombres must be true', async () => {
    const result = await obtenerNombres(requestPersonaConsulta);
    const data = JSON.parse(result.body);
    expect(data.response.success).toBe(true);
  });

  it('Response registrarNombres must be true', async () => {
    const result = await registrarNombres(requestPersonaRegistro);
    const data = JSON.parse(result.body);
    expect(data.response.success).toBe(true);
  });
});
