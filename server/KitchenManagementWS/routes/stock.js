const express = require('express');
const router = express.Router();
const stockBl = require('../bl/stock.js');

router.get('/', (req, res) => {
  stockBl.getAll()
        .then(data => res.send(data))
        .catch(err => {
            console.log(err.msg);
            res.sendStatus(err.code);
        });
});

router.get('/:id', (req, res) => {
  stockBl.getById(req.params.id)
      .then(data => res.send(data))
      .catch(err => {
        console.log(err.msg);
        res.sendStatus(err.code);
      });
});

router.get('/ingredient/:ingredientId', (req, res) => {
  stockBl.getByIngredient(req.params.ingredientId)
      .then(data => res.send(data))
      .catch(err => {
        console.log(err.msg);
        res.sendStatus(err.code);
      });
});

router.post('/', (req, res) => {
  stockBl.create(req.body.ingredientId, 
                 req.body.quantity, 
                 req.body.expirationDate)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

router.put('/', (req, res) => {
  stockBl.update(req.body.id, 
                 req.body.ingredientId, 
                 req.body.quantity, 
                 req.body.expirationDate)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

router.delete('/:id', (req, res) => {
  stockBl.delete(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

module.exports = router;
