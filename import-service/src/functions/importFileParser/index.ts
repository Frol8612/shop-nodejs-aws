import { handlerPath } from '@libs/handlerResolver';
import { BUCKET_NAME } from '@libs/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [
          { prefix: 'uploaded/' },
          { suffix: '.csv' },
        ],
        existing: true,
      },
    },
  ],
};
