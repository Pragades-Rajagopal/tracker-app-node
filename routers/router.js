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
route.get('/prov_ops-tracker-app/L3_tracker', controller.getL3page);
route.get('/prov_ops-tracker-app/L3_tracker/add', controller.getAddL3page);
route.post('/prov_ops-tracker-app/L3_tracker/add', validation.addL3, controller.addL3issue);
route.get('/prov_ops-tracker-app/L3_tracker/view/:ID', controller.getL3issue);
route.post('/prov_ops-tracker-app/L3_tracker/view/:ID/update-details', validation.addL3, controller.putL3issue);
route.get('/prov_ops-tracker-app/L3_tracker/closed', controller.getClosedL3page);
route.get('/prov_ops-tracker-app/exports/L3-issues', controller.exportL3issues)

module.exports = route;

