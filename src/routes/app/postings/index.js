const express = require('express');
const getConnection = require('../../../config/database');
const date = require('date-and-time');
const {
    v4: uuidv4,
} = require('uuid');
const router = express.Router();

router.post('/newPosting', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        description,
        idUser
    } = request.body;
    let id = uuidv4();
    const now = new Date();
    date.format(now, 'YYYY/MM/DD HH:mm:ss');
    const sql = ` CALL SP_newPosting(?, ?, ?, ?, @result) `;
    const values = [
        id, description, idUser, date.format(now, 'YYYY/MM/DD HH:mm:ss')
    ];
    connection.query(sql, values, (error, result) => {
        if (error) response.status(200).json({ error: true, status: 500, message: error.message });
        if (result.length > 0) {
            response.status(200).json({
                error: false,
                status: 200,
                message: {
                    response: result[0],
                    message: "Success"
                }
            });
        } else {
            response.status(200).json({ error: true, status: 500, message: 'No result' });
        }
    });
    connection.end();
});

module.exports = router;