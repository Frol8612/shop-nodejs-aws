import { Handler } from 'aws-lambda';
import AWSMock from 'aws-sdk-mock';

import * as lambda from '@libs/lambda';
import { HttpStatusCode } from '@models/response.model';

AWSMock.setSDK('aws-sdk');

describe('importProductsFile', () => {
  let main;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  beforeEach(async () => {
    jest.spyOn(lambda, 'middyfy').mockImplementation((handler: Handler) => handler as never);

    main = (await import('./handler')).main;
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should return url with status 200', async () => {
    const name = 'name-1';
    const expectedResult = {
      body: JSON.stringify(name),
      statusCode: HttpStatusCode.OK,
      headers,
    } as any;

    AWSMock.mock('S3', 'getSignedUrl', (_: any, __: any, callback: any) => callback(null, name));

    expect(await main({ queryStringParameters: { name }})).toEqual(expectedResult);
  });

  // it('should return error message with status 500', async () => {
  //   const expectedResult = {
  //     body: JSON.stringify({ message: 'Internal server error' }),
  //     statusCode: HttpStatusCode.INTERNAL_SERVER,
  //     headers,
  //   } as any;

  //   expect(await main({})).toEqual(expectedResult);
  // });
});
