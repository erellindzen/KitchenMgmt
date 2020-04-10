const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userBl = require('../bl/user');

router.get('/', (req, res) => {
  userBl.getCooks()
    .then(data => res.send(data))
    .catch(err => {
      res.sendStatus(err.code);
    });
});

module.exports = router;
