const express = require('express');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const auth_params = require('../custom_model/auth_params');
const userBl = require('../BL/user')

const router = express.Router();

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    
    userBl.getByUserPassword(username, password)
        .then(user => {
            if(!user){
                res.sendStatus(204);
            }
            else{
                const newUser = {
                    'username': user.username,
                    'role': user.role 
                };
                const token = jwt.sign(newUser, auth_params.SECRET, { expiresIn: auth_params.refreshTokenDuaration });
                const refreshToken = randtoken.uid(256);
                userBl.updateRefreshToken(user.id, refreshToken)
                    .then(user => res.json({jwt: token, refreshToken: refreshToken}))
                    .catch(err => {
                        console.log(err);
                        res.sendStatus(500);
                    })
                
            }
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.post('/register', (req, res) => {
    const {username, firstName, lastName, password, password2} = req.body;
    
    userBl.getByUsername(username)
        .then(user => res.sendStatus(400))
        .catch(err => {
            if(err.code != 204){
                console.log(err);
                res.sendStatus(err.code);
            }
            else{
                const newUser = {
                    'username': username,
                    'firstName': firstName,
                    'lastName': lastName,
                    'role': 'cook' 
                };
                const token = jwt.sign(newUser, auth_params.SECRET, { expiresIn: auth_params.refreshTokenDuaration });
                const refreshToken = randtoken.uid(256);
                userBl.create(username, firstName, lastName, password, 'cook', refreshToken)
                    .then(user => res.json({jwt: token, refreshToken: refreshToken}))
                    .catch(err => {
                        console.log(err);
                        res.sendStatus(500);
                    }); 
            }
        });
});

router.post('/logout', (req, res) => {
    const refreshToken = req.body.refreshToken;

    userBl.getByRefreshToken(refreshToken)
        .then(data => {
            if(data){
                userBl.updateRefreshToken(data.id, 'none');
            }
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    res.sendStatus(204);
});

router.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;

    if(refreshToken === 'none'){
        res.sendStatus(401);
    }

    userBl.getByRefreshToken(refreshToken)
        .then(data => {
            if(!data){
                res.sendStatus(401);
            }
            const user = {
                'username': data.username,
                'role': data.role
            };
            const token = jwt.sign(user, auth_params.SECRET, { expiresIn: auth_params.refreshTokenDuaration });
            res.json({ jwt: token });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(401);
        })
});

module.exports = router;
