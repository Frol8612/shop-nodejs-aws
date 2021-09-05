import products from '@assets/products.json';
import { IProduct } from '@models';

export const getProducts = (): IProduct[] => products;
export const getProduct = (id: string): IProduct => products.find((p) => p.id === id);
