const { ResponseHandler } = require('../utils/responses');
const { pongSchema } = require('./validators/health.validator');
const { sendSuccess, sendError } = ResponseHandler;

class HealthController {
  /**
   * Método para verificar si la API está en funcionamiento
   * @param {import('express').Request} req - Objeto de solicitud HTTP de Express
   * @param {import('express').Response} res - Objeto de respuesta HTTP de Express
   * @returns {Promise<void>}
   */
  async check(req, res) {
    sendSuccess(res, 'API is running');
  }

  /**
   * Método para verificar la funcionalidad POST de la API
   * @param {import('express').Request} req - Objeto de solicitud HTTP de Express
   * @param {import('express').Response} res - Objeto de respuesta HTTP de Express
   * @returns {Promise<void>}
   */
  async checkPost(req, res) {
    const { error, value } = pongSchema.validate(req.body);

    if (error) {
      sendError(res, `Invalid pong value: ${error.message}`, 400);
      return;
    }

    const { pong } = value;

    if (pong === 1) {
      sendSuccess(res, 'ping');
    } else {
      sendError(res, 'Invalid pong value. Expected pong to be 1.', 400);
    }
  }
}

module.exports = { HealthController };