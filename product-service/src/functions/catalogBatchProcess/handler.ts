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

  try {
    await db.connect();
    const products = event.Records.map(({ body }) => JSON.parse(body));

    await sns.publish({
      Subject: 'Successfully',
      Message: JSON.stringify(products),
      TopicArn: process.env.SNS_ARN,
    }).promise();
  } catch {
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
