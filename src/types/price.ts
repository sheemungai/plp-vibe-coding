import { z } from 'zod';

export interface PriceEntry {
    _id?: string;
    productName: string;
    supplierName: string;
    price: number;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export const createPriceSchema = z.object({
    productName: z.string().min(1, 'Product name is required'),
    supplierName: z.string().min(1, 'Supplier name is required'),
    price: z.number().positive('Price must be positive'),
    date: z.string().transform((str) => new Date(str))
});

export const updatePriceSchema = createPriceSchema.partial();

export type CreatePriceInput = z.infer<typeof createPriceSchema>;
export type UpdatePriceInput = z.infer<typeof updatePriceSchema>; 