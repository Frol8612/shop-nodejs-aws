import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { getResponse } from '@libs/handlerResponse';
import {
  IProduct, IResponse, HttpStatusCode, IMessage, IEvent,
} from '@models';
import { getDb } from '@db';

const getProductsList = async (event: IEvent<null>): Promise<IResponse> => {
  const db = getDb();
  console.log(event);

  try {
    await db.connect();

    const { rows: products } = await db.query<IProduct>(`
      select p.id, p.title, p.description, p.price, s.count
      from product p
      inner join stock s on p.id = s.product_id;
    `);

    return getResponse<IProduct[]>(products, HttpStatusCode.OK);
  } catch {
    return getResponse<IMessage>({ message: 'Internal server error' }, HttpStatusCode.INTERNAL_SERVER);
  } finally {
    await db.end();
  }
};

export const main = middyfy(getProductsList);
