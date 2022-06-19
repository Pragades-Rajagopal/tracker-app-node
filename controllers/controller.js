const moment = require('moment');
const path = require('path');
const fs = require('fs');
const fastcsv = require('fast-csv');
const model = require('../models/model');
const { validationResult } = require('express-validator');

// moment().utcOffset("+05:30").format("DD-MM-YYYY HH:mm:ss")
const getIndex = (req, res) => {
    model.getAllData((result) => {
        model.getUsers((users) => {
            model.getTags((tags) => {
                res.render('index', {result: result, users: users, tags:tags, errors: {}});
            });
        });
    });  
};

const postTask = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        model.getAllData((result) => {
            model.getUsers((users) => {
                model.getTags((tags) => {
                    res.render('index', {result: result, users: users, tags: tags, errors: errors.mapped()});
                });
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
                model.getTags((tags) => {
                    res.render('index', {result: result, users: users, tags:tags, errors: {}});
                });
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
        model.getTaskCount((count) => {
            res.render('closed-task-page', {result: result, count: count});           
        });
    })
};

const getHideTask = (req, res) => {
    model.getHiddenTasks((result) => {
        res.render('hidden-task-page', {result: result});
    });
};

const hideTask = (req, res) => {
    const id = req.params.ID;

    model.updateIs_Hide(id, 'hide', (result_) => {
        model.getClosedTasks((result) => {
            model.getTaskCount((count) => {
                res.render('closed-task-page', {result: result, count: count});           
            });
        })
    });
};

const unHideTask = (req, res) => {
    const id = req.params.ID;

    model.updateIs_Hide(id, 'unhide', (result_) => {
        model.getHiddenTasks((result) => {
            res.render('hidden-task-page', {result: result});
        });
    });
};

const getSettingsPage = (req, res) => {
    res.render('settings', {errors: {}, actionmsg: null});
};

const postUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('settings', {errors: errors.mapped(), actionmsg: null});
        return;
    }

    var user_nm = req.body.ADDUSER;
    user_nm = user_nm.trim();

    model.addUser(user_nm, (result) => {
        if (result === 'error') {
            res.render('settings', {errors: {}, actionmsg: 'User is already available in the system'});           
            return; 
        }
        res.render('settings', {errors: {}, actionmsg: 'User added in the system'});   
    });
};

const postTag = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('settings', {errors: errors.mapped(), actionmsg: null});
        return;
    }

    var tag_nm = req.body.ADDTAG;
    tag_nm = tag_nm.trim();

    model.addTag(tag_nm, (result) => {
        if (result === 'error') {
            res.render('settings', {errors: {}, actionmsg: 'Tag is already available in the system'});           
            return; 
        }
        res.render('settings', {errors: {}, actionmsg: 'Tag added in the system'}); 
    });
};

const getExportPage = (req, res) => {
    res.render('export-page', {filename: null});
};

const exportOpenTasks = (req, res) => {
    model.exportModel('open', (result) => {
        const filePath = path.resolve(__dirname, '../', 'public', 'exports');
        const filename = 'export_open_issues.csv';
        const endPath = filePath + '\\' + filename;
        
        var ws = fs.createWriteStream(endPath);
        fastcsv.write(
            result,
            {headers: true}   
        ).on("finish", () => {
            res.render('export-page', {filename: filename});
        }).pipe(ws);
    });
}

const exportClosedTasks = (req, res) => {
    model.exportModel('closed', (result) => {
        const filePath = path.resolve(__dirname, '../', 'public', 'exports');
        const filename = 'export_closed_issues.csv';
        const endPath = filePath + '\\' + filename;
        
        var ws = fs.createWriteStream(endPath);
        fastcsv.write(
            result,
            {headers: true}   
        ).on("finish", () => {
            res.render('export-page', {filename: filename});
        }).pipe(ws);
    });
}

const exportAllTasks = (req, res) => {
    model.exportModel('all', (result) => {
        const filePath = path.resolve(__dirname, '../', 'public', 'exports');
        const filename = 'export_all_issues.csv';
        const endPath = filePath + '\\' + filename;
        
        var ws = fs.createWriteStream(endPath);
        fastcsv.write(
            result,
            {headers: true}   
        ).on("finish", () => {
            res.render('export-page', {filename: filename});
        }).pipe(ws);
    });
};

const getL3page = (req, res) => {
    model.getOpenL3issues((result) => {
        res.render('l3-home', {'results': result});
    });
};

