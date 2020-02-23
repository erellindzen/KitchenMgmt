const express = require('express');
const router = express.Router();
const navBl = require('../bl/nav');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  let userObj = jwt.decode(req.headers.authorization.split(' ')[1], {complete: true});
  navBl.getByRole(userObj.payload.role)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
    });
});

router.get('/:id', (req, res) => {
  navBl.getById(req.params.id)
      .then(data => res.send(data))
      .catch(err => {
        console.log(err.msg);
        res.sendStatus(err.code);
      });
});

router.post('/', (req, res) => {
  navBl.create(req.body.title, req.body.roles, req.body.navigation)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

router.put('/', (req, res) => {
  navBl.update(req.body.id, req.body.title, req.body.roles, req.body.navigation)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

router.delete('/:id', (req, res) => {
  navBl.delete(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

module.exports = router;
