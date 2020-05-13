const express = require('express');
const router = express.Router();
const multer = require('multer');
var path = require('path')

const dishBl = require('../bl/dish');

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'media/dish/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' +  new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname))
  }
})
 
const upload = multer({ storage: storage })

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

router.post('/', upload.single('videoGuide'), (req, res) => {
  console.log(req.body, req.file);
  dishBl.create(req.body.title, 
                req.body.preperationSteps, 
                req.body.duration, 
                req.body.ingredients, 
                req.body.numberOfDines, 
                req.body.imageUrl, 
                req.body.categoryId,
                req.file.path)
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
