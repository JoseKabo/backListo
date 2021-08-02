const express = require('express');
const getConnection = require('../../../config/database');
const bcryptjs = require('bcryptjs');
const uuid = require('uuid');
const router = express.Router();
const colors = require('colors');

router.post('/changeInfo', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        id,
        email,
        birthday,
        biography
    } = request.body;
    const sql = ` CALL SP_alterUser(?, ?, ?, ?) `;
    const values = [
        id, email, birthday, biography
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

router.post('/changePass', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }

    });
    const {
        id,
        lastPassword,
        newPassword
    } = request.body;
    const sql = ` CALL SP_checkPass(?, @result)`;
    const values = [id];
    connection.query(sql, values, async(error, result) => {
        if (error) response.status(200).json({ error: true, status: 500, message: error.message });
        if (result[0].length > 0) {
            const hashkey = result[0]['0'].result;
            const comparePass = bcryptjs.compareSync(lastPassword, hashkey);
            if (comparePass) {
                const newPasswordBc = await bcryptjs.hash(newPassword, 8);
                const newSql = ` CALL SP_updatePass(?, ?, @result)`;
                const newValues = [id, newPasswordBc];
                await updatePasse(newSql, newValues);

            } else {
                response.status(200).json({ error: true, status: 200, message: 'Contrasñas incorrectas' });
            }
        } else {
            response.status(200).json({ error: true, status: 500, message: '' });
        }
    });
    connection.end();

    const updatePasse = async(newSql, newValues) => {
        connection = getConnection();
        connection.connect(error => {
            if (error) {
                console.log(error);
                response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
            }
        });
        connection.query(newSql, newValues, async(error, result) => {
            if (error) {
                response.status(200).json({ error: true, status: 500, message: error.message });
            }
            if (result[1].affectedRows == 1 && result[0]['0'].result == '1') {
                response.status(200).json({ error: false, status: 200, message: 'Contraseña actualizada' });
            } else {
                response.status(200).json({ error: true, status: 500, message: '' });
            }
        });
        connection.end();
    }

});

router.post('/myposts', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        id
    } = request.body;
    const sql = ` CALL SP_getOnlyMyPostings(?) `;
    const values = [
        id
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

router.post('/mybasicinfo', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        id
    } = request.body;
    const sql = ` CALL SP_getBasicInfo(?) `;
    const values = [
        id
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

router.post('/mystadistics', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        id
    } = request.body;
    const sql = ` CALL 	SP_getStadistics(?) `;
    const values = [
        id
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

router.delete('/deletePost', async(request, response) => {
    connection = getConnection();
    connection.connect(error => {
        if (error) {
            console.log(error);
            response.status(200).json({ error: true, status: 500, message: "ERROR_SERVER" });
        }
    });
    const {
        idUser,
        idPost
    } = request.body;
    const sql = ` CALL SP_deletePosting(?, ?, @result) `;
    const values = [
        idUser, idPost
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