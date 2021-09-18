import 'source-map-support/register';

import type { APIGatewayProxyEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { HttpStatusCode, IResponse } from '@models/response.model';
import { BUCKET_NAME, REGION } from '@libs/constants';

const importProductsFile = async (event: APIGatewayProxyEvent): Promise<IResponse> => {
  try {
    const { name } = event.queryStringParameters;

    if (name) {
      const s3 = new S3({ region: REGION });
      const params = {
        Bucket: BUCKET_NAME,
        Key: `uploaded/${name}`,
        Expires: 60,
        ContentType: 'text/csv',
      };
      const url = await s3.getSignedUrlPromise('putObject', params);
  
      return formatJSONResponse(url, HttpStatusCode.OK);
    }

    return formatJSONResponse({ message: 'Bad request' }, HttpStatusCode.BAD_REQUEST);
  } catch {
    return formatJSONResponse({
      message: 'Internal server error',
    }, HttpStatusCode.INTERNAL_SERVER)
  }
}

export const main = middyfy(importProductsFile);
