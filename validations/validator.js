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

exports.checkAddUser = [
    check('ADDUSER')
    .isLength({min:1})
    .withMessage('User name is mandatory')
];

exports.checkAddTag = [
    check('ADDTAG')
    .isLength({min:1})
    .withMessage('Tag is mandatory')
];

exports.addL3 = [
    check('L3_NAME')
    .isLength({min:1})
    .withMessage('L3 Issue title is mandatory'),
    check('RAISED_BY')
    .isLength({min:1})
    .withMessage('User is mandatory'),
    check('PRIORITY')
    .isLength({min:1})
    .withMessage('Priority is mandatory'),
    check('OPEN_DATE')
    .isLength({min:1})
    .withMessage('Date is mandatory'),
    check('STATUS')
    .isLength({min:1})
    .withMessage('Status is mandatory')
];


