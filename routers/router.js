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
route.post('/prov_ops-tracker-app/settings/add-user', validation.checkAddUser, controller.postUser);
route.post('/prov_ops-tracker-app/settings/add-tag', validation.checkAddTag, controller.postTag);
route.post('/prov_ops-tracker-app/task/:ID/hide', controller.hideTask);
route.post('/prov_ops-tracker-app/tasks/closed/unhide/:ID', controller.unHideTask);
route.get('/prov_ops-tracker-app/tasks/closed/hide', controller.getHideTask);
route.get('/prov_ops-tracker-app/exports', controller.getExportPage);
route.get('/prov_ops-tracker-app/exports/open-task', controller.exportOpenTasks);
route.get('/prov_ops-tracker-app/exports/closed-task', controller.exportClosedTasks);
route.get('/prov_ops-tracker-app/exports/all', controller.exportAllTasks);

module.exports = route;

