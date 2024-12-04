const express = require('express');
const validate = require('express-validation');
const projectController = require('../../controllers/project.controller');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');
const {
  createProject,
  listProjects,
} = require('../../validations/project.validation');

const router = express.Router();

/**
 * @api {post} v1/projects/create create
 * @apiDescription creates new project
 * @apiVersion 1.0.0
 * @apiName create new project
 * @apiGroup projects
 * @apiPermission LOGGED_USER
 *
 * @apiParam  {String}          name     project name
 *
 * @apiSuccess (Created 201) {String}  status stautu of request
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/create')
  .post(authorize(), validate(createProject), projectController.create);

/**
 * @api {get} v1/projects list
 * @apiDescription lists projects based on shared_user_ids
 * @apiVersion 1.0.0
 * @apiName list users projects
 * @apiGroup projects
 * @apiPermission LOGGED_USER
 *
 * @apiSuccess (Created 201) {String}  status status of request
 *
 * @apiError (Bad Request 400)  No projects found
 */
router.route('/')
  .get(authorize(), validate(listProjects), projectController.list);

module.exports = router;
