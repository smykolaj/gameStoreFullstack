var express = require('express');
var router = express.Router();


/* GET games listing. */

const gamesController = require('../controllers/gamesController');

router.get('/', gamesController.getAllGames);
router.post('/', gamesController.postGame);
router.delete('/:id', gamesController.deleteGame);
router.patch('/:id', gamesController.patchGame);
router.get('/:id',gamesController.getGame);


module.exports = router;
