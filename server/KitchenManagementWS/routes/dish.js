const express = require('express');
const router = express.Router();
const dishBl = require('../bl/dish');

router.get('/', (req, res) => {
  dishBl.getAll()
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

router.get('/category/:categoryId', (req, res) => {
  dishBl.getByCategoryId(req.params.categoryId)
      .then(data => res.send(data))
      .catch(err => {
        res.sendStatus(err.code);
      });
});

router.post('/', (req, res) => {
  dishBl.create(req.body.title, 
                req.body.preperationSteps, 
                req.body.duration, 
                req.body.ingredients, 
                req.body.numberOfDines, 
                req.body.imageUrl, 
                req.body.categoryId)
    .then(data => res.send(data))
    .catch(err => {
      res.sendStatus(err.code);
  });
});

router.put('/', (req, res) => {
  dishBl.update(req.body.id, 
                req.body.title, 
                req.body.preperationSteps, 
                req.body.duration, 
                req.body.ingerdients, 
                req.body.numberOfDines, 
                req.body.imageUrl, 
                req.body.categoryId)
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
