import 'source-map-support/register';

import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';

import { middyfy } from '@libs/lambda';
import { getDb } from '@db';
import { REGION } from '@libs/constants';

const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  const db = getDb();
  const sns = new SNS({ region: REGION });
  console.log(event);

  const expand = (row: number, column: number) => {
    let i = 1;
    const col = () => Array(column).fill(0).map(() => `$${i++}`).join(', ');
    return Array(row).fill(0).map(() => `(${col()})`).join(', ');
  };

  try {
    await db.connect();
    await db.query('begin');

    const products = event.Records.map(({ body }) => JSON.parse(body));
    const maxCount = Math.max(...products.map(({ count }) => Number(count)));
    const insertProductText = `
      insert into product (title, description, price) values ${expand(products.length, 3)}
      on conflict (title) do update
      set description = EXCLUDED.description,
      price = EXCLUDED.price
      returning *;
    `;
    const productsFlat = products
      .map(({ title, description, price }) => [title, description, price])
      .flat();

    const { rows } = await db.query(insertProductText, productsFlat);

    const stocks = rows
      .map((el) => [el.id, products.find((p) => p.title === el.title).count])
      .flat();
    const insertStockText = `
      insert into stock (product_id, count) values ${expand(products.length, 2)}
      on conflict (product_id) do update
      set count = EXCLUDED.count;
    `;

    await db.query(insertStockText, stocks);
    await db.query('commit');

    await sns.publish({
      Subject: 'Successfully',
      Message: JSON.stringify(products),
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        count: {
          DataType: 'Number',
          StringValue: String(maxCount),
        },
      },
    }).promise();
  } catch {
    await db.query('rollback');
    await sns.publish({
      Subject: 'Error',
      Message: 'Internal server error',
      TopicArn: process.env.SNS_ARN,
    }).promise();
  } finally {
    await db.end();
  }
};

export const main = middyfy(catalogBatchProcess);
