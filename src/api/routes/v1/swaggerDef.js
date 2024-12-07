const { version } = require('../../../../package.json');
const { port } = require('../../../config/vars');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'node-express-boilerplate API documentation',
    version,
    license: {
      name: 'Test licence label',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
