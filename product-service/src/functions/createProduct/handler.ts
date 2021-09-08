import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { getResponse } from '@libs/handlerResponse';
import {
  IResponse, HttpStatusCode, IMessage, IEvent,
} from '@models';
import { db } from '@db';
import schema from './schema';

const createProduct = async (event: IEvent<typeof schema>): Promise<IResponse> => {
  console.log(event);

  try {
    const {
      title = '', description = '', price = 0, count = 0,
    } = event.body;

    await db.connect();
    await db.query('begin');

    const insertProductText = 'insert into product (title, description, price) VALUES($1, $2, $3) returning id';
    const insertStockText = 'insert into stock (product_id, count) VALUES ($1, $2)';
    const { rows: [product] } = await db.query(insertProductText, [title, description, price]);

    await db.query(insertStockText, [product.id, count]);
    await db.query('commit');

    return getResponse<IMessage>({ message: 'The product was created' }, HttpStatusCode.OK);
  } catch {
    await db.query('rollback');

    return getResponse<IMessage>({ message: 'Internal server error' }, HttpStatusCode.INTERNAL_SERVER);
  } finally {
    await db.end();
  }
};

export const main = middyfy(createProduct);
