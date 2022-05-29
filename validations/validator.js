const { check } = require('express-validator');

exports.checkIndex = [
    check('_TITLE')
    .isLength({min:1})
    .withMessage("Title is mandatory"),
    check('_PRIORITY')
    .isLength({min:1})
    .withMessage("Select the Priority"),
    check('_ASSIGN_TO')
    .isLength({min:1})
    .withMessage("Assigned to is mandatory")
];

exports.checkUpdate = [
    check('_TITLE')
    .isLength({min:1})
    .withMessage("Title is mandatory"),
    check('_PRIORITY')
    .isLength({min:1})
    .withMessage("Select the Priority"),
    check('_ASSIGN_TO')
    .isLength({min:1})
    .withMessage("Assigned to is mandatory"),
    check('_STATUS')
    .isLength({min:1})
    .withMessage("Status is mandatory")
];

