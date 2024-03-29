const { body } = require("express-validator");

exports.createInputTextCheck = (formFieldName) =>
  body(formFieldName)
    .trim()
    .isLength({ min: 1 })
    .withMessage(`${formFieldName} must not be empty.`)
    .escape();
