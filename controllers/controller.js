const moment = require('moment');
const model = require('../models/model');

// moment().utcOffset("+05:30").format("DD-MM-YYYY HH:mm:ss")
const getIndex = (req, res) => {
    model.getAllData((result) => {
        model.getUsers((users) => {
            res.render('index', {result: result, users: users});
        });
    });  
};

const postTask = (req, res) => {


    const TITLE = req.body._TITLE;
    const DESCRIPTION = req.body._DESCRIPTION;
    const ASSIGN_TO = req.body._ASSIGN_TO;
    const PRIORITY = req.body._PRIORITY;
    const TAG = req.body._TAG;
    const STATUS = 'Yet to start';
    const CREATED_ON = moment().utcOffset("+05:30").format("DD-MM-YYYY HH:mm:ss");

    model.insertTask(TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, TAG, STATUS, CREATED_ON, (fromInsert) => {
        
        model.getAllData((result) => {
            model.getUsers((users) => {
                res.render('index', {result: result, users: users});
            });
        });
    });
};


module.exports = {
    getIndex,
    postTask
}
