const express = require("express");
const multerMiddleware = require("../../infrastructure/adapters/storage/multerMiddleware");

function makeUploadRouter(controller) {
  const router = express.Router();

  router.post("/", multerMiddleware.single("file"), (req, res) =>
    controller.upload(req, res),
  );

  router.get("/owner/:ownerId", (req, res) => controller.listByOwner(req, res));

  return router;
}

module.exports = makeUploadRouter;
