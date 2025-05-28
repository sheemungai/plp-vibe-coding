import { Request, Response } from 'express';
import { priceEntries } from '../models/Price';
import { CreatePriceInput, UpdatePriceInput, createPriceSchema, updatePriceSchema } from '../types/price';
import { v4 as uuidv4 } from 'uuid';

export const createPrice = (req: Request, res: Response) => {
    try {
        const validatedData = createPriceSchema.parse(req.body);
        const newEntry = {
            ...validatedData,
            _id: uuidv4(),
            date: new Date(validatedData.date),
        };
        priceEntries.push(newEntry);
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid input' });
    }
};

export const getPrices = (req: Request, res: Response) => {
    try {
        const { productName, supplierName } = req.query;
        let results = [...priceEntries];
        if (productName) {
            results = results.filter(entry => entry.productName.toLowerCase().includes((productName as string).toLowerCase()));
        }
        if (supplierName) {
            results = results.filter(entry => entry.supplierName.toLowerCase().includes((supplierName as string).toLowerCase()));
        }
        // Sort by date descending
        results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch prices' });
    }
};

export const getPriceById = (req: Request, res: Response) => {
    try {
        const price = priceEntries.find(entry => entry._id === req.params.id);
        if (!price) {
            return res.status(404).json({ error: 'Price entry not found' });
        }
        res.json(price);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch price entry' });
    }
};

export const updatePrice = (req: Request, res: Response) => {
    try {
        const validatedData = updatePriceSchema.parse(req.body);
        const index = priceEntries.findIndex(entry => entry._id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Price entry not found' });
        }
        priceEntries[index] = {
            ...priceEntries[index],
            ...validatedData,
            date: new Date(validatedData.date),
        };
        res.json(priceEntries[index]);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid input' });
    }
};

export const deletePrice = (req: Request, res: Response) => {
    try {
        const index = priceEntries.findIndex(entry => entry._id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Price entry not found' });
        }
        const deleted = priceEntries.splice(index, 1);
        res.json({ message: 'Entry deleted', entry: deleted[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete price entry' });
    }
}; 