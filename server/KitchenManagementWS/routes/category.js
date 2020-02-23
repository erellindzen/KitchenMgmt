const express = require('express');
const router = express.Router();
const categoryBl = require('../bl/category');

router.get('/', (req, res) => {
  categoryBl.getAll()
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
    });
});

router.get('/:id', (req, res) => {
  categoryBl.getById(req.params.id)
      .then(data => res.send(data))
      .catch(err => {
        console.log(err.msg);
        res.sendStatus(err.code);
      });
});

router.post('/', (req, res) => {
  categoryBl.create(req.body.title, req.body.image)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

router.put('/', (req, res) => {
  categoryBl.update(req.body.id, req.body.title, req.body.image)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

router.delete('/:id', (req, res) => {
  categoryBl.delete(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err.msg);
      res.sendStatus(err.code);
  });
});

module.exports = router;
