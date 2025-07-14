var express = require('express');
var router = express.Router();

/* GET purchases listing. */
const purchasesController = require('../controllers/purchasesController');

router.get('/', purchasesController.getAllPurchases);
router.post('/', purchasesController.postPurchase);
router.delete('/:id', purchasesController.deletePurchase);
router.patch('/:id', purchasesController.patchPurchase);
router.get('/:id',purchasesController.getPurchase);


module.exports = router;
