const db = require('../database/connector');

const getAllData = (callback) => {
    const sql = "SELECT * FROM TRACKER_DATA ORDER BY PRIORITY ASC, CREATED_ON  ASC";

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


module.exports = {
    getAllData,
    getUsers,
    insertTask
}
