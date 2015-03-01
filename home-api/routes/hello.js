var express = require('express');
var router = express.Router();

router.get('/hello', function(req, res, next){
	res.render('hello', {title: 'hello'});
});
module.exports = router;
