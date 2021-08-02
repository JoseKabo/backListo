const express = require('express');
const getConnection = require('../../../config/database');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const colors = require('colors');

router.post('/signin', async(request, response) => {
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
        if (result[0].length > 0) {
            let hashkey = result[0]['0'].cust_akey;
            let comparePass = bcryptjs.compareSync(password, hashkey);
            if (comparePass) {
                response.status(200).json({
                    error: false,
                    status: 200,
                    result: {
                        id: result[0]['0'].id,
                        name: result[0]['0'].name,
                        username: result[0]['0'].username,
                        email: result[0]['0'].email,
                        birthday: result[0]['0'].birthday,
                        biography: result[0]['0'].biography
                    }
                });
            } else {
                response.status(200).json({ error: true, status: 200, result: '' });
            }
        } else {
            response.status(200).json({ error: true, status: 500, result: '' });
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
        birthday
    } = request.body;
    const password = request.body.password;
    let cust_akey = await bcryptjs.hash(password, 8);
    let id = uuidv4();
    const sql = ` CALL SP_SignUp(?, ?, ? ,?, ?, ?, @result) `;

    const values = [
        id, name, username, email, cust_akey, birthday
    ];
    connection.query(sql, values, (error, result) => {
        if (error) response.status(200).json({ error: true, status: 500, message: error.message });
        if (result[1].affectedRows > 0) {
            response.status(200).json({
                error: false,
                status: 200,
                message: result[0][0].result
            });
        } else {
            response.status(200).json({ error: true, status: 400, message: result[0][0].result });
        }
    });
    connection.end();
});


module.exports = router;