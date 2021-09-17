import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true,
            }
          }
        }
      }
    },
    // {
    //   s3: {
    //     bucket: bucketName,
    //     event: 's3:ObjectCreated:*',
    //     rules: [
    //       {
    //         prefix: 'uploaded/',
    //         suffix: '.csv',
    //       }
    //     ],
    //     existing: true,
    //   }
    // }
  ]
}
