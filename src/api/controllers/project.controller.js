const httpStatus = require('http-status');
const Project = require('../models/project.model');

/**
 * Create new project
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const projectObject = {
      name: `${req.user.transform().id}_${req.body.name}`,
      admin_user_id: req.user.transform().id,
      shared_user_ids: [req.user.transform().id],
    };
    const project = new Project(projectObject);
    const savedProject = await project.save();
    res.status(httpStatus.CREATED);
    res.json(savedProject.transform());
  } catch (error) {
    next(Project.checkDuplicateProjectName(error));
  }
};

/**
 * List users project
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const projects = await Project.list(req.query, req.user.transform().id);
    const transformedProjects = projects.map((project) => project.transform());
    res.status(httpStatus.OK);
    res.json(transformedProjects);
  } catch (error) {
    next(Project.checkDuplicateProjectName(error));
  }
};
