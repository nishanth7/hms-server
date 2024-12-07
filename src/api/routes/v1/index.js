const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const projectRoutes = require('./projects.route');
const { env } = require('../../../config/vars');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));



/**
 * GET v1/docs
 */

if (env === 'development') {
    const docsRoute = require('./docs.route');
    const devRoutes = [
    // routes available only in development mode
    {
      path: '/docs',
      route: docsRoute,
    },
  ];
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
      });
}

/* actual api */
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
