const express = require("express");
function makeSettingsRouter(controller) {
  const router = express.Router();
  router.put("/", (req, res) => controller.upsert(req, res));
  router.get("/:userId", (req, res) => controller.getByUser(req, res));
  return router;
}
module.exports = makeSettingsRouter;
