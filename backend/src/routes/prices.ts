import express, { Request, Response } from 'express';
import PriceEntry from '../models/PriceEntry';

const router = express.Router();

// POST /api/prices - Add a new price entry
router.post('/', async (req: Request, res: Response) => {
    try {
        const priceEntry = new PriceEntry(req.body);
        await priceEntry.save();
        res.status(201).json(priceEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/prices - Get all price entries with optional product name filter
router.get('/', async (req: Request, res: Response) => {
    try {
        const { productName } = req.query;
        const query = productName 
            ? { productName: { $regex: productName, $options: 'i' } }
            : {};
        
        const entries = await PriceEntry.find(query).sort({ date: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 