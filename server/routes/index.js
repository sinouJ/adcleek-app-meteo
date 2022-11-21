var express = require('express');
var router = express.Router();
const { cities, forecast } = require('../controllers/indexController');

router.get('/', (req, res, next) => {
  res.send('index');
});

router.get('/cities', cities);
router.get('/forecast', forecast);

module.exports = router;
