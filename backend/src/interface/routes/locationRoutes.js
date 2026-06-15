const express = require('express');

function makeLocationRouter(controller) {
  const router = express.Router();
  router.post('/', (req, res) => controller.create(req, res));
  router.get('/nearby', (req, res) => controller.findNearby(req, res));
  return router;
}

module.exports = makeLocationRouter;