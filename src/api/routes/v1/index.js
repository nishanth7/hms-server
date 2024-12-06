const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const projectRoutes = require('./projects.route');
const docsRoute = require('./docs.route');
const { env } = require('../../../config/vars');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));



/**
 * GET v1/docs
 */

const devRoutes = [
    // routes available only in development mode
    {
      path: '/docs',
      route: docsRoute,
    },
  ];

if (env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
      });
}
router.use('/docs', express.static('docs'));

/* actual api */
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
