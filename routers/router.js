const { Router } = require('express');
const route = Router();
const controller = require('../controllers/controller');
const validation = require('../validations/validator');

route.get('/prov_ops-tracker-app', controller.getIndex);
route.post('/prov_ops-tracker-app', validation.checkIndex, controller.postTask);
route.get('/prov_ops-tracker-app/issue/:ID', controller.viewTask);
route.post('/prov_ops-tracker-app/issue/:ID', validation.checkUpdate, controller.updateTask);
route.get('/prov_ops-tracker-app/issues/closed', controller.getClosedTasks);
route.get('/prov_ops-tracker-app/settings', controller.getSettingsPage);
route.post('/prov_ops-tracker-app/settings/add-user', validation.checkAddUser, controller.postUser);
route.post('/prov_ops-tracker-app/settings/add-tag', validation.checkAddTag, controller.postTag);
route.post('/prov_ops-tracker-app/issue/:ID/hide', controller.hideTask);
route.post('/prov_ops-tracker-app/issue/closed/unhide/:ID', controller.unHideTask);
route.get('/prov_ops-tracker-app/issues/closed/hide', controller.getHideTask);
route.get('/prov_ops-tracker-app/exports', controller.getExportPage);
route.get('/prov_ops-tracker-app/exports/open-issues', controller.exportOpenTasks);
route.get('/prov_ops-tracker-app/exports/closed-issues', controller.exportClosedTasks);
route.get('/prov_ops-tracker-app/exports/all', controller.exportAllTasks);

module.exports = route;

