import 'source-map-support/register';

import type { S3Event } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parse';

import { middyfy } from '@libs/lambda';
import { BUCKET_NAME, REGION } from '@libs/constants';

const importFileParser = async (event: S3Event): Promise<void> => {
  const s3 = new S3({ region: REGION });
  const sqs = new SQS();

  event.Records.forEach((record) => {
    const s3Stream = s3.getObject({
      Bucket: BUCKET_NAME,
      Key: record.s3.object.key,
    }).createReadStream();

    s3Stream
      .pipe(csv({ columns: true, skip_empty_lines: true, bom: true }))
      .on('data', (data) => {
        sqs.sendMessage({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(data),
        }, () => console.log('Send email:', data));
      })
      .on('end', async () => {
        console.log(`Copy from ${BUCKET_NAME}/${record.s3.object.key}`);

        await s3.copyObject({
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace('uploaded', 'parsed'),
        }).promise();

        console.log(`Copied into ${BUCKET_NAME}/${record.s3.object.key.replace('uploaded', 'parsed')}`);
      });
  });
};

export const main = middyfy(importFileParser);
