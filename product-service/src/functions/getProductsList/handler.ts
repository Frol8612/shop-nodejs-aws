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

  await db.query(`
  create table if not exists product (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price integer
  );`);
  await db.query(`
  create table if not exists stock (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid,
    count integer,
    foreign key ("product_id") references "product" ("id")
  );`);

  try {
    const { rows: products } = await db.query<IProduct>('select * from product');

    return getResponse<IProduct[]>(products, HttpStatusCode.OK);
  } catch {
    return getResponse<IErrorMessage>({ message: 'Internal server error' }, HttpStatusCode.INTERNAL_SERVER);
  } finally {
    db.end();
  }
};

export const main = middyfy(getProductsList);
