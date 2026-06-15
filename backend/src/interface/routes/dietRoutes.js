const express = require("express");

function makeDietRouter(controller) {
  const router = express.Router();
  router.post("/", (req, res) => controller.create(req, res));
  router.get("/", (req, res) => controller.list(req, res));
  router.get("/pet/:petId/active", (req, res) =>
    controller.getActiveForPet(req, res),
  );
  router.put("/:id", (req, res) => controller.update(req, res));
  return router;
}

module.exports = makeDietRouter;
