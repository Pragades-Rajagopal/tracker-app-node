const db = require('../database/connector');

const getAllData = (callback) => {
    const sql = "SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON,CASE PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIORITY,COMMENTS FROM (SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON,PRIORITY,COMMENTS FROM TRACKER_DATA WHERE STATUS <> 'Closed' ORDER BY PRIORITY ASC, ID ASC)";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getAllData in models :: ", err.message);
            return;
        }
        callback(rows);
    });
};

const insertTask = (TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, TAG, STATUS, CREATED_ON, callback) => {
    const sql = "INSERT INTO TRACKER_DATA (TITLE, DESCRIPTION, ASSIGNED_TO, PRIORITY, TAGS, STATUS, CREATED_ON, IS_HIDE) VALUES (?,?,?,?,?,?,?,?)";

    db.appDB.run(sql, [TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, TAG, STATUS, CREATED_ON, 'N'], (err, result) => {
        if (err) {
            callback("error at insertTask in models :: ", err.message);
            return;
        }
        callback(result)
    })
};

const getUsers = (callback) => {
    const sql = "SELECT * FROM USERS ORDER BY NAME";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getUsers in models :: ", err.message);
            return;
        }
        callback(rows);
    });
};

const getTags = (callback) => {
    const sql = "SELECT * FROM TAGS ORDER BY TAG_NM";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getTags in models :: ", err.message);
            return;
        }
        callback(rows);
    });
};

const getTask = (id, callback) => {
    const sql = "SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON, PRIORITY, CASE PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS D_PRIORITY,COMMENTS, IS_HIDE FROM (SELECT * FROM TRACKER_DATA WHERE ID = ?)";

    db.appDB.get(sql, [id], (err, result) => {
        if (err) {
            callback("error at getTask in models :: ", err.message);
            return;
        }
        callback(result);
    });
};

const patchTask = (ID, TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, STATUS, TAG, MODIFIED_ON, COMMENTS, callback) => {
    const sql = "UPDATE TRACKER_DATA SET TITLE = ?, DESCRIPTION = ?, ASSIGNED_TO = ?, PRIORITY = ?, STATUS = ?, TAGS = ?, MODIFIED_ON = ?, COMMENTS = ? WHERE ID = ?";

    db.appDB.run(sql, [TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, STATUS, TAG, MODIFIED_ON, COMMENTS, ID], (err, result) => {
        if (err) {
            callback("error at patchTask in models :: ", err.message);
            return;
        }
        callback(result);
    });
};

const getClosedTasks = (callback) => {
    const sql = "SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON,CASE PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIORITY,COMMENTS FROM (SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON,PRIORITY,COMMENTS FROM TRACKER_DATA WHERE STATUS = 'Closed' AND IS_HIDE <> 'Y' ORDER BY ID DESC)";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getClosedTasks in models :: ", err.message);
            return;
        }
        callback(rows);
    });
};

const getHiddenTasks = (callback) => {
    const sql = "SELECT ID, TITLE FROM TRACKER_DATA WHERE STATUS = 'Closed' AND IS_HIDE = 'Y' ORDER BY ID DESC";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getHiddenTasks in models :: ", err.message);
        }
        callback(rows);
    });
};

const updateIs_Hide = (id, action, callback) => {
    const sql_hide = "UPDATE TRACKER_DATA SET IS_HIDE = 'Y' WHERE ID = ?";
    const sql_unhide = "UPDATE TRACKER_DATA SET IS_HIDE = 'N' WHERE ID = ?";

    if (action === 'hide') {
        db.appDB.run(sql_hide, [id], (err, result) => {
            if (err) {
                callback("error at updateHide in models :: ", err);
                return;
            }
            callback(result);
        })
        return;
    }
    else if (action === 'unhide') {
        db.appDB.run(sql_unhide, [id], (err, result) => {
            if (err) {
                callback("error at updateHide in models :: ", err);
                return;
            }
            callback(result);
        })
        return;
    }
    
};

const addUser = (user_nm, callback) => {
    const sql = "INSERT INTO USERS (NAME) VALUES (?)";

    db.appDB.run(sql, [user_nm], (err, result) => {
        if (err) {
            callback('error');
            return;
        }
        callback(result);
    });
};

const addTag = (tag_nm, callback) => {
    const sql = "INSERT INTO TAGS (TAG_NM) VALUES (?)";

    db.appDB.run(sql, [tag_nm], (err, result) => {
        if (err) {
            callback('error');
            return;
        }
        callback(result);
    });
};

const getTaskCount = (callback) => {
    const sql = "SELECT * FROM TASK_COUNT_V";

    db.appDB.all(sql, [], (err, result) => {
        callback(result);
    });
}

