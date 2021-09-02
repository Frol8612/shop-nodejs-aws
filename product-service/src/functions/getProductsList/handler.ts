import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
// import { getProducts } from '@libs/getData';
import { getResponse } from '@libs/handlerResponse';
import {
  IProduct, IResponse, HttpStatusCode, IErrorMessage,
} from '@models';
import { db } from '@db';

const getProductsList = async (): Promise<IResponse> => {
  await db.connect();

  try {
    const { rows: products } = await db.query<IProduct>('select * from product');
    // const { rows: counts } = await db.query<Record<string, number>>('select * from stock');

    return getResponse<IProduct[]>(products, HttpStatusCode.OK);
  } catch {
    return getResponse<IErrorMessage>({ message: 'Internal server error' }, HttpStatusCode.INTERNAL_SERVER);
  } finally {
    db.end();
  }
};

export const main = middyfy(getProductsList);
