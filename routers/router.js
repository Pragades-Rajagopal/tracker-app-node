const { Router } = require('express');
const route = Router();
const controller = require('../controllers/controller');

route.get('/tracker-app', controller.getIndex);
route.post('/tracker-app', controller.postTask);

module.exports = route;

