import 'source-map-support/register';

import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

import { middyfy } from '@libs/lambda';
import { getResponse } from '@libs/handlerResponse';
import { IResponse, HttpStatusCode, IMessage } from '@models';
import { db } from '@db';
import schema from './schema';

type Event<T> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<T> };

const createProduct = async (event: Event<typeof schema>): Promise<IResponse> => {
  try {
    await db.connect();

    const {
      title = '', description = '', price = 0, count = 0,
    } = event.body;

    await db.query(`
      with i as (
        insert into product (title, description, price)
        values ('${title}', '${description}', ${price})
        returning id
      )
      insert into stock (product_id, count)
      select id, ${count}
      from i;
    `);

    return getResponse<IMessage>({ message: 'The product was created' }, HttpStatusCode.OK);
  } catch {
    return getResponse<IMessage>({ message: 'Internal server error' }, HttpStatusCode.INTERNAL_SERVER);
  } finally {
    await db.end();
  }
};

export const main = middyfy(createProduct);
