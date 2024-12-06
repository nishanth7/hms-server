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


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Projects management
 */

/**
 * @swagger
 * /projects/create:
 *   post:
 *     summary: Create a projects
 *     description: Only admins can create other projects.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: fake name
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Project'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: lists projects based on shared_user_ids
 *     description: lists projects based on shared_user_ids
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 10
 *           default: 10
 *         description: No of projects per page
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */