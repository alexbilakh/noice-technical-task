const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const mainDatabase = require('../models/main');

router.get('/value',
  validator.query(
    Joi.object({
      key: Joi.string().required("Key is required."),
    })
  ), (req, res) => {
    const { key } = req.query;

    const value = mainDatabase.getOrCreate(key);

    res.json({
      key: key,
      value: value
    });
  });

router.get('/values', (req, res) => {
  const result = mainDatabase.getList();
  res.json(result);
});

module.exports = router;
