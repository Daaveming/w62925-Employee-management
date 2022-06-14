const express = require('express');
const router = express.Router(); 
const userControll = require('../controllers/userControll');

// create, find, update, delete
router.get('/', userControll.view);
router.post('/', userControll.find);
router.get('/delete/:id', userControll.delete);
router.get('/add', userControll.form);
router.post('/add', userControll.create);
router.get('/edit/:id', userControll.edit)
router.post('/edit/:id', userControll.update);
router.get('/viewemployee/:id', userControll.viewemployee);
router.get('/viewdeleted', userControll.viewdeleted)



module.exports = router;