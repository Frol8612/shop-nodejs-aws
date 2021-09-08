import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import {
  IProduct, IResponse, HttpStatusCode, IMessage, IEvent,
} from '@models';
import { getResponse } from '@libs/handlerResponse';
import { db } from '@db';

const getProductsById = async (event: IEvent<null>): Promise<IResponse> => {
  console.log(event);

  try {
    const { productId } = event.pathParameters;
    const patternId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;

    await db.connect();

    if (productId && patternId.test(productId)) {
      const { rows: [product] } = await db.query<IProduct>(`
        select p.id, p.title, p.description, p.price, s.count
        from product p
        inner join stock s on p.id = s.product_id
        where p.id = $1;
      `, [productId]);

      if (product) {
        return getResponse<IProduct>(product, HttpStatusCode.OK);
      }

      return getResponse<IMessage>({ message: 'Product not found' }, HttpStatusCode.NOT_FOUND);
    }

    return getResponse<IMessage>({ message: 'Bad request, productId should contain numbers and letters' }, HttpStatusCode.BAD_REQUEST);
  } catch {
    return getResponse<IMessage>({ message: 'Internal server error' }, HttpStatusCode.INTERNAL_SERVER);
  } finally {
    await db.end();
  }
};

export const main = middyfy(getProductsById);
