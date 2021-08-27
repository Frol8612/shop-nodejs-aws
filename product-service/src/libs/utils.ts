import products from '@assets/products.json'
import { IProduct } from '@models';

export const getProducts = (): IProduct[] => products;
