import express from 'express';
// Sesuaikan path import controller Anda
import * as BillingController from '../controllers/transaksiBillingController.js'; 

const router = express.Router();


router.get('/', BillingController.getAllBilling);
router.post('/', BillingController.createBilling);
router.get('/:id', BillingController.getBillingById);
router.put('/:id', BillingController.updateBilling);
router.delete('/:id', BillingController.deleteBilling);
router.get('/klien/:klienId', BillingController.getBillingByKlien);

router.get('/projek/:projekId', BillingController.getBillingByProjek);


export default router;