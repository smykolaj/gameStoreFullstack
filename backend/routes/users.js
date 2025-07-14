var express = require('express');
var router = express.Router();

/* GET users listing. */
const usersController = require('../controllers/usersController');

router.get('/', usersController.getAllUsers);
router.get('/me', usersController.getLoggedInData);
router.post('/', usersController.postUser);
router.delete('/:id', usersController.deleteUser);
router.patch('/:id', usersController.patchUser);
router.get('/:id',usersController.getUser);
router.post('/login',usersController.login);
router.post('/logout',usersController.logout);
router.post('/promoteAdmin/:id', usersController.promoteAdmin);
router.post('/promoteManager/:id', usersController.promoteManager);




module.exports = router;
