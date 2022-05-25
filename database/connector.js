const sqlite = require('sqlite3').verbose();
const path = require('path');

const db_path = path.join(__dirname, 'db.sqlite3');

const appDB = new sqlite.Database(db_path, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.log("error while connecting to DB -- ", err.message);
    }
    console.log(`app connected to DB :: path: ${db_path}`);
});

module.exports = { appDB };

