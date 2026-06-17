const express = require("express");

function makeVaccineRouter(controller) {
  const router = express.Router();
  router.post("/", (req, res) => controller.create(req, res));
  router.get("/pet/:petId/status", (req, res) =>
    controller.getStatusForPet(req, res),
  );
  return router;
}

module.exports = makeVaccineRouter;
