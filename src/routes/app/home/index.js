const express = require('express');
const getConnection = require('../../../config/database');
const bcryptjs = require('bcryptjs');
const uuid = require('uuid');
const router = express.Router();
const colors = require('colors');

router.get('/getAllPosts', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const sql = ` CALL 	SP_getAllPosting() `;
    connection.query(sql, (error, result) => {
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