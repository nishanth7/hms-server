const Joi = require('joi');
// POST /v1/projects/create
module.exports = {
  createProject: {
    body: {
      name: Joi.string().min(3).max(128).required(),
    },
  },
  // GET /v1/projects
  listProjects: {
    query: {
      page: Joi.number().min(1).required(),
      perPage: Joi.number().min(1).max(100).required()
    },
  },
};
