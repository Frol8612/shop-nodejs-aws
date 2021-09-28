import { Handler } from 'aws-lambda';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

import * as lambda from '@libs/lambda';
import { HttpStatusCode } from '@models/response.model';

describe('importProductsFile', () => {
  let main;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  beforeEach(async () => {
    jest.spyOn(lambda, 'middyfy').mockImplementation((handler: Handler) => handler as never);
    AWSMock.setSDKInstance(AWS);

    main = (await import('./handler')).main;
  });

  afterEach(() => {
    AWSMock.restore('S3');
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

    expect(await main({ queryStringParameters: { name } })).toEqual(expectedResult);
  });

  it('should return error message with status 400', async () => {
    const name = 'name-1';
    const expectedResult = {
      body: JSON.stringify({ message: 'Bad request' }),
      statusCode: HttpStatusCode.BAD_REQUEST,
      headers,
    } as any;

    AWSMock.mock('S3', 'getSignedUrl', (_: any, __: any, callback: any) => callback(null, name));

    expect(await main({ queryStringParameters: {} })).toEqual(expectedResult);
  });

  it('should return error message with status 500', async () => {
    const name = 'name-1';
    const expectedResult = {
      body: JSON.stringify({ message: 'Internal server error' }),
      statusCode: HttpStatusCode.INTERNAL_SERVER,
      headers,
    } as any;

    AWSMock.mock('S3', 'getSignedUrl', (_: any, __: any, callback: any) => callback('error'));

    expect(await main({ queryStringParameters: { name } })).toEqual(expectedResult);
  });
});
