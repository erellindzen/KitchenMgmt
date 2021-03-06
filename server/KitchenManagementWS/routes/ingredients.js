const express = require('express');
const router = express.Router();
const dishBl = require('../bl/ingredients');

router.get('/', (req, res) => {
  dishBl.getIngredientsStatus()
    .then(data => res.send(data))
    .catch(err => {
        res.sendStatus(err.code);
    });
});

router.get('/:id', (req, res) => {
  dishBl.getById(req.params.id)
      .then(data => res.send(data))
      .catch(err => {
        res.sendStatus(err.code);
      });
});

router.post('/', (req, res) => {
  dishBl.create(req.body.title, 
                req.body.unitTitle, 
                req.body.threshold,
                req.body.price,  
                req.body.canExpired)
    .then(data => res.send(data))
    .catch(err => {
      res.sendStatus(err.code);
  });
});

router.put('/', (req, res) => {
  dishBl.update(req.body.id, 
                req.body.title, 
                req.body.unitTitle,
                req.threshold, 
                req.body.price,
                req.body.canExpired)
    .then(data => res.send(data))
    .catch(err => {
      res.sendStatus(err.code);
  });
});

router.delete('/:id', (req, res) => {
  dishBl.delete(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
      res.sendStatus(err.code);
  });
});

module.exports = router;
