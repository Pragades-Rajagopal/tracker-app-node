const moment = require('moment');
const model = require('../models/model');
const { validationResult } = require('express-validator');

// moment().utcOffset("+05:30").format("DD-MM-YYYY HH:mm:ss")
const getIndex = (req, res) => {
    model.getAllData((result) => {
        model.getUsers((users) => {
            res.render('index', {result: result, users: users, errors: {}});
        });
    });  
};

const postTask = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        model.getAllData((result) => {
            model.getUsers((users) => {
                res.render('index', {result: result, users: users, errors: errors.mapped()});
            });
        });
        return;
    }

    const TITLE = req.body._TITLE;
    const DESCRIPTION = req.body._DESCRIPTION;
    const ASSIGN_TO = req.body._ASSIGN_TO;
    const PRIORITY = req.body._PRIORITY;
    var TAG = req.body._TAG;
    const STATUS = 'Yet to start';
    const CREATED_ON = moment().utcOffset("+05:30").format("DD-MM-YYYY HH:mm:ss");
    // let mapTAG;

    // if (TAG !== undefined) {
    //     mapTAG = TAG.map((element) => {
    //         return element = element.charAt(0) === '>' ? element.substring(1) : element;
    //     });
    // }
    
    model.insertTask(TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, TAG, STATUS, CREATED_ON, (fromInsert) => {
        
        model.getAllData((result) => {
            model.getUsers((users) => {
                res.render('index', {result: result, users: users, errors: {}});
            });
        });
    });
};

const viewTask = (req, res) => {
    const id = req.params.ID;
    model.getTask(id, (result) => {
        model.getUsers((users) => {
            res.render('taskpage', {result: result, users: users, errors: {}});
        });
    });
};

const updateTask = (req, res) => {
    const ID = req.params.ID;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        model.getTask(ID, (result) => {
            model.getUsers((users) => {
                res.render('taskpage', {result: result, users: users, errors: errors.mapped()});
            });
        });
        return;
    }

    const TITLE = req.body._TITLE;
    const DESCRIPTION = req.body._DESCRIPTION;
    const ASSIGN_TO = req.body._ASSIGN_TO;
    const PRIORITY = req.body._PRIORITY;
    const STATUS = req.body._STATUS;
    var TAG = req.body._TAG;
    const MODIFIED_ON = moment().utcOffset("+05:30").format("DD-MM-YYYY HH:mm:ss");
    let COMMENTS = null;
    
    // let mapTAG = null;

    // if (TAG !== undefined) {
    //     mapTAG = TAG.map((element) => {
    //         return element = element.charAt(0) === '>' ? element.substring(1) : element;
    //     });
    // }

    if (STATUS === 'Closed') {
        COMMENTS = `Closed on ${MODIFIED_ON} IST`;
    }

    model.patchTask(ID, TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, STATUS, TAG, MODIFIED_ON, COMMENTS, (fromPatch) => {
        model.getTask(ID, (result) => {
            model.getUsers((users) => {
                res.render('taskpage', {result: result, users: users, errors: {}});
            });
        });
    });
};

const getClosedTasks = (req, res) => {
    model.getClosedTasks((result) => {
        res.render('closed-task-page', {result: result});
    })
};

const getSettingsPage = (req, res) => {
    res.render('settings');
};


module.exports = {
    getIndex,
    postTask,
    viewTask,
    updateTask,
    getClosedTasks,
    getSettingsPage
}
