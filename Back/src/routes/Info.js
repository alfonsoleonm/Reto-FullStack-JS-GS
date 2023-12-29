const express = require("express");
var cors = require('cors')
const router = express.Router();
const datosSchema = require("../models/info").default

router.use(cors());

router.post("/info", (req, res) => {
    const dato = datosSchema(req.body);
    dato
      .save()
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });

router.get("/info", (req, res) => {
  datosSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
module.exports = router;

