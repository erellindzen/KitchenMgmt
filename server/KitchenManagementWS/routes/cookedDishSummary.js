const express = require('express');
const router = express.Router();
const cookedDishBl = require('../bl/cookedDishSummary');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  cookedDishBl.getAll()
        .then(data => res.send(data))
        .catch(err => {
            console.log(err.msg);
            res.sendStatus(err.code);
        });
});

router.get('/from/:fromDate/to/:toDate', (req, res) => {
  cookedDishBl.getByDate(req.params.fromDate, req.params.toDate)
        .then(data => res.send(data))
        .catch(err => {
            console.log(err.msg);
            res.sendStatus(err.code);
        });
});

router.get('/notReady', (req, res) => {
  let userObj = jwt.decode(req.headers.authorization.split(' ')[1], {complete: true});
  cookedDishBl.getNotReadyByUser(userObj.payload.username)
        .then(data => res.send(data))
        .catch(err => {
            console.log(err.msg);
            res.sendStatus(err.code);
        });
});

router.get('/:id', (req, res) => {
  cookedDishBl.getById(req.params.id)
      .then(data => res.send(data))
      .catch(err => {
        console.log(err.msg);
        res.sendStatus(err.code);
      });
});

router.post('/', (req, res) => {
  cookedDishBl.create(req.body.dishId, req.body.userId)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err);
      res.sendStatus(err.code);
  });
});

router.put('/', (req, res) => {
  cookedDishBl.setCookedDate(req.body.id)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

module.exports = router;
