const mysql = require('mysql');

const getConnection = () => mysql.createConnection({
    host: 'sql397.main-hosting.eu',
    user: 'u960673546_JoKaMe06Listo9',
    password: 'XfW]6;1K*0Zw',
    database: 'u960673546_listo_dev'
});

module.exports = getConnection;