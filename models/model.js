const db = require('../database/connector');

const getAllData = (callback) => {
    const sql = "SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON,CASE PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIORITY,COMMENTS FROM (SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON,PRIORITY,COMMENTS FROM TRACKER_DATA WHERE STATUS <> 'Closed' ORDER BY PRIORITY ASC, CREATED_ON  ASC)";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getAllData in models :: ", err.message);
        }
        callback(rows);
    });
};

const insertTask = (TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, TAG, STATUS, CREATED_ON, callback) => {
    const sql = "INSERT INTO TRACKER_DATA (TITLE, DESCRIPTION, ASSIGNED_TO, PRIORITY, TAGS, STATUS, CREATED_ON) VALUES (?,?,?,?,?,?,?)";

    db.appDB.run(sql, [TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, TAG, STATUS, CREATED_ON], (err, result) => {
        if (err) {
            callback("error at insertTask in models :: ", err.message);
        }
        callback(result)
    })
};

const getUsers = (callback) => {
    const sql = "SELECT * FROM USERS ORDER BY NAME";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getUsers in models :: ", err.message);
        }
        callback(rows);
    });
};

const getTask = (id, callback) => {
    const sql = "SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON, PRIORITY, CASE PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS D_PRIORITY,COMMENTS FROM (SELECT * FROM TRACKER_DATA WHERE ID = ?)";

    db.appDB.get(sql, [id], (err, result) => {
        if (err) {
            callback("error at getTask in models :: ", err.message);
        }
        callback(result);
    });
};

const patchTask = (ID, TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, STATUS, TAG, MODIFIED_ON, COMMENTS, callback) => {
    const sql = "UPDATE TRACKER_DATA SET TITLE = ?, DESCRIPTION = ?, ASSIGNED_TO = ?, PRIORITY = ?, STATUS = ?, TAGS = ?, MODIFIED_ON = ?, COMMENTS = ? WHERE ID = ?";

    db.appDB.run(sql, [TITLE, DESCRIPTION, ASSIGN_TO, PRIORITY, STATUS, TAG, MODIFIED_ON, COMMENTS, ID], (err, result) => {
        if (err) {
            callback("error at patchTask in models :: ", err.message);
        }
        callback(result);
    });
};

const getClosedTasks = (callback) => {
    const sql = "SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON,CASE PRIORITY WHEN '1' THEN 'Critical' WHEN '2' THEN 'High' WHEN '3' THEN 'Medium' WHEN '4' THEN 'Low' END AS PRIORITY,COMMENTS FROM (SELECT ID,TITLE,DESCRIPTION,ASSIGNED_TO,STATUS,TAGS,CREATED_ON,MODIFIED_ON,PRIORITY,COMMENTS FROM TRACKER_DATA WHERE STATUS = 'Closed' ORDER BY MODIFIED_ON DESC)";

    db.appDB.all(sql, [], (err, rows) => {
        if (err) {
            callback("error at getClosedTasks in models :: ", err.message);
        }
        callback(rows);
    });
};

module.exports = {
    getAllData,
    getUsers,
    insertTask,
    getTask,
    patchTask,
    getClosedTasks
}
