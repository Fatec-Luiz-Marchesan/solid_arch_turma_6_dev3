const express = require('express');

function makeNotificationRouter(controller) {
  const router = express.Router();
  router.post('/', (req, res) => controller.create(req, res));
  router.get('/user/:userId', (req, res) => controller.listByUser(req, res));
  router.patch('/:id/read', (req, res) => controller.markAsRead(req, res));
  return router;
}

module.exports = makeNotificationRouter;