const getAddL3page = (req, res) => {
    model.getRaisedByUsers((users) => {
        res.render('l3-create', {'users': users, errors: {}, actionmsg: null});
    });
};

const addL3issue = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        model.getRaisedByUsers((users) => {
            res.render('l3-create', {'users': users, errors: errors.mapped(), actionmsg: null});
        });
        return;
    }

    const L3_name = req.body.L3_NAME;
    const raised_by = req.body.RAISED_BY;
    const prio = req.body.PRIORITY;
    const open_dt = req.body.OPEN_DATE;
    const itsm_no = req.body.ITSM_NO;
    const jira_id = req.body.JIRA_ID;
    const mail_sub = req.body.MAIL;
    const comments = req.body.COMMENTS;
    const owner = req.body.OWNER;
    const status = req.body.STATUS;
    const close_dt = req.body.CLOSED_ON;
    const remark = req.body.REMARK;

    const args = {
        'L3_name': L3_name,
        'raised_by': raised_by,
        'prio': prio,
        'open_dt': open_dt,
        'itsm_no': itsm_no,
        'jira_id': jira_id,
        'mail_sub': mail_sub,
        'comments': comments,
        'owner': owner,
        'status': status,
        'close_dt': close_dt,
        'remark': remark
    };

    model.insertL3issue(args, (result) => {
        model.getRaisedByUsers((users) => {
            res.render('l3-create', {'users': users, errors: {}, actionmsg: 'L3 issue added successfully'});
        });
    });
};

const getL3issue = (req, res) => {
    const id = req.params.ID;

    model.getL3byId(id, (result) => {
        model.getRaisedByUsers((users) => {
            res.render('l3-update', {result: result, users: users, errors: {}, actionmsg: null})
        });
    });
};

const putL3issue = (req, res) => {
    const id = req.params.ID;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        model.getL3byId(id, (result) => {
            model.getRaisedByUsers((users) => {
                res.render('l3-update', {result: result, users: users, errors: errors.mapped(), actionmsg: null})
            });
        });
        return;
    }

    const L3_name = req.body.L3_NAME;
    const raised_by = req.body.RAISED_BY;
    const prio = req.body.PRIORITY;
    const open_dt = req.body.OPEN_DATE;
    const itsm_no = req.body.ITSM_NO;
    const jira_id = req.body.JIRA_ID;
    const mail_sub = req.body.MAIL;
    const comments = req.body.COMMENTS;
    const owner = req.body.OWNER;
    const status = req.body.STATUS;
    const close_dt = req.body.CLOSED_ON;
    const remark = req.body.REMARK;

    const args = {
        'L3_name': L3_name,
        'raised_by': raised_by,
        'prio': prio,
        'open_dt': open_dt,
        'itsm_no': itsm_no,
        'jira_id': jira_id,
        'mail_sub': mail_sub,
        'comments': comments,
        'owner': owner,
        'status': status,
        'close_dt': close_dt,
        'remark': remark,
        'id': id
    };

    model.updateL3byId(args, (result_) => {
        model.getL3byId(id, (result) => {
            model.getRaisedByUsers((users) => {
                res.render('l3-update', {result: result, users: users, errors: errors.mapped(), actionmsg: 'Details updated successfully'})
            });
        });
    });
};

const getClosedL3page = (req, res) => {
    model.getClosedL3issues((result) => {
        res.render('l3-closed', {'results': result});
    });
};

const exportL3issues = (req, res) => {
    model.exportModel('l3issues', (result) => {
        const filePath = path.resolve(__dirname, '../', 'public', 'exports');
        const filename = 'export_L3_issues.csv';
        const endPath = filePath + '\\' + filename;
        
        var ws = fs.createWriteStream(endPath);
        fastcsv.write(
            result,
            {headers: true}   
        ).on("finish", () => {
            res.render('export-page', {filename: filename});
        }).pipe(ws);
    });
}

module.exports = {
    getIndex,
    postTask,
    viewTask,
    updateTask,
    getClosedTasks,
    getSettingsPage,
    postUser,
    postTag,
    hideTask,
    unHideTask,
    getHideTask,
    getExportPage,
    exportOpenTasks,
    exportClosedTasks,
    exportAllTasks,
    getL3page,
    getAddL3page,
    addL3issue,
    getL3issue,
    putL3issue,
    exportL3issues,
    getClosedL3page
}
