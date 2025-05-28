import { Router } from 'express';
import {
    createPrice,
    getPrices,
    getPriceById,
    updatePrice,
    deletePrice
} from '../controllers/priceController';

const router = Router();

router.post('/', createPrice);
router.get('/', getPrices);
router.get('/:id', getPriceById);
router.put('/:id', updatePrice);
router.delete('/:id', deletePrice);

export default router; 