// this function will handle all the data fetch operations for export options
const exportModel = (action, callback) => {
    if (action === 'open') {
        const sql = "SELECT ID AS ISSUE_ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,CASE PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIORITY,TAGS,CREATED_ON,MODIFIED_ON,COMMENTS,IS_HIDE FROM TRACKER_DATA WHERE STATUS <> 'Closed' ORDER BY ID DESC";
        db.appDB.all(sql, [], (err, rows) => {
            callback(rows);
        });
        return;
    }
    else if (action === 'closed') {
        const sql = "SELECT ID AS ISSUE_ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,CASE PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIORITY,TAGS,CREATED_ON,MODIFIED_ON,COMMENTS,IS_HIDE FROM TRACKER_DATA WHERE STATUS = 'Closed' ORDER BY ID DESC";
        db.appDB.all(sql, [], (err, rows) => {
            callback(rows);
        });
        return;
    }
    else if (action === 'all') {
        const sql = "SELECT ID AS ISSUE_ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,CASE PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIORITY,TAGS,CREATED_ON,MODIFIED_ON,COMMENTS,IS_HIDE FROM TRACKER_DATA ORDER BY ID DESC";
        db.appDB.all(sql, [], (err, rows) => {
            callback(rows);
        });
        return;
    }

    else if (action === 'l3issues') {
        const sql = "SELECT L.ISSUE_NAME 'L3_ISSUE', L.ITSM_L3, L.JIRA_ID, L.RAISED_BY, L.CREATED_ON 'RAISED_ON', CASE L.PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIORITY, L.MAIL_SUB 'MAIL_SUBJECT', L.COMMENTS, L.OWNERSHIP, L.STATUS, L.CLOSED_ON, L.REMARKS 'REMARK' FROM (SELECT * FROM L3_TRACKER ORDER BY PRIORITY ASC, ID ASC) L";
        db.appDB.all(sql, [], (err, rows) => {
            callback (rows);
        });
        return;
    }
};

const getRaisedByUsers = (callback) => {
    const sql = "SELECT * FROM USERS WHERE NAME NOT LIKE '%-%' ORDER BY NAME";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getUsers in models :: ", err.message);
            return;
        }
        callback(rows);
    });
};

const getOpenL3issues = (callback) => {
    const sql = "SELECT CASE L.PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIO, L.* FROM (SELECT * FROM L3_TRACKER ORDER BY PRIORITY ASC, ID ASC) L WHERE UPPER(L.STATUS) NOT LIKE '%CLOSED%'";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getL3issues in models :: ", err.message);
            return;
        }
        callback(rows);
    });
};

const getClosedL3issues = (callback) => {
    const sql = "SELECT CASE L.PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIO, L.* FROM (SELECT * FROM L3_TRACKER ORDER BY PRIORITY ASC, ID ASC) L WHERE UPPER(L.STATUS) LIKE '%CLOSED%'";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getL3issues in models :: ", err.message);
            return;
        }
        callback(rows);
    });
};

const insertL3issue = (args, callback) => {
    const sql = "INSERT INTO L3_TRACKER (ISSUE_NAME, RAISED_BY, PRIORITY, CREATED_ON, ITSM_L3, JIRA_ID, MAIL_SUB, COMMENTS, OWNERSHIP, STATUS, CLOSED_ON, REMARKS) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)"

    db.appDB.run(sql, [args.L3_name, args.raised_by, args.prio, args.open_dt, args.itsm_no, args.jira_id, args.mail_sub, args.comments, args.owner, args.status, args.close_dt, args.remark], (err, result) => {
        if (err) {
            callback("error at insertL3issue in models :: ", err.message);
            return;
        }
        callback(result);
    });
};

const getL3byId = (id, callback) => {
    const sql = "SELECT CASE L.PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIO, L.* FROM (SELECT * FROM L3_TRACKER) L WHERE L.ID = ?";

    db.appDB.get(sql, [id], (err, result) => {
        if (err) {
            callback("error at getL3byId in models :: ", err.message);
            return;
        }
        callback(result);
    });
};

const updateL3byId = (args, callback) => {
    const sql = "UPDATE L3_TRACKER SET ISSUE_NAME = ?, RAISED_BY = ?, PRIORITY = ?, CREATED_ON = ?, ITSM_L3 = ?, JIRA_ID = ?, MAIL_SUB = ?, COMMENTS = ?, OWNERSHIP = ?, STATUS = ?, CLOSED_ON = ?, REMARKS = ? WHERE ID = ?";

    db.appDB.run(sql, [args.L3_name, args.raised_by, args.prio, args.open_dt, args.itsm_no, args.jira_id, args.mail_sub, args.comments, args.owner, args.status, args.close_dt, args.remark, args.id], (err, result) => {
        if (err) {
            callback ("error at updateL3byId in models :: ", err);
            return;
        }
        callback('success');
    });
};


module.exports = {
    getAllData,
    getUsers,
    insertTask,
    getTask,
    patchTask,
    getClosedTasks,
    getTags,
    addUser,
    addTag,
    getTaskCount,
    updateIs_Hide,
    getHiddenTasks,
    exportModel,
    getRaisedByUsers,
    getOpenL3issues,
    getClosedL3issues,
    insertL3issue,
    getL3byId,
    updateL3byId
}
