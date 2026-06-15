const express = require("express");

function makeMessageRouter(controller) {
  const router = express.Router();
  router.post("/", (req, res) => controller.send(req, res));
  router.get("/conversation/:userA/:userB", (req, res) =>
    controller.getConversation(req, res),
  );
  return router;
}

module.exports = makeMessageRouter;
