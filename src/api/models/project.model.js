const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
/**
* Statuses
*/
const statuses = ['active', 'inactive'];
/**
 * Projects Schema
 * @private
 */
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 128,
    index: true,
    trim: true,
    unique: true,
  },
  admin_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User',
  },
  shared_user_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: statuses,
    default: 'active',
  },
}, {
  timestamps: true,
});

projectSchema.method({
  transform() {
    const transformed = {};
    const fields = ['name', 'admin_user_id', 'shared_user_ids', 'status', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
});

/**
 * Statics
 */
projectSchema.statics = {

  statuses,

  /**
     * Get project
     *
     * @param {ObjectId} id - The objectId of project.
     * @returns {Promise<Project, APIError>}
     */
  async get(id) {
    let project;

    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await this.findById(id).exec();
    }
    if (project) {
      return project;
    }

    throw new APIError({
      message: 'Project does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
     * Returns project by name
     * @param {name} param0
     * @returns {Promise<Project>}
     */
  findByName(name) {
    return this.find({ name }).exec();
  },

  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * List projects in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of projects to be skipped.
   * @param {number} limit - Limit number of projects to be returned.
   * @returns {Promise<Project[]>}
   */
  list({
    page = 1, perPage = 30,
  }, userId) {
    const options = { shared_user_ids: userId };
    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */

  checkDuplicateProjectName(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'name',
          location: 'body',
          messages: ['"name" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};
/**
 * @typedef Project
 */
module.exports = mongoose.model('Project', projectSchema);
