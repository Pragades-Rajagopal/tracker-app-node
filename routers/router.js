const { Router } = require('express');
const route = Router();
const controller = require('../controllers/controller');
const validation = require('../validations/validator');

route.get('/prov_ops-tracker-app', controller.getIndex);
route.post('/prov_ops-tracker-app', validation.checkIndex, controller.postTask);
route.get('/prov_ops-tracker-app/task/:ID', controller.viewTask);
route.post('/prov_ops-tracker-app/task/:ID', validation.checkUpdate, controller.updateTask);
route.get('/prov_ops-tracker-app/tasks/closed', controller.getClosedTasks);
route.get('/prov_ops-tracker-app/settings', controller.getSettingsPage);

module.exports = route;

