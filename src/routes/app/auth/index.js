const express = require('express');
const getConnection = require('../../../config/database');
const bcryptjs = require('bcryptjs');
const uuid = require('uuid');
const router = express.Router();
const colors = require('colors');

router.get('/signin', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        email,
        password
    } = request.body;
    const sql = ` CALL SP_check(?)`;
    const values = [email];
    connection.query(sql, values, (error, result) => {
        if (error) response.status(200).json({ error: true, status: 500, message: error.message });
        if (result.length > 0) {
            let hashkey = result[0]['0'].cust_akey;
            let comparePass = bcryptjs.compareSync(password, hashkey);
            if (comparePass) {
                response.status(200).json({ error: false, status: 200, message: "success" });
            } else {
                response.status(200).json({ error: false, status: 200, message: "denied" });
            }
        } else {
            response.status(200).json({ error: true, status: 500, message: 'No result' });
        }
    });
    connection.end();
});

router.post('/signup', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        name,
        username,
        email,
        birthday,
        biography
    } = request.body;
    const password = request.body.password;
    let cust_akey = await bcryptjs.hash(password, 8);
    let id = uuid.v5;

    const sql = ` CALL SP_SignUp(?, ?, ? ,?, ?, ?, ?, @result) `;

    const values = [
        id.DNS, name, username, email, cust_akey, birthday, biography
    ];
    connection.query(sql, values, (error, result) => {
        if (error) response.status(200).json({ error: true, status: 500, message: error.message });
        if (result.affectedRows > 0) {
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